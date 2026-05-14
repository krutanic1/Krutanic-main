import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import logo from "../assets/LOGO3.png";
import toast, { Toaster } from "react-hot-toast";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isAdvToggleOn, setIsAdvToggleOn] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/admin/logout`, {}, { withCredentials: true });
      toast.success("Logout successful!!!");
      setTimeout(() => {
        localStorage.removeItem("adminToken");
        navigate("/AdminLogin");
      }, 2000);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if backend fails, clear local storage and redirect
      localStorage.removeItem("adminToken");
      navigate("/AdminLogin");
    }
  };
  return (
    <div id="AdminHeader">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', color: 'white', fontWeight: 'bold' }}>
            {isAdvToggleOn ? "Advance" : "Mentorship"}
          </span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input
              type="checkbox"
              checked={isAdvToggleOn}
              onChange={() => setIsAdvToggleOn(!isAdvToggleOn)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: isAdvToggleOn ? '#4CAF50' : '#ccc', transition: '.4s', borderRadius: '24px'
            }}>
              <span style={{
                position: 'absolute', content: '""', height: '18px', width: '18px',
                left: isAdvToggleOn ? '28px' : '3px', bottom: '3px', backgroundColor: 'white',
                transition: '.4s', borderRadius: '50%'
              }} />
            </span>
          </label>
        </div>
      </div>
      <div className="sidebar">
        <Link to="/AdminDashboard">
          <i className="fa fa-home"></i> Home
        </Link>
        {!isAdvToggleOn && (
          <>
            <Link to="/AddCourse">
              <i className="fa fa-plus-circle mr-2"></i>Create Course
            </Link>
            <Link to="/AddModule">
              <i className="fa fa-list mr-2"></i>Course List
            </Link>
            <Link to="/AdminProjectPage">
              <i className="fa fa-tasks mr-2"></i>Project Management
            </Link>
            <Link to="/AdvProjectPage">
              <i className="fa fa-tasks mr-2"></i>Adv Project Mgmt
            </Link>
            <Link to="/CreateOperation">
              <i className="fa fa-briefcase mr-2"></i>Create Operation
            </Link>
            <Link to="/Target">
              <i className="fa fa-bullseye mr-2"></i>Target Assign
            </Link>
            <Link to="/CreateBDA">
              <i className="fa fa-users mr-2"></i>Create Team A/c
            </Link>
            <Link to="/CreateMarketingTeam">
              <i className="fa fa-users mr-2"></i>Create Marketing
            </Link>
            <Link to="/InactiveBda">
              <i className="fa fa-users mr-2"></i>Inactive Bda A/C
            </Link>
            <Link to="/CreatePlacementCoordinator">
              <i className="fa fa-user mr-2"></i>Create PC A/c
            </Link>
            <Link to="/CreateInterviewer">
              <i className="fa fa-user-plus mr-2"></i>Create Interviewer
            </Link>
            <Link to="/CreateHR">
               <i className="fa fa-user-circle-o mr-2"></i>Create HR A/c
            </Link>
            <Link to="/CreateInterview">
              <i className="fa fa-calendar-plus-o mr-2"></i>Create Mock Interview
            </Link>
            <Link to="/AcceptedApplication">
              <i className="fa fa-check-circle mr-2"></i>Active Users
            </Link>
            <Link to="/PendingApplication">
              <i className="fa fa-times-circle mr-2"></i>Inactive Users
            </Link>
            <Link to="/OnBoardingDetails">
              <i className="fa fa-info-circle mr-2"></i>OnBoarding Details
            </Link>
            <Link to="/BookedList">
              <i className="fa fa-book mr-2"></i>Booked Amount
            </Link>
            <Link to="/HalfPayment">
              <i className="fa fa-money mr-2"></i>Half Amount
            </Link>
            <Link to="/DefaultList">
              <i className="fa fa-exclamation-circle mr-2"></i>Default Amount
            </Link>
            <Link to="/FullPaidList">
              <i className="fa fa-check mr-2"></i>Full Paid Amount
            </Link>
            <Link to="/MentorQueries">
              <i className="fa fa-question-circle mr-2"></i>Mentor&apos;s Queries
            </Link>
            <Link to="/MasterClasses">
              <i className="fa fa-graduation-cap mr-2"></i>Master Class
            </Link>
            <Link to="/AddEvent">
              <i className="fa fa-calendar-plus-o mr-2"></i>Add Event
            </Link>
            <Link to="/EventRegistration">
              <i className="fa fa-calendar-check-o mr-2"></i>Event Registrations
            </Link>
            <Link to="/AlumniData">
              <i className="fa fa-lightbulb-o mr-2"></i>Alumni Review
            </Link>
            <Link to="/ReferAndEarnResponse">
              <i className="fa fa-bell mr-2"></i>Refer & Earn
            </Link>
            <Link to="/AllTeamDetail">
              <i className="fa fa-users mr-2"></i>Team Detail
            </Link>
            <Link to="/Admin/Attendance">
              <i className="fa fa-calendar mr-2"></i>Attendance
            </Link>
            <Link to="/RevenueSheet">
              <i className="fa fa-line-chart mr-2"></i>Revenue Sheet
            </Link>

          </>
        )}
        {isAdvToggleOn && (
          <>
            <div className="sidebar-section-label" style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', padding: '15px 15px 5px', textTransform: 'uppercase' }}>CRM Governance</div>
            <Link to="/AdvAdminDashboard">
              <i className="fa fa-dashboard mr-2"></i>Admin Dashboard
            </Link>
            <Link to="/Admin/CallLogs" className="flex items-center">
              <i className="fa fa-phone mr-2" style={{ color: '#3b82f6' }}></i>Call Activity Logs
            </Link>
            <Link to="/Admin/LiveMonitor" className="flex items-center">
              <i className="fa fa-heartbeat mr-2" style={{ color: '#10b981' }}></i>Live Monitoring
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>
            <Link to="/Admin/Reports">
              <i className="fa fa-file-excel-o mr-2"></i>System Reports
            </Link>

            <div className="sidebar-section-label" style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', padding: '15px 15px 5px', textTransform: 'uppercase' }}>Course Management</div>
            <Link to="/AddAdvCourse">
              <i className="fa fa-plus-circle mr-2"></i>Create Adv Course
            </Link>
            <Link to="/AddAdvModule">
              <i className="fa fa-list mr-2"></i>Adv Course List
            </Link>
            <Link to="/AdvExercisePage">
              <i className="fa fa-code mr-2"></i>Adv Exercise Builder
            </Link>
            <Link to="/CreateAdvOperation">
              <i className="fa fa-briefcase mr-2"></i>Create ADV Operation
            </Link>
            <Link to="/CreateAdvTeam">
              <i className="fa fa-users mr-2"></i>Create Adv Team
            </Link>
            <Link to="/AdvOnBoardingDetails">
              <i className="fa fa-graduation-cap mr-2"></i>ADV Onboarding
            </Link>
            <Link to="/AdvBooked">
              <i className="fa fa-bookmark mr-2"></i>ADV Booked
            </Link>
            <Link to="/AdvFullPaid">
              <i className="fa fa-check-square mr-2"></i>ADV FullPaid
            </Link>
            <Link to="/AdvDefault">
              <i className="fa fa-times-circle mr-2"></i>ADV Default
            </Link>
            <Link to="/AdvanceQueries">
              <i className="fa fa-question-circle mr-2"></i>Adv Course Queries
            </Link>
            <Link to="/AdvLeadManagement">
              <i className="fa fa-users mr-2"></i>ADV Lead Management
            </Link>
            <Link to="/AdvFormLeads">
              <i className="fa fa-wpforms mr-2"></i>Adv Form Leads
            </Link>
            <Link to="/AdvTeamDetail">
              <i className="fa fa-users mr-2"></i>ADV Team Details
            </Link>
            <Link to="/AdvUserManagement">
              <i className="fa fa-users-cog mr-2"></i>ADV User Management
            </Link>
            <Link to="/AdminAnalytics">
              <i className="fa fa-area-chart mr-2"></i>ADV Analytics
            </Link>

            <Link to="/BulkImport">
              <i className="fa fa-upload mr-2"></i>Bulk Import Leads
            </Link>
            <Link to="/AdvRevenueSheet">
              <i className="fa fa-line-chart mr-2"></i>ADV Revenue Sheet
            </Link>
          </>
        )}
        <button onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
