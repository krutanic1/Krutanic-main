import React, { useState } from "react";
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
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    border-radius: 24px;
    animation: sc-slide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    overflow: hidden;
  }

  .sc-card {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    border-radius: 20px;
    padding: 28px;
    transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);
  }
  .sc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1);
  }

  .sc-input-wrap { display: flex; flex-direction: column; gap: 6px; }
  .sc-label {
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 6px;
  }
  .sc-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 14px;
    border: 1.5px solid rgba(0,0,0,0.08);
    background: rgba(255,255,255,0.8);
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    outline: none;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  .sc-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    background: #fff;
  }
  .sc-input::placeholder { color: #94a3b8; font-weight: 500; }

  .sc-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px 32px;
    border-radius: 14px;
    font-size: 15px; font-weight: 700;
    cursor: pointer; border: none;
    transition: all 0.25s cubic-bezier(0.25,0.8,0.25,1);
    letter-spacing: 0.01em;
  }
  .sc-btn-primary {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
  }
  .sc-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(99,102,241,0.45);
  }
  .sc-btn-reset {
    background: rgba(239,68,68,0.08);
    color: #ef4444;
    border: 1.5px solid rgba(239,68,68,0.2);
  }
  .sc-btn-reset:hover {
    background: rgba(239,68,68,0.14);
    transform: translateY(-2px);
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

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

/* ─── Formatter ────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

/* ─── Salary Calculator ─────────────────────────────────────────── */
const SalaryCalculator = () => {
  const [target, setTarget] = useState("110000");
  const [basePay, setBasePay] = useState("15000");
  const [incentives, setIncentives] = useState("10000");
  const [minPercent, setMinPercent] = useState("70");
  const [revenueAchieved, setRevenueAchieved] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const T = parseFloat(target);
    const B = parseFloat(basePay);
    const I = parseFloat(incentives);
    const minPct = parseFloat(minPercent);
    const R = parseFloat(revenueAchieved);

    if (!T || !B || !I || !minPct || isNaN(R) || T <= 0) {
      alert("Please fill in all fields with valid numbers.");
      return;
    }

    const achievedPct = (R / T) * 100;
    const minRevenue = (minPct / 100) * T;

    let earnedBasePay = 0;
    let earnedIncentives = 0;
    let salaryStatus = "not_eligible";

    if (achievedPct < minPct) {
      // Below minimum: proportional base pay only
      earnedBasePay = (R / T) * B;
      earnedIncentives = 0;
      salaryStatus = "not_eligible";
    } else {
      // At or above minimum: full base pay + proportional incentives
      earnedBasePay = B;
      const incentiveRange = 100 - minPct;
      const achievedAboveMin = Math.min(achievedPct, 100) - minPct;
      const incentivePct = incentiveRange > 0 ? achievedAboveMin / incentiveRange : 1;
      earnedIncentives = Math.min(incentivePct, 1) * I;
      salaryStatus = "base_and_incentive";
    }

    const totalSalary = earnedBasePay + earnedIncentives;

    setResult({
      T, B, I, minPct, R,
      achievedPct: Math.min(achievedPct, 999.9).toFixed(2),
      minRevenue,
      earnedBasePay,
      earnedIncentives,
      totalSalary,
      salaryStatus,
    });
  };

  const handleReset = () => {
    setTarget("110000");
    setBasePay("15000");
    setIncentives("10000");
    setMinPercent("70");
    setRevenueAchieved("");
    setResult(null);
  };

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
            Mentorship
          </span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.03em" }}>
          Salary <span style={{ color: "#6366f1" }}>Calculator</span>
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0", fontWeight: 500 }}>
          Configure targets &amp; thresholds, then enter achieved revenue to compute salary.
        </p>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>

        {/* Admin Config */}
        <div className="sc-glass" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
            }}>
              <Target size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Admin Configuration</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Set targets, pay structure &amp; threshold</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="sc-input-wrap">
              <label className="sc-label"><Target size={13} /> Monthly Target (₹)</label>
              <input id="sc-target" type="number" min="0" className="sc-input"
                placeholder="e.g. 100000" value={target}
                onChange={(e) => setTarget(e.target.value)} />
            </div>

            <div className="sc-input-wrap">
              <label className="sc-label"><IndianRupee size={13} /> Base Pay (₹)</label>
              <input id="sc-basepay" type="number" min="0" className="sc-input"
                placeholder="e.g. 15000" value={basePay}
                onChange={(e) => setBasePay(e.target.value)} />
            </div>

            <div className="sc-input-wrap">
              <label className="sc-label"><TrendingUp size={13} /> Incentives (₹)</label>
              <input id="sc-incentives" type="number" min="0" className="sc-input"
                placeholder="e.g. 10000" value={incentives}
                onChange={(e) => setIncentives(e.target.value)} />
            </div>

            <div className="sc-input-wrap">
              <label className="sc-label"><Percent size={13} /> Minimum % to Earn Base Pay</label>
              <input id="sc-minpct" type="number" min="1" max="100" className="sc-input"
                placeholder="e.g. 70" value={minPercent}
                onChange={(e) => setMinPercent(e.target.value)} />
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                Must achieve at least {minPercent || "—"}% of target to qualify for full base pay.
              </span>
            </div>
          </div>
        </div>

        {/* Employee Achievement */}
        <div className="sc-glass" style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            }}>
              <Award size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Employee Achievement</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Enter the actual revenue achieved</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="sc-input-wrap">
              <label className="sc-label"><IndianRupee size={13} /> Revenue Achieved (₹)</label>
              <input id="sc-revenue" type="number" min="0" className="sc-input"
                placeholder="e.g. 70000" value={revenueAchieved}
                onChange={(e) => setRevenueAchieved(e.target.value)} />
            </div>

            {/* Formula explanation */}
            <div className="sc-formula-box">
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4f46e5", marginBottom: 12 }}>
                📐 Salary Formula
              </div>
              <div className="sc-formula-item">
                <span style={{ color: "#64748b", fontWeight: 500 }}>If achieved &lt; {minPercent || "min"}%</span>
                <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>Base × (Revenue / Target)</span>
              </div>
              <div className="sc-formula-item">
                <span style={{ color: "#64748b", fontWeight: 500 }}>If achieved ≥ {minPercent || "min"}%</span>
                <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>Full Base Pay ✓</span>
              </div>
              <div className="sc-formula-item">
                <span style={{ color: "#64748b", fontWeight: 500 }}>Incentive range ({minPercent || "min"}% → 100%)</span>
                <span style={{ color: "#6366f1", fontWeight: 700, fontSize: 13 }}>incentives</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <button id="sc-calculate-btn" className="sc-btn sc-btn-primary" style={{ flex: 1 }}
              onClick={handleCalculate}>
              <Calculator size={18} /> Calculate Salary
            </button>
            <button id="sc-reset-btn" className="sc-btn sc-btn-reset" onClick={handleReset}>
              Reset
            </button>
          </div>
          
          <div style={{ marginTop: 16, fontSize: 13, color: "#64748b", textAlign: "center", fontWeight: 500 }}>
            * Note: Final calculation is based on the attendance. For more details, contact your HR.
          </div>
        </div>
      </div>

      {/* RESULT SECTION */}
      {result && (
        <div className="sc-glass" style={{ padding: 36, animationDelay: "0.1s" }}>
          {/* Result Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                Salary Breakdown
              </div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
                Based on <strong style={{ color: "#0f172a" }}>{result.achievedPct}%</strong> achievement
                ({fmt(result.R)} of {fmt(result.T)})
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
                Target Achievement
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
                Min: {result.minPct}% ({fmt(result.minRevenue)})
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
                  Employee did not achieve the minimum {result.minPct}% ({fmt(result.minRevenue)}) to qualify
                  for full base pay &amp; incentives. Proportional base pay of{" "}
                  <strong>{fmt(result.earnedBasePay)}</strong> calculated instead.
                </div>
              </div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="sc-result-grid">
            <div className="sc-stat" style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(79,70,229,0.05))",
              border: "1px solid rgba(99,102,241,0.15)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Base Pay Earned
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IndianRupee size={14} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                {fmt(result.earnedBasePay)}
              </div>
              <div style={{ fontSize: 12, color: result.salaryStatus === "not_eligible" ? "#94a3b8" : "#10b981", fontWeight: 600 }}>
                {result.salaryStatus === "not_eligible"
                  ? `Proportional: ${result.achievedPct}% of ${fmt(result.B)}`
                  : "✓ Full base pay unlocked"}
              </div>
            </div>

            <div className="sc-stat" style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.05))",
              border: "1px solid rgba(16,185,129,0.15)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Incentives Earned
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={14} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                {fmt(result.earnedIncentives)}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                {result.salaryStatus === "not_eligible"
                  ? "Not eligible (below min threshold)"
                  : `${((Math.min(parseFloat(result.achievedPct), 100) - result.minPct) / (100 - result.minPct) * 100).toFixed(1)}% of max incentive`}
              </div>
            </div>

            <div className="sc-stat" style={{
              background: statusColor.bg,
              border: `1px solid ${statusColor.fg}25`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: statusColor.fg, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Total Salary
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: statusColor.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award size={14} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: statusColor.fg, letterSpacing: "-0.03em" }}>
                {fmt(result.totalSalary)}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Base + Incentives</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Detailed Breakdown
            </div>
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.03)" }}>
                    {["Parameter", "Configured", "Achieved / Earned"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { param: "Target", configured: fmt(result.T), earned: `${fmt(result.R)} (${result.achievedPct}%)` },
                    { param: "Minimum Threshold", configured: `${result.minPct}%`, earned: fmt(result.minRevenue) },
                    { param: "Base Pay", configured: fmt(result.B), earned: fmt(result.earnedBasePay) },
                    { param: "Incentives", configured: fmt(result.I), earned: fmt(result.earnedIncentives) },
                    { param: "Total Salary", configured: fmt(result.B + result.I), earned: fmt(result.totalSalary) },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a" }}>{row.param}</td>
                      <td style={{ padding: "14px 20px", color: "#475569", fontWeight: 600 }}>{row.configured}</td>
                      <td style={{ padding: "14px 20px", fontWeight: 700, color: i === 4 ? statusColor.fg : "#0f172a" }}>
                        {row.earned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryCalculator;
