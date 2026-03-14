# Changelog

All notable changes to this project will be documented in this file.

## [1.9.0] - 2026-03-14

### Added
- **Blueprint metadata enrichment** — New `src/scrapers/enrich-from-blueprints.ts` scraper. After inserting the base catalog, `npm run scrape` now scans all blueprint JSON files and extracts accurate parameter schemas from `metadata.parameters` + `metadata.expect` on each flow node. Takes the **union** of both arrays (unlike the old extractor which only used whichever array was larger). 290 modules enriched from the 223-blueprint corpus.
- **Official Make MCP enrichment** — New `src/scrapers/enrich-from-official-mcp.ts` and `data/official-mcp-schemas.json`. Once the JSON file is populated (via Make MCP harvest sessions), `npm run scrape` applies authoritative schemas with the highest priority (`schema_source: 'official-mcp'`). Supports upsert — inserts new modules if not already in catalog.
- **`schema_source` column** — New `TEXT DEFAULT 'hand-written'` column on the `modules` table. Values: `'official-mcp'` (fully accurate) | `'blueprint-extracted'` (Make-authored) | `'hand-written'` (unverified). Exposed in `get_module` response so the AI can calibrate confidence.
- **`db.enrichModuleSchema()`** — New DB method for schema enrichment with priority protection. Blueprint-extracted enrichment cannot downgrade a module already marked `'official-mcp'`.
- **`db.updateModuleMetadata()`** — New DB method for updating name/description/type/output_fields on an existing module (used by official-mcp enricher).
- **`addMissingColumns()` called early** — Now called at the start of `populateDatabase()` (before both API and catalog paths) so all columns exist before any INSERT.

### Changed
- `get_module` response now includes `schema_source` field.
- `insertModule()` now persists `schema_source` (defaults to `'hand-written'` if not provided).
- Version bumped to 1.9.0.

## [1.8.0] - 2026-03-14

### Added
- **83 new modules** across 9 existing and 6 brand-new apps — catalog grows from 566 → 649 modules.
- **New app: Groq** — 7 modules: Chat Completion, JSON Chat Completion, Vision, Transcription (Whisper), Translation (Whisper), Simple Text Prompt, Make an API Call.
- **New app: Mistral AI** — 4 modules: Chat Completion, Embeddings, List Models, Make an API Call.
- **New app: DeepSeek AI** — 4 modules: Chat Completion, List Models, Get Balance, Make an API Call.
- **New app: Open Router** — 4 modules: Chat Completion, Chat Completion with Fallback, List Models, Make an API Call.
- **New app: xAI (Grok)** — 3 modules: Create a Completion, Generate an Image, Make an API Call.
- **New app: Azure OpenAI** — 5 modules: Chat Completion, DALL-E 3 Image Generation, Whisper Transcription, Whisper Translation, Make an API Call.
- **OpenAI** (+23 modules): Responses API (`createModelResponse`, `getModelResponse`, `deleteModelResponse`, `listInputItems`), Sora video (`generateVideo`, `remixVideo`, `getVideo`, `deleteVideo`, `listVideos`), image editing (`editImage`), batch API (`createBatch`, `cancelBatch`, `getBatch`, `listBatches`), Moderation, Translation (Whisper), Vector Store file batch, container file download, `transformTextToStructuredData`, `uploadFile`, `makeApiCall`, 2 new triggers (batch completed, video jobs).
- **Anthropic Claude** (+15 modules): Simple Text Prompt, Make an API Call, Files API (upload/download/get/delete/list), Skills API (create/createVersion/get/getVersion/delete/deleteVersion/list/listVersions).
- **Gemini AI** (+12 modules): Simple Text Prompt, Extract Structured Data, Image Generation (Imagen), Video Generation (Veo), File Search Stores CRUD (6 modules), Make an API Call.
- **AI Tools (Make)** (+8 modules): Extract, Categorize, Translate, Detect Language, Summarize, Analyze Sentiment, Standardize, Chunk Text.
- **Perplexity AI** (+2 modules): List Search Results, Make an API Call.
- **Tools by Make** (+2 modules): `ComposeTransformer` (Compose), `TextSwitcher` (Text switcher).

### Changed
- Version bumped to 1.8.0.

## [1.7.0] - 2026-03-12

### Added
- **`scrape-from-make-api.ts`** — Full API-driven database rebuild scraper. When `MAKE_API_KEY` is set, `npm run scrape` now fetches live module data directly from the Make REST API instead of the hand-crafted catalog. Three-phase pipeline: app discovery → module list per app → full module details per module.
- **`npm run scrape:api`** — New standalone script to run only the API rebuild (without templates/examples).
- **`db.addMissingColumns()`** — Idempotent migration method that `ALTER TABLE ADD COLUMN`s any new columns missing from an existing DB.
- **`db.truncateModules()`** — Wipes the modules table and its FTS shadow for a clean rebuild.
- **4 new columns on `modules` table**: `scope` (JSON array of required OAuth scopes), `listener` (1 = webhook/instant trigger), `returns_multiple` (1 = emits multiple bundles), `app_version` (Make app version used to fetch).
- **`expect` schema stored as `parameters`** — Full mapper field schema with nested options, help text, advanced flags from the API. Replaces the hand-written minimal schemas.
- **`interface` stored as `output_fields`** — Now always populated from live API data.
- **Module type precision** — `type` column now distinguishes `instant_trigger`, `universal`, `responder` in addition to the existing `trigger`, `action`, `search`.
- **Rate-limited API calls** — 1100 ms between every request; exponential backoff on 429 (60 s × attempt); 2 s × attempt retry on other transient errors.

### Changed
- `populateDatabase()` in `scrape-modules.ts` now routes to `scrapeFromMakeApiAndRebuild()` when `MAKE_API_KEY` is set; falls back to built-in catalog for no-API-key installs (npx scenario).
- `getModuleCatalog()` promoted from `private` to public so the API scraper can read the app slug list without instantiating a full DB.
- `db.enrichModule()` extended to accept `scope`, `listener`, `returns_multiple`, `app_version`.
- `db.insertModule()` extended to persist the 4 new columns.
- `enrich` npm script now points to `scrape-from-make-api.ts` (deprecates `scrape-from-api.ts`).
- Version bumped to 1.7.0.

## [1.6.0] - 2026-03-12

### Added
- **`search_module_examples` tool** — Returns real-world module configurations extracted from production blueprints. 502 examples across 291 modules, sensitive values redacted.
- **`populate-examples.ts` scraper** — Extracts and scores module configs from all blueprints (merger of `mapper` + `parameters`), deduplicates, stores top-5 per module in the `examples` table. Runs automatically as part of `npm run scrape`.
- **`examples` table** populated for the first time — `get_module` (non-essentials mode) now includes real examples in its response.
- **3 new public methods on `MakeDatabase`** — `insertExample`, `clearExamples`, `runInTransaction` — replacing direct `db.db` access in scrapers.

### Changed
- `npm run scrape` now also populates the `examples` table after modules and templates.
- `tools_documentation` updated to list `search_module_examples`.

## [1.5.0] - 2026-03-10

### Added
- **559 modules** (+244 new) extracted from 223 "Make example flows 2" blueprints — up from 315 (+76% growth)
- **148 unique apps** now covered (was ~50)
- **`get_template` tool** — Retrieve complete, deployable blueprint JSON by template ID
- **266 blueprint templates** loaded from real Make.com flows (both example folders) into the database
- **`populate-templates.ts`** scraper — Auto-categorizes blueprints into 12 categories (ai, crm, ecommerce, marketing, social-media, communication, project-management, data, file-management, automation, analytics, hr) and difficulty levels
- **Multi-word template search** — `search_templates("chatgpt slack")` now finds templates matching all words independently
- **New apps**: Anthropic Claude, Telegram, Perplexity AI, BrowserAct, AI Tools, Gmail, DataForSEO, ZeroBounce, Revolut, Facebook Pages, Discord, Gemini AI, Leonardo AI, DeepL, WhatsApp, Zendesk, ActiveCampaign, Salesflare, Bitrix24, Monday.com, and 100+ more
- `difficulty` filter added to `search_templates` tool
- `modules_used` returned by `search_templates` for preview of what apps are involved
- Updated `tools_documentation` to reflect new 559-module catalog and template workflow

### Changed
- `search_templates` now returns `modulesUsed` array and a `hint` for using `get_template`
- `list_apps` and `search_modules('*')` now support up to 1000 results (was 500)
- Quick start guide now recommends templates-first workflow (faster path to deployment)

## [1.3.2] - 2026-03-09

### Added
- **`list_scenarios` tool** — Lists all scenarios in the Make.com account with optional filtering by scheduling type (`on-demand`, `immediately`, `indefinitely`). Returns ID, name, description, scheduling, status, creation date, last edit, operation count, packages used, and creator. Falls back to `MAKE_TEAM_ID`/`MAKE_ORGANIZATION_ID` env vars when not provided.
- **`API_INTEGRATION.md`** — Documents working vs. permission-blocked Make.com API endpoints and comparison with the official Make MCP
- **`tools_documentation`** updated to include `list_scenarios` and API permission tips

## [1.4.0] - 2026-02-09

### Added
- **Blueprint extraction system** — Automated pipeline that parses Make.com blueprint JSON files, extracts parameter schemas from `metadata.expect` arrays, and generates TypeScript module definitions
- **`src/scrapers/extract-from-blueprints.ts`** — Core extraction engine (476 lines): parses 42 production blueprints, maps 30+ blueprint parameter types to internal types, deduplicates and aggregates across blueprints
- **`src/scrapers/module-mapping.ts`** — Type mapping utilities for blueprint → internal type conversion
- **`merge-tiers.js`** — Automated tier merging script for controlled rollout
- **91 new modules** extracted from 42 production blueprints — 203 → 315 total (+55%)
  - Tier 1 (≥5 uses): 3 modules
  - Tier 2 (2–4 uses): 21 modules
  - Tier 3 (1 use): 67 modules
- **18 new apps**: PostgreSQL, QuickBooks, Microsoft Excel, Calendly, Browse AI, ElevenLabs, Gong, Canva, ClickUp, Clearbit, Buffer, Salesloft, Sendinblue, YouTube, LinkedIn Lead Gen Forms, LinkedIn Offline Conversions, Anthropic (Claude), Apify
- **Real Make.com module IDs** corrected from blueprint data: `slack:CreateMessage`, `openai-gpt-3:CreateCompletion`, `google-sheets:addRow`, `notion:watchDatabaseItems`
- **Generated artifacts**: `data/tier1-modules.ts`, `data/tier2-modules.ts`, `data/tier3-modules.ts`

### Changed
- `scrape-modules.ts` expanded with 91 additional modules from the tier extraction

## [1.3.1] - 2026-02-07

### Fixed
- **npx `-y` flag** — All README examples now include `-y` to prevent interactive "Ok to proceed?" prompt that hangs MCP clients

## [1.3.0] - 2026-02-07

### Added
- **Auto-healing** for LLM-generated blueprints — `create_scenario` now auto-injects missing `metadata`, `scenario` config, and `designer` coordinates
- **Router support** — Full `builtin:BasicRouter` deployment with multiple routes (tested & verified)
- **Recursive validation** — `validate_scenario` now traverses into router sub-routes
- **Router filter stripping** — Automatically removes unsupported `filter` property from route objects
- **Enhanced error reporting** — `create_scenario` returns full Make.com API error details including `suberrors`
- **`?confirmed=true`** query parameter on scenario creation to auto-install first-time apps
- 3 new tips in `tools_documentation` about versioning, filters, and auto-healing

### Changed
- Module `version` is no longer auto-injected — Make.com resolves the latest installed version automatically
- Removed false "missing version" warning from `validate_scenario`

### Fixed
- **HTTP module "Module not found"** — Caused by forcing `version: 1` on modules that have been updated (HTTP is now v4)
- **Router 400 Bad Request** — Caused by `filter` property being rejected as additional property on route objects
- **Workspace MCP config override** — `.vscode/mcp.json` was overriding global config; documented that all env vars must be present in workspace config

## [1.2.0] - 2026-02-07

### Added
- **npx support** — `npx make-mcp-server` runs zero-install with pre-built database
- **Docker support** — Multi-stage Dockerfile for isolated deployments
- **CLI entry point** — `make-mcp-server --help`, `--version`, `--scrape` flags
- **Self-hosting options** in README (npx, Docker, local dev)
- **Build script** (`scripts/build.js`) — tsc + copy schema.sql + add shebang
- **Prepublish script** (`scripts/prepublish.js`) — automated package preparation
- **Path resolution** — All paths resolve relative to package root (works from any cwd)
- `.dockerignore` for lean Docker builds
- `.env.example` template

### Changed
- `db.ts` now uses `import.meta.url` for path resolution (npx/global-install safe)
- `package.json` `bin` entry, `files` whitelist, and `scripts` updated for npm distribution
- `postinstall.js` improved with clearer messaging
- README completely rewritten with self-hosting options and IDE setup guides

### Fixed
- Windows ESM `import()` error — use `pathToFileURL()` in CLI entry point
- Schema.sql not found when running from different working directory

## [1.1.0] - 2026-02-06

### Added
- **Production hardening** — migrated to `registerTool`/`registerPrompt`/`registerResource` (SDK v1.26.0)
- **Structured logger** (`src/utils/logger.ts`) — stderr-only, LOG_LEVEL support
- **MCP Prompts** — `build_scenario` (guided creation), `explain_module`
- **MCP Resources** — `make://apps` (apps catalog)
- **`tools_documentation`** meta-tool (START HERE pattern)
- **Tool annotations** — `destructiveHint`/`idempotentHint` on `create_scenario`
- **Input sanitization** on all tool inputs
- **Graceful shutdown** handlers (SIGINT, SIGTERM, uncaughtException)
- **42 Vitest tests** — 14 database + 7 logger + 21 integration
- `isError` flag on all tool error responses

### Fixed
- FTS5 wildcard `*` search crash — added early return for "list all" case

## [1.0.0] - 2026-02-05

### Added
- Initial release
- 224 Make.com modules across 40+ apps
- 6 MCP tools: search_modules, get_module, validate_scenario, create_scenario, search_templates, list_apps
- SQLite database with FTS5 full-text search
- Make.com API integration for scenario deployment
- Module scraper with built-in catalog
