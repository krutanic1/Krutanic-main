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
  Layout, 
  PieChart, 
  Repeat, 
  PhoneCall,
  UserCheck,
  Video,
  MessagesSquare,
  FileText,
  Rocket,
  Users,
  Compass,
  Layers,
  BarChart3,
  Globe
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/productmanagement.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import DownloadBrochureButton from "./Components/DownloadBrochureButton";
import CountdownTimer from "./Components/CountdownTimer";
import pmBrochure from "../../../krutanic/Product management Advanced program.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Avg. Salary Hike", value: "55%" },
  { label: "Batch Starting", value: "Upcoming" },
];

const audience = [
  { title: "Aspiring PMs", desc: "Gain the first-principles knowledge required to break into product roles with a structured case-study portfolio.", icon: <Compass size={20} /> },
  { title: "Software Engineers", desc: "Transition from building features to owning the 'why' behind them, leading strategic product discovery.", icon: <Rocket size={20} /> },
  { title: "Business Professionals", desc: "Translate your operational and business expertise into technical product leadership and growth strategy.", icon: <TrendingUp size={20} /> },
  { title: "Startup Founders", desc: "Master product-market fit frameworks to validate features faster and scale your business with precision.", icon: <Users size={20} /> },
  { title: "UX Designers", desc: "Expand your scope from interface design to full-funnel product strategy and monetization leadership.", icon: <Layout size={20} /> },
  { title: "Analytics Professionals", desc: "Move from reporting data to driving product roadmaps and experiments backed by behavioral insight.", icon: <BarChart3 size={20} /> }
];

const marketOpportunity = [
  { title: "High-Value Centrality", desc: "Product Managers act as the glue between engineering, design, and business, making them indispensable.", icon: <Layers size={24} /> },
  { title: "Strategic Demand", desc: "As tech mature, companies are prioritizing product discovery over just feature volume, driving PM growth.", icon: <Target size={24} /> },
  { title: "Career Progression", desc: "A structured path from Associate PM to C-suite roles like Head of Product or Chief Product Officer.", icon: <Briefcase size={24} /> }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Product Thinking & Foundations", topics: "Lifecycle, pain points, metrics, role scope.", details: "Understand the core mental models used by top-tier PMs to identify user problems and business impact." },
  { weeks: "Weeks 3-4", title: "Market & User Discovery", topics: "Customer discovery, SWOT, JTBD, competitive analysis.", details: "Learn the frameworks used to validate market opportunities before writing a single line of code." },
  { weeks: "Weeks 5-6", title: "Product Vision & Strategy", topics: "Vision crafting, roadmaps, prioritisation frameworks.", details: "Learn to align stakeholders around a coherent product vision and translate it into actionable phases." },
  { weeks: "Weeks 7-8", title: "Agile Development Cycles", topics: "Scrum, Kanban, User Stories, Backlog Grooming.", details: "Master the execution rituals required to lead engineering teams with clarity and iterative precision." },
  { weeks: "Weeks 9-10", title: "Product Design & UX", topics: "Design thinking, wireframing, usability testing.", details: "Collaborate effectively with designers to translate user empathy into seamless product experiences." },
  { weeks: "Weeks 11-12", title: "Data-Driven Decision Making", topics: "KPI frameworks, A/B testing, product analytics.", details: "Use behavioral data and structured experiments to validate hypotheses and optimize product value." },
  { weeks: "Weeks 13-16", title: "Monetization & Stakeholders", topics: "Pricing models, unit economics, executive alignment.", details: "Learn the business side of productÃ¢â‚¬â€ from pricing strategy to navigating complex stakeholder hierarchies." },
  { weeks: "Weeks 17-20", title: "Launch & GTM Execution", topics: "Launch planning, positioning, messaging, scaling.", details: "Plan and execute a high-impact go-to-market strategy that ensures adoption and market resonance." },
  { weeks: "Weeks 21-24", title: "Capstone & Placement Prep", topics: "End-to-end case, Resume, Mock interviews.", details: "Crystalize your learning into a portfolio-grade deck and prepare for the rigors of PM hiring cycles." }
];

const portfolioProjects = [
  { title: "End-to-End Case Study", obs: "Solving a high-value user problem from discovery to GTM.", skill: "Product Sense & Strategy" },
  { title: "Market Research Doc", obs: "Competitive positioning and opportunity sizing for a new vertical.", skill: "Strategic Analysis" },
  { title: "Prioritization Framework", obs: "A model-driven roadmap of features for a growth-stage product.", skill: "Resource Optimization" },
  { title: "Monetization Strategy", obs: "Refactoring pricing for a SaaS platform to increase LTV/CAC ratio.", skill: "Business & Economics" }
];

const careerRoles = [
  { role: "Product Manager", range: "12 - 28 LPA" },
  { role: "Growth PM", range: "14 - 32 LPA" },
  { role: "Product Marketing", range: "10 - 22 LPA" },
  { role: "Technical PM", range: "15 - 35 LPA" },
  { role: "VP of Product", range: "35 - 75 LPA" },
  { role: "Chief Product Officer", range: "50 - 120 LPA" }
];

const careerSupport = [
  { 
    title: "Profile Audit", 
    desc: "Deep review of your resume, LinkedIn, and portfolio to align them with target product leadership roles." 
  },
  { 
    title: "Resume Design", 
    desc: "ATS-friendly, impact-focused resume tailored to modern product and tech hiring pipelines." 
  },
  { 
    title: "Product Portfolio", 
    desc: "Curated project portfolio with strategic PRDs and discovery case studies that you can showcase in interviews." 
  },
  { 
    title: "Mock Interviews", 
    desc: "Role-specific mock interviews with detailed feedback on product sense, execution, and strategy." 
  },
  { 
    title: "Referral Access", 
    desc: "Warm referrals and profile pitches to hiring partners in our recruiter and alumni network." 
  }
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

const ProductManagement = () => {
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
    <div className="pm-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --pm-bg: #F7F6F2;
          --pm-text: #1F2937;
          --pm-text-dim: #626C78;
          --pm-primary: #334155;
          --pm-accent: #3B82F6;
          --pm-border: rgba(31, 41, 55, 0.08);
        }

        .pm-page { background: var(--pm-bg); color: var(--pm-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .pm-section { padding: 100px 0; }
        .pm-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--pm-border); border-bottom: 1px solid var(--pm-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--pm-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--pm-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--pm-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--pm-accent); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--pm-border); color: var(--pm-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--pm-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--pm-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: var(--pm-primary); 
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
        badge="Product Leadership"
        icon="Ã°Å¸â€™Å½"
        title="Product Management"
        highlight="Build & Scale"
        sub="A comprehensive 24-week program to help you build, launch, and scale high-impact products with strategic clarity and business precision."
        stats={heroStats}
        bg="linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #334155 100%)"
        accent="#3B82F6"
        shape="PM"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#3B82F6" 
        courseValue="Product Management" 
        duration="24 Weeks"
        brochureLink={pmBrochure}
      />

      {/* 2. AUDIENCE */}
      <section className="pm-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for professionals aiming to own the 'why' behind product decisions and lead cross-functional innovation.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--pm-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--pm-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="pm-sec-white">
        <div className="shell">
          <h2 className="sec-title">The PM Opportunity</h2>
          <p className="sec-sub">Product roles are now central to business innovation, offering one of the most high-impact growth paths in modern tech.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--pm-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--pm-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="pm-section">
        <div className="shell">
           <h2 className="sec-title">Progressive Learning Roadmap</h2>
           <p className="sec-sub">A structured career journey from first-principles discovery to executive-level product strategy.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--pm-primary)', background:'rgba(51,65,85,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--pm-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--pm-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--pm-border)', fontSize:'14px', lineHeight:1.7, color:'var(--pm-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. OVERVIEW/PROJECTS */}
      <section className="pm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Case Studies and Capstone</h2>
           <p className="sec-sub">Build an evidence-based portfolio of strategic documents that showcase your readiness for product leadership.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--pm-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Objective</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--pm-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Demonstrated Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--pm-accent)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="pm-section">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A premium experience balancing live frameworks, mentor review, and peer-to-peer accountability.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Live Frameworks", d:"Executive sessions focused on the discovery and strategy cycles.", i:<Video size={20}/>}, {t:"Mentor Accountability", d:"Regular reviews for your portfolios, docs, and interview pitch.", i:<UserCheck size={20}/>}, {t:"Practical Assets", d:"Weekly tasks designed to build your leadership toolkit.", i:<FileText size={20}/>}, {t:"Industry Network", d:"Referral access to our partner ecosystem of 500+ companies.", i:<MessagesSquare size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--pm-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--pm-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. CAREER SUPPORT */}
      <section className="pm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A structured 5Ã¢â‚¬â€˜step support system to convert your technical skills into real, highÃ¢â‚¬â€˜growth job offers.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              {careerSupport.map((step, i) => (
                 <div key={i} className="p-card" style={{background:'#F9FAFB'}}>
                    <div style={{fontSize:'32px', fontWeight:900, opacity:0.1, marginBottom:'12px', fontFamily:'Outfit'}}>0{i+1}</div>
                    <h4 style={{fontWeight:800, fontSize:'18px', marginBottom:'10px', color:'var(--pm-primary)'}}>{step.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--pm-text-dim)', lineHeight:1.6}}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. ROLES */}
      <section className="pm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Roles and Outcomes</h2>
           <p className="sec-sub">Position yourself for roles that own product outcomes and drive measurable business growth.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--pm-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. ALUMNI */}
      <section className="pm-section">
        <div className="shell">
           <h2 className="sec-title">Where our learners work</h2>
           <p className="sec-sub">Graduates from our advanced programs have transitioned into leading roles at global technology hubs.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"200+ Mentees Placed", d:"Across product, growth, and leadership tracks."}, {l:"₹10-28 LPA Range", d:"Typical entry-to-senior role transition packages."}, {l:"500+ Hiring Partners", d:"Representing the full spectrum of SaaS and product orgs."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--pm-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--pm-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. CERTIFICATION */}
      <section className="pm-sec-white">
        <div className="shell">
           <Certification isDark={false} />
        </div>
      </section>

      {/* 10. PRICING */}
      <section className="pm-section" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional enrollment including live sessions, mentor reviews, and career support assets.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--pm-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Advanced PM Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹65,999</div>
                 <p style={{color:'var(--pm-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training frameworks, live sessions, project reviews, and job assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Product Management" /><DownloadBrochureButton courseValue="Product Management" brochureLink={pmBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Phase 1 Due", v:"₹28,000"}, {l:"Phase 2 Balance", v:"₹27,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--pm-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI ₹7,333/MO</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="pm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify eligibility, weekly effort, and the product leadership career progression.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--pm-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--pm-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--pm-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 12. FORM */}
      <section className="pm-section">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Callback</h2>
                 <p className="sec-sub">Get a personalized transition plan into Product Management and review your personal case-study roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour turnaround response', 'Deep syllabus walkthrough', 'Program suitability review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-slate-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Request a Callback</h3><p style={{fontSize:'13px', color:'var(--pm-text-dim)'}}>Plan your product leadership journey.</p></div>
                 <ApplyForm courseValue="Product Management" isPremium={true} />
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
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-black uppercase hidden xl:flex items-center gap-2 hover:opacity-80 transition-all text-white"><PhoneCall size={14} /> Request Callback</button>
              <ApplyNowButton 
                 courseValue="Product Management" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-slate-800 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;




