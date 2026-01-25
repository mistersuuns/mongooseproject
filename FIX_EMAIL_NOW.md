# Fix Netlify Email - Exact Steps

## Step 1: Set Custom Domain as Primary

1. Netlify Dashboard → Your Site
2. **Domain management**
3. Make `mistersuuns.space` the **Primary domain** (not just an alias)
4. This makes `{{ .SiteURL }}` use your custom domain

## Step 2: Configure Invitation Email Template

1. **Identity** → **Emails** → **Invitation template** → Click **Configure**

2. **Subject:**
```
You've been invited to join mistersuuns.space
```

3. **Body (HTML):**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>{{ .SiteURL }}</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
```

**Save this first** - this gets the email body working.

## Step 3: The ConfirmationURL Problem

`{{ .ConfirmationURL }}` is a full URL that goes to the **root domain** with the token in the hash:
`https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

**Netlify doesn't provide a way to extract just the token** or customize where the link goes in the template.

### Options:

**Option A: Contact Netlify Support**
Ask: "How do I customize invitation email links to point to `/admin/` instead of root? The `{{ .ConfirmationURL }}` variable always goes to root."

**Option B: Accept Root Link, Handle in Code**
- Keep link going to root
- Add JavaScript on homepage to detect `#invite_token=` and redirect to `/admin/` with the hash
- But you said no workarounds

**Option C: Check if "Path to template" Affects This**
- You have "Path to template" set to `/admin/`
- This might be for where the Identity widget is, not where links go
- But test: Does `{{ .ConfirmationURL }}` change if you modify "Path to template"?

## Step 4: Fix Spam

**Identity** → **Emails** → **Outgoing email address**:
- Set up custom SMTP with your domain
- Or users check spam folder

## What to Do Right Now

1. ✅ Set `mistersuuns.space` as primary domain
2. ✅ Click "Configure" on Invitation template  
3. ✅ Paste the template above (gets email working)
4. ✅ Test - send yourself an invite
5. ✅ Check what `{{ .ConfirmationURL }}` contains
6. ❓ If link goes to root, contact Netlify support for proper solution

The email template system in Netlify Identity is limited - it doesn't support customizing the confirmation URL path. You may need Netlify support to help with this.
