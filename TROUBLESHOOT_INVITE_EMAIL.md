# Troubleshoot Invitation Email Not Received

## Possible Issues

### 1. Check Spam Folder
- **Most common issue** - Check spam/junk folder
- Check "Promotions" tab in Gmail
- Tell user to whitelist the sender email

### 2. SMTP Configuration Issues

**If you set up custom SMTP:**
- Check if SMTP credentials are correct
- Verify sender email is verified/authenticated
- Check SMTP provider dashboard for:
  - Failed sends
  - Bounce reports
  - Rate limits hit

**If still using default (no-reply@netlify.com):**
- Very likely in spam
- Gmail/Outlook often filter Netlify emails

### 3. Email Delivery Delay

**Typical delays:**
- Default Netlify email: 1-5 minutes
- Custom SMTP: Usually instant, but can be 1-2 minutes
- If using Gmail SMTP: Can take 5-10 minutes (Gmail has delays)

### 4. Check Netlify Logs

1. Netlify Dashboard → Your Site
2. **Identity** → **Identity audit log**
3. Look for the invitation event
4. Check if it shows "sent" or any errors

### 5. Verify SMTP Settings

**If using Gmail:**
- Make sure you used an **App Password** (not regular password)
- Check that 2FA is enabled on Gmail account
- Gmail has sending limits (500/day)

**If using SendGrid/Mailgun:**
- Check their dashboard for delivery status
- Verify domain/email is verified
- Check if you hit free tier limits

## Quick Checks

1. ✅ **Check spam folder** (most common)
2. ✅ **Check Identity audit log** in Netlify
3. ✅ **Verify SMTP is actually configured** (not just saved)
4. ✅ **Test with your own email** first
5. ✅ **Check SMTP provider dashboard** for errors

## If Using Default Netlify Email

The email is probably in spam. Tell the user:
- Check spam/junk folder
- Whitelist `no-reply@netlify.com`
- Check "All Mail" in Gmail

## If Using Custom SMTP

1. Check SMTP provider dashboard (SendGrid/Mailgun/etc.)
2. Look for:
   - Delivery status
   - Bounce reasons
   - Rate limit warnings
   - Authentication errors

3. Verify sender email is:
   - Verified in SMTP provider
   - Not blocked
   - Within sending limits

## Test Steps

1. **Send invite to your own email** (the one you used for SMTP)
2. **Check spam folder immediately**
3. **Wait 5 minutes** - check again
4. **Check Identity audit log** - see if Netlify shows it as sent
5. **Check SMTP provider logs** (if using custom SMTP)

## Common Issues

**Gmail SMTP:**
- Delays of 5-10 minutes are normal
- Check spam folder
- Make sure App Password is used (not regular password)

**SendGrid:**
- Check "Activity" tab in dashboard
- Verify sender email is verified
- Free tier: 100 emails/day limit

**Mailgun:**
- Check "Logs" in dashboard
- Verify domain is authenticated
- Free tier: 5,000 emails/month
