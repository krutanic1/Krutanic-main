import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import axios from "axios";
import logo from "../assets/LOGO3.png";
import toast, { Toaster } from 'react-hot-toast';

const OperationHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const [operationData, setOperationData] = useState(null);
  const navigate = useNavigate();
  const fetchOperationData = async () => {
    const operationId = localStorage.getItem("advOperationId");
    if (!operationId) {
      // console.log("User not logged in")
      return;
    }
    try {
      const response = await axios.get(`${API}/getadvoperation`, { params: { operationId }, });
      setOperationData(response.data);
    } catch (err) {
      // console.log("Failed to fetch user data");
    }
  };
  useEffect(() => {
    fetchOperationData();
  }, []);
  const toggleVisibility = () => {
    setisMobileVisible((prevState) => !prevState);
  };
  const handleLogout = () => {
    toast.success('Logout successful!!!');
    setTimeout(() => {
      localStorage.removeItem("advOperationId");
      localStorage.removeItem("advOperationName");
      localStorage.removeItem("advOperationToken");
      localStorage.removeItem("sessionStartTime");
      navigate("/AdvOperationLogin");
    }, 1500);
  };

  const checkSession = () => {
    const sessionStartTime = localStorage.getItem("sessionStartTime");
    if (sessionStartTime) {
      const currentTime = new Date().getTime();
      const expirationTime = 3 * 60 * 60 * 1000;
      if (currentTime - sessionStartTime > expirationTime) {
        toast.error("Session Time Out");
        localStorage.removeItem("advOperationId");
        localStorage.removeItem("advOperationName");
        localStorage.removeItem("advOperationToken");
        localStorage.removeItem("sessionStartTime");
        navigate("/AdvOperationLogin");
      }
    } else {
      navigate("/AdvOperationLogin");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);




  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       mobileMenuRef.current &&
  //       !mobileMenuRef.current.contains(event.target)
  //     ) {
  //       setisMobileVisible(false);
  //     }
  //   };
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);


  return (
    <div id="OperationHeader">
      <Toaster position="top-center" reverseOrder={false} />
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
        <div className="sidebar h-full">
          <Link to="/AdvOperationDashboard"><i className="fa fa-home"></i> {operationData ? operationData.fullname : "Login First"}</Link>
          <Link to="/AdvBookedPayment">Booked Payment</Link>
          <Link to="/AdvFullPayment">Full Payment</Link>
          <Link to="/AdvDefaultPayment">Default Payment</Link>
          <Link to="/AdvOperationRevenueSheet">Revenue Sheet</Link>
          <button onClick={handleLogout} ><i className="fa fa-sign-out"></i> Logout</button>
        </div>
      )}
    </div>
  );
};


export default OperationHeader;
