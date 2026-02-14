# Next Steps: Cloudflare Setup

## Current Status
✅ ALIAS record added in Porkbun
✅ DNS pointing to Netlify
⏳ Waiting for DNS propagation

## Step 1: Wait and Check DNS Propagation

**Wait 10-15 minutes, then check:**

1. **Check DNS propagation:**
   - Go to: https://dnschecker.org
   - Enter: `mistersuuns.space`
   - Should show resolving to Netlify
   - Wait until it shows globally (green checkmarks)

2. **Check Netlify:**
   - Go to: https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
   - Domain status should change from "Pending DNS verification" to verified
   - SSL certificate should start provisioning (takes 5-10 minutes)

3. **Test domain:**
   - Visit: `https://mistersuuns.space`
   - Should load your Netlify site
   - SSL should be active

## Step 2: Add Domain to Cloudflare

**Once DNS is working with Netlify:**

1. **Go to Cloudflare:**
   - https://dash.cloudflare.com
   - Log in

2. **Remove Netlify subdomain (if still there):**
   - Find `earnest-quokka-5963b7.netlify.app` site
   - Remove it (or leave it, doesn't matter)

3. **Add your domain:**
   - Click **"Add a Site"**
   - Enter: `mistersuuns.space`
   - Click **"Continue"**
   - Choose **"Free"** plan
   - Click **"Continue"**

## Step 3: Update Nameservers in Porkbun

**Cloudflare will show you nameservers like:**
- `ns1.cloudflare.com`
- `ns2.cloudflare.com`
- (Cloudflare will show you the exact ones)

**In Porkbun:**

1. Go back to Porkbun DNS settings
2. Look for **"Nameservers"** section (not DNS records)
3. Change from default to Cloudflare's nameservers:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
   - (Use the exact ones Cloudflare shows)
4. Save changes
5. Wait 5-30 minutes for propagation

**This gives Cloudflare control of DNS.**

## Step 4: Configure DNS in Cloudflare

**After nameservers propagate:**

1. **In Cloudflare DNS page:**
   - Delete any auto-detected records (if any)

2. **Add CNAME record:**
   - Type: `CNAME`
   - Name: `@` (or blank for root)
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️) ← **IMPORTANT!**
   - TTL: Auto
   - Click **"Save"**

3. **Add www CNAME:**
   - Type: `CNAME`
   - Name: `www`
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto
   - Click **"Save"**

**Critical:** Make sure proxy is **ON** (orange cloud) for bandwidth reduction!

## Step 5: Configure SSL/TLS

**In Cloudflare:**

1. Go to: **SSL/TLS** → **Overview**
2. Set to: **"Full"** or **"Full (strict)"**
3. This ensures proper SSL between Cloudflare and Netlify
4. Wait 2-5 minutes for SSL certificate provisioning

## Step 6: Set Up Page Rules (For CMS)

**These bypass Cloudflare for CMS authentication:**

1. Go to: **Rules** → **Page Rules**
2. Click **"Create Page Rule"**

**Rule 1: Bypass /admin/**
- URL: `*mistersuuns.space/admin/*`
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Rule 2: Bypass /.netlify/**
- Click **"Create Page Rule"** again
- URL: `*mistersuuns.space/.netlify/*`
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Why?** CMS authentication needs direct connection to Netlify.

## Step 7: Test Everything

**Wait 10-30 minutes for all changes to propagate, then:**

### Test Site:
1. Visit: `https://mistersuuns.space`
2. Check pages load correctly
3. Check images load
4. Site should be **faster** (Cloudflare caching!)

### Test CMS:
1. Go to: `https://mistersuuns.space/admin/`
2. Click **"Login with GitHub"**
3. Try editing content
4. Save changes
5. Should work perfectly!

### Check Bandwidth:
1. Go to Netlify: https://app.netlify.com/account/billing
2. Check **"Usage"** tab
3. Monitor over next few days
4. **Bandwidth should drop by 70-90%!** 🎉

## Timeline

**Right now:**
- Wait 10-15 minutes for DNS propagation
- Check Netlify domain verification

**Next (15-30 minutes):**
- Add domain to Cloudflare
- Update nameservers in Porkbun
- Wait for nameserver propagation

**After nameservers propagate:**
- Configure DNS in Cloudflare
- Set up SSL/TLS
- Set up Page Rules
- Test everything

**Total time:** 30-60 minutes for full setup

## Quick Reference

**DNS Checker:** https://dnschecker.org
**Cloudflare Dashboard:** https://dash.cloudflare.com
**Netlify Domain Settings:** https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
**Porkbun:** https://porkbun.com
