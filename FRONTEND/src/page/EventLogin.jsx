import React, { useState } from 'react';
import logo from '../assets/LOGO3.png';
import quiz from '../assets/quiz.jpg';

import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import API from '../API';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const EventLogin = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we need to redirect back to Talent Hunt after login
    const from = location.state?.from?.pathname || "/events";

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API}/eventsendotp`, { email });
            if (response.status === 200) {
                toast.success("OTP sent successfully to your email");
                setShowOtp(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP. User not found?");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API}/eventverifyotp`, {
                email,
                otp,
            });

            if (response.status === 200) {
                toast.success("Login successful!");
                localStorage.setItem("eventuserId", response.data._id);
                localStorage.setItem("eventuserEmail", response.data.email);
                localStorage.setItem("eventToken", response.data.token);
                localStorage.setItem("eventUserName", response.data.name);

                setTimeout(() => {
                    navigate("/EventDashboard");
                }, 1000);
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error("Your account is inactive.");
            } else if (error.response?.status === 400) {
                toast.error("Invalid or expired OTP.");
            } else {
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Toaster position="top-center" />

            {/* Header Navigation */}
            <div id="header">
                <div className="navbar">
                    <div>
                        <Link to="/">
                            <img src={logo} alt="Krutanic Logo" />
                        </Link>
                    </div>
                    <div className="menu" style={{ display: 'flex' }}>
                        <Link to="/events">
                            EVENTS
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section with Login */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundImage: `url(${quiz})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 flex justify-center items-center">
                    {/* Right Side - Login Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Event Login
                            </h2>
                            <p className="text-gray-600">Enter your email to access your events</p>
                            {location.state?.message && (
                                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                                    <p className="text-blue-800 text-sm font-medium">{location.state.message}</p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={showOtp ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={showOtp}
                                    className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all ${showOtp ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400'}`}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>

                            {showOtp && (
                                <div className="space-y-2 animate-fade-in">
                                    <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        required
                                    />
                                    <div className="flex justify-between items-center pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowOtp(false)}
                                            className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                        >
                                            ← Change Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    showOtp ? "Verify & Login →" : "Send OTP →"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                New to Krutanic Events?{" "}
                                <Link to="/EventRegister" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    Create an account
                                </Link>
                            </p>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventLogin;
