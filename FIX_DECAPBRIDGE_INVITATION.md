# Fix DecapBridge Invitation Flow

## The Problem
- Invitation email has no link/button
- User sees login form instead of password setup
- First-time users can't set password

## What to Check in DecapBridge Dashboard

1. **Go to DecapBridge dashboard**
2. **Find the user you invited**
3. **Look for:**
   - A "Copy invitation link" button
   - A direct URL to share
   - User status/details that might show a setup URL
   - A "Resend invitation" option that might include a link

## Possible Solutions

### Option 1: Manual Invitation Link
If DecapBridge dashboard shows an invitation URL:
- Copy that URL
- Send it manually to the user
- That URL should take them to password setup

### Option 2: Direct Auth URL
The invitation might need to go to DecapBridge's auth URL directly:
- `https://auth.decapbridge.com/sites/6924f3be-3af2-4b74-af00-7582d5a4e36c/pkce`
- Or a similar URL with invitation token

### Option 3: Check Email Source
- Check the raw email source
- Look for any URLs (even if not clickable)
- There might be a URL in plain text that needs to be copied

## What I Need From You

1. **What does the invitation email actually say?** (full text)
2. **In DecapBridge dashboard, what options do you see for the invited user?**
3. **Is there a way to "view" or "copy" the invitation link?**

Once I have this info, I can help build a proper solution.
