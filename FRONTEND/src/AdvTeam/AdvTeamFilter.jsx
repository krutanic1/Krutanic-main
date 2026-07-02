import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti";
import API from "../API";

const STAGES_AND_DISPOSITIONS = {
    "Fresh Lead": ["New Lead", "Invalid Lead"],
    "Attempting Contact": ["RNR", "Callback Requested", "No Response (Multi-touch)"],
    "In Conversation": ["Hot", "Warm"],
    "Demo Conducted": ["Decision Pending", "Negotiation Review", "Expected Payment Date"],
    "Closed Won": ["Converted"],
    "Closed Lost": ["Irrelevant Lead", "Not Interested", "Pricing Does Not Match", "No Response"]
};

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
    },
    shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    radius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
    }
};

const AdvTeamFilter = () => {
    // Basic Auth / Role setup
    const isAdmin = !!localStorage.getItem("adminToken");
    const userId = isAdmin ? "admin" : localStorage.getItem("advTeamId");
    const userName = isAdmin ? "Admin" : localStorage.getItem("advTeamName");
    const designation = localStorage.getItem("advTeamDesignation") || "";
    const isLeader = designation.toLowerCase().includes("leader");
    const isManager = designation.toLowerCase().includes("manager") || userName?.toLowerCase().includes("sumeetha");
    const apiRole = isAdmin ? "admin" : isManager ? "ADV Manager" : isLeader ? "ADV Leader" : "SR Inside Sales Specialist";
    const isManagerOrLeader = isAdmin || isManager || isLeader;

    // Filter States
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedDispositions, setSelectedDispositions] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleCheckboxChange = (setState, value) => {
        setState(prev => {
            if (prev.includes(value)) return prev.filter(v => v !== value);
            return [...prev, value];
        });
        setCurrentPage(1);
    };

    // Data States
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [outcomeCounts, setOutcomeCounts] = useState({ total: 0, converted: 0 });
    const [advEnrollments, setAdvEnrollments] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 25;

    // Confetti
    const [showConfetti, setShowConfetti] = useState(false);

    // Call Logs Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeadCallLogs, setSelectedLeadCallLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const fetchCallLogs = async (lead) => {
        setIsModalOpen(true);
        setLoadingLogs(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/lead-call-history/${lead._id}`);
            setSelectedLeadCallLogs(res.data || []);
        } catch (err) {
            toast.error("Failed to fetch call logs");
            setSelectedLeadCallLogs([]);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        if (outcomeCounts.converted > 0) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [outcomeCounts.converted]);

    // Fetch Enrollments (for Revenue calculation)
    const fetchAdvEnrollments = async () => {
        try {
            const response = await axios.get(`${API}/getadvenrolls`);
            const enrolls = response.data.data || response.data;
            const myEnrolls = enrolls.filter(item => item.counselor && item.counselor === userName);
            setAdvEnrollments(myEnrolls);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    // Calculate revenue within Date Range
    const getFilteredRevenueStats = () => {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        const filtered = advEnrollments.filter(e => {
            const enrollDate = new Date(e.created_at || e.timestamp);
            return enrollDate >= start && enrollDate <= end;
        });

        const totalRevenue = filtered.reduce((acc, s) => acc + (s.programPrice || 0), 0);
        const bookedRevenue = filtered.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
        const totalBookings = filtered.filter(s => s.status === "booked").length;
        
        return { totalRevenue, bookedRevenue, totalBookings, totalFiltered: filtered.length };
    };

    const fetchLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: { 
                    role: apiRole, 
                    userId, 
                    page, 
                    limit, 
                    stage: selectedStages.join(','),
                    disposition: selectedDispositions.join(','),
                    source: selectedSources.join(','), 
                    strictlyOwned: selectedMembers.length === 0, 
                    memberIds: selectedMembers.join(','),
                    fromDate,
                    toDate,
                    search: searchTerm
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
        } catch (err) {
            toast.error("Failed to fetch filtered leads");
        } finally {
            setLoading(false);
        }
    };

    const fetchOutcomeCounts = async () => {
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-outcome-counts`, {
                params: { 
                    role: apiRole, 
                    userId, 
                    strictlyOwned: selectedMembers.length === 0,
                    memberIds: selectedMembers.join(','),
                    source: selectedSources.join(','),
                    fromDate,
                    toDate
                }
            });
            if (res.data) setOutcomeCounts(res.data);
        } catch (err) {
            console.error("Failed to fetch outcome counts", err);
        }
    };

    useEffect(() => {
        fetchAdvEnrollments();
    }, [userName]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const res = await axios.get(`${API}/getadvteam`);
                if (res.data) {
                    const members = res.data;
                    const me = members.find(m => m._id === userId);
                    const myTeam = me?.team || localStorage.getItem("advTeamTeam") || "";

                    const myMembers = members.filter(m => {
                        if (apiRole.toLowerCase().includes("admin")) return true;
                        if (apiRole === "ADV Manager" && m.manager_id === userId) return true;
                        if (apiRole === "ADV Leader" && m.leaders === userId) return true;
                        if (myTeam && m.team === myTeam) return true;
                        return false;
                    });
                    
                    setTeamMembers(myMembers); 
                }
            } catch (e) {
                console.error("Error fetching team members", e);
            }
        };
        fetchTeamMembers();
    }, [userId, apiRole]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeads(currentPage);
            fetchOutcomeCounts();
        }, searchTerm ? 500 : 0);
        
        return () => clearTimeout(timer);
    }, [currentPage, selectedStages, selectedDispositions, selectedSources, selectedMembers, fromDate, toDate, searchTerm]);

    const { totalRevenue, bookedRevenue, totalBookings, totalFiltered } = getFilteredRevenueStats();

    // Styles
    const styles = {
        container: { padding: '40px', marginLeft: '280px', background: designTokens.colors.background, minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
        headerCard: {
            background: designTokens.colors.surface,
            borderRadius: designTokens.radius.lg,
            padding: '24px',
            marginBottom: '32px',
            boxShadow: designTokens.shadows.md,
            border: `1px solid ${designTokens.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        filterRow: { display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, textTransform: 'uppercase' },
        input: {
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${designTokens.colors.border}`,
            fontSize: '14px',
            outline: 'none',
            color: designTokens.colors.textPrimary,
            minWidth: '160px',
            background: '#F8FAFC'
        },
        select: {
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${designTokens.colors.border}`,
            fontSize: '14px',
            outline: 'none',
            color: designTokens.colors.textPrimary,
            minWidth: '180px',
            background: '#F8FAFC',
            cursor: 'pointer'
        },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' },
        statCard: (bgColor, borderColor) => ({
            background: bgColor,
            border: `1px solid ${borderColor}`,
            padding: '24px',
            borderRadius: '20px',
            boxShadow: designTokens.shadows.sm,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }),
        statTitle: { fontSize: '15px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' },
        statValue: (color) => ({ fontSize: '36px', fontWeight: '800', color: color, margin: 0, lineHeight: 1 }),
        tableCard: { background: designTokens.colors.surface, borderRadius: designTokens.radius.lg, border: `1px solid ${designTokens.colors.border}`, overflow: 'hidden', boxShadow: designTokens.shadows.md },
        th: { position: 'sticky', top: 0, zIndex: 10, padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, textTransform: 'uppercase', background: '#F8FAFC', borderBottom: `1px solid ${designTokens.colors.border}` },
        td: { padding: '16px 20px', fontSize: '14px', color: designTokens.colors.textPrimary, borderBottom: `1px solid ${designTokens.colors.border}` },
        badge: (color) => ({ padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '700', background: `${color}15`, color: color, border: `1px solid ${color}30`, textTransform: 'uppercase' })
    };

    const getStageColor = (stage) => {
        const map = {
            "Fresh Lead": "#64748B",
            "Reactive Lead": "#c41d7f",
            "Attempting Contact": designTokens.colors.warning,
            "In Conversation": designTokens.colors.info,
            "Demo Conducted": designTokens.colors.secondary,
            "Closed Won": designTokens.colors.success,
            "Closed Lost": designTokens.colors.danger
        };
        return map[stage] || designTokens.colors.textSecondary;
    };

    return (
        <div style={styles.container}>
            <Toaster position="top-center" />
            
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: designTokens.colors.textPrimary, margin: 0 }}>Advanced Filter & Analytics</h1>
                <p style={{ color: designTokens.colors.textSecondary, marginTop: '8px' }}>Deep dive into your leads and revenue performance.</p>
            </div>

            {/* Filter Dashboard - Top bar for global controls */}
            <div style={styles.headerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>From Date</label>
                            <input type="date" style={styles.input} value={fromDate} onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>To Date</label>
                            <input type="date" style={styles.input} value={toDate} onChange={e => { setToDate(e.target.value); setCurrentPage(1); }} />
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Search</label>
                        <input 
                            type="text" 
                            style={{...styles.input, minWidth: '280px'}} 
                            placeholder="Name, Phone, Email..." 
                            value={searchTerm} 
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Sidebar for Checkbox Filters */}
                <div style={{ width: '280px', flexShrink: 0, background: designTokens.colors.surface, borderRadius: designTokens.radius.lg, border: `1px solid ${designTokens.colors.border}`, padding: '24px', boxShadow: designTokens.shadows.md }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: designTokens.colors.textPrimary, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Filters</h3>
                    
                    {/* STAGES */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase' }}>Stage</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[...Object.keys(STAGES_AND_DISPOSITIONS), ...(isManagerOrLeader ? ["Reactive Lead"] : [])].map(stage => (
                                <label key={stage} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: designTokens.colors.textPrimary }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedStages.includes(stage)}
                                        onChange={() => handleCheckboxChange(setSelectedStages, stage)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: designTokens.colors.primary }}
                                    />
                                    {stage}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* DISPOSITIONS */}
                    {selectedStages.length > 0 && selectedStages.some(s => STAGES_AND_DISPOSITIONS[s]) && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase' }}>Disposition</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                                {selectedStages.flatMap(s => STAGES_AND_DISPOSITIONS[s] || []).map(disp => (
                                    <label key={disp} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: designTokens.colors.textPrimary }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedDispositions.includes(disp)}
                                            onChange={() => handleCheckboxChange(setSelectedDispositions, disp)}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: designTokens.colors.primary }}
                                        />
                                        {disp}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SOURCE */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase' }}>Source</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {["Old CRM", "Meta Ads", "Organic"].map(src => (
                                <label key={src} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: designTokens.colors.textPrimary }}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedSources.includes(src)}
                                        onChange={() => handleCheckboxChange(setSelectedSources, src)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: designTokens.colors.primary }}
                                    />
                                    {src === "Old CRM" ? "Old CRM (All)" : src}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* ASSIGNED MEMBERS */}
                    {isManagerOrLeader && teamMembers.length > 0 && (
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: designTokens.colors.textSecondary, marginBottom: '12px', textTransform: 'uppercase' }}>Team Member</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                                {teamMembers.map(member => (
                                    <label key={member._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: designTokens.colors.textPrimary }}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedMembers.includes(member._id)}
                                            onChange={() => handleCheckboxChange(setSelectedMembers, member._id)}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: designTokens.colors.primary }}
                                        />
                                        {member.fullname || member.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side Content (Stats & Table) */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Statistics */}
                    <div style={styles.statsGrid}>
                <div style={styles.statCard('#EFF6FF', '#BFDBFE')}>
                    <h3 style={styles.statTitle}>Filtered Leads</h3>
                    <p style={styles.statValue('#3B82F6')}>{totalCount}</p>
                </div>
                <div style={styles.statCard('#ECFDF5', '#A7F3D0')}>
                    <h3 style={styles.statTitle}>Converted (Won)</h3>
                    <p style={styles.statValue('#10B981')}>{outcomeCounts["Closed Won"] || outcomeCounts.converted || 0}</p>
                    {showConfetti && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}><Confetti width={300} height={160} recycle={false} /></div>}
                </div>
                <div style={styles.statCard('#F5F3FF', '#DDD6FE')}>
                    <h3 style={styles.statTitle}>Enrollments In Range</h3>
                    <p style={styles.statValue('#8B5CF6')}>{totalFiltered}</p>
                </div>
                <div style={styles.statCard('#1E293B', '#0F172A')}>
                    <h3 style={{...styles.statTitle, color: '#94A3B8'}}>Booked Revenue In Range</h3>
                    <p style={styles.statValue('#FFFFFF')}>₹{bookedRevenue.toLocaleString()}</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748B' }}>From {totalBookings} bookings</p>
                </div>
            </div>

            {/* Table */}
            <div style={styles.tableCard}>
                {loading && leads.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: designTokens.colors.textSecondary }}>Loading data...</div>
                ) : leads.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: designTokens.colors.textSecondary }}>No leads found for the selected filters.</div>
                ) : (
                    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '500px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name / Contact</th>
                                    <th style={styles.th}>Domain</th>
                                    <th style={styles.th}>Stage & Disposition</th>
                                    <th style={styles.th}>Log Created At</th>
                                    <th style={styles.th}>Created On</th>
                                    <th style={styles.th}>Call Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map(lead => (
                                    <tr key={lead._id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '700', color: designTokens.colors.textPrimary, marginBottom: '4px' }}>{lead.full_name}</div>
                                            <div style={{ fontSize: '12px', color: designTokens.colors.textSecondary }}>{lead.phone_number} • {lead.email}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontSize: '13px', fontWeight: '600' }}>{lead.opted_domain || "N/A"}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                                <span style={styles.badge(getStageColor(lead.stage || "Fresh Lead"))}>{lead.stage || "Fresh Lead"}</span>
                                                {lead.disposition && <span style={{ fontSize: '12px', fontWeight: '600', color: designTokens.colors.textSecondary }}>↳ {lead.disposition}</span>}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: designTokens.colors.textSecondary }}>
                                                {lead.last_interaction_at ? new Date(lead.last_interaction_at).toLocaleDateString("en-GB") : "N/A"}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: designTokens.colors.textSecondary }}>
                                                {new Date(lead.created_at).toLocaleDateString("en-GB")}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div 
                                                onClick={() => fetchCallLogs(lead)} 
                                                style={{ fontSize: '14px', fontWeight: 'bold', color: designTokens.colors.primary, cursor: 'pointer', textDecoration: 'underline' }}
                                                title="Click to view call logs"
                                            >
                                                {lead.attempt_count || 0}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', borderTop: `1px solid ${designTokens.colors.border}`, background: '#F8FAFC' }}>
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${designTokens.colors.border}`, background: currentPage === 1 ? '#e2e8f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Previous
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: designTokens.colors.textSecondary }}>Page {currentPage} of {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${designTokens.colors.border}`, background: currentPage === totalPages ? '#e2e8f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            </div>
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}>&times;</button>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#0F172A' }}>Call Logs</h2>
                        {loadingLogs ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>Loading logs...</div>
                        ) : selectedLeadCallLogs.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {selectedLeadCallLogs.map((log, index) => (
                                    <li key={index} style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', marginBottom: '12px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ fontWeight: '800', fontSize: '16px', color: designTokens.colors.primary, textTransform: 'capitalize' }}>
                                                    {log.disposition || (log.callOutcome ? log.callOutcome.replace(/_/g, ' ') : 'Call Attempted')}
                                                </div>
                                                {log.actionType && (
                                                    <span style={{ fontSize: '11px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#475569' }}>
                                                        {log.actionType}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                                                {new Date(log.createdAt).toLocaleString("en-GB")}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#475569' }}>
                                            {log.specialistName && <div><strong>By:</strong> {log.specialistName}</div>}
                                            {log.stage && <div><strong>Stage:</strong> {log.stage}</div>}
                                            {log.duration && <div><strong>Duration:</strong> {log.duration} sec</div>}
                                            {log.followUpDate && <div><strong>Follow-up:</strong> {new Date(log.followUpDate).toLocaleString("en-GB", { dateStyle: 'short', timeStyle: 'short' })}</div>}
                                            {log.demoScheduleDate && <div><strong>Demo:</strong> {new Date(log.demoScheduleDate).toLocaleString("en-GB", { dateStyle: 'short', timeStyle: 'short' })}</div>}
                                        </div>

                                        {log.remark && <div style={{ marginTop: '8px', fontSize: '13px', color: '#334155', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}><strong>Remark:</strong> {log.remark}</div>}
                                        {log.summary && <div style={{ marginTop: '8px', fontSize: '13px', color: '#334155', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}><strong>Summary:</strong> {log.summary}</div>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No call logs found for this lead.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default AdvTeamFilter;
