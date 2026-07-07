import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './AdvanceForm.css';
import SubhraImg from '../assets/mentors/Subhra.jpg';
import RudraImg from '../assets/mentors/rudra.jpg';
import RohanImg from '../assets/alumini/rohan.jpg';
import RajaImg from '../assets/alumini/raja.jpg';
import PrabhleenImg from '../assets/alumini/prabhleen.jpg';
import BirendraImg from '../assets/alumini/birendra.jpg';
import ManishImg from '../assets/alumini/manish.jpg';
import MithunImg from '../assets/alumini/mithun.jpg';

/* --- Data --- */
const PARTNERS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb'];

/* --- Reviews (from adodform) --- */
const REVIEWS = [
  { name: 'Karan Malhotra', role: 'SDE II, Microsoft', review: 'The curriculum is built exactly for what product companies ask. I struggled with System Design, but the 1:1 mentorship helped me clear the Microsoft loop with ease. The mock interviews were a game-changer.', rating: 5, photo: RohanImg },
  { name: 'Priya Desai', role: 'Frontend Engineer, Razorpay', review: 'I transitioned from a service-based company to a high-growth fintech. The resume optimization they did got me callbacks from 5 top companies within two weeks. Highly recommend this program.', rating: 5, photo: PrabhleenImg },
  { name: 'Ankit Verma', role: 'Data Scientist, Walmart', review: 'I had the knowledge but lacked the right projects. The live internship phase gave me actual corporate problems to solve, which became the highlight of my interview at Walmart.', rating: 5, photo: RajaImg },
  { name: 'Neha Gupta', role: 'Product Analyst, Swiggy', review: 'Their placement assistance is no joke. They literally scheduled my interviews and guided me on how to negotiate my salary. I got a 150% hike thanks to Krutanic.', rating: 5, photo: ManishImg },
  { name: 'Rohan Iyer', role: 'Backend Dev, Cred', review: 'The intensity of this program is unmatched. You have to put in the work, but if you do, the results are guaranteed. The mentors are actually working at top 1% tech companies.', rating: 4.9, photo: BirendraImg },
  { name: 'Megha Singh', role: 'UI/UX Designer, Zomato', review: 'What I loved most was the completely practical approach. No boring theoretical lectures, just building real things. My portfolio looked incredibly professional after the 3 months.', rating: 5, photo: MithunImg },
  { name: 'Aditya Patil', role: 'SDE I, Amazon', review: 'I was stuck at 4 LPA for three years. The career switch felt impossible until I joined. The dedicated referrals helped bypass the HR screening entirely.', rating: 5, photo: RudraImg },
  { name: 'Shruti Sharma', role: 'Data Analyst, Deloitte', review: 'Extremely well-structured program. The mentors give brutal but honest feedback on your assignments, which is exactly what you need to improve to corporate standards.', rating: 5, photo: SubhraImg },
  { name: 'Vikram Joshi', role: 'Full Stack Dev, Paytm', review: 'Best investment I have ever made in my career. The industry tools access gave me hands-on experience with exactly what my current team uses on a daily basis.', rating: 4.8, photo: null },
];

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

/* ─────────────────────────────────────────────
   REVIEWS SECTION
───────────────────────────────────────────── */
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="rev-stars">
      {'★'.repeat(full)}
      {half && (
        <span className="rev-star-half">
          <span className="rev-star-bg">★</span>
          <span className="rev-star-fill">★</span>
        </span>
      )}
    </div>
  );
};

const ReviewsSection = () => (
  <section className="adv-reviews">
    <div className="adv-container">
      <div className="adv-reviews-header">
        <h2 className="adv-h2">Real Results from Real Professionals</h2>
        <p className="adv-reviews-p">What our alumni say about their transformation with Krutanic Advance.</p>
      </div>
    </div>
    {/* Marquee 1 — left to right */}
    <div className="adv-reviews-marquee-container">
      <div className="adv-reviews-marquee">
        {[...REVIEWS, ...REVIEWS].map((r, i) => (
          <div key={i} className="adv-review-card">
            <StarRating rating={r.rating} />
            <p className="adv-review-text">"{r.review}"</p>
            <div className="adv-review-author">
              {r.photo
                ? <img src={r.photo} alt={r.name} className="adv-review-avatar-img" />
                : <div className="adv-review-avatar">{r.name.charAt(0)}</div>
              }
              <div className="adv-review-meta">
                <strong>{r.name}</strong>
                <span>{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Marquee 2 — right to left (offset) */}
    <div className="adv-reviews-marquee-container">
      <div className="adv-reviews-marquee adv-reviews-marquee-reverse">
        {[...REVIEWS.slice(3), ...REVIEWS, ...REVIEWS.slice(0, 3)].map((r, i) => (
          <div key={i} className="adv-review-card">
            <StarRating rating={r.rating} />
            <p className="adv-review-text">"{r.review}"</p>
            <div className="adv-review-author">
              {r.photo
                ? <img src={r.photo} alt={r.name} className="adv-review-avatar-img" />
                : <div className="adv-review-avatar">{r.name.charAt(0)}</div>
              }
              <div className="adv-review-meta">
                <strong>{r.name}</strong>
                <span>{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FOMO HOOK BAR — above the form
───────────────────────────────────────────── */
const TOTAL_SEATS = 30;
const SEATS_LEFT = 7;
const COHORT_DEADLINE = (() => {
  const key = 'krutanic_adv_deadline_1day';
  const stored = localStorage.getItem(key);
  if (stored) return parseInt(stored, 10);
  // Deadline: 1 day from first visit
  const d = Date.now() + 1 * 24 * 60 * 60 * 1000;
  localStorage.setItem(key, String(d));
  return d;
})();

const TICKER_MESSAGES = [
  'Rohan from Pune just applied',
  '23 people are viewing this page right now',
  'Sneha from Bangalore just applied',
  '4 applicants joined in the last hour',
  'Amit from Delhi just submitted his application',
  '18 people are viewing this page right now',
  'Priya from Hyderabad just applied',
  'This cohort is 77% full',
];

const useFomoCountdown = () => {
  const calc = () => {
    const diff = COHORT_DEADLINE - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const FomoBanner = () => {
  const { d, h, m, s } = useFomoCountdown();
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const filled = TOTAL_SEATS - SEATS_LEFT;
  const pct = (filled / TOTAL_SEATS) * 100;

  useEffect(() => {
    const iv = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER_MESSAGES.length);
        setTickerVisible(true);
      }, 350);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="fomo-banner">
      {/* Seat scarcity bar */}
      <div className="fomo-seats-row">
        <div className="fomo-seats-label">
          <span className="fomo-pulse-dot"></span>
          <strong>Super 30 Cohort — Nov 2026</strong>
          <span className="fomo-seats-left">— {SEATS_LEFT} SEATS LEFT</span>
        </div>
        <div className="fomo-seats-bar-wrap">
          <div className="fomo-seats-bar">
            <div className="fomo-seats-fill" style={{ width: `${pct}%` }}></div>
          </div>
          <span className="fomo-seats-count">{filled}/{TOTAL_SEATS} seats taken</span>
        </div>
      </div>

      {/* Countdown timer */}
      <div className="fomo-countdown-row">
        <span className="fomo-countdown-label">Applications close in:</span>
        <div className="fomo-countdown">
          <div className="fomo-cd-unit"><span>{pad(d)}</span><small>Days</small></div>
          <div className="fomo-cd-sep">:</div>
          <div className="fomo-cd-unit"><span>{pad(h)}</span><small>Hrs</small></div>
          <div className="fomo-cd-sep">:</div>
          <div className="fomo-cd-unit"><span>{pad(m)}</span><small>Min</small></div>
          <div className="fomo-cd-sep">:</div>
          <div className="fomo-cd-unit"><span>{pad(s)}</span><small>Sec</small></div>
        </div>
      </div>

      {/* Activity ticker */}
      <div className={`fomo-ticker ${tickerVisible ? 'visible' : ''}`}>
        {TICKER_MESSAGES[tickerIdx]}
      </div>

      {/* Micro-copy */}
      <p className="fomo-micro-copy">
        Seats are allocated <strong>first-come, first-evaluated</strong>. Late applicants are waitlisted for the Feb 2027 cohort.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ANIMATED SVG ICONS — Duolingo-style
───────────────────────────────────────────── */
const SvgSalary = () => (
  <svg className="gate-svg gate-svg-salary" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Coin stack base */}
    <ellipse cx="32" cy="50" rx="18" ry="6" fill="#fde68a" />
    <ellipse cx="32" cy="44" rx="18" ry="6" fill="#fbbf24" />
    <ellipse cx="32" cy="38" rx="18" ry="6" fill="#f59e0b" />
    <ellipse cx="32" cy="32" rx="18" ry="6" fill="#fbbf24" />
    {/* Coin rim */}
    <rect x="14" y="32" width="36" height="12" fill="#fbbf24" />
    <rect x="14" y="38" width="36" height="6" fill="#f59e0b" />
    {/* Dollar sign */}
    <text x="32" y="42" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400e" fontFamily="Arial">$</text>
    {/* Upward arrow */}
    <path d="M44 18 L50 10 L56 18" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="gate-svg-arrow" />
    <line x1="50" y1="10" x2="50" y2="28" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="gate-svg-arrow" />
  </svg>
);

const SvgNoResponse = () => (
  <svg className="gate-svg gate-svg-mail" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Envelope body */}
    <rect x="8" y="18" width="48" height="34" rx="4" fill="#6366f1" />
    <path d="M8 22 L32 38 L56 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* X mark — no response */}
    <circle cx="48" cy="16" r="10" fill="#ef4444" />
    <line x1="44" y1="12" x2="52" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="12" x2="44" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SvgSkillsGap = () => (
  <svg className="gate-svg gate-svg-gap" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bar chart */}
    <rect x="8" y="36" width="10" height="20" rx="2" fill="#a5b4fc" />
    <rect x="22" y="28" width="10" height="28" rx="2" fill="#818cf8" />
    <rect x="36" y="20" width="10" height="36" rx="2" fill="#6366f1" />
    {/* Gap indicator line — falling */}
    <path d="M8 30 L36 44" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" className="gate-svg-dash" />
    {/* Target line */}
    <path d="M36 14 L56 14" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="56" cy="14" r="3" fill="#10b981" />
    {/* Gap arrow */}
    <path d="M50 20 L50 40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
    <path d="M47 38 L50 44 L53 38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SvgCompass = () => (
  <svg className="gate-svg gate-svg-compass" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Compass circle */}
    <circle cx="32" cy="32" r="24" fill="#0f172a" stroke="#4f46e5" strokeWidth="3" />
    <circle cx="32" cy="32" r="18" fill="#1e293b" />
    {/* Cardinal markers */}
    <text x="32" y="16" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="Arial" fontWeight="bold">N</text>
    <text x="32" y="53" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="Arial" fontWeight="bold">S</text>
    <text x="13" y="35" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="Arial" fontWeight="bold">W</text>
    <text x="51" y="35" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="Arial" fontWeight="bold">E</text>
    {/* Compass needle — animated rotation */}
    <g className="gate-svg-needle" style={{ transformOrigin: '32px 32px' }}>
      <polygon points="32,18 30,32 32,36 34,32" fill="#ef4444" />
      <polygon points="32,46 30,32 32,28 34,32" fill="#e2e8f0" />
    </g>
    {/* Center dot */}
    <circle cx="32" cy="32" r="3" fill="#4f46e5" />
  </svg>
);

const GATE_SVG_MAP = [SvgSalary, SvgNoResponse, SvgSkillsGap, SvgCompass];

/* ─────────────────────────────────────────────
   COMMITMENT GATE — Step 1
───────────────────────────────────────────── */
const GATE_OPTIONS = [
  { label: 'Stuck at low salary despite experience' },
  { label: 'No response from top companies' },
  { label: 'Skills gap vs job market' },
  { label: 'Ready to switch but no guidance' },
];

const CommitmentGate = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const pick = (idx) => {
    setSelected(idx);
    setTimeout(() => onSelect(GATE_OPTIONS[idx].label), 600);
  };

  return (
    <div className="fomo-gate">
      <div className="fomo-gate-header">
        <span className="fomo-step-badge">STEP 1 OF 4</span>
        <h3 className="fomo-gate-q">What's holding your career back right now?</h3>
        <p className="fomo-gate-sub">Tap one — your answer helps us match you to the right track.</p>
      </div>
      <div className="fomo-gate-grid">
        {GATE_OPTIONS.map((opt, idx) => {
          const SvgIcon = GATE_SVG_MAP[idx];
          return (
            <button
              key={idx}
              type="button"
              className={`fomo-gate-card ${
                selected === idx ? 'selected' : selected !== null ? 'dimmed' : ''
              }`}
              onClick={() => pick(idx)}
            >
              <span className="fomo-gate-icon"><SvgIcon /></span>
              <span className="fomo-gate-text">{opt.label}</span>
              {selected === idx && <span className="fomo-gate-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FOMO MULTI-STEP ENROLLMENT FORM
───────────────────────────────────────────── */
const SvgDataScience = () => (
  <svg className="domain-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#eef2ff" />
    <circle cx="24" cy="14" r="5" fill="#6366f1" className="ds-node" />
    <circle cx="14" cy="30" r="5" fill="#8b5cf6" className="ds-node" />
    <circle cx="34" cy="30" r="5" fill="#4f46e5" className="ds-node" />
    <line x1="24" y1="19" x2="14" y2="25" stroke="#a5b4fc" strokeWidth="2" />
    <line x1="24" y1="19" x2="34" y2="25" stroke="#a5b4fc" strokeWidth="2" />
    <line x1="19" y1="30" x2="29" y2="30" stroke="#a5b4fc" strokeWidth="2" />
  </svg>
);

const SvgAnalytics = () => (
  <svg className="domain-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#ecfdf5" />
    <rect x="10" y="30" width="6" height="12" rx="2" fill="#34d399" className="da-bar" />
    <rect x="19" y="22" width="6" height="20" rx="2" fill="#10b981" className="da-bar" />
    <rect x="28" y="16" width="6" height="26" rx="2" fill="#059669" className="da-bar" />
    <path d="M10 28 L19 20 L28 14 L38 10" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" className="da-line" />
    <circle cx="38" cy="10" r="3" fill="#fbbf24" />
  </svg>
);

const SvgMarketing = () => (
  <svg className="domain-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#fff7ed" />
    {/* Megaphone */}
    <path d="M12 20 L12 28 L18 28 L26 34 L26 14 L18 20 Z" fill="#f97316" />
    <rect x="12" y="20" width="6" height="8" rx="1" fill="#ea580c" />
    {/* Signal waves */}
    <path d="M29 18 Q33 21 33 24 Q33 27 29 30" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" className="dm-wave" />
    <path d="M32 15 Q38 19 38 24 Q38 29 32 33" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" fill="none" className="dm-wave" />
  </svg>
);

const DOMAIN_SVG_MAP = [SvgDataScience, SvgAnalytics, SvgMarketing];

const DOMAIN_OPTIONS = [
  { label: 'Data Science' },
  { label: 'Data Analytics & Business Intelligence' },
  { label: 'Digital Marketing & Growth Accelerator' },
];

const LS_KEY = 'krutanic_adv_form_v2';

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const formatCTC = (val) => {
  if (val >= 100) return `₹${val}L+`;
  return `₹${val}L`;
};

const EnrollmentForm = () => {
  const saved = loadSaved();
  const [step, setStep] = useState(0); // Always start at 0 (Commitment Gate) on refresh
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicantNum, setApplicantNum] = useState(0);
  const [sameWhatsapp, setSameWhatsapp] = useState(false);

  const [formData, setFormData] = useState({
    challenge: saved?.challenge || '',
    fullName: saved?.fullName || '',
    email: saved?.email || '',
    contactNumber: saved?.contactNumber || '',
    whatsappNumber: saved?.whatsappNumber || '',
    currentSituation: saved?.currentSituation || '',
    currentCtc: saved?.currentCtc || 6,
    targetCtc: saved?.targetCtc || 16,
    domain: saved?.domain || '',
    preferredLanguages: saved?.preferredLanguages || [],
    commitmentLevel: saved?.commitmentLevel || '',
    readyToInvest: saved?.readyToInvest || '',
    connectTime: saved?.connectTime || '',
    paidAgreement: false,
    primaryGoal: '',
    currentChallenge: '',
    interestReason: '',
    startTime: '',
    importanceReason: '',
    website: '',        // Honeypot
    captchaAnswer: '',
  });

  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });

  useEffect(() => { generateCaptcha(); }, [step]);

  // Auto-save form data to localStorage (do not persist step index)
  useEffect(() => {
    const { paidAgreement, website, captchaAnswer, ...saveable } = formData;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(saveable));
    } catch {}
  }, [formData]);

  const generateCaptcha = () => {
    setCaptcha({ a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1 });
  };

  const languageOptions = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'contactNumber' && sameWhatsapp) next.whatsappNumber = value;
      return next;
    });
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang)
        ? prev.preferredLanguages.filter(l => l !== lang)
        : [...prev.preferredLanguages, lang]
    }));
  };

  const handleGateSelect = (challengeLabel) => {
    setFormData(prev => ({
      ...prev,
      challenge: challengeLabel,
      currentChallenge: challengeLabel,
    }));
    setStep(1);
  };

  const progressPct = [0, 25, 60, 85, 100][Math.min(step, 4)];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.website) {
      setSubmitted(true);
      return;
    }

    if (parseInt(formData.captchaAnswer) !== (captcha.a + captcha.b)) {
      toast.error(`Incorrect answer: ${captcha.a} + ${captcha.b} ≠ ${formData.captchaAnswer}`);
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
      params.append('primaryGoal', formData.challenge);
      params.append('currentChallenge', formData.currentChallenge);
      params.append('interestReason', formData.interestReason || 'N/A');
      params.append('domain', formData.domain);
      params.append('commitmentLevel', formData.commitmentLevel);
      params.append('readyToInvest', formData.readyToInvest);
      params.append('startTime', formData.startTime || 'Immediately');
      params.append('importanceReason', formData.importanceReason || 'N/A');
      params.append('connectTime', formData.connectTime);
      params.append('currentCTC', `${formData.currentCtc}L`);
      params.append('targetCTC', `${formData.targetCtc}L`);
      params.append('paidAgreement', formData.paidAgreement ? 'Yes' : 'No');
      params.append('source', 'Krutanic Advance Form v2 FOMO');

      await fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

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

      // Generate believable applicant number (session-stable)
      const base = 1847;
      const n = base + ((Date.now() >> 4) % 53);
      setApplicantNum(n);
      localStorage.removeItem(LS_KEY);
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  /* ── Confirmation Screen ── */
  if (submitted) {
    return (
      <section className="adv-form-section" id="enrollment-form">
        <FomoBanner />
        <div className="fomo-success">
          <div className="fomo-success-num">#{applicantNum || 1894}</div>
          <div className="fomo-success-icon">✓</div>
          <h3 className="fomo-success-h3">Seat Secured — Application Received</h3>
          <p className="fomo-success-msg">
            You are applicant <strong>#{applicantNum || 1894}</strong> for the Nov 2026 Cohort.<br />
            Your evaluation call will be scheduled within <strong>24 hours</strong>.
          </p>
          <div className="fomo-success-tags">
            <span>✓ Position locked</span>
            <span>✓ Evaluation batch: This week</span>
            <span>✓ Response within 24 hrs</span>
          </div>
        </div>
      </section>
    );
  }

  const gapLakhs = Math.max(0, formData.targetCtc - formData.currentCtc);
  const avgHike = (formData.targetCtc / Math.max(1, formData.currentCtc)).toFixed(1);

  return (
    <section className="adv-form-section" id="enrollment-form">
      {/* Pre-form FOMO hook bar — always visible */}
      <FomoBanner />

      <div className="adv-container">
        {/* Multi-step progress bar */}
        {step > 0 && (
          <div className="fomo-progress-wrap">
            <div className="fomo-progress-bar-bg">
              <div className="fomo-progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <p className="fomo-progress-label">
              {step === 1 && '25% — Profile details'}
              {step === 2 && '60% — Almost qualified!'}
              {step === 3 && '85% — Final step — you\'re almost in!'}
            </p>
          </div>
        )}

        <div className="adv-form-wrapper fomo-form-wrapper">
          {/* Sidebar — only shown from step 1+ */}
          {step > 0 && (
            <div className="adv-form-sidebar fomo-sidebar">
              <h3>The Super 30 Cohort</h3>
              <p>We select candidates based on ambition, clarity of goals, and readiness to execute.</p>
              <div className="adv-form-sidebar-perks">
                <div className="adv-perk">✓ 100% Placement Assistance</div>
                <div className="adv-perk">✓ 1:1 Industry Mentorship</div>
                <div className="adv-perk">✓ Corporate Internship</div>
                <div className="adv-perk">✓ 15 Interview Guarantee</div>
              </div>
              <div className="fomo-sidebar-warn">
                <span className="fomo-pulse-dot fomo-pulse-red"></span>
                <span>{SEATS_LEFT} seats remaining for Nov 2026</span>
              </div>
            </div>
          )}

          <div className={`adv-form-content ${step === 0 ? 'fomo-full-width' : ''}`}>
            {/* STEP 0: Commitment Gate */}
            {step === 0 && (
              <CommitmentGate onSelect={handleGateSelect} />
            )}

            {/* Honeypot — hidden */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="website" tabIndex="-1" autoComplete="off" value={formData.website} onChange={handleInputChange} />
            </div>

            {/* STEP 1: Profile */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="fomo-step-header">
                  <span className="fomo-step-badge">STEP 2 OF 4</span>
                  <h3 className="fomo-step-h3">Your Profile</h3>
                </div>
                <div className="adv-form-step">
                  <div className="adv-input-group">
                    <label>Full Professional Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="e.g. Arjun Mehta" />
                  </div>
                  <div className="adv-input-group">
                    <label>Primary Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" />
                  </div>
                  <div className="adv-input-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required placeholder="+91 98765 43210" />
                  </div>
                  <div className="fomo-whatsapp-row">
                    <div className="adv-input-group" style={{ flex: 1 }}>
                      <label>WhatsApp Number</label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={sameWhatsapp ? formData.contactNumber : formData.whatsappNumber}
                        onChange={handleInputChange}
                        required
                        disabled={sameWhatsapp}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <label className="fomo-same-toggle">
                      <input
                        type="checkbox"
                        checked={sameWhatsapp}
                        onChange={e => {
                          setSameWhatsapp(e.target.checked);
                          if (e.target.checked) setFormData(p => ({ ...p, whatsappNumber: p.contactNumber }));
                        }}
                      />
                      <span>Same as call number</span>
                    </label>
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
                  <button type="submit" className="adv-btn-primary adv-btn-full fomo-btn-next">
                    Continue — Goal Calibration <span>→</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Goal Calibration */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div className="fomo-step-header">
                  <span className="fomo-step-badge">STEP 3 OF 4</span>
                  <h3 className="fomo-step-h3">Goal Calibration — Personalized Assessment</h3>
                </div>
                <div className="adv-form-step">
                  {/* CTC Sliders */}
                  <div className="adv-input-group">
                    <label>Current CTC (Annual)</label>
                    <div className="fomo-slider-wrap">
                      <input
                        type="range" min="1" max="30" step="0.5"
                        value={formData.currentCtc}
                        onChange={e => setFormData(p => ({ ...p, currentCtc: parseFloat(e.target.value) }))}
                        className="fomo-slider"
                      />
                      <div className="fomo-slider-val">{formatCTC(formData.currentCtc)}</div>
                    </div>
                  </div>
                  <div className="adv-input-group">
                    <label>Target CTC (Annual)</label>
                    <div className="fomo-slider-wrap">
                      <input
                        type="range" min="5" max="100" step="0.5"
                        value={formData.targetCtc}
                        onChange={e => setFormData(p => ({ ...p, targetCtc: parseFloat(e.target.value) }))}
                        className="fomo-slider"
                      />
                      <div className="fomo-slider-val fomo-slider-val-target">{formatCTC(formData.targetCtc)}</div>
                    </div>
                  </div>
                  {/* Live gap badge */}
                  <div className="fomo-gap-badge">
                    <div className="fomo-gap-left">
                      <span className="fomo-gap-label">Your target salary gap</span>
                      <strong className="fomo-gap-value">₹{gapLakhs.toFixed(1)}L</strong>
                    </div>
                    <div className="fomo-gap-divider"></div>
                    <div className="fomo-gap-right">
                      <span className="fomo-gap-label">Our avg hike for this profile</span>
                      <strong className="fomo-gap-hike">{avgHike}x &uarr;</strong>
                    </div>
                  </div>

                  {/* Domain tappable cards */}
                  <div className="adv-input-group">
                    <label>DOMAIN OF INTEREST *</label>
                    <div className="fomo-domain-grid">
                      {DOMAIN_OPTIONS.map((opt, idx) => {
                          const DomSvg = DOMAIN_SVG_MAP[idx];
                          return (
                            <button
                              type="button"
                              key={idx}
                              className={`fomo-domain-card ${formData.domain === opt.label ? 'selected' : ''}`}
                              onClick={() => setFormData(p => ({ ...p, domain: opt.label }))}
                            >
                              <span className="fomo-domain-icon"><DomSvg /></span>
                              <span className="fomo-domain-label">{opt.label}</span>
                              {formData.domain === opt.label && <span className="fomo-domain-check">✓</span>}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Commitment level */}
                  <div className="adv-input-group">
                    <label>CAREER COMMITMENT LEVEL *</label>
                    <div className="adv-choice-grid">
                      {['100% Committed', 'Very Serious', 'Considering', 'Just Exploring'].map(lvl => (
                        <div key={lvl} className={`adv-choice-item ${formData.commitmentLevel === lvl ? 'selected' : ''}`} onClick={() => setFormData(p => ({ ...p, commitmentLevel: lvl }))}>
                          <div className="adv-choice-circle"></div>
                          {lvl}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred connect time */}
                  <div className="adv-input-group">
                    <label>PREFERRED TIME TO CONNECT *</label>
                    <div className="adv-choice-grid three-col">
                      {[
                        { val: 'Morning', time: '11am–2pm' },
                        { val: 'Afternoon', time: '3pm–5:30pm' },
                        { val: 'Evening', time: '6pm–8pm' }
                      ].map(item => (
                        <div key={item.val} className={`adv-choice-item ${formData.connectTime === item.val ? 'selected' : ''}`} onClick={() => setFormData(p => ({ ...p, connectTime: item.val }))}>
                          <div className="adv-choice-circle"></div>
                          <div className="adv-choice-text">
                            <strong>{item.val}</strong>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Language chips */}
                  <div className="adv-input-group">
                    <label>PREFERRED COMMUNICATION LANGUAGE *</label>
                    <div className="adv-chips">
                      {languageOptions.map(lang => (
                        <span key={lang} className={`adv-chip ${formData.preferredLanguages.includes(lang) ? 'selected' : ''}`} onClick={() => handleLanguageToggle(lang)}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="adv-form-actions-v2">
                    <button type="submit" className="adv-btn-primary adv-btn-full fomo-btn-next">
                      Continue — Final Step <span>→</span>
                    </button>
                    <button type="button" className="adv-btn-back" onClick={() => setStep(1)}>← Back</button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: FOMO Close + Submit */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <div className="fomo-step-header fomo-close-header">
                  <span className="fomo-step-badge">STEP 4 OF 4 — FINAL</span>
                  <h3 className="fomo-close-h3">You're one step from securing your evaluation slot.</h3>
                  <p className="fomo-close-sub">
                    Slots are reviewed in the order received. Submitting now <strong>locks your place</strong> in this week's evaluation batch.
                  </p>
                </div>

                <div className="adv-form-step">
                  {/* Ready to invest */}
                  <div className="adv-input-group">
                    <label>READY TO INVEST IN YOUR GROWTH? *</label>
                    <div className="adv-choice-grid">
                      {['Yes, I\'m ready', 'Need more details'].map(ans => (
                        <div key={ans} className={`adv-choice-item ${formData.readyToInvest === ans ? 'selected' : ''}`} onClick={() => setFormData(p => ({ ...p, readyToInvest: ans }))}>
                          <div className="adv-choice-circle"></div>
                          {ans}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Captcha */}
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

                  {/* Paid agreement */}
                  <div className="adv-input-group adv-checkbox-group highlight">
                    <input type="checkbox" id="paidAgreement" name="paidAgreement" checked={formData.paidAgreement} onChange={e => setFormData(p => ({ ...p, paidAgreement: e.target.checked }))} required />
                    <label htmlFor="paidAgreement">I understand this is a paid program and I'm ready to invest in my career growth.</label>
                  </div>

                  {/* FOMO CTA */}
                  <div className="fomo-cta-wrap">
                    <button type="submit" className="fomo-cta-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><span className="fomo-spinner"></span> Securing your slot...</>
                      ) : (
                        <>Secure My Seat <span className="fomo-cta-arrow">→</span></>
                      )}
                    </button>
                    <p className="fomo-cta-warning">
                      ⚠ <strong>4 other applicants</strong> are completing this form right now for the same cohort.
                    </p>
                    <p className="fomo-cta-waitlist">
                      Late applicants are automatically waitlisted for Feb 2027.
                    </p>
                  </div>

                  <button type="button" className="adv-btn-back" onClick={() => setStep(2)}>← Back</button>
                </div>
              </form>
            )}
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
      <ReviewsSection />
      <EnrollmentForm />

      {showModal && <PlacementModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AdvanceForm;
