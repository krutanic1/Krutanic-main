import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, CreditCard, Ticket, ArrowRight, Loader2, QrCode } from 'lucide-react';
import axios from 'axios';

interface Course {
  _id?: string;
  title: string;
  price?: number;
  tag?: string;
}

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const steps = ['Personal Details', 'Referral & Payment', 'Transaction Verification', 'Success'];

export default function EnrollModal({ isOpen, onClose, course }: EnrollModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    message: '',
    referralCode: '',
    transactionId: ''
  });
  const [enrollmentId, setEnrollmentId] = useState('');
  const [price, setPrice] = useState(course.price || 5000);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [error, setError] = useState('');
  const [commonPaymentLink, setCommonPaymentLink] = useState('');
  const [customReferralLink, setCustomReferralLink] = useState('');
  const [fakeRegs, setFakeRegs] = useState<any[]>([]);
  const [currentRegIndex, setCurrentRegIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFakeRegs();
      fetchGlobalConfig();
      setPrice(course.price || 5000);
      setDiscountApplied(false);
      setCustomReferralLink('');
      setFormData(prev => ({ ...prev, referralCode: '' }));
    }
  }, [isOpen, course]);

  const fetchGlobalConfig = async () => {
    try {
      const res = await axios.get('/microcourses/config');
      if (res.data.commonPaymentLink) {
        setCommonPaymentLink(res.data.commonPaymentLink);
      }
    } catch (err) {
      console.error('Failed to fetch global config', err);
    }
  };

  useEffect(() => {
    if (!isOpen || fakeRegs.length === 0) return;

    const interval = setInterval(() => {
      setShowPopup(false);
      setTimeout(() => {
        setCurrentRegIndex((prev) => (prev + 1) % fakeRegs.length);
        setShowPopup(true);
      }, 500);
    }, 6000);

    // Initial show
    const initialTimeout = setTimeout(() => setShowPopup(true), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isOpen, fakeRegs]);

  const fetchFakeRegs = async () => {
    try {
      const res = await axios.get('/microcourses/fake-registrations');
      setFakeRegs(res.data);
    } catch (err) {
      console.error('Failed to fetch fake regs', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleCheckReferral = async () => {
    if (!formData.referralCode) return;
    setLoading(true);
    try {
      const res = await axios.post('/microcourses/check-referral', { code: formData.referralCode });
      if (res.data.discountPercentage) {
        const basePrice = course.price || 5000;
        setPrice(basePrice * (1 - res.data.discountPercentage / 100));
        setDiscountApplied(true);
        if (res.data.paymentLink) {
          setCustomReferralLink(res.data.paymentLink);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid referral code');
    } finally {
      setLoading(false);
    }
  };

  const initEnrollment = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/microcourses/enroll', {
        ...formData,
        courseId: course._id || 'unknown',
        courseName: course.title
      });
      setEnrollmentId(res.data.enrollmentId);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  const submitTransaction = async () => {
    if (!formData.transactionId) {
      setError('Please enter your Transaction ID');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/microcourses/submit-transaction', {
        enrollmentId,
        transactionId: formData.transactionId
      });
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface w-full max-w-2xl overflow-hidden editorial-shadow flex flex-col md:flex-row min-h-[500px]"
      >
        {/* Sidebar Info */}
        <div className="bg-primary p-8 md:w-1/3 text-white flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">Selected Course</div>
            <h2 className="text-2xl font-serif leading-tight mb-6">{course.title}</h2>
            
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 text-xs tracking-widest uppercase transition-opacity ${step >= i ? 'opacity-100 font-bold' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] ${step === i ? 'bg-white text-primary' : ''}`}>
                    {step > i ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-1">Final Price</div>
            <div className="text-3xl font-serif">₹{price}</div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 relative flex flex-col">
          <button onClick={onClose} className="absolute right-6 top-6 text-outline hover:text-primary transition-colors p-2 z-20">
            <X size={20} />
          </button>

          {/* Social Proof Popup */}
          <AnimatePresence>
            {showPopup && fakeRegs[currentRegIndex] && (
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="absolute right-4 bottom-24 p-4 bg-white editorial-shadow border-l-4 border-metallic-green z-50 flex items-center gap-4 max-w-[240px] pointer-events-none"
              >
                <div className="w-10 h-10 rounded-full bg-metallic-green/5 flex items-center justify-center shrink-0">
                   <CheckCircle2 size={18} className="text-metallic-green" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-metallic-green uppercase tracking-widest">{fakeRegs[currentRegIndex].name}</h4>
                  <p className="text-[9px] text-outline uppercase tracking-tighter mt-0.5">
                    {fakeRegs[currentRegIndex].emailMasked} <br/> 
                    <span className="text-secondary italic font-serif">Just Enrolled!</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl text-primary mb-6">Personal Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Full Name*</label>
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent" placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Email Address*</label>
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent" placeholder="Enter your email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Mobile Number*</label>
                    <input name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent" placeholder="+91 XXXX XXX XXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Message (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent resize-none h-20" placeholder="Any specific requirements?" />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl text-primary mb-6">Referral & Payment</h3>
                  
                  <div className="bg-surface-container-low p-6 space-y-4">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Referral Code</label>
                    <div className="flex gap-4">
                      <input name="referralCode" value={formData.referralCode} onChange={handleInputChange} className="flex-1 border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent uppercase font-bold" placeholder="Apply Code" />
                      <button 
                        onClick={handleCheckReferral}
                        disabled={loading || !formData.referralCode || discountApplied}
                        className="bg-primary text-white px-6 py-2 rounded text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Apply'}
                      </button>
                    </div>
                    {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
                    {discountApplied && <p className="text-green-600 text-[10px] font-bold">✓ 40% Discount Applied Successfully!</p>}
                  </div>

                  <div className="p-6 border border-outline-variant/30 text-center">
                    <p className="text-sm text-on-surface-variant mb-4">Total amount to pay:</p>
                    <div className="flex items-center justify-center gap-4">
                      <AnimatePresence mode="wait">
                        {discountApplied ? (
                          <motion.span 
                            key="discounted"
                            initial={{ scale: 1.5, color: '#FE4323' }}
                            animate={{ scale: 1, color: '#000' }}
                            className="text-4xl font-serif"
                          >
                            ₹{price}
                          </motion.span>
                        ) : (
                          <span className="text-4xl font-serif">₹5000</span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6 text-center"
                >
                  <h3 className="text-2xl text-primary mb-4">Verify Payment</h3>
                  <p className="text-xs text-on-surface-variant mb-6 italic">Scan the QR code to pay ₹{price}, then enter the Transaction ID below.</p>
                  
                  <div className="mx-auto w-48 h-48 bg-stone-100 flex items-center justify-center border border-outline-variant/20 mb-8">
                    <QrCode size={120} className="text-primary opacity-80" />
                  </div>

                  <div className="text-left space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Transaction ID*</label>
                    <input name="transactionId" value={formData.transactionId} onChange={handleInputChange} className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-mono text-sm" placeholder="Enter the 12-digit UPI ID" />
                    {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                   key="step3"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl text-primary leading-tight">Enrollment Request <br/>Received!</h3>
                  <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                    We will verify your payment (Transaction ID: <span className="font-mono text-primary">{formData.transactionId}</span>) within 24 hours. A welcome email will be sent upon approval.
                  </p>
                  <button onClick={onClose} className="bg-primary text-white px-10 py-4 rounded text-xs font-bold tracking-widest uppercase">Close</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div className="mt-12 flex justify-between items-center bg-white pt-6 border-t border-outline-variant/10">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0 || loading}
                className="text-xs font-bold tracking-widest uppercase text-outline hover:text-primary transition-colors disabled:opacity-0"
              >
                Back
              </button>
              
              <button 
                onClick={() => {
                  if (step === 0) setStep(1);
                  else if (step === 1) {
                    const finalPaymentLink = customReferralLink || commonPaymentLink || 'https://rzp.io/rzp/Instructor_Led_Slot_Booking';
                    window.open(finalPaymentLink, '_blank');
                    initEnrollment();
                  }
                  else if (step === 2) submitTransaction();
                }}
                disabled={loading || (step === 0 && (!formData.fullName || !formData.email || !formData.mobile))}
                className="bg-[#FE4323] text-white px-8 py-4 rounded text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-[#E03A1C] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (step === 2 ? 'Submit Payment' : (step === 1 ? 'Pay Now' : 'Continue'))}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
