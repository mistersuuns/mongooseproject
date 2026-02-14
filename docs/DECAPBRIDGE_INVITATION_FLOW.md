# DecapBridge Invitation Flow - First Time User

## Expected Flow

1. User receives invitation email from DecapBridge
2. User clicks invitation link
3. User should see **password setup form** (not login form)
4. User sets password
5. User is logged in and can access CMS

## If User Sees Login Form Instead

**Possible issues:**

### 1. Check the Invitation Link

The invitation email should contain a link like:
- `https://mistersuuns.space/admin/#invite_token=...`
- Or a DecapBridge-specific invitation URL

**If the link doesn't have a token or goes to wrong URL:**
- Check DecapBridge dashboard
- Verify invitation was sent correctly
- Try sending a new invitation

### 2. Try "Forgot Password" Flow

If user sees login form:
1. Click **"Forgot password?"**
2. Enter the email address they were invited with
3. They should receive a password setup link
4. This might work as a workaround

### 3. Check DecapBridge Dashboard

1. Go to DecapBridge dashboard
2. Check **Users** or **Invitations** section
3. Verify:
   - User was invited successfully
   - Invitation email was sent
   - User status shows as "Pending" or "Invited"

### 4. Direct Password Setup Link

DecapBridge might provide a direct link in the invitation email that bypasses the login form. Check the email for:
- A "Set Password" button
- A direct link to password setup
- Instructions to set up password

## Solution: Contact DecapBridge Support

If the invitation flow isn't working:
1. Check DecapBridge documentation: https://decapbridge.com/docs
2. Contact DecapBridge support
3. Ask: "Invited users see login form instead of password setup form - how do they set their password?"

## Alternative: Manual User Creation

If invitation flow is broken:
1. In DecapBridge dashboard, you might be able to:
   - Create user manually
   - Send password reset link
   - Set temporary password

## What to Check Now

1. **Check the invitation email** - what does the link look like?
2. **Check DecapBridge dashboard** - is the user listed as invited?
3. **Try "Forgot password"** - might trigger password setup
4. **Check DecapBridge docs** - look for invitation flow documentation
