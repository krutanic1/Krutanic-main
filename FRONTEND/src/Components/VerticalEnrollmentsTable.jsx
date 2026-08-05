import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const VerticalEnrollmentsTable = ({ verticalId, month, year, isMed, availableDomains }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [availableCounselors, setAvailableCounselors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const limit = 50;

  useEffect(() => {
    // Reset page to 1 when month, year or filters change
    setPage(1);
  }, [month, year, domainFilter, counselorFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [verticalId, month, year, page, domainFilter, counselorFilter]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const endpoint = isMed ? `/api/med-vertical/${verticalId}/enrollments` : `/api/vertical/${verticalId}/enrollments`;
      const response = await axios.get(`${API}${endpoint}?page=${page}&limit=${limit}&month=${month}&year=${year}&domainFilter=${encodeURIComponent(domainFilter)}&counselorFilter=${encodeURIComponent(counselorFilter)}`, { withCredentials: true });
      
      setEnrollments(response.data.enrollments || []);
      setAvailableCounselors(response.data.availableCounselors || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalCount(response.data.totalEnrollments || 0);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 style={{ color: "#334155", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Recent Enrollments</span>
        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "normal" }}>
          Total: {totalCount}
        </span>
      </h4>

      <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
        <select 
          value={domainFilter} 
          onChange={(e) => setDomainFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", flex: 1, backgroundColor: "white" }}
        >
          <option value="">All Domains</option>
          {availableDomains && availableDomains.map((d, idx) => {
            const label = d.title || d.programName || d.name || "Unknown";
            return <option key={idx} value={label}>{label}</option>;
          })}
        </select>
        <select 
          value={counselorFilter} 
          onChange={(e) => setCounselorFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", flex: 1, backgroundColor: "white" }}
        >
          <option value="">All Counselors</option>
          {availableCounselors.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </div>
      
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
      
      {loading && enrollments.length === 0 ? (
        <p style={{ color: "#64748b", fontStyle: "italic", fontSize: "14px" }}>Loading enrollments...</p>
      ) : enrollments.length > 0 ? (
        <>
          <div style={{ overflowX: "auto", marginBottom: "15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Name</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>College</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Domain</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Counselor</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Ticket Size</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Sem/Year</th>
                  <th style={{ padding: "12px", borderBottom: "2px solid #cbd5e1" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px" }}>{enrollment.fullname}</td>
                    <td style={{ padding: "12px" }}>{enrollment.collegeName || "-"}</td>
                    <td style={{ padding: "12px" }}>{enrollment.domain}</td>
                    <td style={{ padding: "12px" }}>{enrollment.counselor || "-"}</td>
                    <td style={{ padding: "12px" }}>{enrollment.programPrice ? `₹${enrollment.programPrice}` : "-"}</td>
                    <td style={{ padding: "12px" }}>{enrollment.yearOfStudy || "-"}</td>
                    <td style={{ padding: "12px" }}>{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ 
                    padding: "6px 12px", 
                    borderRadius: "4px", 
                    border: "1px solid #cbd5e1", 
                    background: page === 1 ? "#f8fafc" : "white",
                    color: page === 1 ? "#94a3b8" : "#334155",
                    cursor: page === 1 ? "not-allowed" : "pointer"
                  }}
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ 
                    padding: "6px 12px", 
                    borderRadius: "4px", 
                    border: "1px solid #cbd5e1", 
                    background: page === totalPages ? "#f8fafc" : "white",
                    color: page === totalPages ? "#94a3b8" : "#334155",
                    cursor: page === totalPages ? "not-allowed" : "pointer"
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "#94a3b8", fontStyle: "italic" }}>No enrollments found for this period.</p>
      )}
    </div>
  );
};

export default VerticalEnrollmentsTable;
