# Create Permanent GitHub Token - Step by Step

## Step 1: Create Token in GitHub

1. **Go to:** https://github.com/settings/tokens/new
2. **Application name:** `Netlify Git Gateway - Permanent`
3. **Expiration:** Select **"No expiration"** ⚠️ **CRITICAL - Don't set a date!**
4. **Scopes:** Check **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN IMMEDIATELY** - You won't see it again!

## Step 2: Store Token Securely

**Save it in:**
- Password manager (1Password, LastPass, etc.)
- Or a secure note/file (NOT in Git!)

**Label it:** "Netlify Git Gateway Token - mongooseproject"

## Step 3: Update Netlify

1. **Go to:** https://app.netlify.com/sites/earnest-quokka-5963b7/identity/services/git-gateway
2. Click **"Edit settings"**
3. In **"GitHub API access token"** field:
   - Delete the old token (if visible)
   - Paste your new permanent token
4. Click **"Save"**

## Step 4: Verify

1. **Wait 1-2 minutes** for changes to propagate
2. **Go to:** https://earnest-quokka-5963b7.netlify.app/admin/
3. **Try logging in** with GitHub
4. Should work and **keep working** (no more daily errors!)

## Important Notes

- ✅ Token has **NO expiration** - will work forever
- ✅ Token has `repo` scope - can access your repository
- ✅ Store token securely - don't lose it!
- ✅ Don't revoke the token in GitHub settings

## If You Lose the Token

If you lose it, you'll need to:
1. Revoke the old token in GitHub
2. Create a new one
3. Update Netlify again

So **save it securely** the first time!
