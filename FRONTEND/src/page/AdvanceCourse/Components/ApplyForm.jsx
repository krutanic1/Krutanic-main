import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from "../../../API";
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaBullseye, FaCheckCircle, FaChevronDown, FaArrowRight } from "react-icons/fa";

// Custom Select Component for a more professional look
const CustomSelect = ({ label, icon, options, name, value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
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
    <div className={`relative group flex flex-col gap-2 ${isOpen ? 'z-[1001]' : 'z-[1]'}`} ref={dropdownRef}>
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 bg-gray-50 border ${isOpen ? 'border-[#f15b29] ring-4 ring-[#f15b29]/5' : 'border-gray-100'} rounded-2xl cursor-pointer flex items-center justify-between transition-all hover:bg-white`}
      >
        <span className={`text-sm font-medium ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#f15b29]' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[1002] top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === opt.value ? 'bg-orange-50 text-[#f15b29] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
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

const ApplyForm = ({ courseValue = "this program", isPremium = false }) => {
  const [loading, setLoading] = useState(false);
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
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOTP = async () => {
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/advance-send-otp`, { email: trimmedEmail });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const trimmedOtp = otp.trim();
    const trimmedEmail = formData.email.trim();
    if (!trimmedOtp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/advance-verify-otp`, {
        email: trimmedEmail,
        otp: trimmedOtp,
      });
      if (response.data.success || response.data.token) {
        toast.success("Email verified successfully!");
        setEmailVerified(true);
        setOtp("");
        setOtpSent(false);
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (error) {
      toast.error("Verification failed or Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailVerified) {
      toast.error("Please verify your email before submitting.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/advance/register`, {
        ...formData,
        phone: formData.number,
        domain: formData.domain === "Other" ? formData.domainOther : formData.domain,
        goal: formData.goal === "Other" ? formData.goalOther : formData.goal,
        interestedDomain: courseValue,
      });
      toast.success(`Successfully applied! Our counselor will connect with you shortly.`);
      setFormData({
        name: "", email: "", number: "", currentRole: "", experience: "",
        goal: "", goalOther: "", reason: "", domain: "", domainOther: ""
      });
      setEmailVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16" data-aos="fade-up">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        {/* Form Header */}
        {!isPremium && (
          <div className="bg-[#050d2f] p-10 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 relative z-10">
              Apply for <span className="text-[#f15b29]">{courseValue}</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed relative z-10">
              Complete your application to gain access to world-class mentorship and industry-leading program resources.
            </p>
          </div>
        )}

        {/* Form Content */}
        <div className={isPremium ? "p-4 md:p-2" : "p-8 md:p-12"}>
          <form onSubmit={handleFormSubmit} className={`grid grid-cols-1 md:grid-cols-2 ${isPremium ? 'gap-4' : 'gap-8'}`}>
            
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f15b29] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#f15b29] outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f15b29] transition-colors" />
                <input
                  type="text"
                  name="number"
                  placeholder="10-digit number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#f15b29] outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Email & OTP Section */}
            <div className={`flex flex-col gap-2 ${isPremium ? 'md:col-span-1' : 'md:col-span-2'}`}>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="flex flex-col gap-2">
                <div className="relative group flex-1">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f15b29] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={emailVerified}
                    required
                    className={`w-full pl-12 pr-4 ${isPremium ? 'py-3' : 'py-4'} bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#f15b29] outline-none transition-all font-medium text-gray-900 disabled:opacity-50`}
                  />
                </div>
                
                {!emailVerified && !otpSent && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    className={`bg-[#050d2f] text-white ${isPremium ? 'px-4 py-2 text-xs' : 'px-8 py-4'} rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap`}
                    disabled={loading}
                  >
                    Verify Email
                  </button>
                )}
                
                {emailVerified && (
                  <div className={`flex items-center gap-2 ${isPremium ? 'px-4 py-2' : 'px-6 py-4'} bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-xs`}>
                    <FaCheckCircle /> Verified
                  </div>
                )}
              </div>

              {otpSent && !emailVerified && (
                <div className="mt-2 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col gap-2 animate-in slide-in-from-top-4 duration-300">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="w-full px-4 py-2 rounded-xl border-none outline-none font-bold text-center tracking-widest text-base"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="bg-[#f15b29] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#d64a1d] transition-all whitespace-nowrap text-sm"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>

            {/* Select Fields */}
            <CustomSelect
              label="Current Status"
              icon={<FaGraduationCap />}
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
              label="Experience Level"
              icon={<FaBriefcase />}
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

            <div className={isPremium ? 'md:col-span-2' : ''}>
              <CustomSelect
                label="Current Domain"
                icon={<FaBullseye />}
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="Domain working in"
                options={[
                  { value: "Digital Marketing", label: "Digital Marketing" },
                  { value: "Marketing/Sales", label: "Marketing/Sales" },
                  { value: "Operations", label: "Management/Operations" },
                  { value: "Tech", label: "IT/Tech/Product" },
                  { value: "Other", label: "Other" }
                ]}
              />
            </div>

            <div className="md:col-span-2">
              <CustomSelect
                label="Career Goal"
                icon={<FaArrowRight />}
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="Primary motivation"
                options={[
                  { value: "Career Transition", label: "Career Transition" },
                  { value: "Upskilling", label: "Upskilling" },
                  { value: "Kickstart Career", label: "Kickstart Career" },
                  { value: "Other", label: "Other" }
                ]}
              />
            </div>

            {/* Conditional "Other" inputs */}
            {(formData.domain === "Other" || formData.goal === "Other") && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                {formData.domain === "Other" && (
                  <input
                    type="text"
                    name="domainOther"
                    placeholder="Specify your domain"
                    value={formData.domainOther}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-[#f15b29]/30 rounded-2xl focus:border-[#f15b29] outline-none font-medium"
                    required
                  />
                )}
                {formData.goal === "Other" && (
                  <input
                    type="text"
                    name="goalOther"
                    placeholder="Specify your goal"
                    value={formData.goalOther}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white border border-[#f15b29]/30 rounded-2xl focus:border-[#f15b29] outline-none font-medium"
                    required
                  />
                )}
              </div>
            )}

            {/* Authorization Checkbox */}
            <div className="md:col-span-2 flex items-start gap-3 mt-2 animate-in fade-in duration-500">
              <input 
                type="checkbox" 
                id="authorize_form" 
                required 
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#f15b29] focus:ring-[#f15b29] cursor-pointer"
              />
              <label htmlFor="authorize_form" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                I authorise <span className="font-bold text-gray-700">Krutanic</span> & its representatives to contact me with updates and notifications via Email/SMS/WhatsApp/Call. This will override DND/NDNC
              </label>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading || !emailVerified}
                className={`w-full ${isPremium ? 'py-4' : 'py-6'} bg-[#f15b29] text-white font-black text-lg rounded-2xl hover:bg-[#d64a1d] transition-all shadow-[0_20px_40px_rgba(241,91,41,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 uppercase tracking-widest`}
              >
                {loading ? "Processing..." : isPremium ? "Request Consultation" : "Submit My Application"}
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              {!isPremium && (
                <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                  By clicking submit, you agree to our Terms of Service and Privacy Policy.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;


