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

const AdvLeadsBook = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLead, setActiveLead] = useState(null);
    const [callHistory, setCallHistory] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [formState, setFormState] = useState({});
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [callStartTime, setCallStartTime] = useState(null);
    const [activeCallLeadId, setActiveCallLeadId] = useState(null);
    // Default to showing Fresh Lead on initial load instead of All Records
    const [selectedOutcome, setSelectedOutcome] = useState("Fresh Lead");
    const [selectedDisposition, setSelectedDisposition] = useState("");
    const [hoveredStage, setHoveredStage] = useState(null);
    const [sourceFilter, setSourceFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [outcomeCounts, setOutcomeCounts] = useState({});
    const limit = 25;
    const userId = localStorage.getItem("advTeamId");
    const userName = localStorage.getItem("advTeamName");
    const [userDesignation, setUserDesignation] = useState(localStorage.getItem("advTeamDesignation") || "SR Inside Sales Specialist");

    // New Email Modal state
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedLeadForEmail, setSelectedLeadForEmail] = useState(null);
    const [emailRecipient, setEmailRecipient] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailDomain, setEmailDomain] = useState("");
    const [emailContent, setEmailContent] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [sendBrochure, setSendBrochure] = useState(false);

    // Personalized SMTP & Template state
    const [showSMTPModal, setShowSMTPModal] = useState(false);
    const [personalEmail, setPersonalEmail] = useState("");
    const [appPassword, setAppPassword] = useState("");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    const [advDomains, setAdvDomains] = useState(["General"]);

    const fetchMyLeads = async (page = 1, currentStage = selectedOutcome, currentDisp = selectedDisposition, currentSource = sourceFilter, currentDate = dateFilter) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: { 
                    role: userDesignation, 
                    userId, 
                    page, 
                    limit, 
                    stage: currentStage,
                    disposition: currentDisp,
                    source: currentSource, 
                    strictlyOwned: true, 
                    date: currentDate,
                    search: searchTerm // Global search parameter
                }
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

    const fetchOutcomeCounts = async () => {
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-outcome-counts`, {
                params: { 
                    role: userDesignation, 
                    userId, 
                    strictlyOwned: true,
                    source: sourceFilter,
                    date: dateFilter
                }
            });
            setOutcomeCounts(res.data);
        } catch (err) {
            console.error("Failed to fetch counts", err);
        }
    };
    // Removed frontend filtering as we now use global backend search
    const displayedLeads = leads;

    const isManager = (userDesignation || "").toLowerCase().includes("manager") || (userName || "").toLowerCase().includes("sumeetha");

    const [teamMembers, setTeamMembers] = useState([]);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [selectedLeadForReassign, setSelectedLeadForReassign] = useState(null);
    const [selectedAssignee, setSelectedAssignee] = useState("");
    const [isReassigning, setIsReassigning] = useState(false);

    // Filter team members based on role
    const assignTargets = (() => {
        if (!isManager) return [];
        return teamMembers.filter(m => {
            const desig = (m.designation || "").toUpperCase();
            return (desig.includes("LEADER") || desig.includes("SPECIALIST")) && m.Access === true && m.status !== "Inactive";
        });
    })();

    const handleReassign = async () => {
        if (!selectedAssignee) {
            toast.error("Please select a team member");
            return;
        }
        setIsReassigning(true);
        try {
            const member = teamMembers.find(m => m._id === selectedAssignee);
            await axios.post(`${API}/api/adv-leads/manual-bulk-assign`, {
                leadIds: [selectedLeadForReassign._id],
                assigneeId: member._id,
                assigneeName: member.fullname,
                assigneeRole: member.designation
            });
            toast.success("Lead reassigned successfully");
            setShowReassignModal(false);
            setSelectedLeadForReassign(null);
            setSelectedAssignee("");
            fetchMyLeads(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || "Reassignment failed");
        } finally {
            setIsReassigning(false);
        }
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${API}/api/adv-leads/get-templates/${userId}`);
                setTemplates(res.data);
            } catch (err) {
                console.error("Failed to fetch templates");
            }
        };
        const fetchSMTPConfig = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${API}/api/adv-leads/get-smtp-config/${userId}`);
                setPersonalEmail(res.data.smtpEmail || "");
            } catch (err) {
                console.error("Failed to fetch SMTP config");
            }
        };
        const fetchDomains = async () => {
            try {
                const res = await axios.get(`${API}/getadvcourses`);
                const titles = res.data.map(c => c.title.includes("Advance") ? c.title : `${c.title} Advance`);
                setAdvDomains(["General", ...titles]);
            } catch (err) {
                console.error("Failed to fetch domains");
            }
        };
        const fetchTeamMembers = async () => {
            try {
                const res = await axios.get(`${API}/getadvteam`);
                setTeamMembers(res.data);
            } catch (err) {
                console.error("Failed to fetch team members");
            }
        };
        const fetchUserProfile = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${API}/getadvteam`, { params: { advTeamId: userId } });
                if (res.data) {
                    setUserDesignation(res.data.designation || "");
                    localStorage.setItem("advTeamDesignation", res.data.designation || "");
                }
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            }
        };
        fetchTemplates();
        fetchSMTPConfig();
        fetchDomains();
        fetchTeamMembers();
        fetchUserProfile();
    }, [userId]);

    // Consolidated lead fetching effect with debouncing for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMyLeads(currentPage);
            fetchOutcomeCounts();
        }, searchTerm ? 500 : 0); // Debounce search only if there's a search term
        
        return () => clearTimeout(timer);
    }, [currentPage, selectedOutcome, selectedDisposition, sourceFilter, dateFilter, searchTerm]);

    const handleSaveSMTP = async () => {
        if (!personalEmail || !appPassword) return toast.error("Both fields are required");
        try {
            await axios.post(`${API}/api/adv-leads/save-smtp-config`, {
                userId,
                smtpEmail: personalEmail,
                smtpPassword: appPassword
            });
            toast.success("Email credentials saved!");
            setShowSMTPModal(false);
        } catch (err) {
            toast.error("Failed to save credentials");
        }
    };

    const handleSaveTemplate = async () => {
        if (!newTemplateName) return toast.error("Template name is required");
        setIsSavingTemplate(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/save-template`, {
                name: newTemplateName,
                subject: emailSubject,
                body: emailContent,
                userId
            });
            toast.success("Template saved!");
            setTemplates([res.data.template, ...templates]);
            setShowSaveTemplateModal(false);
            setNewTemplateName("");
        } catch (err) {
            toast.error("Failed to save template");
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const handleDeleteTemplate = async () => {
        if (!selectedTemplateId) return toast.error("Please select a template to delete");
        const template = templates.find(t => t._id === selectedTemplateId);
        if (!window.confirm(`Are you sure you want to delete the template "${template?.name}"?`)) return;

        try {
            await axios.delete(`${API}/api/adv-leads/delete-template/${selectedTemplateId}`);
            toast.success("Template deleted!");
            setTemplates(templates.filter(t => t._id !== selectedTemplateId));
            setSelectedTemplateId("");
            setEmailSubject("");
            setEmailContent("");
        } catch (err) {
            toast.error("Failed to delete template");
        }
    };

    const formatDate = (date) => {
        if (!date) return "Unknown Date";
        return new Date(date).toLocaleDateString("en-GB");
    };

    // Subtract 5 hours 30 minutes from a stored datetime and format for display
    const subtractFiveThirtyAndFormat = (val, opts = { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) => {
        if (!val) return '—';
        const ms = Date.parse(val);
        if (isNaN(ms)) return '—';
        const offsetMs = (5 * 60 + 30) * 60 * 1000; // 5h30m in ms
        const adjusted = new Date(ms - offsetMs);
        return adjusted.toLocaleString('en-IN', opts);
    };

    // Grouping logic for the leads
    const groupedLeads = displayedLeads.reduce((acc, lead) => {
        const date = formatDate(lead.assigned_at || lead.created_at);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(lead);
        return acc;
    }, {});

    // Redundant useEffect removed

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
                expectedPaymentDate: form.expectedPaymentDate || undefined
            });
            toast.success("Activity logged successfully!");
            setCallStartTime(null);
            setActiveCallLeadId(null);
            setFormState(prev => ({ ...prev, [lead._id]: {} }));
            setCallHistory(prev => { const n = { ...prev }; delete n[lead._id]; return n; });
            fetchHistory(lead._id);
            fetchMyLeads(currentPage);
            fetchOutcomeCounts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to log activity");
        } finally {
            setSubmitting(null);
        }
    };

    const handleRemoteDial = (phoneNumber, leadId) => {
        const dialNumber = String(phoneNumber || "").replace(/\D/g, "");
        if (!dialNumber) {
            toast.error("Phone number is not available.");
            return;
        }
        setCallStartTime(Date.now());
        setActiveCallLeadId(leadId);
        window.location.href = `tel:${dialNumber}`;
    };

    const StatusBadge = ({ lead }) => {
        const getStyles = (s) => {
            const map = {
                "Fresh Lead": { color: "#64748B" },
                "Attempting Contact": { color: designTokens.colors.warning },
                "First Call Connected": { color: designTokens.colors.info },
                "Demo Conducted": { color: designTokens.colors.secondary },
                "Closed Won": { color: designTokens.colors.success },
                "Closed Lost": { color: designTokens.colors.danger }
            };
            return map[s] || { color: designTokens.colors.textSecondary };
        };
        const styles_badge = getStyles(lead.stage || "Fresh Lead");
        return (
            <span style={styles.badge(styles_badge.color)}>
                {lead.stage || "Fresh Lead"}
            </span>
        );
    };

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
                <div style={styles.headerTop}>
                    <div style={styles.titleSection}>
                        <h1 style={styles.title}>Leads Portfolio</h1>
                        <div style={styles.subtitle}>
                            <span style={{ width: '10px', height: '10px', background: designTokens.colors.success, borderRadius: '50%', boxShadow: `0 0 12px ${designTokens.colors.success}50` }}></span>
                            {userName} • <span style={{ color: designTokens.colors.primary, fontWeight: '700' }}>{userDesignation}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={styles.statCard}>
                            <span style={{ fontSize: '18px', fontWeight: '800', color: designTokens.colors.primary, lineHeight: '1.2' }}>{totalCount}</span>
                            <span style={{ fontSize: '9px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Group</span>
                        </div>
                        <button
                            onClick={() => fetchMyLeads(1)}
                            className={`material-symbols-outlined ${loading ? 'spinning' : ''}`}
                            style={{
                                ...styles.statCard,
                                cursor: 'pointer',
                                color: loading ? designTokens.colors.primary : designTokens.colors.textSecondary,
                                fontSize: '24px',
                                width: '48px',
                                minWidth: '48px',
                                padding: 0,
                            }}
                            title="Sync Leads"
                        >
                            sync
                        </button>
                        <button
                            onClick={() => setShowSMTPModal(true)}
                            style={{
                                ...styles.statCard,
                                color: designTokens.colors.secondary,
                                cursor: 'pointer',
                                padding: '0 16px',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px',
                                border: `1px solid ${designTokens.colors.secondary}20`,
                                minWidth: 'fit-content'
                            }}
                            title="Mail Settings"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>settings_suggest</span>
                            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>Mail Settings</span>
                        </button>
                    </div>
                </div>

                <div style={styles.headerBottom}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <button
                            onClick={() => setSelectedOutcome("")}
                            style={styles.filterBtn(selectedOutcome === "", designTokens.colors.primary)}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>list_alt</span>
                            <span>All Records ({outcomeCounts.total || 0})</span>
                        </button>
                        {Object.keys(STAGES_AND_DISPOSITIONS).map(stage => (
                            <button
                                key={stage}
                                onMouseEnter={() => setHoveredStage(stage)}
                                onMouseLeave={() => setHoveredStage(null)}
                                onClick={() => {
                                    if (selectedOutcome === stage) {
                                        setSelectedOutcome(""); // Toggle off if clicking the same
                                    } else {
                                        setSelectedOutcome(stage);
                                    }
                                    setSelectedDisposition("");
                                    setCurrentPage(1);
                                }}
                                style={styles.filterBtn(selectedOutcome === stage || hoveredStage === stage, designTokens.colors.primary)}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_tree</span>
                                <span>{stage} ({outcomeCounts[stage] || 0})</span>
                            </button>
                        ))}
                    </div>

                    <div style={styles.filterRow}>
                        <div style={styles.dateSection}>
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
                                    cursor: 'pointer',
                                    width: '120px'
                                }}
                            />
                        </div>
                        <div style={styles.searchSection}>
                            <span className="material-symbols-outlined" style={{ color: designTokens.colors.textSecondary, fontSize: '20px' }}>search</span>
                            <input 
                                type="text" 
                                placeholder="Search all leads (Name, Phone, Email)..." 
                                value={searchTerm} 
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                            />
                        </div>
                    </div>
                </div>

                {/* --- Disposition Sub-Filters --- */}
                {/* Show disposition row only when a stage is CLICKED (selectedOutcome). Hover is purely visual. */}
                {selectedOutcome && STAGES_AND_DISPOSITIONS[selectedOutcome] && (
                    <div style={{
                        display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px',
                        padding: '12px 20px', background: 'white', borderRadius: '16px',
                        border: `2px solid ${designTokens.colors.border}`, overflowX: 'auto',
                        scrollbarWidth: 'none', msOverflowStyle: 'none',
                        transition: 'all 0.2s ease'
                    }} className="filter-row">
                        <span style={{ fontSize: '12px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase', marginRight: '8px', whiteSpace: 'nowrap' }}>
                            {selectedOutcome} ›
                        </span>
                        <button
                            onClick={() => { setSelectedDisposition(""); setCurrentPage(1); }}
                            style={styles.compactBtn(selectedDisposition === "", designTokens.colors.primary)}
                        >
                            All
                        </button>
                        {STAGES_AND_DISPOSITIONS[selectedOutcome].map(disp => (
                            <button
                                key={disp}
                                onClick={() => { 
                                    setSelectedDisposition(disp); 
                                    setCurrentPage(1); 
                                }}
                                style={styles.compactBtn(selectedDisposition === disp, designTokens.colors.secondary)}
                            >
                                {disp}
                            </button>
                        ))}
                    </div>
                )}

                {(userId === "69d4a881cb9305f0d5ecbeb2" || (userName && userName.toLowerCase().includes("sumeetha"))) && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        alignItems: 'center', 
                        background: '#fff', 
                        padding: '8px 16px', 
                        borderRadius: '12px', 
                        marginTop: '-12px',
                        border: `1px solid ${designTokens.colors.border}`,
                        boxShadow: designTokens.shadows.sm
                    }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRight: `1px solid ${designTokens.colors.border}`, paddingRight: '12px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: designTokens.colors.royal }}>database</span>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: designTokens.colors.textSecondary, textTransform: 'uppercase' }}>Old CRM Data</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {[
                                "Fresh", "Interested", "Follow Up", "Callback", "No Answer", "Not Interested", "Junk", "Converted", "Unused"
                            ].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setSelectedOutcome(status);
                                        setSourceFilter("Old CRM");
                                    }}
                                    style={styles.compactBtn(selectedOutcome === status && sourceFilter === "Old CRM", designTokens.colors.royal)}
                                >
                                    <span>{status}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setSourceFilter("");
                                    setSelectedOutcome("");
                                }}
                                style={{ ...styles.compactBtn(sourceFilter === "" && selectedOutcome === "", designTokens.colors.danger), marginLeft: '8px' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>
                )}
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
                ) : displayedLeads.length === 0 ? (
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
                        {Object.keys(groupedLeads).map((date) => (
                            <React.Fragment key={date}>
                                <div style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(90deg, #f1f5f9 0%, #fff 100%)',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    margin: '16px 0 8px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className="material-symbols-outlined" style={{ color: designTokens.colors.primary, fontSize: '20px' }}>calendar_today</span>
                                        <span style={{ fontWeight: '800', color: designTokens.colors.textPrimary, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{date}</span>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: designTokens.colors.textSecondary, background: '#fff', padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                        {groupedLeads[date].length} {groupedLeads[date].length === 1 ? 'Lead' : 'Leads'}
                                    </span>
                                </div>
                                {groupedLeads[date].map((lead, idx) => {
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
                                                                    onClick={(e) => { e.stopPropagation(); handleRemoteDial(lead.phone_number, lead._id); }}
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
                                                                <span className="material-symbols-outlined" style={{ color: designTokens.colors.primary, fontSize: '20px' }}>mic</span>
                                                                <audio
                                                                    controls
                                                                    controlsList="nodownload"
                                                                    style={{ width: '180px', height: '30px' }}
                                                                >
                                                                    <source src={lead.last_recording_url} type="audio/mpeg" />
                                                                </audio>
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
                                                                                        <div style={{ fontSize: '10px', fontWeight: '800', color: designTokens.colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                                            {ACTION_TYPES.find(a => a.value === h.actionType)?.label || "📞 Interaction"}
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
                                                                                <div style={{ marginTop: '12px' }} onClick={(e) => e.stopPropagation()}>
                                                                                    <audio
                                                                                        controls
                                                                                        controlsList="nodownload"
                                                                                        style={{ width: '100%', height: '32px', borderRadius: '8px' }}
                                                                                    >
                                                                                        <source src={h.recordingUrl} type="audio/mpeg" />
                                                                                        Your browser does not support the audio element.
                                                                                    </audio>
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
                                </React.Fragment>
                            ))}
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

            {/* ─── Personalized Email Modal ─── */}
            {showEmailModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '24px',
                        width: '700px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: designTokens.shadows.xl, position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                            <h2 style={{ margin: 0, color: designTokens.colors.textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="material-symbols-outlined">mail</span> Send Personalized Email
                            </h2>
                            <button onClick={() => setShowEmailModal(false)} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', display: 'block' }}>
                                📋 Quick Templates
                            </label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => {
                                        const tId = e.target.value;
                                        setSelectedTemplateId(tId);
                                        const template = templates.find(t => t._id === tId);
                                        if (template) {
                                            setEmailSubject(template.subject);
                                            setEmailContent(template.body);
                                        }
                                    }}
                                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <option value="">-- Select a saved template --</option>
                                    {templates.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                                {selectedTemplateId && (
                                    <button
                                        onClick={handleDeleteTemplate}
                                        title="Delete Selected Template"
                                        style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>To</label>
                                <input type="text" value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Domain</label>
                                <select
                                    value={emailDomain}
                                    onChange={(e) => setEmailDomain(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}
                                >
                                    {advDomains.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Subject</label>
                                <button
                                    onClick={() => {
                                        const prompt = encodeURIComponent(`Write a professional and catchy email for a ${emailDomain} student. The email should be about: ${emailSubject || 'the Advanced Program'}. Mention Krutanic and include a strong call to action.`);
                                        window.open(`https://chatgpt.com/?q=${prompt}`, '_blank');
                                    }}
                                    style={{ border: 'none', background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}
                                >
                                    <span style={{ fontSize: '14px' }}>🤖</span> Generate with ChatGPT
                                </button>
                            </div>
                            <input
                                type="text"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Enter your email subject..."
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Body (Supports HTML)</label>
                            <textarea
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                style={{ width: '100%', height: '200px', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontFamily: 'monospace' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', padding: '10px', background: '#ecfdf5', borderRadius: '10px' }}>
                            <input type="checkbox" checked={sendBrochure} onChange={(e) => setSendBrochure(e.target.checked)} id="bookBrochureCheck" />
                            <label htmlFor="bookBrochureCheck" style={{ fontWeight: 'bold', color: '#065f46', cursor: 'pointer' }}>Include Program Brochure PDF</label>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={async () => {
                                    if (!emailSubject || !emailContent) return toast.error("Subject and content are required");
                                    setIsSendingEmail(true);
                                    try {
                                        await axios.post(`${API}/api/adv-leads/send-lead-mail`, {
                                            recipientEmail: emailRecipient,
                                            subject: emailSubject,
                                            content: emailContent,
                                            domain: emailDomain,
                                            sendBrochure,
                                            userId,
                                            senderName: userName
                                        });
                                        toast.success("Email sent!");
                                        const isExisting = templates.some(t => t.subject === emailSubject && t.body === emailContent);
                                        if (!isExisting) setShowSaveTemplateModal(true);
                                        setShowEmailModal(false);
                                    } catch {
                                        toast.error("Failed to send mail");
                                    } finally {
                                        setIsSendingEmail(false);
                                    }
                                }}
                                disabled={isSendingEmail}
                                style={{ flex: 2, padding: '14px', background: designTokens.colors.success, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {isSendingEmail ? "Sending..." : "🚀 Send Email"}
                            </button>
                            <button onClick={() => setShowEmailModal(false)} style={{ flex: 1, padding: '14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Save Template Modal ─── */}
            {showSaveTemplateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2100 }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '400px' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>💾 Save as Template?</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Would you like to save this unique message for future use?</p>
                        <input type="text" placeholder="Template Name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleSaveTemplate} disabled={isSavingTemplate} style={{ flex: 1, padding: '11px', background: designTokens.colors.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Save Template</button>
                            <button onClick={() => setShowSaveTemplateModal(false)} style={{ flex: 1, padding: '11px', background: '#f5f5f5', borderRadius: '10px', cursor: 'pointer', border: 'none' }}>Skip</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── SMTP Setup Modal ─── */}
            {showSMTPModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2050, backdropFilter: 'blur(4px)' }}>
                    <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '480px' }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>📧 Email Account Setup</h3>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Connect your professional email using a <strong>Google App Password</strong> to send emails directly from this dashboard.</p>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>Official Email</label>
                            <input type="email" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>App Password</label>
                            <input type="password" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                        </div>
                        <button onClick={handleSaveSMTP} style={{ width: '100%', padding: '15px', background: designTokens.colors.secondary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>✅ Save Credentials</button>
                        <button onClick={() => setShowSMTPModal(false)} style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Close</button>
                    </div>
                </div>
            )}

            {/* ─── Reassign Modal ─── */}
            {showReassignModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2100 }}>
                    <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '24px', width: '480px' }}>
                        <h3 style={{ margin: '0 0 20px 0' }}>🔄 Reassign Lead</h3>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Select a team member to assign this lead to.</p>
                        
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>Assign To</label>
                            <select 
                                value={selectedAssignee}
                                onChange={(e) => setSelectedAssignee(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                            >
                                <option value="">Select Team Member</option>
                                {assignTargets.map(m => (
                                    <option key={m._id} value={m._id}>
                                        {m.fullname} - {m.designation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={handleReassign} 
                                disabled={isReassigning} 
                                style={{ flex: 2, padding: '15px', background: designTokens.colors.primary, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {isReassigning ? 'Reassigning...' : '✅ Confirm Reassignment'}
                            </button>
                            <button 
                                onClick={() => { setShowReassignModal(false); setSelectedAssignee(""); setSelectedLeadForReassign(null); }} 
                                style={{ flex: 1, padding: '15px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '12px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvLeadsBook;
