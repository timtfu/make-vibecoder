#!/usr/bin/env node

/**
 * CLI runner for blueprint extraction
 * Usage: npm run extract-blueprints
 */

import('../dist/scrapers/extract-from-blueprints.js')
    .then(module => {
        console.log('Starting blueprint extraction...\n');
        // The main() function in extract-from-blueprints.ts runs automatically
    })
    .catch(err => {
        console.error('Failed to run extraction:', err);
        process.exit(1);
    });
