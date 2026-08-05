import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import axios from "axios";
import API from "../API";

import toast, { Toaster } from "react-hot-toast";

const MedTeamHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const BdaName = localStorage.getItem("medTeamName");
  const medTeamId = localStorage.getItem("medTeamId");
  const [medTeamData, setMedTeamData] = useState(null);

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
      localStorage.removeItem("medTeamName");
      localStorage.removeItem("medTeamToken");
      localStorage.removeItem("sessionStartTime");
      navigate("/medloginteam");
    }, 1500);
  };

  const checkSession = () => {
    const sessionStartTime = localStorage.getItem("sessionStartTime");
    if (sessionStartTime) {
      const startMs = Number(sessionStartTime);
      if (isNaN(startMs)) return; // guard against bad values — don't kick out
      const currentTime = new Date().getTime();
      const expirationTime = 3 * 60 * 60 * 1000; // 3 hours
      if (currentTime - startMs > expirationTime) {
        toast.error("Session Time Out");
        localStorage.removeItem("bdaId");
        localStorage.removeItem("medTeamId");
        localStorage.removeItem("medTeamToken");
        localStorage.removeItem("sessionStartTime");
        navigate("/medloginteam");
      }
    } else {
      navigate("/medloginteam");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchMedTeamData = async () => {
    if (!medTeamId) {
      console.log("Team user not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getmedteam`, { params: { medTeamId } });
      setMedTeamData(response.data);
    } catch (err) {
      console.log("Failed to fetch medteam data");
    }
  };

  useEffect(() => {
    fetchMedTeamData();
  }, [medTeamId]);

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
            {medTeamData ? (
              <>
                <h2>{medTeamData.fullname}</h2>
                <h3>{medTeamData.email}</h3>
                <h2>{medTeamData.designation}</h2>
                <h3>{medTeamData.team}</h3>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Link to="/medteam/home">
            <i className="fa fa-dashboard"></i> Home
          </Link>
          <Link to="/medteam/onboarding">
            <i className="fa fa-edit"></i> OnBoarding Form
          </Link>
          <Link to="/medteam/adduser">
            <i className="fa fa-book"></i> Add Name/Email
          </Link>
          <Link to="/medteam/revenue">
            <i className="fa fa-line-chart"></i> Revenue
          </Link>
          <Link to="/medteam/leaderboard">
            <i className="fa fa-trophy"></i> Leaderboard
          </Link>
          {medTeamData && (medTeamData.designation?.toUpperCase().includes("LEADER") || medTeamData.designation?.toUpperCase().includes("MANAGER")) && (
            <>
              <Link to="/medteam/teamdetail">
                <i className="fa fa-users"></i> Team
              </Link>
              <Link to="/medteam/assigntarget">
                <i className="fa fa-bullseye"></i> Assign Target
              </Link>
              <Link to="/medteam/verticals">
                <i className="fa fa-sitemap"></i> Verticals
              </Link>
            </>
          )}
          <button onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/MedDashboardAccessForm`);
            toast.success("Link Copied!", {
              style: {
                border: "1px solid #00ff00",
                padding: "16px",
                color: "#000",
                background: "#fff",
              },
            });
          }}>
            <i className="fa fa-link"></i> Copy Link
          </button>
          <button onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MedTeamHeader;
