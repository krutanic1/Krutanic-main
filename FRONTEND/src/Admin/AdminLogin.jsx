import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import toast ,{Toaster} from 'react-hot-toast';


const AdminLogIn = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isTimerActive, setIsTimerActive] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
      await axios.post(`${API}/otpsend`, { email });
      setIsOtpSent(true);
      setTimeLeft(120);
      setIsTimerActive(true);
    } catch (err) {
      toast.error("You are not Admin");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
    const response =   await axios.post(`${API}/otpverify`, { email, otp });
      if(response.status === 200){
        toast.success('login successful!!!');
        setTimeout(() => {
           localStorage.setItem("adminToken", response.data.token);
          navigate("/AdminDashboard");
        }, 1500);
      }
    } catch (err) {
      toast.error("Failed to verify OTP");
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
    setOtp(""); 
  };

  return (
    <div id="loginpage">
       <Toaster position="top-center" reverseOrder={false}/>
       <div className="loginform">
        <h2>Admin LogIn</h2>
          <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {isOtpSent && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <div className="flex justify-around items-center ">
                <span className="text-gray-500">Time left: {timeLeft}s</span>
                {timeLeft === 0 && (
                  <button
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
          <button
            onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </button>
          {/* <p>--------------------or--------------------</p>
        <div className="loginwith">
          <Link to="/LoginAdmin">Login with password</Link>
        </div> */}
          
          </div>
        </div>
    </div>
  );
};

export default AdminLogIn;
