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
  BarChart3, 
  Database, 
  Search, 
  Monitor, 
  Clock, 
  Settings, 
  Terminal, 
  Code2, 
  PieChart, 
  Repeat, 
  GitBranch, 
  Layout,
  PhoneCall,
  MonitorPlay,
  CalendarDays,
  FileSearch,
  Building2,
  BadgeCheck,
  UserCheck,
  Video,
  MessagesSquare,
  FileText
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/dataanalytics.png";
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
import daBrochure from "../../../krutanic/Data Analytics Advanced program.pdf";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Avg. Salary Hike", value: "55%" },
  { label: "Batch Starting", value: "10th Aug" },
];

const audience = [
  { title: "Fresh Graduates", desc: "Jumpstart your career in the high-demand data economy. Build a technical portfolio that proves your readiness to top hiring managers.", icon: <Award size={20} /> },
  { title: "Working Professionals", desc: "Transition from operational roles into strategic data positions. Upgrade your skillset to command higher salaries and better growth paths.", icon: <Briefcase size={20} /> },
  { title: "Career Switchers", desc: "Pivot into analytics from any background. Our zero-to-one approach ensures you master the logic and tools needed for a successful switch.", icon: <Repeat size={20} /> },
  { title: "Business Professionals", desc: "Make smarter, evidence-based executive decisions. Learn to translate complex data into clear growth strategies and revenue insights.", icon: <TrendingUp size={20} /> },
  { title: "MIS & Reporting Pros", desc: "Upgrade from static reporting to dynamic BI mastery. Automate your workflows and lead the digital transformation in your organization.", icon: <Layout size={20} /> },
  { title: "Aspiring Analysts", desc: "The definitive starting point for your data journey. Master the exact stack—Excel, SQL, and Power BI—that the industry demands today.", icon: <Search size={20} /> }
];

const techStack = [
  { group: "Data Manipulation", tools: ["Advanced Excel", "SQL", "Google Sheets", "Python"] },
  { group: "Libraries", tools: ["Pandas", "NumPy", "DAX"] },
  { group: "Visualization & BI", tools: ["Power BI", "Tableau"] },
  { group: "Version Control", tools: ["Git"] }
];

const compactRoadmap = [
  { weeks: "Weeks 1-4", title: "Excel & Advanced Reporting", topics: "Pivot tables, VLOOKUP, Power Query, Macros", details: "Deep dive into transforming messy data into automated, professional business reports." },
  { weeks: "Weeks 5-8", title: "SQL & Database Logic", topics: "Joins, Subqueries, CTEs, Optimization", details: "Learn to pull and manipulate data directly from enterprise-grade database systems." },
  { weeks: "Weeks 9-12", title: "Business Solving Frameworks", topics: "Case studies, Guessti-mates, Hypotheses", details: "Learn the analytical frameworks used by top consultants to solve revenue and growth problems." },
  { weeks: "Weeks 13-16", title: "Python for Analytics", topics: "Pandas, NumPy, EDA, Data cleaning", details: "Use Python to handle massive datasets that exceed traditional spreadsheet limits." },
  { weeks: "Weeks 17-20", title: "Power BI & Dashboard UX", topics: "DAX, Data modeling, UI principles", details: "Build world-class interactive dashboards that provide real-time business insights." },
  { weeks: "Weeks 21-24", title: "Capstone & Placement Prep", topics: "Live project, Resume, Mock interviews", details: "Complete an end-to-end analytics project and prepare for technical interview rounds." }
];

const portfolioProjects = [
  { title: "Sales Performance Dashboard", problem: "Consolidating regional sales data into a real-time KPI tracker.", outcome: "Master Power BI modeling and executive reporting." },
  { title: "Customer Churn Analysis", problem: "Identifying high-risk attrition patterns in subscription data.", outcome: "Learn hypothesis testing and predictive data behavior." },
  { title: "HR Analytics Tracker", problem: "Visualizing employee performance and retention metrics.", outcome: "Develop cross-functional dashboarding skills." },
  { title: "Finance Reporting Suite", problem: "Automating P&L statements and margin tracking with SQL.", outcome: "Master automated data pipe-lining and SQL logic." }
];

const learningFormat = [
  { title: "Industrial Live Sessions", desc: "Technical lectures focused on real-world business case execution.", icon: <Video size={20} /> },
  { title: "Expert Mentorship", desc: "1-on-1 reviews for your dashboards, projects, and interview strategy.", icon: <UserCheck size={20} /> },
  { title: "Applied Labs", desc: "Weekly assignments built on datasets from actual hiring partners.", icon: <Terminal size={20} /> },
  { title: "Peer Intelligence", desc: "Collaborate with a cohort of professionals from diverse industries.", icon: <MessagesSquare size={20} /> }
];

const careerRoles = [
  { role: "Data Analyst", range: "08 - 14 LPA" },
  { role: "Business Analyst", range: "10 - 18 LPA" },
  { role: "BI Developer", range: "12 - 20 LPA" },
  { role: "Reporting Lead", range: "09 - 16 LPA" },
  { role: "Product Analyst", range: "14 - 24 LPA" },
  { role: "Operations Analyst", range: "08 - 15 LPA" }
];



const alumniOutcomes = [
  { name: "Karan Mehta", role: "Sales Exec", target: "Business Analyst", company: "Amazon", desc: "The transition from sales to analytics was possible only because of the practical SQL focus." },
  { name: "Sneha Roy", role: "Fresher", target: "Data Analyst", company: "Deloitte", desc: "I built 4 dashboards that became the highlight of my interview and landed me the offer." },
  { name: "Sneha", role: "MIS Coordinator", target: "BI Developer", company: "Zomato", desc: "Upgrading from Excel to Power BI as a career move gave me a 60% salary hike." }
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

const DataAnalytics = () => {
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
    <div className="da-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --da-bg: #F7F6F2;
          --da-text: #1F2937;
          --da-text-dim: #6B7280;
          --da-primary: #086F70;
          --da-accent: #2DD4BF;
          --da-border: rgba(31, 41, 55, 0.08);
        }

        .da-page { background: var(--da-bg); color: var(--da-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        .da-section { padding: 100px 0; }
        .da-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--da-border); border-bottom: 1px solid var(--da-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 16px; color: var(--da-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--da-text-dim); max-width: 600px; margin-bottom: 48px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
        }
        .p-card:hover { border-color: var(--da-accent); }

        .btn-sec { border: 1px solid var(--da-border); color: var(--da-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--da-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 20px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--da-text-dim); line-height: 1.6; }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: var(--da-primary); 
          color: #fff;
          z-index: 100; 
          transform: translateY(100%); 
          transition: 0.4s; 
          display: flex; 
          align-items: center; 
        }
        .sticky-bar.visible { transform: translateY(0); }
        .countdown-box { background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums; }

        @media (max-width: 768px) { 
          .sec-title { font-size: 28px; } 
          .da-section, .da-sec-white { padding: 60px 0; }
        }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Analytics Expert"
        icon="📊"
        title="Data Analytics"
        highlight="Drives Decisions"
        sub="Master the sophisticated analytical frameworks and high-performance tools required to transform massive data streams into precise, actionable business intelligence."
        stats={heroStats}
        bg="linear-gradient(135deg, #054C44 0%, #086F70 45%, #0F9E9B 100%)"
        accent="#2DD4BF"
        shape="DA"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <TopOnePercent 
        accentColor="#086F70"
        subtitle="Move beyond theory with a program designed for career transitions. Gain the technical depth and industry networking required to land high-growth analyst roles."
      />

      {/* 2. AUDIENCE */}
      <section className="da-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Tailored for professionals aiming to lead with data and drive business impact.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--da-primary)', marginBottom:'16px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--da-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#4F46E5"
        subtitle="Gain execution depth across a suite of 40+ industry tools for data extraction, analysis, and cloud deployment."
      />

      {/* 4. ROADMAP */}
      <section className="da-section">
        <div className="shell">
           <h2 className="sec-title">24-Week Learning Roadmap</h2>
           <p className="sec-sub">A structured career journey from dashboard logic to predictive reporting and interview mastery.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {compactRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'12px', fontWeight:800, color:'var(--da-primary)', background:'rgba(8,111,112,0.05)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={16} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--da-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'8px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--da-primary)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid var(--da-border)', fontSize:'13px', lineHeight:1.6, color:'var(--da-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. PROJECTS */}
      <section className="da-sec-white">
        <div className="shell">
           <h2 className="sec-title">Practical projects and dashboards</h2>
           <p className="sec-sub">Build a portfolio of interactive reports that demonstrate your ability to solve real industrial bottlenecks.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'20px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{fontSize:'14px', marginBottom:'20px'}}><div style={{fontWeight:700, color:'var(--da-text-dim)', fontSize:'12px', textTransform:'uppercase', marginBottom:'4px'}}>Business Use Case</div>{p.problem}</div>
                    <div style={{fontSize:'14px'}}><div style={{fontWeight:700, color:'var(--da-text-dim)', fontSize:'12px', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Outcome</div>{p.outcome}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. FORMAT */}
      <section className="da-section">
        <div className="shell">
           <h2 className="sec-title">How learning works</h2>
           <p className="sec-sub">Our format is designed for working professionals, prioritizing depth of instruction and peer collaboration.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {learningFormat.map((f, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--da-primary)', width:'fit-content', margin:'0 auto 20px'}}>{f.icon}</div>
                    <h4 style={{fontWeight:800, marginBottom:'10px'}}>{f.title}</h4>
                    <p style={{fontSize:'13px', color:'var(--da-text-dim)', lineHeight:1.6}}>{f.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. CAREER SUPPORT */}
      <CareerSupport courseValue="Data Analytics" brochureLink={daBrochure} />

      {/* 8. ALUMNI */}
      <section className="da-section">
        <div className="shell">
           <h2 className="sec-title">Learner outcomes and brands</h2>
           <p className="sec-sub">Our graduates have successfully transitioned into analyst roles at industry-leading global firms.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'20px', marginBottom:'48px'}}>
              {alumniOutcomes.map((a, i) => (
                 <div key={i} className="p-card">
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
                       <div><div style={{fontWeight:800}}>{a.name}</div><div style={{fontSize:'12px', color:'var(--da-text-dim)'}}>{a.role} → {a.target}</div></div>
                       <div style={{fontSize:'14px', fontWeight:800, color:'var(--da-primary)'}}>{a.company}</div>
                    </div>
                    <p style={{fontSize:'14px', fontStyle:'italic', opacity:0.8}}>"{a.desc}"</p>
                 </div>
              ))}
           </div>
           <ClientsCarousel />
        </div>
      </section>

      {/* 9. PATHS */}
      <section className="da-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career paths after the program</h2>
           <p className="sec-sub">Target roles with measurable market demand and structured growth trajectories in the data economy.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'20px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--da-primary)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="da-section">
        <div className="shell">
           <Certification isDark={false} />
           <ProgramCohorts courseValue="Data Analytics" date="6th July" />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="da-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Fees and payment options</h2>
           <p className="sec-sub">Transparent program investment with structured installment plans and financial assistance.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'64px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'14px', fontWeight:800, color:'var(--da-primary)', textTransform:'uppercase', marginBottom:'20px'}}>Enrollment Fee</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹89,999</div>
                 <p style={{color:'var(--da-text-dim)', marginBottom:'40px', lineHeight:1.6}}>Inclusive of all training materials, live sessions, project reviews, and placement assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Data Analytics" /><DownloadBrochureButton courseValue="Data Analytics" brochureLink={daBrochure} /></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Booking Seat", v:"₹10,000"}, {l:"Installment 1", v:"₹26,666"}, {l:"Installment 2", v:"₹26,666"}, {l:"Installment 3", v:"₹26,666"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--da-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', filter:'grayscale(1)'}} /> <span style={{fontSize:'12px'}}>0% Installment Facility</span></div>
              </div>
           </div>
        </div>
      </section>

      <AdvanceBanner />

      {/* 12. FAQ */}
      <section className="da-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Find answers to common queries about eligibility, learning format, and career support.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'16px 24px', borderRadius:'8px', fontWeight:700, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--da-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--da-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={16} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--da-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 13. FORM */}
      <section className="da-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Callback</h2>
                 <p className="sec-sub">Get a personalized program walkthrough and review your cohort fit with our technical counselors.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour response turnaround', 'Expert technical counseling', 'No marketing spam policy'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-teal-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'20px', fontWeight:800, marginBottom:'4px'}}>Request a Consultation</h3><p style={{fontSize:'13px', color:'var(--da-text-dim)'}}>Connect with our team to start your career journey.</p></div>
                 <ApplyForm courseValue="Data Analytics" isPremium={true} />
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
                 courseValue="Data Analytics" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-teal-800 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;
