import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate  } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import toast ,{Toaster} from 'react-hot-toast';

const PCHeader = () => {
    const [isMobileVisible, setisMobileVisible] = useState(true);
    const mobileMenuRef = useRef(null);
   
    const navigate = useNavigate();
  
    const toggleVisibility = () => {
      setisMobileVisible((prevState) => !prevState);
    };
    const handleLogout = () => {
      toast.success('Logout successful!!!');
      setTimeout(() => {
      localStorage.removeItem("pcId");
      localStorage.removeItem("pcEmail");
      localStorage.removeItem("pctoken");
      navigate("/PCLogin");
    }, 1500);
    };


    return (
      <div id="AdminHeader">
         <Toaster position="top-center" reverseOrder={false}/>
        <div className="navbar">
          <div>
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div ref={mobileMenuRef}>
            {/* <span onClick={toggleVisibility}>☰</span> */}
          </div>
        </div>
        {isMobileVisible && (
          <div className="sidebar">
            <Link to="/PcDashboard"><i className="fa fa-home"></i>Home</Link>
            <Link to="/jobpost">Job Post</Link>    
          <button onClick={handleLogout} ><i className="fa fa-sign-out"></i> Logout</button>
          </div>
        )}
      </div>
    );
  };

export default PCHeader
