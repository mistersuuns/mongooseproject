# SMTP Setup for Netlify Identity

## Option 1: Gmail SMTP (Not Recommended for Production)

**SMTP server host:**
```
smtp.gmail.com
```

**SMTP server port:**
```
587
```

**Server login username:**
```
mistersuuns@gmail.com
```

**Server login password:**
```
[Gmail App Password - see below]
```

### Getting Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `mistersuuns@gmail.com`
3. Select "Mail" and "Other (Custom name)"
4. Enter "Netlify Identity"
5. Click "Generate"
6. Copy the 16-character password (no spaces)
7. Paste it in "Server login password"

**Note:** Gmail has sending limits (500 emails/day) and may mark transactional emails as spam. Not ideal for production.

---

## Option 2: SendGrid (Recommended - Free Tier)

### Step 1: Create SendGrid Account

1. Go to: https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Verify your email

### Step 2: Create API Key

1. SendGrid Dashboard → **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: "Netlify Identity"
4. Permissions: **Full Access** (or **Mail Send** only)
5. Copy the API key (you'll only see it once)

### Step 3: Verify Sender Domain (Optional but Recommended)

1. SendGrid Dashboard → **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow steps to add DNS records to Porkbun
4. This lets you send from `noreply@mistersuuns.space`

### Step 4: Configure in Netlify

**SMTP server host:**
```
smtp.sendgrid.net
```

**SMTP server port:**
```
587
```

**Server login username:**
```
apikey
```

**Server login password:**
```
[Your SendGrid API key from Step 2]
```

**Sender email address:**
```
noreply@mistersuuns.space
```
(Or use `mistersuuns@gmail.com` if you didn't verify domain)

---

## Option 3: Mailgun (Also Good - Free Tier)

### Step 1: Create Mailgun Account

1. Go to: https://www.mailgun.com
2. Sign up (free tier: 5,000 emails/month)
3. Verify your email

### Step 2: Get SMTP Credentials

1. Mailgun Dashboard → **Sending** → **Domain Settings**
2. Use the default sandbox domain or add your custom domain
3. Go to **SMTP credentials** section
4. Note your SMTP username and password

### Step 3: Configure in Netlify

**SMTP server host:**
```
smtp.mailgun.org
```

**SMTP server port:**
```
587
```

**Server login username:**
```
[Your Mailgun SMTP username]
```

**Server login password:**
```
[Your Mailgun SMTP password]
```

**Sender email address:**
```
noreply@mistersuuns.space
```
(Or use Mailgun's sandbox domain if you didn't add custom domain)

---

## Recommendation

**Use SendGrid or Mailgun** - they're designed for transactional emails, have better deliverability, and won't hit Gmail's limits.

**Quick Start with SendGrid:**
1. Sign up at sendgrid.com
2. Create API key
3. Use settings above
4. Done in 5 minutes
