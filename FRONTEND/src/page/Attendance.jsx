import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { 
  MapPin, 
  History, 
  Fingerprint, 
  Send, 
  CheckCircle2, 
  Clock,
  UserCheck,
  LogOut,
  Calendar,
  Navigation,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  User,
  Activity,
  Zap,
  Filter,
  Download,
  PieChart,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Logo from "../assets/LOGO3.png";

const StatCard = ({ icon, label, value, color, subLabel }) => (
  <div style={styles.statCard}>
     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ ...styles.iconBox, backgroundColor: `${color}15` }}>{icon}</div>
        {subLabel && <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8" }}>{subLabel}</div>}
     </div>
     <div style={styles.statLabel}>{label}</div>
     <div style={{ ...styles.statValue, color }}>{value}</div>
  </div>
);

/**
 * Professional Attendance Dashboard - Redesigned (Light Theme)
 * Feature: Server-side Monthly Filtering & 5-Day Pagination
 */

// Stable sub-component moved outside to prevent re-mounting on every render
const AuthCard = ({ children, title, sub, icon: Icon }) => (
  <div className="auth-animate-in" style={styles.authCard}>
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <div style={styles.iconCircle}>
         <Icon size={28} color="#FF6B00" />
      </div>
      <h2 style={styles.authTitle}>{title}</h2>
      <p style={styles.authSub}>{sub}</p>
    </div>
    {children}
  </div>
);

const Attendance = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Choice, 3: OTP, 4: PIN, 5: Dashboard, 6: Set PIN
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [cameFromEmail, setCameFromEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pagination & Filter State (Stored on server-side now)
  const [history, setHistory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [halfDayCount, setHalfDayCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load token and initial data (Auto-login)
  useEffect(() => {
    const token = localStorage.getItem("atdToken");
    const storedUser = localStorage.getItem("atdUser");
    if (token) {
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
        setStep(5);
        fetchHistory(token, 1, filterMonth, filterYear);
      } else {
        setStep(5);
      }
    } else if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
      setUserData(user);
      if (user.hasPin) {
        setStep(4);
      } else {
        setStep(2);
      }
    }
  }, []);

  // Trigger fetch on page/filter changes
  useEffect(() => {
    const token = localStorage.getItem("atdToken");
    if (token && step === 5) {
      fetchHistory(token, currentPage, filterMonth, filterYear);
    }
  }, [currentPage, filterMonth, filterYear]);

  const fetchHistory = async (token, page, month, year) => {
    try {
      const res = await axios.get(`${API}/api/atd/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: 5, month: filterMonth, year: filterYear }
      });
      setHistory(res.data.data);
      setTotalRecords(res.data.total);
      setOnTimeCount(res.data.onTimeCount || 0);
      setLateCount(res.data.lateCount || 0);
      setHalfDayCount(res.data.halfDayCount || 0);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/atd/check-user`, { email });
      setUserData(res.data);
      if (res.data.hasPin) {
        setCameFromEmail(true);
        setStep(4); // Direct to PIN screen
      } else {
        handleSendOtp(); 
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Access Denied");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/atd/send-otp`, { email });
      setStep(3); 
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/atd/verify-otp`, { email, otp });
      if (resetMode) {
        localStorage.setItem("atdToken", res.data.token);
        localStorage.setItem("atdUser", JSON.stringify(res.data.user));
        setUserData(res.data.user);
        setStep(6);
        setResetMode(false);
      } else {
        loginSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSetFirstPin = async (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error("PIN must be 4-6 digits");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("atdToken");
      await axios.post(`${API}/api/atd/set-pin`, { pin }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("PIN set successfully!");
      setStep(5);
      fetchHistory(token, 1, filterMonth, filterYear);
    } catch (err) {
      toast.error("Failed to set PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/atd/login-pin`, { email, pin });
      if (res.data.requireOtp) {
          toast.error("Security Check: OTP required weekly");
          handleSendOtp();
          return;
      }
      loginSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Wrong PIN");
    } finally {
      setLoading(false);
    }
  };

  const loginSuccess = (data) => {
    localStorage.setItem("atdToken", data.token);
    localStorage.setItem("atdUser", JSON.stringify(data.user));
    setUserData(data.user);
    if (!data.user.hasPin) {
      setPin("");
      setStep(6);
    } else {
      setStep(5); 
      fetchHistory(data.token, 1, filterMonth, filterYear);
      toast.success("Welcome back!");
    }
  };

  const handleMarkAttendance = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setMarking(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const token = localStorage.getItem("atdToken");
        await axios.post(`${API}/api/atd/mark`, { lat: latitude, lng: longitude }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Checked in successfully!");
        fetchHistory(token, currentPage, filterMonth, filterYear);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to mark attendance");
      } finally {
        setMarking(false);
      }
    }, () => {
      toast.error("Enable location to check in.");
      setMarking(false);
    });
  };

  const logout = () => {
    localStorage.removeItem("atdToken");
    localStorage.removeItem("atdUser");
    setStep(1);
    setUserData(null);
    setEmail("");
    setPin("");
    setCurrentPage(1);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .auth-animate-in { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-btn { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.7); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(255, 107, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); } }
        .glass-card { background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .input-group:focus-within svg { color: #FF6B00 !important; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-select { appearance: none !important; -webkit-appearance: none !important; -moz-appearance: none !important; background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 32px 8px 12px; font-size: 13px; font-weight: 700; color: #0f172a; cursor: pointer; outline: none; transition: all 0.2s; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important; background-repeat: no-repeat !important; background-position: right 10px center !important; }
        .custom-select::-ms-expand { display: none !important; }
        .custom-select:hover { border-color: #cbd5e1; }
        .custom-select:focus { border-color: #FF6B00; }
        .pagination-btn { width: 38px; height: 38px; display: flex; alignItems: center; justifyContent: center; border-radius: 10px; background-color: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .pagination-btn:hover:not(:disabled) { border-color: #FF6B00; color: #FF6B00; }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .auth-wrapper { padding: 20px !important; }
          .hide-mobile { display: none !important; }
          .header-main { padding: 0 15px !important; height: auto !important; padding-top: 15px !important; padding-bottom: 15px !important; }
          .time-display { flex-direction: column !important; align-items: flex-end !important; gap: 0 !important; transform: scale(0.8); }
          .brand-box { gap: 8px !important; }
          .brand-text { font-size: 11px !important; }
          .log-header { flex-direction: column !important; align-items: flex-start !important; gap: 15px !important; }
          .log-controls { width: 100% !important; justify-content: space-between !important; }
        }
      `}</style>
      
      <Toaster position="top-center" />

      {step !== 5 && (
        <div className="auth-wrapper" style={styles.authWrapper}>
           <div style={{ position: "absolute", top: "40px", left: "40px" }}>
              <img src={Logo} alt="Logo" style={{ height: "40px" }} />
           </div>

          {step === 1 && (
            <AuthCard icon={Mail} title="Welcome back" sub="Enter your corporate email to access the system.">
              <form onSubmit={handleEmailCheck}>
                <div style={styles.inputGroup} className="input-group">
                   <Mail size={20} style={styles.inputIcon} />
                   <input type="email" placeholder="E-mail Address" style={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} style={styles.primaryBtn}>
                  {loading ? "Verifying..." : "Continue"}
                  <ArrowRight size={20} style={{ marginLeft: "8px" }} />
                </button>
              </form>
            </AuthCard>
          )}

          {step === 2 && (
            <AuthCard icon={User} title={`Hello, ${userData?.name?.split(' ')[0]}`} sub="Verify your identity using one of the methods below.">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button onClick={() => setStep(4)} style={styles.choiceBtn}>
                  <div style={styles.choiceIcon}><Lock size={20} /></div>
                  <div style={{ textAlign: "left" }}>
                    <div style={styles.choiceLabel}>Login with PIN</div>
                    <div style={styles.choiceSub}>Quick access with your 4-6 digit code</div>
                  </div>
                </button>
                <button onClick={handleSendOtp} style={styles.choiceBtn}>
                  <div style={styles.choiceIcon}><Send size={20} /></div>
                  <div style={{ textAlign: "left" }}>
                    <div style={styles.choiceLabel}>Use Email OTP</div>
                    <div style={styles.choiceSub}>Verification code sent to your inbox</div>
                  </div>
                </button>
              </div>
            </AuthCard>
          )}

          {step === 3 && (
            <AuthCard icon={Fingerprint} title="Verify OTP" sub={`We sent a code to ${email}`}>
              <form onSubmit={handleVerifyOtp}>
                <div style={styles.inputGroup} className="input-group">
                   <input type="text" placeholder="• • • • • •" maxLength="6" style={{ ...styles.formInput, textAlign: "center", fontSize: "28px", letterSpacing: "8px", fontWeight: "800" }} value={otp} onChange={e => setOtp(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} style={styles.primaryBtn}>Verify Identity</button>
                <button type="button" onClick={handleSendOtp} style={styles.textBtn}>Resend verification code</button>
              </form>
            </AuthCard>
          )}

          {step === 4 && (
            <AuthCard icon={ShieldCheck} title="Enter PIN" sub="Access your secure dashboard.">
              <form onSubmit={handleLoginPin}>
                <div style={styles.inputGroup} className="input-group">
                   <input type="password" placeholder="Enter PIN" maxLength="6" style={{ ...styles.formInput, textAlign: "center", fontSize: "28px", letterSpacing: "12px", fontWeight: "800" }} value={pin} onChange={e => setPin(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} style={styles.primaryBtn}>Login Dashboard</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button type="button" onClick={() => { if (cameFromEmail) { setStep(1); setCameFromEmail(false); } else { setStep(2); } }} style={styles.textBtn}>Back</button>
                  <button type="button" onClick={() => { setResetMode(true); handleSendOtp(); }} style={styles.textBtn}>Forgot PIN?</button>
                </div>
              </form>
            </AuthCard>
          )}

          {step === 6 && (
            <AuthCard icon={Lock} title="Create Secret PIN" sub="Set a quick access PIN for your next login.">
              <form onSubmit={handleSetFirstPin}>
                <div style={styles.inputGroup} className="input-group">
                   <input type="password" placeholder="Set New PIN" maxLength="6" style={{ ...styles.formInput, textAlign: "center", fontSize: "28px", letterSpacing: "12px", fontWeight: "800" }} value={pin} onChange={e => setPin(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} style={styles.primaryBtn}>Confirm & Finish</button>
              </form>
            </AuthCard>
          )}
        </div>
      )}

      {step === 5 && (
        <div style={styles.dashContainer}>
          <header className="header-main" style={styles.dashHeader}>
            <div className="brand-box">
               <img src={Logo} alt="Logo" style={styles.headerLogo} />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
               <div className="time-display" style={styles.timeCluster}>
                  <div style={styles.timeMain}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="hide-mobile" style={styles.timeSec}>{currentTime.toLocaleTimeString([], { second: '2-digit' })}</div>
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                 <button onClick={logout} style={styles.logoutBtn}>
                   <LogOut size={18} />
                   <span className="hide-mobile">Logout</span>
                 </button>
               </div>
            </div>
          </header>

          <main style={styles.dashMain}>
             <div style={styles.dashHero}>
                <div>
                   <h1 style={styles.welcomeText}>
                     Welcome, <span>{(userData?.name && userData.name !== "Unknown") ? userData.name.split(' ')[0] : "Member"}</span>
                   </h1>
                   <div style={styles.dateChip}>
                     <Calendar size={14} color="#FF6B00" />
                     {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                   </div>
                </div>
                <div style={styles.statusIndicator}>
                   <div style={{ ...styles.statusDot, background: history.some(h => h.date === new Date().toISOString().split("T")[0]) ? "#10b981" : "#FF6B00" }} />
                   <span>Real-time Sync Active</span>
                </div>
             </div>

             <div className="dash-grid" style={styles.dashGrid}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                   <div className="glass-card" style={styles.mainActionCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                         <div>
                            <h3 style={styles.cardLabel}>PRESENCE VERIFICATION</h3>
                            <div style={styles.statusTitle}>
                               {history.some(h => h.date === new Date().toISOString().split("T")[0]) ? "Check-in Confirmed" : "Awaiting Check-in"}
                            </div>
                         </div>
                         <div style={{ ...styles.statusIconBox, background: history.some(h => h.date === new Date().toISOString().split("T")[0]) ? "#f0fdf4" : "#fff7ed" }}>
                            {history.some(h => h.date === new Date().toISOString().split("T")[0]) ? <UserCheck color="#10b981" /> : <MapPin color="#FF6B00" />}
                         </div>
                      </div>

                      <p style={styles.actionPrompt}>Our system uses high-precision geolocation. Please ensure you are within the designated office boundary to complete verification.</p>

                      <button 
                        onClick={handleMarkAttendance} 
                        disabled={marking || history.some(h => h.date === new Date().toISOString().split("T")[0])} 
                        className={!history.some(h => h.date === new Date().toISOString().split("T")[0]) ? "pulse-btn" : ""}
                        style={{ 
                          ...styles.checkBtn,
                          opacity: (marking || history.some(h => h.date === new Date().toISOString().split("T")[0])) ? 0.6 : 1,
                          cursor: (marking || history.some(h => h.date === new Date().toISOString().split("T")[0])) ? "not-allowed" : "pointer"
                        }}
                      >
                         {marking ? <><Activity className="spin" size={24} /> Processing...</> : 
                          history.some(h => h.date === new Date().toISOString().split("T")[0]) ? <><CheckCircle2 size={24} /> Checked-in Today</> : 
                          <><Navigation size={22} /> Confirm Attendance</>}
                      </button>

                      <div className="stats-grid" style={styles.statsGrid}>
                         <StatCard icon={<Fingerprint color="#1e293b" />} label="TOTAL LOGINS" value={totalRecords} color="#1e293b" subLabel={`${monthNames[filterMonth]} ${filterYear}`} />
                         <StatCard icon={<UserCheck color="#10b981" />} label="FULL PRESENT" value={onTimeCount} color="#10b981" subLabel="Before 11:05 AM" />
                         <StatCard icon={<Clock color="#f59e0b" />} label="LATE LOGINS" value={lateCount} color="#f59e0b" subLabel="11:05 AM - 02:00 PM" />
                         <StatCard icon={<Clock color="#f43f5e" />} label="HALF DAYS" value={halfDayCount} color="#f43f5e" subLabel="After 02:00 PM" />
                      </div>
                      
                      <div style={{ ...styles.statCard, background: "#f8fafc", boxShadow: "none", border: "1px solid #e2e8f0", marginBottom: "30px", padding: "15px 24px" }}>
                         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <ShieldCheck size={18} color="#64748b" />
                            <div style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                               Attendance Policy: Logins before <b>11:05 AM</b> are "Full Present". After <b>2:00 PM</b> counts as "Half Day".
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="glass-card" style={styles.logCard}>
                   <div className="log-header" style={styles.logHeader}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                         <div style={styles.logCircle}><History size={18} /></div>
                         <h3 style={{ ...styles.cardLabel, margin: 0 }}>ACTIVITY LOG</h3>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Filter:</span>
                         <div className="log-controls" style={{ display: "flex", gap: "8px", position: "relative" }}>
                          <div style={{ position: "relative" }}>
                             <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }} className="custom-select">
                                {monthNames.map((name, i) => (<option key={i} value={i}>{name}</option>))}
                             </select>
                          </div>
                          <div style={{ position: "relative" }}>
                             <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }} className="custom-select">
                                {[2024, 2025, 2026].map(year => (<option key={year} value={year}>{year}</option>))}
                             </select>
                          </div>
                      </div>
                      </div>
                   </div>

                   <div style={styles.logContent}>
                      {history.length === 0 ? (
                        <div style={styles.emptyState}>
                           <Clock size={40} style={{ opacity: 0.1, marginBottom: "15px" }} />
                           <p>No activity recorded yet.</p>
                        </div>
                      ) : (
                        <>
                           {history.map((h, i) => (
                             <div key={i} style={styles.logRow}>
                                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                   <div style={styles.dateBadge}>
                                      <div style={styles.dateDay}>{new Date(h.date).getDate()}</div>
                                      <div style={styles.dateMonth}>{new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                   </div>
                                   <div>
                                      <div style={styles.rowTitle}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                      <div style={styles.rowSub}>
                                         Verified • 
                                         <span style={{ 
                                            color: h.isHalfDay ? "#f43f5e" : 
                                                   h.isLate ? "#f59e0b" : 
                                                   (h.timestamp && new Date(h.timestamp).getHours() >= 14) ? "#f43f5e" :
                                                   (h.timestamp && (new Date(h.timestamp).getHours() > 11 || (new Date(h.timestamp).getHours() === 11 && new Date(h.timestamp).getMinutes() > 5))) ? "#f59e0b" : "#10b981", 
                                            fontWeight: "700", 
                                            marginLeft: "5px" 
                                         }}>
                                            {h.isHalfDay ? "HALF DAY" :
                                             h.isLate ? "LATE" :
                                             (h.timestamp && new Date(h.timestamp).getHours() >= 14) ? "HALF DAY" :
                                             (h.timestamp && (new Date(h.timestamp).getHours() > 11 || (new Date(h.timestamp).getHours() === 11 && new Date(h.timestamp).getMinutes() > 5))) ? "LATE" : "ON TIME"}
                                         </span>
                                      </div>
                                   </div>
                                </div>
                                <div style={
                                   h.isHalfDay ? { ...styles.timeBadge, background: "#fff1f2", color: "#be123c", border: "1px solid #ffe4e6" } :
                                   h.isLate ? { ...styles.timeBadge, background: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" } :
                                   (h.timestamp && new Date(h.timestamp).getHours() >= 14) ? { ...styles.timeBadge, background: "#fff1f2", color: "#be123c", border: "1px solid #ffe4e6" } :
                                   (h.timestamp && (new Date(h.timestamp).getHours() > 11 || (new Date(h.timestamp).getHours() === 11 && new Date(h.timestamp).getMinutes() > 5))) ? { ...styles.timeBadge, background: "#fff7ed", color: "#c2410c", border: "1px solid #ffedd5" } : 
                                   styles.timeBadge
                                }>
                                   {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                             </div>
                           ))}

                           {totalPages > 1 && (
                             <div style={styles.paginationRow}>
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="pagination-btn"><ChevronLeft size={18} /></button>
                                <span style={styles.pageIndicator}>{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="pagination-btn"><ChevronRight size={18} /></button>
                             </div>
                           )}
                        </>
                      )}
                   </div>
                </div>
             </div>
          </main>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    display: "flex",
    flexDirection: "column",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    margin: "20px 0"
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9"
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "800",
    lineHeight: "1"
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px"
  },
  authWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#f8fafc",
    position: "relative",
    overflow: "hidden"
  },
  authCard: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    padding: "48px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)"
  },
  iconCircle: {
     width: "60px",
     height: "60px",
     borderRadius: "18px",
     backgroundColor: "#fff7ed",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     margin: "0 auto 20px"
  },
  authTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "12px",
    letterSpacing: "-0.5px"
  },
  authSub: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.6"
  },
  inputGroup: {
    position: "relative",
    marginBottom: "24px"
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    transition: "color 0.2s"
  },
  formInput: {
    width: "100%",
    backgroundColor: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px 16px 16px 48px",
    color: "#0f172a",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    boxSizing: "border-box"
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#FF6B00",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    padding: "18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 16px -4px rgba(255, 107, 0, 0.4)"
  },
  choiceBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "20px",
    borderRadius: "18px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left"
  },
  choiceIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FF6B00",
    border: "1px solid #e2e8f0"
  },
  choiceLabel: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px"
  },
  choiceSub: {
    fontSize: "13px",
    color: "#64748b"
  },
  textBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline"
  },
  dashContainer: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  dashHeader: {
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexWrap: "nowrap",
    overflow: "hidden"
  },
  headerLogo: {
    height: "24px",
    maxWidth: "140px",
    objectFit: "contain"
  },
  timeCluster: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px"
  },
  timeMain: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 1
  },
  timeSec: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#FF6B00",
    opacity: 0.9
  },
  logoutBtn: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  dashMain: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px"
  },
  dashHero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px"
  },
  welcomeText: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
    letterSpacing: "-1px"
  },
  dateChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    borderRadius: "100px",
    width: "fit-content",
    border: "1px solid #e2e8f0"
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ffffff",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b"
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    boxShadow: "0 0 8px currentColor"
  },
  dashGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "30px",
    alignItems: "start"
  },
  mainActionCard: {
     padding: "40px",
     borderRadius: "32px",
     backgroundColor: "#ffffff"
  },
  cardLabel: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: "1.5px",
    marginBottom: "8px"
  },
  statusTitle: {
     fontSize: "24px",
     fontWeight: "800",
     color: "#0f172a"
  },
  statusIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  actionPrompt: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#64748b",
    margin: "24px 0 32px",
  },
  checkBtn: {
     width: "100%",
     height: "72px",
     borderRadius: "20px",
     backgroundColor: "#FF6B00",
     color: "#fff",
     border: "none",
     fontSize: "18px",
     fontWeight: "800",
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     gap: "12px",
     transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
     boxShadow: "0 10px 20px -5px rgba(255, 107, 0, 0.4)"
  },
  logCard: {
    padding: "0",
    borderRadius: "32px",
    backgroundColor: "#ffffff"
  },
  logHeader: {
    padding: "30px 40px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logCircle: {
     width: "36px",
     height: "36px",
     borderRadius: "10px",
     backgroundColor: "#fff7ed",
     color: "#FF6B00",
     display: "flex",
     alignItems: "center",
     justifyContent: "center"
  },
  logRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #f1f5f9"
  },
  dateBadge: {
    width: "48px",
    height: "52px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0"
  },
  dateDay: { fontSize: "18px", fontWeight: "800", color: "#0f172a", lineHeight: 1 },
  dateMonth: { fontSize: "10px", fontWeight: "700", color: "#FF6B00", textTransform: "uppercase", marginTop: "2px" },
  rowTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "2px" },
  rowSub: { fontSize: "13px", color: "#94a3b8" },
  timeBadge: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    backgroundColor: "#f1f5f9",
    padding: "6px 12px",
    borderRadius: "8px"
  },
  emptyState: {
    padding: "80px 0",
    textAlign: "center",
    color: "#94a3b8"
  },
  paginationRow: {
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     gap: "15px",
     marginTop: "30px",
     paddingTop: "10px"
  },
  pageIndicator: {
     fontSize: "14px",
     fontWeight: "700",
     color: "#64748b"
  }
};

export default Attendance;
