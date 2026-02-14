# Content Update Workflow

## When You Make Changes in Framer

### Step 1: Revise in Framer
- Make your design/content changes in Framer
- Publish your changes in Framer

### Step 2: Download Updated Site
```bash
cd /Users/robertturner/local-only/framer-site
./download-site.sh https://mongooseproject.org/
```

Or use the update script:
```bash
./update-content.sh https://mongooseproject.org/
```

### Step 3: Push to GitHub
```bash
git add site/
git commit -m "Update site content from Framer"
git push origin main
```

### Step 4: Netlify Auto-Deploys
- ✅ **Automatic!** No manual step needed
- Netlify watches your GitHub repo
- When you push, it automatically:
  - Detects the change
  - Rebuilds the site
  - Deploys the update
- Takes 1-2 minutes

## When You Update CMS Content (Publications, News, People)

### Option A: Use Decap CMS (Easiest)
1. Visit: `https://your-site.netlify.app/admin/`
2. Login with GitHub
3. Edit content directly in the CMS
4. Save → Auto-commits to GitHub → Netlify auto-deploys

### Option B: Edit Markdown Files
1. Edit files in `data/publications/`, `data/news/`, or `data/people/`
2. Commit and push:
   ```bash
   git add data/
   git commit -m "Update publication content"
   git push origin main
   ```
3. Netlify auto-deploys

## Quick Reference

**Framer design changes:**
```bash
./download-site.sh https://mongooseproject.org/
git add site/ && git commit -m "Update from Framer" && git push
# Netlify auto-deploys
```

**CMS content changes:**
- Use CMS at `/admin/` (easiest)
- Or edit markdown files in `data/`

**Both:**
- Push to GitHub
- Netlify handles deployment automatically

## No Manual Netlify Deploy Needed!

Once Netlify is connected to your GitHub repo, it **automatically deploys** on every push. You don't need to manually trigger deploys in Netlify.
