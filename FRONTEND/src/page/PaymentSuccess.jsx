import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, ArrowRight, Calendar, Clock, Send
} from 'lucide-react';
import API from '../API';
import { getAvailableDates, getSlotsForDate } from '../utils/slotScheduler';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state || !location.state.paymentDetails) {
    return <Navigate to="/career-assessment" replace />;
  }

  const { paymentDetails, prePaymentId, formData: initialFormData } = location.state;

  const [currentStep, setCurrentStep] = useState(1); // 1: Booking, 2: Form, 3: Success
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    ageGroup: '',
    currentStatus: '',
    fieldOfStudy: '',
    currentJobRole: '',
    yearsOfExperience: initialFormData?.yearsOfExperience || '',
    currentWorkingDomain: initialFormData?.currentWorkingDomain || '',
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
    topCareerChallenge12Months: '',
    ...(initialFormData || {})
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Validate that essential payment data exists
    if (!paymentDetails?.id) {
      toast.error('Payment details are missing. Please go back and complete payment again.');
      navigate('/career-assessment', { replace: true });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        // Include name/email/phone from initialFormData since they were collected pre-payment
        fullName: formData.fullName || initialFormData?.fullName || '',
        email: formData.email || initialFormData?.email || '',
        mobileNumber: formData.mobileNumber || initialFormData?.mobileNumber || '',
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
      console.error('Assessment submission error:', error);
      if (error.response?.data?.error === "SLOT_TAKEN") {
          toast.error(error.response?.data?.message || "Slot taken by another user. Please pick another.");
          setCurrentStep(1); // Go back to calendar
      } else if (error.response?.data?.error === "This payment has already been used for an assessment.") {
          // Payment was already used — the assessment was likely already submitted successfully
          toast.success('Your assessment has already been submitted successfully!');
          setCurrentStep(3);
      } else {
          toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to submit assessment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 || 12;
      return `${formattedH}:${minutes} ${ampm}`;
  };

  return (
    <div 
      className="text-zinc-300 font-['Inter'] min-h-screen pt-24 pb-16 selection:bg-indigo-500/30"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(5,5,5,0.85), rgba(5,5,5,0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <Helmet>
        <title>Assessment Registration | Krutanic</title>
        <meta name="description" content="Complete your assessment registration and book your live mentor slot." />
      </Helmet>

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
      `}</style>

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

export default PaymentSuccess;
