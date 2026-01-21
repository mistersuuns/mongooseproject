#!/usr/bin/env node

/**
 * Extract CMS data from Framer HTML files
 * Converts static HTML into structured JSON for CMS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.join(__dirname, '../site/mongooseproject.org');
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Extract data from Framer handover script tag
 */
function extractHandoverData(html) {
    const $ = cheerio.load(html);
    const handoverScript = $('script[type="framer/handover"]').html();
    
    if (!handoverScript) {
        return null;
    }
    
    try {
        // The handover data is a JSON array, parse it
        const data = JSON.parse(handoverScript);
        return data;
    } catch (e) {
        console.error('Error parsing handover data:', e.message);
        return null;
    }
}

/**
 * Extract publications from publications.html
 */
function extractPublications() {
    const publications = [];
    const pubsFile = path.join(siteDir, 'publications.html');
    
    if (!fs.existsSync(pubsFile)) {
        console.warn('⚠️  publications.html not found');
        return publications;
    }
    
    const html = fs.readFileSync(pubsFile, 'utf-8');
    const handoverData = extractHandoverData(html);
    
    if (!handoverData || !handoverData[2] || !handoverData[2][1]) {
        console.warn('⚠️  No handover data found in publications.html');
        return publications;
    }
    
    // The data structure is: [metadata, query, results]
    // results is a Map with publication data
    const results = handoverData[2][1];
    
    // Iterate through the results map
    for (const [key, value] of Object.entries(results)) {
        if (typeof value === 'object' && value !== null) {
            // Extract publication fields from the value object
            const pub = {
                id: value.id || key.replace('/pubs-news-ppl/', '').replace('.html', ''),
                title: value.tYY63vr3J || value.title || '',
                slug: value.TAIvpALDu || key.replace('/pubs-news-ppl/', '').replace('.html', ''),
                description: value.description || '',
                year: value.t8YR7PHk7 ? parseInt(value.t8YR7PHk7) : null,
                authors: value.Hohw1kgab ? [value.Hohw1kgab] : [],
                url: value.WO629Dm7x || value.url || key,
                date: value.t8YR7PHk7 || null,
                category: 'publication',
                body: '' // Will be extracted from individual pages if needed
            };
            
            // Only add if it's actually a publication (has title and authors)
            if (pub.title && pub.authors.length > 0) {
                publications.push(pub);
            }
        }
    }
    
    return publications;
}

/**
 * Extract people from people.html and individual person pages
 */
function extractPeople() {
    const people = [];
    const peopleFile = path.join(siteDir, 'people.html');
    const pubsNewsPplDir = path.join(siteDir, 'pubs-news-ppl');
    
    // First, get all person HTML files
    if (fs.existsSync(pubsNewsPplDir)) {
        const files = fs.readdirSync(pubsNewsPplDir).filter(f => f.endsWith('.html'));
        
        for (const file of files) {
            const filePath = path.join(pubsNewsPplDir, file);
            const html = fs.readFileSync(filePath, 'utf-8');
            const $ = cheerio.load(html);
            
            // Check if it's a person page (has person-specific content)
            const title = $('title').text().replace(' - Banded Mongoose Research Project', '').trim();
            const h1 = $('h1').first().text().trim();
            
            // Person pages typically have a person's name as the main heading
            // and don't have publication-like content
            const isPerson = !title.toLowerCase().includes('publication') && 
                           !title.toLowerCase().includes('grant') &&
                           !title.toLowerCase().includes('funding') &&
                           !title.toLowerCase().includes('tracking') &&
                           h1 && h1.length < 100; // Person names are short
            
            if (isPerson) {
                const slug = file.replace('.html', '');
                const description = $('meta[name="description"]').attr('content') || '';
                const content = $('#main').html() || $('body').html() || '';
                
                people.push({
                    id: slug,
                    name: h1 || title,
                    slug: slug,
                    title: null, // Role/title - would need to extract from content
                    description: description,
                    content: content.substring(0, 10000), // Limit size
                    url: `/pubs-news-ppl/${file}`,
                    email: null
                });
            }
        }
    }
    
    return people;
}

/**
 * Extract news items from news.html
 */
function extractNews() {
    const news = [];
    const newsFile = path.join(siteDir, 'news.html');
    
    if (!fs.existsSync(newsFile)) {
        console.warn('⚠️  news.html not found');
        return news;
    }
    
    const html = fs.readFileSync(newsFile, 'utf-8');
    const $ = cheerio.load(html);
    
    // Find news items - they're typically links to pages in pubs-news-ppl
    // that have "grant", "funding", "tracking" or similar in the title
    const newsLinks = $('a[href*="pubs-news-ppl"]');
    
    newsLinks.each((i, el) => {
        const href = $(el).attr('href');
        const title = $(el).text().trim();
        
        if (title && href && href.includes('pubs-news-ppl')) {
            const slug = href.replace('/pubs-news-ppl/', '').replace('.html', '');
            const newsItemFile = path.join(siteDir, 'pubs-news-ppl', `${slug}.html`);
            
            // Check if it's actually a news item (not a person or publication)
            if (fs.existsSync(newsItemFile)) {
                const newsHtml = fs.readFileSync(newsItemFile, 'utf-8');
                const $news = cheerio.load(newsHtml);
                const newsTitle = $news('title').text().replace(' - Banded Mongoose Research Project', '').trim();
                
                // News items typically have "grant", "funding", "tracking" etc in title
                const isNews = newsTitle.toLowerCase().includes('grant') ||
                              newsTitle.toLowerCase().includes('funding') ||
                              newsTitle.toLowerCase().includes('tracking') ||
                              newsTitle.toLowerCase().includes('new');
                
                if (isNews) {
                    const description = $news('meta[name="description"]').attr('content') || '';
                    const content = $news('#main').html() || $news('body').html() || '';
                    const dateMatch = content.match(/(\d{4}\/\d{1,2}\/\d{1,2})/);
                    const date = dateMatch ? dateMatch[1] : null;
                    
                    news.push({
                        id: slug,
                        title: newsTitle || title,
                        slug: slug,
                        description: description,
                        content: content.substring(0, 10000),
                        url: href,
                        date: date
                    });
                }
            }
        }
    });
    
    return news;
}

// Main extraction
console.log('🔍 Extracting CMS data from Framer HTML files...\n');

const publications = extractPublications();
const people = extractPeople();
const news = extractNews();

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
