import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamBooked = () => {
  const [bookedEnrollments, setBookedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const advTeamName = localStorage.getItem("advTeamName");

  const fetchBookedEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      
      const filtered = enrollments.filter(
        (item) => 
          item.status === "booked" && 
          item.counselor === advTeamName
      );
      
      setBookedEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching booked enrollments:", error);
      toast.error("Failed to load booked enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedEnrollments();
  }, []);

  if (loading) {
    return (
      <div id="BdaPanel">
        <div className="loading-container">
          <p>Loading booked enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="BdaPanel">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="welcome-message">
        <h2>Booked Advance Program Enrollments</h2>
        <p>Total Booked: {bookedEnrollments.length}</p>
      </div>

      <div className="table-container">
        {bookedEnrollments.length === 0 ? (
          <div className="no-data">
            <p>No booked enrollments found</p>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookedEnrollments.map((enrollment, index) => (
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
                  <td>
                    <span className="status-badge status-booked">
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

export default AdvTeamBooked;
