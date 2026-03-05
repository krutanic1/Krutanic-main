import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

const ManagerDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('leads');

    // Existing ADV Team login stores these keys in localStorage
    const managerId = localStorage.getItem("advTeamId");
    const managerName = localStorage.getItem("advTeamName");
    const managerTeam = localStorage.getItem("advTeamName"); // teams are stored by name
    const designation = localStorage.getItem("designation");

    const fetchMyLeads = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: {
                    role: "ADV Manager",
                    userId: managerId,
                }
            });
            setLeads(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            toast.error("Failed to fetch leads");
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const [teamsRes, alertsRes] = await Promise.allSettled([
                axios.get(`${API}/getadvteam`),
                axios.get(`${API}/api/adv-reports/performance-alerts`)
            ]);
            if (teamsRes.status === 'fulfilled') {
                // Filter team members that are in this manager's team
                setTeamsData(teamsRes.value.data || []);
            }
            if (alertsRes.status === 'fulfilled') {
                setAlerts(alertsRes.value.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch team data");
        }
    };

    useEffect(() => {
        fetchMyLeads();
        fetchTeams();
    }, []);

    // Re-assign a lead to a specialist
    const handleAssignToSpecialist = async (leadId, specialistId, specialistName) => {
        if (!specialistId) return;
        try {
            await axios.put(`${API}/api/adv-leads/assign-lead-to-specialist/${leadId}`, {
                specialistId,
                specialistName
            });
            toast.success(`Assigned to ${specialistName}`);
            fetchMyLeads();
        } catch (err) {
            toast.error("Assignment failed");
        }
    };

    const specialists = teamsData.filter(m =>
        (m.designation === "SR Inside Sales Specialist" || m.designation === "Inside Sales Specialist") &&
        m.status === "Active"
    );

    const leaders = teamsData.filter(m =>
        m.designation === "ADV Leader" && m.status === "Active"
    );

    const statusColor = (status) => {
        const map = {
            fresh: { bg: '#e6f7ff', border: '#91d5ff' },
            assigned_to_manager: { bg: '#fff7e6', border: '#ffd591' },
            assigned_to_specialist: { bg: '#f9f0ff', border: '#d3adf7' },
            in_followup: { bg: '#fffbe6', border: '#ffe58f' },
            converted: { bg: '#f6ffed', border: '#b7eb8f' },
            closed: { bg: '#f5f5f5', border: '#d9d9d9' }
        };
        return map[status] || { bg: '#f5f5f5', border: '#d9d9d9' };
    };

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />
            <div className="coursetable">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <h1>Manager Dashboard</h1>
                    <div style={{ textAlign: 'right', color: '#555' }}>
                        <strong>{managerName || "Manager"}</strong>
                        {managerTeam && <span style={{ fontSize: '13px', color: '#888', display: 'block' }}>Team: {managerTeam}</span>}
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '15px 20px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{leads.length}</div>
                        <div style={{ color: '#555', fontSize: '13px' }}>Total Assigned</div>
                    </div>
                    <div style={{ padding: '15px 20px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{leads.filter(l => l.status === 'fresh' || l.status === 'assigned_to_manager').length}</div>
                        <div style={{ color: '#555', fontSize: '13px' }}>Pending Action</div>
                    </div>
                    <div style={{ padding: '15px 20px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{leads.filter(l => l.status === 'converted').length}</div>
                        <div style={{ color: '#555', fontSize: '13px' }}>Converted</div>
                    </div>
                    <div style={{ padding: '15px 20px', background: '#f9f0ff', border: '1px solid #d3adf7', borderRadius: '8px', flex: 1, minWidth: '120px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{leads.filter(l => l.status === 'assigned_to_specialist').length}</div>
                        <div style={{ color: '#555', fontSize: '13px' }}>With Specialist</div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                    {[
                        { id: 'leads', label: '📋 My Leads' },
                        { id: 'team', label: '👥 My Team' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                background: activeTab === tab.id ? '#1890ff' : '#f0f0f0',
                                color: activeTab === tab.id ? '#fff' : '#333',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div style={{ marginBottom: '15px', padding: '12px 15px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px' }}>
                        <strong style={{ color: '#cf1322' }}>🚨 {alerts.length} specialist(s) have low call activity today</strong>
                    </div>
                )}

                {/* Tab: My Leads */}
                {activeTab === 'leads' && (
                    <>
                        {loading ? <p>Loading leads...</p> : leads.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#888', border: '2px dashed #eee', borderRadius: '8px' }}>
                                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                                <p>No leads assigned to you yet.</p>
                                <p style={{ fontSize: '13px' }}>Ask admin to assign leads to you from <strong>ADV Lead Management</strong>.</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Score</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Domain</th>
                                        <th>Status</th>
                                        <th>Assign to Specialist</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map(lead => {
                                        const sc = statusColor(lead.status);
                                        return (
                                            <tr key={lead._id}>
                                                <td>
                                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '13px', background: (lead.score || 0) > 15 ? '#f6ffed' : '#f5f5f5', border: `1px solid ${(lead.score || 0) > 15 ? '#b7eb8f' : '#d9d9d9'}` }}>
                                                        {lead.score || 0}
                                                    </span>
                                                </td>
                                                <td><strong>{lead.full_name}</strong></td>
                                                <td>{lead.phone_number}</td>
                                                <td>{lead.opted_domain || '—'}</td>
                                                <td>
                                                    <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', background: sc.bg, border: `1px solid ${sc.border}` }}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        defaultValue=""
                                                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', width: '100%' }}
                                                        onChange={(e) => {
                                                            const sel = specialists.find(s => s._id === e.target.value);
                                                            if (sel) handleAssignToSpecialist(lead._id, sel._id, sel.fullname);
                                                        }}
                                                    >
                                                        <option value="" disabled>
                                                            {lead.owner_name && lead.status === 'assigned_to_specialist'
                                                                ? `✅ ${lead.owner_name}`
                                                                : 'Assign to Specialist...'}
                                                        </option>
                                                        {specialists.map(s => (
                                                            <option key={s._id} value={s._id}>{s.fullname}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {/* Tab: My Team */}
                {activeTab === 'team' && (
                    <div>
                        <h3>Leaders ({leaders.length})</h3>
                        {leaders.length === 0 ? <p style={{ color: '#888' }}>No leaders found.</p> : (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
                                {leaders.map(l => (
                                    <div key={l._id} style={{ padding: '15px 20px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', minWidth: '200px' }}>
                                        <strong>{l.fullname}</strong>
                                        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>{l.email}</p>
                                        <p style={{ margin: '2px 0', color: '#888', fontSize: '12px' }}>Team: {l.team}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h3>Specialists ({specialists.length})</h3>
                        {specialists.length === 0 ? <p style={{ color: '#888' }}>No specialists found.</p> : (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {specialists.map(s => (
                                    <div key={s._id} style={{ padding: '15px 20px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px', minWidth: '200px' }}>
                                        <strong>{s.fullname}</strong>
                                        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>{s.email}</p>
                                        <p style={{ margin: '2px 0', color: '#888', fontSize: '12px' }}>{s.designation}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
