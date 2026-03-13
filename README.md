# Make.com Vibecoder — AI-Native Automation Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-green)](https://modelcontextprotocol.io)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Agent%20SDK-blueviolet)](https://claude.ai/code)
[![Make.com](https://img.shields.io/badge/Make.com-automation-orange)](https://make.com)
[![npm](https://img.shields.io/npm/v/make-mcp-server?label=npm%3A%20make-mcp-server)](https://www.npmjs.com/package/make-mcp-server)

> **A complete AI agent system for building, validating, and deploying Make.com automation scenarios — entirely through conversation.** Describe what you want to automate. Claude plans it, builds it, validates it, and ships it.

> _Community project. Not affiliated with Make.com or Celonis._

---

## What Is This?

This repo implements a **full AI-native automation engineering stack** on top of Make.com — combining a purpose-built MCP server, a structured agent SDK, a context-efficient skills layer, and a vibe-coding command system into a single coherent workflow.

The core insight is that **building automation scenarios with AI is an engineering problem**, not just a prompting problem. A naive approach — handing Claude raw API docs or a generic Make.com API wrapper — produces hallucinations, bloated context, and broken blueprints. This system solves each failure mode systematically.

```
User types: "When a new Typeform response comes in,
             send a Slack message and create a HubSpot contact."

Claude:  1. Reads INITIAL.md  →  /create-prd
         2. Generates a 15-section PRD with module flow, IML expressions,
            connection requirements, and deployment checklist
         3. /execute  →  search_templates → get_template → validate_scenario → create_scenario
         4. Scenario is live in Make.com. Connection IDs need replacing. Done.
```

---

## The System at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER CONVERSATION                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │      CLAUDE CODE        │
          │   (Agent SDK layer)     │
          │                         │
          │  CLAUDE.md              │  ← Silent execution rules,
          │  ├── 17 tool patterns   │    parallel tool calls,
          │  ├── pitfall registry   │    templates-first strategy
          │  └── deployment rules   │
          │                         │
          │  Slash Commands         │
          │  ├── /create-prd        │  ← Reads INITIAL.md →
          │  │    └─ PRD.md         │    generates 15-section PRD
          │  └── /execute PRD.md    │  ← Implements plan, runs
          │                         │    validation, deploys
          │  Skill Layer (5 skills) │  ← Loaded on demand,
          │  ├── mcp-tools-expert   │    YAML frontmatter keeps
          │  ├── blueprint-syntax   │    context minimal
          │  ├── validation-expert  │
          │  ├── workflow-patterns  │
          │  └── module-config      │
          └────────────┬────────────┘
                       │ MCP protocol
          ┌────────────▼────────────┐
          │   MAKE MCP SERVER       │  ← TypeScript / SQLite
          │   (make-mcp-server)     │    ~50 lines per tool output
          │                         │
          │  17 tools               │
          │  559 modules / 170 apps │
          │  266 blueprint templates│
          │  502 real examples      │
          └────────────┬────────────┘
                       │ Make REST API
          ┌────────────▼────────────┐
          │      MAKE.COM           │
          └─────────────────────────┘
```

---

## Why Not the Official Make MCP?

Make.com ships an official MCP server. This project deliberately takes a different approach — and the differences compound at scale.

### 1. Context Efficiency: ~50 lines vs 120–200 lines per tool output

The official Make MCP is an API wrapper. It returns what the Make API returns. A single module lookup can produce 120–200 lines of raw JSON — nested parameter trees, OAuth metadata, localization fields, internal flags — most of which Claude doesn't need and which eats context window fast.

This MCP server curates its output. `get_module` returns exactly what an LLM needs to build a valid blueprint: the required parameters, the mapper fields, the output schema, and up to 5 real-world examples extracted from production blueprints. **~50 lines per call.** In a complex multi-module build, that's the difference between staying inside context and going over it.

```
Official Make MCP — get_module("slack:CreateMessage"):
  → 178 lines: raw API JSON with all OAuth scopes, localization strings,
    internal typeIds, nested conditional parameter trees, help text
    in 12 languages, deprecated field flags, and UI metadata

This MCP — get_module("slack:CreateMessage"):
  → 47 lines: module type, required parameters (channel, text),
    optional parameters, output fields (messageId, ts, channel),
    connection type (account:slack), and 3 real configs from
    production blueprints showing real channel names and IML expressions
```

### 2. Schema-First, Not API-Passthrough

The official MCP makes a live API call on every tool invocation. This MCP server queries a **pre-built SQLite database** with FTS5 full-text search — a snapshot of 559 modules across 170 apps, rebuilt from live Make API data on demand (`npm run scrape:api`). Search is sub-millisecond. Module lookup is a single prepared statement with a 60-second TTL cache. The server starts fast and stays fast.

### 3. Validation Before Deployment

The official Make MCP creates scenarios directly. This server runs a **5-pass validation engine** before any deployment:
- Structural check (valid JSON, required fields)
- Module catalog lookup (559 known IDs)
- Forward reference detection (module N cannot reference module M where M > N)
- Required parameter verification (against the parameter registry)
- Problematic module flagging (known-broken AI integrations)

Validation runs offline — no API calls needed. Only a clean blueprint reaches `create_scenario`.

### 4. Auto-Healing on Deploy

Even validated blueprints can fail at Make's API layer due to format quirks. `create_scenario` auto-fixes them:

| Problem | Fix |
|---------|-----|
| Missing `metadata` / `designer` sections | Injected automatically |
| Router `filter` property (can't be set via API) | Stripped before submission |
| Module version conflicts | Verified versions injected from internal registry |
| `builtin:Schedule` trigger format | Converted to proper scheduling structure |

### 5. 266 Real Templates from Production

Search 266 real Make.com blueprint templates extracted from actual production flows. Find a template that matches your use case, adapt the connection IDs and field mappings, validate, deploy. Building from scratch is a last resort — the template library covers the most common automation patterns.

---

## The Vibe Coding Workflow

This is the primary way to use the system. Open the `agent sdk/` directory in Claude Code and describe your automation goal:

### Step 1 — Describe your goal in `INITIAL.md`

```markdown
# initial.md
Build me a Make scenario: When a new Typeform response comes in,
send a Slack message and create a HubSpot contact.
```

### Step 2 — Generate a Product Requirements Document

```
/create-prd
```

Claude reads `INITIAL.md`, asks clarifying questions if critical information is missing (all at once, not one at a time), then generates a **15-section PRD** written to `PRD.md`:

| Section | Content |
|---------|---------|
| 1. Summary | Pattern type, trigger, apps, complexity estimate |
| 2. Trigger definition | Module ID, scheduling type, output field mapping |
| 3. Module flow | Every module with purpose, connection, parameters, mapper values |
| 4. Data mapping | Full IML expression table — every `{{N.field}}` mapped |
| 5. Connection requirements | Every `__IMTCONN__` placeholder and which app it belongs to |
| 6. Router logic | Branching conditions (noted as UI-only — cannot be set via API) |
| 7. Iterator/Aggregator | Pattern if processing lists |
| 8. Scheduling & deployment | Correct scheduling type, team ID, activation |
| 9. Template discovery | Pre-written `search_templates` queries to try first |
| 10. Constraints | Every Make.com API gotcha that applies to this scenario |
| 11. Blueprint skeleton | Minimal JSON to confirm structure |
| 12. Validation checklist | Pre-flight checks before `validate_scenario` |
| 13. Test cases | Happy path + edge cases with verification steps |
| 14. Success criteria | Checkboxes for done |
| 15. Future enhancements | Post-MVP ideas |

The PRD exists so Claude (or another developer) can implement the scenario with zero ambiguity — the IML expressions, connection types, and module ordering are all specified before a single API call is made.

### Step 3 — Execute

```
/execute PRD.md
```

Claude implements the PRD top-to-bottom:
1. `health_check` — verify API credentials
2. Run template searches from Section 9 (in parallel)
3. If template found → `get_template` → adapt to PRD spec
4. If not → `search_modules` for each module in Section 3
5. Get real connection IDs via `connections_list`
6. Build blueprint from skeleton + data mapping table
7. `validate_scenario` → fix all errors
8. `create_scenario` → deploy
9. `run_scenario` + `list_executions` → confirm success

---

## The Skills Layer

Five specialist skills activate automatically based on what you're doing. Each skill is a structured markdown file in `.claude/skills/` with YAML frontmatter that tells Claude Code when to load it.

**The key design principle:** skills don't dump everything into context — they use a hierarchical structure where the `SKILL.md` is a short YAML-frontmatter summary with links to deeper reference files. Claude loads the summary first and pulls in deeper files only when needed. **This keeps the main context lean even with five skills registered.**

```yaml
# .claude/skills/make-validation-expert/SKILL.md
---
name: make-validation-expert
description: Fix Make.com blueprint validation errors
triggers:
  - validate_scenario returns errors
  - blueprint won't deploy
  - seeing IM007, IM009, IM003 error codes
files:
  - ERROR_CATALOG.md      # every error type + fix
  - BLUEPRINT_CHECKLIST.md
---
```

| Skill | Activates When | Key Reference |
|-------|----------------|---------------|
| `make-mcp-tools-expert` | Building or deploying a scenario | Tool selection, chaining patterns, deployment flow |
| `make-blueprint-syntax` | Writing blueprint JSON, IML `{{...}}` expressions | Full IML function reference, flow control, scheduling |
| `make-validation-expert` | Validation fails, IM007/IM009 errors | Complete error catalog with code-level fixes |
| `make-workflow-patterns` | "Automate X when Y happens" natural language requests | Webhook, AI, data pipeline, CRM patterns from real templates |
| `make-module-configuration` | Configuring a specific module | 20 common modules with exact parameter/mapper breakdown |

---

## The Agent SDK

The `agent sdk/` directory contains the **CLAUDE.md** that turns Claude Code into an expert Make.com automation engineer. When you open this directory in Claude Code, the following rules are automatically in effect:

### Core Principles (enforced by CLAUDE.md)

1. **Silent execution** — Claude runs tool chains without commentary. It only speaks after all tools complete. No "Let me search for that..." narration.
2. **Parallel by default** — Independent tool calls run simultaneously, not sequentially. `search_templates` and `search_modules` for two different keywords run in one round-trip.
3. **Templates first** — Always `search_templates` before building from scratch. 266 real blueprints are indexed.
4. **Validate before deploy** — `validate_scenario` before every `create_scenario`. No exceptions.
5. **Known-bad modules blocked** — Claude never uses `openai:ActionCreateCompletion` or `ai-provider:ActionChatCompletion` (they fail at Make's API layer). It uses `http:ActionSendData` → AI provider API instead.

### Specialist Agents (`.claude/agents/`)

Eight sub-agents are registered for specific tasks:

| Agent | Role |
|-------|------|
| `mcp-backend-engineer` | Modifying `server.ts`, adding MCP tools, SDK updates |
| `code-reviewer` | Post-implementation security + quality review |
| `context-manager` | Session handoffs, progress summarization |
| `debugger` | Root-cause analysis on errors and test failures |
| `technical-researcher` | API research, framework evaluation |
| `deployment-engineer` | CI/CD, Docker, infrastructure |
| `test-automator` | Test suite creation and coverage |
| `plan-feature` | Deep codebase analysis before feature implementation |

Sub-agents are constrained: they cannot commit/push to git, and they cannot spawn further sub-agents.

### Slash Commands

| Command | What it does |
|---------|-------------|
| `/create-prd` | Reads `INITIAL.md` → generates `PRD.md` with 15 sections |
| `/execute PRD.md` | Implements and deploys the scenario from the PRD |
| `/plan-feature` | Deep architectural analysis before writing code |
| `/commit` | Atomic git commit with conventional message |
| `/prime` | Loads codebase context into working memory |
| `/create-rules` | Generates `CLAUDE.md` from codebase analysis |
| `/init-project` | Scaffolds a new project with conventions |

---

## The MCP Server

**Package:** `make-mcp-server` on npm — connects to Claude Desktop, Claude Code, or any MCP-compatible client.

### 17 Tools

**Discovery**

| Tool | Description |
|------|-------------|
| `tools_documentation` | Entry point — overview of capabilities, call this first |
| `search_templates` | Search 266 real blueprints by keyword, category, or difficulty |
| `search_modules` | FTS5 full-text search across 559 modules |
| `list_apps` | Browse all 170 apps with module counts |

**Inspection**

| Tool | Description |
|------|-------------|
| `get_template` | Complete deployable blueprint JSON by template ID |
| `get_module` | Parameter schema, output fields, examples, connection type for any module |
| `search_module_examples` | 502 real-world configs extracted from production blueprints |

**Validation & Deployment**

| Tool | Description |
|------|-------------|
| `validate_scenario` | 5-pass blueprint validation before deploy |
| `check_account_compatibility` | Live API check — are these modules available in your region/plan? |
| `create_scenario` | Deploy validated blueprint to Make.com with auto-healing |

**Lifecycle**

| Tool | Description |
|------|-------------|
| `health_check` | Verify API key + get team/org IDs |
| `list_scenarios` | List all scenarios in your team |
| `get_scenario` | Get an existing scenario's blueprint by ID |
| `update_scenario` | Overwrite an existing scenario |
| `delete_scenario` | Delete a scenario (`confirm: true` required) |
| `run_scenario` | Manually trigger a scenario |
| `list_executions` | Execution history and error logs |

### Quick Start

**Option A — npx (no install)**

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "make-mcp-server": {
      "command": "npx",
      "args": ["-y", "make-mcp-server"],
      "env": {
        "MAKE_API_KEY": "your_api_key_here",
        "MAKE_TEAM_ID": "your_team_id",
        "MAKE_API_URL": "https://eu1.make.com/api/v2",
        "LOG_LEVEL": "error"
      }
    }
  }
}
```

**Option B — Claude Code CLI**
```bash
claude mcp add make-mcp-server -- npx -y make-mcp-server
```

**Option C — Docker**
```bash
docker build -t make-mcp-server "./make mcp vibecoder/"
# Then add Docker command to claude_desktop_config.json
```

**Get your Make.com credentials:**
1. [make.com](https://make.com) → avatar → Profile → API → Generate token
2. Scopes: `scenarios:read`, `scenarios:write`, `scenarios:run`
3. Team ID: from the URL when in your workspace — `https://eu1.make.com/{TEAM_ID}/...`

**Config file locations:**

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

---

## How the Database Was Built

### 266 Production Blueprints

The `Make example flows 1/` (42 blueprints) and `Make example flows 2/` (223 blueprints) folders contain real Make.com automation blueprints collected from production accounts. Claude Code was used to scrape and parse all 265 files — extracting module IDs, parameter schemas, connection types, and field names into a structured TypeScript catalog.

The same blueprint files are loaded as searchable templates. `populate-templates.ts` auto-categorizes each one into 12 categories (`ai`, `crm`, `ecommerce`, `marketing`, `social-media`, `communication`, `project-management`, `data`, `file-management`, `automation`, `analytics`, `hr`) and assigns difficulty based on module count and pattern complexity.

### API-Driven Rebuild (v1.7.0)

As of v1.7.0, the database can be rebuilt directly from the Make REST API:

```bash
# Full API rebuild — fetches live module data from Make.com
# Phase 0: extract app slugs from catalog + discover additional apps
# Phase A: GET /apps/{app}@{version}/modules per app (~170 apps)
# Phase B: GET /apps/{app}@{version}/modules/{name}?format=json per module
# Phase C: truncate modules table, INSERT all with full expect schema

npm run scrape:api
```

This replaces hand-written parameter schemas with Make's authoritative `expect` schema — the full mapper field tree with nested options, help text, and type metadata. New columns added: `scope` (OAuth scopes), `listener` (webhook flag), `returns_multiple`, `app_version`.

Rate-limited at 1,100ms between calls (60 req/min), with exponential backoff on 429.

### 502 Real-World Module Examples

`populate-examples.ts` extracts per-module configurations from every blueprint — deduplicates them, scores by completeness, and stores the top 5 per module in the `examples` table. 502 examples across 291 modules. Sensitive values are redacted. `get_module` includes these automatically.

---

## Repo Structure

```
make-vibecoder/
│
├── make mcp vibecoder/          # The MCP server (npm: make-mcp-server)
│   ├── src/
│   │   ├── mcp/server.ts        # All 17 MCP tool definitions
│   │   ├── database/
│   │   │   ├── db.ts            # SQLite wrapper, FTS5, TTL cache, migrations
│   │   │   └── schema.sql       # Tables: modules, templates, examples
│   │   └── scrapers/
│   │       ├── scrape-modules.ts        # Built-in catalog (fallback, ~560 modules)
│   │       ├── scrape-from-make-api.ts  # API-driven full rebuild (v1.7.0)
│   │       ├── populate-templates.ts    # Blueprint → templates table
│   │       └── populate-examples.ts     # Blueprint → examples table
│   ├── data/
│   │   └── make-modules.db      # Pre-built SQLite DB (bundled in npm package)
│   ├── tests/                   # 51 tests (vitest)
│   ├── Dockerfile
│   ├── CHANGELOG.md
│   └── package.json             # make-mcp-server v1.7.0
│
├── agent sdk/                   # Vibe coding system for Claude Code
│   ├── CLAUDE.md                # Agent rules, tool patterns, deployment workflow
│   ├── INITIAL.md               # User's automation goal (starting point)
│   └── .claude/
│       ├── agents/              # 8 specialist sub-agents
│       │   ├── mcp-backend-engineer.md
│       │   ├── code-reviewer.md
│       │   ├── debugger.md
│       │   └── ...
│       └── commands/            # Slash command definitions
│           ├── create-prd.md    # /create-prd → PRD.md (15 sections)
│           ├── execute.md       # /execute PRD.md → plan → validate → deploy
│           ├── commit.md
│           └── ...
│
├── Make example flows 1/        # 42 source blueprints
├── Make example flows 2/        # 223 source blueprints
│
└── README.md                    # This file
```

---

## Development

```bash
cd "make mcp vibecoder"

# Install dependencies
npm install

# Build TypeScript → dist/
npm run build

# Rebuild database from built-in catalog (no API key needed)
npm run scrape

# Rebuild from live Make API (requires MAKE_API_KEY in shell env)
npm run scrape:api

# Run test suite (51 tests)
npm test

# Dev mode
npm run dev
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAKE_API_KEY` | For deployment | — | Make.com API token |
| `MAKE_TEAM_ID` | For deployment | — | Team ID from Make URL |
| `MAKE_API_URL` | No | `https://eu1.make.com/api/v2` | Change for US/AU zones |
| `MAKE_ORGANIZATION_ID` | No | — | Required for org-level API calls |
| `LOG_LEVEL` | No | `info` | `debug` \| `info` \| `warn` \| `error` \| `silent` |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | TypeScript + Node.js ESM | Type-safe MCP tool definitions |
| MCP protocol | `@modelcontextprotocol/sdk` | Official Anthropic SDK |
| Database | SQLite via `better-sqlite3` + FTS5 | Sub-ms search, bundled in npm, no external DB |
| Cache | In-memory TTL map (60s) | Hot-path reads for `get_module` / `get_template` |
| Schema validation | `zod` | Input validation on all MCP tool parameters |
| HTTP client | `axios` | Make.com REST API calls |
| Tests | `vitest` (51 tests) | Unit + integration + MCP protocol tests |
| Packaging | Pre-built DB bundled | `npx make-mcp-server` works with no setup |

---

## Background

This project was built as a deep exploration of **AI-native tooling for automation engineering** — the intersection of LLM agent design, structured output engineering, and workflow automation platforms.

The core challenges solved:

- **Context window management** at tool-output level — curating LLM-facing data rather than passing API responses directly
- **Structured agent behavior** through `CLAUDE.md` + skills + slash commands — replacing ad-hoc prompting with engineered agent workflows
- **Schema-first planning** through the PRD system — externalizing the reasoning step before implementation so errors are caught in the planning phase, not at deploy time
- **Tool chaining reliability** — validation pipelines, auto-healing, and explicit constraint encoding that make AI-generated blueprints deployable on the first try

Built using Claude Code, the Anthropic Agent SDK, and the Model Context Protocol. All 265 source blueprints were collected and processed using Claude Code agents.

---

## License

MIT — see [`make mcp vibecoder/LICENSE`](make%20mcp%20vibecoder/LICENSE).

Community project. Not affiliated with Make.com / Celonis / Integromat.
