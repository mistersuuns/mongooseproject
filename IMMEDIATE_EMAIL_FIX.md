# Immediate Fix for Netlify Identity Email

## Right Now - Get Email Working

### Step 1: Check Current Template

1. Netlify Dashboard → Your Site
2. **Identity** → **Emails** → **Invitation template** → **Configure**
3. **Is the template empty?** If yes, that's why there's no body/link

### Step 2: Use This Working Template

**Subject:**
```
You've been invited to join mistersuuns.space
```

**Body (HTML):**
```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>This link will take you to the site where you can set up your password.</small></p>
```

**This uses the default `{{ .ConfirmationURL }}` which works, but goes to the root domain.**

### Step 3: Fix the Redirect

Since `{{ .ConfirmationURL }}` goes to the root, we need to handle the redirect properly. 

**Option A: Fix in Netlify (Proper Way)**

The `{{ .ConfirmationURL }}` variable contains something like:
`https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

**We need to replace the domain part.** Check if Netlify's template editor supports:
- String replacement functions
- A `{{ .Token }}` variable (just the token part)
- A way to construct custom URLs

**Look for:**
- Variables dropdown in the template editor
- Help/documentation link
- Template function reference

**Option B: Handle Redirect in Code (Temporary)**

If template variables won't work, we can:
1. Keep the link pointing to root with token
2. Add JavaScript on homepage to detect token and redirect to `/admin/`

But you said no workarounds, so let's fix it properly in Netlify.

## Fix Domain Issue

The email says "earnest-quokka-5963b7.netlify.app" because:

1. **Check Domain Settings:**
   - Netlify Dashboard → **Domain management**
   - Is `mistersuuns.space` set as **Primary domain**?
   - If not, `{{ .SiteURL }}` will use the netlify.app subdomain

2. **Set Custom Domain as Primary:**
   - In Domain management, make sure `mistersuuns.space` is the primary
   - This should make `{{ .SiteURL }}` use your custom domain

## Fix Spam Issue

**Quick fix:**
- Tell users to check spam folder
- Whitelist `no-reply@netlify.com`

**Proper fix:**
- Set up custom SMTP in **Identity** → **Emails** → **Outgoing email address**
- Use an email service (SendGrid, Mailgun, etc.)
- Send from `noreply@mistersuuns.space`

## What to Do Next

1. **Paste the template above** - At least get email content working
2. **Test the invite** - See what `{{ .ConfirmationURL }}` actually contains
3. **Check template variables** - Look for `{{ .Token }}` or string functions
4. **If no variables work** - Contact Netlify support with:
   - "I need to customize invitation email links to point to `/admin/` instead of root"
   - "What template variables/functions are available for invitation emails?"
   - "How do I extract just the token from `{{ .ConfirmationURL }}`?"

## Expected Working Template (If Variables Work)

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation:</p>
<p><a href="https://mistersuuns.space/admin/#invite_token={{ .Token }}">Accept Invitation</a></p>
```

**But we need to confirm `{{ .Token }}` exists or find another way to extract it.**
