#!/usr/bin/env node
/**
 * import-top30-schemas.js
 *
 * Creates the `module_schemas` table and imports the 30 most important
 * Make.com module schemas. MCP-live schemas (full JSON Schema) are used
 * where available; the rest come from the extracted parameters already
 * in the modules table.
 *
 * Usage: node scripts/import-top30-schemas.js
 */

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', 'data', 'make-modules.db');
const db = new Database(DB_PATH);

// ── 1. Create table ────────────────────────────────────────────────────────

db.exec(`
CREATE TABLE IF NOT EXISTS module_schemas (
  module_id        TEXT PRIMARY KEY,
  label            TEXT NOT NULL,
  app              TEXT NOT NULL,
  app_version      INTEGER NOT NULL,
  type             TEXT NOT NULL,
  connection_type  TEXT,
  input_schema     TEXT,   -- full JSON Schema from MCP (if available)
  output_schema    TEXT,   -- full JSON Schema from MCP (if available)
  parameters_summary TEXT, -- simplified [{name,type,required,description}]
  output_summary   TEXT,   -- simplified [{name,type,label}]
  source           TEXT NOT NULL DEFAULT 'db_extracted',
  notes            TEXT,
  fetched_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log('Table module_schemas ready.');

// ── 2. MCP-live schemas ────────────────────────────────────────────────────
// Full input/output schemas retrieved directly from the Make MCP server.

const MCP_SCHEMAS = [
  {
    module_id: 'gateway:CustomWebHook',
    label: 'Custom Webhook',
    app: 'gateway',
    app_version: 1,
    type: 'trigger',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Receives HTTP requests. Requires a webhook (hook ID) to be configured in Make.',
    input_schema: JSON.stringify({
      parameters: {
        hook: { type: 'number', title: 'Webhook', required: true, note: 'Select/create via hooks list (type: gateway-webhook)' },
        maxResults: { type: 'number', title: 'Maximum number of results', required: false, description: 'Applies only if scenario is not scheduled "Immediately"' }
      },
      mapper: {}
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — matches the webhook payload structure' }),
    parameters_summary: JSON.stringify([
      { name: 'hook', type: 'number', required: true, description: 'Webhook ID (gateway-webhook type)' },
      { name: 'maxResults', type: 'number', required: false, description: 'Max results per run (non-immediate schedules only)' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'All fields from the incoming webhook payload' }
    ])
  },
  {
    module_id: 'gateway:WebhookRespond',
    label: 'Webhook Respond',
    app: 'gateway',
    app_version: 1,
    type: 'action',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Sends an HTTP response back to the webhook caller. Must be used with Custom Webhook trigger.',
    input_schema: JSON.stringify({
      parameters: {},
      mapper: {
        status: { type: 'number', title: 'Status', required: true, default: 200, minimum: 100 },
        body: { title: 'Body', required: false, description: 'Response body (any type)' },
        headers: {
          type: 'array', title: 'Custom headers', required: false, maxItems: 16,
          items: { key: { type: 'string', maxLength: 256 }, value: { type: 'string', maxLength: 4096 } }
        }
      }
    }),
    output_schema: JSON.stringify({ properties: {}, note: 'No output — terminates the webhook response' }),
    parameters_summary: JSON.stringify([
      { name: 'status', type: 'number', required: true, description: 'HTTP status code (default 200, min 100)' },
      { name: 'body', type: 'any', required: false, description: 'Response body' },
      { name: 'headers', type: 'array<{key,value}>', required: false, description: 'Up to 16 custom response headers' }
    ]),
    output_summary: JSON.stringify([])
  },
  {
    module_id: 'http:ActionSendData',
    label: 'Make a Request',
    app: 'http',
    app_version: 3,
    type: 'action',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Universal HTTP module. Supports GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS, basic auth, query strings, custom headers, raw/form/multipart body, TLS.',
    input_schema: JSON.stringify({
      parameters: {
        handleErrors: { type: 'boolean', title: 'Evaluate all states as errors (except 2xx/3xx)', required: true, default: true },
        useNewZLibDeCompress: { type: 'boolean', default: true }
      },
      mapper: {
        url: { type: 'string', title: 'URL', required: true },
        method: { type: 'string', title: 'Method', required: true, enum: ['get','head','post','put','patch','delete','options'] },
        headers: { type: 'array', title: 'Headers', items: { name: 'string', value: 'string' } },
        qs: { type: 'array', title: 'Query String', items: { name: 'string', value: 'string' } },
        bodyType: { type: 'string', title: 'Body type', enum: ['','raw','x_www_form_urlencoded','multipart_form_data'], default: '' },
        parseResponse: { type: 'boolean', title: 'Parse response', description: 'Auto-parse JSON/XML responses' },
        authUser: { type: 'string', title: 'User name (Basic Auth)' },
        authPass: { type: 'string', title: 'Password (Basic Auth)' },
        timeout: { type: 'number', title: 'Timeout (seconds)', minimum: 1, maximum: 300, default: 300 },
        followRedirect: { type: 'boolean', title: 'Follow redirect', default: true },
        gzip: { type: 'boolean', title: 'Request compressed content', default: true },
        rejectUnauthorized: { type: 'boolean', title: 'Reject unverified certificates', default: true }
      }
    }),
    output_schema: JSON.stringify({
      headers: { type: 'array', title: 'Headers', items: { name: 'string', value: 'string' } },
      cookieHeaders: { type: 'array', title: 'Cookie headers' },
      statusCode: { type: 'number', title: 'Status code' },
      data: { title: 'Data (parsed response body)' }
    }),
    parameters_summary: JSON.stringify([
      { name: 'url', type: 'string', required: true, description: 'Request URL' },
      { name: 'method', type: 'enum', required: true, description: 'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS' },
      { name: 'headers', type: 'array<{name,value}>', required: false, description: 'Request headers' },
      { name: 'qs', type: 'array<{name,value}>', required: false, description: 'Query string parameters' },
      { name: 'bodyType', type: 'enum', required: false, description: 'raw|x_www_form_urlencoded|multipart_form_data' },
      { name: 'parseResponse', type: 'boolean', required: false, description: 'Auto-parse JSON/XML' },
      { name: 'timeout', type: 'number', required: false, description: 'Seconds (1-300, default 300)' },
      { name: 'authUser', type: 'string', required: false, description: 'Basic Auth username' },
      { name: 'authPass', type: 'string', required: false, description: 'Basic Auth password' }
    ]),
    output_summary: JSON.stringify([
      { name: 'statusCode', type: 'number', label: 'HTTP status code' },
      { name: 'headers', type: 'array', label: 'Response headers' },
      { name: 'data', type: 'any', label: 'Parsed response body' }
    ])
  },
  {
    module_id: 'json:ParseJSON',
    label: 'Parse JSON',
    app: 'json',
    app_version: 1,
    type: 'transformer',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Parses a JSON string into a structured object. Optionally specify a data structure to define output shape.',
    input_schema: JSON.stringify({
      parameters: {
        type: { type: 'number', title: 'Data structure', required: false, description: 'Optional data structure ID to define output shape. If unset, Make auto-detects after first run.' }
      },
      mapper: {
        json: { type: 'string', title: 'JSON string', required: true }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — matches the data structure or the JSON content after first run' }),
    parameters_summary: JSON.stringify([
      { name: 'json', type: 'string', required: true, description: 'The JSON string to parse' },
      { name: 'type', type: 'number', required: false, description: 'Data structure ID (optional, for type-safe output)' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'All fields from the parsed JSON' }
    ])
  },
  {
    module_id: 'json:TransformToJSON',
    label: 'Create JSON',
    app: 'json',
    app_version: 1,
    type: 'transformer',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Converts a Make bundle/object into a JSON string. Supports optional pretty-printing indentation.',
    input_schema: JSON.stringify({
      parameters: {
        space: { type: 'string', title: 'Indentation', required: false, enum: ['','tab','2','4'], default: '', description: 'Empty=compact, tab=1 tab, 2=2 spaces, 4=4 spaces' }
      },
      mapper: {
        object: { title: 'Object', required: false, description: 'The object/bundle to serialize as JSON' }
      }
    }),
    output_schema: JSON.stringify({
      json: { type: 'string', title: 'JSON string' }
    }),
    parameters_summary: JSON.stringify([
      { name: 'object', type: 'any', required: false, description: 'Object to serialize' },
      { name: 'space', type: 'enum', required: false, description: 'Indentation: empty|tab|2|4' }
    ]),
    output_summary: JSON.stringify([
      { name: 'json', type: 'string', label: 'Serialized JSON string' }
    ])
  },
  {
    module_id: 'builtin:BasicRouter',
    label: 'Router',
    app: 'builtin',
    app_version: 1,
    type: 'router',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Splits the scenario into multiple parallel routes. Each route can have filter conditions. All routes receive the same input bundle.',
    input_schema: JSON.stringify({ parameters: {}, mapper: {} }),
    output_schema: JSON.stringify({ note: 'Passes the input bundle unchanged to each route' }),
    parameters_summary: JSON.stringify([]),
    output_summary: JSON.stringify([])
  },
  {
    module_id: 'builtin:BasicFeeder',
    label: 'Iterator',
    app: 'builtin',
    app_version: 1,
    type: 'feeder',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Splits an array into individual bundles, one per item. Each downstream module processes one item at a time.',
    input_schema: JSON.stringify({
      parameters: {},
      mapper: {
        array: { type: 'array', title: 'Array', required: false, items: {}, description: 'The array to iterate over' }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — one bundle per array item, shape matches array item structure' }),
    parameters_summary: JSON.stringify([
      { name: 'array', type: 'array', required: false, description: 'The array to split into individual bundles' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'Fields from each array item' }
    ])
  },
  {
    module_id: 'builtin:BasicAggregator',
    label: 'Array Aggregator',
    app: 'builtin',
    app_version: 1,
    type: 'aggregator',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Collects multiple bundles from a previous module/iterator and combines them into a single array.',
    input_schema: JSON.stringify({ parameters: {}, mapper: {} }),
    output_schema: JSON.stringify({
      array: { type: 'array', title: 'Array', items: {}, description: 'Array of all aggregated bundles' }
    }),
    parameters_summary: JSON.stringify([]),
    output_summary: JSON.stringify([
      { name: 'array', type: 'array', label: 'Aggregated array of all input bundles' }
    ])
  },
  {
    module_id: 'util:SetVariable2',
    label: 'Set Variable',
    app: 'util',
    app_version: 1,
    type: 'action',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Stores a value in a named variable. Use Get variable to retrieve it later in the same scenario.',
    input_schema: JSON.stringify({
      parameters: {},
      mapper: {
        name: { type: 'string', title: 'Variable name', required: true },
        scope: { type: 'string', title: 'Variable lifetime', required: true, enum: ['roundtrip','execution'], description: 'roundtrip=one cycle, execution=entire scenario run' },
        value: { title: 'Variable value', required: false }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — outputs the variable value under the variable name' }),
    parameters_summary: JSON.stringify([
      { name: 'name', type: 'string', required: true, description: 'Variable name' },
      { name: 'scope', type: 'enum', required: true, description: 'roundtrip (one cycle) | execution (full run)' },
      { name: 'value', type: 'any', required: false, description: 'Value to store' }
    ]),
    output_summary: JSON.stringify([
      { name: '<variableName>', type: 'dynamic', label: 'The stored variable value' }
    ])
  },
  {
    module_id: 'util:SetVariables',
    label: 'Set Multiple Variables',
    app: 'util',
    app_version: 1,
    type: 'action',
    connection_type: null,
    source: 'mcp_live',
    notes: 'Stores multiple values in named variables in one step.',
    input_schema: JSON.stringify({
      parameters: {},
      mapper: {
        variables: { type: 'array', title: 'Variables', required: false, items: { name: 'string (required)', value: 'any' } },
        scope: { type: 'string', title: 'Variable lifetime', required: true, enum: ['roundtrip','execution'] }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — outputs all variable values under their respective names' }),
    parameters_summary: JSON.stringify([
      { name: 'variables', type: 'array<{name,value}>', required: false, description: 'List of variable name/value pairs' },
      { name: 'scope', type: 'enum', required: true, description: 'roundtrip (one cycle) | execution (full run)' }
    ]),
    output_summary: JSON.stringify([
      { name: '<variableNames>', type: 'dynamic', label: 'Each variable as a separate output field' }
    ])
  },
  {
    module_id: 'google-sheets:addRow',
    label: 'Add a Row',
    app: 'google-sheets',
    app_version: 2,
    type: 'action',
    connection_type: 'google',
    source: 'mcp_live',
    notes: 'Appends a new row to the bottom of a Google Sheet table. Requires a Google connection. Spreadsheet can be selected by path, from all, or entered manually.',
    input_schema: JSON.stringify({
      parameters: {
        __IMTCONN__: { type: 'number', title: 'Connection', required: true, note: 'Google OAuth connection ID' }
      },
      mapper: {
        mode: { type: 'string', title: 'Search Method', enum: ['select','fromAll','map'], description: 'How to find the spreadsheet' },
        spreadsheetId: { type: 'string', title: 'Spreadsheet ID', required: true },
        sheetId: { type: 'string', title: 'Sheet Name', required: true },
        includesHeaders: { type: 'boolean', title: 'Table contains headers' },
        tableFirstRow: { type: 'string', title: 'Row with headers', default: 'A1:Z1' },
        insertUnformatted: { type: 'boolean', title: 'Unformatted', default: false },
        valueInputOption: { type: 'string', enum: ['','USER_ENTERED','RAW'], default: '' },
        insertDataOption: { type: 'string', enum: ['','INSERT_ROWS','OVERWRITE'], default: '' },
        values: { type: 'dynamic', title: 'Row data', note: 'One field per column, populated after first run' }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — row number and all column values added' }),
    parameters_summary: JSON.stringify([
      { name: '__IMTCONN__', type: 'connectionId', required: true, description: 'Google OAuth connection' },
      { name: 'spreadsheetId', type: 'string', required: true, description: 'Google Sheets spreadsheet ID' },
      { name: 'sheetId', type: 'string', required: true, description: 'Sheet (tab) name' },
      { name: 'values', type: 'dynamic', required: false, description: 'Column values (auto-populated after first run)' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'Row number and column values of the added row' }
    ])
  },
  {
    module_id: 'google-sheets:filterRows',
    label: 'Search Rows',
    app: 'google-sheets',
    app_version: 2,
    type: 'search',
    connection_type: 'google',
    source: 'mcp_live',
    notes: 'Searches rows matching filter criteria in a Google Sheet. Returns all matching rows as separate bundles.',
    input_schema: JSON.stringify({
      parameters: {
        __IMTCONN__: { type: 'number', title: 'Connection', required: true }
      },
      mapper: {
        mode: { type: 'string', enum: ['select','fromAll','map'] },
        spreadsheetId: { type: 'string', required: true },
        sheetId: { type: 'string', required: true },
        includesHeaders: { type: 'boolean' },
        tableFirstRow: { type: 'string', default: 'A1:Z1' },
        filter: { type: 'object', title: 'Filter', note: 'Conditions to match rows' },
        limit: { type: 'number', title: 'Maximum number of returned rows' }
      }
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — one bundle per matching row, shape matches sheet columns' }),
    parameters_summary: JSON.stringify([
      { name: '__IMTCONN__', type: 'connectionId', required: true, description: 'Google OAuth connection' },
      { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
      { name: 'sheetId', type: 'string', required: true, description: 'Sheet name' },
      { name: 'filter', type: 'object', required: false, description: 'Filter conditions' },
      { name: 'limit', type: 'number', required: false, description: 'Max rows to return' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'One bundle per matching row with all column values' }
    ])
  },
  {
    module_id: 'google-sheets:watchRows',
    label: 'Watch New Rows',
    app: 'google-sheets',
    app_version: 2,
    type: 'trigger',
    connection_type: 'google',
    source: 'mcp_live',
    notes: 'Polls for new rows added to a Google Sheet. Triggers once per new row. Use limit to control bundles per run.',
    input_schema: JSON.stringify({
      parameters: {
        __IMTCONN__: { type: 'number', title: 'Connection', required: true },
        mode: { type: 'string', enum: ['select','fromAll','map'] },
        spreadsheetId: { type: 'string', required: true },
        sheetId: { type: 'string', required: true },
        includesHeaders: { type: 'boolean', required: true },
        tableFirstRow: { type: 'string', default: 'A1:Z1' },
        limit: { type: 'number', title: 'Limit', required: true, default: 2 },
        valueRenderOption: { type: 'string', enum: ['','FORMATTED_VALUE','UNFORMATTED_VALUE','FORMULA'], default: '' },
        dateTimeRenderOption: { type: 'string', enum: ['','SERIAL_NUMBER','FORMATTED_STRING'], default: '' }
      },
      mapper: {}
    }),
    output_schema: JSON.stringify({ note: 'Dynamic — shape matches sheet columns after first run' }),
    parameters_summary: JSON.stringify([
      { name: '__IMTCONN__', type: 'connectionId', required: true, description: 'Google OAuth connection' },
      { name: 'spreadsheetId', type: 'string', required: true, description: 'Spreadsheet ID' },
      { name: 'sheetId', type: 'string', required: true, description: 'Sheet name' },
      { name: 'includesHeaders', type: 'boolean', required: true, description: 'Whether first row is headers' },
      { name: 'limit', type: 'number', required: true, description: 'Max rows per run (default 2)' }
    ]),
    output_summary: JSON.stringify([
      { name: '*', type: 'dynamic', label: 'One bundle per new row with column values' }
    ])
  },
  {
    module_id: 'slack:ActionCreateMessage',
    label: 'Create a Message',
    app: 'slack',
    app_version: 2,
    type: 'action',
    connection_type: 'slack',
    source: 'mcp_live',
    notes: 'Posts a message to a Slack channel, private channel, or direct message. Supports attachments, link unfurling, and custom bot name/icon.',
    input_schema: JSON.stringify({
      parameters: {
        account: { type: 'number', title: 'Connection', required: true, note: 'Slack OAuth connection ID' }
      },
      mapper: {
        type: { type: 'string', title: 'Where to send', required: true, enum: ['channel','group','im'] },
        channelId: { type: 'string', title: 'Channel/User', required: true, note: 'Fetched via RPC based on type' },
        text: { type: 'string', title: 'Text', required: false },
        username: { type: 'string', title: 'Bot username', required: false },
        parse: { type: 'boolean', title: 'Parse message text (Markdown)', default: false },
        unfurlLinks: { type: 'boolean', title: 'Unfurl links' },
        unfurlMedia: { type: 'boolean', title: 'Unfurl media' },
        linkNames: { type: 'boolean', title: 'Link names (#channel, @user)', default: true },
        iconType: { type: 'string', enum: ['none','url','emoji'], required: true },
        attachments: { type: 'array', title: 'Message attachments', items: { fallback: 'string (required)', color: 'string', text: 'string', title: 'string', fields: 'array' } }
      }
    }),
    output_schema: JSON.stringify({
      ts: { type: 'string', title: 'Message ID (timestamp)' },
      channel: { type: 'string', title: 'Channel ID' }
    }),
    parameters_summary: JSON.stringify([
      { name: 'account', type: 'connectionId', required: true, description: 'Slack OAuth connection' },
      { name: 'type', type: 'enum', required: true, description: 'channel | group (private) | im (direct message)' },
      { name: 'channelId', type: 'string', required: true, description: 'Channel or user ID' },
      { name: 'text', type: 'string', required: false, description: 'Message text (Markdown supported)' },
      { name: 'attachments', type: 'array', required: false, description: 'Rich message attachments' }
    ]),
    output_summary: JSON.stringify([
      { name: 'ts', type: 'string', label: 'Message ID (timestamp)' },
      { name: 'channel', type: 'string', label: 'Channel ID' }
    ])
  },
  {
    module_id: 'slack:TriggerNewMessage',
    label: 'Watch Messages',
    app: 'slack',
    app_version: 2,
    type: 'trigger',
    connection_type: 'slack',
    source: 'mcp_live',
    notes: 'Polls for new Slack messages in a channel, private channel, or DM thread.',
    input_schema: JSON.stringify({
      parameters: {
        account: { type: 'number', title: 'Connection', required: true },
        type: { type: 'string', required: true, enum: ['channel','group','im'] },
        channelId: { type: 'string', required: true },
        maxResults: { type: 'number', title: 'Maximum number of returned messages', required: true }
      },
      mapper: {}
    }),
    output_schema: JSON.stringify({
      id: 'string (Message timestamp/ID)',
      text: 'string', user: 'string (User ID)', username: 'string',
      channel: 'string (Channel ID)', type: 'string', subtype: 'string',
      files: 'array', attachments: 'array', file: 'object'
    }),
    parameters_summary: JSON.stringify([
      { name: 'account', type: 'connectionId', required: true, description: 'Slack OAuth connection' },
      { name: 'type', type: 'enum', required: true, description: 'channel | group | im' },
      { name: 'channelId', type: 'string', required: true, description: 'Channel or user ID' },
      { name: 'maxResults', type: 'number', required: true, description: 'Max messages per run' }
    ]),
    output_summary: JSON.stringify([
      { name: 'id', type: 'string', label: 'Message ID (timestamp)' },
      { name: 'text', type: 'string', label: 'Message text' },
      { name: 'user', type: 'string', label: 'Sender user ID' },
      { name: 'channel', type: 'string', label: 'Channel ID' },
      { name: 'attachments', type: 'array', label: 'Message attachments' },
      { name: 'files', type: 'array', label: 'Attached files' }
    ])
  }
];

// ── 3. DB-extracted schemas (from existing modules table) ──────────────────
// These apps are not accessible via MCP in this org, but the scraper already
// extracted simplified parameter schemas from blueprint analysis.

const DB_MODULE_IDS = [
  'gmail:ActionSendEmail',
  'gmail:TriggerWatchEmails',
  'openai:ActionCreateCompletion',
  'notion:ActionCreateDatabaseItem',
  'notion:SearchDatabaseItems',
  'airtable:ActionCreateRecord',
  'airtable:SearchRecords',
  'hubspot:ActionCreateContact',
  'hubspot:TriggerWatchContacts',
  'trello:ActionCreateCard',
  'trello:TriggerWatchCards',
  'google-drive:ActionUploadFile',
  'google-drive:TriggerWatchFiles',
  'stripe:ActionCreateCustomer',
  'google-calendar:ActionCreateEvent',
];

// Connection type mapping for DB-extracted modules
const CONNECTION_TYPES = {
  'gmail': 'google',
  'openai': 'openai',
  'notion': 'notion',
  'airtable': 'airtable',
  'hubspot': 'hubspot',
  'trello': 'trello',
  'google-drive': 'google',
  'stripe': 'stripe',
  'google-calendar': 'google',
};

const APP_VERSIONS = {
  'gmail': 3,
  'openai': 1,
  'notion': 1,
  'airtable': 1,
  'hubspot': 1,
  'trello': 1,
  'google-drive': 2,
  'stripe': 1,
  'google-calendar': 2,
};

// ── 4. Insert / upsert ─────────────────────────────────────────────────────

const upsert = db.prepare(`
  INSERT INTO module_schemas
    (module_id, label, app, app_version, type, connection_type,
     input_schema, output_schema, parameters_summary, output_summary, source, notes)
  VALUES
    (@module_id, @label, @app, @app_version, @type, @connection_type,
     @input_schema, @output_schema, @parameters_summary, @output_summary, @source, @notes)
  ON CONFLICT(module_id) DO UPDATE SET
    label = excluded.label,
    app_version = excluded.app_version,
    type = excluded.type,
    connection_type = excluded.connection_type,
    input_schema = excluded.input_schema,
    output_schema = excluded.output_schema,
    parameters_summary = excluded.parameters_summary,
    output_summary = excluded.output_summary,
    source = excluded.source,
    notes = excluded.notes,
    fetched_at = CURRENT_TIMESTAMP
`);

// Insert MCP-live schemas
let mcpCount = 0;
for (const schema of MCP_SCHEMAS) {
  upsert.run(schema);
  mcpCount++;
}
console.log(`Inserted ${mcpCount} MCP-live schemas.`);

// Insert DB-extracted schemas
const getModule = db.prepare(`SELECT id, name, app, type, parameters, output_fields, connection_type FROM modules WHERE id = ?`);
let dbCount = 0;
for (const moduleId of DB_MODULE_IDS) {
  const mod = getModule.get(moduleId);
  if (!mod) {
    console.warn(`  SKIP ${moduleId} — not found in modules table`);
    continue;
  }
  const appSlug = moduleId.split(':')[0];
  upsert.run({
    module_id: mod.id,
    label: mod.name,
    app: appSlug,
    app_version: APP_VERSIONS[appSlug] || 1,
    type: mod.type,
    connection_type: mod.connection_type || CONNECTION_TYPES[appSlug] || null,
    input_schema: null,   // not available from MCP for this org
    output_schema: null,
    parameters_summary: mod.parameters || '[]',
    output_summary: mod.output_fields || '[]',
    source: 'db_extracted',
    notes: null
  });
  dbCount++;
}
console.log(`Inserted ${dbCount} DB-extracted schemas.`);

// ── 5. Summary ─────────────────────────────────────────────────────────────

const total = db.prepare('SELECT COUNT(*) as c FROM module_schemas').get();
const bySource = db.prepare('SELECT source, COUNT(*) as c FROM module_schemas GROUP BY source').all();

console.log('\n── module_schemas table ──────────────────────────────');
console.log(`  Total: ${total.c} schemas`);
bySource.forEach(r => console.log(`  ${r.source}: ${r.c}`));

const rows = db.prepare('SELECT module_id, label, type, source FROM module_schemas ORDER BY app, module_id').all();
console.log('\n  Modules:');
rows.forEach(r => console.log(`  [${r.source === 'mcp_live' ? 'MCP' : 'DB '}] ${r.module_id.padEnd(40)} ${r.type.padEnd(12)} ${r.label}`));
console.log('─────────────────────────────────────────────────────');

db.close();
