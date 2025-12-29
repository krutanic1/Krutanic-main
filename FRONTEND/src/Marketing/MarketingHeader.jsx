import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import axios from "axios";
import logo from "../assets/LOGO3.png";
import toast, { Toaster } from "react-hot-toast";

const MarketingHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(false);
  const mobileMenuRef = useRef(null);
  const [marketingData, setMarketingData] = useState(null);
  const navigate = useNavigate();

  const toggleVisibility = () => {
    setisMobileVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setisMobileVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast.success("Logout successful!!!");
    setTimeout(() => {
      localStorage.removeItem("marketingUser");
      localStorage.removeItem("marketingToken");
      navigate("/marketing/login");
    }, 1500);
  };

  const fetchMarketingData = async () => {
    const marketingToken = localStorage.getItem("marketingToken");
    if (!marketingToken) {
      console.log("Marketing User not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getmarketinguser`, {
        params: { marketingToken },
      });
      setMarketingData(response.data);
      console.log(response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  return (
    <div id="MarketingHeader">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div ref={mobileMenuRef}>
          <span onClick={toggleVisibility}>☰</span>
        </div>
      </div>
      {isMobileVisible && (
        <div className="sidebar">
          <Link to="/marketing/home">
            {" "}
            <i className="fa fa-home"></i> HOME{" "}
          </Link>
          <Link to="/marketing/previous">
            {" "}
            <i className="fa fa-calendar"></i> Previous Month{" "}
          </Link>
          {["LEADER", "MANAGER"].includes(marketingData?.designation) && (
            <>
            <Link to="/marketing/leads">
            {" "}
            <i className="fa fa-users"></i> All Leads{" "}
          </Link>
          <Link to="/marketing/addexecutive">
            {" "}
            <i className="fa fa-users"></i> + Executive{" "}
          </Link>
            </>
          )}
          <button onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketingHeader;
