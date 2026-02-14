# Netlify Identity Email - What We Can Actually Control

## What You Can Edit
- ✅ **Subject**: "You've been invited to edit mistersuuns.space/admin/"
- ✅ **Path to template**: "/admin/"
- ❌ **Email body**: NOT EDITABLE (hardcoded by Netlify)

## The Problems
1. Email shows wrong domain (netlify.app instead of mistersuuns.space)
2. Email body is empty or missing link (can't edit it)
3. Email goes to spam

## What We Can Fix

### 1. Check Identity API Endpoint
The email domain might be controlled by the Identity API endpoint setting.

1. **Identity** → Look for **API endpoint** or **Configuration**
2. It should show: `https://mistersuuns.space/.netlify/identity`
3. If it shows `https://earnest-quokka-5963b7.netlify.app/.netlify/identity`, that's the problem

**To fix:**
- This might auto-update when custom domain is primary
- Or might need to be manually set (if there's a setting)
- Or might require Netlify support to change

### 2. Fix Spam Issue
**Identity** → **Emails** → **Outgoing email address**:
- Set up custom SMTP
- Send from `noreply@mistersuuns.space` (or your domain email)

### 3. The Email Body Issue
Since the body can't be edited, Netlify's default template should include:
- "You have been invited" message
- A confirmation link

**If the email is empty or missing the link:**
- This is a Netlify bug
- Contact Netlify support
- Or the email might be getting stripped by spam filters

## What to Do

1. **Check the Identity API endpoint** - Does it use your custom domain?
2. **Set up custom SMTP** - Fixes spam and uses your domain
3. **Test the invite** - See what the actual email looks like
4. **Contact Netlify support** if:
   - Email body is completely empty
   - Link is missing
   - Domain still wrong after setting custom domain as primary

## The Reality
Netlify Identity email templates are very limited. You can't customize the body. If the default template isn't working (empty email, wrong domain), it's likely a Netlify configuration issue that needs their support to fix.
