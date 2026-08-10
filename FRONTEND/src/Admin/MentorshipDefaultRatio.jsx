import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import API from "../API";
import { 
  Users, 
  Activity, 
  CalendarDays, 
  TrendingDown, 
  IndianRupee,
  Layers,
  PieChart,
  BarChart3
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const calcRatio = (booked, credited) => {
  if (!booked || booked === 0) return 0;
  return Math.max(0, (((booked - credited) / booked) * 100).toFixed(1));
};

const ratioFg = (pct) => (pct <= 10 ? "#10b981" : pct <= 25 ? "#f59e0b" : "#ef4444");
const ratioBg = (pct) => (pct <= 10 ? "rgba(16,185,129,0.1)" : pct <= 25 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)");
const ratioGrad = (pct) => (pct <= 10 ? "linear-gradient(135deg, #34d399, #10b981)" : pct <= 25 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #f87171, #ef4444)");
const ratioLabel = (pct) =>
  pct <= 10 ? "Healthy" : pct <= 25 ? "Moderate" : "High Default";

const todayYM = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

/* ─── injected styles ─────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .mdr-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }

  .mdr-root {
    margin-left: 270px;
    background-color: #fafcff;
    background-image: 
      radial-gradient(at 10% 20%, hsla(250,100%,94%,1) 0px, transparent 50%),
      radial-gradient(at 90% 10%, hsla(189,100%,90%,1) 0px, transparent 50%),
      radial-gradient(at 50% 80%, hsla(355,100%,96%,1) 0px, transparent 50%);
    background-attachment: fixed;
    min-height: 100vh;
    padding: 32px 40px 80px;
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

  .stat-card-hover { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
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

  .mdr-btn {
    transition: all .2s ease;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .mdr-btn:hover { transform: translateY(-1px); }
  
  .mdr-tab-active {
    background: #6366f1;
    color: #fff;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  }
  .mdr-tab-inactive {
    background: rgba(255,255,255,0.6);
    color: #64748b;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .mdr-tab-inactive:hover {
    background: rgba(255,255,255,0.9);
    color: #334155;
  }

  .mdr-month-input {
    padding: 10px 16px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.7);
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    outline: none;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  .mdr-month-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }

  .progress-bg { background: #f1f5f9; border-radius: 999px; overflow: hidden; }
  .progress-bar { border-radius: 999px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

/* ─── Premium Ring ────────────────────────────────────────────── */
const PremiumRing = ({ pct, size = 130 }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const fg = ratioFg(pct);
  
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={fg} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </svg>
      <div style={{ position: "absolute", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>{pct}%</span>
        <span style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, fontWeight: 700 }}>Default</span>
      </div>
    </div>
  );
};

/* ─── main ─────────────────────────────────────────────────────── */
const MentorshipDefaultRatio = () => {
  const [selectedMonth, setSelectedMonth] = useState(todayYM());
  const [stats, setStats] = useState({ bdaStats: [], teamStats: [], dailyStats: [], totals: { totalBooked: 0, totalCredited: 0 } });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("team"); // bda, team, daily

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [y, m] = selectedMonth.split("-");
        const mName = new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", { month: "long" });
        
        // Use the new aggregation endpoint
        const res = await axios.get(`${API}/mentorship-default-agg`, {
          params: { month: mName, year: y },
          withCredentials: true,
        });
        setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedMonth]);

  /* ── totals ── */
  const { totalBooked = 0, totalCredited = 0 } = stats.totals || {};
  const totalPending = totalBooked - totalCredited;
  const overallRatio = calcRatio(totalBooked, totalCredited);
  const fg = ratioFg(overallRatio);

  /* ── tab data selector ── */
  let tableData = [];
  let nameLabel = "Name";
  if (activeTab === "bda") {
    tableData = stats.bdaStats || [];
    nameLabel = "Counselor Name";
  } else if (activeTab === "team") {
    tableData = stats.teamStats || [];
    nameLabel = "Team Name";
  } else if (activeTab === "daily") {
    tableData = stats.dailyStats || [];
    nameLabel = "Date";
  }

  return (
    <div className="mdr-root">
      <style>{STYLES}</style>

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, animation: "slide-up 0.5s ease-out" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #f43f5e, #e11d48)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(244,63,94,0.3)" }}>
              <TrendingDown size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", letterSpacing: "0.05em", textTransform: "uppercase" }}>Analysis</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.03em" }}>
            Default Ratio <span style={{ color: "#e11d48" }}>Dashboard</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0 0", fontWeight: 500 }}>
            Analyzing {monthLabel(selectedMonth)} performance natively using server aggregation.
          </p>
        </div>
        <div>
          <input
            type="month"
            className="mdr-month-input"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>
        
        {/* Left Side: Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-card stat-card-hover" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Total Booked</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{loading ? "..." : fmt(totalBooked)}</div>
            </div>
            <div className="icon-box" style={{ width: 48, height: 48, background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
              <IndianRupee size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="glass-card stat-card-hover" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Total Credited</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#10b981" }}>{loading ? "..." : fmt(totalCredited)}</div>
            </div>
            <div className="icon-box" style={{ width: 48, height: 48, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <Activity size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="glass-card stat-card-hover" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Total Pending</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#f59e0b" }}>{loading ? "..." : fmt(totalPending)}</div>
            </div>
            <div className="icon-box" style={{ width: 48, height: 48, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              <Layers size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Right Side: Master Ring */}
        <div className="glass-card" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 24px 0", letterSpacing: "-0.02em" }}>Overall Risk Level</h2>
          <PremiumRing pct={Number(overallRatio)} size={180} />
          <div style={{ marginTop: 24, padding: "8px 20px", background: ratioBg(overallRatio), borderRadius: 999, border: `1px solid ${fg}40` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: fg, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: fg, boxShadow: `0 0 10px ${fg}` }} />
              {ratioLabel(overallRatio)}
            </span>
          </div>
        </div>
      </div>

      {/* ── TABS & TABLE ── */}
      <div className="glass-card" style={{ animationDelay: "0.4s" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.04)", background: "rgba(255,255,255,0.4)" }}>
          <button 
            className={`mdr-btn ${activeTab === "team" ? "mdr-tab-active" : "mdr-tab-inactive"}`} 
            onClick={() => setActiveTab("team")}
          >
            <PieChart size={16} /> Team Wise
          </button>
          <button 
            className={`mdr-btn ${activeTab === "bda" ? "mdr-tab-active" : "mdr-tab-inactive"}`} 
            onClick={() => setActiveTab("bda")}
          >
            <Users size={16} /> BDA Wise
          </button>
          <button 
            className={`mdr-btn ${activeTab === "daily" ? "mdr-tab-active" : "mdr-tab-inactive"}`} 
            onClick={() => setActiveTab("daily")}
          >
            <CalendarDays size={16} /> Daily Trend
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>{nameLabel}</th>
                <th>Enrolls</th>
                <th>Booked</th>
                <th>Credited</th>
                <th>Pending</th>
                <th>Ratio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Aggregating data via MongoDB...</td></tr>
              ) : tableData.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No enrollments found for this month.</td></tr>
              ) : (
                tableData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: "#0f172a", fontWeight: 700 }}>{row.name || row.day}</td>
                    <td>{row.count}</td>
                    <td style={{ color: "#0f172a" }}>{fmt(row.booked)}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorshipDefaultRatio;
