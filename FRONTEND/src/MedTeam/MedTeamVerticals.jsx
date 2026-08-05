import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import MedTeamHeader from "./MedTeamHeader";
import VerticalEnrollmentsTable from "../components/VerticalEnrollmentsTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MedTeamVerticals = () => {
  const [verticals, setVerticals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const medTeamId = localStorage.getItem("medTeamId");

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (medTeamId) {
      fetchVerticals();
    } else {
      setError("Not authorized.");
    }
  }, [medTeamId, filterMonth, filterYear]);

  const fetchVerticals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/api/med-vertical/manager/${medTeamId}?month=${filterMonth}&year=${filterYear}`, { withCredentials: true });
      setVerticals(response.data);
    } catch (err) {
      console.error("Error fetching verticals:", err);
      setError("Failed to load your assigned verticals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="AdminAddCourse" className="p-8 bg-gray-50 min-h-screen">
        <div style={{ padding: "40px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2>My Assigned Verticals</h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontWeight: "bold" }}>Filter by Month:</label>
              <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                <option value="all">All Time</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              {filterMonth !== "all" && (
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              )}
            </div>
          </div>
          {error && <div className="error-message" style={{ color: "red", padding: "10px", backgroundColor: "#ffebee", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginTop: "20px" }}>
              {verticals.map(vertical => (
                <div key={vertical._id} style={{ 
                  background: "white", 
                  padding: "25px", 
                  borderRadius: "12px", 
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)", 
                  width: "100%"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "20px" }}>
                    <h3 style={{ margin: "0", color: "#1e293b", fontSize: "24px" }}>{vertical.name}</h3>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#64748b", display: "block", fontSize: "14px" }}>Total Target</span>
                        <span style={{ fontWeight: "bold", color: "#3b82f6", fontSize: "20px" }}>{vertical.targetValue}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: "#64748b", display: "block", fontSize: "14px" }}>Total Achieved</span>
                        <span style={{ fontWeight: "bold", color: "#10b981", fontSize: "20px" }}>{vertical.achievedCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ color: "#334155", marginBottom: "10px" }}>Course Breakdown</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
                    {vertical.domainCounts && [...vertical.domainCounts].sort((a, b) => b.count - a.count).map(dc => (
                      <div key={dc.domainId} style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontWeight: "bold", color: "#475569", marginBottom: "5px", fontSize: "14px" }}>{dc.title}</div>
                        <div style={{ color: "#10b981", fontSize: "18px", fontWeight: "bold" }}>{dc.count} <span style={{fontSize:"12px", color:"#94a3b8", fontWeight:"normal"}}>Enrolled</span></div>
                      </div>
                    ))}
                  </div>

                  {vertical.domainCounts && vertical.domainCounts.length > 0 && (() => {
                    const sortedDomainCounts = [...vertical.domainCounts].sort((a, b) => b.count - a.count);
                    return (
                    <div style={{ marginBottom: "30px", padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <h4 style={{ color: "#1e293b", marginBottom: "20px", fontSize: "18px", borderBottom: "1px solid #cbd5e1", paddingBottom: "10px" }}>Performance Analytics</h4>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                        {/* Chart */}
                        <div style={{ background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                          <h5 style={{ margin: "0 0 15px 0", color: "#475569" }}>Enrollments per Course</h5>
                          <div style={{ width: "100%", height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={sortedDomainCounts} margin={{ bottom: 70, right: 20 }}>
                                <XAxis dataKey="title" tick={{fontSize: 11}} interval={0} angle={-45} textAnchor="end" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                  {sortedDomainCounts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#10b981"} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Top Counselors */}
                        <div style={{ background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                          <h5 style={{ margin: "0 0 15px 0", color: "#475569" }}>Top Counselors by Course</h5>
                          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "250px", overflowY: "auto" }}>
                            {sortedDomainCounts.map(dc => (
                              <div key={dc.domainId} style={{ borderLeft: "3px solid #3b82f6", paddingLeft: "10px" }}>
                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold", marginBottom: "4px" }}>{dc.title}</div>
                                {dc.bestCounselor ? (
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ color: "#0f172a", fontWeight: "500", fontSize: "14px" }}>{dc.bestCounselor.name}</span>
                                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                                      {dc.bestCounselor.count} sales
                                    </span>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>No sales yet</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })()}

                  <VerticalEnrollmentsTable 
                    verticalId={vertical._id} 
                    month={filterMonth} 
                    year={filterYear} 
                    isMed={true} 
                    availableDomains={vertical.domains || []}
                  />
                </div>
              ))}
              
              {verticals.length === 0 && !error && (
                <div style={{ width: "100%", padding: "20px", textAlign: "center", background: "#f8fafc", borderRadius: "8px" }}>
                  <p style={{ color: "#64748b" }}>No verticals have been assigned to you yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MedTeamVerticals;
