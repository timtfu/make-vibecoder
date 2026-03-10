// ═══════════════════════════════════════
// TIER 1: HIGH USAGE: EXTRACTED FROM BLUEPRINTS
// Generated: 2026-03-09
// Total modules: 4
// ═══════════════════════════════════════

    // slack:CreateMessage (12 uses)
    m('slack:CreateMessage', 'Create Message', 'Slack', 'action',
      'Performs create message in Slack.',
      [
      p('channelWType', 'select', true, 'Enter a channel ID or name', {"options":["manualy","list"]}),
      p('text', 'text', false, 'Text'),
      p('blocks', 'text', false, 'Blocks'),
      p('thread_ts', 'text', false, 'Thread message ID (time stamp)'),
      p('reply_broadcast', 'boolean', false, 'Reply broadcast'),
      p('link_names', 'boolean', false, 'Link names'),
      p('parse', 'boolean', false, 'Parse message text'),
      p('mrkdwn', 'boolean', false, 'Use markdown'),
      p('unfurl_links', 'boolean', false, 'Unfurl primarily text-based content'),
      p('unfurl_media', 'boolean', false, 'Unfurl media content'),
      p('icon_emoji', 'text', false, 'Icon emoji'),
      p('icon_url', 'url', false, 'Icon url'),
      p('username', 'text', false, 'User name'),
      p('channelType', 'select', true, 'Channel type', {"options":["public","private","im","mpim"]}),
      p('channel', 'select', true, 'User')
    ]),

    // builtin:BasicRouter (11 uses)
    m('builtin:BasicRouter', 'Basic Router', 'Flow Control', 'action',
      'Performs basic router in Flow Control.',
      []),

    // openai-gpt-3:CreateCompletion (9 uses)
    m('openai-gpt-3:CreateCompletion', 'Create Completion', 'OpenAI (ChatGPT, DALL-E, Whisper)', 'action',
      'Performs create completion in OpenAI (ChatGPT, DALL-E, Whisper).',
      [
      p('select', 'select', true, 'Select Method', {"options":["chat","prompt"]}),
      p('max_tokens', 'number', true, 'Max Tokens'),
      p('temperature', 'number', false, 'Temperature', {"min":0,"max":2}),
      p('top_p', 'number', false, 'Top P', {"min":0,"max":1}),
      p('n_completions', 'number', false, 'Number'),
      p('frequency_penalty', 'number', false, 'Frequency Penalty', {"min":-2,"max":2}),
      p('presence_penalty', 'number', false, 'Presence Penalty', {"min":-2,"max":2}),
      p('logit_bias', 'array', false, 'Token Probability', {"hasSpec":true}),
      p('response_format', 'select', false, 'Response Format', {"options":["text","json_object"]}),
      p('seed', 'number', false, 'Seed'),
      p('stop', 'array', false, 'Stop Sequences', {"hasSpec":true}),
      p('additionalParameters', 'array', false, 'Other Input Parameters', {"hasSpec":true}),
      p('model', 'select', true, 'Model'),
      p('messages', 'array', true, 'Messages', {"hasSpec":true})
    ]),

    // util:TextAggregator (6 uses)
    m('util:TextAggregator', 'Text Aggregator', 'Tools', 'action',
      'Performs text aggregator in Tools.',
      [
      p('value', 'text', false, 'Text')
    ]),

