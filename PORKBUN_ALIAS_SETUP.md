# Porkbun ALIAS Record Setup

## The Problem
- ❌ Can't use CNAME for root domain (RFC violation)
- ❌ Can't use A record with hostname (needs IP address)

## The Solution: ALIAS Record

**Porkbun supports ALIAS records** - these work like CNAME but for root domains!

## DNS Records to Add

### Record 1: ALIAS for Root Domain

1. **Type:** Select `ALIAS` (not CNAME!)
2. **Host:** Leave blank or enter `@` (for root domain)
3. **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
4. **TTL:** `600` (or default)
5. **Priority:** Leave blank (not needed for ALIAS)
6. Click **"Save"** or **"Add"**

**This handles:** `mistersuuns.space`

### Record 2: CNAME for www

1. **Type:** Select `CNAME`
2. **Host:** `www`
3. **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
4. **TTL:** `600` (or default)
5. **Priority:** Leave blank
6. Click **"Save"** or **"Add"**

**This handles:** `www.mistersuuns.space`

## Step-by-Step in Porkbun

### 1. Add ALIAS Record
1. In Porkbun DNS settings
2. Click **"Add Record"** or **"+"**
3. **Type:** Select `ALIAS` from dropdown
4. **Host:** Leave blank (for root domain)
5. **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
6. **TTL:** `600`
7. Click **"Save"**

### 2. Add www CNAME
1. Click **"Add Record"** again
2. **Type:** Select `CNAME`
3. **Host:** `www`
4. **Answer/Value:** `earnest-quokka-5963b7.netlify.app`
5. **TTL:** `600`
6. Click **"Save"**

## Final DNS Records Should Look Like:

```
Type    Host    Answer/Value                              TTL
ALIAS   @       earnest-quokka-5963b7.netlify.app         600
CNAME   www     earnest-quokka-5963b7.netlify.app         600
```

## After Adding Records

### 1. Wait for DNS Propagation
- **Time:** 10-30 minutes (usually 15 minutes)
- ALIAS records propagate like CNAME records

### 2. Check DNS Propagation
- Go to: https://dnschecker.org
- Enter: `mistersuuns.space`
- Should resolve to Netlify's servers
- Wait until it shows globally (green checkmarks)

### 3. Netlify Will Auto-Verify
- Once DNS propagates, Netlify will detect it
- Domain status changes from "Pending DNS verification" to verified
- SSL certificate will auto-provision (5-10 minutes)

### 4. Test Domain
- Visit: `https://mistersuuns.space`
- Should load your Netlify site
- SSL certificate should be active

## What is ALIAS?

**ALIAS records:**
- Work like CNAME but for root domains
- Resolve to the target (Netlify) automatically
- Supported by Porkbun (powered by Cloudflare)
- Perfect for pointing root domain to Netlify

**Why not CNAME?**
- RFC 1912 doesn't allow CNAME for root domain
- Would conflict with other records (MX, NS, etc.)
- ALIAS solves this problem

## Troubleshooting

### ALIAS Record Not Available
- Make sure you're selecting `ALIAS` type (not CNAME)
- If not available, contact Porkbun support
- Alternative: Use A records with Netlify's IP (less ideal)

### DNS Not Propagating
- Wait longer (can take up to 48 hours, but usually 15-30 minutes)
- Check with https://dnschecker.org
- Verify records are correct in Porkbun
- Clear DNS cache if needed

### Netlify Still Shows "Pending"
- Wait 15-30 minutes after DNS propagates
- Check DNS records are correct
- Verify domain is added in Netlify
- Netlify checks DNS periodically

## Quick Reference

**Porkbun DNS Settings:**
- Log in → Click domain → DNS tab

**Records to Add:**
- ALIAS: `@` → `earnest-quokka-5963b7.netlify.app`
- CNAME: `www` → `earnest-quokka-5963b7.netlify.app`

**Check Propagation:**
- https://dnschecker.org

**Netlify Domain Settings:**
- https://app.netlify.com/sites/earnest-quokka-5963b7/configuration/domain
