# Switch to Direct GitHub Backend (Bypass Git Gateway)

## Why Switch?

- **More reliable** - Direct GitHub connection, no Git Gateway dependency
- **Faster** - No intermediate service
- **Fewer errors** - Less likely to break

## How to Switch

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Mongoose Project CMS`
   - **Homepage URL:** `https://earnest-quokka-5963b7.netlify.app`
   - **Authorization callback URL:** `https://earnest-quokka-5963b7.netlify.app/admin/`
4. Click **"Register application"**
5. **Copy the Client ID**
6. Click **"Generate a new client secret"**
7. **Copy the Client Secret**

### Step 2: Update CMS Config

Edit `site/admin/config.yml`:

```yaml
backend:
  name: github
  repo: mistersuuns/mongooseproject
  branch: main

# Add OAuth config (if using GitHub Pages, use proxy_url)
# For Netlify, you can use direct GitHub OAuth
```

### Step 3: Configure Netlify Environment Variables

1. Go to: Netlify Site Settings → Environment Variables
2. Add:
   - `GITHUB_CLIENT_ID` = (your Client ID)
   - `GITHUB_CLIENT_SECRET` = (your Client Secret)

### Step 4: Update Admin HTML

The `site/admin/index.html` may need updates for GitHub OAuth.

## Alternative: Use OAuth Proxy

If direct OAuth is complex, you can use a public OAuth proxy (less secure but easier):

```yaml
backend:
  name: github
  repo: mistersuuns/mongooseproject
  branch: main
  proxy_url: https://netlify-cms-oauth-provider-node.vercel.app
```

**Note:** Public proxies are less secure. Better to set up your own OAuth app.

## Recommendation

**Try permanent token first** (easier, solves most issues)
**If that fails:** Switch to direct GitHub backend (more reliable long-term)
