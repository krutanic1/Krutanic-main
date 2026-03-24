import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

const CALL_OUTCOMES = [
    { value: "interested", label: "✅ Interested", color: "#52c41a" },
    { value: "not_interested", label: "❌ Not Interested", color: "#ff4d4f" },
    { value: "no_answer", label: "📵 No Answer", color: "#faad14" },
    { value: "callback_requested", label: "🔄 Callback Requested", color: "#1890ff" },
    { value: "converted", label: "🏆 Converted", color: "#722ed1" },
];

const AdvLeadsBook = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLead, setActiveLead] = useState(null);
    const [callHistory, setCallHistory] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [formState, setFormState] = useState({});
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [selectedOutcome, setSelectedOutcome] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 25;

    const userId = localStorage.getItem("advTeamId");
    const userName = localStorage.getItem("advTeamName");
    const designation = localStorage.getItem("advTeamDesignation") || "SR Inside Sales Specialist";

    const fetchMyLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: { role: designation, userId, page, limit, outcome: selectedOutcome, strictlyOwned: true, date: dateFilter }
            });
            if (res.data && res.data.leads) {
                setLeads(res.data.leads);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
                setCurrentPage(res.data.currentPage);
            } else {
                setLeads([]);
            }
        } catch {
            toast.error("Failed to fetch leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyLeads(currentPage); }, [currentPage, selectedOutcome, dateFilter]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const fetchHistory = async (leadId) => {
        if (callHistory[leadId]) return;
        try {
            const res = await axios.get(`${API}/api/adv-leads/lead-call-history/${leadId}`);
            setCallHistory(prev => ({ ...prev, [leadId]: res.data || [] }));
        } catch {
            setCallHistory(prev => ({ ...prev, [leadId]: [] }));
        }
    };

    const toggleRow = (lead) => {
        if (activeLead === lead._id) {
            setActiveLead(null);
        } else {
            setActiveLead(lead._id);
            fetchHistory(lead._id);
        }
    };

    const updateForm = (leadId, field, value) => {
        setFormState(prev => ({
            ...prev,
            [leadId]: { ...(prev[leadId] || {}), [field]: value }
        }));
    };

    const handleLogCall = async (lead) => {
        const form = formState[lead._id] || {};
        if (!form.callOutcome) { toast.error("Please select a call outcome"); return; }

        setSubmitting(lead._id);
        try {
            await axios.post(`${API}/api/adv-leads/log-call-activity`, {
                leadId: lead._id,
                specialistId: userId,
                specialistName: userName,
                callOutcome: form.callOutcome,
                summary: form.summary || "",
                remark: form.remark || "",
                demoScheduleDate: form.demoScheduleDate || undefined,
            });
            toast.success("Call logged successfully!");
            setFormState(prev => ({ ...prev, [lead._id]: {} }));
            setCallHistory(prev => { const n = { ...prev }; delete n[lead._id]; return n; });
            fetchHistory(lead._id);
            fetchMyLeads(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to log call");
        } finally {
            setSubmitting(null);
        }
    };

    const handleRemoteDial = async (leadId) => {
        try {
            toast.loading("Sending dial request to your mobile app...", { id: `dial-${leadId}` });
            await axios.post(`${API}/api/adv-leads/remote-dial-request`, {
                specialistId: userId,
                leadId: leadId
            });
            toast.success("Dialing started on mobile! Waiting for call log...", { id: `dial-${leadId}` });

            // Poll for new call history every 5 seconds for the next 2 minutes
            let polls = 0;
            const pollInterval = setInterval(async () => {
                polls++;
                if (polls > 24) { // 2 minutes max
                    clearInterval(pollInterval);
                    return;
                }

                try {
                    const res = await axios.get(`${API}/api/adv-leads/call-history/${leadId}`);
                    setCallHistory(prev => {
                        const prevHistory = prev[leadId] || [];
                        const newHistory = res.data?.calls || [];

                        // If we got a new call log, stop polling & show success
                        if (newHistory.length > prevHistory.length) {
                            clearInterval(pollInterval);
                            toast.success("Call log synced from mobile!");
                        }
                        return { ...prev, [leadId]: newHistory };
                    });
                } catch (e) { }
            }, 5000);

        } catch (err) {
            toast.error("Failed to trigger remote dial.", { id: `dial-${leadId}` });
        }
    };

    const StatusBadge = ({ status }) => {
        const getStyles = (s) => {
            const map = {
                fresh: { bg: 'rgba(255, 169, 0, 0.1)', color: '#D48806', border: 'rgba(255, 169, 0, 0.3)' },
                assigned_to_manager: { bg: 'rgba(250, 140, 22, 0.1)', color: '#D46B08', border: 'rgba(250, 140, 22, 0.3)' },
                assigned_to_leader: { bg: 'rgba(114, 46, 209, 0.1)', color: '#531DAB', border: 'rgba(114, 46, 209, 0.3)' },
                assigned_to_specialist: { bg: 'rgba(24, 144, 255, 0.1)', color: '#1D39C4', border: 'rgba(24, 144, 255, 0.3)' },
                in_followup: { bg: 'rgba(19, 194, 194, 0.1)', color: '#08979C', border: 'rgba(19, 194, 194, 0.3)' },
                converted: { bg: 'rgba(82, 196, 26, 0.1)', color: '#389E0D', border: 'rgba(82, 196, 26, 0.3)' },
                closed: { bg: 'rgba(140, 140, 140, 0.1)', color: '#595959', border: 'rgba(140, 140, 140, 0.3)' }
            };
            return map[s] || { bg: '#f5f5f5', color: '#8c8c8c', border: '#ddd' };
        };
        const styles = getStyles(status);
        return (
            <span style={{
                padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
                background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`,
                textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
                {status?.replace(/_/g, ' ')}
            </span>
        );
    };

    const styles = {
        container: {
            padding: '24px',
            marginLeft: '270px',
            background: '#F8FAFC',
            minHeight: '100vh',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
        },
        titleSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#1E293B',
            margin: 0,
            letterSpacing: '-0.5px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        statsRow: {
            display: 'flex',
            gap: '16px'
        },
        statCard: {
            padding: '12px 24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E2E8F0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        },
        leadCard: {
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            marginBottom: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        leadCardActive: {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: '#3B82F6',
            transform: 'translateY(-2px)'
        },
        outcomeBtn: (active, color) => ({
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            border: `2px solid ${active ? color : '#E2E8F0'}`,
            background: active ? `${color}15` : '#FFFFFF',
            color: active ? color : '#475569',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }),
        input: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '14px',
            color: '#1E293B',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            padding: '16px 24px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }
    };

    return (
        <div id="create-marketing-team" style={styles.container}>
            <Toaster position="top-center" />

            <header style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Leads Book</h1>
                    <div style={styles.subtitle}>
                        <span style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%' }}></span>
                        {userName} • {designation}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                        type="date" 
                        value={dateFilter} 
                        onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }} 
                        style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#fff', outline: 'none' }} 
                        title="Filter by Assigned Date" 
                    />
                    <div style={{ display: 'flex', background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <button
                            onClick={() => setSelectedOutcome("")}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none',
                                background: selectedOutcome === "" ? '#F1F5F9' : 'transparent', color: selectedOutcome === "" ? '#1E293B' : '#64748B'
                            }}
                        >
                            All Leads
                        </button>
                        {CALL_OUTCOMES.map(o => (
                            <button
                                key={o.value}
                                onClick={() => setSelectedOutcome(o.value)}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none',
                                    background: selectedOutcome === o.value ? `${o.color}15` : 'transparent',
                                    color: selectedOutcome === o.value ? o.color : '#64748B'
                                }}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>

                    <div style={styles.statsRow}>
                        <div style={styles.statCard}>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#3B82F6' }}>{totalCount}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>{selectedOutcome ? `${selectedOutcome.replace('_', ' ')}` : 'Total Assigned'}</span>
                        </div>
                        <button
                            onClick={() => fetchMyLeads(1)}
                            style={{ ...styles.statCard, cursor: 'pointer', background: '#F1F5F9', border: 'none' }}
                        >
                            <span style={{ fontSize: '18px' }}>🔄</span>
                        </button>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#64748B' }}>
                        <div className="three-body">
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                        </div>
                        <p style={{ marginTop: '20px', fontWeight: '500' }}>Fetching your success pipeline...</p>
                    </div>
                ) : leads.length === 0 ? (
                    <div style={{
                        padding: '80px 40px', textAlign: 'center', background: '#fff',
                        borderRadius: '24px', border: '2px dashed #E2E8F0'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>✨</div>
                        <h2 style={{ color: '#1E293B', marginBottom: '8px' }}>Your queue is clear!</h2>
                        <p style={{ color: '#64748B' }}>Fresh leads will appear here as soon as they are assigned.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {leads.map((lead, idx) => {
                                const isOpen = activeLead === lead._id;
                                const form = formState[lead._id] || {};
                                const history = callHistory[lead._id] || [];
                                const demoNeeded = ["interested", "callback_requested"].includes(form.callOutcome);

                                return (
                                    <div key={lead._id} style={{
                                        ...styles.leadCard,
                                        ...(isOpen ? styles.leadCardActive : {})
                                    }}>
                                        {/* Summary Row */}
                                        <div
                                            onClick={() => toggleRow(lead)}
                                            style={{
                                                padding: '20px 24px', display: 'flex', alignItems: 'center',
                                                cursor: 'pointer', background: isOpen ? '#F8FAFC' : '#fff',
                                                transition: 'background 0.2s ease'
                                            }}
                                        >
                                            <div style={{ width: '40px', color: '#94A3B8', fontWeight: '700', fontSize: '14px' }}>
                                                {String((currentPage - 1) * limit + idx + 1).padStart(2, '0')}
                                            </div>

                                            <div style={{ flex: 2 }}>
                                                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E293B' }}>{lead.full_name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                    <div style={{ fontSize: '13px', color: '#64748B' }}>{lead.phone_number}</div>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <a
                                                            href={`https://wa.me/${lead.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.full_name}, this is from Krutanic`)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Message on WhatsApp"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                width: '32px', height: '32px', borderRadius: '50%', background: '#25D366',
                                                                color: '#fff', fontSize: '18px', textDecoration: 'none', transition: 'transform 0.2s ease',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        >
                                                            <i className="fa fa-whatsapp"></i>
                                                        </a>
                                                        <a
                                                            href={`mailto:${lead.email}?subject=Regarding Your Inquiry - Krutanic&body=${encodeURIComponent(`Hello ${lead.full_name},\n\nI hope you are doing well.`)}`}
                                                            title="Send Email"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                width: '32px', height: '32px', borderRadius: '50%', background: '#3B82F6',
                                                                color: '#fff', fontSize: '16px', textDecoration: 'none', transition: 'transform 0.2s ease',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        >
                                                            <i className="fa fa-envelope"></i>
                                                        </a>
                                                        <button
                                                            title="Dial on Mobile App"
                                                            onClick={(e) => { e.stopPropagation(); handleRemoteDial(lead._id); }}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                                                                width: '32px', height: '32px', borderRadius: '50%', background: '#F59E0B',
                                                                color: '#fff', fontSize: '15px', textDecoration: 'none', transition: 'transform 0.2s ease',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        >
                                                            <i className="fa fa-phone"></i>
                                                        </button>
                                                        <a
                                                            href="https://meet.google.com/new"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Start Google Meet"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                width: '32px', height: '32px', borderRadius: '50%', background: '#EA4335',
                                                                color: '#fff', fontSize: '16px', textDecoration: 'none', transition: 'transform 0.2s ease',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        >
                                                            <i className="fa fa-video-camera"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '30px' }}>
                                                <div style={{ minWidth: '100px' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Domain</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{lead.opted_domain || 'General'}</div>
                                                </div>
                                                <div style={{ minWidth: '100px' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Organization</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#64748B' }}>{lead.company_name || 'Individual'}</div>
                                                </div>
                                                <div style={{ minWidth: '100px' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Assigned Date</div>
                                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#64748B' }}>{lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                                                <StatusBadge status={lead.status} />
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%', background: isOpen ? '#3B82F6' : '#F1F5F9',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? '#fff' : '#64748B',
                                                    fontSize: '12px', transition: 'all 0.3s ease'
                                                }}>
                                                    {isOpen ? '▲' : '▼'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Panel */}
                                        {isOpen && (
                                            <div style={{
                                                padding: '32px', background: '#fff', borderTop: '1px solid #F1F5F9',
                                                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '30px'
                                            }}>
                                                {/* LEFT 1: Lead Details */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRight: '1px solid #F1F5F9', paddingRight: '20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ padding: '8px', background: '#10B98115', borderRadius: '10px', color: '#10B981' }}>👤</div>
                                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>Lead Details</h3>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        {[
                                                            { label: 'Email', value: lead.email },
                                                            { label: 'Background', value: lead.education_background },
                                                            { label: 'Current Status', value: lead.current_status },
                                                            { label: 'Upskilling Ready', value: lead.upskilling_ready },
                                                            { label: 'Start Timeframe', value: lead.start_timeframe },
                                                        ].map((item, i) => (
                                                            <div key={i}>
                                                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
                                                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155', wordBreak: 'break-all' }}>{item.value || 'N/A'}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* MIDDLE: Log Form */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ padding: '8px', background: '#3B82F615', borderRadius: '10px', color: '#3B82F6' }}>📞</div>
                                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>Log Call Activity</h3>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Outcome of the call</label>
                                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                            {CALL_OUTCOMES.map(o => (
                                                                <button
                                                                    key={o.value}
                                                                    onClick={() => updateForm(lead._id, 'callOutcome', o.value)}
                                                                    style={styles.outcomeBtn(form.callOutcome === o.value, o.color)}
                                                                >
                                                                    {o.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Interaction Summary</label>
                                                            <textarea
                                                                style={{ ...styles.input, height: '100px', resize: 'none' }}
                                                                placeholder="Summarize the discussion..."
                                                                value={form.summary || ""}
                                                                onChange={e => updateForm(lead._id, 'summary', e.target.value)}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Internal Remark</label>
                                                                <input
                                                                    style={styles.input}
                                                                    placeholder="Note for reference..."
                                                                    value={form.remark || ""}
                                                                    onChange={e => updateForm(lead._id, 'remark', e.target.value)}
                                                                />
                                                            </div>
                                                            {demoNeeded && (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#3B82F6' }}>📅 Demo Date</label>
                                                                    <input
                                                                        type="datetime-local"
                                                                        style={{ ...styles.input, borderColor: '#3B82F6', background: '#3B82F605' }}
                                                                        value={form.demoScheduleDate || ""}
                                                                        onChange={e => updateForm(lead._id, 'demoScheduleDate', e.target.value)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        disabled={submitting === lead._id || !form.callOutcome}
                                                        onClick={() => handleLogCall(lead)}
                                                        style={{
                                                            marginTop: '8px', padding: '16px', borderRadius: '14px', border: 'none',
                                                            background: !form.callOutcome ? '#F1F5F9' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                                            color: !form.callOutcome ? '#94A3B8' : '#fff',
                                                            fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                                                            transition: 'all 0.2s ease', boxShadow: form.callOutcome ? '0 10px 15px -3px rgba(37, 99, 235, 0.4)' : 'none'
                                                        }}
                                                    >
                                                        {submitting === lead._id ? "Synchronizing..." : "🚀 Finalize Call Log"}
                                                    </button>
                                                </div>

                                                {/* RIGHT: History */}
                                                <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '40px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                                        <div style={{ padding: '8px', background: '#64748B15', borderRadius: '10px', color: '#64748B' }}>📜</div>
                                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>Call Timeline</h3>
                                                    </div>

                                                    {history.length === 0 ? (
                                                        <div style={{
                                                            height: '100%', display: 'flex', flexDirection: 'column',
                                                            alignItems: 'center', justifyContent: 'center', color: '#94A3B8'
                                                        }}>
                                                            <div style={{ fontSize: '32px' }}>🌑</div>
                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>No previous records found</p>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '12px' }}>
                                                            {history.map((act, i) => {
                                                                const outcome = CALL_OUTCOMES.find(o => o.value === act.callOutcome);
                                                                const isLogExpanded = expandedLogId === act._id;
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        onClick={() => setExpandedLogId(isLogExpanded ? null : act._id)}
                                                                        style={{
                                                                            padding: '16px', borderRadius: '16px', background: '#F8FAFC',
                                                                            border: isLogExpanded ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                                                                            position: 'relative', cursor: 'pointer',
                                                                            transition: 'all 0.2s ease',
                                                                            boxShadow: isLogExpanded ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                                                                        }}
                                                                    >
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                                            <span style={{ fontSize: '12px', fontWeight: '800', color: outcome?.color || '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                {outcome?.label || act.callOutcome}
                                                                                {isLogExpanded ? ' ▲' : ' ▼'}
                                                                            </span>
                                                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>
                                                                                {new Date(act.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                            </span>
                                                                        </div>

                                                                        {act.demoScheduleDate && (
                                                                            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#3B82F6', fontWeight: '700', padding: '4px 8px', background: '#3B82F610', borderRadius: '6px', display: 'inline-block' }}>
                                                                                📅 Demo: {new Date(act.demoScheduleDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                            </div>
                                                                        )}

                                                                        <p style={{
                                                                            margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5',
                                                                            display: '-webkit-box', WebkitLineClamp: isLogExpanded ? 'unset' : '2', WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden'
                                                                        }}>
                                                                            <strong>Summary:</strong> {act.summary || 'No summary provided'}
                                                                        </p>

                                                                        {act.recordingUrl && (
                                                                            <div style={{ marginTop: '10px' }}>
                                                                                <audio controls style={{ width: '100%', height: '30px' }}>
                                                                                    <source src={act.recordingUrl} type="audio/mp4" />
                                                                                    Your browser does not support the audio element.
                                                                                </audio>
                                                                            </div>
                                                                        )}

                                                                        {isLogExpanded && (
                                                                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                {act.duration !== undefined && (
                                                                                    <div style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                        <strong style={{ color: '#1E293B' }}>⏱️ Duration:</strong>
                                                                                        {Math.floor(act.duration / 60)}m {act.duration % 60}s
                                                                                    </div>
                                                                                )}
                                                                                {act.remark && (
                                                                                    <div style={{ fontSize: '13px', color: '#475569' }}>
                                                                                        <strong style={{ color: '#1E293B' }}>Internal Remark:</strong> {act.remark}
                                                                                    </div>
                                                                                )}
                                                                                <div style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                                                                                    Logged by {act.specialistName || 'Specialist'}
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
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination UI */}
                        <div style={styles.pagination}>
                            <div style={{ fontSize: '14px', color: '#64748B' }}>
                                Showing <strong>{(currentPage - 1) * limit + 1}</strong> - <strong>{Math.min(currentPage * limit, totalCount)}</strong> of <strong>{totalCount}</strong> leads
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0',
                                        background: currentPage === 1 ? '#F1F5F9' : '#fff',
                                        color: currentPage === 1 ? '#94A3B8' : '#1E293B',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600'
                                    }}
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '10px',
                                                    border: '1px solid',
                                                    borderColor: currentPage === p ? '#3B82F6' : '#E2E8F0',
                                                    background: currentPage === p ? '#3B82F6' : '#fff',
                                                    color: currentPage === p ? '#fff' : '#1E293B',
                                                    fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {p}
                                            </button>
                                        );
                                    } else if (p === currentPage - 3 || p === currentPage + 3) {
                                        return <span key={p} style={{ width: '40px', textAlign: 'center', color: '#94A3B8' }}>...</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0',
                                        background: currentPage === totalPages ? '#F1F5F9' : '#fff',
                                        color: currentPage === totalPages ? '#94A3B8' : '#1E293B',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '600'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdvLeadsBook;
