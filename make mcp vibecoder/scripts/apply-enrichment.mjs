/**
 * apply-enrichment.mjs
 * Reads /tmp/enrichment.json and writes it into the SQLite DB.
 * Format: [{id, output_fields, connection_type, is_deprecated, isNew, name, app, type, description}]
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'make-modules.db');
const DATA_PATH = process.argv[2] || '/tmp/enrichment.json';

const db = new Database(DB_PATH);

const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
console.log(`Applying ${data.length} enrichment records...`);

// Ensure new columns exist
const cols = db.prepare("PRAGMA table_info(modules)").all().map(c => c.name);
if (!cols.includes('output_fields')) db.exec("ALTER TABLE modules ADD COLUMN output_fields TEXT");
if (!cols.includes('connection_type')) db.exec("ALTER TABLE modules ADD COLUMN connection_type TEXT");
if (!cols.includes('is_deprecated')) db.exec("ALTER TABLE modules ADD COLUMN is_deprecated INTEGER DEFAULT 0");

const upsert = db.prepare(`
  INSERT INTO modules (id, name, app, type, description, parameters, examples, documentation, output_fields, connection_type, is_deprecated)
  VALUES (?, ?, ?, ?, ?, '[]', '[]', '', ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    output_fields = COALESCE(excluded.output_fields, output_fields),
    connection_type = COALESCE(excluded.connection_type, connection_type),
    is_deprecated = excluded.is_deprecated
`);

const insertFts = db.prepare(`INSERT OR IGNORE INTO modules_fts(module_id, name, app, description) VALUES (?, ?, ?, ?)`);

let enriched = 0, added = 0;
const run = db.transaction(() => {
  for (const r of data) {
    const existing = db.prepare('SELECT id FROM modules WHERE id = ?').get(r.id);
    const ofJson = r.output_fields?.length ? JSON.stringify(r.output_fields) : null;
    const ct = r.connection_type || null;
    const dep = r.is_deprecated ? 1 : 0;

    if (existing) {
      db.prepare(`UPDATE modules SET output_fields=COALESCE(?,output_fields), connection_type=COALESCE(?,connection_type), is_deprecated=? WHERE id=?`)
        .run(ofJson, ct, dep, r.id);
      enriched++;
    } else {
      upsert.run(r.id, r.name, r.app, r.type || 'action', r.description || r.name, ofJson, ct, dep);
      insertFts.run(r.id, r.name, r.app, r.description || r.name);
      added++;
    }
  }
});
run();

db.close();
console.log(`Done. Enriched: ${enriched}, New: ${added}`);
