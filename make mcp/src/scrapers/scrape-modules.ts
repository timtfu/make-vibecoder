import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { MakeDatabase } from '../database/db.js';

interface MakeModule {
    id: string;
    name: string;
    app: string;
    type: 'trigger' | 'action' | 'search';
    description: string;
    parameters: any[];
    documentation?: string;
}

// Helper to define a module concisely
function m(id: string, name: string, app: string, type: 'trigger' | 'action' | 'search', description: string, parameters: any[], documentation?: string): MakeModule {
    const mod: MakeModule = { id, name, app, type, description, parameters };
    if (documentation !== undefined) mod.documentation = documentation;
    return mod;
}

// Helper to define a parameter concisely
function p(name: string, type: string, required: boolean, description: string, extra?: Record<string, any>) {
    return { name, type, required, description, ...extra };
}

export class ModuleScraper {
    private db: MakeDatabase;

    constructor() {
        this.db = new MakeDatabase();
    }

    async scrapeFromMakeAPI(): Promise<MakeModule[]> {
        const apiKey = process.env.MAKE_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            console.log('No valid MAKE_API_KEY set, using built-in module catalog');
            return this.getModuleCatalog();
        }

        try {
            const baseUrl = process.env.MAKE_API_URL || 'https://eu1.make.com/api/v2';
            const response = await axios.get(`${baseUrl}/modules`, {
                headers: { 'Authorization': `Token ${apiKey}` }
            });
            return response.data.modules;
        } catch (error) {
            console.log('Make API modules endpoint not available, using built-in catalog');
            return this.getModuleCatalog();
        }
    }

    private getModuleCatalog(): MakeModule[] {
        return [
            // ═══════════════════════════════════════
            // WEBHOOKS (2 modules)
            // ═══════════════════════════════════════
            m('gateway:CustomWebHook', 'Custom Webhook', 'Webhooks', 'trigger',
                'Receive data via a custom webhook URL. Starts the scenario when data is sent to the webhook endpoint via HTTP POST.',
                [p('name', 'text', true, 'Webhook name'), p('dataStructure', 'select', false, 'Expected data structure for type-safe mapping')],
                '## Custom Webhook\nTrigger a scenario via HTTP POST to a unique webhook URL.\n\n### Usage\n1. Create the webhook in Make\n2. Copy the webhook URL\n3. Send POST/GET requests with data to that URL\n\n### Tips\n- Define a data structure for proper field mapping\n- Webhooks timeout after 30s if no response is sent'),
            m('gateway:WebhookRespond', 'Webhook Response', 'Webhooks', 'action',
                'Send a custom HTTP response back to the webhook caller with status code, headers, and body. Must be paired with a Custom Webhook trigger.',
                [p('status', 'number', true, 'HTTP status code (e.g., 200, 201, 400)', { default: 200 }), p('body', 'text', true, 'Response body (text, JSON, or HTML)'), p('headers', 'array', false, 'Custom response headers as key-value pairs')]),

            // ═══════════════════════════════════════
            // HTTP (4 modules)
            // ═══════════════════════════════════════
            m('http:ActionSendData', 'Make a Request', 'HTTP', 'action',
                'Make HTTP requests to any URL or API endpoint. Supports all HTTP methods, custom headers, query strings, and request body. The universal connector for any API.',
                [p('method', 'select', true, 'HTTP method', { options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] }), p('url', 'url', true, 'Request URL'), p('headers', 'array', false, 'Request headers as key-value pairs'), p('queryString', 'array', false, 'Query string parameters'), p('body', 'text', false, 'Request body'), p('bodyType', 'select', false, 'Content type', { options: ['Raw', 'application/x-www-form-urlencoded', 'multipart/form-data'] }), p('parseResponse', 'boolean', false, 'Automatically parse response JSON/XML', { default: true }), p('timeout', 'number', false, 'Request timeout in seconds')],
                '## HTTP Request\nThe universal connector for any REST API.\n\n### Common Use Cases\n- Calling REST APIs without a dedicated Make app\n- Sending data to third-party services\n- Fetching external data\n- Integrating with internal company APIs'),
            m('http:ActionGetFile', 'Get a File', 'HTTP', 'action',
                'Download a file from a URL. Returns the file as binary data for use in subsequent modules like Google Drive Upload or Email Attachment.',
                [p('url', 'url', true, 'File URL to download'), p('shareDrive', 'boolean', false, 'Evaluate Google Drive shared links')]),
            m('http:ActionSendDataBasicAuth', 'Make a Basic Auth Request', 'HTTP', 'action',
                'Make an HTTP request with Basic Authentication (username/password) to APIs that require basic auth credentials.',
                [p('method', 'select', true, 'HTTP method', { options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }), p('url', 'url', true, 'Request URL'), p('username', 'text', true, 'Basic auth username'), p('password', 'text', true, 'Basic auth password'), p('headers', 'array', false, 'Request headers'), p('body', 'text', false, 'Request body')]),
            m('http:ActionRetrieveHeaders', 'Retrieve Headers', 'HTTP', 'action',
                'Retrieve HTTP headers from a URL without downloading the body. Useful for checking content types, file sizes, or redirect locations.',
                [p('url', 'url', true, 'URL to check'), p('method', 'select', false, 'HTTP method', { options: ['HEAD', 'GET'], default: 'HEAD' })]),

            // ═══════════════════════════════════════
            // JSON (3 modules)
            // ═══════════════════════════════════════
            m('json:ParseJSON', 'Parse JSON', 'JSON', 'action',
                'Parse a JSON string into structured data that can be mapped in subsequent modules. Essential for processing API responses.',
                [p('json', 'text', true, 'JSON string to parse'), p('dataStructure', 'select', false, 'Expected data structure for type-safe mapping')]),
            m('json:TransformToJSON', 'Create JSON', 'JSON', 'action',
                'Create a JSON string from mapped data fields. Use for building API request bodies.',
                [p('dataStructure', 'select', true, 'Data structure to serialize into JSON')]),
            m('json:AggregateToJSON', 'Aggregate to JSON', 'JSON', 'action',
                'Aggregate multiple bundles into a single JSON array string. Combines multiple items into one JSON output.',
                [p('sourceModule', 'select', true, 'Module whose output to aggregate'), p('dataStructure', 'select', false, 'Structure for each item')]),

            // ═══════════════════════════════════════
            // GOOGLE SHEETS (14 modules — real: 27 total)
            // ═══════════════════════════════════════
            m('google-sheets:ActionAddRow', 'Add a Row', 'Google Sheets', 'action',
                'Appends a new row to the bottom of a Google Sheets spreadsheet table.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID or URL'), p('sheetName', 'text', true, 'Sheet/tab name'), p('values', 'array', true, 'Row values to add'), p('tableContainsHeaders', 'boolean', false, 'Whether first row contains headers', { default: true })]),
            m('google-sheets:ActionUpdateRow', 'Update a Row', 'Google Sheets', 'action',
                'Update an existing row in a Google Sheets spreadsheet by row number.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('rowNumber', 'number', true, 'Row number to update'), p('values', 'array', true, 'New values for the row')]),
            m('google-sheets:ActionDeleteRow', 'Delete a Row', 'Google Sheets', 'action',
                'Deletes a specific row from a Google Sheets spreadsheet by row number.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('rowNumber', 'number', true, 'Row number to delete')]),
            m('google-sheets:ActionClearRow', 'Clear a Row', 'Google Sheets', 'action',
                'Clears values from a specific row without deleting the row itself.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('rowNumber', 'number', true, 'Row number to clear')]),
            m('google-sheets:ActionClearCell', 'Clear a Cell', 'Google Sheets', 'action',
                'Clears a specific cell in a Google Sheets spreadsheet.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('cell', 'text', true, 'Cell reference (e.g., A1, B5)')]),
            m('google-sheets:ActionBulkAddRows', 'Bulk Add Rows', 'Google Sheets', 'action',
                'Appends multiple rows to the bottom of a spreadsheet table in a single operation.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('values', 'array', true, 'Array of row arrays to add')]),
            m('google-sheets:ActionBulkUpdateRows', 'Bulk Update Rows', 'Google Sheets', 'action',
                'Updates multiple rows at once. More efficient than updating rows one at a time.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('rows', 'array', true, 'Array of {rowNumber, values} objects')]),
            m('google-sheets:ActionClearRange', 'Clear Values from a Range', 'Google Sheets', 'action',
                'Clears a specified range of values from a spreadsheet.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('range', 'text', true, 'Range in A1 notation (e.g., Sheet1!A1:D10)')]),
            m('google-sheets:ActionAddSheet', 'Add a Sheet', 'Google Sheets', 'action',
                'Adds a new sheet/tab to an existing spreadsheet.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('title', 'text', true, 'New sheet name')]),
            m('google-sheets:ActionCopySheet', 'Copy a Sheet', 'Google Sheets', 'action',
                'Copies a sheet to another spreadsheet.',
                [p('sourceSpreadsheetId', 'text', true, 'Source spreadsheet ID'), p('sourceSheetId', 'number', true, 'Source sheet ID'), p('destinationSpreadsheetId', 'text', true, 'Destination spreadsheet ID')]),
            m('google-sheets:ActionAddConditionalFormat', 'Add a Conditional Format Rule', 'Google Sheets', 'action',
                'Creates a new conditional format rule at a given index. All subsequent rules indexes are incremented.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetId', 'number', true, 'Sheet ID'), p('range', 'text', true, 'Cell range'), p('type', 'select', true, 'Condition type')]),
            m('google-sheets:TriggerWatchRows', 'Watch Rows', 'Google Sheets', 'trigger',
                'Trigger when new rows are added to a Google Sheets spreadsheet. Detects new data automatically.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('tableContainsHeaders', 'boolean', false, 'Whether first row contains headers', { default: true }), p('limit', 'number', false, 'Max rows to return per run')]),
            m('google-sheets:TriggerWatchChanges', 'Watch Changes', 'Google Sheets', 'trigger',
                'Trigger when any cell value changes in a Google Sheets spreadsheet.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name')]),
            m('google-sheets:SearchRows', 'Search Rows', 'Google Sheets', 'search',
                'Search for rows matching specific criteria in a Google Sheets spreadsheet using column filters.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('filter', 'text', true, 'Filter column and value'), p('sortOrder', 'select', false, 'Sort results', { options: ['asc', 'desc'] })]),
            m('google-sheets:SearchRowByNumber', 'Get a Row', 'Google Sheets', 'search',
                'Retrieves a specific row by its row number.',
                [p('spreadsheetId', 'text', true, 'Spreadsheet ID'), p('sheetName', 'text', true, 'Sheet/tab name'), p('rowNumber', 'number', true, 'Row number to retrieve')]),

            // ═══════════════════════════════════════
            // OPENAI (11 modules — real: 31 total)
            // ═══════════════════════════════════════
            m('openai:ActionCreateCompletion', 'Create a Completion', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Generate text using OpenAI chat models. Send messages with system, user, and assistant roles to get AI-generated responses.',
                [p('model', 'select', true, 'Model to use', { options: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o3-mini'] }), p('messages', 'array', true, 'Array of messages with role and content'), p('temperature', 'number', false, 'Sampling temperature (0-2)', { default: 0.7 }), p('maxTokens', 'number', false, 'Maximum tokens in response'), p('responseFormat', 'select', false, 'Response format', { options: ['text', 'json_object'] }), p('tools', 'array', false, 'Function calling tools/definitions')]),
            m('openai:ActionAnalyzeImages', 'Analyze Images (Vision)', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Analyzes images according to specified instructions using GPT-4 Vision. Describe, extract text, or answer questions about images.',
                [p('model', 'select', true, 'Vision model', { options: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] }), p('imageUrl', 'url', true, 'Image URL or base64 data'), p('prompt', 'text', true, 'Instructions for analyzing the image'), p('maxTokens', 'number', false, 'Maximum tokens in response')]),
            m('openai:ActionCreateImage', 'Generate an Image', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Generate images from text descriptions using DALL-E. Creates original images from natural language prompts.',
                [p('prompt', 'text', true, 'Image description prompt'), p('model', 'select', false, 'DALL-E model', { options: ['dall-e-3', 'dall-e-2'] }), p('size', 'select', false, 'Image size', { options: ['1024x1024', '1792x1024', '1024x1792', '512x512', '256x256'] }), p('quality', 'select', false, 'Image quality', { options: ['standard', 'hd'] }), p('n', 'number', false, 'Number of images to generate', { default: 1 })]),
            m('openai:ActionEditImage', 'Edit Images', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Creates an edited or extended image given one or more source images and a prompt.',
                [p('image', 'buffer', true, 'Source image file'), p('prompt', 'text', true, 'Description of the edit to make'), p('mask', 'buffer', false, 'Mask image indicating areas to edit'), p('size', 'select', false, 'Output image size', { options: ['1024x1024', '512x512', '256x256'] })]),
            m('openai:ActionTranscribe', 'Create a Transcription', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Transcribe audio to text using Whisper. Supports mp3, mp4, mpeg, mpga, m4a, wav, and webm formats.',
                [p('file', 'buffer', true, 'Audio file to transcribe'), p('model', 'select', true, 'Whisper model', { options: ['whisper-1'] }), p('language', 'text', false, 'Language code (ISO-639-1)'), p('prompt', 'text', false, 'Optional prompt to guide transcription'), p('responseFormat', 'select', false, 'Output format', { options: ['json', 'text', 'srt', 'vtt'] })]),
            m('openai:ActionTranslate', 'Create a Translation', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Translate audio into English text using Whisper. Takes audio in any language and outputs English text.',
                [p('file', 'buffer', true, 'Audio file to translate'), p('model', 'select', true, 'Model', { options: ['whisper-1'] }), p('prompt', 'text', false, 'Optional prompt to guide translation')]),
            m('openai:ActionCreateEmbedding', 'Create an Embedding', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Create vector embeddings from text for semantic search, clustering, and classification tasks.',
                [p('input', 'text', true, 'Text to embed'), p('model', 'select', true, 'Embedding model', { options: ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002'] })]),
            m('openai:ActionTextToSpeech', 'Transform Text to Speech', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Convert text to lifelike spoken audio using OpenAI TTS models.',
                [p('input', 'text', true, 'Text to convert to speech'), p('model', 'select', true, 'TTS model', { options: ['tts-1', 'tts-1-hd'] }), p('voice', 'select', true, 'Voice', { options: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] }), p('responseFormat', 'select', false, 'Audio format', { options: ['mp3', 'opus', 'aac', 'flac'] })]),
            m('openai:ActionCreateBatch', 'Create a Batch', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Creates and executes a batch of API calls for processing large volumes of requests at reduced cost.',
                [p('inputFileId', 'text', true, 'Input file ID containing batch requests'), p('endpoint', 'select', true, 'API endpoint', { options: ['/v1/chat/completions', '/v1/embeddings'] }), p('completionWindow', 'select', true, 'Completion window', { options: ['24h'] })]),
            m('openai:TriggerWatchResponses', 'Watch Responses', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'trigger',
                'Triggers when a new stored response is created in OpenAI.',
                [p('model', 'select', false, 'Filter by model')]),
            m('openai:SearchModels', 'List Models', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'search',
                'Lists all available OpenAI models that you have access to.',
                []),

            // ═══════════════════════════════════════
            // GMAIL (8 modules — real: 13 total)
            // ═══════════════════════════════════════
            m('gmail:ActionSendEmail', 'Send an Email', 'Gmail', 'action',
                'Send an email from your Gmail account. Supports HTML content, attachments, CC, BCC, and reply-to.',
                [p('to', 'email', true, 'Recipient email address(es)'), p('subject', 'text', true, 'Email subject line'), p('body', 'text', true, 'Email body (plain text or HTML)'), p('cc', 'email', false, 'CC recipients'), p('bcc', 'email', false, 'BCC recipients'), p('replyTo', 'email', false, 'Reply-to address'), p('attachments', 'array', false, 'File attachments'), p('isHtml', 'boolean', false, 'Whether body is HTML')]),
            m('gmail:ActionCreateDraft', 'Create a Draft', 'Gmail', 'action',
                'Create a draft email in Gmail without sending it.',
                [p('to', 'email', true, 'Recipient email'), p('subject', 'text', true, 'Subject line'), p('body', 'text', true, 'Email body'), p('cc', 'email', false, 'CC recipients')]),
            m('gmail:ActionMoveEmail', 'Move an Email', 'Gmail', 'action',
                'Move an email to a specified Gmail label/folder.',
                [p('emailId', 'text', true, 'Email message ID'), p('label', 'text', true, 'Destination label')]),
            m('gmail:ActionMarkAsRead', 'Mark an Email as Read', 'Gmail', 'action',
                'Mark an email as read or unread.',
                [p('emailId', 'text', true, 'Email message ID'), p('read', 'boolean', true, 'Mark as read (true) or unread (false)')]),
            m('gmail:ActionDeleteEmail', 'Delete an Email', 'Gmail', 'action',
                'Permanently delete an email or move it to trash.',
                [p('emailId', 'text', true, 'Email message ID'), p('permanent', 'boolean', false, 'Permanently delete (skip trash)')]),
            m('gmail:ActionAddLabel', 'Add a Label', 'Gmail', 'action',
                'Add a label to an email message.',
                [p('emailId', 'text', true, 'Email message ID'), p('label', 'text', true, 'Label to add')]),
            m('gmail:TriggerWatchEmails', 'Watch Emails', 'Gmail', 'trigger',
                'Trigger when a new email arrives in your Gmail inbox. Can filter by label, sender, subject, or full-text search.',
                [p('label', 'text', false, 'Filter by Gmail label'), p('from', 'email', false, 'Filter by sender address'), p('subject', 'text', false, 'Filter by subject keyword'), p('search', 'text', false, 'Gmail search query (e.g., "has:attachment is:unread")')]),
            m('gmail:SearchEmails', 'Search Emails', 'Gmail', 'search',
                'Search Gmail messages using Gmail search syntax.',
                [p('query', 'text', true, 'Gmail search query'), p('maxResults', 'number', false, 'Maximum results to return')]),

            // ═══════════════════════════════════════
            // GOOGLE DRIVE (10 modules — real: 32 total)
            // ═══════════════════════════════════════
            m('google-drive:ActionUploadFile', 'Upload a File', 'Google Drive', 'action',
                'Upload a file to Google Drive. Supports any file type.',
                [p('folderId', 'text', false, 'Target folder ID (root if empty)'), p('fileName', 'text', true, 'Name for the uploaded file'), p('data', 'buffer', true, 'File data to upload'), p('mimeType', 'text', false, 'File MIME type')]),
            m('google-drive:ActionCreateFolder', 'Create a Folder', 'Google Drive', 'action',
                'Creates a new folder in Google Drive.',
                [p('name', 'text', true, 'Folder name'), p('parentId', 'text', false, 'Parent folder ID')]),
            m('google-drive:ActionCopyFile', 'Copy a File', 'Google Drive', 'action',
                'Makes a copy of an existing file in Google Drive.',
                [p('fileId', 'text', true, 'Source file ID'), p('name', 'text', false, 'New file name'), p('folderId', 'text', false, 'Destination folder ID')]),
            m('google-drive:ActionMoveFile', 'Move a File/Folder', 'Google Drive', 'action',
                'Moves a file or folder to a different location in Google Drive.',
                [p('fileId', 'text', true, 'File or folder ID'), p('folderId', 'text', true, 'Destination folder ID')]),
            m('google-drive:ActionDeleteFile', 'Delete a File/Folder', 'Google Drive', 'action',
                'Permanently deletes a file or folder owned by the user without moving it to the trash.',
                [p('fileId', 'text', true, 'File or folder ID to delete')]),
            m('google-drive:ActionDownloadFile', 'Download a File', 'Google Drive', 'action',
                'Downloads a file from Google Drive as binary data.',
                [p('fileId', 'text', true, 'File ID to download')]),
            m('google-drive:ActionCreateFromText', 'Create a File from Text', 'Google Drive', 'action',
                'Creates a new file from plain text content.',
                [p('name', 'text', true, 'File name'), p('content', 'text', true, 'Text content'), p('folderId', 'text', false, 'Destination folder'), p('mimeType', 'text', false, 'MIME type', { default: 'text/plain' })]),
            m('google-drive:ActionShareFile', 'Share a File/Folder', 'Google Drive', 'action',
                'Updates sharing permissions for a file or folder.',
                [p('fileId', 'text', true, 'File or folder ID'), p('role', 'select', true, 'Permission role', { options: ['reader', 'writer', 'commenter', 'owner'] }), p('type', 'select', true, 'Permission type', { options: ['user', 'group', 'domain', 'anyone'] }), p('emailAddress', 'email', false, 'Email for user/group permissions')]),
            m('google-drive:TriggerWatchFiles', 'Watch Files', 'Google Drive', 'trigger',
                'Trigger when a new file is created or an existing file is modified in Google Drive.',
                [p('folderId', 'text', false, 'Folder to watch (all if empty)'), p('watch', 'select', false, 'Watch for', { options: ['created', 'modified', 'all'] })]),
            m('google-drive:SearchFiles', 'Search Files/Folders', 'Google Drive', 'search',
                'Search for files and folders in Google Drive using search queries.',
                [p('query', 'text', false, 'Search query'), p('folderId', 'text', false, 'Limit search to folder'), p('mimeType', 'text', false, 'Filter by MIME type')]),

            // ═══════════════════════════════════════
            // GOOGLE DOCS (5 modules)
            // ═══════════════════════════════════════
            m('google-docs:ActionCreateDocument', 'Create a Document', 'Google Docs', 'action',
                'Creates a new Google Docs document.',
                [p('title', 'text', true, 'Document title'), p('content', 'text', false, 'Initial document content'), p('folderId', 'text', false, 'Google Drive folder ID')]),
            m('google-docs:ActionInsertText', 'Insert a Text to a Document', 'Google Docs', 'action',
                'Inserts text at a specified location in a Google Docs document.',
                [p('documentId', 'text', true, 'Document ID'), p('text', 'text', true, 'Text to insert'), p('location', 'select', true, 'Where to insert', { options: ['end', 'beginning', 'index'] })]),
            m('google-docs:ActionReplaceText', 'Replace Text in a Document', 'Google Docs', 'action',
                'Replaces all occurrences of a text string in a Google Docs document.',
                [p('documentId', 'text', true, 'Document ID'), p('searchText', 'text', true, 'Text to find'), p('replaceText', 'text', true, 'Replacement text'), p('matchCase', 'boolean', false, 'Case-sensitive match')]),
            m('google-docs:ActionGetContent', 'Get a Content of a Document', 'Google Docs', 'action',
                'Retrieves the full content of a Google Docs document.',
                [p('documentId', 'text', true, 'Document ID')]),
            m('google-docs:ActionDownloadDocument', 'Download a Document', 'Google Docs', 'action',
                'Downloads a Google Docs document in a specified format.',
                [p('documentId', 'text', true, 'Document ID'), p('format', 'select', true, 'Export format', { options: ['pdf', 'docx', 'txt', 'html', 'epub', 'odt'] })]),

            // ═══════════════════════════════════════
            // GOOGLE CALENDAR (6 modules)
            // ═══════════════════════════════════════
            m('google-calendar:ActionCreateEvent', 'Create an Event', 'Google Calendar', 'action',
                'Creates a new event in a Google Calendar.',
                [p('calendarId', 'text', true, 'Calendar ID'), p('summary', 'text', true, 'Event title'), p('start', 'date', true, 'Start date/time'), p('end', 'date', true, 'End date/time'), p('description', 'text', false, 'Event description'), p('location', 'text', false, 'Event location'), p('attendees', 'array', false, 'Attendee email addresses'), p('reminders', 'array', false, 'Reminder settings')]),
            m('google-calendar:ActionUpdateEvent', 'Update an Event', 'Google Calendar', 'action',
                'Updates an existing event in Google Calendar.',
                [p('calendarId', 'text', true, 'Calendar ID'), p('eventId', 'text', true, 'Event ID'), p('summary', 'text', false, 'Updated title'), p('start', 'date', false, 'Updated start'), p('end', 'date', false, 'Updated end')]),
            m('google-calendar:ActionDeleteEvent', 'Delete an Event', 'Google Calendar', 'action',
                'Deletes an event from Google Calendar.',
                [p('calendarId', 'text', true, 'Calendar ID'), p('eventId', 'text', true, 'Event ID')]),
            m('google-calendar:ActionQuickAddEvent', 'Quick Add an Event', 'Google Calendar', 'action',
                'Creates an event using natural language text (e.g., "Meeting with John tomorrow at 3pm").',
                [p('calendarId', 'text', true, 'Calendar ID'), p('text', 'text', true, 'Natural language event description')]),
            m('google-calendar:TriggerWatchEvents', 'Watch Events', 'Google Calendar', 'trigger',
                'Trigger when a new event is created, updated, or starts in Google Calendar.',
                [p('calendarId', 'text', true, 'Calendar ID'), p('watch', 'select', false, 'Watch for', { options: ['created', 'updated', 'started'] })]),
            m('google-calendar:SearchEvents', 'Search Events', 'Google Calendar', 'search',
                'Search for events in a Google Calendar within a date range.',
                [p('calendarId', 'text', true, 'Calendar ID'), p('query', 'text', false, 'Search text'), p('timeMin', 'date', false, 'Start of search range'), p('timeMax', 'date', false, 'End of search range')]),

            // ═══════════════════════════════════════
            // SLACK (12 modules — real: 46 total)
            // ═══════════════════════════════════════
            m('slack:ActionPostMessage', 'Post a Message', 'Slack', 'action',
                'Post a message to a Slack channel, group, or direct message. Supports rich text formatting, Block Kit, and attachments.',
                [p('channel', 'text', true, 'Channel ID or name (#general)'), p('text', 'text', true, 'Message text (supports Slack mrkdwn)'), p('username', 'text', false, 'Override bot username'), p('iconEmoji', 'text', false, 'Override bot icon emoji (e.g., :robot:)'), p('iconUrl', 'url', false, 'Override bot icon URL'), p('blocks', 'array', false, 'Block Kit blocks for rich layouts'), p('threadTs', 'text', false, 'Thread timestamp to reply in thread')]),
            m('slack:ActionEditMessage', 'Edit a Message', 'Slack', 'action',
                'Edits an existing Slack message.',
                [p('channel', 'text', true, 'Channel ID'), p('ts', 'text', true, 'Message timestamp'), p('text', 'text', true, 'New message text')]),
            m('slack:ActionDeleteMessage', 'Delete a Message', 'Slack', 'action',
                'Removes a Slack message from a channel.',
                [p('channel', 'text', true, 'Channel ID'), p('ts', 'text', true, 'Message timestamp')]),
            m('slack:ActionAddReaction', 'Add a Reaction', 'Slack', 'action',
                'Adds an emoji reaction to a message.',
                [p('channel', 'text', true, 'Channel ID'), p('ts', 'text', true, 'Message timestamp'), p('emoji', 'text', true, 'Emoji name without colons (e.g., thumbsup)')]),
            m('slack:ActionCreateChannel', 'Create a Channel', 'Slack', 'action',
                'Creates a new Slack channel.',
                [p('name', 'text', true, 'Channel name (lowercase, no spaces)'), p('isPrivate', 'boolean', false, 'Create as private channel')]),
            m('slack:ActionArchiveChannel', 'Archive a Channel', 'Slack', 'action',
                'Archives a Slack channel.',
                [p('channel', 'text', true, 'Channel ID to archive')]),
            m('slack:ActionInviteToChannel', 'Invite to Channel', 'Slack', 'action',
                'Invites a user to a Slack channel.',
                [p('channel', 'text', true, 'Channel ID'), p('user', 'text', true, 'User ID to invite')]),
            m('slack:ActionSetTopic', 'Set a Topic', 'Slack', 'action',
                'Sets the topic of a Slack channel.',
                [p('channel', 'text', true, 'Channel ID'), p('topic', 'text', true, 'New channel topic')]),
            m('slack:ActionUploadFile', 'Upload a File', 'Slack', 'action',
                'Upload a file to a Slack channel.',
                [p('channels', 'text', true, 'Channel ID(s) to share the file in'), p('file', 'buffer', true, 'File data'), p('filename', 'text', true, 'File name'), p('title', 'text', false, 'File title'), p('initialComment', 'text', false, 'Initial comment')]),
            m('slack:ActionCreateReminder', 'Create a Reminder', 'Slack', 'action',
                'Creates a reminder for a user.',
                [p('text', 'text', true, 'Reminder text'), p('time', 'text', true, 'When to remind (e.g., "in 5 minutes", "tomorrow at 9am")'), p('user', 'text', false, 'User ID (defaults to self)')]),
            m('slack:TriggerWatchMessages', 'Watch Public Channel Messages', 'Slack', 'trigger',
                'Trigger when a new message is posted in a public Slack channel.',
                [p('channel', 'text', true, 'Channel to watch'), p('limit', 'number', false, 'Max messages per run')]),
            m('slack:TriggerWatchPrivateMessages', 'Watch Private Channel Messages', 'Slack', 'trigger',
                'Trigger when a new message is posted in a private Slack channel.',
                [p('channel', 'text', true, 'Private channel to watch')]),
            m('slack:TriggerWatchReactions', 'Watch Reactions', 'Slack', 'trigger',
                'Trigger when a reaction (emoji) is added to a message.',
                [p('channel', 'text', false, 'Channel to watch (all if empty)')]),
            m('slack:SearchMessages', 'Search Messages', 'Slack', 'search',
                'Search Slack messages matching a query.',
                [p('query', 'text', true, 'Search query'), p('sort', 'select', false, 'Sort by', { options: ['score', 'timestamp'] })]),
            m('slack:SearchUsers', 'Get a User', 'Slack', 'search',
                'Retrieves information about a Slack user.',
                [p('userId', 'text', true, 'User ID')]),
            m('slack:SearchChannels', 'Get a Channel', 'Slack', 'search',
                'Returns details about a Slack channel.',
                [p('channelId', 'text', true, 'Channel ID')]),

            // ═══════════════════════════════════════
            // NOTION (10 modules — real: 30 total)
            // ═══════════════════════════════════════
            m('notion:ActionCreateDatabaseItem', 'Create a Database Item', 'Notion', 'action',
                'Creates a new item (page) in a Notion database with specified property values.',
                [p('databaseId', 'text', true, 'Notion database ID'), p('properties', 'object', true, 'Property values for the new item'), p('content', 'array', false, 'Page content blocks')]),
            m('notion:ActionUpdateDatabaseItem', 'Update a Database Item', 'Notion', 'action',
                'Updates properties of an existing item in a Notion database.',
                [p('pageId', 'text', true, 'Page/item ID'), p('properties', 'object', true, 'Updated property values')]),
            m('notion:ActionCreatePage', 'Create a Page', 'Notion', 'action',
                'Creates a new page in a specified parent page in Notion.',
                [p('parentPageId', 'text', true, 'Parent page ID'), p('title', 'text', true, 'Page title'), p('content', 'array', false, 'Page content blocks (paragraphs, headings, etc.)')]),
            m('notion:ActionAppendPageContent', 'Append a Page Content', 'Notion', 'action',
                'Appends new content blocks to an existing Notion page.',
                [p('pageId', 'text', true, 'Page ID'), p('children', 'array', true, 'Content blocks to append')]),
            m('notion:ActionCreateDatabase', 'Create a Database', 'Notion', 'action',
                'Creates a new database in Notion with specified properties/columns.',
                [p('parentPageId', 'text', true, 'Parent page ID'), p('title', 'text', true, 'Database title'), p('properties', 'object', true, 'Database property definitions')]),
            m('notion:ActionDeletePageContent', 'Delete a Page Content', 'Notion', 'action',
                'Archives (soft-deletes) a page content block in Notion.',
                [p('blockId', 'text', true, 'Block ID to archive')]),
            m('notion:TriggerWatchDatabaseItems', 'Watch Database Items', 'Notion', 'trigger',
                'Trigger when new items are added to a Notion database.',
                [p('databaseId', 'text', true, 'Notion database ID'), p('limit', 'number', false, 'Max items per run')]),
            m('notion:TriggerWatchPages', 'Watch Pages', 'Notion', 'trigger',
                'Trigger when pages are created or updated in Notion.',
                [p('parentId', 'text', false, 'Parent page or database ID')]),
            m('notion:SearchDatabaseItems', 'Search Database Items', 'Notion', 'search',
                'Query a Notion database with filters and sorts.',
                [p('databaseId', 'text', true, 'Database ID'), p('filter', 'object', false, 'Filter conditions'), p('sort', 'array', false, 'Sort criteria')]),
            m('notion:SearchPages', 'Search Pages', 'Notion', 'search',
                'Search for pages across your entire Notion workspace.',
                [p('query', 'text', true, 'Search text')]),

            // ═══════════════════════════════════════
            // AIRTABLE (8 modules — real: 13 total)
            // ═══════════════════════════════════════
            m('airtable:ActionCreateRecord', 'Create a Record', 'Airtable', 'action',
                'Creates a new record in an Airtable base table with specified field values.',
                [p('baseId', 'text', true, 'Airtable base ID'), p('tableId', 'text', true, 'Table name or ID'), p('fields', 'object', true, 'Field values for the new record')]),
            m('airtable:ActionUpdateRecord', 'Update a Record', 'Airtable', 'action',
                'Updates an existing record in Airtable.',
                [p('baseId', 'text', true, 'Airtable base ID'), p('tableId', 'text', true, 'Table name or ID'), p('recordId', 'text', true, 'Record ID'), p('fields', 'object', true, 'Updated field values')]),
            m('airtable:ActionDeleteRecord', 'Delete a Record', 'Airtable', 'action',
                'Deletes a record from Airtable by its ID.',
                [p('baseId', 'text', true, 'Base ID'), p('tableId', 'text', true, 'Table name or ID'), p('recordId', 'text', true, 'Record ID to delete')]),
            m('airtable:ActionGetRecord', 'Get a Record', 'Airtable', 'action',
                'Retrieves a single record by its ID.',
                [p('baseId', 'text', true, 'Base ID'), p('tableId', 'text', true, 'Table name'), p('recordId', 'text', true, 'Record ID')]),
            m('airtable:ActionBulkCreate', 'Bulk Create Records', 'Airtable', 'search',
                'Creates multiple records in one operation.',
                [p('baseId', 'text', true, 'Base ID'), p('tableId', 'text', true, 'Table name'), p('records', 'array', true, 'Array of record objects')]),
            m('airtable:ActionBulkUpdate', 'Bulk Update Records', 'Airtable', 'search',
                'Updates multiple existing records in one operation.',
                [p('baseId', 'text', true, 'Base ID'), p('tableId', 'text', true, 'Table name'), p('records', 'array', true, 'Array of {id, fields} objects')]),
            m('airtable:SearchRecords', 'Search Records', 'Airtable', 'search',
                'Searches for specific records or returns all records in an Airtable table. Supports formula-based filtering.',
                [p('baseId', 'text', true, 'Airtable base ID'), p('tableId', 'text', true, 'Table name or ID'), p('filterByFormula', 'text', false, 'Airtable filter formula'), p('sort', 'array', false, 'Sort configuration'), p('maxRecords', 'number', false, 'Max records to return')]),
            m('airtable:TriggerWatchRecords', 'Watch Records', 'Airtable', 'trigger',
                'Trigger when new records are created in an Airtable table.',
                [p('baseId', 'text', true, 'Base ID'), p('tableId', 'text', true, 'Table name'), p('limit', 'number', false, 'Max records per run')]),

            // ═══════════════════════════════════════
            // TELEGRAM BOT (10 modules — real: 32 total)
            // ═══════════════════════════════════════
            m('telegram:TriggerWatchUpdates', 'Watch Updates', 'Telegram Bot', 'trigger',
                'Trigger when the bot receives new messages, commands, or callbacks in Telegram.',
                [p('limit', 'number', false, 'Max updates per run'), p('allowedUpdates', 'array', false, 'Filter update types (message, edited_message, callback_query, etc.)')]),
            m('telegram:ActionSendTextMessage', 'Send a Text Message', 'Telegram Bot', 'action',
                'Sends a text message to a Telegram chat. Supports HTML and Markdown formatting.',
                [p('chatId', 'text', true, 'Chat ID or @username'), p('text', 'text', true, 'Message text'), p('parseMode', 'select', false, 'Formatting mode', { options: ['HTML', 'Markdown', 'MarkdownV2'] }), p('disableNotification', 'boolean', false, 'Send silently'), p('replyToMessageId', 'number', false, 'Message ID to reply to'), p('replyMarkup', 'object', false, 'Inline keyboard or custom keyboard')]),
            m('telegram:ActionSendPhoto', 'Send a Photo', 'Telegram Bot', 'action',
                'Sends a photo to a Telegram chat.',
                [p('chatId', 'text', true, 'Chat ID'), p('photo', 'buffer', true, 'Photo file or URL'), p('caption', 'text', false, 'Photo caption')]),
            m('telegram:ActionSendDocument', 'Send a Document', 'Telegram Bot', 'action',
                'Sends a document/file to a Telegram chat.',
                [p('chatId', 'text', true, 'Chat ID'), p('document', 'buffer', true, 'Document file'), p('caption', 'text', false, 'Document caption'), p('filename', 'text', false, 'File name')]),
            m('telegram:ActionSendVideo', 'Send a Video', 'Telegram Bot', 'action',
                'Sends a video to a Telegram chat.',
                [p('chatId', 'text', true, 'Chat ID'), p('video', 'buffer', true, 'Video file or URL'), p('caption', 'text', false, 'Video caption')]),
            m('telegram:ActionEditMessage', 'Edit a Text Message', 'Telegram Bot', 'action',
                'Edits text of a previously sent message.',
                [p('chatId', 'text', true, 'Chat ID'), p('messageId', 'number', true, 'Message ID'), p('text', 'text', true, 'New message text')]),
            m('telegram:ActionDeleteMessage', 'Delete a Message', 'Telegram Bot', 'action',
                'Deletes a message (can only delete messages sent less than 48 hours ago).',
                [p('chatId', 'text', true, 'Chat ID'), p('messageId', 'number', true, 'Message ID')]),
            m('telegram:ActionForwardMessage', 'Forward a Message', 'Telegram Bot', 'action',
                'Forwards a message from one chat to another within Telegram.',
                [p('chatId', 'text', true, 'Destination chat ID'), p('fromChatId', 'text', true, 'Source chat ID'), p('messageId', 'number', true, 'Message ID to forward')]),
            m('telegram:ActionDownloadFile', 'Download a File', 'Telegram Bot', 'action',
                'Downloads a file from the Telegram server by file ID.',
                [p('fileId', 'text', true, 'Telegram file ID')]),
            m('telegram:ActionMakeAPICall', 'Make an API Call', 'Telegram Bot', 'action',
                'Makes a custom Telegram Bot API call for any method not covered by other modules.',
                [p('method', 'text', true, 'API method name'), p('body', 'object', false, 'Request parameters')]),

            // ═══════════════════════════════════════
            // HUBSPOT CRM (10 modules — real: 121 total)
            // ═══════════════════════════════════════
            m('hubspot:ActionCreateContact', 'Create a Contact', 'HubSpot CRM', 'action',
                'Creates a new contact in HubSpot CRM with specified properties.',
                [p('email', 'email', true, 'Contact email'), p('firstName', 'text', false, 'First name'), p('lastName', 'text', false, 'Last name'), p('phone', 'text', false, 'Phone number'), p('company', 'text', false, 'Company name'), p('properties', 'object', false, 'Additional contact properties')]),
            m('hubspot:ActionUpdateContact', 'Update a Contact', 'HubSpot CRM', 'action',
                'Updates an existing contact in HubSpot CRM.',
                [p('contactId', 'text', true, 'Contact ID'), p('properties', 'object', true, 'Updated property values')]),
            m('hubspot:ActionCreateDeal', 'Create a Deal', 'HubSpot CRM', 'action',
                'Creates a new deal in HubSpot CRM pipeline.',
                [p('dealName', 'text', true, 'Deal name'), p('pipeline', 'text', true, 'Pipeline ID'), p('dealStage', 'text', true, 'Deal stage ID'), p('amount', 'number', false, 'Deal amount'), p('closeDate', 'date', false, 'Expected close date'), p('properties', 'object', false, 'Additional deal properties')]),
            m('hubspot:ActionUpdateDeal', 'Update a Deal', 'HubSpot CRM', 'action',
                'Updates an existing deal in HubSpot CRM.',
                [p('dealId', 'text', true, 'Deal ID'), p('properties', 'object', true, 'Updated properties')]),
            m('hubspot:ActionCreateCompany', 'Create a Company', 'HubSpot CRM', 'action',
                'Creates a new company in HubSpot CRM.',
                [p('name', 'text', true, 'Company name'), p('domain', 'text', false, 'Company domain'), p('industry', 'text', false, 'Industry'), p('properties', 'object', false, 'Additional properties')]),
            m('hubspot:ActionCreateTicket', 'Create a Ticket', 'HubSpot CRM', 'action',
                'Creates a new support ticket in HubSpot.',
                [p('subject', 'text', true, 'Ticket subject'), p('content', 'text', false, 'Ticket description'), p('pipeline', 'text', true, 'Pipeline ID'), p('status', 'text', true, 'Ticket status')]),
            m('hubspot:ActionAddContactToList', 'Add Members to a List', 'HubSpot CRM', 'action',
                'Adds contact records to a HubSpot contact list.',
                [p('listId', 'text', true, 'List ID'), p('contactIds', 'array', true, 'Array of contact IDs to add')]),
            m('hubspot:TriggerWatchContacts', 'Watch Contacts', 'HubSpot CRM', 'trigger',
                'Trigger when a new contact is created in HubSpot CRM.',
                [p('limit', 'number', false, 'Max contacts per run')]),
            m('hubspot:TriggerWatchDeals', 'Watch Deals', 'HubSpot CRM', 'trigger',
                'Trigger when a new deal is created or updated in HubSpot CRM.',
                [p('pipeline', 'text', false, 'Filter by pipeline'), p('limit', 'number', false, 'Max deals per run')]),
            m('hubspot:SearchContacts', 'Search Contacts', 'HubSpot CRM', 'search',
                'Search for contacts in HubSpot CRM using filters.',
                [p('query', 'text', false, 'Search query'), p('filters', 'array', false, 'Filter groups'), p('limit', 'number', false, 'Max results')]),

            // ═══════════════════════════════════════
            // MICROSOFT TEAMS (5 modules)
            // ═══════════════════════════════════════
            m('microsoft-teams:ActionSendMessage', 'Send a Message', 'Microsoft Teams', 'action',
                'Send a message to a Microsoft Teams channel or chat. Supports HTML formatting.',
                [p('teamId', 'text', true, 'Team ID'), p('channelId', 'text', true, 'Channel ID'), p('message', 'text', true, 'Message content (supports HTML)'), p('contentType', 'select', false, 'Content type', { options: ['text', 'html'] })]),
            m('microsoft-teams:ActionCreateChannel', 'Create a Channel', 'Microsoft Teams', 'action',
                'Creates a new channel in a Microsoft Teams team.',
                [p('teamId', 'text', true, 'Team ID'), p('displayName', 'text', true, 'Channel name'), p('description', 'text', false, 'Channel description')]),
            m('microsoft-teams:ActionReplyToMessage', 'Reply to a Message', 'Microsoft Teams', 'action',
                'Reply to an existing message in a Teams channel.',
                [p('teamId', 'text', true, 'Team ID'), p('channelId', 'text', true, 'Channel ID'), p('messageId', 'text', true, 'Parent message ID'), p('message', 'text', true, 'Reply content')]),
            m('microsoft-teams:TriggerWatchMessages', 'Watch Channel Messages', 'Microsoft Teams', 'trigger',
                'Trigger when a new message is posted in a Teams channel.',
                [p('teamId', 'text', true, 'Team ID'), p('channelId', 'text', true, 'Channel ID')]),
            m('microsoft-teams:SearchMembers', 'List Team Members', 'Microsoft Teams', 'search',
                'Lists all members of a Microsoft Teams team.',
                [p('teamId', 'text', true, 'Team ID')]),

            // ═══════════════════════════════════════
            // MICROSOFT OUTLOOK (5 modules)
            // ═══════════════════════════════════════
            m('microsoft-outlook:ActionSendEmail', 'Send an Email', 'Microsoft Outlook 365', 'action',
                'Send an email from your Microsoft 365 Outlook account.',
                [p('to', 'email', true, 'Recipient email'), p('subject', 'text', true, 'Subject'), p('body', 'text', true, 'Email body'), p('cc', 'email', false, 'CC'), p('bcc', 'email', false, 'BCC'), p('attachments', 'array', false, 'File attachments'), p('isHtml', 'boolean', false, 'HTML body')]),
            m('microsoft-outlook:ActionCreateDraft', 'Create a Draft Message', 'Microsoft Outlook 365', 'action',
                'Create a draft email in Outlook without sending.',
                [p('to', 'email', true, 'Recipient'), p('subject', 'text', true, 'Subject'), p('body', 'text', true, 'Body')]),
            m('microsoft-outlook:ActionCreateEvent', 'Create an Event', 'Microsoft Outlook 365', 'action',
                'Create a calendar event in Microsoft Outlook.',
                [p('subject', 'text', true, 'Event subject'), p('start', 'date', true, 'Start date/time'), p('end', 'date', true, 'End date/time'), p('attendees', 'array', false, 'Attendee emails')]),
            m('microsoft-outlook:TriggerWatchEmails', 'Watch Emails', 'Microsoft Outlook 365', 'trigger',
                'Trigger when a new email arrives in your Outlook inbox.',
                [p('folder', 'text', false, 'Mail folder (default: Inbox)'), p('filter', 'text', false, 'OData filter query')]),
            m('microsoft-outlook:SearchEmails', 'Search Emails', 'Microsoft Outlook 365', 'search',
                'Search emails in Microsoft Outlook 365.',
                [p('query', 'text', true, 'Search query'), p('folder', 'text', false, 'Folder to search')]),

            // ═══════════════════════════════════════
            // DISCORD (5 modules)
            // ═══════════════════════════════════════
            m('discord:ActionSendMessage', 'Send a Message', 'Discord', 'action',
                'Send a message to a Discord channel using a bot.',
                [p('channelId', 'text', true, 'Channel ID'), p('content', 'text', true, 'Message content'), p('embeds', 'array', false, 'Rich embeds'), p('tts', 'boolean', false, 'Text-to-speech')]),
            m('discord:ActionEditMessage', 'Edit a Message', 'Discord', 'action',
                'Edit a previously sent Discord message.',
                [p('channelId', 'text', true, 'Channel ID'), p('messageId', 'text', true, 'Message ID'), p('content', 'text', true, 'New content')]),
            m('discord:ActionDeleteMessage', 'Delete a Message', 'Discord', 'action',
                'Delete a message from a Discord channel.',
                [p('channelId', 'text', true, 'Channel ID'), p('messageId', 'text', true, 'Message ID')]),
            m('discord:ActionCreateChannel', 'Create a Channel', 'Discord', 'action',
                'Create a new channel in a Discord server.',
                [p('guildId', 'text', true, 'Server/guild ID'), p('name', 'text', true, 'Channel name'), p('type', 'select', false, 'Channel type', { options: ['text', 'voice', 'category'] })]),
            m('discord:TriggerWatchMessages', 'Watch Messages', 'Discord', 'trigger',
                'Trigger when a new message is posted in a Discord channel.',
                [p('channelId', 'text', true, 'Channel ID')]),

            // ═══════════════════════════════════════
            // JIRA (6 modules)
            // ═══════════════════════════════════════
            m('jira:ActionCreateIssue', 'Create an Issue', 'Jira Software', 'action',
                'Creates a new issue (bug, task, story, epic) in a Jira project.',
                [p('projectKey', 'text', true, 'Project key (e.g., PROJ)'), p('issueType', 'select', true, 'Issue type', { options: ['Bug', 'Task', 'Story', 'Epic', 'Sub-task'] }), p('summary', 'text', true, 'Issue title'), p('description', 'text', false, 'Issue description'), p('priority', 'select', false, 'Priority', { options: ['Highest', 'High', 'Medium', 'Low', 'Lowest'] }), p('assignee', 'text', false, 'Assignee account ID'), p('labels', 'array', false, 'Labels')]),
            m('jira:ActionUpdateIssue', 'Update an Issue', 'Jira Software', 'action',
                'Updates fields of an existing Jira issue.',
                [p('issueKey', 'text', true, 'Issue key (e.g., PROJ-123)'), p('fields', 'object', true, 'Fields to update')]),
            m('jira:ActionTransitionIssue', 'Transition an Issue', 'Jira Software', 'action',
                'Move an issue to a different status (e.g., To Do → In Progress → Done).',
                [p('issueKey', 'text', true, 'Issue key'), p('transitionId', 'text', true, 'Transition ID or name')]),
            m('jira:ActionAddComment', 'Add a Comment', 'Jira Software', 'action',
                'Adds a comment to a Jira issue.',
                [p('issueKey', 'text', true, 'Issue key'), p('body', 'text', true, 'Comment body')]),
            m('jira:TriggerWatchIssues', 'Watch Issues', 'Jira Software', 'trigger',
                'Trigger when issues are created or updated in a Jira project.',
                [p('projectKey', 'text', true, 'Project key'), p('jql', 'text', false, 'JQL filter query')]),
            m('jira:SearchIssues', 'Search Issues', 'Jira Software', 'search',
                'Search for Jira issues using JQL (Jira Query Language).',
                [p('jql', 'text', true, 'JQL query (e.g., project=PROJ AND status="In Progress")'), p('maxResults', 'number', false, 'Max results')]),

            // ═══════════════════════════════════════
            // TRELLO (6 modules)
            // ═══════════════════════════════════════
            m('trello:ActionCreateCard', 'Create a Card', 'Trello', 'action',
                'Creates a new card in a Trello list.',
                [p('listId', 'text', true, 'List ID'), p('name', 'text', true, 'Card name'), p('description', 'text', false, 'Card description'), p('dueDate', 'date', false, 'Due date'), p('labels', 'array', false, 'Label IDs'), p('members', 'array', false, 'Member IDs')]),
            m('trello:ActionUpdateCard', 'Update a Card', 'Trello', 'action',
                'Updates an existing Trello card.',
                [p('cardId', 'text', true, 'Card ID'), p('name', 'text', false, 'New name'), p('description', 'text', false, 'New description'), p('listId', 'text', false, 'Move to list'), p('closed', 'boolean', false, 'Archive the card')]),
            m('trello:ActionAddComment', 'Add a Comment', 'Trello', 'action',
                'Adds a comment to a Trello card.',
                [p('cardId', 'text', true, 'Card ID'), p('text', 'text', true, 'Comment text')]),
            m('trello:ActionCreateList', 'Create a List', 'Trello', 'action',
                'Creates a new list on a Trello board.',
                [p('boardId', 'text', true, 'Board ID'), p('name', 'text', true, 'List name')]),
            m('trello:TriggerWatchCards', 'Watch Cards', 'Trello', 'trigger',
                'Trigger when a new card is created on a Trello board.',
                [p('boardId', 'text', true, 'Board ID')]),
            m('trello:SearchCards', 'Search Cards', 'Trello', 'search',
                'Search for cards on a Trello board.',
                [p('query', 'text', true, 'Search query'), p('boardId', 'text', false, 'Limit to board')]),

            // ═══════════════════════════════════════
            // ASANA (5 modules)
            // ═══════════════════════════════════════
            m('asana:ActionCreateTask', 'Create a Task', 'Asana', 'action',
                'Creates a new task in an Asana project.',
                [p('projectId', 'text', true, 'Project ID'), p('name', 'text', true, 'Task name'), p('notes', 'text', false, 'Task description'), p('assignee', 'text', false, 'Assignee email or ID'), p('dueOn', 'date', false, 'Due date'), p('tags', 'array', false, 'Tag IDs')]),
            m('asana:ActionUpdateTask', 'Update a Task', 'Asana', 'action',
                'Updates an existing Asana task.',
                [p('taskId', 'text', true, 'Task ID'), p('name', 'text', false, 'New name'), p('completed', 'boolean', false, 'Mark as complete')]),
            m('asana:ActionAddComment', 'Add a Comment', 'Asana', 'action',
                'Adds a comment/story to an Asana task.',
                [p('taskId', 'text', true, 'Task ID'), p('text', 'text', true, 'Comment text')]),
            m('asana:TriggerWatchTasks', 'Watch Tasks', 'Asana', 'trigger',
                'Trigger when new tasks are created in an Asana project.',
                [p('projectId', 'text', true, 'Project ID')]),
            m('asana:SearchTasks', 'Search Tasks', 'Asana', 'search',
                'Search for tasks in Asana.',
                [p('workspace', 'text', true, 'Workspace ID'), p('query', 'text', false, 'Search text')]),

            // ═══════════════════════════════════════
            // MONDAY.COM (5 modules)
            // ═══════════════════════════════════════
            m('monday:ActionCreateItem', 'Create an Item', 'monday.com', 'action',
                'Creates a new item in a monday.com board.',
                [p('boardId', 'text', true, 'Board ID'), p('itemName', 'text', true, 'Item name'), p('columnValues', 'object', false, 'Column values as JSON'), p('groupId', 'text', false, 'Group ID')]),
            m('monday:ActionUpdateItem', 'Update an Item', 'monday.com', 'action',
                'Updates column values of an item in monday.com.',
                [p('boardId', 'text', true, 'Board ID'), p('itemId', 'text', true, 'Item ID'), p('columnValues', 'object', true, 'Updated column values')]),
            m('monday:ActionCreateUpdate', 'Create an Update', 'monday.com', 'action',
                'Adds a text update/comment to a monday.com item.',
                [p('itemId', 'text', true, 'Item ID'), p('body', 'text', true, 'Update text')]),
            m('monday:TriggerWatchItems', 'Watch Items', 'monday.com', 'trigger',
                'Trigger when a new item is created on a monday.com board.',
                [p('boardId', 'text', true, 'Board ID')]),
            m('monday:TriggerWatchUpdates', 'Watch Column Values', 'monday.com', 'trigger',
                'Trigger when a column value changes on a monday.com board.',
                [p('boardId', 'text', true, 'Board ID'), p('columnId', 'text', false, 'Specific column to watch')]),

            // ═══════════════════════════════════════
            // SALESFORCE (5 modules)
            // ═══════════════════════════════════════
            m('salesforce:ActionCreateRecord', 'Create a Record', 'Salesforce', 'action',
                'Creates a new record (Lead, Contact, Account, Opportunity, etc.) in Salesforce.',
                [p('objectType', 'select', true, 'Object type', { options: ['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Task', 'Custom'] }), p('fields', 'object', true, 'Field values')]),
            m('salesforce:ActionUpdateRecord', 'Update a Record', 'Salesforce', 'action',
                'Updates an existing Salesforce record.',
                [p('objectType', 'select', true, 'Object type', { options: ['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Task', 'Custom'] }), p('recordId', 'text', true, 'Record ID'), p('fields', 'object', true, 'Updated fields')]),
            m('salesforce:TriggerWatchRecords', 'Watch Records', 'Salesforce', 'trigger',
                'Trigger when records are created or updated in Salesforce.',
                [p('objectType', 'text', true, 'Object type'), p('triggerType', 'select', false, 'Trigger on', { options: ['created', 'updated', 'both'] })]),
            m('salesforce:SearchRecords', 'Search Records (SOQL)', 'Salesforce', 'search',
                'Search Salesforce records using SOQL queries.',
                [p('query', 'text', true, 'SOQL query')]),
            m('salesforce:ActionMakeAPICall', 'Make an API Call', 'Salesforce', 'action',
                'Make a custom Salesforce REST API call.',
                [p('method', 'select', true, 'HTTP method', { options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }), p('url', 'text', true, 'API endpoint path'), p('body', 'text', false, 'Request body')]),

            // ═══════════════════════════════════════
            // STRIPE (5 modules)
            // ═══════════════════════════════════════
            m('stripe:TriggerWatchEvents', 'Watch Events', 'Stripe', 'trigger',
                'Trigger when new events occur in Stripe (payment_intent.succeeded, invoice.paid, customer.created, etc.).',
                [p('eventTypes', 'array', false, 'Filter by event types')]),
            m('stripe:ActionCreateCustomer', 'Create a Customer', 'Stripe', 'action',
                'Creates a new customer in Stripe.',
                [p('email', 'email', true, 'Customer email'), p('name', 'text', false, 'Customer name'), p('description', 'text', false, 'Description'), p('metadata', 'object', false, 'Custom metadata')]),
            m('stripe:ActionCreatePaymentIntent', 'Create a Payment Intent', 'Stripe', 'action',
                'Creates a payment intent for processing a payment.',
                [p('amount', 'number', true, 'Amount in cents'), p('currency', 'text', true, 'Currency code (usd, eur, etc.)'), p('customerId', 'text', false, 'Customer ID'), p('description', 'text', false, 'Payment description')]),
            m('stripe:ActionCreateInvoice', 'Create an Invoice', 'Stripe', 'action',
                'Creates a draft invoice for a Stripe customer.',
                [p('customerId', 'text', true, 'Customer ID'), p('description', 'text', false, 'Invoice description'), p('autoAdvance', 'boolean', false, 'Auto-finalize the invoice')]),
            m('stripe:SearchCharges', 'Search Charges', 'Stripe', 'search',
                'Search for charges/payments in Stripe.',
                [p('customerId', 'text', false, 'Filter by customer'), p('created', 'object', false, 'Date range filter'), p('limit', 'number', false, 'Max results')]),

            // ═══════════════════════════════════════
            // SHOPIFY (6 modules)
            // ═══════════════════════════════════════
            m('shopify:TriggerWatchOrders', 'Watch Orders', 'Shopify', 'trigger',
                'Trigger when a new order is placed in your Shopify store.',
                [p('status', 'select', false, 'Order status filter', { options: ['any', 'open', 'closed', 'cancelled'] })]),
            m('shopify:TriggerWatchProducts', 'Watch Products', 'Shopify', 'trigger',
                'Trigger when a new product is created in Shopify.',
                []),
            m('shopify:ActionCreateProduct', 'Create a Product', 'Shopify', 'action',
                'Creates a new product in your Shopify store.',
                [p('title', 'text', true, 'Product title'), p('description', 'text', false, 'Product description (HTML)'), p('vendor', 'text', false, 'Vendor name'), p('productType', 'text', false, 'Product type'), p('tags', 'text', false, 'Comma-separated tags'), p('variants', 'array', false, 'Product variants with price, SKU, etc.')]),
            m('shopify:ActionUpdateProduct', 'Update a Product', 'Shopify', 'action',
                'Updates an existing product in Shopify.',
                [p('productId', 'text', true, 'Product ID'), p('title', 'text', false, 'Updated title'), p('description', 'text', false, 'Updated description')]),
            m('shopify:ActionCreateOrder', 'Create an Order', 'Shopify', 'action',
                'Creates a new order in Shopify.',
                [p('lineItems', 'array', true, 'Order line items'), p('customer', 'object', false, 'Customer details'), p('shippingAddress', 'object', false, 'Shipping address')]),
            m('shopify:SearchProducts', 'Search Products', 'Shopify', 'search',
                'Search for products in your Shopify store.',
                [p('query', 'text', false, 'Search query'), p('productType', 'text', false, 'Filter by type'), p('vendor', 'text', false, 'Filter by vendor')]),

            // ═══════════════════════════════════════
            // MAILCHIMP (4 modules)
            // ═══════════════════════════════════════
            m('mailchimp:ActionAddMember', 'Add/Update a Subscriber', 'Mailchimp', 'action',
                'Add a subscriber to a Mailchimp audience or update an existing subscriber.',
                [p('listId', 'text', true, 'Audience/list ID'), p('email', 'email', true, 'Subscriber email'), p('status', 'select', true, 'Subscription status', { options: ['subscribed', 'unsubscribed', 'pending', 'cleaned'] }), p('mergeFields', 'object', false, 'Merge fields (FNAME, LNAME, etc.)'), p('tags', 'array', false, 'Tags to add')]),
            m('mailchimp:ActionSendCampaign', 'Send a Campaign', 'Mailchimp', 'action',
                'Send or schedule a Mailchimp email campaign.',
                [p('campaignId', 'text', true, 'Campaign ID')]),
            m('mailchimp:TriggerWatchSubscribers', 'Watch Subscribers', 'Mailchimp', 'trigger',
                'Trigger when a new subscriber is added to a Mailchimp audience.',
                [p('listId', 'text', true, 'Audience/list ID')]),
            m('mailchimp:SearchMembers', 'Search Members', 'Mailchimp', 'search',
                'Search for members in a Mailchimp audience.',
                [p('listId', 'text', true, 'Audience/list ID'), p('query', 'text', false, 'Search query')]),

            // ═══════════════════════════════════════
            // TWILIO (3 modules)
            // ═══════════════════════════════════════
            m('twilio:ActionSendSMS', 'Send an SMS', 'Twilio', 'action',
                'Send an SMS message via Twilio.',
                [p('to', 'text', true, 'Recipient phone number (E.164 format)'), p('from', 'text', true, 'Twilio phone number'), p('body', 'text', true, 'Message body (max 1600 chars)')]),
            m('twilio:ActionMakeCall', 'Make a Phone Call', 'Twilio', 'action',
                'Initiate a phone call via Twilio.',
                [p('to', 'text', true, 'Phone number to call'), p('from', 'text', true, 'Twilio phone number'), p('twiml', 'text', true, 'TwiML instructions or URL')]),
            m('twilio:TriggerWatchSMS', 'Watch SMS', 'Twilio', 'trigger',
                'Trigger when a new SMS message is received.',
                [p('phoneNumber', 'text', true, 'Twilio phone number to watch')]),

            // ═══════════════════════════════════════
            // GOOGLE GEMINI AI (3 modules)
            // ═══════════════════════════════════════
            m('gemini:ActionGenerateContent', 'Generate Content', 'Google Gemini AI', 'action',
                'Generate text content using Google Gemini AI models.',
                [p('model', 'select', true, 'Gemini model', { options: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'] }), p('prompt', 'text', true, 'Input prompt'), p('temperature', 'number', false, 'Temperature (0-2)'), p('maxOutputTokens', 'number', false, 'Max output tokens')]),
            m('gemini:ActionAnalyzeImage', 'Analyze an Image', 'Google Gemini AI', 'action',
                'Analyze images using Gemini multimodal capabilities.',
                [p('model', 'select', true, 'Model', { options: ['gemini-2.0-flash', 'gemini-1.5-pro'] }), p('image', 'buffer', true, 'Image file'), p('prompt', 'text', true, 'Analysis prompt')]),
            m('gemini:ActionGenerateEmbedding', 'Create an Embedding', 'Google Gemini AI', 'action',
                'Create text embeddings using Gemini embedding models.',
                [p('text', 'text', true, 'Text to embed'), p('model', 'select', true, 'Model', { options: ['text-embedding-004'] })]),

            // ═══════════════════════════════════════
            // ANTHROPIC CLAUDE (2 modules)
            // ═══════════════════════════════════════
            m('anthropic:ActionCreateMessage', 'Create a Message', 'Anthropic Claude', 'action',
                'Generate text using Anthropic Claude models. Send messages with system prompts and conversation history.',
                [p('model', 'select', true, 'Claude model', { options: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'] }), p('messages', 'array', true, 'Array of messages with role and content'), p('system', 'text', false, 'System prompt'), p('maxTokens', 'number', true, 'Max tokens in response'), p('temperature', 'number', false, 'Temperature (0-1)')]),
            m('anthropic:ActionAnalyzeImage', 'Analyze Images', 'Anthropic Claude', 'action',
                'Analyze images using Claude vision capabilities.',
                [p('model', 'select', true, 'Model', { options: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'] }), p('image', 'buffer', true, 'Image file or URL'), p('prompt', 'text', true, 'Analysis prompt'), p('maxTokens', 'number', true, 'Max tokens')]),

            // ═══════════════════════════════════════
            // WORDPRESS (4 modules)
            // ═══════════════════════════════════════
            m('wordpress:ActionCreatePost', 'Create a Post', 'WordPress', 'action',
                'Creates a new post or page in WordPress.',
                [p('title', 'text', true, 'Post title'), p('content', 'text', true, 'Post content (HTML)'), p('status', 'select', false, 'Post status', { options: ['draft', 'publish', 'pending', 'private'] }), p('categories', 'array', false, 'Category IDs'), p('tags', 'array', false, 'Tag IDs'), p('featuredImage', 'buffer', false, 'Featured image')]),
            m('wordpress:ActionUpdatePost', 'Update a Post', 'WordPress', 'action',
                'Updates an existing WordPress post.',
                [p('postId', 'number', true, 'Post ID'), p('title', 'text', false, 'Updated title'), p('content', 'text', false, 'Updated content'), p('status', 'select', false, 'Status')]),
            m('wordpress:ActionUploadMedia', 'Upload a Media File', 'WordPress', 'action',
                'Uploads a media file to the WordPress media library.',
                [p('file', 'buffer', true, 'File to upload'), p('filename', 'text', true, 'File name'), p('altText', 'text', false, 'Alt text')]),
            m('wordpress:TriggerWatchPosts', 'Watch Posts', 'WordPress', 'trigger',
                'Trigger when a new post is published in WordPress.',
                [p('status', 'select', false, 'Post status to watch', { options: ['publish', 'draft', 'any'] })]),

            // ═══════════════════════════════════════
            // DROPBOX (4 modules)
            // ═══════════════════════════════════════
            m('dropbox:ActionUploadFile', 'Upload a File', 'Dropbox', 'action',
                'Upload a file to Dropbox.',
                [p('path', 'text', true, 'Destination path (e.g., /folder/file.txt)'), p('data', 'buffer', true, 'File data'), p('mode', 'select', false, 'Write mode', { options: ['add', 'overwrite'] })]),
            m('dropbox:ActionCreateFolder', 'Create a Folder', 'Dropbox', 'action',
                'Creates a new folder in Dropbox.',
                [p('path', 'text', true, 'Folder path')]),
            m('dropbox:ActionDownloadFile', 'Download a File', 'Dropbox', 'action',
                'Downloads a file from Dropbox.',
                [p('path', 'text', true, 'File path in Dropbox')]),
            m('dropbox:TriggerWatchFiles', 'Watch Files', 'Dropbox', 'trigger',
                'Trigger when files are created or modified in a Dropbox folder.',
                [p('path', 'text', true, 'Folder path to watch')]),

            // ═══════════════════════════════════════
            // GITHUB (5 modules)
            // ═══════════════════════════════════════
            m('github:ActionCreateIssue', 'Create an Issue', 'GitHub', 'action',
                'Creates a new issue in a GitHub repository.',
                [p('owner', 'text', true, 'Repository owner'), p('repo', 'text', true, 'Repository name'), p('title', 'text', true, 'Issue title'), p('body', 'text', false, 'Issue description (Markdown)'), p('labels', 'array', false, 'Label names'), p('assignees', 'array', false, 'Assignee usernames')]),
            m('github:ActionCreatePullRequest', 'Create a Pull Request', 'GitHub', 'action',
                'Creates a new pull request in a GitHub repository.',
                [p('owner', 'text', true, 'Repository owner'), p('repo', 'text', true, 'Repository name'), p('title', 'text', true, 'PR title'), p('head', 'text', true, 'Head branch'), p('base', 'text', true, 'Base branch'), p('body', 'text', false, 'PR description')]),
            m('github:ActionAddComment', 'Add a Comment', 'GitHub', 'action',
                'Adds a comment to a GitHub issue or pull request.',
                [p('owner', 'text', true, 'Repository owner'), p('repo', 'text', true, 'Repository name'), p('issueNumber', 'number', true, 'Issue or PR number'), p('body', 'text', true, 'Comment body')]),
            m('github:TriggerWatchEvents', 'Watch Events', 'GitHub', 'trigger',
                'Trigger on GitHub repository events (push, pull_request, issues, etc.).',
                [p('owner', 'text', true, 'Repository owner'), p('repo', 'text', true, 'Repository name'), p('events', 'array', false, 'Event types to watch')]),
            m('github:SearchIssues', 'Search Issues/PRs', 'GitHub', 'search',
                'Search GitHub issues and pull requests.',
                [p('query', 'text', true, 'GitHub search query'), p('sort', 'select', false, 'Sort by', { options: ['created', 'updated', 'comments'] })]),

            // ═══════════════════════════════════════
            // RSS (1 module)
            // ═══════════════════════════════════════
            m('rss:TriggerWatchFeed', 'Watch RSS Feed Items', 'RSS', 'trigger',
                'Trigger when a new item appears in an RSS feed. Great for monitoring blogs, news sites, and content updates.',
                [p('url', 'url', true, 'RSS feed URL'), p('limit', 'number', false, 'Max items per run')]),

            // ═══════════════════════════════════════
            // WHATSAPP BUSINESS (3 modules)
            // ═══════════════════════════════════════
            m('whatsapp:ActionSendMessage', 'Send a Message', 'WhatsApp Business', 'action',
                'Send a WhatsApp message via the WhatsApp Business API.',
                [p('to', 'text', true, 'Recipient phone number'), p('type', 'select', true, 'Message type', { options: ['text', 'template', 'image', 'document'] }), p('text', 'text', false, 'Message text (for text type)'), p('templateName', 'text', false, 'Template name (for template type)')]),
            m('whatsapp:ActionSendTemplate', 'Send a Template Message', 'WhatsApp Business', 'action',
                'Send a pre-approved WhatsApp template message.',
                [p('to', 'text', true, 'Recipient phone number'), p('templateName', 'text', true, 'Template name'), p('languageCode', 'text', true, 'Language code'), p('components', 'array', false, 'Template components/variables')]),
            m('whatsapp:TriggerWatchMessages', 'Watch Messages', 'WhatsApp Business', 'trigger',
                'Trigger when a new WhatsApp message is received.',
                []),

            // ═══════════════════════════════════════
            // FLOW CONTROL & TOOLS (7 modules)
            // ═══════════════════════════════════════
            m('builtin:BasicRouter', 'Router', 'Flow Control', 'action',
                'Split the scenario flow into multiple routes based on conditions (filters). Each route can have its own filter and processes independently.',
                [p('routes', 'array', true, 'Route configurations with filter conditions')],
                '## Router\nSplit your scenario into multiple branches.\n\n### Usage\n- Add filters to each route to control data flow\n- Use for conditional logic (if/else)\n- Unfiltered routes act as "else" (default)'),
            m('builtin:BasicAggregator', 'Array Aggregator', 'Flow Control', 'action',
                'Aggregate multiple bundles into a single array. Collects output from iterators or repeated modules into one bundle.',
                [p('sourceModule', 'select', true, 'Module whose output to aggregate'), p('groupBy', 'text', false, 'Group aggregation by field value')]),
            m('builtin:TextAggregator', 'Text Aggregator', 'Flow Control', 'action',
                'Aggregate multiple bundles into a single text string with a separator.',
                [p('sourceModule', 'select', true, 'Module whose output to aggregate'), p('separator', 'text', false, 'Text separator between items'), p('rowSeparator', 'text', false, 'Row separator')]),
            m('builtin:NumericAggregator', 'Numeric Aggregator', 'Flow Control', 'action',
                'Compute sum, average, count, min, or max across multiple bundles.',
                [p('sourceModule', 'select', true, 'Module to aggregate'), p('function', 'select', true, 'Aggregation function', { options: ['SUM', 'AVG', 'COUNT', 'MIN', 'MAX'] }), p('value', 'text', true, 'Value field to aggregate')]),
            m('builtin:BasicIterator', 'Iterator', 'Flow Control', 'action',
                'Split an array into separate bundles, processing each item individually in subsequent modules.',
                [p('array', 'array', true, 'Array to iterate over')]),
            m('builtin:Repeater', 'Repeater', 'Flow Control', 'action',
                'Repeat subsequent modules a specified number of times. Useful for retry logic or generating sequences.',
                [p('repeats', 'number', true, 'Number of times to repeat'), p('initialValue', 'number', false, 'Starting counter value'), p('step', 'number', false, 'Counter increment')]),
            m('builtin:SetVariable', 'Set Variable', 'Tools', 'action',
                'Set one or more variables that can be referenced in subsequent modules. Variables persist within a single scenario run.',
                [p('variables', 'array', true, 'Variable name-value pairs to set')]),
            m('builtin:SetMultipleVariables', 'Set Multiple Variables', 'Tools', 'action',
                'Set multiple variables at once.',
                [p('variables', 'array', true, 'Array of {name, value} pairs')]),
            m('builtin:GetVariable', 'Get Variable', 'Tools', 'action',
                'Retrieve a variable value that was previously set.',
                [p('name', 'text', true, 'Variable name')]),
            m('builtin:IncrementVariable', 'Increment Value', 'Tools', 'action',
                'Increment a numeric variable by a specified amount.',
                [p('name', 'text', true, 'Variable name'), p('value', 'number', true, 'Amount to increment by')]),
            m('builtin:Sleep', 'Sleep', 'Tools', 'action',
                'Pause scenario execution for a specified duration. Useful for rate limiting or waiting for external processes.',
                [p('delay', 'number', true, 'Delay in seconds (max 300)')]),
            m('builtin:Compose', 'Compose a String', 'Tools', 'action',
                'Create a text string by combining static text with mapped values from previous modules.',
                [p('text', 'text', true, 'Text template with mapped values')]),
            m('builtin:SetError', 'Throw Error', 'Tools', 'action',
                'Deliberately throw an error to stop scenario execution or trigger error handling.',
                [p('message', 'text', true, 'Error message'), p('status', 'number', false, 'Error status code')]),

            // ═══════════════════════════════════════
            // TEXT PARSER (3 modules)
            // ═══════════════════════════════════════
            m('regexp:ActionMatch', 'Match Pattern', 'Text Parser', 'action',
                'Extract data from text using regular expressions. Returns matched groups for data extraction.',
                [p('pattern', 'text', true, 'Regular expression pattern'), p('text', 'text', true, 'Text to search in'), p('globalMatch', 'boolean', false, 'Find all matches (not just first)'), p('caseSensitive', 'boolean', false, 'Case-sensitive matching', { default: true })]),
            m('regexp:ActionReplace', 'Replace', 'Text Parser', 'action',
                'Replace text matching a pattern with new text. Supports regex patterns and capture groups.',
                [p('pattern', 'text', true, 'Search pattern (text or regex)'), p('text', 'text', true, 'Source text'), p('replacement', 'text', true, 'Replacement text'), p('globalReplace', 'boolean', false, 'Replace all occurrences')]),
            m('regexp:ActionHTMLToText', 'HTML to Text', 'Text Parser', 'action',
                'Convert HTML to plain text, stripping all HTML tags.',
                [p('html', 'text', true, 'HTML content to convert')]),

            // ═══════════════════════════════════════
            // DATA STORE (3 modules)
            // ═══════════════════════════════════════
            m('datastore:ActionAddRecord', 'Add/Replace a Record', 'Data Store', 'action',
                'Add a new record to a Make Data Store, or replace an existing one by key.',
                [p('dataStore', 'text', true, 'Data store name/ID'), p('key', 'text', true, 'Record key'), p('data', 'object', true, 'Record data fields')]),
            m('datastore:ActionGetRecord', 'Get a Record', 'Data Store', 'search',
                'Retrieve a record from a Data Store by its key.',
                [p('dataStore', 'text', true, 'Data store name/ID'), p('key', 'text', true, 'Record key')]),
            m('datastore:ActionDeleteRecord', 'Delete a Record', 'Data Store', 'action',
                'Delete a record from a Data Store.',
                [p('dataStore', 'text', true, 'Data store name/ID'), p('key', 'text', true, 'Record key to delete')]),
            m('datastore:SearchRecords', 'Search Records', 'Data Store', 'search',
                'Search for records in a Data Store using filters.',
                [p('dataStore', 'text', true, 'Data store name/ID'), p('filter', 'object', false, 'Filter conditions'), p('limit', 'number', false, 'Max records to return')]),

            // ═══════════════════════════════════════
            // MAKE UTILITIES (3 modules)
            // ═══════════════════════════════════════
            m('email:ActionSendEmail', 'Send an Email', 'Email', 'action',
                'Send an email using Make built-in SMTP (no external service needed). Limited to basic emails.',
                [p('to', 'email', true, 'Recipient email'), p('subject', 'text', true, 'Subject'), p('body', 'text', true, 'Body')]),
            m('csv:ActionParseCSV', 'Parse CSV', 'CSV', 'action',
                'Parse a CSV string or file into structured data bundles.',
                [p('csv', 'text', true, 'CSV content'), p('delimiter', 'text', false, 'Field delimiter', { default: ',' }), p('containsHeaders', 'boolean', false, 'First row is headers', { default: true })]),
            m('csv:ActionCreateCSV', 'Create CSV', 'CSV', 'action',
                'Create a CSV file from structured data.',
                [p('dataStructure', 'select', true, 'Data structure'), p('includeHeaders', 'boolean', false, 'Include header row', { default: true })]),

            // ═══════════════════════════════════════
            // SCHEDULE (1 module)
            // ═══════════════════════════════════════
            m('builtin:Schedule', 'Schedule', 'Schedule', 'trigger',
                'Trigger a scenario on a recurring schedule (every X minutes, hourly, daily, weekly, monthly, or custom cron).',
                [p('interval', 'select', true, 'Run interval', { options: ['every 15 minutes', 'every hour', 'every day', 'every week', 'every month', 'custom'] }), p('cron', 'text', false, 'Custom cron expression (for custom interval)')],
                '## Schedule Trigger\nRun scenarios on a timer.\n\n### Common Intervals\n- Every 15 minutes: Check for new data periodically\n- Daily: Morning reports, daily syncs\n- Weekly: Weekly digests, cleanup tasks'),

            // ═══════════════════════════════════════
            // TIER 1: EXTRACTED FROM BLUEPRINTS (High Usage ≥5)
            // Source: 42 Make.com production blueprints
            // Extraction date: 2026-03-09
            // Total: 3 NEW modules (builtin:BasicRouter already exists)
            // ═══════════════════════════════════════

            // slack:CreateMessage (12 uses) - Real Make.com module ID with accurate parameters
            m('slack:CreateMessage', 'Create a Message', 'Slack', 'action',
                'Post a message to a Slack channel with advanced formatting options including blocks, markdown, and thread support.',
                [
                    p('channelWType', 'select', true, 'Channel entry mode', { options: ['manualy', 'list'] }),
                    p('text', 'text', false, 'Message text content'),
                    p('blocks', 'text', false, 'Message blocks (JSON format for rich formatting)'),
                    p('thread_ts', 'text', false, 'Thread message ID timestamp (for posting replies in thread)'),
                    p('reply_broadcast', 'boolean', false, 'Reply broadcast to channel'),
                    p('link_names', 'boolean', false, 'Link names (find and link @users and #channels)'),
                    p('parse', 'boolean', false, 'Parse message text'),
                    p('mrkdwn', 'boolean', false, 'Use markdown formatting'),
                    p('unfurl_links', 'boolean', false, 'Unfurl primarily text-based content'),
                    p('unfurl_media', 'boolean', false, 'Unfurl media content'),
                    p('icon_emoji', 'text', false, 'Icon emoji (e.g., :robot_face:)'),
                    p('icon_url', 'url', false, 'Icon URL (custom icon image)'),
                    p('username', 'text', false, 'Bot username to display'),
                    p('channelType', 'select', true, 'Channel type', { options: ['public', 'private', 'im', 'mpim'] }),
                    p('channel', 'select', true, 'Channel or user to send message to')
                ]),

            // openai-gpt-3:CreateCompletion (9 uses) - Real OpenAI module ID with full parameter schema
            m('openai-gpt-3:CreateCompletion', 'Create a Completion (Chat)', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
                'Generate AI-powered text completions using OpenAI GPT models. Supports chat and prompt modes with advanced parameters for fine-tuning output.',
                [
                    p('select', 'select', true, 'Method', { options: ['chat', 'prompt'] }),
                    p('max_tokens', 'number', true, 'Maximum tokens to generate in completion'),
                    p('temperature', 'number', false, 'Sampling temperature (0-2). Higher = more random', { min: 0, max: 2 }),
                    p('top_p', 'number', false, 'Nucleus sampling (0-1). Alternative to temperature', { min: 0, max: 1 }),
                    p('n_completions', 'number', false, 'Number of completions to generate'),
                    p('frequency_penalty', 'number', false, 'Frequency penalty (-2 to 2). Penalize repeated tokens', { min: -2, max: 2 }),
                    p('presence_penalty', 'number', false, 'Presence penalty (-2 to 2). Penalize new topics', { min: -2, max: 2 }),
                    p('logit_bias', 'array', false, 'Token probability adjustments'),
                    p('response_format', 'select', false, 'Response format', { options: ['text', 'json_object'] }),
                    p('seed', 'number', false, 'Random seed for deterministic results'),
                    p('stop', 'array', false, 'Stop sequences (up to 4)'),
                    p('additionalParameters', 'array', false, 'Other input parameters'),
                    p('model', 'select', true, 'Model (e.g., gpt-4, gpt-3.5-turbo)'),
                    p('messages', 'array', true, 'Chat messages (for chat method)')
                ]),

            // util:TextAggregator (6 uses) - Utility module for aggregating text from multiple bundles
            m('util:TextAggregator', 'Text Aggregator', 'Tools', 'action',
                'Aggregate text values from multiple bundles into a single concatenated output with optional separator.',
                [
                    p('value', 'text', false, 'Text value to aggregate from each bundle')
                ]),

            // ═══════════════════════════════════════
            // TIER 2: EXTRACTED FROM BLUEPRINTS (Medium Usage 2-4)
            // Source: 42 Make.com production blueprints
            // Extraction date: 2026-03-09
            // Total: 21 modules (excluded 3 duplicates)
            // ═══════════════════════════════════════

// builtin:BasicFeeder (4 uses)
    m('builtin:BasicFeeder', 'Basic Feeder', 'Flow Control', 'action',
      'Performs basic feeder in Flow Control.',
      [
      p('array', 'array', false, 'Array', {"hasSpec":true})
    ]),

    // postgres:InsertIntoTable (4 uses)
    m('postgres:InsertIntoTable', 'Insert Into Table', 'PostgreSQL', 'action',
      'Performs insert into table in PostgreSQL.',
      [
      p('@text1', 'text', false, 'text1'),
      p('@text2', 'text', false, 'text2'),
      p('@text3', 'text', false, 'text3'),
      p('@text4', 'text', false, 'text4'),
      p('@text5', 'text', false, 'text5'),
      p('@text6', 'text', false, 'text6'),
      p('@text7', 'text', false, 'text7'),
      p('@text8', 'text', false, 'text8'),
      p('@text9', 'text', false, 'text9'),
      p('@text10', 'text', false, 'text10'),
      p('@date1', 'date', false, 'date1'),
      p('@date2', 'date', false, 'date2'),
      p('@date3', 'date', false, 'date3')
    ]),

    // salesforce:ActionCreateObject (3 uses)
    m('salesforce:ActionCreateObject', 'Create Object', 'Salesforce', 'action',
      'Performs create object in Salesforce.',
      [
      p('accountId', 'select', false, 'Account (AccountId)'),
      p('assistantName', 'text', false, 'Assistant\'s Name (AssistantName)'),
      p('assistantPhone', 'text', false, 'Asst. Phone (AssistantPhone)'),
      p('birthdate', 'date', false, 'Birthdate (Birthdate)'),
      p('fax', 'text', false, 'Business Fax (Fax)'),
      p('phone', 'text', false, 'Business Phone (Phone)'),
      p('cleanStatus', 'select', false, 'Clean Status (CleanStatus)'),
      p('description', 'text', false, 'Contact Description (Description)'),
      p('jigsaw', 'text', false, 'Data.com Key (Jigsaw)'),
      p('department', 'text', false, 'Department (Department)'),
      p('email', 'email', false, 'Email (Email)'),
      p('emailBouncedDate', 'date', false, 'Email Bounced Date (EmailBouncedDate)'),
      p('emailBouncedReason', 'text', false, 'Email Bounced Reason (EmailBouncedReason)'),
      p('firstName', 'text', false, 'First Name (FirstName)'),
      p('homePhone', 'text', false, 'Home Phone (HomePhone)'),
      p('devintegromat__Interests__c', 'select', false, 'Interests (devintegromat__Interests__c)'),
      p('devintegromat__Languages__c', 'text', false, 'Languages (devintegromat__Languages__c)'),
      p('lastName', 'text', true, 'Last Name (LastName)'),
      p('leadSource', 'select', false, 'Lead Source (LeadSource)'),
      p('devintegromat__Level__c', 'select', false, 'Level (devintegromat__Level__c)'),
      p('mailingCity', 'text', false, 'Mailing City (MailingCity)'),
      p('mailingCountry', 'text', false, 'Mailing Country (MailingCountry)'),
      p('mailingLatitude', 'number', false, 'Mailing Latitude (MailingLatitude)'),
      p('mailingLongitude', 'number', false, 'Mailing Longitude (MailingLongitude)'),
      p('mailingState', 'text', false, 'Mailing State/Province (MailingState)'),
      p('mailingStreet', 'text', false, 'Mailing Street (MailingStreet)'),
      p('mailingPostalCode', 'text', false, 'Mailing Zip/Postal Code (MailingPostalCode)'),
      p('mobilePhone', 'text', false, 'Mobile Phone (MobilePhone)'),
      p('otherCity', 'text', false, 'Other City (OtherCity)'),
      p('otherCountry', 'text', false, 'Other Country (OtherCountry)'),
      p('otherLatitude', 'number', false, 'Other Latitude (OtherLatitude)'),
      p('otherLongitude', 'number', false, 'Other Longitude (OtherLongitude)'),
      p('otherPhone', 'text', false, 'Other Phone (OtherPhone)'),
      p('otherState', 'text', false, 'Other State/Province (OtherState)'),
      p('otherStreet', 'text', false, 'Other Street (OtherStreet)'),
      p('otherPostalCode', 'text', false, 'Other Zip/Postal Code (OtherPostalCode)'),
      p('ownerId', 'select', false, 'Owner (OwnerId)'),
      p('reportsToId', 'select', false, 'Reports To (ReportsToId)'),
      p('salutation', 'select', false, 'Salutation (Salutation)'),
      p('title', 'text', false, 'Title (Title)')
    ]),

    // hubspotcrm:createRecord2020 (3 uses)
    m('hubspotcrm:createRecord2020', 'Create Record2020', 'HubSpot CRM', 'action',
      'Performs create record2020 in HubSpot CRM.',
      [
      p('objectType', 'select', true, 'Record Type', {"options":["contact","company","deal"]}),
      p('propertyGroups', 'select', false, 'Property Groups'),
      p('properties', 'object', true, 'Properties', {"hasSpec":true}),
      p('associations', 'object', false, 'Associations', {"hasSpec":true})
    ]),

    // typeform:WatchEventsWithResponses (3 uses)
    m('typeform:WatchEventsWithResponses', 'Events With Responses', 'Typeform', 'trigger',
      'Triggers when events with responses in Typeform.',
      []),

    // salesforce:createAResponsibleRecord (3 uses)
    m('salesforce:createAResponsibleRecord', 'Create A Responsible Record', 'Salesforce', 'action',
      'Performs create a responsible record in Salesforce.',
      [
      p('sObject', 'select', true, 'Type'),
      p('fields', 'object', false, 'Fields', {"hasSpec":true})
    ]),

    // salesforce:listRecordsInAnObject (3 uses)
    m('salesforce:listRecordsInAnObject', 'List Records In An Object', 'Salesforce', 'action',
      'Performs list records in an object in Salesforce.',
      [
      p('searchType', 'select', true, 'Search By', {"options":["simple","soql"]}),
      p('limit', 'number', false, 'Limit'),
      p('sObject', 'select', true, 'Type'),
      p('filter', 'text', false, 'Filter')
    ]),

    // salesforce:TriggerNewObject (2 uses)
    m('salesforce:TriggerNewObject', 'New Object', 'Salesforce', 'trigger',
      'Triggers when new object in Salesforce.',
      [
      p('watch', 'select', true, 'Watch', {"options":["onlyNew","allChanges"]}),
      p('sObject', 'select', true, 'Type'),
      p('maxResults', 'number', true, 'Maximal count of objects')
    ]),

    // stripe:watchEvents (2 uses)
    m('stripe:watchEvents', 'Events', 'Stripe', 'trigger',
      'Triggers when events in Stripe.',
      []),

    // util:SetVariable2 (2 uses)
    m('util:SetVariable2', 'Set Variable2', 'Tools', 'action',
      'Performs set variable2 in Tools.',
      [
      p('name', 'text', true, 'Variable name'),
      p('scope', 'select', true, 'Variable lifetime', {"options":["roundtrip","execution"]}),
      p('value', 'text', false, 'Variable value')
    ]),

    // wordpress:watchPosts (2 uses)
    m('wordpress:watchPosts', 'Posts', 'WordPress', 'trigger',
      'Triggers when posts in WordPress.',
      [
      p('type', 'select', true, 'Type'),
      p('status', 'select', false, 'Status'),
      p('limit', 'number', false, 'Limit')
    ]),

    // salesforce:ActionSearchObject (2 uses)
    m('salesforce:ActionSearchObject', 'Search Object', 'Salesforce', 'action',
      'Performs search object in Salesforce.',
      [
      p('searchType', 'select', true, 'Search type', {"options":["simple","sosl"]}),
      p('maxResults', 'number', true, 'Maximal count of records'),
      p('sObject', 'select', true, 'Type'),
      p('query', 'text', true, 'Query')
    ]),

    // regexp:Parser (2 uses)
    m('regexp:Parser', 'Parser', 'Text Parser', 'action',
      'Performs parser in Text Parser.',
      [
      p('text', 'text', false, 'Text')
    ]),

    // hubspotcrm:watchContacts (2 uses)
    m('hubspotcrm:watchContacts', 'Contacts', 'HubSpot CRM', 'trigger',
      'Triggers when contacts in HubSpot CRM.',
      [
      p('outputProperties', 'select', false, 'Output Properties'),
      p('limit', 'number', true, 'Limit')
    ]),

    // browse-ai:onTaskFinished (2 uses)
    m('browse-ai:onTaskFinished', 'On Task Finished', 'Browse AI', 'action',
      'Performs on task finished in Browse AI.',
      []),

    // google-sheets:filterRows (2 uses)
    m('google-sheets:filterRows', 'Filter Rows', 'Google Sheets', 'action',
      'Performs filter rows in Google Sheets.',
      [
      p('from', 'select', true, 'Enter a Spreadsheet ID and Sheet Name', {"options":["drive","share"]}),
      p('valueRenderOption', 'select', false, 'Value render option', {"options":["FORMATTED_VALUE","UNFORMATTED_VALUE","FORMULA"]}),
      p('dateTimeRenderOption', 'select', false, 'Date and time render option', {"options":["SERIAL_NUMBER","FORMATTED_STRING"]}),
      p('limit', 'number', false, 'Maximum number of returned rows'),
      p('spreadsheetId', 'select', true, 'Spreadsheet'),
      p('sheetId', 'select', true, 'Sheet Name'),
      p('includesHeaders', 'select', true, 'Table contains headers', {"options":[true,false]}),
      p('tableFirstRow', 'select', true, 'Column range', {"options":["A1:Z1","A1:BZ1","A1:CZ1","A1:DZ1","A1:MZ1","A1:ZZ1","A1:AZZ1","A1:BZZ1","A1:CZZ1","A1:DZZ1","A1:MZZ1","A1:ZZZ1"]}),
      p('filter', 'text', false, 'Filter'),
      p('sortOrder', 'select', false, 'Sort order', {"options":["asc","desc"]}),
      p('orderBy', 'select', false, 'Order by')
    ]),

    // salesforce:watchRecords (2 uses)
    m('salesforce:watchRecords', 'Records', 'Salesforce', 'trigger',
      'Triggers when records in Salesforce.',
      [
      p('select', 'select', true, 'Watch Records', {"options":["create","update"]}),
      p('sObject', 'select', true, 'Type'),
      p('limit', 'number', true, 'Limit')
    ]),

    // google-sheets:addRow (2 uses)
    m('google-sheets:addRow', 'Add Row', 'Google Sheets', 'action',
      'Performs add row in Google Sheets.',
      [
      p('mode', 'select', true, 'Choose a Method', {"options":["select","fromAll","map"]}),
      p('insertUnformatted', 'boolean', true, 'Unformatted'),
      p('valueInputOption', 'select', false, 'Value input option', {"options":["USER_ENTERED","RAW"]}),
      p('insertDataOption', 'select', false, 'Insert data option', {"options":["INSERT_ROWS","OVERWRITE"]}),
      p('from', 'select', true, 'Choose a Drive', {"options":["drive","share","team"]}),
      p('spreadsheetId', 'select', true, 'Spreadsheet ID'),
      p('sheetId', 'select', true, 'Sheet Name'),
      p('includesHeaders', 'select', true, 'Table contains headers', {"options":[true,false]}),
      p('values', 'object', false, 'Values', {"hasSpec":true})
    ]),

    // postgres:Query (2 uses)
    m('postgres:Query', 'Query', 'PostgreSQL', 'action',
      'Performs query in PostgreSQL.',
      [
      p('command', 'text', true, 'Command')
    ]),

    // salesforce:getARecord (2 uses)
    m('salesforce:getARecord', 'Get A Record', 'Salesforce', 'action',
      'Performs get a record in Salesforce.',
      [
      p('sObject', 'select', true, 'Type'),
      p('record', 'text', true, 'Record ID')
    ]),

    // notion:watchDatabaseItems (2 uses)
    m('notion:watchDatabaseItems', 'Database Items', 'Notion', 'trigger',
      'Triggers when database items in Notion.',
      [
      p('select', 'select', true, 'Watch Database Items', {"options":["create","update"]}),
      p('database', 'text', true, 'Database ID'),
      p('limit', 'number', true, 'Limit')
    ]),


            // ═══════════════════════════════════════
            // TIER 3: EXTRACTED FROM BLUEPRINTS (Specialty, 1 use)
            // Source: 42 Make.com production blueprints
            // Extraction date: 2026-03-09
            // Total: 67 modules
            // ═══════════════════════════════════════

// quickbooks:CreateCustomer (1 uses)
    m('quickbooks:CreateCustomer', 'Create Customer', 'QuickBooks', 'action',
      'Performs create customer in QuickBooks.',
      [
      p('DisplayName', 'text', false, 'Display name'),
      p('GivenName', 'text', false, 'Given name'),
      p('MiddleName', 'text', false, 'Middle name'),
      p('FamilyName', 'text', false, 'Family name'),
      p('Title', 'text', false, 'Title'),
      p('Suffix', 'text', false, 'Suffix'),
      p('CompanyName', 'text', false, 'Company name'),
      p('PrimaryEmailAddr', 'email', false, 'Email'),
      p('BillAddr', 'object', false, 'Billing address', {"hasSpec":true}),
      p('ShipAddr', 'object', false, 'Shipping address', {"hasSpec":true}),
      p('WebAddr', 'url', false, 'Web'),
      p('PrimaryPhone', 'text', false, 'Phone'),
      p('AlternatePhone', 'text', false, 'Alternate phone'),
      p('Mobile', 'text', false, 'Mobile'),
      p('Fax', 'text', false, 'Fax'),
      p('Notes', 'text', false, 'Note'),
      p('CurrencyRef', 'text', false, 'Currency'),
      p('ParentRef', 'select', false, 'Parent'),
      p('Job', 'boolean', false, 'Job'),
      p('BillWithParent', 'boolean', false, 'Bill with parent'),
      p('ResaleNum', 'text', false, 'Resale number'),
      p('PrintOnCheckName', 'text', false, 'Print on check name'),
      p('Balance', 'number', false, 'Balance'),
      p('BalanceWithJobs', 'number', false, 'Balance with jobs'),
      p('PaymentMethodRef', 'select', false, 'Payment method'),
      p('SalesTermRef', 'select', false, 'Sales terms'),
      p('PreferredDeliveryMethod', 'select', false, 'Preferred delivery method', {"options":["Print","Email"]}),
      p('DefaultTaxCodeRef', 'select', false, 'Default tax code')
    ]),

    // wordpress:watchUsers (1 uses)
    m('wordpress:watchUsers', 'Users', 'WordPress', 'trigger',
      'Triggers when users in WordPress.',
      [
      p('limit', 'number', true, 'Limit')
    ]),

    // calendly:watchInvitees (1 uses)
    m('calendly:watchInvitees', 'Invitees', 'Calendly', 'trigger',
      'Triggers when invitees in Calendly.',
      []),

    // shopify:WatchOrders (1 uses)
    m('shopify:WatchOrders', 'Orders', 'Shopify', 'trigger',
      'Triggers when orders in Shopify.',
      [
      p('status', 'select', false, 'Status', {"options":["open","closed","cancelled","any"]}),
      p('financial_status', 'select', false, 'Financial status', {"options":["authorized","pending","paid","partially_paid","refunded","partially_refunded","voided","unpaid","any"]}),
      p('fulfillment_status', 'select', false, 'Fulfillment status', {"options":["shipped","partial","unshipped","unfulfilled","any"]}),
      p('limit', 'number', true, 'Limit'),
      p('fields', 'select', false, 'Fields', {"options":["app_id","billing_address","browser_ip","buyer_accepts_marketing","cancel_reason","cancelled_at","cart_token","checkout_id","checkout_token","closed_at","confirmed","contact_email","created_at","currency","current_total_duties_set","customer","customer_locale","device_id","discount_applications","discount_codes","email","financial_status","fulfillment_status","fulfillments","gateway","id","landing_site","landing_site_ref","line_items","location_id","name","note","note_attributes","number","order_number","order_status_url","original_total_duties_set","payment_gateway_names","phone","presentment_currency","processed_at","processing_method","reference","referring_site","refunds","shipping_address","shipping_lines","source_identifier","source_name","source_url","subtotal_price","subtotal_price_set","tags","tax_lines","taxes_included","test","token","total_discounts","total_discounts_set","total_line_items_price","total_line_items_price_set","total_price","total_price_set","total_price_usd","total_shipping_price_set","total_tax","total_tax_set","total_tip_received","total_weight","updated_at","user_id"]})
    ]),

    // microsoft-excel:addAWorksheetRow (1 uses)
    m('microsoft-excel:addAWorksheetRow', 'Add A Worksheet Row', 'Microsoft Excel', 'action',
      'Performs add a worksheet row in Microsoft Excel.',
      [
      p('workbook', 'select', true, 'Workbook'),
      p('worksheet', 'select', true, 'Worksheet'),
      p('valueType', 'select', true, 'Type of Values Being Entered', {"options":["formulas","formulasLocal","values"]}),
      p('row', 'object', false, 'Row', {"hasSpec":true})
    ]),

    // microsoft-excel:retrieveAData (1 uses)
    m('microsoft-excel:retrieveAData', 'Retrieve A Data', 'Microsoft Excel', 'action',
      'Performs retrieve a data in Microsoft Excel.',
      [
      p('workbook', 'select', true, 'Workbook'),
      p('range', 'text', true, 'Range'),
      p('worksheet', 'select', true, 'Worksheet')
    ]),

    // stripe:retrieveCustomer (1 uses)
    m('stripe:retrieveCustomer', 'Retrieve Customer', 'Stripe', 'action',
      'Performs retrieve customer in Stripe.',
      [
      p('customer', 'select', true, 'Customer ID')
    ]),

    // hubspotcrm:createUpdateContact2020 (1 uses)
    m('hubspotcrm:createUpdateContact2020', 'Create Update Contact2020', 'HubSpot CRM', 'action',
      'Performs create update contact2020 in HubSpot CRM.',
      [
      p('propertyGroups', 'select', true, 'Property Groups'),
      p('properties', 'object', true, 'Properties', {"hasSpec":true})
    ]),

    // linkedin-lead-gen-forms:watchFormResponse (1 uses)
    m('linkedin-lead-gen-forms:watchFormResponse', 'Form Response', 'LinkedIn Lead Gen Forms', 'trigger',
      'Triggers when form response in LinkedIn Lead Gen Forms.',
      []),

    // linkedin-lead-gen-forms:GetFormResponse (1 uses)
    m('linkedin-lead-gen-forms:GetFormResponse', 'Get Form Response', 'LinkedIn Lead Gen Forms', 'search',
      'Searches for get form response in LinkedIn Lead Gen Forms.',
      [
      p('account', 'select', true, 'Ad Account URN'),
      p('id', 'text', true, 'Response ID or URN')
    ]),

    // linkedin-lead-gen-forms:GetForm (1 uses)
    m('linkedin-lead-gen-forms:GetForm', 'Get Form', 'LinkedIn Lead Gen Forms', 'search',
      'Searches for get form in LinkedIn Lead Gen Forms.',
      [
      p('id', 'text', true, 'Form ID or URN')
    ]),

    // stripe:createCustomer (1 uses)
    m('stripe:createCustomer', 'Create Customer', 'Stripe', 'action',
      'Performs create customer in Stripe.',
      [
      p('description', 'text', false, 'Description'),
      p('email', 'email', false, 'Email'),
      p('name', 'text', false, 'Name'),
      p('phone', 'text', false, 'Phone'),
      p('address', 'object', false, 'Address', {"hasSpec":true}),
      p('shipping', 'object', false, 'Shipping', {"hasSpec":true}),
      p('payment_method', 'text', false, 'Payment Method ID'),
      p('metadata', 'array', false, 'Metadata', {"hasSpec":true}),
      p('balance', 'number', false, 'Balance'),
      p('coupon', 'select', false, 'Coupon ID'),
      p('invoice_prefix', 'text', false, 'Invoice Prefix', {"min":3,"max":12}),
      p('invoice_settings', 'object', false, 'Invoice Settings', {"hasSpec":true}),
      p('next_invoice_sequence', 'number', false, 'Next Invoice Sequence'),
      p('preferred_locales', 'array', false, 'Preferred Locales', {"hasSpec":true}),
      p('promotion_code', 'select', false, 'Promotion Code ID'),
      p('source', 'text', false, 'Source ID'),
      p('tax_exempt', 'select', false, 'Tax Exempt', {"options":["none","exempt","reverse"]}),
      p('tax_id_data', 'array', false, 'TAX ID Data', {"hasSpec":true})
    ]),

    // stripe:createPaymentIntent (1 uses)
    m('stripe:createPaymentIntent', 'Create Payment Intent', 'Stripe', 'action',
      'Performs create payment intent in Stripe.',
      [
      p('amount', 'number', true, 'Amount', {"max":99999999}),
      p('currency', 'text', true, 'Currency'),
      p('description', 'text', false, 'Description'),
      p('receipt_email', 'email', false, 'Receipt Email'),
      p('confirm', 'boolean', false, 'Confirm this Payment Intent immediately'),
      p('payment_method_types', 'select', false, 'Payment Method Types'),
      p('customer', 'text', false, 'Customer ID'),
      p('ignore::payment_method', 'select', false, 'Payment Method', {"options":["select","create"]}),
      p('shipping', 'object', false, 'Shipping', {"hasSpec":true}),
      p('statement_descriptor', 'text', false, 'Statement Descriptor', {"max":22}),
      p('statement_descriptor_suffix', 'text', false, 'Statement Descriptor Suffix', {"max":22}),
      p('idempotency_key', 'text', false, 'Idempotency Key'),
      p('capture_method', 'select', false, 'Capture Method', {"options":["automatic","manual"]}),
      p('confirmation_method', 'select', false, 'Confirmation Method', {"options":["automatic","manual"]}),
      p('transfer_group', 'text', false, 'Transfer Group'),
      p('application_fee_amount', 'number', false, 'Application Fee Amount'),
      p('on_behalf_of', 'select', false, 'On Behalf Of'),
      p('transfer_data', 'object', false, 'Transfer Data', {"hasSpec":true}),
      p('metadata', 'array', false, 'Metadata', {"hasSpec":true})
    ]),

    // stripe:createInvoiceItem (1 uses)
    m('stripe:createInvoiceItem', 'Create Invoice Item', 'Stripe', 'action',
      'Performs create invoice item in Stripe.',
      [
      p('customer', 'text', true, 'Customer ID'),
      p('input_amount', 'select', true, 'Input an Amount', {"options":["total","unit_amount","price"]}),
      p('description', 'text', false, 'Description'),
      p('period', 'object', false, 'Period', {"hasSpec":true}),
      p('metadata', 'array', false, 'Metadata', {"hasSpec":true}),
      p('discountable', 'boolean', false, 'Discountable'),
      p('invoice', 'text', false, 'Invoice ID'),
      p('subscription', 'text', false, 'Subscription ID'),
      p('tax_rates', 'array', false, 'Tax Rates', {"hasSpec":true}),
      p('amount', 'number', true, 'Amount'),
      p('currency', 'text', false, 'Currency')
    ]),

    // stripe:createInvoice (1 uses)
    m('stripe:createInvoice', 'Create Invoice', 'Stripe', 'action',
      'Performs create invoice in Stripe.',
      [
      p('customer', 'text', true, 'Customer ID'),
      p('auto_advance', 'boolean', true, 'Auto Advance'),
      p('collection_method', 'select', true, 'Collection Method', {"options":["charge_automatically","send_invoice"]}),
      p('description', 'text', false, 'Description'),
      p('subscription', 'text', false, 'Subscription ID'),
      p('metadata', 'array', false, 'Metadata', {"hasSpec":true}),
      p('application_fee_amount', 'number', false, 'Application Fee Amount'),
      p('custom_fields', 'array', false, 'Custom Fields', {"hasSpec":true}),
      p('default_payment_method', 'text', false, 'Default Payment Method ID'),
      p('default_source', 'text', false, 'Default Payment Source ID'),
      p('default_tax_rates', 'text', false, 'Default Tax Rates ID'),
      p('discounts', 'array', false, 'Discounts', {"hasSpec":true}),
      p('footer', 'text', false, 'Footer'),
      p('statement_descriptor', 'text', false, 'Statement Descriptor'),
      p('transfer_data', 'object', false, 'Transfer Data', {"hasSpec":true}),
      p('days_until_due', 'number', false, 'Days Until Due'),
      p('due_date', 'date', false, 'Due Date')
    ]),

    // stripe:finalizeInvoice (1 uses)
    m('stripe:finalizeInvoice', 'Finalize Invoice', 'Stripe', 'action',
      'Performs finalize invoice in Stripe.',
      [
      p('invoice', 'text', true, 'Invoice ID')
    ]),

    // http:ActionGetFile (1 uses)
    m('http:ActionGetFile', 'Get File', 'HTTP', 'action',
      'Performs get file in HTTP.',
      [
      p('url', 'url', true, 'URL'),
      p('serializeUrl', 'boolean', true, 'Serialize URL'),
      p('method', 'text', false, 'Method'),
      p('shareCookies', 'boolean', true, 'Share cookies with other HTTP modules')
    ]),

    // google-email:ActionSendEmail (1 uses)
    m('google-email:ActionSendEmail', 'Send Email', 'Gmail', 'action',
      'Performs send email in Gmail.',
      [
      p('from', 'text', false, 'From'),
      p('to', 'array', true, 'To', {"hasSpec":true}),
      p('subject', 'text', false, 'Subject'),
      p('html', 'text', false, 'Content'),
      p('attachments', 'array', false, 'Attachments', {"hasSpec":true}),
      p('cc', 'array', false, 'Copy recipient', {"hasSpec":true}),
      p('bcc', 'array', false, 'Blind copy recipient', {"hasSpec":true})
    ]),

    // microsoft-excel:watchWorksheetRows (1 uses)
    m('microsoft-excel:watchWorksheetRows', 'Worksheet Rows', 'Microsoft Excel', 'trigger',
      'Triggers when worksheet rows in Microsoft Excel.',
      [
      p('workbook', 'select', true, 'Workbook'),
      p('limit', 'number', true, 'Limit'),
      p('worksheet', 'select', true, 'Worksheet')
    ]),

    // clickup:createTaskInList (1 uses)
    m('clickup:createTaskInList', 'Create Task In List', 'ClickUp', 'action',
      'Performs create task in list in ClickUp.',
      [
      p('team_id', 'select', true, 'Workspace'),
      p('space_id', 'select', true, 'Space'),
      p('folder_id', 'select', true, 'Folder'),
      p('list_id', 'select', true, 'List'),
      p('parent_task_id', 'select', false, 'Parent Task ID'),
      p('name', 'text', true, 'Task Name'),
      p('contentType', 'select', false, 'Content Type', {"options":["markdown"]}),
      p('content', 'text', false, 'Content'),
      p('assignees', 'select', false, 'Assignees'),
      p('tags', 'select', false, 'Tags'),
      p('status', 'select', false, 'Status'),
      p('priority', 'select', false, 'Priority', {"options":["urgent","high","normal","low"]}),
      p('due_date', 'date', false, 'Due Date'),
      p('due_date_time', 'boolean', true, 'Due Date Time'),
      p('time_estimate_in', 'select', false, 'Estimated Time in', {"options":["m","h","d"]}),
      p('start_date', 'date', false, 'Start Date'),
      p('start_date_time', 'boolean', true, 'Start Date Time'),
      p('notify_all', 'boolean', true, 'Notify All'),
      p('custom_fields', 'object', false, 'Custom Fields', {"hasSpec":true})
    ]),

    // slack:NewEvent (1 uses)
    m('slack:NewEvent', 'New Event', 'Slack', 'action',
      'Performs new event in Slack.',
      []),

    // google-sheets:watchRows (1 uses)
    m('google-sheets:watchRows', 'Rows', 'Google Sheets', 'trigger',
      'Triggers when rows in Google Sheets.',
      [
      p('mode', 'select', true, 'Search Method', {"options":["select","fromAll","map"]}),
      p('includesHeaders', 'select', true, 'Table contains headers', {"options":[true,false]}),
      p('limit', 'number', true, 'Limit'),
      p('valueRenderOption', 'select', false, 'Value render option', {"options":["FORMATTED_VALUE","UNFORMATTED_VALUE","FORMULA"]}),
      p('dateTimeRenderOption', 'select', false, 'Date and time render option', {"options":["SERIAL_NUMBER","FORMATTED_STRING"]}),
      p('spreadsheetId', 'text', true, 'Spreadsheet ID'),
      p('sheetId', 'select', true, 'Sheet Name'),
      p('tableFirstRow', 'text', true, 'Row with headers')
    ]),

    // canva:createADesign (1 uses)
    m('canva:createADesign', 'Create A Design', 'Canva', 'action',
      'Performs create a design in Canva.',
      [
      p('folderId', 'select', false, 'Folder ID'),
      p('title', 'text', false, 'Title', {"max":256}),
      p('designType', 'object', true, 'Design Type', {"hasSpec":true}),
      p('assetId', 'select', false, 'Asset ID')
    ]),

    // canva:exportDesign (1 uses)
    m('canva:exportDesign', 'Export Design', 'Canva', 'action',
      'Performs export design in Canva.',
      [
      p('folderId', 'select', true, 'Folder ID'),
      p('format', 'object', true, 'Export Format', {"hasSpec":true}),
      p('design_id', 'select', true, 'Design ID')
    ]),

    // google-drive:uploadAFile (1 uses)
    m('google-drive:uploadAFile', 'Upload A File', 'Google Drive', 'action',
      'Performs upload a file in Google Drive.',
      [
      p('undefined', 'text', false, ''),
      p('select', 'select', true, 'Enter a Folder ID', {"options":["map","value"]}),
      p('title', 'text', false, 'New File Name'),
      p('filename', 'text', true, 'File Name'),
      p('data', 'buffer', true, 'Data'),
      p('convert', 'boolean', true, 'Convert a File'),
      p('destination', 'select', true, 'New Drive Location', {"options":["drive","share","team"]}),
      p('folderId', 'select', true, 'New Folder Location')
    ]),

    // google-sheets:updateRow (1 uses)
    m('google-sheets:updateRow', 'Update Row', 'Google Sheets', 'action',
      'Performs update row in Google Sheets.',
      [
      p('mode', 'select', true, 'Choose a Method', {"options":["select","fromAll","map"]}),
      p('valueInputOption', 'select', false, 'Value input option', {"options":["USER_ENTERED","RAW"]}),
      p('spreadsheetId', 'text', true, 'Spreadsheet'),
      p('sheetId', 'text', true, 'Sheet Name'),
      p('rowNumber', 'number', true, 'Row number'),
      p('tableFirstRow', 'select', true, 'Column range', {"options":["A1:Z1","A1:BZ1","A1:CZ1","A1:DZ1","A1:MZ1","A1:ZZ1"]}),
      p('values', 'object', false, 'Values', {"hasSpec":true})
    ]),

    // clearbit:findPersonOrCompany (1 uses)
    m('clearbit:findPersonOrCompany', 'Find Person Or Company', 'Clearbit', 'action',
      'Performs find person or company in Clearbit.',
      [
      p('email', 'email', true, 'Email address'),
      p('given_name', 'text', false, 'Given Name'),
      p('family_name', 'text', false, 'Family Name'),
      p('ip_address', 'text', false, 'IP Address'),
      p('location', 'text', false, 'Location'),
      p('company', 'text', false, 'Company'),
      p('company_domain', 'text', false, 'Company Domain'),
      p('linkedin', 'text', false, 'Linkedin'),
      p('twitter', 'text', false, 'Twitter'),
      p('facebook', 'text', false, 'Facebook'),
      p('suppression', 'select', false, 'Exclude EU related data ?', {"options":["eu","eu_strict"]}),
      p('subscribe', 'boolean', false, 'Subscribe to changes for this person ?')
    ]),

    // salesloft:createARecord (1 uses)
    m('salesloft:createARecord', 'Create A Record', 'Salesloft', 'action',
      'Performs create a record in Salesloft.',
      [
      p('rType', 'select', true, 'Record Type', {"options":["accounts","activities","cadences","cadence_memberships","activities/calls","conversations/calls","custom_fields","imports","third_party_live_feed_items","live_website_tracking_parameters","notes","people","person_stages","saved_list_views","tasks"]}),
      p('first_name', 'text', false, 'First Name'),
      p('last_name', 'text', false, 'Last Name'),
      p('email_address', 'email', false, 'Email Address'),
      p('title', 'text', false, 'Job Title'),
      p('job_seniority', 'select', false, 'Job Seniority', {"options":["director","executive","individual_contributor","manager","vice_president","unknown"]}),
      p('phone', 'text', false, 'Office Phone'),
      p('phone_extension', 'text', false, 'Office Phone Extension'),
      p('mobile_phone', 'text', false, 'Mobile Phone'),
      p('home_phone', 'text', false, 'Home Phone'),
      p('person_stage_id', 'select', false, 'Person Stage ID'),
      p('account_id', 'number', false, 'Account ID'),
      p('owner_id', 'number', false, 'Owner ID'),
      p('tags', 'array', false, 'Tags', {"hasSpec":true}),
      p('do_not_contact', 'boolean', false, 'Do Not Contact'),
      p('contact_restrictions', 'select', false, 'Contact Restrictions', {"options":["call","email","message"]}),
      p('city', 'text', false, 'City'),
      p('state', 'text', false, 'State'),
      p('country', 'text', false, 'Country'),
      p('locale', 'select', false, 'Time Zone Locale'),
      p('personal_website', 'text', false, 'Personal Website'),
      p('linkedin_url', 'text', false, 'Linkedin URL'),
      p('twitter_handle', 'text', false, 'Twitter Handle'),
      p('custom_fields', 'object', false, 'Account Custom Fields', {"hasSpec":true}),
      p('secondary_email_address', 'email', false, 'Secondary Email Address'),
      p('personal_email_address', 'email', false, 'Personal Email Address'),
      p('person_company_name', 'text', false, 'Company Name'),
      p('person_company_website', 'text', false, 'Company Website'),
      p('person_company_industry', 'text', false, 'Company Industry'),
      p('work_city', 'text', false, 'Work City'),
      p('work_state', 'text', false, 'Work State'),
      p('work_country', 'text', false, 'Work Country'),
      p('import_id', 'select', false, 'Import ID'),
      p('autotag_date', 'boolean', false, 'Autotag Date'),
      p('crm_id_type', 'text', false, 'External CRM ID Type'),
      p('crm_id', 'text', false, 'External CRM Person ID')
    ]),

    // stripe:searchCustomers (1 uses)
    m('stripe:searchCustomers', 'Search Customers', 'Stripe', 'action',
      'Performs search customers in Stripe.',
      [
      p('email', 'email', false, 'Email'),
      p('filter', 'text', false, 'Filter'),
      p('limit', 'number', false, 'Limit')
    ]),

    // youtube:pollingVideos (1 uses)
    m('youtube:pollingVideos', 'Polling Videos', 'YouTube', 'action',
      'Performs polling videos in YouTube.',
      [
      p('undefined', 'text', false, ''),
      p('channelId', 'text', true, 'Channel ID'),
      p('publishedBefore', 'date', false, 'Published Before'),
      p('publishedAfter', 'date', false, 'Published After'),
      p('limit', 'number', true, 'Limit')
    ]),

    // apify:runActor (1 uses)
    m('apify:runActor', 'Run Actor', 'Apify', 'action',
      'Performs run actor in Apify.',
      [
      p('actorId', 'select', true, 'Actor'),
      p('runSync', 'boolean', true, 'Run synchronously'),
      p('inputBody', 'text', false, 'Input JSON'),
      p('build', 'text', false, 'Build'),
      p('timeout', 'number', false, 'Timeout'),
      p('memory', 'select', false, 'Memory', {"options":[128,256,512,1024,2048,4096,8192,16384,32768]})
    ]),

    // util:FunctionSleep (1 uses)
    m('util:FunctionSleep', 'Function Sleep', 'Tools', 'action',
      'Performs function sleep in Tools.',
      [
      p('duration', 'number', true, 'Delay', {"min":1,"max":300})
    ]),

    // apify:fetchDatasetItems (1 uses)
    m('apify:fetchDatasetItems', 'Fetch Dataset Items', 'Apify', 'action',
      'Performs fetch dataset items in Apify.',
      [
      p('datasetId', 'text', true, 'Dataset ID'),
      p('type', 'select', true, 'Data transformation', {"options":["clean","simplified","none"]}),
      p('format', 'select', true, 'Format', {"options":["json","csv","html","xml","rss","xlsx"]}),
      p('limit', 'number', false, 'Limit', {"min":1,"max":100000}),
      p('offset', 'number', false, 'Offset', {"min":0})
    ]),

    // email:ActionSendEmail (1 uses)
    m('email:ActionSendEmail', 'Send Email', 'Email', 'action',
      'Performs send email in Email.',
      [
      p('to', 'array', true, 'To', {"hasSpec":true}),
      p('subject', 'text', false, 'Subject'),
      p('contentType', 'select', true, 'Content Type', {"options":["html","text"]}),
      p('attachments', 'array', false, 'Attachments', {"hasSpec":true}),
      p('cc', 'array', false, 'Copy recipient', {"hasSpec":true}),
      p('bcc', 'array', false, 'Blind copy recipient', {"hasSpec":true}),
      p('from', 'text', false, 'From'),
      p('sender', 'text', false, 'Sender'),
      p('replyTo', 'text', false, 'Reply-To'),
      p('inReplyTo', 'text', false, 'In-Reply-To'),
      p('references', 'array', false, 'References', {"hasSpec":true}),
      p('priority', 'select', false, 'Priority', {"options":["high","normal","low"]}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('text', 'text', false, 'Content')
    ]),

    // gong:TriggerWatchNewCall (1 uses)
    m('gong:TriggerWatchNewCall', 'Watch New Call', 'Gong', 'trigger',
      'Triggers when watch new call in Gong.',
      [
      p('limit', 'number', false, 'Limit')
    ]),

    // gong:MakeAPICall (1 uses)
    m('gong:MakeAPICall', 'Make A P I Call', 'Gong', 'action',
      'Performs make a p i call in Gong.',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method', {"options":["GET","POST","PUT","PATCH","DELETE"]}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('qs', 'array', false, 'Query String', {"hasSpec":true}),
      p('body', 'text', false, 'Body')
    ]),

    // google-cloud-firestore:createDocument (1 uses)
    m('google-cloud-firestore:createDocument', 'Create Document', 'Google Cloud Firestore', 'action',
      'Performs create document in Google Cloud Firestore.',
      []),

    // facebook-insights:GetAdAccountInsights (1 uses)
    m('facebook-insights:GetAdAccountInsights', 'Get Ad Account Insights', 'Facebook Insights', 'search',
      'Searches for get ad account insights in Facebook Insights.',
      [
      p('type', 'select', true, 'Get Insights for', {"options":["campaign","adAccount","adSet","ad"]}),
      p('specify_date', 'select', false, 'Specify Date by', {"options":["date_preset","time_range","time_ranges"]}),
      p('fields', 'select', true, 'Fields'),
      p('breakdowns', 'select', false, 'Breakdowns'),
      p('limit', 'number', true, 'Limit'),
      p('level', 'select', false, 'Level', {"options":["ad","adset","account","campaign"]}),
      p('product_id_limit', 'text', false, 'Product ID Limit'),
      p('use_account_attribution_setting', 'boolean', false, 'Use Account Attribution Setting'),
      p('action_attribution_windows', 'select', false, 'Action Attribution Windows', {"options":["1d_view","7d_view","28d_view","1d_click","7d_click","28d_click","default"]}),
      p('action_breakdowns', 'select', false, 'Action Breakdowns', {"options":["action_device","action_canvas_component_name","action_carousel_card_id","action_carousel_card_name","action_destination","action_reaction","action_target_id","action_type","action_video_sound","action_video_type"]}),
      p('action_report_time', 'select', false, 'Action Report Time', {"options":["impression","conversion"]}),
      p('filtering', 'array', false, 'Filter', {"hasSpec":true}),
      p('sort', 'array', false, 'Sort', {"hasSpec":true}),
      p('business', 'select', true, 'Business Manager'),
      p('adAccount', 'select', true, 'Ad Account'),
      p('campaign', 'select', true, 'Campaign'),
      p('date_preset', 'select', false, 'Date Preset', {"options":["today","yesterday","this_week_sun_today","this_week_mon_today","last_week_sun_sat","last_week_mon_sun","this_month","last_month","this_quarter","last_3d","last_7d","last_14d","last_28d","last_30d","last_90d","this_year","last_year","lifetime"]}),
      p('time_increment', 'text', false, 'Time Increment')
    ]),

    // google-drive:searchForFilesFolders (1 uses)
    m('google-drive:searchForFilesFolders', 'Search For Files Folders', 'Google Drive', 'action',
      'Performs search for files folders in Google Drive.',
      [
      p('select', 'select', true, 'Select the Method', {"options":["map","list"]}),
      p('retrieve', 'select', true, 'Retrieve', {"options":["file","folder","file_folder"]}),
      p('searchType', 'select', false, 'Search', {"options":["title","fulltext","custom"]}),
      p('limit', 'number', false, 'Limit'),
      p('destination', 'select', true, 'Choose a Drive', {"options":["drive","share","team"]}),
      p('folderId', 'select', false, 'Choose a Folder')
    ]),

    // airtable:TriggerWatchRecords (1 uses)
    m('airtable:TriggerWatchRecords', 'Watch Records', 'Airtable', 'trigger',
      'Triggers when watch records in Airtable.',
      [
      p('base', 'select', true, 'Base'),
      p('table', 'select', true, 'Table'),
      p('config', 'object', false, 'Trigger configuration', {"hasSpec":true}),
      p('maxRecords', 'number', true, 'Limit'),
      p('view', 'select', false, 'View'),
      p('formula', 'text', false, 'Formula')
    ]),

    // buffer:ActionCreateStatus (1 uses)
    m('buffer:ActionCreateStatus', 'Create Status', 'Buffer', 'action',
      'Performs create status in Buffer.',
      [
      p('text', 'text', true, 'Text'),
      p('type', 'select', true, 'Publication', {"options":["now","top","queue","scheduled"]}),
      p('useMedia', 'boolean', true, 'Attach media to the update'),
      p('shorten', 'boolean', true, 'Shorten links within text'),
      p('attachment', 'boolean', true, 'Attach links in the text as media'),
      p('profileIds', 'select', true, 'Profiles'),
      p('dateScheduled', 'date', true, 'Date scheduled'),
      p('media', 'object', false, 'Media', {"hasSpec":true})
    ]),

    // gateway:WebhookRespond (1 uses)
    m('gateway:WebhookRespond', 'Webhook Respond', 'Webhooks', 'action',
      'Performs webhook respond in Webhooks.',
      [
      p('status', 'number', true, 'Status', {"min":100}),
      p('body', 'text', false, 'Body'),
      p('headers', 'array', false, 'Custom headers', {"hasSpec":true})
    ]),

    // xml:ParseXML (1 uses)
    m('xml:ParseXML', 'Parse X M L', 'XML', 'action',
      'Performs parse x m l in XML.',
      [
      p('xml', 'text', true, 'XML')
    ]),

    // linkedin-offline-conversions:sendConversionEvents (1 uses)
    m('linkedin-offline-conversions:sendConversionEvents', 'Send Conversion Events', 'LinkedIn Offline Conversions', 'action',
      'Performs send conversion events in LinkedIn Offline Conversions.',
      [
      p('account', 'select', true, 'Account URN'),
      p('events', 'array', true, 'Events', {"hasSpec":true})
    ]),

    // util:SetVariables (1 uses)
    m('util:SetVariables', 'Set Variables', 'Tools', 'action',
      'Performs set variables in Tools.',
      [
      p('variables', 'array', false, 'Variables', {"hasSpec":true}),
      p('scope', 'select', true, 'Variable lifetime', {"options":["roundtrip","execution"]})
    ]),

    // google-ads-campaign-management:getAnAccount (1 uses)
    m('google-ads-campaign-management:getAnAccount', 'Get An Account', 'Google Ads', 'action',
      'Performs get an account in Google Ads.',
      [
      p('account', 'select', true, 'Account/Customer ID')
    ]),

    // google-ads-campaign-management:makeApiCall (1 uses)
    m('google-ads-campaign-management:makeApiCall', 'Make Api Call', 'Google Ads', 'action',
      'Performs make api call in Google Ads.',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method', {"options":["GET","POST","PUT","PATCH","DELETE"]}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('qs', 'array', false, 'Query String', {"hasSpec":true}),
      p('body', 'text', false, 'Body')
    ]),

    // http:ActionSendData (1 uses)
    m('http:ActionSendData', 'Send Data', 'HTTP', 'action',
      'Performs send data in HTTP.',
      [
      p('url', 'url', true, 'URL'),
      p('serializeUrl', 'boolean', true, 'Serialize URL'),
      p('method', 'select', true, 'Method', {"options":["get","head","post","put","patch","delete","options"]}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('qs', 'array', false, 'Query String', {"hasSpec":true}),
      p('bodyType', 'select', false, 'Body type', {"options":["raw","x_www_form_urlencoded","multipart_form_data"]}),
      p('parseResponse', 'boolean', true, 'Parse response'),
      p('authUser', 'text', false, 'User name'),
      p('authPass', 'password', false, 'Password'),
      p('timeout', 'number', false, 'Timeout', {"min":1,"max":300}),
      p('shareCookies', 'boolean', true, 'Share cookies with other HTTP modules'),
      p('ca', 'text', false, 'Self-signed certificate'),
      p('rejectUnauthorized', 'boolean', true, 'Reject connections that are using unverified (self-signed) certificates'),
      p('followRedirect', 'boolean', true, 'Follow redirect'),
      p('useQuerystring', 'boolean', true, 'Disable serialization of multiple same query string keys as arrays'),
      p('gzip', 'boolean', true, 'Request compressed content'),
      p('useMtls', 'boolean', true, 'Use Mutual TLS'),
      p('contentType', 'select', false, 'Content type', {"options":["text/plain","application/json","application/xml","text/xml","text/html","custom"]}),
      p('data', 'buffer', false, 'Request content'),
      p('followAllRedirects', 'boolean', true, 'Follow all redirect')
    ]),

    // sendinblue:SendEmail (1 uses)
    m('sendinblue:SendEmail', 'Send Email', 'Sendinblue', 'action',
      'Performs send email in Sendinblue.',
      [
      p('templateId', 'select', false, 'Template'),
      p('to', 'array', true, 'To', {"hasSpec":true}),
      p('subject', 'text', false, 'Subject'),
      p('htmlContent', 'text', false, 'HTML body'),
      p('textContent', 'text', false, 'Text body'),
      p('replyTo', 'object', true, 'Reply To', {"hasSpec":true}),
      p('attachment', 'array', false, 'Attachments', {"hasSpec":true}),
      p('bcc', 'array', false, 'BCC', {"hasSpec":true}),
      p('cc', 'array', false, 'CC', {"hasSpec":true}),
      p('sender', 'object', false, 'Sender', {"hasSpec":true}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('tags', 'array', false, 'Tags', {"hasSpec":true}),
      p('params', 'array', false, 'Params', {"hasSpec":true})
    ]),

    // stripe:listInvoices (1 uses)
    m('stripe:listInvoices', 'List Invoices', 'Stripe', 'action',
      'Performs list invoices in Stripe.',
      [
      p('customer', 'text', false, 'Customer ID'),
      p('subscription', 'text', false, 'Subscription ID'),
      p('status', 'select', false, 'Status', {"options":["draft","open","paid","uncollectible","void"]}),
      p('collection_method', 'select', false, 'Collection Method', {"options":["charge_automatically","send_invoice"]}),
      p('filter', 'text', false, 'Filter'),
      p('limit', 'number', false, 'Limit')
    ]),

    // notion:searchObjects1 (1 uses)
    m('notion:searchObjects1', 'Search Objects1', 'Notion', 'action',
      'Performs search objects1 in Notion.',
      [
      p('select', 'select', true, 'Search Objects', {"options":["item","database","page"]}),
      p('limit', 'number', false, 'Limit'),
      p('database', 'select', true, 'Database ID'),
      p('filter', 'text', false, 'Filter'),
      p('sorts', 'array', false, 'Sorts', {"hasSpec":true})
    ]),

    // slack:SearchUser (1 uses)
    m('slack:SearchUser', 'Search User', 'Slack', 'search',
      'Searches for search user in Slack.',
      [
      p('email', 'email', true, 'Email')
    ]),

    // notion:updateADatabaseItem (1 uses)
    m('notion:updateADatabaseItem', 'Update A Database Item', 'Notion', 'action',
      'Performs update a database item in Notion.',
      [
      p('select', 'select', true, 'Enter a Database ID', {"options":["map","list"]}),
      p('database', 'text', true, 'Database ID'),
      p('page', 'text', true, 'Page ID'),
      p('fields', 'array', false, 'Fields', {"hasSpec":true})
    ]),

    // jira:SearchIssues (1 uses)
    m('jira:SearchIssues', 'Search Issues', 'Jira', 'search',
      'Searches for search issues in Jira.',
      [
      p('jql', 'text', false, 'JQL'),
      p('maxResults', 'number', false, 'Maximum number of returned issues')
    ]),

    // util:FunctionAggregator2 (1 uses)
    m('util:FunctionAggregator2', 'Function Aggregator2', 'Tools', 'action',
      'Performs function aggregator2 in Tools.',
      [
      p('value', 'number', false, 'Value')
    ]),

    // facebook-lead-ads:NewLeadMultiple (1 uses)
    m('facebook-lead-ads:NewLeadMultiple', 'New Lead Multiple', 'Facebook Lead Ads', 'action',
      'Performs new lead multiple in Facebook Lead Ads.',
      []),

    // zoom:watchRecordings (1 uses)
    m('zoom:watchRecordings', 'Recordings', 'Zoom', 'trigger',
      'Triggers when recordings in Zoom.',
      []),

    // zoom:downloadCloudRecording (1 uses)
    m('zoom:downloadCloudRecording', 'Download Cloud Recording', 'Zoom', 'action',
      'Performs download cloud recording in Zoom.',
      [
      p('url', 'url', true, 'Download URL'),
      p('token', 'text', false, 'Download Token'),
      p('fileName', 'text', false, 'File Name')
    ]),

    // openai-gpt-3:CreateTranscription (1 uses)
    m('openai-gpt-3:CreateTranscription', 'Create Transcription', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
      'Performs create transcription in OpenAI (ChatGPT, DALL-E, Whisper).',
      [
      p('fileName', 'filename', true, 'File Name'),
      p('fileData', 'buffer', true, 'File Data'),
      p('model', 'select', true, 'Model', {"options":["whisper-1"]}),
      p('prompt', 'text', false, 'Prompt'),
      p('temperature', 'number', false, 'Temperature', {"min":0,"max":1}),
      p('language', 'text', false, 'Language')
    ]),

    // elevenlabs:createTextToSpeech (1 uses)
    m('elevenlabs:createTextToSpeech', 'Create Text To Speech', 'ElevenLabs', 'action',
      'Performs create text to speech in ElevenLabs.',
      [
      p('voice_id', 'select', true, 'Voice'),
      p('model_id', 'select', true, 'Model'),
      p('text', 'text', true, 'Text'),
      p('voice_settings', 'object', false, 'Voice Settings', {"hasSpec":true}),
      p('optimize_streaming_latency', 'select', false, 'Optimize Streaming Latency', {"options":["0","1","2","3","4"]})
    ]),

    // slack:uploadAFile (1 uses)
    m('slack:uploadAFile', 'Upload A File', 'Slack', 'action',
      'Performs upload a file in Slack.',
      [
      p('channels', 'select', true, 'Channel type', {"options":["public","private","im","mpim"]}),
      p('fileName', 'filename', true, 'File name'),
      p('data', 'buffer', true, 'Data'),
      p('title', 'text', false, 'Title'),
      p('thread_ts', 'text', false, 'Thread ID (timestamp)'),
      p('initial_comment', 'text', false, 'Initial comment'),
      p('channel', 'select', true, 'User')
    ]),

    // postgres:SelectFromTable (1 uses)
    m('postgres:SelectFromTable', 'Select From Table', 'PostgreSQL', 'action',
      'Performs select from table in PostgreSQL.',
      [
      p('where', 'text', false, 'Filter'),
      p('sort', 'array', false, 'Sort', {"hasSpec":true}),
      p('limit', 'number', false, 'Limit')
    ]),

    // google-ads-conversions:uploadACallCoversion (1 uses)
    m('google-ads-conversions:uploadACallCoversion', 'Upload A Call Coversion', 'Google Ads Conversions', 'action',
      'Performs upload a call coversion in Google Ads Conversions.',
      [
      p('select', 'select', true, 'Upload a Call Conversion', {"options":["map","list"]}),
      p('clientId', 'select', true, 'Account/Customer ID'),
      p('conversionAction', 'select', true, 'Conversion Action ID'),
      p('callerId', 'text', true, 'Customer Phone Number'),
      p('callStartDateTime', 'date', true, 'Call Start Date Time'),
      p('conversionDateTime', 'date', true, 'Conversion Date Time'),
      p('conversionValue', 'number', true, 'Conversion Value'),
      p('currencyCode', 'text', true, 'Currency Code'),
      p('customVariables', 'object', false, 'Custom Variables', {"hasSpec":true}),
      p('consent', 'object', false, 'Consent', {"hasSpec":true})
    ]),

    // postgres:DeleteFromTable (1 uses)
    m('postgres:DeleteFromTable', 'Delete From Table', 'PostgreSQL', 'action',
      'Performs delete from table in PostgreSQL.',
      [
      p('where', 'text', false, 'Filter')
    ]),

    // http:MakeRequest (1 uses)
    m('http:MakeRequest', 'Make Request', 'HTTP', 'action',
      'Performs make request in HTTP.',
      [
      p('url', 'url', true, 'URL'),
      p('method', 'select', true, 'Method', {"options":["get","head","post","put","patch","delete","options"]}),
      p('headers', 'array', false, 'Headers', {"hasSpec":true}),
      p('queryParameters', 'array', false, 'Query parameters', {"hasSpec":true}),
      p('contentType', 'select', false, 'Body content type', {"options":["json","multipart","urlEncoded","custom"]}),
      p('parseResponse', 'boolean', true, 'Parse response'),
      p('stopOnHttpError', 'boolean', true, 'Stop scenario if HTTP request fails'),
      p('timeout', 'number', false, 'Timeout', {"min":1,"max":300}),
      p('allowRedirects', 'boolean', true, 'Allow redirects'),
      p('shareCookies', 'boolean', true, 'Share cookies with other HTTP modules'),
      p('requestCompressedContent', 'boolean', true, 'Request compressed content'),
      p('paginationType', 'select', false, 'Pagination type', {"options":["offsetBased","pageBased","urlBased","tokenBased"]})
    ]),

    // regexp:HTMLToText (1 uses)
    m('regexp:HTMLToText', 'H T M L To Text', 'Text Parser', 'action',
      'Performs h t m l to text in Text Parser.',
      [
      p('html', 'text', false, 'HTML'),
      p('newline', 'select', true, 'Line break', {"options":["lf","crlf","cr"]}),
      p('uppercaseHeadings', 'boolean', true, 'Uppercase headings')
    ]),

    // anthropic-claude:createAMessage (1 uses)
    m('anthropic-claude:createAMessage', 'Create A Message', 'Anthropic (Claude)', 'action',
      'Performs create a message in Anthropic (Claude).',
      [
      p('model', 'select', true, 'Model'),
      p('max_tokens', 'number', true, 'Max Tokens'),
      p('messages', 'array', true, 'Messages', {"hasSpec":true}),
      p('system', 'text', false, 'System Prompt'),
      p('metadata', 'object', false, 'Metadata', {"hasSpec":true}),
      p('stop_sequences', 'array', false, 'Stop Sequences', {"hasSpec":true}),
      p('temperature', 'number', false, 'Temperature', {"min":0,"max":1}),
      p('top_p', 'number', false, 'Top P', {"max":1}),
      p('top_k', 'number', false, 'Top K')
    ]),
        ];
    }

    async populateDatabase() {
        console.log('Populating database with Make.com modules...');

        const modules = await this.scrapeFromMakeAPI();

        let success = 0;
        let failed = 0;

        for (const mod of modules) {
            try {
                this.db.insertModule(mod);
                console.log(`  ✅ ${mod.app} → ${mod.name}`);
                success++;
            } catch (error: any) {
                console.error(`  ❌ ${mod.name}: ${error.message}`);
                failed++;
            }
        }

        console.log(`\nDone! ${success} modules inserted, ${failed} failed.`);
        console.log(`Total modules in database: ${modules.length}`);
        this.db.close();
    }
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? '');
if (isMain) {
    const scraper = new ModuleScraper();
    scraper.populateDatabase().catch(console.error);
}
