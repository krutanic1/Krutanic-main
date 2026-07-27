import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import './MedProFormPage.css';
import {
  AlertBanner,
  PartnersSection,
  ComparisonSection,
  RoadmapSection,
  ProgramPerksSection,
  GuaranteeSection,
  ReviewsSection,
  FAQSection,
  PlacementModal
} from './LandingComponents';
import SubhraImg from './assets/mentors/Subhra.jpg';
import RudraImg from './assets/mentors/rudra.jpg';
import RohanImg from './assets/alumini/rohan.jpg';
import RajaImg from './assets/alumini/raja.jpg';
import PrabhleenImg from './assets/alumini/prabhleen.jpg';
import medproHeroImg from './assets/medpro/medpro_hero_visual.png';
import medproProfImg from './assets/medpro/medpro_professionals.png';

/* --- Custom Select Component --- */
const CustomSelect = ({ label, name, value, options, onChange, placeholder, required, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 45, 250);
      const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setDropdownStyle({
        position: 'fixed',
        top: openUpward ? rect.top - dropdownHeight - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 999999,
      });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = Math.min(options.length * 45, 250);
        const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
        setDropdownStyle(prev => ({
          ...prev,
          top: openUpward ? rect.top - dropdownHeight - 6 : rect.bottom + 6,
          left: rect.left,
          width: rect.width,
        }));
      }
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const dropdown = isOpen ? ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      className="medpro-custom-select-dropdown"
      style={dropdownStyle}
    >
      {options.map((opt) => (
        <div
          key={opt}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange({ target: { name, value: opt } });
            setIsOpen(false);
          }}
          className={`medpro-select-option ${value === opt ? 'selected' : ''}`}
        >
          {opt}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className={`medpro-input-group ${error ? 'has-error' : ''}`}>
      <label>{label} {required && <span className="medpro-required">*</span>}</label>
      <div
        className={`medpro-custom-select ${isOpen ? 'open' : ''} ${error ? 'error-border' : ''}`}
        ref={triggerRef}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
      >
        <div className="medpro-select-trigger">
          <span className={value ? 'medpro-value-selected' : 'medpro-placeholder'}>{value || placeholder}</span>
          <span className={`medpro-select-arrow ${isOpen ? 'up' : ''}`}></span>
        </div>
      </div>
      {error && <span className="medpro-error-text">{error}</span>}
      {dropdown}
    </div>
  );
};

/* --- Custom MedPro Hero --- */
const MedProHeroSection = ({ onShowModal }) => {
  const scrollToForm = () => document.getElementById('medpro-enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
  
  return (
    <section className="mp-hero-section">
      <div className="mp-hero-bg-overlay" style={{ backgroundImage: `url(${medproHeroImg})` }}></div>
      <div className="mp-hero-container">
        
        <div className="mp-hero-content">
          <div className="mp-badge">
            <span className="mp-pulse"></span> Next Cohort: Super 30 Professionals
          </div>
          <h1 className="mp-title">
            Master Your Domain in<br/>
            <span className="mp-title-accent">Medical & Law.</span>
          </h1>
          <p className="mp-description">
            The elite Placement Acceleration Program for Forensics, Corporate Law, and Clinical Psychology. We bridge the gap between theoretical knowledge and practical application through 1:1 mentorship and 100% placement assistance.
          </p>
          
          <div className="mp-cta-group">
            <button className="mp-btn-primary" onClick={scrollToForm}>
              Apply for MedPro Cohort <span className="arrow">→</span>
            </button>
            <div className="mp-trust-block">
              <div className="mp-avatars">
                <img className="mp-avatar" src={SubhraImg} alt="Mentor" />
                <img className="mp-avatar" src={RudraImg} alt="Mentor" />
                <img className="mp-avatar" src={RohanImg} alt="Alumni" />
                <div className="mp-avatar-more">+2k</div>
              </div>
              <div className="mp-trust-text">
                <span>Trusted by MedPro Alumni</span>
                <div className="mp-stars">★★★★★ 4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mp-hero-visual">
          <div className="mp-image-wrapper">
            <img src={medproProfImg} alt="MedPro Professionals" className="mp-main-image" />
            
            {/* Floating Elements */}
            <div className="mp-floating-card top-left">
              <div className="icon">⚕️</div>
              <div className="info">
                <strong>Premium Packs</strong>
                <span>Forensics & Law</span>
              </div>
            </div>
            
            <div className="mp-floating-card bottom-right" onClick={onShowModal} style={{cursor: 'pointer'}}>
              <div className="icon success">✓</div>
              <div className="info">
                <strong>100% Placement</strong>
                <span>Contractual Guarantee</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


/* --- Main MedPro Page Component --- */
const MedProFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    studentsCollegeEmailId: '',
    personalEmailId: '',
    contactNumber: '',
    whatsappNumber: '',
    collegeName: '',
    branchName: '',
    yearOfStudying: '',
    interestedDomain: '',
    placementCellEmailId: '',
    crNameNumber: '',
    whyLooking: '',
    preferredLanguage: '',
    isConfirmed: false
  });

  const handleInputChange = (e) => {
    let { name, value, type, checked } = e.target;
    
    if (name === 'contactNumber' || name === 'whatsappNumber') {
      value = value.replace(/\s/g, '');
    }
    
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let stepErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) stepErrors.name = 'Name is required';
    if (!formData.personalEmailId.trim() || !emailRegex.test(formData.personalEmailId)) stepErrors.personalEmailId = 'Valid personal email is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.replace(/\D/g, '').length < 7) stepErrors.contactNumber = 'Valid contact number is required';
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.replace(/\D/g, '').length < 7) stepErrors.whatsappNumber = 'Valid WhatsApp number is required';
    
    if (!formData.studentsCollegeEmailId.trim() || !emailRegex.test(formData.studentsCollegeEmailId)) stepErrors.studentsCollegeEmailId = 'Valid college email is required';
    if (!formData.collegeName.trim()) stepErrors.collegeName = 'College name is required';
    if (!formData.branchName.trim()) stepErrors.branchName = 'Branch name is required';
    if (!formData.yearOfStudying) stepErrors.yearOfStudying = 'Year of studying is required';
    
    if (!formData.interestedDomain) stepErrors.interestedDomain = 'Please select a domain';
    if (!formData.whyLooking) stepErrors.whyLooking = 'Please select a reason';
    if (!formData.preferredLanguage.trim()) stepErrors.preferredLanguage = 'Preferred language is required';
    if (!formData.isConfirmed) stepErrors.isConfirmed = 'You must confirm the details';

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!validateForm()) {
      toast.error('Please provide all required information to proceed.');
      const firstErrorElement = document.querySelector('.has-error, .has-error-checkbox');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const userConfirmed = window.confirm("Reminder: A nominal fee applies for the Krutanic MedPro Packs. Do you want to proceed with your application?");
    if (!userConfirmed) {
      return;
    }

    setIsSubmitting(true);

    const googleWebAppUrl = "https://script.google.com/macros/s/AKfycbzOJAPGeCFFolZIPRXfIo614Gj1TTKyUlxa2w0xgH_WQzjzdGFtwyR3kIRHY9jR8bzPKw/exec";

    try {
      // Using mode 'no-cors' to prevent Google Apps Script CORS blocking in the browser
      // We send it as text/plain so we can pass a JSON string without triggering a preflight request
      await fetch(googleWebAppUrl, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(formData) 
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
    <>
      <div className="adv-landing">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Full Landing Page Elements for MedPro */}
        <MedProHeroSection onShowModal={() => setShowModal(true)} />
        <AlertBanner />
        <ProgramPerksSection />
        <PartnersSection isMedPro={true} />
        <RoadmapSection />
        <ReviewsSection isMedPro={true} />

        {showModal && <PlacementModal onClose={() => setShowModal(false)} />}
      </div>

      {/* The MedPro Form itself */}
      <div className="medpro-page-wrapper" id="medpro-enrollment-form">
        {submitted ? (
          <div className="medpro-success-box premium-glass">
            <div className="medpro-success-icon bounce-in">🎉</div>
            <h3 className="medpro-gradient-text" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Congratulations! Your registration has been submitted successfully.</h3>
            <p>Our <strong>Training & Placement Team</strong> will contact you within the <strong>next 24 hours</strong> to guide you through the next steps.</p>
            <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', borderLeft: '4px solid #ffc107', padding: '15px', borderRadius: '8px', margin: '20px 0', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>⚠️ Important:</strong> This is a <strong>paid career program</strong> with a basic program fee. Complete details will be shared during your counselling session.</p>
            </div>
            <p>Thank you for choosing <strong>Krutanic</strong>. We look forward to helping you achieve your career goals!</p>
            <button className="medpro-btn-outline mt-6" onClick={() => setSubmitted(false)}>Submit Another</button>
          </div>
        ) : (
          <div className="medpro-container">
            <div className="medpro-form-wrapper premium-glass">
              
              <div className="medpro-form-sidebar">
                <div className="sidebar-sticky-content">
                  <div className="sidebar-icon">⚕️</div>
                  <h3 className="sidebar-title">MedPro Registration</h3>
                  <p className="sidebar-desc">Join the elite network of professionals in Forensics, Law, and Healthcare.</p>
                  
                  <div className="medpro-perks-list">
                    <div className="medpro-perk"><span className="check">✦</span> Clinical Case Studies</div>
                    <div className="medpro-perk"><span className="check">✦</span> Expert Legal & Medical Mentorship</div>
                    <div className="medpro-perk"><span className="check">✦</span> Guaranteed Internship Opportunities</div>
                    <div className="medpro-perk"><span className="check">✦</span> Premium Certification</div>
                  </div>
                </div>
              </div>
              
              <div className="medpro-form-content">
                <form onSubmit={handleSubmit} className="medpro-form">
                    
                    {/* SECTION 1 */}
                    <div className="medpro-section-block">
                      <div className="medpro-section-header">
                        <h4>Personal Details</h4>
                        <div className="medpro-divider"></div>
                      </div>
          
                      <div className={`medpro-input-group ${errors.name ? 'has-error' : ''}`}>
                        <label>Full Name <span className="medpro-required">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Dr. John Doe / John Doe" />
                        {errors.name && <span className="medpro-error-text">{errors.name}</span>}
                      </div>
                      
                      <div className="medpro-input-row">
                        <div className={`medpro-input-group ${errors.personalEmailId ? 'has-error' : ''}`}>
                          <label>Personal Email <span className="medpro-required">*</span></label>
                          <input type="email" name="personalEmailId" value={formData.personalEmailId} onChange={handleInputChange} placeholder="john@example.com" />
                          {errors.personalEmailId && <span className="medpro-error-text">{errors.personalEmailId}</span>}
                        </div>
                      </div>
                      
                      <div className="medpro-input-row">
                        <div className={`medpro-input-group ${errors.contactNumber ? 'has-error' : ''}`}>
                          <label>Contact Number <span className="medpro-required">*</span></label>
                          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91" />
                          {errors.contactNumber && <span className="medpro-error-text">{errors.contactNumber}</span>}
                        </div>
                        <div className={`medpro-input-group ${errors.whatsappNumber ? 'has-error' : ''}`}>
                          <label>WhatsApp Number <span className="medpro-required">*</span></label>
                          <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="+91" />
                          {errors.whatsappNumber && <span className="medpro-error-text">{errors.whatsappNumber}</span>}
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2 */}
                    <div className="medpro-section-block">
                      <div className="medpro-section-header">
                        <h4>Academic & Professional Details</h4>
                        <div className="medpro-divider"></div>
                      </div>

                      <div className="medpro-input-row">
                        <div className={`medpro-input-group ${errors.collegeName ? 'has-error' : ''}`}>
                          <label>Institution / College Name <span className="medpro-required">*</span></label>
                          <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="Your University/Hospital" />
                          {errors.collegeName && <span className="medpro-error-text">{errors.collegeName}</span>}
                        </div>
                        <div className={`medpro-input-group ${errors.branchName ? 'has-error' : ''}`}>
                          <label>Branch / Specialization <span className="medpro-required">*</span></label>
                          <input type="text" name="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="e.g. Physiotherapy" />
                          {errors.branchName && <span className="medpro-error-text">{errors.branchName}</span>}
                        </div>
                      </div>
                      
                      <div className="medpro-input-row">
                        <div className={`medpro-input-group ${errors.studentsCollegeEmailId ? 'has-error' : ''}`}>
                          <label>Institution Email ID <span className="medpro-required">*</span></label>
                          <input type="email" name="studentsCollegeEmailId" value={formData.studentsCollegeEmailId} onChange={handleInputChange} placeholder="student@college.edu" />
                          {errors.studentsCollegeEmailId && <span className="medpro-error-text">{errors.studentsCollegeEmailId}</span>}
                        </div>
                      </div>
                      
                      <CustomSelect 
                        label="Year Of Studying / Experience" 
                        required={true}
                        name="yearOfStudying" 
                        value={formData.yearOfStudying} 
                        onChange={handleInputChange} 
                        placeholder="Select current status"
                        error={errors.yearOfStudying}
                        options={["1st Year", "2nd Year", "3rd Year", "4th Year / Intern", "Graduated / Professional"]}
                      />

                      <div className="medpro-input-row mt-4">
                        <div className={`medpro-input-group ${errors.placementCellEmailId ? 'has-error' : ''}`}>
                          <label>Placement Cell Email (Optional)</label>
                          <input type="email" name="placementCellEmailId" value={formData.placementCellEmailId} onChange={handleInputChange} placeholder="tpo@college.edu" />
                          {errors.placementCellEmailId && <span className="medpro-error-text">{errors.placementCellEmailId}</span>}
                        </div>
                        <div className="medpro-input-group">
                          <label>CR's Name & Number (Optional)</label>
                          <input type="text" name="crNameNumber" value={formData.crNameNumber} onChange={handleInputChange} placeholder="Name - Phone" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3 */}
                    <div className="medpro-section-block">
                      <div className="medpro-section-header">
                        <h4>MedPro Pack Selection</h4>
                        <div className="medpro-divider"></div>
                      </div>
                      
                      <CustomSelect 
                        label="Interested Domain" 
                        required={true}
                        name="interestedDomain" 
                        value={formData.interestedDomain} 
                        onChange={handleInputChange} 
                        placeholder="Select MedPro domain"
                        error={errors.interestedDomain}
                        options={[
                          "Forensic Psychology", 
                          "Clinical Psychology",
                          "Corporate Law", 
                          "Psychology"
                        ]}
                      />

                      <CustomSelect 
                        label="Primary Objective" 
                        required={true}
                        name="whyLooking" 
                        value={formData.whyLooking} 
                        onChange={handleInputChange} 
                        placeholder="Why are you joining?"
                        error={errors.whyLooking}
                        options={[
                          "Practical Clinical Exposure",
                          "Legal & Corporate Expertise",
                          "Skill Development & Industry Certification",
                          "Career Transition into MedPro domains"
                        ]}
                      />

                      <div className={`medpro-input-group ${errors.preferredLanguage ? 'has-error' : ''}`}>
                        <label>Preferred Language <span className="medpro-required">*</span></label>
                        <input type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} placeholder="e.g. English, Hindi" />
                        {errors.preferredLanguage && <span className="medpro-error-text">{errors.preferredLanguage}</span>}
                      </div>

                      <div 
                        className={`medpro-checkbox-group ${errors.isConfirmed ? 'has-error-checkbox' : ''}`}
                        style={{
                          backgroundColor: 'rgba(139, 92, 246, 0.08)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          padding: '16px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
                          marginTop: '15px'
                        }}
                      >
                        <label className="medpro-checkbox-container">
                          <input 
                            type="checkbox" 
                            name="isConfirmed" 
                            checked={formData.isConfirmed} 
                            onChange={handleInputChange} 
                          />
                          <span className="medpro-checkmark"></span>
                          <span className="medpro-checkbox-text">
                            I confirm that all details provided are accurate and acknowledge that a <strong style={{color: '#fff'}}>nominal fee applies</strong> for the Krutanic MedPro Packs.
                          </span>
                        </label>
                        {errors.isConfirmed && <span className="medpro-error-text mt-1 d-block">{errors.isConfirmed}</span>}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="medpro-form-actions">
                      <button type="submit" className="medpro-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <><span className="medpro-spinner"></span> Processing...</>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                    </div>

                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <ComparisonSection />
      <GuaranteeSection onShowModal={() => setShowModal(true)} />
      <FAQSection />
    </>
  );
};

export default MedProFormPage;
