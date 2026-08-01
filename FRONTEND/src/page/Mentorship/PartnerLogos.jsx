import React from 'react';
import { FaArrowRight, FaCheckCircle, FaBriefcase, FaChartLine, FaUserTie, FaShieldAlt, FaStar, FaQuoteLeft } from 'react-icons/fa';
import './PartnerLogos.css';

import amazon    from '../../assets/company logo/amazon.png.png';
import accenture from '../../assets/company logo/Accenture-logo.png';
import deloitte  from '../../assets/company logo/Deloitte_Logo.png';
import ey        from '../../assets/company logo/Ey buildings.svg';
import hsbc      from '../../assets/company logo/HSBC_Logo_2018.png';
import sony      from '../../assets/company logo/Sony_logo.svg.png';
import wipro     from '../../assets/company logo/Wipro_Primary_Logo_Color_RGB.svg';
import tcs       from '../../assets/company logo/tcs.png';
import pwc       from '../../assets/company logo/pwc.png';
import musigma   from '../../assets/company logo/mu sigma.png';

const logos = [amazon, deloitte, ey, hsbc, sony, wipro, tcs, pwc, musigma, accenture];

const proofPoints = [
  { icon: <FaBriefcase />,  value: '500+',  label: 'Hiring Partners',           sub: 'Across tech, finance & consulting' },
  { icon: <FaChartLine />,  value: '12 LPA', label: 'Average Package',          sub: 'Consistent, measurable outcomes' },
  { icon: <FaUserTie />,    value: '1:1',   label: 'Mentor Guidance',            sub: 'Industry practitioners, not instructors' },
  { icon: <FaShieldAlt />,  value: '100%',  label: 'Interview Prep Coverage',   sub: 'Until you land the right offer' },
];

const placements = [
  {
    name: 'Aditya Sharma',
    role: 'Software Engineer · Amazon',
    ctc: '18 LPA',
    domain: 'Full Stack Development',
    quote: 'The structured mock interviews and mentor reviews helped me clear 4 rounds at Amazon in 6 weeks.',
    initials: 'AS',
  },
  {
    name: 'Priya Nair',
    role: 'Data Analyst · Deloitte',
    ctc: '11 LPA',
    domain: 'Data Science & Analytics',
    quote: `Krutanic's placement team stayed with me until I signed my offer letter. No generic advice — just real prep.`,
    initials: 'PN',
  },
];

import sectionBg from '../../assets/co_background.png';

const PartnerLogos = () => (
  <section className="co-section" style={{ backgroundImage: `url(${sectionBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="co-container">

      {/* ── Top Row: Left copy + Right proof panel ── */}
      <div className="co-top-row">

        {/* LEFT */}
        <div className="co-left">
          <span className="co-eyebrow">CAREER OUTCOMES</span>

          <h2 className="co-headline">
            Real mentorship.<br />
            <span className="co-headline-accent">Measurable hiring outcomes.</span>
          </h2>

          <p className="co-body">
            Learn with industry mentors, build portfolio-grade projects, and
            prepare for interviews with structured support designed for serious
            career transitions — from first session to final offer.
          </p>

          <ul className="co-checklist">
            {['Mentor-led learning, not recorded videos', 'Live project reviews & code audits', 'Interview rounds until placement'].map(item => (
              <li key={item}><FaCheckCircle className="co-check-icon" />{item}</li>
            ))}
          </ul>

          <button className="co-cta-btn">
            Apply for the Next Cohort <FaArrowRight className="co-cta-arrow" />
          </button>
        </div>

        {/* RIGHT — proof panel */}
        <div className="co-right">
          <div 
            className="co-proof-panel backdrop-blur-md border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]"
            style={{ backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)' }}
          >
            <div className="co-proof-header">
              <span className="co-proof-label text-white/90">Outcome Snapshot</span>
              <span className="co-proof-badge bg-white/20 text-white border border-white/30">2024 cohort data</span>
            </div>

            <div className="co-proof-grid">
              {proofPoints.map((p, i) => (
                <div className="co-proof-item bg-white/60 hover:bg-white/95 border border-white/60 hover:border-blue-300 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.15)] transition-all duration-300" key={i}>
                  <div className="co-proof-icon bg-blue-600/10 text-blue-600">{p.icon}</div>
                  <div className="co-proof-text">
                    <span className="co-proof-value">{p.value}</span>
                    <span className="co-proof-metric">{p.label}</span>
                    <span className="co-proof-sub">{p.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Logo strip inside proof panel */}
            <div className="co-logo-strip-wrapper">
              <p className="co-logo-strip-label">Hiring from our cohorts</p>
              <div className="co-marquee-track">
                <div className="co-marquee-inner">
                  {/* Duplicated twice for seamless loop */}
                  {[...logos, ...logos].map((logo, i) => (
                    <img key={i} src={logo} alt="partner" className="co-logo-img" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: 2 placement cards ── */}
      <div className="co-bottom-row">
        <div className="co-placements-label">
          <span className="text-slate-400">Recent Placements</span>
          <div className="co-divider-line bg-slate-700/50" />
        </div>

        <div className="co-placements-grid">
          {placements.map((p, i) => (
            <div className="co-placement-card bg-gradient-to-br from-slate-100/95 to-slate-200/90 backdrop-blur-md border border-white/40 hover:border-blue-300 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300" key={i}>
              <FaQuoteLeft className="co-quote-icon text-blue-300" />
              <p className="co-placement-quote text-slate-700">"{p.quote}"</p>
              <div className="co-placement-footer border-t border-slate-300/50">
                <div className="co-avatar">{p.initials}</div>
                <div className="co-placement-info">
                  <span className="co-placement-name">{p.name}</span>
                  <span className="co-placement-role">{p.role}</span>
                  <span className="co-placement-domain">{p.domain}</span>
                </div>
                <div className="co-placement-ctc">
                  <span className="co-ctc-value">{p.ctc}</span>
                  <span className="co-ctc-label">Offer CTC</span>
                </div>
              </div>
            </div>
          ))}

          {/* Interview Prep Callout */}
          <div className="co-prep-card bg-gradient-to-b from-slate-900/90 to-slate-950/95 backdrop-blur-lg border border-blue-400/20 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(56,189,248,0.15)]">
            <div className="co-prep-icon-wrap bg-blue-500/20 text-blue-400"><FaShieldAlt /></div>
            <h4 className="co-prep-title text-white">Interview Prep Until Placement</h4>
            <p className="co-prep-body text-slate-300">
              Mock interview rounds, live feedback sessions, and resume reviews — continued until you receive and accept an offer.
            </p>
            <div className="co-prep-stats">
              <div><span className="co-prep-stat-val">4.8★</span><span className="co-prep-stat-label">Mentor rating</span></div>
              <div><span className="co-prep-stat-val">92%</span><span className="co-prep-stat-label">Placement rate</span></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
);

export default PartnerLogos;
