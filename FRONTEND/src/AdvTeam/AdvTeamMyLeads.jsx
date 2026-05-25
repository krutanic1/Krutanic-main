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

const AdvTeamMyLeads = () => {
    const [leads, setLeads] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    // stageFilter  → filters by SALES STAGE (Fresh Lead, Attempting Contact, etc.) via 'outcome' param
    // statusFilter → filters by ASSIGNMENT STATUS (assigned_to_leader, assigned_to_specialist) via 'status' param
    const [stageFilter, setStageFilter] = useState("Fresh Lead"); // Default: show uncalled leads
    const [dispositionFilter, setDispositionFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [outcomeCounts, setOutcomeCounts] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 25;

    // Assign panel state
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [assignCount, setAssignCount] = useState("");
    const [assigning, setAssigning] = useState(false);

    // Manual Assign State
    const [isManualAssignMode, setIsManualAssignMode] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState([]);

    // Lead View Modal State
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);

    // Read from localStorage (set on login)
    const userId = localStorage.getItem("advTeamId");
    const userName = localStorage.getItem("advTeamName");

    // Use state for profile data fetched from API (localStorage may be empty for old sessions)
    const [userProfile, setUserProfile] = useState(null);
    const designation = userProfile?.designation || localStorage.getItem("advTeamDesignation") || "";
    const userTeam = userProfile?.team || localStorage.getItem("advTeamTeam") || "";

    const isLeader = designation.toLowerCase().includes("leader");
    const isSpecialist = designation.toLowerCase().includes("specialist") || designation.toLowerCase().includes("sales") || designation.toLowerCase().includes("inside_sales");
    const isManager = designation.toLowerCase().includes("manager") || userName?.toLowerCase().includes("sumeetha");
    const apiRole = isSpecialist ? "SR Inside Sales Specialist" : isLeader ? "ADV Leader" : "ADV Manager";
    const canAssign = isManager;

    // Who can the current user assign to?
    const assignTargetLabel = isManager ? "Leader" : "SR Sales Specialist";

    const fetchMyLeads = async (page = 1, overrideStage = stageFilter, overrideStatus = statusFilter) => {
        setLoading(true);
        try {
            const params = { 
                role: apiRole, 
                userId, 
                page, 
                limit, 
                strictlyOwned: true, 
                source: sourceFilter,
                stage: overrideStage,
                disposition: dispositionFilter,
                status: overrideStatus
            };
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, { params });
            if (res.data && res.data.leads) {
                setLeads(res.data.leads);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
                setCurrentPage(res.data.currentPage);
            } else {
                setLeads([]);
                setTotalCount(0);
                setTotalPages(1);
            }
        } catch (err) {
            toast.error("Failed to fetch leads");
            setLeads([]);
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
                    strictlyOwned: true,
                    source: sourceFilter
                }
            });
            setOutcomeCounts(res.data);
        } catch (err) {
            console.error("Failed to fetch counts", err);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await axios.get(`${API}/getadvteam`);
            setTeamMembers(res.data);
        } catch (err) {
            console.error("Failed to fetch team members", err);
        }
    };

    // Always fetch profile from API so designation and team are always correct
    const fetchUserProfile = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API}/getadvteam`, { params: { advTeamId: userId } });
            if (res.data) {
                setUserProfile(res.data);
                // Update localStorage for future sessions
                localStorage.setItem("advTeamDesignation", res.data.designation || "");
                localStorage.setItem("advTeamTeam", res.data.team || "");
                
                // NOTE: Do NOT auto-set a status filter — it was restricting managers from
                // seeing fresh leads (status=fresh != assigned_to_manager). Default shows all.
            }
        } catch (err) {
            console.error("Failed to fetch user profile", err);
        }
    };

    // Fetch user profile and team members only once on mount (or when userId changes)
    useEffect(() => {
        if (userId) {
            fetchUserProfile();
            fetchTeamMembers();
            fetchOutcomeCounts();
        }
    }, [userId]);

    // Fetch leads whenever page, stageFilter, or statusFilter changes
    useEffect(() => {
        if (userId) {
            fetchMyLeads(currentPage, stageFilter, statusFilter);
            fetchOutcomeCounts();
        }
    }, [currentPage, stageFilter, dispositionFilter, statusFilter, sourceFilter, userId]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchMyLeads(newPage, stageFilter, statusFilter);
        }
    };

    // ── Bulk Assign ────────────────────────────────────────────────────────────
    const handleBulkAssign = async () => {
        if (!selectedMember) { toast.error(`Please select a ${assignTargetLabel}`); return; }
        const num = parseInt(assignCount);
        if (!num || num < 1) { toast.error("Please enter a valid number"); return; }

        // Note: For bulk assign, we might need all assignable leads, not just current page.
        // But the user's "availableLeadsCount" was calculated from current 'leads' state.
        // If we have 1000 leads, 'leads' only has 25. 
        // This is a common conflict when introducing pagination.
        // For now, I'll use the totalCount if it's accurate for "assignable" leads, 
        // but status filtering is done client-side in the original code.

        const availableLeads = leads.filter(l => {
            if (isManager) {
                return ["fresh", "assigned_to_team", "assigned_to_manager"].includes(l.status);
            } else if (isLeader) {
                return l.status === "assigned_to_leader";
            }
            return false;
        });
        if (num > availableLeadsCount) { 
            toast.error(`Only ${availableLeadsCount} assignable leads available.`); 
            return; 
        }

        setAssigning(true);
        try {
            let res;
            if (isManager) {
                res = await axios.post(`${API}/api/adv-leads/bulk-assign-to-leader`, {
                    managerId: userId,
                    leaderId: selectedMember._id,
                    leaderName: selectedMember.fullname,
                    count: num,
                    assignerName: userName
                });
            } else {
                res = await axios.post(`${API}/api/adv-leads/bulk-assign-to-specialist`, {
                    leaderId: userId,
                    specialistId: selectedMember._id,
                    specialistName: selectedMember.fullname,
                    count: num,
                    assignerName: userName
                });
            }
            toast.success(res.data.message);
            setShowAssignPanel(false);
            setSelectedMember(null);
            setAssignCount("");
            fetchMyLeads(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || "Assignment failed");
        } finally {
            setAssigning(false);
        }
    };

    const handleManualAssign = async () => {
        if (selectedLeadIds.length === 0) {
            toast.error("Please select at least one lead");
            return;
        }
        if (!selectedMember) {
            toast.error(`Please select a ${assignTargetLabel} below`);
            return;
        }

        setAssigning(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/manual-bulk-assign`, {
                leadIds: selectedLeadIds,
                assigneeId: selectedMember._id,
                assigneeName: selectedMember.fullname,
                assigneeRole: selectedMember.designation,
                assignerName: userName
            });
            toast.success(res.data.message);
            setIsManualAssignMode(false);
            setSelectedLeadIds([]);
            setSelectedMember(null);
            fetchMyLeads(currentPage);
        } catch (err) {
            toast.error(err.response?.data?.message || "Manual assignment failed");
        } finally {
            setAssigning(false);
        }
    };

    const toggleLeadSelection = (leadId) => {
        setSelectedLeadIds(prev =>
            prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
        );
    };

    const toggleAllSelection = () => {
        if (selectedLeadIds.length === leads.length) {
            setSelectedLeadIds([]);
        } else {
            setSelectedLeadIds(leads.map(l => l._id));
        }
    };

    const assignTargets = (() => {
        const members = teamMembers;
        if (isManager) {
            // Managers can assign to ANY active leader or specialist
            return members.filter(m => {
                const desig = (m.designation || "").toUpperCase();
                return (desig.includes("LEADER") || desig.includes("SPECIALIST")) && m.Access === true && m.status !== "Inactive";
            });
        } else {
            // Leaders are restricted to active specialists in their own team
            return members.filter(m => {
                const desig = (m.designation || "").toUpperCase();
                const sameTeam = !userTeam || (m.team || "").trim().toUpperCase() === userTeam.trim().toUpperCase();
                return desig.includes("SPECIALIST") && sameTeam && m.Access === true && m.status !== "Inactive";
            });
        }
    })();

    // Use server totalCount when a filter is active — gives the true full count, not just current page
    const availableLeadsCount = (stageFilter || statusFilter) 
        ? totalCount 
        : leads.filter(l => {
            if (isManager) {
                return ["fresh", "assigned_to_team", "assigned_to_manager"].includes(l.status);
            } else if (isLeader) {
                return l.status === "assigned_to_leader";
            }
            return false;
        }).length;

    const filteredLeads = leads.filter(l => {
        const matchSearch = (l.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.phone_number || "").includes(searchTerm);
        let matchDate = true;
        if (dateFilter && l.created_at) {
          const leadDate = new Date(l.created_at).toISOString().split('T')[0];
          matchDate = leadDate === dateFilter;
        }
        return matchSearch && matchDate;
    });

    const statusBadgeStyle = (status) => {
        const styles = {
            fresh: { bg: '#e6f7ff', border: '#91d5ff', color: '#096dd9' },
            assigned_to_manager: { bg: '#fff7e6', border: '#ffd591', color: '#d46b08' },
            assigned_to_leader: { bg: '#f9f0ff', border: '#d3adf7', color: '#531dab' },
            assigned_to_specialist: { bg: '#f0f5ff', border: '#adc6ff', color: '#1d39c4' },
            in_followup: { bg: '#fffbe6', border: '#ffe58f', color: '#ad8b00' },
            converted: { bg: '#f6ffed', border: '#b7eb8f', color: '#389e0d' },
            closed: { bg: '#f5f5f5', border: '#d9d9d9', color: '#595959' },
        };
        return styles[status] || styles.closed;
    };

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />

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
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.full_name}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Email Address</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.email || '—'}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Phone Number</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.phone_number}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#888', textTransform: 'uppercase' }}>Target Domain</label>
                                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedLeadForDetails.opted_domain || 'General'}</div>
                            </div>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px', color: '#1890ff', borderBottom: '1px dashed #ddd', paddingBottom: '8px' }}>🚀 Meta Ads & Questionnaire Info</h3>
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
                            <button onClick={() => setSelectedLeadForDetails(null)} style={{ padding: '10px 24px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Close Details</button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-center" />

            {showAssignPanel && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Assign Leads to {assignTargetLabel}</h2>
                            <button onClick={() => { setShowAssignPanel(false); setSelectedMember(null); setAssignCount(""); }}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}>✕</button>
                        </div>
                        <div style={{ padding: '12px 16px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#d46b08' }}>{availableLeadsCount}</span>
                            <div style={{ fontSize: '13px', color: '#666' }}>Your Assignable Leads on this page</div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>Step 1 — Select {assignTargetLabel}</label>
                            <select value={selectedMember?._id || ""} onChange={e => {
                                const m = assignTargets.find(m => m._id === e.target.value);
                                setSelectedMember(m || null);
                            }} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
                                <option value="">-- Select a {assignTargetLabel} --</option>
                                {assignTargets.map(m => <option key={m._id} value={m._id}>{m.fullname} ({m.team})</option>)}
                            </select>
                        </div>
                        {selectedMember && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>Step 2 — How many leads to send to <strong style={{ color: '#1890ff' }}>{selectedMember.fullname}</strong>?</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input type="number" min="1" max={availableLeadsCount} value={assignCount} onChange={e => setAssignCount(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} autoFocus />
                                    <button onClick={() => setAssignCount(String(availableLeadsCount))} style={{ padding: '9px 12px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>All</button>
                                </div>
                            </div>
                        )}
                        <button onClick={handleBulkAssign} disabled={assigning || !selectedMember || !assignCount} style={{ width: '100%', padding: '12px', background: !selectedMember || !assignCount ? '#f0f0f0' : '#52c41a', color: !selectedMember || !assignCount ? '#aaa' : '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: !selectedMember || !assignCount ? 'not-allowed' : 'pointer' }}>
                            {assigning ? "Assigning..." : `✅ Send ${assignCount || "?"} Leads to ${selectedMember?.fullname || assignTargetLabel}`}
                        </button>
                    </div>
                </div>
            )}

            <div className="coursetable">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>My Leads</h1>
                        <span style={{ color: '#888', fontSize: '13px' }}>{userName} — {designation}</span>
                    </div>
                    {canAssign && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {!isManualAssignMode ? (
                                <>{/* line 307 */}
                                    <button onClick={() => { setIsManualAssignMode(true); setSelectedLeadIds([]); }} style={{ padding: '10px 22px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        🖱️ Assign Manual Leads
                                    </button>
                                    <button onClick={() => setShowAssignPanel(true)} style={{ padding: '10px 22px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        📤 Bulk Assign (Count)
                                        {availableLeadsCount > 0 && <span style={{ background: '#fff', color: '#52c41a', borderRadius: '12px', padding: '1px 8px', fontSize: '13px', fontWeight: 'bold' }}>{availableLeadsCount}</span>}
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { setIsManualAssignMode(false); setSelectedLeadIds([]); }} style={{ padding: '10px 22px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    ❌ Cancel Manual Assignment
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[{ label: 'This Page', count: leads.length, bg: '#f9f9f9', border: '#d9d9d9', color: '#333' },
                        { label: 'Total Leads', count: totalCount, bg: '#e6f7ff', border: '#91d5ff', color: '#096dd9' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '12px 18px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', flex: 1, minWidth: '100px', textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', color: s.color }}>{s.count}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
                        </div>
                    ))}
                    {isManualAssignMode && (
                        <div style={{ padding: '12px 18px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px', flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d46b08' }}>{selectedLeadIds.length} Selected</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>Manual Selection Mode</div>
                            </div>
                            <select value={selectedMember?._id || ""} onChange={e => {
                                const m = assignTargets.find(m => m._id === e.target.value);
                                setSelectedMember(m || null);
                            }} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', flex: 2 }}>
                                <option value="">-- Assign to {assignTargetLabel} --</option>
                                {assignTargets.map(m => <option key={m._id} value={m._id}>{m.fullname}</option>)}
                            </select>
                            <button onClick={handleManualAssign} disabled={assigning || selectedLeadIds.length === 0 || !selectedMember} style={{ padding: '8px 16px', background: (selectedLeadIds.length === 0 || !selectedMember) ? '#ccc' : '#52c41a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: (selectedLeadIds.length === 0 || !selectedMember) ? 'not-allowed' : 'pointer' }}>
                                {assigning ? "..." : "Confirm"}
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <input placeholder="Search current page..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', flex: 1, minWidth: '180px' }} />
                    <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} title="Filter by Assigned Date" />

                    {/* STAGE filter — filters by sales interaction stage (not yet called, in conversation, etc.) */}
                    <select
                        value={stageFilter}
                        onChange={e => { setStageFilter(e.target.value); setStatusFilter(""); setCurrentPage(1); }}
                        style={{ padding: '8px', border: '2px solid #1890ff', borderRadius: '6px', fontWeight: '600', color: stageFilter ? '#096dd9' : '#333' }}
                        title="Filter by Sales Stage"
                    >
                        <option value="">📊 All Stages</option>
                        <option value="Fresh Lead">🆕 Fresh Lead (Not Called)</option>
                        <option value="Attempting Contact">📞 Attempting Contact ({outcomeCounts["Attempting Contact"] || 0})</option>
                        <option value="First Call Connected">✅ First Call Connected ({outcomeCounts["First Call Connected"] || 0})</option>
                        <option value="Demo Conducted">🎯 Demo Conducted ({outcomeCounts["Demo Conducted"] || 0})</option>
                        <option value="Closed Won">🏆 Closed Won ({outcomeCounts["Closed Won"] || 0})</option>
                        <option value="Closed Lost">❌ Closed Lost ({outcomeCounts["Closed Lost"] || 0})</option>
                    </select>

                    {/* DISPOSITION sub-filter — dynamic based on selected stage */}
                    {stageFilter && STAGES_AND_DISPOSITIONS[stageFilter] && (
                        <select
                            value={dispositionFilter}
                            onChange={e => { setDispositionFilter(e.target.value); setCurrentPage(1); }}
                            style={{ padding: '8px', border: '2px solid #722ed1', borderRadius: '6px', fontWeight: '600', color: dispositionFilter ? '#531dab' : '#333' }}
                            title="Filter by Disposition"
                        >
                            <option value="">🎯 All Dispositions</option>
                            {STAGES_AND_DISPOSITIONS[stageFilter].map(disp => (
                                <option key={disp} value={disp}>
                                    {disp}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* ASSIGNMENT STATUS filter — filters by who currently holds the lead */}
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setStageFilter(""); setCurrentPage(1); }}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px', color: statusFilter ? '#d46b08' : '#333' }}
                        title="Filter by Assignment Status"
                    >
                        <option value="">🔀 Assignment Status</option>
                        <option value="assigned_to_manager">Held by Manager</option>
                        <option value="assigned_to_leader">Sent to Leader</option>
                        <option value="assigned_to_specialist">Sent to Specialist</option>
                        <option value="in_followup">In Follow-up</option>
                        <option value="converted">Converted</option>
                    </select>

                    <button onClick={() => fetchMyLeads(1, stageFilter, statusFilter)} style={{ padding: '8px 14px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>🔄 Refresh</button>
                </div>

                {(userId === "69d4a881cb9305f0d5ecbeb2" || (userName && userName.toLowerCase().includes("sumeetha"))) && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', borderRight: '1px solid #e2e8f0' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6366f1' }}>fiber_new</span>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Old CRM:</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {[
                                "Fresh", "Interested", "Follow Up", "Callback", "No Answer", "Not Interested", "Junk", "Converted", "Unused"
                            ].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setSourceFilter("Old CRM");
                                        setCurrentPage(1);
                                    }}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        background: (statusFilter === status && sourceFilter === "Old CRM") ? '#6366f1' : '#fff',
                                        color: (statusFilter === status && sourceFilter === "Old CRM") ? '#fff' : '#64748b',
                                        border: '1px solid',
                                        borderColor: (statusFilter === status && sourceFilter === "Old CRM") ? '#6366f1' : '#e2e8f0',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setSourceFilter("");
                                    setStatusFilter("");
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    background: '#fff',
                                    color: '#ef4444',
                                    border: '1px solid #ef4444',
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading leads...</div>
                ) : filteredLeads.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #eee', borderRadius: '8px', color: '#888' }}>
                        <div style={{ fontSize: '40px' }}>📭</div>
                        <p>No leads match your filter or search on this page.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                     <tr>
                                         {isManualAssignMode && (
                                             <th style={{ width: '40px' }}>
                                                 <input type="checkbox" checked={selectedLeadIds.length === leads.length && leads.length > 0} onChange={toggleAllSelection} />
                                             </th>
                                         )}
                                         <th>#</th>
                                         <th>Name</th>
                                         <th>Email</th>
                                         <th>Phone</th>
                                         <th>Source</th>
                                         <th>Domain</th>
                                         <th>Education</th>
                                         <th>Assigned To</th>
                                         <th>Details</th>
                                         <th>Created At</th>
                                         <th>Assigned Date</th>
                                         <th>Score</th>
                                         <th>Actions</th>
                                      </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead, idx) => {
                                        const sc = statusBadgeStyle(lead.status);
                                        const isSelected = selectedLeadIds.includes(lead._id);
                                        return (
                                            <tr key={lead._id} style={{ background: isSelected ? '#f6ffed' : 'transparent' }}>
                                                {isManualAssignMode && (
                                                    <td>
                                                        <input type="checkbox" checked={isSelected} onChange={() => toggleLeadSelection(lead._id)} />
                                                    </td>
                                                )}
                                                <td style={{ color: '#888', fontSize: '12px' }}>{(currentPage - 1) * limit + idx + 1}</td>
                                                <td><strong>{lead.full_name}</strong></td>
                                                <td style={{ fontSize: '12px', color: '#666' }}>{lead.email || '—'}</td>
                                                <td>{lead.phone_number}</td>
                                                <td style={{ fontSize: '12px', color: '#666' }}>{lead.source || '—'}</td>
                                                <td>{lead.opted_domain || '—'}</td>
                                                <td style={{ fontSize: '12px', color: '#555' }}>{lead.education_background || '—'}</td>
                                                <td style={{ fontSize: '13px', color: '#555' }}>
                                                    {(() => {
                                                        const name = lead.owner_name || lead.current_owner_id?.name || '—';
                                                        const team = lead.team_name || lead.team_id?.team_name || teamMembers.find(m => m.fullname === name || m._id === (lead.owner_id || lead.current_owner_id?._id))?.team;
                                                        return (
                                                            <>
                                                                {name}
                                                                {team && <><br /><span style={{ color: '#1890ff', fontSize: '11px', fontWeight: '600' }}>({team})</span></>}
                                                            </>
                                                        );
                                                    })()}
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => setSelectedLeadForDetails(lead)}
                                                        style={{ 
                                                            padding: '6px 12px', background: '#fff', border: '1px solid #1890ff', 
                                                            color: '#1890ff', borderRadius: '6px', fontSize: '12px', fontWeight: '700', 
                                                            cursor: 'pointer', transition: 'all 0.2s' 
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = '#1890ff'; e.currentTarget.style.color = '#fff'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1890ff'; }}
                                                    >
                                                        <i className="fa fa-eye"></i> View All
                                                    </button>
                                                </td>
                                                <td style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>
                                                    {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#555', whiteSpace: 'nowrap' }}>
                                                    {lead.assigned_at ? new Date(lead.assigned_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—')}
                                                </td>
                                                <td>
                                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: (lead.score || 0) > 15 ? '#f6ffed' : '#f5f5f5', border: `1px solid ${(lead.score || 0) > 15 ? '#b7eb8f' : '#d9d9d9'}` }}>
                                                        {lead.score || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => setSelectedLead(lead)}
                                                        style={{ padding: '4px 10px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                                    >
                                                        👁️ View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                            <div style={{ fontSize: '13px', color: '#666' }}>Showing <strong>{(currentPage - 1) * limit + 1}</strong> to <strong>{Math.min(currentPage * limit, totalCount)}</strong> of <strong>{totalCount}</strong> leads</div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === 1 ? '#f9f9f9' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                                        return (
                                            <button key={p} onClick={() => handlePageChange(p)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === p ? '#1890ff' : '#fff', color: currentPage === p ? '#fff' : '#333', fontWeight: currentPage === p ? 'bold' : 'normal', cursor: 'pointer' }}>{p}</button>
                                        );
                                    } else if (p === currentPage - 3 || p === currentPage + 3) {
                                        return <span key={p} style={{ padding: '6px' }}>...</span>;
                                    }
                                    return null;
                                })}
                                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: currentPage === totalPages ? '#f9f9f9' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ── Lead Details Modal ── */}
            {selectedLead && (
                <div 
                    onClick={() => setSelectedLead(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                    >
                        <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '12px 12px 0 0' }}>
                            <h2 style={{ margin: 0, color: '#1a3353' }}>Lead Full Details</h2>
                            <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '25px' }}>
                            <h3 style={{ borderLeft: '4px solid #1890ff', paddingLeft: '10px', marginBottom: '15px', fontSize: '16px', color: '#1890ff' }}>Primary Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                {[
                                    { label: 'Full Name', value: selectedLead.full_name },
                                    { label: 'Email Address', value: selectedLead.email },
                                    { label: 'Phone Number', value: selectedLead.phone_number },
                                    { label: 'Opted Domain', value: selectedLead.opted_domain },
                                    { label: 'Lead Score', value: selectedLead.score || 0 },
                                    { label: 'Source', value: selectedLead.source },
                                    { label: 'Pipeline Stage', value: selectedLead.stage },
                                    { label: 'Disposition', value: selectedLead.last_outcome },
                                    { label: 'Interested Domain', value: selectedLead.interested_domain },
                                    { label: 'Work Experience', value: selectedLead.work_experience },
                                    { label: 'Upskilling Ready', value: selectedLead.upskilling_ready },
                                    { label: 'Start Timeframe', value: selectedLead.start_timeframe },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.label}</div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500', marginTop: '4px' }}>{item.value || '—'}</div>
                                    </div>
                                ))}
                            </div>

                            {selectedLead.extra_fields && Object.keys(selectedLead.extra_fields).length > 0 && (
                                <>
                                    <h3 style={{ borderLeft: '4px solid #faad14', paddingLeft: '10px', marginBottom: '15px', fontSize: '16px', color: '#faad14' }}>Additional Imported Data</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px', padding: '15px', background: '#fcfcfc', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                                        {Object.entries(selectedLead.extra_fields).map(([key, value], idx) => (
                                            <div key={idx}>
                                                <div style={{ fontSize: '11px', color: '#888', textTransform: 'capitalize', fontWeight: 'bold' }}>{key.replace(/_/g, ' ')}</div>
                                                <div style={{ fontSize: '14px', color: '#333', fontWeight: '500', marginTop: '4px' }}>{String(value) || '—'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <h3 style={{ borderLeft: '4px solid #722ed1', paddingLeft: '10px', marginBottom: '15px', fontSize: '16px', color: '#722ed1' }}>System Metadata</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                {[
                                    { label: 'Assigned To', value: selectedLead.owner_name || selectedLead.current_owner_id?.name },
                                    { label: 'Team', value: selectedLead.team_name || selectedLead.team_id?.team_name },
                                    { label: 'Lead ID', value: selectedLead._id },
                                    { label: 'Created At', value: selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : '—' },
                                    { label: 'Last Interaction', value: selectedLead.last_interaction_at ? new Date(selectedLead.last_interaction_at).toLocaleString() : '—' },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.label}</div>
                                        <div style={{ fontSize: '14px', color: '#333', fontWeight: '500', marginTop: '4px', wordBreak: 'break-all' }}>{item.value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ padding: '20px 25px', borderTop: '1px solid #eee', textAlign: 'right', background: '#f9f9f9', borderRadius: '0 0 12px 12px' }}>
                            <button onClick={() => setSelectedLead(null)} style={{ padding: '10px 25px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Close Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvTeamMyLeads;
