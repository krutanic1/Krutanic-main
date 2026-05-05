import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

const CALL_OUTCOMES = [
    { value: "interested", label: "✅ Interested", color: "#52c41a" },
    { value: "not_interested", label: "❌ Not Interested", color: "#ff4d4f" },
    { value: "no_answer", label: "📵 No Answer", color: "#faad14" },
    { value: "callback_requested", label: "🔄 Callback Requested", color: "#1890ff" },
    { value: "converted", label: "🏆 Converted", color: "#722ed1" },
    { value: "junk", label: "🗑️ Junk Leads", color: "#8c8c8c" },
    { value: "follow_up", label: "📅 Follow Up", color: "#eb2f96" },
    { value: "qualified", label: "🌟 Qualified", color: "#fa8c16" },
];

const AdvTeamRecord = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 25;

    // Navigation State
    const [view, setView] = useState("specialists"); // "specialists" | "leads" | "history"
     const [selectedSpecialist, setSelectedSpecialist] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);

    const userId = localStorage.getItem("advTeamId");
    const userName = localStorage.getItem("advTeamName");
    const [userDesignation, setUserDesignation] = useState(localStorage.getItem("advTeamDesignation") || "");

    const fetchRecords = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-record`, {
                params: { role: userDesignation, userId, page, limit }
            });
            if (res.data && res.data.activities) {
                setActivities(res.data.activities);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
                setCurrentPage(res.data.currentPage);
            } else {
                setActivities([]);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch records");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API}/getadvteam`, { params: { advTeamId: userId } });
            if (res.data && res.data.designation) {
                setUserDesignation(res.data.designation);
                localStorage.setItem("advTeamDesignation", res.data.designation);
                localStorage.setItem("advTeamTeam", res.data.team || "");
            }
        } catch (err) {
            console.error("Failed to fetch user profile", err);
        }
    };

    useEffect(() => {
        if (userId && !userDesignation) {
            fetchUserProfile();
        }
    }, [userId, userDesignation]);

    useEffect(() => {
        if (userId && userDesignation) {
            fetchRecords(currentPage);
        }
    }, [userId, userDesignation, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Grouping Logic
    const groupedData = useMemo(() => {
        const specialists = {};

        activities.forEach(act => {
            const specId = act.specialistId?._id || act.specialistStringId || "unknown";
            const specName = act.specialistName || act.specialistId?.name || "Unknown Specialist";
            const leadId = act.leadId?._id || "unknown_lead";
            const leadName = act.leadId?.full_name || "Unknown Lead";
            const leadPhone = act.leadId?.phone_number || "N/A";

            if (!specialists[specId]) {
                specialists[specId] = {
                    id: specId,
                    name: specName,
                    leads: {},
                    totalActivities: 0,
                    lastActivity: null
                };
            }

            if (!specialists[specId].leads[leadId]) {
                specialists[specId].leads[leadId] = {
                    id: leadId,
                    name: leadName,
                    phone: leadPhone,
                    email: act.leadId?.email || "—",
                    domain: act.leadId?.opted_domain || "General",
                    extra_fields: act.leadId?.extra_fields || {},
                    activities: [],
                    lastUpdated: null
                };
            }

            specialists[specId].leads[leadId].activities.push(act);
            specialists[specId].totalActivities++;

            const actDate = new Date(act.createdAt);
            if (!specialists[specId].lastActivity || actDate > new Date(specialists[specId].lastActivity)) {
                specialists[specId].lastActivity = act.createdAt;
            }
            if (!specialists[specId].leads[leadId].lastUpdated || actDate > new Date(specialists[specId].leads[leadId].lastUpdated)) {
                specialists[specId].leads[leadId].lastUpdated = act.createdAt;
            }
        });

        return Object.values(specialists).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    }, [activities]);

    const styles = {
        container: {
            padding: '24px',
            marginLeft: '280px',
            background: '#F8FAFC',
            minHeight: '100vh',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        titleSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        title: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#1E293B',
            margin: 0,
            letterSpacing: '-0.5px'
        },
        breadcrumb: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#64748B'
        },
        breadcrumbItem: {
            cursor: 'pointer',
            fontWeight: '600',
            color: '#3B82F6',
            transition: 'color 0.2s'
        },
        cardGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '20px'
        },
        card: {
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            overflow: 'hidden'
        },
        cardActive: {
            borderColor: '#3B82F6',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)'
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#1E293B',
            margin: 0
        },
        cardStat: {
            fontSize: '13px',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        },
        tableContainer: {
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginTop: '20px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
        },
        th: {
            padding: '16px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            fontSize: '12px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase'
        },
        td: {
            padding: '16px 24px',
            borderBottom: '1px solid #F1F5F9',
            fontSize: '14px',
            color: '#334155'
        },
        badge: (color) => ({
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '600',
            background: `${color}15`,
            color: color,
            border: `1px solid ${color}30`
        }),
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={styles.container}>
            {/* ─── Lead Details Modal ─── */}
            {selectedLeadForDetails && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
                        width: '600px', maxHeight: '85vh', overflowY: 'auto',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                            <h2 style={{ margin: 0, color: '#1a1a1a' }}>📝 Lead Intelligence</h2>
                            <button onClick={() => setSelectedLeadForDetails(null)} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Full Name</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.name}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Email Address</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Phone Number</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.phone}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Target Domain</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.domain || 'General'}</div>
                            </div>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px', color: '#3B82F6', borderBottom: '1px dashed #ddd', paddingBottom: '8px' }}>🚀 Meta Ads & Questionnaire Info</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {Object.entries(selectedLeadForDetails.extra_fields || {}).map(([key, val]) => (
                                    <div key={key}>
                                        <div style={{ fontSize: '10px', fontWeight: '800', color: '#888', textTransform: 'uppercase', marginBottom: '2px' }}>{key.replace(/_/g, ' ')}</div>
                                        <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>{val || '—'}</div>
                                    </div>
                                ))}
                                {(!selectedLeadForDetails.extra_fields || Object.keys(selectedLeadForDetails.extra_fields).length === 0) && (
                                    <div style={{ color: '#999', fontStyle: 'italic', fontSize: '13px' }}>No questionnaire data available.</div>
                                )}
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button onClick={() => setSelectedLeadForDetails(null)} style={{ padding: '10px 24px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Close Details</button>
                        </div>
                    </div>
                </div>
            )}
            <Toaster position="top-center" />

            <header style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Call Records</h1>
                    <div style={styles.breadcrumb}>
                        <span
                            style={view !== "specialists" ? styles.breadcrumbItem : { fontWeight: '600' }}
                            onClick={() => { setView("specialists"); setSelectedSpecialist(null); setSelectedLead(null); }}
                        >
                            Specialists
                        </span>
                        {selectedSpecialist && (
                            <>
                                <span>/</span>
                                <span
                                    style={view !== "leads" ? styles.breadcrumbItem : { fontWeight: '600' }}
                                    onClick={() => { setView("leads"); setSelectedLead(null); }}
                                >
                                    {selectedSpecialist.name}
                                </span>
                            </>
                        )}
                        {selectedLead && (
                            <>
                                <span>/</span>
                                <span style={{ fontWeight: '600' }}>{selectedLead.name}</span>
                            </>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '4px 16px', background: '#3B82F610', color: '#3B82F6', borderRadius: '12px', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '600' }}>
                        Total Logs: {totalCount}
                    </div>
                    <button
                        onClick={() => fetchRecords(1)}
                        style={{
                            padding: '10px 20px', background: '#FFFFFF', border: '1px solid #E2E8F0',
                            borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#475569',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </header>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center', color: '#64748B' }}>
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                    <p style={{ marginTop: '20px' }}>Analyzing records...</p>
                </div>
            ) : activities.length === 0 ? (
                <div style={{ padding: '100px', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>Empty</div>
                    <p>No activity records found for your team.</p>
                </div>
            ) : (
                <>
                    {/* Level 1: Specialists List */}
                    {view === "specialists" && (
                        <>
                            <div style={styles.cardGrid}>
                                {groupedData.map(spec => (
                                    <div
                                        key={spec.id}
                                        style={styles.card}
                                        onClick={() => { setSelectedSpecialist(spec); setView("leads"); }}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardActive)}
                                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { borderColor: '#E2E8F0', boxShadow: 'none' })}
                                    >
                                        <h3 style={styles.cardTitle}>{spec.name}</h3>
                                        <div style={styles.cardStat}>
                                            <span>👥</span> {Object.keys(spec.leads).length} Leads handled
                                        </div>
                                        <div style={styles.cardStat}>
                                            <span>📞</span> {spec.totalActivities} logs on this page
                                        </div>
                                        <div style={{ ...styles.cardStat, marginTop: 'auto', fontSize: '11px', color: '#94A3B8' }}>
                                            Last active: {formatDate(spec.lastActivity)}
                                        </div>
                                        <div style={{
                                            position: 'absolute', right: '-10px', bottom: '-10px',
                                            fontSize: '80px', opacity: '0.05', pointerEvents: 'none'
                                        }}>👤</div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination UI */}
                            <div style={styles.pagination}>
                                <div style={{ fontSize: '14px', color: '#64748B' }}>
                                    Showing <strong>{(currentPage - 1) * limit + 1}</strong> - <strong>{Math.min(currentPage * limit, totalCount)}</strong> of <strong>{totalCount}</strong> logs
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

                    {/* Level 2: Leads List for Selected Specialist */}
                    {view === "leads" && selectedSpecialist && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Lead Name</th>
                                        <th style={styles.th}>Contact</th>
                                        <th style={styles.th}>Activities</th>
                                        <th style={styles.th}>Last Updated At</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(selectedSpecialist.leads).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).map(lead => (
                                        <tr key={lead.id}>
                                            <td style={{ ...styles.td, fontWeight: '700' }}>{lead.name}</td>
                                            <td style={styles.td}>{lead.phone}</td>
                                            <td style={styles.td}>
                                                <span style={styles.badge('#3B82F6')}>{lead.activities.length} logs</span>
                                            </td>
                                            <td style={styles.td}>{formatDate(lead.lastUpdated)}</td>
                                            <td style={{ ...styles.td, display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => { setSelectedLead(lead); setView("history"); }}
                                                    style={{
                                                        padding: '6px 12px', background: '#3B82F6', color: '#fff',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                                                    }}
                                                >
                                                    View History
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedLeadForDetails(lead); }}
                                                    style={{
                                                        padding: '6px 12px', background: '#fff', color: '#3B82F6',
                                                        border: '1px solid #3B82F6', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Level 3: Call History for Selected Lead */}
                    {view === "history" && selectedLead && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Outcome</th>
                                        <th style={styles.th}>Interaction Summary</th>
                                        <th style={styles.th}>Internal Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedLead.activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(act => {
                                        const outcome = CALL_OUTCOMES.find(o => o.value === act.callOutcome);
                                        return (
                                            <tr key={act._id}>
                                                <td style={styles.td}>{formatDate(act.createdAt)}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.badge(outcome?.color || '#64748B')}>
                                                        {outcome?.label || act.callOutcome}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, maxWidth: '400px', fontSize: '13px' }}>{act.summary || "No summary"}</td>
                                                <td style={{ ...styles.td, color: '#64748B', fontSize: '13px' }}>{act.remark || "-"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdvTeamRecord;
