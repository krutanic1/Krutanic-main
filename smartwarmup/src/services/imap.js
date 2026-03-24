const Imap = require('imap');
const { simpleParser } = require('mailparser');

/**
 * Fetch unread emails from INBOX
 * @param {Object} config IMAP configuration
 */
const fetchUnreadEmails = (config) => {
  return new Promise((resolve, reject) => {
    const rawHost = String(config.host || process.env.DEFAULT_IMAP_HOST || 'imap.gmail.com').trim();
    const rawPort = parseInt(config.port) || parseInt(process.env.DEFAULT_IMAP_PORT) || 993;

    const isLocal = rawHost === 'localhost' || rawHost === '127.0.0.1' || rawHost === '0.0.0.0' || rawHost === '::1';
    const host = isLocal ? 'imap.gmail.com' : rawHost;
    const port = isLocal ? 993 : rawPort;

    const imap = new Imap({
      user: config.user,
      password: config.pass,
      host: host,
      port: port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => { // false = read-write (to mark as read)
        if (err) {
          imap.end();
          return reject(err);
        }

        imap.search(['UNSEEN'], (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          if (!results || !results.length) {
            imap.end();
            return resolve([]);
          }

          const f = imap.fetch(results, {
            bodies: '',
            markSeen: true // Mark as read
          });

          f.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) return;
                emails.push({
                  from: parsed.from.value[0].address,
                  subject: parsed.subject,
                  text: parsed.text,
                  date: parsed.date,
                  messageId: parsed.messageId
                });
              });
            });
          });

          f.once('error', (err) => {
            console.error('Fetch error:', err);
          });

          f.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      resolve(emails);
    });

    imap.connect();
  });
};

module.exports = { fetchUnreadEmails };
