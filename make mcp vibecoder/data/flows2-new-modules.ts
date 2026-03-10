// ═══════════════════════════════════════════════════════════
// EXTRACTED FROM "Make example flows 2" (244 new modules)
// Generated: 2026-03-10
// Source: 308 unique modules from 223 blueprints
// ═══════════════════════════════════════════════════════════

    // --- AI Tools ---
    // ai-tools:Ask (5 uses in new blueprints)
    m('ai-tools:Ask', 'Ask', 'AI Tools', 'action',
      'Perform Ask in AI Tools',
      [
      p('input', 'text', true, 'Text')
    ]),

    // --- ActiveCampaign ---
    // activecampaign:upsertContact2024 (1 uses in new blueprints)
    m('activecampaign:upsertContact2024', 'upsert Contact2024', 'ActiveCampaign', 'action',
      'Perform upsert Contact2024 in ActiveCampaign',
      [
      p('email', 'email', true, 'Email'),
      p('firstName', 'text', false, 'First Name'),
      p('lastName', 'text', false, 'Last Name'),
      p('phone', 'text', false, 'Phone'),
      p('customFields', 'collection', false, 'Custom Fields')
    ]),
    // activecampaign:UpdateContactListStatus (1 uses in new blueprints)
    m('activecampaign:UpdateContactListStatus', 'Update Contact List Status', 'ActiveCampaign', 'search',
      'Search/list Update Contact List Status in ActiveCampaign',
      [
      p('listId', 'select', true, 'List ID'),
      p('contactId', 'select', true, 'Contact ID'),
      p('status', 'select', false, 'Status')
    ]),
    // activecampaign:AddTagToContact (1 uses in new blueprints)
    m('activecampaign:AddTagToContact', 'Add Tag To Contact', 'ActiveCampaign', 'action',
      'Perform Add Tag To Contact in ActiveCampaign',
      [
      p('contactId', 'select', true, 'Contact ID'),
      p('tagId', 'select', true, 'Tag ID')
    ]),

    // --- Airtable ---
    // airtable:ActionUpdateRecords (4 uses in new blueprints)
    m('airtable:ActionUpdateRecords', 'Action Update Records', 'Airtable', 'action',
      'Perform Action Update Records in Airtable',
      [
      p('base', 'select', true, 'Base'),
      p('typecast', 'boolean', true, 'Smart links'),
      p('useColumnId', 'boolean', true, 'Use Column ID'),
      p('table', 'select', true, 'Table'),
      p('id', 'text', true, 'Record ID'),
      p('record', 'collection', false, 'Record')
    ]),
    // airtable:ActionSearchRecords (3 uses in new blueprints)
    m('airtable:ActionSearchRecords', 'Action Search Records', 'Airtable', 'search',
      'Search/list Action Search Records in Airtable',
      [
      p('base', 'select', true, 'Base'),
      p('table', 'select', true, 'Table'),
      p('formula', 'text', false, 'Formula'),
      p('sort', 'array', false, 'Sort'),
      p('view', 'select', false, 'View'),
      p('maxRecords', 'number', false, 'Limit')
    ]),

    // --- Android ---
    // android:SendNotification (1 uses in new blueprints)
    m('android:SendNotification', 'Send Notification', 'Android', 'action',
      'Perform Send Notification in Android',
      [
      p('title', 'text', true, 'Title'),
      p('body', 'text', true, 'Body'),
      p('notification_action', 'select', false, 'Click action'),
      p('collapsible', 'boolean', true, 'Collapse push notifications')
    ]),
    // android:ScanTaken (1 uses in new blueprints)
    m('android:ScanTaken', 'Scan Taken', 'Android', 'action',
      'Perform Scan Taken in Android',
      [
      p('device', 'text', true, 'Device')
    ]),

    // --- Anthropic (Claude) ---
    // anthropic-claude:createACompletion (15 uses in new blueprints)
    m('anthropic-claude:createACompletion', 'create A Completion', 'Anthropic (Claude)', 'action',
      'Perform create A Completion in Anthropic (Claude)',
      [
      p('model', 'select', true, 'Model'),
      p('prompt', 'text', true, 'Prompt'),
      p('max_tokens_to_sample', 'number', true, 'Max Tokens to Sample'),
      p('stop_sequences', 'array', false, 'Stop Sequences'),
      p('temperature', 'number', false, 'Temperature'),
      p('top_p', 'number', false, 'Top-p'),
      p('top_k', 'number', false, 'Top-k'),
      p('metadata', 'collection', false, 'Metadata')
    ]),

    // --- Apify ai website crawler ---
    // apify-ai-website-crawler:extractUsingActor (1 uses in new blueprints)
    m('apify-ai-website-crawler:extractUsingActor', 'extract Using Actor', 'Apify ai website crawler', 'action',
      'Perform extract Using Actor in Apify ai website crawler',
      [
      p('startUrls', 'array', true, 'Start URLs'),
      p('crawlerType', 'select', true, 'Crawler type')
    ]),

    // --- Apify ---
    // apify:runActorNew (1 uses in new blueprints)
    m('apify:runActorNew', 'run Actor New', 'Apify', 'action',
      'Perform run Actor New in Apify',
      [
      p('actor_search_type', 'select', true, 'Search Actors from'),
      p('runSync', 'boolean', true, 'Run synchronously'),
      p('build', 'text', false, 'Build'),
      p('timeout', 'number', false, 'Timeout'),
      p('memory', 'select', false, 'Memory'),
      p('actorId', 'select', true, 'Actor'),
      p('inputBodyapple_yang~tiktok-transcripts-scraper', 'text', true, 'Input JSON'),
      p('maxTotalChargeUsd', 'number', false, 'Maximum cost per run'),
      p('maxItems', 'text', false, 'Maximum charged results')
    ]),

    // --- Apollo ---
    // apollo:makeApiCall (1 uses in new blueprints)
    m('apollo:makeApiCall', 'make Api Call', 'Apollo', 'action',
      'Perform make Api Call in Apollo',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- Archive ---
    // archive:UnpackAction (1 uses in new blueprints)
    m('archive:UnpackAction', 'Unpack Action', 'Archive', 'action',
      'Perform Unpack Action in Archive',
      [
      p('data', 'text', true, 'Data')
    ]),

    // --- Asana ---
    // asana:CreateTask (8 uses in new blueprints)
    m('asana:CreateTask', 'Create Task', 'Asana', 'action',
      'Perform Create Task in Asana',
      [
      p('destination', 'select', true, 'Task destination'),
      p('name', 'text', false, 'Task Name'),
      p('notes', 'text', false, 'Notes'),
      p('html_notes', 'text', false, 'HTML Notes'),
      p('workspaceAlt', 'select', false, 'Workspace ID'),
      p('due', 'select', false, 'Due'),
      p('resource_subtype', 'select', false, 'Resource Subtype'),
      p('liked', 'boolean', false, 'Liked'),
      p('completed', 'boolean', false, 'Task Completed?'),
      p('external', 'collection', false, 'External'),
      p('workspaceAlt2', 'select', false, 'Workspace ID'),
      p('tags', 'select', false, 'Tags'),
      p('workspace', 'select', true, 'Workspace ID'),
      p('assignee', 'text', false, 'Task Assignee ID'),
      p('assignee_status', 'select', false, 'Assignee Status'),
      p('followers', 'array', false, 'Followers'),
      p('projects', 'select', true, 'Projects'),
      p('ignoreMe', 'select', false, 'Generate Workspace Custom Fields'),
      p('ignoreMeTwo', 'select', false, 'Generate Workspace Projects Custom Fields'),
      p('workspace_custom_fields', 'collection', false, 'Workspace Custom Fields'),
      p('project_custom_fields', 'collection', false, 'Project Custom Fields')
    ]),
    // asana:WatchNewTasks (2 uses in new blueprints)
    m('asana:WatchNewTasks', 'Watch New Tasks', 'Asana', 'trigger',
      'Watch for Watch New Tasks in Asana',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('filter', 'select', true, 'Filter'),
      p('completed_since', 'date', false, 'Completed Since'),
      p('modified_since', 'date', false, 'Modified Since '),
      p('page', 'number', true, 'Limit'),
      p('project', 'select', true, 'Project ID')
    ]),
    // asana:ListTasks (2 uses in new blueprints)
    m('asana:ListTasks', 'List Tasks', 'Asana', 'search',
      'Search/list List Tasks in Asana',
      [
      p('filter', 'select', true, 'Filter'),
      p('completed_since', 'date', false, 'Completed Since'),
      p('modified_since', 'date', false, 'Modified Since '),
      p('page', 'number', false, 'Limit'),
      p('project', 'select', true, 'Project')
    ]),
    // asana:ListProjects (1 uses in new blueprints)
    m('asana:ListProjects', 'List Projects', 'Asana', 'search',
      'Search/list List Projects in Asana',
      [
      p('workspace', 'select', false, 'Workspace ID'),
      p('archived', 'boolean', false, 'Archived'),
      p('page', 'number', false, 'Limit'),
      p('team', 'select', false, 'Team ID')
    ]),
    // asana:CreateProject (1 uses in new blueprints)
    m('asana:CreateProject', 'Create Project', 'Asana', 'action',
      'Perform Create Project in Asana',
      [
      p('workspace', 'select', false, 'Workspace ID'),
      p('name', 'text', true, 'Name'),
      p('notes', 'text', false, 'Notes'),
      p('color', 'select', false, 'Color'),
      p('default_view', 'select', false, 'Default View'),
      p('due_on', 'date', false, 'Due On'),
      p('start_on', 'date', false, 'Start On'),
      p('is_template', 'boolean', false, 'Is Template'),
      p('public', 'boolean', false, 'Public')
    ]),
    // asana:WatchProjectTask (1 uses in new blueprints)
    m('asana:WatchProjectTask', 'Watch Project Task', 'Asana', 'trigger',
      'Watch for Watch Project Task in Asana',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // asana:GetTask (1 uses in new blueprints)
    m('asana:GetTask', 'Get Task', 'Asana', 'search',
      'Search/list Get Task in Asana',
      [
      p('selectOrMap', 'select', true, 'Enter a Task ID'),
      p('task_gid', 'text', true, 'Task ID')
    ]),
    // asana:WatchProjects (1 uses in new blueprints)
    m('asana:WatchProjects', 'Watch Projects', 'Asana', 'trigger',
      'Watch for Watch Projects in Asana',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('workspace', 'select', false, 'Workspace ID'),
      p('archived', 'boolean', false, 'Archived'),
      p('page', 'number', true, 'Limit')
    ]),
    // asana:ListTaskAttachments (1 uses in new blueprints)
    m('asana:ListTaskAttachments', 'List Task Attachments', 'Asana', 'search',
      'Search/list List Task Attachments in Asana',
      [
      p('selectOrMap', 'select', true, 'Enter a Task ID'),
      p('page', 'number', false, 'Limit'),
      p('task_gid', 'text', true, 'Task ID')
    ]),
    // asana:UpdateTask (1 uses in new blueprints)
    m('asana:UpdateTask', 'Update Task', 'Asana', 'action',
      'Perform Update Task in Asana',
      [
      p('selectOrMap', 'select', true, 'Enter a Task ID'),
      p('name', 'text', false, 'Task Name'),
      p('notes', 'text', false, 'Notes'),
      p('html_notes', 'text', false, 'HTML Notes'),
      p('assignee', 'select', false, 'Task Assignee'),
      p('due', 'select', false, 'Due'),
      p('resource_subtype', 'select', false, 'Resource Subtype'),
      p('liked', 'boolean', false, 'Liked'),
      p('completed', 'boolean', false, 'Task Completed?'),
      p('external', 'collection', false, 'External'),
      p('task_gid', 'text', true, 'Task ID'),
      p('workspace', 'select', false, 'Workspace ID')
    ]),

    // --- Attio ---
    // attio:makeAnApiCall (1 uses in new blueprints)
    m('attio:makeAnApiCall', 'make An Api Call', 'Attio', 'action',
      'Perform make An Api Call in Attio',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),
    // attio:getAPerson (1 uses in new blueprints)
    m('attio:getAPerson', 'get A Person', 'Attio', 'search',
      'Search/list get A Person in Attio',
      [
      p('record_id', 'select', true, 'Person ID')
    ]),

    // --- Barcode ---
    // barcode:GenerateBarcode (1 uses in new blueprints)
    m('barcode:GenerateBarcode', 'Generate Barcode', 'Barcode', 'action',
      'Perform Generate Barcode in Barcode',
      [
      p('bcid', 'select', true, 'Barcode type'),
      p('text', 'text', true, 'Text'),
      p('fileName', 'text', true, 'File name'),
      p('paddingwidth', 'number', false, 'Padding width'),
      p('paddingheight', 'number', false, 'Padding height'),
      p('scale', 'number', false, 'Scale'),
      p('rotate', 'select', false, 'Rotate'),
      p('eclevel', 'select', false, 'Error correction')
    ]),

    // --- Bitrix24 ---
    // bitrix24:watchLeads (1 uses in new blueprints)
    m('bitrix24:watchLeads', 'watch Leads', 'Bitrix24', 'trigger',
      'Watch for watch Leads in Bitrix24',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('select', 'select', true, 'Watch Leads'),
      p('filter', 'text', false, 'Filter'),
      p('limit', 'number', true, 'Limit')
    ]),
    // bitrix24:getAContact (1 uses in new blueprints)
    m('bitrix24:getAContact', 'get A Contact', 'Bitrix24', 'search',
      'Search/list get A Contact in Bitrix24',
      [
      p('contact', 'select', true, 'Contact ID')
    ]),

    // --- BrowserAct ---
    // browser-act:test (5 uses in new blueprints)
    m('browser-act:test', 'test', 'BrowserAct', 'action',
      'Perform test in BrowserAct',
      [
      p('type', 'select', true, 'Search Workflows From'),
      p('timeout', 'number', false, 'Timeout'),
      p('workflowId', 'select', true, 'Workflow'),
      p('open_incognito_mode', 'boolean', true, 'Incognito Mode'),
      p('inputParameters', 'collection', false, 'Input Parameters')
    ]),

    // --- CSV ---
    // csv:CreateAggregator (2 uses in new blueprints)
    m('csv:CreateAggregator', 'Create Aggregator', 'CSV', 'action',
      'Perform Create Aggregator in CSV',
      [
      p('includeHeaders', 'boolean', true, 'Include headers in the first row'),
      p('delimiterType', 'select', true, 'Delimiter'),
      p('newlineType', 'select', true, 'Newline'),
      p('delimiter', 'text', true, 'Delimiter character')
    ]),
    // csv:ParseCSV (1 uses in new blueprints)
    m('csv:ParseCSV', 'Parse C S V', 'CSV', 'action',
      'Perform Parse C S V in CSV',
      [
      p('csv', 'text', true, 'CSV')
    ]),

    // --- Clearbit ---
    // clearbit:findCompanyByDomainName (2 uses in new blueprints)
    m('clearbit:findCompanyByDomainName', 'find Company By Domain Name', 'Clearbit', 'search',
      'Search/list find Company By Domain Name in Clearbit',
      [
      p('domain', 'text', true, 'Domain'),
      p('company_name', 'text', false, 'Company Name'),
      p('linkedin', 'text', false, 'Linkedin'),
      p('twitter', 'text', false, 'Twitter'),
      p('facebook', 'text', false, 'Facebook')
    ]),

    // --- ClickUp ---
    // clickup:makeApiCall (1 uses in new blueprints)
    m('clickup:makeApiCall', 'make Api Call', 'ClickUp', 'action',
      'Perform make Api Call in ClickUp',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- Cloudconvert ---
    // cloudconvert:CreateArchive (2 uses in new blueprints)
    m('cloudconvert:CreateArchive', 'Create Archive', 'Cloudconvert', 'action',
      'Perform Create Archive in Cloudconvert',
      [
      p('import', 'collection', true, 'Import options'),
      p('options', 'collection', true, 'Archive options'),
      p('export', 'collection', true, 'Export options')
    ]),
    // cloudconvert:ConvertFile (1 uses in new blueprints)
    m('cloudconvert:ConvertFile', 'Convert File', 'Cloudconvert', 'action',
      'Perform Convert File in Cloudconvert',
      [
      p('import', 'collection', true, 'Import options'),
      p('options', 'collection', true, 'Convert options'),
      p('export', 'collection', true, 'Export options')
    ]),

    // --- Cloudmersive ---
    // cloudmersive:validateEmailAddress (1 uses in new blueprints)
    m('cloudmersive:validateEmailAddress', 'validate Email Address', 'Cloudmersive', 'action',
      'Perform validate Email Address in Cloudmersive',
      [
      p('email', 'email', true, 'Email Address')
    ]),

    // --- Code ---
    // code:ExecuteCode (1 uses in new blueprints)
    m('code:ExecuteCode', 'Execute Code', 'Code', 'action',
      'Perform Execute Code in Code',
      [
      p('language', 'select', true, 'Language'),
      p('input', 'array', false, 'Input'),
      p('dependencies', 'array', false, 'Additional dependencies (Enterprise plans only)'),
      p('inputFormat', 'select', true, 'Input format'),
      p('codeEditorJavascript', 'text', true, 'Code')
    ]),

    // --- Comidp ---
    // comidp:IntelligentImageEnhancementCreateTask (1 uses in new blueprints)
    m('comidp:IntelligentImageEnhancementCreateTask', 'Intelligent Image Enhancement Create Task', 'Comidp', 'action',
      'Perform Intelligent Image Enhancement Create Task in Comidp',
      [
      p('__IMTCONN__', 'text', true, 'Connection')
    ]),
    // comidp:IntelligentDocumentParsingFileUpload (1 uses in new blueprints)
    m('comidp:IntelligentDocumentParsingFileUpload', 'Intelligent Document Parsing File Upload', 'Comidp', 'action',
      'Perform Intelligent Document Parsing File Upload in Comidp',
      [
      p('file_name', 'text', true, 'file_name'),
      p('file', 'text', false, 'file'),
      p('taskId', 'text', false, 'task ID'),
      p('password', 'text', false, 'password'),
      p('parameter', 'text', false, 'parameter')
    ]),
    // comidp:IntelligentDocumentParsingStartTask (1 uses in new blueprints)
    m('comidp:IntelligentDocumentParsingStartTask', 'Intelligent Document Parsing Start Task', 'Comidp', 'action',
      'Perform Intelligent Document Parsing Start Task in Comidp',
      [
      p('taskId', 'text', true, 'task ID')
    ]),
    // comidp:IntelligentDocumentParsingGetFileInformation (1 uses in new blueprints)
    m('comidp:IntelligentDocumentParsingGetFileInformation', 'Intelligent Document Parsing Get File Information', 'Comidp', 'search',
      'Search/list Intelligent Document Parsing Get File Information in Comidp',
      [
      p('fileId', 'text', true, 'file ID')
    ]),

    // --- DataForSEO Backlinks API ---
    // dfs-backlinks-api:getBacklinks (9 uses in new blueprints)
    m('dfs-backlinks-api:getBacklinks', 'get Backlinks', 'DataForSEO Backlinks API', 'search',
      'Search/list get Backlinks in DataForSEO Backlinks API',
      [
      p('target', 'text', true, 'Target (Domain, Subdomain, URL)'),
      p('mode', 'select', false, 'Backlink Status'),
      p('filters', 'text', false, 'Filters'),
      p('order_by', 'array', false, 'Results Sorting Rules'),
      p('limit', 'number', false, 'Limit (up to 1000)'),
      p('offset', 'number', false, 'Offset'),
      p('backlinks_status_type', 'select', false, 'Backlink Status'),
      p('include_subdomains', 'boolean', false, 'Include Subdomains'),
      p('include_indirect_links', 'boolean', false, 'Include Indirect Links'),
      p('exclude_internal_backlinks', 'boolean', false, 'Exclude Internal Links'),
      p('rank_scale', 'select', false, 'Rank Scale')
    ]),

    // --- DataForSEO Labs API ---
    // dataforseo-labs-api:getRankedKeywords (6 uses in new blueprints)
    m('dataforseo-labs-api:getRankedKeywords', 'get Ranked Keywords', 'DataForSEO Labs API', 'search',
      'Search/list get Ranked Keywords in DataForSEO Labs API',
      [
      p('target', 'text', true, 'Target Domain'),
      p('location_name', 'text', false, 'Location'),
      p('language_name', 'text', false, 'Language'),
      p('ignore_synonyms', 'boolean', false, 'Ignore Synonyms'),
      p('item_types', 'select', false, 'Item Types'),
      p('include_clickstream_data', 'boolean', false, 'Include clickstream-based metrics in the result?'),
      p('load_rank_absolute', 'boolean', false, 'Return Rankings Distribution by Rank_absolute?'),
      p('historical_serp_mode', 'select', false, 'Data Collection Mode'),
      p('filters', 'text', false, 'Filters'),
      p('order_by', 'array', false, 'Results Sorting Rules'),
      p('limit', 'number', false, 'Limit (up to 1000)'),
      p('offset', 'number', false, 'Offset')
    ]),

    // --- Datastore ---
    // datastore:AddRecord (2 uses in new blueprints)
    m('datastore:AddRecord', 'Add Record', 'Datastore', 'action',
      'Perform Add Record in Datastore',
      [
      p('key', 'text', false, 'Key'),
      p('overwrite', 'boolean', true, 'Overwrite an existing record'),
      p('data', 'collection', false, 'Record')
    ]),
    // datastore:SearchRecord (2 uses in new blueprints)
    m('datastore:SearchRecord', 'Search Record', 'Datastore', 'search',
      'Search/list Search Record in Datastore',
      [
      p('filter', 'text', true, 'Filter'),
      p('sort', 'array', false, 'Sort'),
      p('mappAbleLimit', 'number', false, 'Mappable Limit')
    ]),
    // datastore:DeleteRecord (1 uses in new blueprints)
    m('datastore:DeleteRecord', 'Delete Record', 'Datastore', 'action',
      'Perform Delete Record in Datastore',
      [
      p('key', 'text', true, 'Key')
    ]),
    // datastore:GetRecord (1 uses in new blueprints)
    m('datastore:GetRecord', 'Get Record', 'Datastore', 'search',
      'Search/list Get Record in Datastore',
      [
      p('key', 'text', true, 'Key'),
      p('returnWrapped', 'boolean', true, 'Return Wrapped Output')
    ]),
    // datastore:ExistRecord (1 uses in new blueprints)
    m('datastore:ExistRecord', 'Exist Record', 'Datastore', 'action',
      'Perform Exist Record in Datastore',
      [
      p('key', 'text', true, 'Key')
    ]),

    // --- Deepl ---
    // deepl:translateText (2 uses in new blueprints)
    m('deepl:translateText', 'translate Text', 'Deepl', 'action',
      'Perform translate Text in Deepl',
      [
      p('text', 'text', true, 'Text'),
      p('target_lang', 'select', true, 'Target Language'),
      p('source_lang', 'select', false, 'Source Language'),
      p('split_sentences', 'select', false, 'Split Sentences'),
      p('preserve_formatting', 'boolean', false, 'Preserve Formatting'),
      p('glossary_id', 'select', false, 'Glossary ID'),
      p('tag_handling', 'select', false, 'Tag Handling'),
      p('non_splitting_tags', 'text', false, 'Non Splitting Tags'),
      p('outline_detection', 'boolean', false, 'Outline Detection'),
      p('splitting_tags', 'text', false, 'Splitting Tags'),
      p('ignore_tags', 'text', false, 'Ignored Tags')
    ]),

    // --- Discord ---
    // discord:createMessage (1 uses in new blueprints)
    m('discord:createMessage', 'create Message', 'Discord', 'action',
      'Perform create Message in Discord',
      [
      p('select', 'select', true, 'Choose a Method'),
      p('content', 'text', false, 'Message'),
      p('tts', 'boolean', false, 'Is TTS message'),
      p('embeds', 'array', false, 'Embeds'),
      p('sticker_ids', 'array', false, 'Stickers'),
      p('components', 'array', false, 'Components'),
      p('files', 'array', false, 'Files'),
      p('message_reference', 'collection', false, 'Message Reference'),
      p('channelId', 'select', true, 'Channel ID')
    ]),
    // discord:WatchChannelMessages (1 uses in new blueprints)
    m('discord:WatchChannelMessages', 'Watch Channel Messages', 'Discord', 'trigger',
      'Watch for Watch Channel Messages in Discord',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('channelId', 'select', true, 'Channel ID'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Dropbox ---
    // dropbox:uploadLargeFile (2 uses in new blueprints)
    m('dropbox:uploadLargeFile', 'upload Large File', 'Dropbox', 'action',
      'Perform upload Large File in Dropbox',
      [
      p('path', 'text', true, 'Folder'),
      p('filename', 'text', true, 'File Name'),
      p('data', 'text', true, 'Data'),
      p('overwrite', 'boolean', true, 'Overwrite an existing file')
    ]),

    // --- Easyship ---
    // easyship:createShipment (1 uses in new blueprints)
    m('easyship:createShipment', 'create Shipment', 'Easyship', 'action',
      'Perform create Shipment in Easyship',
      [
      p('destination_country_alpha2', 'select', true, 'Destination Country'),
      p('destination_city', 'text', true, 'Destination City'),
      p('destination_postal_code', 'text', true, 'Destination Postal Code'),
      p('destination_state', 'text', false, 'Destination State'),
      p('destination_name', 'text', true, 'Destination Name'),
      p('destination_company_name', 'text', false, 'Destination Company Name'),
      p('destination_address_line_1', 'text', true, 'Destination Address Line 1'),
      p('destination_address_line_2', 'text', false, 'Destination Address Line 2'),
      p('destination_phone_number', 'text', true, 'Destination Phone Number'),
      p('destination_email_address', 'email', true, 'Destination Email Address'),
      p('items', 'array', true, 'Items'),
      p('platform_name', 'text', false, 'Platform Name'),
      p('platform_order_number', 'text', false, 'Platform Order Number'),
      p('taxes_duties_paid_by', 'select', false, 'Taxes & Duties Paid By'),
      p('is_insured', 'boolean', false, 'Is Insured'),
      p('selected_courier_id', 'text', false, 'Selected Courier ID'),
      p('allow_courier_fallback', 'boolean', false, 'Allow Courier Fallback'),
      p('consignee_tax_id', 'text', false, 'Consignee Tax ID'),
      p('seller_notes', 'text', false, 'Seller Notes'),
      p('buyer_notes', 'text', false, 'Buyer Notes'),
      p('order_notes', 'text', false, 'Order Notes'),
      p('box', 'collection', false, 'Box'),
      p('total_actual_weight', 'number', false, 'Total Actual Weight')
    ]),

    // --- Egnyte ---
    // egnyte:SearchFilesFolders (1 uses in new blueprints)
    m('egnyte:SearchFilesFolders', 'Search Files Folders', 'Egnyte', 'search',
      'Search/list Search Files Folders in Egnyte',
      [
      p('query', 'text', false, 'Query'),
      p('path', 'text', false, 'Folder path'),
      p('modified_before', 'date', false, 'Modified before'),
      p('modified_after', 'date', false, 'Modified after'),
      p('type', 'select', false, 'Type'),
      p('namespaces', 'select', false, 'Namespaces'),
      p('custom_metadata', 'array', false, 'Custom metadata'),
      p('limit', 'number', false, 'Limit')
    ]),
    // egnyte:moveFile (1 uses in new blueprints)
    m('egnyte:moveFile', 'move File', 'Egnyte', 'action',
      'Perform move File in Egnyte',
      [
      p('id_or_path', 'select', true, 'Map ID or select a path'),
      p('destination', 'text', true, 'Destination'),
      p('newName', 'text', false, 'New name'),
      p('path', 'text', true, 'File path')
    ]),
    // egnyte:createAFileLink (1 uses in new blueprints)
    m('egnyte:createAFileLink', 'create A File Link', 'Egnyte', 'action',
      'Perform create A File Link in Egnyte',
      [
      p('path', 'text', true, 'File'),
      p('accessibility', 'select', true, 'Accessibility'),
      p('link_to_current', 'boolean', false, 'Link to current'),
      p('add_file_name', 'boolean', false, 'Add file name'),
      p('protection', 'boolean', true, 'View only'),
      p('expiry_date', 'date', false, 'Expire date'),
      p('expiry_clicks', 'number', false, 'Expire clicks'),
      p('send_email', 'boolean', true, 'Send email'),
      p('notify', 'boolean', true, 'Notify')
    ]),

    // --- Email ---
    // email:TriggerNewEmail (4 uses in new blueprints)
    m('email:TriggerNewEmail', 'Trigger New Email', 'Email', 'trigger',
      'Watch for Trigger New Email in Email',
      [
      p('account', 'text', true, 'Connection'),
      p('criteria', 'select', true, 'Criteria'),
      p('from', 'email', false, 'Sender email address'),
      p('to', 'email', false, 'Recipient email address'),
      p('subject', 'text', false, 'Subject'),
      p('text', 'text', false, 'Phrase'),
      p('markSeen', 'boolean', false, 'Mark message(s) as read when fetched'),
      p('maxResults', 'number', false, 'Maximum number of results'),
      p('folder', 'text', true, 'Folder')
    ]),
    // email:ActionSendMeEmail (2 uses in new blueprints)
    m('email:ActionSendMeEmail', 'Action Send Me Email', 'Email', 'action',
      'Perform Action Send Me Email in Email',
      [
      p('to', 'select', true, 'To'),
      p('subject', 'text', false, 'Subject'),
      p('html', 'text', false, 'Content')
    ]),
    // email:ActionCreateDraft (1 uses in new blueprints)
    m('email:ActionCreateDraft', 'Action Create Draft', 'Email', 'action',
      'Perform Action Create Draft in Email',
      [
      p('folder', 'text', true, 'Folder'),
      p('to', 'array', true, 'To'),
      p('subject', 'text', false, 'Subject'),
      p('contentType', 'select', true, 'Content Type'),
      p('attachments', 'array', false, 'Attachments'),
      p('cc', 'array', false, 'Copy recipient'),
      p('bcc', 'array', false, 'Blind copy recipient'),
      p('from', 'text', false, 'From'),
      p('sender', 'text', false, 'Sender'),
      p('replyTo', 'text', false, 'Reply-To'),
      p('inReplyTo', 'text', false, 'In-Reply-To'),
      p('references', 'array', false, 'References'),
      p('priority', 'select', false, 'Priority'),
      p('headers', 'array', false, 'Headers'),
      p('html', 'text', false, 'Content')
    ]),

    // --- Emercury ---
    // emercury:getAudience (3 uses in new blueprints)
    m('emercury:getAudience', 'get Audience', 'Emercury', 'search',
      'Search/list get Audience in Emercury',
      [
      p('__IMTCONN__', 'text', true, 'Connection')
    ]),
    // emercury:getSubscribers (3 uses in new blueprints)
    m('emercury:getSubscribers', 'get Subscribers', 'Emercury', 'search',
      'Search/list get Subscribers in Emercury',
      [
      p('audienceid', 'text', true, 'Audience ID')
    ]),

    // --- Etsy ---
    // etsy:listListings (1 uses in new blueprints)
    m('etsy:listListings', 'list Listings', 'Etsy', 'search',
      'Search/list list Listings in Etsy',
      [
      p('__IMTCONN__', 'text', false, 'Connection')
    ]),

    // --- Eventbrite ---
    // eventbrite:watchAttendees (1 uses in new blueprints)
    m('eventbrite:watchAttendees', 'watch Attendees', 'Eventbrite', 'trigger',
      'Watch for watch Attendees in Eventbrite',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('organizationId', 'select', true, 'Organization'),
      p('limit', 'number', true, 'Limit'),
      p('status', 'select', false, 'Status'),
      p('id', 'select', true, 'Event')
    ]),

    // --- Everhour ---
    // everhour:TriggerWatchNewTasks (1 uses in new blueprints)
    m('everhour:TriggerWatchNewTasks', 'Trigger Watch New Tasks', 'Everhour', 'trigger',
      'Watch for Trigger Watch New Tasks in Everhour',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // everhour:ActionGetAProject (1 uses in new blueprints)
    m('everhour:ActionGetAProject', 'Action Get A Project', 'Everhour', 'search',
      'Search/list Action Get A Project in Everhour',
      [
      p('projectID', 'select', true, 'Project ID')
    ]),
    // everhour:ActionGetAClient (1 uses in new blueprints)
    m('everhour:ActionGetAClient', 'Action Get A Client', 'Everhour', 'search',
      'Search/list Action Get A Client in Everhour',
      [
      p('client', 'select', true, 'Client ID')
    ]),

    // --- Facebook Conversions API ---
    // facebook-conversions-api:SendEvent (2 uses in new blueprints)
    m('facebook-conversions-api:SendEvent', 'Send Event', 'Facebook Conversions API', 'action',
      'Perform Send Event in Facebook Conversions API',
      [
      p('data', 'array', true, 'Data'),
      p('pixelId', 'text', false, 'Pixel ID'),
      p('test_event_code', 'text', false, 'Test Event Code'),
      p('ldu', 'boolean', false, 'Enable Limited Data Use')
    ]),

    // --- Facebook Insights ---
    // facebook-insights:CheckJobStatus (1 uses in new blueprints)
    m('facebook-insights:CheckJobStatus', 'Check Job Status', 'Facebook Insights', 'action',
      'Perform Check Job Status in Facebook Insights',
      [
      p('reportId', 'text', true, 'Report ID')
    ]),

    // --- Facebook Lead Ads ---
    // facebook-lead-ads:GetLeadDetails (2 uses in new blueprints)
    m('facebook-lead-ads:GetLeadDetails', 'Get Lead Details', 'Facebook Lead Ads', 'search',
      'Search/list Get Lead Details in Facebook Lead Ads',
      [
      p('pageId', 'select', true, 'Page'),
      p('id', 'text', true, 'Lead ID'),
      p('v', 'text', false, 'v'),
      p('formId', 'select', true, 'Form')
    ]),
    // facebook-lead-ads:WatchLeads (1 uses in new blueprints)
    m('facebook-lead-ads:WatchLeads', 'Watch Leads', 'Facebook Lead Ads', 'trigger',
      'Watch for Watch Leads in Facebook Lead Ads',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('pageId', 'select', true, 'Page'),
      p('limit', 'number', true, 'Limit'),
      p('formId', 'select', true, 'Form')
    ]),

    // --- Facebook Pages ---
    // facebook-pages:CreatePost (3 uses in new blueprints)
    m('facebook-pages:CreatePost', 'Create Post', 'Facebook Pages', 'action',
      'Perform Create Post in Facebook Pages',
      [
      p('page_id', 'select', true, 'Page'),
      p('message', 'text', false, 'Message'),
      p('link', 'url', false, 'Link'),
      p('name', 'text', false, 'Link name'),
      p('description', 'text', false, 'Link description'),
      p('date', 'date', false, 'Date'),
      p('page_id', 'select', true, 'Page'),
      p('message', 'text', false, 'Message'),
      p('link', 'url', false, 'Link'),
      p('name', 'text', false, 'Link name'),
      p('description', 'text', false, 'Link description'),
      p('date', 'date', false, 'Date')
    ]),
    // facebook-pages:WatchPosts (1 uses in new blueprints)
    m('facebook-pages:WatchPosts', 'Watch Posts', 'Facebook Pages', 'trigger',
      'Watch for Watch Posts in Facebook Pages',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('page_id', 'select', true, 'Page'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Fakturoid ---
    // fakturoid:ActionSearchSubject (1 uses in new blueprints)
    m('fakturoid:ActionSearchSubject', 'Action Search Subject', 'Fakturoid', 'search',
      'Search/list Action Search Subject in Fakturoid',
      [
      p('query', 'text', false, 'Query'),
      p('maxResults', 'number', true, 'Maximum number of returned contacts'),
      p('slug', 'select', true, 'Account')
    ]),
    // fakturoid:ActionCreateSubject (1 uses in new blueprints)
    m('fakturoid:ActionCreateSubject', 'Action Create Subject', 'Fakturoid', 'action',
      'Perform Action Create Subject in Fakturoid',
      [
      p('name', 'text', true, 'Company name'),
      p('street', 'text', false, 'Street'),
      p('street2', 'text', false, 'Street 2'),
      p('city', 'text', false, 'City'),
      p('zip', 'number', false, 'ZIP'),
      p('registrationNo', 'text', false, 'Registration No.'),
      p('vatNo', 'text', false, 'VAT No. (VAT payers)'),
      p('bankAccount', 'text', false, 'Bank account number'),
      p('fullName', 'text', false, 'Contact person\'s full name '),
      p('email', 'email', false, 'Email address where to send invoices '),
      p('phone', 'text', false, 'Phone'),
      p('web', 'url', false, 'Web'),
      p('country', 'text', false, 'Country (ISO code)'),
      p('variableSymbol', 'text', false, 'Variable symbol'),
      p('iban', 'text', false, 'IBAN'),
      p('emailCopy', 'email', false, 'Email address where to send invoice copies'),
      p('customId', 'text', false, 'ID of the contact in your application'),
      p('slug', 'select', true, 'Account')
    ]),
    // fakturoid:ActionCreateInvoice (1 uses in new blueprints)
    m('fakturoid:ActionCreateInvoice', 'Action Create Invoice', 'Fakturoid', 'action',
      'Perform Action Create Invoice in Fakturoid',
      [
      p('lines', 'array', false, 'Invoice lines'),
      p('paymentMethod', 'select', true, 'Payment method'),
      p('issuedOn', 'date', false, 'Issued on'),
      p('taxableFulfillmentDue', 'date', false, 'Taxable fulfillment date'),
      p('due', 'number', false, 'The number of days before the payment due date'),
      p('number', 'text', false, 'Invoice number'),
      p('orderNumber', 'text', false, 'Order number'),
      p('variableSymbol', 'text', false, 'Variable symbol'),
      p('note', 'text', false, 'Note above the invoice lines'),
      p('footerNote', 'text', false, 'Footer of the invoice'),
      p('privateNote', 'text', false, 'Private note'),
      p('iban', 'text', false, 'IBAN'),
      p('swiftBic', 'text', false, 'BIC'),
      p('currency', 'text', false, 'Currency code'),
      p('exchangeRate', 'number', false, 'Exchange rate'),
      p('language', 'select', true, 'Language in which the invoice is drawn up'),
      p('transferredTaxLiability', 'boolean', true, 'Transferred tax liability'),
      p('supplyCode', 'text', false, 'Supply code for recapitulative statements'),
      p('proforma', 'boolean', true, 'This is a proforma invoice.'),
      p('partialProforma', 'boolean', true, 'This is a partial proforma invoice.'),
      p('relatedId', 'number', false, 'Proforma invoice/invoice ID'),
      p('slug', 'select', true, 'Account'),
      p('subjectId', 'select', true, 'Contact'),
      p('bankAccountType', 'select', true, 'Ways of specifying a bank account '),
      p('bankAccountId', 'select', true, 'Bank account')
    ]),

    // --- Flow Control ---
    // builtin:BasicRepeater (9 uses in new blueprints)
    m('builtin:BasicRepeater', 'Basic Repeater', 'Flow Control', 'action',
      'Perform Basic Repeater in Flow Control',
      [
      p('start', 'number', true, 'Initial value'),
      p('repeats', 'number', true, 'Repeats'),
      p('step', 'number', true, 'Step')
    ]),

    // --- Focuster ---
    // focuster:newCompletedAction (1 uses in new blueprints)
    m('focuster:newCompletedAction', 'new Completed Action', 'Focuster', 'action',
      'Perform new Completed Action in Focuster',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Gakunin rdm ---
    // gakunin-rdm:watchEvents (1 uses in new blueprints)
    m('gakunin-rdm:watchEvents', 'watch Events', 'Gakunin rdm', 'trigger',
      'Watch for watch Events in Gakunin rdm',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // gakunin-rdm:displayInformation (1 uses in new blueprints)
    m('gakunin-rdm:displayInformation', 'display Information', 'Gakunin rdm', 'action',
      'Perform display Information in Gakunin rdm',
      [
      p('guid', 'text', true, 'GUID'),
      p('timestamp', 'text', true, 'Timestamp'),
      p('notifyType', 'text', true, 'Notify Type')
    ]),

    // --- Gemini AI ---
    // gemini-ai:createACompletionGeminiPro (2 uses in new blueprints)
    m('gemini-ai:createACompletionGeminiPro', 'create A Completion Gemini Pro', 'Gemini AI', 'action',
      'Perform create A Completion Gemini Pro in Gemini AI',
      [
      p('model', 'select', true, 'AI Model'),
      p('contents', 'array', true, 'Messages'),
      p('system_instruction', 'collection', false, 'System Instructions'),
      p('safetySettings', 'array', false, 'Safety Settings'),
      p('generationConfig', 'collection', false, 'Generation configurations'),
      p('tools', 'text', false, 'Tools'),
      p('tool_config', 'text', false, 'Tool Config'),
      p('function_declarations_context', 'boolean', false, 'Function Declarations Grounding'),
      p('url_context', 'boolean', false, 'URL Context'),
      p('google_search_context', 'boolean', false, 'Google Search Grounding'),
      p('code_execution', 'boolean', false, 'Code Execution'),
      p('google_maps_context', 'boolean', false, 'Google Maps Grounding'),
      p('file_search_store_context', 'boolean', false, 'File Search Store Context')
    ]),
    // gemini-ai:uploadAFile (1 uses in new blueprints)
    m('gemini-ai:uploadAFile', 'upload A File', 'Gemini AI', 'action',
      'Perform upload A File in Gemini AI',
      [
      p('file_name', 'text', true, 'Name'),
      p('file_data', 'text', true, 'Data'),
      p('useFileSearchStore', 'boolean', false, 'Use File Search Store')
    ]),

    // --- GetResponse ---
    // getresponse:TriggerNewContact (1 uses in new blueprints)
    m('getresponse:TriggerNewContact', 'Trigger New Contact', 'GetResponse', 'trigger',
      'Watch for Trigger New Contact in GetResponse',
      [
      p('account', 'text', true, 'Connection'),
      p('maxResults', 'number', true, 'Maximum number of contacts')
    ]),

    // --- Gmail ---
    // google-email:TriggerNewEmail (4 uses in new blueprints)
    m('google-email:TriggerNewEmail', 'Trigger New Email', 'Gmail', 'trigger',
      'Watch for Trigger New Email in Gmail',
      [
      p('account', 'text', false, 'Connection'),
      p('searchType', 'select', false, 'Filter type'),
      p('markSeen', 'boolean', false, 'Mark email message(s) as read when fetched'),
      p('maxResults', 'number', false, 'Maximum number of results'),
      p('folder', 'text', true, 'Folder'),
      p('criteria', 'select', true, 'Criteria'),
      p('from', 'email', false, 'Sender email address'),
      p('subject', 'text', false, 'Subject'),
      p('text', 'text', false, 'Search phrase')
    ]),
    // google-email:sendAnEmail (4 uses in new blueprints)
    m('google-email:sendAnEmail', 'send An Email', 'Gmail', 'action',
      'Perform send An Email in Gmail',
      [
      p('to', 'array', true, 'To'),
      p('subject', 'text', false, 'Subject'),
      p('bodyType', 'select', true, 'Body type'),
      p('attachments', 'array', false, 'Attachments'),
      p('from', 'select', false, 'From'),
      p('cc', 'array', false, 'CC recipients'),
      p('bcc', 'array', false, 'BCC recipients'),
      p('emailHeaders', 'array', false, 'Additional email headers'),
      p('content', 'text', false, 'Content')
    ]),
    // google-email:ActionCreateDraft (2 uses in new blueprints)
    m('google-email:ActionCreateDraft', 'Action Create Draft', 'Gmail', 'action',
      'Perform Action Create Draft in Gmail',
      [
      p('folder', 'text', true, 'Folder'),
      p('to', 'array', false, 'To'),
      p('subject', 'text', false, 'Subject'),
      p('html', 'text', false, 'Content'),
      p('attachments', 'array', false, 'Attachments'),
      p('cc', 'array', false, 'Copy recipient'),
      p('bcc', 'array', false, 'Blind copy recipient')
    ]),

    // --- Google Ads ---
    // google-ads-campaign-management:listCampaigns (1 uses in new blueprints)
    m('google-ads-campaign-management:listCampaigns', 'list Campaigns', 'Google Ads', 'search',
      'Search/list list Campaigns in Google Ads',
      [
      p('clientId', 'select', true, 'Account/Customer ID'),
      p('select', 'select', true, 'Select a Method'),
      p('limit', 'number', false, 'Limit'),
      p('filter', 'text', false, 'Filter')
    ]),
    // google-ads-campaign-management:updateACampaign (1 uses in new blueprints)
    m('google-ads-campaign-management:updateACampaign', 'update A Campaign', 'Google Ads', 'action',
      'Perform update A Campaign in Google Ads',
      [
      p('select', 'select', true, 'Select a Method'),
      p('clientId', 'select', true, 'Account/Customer ID'),
      p('status', 'select', true, 'Status'),
      p('campaign', 'text', true, 'Campaign ID')
    ]),

    // --- Google Calendar ---
    // google-calendar:createAnEvent (1 uses in new blueprints)
    m('google-calendar:createAnEvent', 'create An Event', 'Google Calendar', 'action',
      'Perform create An Event in Google Calendar',
      [
      p('select', 'select', true, 'Create an Event'),
      p('calendar', 'select', true, 'Calendar ID'),
      p('colorId', 'select', false, 'Color'),
      p('summary', 'text', true, 'Event Name'),
      p('allDayEvent', 'boolean', true, 'All Day Event'),
      p('start', 'date', true, 'Start Date'),
      p('end', 'date', true, 'End Date'),
      p('description', 'text', false, 'Description'),
      p('location', 'text', false, 'Location'),
      p('useDefault', 'boolean', false, 'Use the default reminder settings for this event'),
      p('overrides', 'array', false, 'Reminders'),
      p('attendees', 'array', false, 'Attendees'),
      p('transparency', 'select', true, 'Show me as'),
      p('visibility', 'select', true, 'Visibility'),
      p('sendUpdates', 'select', false, 'Send notifications about the event creation'),
      p('guestsCanModify', 'boolean', true, 'Guests can modify the event'),
      p('recurrence', 'array', false, 'Recurrence'),
      p('conferenceDate', 'boolean', true, 'Add Google Meet Video Conferencing')
    ]),

    // --- Google Cloud TTS ---
    // google-cloud-tts:synthesizeSpeech (1 uses in new blueprints)
    m('google-cloud-tts:synthesizeSpeech', 'synthesize Speech', 'Google Cloud TTS', 'action',
      'Perform synthesize Speech in Google Cloud TTS',
      [
      p('input', 'text', true, 'Text or SSML'),
      p('voice', 'collection', false, 'Voice'),
      p('audioConfig', 'collection', false, 'Audio Config'),
      p('fileName', 'text', false, 'File Name')
    ]),

    // --- Google Cloud Vision ---
    // googlecloudvision:DetectText (1 uses in new blueprints)
    m('googlecloudvision:DetectText', 'Detect Text', 'Google Cloud Vision', 'action',
      'Perform Detect Text in Google Cloud Vision',
      [
      p('imageSendMethod', 'select', true, 'Data/URL'),
      p('isToOptimizeDetection', 'boolean', true, 'Optimize the Detection for Dense Text and Documents'),
      p('isToIncludeFullTextAnnotation', 'boolean', true, 'Include Full Text Annotation'),
      p('data', 'text', true, 'Data')
    ]),

    // --- Google Contacts ---
    // google-contacts:createAContact (1 uses in new blueprints)
    m('google-contacts:createAContact', 'create A Contact', 'Google Contacts', 'action',
      'Perform create A Contact in Google Contacts',
      [
      p('honorificPrefix', 'text', false, 'Name Prefix'),
      p('givenName', 'text', true, 'First Name'),
      p('phoneticGivenName', 'text', false, 'First Name Yomi'),
      p('middleName', 'text', false, 'Middle Name'),
      p('phoneticMiddleName', 'text', false, 'Middle Name Yomi'),
      p('familyName', 'text', false, 'Family Name'),
      p('phoneticFamilyName', 'text', false, 'Family Name Yomi'),
      p('honorificSuffix', 'text', false, 'Name Suffix'),
      p('nickname', 'text', false, 'Nickname'),
      p('fileAses', 'text', false, 'File as'),
      p('label', 'select', false, 'Labels'),
      p('data', 'text', false, 'Photo Data'),
      p('organization', 'collection', false, 'Company'),
      p('emailAddresses', 'array', false, 'Emails'),
      p('phoneNumbers', 'array', false, 'Phone Numbers'),
      p('addresses', 'array', false, 'Addresses'),
      p('birthday', 'date', false, 'Birthday'),
      p('events', 'array', false, 'Events'),
      p('urls', 'array', false, 'URLs'),
      p('imClients', 'array', false, 'IM Clients'),
      p('note', 'text', false, 'Notes'),
      p('relations', 'array', false, 'Relations'),
      p('userDefined', 'array', false, 'User Defined Fields')
    ]),

    // --- Google Docs ---
    // google-docs:createADocumentFromTemplate (3 uses in new blueprints)
    m('google-docs:createADocumentFromTemplate', 'create A Document From Template', 'Google Docs', 'action',
      'Perform create A Document From Template in Google Docs',
      [
      p('select', 'select', true, 'Create a Document from a Template'),
      p('name', 'text', true, 'Title'),
      p('destination', 'select', true, 'New Drive Location'),
      p('from', 'select', true, 'Choose a Drive'),
      p('document', 'text', true, 'Document ID'),
      p('requests', 'collection', false, 'Values'),
      p('folderId', 'text', true, 'New Document\'s Location')
    ]),
    // google-docs:exportADocument (2 uses in new blueprints)
    m('google-docs:exportADocument', 'export A Document', 'Google Docs', 'action',
      'Perform export A Document in Google Docs',
      [
      p('destination', 'select', true, 'Choose a Drive'),
      p('mimeType', 'select', true, 'Type'),
      p('document', 'text', true, 'Document ID')
    ]),
    // google-docs:appendADocument (2 uses in new blueprints)
    m('google-docs:appendADocument', 'append A Document', 'Google Docs', 'action',
      'Perform append A Document in Google Docs',
      [
      p('choose', 'select', true, 'Select a Document'),
      p('destination', 'select', true, 'Choose a Drive'),
      p('document', 'text', true, 'Document ID'),
      p('select', 'select', true, 'Insert a Paragraph'),
      p('text', 'text', true, 'Appended Text')
    ]),
    // google-docs:createADocument (1 uses in new blueprints)
    m('google-docs:createADocument', 'create A Document', 'Google Docs', 'action',
      'Perform create A Document in Google Docs',
      [
      p('name', 'text', true, 'Name'),
      p('content', 'text', true, 'Content'),
      p('destination', 'select', true, 'Choose a Drive'),
      p('header', 'boolean', true, 'Insert a Header'),
      p('footer', 'boolean', true, 'Insert a Footer'),
      p('folderId', 'text', true, 'New Document\'s Location')
    ]),

    // --- Google Drive ---
    // google-drive:getAFile (3 uses in new blueprints)
    m('google-drive:getAFile', 'get A File', 'Google Drive', 'search',
      'Search/list get A File in Google Drive',
      [
      p('select', 'select', true, 'Enter a File ID'),
      p('formatDocuments', 'select', true, 'Convert Google Documents Files to Format'),
      p('formatSpreadsheets', 'select', true, 'Convert Google Spreadsheets Files to Format'),
      p('formatPresentations', 'select', true, 'Convert Google Slides Files to Format'),
      p('formatDrawings', 'select', true, 'Convert Google Drawings Files to Format'),
      p('destination', 'select', true, 'Choose a Drive'),
      p('file', 'text', true, 'File ID')
    ]),
    // google-drive:shareAFileFolder (1 uses in new blueprints)
    m('google-drive:shareAFileFolder', 'share A File Folder', 'Google Drive', 'action',
      'Perform share A File Folder in Google Drive',
      [
      p('destination', 'select', true, 'Choose a Drive'),
      p('select', 'select', true, 'Select'),
      p('role', 'select', true, 'Role'),
      p('type', 'select', true, 'Type'),
      p('file', 'text', true, 'File ID'),
      p('allowFileDiscovery', 'boolean', true, 'Allow File Discovery')
    ]),

    // --- Google Forms ---
    // google-forms:watchRows (2 uses in new blueprints)
    m('google-forms:watchRows', 'watch Rows', 'Google Forms', 'trigger',
      'Watch for watch Rows in Google Forms',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('spreadsheetId', 'select', true, 'Spreadsheet'),
      p('includesHeaders', 'text', true, 'includesHeaders'),
      p('tableFirstRow', 'text', true, 'Row with headers'),
      p('valueRenderOption', 'select', false, 'Value render option'),
      p('dateTimeRenderOption', 'select', false, 'Date and time render option'),
      p('limit', 'number', true, 'Limit'),
      p('sheetId', 'select', true, 'Sheet')
    ]),
    // google-forms:watchResponses (1 uses in new blueprints)
    m('google-forms:watchResponses', 'watch Responses', 'Google Forms', 'trigger',
      'Watch for watch Responses in Google Forms',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('formId', 'text', true, 'Form ID'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Google Sheets ---
    // google-sheets:clearValuesFromRange (4 uses in new blueprints)
    m('google-sheets:clearValuesFromRange', 'clear Values From Range', 'Google Sheets', 'action',
      'Perform clear Values From Range in Google Sheets',
      [
      p('select', 'select', true, 'Search Method'),
      p('range', 'text', true, 'Range'),
      p('from', 'select', true, 'Drive'),
      p('spreadsheetId', 'text', true, 'Spreadsheet ID'),
      p('sheet', 'select', true, 'Sheet Name')
    ]),
    // google-sheets:createSpreadsheet (4 uses in new blueprints)
    m('google-sheets:createSpreadsheet', 'create Spreadsheet', 'Google Sheets', 'action',
      'Perform create Spreadsheet in Google Sheets',
      [
      p('properties', 'collection', false, 'Properties'),
      p('sheets', 'array', false, 'Sheets')
    ]),
    // google-sheets:addSheet (2 uses in new blueprints)
    m('google-sheets:addSheet', 'add Sheet', 'Google Sheets', 'action',
      'Perform add Sheet in Google Sheets',
      [
      p('select', 'select', true, 'Search Method'),
      p('properties', 'collection', false, 'Properties'),
      p('from', 'select', true, 'Drive'),
      p('spreadsheetId', 'text', true, 'Spreadsheet ID')
    ]),

    // --- Gotomeeting ---
    // gotomeeting:watchMeetingsCreated (1 uses in new blueprints)
    m('gotomeeting:watchMeetingsCreated', 'watch Meetings Created', 'Gotomeeting', 'trigger',
      'Watch for watch Meetings Created in Gotomeeting',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),
    // gotomeeting:startAMeeting (1 uses in new blueprints)
    m('gotomeeting:startAMeeting', 'start A Meeting', 'Gotomeeting', 'action',
      'Perform start A Meeting in Gotomeeting',
      [
      p('meetingId', 'select', true, 'Meeting ID')
    ]),

    // --- HTML/CSS to Image ---
    // html-css-to-image:Screenshot (1 uses in new blueprints)
    m('html-css-to-image:Screenshot', 'Screenshot', 'HTML/CSS to Image', 'action',
      'Perform Screenshot in HTML/CSS to Image',
      [
      p('url', 'text', true, 'URL'),
      p('device_scale', 'number', false, 'Device Scale'),
      p('viewport_width', 'number', false, 'Viewport Width'),
      p('viewport_height', 'number', false, 'Viewport Height'),
      p('ms_delay', 'number', false, 'Millisecond Delay')
    ]),

    // --- HTTP ---
    // http:ActionSendDataAPIKeyAuth (2 uses in new blueprints)
    m('http:ActionSendDataAPIKeyAuth', 'Action Send Data A P I Key Auth', 'HTTP', 'action',
      'Perform Action Send Data A P I Key Auth in HTTP',
      [
      p('url', 'url', true, 'URL'),
      p('serializeUrl', 'boolean', true, 'Serialize URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('bodyType', 'select', false, 'Body type'),
      p('parseResponse', 'boolean', true, 'Parse response'),
      p('timeout', 'number', false, 'Timeout'),
      p('shareCookies', 'boolean', true, 'Share cookies with other HTTP modules'),
      p('ca', 'text', false, 'Self-signed certificate'),
      p('rejectUnauthorized', 'boolean', true, 'Reject connections that are using unverified (self-signed) certificates'),
      p('followRedirect', 'boolean', true, 'Follow redirect'),
      p('useQuerystring', 'boolean', true, 'Disable serialization of multiple same query string keys as arrays'),
      p('gzip', 'boolean', true, 'Request compressed content'),
      p('useMtls', 'boolean', true, 'Use Mutual TLS'),
      p('contentType', 'select', false, 'Content type'),
      p('data', 'text', false, 'Request content'),
      p('followAllRedirects', 'boolean', true, 'Follow all redirect')
    ]),

    // --- HubSpot CRM ---
    // hubspotcrm:getCompany (2 uses in new blueprints)
    m('hubspotcrm:getCompany', 'get Company', 'HubSpot CRM', 'search',
      'Search/list get Company in HubSpot CRM',
      [
      p('companyId', 'select', true, 'Company ID'),
      p('outputProperties', 'select', false, 'Output Properties'),
      p('parseCustomFields', 'boolean', true, 'Parse Custom Fields')
    ]),
    // hubspotcrm:upsertAContact (2 uses in new blueprints)
    m('hubspotcrm:upsertAContact', 'upsert A Contact', 'HubSpot CRM', 'action',
      'Perform upsert A Contact in HubSpot CRM',
      [
      p('_method', 'select', true, 'View Method'),
      p('swapPrimaryEmail', 'boolean', true, 'Swap Primary Email'),
      p('parseCustomFields', 'boolean', true, 'Parse Custom Fields'),
      p('email', 'text', false, 'Email'),
      p('annualrevenue', 'text', false, 'Annual Revenue'),
      p('billing_address_city', 'text', false, 'Billing Address: City'),
      p('billing_address_country', 'text', false, 'Billing Address: Country'),
      p('billing_address_google_maps_url', 'text', false, 'Billing Address: Google Maps URL'),
      p('billing_address_lat', 'text', false, 'Billing Address: Lat'),
      p('billing_address_long', 'text', false, 'Billing Address: Long'),
      p('billing_address_name', 'text', false, 'Billing Address: Name'),
      p('billing_address_phone_number', 'text', false, 'Billing Address: Phone Number'),
      p('billing_address_postal_code', 'text', false, 'Billing Address: Postal Code'),
      p('billing_address_state_region', 'text', false, 'Billing Address: State/Region'),
      p('billing_address_street_address', 'text', false, 'Billing Address: Street Address'),
      p('billing_address_subpremise', 'text', false, 'Billing Address: Subpremise'),
      p('billing_address_suburb', 'text', false, 'Billing Address: Suburb'),
      p('hs_all_assigned_business_unit_ids', 'select', false, 'Brands'),
      p('hs_buying_role', 'select', false, 'Buying Role'),
      p('city', 'text', false, 'City'),
      p('closedate', 'date', false, 'Close Date'),
      p('company', 'text', false, 'Company Name'),
      p('company_size', 'text', false, 'Company Size'),
      p('hubspot_owner_id', 'select', false, 'Contact Owner'),
      p('country', 'text', false, 'Country/Region'),
      p('hs_country_region_code', 'text', false, 'Country/Region Code'),
      p('hs_customer_agent_lead_status', 'select', false, 'Customer Agent Lead Status'),
      p('date_of_birth', 'text', false, 'Date Of Birth'),
      p('degree', 'text', false, 'Degree'),
      p('hs_email_customer_quarantined_reason', 'select', false, 'Email Address Quarantine Reason'),
      p('hs_employment_change_detected_date', 'date', false, 'Employment Change Detected Date'),
      p('hs_role', 'select', false, 'Employment Role'),
      p('hs_seniority', 'select', false, 'Employment Seniority'),
      p('hs_sub_role', 'select', false, 'Employment Sub Role'),
      p('hs_enriched_email_bounce_detected', 'boolean', false, 'Enriched Email Bounce Detected'),
      p('hs_facebook_click_id', 'text', false, 'Facebook Click Id'),
      p('fax', 'text', false, 'Fax Number'),
      p('field_of_study', 'text', false, 'Field Of Study'),
      p('firstname', 'text', false, 'First Name'),
      p('followercount', 'number', false, 'Follower Count'),
      p('gender', 'text', false, 'Gender'),
      p('hs_google_click_id', 'text', false, 'Google Ad Click Id'),
      p('graduation_date', 'text', false, 'Graduation Date'),
      p('industry', 'text', false, 'Industry'),
      p('hs_inferred_language_codes', 'select', false, 'Inferred Language Codes'),
      p('hs_job_change_detected_date', 'date', false, 'Job Change Detected Date'),
      p('job_function', 'text', false, 'Job Function'),
      p('jobtitle', 'text', false, 'Job Title'),
      p('hs_journey_stage', 'select', false, 'Journey Stage'),
      p('kloutscoregeneral', 'number', false, 'Klout Score'),
      p('lastname', 'text', false, 'Last Name'),
      p('hs_latest_source', 'select', false, 'Latest Traffic Source'),
      p('hs_latest_source_timestamp', 'date', false, 'Latest Traffic Source Date'),
      p('hs_lead_status', 'select', false, 'Lead Status'),
      p('hs_legal_basis', 'select', false, 'Legal Basis For Processing Contact\'s Data'),
      p('lifecyclestage', 'select', false, 'Lifecycle Stage'),
      p('linkedinbio', 'text', false, 'LinkedIn Bio'),
      p('linkedinconnections', 'number', false, 'LinkedIn Connections'),
      p('hs_linkedin_url', 'text', false, 'LinkedIn URL'),
      p('marital_status', 'text', false, 'Marital Status'),
      p('hs_content_membership_email', 'text', false, 'Member Email'),
      p('hs_content_membership_notes', 'text', false, 'Membership Notes'),
      p('message', 'text', false, 'Message'),
      p('military_status', 'text', false, 'Military Status'),
      p('mobilephone', 'text', false, 'Mobile Phone Number'),
      p('numemployees', 'select', false, 'Number Of Employees'),
      p('hs_analytics_source', 'select', false, 'Original Traffic Source'),
      p('hs_persona', 'select', false, 'Persona'),
      p('phone', 'text', false, 'Phone Number'),
      p('physical_address_city', 'text', false, 'Physical Address: City'),
      p('physical_address_country', 'text', false, 'Physical Address: Country'),
      p('physical_address_google_maps_url', 'text', false, 'Physical Address: Google Maps URL'),
      p('physical_address_lat', 'text', false, 'Physical Address: Lat'),
      p('physical_address_long', 'text', false, 'Physical Address: Long'),
      p('physical_address_name', 'text', false, 'Physical Address: Name'),
      p('physical_address_phone_number', 'text', false, 'Physical Address: Phone Number'),
      p('physical_address_postal_code', 'text', false, 'Physical Address: Postal Code'),
      p('physical_address_state_region', 'text', false, 'Physical Address: State/Region'),
      p('physical_address_street_address', 'text', false, 'Physical Address: Street Address'),
      p('physical_address_subpremise', 'text', false, 'Physical Address: Subpremise'),
      p('physical_address_suburb', 'text', false, 'Physical Address: Suburb'),
      p('postal_address_city', 'text', false, 'Postal Address: City'),
      p('postal_address_country', 'text', false, 'Postal Address: Country'),
      p('postal_address_google_maps_url', 'text', false, 'Postal Address: Google Maps URL'),
      p('postal_address_lat', 'text', false, 'Postal Address: Lat'),
      p('postal_address_long', 'text', false, 'Postal Address: Long'),
      p('postal_address_name', 'text', false, 'Postal Address: Name'),
      p('postal_address_phone_number', 'text', false, 'Postal Address: Phone Number'),
      p('postal_address_postal_code', 'text', false, 'Postal Address: Postal Code'),
      p('postal_address_state_region', 'text', false, 'Postal Address: State/Region'),
      p('postal_address_street_address', 'text', false, 'Postal Address: Street Address'),
      p('postal_address_subpremise', 'text', false, 'Postal Address: Subpremise'),
      p('postal_address_suburb', 'text', false, 'Postal Address: Suburb'),
      p('zip', 'text', false, 'Postal Code'),
      p('hs_language', 'select', false, 'Preferred Language'),
      p('hs_prospecting_agent_last_enrolled', 'text', false, 'Prospecting Agent Last Enrolled'),
      p('hs_prospecting_agent_total_enrolled_count', 'text', false, 'Prospecting Agent Total Enrolled Count'),
      p('relationship_status', 'text', false, 'Relationship Status'),
      p('hs_returning_to_office_detected_date', 'date', false, 'Returning To Office Detected Date'),
      p('salutation', 'text', false, 'Salutation'),
      p('school', 'text', false, 'School'),
      p('seniority', 'text', false, 'Seniority'),
      p('hs_shared_team_ids', 'select', false, 'Shared Teams'),
      p('hs_shared_user_ids', 'select', false, 'Shared Users'),
      p('start_date', 'text', false, 'Start Date'),
      p('state', 'text', false, 'State/Region'),
      p('hs_state_code', 'text', false, 'State/Region Code'),
      p('hs_content_membership_status', 'select', false, 'Status'),
      p('address', 'text', false, 'Street Address'),
      p('hs_time_between_contact_creation_and_deal_close', 'number', false, 'Time Between Contact Creation And Deal Close'),
      p('hs_time_between_contact_creation_and_deal_creation', 'number', false, 'Time Between Contact Creation And Deal Creation'),
      p('hs_time_to_move_from_lead_to_customer', 'number', false, 'Time To Move From Lead To Customer'),
      p('hs_time_to_move_from_marketingqualifiedlead_to_customer', 'number', false, 'Time To Move From Marketing Qualified Lead To Customer'),
      p('hs_time_to_move_from_opportunity_to_customer', 'number', false, 'Time To Move From Opportunity To Customer'),
      p('hs_time_to_move_from_salesqualifiedlead_to_customer', 'number', false, 'Time To Move From Sales Qualified Lead To Customer'),
      p('hs_time_to_move_from_subscriber_to_customer', 'number', false, 'Time To Move From Subscriber To Customer'),
      p('hs_timezone', 'select', false, 'Time Zone'),
      p('twitterbio', 'text', false, 'Twitter Bio'),
      p('twitterprofilephoto', 'text', false, 'Twitter Profile Photo'),
      p('twitterhandle', 'text', false, 'Twitter Username'),
      p('website', 'text', false, 'Website URL'),
      p('hs_whatsapp_phone_number', 'text', false, 'WhatsApp Phone Number'),
      p('work_email', 'text', false, 'Work Email')
    ]),
    // hubspotcrm:CreateOrUpdateContact (1 uses in new blueprints)
    m('hubspotcrm:CreateOrUpdateContact', 'Create Or Update Contact', 'HubSpot CRM', 'action',
      'Perform Create Or Update Contact in HubSpot CRM',
      [
      p('properties', 'collection', true, 'Properties')
    ]),
    // hubspotcrm:WatchUpdatedRecords (1 uses in new blueprints)
    m('hubspotcrm:WatchUpdatedRecords', 'Watch Updated Records', 'HubSpot CRM', 'trigger',
      'Watch for Watch Updated Records in HubSpot CRM',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('objectType', 'select', true, 'Record Type'),
      p('limit', 'number', true, 'Limit'),
      p('searchType', 'select', true, 'Search Category')
    ]),
    // hubspotcrm:FetchRecord (1 uses in new blueprints)
    m('hubspotcrm:FetchRecord', 'Fetch Record', 'HubSpot CRM', 'action',
      'Perform Fetch Record in HubSpot CRM',
      [
      p('objectType', 'select', true, 'Record type'),
      p('searchType', 'select', true, 'Search type'),
      p('email', 'email', true, 'Email')
    ]),
    // hubspotcrm:CreateEngagement (1 uses in new blueprints)
    m('hubspotcrm:CreateEngagement', 'Create Engagement', 'HubSpot CRM', 'action',
      'Perform Create Engagement in HubSpot CRM',
      [
      p('active', 'boolean', true, 'Is active?'),
      p('type', 'select', true, 'Type'),
      p('ownerId', 'select', false, 'Owner Id'),
      p('uid', 'text', false, 'UID'),
      p('portalId', 'text', false, 'Portal ID'),
      p('associatedContactIDs', 'array', false, 'Associated contacts'),
      p('associatedCompanyIDs', 'array', false, 'Associated companies'),
      p('associatedDealIDs', 'array', false, 'Associated deals'),
      p('attachments', 'array', false, 'Attachments'),
      p('metadata', 'collection', false, 'Metadata')
    ]),

    // --- Instagram Business ---
    // instagram-business:CreatePostPhoto (2 uses in new blueprints)
    m('instagram-business:CreatePostPhoto', 'Create Post Photo', 'Instagram Business', 'action',
      'Perform Create Post Photo in Instagram Business',
      [
      p('accountId', 'select', true, 'Page'),
      p('image_url', 'url', true, 'Photo URL'),
      p('caption', 'text', false, 'Caption'),
      p('user_tags', 'array', false, 'User Tags'),
      p('location_id', 'text', false, 'Location ID')
    ]),
    // instagram-business:NewComment (1 uses in new blueprints)
    m('instagram-business:NewComment', 'New Comment', 'Instagram Business', 'action',
      'Perform New Comment in Instagram Business',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // instagram-business:CreateComment (1 uses in new blueprints)
    m('instagram-business:CreateComment', 'Create Comment', 'Instagram Business', 'action',
      'Perform Create Comment in Instagram Business',
      [
      p('id', 'text', true, 'Comment ID'),
      p('message', 'text', true, 'Message')
    ]),

    // --- Instagram ---
    // instagram:WatchMedia (1 uses in new blueprints)
    m('instagram:WatchMedia', 'Watch Media', 'Instagram', 'trigger',
      'Watch for Watch Media in Instagram',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Jitbit ---
    // jitbit:triggerTicket (1 uses in new blueprints)
    m('jitbit:triggerTicket', 'trigger Ticket', 'Jitbit', 'trigger',
      'Watch for trigger Ticket in Jitbit',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Jotform ---
    // jotform:watchForSubmissions (2 uses in new blueprints)
    m('jotform:watchForSubmissions', 'watch For Submissions', 'Jotform', 'trigger',
      'Watch for watch For Submissions in Jotform',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),

    // --- KlickTipp ---
    // klicktipp:getAContact (2 uses in new blueprints)
    m('klicktipp:getAContact', 'get A Contact', 'KlickTipp', 'search',
      'Search/list get A Contact in KlickTipp',
      [
      p('identifierType', 'select', true, 'Identify Contact By'),
      p('subscriberid', 'number', true, 'Contact ID')
    ]),
    // klicktipp:listTags (2 uses in new blueprints)
    m('klicktipp:listTags', 'list Tags', 'KlickTipp', 'search',
      'Search/list list Tags in KlickTipp',
      [
      p('limit', 'number', false, 'Limit')
    ]),
    // klicktipp:watchEvent (1 uses in new blueprints)
    m('klicktipp:watchEvent', 'watch Event', 'KlickTipp', 'trigger',
      'Watch for watch Event in KlickTipp',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // klicktipp:updateContact (1 uses in new blueprints)
    m('klicktipp:updateContact', 'update Contact', 'KlickTipp', 'action',
      'Perform update Contact in KlickTipp',
      [
      p('identifierType', 'select', true, 'Identify Contact By'),
      p('newemail', 'email', false, 'New Email Address'),
      p('newsmsnumber', 'text', false, 'SMS Number'),
      p('dataFields', 'array', false, 'Data Fields'),
      p('subscriberid', 'number', true, 'Contact ID')
    ]),
    // klicktipp:addOrUpdateContact (1 uses in new blueprints)
    m('klicktipp:addOrUpdateContact', 'add Or Update Contact', 'KlickTipp', 'action',
      'Perform add Or Update Contact in KlickTipp',
      [
      p('email', 'email', false, 'Email Address'),
      p('smsnumber', 'text', false, 'SMS Number'),
      p('listid', 'select', false, 'Opt-in Process'),
      p('tagid', 'select', false, 'Tag'),
      p('dataFields', 'array', false, 'Data Fields')
    ]),

    // --- Koncile advanced ocr ---
    // koncile-advanced-ocr:PostDocument (1 uses in new blueprints)
    m('koncile-advanced-ocr:PostDocument', 'Post Document', 'Koncile advanced ocr', 'action',
      'Perform Post Document in Koncile advanced ocr',
      [
      p('filename', 'text', false, 'File Name'),
      p('file_data', 'text', false, 'File'),
      p('folder_id', 'select', false, 'Folder')
    ]),

    // --- Layerre ---
    // layerre:CreateVariant (1 uses in new blueprints)
    m('layerre:CreateVariant', 'Create Variant', 'Layerre', 'action',
      'Perform Create Variant in Layerre',
      [
      p('template_id', 'text', true, 'Template ID'),
      p('width', 'number', false, 'Width'),
      p('height', 'number', false, 'Height'),
      p('export_type', 'select', false, 'Export Type'),
      p('overrides', 'array', false, 'Layer Overrides')
    ]),

    // --- Leonardo AI ---
    // leonardo-ai:generateImage (1 uses in new blueprints)
    m('leonardo-ai:generateImage', 'generate Image', 'Leonardo AI', 'action',
      'Perform generate Image in Leonardo AI',
      [
      p('prompt', 'text', true, 'Prompt'),
      p('modelId', 'select', false, 'Model'),
      p('num_images', 'number', false, 'Number of images to generate'),
      p('source', 'select', false, 'Source'),
      p('public', 'boolean', false, 'Public'),
      p('height', 'number', false, 'Height'),
      p('width', 'number', false, 'Width'),
      p('unzoom', 'boolean', false, 'Unzoom'),
      p('alchemy', 'boolean', false, 'Alchemy'),
      p('promptMagic', 'boolean', false, 'Prompt Magic'),
      p('controlnets', 'array', false, 'ControlNets'),
      p('presetStyle', 'select', false, 'Preset style'),
      p('guidance_scale', 'number', false, 'Guidance scale'),
      p('weighting', 'number', false, 'Weighting'),
      p('init_strength', 'number', false, 'Init strength'),
      p('nsfw', 'boolean', false, 'NSFW'),
      p('tiling', 'boolean', false, 'Tiling'),
      p('num_inference_steps', 'number', false, 'Number of inference steps'),
      p('sd_version', 'select', false, 'SD version'),
      p('imagePrompts', 'array', false, 'Image prompts'),
      p('imagePromptWeight', 'number', false, 'Image prompt weight'),
      p('scheduler', 'select', false, 'Scheduler'),
      p('seed', 'number', false, 'Seed'),
      p('negative_prompt', 'text', false, 'Negative prompt'),
      p('upscaleRatio', 'number', false, 'Upscale ratio'),
      p('transparency', 'select', false, 'Transparency')
    ]),

    // --- LionDesk ---
    // liondesk:submitContact (1 uses in new blueprints)
    m('liondesk:submitContact', 'submit Contact', 'LionDesk', 'action',
      'Perform submit Contact in LionDesk',
      [
      p('assigned_user_id', 'number', false, 'Assigned User Id'),
      p('first_name', 'text', false, 'First Name'),
      p('last_name', 'text', false, 'Last Name'),
      p('email', 'email', false, 'Email'),
      p('secondary_email', 'email', false, 'Secondary Email'),
      p('mobile_phone', 'text', false, 'Mobile Phone'),
      p('home_phone', 'text', false, 'Home Phone'),
      p('office_phone', 'text', false, 'Office Phone'),
      p('fax', 'text', false, 'Fax'),
      p('company', 'text', false, 'Company'),
      p('birthday', 'text', false, 'Birthday'),
      p('anniversary', 'text', false, 'Anniversary'),
      p('spouse_name', 'text', false, 'Spouse Name'),
      p('spouse_email', 'email', false, 'Spouse Email'),
      p('spouse_phone', 'text', false, 'Spouse Phone'),
      p('spouse_birthday', 'text', false, 'Spouse Birthday'),
      p('tags', 'select', false, 'Tags'),
      p('status', 'select', false, 'Status'),
      p('created_at', 'date', false, 'Created At'),
      p('modified_at', 'date', false, 'Modified At'),
      p('hotness_id', 'select', false, 'Hotness ID'),
      p('source_id', 'select', false, 'Source ID')
    ]),

    // --- Loyverse ---
    // loyverse:watchReceipts (2 uses in new blueprints)
    m('loyverse:watchReceipts', 'watch Receipts', 'Loyverse', 'trigger',
      'Watch for watch Receipts in Loyverse',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('event', 'select', true, 'Event type'),
      p('store_id', 'select', false, 'Store ID'),
      p('limit', 'number', true, 'Limit')
    ]),
    // loyverse:getCustomer (2 uses in new blueprints)
    m('loyverse:getCustomer', 'get Customer', 'Loyverse', 'search',
      'Search/list get Customer in Loyverse',
      [
      p('id', 'select', true, 'Customer ID')
    ]),
    // loyverse:getStore (2 uses in new blueprints)
    m('loyverse:getStore', 'get Store', 'Loyverse', 'search',
      'Search/list get Store in Loyverse',
      [
      p('store_id', 'select', true, 'Store ID')
    ]),
    // loyverse:getEmployee (1 uses in new blueprints)
    m('loyverse:getEmployee', 'get Employee', 'Loyverse', 'search',
      'Search/list get Employee in Loyverse',
      [
      p('employee_id', 'select', true, 'Employee ID')
    ]),

    // --- MailboxValidator ---
    // mailboxvalidator:singleEmail (1 uses in new blueprints)
    m('mailboxvalidator:singleEmail', 'single Email', 'MailboxValidator', 'action',
      'Perform single Email in MailboxValidator',
      [
      p('email', 'email', true, 'Email')
    ]),

    // --- Mailchimp ---
    // mailchimp:watchSubscribers (1 uses in new blueprints)
    m('mailchimp:watchSubscribers', 'watch Subscribers', 'Mailchimp', 'trigger',
      'Watch for watch Subscribers in Mailchimp',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('select', 'select', true, 'Watch Subscibers'),
      p('list', 'select', true, 'List ID'),
      p('status', 'select', false, 'Status'),
      p('vip_only', 'boolean', true, 'VIP only'),
      p('email_type', 'select', false, 'Email Type'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- MaintainX ---
    // maintainx:TriggerWatchWorkOrders (1 uses in new blueprints)
    m('maintainx:TriggerWatchWorkOrders', 'Trigger Watch Work Orders', 'MaintainX', 'trigger',
      'Watch for Trigger Watch Work Orders in MaintainX',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- ManyChat ---
    // manychat:ManyChatWebhook (1 uses in new blueprints)
    m('manychat:ManyChatWebhook', 'Many Chat Webhook', 'ManyChat', 'trigger',
      'Watch for Many Chat Webhook in ManyChat',
      []),

    // --- Math ---
    // math:EvaluateExpression (1 uses in new blueprints)
    m('math:EvaluateExpression', 'Evaluate Expression', 'Math', 'action',
      'Perform Evaluate Expression in Math',
      [
      p('expression', 'text', true, 'Expression')
    ]),

    // --- MessageBird ---
    // message-bird:SendSMS (1 uses in new blueprints)
    m('message-bird:SendSMS', 'Send S M S', 'MessageBird', 'action',
      'Perform Send S M S in MessageBird',
      [
      p('recipients', 'array', true, 'Recipients'),
      p('originator', 'text', true, 'Originator'),
      p('body', 'text', true, 'Body'),
      p('reference', 'text', false, 'Reference'),
      p('reportUrl', 'url', false, 'Report URL')
    ]),

    // --- Mindee ---
    // mindee:enqueueAndGetInference (1 uses in new blueprints)
    m('mindee:enqueueAndGetInference', 'enqueue And Get Inference', 'Mindee', 'search',
      'Search/list enqueue And Get Inference in Mindee',
      [
      p('model_id', 'text', true, 'Model ID'),
      p('file_name', 'text', true, 'Name'),
      p('file_data', 'text', true, 'Data'),
      p('raw_text', 'boolean', false, 'Enable Raw Text'),
      p('rag', 'boolean', false, 'Enable RAG'),
      p('polygon', 'boolean', false, 'Enable Polygons'),
      p('confidence', 'boolean', false, 'Enable Confidence Score'),
      p('webhook_ids', 'array', false, 'Webhook IDs'),
      p('polling_timeout', 'number', true, 'Maximum Timeout Delay')
    ]),

    // --- Mitto SMS ---
    // mitto-sms:sendSMS (1 uses in new blueprints)
    m('mitto-sms:sendSMS', 'send S M S', 'Mitto SMS', 'action',
      'Perform send S M S in Mitto SMS',
      [
      p('from', 'text', true, 'From'),
      p('to', 'text', true, 'To'),
      p('text', 'text', true, 'Text')
    ]),

    // --- Mollie ---
    // mollie:universal (1 uses in new blueprints)
    m('mollie:universal', 'universal', 'Mollie', 'action',
      'Perform universal in Mollie',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- Monday.com ---
    // monday:GetItem (2 uses in new blueprints)
    m('monday:GetItem', 'Get Item', 'Monday.com', 'search',
      'Search/list Get Item in Monday.com',
      [
      p('id', 'number', true, 'ID'),
      p('showParentItem', 'boolean', true, 'Show Parent Item'),
      p('showSubitems', 'boolean', true, 'Show Subitems'),
      p('boardId', 'select', false, 'Board ID')
    ]),
    // monday:watchBoardColumnValues (1 uses in new blueprints)
    m('monday:watchBoardColumnValues', 'watch Board Column Values', 'Monday.com', 'trigger',
      'Watch for watch Board Column Values in Monday.com',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // monday:ChangeMultipleColumnValues (1 uses in new blueprints)
    m('monday:ChangeMultipleColumnValues', 'Change Multiple Column Values', 'Monday.com', 'action',
      'Perform Change Multiple Column Values in Monday.com',
      [
      p('boardId', 'select', true, 'Board ID'),
      p('create_labels_if_missing', 'boolean', true, 'Create Labels if Missing'),
      p('itemId', 'select', true, 'Item ID'),
      p('columnValuesToChange', 'array', true, 'Column Values to Change')
    ]),

    // --- Notion ---
    // notion:createAPage (3 uses in new blueprints)
    m('notion:createAPage', 'create A Page', 'Notion', 'action',
      'Perform create A Page in Notion',
      [
      p('select', 'select', true, 'Enter a Database ID'),
      p('database', 'text', true, 'Database ID'),
      p('fields', 'collection', false, 'Fields')
    ]),
    // notion:createAPage1 (1 uses in new blueprints)
    m('notion:createAPage1', 'create A Page1', 'Notion', 'action',
      'Perform create A Page1 in Notion',
      [
      p('select', 'select', true, 'Create a Page'),
      p('content', 'text', true, 'Title'),
      p('objects', 'array', false, 'Content Objects'),
      p('emoji', 'text', false, 'Emoji Icon'),
      p('cover', 'url', false, 'Cover URL link'),
      p('select1', 'select', true, 'Get a Database Item'),
      p('page', 'text', true, 'Database Item ID')
    ]),

    // --- Obras Online ---
    // obras-online:apiCall (1 uses in new blueprints)
    m('obras-online:apiCall', 'api Call', 'Obras Online', 'action',
      'Perform api Call in Obras Online',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- OneCRM ---
    // onecrm:NewEvent (2 uses in new blueprints)
    m('onecrm:NewEvent', 'New Event', 'OneCRM', 'action',
      'Perform New Event in OneCRM',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook'),
      p('mode', 'select', false, 'Returned data')
    ]),
    // onecrm:GetObject (2 uses in new blueprints)
    m('onecrm:GetObject', 'Get Object', 'OneCRM', 'search',
      'Search/list Get Object in OneCRM',
      [
      p('model', 'select', true, 'Module'),
      p('id', 'text', true, 'Record ID'),
      p('mode', 'select', false, 'Returned data')
    ]),
    // onecrm:SearchObjects (1 uses in new blueprints)
    m('onecrm:SearchObjects', 'Search Objects', 'OneCRM', 'search',
      'Search/list Search Objects in OneCRM',
      [
      p('model', 'select', true, 'Module'),
      p('limit', 'number', true, 'Limit'),
      p('mode', 'select', false, 'Returned data'),
      p('fields', 'select', false, 'Fields'),
      p('filter_text', 'text', false, 'Filter text'),
      p('order', 'select', false, 'Sort order'),
      p('favorites.deleted', 'boolean', false, 'Only Favorites'),
      p('primary_account', 'text', false, 'Primary Account'),
      p('first_name', 'text', false, 'First Name'),
      p('last_name', 'text', false, 'Last Name'),
      p('categories', 'text', false, 'Category'),
      p('lead_source', 'select', false, 'Lead Source'),
      p('do_not_call', 'boolean', false, 'Do Not Call'),
      p('assistant', 'text', false, 'Assistant'),
      p('email_opt_out', 'boolean', false, 'Email Opt Out'),
      p('title', 'text', false, 'Title'),
      p('business_role', 'select', false, 'Business Role')
    ]),
    // onecrm:CreateObject (1 uses in new blueprints)
    m('onecrm:CreateObject', 'Create Object', 'OneCRM', 'action',
      'Perform Create Object in OneCRM',
      [
      p('model', 'select', true, 'Module'),
      p('assigned_user_id', 'text', true, 'Assigned to (assigned_user_id)'),
      p('name', 'text', false, 'Name'),
      p('converted', 'boolean', true, 'Converted'),
      p('categories', 'text', false, 'Category (categories)'),
      p('category', 'select', false, 'Category (category)'),
      p('category2', 'select', false, 'Category (category2)'),
      p('category3', 'select', false, 'Category (category3)'),
      p('category4', 'select', false, 'Category (category4)'),
      p('category5', 'select', false, 'Category (category5)'),
      p('category6', 'select', false, 'Category (category6)'),
      p('category7', 'select', false, 'Category (category7)'),
      p('category8', 'select', false, 'Category (category8)'),
      p('category9', 'select', false, 'Category (category9)'),
      p('category10', 'select', false, 'Category (category10)'),
      p('temperature', 'select', false, 'Temperature'),
      p('salutation', 'select', false, 'Salutation'),
      p('first_name', 'text', false, 'First Name'),
      p('last_name', 'text', false, 'Last Name'),
      p('title', 'text', false, 'Title'),
      p('refered_by', 'text', false, 'Referred By'),
      p('lead_source', 'select', false, 'Lead Source'),
      p('lead_source_description', 'text', false, 'Lead Source Description'),
      p('status', 'select', true, 'Status'),
      p('status_description', 'text', false, 'Status Description'),
      p('department', 'text', false, 'Department'),
      p('reports_to_id', 'text', false, 'Reports To (reports_to_id)'),
      p('do_not_call', 'boolean', false, 'Do Not Call'),
      p('phone_home', 'text', false, 'Home Phone'),
      p('phone_mobile', 'text', false, 'Mobile'),
      p('phone_work', 'text', false, 'Office Phone'),
      p('phone_other', 'text', false, 'Other Phone'),
      p('phone_fax', 'text', false, 'Fax Number'),
      p('skype_id', 'text', false, 'Skype ID'),
      p('email1', 'text', false, 'Email'),
      p('email2', 'text', false, 'Other Email'),
      p('email_opt_out', 'boolean', false, 'Email Opt Out'),
      p('email_opt_in', 'boolean', false, 'Email Opt In'),
      p('website', 'url', false, 'Website'),
      p('primary_address_street', 'text', false, 'Primary Address Street'),
      p('primary_address_city', 'text', false, 'Primary Address City'),
      p('primary_address_state', 'text', false, 'Primary Address State'),
      p('primary_address_postalcode', 'text', false, 'Primary Address Postalcode'),
      p('primary_address_country', 'text', false, 'Primary Address Country'),
      p('primary_address_statecode', 'text', false, 'Primary Address State Code'),
      p('primary_address_countrycode', 'text', false, 'Primary Address Country Code'),
      p('alt_address_street', 'text', false, 'Alt Address Street'),
      p('alt_address_city', 'text', false, 'Alt Address City'),
      p('alt_address_state', 'text', false, 'Alt Address State'),
      p('alt_address_postalcode', 'text', false, 'Alt Address Postalcode'),
      p('alt_address_country', 'text', false, 'Alt Address Country'),
      p('alt_address_statecode', 'text', false, 'Alternate Address State Code'),
      p('alt_address_countrycode', 'text', false, 'Alternate Address Country Code'),
      p('description', 'text', false, 'Description'),
      p('account_name', 'text', false, 'Account Name'),
      p('account_description', 'text', false, 'Account Description'),
      p('contact_id', 'text', false, 'Converted Contact (contact_id)'),
      p('campaign_id', 'text', false, 'Campaign (campaign_id)'),
      p('portal_active', 'boolean', false, 'Portal Active'),
      p('portal_name', 'text', false, 'Portal Name'),
      p('portal_app', 'text', false, 'Portal Application'),
      p('invalid_email', 'boolean', false, 'Invalid Email'),
      p('partner_id', 'text', false, 'Via Partner (partner_id)'),
      p('date_converted', 'date', false, 'Date Converted'),
      p('photo', 'text', false, 'Photo'),
      p('photo_filename', 'text', false, 'Photo Filename'),
      p('photo_thumb', 'text', false, 'Thumbnail Filename'),
      p('consent_to_process', 'boolean', false, 'Consent To Process'),
      p('livechat_activity', 'boolean', false, 'Live Chat Activity'),
      p('mautic_id', 'number', false, 'Lead Guerrilla Contact ID'),
      p('chat_activity', 'boolean', false, 'Chat Activity'),
      p('personal_info_source', 'text', false, 'Personal Information Source')
    ]),

    // --- OneDrive ---
    // onedrive:uploadAFile (3 uses in new blueprints)
    m('onedrive:uploadAFile', 'upload A File', 'OneDrive', 'action',
      'Perform upload A File in OneDrive',
      [
      p('enter', 'select', true, 'Enter (Folder Location ID & Path)'),
      p('filename', 'text', true, 'File Name'),
      p('data', 'text', true, 'Data'),
      p('conflictBehavior', 'select', true, 'If the File with the Same Name Exists'),
      p('description', 'text', false, 'Description'),
      p('select', 'select', true, 'Choose your OneDrive location'),
      p('select1', 'select', true, 'Enable to Enter a Drive ID'),
      p('folder', 'text', false, 'Folder')
    ]),
    // onedrive:downloadAFile (1 uses in new blueprints)
    m('onedrive:downloadAFile', 'download A File', 'OneDrive', 'action',
      'Perform download A File in OneDrive',
      [
      p('enter', 'select', true, 'Enter (File ID & File Path)'),
      p('format', 'boolean', true, 'Convert to PDF'),
      p('choose', 'select', true, 'Enter a File ID'),
      p('select', 'select', true, 'Choose your OneDrive location'),
      p('select1', 'select', true, 'Enable to Enter a Drive ID'),
      p('file', 'text', true, 'File')
    ]),

    // --- OpenAI (ChatGPT) ---
    // openai-gpt-3:messageAssistantAdvanced (4 uses in new blueprints)
    m('openai-gpt-3:messageAssistantAdvanced', 'message Assistant Advanced', 'OpenAI (ChatGPT)', 'action',
      'Perform message Assistant Advanced in OpenAI (ChatGPT)',
      [
      p('assistantId', 'select', true, 'Assistant'),
      p('role', 'select', true, 'Role'),
      p('threadId', 'text', false, 'Thread ID'),
      p('model', 'select', false, 'Model'),
      p('tools', 'select', false, 'Tools'),
      p('file_search_resources', 'select', false, 'File Search Resources'),
      p('code_interpreter_resources', 'select', false, 'Code Interpreter Resources'),
      p('tool_choice', 'select', false, 'Tool Choice'),
      p('instructions', 'text', false, 'Instructions'),
      p('max_prompt_tokens', 'number', false, 'Max Prompt Tokens'),
      p('max_completion_tokens', 'number', false, 'Max Completion Tokens'),
      p('temperature', 'number', false, 'Temperature'),
      p('top_p', 'number', false, 'Top P'),
      p('response_format', 'select', false, 'Response Format'),
      p('truncation_strategy', 'select', false, 'Truncation Strategy'),
      p('message', 'text', true, 'Message'),
      p('image_files', 'select', false, 'Image Files'),
      p('image_urls', 'array', false, 'Image URLs')
    ]),
    // openai-gpt-3:generateAnAudio (2 uses in new blueprints)
    m('openai-gpt-3:generateAnAudio', 'generate An Audio', 'OpenAI (ChatGPT)', 'action',
      'Perform generate An Audio in OpenAI (ChatGPT)',
      [
      p('input', 'text', true, 'Input'),
      p('model', 'select', true, 'Model'),
      p('voice', 'select', false, 'Voice'),
      p('outputFilename', 'text', false, 'Output Filename'),
      p('response_format', 'select', false, 'Response Format'),
      p('speed', 'number', false, 'Speed'),
      p('instructions', 'text', false, 'Instructions')
    ]),
    // openai-gpt-3:askAnything (1 uses in new blueprints)
    m('openai-gpt-3:askAnything', 'ask Anything', 'OpenAI (ChatGPT)', 'action',
      'Perform ask Anything in OpenAI (ChatGPT)',
      [
      p('model', 'select', true, 'Model'),
      p('textPrompt', 'text', true, 'Text prompt')
    ]),
    // openai-gpt-3:GenerateImage (1 uses in new blueprints)
    m('openai-gpt-3:GenerateImage', 'Generate Image', 'OpenAI (ChatGPT)', 'action',
      'Perform Generate Image in OpenAI (ChatGPT)',
      [
      p('model', 'select', true, 'Model'),
      p('prompt', 'text', true, 'Prompt'),
      p('size', 'select', false, 'Size'),
      p('quality', 'select', false, 'Quality'),
      p('style', 'select', false, 'Style'),
      p('response_format', 'select', false, 'Response Format')
    ]),

    // --- ParseHub ---
    // parsehub:getALastReadyData (1 uses in new blueprints)
    m('parsehub:getALastReadyData', 'get A Last Ready Data', 'ParseHub', 'search',
      'Search/list get A Last Ready Data in ParseHub',
      [
      p('project', 'select', true, 'Project Token'),
      p('format', 'select', true, 'Format')
    ]),

    // --- Perplexity AI ---
    // perplexity-ai:createAChatCompletion (6 uses in new blueprints)
    m('perplexity-ai:createAChatCompletion', 'create A Chat Completion', 'Perplexity AI', 'action',
      'Perform create A Chat Completion in Perplexity AI',
      [
      p('model', 'select', true, 'Model'),
      p('messages', 'array', true, 'Messages'),
      p('max_tokens', 'number', false, 'Max Tokens'),
      p('temperature', 'number', false, 'Temperature'),
      p('web_search_options', 'collection', false, 'Web Search Options'),
      p('top_p', 'number', false, 'Top P'),
      p('top_k', 'number', false, 'Top K'),
      p('presence_penalty', 'number', false, 'Presence Penalty'),
      p('frequency_penalty', 'number', false, 'Frequency Penalty'),
      p('search_domain_filter', 'array', false, 'Search Domain Filter'),
      p('search_recency_filter', 'select', false, 'Search Recency Filter'),
      p('return_images', 'boolean', false, 'Return Images'),
      p('return_related_questions', 'boolean', false, 'Return Related Questions')
    ]),

    // --- PhantomBuster ---
    // phantombuster:watchAnOutput (1 uses in new blueprints)
    m('phantombuster:watchAnOutput', 'watch An Output', 'PhantomBuster', 'trigger',
      'Watch for watch An Output in PhantomBuster',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('phantom', 'select', true, 'Phantom ID')
    ]),

    // --- Phonenumber ---
    // phonenumber:TransformerParseNumber (2 uses in new blueprints)
    m('phonenumber:TransformerParseNumber', 'Transformer Parse Number', 'Phonenumber', 'action',
      'Perform Transformer Parse Number in Phonenumber',
      [
      p('number', 'text', true, 'Phone number'),
      p('defaultCountry', 'select', true, 'Default country for parsing')
    ]),

    // --- Pipedrive ---
    // pipedrive:WatchPersons (1 uses in new blueprints)
    m('pipedrive:WatchPersons', 'Watch Persons', 'Pipedrive', 'trigger',
      'Watch for Watch Persons in Pipedrive',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('filter_id', 'select', false, 'Filter'),
      p('user_id', 'select', false, 'User'),
      p('limit', 'number', true, 'Limit'),
      p('triggerOn', 'select', true, 'Trigger when')
    ]),
    // pipedrive:FindPersonByName (1 uses in new blueprints)
    m('pipedrive:FindPersonByName', 'Find Person By Name', 'Pipedrive', 'search',
      'Search/list Find Person By Name in Pipedrive',
      [
      p('term', 'text', true, 'Term'),
      p('org_id', 'number', false, 'Organization'),
      p('search_by_email', 'boolean', false, 'Search by email')
    ]),
    // pipedrive:CreatePerson (1 uses in new blueprints)
    m('pipedrive:CreatePerson', 'Create Person', 'Pipedrive', 'action',
      'Perform Create Person in Pipedrive',
      [
      p('name', 'text', true, 'Name'),
      p('owner_id', 'number', false, 'Owner'),
      p('org_id', 'number', false, 'Organization'),
      p('email', 'array', false, 'Emails'),
      p('phone', 'array', false, 'Phones'),
      p('add_time', 'date', false, 'Add time'),
      p('visible_to', 'select', false, 'Visible to'),
      p('3c3ad55478d144a1812ee5aeb682b563a9b4c769', 'select', false, 'submitted_typeform'),
      p('1ec88326415a3d004d13278872eb6fe66b9cdf23', 'text', false, 'airtable_link'),
      p('f7b917d9c2270260dbce2875fd55ff8ceff786d5', 'select', false, 'Test')
    ]),

    // --- Plumsail documents ---
    // plumsail-documents:applyDocxTemplate (2 uses in new blueprints)
    m('plumsail-documents:applyDocxTemplate', 'apply Docx Template', 'Plumsail documents', 'action',
      'Perform apply Docx Template in Plumsail documents',
      [
      p('filename', 'text', true, 'Name'),
      p('filedata', 'text', true, 'Data'),
      p('data', 'text', true, 'Template data'),
      p('outputType', 'select', true, 'Output Type'),
      p('locale', 'select', false, 'Locale'),
      p('timezone', 'select', false, 'Timezone'),
      p('engine', 'select', false, 'Template engine')
    ]),
    // plumsail-documents:convertDocxToPdf (2 uses in new blueprints)
    m('plumsail-documents:convertDocxToPdf', 'convert Docx To Pdf', 'Plumsail documents', 'action',
      'Perform convert Docx To Pdf in Plumsail documents',
      [
      p('filename', 'text', true, 'Name'),
      p('filedata', 'text', true, 'Data')
    ]),

    // --- Podio ---
    // podio:ActionFilterItems (1 uses in new blueprints)
    m('podio:ActionFilterItems', 'Action Filter Items', 'Podio', 'action',
      'Perform Action Filter Items in Podio',
      [
      p('sort_by', 'select', true, 'Sort by'),
      p('sort_descending', 'boolean', false, 'Sort descending'),
      p('filters', 'array', false, 'Filters')
    ]),

    // --- Predict Leads ---
    // predict-leads-app:retrieveCompaniesUsingSpecificTechnology (1 uses in new blueprints)
    m('predict-leads-app:retrieveCompaniesUsingSpecificTechnology', 'retrieve Companies Using Specific Technology', 'Predict Leads', 'action',
      'Perform retrieve Companies Using Specific Technology in Predict Leads',
      [
      p('id_or_fuzzy_name', 'text', true, 'Id Or Fuzzy Name'),
      p('first_seen_at_from', 'date', false, 'First Seen At From'),
      p('first_seen_at_until', 'date', false, 'First Seen At Until'),
      p('last_seen_at_from', 'date', false, 'Last Seen At From'),
      p('last_seen_at_until', 'date', false, 'Last Seen At Until'),
      p('limit', 'number', false, 'Limit')
    ]),
    // predict-leads-app:retrieveCompany (1 uses in new blueprints)
    m('predict-leads-app:retrieveCompany', 'retrieve Company', 'Predict Leads', 'action',
      'Perform retrieve Company in Predict Leads',
      [
      p('id_or_domain', 'text', true, 'Id Or Domain')
    ]),

    // --- Prestashop ---
    // prestashop:watchOrders (1 uses in new blueprints)
    m('prestashop:watchOrders', 'watch Orders', 'Prestashop', 'trigger',
      'Watch for watch Orders in Prestashop',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('type', 'select', true, 'Watch for'),
      p('current_state', 'select', false, 'Order State'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Productboard ---
    // productboard:newFeature (1 uses in new blueprints)
    m('productboard:newFeature', 'new Feature', 'Productboard', 'action',
      'Perform new Feature in Productboard',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // productboard:getFeature (1 uses in new blueprints)
    m('productboard:getFeature', 'get Feature', 'Productboard', 'search',
      'Search/list get Feature in Productboard',
      [
      p('id', 'select', true, 'Feature ID')
    ]),

    // --- Questionpro ---
    // questionpro:SendBatch (1 uses in new blueprints)
    m('questionpro:SendBatch', 'Send Batch', 'Questionpro', 'action',
      'Perform Send Batch in Questionpro',
      [
      p('userID', 'select', true, 'User ID'),
      p('surveyID', 'select', true, 'Survey ID'),
      p('mode', 'select', true, 'Mode'),
      p('emails', 'array', true, 'Emails'),
      p('emailTemplate', 'collection', false, 'Email Template')
    ]),

    // --- QuickBooks ---
    // quickbooks:SearchForCustomers (2 uses in new blueprints)
    m('quickbooks:SearchForCustomers', 'Search For Customers', 'QuickBooks', 'search',
      'Search/list Search For Customers in QuickBooks',
      [
      p('type', 'select', true, 'Search by'),
      p('filter', 'text', false, 'Filter'),
      p('limit', 'number', true, 'Limit')
    ]),
    // quickbooks:SearchForEstimates (1 uses in new blueprints)
    m('quickbooks:SearchForEstimates', 'Search For Estimates', 'QuickBooks', 'search',
      'Search/list Search For Estimates in QuickBooks',
      [
      p('type', 'select', true, 'Search by'),
      p('filter', 'text', false, 'Filter'),
      p('limit', 'number', true, 'Limit')
    ]),
    // quickbooks:GetEstimate (1 uses in new blueprints)
    m('quickbooks:GetEstimate', 'Get Estimate', 'QuickBooks', 'search',
      'Search/list Get Estimate in QuickBooks',
      [
      p('id', 'number', true, 'Estimate ID')
    ]),

    // --- RAYNET CRM ---
    // raynet-crm-v2:listLead (1 uses in new blueprints)
    m('raynet-crm-v2:listLead', 'list Lead', 'RAYNET CRM', 'search',
      'Search/list list Lead in RAYNET CRM',
      [
      p('limit', 'number', true, 'Limit'),
      p('offset', 'number', false, 'Offset'),
      p('sortColumn', 'select', false, 'Sort column'),
      p('sortDirection', 'select', false, 'Sort direction'),
      p('fulltext', 'text', false, 'Full-text search'),
      p('_filters', 'text', false, 'Filter with an operator'),
      p('owner', 'select', false, 'Filter by owner'),
      p('_status', 'array', false, 'Filter by status'),
      p('gdprTemplate[CUSTOM]', 'select', false, 'Filter by legal title'),
      p('withoutGdpr[CUSTOM]', 'select', false, 'Filter records that do not have a valid legal title'),
      p('view', 'select', false, 'View'),
      p('tags', 'text', false, 'Filter by tags')
    ]),

    // --- RSS ---
    // rss:TriggerNewArticle (4 uses in new blueprints)
    m('rss:TriggerNewArticle', 'Trigger New Article', 'RSS', 'trigger',
      'Watch for Trigger New Article in RSS',
      [
      p('url', 'url', false, 'URL'),
      p('maxResults', 'number', false, 'Maximum number of returned items'),
      p('username', 'text', false, 'User name'),
      p('password', 'text', false, 'Password'),
      p('include', 'select', false, 'Process RSS fields'),
      p('gzip', 'boolean', false, 'Request compressed content')
    ]),
    // rss:ActionReadArticles (1 uses in new blueprints)
    m('rss:ActionReadArticles', 'Action Read Articles', 'RSS', 'action',
      'Perform Action Read Articles in RSS',
      []),

    // --- Rebrandly ---
    // rebrandly:newclick (2 uses in new blueprints)
    m('rebrandly:newclick', 'newclick', 'Rebrandly', 'action',
      'Perform newclick in Rebrandly',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('workspace', 'select', false, 'Workspace'),
      p('domain.id', 'array', false, 'Filter by domain ID'),
      p('domain.fullName', 'text', false, 'Filter by domain name'),
      p('slashtag', 'text', false, 'Filter by slashtag'),
      p('creator.id', 'array', false, 'Filter by creator ID'),
      p('favourite', 'boolean', false, 'Favourite only'),
      p('limit', 'number', false, 'Limit')
    ]),

    // --- RegExp ---
    // regexp:Replace (2 uses in new blueprints)
    m('regexp:Replace', 'Replace', 'RegExp', 'action',
      'Perform Replace in RegExp',
      [
      p('pattern', 'text', true, 'Pattern'),
      p('value', 'text', false, 'New value'),
      p('global', 'boolean', true, 'Global match'),
      p('sensitive', 'boolean', true, 'Case sensitive'),
      p('multiline', 'boolean', true, 'Multiline'),
      p('singleline', 'boolean', true, 'Singleline'),
      p('text', 'text', false, 'Text')
    ]),

    // --- Revolut ---
    // revolut:createDraftPayment (3 uses in new blueprints)
    m('revolut:createDraftPayment', 'create Draft Payment', 'Revolut', 'action',
      'Perform create Draft Payment in Revolut',
      [
      p('recipientBankCountry', 'select', true, 'Recipient Bank Country'),
      p('title', 'text', false, 'Draft Payment Title'),
      p('scheduledDate', 'date', false, 'Execution Date'),
      p('currency', 'select', true, 'Currency'),
      p('transfers', 'array', true, 'Transfers')
    ]),

    // --- RingCentral ---
    // ringcentral:watchCalls (1 uses in new blueprints)
    m('ringcentral:watchCalls', 'watch Calls', 'RingCentral', 'trigger',
      'Watch for watch Calls in RingCentral',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit'),
      p('type', 'select', false, 'Type'),
      p('companyId', 'select', true, 'Account/Company ID')
    ]),

    // --- Rws language cloud ---
    // rws-language-cloud:filesUploadFile (1 uses in new blueprints)
    m('rws-language-cloud:filesUploadFile', 'files Upload File', 'Rws language cloud', 'action',
      'Perform files Upload File in Rws language cloud',
      [
      p('projectOptionsId', 'select', true, 'Project Options ID'),
      p('file_name', 'text', true, 'Name'),
      p('file_data', 'text', true, 'Data')
    ]),
    // rws-language-cloud:projectsCreate (1 uses in new blueprints)
    m('rws-language-cloud:projectsCreate', 'projects Create', 'Rws language cloud', 'action',
      'Perform projects Create in Rws language cloud',
      [
      p('Name', 'text', true, 'Name'),
      p('projectOptionsId', 'select', true, 'Project Options ID'),
      p('SrcLang', 'text', true, 'Source Language'),
      p('Files', 'array', true, 'Files'),
      p('Description', 'text', false, 'Description'),
      p('DueDate', 'date', false, 'Due Date'),
      p('ProjectGroupId', 'text', false, 'Project Group ID'),
      p('Metadata', 'array', false, 'Metadata'),
      p('ScopeOptionId', 'text', false, 'Format'),
      p('TmSequenceId', 'text', false, 'TM Sequence ID'),
      p('Vendors', 'text', false, 'Vendor ID')
    ]),

    // --- Sage Accounting ---
    // sage-accounting:SearchCustomers (1 uses in new blueprints)
    m('sage-accounting:SearchCustomers', 'Search Customers', 'Sage Accounting', 'search',
      'Search/list Search Customers in Sage Accounting',
      [
      p('business_id', 'select', true, 'Current Business ID'),
      p('limit', 'number', false, 'Limit'),
      p('updated_or_created_since', 'date', false, 'Updated or Created since'),
      p('deleted_since', 'date', false, 'Deleted since'),
      p('exclude_system', 'boolean', false, 'Exclude System'),
      p('nested_attributes', 'text', false, 'Nested Attributes'),
      p('show_balance', 'boolean', false, 'Show Balance'),
      p('context_date', 'date', false, 'Context Date'),
      p('search', 'text', false, 'Search'),
      p('email', 'email', false, 'Email'),
      p('show_unfinished_recurring_invoices_status', 'boolean', false, 'Show Unfinished Recurring Invoices Status'),
      p('attributes', 'text', false, 'Attributes')
    ]),

    // --- Salesflare ---
    // salesflare:findContact (1 uses in new blueprints)
    m('salesflare:findContact', 'find Contact', 'Salesflare', 'search',
      'Search/list find Contact in Salesflare',
      [
      p('id', 'select', false, 'Contact ID'),
      p('name', 'select', false, 'Name'),
      p('email', 'select', false, 'Email'),
      p('phone_number', 'select', false, 'Phone Number'),
      p('account', 'select', false, 'Account ID'),
      p('tag__name', 'select', false, 'Tag'),
      p('limit', 'number', false, 'Limit'),
      p('custom', 'collection', false, 'Custom Fields')
    ]),

    // --- Salesforce ---
    // salesforce:ActionQueryObject (2 uses in new blueprints)
    m('salesforce:ActionQueryObject', 'Action Query Object', 'Salesforce', 'action',
      'Perform Action Query Object in Salesforce',
      [
      p('queryType', 'select', true, 'Search type'),
      p('maxResults', 'number', true, 'Maximal count of records'),
      p('sObject', 'select', true, 'Type'),
      p('id', 'text', false, 'ID')
    ]),
    // salesforce:makeApiCall (1 uses in new blueprints)
    m('salesforce:makeApiCall', 'make Api Call', 'Salesforce', 'action',
      'Perform make Api Call in Salesforce',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- Salesloft ---
    // salesloft:watchRecords (1 uses in new blueprints)
    m('salesloft:watchRecords', 'watch Records', 'Salesloft', 'trigger',
      'Watch for watch Records in Salesloft',
      [
      p('__IMTHOOK__', 'text', false, 'Webhook')
    ]),

    // --- Scenario service ---
    // scenario-service:StartSubscenario (1 uses in new blueprints)
    m('scenario-service:StartSubscenario', 'Start Subscenario', 'Scenario service', 'action',
      'Perform Start Subscenario in Scenario service',
      []),

    // --- Sellsy ---
    // sellsy:createTask (3 uses in new blueprints)
    m('sellsy:createTask', 'create Task', 'Sellsy', 'action',
      'Perform create Task in Sellsy',
      [
      p('type', 'text', false, 'type'),
      p('task', 'collection', false, 'Task')
    ]),
    // sellsy:universal (1 uses in new blueprints)
    m('sellsy:universal', 'universal', 'Sellsy', 'action',
      'Perform universal in Sellsy',
      [
      p('url', 'text', true, 'URL'),
      p('method', 'select', true, 'Method'),
      p('headers', 'array', false, 'Headers'),
      p('qs', 'array', false, 'Query String'),
      p('body', 'text', false, 'Body')
    ]),

    // --- Shopify ---
    // shopify:WatchCustomers (1 uses in new blueprints)
    m('shopify:WatchCustomers', 'Watch Customers', 'Shopify', 'trigger',
      'Watch for Watch Customers in Shopify',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),
    // shopify:SearchForCustomers (1 uses in new blueprints)
    m('shopify:SearchForCustomers', 'Search For Customers', 'Shopify', 'search',
      'Search/list Search For Customers in Shopify',
      [
      p('query', 'text', false, 'Query'),
      p('limit', 'number', true, 'Limit')
    ]),
    // shopify:CreateArticle (1 uses in new blueprints)
    m('shopify:CreateArticle', 'Create Article', 'Shopify', 'action',
      'Perform Create Article in Shopify',
      [
      p('blog_id', 'select', true, 'Blog'),
      p('title', 'text', true, 'Title'),
      p('body_html', 'text', false, 'Body HTML'),
      p('template_suffix', 'text', false, 'Template suffix'),
      p('summary_html', 'text', false, 'Summary HTML'),
      p('author', 'text', false, 'Author'),
      p('handle', 'text', false, 'Handle'),
      p('published', 'boolean', true, 'Article is published'),
      p('published_at', 'date', false, 'Published at'),
      p('tags', 'array', false, 'Tags'),
      p('image', 'collection', false, 'Image')
    ]),
    // shopify:CreateProduct (1 uses in new blueprints)
    m('shopify:CreateProduct', 'Create Product', 'Shopify', 'action',
      'Perform Create Product in Shopify',
      [
      p('title', 'text', true, 'Title'),
      p('product_type', 'text', false, 'Product type'),
      p('body_html', 'text', false, 'Body HTML'),
      p('vendor', 'text', false, 'Vendor'),
      p('tags', 'array', false, 'Tags'),
      p('published', 'boolean', false, 'Published'),
      p('published_at', 'date', false, 'Published at'),
      p('published_scope', 'select', false, 'Published scope'),
      p('handle', 'text', false, 'Handle'),
      p('options', 'array', false, 'Options'),
      p('variants', 'array', false, 'Variants'),
      p('images', 'array', false, 'Images'),
      p('template_suffix', 'text', false, 'Template suffix'),
      p('metafields_global_title_tag', 'text', false, 'Metafields global title tag'),
      p('metafields_global_description_tag', 'text', false, 'Metafields global description tag')
    ]),
    // shopify:watchOrders (1 uses in new blueprints)
    m('shopify:watchOrders', 'watch Orders', 'Shopify', 'trigger',
      'Watch for watch Orders in Shopify',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('sortKey', 'select', true, 'Watch by'),
      p('limit', 'number', true, 'Order limit'),
      p('lineItems', 'boolean', true, 'Output line items'),
      p('customer', 'boolean', true, 'Output customer details'),
      p('shippingLines', 'boolean', true, 'Output shipping lines'),
      p('metafields', 'boolean', true, 'Output order metafields'),
      p('nLineItems', 'number', true, 'Line items limit'),
      p('variants', 'boolean', true, 'Output product variants')
    ]),

    // --- Short cm ---
    // short-cm:createLink (1 uses in new blueprints)
    m('short-cm:createLink', 'create Link', 'Short cm', 'action',
      'Perform create Link in Short cm',
      [
      p('domain', 'select', true, 'Domain'),
      p('originalURL', 'url', true, 'Original Long URL'),
      p('title', 'text', true, 'Link Title'),
      p('path', 'text', false, 'Path'),
      p('tags', 'array', false, 'Tags'),
      p('expire', 'collection', false, 'Expiration'),
      p('mobile', 'collection', false, 'Mobile URL'),
      p('password', 'collection', false, 'Password Protection'),
      p('utm', 'collection', false, 'Campaign Tracking'),
      p('cloak', 'collection', false, 'Link Cloaking'),
      p('http', 'collection', false, 'HTTP Status')
    ]),

    // --- Simvoly2 ---
    // simvoly2:watchOrderCreated (1 uses in new blueprints)
    m('simvoly2:watchOrderCreated', 'watch Order Created', 'Simvoly2', 'trigger',
      'Watch for watch Order Created in Simvoly2',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),

    // --- Slack ---
    // slack:WatchGroupMessages (2 uses in new blueprints)
    m('slack:WatchGroupMessages', 'Watch Group Messages', 'Slack', 'trigger',
      'Watch for Watch Group Messages in Slack',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('inputMethod', 'select', true, 'Input Method'),
      p('limit', 'number', true, 'Limit'),
      p('channel', 'select', true, 'Private Channel')
    ]),

    // --- Slybroadcast ---
    // slybroadcast:SendingSlybroadcastCampaignURL (1 uses in new blueprints)
    m('slybroadcast:SendingSlybroadcastCampaignURL', 'Sending Slybroadcast Campaign U R L', 'Slybroadcast', 'action',
      'Perform Sending Slybroadcast Campaign U R L in Slybroadcast',
      [
      p('c_date', 'date', true, 'Date'),
      p('c_url', 'url', true, 'URL'),
      p('c_phone', 'text', false, 'Phone Numbers'),
      p('c_callerID', 'text', false, 'Caller ID'),
      p('mobile_only', 'boolean', false, 'Mobile Only'),
      p('c_audio', 'text', false, 'Audio Format'),
      p('c_listid', 'select', false, 'List ID')
    ]),

    // --- Smartsheet ---
    // smartsheet:CreateRow (1 uses in new blueprints)
    m('smartsheet:CreateRow', 'Create Row', 'Smartsheet', 'action',
      'Perform Create Row in Smartsheet',
      [
      p('sheetId', 'select', true, 'Sheet'),
      p('columns', 'collection', false, 'Columns')
    ]),

    // --- Softr ---
    // softr:createNewUser (2 uses in new blueprints)
    m('softr:createNewUser', 'create New User', 'Softr', 'action',
      'Perform create New User in Softr',
      [
      p('email', 'email', true, 'Email'),
      p('name', 'text', true, 'Name'),
      p('password', 'text', true, 'Password'),
      p('link', 'boolean', true, 'Magiclink')
    ]),

    // --- Swapcard ---
    // swapcard:TriggerWatchEventPeople (1 uses in new blueprints)
    m('swapcard:TriggerWatchEventPeople', 'Trigger Watch Event People', 'Swapcard', 'trigger',
      'Watch for Trigger Watch Event People in Swapcard',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('eventId', 'select', true, 'Event ID'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Tabidoo ---
    // tabidoo:WatchNewRecord (1 uses in new blueprints)
    m('tabidoo:WatchNewRecord', 'Watch New Record', 'Tabidoo', 'trigger',
      'Watch for Watch New Record in Tabidoo',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),

    // --- Teamleader ---
    // teamleader:watchContacts (1 uses in new blueprints)
    m('teamleader:watchContacts', 'watch Contacts', 'Teamleader', 'trigger',
      'Watch for watch Contacts in Teamleader',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // teamleader:getContact (1 uses in new blueprints)
    m('teamleader:getContact', 'get Contact', 'Teamleader', 'search',
      'Search/list get Contact in Teamleader',
      [
      p('id', 'select', true, 'Contact ID')
    ]),

    // --- Telegram ---
    // telegram:WatchUpdates (10 uses in new blueprints)
    m('telegram:WatchUpdates', 'Watch Updates', 'Telegram', 'trigger',
      'Watch for Watch Updates in Telegram',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // telegram:SendReplyMessage (3 uses in new blueprints)
    m('telegram:SendReplyMessage', 'Send Reply Message', 'Telegram', 'action',
      'Perform Send Reply Message in Telegram',
      [
      p('chatId', 'text', true, 'Chat ID'),
      p('text', 'text', true, 'Text'),
      p('messageThreadId', 'number', false, 'Message Thread ID'),
      p('parseMode', 'select', false, 'Parse Mode'),
      p('disableNotification', 'boolean', false, 'Disable Notifications'),
      p('disableWebPagePreview', 'boolean', false, 'Disable Link Previews'),
      p('replyToMessageId', 'number', false, 'Original Message ID'),
      p('replyMarkupAssembleType', 'select', false, 'Enter/Assemble the Reply Markup Field'),
      p('replyMarkup', 'text', false, 'Reply Markup')
    ]),
    // telegram:DownloadFile (1 uses in new blueprints)
    m('telegram:DownloadFile', 'Download File', 'Telegram', 'action',
      'Perform Download File in Telegram',
      [
      p('fileId', 'text', true, 'File ID')
    ]),

    // --- Tools ---
    // util:GetVariables (2 uses in new blueprints)
    m('util:GetVariables', 'Get Variables', 'Tools', 'search',
      'Search/list Get Variables in Tools',
      [
      p('variables', 'array', false, 'Variables')
    ]),
    // util:SetVariable (1 uses in new blueprints)
    m('util:SetVariable', 'Set Variable', 'Tools', 'action',
      'Perform Set Variable in Tools',
      [
      p('name', 'text', true, 'Variable name'),
      p('scope', 'select', true, 'Variable lifetime'),
      p('value', 'text', false, 'Variable value')
    ]),
    // util:FunctionIncrement (1 uses in new blueprints)
    m('util:FunctionIncrement', 'Function Increment', 'Tools', 'action',
      'Perform Function Increment in Tools',
      [
      p('reset', 'select', true, 'Reset a value')
    ]),

    // --- Trello ---
    // trello:createCard (2 uses in new blueprints)
    m('trello:createCard', 'create Card', 'Trello', 'action',
      'Perform create Card in Trello',
      [
      p('list_id_select_or_manual', 'select', true, 'Enter a List ID'),
      p('name', 'text', false, 'Name'),
      p('description', 'text', false, 'Description'),
      p('position', 'select', false, 'Position'),
      p('start', 'date', false, 'Start date'),
      p('due_date', 'date', false, 'Due date'),
      p('dueComplete', 'boolean', true, 'Due complete'),
      p('urlSource', 'url', false, 'File URL'),
      p('filename', 'text', false, 'File name'),
      p('filedata', 'text', false, 'File data'),
      p('select_or_manual_cardID', 'select', false, 'Copy card'),
      p('board_id', 'select', true, 'Board'),
      p('list_id', 'select', true, 'List'),
      p('labels_id', 'select', false, 'Labels'),
      p('members_id', 'select', false, 'Members')
    ]),
    // trello:createAList (1 uses in new blueprints)
    m('trello:createAList', 'create A List', 'Trello', 'search',
      'Search/list create A List in Trello',
      [
      p('board_id', 'select', true, 'Board ID'),
      p('name', 'text', true, 'Name'),
      p('pos', 'select', false, 'Position'),
      p('select_or_manual_listID', 'select', false, 'Copy list')
    ]),
    // trello:watchCards (1 uses in new blueprints)
    m('trello:watchCards', 'watch Cards', 'Trello', 'trigger',
      'Watch for watch Cards in Trello',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('node', 'select', true, 'Watched object'),
      p('limit', 'number', true, 'Limit'),
      p('board_id', 'select', true, 'Board'),
      p('list_id', 'select', true, 'List')
    ]),
    // trello:getACard (1 uses in new blueprints)
    m('trello:getACard', 'get A Card', 'Trello', 'search',
      'Search/list get A Card in Trello',
      [
      p('board_id', 'text', false, 'Board ID'),
      p('select_or_manual', 'select', true, 'Enter card ID'),
      p('card_id', 'text', true, 'Card ID')
    ]),
    // trello:editACard (1 uses in new blueprints)
    m('trello:editACard', 'edit A Card', 'Trello', 'action',
      'Perform edit A Card in Trello',
      [
      p('manual_or_select', 'select', true, 'Enter Card ID'),
      p('name', 'text', false, 'New name'),
      p('description', 'text', false, 'New description'),
      p('moveCard', 'select', false, 'Move a card'),
      p('labels_id', 'array', false, 'Labels'),
      p('position', 'select', false, 'Position'),
      p('due_date', 'date', false, 'Due date'),
      p('dueComplete', 'boolean', false, 'Due complete'),
      p('members_id', 'array', false, 'Members'),
      p('idAttachmentCover', 'text', false, 'Attachment cover ID'),
      p('subscribed', 'boolean', false, 'Subscribe'),
      p('closed', 'boolean', false, 'Archive'),
      p('card_id', 'text', true, 'Card ID'),
      p('idBoard', 'select', false, 'Board ID'),
      p('idList', 'select', false, 'List ID')
    ]),

    // --- VK.com ---
    // vk-com:NewPost (1 uses in new blueprints)
    m('vk-com:NewPost', 'New Post', 'VK.com', 'action',
      'Perform New Post in VK.com',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('filter', 'select', false, 'Filter'),
      p('owner_id', 'number', false, 'Owner ID'),
      p('domain', 'text', false, 'Domain'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- Webhooks ---
    // gateway:CustomMailHook (2 uses in new blueprints)
    m('gateway:CustomMailHook', 'Custom Mail Hook', 'Webhooks', 'trigger',
      'Watch for Custom Mail Hook in Webhooks',
      [
      p('hook', 'text', false, 'Mailhook'),
      p('maxResults', 'number', false, 'Maximum number of results')
    ]),

    // --- WhatsApp Business ---
    // whatsapp-business-cloud:sendMessage (2 uses in new blueprints)
    m('whatsapp-business-cloud:sendMessage', 'send Message', 'WhatsApp Business', 'action',
      'Perform send Message in WhatsApp Business',
      [
      p('fromId', 'select', true, 'Sender ID'),
      p('to', 'text', true, 'Receiver'),
      p('type', 'select', true, 'Message Type'),
      p('text', 'collection', false, 'Text')
    ]),
    // whatsapp-business-cloud:watchEvents (1 uses in new blueprints)
    m('whatsapp-business-cloud:watchEvents', 'watch Events', 'WhatsApp Business', 'trigger',
      'Watch for watch Events in WhatsApp Business',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // whatsapp-business-cloud:watchEvents2 (1 uses in new blueprints)
    m('whatsapp-business-cloud:watchEvents2', 'watch Events2', 'WhatsApp Business', 'trigger',
      'Watch for watch Events2 in WhatsApp Business',
      []),

    // --- WhatsScale ---
    // whatsscale:findCrmContactByPhone (2 uses in new blueprints)
    m('whatsscale:findCrmContactByPhone', 'find Crm Contact By Phone', 'WhatsScale', 'search',
      'Search/list find Crm Contact By Phone in WhatsScale',
      [
      p('phone', 'text', true, 'Phone Number')
    ]),

    // --- Wild apricot ---
    // wild-apricot:getContactsList (1 uses in new blueprints)
    m('wild-apricot:getContactsList', 'get Contacts List', 'Wild apricot', 'search',
      'Search/list get Contacts List in Wild apricot',
      [
      p('MembershipEnabled', 'boolean', false, 'MembershipEnabled'),
      p('MembershipLevelId', 'select', false, 'MembershipLevelId'),
      p('MembershipStatus', 'select', false, 'MembershipStatus'),
      p('Filter', 'array', false, 'Filter'),
      p('Select', 'array', false, 'Select')
    ]),

    // --- WooCommerce ---
    // woocommerce:WatchOrders (1 uses in new blueprints)
    m('woocommerce:WatchOrders', 'Watch Orders', 'WooCommerce', 'trigger',
      'Watch for Watch Orders in WooCommerce',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('status', 'select', false, 'Status'),
      p('limit', 'number', true, 'Limit')
    ]),
    // woocommerce:WatchCustomers (1 uses in new blueprints)
    m('woocommerce:WatchCustomers', 'Watch Customers', 'WooCommerce', 'trigger',
      'Watch for Watch Customers in WooCommerce',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('role', 'select', false, 'Role'),
      p('watch', 'select', false, 'I want to watch'),
      p('limit', 'number', true, 'Limit')
    ]),
    // woocommerce:WatchProducts (1 uses in new blueprints)
    m('woocommerce:WatchProducts', 'Watch Products', 'WooCommerce', 'trigger',
      'Watch for Watch Products in WooCommerce',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),

    // --- WordPress ---
    // wordpress:createPost (2 uses in new blueprints)
    m('wordpress:createPost', 'create Post', 'WordPress', 'action',
      'Perform create Post in WordPress',
      [
      p('title', 'text', true, 'Title'),
      p('content', 'text', true, 'Content'),
      p('type', 'select', true, 'Type'),
      p('excerpt', 'text', false, 'Excerpt'),
      p('date', 'date', false, 'Date'),
      p('slug', 'text', false, 'Slug'),
      p('status', 'select', false, 'Status'),
      p('format', 'select', false, 'Format'),
      p('parent', 'number', false, 'Parent object ID'),
      p('categories', 'select', false, 'Categories'),
      p('tags', 'select', false, 'Tags'),
      p('author', 'select', false, 'Author'),
      p('featuredMedia', 'number', false, 'Featured media ID'),
      p('template', 'text', false, 'Template'),
      p('password', 'text', false, 'Password'),
      p('sticky', 'boolean', false, 'Sticky'),
      p('commentStatus', 'select', false, 'Comment status'),
      p('pingStatus', 'select', false, 'Ping status'),
      p('taxonomy', 'array', false, 'Additional fields'),
      p('meta', 'array', false, 'Metadata (custom fields)')
    ]),
    // wordpress:watchComments (1 uses in new blueprints)
    m('wordpress:watchComments', 'watch Comments', 'WordPress', 'trigger',
      'Watch for watch Comments in WordPress',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('limit', 'number', true, 'Limit')
    ]),
    // wordpress:searchUsers (1 uses in new blueprints)
    m('wordpress:searchUsers', 'search Users', 'WordPress', 'search',
      'Search/list search Users in WordPress',
      [
      p('search', 'text', false, 'Search'),
      p('roles', 'select', false, 'Roles'),
      p('order', 'collection', false, 'Order By'),
      p('limit', 'number', false, 'Limit'),
      p('include', 'array', false, 'Include'),
      p('exclude', 'array', false, 'Exclude'),
      p('slug', 'text', false, 'Slug')
    ]),

    // --- Yeeflow ---
    // yeeflow:itemCreated (1 uses in new blueprints)
    m('yeeflow:itemCreated', 'item Created', 'Yeeflow', 'action',
      'Perform item Created in Yeeflow',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),

    // --- Z-API ---
    // z-api:sendTextMessage (2 uses in new blueprints)
    m('z-api:sendTextMessage', 'send Text Message', 'Z-API', 'action',
      'Perform send Text Message in Z-API',
      [
      p('phone', 'text', true, 'Phone'),
      p('message', 'text', true, 'Message'),
      p('messageId', 'text', false, 'Message ID'),
      p('privateAnswer', 'boolean', false, 'Private Answer'),
      p('delayMessage', 'number', false, 'Delay Message'),
      p('delayTyping', 'number', false, 'Delay Typing'),
      p('editMessageId', 'text', false, 'Edit Message ID'),
      p('headers', 'array', false, 'Headers')
    ]),

    // --- Zendesk ---
    // zendesk:CreateTicket (2 uses in new blueprints)
    m('zendesk:CreateTicket', 'Create Ticket', 'Zendesk', 'action',
      'Perform Create Ticket in Zendesk',
      [
      p('subject', 'text', false, 'Subject'),
      p('comment', 'collection', true, 'Comment'),
      p('via_followup_source_id', 'select', false, 'Closed Ticket ID'),
      p('type', 'select', false, 'Type'),
      p('priority', 'select', false, 'Priority'),
      p('status', 'select', false, 'Status'),
      p('requester_id', 'select', false, 'Requester ID'),
      p('submitter_id', 'select', false, 'Submitter ID'),
      p('assignee_id', 'select', false, 'Assignee ID'),
      p('group_id', 'select', false, 'Group ID'),
      p('recipient', 'email', false, 'Recipient'),
      p('collaborators', 'select', false, 'Collaborators'),
      p('followers', 'array', false, 'Followers'),
      p('email_ccs', 'array', false, 'Email CCs'),
      p('ticket_form_id', 'select', false, 'Ticket Form ID'),
      p('macro_ids', 'select', false, 'Macro IDs'),
      p('tags', 'select', false, 'Tags'),
      p('brand_id', 'select', false, 'Brand ID'),
      p('metadata', 'text', false, 'Metadata'),
      p('problem_id', 'number', false, 'Problem ID'),
      p('external_id', 'text', false, 'External ID'),
      p('custom_fields', 'collection', false, 'Custom Fields')
    ]),

    // --- ZeroBounce ---
    // zerobounce:validateEmails (3 uses in new blueprints)
    m('zerobounce:validateEmails', 'validate Emails', 'ZeroBounce', 'action',
      'Perform validate Emails in ZeroBounce',
      [
      p('email', 'email', true, 'Email address'),
      p('ip_address', 'text', false, 'IP Address')
    ]),

    // --- Zoho CRM ---
    // zohocrm:SearchObjects (1 uses in new blueprints)
    m('zohocrm:SearchObjects', 'Search Objects', 'Zoho CRM', 'search',
      'Search/list Search Objects in Zoho CRM',
      [
      p('module', 'select', false, 'Module'),
      p('email', 'email', false, 'Email'),
      p('approved', 'select', false, 'Approved records'),
      p('limit', 'number', true, 'Limit'),
      p('filter', 'text', true, 'Filter')
    ]),

    // --- Zoho Invoice ---
    // zoho-invoice:watchInvoices (1 uses in new blueprints)
    m('zoho-invoice:watchInvoices', 'watch Invoices', 'Zoho Invoice', 'trigger',
      'Watch for watch Invoices in Zoho Invoice',
      [
      p('__IMTCONN__', 'text', true, 'Connection'),
      p('choose', 'select', true, 'Watch'),
      p('item_id', 'select', false, 'Select Item'),
      p('status', 'select', false, 'Status'),
      p('filter_by', 'select', false, 'Filter By'),
      p('sort_column', 'select', false, 'Sort Column'),
      p('limit', 'number', true, 'Limit')
    ]),
    // zoho-invoice:getContact (1 uses in new blueprints)
    m('zoho-invoice:getContact', 'get Contact', 'Zoho Invoice', 'search',
      'Search/list get Contact in Zoho Invoice',
      [
      p('contact_id', 'select', true, 'Contact ID')
    ]),
    // zoho-invoice:listInvoices (1 uses in new blueprints)
    m('zoho-invoice:listInvoices', 'list Invoices', 'Zoho Invoice', 'search',
      'Search/list list Invoices in Zoho Invoice',
      [
      p('filter', 'text', false, 'Filter'),
      p('item_id', 'select', false, 'Select Item'),
      p('status', 'select', false, 'Status'),
      p('filter_by', 'select', false, 'Filter By'),
      p('sort_column', 'select', false, 'Sort Column'),
      p('limit', 'number', false, 'Limit')
    ]),
    // zoho-invoice:getInvoice (1 uses in new blueprints)
    m('zoho-invoice:getInvoice', 'get Invoice', 'Zoho Invoice', 'search',
      'Search/list get Invoice in Zoho Invoice',
      [
      p('invoice_id', 'select', true, 'Invoice ID'),
      p('accept', 'select', true, 'Print')
    ]),

    // --- Zoho Sign ---
    // zoho-sign:DocumentCompleted (1 uses in new blueprints)
    m('zoho-sign:DocumentCompleted', 'Document Completed', 'Zoho Sign', 'action',
      'Perform Document Completed in Zoho Sign',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),
    // zoho-sign:DocumentDetails (1 uses in new blueprints)
    m('zoho-sign:DocumentDetails', 'Document Details', 'Zoho Sign', 'action',
      'Perform Document Details in Zoho Sign',
      [
      p('requestId', 'text', true, 'Document ID')
    ]),
    // zoho-sign:DownloadDocumentNew (1 uses in new blueprints)
    m('zoho-sign:DownloadDocumentNew', 'Download Document New', 'Zoho Sign', 'action',
      'Perform Download Document New in Zoho Sign',
      [
      p('requestId', 'text', true, 'Document ID')
    ]),

    // --- Zoom user ---
    // zoom-user:watchWebinars (1 uses in new blueprints)
    m('zoom-user:watchWebinars', 'watch Webinars', 'Zoom user', 'trigger',
      'Watch for watch Webinars in Zoom user',
      [
      p('__IMTHOOK__', 'text', true, 'Webhook')
    ]),

