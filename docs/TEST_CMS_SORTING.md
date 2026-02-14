# Testing CMS Sorting

## Step 1: Verify Deployment

1. Check Netlify deploy status: https://app.netlify.com/sites/earnest-quokka-5963b7/deploys
2. Wait for latest commit to finish deploying (should show "Published")
3. Your commit: `Update - sortable sections, sorted based on decap cms`

## Step 2: Access CMS

1. Go to: https://earnest-quokka-5963b7.netlify.app/admin/
2. Log in with GitHub (should work now with Git Gateway fixed)

## Step 3: Test Publications Sorting

1. Click **"Publications"** in the left sidebar
2. Look for **"Sort by"** dropdown (usually top-right of the list)
3. **Expected options:**
   - Year
   - Title
   - Authors
   - Category
4. **Test:**
   - Select "Year" → Should sort by year (newest/oldest)
   - Select "Title" → Should sort alphabetically by title
   - Select "Authors" → Should sort by authors
   - Select "Category" → Should sort by category

## Step 4: Test People Sorting

1. Click **"People"** collection
2. **"Sort by"** should show:
   - Name
   - Title/Role
3. Test both options

## Step 5: Test News Sorting

1. Click **"News"** collection
2. **"Sort by"** should show:
   - Date
   - Title
3. Test both options

## Troubleshooting

**Don't see "Sort by" dropdown?**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache
- Check browser console for errors (F12)

**Sorting not working?**
- Verify you're on the latest deploy
- Check that `sortable_fields` is in `site/admin/config.yml`
- Try logging out and back in

**Still not working?**
- Check Netlify deploy logs for errors
- Verify `site/admin/config.yml` was deployed correctly

## Expected Result

✅ You should be able to sort publications by **Year** (matching Framer's date sorting)
✅ All collections should have their respective sort options
✅ Sorting should work immediately when you change the dropdown
