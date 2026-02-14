# Fix Netlify Identity Invite Error 500

## Error
```
{"code":500,"msg":"Error inviting user","error_id":"01KFNNABKZ6211WA5FAYYCKRS3"}
```

## Common Causes

### 1. SMTP Not Configured or Wrong Credentials

**Check:**
- **Identity → Emails → Outgoing email address**
- Is SMTP actually configured?
- Are credentials correct?

**If using Gmail:**
- Must use **App Password** (not regular password)
- 2FA must be enabled
- App Password: https://myaccount.google.com/apppasswords

**If using SendGrid:**
- Username must be: `apikey`
- Password must be your API key (not account password)
- Check API key has "Mail Send" permission

**If using Mailgun:**
- Use SMTP credentials from Mailgun dashboard
- Not your Mailgun account password

### 2. SMTP Provider Blocking/Errors

**Check your SMTP provider dashboard:**
- **SendGrid**: Activity tab - look for errors
- **Mailgun**: Logs - check for authentication failures
- **Gmail**: Check if account is locked/restricted

### 3. Email Address Format Issue

**Check:**
- Is the email address valid format?
- No typos?
- Not already invited?

### 4. Netlify Identity Service Issue

**Try:**
- Wait 5 minutes and try again
- Check Netlify status: https://www.netlifystatus.com/
- Try inviting a different email address

## Step-by-Step Fix

### Step 1: Verify SMTP Configuration

1. **Identity → Emails → Outgoing email address**
2. Check:
   - ✅ SMTP server host is correct
   - ✅ Port is correct (usually 587)
   - ✅ Username is correct
   - ✅ Password is correct (App Password for Gmail)
   - ✅ Sender email is set

### Step 2: Test SMTP Connection

**If using Gmail:**
- Go to: https://myaccount.google.com/apppasswords
- Generate new App Password
- Update in Netlify

**If using SendGrid:**
- Dashboard → Settings → API Keys
- Verify API key exists and has "Mail Send" permission
- Username in Netlify should be: `apikey`
- Password should be the API key

**If using Mailgun:**
- Dashboard → Sending → Domain Settings
- Get SMTP credentials
- Verify they're correct in Netlify

### Step 3: Check for Rate Limits

**Gmail:**
- 500 emails/day limit
- Check if you've hit it

**SendGrid (Free):**
- 100 emails/day limit
- Check dashboard for usage

**Mailgun (Free):**
- 5,000 emails/month
- Check dashboard for usage

### Step 4: Try Default Netlify Email (Temporary)

**To test if it's SMTP issue:**
1. **Identity → Emails → Outgoing email address**
2. Remove SMTP settings (set back to default)
3. Try inviting again
4. If it works → SMTP is the problem
5. If it still fails → Different issue

### Step 5: Check Email Address

**Try:**
- Invite a different email address
- Make sure email format is valid: `user@domain.com`
- Check if user was already invited

## Most Likely Fix

**If you just set up SMTP:**
1. **Gmail**: Make sure you're using App Password, not regular password
2. **SendGrid**: Username must be `apikey`, password is API key
3. **Mailgun**: Use SMTP credentials from dashboard, not account password

**Quick test:**
- Temporarily remove SMTP (use default Netlify email)
- Try invite again
- If it works → SMTP credentials are wrong
- Fix SMTP and try again

## Contact Netlify Support

If nothing works, contact Netlify with:
- Error ID: `01KFNNABKZ6211WA5FAYYCKRS3`
- Error message: "Error inviting user"
- What SMTP provider you're using
- Screenshot of SMTP settings (hide password)
