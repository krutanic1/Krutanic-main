import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import toast, { Toaster } from "react-hot-toast";

const HRHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("hrToken");
    localStorage.removeItem("hrId");
    localStorage.removeItem("hrName");
    toast.success("Logout successful!!!");
    setTimeout(() => {
      navigate("/hrlogin");
    }, 2000);
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
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            HR Portal
          </span>
        </div>
      </div>
      <div className="sidebar">
        <div className="sidebar-section-label" style={{ color: '#888', fontSize: '11px', fontWeight: 'bold', padding: '15px 15px 5px', textTransform: 'uppercase' }}>Management</div>
        <Link to="/hrdashboard">
          <i className="fa fa-calendar mr-2"></i> Attendance
        </Link>
        
        <button onClick={handleLogout} style={{ marginTop: 'auto' }}>
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default HRHeader;
