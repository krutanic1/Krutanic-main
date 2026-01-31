import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import API from "../API";
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/LOGO3.png';
import quiz from '../assets/quiz.jpg';


const EventRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        collegeName: "",
        collegeEmailId: "",
        yearofstudy: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API}/eventregistration`, formData);
            if (response.status === 201) {
                toast.success("Registration successful! Please login.");
                setTimeout(() => {
                    navigate("/EventLogin");
                }, 1500);
            }
        } catch (error) {
            console.error("Registration Error", error);
            if (error.response && error.response.status === 400) {
                toast.error("User already exists with this email.");
            } else {
                toast.error("Registration failed. Please try again.");
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
                        <Link to="/TalentHunt">
                            EVENTS
                        </Link>
                        <Link to="/EventLogin" className="btn">
                            LOGIN
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section with Registration Form */}
            <div className="flex-1 relative overflow-hidden" style={{ backgroundImage: `url(${quiz})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 flex justify-center items-center">
                    {/* Right Side - Registration Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="collegeName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    College Name
                                </label>
                                <input
                                    type="text"
                                    id="collegeName"
                                    name="collegeName"
                                    placeholder="Enter your college name"
                                    value={formData.collegeName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="collegeEmailId" className="block text-sm font-semibold text-gray-700 mb-2">
                                    College Email <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="email"
                                    id="collegeEmailId"
                                    name="collegeEmailId"
                                    placeholder="college.email@university.edu"
                                    value={formData.collegeEmailId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="yearofstudy" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Year of Study
                                </label>
                                <select
                                    id="yearofstudy"
                                    name="yearofstudy"
                                    value={formData.yearofstudy}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all hover:border-blue-400 bg-white"
                                    required
                                >
                                    <option value="" disabled hidden>Select your year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Post Graduation">Post Graduation</option>
                                    <option value="Passed Out">Passed Out</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Register Now →"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600">
                                Already have an account?{" "}
                                <Link to="/EventLogin" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRegister;
