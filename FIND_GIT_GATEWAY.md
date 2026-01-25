# Finding Git Gateway in Netlify Identity Settings

## Navigation Path

1. **You're already at**: `https://app.netlify.com/sites/earnest-quokka-5963b7/identity`

2. **Scroll down** on the Identity page until you see:
   - **"Services"** section
   - Or **"External providers"** section

3. **Look for "Git Gateway"** in the list of services

## Where It Usually Appears

Git Gateway typically appears in one of these locations:

### Option A: Under "Services" Section
- Scroll down past "Registration preferences"
- Look for a section labeled **"Services"**
- You should see **"Git Gateway"** listed there
- It may show:
  - Status: "Connected" or "Not connected"
  - A toggle switch to enable/disable
  - An "Edit settings" or "Configure" button

### Option B: Under "External providers"
- Some Netlify interfaces group it under "External providers"
- Look for **"Git Gateway"** in that list

### Option C: Direct Link
If you can't find it, try going directly to:
- `https://app.netlify.com/sites/earnest-quokka-5963b7/identity/services/git-gateway`

## What You Should See

When you find Git Gateway, you should see:
- **Status**: Connected to GitHub (or an error message)
- **Repository**: Should show `mistersuuns/mongooseproject`
- **Edit/Configure button**: To reconnect if needed

## If You Don't See It

1. **Check if Identity is enabled**: At the top of the Identity page, there should be a toggle to "Enable Identity"
2. **Enable Identity first**: Git Gateway only appears when Identity is enabled
3. **Refresh the page**: Sometimes it takes a moment to load

## Quick Actions

Once you find Git Gateway:
- If it shows an error or old repo name → Click **"Edit settings"** or **"Configure"**
- Reconnect to: `mistersuuns/mongooseproject`
- Save changes
