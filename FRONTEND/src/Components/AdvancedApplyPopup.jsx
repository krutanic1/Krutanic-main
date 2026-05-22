/* eslint-disable react/prop-types, no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";
import { FaUser, FaPhone, FaEnvelope, FaBriefcase, FaGraduationCap, FaBullseye, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import krutanicLogo from "../assets/logowhite.png";
import SubhraImg from "../assets/mentors/Subhra.jpg";
import RudraImg from "../assets/mentors/rudra.jpg";
import RohanImg from "../assets/alumini/rohan.jpg";
import RajaImg from "../assets/alumini/raja.jpg";
import PrabhleenImg from "../assets/alumini/prabhleen.jpg";

// Custom Select Component for a more professional look
const CustomSelect = ({ label, icon, options, name, value, onChange, placeholder, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative group ${isOpen ? 'z-[1001]' : 'z-[1]'}`} ref={dropdownRef}>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1 flex items-center gap-2">
                {icon} {label}
            </label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 bg-slate-50 border ${isOpen ? 'border-orange-600 ring-4 ring-orange-600/5' : 'border-slate-200'} rounded-xl cursor-pointer flex items-center justify-between transition-all hover:bg-white`}
            >
                <span className={`text-sm font-medium ${!value ? 'text-slate-400' : 'text-slate-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FaChevronDown className={`text-slate-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-[1002] top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange({ target: { name, value: opt.value } });
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            {opt.label}
                            {value === opt.value && <FaCheckCircle className="text-xs" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdvancedApplyPopup = ({ onClose, initialDomain = "", onSuccess, popupType = "apply" }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        currentRole: "",
        experience: "",
        goal: "",
        interestedDomain: initialDomain,
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendOTP = async () => {
        const trimmedEmail = formData.email.trim();
        // More standard and loose regex to avoid blocking valid emails
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address (e.g. name@company.com)");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API}/advance-send-otp`, { email: trimmedEmail });
            setOtpSent(true);
            toast.success("OTP sent to your email");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Error sending OTP. Please try again.";
            toast.error(errorMsg);
            console.error("OTP send error:", error);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }
        setLoading(true);
        try {
            const trimmedEmail = formData.email.trim();
            const trimmedOtp = otp.trim();
            console.log("Verifying OTP for:", trimmedEmail, "with code:", trimmedOtp);
            const response = await axios.post(`${API}/advance-verify-otp`, {
                email: trimmedEmail,
                otp: trimmedOtp,
            });
            if (response.data.success || response.data.token) {
                setEmailVerified(true);
                setOtpSent(false);
                toast.success("Email verified successfully");
            } else {
                toast.error("Invalid OTP");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid OTP. Please check and try again.";
            toast.error(errorMsg);
            console.error("OTP verify error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!emailVerified) {
            toast.error("Please verify your email first.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API}/advance/register`, {
                ...formData,
                phone: formData.number,
                domain: formData.interestedDomain, // Map to what the backend expects
            });
            toast.success("Application submitted successfully!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0b]/80 backdrop-blur-md p-4 md:p-6 overflow-y-auto animate-in fade-in duration-300">
            <div className="w-full max-w-[950px] my-auto h-fit min-h-[500px] md:h-[650px] bg-white rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-white/10">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    title="Close"
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#ff4d4d', // Red for clear visibility
                        color: 'white',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        zIndex: 200,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ✕
                </button>

                {/* Left Side: Professional Info Column */}
                <div className="hidden md:flex md:w-[38%] bg-[#050d2f] p-10 flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
                    
                    <div className="relative z-10">
                        <div className="mb-8 drop-shadow-2xl">
                            <img src={krutanicLogo} alt="Krutanic Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
                            Your Path to <span className="text-orange-500 underline decoration-orange-500/30 underline-offset-4">Advanced</span> Success.
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-10">
                            Join our elite upskilling programs designed for modern tech leaders.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: <FaCheckCircle />, title: "Premium Curriculum", desc: "Designed by industry veterans" },
                                { icon: <FaCheckCircle />, title: "AI-First Approach", desc: "Modern tech stack integration" },
                                { icon: <FaCheckCircle />, title: "Guaranteed Referrals", desc: "Network of 500+ partners" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-orange-500 mt-1">{item.icon}</div>
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-wide">{item.title}</p>
                                        <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/10">
                        <div className="flex -space-x-3 mb-4">
                            {[SubhraImg, RudraImg, RohanImg, RajaImg, PrabhleenImg].map((img, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050d2f] bg-slate-800 overflow-hidden shadow-xl">
                                    <img src={img} alt="alumni" className="w-full h-full object-cover object-top" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#050d2f] bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                                +5k
                            </div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Join thousands of successful alumni working at top tech giants globaly.</p>
                    </div>
                </div>

                {/* Right Side: Professional Form Column */}
                <div className="w-full md:w-[62%] bg-white p-8 md:p-12 flex flex-col h-full overflow-hidden">
                    <div className="mb-0">
                        <h3 className="text-2xl font-black text-[#050d2f]">
                            {popupType === "brochure" ? "Download Curriculum" : "Program Application"}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            {popupType === "brochure" 
                                ? "Complete the details to access the complete syllabus."
                                : "Complete the steps below to secure your spot."}
                        </p>
                    </div>

                    <form id="advanced-apply-form" onSubmit={handleFormSubmit} className="mt-8 space-y-6 flex-1 overflow-y-auto px-1 custom-scrollbar pr-5 pb-20">
                        {/* Name & Phone Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                                        <FaUser size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Carter"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                                        <FaPhone size={14} />
                                    </div>
                                    <input
                                        type="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your 10 digit mobile"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email with Logic */}
                        <div className="relative group">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">Work/Personal Email</label>
                            <div className="relative flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                                        <FaEnvelope size={14} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={emailVerified}
                                        required
                                        placeholder="john.carter@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                {!emailVerified && !otpSent && (
                                    <button
                                        type="button"
                                        onClick={sendOTP}
                                        disabled={loading}
                                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md active:scale-95"
                                    >
                                        Verify
                                    </button>
                                )}
                            </div>

                            {otpSent && !emailVerified && (
                                <div className="mt-4 flex gap-2 animate-in slide-in-from-top-4 duration-300">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="6-Digit OTP"
                                        className="flex-1 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:bg-white focus:border-orange-600 outline-none transition-all text-sm text-center font-black tracking-[0.4em]"
                                    />
                                    <button
                                        type="button"
                                        onClick={verifyOTP}
                                        className="px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            )}

                            {emailVerified && (
                                <div className="mt-2 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest ml-1">
                                    <FaCheckCircle className="animate-bounce" /> Status: Verified
                                </div>
                            )}
                        </div>

                        {/* Custom Selects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <CustomSelect
                                label="Current Role"
                                icon={<FaGraduationCap className="text-orange-500" />}
                                name="currentRole"
                                value={formData.currentRole}
                                onChange={handleInputChange}
                                placeholder="What's your role?"
                                options={[
                                    { value: "Student", label: "Student" },
                                    { value: "Working Professional", label: "Working Professional" },
                                    { value: "Self Employed", label: "Self Employed" }
                                ]}
                            />
                            <CustomSelect
                                label="Experience"
                                icon={<FaBriefcase className="text-orange-500" />}
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="Years of exp."
                                options={[
                                    { value: "Fresher", label: "0 (Fresher)" },
                                    { value: "1-2 years", label: "1-2 Years" },
                                    { value: "3-5 years", label: "3-5 Years" },
                                    { value: "5+ years", label: "5+ Years" }
                                ]}
                            />
                        </div>

                        <CustomSelect
                            label="Target Program"
                            icon={<FaBullseye className="text-orange-500" />}
                            name="interestedDomain"
                            value={formData.interestedDomain}
                            onChange={handleInputChange}
                            placeholder="Select intended learning path"
                            options={[
                                { value: "Data Science Advanced Program", label: "Data Science Advanced Program" },
                                { value: "Data Analytics Advanced Program", label: "Data Analytics Advanced Program" },
                                { value: "Digital Marketing Advanced Program", label: "Digital Marketing Advanced Program" },
                                { value: "Prompt Engineering with GenAI Advanced Program", label: "Prompt Engineering with GenAI Advanced Program" },
                                { value: "Product Management Advanced Program", label: "Product Management Advanced Program" },
                                { value: "MERN Stack Development Advanced Program", label: "MERN Stack Development Advanced Program" }
                            ]}
                        />

                        <CustomSelect
                            label="Primary Goal"
                            icon={<FaCheckCircle className="text-orange-500" />}
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                            placeholder="What do you want to achieve?"
                            options={[
                                { value: "Career Transition", label: "Career Transition" },
                                { value: "Upskilling", label: "Upskilling" },
                                { value: "Other", label: "Other" }
                            ]}
                        />

                        {/* Authorization Checkbox */}
                        <div className="flex items-start gap-3 mt-4 mb-2 animate-in fade-in duration-500">
                            <input 
                                type="checkbox" 
                                id="authorize_popup" 
                                required 
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                            />
                            <label htmlFor="authorize_popup" className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed cursor-pointer select-none">
                                I authorise <span className="font-bold">Krutanic</span> & its representatives to contact me with updates and notifications via Email/SMS/WhatsApp/Call. This will override DND/NDNC
                            </label>
                        </div>

                    </form>
                    
                    {/* Submit Footer - Moved outside scrollable area */}
                    <div className="pt-6 mt-auto flex gap-3 border-t border-slate-100 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: '#f1f5f9',
                                color: '#64748b',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '11px',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="advanced-apply-form"
                            disabled={!emailVerified || loading}
                            className="flex-[2] py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/30 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 group"
                        >
                            {loading ? "Securely Submitting..." : (popupType === "brochure" ? "Get Brochure" : "Send Application")} 
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>,
        document.body
    );
};

export default AdvancedApplyPopup;
