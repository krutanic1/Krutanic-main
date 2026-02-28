import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";

const AdvTeamHome = () => {
  const [advEnrollments, setAdvEnrollments] = useState([]);
  const [advTeamMember, setAdvTeamMember] = useState([]);
  const advTeamName = localStorage.getItem("advTeamName");
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const fetchAdvEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/getadvenrolls`);
      console.log("Adv Enrollments Response:", response.data);
      
      // Handle both possible response structures
      const enrollments = response.data.data || response.data;
      
      setAdvEnrollments(
        enrollments.filter(
          (item) => item.counselor && item.counselor === advTeamName
        )
      );
    } catch (error) {
      console.error("There was an error fetching advance enrollments:", error);
    }
  };

  const fetchAdvTeamMember = async () => {
    try {
      const response = await axios.get(`${API}/getadvteam`);
      setAdvTeamMember(response.data.filter((item) => item.fullname === advTeamName));
    } catch (error) {
      console.error("There was an error fetching advance team member:", error);
    }
  };

  useEffect(() => {
    fetchAdvTeamMember();
    fetchAdvEnrollments();
  }, []);

  const totalRevenue = advEnrollments.reduce(
    (acc, student) => acc + (student.programPrice || 0),
    0
  );
  
  const bookedRevenue = advEnrollments.reduce(
    (acc, student) => acc + (student.paidAmount || 0),
    0
  );
  
  const creditedRevenue = advEnrollments.reduce((acc, student) => {
    const lastRemark = Array.isArray(student.remark) && student.remark.length > 0
      ? student.remark[student.remark.length - 1]
      : null;

    if (
      student.status === "fullPaid" ||
      lastRemark === "Half_Cleared"
    ) {
      return acc + (student.paidAmount || 0);
    }

    return acc;
  }, 0);

  const pendingRevenue = totalRevenue - creditedRevenue;

  const totalBooked = advEnrollments.filter((s) => s.status === "booked").length;
  const totalFullPaid = advEnrollments.filter((s) => s.status === "fullPaid").length;
  const totalDefault = advEnrollments.filter((s) => s.status === "default").length;

  return (
    <div id="BdaPanel">
      <div className="welcome-message">
        <h2>Welcome to Advance Program Dashboard, {advTeamName}! 🎉</h2>
        <p>Here's an overview of your advance program enrollments and performance.</p>
      </div>

      <div className="stats-container">
        <div className="state-card">
          <div className="state-header">
            <h3>Total Enrollments</h3>
            <i className="fa fa-users"></i>
          </div>
          <p className="status-count">{advEnrollments.length}</p>
          <p className="status-info">All Advance Students</p>
        </div>

        <div className="state-card">
          <div className="state-header">
            <h3>Booked</h3>
            <i className="fa fa-calendar"></i>
          </div>
          <p className="status-count">{totalBooked}</p>
          <p className="status-info">Booked Payments</p>
        </div>

        <div className="state-card">
          <div className="state-header">
            <h3>Full Paid</h3>
            <i className="fa fa-check-circle"></i>
          </div>
          <p className="status-count">{totalFullPaid}</p>
          <p className="status-info">Completed Payments</p>
        </div>

        <div className="state-card">
          <div className="state-header">
            <h3>Default</h3>
            <i className="fa fa-exclamation-triangle"></i>
          </div>
          <p className="status-count">{totalDefault}</p>
          <p className="status-info">Default Payments</p>
        </div>
      </div>

      <div className="revenue-section">
        <div className="revenue-card">
          <h3>Total Revenue</h3>
          <p className="revenue-amount">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="revenue-card">
          <h3>Booked Revenue</h3>
          <p className="revenue-amount">₹{bookedRevenue.toLocaleString()}</p>
        </div>
        <div className="revenue-card">
          <h3>Credited Revenue</h3>
          <p className="revenue-amount">₹{creditedRevenue.toLocaleString()}</p>
        </div>
        <div className="revenue-card">
          <h3>Pending Revenue</h3>
          <p className="revenue-amount">₹{pendingRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvTeamHome;
