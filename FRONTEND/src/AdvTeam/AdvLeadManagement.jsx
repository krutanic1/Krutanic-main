import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvLeadManagement = () => {
    const [advDomains, setAdvDomains] = useState(["General"]);

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLeadForDetails, setSelectedLeadForDetails] = useState(null);
    const limit = 25;

    // Auth context
    const advTeamId = localStorage.getItem("advTeamId");
    const [userDesignation, setUserDesignation] = useState("");

    // Filters
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
    
    // Email Modal state
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedLeadForEmail, setSelectedLeadForEmail] = useState(null);
    const [emailRecipient, setEmailRecipient] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [emailDomain, setEmailDomain] = useState("");
    const [emailContent, setEmailContent] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [sendBrochure, setSendBrochure] = useState(false);

    // New Personalized Email & Template state
    const [showSMTPModal, setShowSMTPModal] = useState(false);
    const [personalEmail, setPersonalEmail] = useState("");
    const [appPassword, setAppPassword] = useState("");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);

    const fetchAdvTeamProfile = async () => {
        if (!advTeamId) return;
        try {
            const res = await axios.get(`${API}/getadvteam`, { params: { advTeamId } });
            setUserDesignation(res.data.designation);
            setUserName(res.data.fullname);
            
            // Automatically select the correct status filter based on role
            const roleStr = (res.data.designation || "").toLowerCase();
            if (roleStr.includes("leader")) {
                setStatusFilter("assigned_to_leader");
            } else if (roleStr.includes("manager")) {
                setStatusFilter("assigned_to_manager");
            } else if (roleStr.includes("specialist")) {
                setStatusFilter("assigned_to_specialist");
            }
            
            console.log("Adv Team Profile:", res.data);
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

    const fetchLeads = async (page = 1, forceStatus = statusFilter) => {
        if (!userDesignation) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
                params: {
                    role: userDesignation,
                    userId: advTeamId,
                    page,
                    limit,
                    status: forceStatus,
                    month: selectedMonth,
                    year: selectedYear
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
        const fetchTemplates = async () => {
            if (!advTeamId) return;
            try {
                const res = await axios.get(`${API}/api/adv-leads/get-templates/${advTeamId}`);
                setTemplates(res.data);
            } catch (err) {
                console.error("Failed to fetch templates");
            }
        };
        const fetchSMTPConfig = async () => {
            if (!advTeamId) return;
            try {
                const res = await axios.get(`${API}/api/adv-leads/get-smtp-config/${advTeamId}`);
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
        if (advTeamId) {
            fetchAdvTeamProfile();
            fetchSpecialists();
            fetchFreshCount();
            fetchTemplates();
            fetchSMTPConfig();
            fetchDomains();
        }
    }, [advTeamId]);

    useEffect(() => {
        if (userDesignation) {
            fetchLeads(currentPage, statusFilter);
        }
    }, [currentPage, userDesignation, statusFilter, selectedMonth, selectedYear]);

    const handleSaveSMTP = async () => {
        if (!personalEmail || !appPassword) return toast.error("Both fields are required");
        try {
            await axios.post(`${API}/api/adv-leads/save-smtp-config`, {
                userId: advTeamId,
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
                userId: advTeamId
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

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const years = [new Date().getFullYear(), new Date().getFullYear() - 1];

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

    const getStatusStyle = (status) => {
        const map = {
            "Fresh Lead": { bg: '#f5f5f5', border: '#d9d9d9', color: '#666' },
            "Attempting Contact": { bg: '#fff7e6', border: '#ffd591', color: '#fa8c16' },
            "First Call Connected": { bg: '#e6f7ff', border: '#91d5ff', color: '#1890ff' },
            "Demo Conducted": { bg: '#f9f0ff', border: '#d3adf7', color: '#722ed1' },
            "Closed Won": { bg: '#f6ffed', border: '#b7eb8f', color: '#52c41a' },
            "Closed Lost": { bg: '#fff1f0', border: '#ffa39e', color: '#f5222d' }
        };
        return map[status] || { bg: '#f5f5f5', border: '#d9d9d9', color: '#595959' };
    };

    const filteredLeads = leads.filter(l => {
        const matchSearch = (l.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.phone_number || "").includes(searchTerm);
        return matchSearch;
    });

    const formatDate = (date) => {
        if (!date) return "Unknown Date";
        return new Date(date).toLocaleDateString("en-GB");
    };

    // Grouping logic for the leads
    const groupedLeads = filteredLeads.reduce((acc, lead) => {
        const date = formatDate(lead.created_at);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(lead);
        return acc;
    }, {});

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
                                {[
                                    { label: 'Current Situation', value: selectedLeadForDetails.extra_fields?.['what_best_describes_your_current_situation?'] },
                                    { label: 'Primary Goal', value: selectedLeadForDetails.extra_fields?.['what_is_your_primary_goal_right_now?'] },
                                    { label: 'Career Challenge', value: selectedLeadForDetails.extra_fields?.['what_is_your_biggest_career_challenge?'] },
                                    { label: 'Investment Readiness', value: selectedLeadForDetails.upskilling_ready || selectedLeadForDetails.extra_fields?.['are_you_willing_to_invest_in_a_program_that_provides_training_+internship+100%_placement_support?'] || selectedLeadForDetails.extra_fields?.['are_you_willing_to_invest_in_a_program_that_provides_training_+_internship_+100%_placement_support?'] },
                                ].map((item, i) => (
                                    item.value && (
                                        <div key={i} style={{ padding: '10px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                                            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0050b3', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                                            <div style={{ fontSize: '13px', color: '#000', fontWeight: '600' }}>{item.value || '—'}</div>
                                        </div>
                                    )
                                ))}

                                {Object.entries(selectedLeadForDetails.extra_fields || {})
                                    .filter(([key]) => ![
                                        'what_is_your_biggest_career_challenge?',
                                        'are_you_willing_to_invest_in_a_program_that_provides_training_+internship+100%_placement_support?',
                                        'are_you_willing_to_invest_in_a_program_that_provides_training_+_internship_+100%_placement_support?'
                                    ].includes(key))
                                    .map(([key, val]) => (
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
                        onChange={e => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '150px' }}
                    >
                        <option value="">All Stages</option>
                        <option value="Fresh Lead">Fresh Lead</option>
                        <option value="Attempting Contact">Attempting Contact</option>
                        <option value="First Call Connected">First Call Connected</option>
                        <option value="Demo Conducted">Demo Conducted</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                    </select>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>📅 Created in:</span>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}
                        >
                            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
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
                                        <th>Pipeline Stage</th>
                                        <th>Disposition</th>
                                        <th>ASSISTED TO</th>
                                        <th>Score</th>
                                        <th>Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(groupedLeads).map((date) => (
                                        <React.Fragment key={date}>
                                            <tr style={{ background: '#f8f9fa' }}>
                                                <td colSpan="11" style={{ fontWeight: '800', textAlign: 'center', padding: '10px', fontSize: '14px', letterSpacing: '1px', borderBottom: '2px solid #ddd' }}>
                                                    📅 {date}
                                                </td>
                                            </tr>
                                            {groupedLeads[date].map((lead, idx) => {
                                                const s = getStatusStyle(lead.stage || "Fresh Lead");
                                                return (
                                                    <tr key={lead._id} style={{ background: lead.source === "Website Lead" ? "#fff7e6" : "transparent" }}>
                                                        <td>{(currentPage - 1) * limit + idx + 1}</td>
                                                        <td style={{ fontWeight: 'bold' }}>{lead.full_name}</td>
                                                        <td style={{ fontSize: '12px' }}>{lead.email || '—'}</td>
                                                        <td>{lead.phone_number}</td>
                                                        <td>{lead.opted_domain || '—'}</td>
                                                        <td>
                                                            <span style={{
                                                                padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                                                                fontWeight: 'bold', background: s.bg, color: s.color,
                                                                border: `1px solid ${s.border}`
                                                            }}>
                                                                {lead.stage || "Fresh Lead"}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: '12px', fontWeight: '600', color: '#666' }}>
                                                            {lead.disposition || "New Lead"}
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
                                                        <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                                                                <i className="fa fa-eye"></i> View
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedLeadForEmail(lead);
                                                                    setEmailRecipient(lead.email || "");
                                                                    setEmailSubject(`Registration Confirmation - ${lead.opted_domain || "General"} | Krutanic`);
                                                                    setEmailDomain(lead.opted_domain || "General");
                                                                    setShowEmailModal(true);
                                                                }}
                                                                style={{ 
                                                                    padding: '6px 12px', background: '#fff', border: '1px solid #2ecc71', 
                                                                    color: '#2ecc71', borderRadius: '6px', fontSize: '12px', fontWeight: '700', 
                                                                    cursor: 'pointer'
                                                                 }}
                                                             >
                                                                 <i className="fa fa-envelope"></i> Mail
                                                             </button>
                                                             <button 
                                                                 onClick={() => {
                                                                     toast.success("Payment Link Sent!"); 
                                                                 }}
                                                                 style={{ 
                                                                     padding: '6px 12px', background: '#fff', border: '1px solid #f39c12', 
                                                                     color: '#f39c12', borderRadius: '6px', fontSize: '12px', fontWeight: '700', 
                                                                     cursor: 'pointer'
                                                                 }}
                                                             >
                                                                 <i className="fa fa-link"></i> Pay
                                                             </button>
                                                         </td>
                                                        {["callback_requested", "no_answer", "not_interested", "junk"].includes(lead.last_outcome) && (
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
                                                         )}
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
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


                {/* ─── AI Email Modal ─── */}
                {showEmailModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '32px', borderRadius: '20px',
                            width: '700px', maxHeight: '90vh', overflowY: 'auto',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.2)', position: 'relative',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                                <h2 style={{ margin: 0, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '24px' }}>✉️</span> Send Personalized Mail
                                </h2>
                                <button onClick={() => setShowEmailModal(false)} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
                            </div>

                            <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    📋 Select template
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
                                        <option value="">-- Choose a Template --</option>
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
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Recipient Name</label>
                                    <input 
                                        type="text" 
                                        value={selectedLeadForEmail?.full_name || ""} 
                                        readOnly
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Recipient Email</label>
                                    <input 
                                        type="text" 
                                        value={emailRecipient} 
                                        onChange={(e) => setEmailRecipient(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Email Subject</label>
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
                                    placeholder="Enter subject..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Selected Domain</label>
                                <select 
                                    value={emailDomain} 
                                    onChange={(e) => {
                                        const newDomain = e.target.value;
                                        setEmailDomain(newDomain);
                                        if (newDomain && newDomain !== "General") {
                                            setSendBrochure(true);
                                        }
                                    }}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}
                                >
                                    {advDomains.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>


                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' }}>Email Content (HTML Preview)</label>
                                <textarea 
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    style={{ width: '100%', height: '200px', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '5px', fontFamily: 'monospace', fontSize: '13px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#fff7e6', padding: '15px', borderRadius: '12px', border: '1px solid #ffd591' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={sendBrochure} 
                                        onChange={(e) => setSendBrochure(e.target.checked)}
                                        style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                                        id="brochureCheck"
                                    />
                                    <label htmlFor="brochureCheck" style={{ fontWeight: 'bold', cursor: 'pointer', color: '#d46b08' }}>
                                        Include {emailDomain && emailDomain !== "General" ? emailDomain : "Advanced Program"} Brochure PDF
                                    </label>
                                </div>
                                <div style={{ fontSize: '11px', color: '#888' }}>* Brochure only attaches if domain contains "Data Science"</div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button 
                                    onClick={async () => {
                                        if(!emailRecipient) { toast.error("Recipient required"); return; }
                                        if(!emailSubject) { toast.error("Subject required"); return; }
                                        if(!emailContent) { toast.error("Content required"); return; }
                                        setIsSendingEmail(true);
                                        try {
                                            await axios.post(`${API}/api/adv-leads/send-lead-mail`, {
                                                leadId: selectedLeadForEmail?._id,
                                                recipientEmail: emailRecipient,
                                                subject: emailSubject,
                                                content: emailContent,
                                                domain: emailDomain,
                                                sendBrochure,
                                                userId: advTeamId,
                                                senderName: userName
                                            });
                                            toast.success("Email sent successfully!");

                                            // Prompt to save as template if unique
                                            const isExistingTemplate = templates.some(t => t.subject === emailSubject && t.body === emailContent);
                                            if (!isExistingTemplate) {
                                                setShowSaveTemplateModal(true);
                                            }

                                            setShowEmailModal(false);
                                        } catch (err) {
                                            toast.error(err.response?.data?.message || "Failed to send mail");
                                        } finally {
                                            setIsSendingEmail(false);
                                        }
                                    }}
                                    disabled={isSendingEmail}
                                    style={{ 
                                        flex: 2, padding: '14px', background: '#2ecc71', color: '#fff', 
                                        border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
                                        fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                    }}
                                >
                                    {isSendingEmail ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-paper-plane"></i>}
                                    {isSendingEmail ? "Sending..." : "Send Personalized Email"}
                                </button>
                                <button 
                                    onClick={() => setShowEmailModal(false)}
                                    style={{ flex: 1, padding: '14px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Save Template Modal ─── */}
                {showSaveTemplateModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 2100,
                        backdropFilter: 'blur(3px)'
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '24px', borderRadius: '15px',
                            width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}>
                            <h3 style={{ marginTop: 0 }}>💾 Save as Template?</h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>Save this message as a template for future use?</p>
                            <input 
                                type="text"
                                placeholder="Template Title (e.g. Follow-up)"
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={handleSaveTemplate}
                                    disabled={isSavingTemplate}
                                    style={{ flex: 1, padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    {isSavingTemplate ? "Saving..." : "Save Template"}
                                </button>
                                <button 
                                    onClick={() => setShowSaveTemplateModal(false)}
                                    style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Not now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── SMTP Configuration Modal ─── */}
                {showSMTPModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 2050,
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '32px', borderRadius: '24px',
                            width: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0 }}>📧 My Email Account Settings</h3>
                                <button onClick={() => setShowSMTPModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Working Email</label>
                                <input 
                                    type="email"
                                    value={personalEmail}
                                    onChange={(e) => setPersonalEmail(e.target.value)}
                                    placeholder="your-email@krutanic.com"
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Mail App Password</label>
                                <input 
                                    type="password"
                                    value={appPassword}
                                    onChange={(e) => setAppPassword(e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                                />
                            </div>
                            <button 
                                onClick={handleSaveSMTP}
                                style={{ width: '100%', padding: '16px', background: '#722ed1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}
                            >
                                Verify & Save Credentials
                            </button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default AdvLeadManagement;
