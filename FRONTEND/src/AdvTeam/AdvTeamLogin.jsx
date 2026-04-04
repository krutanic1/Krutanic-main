import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from 'react-hot-toast';

const AdvTeamLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Send OTP 
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/advteamsendotp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/advteamverifyotp`, { email, otp });
      if (response.status === 200) {
        toast.success("Login successful!");
        const loginTime = new Date().getTime();
        setTimeout(() => {
          localStorage.setItem("advTeamEmail", email);
          localStorage.setItem("advTeamId", response.data.bdaId);
          localStorage.setItem("advTeamName", response.data.bdaName);
          localStorage.setItem("advTeamToken", response.data.token);
          localStorage.setItem("advTeamDesignation", response.data.user.role);
          localStorage.setItem("advTeamTeam", response.data.user.team);
          localStorage.setItem("advTeamSessionStartTime", loginTime);
          navigate("/advteam/home");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP!");
    }
  };

  return (
    <div id="loginpage">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="loginform">
        <h2>Advance Team Login</h2>
        <p className="text-sm text-gray-600 mb-4">Login with your official email ID</p>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Company Email</label>
            </div>
            <div>
              <button disabled={loading} type="submit">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="input-field">
              <input
                type="text"
                id="otp"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label htmlFor="otp">OTP</label>
            </div>
            <div>
              <button type="submit">Verify OTP</button>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 mt-2"
              onClick={() => setStep(1)}
            >
              ← Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdvTeamLogin;
