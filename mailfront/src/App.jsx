import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
const W = { width: '100%', padding: 6, boxSizing: 'border-box' };
const td1 = { padding: '5px 8px 5px 0', width: 110, verticalAlign: 'top' };
const TEMPLATE_FIELDS = ['subjects', 'greetings', 'body_paragraphs', 'closings', 'signatures'];

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
  if (!API) {
    return {
      ok: false,
      message: 'Mailback API is not configured. Set VITE_API_BASE_URL in production.'
    };
  }

  try {
    const r = await fetch(API + path, opts);
    const text = await r.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, message: text || `Request failed with status ${r.status}` };
    }

    if (!r.ok) {
      return {
        ...data,
        ok: false,
        message: data.message || `Request failed with status ${r.status}`
      };
    }

    return data;
  } catch (err) {
    return {
      ok: false,
      message: `Unable to reach mailback API: ${err.message}`
    };
  }
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  const pad = (v) => String(v).padStart(2, '0');
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

function getResetCountdown(sender, nowMs) {
  const resetAtMs = sender?.resetAt ? new Date(sender.resetAt).getTime() : NaN;
  const fromResetAt = Number.isFinite(resetAtMs) ? Math.max(0, resetAtMs - nowMs) : NaN;
  const remainingMs = Number.isFinite(fromResetAt) ? fromResetAt : Number(sender?.resetMsRemaining || 0);
  return formatCountdown(remainingMs);
}

function App() {
  // stored senders (from DB)
  const [senders, setSenders] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [addError, setAddError] = useState('');
  const [editPassById, setEditPassById] = useState({});
  const [editingPassId, setEditingPassId] = useState(null);
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
  const [validatorEmails, setValidatorEmails] = useState('');
  const [blastSize, setBlastSize] = useState(90);

  // ui
  const [blastStatus, setBlastStatus] = useState('');
  const [validatorStatus, setValidatorStatus] = useState('');
  const [validateReport, setValidateReport] = useState(null);
  const [emailValidationResult, setEmailValidationResult] = useState(null);
  const [validationProgress, setValidationProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [busyOps, setBusyOps] = useState({
    validate: false,
    checkLimits: false,
    validateRecipients: false,
    blast: false
  });
  const [templateStatus, setTemplateStatus] = useState('');
  const [templateError, setTemplateError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingBusy, setEditingBusy] = useState(false);
  const [templateSelection, setTemplateSelection] = useState({});
  const [countdownNowMs, setCountdownNowMs] = useState(Date.now());

  const recipientList = () => [...new Set(recipients.split(/[\n,]/).map(s => s.trim()).filter(Boolean))];
  const validatorEmailList = () => [...new Set(validatorEmails.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean))];
  const recCount = recipientList().length;
  const selectedSenderIds = senders.filter((s) => s.canUse && selectedById[s._id]).map((s) => s._id);
  const activeSenderCount = selectedSenderIds.length;
  const perSender = activeSenderCount ? Math.ceil(recCount / activeSenderCount) : 0;

  const selectedTemplate = templates.find((template) => template._id === selectedTemplateId) || null;
  const isBusy = (op) => !!busyOps[op];

  // load senders on mount
  useEffect(() => {
    loadSenders();
    loadTemplates();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCountdownNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function loadSenders() {
    const d = await apiFetch('/api/senders');
    if (d.ok) {
      setSenders(d.senders);
      setEditPassById(Object.fromEntries(d.senders.map((s) => [s._id, formatAppPassword(s.pass || '')])));
      setSelectedById((prev) => Object.fromEntries(d.senders.map((s) => [s._id, s.canUse ? (prev[s._id] ?? false) : false])));
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
      const tpl = d.templates?.[0] || {};
      setTemplateSelection((prev) => {
        const next = {};
        TEMPLATE_FIELDS.forEach((field) => {
          const items = Array.isArray(tpl[field]) ? tpl[field] : [];
          next[field] = {};
          items.forEach((_item, index) => {
            next[field][index] = prev?.[field]?.[index] ?? true;
          });
        });
        return next;
      });
    }
  }

  //wertyuio
  function selectedIndexList(field, items) {
    const map = templateSelection?.[field] || {};
    return items
      .map((_v, idx) => idx)
      .filter((idx) => !!map[idx]);
  }

  function toggleTemplateItem(field, index) {
    setTemplateSelection((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [index]: !(prev[field] || {})[index]
      }
    }));
  }

  function selectAllSenders() {
    setSelectedById((prev) => {
      const usableSenders = senders.filter((s) => s.canUse !== false);
      const allUsableSelected = usableSenders.length > 0 && usableSenders.every((s) => !!prev[s._id]);
      const next = { ...prev };
      senders.forEach((s) => {
        if (s.canUse === false) {
          next[s._id] = false;
          return;
        }
        next[s._id] = !allUsableSelected;
      });
      return next;
    });
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
    setEditingPassId(null);
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

  async function checkAllLimits() {
    setBusyOps((prev) => ({ ...prev, checkLimits: true }));
    await Promise.all(senders.map((s) => checkLimit(s._id)));
    setBusyOps((prev) => ({ ...prev, checkLimits: false }));
  }

  async function validateAll() {
    setBusyOps((prev) => ({ ...prev, validate: true }));
    setValidateReport(null); setResult(null);
    const d = await apiFetch('/api/validate-senders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    setValidateReport(d.report || []);
    setBusyOps((prev) => ({ ...prev, validate: false }));
  }

  async function validateRecipients() {
    const typedValidatorEmails = validatorEmailList();
    const emails = typedValidatorEmails.length ? typedValidatorEmails : recipientList();
    if (!emails.length) {
      setValidatorStatus('Add emails in the validator section or campaign recipients before validation.');
      setEmailValidationResult(null);
      return;
    }

    setBusyOps((prev) => ({ ...prev, validateRecipients: true }));
    setValidatorStatus('Validating recipient list...');
    setEmailValidationResult(null);
    const progressKey = `validator-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setValidationProgress({ stage: 'upload list', current: 0, total: emails.length, done: false });

    let pollTimer = null;
    let pollInFlight = false;

    const pollProgress = async () => {
      if (pollInFlight) return;
      pollInFlight = true;
      try {
        const p = await apiFetch(`/api/validate-emails/progress/${encodeURIComponent(progressKey)}`);
        if (p?.ok && p.progress) {
          setValidationProgress(p.progress);
          if (p.progress.done && pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
          }
        }
      } catch {
        // ignore transient poll errors
      } finally {
        pollInFlight = false;
      }
    };

    pollTimer = setInterval(pollProgress, 700);

    try {
      const d = await apiFetch('/api/validate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, senderIds: selectedSenderIds, progressKey })
      });

      await pollProgress();

      setEmailValidationResult(d);
      if (d.ok) {
        setValidatorStatus(`Validation complete: ${d.summary.clean}/${d.summary.total} clean emails.`);
      } else {
        setValidatorStatus(d.message || 'Validation failed.');
      }
    } catch {
      setValidatorStatus('Unable to validate recipients right now.');
    } finally {
      if (pollTimer) clearInterval(pollTimer);
      setBusyOps((prev) => ({ ...prev, validateRecipients: false }));
    }
  }

  function useCleanRecipients() {
    if (!emailValidationResult?.ok || !Array.isArray(emailValidationResult.cleanEmails)) return;
    const likelyEmails = (emailValidationResult.likelyValidEmails || []).map((item) => item.email);
    const allEmails = [...emailValidationResult.cleanEmails, ...likelyEmails];
    const cleanText = allEmails.join('\n');
    setValidatorEmails(cleanText);
    setRecipients(cleanText);
    setValidatorStatus(`Applied ${allEmails.length} recipients (${emailValidationResult.cleanEmails.length} clean + ${likelyEmails.length} likely valid).`);
  }

  async function blast(e) {
    e.preventDefault();
    setBusyOps((prev) => ({ ...prev, blast: true }));
    setBlastStatus('Sending mails...'); setResult(null); setValidateReport(null);
    try {
      const tpl = templates[0] || {};
      const d = await apiFetch('/api/blast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientList(),
          senderIds: selectedSenderIds,
          singleShotBcc: true,
          bccBatchSize: Math.max(1, Number(blastSize) || 90),
          templateSelection: {
            subjects: selectedIndexList('subjects', tpl.subjects || []),
            greetings: selectedIndexList('greetings', tpl.greetings || []),
            body_paragraphs: selectedIndexList('body_paragraphs', tpl.body_paragraphs || []),
            closings: selectedIndexList('closings', tpl.closings || []),
            signatures: selectedIndexList('signatures', tpl.signatures || [])
          }
        })
      });
      setResult(d);
      setBlastStatus('');
    } catch {
      setResult({ ok: false, message: 'Unable to send mails right now.' });
      setBlastStatus('');
    } finally {
      setBusyOps((prev) => ({ ...prev, blast: false }));
    }
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

  function startEditTemplateItem(field, index, currentValue) {
    setEditingItem({ field, index });
    setEditingValue(String(currentValue || ''));
    setTemplateError('');
  }

  function cancelEditTemplateItem() {
    setEditingItem(null);
    setEditingValue('');
    setEditingBusy(false);
  }

  async function saveEditTemplateItem() {
    if (!editingItem) return;

    const value = String(editingValue || '').trim();
    if (!value) {
      setTemplateError('Value cannot be empty.');
      return;
    }

    setEditingBusy(true);
    const d = await apiFetch('/api/mail-template/item/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: editingItem.field, index: editingItem.index, value })
    });
    setEditingBusy(false);

    if (!d.ok) {
      setTemplateError(d.message || 'Failed to update template item.');
      return;
    }

    setTemplateError('');
    setTemplateStatus('✓ Template item updated.');
    cancelEditTemplateItem();
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
    <div className="app-shell">
      <h2>Mail Blaster</h2>

      <div className="sender-layout" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Add Sender: horizontal bar */}
        <div className="section-card" style={{ padding: 12 }}>
          <form onSubmit={addSender} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>Add Sender</span>
            <input
              value={newUser}
              onChange={e => setNewUser(e.target.value)}
              placeholder="email@gmail.com"
              required
              style={{ padding: 8, flex: '1 1 200px', minWidth: 160 }}
            />
            <input
              type="text"
              value={newPass}
              onChange={e => setNewPass(formatAppPassword(e.target.value))}
              placeholder="App Password"
              required
              style={{ padding: 8, flex: '1 1 200px', minWidth: 160 }}
            />
            <button type="submit" style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>+ Add</button>
            {senders.length > 0 && (
              <button type="button" onClick={validateAll} disabled={isBusy('validate')} style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                {isBusy('validate') ? 'Validating…' : 'Validate All'}
              </button>
            )}
          </form>
          {addError && <p style={{ color: 'red', margin: '6px 0 0' }}>{addError}</p>}
        </div>

        {/* Sender Accounts: full width below */}
        <section className="section-card" style={{ padding: 16 }}>
          <h3>
            Sender Accounts
            <span style={{ fontWeight: 'normal', fontSize: 13 }}>
              {' '}({senders.length} account{senders.length !== 1 ? 's' : ''}
              {recCount > 0 && activeSenderCount > 0 ? `, ~${perSender} mails each` : ''})
            </span>
          </h3>
          <div style={{ marginTop: -4, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={selectAllSenders} disabled={!senders.length}>
                {(senders.filter((s) => s.canUse !== false).length > 0 && senders.filter((s) => s.canUse !== false).every((s) => !!selectedById[s._id]))
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
              <small style={{ color: '#6b7280' }}>Accounts at limit are skipped automatically.</small>
            </div>
            <button type="button" onClick={checkAllLimits} disabled={!senders.length || isBusy('checkLimits')}>
              {isBusy('checkLimits') ? 'Checking…' : 'Check All Limits'}
            </button>
          </div>

          {senders.length === 0 && (
            <p style={{ marginTop: 0, color: '#666' }}>No sender emails yet. Use the form above to add one.</p>
          )}

          {senders.length > 0 && (
            <div style={{ maxHeight: 420, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>#</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Use</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Email</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 8px 3px 0' }}>Blasted</th>
                  <th style={{ textAlign: 'left', fontSize: 12, padding: '3px 0' }}>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {senders.map((s, i) => {
                  const rep = validateReport?.find(r => r.user === s.user);
                  const limitReached = s.canUse === false;
                  return (
                    <tr key={s._id} style={limitReached ? { opacity: 0.6 } : undefined}>
                      <td style={{ padding: '4px 8px 4px 0', color: '#888', width: 24 }}>{i + 1}</td>
                      <td style={{ padding: '4px 8px 4px 0' }}>
                        <input
                          type="checkbox"
                          disabled={limitReached}
                          checked={!!selectedById[s._id]}
                          onChange={(e) => setSelectedById((prev) => ({ ...prev, [s._id]: e.target.checked }))}
                        />
                      </td>
                      <td style={{ padding: '4px 8px 4px 0' }}>{s.user}</td>
                      <td style={{ padding: '4px 8px 4px 0', color: '#374151', fontWeight: 600 }}>{Number(s.used ?? s.blastedCount ?? 0)}</td>
                      <td style={{ padding: '4px 0', fontSize: 13 }}>
                        {limitReached
                          ? <span style={{ color: '#b91c1c', fontWeight: 600 }}>Limit reached</span>
                          : rep
                          ? (rep.ok
                            ? <span style={{ color: 'green' }}>OK</span>
                            : <span style={{ color: 'red' }}>{isInvalidAppPasswordError(rep.error) ? 'Invalid' : 'Failed'}</span>)
                          : null}
                      </td>
                      <td style={{ paddingLeft: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                          <button type="button" onClick={() => setEditingPassId((prev) => prev === s._id ? null : s._id)}>Edit Password</button>

                          <button type="button" onClick={() => deleteSender(s._id)}>Delete</button>
                        </div>
                        {editingPassId === s._id && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                            <input
                              type="text"
                              value={editPassById[s._id] || ''}
                              onChange={(e) => setEditPassById((prev) => ({ ...prev, [s._id]: formatAppPassword(e.target.value) }))}
                              placeholder="App password"
                              style={{ padding: 6, minWidth: 180, flex: '1 1 180px', boxSizing: 'border-box' }}
                            />
                            <button type="button" onClick={() => updateSenderPass(s._id)}>Save</button>
                            <button type="button" onClick={() => setEditingPassId(null)}>✕</button>
                          </div>
                        )}
                        {limitById[s._id]?.error && (
                          <div style={{ marginTop: 4, color: '#b91c1c', fontSize: 12 }}>{limitById[s._id].error}</div>
                        )}
                        {limitById[s._id]?.limit && !limitById[s._id]?.error && (
                          <div style={{ marginTop: 4, color: '#4b5563', fontSize: 12 }}>
                            Used {limitById[s._id].used} / {limitById[s._id].limit} • Remaining {limitById[s._id].remaining}
                          </div>
                        )}
                        {limitReached && !limitById[s._id]?.error && !limitById[s._id]?.limit && (
                          <div style={{ marginTop: 4, color: '#b91c1c', fontSize: 12 }}>
                            Reset in {getResetCountdown(s, countdownNowMs)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
          {updateError && <p style={{ color: 'red', marginTop: 6 }}>{updateError}</p>}
        </section>
      </div>

      <div className="campaign-validator-layout">
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
            <button type="submit" disabled={isBusy('blast') || !activeSenderCount || !templates.length} style={{ padding: '6px 16px' }}>
              {isBusy('blast') ? 'Sending mails...' : `Blast ${recCount} mail${recCount !== 1 ? 's' : ''}`}
            </button>
            {!activeSenderCount && <small style={{ marginLeft: 10, color: '#888' }}>Select at least one sender account first.</small>}
            {activeSenderCount > 0 && !templates.length && <small style={{ marginLeft: 10, color: '#888' }}>Add a template below first.</small>}
          </div>
          {isBusy('blast') && (
            <>
              <style>{`@keyframes mailBlasterSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 10, color: '#374151' }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '3px solid #d1d5db',
                    borderTopColor: '#2563eb',
                    animation: 'mailBlasterSpin 0.9s linear infinite',
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>Sending mails...</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Please wait while the blast is in progress. Do not refresh the page.</div>
                </div>
              </div>
            </>
          )}
        </form>

        <section className="section-card campaign-section" style={{ padding: 16 }}>
          <h3>Email Validator</h3>
          <p className="section-subtitle" style={{ marginBottom: 10 }}>
            Upload list -&gt; Syntax check -&gt; DNS domain check -&gt; MX validation -&gt; Disposable filter -&gt; Role email detection -&gt; Catch-all detection -&gt; SMTP mailbox verification -&gt; Classification
          </p>
          <textarea
            rows={11}
            value={validatorEmails}
            onChange={(e) => setValidatorEmails(e.target.value)}
            placeholder="Paste emails here, one per line (or comma/semicolon separated)"
            style={W}
          />
          <div className="action-row" style={{ marginTop: 10 }}>
            <button
              type="button"
              onClick={validateRecipients}
              disabled={isBusy('validateRecipients') || (validatorEmailList().length === 0 && recipientList().length === 0)}
            >
              {isBusy('validateRecipients') ? 'Validating List...' : 'Validate Mails'}
            </button>
            <button
              type="button"
              onClick={useCleanRecipients}
              disabled={!emailValidationResult?.ok || ((emailValidationResult.cleanEmails || []).length === 0 && (emailValidationResult.likelyValidEmails || []).length === 0)}
            >
              Use Clean List In Campaign
            </button>
          </div>
          <small className="field-note" style={{ display: 'block', marginTop: 8 }}>
            Validates validator emails first. If empty, uses campaign recipients.
          </small>

          {isBusy('validateRecipients') && validationProgress && (
            <div style={{ marginTop: 10, padding: 10, border: '1px solid #dbeafe', background: '#f8fbff', borderRadius: 8 }}>
              <p style={{ margin: '0 0 6px', color: '#1d4ed8', fontWeight: 600 }}>
                Now validating: {validationProgress.stage || 'processing'}
              </p>
              <p style={{ margin: '0 0 6px', color: '#334155', fontSize: 13 }}>
                Count: {Number(validationProgress.current || 0)} / {Number(validationProgress.total || 0)}
              </p>
              <progress
                value={Number(validationProgress.current || 0)}
                max={Math.max(1, Number(validationProgress.total || 0))}
                style={{ width: '100%', height: 10 }}
              />
            </div>
          )}

          {emailValidationResult?.ok && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 8px' }}>Validation Result</h4>
              <p style={{ margin: '0 0 8px', color: '#065f46' }}>
                Clean: {emailValidationResult.summary.clean} / {emailValidationResult.summary.total}
              </p>
              <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 13 }}>
                Syntax valid: {emailValidationResult.summary.syntaxValid} · DNS valid: {emailValidationResult.summary.dnsValid ?? 0} · MX valid: {emailValidationResult.summary.mxValid}
              </p>
              <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 13 }}>
                Disposable: {emailValidationResult.summary.disposable ?? 0} · Role-based: {emailValidationResult.summary.roleBased ?? 0} · Catch-all: {emailValidationResult.summary.catchAll ?? 0}
              </p>
              <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 13 }}>
                SMTP checked: {emailValidationResult.summary.smtpChecked ? 'Yes' : 'No'} · SMTP valid: {emailValidationResult.summary.smtpValid ?? 0} · Likely valid: {emailValidationResult.summary.likelyValid ?? 0} · Risky: {emailValidationResult.summary.risky ?? 0}
              </p>

              {emailValidationResult.smtp?.reason && (
                <p style={{ margin: '0 0 8px', color: '#b45309', fontSize: 13 }}>
                  SMTP note: {emailValidationResult.smtp.reason}
                </p>
              )}

              {(emailValidationResult.cleanEmails || []).length > 0 && (
                <details style={{ marginBottom: 8 }}>
                  <summary style={{ cursor: 'pointer', color: '#065f46', fontWeight: 600 }}>
                    Clean Email List ({emailValidationResult.cleanEmails.length})
                  </summary>
                  <ul style={{ margin: '8px 0 0', padding: '0 0 0 18px', fontSize: 13, maxHeight: 140, overflowY: 'auto' }}>
                    {emailValidationResult.cleanEmails.map((email) => (
                      <li key={`clean-${email}`}>{email}</li>
                    ))}
                  </ul>
                </details>
              )}

              {(emailValidationResult.likelyValidEmails || []).length > 0 && (
                <details style={{ marginBottom: 8 }}>
                  <summary style={{ cursor: 'pointer', color: '#1d4ed8', fontWeight: 600 }}>
                    Likely Valid ({emailValidationResult.likelyValidEmails.length})
                  </summary>
                  <ul style={{ margin: '8px 0 0', padding: '0 0 0 18px', fontSize: 13, maxHeight: 140, overflowY: 'auto' }}>
                    {emailValidationResult.likelyValidEmails.map((item) => (
                      <li key={`lv-${item.email}`}>
                        <span style={{ fontFamily: 'monospace' }}>{item.email}</span>
                        <span style={{ marginLeft: 8, color: '#1e40af' }}>{item.reason}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {(emailValidationResult.rejected || []).length > 0 && (
                <details>
                  <summary style={{ cursor: 'pointer', color: '#b91c1c', fontWeight: 600 }}>
                    Rejected ({emailValidationResult.rejected.length})
                  </summary>
                  <ul style={{ margin: '8px 0 0', padding: '0 0 0 18px', fontSize: 13, maxHeight: 180, overflowY: 'auto' }}>
                    {emailValidationResult.rejected.map((item) => (
                      <li key={`rejected-${item.email}`}>
                        <span style={{ fontFamily: 'monospace' }}>{item.email}</span>
                        <span style={{ marginLeft: 8, color: '#991b1b' }}>[{item.stage}] {item.reason}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {emailValidationResult && !emailValidationResult.ok && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: '0 0 8px', color: '#b91c1c' }}>Validation Failed</h4>
              <p style={{ margin: 0, color: '#991b1b', fontSize: 13 }}>
                {emailValidationResult.message || 'Validation request failed in production. Check Mailback URL and function logs.'}
              </p>
            </div>
          )}
        </section>
      </div>

      {blastStatus && <p>{blastStatus}</p>}
      {validatorStatus && <p>{validatorStatus}</p>}

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
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12, color: '#4b5563' }}>
                          <input
                            type="checkbox"
                            checked={!!templateSelection?.[group.key]?.[index]}
                            onChange={() => toggleTemplateItem(group.key, index)}
                          />
                          Use in blast
                        </label>
                        {editingItem?.field === group.key && editingItem?.index === index ? (
                          <>
                            <textarea
                              rows={group.key === 'body_paragraphs' ? 5 : 2}
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              style={{ ...W, fontSize: 13, resize: 'vertical' }}
                            />
                            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                              <button type="button" onClick={saveEditTemplateItem} disabled={editingBusy}>Save</button>
                              <button type="button" onClick={cancelEditTemplateItem} disabled={editingBusy}>Cancel</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{item}</div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                              <button type="button" onClick={() => startEditTemplateItem(group.key, index, item)}>Edit</button>
                              <button type="button" onClick={() => deleteTemplateItem(group.key, index)}>Delete</button>
                            </div>
                          </>
                        )}
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
  );
}

export default App;
