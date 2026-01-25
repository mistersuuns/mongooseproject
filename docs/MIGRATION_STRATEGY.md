# Framer to Decap CMS Migration Strategy

This document outlines a robust, repeatable workflow for migrating a Framer site to a self-hosted Netlify/Decap CMS setup. This approach decouples **Data Acquisition** from **Content Processing**, ensuring the process is resilient to network issues, DNS blocks, or large file sizes.

## 1. Core Principles

*   **Offline-First Processing:** The extraction scripts should never rely on active network connections during execution. They should process local files only.
*   **Single Source of Truth:** The Framer `searchIndex.json` is the database export. It contains the most structured data (titles, slugs, SEO descriptions).
*   **HTML for Enrichment:** Raw HTML files are used only to enrich the data (e.g., full bio text) where the JSON is incomplete.

## 2. Workflow Steps

### Phase 1: Data Acquisition (The "Dump")

_Goal: Capture a complete snapshot of the source site locally._

1.  **Retrieve the "Database" (`searchIndex.json`):**
    *   Find the `framer-search-index` URL in the site's source code.
    *   Download this JSON file to `data/searchIndex.json`.
    *   *Note: If terminal tools (`wget`/`curl`) fail due to firewall/DNS, use a browser to save this file manually.*

2.  **Retrieve the "Content" (HTML Snapshot):**
    *   Mirror the site HTML to a local `site/` directory.
    *   If using `wget` (CLI) fails or returns empty SPA shells, use a browser-based scraper to "Print to HTML" or "Save Page As" for critical pages.

### Phase 2: Content Processing (The "Migration")

_Goal: detailed, structured Markdown files for the CMS._

1.  **Run Extraction Script (`scripts/extract-cms-data-v2.js`):**
    *   **Input:** Reads `data/searchIndex.json` and `site/**/*.html`.
    *   **Logic:**
        *   Iterates through the JSON keys to find People, News, and Publications.
        *   Cross-references with local HTML files to find long-form content (Bios) if missing from JSON.
        *   Cleans data (formatting years, removing artifacts).
    *   **Output:** Generates `data/people.json`, `data/publications.json`, etc.

2.  **Run Conversion Script (`scripts/convert-json-to-markdown.js`):**
    *   **Input:** Reads the intermediate JSON files.
    *   **Output:** Writes valid Frontmatter Markdown files (`.md`) to the `data/{collection}/` directories.

## 3. Configuration & Deployment

1.  **Configure CMS (`admin/config.yml`):**
    *   Ensure fields match the extracted structure (e.g., `year` as String if needed).
2.  **Build & Deploy:**
    *   Commit the `data/` and `site/` directories.
    *   Netlify simply serves the static `site/` folder, while Decap CMS manages the `data/` Markdown files.

---

## Recovery from Failure

*   **IF Network Fails:** The extraction script will not break. It simply asks for the file to be placed in `data/`.
*   **IF HTML is Empty:** The script falls back to the JSON descriptions, ensuring valid (though brief) content is always generated.
