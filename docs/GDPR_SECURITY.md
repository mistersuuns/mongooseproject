# GDPR Compliance & Security Checklist

## GDPR Compliance

### ✅ Current Status

**What's Already Compliant:**
- **HTTPS**: Netlify automatically provides SSL/TLS encryption
- **Data Processing Agreement**: Netlify provides DPA as part of their Terms of Service
- **Git Gateway**: No personal GitHub tokens exposed to users
- **Identity Service**: Netlify Identity is GDPR-compliant (based on GoTrue)

### ⚠️ What You Need to Add

#### 1. Privacy Policy
**Required:** Add a privacy policy page to your site.

**What to include:**
- Who you are (data controller)
- What data you collect (CMS editor emails/names via Netlify Identity)
- Why you collect it (CMS authentication)
- Who processes it (Netlify, GitHub)
- User rights (access, deletion, portability)
- Contact information for privacy requests

**Location:** Create `site/privacy.html` or add to existing pages

#### 2. Cookie Consent Banner
**Required:** If you use any analytics or tracking cookies.

**Current status:** Your static site likely doesn't use cookies, BUT:
- Netlify Identity uses JWT tokens (stored in localStorage/cookies)
- These are "strictly necessary" cookies (exempt from consent)
- If you add analytics (Google Analytics, etc.), you'll need consent

**Recommendation:** Add a simple cookie notice explaining:
- Identity cookies are necessary for CMS functionality
- No tracking cookies are used (unless you add analytics)

#### 3. Data Processing Disclosure
**Required:** Disclose that Netlify processes user data.

**Add to Privacy Policy:**
```
We use Netlify Identity for CMS authentication. Netlify processes:
- Email addresses of CMS editors
- Authentication tokens (stored securely)
- Login metadata

Netlify is GDPR-compliant and acts as a data processor under our DPA.
```

#### 4. User Rights Implementation
**Required:** Provide way for users to exercise GDPR rights.

**For CMS editors:**
- **Right to access**: They can see their data in Netlify dashboard
- **Right to deletion**: You can delete users in Netlify Identity settings
- **Right to portability**: Export user data from Netlify dashboard

**Action items:**
1. Document how to request data/deletion
2. Add contact email to privacy policy
3. Set up process to handle requests (typically: privacy@yourdomain.com)

---

## Security Concerns

### ✅ Current Security Measures

**What's Secure:**
- **Git Gateway**: No GitHub credentials exposed to CMS users
- **HTTPS**: Automatic SSL/TLS encryption (Netlify)
- **JWT Authentication**: Secure token-based auth
- **Identity Widget**: Secure authentication flow
- **Repository Access**: Only Netlify has write access via Git Gateway

### ⚠️ Security Recommendations

#### 1. Access Control

**Current:** Registration is "Open" (anyone can sign up)

**Recommendation:** Change to "Invite only"
- Go to Netlify Dashboard → Site Settings → Identity → Registration
- Change from "Open" to "Invite only"
- Manually invite only trusted editors

**Why:** Prevents unauthorized users from creating accounts

#### 2. Multi-Factor Authentication (MFA)

**For GitHub login:**
- Enable MFA on your GitHub account
- Encourage all editors to enable MFA on their GitHub accounts

**For Netlify Identity (email/password):**
- Netlify Identity supports MFA
- Enable in: Site Settings → Identity → Settings → Enable MFA

#### 3. Role-Based Access Control (RBAC)

**Current:** All users have full access to all collections

**Recommendation:** Set up roles if you have multiple editors

**How:**
1. In Netlify Identity, assign roles to users (e.g., "editor", "admin")
2. Update `site/admin/config.yml` to restrict collections by role:

```yaml
collections:
  - name: "publications"
    # ... existing config ...
    access_control:
      role: "admin"  # Only admins can edit publications
```

#### 4. Branch Protection

**Recommendation:** Protect your main branch in GitHub

**How:**
1. Go to GitHub repo → Settings → Branches
2. Add branch protection rule for `main`
3. Options:
   - Require pull request reviews (optional - might break CMS)
   - Require status checks (optional)
   - Require signed commits (optional)

**Note:** Git Gateway commits directly to main, so be careful with restrictions

#### 5. Admin Path Security

**Current:** Admin is at `/admin/` (publicly known path)

**Options:**
1. **Keep as-is** (recommended): Security through obscurity isn't real security
   - Identity widget protects it anyway
   - Easier to remember/bookmark

2. **Change path** (optional): Rename `/admin/` to something less obvious
   - Update `site/admin/index.html` location
   - Update any links/bookmarks

#### 6. Audit Logs

**Available:** Netlify provides Identity audit logs

**How to check:**
- Netlify Dashboard → Site Settings → Identity → Audit log
- Review who logged in and when

**Recommendation:** Review monthly for suspicious activity

#### 7. Content Security

**Current:** Markdown content is stored in Git

**Security considerations:**
- **XSS Protection**: Decap CMS sanitizes markdown output
- **File Uploads**: Media files go to `site/images/uploads/`
  - Validate file types in CMS config (add to `config.yml`)
  - Consider file size limits

**Recommendation:** Add file validation to `config.yml`:

```yaml
media_folder: "site/images/uploads"
public_folder: "/images/uploads"
media_library:
  name: uploadcare  # Optional: use external media library
  config:
    publicKey: "your-key"
```

#### 8. Repository Security

**Current:** Repository is public (if on GitHub)

**Considerations:**
- **Public repo**: Anyone can see your content (not necessarily bad)
- **Private repo**: More secure, but requires paid Netlify plan for Git Gateway

**Recommendation:**
- If content is public anyway, public repo is fine
- If you have sensitive content, consider private repo

#### 9. Environment Variables

**Current:** No sensitive data in config (good!)

**Best practices:**
- Never commit API keys or secrets
- Use Netlify environment variables for any future API integrations
- Git Gateway token is managed by Netlify (not exposed)

---

## Action Items Checklist

### Immediate (Required for GDPR)
- [ ] Create privacy policy page (`site/privacy.html`)
- [ ] Add contact email for privacy requests
- [ ] Document user rights (access, deletion)
- [ ] Add cookie notice (if using analytics)

### Recommended (Security)
- [ ] Change Identity registration to "Invite only"
- [ ] Enable MFA for GitHub accounts
- [ ] Enable MFA in Netlify Identity (if using email/password)
- [ ] Set up role-based access control (if multiple editors)
- [ ] Review Identity audit logs monthly
- [ ] Add file upload validation to CMS config

### Optional (Enhanced Security)
- [ ] Protect main branch in GitHub (careful with Git Gateway)
- [ ] Change admin path (security through obscurity)
- [ ] Set up automated security scanning
- [ ] Consider private repository

---

## Quick Privacy Policy Template

Create `site/privacy.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Privacy Policy - Banded Mongoose Research Project</title>
</head>
<body>
  <h1>Privacy Policy</h1>
  
  <h2>1. Data Controller</h2>
  <p>Banded Mongoose Research Project<br>
  Contact: [your-email@example.com]</p>
  
  <h2>2. Data We Collect</h2>
  <p>For CMS editors: Email addresses and authentication data via Netlify Identity.</p>
  
  <h2>3. How We Use Your Data</h2>
  <p>CMS authentication and access control only.</p>
  
  <h2>4. Data Processors</h2>
  <p>We use Netlify (hosting, authentication) and GitHub (content storage). 
  Both are GDPR-compliant.</p>
  
  <h2>5. Your Rights</h2>
  <p>You have the right to access, correct, or delete your data. 
  Contact: [your-email@example.com]</p>
  
  <h2>6. Cookies</h2>
  <p>We use strictly necessary cookies for CMS authentication. 
  No tracking cookies are used.</p>
</body>
</html>
```

---

## Resources

- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Netlify Security & Compliance](https://www.netlify.com/security/)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Decap CMS Security](https://decapcms.org/docs/security/)
