# How to Set Records to DNS-Only (Gray Cloud)

## What Are the Cloud Icons?

In Cloudflare DNS page, each record has a **cloud icon** next to it:

- **🟠 Orange Cloud** = **Proxied** (traffic goes through Cloudflare)
- **⚪ Gray Cloud** = **DNS-only** (traffic goes directly to origin, Cloudflare just handles DNS)

## How to Change to Gray Cloud (DNS-Only)

### Step-by-Step:

1. **Go to Cloudflare Dashboard**
   - You should already be there at the DNS page

2. **Find the DNS Records**
   - You should see a table with your A and AAAA records
   - Each row has: Type, Name, Content, **Proxy status**, TTL, Actions

3. **Look for the Cloud Icon Column**
   - It's labeled "Proxy status" or shows a cloud icon
   - Currently showing **orange clouds** 🟠 (Proxied)

4. **Click the Orange Cloud Icon**
   - Click directly on the **orange cloud icon** for each record
   - It will turn **gray** ⚪ (DNS-only)
   - The tooltip/text will change from "Proxied" to "DNS-only"

5. **Do This for ALL Records**
   - Click each orange cloud icon
   - Change all A records to gray
   - Change all AAAA records to gray

## Visual Guide

**Before (Proxied - Orange):**
```
Type    Name    Content              Proxy status    Actions
A       @       18.208.88.157        🟠 Proxied      [Edit] [Delete]
A       @       98.84.224.111        🟠 Proxied      [Edit] [Delete]
```

**After (DNS-only - Gray):**
```
Type    Name    Content              Proxy status    Actions
A       @       18.208.88.157        ⚪ DNS-only     [Edit] [Delete]
A       @       98.84.224.111        ⚪ DNS-only     [Edit] [Delete]
```

## Alternative Method (If Clicking Doesn't Work)

1. **Click "Edit" on a record**
2. Look for **"Proxy status"** dropdown or toggle
3. Change from **"Proxied"** to **"DNS-only"**
4. Click **"Save"**
5. Repeat for all records

## What This Does

**Gray Cloud (DNS-only):**
- ✅ Cloudflare handles DNS resolution
- ✅ No SSL certificate errors
- ✅ Site works normally
- ❌ No bandwidth reduction (no proxying)
- ❌ No caching

**Orange Cloud (Proxied):**
- ✅ Traffic goes through Cloudflare
- ✅ Bandwidth reduction
- ✅ Caching
- ❌ Requires SSL certs (doesn't work with Netlify subdomains)

## After Changing to Gray

1. **Wait 2-5 minutes** for changes to propagate
2. **Test your site:** `https://earnest-quokka-5963b7.netlify.app`
3. **Should work** without SSL errors
4. **No bandwidth reduction** (but that's expected with subdomain)

## Quick Check

**You'll know it worked when:**
- All cloud icons are **gray** ⚪
- No more SSL certificate errors
- Site loads normally
- "Proxy status" column shows "DNS-only"
