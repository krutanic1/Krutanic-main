import React, { useState, useEffect, useCallback } from "react";
import axios from "../axiosConfig";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { 
  Users, 
  Search, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Clock,
  UserCheck,
  Mail,
  Shield,
  ArrowRight,
  Filter,
  Download,
  Send,
  Loader,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  EyeOff,
  Eye
} from "lucide-react";

/**
 * Admin Attendance Dashboard
 * Server-side paging (50 members/page), search, and monthly filtering.
 * Detailed user history (10/page) in modal.
 */

const AdminAttendance = () => {
  const [members, setMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sendingReport, setSendingReport] = useState(null); // stores userId being sent
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [isSendingAbsent, setIsSendingAbsent] = useState(false);
  const [updatingRecord, setUpdatingRecord] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ email: "", name: "", role: "Employee", pin: "" });
  const [addingMember, setAddingMember] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  
  // Summary State
  const [dailySummary, setDailySummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  
  // User Account Edit State
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // stores the user object being edited
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // Override System State
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [loadingOverride, setLoadingOverride] = useState(false);

  // Show Inactive toggle
  const [showInactive, setShowInactive] = useState(false);

  // Department card popup
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/api/atd/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page: currentPage, 
          limit: 50, 
          search, 
          month: filterMonth, 
          year: filterYear,
          showInactive: showInactive ? "true" : "false"
        }
      });
      setMembers(res.data.data);
      setTotalMembers(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterMonth, filterYear, showInactive]);

  const fetchDailySummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const token = localStorage.getItem("adminToken");
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const today = istTime.toISOString().split("T")[0];
      
      const res = await axios.get(`${API}/api/atd/admin/daily-summary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: today }
      });
      setDailySummary(res.data.summary);
    } catch (err) {
      console.error("Failed to load summary");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchOverrideStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/api/atd/admin/attendance-override`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOverrideActive(res.data.value);
    } catch (err) {
      console.error("Failed to fetch override status");
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchDailySummary();
    fetchOverrideStatus();
  }, [fetchMembers, fetchDailySummary, fetchOverrideStatus]);

  const fetchUserDetail = async (userId, page = 1) => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/api/atd/admin/user/${userId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page, 
          limit: 10, 
          month: filterMonth, 
          year: filterYear 
        }
      });
      setUserHistory(res.data.data);
      setHistoryTotalPages(res.data.totalPages);
      setHistoryPage(page);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/api/atd/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          all: true,
          search, 
          month: filterMonth, 
          year: filterYear 
        }
      });
      
      const daysInMonth = new Date(filterYear, parseInt(filterMonth) + 1, 0).getDate();
      const dayColumns = [];
      for (let i = 1; i <= daysInMonth; i++) {
        dayColumns.push(i.toString().padStart(2, '0'));
      }

      const dataToExport = res.data.data.map(m => {
        const row = {
          "Name": m.name,
          "Email": m.email,
          "Role": m.role || "Member",
        };

        // Dynamically add columns for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
          const dayKey = i.toString().padStart(2, '0');
          const dayStr = `${filterYear}-${(parseInt(filterMonth) + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
          const record = m.detailedRecords?.find(r => r.date === dayStr);
          if (record) {
            if (record.status === "Present") row[dayKey] = "P";
            else if (record.status === "Late") row[dayKey] = "L";
            else if (record.status === "Half Day") row[dayKey] = "HD";
          } else {
            row[dayKey] = "-"; // Absent
          }
        }

        row["Total Present"] = m.daysPresent;
        row["Full Present"] = m.onTimeCount;
        row["Late"] = m.lateCount;
        row["Half Day"] = m.halfDayCount;
        row["Month"] = monthNames[filterMonth];
        row["Year"] = filterYear;

        return row;
      });

      const headerOrder = ["Name", "Email", "Role", ...dayColumns, "Total Present", "Full Present", "Late", "Half Day", "Month", "Year"];
      const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headerOrder });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, `Attendance_${monthNames[filterMonth]}_${filterYear}.xlsx`);
      toast.success("Report downloaded successfully");
    } catch (err) {
      toast.error("Failed to export report");
    } finally {
      setExportLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserDetail(user._id, 1);
  };

  const sendReport = async (user, e) => {
    if (e) e.stopPropagation();
    setSendingReport(user._id);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API}/api/atd/admin/send-report/${user._id}`, {
        month: filterMonth,
        year: filterYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Report sent to ${user.email}`);
    } catch (err) {
      toast.error("Failed to send report");
    } finally {
      setSendingReport(null);
    }
  };

  const sendAllReports = async () => {
    if (!window.confirm(`Are you sure you want to send reports to ALL employees for ${monthNames[filterMonth]} ${filterYear}?`)) return;
    
    setIsBulkSending(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API}/api/atd/admin/send-all-reports`, {
        month: filterMonth,
        year: filterYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Bulk report dispatch started successfully");
    } catch (err) {
      toast.error("Failed to start bulk dispatch");
    } finally {
      setIsBulkSending(false);
    }
  };

  const sendReminders = async () => {
    if (!window.confirm("Send attendance reminders to all employees who haven't marked attendance today?")) return;
    setIsReminding(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/api/atd/admin/send-reminders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to send reminders");
    } finally {
      setIsReminding(false);
    }
  };

  const sendAbsentMails = async () => {
    if (!window.confirm("Send absent notification emails to all employees who haven't marked attendance today?")) return;
    setIsSendingAbsent(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/api/atd/admin/send-absent-mails`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to send absent emails");
    } finally {
      setIsSendingAbsent(false);
    }
  };

  const toggleHalfDay = async (recordId, currentVal) => {
    setUpdatingRecord(recordId);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API}/api/atd/admin/attendance/${recordId}`, {
        isHalfDayOverride: !currentVal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Status updated");
      // Update local history
      setUserHistory(prev => prev.map(r => r._id === recordId ? { ...r, isHalfDayOverride: !currentVal, isHalfDay: !currentVal ? true : r.isHalfDay } : r));
      // Refresh count in main list
      fetchMembers();
      fetchDailySummary();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingRecord(null);
    }
  };

  const handleEditTime = async (recordId, newTime) => {
    setUpdatingRecord(recordId);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API}/api/atd/admin/attendance/${recordId}`, {
        newTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Time updated successfully");
      setEditingRecord(null);
      if (selectedUser) fetchUserDetail(selectedUser._id, historyPage);
      fetchMembers();
    } catch (err) {
      toast.error("Failed to update time");
    } finally {
      setUpdatingRecord(null);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Delete this record permanently?")) return;
    setDeletingRecord(recordId);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/api/atd/admin/attendance/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Record deleted");
      if (selectedUser) fetchUserDetail(selectedUser._id, historyPage);
      fetchMembers();
      fetchDailySummary();
    } catch (err) {
      toast.error("Failed to delete record");
    } finally {
      setDeletingRecord(null);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.email || !newMember.name || !newMember.pin) {
      toast.error("Please fill all fields");
      return;
    }
    if (newMember.pin.length < 4 || newMember.pin.length > 6) {
      toast.error("PIN must be 4-6 digits");
      return;
    }

    setAddingMember(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API}/api/atd/admin/add-user`, newMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Member added successfully!");
      setShowAddModal(false);
      setNewMember({ email: "", name: "", role: "Employee", pin: "" });
      fetchMembers();
      fetchDailySummary();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser.email || !editingUser.name || !editingUser.pin) {
      toast.error("Please fill all fields");
      return;
    }
    setIsUpdatingUser(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API}/api/atd/admin/user/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User credentials updated");
      setShowEditUserModal(false);
      fetchMembers();
      fetchDailySummary();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (user, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`PERMANENTLY DELETE ${user.name}? This will wipe their account and ALL attendance history. This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/api/atd/admin/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User deleted permanently");
      fetchMembers();
      fetchDailySummary();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleToggleOverride = async () => {
    const newVal = !isOverrideActive;
    if (!window.confirm(`Are you sure you want to turn ${newVal ? 'ON' : 'OFF'} the Emergency Attendance Override?\n\nIf ON, ALL new attendance marked from now on will be recorded at 11:00 AM IST (Full/On-Time).`)) return;
    
    setLoadingOverride(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API}/api/atd/admin/attendance-override`, { value: newVal }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOverrideActive(newVal);
      toast.success(`Emergency Override is now ${newVal ? 'ACTIVE' : 'INACTIVE'}`);
    } catch (err) {
      toast.error("Failed to update override status");
    } finally {
      setLoadingOverride(false);
    }
  };

  const handleGenerateResetCode = async (userId) => {
    setGeneratingCode(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/api/atd/admin/generate-reset-code`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.alert(`NEW DEVICE RESET CODE:\n\n${res.data.resetCode}\n\nThis code expires in 10 minutes. Please share this securely with the employee.`);
    } catch (err) {
      toast.error("Failed to generate reset code");
    } finally {
      setGeneratingCode(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="admin-attendance-container" style={styles.container}>
      {/* Add Member Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
           <div style={{ ...styles.modalContent, maxWidth: "450px" }}>
              <div style={styles.modalHeader}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ ...styles.iconBox, backgroundColor: "#fff7ed" }}><Users color="#FF6B00" /></div>
                    <div>
                       <h2 style={styles.modalTitle}>Add New Member</h2>
                       <p style={{ fontSize: "12px", color: "#64748b" }}>Register a new employee for attendance tracking</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddMember} style={{ padding: "30px" }}>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input 
                       type="text" 
                       placeholder="e.g. John Doe"
                       style={styles.input}
                       value={newMember.name}
                       onChange={e => setNewMember({...newMember, name: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input 
                       type="email" 
                       placeholder="john@krutanic.com"
                       style={styles.input}
                       value={newMember.email}
                       onChange={e => setNewMember({...newMember, email: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Designation/Role</label>
                    <input 
                       type="text" 
                       placeholder="e.g. Software Engineer"
                       style={styles.input}
                       value={newMember.role}
                       onChange={e => setNewMember({...newMember, role: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Predefined PIN (4-6 digits)</label>
                    <input 
                       type="text" 
                       placeholder="123456"
                       style={styles.input}
                       value={newMember.pin}
                       onChange={e => setNewMember({...newMember, pin: e.target.value})}
                       required
                    />
                 </div>

                 <button type="submit" disabled={addingMember} style={styles.primaryBtn}>
                    {addingMember ? "Registering..." : "Add Member"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditUserModal && editingUser && (
        <div style={styles.modalOverlay}>
           <div style={{ ...styles.modalContent, maxWidth: "450px" }}>
              <div style={styles.modalHeader}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ ...styles.iconBox, backgroundColor: "#f1f5f9" }}><Edit3 color="#64748b" /></div>
                    <div>
                       <h2 style={styles.modalTitle}>Edit Credentials</h2>
                       <p style={{ fontSize: "12px", color: "#64748b" }}>Update employee profile and PIN</p>
                    </div>
                 </div>
                 <button onClick={() => setShowEditUserModal(false)} style={styles.closeBtn}><X size={20} /></button>
              </div>

              <form onSubmit={handleUpdateUser} style={{ padding: "30px" }}>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input 
                       type="text" 
                       style={styles.input}
                       value={editingUser.name}
                       onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input 
                       type="email" 
                       style={styles.input}
                       value={editingUser.email}
                       onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Designation/Role</label>
                    <input 
                       type="text" 
                       style={styles.input}
                       value={editingUser.role}
                       onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                       required
                    />
                 </div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Employee PIN</label>
                    <input 
                       type="text" 
                       style={styles.input}
                       value={editingUser.pin || ""}
                       onChange={e => setEditingUser({...editingUser, pin: e.target.value})}
                       required
                    />
                 </div>
                 
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Account Status</label>
                    <select 
                       style={styles.input}
                       value={editingUser.status || "active"}
                       onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                    >
                       <option value="active">Active (Access Allowed)</option>
                       <option value="inactive">Inactive (Access Blocked)</option>
                    </select>
                 </div>

                 <button type="submit" disabled={isUpdatingUser} style={styles.primaryBtn}>
                    {isUpdatingUser ? "Updating..." : "Update Credentials"}
                 </button>
              </form>
           </div>
        </div>
      )}

      <Toaster position="top-center" />
      <style>{`
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
        .admin-table th { padding: 16px; text-align: left; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .admin-table td { padding: 16px; background: #fff; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
        .admin-table tr td:first-child { border-left: 1px solid #f1f5f9; border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
        .admin-table tr td:last-child { border-right: 1px solid #f1f5f9; border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
        .admin-table tr:hover td { background: #f8fafc; cursor: pointer; }
        
        .search-box:focus-within { border-color: #FF6B00 !important; box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1); }
        .pagination-btn { padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; font-weight: 600; color: #64748b; }
        .pagination-btn:hover:not(:disabled) { border-color: #FF6B00; color: #FF6B00; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
        .modal-card { width: 90%; maxWidth: 700px; background: #fff; borderRadius: 24px; padding: 32px; boxShadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        @media screen and (max-width: 1024px) {
           .admin-attendance-container { margin-left: 0 !important; padding: 20px !important; }
           .admin-controls { flex-direction: column !important; align-items: stretch !important; }
           .stats-row { flex-direction: column !important; gap: 10px !important; }
        }
      `}</style>

      {/* Header Area */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Attendance Management</h1>
          <p style={styles.subtitle}>Track and manage employee presence across all departments</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}><Users size={18} /><span>Add Member</span></button>
          <button style={{ ...styles.exportBtn, background: '#f59e0b', color: 'white', border: 'none' }} onClick={sendReminders} disabled={isReminding}>{isReminding ? <><Loader size={18} className="animate-spin" /> Reminding...</> : <><Clock size={18} /> Send Reminders</>}</button>
          <button style={{ ...styles.exportBtn, background: '#ef4444', color: 'white', border: 'none' }} onClick={sendAbsentMails} disabled={isSendingAbsent}>{isSendingAbsent ? <><Loader size={18} className="animate-spin" /> Sending...</> : <><X size={18} /> Send Absent Mails</>}</button>
          <button style={{ ...styles.exportBtn, background: '#0f172a', color: 'white', border: 'none' }} onClick={sendAllReports} disabled={isBulkSending}>{isBulkSending ? <><Loader size={18} className="animate-spin" /> Dispatching...</> : <><Send size={18} /> Send All Reports</>}</button>
          <button 
             style={{ 
               ...styles.exportBtn, 
               background: isOverrideActive ? '#f97316' : '#fff', 
               color: isOverrideActive ? 'white' : '#64748b', 
               border: isOverrideActive ? 'none' : '1px solid #e2e8f0',
               boxShadow: isOverrideActive ? '0 0 15px rgba(249, 115, 22, 0.3)' : 'none'
             }} 
             onClick={handleToggleOverride} 
             disabled={loadingOverride}
          >
            {loadingOverride ? <Loader size={18} className="animate-spin" /> : <AlertCircle size={18} />}
            <span>Override: {isOverrideActive ? 'ON' : 'OFF'}</span>
          </button>
          <button style={styles.exportBtn} onClick={exportToExcel} disabled={exportLoading}>{exportLoading ? <>Exporting...</> : <><Download size={18} /> Export Report</>}</button>
        </div>
      </div>

      {/* Daily Department Summary */}
      <div style={styles.summaryGrid}>
        {loadingSummary ? (
          <div className="p-4 text-gray-400">Loading summary...</div>
        ) : (
          <>
            {/* ALL PRESENT CARD */}
            {dailySummary && dailySummary.length > 0 && (
              <div 
                style={{ ...styles.summaryCard, cursor: 'pointer', transition: 'all 0.2s ease', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderColor: '#059669', color: '#fff' }}
                onClick={() => {
                   const allPresentCount = dailySummary.reduce((acc, curr) => acc + curr.count, 0);
                   const allPresentEmployees = dailySummary.flatMap(s => s.employees || []);
                   setSelectedCard({ department: "ALL PRESENT", count: allPresentCount, employees: allPresentEmployees });
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ ...styles.avatar, width: '32px', height: '32px', fontSize: '12px', background: 'rgba(255,255,255,0.2)', color: '#fff' }}><Users size={16} /></div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px' }}>ALL PRESENT</div>
                   <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff' }}>{dailySummary.reduce((acc, curr) => acc + curr.count, 0)} <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>Present</span></div>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Click to view â€º</div>
              </div>
            )}
            
            {/* DEPARTMENT CARDS */}
            {(dailySummary && dailySummary.length > 0) ? dailySummary.map((s, i) => (
          <div 
            key={i} 
            style={{ ...styles.summaryCard, cursor: 'pointer', transition: 'all 0.2s ease' }}
            onClick={() => setSelectedCard(s)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; e.currentTarget.style.borderColor = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ ...styles.avatar, width: '32px', height: '32px', fontSize: '12px', background: '#f1f5f9', color: '#64748b' }}><UserCheck size={16} /></div>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>{s.department || "Other"}</div>
               <div style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b' }}>{s.count} <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Present</span></div>
            </div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '600' }}>Click to view â€º</div>
          </div>
        )) : <div style={{ padding: '20px', color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>No records found for today</div>}
        </>
        )}
      </div>

      {/* Department Names Popup */}
      {selectedCard && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, animation: 'fadeIn 0.2s ease' }}
          onClick={() => setSelectedCard(null)}
        >
          <div 
            style={{ background: '#fff', borderRadius: '24px', padding: '0', width: '360px', maxWidth: '90vw', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', animation: 'slideIn 0.25s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #ff8c42 100%)', padding: '24px 28px 20px', position: 'relative' }}>
              <button 
                onClick={() => setSelectedCard(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={16} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Department</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{selectedCard.department || 'Other'}</div>
                </div>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                  {selectedCard.count} Present Today
                </div>
              </div>
            </div>

            {/* Names List */}
            <div style={{ padding: '20px 28px 24px', maxHeight: '340px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Employees Present</div>
              {selectedCard.employees && selectedCard.employees.length > 0 ? (
                selectedCard.employees.map((emp, idx) => {
                  const name = emp.name || "Unknown";
                  const role = emp.role || "Employee";
                  let timeStr = "--:--";
                  if (emp.timestamp) {
                    const d = new Date(emp.timestamp);
                    const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
                    timeStr = istTime.getUTCHours().toString().padStart(2, '0') + ':' + istTime.getUTCMinutes().toString().padStart(2, '0');
                  }
                  
                  return (
                    <div 
                      key={idx} 
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: idx < selectedCard.employees.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF6B00, #ff8c42)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                         <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{name}</div>
                         <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{role}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                         <div style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>✓ Present</div>
                         <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={10} /> {timeStr}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No employees available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls Area */}
      <div className="admin-controls" style={styles.controls}>
        <div className="search-box" style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            style={styles.searchInput}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Filter By:</span>
          <div style={styles.selectWrapper}>
            <Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <select 
              style={styles.select} 
              value={filterMonth} 
              onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
            >
              {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div style={styles.selectWrapper}>
            <Filter size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <select 
              style={styles.select} 
              value={filterYear} 
              onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Show Inactive Toggle Button */}
          <button
            onClick={() => { setShowInactive(prev => !prev); setCurrentPage(1); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '12px 18px',
              borderRadius: '12px',
              border: showInactive ? '1px solid #a855f7' : '1px solid #e2e8f0',
              background: showInactive ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : '#fff',
              color: showInactive ? '#fff' : '#64748b',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: showInactive ? '0 4px 14px rgba(168, 85, 247, 0.35)' : '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            title={showInactive ? 'Click to hide inactive users' : 'Click to show inactive users'}
          >
            {showInactive ? <Eye size={15} /> : <EyeOff size={15} />}
            {showInactive ? 'Hide Inactive' : 'Show Inactive'}
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.loadingState}>Loading members...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department / Role</th>
                  <th>Total</th>
                  <th>Full Present</th>
                  <th>Late</th>
                  <th><span style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fee2e2' }}>Half Day</span></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((user) => (
                  <tr key={user._id} onClick={() => handleUserClick(user)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.avatar}>{user.name.charAt(0)}</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={styles.userName}>{user.name}</div>
                            {user.status === 'inactive' && (
                              <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>INACTIVE</span>
                            )}
                          </div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={styles.roleTag}>
                        {user.role || "Member"}
                      </span>
                    </td>
                    <td>
                       <div style={{ ...styles.countBadge, background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                          {user.daysPresent} Total
                       </div>
                    </td>
                    <td>
                       <div style={{ ...styles.countBadge, background: '#f8fafc', color: '#10b981', border: '1px solid #d1fae5', width: 'fit-content' }}>
                          {user.onTimeCount} Full
                       </div>
                    </td>
                    <td>
                       <div style={{ ...styles.countBadge, background: user.lateCount > 0 ? '#fff7ed' : '#f8fafc', color: user.lateCount > 0 ? '#f59e0b' : '#94a3b8', border: user.lateCount > 0 ? '#ffedd5' : '#e2e8f0', width: 'fit-content' }}>
                          {user.lateCount} Late
                       </div>
                    </td>
                    <td>
                       <div style={{ ...styles.countBadge, background: user.halfDayCount > 0 ? '#fff1f2' : '#f8fafc', color: user.halfDayCount > 0 ? '#f43f5e' : '#94a3b8', border: user.halfDayCount > 0 ? '#ffe4e6' : '#e2e8f0', width: 'fit-content' }}>
                          {user.halfDayCount} Half
                       </div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button 
                           style={{ ...styles.viewBtn, color: '#FF6B00', background: '#fff7ed' }}
                           onClick={(e) => { e.stopPropagation(); sendReport(user, e); }}
                           disabled={sendingReport === user._id}
                           title="Send Report to Email"
                         >
                           {sendingReport === user._id ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                         </button>
                         <button 
                           style={{ ...styles.viewBtn, color: '#64748b' }}
                           onClick={(e) => { e.stopPropagation(); setEditingUser(user); setShowEditUserModal(true); }}
                           title="Edit Credentials & Status"
                         >
                           <Edit3 size={16} />
                         </button>
                         <button style={styles.viewBtn}>
                           <ArrowRight size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.paginationRow}>
                <span style={styles.pageInfo}>Page {currentPage} of {totalPages} ({totalMembers} members)</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setShowAddModal(true)} style={styles.addBtn}>
                   <Users size={18} />
                   <span>Add Member</span>
                </button>
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}><X size={20} /></button>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{ ...styles.avatar, width: '48px', height: '48px', fontSize: '20px' }}>{selectedUser.name.charAt(0)}</div>
                <div>
                   <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{selectedUser.name}</h2>
                   <div style={{ color: '#64748b', fontSize: '14px' }}>{selectedUser.email}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button 
                    style={{ ...styles.actionBtn, width: 'auto', padding: '0 12px', gap: '5px', background: '#fff7ed', color: '#FF6B00', borderColor: '#ffedd5', fontWeight: '700' }}
                    onClick={() => handleGenerateResetCode(selectedUser._id)}
                    disabled={generatingCode}
                  >
                    <Shield size={14} />
                    {generatingCode ? "Generating..." : "Generate Reset Code"}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                 <div style={styles.modalStat}>
                    <Calendar size={14} /> <span>{monthNames[filterMonth]} {filterYear}</span>
                 </div>
                 <div style={styles.modalStat}>
                    <UserCheck size={14} /> <span>Full Present: {selectedUser.onTimeCount}</span>
                 </div>
                 <div style={{ ...styles.modalStat, color: '#f59e0b', background: '#fff7ed' }}>
                    <Clock size={14} /> <span>Late: {selectedUser.lateCount}</span>
                 </div>
                 <div style={{ ...styles.modalStat, color: '#f43f5e', background: '#fff1f2' }}>
                    <Clock size={14} /> <span>Half: {selectedUser.halfDayCount}</span>
                 </div>
              </div>
            </div>

            <div style={styles.historySection}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ ...styles.sectionLabel, margin: 0 }}>Login History</h3>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>MANUAL PENALTY APPLICABLE</div>
               </div>
               {loadingHistory ? (
                 <div style={{ padding: '40px', textAlign: 'center' }}>Loading logs...</div>
               ) : (
                 <div style={styles.historyScroll}>
                     {(!userHistory || userHistory.length === 0) ? (
                       <div style={{ padding: '40px', textAlign: 'center' }}>No logs for this period.</div>
                     ) : (
                       userHistory.map((h, i) => (
                         <div key={i} style={styles.historyRow}>
                           <div style={{ flex: 1 }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                               <div style={styles.smDateBadge}>
                                 <div style={{ fontWeight: '800' }}>{new Date(h.date).getDate()}</div>
                                 <div style={{ fontSize: '9px', textTransform: 'uppercase' }}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                               </div>
                               <div>
                                 <div style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                 <div style={{ fontSize: '10px', fontWeight: '800' }}>
                                   {h.isHalfDay ? <span style={{ color: '#f43f5e' }}>HALF DAY</span> :
                                    h.isLate ? <span style={{ color: '#f59e0b' }}>LATE LOGIN</span> :
                                    <span style={{ color: '#10b981' }}>ON TIME</span>}
                                 </div>
                               </div>
                             </div>
                             {h.ip && (
                               <div style={{ display: 'flex', gap: '8px', marginLeft: '45px' }}>
                                 <div style={{ fontSize: '10px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                   IP: {h.ip === "::1" || h.ip === "127.0.0.1" ? "Localhost" : h.ip}
                                 </div>
                               </div>
                             )}
                           </div>
                           
                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <div style={
                                h.isHalfDay ? { ...styles.smTimeBadge, background: '#fff1f2', color: '#be123c' } :
                                h.isLate ? { ...styles.smTimeBadge, background: '#fff7ed', color: '#c2410c' } : 
                                styles.smTimeBadge
                             }>
                                <Clock size={12} /> {h.timestamp ? new Date(new Date(h.timestamp).getTime() + (5.5 * 60 * 60 * 1000)).getUTCHours().toString().padStart(2, '0') + ":" + new Date(new Date(h.timestamp).getTime() + (5.5 * 60 * 60 * 1000)).getUTCMinutes().toString().padStart(2, '0') : "--:--"}
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                 </div>
               )}

               {/* Inner Pagination */}
               {historyTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                     <button 
                       className="pagination-btn" 
                       disabled={historyPage === 1}
                       onClick={() => fetchUserDetail(selectedUser._id, historyPage - 1)}
                     >
                       <ChevronLeft size={16} />
                     </button>
                     <span style={styles.smPageInfo}>{historyPage} / {historyTotalPages}</span>
                     <button 
                       className="pagination-btn" 
                       disabled={historyPage === historyTotalPages}
                       onClick={() => fetchUserDetail(selectedUser._id, historyPage + 1)}
                     >
                       <ChevronRight size={16} />
                     </button>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    marginLeft: '270px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    color: '#0f172a'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', margin: 0, fontSize: '15px' },
  exportBtn: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#0f172a',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
    gap: '20px'
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '400px'
  },
  searchInput: {
    border: 'none',
    padding: '14px 12px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    color: '#0f172a'
  },
  selectWrapper: { position: 'relative' },
  select: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 16px 12px 40px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    minWidth: '140px'
  },
  tableCard: {
    backgroundColor: 'transparent'
  },
  userName: { fontWeight: '700', fontSize: '15px' },
  userEmail: { color: '#64748b', fontSize: '13px' },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#FF6B00',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '16px'
  },
  roleTag: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  countBadge: {
    backgroundColor: '#fff7ed',
    color: '#FF6B00',
    padding: '6px 12px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '800'
  },
   primaryBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#FF6B00",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s"
   },
   addBtn: {
    padding: "10px 18px",
    backgroundColor: "#fff7ed",
    color: "#C2410C",
    border: "1px solid #ffedd5",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s"
   },
   bulkBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    background: '#f1f5f9',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  viewBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    background: '#f1f5f9',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '25px',
    padding: '0 10px'
  },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '600' },
  loadingState: { padding: '100px', textAlign: 'center', color: '#64748b' },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '25px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#94a3b8'
  },
   modalHeader: {
    padding: "24px 30px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
   },
   formGroup: {
    marginBottom: "20px"
   },
   label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px"
   },
   input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
   },
   modalTitle: {
     margin: 0,
     fontSize: "22px",
     fontWeight: "800",
     color: "#0f172a"
   },
  modalStat: {
     display: 'flex',
     alignItems: 'center',
     gap: '6px',
     backgroundColor: '#f8fafc',
     padding: '8px 16px',
     borderRadius: '100px',
     fontSize: '13px',
     fontWeight: '700',
     color: '#64748b'
  },
  sectionLabel: { fontSize: '14px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' },
  historyScroll: { maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' },
  historyRow: {
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: '16px 0',
     borderBottom: '1px solid #f1f5f9'
  },
  smDateBadge: {
     width: '40px',
     height: '44px',
     backgroundColor: '#fff7ed',
     color: '#FF6B00',
     borderRadius: '8px',
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
     lineHeight: 1
  },
  smTimeBadge: {
     display: 'flex',
     alignItems: 'center',
     gap: '6px',
     backgroundColor: '#f1f5f9',
     padding: '6px 12px',
     borderRadius: '8px',
     fontSize: '13px',
     fontWeight: '700'
  },
  smPageInfo: { fontSize: '13px', fontWeight: '700', color: '#94a3b8' },
  iconBox: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' },
  summaryCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  actionBtn: { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }
};

export default AdminAttendance;
