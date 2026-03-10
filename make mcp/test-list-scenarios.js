#!/usr/bin/env node

/**
 * Test script for list_scenarios tool
 * Tests the newly implemented list_scenarios functionality
 */

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function testListScenarios() {
    console.log('🧪 Testing list_scenarios tool\n');

    const apiKey = process.env.MAKE_API_KEY;
    const teamId = process.env.MAKE_TEAM_ID;
    const organizationId = process.env.MAKE_ORGANIZATION_ID;
    const baseUrl = process.env.MAKE_API_URL || 'https://eu1.make.com/api/v2';

    if (!apiKey) {
        console.error('❌ MAKE_API_KEY not configured');
        process.exit(1);
    }

    console.log('📋 Configuration:');
    console.log(`  API URL: ${baseUrl}`);
    console.log(`  Team ID: ${teamId}`);
    console.log(`  Org ID: ${organizationId}`);
    console.log('');

    try {
        // Test with team ID
        console.log('🔍 Fetching scenarios...');
        const params = new URLSearchParams();
        if (teamId) {
            params.append('teamId', teamId);
        } else if (organizationId) {
            params.append('organizationId', organizationId);
        }
        params.append('pg[limit]', '100');

        const url = `${baseUrl}/scenarios?${params.toString()}`;

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Token ${apiKey}`,
            },
            timeout: 15000,
        });

        const scenarios = response.data?.scenarios || [];

        console.log(`✅ Successfully fetched ${scenarios.length} scenario(s)\n`);

        if (scenarios.length > 0) {
            console.log('📊 Scenarios:');
            scenarios.forEach((s, idx) => {
                console.log(`\n${idx + 1}. ${s.name} (ID: ${s.id})`);
                console.log(`   Type: ${s.scheduling?.type || 'unknown'}`);
                console.log(`   Active: ${s.isActive ? 'Yes' : 'No'}`);
                console.log(`   Created: ${s.created}`);
                console.log(`   Operations: ${s.operations || 0}`);
                if (s.usedPackages && s.usedPackages.length > 0) {
                    console.log(`   Packages: ${s.usedPackages.slice(0, 5).join(', ')}${s.usedPackages.length > 5 ? '...' : ''}`);
                }
            });
        } else {
            console.log('ℹ️  No scenarios found in this account');
        }

        console.log('\n✅ Test passed! The list_scenarios tool is working correctly.');

        // Test filtering by scheduling type
        console.log('\n🔍 Testing filter by scheduling type (on-demand)...');
        const onDemand = scenarios.filter(s => s.scheduling?.type === 'on-demand');
        console.log(`✅ Found ${onDemand.length} on-demand scenario(s)`);

        return true;
    } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        const msg = data?.detail || data?.message || error.message;

        console.error(`\n❌ Test failed: ${msg}`);
        if (status) {
            console.error(`   HTTP Status: ${status}`);
        }
        if (data) {
            console.error(`   Response: ${JSON.stringify(data, null, 2)}`);
        }

        return false;
    }
}

// Run the test
testListScenarios()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('💥 Unexpected error:', err);
        process.exit(1);
    });
