# mailback

Backend API for the mail blasting service.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill SMTP defaults (optional but helpful).
3. Install dependencies:
   - `npm install`
4. Start server:
   - `npm run dev`

Server runs on `http://localhost:5001` by default.

## API

### `GET /api/health`
Returns service health.

### `POST /api/validate-smtp`
Validates SMTP credentials.

Request body:

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your@email.com",
    "pass": "app_password"
  }
}
```

### `POST /api/blast`
Sends one email campaign to many recipients.

Request body:

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your@email.com",
    "pass": "app_password"
  },
  "fromName": "Mail Blaster",
  "fromEmail": "your@email.com",
  "subject": "Campaign Subject",
  "html": "<h1>Hello</h1><p>Message body</p>",
  "recipients": ["a@example.com", "b@example.com"],
  "singleShotBcc": true,
  "bccBatchSize": 90,
  "bccDelayMs": 400,
  "batchSize": 20,
  "delayMs": 500
}
```

Notes:
- When `singleShotBcc` is `true`, the server now splits recipients into multiple BCC batches (default `90`) to avoid SMTP per-message recipient limits.
- Use `bccBatchSize` and `bccDelayMs` to tune delivery behavior for your provider limits.

## Deliverability

This app already sends mail with the authenticated sender address in the `From` header, which is required for SPF/DKIM/DMARC alignment.

To reduce spam placement, configure these DNS records on your sending domain.

### SPF

If you send through Google Workspace / Gmail SMTP:

```txt
Host: @
Type: TXT
Value: v=spf1 include:_spf.google.com ~all
```

If you send through multiple providers, include all of them in one SPF record.

### DKIM

Enable DKIM in your mail provider admin panel and publish the selector record it gives you.

For Google Workspace this is usually a TXT record like:

```txt
Host: google._domainkey
Type: TXT
Value: v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY
```

### DMARC

Start with quarantine mode, then move to reject after verifying reports.

```txt
Host: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; adkim=s; aspf=s; pct=100; rua=mailto:dmarc@krutanic.org; ruf=mailto:dmarc@krutanic.org; fo=1
```

Recommended rollout:
- Start with `p=none` for 2 to 3 days if you want to monitor first.
- Move to `p=quarantine` once SPF and DKIM pass consistently.
- Move to `p=reject` after validation.

Important:
- Use sender accounts from the same domain you are authenticating for.
- Do not send `From: krutanic.org` using an unrelated personal SMTP account.
- Keep SPF, DKIM, and DMARC aligned to the same domain.
