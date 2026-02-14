# Git Gateway Error - Quick Fix

## Step 1: Check Netlify Git Gateway

1. Go to: https://app.netlify.com/sites/earnest-quokka-5963b7/identity/services/git-gateway
2. Check status:
   - Should show: "Connected to GitHub"
   - Repository: `mistersuuns/mongooseproject`
   - If it shows an error → Go to Step 2

## Step 2: Refresh GitHub Token

1. Click **"Edit settings"** in Git Gateway
2. Click **"Generate access token in GitHub"**
3. Or manually:
   - Go to: https://github.com/settings/tokens/new
   - Name: "Netlify Git Gateway"
   - Scopes: Check `repo` (full control)
   - Generate token
   - Copy token
   - Paste into Netlify's "GitHub API access token" field
4. Click **"Save"**

## Step 3: Disable and Re-enable (If Step 2 doesn't work)

1. Click **"Disable Git Gateway"**
2. Wait 10 seconds
3. Re-enable Git Gateway
4. Reconnect to GitHub
5. Generate new token
6. Save

## Step 4: Test

1. Wait 1-2 minutes
2. Go to: https://earnest-quokka-5963b7.netlify.app/admin/
3. Try logging in with GitHub
4. Should work now

## Common Causes

- **Token expired:** GitHub tokens can expire (especially if you set an expiration)
- **Token revoked:** You may have revoked it in GitHub settings
- **Permissions changed:** Repository permissions may have changed
- **Connection lost:** Netlify lost connection to GitHub

## Prevention

- Set token to "No expiration" when creating it
- Or set a long expiration (1 year)
- Don't revoke the token in GitHub settings
