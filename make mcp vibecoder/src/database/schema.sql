CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    app TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'trigger', 'action', 'search'
    description TEXT,
    parameters TEXT,     -- JSON string of parameter schema
    examples TEXT,       -- JSON string of example configurations
    documentation TEXT,  -- Markdown documentation
    output_fields TEXT,  -- JSON: [{name, type, label}] — what the module emits
    connection_type TEXT,-- e.g. "account:google", "account:slack"
    is_deprecated INTEGER DEFAULT 0,  -- 0 or 1
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_modules_app ON modules(app);
CREATE INDEX IF NOT EXISTS idx_modules_type ON modules(type);
CREATE INDEX IF NOT EXISTS idx_modules_name ON modules(name);

-- Standalone FTS5 table (not external content, avoids rowid/TEXT PK mismatch)
CREATE VIRTUAL TABLE IF NOT EXISTS modules_fts USING fts5(
    module_id,
    name,
    app,
    description
);

CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    blueprint TEXT,      -- JSON string of Make scenario
    modules_used TEXT,   -- JSON array of module IDs
    category TEXT,
    difficulty TEXT,     -- 'beginner', 'intermediate', 'advanced'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_difficulty ON templates(difficulty);
CREATE INDEX IF NOT EXISTS idx_templates_cat_diff ON templates(category, difficulty);

-- Standalone FTS5 table for fast full-text search on templates
CREATE VIRTUAL TABLE IF NOT EXISTS templates_fts USING fts5(
    template_id UNINDEXED,
    name,
    description,
    modules_used
);

CREATE TABLE IF NOT EXISTS examples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id TEXT NOT NULL,
    config TEXT NOT NULL, -- JSON string of module configuration
    source TEXT,          -- 'template:123' or 'manual'
    FOREIGN KEY (module_id) REFERENCES modules(id)
);
