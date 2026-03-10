/**
 * Blueprint Extraction Script
 *
 * Extracts Make.com module definitions from blueprint JSON files.
 * Parses metadata.expect arrays to generate accurate parameter schemas.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    BlueprintParameter,
    MappedParameter,
    mapParameter,
    parseModuleName,
    formatDescription,
    generateModuleDescription
} from './module-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// INTERFACES
// ============================================================================

interface Blueprint {
    name: string;
    flow: BlueprintModule[];
    metadata?: {
        version?: number;
        scenario?: any;
        designer?: any;
    };
}

interface BlueprintModule {
    id: number;
    module: string;  // e.g., "slack:CreateMessage"
    version?: number;
    parameters?: Record<string, any>;
    mapper?: Record<string, any>;
    metadata?: {
        parameters?: BlueprintParameter[];
        expect?: BlueprintParameter[];
        interface?: OutputField[];
    };
}

interface OutputField {
    name: string;
    type: string;
    label?: string;
}

export interface ExtractedModule {
    moduleId: string;           // "slack:CreateMessage"
    app: string;                // "Slack"
    name: string;               // "Create a Message"
    type: 'trigger' | 'action' | 'search';
    description: string;
    parameters: MappedParameter[];
    sourceBlueprints: string[]; // Track where it was found
    usageCount: number;         // How many times it appears
    version?: number;           // Latest version seen
}

interface ExtractionReport {
    totalBlueprints: number;
    totalModulesExtracted: number;
    uniqueModules: number;
    newModules: number;         // Not in existing database
    existingModules: number;    // Already in database
    topModules: { moduleId: string; usageCount: number; }[];
    errors: string[];
    warnings: string[];
}

// ============================================================================
// BLUEPRINT EXTRACTOR CLASS
// ============================================================================

export class BlueprintExtractor {
    private blueprintDir: string;
    private extractedModules: Map<string, ExtractedModule>;
    private report: ExtractionReport;

    constructor(blueprintDir: string) {
        this.blueprintDir = blueprintDir;
        this.extractedModules = new Map();
        this.report = {
            totalBlueprints: 0,
            totalModulesExtracted: 0,
            uniqueModules: 0,
            newModules: 0,
            existingModules: 0,
            topModules: [],
            errors: [],
            warnings: []
        };
    }

    // ========================================================================
    // PHASE 1: LOAD AND PARSE
    // ========================================================================

    /**
     * Load all blueprint JSON files from directory
     */
    async loadBlueprints(): Promise<Blueprint[]> {
        const blueprints: Blueprint[] = [];

        try {
            const files = fs.readdirSync(this.blueprintDir);
            const jsonFiles = files.filter(f => f.endsWith('.blueprint.json'));

            console.log(`📂 Found ${jsonFiles.length} blueprint files`);

            for (const file of jsonFiles) {
                try {
                    const filePath = path.join(this.blueprintDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const blueprint: Blueprint = JSON.parse(content);

                    blueprints.push(blueprint);
                    this.report.totalBlueprints++;
                } catch (error: any) {
                    this.report.errors.push(`Failed to parse ${file}: ${error.message}`);
                }
            }

            console.log(`✅ Loaded ${blueprints.length} blueprints successfully\n`);
        } catch (error: any) {
            this.report.errors.push(`Failed to read directory: ${error.message}`);
            throw error;
        }

        return blueprints;
    }

    // ========================================================================
    // PHASE 2: EXTRACT MODULES
    // ========================================================================

    /**
     * Extract modules from all blueprints
     */
    extractModulesFromBlueprints(blueprints: Blueprint[]): Map<string, ExtractedModule> {
        console.log('🔍 Extracting modules from blueprints...\n');

        for (const blueprint of blueprints) {
            if (!blueprint.flow || !Array.isArray(blueprint.flow)) {
                this.report.warnings.push(`Blueprint "${blueprint.name}" has no flow array`);
                continue;
            }

            for (const flowModule of blueprint.flow) {
                this.extractModule(flowModule, blueprint.name);
            }
        }

        this.report.totalModulesExtracted = this.extractedModules.size;
        this.report.uniqueModules = this.extractedModules.size;

        console.log(`✅ Extracted ${this.extractedModules.size} unique modules\n`);

        return this.extractedModules;
    }

    /**
     * Extract a single module from blueprint flow
     */
    private extractModule(flowModule: BlueprintModule, blueprintName: string): void {
        const moduleId = flowModule.module;

        if (!moduleId || !moduleId.includes(':')) {
            this.report.warnings.push(`Invalid module ID: ${moduleId} in ${blueprintName}`);
            return;
        }

        // Check if we've seen this module before
        let extracted = this.extractedModules.get(moduleId);

        if (extracted) {
            // Update existing entry
            extracted.usageCount++;
            if (!extracted.sourceBlueprints.includes(blueprintName)) {
                extracted.sourceBlueprints.push(blueprintName);
            }
            if (flowModule.version && (!extracted.version || flowModule.version > extracted.version)) {
                extracted.version = flowModule.version;
            }

            // Merge parameters if this instance has more complete metadata
            if (flowModule.metadata?.expect || flowModule.metadata?.parameters) {
                const newParams = this.extractParameters(flowModule);
                if (newParams.length > extracted.parameters.length) {
                    extracted.parameters = newParams;
                }
            }
        } else {
            // Create new entry
            const { app, name, type } = parseModuleName(moduleId);
            const parameters = this.extractParameters(flowModule);
            const description = generateModuleDescription(app, name, type);

            extracted = {
                moduleId,
                app,
                name,
                type,
                description,
                parameters,
                sourceBlueprints: [blueprintName],
                usageCount: 1
            };

            if (flowModule.version !== undefined) {
                extracted.version = flowModule.version;
            }

            this.extractedModules.set(moduleId, extracted);
        }
    }

    /**
     * Extract parameters from module metadata
     */
    private extractParameters(flowModule: BlueprintModule): MappedParameter[] {
        const params: MappedParameter[] = [];

        // Try metadata.expect first (most common)
        const expectArray = flowModule.metadata?.expect || flowModule.metadata?.parameters || [];

        for (const blueprintParam of expectArray) {
            const mapped = mapParameter(blueprintParam);
            if (mapped) {
                params.push(mapped);
            }
        }

        return params;
    }

    // ========================================================================
    // PHASE 3: VALIDATION
    // ========================================================================

    /**
     * Validate extracted modules
     */
    validateExtraction(): void {
        console.log('🔍 Validating extracted modules...\n');

        let validCount = 0;
        let invalidCount = 0;

        for (const [moduleId, module] of this.extractedModules.entries()) {
            const issues = this.validateModule(module);

            if (issues.length > 0) {
                invalidCount++;
                this.report.warnings.push(`Module ${moduleId}: ${issues.join(', ')}`);
            } else {
                validCount++;
            }
        }

        console.log(`✅ Valid modules: ${validCount}`);
        console.log(`⚠️  Modules with warnings: ${invalidCount}\n`);
    }

    /**
     * Validate a single module
     */
    private validateModule(module: ExtractedModule): string[] {
        const issues: string[] = [];

        if (!module.moduleId || !module.moduleId.includes(':')) {
            issues.push('Invalid module ID format');
        }

        if (!module.name || module.name.length === 0) {
            issues.push('Missing module name');
        }

        if (!['trigger', 'action', 'search'].includes(module.type)) {
            issues.push(`Invalid type: ${module.type}`);
        }

        if (module.parameters.length === 0) {
            issues.push('No parameters (may be connection-only module)');
        }

        // Validate each parameter
        for (const param of module.parameters) {
            if (!param.name || !param.type) {
                issues.push(`Invalid parameter: ${JSON.stringify(param)}`);
            }
        }

        return issues;
    }

    // ========================================================================
    // PHASE 4: CODE GENERATION
    // ========================================================================

    /**
     * Generate TypeScript code for scrape-modules.ts
     */
    generateCode(modules: ExtractedModule[], tierName: string = 'Tier 1'): string {
        const sortedModules = Array.from(modules)
            .sort((a, b) => b.usageCount - a.usageCount);

        let code = `// ═══════════════════════════════════════\n`;
        code += `// ${tierName.toUpperCase()}: EXTRACTED FROM BLUEPRINTS\n`;
        code += `// Generated: ${new Date().toISOString().split('T')[0]}\n`;
        code += `// Total modules: ${sortedModules.length}\n`;
        code += `// ═══════════════════════════════════════\n\n`;

        for (const module of sortedModules) {
            code += this.generateModuleCode(module);
            code += '\n';
        }

        return code;
    }

    /**
     * Generate code for a single module
     */
    private generateModuleCode(module: ExtractedModule): string {
        // Generate parameter array
        const paramCode = module.parameters.map(p => this.generateParameterCode(p)).join(',\n      ');

        // Build module call
        let code = `    // ${module.moduleId} (${module.usageCount} uses)\n`;
        code += `    m('${module.moduleId}', '${this.escapeString(module.name)}', '${this.escapeString(module.app)}', '${module.type}',\n`;
        code += `      '${this.escapeString(module.description)}',\n`;
        code += `      [${paramCode ? '\n      ' + paramCode + '\n    ' : ''}]),\n`;

        return code;
    }

    /**
     * Generate code for a parameter
     */
    private generateParameterCode(param: MappedParameter): string {
        const extra = param.extra && Object.keys(param.extra).length > 0
            ? ', ' + JSON.stringify(param.extra)
            : '';

        return `p('${param.name}', '${param.type}', ${param.required}, '${this.escapeString(param.description)}'${extra})`;
    }

    /**
     * Escape string for code generation
     */
    private escapeString(str: string | undefined): string {
        if (!str) return '';
        return str.replace(/'/g, "\\'").replace(/\n/g, ' ');
    }

    // ========================================================================
    // PHASE 5: REPORTING
    // ========================================================================

    /**
     * Generate extraction statistics
     */
    generateReport(): ExtractionReport {
        // Get top modules by usage
        const sortedModules = Array.from(this.extractedModules.values())
            .sort((a, b) => b.usageCount - a.usageCount);

        this.report.topModules = sortedModules
            .slice(0, 20)
            .map(m => ({ moduleId: m.moduleId, usageCount: m.usageCount }));

        return this.report;
    }

    /**
     * Print summary statistics
     */
    printSummary(): void {
        const report = this.generateReport();

        console.log('\n' + '='.repeat(60));
        console.log('📊 EXTRACTION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Blueprints processed: ${report.totalBlueprints}`);
        console.log(`Unique modules found: ${report.uniqueModules}`);
        console.log(`Errors: ${report.errors.length}`);
        console.log(`Warnings: ${report.warnings.length}`);
        console.log('\n📈 TOP 10 MODULES BY USAGE:');
        report.topModules.slice(0, 10).forEach((m, i) => {
            console.log(`  ${i + 1}. ${m.moduleId} (${m.usageCount} uses)`);
        });
        console.log('\n');

        if (report.errors.length > 0) {
            console.log('❌ ERRORS:');
            report.errors.forEach(e => console.log(`  - ${e}`));
            console.log('\n');
        }
    }

    /**
     * Export report to JSON file
     */
    async exportReport(outputPath: string): Promise<void> {
        const report = this.generateReport();
        const json = JSON.stringify(report, null, 2);
        fs.writeFileSync(outputPath, json, 'utf-8');
        console.log(`✅ Report exported to ${outputPath}\n`);
    }

    /**
     * Export generated code to files (by tier)
     */
    async exportCodeByTier(outputDir: string): Promise<void> {
        const modules = Array.from(this.extractedModules.values());

        // Tier 1: High usage (≥5 uses)
        const tier1 = modules.filter(m => m.usageCount >= 5);
        const tier1Code = this.generateCode(tier1, 'Tier 1: High Usage');
        const tier1Path = path.join(outputDir, 'tier1-modules.ts');
        fs.writeFileSync(tier1Path, tier1Code, 'utf-8');
        console.log(`✅ Tier 1 code (${tier1.length} modules) → ${tier1Path}`);

        // Tier 2: Medium usage (2-4 uses)
        const tier2 = modules.filter(m => m.usageCount >= 2 && m.usageCount < 5);
        const tier2Code = this.generateCode(tier2, 'Tier 2: Medium Usage');
        const tier2Path = path.join(outputDir, 'tier2-modules.ts');
        fs.writeFileSync(tier2Path, tier2Code, 'utf-8');
        console.log(`✅ Tier 2 code (${tier2.length} modules) → ${tier2Path}`);

        // Tier 3: Single use (1 use)
        const tier3 = modules.filter(m => m.usageCount === 1);
        const tier3Code = this.generateCode(tier3, 'Tier 3: Specialty');
        const tier3Path = path.join(outputDir, 'tier3-modules.ts');
        fs.writeFileSync(tier3Path, tier3Code, 'utf-8');
        console.log(`✅ Tier 3 code (${tier3.length} modules) → ${tier3Path}\n`);
    }

    /**
     * Get extracted modules map
     */
    getExtractedModules(): Map<string, ExtractedModule> {
        return this.extractedModules;
    }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Main extraction workflow
 */
async function main() {
    const projectRoot = path.join(__dirname, '..', '..');
    const blueprintDir = path.join(projectRoot, '..', 'Make example flows');
    const outputDir = path.join(projectRoot, 'data');

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

    } catch (error: any) {
        console.error(`❌ Extraction failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
