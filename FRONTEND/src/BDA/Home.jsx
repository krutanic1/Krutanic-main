import axios from "axios";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import API from "../API";
import GrowthBarChart from "./GrowthBarChart";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  PieChart, 
  Target,
  Activity
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const calcRatio = (booked, credited) => {
  if (!booked || booked === 0) return 0;
  return Math.max(0, (((booked - credited) / booked) * 100).toFixed(1));
};
const ratioFg  = (p) => p <= 10 ? "#10b981" : p <= 25 ? "#f59e0b" : "#ef4444"; 
const ratioBg  = (p) => p <= 10 ? "rgba(16, 185, 129, 0.1)" : p <= 25 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)"; 
const ratioGrad = (p) => p <= 10 ? "linear-gradient(135deg, #34d399, #10b981)" : p <= 25 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #f87171, #ef4444)";
const ratioLabel = (p) => p <= 10 ? "Healthy" : p <= 25 ? "Moderate" : "High Default";

/* ─── styles ──────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .bda-premium-home * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  
  .bda-premium-home {
    background-color: #fafcff;
    background-image: 
      radial-gradient(at 40% 20%, hsla(250,100%,94%,1) 0px, transparent 50%),
      radial-gradient(at 80% 0%, hsla(189,100%,90%,1) 0px, transparent 50%),
      radial-gradient(at 0% 50%, hsla(355,100%,96%,1) 0px, transparent 50%);
    background-attachment: fixed;
    min-height: 100vh;
    padding: 32px 40px 80px;
    margin-left: 270px;
    position: relative;
    overflow-x: hidden;
  }

  @keyframes slide-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8);
    border-radius: 24px;
    animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    overflow: hidden;
  }

  .stat-card-hover {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .stat-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1);
    background: rgba(255, 255, 255, 0.95);
  }

  .icon-box {
    display: flex; align-items: center; justify-content: center;
    border-radius: 14px;
  }

  .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
  .premium-table th {
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;
    color: #64748b; font-weight: 700; text-align: left;
    padding: 16px 24px; border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .premium-table td {
    padding: 16px 24px; font-size: 14px; color: #334155; font-weight: 600;
    border-bottom: 1px solid rgba(0,0,0,0.02);
    transition: background 0.2s;
  }
  .premium-table tbody tr:hover td { background: rgba(255,255,255,0.4); }
  
  .progress-bg { background: #f1f5f9; border-radius: 999px; overflow: hidden; }
  .progress-bar { border-radius: 999px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }

  /* Minimal custom scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

/* ─── SVG Ring (Modernized) ────────────────────────────────────── */
const PremiumRing = ({ pct, size = 110 }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(Number(pct), 100) / 100) * circ;
  const fg = ratioFg(pct);
  
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fg} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </svg>
      <div style={{ position: "absolute", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{pct}%</span>
        <span style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, fontWeight: 700 }}>Default</span>
      </div>
    </div>
  );
};

/* ─── main ─────────────────────────────────────────────────────── */
const Home = () => {
  const [stats, setStats] = useState(null);
  const [bda, setBda] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const bdaName = localStorage.getItem("bdaName") || "BDA";
  const today = new Date();
  const currentMonthISO = today.toISOString().slice(0, 7);

  useEffect(() => {
    const go = async () => {
      try {
        setLoading(true);
        const [s, b] = await Promise.all([
          axios.get(`${API}/getbdadashboardstats?counselor=${bdaName}`),
          axios.get(`${API}/getbda`),
        ]);
        setStats(s.data);
        setBda(b.data.filter((i) => i.fullname.toLowerCase() === bdaName?.toLowerCase()));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    go();
  }, [bdaName]);

  /* ── Totals ── */
  const bookedRevenue = stats?.totals?.totalBooked || 0;
  const creditedRevenue = stats?.totals?.totalCredited || 0;
  const pendingRevenue = bookedRevenue - creditedRevenue;
  const overallRatio = calcRatio(bookedRevenue, creditedRevenue);
  const fg = ratioFg(overallRatio);

  /* ── Status counts ── */
  const bookedCount = stats?.totals?.bookedCount || 0;
  const fullPaidCount = stats?.totals?.fullPaidCount || 0;
  const defaultCount = stats?.totals?.defaultCount || 0;
  const totalCount = bookedCount + fullPaidCount + defaultCount;

  /* ── Monthly default stats ── */
  const monthlyDefaultStats = (stats?.monthly || []).map((m) => {
    return { ...m, ratio: calcRatio(m.booked, m.credited) };
  });

  /* ── Revenue growth chart ── */
  const revenueChartData = stats?.revenueChart || [];
  const lastTwoMonthsData = revenueChartData.slice(-2);
  const lineChartData = {
    labels: lastTwoMonthsData.map(m => m.month),
    datasets: [{
      label: "Revenue (₹)",
      data: lastTwoMonthsData.map((m) => m.revenue),
      borderColor: "#6366f1",
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
        return gradient;
      },
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#6366f1",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "'Plus Jakarta Sans'", size: 13 },
        bodyFont: { family: "'Plus Jakarta Sans'", size: 14, weight: "bold" },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: { label: (ctx) => "₹ " + ctx.raw.toLocaleString("en-IN") }
      }
    },
    scales: {
      x: { 
        ticks: { color: "#64748b", font: { family: "'Plus Jakarta Sans'", size: 12 } }, 
        grid: { display: false } 
      },
      y: { 
        ticks: { 
          color: "#94a3b8", 
          font: { family: "'Plus Jakarta Sans'", size: 12 },
          callback: (v) => "₹" + (v >= 100000 ? (v/100000).toFixed(1) + "L" : v >= 1000 ? (v/1000).toFixed(1) + "K" : v)
        }, 
        border: { display: false },
        grid: { color: "rgba(0,0,0,0.03)", drawBorder: false } 
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  /* ── Target for current month ── */
  const processedData = [];
  const targetAchievedDict = (stats?.targetAchieved || []).reduce((acc, curr) => {
    acc[curr.isoMonth] = curr;
    return acc;
  }, {});

  const monthsToShow = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(currentMonthISO);
    d.setMonth(d.getMonth() - (3 - i));
    return d.toISOString().slice(0, 7);
  });
  
  monthsToShow.forEach((month) => {
    let totalAssigned = 0;
    let totalAchieved = targetAchievedDict[month]?.achieved || 0;
    bda.forEach((item) => {
      if (item.target?.length > 0) {
        const mt = item.target.find((t) => t.currentMonth === month);
        if (mt) totalAssigned += mt.targetValue;
      }
    });
    if (totalAssigned > 0 || totalAchieved > 0) {
      processedData.push({ month, assigned: totalAssigned, achieved: totalAchieved });
    }
  });

  /* ── Current month target info ── */
  let targetInfo = null;
  bda.forEach((item) => {
    if (item.target?.length > 0) {
      const lastTarget = item.target[item.target.length - 1];
      if (lastTarget.currentMonth === currentMonthISO) {
        const achievedData = targetAchievedDict[currentMonthISO] || { achieved: 0, actualPayments: 0 };
        const achieved = achievedData.achieved;
        targetInfo = { 
          targetValue: lastTarget.targetValue, 
          payments: lastTarget.payments, 
          achieved, 
          actualPayments: achievedData.actualPayments, 
          pending: Math.max(0, lastTarget.targetValue - achieved), 
          hasData: achieved > 0 
        };
      }
    }
  });
  const targetPct = targetInfo ? Math.min(100, Math.round((targetInfo.achieved / targetInfo.targetValue) * 100)) : 0;

  return (
    <div className="bda-premium-home">
      <style>{STYLES}</style>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, animation: "slide-up 0.5s ease-out" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
              <LayoutDashboard size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.05em", textTransform: "uppercase" }}>Overview</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.03em" }}>
            Welcome back, <span style={{ color: "#6366f1" }}>{bdaName}</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0 0", fontWeight: 500 }}>Here's what's happening with your performance today.</p>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {[
          { label: "Total Enrollments", value: totalCount, icon: Users, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", delay: "0s" },
          { label: "Full Paid", value: fullPaidCount, icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", delay: "0.1s" },
          { label: "Booked Only", value: bookedCount, icon: CalendarCheck, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", delay: "0.2s" },
          { label: "Defaulted", value: defaultCount, icon: AlertCircle, color: "#ef4444", bg: "rgba(239,68,68,0.1)", delay: "0.3s" },
        ].map((stat, idx) => (
          <div key={stat.label} className="glass-card stat-card-hover" style={{ padding: 24, animationDelay: stat.delay }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div className="icon-box" style={{ width: 44, height: 44, background: stat.bg, color: stat.color }}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, letterSpacing: "0.02em" }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {loading ? "..." : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── REVENUE & TARGET ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24, marginBottom: 32 }}>
        
        {/* Revenue Overview */}
        <div className="glass-card" style={{ padding: 32, animationDelay: "0.4s", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Revenue Pipeline</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>Your total financial performance</p>
            </div>
            <div className="icon-box" style={{ width: 40, height: 40, background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}>
              <IndianRupee size={20} strokeWidth={2.5} />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, justifyItems: "center" }}>
            {[
              { label: "Booked Revenue", value: bookedRevenue, color: "#0f172a" },
              { label: "Credited Revenue", value: creditedRevenue, color: "#10b981" },
              { label: "Pending Collection", value: pendingRevenue, color: "#f59e0b" },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 20, borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: item.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{loading ? "..." : fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Target */}
        <div className="glass-card" style={{ padding: 32, animationDelay: "0.5s", position: "relative" }}>
          {/* Subtle gradient background element */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%", background: "radial-gradient(circle at top right, rgba(99,102,241,0.05), transparent 60%)", pointerEvents: "none" }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Current Target</h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>{currentMonthISO} Achievement</p>
              </div>
              <div className="icon-box" style={{ width: 40, height: 40, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", boxShadow: "0 4px 12px rgba(245,158,11,0.25)" }}>
                <Target size={20} strokeWidth={2.5} />
              </div>
            </div>

            {targetInfo ? (
              <>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Progress</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{targetPct}%</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>Target: {fmt(targetInfo.targetValue)}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#10b981" }}>Achieved: {fmt(targetInfo.achieved)}</div>
                    </div>
                  </div>
                  <div className="progress-bg" style={{ height: 12 }}>
                    <div className="progress-bar" style={{ width: `${targetPct}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.03)", borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Pending Req.</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>{fmt(targetInfo.pending)}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.03)", borderRadius: 16, padding: 16 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Payments</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{targetInfo.actualPayments} <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>/ {targetInfo.payments || "—"}</span></div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, background: "rgba(255,255,255,0.4)", borderRadius: 16, border: "1px dashed rgba(0,0,0,0.1)" }}>
                <Target size={32} color="#cbd5e1" strokeWidth={1.5} style={{ marginBottom: 12 }} />
                <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>No target assigned for this month</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CHARTS & RATIOS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 32, alignItems: "start" }}>
        
        {/* Revenue Growth Chart */}
        <div className="glass-card" style={{ padding: 32, animationDelay: "0.6s", height: 420, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Growth Trajectory</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>Revenue trend over recent months</p>
            </div>
            <div className="icon-box" style={{ width: 40, height: 40, background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {lastTwoMonthsData.length > 0 ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>No chart data yet</div>
            )}
          </div>
        </div>

        {/* Default Ratio */}
        <div className="glass-card" style={{ padding: 32, animationDelay: "0.7s", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>Risk Analysis</h2>
            <div className="icon-box" style={{ width: 40, height: 40, background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}>
              <Activity size={20} strokeWidth={2.5} />
            </div>
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <PremiumRing pct={Number(overallRatio)} size={160} />
            
            <div style={{ marginTop: 32, padding: "8px 16px", background: ratioBg(overallRatio), borderRadius: 999, border: `1px solid ${ratioFg(overallRatio)}40` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: ratioFg(overallRatio), display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ratioFg(overallRatio), boxShadow: `0 0 8px ${ratioFg(overallRatio)}` }} />
                {ratioLabel(overallRatio)} Status
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MONTHLY DEFAULT TABLE ── */}
      {monthlyDefaultStats.length > 0 && (
        <div className="glass-card" style={{ animationDelay: "0.8s" }}>
          <div style={{ padding: "28px 32px", borderBottom: "1px solid rgba(0,0,0,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>Historical Performance</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 500 }}>Month-by-month breakdown</p>
            </div>
            <div className="icon-box" style={{ width: 40, height: 40, background: "rgba(15,23,42,0.05)", color: "#334155" }}>
              <PieChart size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="premium-table">
              <thead>
                <tr>
                  {["Period", "Booked", "Credited", "Pending", "Default Ratio", "Health"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyDefaultStats.map((row) => (
                  <tr key={row.month}>
                    <td style={{ color: "#0f172a", fontWeight: 700 }}>{row.month}</td>
                    <td>{fmt(row.booked)}</td>
                    <td style={{ color: "#10b981" }}>{fmt(row.credited)}</td>
                    <td style={{ color: "#f59e0b" }}>{fmt(row.pending)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: ratioFg(row.ratio), minWidth: 45 }}>{row.ratio}%</span>
                        <div className="progress-bg" style={{ flex: 1, minWidth: 60, height: 6, background: "rgba(0,0,0,0.04)" }}>
                          <div className="progress-bar" style={{ width: `${Math.min(row.ratio, 100)}%`, height: "100%", background: ratioGrad(row.ratio) }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: ratioBg(row.ratio), color: ratioFg(row.ratio), fontSize: 12, fontWeight: 700 }}>
                        {ratioLabel(row.ratio)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
