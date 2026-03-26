import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvLeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 25;

    // Auth context
    const advTeamId = localStorage.getItem("advTeamId");
    const [userDesignation, setUserDesignation] = useState("");

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Assign panel state
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [specialists, setSpecialists] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState(null);
    const [assignCount, setAssignCount] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [freshCount, setFreshCount] = useState(0);

    // Upload state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [userName, setUserName] = useState("");

    const fetchAdvTeamProfile = async () => {
        if (!advTeamId) return;
        try {
            const res = await axios.get(`${API}/getadvteam`, { params: { advTeamId } });
            setUserDesignation(res.data.designation);
            setUserName(res.data.fullname);
        } catch (err) {
            console.error("Failed to fetch profile");
        }
    };

    const fetchSpecialists = async () => {
        if (!advTeamId) return;
        try {
            // Find team where this user is leader or manager
            const res = await axios.get(`${API}/api/adv-leads/get-my-team-specialists`, {
                params: { userId: advTeamId }
            });
            setSpecialists(res.data.specialists || []);
        } catch (err) {
            console.error("Failed to fetch specialists");
        }
    };//dfghjklfghj

    const fetchFreshCount = async () => {
        try {
            const endpoint = (userDesignation === "admin" || userDesignation === "ADMIN") 
                ? `${API}/api/adv-leads/fresh-leads-count` 
                : `${API}/api/adv-leads/owned-leads-count`;
            
            const res = await axios.get(endpoint, {
                params: { userId: advTeamId, role: userDesignation }
            });
            setFreshCount(res.data.count || 0);
        } catch (err) {
            console.error("Failed to fetch count");
        }
    };

    const fetchLeads = async (page = 1) => {
        if (!userDesignation) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: {
                    role: userDesignation,
                    userId: advTeamId,
                    page,
                    limit
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
            toast.error("Failed to fetch leads");
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!file) { toast.error("Please select a file"); return; }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploaderId", advTeamId);
        formData.append("uploaderRole", userDesignation);
        formData.append("uploaderName", userName);

        setUploading(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/bulk-import`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Import Complete!");
            setImportStats(res.data);
            fetchLeads(1);
            fetchFreshCount();
        } catch (err) {
            toast.error(err.response?.data?.message || "Import failed");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (advTeamId) {
            fetchAdvTeamProfile();
            fetchSpecialists();
            fetchFreshCount();
        }
    }, [advTeamId]);

    useEffect(() => {
        if (userDesignation) {
            fetchLeads(currentPage);
        }
    }, [currentPage, userDesignation]);

    const handleBulkAssign = async () => {
        if (!selectedAssignee) { toast.error("Please select a specialist"); return; }
        const num = parseInt(assignCount);
        if (!num || num < 1) { toast.error("Please enter a valid number"); return; }
        if (num > freshCount) { toast.error(`Only ${freshCount} fresh leads available`); return; }

        setAssigning(true);
        try {
            const res = await axios.post(`${API}/api/adv-leads/leader-bulk-assign-specialist`, {
                leaderId: advTeamId,
                specialistId: selectedAssignee._id,
                specialistName: selectedAssignee.fullname,
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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getStatusStyle = (status) => {
        const map = {
            'fresh': { bg: '#e6f7ff', border: '#91d5ff', color: '#1890ff' },
            'assigned_to_manager': { bg: '#fff7e6', border: '#ffd591', color: '#fa8c16' },
            'assigned_to_leader': { bg: '#f9f0ff', border: '#d3adf7', color: '#722ed1' },
            'assigned_to_specialist': { bg: '#f6ffed', border: '#b7eb8f', color: '#52c41a' },
            'converted': { bg: '#fff0f6', border: '#ffadd2', color: '#eb2f96' },
            'closed': { bg: '#f5f5f5', border: '#d9d9d9', color: '#8c8c8c' }
        };
        return map[status] || { bg: '#f5f5f5', border: '#d9d9d9', color: '#595959' };
    };

    const filteredLeads = leads.filter(l => {
        const matchSearch = (l.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.phone_number || "").includes(searchTerm);
        const matchStatus = !statusFilter || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div id="create-marketing-team">
            <div className="coursetable">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h1>Team Lead Management ({userDesignation})</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {(userDesignation === "ADV Leader" || userDesignation === "LEADER" || userDesignation === "MANAGER" || userDesignation === "ADV Manager") && (
                            <button
                                onClick={() => { setShowUploadModal(true); setImportStats(null); setFile(null); }}
                                style={{
                                    padding: '10px 20px',
                                    background: '#2ecc71',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fa fa-upload"></i> Upload Leads
                            </button>
                        )}
                        {(userDesignation === "ADV Leader" || userDesignation === "LEADER" || userDesignation === "MANAGER" || userDesignation === "ADV Manager") && (
                            <button
                                onClick={() => setShowAssignPanel(true)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#1890ff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fa fa-user-plus"></i> Assign Leads <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{freshCount} available</span>
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '12px 20px', background: '#f9f9f9', border: '1px solid #d9d9d9', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{totalCount}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Total Leads</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 15px', border: '1px solid #ddd', borderRadius: '8px', flex: 1, minWidth: '200px' }}
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '150px' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="fresh">Fresh</option>
                        <option value="assigned_to_manager">Assigned to Manager</option>
                        <option value="assigned_to_leader">Assigned to Leader</option>
                        <option value="assigned_to_specialist">Assigned to Specialist</option>
                        <option value="converted">Converted</option>
                    </select>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Loading leads...</p>
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
                                        <th>Status Info</th>
                                        <th>Backend Status</th>
                                        <th>ASSISTED TO</th>
                                        <th>Score</th>
                                        <th>Other Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead, idx) => {
                                        const s = getStatusStyle(lead.status);
                                        return (
                                            <tr key={lead._id}>
                                                <td>{(currentPage - 1) * limit + idx + 1}</td>
                                                <td style={{ fontWeight: 'bold' }}>{lead.full_name}</td>
                                                <td style={{ fontSize: '12px' }}>{lead.email || '—'}</td>
                                                <td>{lead.phone_number}</td>
                                                <td>{lead.opted_domain || '—'}</td>
                                                <td style={{ fontSize: '12px' }}>{lead.education_background || '—'}</td>
                                                <td style={{ fontSize: '12px' }}>{lead.current_status || '—'}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                                                        fontWeight: 'bold', background: s.bg, color: s.color,
                                                        border: `1px solid ${s.border}`, textTransform: 'lowercase'
                                                    }}>
                                                        {lead.status.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '13px' }}>
                                                    {lead.owner_name || '—'}
                                                </td>
                                                <td>
                                                    <div style={{
                                                        padding: '4px 8px', borderRadius: '6px', fontSize: '12px',
                                                        fontWeight: 'bold', background: lead.score >= 25 ? '#f6ffed' : '#f5f5f5',
                                                        color: lead.score >= 25 ? '#52c41a' : '#595959',
                                                        border: `1px solid ${lead.score >= 25 ? '#b7eb8f' : '#d9d9d9'}`,
                                                        textAlign: 'center', width: '30px'
                                                    }}>
                                                        {lead.score || 0}
                                                    </div>
                                                </td>
                                                <td style={{ fontSize: '11px', color: '#666', minWidth: '180px', verticalAlign: 'top', padding: '10px 8px' }}>
                                                    {lead.extra_fields && Object.keys(lead.extra_fields).length > 0 ? (
                                                        <div style={{ wordBreak: 'break-word', lineHeight: '1.4', whiteSpace: 'normal' }}>
                                                            {Object.entries(lead.extra_fields).map(([k, v]) => (
                                                                <div key={k} style={{ marginBottom: '2px' }}>
                                                                    <strong style={{ color: '#888' }}>{k}:</strong> {v}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                                Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalCount)} of {totalCount} leads
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}
                                    style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => handlePageChange(i + 1)}
                                        style={{
                                            padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd',
                                            background: currentPage === i + 1 ? '#1890ff' : '#fff',
                                            color: currentPage === i + 1 ? '#fff' : '#333',
                                            cursor: 'pointer'
                                        }}>{i + 1}</button>
                                ))}
                                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}
                                    style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
                            </div>
                        </div>
                    </>
                )}

                {/* ─── Upload Modal Overlay ─── */}
                {showUploadModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                            width: '500px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0 }}>Bulk Lead Import</h2>
                                <button onClick={() => setShowUploadModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                            </div>

                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                                Upload a CSV or Excel file. Standard columns like <strong>Name, Email, Phone, Domain</strong> are automatically recognized. Any extra columns will be preserved as "Other Details".
                            </p>

                            <div style={{ padding: '20px', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
                                <input 
                                    type="file" 
                                    accept=".csv, .xlsx" 
                                    onChange={(e) => { setFile(e.target.files[0]); setImportStats(null); }}
                                    style={{ marginBottom: '10px' }}
                                />
                                {file && <p style={{ fontSize: '12px', color: '#1890ff' }}>Selected: {file.name}</p>}
                            </div>

                            {importStats && (
                                <div style={{ 
                                    padding: '15px', 
                                    background: importStats.errorCount > 0 ? '#fff1f0' : '#f6ffed', 
                                    border: `1px solid ${importStats.errorCount > 0 ? '#ffa39e' : '#b7eb8f'}`, 
                                    borderRadius: '6px', 
                                    marginBottom: '20px' 
                                }}>
                                    <p style={{ margin: 0, color: importStats.errorCount > 0 ? '#cf1322' : '#389e0d', fontWeight: 'bold' }}>
                                        Import Summary
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginTop: '10px' }}>
                                        <div style={{ textAlign: 'center', padding: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '10px', color: '#666' }}>Total</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{importStats.totalRows}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '10px', color: '#2ecc71' }}>New</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2ecc71' }}>{importStats.successCount}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '10px', color: '#fa8c16' }}>Skip (Dup)</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fa8c16' }}>{importStats.duplicateCount}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px' }}>
                                            <div style={{ fontSize: '10px', color: '#f5222d' }}>Error</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#f5222d' }}>{importStats.errorCount}</div>
                                        </div>
                                    </div>
                                    {importStats.errorCount > 0 && (
                                        <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#cf1322' }}>
                                            * Errors are usually due to missing Name or Phone columns.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || !file}
                                    style={{
                                        flex: 2, padding: '12px', background: '#2ecc71', color: '#fff',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                                        opacity: (uploading || !file) ? 0.7 : 1
                                    }}
                                >
                                    {uploading ? 'Processing...' : 'Start Upload'}
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    style={{
                                        flex: 1, padding: '12px', background: '#f5f5f5', color: '#333',
                                        border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* ─── Assignment Panel Overlay ─── */}
                {showAssignPanel && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '30px', borderRadius: '12px',
                            width: '450px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0 }}>Assign Leads to Specialist</h2>
                                <button onClick={() => setShowAssignPanel(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Specialist</label>
                                <select
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    onChange={(e) => setSelectedAssignee(specialists.find(s => s._id === e.target.value))}
                                    value={selectedAssignee?._id || ""}
                                >
                                    <option value="">-- Choose Specialist --</option>
                                    {specialists.map(s => (
                                        <option key={s._id} value={s._id}>{s.fullname} ({s.team || 'No Team'})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Number of Fresh Leads to Assign</label>
                                <input
                                    type="number"
                                    placeholder={`Max available: ${freshCount}`}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    value={assignCount}
                                    onChange={(e) => setAssignCount(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleBulkAssign}
                                    disabled={assigning}
                                    style={{
                                        flex: 1, padding: '12px', background: '#1890ff', color: '#fff',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                                        opacity: assigning ? 0.7 : 1
                                    }}
                                >
                                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                                <button
                                    onClick={() => setShowAssignPanel(false)}
                                    style={{
                                        flex: 1, padding: '12px', background: '#f5f5f5', color: '#333',
                                        border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default AdvLeadManagement;
