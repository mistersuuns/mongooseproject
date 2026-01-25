# Cloudflare Setup Guide - Reduce Netlify Bandwidth

## Why Cloudflare?
- **FREE** CDN service
- Reduces Netlify bandwidth by **70-90%**
- Improves site speed globally
- Works with Netlify

## Step-by-Step Setup

### 1. Sign Up for Cloudflare
1. Go to: https://dash.cloudflare.com/sign-up
2. Create free account
3. Verify email

### 2. Add Your Site

**Option A: Using Netlify Subdomain**
1. In Cloudflare dashboard, click "Add a Site"
2. Enter: `earnest-quokka-5963b7.netlify.app`
3. Choose "Free" plan
4. Click "Continue"

**Option B: Using Custom Domain** (if you have one)
1. Enter your custom domain (e.g., `mongooseproject.org`)
2. Cloudflare will scan your DNS
3. Follow prompts to update nameservers

### 3. Configure DNS

**For Netlify Subdomain:**
- Add CNAME record:
  - Name: `@` or `earnest-quokka-5963b7`
  - Target: `earnest-quokka-5963b7.netlify.app`
  - Proxy: **ON** (orange cloud)

**For Custom Domain:**
- Cloudflare will show you which nameservers to use
- Update at your domain registrar
- Wait for DNS propagation (5-30 minutes)

### 4. Set SSL/TLS Mode
1. Go to: SSL/TLS → Overview
2. Set to: **"Full"** or **"Full (strict)"**
3. This ensures proper SSL between Cloudflare and Netlify

### 5. Configure Page Rules (CRITICAL for CMS)

**Bypass Cloudflare for Admin Paths:**

1. Go to: Rules → Page Rules
2. Click "Create Page Rule"

**Rule 1: Bypass /admin/**
- URL: `*yourdomain.com/admin/*`
- Setting: **Bypass** (gray cloud - turn OFF proxy)
- Click "Save and Deploy"

**Rule 2: Bypass /.netlify/**
- URL: `*yourdomain.com/.netlify/*`
- Setting: **Bypass** (gray cloud - turn OFF proxy)
- Click "Save and Deploy"

**Why?** These paths need direct connection to Netlify for authentication to work.

### 6. Test Everything

**Test Site:**
1. Visit your site (may take a few minutes to propagate)
2. Check that pages load correctly
3. Check that images load

**Test CMS:**
1. Go to `/admin/`
2. Try GitHub login
3. Edit content
4. Save changes

**If CMS doesn't work:**
- Check Page Rules are set correctly
- Verify SSL mode is "Full"
- Wait 5-10 minutes for changes to propagate

### 7. Monitor Bandwidth

**In Netlify:**
1. Go to: https://app.netlify.com/account/billing
2. Check "Usage" tab
3. Watch bandwidth decrease over next few days

**Expected Result:**
- Bandwidth should drop by 70-90%
- Site should load faster
- Netlify usage should stay well under limits

## Troubleshooting

### CMS Login Fails
- **Fix:** Check Page Rules - `/admin/` and `/.netlify/` must bypass Cloudflare
- **Fix:** Set SSL mode to "Full" or "Full (strict)"

### Site Not Loading
- Wait 5-30 minutes for DNS propagation
- Check DNS records are correct
- Verify proxy is ON (orange cloud) for main site

### Images Not Loading
- Check that proxy is ON for image paths
- Verify public_folder in config.yml is correct

## Free Plan Limits

**Cloudflare Free:**
- Unlimited bandwidth
- Unlimited requests
- DDoS protection
- SSL certificates
- CDN caching

**Perfect for your use case!**

## After Setup

1. **Monitor Netlify usage** - Should drop significantly
2. **Test CMS regularly** - Make sure it still works
3. **Check site speed** - Should be faster
4. **Set up alerts** - In Netlify, set usage alerts at 80%

## Need Help?

If something breaks:
1. Temporarily disable Cloudflare (gray cloud everything)
2. Check Page Rules
3. Verify SSL settings
4. Contact Cloudflare support (they're helpful)
