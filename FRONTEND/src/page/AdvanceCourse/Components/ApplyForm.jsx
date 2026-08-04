import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from "../../../API";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowRight,
  FaBriefcase,
  FaBullseye,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaEnvelope,
  FaGraduationCap,
  FaPhone,
  FaRedo,
  FaUser,
} from "react-icons/fa";

/* ─── Field Wrapper ─── */
const Field = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.12em]">
      <span className="text-[#f15b29]">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

/* ─── Text Input ─── */
const TextInput = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#f15b29] focus:ring-4 focus:ring-[#f15b29]/10 transition-all ${className}`}
  />
);

/* ─── Custom Dropdown ─── */
const Select = ({ name, value, onChange, placeholder, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(`[data-sel="${name}"]`)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [name]);

  return (
    <div className="relative" data-sel={name}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all ${
          open
            ? "bg-white border-[#f15b29] ring-4 ring-[#f15b29]/10 text-slate-800"
            : `bg-slate-50 border-slate-200 hover:border-slate-300 ${value ? "text-slate-800" : "text-slate-400"}`
        }`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <FaChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180 text-[#f15b29]" : "text-slate-400"}`}
        />
      </button>
      {open && (
        <div className="absolute z-[999] top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] py-1 overflow-hidden">
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
              {opt.label}
              {value === opt.value && <FaCheckCircle size={11} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const ApplyForm = ({ courseValue = "this program", isPremium = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentRole: "",
    experience: "",
    goal: "",
    goalOther: "",
    domain: "",
    domainOther: "",
    reason: "",
    passedOutYear: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const set = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onPhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((p) => ({ ...p, phone: digits }));
  };

  const onEmailChange = (e) => {
    set(e);
    if (otpSent || emailVerified) {
      setOtpSent(false);
      setEmailVerified(false);
      setOtp("");
    }
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  /* ── Send OTP ── */
  const sendOTP = async () => {
    if (!isEmail(formData.email)) {
      toast.error("Enter a valid email address first.");
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${API}/advance-send-otp`, { email: formData.email.trim() });
      setOtpSent(true);
      setOtp("");
      toast.success("OTP sent! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const verifyOTP = async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP."); return; }
    setVerifyLoading(true);
    try {
      const res = await axios.post(`${API}/advance-verify-otp`, {
        email: formData.email.trim(),
        otp,
      });
      if (res.data.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setOtp("");
        toast.success("Email verified ✓");
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())        return toast.error("Please enter your full name.");
    if (!emailVerified)               return toast.error("Please verify your email first.");
    if (formData.phone.length !== 10) return toast.error("Enter a valid 10-digit phone number.");
    if (!formData.currentRole)        return toast.error("Please select your current role.");
    if (!formData.experience)         return toast.error("Please select experience level.");
    if (!formData.goal)               return toast.error("Please select your career goal.");
    if (formData.goal === "Other" && !formData.goalOther.trim())
                                      return toast.error("Please specify your goal.");
    if (formData.domain === "Other" && !formData.domainOther.trim())
                                      return toast.error("Please specify your domain.");

    setLoading(true);
    try {
      await axios.post(`${API}/advance/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        currentRole: formData.currentRole,
        experience: formData.experience,
        goal: formData.goal,
        goalOther: formData.goal === "Other" ? formData.goalOther.trim() : "",
        domain: formData.domain,
        domainOther: formData.domain === "Other" ? formData.domainOther.trim() : "",
        interestedDomain: courseValue,
        reason: formData.reason,
        passedOutYear: formData.passedOutYear.trim(),
      });
      toast.success("Application submitted! We'll be in touch soon.");
      setFormData({ name:"", email:"", phone:"", currentRole:"", experience:"",
        goal:"", goalOther:"", domain:"", domainOther:"", reason:"", passedOutYear:"" });
      setEmailVerified(false); setOtpSent(false); setOtp("");
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { AOS.init({ duration: 800, once: true }); }, []);

  /* ── RENDER ── */
  return (
    <div
      className={isPremium ? "w-full" : "w-full max-w-2xl mx-auto px-4 py-10"}
      data-aos={isPremium ? undefined : "fade-up"}
    >
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.08)] border border-slate-100">

        {/* Header (full-page mode only) */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-[#050d2f] via-[#0a1a4a] to-[#050d2f] px-8 py-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-[#f15b29]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#f15b29]/20 text-[#f15b29] text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-[#f15b29]/30">
                Limited Seats Available
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
                Apply for <span className="text-[#f15b29]">{courseValue}</span>
              </h2>
              <p className="text-slate-400 text-sm">
                Our counselor will reach out within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 md:p-8 space-y-5">

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={<FaUser size={10} />}>
              <TextInput
                type="text"
                name="name"
                value={formData.name}
                onChange={set}
                placeholder="e.g. Priya Sharma"
                required
              />
            </Field>
            <Field label="Phone Number" icon={<FaPhone size={10} />}>
              <TextInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onPhoneChange}
                placeholder="10-digit mobile"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </Field>
          </div>

          {/* Email + OTP unified card */}
          <Field label="Email Address" icon={<FaEnvelope size={10} />}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="flex items-center">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onEmailChange}
                  disabled={emailVerified}
                  placeholder="your@email.com"
                  required
                  className="flex-1 min-w-0 px-4 py-3.5 bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 disabled:opacity-60"
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={otpLoading}
                    className="m-2 shrink-0 px-4 py-2 rounded-lg bg-[#050d2f] text-white text-xs font-bold hover:bg-[#f15b29] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {otpLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : otpSent ? (
                      <><FaRedo size={9} /> Resend</>
                    ) : (
                      "Verify →"
                    )}
                  </button>
                )}
                {emailVerified && (
                  <div className="m-2 shrink-0 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5">
                    <FaCheckCircle size={11} /> Verified
                  </div>
                )}
              </div>

              {/* OTP Panel */}
              {otpSent && !emailVerified && (
                <div className="border-t border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-4">
                  <p className="flex items-center gap-2 text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                    OTP sent — check your inbox
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
                      className="flex-1 min-w-0 px-4 py-3 bg-white border border-orange-200 rounded-lg outline-none font-black text-center tracking-[0.6em] text-slate-800 text-base placeholder:text-orange-200 placeholder:tracking-[0.5em] focus:border-[#f15b29] focus:ring-4 focus:ring-[#f15b29]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={verifyLoading || otp.length < 6}
                      className="shrink-0 px-5 py-3 bg-[#f15b29] text-white rounded-lg font-bold text-sm hover:bg-[#d64a1d] active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {verifyLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><FaCheckCircle size={12} /> Confirm</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Verified confirmation strip */}
            {emailVerified && (
              <div className="flex items-center gap-2 px-3 py-2 mt-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <span className="truncate">{formData.email}</span>
                <span className="ml-auto font-black whitespace-nowrap">✓ Verified</span>
              </div>
            )}
          </Field>

          {/* Role + Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Current Status" icon={<FaGraduationCap size={10} />}>
              <Select
                name="currentRole"
                value={formData.currentRole}
                onChange={set}
                placeholder="What's your role?"
                options={[
                  { value: "Student", label: "Student" },
                  { value: "Working Professional", label: "Working Professional" },
                  { value: "Self Employed", label: "Self Employed" },
                  { value: "Founder", label: "Founder" },
                ]}
              />
            </Field>
            <Field label="Experience Level" icon={<FaBriefcase size={10} />}>
              <Select
                name="experience"
                value={formData.experience}
                onChange={set}
                placeholder="Years of exp."
                options={[
                  { value: "Fresher", label: "0 (Fresher)" },
                  { value: "1-2 years", label: "1–2 Years" },
                  { value: "3-5 years", label: "3–5 Years" },
                  { value: "5+ years", label: "5+ Years" },
                ]}
              />
            </Field>
          </div>

          {/* Domain + Passed Out Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Current Domain" icon={<FaBullseye size={10} />}>
              <Select
                name="domain"
                value={formData.domain}
                onChange={set}
                placeholder="Your industry domain"
                options={[
                  { value: "Digital Marketing", label: "Digital Marketing" },
                  { value: "Marketing/Sales", label: "Marketing / Sales" },
                  { value: "Operations", label: "Management / Operations" },
                  { value: "Tech", label: "IT / Tech / Product" },
                  { value: "Other", label: "Other" },
                ]}
              />
              {formData.domain === "Other" && (
                <TextInput
                  type="text"
                  name="domainOther"
                  value={formData.domainOther}
                  onChange={set}
                  placeholder="Specify your domain"
                  className="mt-2"
                />
              )}
            </Field>
            <Field label="Passed Out Year" icon={<FaCalendarAlt size={10} />}>
              <TextInput
                type="text"
                name="passedOutYear"
                value={formData.passedOutYear}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setFormData((p) => ({ ...p, passedOutYear: v }));
                }}
                placeholder="e.g. 2022"
                inputMode="numeric"
                maxLength={4}
              />
            </Field>
          </div>

          {/* Career Goal */}
          <Field label="Career Goal" icon={<FaArrowRight size={10} />}>
            <Select
              name="goal"
              value={formData.goal}
              onChange={set}
              placeholder="What do you want to achieve?"
              options={[
                { value: "Career Transition", label: "Career Transition" },
                { value: "Kickstart Career", label: "Kickstart Career" },
                { value: "Upskilling", label: "Upskilling" },
                { value: "Other", label: "Other" },
              ]}
            />
            {formData.goal === "Other" && (
              <TextInput
                type="text"
                name="goalOther"
                value={formData.goalOther}
                onChange={set}
                placeholder="Specify your goal"
                className="mt-2"
              />
            )}
          </Field>

          {/* Reason */}
          <Field label="Reason for Applying" icon={<FaBullseye size={10} />}>
            <Select
              name="reason"
              value={formData.reason}
              onChange={set}
              placeholder="Why do you want to join?"
              options={[
                { value: "I Want to Know More About the Program", label: "Want to Know More" },
                { value: "I've Reviewed the Program – Need Career Guidance", label: "Need Career Guidance" },
                { value: "I'm Ready to Enroll", label: "Ready to Enroll" },
                { value: "I'm Already Enrolled – Need Support", label: "Already Enrolled – Need Support" },
              ]}
            />
          </Field>

          {/* Authorization checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#f15b29] focus:ring-[#f15b29] cursor-pointer flex-shrink-0 accent-[#f15b29]"
            />
            <span className="text-[11px] text-slate-500 leading-relaxed select-none group-hover:text-slate-700 transition-colors">
              I authorise <span className="font-bold text-slate-700">Krutanic</span> &amp; its
              representatives to contact me with updates via Email / SMS / WhatsApp / Call.
              This overrides DND/NDNC.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !emailVerified}
            className="w-full py-4 rounded-2xl bg-[#f15b29] text-white font-black text-sm uppercase tracking-widest hover:bg-[#d64a1d] active:scale-[0.99] transition-all shadow-[0_8px_30px_rgba(241,91,41,0.30)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                {isPremium ? "Request a Callback" : "Submit My Application"}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {!isPremium && (
            <p className="text-center text-[11px] text-slate-400">
              By submitting, you agree to our Terms &amp; Privacy Policy.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
