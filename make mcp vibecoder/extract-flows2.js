/**
 * Extract modules from "Make example flows 2" blueprints
 * Compares with existing modules to find new ones
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blueprintDir = path.join(__dirname, '..', 'Make example flows 2');
const outputDir = path.join(__dirname, 'data');

// Type mapping from blueprint types to internal types
function mapType(bpType) {
    const typeMap = {
        'text': 'text', 'string': 'text', 'uinteger': 'number', 'integer': 'number',
        'number': 'number', 'boolean': 'boolean', 'select': 'select', 'enum': 'select',
        'array': 'array', 'collection': 'collection', 'date': 'date', 'time': 'text',
        'url': 'url', 'email': 'email', 'password': 'text', 'filename': 'text',
        'path': 'text', 'folder': 'text', 'file': 'text', 'image': 'text',
        'buffer': 'text', 'any': 'text', 'filter': 'text', 'timezone': 'text',
        'color': 'text', 'cert': 'text', 'pem': 'text', 'hidden': 'text',
        'timestamp': 'date', 'phone': 'text'
    };
    return typeMap[bpType] || 'text';
}

function mapParam(p) {
    if (!p || !p.name) return null;
    const type = mapType(p.type || 'text');
    const result = {
        name: p.name,
        type,
        required: p.required || false,
        description: p.label || p.name,
    };
    if (p.options && Array.isArray(p.options)) {
        result.extra = { options: p.options.map(o => typeof o === 'string' ? o : (o.label || o.value || String(o))) };
    }
    return result;
}

function parseModuleId(moduleId) {
    const parts = moduleId.split(':');
    if (parts.length < 2) return null;
    const app = parts[0];
    const action = parts.slice(1).join(':');

    // Determine type
    let type = 'action';
    const actionLower = action.toLowerCase();
    if (actionLower.includes('watch') || actionLower.includes('trigger') || actionLower.includes('hook') || actionLower.includes('listen')) {
        type = 'trigger';
    } else if (actionLower.includes('search') || actionLower.includes('list') || actionLower.includes('find') || actionLower.includes('get')) {
        type = 'search';
    }

    // Human-readable app name
    const appNames = {
        'slack': 'Slack', 'google-sheets': 'Google Sheets', 'gmail': 'Gmail',
        'openai-gpt-3': 'OpenAI (ChatGPT)', 'openai': 'OpenAI', 'anthropic-claude': 'Anthropic (Claude)',
        'salesforce': 'Salesforce', 'hubspotcrm': 'HubSpot CRM', 'airtable': 'Airtable',
        'notion': 'Notion', 'typeform': 'Typeform', 'stripe': 'Stripe',
        'shopify': 'Shopify', 'wordpress': 'WordPress', 'mailchimp': 'Mailchimp',
        'asana': 'Asana', 'trello': 'Trello', 'jira': 'Jira',
        'postgres': 'PostgreSQL', 'mysql': 'MySQL', 'google-drive': 'Google Drive',
        'dropbox': 'Dropbox', 'http': 'HTTP', 'json': 'JSON',
        'util': 'Tools', 'builtin': 'Flow Control', 'gateway': 'Webhooks',
        'regexp': 'RegExp', 'csv': 'CSV', 'xml': 'XML',
        'twilio': 'Twilio', 'sendgrid': 'SendGrid', 'mailgun': 'Mailgun',
        'instagram': 'Instagram', 'facebook': 'Facebook', 'twitter': 'Twitter',
        'linkedin': 'LinkedIn', 'youtube': 'YouTube', 'tiktok': 'TikTok',
        'telegram-bot-api': 'Telegram', 'whatsapp-business-cloud': 'WhatsApp',
        'discord': 'Discord', 'teams': 'Microsoft Teams', 'zoom': 'Zoom',
        'pipedrive': 'Pipedrive', 'zoho-crm': 'Zoho CRM', 'monday': 'Monday.com',
        'clickup': 'ClickUp', 'basecamp': 'Basecamp', 'wrike': 'Wrike',
        'github': 'GitHub', 'gitlab': 'GitLab', 'bitbucket': 'Bitbucket',
        'zendesk': 'Zendesk', 'freshdesk': 'Freshdesk', 'intercom': 'Intercom',
        'google-calendar': 'Google Calendar', 'outlook-calendar': 'Outlook Calendar',
        'google-docs': 'Google Docs', 'microsoft-word': 'Microsoft Word',
        'quickbooks': 'QuickBooks', 'xero': 'Xero', 'wave': 'Wave',
        'buffer': 'Buffer', 'hootsuite': 'Hootsuite',
        'browse-ai': 'Browse AI', 'apify': 'Apify',
        'elevenlabs': 'ElevenLabs', 'canva': 'Canva',
        'clearbit': 'Clearbit', 'hunter': 'Hunter.io',
        'calendly': 'Calendly', 'acuity': 'Acuity Scheduling',
        'woocommerce': 'WooCommerce', 'bigcommerce': 'BigCommerce', 'magento': 'Magento',
        'facebook-lead-ads': 'Facebook Lead Ads', 'linkedin-lead-gen-forms': 'LinkedIn Lead Gen Forms',
        'google-ads': 'Google Ads', 'facebook-ads': 'Facebook Ads',
        'salesloft': 'Salesloft', 'gong': 'Gong',
        'sendinblue': 'Sendinblue', 'activecampaign': 'ActiveCampaign',
        'podio': 'Podio', 'monday-com': 'Monday.com',
        'revolut-business': 'Revolut Business', 'braintree': 'Braintree',
        'ringcentral': 'RingCentral', 'vonage': 'Vonage',
        'google-analytics': 'Google Analytics', 'mixpanel': 'Mixpanel',
        'powerbi': 'Power BI', 'tableau': 'Tableau',
        'aws-s3': 'AWS S3', 'azure': 'Azure', 'gcp': 'Google Cloud',
        'mongodb': 'MongoDB', 'firebase': 'Firebase',
        'rss': 'RSS', 'email': 'Email', 'sms': 'SMS',
        'perplexity-ai': 'Perplexity AI', 'deepseek': 'DeepSeek',
        'leonardo-ai': 'Leonardo AI', 'stability-ai': 'Stability AI',
        'browseract': 'BrowserAct', 'browser-act': 'BrowserAct',
        'ai-tools': 'AI Tools', 'ai-agent': 'AI Agent',
        'dfs-backlinks-api': 'DataForSEO Backlinks API',
        'dataforseo-labs-api': 'DataForSEO Labs API',
        'google-email': 'Gmail', 'gmail': 'Gmail',
        'google-calendar': 'Google Calendar', 'google-contacts': 'Google Contacts',
        'google-docs': 'Google Docs', 'google-drive': 'Google Drive',
        'google-forms': 'Google Forms',
        'google-ads': 'Google Ads', 'google-ads-campaign-management': 'Google Ads',
        'google-cloud-tts': 'Google Cloud TTS',
        'googlecloudvision': 'Google Cloud Vision',
        'facebook-conversions-api': 'Facebook Conversions API',
        'facebook-insights': 'Facebook Insights',
        'facebook-pages': 'Facebook Pages',
        'instagram-business': 'Instagram Business',
        'whatsapp-business-cloud': 'WhatsApp Business', 'whatsscale': 'WhatsScale',
        'telegram-bot-api': 'Telegram', 'telegram': 'Telegram',
        'message-bird': 'MessageBird', 'messagebird': 'MessageBird',
        'mitto-sms': 'Mitto SMS', 'vonage': 'Vonage', 'twilio': 'Twilio',
        'perplexity-ai': 'Perplexity AI', 'deepseek': 'DeepSeek',
        'gemini-ai': 'Gemini AI', 'anthropic-claude': 'Anthropic (Claude)',
        'leonardo-ai': 'Leonardo AI', 'stability-ai': 'Stability AI',
        'layerre': 'Layerre', 'html-css-to-image': 'HTML/CSS to Image',
        'vk-com': 'VK.com', 'z-api': 'Z-API',
        'revolut': 'Revolut', 'revolut-business': 'Revolut Business',
        'mollie': 'Mollie', 'braintree': 'Braintree',
        'sage-accounting': 'Sage Accounting', 'zoho-invoice': 'Zoho Invoice',
        'zoho-sign': 'Zoho Sign', 'zohocrm': 'Zoho CRM',
        'fakturoid': 'Fakturoid', 'sellsy': 'Sellsy',
        'onecrm': 'OneCRM', 'attio': 'Attio', 'liondesk': 'LionDesk',
        'salesflare': 'Salesflare', 'copper': 'Copper CRM',
        'raynet-crm': 'RAYNET CRM', 'raynet-crm-v2': 'RAYNET CRM',
        'bitrix24': 'Bitrix24', 'teamleader': 'Teamleader',
        'smartsheet': 'Smartsheet', 'onedrive': 'OneDrive',
        'monday-com': 'Monday.com', 'monday': 'Monday.com',
        'productboard': 'Productboard', 'everhour': 'Everhour',
        'focuster': 'Focuster', 'wrike': 'Wrike', 'basecamp': 'Basecamp',
        'maintainx': 'MaintainX', 'tabidoo': 'Tabidoo', 'yeeflow': 'Yeeflow',
        'manychat': 'ManyChat', 'softr': 'Softr',
        'parsehub': 'ParseHub', 'phantombuster': 'PhantomBuster',
        'predict-leads-app': 'Predict Leads', 'apollo': 'Apollo',
        'zerobounce': 'ZeroBounce', 'cloudmersive': 'Cloudmersive',
        'mailboxvalidator': 'MailboxValidator', 'emercury': 'Emercury',
        'klicktipp': 'KlickTipp', 'getresponse': 'GetResponse', 'zoho-mail': 'Zoho Mail',
        'pipedrive-crm': 'Pipedrive', 'freshsales': 'Freshsales',
        'salesflare': 'Salesflare', 'copper': 'Copper CRM',
        'simvoly': 'Simvoly', 'swapcard': 'Swapcard',
        'mitto-sms': 'Mitto SMS', 'loyverse': 'Loyverse',
        'layerre': 'Layerre', 'cloudmersive': 'Cloudmersive',
        'fogbugz': 'FogBugz', 'productboard': 'Productboard',
        'everhour': 'Everhour', 'obras-online': 'Obras Online',
        'raynet-crm': 'RAYNET CRM', 'pipedrive': 'Pipedrive',
        'google-forms': 'Google Forms', 'microsoft-excel': 'Microsoft 365 Excel',
    };

    const appName = appNames[app] || app.charAt(0).toUpperCase() + app.slice(1).replace(/-/g, ' ');
    const name = action.replace(/([A-Z])/g, ' $1').replace(/^[\s]+/, '').trim() || action;

    return { app: appName, name, type };
}

// Load all existing module IDs from scrape-modules.ts
function getExistingModuleIds() {
    const scraperFile = fs.readFileSync(path.join(__dirname, 'src/scrapers/scrape-modules.ts'), 'utf-8');
    const regex = /m\('([^']+)'/g;
    const ids = new Set();
    let match;
    while ((match = regex.exec(scraperFile)) !== null) {
        ids.add(match[1]);
    }
    return ids;
}

// Main extraction
function extractBlueprints() {
    console.log('🚀 Extracting from Make example flows 2...\n');

    const files = fs.readdirSync(blueprintDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} blueprint files\n`);

    const modules = new Map(); // moduleId -> { app, name, type, params, count, blueprints }

    let parsed = 0, errors = 0;

    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(blueprintDir, file), 'utf-8');
            const bp = JSON.parse(content);
            parsed++;

            const flow = bp.flow || [];
            for (const step of flow) {
                if (!step.module || !step.module.includes(':')) continue;
                const moduleId = step.module;

                if (!modules.has(moduleId)) {
                    const parsed = parseModuleId(moduleId);
                    if (!parsed) continue;
                    const params = (step.metadata?.expect || step.metadata?.parameters || [])
                        .map(mapParam)
                        .filter(Boolean);
                    modules.set(moduleId, { ...parsed, params, count: 1, blueprints: [file] });
                } else {
                    const m = modules.get(moduleId);
                    m.count++;
                    if (!m.blueprints.includes(file)) m.blueprints.push(file);
                    // Merge params if we get more
                    const newParams = (step.metadata?.expect || step.metadata?.parameters || [])
                        .map(mapParam)
                        .filter(Boolean);
                    if (newParams.length > m.params.length) m.params = newParams;
                }
            }
        } catch (e) {
            errors++;
            console.warn(`⚠️  Failed to parse ${file}: ${e.message}`);
        }
    }

    console.log(`✅ Parsed ${parsed} blueprints (${errors} errors)`);
    console.log(`📊 Found ${modules.size} unique modules\n`);

    return modules;
}

function generateParamCode(p) {
    if (p.extra?.options) {
        return `p('${p.name}', '${p.type}', ${p.required}, '${esc(p.description)}', { options: ${JSON.stringify(p.extra.options)} })`;
    }
    return `p('${p.name}', '${p.type}', ${p.required}, '${esc(p.description)}')`;
}

function esc(s) {
    return (s || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

function generateModuleCode(moduleId, mod) {
    const paramsCode = mod.params.length > 0
        ? '\n      ' + mod.params.map(generateParamCode).join(',\n      ') + '\n    '
        : '';
    const desc = `${mod.type === 'trigger' ? 'Watch for' : mod.type === 'search' ? 'Search/list' : 'Perform'} ${mod.name} in ${mod.app}`;
    return `    // ${moduleId} (${mod.count} uses in new blueprints)
    m('${moduleId}', '${esc(mod.name)}', '${esc(mod.app)}', '${mod.type}',
      '${esc(desc)}',
      [${paramsCode}]),`;
}

// Main
const allModules = extractBlueprints();
const existingIds = getExistingModuleIds();

console.log(`📋 Existing modules in scrape-modules.ts: ${existingIds.size}`);

// Filter to new-only
const newModules = new Map();
const existingModules = new Map();

for (const [id, mod] of allModules) {
    if (existingIds.has(id)) {
        existingModules.set(id, mod);
    } else {
        newModules.set(id, mod);
    }
}

// Sort by count desc
const sorted = [...newModules.entries()].sort((a, b) => b[1].count - a[1].count);

console.log(`\n✨ NEW modules (not yet in database): ${newModules.size}`);
console.log(`♻️  Already existing modules: ${existingModules.size}`);

// Show breakdown by tier
const tier1 = sorted.filter(([,m]) => m.count >= 3);
const tier2 = sorted.filter(([,m]) => m.count === 2);
const tier3 = sorted.filter(([,m]) => m.count === 1);

console.log(`\n📈 New module breakdown:`);
console.log(`  Tier 1 (≥3 uses): ${tier1.length}`);
console.log(`  Tier 2 (2 uses): ${tier2.length}`);
console.log(`  Tier 3 (1 use): ${tier3.length}`);

console.log(`\n🔝 Top 20 new modules by usage:`);
sorted.slice(0, 20).forEach(([id, m], i) => {
    console.log(`  ${i+1}. ${id} (${m.count}x) - ${m.app}`);
});

// Generate output code
let code = `// ═══════════════════════════════════════════════════════════
// EXTRACTED FROM "Make example flows 2" (${newModules.size} new modules)
// Generated: ${new Date().toISOString().split('T')[0]}
// Source: ${allModules.size} unique modules from 223 blueprints
// ═══════════════════════════════════════════════════════════\n\n`;

// Group by app
const byApp = new Map();
for (const [id, mod] of sorted) {
    if (!byApp.has(mod.app)) byApp.set(mod.app, []);
    byApp.get(mod.app).push([id, mod]);
}

for (const [app, mods] of [...byApp.entries()].sort()) {
    code += `    // --- ${app} ---\n`;
    for (const [id, mod] of mods) {
        code += generateModuleCode(id, mod) + '\n';
    }
    code += '\n';
}

// Write output files
const reportPath = path.join(outputDir, 'flows2-new-modules.ts');
fs.writeFileSync(reportPath, code);
console.log(`\n✅ Generated code → ${reportPath}`);

// JSON report
const report = {
    extractedFrom: 'Make example flows 2',
    date: new Date().toISOString(),
    totalBlueprintsInFolder: allModules.size + existingModules.size,
    totalUniqueModules: allModules.size,
    newModules: newModules.size,
    existingModules: existingModules.size,
    tier1: tier1.length,
    tier2: tier2.length,
    tier3: tier3.length,
    topNewModules: sorted.slice(0, 30).map(([id, m]) => ({ id, count: m.count, app: m.app })),
    newApps: [...new Set(sorted.map(([,m]) => m.app))].sort()
};

fs.writeFileSync(path.join(outputDir, 'flows2-report.json'), JSON.stringify(report, null, 2));
console.log(`✅ Report → data/flows2-report.json\n`);
