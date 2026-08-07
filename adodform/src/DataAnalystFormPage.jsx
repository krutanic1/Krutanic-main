import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './DataAnalystFormPage.css';
import {
  ComparisonSection,
  FAQSection,
  ReviewsSection
} from './LandingComponents';
import {
  StatsBar,
  WhyKrutanic,
  WhoThisIsFor,
  CareerRoles,
  CurriculumRoadmap,
  RealProjects,
  ToolsCovered,
  CareerSupport,
  HiringPartners,
  FAQBlock,
  FinalCTA
} from './DataAnalystSections';
import ImgHeroGraphic from './assets/card_sales_dashboard.png';

/* --- SVG Icons --- */
const BriefcaseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const UsersIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const TargetIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const CheckCircleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const DataAnalystFormPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Section 1
    name: '',
    contactNumber: '',
    personalEmailId: '',
    collegeLocation: '',
    degreeBranch: '',
    degreeOther: '',
    yearOfGraduation: '',
    
    // Section 2
    placementStatus: '',
    obstacle: '',
    
    // Section 3
    salaryTarget: '',
    programRouting: '',
    
    // Section 4
    fundingPlan: '',
    startTimeline: '',
    
    // Section 5
    nextStep: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    let stepErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) stepErrors.name = 'Full Name is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.replace(/\D/g, '').length < 7) {
      stepErrors.contactNumber = 'Valid Mobile Number is required';
    }
    if (!formData.personalEmailId.trim() || !emailRegex.test(formData.personalEmailId)) {
      stepErrors.personalEmailId = 'Valid Email Address is required';
    }
    if (!formData.collegeLocation.trim()) stepErrors.collegeLocation = 'College / University & Location is required';
    if (!formData.degreeBranch) stepErrors.degreeBranch = 'Degree & Branch of Study is required';
    if (formData.degreeBranch === 'Other' && !formData.degreeOther.trim()) {
      stepErrors.degreeOther = 'Please specify your degree';
    }
    if (!formData.yearOfGraduation) stepErrors.yearOfGraduation = 'Year of Graduation is required';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    let stepErrors = {};
    if (!formData.placementStatus) stepErrors.placementStatus = 'Please select your current placement status';
    if (!formData.obstacle) stepErrors.obstacle = 'Please select your biggest obstacle';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    let stepErrors = {};
    if (!formData.salaryTarget) stepErrors.salaryTarget = 'Please select your target package';
    if (!formData.programRouting) stepErrors.programRouting = 'Please select which solution describes your needs';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep4 = () => {
    let stepErrors = {};
    if (!formData.fundingPlan) stepErrors.fundingPlan = 'Please select your funding plan';
    if (!formData.nextStep) stepErrors.nextStep = 'Please select an option';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 4) return;
    
    if (!validateStep4()) return;

    setIsSubmitting(true);

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxhXxyWD6Wqy1bPF5kmgdauNZesCssV2ndSuJKcv4mKsldfSt-q0Qn11pxg9Blplfbm/exec";

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('personalEmailId', formData.personalEmailId);
      params.append('contactNumber', formData.contactNumber);
      params.append('collegeLocation', formData.collegeLocation); 
      
      const fullDegree = formData.degreeBranch === 'Other' ? formData.degreeOther : formData.degreeBranch;
      params.append('degreeBranch', fullDegree);
      params.append('yearOfGraduation', formData.yearOfGraduation);
      
      params.append('placementStatus', formData.placementStatus);
      params.append('obstacle', formData.obstacle);
      params.append('salaryTarget', formData.salaryTarget);
      params.append('programRouting', formData.programRouting);
      params.append('fundingPlan', formData.fundingPlan);
      params.append('nextStep', formData.nextStep);
      params.append('formSource', 'dataanalytics');

      await fetch(scriptUrl, { 
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString() 
      });

      setIsSubmitting(false); 
      setSubmitted(true);
      toast.success("Application successfully submitted!");
    } catch (err) {
      console.error("Form submission error:", err);
      setIsSubmitting(false); 
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className="da-page-wrapper">
      <Toaster position="top-center" reverseOrder={false} />
      
      <section className="da-hero-section">
        <img src={ImgHeroGraphic} alt="Data Dashboard" className="da-hero-glow-img" />
        <div className="da-container da-split-layout">
          
          <div className="da-content-side">
            <span className="da-eyebrow">Applications Open for Next Cohort</span>
            <h1 className="da-headline">Build Job-Ready Data Skills with Mentorship & Real Projects</h1>
            <p className="da-subheadline">
              <strong>Stop Applying. Start Getting Interview Calls.</strong><br/><br/>
              Become a Job-Ready Data Analyst through industry-led training, real-world projects, and a structured career acceleration program. Build a recruiter-ready portfolio, receive dedicated placement support, and unlock up to 15 guaranteed interview opportunities with access to 450+ hiring partners.*
            </p>
            
            <div className="da-hero-actions">
              <div className="da-hero-cta-row">
                <button className="da-hero-btn-primary" onClick={() => document.getElementById('hero-form').scrollIntoView({behavior: 'smooth'})}>
                  Book Free Career Consultation
                </button>
              </div>
              <span className="da-hero-microcopy"><CheckCircleIcon size={14} /> Free consultation • No spam • 24h response</span>
            </div>

            <div className="da-hero-trust">
              <div className="da-avatar-stack">
                <div className="da-avatar" style={{backgroundColor: '#3b82f6'}}>SD</div>
                <div className="da-avatar" style={{backgroundColor: '#10b981'}}>AK</div>
                <div className="da-avatar" style={{backgroundColor: '#8b5cf6'}}>RN</div>
                <div className="da-avatar" style={{backgroundColor: '#f59e0b'}}>+200</div>
              </div>
              <p className="da-trust-text">Join <strong>200+ learners</strong> placed across <strong>450+ hiring partners</strong></p>
            </div>
            
            <div className="da-metrics-grid da-metrics-compact">
              <div className="da-metric-box">
                <div className="da-metric-value">₹16L</div>
                <div className="da-metric-label">Highest Package</div>
              </div>
              <div className="da-metric-box">
                <div className="da-metric-value">93%</div>
                <div className="da-metric-label">Placement Rate</div>
              </div>
              <div className="da-metric-box">
                <div className="da-metric-value">87%</div>
                <div className="da-metric-label">Placed in 60 Days</div>
              </div>
            </div>
          </div>

          <div className="da-form-side" id="hero-form">
            <div className="da-urgency-strip">
              <div className="da-urgency-stat">
                <span className="da-urg-val">132</span>
                <span className="da-urg-lbl">Today's Applications</span>
              </div>
              <div className="da-urgency-stat">
                <span className="da-urg-val">89</span>
                <span className="da-urg-lbl">Skill Evaluations Completed</span>
              </div>
              <div className="da-urgency-stat">
                <span className="da-urg-val da-urg-alert">12</span>
                <span className="da-urg-lbl">Seats Remaining</span>
              </div>
            </div>
            
            <div className="da-form-card">
              {submitted ? (
                <div className="da-success-state">
                  <div className="da-success-icon">
                    <CheckCircleIcon size={32} />
                  </div>
                  <h3 className="da-success-title">Application Received</h3>
                  <p className="da-success-desc">Thanks for applying. Our career team will review your profile and contact you shortly to guide you on the best path forward.</p>
                  <button className="da-btn da-btn-secondary" style={{width: '100%'}} onClick={() => window.location.reload()}>Return Home</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="da-form-header">
                    <h3 className="da-form-title">Check Your Eligibility</h3>
                    <p className="da-form-subtitle">Complete this short form to schedule your free career consultation.</p>
                  </div>
                  
                  <div className="da-progress-container">
                    <div className={`da-progress-step ${currentStep >= 1 ? 'completed' : ''}`}></div>
                    <div className={`da-progress-step ${currentStep >= 2 ? 'completed' : ''}`}></div>
                    <div className={`da-progress-step ${currentStep >= 3 ? 'completed' : ''}`}></div>
                    <div className={`da-progress-step ${currentStep >= 4 ? 'completed' : ''}`}></div>
                  </div>

                  {/* STEP 1: Basic Profile & Status */}
                  {currentStep === 1 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.name ? 'has-error' : ''}`}>
                        <label>1. Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="E.g. John Doe" />
                        {errors.name && <span className="da-error-text">{errors.name}</span>}
                      </div>
                      
                      <div className={`da-input-group ${errors.contactNumber ? 'has-error' : ''}`}>
                        <label>2. Contact Number (WhatsApp Enabled)</label>
                        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91" />
                        {errors.contactNumber && <span className="da-error-text">{errors.contactNumber}</span>}
                      </div>

                      <div className={`da-input-group ${errors.personalEmailId ? 'has-error' : ''}`}>
                        <label>Email Address</label>
                        <input type="email" name="personalEmailId" value={formData.personalEmailId} onChange={handleInputChange} placeholder="john@example.com" />
                        {errors.personalEmailId && <span className="da-error-text">{errors.personalEmailId}</span>}
                      </div>

                      <div className={`da-input-group ${errors.collegeLocation ? 'has-error' : ''}`}>
                        <label>3. Current College / University & Location</label>
                        <input type="text" name="collegeLocation" value={formData.collegeLocation} onChange={handleInputChange} placeholder="E.g. XYZ College, Mumbai" />
                        {errors.collegeLocation && <span className="da-error-text">{errors.collegeLocation}</span>}
                      </div>

                      <div className={`da-input-group ${errors.degreeBranch ? 'has-error' : ''}`}>
                        <label>4. Degree & Branch of Study</label>
                        <select name="degreeBranch" value={formData.degreeBranch} onChange={handleInputChange}>
                          <option value="">Select your degree...</option>
                          <option value="B.Tech / B.E. (CS, IT, AI/ML, ECE, Data Science)">B.Tech / B.E. (CS, IT, AI/ML, ECE, Data Science)</option>
                          <option value="B.Tech / B.E. (Mechanical, Civil, Electrical, Other)">B.Tech / B.E. (Mechanical, Civil, Electrical, Other)</option>
                          <option value="BCA / MCA / B.Sc (IT/CS)">BCA / MCA / B.Sc (IT/CS)</option>
                          <option value="MBA / PGDM / BBA">MBA / PGDM / BBA</option>
                          <option value="Other">Other</option>
                        </select>
                        {formData.degreeBranch === 'Other' && (
                          <input type="text" name="degreeOther" value={formData.degreeOther} onChange={handleInputChange} placeholder="Specify your degree" style={{marginTop: '8px'}} />
                        )}
                        {errors.degreeBranch && <span className="da-error-text">{errors.degreeBranch}</span>}
                        {errors.degreeOther && <span className="da-error-text">{errors.degreeOther}</span>}
                      </div>

                      <div className={`da-input-group ${errors.yearOfGraduation ? 'has-error' : ''}`}>
                        <label>5. Year of Graduation</label>
                        <select name="yearOfGraduation" value={formData.yearOfGraduation} onChange={handleInputChange}>
                          <option value="">Select your year of graduation...</option>
                          <option value="Passed Out (2023 / 2024 / 2025 batch)">Passed Out (2023 / 2024 / 2025 batch)</option>
                          <option value="Final Year (Graduating in 2026)">Final Year (Graduating in 2026)</option>
                          <option value="Pre-Final Year (Graduating in 2027)">Pre-Final Year (Graduating in 2027)</option>
                        </select>
                        {errors.yearOfGraduation && <span className="da-error-text">{errors.yearOfGraduation}</span>}
                      </div>
                      
                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-primary" onClick={nextStep}>Continue</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Current Placement Status & Pain Points */}
                  {currentStep === 2 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.placementStatus ? 'has-error' : ''}`}>
                        <label>6. What is your current placement status?</label>
                        <select name="placementStatus" value={formData.placementStatus} onChange={handleInputChange}>
                          <option value="">Select your current placement status...</option>
                          <option value="Unplaced & actively searching for opportunities">Unplaced & actively searching for opportunities</option>
                          <option value="Placed, but salary package is below my target (< ₹5 LPA)">Placed, but salary package is below my target (&lt; ₹5 LPA)</option>
                          <option value="Internship only; looking for full-time job offer">Internship only; looking for full-time job offer</option>
                          <option value="Placed with a good package, but looking for a premium company switch">Placed with a good package, but looking for a premium company switch</option>
                        </select>
                        {errors.placementStatus && <span className="da-error-text">{errors.placementStatus}</span>}
                      </div>

                      <div className={`da-input-group ${errors.obstacle ? 'has-error' : ''}`}>
                        <label>7. What is your biggest obstacle right now?</label>
                        <select name="obstacle" value={formData.obstacle} onChange={handleInputChange}>
                          <option value="">Select your biggest obstacle...</option>
                          <option value="No Interview Calls: My resume isn't getting shortlisted on job portals.">No Interview Calls: My resume isn't getting shortlisted on job portals.</option>
                          <option value="Failing Technical/HR Rounds: I get calls, but get rejected in interview rounds.">Failing Technical/HR Rounds: I get calls, but get rejected in interview rounds.</option>
                          <option value="Skill Gap: I don't feel job-ready in Data Analytics, Business Analytics, or Tech domains.">Skill Gap: I don't feel job-ready in Data Analytics, Business Analytics, or Tech domains.</option>
                          <option value="Campus Placement Deficit: Our college isn't bringing high-paying companies.">Campus Placement Deficit: Our college isn't bringing high-paying companies.</option>
                        </select>
                        {errors.obstacle && <span className="da-error-text">{errors.obstacle}</span>}
                      </div>

                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-secondary" onClick={prevStep}>Back</button>
                        <button type="button" className="da-btn da-btn-primary" onClick={nextStep}>Continue</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Salary Target & Program Routing */}
                  {currentStep === 3 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.salaryTarget ? 'has-error' : ''}`}>
                        <label>8. What minimum annual package (LPA) are you aiming for in your next role?</label>
                        <select name="salaryTarget" value={formData.salaryTarget} onChange={handleInputChange}>
                          <option value="">Select your target package...</option>
                          <option value="₹4 LPA – ₹6 LPA">₹4 LPA – ₹6 LPA</option>
                          <option value="₹6 LPA – ₹10 LPA">₹6 LPA – ₹10 LPA</option>
                          <option value="₹10 LPA – ₹15+ LPA">₹10 LPA – ₹15+ LPA</option>
                        </select>
                        {errors.salaryTarget && <span className="da-error-text">{errors.salaryTarget}</span>}
                      </div>

                      <div className={`da-input-group ${errors.programRouting ? 'has-error' : ''}`}>
                        <label>9. Which solution best describes what you need right now?</label>
                        <select name="programRouting" value={formData.programRouting} onChange={handleInputChange}>
                          <option value="">Select solution...</option>
                          <option value='Guaranteed Interview Track: "I already have the required skills and need guaranteed interview opportunities with top MNCs to secure my next job."'>Guaranteed Interview Track: "I already have the required skills..."</option>
                          <option value='Career Switch Track: "I want to transition into a high-paying role with expert mentorship, industry-focused training, and end-to-end placement support."'>Career Switch Track: "I want to transition into a high-paying role..."</option>
                          <option value='Salary Hike Accelerator Track: "I am looking for a 50%–100% salary hike by upgrading my skills and getting placed in a better company."'>Salary Hike Accelerator Track: "I am looking for a 50%–100% salary hike..."</option>
                          <option value='Placement Success Track: "I want a complete career transformation—from live projects and 1-on-1 mentorship to guaranteed interviews and placement assistance until I get hired."'>Placement Success Track: "I want a complete career transformation..."</option>
                        </select>
                        {errors.programRouting && <span className="da-error-text">{errors.programRouting}</span>}
                      </div>
                      
                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-secondary" onClick={prevStep}>Back</button>
                        <button type="button" className="da-btn da-btn-primary" onClick={nextStep}>Continue</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: High-Intent & Final Action */}
                  {currentStep === 4 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.fundingPlan ? 'has-error' : ''}`}>
                        <label style={{ lineHeight: '1.5' }}>
                          10. If you are selected for Krutanic's Premium Placement & Guaranteed Interview Program, how will you secure your seat?
                        </label>
                        <select name="fundingPlan" value={formData.fundingPlan} onChange={handleInputChange} style={{ marginTop: '12px' }}>
                          <option value="">Select an option...</option>
                          <option value="I am ready to pay the full fee immediately.">I am ready to pay the full fee immediately.</option>
                          <option value="I will enroll through an EMI plan.">I will enroll through an EMI plan.</option>
                          <option value="I can pay the registration amount today and complete the remaining before the batch starts.">I can pay the registration amount today and complete the remaining before the batch starts.</option>
                          <option value="I want to speak with a Career Advisor before making the payment.">I want to speak with a Career Advisor before making the payment.</option>
                        </select>
                        {errors.fundingPlan && <span className="da-error-text">{errors.fundingPlan}</span>}
                      </div>

                      <div className={`da-input-group ${errors.nextStep ? 'has-error' : ''}`}>
                        <label>11. Are you ready to take a 15-minute Skill Evaluation & Career Diagnostic Test for ₹101 to check your eligibility?</label>
                        <select name="nextStep" value={formData.nextStep} onChange={handleInputChange}>
                          <option value="">Select an option...</option>
                          <option value="Yes! Book my evaluation slot immediately via WhatsApp.">Yes! Book my evaluation slot immediately via WhatsApp.</option>
                          <option value="No, I want a counselor to call me first to explain the program structure.">No, I want a counselor to call me first to explain the program structure.</option>
                        </select>
                        {errors.nextStep && <span className="da-error-text">{errors.nextStep}</span>}
                      </div>

                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-secondary" onClick={prevStep}>Back</button>
                        <button type="submit" className="da-btn da-btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Processing...' : 'Submit Application'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="da-trust-blocks">
                    <div className="da-trust-item">
                      <span className="da-trust-icon"><CheckCircleIcon /></span> Built Around Real Industry Hiring Standards to Help You Become a Job-Ready Data Analyst.
                    </div>
                    <div className="da-trust-item">
                      <span className="da-trust-icon"><CheckCircleIcon /></span> 200+ learners placed and 450+ hiring partners.
                    </div>
                    <div className="da-trust-item">
                      <span className="da-trust-icon"><CheckCircleIcon /></span> 4.7-rated program with 93% placement rate.
                    </div>
                    <div className="da-trust-item">
                      <span className="da-trust-icon"><CheckCircleIcon /></span> Small cohort size of 30 for better attention and mentorship.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </section>

      {/* <StatsBar /> */}
      <div className="da-shared-overrides">
        <ReviewsSection isDataAnalyst={true} />
      </div>
      <WhyKrutanic />
      <WhoThisIsFor />
      <CareerRoles />
      <CurriculumRoadmap />
      <RealProjects />
      <ToolsCovered />
      <CareerSupport />
      <HiringPartners />
      <FAQBlock />
      <FinalCTA />
    </div>
  );
};

export default DataAnalystFormPage;
