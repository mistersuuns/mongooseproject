# Proper Netlify Identity Configuration

## The Problem
Netlify Identity invitation emails default to sending users to the site root (`https://yoursite.com/#invite_token=...`), but we need them to go directly to `/admin/` where the CMS is.

## The Proper Solution: Configure in Netlify Dashboard

### Step 1: Go to Identity Email Settings

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your site: `earnest-quokka-5963b7` or `mistersuuns.space`
3. Navigate to: **Identity** → **Emails**
4. Find **Invitation template** and click **Configure**

### Step 2: Update the Invitation Email Template

In the email template editor, find the line with the invitation link. The default looks like:

```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

**You need to change it so the link points to `/admin/` instead of the root.**

The `{{ .ConfirmationURL }}` variable contains the full URL like `https://yoursite.com/#invite_token=ABC123`.

**Try this first:**
```html
<a href="{{ .SiteURL }}/admin/#invite_token={{ .Token }}">Accept the invite</a>
```

**If `{{ .Token }}` doesn't work**, check what template variables are available in the Netlify UI. Look for:
- A variables dropdown or help text
- Documentation link in the template editor
- The default template to see what variables Netlify uses

**Alternative approach** - if you can see the full `{{ .ConfirmationURL }}` format, you may need to:
1. Extract just the hash portion (`#invite_token=...`)
2. Construct: `{{ .SiteURL }}/admin/` + the hash portion

### Step 3: Set Registration to "Invite Only"

1. Still in **Identity** settings (not in the email template editor)
2. Find **Registration preferences**
3. Select **Invite only**
4. Click **Save**

### Step 4: Save and Test

1. Click **Save** in the email template editor
2. Invite a test user from **Identity** → **Users** → **Invite users**
3. Check the invitation email - the link should point to `/admin/#invite_token=...`

## What to Look For in Netlify UI

When configuring the email template:
- Check for a "Variables" or "Help" button that shows available template variables
- Look at the default template to see what `{{ .ConfirmationURL }}` actually contains
- Netlify's template system may support string manipulation functions

## Expected Result

After proper configuration:
- Invitation emails contain links like: `https://yoursite.com/admin/#invite_token=ABC123`
- Users click link → go directly to `/admin/`
- Identity widget on `/admin/` automatically detects the token in URL hash
- Password setup modal appears automatically
- User completes signup and CMS loads

## If You Can't Get Template Variables to Work

1. Check Netlify's documentation: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/identity-generated-emails/
2. Contact Netlify support - they can help you configure custom invitation URLs
3. The proper solution is configuring this in Netlify, not patching with JavaScript

## Important

Once this is configured properly in Netlify, no code changes are needed. The invitation emails will point to `/admin/` directly, and the Identity widget on that page will handle everything automatically.
