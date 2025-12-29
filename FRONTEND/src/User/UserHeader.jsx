

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../API";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import JobBoard from "./JobBoard";
import MyJob from "./MyJob";
import MockInterview from "./MockInterview";
import Exercise from "./Excercise";
import ResumeATS from "./ResumeATS";


const UserHeader = ({ onNavigate, resetNavigation }) => {
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [componentsAccess, setComponentsAccess] = useState({
    atschecker: false,
    jobboard: false,
    myjob: false,
    mockinterview: false,
    exercise: false,
  });
  const [selectedComponent, setSelectedComponent] = useState(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate(); 

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("User not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/users`, { params: { userId } });
      setUserData(response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  const fetchComponentsAccess = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await axios.get(`${API}/user-components`, {
        params: { userId },
      });
      setComponentsAccess(response.data.components);
    } catch (err) {
      console.error("Failed to fetch components access:", err);
    }
  };

  const handleLogout = () => {
    toast.success("logout successful!!!");
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setSelectedComponent(null);
      navigate("/Login");
    }, 1500);
  };

  const toggleVisibility = () => {
    setIsMobileVisible((prevState) => !prevState);
  };

  const handleRestrictedClick = (e, access, component) => {
    e.preventDefault();
    if (!access) {
      toast.error("Upgrade the plan to access this feature");
    } else {
      setSelectedComponent(component);
      onNavigate?.();
      setTimeout(() => resetNavigation?.(), 0);
    }
  };

  const handleLinkClick = (path) => {
    setSelectedComponent(null); 
    navigate(path);
    onNavigate?.();
    setTimeout(() => resetNavigation?.(), 0);
  };

  useEffect(() => {
    fetchUserData();
    fetchComponentsAccess();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "jobboard":
        return <JobBoard />;
      case "myjob":
        return <MyJob />;
      case "mockinterview":
        return <MockInterview />;
      case "exercise":
        return <Exercise />;
      case "atschecker":
        return <ResumeATS />;
      default:
        return null;
    }
  };

  const menuItemStyle = {
    cursor: "pointer",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <div id="UserHeader">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar">
        <div>
          <div
            onClick={() => handleLinkClick("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div ref={mobileMenuRef}>
          <span onClick={toggleVisibility} style={{ cursor: "pointer" }}>
            Menu
          </span>
        </div>
      </div>
      {isMobileVisible && (
        <div className="sidebar">
          <div className="detail">
            <span className="fa fa-graduation-cap"></span>
            {userData ? (
              <>
                <h2 className="capitalize">{userData.fullname}</h2>
                <h3>{userData.contact}</h3>
                <h3>{userData.email}</h3>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div
            onClick={() => handleLinkClick("/Dashboard")}
            style={menuItemStyle}
          >
            <i className="fa fa-home"></i> Home
          </div>
          <div
            onClick={() => handleLinkClick("/EnrolledCourses")}
            style={menuItemStyle}
          >
            <i className="fa fa-book"></i> Enrolled Courses
          </div>
          <div
            onClick={(e) =>
              handleRestrictedClick(e, componentsAccess.jobboard, "jobboard")
            }
            style={{
              ...menuItemStyle,
              ...(componentsAccess.jobboard ? {} : { opacity: 0.5 }),
            }}
            title={
              !componentsAccess.jobboard
                ? "Upgrade the plan to access this feature"
                : ""
            }
            className={!componentsAccess.jobboard ? "disabled-link" : ""}
          >
            <i className="fa fa-briefcase"></i> Job Board
          </div>
          <div
            onClick={(e) =>
              handleRestrictedClick(e, componentsAccess.myjob, "myjob")
            }
            style={{
              ...menuItemStyle,
              ...(componentsAccess.myjob ? {} : { opacity: 0.5 }),
            }}
            title={
              !componentsAccess.myjob
                ? "Upgrade the plan to access this feature"
                : ""
            }
            className={!componentsAccess.myjob ? "disabled-link" : ""}
          >
            <i className="fa fa-suitcase"></i> My Job
          </div>
     
          <div
            onClick={(e) =>
              handleRestrictedClick(
                e,
                componentsAccess.mockinterview,
                "mockinterview"
              )
            }
            style={{
              ...menuItemStyle,
              ...(componentsAccess.mockinterview ? {} : { opacity: 0.5 }),
            }}
            title={
              !componentsAccess.mockinterview
                ? "Upgrade the plan to access this feature"
                : ""
            }
            className={!componentsAccess.mockinterview ? "disabled-link" : ""}
          >
            <i className="fa fa-desktop"></i> Mock Prep
          </div>
          <div
            onClick={(e) =>
              handleRestrictedClick(e, componentsAccess.exercise, "exercise")
            }
            style={{
              ...menuItemStyle,
              ...(componentsAccess.exercise ? {} : { opacity: 0.5 }),
            }}
            title={
              !componentsAccess.exercise
                ? "Upgrade the plan to access this feature"
                : ""
            }
            className={!componentsAccess.exercise ? "disabled-link" : ""}
          >
            <i className="fa fa-ticket"></i> Exercise Prep
          </div>
          <div
            onClick={(e) =>
              handleRestrictedClick(
                e,
                componentsAccess.atschecker,
                "atschecker"
              )
            }
            style={{
              ...menuItemStyle,
              ...(componentsAccess.atschecker ? {} : { opacity: 0.5 }),
            }}
            title={
              !componentsAccess.atschecker
                ? "Upgrade the plan to access this feature"
                : ""
            }
            className={!componentsAccess.atschecker ? "disabled-link" : ""}
          >
            <i className="fa fa-gear"></i> ATS Checker
          </div>
          <div
            onClick={() => handleLinkClick("/Setting")}
            style={menuItemStyle}
          >
            <i className="fa fa-gear"></i> Setting
          </div>
          <button onClick={handleLogout} style={menuItemStyle}>
            <i className="fa fa-sign-out"></i> LogOut
          </button>
        </div>
      )}
      <div className="content">{renderComponent()}</div>


    </div>
  );
};

export default UserHeader;