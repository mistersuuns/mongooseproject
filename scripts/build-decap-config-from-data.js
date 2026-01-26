#!/usr/bin/env node

/**
 * Build Decap CMS Config from Extracted Framer CMS Data
 * 
 * This script:
 * 1. Analyzes all extracted JSON data to discover fields and types
 * 2. Generates Decap CMS config.yml dynamically
 * 3. Ensures ALL fields from Framer CMS are included
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const configPath = path.join(__dirname, '../site/admin/config.yml');

/**
 * Analyze a JSON array to discover all fields and their types
 */
function analyzeCollection(data, collectionName) {
    if (!Array.isArray(data) || data.length === 0) {
        return { fields: [], sample: null };
    }
    
    const fieldTypes = new Map(); // fieldName -> { type, required, examples }
    const sample = data[0]; // Use first item as sample
    
    // Analyze all items to find all possible fields
    for (const item of data) {
        for (const [fieldName, value] of Object.entries(item)) {
            if (!fieldTypes.has(fieldName)) {
                fieldTypes.set(fieldName, {
                    name: fieldName,
                    type: inferType(value),
                    required: value !== null && value !== undefined && value !== '',
                    examples: []
                });
            }
            
            const fieldInfo = fieldTypes.get(fieldName);
            
            // Update required status
            if (value === null || value === undefined || value === '') {
                fieldInfo.required = false;
            }
            
            // Collect examples
            if (value && fieldInfo.examples.length < 3) {
                if (typeof value === 'string' && value.length < 100) {
                    fieldInfo.examples.push(value);
                } else if (Array.isArray(value) && value.length > 0) {
                    fieldInfo.examples.push(value[0]);
                }
            }
        }
    }
    
    return {
        fields: Array.from(fieldTypes.values()),
        sample: sample
    };
}

/**
 * Infer Decap CMS widget type from JavaScript value
 */
function inferType(value) {
    if (value === null || value === undefined) {
        return 'string'; // Default
    }
    
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0].file) {
            return 'file-list'; // List of files
        }
        return 'list'; // List of strings
    }
    
    if (typeof value === 'boolean') {
        return 'boolean';
    }
    
    if (typeof value === 'number') {
        return 'number';
    }
    
    if (typeof value === 'string') {
        // Check for URLs
        if (value.match(/^https?:\/\//)) {
            if (value.includes('framerusercontent.com/images/')) {
                return 'image';
            }
            return 'string'; // URL field
        }
        
        // Check for dates
        if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.match(/T\d{2}:\d{2}:\d{2}/)) {
            return 'datetime';
        }
        
        // Check for long text
        if (value.length > 200) {
            return 'text';
        }
        
        return 'string';
    }
    
    if (typeof value === 'object') {
        // Could be a file object
        if (value.file || value.url) {
            return 'file';
        }
        return 'object';
    }
    
    return 'string';
}

/**
 * Map field name to Decap CMS widget
 */
function getDecapWidget(fieldName, fieldInfo) {
    const widgetMap = {
        'title': 'string',
        'slug': 'string',
        'name': 'string',
        'description': 'text',
        'body': 'markdown',
        'content': 'markdown',
        'date': 'datetime',
        'image': 'image',
        'url': 'string',
        'link': 'string',
        'position': 'string',
        'category': 'string',
        'journal': 'string',
        'authors': 'list',
        'files': 'file-list'
    };
    
    // Use mapping if available
    if (widgetMap[fieldName]) {
        return widgetMap[fieldName];
    }
    
    // Otherwise use inferred type
    return fieldInfo.type;
}

/**
 * Generate Decap CMS field config
 */
function generateFieldConfig(fieldInfo, collectionName) {
    const widget = getDecapWidget(fieldInfo.name, fieldInfo);
    
    const field = {
        label: fieldInfo.name.charAt(0).toUpperCase() + fieldInfo.name.slice(1).replace(/_/g, ' '),
        name: fieldInfo.name,
        widget: widget,
        required: fieldInfo.required
    };
    
    // Add widget-specific config
    if (widget === 'list') {
        field.default = [];
    } else if (widget === 'file-list') {
        field.fields = [{ label: 'File', name: 'file', widget: 'file' }];
        field.default = [];
    } else if (widget === 'datetime') {
        // No additional config needed
    } else if (widget === 'text' || widget === 'markdown') {
        // No additional config needed
    }
    
    // Make common optional fields explicitly optional
    const optionalFields = ['url', 'link', 'description', 'category', 'image', 'files', 'journal', 'date'];
    if (optionalFields.includes(fieldInfo.name)) {
        field.required = false;
    }
    
    return field;
}

/**
 * Generate Decap CMS collection config
 */
function generateCollectionConfig(collectionName, analysis, folderPath) {
    const config = {
        name: collectionName,
        label: collectionName.charAt(0).toUpperCase() + collectionName.slice(1),
        folder: folderPath,
        create: true,
        slug: '{{slug}}',
        format: 'frontmatter',
        extension: 'md'
    };
    
    // Generate summary (use first few important fields)
    const importantFields = ['title', 'date', 'position', 'journal', 'description'].filter(f => 
        analysis.fields.some(field => field.name === f)
    );
    const summaryFields = importantFields.slice(0, 2).map(f => `{{${f}}}`).join(' | ');
    if (summaryFields) {
        config.summary = summaryFields;
    }
    
    // Generate sortable fields
    const sortableFields = analysis.fields
        .filter(f => ['string', 'datetime', 'number'].includes(f.type))
        .map(f => f.name)
        .slice(0, 5);
    if (sortableFields.length > 0) {
        config.sortable_fields = sortableFields;
    }
    
    // Generate fields
    config.fields = analysis.fields
        .filter(f => f.name !== 'id') // Skip internal ID
        .map(fieldInfo => generateFieldConfig(fieldInfo, collectionName));
    
    return config;
}

/**
 * Main execution
 */
console.log('🚀 Building Decap CMS Config from Extracted Data\n');
console.log('='.repeat(60) + '\n');

// Load extracted data
const collections = [];

// Publications
const pubsPath = path.join(dataDir, 'publications-all-fields.json');
if (fs.existsSync(pubsPath)) {
    const pubs = JSON.parse(fs.readFileSync(pubsPath, 'utf8'));
    const analysis = analyzeCollection(pubs, 'publications');
    collections.push({
        name: 'publications',
        folder: 'data/publications',
        analysis: analysis
    });
    console.log(`✅ Analyzed ${pubs.length} publications`);
    console.log(`   Fields: ${analysis.fields.map(f => f.name).join(', ')}\n`);
}

// People
const peoplePath = path.join(dataDir, 'people-all-fields.json');
if (fs.existsSync(peoplePath)) {
    const people = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));
    const analysis = analyzeCollection(people, 'people');
    collections.push({
        name: 'people',
        folder: 'data/people',
        analysis: analysis
    });
    console.log(`✅ Analyzed ${people.length} people`);
    console.log(`   Fields: ${analysis.fields.map(f => f.name).join(', ')}\n`);
}

// News
const newsPath = path.join(dataDir, 'news-all-fields.json');
if (fs.existsSync(newsPath)) {
    const news = JSON.parse(fs.readFileSync(newsPath, 'utf8'));
    const analysis = analyzeCollection(news, 'news');
    collections.push({
        name: 'news',
        folder: 'data/news',
        analysis: analysis
    });
    console.log(`✅ Analyzed ${news.length} news items`);
    console.log(`   Fields: ${analysis.fields.map(f => f.name).join(', ')}\n`);
}

// Generate Decap CMS config
console.log('📝 Generating Decap CMS config...\n');

// Read existing config to preserve backend settings
let existingConfig = '';
if (fs.existsSync(configPath)) {
    existingConfig = fs.readFileSync(configPath, 'utf8');
}

// Extract backend section
const backendMatch = existingConfig.match(/(backend:[\s\S]+?)(collections:|$)/);
const backendSection = backendMatch ? backendMatch[1] : `backend:
  name: git-gateway
  repo: mistersuuns/mongooseproject
  branch: main
`;

// Extract media folder (get first match, not all)
const mediaMatch = existingConfig.match(/^media_folder:\s*["']([^"']+)["']/m);
const mediaFolder = mediaMatch ? mediaMatch[1] : 'site/images/uploads';

const publicMatch = existingConfig.match(/^public_folder:\s*["']([^"']+)["']/m);
const publicFolder = publicMatch ? publicMatch[1] : '/images/uploads';

// Generate collections section
const collectionsYaml = collections.map(coll => {
    const collConfig = generateCollectionConfig(coll.name, coll.analysis, coll.folder);
    
    // Convert to YAML
    let yaml = `  - name: "${collConfig.name}"
    label: "${collConfig.label}"
    folder: "${collConfig.folder}"
    create: ${collConfig.create}
    slug: "${collConfig.slug}"
    format: "${collConfig.format}"
    extension: "${collConfig.extension}"`;
    
    if (collConfig.summary) {
        yaml += `\n    summary: "${collConfig.summary}"`;
    }
    
    if (collConfig.sortable_fields) {
        yaml += `\n    sortable_fields: [${collConfig.sortable_fields.map(f => `"${f}"`).join(', ')}]`;
    }
    
    yaml += `\n    fields:`;
    for (const field of collConfig.fields) {
        yaml += `\n      - {label: "${field.label}", name: "${field.name}", widget: "${field.widget}"`;
        if (field.required === false) {
            yaml += `, required: false`;
        }
        if (field.default !== undefined) {
            yaml += `, default: ${JSON.stringify(field.default)}`;
        }
        if (field.fields) {
            yaml += `, fields: [${field.fields.map(f => `{label: "${f.label}", name: "${f.name}", widget: "${f.widget}"}`).join(', ')}]`;
        }
        yaml += `}`;
    }
    
    return yaml;
}).join('\n\n');

// Build complete config
const config = `${backendSection.trim()}

# Uncomment below to enable drafts
# publish_mode: editorial_workflow

media_folder: "${mediaFolder}"
public_folder: "${publicFolder}"

collections:
${collectionsYaml}
`;

// Write config
fs.writeFileSync(configPath, config);

console.log('✅ Decap CMS config generated!\n');
console.log(`📄 Config saved to: ${configPath}\n`);
console.log('📋 Collections configured:');
collections.forEach(coll => {
    console.log(`  - ${coll.name}: ${coll.analysis.fields.length} fields`);
});
