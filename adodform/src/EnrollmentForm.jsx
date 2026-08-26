import React, { useState } from 'react';
import './EnrollmentForm.css';

import bg1 from '../course-bgs/da_bg.png';
import bg2 from '../course-bgs/dm_bg.png';
import bg3 from '../course-bgs/ds_bg.png';
import bg4 from '../course-bgs/mern_bg.png';
import bg5 from '../course-bgs/pe_bg.png';
import bg6 from '../course-bgs/pm_bg.png';

const CustomDropdown = ({ id, value, onChange, options, placeholder, groups }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { id, value: val } });
    setIsOpen(false);
  };

  // Find label for current value
  let displayValue = value;
  if (value) {
    if (groups) {
      for (const group of groups) {
        const opt = group.options.find(o => o.value === value);
        if (opt) displayValue = opt.label;
      }
    } else if (options) {
      const opt = options.find(o => o.value === value);
      if (opt) displayValue = opt.label;
    }
  }

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div
        className={`form-input custom-dropdown-toggle ${isOpen ? 'open' : ''} ${!value ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue || placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {groups ? groups.map((group, i) => (
            <div key={i} className="dropdown-group">
              <div className="dropdown-group-label">{group.label}</div>
              {group.options.map(opt => (
                <div
                  key={opt.value}
                  className={`dropdown-item ${value === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )) : options.map(opt => (
            <div
              key={opt.value}
              className={`dropdown-item ${value === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EnrollmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    whatsappNumber: '',
    studentsCollegeEmailId: '',
    personalEmailId: '',
    state: '',
    otherCountry: '',
    collegeName: '',
    branchName: '',
    yearOfStudying: '',
    interestedDomain: '',
    preferredLanguage: [],
    placementCellEmailId: '',
    crNameNumber: '',
    whyLooking: '',
    feeAck: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [domainFilter, setDomainFilter] = useState('all');
  const [progress, setProgress] = useState(25);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    // special handling for domain
    if (e.target.name === 'interestedDomain') {
      setFormData({ ...formData, interestedDomain: value });
    } else if (type === 'checkbox') {
      if (e.target.name === 'preferredLanguage') {
        const newLangs = checked
          ? [...formData.preferredLanguage, value]
          : formData.preferredLanguage.filter(l => l !== value);
        setFormData({ ...formData, preferredLanguage: newLangs });
      } else {
        setFormData({ ...formData, [id]: checked });
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const domains = [
    { cat: 'tech', label: 'Android App Development' },
    { cat: 'tech', label: 'Full Stack Web Development' },
    { cat: 'tech', label: 'Data Science' },
    { cat: 'tech', label: 'Data Analytics' },
    { cat: 'tech', label: 'Machine Learning' },
    { cat: 'tech', label: 'Artificial Intelligence' },
    { cat: 'core', label: 'Cyber Security' },
    { cat: 'core', label: 'IoT / Robotics' },
    { cat: 'tech', label: 'Cloud Computing' },
    { cat: 'design', label: 'Graphic Design' },
    { cat: 'core', label: 'AutoCAD' },
    { cat: 'design', label: 'UI/UX Design' },
    { cat: 'core', label: 'Embedded Systems' },
    { cat: 'mgmt', label: 'Digital Marketing' },
    { cat: 'mgmt', label: 'Finance' },
    { cat: 'mgmt', label: 'Stock Market' },
    { cat: 'mgmt', label: 'Human Resource' },
    { cat: 'mgmt', label: 'Business Analytics' },
    { cat: 'tech', label: 'DevOps' },
    { cat: 'core', label: 'VLSI' },
    { cat: 'mgmt', label: 'Forensic Psychology' },
    { cat: 'mgmt', label: 'Clinical Psychology' },
    { cat: 'mgmt', label: 'Corporate Law' },
  ];

  const stateGroups = [
    {
      label: 'India',
      options: [
        { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
        { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
        { label: 'Assam', value: 'Assam' },
        { label: 'Bihar', value: 'Bihar' },
        { label: 'Chhattisgarh', value: 'Chhattisgarh' },
        { label: 'Goa', value: 'Goa' },
        { label: 'Gujarat', value: 'Gujarat' },
        { label: 'Haryana', value: 'Haryana' },
        { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
        { label: 'Jharkhand', value: 'Jharkhand' },
        { label: 'Karnataka', value: 'Karnataka' },
        { label: 'Kerala', value: 'Kerala' },
        { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Manipur', value: 'Manipur' },
        { label: 'Meghalaya', value: 'Meghalaya' },
        { label: 'Mizoram', value: 'Mizoram' },
        { label: 'Nagaland', value: 'Nagaland' },
        { label: 'Odisha', value: 'Odisha' },
        { label: 'Punjab', value: 'Punjab' },
        { label: 'Rajasthan', value: 'Rajasthan' },
        { label: 'Sikkim', value: 'Sikkim' },
        { label: 'Tamil Nadu', value: 'Tamil Nadu' },
        { label: 'Telangana', value: 'Telangana' },
        { label: 'Tripura', value: 'Tripura' },
        { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
        { label: 'Uttarakhand', value: 'Uttarakhand' },
        { label: 'West Bengal', value: 'West Bengal' }
      ]
    },
    {
      label: 'International',
      options: [
        { label: 'Other Country', value: 'Other' }
      ]
    }
  ];

  const yearOptions = [
    { label: '1st Year', value: '1st Year' },
    { label: '2nd Year', value: '2nd Year' },
    { label: '3rd Year', value: '3rd Year' },
    { label: '4th Year', value: '4th Year' },
    { label: 'Final Semester', value: 'Final Semester' },
    { label: 'Graduated / Alumni', value: 'Graduated / Alumni' }
  ];

  const langs = ['English', 'Hindi', 'Malayalam', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Odia', 'Punjabi'];

  const reasonOptions = [
    { label: 'Career Growth Opportunity', value: 'Career Growth Opportunity' },
    { label: 'Skill Development & Industry Exposure', value: 'Skill Development & Industry Exposure' },
    { label: 'Learning from Industry Leaders', value: 'Learning from Industry Leaders' },
    { label: 'To Gain Exposure to Emerging Technologies', value: 'To Gain Exposure to Emerging Technologies' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // basic validation
    if (!formData.name || !formData.personalEmailId || !formData.contactNumber || !formData.whatsappNumber || !formData.collegeName || !formData.branchName || !formData.yearOfStudying || !formData.interestedDomain || formData.preferredLanguage.length === 0 || !formData.studentsCollegeEmailId || !formData.whyLooking || !formData.feeAck) {
      setErrorMsg('Please complete all required fields and accept the declaration.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formBody = new FormData();
      for (const key in formData) {
        if (key === 'preferredLanguage') {
          formBody.append(key, formData[key].join(', '));
        } else {
          formBody.append(key, formData[key]);
        }
      }

      await fetch('https://script.google.com/macros/s/AKfycbyfly2CXZyI_mqGiLrOIyErIcMFtRkECU68WryLt2tWkMmjdlDJHmriJP4Gk4RLSC7YWg/exec', {
        method: 'POST',
        mode: 'no-cors', // Bypasses the strict Google Apps Script CORS redirect blocking
        body: formBody
      });
      
      // With no-cors, the response is opaque and we can't read the JSON result.
      // If the fetch resolves without throwing a network error, we proceed.
      setSubmitted(true);
      setProgress(100);
    } catch (err) {
      setErrorMsg('Network error occurred. Please check your connection.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adobe-clone-body">
      <div className="ambient-grid"></div>
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <canvas id="confettiCanvas"></canvas>

      {/* STICKY ENTERPRISE NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#apply" className="brand-logo">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </div>
            <span className="brand-text">SETIP 2026</span>
          </a>
          <a href="#apply" className="nav-cta">
            <span>Apply Now</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
          </a>
        </div>
      </nav>

      <div className="container">
        {/* HEADER & HERO SECTION */}
        <header className="header">
          <div className="status-badge">
            <span className="pulse-indicator"></span>
            <span className="badge-caption">2026 Cohort • Industry Co-Certified</span>
          </div>

          <h1 className="hero-title">
            Skill Enhancement Training &amp;<br />
            <span className="gradient-text">Internship Program (SETIP)</span>
          </h1>

          <p className="hero-description">
            A 3-month structured program bridging academia with live enterprise workflows. Gain hands-on mastery in
            high-demand technical and management domains, learn directly from MNC mentors, and earn placement
            co-certification.
          </p>

          {/* METRIC CARDS */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-val">3</div>
              <div className="metric-lbl">Months</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">50+</div>
              <div className="metric-lbl">MNC Partners</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">3</div>
              <div className="metric-lbl">Certificates</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">20+</div>
              <div className="metric-lbl">Domains</div>
            </div>
          </div>

          {/* URGENCY ALERT */}
          <div className="urgency-alert">
            <div className="alert-dot"></div>
            <div className="alert-text">
              🔥 <strong>Applications Open for 2026 Cohort:</strong> Limited seats available. Evaluated on a rolling basis.
            </div>
          </div>
        </header>

        {/* ROADMAP SECTION */}
        <section className="roadmap-card">
          <div className="section-header">
            <span>⚡ Program Roadmap</span>
          </div>
          <div className="roadmap-grid">
            <div className="roadmap-step">
              <span className="step-tag">Phase 01</span>
              <h3 className="step-heading">Skill Training</h3>
              <p className="step-detail">Intensive live training on industry-standard tools, frameworks, and modern tools.</p>
            </div>
            <div className="roadmap-step">
              <span className="step-tag">Phase 02</span>
              <h3 className="step-heading">Live Internship</h3>
              <p className="step-detail">Work on production-grade client projects guided by senior MNC mentors.</p>
            </div>
            <div className="roadmap-step">
              <span className="step-tag">Phase 03</span>
              <h3 className="step-heading">Placement Support</h3>
              <p className="step-detail">Resume engineering, 1-on-1 mock interviews, and direct hiring partner referrals.</p>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET SHOWCASE */}
        <div className="section-header" style={{ marginLeft: '4px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-glow)' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          <span>Deliverables &amp; Benefits</span>
        </div>
        <div className="advantages-grid">
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>
            </div>
            <h4 className="advantage-heading">Co-Logo Certificate</h4>
            <p className="advantage-desc">Global branding credentials issued alongside industry leaders.</p>
          </div>
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <h4 className="advantage-heading">Completion Certificate</h4>
            <p className="advantage-desc">Verified credentials recognized by 50+ hiring partner networks.</p>
          </div>
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg3})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            </div>
            <h4 className="advantage-heading">Recommendation Letter</h4>
            <p className="advantage-desc">Performance-based official LoR written by domain mentors.</p>
          </div>
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg4})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <h4 className="advantage-heading">1-on-1 Mentorship</h4>
            <p className="advantage-desc">Dedicated guidance from senior engineers and domain experts.</p>
          </div>
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg5})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <h4 className="advantage-heading">MNC Placement Drive</h4>
            <p className="advantage-desc">Resume building, portfolio polish, and direct interview opportunities.</p>
          </div>
          <div className="advantage-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(13, 17, 33, 0.8) 0%, rgba(13, 17, 33, 0.95) 100%), url(${bg6})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="advantage-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            </div>
            <h4 className="advantage-heading">Enterprise Tools</h4>
            <p className="advantage-desc">Practical experience with real workplace tools and environments.</p>
          </div>
        </div>

        {/* ELIGIBILITY & HELPLINE PANEL */}
        <div className="contact-grid">
          <div className="info-panel green">
            <div className="panel-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
            </div>
            <div className="panel-content">
              <div className="panel-tag">Eligibility Criteria</div>
              <div className="panel-text">
                Open to students from Technology, Business, Design, Legal, Psychology &amp; Science streams (All academic
                years &amp; recent graduates welcome).
              </div>
            </div>
          </div>
          <div className="info-panel purple">
            <div className="panel-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            <div className="panel-content">
              <div className="panel-tag">Placements Helpline</div>
              <div className="panel-text">
                <strong style={{ color: '#f8fafc' }}>Dr. Mandeep Singh</strong> — Placements Controller<br />
                Phone: <a href="tel:+918105954318" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: '600' }}>+91 8105954318</a>
              </div>
            </div>
          </div>
        </div>

        {/* SUCCESS SCREEN */}
        {submitted ? (
          <div className="success-card show" id="successScreen">
            <div className="success-icon-wrapper">🎉</div>
            <h2 className="success-main-title">Application Submitted!</h2>
            <p className="success-sub-text">
              Thank you, <strong id="sName" style={{ color: '#6366f1' }}>{formData.name || 'Applicant'}</strong>!<br />
              Your application has been logged into the SETIP 2026 admissions database.
            </p>
            <div className="ref-pill">Ref ID: <span id="applicationRef">SETIP-2026-PENDING</span></div>
            <div className="next-steps-panel">
              ✓ Onboarding counsellor assigned to your profile<br />
              ✓ WhatsApp notification &amp; schedule confirmation within 24 hours<br />
              ✓ Full curriculum syllabus sent to your email<br />
              ✓ Industry mentor assigned prior to Month 1 orientation
            </div>
            {/* <a className="whatsapp-join-btn" href="https://chat.whatsapp.com/Kp5WpklBT5n1EGL37wn97X" target="_blank" rel="noopener noreferrer">
              <span>💬 Join Official Student WhatsApp Group</span>
            </a> */}
          </div>
        ) : (
          /* APPLICATION FORM CONTAINER */
          <form id="mainForm" onSubmit={handleSubmit}>
            {/* STEP TRACKER & PROGRESS BAR */}
            <div className="form-tracker-card">
              <div className="progress-header">
                <span className="progress-title">Application Progress</span>
                <span className="progress-percentage">{progress}% Completed</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="step-steps">
                <div className={`step-node ${progress >= 25 ? 'active' : ''}`}>
                  <span className="node-num">1</span>
                  <span className="node-label">Personal Profile</span>
                </div>
                <div className={`step-node ${progress >= 50 ? 'active' : ''}`}>
                  <span className="node-num">2</span>
                  <span className="node-label">Education</span>
                </div>
                <div className={`step-node ${progress >= 75 ? 'active' : ''}`}>
                  <span className="node-num">3</span>
                  <span className="node-label">Preferences</span>
                </div>
                <div className={`step-node ${progress >= 100 ? 'active' : ''}`}>
                  <span className="node-num">4</span>
                  <span className="node-label">Submit</span>
                </div>
              </div>
            </div>

            {/* STEP 1: PERSONAL DETAILS */}
            <div className="form-glass-card" id="apply">
              <div className="card-title-bar">Step 1 — Personal Details</div>
              <div className="form-layout-grid">
                <div className="field-group span-2">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input type="text" id="name" className="form-input" placeholder="As per college records" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="field-group span-2">
                  <label htmlFor="personalEmailId">Personal Email <span className="required">*</span></label>
                  <input type="email" id="personalEmailId" className="form-input" placeholder="yourname@gmail.com" value={formData.personalEmailId} onChange={handleInputChange} />
                </div>
                <div className="field-group">
                  <label htmlFor="contactNumber">Contact Number <span className="required">*</span></label>
                  <input type="tel" id="contactNumber" className="form-input" placeholder="+91 00000 00000" value={formData.contactNumber} onChange={handleInputChange} />
                </div>
                <div className="field-group">
                  <label htmlFor="whatsappNumber">WhatsApp Number <span className="required">*</span></label>
                  <input type="tel" id="whatsappNumber" className="form-input" placeholder="Active WhatsApp number" value={formData.whatsappNumber} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* STEP 2: ACADEMIC BACKGROUND */}
            <div className="form-glass-card">
              <div className="card-title-bar">Step 2 — Academic Background</div>
              <div className="form-layout-grid">
                <div className="field-group span-2">
                  <label htmlFor="collegeName">College / University Name <span className="required">*</span></label>
                  <input type="text" id="collegeName" className="form-input" placeholder="Full official name of your institution" value={formData.collegeName} onChange={handleInputChange} />
                </div>
                <div className="field-group">
                  <label htmlFor="branchName">Branch / Stream <span className="required">*</span></label>
                  <input type="text" id="branchName" className="form-input" placeholder="e.g. Computer Science, BBA, BCA, MBA" value={formData.branchName} onChange={handleInputChange} />
                </div>
                <div className="field-group">
                  <label htmlFor="yearOfStudying">Year of Study <span className="required">*</span></label>
                  <CustomDropdown
                    id="yearOfStudying"
                    value={formData.yearOfStudying}
                    onChange={handleInputChange}
                    placeholder="— Select current year —"
                    options={yearOptions}
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: DOMAINS & PREFERENCES */}
            <div className="form-glass-card">
              <div className="card-title-bar">Step 3 — Preferences &amp; Additional Info</div>
              <div className="form-layout-grid">

                {/* Domain Selection */}
                <div className="field-group span-2" style={{ marginBottom: '10px' }}>
                  <label>Interested Domain <span className="required">*</span></label>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>Select 1 primary domain</p>

                  <div className="domain-tags">
                    <button type="button" className={`tag-btn ${domainFilter === 'all' ? 'active' : ''}`} onClick={() => setDomainFilter('all')}>
                      All ({domains.length})
                    </button>
                    <button type="button" className={`tag-btn ${domainFilter === 'tech' ? 'active' : ''}`} onClick={() => setDomainFilter('tech')}>
                      Software &amp; AI
                    </button>
                    <button type="button" className={`tag-btn ${domainFilter === 'design' ? 'active' : ''}`} onClick={() => setDomainFilter('design')}>
                      Design
                    </button>
                    <button type="button" className={`tag-btn ${domainFilter === 'mgmt' ? 'active' : ''}`} onClick={() => setDomainFilter('mgmt')}>
                      Business
                    </button>
                    <button type="button" className={`tag-btn ${domainFilter === 'core' ? 'active' : ''}`} onClick={() => setDomainFilter('core')}>
                      Core Eng
                    </button>
                  </div>

                  <div className="scrollable-tiles">
                    {domains.filter(d => domainFilter === 'all' || d.cat === domainFilter).map(d => (
                      <label key={d.label} className="tile-option">
                        <input type="radio" name="interestedDomain" value={d.label} checked={formData.interestedDomain === d.label} onChange={handleInputChange} />
                        <span>{d.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div className="field-group span-2">
                  <label>Preferred Language(s) <span className="required">*</span></label>
                  <div className="scrollable-tiles" style={{ maxHeight: 'none' }}>
                    {langs.map(l => (
                      <label key={l} className="tile-option">
                        <input type="checkbox" name="preferredLanguage" value={l} checked={formData.preferredLanguage.includes(l)} onChange={handleInputChange} />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="field-group">
                  <label htmlFor="placementCellEmailId">Placement Cell / TPO Email</label>
                  <input type="email" id="placementCellEmailId" className="form-input" placeholder="tpo@college.edu" value={formData.placementCellEmailId} onChange={handleInputChange} />
                </div>
                <div className="field-group">
                  <label htmlFor="crNameNumber">Class Representative (Name & Number)</label>
                  <input type="text" id="crNameNumber" className="form-input" placeholder="Name - Number" value={formData.crNameNumber} onChange={handleInputChange} />
                </div>
                
                <div className="field-group span-2">
                  <label htmlFor="studentsCollegeEmailId">Students College Email ID <span className="required">*</span></label>
                  <input type="email" id="studentsCollegeEmailId" className="form-input" placeholder="yourname@college.edu" value={formData.studentsCollegeEmailId} onChange={handleInputChange} />
                </div>

                {/* Why Looking */}
                <div className="field-group span-2">
                  <label htmlFor="whyLooking">Why are you looking for this Program? <span className="required">*</span></label>
                  <CustomDropdown
                    id="whyLooking"
                    value={formData.whyLooking}
                    onChange={handleInputChange}
                    placeholder="— Select your primary reason —"
                    options={reasonOptions}
                  />
                </div>
              </div>
            </div>

            {/* STEP 4: SUBMIT & ACKNOWLEDGEMENT */}
            <div className="form-glass-card">
              <div className="card-title-bar">Step 4 — Final Confirmation</div>

              <label className="declaration-box">
                <input type="checkbox" id="feeAck" checked={formData.feeAck} onChange={handleInputChange} className="hidden-checkbox" />
                <div className="custom-checkbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="declaration-text">
                  <strong>Declaration &amp; Acknowledgement:</strong> I confirm all provided details are true and accurate. I understand that SETIP 2026 includes a nominal program seat fee covering 3-month live mentorship, tools, and MNC placement co-certification.
                </div>
              </label>

              <button type="submit" className="submit-action-btn" id="submitBtn" disabled={isSubmitting}>
                <span className="btn-glow"></span>
                <span className="btn-content">
                  {isSubmitting ? 'Submitting...' : 'Submit Application & Reserve Seat'}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </button>

              {errorMsg && (
                <div className="error-notification show">{errorMsg}</div>
              )}

              <div className="security-notice">
                <div className="security-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  SSL Encrypted
                </div>
                <span className="dot">•</span>
                <div className="security-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Official Admissions
                </div>
                <span className="dot">•</span>
                <div className="security-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Response via WhatsApp
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          &copy; 2026 <strong style={{ color: 'var(--primary-glow)' }}>Skill Enhancement Training &amp; Internship Program
            (SETIP)</strong><br />
          Official Student Helpline: <a href="tel:+918105954318">+91 8105954318</a> &bull; Admissions Office
        </p>
      </footer>

      {/* FLOATING HELPLINE BADGE */}
      {/* <a href="https://chat.whatsapp.com/Kp5WpklBT5n1EGL37wn97X" target="_blank" rel="noopener noreferrer" className="floating-helpline">
        <span style={{ fontSize: '15px' }}>💬</span>
        <span>Helpline</span>
      </a> */}
    </div>
  );
};

export default EnrollmentForm;
