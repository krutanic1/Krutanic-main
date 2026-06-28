import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

const STAGES_AND_DISPOSITIONS = {
    "Fresh Lead": ["New Lead", "Invalid Lead"],
    "Attempting Contact": ["RNR", "Callback Requested", "No Response (Multi-touch)"],
    "First Call Connected": ["In Conversation", "Demo Booked"],
    "Demo Conducted": ["Decision Pending", "Negotiation Review", "Expected Payment Date"],
    "Closed Won": ["Converted"],
    "Closed Lost": ["Irrelevant Lead", "Not Interested", "Pricing Does Not Match", "No Response"]
};

const ACTION_TYPES = [
    { value: "call", label: "📞 Call", icon: "call" },
    { value: "email", label: "📧 Email", icon: "mail" },
    { value: "whatsapp", label: "💬 WhatsApp", icon: "chat" },
    { value: "meeting", label: "🤝 Meeting", icon: "groups" },
    { value: "note", label: "📝 Note", icon: "note" }
];

const designTokens = {
    colors: {
        primary: "#6366F1", // Indigo
        secondary: "#8B5CF6", // Violet
        accent: "#F43F5E", // Rose
        background: "#F1F5F9",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#0EA5E9",
        royal: "#312E81",
        glass: "rgba(255, 255, 255, 0.7)"
    },
    shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        premium: "0 25px 50px -12px rgba(99, 102, 241, 0.12)"
    },
    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "30px",
    }
};

const AudioButton = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        const newAudio = new Audio(url);
        newAudio.addEventListener('ended', () => setIsPlaying(false));
        newAudio.addEventListener('pause', () => setIsPlaying(false));
        setAudio(newAudio);
        return () => {
            newAudio.pause();
        };
    }, [url]);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(console.error);
        }
    };

    return (
        <button
            onClick={togglePlay}
            style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isPlaying ? '#fce8e6' : '#e8f0fe',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', padding: 0
            }}
            title={isPlaying ? "Pause Recording" : "Play Recording"}
        >
            <span className="material-symbols-outlined" style={{ 
                color: isPlaying ? '#c5221f' : designTokens.colors.primary, 
                fontSize: '18px', 
                marginLeft: isPlaying ? '0px' : '2px' 
            }}>
                {isPlaying ? 'pause' : 'play_arrow'}
            </span>
        </button>
    );
};

const AdvFollowups = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [advTeamId, setAdvTeamId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userDesignation, setUserDesignation] = useState(null);
    
    // Action Panel State
    const [activeLead, setActiveLead] = useState(null);
    const [callHistory, setCallHistory] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [formState, setFormState] = useState({});
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [callStartTime, setCallStartTime] = useState(null);
    const [activeCallLeadId, setActiveCallLeadId] = useState(null);

    // Dummy states for features not needed here but referenced by ActionPanel
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedLeadForReassign, setSelectedLeadForReassign] = useState(null);
    const [selectedLeadForEmail, setSelectedLeadForEmail] = useState(null);
    const [emailRecipient, setEmailRecipient] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailDomain, setEmailDomain] = useState("");
    const [showEmailModal, setShowEmailModal] = useState(false);
    
    // Pagination dummy
    const limit = 100;
    const currentPage = 1;

    useEffect(() => {
        const storedId = localStorage.getItem("advTeamId");
        const storedName = localStorage.getItem("advTeamName");
        const storedDesig = localStorage.getItem("advTeamDesignation");
        if (storedId) {
            setAdvTeamId(storedId);
            setUserName(storedName);
            setUserDesignation(storedDesig);
        } else {
            toast.error("User ID not found. Please log in again.");
        }
    }, []);

    useEffect(() => {
        if (advTeamId) {
            fetchFollowups();
        }
    }, [advTeamId]);

    const fetchFollowups = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('advTeamToken');
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: {
                    userId: advTeamId,
                    role: userDesignation || "adv_team",
                    limit: 100, 
                    reminderOnly: true 
                }
            });
            if (res.data.success || res.data.leads) {
                setLeads(res.data.leads || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch follow-ups");
        } finally {
            setLoading(false);
        }
    };

    const isManager = (userDesignation || "").toLowerCase().includes("manager") || (userName || "").toLowerCase().includes("sumeetha");
    const userId = advTeamId;

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
        setFormState(prev => {
            const newState = {
                ...prev,
                [leadId]: { ...(prev[leadId] || {}), [field]: value }
            };
            // If stage changes, reset disposition
            if (field === "stage") {
                newState[leadId].disposition = "";
            }
            return newState;
        });
    };

    const handleLogCall = async (lead) => {
        const form = formState[lead._id] || {};
        if (!form.stage) { toast.error("Please select a lead stage"); return; }
        if (!form.disposition) { toast.error("Please select a disposition"); return; }
        if (!form.actionType) { toast.error("Please select an action type"); return; }
        if (!form.summary || form.summary.trim() === "") {
            toast.error("Executive Summary is mandatory. Please provide conversation highlights.");
            return;
        }

        // Mandatory rules
        if (form.disposition === "Callback Requested" && !form.followUpDate) {
            toast.error("Next Follow-up Date is mandatory for Callback Requested");
            return;
        }
        if (form.disposition === "Demo Booked" && !form.demoScheduleDate) {
            toast.error("Demo Date is required for Demo Booked");
            return;
        }

        setSubmitting(lead._id);
        try {
            await axios.post(`${API}/api/adv-leads/log-call-activity`, {
                leadId: lead._id,
                specialistId: userId,
                specialistName: userName,
                actionType: form.actionType,
                stage: form.stage,
                disposition: form.disposition,
                summary: form.summary || "",
                remark: form.remark || "",
                duration: activeCallLeadId === lead._id && callStartTime ? Math.floor((Date.now() - callStartTime) / 1000) : 0,
                demoScheduleDate: form.demoScheduleDate || undefined,
                followUpDate: form.followUpDate || undefined,
                expectedPaymentDate: form.expectedPaymentDate || undefined,
                isWeb: true
            });
            toast.success("Activity logged successfully!");
            setCallStartTime(null);
            setActiveCallLeadId(null);
            setFormState(prev => ({ ...prev, [lead._id]: {} }));
            setCallHistory(prev => { const n = { ...prev }; delete n[lead._id]; return n; });
            fetchHistory(lead._id);
            fetchFollowups();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to log activity");
        } finally {
            setSubmitting(null);
        }
    };

    const handleRemoteDial = async (phoneNumber, leadId) => {
        const dialNumber = String(phoneNumber || "").replace(/\D/g, "");
        if (!dialNumber) {
            toast.error("Phone number is not available.");
            return;
        }
        setCallStartTime(Date.now());
        setActiveCallLeadId(leadId);

        try {
            await axios.post(`${API}/api/adv-leads/remote-dial-request`, {
                specialistId: userId,
                leadId: leadId
            });
            toast.success("Dialing from your mobile app...");
        } catch (error) {
            console.error(error);
            toast.error("Failed to trigger mobile dialer. Dialing locally.");
            window.location.href = `tel:${dialNumber}`;
        }
    };

    // StatusBadge is defined after styles (see below)

    const styles = {
        container: {
            padding: '40px',
            marginLeft: '280px',
            background: designTokens.colors.background,
            minHeight: '100vh',
            fontFamily: "'Lexend', 'Inter', sans-serif"
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '32px',
            maxWidth: '100%',
        },
        headerTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
        },
        headerBottom: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            background: 'rgba(255, 255, 255, 0.4)',
            padding: '12px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
        },
        titleSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        title: {
            fontSize: '28px',
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
            height: '48px',
            padding: '0 16px',
            background: '#FFFFFF',
            borderRadius: designTokens.radius.md,
            border: `1px solid ${designTokens.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: designTokens.shadows.sm,
            minWidth: '100px'
        },
        filterRow: {
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            padding: '2px',
            borderRadius: '12px',
            border: `1px solid ${designTokens.colors.border}`,
            boxShadow: designTokens.shadows.sm,
            height: '48px',
            flex: '1',
            minWidth: '400px',
            overflow: 'hidden'
        },
        searchSection: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '0 12px',
            background: '#F8FAFC',
            height: '100%',
            flex: 1,
        },
        dateSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 15px',
            borderRight: `1px solid ${designTokens.colors.border}`,
            height: '100%',
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
        compactBtn: (active, color) => ({
            padding: '5px 12px',
            height: '32px',
            borderRadius: '10px',
            background: active ? `${color}15` : 'transparent',
            color: active ? color : designTokens.colors.textSecondary,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            fontWeight: active ? '700' : '600',
            fontSize: '12px',
            border: active ? `1px solid ${color}30` : '1px solid transparent'
        }),
        leadCard: {
            background: designTokens.colors.surface,
            borderRadius: designTokens.radius.lg,
            border: `1px solid ${designTokens.colors.border}`,
            marginBottom: '16px',
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
            position: 'relative',
        },
        leadCardActive: {
            boxShadow: designTokens.shadows.premium,
            borderColor: `${designTokens.colors.primary}40`,
            transform: 'scale(1.005) translateY(-4px)',
        },
        summaryRow: (isActive) => ({
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            background: isActive ? 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)' : '#FFFFFF',
            transition: 'all 0.4s ease',
            position: 'relative',
            zIndex: 1,
            borderLeft: isActive ? `6px solid ${designTokens.colors.primary}` : `6px solid transparent`
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
        iconBtn: (color, gradient) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: gradient || color,
            color: '#fff',
            fontSize: '20px',
            textDecoration: 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: `0 8px 16px ${color}25`,
            border: 'none',
            cursor: 'pointer',
        })
    };

    const StatusBadge = ({ lead }) => {
        const isManagerOrLeader = (userDesignation || "").toLowerCase().includes("manager") || (userDesignation || "").toLowerCase().includes("leader") || (userName || "").toLowerCase().includes("sumeetha");
        const displayStage = (lead.is_reactive && isManagerOrLeader) ? "Reactive Lead" : (lead.stage || "Fresh Lead");

        const getStyles = (s) => {
            const map = {
                "Fresh Lead": { color: "#64748B" },
                "Reactive Lead": { color: "#c41d7f" },
                "Attempting Contact": { color: designTokens.colors.warning },
                "First Call Connected": { color: designTokens.colors.info },
                "Demo Conducted": { color: designTokens.colors.secondary },
                "Closed Won": { color: designTokens.colors.success },
                "Closed Lost": { color: designTokens.colors.danger }
            };
            return map[s] || { color: designTokens.colors.textSecondary };
        };
        const styles_badge = getStyles(displayStage);
        return (
            <span style={styles.badge(styles_badge.color)}>
                {displayStage}
            </span>
        );
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
        <div id="create-marketing-team" style={{ padding: "24px", minHeight: "100vh", backgroundColor: designTokens.colors.background }}>
            <Toaster position="top-right" />
            
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: "700", color: designTokens.colors.textPrimary, margin: "0 0 8px 0" }}>
                            ⏰ Upcoming Follow-ups
                        </h1>
                        <p style={{ color: designTokens.colors.textSecondary, margin: 0 }}>
                            Prioritized list of leads you need to contact today.
                        </p>
                    </div>
                    <button 
                        onClick={fetchFollowups}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: designTokens.colors.surface,
                            border: `1px solid ${designTokens.colors.border}`,
                            borderRadius: designTokens.radius.md,
                            cursor: "pointer",
                            fontWeight: "500",
                            boxShadow: designTokens.shadows.sm
                        }}
                    >
                        🔄 Refresh List
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>Loading follow-ups...</div>
                ) : leads.length === 0 ? (
                    <div style={{ 
                        backgroundColor: designTokens.colors.surface, 
                        padding: "48px", 
                        borderRadius: designTokens.radius.lg,
                        textAlign: "center",
                        boxShadow: designTokens.shadows.sm
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                        <h3 style={{ margin: "0 0 8px 0", color: designTokens.colors.textPrimary }}>All Caught Up!</h3>
                        <p style={{ color: designTokens.colors.textSecondary }}>You have no pending follow-ups scheduled.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <a
                                                                    href={`https://wa.me/${lead.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.full_name}, this is from Krutanic`)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="WhatsApp"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    style={styles.iconBtn('#25D366', 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)')}
                                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(37, 211, 102, 0.4)'; }}
                                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 211, 102, 0.25)'; }}
                                                                >
                                                                    <i className="fa fa-whatsapp"></i>
                                                                </a>
                                                                <button
                                                                    title="Dial"
                                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoteDial(lead.phone_number, lead._id); }}
                                                                    style={{
                                                                        ...styles.iconBtn(designTokens.colors.warning, 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)'),
                                                                        border: activeCallLeadId === lead._id ? '2px solid white' : 'none',
                                                                        boxShadow: activeCallLeadId === lead._id ? `0 0 20px ${designTokens.colors.warning}` : styles.iconBtn(designTokens.colors.warning, 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)').boxShadow
                                                                    }}
                                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(255, 94, 98, 0.4)'; }}
                                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 94, 98, 0.25)'; }}
                                                                >
                                                                    <i className="fa fa-phone"></i>
                                                                </button>
                                                                <a
                                                                    href="https://meet.google.com/new"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="Video Meet"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    style={styles.iconBtn('#EA4335', 'linear-gradient(135deg, #EE0979 0%, #FF6A00 100%)')}
                                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(238, 9, 121, 0.4)'; }}
                                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(238, 9, 121, 0.25)'; }}
                                                                >
                                                                    <i className="fa fa-video-camera"></i>
                                                                </a>
                                                                <button
                                                                    title="Send Mail"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedLeadForEmail(lead);
                                                                        setEmailRecipient(lead.email || "");
                                                                        setEmailSubject(`Registration Confirmation - ${lead.opted_domain || "General"} | Krutanic`);
                                                                        setEmailDomain(lead.opted_domain || "General");
                                                                        setShowEmailModal(true);
                                                                    }}
                                                                    style={styles.iconBtn(designTokens.colors.primary, 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)')}
                                                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 180, 219, 0.4)'; }}
                                                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 180, 219, 0.25)'; }}
                                                                >
                                                                    <i className="fa fa-envelope"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ flex: 3.5, display: 'flex', alignItems: 'center', gap: '30px' }}>
                                                        <div style={{ minWidth: '140px' }}>
                                                            <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>terminal</span> Target Domain
                                                            </div>
                                                            <div style={{ fontSize: '15px', fontWeight: '800', color: designTokens.colors.textPrimary, letterSpacing: '-0.01em' }}>{lead.opted_domain || 'General'}</div>
                                                        </div>
                                                        {!isManager && (
                                                            <div style={{ minWidth: '110px' }}>
                                                                <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>corporate_fare</span> Entity
                                                                </div>
                                                                <div style={{ fontSize: '14px', fontWeight: '700', color: designTokens.colors.textSecondary }}>{lead.company_name || 'Individual'}</div>
                                                            </div>
                                                        )}
                                                        <div style={{ minWidth: '130px' }}>
                                                            <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history_toggle_off</span> Created On
                                                            </div>
                                                            <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textPrimary }}>{lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
                                                        </div>
                                                        <div style={{ minWidth: '130px' }}>
                                                            <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>assignment_ind</span> Assigned On
                                                            </div>
                                                            <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textPrimary }}>{lead.assigned_at ? new Date(lead.assigned_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
                                                        {lead.last_recording_url && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                                                                <AudioButton url={lead.last_recording_url} />
                                                            </div>
                                                        )}
                                                        {isManager && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSelectedLeadForReassign(lead); setShowReassignModal(true); }}
                                                                style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${designTokens.colors.primary}`, background: '#fff', color: designTokens.colors.primary, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>swap_horiz</span> Reassign
                                                            </button>
                                                        )}
                                                        <StatusBadge lead={lead} />
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

                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '20px',
                                                                maxHeight: '600px',
                                                                overflowY: 'auto',
                                                                paddingRight: '12px',
                                                                scrollbarWidth: 'thin'
                                                            }}>
                                                                {[
                                                                    { label: 'Pipeline Stage', value: lead.stage, icon: 'account_tree' },
                                                                    { label: 'Disposition', value: lead.disposition, icon: 'label_important' },
                                                                     { label: 'Contact Attempts', value: `${lead.attempt_count || 0} Attempts`, icon: 'call_log' },
                                                                    { label: 'Last called at', value: lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Never Called', icon: 'history' },
                                                                    { 
                                                                        label: 'Next Follow-up', 
                                                                        value: lead.next_followup_at 
                                                                            ? subtractFiveThirtyAndFormat(lead.next_followup_at) 
                                                                            : (Object.keys(lead.extra_fields || {}).some(k => k.toLowerCase().includes('followup') || k.toLowerCase().includes('call back') || k.toLowerCase().includes('callback')) ? '' : 'Not Scheduled'), 
                                                                        icon: 'schedule' 
                                                                    },
                                                                    { label: 'Primary Contact', value: lead.email, icon: 'mail' },
                                                                    { label: 'Workplace', value: lead.company_name, icon: 'business' },
                                                                    { label: 'Educational Background', value: lead.education_background, icon: 'school' },
                                                                    { label: 'Growth Readiness', value: lead.upskilling_ready, icon: 'trending_up' },
                                                                ].filter(item => !isManager || item.label !== 'Workplace').map((item, i) => (
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
                                                                    <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Action Type</label>
                                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                        {ACTION_TYPES.map(a => (
                                                                            <button
                                                                                key={a.value}
                                                                                onClick={() => updateForm(lead._id, 'actionType', a.value)}
                                                                                style={styles.outcomeBtn(form.actionType === a.value, designTokens.colors.primary)}
                                                                            >
                                                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{a.icon}</span>
                                                                                {a.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                    <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Lead Stage</label>
                                                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                        {Object.keys(STAGES_AND_DISPOSITIONS).map(s => (
                                                                            <button
                                                                                key={s}
                                                                                onClick={() => updateForm(lead._id, 'stage', s)}
                                                                                style={styles.outcomeBtn(form.stage === s, designTokens.colors.secondary)}
                                                                            >
                                                                                {s}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {form.stage && (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                        <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Disposition</label>
                                                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                            {STAGES_AND_DISPOSITIONS[form.stage].map(d => (
                                                                                <button
                                                                                    key={d}
                                                                                    onClick={() => updateForm(lead._id, 'disposition', d)}
                                                                                    style={styles.outcomeBtn(form.disposition === d, designTokens.colors.success)}
                                                                                >
                                                                                    {d}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

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

                                                                        {(!["Closed Won", "Closed Lost"].includes(form.stage)) && (
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
                                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>event_repeat</span>
                                                                                    Next Follow-up
                                                                                </label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    style={{ ...styles.input, border: 'none', background: '#FFFFFF', padding: '10px 14px' }}
                                                                                    value={form.followUpDate || ""}
                                                                                    onChange={e => updateForm(lead._id, 'followUpDate', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {form.disposition === "Demo Booked" && (
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                gap: '10px',
                                                                                padding: '16px',
                                                                                background: `${designTokens.colors.warning}10`,
                                                                                borderRadius: '16px',
                                                                                border: `1px solid ${designTokens.colors.warning}30`
                                                                            }}>
                                                                                <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.warning, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                                                                                    Schedule Demo
                                                                                </label>
                                                                                <input
                                                                                    type="datetime-local"
                                                                                    style={{ ...styles.input, border: 'none', background: '#FFFFFF', padding: '10px 14px' }}
                                                                                    value={form.demoScheduleDate || ""}
                                                                                    onChange={e => updateForm(lead._id, 'demoScheduleDate', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        )}

                                                                        {(form.disposition === "Expected Payment Date" || form.disposition === "Converted") && (
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                gap: '10px',
                                                                                padding: '16px',
                                                                                background: `${designTokens.colors.success}10`,
                                                                                borderRadius: '16px',
                                                                                border: `1px solid ${designTokens.colors.success}30`
                                                                            }}>
                                                                                <label style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.success, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>payments</span>
                                                                                    Payment Date
                                                                                </label>
                                                                                <input
                                                                                    type="date"
                                                                                    style={{ ...styles.input, border: 'none', background: '#FFFFFF', padding: '10px 14px' }}
                                                                                    value={form.expectedPaymentDate || ""}
                                                                                    onChange={e => updateForm(lead._id, 'expectedPaymentDate', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    disabled={submitting === lead._id || !form.disposition}
                                                                    onClick={() => handleLogCall(lead)}
                                                                    style={{
                                                                        marginTop: '12px',
                                                                        padding: '18px',
                                                                        borderRadius: '16px',
                                                                        border: 'none',
                                                                        background: !form.disposition ? designTokens.colors.border : `linear-gradient(135deg, ${designTokens.colors.primary}, ${designTokens.colors.secondary})`,
                                                                        color: '#fff',
                                                                        fontWeight: '800',
                                                                        fontSize: '16px',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s ease',
                                                                        boxShadow: form.disposition ? `0 12px 24px ${designTokens.colors.primary}40` : 'none',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '12px'
                                                                    }}
                                                                >
                                                                    {submitting === lead._id ? (
                                                                        <>
                                                                            <span className="material-symbols-outlined spinning">sync</span>
                                                                            Executing Protocol...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="material-symbols-outlined">save</span>
                                                                            Log Activity & Progress
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* COLUMN 3: Historical Records */}
                                                        <div style={{ borderLeft: `1px solid ${designTokens.colors.border}`, paddingLeft: '32px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                                                <div style={{ padding: '10px', background: `${designTokens.colors.secondary}15`, borderRadius: '12px', color: designTokens.colors.secondary }}>
                                                                    <span className="material-symbols-outlined">history</span>
                                                                </div>
                                                                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: designTokens.colors.textPrimary }}>Records</h3>
                                                            </div>

                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '16px' }}>
                                                                {history.length === 0 ? (
                                                                    <div style={{ padding: '40px 20px', textAlign: 'center', background: designTokens.colors.background, borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: designTokens.colors.border, marginBottom: '12px' }}>cloud_off</span>
                                                                        <p style={{ margin: 0, fontSize: '13px', color: designTokens.colors.textSecondary, fontWeight: '500' }}>No historical sequences found in the archives.</p>
                                                                    </div>
                                                                ) : (
                                                                    history.map((h, i) => (
                                                                        <div key={i} style={styles.timelineItem(expandedLogId === h._id)} onClick={() => setExpandedLogId(expandedLogId === h._id ? null : h._id)}>
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: designTokens.colors.primary }}></div>
                                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                            <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                                                {ACTION_TYPES.find(a => a.value === h.actionType)?.label || "📞 Interaction"}
                                                                                            </div>
                                                                                            {h.deviceCallType && (
                                                                                                <span style={{
                                                                                                    padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.05em',
                                                                                                    background: h.deviceCallType === 'INCOMING' ? '#e6f4ea' : h.deviceCallType === 'MISSED' ? '#fce8e6' : '#e8f0fe',
                                                                                                    color: h.deviceCallType === 'INCOMING' ? '#137333' : h.deviceCallType === 'MISSED' ? '#c5221f' : '#1a73e8'
                                                                                                }}>
                                                                                                    {h.deviceCallType}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        <span style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textPrimary }}>
                                                                                            {h.stage ? `${h.stage} (${h.disposition})` : (h.callOutcome || "Unknown").toUpperCase()}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <span style={{ fontSize: '11px', color: designTokens.colors.textSecondary, fontWeight: '600' }}>
                                                                                    {new Date(h.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {new Date(h.createdAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                                                                                </span>
                                                                            </div>

                                                                            {/* Scheduled Dates Display */}
                                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                                                                                {h.followUpDate && (
                                                                                    <div style={{ fontSize: '11px', background: `${designTokens.colors.info}15`, color: designTokens.colors.info, padding: '4px 8px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event_repeat</span>
                                                                                        Follow-up: {subtractFiveThirtyAndFormat(h.followUpDate)}
                                                                                    </div>
                                                                                )}
                                                                                {h.demoScheduleDate && (
                                                                                    <div style={{ fontSize: '11px', background: `${designTokens.colors.warning}15`, color: designTokens.colors.warning, padding: '4px 8px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_month</span>
                                                                                        Demo: {subtractFiveThirtyAndFormat(h.demoScheduleDate)}
                                                                                    </div>
                                                                                )}
                                                                                {h.expectedPaymentDate && (
                                                                                    <div style={{ fontSize: '11px', background: `${designTokens.colors.success}15`, color: designTokens.colors.success, padding: '4px 8px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>payments</span>
                                                                                        Payment: {new Date(h.expectedPaymentDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <p style={{ margin: 0, fontSize: '13px', color: designTokens.colors.textSecondary, display: '-webkit-box', WebkitLineClamp: expandedLogId === h._id ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{h.summary || "Archived interactions trace."}</p>

                                                                            {h.recordingUrl && (
                                                                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                                                                                    <AudioButton url={h.recordingUrl} />
                                                                                </div>
                                                                            )}

                                                                            {expandedLogId === h._id && h.remark && (
                                                                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0', fontSize: '12px', color: designTokens.colors.textSecondary, fontStyle: 'italic' }}>
                                                                                    Internal Note: {h.remark}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
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
