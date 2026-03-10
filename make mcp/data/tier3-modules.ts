// ═══════════════════════════════════════
// TIER 3: SPECIALTY: EXTRACTED FROM BLUEPRINTS
// Generated: 2026-03-09
// Total modules: 67
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

