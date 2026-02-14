# Proper Netlify Identity Invitation Email Setup

## The Problem
Netlify Identity invitation emails default to sending users to the site root (`https://yoursite.com/#invite_token=...`), but we need them to go directly to `/admin/` where the CMS is.

## The Proper Solution

### Step 1: Customize the Invitation Email Template

1. Go to **Netlify Dashboard** → Your Site (`earnest-quokka-5963b7` or `mistersuuns.space`)
2. Navigate to: **Identity** → **Emails** → **Invitation template**
3. Click **Configure** next to "Invitation template"

### Step 2: Update the Template

Replace the default template with this:

```html
<h2>You have been invited</h2>
<p>
You have been invited to create a user on {{ .SiteURL }}. Follow
this link to accept the invite:
</p>
<p><a href="{{ .SiteURL }}/admin/#{{ .Token }}">Accept the invite</a></p>
```

**Key change**: Changed `{{ .ConfirmationURL }}` to `{{ .SiteURL }}/admin/#{{ .Token }}`

This ensures invitation links go directly to `/admin/` with the token in the hash, where the Identity widget is properly configured to handle it.

### Step 3: Save

Click **Save** in the Netlify UI.

## How It Works

1. User receives invitation email
2. Clicks link → goes to `https://yoursite.com/admin/#invite_token=...`
3. The Identity widget on `/admin/` detects the token
4. Opens the password setup modal automatically
5. User sets password and is logged in
6. CMS loads immediately

## Alternative: If Template Variables Don't Work

If `{{ .Token }}` doesn't work, you can use:

```html
<a href="{{ .SiteURL }}/admin/{{ .ConfirmationURL }}">Accept the invite</a>
```

But you may need to extract just the hash portion. The first approach (`{{ .SiteURL }}/admin/#{{ .Token }}`) is cleaner if the token variable is available.
