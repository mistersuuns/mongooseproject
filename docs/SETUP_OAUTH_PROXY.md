# GitHub Pages OAuth Proxy Setup

## Quick Setup (5 minutes)

### Option 1: Use Existing Proxy Service

**Use a pre-deployed proxy:**
- https://netlify-cms-oauth-provider-node.vercel.app/

**Steps:**
1. Update `site/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: mistersuuns/mongooseproject
     branch: main
     proxy_url: https://netlify-cms-oauth-provider-node.vercel.app
   ```

2. Commit and push:
   ```bash
   git add site/admin/config.yml
   git commit -m "Add OAuth proxy"
   git push
   ```

3. Done! CMS should work at `/admin/`

### Option 2: Deploy Your Own Proxy (More Control)

**Deploy to Vercel (free):**

1. Go to: https://github.com/netlify/netlify-cms-oauth-provider-node
2. Click "Deploy to Vercel"
3. Follow the setup
4. Get your proxy URL
5. Update `config.yml` with your proxy URL

**Or deploy to any Node.js host:**
- Heroku (free tier)
- Railway
- Render
- Your own server

## Update Config

After setting up proxy, update `site/admin/config.yml`:

```yaml
backend:
  name: github
  repo: mistersuuns/mongooseproject
  branch: main
  proxy_url: https://your-proxy-url.vercel.app  # Add this line
```

## Test

1. Visit: `https://mistersuuns.github.io/mongooseproject/admin/`
2. Click "Login with GitHub"
3. Should redirect through proxy and authenticate

## Troubleshooting

**Still getting errors?**
- Check proxy URL is correct
- Verify proxy is deployed and running
- Check browser console for errors
- Try incognito mode
