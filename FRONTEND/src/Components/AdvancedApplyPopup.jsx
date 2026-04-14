import React, { useState } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";
import "../page/MentorshipForm.css";

const AdvancedApplyPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        currentRole: "",
        experience: "",
        goal: "",
        goalOther: "",
        reason: "",
        domain: "",
        domainOther: "",
        interestedDomain: "",
        passedOutYear: ""
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendOTP = async () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            const response = await axios.post(`${API}/api/atd/send-otp`, { email: formData.email });
            if (response.data.success) {
                setOtpSent(true);
                toast.success("OTP sent to your email");
            } else {
                toast.error(response.data.message || response.data.error || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data?.error || "Error sending OTP");
        }
    };

    const verifyOTP = async () => {
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }
        try {
            const response = await axios.post(`${API}/api/atd/verify-otp`, {
                email: formData.email,
                otp: otp,
            });
            if (response.data.success || response.data.token) {
                setEmailVerified(true);
                setOtpSent(false);
                toast.success("Email verified successfully");
            } else {
                toast.error(response.data.message || response.data.error || "Invalid OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data?.error || "Invalid OTP");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!emailVerified) {
            toast.error("Please verify your email first.");
            return;
        }
        try {
            await axios.post(`${API}/advance/register`, {
                ...formData,
                phone: formData.number,
                goal: formData.goal === "Other" ? formData.goalOther : formData.goal,
                domain: formData.domain === "Other" ? formData.domainOther : formData.domain,
            });
            toast.success("Application submitted successfully!");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        }
    };

    return (
        <div className="shared-form-overlay">
            <div className="shared-form-shell max-w-[800px] lg:flex lg:flex-row flex-col">
                <button onClick={onClose} className="shared-form-close z-50">
                    <i className="fa fa-times"></i>
                </button>
                
                {/* Left Side: Info */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#f15b29] to-[#ff8a4c] text-white p-10 flex-col justify-between">
                    <div className="relative z-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                            Advance Program
                        </div>
                        <h2 className="text-3xl font-extrabold leading-tight mb-4 text-white">Elevate Your Career Path</h2>
                        <p className="text-white/90 text-sm leading-relaxed mb-8">
                            Join our elite program with 1:1 mentorship and hands-on projects designed for industry leaders.
                        </p>
                        
                        <ul className="space-y-4 text-sm text-white">
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</div>
                                50+ Real-world Projects
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</div>
                                AI-Powered Learning
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</div>
                                Dedicated Career Coach
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-7/12 bg-white flex flex-col h-full">
                    <div className="p-8 pb-4 border-b">
                        <h2 className="text-2xl font-bold text-[#111]">Application Form</h2>
                        <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
                    </div>

                    <div className="shared-form-body p-8 pt-6 max-h-[60vh] overflow-y-auto">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="shared-form-field">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Full Name</label>
                                    <input type="text" name="name" placeholder="" value={formData.name} onChange={handleInputChange} required className="focus:border-[#f15b29] focus:ring-[#f15b29]/10" />
                                </div>
                                <div className="shared-form-field">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Phone Number</label>
                                    <input type="number" name="number" placeholder="" value={formData.number} onChange={handleInputChange} required className="focus:border-[#f15b29] focus:ring-[#f15b29]/10" />
                                </div>
                            </div>

                            <div className="shared-form-field">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Email Address</label>
                                <div className="flex gap-2">
                                    <input type="email" name="email" placeholder="" value={formData.email} onChange={handleInputChange} disabled={emailVerified} required className="flex-1 focus:border-[#f15b29] focus:ring-[#f15b29]/10" />
                                    {!emailVerified && !otpSent && (
                                        <button type="button" onClick={sendOTP} className="px-4 py-2 bg-[#111] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">Verify</button>
                                    )}
                                </div>
                            </div>

                            {otpSent && !emailVerified && (
                                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-2">
                                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="" className="flex-1 bg-white focus:border-[#f15b29] focus:ring-[#f15b29]/10" />
                                    <button type="button" onClick={verifyOTP} className="px-4 py-2 bg-[#f15b29] text-white rounded-xl text-xs font-bold hover:bg-[#e45a16] transition-colors">Verify OTP</button>
                                </div>
                            )}

                            {emailVerified && <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 ml-1">✓ Email Verified Successfully</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="shared-form-field">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Current Role</label>
                                    <select name="currentRole" value={formData.currentRole} onChange={handleInputChange} required className="focus:border-[#f15b29] focus:ring-[#f15b29]/10">
                                        <option value="" disabled>Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">Working Professional</option>
                                        <option value="Self Employed">Self Employed</option>
                                    </select>
                                </div>
                                <div className="shared-form-field">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Experience</label>
                                    <select name="experience" value={formData.experience} onChange={handleInputChange} required className="focus:border-[#f15b29] focus:ring-[#f15b29]/10">
                                        <option value="" disabled>Select Experience</option>
                                        <option value="Fresher">0 (Fresher)</option>
                                        <option value="1-2 years">1-2 Years</option>
                                        <option value="3-5 years">3-5 Years</option>
                                        <option value="5+ years">5+ Years</option>
                                    </select>
                                </div>
                            </div>

                                <div className="shared-form-field">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Interested Domain</label>
                                    <select name="interestedDomain" value={formData.interestedDomain} onChange={handleInputChange} required>
                                        <option value="" disabled>Select Domain</option>
                                        <option value="Data Science Advanced Program">Data Science Advanced Program</option>
                                        <option value="Data Analytics Advanced Program">Data Analytics Advanced Program</option>
                                        <option value="Digital Marketing Advanced Program">Digital Marketing Advanced Program</option>
                                        <option value="Prompt Engineering with GenAI Advanced Program">Prompt Engineering with GenAI Advanced Program</option>
                                        <option value="Product Management Advanced Program">Product Management Advanced Program</option>
                                        <option value="MERN Stack Development Advanced Program">MERN Stack Development Advanced Program</option>
                                    </select>
                                </div>

                            <div className="shared-form-field">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Target Goal</label>
                                <select name="goal" value={formData.goal} onChange={handleInputChange} required className="focus:border-[#f15b29] focus:ring-[#f15b29]/10">
                                    <option value="" disabled>What is your goal?</option>
                                    <option value="Career Transition">Career Transition</option>
                                    <option value="Upskilling">Upskilling</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <button type="submit" disabled={!emailVerified} className="w-full py-4 bg-[#f15b29] text-white font-bold rounded-2xl hover:bg-[#e45a16] transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedApplyPopup;
