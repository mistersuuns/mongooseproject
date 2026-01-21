#!/usr/bin/env node

/**
 * Extract CMS data from Framer - downloads searchIndex JSON and extracts all data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Download JSON file
 */
function downloadJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Extract publications from searchIndex
 * Excludes people and news items
 */
function extractPublications(searchIndex, peopleSlugs, newsSlugs) {
    const publications = [];
    
    for (const [url, data] of Object.entries(searchIndex)) {
        // Publications are in /pubs-news-ppl/ and have h1 (title) and h2 (authors)
        if (url.includes('/pubs-news-ppl/') && data.h1 && data.h1.length > 0) {
            const title = data.h1[0];
            const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
            
            // Skip if it's a known person
            if (peopleSlugs.includes(slug)) {
                continue;
            }
            
            // Skip if it's a known news item
            if (newsSlugs.includes(slug)) {
                continue;
            }
            
            // Skip if it's a person (short name, no year, no authors)
            const hasYear = data.p && data.p.some(p => /\b(19|20)\d{2}\b/.test(p));
            const hasAuthors = data.h2 && data.h2.some(h2 => h2.includes('‹') && h2.length > 5);
            const isShortName = title.length < 50 && !hasYear;
            
            if (isShortName && !hasAuthors) {
                continue; // Likely a person
            }
            
            // Skip news items (check title and content)
            if (title.toLowerCase().includes('grant') || 
                title.toLowerCase().includes('funding') ||
                title.toLowerCase().includes('tracking') ||
                title.toLowerCase().includes('new funding') ||
                title.toLowerCase().includes('new grant')) {
                continue;
            }
            
            // Must have authors to be a publication
            if (!hasAuthors) {
                continue;
            }
            
            const authors = data.h2[0];
            
            // Extract year from p tags
            let year = null;
            if (data.p) {
                for (const p of data.p) {
                    const yearMatch = p.match(/\b(19|20)\d{2}\b/);
                    if (yearMatch) {
                        year = parseInt(yearMatch[0]);
                        break;
                    }
                }
            }
            
            publications.push({
                id: slug,
                title: title,
                slug: slug,
                description: data.description || '',
                year: year,
                authors: authors ? [authors] : [],
                url: url,
                date: year ? `${year}-01-01` : null,
                category: 'publication',
                body: ''
            });
        }
    }
    
    return publications;
}

/**
 * Extract people from searchIndex
 */
function extractPeople(searchIndex) {
    const people = [];
    const knownPeopleSlugs = [
        'neil-jordan', 'emma-inzani', 'graham-birch', 'nikita-bedov-panasyuk',
        'monil-khera', 'dave-seager', 'dr-michelle-hares', 'dr-harry-marshall',
        'beth-preston', 'catherine-sheppard', 'jennifer-sanderson', 'mike-cant',
        'field-manager', 'hazel-nichols', 'faye-thompson', 'professor',
        'assistant-professor', 'chair-of-evolutionary-population-genetics',
        'emma-vitikainen', 'laura-labarge', 'leela-channer'
    ];
    
    for (const [url, data] of Object.entries(searchIndex)) {
        // People are in /pubs-news-ppl/ and have short h1 (name) without year
        if (url.includes('/pubs-news-ppl/') && data.h1 && data.h1.length > 0) {
            const name = data.h1[0];
            const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
            
            // Check if it's a person:
            // 1. Known person slug
            // 2. OR short name (< 50 chars), no year in p tags, not a long publication title
            const hasYear = data.p && data.p.some(p => /\b(19|20)\d{2}\b/.test(p));
            const isLongTitle = name.length > 80;
            const isNews = name.toLowerCase().includes('grant') || 
                         name.toLowerCase().includes('funding') ||
                         name.toLowerCase().includes('tracking') ||
                         name.toLowerCase().includes('new funding') ||
                         name.toLowerCase().includes('new grant');
            const hasAuthors = data.h2 && data.h2.some(h2 => h2.includes('‹') || h2.includes('›'));
            
            const isKnownPerson = knownPeopleSlugs.includes(slug);
            const looksLikePerson = !hasYear && !isLongTitle && !isNews && name.length < 50 && !hasAuthors;
            
            if (isKnownPerson || looksLikePerson) {
                people.push({
                    id: slug,
                    name: name,
                    slug: slug,
                    title: null,
                    description: data.description || '',
                    content: '',
                    url: url,
                    email: null
                });
            }
        }
    }
    
    return people;
}

/**
 * Extract news from searchIndex
 */
function extractNews(searchIndex) {
    const news = [];
    
    for (const [url, data] of Object.entries(searchIndex)) {
        // News items are in /pubs-news-ppl/ and have news-like titles
        if (url.includes('/pubs-news-ppl/') && data.h1 && data.h1.length > 0) {
            const title = data.h1[0];
            const slug = url.replace('/pubs-news-ppl/', '').replace('.html', '');
            
            // Check if it's news
            const isNews = title.toLowerCase().includes('grant') || 
                          title.toLowerCase().includes('funding') ||
                          title.toLowerCase().includes('tracking') ||
                          title.toLowerCase().includes('new funding') ||
                          title.toLowerCase().includes('new grant');
            
            if (isNews) {
                // Extract date from p tags
                let date = null;
                if (data.p) {
                    for (const p of data.p) {
                        const dateMatch = p.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
                        if (dateMatch) {
                            date = dateMatch[1].replace(/\//g, '-');
                            break;
                        }
                    }
                }
                
                news.push({
                    id: slug,
                    title: title,
                    slug: slug,
                    description: data.description || '',
                    content: '',
                    url: url,
                    date: date
                });
            }
        }
    }
    
    return news;
}

// Main extraction
console.log('🔍 Downloading Framer searchIndex...\n');

const searchIndexUrl = 'https://framerusercontent.com/sites/4nPRg3hC3Keb52fPYFU5qT/searchIndex-bqgNGwXnRph4.json';

downloadJSON(searchIndexUrl)
    .then((searchIndex) => {
        console.log(`✅ Downloaded searchIndex (${Object.keys(searchIndex).length} entries)\n`);
        
        // Extract in order: people first, then news, then publications (excluding the others)
        const people = extractPeople(searchIndex);
        const news = extractNews(searchIndex);
        const peopleSlugs = people.map(p => p.slug);
        const newsSlugs = news.map(n => n.slug);
        const publications = extractPublications(searchIndex, peopleSlugs, newsSlugs);
        
        console.log(`📚 Found ${publications.length} publications`);
        console.log(`👥 Found ${people.length} people`);
        console.log(`📰 Found ${news.length} news items\n`);
        
        // Save to JSON files
        fs.writeFileSync(
            path.join(dataDir, 'publications.json'),
            JSON.stringify(publications, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'people.json'),
            JSON.stringify(people, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'news.json'),
            JSON.stringify(news, null, 2)
        );
        
        console.log('✅ CMS data extracted and saved to:');
        console.log(`   - data/publications.json (${publications.length} items)`);
        console.log(`   - data/people.json (${people.length} items)`);
        console.log(`   - data/news.json (${news.length} items)`);
    })
    .catch((error) => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
