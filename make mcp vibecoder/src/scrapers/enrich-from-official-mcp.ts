/**
 * Official Make MCP Schema Enricher
 *
 * Reads data/official-mcp-schemas.json and upserts module schemas with
 * the highest-priority source: 'official-mcp'.
 *
 * The JSON file is built during Claude sessions by querying the official
 * Make MCP tools (mcp__make__app-module_get) and is committed to the repo
 * as a static data asset that grows over time.
 *
 * JSON format:
 * {
 *   "google-sheets:addRow": {
 *     "name": "Add a Row",
 *     "description": "...",
 *     "type": "action",
 *     "app": "Google Sheets",
 *     "connection_type": "account:google",
 *     "parameters": [...],
 *     "output_fields": [...]
 *   }
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MakeDatabase } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMAS_PATH = path.join(__dirname, '..', '..', 'data', 'official-mcp-schemas.json');

export interface EnrichmentResult {
    updated: number;
    skipped: number;
    errors: number;
}

export function enrichModulesFromOfficialMcp(db: MakeDatabase): EnrichmentResult {
    if (!fs.existsSync(SCHEMAS_PATH)) {
        console.log('  ℹ️  data/official-mcp-schemas.json not found, skipping official MCP enrichment');
        return { updated: 0, skipped: 0, errors: 0 };
    }

    let schemas: Record<string, any>;
    try {
        const raw = fs.readFileSync(SCHEMAS_PATH, 'utf-8');
        schemas = JSON.parse(raw);
    } catch (e: any) {
        console.error(`  ❌ Failed to parse official-mcp-schemas.json: ${e.message}`);
        return { updated: 0, skipped: 0, errors: 1 };
    }

    const entries = Object.entries(schemas);
    if (entries.length === 0) {
        console.log('  ℹ️  official-mcp-schemas.json is empty, nothing to enrich');
        return { updated: 0, skipped: 0, errors: 0 };
    }

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const [moduleId, schema] of entries) {
        try {
            const changes = db.enrichModuleSchema(moduleId, {
                parameters: schema.parameters ?? undefined,
                connection_type: schema.connection_type ?? undefined,
                schema_source: 'official-mcp',
            });

            // enrichModuleSchema only updates parameters/connection_type, but for official-mcp
            // we also want to update name, description, type, output_fields if the module exists.
            // Do a targeted update for those fields.
            if (changes > 0) {
                db.updateModuleMetadata(moduleId, {
                    name: schema.name,
                    description: schema.description,
                    type: schema.type,
                    output_fields: schema.output_fields,
                });
                updated++;
            } else {
                // Module may not be in DB yet — insert it
                if (schema.name && schema.app && schema.type) {
                    db.insertModule({
                        id: moduleId,
                        name: schema.name,
                        app: schema.app,
                        type: schema.type,
                        description: schema.description || '',
                        parameters: schema.parameters || [],
                        connection_type: schema.connection_type || null,
                        output_fields: schema.output_fields || null,
                        schema_source: 'official-mcp',
                    });
                    updated++;
                } else {
                    skipped++;
                }
            }
        } catch {
            errors++;
        }
    }

    return { updated, skipped, errors };
}

// ============================================================================
// STANDALONE RUN
// ============================================================================

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? '');
if (isMain) {
    const db = new MakeDatabase();
    console.log('🔄 Enriching modules from official Make MCP schemas...\n');
    const result = enrichModulesFromOfficialMcp(db);
    console.log(`\n✅ Updated: ${result.updated} modules`);
    console.log(`   Skipped: ${result.skipped}`);
    if (result.errors > 0) console.log(`⚠️  Errors: ${result.errors}`);
    db.close();
}
