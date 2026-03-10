#!/usr/bin/env node

/**
 * Merge Tier 2 and Tier 3 modules into scrape-modules.ts
 * Skips duplicates that already exist in the database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Duplicates to skip from Tier 2 (already exist in database)
const TIER2_DUPLICATES = [
    'gateway:CustomWebHook',
    'json:ParseJSON',
    'airtable:ActionCreateRecord'
];

console.log('🔧 Merging Tier 2 and Tier 3 modules into scrape-modules.ts\n');

// Read files
const tier2Path = path.join(__dirname, 'data', 'tier2-modules.ts');
const tier3Path = path.join(__dirname, 'data', 'tier3-modules.ts');
const scrapeModulesPath = path.join(__dirname, 'src', 'scrapers', 'scrape-modules.ts');

const tier2Content = fs.readFileSync(tier2Path, 'utf-8');
const tier3Content = fs.readFileSync(tier3Path, 'utf-8');
let scrapeModules = fs.readFileSync(scrapeModulesPath, 'utf-8');

// Filter out duplicates from Tier 2
console.log('📋 Filtering Tier 2 duplicates...');
let tier2Filtered = tier2Content;

for (const dup of TIER2_DUPLICATES) {
    const regex = new RegExp(`    // ${dup.replace(/:/g, ':')}[\\s\\S]*?\\]\\),\\n\\n`, 'g');
    const before = tier2Filtered;
    tier2Filtered = tier2Filtered.replace(regex, '');
    if (before !== tier2Filtered) {
        console.log(`  ⏭️  Skipped duplicate: ${dup}`);
    }
}

// Count modules in each tier
const tier2Count = (tier2Filtered.match(/^    \/\/ /gm) || []).length;
const tier3Count = (tier3Content.match(/^    \/\/ /gm) || []).length;

console.log(`\n✅ Tier 2: ${tier2Count} modules (skipped ${TIER2_DUPLICATES.length} duplicates)`);
console.log(`✅ Tier 3: ${tier3Count} modules\n`);

// Prepare Tier 2 content with updated header
const tier2Header = `
            // ═══════════════════════════════════════
            // TIER 2: EXTRACTED FROM BLUEPRINTS (Medium Usage 2-4)
            // Source: 42 Make.com production blueprints
            // Extraction date: 2026-03-09
            // Total: ${tier2Count} modules (excluded ${TIER2_DUPLICATES.length} duplicates)
            // ═══════════════════════════════════════
`;

// Prepare Tier 3 content with updated header
const tier3Header = `
            // ═══════════════════════════════════════
            // TIER 3: EXTRACTED FROM BLUEPRINTS (Specialty, 1 use)
            // Source: 42 Make.com production blueprints
            // Extraction date: 2026-03-09
            // Total: ${tier3Count} modules
            // ═══════════════════════════════════════
`;

// Remove old headers and keep only module definitions
const tier2Modules = tier2Filtered
    .replace(/^\/\/ ═+\n\/\/ TIER 2.*?\n\/\/ ═+\n\n/s, '')
    .trim();

const tier3Modules = tier3Content
    .replace(/^\/\/ ═+\n\/\/ TIER 3.*?\n\/\/ ═+\n\n/s, '')
    .trim();

// Find insertion point (after Tier 1 section, before closing bracket)
const tier1EndPattern = /(\s+p\('value', 'text', false, 'Text value to aggregate from each bundle'\)\s+\]\),)\s+(];)/s;

const replacement = `$1
${tier2Header}
${tier2Modules}

${tier3Header}
${tier3Modules}
        $2`;

const updated = scrapeModules.replace(tier1EndPattern, replacement);

if (updated === scrapeModules) {
    console.error('❌ Failed to find insertion point in scrape-modules.ts');
    console.error('   Looking for end of Tier 1 section...');
    process.exit(1);
}

// Write updated file
fs.writeFileSync(scrapeModulesPath, updated, 'utf-8');

console.log('✅ Successfully merged Tier 2 and Tier 3 into scrape-modules.ts');
console.log(`\n📊 Total new modules added: ${tier2Count + tier3Count}`);
console.log(`   Database will expand from 227 to ${227 + tier2Count + tier3Count} modules\n`);
