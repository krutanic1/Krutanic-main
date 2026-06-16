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
  Code2, 
  Database, 
  Layout, 
  Server, 
  ShieldAlert, 
  Globe,
  Terminal,
  Cpu,
  Layers,
  Workflow,
  PhoneCall,
  UserCheck,
  Video,
  FileCode2,
  Box,
  Binary,
  Target
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/mern.png";
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
import mernBrochure from "../../../krutanic/Mern Stack Web Development Advanced Program.pdf";

const heroStats = [
  { label: "Mentees Placed", value: "280+" },
  { label: "Avg. CTC Range", value: "11+ LPA" },
  { label: "Placement Rate", value: "92%" },
  { label: "Hiring Partners", value: "500+" },
];

const audience = [
  { title: "Students & Freshers", desc: "Build a rock-solid foundation in full-stack engineering and graduate with a production-ready portfolio.", icon: <Cpu size={20} /> },
  { title: "Frontend Developers", desc: "Expand your capabilities to the backend, mastering Node.js and MongoDB to become a complete architect.", icon: <Server size={20} /> },
  { title: "Backend Developers", desc: "Bridge your logic with the user experience, learning React to own the full product lifecycle.", icon: <Layout size={20} /> },
  { title: "Career Switchers", desc: "A first-principles approach to web development designed for those moving into high-growth software roles.", icon: <Globe size={20} /> },
  { title: "Aspiring Architects", desc: "Learn to design scalable, secure, and performant web systems using the modern MERN stack.", icon: <Layers size={20} /> },
  { title: "Hobbyist Developers", desc: "Formalize your knowledge with industry standards in authentication, deployment, and cloud integration.", icon: <Terminal size={20} /> }
];

const marketOpportunity = [
  { title: "Startup Versatility", desc: "MERN is the preferred choice for fast-moving product teams due to its JavaScript-everywhere nature.", icon: <Zap size={24} /> },
  { title: "Production Demand", desc: "Enterprise teams are prioritizing full-stack engineers who can own features from database to UI.", icon: <Target size={24} /> },
  { title: "Execution Speed", desc: "Master the stack that allows for rapid feature iteration and seamless backend-frontend integration.", icon: <TrendingUp size={24} /> }
];

const techStack = [
  { group: "Frontend Core", tools: ["React.js", "Redux Toolkit", "React Router", "Tailwind CSS", "Axios"] },
  { group: "Backend & Logic", tools: ["Node.js", "Express.js", "JavaScript ES6+", "NPM", "JWT"] },
  { group: "Database & Data", tools: ["MongoDB", "Mongoose", "Atlas", "Aggregation", "Indexing"] },
  { group: "API & DevTools", tools: ["REST APIs", "Postman", "Insomnia", "Swagger", "Git/GitHub"] },
  { group: "Cloud & Ops", tools: ["Docker", "Vercel", "Heroku", "CI/CD", "Performance Profiling"] }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "MERN Fundamentals", topics: "Node setup, Architecture, ES6+, Project init.", details: "Establish the core development environment and understand the non-blocking nature of modern JS architecture." },
  { weeks: "Weeks 3-4", title: "DB & API Basics", topics: "Schema design, CRUD, Express routing, Middleware.", details: "Learn to design robust data models and connect them to functional backend service layers." },
  { weeks: "Weeks 5-6", title: "React Component Logic", topics: "Hooks, State, Virtual DOM, UI Integration.", details: "Master the reactive nature of modern interfaces and component-driven architecture." },
  { weeks: "Weeks 7-9", title: "Backend Engineering", topics: "Async flows, error handling, session management.", details: "Deep dive into production-grade backend logic that handles concurrency and complex business rules." },
  { weeks: "Weeks 10-12", title: "Advanced Frontend", topics: "Context API, custom hooks, performance tuning.", details: "Scale your React applications to handle complex global states and heavy data interactions." },
  { weeks: "Weeks 13-14", title: "Security & Auth", topics: "JWT, Protected routes, API encryption.", details: "Implement industry-standard authentication systems and secure your data against common vulnerabilities." },
  { weeks: "Weeks 15-16", title: "Cloud Ops & Scaling", topics: "Docker, CI/CD pipelines, Cloud deployment.", details: "Transition from local development to production deployment using containers and cloud automation." },
  { weeks: "Weeks 17-20", title: "Capstone Build", topics: "Architecture design, Full-cycle build, Peer reviews.", details: "Develop an end-to-end full-stack product that demonstrates your mastery to hiring partners." },
  { weeks: "Weeks 21-24", title: "Interview Engineering", topics: "Mock interviews, LinkedIn, Technical pitching.", details: "Final phase focused on the soft and hard skills required to crack elite software engineering roles." }
];

const portfolioProjects = [
  { title: "Auth-Based Web App", obs: "Secure user-ecosystem with role-based access control.", skill: "Security & JWT" },
  { title: "E-commerce Interface", obs: "Dynamic product catalog with real-time state synchronization.", skill: "React Complexity" },
  { title: "Administrative CMS", obs: "Data-heavy dashboard with complex CRUD and visualization.", skill: "DB Design" },
  { title: "Task Management Suite", obs: "A real-time collaborative tool with notification workflows.", skill: "Real-time Ops" }
];

const careerRoles = [
  { role: "Full-Stack Developer", range: "08 - 18 LPA" },
  { role: "MERN Developer", range: "09 - 22 LPA" },
  { role: "Backend Engineer", range: "07 - 16 LPA" },
  { role: "Frontend Lead", range: "08 - 18 LPA" },
  { role: "Product Architect", range: "18 - 35 LPA" },
  { role: "Software Engineer", range: "10 - 24 LPA" }
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

const MernStack = () => {
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
    <div className="ms-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --ms-bg: #F7F6F2;
          --ms-text: #111827;
          --ms-text-dim: #4B5563;
          --ms-primary: #059669;
          --ms-accent: #10B981;
          --ms-border: rgba(17, 24, 39, 0.08);
        }

        .ms-page { background: var(--ms-bg); color: var(--ms-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .ms-section { padding: 100px 0; }
        .ms-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--ms-border); border-bottom: 1px solid var(--ms-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--ms-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--ms-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--ms-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--ms-accent); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--ms-border); color: var(--ms-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--ms-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--ms-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: var(--ms-primary); 
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
          .ms-section, .ms-sec-white { padding: 60px 0; }
        }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Engineering Excellence"
        icon="🚀"
        title="Full-Stack Engineering"
        highlight="with MERN Stack"
        sub="Build secure, production-grade web applications from architectural first principles. Master the stack used by global top-tier product teams."
        stats={heroStats}
        bg="linear-gradient(135deg, #064E3B 0%, #065F46 45%, #059669 100%)"
        accent="#34D399"
        shape="MERN"
      >
        <ImageSlider />
      </CourseHeroBanner>

      

      <TopOnePercent />

      {/* 2. AUDIENCE */}
      <section className="ms-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for anyone aiming to build complete, modern web products from interface to architectural deployment.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--ms-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--ms-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="ms-sec-white">
        <div className="shell">
          <h2 className="sec-title">Why MERN Engineering?</h2>
          <p className="sec-sub">The unified JavaScript environment of MERN makes it the highest-efficiency choice for modern Full-Stack development.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--ms-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--ms-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="ms-section">
        <div className="shell">
           <h2 className="sec-title">Production Execution Roadmap</h2>
           <p className="sec-sub">A structured 24-week journey from syntax basics to deploying complex architectural systems.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--ms-primary)', background:'rgba(5,150,105,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--ms-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ms-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--ms-border)', fontSize:'14px', lineHeight:1.7, color:'var(--ms-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#059669"
        subtitle="Master the exact technologies and dev-workflows used at high-scale tech organizations."
      />

      {/* 6. PROJECTS */}
      <section className="ms-section">
        <div className="shell">
           <h2 className="sec-title">Production Projects</h2>
           <p className="sec-sub">Building real, deployable systems is the only way to demonstrate true full-stack readiness.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--ms-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Development Lead</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--ms-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Core Demonstration</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--ms-accent)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. FORMAT */}
      <section className="ms-sec-white">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A production-mode learning process focused on architectural depth and code quality.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Live Coding", d:"Real-time architecture walkthroughs and logic drills.", i:<FileCode2 size={20}/>}, {t:"Code Review", d:"Direct mentor feedback on your GitHub commits and PRs.", i:<CheckCircle2 size={20}/>}, {t:"Backend Drills", d:"Heavy focus on security, auth, and DB query optimization.", i:<Binary size={20}/>}, {t:"Deployment Labs", d:"Hands-on CI/CD and cloud hosting implementation.", i:<Box size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--ms-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--ms-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER SUPPORT */}
      <CareerSupport courseValue="MERN Stack" brochureLink={mernBrochure} />

      {/* 9. ROLES */}
      <section className="ms-section">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">MERN mastery allows you to target versatile roles across the software engineering spectrum.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--ms-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ALUMNI */}
      <section className="ms-sec-white">
        <div className="shell">
           <h2 className="sec-title">Hiring Brands & Outcomes</h2>
           <p className="sec-sub">Transition into production teams at global product companies and high-growth startups.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"280+ Mentees Placed", d:"Across various full-stack and platform roles."}, {l:"11+ LPA Avg CTC", d:"Focusing on high-value developer transitions."}, {l:"92% Placement Rate", d:"Reflecting our rigorous project-oriented prep."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--ms-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--ms-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="ms-section">
        <div className="shell">
           <Certification isDark={false} />
           <ProgramCohorts courseValue="MERN Stack" date="Upcoming" />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="ms-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional full-stack enrollment including code reviews, cloud labs, and career support.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--ms-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Full-Stack Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹61,999</div>
                 <p style={{color:'var(--ms-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training frameworks, live labs, project PR reviews, and job assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="MERN Stack" /><DownloadBrochureButton courseValue="MERN Stack" brochureLink={mernBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Registration", v:"₹10,000"}, {l:"Installment 1", v:"₹17,333"}, {l:"Installment 2", v:"₹17,333"}, {l:"Installment 3", v:"₹17,333"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--ms-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
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
      <section className="ms-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify technical prerequisites, weekly time commitments, and the hiring process.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--ms-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--ms-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--ms-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 13. FORM */}
      <section className="ms-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Consult with a Specialist</h2>
                 <p className="sec-sub">Plan your full-stack roadmap and get a technical evaluation of your current development skills.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour advisor response', 'GitHub and Portfolio review', 'Program fitment assessment'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-emerald-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Expert Guidance Call</h3><p style={{fontSize:'13px', color:'var(--ms-text-dim)'}}>Map your software engineering career.</p></div>
                 <ApplyForm courseValue="MERN Stack" isPremium={true} />
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
                 courseValue="MERN Stack" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-emerald-700 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default MernStack;




