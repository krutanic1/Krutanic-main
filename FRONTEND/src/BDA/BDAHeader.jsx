import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import axios from "axios";
import API from "../API";

import toast, { Toaster } from "react-hot-toast";

const BDAHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const BdaName = localStorage.getItem("bdaName");
  const bdaId = localStorage.getItem("bdaId");
  const [bdaData, setBdaData] = useState(null);

  const toggleVisibility = () => {
    setisMobileVisible((prevState) => !prevState);
  };

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

  const handleLogout = () => {
    toast.success("Logged Out", {
      style: {
        border: "1px solid #f15b29",
        padding: "16px",
        color: "#ffffff",
        background: "#1d1e20",
      },
      iconTheme: {
        primary: "#f15b29",
        secondary: "#ffffff",
      },
    });
    setTimeout(() => {
      localStorage.removeItem("bdaId");
      localStorage.removeItem("bdaName");
      localStorage.removeItem("bdaToken");
      localStorage.removeItem("sessionStartTime");
      navigate("/TeamLogin");
    }, 1500);
  };

  const checkSession = () => {
    const sessionStartTime = localStorage.getItem("sessionStartTime");
    if (sessionStartTime) {
      const currentTime = new Date().getTime();
      const expirationTime = 3 * 60 * 60 * 1000;
      if (currentTime - sessionStartTime > expirationTime) {
        toast.error("Session Time Out");
        localStorage.removeItem("bdaId");
        localStorage.removeItem("bdaName");
        localStorage.removeItem("bdaToken");
        localStorage.removeItem("sessionStartTime");
        navigate("/TeamLogin");
      }
    } else {
      navigate("/TeamLogin");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchBdaData = async () => {
    if (!bdaId) {
      console.log("Team user not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getbda`, { params: { bdaId } });
      setBdaData(response.data);
    } catch (err) {
      console.log("Failed to fetch bda data");
    }
  };

  useEffect(() => {
    fetchBdaData();
  }, [bdaId]);

  return (
    <div id="TeamHeader">
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
        <div className="sidebar">
          <div className="detail">
            {bdaData ? (
              <>
                <h2>{bdaData.fullname}</h2>
                <h3>{bdaData.email}</h3>
                <h2>{bdaData.designation}</h2>
                <h3>{bdaData.team}</h3>
                {/* <h3 className="">This Month Target:{' '}{bdaData.target.length > 0 ? (<p>₹{bdaData.target[bdaData.target.length - 1].targetValue}</p>) : (<p>No target assigned</p>)}</h3> */}

              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Link to="/Home">
            <i className="fa fa-dashboard"></i> Home
          </Link>
          <Link to="/LeaderBoard">
            <i className="fa fa-trophy"></i> LeaderBoard
          </Link>
          <Link to="/CompanyLeads">
            <i className="fa fa-tags"></i> Company Leads
          </Link>
          {["LEADER", "MANAGER"].includes(bdaData?.designation) && (
            <>
              <Link to="/AssignTarget">
              <i className="fa fa-bullseye"></i> Assign Target
              </Link>
            </>
          )}
          <Link to="/OnBoarding">
            <i className="fa fa-edit"></i> OnBoarding Form
          </Link>
          <Link to="/Booked">
            <i className="fa fa-calendar-o"></i> Booked Payment
          </Link>
          <Link to="/FullPaid">
            <i className="fa fa-calendar-check-o"></i> Full Payment
          </Link>
          <Link to="/Default">
            <i className="fa fa-calendar-times-o"></i> Default Payment
          </Link>
          <Link to="/AddUser">
            <i className="	fa fa-book"></i> Add Name/Email
          </Link>
          <Link to="/Reference">
            <i className="fa fa-bell"></i> Your Reference
          </Link>
          {["LEADER", "MANAGER"].includes(bdaData?.designation) && (
            <>
              <Link to="/TeamDetail">
                <i className="fa fa-users"></i> Team
              </Link>
            </>
          )}
          {bdaData?.designation === "MANAGER" &&
            bdaData?.Access === true && (
              <Link to="/AddTeam">
                <i className="fa fa-user"></i> Add Team
              </Link>
            )}

          <Link to="/BDARevenueSheet">
            <i className="fa fa-money"></i> Revenue
          </Link>
          <button onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default BDAHeader;
