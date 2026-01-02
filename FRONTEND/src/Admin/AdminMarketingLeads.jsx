import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdminMarketingLeads = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllMarketingLeads = async () => {
    setLoading(true);
    try {
      console.log('Fetching marketing leads from:', `${API}/admin/getallmarketingleads`);
      const response = await axios.get(`${API}/admin/getallmarketingleads`);
      console.log('Marketing leads response:', response.data);
      setAllLeads(response.data);
    } catch (err) {
      console.error("Failed to fetch marketing leads:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      toast.error("Failed to fetch marketing leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExecutives = async () => {
    try {
      console.log('Fetching executives from:', `${API}/admin/getallmarketingexecutives`);
      const response = await axios.get(`${API}/admin/getallmarketingexecutives`);
      console.log('Executives response:', response.data);
      setExecutives(response.data);
    } catch (err) {
      console.error("Failed to fetch executives:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      toast.error("Failed to fetch executives");
    }
  };

  const handleExecutiveChange = async (e, leadId) => {
    const selectedExecutiveName = e.target.value;
    const selectedExecutiveId = e.target.options[e.target.selectedIndex].dataset.execid;

    if (!selectedExecutiveName) return;

    try {
      const response = await axios.put(`${API}/marketingUpdateExecutive/${leadId}`, {
        executiveid: selectedExecutiveId,
        executivename: selectedExecutiveName,
      });

      if (response.data.success) {
        toast.success("Executive assigned successfully!");
        setAllLeads((prev) =>
          prev.map((lead) =>
            lead._id === leadId
              ? { ...lead, executive: selectedExecutiveName, executiveId: selectedExecutiveId }
              : lead
          )
        );
      }
    } catch (err) {
      console.error("Failed to update executive:", err.message);
      toast.error("Failed to assign executive");
    }
  };



  useEffect(() => {
    fetchAllMarketingLeads();
    fetchAllExecutives();
  }, []);

  return (
    <div id="create-marketing-team">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="coursetable">
        <div>
          <h1>Marketing Leads Management</h1>
        </div>

        {/* Table Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '36px', color: '#007bff' }}></i>
            <p style={{ marginTop: '10px' }}>Loading leads...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Date</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College Name</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Domain</th>
                <th>Price</th>
                <th>Month</th>
                {/* <th>Lead</th> */}
                <th>BDA</th>
                <th>Executive</th>
                <th>Assign Executive</th>
              </tr>
            </thead>
            <tbody>
              {allLeads.length > 0 ? (
                allLeads.map((lead, index) => (
                  <tr key={lead._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{lead.fullname || "-"}</td>
                    <td>{lead.email || "-"}</td>
                    <td>{lead.phone || "-"}</td>
                    <td>{lead.collegeName || "-"}</td>
                    <td>{lead.yearOfStudy || "-"}</td>
                    <td>{lead.branch || "-"}</td>
                    <td>{lead.domain || "-"}</td>
                    <td>{lead.programPrice || "-"}</td>
                    <td>{lead.monthOpted || "-"}</td>
                    {/* <td>{lead.lead || "-"}</td> */}
                    <td>{lead.counselor || "-"}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: lead.executive || lead.lead ? '#4caf50' : '#f44336',
                        color: 'white'
                      }}>
                        {lead.executive || lead.lead || "Not Assigned"}
                      </span>
                    </td>
                    <td>
                      <select
                        onChange={(e) => handleExecutiveChange(e, lead._id)}
                        value=""
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                      >
                        <option value="">Select Executive</option>
                        {executives.map((exec) => (
                          <option
                            key={exec._id}
                            value={exec.fullname}
                            data-execid={exec._id}
                          >
                            {exec.fullname} ({exec.team})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No marketing leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminMarketingLeads;
