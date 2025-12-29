import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }
    try {
      const response = await axios.post(`${API}/checkadmin`, {
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Login successful!");
        setTimeout(() => {
          localStorage.setItem("adminToken", response.data.token);
          navigate("/AdminDashboard");
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div id="loginpage">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="loginform">
        <h2>Admin LogIn</h2>
         <form onSubmit={handleLogin}>
           <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="off"
        />
        <span
          className=" absolute mt-2 right-9 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
        <button >Log In</button>
         </form>
        <p>--------------------or--------------------</p>
        <div className="loginwith">
          <Link to="/AdminLogin">Login with OTP</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
