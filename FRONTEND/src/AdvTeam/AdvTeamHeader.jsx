import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const advTeamName = localStorage.getItem("advTeamName");
  const advTeamId = localStorage.getItem("advTeamId");
  const [advTeamData, setAdvTeamData] = useState(null);

  const toggleVisibility = () => {
    setisMobileVisible((prevState) => !prevState);
  };

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
      localStorage.removeItem("advTeamId");
      localStorage.removeItem("advTeamName");
      localStorage.removeItem("advTeamToken");
      localStorage.removeItem("advTeamSessionStartTime");
      navigate("/AdvTeamLogin");
    }, 1500);
  };

  const checkSession = () => {
    const sessionStartTime = localStorage.getItem("advTeamSessionStartTime");
    if (sessionStartTime) {
      const currentTime = new Date().getTime();
      const expirationTime = 3 * 60 * 60 * 1000; // 3 hours
      if (currentTime - sessionStartTime > expirationTime) {
        toast.error("Session Time Out");
        localStorage.removeItem("advTeamId");
        localStorage.removeItem("advTeamName");
        localStorage.removeItem("advTeamToken");
        localStorage.removeItem("advTeamSessionStartTime");
        navigate("/AdvTeamLogin");
      }
    } else {
      navigate("/AdvTeamLogin");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchAdvTeamData = async () => {
    if (!advTeamId) {
      console.log("Advance Team user not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getadvteam`, { params: { advTeamId } });
      setAdvTeamData(response.data);
    } catch (err) {
      console.log("Failed to fetch advance team data");
    }
  };

  useEffect(() => {
    fetchAdvTeamData();
  }, [advTeamId]);

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
            {advTeamData ? (
              <>
                <h2>{advTeamData.fullname}</h2>
                <h3>{advTeamData.email}</h3>
                <h2>{advTeamData.designation}</h2>
                <h3>{advTeamData.team}</h3>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Link to="/advteam/home">
            <i className="fa fa-dashboard"></i> Home
          </Link>
          {/* <Link to="/advteam/leaderboard">
            <i className="fa fa-trophy"></i> LeaderBoard
          </Link> */}
          {["LEADER", "MANAGER"].includes(advTeamData?.designation) && (
            <>
              <Link to="/advteam/assigntarget">
                <i className="fa fa-bullseye"></i> Assign Target
              </Link>
            </>
          )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER" ||
            advTeamData?.designation === "SR Inside Sales Specialist" ||
            advTeamData?.designation === "Inside Sales Specialist") && (
              <Link to="/advteam/my-leads">
                <i className="fa fa-list-alt"></i> My Leads
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER" ||
            advTeamData?.designation === "SR Inside Sales Specialist" ||
            advTeamData?.designation === "Inside Sales Specialist") && (
              <Link to="/advteam/leads-book">
                <i className="fa fa-book"></i> Leads Book
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER") && (
              <Link to="/advteam/lead-management">
                <i className="fa fa-tasks"></i> Lead Management
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER") && (
              <Link to="/advteam/record">
                <i className="fa fa-history"></i> Record
              </Link>
            )}
          <Link to="/advteam/onboarding">
            <i className="fa fa-edit"></i> OnBoarding Form
          </Link>
          <Link to="/advteam/booked">
            <i className="fa fa-calendar-o"></i> Booked Payment
          </Link>
          <Link to="/advteam/fullpaid">
            <i className="fa fa-calendar-check-o"></i> Full Payment
          </Link>
          <Link to="/advteam/default">
            <i className="fa fa-calendar-times-o"></i> Default Payment
          </Link>
          <Link to="/advteam/adduser">
            <i className="fa fa-book"></i> Add Name/Email
          </Link>
          {/* <Link to="/advteam/reference">
            <i className="fa fa-bell"></i> Your Reference
          </Link> */}
          {["LEADER", "MANAGER"].includes(advTeamData?.designation) && (
            <>
              <Link to="/advteam/teamdetail">
                <i className="fa fa-users"></i> Team
              </Link>
            </>
          )}
          {advTeamData?.designation === "MANAGER" &&
            advTeamData?.Access === true && (
              <Link to="/advteam/addteam">
                <i className="fa fa-user"></i> Add Team
              </Link>
            )}
          <Link to="/advteam/revenue">
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

export default AdvTeamHeader;
