import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamTeamLogin = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const managerId = localStorage.getItem("advTeamId");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mgrRes = await axios.get(`${API}/getadvteam`, { params: { advTeamId: managerId } });
      const mgr = mgrRes.data;

      const designation = (mgr.designation || "").toUpperCase();
      const authorized = designation.includes("MANAGER") || designation.includes("LEADER");
      setIsAuthorized(authorized);
      
      if (!authorized) {
        setLoading(false);
        return;
      }

      const allRes = await axios.get(`${API}/getadvteam`);
      const allMembers = allRes.data;

      const managerTeams = mgr.teams && mgr.teams.length > 0 ? mgr.teams : [mgr.team];

      const filtered = allMembers.filter(member => {
        if (member._id === managerId) return false;
        if (member.status === "Inactive") return false; 
        
        const memberTeams = member.teams && member.teams.length > 0 ? member.teams : [member.team];
        const isTeamMatch = managerTeams.some(t => memberTeams.includes(t)) || 
                           managerTeams.includes(member.team) || 
                           memberTeams.includes(mgr.team);
        
        if (!isTeamMatch) return false;

        const memberDesignation = (member.designation || "").toUpperCase();
        const isManagerOrLeader = memberDesignation.includes("MANAGER") || memberDesignation.includes("LEADER");
        
        if (designation.includes("LEADER")) {
           return !isManagerOrLeader; 
        }
        
        if (designation.includes("MANAGER")) {
           return !memberDesignation.includes("MANAGER");
        }

        return true;
      });

      setTeamMembers(filtered);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = async (userId) => {
    try {
      const response = await axios.post(`${API}/manager-impersonate-advteam`, { userId, managerId });
      if (response.status === 200) {
        toast.success("Impersonation successful!");
        const { token, bdaId, bdaName, designation } = response.data;
        
        // Pass credentials via URL so the new tab can save them to its own sessionStorage
        // This prevents conflicts between different tabs (Solution 2)
        const impersonateUrl = `/advteam/home?impToken=${encodeURIComponent(token)}&impId=${bdaId}&impName=${encodeURIComponent(bdaName)}&impRole=${encodeURIComponent(designation || "")}&impType=advTeamToken`;
        
        setTimeout(() => {
          window.open(impersonateUrl, "_blank");
        }, 500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to login to team member");
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ marginLeft: "300px", padding: "100px", textAlign: "center", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <div style={{ background: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", maxWidth: "500px", margin: "0 auto" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "#ef4444", marginBottom: "20px" }}>block</span>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b" }}>Access Denied</h2>
          <p style={{ color: "#64748b", marginTop: "12px", lineHeight: "1.6" }}>
            Your role does not have permission to access the team portfolio. This area is reserved for Managers and Leaders.
          </p>
          <button 
            onClick={() => window.location.href = "/advteam/home"}
            style={{ marginTop: "24px", padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="create-marketing-team" style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "32px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ padding: "12px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#2563eb", display: "block" }}>group</span>
        </div>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Team Portfolio Access</h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px", fontWeight: "500" }}>Manage and monitor your team's sales performance and lead interactions.</p>
        </div>
      </div>
      
      <div style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "100px 0", textAlign: "center" }}>
            <div className="three-body" style={{ margin: "0 auto" }}>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
            <p style={{ marginTop: "20px", color: "#64748b", fontWeight: "600" }}>Loading your team roster...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Sl.No</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Team Member</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Role & Designation</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Team</th>
                  <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.length > 0 ? (
                  teamMembers.map((member, index) => (
                    <tr key={member._id} style={{ transition: "background 0.2s" }}>
                      <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#94a3b8", borderBottom: "1px solid #f1f5f9" }}>{index + 1}</td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>{member.fullname}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{member.email}</div>
                      </td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{ padding: "4px 12px", borderRadius: "10px", fontSize: "10px", fontWeight: "800", background: "#eff6ff", color: "#1d4ed8", textTransform: "uppercase" }}>{member.designation}</span>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#94a3b8' }}>groups</span>
                          {member.team || (member.teams ? member.teams.join(", ") : "N/A")}
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right", borderBottom: "1px solid #f1f5f9" }}>
                        <button 
                          onClick={() => handleLogin(member._id)}
                          style={{ 
                            padding: "8px 16px", 
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)", 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: "10px", 
                            fontWeight: "700", 
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                            transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.2)";
                          }}
                        >
                          Login <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: "80px 24px", textAlign: "center" }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#e2e8f0' }}>person_off</span>
                        <p style={{ color: "#94a3b8", fontWeight: "600", fontSize: "15px" }}>No eligible team members found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvTeamTeamLogin;
