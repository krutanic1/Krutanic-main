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
  History, 
  X,
  Clock,
  UserCheck,
  Mail,
  Shield,
  ArrowRight,
  Filter,
  Download,
  Send,
  Loader
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
          year: filterYear 
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
  }, [currentPage, search, filterMonth, filterYear]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
      
      const dataToExport = res.data.data.map(m => ({
        "Name": m.name,
        "Email": m.email,
        "Role": m.role || "Member",
        "Total": m.daysPresent,
        "Full Present": m.onTimeCount,
        "Late": m.lateCount,
        "Half Day": m.halfDayCount,
        "Month": monthNames[filterMonth],
        "Year": filterYear
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="admin-attendance-container" style={styles.container}>
      <Toaster position="top-right" />
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
          <button 
            style={{ ...styles.exportBtn, background: '#0f172a', color: 'white', border: 'none' }}
            onClick={sendAllReports}
            disabled={isBulkSending}
          >
            {isBulkSending ? (
              <><Loader size={18} className="animate-spin" /> Dispatching...</>
            ) : (
              <><Send size={18} /> Send All Reports</>
            )}
          </button>
          <button 
            style={styles.exportBtn} 
            onClick={exportToExcel} 
            disabled={exportLoading}
          >
            {exportLoading ? (
              <>Exporting...</>
            ) : (
              <><Download size={18} /> Export Report</>
            )}
          </button>
        </div>
      </div>

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
                          <div style={styles.userName}>{user.name}</div>
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
                          onClick={(e) => sendReport(user, e)}
                          disabled={sendingReport === user._id}
                          title="Send Report to Email"
                        >
                          {sendingReport === user._id ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
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
                    {userHistory.length === 0 ? (
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
                               {(h.ip || h.deviceInfo) && (
                                 <div style={{ display: 'flex', gap: '8px', marginLeft: '45px' }}>
                                    {h.ip && (
                                      <div style={{ fontSize: '10px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                        IP: {h.ip === "::1" || h.ip === "127.0.0.1" ? "Localhost" : h.ip}
                                      </div>
                                    )}
                                    {h.deviceInfo && (
                                      <div 
                                        style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                        title={h.deviceInfo}
                                      >
                                        {h.deviceInfo.split('(')[1]?.split(')')[0] || "Device"}
                                      </div>
                                    )}
                                 </div>
                               )}
                           </div>
                           <div style={
                              h.isHalfDay ? { ...styles.smTimeBadge, background: '#fff1f2', color: '#be123c' } :
                              h.isLate ? { ...styles.smTimeBadge, background: '#fff7ed', color: '#c2410c' } : 
                              styles.smTimeBadge
                           }>
                              <Clock size={12} /> {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '25px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#94a3b8'
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
  smPageInfo: { fontSize: '13px', fontWeight: '700', color: '#94a3b8' }
};

export default AdminAttendance;
