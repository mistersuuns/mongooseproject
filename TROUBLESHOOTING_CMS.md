# Troubleshooting CMS Authentication

## Error: `api.netlify.com/auth?provider=github&site_id=...` Not Found

This error means Decap CMS is still trying to use Netlify Identity instead of the GitHub OAuth proxy.

## Fix Steps

### 1. Clear Browser Cache

**Chrome/Edge:**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Time range: "All time"
- Click "Clear data"

**Or use Incognito/Private mode:**
- Open `/admin/` in an incognito window
- This bypasses cache

### 2. Hard Refresh the Page

- **Windows/Linux:** `Ctrl+F5` or `Ctrl+Shift+R`
- **Mac:** `Cmd+Shift+R`

### 3. Verify Config is Loaded

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit `/admin/`
4. Check if `config.yml` loads correctly
5. Verify it has `proxy_url` in the backend section

### 4. Check Proxy is Working

Test the proxy directly:
```bash
curl https://netlify-cms-oauth-provider-node.vercel.app
```

Should return a response (not 404).

### 5. Alternative: Use Different Proxy

If the public proxy doesn't work, deploy your own:

1. Go to: https://github.com/netlify/netlify-cms-oauth-provider-node
2. Click "Deploy to Vercel"
3. Get your proxy URL
4. Update `config.yml` with your URL

## Still Not Working?

**Option: Switch to Netlify Hosting**
- Deploy to Netlify (free)
- OAuth works automatically
- No proxy needed
- See `GITHUB_OAUTH_SETUP.md`

**Option: Use Implicit Grant (Less Secure)**
- For development only
- Not recommended for production

## Quick Test

1. Open incognito window
2. Visit: `https://mistersuuns.github.io/mongooseproject/admin/`
3. Should see "Login with GitHub" button
4. Click it - should redirect through proxy

If it still tries to use `api.netlify.com`, the config isn't loading properly.
