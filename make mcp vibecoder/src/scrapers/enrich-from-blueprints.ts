/**
 * Blueprint Metadata Enricher
 *
 * Scans all blueprint JSON files and extracts accurate parameter schemas
 * from node metadata (metadata.parameters + metadata.expect).
 *
 * Updates the modules table with:
 *   - parameters: union of all params seen across blueprints for that module
 *   - connection_type: extracted from __IMTCONN__ parameter type
 *   - schema_source: 'blueprint-extracted'
 *
 * Does NOT downgrade modules already marked 'official-mcp'.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MakeDatabase } from '../database/db.js';
import { mapParameter } from './module-mapping.js';
import type { BlueprintParameter, MappedParameter } from './module-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// TYPES
// ============================================================================

interface AggregatedModule {
    moduleId: string;
    connection_type: string | null;
    /** name → best param definition (prefer version with enum/spec) */
    params: Map<string, MappedParameter>;
    appearance_count: number;
}

export interface EnrichmentResult {
    updated: number;
    skipped: number;
    errors: number;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Same folders as populate-templates.ts */
function getBlueprintFolders(): string[] {
    // From src/scrapers/ → project root is 3 levels up
    const projectRoot = path.join(__dirname, '..', '..', '..');
    const candidates = [
        path.join(projectRoot, 'Make example Blueprints'),
        path.join(projectRoot, 'Make example flows'),
        path.join(projectRoot, 'Make example flows 1'),
        path.join(projectRoot, 'Make example flows 2'),
    ];
    return candidates.filter(f => fs.existsSync(f));
}

/**
 * Choose the "better" of two param definitions.
 * Prefers the one with enum options, then the one with spec, then the existing.
 */
function betterParam(existing: MappedParameter, incoming: MappedParameter): MappedParameter {
    const existingScore =
        (existing.extra?.options ? 2 : 0) +
        (existing.extra?.hasSpec ? 1 : 0);
    const incomingScore =
        (incoming.extra?.options ? 2 : 0) +
        (incoming.extra?.hasSpec ? 1 : 0);
    return incomingScore > existingScore ? incoming : existing;
}

/**
 * Process a single blueprint flow node, accumulating data into the aggregated map.
 */
function processNode(node: any, aggregated: Map<string, AggregatedModule>): void {
    const moduleId: string = node.module;
    if (!moduleId || !moduleId.includes(':')) return;

    // Skip built-in/util modules — they have no meaningful user-configurable params
    const appPart = moduleId.split(':')[0];
    if (['builtin', 'util', 'regexp', 'json', 'xml'].includes(appPart ?? '')) return;

    const meta = node.metadata;
    if (!meta) return;

    // Extract connection_type from __IMTCONN__ in metadata.parameters
    let connectionType: string | null = null;
    const metaParams: BlueprintParameter[] = meta.parameters || [];
    for (const p of metaParams) {
        if (p.name === '__IMTCONN__' && p.type?.startsWith('account:')) {
            connectionType = p.type; // e.g. "account:google"
            break;
        }
    }

    // Collect all non-connection params from BOTH metadata.parameters AND metadata.expect
    const paramSources: BlueprintParameter[] = [
        ...(meta.parameters || []),
        ...(meta.expect || []),
    ];

    const newParams = new Map<string, MappedParameter>();
    for (const bp of paramSources) {
        // Skip connection/hook params
        if (bp.name === '__IMTCONN__' || bp.name === '__IMTHOOK__') continue;
        if (bp.type?.startsWith('account:') || bp.type?.startsWith('hook:')) continue;

        const mapped = mapParameter(bp);
        if (!mapped) continue;

        const existing = newParams.get(mapped.name);
        newParams.set(mapped.name, existing ? betterParam(existing, mapped) : mapped);
    }

    // Merge into aggregated map
    const existing = aggregated.get(moduleId);
    if (existing) {
        existing.appearance_count++;
        if (!existing.connection_type && connectionType) {
            existing.connection_type = connectionType;
        }
        // Merge params: union by name, prefer better definition
        for (const [name, param] of newParams) {
            const prev = existing.params.get(name);
            existing.params.set(name, prev ? betterParam(prev, param) : param);
        }
    } else {
        aggregated.set(moduleId, {
            moduleId,
            connection_type: connectionType,
            params: newParams,
            appearance_count: 1,
        });
    }
}

// ============================================================================
// MAIN ENRICHER
// ============================================================================

export function enrichModulesFromBlueprints(db: MakeDatabase): EnrichmentResult {
    const folders = getBlueprintFolders();
    if (folders.length === 0) {
        console.log('  ⚠️  No blueprint folders found, skipping blueprint enrichment');
        return { updated: 0, skipped: 0, errors: 0 };
    }

    // Phase 1: collect aggregated data from all blueprints
    const aggregated = new Map<string, AggregatedModule>();
    let fileErrors = 0;

    for (const folder of folders) {
        let files: string[];
        try {
            files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));
        } catch {
            continue;
        }
        for (const file of files) {
            try {
                const content = fs.readFileSync(path.join(folder, file), 'utf-8');
                const blueprint = JSON.parse(content);
                for (const node of (blueprint.flow || [])) {
                    processNode(node, aggregated);
                }
            } catch {
                fileErrors++;
            }
        }
    }

    // Phase 2: update DB
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const [moduleId, data] of aggregated) {
        try {
            const params = Array.from(data.params.values());
            const enrichData: Parameters<typeof db.enrichModuleSchema>[1] = {
                schema_source: 'blueprint-extracted',
            };
            if (params.length > 0) enrichData.parameters = params;
            if (data.connection_type) enrichData.connection_type = data.connection_type;
            const changes = db.enrichModuleSchema(moduleId, enrichData);
            if (changes > 0) {
                updated++;
            } else {
                skipped++; // module not in DB or already official-mcp
            }
        } catch {
            errors++;
        }
    }

    if (fileErrors > 0) {
        console.log(`  ⚠️  Blueprint file errors: ${fileErrors}`);
    }
    return { updated, skipped, errors };
}

// ============================================================================
// STANDALONE RUN
// ============================================================================

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? '');
if (isMain) {
    const db = new MakeDatabase();
    console.log('🔄 Enriching modules from blueprint metadata...\n');
    const result = enrichModulesFromBlueprints(db);
    console.log(`\n✅ Updated: ${result.updated} modules`);
    console.log(`   Skipped: ${result.skipped} (not in DB or already official-mcp)`);
    if (result.errors > 0) console.log(`⚠️  Errors: ${result.errors}`);
    db.close();
}
