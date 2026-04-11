import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
  ArrowRight,
  Filter,
  Download,
  Send,
  Loader,
  Trash2,
  Edit3,
  Check,
  AlertCircle
} from "lucide-react";

/**
 * HR Attendance Dashboard
 * Optimized for HR view, utilizing the same attendance system as Admin.
 */

const HRAttendance = () => {
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
  const [sendingReport, setSendingReport] = useState(null);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [isSendingAbsent, setIsSendingAbsent] = useState(false);
  const [updatingRecord, setUpdatingRecord] = useState(null);
  
  const [addingMember, setAddingMember] = useState(false);
  
  // Summary State
  const [dailySummary, setDailySummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // { id, time }
  const [deletingRecord, setDeletingRecord] = useState(null);
  
  // User Account Edit State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ email: "", name: "", role: "Employee", pin: "" });
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("hrToken");
      const res = await axios.get(`${API}/api/atd/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          page: currentPage, 
          limit: 50, 
          search, 
          month: filterMonth, 
          year: filterYear 
        }
      });
      setMembers(res.data.data);
      setTotalMembers(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load members or unauthorized");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterMonth, filterYear]);

  const fetchDailySummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const token = localStorage.getItem("hrToken");
      // Get today's date in IST YYYY-MM-DD
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

  useEffect(() => {
    fetchMembers();
    fetchDailySummary();
  }, [fetchMembers, fetchDailySummary]);

  const fetchUserDetail = async (userId, page = 1) => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("hrToken");
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
      const token = localStorage.getItem("hrToken");
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
      const token = localStorage.getItem("hrToken");
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
    if (!window.confirm(`Bulk dispatch reports for ${monthNames[filterMonth]} ${filterYear}?`)) return;
    setIsBulkSending(true);
    try {
      const token = localStorage.getItem("hrToken");
      await axios.post(`${API}/api/atd/admin/send-all-reports`, {
        month: filterMonth,
        year: filterYear
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Bulk report dispatch started");
    } catch (err) {
      toast.error("Failed to start dispatch");
    } finally {
      setIsBulkSending(false);
    }
  };

  const sendReminders = async () => {
    if (!window.confirm("Send attendance reminders to all employees who haven't marked attendance today?")) return;
    setIsReminding(true);
    try {
      const token = localStorage.getItem("hrToken");
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
      const token = localStorage.getItem("hrToken");
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
      const token = localStorage.getItem("hrToken");
      await axios.patch(`${API}/api/atd/admin/attendance/${recordId}`, {
        isHalfDayOverride: !currentVal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Status updated");
      // Update local history state
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
      const token = localStorage.getItem("hrToken");
      await axios.patch(`${API}/api/atd/admin/attendance/${recordId}`, {
        newTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Time updated successfully");
      setEditingRecord(null);
      // Refresh history and list
      if (selectedUser) fetchUserDetail(selectedUser._id, historyPage);
      fetchMembers();
    } catch (err) {
      toast.error("Failed to update time");
    } finally {
      setUpdatingRecord(null);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to permanently delete this attendance record?")) return;
    setDeletingRecord(recordId);
    try {
      const token = localStorage.getItem("hrToken");
      await axios.delete(`${API}/api/atd/admin/attendance/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Record deleted");
      // Refresh
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
    setAddingMember(true);
    try {
      const token = localStorage.getItem("hrToken");
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
      const token = localStorage.getItem("hrToken");
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="admin-attendance-container" style={styles.container}>
      {showAddModal && (
        <div style={styles.modalOverlay}>
           <div style={{ ...styles.modalContent, maxWidth: "450px" }}>
              <div style={styles.modalHeader}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ ...styles.iconBox, backgroundColor: "#fff7ed" }}><Users color="#FF6B00" /></div>
                    <div>
                       <h2 style={styles.modalTitle}>Add New Member</h2>
                       <p style={{ fontSize: "12px", color: "#64748b" }}>Register employee for attendance</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddMember} style={{ padding: "30px" }}>
                 <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input type="text" style={styles.input} value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>Email Address</label><input type="email" style={styles.input} value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>Role</label><input type="text" style={styles.input} value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>PIN (4-6 digits)</label><input type="text" style={styles.input} value={newMember.pin} onChange={e => setNewMember({...newMember, pin: e.target.value})} required/></div>
                 <button type="submit" disabled={addingMember} style={styles.primaryBtn}>{addingMember ? "Registering..." : "Add Member"}</button>
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
                 <div style={styles.formGroup}><label style={styles.label}>Full Name</label><input type="text" style={styles.input} value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>Email Address</label><input type="email" style={styles.input} value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>Role</label><input type="text" style={styles.input} value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} required/></div>
                 <div style={styles.formGroup}><label style={styles.label}>Employee PIN</label><input type="text" style={styles.input} value={editingUser.pin || ""} onChange={e => setEditingUser({...editingUser, pin: e.target.value})} required/></div>
                 <div style={styles.formGroup}>
                    <label style={styles.label}>Account Status</label>
                    <select style={styles.input} value={editingUser.status || "active"} onChange={e => setEditingUser({...editingUser, status: e.target.value})}>
                       <option value="active">Active (Access Allowed)</option>
                       <option value="inactive">Inactive (Access Blocked)</option>
                    </select>
                 </div>
                 <button type="submit" disabled={isUpdatingUser} style={styles.primaryBtn}>{isUpdatingUser ? "Updating..." : "Update Credentials"}</button>
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
        .pagination-btn { padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; font-weight: 600; color: #64748b; }
        .pagination-btn:hover:not(:disabled) { border-color: #FF6B00; color: #FF6B00; }
        .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
      `}</style>

      <div style={styles.header}>
        <div><h1 style={styles.title}>Employee Attendance</h1><p style={styles.subtitle}>HR Portal Dashboard</p></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}><Users size={18} /><span>Add Member</span></button>
          <button style={{ ...styles.exportBtn, background: '#f59e0b', color: 'white', border: 'none' }} onClick={sendReminders} disabled={isReminding}>{isReminding ? <><Loader size={18} className="animate-spin" /> Reminding...</> : <><Clock size={18} /> Send Reminders</>}</button>
          <button style={{ ...styles.exportBtn, background: '#ef4444', color: 'white', border: 'none' }} onClick={sendAbsentMails} disabled={isSendingAbsent}>{isSendingAbsent ? <><Loader size={18} className="animate-spin" /> Sending...</> : <><X size={18} /> Send Absent Mails</>}</button>
          <button style={{ ...styles.exportBtn, background: '#0f172a', color: 'white', border: 'none' }} onClick={sendAllReports} disabled={isBulkSending}>{isBulkSending ? <><Loader size={18} className="animate-spin" /> Dispatching...</> : <><Send size={18} /> Send Reports</>}</button>
          <button style={styles.exportBtn} onClick={exportToExcel} disabled={exportLoading}>{exportLoading ? <>Exporting...</> : <><Download size={18} /> Export Excel</>}</button>
        </div>
      </div>

      {/* Daily Department Summary */}
      <div style={styles.summaryGrid}>
        {loadingSummary ? <div className="p-4 text-gray-400">Loading summary...</div> : dailySummary.length > 0 ? dailySummary.map((s, i) => (
          <div key={i} style={styles.summaryCard}>
            <div style={{ ...styles.avatar, width: '32px', height: '32px', fontSize: '12px', background: '#f1f5f9', color: '#64748b' }}><UserCheck size={16} /></div>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px' }}>{s.department || "Other"}</div>
               <div style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b' }}>{s.count} <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Present</span></div>
            </div>
          </div>
        )) : <div style={{ padding: '20px', color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>No attendance records found for today</div>}
      </div>

      <div style={styles.controls}>
        <div style={styles.searchContainer}><Search size={18} color="#94a3b8" /><input type="text" placeholder="Search..." style={styles.searchInput} value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}/></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={styles.selectWrapper}><Calendar size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} /><select style={styles.select} value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}>{monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}</select></div>
          <div style={styles.selectWrapper}><Filter size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} /><select style={styles.select} value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}>{[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
        </div>
      </div>

      <div style={styles.tableCard}>
        {loading ? <div style={styles.loadingState}>Loading...</div> : (
          <>
            <table className="admin-table">
              <thead><tr><th>Employee</th><th>Role</th><th>Total</th><th>Full</th><th>Late</th><th>Half Day</th><th>Actions</th></tr></thead>
              <tbody>{members.map((user) => (
                <tr key={user._id} onClick={() => handleUserClick(user)}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={styles.avatar}>{user.name.charAt(0)}</div><div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={styles.userName}>{user.name}</div>
                           {user.status === 'inactive' && (
                             <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>INACTIVE</span>
                           )}
                        </div>
                        <div style={styles.userEmail}>{user.email}</div>
</div></div></td>
                  <td><span style={styles.roleTag}>{user.role || "Member"}</span></td>
                  <td><div style={{ ...styles.countBadge, background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>{user.daysPresent}</div></td>
                  <td><div style={{ ...styles.countBadge, color: '#10b981', border: '1px solid #d1fae5' }}>{user.onTimeCount}</div></td>
                  <td><div style={{ ...styles.countBadge, color: user.lateCount > 0 ? '#f59e0b' : '#94a3b8', border: user.lateCount > 0 ? '#ffedd5' : '#e2e8f0' }}>{user.lateCount}</div></td>
                  <td><div style={{ ...styles.countBadge, color: user.halfDayCount > 0 ? '#f43f5e' : '#94a3b8', border: user.halfDayCount > 0 ? '#ffe4e6' : '#e2e8f0' }}>{user.halfDayCount}</div></td>
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
                        <button style={styles.viewBtn} onClick={() => handleUserClick(user)}>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                </tr>
              ))}</tbody>
            </table>
            {totalPages > 1 && (
              <div style={styles.paginationRow}><span style={styles.pageInfo}>Page {currentPage} of {totalPages}</span><div style={{ display: 'flex', gap: '10px' }}><button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /> Prev</button><button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next <ChevronRight size={18} /></button></div></div>
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedUser(null)}><X size={20} /></button>
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ ...styles.avatar, width: '48px', height: '48px' }}>{selectedUser.name.charAt(0)}</div>
                <div><h2 style={{ margin: 0 }}>{selectedUser.name}</h2><div style={{ color: '#64748b' }}>{selectedUser.email}</div></div>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}><Loader size={24} className="animate-spin" /></div>
                ) : userHistory.map((h, i) => (
                  <div key={i} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{new Date(h.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: h.isHalfDay ? '#fff1f2' : '#f0fdf4', color: h.isHalfDay ? '#e11d48' : '#16a34a' }}>
                          {h.isHalfDay ? "Half Day" : "Full Present"}
                        </span>
                        {h.isLate && !h.isHalfDay && <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px', background: '#fffbeb', color: '#d97706' }}>Late</span>}
                      </div>
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
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '40px', marginLeft: '270px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' },
  subtitle: { color: '#64748b', margin: 0 },
  exportBtn: { backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' },
  searchContainer: { flex: 1, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '0 16px', display: 'flex', alignItems: 'center', maxWidth: '400px' },
  searchInput: { border: 'none', padding: '14px 12px', fontSize: '15px', outline: 'none', width: '100%' },
  selectWrapper: { position: 'relative' },
  select: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px 12px 40px', fontSize: '14px', cursor: 'pointer', appearance: 'none', minWidth: '140px' },
  avatar: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FF6B00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  userName: { fontWeight: '700' }, userEmail: { color: '#64748b', fontSize: '12px' },
  roleTag: { backgroundColor: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '8px', fontSize: '12px' },
  countBadge: { padding: '4px 8px', borderRadius: '100px', fontSize: '13px', fontWeight: '700', minWidth: '35px', textAlign: 'center' },
  primaryBtn: { width: "100%", padding: "14px", backgroundColor: "#FF6B00", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" },
  addBtn: { padding: "10px 18px", backgroundColor: "#fff7ed", color: "#C2410C", border: "1px solid #ffedd5", borderRadius: "10px", fontWeight: "700", display: "flex", gap: "8px", cursor: "pointer" },
  viewBtn: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  paginationRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px' },
  modalContent: { backgroundColor: '#fff', borderRadius: '24px', width: '90%', maxWidth: '600px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  closeBtn: { position: 'absolute', top: '20px', right: '25px', border: 'none', background: 'none', cursor: 'pointer' },
  modalHeader: { padding: "24px 30px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" },
  formGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "5px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0" },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' },
  summaryCard: { background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  actionBtn: { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' },
  iconBox: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: '18px', fontWeight: '800', margin: 0 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  smTimeBadge: { fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }
};

export default HRAttendance;
