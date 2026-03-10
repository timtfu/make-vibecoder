#!/usr/bin/env node

/**
 * Test script for blueprint extraction
 */

import { BlueprintExtractor } from './dist/scrapers/extract-from-blueprints.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const blueprintDir = path.join(__dirname, '..', 'Make example flows');
    const outputDir = path.join(__dirname, 'data');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('🚀 Make.com Blueprint Extraction Tool\n');
    console.log(`Blueprint directory: ${blueprintDir}`);
    console.log(`Output directory: ${outputDir}\n`);

    // Create extractor
    const extractor = new BlueprintExtractor(blueprintDir);

    try {
        // Phase 1: Load blueprints
        const blueprints = await extractor.loadBlueprints();

        // Phase 2: Extract modules
        extractor.extractModulesFromBlueprints(blueprints);

        // Phase 3: Validate
        extractor.validateExtraction();

        // Phase 4: Export code by tier
        await extractor.exportCodeByTier(outputDir);

        // Phase 5: Export report
        await extractor.exportReport(path.join(outputDir, 'extraction-report.json'));

        // Print summary
        extractor.printSummary();

        console.log('✅ Extraction complete!\n');
        console.log('Next steps:');
        console.log('  1. Review generated code in data/tier1-modules.ts');
        console.log('  2. Manually verify top 5 modules against blueprints');
        console.log('  3. Add tier 1 modules to src/scrapers/scrape-modules.ts');
        console.log('  4. Run npm run scrape to rebuild database\n');

    } catch (error) {
        console.error(`❌ Extraction failed:`, error);
        process.exit(1);
    }
}

main().catch(console.error);
