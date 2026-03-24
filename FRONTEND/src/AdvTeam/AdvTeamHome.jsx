import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import API from "../API";

const AdvTeamHome = () => {
  const [advEnrollments, setAdvEnrollments] = useState([]);
  const [advTeamMember, setAdvTeamMember] = useState([]);
  const [leads, setLeads] = useState([]); // New state for leads
  
  const advTeamName = localStorage.getItem("advTeamName");
  const userId = localStorage.getItem("advTeamId");
  const designation = localStorage.getItem("advTeamDesignation") || "";
  const isLeader = designation.toLowerCase().includes("leader");
  const isSpecialist = designation.toLowerCase().includes("specialist") || designation.toLowerCase().includes("sales");
  const apiRole = isSpecialist ? "SR Inside Sales Specialist" : isLeader ? "ADV Leader" : "ADV Manager";

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

  const fetchMyLeads = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`${API}/api/adv-leads/get-adv-leads`, {
        params: { role: apiRole, userId, page: 1, limit: 10000, strictlyOwned: true }
      });
      if (res.data && res.data.leads) {
        setLeads(res.data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  useEffect(() => {
    fetchAdvTeamMember();
    fetchAdvEnrollments();
    fetchMyLeads();
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

  const totalAssignedLeads = leads.length;
  const totalConvertedLeads = leads.filter(l => l.status === "converted").length;
  const totalInFollowupLeads = leads.filter(l => l.status === "in_followup").length;
  const totalFreshLeads = leads.filter(l => ["fresh", "assigned_to_manager", "assigned_to_leader", "assigned_to_specialist"].includes(l.status)).length;

  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (totalConvertedLeads > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [totalConvertedLeads]);

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

      <div className="stats-container" style={{ marginTop: '20px' }}>
        <div className="state-card" style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
          <div className="state-header" style={{ color: '#096dd9' }}>
            <h3>Total Leads</h3>
            <i className="fa fa-users"></i>
          </div>
          <p className="status-count" style={{ color: '#096dd9' }}>{totalAssignedLeads}</p>
          <p className="status-info" style={{ color: '#096dd9' }}>Assigned Leads</p>
        </div>

        <div className="state-card" style={{ 
          background: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '12px',
          padding: '20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '140px',
          overflow: 'hidden'
        }}>
          {showConfetti && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Confetti width={300} height={200} recycle={false} numberOfPieces={150} gravity={0.2} />
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <h3 style={{ margin: 0, color: '#4b5563', fontSize: '18px', fontWeight: '500' }}>Converted</h3>
            <div style={{ width: '30px', height: '30px', background: '#f15a29', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>
              <i className="fa fa-check"></i>
            </div>
          </div>
          <p style={{ margin: '15px 0', color: '#389e0d', fontSize: '42px', fontWeight: 'bold', lineHeight: '1' }}>{totalConvertedLeads}</p>
          <p style={{ margin: 0, color: '#389e0d', fontSize: '14px', fontWeight: '500' }}>Converted Leads</p>
        </div>

        <div className="state-card" style={{ background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <div className="state-header" style={{ color: '#d48806' }}>
            <h3>In Follow-up</h3>
            <i className="fa fa-phone"></i>
          </div>
          <p className="status-count" style={{ color: '#d48806' }}>{totalInFollowupLeads}</p>
          <p className="status-info" style={{ color: '#d48806' }}>Active Follow-ups</p>
        </div>

        <div className="state-card" style={{ background: '#f0f5ff', border: '1px solid #adc6ff' }}>
          <div className="state-header" style={{ color: '#1d39c4' }}>
            <h3>Fresh</h3>
            <i className="fa fa-envelope-open"></i>
          </div>
          <p className="status-count" style={{ color: '#1d39c4' }}>{totalFreshLeads}</p>
          <p className="status-info" style={{ color: '#1d39c4' }}>Uncontacted Leads</p>
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
