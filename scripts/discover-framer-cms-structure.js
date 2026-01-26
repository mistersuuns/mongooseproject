#!/usr/bin/env node

/**
 * Discover Framer CMS Structure Dynamically
 * 
 * This script:
 * 1. Analyzes all HTML pages to discover collections
 * 2. Extracts field names and types from handover JSON
 * 3. Discovers categories/groupings
 * 4. Generates a schema that can be used to build Decap CMS config
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.join(__dirname, '../site');
const dataDir = path.join(__dirname, '../data');

/**
 * Discover collections by analyzing URL patterns and content structure
 */
function discoverCollections() {
    console.log('🔍 Discovering Framer CMS collections...\n');
    
    const collections = new Map(); // collectionName -> { items: [], fields: Set, categories: Set }
    
    // Analyze searchIndex.json to find all items
    const searchIndexPath = path.join(dataDir, 'searchIndex.json');
    if (!fs.existsSync(searchIndexPath)) {
        console.warn('⚠️  searchIndex.json not found. Run extraction first.');
        return collections;
    }
    
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    
    // Group items by collection based on URL patterns
    for (const [url, data] of Object.entries(searchIndex)) {
        // Determine collection from URL pattern
        let collectionName = null;
        
        if (url.includes('/pubs-news-ppl/')) {
            const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
            
            // Try to determine type from content/context
            // This is heuristic - we'll refine based on actual data
            if (data.h1 && data.h1[0]) {
                const title = data.h1[0].toLowerCase();
                
                // Check if it's a person (has position-like text, or matches person patterns)
                const isPerson = data.p && data.p.some(p => 
                    p.match(/(Professor|Student|Fellow|Manager|Lecturer|Director|Chair)/i)
                );
                
                // Check if it's news (short title, recent date)
                const isNews = title.length < 100 && 
                    (title.includes('new') || title.includes('grant') || title.includes('funding'));
                
                // Check if it's a publication (has authors, journal, year)
                const isPublication = data.h2 && data.h2.length > 0; // Has authors (h2)
                
                if (isPerson) {
                    collectionName = 'people';
                } else if (isNews) {
                    collectionName = 'news';
                } else if (isPublication) {
                    collectionName = 'publications';
                } else {
                    // Default: try to infer from slug or content
                    collectionName = 'publications'; // Most common
                }
            } else {
                collectionName = 'publications'; // Default
            }
        }
        
        if (!collectionName) continue;
        
        // Initialize collection if needed
        if (!collections.has(collectionName)) {
            collections.set(collectionName, {
                name: collectionName,
                items: [],
                fields: new Set(),
                categories: new Set(),
                fieldTypes: new Map() // fieldName -> detected type
            });
        }
        
        const collection = collections.get(collectionName);
        collection.items.push({ url, slug: url.replace(/.*\//, '').replace('.html', ''), data });
        
        // Extract field names from data structure
        if (data.h1) collection.fields.add('title');
        if (data.h2) collection.fields.add('authors');
        if (data.p) collection.fields.add('description');
        if (data.description) collection.fields.add('description');
        
        // Try to extract more fields from HTML
        const htmlPath = path.join(siteDir, url.replace(/^\//, ''));
        if (fs.existsSync(htmlPath)) {
            const html = fs.readFileSync(htmlPath, 'utf8');
            extractFieldsFromHTML(html, collection);
        }
    }
    
    return collections;
}

/**
 * Extract field names and types from HTML and handover JSON
 */
function extractFieldsFromHTML(html, collection) {
    // Extract from handover JSON
    try {
        const handoverMatch = html.match(/<script type="framer\/handover"[^>]*>([\s\S]+?)<\/script>/);
        if (handoverMatch) {
            const jsonData = JSON.parse(handoverMatch[1]);
            extractFieldsFromHandover(jsonData, collection);
        }
    } catch (e) {
        // Ignore JSON parsing errors
    }
    
    // Extract from meta tags
    const metaMatches = Array.from(html.matchAll(/<meta[^>]*property=["']([^"']+)["'][^>]*content=["']([^"']+)["']/gi));
    for (const match of metaMatches) {
        const property = match[1];
        if (property.startsWith('og:')) {
            const fieldName = property.replace('og:', '');
            collection.fields.add(fieldName);
            if (fieldName === 'image') {
                collection.fieldTypes.set('image', 'image');
            }
        }
    }
    
    // Extract from structured data (JSON-LD)
    const jsonLdMatches = Array.from(html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]+?)<\/script>/gi));
    for (const match of jsonLdMatches) {
        try {
            const jsonLd = JSON.parse(match[1]);
            extractFieldsFromJSONLD(jsonLd, collection);
        } catch (e) {
            // Ignore
        }
    }
    
    // Extract common patterns
    if (html.includes('framerusercontent.com/images/')) {
        collection.fields.add('image');
        collection.fieldTypes.set('image', 'image');
    }
    
    if (html.includes('framerusercontent.com/assets/') && html.includes('.pdf')) {
        collection.fields.add('files');
        collection.fieldTypes.set('files', 'file');
    }
    
    // Extract date patterns
    const datePatterns = [
        /\b(19|20)\d{2}\b/, // Years
        /\d{1,2}\/\d{1,2}\/\d{4}/, // Dates
        /\d{4}-\d{2}-\d{2}/ // ISO dates
    ];
    
    for (const pattern of datePatterns) {
        if (pattern.test(html)) {
            collection.fields.add('date');
            collection.fieldTypes.set('date', 'datetime');
            break;
        }
    }
}

/**
 * Recursively extract fields from handover JSON
 */
function extractFieldsFromHandover(obj, collection, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion
    
    if (Array.isArray(obj)) {
        obj.forEach(item => extractFieldsFromHandover(item, collection, depth + 1));
    } else if (typeof obj === 'object' && obj !== null) {
        // Look for known Framer CMS field patterns
        for (const [key, value] of Object.entries(obj)) {
            // Framer uses encoded keys - we'll detect common patterns
            if (typeof value === 'string') {
                // Detect field types
                if (value.match(/^https?:\/\//)) {
                    if (value.includes('framerusercontent.com/images/')) {
                        collection.fields.add('image');
                        collection.fieldTypes.set('image', 'image');
                    } else if (value.includes('.pdf')) {
                        collection.fields.add('files');
                        collection.fieldTypes.set('files', 'file');
                    } else {
                        collection.fields.add('url');
                        collection.fieldTypes.set('url', 'string');
                    }
                } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
                    collection.fields.add('date');
                    collection.fieldTypes.set('date', 'datetime');
                } else if (value.length > 100) {
                    collection.fields.add('description');
                    collection.fieldTypes.set('description', 'text');
                } else if (value.length > 0 && value.length < 50) {
                    collection.fields.add('title');
                    collection.fieldTypes.set('title', 'string');
                }
            } else if (Array.isArray(value)) {
                collection.fields.add(key);
                collection.fieldTypes.set(key, 'list');
            }
            
            extractFieldsFromHandover(value, collection, depth + 1);
        }
    }
}

/**
 * Extract fields from JSON-LD structured data
 */
function extractFieldsFromJSONLD(obj, collection, depth = 0) {
    if (depth > 5) return;
    
    if (Array.isArray(obj)) {
        obj.forEach(item => extractFieldsFromJSONLD(item, collection, depth + 1));
    } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
            // Map JSON-LD properties to fields
            const fieldMap = {
                'name': 'title',
                'headline': 'title',
                'description': 'description',
                'image': 'image',
                'datePublished': 'date',
                'author': 'authors'
            };
            
            const fieldName = fieldMap[key] || key;
            collection.fields.add(fieldName);
            
            if (typeof value === 'string') {
                if (value.match(/^https?:\/\//)) {
                    collection.fieldTypes.set(fieldName, 'image');
                } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
                    collection.fieldTypes.set(fieldName, 'datetime');
                } else {
                    collection.fieldTypes.set(fieldName, 'string');
                }
            } else if (Array.isArray(value)) {
                collection.fieldTypes.set(fieldName, 'list');
            }
            
            extractFieldsFromJSONLD(value, collection, depth + 1);
        }
    }
}

/**
 * Analyze all items to discover all possible fields
 */
function analyzeAllFields(collections) {
    console.log('📊 Analyzing all items to discover fields...\n');
    
    for (const [collectionName, collection] of collections) {
        console.log(`  Analyzing ${collection.items.length} items in "${collectionName}"...`);
        
        // Analyze each item's HTML to find all fields
        for (const item of collection.items) {
            const htmlPath = path.join(siteDir, item.url.replace(/^\//, ''));
            if (fs.existsSync(htmlPath)) {
                const html = fs.readFileSync(htmlPath, 'utf8');
                extractFieldsFromHTML(html, collection);
            }
        }
        
        console.log(`    Found fields: ${Array.from(collection.fields).join(', ')}`);
    }
}

/**
 * Generate schema summary
 */
function generateSchema(collections) {
    const schema = {
        collections: []
    };
    
    for (const [collectionName, collection] of collections) {
        const fields = Array.from(collection.fields).map(fieldName => {
            const fieldType = collection.fieldTypes.get(fieldName) || 'string';
            return {
                name: fieldName,
                type: fieldType
            };
        });
        
        schema.collections.push({
            name: collectionName,
            itemCount: collection.items.length,
            fields: fields,
            categories: Array.from(collection.categories)
        });
    }
    
    return schema;
}

// Main execution
console.log('🚀 Discovering Framer CMS Structure\n');
console.log('=' .repeat(60) + '\n');

const collections = discoverCollections();
analyzeAllFields(collections);

const schema = generateSchema(collections);

// Save schema
const schemaPath = path.join(dataDir, 'framer-cms-schema.json');
fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ Discovery complete!\n');
console.log(`📄 Schema saved to: ${schemaPath}\n`);

// Print summary
console.log('📋 Discovered Collections:');
for (const coll of schema.collections) {
    console.log(`\n  ${coll.name}:`);
    console.log(`    Items: ${coll.itemCount}`);
    console.log(`    Fields: ${coll.fields.map(f => `${f.name} (${f.type})`).join(', ')}`);
    if (coll.categories.length > 0) {
        console.log(`    Categories: ${coll.categories.join(', ')}`);
    }
}
