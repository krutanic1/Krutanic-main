import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

/* ─── Constants ──────────────────────────────────────────────── */
const STAGES = {
  "Fresh Lead":          ["New Lead", "Invalid Lead"],
  "Attempting Contact":  ["RNR", "Callback Requested", "No Response (Multi-touch)"],
  "First Call Connected":["In Conversation", "Demo Booked"],
  "Demo Conducted":      ["Decision Pending", "Negotiation Review", "Expected Payment Date"],
  "Closed Won":          ["Converted"],
  "Closed Lost":         ["Irrelevant Lead", "Not Interested", "Pricing Does Not Match", "No Response"],
};

const ACTION_TYPES = [
  { value: "call",     emoji: "📞", label: "Call" },
  { value: "email",    emoji: "📧", label: "Email" },
  { value: "whatsapp", emoji: "💬", label: "WhatsApp" },
  { value: "meeting",  emoji: "🤝", label: "Meeting" },
  { value: "note",     emoji: "📝", label: "Note" },
];

const STAGE_COLORS = {
  "Fresh Lead":           "#64748B",
  "Attempting Contact":   "#F59E0B",
  "First Call Connected": "#0EA5E9",
  "Demo Conducted":       "#8B5CF6",
  "Closed Won":           "#10B981",
  "Closed Lost":          "#EF4444",
  "Reactive Lead":        "#EC4899",
};

/* ─── Helpers ────────────────────────────────────────────────── */
const formatIST = (val, opts = { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) => {
  if (!val) return "—";
  const ms = Date.parse(val);
  if (isNaN(ms)) return "—";
  // Dates stored as UTC+5:30, subtract offset to get the "intended local" time
  const adjusted = new Date(ms - (5 * 60 + 30) * 60 * 1000);
  return adjusted.toLocaleString("en-IN", opts);
};

const timeSince = (dateStr) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(diff / 60_000);
  return `${m}m ago`;
};

const urgencyColor = (followup_at) => {
  if (!followup_at) return "#64748B";
  const diffH = (new Date(followup_at) - Date.now()) / 3_600_000;
  if (diffH < 0) return "#EF4444";      // overdue
  if (diffH < 2) return "#F59E0B";      // urgent
  return "#10B981";                      // on track
};

/* ─── Sub-components ─────────────────────────────────────────── */
const StagePill = ({ stage, isReactive, isManagerOrLeader }) => {
  const display = isReactive && isManagerOrLeader ? "Reactive Lead" : (stage || "Fresh Lead");
  const color = STAGE_COLORS[display] || "#64748B";
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}35`,
      letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {display}
    </span>
  );
};

const AudioPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = new Audio(url);
    ref.current.addEventListener("ended", () => setPlaying(false));
    return () => { ref.current.pause(); };
  }, [url]);
  const toggle = (e) => {
    e.stopPropagation();
    playing ? ref.current.pause() : ref.current.play().then(() => setPlaying(true)).catch(console.error);
  };
  return (
    <button onClick={toggle} title={playing ? "Pause" : "Play"} style={{
      width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
      background: playing ? "#fee2e2" : "#e0e7ff", color: playing ? "#dc2626" : "#4f46e5",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
      transition: "all 0.2s", flexShrink: 0,
    }}>
      {playing ? "⏸" : "▶"}
    </button>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const AdvFollowups = () => {
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  // Auth
  const advTeamId       = localStorage.getItem("advTeamId")    || "";
  const userName        = localStorage.getItem("advTeamName")  || "";
  const userDesignation = localStorage.getItem("advTeamDesignation") || "";
  const isManager       = userDesignation.toLowerCase().includes("manager") || userDesignation.toLowerCase().includes("leader") || userName.toLowerCase().includes("sumeetha");

  // Panel state
  const [openId, setOpenId]           = useState(null);
  const [forms, setForms]             = useState({});
  const [histories, setHistories]     = useState({});
  const [histLoading, setHistLoading] = useState({});
  const [submitting, setSubmitting]   = useState(null);
  const [callStartTime, setCallStartTime]   = useState(null);
  const [activeCallId, setActiveCallId]     = useState(null);
  const [expandedLog, setExpandedLog]       = useState(null);

  /* ── Fetch ── */
  const fetchFollowups = async () => {
    if (!advTeamId) { toast.error("Not logged in"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("advTeamToken");
      const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: advTeamId, role: userDesignation || "adv_team", limit: 200, reminderOnly: true },
      });
      setLeads(res.data.leads || []);
    } catch {
      toast.error("Failed to fetch follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFollowups(); }, [advTeamId]);

  const fetchHistory = async (leadId) => {
    if (histories[leadId]) return;
    setHistLoading(p => ({ ...p, [leadId]: true }));
    try {
      const res = await axios.get(`${API}/api/adv-leads/lead-call-history/${leadId}`);
      setHistories(p => ({ ...p, [leadId]: res.data || [] }));
    } catch {
      setHistories(p => ({ ...p, [leadId]: [] }));
    } finally {
      setHistLoading(p => ({ ...p, [leadId]: false }));
    }
  };

  /* ── Panel helpers ── */
  const togglePanel = (lead) => {
    if (openId === lead._id) { setOpenId(null); return; }
    setOpenId(lead._id);
    fetchHistory(lead._id);
  };

  const setField = (leadId, field, value) => {
    setForms(p => {
      const cur = p[leadId] || {};
      const next = { ...cur, [field]: value };
      if (field === "stage") next.disposition = "";
      return { ...p, [leadId]: next };
    });
  };

  /* ── Dial ── */
  const handleDial = async (phone, leadId) => {
    const num = String(phone || "").replace(/\D/g, "");
    if (!num) { toast.error("No phone number available"); return; }
    setCallStartTime(Date.now());
    setActiveCallId(leadId);
    try {
      await axios.post(`${API}/api/adv-leads/remote-dial-request`, { specialistId: advTeamId, leadId });
      toast.success("Dialing via mobile app…");
    } catch {
      window.location.href = `tel:${num}`;
    }
  };

  /* ── Log Activity ── */
  const handleLogCall = async (lead) => {
    const f = forms[lead._id] || {};
    if (!f.stage)       { toast.error("Select a stage"); return; }
    if (!f.disposition) { toast.error("Select a disposition"); return; }
    if (!f.actionType)  { toast.error("Select an action type"); return; }
    if (!f.summary?.trim()) { toast.error("Executive summary is required"); return; }
    if (!["Closed Won", "Closed Lost"].includes(f.stage) && !f.followUpDate) {
      toast.error("Next Follow-up date is required"); return;
    }
    if (f.disposition === "Demo Booked" && !f.demoScheduleDate) {
      toast.error("Demo date required for Demo Booked"); return;
    }

    setSubmitting(lead._id);
    try {
      await axios.post(`${API}/api/adv-leads/log-call-activity`, {
        leadId: lead._id,
        specialistId: advTeamId,
        specialistName: userName,
        actionType: f.actionType,
        stage: f.stage,
        disposition: f.disposition,
        summary: f.summary || "",
        remark: f.remark || "",
        duration: activeCallId === lead._id && callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0,
        demoScheduleDate: f.demoScheduleDate || undefined,
        followUpDate: f.followUpDate || undefined,
        expectedPaymentDate: f.expectedPaymentDate || undefined,
        isWeb: true,
      });
      toast.success("Activity logged!");
      setCallStartTime(null);
      setActiveCallId(null);
      setForms(p => ({ ...p, [lead._id]: {} }));
      setHistories(p => { const n = { ...p }; delete n[lead._id]; return n; });
      fetchHistory(lead._id);
      fetchFollowups();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log activity");
    } finally {
      setSubmitting(null);
    }
  };

  /* ── Filtered / searched leads ── */
  const now = Date.now();
  const displayed = leads.filter(l => {
    const q = search.toLowerCase();
    const match = !q || (l.full_name || "").toLowerCase().includes(q) || (l.phone_number || "").includes(q);
    if (!match) return false;
    if (filter === "overdue") {
      return l.next_followup_at && new Date(l.next_followup_at).getTime() < now;
    }
    if (filter === "today") {
      if (!l.next_followup_at) return false;
      const d = new Date(l.next_followup_at);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    }
    return true;
  });

  /* ── Urgency counts ── */
  const overdue = leads.filter(l => l.next_followup_at && new Date(l.next_followup_at) < now).length;
  const today   = leads.filter(l => {
    if (!l.next_followup_at) return false;
    return new Date(l.next_followup_at).toDateString() === new Date().toDateString();
  }).length;

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div style={{ marginLeft: 280, minHeight: "100vh", background: "#0f1117", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>
      <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" } }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .fu-card { transition: transform 0.2s, box-shadow 0.2s; }
        .fu-card:hover { transform: translateY(-1px); }
        .fu-card.open { box-shadow: 0 0 0 2px #6366f1; }
        .fu-btn { transition: all 0.15s; cursor: pointer; border: none; }
        .fu-btn:hover { opacity: 0.85; }
        .fu-chip { transition: all 0.15s; cursor: pointer; }
        .fu-chip:hover { opacity: 0.85; transform: scale(1.03); }
        .fu-stage-btn { cursor: pointer; transition: all 0.15s; border: 1.5px solid transparent; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; }
        .fu-stage-btn:hover { border-color: #6366f1 !important; }
        .fu-action-input { width: 100%; background: #1e293b; border: 1.5px solid #334155; border-radius: 10px; padding: 10px 14px; color: #e2e8f0; font-size: 13px; outline: none; transition: border 0.2s; box-sizing: border-box; font-family: inherit; }
        .fu-action-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .fu-action-input::placeholder { color: #475569; }
        .fu-log-entry { transition: background 0.15s; }
        .fu-log-entry:hover { background: #1e293b !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes slideDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .slide-down { animation: slideDown 0.25s ease; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "32px 40px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⏰</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Follow-up Queue
              </h1>
            </div>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
              Leads scheduled for contact — {leads.length} total
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Stats chips */}
            {overdue > 0 && (
              <div style={{ padding: "6px 14px", background: "#fee2e218", border: "1px solid #ef444430", borderRadius: 99, fontSize: 13, fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}>
                🔴 {overdue} Overdue
              </div>
            )}
            {today > 0 && (
              <div style={{ padding: "6px 14px", background: "#fef9c318", border: "1px solid #f59e0b30", borderRadius: 99, fontSize: 13, fontWeight: 700, color: "#f59e0b", display: "flex", alignItems: "center", gap: 6 }}>
                🟡 {today} Today
              </div>
            )}
            <button className="fu-btn" onClick={fetchFollowups} style={{
              padding: "8px 18px", borderRadius: 10, background: "#1e293b", border: "1px solid #334155",
              color: "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>
              ↺ Refresh
            </button>
          </div>
        </div>

        {/* ── Filter / Search bar ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 16 }}>🔍</span>
            <input
              className="fu-action-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by name or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 6, background: "#1e293b", padding: 4, borderRadius: 10, border: "1px solid #334155" }}>
            {[["all","All"], ["overdue","Overdue"], ["today","Today"]].map(([val, label]) => (
              <button key={val} className="fu-btn" onClick={() => setFilter(val)} style={{
                padding: "6px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                background: filter === val ? "#6366f1" : "transparent",
                color: filter === val ? "#fff" : "#64748b",
                border: "none",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "0 40px 60px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#475569" }}>
            <div className="spinning" style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
            <p style={{ margin: 0 }}>Loading follow-ups…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "#1e293b", borderRadius: 20, border: "1px solid #334155" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ margin: "0 0 8px", color: "#e2e8f0" }}>All Clear!</h3>
            <p style={{ margin: 0, color: "#64748b" }}>No follow-ups{search ? " matching your search" : " scheduled"}.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {displayed.map((lead, idx) => {
              const isOpen = openId === lead._id;
              const f      = forms[lead._id] || {};
              const hist   = histories[lead._id] || [];
              const urgColor = urgencyColor(lead.next_followup_at);

              return (
                <div key={lead._id} className={`fu-card${isOpen ? " open" : ""}`} style={{
                  background: "#1a2035", borderRadius: 16, border: "1px solid #1e293b",
                  overflow: "hidden", borderLeft: `4px solid ${urgColor}`,
                }}>
                  {/* ── Summary Row ── */}
                  <div onClick={() => togglePanel(lead)} style={{
                    padding: "18px 24px", display: "grid", cursor: "pointer",
                    gridTemplateColumns: "32px 1fr auto auto auto",
                    alignItems: "center", gap: 16,
                    background: isOpen ? "rgba(99,102,241,0.05)" : "transparent",
                  }}>
                    {/* Index */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Name + phone + next followup */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9", marginBottom: 4 }}>
                        {lead.full_name || "—"}
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>📞 {lead.phone_number || "—"}</span>
                        {lead.opted_domain && (
                          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>🎯 {lead.opted_domain}</span>
                        )}
                        {lead.next_followup_at && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: urgColor }}>
                            {new Date(lead.next_followup_at) < now ? "⚠ Overdue · " : "🕐 "}
                            {formatIST(lead.next_followup_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                      <a
                        href={`https://wa.me/${(lead.phone_number || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${lead.full_name}, this is from Krutanic`)}`}
                        target="_blank" rel="noopener noreferrer" title="WhatsApp"
                        style={{ width: 34, height: 34, borderRadius: 10, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, textDecoration: "none", flexShrink: 0 }}
                      >
                        <i className="fa fa-whatsapp" />
                      </a>
                      <button className="fu-btn" title="Dial" onClick={() => handleDial(lead.phone_number, lead._id)} style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: activeCallId === lead._id ? "#ef4444" : "linear-gradient(135deg,#f97316,#ef4444)",
                        color: "#fff", fontSize: 14, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        boxShadow: activeCallId === lead._id ? "0 0 14px #ef4444" : "none",
                      }}>
                        <i className="fa fa-phone" />
                      </button>
                    </div>

                    {/* Stage badge */}
                    <StagePill stage={lead.stage} isReactive={lead.is_reactive} isManagerOrLeader={isManager} />

                    {/* Expand chevron */}
                    <span style={{ color: "#6366f1", fontSize: 18, fontWeight: 700, userSelect: "none" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* ── Action Panel ── */}
                  {isOpen && (
                    <div className="slide-down" style={{
                      borderTop: "1px solid #1e293b",
                      display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr",
                      gap: 0,
                    }}>
                      {/* ── Col 1: Intelligence ── */}
                      <div style={{ padding: "28px 24px", borderRight: "1px solid #1e293b", maxHeight: "70vh", overflowY: "auto" }}>
                        <h4 style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8 }}>
                          🧠 Intelligence
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {[
                            { label: "Pipeline Stage",     value: lead.stage },
                            { label: "Disposition",        value: lead.disposition },
                            { label: "Contact Attempts",   value: lead.attempt_count != null ? `${lead.attempt_count} attempts` : null },
                            { label: "Last Contacted",     value: lead.last_contacted_at ? timeSince(lead.last_contacted_at) : "Never" },
                            { label: "Next Follow-up",     value: lead.next_followup_at ? formatIST(lead.next_followup_at) : "Not scheduled" },
                            { label: "Email",              value: lead.email },
                            { label: "Company",            value: !isManager ? lead.company_name : null },
                            { label: "Education",          value: lead.education_background },
                            { label: "Upskilling Ready",   value: lead.upskilling_ready },
                            { label: "Assigned",           value: lead.assigned_at ? formatIST(lead.assigned_at, { day: "2-digit", month: "short" }) : null },
                          ].filter(x => x.value).map((x, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", wordBreak: "break-word" }}>{x.value}</span>
                            </div>
                          ))}
                          {/* Extra fields */}
                          {lead.extra_fields && Object.entries(lead.extra_fields).filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.replace(/_/g, " ")}</span>
                              <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── Col 2: Log Activity ── */}
                      <div style={{ padding: "28px 28px", borderRight: "1px solid #1e293b", maxHeight: "70vh", overflowY: "auto" }}>
                        <h4 style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 800, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          📋 Log Activity
                        </h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                          {/* Action Type */}
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Action Type</label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {ACTION_TYPES.map(a => (
                                <button key={a.value} className="fu-chip fu-btn" onClick={() => setField(lead._id, "actionType", a.value)} style={{
                                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                  background: f.actionType === a.value ? "#6366f120" : "#1e293b",
                                  color: f.actionType === a.value ? "#818cf8" : "#64748b",
                                  border: `1.5px solid ${f.actionType === a.value ? "#6366f1" : "#334155"}`,
                                }}>
                                  {a.emoji} {a.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Stage */}
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Lead Stage</label>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {Object.keys(STAGES).map(s => {
                                const c = STAGE_COLORS[s] || "#6366f1";
                                const active = f.stage === s;
                                return (
                                  <button key={s} className="fu-stage-btn fu-btn" onClick={() => setField(lead._id, "stage", s)} style={{
                                    background: active ? `${c}20` : "#1e293b",
                                    color: active ? c : "#64748b",
                                    borderColor: active ? c : "#334155",
                                  }}>
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Disposition */}
                          {f.stage && (
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Disposition</label>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {STAGES[f.stage].map(d => {
                                  const active = f.disposition === d;
                                  return (
                                    <button key={d} className="fu-stage-btn fu-btn" onClick={() => setField(lead._id, "disposition", d)} style={{
                                      background: active ? "#10b98120" : "#1e293b",
                                      color: active ? "#10b981" : "#64748b",
                                      borderColor: active ? "#10b981" : "#334155",
                                    }}>
                                      {d}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Summary + Notes row */}
                          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Executive Summary *</label>
                              <textarea className="fu-action-input" rows={4} style={{ resize: "none" }}
                                placeholder="Conversation highlights…"
                                value={f.summary || ""}
                                onChange={e => setField(lead._id, "summary", e.target.value)}
                              />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              <div>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Internal Notes</label>
                                <input className="fu-action-input" placeholder="Private remarks…" value={f.remark || ""} onChange={e => setField(lead._id, "remark", e.target.value)} />
                              </div>

                              {/* Conditional date fields */}
                              {!["Closed Won","Closed Lost"].includes(f.stage) && (
                                <div>
                                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#0ea5e9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>🗓 Next Follow-up</label>
                                  <input type="datetime-local" className="fu-action-input" value={f.followUpDate || ""} onChange={e => setField(lead._id, "followUpDate", e.target.value)} />
                                </div>
                              )}
                              {f.disposition === "Demo Booked" && (
                                <div>
                                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>📅 Schedule Demo</label>
                                  <input type="datetime-local" className="fu-action-input" value={f.demoScheduleDate || ""} onChange={e => setField(lead._id, "demoScheduleDate", e.target.value)} />
                                </div>
                              )}
                              {["Expected Payment Date","Converted"].includes(f.disposition) && (
                                <div>
                                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>💳 Payment Date</label>
                                  <input type="date" className="fu-action-input" value={f.expectedPaymentDate || ""} onChange={e => setField(lead._id, "expectedPaymentDate", e.target.value)} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Submit */}
                          <button className="fu-btn" onClick={() => handleLogCall(lead)} disabled={submitting === lead._id} style={{
                            width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                            background: f.disposition ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#334155",
                            color: "#fff", fontWeight: 700, fontSize: 15,
                            boxShadow: f.disposition ? "0 8px 20px rgba(99,102,241,0.35)" : "none",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            opacity: submitting === lead._id ? 0.7 : 1,
                          }}>
                            {submitting === lead._id ? (
                              <><span className="spinning">⟳</span> Saving…</>
                            ) : (
                              <>💾 Log Activity &amp; Progress</>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* ── Col 3: History ── */}
                      <div style={{ padding: "28px 24px", maxHeight: "70vh", overflowY: "auto" }}>
                        <h4 style={{ margin: "0 0 20px", fontSize: 13, fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          🕘 History
                        </h4>

                        {histLoading[lead._id] ? (
                          <div style={{ textAlign: "center", color: "#475569", paddingTop: 40 }}>
                            <span className="spinning" style={{ fontSize: 24 }}>⟳</span>
                          </div>
                        ) : hist.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px 12px", background: "#0f1117", borderRadius: 12, border: "1px solid #1e293b" }}>
                            <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>No activity recorded yet.</p>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 440, overflowY: "auto", paddingRight: 4 }}>
                            {hist.map((h, i) => {
                              const expanded = expandedLog === h._id;
                              return (
                                <div key={i} className="fu-log-entry" onClick={() => setExpandedLog(expanded ? null : h._id)} style={{
                                  padding: "14px 16px", borderRadius: 12, background: "#0f1117",
                                  border: `1px solid ${expanded ? "#6366f1" : "#1e293b"}`, cursor: "pointer",
                                }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                    <div>
                                      <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
                                        {ACTION_TYPES.find(a => a.value === h.actionType)?.emoji || "📞"} {ACTION_TYPES.find(a => a.value === h.actionType)?.label || "Interaction"}
                                      </div>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
                                        {h.stage ? `${h.stage} → ${h.disposition}` : (h.callOutcome || "Unknown")}
                                      </div>
                                    </div>
                                    <span style={{ fontSize: 11, color: "#475569", fontWeight: 500, whiteSpace: "nowrap", paddingLeft: 8 }}>
                                      {new Date(h.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short" })}
                                    </span>
                                  </div>

                                  {/* Date tags */}
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: h.summary ? 8 : 0 }}>
                                    {h.followUpDate && (
                                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#0ea5e920", color: "#0ea5e9" }}>
                                        🗓 FU: {formatIST(h.followUpDate)}
                                      </span>
                                    )}
                                    {h.demoScheduleDate && (
                                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#f59e0b20", color: "#f59e0b" }}>
                                        📅 Demo: {formatIST(h.demoScheduleDate)}
                                      </span>
                                    )}
                                    {h.expectedPaymentDate && (
                                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#10b98120", color: "#10b981" }}>
                                        💳 Pay: {new Date(h.expectedPaymentDate).toLocaleDateString("en-IN")}
                                      </span>
                                    )}
                                  </div>

                                  {h.summary && (
                                    <p style={{
                                      margin: 0, fontSize: 12, color: "#64748b", lineHeight: 1.5,
                                      display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 2,
                                      WebkitBoxOrient: "vertical", overflow: "hidden",
                                    }}>
                                      {h.summary}
                                    </p>
                                  )}

                                  {expanded && h.remark && (
                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #1e293b", fontSize: 12, color: "#475569", fontStyle: "italic" }}>
                                      Note: {h.remark}
                                    </div>
                                  )}

                                  {h.recordingUrl && (
                                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                                      <AudioPlayer url={h.recordingUrl} />
                                      <span style={{ fontSize: 11, color: "#475569" }}>Recording</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvFollowups;
