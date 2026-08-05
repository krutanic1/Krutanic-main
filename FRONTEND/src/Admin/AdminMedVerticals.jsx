import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import "./AdminPanel.css";

const AdminMedVerticals = () => {
  const [verticals, setVerticals] = useState([]);
  const [managers, setManagers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    managerId: "",
    targetValue: "",
    domains: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedVerticalId, setSelectedVerticalId] = useState(null);

  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [filterMonth, filterYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [verticalsRes, managersRes, coursesRes] = await Promise.all([
        axios.get(`${API}/api/med-vertical?month=${filterMonth}&year=${filterYear}`, { withCredentials: true }),
        axios.get(`${API}/getmedteam`, { withCredentials: true }),
        axios.get(`${API}/getmedcourses`, { withCredentials: true })
      ]);
      setVerticals(verticalsRes.data);
      const activeManagers = managersRes.data.filter(u => 
        (u.status === "Active" || u.status?.toLowerCase().trim() === "active")
      );
      setManagers(activeManagers);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDomainToggle = (courseId) => {
    setFormData((prev) => {
      const domains = prev.domains.includes(courseId)
        ? prev.domains.filter((id) => id !== courseId)
        : [...prev.domains, courseId];
      return { ...prev, domains };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editMode) {
        await axios.put(`${API}/api/med-vertical/${selectedVerticalId}`, formData, { withCredentials: true });
        setSuccess("Vertical updated successfully!");
        setEditMode(false);
        setSelectedVerticalId(null);
      } else {
        await axios.post(`${API}/api/med-vertical/create`, formData, { withCredentials: true });
        setSuccess("Vertical created successfully!");
      }
      setFormData({ name: "", managerId: "", targetValue: "", domains: [] });
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error saving vertical");
    }
  };

  const handleEdit = (vertical) => {
    setEditMode(true);
    setSelectedVerticalId(vertical._id);
    setFormData({
      name: vertical.name,
      managerId: vertical.managerId?._id || "",
      targetValue: vertical.targetValue,
      domains: vertical.domains.map(d => typeof d === 'object' ? d._id : d)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vertical?")) return;
    try {
      await axios.delete(`${API}/api/med-vertical/${id}`, { withCredentials: true });
      setSuccess("Vertical deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Error deleting vertical");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedVerticalId(null);
    setFormData({ name: "", managerId: "", targetValue: "", domains: [] });
  };

  return (
    <div id="AdminAddCourse" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "30px" }}>
      <div className="admin-header">
        <h2>Med Verticals</h2>
      </div>

      {error && <div className="alert alert-danger" style={{ color: "red", padding: "10px", backgroundColor: "#ffebee", borderRadius: "5px" }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ color: "green", padding: "10px", backgroundColor: "#e8f5e9", borderRadius: "5px" }}>{success}</div>}

      <div className="admin-card" style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h3>{editMode ? "Edit Vertical" : "Create Vertical"}</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
          
          <div>
            <label style={{ fontWeight: "bold" }}>Vertical Name:</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. Vertical Awareness"
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Assign Manager:</label>
            <select 
              value={formData.managerId} 
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })} 
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">Select a Manager</option>
              {managers.map(m => (
                <option key={m._id} value={m._id}>{m.fullname} ({m.team})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Target Registrations:</label>
            <input 
              type="number" 
              value={formData.targetValue} 
              onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
              required 
              style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              min="1"
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>Assign Courses (Domains):</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", border: "1px solid #ccc", padding: "15px", borderRadius: "4px", maxHeight: "200px", overflowY: "auto" }}>
              {courses.map(course => {
                const assignedToOther = verticals.some(v => v._id !== selectedVerticalId && v.domains.some(d => (d._id || d) === course._id));
                if (assignedToOther) return null;

                return (
                  <label key={course._id} style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: "200px" }}>
                    <input 
                      type="checkbox" 
                      checked={formData.domains.includes(course._id)}
                      onChange={() => handleDomainToggle(course._id)}
                    />
                    {course.title || course.programName}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignSelf: "flex-start" }}>
            <button type="submit" style={{ padding: "10px 20px", background: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              {editMode ? "Update Vertical" : "Save Vertical"}
            </button>
            {editMode && (
              <button type="button" onClick={handleCancelEdit} style={{ padding: "10px 20px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3>Existing Verticals</h3>
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
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: "12px" }}>Vertical Name</th>
                  <th style={{ padding: "12px" }}>Manager</th>
                  <th style={{ padding: "12px" }}>Target</th>
                  <th style={{ padding: "12px" }}>Achieved Count</th>
                  <th style={{ padding: "12px" }}>Assigned Domains</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verticals.map(v => (
                  <tr key={v._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{v.name}</td>
                    <td style={{ padding: "12px" }}>{v.managerId ? v.managerId.fullname : "N/A"}</td>
                    <td style={{ padding: "12px", color: "#3b82f6", fontWeight: "bold" }}>{v.targetValue}</td>
                    <td style={{ padding: "12px", color: "#10b981", fontWeight: "bold" }}>{v.achievedCount || 0}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {v.domains.map(d => (
                          <span key={d._id} style={{ background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>
                            {d.title || d.programName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "12px", display: "flex", gap: "10px" }}>
                      <button onClick={() => handleEdit(v)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "16px" }} title="Edit">
                        <i className="fa fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(v._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }} title="Delete">
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {verticals.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: "12px", textAlign: "center", color: "#64748b" }}>No verticals found.</td>
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

export default AdminMedVerticals;
