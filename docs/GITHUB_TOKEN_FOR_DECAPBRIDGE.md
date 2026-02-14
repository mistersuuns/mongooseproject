# Create GitHub Token for DecapBridge

## Step 1: Go to GitHub Settings

1. Go to: https://github.com/settings/tokens
2. Or: GitHub → Your profile picture (top right) → **Settings** → **Developer settings** (left sidebar) → **Personal access tokens** → **Tokens (classic)**

## Step 2: Generate New Token

1. Click **Generate new token** → **Generate new token (classic)**

## Step 3: Configure Token

**Note:**
- **Expiration:** Choose "No expiration" or set a long expiration (90 days, 1 year)
- **Scopes:** Check these boxes:
  - ✅ **repo** (Full control of private repositories)
    - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

**That's all you need** - just the `repo` scope.

## Step 4: Generate and Copy

1. Scroll down and click **Generate token**
2. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!
3. It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 5: Use in DecapBridge

1. Go back to DecapBridge
2. When it asks for GitHub token, paste the token you just copied
3. Authorize access

## Security Note

- Keep this token secret
- Don't share it publicly
- If you lose it, you can revoke it and create a new one
- You can revoke tokens at: https://github.com/settings/tokens

## Quick Link

Direct link to create token: https://github.com/settings/tokens/new

**Select:**
- Note: "DecapBridge"
- Expiration: "No expiration" (or your preference)
- Scopes: ✅ **repo** (check the box)

Then click "Generate token" at the bottom.
