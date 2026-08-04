import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowRight,
  FaBriefcase,
  FaCheckCircle,
  FaChevronDown,
  FaEnvelope,
  FaGraduationCap,
  FaPhoneAlt,
  FaRedo,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import girlImg from "../assets/girl.png";

/* ─── Text Input ─── */
const TInput = ({ icon: Icon, className = "", ...props }) => (
  <div className="relative group">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f15b29] transition-colors text-xs pointer-events-none" />
    )}
    <input
      {...props}
      className={`w-full ${Icon ? "pl-9" : "pl-4"} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#f15b29] focus:ring-4 focus:ring-[#f15b29]/10 transition-all ${className}`}
    />
  </div>
);

/* ─── Custom Dropdown ─── */
const MSelect = ({ name, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(`[data-mdd="${name}"]`)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [name]);

  return (
    <div className="relative" data-mdd={name}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
          open
            ? "bg-white border-[#f15b29] ring-4 ring-[#f15b29]/10 text-slate-800"
            : `bg-slate-50 border-slate-200 hover:border-slate-300 ${value ? "text-slate-800" : "text-slate-400"}`
        }`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <FaChevronDown
          size={10}
          className={`ml-2 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#f15b29]" : "text-slate-400"}`}
        />
      </button>

      {open && (
        <div className="absolute z-[9999] top-[calc(100%+5px)] left-0 w-full max-h-52 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] py-1">
          {options.map((opt) => (
            <div
              key={opt.value}
              onMouseDown={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                value === opt.value
                  ? "bg-orange-50 text-[#f15b29] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {value === opt.value && <FaCheckCircle size={10} className="shrink-0 ml-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const YEAR_OPTIONS = [
  { label: "1st Year", value: "1st year" },
  { label: "2nd Year", value: "2nd year" },
  { label: "3rd Year", value: "3rd year" },
  { label: "4th Year", value: "4th year" },
  { label: "Graduated", value: "Graduated" },
  { label: "Passed Out", value: "Passed Out" },
];

const DOMAIN_OPTIONS = [
  "Full Stack Web Development","Android App Development","Artificial Intelligence",
  "Machine Learning","Cyber Security","Data Science","Data Analytics","UI/UX Design",
  "DevOps","Business Analytics","Finance","Human Resource","Digital Marketing",
  "Stock Marketing","Graphics Design","Embedded System","Cloud Computing",
  "IOT & Robotics","Auto Cad","Psychology",
].map((d) => ({ label: d, value: d }));

/* ══════════════════════════════════════
   MENTORSHIP FORM
══════════════════════════════════════ */
const MentorshipForm = ({ isPopup, onClose, inlineMode = false, setShowForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeEmail: "",
    number: "",
    collegeName: "",
    domain: "",
    passingyear: "",
    reason: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleEmailChange = (e) => {
    handleChange(e);
    if (otpSent || emailVerified) {
      setOtpSent(false);
      setEmailVerified(false);
      setOtp("");
    }
  };

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((p) => ({ ...p, number: digits }));
  };

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  /* ── Send OTP ── */
  const sendOTP = async () => {
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${API}/mentorship-send-otp`, { email: formData.email.trim() });
      toast.success("OTP sent! Check your inbox.");
      setOtpSent(true);
      setOtp("");
    } catch {
      toast.error("Failed to send OTP. Try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const verifyOTP = async () => {
    if (otp.length < 4) { toast.error("Please enter the OTP."); return; }
    setVerifyLoading(true);
    try {
      const res = await axios.post(`${API}/mentorship-verify-otp`, {
        email: formData.email.trim(),
        otp,
      });
      if (res.data.success) {
        toast.success("Email verified ✓");
        setEmailVerified(true);
        setOtpSent(false);
        setOtp("");
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed. Check OTP and retry.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({ name:"", email:"", collegeEmail:"", number:"", collegeName:"", domain:"", passingyear:"", reason:"" });
    setOtpSent(false); setOtp(""); setEmailVerified(false);
    if (onClose) onClose();
    if (setShowForm) setShowForm(false);
  };

  /* ── Submit ── */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())    { toast.error("Please enter your name."); return; }
    if (!emailVerified)           { toast.error("Please verify your email first."); return; }
    if (!/^[0-9]{10}$/.test(formData.number)) { toast.error("Enter a valid 10-digit phone number."); return; }
    if (!formData.domain)         { toast.error("Please select a domain."); return; }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API}/mentorship/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        collegeEmail: formData.collegeEmail.trim(),
        phone: formData.number,
        collegeName: formData.collegeName.trim(),
        domain: formData.domain,
        passingyear: formData.passingyear,
        reason: formData.reason,
      });

      toast.success("Registration successful! 🎉 We'll reach out soon.");
      setTimeout(clearForm, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.");
      console.error(error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ══ FORM JSX (inlined — no inner component) ══ */
  const formJSX = (
    <form onSubmit={handleFormSubmit} noValidate className="space-y-4">

      {/* Name + WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Full Name</label>
          <TInput icon={FaUser} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
          <TInput icon={FaPhoneAlt} type="tel" name="number" value={formData.number} onChange={handleNumberChange} placeholder="10-digit number" inputMode="numeric" maxLength={10} required />
        </div>
      </div>

      {/* Email + OTP unified card */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
          <div className="flex items-center">
            <div className="relative flex-1 group">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f15b29] transition-colors text-xs pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                disabled={emailVerified}
                placeholder="your@email.com"
                required
                className="w-full pl-9 pr-2 py-3 bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 disabled:opacity-60"
              />
            </div>
            {!emailVerified && (
              <button
                type="button"
                onClick={sendOTP}
                disabled={otpLoading}
                className="m-1.5 shrink-0 px-4 py-2 rounded-lg bg-[#050d2f] text-white text-xs font-bold hover:bg-[#f15b29] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1.5"
              >
                {otpLoading ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : otpSent ? (
                  <><FaRedo size={9} /> Resend</>
                ) : "Verify →"}
              </button>
            )}
            {emailVerified && (
              <div className="m-1.5 shrink-0 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5">
                <FaCheckCircle size={10} /> Verified
              </div>
            )}
          </div>

          {/* OTP Panel */}
          {otpSent && !emailVerified && (
            <div className="border-t border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3">
              <p className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                OTP sent to your inbox
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  autoFocus
                  className="flex-1 min-w-0 px-3 py-2.5 bg-white border border-orange-200 rounded-lg outline-none font-black text-center tracking-[0.5em] text-slate-800 text-sm placeholder:text-orange-200 focus:border-[#f15b29] focus:ring-4 focus:ring-[#f15b29]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={verifyOTP}
                  disabled={verifyLoading || otp.length < 4}
                  className="shrink-0 px-4 py-2.5 bg-[#f15b29] text-white rounded-lg font-bold text-xs hover:bg-[#d64a1d] active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  {verifyLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><FaCheckCircle size={10} /> Confirm</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>


      </div>

      {/* College Email + College Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">College Email</label>
          <TInput icon={FaEnvelope} type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleChange} placeholder="college@university.edu" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">College Name</label>
          <TInput icon={FaGraduationCap} type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Your college / university" required />
        </div>
      </div>

      {/* Year of Study + Domain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Year of Study</label>
          <MSelect name="passingyear" value={formData.passingyear} onChange={handleChange} placeholder="Select year" options={YEAR_OPTIONS} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Domain *</label>
          <MSelect name="domain" value={formData.domain} onChange={handleChange} placeholder="Select a domain" options={DOMAIN_OPTIONS} />
        </div>
      </div>

      {/* Reason */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Reason for Applying</label>
        <MSelect name="reason" value={formData.reason} onChange={handleChange} placeholder="Why do you want to join?" options={[
          { value: "I Want to Know More About the Program", label: "Want to Know More" },
          { value: "I've Reviewed the Program – Need Career Guidance", label: "Need Career Guidance" },
          { value: "I'm Ready to Enroll", label: "Ready to Enroll" },
          { value: "I'm Already Enrolled – Need Support", label: "Already Enrolled – Need Support" },
        ]} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !emailVerified}
        className="w-full py-3.5 rounded-2xl bg-[#f15b29] text-white font-black text-sm uppercase tracking-widest hover:bg-[#d64a1d] active:scale-[0.99] transition-all shadow-[0_6px_24px_rgba(241,91,41,0.30)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Submit Application
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      <p className="text-center text-[10px] text-slate-400">🔒 Your data is secure and encrypted.</p>
    </form>
  );

  /* ══════════════════
     RENDER
  ══════════════════ */

  /* ── INLINE MODE ── */
  if (inlineMode) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-br from-[#050d2f] via-[#0a1a4a] to-[#050d2f] px-8 py-8 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#f15b29]/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#f15b29]/20 text-[#f15b29] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 border border-[#f15b29]/30">
                Limited Mentorship Slots
              </span>
              <h3 className="text-xl font-extrabold text-white mb-1">Apply for Mentorship</h3>
              <p className="text-slate-400 text-sm">Join the top 1% of tech talent. Next cohort fills up soon.</p>
            </div>
          </div>
          <div className="p-6 md:p-8">{formJSX}</div>
        </div>
      </>
    );
  }

  /* ── POPUP MODE ── */
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={clearForm}
      >
        <div
          className="w-full max-w-[900px] max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left panel */}
          <div className="hidden md:flex md:w-[42%] bg-gradient-to-b from-[#050d2f] to-[#0a1a4a] flex-col p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-[#f15b29]/15 rounded-full blur-3xl" />
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg">K</div>
                <span className="text-white font-bold text-lg">Mentorship</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
                Begin Your <span className="text-[#f15b29]">Professional</span> Journey
              </h2>
              <p className="text-slate-400 text-sm mb-8">Join 10,000+ students already learning from top industry mentors.</p>

              {[
                { icon: FaUser, title: "1:1 Mentorship", desc: "Personalized guidance from experts" },
                { icon: FaCheckCircle, title: "Certified Outcomes", desc: "Industry-recognized credentials" },
                { icon: FaBriefcase, title: "Career Support", desc: "Internship and placement" },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3 mb-5">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <f.icon className="text-[#f15b29] text-sm" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{f.title}</p>
                    <p className="text-slate-400 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Girl + learners badge */}
            <div className="relative z-10 mt-4">
              <img src={girlImg} alt="Student" className="w-full max-w-[200px] mx-auto object-contain max-h-44" />
              <div className="absolute bottom-0 left-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {["JS","RK","AM"].map((s) => (
                    <div key={s} className="w-6 h-6 rounded-full bg-blue-600 border-2 border-[#050d2f] flex items-center justify-center text-white text-[8px] font-bold">{s}</div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-[#f15b29] border-2 border-[#050d2f] flex items-center justify-center text-white text-[8px] font-bold">+12k</div>
                </div>
                <span className="text-white text-xs font-semibold">Active Learners</span>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">
            <button
              onClick={clearForm}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all"
            >
              <FaTimes size={12} />
            </button>
            <div className="mb-6 pr-8">
              <h3 className="text-2xl font-extrabold text-slate-900">Apply for Mentorship</h3>
              <p className="text-slate-400 text-sm mt-1">Fill in your details to get started with your preferred track.</p>
            </div>
            {formJSX}
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorshipForm;
