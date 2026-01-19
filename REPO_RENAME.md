# Repository Rename Recommendation

## Current Status

**Current repo name:** `framer2bob`  
**Should be:** `mongooseproject` or `mongooseproject-gh-pages`

## Why Rename?

This repository is **specific to mongooseproject.org**, not a general Framer-to-GitHub tool:

- ✅ Contains the actual mongooseproject.org site files
- ✅ CMS configured specifically for Banded Mongoose Research Project content
- ✅ Extraction scripts tailored to this site's structure
- ✅ Not a reusable framework

## How to Rename

1. **On GitHub:**
   - Go to repository Settings → General
   - Scroll to "Repository name"
   - Change from `framer2bob` to `mongooseproject` (or `mongooseproject-gh-pages`)
   - Click "Rename"

2. **Update local remote:**
   ```bash
   git remote set-url origin git@github.com:mistersuuns/mongooseproject.git
   ```

3. **Update references:**
   - Update `static/admin/config.yml` and `site/admin/config.yml`:
     - Change `repo: mistersuuns/framer2bob` to `repo: mistersuuns/mongooseproject`
   - Update any documentation that references the old name

4. **Update GitHub Pages URL:**
   - After rename, site will be at: `https://mistersuuns.github.io/mongooseproject/`
   - Update any external links/bookmarks

## Alternative: Keep Name, Update Description

If you prefer to keep `framer2bob`:
- Update repository description to clarify it's for mongooseproject.org
- Update README to be more explicit about site-specific nature
