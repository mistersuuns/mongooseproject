# Cloudflare Setup Steps (With Custom Domain)

## Prerequisites

✅ **Netlify Pro** - Already upgraded
✅ **Custom domain** - Need `mongooseproject.org` (or your domain)
✅ **Domain control** - Access to domain registrar

## Step 1: Add Custom Domain to Netlify

**In Netlify:**

1. Go to: https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
2. Click **"Add custom domain"**
3. Enter your domain: `mongooseproject.org` (or `www.mongooseproject.org`)
4. Click **"Verify"**
5. Netlify will show DNS records you need to add

**Note:** If domain is currently pointing to Framer, you'll need to update DNS at your registrar.

## Step 2: Add Custom Domain to Cloudflare

**In Cloudflare:**

1. Go to: https://dash.cloudflare.com
2. Click **"Add a Site"** (or remove the Netlify subdomain first)
3. Enter your custom domain: `mongooseproject.org`
4. Click **"Continue"**
5. Choose **"Free"** plan
6. Click **"Continue"**

## Step 3: Update Nameservers at Registrar

**Cloudflare will show you nameservers like:**
- `ns1.cloudflare.com`
- `ns2.cloudflare.com`

**At your domain registrar (where you bought the domain):**

1. Log in to your registrar (e.g., Namecheap, Google Domains, etc.)
2. Go to DNS/Nameserver settings
3. Change nameservers to Cloudflare's nameservers
4. Save changes
5. Wait 5-30 minutes for propagation

**This gives Cloudflare control of your DNS.**

## Step 4: Configure DNS Records in Cloudflare

**After nameservers propagate, in Cloudflare DNS page:**

1. **Delete any existing records** (if any)

2. **Add CNAME record:**
   - Type: `CNAME`
   - Name: `@` (or blank for root)
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto
   - Click **"Save"**

3. **Add www CNAME (optional):**
   - Type: `CNAME`
   - Name: `www`
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto
   - Click **"Save"**

**Important:** Make sure proxy is **ON** (orange cloud) for bandwidth reduction!

## Step 5: Configure SSL/TLS

**In Cloudflare:**

1. Go to: **SSL/TLS** → **Overview**
2. Set to: **"Full"** or **"Full (strict)"**
3. This ensures proper SSL between Cloudflare and Netlify

## Step 6: Set Up Page Rules (CRITICAL for CMS)

**These bypass Cloudflare for CMS paths:**

1. Go to: **Rules** → **Page Rules**
2. Click **"Create Page Rule"**

**Rule 1: Bypass /admin/**
- URL: `*mongooseproject.org/admin/*`
  - (Or `*yourdomain.com/admin/*`)
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Rule 2: Bypass /.netlify/**
- Click **"Create Page Rule"** again
- URL: `*mongooseproject.org/.netlify/*`
  - (Or `*yourdomain.com/.netlify/*`)
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Why?** CMS authentication needs direct connection to Netlify.

## Step 7: Update Netlify Domain Settings

**In Netlify:**

1. Go to: Domain management
2. Make sure custom domain is verified
3. Netlify should automatically detect Cloudflare
4. SSL certificate should provision automatically

## Step 8: Test Everything

**Wait 10-30 minutes for DNS propagation, then:**

### Test Site:
1. Visit: `https://mongooseproject.org`
2. Check pages load correctly
3. Check images load
4. Site should be faster (Cloudflare caching)

### Test CMS:
1. Go to: `https://mongooseproject.org/admin/`
2. Click **"Login with GitHub"**
3. Try editing content
4. Save changes
5. Should work perfectly!

### Check Bandwidth:
1. Go to Netlify: https://app.netlify.com/account/billing
2. Check **"Usage"** tab
3. Monitor over next few days
4. **Bandwidth should drop by 70-90%!**

## Troubleshooting

### Site Not Loading
- Wait 10-30 minutes for DNS propagation
- Check nameservers are updated at registrar
- Verify DNS records in Cloudflare
- Check SSL mode is "Full"

### CMS Login Fails
- Verify Page Rules are set (bypass `/admin/` and `/.netlify/`)
- Check SSL mode is "Full"
- Wait 10 minutes for changes to propagate
- Try clearing browser cache

### SSL Certificate Errors
- Set SSL mode to "Full" or "Full (strict)"
- Wait for certificate provisioning (can take a few minutes)
- Check Netlify domain settings

## Success Indicators

✅ Site loads at custom domain
✅ Site is faster (Cloudflare caching)
✅ CMS login works
✅ Can edit content in CMS
✅ Netlify bandwidth usage drops significantly
✅ No SSL errors

## What You'll Get

**Bandwidth Reduction:**
- 70-90% reduction in Netlify bandwidth
- Most traffic served from Cloudflare cache
- Netlify only serves cache misses

**Performance:**
- Faster site loading (global CDN)
- Better user experience
- Lower latency worldwide

**Cost Savings:**
- Stay within Netlify free plan limits (if you downgrade later)
- Or use less of Pro plan bandwidth
- Cloudflare is free!

## Next Steps After Setup

**Monitor for a week:**
1. Check Netlify bandwidth usage
2. Verify CMS continues working
3. Test site performance
4. Monitor for any issues

**Optional:**
- Consider downgrading Netlify to free plan later
- Cloudflare handles bandwidth, Netlify just hosts
- Save $19/month (if bandwidth stays low)

## Quick Reference

**Cloudflare Dashboard:** https://dash.cloudflare.com
**Netlify Domain Settings:** https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
**Page Rules:** Rules → Page Rules in Cloudflare
**SSL/TLS:** SSL/TLS → Overview in Cloudflare
