/**
 * scrape-from-api.ts
 *
 * Enriches the Make modules DB with data from the official Make Apps API:
 *   - output_fields: what fields a module emits (for {{moduleId.field}} mapping)
 *   - connection_type: e.g. "account:google"
 *   - is_deprecated: boolean flag
 *   - New modules not yet in the DB are inserted
 *
 * Usage: npm run enrich
 */

import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { MakeDatabase } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

// ── Config ─────────────────────────────────────────────────────────────────

const API_KEY = process.env['MAKE_API_KEY'] || '';
const BASE_URL = process.env['MAKE_API_URL'] || 'https://eu1.make.com/api/v2';
const ORG_ID = process.env['MAKE_ORGANIZATION_ID'] || '';
// 60 req/min = 1 req/sec. With concurrency=1 and 1100ms delay we stay safely under.
const DELAY_MS = 1100;
const CONCURRENCY = 1;

if (!API_KEY) {
    console.error('MAKE_API_KEY not set. Cannot enrich from API.');
    process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T | null> {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 404 || status === 403) return null;
            if (status === 429) {
                // Rate limited — back off progressively
                const backoff = 60_000 * (i + 1);
                console.warn(`  ⚠ Rate limited (429). Waiting ${backoff / 1000}s before retry ${i + 1}/${retries}...`);
                await sleep(backoff);
            } else if (i < retries) {
                await sleep(2000 * (i + 1));
            }
        }
    }
    return null;
}

const headers = (extraOrgId?: string) => ({
    Authorization: `Token ${API_KEY}`,
    ...(ORG_ID || extraOrgId ? { 'x-imt-organization-id': extraOrgId || ORG_ID } : {}),
});

// ── Phase A: Build app version map ─────────────────────────────────────────

async function buildAppVersionMap(db: MakeDatabase): Promise<Map<string, number>> {
    const map = new Map<string, number>();

    // Extract app slugs from existing DB module IDs.
    // Default all to version 2 (most current Make apps); fetchModuleList will
    // fall back to version 1 if v2 returns 404.
    console.log('Phase A: Building app version map from existing DB...');
    const existingModules = db.searchModules('*');
    for (const mod of existingModules) {
        const slug = mod.id.split(':')[0];
        if (slug && !map.has(slug)) {
            map.set(slug, 2);
        }
    }
    console.log(`  Found ${map.size} unique app slugs from DB (defaulting to version 2)`);
    return map;
}

// ── Phase B: Fetch module lists ─────────────────────────────────────────────

interface ApiModuleEntry {
    name: string;
    label?: string;
    typeId?: number;
    deprecated?: boolean;
}

async function fetchModuleList(appName: string, version: number): Promise<{ modules: ApiModuleEntry[]; version: number } | null> {
    // Try the given version first (usually 2), then fall back to 1
    const versions = version === 1 ? [1] : [version, 1];
    for (const v of versions) {
        await sleep(DELAY_MS);
        const res = await withRetry(() =>
            axios.get(`${BASE_URL}/apps/${appName}@${v}/modules`, { headers: headers() })
        );
        if (res?.data?.appModules) return { modules: res.data.appModules, version: v };
        if (res?.data?.modules) return { modules: res.data.modules, version: v };
    }
    return null;
}

// ── Phase C: Fetch module details ───────────────────────────────────────────

interface ApiModuleDetail {
    name: string;
    label?: string;
    interface?: Array<{ name: string; type: string; label?: string }>;
    parameters?: Array<{ name: string; type: string; [k: string]: any }>;
    scope?: string[];
    deprecated?: boolean;
    _annotations?: { moduleType?: string };
}

async function fetchModuleDetail(appName: string, version: number, moduleName: string): Promise<ApiModuleDetail | null> {
    const res = await withRetry(() =>
        axios.get(`${BASE_URL}/apps/${appName}@${version}/modules/${moduleName}`, {
            headers: headers(),
            params: { format: 'json' },
        })
    );
    if (res?.data?.appModule) return res.data.appModule;
    if (res?.data?.name) return res.data as ApiModuleDetail;
    return null;
}

// ── Utilities ──────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
    return result;
}

function moduleTypeFromAnnotation(typeId?: number, annotation?: string): string {
    if (annotation === 'trigger' || typeId === 1) return 'trigger';
    if (annotation === 'instant_trigger' || typeId === 10) return 'trigger';
    if (annotation === 'search' || typeId === 9) return 'search';
    if (annotation === 'action' || typeId === 4) return 'action';
    return 'action';
}

function extractConnectionType(parameters?: any[]): string | undefined {
    if (!parameters) return undefined;
    for (const p of parameters) {
        if (typeof p.type === 'string' && p.type.startsWith('account:')) return p.type;
    }
    return undefined;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
    const dbPath = path.join(PACKAGE_ROOT, 'data', 'make-modules.db');
    const db = new MakeDatabase(dbPath);

    // Run DB migrations for new columns (schema.sql uses CREATE TABLE IF NOT EXISTS,
    // so we need to ADD COLUMN if they don't exist yet)
    await addMissingColumns(db);

    const appVersionMap = await buildAppVersionMap(db);

    console.log('\nPhase B+C: Fetching module lists and details...');
    let totalNew = 0;
    let totalEnriched = 0;
    let totalFailed = 0;

    const appEntries = Array.from(appVersionMap.entries());
    const appBatches = chunk(appEntries, CONCURRENCY);

    for (const batch of appBatches) {
        await Promise.all(batch.map(async ([appName, version]) => {
            const result = await fetchModuleList(appName, version);
            if (!result) {
                totalFailed++;
                return;
            }
            const { modules: moduleList, version: workingVersion } = result;

            for (const entry of moduleList) {
                await sleep(DELAY_MS);
                const detail = await fetchModuleDetail(appName, workingVersion, entry.name);
                if (!detail) continue;

                const outputFields = (detail.interface || []).map((f) => ({
                    name: f.name,
                    type: f.type,
                    label: f.label || f.name,
                }));
                const connectionType = extractConnectionType(detail.parameters);
                const isDeprecated = Boolean(detail.deprecated ?? entry.deprecated);

                const moduleId = `${appName}:${entry.name}`;
                const existing = db.getModule(moduleId);

                if (existing) {
                    const enrichment: { output_fields?: any[]; connection_type?: string; is_deprecated?: boolean } = {
                        is_deprecated: isDeprecated,
                    };
                    if (outputFields.length > 0) enrichment.output_fields = outputFields;
                    if (connectionType) enrichment.connection_type = connectionType;
                    db.enrichModule(moduleId, enrichment);
                    totalEnriched++;
                } else {
                    // Insert as new module
                    const typeStr = moduleTypeFromAnnotation(
                        entry.typeId,
                        detail._annotations?.moduleType
                    );
                    const appLabel = appName.charAt(0).toUpperCase() + appName.slice(1).replace(/-/g, ' ');
                    db.insertModule({
                        id: moduleId,
                        name: detail.label || entry.label || entry.name,
                        app: appLabel,
                        type: typeStr,
                        description: detail.label || entry.label || entry.name,
                        parameters: [],
                        examples: [],
                        documentation: '',
                        output_fields: outputFields.length > 0 ? outputFields : undefined,
                        connection_type: connectionType,
                        is_deprecated: isDeprecated,
                    });
                    totalNew++;
                }
            }

            console.log(`  ✓ ${appName}@${workingVersion}: ${moduleList.length} modules`);
        }));

        await sleep(DELAY_MS);
    }

    db.close();

    console.log('\n── Enrichment complete ──────────────────────────────');
    console.log(`  Enriched: ${totalEnriched}`);
    console.log(`  New:      ${totalNew}`);
    console.log(`  Failed:   ${totalFailed}`);
    console.log('─────────────────────────────────────────────────────');
}

/**
 * Add new columns to the existing DB if the schema was already created without them.
 * SQLite doesn't support adding multiple columns in one ALTER TABLE.
 */
async function addMissingColumns(db: MakeDatabase) {
    // Access the raw database via a side-channel: re-open with better-sqlite3
    const Database = (await import('better-sqlite3')).default;
    const dbPath = path.join(PACKAGE_ROOT, 'data', 'make-modules.db');
    const raw = new Database(dbPath);

    const cols = raw.prepare("PRAGMA table_info(modules)").all() as any[];
    const colNames = new Set(cols.map((c) => c.name));

    if (!colNames.has('output_fields')) {
        raw.exec("ALTER TABLE modules ADD COLUMN output_fields TEXT");
        console.log('  Added column: output_fields');
    }
    if (!colNames.has('connection_type')) {
        raw.exec("ALTER TABLE modules ADD COLUMN connection_type TEXT");
        console.log('  Added column: connection_type');
    }
    if (!colNames.has('is_deprecated')) {
        raw.exec("ALTER TABLE modules ADD COLUMN is_deprecated INTEGER DEFAULT 0");
        console.log('  Added column: is_deprecated');
    }

    raw.close();
}

main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
