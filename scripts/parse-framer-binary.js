#!/usr/bin/env node
/**
 * Parse Framer CMS binary - using createdAt as record boundary
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TYPE_MAP = {
    'OxvocGmTp': 'pub',
    'tSU0Hl_5a': 'news',
    'ckm9zJSL2': 'person'
};

const CATEGORY_MAP = {
    'wvxrkBUJg': 'Director',
    'CDAsunGo5': 'Co-I',
    'xcRhC4Po3': 'PostDoc or Grad Student',
    'uVch310j7': 'Alum'
};

function parseRecords(buffer) {
    const text = buffer.toString('utf8');
    const records = [];

    // Split by "createdAt" which appears exactly once per record
    const parts = text.split('createdAt');
    console.log(`Split into ${parts.length} parts by 'createdAt'`);

    // First part is header, skip it. Each subsequent part is a record.
    for (let i = 1; i < parts.length; i++) {
        // Record data spans from this createdAt to the next
        // Include some of the previous part for fields that come before createdAt
        const prevPart = parts[i - 1].slice(-800); // Get end of previous part
        const currPart = parts[i].slice(0, 1500);  // Get start of current part
        const recordText = prevPart + 'createdAt' + currPart;

        const record = extractRecord(recordText);
        if (record.slug && record.type) {
            records.push(record);
        }
    }

    return records;
}

function extractRecord(text) {
    const record = {};

    // Type
    for (const [enumId, typeName] of Object.entries(TYPE_MAP)) {
        if (text.includes(enumId)) {
            record.type = typeName;
            break;
        }
    }

    // Slug - pattern: TAIvpALDu followed by length byte then slug string
    const slugMatch = text.match(/TAIvpALDu[\x00-\x1F]+([a-z][a-z0-9-]+)/);
    if (slugMatch) {
        record.slug = slugMatch[1];
    }

    // Title - pattern: Hohw1kgab followed by length byte then title
    const titleMatch = text.match(/Hohw1kgab[\x00-\x1F]+(.{2,200}?)(?=[\x00-\x08]|tYY63|m2RDH|TAIvp|SHDM1|MY38j|sjk5F)/);
    if (titleMatch) {
        record.title = titleMatch[1].replace(/[\x00-\x1F]/g, '').trim();
    }

    // Authors
    const authorsMatch = text.match(/tYY63vr3J[\x00-\x1F]+(.{5,500}?)(?=[\x00-\x08]|m2RDH|TAIvp|WO629|t8YR7)/);
    if (authorsMatch) {
        record.authors = authorsMatch[1].replace(/[\x00-\x1F]/g, '').trim();
    }

    // Journal
    const journalMatch = text.match(/m2RDHl8lV[\x00-\x1F]+(.{2,150}?)(?=[\x00-\x08]|TAIvp|WO629|t8YR7)/);
    if (journalMatch) {
        record.journal = journalMatch[1].replace(/[\x00-\x1F]/g, '').trim();
    }

    // Year
    const yearMatch = text.match(/t8YR7PHk7[\x00-\x1F]+(\d{4})/);
    if (yearMatch) {
        record.year = yearMatch[1];
    }

    // Position
    const posMatch = text.match(/MY38jWI86[\x00-\x1F]+(.{2,80}?)(?=[\x00-\x08]|sjk5F|Cq553|TAIvp)/);
    if (posMatch) {
        record.position = posMatch[1].replace(/[\x00-\x1F]/g, '').trim();
    }

    // Category
    for (const [enumId, catName] of Object.entries(CATEGORY_MAP)) {
        if (text.includes(enumId)) {
            record.category = catName;
            break;
        }
    }

    // PDF
    const pdfMatch = text.match(/(https:\/\/framerusercontent\.com\/assets\/[A-Za-z0-9_-]+\.pdf)/);
    if (pdfMatch) {
        record.pdf = pdfMatch[1];
    }

    // URL
    const urlMatch = text.match(/WO629Dm7x[\x00-\x1F]*.{0,50}?(https?:\/\/[^\s\x00-\x1F"]+)/);
    if (urlMatch) {
        record.url = urlMatch[1];
    }

    // Image
    const imgMatch = text.match(/(https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9_-]+)/);
    if (imgMatch) {
        record.image = imgMatch[1];
    }

    return record;
}

async function main() {
    console.log('=== Framer CMS Binary Parser v2 ===\n');

    const cmsPath = '/tmp/cms-chunk.bin';
    if (!fs.existsSync(cmsPath)) {
        console.log('Downloading CMS...');
        const resp = await fetch('https://framerusercontent.com/cms/MMCU5nkNvL1LWQNtLL0v/8IK8dXDrbX3ArJBJEIAe/YsFLfhiR7-chunk-default-0.framercms');
        fs.writeFileSync(cmsPath, Buffer.from(await resp.arrayBuffer()));
    }

    const buffer = fs.readFileSync(cmsPath);
    console.log(`Binary: ${buffer.length} bytes\n`);

    const records = parseRecords(buffer);

    // Group and count
    const pubs = records.filter(r => r.type === 'pub');
    const people = records.filter(r => r.type === 'person');
    const news = records.filter(r => r.type === 'news');

    console.log(`\nExtracted ${records.length} records:`);
    console.log(`  Publications: ${pubs.length}`);
    console.log(`  People: ${people.length}`);
    console.log(`  News: ${news.length}`);

    // Check for duplicates
    const slugs = records.map(r => r.slug);
    const uniqueSlugs = new Set(slugs);
    if (slugs.length !== uniqueSlugs.size) {
        console.log(`\n⚠️  ${slugs.length - uniqueSlugs.size} duplicate slugs found`);
    }

    // Save
    const dataDir = path.join(__dirname, '..', 'data');

    fs.writeFileSync(
        path.join(dataDir, 'cms-binary.json'),
        JSON.stringify({ publications: pubs, people, news }, null, 2)
    );

    // Save individual JSON files
    fs.writeFileSync(path.join(dataDir, 'publications-binary.json'), JSON.stringify(pubs, null, 2));
    fs.writeFileSync(path.join(dataDir, 'people-binary.json'), JSON.stringify(people, null, 2));
    fs.writeFileSync(path.join(dataDir, 'news-binary.json'), JSON.stringify(news, null, 2));

    // Show samples
    console.log('\nSample publication:');
    if (pubs[0]) console.log(JSON.stringify(pubs[0], null, 2));

    console.log('\nSample person:');
    if (people[0]) console.log(JSON.stringify(people[0], null, 2));

    console.log('\n✅ Saved to data/cms-binary.json');
}

main().catch(console.error);
