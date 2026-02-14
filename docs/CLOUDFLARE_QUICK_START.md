# Cloudflare Quick Start - Step by Step

## Your Site Info
- **Netlify URL:** `earnest-quokka-5963b7.netlify.app`
- **CMS URL:** `https://earnest-quokka-5963b7.netlify.app/admin/`

## Step 1: Sign Up (2 minutes)

1. Go to: **https://dash.cloudflare.com/sign-up**
2. Enter email and password
3. Verify email (check inbox)
4. Click "Get started" or "Add a Site"

## Step 2: Add Your Site (3 minutes)

### If Using Netlify Subdomain:
1. In Cloudflare dashboard, click **"Add a Site"**
2. Enter: `earnest-quokka-5963b7.netlify.app`
3. Click **"Continue"**
4. Choose **"Free"** plan
5. Click **"Continue"**

### If Using Custom Domain:
1. Enter your custom domain (e.g., `mongooseproject.org`)
2. Click **"Continue"**
3. Cloudflare will scan DNS
4. Follow prompts to update nameservers at your registrar

## Step 3: Configure DNS (5 minutes)

### For Netlify Subdomain:
1. Cloudflare will show DNS records
2. Add/verify CNAME record:
   - **Name:** `@` or `earnest-quokka-5963b7`
   - **Target:** `earnest-quokka-5963b7.netlify.app`
   - **Proxy:** **ON** (orange cloud ☁️)
3. Click **"Continue"**

### For Custom Domain:
1. Cloudflare shows nameservers (e.g., `ns1.cloudflare.com`)
2. Go to your domain registrar (where you bought the domain)
3. Update nameservers to Cloudflare's
4. Wait 5-30 minutes for propagation

## Step 4: SSL/TLS Settings (1 minute)

1. In Cloudflare dashboard, go to: **SSL/TLS** → **Overview**
2. Set to: **"Full"** or **"Full (strict)"**
3. This ensures proper SSL between Cloudflare and Netlify

## Step 5: Page Rules for CMS (CRITICAL - 3 minutes)

**This is the most important step!**

1. Go to: **Rules** → **Page Rules**
2. Click **"Create Page Rule"**

### Rule 1: Bypass /admin/
- **URL:** `*earnest-quokka-5963b7.netlify.app/admin/*`
  - (Or `*yourdomain.com/admin/*` if custom domain)
- **Setting:** Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

### Rule 2: Bypass /.netlify/
- Click **"Create Page Rule"** again
- **URL:** `*earnest-quokka-5963b7.netlify.app/.netlify/*`
  - (Or `*yourdomain.com/.netlify/*` if custom domain)
- **Setting:** Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Why?** These paths need direct connection to Netlify for CMS authentication.

## Step 6: Test (2 minutes)

### Test Site:
1. Visit: `https://earnest-quokka-5963b7.netlify.app`
2. Check pages load correctly
3. Check images load

### Test CMS:
1. Go to: `https://earnest-quokka-5963b7.netlify.app/admin/`
2. Click **"Login with GitHub"**
3. Try editing content
4. Save changes

**If CMS doesn't work:**
- Check Page Rules are saved
- Verify SSL mode is "Full"
- Wait 5-10 minutes for changes to propagate

## Step 7: Monitor (Ongoing)

1. Go to Netlify: https://app.netlify.com/account/billing
2. Check **"Usage"** tab
3. Watch bandwidth decrease over next few days

**Expected:** Bandwidth should drop by 70-90%

## Troubleshooting

### "Site not found" in Cloudflare
- Wait 5-30 minutes for DNS propagation
- Check DNS records are correct

### CMS login fails
- **Fix:** Verify Page Rules are set (bypass for `/admin/` and `/.netlify/`)
- **Fix:** Check SSL mode is "Full"
- **Fix:** Wait 10 minutes for changes to propagate

### Images not loading
- Check proxy is ON (orange cloud) for main site
- Verify `public_folder` in `config.yml` is correct

## Need Help?

If stuck:
1. Temporarily disable Cloudflare (gray cloud everything)
2. Check Page Rules are correct
3. Verify SSL settings
4. Contact Cloudflare support

## Success Indicators

✅ Site loads faster
✅ CMS login works
✅ Netlify bandwidth drops
✅ No errors in browser console
