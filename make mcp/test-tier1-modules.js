#!/usr/bin/env node

/**
 * Test script to verify Tier 1 modules are in the database
 */

import { MakeDatabase } from './dist/database/db.js';

const db = new MakeDatabase();

console.log('🔍 Testing Tier 1 Modules Integration\n');

const tier1Modules = [
    'slack:CreateMessage',
    'openai-gpt-3:CreateCompletion',
    'util:TextAggregator'
];

console.log('📋 Checking if Tier 1 modules exist in database:\n');

let allFound = true;

for (const moduleId of tier1Modules) {
    const module = db.getModule(moduleId);

    if (module) {
        console.log(`✅ ${moduleId}`);
        console.log(`   Name: ${module.name}`);
        console.log(`   App: ${module.app}`);
        console.log(`   Parameters: ${module.parameters ? JSON.parse(module.parameters).length : 0}`);
        console.log('');
    } else {
        console.log(`❌ ${moduleId} - NOT FOUND`);
        allFound = false;
    }
}

console.log('═'.repeat(60));

if (allFound) {
    console.log('✅ All Tier 1 modules successfully integrated!\n');
} else {
    console.log('❌ Some modules are missing\n');
    process.exit(1);
}

// Test search functionality
console.log('🔍 Testing search functionality:\n');

const searchTests = [
    { query: 'slack message', expectedModule: 'slack:CreateMessage' },
    { query: 'openai completion', expectedModule: 'openai-gpt-3:CreateCompletion' },
    { query: 'text aggregator', expectedModule: 'util:TextAggregator' }
];

for (const test of searchTests) {
    const results = db.searchModules(test.query);
    const found = results.some(r => r.id === test.expectedModule);

    if (found) {
        console.log(`✅ Search "${test.query}" → Found ${test.expectedModule}`);
    } else {
        console.log(`❌ Search "${test.query}" → ${test.expectedModule} not found`);
        console.log(`   Results: ${results.map(r => r.id).join(', ')}`);
    }
}

console.log('\n✅ Tier 1 integration tests complete!');
db.close();
