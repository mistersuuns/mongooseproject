# Netlify Identity Deprecation Notice

## What This Means

Netlify Identity is **deprecated** but **still functional**. You're seeing this notice because Git Gateway uses Netlify Identity for authentication.

## Current Status

✅ **Your setup still works** - Git Gateway continues to function  
✅ **No immediate action required** - Existing implementations keep working  
⚠️ **No new features** - Netlify won't add new Identity features  
⚠️ **Limited support** - Netlify won't help with Identity issues

## What You're Using It For

You're using Netlify Identity **only for Git Gateway**, which enables:
- Decap CMS authentication
- GitHub API access for CMS edits
- No GitHub account needed for CMS users

## Your Options

### Option 1: Do Nothing (Recommended for Now)

**Pros:**
- Everything continues working
- No migration needed
- No disruption

**Cons:**
- No new features
- May need to migrate eventually

**Action:** None. Just ignore the notice.

### Option 2: Migrate to Auth0 Extension

**Pros:**
- Future-proof
- More features
- Better support

**Cons:**
- Migration required
- May need to reconfigure Git Gateway
- More complex setup

**When to consider:** If you need new authentication features or want to future-proof.

### Option 3: Use GitHub OAuth Directly

**Pros:**
- No dependency on deprecated service
- Direct GitHub integration

**Cons:**
- Requires GitHub account for all CMS users
- More complex setup
- Need to configure OAuth app

**When to consider:** If you want to remove Netlify Identity dependency entirely.

## Recommendation

**For now: Do nothing.**

Your current setup works fine. The deprecation notice is just informational. You can:
- Continue using Git Gateway as-is
- Ignore the notice
- Revisit migration when/if Netlify announces a shutdown date

## If You Want to Migrate Later

1. **Contact Netlify Support** for Identity data export
2. **Install Auth0 extension** in Netlify
3. **Reconfigure Git Gateway** to use Auth0
4. **Test CMS login** to ensure it works

**But this is not urgent** - your current setup will continue working.

## Summary

- ✅ Your CMS works fine
- ⚠️ Notice is informational only
- 🕐 No immediate action needed
- 📅 Revisit migration later if needed
