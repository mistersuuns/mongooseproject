# Fix for Update Issue

## Problem
- Old files were staying in `site/` directory
- New files were being downloaded to `site/mongooseproject.org/` subdirectory
- Netlify was serving old files instead of new ones

## Fix Applied

1. **Changed `--no-clobber` to `--timestamping`** in `download-site.sh`
   - Now wget will check timestamps and download fresh files

2. **Added cleanup step** in `update-content.sh`
   - Removes old site files (except `admin/`, `.gitkeep`, `.nojekyll`) before downloading
   - Forces a completely fresh download

3. **Improved file moving logic** in `download-site.sh`
   - Better detection of subdirectory structure
   - Moves files from `site/mongooseproject.org/` to `site/` correctly

## How to Use Now

```bash
cd /Users/robertturner/local-only/framer-site
./update-content.sh
git add site/
git commit -m "Update from Framer (fresh download)"
git push origin main
```

The script will now:
1. ✅ Backup old files
2. ✅ Clean out old site files
3. ✅ Download fresh content from Framer
4. ✅ Move files to correct location
5. ✅ You commit and push

## Verify It Worked

After pushing, check:
- Netlify deploy logs show new files
- Site shows latest Framer content (no old errors)
- Compare: `https://mongooseproject.org/` (Framer) vs your Netlify URL
