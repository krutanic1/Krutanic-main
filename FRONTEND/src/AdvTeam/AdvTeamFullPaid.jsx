import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamFullPaid = () => {
  const [fullPaidEnrollments, setFullPaidEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const advTeamName = localStorage.getItem("advTeamName");

  const fetchFullPaidEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      
      const filtered = enrollments.filter(
        (item) => 
          item.status === "fullPaid" && 
          item.counselor === advTeamName
      );
      
      setFullPaidEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching full paid enrollments:", error);
      toast.error("Failed to load full paid enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullPaidEnrollments();
  }, []);

  if (loading) {
    return (
      <div id="BdaPanel">
        <div className="loading-container">
          <p>Loading full paid enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="BdaPanel">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="welcome-message">
        <h2>Full Paid Advance Program Enrollments</h2>
        <p>Total Full Paid: {fullPaidEnrollments.length}</p>
      </div>

      <div className="table-container">
        {fullPaidEnrollments.length === 0 ? (
          <div className="no-data">
            <p>No full paid enrollments found</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Domain</th>
                <th>Program</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>Month Opted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fullPaidEnrollments.map((enrollment, index) => (
                <tr key={enrollment._id}>
                  <td>{index + 1}</td>
                  <td>{enrollment.fullname}</td>
                  <td>{enrollment.email}</td>
                  <td>{enrollment.phone}</td>
                  <td>{enrollment.domain}</td>
                  <td>{enrollment.program}</td>
                  <td>₹{enrollment.programPrice?.toLocaleString()}</td>
                  <td>₹{enrollment.paidAmount?.toLocaleString()}</td>
                  <td>{enrollment.monthOpted}</td>
                  <td>
                    <span className="status-badge status-fullpaid">
                      {enrollment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvTeamFullPaid;