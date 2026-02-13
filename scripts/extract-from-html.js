#!/usr/bin/env node

/**
 * Extract CMS data directly from Framer HTML files
 * Parses the __framer__handoverData script tag
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.join(__dirname, '../site');
const dataDir = path.join(__dirname, '../data');

/**
 * Extract handover data from HTML file
 */
function extractHandoverData(htmlPath) {
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Find the __framer__handoverData script
    const match = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!match) {
        console.log(`  No handover data found in ${path.basename(htmlPath)}`);
        return null;
    }

    try {
        // The data is a JSON array with a complex structure
        const rawData = match[1];
        return JSON.parse(rawData);
    } catch (e) {
        console.log(`  Failed to parse handover data: ${e.message}`);
        return null;
    }
}

/**
 * Parse the Framer handover data structure to extract CMS items
 * The structure is: [metadata, ["Map", key, value], query, indices, ...items]
 */
function parseHandoverItems(data) {
    if (!Array.isArray(data)) return [];

    const items = [];

    // Find field mappings (objects with field IDs as keys)
    // Then find value objects that follow
    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        // Look for objects that have field mappings
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            // Check if this looks like a data row (has type/value pairs following)
            const keys = Object.keys(item);

            // Field mapping objects have cryptic keys like "tYY63vr3J"
            if (keys.length > 3 && keys.some(k => /^[a-zA-Z0-9]{9,}$/.test(k))) {
                // This might be a field mapping, look for data after it
                continue;
            }

            // Data objects have "type" and "value" keys
            if (item.type !== undefined && item.value !== undefined) {
                continue; // This is a value wrapper
            }
        }
    }

    return items;
}

/**
 * Extract publications from publications.html
 */
function extractPublications() {
    console.log('📄 Extracting publications from HTML...');

    const htmlPath = path.join(siteDir, 'publications.html');
    if (!fs.existsSync(htmlPath)) {
        console.log('  publications.html not found');
        return [];
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    // Find the __framer__handoverData script
    const match = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!match) {
        console.log('  No handover data found');
        return [];
    }

    const rawData = match[1];

    // Extract string values that look like publication data
    // Authors pattern: multiple names with commas and "and"
    const publications = [];

    // Find all string values in the data
    const stringMatches = rawData.matchAll(/"value":\s*(\d+)\s*\}\s*,\s*"string"\s*,\s*"([^"]+)"/g);
    const strings = [];
    for (const m of stringMatches) {
        strings.push(m[2]);
    }

    // Also try direct string extraction
    const directStrings = rawData.matchAll(/"string"\s*,\s*"([^"]+)"/g);
    for (const m of directStrings) {
        if (!strings.includes(m[1])) {
            strings.push(m[1]);
        }
    }

    console.log(`  Found ${strings.length} string values`);

    // Group strings into publications
    // Pattern: authors (contains "and" + multiple names), year (4 digits), journal, title, slug, url
    let currentPub = {};

    for (const str of strings) {
        // Year
        if (/^\d{4}$/.test(str)) {
            if (currentPub.title) {
                publications.push(currentPub);
                currentPub = {};
            }
            currentPub.year = str;
        }
        // Authors (contains multiple names with "and")
        else if (str.includes(' and ') && str.includes(',') && str.length > 20) {
            currentPub.authors = str;
        }
        // URL (starts with http or /)
        else if (str.startsWith('http') || str.startsWith('/pubs-news-ppl/')) {
            currentPub.url = str;
        }
        // Slug (lowercase with hyphens, no spaces)
        else if (/^[a-z0-9-]+$/.test(str) && str.includes('-') && str.length > 10) {
            currentPub.slug = str;
        }
        // Journal (usually shorter, often contains specific words)
        else if (str.length < 100 && (
            str.includes('Journal') ||
            str.includes('Biology') ||
            str.includes('Ecology') ||
            str.includes('Evolution') ||
            str.includes('Science') ||
            str.includes('Society') ||
            str.includes('Nature') ||
            str.includes('Proceedings') ||
            str.includes('Behaviour') ||
            str.includes('Behavioral')
        )) {
            currentPub.journal = str;
        }
        // Title (longer text, likely capitalized words)
        else if (str.length > 30 && str.length < 300 && /[A-Z]/.test(str)) {
            currentPub.title = str;
        }
    }

    // Don't forget the last one
    if (currentPub.title) {
        publications.push(currentPub);
    }

    console.log(`  Extracted ${publications.length} publications`);
    return publications;
}

/**
 * Alternative: Parse the structured data more carefully
 */
function extractPublicationsV2() {
    console.log('📄 Extracting publications (v2)...');

    const htmlPath = path.join(siteDir, 'publications.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    const match = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!match) return [];

    try {
        const data = JSON.parse(match[1]);
        const publications = [];

        // The data structure has field values scattered throughout
        // We need to find the pattern: index -> {fieldId: valueIndex} -> values

        // Find all objects that look like row data
        // They have string field IDs mapping to indices
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (typeof item !== 'object' || item === null || Array.isArray(item)) continue;

            const keys = Object.keys(item);
            // Skip if it's a type/value wrapper
            if (keys.length === 2 && keys.includes('type') && keys.includes('value')) continue;

            // Check if keys look like Framer field IDs (9+ alphanumeric chars)
            const looksLikeFieldMap = keys.length >= 3 &&
                keys.filter(k => /^[a-zA-Z0-9]{7,}$/.test(k) || k === 'id').length >= 3;

            if (looksLikeFieldMap) {
                // This is a row - extract values from subsequent items
                const pub = {};
                for (const [fieldId, valueIdx] of Object.entries(item)) {
                    if (typeof valueIdx !== 'number') continue;

                    // Look for the value at or near that index
                    const valueWrapper = data[valueIdx];
                    if (valueWrapper && valueWrapper.type === 'string' || typeof valueWrapper === 'object') {
                        // Get the actual value
                        const actualValue = data[valueIdx + 1];
                        if (typeof actualValue === 'string') {
                            // Guess the field type based on content
                            if (/^\d{4}$/.test(actualValue)) {
                                pub.year = actualValue;
                            } else if (actualValue.includes(' and ') && actualValue.includes(',')) {
                                pub.authors = actualValue;
                            } else if (actualValue.startsWith('/pubs-news-ppl/') || actualValue.startsWith('http')) {
                                pub.url = actualValue;
                            } else if (/^[a-z0-9-]+$/.test(actualValue) && actualValue.length > 10) {
                                pub.slug = actualValue;
                            } else if (actualValue.length < 80 && /Journal|Biology|Ecology|Evolution|Science|Society|Nature|Proceedings|Behaviour/.test(actualValue)) {
                                pub.journal = actualValue;
                            } else if (actualValue.length > 20) {
                                pub.title = actualValue;
                            }
                        }
                    }
                }

                if (pub.title || pub.slug) {
                    publications.push(pub);
                }
            }
        }

        console.log(`  Extracted ${publications.length} publications`);
        return publications;

    } catch (e) {
        console.log(`  Parse error: ${e.message}`);
        return [];
    }
}

/**
 * Parse Framer handover data structure
 * Structure:
 *   - fieldMap: {fieldId: valueIndex, ...}
 *   - At valueIndex: {type: N, value: actualValueIndex}
 *   - At actualValueIndex: the actual string value
 */
function extractPublicationsV3() {
    console.log('📄 Extracting publications from Framer handover data...');

    const htmlPath = path.join(siteDir, 'publications.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    const scriptMatch = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!scriptMatch) {
        console.log('  No handover data found');
        return [];
    }

    let data;
    try {
        data = JSON.parse(scriptMatch[1]);
    } catch (e) {
        console.log(`  Failed to parse JSON: ${e.message}`);
        return [];
    }

    console.log(`  Parsed ${data.length} items from handover data`);

    // Helper to get value from index
    function getValue(idx) {
        const wrapper = data[idx];
        if (wrapper && typeof wrapper === 'object' && wrapper.value !== undefined) {
            return data[wrapper.value];
        }
        return null;
    }

    const publications = [];

    // Find field mapping objects (have 5+ cryptic keys)
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item !== 'object' || item === null || Array.isArray(item)) continue;

        const keys = Object.keys(item);
        // Skip type/value wrappers
        if (keys.length === 2 && keys.includes('type') && keys.includes('value')) continue;

        // Field maps have keys like "tYY63vr3J"
        const hasFieldIds = keys.filter(k => /^[a-zA-Z0-9]{9}$/.test(k)).length >= 3;
        if (!hasFieldIds) continue;

        // Extract values for this publication
        const pub = {};
        const values = [];

        for (const [fieldId, valueIdx] of Object.entries(item)) {
            if (typeof valueIdx !== 'number') continue;

            const val = getValue(valueIdx);
            if (typeof val !== 'string') continue;

            values.push(val);

            // Identify field type by content
            if (/^\d{4}$/.test(val)) {
                pub.year = val;
            } else if (val.includes(' and ') && val.length > 30 && !val.includes('http')) {
                pub.authors = val;
            } else if (/^[a-z0-9-]+$/.test(val) && val.includes('-') && val.length > 10 && val.length < 150) {
                pub.slug = val;
            } else if (val.startsWith('https://doi.org/') || val.startsWith('https://www.')) {
                pub.url = val;
            } else if (val.endsWith('.pdf')) {
                pub.pdf = val;
            } else if (val.length < 80 && (
                /Journal|Biology|Ecology|Evolution|Science|Society|Nature|Proceedings|Behaviour|Behavioral|Royal|Letters|Animal/.test(val)
            )) {
                pub.journal = val;
            } else if (val.length > 30 && val.length < 250 && !val.startsWith('http')) {
                // Title is usually the longest non-URL string
                if (!pub.title || val.length > pub.title.length) {
                    pub.title = val;
                }
            }
        }

        if (pub.title && pub.slug) {
            publications.push(pub);
        }
    }

    console.log(`  Extracted ${publications.length} publications`);
    return publications;
}

/**
 * Extract people from people.html
 */
function extractPeople() {
    console.log('📄 Extracting people from Framer handover data...');

    const htmlPath = path.join(siteDir, 'people.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    const scriptMatch = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!scriptMatch) {
        console.log('  No handover data found');
        return [];
    }

    let data;
    try {
        data = JSON.parse(scriptMatch[1]);
    } catch (e) {
        console.log(`  Failed to parse JSON: ${e.message}`);
        return [];
    }

    function getValue(idx) {
        const wrapper = data[idx];
        if (wrapper && typeof wrapper === 'object' && wrapper.value !== undefined) {
            return data[wrapper.value];
        }
        return null;
    }

    const people = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item !== 'object' || item === null || Array.isArray(item)) continue;

        const keys = Object.keys(item);
        if (keys.length === 2 && keys.includes('type') && keys.includes('value')) continue;

        const hasFieldIds = keys.filter(k => /^[a-zA-Z0-9]{9}$/.test(k)).length >= 2;
        if (!hasFieldIds) continue;

        const person = {};

        for (const [fieldId, valueIdx] of Object.entries(item)) {
            if (typeof valueIdx !== 'number') continue;

            const val = getValue(valueIdx);
            if (typeof val !== 'string') continue;

            // Identify field type
            if (/^[a-z0-9-]+$/.test(val) && val.includes('-') && val.length > 5 && val.length < 80) {
                person.slug = val;
            } else if (val.startsWith('https://framerusercontent.com/images/')) {
                person.image = val;
            } else if (val.startsWith('http')) {
                person.link = val;
            } else if (val.length < 50 && (
                /Professor|Student|Manager|Fellow|Lecturer|Chair|Director|Researcher/.test(val)
            )) {
                person.position = val;
            } else if (val.length > 5 && val.length < 50 && /^[A-Z][a-z]+ [A-Z]/.test(val)) {
                person.title = val;
            }
        }

        if (person.title && person.slug) {
            people.push(person);
        }
    }

    console.log(`  Extracted ${people.length} people`);
    return people;
}

/**
 * Extract news from news.html
 */
function extractNews() {
    console.log('📄 Extracting news from Framer handover data...');

    const htmlPath = path.join(siteDir, 'news.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    const scriptMatch = html.match(/<script[^>]*id="__framer__handoverData"[^>]*>([^<]+)<\/script>/);
    if (!scriptMatch) {
        console.log('  No handover data found');
        return [];
    }

    let data;
    try {
        data = JSON.parse(scriptMatch[1]);
    } catch (e) {
        console.log(`  Failed to parse JSON: ${e.message}`);
        return [];
    }

    function getValue(idx) {
        const wrapper = data[idx];
        if (wrapper && typeof wrapper === 'object' && wrapper.value !== undefined) {
            return data[wrapper.value];
        }
        return null;
    }

    const news = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (typeof item !== 'object' || item === null || Array.isArray(item)) continue;

        const keys = Object.keys(item);
        if (keys.length === 2 && keys.includes('type') && keys.includes('value')) continue;

        const hasFieldIds = keys.filter(k => /^[a-zA-Z0-9]{9}$/.test(k)).length >= 2;
        if (!hasFieldIds) continue;

        const newsItem = {};

        for (const [fieldId, valueIdx] of Object.entries(item)) {
            if (typeof valueIdx !== 'number') continue;

            const val = getValue(valueIdx);
            if (typeof val !== 'string') continue;

            if (/^\d{4}$/.test(val)) {
                newsItem.year = val;
            } else if (/^[a-z0-9-]+$/.test(val) && val.includes('-') && val.length > 5) {
                newsItem.slug = val;
            } else if (val.startsWith('http')) {
                newsItem.url = val;
            } else if (val.length > 20 && val.length < 200) {
                if (!newsItem.title || val.length > newsItem.title.length) {
                    newsItem.title = val;
                }
            }
        }

        if (newsItem.title && newsItem.slug) {
            news.push(newsItem);
        }
    }

    console.log(`  Extracted ${news.length} news items`);
    return news;
}

/**
 * Convert extracted data to markdown files
 */
function convertToMarkdown(items, collection) {
    const collectionDir = path.join(dataDir, collection);
    if (!fs.existsSync(collectionDir)) {
        fs.mkdirSync(collectionDir, { recursive: true });
    }

    let count = 0;
    for (const item of items) {
        if (!item.slug) continue;

        const frontmatter = ['---'];

        if (item.title) frontmatter.push(`title: "${item.title.replace(/"/g, '\\"')}"`);
        frontmatter.push(`slug: "${item.slug}"`);

        if (collection === 'publications') {
            if (item.authors) frontmatter.push(`authors: "${item.authors.replace(/"/g, '\\"')}"`);
            if (item.journal) frontmatter.push(`journal: "${item.journal.replace(/"/g, '\\"')}"`);
            if (item.year) frontmatter.push(`year: "${item.year}"`);
            if (item.url) frontmatter.push(`url: "${item.url}"`);
            if (item.pdf) frontmatter.push(`pdf: "${item.pdf}"`);
        } else if (collection === 'people') {
            if (item.position) frontmatter.push(`position: "${item.position.replace(/"/g, '\\"')}"`);
            if (item.image) frontmatter.push(`image: "${item.image}"`);
            if (item.link) frontmatter.push(`link: "${item.link}"`);
        } else if (collection === 'news') {
            if (item.year) frontmatter.push(`year: "${item.year}"`);
            if (item.url) frontmatter.push(`url: "${item.url}"`);
            if (item.description) frontmatter.push(`description: "${item.description.replace(/"/g, '\\"')}"`);
        }

        frontmatter.push('---');
        frontmatter.push('');

        const content = frontmatter.join('\n');
        const filePath = path.join(collectionDir, `${item.slug}.md`);
        fs.writeFileSync(filePath, content);
        count++;
    }

    return count;
}

// Main
console.log('🔍 Extracting CMS data from HTML files...\n');

const pubs = extractPublicationsV3();
const people = extractPeople();
const news = extractNews();

// Save to JSON (for debugging)
fs.writeFileSync(path.join(dataDir, 'publications-from-html.json'), JSON.stringify(pubs, null, 2));
fs.writeFileSync(path.join(dataDir, 'people-from-html.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(dataDir, 'news-from-html.json'), JSON.stringify(news, null, 2));

// Convert to markdown
console.log('\n📝 Converting to Markdown...');
const pubCount = convertToMarkdown(pubs, 'publications');
const peopleCount = convertToMarkdown(people, 'people');
const newsCount = convertToMarkdown(news, 'news');

console.log(`\n✅ Extraction complete!`);
console.log(`   Publications: ${pubCount} markdown files`);
console.log(`   People: ${peopleCount} markdown files`);
console.log(`   News: ${newsCount} markdown files`);

// Show sample
if (pubs.length > 0) {
    console.log('\nSample publication:');
    console.log(JSON.stringify(pubs[0], null, 2));
}
