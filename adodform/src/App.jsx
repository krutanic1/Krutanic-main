import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import SubhraImg from './assets/mentors/Subhra.jpg';
import RudraImg from './assets/mentors/rudra.jpg';
import RohanImg from './assets/alumini/rohan.jpg';
import RajaImg from './assets/alumini/raja.jpg';
import PrabhleenImg from './assets/alumini/prabhleen.jpg';

/* --- Data --- */
const PARTNERS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb'];

const COMPARISON = [
  { feature: 'Curriculum', traditional: 'Theoretical, outdated syllabi', krutanic: 'Built backwards from current JD requirements' },
  { feature: 'Mentorship', traditional: 'Group Q&A with junior TAs', krutanic: '1:1 guidance from active Top 1% Industry Leaders' },
  { feature: 'Experience', traditional: 'Capstone "toy" projects', krutanic: 'Real Corporate Internship with live evaluation' },
  { feature: 'Placement', traditional: 'Access to a generic job portal', krutanic: 'Guaranteed interviews until you secure an offer' }
];

const PHASES = [
  { 
    month: 'Month 1', 
    title: 'Practical Learning & Industry Training', 
    desc: 'Participate in interactive live sessions covering both fundamental and advanced industry topics led by professionals. Engage in live discussions, hands-on exercises, and personalized doubt-clearing sessions to strengthen conceptual understanding. Classes conducted Monday to Friday via Zoom or Google Meet.'
  },
  { 
    month: 'Month 2', 
    title: 'Internship & Project-Based Learning', 
    desc: 'Gain practical exposure by working on real-world projects under the mentorship of industry experts. Complete a minor individual project (1 week) followed by a major group project (3 weeks), allowing for skill application in a collaborative environment.'
  },
  { 
    month: 'Month 3', 
    title: '100% Placement Assistance & Job Readiness Upto 11 LPA', 
    desc: 'Receive comprehensive placement support, including mock interviews, group discussions, resume-building workshops, and communication skill enhancement sessions. Benefit from personalized career guidance to improve your job search strategy and increase your chances of securing a placement.'
  }
];

const FAQS = [
  { q: 'Who is this program designed for?', a: 'This cohort is strictly for ambitious working professionals (1-5 years exp), recent graduates, and individuals aggressively seeking a career switch into high-growth tech roles.' },
  { q: 'How does the 100% Placement Assistance work?', a: 'We do not stop at "assistance." We provide dedicated referrals, schedule your interviews, and prepare you until you sign an offer letter. It is a contractual commitment.' },
  { q: 'What is the time commitment required?', a: 'Expect to dedicate 12-15 hours per week. This program is intensive by design, to ensure you achieve years of growth in just 6 months.' }
];

/* --- Components --- */

const AnimatedStat = ({ value, label }) => {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const PLACEMENTS = [
  { initials: 'AM', name: 'Arjun Mehta', role: 'Product Analyst', company: 'Swiggy', before: '4.5 LPA', after: '14.2 LPA', color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', batch: 'OCT/22' },
  { initials: 'RS', name: 'Riya Sharma', role: 'SDE II', company: 'Amazon', before: '6.0 LPA', after: '22.0 LPA', color: 'linear-gradient(135deg, #f59e0b, #d97706)', batch: 'DEC/19' },
  { initials: 'VK', name: 'Varun Kumar', role: 'Data Scientist', company: 'Walmart', before: '3.5 LPA', after: '12.5 LPA', color: 'linear-gradient(135deg, #10b981, #059669)', batch: 'SEP/14' },
  { initials: 'NK', name: 'Neha Kapoor', role: 'Frontend Eng.', company: 'Cred', before: '5.2 LPA', after: '16.0 LPA', color: 'linear-gradient(135deg, #ec4899, #be185d)', batch: 'NOV/08' },
  { initials: 'SJ', name: 'Sahil Jain', role: 'Backend Eng.', company: 'Paytm', before: '4.0 LPA', after: '13.5 LPA', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', batch: 'AUG/27' }
];

const HeroSection = ({ onShowModal }) => {
  const scrollToForm = () => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % PLACEMENTS.length);
        setFade(false);
      }, 400); // 400ms fade
    }, 4000); // rotate every 4s
    return () => clearInterval(interval);
  }, []);

  const p = PLACEMENTS[idx];

  return (
    <section className="adv-hero">
      <div className="adv-hero-bg-glow"></div>
      <div className="adv-hero-bg-grid"></div>
      <div className="adv-hero-container">
        
        <div className="adv-hero-grid">
          <div className="adv-hero-left">
            <div className="adv-badge">
              <span className="adv-pulse-dot"></span> Next Cohort: Super 30 Professionals
            </div>
            <h1 className="adv-h1">
              Break the Salary Barrier.<br/>
              <span className="adv-h1-accent">Command Your Worth.</span>
            </h1>
            <p className="adv-hero-p">
              The elite 3-Month Placement Acceleration Program. We bridge the gap between your current stagnation and high-paying tech roles through 1:1 mentorship, real-world internships, and an uncompromising 100% placement guarantee upto 11 LPA.
            </p>
            
            <div className="adv-hero-cta-group">
              <button className="adv-btn-primary" onClick={scrollToForm}>
                Apply for the 2026 Cohort <span className="adv-arrow">→</span>
              </button>
              <div className="adv-hero-trust">
                <div className="adv-avatars">
                  <img className="adv-avatar adv-avatar-photo" src={SubhraImg} alt="Subhra" />
                  <img className="adv-avatar adv-avatar-photo" src={RudraImg} alt="Rudra" />
                  <img className="adv-avatar adv-avatar-photo" src={RohanImg} alt="Rohan" />
                  <img className="adv-avatar adv-avatar-photo" src={RajaImg} alt="Raja" />
                  <img className="adv-avatar adv-avatar-photo" src={PrabhleenImg} alt="Prabhleen" />
                  <div className="adv-avatar adv-avatar-more">+4k</div>
                </div>
                <div className="adv-trust-text">
                  <span>Trusted by 4,000+ professionals</span>
                  <div className="adv-stars">
                    ★★★★★ 4.9/5 Rating
                    <div className="adv-rating-info">
                      ?
                      <span className="adv-rating-tooltip">Based on 4,000+ verified student reviews across all 2024-2025 cohorts.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="adv-hero-right">
            <div className="adv-glass-card">
              <div className="adv-glass-header">
                <div className="adv-glass-icon">💼</div>
                <div>
                  <div className="adv-glass-title">Recent Placement</div>
                </div>
                <div className="adv-glass-badge">Verified Offer</div>
              </div>
              <div className={`adv-glass-body ${fade ? 'adv-fade-out' : 'adv-fade-in'}`}>
                <div className="adv-profile-row">
                  <div className="adv-profile-pic adv-profile-text" style={{background: p.color}}>{p.initials}</div>
                  <div className="adv-profile-info">
                    <div className="adv-profile-name">
                      {p.name} <span className="adv-profile-batch">Cohort: {p.batch}</span>
                    </div>
                    <div className="adv-profile-role">{p.role} at <strong>{p.company}</strong></div>
                  </div>
                </div>
                <div className="adv-salary-jump">
                  <div className="adv-salary-col">
                    <span>Before Krutanic</span>
                    <strong>{p.before}</strong>
                  </div>
                  <div className="adv-salary-arrow">➔</div>
                  <div className="adv-salary-col adv-salary-after">
                    <span>After 6 Months</span>
                    <strong>{p.after}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="adv-glass-card adv-glass-card-small" onClick={onShowModal} style={{cursor: 'pointer'}}>
              <div className="adv-guarantee-check">✓</div>
              <div className="adv-guarantee-text">
                <strong>100% Placement Assistance</strong>
                <span>Written in your enrollment contract</span>
                <span className="adv-how-link">How we do it?</span>
              </div>
              <div className="adv-info-pulse">i</div>
            </div>
          </div>
        </div>

        <div className="adv-hero-stats">
          <AnimatedStat value="500+" label="Hiring Partners" />
          <AnimatedStat value="98%" label="Success Rate" />
          <AnimatedStat value="3.2x" label="Avg Salary Hike" />
          <AnimatedStat value="₹12L" label="Average CTC" />
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => (
  <section className="adv-partners">
    <p className="adv-partners-title">OUR ALUMNI THRIVE AT TOP TIER FIRMS</p>
    <div className="adv-partners-track">
      {PARTNERS.map(p => <span key={p} className="adv-partner-logo">{p}</span>)}
    </div>
  </section>
);

const ComparisonSection = () => {
  const scrollToForm = () => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
  return (
  <section className="adv-comparison">
    <div className="adv-container">
      <h2 className="adv-h2">The Truth About Upskilling</h2>
      <p className="adv-p-lead">Why 90% of online courses fail professionals, and why our architecture works.</p>

      {/* Desktop: Table view */}
      <div className="adv-comp-table-wrapper adv-comp-desktop">
        <table className="adv-comp-table">
          <thead>
            <tr>
              <th>The Standard Model</th>
              <th className="adv-comp-highlight">The Krutanic Architecture</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={i}>
                <td className="adv-comp-trad">
                  <span className="adv-cross">×</span> {row.traditional}
                </td>
                <td className="adv-comp-krut">
                  <span className="adv-check">✓</span> {row.krutanic}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Stacked card view */}
      <div className="adv-comp-mobile">
        {COMPARISON.map((row, i) => (
          <div key={i} className="adv-comp-card">
            <div className="adv-comp-card-bad">
              <span className="adv-comp-card-label adv-comp-card-label-bad">Standard Model</span>
              <div className="adv-comp-card-content">
                <span className="adv-cross">×</span>
                <span>{row.traditional}</span>
              </div>
            </div>
            <div className="adv-comp-card-divider">vs</div>
            <div className="adv-comp-card-good">
              <span className="adv-comp-card-label adv-comp-card-label-good">Krutanic Architecture</span>
              <div className="adv-comp-card-content">
                <span className="adv-check">✓</span>
                <span>{row.krutanic}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <button className="adv-btn-primary adv-btn-animated" onClick={scrollToForm}>
          Apply for the 2026 Cohort <span className="adv-arrow">→</span>
        </button>
      </div>
    </div>
  </section>
  );
};

const RoadmapSection = () => {
  const scrollToForm = () => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
  return (
  <section className="adv-roadmap">
    <div className="adv-container">
      <h2 className="adv-h2">A 3-Month System Engineered for Outcomes</h2>
      <div className="adv-roadmap-grid">
        {PHASES.map((phase, i) => (
          <div key={i} className="adv-phase-card">
            <div className="adv-phase-num">0{i+1}</div>
            <div className="adv-phase-month">{phase.month}</div>
            <h3 className="adv-phase-title">{phase.title}</h3>
            <p className="adv-phase-desc">{phase.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <button className="adv-btn-primary adv-btn-animated" onClick={scrollToForm}>
          Apply for the 2026 Cohort <span className="adv-arrow">→</span>
        </button>
      </div>
    </div>
  </section>
  );
};

const GuaranteeSection = ({ onShowModal }) => {
  return (
    <section className="adv-guarantee">
      <div className="adv-container adv-guarantee-inner">
        <div className="adv-shield-icon">🛡️</div>
        <h2 className="adv-h2">The Uncompromising Placement Guarantee</h2>
        <p className="adv-guarantee-p">
          We are fundamentally invested in your success. Our commitment is written into the program: we will provide mock interviews, group discussions, resume-building support, and dedicated career guidance until you secure the role you deserve — upto 11 LPA. Period.
        </p>
        <button className="adv-btn-how" onClick={onShowModal}>
          How exactly do we do it? <span className="adv-btn-how-icon">?</span>
        </button>
      </div>
    </section>
  );
};

const PlacementModal = ({ onClose }) => (
  <div className="adv-modal-overlay" onClick={onClose}>
    <div className="adv-modal-content" onClick={e => e.stopPropagation()}>
      <button className="adv-modal-close" onClick={onClose}>&times;</button>
      <h3 className="adv-modal-h3">Our Placement Architecture</h3>
      <p className="adv-modal-p-lead">We don't leave your career to chance. Here is the rigorous system we use to secure your future.</p>
      
      <div className="adv-modal-grid">
        <div className="adv-modal-item">
          <div className="adv-modal-num">01</div>
          <h4>Reverse-Engineered Prep</h4>
          <p>We hyper-focus on exactly what top-tier interviewers want. We train you for the real technical and behavioral bars set by firms like Google, Amazon, and Microsoft.</p>
        </div>
        <div className="adv-modal-item">
          <div className="adv-modal-num">02</div>
          <h4>The Hidden Network</h4>
          <p>70% of elite roles never hit public job boards. Our internal network identifies high-growth vacancies in the startup and corporate ecosystem before they are ever posted.</p>
        </div>
        <div className="adv-modal-item">
          <div className="adv-modal-num">03</div>
          <h4>Aggressive Referrals</h4>
          <p>Our team is connected with HR leads at 500+ companies. We don't just "apply"—we bypass the noise and send your resume directly to the decision-maker's inbox.</p>
        </div>
        <div className="adv-modal-item">
          <div className="adv-modal-num">04</div>
          <h4>Resume Hyper-Optimization</h4>
          <p>We take complete ownership of your professional profile. Our experts rebuild your resume to bypass ATS filters and command attention in less than 6 seconds.</p>
        </div>
      </div>
      
      <div className="adv-modal-footer">
        <div className="adv-modal-badge">✓ Contractually Guaranteed Success</div>
      </div>
    </div>
  </div>
);

const FAQSection = () => {
  const [open, setOpen] = useState(0);
  
  const scrollToForm = (e) => {
    e.preventDefault();
    document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="adv-faq">
      <div className="adv-container adv-faq-grid">
        <div className="adv-faq-left">
          <h2 className="adv-h2">Clarity Before Commitment</h2>
          <p className="adv-faq-p">
            Deciding to accelerate your career is a significant step. We've compiled the most common questions to give you complete transparency before you apply.
          </p>
          <div className="adv-faq-contact">
            <p>Ready to take the next step?</p>
            <a href="#enrollment-form" onClick={scrollToForm} className="adv-faq-link">Speak with an Advisor →</a>
          </div>
        </div>
        <div className="adv-faq-right">
          <div className="adv-faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`adv-faq-item ${open === i ? 'active' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="adv-faq-q">
                  {faq.q}
                  <span className="adv-faq-icon">{open === i ? '−' : '+'}</span>
                </div>
                {open === i && <div className="adv-faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const CustomSelect = ({ label, name, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Calculate position of dropdown based on trigger element's position in viewport
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

  // Reposition on scroll/resize
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

  // Close on outside click
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
      style={{
        ...dropdownStyle,
        background: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        overflowY: 'auto',
        maxHeight: '250px',
      }}
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
          style={{
            padding: '14px 20px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            color: value === opt ? '#ffffff' : '#cbd5e1',
            background: value === opt ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            borderLeft: value === opt ? '4px solid #8b5cf6' : '4px solid transparent',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.12)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.paddingLeft = '24px'; }}
          onMouseLeave={e => { e.currentTarget.style.background = value === opt ? 'rgba(139, 92, 246, 0.2)' : 'transparent'; e.currentTarget.style.color = value === opt ? '#fff' : '#cbd5e1'; e.currentTarget.style.paddingLeft = '20px'; }}
        >
          {opt}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="adv-input-group">
      <label>{label}</label>
      <div
        className={`adv-custom-select ${isOpen ? 'open' : ''}`}
        ref={triggerRef}
        onClick={() => isOpen ? setIsOpen(false) : openDropdown()}
      >
        <div className="adv-select-trigger">
          <span style={{ color: value ? '#fff' : '#64748b' }}>{value || placeholder}</span>
          <span className={`adv-select-arrow ${isOpen ? 'up' : ''}`}></span>
        </div>
      </div>
      {dropdown}
    </div>
  );
};

const EnrollmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-clicks
    setErrorMsg('');

    // Form action URL
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf11jhp9nRLudRnUSMPTqugUGM-SjAgu6MhGq-zr7I6KiuWwg/formResponse";

    // 1. Validate Text Fields are not just spaces
    const requiredTextProps = [
      'name', 'studentsCollegeEmailId', 'personalEmailId', 'contactNumber', 
      'whatsappNumber', 'collegeName', 'branchName', 'preferredLanguage'
    ];
    for (const prop of requiredTextProps) {
      if (!formData[prop] || formData[prop].trim() === '') {
        setErrorMsg('Please fill out all required fields with valid information (not just spaces).');
        return;
      }
    }

    // 2. Validate Dropdowns
    if (!formData.yearOfStudying || !formData.interestedDomain || !formData.whyLooking) {
      setErrorMsg('Please select an option for all dropdown fields.');
      return;
    }

    // 3. Validate Emails strictly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentsCollegeEmailId) || 
        !emailRegex.test(formData.personalEmailId) || 
        (formData.placementCellEmailId && !emailRegex.test(formData.placementCellEmailId))) {
      setErrorMsg('Please enter valid email addresses.');
      return;
    }

    // 4. Validate Phone Numbers (at least 7 digits)
    if (formData.contactNumber.replace(/\D/g, '').length < 7 || 
        formData.whatsappNumber.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter valid phone numbers.');
      return;
    }

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      // Mapping to Google Form Entry IDs
      params.append('entry.2091329291', formData.name);
      params.append('entry.2049688692', formData.studentsCollegeEmailId);
      params.append('entry.1202048494', formData.personalEmailId);
      params.append('entry.115076891', formData.contactNumber);
      params.append('entry.749068123', formData.whatsappNumber);
      params.append('entry.439322570', formData.collegeName);
      params.append('entry.128783956', formData.branchName);
      params.append('entry.1310370895', formData.yearOfStudying);
      params.append('entry.90263671', formData.interestedDomain);
      params.append('entry.1659444177', formData.placementCellEmailId);
      params.append('entry.563052097', formData.crNameNumber);
      params.append('entry.13795102', formData.whyLooking);
      params.append('entry.1152599486', formData.preferredLanguage);

      await fetch(googleFormUrl, { 
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

  if (submitted) {
    return (
      <section className="adv-form-section" id="enrollment-form">
        <div className="adv-success-box">
          <div className="adv-success-icon">✓</div>
          <h3>Application Received</h3>
          <p>Your profile is under review by our admissions board. We will contact you within 24 hours.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="adv-form-section" id="enrollment-form">
      <div className="adv-container">
        <div className="adv-form-wrapper">
          <div className="adv-form-sidebar">
            <h3>Adobe Certified Training and Internship Program</h3>
            <p>Please fill out the form carefully to register for the upcoming program.</p>
            <div className="adv-form-sidebar-perks">
              <div className="adv-perk">✓ 100% Placement Assistance</div>
              <div className="adv-perk">✓ 1:1 Industry Mentorship</div>
              <div className="adv-perk">✓ Corporate Internship</div>
              <div className="adv-perk">✓ Unlimited AI Mock Interviews</div>
            </div>
          </div>
          
          <div className="adv-form-content">
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>


                <div className="adv-form-step">
                  <h4 className="adv-step-title">PERSONAL & ACADEMIC DETAILS</h4>
                  
                  <div className="adv-input-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="adv-input-row">
                    <div className="adv-input-group">
                      <label>Students College Email Id *</label>
                      <input type="email" name="studentsCollegeEmailId" value={formData.studentsCollegeEmailId} onChange={handleInputChange} required />
                    </div>
                    <div className="adv-input-group">
                      <label>Personal Email Id *</label>
                      <input type="email" name="personalEmailId" value={formData.personalEmailId} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="adv-input-row">
                    <div className="adv-input-group">
                      <label>Contact Number *</label>
                      <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="adv-input-group">
                      <label>WhatsApp Number *</label>
                      <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="adv-input-row">
                    <div className="adv-input-group">
                      <label>College Name *</label>
                      <input type="text" name="collegeName" value={formData.collegeName} onChange={handleInputChange} required />
                    </div>
                    <div className="adv-input-group">
                      <label>Branch Name *</label>
                      <input type="text" name="branchName" value={formData.branchName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  
                  <CustomSelect 
                    label="Year Of Studying *" 
                    name="yearOfStudying" 
                    value={formData.yearOfStudying} 
                    onChange={handleInputChange} 
                    placeholder="Select year"
                    options={[
                      "1st Year",
                      "2nd Year",
                      "3rd Year",
                      "4th Year",
                      "passed out"
                    ]}
                  />

                  <h4 className="adv-step-title" style={{ marginTop: '32px' }}>PROGRAM GOALS & PREFERENCES</h4>
                  
                  <CustomSelect 
                    label="Interested Domain *" 
                    name="interestedDomain" 
                    value={formData.interestedDomain} 
                    onChange={handleInputChange} 
                    placeholder="Select domain"
                    options={[
                      "Android App Development",
                      "Full Stack Development",
                      "Data Science",
                      "Data Analytics",
                      "Machine Learning",
                      "Artificial Intelligence",
                      "Cyber Security",
                      "Internet of Things/ Robotics",
                      "Cloud Computing",
                      "DevOps",
                      "Graphic designer",
                      "UI/UX Design",
                      "AutoCad",
                      "Embedded Systems",
                      "Digital Marketing",
                      "Finance",
                      "Human Resource",
                      "VLSI Design",
                      "Business Analytics",
                      "Forensic Psychology",
                      "Clinical Psychology",
                      "Corporate Law",
                      "Psychology"
                    ]}
                  />

                  <div className="adv-input-group">
                    <label>Placement Cell Email Id [ TPO Mail Id] (Optional)</label>
                    <input type="email" name="placementCellEmailId" value={formData.placementCellEmailId} onChange={handleInputChange} />
                  </div>

                  <div className="adv-input-group">
                    <label>CR's [ Class Representative Name & Number] (Optional)</label>
                    <input type="text" name="crNameNumber" value={formData.crNameNumber} onChange={handleInputChange} />
                  </div>

                  <CustomSelect 
                    label="Why are you looking for this Program? *" 
                    name="whyLooking" 
                    value={formData.whyLooking} 
                    onChange={handleInputChange} 
                    placeholder="Select a reason"
                    options={[
                      "Skill Development & Industry Exposure",
                      "Career Growth Opportunity",
                      "Learning from Industry Leaders",
                      "To Gain Exposure to Emerging Technologies"
                    ]}
                  />

                  <div className="adv-input-group">
                    <label>Preferred Language *</label>
                    <input type="text" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} required />
                  </div>

                  <div className="adv-checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                    <input 
                      type="checkbox" 
                      name="isConfirmed" 
                      id="isConfirmed"
                      checked={formData.isConfirmed} 
                      onChange={handleInputChange} 
                      required 
                      style={{ marginTop: '4px', width: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="isConfirmed" style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', cursor: 'pointer', margin: 0, padding: 0 }}>
                      <strong>
                        I confirm that all details provided are accurate and acknowledge that a nominal fee applies for the Adobe Certified Program 2026.
                      </strong>
                    </label>
                  </div>

                  <div className="adv-form-actions-v2">
                    <button type="submit" className="adv-btn-submit" disabled={isSubmitting || !formData.isConfirmed}>
                      {isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT MY APPLICATION'}
                    </button>
                  </div>
                </div>
            </form>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px', fontWeight: '500' }}>Need assistance? We're here to help.</p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a 
              href="https://wa.me/918105954318?text=hi%20i%20am%20here%20from%20the%20adodeform" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px', 
                background: 'rgba(34, 197, 94, 0.06)', 
                color: '#4ade80', 
                border: '1px solid rgba(34, 197, 94, 0.2)', 
                borderRadius: '30px', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '0.85rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)'; 
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(34, 197, 94, 0.15)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(34, 197, 94, 0.06)'; 
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1rem' }}>💬</span> WhatsApp
            </a>

            <a 
              href="mailto:support@krutanic.com" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px', 
                background: 'rgba(59, 130, 246, 0.06)', 
                color: '#60a5fa', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                borderRadius: '30px', 
                textDecoration: 'none', 
                fontWeight: '500',
                fontSize: '0.85rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'; 
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.06)'; 
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1rem' }}>✉️</span> Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


const App = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="adv-landing">
      <Toaster position="top-center" reverseOrder={false} />
      <HeroSection onShowModal={() => setShowModal(true)} />
      <PartnersSection />
      <ComparisonSection />
      <RoadmapSection />
      <GuaranteeSection onShowModal={() => setShowModal(true)} />
      <FAQSection />
      <EnrollmentForm />

      {showModal && <PlacementModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default App;
