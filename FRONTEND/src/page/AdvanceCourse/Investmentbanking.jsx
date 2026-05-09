import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  TrendingUp, 
  Award, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  Zap, 
  Target, 
  Search, 
  PieChart, 
  LineChart, 
  BarChart4, 
  Globe,
  Calculator,
  GanttChart,
  Landmark,
  Building2,
  FileSpreadsheet,
  Wallet,
  PhoneCall,
  UserCheck,
  Video,
  FileText,
  Rocket,
  Users
} from "lucide-react";

import posterImage from "../../assets/Advanced Course Images/Investment banking/INB.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";

import TopOnePercent from "../../Components/TopOnePercent";
import CareerSupport from "../../Components/CareerSupport";
import ProgramCohorts from "./Components/ProgramCohorts";
import AdvanceBanner from "./Components/AdvanceBanner";

import DownloadBrochureButton from "./Components/DownloadBrochureButton";
import CountdownTimer from "./Components/CountdownTimer";
import ibBrochure from "../../../krutanic/Investment Banking Advanced Program.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Portfolio Projects", value: "12+ Live Cases" },
  { label: "Avg. Salary Range", value: "10-22 LPA" },
  { label: "Hiring Partners", value: "500+" },
];

const audience = [
  { title: "Commerce & Finance Graduates", desc: "Bridge the gap between theoretical accounting and high-stakes Wall Street deal execution.", icon: <Landmark size={20} /> },
  { title: "Aspiring Analysts", desc: "Master the exact modeling and valuation frameworks used by top-tier global banks and PE firms.", icon: <Calculator size={20} /> },
  { title: "Working Professionals", desc: "Transition from core accounting or operations into high-growth front-office banking roles.", icon: <TrendingUp size={20} /> },
  { title: "MBA Aspirants", desc: "Gain an unfair advantage in placements with deep technical modeling and transaction expertise.", icon: <Award size={20} /> },
  { title: "Entrepreneurs", desc: "Understand capital raising, term sheets, and exit strategies to scale and fund your business.", icon: <Wallet size={20} /> },
  { title: "CA/CFA Candidates", desc: "Complement your professional degree with practical, project-based investment banking depth.", icon: <UserCheck size={20} /> }
];

const marketOpportunity = [
  { title: "Deal Centrality", desc: "Banking analysts are the engine of global capital movement, mergers, and institutional growth.", icon: <Building2 size={24} /> },
  { title: "Analytical Rigor", desc: "The skills gained in IB modeling are high-value and transferable across all elite finance sectors.", icon: <FileSpreadsheet size={24} /> },
  { title: "Leadership Path", desc: "A fast-track career path leading to Director, VP, and C-Suite financial leadership roles.", icon: <Rocket size={24} /> }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Banking Foundations", topics: "Structure, functions, capital raising, markets.", details: "Understand the lifecycle of a deal and the role of various desks in a global investment bank." },
  { weeks: "Weeks 3-4", title: "Valuation Frameworks", topics: "DCF, Comps, Precedents, LBO concepts.", details: "Learn the core methodologies used to price companies and justify transaction premiums." },
  { weeks: "Weeks 5-6", title: "Capital Markets", topics: "IPOs, Underwriting, Book building, Debt pricing.", details: "Master the mechanics of public offerings and how companies access institutional capital." },
  { weeks: "Weeks 7-9", title: "Advanced M&A Dynamics", topics: "Due diligence, deal structuring, integration planning.", details: "Navigate the complex workflows of mergersÃ¢â‚¬â€ from initial bid to final integration logic." },
  { weeks: "Weeks 10-12", title: "Financial Modeling", topics: "3-Statement models, Scenario analysis, Forecasting.", details: "Build production-grade Excel models that can withstand the rigors of executive review." },
  { weeks: "Weeks 13-14", title: "Governance & Ethics", topics: "Compliance, insider trading, conflict management.", details: "Learn the regulatory guardrails and high ethical standards required in high-stakes banking." },
  { weeks: "Weeks 15-16", title: "PE & Venture Capital", topics: "Fund structures, term sheets, exit strategies.", details: "Understand the private investment lifecycle from deal sourcing to multi-billion dollar exits." },
  { weeks: "Weeks 17-20", title: "Capstone Deal Memo", topics: "Live case, Financial model, Investment deck.", details: "Produce a professional investment recommendation for a real-world transaction scenario." },
  { weeks: "Weeks 21-24", title: "Interview Engineering", topics: "Technical drills, Mock cases, Resume polishing.", details: "Intensive preparation focused on cracking the most competitive banking and finance interviews." }
];

const portfolioProjects = [
  { title: "DCF Valuation Model", obs: "5-year forecast and terminal value calculation for a tech unicorn.", skill: "Valuation Rigor" },
  { title: "M&A Deal Memo", obs: "Strategic analysis and structuring of a domestic cross-border merger.", skill: "Transaction Design" },
  { title: "IPO Prospectus Review", obs: "Pricing and risk analysis for a high-growth consumer brand offering.", skill: "Market Strategy" },
  { title: "Sector Research Deck", obs: "Comprehensive industry deep-dive with competitive positioning and trends.", skill: "Equity Insights" }
];

const careerRoles = [
  { role: "Investment Banking Analyst", range: "12 - 22 LPA" },
  { role: "M&A Associate", range: "15 - 32 LPA" },
  { role: "PE/VC Analyst", range: "14 - 35 LPA" },
  { role: "Equity Research", range: "09 - 18 LPA" },
  { role: "Corporate Development", range: "10 - 24 LPA" },
  { role: "Risk Analyst", range: "08 - 18 LPA" }
];



const faqCategories = {
  "Program Details": [
    { q: "Is this program for beginners?", a: "Yes. Our curriculum is designed to take you from fundamentals to advanced execution, ensuring a smooth learning curve for all skill levels." },
    { q: "What is the duration and format?", a: "The program spans 24 weeks with live interactive sessions on weekends and weekday evenings to accommodate working professionals." },
    { q: "Do I need any prior knowledge?", a: "No prior experience is required. We teach you everything from scratch, focusing on logic, psychology, and technical execution." },
    { q: "What are the timings?", a: "Live sessions happen on weekends and weekday evenings to accommodate work schedules." }
  ],
  "Career & Certification": [
    { q: "Do you offer placement support?", a: "We provide 100% career support, including resume audits, mock interviews, LinkedIn optimization, and direct referrals to our 500+ hiring partners." },
    { q: "Will I receive a certificate?", a: "Yes, upon successful completion of the program and projects, you will receive an industry-recognized Professional Certification." },
    { q: "What projects will I build?", a: "You will work on multiple industry-grade projects and capstones that mimic real-world challenges, allowing you to build a production-ready portfolio." },
    { q: "How many case studies or projects will I complete?", a: "You will graduate with at least 3-4 deep, evidence-based case studies or production-ready projects in your portfolio." }
  ],
  "Admissions & Policy": [
    { q: "How do I attend the classes?", a: "You will receive meeting links on your registered email. Classes are conducted via premium platforms like Zoom or Google Meet." },
    { q: "Do I get access to recorded sessions?", a: "Yes! Simply log in to the LMS portal to access the recorded sessions of any classes you missed." },
    { q: "What is the refund policy?", a: "Our courses are crafted with care and commitment. Therefore, we do not offer refunds as we provide immediate access to high-value resources." },
    { q: "Are there any prerequisites before starting?", a: "There are no prerequisites required! Our courses are designed for all skill levels." }
  ]
};

const Investmentbanking = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeFaqCat, setActiveFaqCat] = useState("Program Details");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="ib-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --ib-bg: #F7F6F2;
          --ib-text: #0F172A;
          --ib-text-dim: #64748B;
          --ib-primary: #1E3A8A;
          --ib-accent: #B45309;
          --ib-border: rgba(15, 23, 42, 0.08);
        }

        .ib-page { background: var(--ib-bg); color: var(--ib-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .ib-section { padding: 100px 0; }
        .ib-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--ib-border); border-bottom: 1px solid var(--ib-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--ib-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--ib-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--ib-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--ib-accent); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--ib-border); color: var(--ib-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--ib-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--ib-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: var(--ib-primary); 
          color: #fff;
          z-index: 100; 
          transform: translateY(100%); 
          transition: 0.4s; 
          display: flex; 
          align-items: center; 
          box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
        }
        .sticky-bar.visible { transform: translateY(0); }
        .countdown-box { background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums; }

        @media (max-width: 768px) { .sec-title { font-size: 28px; } }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Elite Financial Mastery"
        icon="Ã¢Å¡â€“Ã¯Â¸Â "
        title="Investment Banking"
        highlight="Valuation & M&A"
        sub="A comprehensive 24-week engineering of your financial career. Master valuation, mergers, and capital modeling with absolute technical precision."
        stats={heroStats}
        bg="linear-gradient(135deg, #0F172A 0%, #1E3A8A 45%, #1E40AF 100%)"
        accent="#B45309"
        shape="IB"
      >
        <ImageSlider />
      </CourseHeroBanner>

      

      <TopOnePercent />

      {/* 2. AUDIENCE */}
      <section className="ib-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for professionals aiming to enter the small, elite circle of finance professionals who drive global transaction volume.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--ib-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--ib-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="ib-sec-white">
        <div className="shell">
          <h2 className="sec-title">The Banking Advantage</h2>
          <p className="sec-sub">Investment banking is more than just valuationÃ¢â‚¬â€ it is the strategic bedrock of institutional growth and capital excellence.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--ib-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--ib-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="ib-section">
        <div className="shell">
           <h2 className="sec-title">Wall Street Prep Roadmap</h2>
           <p className="sec-sub">A structured career journey from first-principles analysis to executive-level transaction modeling.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--ib-primary)', background:'rgba(30,58,138,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--ib-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ib-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--ib-border)', fontSize:'14px', lineHeight:1.7, color:'var(--ib-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. CASE STUDIES */}
      <section className="ib-sec-white">
        <div className="shell">
           <h2 className="sec-title">Case Analysis & Modeling</h2>
           <p className="sec-sub">Build a professional portfolio of financial documents that prove your readiness for front-office banking roles.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--ib-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Objective</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--ib-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--ib-accent)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="ib-section">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A premium experience balancing technical rigor, mentor review, and institutional networking.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Live Modeling", d:"Sessions focused on keyboard-only efficiency and forecast logic.", i:<FileSpreadsheet size={20}/>}, {t:"Deal Reviews", d:"Regular defense of your valuation assumptions before mentors.", i:<GanttChart size={20}/>}, {t:"Technical Drills", d:"Weekly quizzes and drills on banking-specific technical questions.", i:<Zap size={20}/>}, {t:"Institutional Access", d:"Referral pathways to our network of 500+ hiring brands.", i:<Building2 size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--ib-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--ib-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. CAREER SUPPORT */}
      <CareerSupport courseValue="Investment Banking" brochureLink={ibBrochure} />

      {/* 8. ROLES */}
      <section className="ib-sec-white">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">Position yourself for roles that determine capital allocation and drive global financial strategy.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--ib-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. ALUMNI */}
      <section className="ib-section">
        <div className="shell">
           <h2 className="sec-title">Where our learners excel</h2>
           <p className="sec-sub">Graduates from our advanced programs have transitioned into elite roles across global financial hubs.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"200+ Mentees Placed", d:"Across banking, PE, and corporate finance tracks."}, {l:"₹10-22 LPA Avg CTC", d:"Focusing on high-value entry-to-mid career transitions."}, {l:"500+ Hiring Partners", d:"Representing the full spectrum of global banking orgs."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--ib-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--ib-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. CERTIFICATION */}
      <section className="ib-sec-white">
        <div className="shell">
           <Certification isDark={false} />
           <ProgramCohorts courseValue="Investment Banking" date="Upcoming" />
        </div>
      </section>

      {/* 10. PRICING */}
      <section className="ib-section" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional enrollment including live modeling labs, deal reviews, and institutional networking.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--ib-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Professional Banking Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹65,999</div>
                 <p style={{color:'var(--ib-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all analytical frameworks, live modeling labs, PR reviews, and job assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Investment Banking" /><DownloadBrochureButton courseValue="Investment Banking" brochureLink={ibBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Phase 1 Portfolio", v:"₹28,000"}, {l:"Phase 2 Balance", v:"₹27,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--ib-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI ₹7,333/MO</span></div>
              </div>
           </div>
        </div>
      </section>

      <AdvanceBanner />

      {/* 11. FAQ */}
      <section className="ib-sec-white">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify technical eligibility, weekly time commitments, and the banking career progression.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--ib-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--ib-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--ib-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 12. FORM */}
      <section className="ib-section">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Callback</h2>
                 <p className="sec-sub">Get a personalized transition plan into Investment Banking and review your institutional career roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour turnaround response', 'Deep technical walkthrough', 'Banking suitability review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-blue-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Expert Guidance Call</h3><p style={{fontSize:'13px', color:'var(--ib-text-dim)'}}>Plan your career in global finance.</p></div>
                 <ApplyForm courseValue="Investment Banking" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center gap-2 text-sm md:text-lg font-bold">
                 <span className="animate-pulse">🚨</span>
                 <span>30% Scholarship closing in just 2 days.</span>
              </div>
              <div className="hidden lg:flex items-center gap-3 text-sm font-bold opacity-90">
                 <span>Batch closing in</span>
                 <CountdownTimer />
              </div>
           </div>
           <div className="flex gap-6 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-black uppercase hidden xl:flex items-center gap-2 hover:opacity-80 transition-all text-white"><PhoneCall size={14} /> Request a Callback</button>
              <ApplyNowButton 
                 courseValue="Investment Banking" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-blue-900 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Investmentbanking;




