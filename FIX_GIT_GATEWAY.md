# Fix Git Gateway Error After Repository Rename

## Problem
After renaming the repository from `framer2bob` to `mongooseproject`, Netlify's Git Gateway can't connect, causing a 400 error when trying to log into Decap CMS.

## Solution: Reconnect Netlify to GitHub

### Step 1: Update Netlify Site Settings

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Select your site**: `earnest-quokka-5963b7` (or your site name)
3. **Go to**: Site settings → **Build & deploy** → **Continuous Deployment**
4. **Check the repository**: Should show `mistersuuns/mongooseproject`
   - If it shows the old name (`framer2bob`), you need to reconnect

### Step 2: Reconnect Repository (if needed)

**Option A: Update existing connection**
1. Click **"Options"** next to the repository
2. Click **"Edit settings"**
3. Verify it points to: `mistersuuns/mongooseproject`
4. If wrong, disconnect and reconnect

**Option B: Disconnect and reconnect**
1. Click **"Options"** → **"Disconnect repository"**
2. Click **"Link repository"**
3. Select **GitHub**
4. Find and select: `mistersuuns/mongooseproject`
5. Confirm connection

### Step 3: Re-enable Git Gateway

1. **Go to**: Site settings → **Identity**
2. **Enable Identity** (if not already enabled)
3. **Scroll down to "Services"**
4. **Enable "Git Gateway"** (toggle should be ON)
5. **Save**

### Step 4: Verify Git Gateway

1. **Go to**: Site settings → **Identity** → **Services** → **Git Gateway**
2. Should show: **"Connected to GitHub"**
3. If it shows an error, click **"Edit settings"** and reconnect

### Step 5: Test CMS

1. Go to: `https://earnest-quokka-5963b7.netlify.app/admin/`
2. Try logging in with GitHub
3. Should work now!

## If Still Not Working

**Check Netlify Identity Registration:**
1. Site settings → **Identity** → **Registration**
2. Should be set to **"Invite only"** or **"Open"** (not "Closed")

**Clear Browser Cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or try incognito/private window

**Check Netlify Logs:**
1. Go to: Site → **Functions** → **Identity**
2. Check for any errors in the logs

## Quick Checklist

- [ ] Repository in Netlify shows: `mistersuuns/mongooseproject`
- [ ] Identity is enabled
- [ ] Git Gateway is enabled
- [ ] Git Gateway shows "Connected to GitHub"
- [ ] Registration is not "Closed"
