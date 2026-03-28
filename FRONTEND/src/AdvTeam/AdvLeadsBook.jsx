import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

const CALL_OUTCOMES = [
    { value: "fresh", label: "🆕 Fresh Leads", color: "#64748B", icon: "fiber_new" },
    { value: "interested", label: "✅ Interested", color: "#10B981", icon: "check_circle" },
    { value: "follow_up", label: "📞 Follow Up", color: "#3B82F6", icon: "call" },
    { value: "callback_requested", label: "🔄 Callback Requested", color: "#8B5CF6", icon: "history" },
    { value: "no_answer", label: "📵 No Answer", color: "#F59E0B", icon: "phone_disabled" },
    { value: "not_interested", label: "❌ Not Interested", color: "#EF4444", icon: "cancel" },
    { value: "junk", label: "🗑️ Junk Leads", color: "#94A3B8", icon: "delete" },
    { value: "converted", label: "🏆 Converted", color: "#EC4899", icon: "stars" },
    { value: "unused", label: "🚫 Unused", color: "#CBD5E1", icon: "block" },
];

const designTokens = {
    colors: {
        primary: "#6366F1", // Indigo
        secondary: "#A855F7", // Purple
        accent: "#F43F5E", // Rose
        background: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
    },
    shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    radius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
    }
};

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

    const handleRemoteDial = (phoneNumber) => {
        const dialNumber = String(phoneNumber || "").replace(/\D/g, "");
        if (!dialNumber) {
            toast.error("Phone number is not available.");
            return;
        }
        window.location.href = `tel:${dialNumber}`;
    };

    const StatusBadge = ({ status }) => {
        const getStyles = (s) => {
            const map = {
                fresh: { color: designTokens.colors.textSecondary },
                assigned_to_manager: { color: designTokens.colors.warning },
                assigned_to_leader: { color: designTokens.colors.secondary },
                assigned_to_specialist: { color: designTokens.colors.info },
                in_followup: { color: "#08979C" },
                converted: { color: designTokens.colors.success },
                closed: { color: designTokens.colors.textSecondary }
            };
            return map[s] || { color: designTokens.colors.textSecondary };
        };
        const styles_badge = getStyles(status);
        return (
            <span style={styles.badge(styles_badge.color)}>
                {status?.replace(/_/g, ' ')}
            </span>
        );
    };

    const styles = {
        container: {
            padding: '40px',
            marginLeft: '270px',
            background: designTokens.colors.background,
            minHeight: '100vh',
            fontFamily: "'Lexend', 'Inter', sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            gap: '16px',
            maxWidth: '100%',
            overflow: 'hidden'
        },
        titleSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        title: {
            fontSize: '32px',
            fontWeight: '800',
            color: designTokens.colors.textPrimary,
            margin: 0,
            letterSpacing: '-0.025em',
            background: `linear-gradient(135deg, ${designTokens.colors.primary}, ${designTokens.colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        subtitle: {
            fontSize: '14px',
            color: designTokens.colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
        },
        statsRow: {
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexShrink: 0
        },
        statCard: {
            padding: '10px 16px',
            background: '#FFFFFF',
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: designTokens.shadows.sm
        },
        filterRow: {
            display: 'flex', 
            gap: '6px', 
            alignItems: 'center',
            background: '#fff',
            padding: '4px',
            borderRadius: '16px',
            border: `1px solid ${designTokens.colors.border}`,
            boxShadow: designTokens.shadows.sm,
            overflowX: 'auto',
            flex: '1',
            minWidth: '200px',
            maxWidth: 'calc(100vw - 920px)', // Increased to account for the new 'Unused' filter item
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        },
        filterBtn: (active, color) => ({
            padding: '8px 16px',
            height: '40px',
            borderRadius: '12px',
            background: active ? `${color}15` : 'transparent',
            color: active ? color : designTokens.colors.textSecondary,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            fontWeight: active ? '700' : '600',
            fontSize: '13px',
            border: active ? `1px solid ${color}30` : '1px solid transparent'
        }),
        leadCard: {
            background: designTokens.colors.surface,
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.border}`,
            marginBottom: '16px',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: designTokens.shadows.sm,
            position: 'relative'
        },
        leadCardActive: {
            boxShadow: designTokens.shadows.xl,
            borderColor: designTokens.colors.primary,
            transform: 'translateY(-2px)',
        },
        summaryRow: (isActive) => ({
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            background: isActive ? 'linear-gradient(to right, #F8FAFC, #FFFFFF)' : '#FFFFFF',
            transition: 'all 0.3s ease',
            position: 'relative',
            zIndex: 1
        }),
        outcomeBtn: (active, color) => ({
            padding: '10px 18px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            border: `2px solid ${active ? color : designTokens.colors.border}`,
            background: active ? `${color}15` : designTokens.colors.surface,
            color: active ? color : designTokens.colors.textSecondary,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: active ? `0 4px 12px ${color}20` : 'none',
            transform: active ? 'translateY(-1px)' : 'none'
        }),
        input: {
            width: '100%',
            padding: '14px 18px',
            borderRadius: '14px',
            border: `1.5px solid ${designTokens.colors.border}`,
            fontSize: '14px',
            color: designTokens.colors.textPrimary,
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
            background: '#F9FAFB',
            fontFamily: 'Inter, sans-serif'
        },
        inputFocus: {
            borderColor: designTokens.colors.primary,
            boxShadow: `0 0 0 4px ${designTokens.colors.primary}15`,
            background: designTokens.colors.surface
        },
        pagination: {
            marginTop: '40px',
            padding: '24px 32px',
            borderRadius: '24px',
            background: '#fff',
            boxShadow: designTokens.shadows.sm,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: `1px solid ${designTokens.colors.border}`,
        },
        pageBtn: (isActive, disabled) => ({
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isActive ? designTokens.colors.primary : (disabled ? '#F8FAFC' : '#fff'),
            color: isActive ? '#fff' : (disabled ? '#CBD5E1' : designTokens.colors.textPrimary),
            fontWeight: '800',
            fontSize: '14px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? `0 8px 16px ${designTokens.colors.primary}30` : 'none',
            border: isActive ? 'none' : `1px solid ${designTokens.colors.border}`,
        }),
        navBtn: (disabled) => ({
            padding: '0 20px',
            height: '40px',
            borderRadius: '12px',
            border: `1px solid ${designTokens.colors.border}`,
            background: disabled ? '#F8FAFC' : '#fff',
            color: disabled ? '#CBD5E1' : designTokens.colors.textPrimary,
            fontWeight: '700',
            fontSize: '13px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }),
        actionPanel: {
            padding: '40px',
            background: '#FFFFFF',
            borderTop: `1px solid ${designTokens.colors.border}`,
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(400px, 2fr) minmax(300px, 1.2fr)',
            gap: '40px',
            animation: 'fadeIn 0.5s ease'
        },
        badge: (color) => ({
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '700',
            background: `${color}10`,
            color: color,
            border: `1px solid ${color}30`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }),
        timelineItem: (isActive) => ({
            padding: '20px',
            borderRadius: '16px',
            background: isActive ? '#F8FAFC' : 'transparent',
            border: `1px solid ${isActive ? designTokens.colors.primary + '40' : designTokens.colors.border}`,
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginLeft: '12px'
        }),
        iconBtn: (color) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: color,
            color: '#fff',
            fontSize: '18px',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 4px 6px ${color}30`,
            border: 'none',
            cursor: 'pointer'
        })
    };

    const globalStyles = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spinning {
            animation: spin 2s linear infinite;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: ${designTokens.colors.primary} !important;
            box-shadow: 0 0 0 4px ${designTokens.colors.primary}15 !important;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: ${designTokens.colors.border};
            border-radius: 10px;
        }
        .filter-row::-webkit-scrollbar {
            display: none;
        }
    `;

    return (
        <div id="create-marketing-team" style={styles.container}>
            <Toaster position="top-center" />

            <header style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Leads Portfolio</h1>
                    <div style={styles.subtitle}>
                        <span style={{ width: '10px', height: '10px', background: designTokens.colors.success, borderRadius: '50%', boxShadow: `0 0 12px ${designTokens.colors.success}50` }}></span>
                        {userName} • <span style={{ color: designTokens.colors.primary, fontWeight: '700' }}>{designation}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={styles.filterRow} className="filter-row">
                             {/* Date Picker Section */}
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', borderRight: `1px solid ${designTokens.colors.border}` }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: designTokens.colors.textSecondary }}>event</span>
                                <input 
                                    type="date" 
                                    value={dateFilter} 
                                    onChange={e => { setDateFilter(e.target.value); setCurrentPage(1); }} 
                                    style={{ 
                                        border: 'none', 
                                        background: 'transparent', 
                                        fontSize: '13px', 
                                        fontWeight: '700', 
                                        color: designTokens.colors.textPrimary,
                                        outline: 'none',
                                        cursor: 'pointer'
                                    }} 
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => setSelectedOutcome("")}
                                    style={styles.filterBtn(selectedOutcome === "", designTokens.colors.primary)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>list_alt</span>
                                    <span>All Records</span>
                                </button>
                                {CALL_OUTCOMES.map(o => (
                                    <button
                                        key={o.value}
                                        onClick={() => setSelectedOutcome(o.value)}
                                        style={styles.filterBtn(selectedOutcome === o.value, o.color)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{o.icon}</span>
                                        <span>{o.label.split(' ').slice(1).join(' ')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.statsRow}>
                            <div style={styles.statCard}>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: designTokens.colors.primary }}>{totalCount}</span>
                                <span style={{ fontSize: '9px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Group</span>
                            </div>
                            <button
                            onClick={() => fetchMyLeads(1)}
                            className={`material-symbols-outlined ${loading ? 'spinning' : ''}`}
                            style={{ 
                                ...styles.statCard, 
                                cursor: 'pointer', 
                                background: designTokens.colors.surface, 
                                color: loading ? designTokens.colors.primary : designTokens.colors.textSecondary,
                                fontSize: '24px',
                                width: '48px',
                                height: '48px',
                                padding: 0,
                                borderRadius: '14px'
                            }}
                            title="Sync Leads"
                        >
                            sync
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
                                const demoNeeded = ["interested", "callback_requested", "follow_up"].includes(form.callOutcome);

                                return (
                                    <div key={lead._id} style={{
                                        ...styles.leadCard,
                                        ...(isOpen ? styles.leadCardActive : {})
                                    }}>
                                                                         <div
                                            onClick={() => toggleRow(lead)}
                                            style={styles.summaryRow(isOpen)}
                                        >
                                            <div style={{ width: '48px', color: designTokens.colors.textSecondary, fontWeight: '800', fontSize: '14px', opacity: 0.5 }}>
                                                {String((currentPage - 1) * limit + idx + 1).padStart(2, '0')}
                                            </div>

                                            <div style={{ flex: 2 }}>
                                                <div style={{ fontWeight: '800', fontSize: '18px', color: designTokens.colors.textPrimary, letterSpacing: '-0.01em' }}>{lead.full_name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                    <div style={{ fontSize: '13px', color: designTokens.colors.textSecondary, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>call</span>
                                                        {lead.phone_number}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <a
                                                            href={`https://wa.me/${lead.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.full_name}, this is from Krutanic`)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="WhatsApp"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={styles.iconBtn('#25D366')}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            <i className="fa fa-whatsapp"></i>
                                                        </a>
                                                        <a
                                                            href={`mailto:${lead.email}?subject=Regarding Your Inquiry - Krutanic&body=${encodeURIComponent(`Hello ${lead.full_name},\n\nI hope you are doing well.`)}`}
                                                            title="Email"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={styles.iconBtn(designTokens.colors.info)}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            <i className="fa fa-envelope"></i>
                                                        </a>
                                                        <button
                                                            title="Dial"
                                                            onClick={(e) => { e.stopPropagation(); handleRemoteDial(lead.phone_number); }}
                                                            style={styles.iconBtn(designTokens.colors.warning)}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            <i className="fa fa-phone"></i>
                                                        </button>
                                                        <a
                                                            href="https://meet.google.com/new"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Video Meet"
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={styles.iconBtn('#EA4335')}
                                                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                                        >
                                                            <i className="fa fa-video-camera"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ flex: 2.5, display: 'flex', alignItems: 'center', gap: '40px' }}>
                                                <div style={{ minWidth: '120px' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Target Domain</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '700', color: designTokens.colors.textPrimary }}>{lead.opted_domain || 'General'}</div>
                                                </div>
                                                <div style={{ minWidth: '120px' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Entity</div>
                                                    <div style={{ fontSize: '14px', fontWeight: '600', color: designTokens.colors.textSecondary }}>{lead.company_name || 'Individual'}</div>
                                                </div>
                                                <div style={{ minWidth: '130px' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Assigned On</div>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', color: designTokens.colors.textSecondary }}>{lead.assigned_at ? new Date(lead.assigned_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')}</div>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
                                                <StatusBadge status={lead.status} />
                                                <div className="material-symbols-outlined" style={{
                                                    width: '32px', height: '32px', borderRadius: '10px', background: isOpen ? designTokens.colors.primary : designTokens.colors.background,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: isOpen ? '#fff' : designTokens.colors.textSecondary,
                                                    fontSize: '20px', transition: 'all 0.3s ease', cursor: 'pointer',
                                                    boxShadow: isOpen ? `0 4px 12px ${designTokens.colors.primary}40` : 'none'
                                                }}>
                                                    {isOpen ? 'expand_less' : 'expand_more'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Panel */}
                                        {isOpen && (
                                            <div style={styles.actionPanel}>
                                                {/* COLUMN 1: Lead Intelligence */}
                                                <div style={{ borderRight: `1px solid ${designTokens.colors.border}`, paddingRight: '32px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                                        <div style={{ padding: '10px', background: `${designTokens.colors.success}15`, borderRadius: '12px', color: designTokens.colors.success }}>
                                                            <span className="material-symbols-outlined">analytics</span>
                                                        </div>
                                                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: designTokens.colors.textPrimary }}>Intelligence</h3>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                        {[
                                                            { label: 'Primary Contact', value: lead.email, icon: 'mail' },
                                                            { label: 'Workplace', value: lead.company_name, icon: 'business' },
                                                            { label: 'Educational Background', value: lead.education_background, icon: 'school' },
                                                            { label: 'Growth Readiness', value: lead.upskilling_ready, icon: 'trending_up' },
                                                            { label: 'Source Stream', value: lead.source?.replace(/_/g, ' '), icon: 'hub' },
                                                        ].map((item, i) => (
                                                            item.value && (
                                                                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: designTokens.colors.textSecondary, marginTop: '2px' }}>{item.icon}</span>
                                                                    <div>
                                                                        <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>{item.label}</div>
                                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textPrimary, wordBreak: 'break-all' }}>{item.value}</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                        
                                                        {lead.extra_fields && Object.keys(lead.extra_fields).length > 0 && (
                                                            <div style={{ borderTop: `1px dashed ${designTokens.colors.border}`, marginTop: '10px', paddingTop: '20px' }}>
                                                                <div style={{ display: 'grid', gap: '16px' }}>
                                                                    {Object.entries(lead.extra_fields).map(([key, val]) => (
                                                                        <div key={key}>
                                                                            <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}>{key.replace(/_/g, ' ')}</div>
                                                                            <div style={{ fontSize: '13px', fontWeight: '600', color: designTokens.colors.textPrimary }}>{val || '—'}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* COLUMN 2: Interaction Hub */}
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                                        <div style={{ padding: '10px', background: `${designTokens.colors.primary}15`, borderRadius: '12px', color: designTokens.colors.primary }}>
                                                            <span className="material-symbols-outlined">call_log</span>
                                                        </div>
                                                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: designTokens.colors.textPrimary }}>Interaction Hub</h3>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                            <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Current Disposition</label>
                                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                {CALL_OUTCOMES.map(o => (
                                                                    <button
                                                                        key={o.value}
                                                                        onClick={() => updateForm(lead._id, 'callOutcome', o.value)}
                                                                        style={styles.outcomeBtn(form.callOutcome === o.value, o.color)}
                                                                    >
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{o.icon}</span>
                                                                        {o.label.replace(/[^a-zA-Z\s]/g, '').trim()}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Executive Summary</label>
                                                                <textarea
                                                                    style={{ ...styles.input, height: '140px', resize: 'none' }}
                                                                    placeholder="Detail the conversation highlights..."
                                                                    value={form.summary || ""}
                                                                    onChange={e => updateForm(lead._id, 'summary', e.target.value)}
                                                                />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                    <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Internal Notes</label>
                                                                    <input
                                                                        style={styles.input}
                                                                        placeholder="Private remarks..."
                                                                        value={form.remark || ""}
                                                                        onChange={e => updateForm(lead._id, 'remark', e.target.value)}
                                                                    />
                                                                </div>
                                                                {demoNeeded && (
                                                                    <div style={{ 
                                                                        display: 'flex', 
                                                                        flexDirection: 'column', 
                                                                        gap: '10px', 
                                                                        padding: '16px', 
                                                                        background: `${designTokens.colors.info}10`, 
                                                                        borderRadius: '16px',
                                                                        border: `1px solid ${designTokens.colors.info}30`
                                                                    }}>
                                                                        <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.info, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                                                                            Schedule Session
                                                                        </label>
                                                                        <input
                                                                            type="datetime-local"
                                                                            style={{ ...styles.input, border: 'none', background: '#FFFFFF', padding: '10px 14px' }}
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
                                                                marginTop: '12px', 
                                                                padding: '18px', 
                                                                borderRadius: '16px', 
                                                                border: 'none',
                                                                background: !form.callOutcome ? designTokens.colors.border : `linear-gradient(135deg, ${designTokens.colors.primary}, ${designTokens.colors.secondary})`,
                                                                color: '#fff',
                                                                fontWeight: '800', 
                                                                fontSize: '16px', 
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease', 
                                                                boxShadow: form.callOutcome ? `0 12px 24px ${designTokens.colors.primary}40` : 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '12px'
                                                            }}
                                                        >
                                                            {submitting === lead._id ? (
                                                                <span className="material-symbols-outlined spinning">sync</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined">rocket_launch</span>
                                                            )}
                                                            {submitting === lead._id ? "Processing..." : "Commit Interaction"}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* COLUMN 3: Historical Timeline */}
                                                <div style={{ borderLeft: `1px solid ${designTokens.colors.border}`, paddingLeft: '32px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                                        <div style={{ padding: '10px', background: `${designTokens.colors.textSecondary}15`, borderRadius: '12px', color: designTokens.colors.textSecondary }}>
                                                            <span className="material-symbols-outlined">history</span>
                                                        </div>
                                                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: designTokens.colors.textPrimary }}>Timeline</h3>
                                                    </div>

                                                    {history.length === 0 ? (
                                                        <div style={{
                                                            height: '240px', display: 'flex', flexDirection: 'column',
                                                            alignItems: 'center', justifyContent: 'center', color: designTokens.colors.textSecondary,
                                                            background: designTokens.colors.background,
                                                            borderRadius: '24px'
                                                        }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>inbox</span>
                                                            <p style={{ fontSize: '14px', fontWeight: '600', opacity: 0.6 }}>Fresh lead - No history</p>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                                                            {history.map((act, i) => {
                                                                const outcome = CALL_OUTCOMES.find(o => o.value === act.callOutcome);
                                                                const isLogExpanded = expandedLogId === act._id;
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        onClick={() => setExpandedLogId(isLogExpanded ? null : act._id)}
                                                                        style={styles.timelineItem(isLogExpanded)}
                                                                    >
                                                                        <div style={{ position: 'absolute', left: '-21px', top: '24px', width: '16px', height: '16px', borderRadius: '50%', background: outcome?.color || designTokens.colors.primary, border: '4px solid #fff', boxShadow: designTokens.shadows.sm }}></div>
                                                                        
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                                            <span style={{ fontSize: '11px', fontWeight: '900', color: outcome?.color || designTokens.colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                                {outcome?.label.replace(/[^a-zA-Z\s]/g, '').trim() || act.callOutcome}
                                                                            </span>
                                                                            <span style={{ fontSize: '11px', fontWeight: '700', color: designTokens.colors.textSecondary }}>
                                                                                {new Date(act.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                                            </span>
                                                                        </div>

                                                                        {act.demoScheduleDate && (
                                                                            <div style={{ marginBottom: '10px', fontSize: '11px', color: designTokens.colors.info, fontWeight: '800', padding: '6px 10px', background: `${designTokens.colors.info}10`, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                                                                {new Date(act.demoScheduleDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                            </div>
                                                                        )}

                                                                        <p style={{
                                                                            margin: 0, fontSize: '13px', color: designTokens.colors.textPrimary, lineHeight: '1.6',
                                                                            fontWeight: '500', display: '-webkit-box', WebkitLineClamp: isLogExpanded ? 'unset' : '2', WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden'
                                                                        }}>
                                                                            {act.summary || 'Summary not recorded'}
                                                                        </p>

                                                                        {isLogExpanded && (
                                                                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px dashed ${designTokens.colors.border}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                                {act.remark && (
                                                                                    <div style={{ fontSize: '12px', color: designTokens.colors.textSecondary }}>
                                                                                        <strong style={{ color: designTokens.colors.textPrimary }}>Notes:</strong> {act.remark}
                                                                                    </div>
                                                                                )}
                                                                                <div style={{ fontSize: '11px', color: designTokens.colors.textSecondary, fontStyle: 'italic', fontWeight: '500' }}>
                                                                                    Recorded by {act.specialistName || 'System'}
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
                            <div style={{ color: designTokens.colors.textSecondary, fontSize: '14px', fontWeight: '600' }}>
                                Showing <span style={{ color: designTokens.colors.textPrimary, fontWeight: '800' }}>{(currentPage - 1) * limit + 1}</span> to <span style={{ color: designTokens.colors.textPrimary, fontWeight: '800' }}>{Math.min(currentPage * limit, totalCount)}</span> of <span style={{ color: designTokens.colors.textPrimary, fontWeight: '800' }}>{totalCount}</span> records
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={styles.navBtn(currentPage === 1)}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
                                    Previous
                                </button>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        const isEdge = p === 1 || p === totalPages;
                                        const isNear = Math.abs(p - currentPage) <= 1;
                                        
                                        if (isEdge || isNear) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => handlePageChange(p)}
                                                    style={styles.pageBtn(currentPage === p, false)}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        } else if (p === currentPage - 2 || p === currentPage + 2) {
                                            return <span key={p} style={{ width: '32px', textAlign: 'center', color: designTokens.colors.textSecondary, fontWeight: 'bold' }}>• •</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={styles.navBtn(currentPage === totalPages)}
                                >
                                    Next
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                                </button>
                            </div>
                        </div>

                        <style>{globalStyles}</style>
                    </>
                )}
            </div>

            {/* Float Stats Bar */}
            <div style={{
                position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(12px)',
                padding: '12px 24px', borderRadius: '100px', display: 'flex', gap: '40px',
                color: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                zIndex: 1000, border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: designTokens.colors.success }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{totalCount} Active Leads</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: designTokens.colors.warning }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>Page {currentPage} of {totalPages}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: designTokens.colors.primary }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>Refresh Sync Active</span>
                </div>
            </div>
        </div>
    );
};

export default AdvLeadsBook;
