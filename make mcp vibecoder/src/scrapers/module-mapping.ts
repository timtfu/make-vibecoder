/**
 * Module Mapping Utilities
 *
 * Provides type mapping and schema transformation utilities for extracting
 * Make.com module definitions from blueprint JSON files.
 */

export interface BlueprintParameter {
    name: string;
    type: string;
    label?: string;
    required?: boolean;
    validate?: {
        enum?: string[];
        min?: number;
        max?: number;
        maxLength?: number;
        maxItems?: number;
    };
    spec?: BlueprintParameter[] | { name: string; spec: BlueprintParameter[]; type: string; };
}

export interface MappedParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    extra?: Record<string, any>;
}

/**
 * Type Mapping Table: Blueprint → scrape-modules
 *
 * Maps Make.com blueprint parameter types to our internal type system
 */
const TYPE_MAPPING: Record<string, string> = {
    // Direct mappings
    'text': 'text',
    'number': 'number',
    'integer': 'number',
    'uinteger': 'number',
    'boolean': 'boolean',
    'select': 'select',
    'array': 'array',
    'collection': 'object',
    'date': 'date',
    'time': 'time',
    'timestamp': 'timestamp',
    'url': 'url',
    'email': 'email',
    'password': 'password',
    'filename': 'filename',
    'path': 'path',
    'buffer': 'buffer',
    'any': 'text',  // Fallback

    // Special types
    'folder': 'select',
    'file': 'select',
    'port': 'number',
    'hidden': 'text',
    'filter': 'text',
    'cert': 'text',
    'account': 'connection',  // Will be skipped
};

/**
 * Map blueprint parameter type to scrape-modules type
 */
export function mapType(blueprintType: string): string {
    // Handle account:* and hook:* types (should be skipped)
    if (blueprintType?.startsWith('account:') || blueprintType?.startsWith('hook:')) {
        return 'connection';  // Special marker for connection params
    }

    // Direct lookup
    if (TYPE_MAPPING[blueprintType]) {
        return TYPE_MAPPING[blueprintType];
    }

    // Fallback to text for unknown types
    console.warn(`Unknown blueprint type: ${blueprintType}, defaulting to 'text'`);
    return 'text';
}

/**
 * Check if a parameter should be skipped (connection/hook params)
 */
export function shouldSkipParameter(param: BlueprintParameter): boolean {
    // Skip connection parameters
    if (param.name === '__IMTCONN__' || param.name === '__IMTHOOK__') {
        return true;
    }

    // Skip account and hook types
    if (param.type?.startsWith('account:') || param.type?.startsWith('hook:')) {
        return true;
    }

    return false;
}

/**
 * Map a blueprint parameter to scrape-modules format
 */
export function mapParameter(blueprintParam: BlueprintParameter): MappedParameter | null {
    // Skip connection/hook parameters
    if (shouldSkipParameter(blueprintParam)) {
        return null;
    }

    const mappedType = mapType(blueprintParam.type);

    // Skip if it's a connection type
    if (mappedType === 'connection') {
        return null;
    }

    const mapped: MappedParameter = {
        name: blueprintParam.name,
        type: mappedType,
        required: blueprintParam.required ?? false,
        description: blueprintParam.label || blueprintParam.name,
        extra: {}
    };

    // Handle select options (enum validation)
    if (blueprintParam.validate?.enum) {
        mapped.extra!.options = blueprintParam.validate.enum;
    }

    // Handle numeric constraints
    if (blueprintParam.validate?.min !== undefined) {
        mapped.extra!.min = blueprintParam.validate.min;
    }
    if (blueprintParam.validate?.max !== undefined) {
        mapped.extra!.max = blueprintParam.validate.max;
    }

    // Handle default values (if present in extra fields)
    // Note: Blueprints don't typically have defaults in metadata.expect

    // Handle nested specs (arrays/collections)
    if (blueprintParam.spec) {
        // For now, mark as complex
        // Future enhancement: could recursively extract nested params
        mapped.extra!.hasSpec = true;
    }

    return mapped;
}

/**
 * Parse module ID to extract app name, action name, and type
 *
 * Examples:
 * - "slack:CreateMessage" → { app: "Slack", name: "Create a Message", type: "action" }
 * - "google-sheets:TriggerWatchRows" → { app: "Google Sheets", name: "Watch Rows", type: "trigger" }
 * - "salesforce:ActionSearchObject" → { app: "Salesforce", name: "Search Object", type: "search" }
 */
export function parseModuleName(moduleId: string): { app: string; name: string; type: 'trigger' | 'action' | 'search' } {
    const [appPart, actionPart] = moduleId.split(':');

    if (!appPart || !actionPart) {
        console.warn(`Invalid module ID format: ${moduleId}`);
        return { app: 'Unknown', name: 'Unknown', type: 'action' };
    }

    // Infer type from action name
    let type: 'trigger' | 'action' | 'search' = 'action';
    let cleanActionName = actionPart;

    if (actionPart.startsWith('Trigger') || actionPart.startsWith('watch') || actionPart.startsWith('Watch')) {
        type = 'trigger';
        // Remove "Trigger" or "watch"/"Watch" prefix
        cleanActionName = actionPart.replace(/^(Trigger|watch|Watch)/, '');
    } else if (actionPart.startsWith('Action')) {
        type = 'action';
        // Remove "Action" prefix
        cleanActionName = actionPart.replace(/^Action/, '');
    } else if (actionPart.match(/^(Search|List|Get|Find)/)) {
        type = 'search';
    }

    // Format app name using known mappings
    const app = formatAppName(appPart);

    // Format action name (camelCase to Title Case)
    const name = camelToTitleCase(cleanActionName);

    return { app, name, type };
}

/**
 * App name mappings for common services
 */
const APP_NAME_MAP: Record<string, string> = {
    'slack': 'Slack',
    'google-sheets': 'Google Sheets',
    'google-docs': 'Google Docs',
    'google-drive': 'Google Drive',
    'google-calendar': 'Google Calendar',
    'google-email': 'Gmail',
    'google-ads-campaign-management': 'Google Ads',
    'google-ads-conversions': 'Google Ads Conversions',
    'google-cloud-firestore': 'Google Cloud Firestore',
    'openai-gpt-3': 'OpenAI (ChatGPT, DALL-E, Whisper)',
    'anthropic-claude': 'Anthropic (Claude)',
    'notion': 'Notion',
    'salesforce': 'Salesforce',
    'airtable': 'Airtable',
    'hubspotcrm': 'HubSpot CRM',
    'hubspot': 'HubSpot',
    'stripe': 'Stripe',
    'asana': 'Asana',
    'jira': 'Jira',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'http': 'HTTP',
    'gateway': 'Webhooks',
    'email': 'Email',
    'json': 'JSON',
    'xml': 'XML',
    'regexp': 'Text Parser',
    'util': 'Tools',
    'builtin': 'Flow Control',
    'typeform': 'Typeform',
    'shopify': 'Shopify',
    'wordpress': 'WordPress',
    'facebook-pages': 'Facebook Pages',
    'facebook-lead-ads': 'Facebook Lead Ads',
    'facebook-insights': 'Facebook Insights',
    'linkedin': 'LinkedIn',
    'linkedin-lead-gen-forms': 'LinkedIn Lead Gen Forms',
    'linkedin-offline-conversions': 'LinkedIn Offline Conversions',
    'microsoft-excel': 'Microsoft Excel',
    'zoom': 'Zoom',
    'gong': 'Gong',
    'canva': 'Canva',
    'calendly': 'Calendly',
    'apify': 'Apify',
    'browse-ai': 'Browse AI',
    'buffer': 'Buffer',
    'clearbit': 'Clearbit',
    'clickup': 'ClickUp',
    'cloudconvert': 'CloudConvert',
    'elevenlabs': 'ElevenLabs',
    'quickbooks': 'QuickBooks',
    'quickchart': 'QuickChart',
    'salesloft': 'Salesloft',
    'sendinblue': 'Sendinblue',
    'youtube': 'YouTube',
};

/**
 * Format app name from slug
 */
function formatAppName(appSlug: string): string {
    // Check mapping first
    if (APP_NAME_MAP[appSlug]) {
        return APP_NAME_MAP[appSlug];
    }

    // Fallback: capitalize each word
    return appSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Convert camelCase to Title Case
 * Example: "CreateMessage" → "Create Message"
 */
function camelToTitleCase(str: string): string {
    // Insert space before capital letters
    const spaced = str.replace(/([A-Z])/g, ' $1').trim();

    // Capitalize first letter
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Format parameter description by cleaning up label text
 */
export function formatDescription(label: string): string {
    if (!label) return '';

    // Remove trailing periods
    let desc = label.trim().replace(/\.$/, '');

    // Capitalize first letter if not already
    if (desc.length > 0) {
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }

    return desc;
}

/**
 * Generate a description for a module based on its type and name
 */
export function generateModuleDescription(app: string, name: string, type: 'trigger' | 'action' | 'search'): string {
    const actionVerb = type === 'trigger' ? 'Triggers when' : type === 'search' ? 'Searches for' : 'Performs';

    return `${actionVerb} ${name.toLowerCase()} in ${app}.`;
}
