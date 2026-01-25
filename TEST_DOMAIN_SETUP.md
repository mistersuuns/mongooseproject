# Test Domain Setup for Cloudflare

## Choosing a Test Domain

**Good naming options:**
- `test-[yourname].com` (e.g., `test-robertturner.com`)
- `dev-[yourname].com` (e.g., `dev-robertturner.com`)
- `staging-[yourname].com`
- `[yourname]-test.net` (cheaper TLD)
- `[yourname]-dev.org`

**Considerations:**
- `.com` is most common (~$12-15/year)
- `.net`, `.org` are cheaper (~$10-12/year)
- `.dev` is good for development (~$20/year)
- Choose something you can reuse for multiple projects

## Step 1: Buy Domain

**Recommended registrars:**
1. **Namecheap** - Good prices, easy interface
2. **Google Domains** - Simple, reliable
3. **Cloudflare Registrar** - Built into Cloudflare (if you want)
4. **Porkbun** - Cheap, good service

**Steps:**
1. Go to registrar website
2. Search for your desired domain
3. Add to cart
4. Complete purchase
5. You'll get access to DNS management

**Cost:** ~$10-15/year

## Step 2: Add Domain to Netlify

**In Netlify:**

1. Go to: https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
2. Click **"Add custom domain"**
3. Enter your test domain (e.g., `test-robertturner.com`)
4. Click **"Verify"**
5. Netlify will show DNS records you need

**Netlify will provide:**
- CNAME record to add at registrar
- Or instructions for nameserver setup

## Step 3: Add Domain to Cloudflare

**In Cloudflare:**

1. Go to: https://dash.cloudflare.com
2. **Remove the Netlify subdomain site** (if still there)
3. Click **"Add a Site"**
4. Enter your test domain (e.g., `test-robertturner.com`)
5. Click **"Continue"**
6. Choose **"Free"** plan
7. Click **"Continue"**

## Step 4: Update Nameservers

**Cloudflare will show nameservers like:**
- `ns1.cloudflare.com`
- `ns2.cloudflare.com`

**At your domain registrar:**

1. Log in to registrar
2. Go to DNS/Nameserver settings
3. Find "Nameservers" or "DNS" section
4. Change from default to Cloudflare's nameservers:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
5. Save changes
6. Wait 5-30 minutes for propagation

**This gives Cloudflare control of DNS.**

## Step 5: Configure DNS in Cloudflare

**After nameservers propagate (check with: https://dnschecker.org):**

1. **In Cloudflare DNS page, delete any auto-detected records**

2. **Add CNAME record:**
   - Type: `CNAME`
   - Name: `@` (or blank for root)
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️) ← **IMPORTANT!**
   - TTL: Auto
   - Click **"Save"**

3. **Add www CNAME (optional):**
   - Type: `CNAME`
   - Name: `www`
   - Target: `earnest-quokka-5963b7.netlify.app`
   - Proxy status: **Proxied** (orange cloud ☁️)
   - TTL: Auto
   - Click **"Save"**

**Critical:** Make sure proxy is **ON** (orange cloud) for bandwidth reduction!

## Step 6: Configure SSL/TLS

**In Cloudflare:**

1. Go to: **SSL/TLS** → **Overview**
2. Set to: **"Full"** or **"Full (strict)"**
3. This ensures proper SSL between Cloudflare and Netlify

**Wait 2-5 minutes for SSL certificate provisioning.**

## Step 7: Set Up Page Rules (For CMS)

**These bypass Cloudflare for CMS authentication:**

1. Go to: **Rules** → **Page Rules**
2. Click **"Create Page Rule"**

**Rule 1: Bypass /admin/**
- URL: `*test-robertturner.com/admin/*`
  - (Use your actual test domain)
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Rule 2: Bypass /.netlify/**
- Click **"Create Page Rule"** again
- URL: `*test-robertturner.com/.netlify/*`
  - (Use your actual test domain)
- Setting: Click **"Bypass"** (gray cloud - proxy OFF)
- Click **"Save and Deploy"**

**Why?** CMS authentication needs direct connection to Netlify.

## Step 8: Test Everything

**Wait 10-30 minutes for DNS/SSL propagation, then:**

### Test Site:
1. Visit: `https://test-robertturner.com` (your domain)
2. Check pages load correctly
3. Check images load
4. Site should be **faster** (Cloudflare caching!)

### Test CMS:
1. Go to: `https://test-robertturner.com/admin/`
2. Click **"Login with GitHub"**
3. Try editing content
4. Save changes
5. Should work perfectly!

### Check Bandwidth:
1. Go to Netlify: https://app.netlify.com/account/billing
2. Check **"Usage"** tab
3. Monitor over next few days
4. **Bandwidth should drop by 70-90%!** 🎉

## Reusing Domain for Multiple Projects

**When you want to test another project:**

1. **In Cloudflare:**
   - Change CNAME target to new Netlify site
   - Or add subdomain (e.g., `project2.test-robertturner.com`)

2. **In Netlify:**
   - Add domain to new site
   - Or add subdomain

**Example subdomains:**
- `project1.test-robertturner.com`
- `project2.test-robertturner.com`
- `project3.test-robertturner.com`

**Each can point to different Netlify sites!**

## Troubleshooting

### Domain Not Loading
- Wait 10-30 minutes for DNS propagation
- Check nameservers are updated at registrar
- Verify DNS records in Cloudflare
- Use https://dnschecker.org to check propagation

### SSL Certificate Errors
- Set SSL mode to "Full" or "Full (strict)"
- Wait 5-10 minutes for certificate provisioning
- Check Netlify domain settings

### CMS Login Fails
- Verify Page Rules are set (bypass `/admin/` and `/.netlify/`)
- Check SSL mode is "Full"
- Wait 10 minutes for changes to propagate
- Clear browser cache

## Success Indicators

✅ Site loads at test domain
✅ Site is faster (Cloudflare caching)
✅ CMS login works
✅ Can edit content in CMS
✅ Netlify bandwidth usage drops significantly
✅ No SSL errors

## Quick Reference

**Registrars:**
- Namecheap: https://www.namecheap.com
- Google Domains: https://domains.google
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar

**DNS Checker:** https://dnschecker.org

**Cloudflare Dashboard:** https://dash.cloudflare.com
**Netlify Domain Settings:** https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
