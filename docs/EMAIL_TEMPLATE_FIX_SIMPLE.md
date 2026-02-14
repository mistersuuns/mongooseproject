# Quick Fix: Netlify Identity Email Template

## The Problem
- Email shows "earnest-quokka-5963b7.netlify.app" instead of "mistersuuns.space"
- No email body or link
- Going to spam

## Immediate Fix

### Step 1: Go to Email Template Editor

1. Netlify Dashboard → Your Site
2. **Identity** → **Emails** → **Invitation template** → **Configure**

### Step 2: Copy This Complete Template

**Subject:**
```
You've been invited to join mistersuuns.space
```

**Body (HTML) - Paste this entire thing:**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="https://mistersuuns.space/admin/{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>If the link doesn't work, copy this URL into your browser: https://mistersuuns.space/admin/{{ .ConfirmationURL }}</small></p>
```

**IMPORTANT**: The `{{ .ConfirmationURL }}` variable contains the FULL URL including the hash. It looks like:
`https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

So the link will be:
`https://mistersuuns.space/admin/https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

**That won't work!** We need just the hash part.

### Step 3: Better Template (Extract Hash Only)

Since Netlify's template system might not support string manipulation, try this approach:

**If the template editor shows you what `{{ .ConfirmationURL }}` contains**, you can manually construct it. But first, let's see what variables are available.

**Look in the template editor for:**
- A "Variables" button or dropdown
- Help text showing available variables
- The default template to see what it uses

### Step 4: Alternative - Use JavaScript Redirect (If Template Won't Work)

If Netlify's template system can't extract just the hash, we can:
1. Point the link to: `https://mistersuuns.space/admin/`
2. Add JavaScript on the admin page to extract the token from `{{ .ConfirmationURL }}` and append it

But that's a workaround. The proper solution is fixing the template.

## Fix Spam Issue

### Quick Fix:
1. **Identity** → **Emails** → **Outgoing email address**
2. Set up custom SMTP with your domain email (e.g., `noreply@mistersuuns.space`)
3. Or tell users to check spam and whitelist `no-reply@netlify.com`

## What to Do Right Now

1. **Check the current template** - Is it empty? Did it get deleted?
2. **Paste the template above** - At least you'll have content and a link
3. **Test it** - Send yourself an invite and see what the link looks like
4. **If the link is malformed** - Contact Netlify support for help with template variables

## Expected Result

After fixing:
- Email subject: "You've been invited to join mistersuuns.space"
- Email body: Clear message with invitation text
- Link: Points to `https://mistersuuns.space/admin/#invite_token=...`
- User clicks → Goes to admin page → Password setup appears
