import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  Star, 
  Users, 
  TrendingUp, 
  Award, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  Globe, 
  Zap, 
  BarChart3, 
  BrainCircuit, 
  Database, 
  Search, 
  MessageSquare, 
  Play, 
  Rocket, 
  LineChart, 
  Monitor, 
  Sparkles, 
  Calendar, 
  Clock, 
  Laptop, 
  Settings, 
  Terminal, 
  Code2, 
  PieChart, 
  Repeat, 
  GitBranch, 
  Cloud, 
  Share2, 
  Cpu,
  Target,
  FileText,
  UserCheck,
  Video,
  MessagesSquare,
  HelpCircle,
  PhoneCall
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/datascience.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import dsBrochure from "../../../krutanic/DataScienceAdvancedProgram.pdf";

import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import ToolStack from "./Components/ToolStack";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Avg. Salary Hike", value: "55%" },
  { label: "Batch Starting", value: "Upcoming" },
];

const audience = [
  { title: "Freshers & Students", desc: "Build a foundation in mathematical modeling and programming to land your first role in data science.", icon: <Rocket size={20} /> },
  { title: "Working Professionals", desc: "Transition from support or testing roles into high-impact data engineering and analytics positions.", icon: <Briefcase size={20} /> },
  { title: "Career Switchers", desc: "Pivot from Marketing, Finance, or Operations into the data economy with our zero-to-one roadmap.", icon: <Repeat size={20} /> },
  { title: "Data Analysts", desc: "Upscale from SQL and Excel reports to advanced predictive modeling and machine learning architectures.", icon: <LineChart size={20} /> },
  { title: "Software Engineers", desc: "Move from application development into AI Engineering by mastering model deployment and architectural scaling.", icon: <Code2 size={20} /> },
  { title: "Business Analysts", desc: "Gain the technical depth needed to lead data-driven initiatives and make high-stakes business decisions.", icon: <PieChart size={20} /> }
];

const techStack = [
  { group: "Programming & Storage", tools: ["Python", "SQL", "Git", "APIs"] },
  { group: "Data Science Libraries", tools: ["Pandas", "Scikit-Learn", "TensorFlow", "Keras"] },
  { group: "Big Data Systems", tools: ["Spark", "Hadoop"] },
  { group: "Visualization & Ops", tools: ["Tableau", "MLOps"] }
];

const compactRoadmap = [
  { weeks: "Weeks 1-2", title: "Machine Learning Foundations", topics: "Supervised & Unsupervised learning, Model evaluation", details: "Core concepts of regression, classification, clustering, and fundamental statistics." },
  { weeks: "Weeks 3-4", title: "Advanced Deep Learning", topics: "Neural networks, CNNs, RNN architectures", details: "Building neural networks, backpropagation, and deep vision/sequence models." },
  { weeks: "Week 5", title: "Big Data & Infrastructure", topics: "Spark, Hadoop, Data ingestion", details: "Scaling data processing with distributed systems and handling multi-TB datasets." },
  { weeks: "Weeks 6-7", title: "Feature Engineering", topics: "Dimensionality reduction, PCA, Scaling", details: "Preparing data for production models and finding optimal features." },
  { weeks: "Week 8", title: "Industry Applications", topics: "Fraud detection, Churn, Forecasting", details: "Real-world business case studies where data solves revenue problems." },
  { weeks: "Weeks 9-10", title: "NLP & Transformers", topics: "Sentiment, BERT, LLM foundations", details: "Natural language processing architectures and modern transformer models." },
  { weeks: "Weeks 11-12", title: "Data Visualization", topics: "Tableau, Power BI, Storytelling", details: "Communicate technical insights effectively to business stakeholders." },
  { weeks: "Weeks 13-24", title: "Cloud Ops & Capstone", topics: "MLOps, Projects, Career Prep", details: "Final project, cloud deployment on AWS/Azure, and placement assistance." }
];

const portfolioProjects = [
  { title: "Customer Attrition Model", problem: "Predicting high-risk attrition for telecom giants.", outcome: "Master classification and performance metrics." },
  { title: "Recommendation Engine", problem: "Personalizing user experience for e-commerce platforms.", outcome: "Learn collaborative filtering and matrix operations." },
  { title: "Market Forecasting", problem: "Predicting inventory demand for retail supply chains.", outcome: "Time-series analysis and seasonality modeling." },
  { title: "AI-Driven Document Sorting", problem: "Automating classification of legal and medical docs.", outcome: "NLP implementation and NER (Named Entity Recognition)." }
];

const learningFormat = [
  { title: "Live Classes", desc: "Interactive sessions with industry experts focused on practical implementation.", icon: <Video size={20} /> },
  { title: "1-on-1 Mentorship", desc: "Direct guidance for project reviews and your specific career roadmap.", icon: <UserCheck size={20} /> },
  { title: "Practical Labs", desc: "Weekly coding assignments modeled on real company data problems.", icon: <Terminal size={20} /> },
  { title: "Technical Community", desc: "Learning network of tech professionals for collaboration and reviews.", icon: <MessagesSquare size={20} /> }
];

const alumniOutcomes = [
  { name: "Aditi Sharma", role: "Junior Architect", target: "Senior Data Scientist", company: "Google", desc: "The transition from legacy systems to predictive AI was made seamless by the curriculum roadmap." },
  { name: "Rahul Verma", role: "Marketing Analyst", target: "Business Analyst", company: "Amazon", desc: "I pivoted from a non-tech background into a core analytical role in under 6 months." },
  { name: "Priya Singh", role: "Software Engineer", target: "MLOps Engineer", company: "Microsoft", desc: "The production-level focus on model deployment was the key to landing an engineering role in AI." }
];

const careerRoles = [
  { role: "Data Scientist", range: "14 - 26 LPA" },
  { role: "ML Engineer", range: "16 - 32 LPA" },
  { role: "Data Analyst", range: "08 - 14 LPA" },
  { role: "Data Engineer", range: "12 - 24 LPA" },
  { role: "AI Researcher", range: "20 - 40 LPA" },
  { role: "Quant Analyst", range: "18 - 35 LPA" }
];

const careerSupport = [
  { 
    title: "Profile Audit", 
    desc: "Deep review of your resume, LinkedIn, and portfolio to align them with target data science roles." 
  },
  { 
    title: "Resume Design", 
    desc: "ATS-friendly, impact-focused resume tailored to data and AI hiring pipelines." 
  },
  { 
    title: "Model Portfolio", 
    desc: "Curated project portfolio with production-grade ML models and datasets that you can showcase in interviews." 
  },
  { 
    title: "Mock Interviews", 
    desc: "Role-specific mock interviews with detailed feedback on coding, math, and case approach." 
  },
  { 
    title: "Referral Access", 
    desc: "Warm referrals and profile pitches to hiring partners in our recruiter and alumni network." 
  }
];

const faqCategories = {
  "Eligibility & Format": [
    { q: "Who is this program for?", a: "Graduates and working professionals from technical or analytical backgrounds. Career switchers are also welcome with basic math skills." },
    { q: "What are the timings?", a: "Live sessions happen on weekends and weekday evenings to accommodate work schedules." }
  ],
  "Career & Projects": [
    { q: "How does placement support work?", a: "We provide 100% assistance including resume reviews, mock interviews, and direct hiring partner referrals." },
    { q: "What projects will I build?", a: "You will build 4-6 industrial grade projects including Recommendation Engines and Fraud Detection systems." }
  ]
};

const DataScience = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeFaqCat, setActiveFaqCat] = useState("Eligibility & Format");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="ds-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --ds-bg: #F7F6F2;
          --ds-bg-alt: #FFFFFF;
          --ds-text: #1F2937;
          --ds-text-dim: #6B7280;
          --ds-primary: #0F766E;
          --ds-border: rgba(31, 41, 55, 0.08);
          --ds-card-bg: #FFFFFF;
        }

        .ds-page { background: var(--ds-bg); color: var(--ds-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        .ds-section { padding: 100px 0; }
        .ds-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--ds-border); border-bottom: 1px solid var(--ds-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 16px; color: var(--ds-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--ds-text-dim); max-width: 600px; margin-bottom: 48px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--ds-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--ds-primary); box-shadow: 0 8px 30px rgba(0,0,0,0.04); }

        .btn-prime { background: var(--ds-primary); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; }
        .btn-sec { border: 1px solid var(--ds-border); color: var(--ds-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; }

        .sticky-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 72px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-top: 1px solid var(--ds-border); z-index: 99; transform: translateY(100%); transition: 0.4s; display: flex; align-items: center; }
        .sticky-bar.visible { transform: translateY(0); }

        @media (max-width: 1024px) {
          .grid-2-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .grid-pricing { grid-template-columns: 1fr !important; gap: 40px !important; padding: 32px !important; }
          .grid-faq { grid-template-columns: 1fr !important; gap: 40px !important; }
        }

        @media (max-width: 768px) { 
          .sec-title { font-size: 28px; } 
          .sec-sub { font-size: 15px; } 
          .ds-section, .ds-sec-white { padding: 60px 0; }
        }
      `}</style>

      <CourseHeroBanner
        badge="Data Science Expert"
        icon="🧠"
        title="Data Science"
        highlight="and AI Masters"
        sub="Master the sophisticated analytical frameworks and high-performance tools required to transform massive data streams into precise, actionable business intelligence."
        stats={heroStats}
        bg="linear-gradient(135deg, #0F766E 0%, #042F2E 45%, #054C44 100%)"
        accent="#2DD4BF"
        shape="DS"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#2DD4BF" 
        courseValue="Data Science" 
        duration="24 Weeks"
        brochureLink={dsBrochure}
      />

      {/* AUDIENCE */}
      <section className="ds-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for practitioners moving into data-centric roles or upgrading from analytical positions.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--ds-primary)', marginBottom:'16px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--ds-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#0F766E"
        subtitle="Gain execution depth across a suite of 30+ industry tools for machine learning, big data, and model deployment."
      />

      {/* ROADMAP */}
      <section className="ds-section">
        <div className="shell">
           <h2 className="sec-title">24-Week Learning Roadmap</h2>
           <p className="sec-sub">A structured path from core concepts to deployment, capstone projects, and placement readiness.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {compactRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'12px', fontWeight:800, color:'var(--ds-primary)'}}>{item.weeks}</span>
                       <ChevronDown size={16} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s'}} />
                    </div>
                    <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'8px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ds-text-dim)'}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid var(--ds-border)', fontSize:'13px', lineHeight:1.6}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="ds-sec-white">
        <div className="shell">
           <h2 className="sec-title">Portfolio Projects</h2>
           <p className="sec-sub">Construct systems that solve business problems focused on automation, security, and forecasting.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'20px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{fontSize:'14px', marginBottom:'20px'}}><div style={{fontWeight:700, color:'var(--ds-text-dim)', fontSize:'12px', textTransform:'uppercase', marginBottom:'4px'}}>Industrial Problem</div>{p.problem}</div>
                    <div style={{fontSize:'14px'}}><div style={{fontWeight:700, color:'var(--ds-text-dim)', fontSize:'12px', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Outcome</div>{p.outcome}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* FORMAT */}
      <section className="ds-section">
        <div className="shell">
           <h2 className="sec-title">How learning works</h2>
           <p className="sec-sub">Our format is designed for professionals who require technical depth and practical code execution.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {learningFormat.map((f, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--ds-primary)', width:'fit-content', margin:'0 auto 20px'}}>{f.icon}</div>
                    <h4 style={{fontWeight:800, marginBottom:'10px'}}>{f.title}</h4>
                    <p style={{fontSize:'13px', color:'var(--ds-text-dim)', lineHeight:1.6}}>{f.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* CAREER SUPPORT */}
      <section className="ds-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A structured 5‑step support system to convert your technical skills into real, high‑growth job offers.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              {careerSupport.map((step, i) => (
                 <div key={i} className="p-card" style={{background:'#F9FAFB'}}>
                    <div style={{fontSize:'32px', fontWeight:900, opacity:0.1, marginBottom:'12px', fontFamily:'Outfit'}}>0{i+1}</div>
                    <h4 style={{fontWeight:800, fontSize:'18px', marginBottom:'10px', color:'var(--ds-primary)'}}>{step.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--ds-text-dim)', lineHeight:1.6}}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="ds-section">
        <div className="shell">
           <h2 className="sec-title">Learner Outcomes</h2>
           <p className="sec-sub"> Graduates from this program have successfully transitioned into these roles at global tech firms.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'20px', marginBottom:'48px'}}>
              {alumniOutcomes.map((a, i) => (
                 <div key={i} className="p-card">
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
                       <div><div style={{fontWeight:800}}>{a.name}</div><div style={{fontSize:'12px', color:'var(--ds-text-dim)'}}>{a.role} → {a.target}</div></div>
                       <div style={{fontSize:'14px', fontWeight:800, color:'var(--ds-primary)'}}>{a.company}</div>
                    </div>
                    <p style={{fontSize:'14px', fontStyle:'italic', opacity:0.8}}>"{a.desc}"</p>
                 </div>
              ))}
           </div>
           <ClientsCarousel />
        </div>
      </section>

      {/* PATHS */}
      <section className="ds-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career paths after the program</h2>
           <p className="sec-sub">Target roles with measurable market demand and competitive compensation structures.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'16px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center">
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--ds-primary)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* CERTIFICATION */}
      <section className="ds-section">
        <div className="shell">
           <Certification isDark={false} />
        </div>
      </section>

      {/* PRICING */}
      <section className="ds-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Fees & Payment Options</h2>
           <p className="sec-sub">Transparent program cost with structured installment plans and financial assistance.</p>
           <div className="p-card grid-pricing" style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:'64px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'14px', fontWeight:800, color:'var(--ds-primary)', textTransform:'uppercase', marginBottom:'20px'}}>Full Enrollment</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹65,999</div>
                 <p style={{color:'var(--ds-text-dim)', marginBottom:'40px'}}>Fee inclusive of all live training, dashboard access, and career support services.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Data Science" /><a href={dsBrochure} className="btn-sec">Detailed Syllabus</a></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Booking Amt", v:"₹10,000"}, {l:"Installment 1", v:"₹28,000"}, {l:"Installment 2", v:"₹27,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--ds-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={20} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'16px', grayscale:1}} /> <span style={{fontSize:'12px'}}>0% EMI Solutions</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ds-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Resolving common queries about the roadmap, support, and enrollment process.</p>
           <div className="grid-faq" style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'8px', fontWeight:700, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--ds-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--ds-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={16} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--ds-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* FORM */}
      <section className="ds-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Speak with an advisor</h2>
                 <p className="sec-sub">Get a personalized program walkthrough and cohort fit review from our admissions team.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour response guarantee', 'Direct mentor counseling', 'Course feasibility check'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-teal-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'20px', fontWeight:800, marginBottom:'4px'}}>Admission Review</h3><p style={{fontSize:'13px', color:'var(--ds-text-dim)'}}>Start your consultation request below.</p></div>
                 <ApplyForm courseValue="Data Science" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="hidden sm:block"><div style={{fontSize:'10px', fontWeight:800, color:'var(--ds-text-dim)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px'}}>Professional Certification</div><div style={{fontWeight:800}}>₹65,999 <span style={{fontSize:'12px', color:'var(--ds-primary)', marginLeft:'12px'}}>EMI ₹4,599/MO</span></div></div>
           <div className="flex gap-4 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-bold uppercase hidden lg:flex items-center gap-2 hover:text-teal-600 transition-all"><PhoneCall size={14} /> Talk to Advisor</button>
              <ApplyNowButton courseValue="Data Science" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataScience;
