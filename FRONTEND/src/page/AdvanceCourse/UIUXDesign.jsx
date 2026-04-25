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
  PenTool, 
  Figma, 
  Palette, 
  Users, 
  Smartphone, 
  Monitor, 
  Layers, 
  MousePointer2, 
  Sparkles, 
  FileText, 
  PhoneCall, 
  UserCheck, 
  Video, 
  Rocket, 
  Compass, 
  Contrast,
  RotateCcw
} from "lucide-react";

import posterImage from "../../assets/advance_hero_new.png"; // Fallback to advance_hero_new if poster missing
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import ToolStack from "./Components/ToolStack";
import DownloadBrochureButton from "./Components/DownloadBrochureButton";
import uiuxBrochure from "../../../krutanic/UI  UX-min.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Design Projects", value: "8+ Portfolio Cases" },
  { label: "Avg. Salary Hike", value: "52%" },
  { label: "Hiring Partners", value: "500+" },
];

const audience = [
  { title: "Aspiring Designers", desc: "Build a first-principles foundation in design thinking, user research, and high-fidelity interface execution.", icon: <Palette size={20} /> },
  { title: "Frontend Developers", desc: "Bridge the gap between code and experience, learning the architectural depth of design systems.", icon: <Layers size={20} /> },
  { title: "Graphic Designers", desc: "Transition from static layouts to interactive, research-driven user experiences and product ecosystems.", icon: <RotateCcw size={20} /> },
  { title: "Business Analysts", desc: "Translate business requirements into user-centric flows and high-conversion product interfaces.", icon: <Target size={20} /> },
  { title: "Entrepreneurs", desc: "Understand product-market fit through rapid prototyping and user-centric discovery cycles.", icon: <Rocket size={20} /> },
  { title: "Creative Professionals", desc: "Formalize your artistic intuition with the scientific rigor of behavioral psychology and usability.", icon: <Sparkles size={20} /> }
];

const marketOpportunity = [
  { title: "Experience-Led Growth", desc: "Modern companies compete on experience. UX is now the primary differentiator for market winners.", icon: <MousePointer2 size={24} /> },
  { title: "Strategic Design", desc: "Designers are moving from 'making it look good' to owning the product strategy and user success.", icon: <Compass size={24} /> },
  { title: "Institutional Demand", desc: "Enterprise teams are prioritizing designers who can build scalable, coherent design systems.", icon: <Monitor size={24} /> }
];

const techStack = [
  { group: "Primary Design", tools: ["Figma", "Adobe XD", "Sketch", "Procreate", "Canva Pro"] },
  { group: "Prototyping", tools: ["Framer", "InVision", "Principle", "ProtoPie", "Figma Interactions"] },
  { group: "System & Handoff", tools: ["Zeroheight", "Zeplin", "Storybook", "Adobe Cloud", "Slack"] },
  { group: "Visual Arts", tools: ["Photoshop", "Illustrator", "After Effects", "Webflow Basics", "Lottie"] }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Design Foundations", topics: "Typography, color theory, grid systems, hierarchy.", details: "Establish the fundamental visual grammar required to build professional-grade interfaces." },
  { weeks: "Weeks 3-4", title: "User Research & Discovery", topics: "Interviews, personas, journey maps, audits.", details: "Learn the scientific methods used to uncover pain points and validate user needs before designing." },
  { weeks: "Weeks 5-6", title: "Information Architecture", topics: "Sitemaps, user flows, wireframing logic.", details: "Master the structural design of digital products that ensures effortless navigation and utility." },
  { weeks: "Weeks 7-10", title: "UI Engineering in Figma", topics: "Auto-layout, components, variants, styles.", details: "Deep-dive into Figma to build production-ready interfaces with systematic precision." },
  { weeks: "Weeks 11-12", title: "UX Psychology", topics: "Gestalt laws, cognitive load, behavioral triggers.", details: "Understand the 'why' behind user behavior and design interfaces that align with human intuition." },
  { weeks: "Weeks 13-16", title: "Advanced Design Systems", topics: "Tokenization, documentation, scalability.", details: "Learn to build and manage cohesive design systems that scale across platforms and teams." },
  { weeks: "Weeks 17-20", title: "Capstone Product Design", topics: "End-to-end case, Prototyping, Usability testing.", details: "Execute a full product cycleÃ¢â‚¬â€from research to a high-fidelity interactive prototype." },
  { weeks: "Weeks 21-24", title: "Portfolio Engineering", topics: "Case study writing, Behance/Dribbble, CV prep.", details: "Translate your projects into a world-class portfolio that captures the attention of elite design leads." }
];

const portfolioProjects = [
  { title: "E-Commerce Experience", obs: "Full UX audit and redesign focusing on checkout conversion.", skill: "UX Problem Solving" },
  { title: "SaaS Dashboard System", obs: "A complex, data-heavy dashboard built on a unified design system.", skill: "Scale & Hierarchy" },
  { title: "Lifestyle Mobile App", obs: "Research-driven mobile app with high-fidelity interactions.", skill: "Mobile Patterns" },
  { title: "Design System Doc", obs: "A comprehensive tokenized system with full Handoff documentation.", skill: "Technical Design" }
];

const careerRoles = [
  { role: "Product Designer", range: "08 - 18 LPA" },
  { role: "UX Researcher", range: "07 - 16 LPA" },
  { role: "UI Engineer", range: "07 - 15 LPA" },
  { role: "UX Architect", range: "12 - 25 LPA" },
  { role: "Design Systems Lead", range: "15 - 32 LPA" },
  { role: "Head of Design", range: "35 - 75 LPA" }
];

const careerSupport = [
  { 
    title: "Profile Audit", 
    desc: "Deep review of your resume, LinkedIn, and portfolio to align them with target product and UI/UX design roles." 
  },
  { 
    title: "Resume Design", 
    desc: "ATS-friendly, impact-focused resume tailored to elite design hiring pipelines." 
  },
  { 
    title: "Design Portfolio", 
    desc: "Curated project portfolio with evidence-based case studies and high-fidelity prototypes that you can showcase in interviews." 
  },
  { 
    title: "Mock Interviews", 
    desc: "Role-specific mock interviews with detailed feedback on design thinking, visual execution, and design sprints." 
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
    { q: "Do I need any prior knowledge or drawing skills?", a: "No prior experience is required. We teach you everything from scratch, focusing on logic, psychology, and technical execution." },
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

const UIUXDesign = () => {
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
    <div className="uiux-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --ux-bg: #F7F6F2;
          --ux-text: #1F2937;
          --ux-text-dim: #6B7280;
          --ux-primary: #7C3AED;
          --ux-accent: #8B5CF6;
          --ux-border: rgba(31, 41, 55, 0.08);
        }

        .uiux-page { background: var(--ux-bg); color: var(--ux-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .ux-section { padding: 100px 0; }
        .ux-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--ux-border); border-bottom: 1px solid var(--ux-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--ux-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--ux-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--ux-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--ux-primary); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--ux-border); color: var(--ux-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--ux-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--ux-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 72px; 
          background: var(--ux-primary); 
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
        badge="Product Design Authority"
        icon="Ã°Å¸Å½Â¨"
        title="UI/UX Design"
        highlight="& Product Strategy"
        sub="Master the architecture of user experience. From deep discovery to high-fidelity design systems, build the products that shape the future."
        stats={heroStats}
        bg="linear-gradient(135deg, #4C1D95 0%, #5B21B6 45%, #7C3AED 100%)"
        accent="#8B5CF6"
        shape="DS"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#8B5CF6" 
        courseValue="UIUX Design" 
        duration="24 Weeks"
        brochureLink={uiuxBrochure}
      />

      {/* 2. AUDIENCE */}
      <section className="ux-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for anyone aiming to own the intersection of user behavior, business goals, and aesthetic excellence.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--ux-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--ux-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="ux-sec-white">
        <div className="shell">
          <h2 className="sec-title">The Design Edge</h2>
          <p className="sec-sub">UX is no longer a luxuryÃ¢â‚¬â€it is the strategic engine of high-growth product companies and market disruptors.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--ux-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--ux-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="ux-section">
        <div className="shell">
           <h2 className="sec-title">Product Design Roadmap</h2>
           <p className="sec-sub">A structured 24-week journey from first-principles visual grammar to elite design system management.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--ux-primary)', background:'rgba(124,58,237,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--ux-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ux-accent)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--ux-border)', fontSize:'14px', lineHeight:1.7, color:'var(--ux-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#7C3AED"
        subtitle="Master the exact technologies and dev-handoff workflows used at high-growth design agencies and tech hubs."
      />

      {/* 6. PROJECTS */}
      <section className="ux-section">
        <div className="shell">
           <h2 className="sec-title">Production Portfolios</h2>
           <p className="sec-sub">Building evidence-based portfolios is the only way to demonstrate true product design readiness.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--ux-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Project Focus</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--ux-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--ux-accent)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. FORMAT */}
      <section className="ux-sec-white">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A premium experience balancing visual perfection, mentor review, and institutional networking.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Design Sprints", d:"Time-boxed challenges to simulate real product discovery cycles.", i:<Zap size={20}/>}, {t:"Review Labs", d:"Direct mentor feedback on your Figma boards and prototypes.", i:<Search size={20}/>}, {t:"Critique Circles", d:"Weekly peer-to-peer reviews to sharpen your artistic eye.", i:<Users size={20}/>}, {t:"Industry Network", d:"Referral access to our network of 500+ global design partners.", i:<Award size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--ux-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--ux-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER SUPPORT */}
      <section className="ux-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A structured 5Ã¢â‚¬â€˜step support system to convert your technical skills into real, highÃ¢â‚¬â€˜growth job offers.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              {careerSupport.map((step, i) => (
                 <div key={i} className="p-card" style={{background:'#F9FAFB'}}>
                    <div style={{fontSize:'32px', fontWeight:900, opacity:0.1, marginBottom:'12px', fontFamily:'Outfit'}}>0{i+1}</div>
                    <h4 style={{fontWeight:800, fontSize:'18px', marginBottom:'10px', color:'var(--ux-primary)'}}>{step.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ux-text-dim)', lineHeight:1.6}}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ROLES */}
      <section className="ux-section">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">UI/UX mastery allows you to target versatile roles across the product and strategy spectrum.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--ux-accent)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ALUMNI */}
      <section className="ux-sec-white">
        <div className="shell">
           <h2 className="sec-title">Hiring Success & Proof</h2>
           <p className="sec-sub">Graduates from our advanced programs have transitioned into elite roles across global design hubs.</p>
           <ClientsCarousel />
           <div style={{marginTop:'48px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px'}}>
              {[{l:"200+ Mentees Placed", d:"Across product, UX, and research tracks."}, {l:"₹08-18 LPA Range", d:"Typical entry-to-senior role transition packages."}, {l:"500+ Hiring Partners", d:"Representing the full spectrum of SaaS and agency orgs."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--ux-accent)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--ux-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="ux-section">
        <div className="shell">
           <Certification isDark={false} />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="ux-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Professional enrollment including live design labs, mentor reviews, and career support assets.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--ux-accent)', textTransform:'uppercase', marginBottom:'16px'}}>Advanced Product Design Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹65,999</div>
                 <p style={{color:'var(--ux-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training frameworks, design labs, portfolio reviews, and job assistance.</p>
                  <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="UIUX Design" /><DownloadBrochureButton courseValue="UIUX Design" brochureLink={uiuxBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Phase 1 Due", v:"₹28,000"}, {l:"Phase 2 Balance", v:"₹27,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--ux-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI ₹7,333/MO</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="ux-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify technical eligibility, weekly time commitments, and the design career progression.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--ux-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--ux-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--ux-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 13. FORM */}
      <section className="ux-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Speak with an Advisor</h2>
                 <p className="sec-sub">Get a personalized transition plan into UI/UX Design and review your institutional career roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour turnaround response', 'Deep technical walkthrough', 'Design suitability review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-purple-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Expert Guidance Call</h3><p style={{fontSize:'13px', color:'var(--ux-text-dim)'}}>Plan your career in global design.</p></div>
                 <ApplyForm courseValue="UIUX Design" isPremium={true} />
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
                 <div className="flex gap-1.5 items-center">
                    <span className="countdown-box">23</span> :
                    <span className="countdown-box">07</span> :
                    <span className="countdown-box">57</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-4 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-black uppercase hidden xl:flex items-center gap-2 hover:opacity-80 transition-all text-white"><PhoneCall size={14} /> Talk to Advisor</button>
              <ApplyNowButton 
                 courseValue="UIUX Design" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-purple-700 !px-8 !py-2.5 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default UIUXDesign;




