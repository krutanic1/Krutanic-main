import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  LineChart, Line
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, DollarSign, BookOpen, Award, Clock,
  Mail, Smartphone, FileText, Briefcase, Target, Star, AlertCircle,
  CheckCircle, XCircle, BarChart2, PieChart as PieIcon, Activity,
  ChevronUp, ChevronDown, RefreshCw, GraduationCap, Layers, Globe,
  MessageSquare, UserCheck, Zap, Shield, Heart, ArrowUp, ArrowDown
} from "lucide-react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const PALETTE = ["#6366f1","#10b981","#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#84cc16","#ec4899","#14b8a6","#f97316","#3b82f6","#a855f7","#22c55e","#ef4444","#eab308"];
const TABS = [
  { id: "ceo",        label: "Overview",  icon: <Zap size={15}/> },
  { id: "revenue",    label: "Revenue",        icon: <DollarSign size={15}/> },
  { id: "students",   label: "Students",       icon: <Users size={15}/> },
  { id: "counselors", label: "Counselors",     icon: <Award size={15}/> },
  { id: "payments",   label: "Payments",       icon: <Target size={15}/> },
  { id: "internships",label: "Internships",    icon: <Briefcase size={15}/> },
  { id: "marketing",  label: "Marketing",      icon: <Globe size={15}/> },
];

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────
const fmt = (n) => {
  if (!n && n !== 0) return "₹0";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
};
const num = (n) => (n || 0).toLocaleString("en-IN");
const pct = (v, total) => total > 0 ? Math.round((v / total) * 100) : 0;
const cap = (s) => s ? s.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "—";

// ── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background:"rgba(15,15,30,0.95)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, padding:"10px 14px", backdropFilter:"blur(10px)" }}>
        <p style={{ color:"#a5b4fc", fontSize:12, marginBottom:6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize:13, fontWeight:600 }}>
            {p.name}: {isCurrency ? fmt(p.value) : num(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── KPI CARD ────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, sub, color, trend }) => (
  <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid rgba(255,255,255,0.08)`, borderRadius:16, padding:"20px 22px", backdropFilter:"blur(12px)", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, right:0, width:80, height:80, background:`radial-gradient(circle at top right, ${color}22, transparent)`, borderRadius:"0 16px 0 80px" }}/>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <div style={{ background:`${color}22`, color:color, borderRadius:10, padding:8, display:"flex" }}>{icon}</div>
      <span style={{ color:"#94a3b8", fontSize:12, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
    </div>
    <div style={{ fontSize:28, fontWeight:800, color:"#f1f5f9", letterSpacing:"-0.02em", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ color:"#64748b", fontSize:12, marginTop:6 }}>{sub}</div>}
    {trend !== undefined && (
      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8, color: trend >= 0 ? "#10b981" : "#f43f5e", fontSize:12 }}>
        {trend >= 0 ? <ArrowUp size={12}/> : <ArrowDown size={12}/>}
        <span>{Math.abs(trend)}% vs last month</span>
      </div>
    )}
  </div>
);

// ── SECTION CARD ────────────────────────────────────────────────────────────
const Card = ({ title, subtitle, children, fullWidth }) => (
  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"22px 24px", gridColumn: fullWidth ? "1/-1" : undefined }}>
    {title && <h3 style={{ color:"#e2e8f0", fontSize:16, fontWeight:700, marginBottom:4 }}>{title}</h3>}
    {subtitle && <p style={{ color:"#64748b", fontSize:12, marginBottom:18 }}>{subtitle}</p>}
    {children}
  </div>
);

// ── PROGRESS BAR ────────────────────────────────────────────────────────────
const ProgressBar = ({ label, value, total, color }) => {
  const percentage = pct(value, total);
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ color:"#cbd5e1", fontSize:13, fontWeight:500 }}>{label}</span>
        <span style={{ color:color, fontSize:13, fontWeight:700 }}>{num(value)} <span style={{ color:"#475569" }}>/ {num(total)} ({percentage}%)</span></span>
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
        <div style={{ width:`${percentage}%`, height:"100%", background:`linear-gradient(90deg, ${color}, ${color}88)`, borderRadius:100, transition:"width 1s ease" }}/>
      </div>
    </div>
  );
};

// ── FUNNEL STEP ─────────────────────────────────────────────────────────────
const FunnelStep = ({ label, value, total, color, isLast }) => {
  const w = total > 0 ? Math.max((value / total) * 100, 10) : 10;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ width:`${w}%`, minWidth:180, background:`linear-gradient(135deg, ${color}33, ${color}18)`, border:`1px solid ${color}55`, borderRadius:10, padding:"10px 16px", textAlign:"center", backdropFilter:"blur(6px)" }}>
        <div style={{ color:"#f1f5f9", fontSize:18, fontWeight:800 }}>{num(value)}</div>
        <div style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>{label}</div>
        {total > 0 && value < total && <div style={{ color:color, fontSize:11, marginTop:2 }}>{pct(value, total)}% of total</div>}
      </div>
      {!isLast && <div style={{ width:2, height:20, background:`linear-gradient(${color}, #1e293b)` }}/>}
    </div>
  );
};

// ── COUNSELOR ROW ────────────────────────────────────────────────────────────
const CounselorRow = ({ c, rank }) => {
  const medalColors = { 1:"#f59e0b", 2:"#94a3b8", 3:"#cd7c4c" };
  const initials = c.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      <td style={{ padding:"12px 10px", color: medalColors[rank] || "#64748b", fontWeight:800, fontSize:15 }}>#{rank}</td>
      <td style={{ padding:"12px 10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${PALETTE[rank % PALETTE.length]}, ${PALETTE[(rank + 3) % PALETTE.length]})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700, flexShrink:0 }}>{initials}</div>
          <span style={{ color:"#e2e8f0", fontWeight:600, fontSize:13 }}>{cap(c.name)}</span>
        </div>
      </td>
      <td style={{ padding:"12px 10px", color:"#10b981", fontWeight:700, fontSize:13 }}>{fmt(c.revenue)}</td>
      <td style={{ padding:"12px 10px", color:"#94a3b8", fontSize:13 }}>{num(c.students)}</td>
      <td style={{ padding:"12px 10px" }}>
        <div style={{ display:"inline-block", background: c.conversionRate >= 70 ? "#10b98122" : c.conversionRate >= 40 ? "#f59e0b22" : "#f43f5e22", color: c.conversionRate >= 70 ? "#10b981" : c.conversionRate >= 40 ? "#f59e0b" : "#f43f5e", borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:700 }}>
          {c.conversionRate}%
        </div>
      </td>
      <td style={{ padding:"12px 10px", color:"#f59e0b", fontSize:13 }}>{fmt(c.pendingAmount)}</td>
      <td style={{ padding:"12px 10px", color:"#6366f1", fontSize:13 }}>{fmt(c.avgFee)}</td>
      <td style={{ padding:"12px 10px" }}>
        <div style={{ display:"flex", gap:8 }}>
          <span title="Full Paid" style={{ color:"#10b981", fontSize:12 }}>✓{c.fullPaid}</span>
          <span title="Booked" style={{ color:"#f59e0b", fontSize:12 }}>📌{c.booked}</span>
          <span title="Default" style={{ color:"#f43f5e", fontSize:12 }}>✗{c.defaulted}</span>
        </div>
      </td>
    </tr>
  );
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
const AdminTeamAnalysis = () => {
  const [activeTab, setActiveTab] = useState("ceo");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counselorSort, setCounselorSort] = useState("revenue");
  const [counselorSearch, setCounselorSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }
      const res = await axios.get(`${API}/bi-dashboard-stats`, { params, withCredentials: true });
      setData(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("BI Dashboard error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── COUNSELOR SORTING ─────────────────────────────────────────────────────
  const sortedCounselors = data?.counselorStats
    ? [...data.counselorStats]
        .filter(c => !counselorSearch || c.name?.toLowerCase().includes(counselorSearch.toLowerCase()))
        .sort((a, b) => (b[counselorSort] || 0) - (a[counselorSort] || 0))
        .map((c, i) => ({ ...c, rank: i + 1 }))
    : [];

  // ── STYLES ────────────────────────────────────────────────────────────────
  const styles = {
    root: { background:"#0a0a14", color:"#f1f5f9", fontFamily:"'Inter', 'Segoe UI', sans-serif", minHeight:"calc(100vh - 60px)", marginLeft:270 },
    header: { background:"rgba(15,15,30,0.9)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 },
    tabs: { display:"flex", gap:2, padding:"0 24px", background:"rgba(10,10,20,0.8)", borderBottom:"1px solid rgba(255,255,255,0.06)", overflowX:"auto", scrollbarWidth:"none" },
    tab: (active) => ({ display:"flex", alignItems:"center", gap:7, padding:"13px 16px", cursor:"pointer", border:"none", background:"transparent", color: active ? "#6366f1" : "#64748b", borderBottom: active ? "2px solid #6366f1" : "2px solid transparent", fontSize:13, fontWeight: active ? 700 : 500, whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0 }),
    content: { padding:"24px", maxWidth:1600, margin:"0 auto" },
    grid: (cols) => ({ display:"grid", gridTemplateColumns:`repeat(auto-fit, minmax(${cols === 4 ? '220px' : cols === 3 ? '260px' : '340px'}, 1fr))`, gap:16 }),
    chartH: { height:300 },
  };

  if (loading) {
    return (
      <div style={{ ...styles.root, display:"flex", alignItems:"center", justifyContent:"center", minHeight:400 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:56, height:56, border:"3px solid rgba(99,102,241,0.2)", borderTop:"3px solid #6366f1", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }}/>
          <p style={{ color:"#64748b", fontSize:14 }}>Loading BI Dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, revenueByMonth, revenueByDomain, revenueByProgram, revenueByPaymentMode,
    studentsByCollege, studentsByBranch, studentsByYear, studentsByLanguage, studentsByLeadSource,
    counselorStats, internshipStats, remarkDistribution, referralStats, funnel } = data;

  // ── TAB CONTENT ───────────────────────────────────────────────────────────
  const renderCeo = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* KPI Grid */}
      <div style={styles.grid(4)}>
        <KpiCard icon={<Users size={18}/>} label="Total Students" value={num(kpis.totalStudents)} sub={`${num(kpis.todayAdmissions)} today • ${num(kpis.monthAdmissions)} this month`} color="#6366f1"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Total Revenue" value={fmt(kpis.totalRevenue)} sub={`Avg fee: ${fmt(kpis.avgFee)}`} color="#10b981"/>
        <KpiCard icon={<Clock size={18}/>} label="Pending Revenue" value={fmt(kpis.totalPending)} sub={`Collection: ${kpis.collectionRate}%`} color="#f59e0b"/>
        <KpiCard icon={<Target size={18}/>} label="Collection Rate" value={`${kpis.collectionRate}%`} sub={`${fmt(kpis.totalRevenue)} of ${fmt(kpis.totalProgramPrice)}`} color="#06b6d4"/>
      </div>
      <div style={styles.grid(4)}>
        <KpiCard icon={<CheckCircle size={18}/>} label="Full Paid" value={num(kpis.fullPaid)} sub="Completed payments" color="#10b981"/>
        <KpiCard icon={<BookOpen size={18}/>} label="Booked" value={num(kpis.booked)} sub="Partial payments" color="#f59e0b"/>
        <KpiCard icon={<XCircle size={18}/>} label="Defaulted" value={num(kpis.defaulted)} sub="No payments" color="#f43f5e"/>
        <KpiCard icon={<Activity size={18}/>} label="Active Internships" value={num(internshipStats.startingThisMonth)} sub="Starting this month" color="#8b5cf6"/>
      </div>
      <div style={styles.grid(4)}>
        <KpiCard icon={<Mail size={18}/>} label="Mails Sent" value={num(kpis.mailSent)} sub={`${pct(kpis.mailSent, kpis.totalStudents)}% of students`} color="#06b6d4"/>
        <KpiCard icon={<UserCheck size={18}/>} label="Onboarding Done" value={num(kpis.onboardingSent)} sub={`${pct(kpis.onboardingSent, kpis.totalStudents)}% of students`} color="#84cc16"/>
        <KpiCard icon={<Smartphone size={18}/>} label="Portal Activated" value={num(kpis.userCreated)} sub={`${pct(kpis.userCreated, kpis.totalStudents)}% of students`} color="#ec4899"/>
        <KpiCard icon={<FileText size={18}/>} label="Offer Letters" value={num(kpis.offerLetterSent)} sub={`${pct(kpis.offerLetterSent, kpis.totalStudents)}% of students`} color="#f97316"/>
      </div>

      {/* Hero Stats */}
      <div style={styles.grid(3)}>
        <Card title="🏆 Top Performers">
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { label:"Best Counselor", value:cap(kpis.topCounselor), icon:<Award size={16} color="#f59e0b"/> },
              { label:"Top College", value:cap(kpis.topCollege), icon:<GraduationCap size={16} color="#6366f1"/> },
              { label:"Top Domain", value:cap(kpis.topDomain), icon:<Layers size={16} color="#10b981"/> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10 }}>
                {icon}
                <div>
                  <div style={{ color:"#475569", fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
                  <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="📊 Operations Status" subtitle="Completion across all students">
          <ProgressBar label="Mail Sent" value={kpis.mailSent} total={kpis.totalStudents} color="#06b6d4"/>
          <ProgressBar label="Onboarding Done" value={kpis.onboardingSent} total={kpis.totalStudents} color="#84cc16"/>
          <ProgressBar label="Portal Created" value={kpis.userCreated} total={kpis.totalStudents} color="#ec4899"/>
          <ProgressBar label="Offer Letters" value={kpis.offerLetterSent} total={kpis.totalStudents} color="#f97316"/>
        </Card>

        <Card title="🔽 Student Funnel" subtitle="Registration → Completion">
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, paddingTop:8 }}>
            <FunnelStep label="Registered" value={funnel.registered} total={funnel.registered} color="#6366f1"/>
            <FunnelStep label="Paid" value={funnel.paid} total={funnel.registered} color="#10b981"/>
            <FunnelStep label="Mail Sent" value={funnel.mailSent} total={funnel.registered} color="#06b6d4"/>
            <FunnelStep label="Onboarding" value={funnel.onboarding} total={funnel.registered} color="#84cc16"/>
            <FunnelStep label="Portal" value={funnel.userCreated} total={funnel.registered} color="#ec4899"/>
            <FunnelStep label="Offer Letter" value={funnel.offerLetter} total={funnel.registered} color="#f97316" isLast/>
          </div>
        </Card>
      </div>

      {/* Monthly Admissions Chart */}
      <Card title="📅 Monthly Admissions Trend" fullWidth>
        <div style={styles.chartH}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth} margin={{ top:10, right:20, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="gCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="count" name="Admissions" stroke="#6366f1" fill="url(#gCount)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );

  const renderRevenue = () => {
    const filteredRevenueByProgram = revenueByProgram.filter(p => [
      "Self-Guided [2 Months – Training & Internship]",
      "Instructor-Led [2 Months – Training & Internship]",
      "Career Advancement [3 Months – Training, Internship & Placement Assistance]"
    ].includes(p?.program));

    return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={styles.grid(4)}>
        <KpiCard icon={<DollarSign size={18}/>} label="Total Revenue" value={fmt(kpis.totalRevenue)} color="#10b981"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Total Billed" value={fmt(kpis.totalProgramPrice)} sub="Program price sum" color="#6366f1"/>
        <KpiCard icon={<Clock size={18}/>} label="Pending Amount" value={fmt(kpis.totalPending)} color="#f59e0b"/>
        <KpiCard icon={<Users size={18}/>} label="Avg Fee / Student" value={fmt(kpis.avgFee)} color="#06b6d4"/>
      </div>

      <div style={styles.grid(2)}>
        {/* Revenue Trend */}
        <Card title="📈 Monthly Revenue Trend">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top:10, right:20, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}/>
                <Tooltip content={<CustomTooltip isCurrency/>}/>
                <Legend wrapperStyle={{ color:"#64748b", fontSize:12 }}/>
                <Area type="monotone" dataKey="programRevenue" name="Billed" stroke="#6366f1" fill="url(#gBilled)" strokeWidth={2}/>
                <Area type="monotone" dataKey="revenue" name="Collected" stroke="#10b981" fill="url(#gRev)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Domain */}
        <Card title="💻 Revenue by Domain">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDomain.slice(0, 8)} layout="vertical" margin={{ top:0, right:20, left:10, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" tick={{ fill:"#64748b", fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="domain" tick={{ fill:"#cbd5e1", fontSize:11 }} width={110} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip isCurrency/>}/>
                <Bar dataKey="revenue" name="Revenue" radius={[0,4,4,0]} maxBarSize={20}>
                  {revenueByDomain.slice(0,8).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="📦 Revenue by Program Type">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredRevenueByProgram} cx="50%" cy="50%" outerRadius={110} innerRadius={55} dataKey="revenue" nameKey="program" label={({ name, percent }) => `${name ? name.slice(0,12) : ""} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {filteredRevenueByProgram.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Pie>
                <Tooltip formatter={v => fmt(v)}/>
                <Legend wrapperStyle={{ color:"#94a3b8", fontSize:11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Mode Breakdown */}
        <Card title="💳 Payment Mode Breakdown">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPaymentMode} margin={{ top:10, right:20, left:0, bottom:30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="mode" tick={{ fill:"#94a3b8", fontSize:11 }} angle={-30} textAnchor="end" axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#64748b", fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip isCurrency/>}/>
                <Bar dataKey="revenue" name="Revenue" radius={[4,4,0,0]} maxBarSize={50}>
                  {revenueByPaymentMode.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Domain Table */}
      <Card title="📊 Domain Performance Table" fullWidth>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","Domain","Students","Revenue Collected","Billed Amount","Avg Fee"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueByDomain.map((d, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"11px 12px", color:PALETTE[i % PALETTE.length], fontWeight:700 }}>#{i+1}</td>
                  <td style={{ padding:"11px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i % PALETTE.length] }}/>
                      <span style={{ color:"#e2e8f0", fontWeight:600 }}>{d.domain}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 12px", color:"#94a3b8" }}>{num(d.count)}</td>
                  <td style={{ padding:"11px 12px", color:"#10b981", fontWeight:700 }}>{fmt(d.revenue)}</td>
                  <td style={{ padding:"11px 12px", color:"#6366f1" }}>{fmt(d.programRevenue)}</td>
                  <td style={{ padding:"11px 12px", color:"#f59e0b" }}>{fmt(d.count > 0 ? Math.round(d.revenue / d.count) : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    );
  };

  const renderStudents = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={styles.grid(4)}>
        <KpiCard icon={<Users size={18}/>} label="Total Students" value={num(kpis.totalStudents)} color="#6366f1"/>
        <KpiCard icon={<Users size={18}/>} label="Today" value={num(kpis.todayAdmissions)} color="#10b981"/>
        <KpiCard icon={<Users size={18}/>} label="This Month" value={num(kpis.monthAdmissions)} color="#f59e0b"/>
        <KpiCard icon={<Users size={18}/>} label="This Year" value={num(kpis.yearAdmissions)} color="#06b6d4"/>
      </div>

      <div style={styles.grid(2)}>
        {/* By College */}
        <Card title="🏫 Students by College" subtitle="Top 10 institutions">
          <div style={{ height:350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByCollege.slice(0,10)} layout="vertical" margin={{ top:0, right:20, left:20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="college" tick={{ fill:"#cbd5e1", fontSize:10 }} width={120} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Students" radius={[0,4,4,0]} maxBarSize={18}>
                  {studentsByCollege.slice(0,10).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* By Branch */}
        <Card title="⚙️ Students by Branch">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByBranch} margin={{ top:10, right:20, left:0, bottom:30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="branch" tick={{ fill:"#94a3b8", fontSize:11 }} angle={-30} textAnchor="end" axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Students" radius={[4,4,0,0]} maxBarSize={50}>
                  {studentsByBranch.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* By Year */}
        <Card title="📅 Students by Year of Study" subtitle="1st–4th year distribution">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByYear} margin={{ top:10, right:20, left:0, bottom:10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="year" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Students" radius={[6,6,0,0]} maxBarSize={60}>
                  {studentsByYear.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* By Language */}
        <Card title="🌐 Students by Language">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={studentsByLanguage} cx="50%" cy="50%" outerRadius={110} innerRadius={50} dataKey="count" nameKey="language" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {studentsByLanguage.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Pie>
                <Tooltip/>
                <Legend wrapperStyle={{ color:"#94a3b8", fontSize:12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* College Revenue Table */}
      <Card title="🏛️ College Intelligence" subtitle="Ranked by student count + revenue" fullWidth>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","College","Students","Revenue","Avg Fee","Heatmap"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsByCollege.map((c, i) => {
                const maxCount = studentsByCollege[0]?.count || 1;
                const w = Math.round((c.count / maxCount) * 100);
                return (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"11px 12px", color:PALETTE[i % PALETTE.length], fontWeight:700 }}>#{i+1}</td>
                    <td style={{ padding:"11px 12px", color:"#e2e8f0", fontWeight:600 }}>{c.college}</td>
                    <td style={{ padding:"11px 12px", color:"#94a3b8" }}>{num(c.count)}</td>
                    <td style={{ padding:"11px 12px", color:"#10b981", fontWeight:700 }}>{fmt(c.revenue)}</td>
                    <td style={{ padding:"11px 12px", color:"#f59e0b" }}>{fmt(c.count > 0 ? Math.round(c.revenue / c.count) : 0)}</td>
                    <td style={{ padding:"11px 12px" }}>
                      <div style={{ height:6, width:"100%", background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                        <div style={{ width:`${w}%`, height:"100%", background:`linear-gradient(90deg, ${PALETTE[i % PALETTE.length]}, ${PALETTE[i % PALETTE.length]}88)`, borderRadius:100 }}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderCounselors = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search counselor…"
          value={counselorSearch}
          onChange={e => setCounselorSearch(e.target.value)}
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 16px", color:"#f1f5f9", fontSize:13, width:220, outline:"none" }}
        />
        <div style={{ display:"flex", gap:8 }}>
          {[
            { key:"revenue", label:"Revenue" },
            { key:"students", label:"Students" },
            { key:"conversionRate", label:"Conversion" },
            { key:"pendingAmount", label:"Pending" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setCounselorSort(key)} style={{ padding:"9px 16px", borderRadius:10, border:"none", cursor:"pointer", background: counselorSort === key ? "#6366f1" : "rgba(255,255,255,0.06)", color: counselorSort === key ? "#fff" : "#94a3b8", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>{label}</button>
          ))}
        </div>
        <span style={{ color:"#475569", fontSize:12, marginLeft:"auto" }}>{sortedCounselors.length} counselors</span>
      </div>

      {/* Top 3 Podium */}
      {sortedCounselors.length >= 3 && (
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:8 }}>
          {[sortedCounselors[1], sortedCounselors[0], sortedCounselors[2]].map((c, pi) => {
            if (!c) return null;
            const isFirst = pi === 1;
            const podiumColors = { 0:"#94a3b8", 1:"#f59e0b", 2:"#cd7c4c" };
            const rankMap = { 0:2, 1:1, 2:3 };
            const rank = rankMap[pi];
            return (
              <div key={c.name} style={{ textAlign:"center", transform: isFirst ? "translateY(-12px)" : "none" }}>
                <div style={{ width: isFirst ? 70 : 56, height: isFirst ? 70 : 56, borderRadius:"50%", background:`linear-gradient(135deg, ${podiumColors[pi]}, ${podiumColors[pi]}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize: isFirst ? 20 : 16, fontWeight:800, color:"#fff", margin:"0 auto 8px", boxShadow:`0 0 20px ${podiumColors[pi]}44` }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:13 }}>{cap(c.name.split(" ")[0])}</div>
                <div style={{ color: podiumColors[pi], fontWeight:800, fontSize: isFirst ? 18 : 14 }}>{fmt(c.revenue)}</div>
                <div style={{ color:"#475569", fontSize:11 }}>{num(c.students)} students</div>
                <div style={{ color:podiumColors[pi], fontWeight:700, fontSize:12, marginTop:2 }}>#{rank}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue Chart */}
      <Card title="📊 Revenue by Counselor (Top 15)">
        <div style={{ height:340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedCounselors.slice(0,15).map(c => ({ ...c, displayName: cap(c.name.split(" ")[0]) }))} margin={{ top:10, right:20, left:0, bottom:60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="displayName" tick={{ fill:"#94a3b8", fontSize:11 }} angle={-40} textAnchor="end" interval={0} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#64748b", fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip isCurrency/>}/>
              <Bar dataKey="revenue" name="Revenue" radius={[4,4,0,0]} maxBarSize={45}>
                {sortedCounselors.slice(0,15).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card title="🏆 Counselor Leaderboard" fullWidth>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["Rank","Counselor","Revenue","Students","Conversion","Pending","Avg Fee","Payments"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedCounselors.map((c) => (
                <CounselorRow key={c.name} c={c} rank={c.rank}/>
              ))}
            </tbody>
          </table>
          {sortedCounselors.length === 0 && (
            <div style={{ textAlign:"center", padding:40, color:"#475569" }}>No counselors found</div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={styles.grid(4)}>
        <KpiCard icon={<CheckCircle size={18}/>} label="Full Paid" value={num(kpis.fullPaid)} sub={`${pct(kpis.fullPaid, kpis.totalStudents)}% of students`} color="#10b981"/>
        <KpiCard icon={<Clock size={18}/>} label="Booked (Partial)" value={num(kpis.booked)} sub={`${pct(kpis.booked, kpis.totalStudents)}% of students`} color="#f59e0b"/>
        <KpiCard icon={<XCircle size={18}/>} label="Defaulted" value={num(kpis.defaulted)} sub={`${pct(kpis.defaulted, kpis.totalStudents)}% of students`} color="#f43f5e"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Pending Amount" value={fmt(kpis.totalPending)} sub="Outstanding balance" color="#8b5cf6"/>
      </div>
      <div style={styles.grid(4)}>
        <KpiCard icon={<Target size={18}/>} label="Collection Rate" value={`${kpis.collectionRate}%`} color="#06b6d4"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Total Collected" value={fmt(kpis.totalRevenue)} color="#10b981"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Total Billed" value={fmt(kpis.totalProgramPrice)} color="#6366f1"/>
        <KpiCard icon={<DollarSign size={18}/>} label="Avg Fee" value={fmt(kpis.avgFee)} color="#f97316"/>
      </div>

      <div style={styles.grid(2)}>
        {/* Payment Status Donut */}
        <Card title="💳 Payment Status Distribution">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name:"Full Paid", value: kpis.fullPaid, color:"#10b981" },
                    { name:"Booked", value: kpis.booked, color:"#f59e0b" },
                    { name:"Defaulted", value: kpis.defaulted, color:"#f43f5e" },
                  ]}
                  cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                >
                  {["#10b981","#f59e0b","#f43f5e"].map((color, i) => <Cell key={i} fill={color}/>)}
                </Pie>
                <Tooltip formatter={v => num(v)}/>
                <Legend wrapperStyle={{ color:"#94a3b8", fontSize:12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Mode Chart */}
        <Card title="💰 Payment Mode Analysis">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByPaymentMode} margin={{ top:10, right:20, left:0, bottom:30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="mode" tick={{ fill:"#94a3b8", fontSize:11 }} angle={-30} textAnchor="end" axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#64748b", fontSize:11 }} tickFormatter={v => `${v}`} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Transactions" radius={[4,4,0,0]} maxBarSize={60}>
                  {revenueByPaymentMode.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Collection Progress */}
      <Card title="📊 Collection Status" fullWidth>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24, padding:"8px 0" }}>
          {[
            { label:"Full Payment Rate", v: kpis.fullPaid, total: kpis.totalStudents, color:"#10b981" },
            { label:"Partial Payment Rate", v: kpis.booked, total: kpis.totalStudents, color:"#f59e0b" },
            { label:"Collection Efficiency", v: kpis.collectionRate, total: 100, color:"#06b6d4" },
          ].map(({ label, v, total, color }) => {
            const p = pct(v, total);
            return (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ width:100, height:100, margin:"0 auto 12px", position:"relative" }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="10" strokeDasharray={`${2.64 * p} ${264 - 2.64 * p}`} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#f1f5f9", fontWeight:800, fontSize:18 }}>{p}%</div>
                </div>
                <div style={{ color:"#94a3b8", fontSize:12 }}>{label}</div>
                <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:15, marginTop:4 }}>{label.includes("Efficiency") ? `${kpis.collectionRate}%` : `${num(v)} / ${num(total)}`}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Payment Mode Table */}
      <Card title="📋 Payment Mode Details" fullWidth>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","Payment Mode","Transactions","Revenue Collected","Avg per Transaction"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueByPaymentMode.map((m, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding:"11px 12px", color:PALETTE[i % PALETTE.length], fontWeight:700 }}>#{i+1}</td>
                  <td style={{ padding:"11px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i % PALETTE.length] }}/>
                      <span style={{ color:"#e2e8f0", fontWeight:600 }}>{m.mode}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 12px", color:"#94a3b8" }}>{num(m.count)}</td>
                  <td style={{ padding:"11px 12px", color:"#10b981", fontWeight:700 }}>{fmt(m.revenue)}</td>
                  <td style={{ padding:"11px 12px", color:"#f59e0b" }}>{fmt(m.count > 0 ? Math.round(m.revenue / m.count) : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderInternships = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={styles.grid(4)}>
        <KpiCard icon={<Briefcase size={18}/>} label="Starting This Month" value={num(internshipStats.startingThisMonth)} sub="Internships beginning" color="#6366f1"/>
        <KpiCard icon={<CheckCircle size={18}/>} label="Ending This Month" value={num(internshipStats.endingThisMonth)} sub="Completing internships" color="#10b981"/>
        <KpiCard icon={<FileText size={18}/>} label="Offer Letters Sent" value={num(internshipStats.offerLetterSent)} sub={`${pct(internshipStats.offerLetterSent, kpis.totalStudents)}% completion`} color="#f59e0b"/>
        <KpiCard icon={<UserCheck size={18}/>} label="Onboarding Done" value={num(internshipStats.onboardingSent)} sub={`${pct(internshipStats.onboardingSent, kpis.totalStudents)}% completion`} color="#8b5cf6"/>
      </div>
      <div style={styles.grid(4)}>
        <KpiCard icon={<Mail size={18}/>} label="Mails Sent" value={num(internshipStats.mailSent)} sub={`${pct(internshipStats.mailSent, kpis.totalStudents)}% of students`} color="#06b6d4"/>
        <KpiCard icon={<Smartphone size={18}/>} label="Portal Activated" value={num(internshipStats.userCreated)} sub={`${pct(internshipStats.userCreated, kpis.totalStudents)}% of students`} color="#ec4899"/>
        <KpiCard icon={<Users size={18}/>} label="Total Students" value={num(kpis.totalStudents)} color="#84cc16"/>
        <KpiCard icon={<Activity size={18}/>} label="Ops Completion" value={`${Math.round((internshipStats.mailSent + internshipStats.onboardingSent + internshipStats.userCreated + internshipStats.offerLetterSent) / (kpis.totalStudents * 4) * 100)}%`} color="#f97316"/>
      </div>

      {/* Operations Progress */}
      <Card title="📋 Operations Completion Dashboard" subtitle="How many students have completed each step" fullWidth>
        <div style={{ maxWidth:700, margin:"0 auto", paddingTop:12 }}>
          <ProgressBar label="📧 Email / Welcome Mail Sent" value={internshipStats.mailSent} total={kpis.totalStudents} color="#06b6d4"/>
          <ProgressBar label="🚀 Onboarding Completed" value={internshipStats.onboardingSent} total={kpis.totalStudents} color="#84cc16"/>
          <ProgressBar label="💻 Portal Account Created" value={internshipStats.userCreated} total={kpis.totalStudents} color="#ec4899"/>
          <ProgressBar label="📄 Offer Letter Sent" value={internshipStats.offerLetterSent} total={kpis.totalStudents} color="#f97316"/>
        </div>
      </Card>

      {/* Radial Chart */}
      <div style={styles.grid(2)}>
        <Card title="📊 Operations Visual Overview">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="20%" outerRadius="95%"
                data={[
                  { name:"Mail", value: pct(internshipStats.mailSent, kpis.totalStudents), fill:"#06b6d4" },
                  { name:"Onboard", value: pct(internshipStats.onboardingSent, kpis.totalStudents), fill:"#84cc16" },
                  { name:"Portal", value: pct(internshipStats.userCreated, kpis.totalStudents), fill:"#ec4899" },
                  { name:"Offer Letter", value: pct(internshipStats.offerLetterSent, kpis.totalStudents), fill:"#f97316" },
                ]}
              >
                <RadialBar dataKey="value" label={{ position:"insideStart", fill:"#fff", fontSize:11 }}/>
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color:"#94a3b8", fontSize:12 }}/>
                <Tooltip formatter={v => `${v}%`}/>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="🎯 Internship Month Analysis" subtitle="Students starting vs ending this month">
          <div style={{ display:"flex", flexDirection:"column", gap:20, paddingTop:16 }}>
            {[
              { label:"Starting This Month", value:internshipStats.startingThisMonth, icon:"🚀", color:"#6366f1" },
              { label:"Ending This Month", value:internshipStats.endingThisMonth, icon:"🏁", color:"#10b981" },
              { label:"Net Change", value: internshipStats.startingThisMonth - internshipStats.endingThisMonth, icon:"📈", color: internshipStats.startingThisMonth >= internshipStats.endingThisMonth ? "#10b981" : "#f43f5e" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", background:"rgba(255,255,255,0.04)", borderRadius:14, border:`1px solid ${color}22` }}>
                <span style={{ fontSize:28 }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"#64748b", fontSize:12, marginBottom:4 }}>{label}</div>
                  <div style={{ color:"#f1f5f9", fontSize:28, fontWeight:800 }}>{value >= 0 ? num(value) : `−${num(Math.abs(value))}`}</div>
                </div>
                <div style={{ width:48, height:48, borderRadius:"50%", background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:20, fontWeight:800 }}>
                  {value >= 0 ? "+" : "−"}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={styles.grid(2)}>
        {/* Lead Source Chart */}
        <Card title="📢 Lead Source Analysis" subtitle="Where your students come from">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByLeadSource} layout="vertical" margin={{ top:0, right:20, left:20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="source" tick={{ fill:"#cbd5e1", fontSize:11 }} width={100} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Students" radius={[0,4,4,0]} maxBarSize={20}>
                  {studentsByLeadSource.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Source Pie */}
        <Card title="🥧 Lead Source Share">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={studentsByLeadSource} cx="50%" cy="50%" outerRadius={110} innerRadius={50} dataKey="count" nameKey="source" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {studentsByLeadSource.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Pie>
                <Tooltip/>
                <Legend wrapperStyle={{ color:"#94a3b8", fontSize:11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Remark Distribution */}
        <Card title="💬 Remark Distribution" subtitle="Most common last remarks across students">
          <div style={styles.chartH}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={remarkDistribution} layout="vertical" margin={{ top:0, right:20, left:20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="remark" tick={{ fill:"#cbd5e1", fontSize:10 }} width={120} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Students" radius={[0,4,4,0]} maxBarSize={16}>
                  {remarkDistribution.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Referral Leaderboard */}
        <Card title="🤝 Top Referrers">
          <div style={{ overflowY:"auto", maxHeight:300 }}>
            {referralStats.length === 0 ? (
              <div style={{ textAlign:"center", color:"#475569", padding:40 }}>No referral data</div>
            ) : (
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    {["#","Referrer","Referrals","Revenue"].map(h => (
                      <th key={h} style={{ padding:"8px 10px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referralStats.map((r, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding:"10px", color:PALETTE[i % PALETTE.length], fontWeight:700 }}>#{i+1}</td>
                      <td style={{ padding:"10px", color:"#e2e8f0", fontWeight:600 }}>{cap(r.referrer)}</td>
                      <td style={{ padding:"10px", color:"#94a3b8" }}>{num(r.referrals)}</td>
                      <td style={{ padding:"10px", color:"#10b981", fontWeight:700 }}>{fmt(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Lead Source Full Table */}
      <Card title="📊 Lead Source Performance Table" fullWidth>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                {["#","Lead Source","Students","Revenue","Avg Fee","Share %","Bar"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsByLeadSource.map((s, i) => {
                const totalLeads = studentsByLeadSource.reduce((acc, x) => acc + x.count, 0);
                const share = pct(s.count, totalLeads);
                return (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding:"11px 12px", color:PALETTE[i % PALETTE.length], fontWeight:700 }}>#{i+1}</td>
                    <td style={{ padding:"11px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i % PALETTE.length] }}/>
                        <span style={{ color:"#e2e8f0", fontWeight:600 }}>{s.source}</span>
                      </div>
                    </td>
                    <td style={{ padding:"11px 12px", color:"#94a3b8" }}>{num(s.count)}</td>
                    <td style={{ padding:"11px 12px", color:"#10b981", fontWeight:700 }}>{fmt(s.revenue)}</td>
                    <td style={{ padding:"11px 12px", color:"#f59e0b" }}>{fmt(s.count > 0 ? Math.round(s.revenue / s.count) : 0)}</td>
                    <td style={{ padding:"11px 12px", color:"#06b6d4", fontWeight:700 }}>{share}%</td>
                    <td style={{ padding:"11px 12px", width:150 }}>
                      <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden" }}>
                        <div style={{ width:`${share}%`, height:"100%", background:PALETTE[i % PALETTE.length], borderRadius:100 }}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const tabContent = {
    ceo: renderCeo,
    revenue: renderRevenue,
    students: renderStudents,
    counselors: renderCounselors,
    payments: renderPayments,
    internships: renderInternships,
    marketing: renderMarketing,
  };

  return (
    <div style={styles.root}>
      <Toaster position="top-center"/>
      <style>{`
        #bi-dashboard-root * { box-sizing: border-box; }
        #bi-dashboard-root ::-webkit-scrollbar { width: 5px; height: 5px; }
        #bi-dashboard-root ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        #bi-dashboard-root ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 100px; }
        .bi-tab-bar::-webkit-scrollbar { display: none; }
        @keyframes bi-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Page Header – not sticky, sits below the AdminHeader */}
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, background:"linear-gradient(135deg, #6366f1, #10b981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0, lineHeight:1.2 }}>
            📊 Business Intelligence Dashboard
          </h1>
          <p style={{ color:"#475569", fontSize:12, margin:"5px 0 0" }}>
            {fromDate && toDate ? `Data from ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}` : `All-time data from ${num(kpis.totalStudents)} students`}
            {lastRefresh && <span style={{ marginLeft:8 }}>• Refreshed {lastRefresh.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative", display:"flex", alignItems:"center", gap: 8 }}>
            <span style={{ color:"#94a3b8" }}>📅</span>
            <input 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 12px", color:"#f1f5f9", fontSize:13, outline:"none", colorScheme:"dark", cursor:"pointer" }}
            />
            <span style={{ color:"#94a3b8", fontSize: 13 }}>to</span>
            <input 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 12px", color:"#f1f5f9", fontSize:13, outline:"none", colorScheme:"dark", cursor:"pointer" }}
            />
            {(fromDate || toDate) && (
              <button 
                onClick={() => { setFromDate(""); setToDate(""); }} 
                style={{ background:"transparent", border:"none", color:"#f43f5e", cursor:"pointer", padding:2, display:"flex" }}
                title="Clear filter"
              >
                <XCircle size={14}/>
              </button>
            )}
          </div>
          <button
            onClick={fetchData}
            style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:10, padding:"9px 18px", color:"#6366f1", fontSize:13, fontWeight:600, cursor:"pointer", flexShrink:0 }}
          >
            <RefreshCw size={14}/> Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bi-tab-bar" style={styles.tabs}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={styles.tab(activeTab === tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div id="bi-dashboard-root" style={styles.content}>
        {tabContent[activeTab] && tabContent[activeTab]()}
      </div>
    </div>
  );
};

export default AdminTeamAnalysis;
