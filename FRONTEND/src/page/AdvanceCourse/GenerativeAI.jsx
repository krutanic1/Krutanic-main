import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ChevronDown, 
  ArrowRight,
  Zap, 
  Video,
  UserCheck,
  MessagesSquare,
  Cpu,
  Bot,
  Sparkles,
  Network,
  ShieldCheck,
  BrainCircuit,
  Code2,
  Terminal,
  Globe,
  Layers,
  Database,
  PhoneCall,
  Download,
  Rocket
} from "lucide-react";

import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";

import ToolStack from "./Components/ToolStack";
import TopOnePercent from "../../Components/TopOnePercent";
import DownloadBrochureButton from "./Components/DownloadBrochureButton";
import CountdownTimer from "./Components/CountdownTimer";
import genaiBrochure from "../../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";
import AdvanceBanner from "./Components/AdvanceBanner";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Projects", value: "12+ Live" },
  { label: "Batch", value: "Upcoming" },
];

const audience = [
  "Software Engineers",
  "Full-stack Developers",
  "CTOs & Tech Leads",
  "Product Founders",
  "Data Scientists",
  "AI Researchers",
  "Backend Engineers",
  "ML Engineers"
];

const cohorts = [
  {
    title: "AI Launchpad",
    exp: "1–3 Years",
    desc: "Master the fundamentals of LLMs, prompt engineering, and building your first agentic workflows.",
    accent: "from-blue-500 to-cyan-400"
  },
  {
    title: "AI Architect",
    exp: "3–9 Years",
    desc: "Architect complex multi-agent systems, RAG pipelines, and enterprise-grade AI applications.",
    accent: "from-purple-600 to-indigo-500"
  },
  {
    title: "AI Visionary",
    exp: "10+ Years",
    desc: "Strategic AI leadership, cost optimization, and driving organizational transformation with GenAI.",
    accent: "from-orange-500 to-red-500"
  }
];

const programOutline = [
  {
    phase: "Phase 1",
    weeks: "Weeks 1-2",
    title: "AI Foundations + LLM Basics",
    focus: "How LLMs work (tokens, context), and identifying business use cases.",
    outcome: "Strong foundation of AI systems and identifying real-world opportunities.",
    color: "#8B5CF6"
  },
  {
    phase: "Phase 2",
    weeks: "Weeks 3-4",
    title: "Advanced Prompt Engineering",
    focus: "Structured prompting (CoT, few-shot), context management, and reducing hallucinations.",
    outcome: "Generate high-quality outputs and build sophisticated prompt-based automation.",
    color: "#3B82F6"
  },
  {
    phase: "Phase 3",
    weeks: "Weeks 5-6",
    title: "AI Workflows + Mini Automation",
    focus: "AI workflows for marketing, sales, and operations. Task automation & system thinking.",
    outcome: "Build simple AI workflows and automate repetitive business tasks.",
    color: "#10B981"
  },
  {
    phase: "Phase 4",
    weeks: "Weeks 7-8",
    title: "Python Fundamentals for AI",
    focus: "Python basics, data structures, logic building, and file handling.",
    outcome: "Write basic scripts and understand the backend logic of AI systems.",
    color: "#F59E0B"
  },
  {
    phase: "Phase 5",
    weeks: "Weeks 9-10",
    title: "APIs + Data Integration",
    focus: "REST APIs, JSON, API calling via Python, and complex system integrations.",
    outcome: "Connect AI with external systems and build professional API-based workflows.",
    color: "#6366F1"
  },
  {
    phase: "Phase 6",
    weeks: "Weeks 11-12",
    title: "Agentic AI Systems (CORE DEPTH)",
    focus: "AI agents (single + multi-agent), planning, reasoning, and tool chaining.",
    outcome: "Build autonomous AI agents that execute complex multi-step workflows.",
    color: "#D946EF"
  },
  {
    phase: "Phase 7",
    weeks: "Weeks 13-14",
    title: "RAG Systems + Orchestration",
    focus: "Retrieval-Augmented Generation, Knowledge-based AI, and orchestration.",
    outcome: "Build advanced knowledge-based AI systems and handle real-world data.",
    color: "#F43F5E"
  },
  {
    phase: "Phase 8",
    weeks: "Weeks 15-16",
    title: "AI Systems + Business Automation",
    focus: "CRM automation, lead qualification, and end-to-end system design thinking.",
    outcome: "Build end-to-end AI systems that solve high-impact business problems.",
    color: "#EC4899"
  }
];

const capstoneProjects = [
  {
    title: "AI Routing Console",
    desc: "Dynamic model routing to optimize cost and performance across GPT-4, Claude, and Llama 3.",
    tags: ["Orchestration", "Cost-Ops"]
  },
  {
    title: "Enterprise Knowledge Graph",
    desc: "A RAG-powered system that connects Jira, Slack, and Notion for instant company-wide intelligence.",
    tags: ["RAG", "Data-Sync"]
  },
  {
    title: "Multi-Agent Sales Workflow",
    desc: "A team of agents that research leads, draft personalized emails, and schedule meetings autonomously.",
    tags: ["Agents", "Automation"]
  },
  {
    title: "AI Inference Serving Platform",
    desc: "High-throughput, low-latency model serving architecture with auto-scaling capabilities.",
    tags: ["Infrastructure", "LLMOps"]
  },
  {
    title: "Decision Dashboard",
    desc: "Executive dashboard that synthesizes market trends and internal data into strategic recommendations.",
    tags: ["Analytics", "Strategy"]
  },
  {
    title: "Support Automation Agent",
    desc: "Advanced customer support bot with tool access to refund systems and technical docs.",
    tags: ["Customer Success", "Tools"]
  }
];

const mentors = []; // Removed content

const faqCategories = {
  "Program Details": [
    { q: "Is this program for beginners?", a: "No, this is an advanced program. We recommend at least 1-2 years of software engineering experience or a strong foundation in Python and basic ML concepts." },
    { q: "What is the weekly time commitment?", a: "Expect to spend 10-12 hours per week, including 4 hours of live sessions and 6-8 hours of hands-on project work." },
    { q: "Will I get access to GPU resources?", a: "Yes, we provide managed compute environments and API credits for OpenAI, Anthropic, and Pinecone during the course." }
  ],
  "Career & Certification": [
    { q: "What kind of jobs can I get after this?", a: "Graduates typically move into roles like AI Engineer, LLM Architect, GenAI Lead, or Senior Backend Engineer (AI Systems)." },
    { q: "Is the certification industry-recognized?", a: "Yes, our certification is co-signed by our industrial partners and recognizes your ability to build production-grade agentic systems." }
  ]
};

const GenerativeAI = () => {
  const [activeFaqCat, setActiveFaqCat] = useState("Program Details");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    
    // Set body background for dark theme
    document.body.style.backgroundColor = "#06040e";
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.backgroundColor = ""; // Reset on unmount
    };
  }, []);


  return (
    <div className="genai-page bg-[#06040e] text-white font-sans selection:bg-purple-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');
        
        .genai-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }

        .glass-card {
          background: rgba(17, 17, 20, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .glow-purple { box-shadow: 0 0 40px -10px rgba(139, 92, 246, 0.3); }
        .glow-blue { box-shadow: 0 0 40px -10px rgba(59, 130, 246, 0.3); }
        .glow-teal { box-shadow: 0 0 40px -10px rgba(20, 184, 166, 0.3); }

        .premium-heading {
          line-height: 0.95;
          letter-spacing: -0.04em;
        }

        /* ═══ Hero Background System ═══════════════════════ */

        /* FIX 1: Near-pitch-black background */
        .hero-bg {
          background: linear-gradient(180deg, #08050f 0%, #06040e 50%, #04030a 100%);
        }

        /* FIX 7: Top dome — large ellipse bleeding above viewport */
        .hero-dome {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 500px;
          background: radial-gradient(
            ellipse at center top,
            rgba(120, 60, 255, 0.18) 0%,
            rgba(90,  40, 200, 0.10) 35%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* FIX 2 & 3: Horizontal spotlight beams — LEFT */
        .beam-left {
          position: absolute;
          left: 0;
          right: 48%;
          top: 28%;
          height: 160px;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.0)   0%,
            rgba(220, 210, 255, 0.04) 30%,
            rgba(200, 185, 255, 0.12) 60%,
            rgba(255, 255, 255, 0.88) 100%
          );
          clip-path: polygon(0 0, 100% 45%, 100% 55%, 0 100%);
          filter: blur(2px);
        }

        /* FIX 2 & 3: Horizontal spotlight beams — RIGHT (mirror) */
        .beam-right {
          position: absolute;
          right: 0;
          left: 48%;
          top: 28%;
          height: 160px;
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(
            270deg,
            rgba(255, 255, 255, 0.0)   0%,
            rgba(220, 210, 255, 0.04) 30%,
            rgba(200, 185, 255, 0.12) 60%,
            rgba(255, 255, 255, 0.88) 100%
          );
          clip-path: polygon(100% 0, 0 45%, 0 55%, 100% 100%);
          filter: blur(2px);
        }

        /* Marquee */
        .logo-marquee {
          position: relative;
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, white 10%, white 90%, transparent 100%);
        }
        .logo-track {
          display: flex;
          width: max-content;
          gap: 48px;
          animation: marquee 28s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Buttons */
        .btn-filled {
          background: #7c3aed;
          border-radius: 999px;
          color: white;
          font-weight: 600;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.40);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-filled:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(124, 58, 237, 0.60);
        }
        .btn-outline {
          background: rgba(15, 8, 35, 0.70);
          border: 1.5px solid rgba(100, 70, 200, 0.70);
          border-radius: 999px;
          color: white;
          font-weight: 600;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-outline:hover {
          background: rgba(25, 12, 55, 0.85);
          border-color: rgba(140, 90, 255, 1);
        }

        /* Mobile: pull wrappers back in, reduce opacity */
        @media (max-width: 768px) {
          .hero-dome { opacity: 0.6; }
        }

        /* ── Newton-style layered beam wrappers ── */

        /* Outer visual container for each side */
        .hero-visual-left,
        .hero-visual-right {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
        }
        .hero-visual-left  { left: 0; }
        .hero-visual-right { right: 0; }

        /* Inner wrappers — shifted with translate3d for precision */
        .beam-top-wrapper {
          position: absolute;
          will-change: transform;
        }

        /* LEFT SIDE: top image wrapper */
        .hero-visual-left .beam-top-wrapper {
          top: 0;
          left: 0;
          transform: translate3d(-8rem, -2rem, 0px);
        }

        /* RIGHT SIDE: top image wrapper */
        .hero-visual-right .beam-top-wrapper {
          top: 0;
          right: 0;
          transform: translate3d(8rem, -2rem, 0px);
        }

        /* Images fill their wrappers */
        .beam-top-wrapper img {
          display: block;
          width: 42vw;
          max-width: 600px;
          height: auto;
          user-select: none;
        }

        /* Mobile: Center vertically and flatten transforms */
        @media (max-width: 768px) {
          .hero-visual-left,
          .hero-visual-right {
            height: 300px;
            top: 45%;
            transform: translateY(-50%);
          }
          .hero-visual-left .beam-top-wrapper {
            transform: translate3d(-3rem, 0px, 0px);
          }
          .hero-visual-right .beam-top-wrapper {
            transform: translate3d(3rem, 0px, 0px);
          }
          .beam-top-wrapper img {
            width: 58vw;
            opacity: 0.35;
          }
        }

        .sticky-bar { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: #7c3aed; 
          color: #fff;
          z-index: 100; 
          transform: translateY(100%); 
          transition: 0.4s; 
          display: flex; 
          align-items: center; 
          box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
        }
        .sticky-bar.visible { transform: translateY(0); }
        .countdown-box { background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums; font-weight: 800; }

      `}</style>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-36 pb-24 px-6 overflow-hidden hero-bg">

        {/* z=1 — Top dome glow */}
        <div className="hero-dome" />

        {/* ── Left side: layered beam wrappers ── */}
        <div className="hero-visual-left">
          {/* Top half of left beam */}
          <div className="beam-top-wrapper">
            <img
              src="https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/698dd2b687c12b1e93d15b31_Group%201000005562.avif"
              alt=""
              draggable={false}
            />
          </div>
        </div>

        {/* ── Right side: layered beam wrappers ── */}
        <div className="hero-visual-right">
          {/* Top half of right beam */}
          <div className="beam-top-wrapper">
            <img
              src="https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/698dd2b6484bd14db961267a_Group%2048096211.avif"
              alt=""
              draggable={false}
            />
          </div>
        </div>

        {/* z=10 — All content */}
        <div className="relative z-10 w-full max-w-[1100px] mx-auto text-center px-4">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 inline-flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold tracking-[0.10em] uppercase"
            style={{
              border: '1px solid rgba(140, 100, 255, 0.5)',
              background: 'rgba(60, 30, 120, 0.30)',
              color: 'rgba(220, 200, 255, 0.9)',
            }}
          >
            <Sparkles size={12} /> 24 Weeks Job-Focused Program
          </motion.div>

          {/* FIX 4: Dominant headline — fills 80%+ viewport width */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="font-black font-outfit mb-6 select-none"
            style={{ fontSize: 'clamp(52px, 7.5vw, 100px)', lineHeight: 0.92, letterSpacing: '-0.04em' }}
          >
            {/* Line 1: Pure white */}
            <span className="text-white block">Agentic AI &amp;</span>
            {/* Line 2: purple → sky-blue → cyan gradient */}
            <span
              className="block"
              style={{
                background: 'linear-gradient(90deg, #a855f7 0%, #60a5fa 50%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Generative AI
            </span>
          </motion.h1>

          {/* FIX 5: Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', color: 'rgba(220, 215, 255, 0.75)', marginTop: '20px', marginBottom: '32px', fontWeight: 400 }}
          >
            Master the future of autonomous intelligence and business automation.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-wrap gap-4 justify-center items-center mb-14"
          >
            <ApplyNowButton
              courseValue="Generative AI"
              className="btn-filled !px-10 !py-[14px] !text-[15px]"
            />
            <DownloadBrochureButton
              courseValue="Generative AI"
              brochureLink={genaiBrochure}
              className="btn-outline px-10 py-[14px] text-[15px] flex items-center gap-2.5"
              label={<><Download size={16} /> Download Brochure</>}
            />
          </motion.div>
        </div>

        {/* FIX 6: Marquee with label */}
        <div className="relative z-10 w-full text-center">
          <p
            className="mb-4 font-semibold tracking-widest uppercase"
            style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', letterSpacing: '0.14em' }}
          >
            Learn Most Trending AI Tools
          </p>
          <div className="logo-marquee">
            <div className="logo-track">
              {["OpenAI","Anthropic","LangChain","Pinecone","NVIDIA","Meta AI","Google DeepMind","Microsoft Azure AI","Mistral","CrewAI","HuggingFace","AutoGen"].map((name, i) => (
                <span key={i} className="font-semibold whitespace-nowrap select-none font-outfit flex items-center gap-3"
                  style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)' }}>
                  {name} <span style={{ color: 'rgba(168,85,247,0.6)', fontSize: '20px', lineHeight: 1 }}>•</span>
                </span>
              ))}
              {["OpenAI","Anthropic","LangChain","Pinecone","NVIDIA","Meta AI","Google DeepMind","Microsoft Azure AI","Mistral","CrewAI","HuggingFace","AutoGen"].map((name, i) => (
                <span key={i+"_dup"} className="font-semibold whitespace-nowrap select-none font-outfit flex items-center gap-3"
                  style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)' }}>
                  {name} <span style={{ color: 'rgba(168,85,247,0.6)', fontSize: '20px', lineHeight: 1 }}>•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Stats Bar - Moved below Hero for cleaner first fold */}
      <section className="relative z-10 -mt-10 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full glass-card p-6 md:p-8"
          >
            {heroStats.map((stat, i) => (
              <div key={i} className="text-center md:text-left border-r border-white/5 last:border-0 pr-4">
                <div className="text-2xl md:text-3xl font-black font-outfit mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div style={{ background: '#06040e' }}>
         <TopOnePercent 
           accentColor="#8B5CF6" 
           badge="Advanced Program"
           subtitle="Master the transition from traditional engineering to AI-first architectures. Gain the technical depth required to build production-grade agentic systems."
         />
      </div>

      {/* Who Should Enroll */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Who should enroll</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">Engineered for tech professionals ready to transition from traditional software to AI-first architectures.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {audience.map((tag, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
                className="px-6 py-3 glass-card rounded-full text-sm md:text-base font-semibold border-white/5 transition-all cursor-default"
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Cohort */}
      <section className="py-24 px-6 bg-[#0b0b0f] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-purple-900/5 blur-[120px] rounded-full pointer-events-none translate-y-[-50%]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Find your cohort</h2>
            <p className="text-gray-400 text-lg">Tailored learning paths for every stage of your technical leadership journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cohorts.map((cohort, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-10 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cohort.accent} opacity-10 blur-3xl group-hover:opacity-30 transition-all`} />
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{cohort.exp} EXP</div>
                <h3 className="text-2xl font-black font-outfit mb-4">{cohort.title}</h3>
                <p className="text-gray-400 leading-relaxed">{cohort.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Outline */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Program Roadmap</h2>
            <p className="text-gray-400 text-lg">A rigorous 16-week journey from LLM fundamentals to production AI systems.</p>
          </div>
          
          <div className="relative">
            <div className="phase-connector" />
            <div className="space-y-12">
              {programOutline.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center"
                >
                  {/* Left Side */}
                  <div className={`${i % 2 !== 0 ? 'md:order-3' : 'md:text-right'}`}>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{phase.weeks}</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: phase.color }}>{phase.phase}: {phase.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{phase.focus}</p>
                  </div>

                  {/* Dot */}
                  <div className="z-10 flex justify-center order-first md:order-2">
                    <div className="w-12 h-12 rounded-full border-4 border-[#050505] flex items-center justify-center font-black text-xs" style={{ backgroundColor: phase.color }}>
                      {i}
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className={`glass-card p-6 border-l-4 ${i % 2 === 0 ? 'md:order-3' : 'md:order-1'}`} style={{ borderLeftColor: phase.color }}>
                    <div className="flex items-start gap-3">
                      <Zap size={18} className="mt-1 flex-shrink-0" style={{ color: phase.color }} />
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Key Outcome</div>
                        <p className="text-sm font-semibold leading-relaxed">{phase.outcome}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capstone Projects */}
      <section className="py-24 px-6 bg-[#0b0b0f] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-900/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Flagship projects</h2>
              <p className="text-gray-400 text-lg">Build a portfolio of AI systems that solve real enterprise problems. No toy projects, only production-grade code.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capstoneProjects.map((project, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-8 group transition-all hover:border-purple-500/30"
              >
                <div className="flex gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Outcomes */}
      <section className="pt-24 pb-12 px-6 bg-[#0b0b0f] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Learner outcomes and brands</h2>
          <p className="text-gray-400 text-lg">Our graduates have successfully transitioned into AI roles at industry-leading global firms.</p>
        </div>
        <ClientsCarousel />
      </section>

      {/* Certification Section */}
      <section className="pt-0 pb-12 px-6 relative overflow-hidden bg-[#0b0b0f]">
        <div className="max-w-7xl mx-auto relative z-10">
          <Certification isDark={true} />
           <ProgramCohorts courseValue="Generative AI" date="Upcoming" />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pt-12 pb-24 px-6 bg-[#0b0b0f] relative overflow-hidden" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Program investment</h2>
            <p className="text-gray-400 text-lg">Transparent pricing with flexible payment options and 0% EMI facility.</p>
          </div>

          <div className="glass-card p-8 md:p-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-6">Total Program Fee</div>
              <div className="text-6xl md:text-8xl font-black font-outfit mb-8 tracking-tighter">₹1,21,999</div>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                Covers the full 24-week curriculum, 12+ live projects, 1-on-1 mentorship, and lifetime access to the Agentic AI community.
              </p>
              <div className="flex flex-wrap gap-4">
                <ApplyNowButton courseValue="Generative AI" className="btn-filled !px-10 !py-4" />
                <DownloadBrochureButton courseValue="Generative AI" brochureLink={genaiBrochure} />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Booking Amount", value: "₹10,000", desc: "Secure your seat in the upcoming cohort" },
                { label: "Installment 1", value: "₹37,333", desc: "Pay before Core Training starts" },
                { label: "Installment 2", value: "₹37,333", desc: "Pay before Mid-term evaluation" },
                { label: "Installment 3", value: "₹37,333", desc: "Pay before Advanced Agentic modules" }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xl font-black font-outfit text-white group-hover:text-purple-400 transition-colors">{item.value}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                </div>
              ))}
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-60 text-xs font-bold uppercase tracking-widest">
                <span>0% Interest EMI Starts at ₹10,166/mo</span>
                <Zap size={14} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdvanceBanner />

      {/* FAQ Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-900/5 blur-[120px] rounded-full pointer-events-none translate-x-[-30%]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 premium-heading">Common queries</h2>
            <p className="text-gray-400 text-lg">Everything you need to know about the program.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12">
            <div className="space-y-2">
              {Object.keys(faqCategories).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeFaqCat === cat ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {faqCategories[activeFaqCat].map((faq, i) => (
                <div
                  key={i}
                  className="glass-card overflow-hidden cursor-pointer group"
                  onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                >
                  <div className="p-6 flex justify-between items-center gap-4">
                    <h4 className="font-bold group-hover:text-purple-400 transition-colors">{faq.q}</h4>
                    <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${openFaqIdx === i ? 'rotate-180 text-purple-400' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openFaqIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
         <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-7xl font-black font-outfit mb-8 tracking-tighter">Ready to architect the future?</h2>
            <p className="text-xl text-gray-400 mb-12">Join the next cohort of AI leaders and start building agentic systems that matter.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <ApplyNowButton courseValue="Generative AI" />
               <button onClick={() => window.location.href='tel:9380736449'} className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 font-bold">
                  <PhoneCall size={18} /> Request a Callback
               </button>
            </div>
         </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
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
                 courseValue="Generative AI" 
                 label="Connect Now" 
                 className="!bg-white !from-white !to-white !text-purple-600 !px-10 !py-3 !rounded-lg !shadow-none hover:!scale-105"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GenerativeAI;
