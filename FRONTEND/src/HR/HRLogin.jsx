import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from 'react-hot-toast';

const HRLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/hrsendotp`, { email });
      toast.success("OTP sent to your HR email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/hrverifyotp`, { email, otp });
      if (response.status === 200) {
        toast.success("Login successful!");
        const loginTime = new Date().getTime();
        setTimeout(() => {
          localStorage.setItem("hrId", response.data.hrId);
          localStorage.setItem("hrName", response.data.hrName);
          localStorage.setItem("hrToken", response.data.token);
          localStorage.setItem("sessionStartTime", loginTime);
          navigate("/hrdashboard");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP!");
    }
  };

  return (
    <div id="loginpage">
      <Toaster position="top-center" reverseOrder={false}/>
      <div className="loginform">
        <h2>HR Portal Login</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Access the employee attendance management system</p>
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
              <label htmlFor="email">Official HR Email</label>
            </div>
            <div>
              <button disabled={loading} type="submit">
                {loading ? "Sending..." : "Send Verification OTP"}
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
              <label htmlFor="otp">Enter 6-Digit OTP</label>
            </div>
            <div>
              <button type="submit">Verify & Login</button>
            </div>
            <p 
              onClick={() => setStep(1)} 
              style={{ cursor: 'pointer', color: '#FF6B00', fontSize: '13px', marginTop: '10px', textAlign: 'center' }}
            >
              Back to Email
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default HRLogin;
