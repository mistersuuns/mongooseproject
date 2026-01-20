# Answers to Your Questions

## 1. GDPR Compliance & Security - Current Site Status

### ✅ GDPR Cookie Compliance: **YES**

**Current cookie usage:**
- **Netlify Identity JWT tokens** (localStorage/cookies)
  - **Type**: "Strictly necessary" cookies
  - **Purpose**: CMS authentication only
  - **GDPR Status**: ✅ **EXEMPT from consent** (Article 5(3) ePrivacy Directive)
  - **No tracking cookies**: ✅ No analytics, no third-party tracking

**Conclusion**: Your site's cookie storage is **GDPR compliant**. Strictly necessary cookies (authentication) don't require consent banners.

### ⚠️ Missing: Privacy Policy

**Required for GDPR:**
- ❌ No privacy policy page on site
- **Action needed**: Create `site/privacy.html` explaining:
  - Data collection (CMS editor emails via Netlify Identity)
  - Data processors (Netlify, GitHub)
  - User rights (access, deletion, portability)

### ✅ Security: **SECURE**

**Current security:**
- ✅ HTTPS (automatic via Netlify)
- ✅ Git Gateway (no exposed GitHub tokens)
- ✅ JWT authentication (secure)
- ✅ Identity widget (secure OAuth flow)
- ✅ Static site (no server vulnerabilities)

**Recommendation:**
- ⚠️ Change registration from "Open" to "Invite only" in Netlify Identity settings

---

## 2. framer2bob Tool Status

### Current Location
`/Users/robertturner/local-only/framer-to-github/`

### What Exists
- ✅ `download-site.sh` - Downloads Framer sites
- ✅ `scripts/extract-cms-data.js` - Basic extraction (needs update)
- ✅ `scripts/convert-json-to-markdown.js` - Converts to Markdown
- ✅ `site/admin/` - Decap CMS setup
- ✅ `README.md` - Basic documentation

### What Needs Updating

**The extraction script is outdated:**
- Currently uses basic HTML parsing (like the old version)
- **Should use**: Framer searchIndex JSON method (like we did for mongooseproject)
- **Missing**: The improved extraction logic that downloads searchIndex JSON

**Action needed:**
1. Update `scripts/extract-cms-data.js` to use searchIndex method
2. Add automatic searchIndex URL detection
3. Update README with new extraction method

### Next Steps for framer2bob

1. **Update extraction script** with searchIndex method
2. **Add auto-detection** of searchIndex URL from Framer HTML
3. **Test** with a different Framer site
4. **Document** the improved workflow

---

## Summary

**GDPR**: ✅ Cookie storage compliant | ❌ Privacy policy missing
**Security**: ✅ Secure | ⚠️ Should use "Invite only" registration
**framer2bob**: ✅ Exists | ⚠️ Needs updated extraction script
