import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import API from "../API";
import {
  Calculator,
  Target,
  IndianRupee,
  TrendingUp,
  Percent,
  Plus,
  Users,
  CheckCircle,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .asf-root * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
  .asf-root {
    margin-left: 270px;
    background-color: #fafcff;
    min-height: 100vh;
    padding: 32px 40px 80px;
  }
  .asf-glass {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 24px;
  }
  .asf-input-wrap { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .asf-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 6px; }
  .asf-input { width: 100%; padding: 12px 16px; border-radius: 14px; border: 1.5px solid rgba(0,0,0,0.08); background: rgba(255,255,255,0.8); font-size: 15px; font-weight: 600; color: #0f172a; outline: none; transition: all 0.2s; }
  .asf-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); background: #fff; }
  .asf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 32px; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer; border: none; transition: all 0.25s; }
  .asf-btn-primary { background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; box-shadow: 0 6px 20px rgba(99,102,241,0.35); }
  .asf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(99,102,241,0.45); }
  .asf-formula-card { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 24px; transition: all 0.3s; }
  .asf-formula-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); }
  .asf-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
  .asf-modal { background: #fff; border-radius: 24px; padding: 32px; width: 500px; max-width: 90vw; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
  .asf-bda-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
  .asf-bda-item:hover { background: #f8fafc; }
  .asf-bda-selected { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); }
`;

const AdminSalaryFormulas = () => {
  const [formulas, setFormulas] = useState([]);
  const [bdas, setBdas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [basePay, setBasePay] = useState("");
  const [incentives, setIncentives] = useState("");
  const [minPercent, setMinPercent] = useState("");

  // Modal State
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBdas, setSelectedBdas] = useState([]); // Array of BDA IDs
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [overviewData, setOverviewData] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(false);

  useEffect(() => {
    fetchFormulas();
    fetchBdas();
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [selectedMonth]);

  const fetchOverview = async () => {
    try {
      setOverviewLoading(true);
      const res = await axios.get(`${API}/api/admin/bda-salaries-overview?month=${selectedMonth}`, { withCredentials: true });
      setOverviewData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchFormulas = async () => {
    try {
      const res = await axios.get(`${API}/api/salary-formula`, { withCredentials: true });
      setFormulas(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load formulas");
    }
  };

  const fetchBdas = async () => {
    try {
      const res = await axios.get(`${API}/api/active-bdas`, { withCredentials: true });
      setBdas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateFormula = async (e) => {
    e.preventDefault();
    if (!name || !target || !basePay || !incentives || !minPercent) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);
      await axios.post(`${API}/api/salary-formula`, {
        name,
        target: Number(target),
        basePay: Number(basePay),
        incentives: Number(incentives),
        minPercent: Number(minPercent)
      }, { withCredentials: true });
      
      toast.success("Formula created successfully");
      // Reset form
      setName(""); setTarget(""); setBasePay(""); setIncentives(""); setMinPercent("");
      fetchFormulas();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create formula");
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (formula) => {
    setSelectedFormula(formula);
    setSelectedBdas(formula.assignedBDAs.map(b => b._id));
    setIsAssignModalOpen(true);
  };

  const toggleBdaSelection = (bdaId) => {
    setSelectedBdas(prev => 
      prev.includes(bdaId) ? prev.filter(id => id !== bdaId) : [...prev, bdaId]
    );
  };

  const handleAssignBdas = async () => {
    try {
      await axios.put(`${API}/api/salary-formula/${selectedFormula._id}/assign`, {
        bdaIds: selectedBdas
      }, { withCredentials: true });
      
      toast.success("Assigned successfully");
      setIsAssignModalOpen(false);
      fetchFormulas();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign formula");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this formula?")) return;
    try {
      await axios.delete(`${API}/api/salary-formula/${id}`, { withCredentials: true });
      toast.success("Deleted successfully");
      fetchFormulas();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete formula");
    }
  };

  const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="asf-root">
      <style>{STYLES}</style>
      <Toaster position="top-center" />

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
            <Calculator size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>Salary Configurations</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: 0 }}>Salary <span style={{ color: "#6366f1" }}>Formulas</span></h1>
        <p style={{ color: "#64748b", fontSize: 15, margin: "6px 0 0", fontWeight: 500 }}>Create custom salary formulas and assign them to BDAs.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        
        {/* Create Form */}
        <div className="asf-glass">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Create New Formula</h2>
          <form onSubmit={handleCreateFormula}>
            <div className="asf-input-wrap">
              <label className="asf-label">Formula Name (e.g. Intern)</label>
              <input type="text" className="asf-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="asf-input-wrap">
              <label className="asf-label"><Target size={13} /> Target (₹)</label>
              <input type="number" className="asf-input" placeholder="100000" value={target} onChange={(e) => setTarget(e.target.value)} required />
            </div>
            <div className="asf-input-wrap">
              <label className="asf-label"><IndianRupee size={13} /> Base Pay (₹)</label>
              <input type="number" className="asf-input" placeholder="15000" value={basePay} onChange={(e) => setBasePay(e.target.value)} required />
            </div>
            <div className="asf-input-wrap">
              <label className="asf-label"><TrendingUp size={13} /> Incentives (₹)</label>
              <input type="number" className="asf-input" placeholder="10000" value={incentives} onChange={(e) => setIncentives(e.target.value)} required />
            </div>
            <div className="asf-input-wrap">
              <label className="asf-label"><Percent size={13} /> Minimum Threshold %</label>
              <input type="number" className="asf-input" placeholder="70" value={minPercent} onChange={(e) => setMinPercent(e.target.value)} required />
            </div>
            <button type="submit" className="asf-btn asf-btn-primary" style={{ width: "100%", marginTop: 10 }} disabled={loading}>
              <Plus size={18} /> Create Formula
            </button>
          </form>
        </div>

        {/* List of Formulas */}
        <div className="asf-glass">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Saved Formulas</h2>
          {formulas.length === 0 ? (
            <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>No formulas created yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {formulas.map((formula) => (
                <div key={formula._id} className="asf-formula-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{formula.name}</h3>
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{formula.assignedBDAs?.length || 0} BDAs assigned</span>
                    </div>
                    <button onClick={() => handleDelete(formula._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Delete</button>
                  </div>
                  
                  <div style={{ fontSize: 13, color: "#475569", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Target:</span> <strong>{fmt(formula.target)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Base Pay:</span> <strong style={{ color: "#10b981" }}>{fmt(formula.basePay)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Incentives:</span> <strong style={{ color: "#6366f1" }}>{fmt(formula.incentives)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Threshold:</span> <strong>{formula.minPercent}%</strong></div>
                  </div>
                  
                  <button onClick={() => openAssignModal(formula)} className="asf-btn" style={{ width: "100%", background: "#f1f5f9", color: "#0f172a", padding: "10px", fontSize: 13 }}>
                    <Users size={16} /> Assign to BDAs
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview Table */}
      <div className="asf-glass" style={{ marginTop: 24, padding: "30px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>BDA Salaries Overview</h2>
            <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0", fontWeight: 500 }}>
              Live preview of calculated salaries for the selected month.
            </p>
          </div>
          <div>
            <input 
              type="month" 
              max={currentMonthStr}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(0,0,0,0.1)",
                outline: "none",
                fontSize: "14px",
                fontWeight: "600",
                color: "#0f172a",
                background: "rgba(255,255,255,0.7)",
                cursor: "pointer"
              }}
            />
          </div>
        </div>

        {overviewLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>Loading overview...</div>
        ) : overviewData.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontWeight: 600 }}>No BDAs are currently assigned to any active formula.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>BDA</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#475569", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>Formula</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", color: "#475569", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>Target Achieved</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", color: "#475569", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>Base Pay</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", color: "#475569", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>Incentives</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", color: "#6366f1", fontWeight: 800, textTransform: "uppercase", fontSize: 12 }}>Total Salary</th>
                </tr>
              </thead>
              <tbody>
                {overviewData.map((row) => (
                  <tr key={row.bdaId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "16px", fontWeight: 600, color: "#0f172a" }}>
                      <div>{row.bdaName}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{row.bdaEmail}</div>
                    </td>
                    <td style={{ padding: "16px", color: "#64748b", fontWeight: 600 }}>
                      <span className="asf-badge" style={{ background: "#eef2ff", color: "#4f46e5" }}>{row.formulaName}</span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{fmt(row.revenue)}</div>
                      <div style={{ fontSize: 12, color: row.achievedPct >= 100 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{row.achievedPct}%</div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: 600, color: "#475569" }}>{fmt(row.basePay)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: 600, color: "#475569" }}>{fmt(row.incentives)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: 800, color: "#4f46e5", fontSize: 15 }}>{fmt(row.totalSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && selectedFormula && (
        <div className="asf-modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="asf-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Assign '{selectedFormula?.name}'</h2>
              <button onClick={() => setIsAssignModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: 24 }}>
              {bdas.length === 0 ? (
                <div style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}>No active BDAs found.</div>
              ) : (
                bdas.map(bda => (
                  <div 
                    key={bda._id} 
                    className={`asf-bda-item ${selectedBdas.includes(bda._id) ? 'asf-bda-selected' : ''}`}
                    onClick={() => toggleBdaSelection(bda._id)}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{bda.fullname}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{bda.email}</div>
                    </div>
                    {selectedBdas.includes(bda._id) && <CheckCircle size={18} color="#6366f1" />}
                  </div>
                ))
              )}
            </div>
            
            <button onClick={handleAssignBdas} className="asf-btn asf-btn-primary" style={{ width: "100%" }}>
              Save Assignments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalaryFormulas;
