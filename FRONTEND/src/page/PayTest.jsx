import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CheckCircle2, ArrowRight, Target, Sparkles, Send, ShieldCheck,
  Calendar, Clock, AlertTriangle
} from 'lucide-react';
import API from '../API';
import { getAvailableDates, getSlotsForDate } from '../utils/slotScheduler';

// ──────────────────────────────────────────────────────────────────────────────
// /paytest  —  ₹1 test payment page
// Mirrors the full SkillEvaluationTest flow but hits /api/paytest-payment/*
// Use this page ONLY to verify the end-to-end Razorpay flow in production.
// ──────────────────────────────────────────────────────────────────────────────

const PayTest = () => {
  const navigate = useNavigate();

  // ─── Step management ───────────────────────────────────────────────────────
  // Step 0: Pre-payment form
  // Step 1: Slot booking (post-payment)
  // Step 2: Full assessment form
  // Step 3: Final success
  const [currentStep, setCurrentStep] = useState(0);

  // ─── Payment state ─────────────────────────────────────────────────────────
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(!!window.Razorpay);
  const [prePaymentId, setPrePaymentId] = useState(null);
  const [isSubmittingPrePayment, setIsSubmittingPrePayment] = useState(false);

  // ─── Slot booking state ────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);

  // ─── Form state ────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // ─── Mobile UPI Recovery ───────────────────────────────────────────────────
  useEffect(() => {
    const recoverMobilePayment = async () => {
      try {
        const pending = sessionStorage.getItem('krutanic_paytest_pending');
        if (!pending) return;

        const { orderId, prePaymentId: savedPPId, formData: savedFD, timestamp } = JSON.parse(pending);

        if (Date.now() - timestamp > 30 * 60 * 1000) {
          sessionStorage.removeItem('krutanic_paytest_pending');
          return;
        }

        const res = await axios.get(`${API}/api/paytest-payment/check-order/${orderId}`);

        if (res.data.success && res.data.paid) {
          sessionStorage.removeItem('krutanic_paytest_pending');
          const pDetails = {
            id: res.data.payment.razorpay_payment_id,
            orderId: res.data.payment.razorpay_order_id,
            signature: res.data.payment.razorpay_signature
          };
          setPaymentDetails(pDetails);
          setPrePaymentId(savedPPId);
          if (savedFD) {
            setFormData(prev => ({ ...prev, ...savedFD }));
          }
          toast.success('₹1 test payment recovered successfully!');
          setCurrentStep(1);
        } else {
          console.log('PayTest: Pending payment not yet captured.');
        }
      } catch (err) {
        console.error('PayTest: Mobile recovery failed:', err);
      }
    };

    recoverMobilePayment();
  }, []);

  // ─── Load Razorpay script ──────────────────────────────────────────────────
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => toast.error('Payment gateway failed to load. Please refresh.');
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  // ─── Pre-payment submit ────────────────────────────────────────────────────
  const handlePrePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingPrePayment) return;

    if (!razorpayReady) {
      toast.error('Payment gateway is still loading. Please wait and try again.');
      return;
    }

    try {
      setIsSubmittingPrePayment(true);
      const res = await axios.post(`${API}/pre-payment`, formData);
      if (res.data.prePaymentId) {
        const savedPrePaymentId = res.data.prePaymentId;
        setPrePaymentId(savedPrePaymentId);
        handlePayment(savedPrePaymentId, { ...formData });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save details.');
    } finally {
      setIsSubmittingPrePayment(false);
    }
  };

  // ─── ₹1 Payment initiation ────────────────────────────────────────────────
  const handlePayment = async (savedPrePaymentId, savedFormData) => {
    const currentPrePaymentId = savedPrePaymentId || prePaymentId;
    const currentFormData = savedFormData || { ...formData };

    // Dev bypass
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const pDetails = {
        id: 'dev_paytest_' + Date.now(),
        orderId: 'dev_order_' + Date.now(),
        signature: 'dev_signature'
      };
      setPaymentDetails(pDetails);
      toast.success('Dev bypass — ₹1 payment skipped!');
      setCurrentStep(1);
      return;
    }

    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    try {
      setIsProcessingPayment(true);

      let order;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await axios.post(`${API}/api/paytest-payment/create-order`);
          order = res.data.order;
          break;
        } catch (orderErr) {
          if (attempt === 2) throw orderErr;
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      // Save before opening Razorpay — mobile UPI recovery
      sessionStorage.setItem('krutanic_paytest_pending', JSON.stringify({
        orderId: order.id,
        prePaymentId: currentPrePaymentId,
        formData: currentFormData,
        timestamp: Date.now()
      }));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
        amount: order.amount,
        currency: order.currency,
        name: 'Krutanic',
        description: '₹1 Test Payment',
        order_id: order.id,
        handler: async function (response) {
          sessionStorage.removeItem('krutanic_paytest_pending');
          try {
            const verifyRes = await axios.post(`${API}/api/paytest-payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.data.success) {
              const pDetails = {
                id: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              };
              setPaymentDetails(pDetails);
              setIsProcessingPayment(false);
              toast.success('₹1 test payment successful!');
              setCurrentStep(1);
            } else {
              setIsProcessingPayment(false);
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setIsProcessingPayment(false);
            console.error('PayTest: Verification error:', err);
            toast.error('Payment verification failed. If money was deducted, contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            sessionStorage.removeItem('krutanic_paytest_pending');
            setIsProcessingPayment(false);
          }
        },
        theme: { color: '#4f46e5' }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        sessionStorage.removeItem('krutanic_paytest_pending');
        setIsProcessingPayment(false);
        toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'));
      });
      rzp1.open();
    } catch (err) {
      setIsProcessingPayment(false);
      console.error('PayTest: Initiation error:', err);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  // ─── Slot fetching ─────────────────────────────────────────────────────────
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

  // ─── Final form submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!paymentDetails?.id) {
      toast.error('Payment details are missing. Please go back and complete payment again.');
      setCurrentStep(0);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        fullName: formData.fullName || '',
        email: formData.email || '',
        mobileNumber: formData.mobileNumber || '',
        prePaymentId: prePaymentId || null,
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
      console.error('PayTest: Submission error:', error);
      if (error.response?.data?.error === 'SLOT_TAKEN') {
        toast.error(error.response?.data?.message || 'Slot taken. Please pick another.');
        setCurrentStep(1);
      } else if (error.response?.data?.error === 'This payment has already been used for an assessment.') {
        toast.success('Your assessment has already been submitted!');
        setCurrentStep(3);
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to submit assessment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Shared styles ─────────────────────────────────────────────────────────
  const styles = `
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
    .form-select option { background: #18181b; color: white; }
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
    .slot-btn:hover:not(:disabled) { background: rgba(99, 102, 241, 0.3); }
    .slot-btn.selected {
      background: #4f46e5;
      border-color: #4f46e5;
      box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
    }
    .slot-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: rgba(255,255,255,0.05);
      border-color: rgba(255,255,255,0.1);
    }
  `;

  return (
    <div
      className="text-zinc-300 font-['Inter'] min-h-screen"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(5,5,5,0.9), rgba(5,5,5,0.97))",
        backgroundSize: 'cover'
      }}
    >
      <Helmet>
        <title>₹1 Test Payment | Krutanic (Internal)</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <style>{styles}</style>

      {/* ── TEST MODE BANNER ─────────────────────────────────────────────── */}
      <div className="bg-amber-500/20 border-b border-amber-500/30 py-2 px-6 text-center">
        <p className="text-amber-400 font-bold text-sm flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          TEST MODE — This page charges only ₹1 and is for internal payment testing only.
          <AlertTriangle size={16} />
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 0 — PRE-PAYMENT FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 0 && (
        <section className="flex min-h-screen items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[480px]"
          >
            <div className="glass-panel rounded-[28px] p-8 relative overflow-hidden shadow-2xl border border-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-amber-500/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Target size={22} />
                  </div>
                  <h1 className="text-xl font-bold text-white">₹1 Payment Test</h1>
                </div>
                <p className="text-sm text-zinc-400 mb-6 pl-[52px]">
                  Internal test — verifies the full Razorpay flow end-to-end.
                </p>

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
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingPrePayment || isProcessingPayment}
                    className="w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-amber-500 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 text-base mt-2"
                  >
                    {isSubmittingPrePayment || isProcessingPayment ? (
                      <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />Processing...</span>
                    ) : (
                      <>Pay ₹1 — Test Payment <ArrowRight size={18} /></>
                    )}
                  </button>
                  <p className="text-amber-400 text-xs font-medium text-center">Only ₹1 will be charged — internal testing only</p>
                </form>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — SLOT BOOKING (post-payment)
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <section className="py-20 px-6">
          <div className="max-w-[700px] mx-auto">

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-emerald-400 font-bold">₹1 Test Payment Successful!</p>
                <p className="text-zinc-400 text-sm">Now select your live mentor slot to complete booking.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[24px] p-8 border-white/10">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-bold text-white">Select Your Live Mentor Slot</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="form-label flex items-center gap-2"><Calendar size={16} /> Select Date *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {getAvailableDates(1).map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => fetchSlots(item.dateStr)}
                        className={`slot-btn py-3 ${selectedDate === item.dateStr ? 'selected' : ''}`}
                      >
                        {item.displayStr}{item.isToday && ' (Today)'}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="form-label flex items-center gap-2 mt-6 mb-4"><Clock size={16} /> Select Time Slot *</label>
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
                    Continue to Form <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — FULL ASSESSMENT FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <section className="py-16 px-6">
          <div className="max-w-[700px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-10">

              <div className="glass-panel rounded-[24px] p-6 border-emerald-500/30 bg-emerald-500/5 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h4 className="text-emerald-400 font-bold">Booking Confirmed:</h4>
                  <p className="text-zinc-300">{selectedDate.split('-').reverse().join('/')} at {formatTime(selectedSlot)}</p>
                </div>
                <button type="button" onClick={() => setCurrentStep(1)} className="text-indigo-400 text-sm hover:underline">Change Slot</button>
              </div>

              {/* Basic Info */}
              <div className="glass-panel rounded-[24px] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="text-xl font-bold text-white">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              {/* Professional Profile */}
              <div className="glass-panel rounded-[24px] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="text-xl font-bold text-white">Professional Profile</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <label className="form-label">Current Job Role</label>
                    <input type="text" name="currentJobRole" value={formData.currentJobRole} onChange={handleInputChange} className="form-input" placeholder="e.g. Data Analyst" />
                  </div>
                </div>
              </div>

              {/* Goals & Challenges */}
              <div className="glass-panel rounded-[24px] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <h3 className="text-xl font-bold text-white">Goals & Challenges</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="form-label">Primary career goal? *</label>
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
                    <label className="form-label">Goal Timeline? *</label>
                    <select required name="goalTimeline" value={formData.goalTimeline} onChange={handleInputChange} className="form-input form-select">
                      <option value="" disabled>Select Timeline</option>
                      <option value="Within 3 Months">Within 3 Months</option>
                      <option value="Within 6 Months">Within 6 Months</option>
                      <option value="Within 12 Months">Within 12 Months</option>
                      <option value="Within 24 Months">Within 24 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Biggest career challenge today? *</label>
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

              {/* Skills Assessment */}
              <div className="glass-panel rounded-[24px] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">5</div>
                  <h3 className="text-xl font-bold text-white">Skills Assessment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Communication Skills (1-10) *</label>
                    <input required type="number" min="1" max="10" name="communicationSkills" value={formData.communicationSkills} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                  </div>
                  <div>
                    <label className="form-label">Problem-Solving Skills (1-10) *</label>
                    <input required type="number" min="1" max="10" name="problemSolvingSkills" value={formData.problemSolvingSkills} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Tech Comfort Level *</label>
                    <select required name="techComfort" value={formData.techComfort} onChange={handleInputChange} className="form-input form-select">
                      <option value="" disabled>Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Weekly Learning Hours *</label>
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
                    <label className="form-label">Primary Motivator *</label>
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

              {/* Confidence */}
              <div className="glass-panel rounded-[24px] p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-sm">6</div>
                  <h3 className="text-xl font-bold text-white">Career Confidence</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="form-label">Confidence Score (1-10) *</label>
                    <input required type="number" min="1" max="10" name="confidenceScore" value={formData.confidenceScore} onChange={handleInputChange} className="form-input" placeholder="Scale 1-10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Clear career roadmap? *</label>
                      <select required name="clearRoadmap" value={formData.clearRoadmap} onChange={handleInputChange} className="form-input form-select">
                        <option value="" disabled>Select Option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Right skills for future? *</label>
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

              {/* Consultation */}
              <div className="glass-panel rounded-[24px] p-8 border-indigo-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">7</div>
                    <h3 className="text-xl font-bold text-white">Consultation Qualification</h3>
                  </div>
                  <div>
                    <label className="form-label text-indigo-300">If you could solve ONE career challenge in 12 months, what would it be? *</label>
                    <textarea required name="topCareerChallenge12Months" value={formData.topCareerChallenge12Months} onChange={handleInputChange} rows="3" className="form-input resize-none border-indigo-500/30" placeholder="Type your answer here..." />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl font-bold text-white flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-amber-500 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 text-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Submitting...</span>
                ) : (
                  <><Send size={20} /> Submit Assessment</>
                )}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 3 — SUCCESS
      ══════════════════════════════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <div className="max-w-[600px] mx-auto px-6 text-center py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[32px] p-12 relative overflow-hidden shadow-2xl border-emerald-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/5" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Test Complete! ✅</h2>
              <p className="text-zinc-300 mb-2">
                ₹1 payment verified and assessment submitted successfully.
              </p>
              <p className="text-emerald-400 font-semibold mb-8">
                Slot: <strong>{selectedDate.split('-').reverse().join('/')} at {formatTime(selectedSlot)}</strong>
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
                <p className="text-amber-400 text-sm font-semibold">
                  ✓ Payment gateway working correctly<br />
                  ✓ Mobile UPI recovery active<br />
                  ✓ Slot booking working<br />
                  ✓ Form submission working
                </p>
              </div>
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
    </div>
  );
};

export default PayTest;
