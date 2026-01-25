# Fix Netlify Identity Email Template - Complete Solution

## Issues to Fix
1. ✅ Email going to spam
2. ✅ Email shows wrong domain (netlify.app instead of mistersuuns.space)
3. ✅ Missing email body and link

## Step 1: Configure Custom Domain as Primary in Netlify

**This ensures `{{ .SiteURL }}` uses your custom domain:**

1. Go to Netlify Dashboard → Your Site
2. Navigate to: **Domain management**
3. Make sure `mistersuuns.space` is set as the **Primary domain** (not just an alias)
4. If it's not primary, Netlify may still use the netlify.app subdomain in emails

## Step 2: Fix the Invitation Email Template

1. Go to: **Identity** → **Emails** → **Invitation template** → **Configure**

2. **Subject line:**
```
You've been invited to join mistersuuns.space
```

3. **Body (HTML) - Complete template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2c3e50;">You have been invited</h2>
    <p>
      You have been invited to create a user account on <strong>mistersuuns.space</strong>.
    </p>
    <p>
      Click the link below to accept the invitation and set up your password:
    </p>
    <p style="margin: 30px 0;">
      <a href="https://mistersuuns.space/admin/{{ .ConfirmationURL | replace "https://" "" | replace "http://" "" | replace .SiteURL "" | trimPrefix "/" }}" 
         style="display: inline-block; padding: 12px 24px; background-color: #00c7b7; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Accept Invitation
      </a>
    </p>
    <p style="color: #666; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="word-break: break-all;">https://mistersuuns.space/admin/{{ .ConfirmationURL | replace "https://" "" | replace "http://" "" | replace .SiteURL "" | trimPrefix "/" }}</span>
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="color: #999; font-size: 12px;">
      This invitation link will expire in 7 days.
    </p>
  </div>
</body>
</html>
```

**Wait - that template syntax might not work. Let me give you a simpler version:**

### Simpler Template (Use This):

**Subject:**
```
You've been invited to join mistersuuns.space
```

**Body (HTML):**
```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="https://mistersuuns.space/admin/{{ .ConfirmationURL }}">Accept Invitation</a></p>
<p><small>If the link doesn't work, copy this URL: https://mistersuuns.space/admin/{{ .ConfirmationURL }}</small></p>
```

**BUT** - `{{ .ConfirmationURL }}` is a full URL like `https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`

**We need to extract just the hash part. Try this instead:**

**Body (HTML) - Corrected:**
```html
<h2>You have been invited</h2>
<p>You have been invited to create a user account on <strong>mistersuuns.space</strong>.</p>
<p>Click the link below to accept the invitation and set up your password:</p>
<p><a href="https://mistersuuns.space/admin/#invite_token={{ .Token }}">Accept Invitation</a></p>
<p><small>If the link doesn't work, copy this URL: https://mistersuuns.space/admin/#invite_token={{ .Token }}</small></p>
```

**If `{{ .Token }}` doesn't work**, you'll need to check what variables Netlify provides. Look for a "Variables" or "Help" button in the template editor.

## Step 3: Fix Email Deliverability (Prevent Spam)

### Option A: Use Custom SMTP (Recommended)

1. Go to: **Identity** → **Emails** → **Outgoing email address**
2. Click **Connect your third-party email provider**
3. Choose a provider (SendGrid, Mailgun, AWS SES, etc.)
4. Enter SMTP credentials:
   - **SMTP server host**: (from your email provider)
   - **SMTP server port**: Usually 587 or 465
   - **Server login username**: Your SMTP username
   - **Server login password**: Your SMTP password
   - **Sender email address**: `noreply@mistersuuns.space` (or your domain email)

### Option B: Use Netlify's Default (Quick Fix)

If you can't set up SMTP right now:
1. The email will come from `no-reply@netlify.com`
2. Tell users to check spam folder
3. They can whitelist `no-reply@netlify.com`

## Step 4: Test the Template

1. **Save** the email template
2. Go to **Identity** → **Users** → **Invite users**
3. Enter a test email address
4. Click **Send invitation**
5. Check the email - it should:
   - Show "mistersuuns.space" (not netlify.app)
   - Have a clear message body
   - Have a working link to `/admin/`

## Troubleshooting Template Variables

If the template variables don't work:

1. **Check available variables**: Look for a "Variables" dropdown or help icon in the template editor
2. **Test with default template first**: Reset to default, see what `{{ .ConfirmationURL }}` contains
3. **Manual extraction**: If `{{ .ConfirmationURL }}` is `https://earnest-quokka-5963b7.netlify.app/#invite_token=ABC123`, you might need to:
   - Use a template function to extract just `#invite_token=ABC123`
   - Or construct: `https://mistersuuns.space/admin/#invite_token=ABC123` manually

## If Template Variables Still Don't Work

Contact Netlify support and ask:
- "What template variables are available for invitation emails?"
- "How do I extract just the hash portion from `{{ .ConfirmationURL }}`?"
- "How do I use my custom domain in invitation email links?"

They can provide the exact syntax for your use case.
