# Client Access Guide - Decap CMS

## How Clients Access the CMS

### Step 1: Get the CMS URL

**CMS Admin URL:**
```
https://earnest-quokka-5963b7.netlify.app/admin/
```

Or if you have a custom domain:
```
https://yourdomain.com/admin/
```

### Step 2: Log In

**Current Setup (Git Gateway):**
1. Client goes to `/admin/`
2. Clicks **"Log in with GitHub"**
3. Authorizes with their GitHub account
4. Gets access to edit content

**Requirements:**
- Client needs a **GitHub account** (free)
- Client needs to be **invited to the repository** OR
- Repository needs to be **public** (if using public repo)

## Access Control Options

### Option 1: Invite-Only (Recommended)

**How it works:**
1. **You invite clients** to the GitHub repository
2. They get **write access** to the repo
3. They log in with their GitHub account
4. They can edit content in Decap CMS

**Setup:**
1. Go to: https://github.com/mistersuuns/mongooseproject/settings/access
2. Click **"Invite a collaborator"**
3. Enter their GitHub username or email
4. Set permission to **"Write"** (they need write access to edit)
5. They accept the invitation

**Pros:**
- Secure - only invited people can edit
- You control who has access
- Can revoke access anytime

**Cons:**
- Clients need GitHub accounts
- You need to manage invitations

### Option 2: Public Repository

**How it works:**
- Repository is public
- Anyone with GitHub account can log in and edit
- Less secure - anyone can edit

**Not recommended** for client sites.

### Option 3: Netlify Identity (Alternative)

**How it works:**
1. Use Netlify Identity (not Git Gateway)
2. Clients create accounts on your site
3. You manage users in Netlify dashboard
4. No GitHub account needed

**Setup:**
- Change `backend: git-gateway` to use Netlify Identity
- Configure user registration (invite-only or open)
- Manage users in Netlify dashboard

**Pros:**
- No GitHub account needed
- Easier for non-technical clients
- You manage users directly

**Cons:**
- Uses deprecated Netlify Identity
- More complex setup

## Current Setup (What You Have Now)

**Backend:** `git-gateway` (Netlify Identity + Git Gateway)
- Clients log in with **GitHub**
- They need to be **invited to the repository**
- Or repository needs to be public

## Step-by-Step for Clients

### First Time Setup

1. **You invite them:**
   - Go to GitHub repo settings
   - Invite them as collaborator
   - They accept invitation

2. **They access CMS:**
   - Go to: `https://your-site.netlify.app/admin/`
   - Click "Log in with GitHub"
   - Authorize access
   - Start editing!

### Daily Use

1. Go to: `https://your-site.netlify.app/admin/`
2. Click "Log in with GitHub"
3. Edit content
4. Click "Save" or "Publish"
5. Changes commit to GitHub automatically
6. Site updates automatically (Netlify auto-deploys)

## What Clients Can Do

Once logged in, clients can:
- ✅ Edit publications, news, people, images
- ✅ Add new content
- ✅ Delete content
- ✅ Upload images
- ✅ Sort/filter content
- ✅ See all changes in Git history

## Permissions & Roles

**Current setup:** All users have **full access** (can edit everything)

**To restrict access:**
- You'd need to implement custom roles
- Or use different collections for different users
- Or use Netlify Identity with role-based access

## Troubleshooting for Clients

**"Can't log in"**
- Check they have GitHub account
- Check they accepted repository invitation
- Check repository permissions

**"Don't have GitHub account"**
- They need to create one (free)
- Or switch to Netlify Identity (no GitHub needed)

**"Changes not appearing"**
- Wait 1-2 minutes for Netlify to deploy
- Check Netlify deploy logs

## Quick Reference for Clients

**CMS URL:** `https://your-site.netlify.app/admin/`
**Login:** Click "Log in with GitHub"
**Need:** GitHub account + repository access
