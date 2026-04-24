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
  Bug, 
  Terminal, 
  Database, 
  Workflow, 
  Smartphone, 
  Monitor, 
  Layers, 
  Cpu, 
  Settings, 
  FileCode2, 
  PhoneCall,
  UserCheck,
  Video,
  Rocket,
  Compass,
  Boxes
} from "lucide-react";

import posterImage from "../../assets/Advanced Course Images/AutomationvTesting/automationtesting.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import ToolStack from "./Components/ToolStack";
import atBrochure from "../../../krutanic/Automation testing Advanced Program.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Industrial Projects", value: "10+ Test Suites" },
  { label: "Avg. Salary Hike", value: "54%" },
  { label: "Hiring Partners", value: "250+" },
];

const audience = [
  { title: "Manual Testers", desc: "Scale your career from manual execution to building sophisticated, high-performance automation frameworks.", icon: <Workflow size={20} /> },
  { title: "Fresh Graduates", desc: "Gain an unfair advantage in tech with production-ready SDET skills and CI/CD integration depth.", icon: <Cpu size={20} /> },
  { title: "Software Developers", desc: "Bridge your coding skills with quality engineering to own the full delivery lifecycle of robust products.", icon: <FileCode2 size={20} /> },
  { title: "QA Engineers", desc: "Transition into Quality Leadership roles by mastering architectural patterns in selenium, playwright, and testing cloud.", icon: <Target size={20} /> },
  { title: "IT Professionals", desc: "Formalize your technical logic with the scientific rigor of performance testing, security audits, and mobile automation.", icon: <Terminal size={20} /> },
  { title: "Tech Project Managers", desc: "Understand the ROI and technical depth of automated quality to lead high-velocity engineering teams.", icon: <Settings size={20} /> }
];

const marketOpportunity = [
  { title: "DevOps Alignment", desc: "Automation is the heart of CI/CD. Companies are prioritizing SDETs who can integrate quality into the deployment pipeline.", icon: <Boxes size={24} /> },
  { title: "Quality Centrality", desc: "As tech complexity grows, the demand for sophisticated automation architects is outpacing supply.", icon: <ShieldCheck size={24} /> },
  { title: "Strategic Career Path", desc: "Quality Engineering leads to high-growth roles like SDET Lead, QA Architect, and Release Manager.", icon: <Rocket size={24} /> }
];

const techStack = [
  { group: "Core Libraries", tools: ["Selenium WebDriver", "Playwright", "Cypress", "Appium", "RestAssured"] },
  { group: "Frameworks & Runners", tools: ["TestNG", "JUnit 5", "Cucumber (BDD)", "Pytest", "Mocha/Chai"] },
  { group: "Infrastructure & Ops", tools: ["Jenkins", "Docker", "GitLab CI", "AWS Device Farm", "BrowserStack"] },
  { group: "Reporting & Monitoring", tools: ["Allure Reports", "Extent Reports", "Grafana", "JMeter", "Postman"] }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Automation Foundations", topics: "Java/JS for testing, Locators, Sync issues.", details: "Establish the programming foundation required to write clean, reusable, and maintainable test scripts." },
  { weeks: "Weeks 3-4", title: "Web Automation Mastery", topics: "Selenium/Playwright, Grid, Cross-browser.", details: "Learn the core methodologies used to interact with modern web elements and handle dynamic content." },
  { weeks: "Weeks 5-8", title: "Architectural Patterns", topics: "Page Object Model (POM), Data-driven, Hybrid.", details: "Deep-dive into production-ready framework design that ensures your test suites are scalable and lean." },
  { weeks: "Weeks 9-10", title: "API Automation", topics: "REST APIs, OAuth, Payload validation, Mocking.", details: "Master the mechanics of validating backend services without relying on the UI layers." },
  { weeks: "Weeks 11-12", title: "Mobile & Hybrid Apps", topics: "Appium, Emulator/Simulator, Mobile Gestures.", details: "Extend your quality skills to the mobile ecosystem—handling iOS and Android application lifecycles." },
  { weeks: "Weeks 13-16", title: "CI/CD & DevOps Integration", topics: "Jenkins, Docker, Cloud-native testing.", details: "Transition from local execution to integrated, automated pipelines that trigger on every code push." },
  { weeks: "Weeks 17-20", title: "Capstone Quality Suite", topics: "Framework from scratch, Performance, Report.", details: "Execute a full quality cycle—from test planning to a high-fidelity automated suite with cloud reporting." },
  { weeks: "Weeks 21-24", title: "SDET Interview Engineering", topics: "DSA for QA, Framework design drills, Live coding.", details: "Final phase focused on cracking competitive SDET and QE Lead interviews with architectural clarity." }
];

const portfolioProjects = [
  { title: "E-Commerce Suite", obs: "Full UI/API automation suite for a high-traffic shopping platform.", skill: "Framework Architecture" },
  { title: "Financial API Validator", obs: "A robust, data-driven security validator for complex transaction APIs.", skill: "Backend Integrity" },
  { title: "Mobile Social App", obs: "iOS and Android automated regression suite using Appium and cloud devices.", skill: "Mobile Scale" },
  { title: "CI/CD Quality Gate", obs: "A Jenkins-integrated dockerized test pipeline with auto-reporting.", skill: "DevOps Logic" }
];

const careerRoles = [
  { role: "SDET Engineer", range: "09 - 18 LPA" },
  { role: "Automation Lead", range: "12 - 28 LPA" },
  { role: "QA Architect", range: "18 - 45 LPA" },
  { role: "Performance Engineer", range: "10 - 22 LPA" },
  { role: "Quality Product Manager", range: "15 - 35 LPA" },
  { role: "DevOps Engineer", range: "10 - 24 LPA" }
];

const careerSupport = [
  { 
    title: "Profile Audit", 
    desc: "Deep review of your resume, LinkedIn, and portfolio to align them with target SDET and QA automation roles." 
  },
  { 
    title: "Resume Design", 
    desc: "ATS-friendly, impact-focused resume tailored to software quality and engineering hiring pipelines." 
  },
  { 
    title: "Project Portfolio", 
    desc: "Curated project portfolio with production-grade automation frameworks and test suites that you can showcase in interviews." 
  },
  { 
    title: "Mock Interviews", 
    desc: "Role-specific mock interviews with detailed feedback on coding, logic, and architectural drills." 
  },
  { 
    title: "Referral Access", 
    desc: "Warm referrals and profile pitches to hiring partners in our recruiter and alumni network." 
  }
];

const faqCategories = {
  "Progrm Logic": [
    { q: "Do I need manual testing experience?", a: "While helpful, we start with foundations. If you understand app logic, we will teach you the automation syntax." },
    { q: "Which programming language is used?", a: "We focus on Java and JavaScript (Playwright), the two most in-demand languages for SDET roles." }
  ],
  "Career Support": [
    { q: "Is job support included?", a: "Yes. 100% assistance including architecture reviews, mock SDET coding rounds, and referral access." },
    { q: "What is the certification value?", a: "It is an evidence-based professional certification backed by your capstone automation framework and cloud suites." }
  ]
};

const AutomationTesting = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeFaqCat, setActiveFaqCat] = useState("Progrm Logic");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="at-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --at-bg: #F7F6F2;
          --at-text: #111827;
          --at-text-dim: #4B5563;
          --at-primary: #2563EB;
          --at-accent: #3B82F6;
          --at-border: rgba(17, 24, 39, 0.08);
        }

        .at-page { background: var(--at-bg); color: var(--at-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .at-section { padding: 100px 0; }
        .at-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--at-border); border-bottom: 1px solid var(--at-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--at-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--at-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--at-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--at-primary); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--at-border); color: var(--at-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--at-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--at-text-dim); line-height: 1.6; }

        .sticky-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 72px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--at-border); z-index: 99; transform: translateY(100%); transition: 0.4s; display: flex; align-items: center; }
        .sticky-bar.visible { transform: translateY(0); }

        @media (max-width: 768px) { 
          .sec-title { font-size: 28px; } 
          .at-section, .at-sec-white { padding: 60px 0; }
        }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Quality Engineering Mastery"
        icon="🛡️"
        title="Automation Testing"
        highlight="& SDET Engineering"
        sub="Master the architecture of quality. From elite automation frameworks to high-performance CI/CD integration, build the products that ensure global tech reliability."
        stats={heroStats}
        bg="linear-gradient(135deg, #1E3A8A 0%, #1E40AF 45%, #2563EB 100%)"
        accent="#3B82F6"
        shape="AT"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#3B82F6" 
        courseValue="Automation Testing" 
        duration="24 Weeks"
        brochureLink={atBrochure}
      />

      {/* 2. AUDIENCE */}
      <section className="at-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for professionals aiming to own the intersection of code quality, performance engineering, and architectural deployment.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--at-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--at-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="at-sec-white">
        <div className="shell">
          <h2 className="sec-title">The SDET Advantage</h2>
          <p className="sec-sub">Automation is no longer a luxury—it is the strategic engine of high-velocity deployment and global software excellence.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--at-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--at-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Quality Engineering Roadmap</h2>
           <p className="sec-sub">A structured 24-week journey from syntax foundations to elite CI/CD quality gate management.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--at-primary)', background:'rgba(37,99,235,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--at-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--at-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--at-border)', fontSize:'14px', lineHeight:1.7, color:'var(--at-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#2563EB"
        subtitle="Master the exact technologies and CI/CD workflows used at high-growth engineering agencies and tech hubs."
      />

      {/* 6. PROJECTS */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Production Suites</h2>
           <p className="sec-sub">Building evidence-based automation architectures is the only way to demonstrate true quality readiness.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--at-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Project Focus</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--at-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--at-accent)'}}>{p.skill}</p></div>
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
              {[{t:"Live Labs", d:"Real-time framework architecture walkthroughs and logic drills.", i:<Terminal size={20}/>}, {t:"Review Circles", d:"Direct mentor feedback on your GitHub commits and test suites.", i:<CheckCircle2 size={20}/>}, {t:"Backend Drills", d:"Heavy focus on API, Performance, and Cloud query logic.", i:<Cpu size={20}/>}, {t:"Deployment Labs", d:"Hands-on CI/CD and cloud-native quality implementation.", i:<Workflow size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--at-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--at-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER SUPPORT */}
      <section className="at-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A structured 5‑step support system to convert your technical skills into real, high‑growth job offers.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              {careerSupport.map((step, i) => (
                 <div key={i} className="p-card" style={{background:'#F9FAFB'}}>
                    <div style={{fontSize:'32px', fontWeight:900, opacity:0.1, marginBottom:'12px', fontFamily:'Outfit'}}>0{i+1}</div>
                    <h4 style={{fontWeight:800, fontSize:'18px', marginBottom:'10px', color:'var(--at-primary)'}}>{step.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--at-text-dim)', lineHeight:1.6}}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ROLES */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">Automation mastery allows you to target versatile roles across the engineering and DevOps spectrum.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--at-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ALUMNI */}
      <section className="at-sec-white">
        <div className="shell">
           <h2 className="sec-title">Hiring Success & Proof</h2>
           <p className="sec-sub">Graduates from our advanced programs have transitioned into elite roles across global technology hubs.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"200+ Mentees Placed", d:"Across SDET, automation lead, and research tracks."}, {l:"₹09-18 LPA Range", d:"Typical entry-to-senior role transition packages."}, {l:"250+ Hiring Partners", d:"Representing the full spectrum of SaaS and IT orgs."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--at-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--at-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="at-section">
        <div className="shell">
           <Certification isDark={false} />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="at-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional enrollment including live labs, mentor reviews, and career support assets.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--at-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Professional SDET Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹61,999</div>
                 <p style={{color:'var(--at-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training frameworks, design labs, portfolio reviews, and job assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Automation Testing" /><a href={atBrochure} className="btn-sec">Official Syllabus</a></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Phase 1 Portfolio", v:"₹26,000"}, {l:"Phase 2 Balance", v:"₹25,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--at-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI starting at ₹4,000/month</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="at-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify technical eligibility, programming prerequisites, and the SDET career progression.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--at-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--at-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--at-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
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
                 <h2 className="sec-title">Speak with an Advisor</h2>
                 <p className="sec-sub">Get a personalized transition plan into SDET Engineering and review your institutional career roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour turnaround response', 'Deep technical walkthrough', 'QA suitability review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-blue-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Expert Guidance Call</h3><p style={{fontSize:'13px', color:'var(--at-text-dim)'}}>Plan your career in global engineering.</p></div>
                 <ApplyForm courseValue="Automation Testing" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="hidden sm:block"><div style={{fontSize:'10px', fontWeight:800, color:'var(--at-text-dim)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px'}}>Quality Authority</div><div style={{fontWeight:800}}>₹61,999 <span style={{fontSize:'12px', color:'var(--at-accent)', marginLeft:'12px'}}>EMI ₹4,000/MO</span></div></div>
           <div className="flex gap-4 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-bold uppercase hidden lg:flex items-center gap-2 hover:text-blue-700 transition-all"><PhoneCall size={14} /> Talk to Advisor</button>
              <ApplyNowButton courseValue="Automation Testing" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationTesting;
