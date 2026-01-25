# Fix CMS Access Error

## The Error
**`ERR_QUIC_PROTOCOL_ERROR`** when accessing `/admin/`

## Why This Happens
- `/admin/` path needs direct connection to Netlify (bypass Cloudflare)
- QUIC/HTTP/3 protocol issue between Cloudflare and Netlify
- Page Rules not set up yet (to bypass Cloudflare)

## Solution: Set Up Page Rules

### Step 1: Create Page Rule for /admin/

1. **In Cloudflare:**
   - Go to: **Rules** → **Page Rules**
   - Click **"Create Page Rule"**

2. **Configure Rule 1:**
   - **URL:** `*mistersuuns.space/admin/*`
   - **Setting:** Click **"Bypass"** (gray cloud - proxy OFF)
   - Click **"Save and Deploy"**

### Step 2: Create Page Rule for /.netlify/

1. **Click "Create Page Rule"** again

2. **Configure Rule 2:**
   - **URL:** `*mistersuuns.space/.netlify/*`
   - **Setting:** Click **"Bypass"** (gray cloud - proxy OFF)
   - Click **"Save and Deploy"**

**Why?** CMS authentication needs direct connection to Netlify, not through Cloudflare.

## Alternative: Disable HTTP/3 (QUIC)

**If Page Rules don't work immediately:**

1. **In Cloudflare:**
   - Go to: **Network** → **HTTP/3 (with QUIC)**
   - Toggle **OFF** (disable HTTP/3)
   - This uses HTTP/2 instead

2. **Test again:**
   - Try `/admin/` again
   - Should work with HTTP/2

## After Setting Up Page Rules

**Wait 2-5 minutes for rules to propagate, then:**

1. **Test CMS:**
   - Go to: `https://mistersuuns.space/admin/`
   - Should load (bypassing Cloudflare)
   - Login should work

2. **Verify:**
   - Page Rules show as active
   - `/admin/` loads directly from Netlify
   - CMS authentication works

## Troubleshooting

### Page Rules Not Working
- Wait 5-10 minutes for propagation
- Verify rules are saved and active
- Check URL pattern is correct (`*mistersuuns.space/admin/*`)

### Still Getting Errors
- Try disabling HTTP/3 (Network → HTTP/3)
- Clear browser cache
- Try incognito mode
- Check Netlify site is working directly

### CMS Still Not Loading
- Verify Netlify site is active
- Check `/admin/` works on Netlify subdomain
- Verify Page Rules are bypassing (gray cloud)

## Quick Fix Steps

**Right now:**
1. Go to Cloudflare → Rules → Page Rules
2. Create rule: `*mistersuuns.space/admin/*` → Bypass
3. Create rule: `*mistersuuns.space/.netlify/*` → Bypass
4. Wait 5 minutes
5. Test `/admin/` again

**If still not working:**
- Disable HTTP/3 in Network settings
- Test again
