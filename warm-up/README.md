# 🚀 Emergency Email Warm-up & Deliverability Tool

This project is designed to rescue your emails from SPAM folders and build sender reputation within 24 hours.

## 🛠 Setup Instructions

### 1. DNS Fix (Priority #1)
Run the audit tool to see what's broken:
```bash
npm run audit
```
**Required Records for krutanic.info:**
- **SPF (TXT)**: `v=spf1 include:_spf.google.com ~all`
- **DMARC (TXT)**: `v=DMARC1; p=quarantine; adkim=r; aspf=r;`

### 2. Configure Seed Accounts
Open `seeds.json` and add your 50 accounts. 
**Format:**
```json
[
  {
    "user": "your-test-email@gmail.com",
    "pass": "your-app-password",
    "host": "imap.gmail.com",
    "port": 993,
    "tls": true
  }
]
```
*Note: For Gmail seeds, you MUST use an "App Password".*

### 3. Run the Engagement Bot
This script will send an email to each seed, wait for it to arrive, and then log into the seed account to move it from **SPAM to INBOX**.
```bash
npm run engage
```

## 📈 Why this works
By moving emails from Spam to Inbox and marking them as "Read", you are sending a strong positive signal to ISPs (Google/Microsoft) that your mail is NOT spam. Doing this with 50 accounts over 24 hours can rapidly stabilize your deliverability.
