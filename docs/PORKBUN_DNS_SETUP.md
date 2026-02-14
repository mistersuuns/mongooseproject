# Porkbun DNS Setup for mistersuuns.space

## Domain Info
- **Domain:** `mistersuuns.space`
- **Netlify Site:** `earnest-quokka-5963b7.netlify.app`

## Step 1: Add Domain to Netlify FIRST

**Before configuring DNS, add domain to Netlify:**

1. Go to: https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
2. Click **"Add custom domain"**
3. Enter: `mistersuuns.space`
4. Click **"Verify"**
5. Netlify will show you DNS records to add

**Netlify will provide:**
- A record or CNAME record to add
- Usually: CNAME pointing to `earnest-quokka-5963b7.netlify.app`

**Keep this page open** - you'll need the DNS records.

## Step 2: Log into Porkbun

1. Go to: https://porkbun.com
2. Click **"Account"** → **"Log In"**
3. Enter your credentials
4. You'll see your domains dashboard

## Step 3: Access DNS Settings

1. In Porkbun dashboard, find **"mistersuuns.space"**
2. Click on the domain name
3. Look for **"DNS"** or **"DNS Records"** tab
4. Click on it

**You should see:**
- Current DNS records (if any)
- Options to add/edit/delete records

## Step 4: Configure DNS Records

**Option A: Using CNAME (Recommended for Netlify)**

1. **Delete any existing A records** for root domain (if any)

2. **Add CNAME record:**
   - Click **"Add Record"** or **"+"**
   - **Type:** Select `CNAME`
   - **Hostname:** Leave blank or enter `@` (for root domain)
   - **Answer:** `earnest-quokka-5963b7.netlify.app`
   - **TTL:** `600` (or default)
   - Click **"Save"** or **"Add"**

3. **Add www CNAME (optional):**
   - Click **"Add Record"** again
   - **Type:** `CNAME`
   - **Hostname:** `www`
   - **Answer:** `earnest-quokka-5963b7.netlify.app`
   - **TTL:** `600`
   - Click **"Save"**

**Option B: Using A Records (If CNAME doesn't work)**

**If Porkbun doesn't support CNAME for root domain:**

1. **Get Netlify's IP addresses:**
   - Netlify uses multiple IPs
   - Common ones: `75.2.60.5` (but check Netlify's docs)
   - Or use Netlify's DNS records from domain settings

2. **Add A records:**
   - **Type:** `A`
   - **Hostname:** `@` or blank
   - **Answer:** `75.2.60.5` (or Netlify's IP)
   - **TTL:** `600`
   - Click **"Save"**

**Note:** CNAME is preferred for Netlify.

## Step 5: Verify DNS

**Wait 5-15 minutes for DNS propagation, then:**

1. **Check DNS propagation:**
   - Go to: https://dnschecker.org
   - Enter: `mistersuuns.space`
   - Check if CNAME record is propagating

2. **Test domain:**
   - Visit: `https://mistersuuns.space`
   - Should load your Netlify site

## Step 6: Set Up Cloudflare (After DNS Works)

**Once domain is working with Netlify:**

1. **In Cloudflare:**
   - Remove Netlify subdomain (if still there)
   - Add `mistersuuns.space` to Cloudflare
   - Choose Free plan

2. **Update nameservers in Porkbun:**
   - Cloudflare will show nameservers
   - In Porkbun, go to DNS settings
   - Change nameservers to Cloudflare's
   - Wait for propagation

3. **Configure DNS in Cloudflare:**
   - Add CNAME: `@` → `earnest-quokka-5963b7.netlify.app`
   - Proxy: ON (orange cloud)
   - SSL/TLS: Full

4. **Set up Page Rules:**
   - Bypass `/admin/*`
   - Bypass `/.netlify/*`

## Porkbun Interface Guide

**Where to find DNS settings:**
- Dashboard → Click domain → **"DNS"** tab
- Or: **"DNS Records"** section

**Adding records:**
- Look for **"Add Record"** or **"+"** button
- Select record type from dropdown
- Fill in fields
- Click **"Save"** or **"Add"**

**Common fields:**
- **Type:** CNAME, A, AAAA, etc.
- **Hostname:** `@` for root, `www` for www subdomain
- **Answer/Value:** The target (Netlify URL or IP)
- **TTL:** Time to live (600 is fine)

## Troubleshooting

### Domain Not Loading
- Wait 10-30 minutes for DNS propagation
- Check DNS records are correct in Porkbun
- Verify domain is added in Netlify
- Use https://dnschecker.org to check propagation

### CNAME Not Working
- Some registrars don't support CNAME for root domain
- Use A records instead (get IPs from Netlify)
- Or use www subdomain with CNAME

### SSL Certificate Issues
- Wait 5-10 minutes after DNS propagates
- Netlify will automatically provision SSL
- Check Netlify domain settings

## Quick Reference

**Porkbun:** https://porkbun.com
**Netlify Domain Settings:** https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
**DNS Checker:** https://dnschecker.org

**Netlify Site:** `earnest-quokka-5963b7.netlify.app`
**Your Domain:** `mistersuuns.space`
