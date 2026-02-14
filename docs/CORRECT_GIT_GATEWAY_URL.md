# Correct Git Gateway URL

## The Right URL

**Git Gateway Settings:**
https://app.netlify.com/projects/earnest-quokka-5963b7/configuration/identity#services

(Note: Uses `/projects/` not `/sites/`)

## Steps to Update Token

1. **Go to:** https://app.netlify.com/projects/earnest-quokka-5963b7/configuration/identity#services
2. **Find "Git Gateway"** in the Services section
3. **Click "Edit settings"**
4. **Paste your permanent token** in "GitHub API access token" field
5. **Click "Save"**

## Token Requirements

- **Created at:** https://github.com/settings/tokens/new
- **Name:** Netlify Git Gateway - Permanent
- **Expiration:** NO EXPIRATION (critical!)
- **Scope:** `repo` (full control)

## After Updating

1. Wait 1-2 minutes
2. Test: https://earnest-quokka-5963b7.netlify.app/admin/
3. Should work permanently now!
