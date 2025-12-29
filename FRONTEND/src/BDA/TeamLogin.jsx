
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import API from "../API";
import toast ,{Toaster} from 'react-hot-toast';

const TeamLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 // Send OTP 
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/bdasendotp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    }finally {
      setLoading(false);
    }
  };

  //  Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/bdaverifyotp`, { email, otp });
      if (response.status === 200) {
      toast.success("Login successful!");
      const loginTime = new Date().getTime();
      setTimeout(() => {
      localStorage.setItem("bdaId", response.data.bdaId);
      localStorage.setItem("bdaName", response.data.bdaName);
      localStorage.setItem("bdaToken", response.data.token);
       localStorage.setItem("sessionStartTime", loginTime);
      navigate("/Home");
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
        <h2>Login With Offical Email Id</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="input-field">
              <input
                type="email"
                id="email"
                // placeholder="Enter company mail id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
               <label htmlFor="email">Company Email</label>
            </div>
            <div>
              <button disabled={loading} type="submit">{loading ? "Sending..." : "Send OTP"}</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="input-field">
              <input
                type="text"
                id="otp"
                // placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label htmlFor="otp">OTP</label>
            </div>
            <div>
              <button type="submit">Verify OTP</button>
            </div>
          </form>
        )}
        {/* <p>--------------------or--------------------</p>
        <div className="loginwith">
          <Link to="/BDAAgainLogin">Login with password</Link>
        </div> */}
      </div>
    </div>
  );
};

export default TeamLogin ;