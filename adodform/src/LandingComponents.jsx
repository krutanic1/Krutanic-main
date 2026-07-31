import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import EnrollmentForm from './EnrollmentForm';

import SubhraImg from './assets/mentors/Subhra.jpg';
import RudraImg from './assets/mentors/rudra.jpg';
import RohanImg from './assets/alumini/rohan.jpg';
import RajaImg from './assets/alumini/raja.jpg';
import PrabhleenImg from './assets/alumini/prabhleen.jpg';
import Month1Bg from './assets/month1_skill_training.png';
import Month2Bg from './assets/month2_live_internship.png';
import Month3Bg from './assets/month3_placement_support.png';
import HeroBg from './assets/hero_bg.png';

/* --- Data --- */
const PARTNERS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb', 'Spotify', 'Apple', 'Tesla', 'IBM', 'Intel', 'Oracle', 'Cisco'];
const MEDPRO_PARTNERS = ['Apollo Hospitals', 'Fortis Healthcare', 'AIIMS', 'Khaitan & Co', 'Cyril Amarchand', 'Max Healthcare', 'Medanta', 'Tata Memorial', 'Sun Pharma', 'Cipla'];

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
    <section className="adv-hero" style={{ backgroundImage: `url(${HeroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '30px', overflow: 'hidden' }}>
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

        {/* 3-Month Timeline Strip */}
        <div className="adv-hero-timeline">
          <div className="adv-hero-tl-item" style={{ backgroundImage: `url(${Month1Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="adv-hero-tl-overlay" />
            <div className="adv-hero-tl-content">
              <div className="adv-hero-tl-month">MONTH 1</div>
              <div className="adv-hero-tl-title">Skill Training</div>
              <div className="adv-hero-tl-desc">Technical &amp; industry tools</div>
            </div>
          </div>
          <div className="adv-hero-tl-divider" />
          <div className="adv-hero-tl-item" style={{ backgroundImage: `url(${Month2Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="adv-hero-tl-overlay" />
            <div className="adv-hero-tl-content">
              <div className="adv-hero-tl-month">MONTH 2</div>
              <div className="adv-hero-tl-title">Live Internship</div>
              <div className="adv-hero-tl-desc">Real projects with MNC teams</div>
            </div>
          </div>
          <div className="adv-hero-tl-divider" />
          <div className="adv-hero-tl-item" style={{ backgroundImage: `url(${Month3Bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="adv-hero-tl-overlay" />
            <div className="adv-hero-tl-content">
              <div className="adv-hero-tl-month">MONTH 3</div>
              <div className="adv-hero-tl-title">Placement Support</div>
              <div className="adv-hero-tl-desc">Resume, interviews &amp; jobs</div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

const PartnersSection = ({ isMedPro = false }) => {
  const partnersToDisplay = isMedPro ? MEDPRO_PARTNERS : PARTNERS;
  return (
    <section className="adv-partners">
      <p className="adv-partners-title">OUR ALUMNI THRIVE AT TOP TIER FIRMS</p>
      <div className="adv-partners-overflow">
        <div className="adv-partners-track continuous">
          {partnersToDisplay.map((p, index) => <span key={`a-${index}`} className="adv-partner-logo">{p}</span>)}
          {partnersToDisplay.map((p, index) => <span key={`b-${index}`} className="adv-partner-logo">{p}</span>)}
        </div>
      </div>
    </section>
  );
};

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
        {PHASES.map((phase, i) => {
          const bgs = [Month1Bg, Month2Bg, Month3Bg];
          return (
            <div key={i} className="adv-phase-card" style={{ backgroundImage: `url(${bgs[i]})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
              <div className="adv-phase-card-overlay" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="adv-phase-num">0{i+1}</div>
                <div className="adv-phase-month">{phase.month}</div>
                <h3 className="adv-phase-title">{phase.title}</h3>
                <p className="adv-phase-desc">{phase.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button className="adv-btn-primary adv-btn-animated" onClick={scrollToForm}>
          Apply for the 2026 Cohort <span className="adv-arrow">→</span>
        </button>
      </div>
    </div>
  </section>
  );
};

const TargetSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const CapSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#8b5cf6'}}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>;
const BadgeSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#34d399'}}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const MailSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#f472b6'}}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const UserSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#60a5fa'}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>;
const BriefcaseSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#fbbf24'}}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const ToolSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#9ca3af'}}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;

const ProgramPerksSection = () => {
  const PERKS = [
    { icon: <CapSvg />, title: 'Elite Dual-Branded Certification', desc: 'Global validation for your professional profile' },
    { icon: <BadgeSvg />, title: 'Industry-Recognised Credential', desc: 'Trusted by our 500+ premium hiring partners' },
    { icon: <MailSvg />, title: 'Performance-Based LoR', desc: 'Direct endorsements from top 1% industry leaders' },
    { icon: <UserSvg />, title: '1:1 Executive Mentorship', desc: 'Personalized guidance from active tech professionals' },
    { icon: <BriefcaseSvg />, title: '100% Placement Guarantee', desc: 'End-to-end interview scheduling and salary negotiation' },
    { icon: <ToolSvg />, title: 'Enterprise Tech Stack Access', desc: 'Hands-on mastery of tools used by Fortune 500 teams' }
  ];

  return (
    <section className="adv-perks-section">
      <div className="adv-container">
        <div className="adv-perks-container">
          <div className="adv-perks-header">
            <span className="adv-perks-header-icon" style={{display: 'flex', alignItems: 'center'}}><TargetSvg /></span>
            <h2>Everything included in your premium access</h2>
          </div>
          <div className="adv-hero-stats" style={{ margin: '30px 0', width: '100%' }}>
            <AnimatedStat value="500+" label="Hiring Partners" />
            <AnimatedStat value="98%" label="Success Rate" />
            <AnimatedStat value="3.2x" label="Avg Salary Hike" />
            <AnimatedStat value="₹12L" label="Average CTC" />
          </div>
          <div className="adv-perks-grid">
            {PERKS.map((perk, i) => (
              <div key={i} className="adv-perk-card">
                <span className="adv-perk-icon" style={{display: 'inline-flex', alignItems: 'center'}}>{perk.icon}</span>
                <div className="adv-perk-title">{perk.title}</div>
                <div className="adv-perk-desc">{perk.desc}</div>
              </div>
            ))}
          </div>
          <div className="adv-perks-footer">
            A one-time investment unlocks your 3-month transformation — <strong>secure your career for life.</strong>
          </div>
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


const REVIEWS = [
  { name: 'Karan Malhotra', role: 'SDE II, Microsoft', review: 'The curriculum is built exactly for what product companies ask. I struggled with System Design, but the 1:1 mentorship helped me clear the Microsoft loop with ease. The mock interviews were a game-changer.', rating: 5 },
  { name: 'Priya Desai', role: 'Frontend Engineer, Razorpay', review: 'I transitioned from a service-based company to a high-growth fintech. The resume optimization they did got me callbacks from 5 top companies within two weeks. Highly recommend this program.', rating: 5 },
  { name: 'Ankit Verma', role: 'Data Scientist, Walmart', review: 'I had the knowledge but lacked the right projects. The live internship phase gave me actual corporate problems to solve, which became the highlight of my interview at Walmart.', rating: 5 },
  { name: 'Neha Gupta', role: 'Product Analyst, Swiggy', review: 'Their placement assistance is no joke. They literally scheduled my interviews and guided me on how to negotiate my salary. I got a 150% hike thanks to Krutanic.', rating: 5 },
  { name: 'Rohan Iyer', role: 'Backend Dev, Cred', review: 'The intensity of this program is unmatched. You have to put in the work, but if you do, the results are guaranteed. The mentors are actually working at top 1% tech companies.', rating: 4.9 },
  { name: 'Megha Singh', role: 'UI/UX Designer, Zomato', review: 'What I loved most was the completely practical approach. No boring theoretical lectures, just building real things. My portfolio looked incredibly professional after the 3 months.', rating: 5 },
  { name: 'Aditya Patil', role: 'SDE I, Amazon', review: 'I was stuck at 4 LPA for three years. The career switch felt impossible until I joined. The dedicated referrals helped bypass the HR screening entirely.', rating: 5 },
  { name: 'Shruti Sharma', role: 'Data Analyst, Deloitte', review: 'Extremely well-structured program. The mentors give brutal but honest feedback on your assignments, which is exactly what you need to improve to corporate standards.', rating: 5 },
  { name: 'Vikram Joshi', role: 'Full Stack Dev, Paytm', review: 'Best investment I have ever made in my career. The industry tools access gave me hands-on experience with exactly what my current team uses on a daily basis.', rating: 4.8 }
];

const MEDPRO_REVIEWS = [
  { name: 'Dr. Arjun Mehta', role: 'Clinical Psychologist, Apollo', review: 'The MedPro pack gave me the precise corporate psychology framework I needed. I transitioned from a small clinic to a senior corporate role at Apollo within months.', rating: 5 },
  { name: 'Sneha Rao', role: 'Corporate Lawyer, Khaitan & Co', review: 'Law school didn\'t teach me the practical nuances of M&A that this program did. The 1:1 mentorship from industry leaders gave me a massive edge in my interviews.', rating: 5 },
  { name: 'Dr. Vikram Desai', role: 'Senior Physiotherapist, Fortis', review: 'I was struggling to scale my practice. The advanced modules and business insights helped me land a consulting role at Fortis with a 120% hike.', rating: 4.9 },
  { name: 'Riya Sen', role: 'Forensic Expert, Govt Labs', review: 'The practical approach to forensic analysis was incredible. I finally got the hands-on corporate internship experience I needed to clear my govt exams and interviews.', rating: 5 },
  { name: 'Dr. Aarav Kapoor', role: 'Medical Officer, WHO', review: 'The international compliance and health administration modules were exactly what I needed to break into a global organization. The career support is phenomenal.', rating: 5 },
  { name: 'Pooja Nair', role: 'Legal Consultant, Cyril Amarchand', review: 'Krutanic’s mentors actually work in the top firms. The resume building and mock interview rounds helped me bypass standard HR screenings.', rating: 4.8 },
  { name: 'Dr. Ishaan Verma', role: 'Sports Physio, BCCI', review: 'If you want to move into elite sports physiotherapy, this is the course. The networking opportunities alone are worth 10x the price of admission.', rating: 5 },
  { name: 'Ananya Gupta', role: 'Healthcare Admin, Max', review: 'I transitioned from nursing to administration. The MedPro curriculum bridged the exact knowledge gaps I had in healthcare management.', rating: 5 }
];

const DATA_ANALYST_REVIEWS = [
  { name: 'Siddharth Rao', role: 'Data Analyst, Mu Sigma', background: 'Recent Graduate', review: 'Before joining, I had theoretical knowledge but no project experience I could confidently discuss in interviews. The hands-on work with real datasets gave me solid talking points, and that made a huge difference when I interviewed with Mu Sigma.', outcome: 'Cracked Mu Sigma interview', rating: 5, image: '/review_avatars/male_1.png' },
  { name: 'Anjali Desai', role: 'Business Analyst, TCS', background: 'Non-tech Graduate', review: 'As someone from a non-tech background, I was nervous about SQL and Python in the beginning. The step-by-step curriculum and mentor support made the learning curve manageable, and I started feeling genuinely confident with analytics tools.', outcome: 'Mastered SQL & Python', rating: 5, image: '/review_avatars/female_1.png' },
  { name: 'Rahul Sharma', role: 'BI Developer, Accenture', background: 'Working Professional', review: 'The BI modules were one of the strongest parts of the program for me. My capstone project helped me explain my thinking clearly during interviews, especially in discussions around dashboards and business insights.', outcome: 'Cleared technical round', rating: 5, image: '/review_avatars/male_2.png' },
  { name: 'Kavita Menon', role: 'Product Analyst, Flipkart', background: 'Career Switcher', review: 'I was trying to move out of a BPO role but didn’t know how to position myself for analytics jobs. The mock interviews, resume guidance, and project portfolio gave me a much clearer path to make that transition.', outcome: 'Transitioned into analytics', rating: 5, image: '/review_avatars/female_2.png' },
  { name: 'Vikram Singh', role: 'Data Scientist, IBM', background: 'Upskilling', review: 'I already knew some Python, but this program helped me apply it with a more analytical mindset. What stood out was how the mentors pushed us to think in terms of business problems, not just code.', outcome: 'Developed business-first mindset', rating: 5, image: '/review_avatars/male_3.png' },
  { name: 'Neha Patil', role: 'Junior Data Analyst, Capgemini', background: 'Job Seeker', review: 'The mock interviews felt very close to actual hiring rounds. By the time I started interviewing, I was much better prepared to structure my answers, explain my projects, and communicate insights with confidence.', outcome: 'Improved interview performance', rating: 5, image: '/review_avatars/female_3.png' },
  { name: 'Aditya Kumar', role: 'Operations Analyst, Amazon', background: 'Working Professional', review: 'Learning Excel and SQL together was a big advantage for me because I could immediately connect reporting tasks with data analysis. The program helped me build skills that were practical and directly relevant at work.', outcome: 'Built practical skills', rating: 5, image: '/review_avatars/male_4.png' },
  { name: 'Pooja Iyer', role: 'Marketing Analyst, Swiggy', background: 'Career Switcher', review: 'I joined to strengthen my analytics foundation, but I ended up applying what I learned even before completing the course. The campaign analysis projects were especially useful because they felt close to real business scenarios.', outcome: 'Applied skills on the job', rating: 5, image: '/review_avatars/female_4.png' }
];

const ReviewsSection = ({ isMedPro = false, isDataAnalyst = false }) => {
  const reviewsToDisplay = isDataAnalyst ? DATA_ANALYST_REVIEWS : (isMedPro ? MEDPRO_REVIEWS : REVIEWS);
  
  return (
    <section className="adv-reviews">
      <div className="adv-container">
        <div className="adv-reviews-header" style={isDataAnalyst ? { textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' } : {}}>
          {isDataAnalyst && <span style={{ display: 'inline-block', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px', background: 'var(--primary-light, rgba(59, 130, 246, 0.1))', padding: '4px 12px', borderRadius: '20px' }}>Learner Outcomes</span>}
          <h2 className="adv-h2">
            {isDataAnalyst 
              ? 'Real Stories from Learners Who Made the Shift' 
              : 'Real Results from Real Professionals'}
          </h2>
          <p className="adv-reviews-p" style={isDataAnalyst ? { fontSize: '1.1rem', lineHeight: '1.6' } : {}}>
            {isDataAnalyst 
              ? 'Hear from graduates, career switchers, and working professionals who used real projects, mentorship, and placement support to break into analytics roles with more confidence. With limited seats in every cohort, many applicants join early to avoid waiting for the next batch.'
              : 'Read what our alumni have to say about their transformation.'}
          </p>
        </div>
        
        {isDataAnalyst ? (
          <div className="adv-reviews-marquee-container">
            <div className="adv-reviews-marquee">
              {[...reviewsToDisplay, ...reviewsToDisplay].map((r, i) => (
                <div key={i} className="adv-review-card" style={{ flex: '0 0 auto', width: '350px', display: 'flex', flexDirection: 'column', padding: '24px', backgroundColor: 'var(--surface, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', margin: 0, minHeight: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {r.image ? (
                        <img src={r.image} alt={r.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: 0, border: '2px solid #e5e7eb' }} />
                      ) : (
                        <div className="adv-review-avatar" style={{ margin: 0 }}>{r.name.charAt(0)}</div>
                      )}
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)', fontWeight: '600', lineHeight: '1.2' }}>{r.name}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.role}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                     <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '16px', fontWeight: '600', letterSpacing: '0.02em' }}>{r.background}</span>
                     <div style={{ display: 'flex', color: '#fbbf24', letterSpacing: '2px', fontSize: '1rem' }}>
                       {'★★★★★'}
                     </div>
                  </div>
                  <p className="adv-review-text" style={{ margin: 0, flexGrow: 1, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', fontStyle: 'normal' }}>"{r.review}"</p>
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border, #e5e7eb)' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text)' }}>Outcome:</strong> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="adv-reviews-marquee-container">
            <div className="adv-reviews-marquee">
              {[...reviewsToDisplay, ...reviewsToDisplay].map((r, i) => (
                <div key={i} className="adv-review-card">
                  <div className="adv-review-stars" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                    {'★'.repeat(Math.floor(r.rating))}
                    {(r.rating % 1 !== 0) && (
                      <span style={{ position: 'relative', display: 'inline-block', width: '1em' }}>
                        <span style={{ color: 'rgba(255,255,255,0.15)', position: 'absolute', left: 0 }}>★</span>
                        <span style={{ position: 'absolute', left: 0, overflow: 'hidden', width: '50%', color: '#fbbf24' }}>★</span>
                      </span>
                    )}
                  </div>
                  <p className="adv-review-text">"{r.review}"</p>
                  <div className="adv-review-author">
                    <div className="adv-review-avatar">{r.name.charAt(0)}</div>
                    <div className="adv-review-meta">
                      <strong>{r.name}</strong>
                      <span>{r.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const AlertBanner = () => (
  <div className="adv-container" style={{ marginTop: '30px', marginBottom: '-10px', position: 'relative', zIndex: 10 }}>
    <div className="adv-includes-banner">
      <span className="adv-banner-dot"></span>
      High demand alert — 2026 cohort is almost full. Submit your application below to secure your spot.
    </div>
  </div>
);

export {
  HeroSection,
  AlertBanner,
  PartnersSection,
  ComparisonSection,
  RoadmapSection,
  ProgramPerksSection,
  GuaranteeSection,
  ReviewsSection,
  FAQSection,
  PlacementModal
};
