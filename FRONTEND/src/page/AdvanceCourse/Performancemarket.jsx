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
  BarChart4, 
  MousePointer2, 
  Filter, 
  Smartphone, 
  Monitor, 
  Layers, 
  Settings, 
  FileText, 
  PhoneCall,
  UserCheck,
  Video,
  Rocket,
  Compass,
  LineChart,
  Megaphone
} from "lucide-react";

import posterImage from "../../assets/Advanced Course Images/Performance marketing/PM.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";

import ToolStack from "./Components/ToolStack";
import TopOnePercent from "../../Components/TopOnePercent";
import CareerSupport from "../../Components/CareerSupport";
import ProgramCohorts from "./Components/ProgramCohorts";
import AdvanceBanner from "./Components/AdvanceBanner";

import DownloadBrochureButton from "./Components/DownloadBrochureButton";
import CountdownTimer from "./Components/CountdownTimer";
import pfBrochure from "../../../krutanic/Performance marketing Advanced Program.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Live Campaigns", value: "6+ High-Budget Cases" },
  { label: "Avg. Salary Hike", value: "55%" },
  { label: "Hiring Partners", value: "500+" },
];

const audience = [
  { title: "Marketing Managers", desc: "Scale from general branding to outcome-driven, high-ROAS performance execution.", icon: <Megaphone size={20} /> },
  { title: "Business Owners", desc: "Lower your CAC and scale revenue through data-backed paid media and conversion funnels.", icon: <TrendingUp size={20} /> },
  { title: "Analytics Professionals", desc: "Bridge the gap between raw data and profitable campaign optimization through attribution modeling.", icon: <BarChart4 size={20} /> },
  { title: "Career Switchers", desc: "Enter the highest-demand marketing niche with production-level skills in search, social, and display.", icon: <Target size={20} /> },
  { title: "Content Creators", desc: "Understand the financial logic of paid distribution to scale your own brand and reach.", icon: <Smartphone size={20} /> },
  { title: "Agency Owners", desc: "Equip your team with the scientific rigor required to deliver consistent client ROI in competitive markets.", icon: <Award size={20} /> }
];

const marketOpportunity = [
  { title: "Outcome-Driven ROI", desc: "Modern brands are moving budgets away from 'awareness' to trackable, performance-based conversion.", icon: <MousePointer2 size={24} /> },
  { title: "Data Centrality", desc: "Growth is now a function of analytics. Total proficiency in GA4 and Pixel data is mandatory for success.", icon: <PieChart size={24} /> },
  { title: "Scaling Logic", desc: "Mastering the mechanics of scaling low-CAC campaigns is the most valuable skill in the growth ecosystem.", icon: <Rocket size={24} /> }
];

const techStack = [
  { group: "Paid Search & Display", tools: ["Google Ads", "Youtube Ads", "Bing Ads", "GDN", "Performance Max"] },
  { group: "Paid Social", tools: ["Meta Ads Manager", "LinkedIn Ads", "Twitter Ads", "Snapchat Ads"] },
  { group: "Analytics & Tracking", tools: ["Google Analytics 4", "GTM", "FB Pixel/CAPI", "Hotjar", "Mixpanel"] },
  { group: "CRO & Research", tools: ["Unbounce", "Optimizely", "Semrush", "SpyFu", "Canva Pro"] }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Search Architecture", topics: "Technical SEO, Search logic, Keyword intent.", details: "Establish the foundation of intent-driven marketing through search behavior and keyword strategy." },
  { weeks: "Weeks 3-4", title: "Funnel Engineering", topics: "Objective setting, KPI mapping, landing page logic.", details: "Learn to design campaign architectures that guide users from awareness to final conversion." },
  { weeks: "Weeks 5-8", title: "Paid Media Execution", topics: "Google Ads, Meta Ads, Bidding models.", details: "Deep-dive into the two largest growth engines, mastering bid strategies and audience segmentation." },
  { weeks: "Weeks 9-10", title: "Advanced CRO", topics: "A/B testing, Heatmaps, Multivariate logic.", details: "Master the scientific methods used to lower acquisition costs by optimizing the post-click experience." },
  { weeks: "Weeks 11-12", title: "Social Scaling", topics: "Lookalikes, Retargeting, Dynamic creative.", details: "Learn to scale social campaigns through sophisticated audience modeling and creative iteration." },
  { weeks: "Weeks 13-16", title: "Growth Analytics", topics: "Attribution models, ROAS modeling, Dashboarding.", details: "Understand the 'why' behind performance and how to reallocate budget for maximum efficiency." },
  { weeks: "Weeks 17-20", title: "Capstone Campaign", topics: "Full-funnel execution, Audit, ROI report.", details: "Execute a full performance cycleÃ¢â‚¬â€ from budget planning to a high-ROAS live campaign simulation." },
  { weeks: "Weeks 21-24", title: "Hiring Acceleration", topics: "Growth CV, Case presentation, Mock interviews.", details: "Final phase focused on positioning your technical campaign evidence to crack elite growth roles." }
];

const portfolioProjects = [
  { title: "ROAS Scaling Audit", obs: "Audit and reallocation of a $50k monthly spend for a 30% ROAS lift.", skill: "Budget Optimization" },
  { title: "Full-Funnel Meta Build", obs: "A multi-stage retargeting architecture for a high-ticket D2C brand.", skill: "Funnel Integrity" },
  { title: "Search Dominance Suite", obs: "Dominating high-intent search keywords with 9+ quality score campaigns.", skill: "SEM Precision" },
  { title: "CRO Experiment Track", obs: "A series of 12 multivariate tests that lowered CPA by 40% in 60 days.", skill: "Scientific Growth" }
];

const careerRoles = [
  { role: "Performance Manager", range: "12 - 25 LPA" },
  { role: "Growth Specialist", range: "09 - 18 LPA" },
  { role: "PPC Lead", range: "08 - 16 LPA" },
  { role: "Paid Media Architect", range: "15 - 32 LPA" },
  { role: "CRO Specialist", range: "07 - 15 LPA" },
  { role: "Head of Growth", range: "35 - 80 LPA" }
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

const Performancemarket = () => {
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
    <div className="pf-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --pf-bg: #F7F6F2;
          --pf-text: #1E1B4B;
          --pf-text-dim: #4B5563;
          --pf-primary: #312E81;
          --pf-accent: #DC2626;
          --pf-border: rgba(30, 27, 75, 0.08);
        }

        .pf-page { background: var(--pf-bg); color: var(--pf-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .at-section { padding: 100px 0; }
        .at-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--pf-border); border-bottom: 1px solid var(--pf-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--pf-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--pf-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--pf-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--pf-primary); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--pf-border); color: var(--pf-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--pf-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--pf-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: var(--pf-primary); 
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

        @media (max-width: 768px) { 
          .sec-title { font-size: 28px; } 
          .at-section, .at-sec-white { padding: 60px 0; }
        }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Growth Analytics Certification"
        icon="🚀"
        title="Performance Marketing"
        highlight="& Growth Engineering"
        sub="Master the architecture of measurable growth. From elite paid media scaling to scientific conversion optimization, build the funnels that drive global business revenue."
        stats={heroStats}
        bg="linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #4338CA 100%)"
        accent="#DC2626"
        shape="DM"
      >
        <ImageSlider />
      </CourseHeroBanner>

      

      <TopOnePercent />

      {/* 2. AUDIENCE */}
      <section className="at-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for professionals aiming to own the intersection of data-backed scaling, high-performance creatives, and business profitability.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--pf-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--pf-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="at-sec-white">
        <div className="shell">
          <h2 className="sec-title">The Performance Edge</h2>
          <p className="sec-sub">Performance marketing is no longer a luxuryÃ¢â‚¬â€ it is the strategic engine of trackable growth and global market dominance.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--pf-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--pf-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Growth Engineering Roadmap</h2>
           <p className="sec-sub">A structured 24-week journey from intent architecture to elite attribution and ROI modeling.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--pf-primary)', background:'rgba(49,46,129,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--pf-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--pf-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--pf-border)', fontSize:'14px', lineHeight:1.7, color:'var(--pf-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#312E81"
        subtitle="Master the exact technologies and analytics workflows used at high-growth engineering agencies and tech hubs."
      />

      {/* 6. PROJECTS */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Production Funnels</h2>
           <p className="sec-sub">Building evidence-based campaign architectures is the only way to demonstrate true growth readiness.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--pf-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Project Focus</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--pf-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--pf-accent)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. FORMAT */}
      <section className="at-sec-white">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A premium experience balancing visual perfection, mentor review, and institutional networking.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Campaign Reviews", d:"Direct mentor feedback on your Meta/Google ad accounts and funnels.", i:<Settings size={20}/>}, {t:"Review Labs", d:"Sessions focused on scaling logic, bid strategy, and ROAS audit.", i:<TrendingUp size={20}/>}, {t:"Creative Drills", d:"Weekly focus on high-conversion copy and visual research logic.", i:<Megaphone size={20}/>}, {t:"Institutional Access", d:"Referral access to our network of 500+ global growth partners.", i:<Award size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--pf-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--pf-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER SUPPORT */}
      <CareerSupport courseValue="Performance Marketing" brochureLink={pfBrochure} />

      {/* 9. ROLES */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">Performance mastery allows you to target versatile roles across the growth and strategy spectrum.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--pf-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ALUMNI */}
      <section className="at-sec-white">
        <div className="shell">
           <h2 className="sec-title">Growth Proof & Success</h2>
           <p className="sec-sub">Graduates from our advanced programs have transitioned into elite roles across global growth hubs.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"200+ Mentees Placed", d:"Across performance, PPC, and growth tracking tracks."}, {l:"₹09-18 LPA Range", d:"Typical entry-to-senior role transition packages."}, {l:"500+ Hiring Partners", d:"Representing the full spectrum of SaaS and agency orgs."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--pf-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--pf-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="at-section">
        <div className="shell">
           <Certification isDark={false} />
           <ProgramCohorts courseValue="Performance Marketing" date="Upcoming" />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="at-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional enrollment including live design labs, mentor reviews, and career support assets.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--pf-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Advanced Performance Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹61,999</div>
                 <p style={{color:'var(--pf-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training frameworks, design labs, portfolio reviews, and job assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Performance Marketing" /><DownloadBrochureButton courseValue="Performance Marketing" brochureLink={pfBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Installment 1", v:"₹17,333"}, {l:"Installment 2", v:"₹17,333"}, {l:"Installment 3", v:"₹17,333"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--pf-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI ₹6,888/MO</span></div>
              </div>
           </div>
        </div>
      </section>

      <AdvanceBanner />

      {/* 12. FAQ */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify technical eligibility, programming prerequisites, and the growth career progression.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--pf-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--pf-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--pf-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 13. FORM */}
      <section className="at-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Callback</h2>
                 <p className="sec-sub">Get a personalized transition plan into Performance Marketing and review your institutional career roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour turnaround response', 'Deep technical walkthrough', 'Growth suitability review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-indigo-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Expert Guidance Call</h3><p style={{fontSize:'13px', color:'var(--pf-text-dim)'}}>Plan your career in global growth.</p></div>
                 <ApplyForm courseValue="Performance Marketing" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center gap-2 text-sm md:text-lg font-bold">
                 <span className="animate-pulse">🚨</span>
                 <span>50% Scholarship closing in just 2 days.</span>
              </div>
              <div className="hidden lg:flex items-center gap-3 text-sm font-bold opacity-90">
                 <span>Batch closing in</span>
                 <CountdownTimer />
              </div>
           </div>
           <div className="flex gap-6 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-black uppercase hidden xl:flex items-center gap-2 hover:opacity-80 transition-all text-white"><PhoneCall size={14} /> Request a Callback</button>
              <ApplyNowButton 
                 courseValue="Performance Marketing" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-indigo-900 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Performancemarket;




