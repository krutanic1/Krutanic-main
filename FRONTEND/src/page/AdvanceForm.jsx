import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './AdvanceForm.css';

/* --- Data --- */
const PARTNERS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb'];

const COMPARISON = [
  { feature: 'Curriculum', traditional: 'Theoretical, outdated syllabi', krutanic: 'Built backwards from current JD requirements' },
  { feature: 'Mentorship', traditional: 'Group Q&A with junior TAs', krutanic: '1:1 guidance from active Top 1% Industry Leaders' },
  { feature: 'Experience', traditional: 'Capstone "toy" projects', krutanic: 'Real Corporate Internship with live evaluation' },
  { feature: 'Placement', traditional: 'Access to a generic job portal', krutanic: 'Guaranteed interviews until you secure an offer' }
];

const PHASES = [
  { month: 'Months 1-3', title: 'Immersive Core Competency', desc: 'Master advanced frameworks through rigorous, mentor-led live sessions.' },
  { month: 'Month 4', title: 'Industry Simulation', desc: 'Execute complex, real-world assignments under strict corporate deadlines.' },
  { month: 'Month 5', title: 'Corporate Internship', desc: 'Integrate with a partner firm. Contribute to live production environments.' },
  { month: 'Month 6', title: 'Placement & Negotiation', desc: 'Mock interviews, profile hyper-optimization, and offer negotiation strategy.' }
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
              The elite 6-Month Placement Acceleration Program. We bridge the gap between your current stagnation and high-paying tech roles through 1:1 mentorship, corporate internships, and an uncompromising placement guarantee.
            </p>
            
            <div className="adv-hero-cta-group">
              <button className="adv-btn-primary" onClick={scrollToForm}>
                Apply for the 2026 Cohort <span className="adv-arrow">→</span>
              </button>
              <div className="adv-hero-trust">
                <div className="adv-avatars">
                  <div className="adv-avatar adv-avatar-text" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>RS</div>
                  <div className="adv-avatar adv-avatar-text" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>AK</div>
                  <div className="adv-avatar adv-avatar-text" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>MP</div>
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

const ComparisonSection = () => (
  <section className="adv-comparison">
    <div className="adv-container">
      <h2 className="adv-h2">The Truth About Upskilling</h2>
      <p className="adv-p-lead">Why 90% of online courses fail professionals, and why our architecture works.</p>
      <div className="adv-comp-table-wrapper">
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
    </div>
  </section>
);

const RoadmapSection = () => (
  <section className="adv-roadmap">
    <div className="adv-container">
      <h2 className="adv-h2">A System Engineered for Outcomes</h2>
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
    </div>
  </section>
);

const GuaranteeSection = ({ onShowModal }) => {
  return (
    <section className="adv-guarantee">
      <div className="adv-container adv-guarantee-inner">
        <div className="adv-shield-icon">🛡️</div>
        <h2 className="adv-h2">The Uncompromising Placement Guarantee</h2>
        <p className="adv-guarantee-p">
          We are fundamentally invested in your success. Our commitment is written into the program: we will provide aggressive referral mapping, unlimited mock interviews, and dedicated career advocacy until you secure the role you deserve. Period.
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

const RECENT_REGISTRATIONS = [
  "rahul****@gmail.com", "sneha.****@yahoo.com", "amit.k****@gmail.com", "priya****@outlook.com",
  "vikas.****@gmail.com", "anjali****@gmail.com", "karan.****@hotmail.com", "pooja.****@gmail.com",
  "rohit****@gmail.com", "neha.s****@yahoo.com", "arjun.****@gmail.com", "shweta****@gmail.com",
  "tarun****@gmail.com", "manish.****@outlook.com", "divya.****@gmail.com", "suresh****@yahoo.com",
  "kavita.****@gmail.com", "sanjay.****@gmail.com", "deepa.****@hotmail.com", "rajesh****@gmail.com",
  "megha.****@gmail.com", "sunil.****@yahoo.com", "nidhi.****@gmail.com", "anil.k****@outlook.com",
  "sonam****@gmail.com", "vijay.****@gmail.com", "payal.****@yahoo.com", "alok.****@gmail.com",
  "ritu.****@hotmail.com", "prakash****@gmail.com", "akash****@gmail.com", "simran.****@yahoo.com",
  "kunal.****@gmail.com", "isha****@outlook.com", "harsh.****@gmail.com", "arti****@gmail.com",
  "gaurav.****@hotmail.com", "preeti.****@gmail.com", "sourabh****@gmail.com", "richa.s****@yahoo.com",
  "kartik.****@gmail.com", "monika****@gmail.com", "aman****@gmail.com", "jyoti.****@outlook.com",
  "deepak.****@gmail.com", "swati****@yahoo.com", "ashish.****@gmail.com", "poonam.****@gmail.com",
  "ravi.****@hotmail.com", "reena****@gmail.com", "sandeep.****@gmail.com", "bhavna.****@yahoo.com",
  "naveen.****@gmail.com", "shilpa.k****@outlook.com", "pankaj****@gmail.com", "rachna.****@gmail.com",
  "yash.****@yahoo.com", "shivani.****@gmail.com", "akshay.****@hotmail.com", "mansi****@gmail.com",
  "prateek****@gmail.com", "diksha.****@yahoo.com", "vishal.k****@gmail.com", "sakshi****@outlook.com",
  "mayank.****@gmail.com", "komal****@gmail.com", "abhishek.****@hotmail.com", "shruti.****@gmail.com",
  "udit****@gmail.com", "tanya.s****@yahoo.com", "prashant.****@gmail.com", "radhika****@gmail.com",
  "hemant****@gmail.com", "smriti.****@outlook.com", "nitin.****@gmail.com", "meenakshi****@yahoo.com",
  "ajay.****@gmail.com", "renu.****@gmail.com", "mukesh.****@hotmail.com", "vandana****@gmail.com",
  "bharat.****@gmail.com", "pallavi.****@yahoo.com", "chirag.****@gmail.com", "anusha.k****@outlook.com",
  "punit****@gmail.com", "bharti.****@gmail.com", "dhruv.****@yahoo.com", "charu.****@gmail.com",
  "gautam.****@hotmail.com", "shikha****@gmail.com", "yogesh****@gmail.com", "kirti.****@yahoo.com",
  "ashok.****@gmail.com", "garima****@outlook.com", "jatin.****@gmail.com", "tanvi****@gmail.com",
  "vinay.****@hotmail.com", "ridhi.****@gmail.com", "siddharth****@gmail.com", "anushka.s****@yahoo.com"
];

const CustomSelect = ({ label, name, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="adv-input-group" ref={containerRef}>
      <label>{label}</label>
      <div className={`adv-custom-select ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="adv-select-trigger">
          <span>{value || placeholder}</span>
          <span className={`adv-select-arrow ${isOpen ? 'up' : ''}`}></span>
        </div>
        {isOpen && (
          <div className="adv-select-options">
            {options.map((opt) => (
              <div 
                key={opt} 
                className={`adv-select-option ${value === opt ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ target: { name, value: opt } });
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EnrollmentForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', email: '', contactNumber: '', whatsappNumber: '',
    currentSituation: '', preferredLanguages: [], 
    primaryGoal: '', currentChallenge: '', interestReason: '',
    domain: '', commitmentLevel: '', readyToInvest: '',
    startTime: '', importanceReason: '', connectTime: '',
    paidAgreement: false,
    website: '', // Honeypot field
    captchaAnswer: '' // User's answer to math captcha
  });

  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });

  useEffect(() => {
    generateCaptcha();
  }, [step]);

  const generateCaptcha = () => {
    setCaptcha({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
  };

  const languageOptions = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'];

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleLanguageToggle = (lang) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang) 
        ? prev.preferredLanguages.filter(l => l !== lang) 
        : [...prev.preferredLanguages, lang]
    }));
  };

  const nextStep = (e) => { e.preventDefault(); setStep(2); };
  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 0. Honeypot check: If the hidden 'website' field is filled, it's likely a bot
    if (formData.website) {
      console.warn("Honeypot filled. Bot detected.");
      setSubmitted(true); // Pretend success to bots
      return;
    }

    // 1. Math Captcha check
    if (parseInt(formData.captchaAnswer) !== (captcha.a + captcha.b)) {
      toast.error(`Incorrect answer: ${captcha.a} + ${captcha.b} is not ${formData.captchaAnswer}`);
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaAnswer: '' }));
      return;
    }

    setIsSubmitting(true);
    const googleFormUrl = "https://script.google.com/macros/s/AKfycbyelYSHt540sEM5pBOaffU8ineKo5q5nNAg4MxlMr3wYICEl7Xi_YylqnHpE8ORpDkC/exec";

    try {
      const params = new URLSearchParams();
      params.append('fullName', formData.fullName);
      params.append('email', formData.email);
      params.append('contactNumber', formData.contactNumber);
      params.append('whatsappNumber', formData.whatsappNumber);
      params.append('currentSituation', formData.currentSituation);
      params.append('preferredLanguages', formData.preferredLanguages.join(', '));
      params.append('primaryGoal', formData.primaryGoal);
      params.append('currentChallenge', formData.currentChallenge);
      params.append('interestReason', formData.interestReason);
      params.append('domain', formData.domain);
      params.append('commitmentLevel', formData.commitmentLevel);
      params.append('readyToInvest', formData.readyToInvest);
      params.append('startTime', formData.startTime);
      params.append('importanceReason', formData.importanceReason);
      params.append('connectTime', formData.connectTime);
      params.append('paidAgreement', formData.paidAgreement ? 'Yes' : 'No');
      params.append('source', 'Krutanic Advance Form');

      await fetch(googleFormUrl, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString() 
      });

      // 2. Submit to Backend Database (AdvFormLead collection)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await fetch(`${apiUrl}/api/adv-leads/submit-adv-form-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (dbErr) {
        console.error("Database sync error:", dbErr);
      }

      setIsSubmitting(false); 
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setIsSubmitting(false); 
      setSubmitted(true); 
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
            <h3>The Super 30 Cohort</h3>
            <p>We select candidates based on ambition, clarity of goals, and readiness to execute. Take your time to fill this out accurately.</p>
            <div className="adv-form-sidebar-perks">
              <div className="adv-perk">✓ 100% Placement Assistance</div>
              <div className="adv-perk">✓ 1:1 Industry Mentorship</div>
              <div className="adv-perk">✓ Corporate Internship</div>
              <div className="adv-perk">✓ 15 Interview Guarantee</div>
            </div>


          </div>
          
          <div className="adv-form-content">
            <div className="adv-stepper">
              <div className={`adv-step ${step >= 1 ? 'active' : ''}`}>1. Profile</div>
              <div className="adv-step-line"></div>
              <div className={`adv-step ${step >= 2 ? 'active' : ''}`}>2. Career Goals</div>
            </div>

            <form onSubmit={step === 1 ? nextStep : handleSubmit}>
              {/* Security Honeypot: Hidden from humans, tempting for bots */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input 
                  type="text" 
                  name="website" 
                  tabIndex="-1" 
                  autoComplete="off" 
                  value={formData.website} 
                  onChange={handleInputChange} 
                />
              </div>

              {step === 1 && (
                <div className="adv-form-step">
                  <div className="adv-input-group">
                    <label>Full Professional Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="adv-input-group">
                    <label>Primary Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="adv-input-row">
                    <div className="adv-input-group">
                      <label>Contact Number</label>
                      <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="adv-input-group">
                      <label>WhatsApp Number</label>
                      <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <CustomSelect 
                    label="Current Professional Status" 
                    name="currentSituation" 
                    value={formData.currentSituation} 
                    onChange={handleInputChange} 
                    placeholder="Select status"
                    options={[
                      'Recent Graduate (0–1 year)',
                      'Working Professional (1–5 years)',
                      'Currently Unemployed',
                      'Looking for a Career Switch'
                    ]}
                  />
                  <div className="adv-input-group">
                    <label>Preferred Communication Language</label>
                    <div className="adv-chips">
                      {languageOptions.map(lang => (
                        <span key={lang} className={`adv-chip ${formData.preferredLanguages.includes(lang) ? 'selected' : ''}`} onClick={() => handleLanguageToggle(lang)}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="adv-btn-primary adv-btn-full">Proceed to Career Goals</button>
                </div>
              )}

              {step === 2 && (
                <div className="adv-form-step">
                  <h4 className="adv-step-title">CAREER GOALS & READINESS</h4>
                  
                  <CustomSelect 
                    label="PRIMARY CAREER GOAL *" 
                    name="primaryGoal" 
                    value={formData.primaryGoal} 
                    onChange={handleInputChange} 
                    placeholder="Select your goal"
                    options={[
                      'Get my first job',
                      'Switch to a better role / company',
                      'Increase salary / package',
                      'Build strong practical skills'
                    ]}
                  />

                  <CustomSelect 
                    label="CURRENT CHALLENGE *" 
                    name="currentChallenge" 
                    value={formData.currentChallenge} 
                    onChange={handleInputChange} 
                    placeholder="Select your challenge"
                    options={[
                      'Not getting interview calls',
                      'Lack of practical / industry skills',
                      'Stuck in low-paying job',
                      'No career direction'
                    ]}
                  />

                  <CustomSelect 
                    label="WHY ARE YOU INTERESTED IN THIS PROGRAM? *" 
                    name="interestReason" 
                    value={formData.interestReason} 
                    onChange={handleInputChange} 
                    placeholder="Select the best reason"
                    options={[
                      'I want guaranteed placement support to land my first job',
                      'I need structured mentorship to bridge my skill gaps',
                      'I want real internship experience with top companies',
                      'I\'m looking for a career switch with a higher salary',
                      'I want industry-recognized certification to boost my profile',
                      'I need a clear, guided roadmap to reach my career goals'
                    ]}
                  />

                  <CustomSelect 
                    label="DOMAIN OF INTEREST *" 
                    name="domain" 
                    value={formData.domain} 
                    onChange={handleInputChange} 
                    placeholder="Select a domain"
                    options={[
                      'Software Engineering',
                      'Data Analytics & Business Intelligence',
                      'Digital Marketing & Growth Accelerator'
                    ]}
                  />

                  <div className="adv-input-group">
                    <label>CAREER COMMITMENT LEVEL *</label>
                    <div className="adv-choice-grid">
                      {['100% Committed', 'Very Serious', 'Considering', 'Just Exploring'].map(lvl => (
                        <div key={lvl} className={`adv-choice-item ${formData.commitmentLevel === lvl ? 'selected' : ''}`} onClick={() => setFormData(p => ({...p, commitmentLevel: lvl}))}>
                          <div className="adv-choice-circle"></div>
                          {lvl}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="adv-input-group">
                    <label>READY TO INVEST IN YOUR GROWTH? *</label>
                    <div className="adv-choice-grid">
                      {['Yes, I\'m ready', 'Need more details'].map(ans => (
                        <div key={ans} className={`adv-choice-item ${formData.readyToInvest === ans ? 'selected' : ''}`} onClick={() => setFormData(p => ({...p, readyToInvest: ans}))}>
                          <div className="adv-choice-circle"></div>
                          {ans}
                        </div>
                      ))}
                    </div>
                  </div>

                  <CustomSelect 
                    label="WHEN ARE YOU PLANNING TO START? *" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleInputChange} 
                    placeholder="Select timeline"
                    options={[
                      'Immediately (Within 7 days)',
                      'In 2-4 weeks',
                      'In 1-2 months',
                      'Just exploring for now'
                    ]}
                  />

                  <CustomSelect 
                    label="WHY IS THIS PROGRAM IMPORTANT FOR YOU? *" 
                    name="importanceReason" 
                    value={formData.importanceReason} 
                    onChange={handleInputChange} 
                    placeholder="Select an option"
                    options={[
                      'To secure my future with a stable job',
                      'To gain high-level technical expertise',
                      'To network with industry professionals',
                      'To get an edge over other candidates'
                    ]}
                  />

                  <div className="adv-input-group">
                    <label>PREFERRED TIME TO CONNECT *</label>
                    <div className="adv-choice-grid three-col">
                      {[
                        { val: 'Morning', time: '11am–2pm' },
                        { val: 'Afternoon', time: '3pm–5:30pm' },
                        { val: 'Evening', time: '6pm–8pm' }
                      ].map(item => (
                        <div key={item.val} className={`adv-choice-item ${formData.connectTime === item.val ? 'selected' : ''}`} onClick={() => setFormData(p => ({...p, connectTime: item.val}))}>
                          <div className="adv-choice-circle"></div>
                          <div className="adv-choice-text">
                            <strong>{item.val}</strong>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="adv-input-group adv-captcha-group">
                    <label>SECURITY CHECK: WHAT IS {captcha.a} + {captcha.b}? *</label>
                    <input 
                      type="number" 
                      name="captchaAnswer" 
                      placeholder="Enter the sum" 
                      value={formData.captchaAnswer} 
                      onChange={handleInputChange} 
                      required 
                      className="adv-captcha-input"
                    />
                  </div>

                  <div className="adv-input-group adv-checkbox-group highlight">
                    <input type="checkbox" id="paidAgreement" name="paidAgreement" checked={formData.paidAgreement} onChange={(e) => setFormData(p => ({...p, paidAgreement: e.target.checked}))} required />
                    <label htmlFor="paidAgreement">I understand this is a paid program and I'm ready to invest in my career growth.</label>
                  </div>

                  <div className="adv-form-actions-v2">
                    <button type="submit" className="adv-btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT MY APPLICATION — SECURE MY SEAT'}
                    </button>
                    <button type="button" className="adv-btn-back" onClick={prevStep}>
                      ← BACK TO STEP 1
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const AdvanceForm = () => {
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

export default AdvanceForm;
