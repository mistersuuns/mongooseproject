#!/usr/bin/env node

/**
 * Simple, direct extraction from Framer CMS structure
 * Maps Framer CMS fields directly to Decap CMS fields
 * No guessing, no back-calculation - just read the CMS data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const siteDir = path.join(__dirname, '../site');

const baseUrl = 'https://mongooseproject.org';

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Resolve references in Framer handover JSON
 * Structure: jsonData[ref] might be {type: X, value: Y}, so resolve to jsonData[Y]
 */
function resolveReference(jsonData, ref) {
    if (typeof ref === 'number' && jsonData[ref] !== undefined) {
        const obj = jsonData[ref];
        if (obj && typeof obj === 'object' && obj.value !== undefined) {
            return jsonData[obj.value];
        }
        return obj;
    }
    return ref;
}

/**
 * Extract people positions from People page
 * Uses the working function from extract-cms-data-v2.js
 */
function extractPeoplePositions() {
    // Use the proven extraction function
    const dataDir = path.join(__dirname, '../data');
    const siteDir = path.join(__dirname, '../site');
    
    // Copy the working function logic
    const titlesMap = {};
    try {
        const peoplePagePath = path.join(siteDir, 'people.html');
        if (!fs.existsSync(peoplePagePath)) {
            return titlesMap;
        }
        
        const html = fs.readFileSync(peoplePagePath, 'utf8');
        
        // Strategy 1: h1/h4 pairs
        const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/g));
        for (const h1Match of h1Matches) {
            const name = h1Match[1].trim();
            if (name.length < 3 || name.length > 50 || !/^[A-Z]/.test(name)) continue;
            
            const h1Idx = h1Match.index;
            const after = html.substring(h1Idx, h1Idx + 1000);
            const h4Match = after.match(/<h4[^>]*>([^<]+)<\/h4>/);
            
            if (h4Match) {
                const title = h4Match[1].trim();
                const before = html.substring(Math.max(0, h1Idx - 3000), h1Idx);
                const links = Array.from(before.matchAll(/href="\.\/pubs-news-ppl\/([^"]+)"/g));
                
                if (links.length > 0 && title && title.length > 2 && title !== name) {
                    const slug = links[links.length - 1][1];
                    titlesMap[slug] = title;
                }
            }
        }
        
        // Strategy 2: h6 pattern for Alumni
        const linkMatches = Array.from(html.matchAll(/href="\.\/pubs-news-ppl\/([^"]+)">([\s\S]{0,1500}?)<\/a>/g));
        for (const linkMatch of linkMatches) {
            const slug = linkMatch[1];
            if (titlesMap[slug]) continue;
            
            const linkBlock = linkMatch[2];
            const h6Matches = Array.from(linkBlock.matchAll(/<h6[^>]*>([^<]+)<\/h6>/g));
            const h6Texts = h6Matches.map(m => m[1].trim());
            
            if (h6Texts.length >= 2) {
                const firstH6 = h6Texts[0];
                const secondH6 = h6Texts[1];
                let title = null;
                
                if (h6Texts.length === 2) {
                    if (secondH6 !== '–' && secondH6 !== '-' && secondH6.length > 2 &&
                        !secondH6.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) && !secondH6.includes('@')) {
                        title = secondH6;
                    }
                } else if (h6Texts.length >= 3) {
                    if (secondH6 === '–' || secondH6 === '-') {
                        title = h6Texts[2];
                    } else if (secondH6 !== '–' && secondH6 !== '-' && secondH6.length > 2 &&
                        !secondH6.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) && !secondH6.includes('@')) {
                        title = secondH6;
                    } else {
                        title = h6Texts[2];
                    }
                }
                
                const hasTitleKeyword = title && (title.toLowerCase().includes('student') || 
                     title.toLowerCase().includes('professor') ||
                     title.toLowerCase().includes('researcher') ||
                     title.toLowerCase().includes('fellow') ||
                     title.toLowerCase().includes('manager') ||
                     title.toLowerCase().includes('director') ||
                     title.toLowerCase().includes('associate') ||
                     title.toLowerCase().includes('phd') ||
                     title.toLowerCase().includes('mres') ||
                     title.toLowerCase().includes('mbyres') ||
                     title.toLowerCase().includes('chair'));
                
                if (title && title !== '–' && title !== '-' &&
                    title.length > 2 && title !== firstH6 &&
                    !title.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/) &&
                    !title.includes('@') && hasTitleKeyword) {
                    titlesMap[slug] = title;
                }
            }
        }
    } catch (e) {
        console.warn(`⚠️  Error extracting positions: ${e.message}`);
    }
    
    return titlesMap;
}

/**
 * Extract publications directly from searchIndex - Framer CMS structure
 */
function extractPublications() {
    console.log('🔍 Extracting publications from Framer CMS...\n');
    
    const searchIndexPath = path.join(dataDir, 'searchIndex.json');
    if (!fs.existsSync(searchIndexPath)) {
        console.error('❌ searchIndex.json not found');
        return [];
    }
    
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    const publications = [];
    
    const knownPeople = ['neil-jordan', 'emma-inzani', 'graham-birch', 'nikita-bedov-panasyuk',
        'monil-khera', 'dave-seager', 'dr-michelle-hares', 'dr-harry-marshall',
        'beth-preston', 'catherine-sheppard', 'jennifer-sanderson', 'mike-cant',
        'field-manager', 'hazel-nichols', 'faye-thompson', 'professor',
        'assistant-professor', 'chair-of-evolutionary-population-genetics',
        'emma-vitikainen', 'laura-labarge', 'leela-channer'];
    
    const knownNews = ['new-grant', 'new-funding-from-germany', 'pioneering-next-generation-animal-tracking'];
    
    for (const [url, data] of Object.entries(searchIndex)) {
        if (!url.includes('/pubs-news-ppl/')) continue;
        
        const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
        if (knownPeople.includes(slug) || knownNews.includes(slug)) continue;
        
        // Publications have: h1 (title), h2 with ‹› (authors), url, date
        if (!data.h1 || data.h1.length === 0) continue;
        const hasAuthors = data.h2 && data.h2.some(h2 => h2.includes('‹') && h2.length > 5);
        if (!hasAuthors) continue;
        
        const title = data.h1[0];
        const authorsStr = data.h2.find(h2 => h2.includes('‹') && h2.length > 5);
        const authors = authorsStr ? [authorsStr.replace(/[‹›]/g, '').trim()] : [];
        
        // Extract year from content
        let year = null;
        if (data.p) {
            for (const p of data.p) {
                const yearMatch = p.match(/\b(19|20)\d{2}\b/);
                if (yearMatch) {
                    year = yearMatch[0];
                    break;
                }
            }
        }
        
        // Filter boilerplate
        let description = data.description || '';
        if (description.includes('The Banded Mongoose Research Project consists')) {
            description = '';
        }
        
        // Get PDF from publications page (we'll do this separately)
        const pub = {
            id: slug,
            slug: slug,
            title: title,
            authors: authors,
            journal: null, // Extract from HTML if needed
            url: url,
            date: year ? `${year}-01-01T00:00:00.000Z` : null,
            files: null, // Will be populated from PDF extraction
            description: description,
            body: ''
        };
        
        publications.push(pub);
    }
    
    console.log(`✅ Extracted ${publications.length} publications\n`);
    return publications;
}

/**
 * Extract people directly from searchIndex - Framer CMS structure
 */
function extractPeople() {
    console.log('🔍 Extracting people from Framer CMS...\n');
    
    const searchIndexPath = path.join(dataDir, 'searchIndex.json');
    if (!fs.existsSync(searchIndexPath)) {
        console.error('❌ searchIndex.json not found');
        return [];
    }
    
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    const positionsMap = extractPeoplePositions();
    console.log(`✅ Found ${Object.keys(positionsMap).length} positions from People page\n`);
    
    const people = [];
    const knownPeopleSlugs = [
        'neil-jordan', 'emma-inzani', 'graham-birch', 'nikita-bedov-panasyuk',
        'monil-khera', 'dave-seager', 'dr-michelle-hares', 'dr-harry-marshall',
        'beth-preston', 'catherine-sheppard', 'jennifer-sanderson', 'mike-cant',
        'field-manager', 'hazel-nichols', 'faye-thompson', 'professor',
        'assistant-professor', 'chair-of-evolutionary-population-genetics',
        'emma-vitikainen', 'laura-labarge', 'leela-channer', 'patrick-green',
        'joe-hoffman', 'dan-franks', 'francis-mwanguhya'
    ];
    
    for (const [url, data] of Object.entries(searchIndex)) {
        if (!url.includes('/pubs-news-ppl/')) continue;
        
        const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
        
        // Check if it's a known person
        if (!knownPeopleSlugs.includes(slug)) {
            // Or looks like a person (short name, no year, no authors with ‹›)
            const name = data.h1 && data.h1[0];
            if (!name || name.length > 50) continue;
            const hasYear = data.p && data.p.some(p => /\b(19|20)\d{2}\b/.test(p));
            const hasAuthors = data.h2 && data.h2.some(h2 => h2.includes('‹') && h2.length > 5);
            if (hasYear || hasAuthors) continue;
        }
        
        const name = data.h1 && data.h1[0];
        if (!name) continue;
        
        // Filter boilerplate
        let description = data.description || '';
        if (description.includes('The Banded Mongoose Research Project consists')) {
            description = '';
        }
        
        const person = {
            id: slug,
            slug: slug,
            title: name, // Framer CMS: Title = person name
            link: null,
            position: positionsMap[slug] || null,
            category: null,
            description: description,
            image: null,
            url: url
        };
        
        people.push(person);
    }
    
    console.log(`✅ Extracted ${people.length} people\n`);
    return people;
}

// Main
console.log('🚀 Extracting directly from Framer CMS structure...\n');

const publications = extractPublications();
const people = extractPeople();

// Save
fs.writeFileSync(
    path.join(dataDir, 'publications-all-fields.json'),
    JSON.stringify(publications, null, 2)
);

fs.writeFileSync(
    path.join(dataDir, 'people-all-fields.json'),
    JSON.stringify(people, null, 2)
);

console.log('✅ Extraction complete!');
console.log(`   - ${publications.length} publications`);
console.log(`   - ${people.length} people`);
