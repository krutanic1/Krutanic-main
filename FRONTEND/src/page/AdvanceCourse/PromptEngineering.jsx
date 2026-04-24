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
  Cpu, 
  Terminal, 
  Code2, 
  MessagesSquare, 
  Layout,
  PhoneCall,
  UserCheck,
  Video,
  Monitor,
  Settings,
  ShieldAlert,
  Search,
  Database,
  Layers,
  Sparkles,
  Workflow
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/promptengineering.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import ToolStack from "./Components/ToolStack";
import peBrochure from "../../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";

const heroStats = [
  { label: "Placement Rate", value: "94%" },
  { label: "Avg. Salary Hike", value: "58%" },
  { label: "Industry Rating", value: "4.9/5" },
  { label: "Program Mode", value: "Live Hybrid" },
];

const audience = [
  { title: "Software Engineers", desc: "Integrate LLMs into production codebases with reliable prompt architectures and API guardrails.", icon: <Code2 size={20} /> },
  { title: "Data Scientists & ML", desc: "Bridge the gap between model training and effective inference through advanced context engineering.", icon: <Database size={20} /> },
  { title: "Product Managers", desc: "Learn to define and control AI behavior to deliver consistent, high-value user experiences.", icon: <Layout size={20} /> },
  { title: "Marketing & Content", desc: "Scale personalized content engines with sophisticated prompt templates and quality control.", icon: <Sparkles size={20} /> },
  { title: "Operations & Ops", desc: "Automate complex business processes using zero-shot and few-shot multi-step AI workflows.", icon: <Workflow size={20} /> },
  { title: "Future Tech Talent", desc: "A first-principles approach to mastering the most critical career skill in the Generative AI era.", icon: <Cpu size={20} /> }
];

const marketOpportunity = [
  { title: "Strategic Resource", desc: "Prompt Engineering is now a core requirement for teams building production-grade AI features.", icon: <TrendingUp size={24} /> },
  { title: "Economic Impact", desc: "Enterprises are prioritizing efficiency; skilled prompt engineers can reduce token costs by up to 40%.", icon: <Zap size={24} /> },
  { title: "Role Emergence", desc: "Dedicated roles like 'AI Orchestrator' and 'Prompt Architect' are among the fastest-growing job titles.", icon: <Briefcase size={24} /> }
];

const techStack = [
  { group: "Core LLMs", tools: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini Pro", "Llama 3", "Mistral Large"] },
  { group: "Prompt Tools", tools: ["PromptLayer", "LangSmith", "Humanloop", "Pryon"] },
  { group: "Dev & Orchestrations", tools: ["LangChain", "LlamaIndex", "AutoGPT", "AutoGen"] },
  { group: "Vector & Context", tools: ["Pinecone", "ChromaDB", "Weaviate", "Redis Stack"] },
  { group: "Evaluation", tools: ["DeepEval", "Giskard", "Ragas", "TruLens"] }
];

const curriculumRoadmap = [
  { weeks: "Weeks 1-2", title: "Foundations of LLM Behavior", topics: "Tokenization, context window, temperature, hallucinations.", details: "Understand the mathematical and probabilistic nature of LLMs to predict response behavior through better framing." },
  { weeks: "Weeks 3-4", title: "Advanced Prompting Patterns", topics: "Few-shot, Chain-of-Thought, ReAct, Self-Consistency.", details: "Master the fundamental architectures used to guide models through complex reasoning tasks." },
  { weeks: "Weeks 5-6", title: "Constraint & Control Design", topics: "Structured outputs, XML/JSON tags, persona control.", details: "Learn to demand and enforce precise formatting and tone across diverse model cohorts." },
  { weeks: "Weeks 7-8", title: "Multi-step Chaining", topics: "Task decomposition, state management, iterative refinement.", details: "Build sophisticated pipelines where the output of one prompt serves as the optimized context for the next." },
  { weeks: "Weeks 9-10", title: "Prompting for Product & Code", topics: "SQL generation, API specs, unit test prompts, debugging.", details: "Deep dive into using prompts as a development tool to accelerate technical build cycles." },
  { weeks: "Weeks 11-12", title: "Context & RAG Engineering", topics: "Vector embedding, chunking strategies, hybrid search.", details: "Master the art of providing external knowledge to models to eliminate outdated data limitations." },
  { weeks: "Weeks 13-14", title: "Evaluation & Guardrails", topics: "Bias mitigation, safety layers, performance metrics.", details: "Build professional testing suites to ensure your prompt systems are safe and reliable for business production." },
  { weeks: "Weeks 15-20", title: "Capstone & Full-Stack AI", topics: "API integration, deployment, cost optimization.", details: "Develop and deploy a complete prompt-driven system that solves a real-world vertical business problem." },
  { weeks: "Weeks 21-24", title: "Career & Portfolio Prep", topics: "Portfolio review, LinkedIn, technical mock mocks.", details: "Final phase focused on presenting your AI systems to hiring partners and cracking technical AI roles." }
];

const portfolioProjects = [
  { title: "Guardrailed Pipeline", obs: "Eliminating hallucination in medical document summarization.", skill: "Safety Guardrails" },
  { title: "Context-Aware Assistant", obs: "A customer support engine with access to proprietary product manuals.", skill: "RAG & Embeddings" },
  { title: "Code Gen Architecture", obs: "A prompt system that transforms PRD documents into functional React code.", skill: "Software Automation" },
  { title: "Cost Optimization Suite", obs: "Refactoring prompts to reduce token usage by 50% without quality loss.", skill: "Token Efficiency" }
];

const careerRoles = [
  { role: "Prompt Engineer", range: "14 - 28 LPA" },
  { role: "AI Workflow Architect", range: "18 - 35 LPA" },
  { role: "LLM Solutions Lead", range: "22 - 45 LPA" },
  { role: "AI Product Manager", range: "20 - 40 LPA" },
  { role: "Conversational UX", range: "10 - 18 LPA" },
  { role: "AI Content Strategist", range: "09 - 16 LPA" }
];

const careerSupport = [
  { 
    title: "Profile Audit", 
    desc: "Deep review of your resume, LinkedIn, and portfolio to align them with target AI and prompt engineering roles." 
  },
  { 
    title: "Resume Design", 
    desc: "ATS-friendly, impact-focused resume tailored to cutting-edge generative AI and tech hiring pipelines." 
  },
  { 
    title: "AI Portfolio", 
    desc: "Curated project portfolio with production-ready prompt templates and AI system designs that you can showcase in interviews." 
  },
  { 
    title: "Mock Interviews", 
    desc: "Role-specific mock interviews with detailed feedback on AI logic, reasoning patterns, and system design." 
  },
  { 
    title: "Referral Access", 
    desc: "Warm referrals and profile pitches to hiring partners in our recruiter and alumni network." 
  }
];

const faqCategories = {
  "Progrm Basics": [
    { q: "Is this course for non-coders?", a: "Yes. While code familiarity helps, prompt engineering is primarily a logic and language task. We provide support for both paths." },
    { q: "Which LLMs will we use?", a: "The program is model-agnostic. We work with GPT-4, Claude 3.5, and open-source models like Llama 3." }
  ],
  "Job Assistance": [
    { q: "How does placement support work?", a: "We provide portfolio reviews, resume building for AI roles, and direct referrals to our hiring network." },
    { q: "What is the demand for this role?", a: "Prompt Engineering is currently one of the fastest-growing niches in tech as every company integrates GenAI." }
  ]
};

const PromptEngineering = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeFaqCat, setActiveFaqCat] = useState("Progrm Basics");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pe-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --pe-bg: #F7F6F2;
          --pe-text: #1F2937;
          --pe-text-dim: #626C78;
          --pe-primary: #6D28D9;
          --pe-accent: #A78BFA;
          --pe-border: rgba(31, 41, 55, 0.08);
        }

        .pe-page { background: var(--pe-bg); color: var(--pe-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1210px; margin: 0 auto; padding: 0 24px; }

        .pe-section { padding: 100px 0; }
        .pe-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--pe-border); border-bottom: 1px solid var(--pe-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 34px; font-weight: 800; margin-bottom: 16px; color: var(--pe-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--pe-text-dim); max-width: 610px; margin-bottom: 50px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--pe-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--pe-accent); box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

        .btn-sec { border: 1px solid var(--pe-border); color: var(--pe-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--pe-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 22px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--pe-text-dim); line-height: 1.6; }

        .sticky-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 72px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--pe-border); z-index: 99; transform: translateY(100%); transition: 0.4s; display: flex; align-items: center; }
        .sticky-bar.visible { transform: translateY(0); }

        @media (max-width: 768px) { 
          .sec-title { font-size: 28px; } 
          .pe-section, .pe-sec-white { padding: 60px 0; }
        }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Generative AI Focus"
        icon="🧠"
        title="Prompt Engineering"
        highlight="Foundations to Pro"
        sub="Master the technical architectures and psychological frameworks required to steer LLMs with surgical precision across production-grade AI workflows."
        stats={heroStats}
        bg="linear-gradient(135deg, #1E1B4B 0%, #3730A3 45%, #6D28D9 100%)"
        accent="#A78BFA"
        shape="PE"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#A78BFA" 
        courseValue="Prompt Engineering" 
        duration="24 Weeks"
        brochureLink={peBrochure}
      />

      {/* 2. AUDIENCE */}
      <section className="pe-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Designed for technical and non-technical professionals who want to lead the AI-first transformation in their respective fields.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--pe-primary)', marginBottom:'18px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--pe-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET */}
      <section className="pe-sec-white">
        <div className="shell">
          <h2 className="sec-title">The Prompting Opportunity</h2>
          <p className="sec-sub">Prompt engineering has moved from a curiosity to a mission-critical role in the global enterprise tech stack.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i}>
                 <div style={{color:'var(--pe-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'19px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--pe-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ROADMAP */}
      <section className="pe-section" id="roadmap">
        <div className="shell">
           <h2 className="sec-title">Technical Learning Roadmap</h2>
           <p className="sec-sub">A structured career journey from basic LLM responses to autonomous multi-agent prompt systems.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--pe-primary)', background:'rgba(109,40,217,0.06)', padding:'4px 12px', borderRadius:'99px'}}>{item.weeks}</span>
                       <ChevronDown size={17} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s', color:'var(--pe-text-dim)'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'6px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--pe-primary)', fontWeight:700}}>{item.topics}</p>
                    {expandedModule === idx && <p style={{marginTop:'18px', paddingTop:'18px', borderTop:'1px solid var(--pe-border)', fontSize:'14px', lineHeight:1.7, color:'var(--pe-text-dim)'}}>{item.details}</p>}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. TOOLS */}
      <ToolStack 
        categories={techStack} 
        accentColor="#6D28D9"
        subtitle="Master the development environment used by top AI labs to build, test, and deploy prompt-centric apps."
      />

      {/* 6. PROJECTS */}
      <section className="pe-section">
        <div className="shell">
           <h2 className="sec-title">Projects and Portfolio</h2>
           <p className="sec-sub">Practical, evidence-based systems that demonstrate your ability to execute high-impact LLM strategies.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--pe-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Project Goal</div><p style={{fontSize:'14px'}}>{p.obs}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--pe-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--pe-primary)'}}>{p.skill}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. FORMAT */}
      <section className="pe-sec-white">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">Experience a structured, mentor-led bootcamp format focused on technical depth and portfolio construction.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Live Bootcamp", d:"Interactive technical lectures focused on real behavior patterns.", i:<Video size={20}/>}, {t:"Mentor Feedback", d:"Regular 1-on-1 reviews for your prompt architectures and code.", i:<UserCheck size={20}/>}, {t:"Practical Labs", d:"Weekly hands-on tasks to build and test prompt libraries.", i:<Terminal size={20}/>}, {t:"Career Hub", d:"Direct referral and interview support for emerging AI roles.", i:<MessagesSquare size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--pe-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--pe-text-dim)', lineHeight:1.6}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER SUPPORT */}
      <section className="pe-sec-white">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A structured 5‑step support system to convert your technical skills into real, high‑growth job offers.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
              {careerSupport.map((step, i) => (
                 <div key={i} className="p-card" style={{background:'#F9FAFB'}}>
                    <div style={{fontSize:'32px', fontWeight:900, opacity:0.1, marginBottom:'12px', fontFamily:'Outfit'}}>0{i+1}</div>
                    <h4 style={{fontWeight:800, fontSize:'18px', marginBottom:'10px', color:'var(--pe-primary)'}}>{step.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--pe-text-dim)', lineHeight:1.6}}>{step.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ROLES */}
      <section className="pe-section">
        <div className="shell">
           <h2 className="sec-title">Target Career Roles</h2>
           <p className="sec-sub">Prepare for highly specialized positions that bridge the gap between business needs and AI capability.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'24px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'14px', color:'var(--pe-primary)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. OUTCOMES */}
      <section className="pe-sec-white">
        <div className="shell">
           <h2 className="sec-title">Program Outcomes at a Glance</h2>
           <p className="sec-sub">Direct access to industry-recognized benchmarks and professional validation in the GenAI space.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'24px', marginBottom:'48px'}}>
              {[{l:"Skill Validation", d:"Certified expertise in 15+ advanced prompting frameworks."}, {l:"Portfolio", d:"Four production-grade systems ready for hiring reviews."}, {l:"Hiring Pipeline", d:"Referrals to our 250+ technology and product partners."}].map((item, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontWeight:800, marginBottom:'10px', color:'var(--pe-primary)'}}>{item.l}</div>
                    <p style={{fontSize:'14px', color:'var(--pe-text-dim)'}}>{item.d}</p>
                 </div>
              ))}
           </div>
           <ClientsCarousel />
        </div>
      </section>

      {/* 10. CERTIFICATION */}
      <section className="pe-section">
        <div className="shell">
           <Certification isDark={false} />
        </div>
      </section>

      {/* 11. PRICING */}
      <section className="pe-sec-white" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Complete program enrollment with structured payment plans and career support integration.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--pe-primary)', textTransform:'uppercase', marginBottom:'16px'}}>Professional Certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹65,999</div>
                 <p style={{color:'var(--pe-text-dim)', marginBottom:'40px', lineHeight:1.7}}>Inclusive of all training credits, live sessions, project reviews, and placement assistance.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Prompt Engineering" /><a href={peBrochure} className="btn-sec">Full Syllabus</a></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Booking Seat", v:"₹10,000"}, {l:"Phase 1 Due", v:"₹28,000"}, {l:"Phase 2 Balance", v:"₹27,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--pe-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI starting at ₹4,000/month</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="pe-section">
        <div className="shell">
           <h2 className="sec-title">Frequently Asked Questions</h2>
           <p className="sec-sub">Clarify eligibility, technical requirements, and the career acceleration process.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'18px 24px', borderRadius:'10px', fontWeight:800, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--pe-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--pe-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--pe-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 13. FORM */}
      <section className="pe-sec-white">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Consultation</h2>
                 <p className="sec-sub">Connect with our AI advisors to review the syllabus depth and your personal career roadmap.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['Technical counseling session', 'Response within 12 business hours', 'Program fitment review'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-violet-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'21px', fontWeight:800, marginBottom:'4px'}}>Advisor Callback</h3><p style={{fontSize:'13px', color:'var(--pe-text-dim)'}}>Receive personalized program guidance.</p></div>
                 <ApplyForm courseValue="Prompt Engineering" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="hidden sm:block"><div style={{fontSize:'10px', fontWeight:800, color:'var(--pe-text-dim)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px'}}>Prompt Strategy Pro</div><div style={{fontWeight:800}}>₹65,999 <span style={{fontSize:'12px', color:'var(--pe-primary)', marginLeft:'12px'}}>EMI ₹4,000/MO</span></div></div>
           <div className="flex gap-4 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-bold uppercase hidden lg:flex items-center gap-2 hover:text-violet-700 transition-all"><PhoneCall size={14} /> Talk to Advisor</button>
              <ApplyNowButton courseValue="Prompt Engineering" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEngineering;
