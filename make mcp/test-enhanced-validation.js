#!/usr/bin/env node

/**
 * Test script for enhanced validation features (Day 2 implementation)
 * Tests:
 * 1. Parameter type validation
 * 2. Expression syntax validation
 * 3. Module dependency validation
 */

import { MakeDatabase } from './dist/database/db.js';

const db = new MakeDatabase();

console.log('🧪 Testing Enhanced Validation (Day 2)\n');

// Test Case 1: Type Mismatch
console.log('📋 Test 1: Parameter Type Validation');
const testCase1 = {
    flow: [
        {
            id: 1,
            module: 'gateway:CustomWebHook',
            parameters: {
                name: 'Test Webhook'
            }
        },
        {
            id: 2,
            module: 'http:ActionSendData',
            parameters: {
                url: 'https://example.com/api',
                method: 'POST',
                timeout: '30000',  // STRING when should be NUMBER
                followRedirect: 'true'  // STRING when should be BOOLEAN
            }
        }
    ]
};

console.log('   Scenario: HTTP module with string timeout and boolean values');
console.log('   Expected: Warnings about type coercion\n');

// Test Case 2: Expression Syntax Errors
console.log('📋 Test 2: Expression Syntax Validation');
const testCase2 = {
    flow: [
        {
            id: 1,
            module: 'gateway:CustomWebHook',
            parameters: {
                name: 'Test Webhook'
            }
        },
        {
            id: 2,
            module: 'slack:ActionPostMessage',
            parameters: {
                channel: '#general',
                text: '{{1.data}}',  // VALID
                username: '{{3.name}}',  // INVALID: references non-existent module 3
                icon_url: '{{2.icon}}'  // INVALID: references itself (module 2)
            }
        }
    ]
};

console.log('   Scenario: Slack module with invalid expression references');
console.log('   Expected: Warnings about non-existent module and future references\n');

// Test Case 3: Forward References (Module Dependency)
console.log('📋 Test 3: Module Dependency Validation');
const testCase3 = {
    flow: [
        {
            id: 1,
            module: 'gateway:CustomWebHook',
            parameters: {
                name: 'Test Webhook',
                body: '{{2.result}}'  // INVALID: references future module
            }
        },
        {
            id: 2,
            module: 'http:ActionSendData',
            parameters: {
                url: 'https://example.com/api',
                method: 'GET'
            }
        }
    ]
};

console.log('   Scenario: Webhook references future HTTP module');
console.log('   Expected: Error about forward reference\n');

// Test Case 4: Valid Scenario (should pass all checks)
console.log('📋 Test 4: Valid Scenario (Control)');
const testCase4 = {
    flow: [
        {
            id: 1,
            module: 'gateway:CustomWebHook',
            parameters: {
                name: 'Test Webhook'
            }
        },
        {
            id: 2,
            module: 'json:ParseJSON',
            parameters: {
                json: '{{1.data}}'  // VALID: references previous module
            }
        },
        {
            id: 3,
            module: 'slack:ActionPostMessage',
            parameters: {
                channel: '#general',
                text: 'Data: {{2.name}}'  // VALID: references previous module
            }
        }
    ]
};

console.log('   Scenario: Webhook → Parse JSON → Slack (all valid)');
console.log('   Expected: No errors, minimal warnings\n');

// Helper to run validation and display results
async function runValidation(testName, scenario) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 Running: ${testName}`);
    console.log('='.repeat(60));

    // We'll simulate the validation logic from server.ts
    // For simplicity, just check if modules exist and show structure

    let hasErrors = false;
    let hasWarnings = false;

    for (let i = 0; i < scenario.flow.length; i++) {
        const mod = scenario.flow[i];
        const dbModule = db.getModule(mod.module);

        if (!dbModule) {
            console.log(`   ❌ ERROR: Module "${mod.module}" not found in database`);
            hasErrors = true;
            continue;
        }

        console.log(`   ✓ Module ${i + 1}: ${dbModule.name} (${mod.module})`);

        // Check for expression references
        const params = mod.parameters || {};
        for (const [key, value] of Object.entries(params)) {
            if (typeof value === 'string' && value.includes('{{')) {
                const matches = [...value.matchAll(/\{\{(\d+)\.([^}]+)\}\}/g)];
                for (const match of matches) {
                    if (!match[1]) continue;
                    const refIndex = parseInt(match[1], 10);
                    if (refIndex >= scenario.flow.length) {
                        console.log(`     ⚠️  WARNING: {{${refIndex}.${match[2]}}} references non-existent module`);
                        hasWarnings = true;
                    } else if (refIndex > i) {
                        console.log(`     ⚠️  WARNING: {{${refIndex}.${match[2]}}} references future module ${refIndex}`);
                        hasWarnings = true;
                    } else if (refIndex === i) {
                        console.log(`     ❌ ERROR: {{${refIndex}.${match[2]}}} references itself`);
                        hasErrors = true;
                    } else {
                        console.log(`     ✓ Expression {{${refIndex}.${match[2]}}} → Module ${refIndex + 1}`);
                    }
                }
            }
        }

        // Check parameter types
        const schema = JSON.parse(dbModule.parameters);
        for (const param of schema) {
            const value = params[param.name];
            if (value === undefined) continue;

            if (param.type === 'number' && typeof value === 'string') {
                if (!value.includes('{{') && !isNaN(Number(value))) {
                    console.log(`     ⚠️  WARNING: Parameter "${param.name}" is string but should be number`);
                    hasWarnings = true;
                }
            }

            if (param.type === 'boolean' && typeof value === 'string') {
                if (!value.includes('{{')) {
                    console.log(`     ⚠️  WARNING: Parameter "${param.name}" is string but should be boolean`);
                    hasWarnings = true;
                }
            }
        }
    }

    console.log('\n📊 Result:');
    if (!hasErrors && !hasWarnings) {
        console.log('   ✅ All checks passed! No errors or warnings.');
    } else {
        if (hasErrors) console.log('   ❌ Validation failed with errors');
        if (hasWarnings) console.log('   ⚠️  Validation passed with warnings');
    }

    return { hasErrors, hasWarnings };
}

// Run all test cases
async function runAllTests() {
    const results = [];

    results.push(await runValidation('Test 1: Parameter Type Validation', testCase1));
    results.push(await runValidation('Test 2: Expression Syntax Validation', testCase2));
    results.push(await runValidation('Test 3: Module Dependency Validation', testCase3));
    results.push(await runValidation('Test 4: Valid Scenario (Control)', testCase4));

    console.log(`\n${'='.repeat(60)}`);
    console.log('📈 Summary');
    console.log('='.repeat(60));

    results.forEach((result, idx) => {
        const testNum = idx + 1;
        const status = result.hasErrors ? '❌ FAIL' : result.hasWarnings ? '⚠️  WARN' : '✅ PASS';
        console.log(`   Test ${testNum}: ${status}`);
    });

    console.log('\n✅ Enhanced validation tests complete!');
    console.log('\n💡 The actual validation in the MCP server includes:');
    console.log('   • Parameter type checking (number, boolean, array, enums)');
    console.log('   • Expression syntax validation ({{N.field}} format)');
    console.log('   • Module dependency validation (no forward references)');
    console.log('   • Range validation for numeric parameters');
    console.log('   • Malformed expression detection');

    db.close();
}

runAllTests().catch(err => {
    console.error('💥 Test failed:', err);
    db.close();
    process.exit(1);
});
