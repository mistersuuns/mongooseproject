# Cloudflare DNS Cleanup and Configuration

## Current Situation

**Cloudflare auto-detected DNS records from Porkbun:**
- A records (pointing to IPs)
- AAAA records (IPv6)
- CNAME for www (correct!)
- NS records (showing current nameservers)

**We need to:**
1. Delete unnecessary records
2. Add correct CNAME for root domain
3. Ensure proxy is ON (orange cloud)
4. Update nameservers in Porkbun

## Step 1: Delete Unnecessary Records

### Delete These Records:

1. **All A records:**
   - `mistersuuns.space` → `13.52.188.95` (Delete)
   - `mistersuuns.space` → `52.52.192.191` (Delete)

2. **All AAAA records:**
   - `mistersuuns.space` → `2600:1f1c:446:4900::259` (Delete)
   - `mistersuuns.space` → `2600:1f1c:446:4900::258` (Delete)

3. **All NS records:**
   - All 4 NS records (Delete - these just show current nameservers)

**How to delete:**
- Click "Delete" on each record
- Or select multiple and delete

### Keep This Record:

**CNAME for www:**
- `www` → `earnest-quokka-5963b7.netlify.app`
- **Make sure proxy is ON** (orange cloud ☁️)
- If it's gray, click it to turn orange

## Step 2: Add CNAME for Root Domain

**Add this record:**

1. Click **"Add record"**
2. **Type:** `CNAME`
3. **Name:** `@` (or leave blank for root)
4. **Target:** `earnest-quokka-5963b7.netlify.app`
5. **Proxy status:** **Proxied** (orange cloud ☁️) ← **IMPORTANT!**
6. **TTL:** Auto
7. Click **"Save"**

## Step 3: Final DNS Records Should Look Like:

```
Type    Name    Target                                    Proxy    TTL
CNAME   @       earnest-quokka-5963b7.netlify.app         🟠 ON    Auto
CNAME   www     earnest-quokka-5963b7.netlify.app         🟠 ON    Auto
```

**Both should have orange cloud (proxied)!**

## Step 4: About Netlify Subdomain Site

**The `earnest-quokka-5963b7.netlify.app` site in Cloudflare:**
- Shows "Invalid nameservers" (expected - it's a Netlify subdomain)
- **You can delete it** (not needed)
- Or leave it (doesn't affect anything)

**To delete:**
- Click on the site
- Go to settings
- Scroll down to "Delete site"
- Or just ignore it

## Step 5: Update Nameservers in Porkbun

**After DNS is configured in Cloudflare:**

1. **In Cloudflare:**
   - Look for nameservers (usually shown at top of DNS page)
   - Should be like: `ns1.cloudflare.com`, `ns2.cloudflare.com`
   - Cloudflare will show you the exact ones

2. **In Porkbun:**
   - Go to domain settings
   - Find "Nameservers" section
   - Change from Porkbun's to Cloudflare's nameservers
   - Save

3. **Wait 5-30 minutes** for nameserver propagation

## Important Notes

**Proxy Status:**
- **Orange cloud** = Proxied (traffic goes through Cloudflare) ✅
- **Gray cloud** = DNS-only (no bandwidth reduction) ❌

**Make sure both CNAME records have orange cloud!**

**After nameservers update:**
- DNS will be managed by Cloudflare
- Proxying will work
- Bandwidth reduction will start
- Site will be faster

## Quick Checklist

- [ ] Delete all A records
- [ ] Delete all AAAA records  
- [ ] Delete all NS records
- [ ] Verify www CNAME has orange cloud
- [ ] Add CNAME for root domain (@) with orange cloud
- [ ] Get Cloudflare nameservers
- [ ] Update nameservers in Porkbun
- [ ] Wait for propagation
- [ ] Test site

## Next Steps After DNS Cleanup

1. Get Cloudflare nameservers
2. Update nameservers in Porkbun
3. Wait for propagation
4. Configure SSL/TLS in Cloudflare
5. Set up Page Rules for CMS
6. Test everything!
