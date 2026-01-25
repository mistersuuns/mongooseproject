# Fix Email Template - Final Steps

## Domain is Already Primary ✅
`mistersuuns.space` is already set as Primary domain. The `{{ .SiteURL }}` variable should use it, but if it's still showing netlify.app, it might be:
- Not fully propagated
- Identity using cached value
- Need to check Identity-specific settings

## Step 1: Configure Email Template Content

1. **Identity** → **Emails** → **Invitation template** → **Configure**

2. **Subject:**
```
You've been invited to join mistersuuns.space
```

3. **Body (HTML) - Complete template:**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="https://mistersuuns.space/admin/{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>If the link doesn't work, try: <a href="{{ .ConfirmationURL }}">this link</a></small></p>
```

**Wait - that won't work because `{{ .ConfirmationURL }}` is a full URL.**

## The Real Solution

Since `{{ .ConfirmationURL }}` is a full URL like `https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`, we need to:

**Option 1: Use the ConfirmationURL as-is, but add redirect**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>After clicking, you'll be redirected to set up your password.</small></p>
```

Then handle the redirect in code (but you said no workarounds).

**Option 2: Hardcode the domain (if ConfirmationURL format is predictable)**

If `{{ .ConfirmationURL }}` always contains `#invite_token=`, we could try to extract it, but Netlify templates don't support that.

**Option 3: Contact Netlify Support**

Ask: "The `{{ .ConfirmationURL }}` variable in Identity invitation emails always points to the root domain. How do I make it point to `/admin/` instead?"

## Step 2: Check Identity API Endpoint

You showed earlier:
- **API endpoint**: `https://mistersuuns.space/.netlify/identity`

This suggests Identity is configured for your custom domain. The `{{ .SiteURL }}` might update after:
- A few minutes (propagation)
- Re-saving the email template
- Testing a new invite

## Step 3: Test Template

1. Save the template above
2. Send a test invite
3. Check what `{{ .ConfirmationURL }}` actually contains
4. See if `{{ .SiteURL }}` uses your custom domain

## Immediate Fix for Empty Email

**Right now, paste this in the template body:**

```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on mistersuuns.space.</p>
<p>Click the link below to accept the invitation:</p>
<p><a href="{{ .ConfirmationURL }}">Accept Invitation</a></p>
```

This at least gets the email working with content. Then we can address the `/admin/` redirect separately.
