import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/whitelogo.png";
import { Toaster, toast } from "react-hot-toast";

const AdminHeader = () => {
    const [isMobileVisible, setisMobileVisible] = useState(false);
    const mobileMenuRef = useRef(null);
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

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("adminTkn");
        toast.success('Logout successful!!!');
        setTimeout(() => {
            navigate("/");
        }, 1000);
    };
    return (
        <div id="AdminHeader">
             <Toaster/>
            <div className="navbar">
                <div>
                    <img src={logo} alt="Logo" />
                </div>
                <div ref={mobileMenuRef}>
                    <span onClick={toggleVisibility}>☰</span>
                </div>
            </div>
            {isMobileVisible && (
                <div className="sidebar">
                    <Link to="/dashboard"><i class="fa fa-home"></i> Home</Link>
                    <Link to="/adduser"><i class="fa fa-user"></i> Add User</Link>
                    <Link to="/certificate"><i class="fa fa-certificate"></i> Certificate</Link>
                    <button onClick={handleLogout}><i className="fa fa-sign-out"></i> Logout</button>
                </div>
            )}
        </div>
    );
};

export default AdminHeader;