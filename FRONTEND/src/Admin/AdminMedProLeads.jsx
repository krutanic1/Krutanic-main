import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";
import toast from "react-hot-toast";

const AdminMedProLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/medpro/leads?page=${page}&limit=30`);
      setLeads(response.data.leads || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalLeads(response.data.totalLeads || 0);
    } catch (error) {
      console.error("Error fetching MedPro leads:", error);
      toast.error("Failed to fetch MedPro leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await axios.delete(`http://localhost:5000/api/medpro/leads/${id}`);
        toast.success("Lead deleted successfully");
        fetchLeads();
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead");
      }
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', padding: '30px' }}>
      <div className="admin-header">
        <h1>MedPro Packs Leads</h1>
        <div className="admin-stats">
          <div className="stat-box">
            <h3>Total Leads</h3>
            <p>{totalLeads}</p>
          </div>
        </div>
      </div>

      <div className="admin-actions" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <input
          type="text"
          placeholder="Search by name, email, phone, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ padding: "10px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            style={{ padding: "8px 16px", borderRadius: "5px", border: "1px solid #ccc", background: page === 1 ? "#eee" : "#fff", cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            style={{ padding: "8px 16px", borderRadius: "5px", border: "1px solid #ccc", background: page === totalPages ? "#eee" : "#fff", cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
          <button onClick={fetchLeads} className="btn-primary" style={{ padding: "10px 20px", cursor: "pointer", background: "#4caf50", color: "white", border: "none", borderRadius: "5px", marginLeft: "10px" }}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Date</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Name</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Email</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Phone</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Course</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Questions</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{new Date(lead.createdAt).toLocaleString()}</td>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{lead.name}</td>
                    <td style={{ padding: "12px" }}>{lead.email}</td>
                    <td style={{ padding: "12px" }}>{lead.phone}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ 
                        background: lead.course.includes("Forensic") ? "#fef3c7" : lead.course.includes("Clinical") ? "#dcfce7" : lead.course.includes("Law") ? "#e0e7ff" : "#f3f4f6",
                        color: lead.course.includes("Forensic") ? "#d97706" : lead.course.includes("Clinical") ? "#16a34a" : lead.course.includes("Law") ? "#4f46e5" : "#4b5563",
                        padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold"
                      }}>
                        {lead.course}
                      </span>
                    </td>
                    <td style={{ padding: "12px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={lead.question}>
                      {lead.question || "-"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleDelete(lead._id)} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "20px", textAlign: "center" }}>No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMedProLeads;
