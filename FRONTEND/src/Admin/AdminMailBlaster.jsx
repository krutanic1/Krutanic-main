import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const W = { width: '100%', padding: 6, boxSizing: 'border-box' };
const td1 = { padding: '5px 8px 5px 0', width: 110, verticalAlign: 'top' };

function formatAppPassword(value) {
  const raw = String(value || '').replace(/\s+/g, '');
  return raw.match(/.{1,4}/g)?.join(' ') || '';
}

function isInvalidAppPasswordError(message) {
  const m = String(message || '').toLowerCase();
  return (
    m.includes('invalid login') ||
    m.includes('username and password not accepted') ||
    m.includes('application-specific password required') ||
    m.includes('authentication failed') ||
    m.includes('bad credentials') ||
    m.includes(' 534') ||
    m.includes(' 535')
  );
}

async function apiFetch(path, opts = {}) {
  const r = await fetch(API + path, opts);
  return r.json();
}

function AdminMailBlaster() {
  // stored senders (from DB)
  const [senders, setSenders] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [addError, setAddError] = useState('');
  const [editPassById, setEditPassById] = useState({});
  const [selectedById, setSelectedById] = useState({});
  const [updateError, setUpdateError] = useState('');
  const [limitById, setLimitById] = useState({});

  // campaign
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [templateGreetings, setTemplateGreetings] = useState('');
  const [templateClosings, setTemplateClosings] = useState('');
  const [templateSignatures, setTemplateSignatures] = useState('');
  const [recipients, setRecipients] = useState('');
  const [blastSize, setBlastSize] = useState(90);

  // ui
  const [status, setStatus] = useState('');
  const [validateReport, setValidateReport] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [templateStatus, setTemplateStatus] = useState('');
  const [templateError, setTemplateError] = useState('');

  const recipientList = () => [...new Set(recipients.split(/[\n,]/).map(s => s.trim()).filter(Boolean))];
  const recCount = recipientList().length;
  const selectedSenderIds = senders.filter((s) => selectedById[s._id]).map((s) => s._id);
  const activeSenderCount = selectedSenderIds.length;
  const perSender = activeSenderCount ? Math.ceil(recCount / activeSenderCount) : 0;

  const selectedTemplate = templates.find((template) => template._id === selectedTemplateId) || null;

  // load senders on mount
  useEffect(() => {
    loadSenders();
    loadTemplates();
  }, []);

  async function loadSenders() {
    const d = await apiFetch('/api/senders');
    if (d.ok) {
      setSenders(d.senders);
      setEditPassById(Object.fromEntries(d.senders.map((s) => [s._id, formatAppPassword(s.pass || '')])));
      setSelectedById((prev) => Object.fromEntries(d.senders.map((s) => [s._id, prev[s._id] ?? true])));
    }
  }

  async function loadTemplates() {
    const d = await apiFetch('/api/mail-templates');
    if (d.ok) {
      setTemplates(d.templates || []);
      setSelectedTemplateId((prev) => {
        if (prev && d.templates.some((template) => template._id === prev)) return prev;
        return d.templates[0]?._id || '';
      });
    }
  }

  async function addSender(e) {
    e.preventDefault();
    setAddError('');
    try {
      const d = await apiFetch('/api/senders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newUser, pass: newPass.replace(/\s+/g, '') })
      });
      if (!d.ok) { setAddError(d.message || 'Failed to add sender.'); return; }
      await loadSenders();
      setNewUser('');
      setNewPass('');
    } catch {
      setAddError('Unable to connect to server.');
    }
  }

  async function deleteSender(id) {
    await apiFetch(`/api/senders/${id}`, { method: 'DELETE' });
    setSenders(prev => prev.filter(s => s._id !== id));
    setEditPassById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setValidateReport(null);
  }

  async function updateSenderPass(id) {
    setUpdateError('');
    const pass = (editPassById[id] || '').replace(/\s+/g, '');
    if (!pass) {
      setUpdateError('Password cannot be empty.');
      return;
    }

    const d = await apiFetch(`/api/senders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pass })
    });

    if (!d.ok) {
      setUpdateError(d.message || 'Failed to update password.');
      return;
    }

    await loadSenders();
  }

  async function checkLimit(id) {
    const d = await apiFetch(`/api/senders/${id}/limit`);
    if (!d.ok) {
      setLimitById((prev) => ({ ...prev, [id]: { error: d.message || 'Failed to fetch limit.' } }));
      return;
    }
    setLimitById((prev) => ({
      ...prev,
      [id]: {
        used: d.used,
        limit: d.limit,
        remaining: d.remaining,
        note: d.note
      }
    }));
  }

  async function validateAll() {
    setBusy('validate'); setValidateReport(null); setResult(null); setStatus('');
    const d = await apiFetch('/api/validate-senders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    setValidateReport(d.report || []);
    setBusy('');
  }

  async function blast(e) {
    e.preventDefault();
    setBusy('blast'); setStatus('Sending…'); setResult(null); setValidateReport(null);
    const d = await apiFetch('/api/blast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipients: recipientList(),
        senderIds: selectedSenderIds,
        singleShotBcc: true,
        bccBatchSize: Math.max(1, Number(blastSize) || 90)
      })
    });
    setResult(d); setStatus(''); setBusy('');
  }

  async function saveCampaignTemplate(e) {
    e.preventDefault();
    setTemplateStatus('');
    setTemplateError('');

    const parseLines = (v) => v.split('\n').map(s => s.trim()).filter(Boolean);
    const parseBlocks = (v) => v.split(/\n---\n/).map(s => s.trim()).filter(Boolean);

    const d = await apiFetch('/api/mail-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjects:        parseLines(subject),
        greetings:       parseLines(templateGreetings),
        body_paragraphs: parseBlocks(message),
        closings:        parseLines(templateClosings),
        signatures:      parseLines(templateSignatures)
      })
    });

    if (!d.ok) {
      setTemplateError(d.message || 'Failed to save campaign.');
      return;
    }

    setTemplateStatus('✓ Appended to mailtemp document.');
    await loadTemplates();
    setSubject('');
    setMessage('');
    setTemplateGreetings('');
    setTemplateClosings('');
    setTemplateSignatures('');
    setTimeout(() => setTemplateStatus(''), 3000);
  }

  async function editTemplateItem(field, index, currentValue) {
    const value = window.prompt(`Edit ${field} item`, currentValue);
    if (value === null) return;

    const d = await apiFetch('/api/mail-template/item/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, index, value })
    });

    if (!d.ok) {
      setTemplateError(d.message || 'Failed to update template item.');
      return;
    }

    setTemplateError('');
    setTemplateStatus('✓ Template item updated.');
    await loadTemplates();
    setTimeout(() => setTemplateStatus(''), 2000);
  }

  async function deleteTemplateItem(field, index) {
    const confirmed = window.confirm(`Delete item #${index + 1} from ${field}?`);
    if (!confirmed) return;

    const d = await apiFetch('/api/mail-template/item/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, index })
    });

    if (!d.ok) {
      setTemplateError(d.message || 'Failed to delete template item.');
      return;
    }

    setTemplateError('');
    setTemplateStatus('✓ Template item deleted.');
    await loadTemplates();
    setTimeout(() => setTemplateStatus(''), 2000);
  }

  return (
    <div id="AdminAddCourse" className="mailblaster-admin">
      <style>{`
        .mailblaster-admin {
          padding-top: 72px;
          padding-right: 16px;
          padding-bottom: 20px;
        }
        .mailblaster-admin .app-shell {
          max-width: 100%;
        }
        .mailblaster-admin .section-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }
        .mailblaster-admin .sender-layout {
          grid-template-columns: 260px 1fr;
        }
        .mailblaster-admin button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #111827;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          white-space: nowrap;
        }
        .mailblaster-admin button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .mailblaster-admin input,
        .mailblaster-admin textarea,
        .mailblaster-admin select {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: #fff;
        }
        @media (max-width: 1100px) {
          .mailblaster-admin .sender-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="app-shell" style={{ padding: 16 }}>
      <h2>Mail Blaster</h2>

      <div className="sender-layout" style={{ display: 'grid', gap: 20, alignItems: 'start' }}>
        {/* Left panel: add sender */}
        <aside className="sender-sidebar section-card" style={{ padding: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>Add Sender</h3>
          <form onSubmit={addSender} style={{ display: 'grid', gap: 8 }}>
            <input
              value={newUser}
              onChange={e => setNewUser(e.target.value)}
              placeholder="email@gmail.com"
              required
              style={{ padding: 8 }}
            />
            <input
              type="text"
              value={newPass}
              onChange={e => setNewPass(formatAppPassword(e.target.value))}
              required
              style={{ padding: 8 }}
            />
            <button type="submit" style={{ padding: '8px 12px' }}>+ Add</button>
            {senders.length > 0 && (
              <button type="button" onClick={validateAll} disabled={busy === 'validate'} style={{ padding: '8px 12px' }}>
                {busy === 'validate' ? 'Validating…' : 'Validate All'}
              </button>
            )}
          </form>
          {addError && <p style={{ color: 'red', margin: '8px 0 0' }}>{addError}</p>}
        </aside>

        {/* Right panel: sender emails from DB */}
        <section className="section-card" style={{ padding: 16 }}>
          <h3>
            Sender Accounts
            <span style={{ fontWeight: 'normal', fontSize: 13 }}>
              {' '}({senders.length} account{senders.length !== 1 ? 's' : ''}
              {recCount > 0 && activeSenderCount > 0 ? `, ~${perSender} mails each` : ''})
            </span>
          </h3>

          {senders.length === 0 && (
            <p style={{ marginTop: 0, color: '#666' }}>No sender emails yet. Add one from the left panel.</p>
          )}

          {senders.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>#</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Use</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Email</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Blasted</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>App Password</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 0' }}>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {senders.map((s, i) => {
                  const rep = validateReport?.find(r => r.user === s.user);
                  return (
                    <tr key={s._id}>
                      <td style={{ padding: '4px 8px 4px 0', color: '#888', width: 24 }}>{i + 1}</td>
                      <td style={{ padding: '4px 8px 4px 0' }}>
                        <input
                          type="checkbox"
                          checked={!!selectedById[s._id]}
                          onChange={(e) => setSelectedById((prev) => ({ ...prev, [s._id]: e.target.checked }))}
                        />
                      </td>
                      <td style={{ padding: '4px 8px 4px 0' }}>{s.user}</td>
                      <td style={{ padding: '4px 8px 4px 0', color: '#374151', fontWeight: 600 }}>{Number(s.blastedCount || 0)}</td>
                      <td style={{ padding: '4px 8px 4px 0' }}>
                        <input
                          type="text"
                          value={editPassById[s._id] || ''}
                          onChange={(e) => setEditPassById((prev) => ({ ...prev, [s._id]: formatAppPassword(e.target.value) }))}
                          style={{ padding: 6, width: '100%', boxSizing: 'border-box' }}
                        />
                      </td>
                      <td style={{ padding: '4px 0', fontSize: 13 }}>
                        {rep
                          ? (rep.ok
                            ? <span style={{ color: 'green' }}>OK</span>
                            : <span style={{ color: 'red' }}>{isInvalidAppPasswordError(rep.error) ? 'Invalid' : 'Failed'}</span>)
                          : null}
                      </td>
                      <td style={{ paddingLeft: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                          <button type="button" onClick={() => updateSenderPass(s._id)}>Update</button>
                          <button type="button" onClick={() => checkLimit(s._id)}>Check Limit</button>
                          <button type="button" onClick={() => deleteSender(s._id)}>Delete</button>
                        </div>
                        {limitById[s._id]?.error && (
                          <div style={{ marginTop: 4, color: '#b91c1c', fontSize: 12 }}>{limitById[s._id].error}</div>
                        )}
                        {limitById[s._id]?.limit && !limitById[s._id]?.error && (
                          <div style={{ marginTop: 4, color: '#4b5563', fontSize: 12 }}>
                            Used {limitById[s._id].used} / {limitById[s._id].limit} • Remaining {limitById[s._id].remaining}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {updateError && <p style={{ color: 'red', marginTop: 6 }}>{updateError}</p>}
        </section>
      </div>

      {/* ── Campaign ── */}
      <form onSubmit={blast} className="section-card campaign-section" style={{ padding: 16 }}>
        <h3>Campaign</h3>
        <table className="form-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={td1}>Template</td>
              <td>
                {templates.length === 0
                  ? <p style={{ margin: 0, color: '#e00', fontSize: 13 }}>No template found — add one below before blasting.</p>
                  : <div style={{ fontSize: 13, color: '#444' }}>
                      ✓ Campaign template loaded &nbsp;·&nbsp;
                      <span>{templates[0]?.subjects?.length || 0} subjects</span> &nbsp;·&nbsp;
                      <span>{templates[0]?.greetings?.length || 0} greetings</span> &nbsp;·&nbsp;
                      <span>{templates[0]?.body_paragraphs?.length || 0} paragraphs</span> &nbsp;·&nbsp;
                      <span>{templates[0]?.closings?.length || 0} closings</span> &nbsp;·&nbsp;
                      <span>{templates[0]?.signatures?.length || 0} signatures</span>
                      <div style={{ color: '#888', marginTop: 3 }}>Each batch gets a fresh random combination.</div>
                    </div>
                }
              </td>
            </tr>
            <tr>
              <td style={td1}>Recipients</td>
              <td>
                <textarea rows={6} value={recipients} onChange={e => setRecipients(e.target.value)}
                  placeholder="one per line or comma separated" required style={W} />
                <small className="field-note">{recCount} recipient{recCount !== 1 ? 's' : ''}{activeSenderCount > 0 ? ` — ${activeSenderCount} sender${activeSenderCount !== 1 ? 's' : ''} — ~${perSender} each` : ''}</small>
                <br />
                <small className="field-note">{activeSenderCount} sender{activeSenderCount !== 1 ? 's' : ''} selected for sending</small>
              </td>
            </tr>
            <tr>
              <td style={td1}>Blast Size</td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={blastSize}
                  onChange={e => setBlastSize(e.target.value)}
                  style={{ ...W, maxWidth: 160 }}
                />
                <small className="field-note">Recipients per BCC batch (recommended: 50-100)</small>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="action-row" style={{ marginTop: 10 }}>
          <button type="submit" disabled={!!busy || !activeSenderCount || !templates.length} style={{ padding: '6px 16px' }}>
            {busy === 'blast' ? 'Sending…' : `Blast ${recCount} mail${recCount !== 1 ? 's' : ''}`}
          </button>
          {!activeSenderCount && <small style={{ marginLeft: 10, color: '#888' }}>Select at least one sender account first.</small>}
          {activeSenderCount > 0 && !templates.length && <small style={{ marginLeft: 10, color: '#888' }}>Add a template below first.</small>}
        </div>
      </form>

      {status && <p>{status}</p>}

      {result && (
        <div className="section-card" style={{ marginTop: 16, padding: 16 }}>
          {result.ok
            ? <p style={{ color: 'green', margin: '0 0 10px' }}>✓ Sent: {result.summary.sent} / {result.summary.total} &nbsp;|&nbsp; {result.summary.bounced > 0 && <span style={{ color: '#b45309' }}>Bounced: {result.summary.bounced} &nbsp;|&nbsp; </span>}{result.summary.inboxFull > 0 && <span style={{ color: '#7c3aed' }}>Inbox Full: {result.summary.inboxFull} &nbsp;|&nbsp; </span>}Failed: {result.summary.failed} &nbsp;|&nbsp; {result.summary.durationMs}ms</p>
            : <p style={{ color: 'red', margin: '0 0 10px' }}>✗ {result.message}</p>
          }
          {result.success?.length > 0 && (
            <details style={{ marginBottom: 8 }}>
              <summary style={{ cursor: 'pointer', color: 'green', fontWeight: 500 }}>
                Sent successfully ({result.success.length})
              </summary>
              <ul style={{ margin: '6px 0 0', padding: '0 0 0 18px', fontSize: 13 }}>
                {result.success.map(s => (
                  <li key={s.to} style={{ padding: '2px 0' }}>
                    <span style={{ fontFamily: 'monospace' }}>{s.to}</span>
                    {s.sender && <span style={{ color: '#666', marginLeft: 8 }}>via {s.sender}</span>}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {result.inboxFull?.length > 0 && (
            <details style={{ marginBottom: 8 }}>
              <summary style={{ cursor: 'pointer', color: '#7c3aed', fontWeight: 500 }}>
                Inbox Full ({result.inboxFull.length})
              </summary>
              <ul style={{ margin: '6px 0 0', padding: '0 0 0 18px', fontSize: 13 }}>
                {result.inboxFull.map(b => (
                  <li key={b.to} style={{ padding: '2px 0' }}>
                    <span style={{ fontFamily: 'monospace' }}>{b.to}</span>
                    {b.error && <span style={{ color: '#7c3aed', marginLeft: 8 }}>{b.error}</span>}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {result.bounced?.length > 0 && (
            <details style={{ marginBottom: 8 }}>
              <summary style={{ cursor: 'pointer', color: '#b45309', fontWeight: 500 }}>
                Bounced — rejected by SMTP ({result.bounced.length})
              </summary>
              <ul style={{ margin: '6px 0 0', padding: '0 0 0 18px', fontSize: 13 }}>
                {result.bounced.map(b => (
                  <li key={b.to} style={{ padding: '2px 0' }}>
                    <span style={{ fontFamily: 'monospace' }}>{b.to}</span>
                    {b.error && <span style={{ color: '#b45309', marginLeft: 8 }}>{b.error}</span>}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {result.failed?.length > 0 && (
            <details style={{ marginBottom: 4 }}>
              <summary style={{ cursor: 'pointer', color: 'red', fontWeight: 500 }}>
                Failed ({result.failed.length})
              </summary>
              <ul style={{ margin: '6px 0 0', padding: '0 0 0 18px', fontSize: 13 }}>
                {result.failed.map(f => (
                  <li key={f.to} style={{ padding: '2px 0' }}>
                    <span style={{ fontFamily: 'monospace' }}>{f.to}</span>
                    {f.error && <span style={{ color: '#b91c1c', marginLeft: 8 }}>{f.error}</span>}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {/* ── Create Campaign Template ── */}
      <form onSubmit={saveCampaignTemplate} className="section-card template-section" style={{ marginTop: 20, padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Append to Campaign Template</h3>
        <p className="section-subtitle">Items are appended to the single mailtemp document. Each field accepts one item per line.</p>
        <table className="form-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
          <tbody>
            <tr>
              <td style={td1}>Subjects</td>
              <td>
                <textarea rows={3} value={subject} onChange={e => setSubject(e.target.value)} required
                  placeholder="One subject per line" style={W} />
              </td>
            </tr>
            <tr>
              <td style={td1}>Greetings</td>
              <td>
                <textarea rows={3} value={templateGreetings} onChange={e => setTemplateGreetings(e.target.value)}
                  placeholder="One greeting per line, e.g. Dear Student," style={W} />
              </td>
            </tr>
            <tr>
              <td style={td1}>Body Paragraphs</td>
              <td>
                <textarea rows={6} value={message} onChange={e => setMessage(e.target.value)} required
                  placeholder={"One paragraph per block, separate multiple blocks with a line containing only ---"} style={W} />
              </td>
            </tr>
            <tr>
              <td style={td1}>Closings</td>
              <td>
                <textarea rows={3} value={templateClosings} onChange={e => setTemplateClosings(e.target.value)}
                  placeholder="One closing per line, e.g. Best regards," style={W} />
              </td>
            </tr>
            <tr>
              <td style={td1}>Signatures</td>
              <td>
                <textarea rows={3} value={templateSignatures} onChange={e => setTemplateSignatures(e.target.value)}
                  placeholder="One signature per line, e.g. Program Coordination Team" style={W} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="action-row">
          <button type="submit" style={{ padding: '6px 12px' }}>Append to Template</button>
          {templateStatus && <p style={{ color: 'green', margin: '8px 0' }}>{templateStatus}</p>}
          {templateError && <p style={{ color: 'red', margin: '8px 0' }}>{templateError}</p>}
        </div>
      </form>

      {templates[0] && (
        <section className="section-card" style={{ marginTop: 16, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Existing Template Items</h3>
          {[
            { key: 'subjects', label: 'Subjects' },
            { key: 'greetings', label: 'Greetings' },
            { key: 'body_paragraphs', label: 'Body Paragraphs' },
            { key: 'closings', label: 'Closings' },
            { key: 'signatures', label: 'Signatures' }
          ].map((group) => {
            const items = Array.isArray(templates[0][group.key]) ? templates[0][group.key] : [];
            return (
              <details key={group.key} style={{ marginBottom: 10 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                  {group.label} ({items.length})
                </summary>
                {items.length === 0 ? (
                  <p style={{ margin: '6px 0 0', color: '#666', fontSize: 13 }}>No items.</p>
                ) : (
                  <ul style={{ margin: '8px 0 0', padding: '0 0 0 18px' }}>
                    {items.map((item, index) => (
                      <li key={`${group.key}-${index}`} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{item}</div>
                        <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                          <button type="button" onClick={() => editTemplateItem(group.key, index, item)}>Edit</button>
                          <button type="button" onClick={() => deleteTemplateItem(group.key, index)}>Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            );
          })}
        </section>
      )}
      </div>
    </div>
  );
}

export default AdminMailBlaster;
