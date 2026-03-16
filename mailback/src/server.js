import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import net from 'net';
import { promises as dns } from 'dns';
import { connectDB, isDBConnected } from './db.js';
import { Sender } from './models/Sender.js';
import { MailTemplate } from './models/MailTemplate.js';

dotenv.config();
//sdfghjk
const app = express();
const port = Number(process.env.PORT) || 5001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api', async (_req, res, next) => {
  if (isDBConnected()) return next();

  try {
    await connectDB();
    return next();
  } catch (err) {
    return res.status(503).json({
      ok: false,
      message: 'Database connection is not ready. Please retry in a few seconds.'
    });
  }
});

const defaultSmtp = {
  host: process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.DEFAULT_SMTP_PORT) || 587,
  secure: String(process.env.DEFAULT_SMTP_SECURE || 'false') === 'true'
};

const SENDER_RESET_WINDOW_HOURS = 26;
const SENDER_RESET_WINDOW_MS = SENDER_RESET_WINDOW_HOURS * 60 * 60 * 1000;
const VALIDATION_PROGRESS_TTL_MS = 10 * 60 * 1000;
const READ_CACHE_TTL_MS = Number(process.env.READ_CACHE_TTL_MS || 30000);
const validationProgressStore = new Map();
const readCache = {
  senders: null,
  templates: null,
  bootstrap: null
};

function getCachedRead(key) {
  const entry = readCache[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > READ_CACHE_TTL_MS) return null;
  return entry.value;
}

function setCachedRead(key, value) {
  readCache[key] = {
    value,
    timestamp: Date.now()
  };
}

function invalidateReadCache() {
  readCache.senders = null;
  readCache.templates = null;
  readCache.bootstrap = null;
}

async function fetchSendersWithAvailability() {
  const senders = await Sender.find()
    .select('user pass label blastedCount createdAt updatedAt')
    .sort({ createdAt: 1 })
    .lean();

  return senders.map((sender) => {
    const availability = getSenderAvailability(sender);
    return {
      ...sender,
      ...availability,
      limitReached: !availability.canUse
    };
  });
}

async function fetchTemplateArray() {
  const template = await MailTemplate.findOne().lean();
  return template ? [template] : [];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setValidationProgress(progressKey, patch) {
  if (!progressKey) return;
  const prev = validationProgressStore.get(progressKey) || {};
  validationProgressStore.set(progressKey, {
    ...prev,
    ...patch,
    updatedAt: Date.now()
  });
}

function cleanupValidationProgress() {
  const now = Date.now();
  for (const [key, value] of validationProgressStore.entries()) {
    const updatedAt = Number(value?.updatedAt || 0);
    if (now - updatedAt > VALIDATION_PROGRESS_TTL_MS) {
      validationProgressStore.delete(key);
    }
  }
}

function normalizeEmailList(input) {
  if (!Array.isArray(input)) return [];
  return [...new Set(input.map((v) => String(v || '').trim().toLowerCase()).filter(Boolean))];
}

function normalizeValidationEmailInput(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map((v) => String(v || '').trim().toLowerCase()).filter(Boolean))];
  }

  if (typeof input === 'string') {
    return [...new Set(
      input
        .split(/[\n,;]+/)
        .map((v) => String(v || '').trim().toLowerCase())
        .filter(Boolean)
    )];
  }

  return [];
}

const EMAIL_SYNTAX_REGEX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const ROLE_LOCAL_PARTS = new Set([
  'admin', 'administrator', 'support', 'help', 'contact', 'info', 'sales', 'billing',
  'accounts', 'careers', 'career', 'hr', 'jobs', 'team', 'office', 'hello', 'enquiry',
  'inquiry', 'noreply', 'no-reply', 'postmaster', 'webmaster', 'security', 'abuse'
]);
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.com', 'yopmail.com',
  'trashmail.com', 'temp-mail.org', 'dispostable.com', 'getnada.com', 'sharklasers.com'
]);

function extractEmailDomain(email) {
  const parts = String(email || '').toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

async function hasMxRecord(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}

const INVALID_PROBE_HOSTS = new Set(['0.0.0.0', '127.0.0.1', '::1', 'localhost', '.', '::']);

async function getMxHosts(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return (records || [])
      .sort((a, b) => Number(a.priority || 0) - Number(b.priority || 0))
      .map((r) => String(r.exchange || '').trim())
      .filter((h) => h && !INVALID_PROBE_HOSTS.has(h));
  } catch {
    return [];
  }
}

async function hasResolvableDomain(domain) {
  if (!domain) return false;
  const checks = await Promise.allSettled([
    dns.resolve4(domain),
    dns.resolve6(domain),
    dns.resolveNs(domain),
    dns.resolveCname(domain)
  ]);

  return checks.some((result) => result.status === 'fulfilled' && Array.isArray(result.value) && result.value.length > 0);
}

function isDisposableDomain(domain) {
  const d = String(domain || '').toLowerCase();
  if (!d) return false;
  if (DISPOSABLE_DOMAINS.has(d)) return true;
  return d.endsWith('.mailinator.com');
}

function isRoleBasedEmail(email) {
  const localPart = String(email || '').split('@')[0]?.toLowerCase() || '';
  return ROLE_LOCAL_PARTS.has(localPart);
}

const MX_PROVIDER_PATTERNS = [
  [/google\.com$|googlemail\.com$/, 'Google'],
  [/protection\.outlook\.com$|outlook\.com$/, 'Microsoft'],
  [/yahoo\.com$/, 'Yahoo'],
  [/protonmail\.ch$/, 'ProtonMail'],
  [/zoho\.com$/, 'Zoho'],
  [/icloud\.com$/, 'Apple iCloud'],
  [/sendgrid\.net$/, 'SendGrid'],
  [/mailgun\.org$/, 'Mailgun'],
  [/amazonses\.com$/, 'Amazon SES'],
  [/mimecast\.com$/, 'Mimecast'],
  [/pphosted\.com$|ppe-hosted\.com$/, 'Proofpoint'],
  [/messagelabs\.com$/, 'Symantec MessageLabs'],
  [/barracudanetworks\.com$/, 'Barracuda'],
];

function getMxProviderName(mxHosts) {
  for (const host of mxHosts) {
    const h = String(host || '').toLowerCase();
    for (const [pattern, name] of MX_PROVIDER_PATTERNS) {
      if (pattern.test(h)) return name;
    }
  }
  return null;
}

function isServerSideBlockMsg(text) {
  const t = String(text || '').toLowerCase();
  return (
    t.includes('spamhaus') ||
    t.includes('tss09') ||
    t.includes('tss-09') ||
    t.includes('blacklisted') ||
    t.includes('blocklist') ||
    (t.includes('your ip') && (t.includes('block') || t.includes('deni') || t.includes('list'))) ||
    (t.includes('listed') && t.includes('bl.'))
  );
}

function probeMailboxOnHost(mxHost, email) {
  return new Promise((resolve) => {
    let buffer = '';
    let state = 'greeting';
    let closed = false;

    const socket = net.createConnection({ host: mxHost, port: 25 });
    socket.setTimeout(7000);

    const done = (result) => {
      if (closed) return;
      closed = true;
      try {
        socket.end();
        socket.destroy();
      } catch {
        // noop
      }
      resolve(result);
    };

    const send = (line) => socket.write(`${line}\r\n`);

    const onResponse = (code, text) => {
      if (state === 'greeting') {
        if (code !== 220) {
          return done({ ok: false, error: `SMTP greeting failed: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        }
        state = 'ehlo';
        send('EHLO validator.local');
        return;
      }

      if (state === 'ehlo') {
        if (code >= 500) return done({ ok: false, error: `EHLO rejected: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        if (code >= 400) return done({ ok: false, error: `Temporary SMTP failure at EHLO: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        if (code === 250) {
          state = 'mailfrom';
          send('MAIL FROM:<validator@localhost>');
        }
        return;
      }

      if (state === 'mailfrom') {
        if (code >= 500) return done({ ok: false, error: `MAIL FROM rejected: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        if (code >= 400) return done({ ok: false, error: `Temporary SMTP failure at MAIL FROM: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        if (code === 250) {
          state = 'rcpt';
          send(`RCPT TO:<${email}>`);
        }
        return;
      }

      if (state === 'rcpt') {
        send('QUIT');
        if (code === 250 || code === 251) return done({ ok: true, error: null });
        if (code >= 500) return done({ ok: false, error: `Mailbox rejected: ${text}`, serverBlock: isServerSideBlockMsg(text) });
        return done({ ok: false, error: `Temporary SMTP response: ${text}`, serverBlock: isServerSideBlockMsg(text) });
      }
    };

    socket.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';

      lines.forEach((line) => {
        if (closed) return;
        const match = line.match(/^(\d{3})([\s-])(.*)$/);
        if (!match) return;
        const code = Number(match[1]);
        const sep = match[2];
        const text = match[3] || line;
        if (sep === '-') return;
        onResponse(code, text);
      });
    });

    socket.on('timeout', () => done({ ok: false, error: 'SMTP probe timed out.' }));
    socket.on('error', (err) => done({ ok: false, error: `SMTP connection error: ${err.message}` }));
    socket.on('end', () => {
      if (!closed) done({ ok: false, error: 'SMTP server closed connection before RCPT check.' });
    });
  });
}

async function detectCatchAllForDomain(domain) {
  const hosts = await getMxHosts(domain);
  if (!hosts.length) {
    return { checked: false, catchAll: false, reason: `No MX hosts available for ${domain}.` };
  }

  const probeAddress = `krutanic-probe-${Date.now()}-${Math.random().toString(36).slice(2, 10)}@${domain}`;
  let lastError = null;

  for (const host of hosts.slice(0, 2)) {
    const status = await probeMailboxOnHost(host, probeAddress);
    if (status.ok) {
      return {
        checked: true,
        catchAll: true,
        reason: `Domain accepted random mailbox on ${host}.`
      };
    }

    lastError = status.error || 'Catch-all probe failed.';
    if (String(lastError).toLowerCase().includes('mailbox rejected')) {
      return { checked: true, catchAll: false, reason: lastError };
    }
  }

  return { checked: true, catchAll: false, reason: lastError || 'Catch-all probe failed.' };
}

function smtpErrorToMessage(err) {
  if (!err) return 'SMTP validation failed.';
  const code = err.responseCode ? `SMTP ${err.responseCode}: ` : '';
  return `${code}${err.response || err.message || 'SMTP validation failed.'}`;
}

async function smtpVerifyMailboxBatch(_smtpConfig, emails, options = {}) {
  const resultMap = new Map();
  if (!emails.length) return resultMap;

  const concurrency = Math.max(1, Math.min(8, Number(options.concurrency) || 4));
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;

  let cursor = 0;
  let completed = 0;

  async function checkOneEmail(email) {
    const domain = extractEmailDomain(email);
    const hosts = await getMxHosts(domain);
    if (!hosts.length) {
      resultMap.set(email, { ok: false, error: `No MX hosts available for ${domain}.` });
      return;
    }

    let finalStatus = { ok: false, error: 'Mailbox verification failed.' };
    for (const host of hosts.slice(0, 2)) {
      const status = await probeMailboxOnHost(host, email);
      finalStatus = status;
      if (status.ok) break;
      if (String(status.error || '').toLowerCase().includes('mailbox rejected')) break;
      if (status.serverBlock) break;
    }
    resultMap.set(email, finalStatus);
  }

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= emails.length) break;

      const email = emails[index];
      await checkOneEmail(email);
      completed += 1;
      if (onProgress) {
        onProgress(completed, emails.length);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, emails.length) }, () => worker());
  await Promise.all(workers);
  return resultMap;
}

function buildEmailValidationSmtpConfig({ smtpInput, senderFallback }) {
  const host = smtpInput?.host || defaultSmtp.host;
  const port = Number(smtpInput?.port ?? defaultSmtp.port);
  const secure = typeof smtpInput?.secure === 'boolean'
    ? smtpInput.secure
    : (smtpInput?.secure ? String(smtpInput.secure) === 'true' : defaultSmtp.secure);
  const user = smtpInput?.user || senderFallback?.user || '';
  const pass = smtpInput?.pass || senderFallback?.pass || '';

  if (!host || !port || !user || !pass) return null;

  return {
    host,
    port,
    secure,
    user,
    pass
  };
}

function buildTransporterConfig({ host, port, secure, user, pass } = {}) {
  const h = host || defaultSmtp.host;
  const p = port ?? defaultSmtp.port;
  const s = secure ?? defaultSmtp.secure;
  if (!h || !user || !pass) throw new Error('Missing SMTP config: host, user and pass are required.');
  return {
    host: h,
    port: Number(p),
    secure: typeof s === 'boolean' ? s : String(s) === 'true',
    auth: { user, pass }
  };
}

function pickRandomItem(items) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeTemplateBody(input) {
  return String(input || '')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '  ')
    .trim();
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkifyEscapedText(text) {
  return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function buildEmailContent(body) {
  const raw = normalizeTemplateBody(body);
  if (!raw) return { html: '', text: '' };

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    return { html: raw, text: raw.replace(/<[^>]+>/g, ' ') };
  }

  const escaped = escapeHtml(raw);
  const linked = linkifyEscapedText(escaped);
  const paragraphs = linked
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, '<br />'))
    .map((p) => `<p style="margin:0 0 12px;">${p}</p>`)
    .join('');

  return {
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;">${paragraphs}</div>`,
    text: raw
  };
}

// Randomly compose one subject + body from a template's variation arrays.
// Falls back to legacy subject/body strings if the arrays are absent.
function composeFromTemplate(template, fallbackSubject = '', fallbackBody = '') {
  const pick = (arr, fallback = '') =>
    Array.isArray(arr) && arr.length ? pickRandomItem(arr) : fallback;

  const subject = (pick(template?.subjects, String(template?.subject || fallbackSubject))).trim();
  const bodyParagraph = pick(template?.body_paragraphs, String(template?.body || fallbackBody));
  const greeting  = pick(template?.greetings);
  const link      = pick(template?.links, String(template?.link || ''));
  const closing   = pick(template?.closings);
  const signature = pick(template?.signatures);

  const parts = [];
  if (greeting)  parts.push(greeting);
  if (bodyParagraph) parts.push(bodyParagraph);
  if (link) parts.push(link);
  const outro = [closing, signature].filter(Boolean).join('\n');
  if (outro) parts.push(outro);

  return { subject, body: parts.join('\n\n') };
}

function applyTemplateSelection(template, templateSelection = {}) {
  if (!template || typeof template !== 'object') return template;

  const keys = ['subjects', 'greetings', 'body_paragraphs', 'links', 'closings', 'signatures'];
  const out = { ...template };

  keys.forEach((key) => {
    const arr = Array.isArray(template[key]) ? template[key] : [];
    const selected = Array.isArray(templateSelection?.[key])
      ? templateSelection[key]
          .map((v) => Number(v))
          .filter((v) => Number.isInteger(v) && v >= 0 && v < arr.length)
      : null;

    if (selected === null) {
      out[key] = arr;
      return;
    }

    out[key] = selected.map((idx) => arr[idx]);
  });

  return out;
}

async function incrementSenderBlastCounts(countMap) {
  if (!(countMap instanceof Map) || countMap.size === 0) return;

  const now = Date.now();
  const resetBefore = new Date(now - SENDER_RESET_WINDOW_MS);

  const senderIds = [...countMap.entries()]
    .filter(([id, count]) => mongoose.Types.ObjectId.isValid(id) && Number(count) > 0)
    .map(([id]) => id);

  if (senderIds.length) {
    try {
      // Restore daily limit window: if updatedAt is older than configured reset window, reset counter.
      await Sender.updateMany(
        {
          _id: { $in: senderIds },
          updatedAt: { $lt: resetBefore }
        },
        { $set: { blastedCount: 0 } }
      );
    } catch (err) {
      console.error('Failed to restore stale sender counters:', err.message);
    }
  }

  const ops = [...countMap.entries()]
    .filter(([id, count]) => mongoose.Types.ObjectId.isValid(id) && Number(count) > 0)
    .map(([id, count]) => ({
      updateOne: {
        filter: { _id: id },
        update: { $inc: { blastedCount: Number(count) } }
      }
    }));

  if (!ops.length) return;

  try {
    await Sender.bulkWrite(ops, { ordered: false });
    invalidateReadCache();
  } catch (err) {
    console.error('Failed to update sender blastedCount:', err.message);
  }
}

function getConfiguredSenderLimit() {
  const configuredLimit = Number(process.env.SENDER_DAILY_LIMIT || 1900);
  return Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 1900;
}

function getSenderAvailability(sender, now = Date.now()) {
  const resetBeforeMs = now - SENDER_RESET_WINDOW_MS;
  const updatedAtMs = sender?.updatedAt ? new Date(sender.updatedAt).getTime() : NaN;
  const restored = Number.isFinite(updatedAtMs) && updatedAtMs < resetBeforeMs;
  const limit = getConfiguredSenderLimit();
  const used = restored ? 0 : Number(sender?.blastedCount || 0);
  const remaining = Math.max(0, limit - used);
  const canUse = remaining > 0;

  let resetAt = null;
  let resetMsRemaining = 0;
  if (!canUse && Number.isFinite(updatedAtMs)) {
    const resetAtMs = updatedAtMs + SENDER_RESET_WINDOW_MS;
    resetMsRemaining = Math.max(0, resetAtMs - now);
    resetAt = new Date(resetAtMs).toISOString();
  }

  return {
    used,
    limit,
    remaining,
    canUse,
    restored,
    resetAt,
    resetMsRemaining,
    resetWindowHours: SENDER_RESET_WINDOW_HOURS
  };
}

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'mailback',
    message: 'Mailback API is running.',
    health: '/api/health'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mailback', timestamp: new Date().toISOString() });
});

app.get('/api/validate-emails/progress/:key', (req, res) => {
  cleanupValidationProgress();
  const key = String(req.params?.key || '').trim();
  if (!key) return res.status(400).json({ ok: false, message: 'Progress key is required.' });

  const progress = validationProgressStore.get(key);
  if (!progress) {
    return res.status(404).json({ ok: false, message: 'Progress not found or expired.' });
  }

  return res.json({ ok: true, progress });
});

// ── Campaign template (mailtemp) ─────────────────────────────────────────────

app.get('/api/mail-template', async (_req, res) => {
  try {
    const cached = getCachedRead('templates');
    const templates = cached || await fetchTemplateArray();
    if (!cached) setCachedRead('templates', templates);
    const template = templates[0] || null;
    res.json({ ok: true, template: template || null });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.get('/api/mail-templates', async (_req, res) => {
  try {
    const cached = getCachedRead('templates');
    const templates = cached || await fetchTemplateArray();
    if (!cached) setCachedRead('templates', templates);
    res.json({ ok: true, templates });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.get('/api/bootstrap', async (_req, res) => {
  try {
    const cached = getCachedRead('bootstrap');
    if (cached) {
      return res.json({ ok: true, ...cached });
    }

    const [senders, templates] = await Promise.all([
      fetchSendersWithAvailability(),
      fetchTemplateArray()
    ]);

    setCachedRead('senders', senders);
    setCachedRead('templates', templates);
    setCachedRead('bootstrap', { senders, templates });

    res.json({ ok: true, senders, templates });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/mail-template', async (req, res) => {
  try {
    const b = req.body || {};

    const parseLines = (v) =>
      (Array.isArray(v) ? v : String(v || '').split('\n'))
        .map((s) => String(s).trim()).filter(Boolean);

    const parseBlocks = (v) =>
      (Array.isArray(v) ? v : String(v || '').split(/\n---\n/))
        .map((s) => String(s).trim()).filter(Boolean);

    const subjects        = parseLines(b.subjects);
    const greetings       = parseLines(b.greetings);
    const body_paragraphs = parseBlocks(b.body_paragraphs);
    const links           = parseLines(b.links);
    const closings        = parseLines(b.closings);
    const signatures      = parseLines(b.signatures);

    const hasNewFormatInput =
      subjects.length ||
      greetings.length ||
      body_paragraphs.length ||
      links.length ||
      closings.length ||
      signatures.length;

    if (hasNewFormatInput) {
      // Upsert: one document, append new unique items to each array
      const $addToSet = {};
      if (subjects.length)        $addToSet.subjects        = { $each: subjects };
      if (greetings.length)       $addToSet.greetings       = { $each: greetings };
      if (body_paragraphs.length) $addToSet.body_paragraphs = { $each: body_paragraphs };
      if (links.length)           $addToSet.links           = { $each: links };
      if (closings.length)        $addToSet.closings        = { $each: closings };
      if (signatures.length)      $addToSet.signatures      = { $each: signatures };

      const template = await MailTemplate.findOneAndUpdate(
        {},
        { $addToSet },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      invalidateReadCache();
      return res.json({ ok: true, template });
    }

    // legacy plain subject+body — append subject to subjects array, body to body_paragraphs
    const subject  = String(b.subject  || '').trim();
    const bodyText = String(b.body     || '').trim();
    if (!subject && !bodyText) {
      return res.status(400).json({ ok: false, message: 'Add at least one template item before saving.' });
    }

    const legacyAddToSet = {};
    if (subject) legacyAddToSet.subjects = subject;
    if (bodyText) legacyAddToSet.body_paragraphs = bodyText;

    const template = await MailTemplate.findOneAndUpdate(
      {},
      { $addToSet: legacyAddToSet },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    invalidateReadCache();
    res.json({ ok: true, template });
  } catch (err) {
    console.error('Mail template save error:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/mail-template/item/update', async (req, res) => {
  try {
    const allowedFields = new Set(['subjects', 'greetings', 'body_paragraphs', 'links', 'closings', 'signatures']);
    const field = String(req.body?.field || '').trim();
    const index = Number(req.body?.index);
    const value = String(req.body?.value || '').trim();

    if (!allowedFields.has(field)) {
      return res.status(400).json({ ok: false, message: 'Invalid template field.' });
    }
    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({ ok: false, message: 'Invalid item index.' });
    }
    if (!value) {
      return res.status(400).json({ ok: false, message: 'Updated value is required.' });
    }

    const template = await MailTemplate.findOne();
    if (!template) return res.status(404).json({ ok: false, message: 'Template not found.' });

    const items = Array.isArray(template[field]) ? [...template[field]] : [];
    if (index >= items.length) {
      return res.status(400).json({ ok: false, message: 'Item index out of range.' });
    }

    items[index] = value;
    template[field] = items;
    await template.save();
    invalidateReadCache();

    res.json({ ok: true, template: template.toObject ? template.toObject() : template });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/mail-template/item/delete', async (req, res) => {
  try {
    const allowedFields = new Set(['subjects', 'greetings', 'body_paragraphs', 'links', 'closings', 'signatures']);
    const field = String(req.body?.field || '').trim();
    const index = Number(req.body?.index);

    if (!allowedFields.has(field)) {
      return res.status(400).json({ ok: false, message: 'Invalid template field.' });
    }
    if (!Number.isInteger(index) || index < 0) {
      return res.status(400).json({ ok: false, message: 'Invalid item index.' });
    }

    const template = await MailTemplate.findOne();
    if (!template) return res.status(404).json({ ok: false, message: 'Template not found.' });

    const items = Array.isArray(template[field]) ? [...template[field]] : [];
    if (index >= items.length) {
      return res.status(400).json({ ok: false, message: 'Item index out of range.' });
    }

    items.splice(index, 1);
    template[field] = items;
    await template.save();
    invalidateReadCache();

    res.json({ ok: true, template: template.toObject ? template.toObject() : template });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ── Sender CRUD ───────────────────────────────────────────────────────────────

app.get('/api/senders', async (_req, res) => {
  try {
    const cached = getCachedRead('senders');
    const senders = cached || await fetchSendersWithAvailability();
    if (!cached) setCachedRead('senders', senders);
    res.json({ ok: true, senders });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/senders', async (req, res) => {
  try {
    const { user, pass, label } = req.body;
    if (!user || !pass) return res.status(400).json({ ok: false, message: 'user and pass are required.' });
    const sender = await Sender.create({ user: user.trim().toLowerCase(), pass, label: label || '' });
    invalidateReadCache();
    res.json({ ok: true, sender });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ ok: false, message: 'This email is already added.' });
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.delete('/api/senders/:id', async (req, res) => {
  try {
    await Sender.findByIdAndDelete(req.params.id);
    invalidateReadCache();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.put('/api/senders/:id', async (req, res) => {
  try {
    const pass = String(req.body?.pass || '').replace(/\s+/g, '').trim();
    if (!pass) return res.status(400).json({ ok: false, message: 'pass is required.' });

    const sender = await Sender.findByIdAndUpdate(
      req.params.id,
      { $set: { pass } },
      { new: true, runValidators: true }
    ).lean();

    if (!sender) return res.status(404).json({ ok: false, message: 'Sender not found.' });
    invalidateReadCache();
    res.json({ ok: true, sender });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.get('/api/senders/:id/limit', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ ok: false, message: 'Invalid sender id.' });
    }

    let sender = await Sender.findById(req.params.id).lean();
    if (!sender) return res.status(404).json({ ok: false, message: 'Sender not found.' });

    const availability = getSenderAvailability(sender);

    if (availability.restored) {
      await Sender.updateOne({ _id: sender._id }, { $set: { blastedCount: 0 } });
      sender = await Sender.findById(req.params.id).lean();
      invalidateReadCache();
    }

    const currentAvailability = getSenderAvailability(sender);

    res.json({
      ok: true,
      sender: sender.user,
      used: currentAvailability.used,
      limit: currentAvailability.limit,
      remaining: currentAvailability.remaining,
      canUse: currentAvailability.canUse,
      resetAt: currentAvailability.resetAt,
      resetMsRemaining: currentAvailability.resetMsRemaining,
      resetWindowHours: currentAvailability.resetWindowHours,
      updatedAt: sender.updatedAt,
      restored: !!availability.restored,
      note: `Daily limit is restored when updatedAt is older than ${SENDER_RESET_WINDOW_HOURS} hours. Provider-side limits still vary by account.`
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ── Validate senders ──────────────────────────────────────────────────────────

app.post('/api/validate-senders', async (req, res) => {
  try {
    const senders = await Sender.find().lean();
    if (!senders.length) return res.status(400).json({ ok: false, message: 'No senders configured.' });

    const smtpBase = req.body.smtp || defaultSmtp;
    const results = await Promise.allSettled(
      senders.map(async (s) => {
        const cfg = buildTransporterConfig({ ...smtpBase, user: s.user, pass: s.pass });
        const t = nodemailer.createTransport(cfg);
        await t.verify();
        return s.user;
      })
    );

    const report = results.map((r, i) => ({
      user: senders[i].user,
      ok: r.status === 'fulfilled',
      error: r.status === 'rejected' ? r.reason?.message : null
    }));

    res.json({ ok: true, report });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ── Validate email list ───────────────────────────────────────────────────────

app.post('/api/validate-emails', async (req, res) => {
  try {
    const emails = normalizeValidationEmailInput(req.body?.emails);
    const progressKey = String(req.body?.progressKey || '').trim();

    cleanupValidationProgress();

    if (!emails.length) {
      if (progressKey) {
        setValidationProgress(progressKey, {
          key: progressKey,
          stage: 'completed',
          current: 0,
          total: 0,
          done: true,
          error: 'At least one email is required.'
        });
      }
      return res.status(400).json({ ok: false, message: 'At least one email is required.' });
    }

    if (progressKey) {
      setValidationProgress(progressKey, {
        key: progressKey,
        stage: 'upload list',
        current: 0,
        total: emails.length,
        done: false,
        error: null,
        startedAt: Date.now()
      });
    }

    const report = emails.map((email) => ({
      email,
      domain: extractEmailDomain(email),
      syntaxValid: EMAIL_SYNTAX_REGEX.test(email),
      dnsValid: false,
      mxValid: false,
      disposable: false,
      roleBased: false,
      catchAll: false,
      catchAllChecked: false,
      smtpValid: false,
      likelyValid: false,
      mxProvider: null,
      clean: false,
      classification: 'undeliverable',
      rejectionStage: null,
      reason: null
    }));

    const domainDnsCache = new Map();
    const domainMxCache = new Map();
    const domainMxHostsCache = new Map();
    const domainCatchAllCache = new Map();

    setValidationProgress(progressKey, { stage: 'syntax check', current: 0, total: report.length, done: false });
    for (let i = 0; i < report.length; i += 1) {
      const row = report[i];
      if (!row.syntaxValid) {
        row.rejectionStage = 'syntax';
        row.reason = 'Invalid email syntax.';
      }
      setValidationProgress(progressKey, { stage: 'syntax check', current: i + 1, total: report.length, done: false });
    }

    setValidationProgress(progressKey, { stage: 'dns domain check', current: 0, total: report.length, done: false });
    for (let i = 0; i < report.length; i += 1) {
      const row = report[i];
      if (row.syntaxValid) {
        if (!domainDnsCache.has(row.domain)) {
          domainDnsCache.set(row.domain, await hasResolvableDomain(row.domain));
        }
        row.dnsValid = !!domainDnsCache.get(row.domain);
        if (!row.dnsValid) {
          row.rejectionStage = 'dns';
          row.reason = `DNS lookup failed for ${row.domain}.`;
        }
      }
      setValidationProgress(progressKey, { stage: 'dns domain check', current: i + 1, total: report.length, done: false });
    }

    setValidationProgress(progressKey, { stage: 'mx validation', current: 0, total: report.length, done: false });
    for (let i = 0; i < report.length; i += 1) {
      const row = report[i];
      if (row.syntaxValid && row.dnsValid) {
        if (!domainMxCache.has(row.domain)) {
          const mxHosts = await getMxHosts(row.domain);
          domainMxHostsCache.set(row.domain, mxHosts);
          domainMxCache.set(row.domain, mxHosts.length > 0);
        }
        row.mxValid = !!domainMxCache.get(row.domain);
        if (!row.mxValid) {
          row.rejectionStage = 'mx';
          row.reason = `No MX records found for ${row.domain}.`;
        }
      }
      setValidationProgress(progressKey, { stage: 'mx validation', current: i + 1, total: report.length, done: false });
    }

    setValidationProgress(progressKey, { stage: 'disposable filter', current: 0, total: report.length, done: false });
    for (let i = 0; i < report.length; i += 1) {
      const row = report[i];
      if (row.syntaxValid && row.dnsValid && row.mxValid) {
        row.disposable = isDisposableDomain(row.domain);
        if (row.disposable) {
          row.rejectionStage = 'disposable';
          row.reason = 'Disposable domain detected.';
        }
      }
      setValidationProgress(progressKey, { stage: 'disposable filter', current: i + 1, total: report.length, done: false });
    }

    setValidationProgress(progressKey, { stage: 'role email detection', current: 0, total: report.length, done: false });
    for (let i = 0; i < report.length; i += 1) {
      const row = report[i];
      if (row.syntaxValid && row.dnsValid && row.mxValid && !row.disposable) {
        row.roleBased = isRoleBasedEmail(row.email);
      }
      setValidationProgress(progressKey, { stage: 'role email detection', current: i + 1, total: report.length, done: false });
    }

    const catchAllCandidateDomains = [...new Set(
      report
        .filter((row) => row.syntaxValid && row.dnsValid && row.mxValid && !row.disposable)
        .map((row) => row.domain)
    )];

    setValidationProgress(progressKey, {
      stage: 'catch-all detection',
      current: 0,
      total: catchAllCandidateDomains.length,
      done: false
    });
    for (let i = 0; i < catchAllCandidateDomains.length; i += 1) {
      const domain = catchAllCandidateDomains[i];
      if (!domainCatchAllCache.has(domain)) {
        domainCatchAllCache.set(domain, await detectCatchAllForDomain(domain));
      }
      setValidationProgress(progressKey, {
        stage: 'catch-all detection',
        current: i + 1,
        total: catchAllCandidateDomains.length,
        done: false
      });
    }

    report.forEach((row) => {
      const catchAllStatus = domainCatchAllCache.get(row.domain);
      if (!catchAllStatus) return;
      row.catchAllChecked = !!catchAllStatus.checked;
      row.catchAll = !!catchAllStatus.catchAll;
    });

    const smtpCandidates = report
      .filter((row) => row.syntaxValid && row.dnsValid && row.mxValid && !row.disposable)
      .map((row) => row.email);

    let smtpChecked = false;
    let smtpCheckReason = null;

    setValidationProgress(progressKey, {
      stage: 'smtp mailbox verification',
      current: 0,
      total: smtpCandidates.length,
      done: false
    });
    if (smtpCandidates.length > 0) {
      smtpChecked = true;
      const smtpResults = await smtpVerifyMailboxBatch(null, smtpCandidates, {
        concurrency: Number(process.env.VALIDATOR_SMTP_CONCURRENCY || 4),
        onProgress: (current, total) => {
          setValidationProgress(progressKey, {
            stage: 'smtp mailbox verification',
            current,
            total,
            done: false
          });
        }
      });

      report.forEach((row) => {
        if (!smtpCandidates.includes(row.email)) return;
        const smtpStatus = smtpResults.get(row.email) || { ok: false, error: 'SMTP mailbox check failed.' };
        row.smtpValid = !!smtpStatus.ok;
        if (!row.smtpValid) {
          const mxHosts = domainMxHostsCache.get(row.domain) || [];
          const provider = getMxProviderName(mxHosts);
          if (provider || smtpStatus.serverBlock) {
            row.likelyValid = true;
            row.mxProvider = provider || null;
            const parts = [];
            if (smtpStatus.serverBlock) parts.push('probe was server-side blocked');
            if (provider) parts.push(`MX belongs to ${provider}`);
            row.reason = `SMTP inconclusive; ${parts.join('; ')}.`;
          } else {
            row.rejectionStage = 'smtp';
            row.reason = smtpStatus.error || 'SMTP mailbox was rejected.';
          }
        }
      });
    }

    setValidationProgress(progressKey, { stage: 'classification', current: 0, total: report.length, done: false });
    report.forEach((row, idx) => {
      if (!row.syntaxValid) {
        row.classification = 'undeliverable';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (!row.dnsValid) {
        row.classification = 'undeliverable';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (!row.mxValid) {
        row.classification = 'undeliverable';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (row.disposable) {
        row.classification = 'undeliverable';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (!row.smtpValid && !row.likelyValid) {
        row.classification = 'undeliverable';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (row.roleBased || row.catchAll) {
        row.classification = 'risky';
        if (!row.reason) {
          row.reason = row.catchAll
            ? 'Catch-all domain detected.'
            : 'Role-based mailbox detected.';
        }
        if (!row.rejectionStage) {
          row.rejectionStage = row.catchAll ? 'catch-all' : 'role';
        }
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      if (!row.smtpValid && row.likelyValid) {
        row.classification = 'likely_valid';
        setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
        return;
      }
      row.classification = 'deliverable';
      row.clean = true;
      row.reason = null;
      row.rejectionStage = null;
      setValidationProgress(progressKey, { stage: 'classification', current: idx + 1, total: report.length, done: false });
    });

    const cleanEmails = report
      .filter((row) => row.classification === 'deliverable')
      .map((row) => row.email);

    const likelyValidEmails = report
      .filter((row) => row.classification === 'likely_valid')
      .map((row) => ({ email: row.email, mxProvider: row.mxProvider, reason: row.reason }));

    const rejected = report
      .filter((row) => row.classification !== 'deliverable' && row.classification !== 'likely_valid')
      .map((row) => ({
        email: row.email,
        stage: row.rejectionStage || 'unknown',
        classification: row.classification,
        reason: row.reason || 'Validation failed.'
      }));

    setValidationProgress(progressKey, {
      stage: 'completed',
      current: report.length,
      total: report.length,
      done: true,
      error: null,
      completedAt: Date.now()
    });

    return res.json({
      ok: true,
      summary: {
        total: report.length,
        syntaxValid: report.filter((row) => row.syntaxValid).length,
        dnsValid: report.filter((row) => row.dnsValid).length,
        mxValid: report.filter((row) => row.mxValid).length,
        disposable: report.filter((row) => row.disposable).length,
        roleBased: report.filter((row) => row.roleBased).length,
        catchAll: report.filter((row) => row.catchAll).length,
        smtpChecked,
        smtpCandidates: smtpCandidates.length,
        smtpValid: report.filter((row) => row.smtpValid).length,
        likelyValid: likelyValidEmails.length,
        clean: cleanEmails.length,
        deliverable: report.filter((row) => row.classification === 'deliverable').length,
        risky: report.filter((row) => row.classification === 'risky').length,
        undeliverable: report.filter((row) => row.classification === 'undeliverable').length
      },
      smtp: {
        enabled: smtpChecked,
        reason: smtpCheckReason
      },
      cleanEmails,
      likelyValidEmails,
      rejected,
      report
    });
  } catch (err) {
    const progressKey = String(req.body?.progressKey || '').trim();
    setValidationProgress(progressKey, {
      stage: 'failed',
      done: true,
      error: err.message,
      completedAt: Date.now()
    });
    return res.status(500).json({ ok: false, message: err.message });
  }
});

// ── Blast ─────────────────────────────────────────────────────────────────────

app.post('/api/blast', async (req, res) => {
  const startedAt = Date.now();
  try {
    const senderIdsProvided = Array.isArray(req.body.senderIds);
    const senderIds = senderIdsProvided
      ? req.body.senderIds.filter((id) => mongoose.Types.ObjectId.isValid(id))
      : [];

    if (senderIdsProvided && !senderIds.length) {
      return res.status(400).json({ ok: false, message: 'Select at least one sender account.' });
    }

    const senders = senderIdsProvided
      ? await Sender.find({ _id: { $in: senderIds } }).lean()
      : await Sender.find().lean();

    if (!senders.length) return res.status(400).json({ ok: false, message: 'No sender accounts configured. Add senders first.' });

    const availableSenders = senders.filter((sender) => getSenderAvailability(sender).canUse);
    if (!availableSenders.length) {
      return res.status(400).json({
        ok: false,
        message: `All selected sender accounts have reached the ${getConfiguredSenderLimit()} mail daily limit.`
      });
    }

    const smtpBase = req.body.smtp || defaultSmtp;
    // Always load the single mailtemp document; no templateId selection needed
    const baseTemplate = await MailTemplate.findOne().lean();
    if (!baseTemplate) {
      return res.status(400).json({ ok: false, message: 'No campaign template found. Add one first.' });
    }

    const template = applyTemplateSelection(baseTemplate, req.body.templateSelection || {});

    const recipients = normalizeEmailList(req.body.recipients);
    if (!recipients.length) return res.status(400).json({ ok: false, message: 'At least one recipient is required.' });

    const singleShotBcc = req.body.singleShotBcc !== false;
    if (singleShotBcc) {
      if (!availableSenders.length) return res.status(400).json({ ok: false, message: 'No sender account available.' });

      // Quick sanity check before starting
      const testCompose = composeFromTemplate(template);
      if (!testCompose.subject || !testCompose.body) {
        return res.status(400).json({ ok: false, message: 'Template is missing subjects or body paragraphs.' });
      }

      // Cache transporters per sender index to avoid recreating on every batch
      const transporterCache = availableSenders.map((s) =>
        nodemailer.createTransport(buildTransporterConfig({ ...smtpBase, user: s.user, pass: s.pass }))
      );

      const bccBatchSize = Math.max(1, Math.min(200, Number(req.body.bccBatchSize) || 90));
      const bccDelayMs = Math.max(0, Number(req.body.bccDelayMs) || Number(req.body.delayMs) || 400);
      const success = [];
      const bounced = [];
      const inboxFull = [];
      const failed = [];
      const transport = [];
      const sentBySenderId = new Map();

      function isInboxFullError(msg) {
        const m = String(msg || '').toLowerCase();
        return (
          m.includes('552') ||
          m.includes('over quota') ||
          m.includes('over the quota') ||
          m.includes('mailbox full') ||
          m.includes('mailbox is full') ||
          m.includes('quota exceeded') ||
          m.includes('storage limit') ||
          m.includes('user is over disk quota') ||
          m.includes('insufficient system storage') ||
          m.includes('exceeded storage allocation')
        );
      }

      try {
        for (let i = 0; i < recipients.length; i += bccBatchSize) {
          const batch = recipients.slice(i, i + bccBatchSize);
          const batchIndex = Math.floor(i / bccBatchSize);
          const batchSender = availableSenders[batchIndex % availableSenders.length];
          const batchTransporter = transporterCache[batchIndex % availableSenders.length];

          // Recompose per batch: each batch gets a fresh random subject/greeting/body/closing/signature
          const composed = composeFromTemplate(template);
          const content = buildEmailContent(composed.body);

          try {
            const r = await batchTransporter.sendMail({
              from: `${batchSender.user} <${batchSender.user}>`,
              to: 'undisclosed-recipients:;',
              bcc: batch,
              subject: composed.subject,
              html: content.html,
              text: content.text
            });

            const acceptedSet = new Set(
              [...(r.accepted || []), ...(Array.isArray(r.envelope?.to) ? r.envelope.to : [])]
                .map((v) => String(v).toLowerCase())
            );
            const rejectedSet = new Set((r.rejected || []).map((v) => String(v).toLowerCase()));
            const pendingSet = new Set((r.pending || []).map((v) => String(v).toLowerCase()));

            const rejectedErrorMap = new Map();
            (r.rejectedErrors || []).forEach((entry) => {
              const key = String(entry?.recipient || entry?.address || '').toLowerCase();
              if (!key) return;
              rejectedErrorMap.set(key, entry?.response || entry?.message || 'Recipient rejected by SMTP server.');
            });

            batch.forEach((to) => {
              const normalized = String(to).toLowerCase();
              if (acceptedSet.has(normalized) && !rejectedSet.has(normalized)) {
                success.push({
                  to,
                  sender: `${batchSender.user} <${batchSender.user}>`,
                  messageId: r.messageId,
                  templateId: template?._id?.toString() || null,
                  subject: composed.subject
                });
                const senderId = String(batchSender._id);
                sentBySenderId.set(senderId, (sentBySenderId.get(senderId) || 0) + 1);
                return;
              }

              if (rejectedSet.has(normalized)) {
                const errMsg = rejectedErrorMap.get(normalized) || 'Recipient rejected by SMTP server.';
                if (isInboxFullError(errMsg)) {
                  inboxFull.push({ to, error: errMsg });
                } else {
                  bounced.push({ to, error: errMsg });
                }
                return;
              }

              if (pendingSet.has(normalized)) {
                failed.push({ to, error: 'Recipient delivery is pending.' });
                return;
              }

              failed.push({ to, error: 'SMTP server did not confirm acceptance for this recipient.' });
            });

            transport.push({
              batch: batchIndex + 1,
              sender: batchSender.user,
              accepted: r.accepted || [],
              rejected: r.rejected || [],
              pending: r.pending || [],
              response: r.response || null
            });
          } catch (batchErr) {
            batch.forEach((to) => {
              failed.push({ to, error: batchErr.message || 'Unknown failure' });
            });
          }

          if (i + bccBatchSize < recipients.length && bccDelayMs > 0) await sleep(bccDelayMs);
        }

        await incrementSenderBlastCounts(sentBySenderId);

        return res.json({
          ok: true,
          mode: 'single-bcc',
          summary: {
            total: recipients.length,
            sent: success.length,
            bounced: bounced.length,
            inboxFull: inboxFull.length,
            failed: failed.length,
            durationMs: Date.now() - startedAt,
            bccBatchSize,
            batches: Math.ceil(recipients.length / bccBatchSize)
          },
          success,
          bounced,
          inboxFull,
          failed,
          transport
        });
      } catch (err) {
        return res.status(500).json({
          ok: false,
          mode: 'single-bcc',
          message: err.message,
          summary: {
            total: recipients.length,
            sent: 0,
            bounced: 0,
            inboxFull: 0,
            failed: recipients.length,
            durationMs: Date.now() - startedAt
          },
          success: [],
          bounced: [],
          inboxFull: [],
          failed: recipients.map((to) => ({ to, error: err.message || 'Unknown failure' }))
        });
      }
    }

    const batchSize = Math.max(1, Number(req.body.batchSize) || 20);
    const delayMs = Math.max(0, Number(req.body.delayMs) || 500);
    const chunkSize = Math.ceil(recipients.length / senders.length);

    const jobs = senders
      .map((s, idx) => ({
        senderId: String(s._id),
        transporter: nodemailer.createTransport(buildTransporterConfig({ ...smtpBase, user: s.user, pass: s.pass })),
        from: `${s.user} <${s.user}>`,
        chunk: recipients.slice(idx * chunkSize, (idx + 1) * chunkSize)
      }))
      .filter((j) => j.chunk.length > 0);

    const success = [];
    const failed = [];
    const sentBySenderId = new Map();

    for (const job of jobs) {
      for (let i = 0; i < job.chunk.length; i += batchSize) {
        const batch = job.chunk.slice(i, i + batchSize);
        const composed = composeFromTemplate(template);
        const content = buildEmailContent(composed.body);

        if (!composed.subject || (!content.html && !content.text)) {
          failed.push(...batch.map((to) => ({ to, error: 'Template subject/body is missing.' })));
          continue;
        }

        const results = await Promise.allSettled(
          batch.map(async (to) => {
            const r = await job.transporter.sendMail({ from: job.from, to, subject: composed.subject, html: content.html, text: content.text });
            return { to, sender: job.from, messageId: r.messageId, templateId: template?._id?.toString() || null, subject: composed.subject };
          })
        );
        results.forEach((r, i2) => {
          if (r.status === 'fulfilled') {
            success.push(r.value);
            sentBySenderId.set(job.senderId, (sentBySenderId.get(job.senderId) || 0) + 1);
          }
          else failed.push({ to: batch[i2], error: r.reason?.message || 'Unknown failure' });
        });
        if (i + batchSize < job.chunk.length && delayMs > 0) await sleep(delayMs);
      }
    }

    await incrementSenderBlastCounts(sentBySenderId);

    return res.json({
      ok: true,
      summary: { total: recipients.length, sent: success.length, failed: failed.length, durationMs: Date.now() - startedAt },
      success,
      failed
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

// Connect to DB. In serverless environments each cold start reconnects;
// connectDB de-duplicates concurrent attempts using an internal promise.
if (process.env.VERCEL === '1') {
  connectDB().catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
} else {
  connectDB()
    .then(() => {
      app.listen(port, () => console.log(`mailback listening on http://localhost:${port}`));
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

export default app;
