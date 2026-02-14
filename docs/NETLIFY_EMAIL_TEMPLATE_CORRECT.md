# Fix Netlify Identity Email Template - Correct Approach

## Issues
1. Email shows "earnest-quokka-5963b7.netlify.app" instead of "mistersuuns.space"
2. No email body/link
3. Email goes to spam

## Step 1: Fix Domain (So {{ .SiteURL }} Uses Custom Domain)

1. Netlify Dashboard → Your Site
2. **Domain management**
3. Make sure `mistersuuns.space` is set as **Primary domain**
4. If it's not primary, `{{ .SiteURL }}` will use the netlify.app subdomain

## Step 2: Configure Invitation Email Template

1. **Identity** → **Emails** → **Invitation template** → Click **Configure**

2. **Subject:**
```
You've been invited to join mistersuuns.space
```

3. **Body (HTML) - Paste this:**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>{{ .SiteURL }}</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>This link will take you to the site where you can set up your password.</small></p>
```

**This will work, but `{{ .ConfirmationURL }}` goes to the root domain, not `/admin/`.**

## Step 3: Fix the Link to Go to /admin/

The problem: `{{ .ConfirmationURL }}` is a full URL like:
`https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

We need: `https://mistersuuns.space/admin/#invite_token=ABC123`

**Netlify's template system doesn't support string manipulation**, so we can't extract just the token.

### Solution: Use JavaScript Redirect on Homepage

Since we can't modify the URL in the template, we'll:
1. Keep the link pointing to root (with token in hash)
2. Add JavaScript on homepage to detect token and redirect to `/admin/`

**But wait - you said no workarounds. Let me check if there's a Netlify setting...**

## Step 4: Check Netlify Identity Redirect Settings

Look for:
- **Identity** → **Settings** or **Configuration**
- A "Redirect URL" or "Invitation redirect" setting
- Any setting that controls where invitation links go

If this exists, set it to `/admin/`.

## Step 5: Fix Spam Issue

**Identity** → **Emails** → **Outgoing email address**:
- Set up custom SMTP (SendGrid, Mailgun, etc.)
- Or tell users to check spam and whitelist `no-reply@netlify.com`

## What to Do Right Now

1. **Set custom domain as primary** (fixes domain issue)
2. **Click "Configure" on Invitation template**
3. **Paste the template above** (at least gets email working)
4. **Test** - see what `{{ .ConfirmationURL }}` actually contains
5. **Check Netlify settings** - look for redirect/invitation URL settings
6. **If no setting exists** - Contact Netlify support: "How do I make invitation emails link to `/admin/` instead of root?"

## Alternative: Check if "Path to template" Field Affects Links

You showed:
- **Path to template**: `/admin/`

This might control where the Identity widget expects to be, not where links go. But check if changing this affects the `{{ .ConfirmationURL }}` variable.

Try:
1. Keep "Path to template" as `/admin/`
2. In the email template, use: `{{ .SiteURL }}/admin/{{ .ConfirmationURL }}`
3. Test if this works

But this likely won't work because `{{ .ConfirmationURL }}` is already a full URL.
