# DecapBridge Setup - Step by Step

## Why DecapBridge?
- ✅ Replaces deprecated Netlify Identity
- ✅ Email invitations (no GitHub account needed)
- ✅ Better user management
- ✅ Free service
- ✅ Simple setup (30-60 minutes)

## Step 1: Sign Up for DecapBridge

1. Go to: https://decapbridge.com/
2. Click **Sign Up** or **Get Started**
3. Sign up with GitHub (to connect your repo)

## Step 2: Add Your Site

1. In DecapBridge dashboard, click **Create New Site** or **Add Site**
2. Connect your GitHub repository: `mistersuuns/mongooseproject`
3. Authorize DecapBridge to access your repo
4. Select the repository

## Step 3: Get Your DecapBridge Configuration

After adding your site, DecapBridge will provide:
- A backend URL/endpoint
- Configuration to add to your `config.yml`

**Copy the backend configuration** - it will look something like:
```yaml
backend:
  name: decapbridge
  site_id: "your-site-id"
  base_url: "https://api.decapbridge.com"
```

## Step 4: Update config.yml

I'll update your `config.yml` with the DecapBridge backend configuration.

## Step 5: Remove Netlify Identity

1. Remove Identity widget from `admin/index.html`
2. Remove Identity redirect from `index.html`
3. (Optional) Disable Netlify Identity in Netlify dashboard

## Step 6: Invite Users

1. In DecapBridge dashboard, go to your site
2. Click **Invite Users**
3. Enter email addresses
4. Users receive invitation emails
5. They click link → set password → can edit CMS

## Step 7: Test

1. Commit and push the updated `config.yml`
2. Go to `https://mistersuuns.space/admin/`
3. Should see DecapBridge login instead of Netlify Identity
4. Test invitation flow

## What Gets Removed

- ❌ Netlify Identity widget script
- ❌ Netlify Identity redirect code
- ❌ `git-gateway` backend (replaced with `decapbridge`)

## What Stays the Same

- ✅ All your collections (publications, news, people, images)
- ✅ All your content
- ✅ All your field configurations
- ✅ Your site structure

## After Setup

Once DecapBridge is configured:
- Users get proper invitation emails
- Password setup works correctly
- No more spam issues
- Better user management interface
