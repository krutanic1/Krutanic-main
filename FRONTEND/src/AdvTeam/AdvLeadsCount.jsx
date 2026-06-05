import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const AdvLeadsCount = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  
  // Data states
  const [executiveData, setExecutiveData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  
  // Filter & Pagination states
  const [filterType, setFilterType] = useState("10"); // "10", "20", "30", "all", "custom"
  const [customDate, setCustomDate] = useState(new Date().toISOString().split("T")[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAssigned, setTotalAssigned] = useState(0);

  useEffect(() => {
    // Determine user role and ID
    if (isAdmin) {
      setRole("ADMIN");
      setUserId("admin"); // Arbitrary for admin since we just show all
    } else {
      const advTeamId = localStorage.getItem("advTeamId");
      setUserId(advTeamId);
      
      const checkRole = async () => {
        try {
          const response = await axios.get(`${API}/getadvteam`, { params: { advTeamId } });
          const designation = response.data.designation || "";
          setRole(designation);
        } catch (error) {
          console.error("Failed to fetch user designation", error);
        }
      };
      checkRole();
    }
  }, [isAdmin]);

  const isExecutive = role && !role.toUpperCase().includes("MANAGER") && !role.toUpperCase().includes("LEADER") && role !== "ADMIN";

  const fetchExecutiveData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/adv-reports/assigned-leads/executive/${userId}`, {
        params: { page, limit: 10, days: filterType }
      });
      setExecutiveData(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch leads count");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, role: role };
      
      if (filterType === "custom") {
        params.date = customDate;
      } else {
        params.days = filterType;
      }

      const res = await axios.get(`${API}/api/adv-reports/assigned-leads/team/${userId}`, { params });
      setTeamData(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalAssigned(res.data?.totalAssigned || 0);
    } catch (err) {
      toast.error("Failed to fetch team assignments");
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [filterType, customDate]);

  useEffect(() => {
    if (!userId || !role) return;

    if (isExecutive) {
      fetchExecutiveData();
    } else {
      fetchTeamData();
    }
  }, [userId, role, filterType, customDate, page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Render Pagination Controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "20px", gap: "16px" }}>
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1}
          style={{
            padding: "8px 16px", borderRadius: "6px", border: "1px solid #d1d5db", 
            background: page === 1 ? "#f3f4f6" : "#fff", color: page === 1 ? "#9ca3af" : "#374151",
            cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: "600", transition: "all 0.2s"
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#4b5563" }}>
          Page {page} of {totalPages}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={page === totalPages}
          style={{
            padding: "8px 16px", borderRadius: "6px", border: "1px solid #d1d5db", 
            background: page === totalPages ? "#f3f4f6" : "#fff", color: page === totalPages ? "#9ca3af" : "#374151",
            cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: "600", transition: "all 0.2s"
          }}
        >
          Next
        </button>
      </div>
    );
  };

  const getFilterLabel = () => {
    switch(filterType) {
      case "10": return "(Last 10 Days)";
      case "20": return "(Last 20 Days)";
      case "30": return "(Last 30 Days)";
      case "all": return "(All Time)";
      case "custom": return `(${new Date(customDate).toLocaleDateString("en-GB")})`;
      default: return "";
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <div style={{ marginLeft: "280px", padding: "40px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "24px" }}>
          <i className="fa fa-bar-chart" style={{ marginRight: "10px", color: "#F15B29" }}></i>
          Leads Assignment Count
        </h2>

        <div style={{ background: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          
          {/* Shared Filter Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", margin: 0 }}>
              {isExecutive ? "Your Assigned Leads" : "Team Assignment Breakdown"} {getFilterLabel()}
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Filter Period:</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px",
                  outline: "none", fontFamily: "inherit", cursor: "pointer", background: "#fff"
                }}
              >
                <option value="10">Last 10 Days</option>
                <option value="20">Last 20 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="all">All Time</option>
                {!isExecutive && <option value="custom">Specific Date</option>}
              </select>

              {filterType === "custom" && !isExecutive && (
                <input 
                  type="date" 
                  value={customDate} 
                  onChange={(e) => setCustomDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px",
                    outline: "none", fontFamily: "inherit"
                  }}
                />
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "32px", color: "#F15B29" }}></i>
              <p style={{ marginTop: "10px", color: "#6b7280" }}>Loading data...</p>
            </div>
          ) : (
            <>
              {isExecutive ? (
                // Executive View
                <>
                  {executiveData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
                      <p style={{ color: "#6b7280", margin: 0 }}>No leads assigned during this period.</p>
                    </div>
                  ) : (
                    <>
                      {/* Executive Area Chart */}
                      <div style={{ marginBottom: "40px", height: "300px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={[...executiveData].reverse().map(item => ({
                              date: new Date(item.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
                              Leads: item.count
                            }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F15B29" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F15B29" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                              itemStyle={{ color: "#F15B29", fontWeight: "700" }}
                            />
                            <Area type="monotone" dataKey="Leads" stroke="#F15B29" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                            <th style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb", color: "#374151" }}>Date</th>
                            <th style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb", color: "#374151" }}>Leads Assigned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {executiveData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                              <td style={{ padding: "12px 16px", color: "#4b5563", fontWeight: "500" }}>
                                {new Date(row.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td style={{ padding: "12px 16px", fontWeight: "700", color: "#111827" }}>
                                {row.count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {renderPagination()}
                    </>
                  )}
                </>
              ) : (
                // Manager/Leader/Admin View
                <>
                  {teamData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
                      <p style={{ color: "#6b7280", margin: 0 }}>No leads were assigned to the team during this period.</p>
                    </div>
                  ) : (
                    <>
                      {/* Team Bar Chart */}
                      <div style={{ marginBottom: "40px", height: "350px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={teamData.map(item => ({
                              Name: item.name,
                              Leads: item.count
                            }))}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="Name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tick={{ textTransform: 'capitalize' }} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                              itemStyle={{ color: "#F15B29", fontWeight: "700" }}
                              cursor={{ fill: "#f3f4f6" }}
                            />
                            <Bar dataKey="Leads" fill="#F15B29" radius={[6, 6, 0, 0]} maxBarSize={60} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                            <th style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb", color: "#374151" }}>Team Member Name</th>
                            <th style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb", color: "#374151" }}>Leads Assigned</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                              <td style={{ padding: "12px 16px", color: "#4b5563", fontWeight: "500", textTransform: "capitalize" }}>
                                {row.name}
                              </td>
                              <td style={{ padding: "12px 16px", fontWeight: "700", color: "#F15B29" }}>
                                {row.count}
                              </td>
                            </tr>
                          ))}
                          {/* Total Row shows total across ALL pages to avoid confusion */}
                          <tr style={{ background: "#fff7ed" }}>
                            <td style={{ padding: "14px 16px", color: "#9a3412", fontWeight: "700", textAlign: "right" }}>
                              Total Assigned {filterType !== "custom" ? "(All Pages)" : ""}:
                            </td>
                            <td style={{ padding: "14px 16px", fontWeight: "900", color: "#9a3412", fontSize: "16px" }}>
                              {totalAssigned}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {renderPagination()}
                    </>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdvLeadsCount;
