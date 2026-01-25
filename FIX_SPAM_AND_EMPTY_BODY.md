# Fix Spam + Empty Email Body

## Issue 1: Email Goes to Spam

### Why Gmail SMTP Goes to Spam

**Gmail SMTP issues:**
- Sending from `mistersuuns@gmail.com` but the site is `mistersuuns.space`
- Domain mismatch triggers spam filters
- Gmail SMTP is not designed for transactional emails
- No SPF/DKIM records for your custom domain

### Solutions

**Option A: Use SendGrid/Mailgun (Recommended)**
- Better deliverability
- Can send from `noreply@mistersuuns.space`
- Proper email authentication
- Designed for transactional emails

**Option B: Verify Domain in Gmail (Complex)**
- Set up Google Workspace
- Verify `mistersuuns.space` domain
- Add SPF/DKIM records
- More setup, better deliverability

**Option C: Tell Users to Whitelist**
- Quick fix: Tell users to check spam and whitelist `mistersuuns@gmail.com`
- Not ideal for production

### Immediate Fix: Switch to SendGrid

1. Sign up: https://sendgrid.com (free: 100/day)
2. Create API key
3. In Netlify:
   - **SMTP server host:** `smtp.sendgrid.net`
   - **Port:** `587`
   - **Username:** `apikey`
   - **Password:** [Your SendGrid API key]
   - **Sender:** `noreply@mistersuuns.space` (or verify domain first)

This will significantly improve deliverability.

---

## Issue 2: No Email Body

### The Problem

**Netlify Identity email body is NOT editable** - this is a Netlify limitation.

The default template should include:
- "You have been invited" message
- A confirmation link

**If the email is completely empty:**
- This is a Netlify bug
- Contact Netlify support

### What You Can Do

**Check if email is actually empty or just looks empty:**
- Some email clients hide HTML emails
- Check "Show original" or "View source" in email client
- The link might be there but not visible

**Contact Netlify Support:**
- "Identity invitation emails are arriving with no body content"
- "Only subject line appears, no message or link"
- Error ID: `01KFNNABKZ6211WA5FAYYCKRS3`
- Ask: "Is there a way to customize invitation email body content?"

### Workaround: Custom Email Template (If Available)

**Check if Netlify has a way to upload custom templates:**
- Some Netlify plans allow custom email templates
- Check **Identity → Emails** for "Upload template" option
- If available, you can create a custom HTML template

**If not available:**
- This is a Netlify Identity limitation
- You'll need to contact support or migrate to Auth0/DecapBridge

---

## Recommended Action Plan

### Step 1: Fix Spam (Do This Now)

**Switch to SendGrid:**
1. Sign up at sendgrid.com
2. Create API key
3. Update Netlify SMTP:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: [API key]
   - Sender: `noreply@mistersuuns.space`

**This will:**
- ✅ Improve deliverability
- ✅ Reduce spam filtering
- ✅ Allow sending from your domain

### Step 2: Fix Empty Body

**Contact Netlify Support:**
- Report empty email body issue
- Ask about custom email templates
- Request workaround or fix

**Or migrate to DecapBridge:**
- Better email templates
- More control
- 30-60 minute setup

---

## Quick Test

1. **Switch to SendGrid** (15 minutes)
2. **Send test invite** to yourself
3. **Check inbox** (not spam)
4. **Check email body** - is it actually empty or just hidden?

If body is still empty after SendGrid, it's definitely a Netlify bug - contact support.
