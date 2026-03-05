import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvLeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [managers, setManagers] = useState([]);
    const [freshCount, setFreshCount] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 25;

    // Assign panel state
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [assignCount, setAssignCount] = useState("");
    const [assigning, setAssigning] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchFreshCount = async () => {
        try {
            const res = await axios.get(`${API}/api/adv-leads/fresh-leads-count`);
            setFreshCount(res.data.count || 0);
        } catch (err) {
            console.error("Failed to fetch fresh count");
        }
    };

    const fetchLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: { role: "admin", page, limit }
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

    const fetchManagers = async () => {
        try {
            const res = await axios.get(`${API}/getadvteam`);
            const data = res.data || [];
            // Filter both Managers and Leaders
            setManagers(data.filter(m => (m.designation === "ADV Manager" || m.designation === "ADV Leader") && m.status === "Active"));
        } catch (err) {
            console.error("Failed to fetch assignees");
        }
    };

    useEffect(() => {
        fetchLeads(currentPage);
        fetchManagers();
        fetchFreshCount();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // ─── Bulk Assign ─────────────────────────────────────────────────────────────
    const handleBulkAssign = async () => {
        if (!selectedAssignee) { toast.error("Please select a person"); return; }
        const num = parseInt(assignCount);
        if (!num || num < 1) { toast.error("Please enter a valid number of leads"); return; }
        if (num > freshCount) { toast.error(`Only ${freshCount} fresh leads available`); return; }

        setAssigning(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/admin-bulk-assign`, {
                assigneeId: selectedAssignee._id,
                assigneeName: selectedAssignee.fullname,
                assigneeRole: selectedAssignee.designation,
                count: num
            });
            toast.success(res.data.message);
            setShowAssignPanel(false);
            setSelectedAssignee(null);
            setAssignCount("");
            fetchLeads(1);
            fetchFreshCount();
        } catch (err) {
            toast.error(err.response?.data?.message || "Assignment failed");
        } finally {
            setAssigning(false);
        }
    };

    const statusColor = (status) => {
        const map = {
            fresh: { bg: '#e6f7ff', border: '#91d5ff', color: '#096dd9' },
            assigned_to_manager: { bg: '#fff7e6', border: '#ffd591', color: '#d46b08' },
            assigned_to_leader: { bg: '#f9f0ff', border: '#d3adf7', color: '#531dab' },
            assigned_to_specialist: { bg: '#f0f5ff', border: '#adc6ff', color: '#1d39c4' },
            in_followup: { bg: '#fffbe6', border: '#ffe58f', color: '#ad8b00' },
            converted: { bg: '#f6ffed', border: '#b7eb8f', color: '#389e0d' },
        };
        return map[status] || { bg: '#f5f5f5', border: '#d9d9d9', color: '#595959' };
    };

    const filteredLeads = leads.filter(l => {
        const matchSearch = (l.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.phone_number || "").includes(searchTerm);
        const matchStatus = !statusFilter || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const styles = {
        pagination: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '16px 20px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eee'
        }
    }

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />

            {/* ── Assign Panel Overlay ─────────────────────── */}
            {showAssignPanel && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '12px', padding: '30px',
                        width: '100%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Assign Fresh Leads</h2>
                            <button onClick={() => { setShowAssignPanel(false); setSelectedAssignee(null); setAssignCount(""); }}
                                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' }}>✕</button>
                        </div>

                        {/* Fresh leads available badge */}
                        <div style={{ padding: '12px 16px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#096dd9' }}>{freshCount}</span>
                            <div style={{ fontSize: '13px', color: '#666' }}>Fresh Leads Available</div>
                        </div>

                        {/* Step 1: Select Manager */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
                                Step 1 — Select Manager or Leader
                            </label>
                            <select
                                value={selectedAssignee?._id || ""}
                                onChange={e => {
                                    const m = managers.find(m => m._id === e.target.value);
                                    setSelectedAssignee(m || null);
                                }}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                            >
                                <option value="">-- Select a Person --</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.fullname} ({m.designation} - {m.team})</option>
                                ))}
                            </select>
                            {managers.length === 0 && (
                                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#ff4d4f' }}>
                                    No ADV Managers or Leaders found. Create one in Create ADV Team.
                                </p>
                            )}
                        </div>

                        {/* Step 2: Enter count (only visible after manager selected) */}
                        {selectedAssignee && (
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
                                    Step 2 — How many leads to assign to <strong style={{ color: '#1890ff' }}>{selectedAssignee.fullname}</strong>?
                                </label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max={freshCount}
                                        placeholder={`Max: ${freshCount}`}
                                        value={assignCount}
                                        onChange={e => setAssignCount(e.target.value)}
                                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                                        onKeyDown={e => e.key === 'Enter' && handleBulkAssign()}
                                    />
                                    <button
                                        onClick={() => setAssignCount(String(freshCount))}
                                        style={{ padding: '9px 12px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        All
                                    </button>
                                </div>
                                {assignCount && parseInt(assignCount) > freshCount && (
                                    <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#ff4d4f' }}>
                                        Only {freshCount} fresh leads available
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleBulkAssign}
                            disabled={assigning || !selectedAssignee || !assignCount}
                            style={{
                                width: '100%', padding: '12px',
                                background: !selectedAssignee || !assignCount ? '#f0f0f0' : '#1890ff',
                                color: !selectedAssignee || !assignCount ? '#aaa' : '#fff',
                                border: 'none', borderRadius: '8px', fontSize: '15px',
                                fontWeight: 'bold', cursor: !selectedAssignee || !assignCount ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {assigning ? "Assigning..." : `✅ Assign ${assignCount || "?"} Leads to ${selectedAssignee?.fullname || "Person"}`}
                        </button>
                    </div>
                </div>
            )}

            <div className="coursetable">
                {/* ── Header Row ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <h1>ADV Lead Management</h1>
                    <button
                        onClick={() => setShowAssignPanel(true)}
                        style={{
                            padding: '10px 22px', background: '#1890ff', color: '#fff',
                            border: 'none', borderRadius: '8px', fontSize: '15px',
                            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        📋 Assign Leads
                        {freshCount > 0 && (
                            <span style={{ background: '#fff', color: '#1890ff', borderRadius: '12px', padding: '1px 8px', fontSize: '13px', fontWeight: 'bold' }}>
                                {freshCount} fresh
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Stats Row ── */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Total Leads', count: totalCount, bg: '#f9f9f9', border: '#d9d9d9', color: '#333' },
                        { label: '🟢 Fresh', count: freshCount, bg: '#e6f7ff', border: '#91d5ff', color: '#096dd9' },
                        { label: '🟠 Assigned', count: totalCount - freshCount - leads.filter(l => l.status === 'converted').length, bg: '#fff7e6', border: '#ffd591', color: '#d46b08' },
                        { label: '✅ Converted', count: 'Check API', bg: '#f6ffed', border: '#b7eb8f', color: '#389e0d' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '12px 20px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px', flex: 1, minWidth: '110px', textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 'bold', color: s.color }}>{s.count}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <input
                        placeholder="Search name or phone..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', flex: 1, minWidth: '180px' }}
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <option value="">All Statuses</option>
                        <option value="fresh">Fresh</option>
                        <option value="assigned_to_manager">Assigned to Manager</option>
                        <option value="assigned_to_leader">Assigned to Leader</option>
                        <option value="assigned_to_specialist">Assigned to Specialist</option>
                        <option value="in_followup">In Follow-up</option>
                        <option value="converted">Converted</option>
                    </select>
                    <button onClick={() => { fetchLeads(1); fetchFreshCount(); }}
                        style={{ padding: '8px 14px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>
                        🔄 Refresh
                    </button>
                </div>

                {/* ── Leads Table ── */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading leads...</div>
                ) : filteredLeads.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #eee', borderRadius: '8px', color: '#888' }}>
                        <div style={{ fontSize: '40px' }}>📭</div>
                        <p>No leads found.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Domain</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Assigned To</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead, idx) => {
                                        const sc = statusColor(lead.status);
                                        return (
                                            <tr key={lead._id}>
                                                <td style={{ color: '#888', fontSize: '12px' }}>{(currentPage - 1) * limit + idx + 1}</td>
                                                <td><strong>{lead.full_name}</strong></td>
                                                <td>{lead.phone_number}</td>
                                                <td>{lead.opted_domain || '—'}</td>
                                                <td>{lead.company_name || '—'}</td>
                                                <td>
                                                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, whiteSpace: 'nowrap' }}>
                                                        {lead.status?.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#555' }}>
                                                    {lead.owner_name || lead.current_owner_id?.name || '—'}
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

export default AdvLeadManagement;
