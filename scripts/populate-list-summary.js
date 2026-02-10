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
  if (kind === 'publications') {
    const year = getFrontmatterValue(fm, 'year');
    const title = getFrontmatterValue(fm, 'title');
    const journal = getFrontmatterValue(fm, 'journal');
    listSummary = [year, title, journal].filter(Boolean).join(' | ');
  } else if (kind === 'news') {
    const year = getFrontmatterValue(fm, 'year');
    const title = getFrontmatterValue(fm, 'title');
    listSummary = [year, title].filter(Boolean).join(' | ');
  } else if (kind === 'people') {
    const title = getFrontmatterValue(fm, 'title');
    const position = getFrontmatterValue(fm, 'position');
    listSummary = [title, position].filter(Boolean).join(' | ');
  }
  if (!listSummary) return false;
  const newFm = setOrReplaceInFrontmatter(fm, 'list_summary', listSummary);
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
