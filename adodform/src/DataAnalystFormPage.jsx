import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './DataAnalystFormPage.css';
import {
  ComparisonSection,
  FAQSection
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
  Certification,
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
    name: '',
    contactNumber: '',
    personalEmailId: '',
    
    candidateType: '',
    specialization: '',
    yearsOfExperience: '',
    currentJobTitle: '',
    
    interestedDomain: '',
    whyLooking: '',
    preferredMode: '',
    startTimeline: '',
    
    isConfirmed: false
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
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    let stepErrors = {};
    
    if (!formData.candidateType) stepErrors.candidateType = 'Please select your current status';
    if (!formData.specialization.trim()) stepErrors.specialization = 'Please enter your specialization or degree';
    
    if (formData.candidateType === 'Working professional') {
      if (!formData.yearsOfExperience) stepErrors.yearsOfExperience = 'Years of experience is required';
      if (!formData.currentJobTitle.trim()) stepErrors.currentJobTitle = 'Current job title is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    let stepErrors = {};
    
    if (!formData.interestedDomain) stepErrors.interestedDomain = 'Please select an interested track';
    if (!formData.whyLooking) stepErrors.whyLooking = 'Please select your primary goal';
    if (!formData.preferredMode) stepErrors.preferredMode = 'Please select a preferred learning schedule';
    if (!formData.startTimeline) stepErrors.startTimeline = 'Please select a start timeline';
    if (!formData.isConfirmed) stepErrors.isConfirmed = 'Please consent to being contacted';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) return;
    
    if (!validateStep3()) return;

    setIsSubmitting(true);

    const googleWebAppUrl = "https://script.google.com/macros/s/AKfycbyfly2CXZyI_mqGiLrOIyErIcMFtRkECU68WryLt2tWkMmjdlDJHmriJP4Gk4RLSC7YWg/exec";

    try {
      const params = new URLSearchParams();
      // Map the new fields to the existing backend schema
      params.append('name', formData.name);
      params.append('studentsCollegeEmailId', '');
      params.append('personalEmailId', formData.personalEmailId);
      params.append('contactNumber', formData.contactNumber);
      params.append('whatsappNumber', formData.contactNumber); 
      params.append('collegeName', formData.candidateType); 
      params.append('branchName', `${formData.specialization} ${formData.currentJobTitle ? '- ' + formData.currentJobTitle : ''}`);
      params.append('yearOfStudying', formData.yearsOfExperience || 'N/A');
      params.append('interestedDomain', formData.interestedDomain);
      params.append('placementCellEmailId', '');
      params.append('crNameNumber', '');
      params.append('whyLooking', formData.whyLooking);
      params.append('preferredLanguage', `${formData.preferredMode} - ${formData.startTimeline}`);

      await fetch(googleWebAppUrl, { 
        method: 'POST', 
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
            <p className="da-subheadline">Join a Bengaluru-based, NSDC-aligned accelerator built for graduates and professionals. Master Python, SQL, and Power BI while building a portfolio that top tech companies hire for.</p>
            
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
                <div className="da-metric-label">Highest CTC</div>
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
                  </div>

                  {currentStep === 1 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.name ? 'has-error' : ''}`}>
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="E.g. John Doe" />
                        {errors.name && <span className="da-error-text">{errors.name}</span>}
                      </div>
                      
                      <div className={`da-input-group ${errors.contactNumber ? 'has-error' : ''}`}>
                        <label>Mobile Number</label>
                        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91" />
                        {errors.contactNumber && <span className="da-error-text">{errors.contactNumber}</span>}
                      </div>

                      <div className={`da-input-group ${errors.personalEmailId ? 'has-error' : ''}`}>
                        <label>Email Address</label>
                        <input type="email" name="personalEmailId" value={formData.personalEmailId} onChange={handleInputChange} placeholder="john@example.com" />
                        {errors.personalEmailId && <span className="da-error-text">{errors.personalEmailId}</span>}
                      </div>
                      
                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-primary" onClick={nextStep}>Continue</button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.candidateType ? 'has-error' : ''}`}>
                        <label>You are currently a:</label>
                        <div className="da-options-grid">
                          {['Final-year student', 'Graduate', 'Working professional', 'Career switcher'].map(opt => (
                            <div 
                              key={opt}
                              className={`da-option-card ${formData.candidateType === opt ? 'selected' : ''}`}
                              onClick={() => handleOptionSelect('candidateType', opt)}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                        {errors.candidateType && <span className="da-error-text">{errors.candidateType}</span>}
                      </div>

                      <div className={`da-input-group ${errors.specialization ? 'has-error' : ''}`}>
                        <label>Current degree or specialization</label>
                        <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="E.g. B.Tech Computer Science" />
                        {errors.specialization && <span className="da-error-text">{errors.specialization}</span>}
                      </div>

                      {formData.candidateType === 'Working professional' && (
                        <>
                          <div className={`da-input-group ${errors.yearsOfExperience ? 'has-error' : ''}`}>
                            <label>Years of experience</label>
                            <select name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange}>
                              <option value="">Select experience...</option>
                              <option value="1-3 years">1-3 years</option>
                              <option value="3-5 years">3-5 years</option>
                              <option value="5+ years">5+ years</option>
                            </select>
                            {errors.yearsOfExperience && <span className="da-error-text">{errors.yearsOfExperience}</span>}
                          </div>

                          <div className={`da-input-group ${errors.currentJobTitle ? 'has-error' : ''}`}>
                            <label>Current job title</label>
                            <input type="text" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleInputChange} placeholder="E.g. Software Engineer" />
                            {errors.currentJobTitle && <span className="da-error-text">{errors.currentJobTitle}</span>}
                          </div>
                        </>
                      )}

                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-secondary" onClick={prevStep}>Back</button>
                        <button type="button" className="da-btn da-btn-primary" onClick={nextStep}>Continue</button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="da-step-content">
                      <div className={`da-input-group ${errors.interestedDomain ? 'has-error' : ''}`}>
                        <label>Interested Path</label>
                        <select name="interestedDomain" value={formData.interestedDomain} onChange={handleInputChange}>
                          <option value="">Select path...</option>
                          <option value="Data Analyst">Data Analyst</option>
                          <option value="BI Analyst">BI Analyst</option>
                          <option value="Business Analyst">Business Analyst</option>
                          <option value="Analytics Career Switch">Analytics Career Switch</option>
                        </select>
                        {errors.interestedDomain && <span className="da-error-text">{errors.interestedDomain}</span>}
                      </div>

                      <div className={`da-input-group ${errors.whyLooking ? 'has-error' : ''}`}>
                        <label>Main Goal</label>
                        <select name="whyLooking" value={formData.whyLooking} onChange={handleInputChange}>
                          <option value="">Select goal...</option>
                          <option value="First job">First job</option>
                          <option value="Career switch">Career switch</option>
                          <option value="Salary growth">Salary growth</option>
                          <option value="Upskill">Upskill</option>
                        </select>
                        {errors.whyLooking && <span className="da-error-text">{errors.whyLooking}</span>}
                      </div>
                      
                      <div style={{display: 'flex', gap: '16px'}}>
                        <div className={`da-input-group ${errors.preferredMode ? 'has-error' : ''}`} style={{flex: 1}}>
                          <label>Learning Schedule</label>
                          <select name="preferredMode" value={formData.preferredMode} onChange={handleInputChange}>
                            <option value="">Select...</option>
                            <option value="Weekday">Weekday</option>
                            <option value="Weekend">Weekend</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                          {errors.preferredMode && <span className="da-error-text">{errors.preferredMode}</span>}
                        </div>
                        
                        <div className={`da-input-group ${errors.startTimeline ? 'has-error' : ''}`} style={{flex: 1}}>
                          <label>Start Timeline</label>
                          <select name="startTimeline" value={formData.startTimeline} onChange={handleInputChange}>
                            <option value="">Select...</option>
                            <option value="Immediately">Immediately</option>
                            <option value="This month">This month</option>
                            <option value="In 1-3 months">In 1-3 months</option>
                          </select>
                          {errors.startTimeline && <span className="da-error-text">{errors.startTimeline}</span>}
                        </div>
                      </div>

                      <div className="da-checkbox-group">
                        <input type="checkbox" id="privacyConsent" name="isConfirmed" checked={formData.isConfirmed} onChange={handleInputChange} />
                        <label htmlFor="privacyConsent">
                          Your details are used only for program guidance and admissions support. No spam. No unnecessary calls.
                        </label>
                      </div>
                      {errors.isConfirmed && <span className="da-error-text" style={{marginTop: '4px'}}>{errors.isConfirmed}</span>}

                      <div className="da-form-actions">
                        <button type="button" className="da-btn da-btn-secondary" onClick={prevStep}>Back</button>
                        <button type="submit" className="da-btn da-btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Processing...' : 'Book Free Career Consultation'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="da-trust-blocks">
                    <div className="da-trust-item">
                      <span className="da-trust-icon"><CheckCircleIcon /></span> NSDC-aligned program with industry-focused curriculum.
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

      <StatsBar />
      <WhyKrutanic />
      <WhoThisIsFor />
      <CareerRoles />
      <CurriculumRoadmap />
      <RealProjects />
      <ToolsCovered />
      <CareerSupport />
      <Certification />
      <HiringPartners />
      <FAQBlock />
      <FinalCTA />
    </div>
  );
};

export default DataAnalystFormPage;
