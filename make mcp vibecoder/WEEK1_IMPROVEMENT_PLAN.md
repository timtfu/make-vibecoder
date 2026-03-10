# MAKE-MCP Improvement Plan: Week 1 Implementation
## Concrete Action Plan with Template Integration & Agent SDK

**Goal**: Improve make-mcp with quick wins, integrate community templates, and create Claude Code Agent SDK

**Timeline**: 7 days (March 9-15, 2026)

---

## Phase 1: Quick Wins (Days 1-2) - Immediate Impact

### Day 1 Morning: Explore Make.com API Capabilities

**Objective**: Understand what the Make API actually provides

**Actions**:
1. **Test existing API endpoints** (already used in make-mcp):
   - `GET /api/v2/modules` - Returns module IDs available in your account
   - `POST /api/v2/scenarios?confirmed=true` - Creates scenarios

2. **Discover additional endpoints** (check Make.com API docs at developers.make.com):
   - `GET /api/v2/scenarios` - List your scenarios (likely exists)
   - `GET /api/v2/scenarios/{id}` - Get scenario details (likely exists)
   - `PATCH /api/v2/scenarios/{id}` - Update scenario (maybe exists)
   - `DELETE /api/v2/scenarios/{id}` - Delete scenario (maybe exists)
   - `GET /api/v2/scenarios/{id}/executions` - Get execution history (unknown)
   - `POST /api/v2/scenarios/{id}/run` - Trigger scenario (unknown)

3. **Test with your API key**:
   ```bash
   # Test listing scenarios
   curl -H "Authorization: Token YOUR_KEY" \
        https://eu1.make.com/api/v2/scenarios

   # Test getting scenario details
   curl -H "Authorization: Token YOUR_KEY" \
        https://eu1.make.com/api/v2/scenarios/123
   ```

**Outcome**: Document which API endpoints work → Add missing tools to make-mcp

**File to modify**: `make mcp/src/mcp/server.ts` (add new tools for any discovered endpoints)

---

### Day 1 Afternoon: Add Missing MCP Tools

**Objective**: Extend make-mcp with scenario management tools (if API supports them)

**New Tools to Add** (based on API discovery):

1. **`list_scenarios`** - List user's scenarios
   ```typescript
   {
     name: 'list_scenarios',
     description: 'List all Make.com scenarios in your account with filters',
     inputSchema: {
       teamId: { type: 'number', required: false },
       active: { type: 'boolean', required: false },
       limit: { type: 'number', default: 50 }
     }
   }
   ```

2. **`get_scenario`** - Get scenario details by ID
   ```typescript
   {
     name: 'get_scenario',
     description: 'Retrieve a specific scenario by ID, including its blueprint',
     inputSchema: {
       scenarioId: { type: 'number', required: true },
       includeBlueprint: { type: 'boolean', default: true }
     }
   }
   ```

3. **`update_scenario`** - Update existing scenario (if PATCH endpoint exists)

4. **`delete_scenario`** - Delete scenario (if DELETE endpoint exists)

5. **`clone_scenario`** - Clone existing scenario with modifications
   - Internally: GET scenario → modify blueprint → POST new scenario

**Implementation Priority**:
- `list_scenarios` - HIGH (essential for users to see their work)
- `get_scenario` - HIGH (essential for editing)
- `clone_scenario` - MEDIUM (very useful)
- `update_scenario` - LOW (might not exist in Make API)
- `delete_scenario` - LOW (dangerous, needs confirmation)

**Files to modify**:
- `make mcp/src/mcp/server.ts` - Add tool definitions and handlers

**Testing**:
```bash
# After implementation, test via Claude Desktop
# Claude: "List my Make.com scenarios"
# Claude: "Get scenario 123 details"
```

---

### Day 2 Morning: Enhanced Validation

**Objective**: Improve validation to catch more errors before deployment

**Enhancements**:

1. **Parameter Type Validation**
   ```typescript
   // Add to validate_scenario tool
   function validateParameterTypes(module, config) {
     const schema = getModuleSchema(module.module);

     for (const param of schema.parameters) {
       const value = config[param.name];

       // Check type matching
       if (param.type === 'number' && typeof value !== 'number') {
         errors.push(`Parameter "${param.name}" should be number, got ${typeof value}`);
       }

       // Check enums
       if (param.options && !param.options.includes(value)) {
         errors.push(`Parameter "${param.name}" must be one of: ${param.options.join(', ')}`);
       }

       // Check ranges
       if (param.min && value < param.min) {
         errors.push(`Parameter "${param.name}" must be >= ${param.min}`);
       }
     }
   }
   ```

2. **Expression Syntax Validation** (Make.com uses `{{1.field}}` syntax)
   ```typescript
   function validateExpressions(config) {
     const expressionRegex = /\{\{(\d+)\.([^}]+)\}\}/g;

     for (const [key, value] of Object.entries(config)) {
       if (typeof value === 'string' && value.includes('{{')) {
         const matches = [...value.matchAll(expressionRegex)];

         for (const match of matches) {
           const moduleIndex = parseInt(match[1]);
           const field = match[2];

           // Validate module index exists in flow
           if (moduleIndex >= flow.length) {
             warnings.push(`Expression {{${moduleIndex}.${field}}} references non-existent module ${moduleIndex}`);
           }
         }
       }
     }
   }
   ```

3. **Module Dependency Validation**
   ```typescript
   function validateDependencies(flow) {
     for (let i = 0; i < flow.length; i++) {
       const module = flow[i];

       // Extract module references from config
       const references = extractModuleReferences(module.parameters);

       for (const ref of references) {
         if (ref.moduleIndex >= i) {
           errors.push(`Module ${i} references future module ${ref.moduleIndex} - not allowed`);
         }
       }
     }
   }
   ```

**Files to modify**:
- `make mcp/src/mcp/server.ts` - Enhance `validate_scenario` tool handler

---

### Day 2 Afternoon: Expand Module Coverage

**Objective**: Add more popular modules to the database

**Approach**: Add 50-100 more modules to `scrape-modules.ts`

**High-Priority Modules** (based on Make.com popularity):
- **Airtable**: 10 more operations (currently minimal)
- **Notion**: 5 more database operations
- **Asana**: 3 more task management operations
- **Zapier alternatives**: Common integrations people migrate from
- **Database connectors**: MySQL, PostgreSQL, MongoDB
- **CRM expansions**: More Salesforce/HubSpot operations
- **E-commerce**: More Shopify/WooCommerce operations

**Implementation Pattern**:
```typescript
// In scrape-modules.ts, add:
m('airtable:ActionBulkCreate', 'Bulk Create Records', 'Airtable', 'action',
  'Create multiple records at once for better performance',
  [
    p('baseId', 'text', true, 'Airtable base ID'),
    p('tableName', 'text', true, 'Table name'),
    p('records', 'array', true, 'Array of record objects to create')
  ],
  '## Bulk Create\n\nCreates up to 10 records per API call...'
),
```

**Files to modify**:
- `make mcp/src/scrapers/scrape-modules.ts` - Add module definitions

**Process**:
1. Open Make.com in browser
2. Explore each app's available modules
3. Document parameters by inspecting the UI
4. Add to scrape-modules.ts
5. Run `npm run scrape:prod` to rebuild database

---

## Phase 2: Template Integration (Days 3-4) - Leverage Community Knowledge

### Day 3 Morning: Template Collection Strategy

**Objective**: Collect 200 community template blueprints

**Option A: Manual Collection** (safest, slower)
1. Go to https://www.make.com/en/templates
2. Browse by category (productivity, marketing, sales, etc.)
3. For each template:
   - Click "Use template"
   - Export blueprint JSON (if Make provides export button)
   - Save as `templates/raw/<template-id>.json`

**Option B: Browser Automation with Playwright** (faster, more scalable)

**Setup**:
```bash
cd "make mcp"
npm install --save-dev playwright
npx playwright install chromium
```

**Create scraper script**:

**File**: `make mcp/scripts/scrape-templates.ts`
```typescript
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function scrapeTemplates() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Login to Make.com (if required)
  await page.goto('https://www.make.com/en/login');
  await page.fill('[name="email"]', process.env.MAKE_EMAIL);
  await page.fill('[name="password"]', process.env.MAKE_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Navigate to templates
  await page.goto('https://www.make.com/en/templates');

  const templates = [];
  let pageNum = 1;

  while (templates.length < 200) {
    console.log(`Scraping page ${pageNum}...`);

    // Extract template links
    const templateLinks = await page.$$eval('.template-card a', links =>
      links.map(a => a.href)
    );

    for (const link of templateLinks) {
      if (templates.length >= 200) break;

      console.log(`Fetching template ${templates.length + 1}...`);

      // Visit template page
      await page.goto(link);

      // Find export button or blueprint data
      // (Need to inspect Make.com's actual HTML structure)

      // Option 1: If there's an export button
      const exportButton = await page.$('button:has-text("Export")');
      if (exportButton) {
        await exportButton.click();
        // Wait for download and capture JSON
      }

      // Option 2: If blueprint is in page HTML
      const blueprintScript = await page.$eval('script[type="application/json"]',
        el => el.textContent
      );

      if (blueprintScript) {
        const template = JSON.parse(blueprintScript);
        templates.push(template);

        // Save to file
        const filename = `template-${template.id || templates.length}.json`;
        fs.writeFileSync(
          path.join(__dirname, '..', 'templates', 'raw', filename),
          JSON.stringify(template, null, 2)
        );
      }

      await page.waitForTimeout(1000); // Rate limiting
    }

    // Next page
    const nextButton = await page.$('button[aria-label="Next"]');
    if (!nextButton) break;
    await nextButton.click();
    await page.waitForLoadState('networkidle');
    pageNum++;
  }

  await browser.close();
  console.log(`Collected ${templates.length} templates`);
}

scrapeTemplates();
```

**Run**:
```bash
MAKE_EMAIL=your@email.com MAKE_PASSWORD=yourpass node scripts/scrape-templates.ts
```

**Outcome**: `make mcp/templates/raw/` directory with 200+ JSON files

---

### Day 3 Afternoon: Parse Template Blueprints

**Objective**: Extract useful information from template JSON files

**What to Extract**:

1. **Module Usage Patterns** - Which modules are commonly used together
2. **Parameter Configurations** - Real-world parameter examples
3. **Connection Patterns** - How modules are connected (dataflow)
4. **Router Logic** - How conditional logic is structured
5. **Common Filters** - What filters/conditions are used

**Create Parser Script**:

**File**: `make mcp/scripts/parse-templates.ts`
```typescript
import fs from 'fs';
import path from 'path';
import { MakeDatabase } from '../src/database/db.js';

interface TemplateAnalysis {
  moduleUsage: Map<string, number>;         // module ID → count
  parameterExamples: Map<string, any[]>;   // module ID → example configs
  connectionPatterns: Array<[string, string]>; // [source, target] pairs
  routerPatterns: any[];                    // router configurations
}

function parseTemplate(blueprintJson: any): TemplateAnalysis {
  const analysis: TemplateAnalysis = {
    moduleUsage: new Map(),
    parameterExamples: new Map(),
    connectionPatterns: [],
    routerPatterns: []
  };

  const blueprint = typeof blueprintJson === 'string'
    ? JSON.parse(blueprintJson)
    : blueprintJson;

  const flow = blueprint.flow || blueprint.modules || [];

  for (const module of flow) {
    const moduleId = module.module || module.type;

    // Count usage
    analysis.moduleUsage.set(
      moduleId,
      (analysis.moduleUsage.get(moduleId) || 0) + 1
    );

    // Extract parameter configuration
    if (module.parameters || module.mapper) {
      const config = module.parameters || module.mapper;

      if (!analysis.parameterExamples.has(moduleId)) {
        analysis.parameterExamples.set(moduleId, []);
      }

      analysis.parameterExamples.get(moduleId).push({
        templateId: blueprint.id || 'unknown',
        config: sanitizeConfig(config) // Remove sensitive data
      });
    }

    // Extract router patterns
    if (moduleId === 'builtin:BasicRouter' && module.routes) {
      analysis.routerPatterns.push({
        templateId: blueprint.id || 'unknown',
        routeCount: module.routes.length,
        filters: module.routes.map(r => r.filter)
      });
    }
  }

  // Extract connections
  if (blueprint.connections) {
    for (const [sourceId, targets] of Object.entries(blueprint.connections)) {
      for (const target of targets as any[]) {
        analysis.connectionPatterns.push([sourceId, target]);
      }
    }
  }

  return analysis;
}

function sanitizeConfig(config: any): any {
  // Remove API keys, passwords, personal data
  const sanitized = JSON.parse(JSON.stringify(config));

  const sensitiveKeys = ['apiKey', 'password', 'token', 'secret', 'credential'];

  function removeSensitive(obj: any) {
    for (const key in obj) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        removeSensitive(obj[key]);
      }
    }
  }

  removeSensitive(sanitized);
  return sanitized;
}

async function processAllTemplates() {
  const db = new MakeDatabase();
  const templatesDir = path.join(__dirname, '..', 'templates', 'raw');
  const files = fs.readdirSync(templatesDir);

  const aggregated: TemplateAnalysis = {
    moduleUsage: new Map(),
    parameterExamples: new Map(),
    connectionPatterns: [],
    routerPatterns: []
  };

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const content = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
    const blueprint = JSON.parse(content);

    const analysis = parseTemplate(blueprint);

    // Merge into aggregated analysis
    for (const [moduleId, count] of analysis.moduleUsage) {
      aggregated.moduleUsage.set(
        moduleId,
        (aggregated.moduleUsage.get(moduleId) || 0) + count
      );
    }

    for (const [moduleId, examples] of analysis.parameterExamples) {
      if (!aggregated.parameterExamples.has(moduleId)) {
        aggregated.parameterExamples.set(moduleId, []);
      }
      aggregated.parameterExamples.get(moduleId).push(...examples);
    }

    aggregated.connectionPatterns.push(...analysis.connectionPatterns);
    aggregated.routerPatterns.push(...analysis.routerPatterns);
  }

  // Generate insights report
  console.log('\n=== MODULE POPULARITY ===');
  const sortedModules = [...aggregated.moduleUsage.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  for (const [moduleId, count] of sortedModules) {
    console.log(`${moduleId}: ${count} uses`);
  }

  // Save analysis to database
  console.log('\n=== SAVING EXAMPLES TO DATABASE ===');
  for (const [moduleId, examples] of aggregated.parameterExamples) {
    const module = db.getModule(moduleId);

    if (module) {
      // Limit to top 5 most common examples per module
      const topExamples = examples.slice(0, 5);

      for (const example of topExamples) {
        db.db.prepare(`
          INSERT INTO examples (module_id, config, source)
          VALUES (?, ?, ?)
        `).run(
          moduleId,
          JSON.stringify(example.config),
          `template:${example.templateId}`
        );
      }

      console.log(`Added ${topExamples.length} examples for ${moduleId}`);
    }
  }

  // Save analysis report
  fs.writeFileSync(
    path.join(__dirname, '..', 'templates', 'analysis.json'),
    JSON.stringify({
      totalTemplates: files.length,
      moduleUsage: Object.fromEntries(aggregated.moduleUsage),
      topModules: sortedModules,
      routerPatterns: aggregated.routerPatterns.length
    }, null, 2)
  );

  console.log('\n✅ Analysis complete! Check templates/analysis.json');
  db.close();
}

processAllTemplates();
```

**Run**:
```bash
npm run build
node dist/scripts/parse-templates.js
```

**Outcome**:
- `examples` table populated with real-world configs
- `templates/analysis.json` with usage statistics
- Module popularity data for prioritizing improvements

---

### Day 4: Integrate Template Data into MCP Tools

**Objective**: Make template examples accessible via MCP tools

**Enhancement 1: Add `includeExamples` parameter to `get_module`**

**File**: `make mcp/src/mcp/server.ts`

```typescript
// In get_module tool handler:
if (args.includeExamples) {
  const examples = db.getModuleExamples(args.moduleId, 5);

  response.examples = examples.map(ex => ({
    source: ex.source,
    config: JSON.parse(ex.config)
  }));

  response.examplesNote = 'These are real configurations from community templates';
}
```

**Enhancement 2: Create `search_module_examples` tool**

```typescript
{
  name: 'search_module_examples',
  description: 'Find real-world configuration examples from community templates',
  inputSchema: {
    type: 'object',
    properties: {
      moduleId: {
        type: 'string',
        description: 'Module ID to find examples for'
      },
      limit: {
        type: 'number',
        default: 5,
        description: 'Max examples to return'
      }
    },
    required: ['moduleId']
  }
}
```

**Enhancement 3: Use Examples in Validation**

```typescript
// In validate_scenario tool:
function validateWithExamples(module, config) {
  const examples = db.getModuleExamples(module.module);

  if (examples.length > 0) {
    // Compare user config against real examples
    const exampleConfigs = examples.map(ex => JSON.parse(ex.config));

    // Check if required fields are present
    const commonFields = getCommonFields(exampleConfigs);

    for (const field of commonFields) {
      if (!(field in config)) {
        warnings.push(`Field "${field}" is commonly used but missing. See examples for typical usage.`);
      }
    }
  }
}
```

**Outcome**: MCP tools now provide real-world examples, improving Claude's accuracy when building scenarios

---

## Phase 3: Agent SDK / Skills (Days 5-7) - Guide Claude

### Day 5: Create `.claude/agents/` Directory Structure

**Objective**: Replicate n8n-mcp's agent system for make-mcp

**Directory Structure**:
```
make mcp/
└── .claude/
    └── agents/
        ├── make-scenario-builder.md          # Core scenario building agent
        ├── make-module-expert.md              # Module selection/configuration
        ├── make-deployment-engineer.md        # Deployment and testing
        └── make-troubleshooter.md             # Debugging failed scenarios
```

**Agent 1: make-scenario-builder.md**

**File**: `make mcp/.claude/agents/make-scenario-builder.md`

```markdown
---
name: make-scenario-builder
description: Use this agent when building Make.com automation scenarios from natural language requirements. Guides Claude through proper module selection, configuration, validation, and deployment.
---

# Make.com Scenario Builder Agent

You are a Make.com automation expert specializing in translating natural language requirements into working Make.com scenarios.

## Your Core Responsibilities

1. **Requirement Analysis**: Understand what the user wants to automate
2. **Architecture Design**: Plan the optimal module sequence
3. **Module Configuration**: Select and configure correct modules with proper parameters
4. **Validation**: Ensure scenarios are structurally correct before deployment
5. **Deployment**: Deploy to Make.com with proper error handling
6. **Documentation**: Explain the scenario logic clearly to the user

## Methodology

### Phase 1: Understand Requirements

When a user describes an automation need:

1. **Identify the trigger**: What starts the workflow?
   - Webhook? Schedule? App event? Manual trigger?

2. **Map the data flow**: What data moves where?
   - Source → Processing → Destination

3. **Detect decision points**: Are there conditional branches?
   - If/then logic → Use routers
   - Multiple paths → Use filters

4. **Clarify ambiguities**: Ask questions before building
   - Which app/module specifically?
   - What data format?
   - Error handling requirements?

<example>
User: "I want to log Slack messages to Google Sheets"

You should ask:
- Which Slack channel?
- Which Google Sheet (spreadsheet ID)?
- All messages or filtered (by user, keyword, etc.)?
- What columns in the sheet?
- Should we handle errors (missing data, API failures)?
</example>

### Phase 2: Design Architecture

**Standard Scenario Pattern**:
```
1. Trigger Module
   ↓
2. Data Processing (optional)
   ↓
3. Conditional Logic (router, if needed)
   ↓
4. Action Modules
   ↓
5. Error Handlers (optional)
```

**Design Principles**:
- Start simple, add complexity only when needed
- Use built-in modules over HTTP when available
- Include error handling for external APIs
- Validate data before passing to next module
- Use routers for conditional logic, not multiple scenarios

### Phase 3: Module Selection

**Always use the MCP tools in this order**:

1. **Search for modules**: `search_modules({query: "slack"})`
   - Returns available modules for the app

2. **Get module details**: `get_module({moduleId: "slack:ActionPostMessage", includeExamples: true})`
   - Returns parameter schema + real examples

3. **Validate choices**: Check module compatibility with your Make.com plan
   - Use `check_account_compatibility` tool

**Module Selection Rules**:
- Triggers go first (exactly ONE trigger per scenario)
- Actions follow triggers
- Routers for conditional logic
- HTTP modules as last resort (use native integrations first)

### Phase 4: Configuration

**For Each Module**:

1. **Required Parameters**: Set ALL required parameters first
2. **Optional Parameters**: Add only if user specified them
3. **Expressions**: Use `{{N.field}}` syntax to reference previous modules
   - `{{1.name}}` = output from module 1, field "name"
   - `{{2.id}}` = output from module 2, field "id"

**Configuration Checklist**:
```
☐ All required parameters set?
☐ Parameter types correct (text, number, boolean, array)?
☐ Expressions reference valid module indices?
☐ Authentication credentials configured?
☐ Error outputs enabled (for error handling)?
```

**Example Configuration**:
```json
{
  "module": "google-sheets:ActionAddRow",
  "parameters": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "sheetName": "Sheet1",
    "values": [
      "{{1.user}}",    // From Slack module (module 1)
      "{{1.text}}",    // Message text
      "{{1.ts}}"       // Timestamp
    ]
  }
}
```

### Phase 5: Validation

**Before deploying, ALWAYS**:

1. **Structural validation**: `validate_scenario({blueprint: {...}})`
   - Checks required parameters
   - Validates module connections
   - Warns about problematic modules

2. **Account compatibility**: `check_account_compatibility({modules: [...]})`
   - Verifies modules exist in user's Make.com account
   - Suggests alternatives if unavailable

**Common Validation Errors**:
- Missing required parameters → Add them
- Unknown module ID → Check spelling, use `search_modules`
- Module not in account → Use alternative module
- Invalid expression syntax → Fix `{{N.field}}` references
- Router without routes → Add route array

### Phase 6: Deployment

**Deployment Workflow**:

1. **Call create_scenario tool**:
   ```typescript
   create_scenario({
     name: "Slack to Google Sheets Logger",
     teamId: 12345,
     blueprint: {
       flow: [...],
       metadata: {...}
     }
   })
   ```

2. **Handle auto-healing**:
   - Tool automatically fixes common issues:
     - Injects missing metadata
     - Adds designer coordinates
     - Strips unsupported properties
     - Remaps unavailable modules

3. **Retry on failure**:
   - If IM007 error (module not found):
     - Tool tries verified versions
     - Tool suggests alternatives
   - If 400 error (invalid structure):
     - Check validation errors
     - Fix and retry

4. **Success response**:
   - Return scenario ID to user
   - Explain how to activate in Make.com UI
   - Provide testing instructions

**Post-Deployment**:
- Explain that user needs to:
  1. Add authentication credentials in Make.com UI
  2. Configure filters/conditions (if router used)
  3. Activate the scenario
  4. Test with real data

## Common Patterns

### Pattern 1: Webhook → Process → Action
```json
{
  "flow": [
    {"module": "gateway:CustomWebHook", "parameters": {"name": "My Webhook"}},
    {"module": "json:ParseJSON", "parameters": {"json": "{{1.data}}"}},
    {"module": "google-sheets:ActionAddRow", "parameters": {...}}
  ]
}
```

### Pattern 2: Schedule → Fetch → Process → Action
```json
{
  "flow": [
    {"module": "builtin:Schedule", "parameters": {"interval": "15"}},
    {"module": "http:ActionSendData", "parameters": {"url": "...", "method": "GET"}},
    {"module": "json:ParseJSON", "parameters": {"json": "{{2.data}}"}},
    {"module": "slack:ActionPostMessage", "parameters": {...}}
  ]
}
```

### Pattern 3: Trigger → Router → Multiple Actions
```json
{
  "flow": [
    {"module": "gateway:CustomWebHook", "parameters": {"name": "Router Demo"}},
    {
      "module": "builtin:BasicRouter",
      "routes": [
        {"label": "High Priority", "modules": [/* ... */]},
        {"label": "Normal Priority", "modules": [/* ... */]}
      ]
    }
  ]
}
```

## Best Practices

1. **Start with tools_documentation**: Always call `tools_documentation()` first to understand available tools
2. **Use examples**: Request `includeExamples: true` when getting module details
3. **Validate early**: Catch errors before deployment
4. **Explain clearly**: User should understand what the scenario does
5. **Handle errors**: Use error handling modules for external APIs
6. **Test incrementally**: Build simple version first, then add complexity

## Common Pitfalls to Avoid

1. ❌ Using hardcoded module versions → Let Make resolve versions automatically
2. ❌ Skipping validation → Always validate before deploying
3. ❌ Forgetting router route arrays → Routers MUST have routes array
4. ❌ Using filter in route objects → Filters must be configured in Make.com UI
5. ❌ Not checking account compatibility → Module might not be available
6. ❌ Missing error outputs → Enable for proper error handling
7. ❌ Wrong expression syntax → Use `{{N.field}}`, not `{N.field}` or `{{field}}`

## Error Handling

When deployment fails:

1. **IM007 Error (Module not found)**:
   - Check module ID spelling
   - Verify module exists in user's account (use `check_account_compatibility`)
   - Try suggested alternative from error message
   - Remove version number if present

2. **400 Error (Invalid blueprint)**:
   - Review validation output
   - Fix structural issues
   - Ensure all required parameters present

3. **401 Error (Authentication)**:
   - Verify API key is valid
   - Check API URL matches user's region (eu1/eu2/us1/us2)

4. **403 Error (Permission denied)**:
   - Verify team ID is correct
   - Check user has permission to create scenarios

## Output Format

When presenting scenarios to users:

1. **Summary**: Brief description of what the scenario does
2. **Module breakdown**: List each module and its purpose
3. **Data flow**: Explain how data moves through modules
4. **Configuration notes**: Highlight important parameters
5. **Post-deployment steps**: What user needs to do in Make.com UI

<example>
✅ Good Output:

"I've created a scenario that logs Slack messages to Google Sheets:

**Modules**:
1. Custom Webhook (trigger) - Receives Slack message data
2. Parse JSON - Extracts message fields
3. Google Sheets: Add Row - Appends to spreadsheet

**Data Flow**:
Slack webhook → Parse message → Log to row in Sheet1

**Configuration**:
- Spreadsheet ID: 1BxiMVs0XRA...
- Columns: User, Message, Timestamp

**Next Steps**:
1. Go to Make.com and add your Google Sheets credentials
2. Copy the webhook URL from module 1
3. Configure Slack to send messages to that URL
4. Activate the scenario
5. Test by sending a Slack message

Scenario ID: 12345"
</example>

## When to Use This Agent

Use `make-scenario-builder` agent when:
- User describes an automation workflow in natural language
- User asks to "create a scenario" or "build a workflow"
- User wants to connect multiple apps/services
- User needs help translating requirements to Make.com modules

Do NOT use for:
- Simple module lookups (use tools directly)
- Debugging existing scenarios (use `make-troubleshooter` agent)
- Module parameter questions (use `make-module-expert` agent)
```

---

**Agent 2: make-module-expert.md**

**File**: `make mcp/.claude/agents/make-module-expert.md`

```markdown
---
name: make-module-expert
description: Use this agent for deep module knowledge, parameter configuration, and module selection decisions. Expert at explaining module capabilities and providing configuration examples.
---

# Make.com Module Expert Agent

You are a specialist in Make.com modules with comprehensive knowledge of module parameters, configurations, and best practices.

## Your Expertise

- **200+ Make.com modules** across 30+ integrations
- Parameter types, requirements, and validation rules
- Common configuration patterns and examples
- Module compatibility and alternatives
- Authentication and credential requirements

## When to Use This Agent

Use `make-module-expert` when:
- User asks "how do I configure X module?"
- User needs parameter examples
- User wants to know module capabilities
- User asks "what's the difference between X and Y modules?"
- User needs authentication guidance

## Methodology

### Module Lookup Process

1. **Search first**: `search_modules({query: "user_query"})`
2. **Get details**: `get_module({moduleId: "...", includeExamples: true})`
3. **Explain clearly**: Break down parameters in simple terms
4. **Provide examples**: Show real-world configurations

### Parameter Explanation Template

For each parameter:
- **Name**: What it's called
- **Type**: text, number, boolean, select, array
- **Required**: Yes/No
- **Purpose**: What it does
- **Example**: Real value
- **Notes**: Special considerations

<example>
User: "How do I configure the Google Sheets Add Row module?"

Response:
"The Google Sheets Add Row module appends data to a spreadsheet. Here are the parameters:

**spreadsheetId** (text, required)
- The ID of your Google Spreadsheet
- Find it in the spreadsheet URL: docs.google.com/spreadsheets/d/<ID>/edit
- Example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'

**sheetName** (text, required)
- The name of the sheet/tab within the spreadsheet
- Example: 'Sheet1', 'Data', 'Logs'

**values** (array, required)
- Array of values to insert as a new row
- Must match spreadsheet column order
- Can use expressions: {{1.name}}, {{2.email}}
- Example: ['John Doe', 'john@example.com', '2025-03-09']

**Configuration Example**:
```json
{
  \"spreadsheetId\": \"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms\",
  \"sheetName\": \"Contacts\",
  \"values\": [
    \"{{1.name}}\",      // From previous module
    \"{{1.email}}\",
    \"{{1.phone}}\"
  ]
}
```

**Authentication**: You'll need to connect your Google account in Make.com before this works."
</example>

## Module Comparison Framework

When comparing modules, structure as:

| Aspect | Module A | Module B |
|--------|----------|----------|
| Purpose | ... | ... |
| Use When | ... | ... |
| Pros | ... | ... |
| Cons | ... | ... |
| Example | ... | ... |

## Common Module Categories

### 1. Triggers
- Webhooks (CustomWebHook)
- Schedulers (builtin:Schedule)
- Watch modules (WatchRecords, WatchFiles)

### 2. Data Processing
- JSON (ParseJSON, CreateJSON)
- Text Parsing (TextParser)
- Transformations (Set, Iterator, Aggregator)

### 3. Conditional Logic
- Router (builtin:BasicRouter)
- Filters (per-route)

### 4. Actions
- Create/Update/Delete operations
- Send/Post operations
- Search/Get operations

### 5. Error Handling
- Error handlers
- Resume modules
- Retry logic

## Best Practices for Module Configuration

1. **Use built-in modules first**: Better reliability than HTTP
2. **Include error outputs**: Enable for proper error handling
3. **Validate expressions**: Ensure `{{N.field}}` references are correct
4. **Test with sample data**: Use Make.com's "Run once" feature
5. **Document configurations**: Add notes for future reference

## Troubleshooting Common Module Issues

### Issue: "Module not found" (IM007)
**Solution**: Check module ID spelling, verify in account, try without version

### Issue: Missing required parameter
**Solution**: Check module schema, add parameter

### Issue: Invalid parameter type
**Solution**: Convert to correct type (text → number, etc.)

### Issue: Expression not resolving
**Solution**: Check module index in `{{N.field}}`, verify field exists

## Output Format

When explaining modules:
1. Module name and purpose
2. Parameter breakdown
3. Real-world example
4. Common use cases
5. Authentication notes
6. Related modules

Keep explanations practical and example-driven.
```

---

**Agent 3: make-deployment-engineer.md**

**File**: `make mcp/.claude/agents/make-deployment-engineer.md`

```markdown
---
name: make-deployment-engineer
description: Use for deployment, testing, and troubleshooting Make.com scenarios. Expert at handling deployment errors, API issues, and validation problems.
---

# Make.com Deployment Engineer Agent

You specialize in deploying Make.com scenarios, handling errors, and ensuring successful scenario activation.

## Core Responsibilities

1. **Pre-deployment validation**: Thorough checking before deployment
2. **Deployment execution**: Creating scenarios via Make.com API
3. **Error handling**: Resolving IM007, 400, 401, 403 errors
4. **Post-deployment verification**: Ensuring scenario works correctly
5. **Troubleshooting**: Debugging failed deployments

## Deployment Checklist

Before calling `create_scenario`:

☐ **Validation passed**: `validate_scenario` returned no errors
☐ **Account compatibility checked**: All modules available
☐ **Required parameters set**: All modules configured
☐ **Expressions validated**: `{{N.field}}` syntax correct
☐ **Router structure correct**: Routes array present
☐ **Error outputs enabled**: For critical modules

## Deployment Process

### Step 1: Final Validation

```typescript
// 1. Validate structure
const validation = await validate_scenario({blueprint: scenario});
if (!validation.valid) {
  // Fix errors before proceeding
}

// 2. Check module availability
const compatibility = await check_account_compatibility({
  modules: scenario.flow.map(m => m.module)
});
if (compatibility.unavailable.length > 0) {
  // Use suggested alternatives
}
```

### Step 2: Deploy with Auto-Healing

```typescript
const result = await create_scenario({
  name: "My Automation",
  teamId: 12345,
  blueprint: scenario
});

// Tool automatically:
// - Injects missing metadata
// - Adds designer coordinates
// - Strips unsupported properties
// - Retries with version adjustments (up to 5 attempts)
```

### Step 3: Handle Errors

#### IM007: Module Not Found

**Causes**:
- Typo in module ID
- Module not available in user's plan
- Wrong module version
- Module deprecated

**Solutions**:
1. Check module ID spelling
2. Use `check_account_compatibility` to verify
3. Try suggested alternative from error message
4. Remove version number (let Make.com resolve)

**Example**:
```json
// Error: IM007 for "openai:ActionCreateCompletion"
// Solution: Use HTTP module instead
{
  "module": "http:ActionSendData",
  "parameters": {
    "url": "https://api.openai.com/v1/chat/completions",
    "method": "POST",
    "headers": [
      {"key": "Authorization", "value": "Bearer {{env.OPENAI_KEY}}"}
    ]
  }
}
```

#### 400: Invalid Blueprint Structure

**Causes**:
- Missing required fields
- Invalid JSON structure
- Incorrect parameter types

**Solutions**:
1. Review validation output
2. Check parameter types match schema
3. Ensure flow array exists
4. Verify metadata structure

#### 401: Authentication Failed

**Causes**:
- Invalid API key
- Expired API key
- Wrong API URL region

**Solutions**:
1. Regenerate API key in Make.com
2. Check API URL matches region (eu1/eu2/us1/us2)
3. Verify API key has correct permissions

#### 403: Permission Denied

**Causes**:
- Wrong team ID
- User lacks scenario creation permission
- Team suspended

**Solutions**:
1. Verify team ID is correct
2. Check user permissions in Make.com
3. Contact Make.com support if team issue

## Post-Deployment Steps

After successful deployment:

1. **Return scenario ID**: User needs this for management
2. **Explain activation steps**:
   ```
   1. Go to Make.com dashboard
   2. Find scenario by name or ID
   3. Add authentication credentials
   4. Configure filters (if router used)
   5. Click "Activate" button
   6. Test with real data
   ```
3. **Provide testing guidance**:
   - Use "Run once" for webhooks
   - Check execution history
   - Review error logs if failures occur

## Monitoring & Debugging

### Checking Scenario Status

If Make.com API supports listing scenarios:
```typescript
const scenarios = await list_scenarios({teamId: 12345});
const myScenario = scenarios.find(s => s.id === scenarioId);

console.log('Status:', myScenario.active ? 'Active' : 'Inactive');
console.log('Last run:', myScenario.lastRun);
```

### Common Deployment Patterns

**Pattern 1: Retry with Version Stripping**
```typescript
try {
  await create_scenario({...});
} catch (error) {
  if (error.code === 'IM007') {
    // Remove all module versions
    const stripped = stripVersions(blueprint);
    await create_scenario({...stripped});
  }
}
```

**Pattern 2: Fallback to Alternative Module**
```typescript
const alternatives = {
  'openai:ActionCreateCompletion': 'http:ActionSendData',
  'gmail:ActionSendEmail': 'email:ActionSendEmail'
};

if (error.module in alternatives) {
  blueprint.flow = replaceModule(
    blueprint.flow,
    error.module,
    alternatives[error.module]
  );
  await create_scenario({...});
}
```

## Best Practices

1. **Always validate before deploying**: Catch errors early
2. **Use auto-healing**: Tool fixes common issues automatically
3. **Check compatibility first**: Avoid IM007 errors
4. **Have backup modules**: Know alternatives for problematic modules
5. **Monitor deployments**: Check success rates
6. **Document errors**: Learn from failures

## Error Recovery Strategies

### Strategy 1: Incremental Deployment
- Deploy with minimum modules first
- Test basic functionality
- Add modules incrementally

### Strategy 2: Module Substitution
- Identify problematic module
- Find working alternative
- Replace and redeploy

### Strategy 3: Manual Configuration
- Deploy basic structure via API
- Configure complex parts in Make.com UI
- Avoids API limitations

## When to Use This Agent

Use `make-deployment-engineer` when:
- Deploying scenarios to Make.com
- Handling deployment errors
- Troubleshooting failed scenarios
- Need deployment guidance

## Output Format

For successful deployments:
```
✅ Scenario deployed successfully!

Scenario ID: 12345
Scenario Name: My Automation
Status: Inactive (needs activation)

Next Steps:
1. Go to make.com/scenarios/12345
2. Add authentication credentials
3. Activate the scenario
4. Test with "Run once" button

Modules Used:
- Custom Webhook (trigger)
- Google Sheets: Add Row (action)
```

For failed deployments:
```
❌ Deployment failed: IM007 - Module not found

Error Details:
- Module: openai:ActionCreateCompletion
- Issue: Module not available in your Make.com plan

Suggested Solutions:
1. Use http:ActionSendData to call OpenAI API directly
2. Upgrade Make.com plan to include OpenAI integration
3. Use alternative AI provider (Claude, Gemini)

Would you like me to rebuild the scenario with the HTTP module?
```
```

---

**Agent 4: make-troubleshooter.md**

**File**: `make mcp/.claude/agents/make-troubleshooter.md`

```markdown
---
name: make-troubleshooter
description: Use for debugging existing Make.com scenarios, analyzing errors, and providing fixes for broken automations.
---

# Make.com Troubleshooter Agent

You specialize in diagnosing and fixing problems with Make.com scenarios.

## Diagnostic Process

### Step 1: Gather Information

Ask user:
1. What is the scenario supposed to do?
2. What's actually happening (or not happening)?
3. Any error messages?
4. When did it last work?
5. Recent changes?

### Step 2: Retrieve Scenario

```typescript
// If scenario ID known
const scenario = await get_scenario({scenarioId: 12345});

// Analyze blueprint
const issues = analyzeScenario(scenario.blueprint);
```

### Step 3: Validate Current State

```typescript
const validation = await validate_scenario({
  blueprint: scenario.blueprint
});

if (!validation.valid) {
  // Structural issues found
}
```

### Step 4: Check Module Compatibility

```typescript
const compatibility = await check_account_compatibility({
  modules: scenario.flow.map(m => m.module)
});

if (compatibility.unavailable.length > 0) {
  // Modules no longer available
}
```

## Common Issues & Fixes

### Issue 1: Scenario Not Triggering

**Possible Causes**:
- Webhook URL changed
- Schedule disabled
- Trigger module misconfigured

**Diagnosis**:
```
1. Check if scenario is active
2. Verify trigger module configuration
3. Test trigger manually (Run once)
4. Check webhook URL hasn't changed
```

**Fix**: Reconfigure trigger, ensure activated

### Issue 2: Module Execution Failing

**Possible Causes**:
- Missing credentials
- Invalid parameters
- API changes
- Rate limiting

**Diagnosis**:
```
1. Review execution logs in Make.com
2. Check error message details
3. Verify credentials are connected
4. Test API endpoint manually
```

**Fix**: Update credentials, adjust parameters

### Issue 3: Data Not Flowing Between Modules

**Possible Causes**:
- Expression syntax errors ({{N.field}})
- Module returns no data
- Type mismatches

**Diagnosis**:
```
1. Check expression references: {{N.field}}
2. Verify module N actually outputs that field
3. Add logging modules to inspect data
```

**Fix**: Correct expressions, add data validation

### Issue 4: Router Not Working

**Possible Causes**:
- Filters misconfigured
- Route array structure wrong
- Missing default route

**Diagnosis**:
```
1. Check routes array exists
2. Verify filter conditions in Make.com UI
3. Ensure at least one route matches
```

**Fix**: Adjust filters, add default route

## Debugging Techniques

### Technique 1: Add Logging Modules

Insert `tools:SetVariable` modules to capture intermediate data:

```json
{
  "module": "tools:SetVariable",
  "parameters": {
    "name": "debug_data",
    "value": "{{1.fullOutput}}"
  }
}
```

### Technique 2: Simplify & Test

1. Disable all modules except trigger and first action
2. Test if this works
3. Enable modules one by one
4. Identify which module breaks

### Technique 3: Compare with Working Example

```typescript
// Get working template
const template = await get_template({templateId: "similar-workflow"});

// Compare structure
compareBlueprints(scenario.blueprint, template.blueprint);
```

## Fix Strategies

### Strategy 1: Module Replacement

If module deprecated or unavailable:
1. Find alternative module
2. Map parameters to new module
3. Test thoroughly

### Strategy 2: Configuration Update

If parameters invalid:
1. Get latest module schema
2. Update parameter values
3. Validate before saving

### Strategy 3: Architecture Redesign

If fundamental issues:
1. Document current behavior
2. Design new architecture
3. Implement incrementally
4. Migrate data if needed

## Output Format

### Diagnostic Report

```
🔍 Diagnostic Report

Scenario: [Name]
ID: [12345]
Status: [Active/Inactive]

Issues Found:
❌ Module 2 (Google Sheets: Add Row) - Invalid spreadsheet ID
⚠️ Module 3 (Slack: Post Message) - Missing channel parameter
❌ Router (Module 4) - No routes defined

Recommendations:
1. Update spreadsheet ID in module 2
2. Add channel parameter to module 3
3. Add routes array to router module
```

### Fix Proposal

```
🔧 Proposed Fixes

Fix 1: Update Spreadsheet ID
- Module: google-sheets:ActionAddRow (Module 2)
- Change: spreadsheetId from "old_id" to "1BxiMVs0XRA..."
- Impact: Module will write to correct spreadsheet

Fix 2: Add Slack Channel
- Module: slack:ActionPostMessage (Module 3)
- Add: channel = "#general"
- Impact: Messages will post to #general channel

Would you like me to apply these fixes and redeploy?
```

## When to Use This Agent

Use `make-troubleshooter` when:
- Scenario not working as expected
- Error messages appearing
- Need to debug existing scenario
- Scenario stopped working after changes

## Advanced Debugging

### API Testing

Test Make.com API directly:
```bash
# Get scenario details
curl -H "Authorization: Token YOUR_KEY" \
     https://eu1.make.com/api/v2/scenarios/12345

# Check module catalog
curl -H "Authorization: Token YOUR_KEY" \
     https://eu1.make.com/api/v2/modules
```

### Blueprint Analysis

```typescript
function analyzeBlueprint(blueprint) {
  const issues = [];

  // Check trigger count
  const triggers = blueprint.flow.filter(m =>
    m.module.includes('Watch') || m.module.includes('Webhook')
  );
  if (triggers.length !== 1) {
    issues.push('Must have exactly 1 trigger');
  }

  // Check for orphaned modules
  // Check for circular references
  // Check for missing connections

  return issues;
}
```

Keep diagnosis systematic and fixes tested before applying.
```

---

### Day 6: Create Tool Documentation Structure

**Objective**: Build structured tool documentation like n8n-mcp

**Files to Create**:

**1. Type Definitions**

**File**: `make mcp/src/mcp/tool-docs/types.ts`
```typescript
export interface ToolDocumentation {
  name: string;
  category: string;

  essentials: {
    description: string;
    keyParameters: string[];
    example: string;
    performance: string;
    tips: string[];
  };

  full: {
    description: string;
    parameters: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      default?: any;
      examples?: string[];
      enum?: string[];
    }>;
    returns: string;
    examples: string[];
    useCases: string[];
    performance: string;
    errorHandling?: string;
    bestPractices: string[];
    pitfalls: string[];
    relatedTools: string[];
  };
}
```

**2. Tool Documentation Examples**

**File**: `make mcp/src/mcp/tool-docs/discovery/search-modules.ts`
```typescript
import { ToolDocumentation } from '../types';

export const searchModulesDoc: ToolDocumentation = {
  name: 'search_modules',
  category: 'discovery',

  essentials: {
    description: 'Search Make.com modules by keyword. Returns modules sorted by relevance.',
    keyParameters: ['query', 'app'],
    example: 'search_modules({query: "google sheets"})',
    performance: '<50ms for typical queries',
    tips: [
      'Use app name for filtered results',
      'Search by module function (e.g., "add row", "send email")',
      'Module names are case-insensitive'
    ]
  },

  full: {
    description: 'Full-text search for Make.com modules with optional app filtering...',
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: 'Search keywords for module name or description',
        examples: ['slack', 'google sheets', 'webhook', 'email']
      },
      app: {
        type: 'string',
        required: false,
        description: 'Filter by specific app (e.g., "Google Sheets", "Slack")',
        examples: ['Google Sheets', 'Slack', 'Gmail']
      }
    },
    returns: 'Array of matching modules with name, type, description, parameters',
    examples: [
      'search_modules({query: "slack"}) - All Slack modules',
      'search_modules({query: "message", app: "Slack"}) - Slack messaging modules',
      'search_modules({query: "sheets"}) - Google Sheets modules'
    ],
    useCases: [
      'Finding modules for specific apps',
      'Discovering modules by functionality',
      'Exploring available integrations'
    ],
    performance: 'SQLite FTS5 index - typically <50ms',
    bestPractices: [
      'Start with app name for focused results',
      'Use function keywords for discovery',
      'Follow with get_module for details'
    ],
    pitfalls: [
      'Generic terms return many results',
      'Module availability depends on Make.com plan',
      'Some modules require specific versions'
    ],
    relatedTools: ['get_module', 'list_apps', 'check_account_compatibility']
  }
};
```

**3. Tool Documentation Registry**

**File**: `make mcp/src/mcp/tool-docs/index.ts`
```typescript
import { ToolDocumentation } from './types';
import { searchModulesDoc } from './discovery/search-modules';
import { getModuleDoc } from './discovery/get-module';
import { validateScenarioDoc } from './validation/validate-scenario';
// ... import all tool docs

export const toolsDocumentation: Record<string, ToolDocumentation> = {
  search_modules: searchModulesDoc,
  get_module: getModuleDoc,
  validate_scenario: validateScenarioDoc,
  // ... register all tools
};

export function getToolDocumentation(toolName: string, depth: 'essentials' | 'full' = 'essentials') {
  const doc = toolsDocumentation[toolName];
  if (!doc) {
    return `Tool "${toolName}" not found. Available tools: ${Object.keys(toolsDocumentation).join(', ')}`;
  }

  if (depth === 'essentials') {
    return formatEssentials(doc);
  }

  return formatFull(doc);
}

function formatEssentials(doc: ToolDocumentation): string {
  return `# ${doc.name}

${doc.essentials.description}

**Key Parameters**: ${doc.essentials.keyParameters.join(', ')}

**Example**: \`${doc.essentials.example}\`

**Performance**: ${doc.essentials.performance}

**Tips**:
${doc.essentials.tips.map(tip => `- ${tip}`).join('\n')}
`;
}

function formatFull(doc: ToolDocumentation): string {
  // Full formatting with all sections
  // ... implementation
}
```

**4. Integrate with MCP Server**

**File**: `make mcp/src/mcp/server.ts`

```typescript
import { getToolDocumentation } from './tool-docs';

// Add tools_documentation tool handler
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'tools_documentation') {
    const topic = args.topic || 'overview';
    const depth = args.depth || 'essentials';

    if (topic === 'overview') {
      return getToolsOverview(depth);
    }

    const doc = getToolDocumentation(topic, depth);
    return { content: [{ type: 'text', text: doc }] };
  }

  // ... other tool handlers
});
```

---

### Day 7: Create Scenario Building Guide

**Objective**: Create comprehensive workflow guide similar to n8n's AI Agents guide

**File**: `make mcp/src/mcp/tool-docs/guides/scenario-building-guide.ts`

```typescript
export const scenarioBuildingGuide = `# Complete Guide to Building Make.com Scenarios

## Standard Workflow Pattern

### Phase 1: Discovery
1. **Search for modules**: \`search_modules({query: "app_name"})\`
2. **List apps**: \`list_apps()\` to browse available integrations

### Phase 2: Configuration
1. **Get module details**: \`get_module({moduleId: "...", includeExamples: true})\`
2. **Check examples**: Review real-world configurations from community templates
3. **Configure parameters**: Set required and optional parameters

### Phase 3: Validation
1. **Structural validation**: \`validate_scenario({blueprint: {...}})\`
2. **Account compatibility**: \`check_account_compatibility({modules: [...]})\`
3. **Fix issues**: Address validation warnings/errors

### Phase 4: Deployment
1. **Deploy**: \`create_scenario({name: "...", teamId: ..., blueprint: {...}})\`
2. **Handle errors**: Tool automatically retries with fixes
3. **Activate**: Follow post-deployment steps in Make.com UI

## Scenario Architecture Patterns

### Pattern 1: Webhook → Action
\`\`\`json
{
  "flow": [
    {"module": "gateway:CustomWebHook", "parameters": {"name": "My Webhook"}},
    {"module": "slack:ActionPostMessage", "parameters": {
      "channel": "#general",
      "text": "Webhook received: {{1.data}}"
    }}
  ]
}
\`\`\`

### Pattern 2: Schedule → API → Process → Action
\`\`\`json
{
  "flow": [
    {"module": "builtin:Schedule", "parameters": {"interval": "15"}},
    {"module": "http:ActionSendData", "parameters": {
      "url": "https://api.example.com/data",
      "method": "GET"
    }},
    {"module": "json:ParseJSON", "parameters": {"json": "{{2.data}}"}},
    {"module": "google-sheets:ActionAddRow", "parameters": {
      "spreadsheetId": "...",
      "values": ["{{3.name}}", "{{3.value}}"]
    }}
  ]
}
\`\`\`

### Pattern 3: Trigger → Router → Multiple Paths
\`\`\`json
{
  "flow": [
    {"module": "gateway:CustomWebHook", "parameters": {"name": "Router Demo"}},
    {"module": "builtin:BasicRouter", "routes": [
      {
        "label": "High Priority",
        "modules": [
          {"module": "slack:ActionPostMessage", "parameters": {...}}
        ]
      },
      {
        "label": "Normal Priority",
        "modules": [
          {"module": "email:ActionSendEmail", "parameters": {...}}
        ]
      }
    ]}
  ]
}
\`\`\`

## Expression Syntax

Make.com uses \`{{N.field}}\` syntax:
- \`{{1.name}}\` - Output from module 1, field "name"
- \`{{2.email}}\` - Output from module 2, field "email"
- \`{{3.items[0].id}}\` - Array/object access

## Common Pitfalls

1. ❌ No trigger module - Scenarios need exactly 1 trigger
2. ❌ Wrong expression syntax - Must be \`{{N.field}}\`, not \`{N.field}\`
3. ❌ Missing required parameters - Check module schema
4. ❌ Router without routes array - Must have routes array
5. ❌ Invalid module references - Check {{N}} refers to existing module

## Best Practices

1. ✅ Always validate before deploying
2. ✅ Check account compatibility for all modules
3. ✅ Use examples from get_module to guide configuration
4. ✅ Enable error outputs for critical modules
5. ✅ Test with "Run once" after deployment
6. ✅ Document complex expressions

## Error Handling

### IM007: Module Not Found
- **Cause**: Module ID typo, unavailable in plan, or wrong version
- **Fix**: Check spelling, verify compatibility, remove version

### 400: Invalid Blueprint
- **Cause**: Missing required fields, structural issues
- **Fix**: Review validation output, fix issues

### 401: Authentication Failed
- **Cause**: Invalid API key
- **Fix**: Regenerate API key in Make.com settings

## Next Steps After Deployment

1. Go to Make.com dashboard
2. Find your scenario by name or ID
3. Add authentication credentials for modules
4. Configure router filters (if applicable)
5. Activate the scenario
6. Test with "Run once" button
7. Monitor execution history

## Getting Help

- Use \`tools_documentation({topic: "tool_name"})\` for tool details
- Check examples with \`get_module({includeExamples: true})\`
- Ask make-module-expert agent for parameter help
- Use make-troubleshooter agent for debugging

---

This guide ensures successful scenario building from start to finish.
`;
```

---

## Phase 4: Verification & Testing

### Testing Checklist

After implementing all improvements:

**Day 7 Afternoon: Comprehensive Testing**

1. **Test New MCP Tools** (if added):
   ```bash
   # In Claude Desktop, test:
   "List my Make.com scenarios"
   "Get scenario 123 details"
   "Clone scenario 123 with a new name"
   ```

2. **Test Agent SDK**:
   ```bash
   # Test agent invocation
   "Use make-scenario-builder to create a Slack to Sheets logger"
   "Use make-module-expert to explain Google Sheets Add Row module"
   ```

3. **Test Template Integration**:
   ```bash
   # Verify examples are accessible
   "Get Google Sheets Add Row module with examples"
   # Should return real-world configurations from templates
   ```

4. **Test Enhanced Validation**:
   ```bash
   # Try deploying invalid scenario
   validate_scenario({blueprint: {flow: [{module: "invalid:Module"}]}})
   # Should catch error before deployment
   ```

5. **Test Tools Documentation**:
   ```bash
   # Get overview
   tools_documentation()

   # Get specific tool docs
   tools_documentation({topic: "search_modules", depth: "full"})
   ```

---

## Success Metrics

By end of Week 1, you should have:

- ✅ **2-4 new MCP tools** (list_scenarios, get_scenario, etc.)
- ✅ **Enhanced validation** (parameter types, expressions, dependencies)
- ✅ **50-100 more modules** in database (total 274-324 modules)
- ✅ **200 community templates** collected and parsed
- ✅ **Real-world examples** in database (from templates)
- ✅ **4 agent definitions** (.claude/agents/ directory)
- ✅ **Structured tool documentation** (tool-docs/ directory)
- ✅ **tools_documentation meta-tool** for self-documenting system

---

## Files Modified/Created Summary

### New Directories:
```
make mcp/
├── .claude/agents/                    # NEW
├── templates/raw/                     # NEW
├── templates/                         # NEW
└── src/mcp/tool-docs/                # NEW
```

### Modified Files:
```
make mcp/src/mcp/server.ts             # Add tools, enhance validation
make mcp/src/scrapers/scrape-modules.ts # Add 50-100 modules
make mcp/src/database/schema.sql       # (No changes needed)
make mcp/src/database/db.ts            # (No changes needed)
```

### New Files:
```
make mcp/.claude/agents/make-scenario-builder.md
make mcp/.claude/agents/make-module-expert.md
make mcp/.claude/agents/make-deployment-engineer.md
make mcp/.claude/agents/make-troubleshooter.md

make mcp/src/mcp/tool-docs/types.ts
make mcp/src/mcp/tool-docs/index.ts
make mcp/src/mcp/tool-docs/discovery/search-modules.ts
make mcp/src/mcp/tool-docs/discovery/get-module.ts
make mcp/src/mcp/tool-docs/validation/validate-scenario.ts
make mcp/src/mcp/tool-docs/guides/scenario-building-guide.ts

make mcp/scripts/scrape-templates.ts
make mcp/scripts/parse-templates.ts
```

---

## How to Use Raw Template JSON

**The Power of Template JSON**:

1. **Extract Module Usage Patterns**
   - Which modules are commonly used together?
   - What's the typical order of operations?
   - Example: 90% of Slack scenarios use webhook triggers

2. **Real-World Parameter Configurations**
   - See how real users configure modules
   - Discover common parameter values
   - Learn best practices from working examples

3. **Validation Reference**
   - Compare user scenarios against proven templates
   - Suggest corrections based on real patterns
   - "Your config differs from 50 working templates - consider..."

4. **Module Popularity**
   - Identify most-used modules → prioritize improvements
   - Track emerging integrations
   - Guide users toward reliable modules

5. **Connection Patterns**
   - Learn how data flows between modules
   - Understand typical router configurations
   - Map out common automation architectures

6. **Documentation Enrichment**
   - Add "Based on 50 community templates, this module is often used with..."
   - Provide template-derived usage tips
   - Show frequency statistics

**Example Use Case**:

User asks: "How do I configure Google Sheets Add Row?"

Instead of just showing parameter schema, you can say:
> "Based on 120 community templates, here's how it's typically configured:
> - 95% use {{N.field}} expressions for dynamic data
> - 80% include timestamp columns
> - 70% pair with webhook triggers
> - Common pattern: webhook → parse JSON → add row"

---

## Next Steps After Week 1

**Week 2 Priorities**:
1. Collect more templates (target: 1,000+)
2. Add more agents (scenario-optimizer, module-recommender)
3. Build template recommendation engine
4. Add execution tracking (if Make API supports it)
5. Create interactive testing UI (Vercel deployment)

**Long-term Vision**:
- **10,000+ templates analyzed** for comprehensive patterns
- **AI-powered module recommendations** based on requirements
- **Auto-scenario generation** from natural language
- **Template marketplace** integration
- **Scenario optimization** suggestions
- **Cost estimation** for scenarios

---

**This plan provides concrete, actionable steps for improving make-mcp THIS WEEK while laying foundation for long-term enhancements.**
