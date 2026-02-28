import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API}/send-otp`, { email });
            if (response.status === 200) {
                toast.success('OTP sent to your email');
                setStep(2);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API}/verify-otp`, { email, otp });
            if (response.status === 200) {
                toast.success('OTP verified successfully');
                setStep(3);
                // The verify-otp route implicitly logs the user in by sending a token.
                // Since this is a password reset flow, we should remove the session variables right after.
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userEmail');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${API}/updatepassword`, { email, newPassword });
            if (response.status === 200) {
                toast.success('Password updated successfully');
                setTimeout(() => navigate('/Login'), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="loginpage">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="loginform">
                <h2>Forgot Password</h2>

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="input-field">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Registered Email</label>
                        </div>
                        <button disabled={loading} type="submit">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-field">
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <label>Enter OTP</label>
                        </div>
                        <button disabled={loading} type="submit">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="input-field">
                            <input
                                type="text" // To allow the user to see the characters they are inputting, we can use text or password
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <label>New Password</label>
                        </div>
                        <button disabled={loading} type="submit">
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <p style={{ marginTop: '20px' }}>--------------------or--------------------</p>
                <div className="loginwith">
                    <Link to="/Login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
