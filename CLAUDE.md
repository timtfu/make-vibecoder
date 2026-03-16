# Make Vibecoder — Root CLAUDE.md

This is the master guide for working in this repository. Read this first. Sub-directories have their own CLAUDE.md files — consult them for details.

---

## Repository Structure

```
make-vibecoder/
├── make mcp vibecoder/        # ← THE MAIN PROJECT (MCP server, all code lives here)
│   ├── src/
│   │   ├── mcp/server.ts      # All 17 MCP tool definitions (~1700 lines)
│   │   ├── database/
│   │   │   ├── db.ts          # SQLite wrapper (all DB access goes through here)
│   │   │   └── schema.sql     # Tables: modules, templates, examples + FTS5
│   │   └── scrapers/
│   │       ├── scrape-modules.ts       # Static module catalog (~5000 lines) + DB populate
│   │       ├── populate-templates.ts   # Loads blueprint JSON → templates table
│   │       ├── populate-examples.ts    # Extracts module configs → examples table
│   │       ├── scrape-from-make-api.ts # API-driven rebuild (requires MAKE_API_KEY)
│   │       └── extract-from-blueprints.ts  # Blueprint parsing engine
│   ├── data/make-modules.db   # SQLite DB — source of truth at runtime
│   ├── dist/                  # Compiled JS (must rebuild after TS changes)
│   ├── .env                   # API keys (gitignored — must be set locally)
│   ├── CLAUDE.md              # Dev guide for the MCP server internals
│   └── CHANGELOG.md           # Version history
│
├── Make example Blueprints/   # 224 real Make.com blueprint JSON files (batch 3)
│   └── *.blueprint.json
│
├── agent sdk/                 # Claude Agent SDK context for building scenarios
│   ├── CLAUDE.md              # Agent behavior rules + tool usage guide
│   └── INITIAL.md             # Example prompt for new users
│
├── .claude/
│   ├── agents/                # Specialized sub-agents (code-reviewer, mcp-backend-engineer, etc.)
│   ├── skills/                # Make.com skills (make-mcp-tools-expert, make-blueprint-syntax, etc.)
│   └── commands/              # Slash commands (commit, create-prd, execute, plan-feature, etc.)
│
└── README.md                  # Public-facing project overview
```

> **NOTE:** There is no `official make mcp/` folder in this repo anymore. Do not look for it or reference it.

---

## Current State (update this when versions change)

- **Version:** 1.8.0
- **Modules:** 649 across 176+ apps
- **Templates:** 223 blueprint templates (+ 266 from earlier batches = 266 total in DB)
- **Examples:** 502 real-world module configurations extracted from blueprints

---

## Development Workflow

### Always do this after TypeScript changes
```bash
cd "make mcp vibecoder"
npm run build          # TypeScript → dist/
```
Then tell the user to **reload the MCP server** in Claude Desktop.

### Rebuild the database
```bash
cd "make mcp vibecoder"
npm run scrape         # Runs: populate modules → templates → examples
                       # Routes to API scraper if MAKE_API_KEY is in env, else uses catalog
```

### Run tests
```bash
cd "make mcp vibecoder"
npm test
```

### Dev mode (no build needed)
```bash
cd "make mcp vibecoder"
npm run dev            # tsx watch, auto-reloads
```

### Test the MCP server manually
```bash
cd "make mcp vibecoder"
kill $(lsof -ti :6277) 2>/dev/null   # clear stale inspector port if needed
npx @modelcontextprotocol/inspector node dist/mcp/server.js
# Opens browser UI at http://localhost:6274
```

---

## Make.com API — Known Limitations (DO NOT waste time retrying these)

### The module catalog endpoint does NOT exist publicly
```
GET /apps/{name}@{version}/modules  →  HTTP 404 for all user API keys
```
The Make.com REST API does **not** expose the module/app catalog to public users. The `scrape-from-make-api.ts` scraper detects this and exits with a clear message. **Use `npm run scrape` (catalog-based) instead.**

### What the API DOES support
- `GET /users/me` — auth check
- `GET /scenarios` — list scenarios
- `POST /scenarios` — create scenario
- `PATCH /scenarios/:id` — update scenario
- `DELETE /scenarios/:id` — delete scenario
- `GET /scenarios/:id/executions` — execution history
- `POST /scenarios/:id/run` — trigger run
- `GET /connections` — list connections

---

## Problematic Modules — Never Use These

| Module ID | Why broken | Use instead |
|-----------|-----------|-------------|
| `openai:ActionCreateCompletion` | API deployment fails | `http:ActionSendData` → OpenAI API |
| `openai-gpt-3:ActionCreateChatCompletion` | API deployment fails | `http:ActionSendData` |
| `openai:ActionAnalyzeImages` | API deployment fails | `http:ActionSendData` → vision API |
| `email:ActionSendEmail` | Not universally available | `gmail:ActionSendEmail` or SMTP |
| `ai-provider:ActionChatCompletion` | Not deployable via API | `http:ActionSendData` |
| `anthropic-claude:createAMessage` | May cause IM007 errors | `http:ActionSendData` → Anthropic API |

---

## Blueprint Rules — Common Mistakes That Break Deployment

### ❌ `__IMTCONN__` placeholders
Replace ALL `__IMTCONN__` with real numeric connection IDs before deploying:
```json
{"parameters": {"__IMTCONN__": 1234567}}  // ✅
{"parameters": {"__IMTCONN__": "__IMTCONN__"}}  // ❌ will fail
```
Get real IDs with `mcp__make-vibecoder__list_scenarios` or the `connections_list` Make MCP tool.

### ❌ Invalid scheduling types
```json
{"type": "on-demand"}                       // ✅
{"type": "immediately"}                     // ✅ (webhook-based)
{"type": "indefinitely", "interval": 900}  // ✅ (polling every 15 min)

{"type": "interval"}   // ❌
{"type": "cron"}       // ❌
{"type": "scheduled"}  // ❌
```

### ❌ Version numbers in modules
Do NOT set `"version"` on blueprint modules. `create_scenario` auto-injects correct versions. Manual versions cause IM007 errors.

### ❌ Forward references
Module `id: 2` cannot reference `{{3.field}}`. Only reference modules with a lower ID.

### ❌ Router filter conditions
`builtin:BasicRouter` route conditions **cannot be set via API**. Deploy first, configure filter logic in the Make.com UI.

### ✅ Correct IML mapping patterns
```json
{"mapper": {"subject": "{{1.subject}}", "body": "{{1.body}}"}}    // ✅ dynamic
{"parameters": {"to": "static@email.com"}}                         // ✅ static
{"mapper": {"subject": "{{subject}}"}}                             // ❌ missing module ref
```

---

## Scraper Routing Logic

`npm run scrape` in `scrape-modules.ts` routes like this:
```
MAKE_API_KEY in shell env?
  → YES: calls scrapeFromMakeApiAndRebuild() [src/scrapers/scrape-from-make-api.ts]
  → NO:  uses built-in static catalog [getModuleCatalog() in scrape-modules.ts]
```

`scrape-modules.ts` does NOT load dotenv itself (by design — avoids test interference).
`scrape-from-make-api.ts` loads dotenv internally (safe as standalone script).

To force catalog-based scrape even if API key is set:
```bash
unset MAKE_API_KEY && npm run scrape
```

---

## Database Schema Quick Reference

```sql
modules        -- id, name, app, type, description, parameters (JSON), output_fields (JSON),
               -- scope (JSON), listener (0/1), returns_multiple (0/1), app_version
modules_fts    -- FTS5 virtual table, auto-synced by insertModule()

templates      -- id, name, description, category, difficulty, modules_used, blueprint (JSON)
templates_fts  -- FTS5 virtual table, auto-synced by insertTemplate()

examples       -- id, module_id, config (JSON), score, source_blueprint
```

All DB access goes through `src/database/db.ts`. Never access `db.db` directly from scrapers.

---

## Adding New Blueprint Folders

When a new batch of `.blueprint.json` files arrives (e.g., `Make example Blueprints 2/`):

1. Add the folder path to `getBlueprintFolders()` in both:
   - `src/scrapers/populate-templates.ts`
   - `src/scrapers/populate-examples.ts`
2. Run `npm run scrape` — templates and examples auto-populate
3. Update module count in this file and in `make mcp vibecoder/CLAUDE.md`

---

## Skills Available (in `.claude/skills/`)

| Skill | When to use |
|-------|-------------|
| `make-mcp-tools-expert` | Entry point — tool selection, chaining, workflow patterns |
| `make-module-configuration` | Module anatomy, parameters, connection types |
| `make-validation-expert` | Blueprint validation errors + fixes |
| `make-workflow-patterns` | Webhook/AI/data/CRM patterns from real templates |
| `make-blueprint-syntax` | IML syntax, flow control, scheduling reference |

---

## Agents Available (in `.claude/agents/`)

| Agent | When to invoke |
|-------|---------------|
| `mcp-backend-engineer` | Modifying server.ts, tool schemas, MCP protocol issues |
| `code-reviewer` | After significant code changes to server.ts, db.ts, scrapers |
| `context-manager` | Long sessions — captures progress + writes to MEMORY.md |
| `debugger` | Test failures, unexpected errors, root cause analysis |
| `technical-researcher` | Researching APIs, frameworks, or architectural decisions |

**Constraints:** Sub-agents must NOT commit/push to git. That stays in the main session.

---

## Recurring Pitfalls (lessons learned — add new ones here)

### Port conflict with MCP inspector
Port 6277 stays occupied after the inspector crashes or is backgrounded.
Fix: `kill $(lsof -ti :6277)` or use `--port 6278`.

### `scrape-modules.ts` is ~5000 lines
When adding new modules, the insertion point is the closing `        ];` around line ~4932.
Use `Grep` to find it: search for `^        \];` in the file.

### FTS5 and templates_fts must be populated after fresh scrape
After a clean DB rebuild, run `npm run scrape` — this populates both `modules_fts` and `templates_fts`.
Without this, `search_modules` and `search_templates` return empty results.

### Template search is NOT FTS5 — it's LIKE-based
`search_templates` searches word-by-word using LIKE across name, description, modules_used.
Multi-word queries work but are not ranked by relevance. Keep queries short and specific.

### `dist/` is stale until rebuilt
The running server uses `dist/mcp/server.js`. If you edit `src/`, nothing changes until `npm run build` runs.

### `.env` is gitignored
The API key, team ID, and org ID are never in git. They must be set manually on each machine.
File location: `make mcp vibecoder/.env`

---

## How to Keep This File Current

When you discover a new pitfall, limitation, or best practice:
1. Add it to the relevant section above (or create a new section)
2. Update version numbers and module counts when they change
3. If a new Make.com API endpoint is confirmed to work or not work, add it to the API section

This file is the institutional memory for the project. Keep it accurate and concise.
