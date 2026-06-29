import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import './EnrollmentForm.css';

const CustomSelect = ({ label, name, value, options, onChange, placeholder, required, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 50, 250);
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
        const dropdownHeight = Math.min(options.length * 50, 250);
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
      className="adv-custom-select-dropdown"
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
          className={`adv-select-option ${value === opt ? 'selected' : ''}`}
        >
          {opt}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className={`adv-input-group ${error ? 'has-error' : ''}`}>
      <label>{label} {required && <span className="adv-required">*</span>}</label>
      <div
        className={`adv-custom-select ${isOpen ? 'open' : ''} ${error ? 'error-border' : ''}`}
        ref={triggerRef}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
      >
        <div className="adv-select-trigger">
          <span className={value ? 'adv-value-selected' : 'adv-placeholder'}>{value || placeholder}</span>
          <span className={`adv-select-arrow ${isOpen ? 'up' : ''}`}></span>
        </div>
      </div>
      {error && <span className="adv-error-text">{error}</span>}
      {dropdown}
    </div>
  );
};

const EnrollmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
//jsgfkuhsdli
  const validateForm = () => {
    let stepErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //hfgdgf uagf f
    // Personal Details
    if (!formData.name.trim()) stepErrors.name = 'Name is required';
    if (!formData.personalEmailId.trim() || !emailRegex.test(formData.personalEmailId)) stepErrors.personalEmailId = 'Valid personal email is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.replace(/\D/g, '').length < 7) stepErrors.contactNumber = 'Valid contact number is required';
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.replace(/\D/g, '').length < 7) stepErrors.whatsappNumber = 'Valid WhatsApp number is required';
    
    // Academic Details
    if (!formData.studentsCollegeEmailId.trim() || !emailRegex.test(formData.studentsCollegeEmailId)) stepErrors.studentsCollegeEmailId = 'Valid college email is required';
    if (!formData.collegeName.trim()) stepErrors.collegeName = 'College name is required';
    if (!formData.branchName.trim()) stepErrors.branchName = 'Branch name is required';
    if (!formData.yearOfStudying) stepErrors.yearOfStudying = 'Year of studying is required';
    if (formData.placementCellEmailId && !emailRegex.test(formData.placementCellEmailId)) stepErrors.placementCellEmailId = 'Must be a valid email';
    
    // Goals & Preferences
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
      // Scroll to the first error roughly
      const firstErrorElement = document.querySelector('.has-error, .has-error-checkbox');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // ==========================================
    // GOOGLE APPS SCRIPT WEB APP URL (Replace this with your actual URL)
    // ==========================================
    const googleWebAppUrl = "https://script.google.com/macros/s/AKfycbyfly2CXZyI_mqGiLrOIyErIcMFtRkECU68WryLt2tWkMmjdlDJHmriJP4Gk4RLSC7YWg/exec";

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('studentsCollegeEmailId', formData.studentsCollegeEmailId);
      params.append('personalEmailId', formData.personalEmailId);
      params.append('contactNumber', formData.contactNumber);
      params.append('whatsappNumber', formData.whatsappNumber);
      params.append('collegeName', formData.collegeName);
      params.append('branchName', formData.branchName);
      params.append('yearOfStudying', formData.yearOfStudying);
      params.append('interestedDomain', formData.interestedDomain);
      params.append('placementCellEmailId', formData.placementCellEmailId || '');
      params.append('crNameNumber', formData.crNameNumber || '');
      params.append('whyLooking', formData.whyLooking);
      params.append('preferredLanguage', formData.preferredLanguage);

      await fetch(googleWebAppUrl, { 
        method: 'POST', 
        // mode: 'no-cors', // Not needed for Google Apps Script if setup correctly
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

  if (submitted) {
    return (
      <section className="adv-form-section" id="enrollment-form">
        <div className="adv-success-box premium-card">
          <div className="adv-success-icon bounce-in">✓</div>
          <h3 className="gradient-text">Application Received</h3>
          <p>Your profile is under review by our admissions board. We will contact you within 24 hours.</p>
          <button className="adv-btn-outline mt-6" onClick={() => window.location.reload()}>Submit Another</button>
        </div>
      </section>
    );
  }

  return (
    <section className="adv-form-section" id="enrollment-form">
      <div className="adv-container">
        <div className="adv-form-wrapper modern-glass">
          
          {/* Sidebar */}
          <div className="adv-form-sidebar dynamic-bg">
            <div className="sidebar-content" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="sidebar-title">Adobe Certified Training and Internship Program</h3>
              <p className="sidebar-desc">Please fill out the form carefully to register for the upcoming program.</p>
              <div className="adv-form-sidebar-perks">
                <div className="adv-perk glass-perk"><span className="check-icon">✓</span> 100% Placement Assistance</div>
                <div className="adv-perk glass-perk"><span className="check-icon">✓</span> 1:1 Industry Mentorship</div>
                <div className="adv-perk glass-perk"><span className="check-icon">✓</span> Corporate Internship</div>
                <div className="adv-perk glass-perk"><span className="check-icon">✓</span> Unlimited AI Mock Interviews</div>
              </div>
            </div>
          </div>
          
          {/* Main Form Area */}
          <div className="adv-form-content">
            <form onSubmit={handleSubmit} className="premium-form">
                
                {/* SECTION 1: Personal Details */}
                <div className="form-section-container">
                  <div className="section-header">
                    <h4>Personal Details</h4>
                    <div className="section-divider"></div>
                  </div>
      
                  <div className={`adv-input-group ${errors.name ? 'has-error' : ''}`}>
                    <label>Full Name <span className="adv-required">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
                    {errors.name && <span className="adv-error-text">{errors.name}</span>}
                  </div>
                  <div className="adv-input-row">
                    <div className={`adv-input-group ${errors.personalEmailId ? 'has-error' : ''}`}>
                      <label>Personal Email <span className="adv-required">*</span></label>
                      <input type="email" name="personalEmailId" value={formData.personalEmailId} onChange={handleInputChange} placeholder="john@example.com" />
                      {errors.personalEmailId && <span className="adv-error-text">{errors.personalEmailId}</span>}
                    </div>
                  </div>
                  <div className="adv-input-row">
                    <div className={`adv-input-group ${errors.contactNumber ? 'has-error' : ''}`}>
                      <label>Contact Number <span className="adv-required">*</span></label>
                      <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91" />
                      {errors.contactNumber && <span className="adv-error-text">{errors.contactNumber}</span>}
                    </div>
                    <div className={`adv-input-group ${errors.whatsappNumber ? 'has-error' : ''}`}>
                      <label>WhatsApp Number <span className="adv-required">*</span></label>
                      <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} placeholder="+91" />
                      {errors.whatsappNumber && <span className="adv-error-text">{errors.whatsappNumber}</span>}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Academic Details */}
                <div className="form-section-container mt-6">
                  <div className="section-header">
                    <h4>Academic Details</h4>
                    <div className="section-divider"></div>
                  </div>

                  <div className="adv-input-row">
                    <div className={`adv-input-group ${errors.collegeName ? 'has-error' : ''}`}>
                      <label>College Name <span className="adv-required">*</span></label>
                      <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="Your University/College" />
                      {errors.collegeName && <span className="adv-error-text">{errors.collegeName}</span>}
                    </div>
                    <div className={`adv-input-group ${errors.branchName ? 'has-error' : ''}`}>
                      <label>Branch Name <span className="adv-required">*</span></label>
                      <input type="text" name="branchName" value={formData.branchName} onChange={handleInputChange} placeholder="e.g. Computer Science" />
                      {errors.branchName && <span className="adv-error-text">{errors.branchName}</span>}
                    </div>
                  </div>
                  <div className="adv-input-row">
                    <div className={`adv-input-group ${errors.studentsCollegeEmailId ? 'has-error' : ''}`}>
                      <label>College Email ID <span className="adv-required">*</span></label>
                      <input type="email" name="studentsCollegeEmailId" value={formData.studentsCollegeEmailId} onChange={handleInputChange} placeholder="student@college.edu" />
                      {errors.studentsCollegeEmailId && <span className="adv-error-text">{errors.studentsCollegeEmailId}</span>}
                    </div>
                  </div>
                  
                  <CustomSelect 
                    label="Year Of Studying" 
                    required={true}
                    name="yearOfStudying" 
                    value={formData.yearOfStudying} 
                    onChange={handleInputChange} 
                    placeholder="Select current year"
                    error={errors.yearOfStudying}
                    options={["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"]}
                  />

                  <div className="adv-input-row mt-4">
                    <div className={`adv-input-group ${errors.placementCellEmailId ? 'has-error' : ''}`}>
                      <label>Placement Cell Email (Optional)</label>
                      <input type="email" name="placementCellEmailId" value={formData.placementCellEmailId} onChange={handleInputChange} placeholder="tpo@college.edu" />
                      {errors.placementCellEmailId && <span className="adv-error-text">{errors.placementCellEmailId}</span>}
                    </div>
                    <div className="adv-input-group">
                      <label>CR's Name & Number (Optional)</label>
                      <input type="text" name="crNameNumber" value={formData.crNameNumber} onChange={handleInputChange} placeholder="Name - Phone" />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Goals */}
                <div className="form-section-container mt-6">
                  <div className="section-header">
                    <h4>Program Goals</h4>
                    <div className="section-divider"></div>
                  </div>
                  
                  <CustomSelect 
                    label="Interested Domain" 
                    required={true}
                    name="interestedDomain" 
                    value={formData.interestedDomain} 
                    onChange={handleInputChange} 
                    placeholder="Select target domain"
                    error={errors.interestedDomain}
                    options={[
                      "Android App Development", "Full Stack Development", "Data Science", 
                      "Data Analytics", "Machine Learning", "Artificial Intelligence", 
                      "Cyber Security", "Internet of Things/ Robotics", "Cloud Computing", 
                      "DevOps", "Graphic designer", "UI/UX Design", "AutoCad", 
                      "Embedded Systems", "Digital Marketing", "Finance", "Human Resource", 
                      "VLSI Design", "Business Analytics", "Forensic Psychology", 
                      "Clinical Psychology", "Corporate Law", "Psychology"
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
                      "Skill Development & Industry Exposure",
                      "Career Growth Opportunity",
                      "Learning from Industry Leaders",
                      "To Gain Exposure to Emerging Technologies"
                    ]}
                  />

                  <div className={`adv-input-group ${errors.preferredLanguage ? 'has-error' : ''}`}>
                    <label>Preferred Language <span className="adv-required">*</span></label>
                    <input type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} placeholder="e.g. English, Hindi" />
                    {errors.preferredLanguage && <span className="adv-error-text">{errors.preferredLanguage}</span>}
                  </div>

                  <div className={`adv-checkbox-group ${errors.isConfirmed ? 'has-error-checkbox' : ''}`}>
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        name="isConfirmed" 
                        checked={formData.isConfirmed} 
                        onChange={handleInputChange} 
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">
                        I confirm that all details provided are accurate and acknowledge that a nominal fee applies for the Adobe Certified Program 2026.
                      </span>
                    </label>
                    {errors.isConfirmed && <span className="adv-error-text mt-1 d-block">{errors.isConfirmed}</span>}
                  </div>
                </div>

                {/* Form Navigation Controls */}
                <div className="adv-form-actions-v3" style={{ justifyContent: 'center' }}>
                  <button type="submit" className="adv-btn-primary submit-btn" disabled={isSubmitting} style={{ width: '100%', maxWidth: '400px', justifyContent: 'center', marginTop: '20px' }}>
                    {isSubmitting ? (
                      <>
                        <span className="loading-spinner"></span> Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnrollmentForm;
