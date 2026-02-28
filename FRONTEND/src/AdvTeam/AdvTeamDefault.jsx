import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamDefault = () => {
  const [defaultEnrollments, setDefaultEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const advTeamName = localStorage.getItem("advTeamName");

  const fetchDefaultEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      
      const filtered = enrollments.filter(
        (item) => 
          item.status === "default" && 
          item.counselor === advTeamName
      );
      
      setDefaultEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching default enrollments:", error);
      toast.error("Failed to load default enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultEnrollments();
  }, []);

  if (loading) {
    return (
      <div id="BdaPanel">
        <div className="loading-container">
          <p>Loading default enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="BdaPanel">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="welcome-message">
        <h2>Default Advance Program Enrollments</h2>
        <p>Total Default: {defaultEnrollments.length}</p>
      </div>

      <div className="table-container">
        {defaultEnrollments.length === 0 ? (
          <div className="no-data">
            <p>No default enrollments found</p>
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
                <th>Remaining</th>
                <th>Month Opted</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {defaultEnrollments.map((enrollment, index) => (
                <tr key={enrollment._id}>
                  <td>{index + 1}</td>
                  <td>{enrollment.fullname}</td>
                  <td>{enrollment.email}</td>
                  <td>{enrollment.phone}</td>
                  <td>{enrollment.domain}</td>
                  <td>{enrollment.program}</td>
                  <td>₹{enrollment.programPrice?.toLocaleString()}</td>
                  <td>₹{enrollment.paidAmount?.toLocaleString()}</td>
                  <td>₹{enrollment.remainingAmount?.toLocaleString()}</td>
                  <td>{enrollment.monthOpted}</td>
                  <td>{enrollment.clearPaymentMonth ? new Date(enrollment.clearPaymentMonth).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className="status-badge status-default">
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

export default AdvTeamDefault;
