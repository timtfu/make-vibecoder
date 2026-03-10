 Here is Claude's plan:                                                                                                                                                                                                    
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Make Vibecoder MCP — Strategic Roadmap                 

 Purpose: Self-contained briefing for the next Claude Code session.
 Save this to /root/make-vibecoder/plan/ROADMAP.md and hand it to the next session.

 ---
 1. What This Project Is

 Make Vibecoder MCP is an unofficial MCP server that lets Claude Code build, validate, and deploy Make.com automation scenarios through conversation. It lives at /root/make-vibecoder/make mcp vibecoder/ and is modelled
  after n8n-mcp (present in the same repo at /root/make-vibecoder/n8n-mcp/).

 Current Capabilities (v1.5 — as of 2026-03-10)

 ┌─────────────────┬──────────────────────────────────────────────────────────────────────┐
 │      Layer      │                             What exists                              │
 ├─────────────────┼──────────────────────────────────────────────────────────────────────┤
 │ Local knowledge │ 559 modules across 148 apps, searchable via FTS5                     │
 ├─────────────────┼──────────────────────────────────────────────────────────────────────┤
 │ Templates       │ 266 real blueprints loadable and searchable                          │
 ├─────────────────┼──────────────────────────────────────────────────────────────────────┤
 │ Validation      │ Pre-deployment blueprint validation (structure, types, forward refs) │
 ├─────────────────┼──────────────────────────────────────────────────────────────────────┤
 │ API (read)      │ List scenarios, live module compatibility check                      │
 ├─────────────────┼──────────────────────────────────────────────────────────────────────┤
 │ API (write)     │ Create scenario (deploy blueprint)                                   │
 └─────────────────┴──────────────────────────────────────────────────────────────────────┘

 Tools the server exposes today

 tools_documentation · search_modules · get_module · validate_scenario · create_scenario · list_scenarios · search_templates · get_template · check_account_compatibility · list_apps

 ---
 2. The Gap vs n8n-mcp

 n8n-mcp has 20 tools; Make MCP has 10. The meaningful gaps fall into three buckets:

 A. Scenario lifecycle management (currently half-implemented)

 n8n-mcp can create, read, update, and delete workflows. Make MCP can only create and list. Every "fix this scenario" request from Claude currently requires delete + re-create, losing history and wasting tokens.

 Missing: get_scenario, update_scenario, delete_scenario

 B. Execution monitoring (currently zero)

 After deploying a scenario, Claude has no way to know if it ran, what it returned, or why it failed. Users must go to the Make.com UI.

 Missing: list_executions, run_scenario

 C. Discovery quality (currently basic)

 n8n-mcp's search supports AND/OR/FUZZY modes and task-based template discovery. Make MCP does keyword-only search. Finding the right module or template requires multiple attempts.

 Missing: multi-mode search_modules, by_nodes template filter, health_check

 ---
 3. Make API Surface (what the API can do once account is upgraded)

 The server currently calls 3 Make API endpoints. The full API offers much more.

 Endpoints to add (all under https://{region}.make.com/api/v2)

 ┌──────────────────────────┬──────────────────┐
 │         Endpoint         │ Maps to new tool │
 ├──────────────────────────┼──────────────────┤
 │ GET /scenarios/{id}      │ get_scenario     │
 ├──────────────────────────┼──────────────────┤
 │ PATCH /scenarios/{id}    │ update_scenario  │
 ├──────────────────────────┼──────────────────┤
 │ DELETE /scenarios/{id}   │ delete_scenario  │
 ├──────────────────────────┼──────────────────┤
 │ POST /scenarios/{id}/run │ run_scenario     │
 ├──────────────────────────┼──────────────────┤
 │ GET /scenarios/{id}/logs │ list_executions  │
 ├──────────────────────────┼──────────────────┤
 │ GET /users/me            │ health_check     │
 └──────────────────────────┴──────────────────┘

 Auth: all use Authorization: Token {MAKE_API_KEY} — same pattern as existing calls.

 Required API key scopes (set when generating key in Make settings):

 ┌─────────────────┬───────────────────────────────────────────────┐
 │      Scope      │                  Needed for                   │
 ├─────────────────┼───────────────────────────────────────────────┤
 │ scenarios:read  │ get_scenario, list_scenarios, list_executions │
 ├─────────────────┼───────────────────────────────────────────────┤
 │ scenarios:write │ update_scenario, delete_scenario              │
 ├─────────────────┼───────────────────────────────────────────────┤
 │ scenarios:run   │ run_scenario, create_scenario                 │
 └─────────────────┴───────────────────────────────────────────────┘

 Free tier note: The current account is on the Make free tier. The endpoints above exist on all tiers but rate limits and execution quotas differ. Upgrading unlocks higher API rate limits and more execution history.
 The code already handles 401/403 errors gracefully — upgrading the account is purely an account change, no code change needed.

 Region: Configured via MAKE_API_URL env var (default https://eu1.make.com/api/v2). Must match the account region (eu1/eu2/us1/us2).

 ---
 4. Prioritised Implementation Roadmap

 Phase 1 — Complete the CRUD loop (do first)

 These three tools together enable the "build → test → fix → redeploy" loop that Claude Code needs.

 ┌─────────────────┬──────────────────────────────────────────────────┬────────┐
 │      Tool       │                   What it does                   │ Effort │
 ├─────────────────┼──────────────────────────────────────────────────┼────────┤
 │ get_scenario    │ Fetch a deployed scenario's full blueprint by ID │ Low    │
 ├─────────────────┼──────────────────────────────────────────────────┼────────┤
 │ update_scenario │ Overwrite blueprint + optional name/scheduling   │ Low    │
 ├─────────────────┼──────────────────────────────────────────────────┼────────┤
 │ delete_scenario │ Delete a scenario (requires confirm: true)       │ Low    │
 └─────────────────┴──────────────────────────────────────────────────┴────────┘

 After Phase 1: Claude can do full scenario lifecycle management without the user touching the Make UI.

 Phase 2 — Execution monitoring (do after account upgrade)

 ┌─────────────────┬───────────────────────────────────────────────────────┬────────┐
 │      Tool       │                     What it does                      │ Effort │
 ├─────────────────┼───────────────────────────────────────────────────────┼────────┤
 │ health_check    │ Verify API key is valid and account details           │ Low    │
 ├─────────────────┼───────────────────────────────────────────────────────┼────────┤
 │ run_scenario    │ Trigger a manual run, optionally wait for result      │ Low    │
 ├─────────────────┼───────────────────────────────────────────────────────┼────────┤
 │ list_executions │ Show recent execution history + errors for a scenario │ Low    │
 └─────────────────┴───────────────────────────────────────────────────────┴────────┘

 After Phase 2: Claude can deploy, test, and diagnose all in one conversation.

 Phase 3 — Discovery improvements (quality-of-life)

 These are enhancements to existing tools, not new tools. Each is a small change.

 ┌───────────────────────────────────────┬───────────────────┬─────────────────────────────────────────────────────────────────────────────────────┐
 │              Enhancement              │       Where       │                                    What changes                                     │
 ├───────────────────────────────────────┼───────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ AND mode for search_modules           │ db.ts + server.ts │ Add `mode: 'or'                                                                     │
 ├───────────────────────────────────────┼───────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ by_nodes for search_templates         │ db.ts + server.ts │ Add nodes: string[] param; filter templates by modules_used JSON array              │
 ├───────────────────────────────────────┼───────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ topic + depth for tools_documentation │ server.ts         │ Return only the requested tool's docs section; support 'essentials' vs 'full' depth │
 ├───────────────────────────────────────┼───────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
 │ profile for validate_scenario         │ server.ts         │ Add `'minimal'                                                                      │
 └───────────────────────────────────────┴───────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

 ---
 5. What NOT to Build

 ┌──────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────┐
 │           n8n-mcp feature            │                                        Why skip                                        │
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ Partial/diff workflow update         │ Make API replaces the full blueprint on PATCH — partial diffs not supported            │
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ Autofix workflow                     │ Already handled: create_scenario auto-heals, validate_scenario gives actionable errors │
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ Workflow version history             │ Make API does not expose version history                                               │
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ Node documentation in markdown       │ Make has no external markdown docs per module                                          │
 ├──────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────┤
 │ Connections/webhooks/datastores CRUD │ Out of scope for scenario-building focus; adds complexity without clear benefit        │
 └──────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────┘

 ---
 6. Project File Map (for next session)

 make mcp vibecoder/
 ├── src/
 │   ├── mcp/server.ts          ← All tool definitions (~2000 lines). Add new tools here.
 │   ├── database/db.ts         ← SQLite wrapper. Modify for search enhancements.
 │   └── database/schema.sql    ← DB schema. No changes needed for Phase 1/2.
 ├── tests/server.test.ts       ← Add tests for new tools here.
 ├── .env                       ← MAKE_API_KEY, MAKE_API_URL, MAKE_TEAM_ID, MAKE_ORGANIZATION_ID
 ├── data/make-modules.db       ← SQLite DB (source of truth at runtime)
 └── package.json               ← npm run build · npm test · npm run scrape

 Build commands:
 cd "make mcp vibecoder"
 npm run build   # compile TypeScript → dist/
 npm test        # run Vitest suite (currently 45 tests)
 npm run scrape  # rebuild SQLite DB from module catalog + blueprint folders

 ---
 7. Patterns to Follow (from existing code)

 Adding a new API tool

 // Pattern from create_scenario (server.ts ~line 1185)
 server.registerTool('tool_name', {
     title: 'Human Title',
     description: 'One sentence. Always mention what API scope is needed.',
     inputSchema: { scenarioId: z.number().describe('...') },
     annotations: { readOnlyHint: true },  // or destructiveHint: true for delete
 }, async ({ scenarioId }) => {
     try {
         const apiKey = process.env['MAKE_API_KEY'];
         if (!apiKey) return fail('MAKE_API_KEY not configured.');
         const baseUrl = getMakeBaseUrl();   // helper already in server.ts
         const res = await fetch(`${baseUrl}/scenarios/${scenarioId}`, {
             headers: { Authorization: `Token ${apiKey}` },
         });
         if (!res.ok) return fail(`Make API error: ${res.status}`);
         const data = await res.json();
         return ok(data);
     } catch (e: any) {
         return fail(e.message);
     }
 });

 Adding tests

 // Pattern from tests/server.test.ts
 it('should get scenario', async () => {
     // These tests run against real DB; mock API calls where needed
 });

 ---
 8. Testing Strategy After Account Upgrade

 Once the Make account is upgraded and the API key has full scopes:

 1. Set MAKE_API_KEY in .env with scopes: scenarios:read, scenarios:write, scenarios:run
 2. Run health_check → confirm account info is returned
 3. Create a test scenario via create_scenario → note the returned scenarioId
 4. Read it back via get_scenario → blueprint should match what was sent
 5. Rename it via update_scenario → verify name changed in list_scenarios
 6. Run it via run_scenario → verify list_executions shows the run
 7. Delete it via delete_scenario → verify it's gone from list_scenarios

 This is the full lifecycle smoke test. All 7 steps should be doable in one Claude Code conversation using the MCP tools directly.

 ---
 9. Success Definition

 The Make Vibecoder MCP is "done" when a Claude Code session can:

 1. Discover the right modules and templates for a task (search)
 2. Build a valid scenario blueprint (get_module + validate_scenario)
 3. Deploy it to Make.com (create_scenario)
 4. Verify it runs correctly (run_scenario + list_executions)
 5. Iterate — fix errors and update the deployed scenario (get_scenario + update_scenario)

 All five steps without leaving Claude Code, without touching the Make UI.