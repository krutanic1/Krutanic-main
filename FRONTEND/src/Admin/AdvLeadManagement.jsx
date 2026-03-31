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

    // Manual Assign State
    const [isManualAssignMode, setIsManualAssignMode] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState([]);

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
            // For Admin, show all active team members (Managers, Leaders, Specialists) as potential assignees
            setManagers(data.filter(m => m.status === "Active"));
        } catch (err) {
            console.error("Failed to fetch assignees");
        }
    };

    useEffect(() => {
        fetchLeads(currentPage);
        fetchManagers();
        fetchFreshCount();
    }, [currentPage]);

    const handleMakeDialed = async (leadId) => {
        if (!window.confirm("Are you sure you want to change this lead status to 'dialed'? This will delete all call logs and reset assignments.")) return;
        
        try {
            const res = await axios.put(`${API}/api/adv-leads/make-dialed/${leadId}`);
            toast.success(res.data.message);
            fetchLeads(currentPage);
            fetchFreshCount();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset lead");
        }
    };

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

    const handleManualAssign = async () => {
        if (selectedLeadIds.length === 0) {
            toast.error("Please select at least one lead");
            return;
        }
        if (!selectedAssignee) {
            toast.error(`Please select a person below`);
            return;
        }

        setAssigning(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/manual-bulk-assign`, {
                leadIds: selectedLeadIds,
                assigneeId: selectedAssignee._id,
                assigneeName: selectedAssignee.fullname,
                assigneeRole: selectedAssignee.designation
            });
            toast.success(res.data.message);
            setIsManualAssignMode(false);
            setSelectedLeadIds([]);
            setSelectedAssignee(null);
            fetchLeads(currentPage);
            fetchFreshCount();
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
        if (selectedLeadIds.length === filteredLeads.length) {
            setSelectedLeadIds([]);
        } else {
            setSelectedLeadIds(filteredLeads.map(l => l._id));
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
            dialed: { bg: '#f9f0ff', border: '#d3adf7', color: '#722ed1' }, // Added dialed status color
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
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {!isManualAssignMode ? (
                            <>
                                <button
                                    onClick={() => { setIsManualAssignMode(true); setSelectedLeadIds([]); }}
                                    style={{
                                        padding: '10px 22px', background: '#fff', color: '#1890ff',
                                        border: '1px solid #1890ff', borderRadius: '8px', fontSize: '15px',
                                        fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    🖱️ Manual Assign
                                </button>
                                <button
                                    onClick={() => setShowAssignPanel(true)}
                                    style={{
                                        padding: '10px 22px', background: '#1890ff', color: '#fff',
                                        border: 'none', borderRadius: '8px', fontSize: '15px',
                                        fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    📋 Bulk Assign (Count)
                                    {freshCount > 0 && (
                                        <span style={{ background: '#fff', color: '#1890ff', borderRadius: '12px', padding: '1px 8px', fontSize: '13px', fontWeight: 'bold' }}>
                                            {freshCount} fresh
                                        </span>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { setIsManualAssignMode(false); setSelectedLeadIds([]); }}
                                style={{
                                    padding: '10px 22px', background: '#ff4d4f', color: '#fff',
                                    border: 'none', borderRadius: '8px', fontSize: '15px',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                ❌ Cancel Manual Mode
                            </button>
                        )}
                    </div>
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

                {/* ── Manual Assign Bar (Full Width) ── */}
                {isManualAssignMode && (
                    <div style={{ 
                        padding: '16px 24px', 
                        background: '#f0f7ff', 
                        border: '1px solid #1890ff', 
                        borderRadius: '12px', 
                        marginBottom: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.1)',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ 
                                background: '#1890ff', 
                                color: '#fff', 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                textAlign: 'center',
                                minWidth: '100px'
                            }}>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedLeadIds.length}</div>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected</div>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#003a8c' }}>Manual Assignment Mode</h3>
                                <p style={{ margin: 0, fontSize: '12px', color: '#40a9ff' }}>Select leads below and choose an assignee</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '600px', marginLeft: '40px' }}>
                            <select
                                value={selectedAssignee?._id || ""}
                                onChange={e => {
                                    const m = managers.find(m => m._id === e.target.value);
                                    setSelectedAssignee(m || null);
                                }}
                                style={{ 
                                    flex: 1, 
                                    padding: '10px 15px', 
                                    border: '1px solid #d9d9d9', 
                                    borderRadius: '8px', 
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                            >
                                <option value="">-- Select Assignee (Manager / Leader / Specialist) --</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>
                                        {m.fullname} ({m.designation} - {m.team || 'No Team'})
                                    </option>
                                ))}
                            </select>
                            
                            <button
                                onClick={handleManualAssign}
                                disabled={assigning || selectedLeadIds.length === 0 || !selectedAssignee}
                                style={{
                                    padding: '10px 28px',
                                    background: (selectedLeadIds.length === 0 || !selectedAssignee) ? '#f5f5f5' : '#1890ff',
                                    color: (selectedLeadIds.length === 0 || !selectedAssignee) ? '#bfbfbf' : '#fff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: (selectedLeadIds.length === 0 || !selectedAssignee) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: (selectedLeadIds.length === 0 || !selectedAssignee) ? 'none' : '0 2px 8px rgba(24, 144, 255, 0.3)'
                                }}
                            >
                                {assigning ? "Processing..." : <>✅ Confirm Assignment</>}
                            </button>
                        </div>
                    </div>
                )}

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
                        <option value="dialed">Dialed</option>
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
                                        {isManualAssignMode && (
                                            <th style={{ width: '40px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                                                    onChange={toggleAllSelection}
                                                />
                                            </th>
                                        )}
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Source</th>
                                        <th>Domain</th>
                                        <th>Education</th>
                                        <th>Status Info</th>
                                        <th>Backend Status</th>
                                        <th>Assigned To</th>
                                        <th>Score</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead, idx) => {
                                        const sc = statusColor(lead.status);
                                        const isSelected = selectedLeadIds.includes(lead._id);
                                        return (
                                            <tr key={lead._id} style={{ background: isSelected ? '#f6ffed' : 'transparent' }}>
                                                {isManualAssignMode && (
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleLeadSelection(lead._id)}
                                                        />
                                                    </td>
                                                )}
                                                <td style={{ color: '#888', fontSize: '12px' }}>{(currentPage - 1) * limit + idx + 1}</td>
                                                <td><strong>{lead.full_name}</strong></td>
                                                <td style={{ fontSize: '12px', color: '#666' }}>{lead.email}</td>
                                                <td>{lead.phone_number}</td>
                                                <td style={{ fontSize: '12px', color: '#666' }}>{lead.source || '—'}</td>
                                                <td style={{ fontSize: '13px' }}>{lead.opted_domain || '—'}</td>
                                                <td style={{ fontSize: '12px', color: '#555' }}>{lead.education_background || '—'}</td>
                                                <td style={{ fontSize: '12px', color: '#555' }}>{lead.current_status || '—'}</td>
                                                <td>
                                                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, whiteSpace: 'nowrap' }}>
                                                        {lead.status?.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '13px', color: '#555' }}>
                                                    {(() => {
                                                        const name = lead.owner_name || lead.current_owner_id?.name || '—';
                                                        const team = lead.team_name || lead.team_id?.team_name || managers.find(m => m.fullname === name || m._id === (lead.owner_id || lead.current_owner_id?._id))?.team;
                                                        return (
                                                            <>
                                                                {name}
                                                                {team && <><br /><span style={{ color: '#1890ff', fontSize: '11px', fontWeight: '600' }}>({team})</span></>}
                                                            </>
                                                        );
                                                    })()}
                                                </td>
                                                <td>
                                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: (lead.score || 0) > 15 ? '#f6ffed' : '#f5f5f5', border: `1px solid ${(lead.score || 0) > 15 ? '#b7eb8f' : '#d9d9d9'}` }}>
                                                        {lead.score || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleMakeDialed(lead._id)}
                                                        title="Change to Dialed"
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: '#722ed1', // Deep purple for Dialed
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <i className="fa fa-refresh"></i> Dialed
                                                    </button>
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
