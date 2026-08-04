/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaGraduationCap,
  FaBullseye,
  FaCheckCircle,
  FaChevronDown,
  FaRedo,
} from "react-icons/fa";
import krutanicLogo from "../assets/logowhite.png";
import SubhraImg from "../assets/mentors/Subhra.jpg";
import RudraImg from "../assets/mentors/rudra.jpg";
import RohanImg from "../assets/alumini/rohan.jpg";
import RajaImg from "../assets/alumini/raja.jpg";
import PrabhleenImg from "../assets/alumini/prabhleen.jpg";

// ─── Custom Select ─────────────────────────────────────────────────────────────
const CustomSelect = ({
  label,
  icon,
  options,
  name,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      className={`relative ${isOpen ? "z-[1001]" : "z-[1]"}`}
      ref={dropdownRef}
    >
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2 ml-1">
        {icon} {label}
      </label>
      <div
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full px-4 py-3 bg-slate-50 border ${
          isOpen
            ? "border-orange-600 ring-4 ring-orange-600/5"
            : "border-slate-200"
        } rounded-xl cursor-pointer flex items-center justify-between transition-all hover:bg-white select-none`}
      >
        <span
          className={`text-sm font-medium ${
            !value ? "text-slate-400" : "text-slate-900"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          className={`text-slate-400 text-xs transition-transform duration-300 ${
            isOpen ? "rotate-180 text-orange-600" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-[1002] top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] py-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                value === opt.value
                  ? "bg-orange-50 text-orange-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
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

// ─── Main Popup ────────────────────────────────────────────────────────────────
const AdvancedApplyPopup = ({
  onClose,
  initialDomain = "",
  onSuccess,
  popupType = "apply",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentRole: "",
    experience: "",
    goal: "",
    interestedDomain: initialDomain,
    domain: "",
    domainOther: "",
    reason: "",
    passedOutYear: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Phone: allow digits only, max 10 chars ──
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
  };

  // ── Validate email locally ──
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // ── Send OTP ──
  const sendOTP = async () => {
    const email = formData.email.trim();
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${API}/advance-send-otp`, { email });
      setOtpSent(true);
      setOtp("");
      toast.success("OTP sent to your email! Check your inbox.");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Verify OTP ──
  const verifyOTP = async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      toast.error("Please enter the OTP.");
      return;
    }
    if (trimmedOtp.length !== 6 || isNaN(trimmedOtp)) {
      toast.error("OTP must be a 6-digit number.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API}/advance-verify-otp`, {
        email: formData.email.trim(),
        otp: trimmedOtp,
      });
      if (response.data.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setOtp("");
        toast.success("Email verified successfully! ✓");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid OTP. Please check and try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Submit form ──
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!emailVerified) {
      toast.error("Please verify your email first.");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.currentRole) {
      toast.error("Please select your current role.");
      return;
    }
    if (!formData.experience) {
      toast.error("Please select your experience level.");
      return;
    }
    if (!formData.goal) {
      toast.error("Please select your primary goal.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/advance/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        currentRole: formData.currentRole,
        experience: formData.experience,
        goal: formData.goal,
        interestedDomain: formData.interestedDomain,
        domain: formData.domain,
        domainOther: formData.domain === "Other" ? formData.domainOther.trim() : "",
        reason: formData.reason,
        passedOutYear: formData.passedOutYear.trim(),
      });
      toast.success("Application submitted successfully! We'll be in touch soon.");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Submission failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Close on Escape key ──
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0b]/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[950px] my-auto bg-white rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row border border-white/10">

        {/* Close Button */}
        <button
          onClick={onClose}
          title="Close (Esc)"
          className="absolute top-5 right-5 z-[200] w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-base font-bold transition-all hover:scale-110 shadow-md"
        >
          ✕
        </button>

        {/* ── Left Panel ── */}
        <div className="hidden md:flex md:w-[38%] bg-[#050d2f] p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-8">
              <img
                src={krutanicLogo}
                alt="Krutanic"
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Your Path to{" "}
              <span className="text-orange-500">Advanced</span> Success.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">
              Join our elite upskilling programs designed for modern tech
              leaders.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Premium Curriculum",
                  desc: "Designed by industry veterans",
                },
                {
                  title: "AI-First Approach",
                  desc: "Modern tech stack integration",
                },
                {
                  title: "Guaranteed Referrals",
                  desc: "Network of 500+ partners",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-orange-500 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm tracking-wide">
                      {item.title}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10">
            <div className="flex -space-x-3 mb-3">
              {[SubhraImg, RudraImg, RohanImg, RajaImg, PrabhleenImg].map(
                (img, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#050d2f] bg-slate-800 overflow-hidden"
                  >
                    <img
                      src={img}
                      alt="alumni"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )
              )}
              <div className="w-8 h-8 rounded-full border-2 border-[#050d2f] bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                +5k
              </div>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Join thousands of successful alumni working at top tech giants.
            </p>
          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="w-full md:w-[62%] bg-white p-8 md:p-10 flex flex-col max-h-[90vh] md:max-h-[700px]">
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-2xl font-black text-[#050d2f]">
              {popupType === "brochure"
                ? "Download Curriculum"
                : "Program Application"}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {popupType === "brochure"
                ? "Complete the details to access the complete syllabus."
                : "Complete the steps below to secure your spot."}
            </p>
          </div>

          {/* Scrollable form body */}
          <form
            id="advanced-apply-form"
            onSubmit={handleFormSubmit}
            className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar"
            noValidate
          >
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                    <FaUser size={13} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Carter"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Mobile — type="tel", digits only */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                    <FaPhone size={13} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Email + OTP flow */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                Work / Personal Email
              </label>

              {/* Email input row */}
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                    <FaEnvelope size={13} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Reset verification if email changes
                      if (emailVerified || otpSent) {
                        setEmailVerified(false);
                        setOtpSent(false);
                        setOtp("");
                      }
                    }}
                    disabled={emailVerified}
                    required
                    placeholder="john.carter@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Verify / Resend button */}
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={otpLoading}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md active:scale-95 disabled:opacity-60 whitespace-nowrap flex items-center gap-1.5"
                  >
                    {otpLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : otpSent ? (
                      <>
                        <FaRedo size={10} /> Resend
                      </>
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </div>

              {/* OTP input row */}
              {otpSent && !emailVerified && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm text-center font-black tracking-[0.4em]"
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={loading || otp.length < 6}
                    className="px-5 py-3 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {loading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              )}

              {/* Verified badge */}
              {emailVerified && (
                <div className="mt-2 flex items-center gap-2 text-emerald-600 text-[11px] font-black uppercase tracking-widest ml-1">
                  <FaCheckCircle /> Email Verified ✓
                </div>
              )}
            </div>

            {/* Current Role & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
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
                  { value: "Self Employed", label: "Self Employed" },
                  { value: "Founder", label: "Founder" },
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
                  { value: "1-2 years", label: "1–2 Years" },
                  { value: "3-5 years", label: "3–5 Years" },
                  { value: "5+ years", label: "5+ Years" },
                ]}
              />
            </div>

            {/* Target Program */}
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
                { value: "Prompt Engineering with GenAI Advanced Program", label: "Prompt Engineering with GenAI" },
                { value: "Product Management Advanced Program", label: "Product Management Advanced Program" },
                { value: "MERN Stack Development Advanced Program", label: "MERN Stack Development Advanced Program" },
              ]}
            />

            {/* Primary Goal */}
            <CustomSelect
              label="Primary Goal"
              icon={<FaCheckCircle className="text-orange-500" />}
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              placeholder="What do you want to achieve?"
              options={[
                { value: "Career Transition", label: "Career Transition" },
                { value: "Kickstart Career", label: "Kickstart Career" },
                { value: "Upskilling", label: "Upskilling" },
                { value: "Other", label: "Other" },
              ]}
            />

            {/* Current Domain */}
            <CustomSelect
              label="Current Domain"
              icon={<FaBriefcase className="text-orange-500" />}
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              placeholder="Your current industry / domain"
              options={[
                { value: "Digital Marketing", label: "Digital Marketing" },
                { value: "Marketing/Sales", label: "Marketing / Sales" },
                { value: "Operations", label: "Management / Operations" },
                { value: "Tech", label: "IT / Tech / Product" },
                { value: "Other", label: "Other" },
              ]}
            />

            {/* Domain Other */}
            {formData.domain === "Other" && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                  Specify Domain
                </label>
                <input
                  type="text"
                  name="domainOther"
                  value={formData.domainOther}
                  onChange={handleInputChange}
                  placeholder="e.g. Finance, Healthcare..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
                />
              </div>
            )}

            {/* Reason */}
            <CustomSelect
              label="Reason for Applying"
              icon={<FaBullseye className="text-orange-500" />}
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why do you want to join?"
              options={[
                { value: "I Want to Know More About the Program", label: "I Want to Know More About the Program" },
                { value: "I've Reviewed the Program – Need Career Guidance", label: "Reviewed the Program – Need Career Guidance" },
                { value: "I'm Ready to Enroll", label: "I'm Ready to Enroll" },
                { value: "I'm Already Enrolled – Need Support", label: "Already Enrolled – Need Support" },
              ]}
            />

            {/* Passed Out Year */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block ml-1">
                Passed Out Year
              </label>
              <input
                type="text"
                name="passedOutYear"
                value={formData.passedOutYear}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setFormData((prev) => ({ ...prev, passedOutYear: val }));
                }}
                placeholder="e.g. 2022"
                maxLength={4}
                inputMode="numeric"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Authorization */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="authorize_popup"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor="authorize_popup"
                className="text-[11px] text-slate-500 leading-relaxed cursor-pointer select-none"
              >
                I authorise{" "}
                <span className="font-bold text-slate-700">Krutanic</span> &
                its representatives to contact me with updates and
                notifications via Email/SMS/WhatsApp/Call. This will override
                DND/NDNC.
              </label>
            </div>

            {/* Buttons — inside form so no external form= reference needed */}
            <div className="pt-4 flex gap-3 border-t border-slate-100 pb-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all uppercase tracking-[0.1em] text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!emailVerified || loading}
                className="flex-[2] py-4 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/30 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {popupType === "brochure" ? "Get Brochure" : "Send Application"}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>,
    document.body
  );
};

export default AdvancedApplyPopup;
