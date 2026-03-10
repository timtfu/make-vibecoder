// ═══════════════════════════════════════
// TIER 2: MEDIUM USAGE: EXTRACTED FROM BLUEPRINTS
// Generated: 2026-03-09
// Total modules: 24
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

    // airtable:ActionCreateRecord (3 uses)
    m('airtable:ActionCreateRecord', 'Create Record', 'Airtable', 'action',
      'Performs create record in Airtable.',
      [
      p('base', 'select', true, 'Base'),
      p('typecast', 'boolean', true, 'Smart links'),
      p('useColumnId', 'boolean', true, 'Use Column ID'),
      p('table', 'select', true, 'Table'),
      p('record', 'object', false, 'Record', {"hasSpec":true})
    ]),

    // salesforce:createAResponsibleRecord (3 uses)
    m('salesforce:createAResponsibleRecord', 'Create A Responsible Record', 'Salesforce', 'action',
      'Performs create a responsible record in Salesforce.',
      [
      p('sObject', 'select', true, 'Type'),
      p('fields', 'object', false, 'Fields', {"hasSpec":true})
    ]),

    // gateway:CustomWebHook (3 uses)
    m('gateway:CustomWebHook', 'Custom Web Hook', 'Webhooks', 'action',
      'Performs custom web hook in Webhooks.',
      [
      p('maxResults', 'number', false, 'Maximum number of results')
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

    // json:ParseJSON (2 uses)
    m('json:ParseJSON', 'Parse J S O N', 'JSON', 'action',
      'Performs parse j s o n in JSON.',
      [
      p('json', 'text', true, 'JSON string')
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

