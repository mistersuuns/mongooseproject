# Porkbun DNS Records for mistersuuns.space

## Current Status
- ✅ Domain added to Netlify
- ⏳ DNS verification pending
- ⏳ SSL certificate pending (needs DNS first)

## What to Add in Porkbun

### Option 1: CNAME for Root Domain (If Supported)

**If Porkbun supports CNAME for root domain (@):**

1. **CNAME Record:**
   - **Type:** `CNAME`
   - **Hostname:** `@` or leave blank
   - **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
   - **TTL:** `600` or default

2. **CNAME for www:**
   - **Type:** `CNAME`
   - **Hostname:** `www`
   - **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
   - **TTL:** `600` or default

### Option 2: A Records (If CNAME Not Supported for Root)

**If Porkbun doesn't support CNAME for root domain:**

**Get Netlify's IP addresses from Netlify:**

1. In Netlify domain settings, look for DNS records
2. Netlify typically uses: `75.2.60.5` (but check what Netlify shows)
3. Or use Netlify's load balancer IPs

**Add A records:**
- **Type:** `A`
- **Hostname:** `@` or leave blank
- **Answer/Value:** `75.2.60.5` (or Netlify's IP)
- **TTL:** `600`

**Note:** Netlify prefers CNAME, but A records work too.

## Step-by-Step in Porkbun

### 1. Access DNS Settings
1. Log into Porkbun: https://porkbun.com
2. Find **"mistersuuns.space"** in your domains
3. Click on the domain
4. Click **"DNS"** or **"DNS Records"** tab

### 2. Delete Existing Records (If Any)
- Delete any existing A, AAAA, or CNAME records for root domain
- Keep any other records you need (MX, TXT, etc.)

### 3. Add CNAME Record
1. Click **"Add Record"** or **"+"** button
2. **Type:** Select `CNAME` from dropdown
3. **Hostname:** Leave blank or enter `@` (for root domain)
4. **Answer/Value:** Enter `earnest-quokka-5963b7.netlify.app`
5. **TTL:** `600` (or use default)
6. Click **"Save"** or **"Add"**

### 4. Add www CNAME (Optional)
1. Click **"Add Record"** again
2. **Type:** `CNAME`
3. **Hostname:** `www`
4. **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
5. **TTL:** `600`
6. Click **"Save"**

### 5. Verify Records
**Your DNS records should look like:**
```
Type    Hostname    Answer/Value                              TTL
CNAME   @           earnest-quokka-5963b7.netlify.app        600
CNAME   www         earnest-quokka-5963b7.netlify.app        600
```

## After Adding DNS Records

### 1. Wait for DNS Propagation
- **Time:** 5-30 minutes (usually 10-15 minutes)
- DNS changes need to propagate globally

### 2. Check DNS Propagation
- Go to: https://dnschecker.org
- Enter: `mistersuuns.space`
- Select: `CNAME` record type
- Check if it shows `earnest-quokka-5963b7.netlify.app`
- Wait until it shows globally (green checkmarks)

### 3. Netlify Will Auto-Verify
- Once DNS propagates, Netlify will detect it
- Domain status will change from "Pending" to "Verified"
- SSL certificate will auto-provision (takes 5-10 minutes)

### 4. Test Domain
- Visit: `https://mistersuuns.space`
- Should load your Netlify site
- SSL certificate should be active

## Troubleshooting

### "CNAME not allowed for root domain"
**If Porkbun doesn't allow CNAME for @:**

1. **Use A records instead:**
   - Get Netlify's IP from Netlify domain settings
   - Add A record pointing to that IP
   - Netlify will show you the IP to use

2. **Or use www subdomain:**
   - Set up `www.mistersuuns.space` with CNAME
   - Redirect root to www (if needed)

### DNS Not Propagating
- Wait longer (can take up to 48 hours, but usually 10-30 minutes)
- Check with https://dnschecker.org
- Verify records are correct in Porkbun
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) or restart router

### SSL Certificate Not Provisioning
- Wait 10-15 minutes after DNS propagates
- Check domain is verified in Netlify
- Verify DNS records are correct
- Netlify will auto-provision SSL once DNS is correct

## Quick Reference

**Porkbun DNS Settings:**
- Log in → Click domain → DNS tab

**DNS Records to Add:**
- CNAME: `@` → `earnest-quokka-5963b7.netlify.app`
- CNAME: `www` → `earnest-quokka-5963b7.netlify.app`

**Check Propagation:**
- https://dnschecker.org

**Netlify Domain Settings:**
- https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
