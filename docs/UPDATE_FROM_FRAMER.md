# Update Workflow: Framer → Netlify

## Quick Workflow (3 Steps)

### 1. Make Changes in Framer
- Edit your site in Framer
- Publish your changes

### 2. Download & Push
```bash
cd /Users/robertturner/local-only/framer-site

# Download updated site (creates backup automatically)
./update-content.sh

# Review changes (optional)
git diff site/

# Commit and push
git add site/
git commit -m "Update from Framer"
git push origin main
```

### 3. Netlify Auto-Deploys
- ✅ **Automatic!** No manual step needed
- Netlify watches your GitHub repo
- Deploys in 1-2 minutes after push

---

## What Gets Updated?

**Design/Layout Changes:**
- All HTML/CSS/JS from Framer
- Automatically downloaded and deployed

**CMS Content (Publications, News, People):**
- If you update CMS in Framer → re-download (step 2)
- If you update via Decap CMS → no download needed (changes go directly to GitHub)

---

## Alternative: Manual Download

If you prefer to use the download script directly:

```bash
./download-site.sh https://mongooseproject.org/
git add site/
git commit -m "Update from Framer"
git push origin main
```

---

## Updating CMS Data Separately

If you only want to update CMS data (publications, people, news) without re-downloading the entire site:

```bash
# Extract CMS data from current Framer site
npm run extract-cms

# Convert to Markdown
npm run convert-to-md

# Commit and push
git add data/
git commit -m "Update CMS data"
git push origin main
```

**Note:** This extracts data from the live Framer site's searchIndex JSON, so make sure your Framer changes are published first.

---

## Troubleshooting

**Site not updating on Netlify?**
- Check Netlify deploy logs: https://app.netlify.com/sites/[your-site]/deploys
- Verify `netlify.toml` has `publish = "site"`

**Download fails?**
- Make sure `wget` is installed: `brew install wget`
- Check Framer site URL is correct: `https://mongooseproject.org/`

**Want to test locally first?**
```bash
# Open in browser
open site/index.html
```
