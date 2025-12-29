import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import toast, { Toaster } from "react-hot-toast";

const AdminHeader = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("Logout successful!!!");
    setTimeout(() => {
      localStorage.removeItem("adminToken");
      navigate("/AdminLogin");
    }, 2000);
  };
  return (
    <div id="AdminHeader">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
      </div>
      <div className="sidebar">
        <Link to="/AdminDashboard">
          <i className="fa fa-home"></i> Home
        </Link>
        <Link to="/AddCourse">
          <i className="fa fa-plus-circle mr-2"></i>Create Course
        </Link>
        <Link to="/AddModule">
          <i className="fa fa-list mr-2"></i>Course List
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
        <Link to="/AdvanceQueries">
          <i className="fa fa-question-circle mr-2"></i>Adv Course Queries
        </Link>
        <Link to="/MentorQueries">
          <i className="fa fa-question-circle mr-2"></i>Mentor's Queries
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
        <Link to="/RevenueSheet">
          <i className="fa fa-line-chart mr-2"></i>Revenue Sheet
        </Link>
        <button onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
