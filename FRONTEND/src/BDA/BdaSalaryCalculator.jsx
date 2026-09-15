import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import API from "../API";
import {
  IndianRupee,
  Target,
  TrendingUp,
  Award,
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle,
  Percent,
} from "lucide-react";

/* ─── Injected Styles ─────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .sc-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }

  .sc-root {
    margin-left: 270px;
    background-color: #fafcff;
    background-image:
      radial-gradient(at 10% 20%, hsla(250,100%,94%,1) 0px, transparent 50%),
      radial-gradient(at 90% 10%, hsla(189,100%,90%,1) 0px, transparent 50%),
      radial-gradient(at 50% 80%, hsla(142,100%,94%,1) 0px, transparent 50%);
    background-attachment: fixed;
    min-height: 100vh;
    padding: 32px 40px 80px;
    position: relative;
    overflow-x: hidden;
  }

  @keyframes sc-slide-up {
    0%  { opacity: 0; transform: translateY(20px); }
    100%{ opacity: 1; transform: translateY(0);    }
  }

  @keyframes sc-pop {
    0%  { opacity: 0; transform: scale(0.9); }
    100%{ opacity: 1; transform: scale(1);   }
  }

  .sc-glass {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    border-radius: 24px;
    animation: sc-slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    overflow: hidden;
  }

  .sc-result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    animation: sc-pop 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }

  .sc-stat {
    border-radius: 18px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sc-progress-bar-outer {
    height: 10px; border-radius: 999px; overflow: hidden;
    background: rgba(0,0,0,0.06);
  }
  .sc-progress-bar-inner {
    height: 100%; border-radius: 999px;
    transition: width 1.2s cubic-bezier(0.22,1,0.36,1);
  }

  .sc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 999px;
    font-size: 13px; font-weight: 700;
  }

  .sc-formula-box {
    background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(79,70,229,0.04));
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 16px;
    padding: 20px 24px;
    margin-top: 8px;
  }
  .sc-formula-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed rgba(0,0,0,0.06);
    font-size: 14px;
  }
  .sc-formula-item:last-child { border-bottom: none; }

  @media (max-width: 768px) {
    .sc-root { margin-left: 0; padding: 20px; }
    .sc-glass { padding: 20px; }
  }

  .sc-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 12px;
    border-radius: 999px;
    background: #e2e8f0;
    outline: none;
    margin: 24px 0;
  }
  .sc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    border: 4px solid #fff;
    box-shadow: 0 4px 10px rgba(99,102,241,0.4);
    transition: transform 0.1s;
  }
  .sc-slider::-webkit-slider-thumb:active {
    transform: scale(1.15);
  }
`;

/* ─── Formatter ────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const BdaSalaryCalculator = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [simulatedRevenue, setSimulatedRevenue] = useState(0);
  
  // Default to current month "YYYY-MM"
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  useEffect(() => {
    fetchSalaryData(selectedMonth);
  }, [selectedMonth]);

  const fetchSalaryData = async (monthStr) => {
    try {
      setLoading(true);
      const bdaName = localStorage.getItem("bdaName");
      if (!bdaName) {
        setError("BDA identity not found. Please log in again.");
        return;
      }
      const res = await axios.get(`${API}/api/bda/${bdaName}/salary-formula?month=${monthStr}`, {
        withCredentials: true,
      });
      
      const formula = res.data.formula;
      const revenue = res.data.creditedRevenue;
      setData({ formula, revenue });
      setResult(computeSalaryStats(formula, revenue));
    } catch (err) {
      console.error("Error fetching salary:", err);
      if (err.response?.status === 404) {
        setError("No salary formula assigned to your account.");
      } else {
        setError("Failed to load salary configuration.");
      }
    } finally {
      setLoading(false);
    }
  };

  const computeSalaryStats = (formula, revenue) => {
    const T = formula.target;
    const B = formula.basePay;
    const I = formula.incentives;
    const minPct = formula.minPercent;
    const R = revenue;

    const achievedPct = T > 0 ? (R / T) * 100 : 0;
    const minRevenue = (minPct / 100) * T;

    let earnedBasePay = 0;
    let earnedIncentives = 0;
    let salaryStatus = "not_eligible";

    if (achievedPct < minPct) {
      earnedBasePay = T > 0 ? (R / T) * B : 0;
      earnedIncentives = 0;
      salaryStatus = "not_eligible";
    } else {
      earnedBasePay = B;
      const incentiveRange = 100 - minPct;
      const achievedAboveMin = Math.min(achievedPct, 100) - minPct;
      const incentivePct = incentiveRange > 0 ? achievedAboveMin / incentiveRange : 1;
      earnedIncentives = Math.min(incentivePct, 1) * I;
      salaryStatus = "base_and_incentive";
    }

    const totalSalary = earnedBasePay + earnedIncentives;

    return {
      T, B, I, minPct, R,
      formulaName: formula.name,
      achievedPct: Math.min(achievedPct, 999.9).toFixed(2),
      minRevenue,
      earnedBasePay,
      earnedIncentives,
      totalSalary,
      salaryStatus,
    };
  };

  const simResult = data ? computeSalaryStats(data.formula, simulatedRevenue) : null;

  if (loading) {
    return <div className="sc-root"><div style={{ padding: 40, textAlign: "center", fontWeight: 700, color: "#64748b" }}>Loading your salary details...</div></div>;
  }

  if (error) {
    return (
      <div className="sc-root">
        <div className="sc-glass" style={{ padding: 40, textAlign: "center" }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ color: "#0f172a", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>Formula Not Found</h2>
          <p style={{ color: "#64748b", fontSize: 16 }}>{error}</p>
        </div>
      </div>
    );
  }

  const statusColor = result
    ? result.salaryStatus === "not_eligible"
      ? { fg: "#ef4444", bg: "rgba(239,68,68,0.1)", grad: "linear-gradient(135deg,#f87171,#ef4444)" }
      : { fg: "#10b981", bg: "rgba(16,185,129,0.1)", grad: "linear-gradient(135deg,#34d399,#10b981)" }
    : null;

  const statusLabel = result
    ? result.salaryStatus === "not_eligible"
      ? "Below Minimum — Proportional Only"
      : "Eligible — Base Pay + Incentives"
    : "";

  return (
    <div className="sc-root">
      <style>{STYLES}</style>

      {/* HEADER */}
      <div style={{ marginBottom: 40, animation: "sc-slide-up 0.45s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          }}>
            <Calculator size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            My Salary
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.03em" }}>
              Earnings <span style={{ color: "#6366f1" }}>Tracker</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0", fontWeight: 500 }}>
              Your estimated earnings for the selected month based on credited revenue.
            </p>
          </div>
          <div>
            <input 
              type="month" 
              max={currentMonthStr}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: "1.5px solid rgba(0,0,0,0.1)",
                outline: "none",
                fontSize: "15px",
                fontWeight: "600",
                color: "#0f172a",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                cursor: "pointer"
              }}
            />
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Main Info Card */}
          <div className="sc-glass" style={{ padding: 36, marginBottom: 28, animationDelay: "0.1s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  Estimated Salary
                </div>
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                  Assigned Formula: <strong style={{ color: "#6366f1" }}>{result.formulaName}</strong>
                </div>
              </div>
              <span className="sc-badge" style={{
                background: statusColor.bg, color: statusColor.fg,
                border: `1px solid ${statusColor.fg}30`,
              }}>
                {result.salaryStatus === "not_eligible" ? <XCircle size={14} /> : <CheckCircle size={14} />}
                {statusLabel}
              </span>
            </div>

            {/* Achievement Progress */}
            <div style={{ marginBottom: 30 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Target Achievement ({fmt(result.R)} / {fmt(result.T)})
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: statusColor.fg }}>
                  {result.achievedPct}%
                </span>
              </div>
              <div className="sc-progress-bar-outer">
                <div className="sc-progress-bar-inner" style={{
                  width: `${Math.min(parseFloat(result.achievedPct), 100)}%`,
                  background: statusColor.grad,
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>0%</span>
                <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>
                  Min Threshold: {result.minPct}% ({fmt(result.minRevenue)})
                </span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>100%</span>
              </div>
            </div>

            {/* Eligibility alert for below-threshold */}
            {result.salaryStatus === "not_eligible" && (
              <div style={{
                background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 14, padding: "14px 20px",
                display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 28,
              }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>
                    Below Minimum Threshold ({result.minPct}%)
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 3, fontWeight: 500 }}>
                    You have not yet reached the minimum {result.minPct}% ({fmt(result.minRevenue)}) required
                    to unlock full base pay &amp; incentives. Keep pushing!
                  </div>
                </div>
              </div>
            )}

            {/* Stat Cards */}
            <div className="sc-result-grid">
              <div className="sc-stat" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(79,70,229,0.05))", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>Base Pay Earned</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IndianRupee size={14} color="#fff" strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{fmt(result.earnedBasePay)}</div>
                <div style={{ fontSize: 12, color: result.salaryStatus === "not_eligible" ? "#94a3b8" : "#10b981", fontWeight: 600 }}>
                  {result.salaryStatus === "not_eligible" ? `Proportional: ${result.achievedPct}% of ${fmt(result.B)}` : "✓ Full base pay unlocked"}
                </div>
              </div>

              <div className="sc-stat" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.05))", border: "1px solid rgba(16,185,129,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>Incentives Earned</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={14} color="#fff" strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{fmt(result.earnedIncentives)}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                  {result.salaryStatus === "not_eligible" ? "Not eligible yet" : `${((Math.min(parseFloat(result.achievedPct), 100) - result.minPct) / (100 - result.minPct) * 100).toFixed(1)}% of max incentive`}
                </div>
              </div>

              <div className="sc-stat" style={{ background: statusColor.bg, border: `1px solid ${statusColor.fg}25` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: statusColor.fg, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Salary</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: statusColor.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={14} color="#fff" strokeWidth={2.5} />
                  </div>
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: statusColor.fg, letterSpacing: "-0.03em" }}>{fmt(result.totalSalary)}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Base + Incentives</div>
              </div>
            </div>

            <div style={{ marginTop: 24, fontSize: 13, color: "#64748b", textAlign: "center", fontWeight: 500, background: "rgba(0,0,0,0.02)", padding: 12, borderRadius: 12 }}>
              * Note: Final calculation is based on the attendance. For more details, contact your HR.
            </div>
          </div>
          
          <div className="sc-glass" style={{ padding: 32, display: "flex", gap: 32 }}>
             {/* Configuration Breakdown Table */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.01em" }}>
                Formula Breakdown
              </div>
              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.03)" }}>
                      <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>Parameter</th>
                      <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>Configured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { param: "Monthly Target", val: fmt(result.T) },
                      { param: "Minimum Threshold", val: `${result.minPct}%` },
                      { param: "Max Base Pay", val: fmt(result.B) },
                      { param: "Max Incentives", val: fmt(result.I) },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a" }}>{row.param}</td>
                        <td style={{ padding: "14px 20px", color: "#475569", fontWeight: 600 }}>{row.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rules explanation */}
            <div style={{ flex: 1 }}>
              <div className="sc-formula-box" style={{ height: "100%", marginTop: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#4f46e5", marginBottom: 16 }}>
                  📐 How is this calculated?
                </div>
                <div className="sc-formula-item">
                  <span style={{ color: "#64748b", fontWeight: 500 }}>If achieved &lt; {result.minPct}%</span>
                  <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>Proportional Base Pay</span>
                </div>
                <div className="sc-formula-item">
                  <span style={{ color: "#64748b", fontWeight: 500 }}>If achieved ≥ {result.minPct}%</span>
                  <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>Full Base Pay ✓</span>
                </div>
                <div className="sc-formula-item">
                  <span style={{ color: "#64748b", fontWeight: 500 }}>From {result.minPct}% to 100%</span>
                  <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 13 }}>Proportional Incentives</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR SECTION */}
          {simResult && (
            <div className="sc-glass" style={{ padding: 36, marginTop: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                    What-If Simulator
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                    Drag the slider to see how much you could earn by hitting different revenue targets!
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "10px 20px", borderRadius: 16 }}>
                  Revenue: {fmt(simulatedRevenue)}
                </div>
              </div>

              <input 
                type="range" 
                min="0" 
                max={result.T} 
                step="1000"
                value={simulatedRevenue}
                onChange={(e) => setSimulatedRevenue(Number(e.target.value))}
                className="sc-slider"
                style={{ background: `linear-gradient(to right, #6366f1 ${(simulatedRevenue / result.T) * 100}%, #e2e8f0 ${(simulatedRevenue / result.T) * 100}%)` }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 12, fontWeight: 700, marginBottom: 32 }}>
                <span>₹0</span>
                <span style={{ color: simulatedRevenue >= result.minRevenue ? "#10b981" : "#f59e0b" }}>Min Threshold ({fmt(result.minRevenue)})</span>
                <span style={{ color: simulatedRevenue >= result.T ? "#10b981" : "#64748b" }}>Target ({fmt(result.T)})</span>
              </div>

              <div className="sc-result-grid">
                <div className="sc-stat" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Base Pay Earned</span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{fmt(simResult.earnedBasePay)}</div>
                </div>
                <div className="sc-stat" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Incentives Earned</span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{fmt(simResult.earnedIncentives)}</div>
                </div>
                <div className="sc-stat" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(79,70,229,0.08))", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase" }}>Total Simulated Salary</span>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{fmt(simResult.totalSalary)}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BdaSalaryCalculator;
