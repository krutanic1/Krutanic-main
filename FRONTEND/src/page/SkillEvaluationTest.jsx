import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, ArrowRight, User, Phone, Mail, MapPin, Briefcase, Target, 
  BrainCircuit, TrendingUp, Sparkles, Send, ShieldCheck, Calendar, Clock,
  BarChart3, Rocket, Award, Search, Gift, AlertTriangle
} from 'lucide-react';
import API from '../API';
import { getAvailableDates, getSlotsForDate } from '../utils/slotScheduler';
import logoWhite from '../assets/logowhite.png';

const SkillEvaluationTest = () => {
  const navigate = useNavigate();
  const [statIndex, setStatIndex] = useState(0);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const r = () => Math.floor(Math.random() * (200 - 165 + 1)) + 165;
    setStatsData([
      { label: "Today's Registrations", count: r() },
      { label: "Yesterday's Registrations", count: r() },
      { label: "Total Registrations", count: "5500+" }
    ]);
    const interval = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const [currentStep, setCurrentStep] = useState(0); // 0: Landing, 1: Booking, 2: Form, 3: Success
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrePaymentModal, setShowPrePaymentModal] = useState(false);
  const [prePaymentId, setPrePaymentId] = useState(null);
  const [isSubmittingPrePayment, setIsSubmittingPrePayment] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    ageGroup: '',
    currentStatus: '',
    fieldOfStudy: '',
    currentJobRole: '',
    yearsOfExperience: '',
    currentWorkingDomain: '',
    primaryCareerGoal: '',
    goalTimeline: '',
    biggestChallenge: '',
    communicationSkills: '',
    problemSolvingSkills: '',
    techComfort: '',
    weeklyLearningHours: '',
    primaryMotivator: '',
    confidenceScore: '',
    clearRoadmap: '',
    rightSkills: '',
    wantConsultation: '',
    helpArea: '',
    topCareerChallenge12Months: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingPrePayment) return;
    
    try {
      setIsSubmittingPrePayment(true);
      const res = await axios.post(`${API}/pre-payment`, formData);
      if (res.data.prePaymentId) {
        setPrePaymentId(res.data.prePaymentId);
        setShowPrePaymentModal(false);
        handlePayment();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save details.");
    } finally {
      setIsSubmittingPrePayment(false);
    }
  };

  const handlePayment = async () => {
    // Bypass payment in development mode for easier testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const devPaymentDetails = {
        id: 'dev_bypass_payment_' + Date.now(),
        orderId: 'dev_order_' + Date.now(),
        signature: 'dev_signature'
      };
      setPaymentDetails(devPaymentDetails);
      toast.success('Development Mode: Payment bypassed!');
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }
      navigate('/career-assessment', { 
        state: { 
          paymentDetails: devPaymentDetails, 
          prePaymentId: prePaymentId,
          formData: formData 
        } 
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      const res = await axios.post(`${API}/api/assessment-payment/create-order`);
      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Use env variable in prod
        amount: order.amount,
        currency: order.currency,
        name: 'Krutanic',
        description: 'Live Mentor Assessment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API}/api/assessment-payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.data.success) {
              const newPaymentDetails = {
                id: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              };
              setPaymentDetails(newPaymentDetails);
              toast.success('Payment successful!');
              if (window.fbq) {
                window.fbq('track', 'Lead');
              }
              navigate('/career-assessment', { 
                state: { 
                  paymentDetails: newPaymentDetails, 
                  prePaymentId: prePaymentId,
                  formData: formData 
                } 
              });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#4f46e5'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp1.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const fetchSlots = async (date) => {
    setSelectedDate(date);
    setSelectedSlot('');
    try {
      setSlotsLoading(true);
      const res = await axios.get(`${API}/api/assessment-slots/${date}`);
      setAvailableSlots(res.data);
    } catch (error) {
      toast.error('Failed to fetch slots');
    } finally {
      setSlotsLoading(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        prePaymentId,
        paymentId: paymentDetails.id,
        razorpayOrderId: paymentDetails.orderId,
        razorpaySignature: paymentDetails.signature,
        paymentStatus: 'Success',
        bookedDate: selectedDate,
        bookedTimeSlot: selectedSlot
      };
      
      const res = await axios.post(`${API}/careerassessment`, payload);
      if (res.status === 201) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error === "SLOT_TAKEN") {
          toast.error(error.response.data.message || "Slot taken by another user. Please pick another.");
          setCurrentStep(1); // Go back to calendar
      } else {
          toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to submit assessment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Career Readiness Score",
    "Professional Strength Assessment",
    "Skills Gap Analysis",
    "Personalized Career Roadmap",
    "Recommended Career Paths",
    "Industry Skill Recommendations",
    "Learning & Growth Plan",
    "Live 1-on-1 Career Consultation"
  ];

  // Helper to format time slots into 12-hour AM/PM format
  const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 || 12;
      return `${formattedH}:${minutes} ${ampm}`;
  };

  return (
    <div 
      className="text-zinc-300 font-['Inter'] min-h-screen selection:bg-indigo-500/30"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(5,5,5,0.85), rgba(5,5,5,0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <Helmet>
        <title>Skill Evaluation Test | Krutanic</title>
        <meta name="description" content="Discover Your Career Potential, Strengths, Skill Gaps & Personalized Growth Roadmap." />
      </Helmet>

      <nav className="absolute top-0 left-0 w-full px-6 md:px-10 py-6 z-[100] flex items-center">
        <img src={logoWhite} alt="Krutanic Logo" className="h-9 w-auto" />
      </nav>

      <style>{`
        .glass-panel {
          background: rgba(24, 24, 27, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-size: 15px;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .form-select option {
          background: #18181b;
          color: white;
        }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #a1a1aa;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .slot-btn {
          border: 1px solid rgba(99, 102, 241, 0.3);
          background: rgba(99, 102, 241, 0.1);
          color: #fff;
          border-radius: 8px;
          padding: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slot-btn:hover:not(:disabled) {
          background: rgba(99, 102, 241, 0.3);
        }
        .slot-btn.selected {
          background: #4f46e5;
          border-color: #4f46e5;
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
        }
        .slot-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* HEADER SECTION - Always visible unless Success */}
      {currentStep !== 3 && (
      <section className="relative pt-16 pb-16 overflow-hidden">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] aspect-square bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-indigo-300 mb-6 backdrop-blur-md">
                <Sparkles size={14}/> Premium Live Assessment
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Skill Evaluation <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Test</span>
              </h1>
              
              <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl font-light">
                Discover your career potential, strengths, skill gaps, and get a personalized growth roadmap. Book a live 1-on-1 slot with our expert mentors for just ₹101.
              </p>

              <div className="glass-panel rounded-2xl p-6 md:p-8 border-l-4 border-l-indigo-500">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-indigo-400" /> What You'll Receive
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:block mt-6 bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl backdrop-blur-sm">
                <h4 className="text-amber-400 font-bold text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0" />
                  Limited Skill Evaluation Slots Available Daily
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed pl-[26px]">
                  We only accept a limited number of candidates to maintain report accuracy.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              {currentStep === 0 ? (
                <div className="glass-panel rounded-[28px] p-8 relative overflow-hidden shadow-2xl border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/5 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                        <Target size={22} />
                      </div>
                      <h3 className="text-xl font-bold text-white">Start Your Assessment</h3>
                    </div>
                    <p className="text-sm text-zinc-400 mb-6 pl-[52px]">Fill in your details to reserve your slot before payment.</p>

                    <form onSubmit={handlePrePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="form-label">Full Name *</label>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="form-label">Email ID *</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="form-label">Contact Number *</label>
                        <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} className="form-input" placeholder="+91 9876543210" />
                      </div>
                      <div>
                        <label className="form-label">Total Years of Experience *</label>
                        <select required name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} className="form-input form-select">
                          <option value="" disabled>Select Experience</option>
                          <option value="1–3 Years">1–3 Years</option>
                          <option value="3–5 Years">3–5 Years</option>
                          <option value="5–7 Years">5–7 Years</option>
                          <option value="7–9 Years">7–9 Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Current Working Domain *</label>
                        <select required name="currentWorkingDomain" value={formData.currentWorkingDomain} onChange={handleInputChange} className="form-input form-select">
                          <option value="" disabled>Select Domain</option>
                          <option value="IT / Software Development">IT / Software Development</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Sales & Business Development">Sales & Business Development</option>
                          <option value="Finance / Accounting">Finance / Accounting</option>
                          <option value="HR / Operations">HR / Operations</option>
                          <option value="Customer Support">Customer Support</option>
                          <option value="Education / Training">Education / Training</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingPrePayment}
                        className="w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 text-base mt-2"
                      >
                        {isSubmittingPrePayment ? 'Saving...' : <>Proceed to Payment <ArrowRight size={18}/></>}
                      </button>
                      <p className="text-emerald-400 text-sm font-medium text-center">Only ₹101 – Fully Adjustable in Program Fee</p>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-[28px] p-12 relative overflow-hidden shadow-2xl border border-emerald-500/30 flex flex-col items-center justify-center min-h-[320px]">
                  <CheckCircle2 size={56} className="text-emerald-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Payment Successful</h3>
                  <p className="text-zinc-400 text-center">Your slot has been reserved. Please complete the booking below.</p>
                </div>
              )}

              {statsData.length > 0 && (
                <div className="mt-6 relative h-16 w-full max-w-[320px] mx-auto" style={{ perspective: 1000 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={statIndex}
                      initial={{ rotateX: -90, opacity: 0, transformOrigin: "top" }}
                      animate={{ rotateX: 0, opacity: 1, transformOrigin: "top" }}
                      exit={{ rotateX: 90, opacity: 0, transformOrigin: "bottom" }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-[#09090b]/80 border border-emerald-500/50 rounded-xl flex items-center justify-between px-6 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-md"
                    >
                      <span className="text-zinc-300 font-semibold text-sm tracking-wide">{statsData[statIndex].label}</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 font-extrabold text-2xl drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{statsData[statIndex].count}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Only Alert Below Card */}
              <div className="block lg:hidden mt-6 bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl backdrop-blur-sm">
                <h4 className="text-amber-400 font-bold text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle size={18} className="shrink-0" />
                  Limited Skill Evaluation Slots Available Daily
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed pl-[26px]">
                  We only accept a limited number of candidates to maintain report accuracy.
                </p>
              </div>
            </motion.div>

          </div>
        </div>


      </section>
      )}

      {/* WHY IS THIS MANDATORY SECTION - Visible on Landing */}
      {currentStep === 0 && (
        <section className="relative py-20 bg-zinc-900/50 border-y border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why is the Skill Evaluation Test <span className="text-indigo-400">Mandatory</span> for This Program?
              </h2>
              <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
                In today's competitive job market, companies no longer hire candidates based solely on degrees or certifications. Employers hire professionals who can demonstrate the right skills, problem-solving abilities, and job readiness.
              </p>
              <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed mt-4">
                The Skill Evaluation Test is designed to measure your current standing against industry expectations and identify what is required to make you job-ready.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {[
                {
                  icon: <Target className="text-indigo-400" size={32} />,
                  title: "Benchmark Yourself Against Industry Standards",
                  desc: "The assessment evaluates your current skills and compares them with the competencies expected by leading companies and hiring managers.",
                  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                },
                {
                  icon: <BarChart3 className="text-indigo-400" size={32} />,
                  title: "Identify Critical Skill Gaps",
                  desc: "Most professionals and graduates are unaware of the specific skills preventing them from securing better opportunities. The assessment identifies these gaps and highlights the areas that require immediate improvement.",
                  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                },
                {
                  icon: <Rocket className="text-indigo-400" size={32} />,
                  title: "Build a Personalized Career Growth Plan",
                  desc: "Every learner has different strengths, weaknesses, and career goals. Based on your assessment results, we create a personalized roadmap aligned with your target role and industry requirements.",
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                },
                {
                  icon: <Briefcase className="text-indigo-400" size={32} />,
                  title: "Understand Your Employability Score",
                  desc: "The test helps determine your current level of job readiness and provides insights into how competitive your profile is in today's market.",
                  image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                },
                {
                  icon: <TrendingUp className="text-indigo-400" size={32} />,
                  title: "Increase Your Chances of Career Growth",
                  desc: "Professionals who understand their strengths and weaknesses can focus on the right skills, improve faster, and achieve better career outcomes.",
                  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                },
                {
                  icon: <Award className="text-indigo-400" size={32} />,
                  title: "Maximize Program Outcomes",
                  desc: "The purpose of this program is not just learning—it's achieving measurable career growth. The Skill Evaluation Test ensures that your learning journey is focused on the areas that will have the greatest impact on your career progression.",
                  image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                }
              ].map((card, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-[24px] transition-all group relative overflow-hidden ring-1 ring-inset ring-white/10 shadow-xl"
                  style={{
                    backgroundImage: `url('${card.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-[#09090b]/85 group-hover:bg-[#09090b]/75 transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent mix-blend-overlay"></div>
                  
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Evaluate Section */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl border-l-4 border-l-emerald-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"><Search size={24} /></div>
                    Evaluate Technical and Professional Competencies
                  </h3>
                  <p className="text-zinc-400 mb-6">The assessment measures:</p>
                  <ul className="space-y-3">
                    {["Technical Skills", "Problem-Solving Ability", "Analytical Thinking", "Industry Knowledge", "Learning Agility", "Career Readiness"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* What You Will Receive */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl border-l-4 border-l-indigo-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"><Gift size={24} /></div>
                    What You Will Receive
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Industry Readiness Score", "Professional Skill Assessment Report", "Skill Gap Analysis", "Personalized Career Roadmap", "Growth Recommendations from Experts", "Action Plan for Career Advancement"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-300">
                        <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" /> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Important Note */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center relative overflow-hidden"
            >
              <h3 className="text-sm font-bold text-amber-400 mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
                <ShieldCheck size={18} /> Important Note
              </h3>
              <p className="text-zinc-300 max-w-4xl mx-auto mb-4">
                This is <strong>not a pass-or-fail examination.</strong>
              </p>
              <p className="text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-4">
                It is a professional assessment designed to identify your current skill level, benchmark you against industry expectations, and create a clear path toward achieving your career goals faster.
              </p>
              <p className="text-white font-medium max-w-4xl mx-auto italic text-lg">
                "The better you understand your starting point, the faster you can reach your destination."
              </p>
            </motion.div>

            {/* Reviews Marquee */}
            <div className="mt-20 overflow-hidden relative w-full pt-16 border-t border-white/5 pb-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
              <h2 className="text-3xl font-bold text-center text-white mb-12">Success <span className="text-emerald-400">Stories</span></h2>
              
              <div className="flex w-max animate-marquee gap-6 px-3">
                {[
                  ...[
                    { name: "Rahul Sharma", text: "The assessment gave me crystal clear clarity on my next career move.", image: "piece_103.png" },
                    { name: "Priya Desai", text: "I was confused about upskilling, but the live session mapped out exactly what I needed to learn.", image: "piece_100.png" },
                    { name: "Amit Patel", text: "Best ₹101 I've ever spent. Found my skill gaps instantly and the guidance was eye-opening.", image: "piece_44.png" },
                    { name: "Sneha Reddy", text: "Highly recommend this. The personalized roadmap completely transformed my approach to job hunting.", image: "piece_101.png" },
                    { name: "Vikram Singh", text: "The evaluation is thorough and the mentors truly understand the current market demands.", image: "piece_54.png" },
                    { name: "Neha Gupta", text: "As a fresher, I didn't know where to start. This gave me a definite path and huge confidence.", image: "piece_46.png" },
                    { name: "Karan Verma", text: "Transitioning into IT seemed impossible until I took this test. The advice was incredibly practical.", image: "piece_74.png" },
                    { name: "Anjali Rao", text: "The insights provided during the live session were deep and personalized. Highly valuable.", image: "piece_71.png" },
                    { name: "Rohan Kapoor", text: "I finally know exactly which skills to focus on to get my dream promotion. Thank you!", image: "piece_79.png" },
                    { name: "Pooja Joshi", text: "Absolutely brilliant experience. The expert pointed out strengths I didn't even know I had.", image: "piece_89.png" }
                  ],
                  ...[
                    { name: "Rahul Sharma", text: "The assessment gave me crystal clear clarity on my next career move.", image: "piece_103.png" },
                    { name: "Priya Desai", text: "I was confused about upskilling, but the live session mapped out exactly what I needed to learn.", image: "piece_100.png" },
                    { name: "Amit Patel", text: "Best ₹101 I've ever spent. Found my skill gaps instantly and the guidance was eye-opening.", image: "piece_44.png" },
                    { name: "Sneha Reddy", text: "Highly recommend this. The personalized roadmap completely transformed my approach to job hunting.", image: "piece_101.png" },
                    { name: "Vikram Singh", text: "The evaluation is thorough and the mentors truly understand the current market demands.", image: "piece_54.png" },
                    { name: "Neha Gupta", text: "As a fresher, I didn't know where to start. This gave me a definite path and huge confidence.", image: "piece_46.png" },
                    { name: "Karan Verma", text: "Transitioning into IT seemed impossible until I took this test. The advice was incredibly practical.", image: "piece_74.png" },
                    { name: "Anjali Rao", text: "The insights provided during the live session were deep and personalized. Highly valuable.", image: "piece_71.png" },
                    { name: "Rohan Kapoor", text: "I finally know exactly which skills to focus on to get my dream promotion. Thank you!", image: "piece_79.png" },
                    { name: "Pooja Joshi", text: "Absolutely brilliant experience. The expert pointed out strengths I didn't even know I had.", image: "piece_89.png" }
                  ]
                ].map((review, idx) => (
                  <div key={idx} className="w-[350px] glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default">
                    <div className="flex items-center gap-1 text-emerald-400 mb-4">
                      {[1,2,3,4,5].map(star => <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                    </div>
                    <p className="text-zinc-300 italic text-sm mb-6 flex-1 leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-white/5">
                        <img src={`/img/${review.image}`} alt={review.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{review.name}</p>
                        <p className="text-zinc-500 text-xs">Evaluated & Guided</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center text-white mb-10">Frequently Asked <span className="text-indigo-400">Questions</span></h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Why should I take the Skill Evaluation Test?",
                    a: "The job market is changing rapidly, and years of experience alone are no longer enough. This Skill Evaluation helps you understand your current skill level against industry expectations, identify gaps, and discover what you need to improve for better career opportunities. It's the first step toward making informed career decisions instead of relying on assumptions."
                  },
                  {
                    q: "Why is there a ₹101 fee?",
                    a: "The ₹101 fee ensures that only serious professionals take the assessment. This allows us to maintain the quality of evaluations and provide every participant with a personalized skill report. If you enroll in our program, this amount will be adjusted in your program fee."
                  },
                  {
                    q: "What will I receive after completing the test?",
                    a: "After successfully completing the assessment, you'll receive:\n• Your Personalized Skill Score\n• Industry Readiness Analysis\n• Strengths & Improvement Areas\n• Career Growth Recommendations\n• Eligibility for Advanced Learning Programs (if qualified)"
                  },
                  {
                    q: "How will this help my career?",
                    a: "This assessment helps you understand where you stand in today's competitive job market. Instead of guessing what to learn next, you'll receive clear insights into your strengths, skill gaps, and a roadmap to become more competitive for promotions, salary growth, and better job opportunities."
                  },
                  {
                    q: "Is this assessment suitable for my experience level?",
                    a: "Yes. This assessment is specially designed for working professionals with 1–8 years of experience. The evaluation adapts to your experience level and helps identify the skills that matter most at your current stage of career growth."
                  },
                  {
                    q: "How much time does it take?",
                    a: "The Skill Evaluation takes approximately 10–15 minutes to complete. You can take it from your mobile or laptop at your convenience."
                  },
                  {
                    q: "What happens after I complete the assessment?",
                    a: "Once you finish the assessment, our system generates your personalized Skill Evaluation Report. If your profile matches our eligibility criteria, a career expert will connect with you to explain your report and discuss suitable growth opportunities based on your results."
                  },
                  {
                    q: "Is the ₹101 adjustable in the program fee?",
                    a: "Yes. If you are selected and decide to enroll in our program, the ₹101 paid towards the Skill Evaluation will be adjusted in your program fee."
                  },
                  {
                    q: "Will I get a personalized skill report?",
                    a: "Absolutely. Every participant receives a personalized report that highlights your current skill level, strengths, improvement areas, industry readiness, and recommended next steps to accelerate your career growth."
                  },
                  {
                    q: "Can I talk to a career expert before enrolling?",
                    a: "Yes. After your assessment, you'll have the opportunity to speak with one of our career experts. They will review your Skill Evaluation Report, answer your questions, and help you understand the best path forward. There is no obligation to enroll—you can make an informed decision based on your report and discussion."
                  }
                ].map((faq, idx) => (
                  <details key={idx} className="group glass-panel rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                    <summary className="flex items-center justify-between p-6 text-lg font-bold text-white outline-none">
                      {faq.q}
                      <span className="transition-transform group-open:-rotate-180 text-indigo-400">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4 whitespace-pre-line">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* STEP 1: SLOT BOOKING SECTION */}
      {currentStep === 1 && (
        <section className="py-10 relative z-10">
          <div className="max-w-[800px] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                <h3 className="text-2xl font-bold text-white">Select Your Live Mentor Slot</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="form-label flex items-center gap-2"><Calendar size={16}/> Select Date *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {getAvailableDates(1).map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => fetchSlots(item.dateStr)}
                        className={`slot-btn py-3 ${selectedDate === item.dateStr ? 'selected' : ''}`}
                      >
                        {item.displayStr}
                        {item.isToday && ' (Today)'}
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="form-label flex items-center gap-2 mt-6 mb-4"><Clock size={16}/> Select Available Time Slot (30 Mins) *</label>
                    {slotsLoading ? (
                      <p className="text-indigo-400">Loading slots...</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {getSlotsForDate(selectedDate).map(time => {
                          const isBooked = availableSlots.some(s => s.timeSlot === time && s.isBooked);
                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(time)}
                              className={`slot-btn ${selectedSlot === time ? 'selected' : ''}`}
                            >
                              {formatTime(time)}
                              {isBooked && <span className="block text-[10px] text-red-400 mt-1">Booked</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedDate && selectedSlot && (
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2"
                  >
                    Continue to Assessment <ArrowRight size={18}/>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* STEP 2: FORM SECTION */}
      {currentStep === 2 && (
      <section id="assessment-form" className="py-10 relative z-10">
        <div className="max-w-[800px] mx-auto px-6">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            <div className="glass-panel rounded-[24px] p-6 border-emerald-500/30 bg-emerald-500/5 mb-8 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h4 className="text-emerald-400 font-bold">Booking Confirmed:</h4>
                <p className="text-zinc-300">{new Date(selectedDate).toLocaleDateString()} at {formatTime(selectedSlot)}</p>
              </div>
              <button type="button" onClick={() => setCurrentStep(1)} className="text-indigo-400 text-sm hover:underline">Change Slot</button>
            </div>

            {/* Section 1: Basic Information */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">2</div>
                <h3 className="text-2xl font-bold text-white">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" placeholder="e.g. Bangalore" />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Age Group *</label>
                  <select required name="ageGroup" value={formData.ageGroup} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Age Group</option>
                    <option value="22–25">22–25</option>
                    <option value="26–30">26–30</option>
                    <option value="31–35">31–35</option>
                    <option value="35+">35+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Professional Profile */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">3</div>
                <h3 className="text-2xl font-bold text-white">Professional Profile</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="form-label">Which best describes you? *</label>
                  <select required name="currentStatus" value={formData.currentStatus} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Option</option>
                    <option value="Final Year Student">Final Year Student</option>
                    <option value="Graduate Seeking Job">Graduate Seeking Job</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Career Break">Career Break</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Field of Study</label>
                  <select name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} className="form-input form-select">
                    <option value="">Select Field</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Management">Management</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Current Job Role (if applicable)</label>
                  <input type="text" name="currentJobRole" value={formData.currentJobRole} onChange={handleInputChange} className="form-input" placeholder="e.g. Data Analyst" />
                </div>
              </div>
            </div>

            {/* Section 3: Goals & Challenges */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">4</div>
                <h3 className="text-2xl font-bold text-white">Goals & Challenges</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="form-label">What is your primary career goal? *</label>
                  <select required name="primaryCareerGoal" value={formData.primaryCareerGoal} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Goal</option>
                    <option value="Get My First Job">Get My First Job</option>
                    <option value="Switch Career">Switch Career</option>
                    <option value="Get Promotion">Get Promotion</option>
                    <option value="Increase Salary">Increase Salary</option>
                    <option value="Learn New Skills">Learn New Skills</option>
                    <option value="Become Industry Ready">Become Industry Ready</option>
                    <option value="Explore Career Options">Explore Career Options</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">When do you want to achieve this goal? *</label>
                  <select required name="goalTimeline" value={formData.goalTimeline} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Timeline</option>
                    <option value="Within 3 Months">Within 3 Months</option>
                    <option value="Within 6 Months">Within 6 Months</option>
                    <option value="Within 12 Months">Within 12 Months</option>
                    <option value="Within 24 Months">Within 24 Months</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">What is your biggest career challenge today? *</label>
                  <select required name="biggestChallenge" value={formData.biggestChallenge} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Challenge</option>
                    <option value="Lack of Skills">Lack of Skills</option>
                    <option value="Lack of Direction">Lack of Direction</option>
                    <option value="Not Getting Interviews">Not Getting Interviews</option>
                    <option value="Low Salary">Low Salary</option>
                    <option value="Career Growth Stagnation">Career Growth Stagnation</option>
                    <option value="Lack of Confidence">Lack of Confidence</option>
                    <option value="Lack of Industry Exposure">Lack of Industry Exposure</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Skills Assessment */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">5</div>
                <h3 className="text-2xl font-bold text-white">Skills Assessment</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Communication Skills (1-10) *</label>
                  <input required type="number" min="1" max="10" name="communicationSkills" value={formData.communicationSkills} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                </div>
                <div>
                  <label className="form-label">Problem-Solving Skills (1-10) *</label>
                  <input required type="number" min="1" max="10" name="problemSolvingSkills" value={formData.problemSolvingSkills} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">How comfortable are you with technology? *</label>
                  <select required name="techComfort" value={formData.techComfort} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Weekly Learning Dedication *</label>
                  <select required name="weeklyLearningHours" value={formData.weeklyLearningHours} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Hours</option>
                    <option value="Less than 3 Hours">Less than 3 Hours</option>
                    <option value="3–5 Hours">3–5 Hours</option>
                    <option value="5–10 Hours">5–10 Hours</option>
                    <option value="10–15 Hours">10–15 Hours</option>
                    <option value="15+ Hours">15+ Hours</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">What motivates you most? *</label>
                  <select required name="primaryMotivator" value={formData.primaryMotivator} onChange={handleInputChange} className="form-input form-select">
                    <option value="" disabled>Select Motivator</option>
                    <option value="Better Salary">Better Salary</option>
                    <option value="Career Growth">Career Growth</option>
                    <option value="New Opportunities">New Opportunities</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Industry Recognition">Industry Recognition</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 5: Career Confidence Score */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold">6</div>
                <h3 className="text-2xl font-bold text-white">Career Confidence Score</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="form-label">How confident are you about achieving your career goals? (1-10) *</label>
                  <input required type="number" min="1" max="10" name="confidenceScore" value={formData.confidenceScore} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Do you have a clear career roadmap? *</label>
                    <select required name="clearRoadmap" value={formData.clearRoadmap} onChange={handleInputChange} className="form-input form-select">
                      <option value="" disabled>Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Right skills for future opportunities? *</label>
                    <select required name="rightSkills" value={formData.rightSkills} onChange={handleInputChange} className="form-input form-select">
                      <option value="" disabled>Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Partially">Partially</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Consultation Qualification */}
            <div className="glass-panel rounded-[24px] p-8 border-white/10 border-indigo-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">7</div>
                  <h3 className="text-2xl font-bold text-white">Consultation Qualification</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="form-label text-indigo-300">Most Important Question: If you could solve ONE career challenge in the next 12 months, what would it be? *</label>
                    <textarea required name="topCareerChallenge12Months" value={formData.topCareerChallenge12Months} onChange={handleInputChange} rows="3" className="form-input resize-none border-indigo-500/30" placeholder="Type your answer here..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl font-bold text-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Submitting Assessment...</span>
              ) : (
                <><Send size={20}/> Submit Assessment</>
              )}
            </button>
          </form>
        </div>
      </section>
      )}

      {/* STEP 3: SUCCESS SECTION */}
      {currentStep === 3 && (
        <div className="max-w-[800px] mx-auto px-6 text-center py-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="glass-panel rounded-[32px] p-12 relative overflow-hidden shadow-2xl border-emerald-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/5"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Slot Booked Successfully!</h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-lg mx-auto font-light leading-relaxed">
                Thank you for completing the payment and submitting your assessment. Your live 1-on-1 mentor slot is confirmed for <strong>{new Date(selectedDate).toLocaleDateString()} at {formatTime(selectedSlot)}</strong>.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-all mx-auto border border-white/20"
              >
                <ArrowRight size={18} className="rotate-180" /> Return to Homepage
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/919380736449?text=${encodeURIComponent("Hi Krutanic Team,\nI am facing an issue while booking my Skill Evaluation Test slot.\nKindly help me resolve it.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full py-2 px-4 shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-green-500/30 font-semibold"
      >
        <span>Live Support</span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-8 h-8"
        />
      </a>
    </div>
  );
};

export default SkillEvaluationTest;
