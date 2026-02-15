#!/usr/bin/env node
/**
 * Populate list_summary in all Decap CMS content files so the admin list view
 * shows "Year | Title | Journal" (or equivalent) reliably. Decap often fails to
 * show multiple summary fields; using a single list_summary string fixes that.
 *
 * Run: node scripts/populate-list-summary.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

function getFrontmatterValue(fm, key) {
  const line = fm.split('\n').find((l) => l.startsWith(key + ':'));
  if (!line) return null;
  const rest = line.slice(key.length + 1).trim();
  if (rest.startsWith('"') && rest.length >= 2) {
    return rest.slice(1, rest.length - 1).replace(/\\"/g, '"');
  }
  if (rest.startsWith('[')) return null; // list, skip for list_summary
  return rest;
}

/**
 * Attempt to extract a publication year from a DOI or URL string.
 * Matches patterns like:
 *   doi.org/10.1098/rsbl.2014.0898  → 2014
 *   doi.org/10.1016/j.cub.2018.05.001  → 2018
 *   nature.com/articles/s41598-023-44950-6  → 2023 (2-digit → 4-digit)
 *   pmc.ncbi.nlm.nih.gov/articles/PMC5008155/  → no match (not reliable)
 * Only returns years in a plausible academic range (1990–current+1).
 */
function extractYearFromUrl(url) {
  if (!url) return null;
  const currentYear = new Date().getFullYear();

  // Try explicit 4-digit year patterns in DOI suffixes and URL paths
  // e.g. rsbl.2014.0898, j.cub.2018.05.001, 10.3389/fevo.2016.00058
  const fourDigit = url.match(/[./](\d{4})[./]/g);
  if (fourDigit) {
    for (const m of fourDigit) {
      const y = parseInt(m.replace(/[./]/g, ''), 10);
      if (y >= 1990 && y <= currentYear + 1) return String(y);
    }
  }

  // Try 2-digit year in nature-style DOIs: s41598-023-44950
  const twoDigit = url.match(/[-/]0?(\d{2})[-/]/g);
  if (twoDigit) {
    for (const m of twoDigit) {
      const digits = parseInt(m.replace(/[-/]/g, ''), 10);
      const y = digits >= 90 ? 1900 + digits : 2000 + digits;
      if (y >= 1990 && y <= currentYear + 1) return String(y);
    }
  }

  return null;
}

function setOrReplaceInFrontmatter(fm, key, value) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const newLine = `${key}: "${escaped}"`;
  const lines = fm.split('\n');
  const idx = lines.findIndex((l) => l.startsWith(key + ':'));
  if (idx >= 0) {
    lines[idx] = newLine;
  } else {
    lines.splice(1, 0, newLine); // after ---
  }
  return lines.join('\n');
}

function processFile(filePath, kind) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return false;
  const [full, fm] = match;
  let listSummary = '';
  let yearInferred = false;
  if (kind === 'publications') {
    let year = getFrontmatterValue(fm, 'year');
    if (!year) {
      const url = getFrontmatterValue(fm, 'url');
      const pdf = getFrontmatterValue(fm, 'pdf');
      year = extractYearFromUrl(url) || extractYearFromUrl(pdf);
      if (year) yearInferred = true;
    }
    const title = getFrontmatterValue(fm, 'title');
    const journal = getFrontmatterValue(fm, 'journal');
    listSummary = [year, title, journal].filter(Boolean).join(' | ');
  } else if (kind === 'news') {
    let year = getFrontmatterValue(fm, 'year');
    if (!year) {
      const url = getFrontmatterValue(fm, 'url');
      const date = getFrontmatterValue(fm, 'date');
      year = (date && date.match(/^(\d{4})/)?.[1]) || extractYearFromUrl(url);
      if (year) yearInferred = true;
    }
    const title = getFrontmatterValue(fm, 'title');
    listSummary = [year, title].filter(Boolean).join(' | ');
  } else if (kind === 'people') {
    const title = getFrontmatterValue(fm, 'title');
    const position = getFrontmatterValue(fm, 'position');
    listSummary = [title, position].filter(Boolean).join(' | ');
  }
  if (!listSummary) return false;
  let newFm = fm;
  if (yearInferred) {
    const year = kind === 'publications'
      ? (getFrontmatterValue(fm, 'year') || extractYearFromUrl(getFrontmatterValue(fm, 'url')) || extractYearFromUrl(getFrontmatterValue(fm, 'pdf')))
      : (getFrontmatterValue(fm, 'year') || getFrontmatterValue(fm, 'date')?.match(/^(\d{4})/)?.[1] || extractYearFromUrl(getFrontmatterValue(fm, 'url')));
    if (year) {
      newFm = setOrReplaceInFrontmatter(newFm, 'year', year);
      console.log(`  Inferred year ${year} from URL: ${path.basename(filePath)}`);
    }
  }
  newFm = setOrReplaceInFrontmatter(newFm, 'list_summary', listSummary);
  const newRaw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, `---\n${newFm}\n---\n`);
  fs.writeFileSync(filePath, newRaw, 'utf-8');
  return true;
}

let count = 0;
for (const dir of ['publications', 'news', 'people']) {
  const dirPath = path.join(dataDir, dir);
  if (!fs.existsSync(dirPath)) continue;
  const kind = dir === 'people' ? 'people' : dir === 'news' ? 'news' : 'publications';
  for (const name of fs.readdirSync(dirPath)) {
    if (!name.endsWith('.md')) continue;
    const filePath = path.join(dirPath, name);
    if (processFile(filePath, kind)) count++;
  }
}
console.log(`Updated list_summary in ${count} files.`);
