import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";

const AdvTeamMyLeads = () => {
    const [leads, setLeads] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

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

    // Read from localStorage (set on login)
    const userId = localStorage.getItem("advTeamId");
    const userName = localStorage.getItem("advTeamName");
    const designation = localStorage.getItem("advTeamDesignation") || "";
    const isLeader = designation.toLowerCase().includes("leader");
    const isSpecialist = designation.toLowerCase().includes("specialist") || designation.toLowerCase().includes("sales");
    const isManager = !isLeader && !isSpecialist;
    const apiRole = isSpecialist ? "SR Inside Sales Specialist" : isLeader ? "ADV Leader" : "ADV Manager";
    const canAssign = !isSpecialist;

    // Who can the current user assign to?
    const assignTargetLabel = isManager ? "Leader" : "SR Sales Specialist";

    const fetchMyLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: { role: apiRole, userId, page, limit, strictlyOwned: true }
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
            toast.error("Failed to fetch leads");
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await axios.get(`${API}/getadvteam`);
            setTeamMembers(res.data || []);
        } catch (err) {
            console.error("Failed to fetch team members");
        }
    };

    useEffect(() => {
        fetchMyLeads(1);
        fetchTeamMembers();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchMyLeads(newPage);
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
        const available = availableLeads.length;
        if (num > available) { toast.error(`Only ${available} assignable leads available on this page`); return; }

        setAssigning(true);
        try {
            let res;
            if (isManager) {
                res = await axios.post(`${API}/api/adv-leads/bulk-assign-to-leader`, {
                    managerId: userId,
                    leaderId: selectedMember._id,
                    leaderName: selectedMember.fullname,
                    count: num
                });
            } else {
                res = await axios.post(`${API}/api/adv-leads/bulk-assign-to-specialist`, {
                    leaderId: userId,
                    specialistId: selectedMember._id,
                    specialistName: selectedMember.fullname,
                    count: num
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

    const assignTargets = isManager
        ? teamMembers.filter(m => m.designation === "ADV Leader" && m.status === "Active")
        : teamMembers.filter(m =>
            (m.designation === "SR Inside Sales Specialist" || m.designation === "Inside Sales Specialist") && m.status === "Active"
        );

    const availableLeadsCount = leads.filter(l => {
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
        const matchStatus = !statusFilter || l.status === statusFilter;
        let matchDate = true;
        if (dateFilter && l.created_at) {
          const leadDate = new Date(l.created_at).toISOString().split('T')[0];
          matchDate = leadDate === dateFilter;
        }
        return matchSearch && matchStatus && matchDate;
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
                        <button onClick={() => setShowAssignPanel(true)} style={{ padding: '10px 22px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📤 Assign to {assignTargetLabel}
                            {availableLeadsCount > 0 && <span style={{ background: '#fff', color: '#52c41a', borderRadius: '12px', padding: '1px 8px', fontSize: '13px', fontWeight: 'bold' }}>{availableLeadsCount}</span>}
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'This Page', count: leads.length, bg: '#f9f9f9', border: '#d9d9d9', color: '#333' },
                        { label: 'Total Leads', count: totalCount, bg: '#e6f7ff', border: '#91d5ff', color: '#096dd9' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '12px 18px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', flex: 1, minWidth: '100px', textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', color: s.color }}>{s.count}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <input placeholder="Search current page..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', flex: 1, minWidth: '180px' }} />
                    <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} title="Filter by Assigned Date" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <option value="">All Statuses</option>
                        <option value="fresh">Fresh</option>
                        <option value="assigned_to_manager">Assigned to Manager</option>
                        <option value="assigned_to_leader">With Leader</option>
                        <option value="assigned_to_specialist">With Specialist</option>
                        <option value="in_followup">In Follow-up</option>
                        <option value="converted">Converted</option>
                    </select>
                    <button onClick={() => fetchMyLeads(1)} style={{ padding: '8px 14px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>🔄 Refresh</button>
                </div>

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
                                         <th>#</th>
                                         <th>Name</th>
                                         <th>Email</th>
                                         <th>Phone</th>
                                         <th>Domain</th>
                                         <th>Education</th>
                                         <th>Status</th>
                                         <th>Assigned To</th>
                                         <th>Assigned Date</th>
                                         <th>Score</th>
                                     </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead, idx) => {
                                        const sc = statusBadgeStyle(lead.status);
                                        return (
                                            <tr key={lead._id}>
                                                <td style={{ color: '#888', fontSize: '12px' }}>{(currentPage - 1) * limit + idx + 1}</td>
                                                <td><strong>{lead.full_name}</strong></td>
                                                <td style={{ fontSize: '12px', color: '#666' }}>{lead.email || '—'}</td>
                                                <td>{lead.phone_number}</td>
                                                <td>{lead.opted_domain || '—'}</td>
                                                <td style={{ fontSize: '12px', color: '#555' }}>{lead.education_background || '—'}</td>
                                                <td>
                                                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, whiteSpace: 'nowrap' }}>
                                                        {lead.status?.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#555' }}>
                                                    {lead.owner_name || lead.current_owner_id?.name || '—'}
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#555' }}>
                                                    {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                </td>
                                                <td>
                                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: (lead.score || 0) > 15 ? '#f6ffed' : '#f5f5f5', border: `1px solid ${(lead.score || 0) > 15 ? '#b7eb8f' : '#d9d9d9'}` }}>
                                                        {lead.score || 0}
                                                    </span>
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
        </div>
    );
};

export default AdvTeamMyLeads;
