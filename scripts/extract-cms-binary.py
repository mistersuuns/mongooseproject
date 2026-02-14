#!/usr/bin/env python3
"""
Extract complete Framer CMS data from binary chunk file.

Downloads the .framercms file and parses all 153 records.
"""

import re
import json
import os
import sys
from urllib.request import urlopen

CMS_URL = 'https://framerusercontent.com/cms/MMCU5nkNvL1LWQNtLL0v/8IK8dXDrbX3ArJBJEIAe/YsFLfhiR7-chunk-default-0.framercms'

TYPE_MAP = {
    'OxvocGmTp': 'pub',
    'tSU0Hl_5a': 'news',
    'ckm9zJSL2': 'person'
}

CATEGORY_MAP = {
    'wvxrkBUJg': 'Director',
    'CDAsunGo5': 'Co-I',
    'xcRhC4Po3': 'PostDoc or Grad Student',
    'uVch310j7': 'Alum'
}

def download_cms():
    """Download the CMS binary file."""
    print(f"Downloading CMS from Framer...")
    with urlopen(CMS_URL) as response:
        return response.read()

def clean_field(text, markers):
    """Clean a field value by removing control chars and truncating at markers."""
    text = re.sub(r'[\x00-\x1F]', '', text)
    for marker in markers:
        if marker in text:
            text = text.split(marker)[0]
    return text.strip()

def parse_records(data):
    """Parse all records from binary data."""
    # Find all record positions (marked by \x00\x02id)
    pattern = b'\x00\x02id'
    matches = list(re.finditer(pattern, data))
    print(f"Found {len(matches)} record markers")

    records = []

    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i+1].start() if i+1 < len(matches) else len(data)

        record_data = data[start:end]
        text = record_data.decode('utf-8', errors='ignore')

        record = {}

        # Type
        for enum_id, type_name in TYPE_MAP.items():
            if enum_id in text:
                record['type'] = type_name
                break

        # Slug - pattern is: TAIvpALDu + \x0c\x00\x00\x00 + length_byte + slug
        # The length byte can be any value (including 0x61-0x7a which are 'a'-'z')
        # So we need to skip exactly 5 bytes, not match until first lowercase
        slug_match = re.search(r'TAIvpALDu.{5}([a-z][a-z0-9-]+)', text)
        if slug_match:
            record['slug'] = slug_match.group(1)

        # Title
        title_match = re.search(r'Hohw1kgab.{1,10}?([A-Z][^\x00-\x08]{2,150})', text)
        if title_match:
            record['title'] = clean_field(title_match.group(1),
                ['tYY63', 'm2RDH', 'TAIvp', 'SHDM1', 'MY38j', 'sjk5F', 'Cq553'])

        # Authors (only for publications)
        if record.get('type') == 'pub':
            authors_match = re.search(r'tYY63vr3J.{1,10}?([A-Z][^\x00-\x08]{5,400})', text)
            if authors_match:
                record['authors'] = clean_field(authors_match.group(1),
                    ['m2RDH', 'TAIvp', 'WO629', 't8YR7', 'ePjCE'])

            # Journal
            journal_match = re.search(r'm2RDHl8lV.{1,10}?([A-Z][^\x00-\x08]{2,100})', text)
            if journal_match:
                record['journal'] = clean_field(journal_match.group(1),
                    ['TAIvp', 'WO629', 't8YR7', 'ePjCE'])

            # Year
            year_match = re.search(r't8YR7PHk7.{1,5}?(\d{4})', text)
            if year_match:
                record['year'] = year_match.group(1)

            # PDF
            pdf_match = re.search(r'(https://framerusercontent\.com/assets/[A-Za-z0-9_-]+\.pdf)', text)
            if pdf_match:
                record['pdf'] = pdf_match.group(1)

            # External URL
            url_match = re.search(r'WO629Dm7x.{1,30}?(https?://[^\s\x00-\x1F"]+)', text)
            if url_match:
                record['url'] = url_match.group(1)

        # Position (for people)
        if record.get('type') == 'person':
            pos_match = re.search(r'MY38jWI86.{1,10}?([A-Z][^\x00-\x08]{2,60})', text)
            if pos_match:
                record['position'] = clean_field(pos_match.group(1),
                    ['sjk5F', 'Cq553', 'TAIvp'])

        # Category (for people)
        for enum_id, cat_name in CATEGORY_MAP.items():
            if enum_id in text:
                record['category'] = cat_name
                break

        # Image
        img_match = re.search(r'(https://framerusercontent\.com/images/[A-Za-z0-9_-]+)', text)
        if img_match:
            record['image'] = img_match.group(1)

        if record.get('slug') and record.get('type'):
            records.append(record)

    return records

def save_markdown(records, data_dir):
    """Save records as markdown files."""
    collections = {
        'publications': [r for r in records if r.get('type') == 'pub'],
        'people': [r for r in records if r.get('type') == 'person'],
        'news': [r for r in records if r.get('type') == 'news']
    }

    for collection, items in collections.items():
        coll_dir = os.path.join(data_dir, collection)
        os.makedirs(coll_dir, exist_ok=True)

        for item in items:
            if not item.get('slug'):
                continue

            lines = ['---']

            if item.get('title'):
                lines.append(f'title: "{item["title"].replace(chr(34), chr(39))}"')
            lines.append(f'slug: "{item["slug"]}"')

            if collection == 'publications':
                if item.get('authors'):
                    lines.append(f'authors: "{item["authors"].replace(chr(34), chr(39))}"')
                if item.get('journal'):
                    lines.append(f'journal: "{item["journal"].replace(chr(34), chr(39))}"')
                if item.get('year'):
                    lines.append(f'year: "{item["year"]}"')
                if item.get('url'):
                    lines.append(f'url: "{item["url"]}"')
                if item.get('pdf'):
                    lines.append(f'pdf: "{item["pdf"]}"')
            elif collection == 'people':
                if item.get('position'):
                    lines.append(f'position: "{item["position"].replace(chr(34), chr(39))}"')
                if item.get('category'):
                    lines.append(f'category: "{item["category"]}"')
                if item.get('image'):
                    lines.append(f'image: "{item["image"]}"')
            elif collection == 'news':
                if item.get('image'):
                    lines.append(f'image: "{item["image"]}"')

            lines.extend(['---', ''])

            filepath = os.path.join(coll_dir, f'{item["slug"]}.md')
            with open(filepath, 'w') as f:
                f.write('\n'.join(lines))

        print(f"  {collection}: {len(items)} files")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, '..', 'data')

    print("=== Framer CMS Binary Extraction ===\n")

    # Download
    data = download_cms()
    print(f"Downloaded {len(data)} bytes\n")

    # Parse
    records = parse_records(data)

    pubs = [r for r in records if r.get('type') == 'pub']
    people = [r for r in records if r.get('type') == 'person']
    news = [r for r in records if r.get('type') == 'news']

    print(f"\nExtracted {len(records)} records:")
    print(f"  Publications: {len(pubs)}")
    print(f"  People: {len(people)}")
    print(f"  News: {len(news)}")

    # Save JSON
    with open(os.path.join(data_dir, 'cms-complete.json'), 'w') as f:
        json.dump({'publications': pubs, 'people': people, 'news': news}, f, indent=2)

    # Save individual JSONs
    with open(os.path.join(data_dir, 'publications-from-binary.json'), 'w') as f:
        json.dump(pubs, f, indent=2)
    with open(os.path.join(data_dir, 'people-from-binary.json'), 'w') as f:
        json.dump(people, f, indent=2)
    with open(os.path.join(data_dir, 'news-from-binary.json'), 'w') as f:
        json.dump(news, f, indent=2)

    # Save markdown
    print("\nSaving markdown files...")
    save_markdown(records, data_dir)

    print(f"\n✅ Complete! Extracted {len(records)} of 153 records")
    print(f"   Data saved to: {data_dir}/cms-complete.json")

if __name__ == '__main__':
    main()
