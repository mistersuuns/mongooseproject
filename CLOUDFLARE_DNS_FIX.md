# Cloudflare DNS Setup for Netlify Subdomain

## Issue
Cloudflare auto-detected A/AAAA records, but for Netlify subdomains, we need CNAME records.

## Solution: Clean Up and Add CNAME

### Step 1: Delete the Auto-Detected Records
1. In Cloudflare DNS page, **delete all the A and AAAA records** shown
2. Click "Delete" on each one
3. This cleans up the incorrect records

### Step 2: Add CNAME Record
1. Click **"Add record"**
2. Set:
   - **Type:** `CNAME`
   - **Name:** `@` (or leave blank for root)
   - **Target:** `earnest-quokka-5963b7.netlify.app`
   - **Proxy status:** **Proxied** (orange cloud ☁️)
   - **TTL:** Auto
3. Click **"Save"**

### Step 3: Add www CNAME (Optional)
1. Click **"Add record"** again
2. Set:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `earnest-quokka-5963b7.netlify.app`
   - **Proxy status:** **Proxied** (orange cloud ☁️)
   - **TTL:** Auto
3. Click **"Save"**

## Important Note
For Netlify subdomains, Cloudflare proxying might have limitations. If you have a custom domain (like `mongooseproject.org`), that would work better with Cloudflare.

## Alternative: Use Custom Domain
If you have a custom domain:
1. Add the custom domain to Cloudflare
2. Point it to Netlify via CNAME
3. This works better for Cloudflare proxying

## After DNS Setup
1. Wait 5-10 minutes for DNS propagation
2. Test your site
3. Set up Page Rules for CMS (critical!)
