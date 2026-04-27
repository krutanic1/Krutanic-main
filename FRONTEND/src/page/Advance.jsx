import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Users, Target, 
  CheckCircle2, Clock, Code2, LineChart, 
  Megaphone, Kanban, BrainCircuit,
  FileText, MessageSquare, MonitorPlay, 
  Award, Star, ShieldCheck, Workflow
} from "lucide-react";
import { Toaster } from "react-hot-toast";

import ClientsCarousel from "../Components/our_alumni";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import CountdownTimer from "./AdvanceCourse/Components/CountdownTimer";

const programs = [
  { 
    id: "mern", 
    icon: <Code2 size={24}/>, 
    name: "MERN Stack Engineering", 
    positioning: "Build secure, production-ready full-stack applications.", 
    dur: "24 Weeks", 
    idealFor: "Aspiring software engineers scaling APIs.", 
    tools: ["React", "Node.js", "MongoDB"], 
    link: "/MernStack", 
    cat: "Engineering", 
    accent: "bg-blue-600",
    lightAccent: "bg-blue-50 text-blue-700 border-blue-100" 
  },
  { 
    id: "ds", 
    icon: <DatabaseIcon size={24}/>, 
    name: "Data Science", 
    positioning: "Learn data science, machine learning, and model deployment.", 
    dur: "24 Weeks", 
    idealFor: "Analysts moving into machine learning.", 
    tools: ["Python", "PyTorch", "Scikit"], 
    link: "/DataScience", 
    cat: "AI & Data", 
    accent: "bg-indigo-600",
    lightAccent: "bg-indigo-50 text-indigo-700 border-indigo-100"
  },
  { 
    id: "da", 
    icon: <LineChart size={24}/>, 
    name: "Data Analytics", 
    positioning: "Master data visualization, reporting, and BI.", 
    dur: "24 Weeks", 
    idealFor: "Professionals driving data decisions.", 
    tools: ["PowerBI", "SQL", "Tableau"], 
    link: "/DataAnalytics", 
    cat: "AI & Data", 
    accent: "bg-indigo-600",
    lightAccent: "bg-indigo-50 text-indigo-700 border-indigo-100"
  },
  { 
    id: "dm", 
    icon: <Megaphone size={24}/>, 
    name: "Digital Marketing", 
    positioning: "Execute SEO, paid media, and growth campaigns.", 
    dur: "24 Weeks", 
    idealFor: "Marketers shifting to performance.", 
    tools: ["Meta Ads", "GA4", "SEO"], 
    link: "/DigitalMarket", 
    cat: "Business & Growth", 
    accent: "bg-emerald-600",
    lightAccent: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  { 
    id: "pm", 
    icon: <Kanban size={24}/>, 
    name: "Product Management", 
    positioning: "Learn product strategy, roadmapping, and execution.", 
    dur: "24 Weeks", 
    idealFor: "PMs transitioning from tech/marketing.", 
    tools: ["Jira", "Agile", "Analytics"], 
    link: "/ProductManagement", 
    cat: "Business & Growth", 
    accent: "bg-sky-600",
    lightAccent: "bg-sky-50 text-sky-700 border-sky-100"
  },
  { 
    id: "pe", 
    icon: <BrainCircuit size={24}/>, 
    name: "Prompt Engineering", 
    positioning: "Design robust GenAI workflows and guardrails.", 
    dur: "24 Weeks", 
    idealFor: "Leaders implementing LLM solutions.", 
    tools: ["Prompting", "LangChain", "LLMs"], 
    link: "/PromptEngineering", 
    cat: "GenAI", 
    accent: "bg-purple-600",
    lightAccent: "bg-purple-50 text-purple-700 border-purple-100" 
  },
//   { 
//     id: "genai", 
//     icon: <Sparkles size={24}/>, 
//     name: "Generative AI", 
//     positioning: "Architect multi-agent systems and RAG pipelines.", 
//     dur: "24 Weeks", 
//     idealFor: "Software engineers & AI architects.", 
//     tools: ["RAG", "Multi-Agent", "LangGraph"], 
//     link: "/GenerativeAI", 
//     cat: "GenAI", 
//     accent: "bg-fuchsia-600",
//     lightAccent: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" 
//   },
];


function DatabaseIcon(props) {
   return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
         <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
         <path d="M3 12A9 3 0 0 0 21 12"></path>
      </svg>
   )
}

const heroData = [
  {
    id: "engineering",
    tab: "Engineering",
    eyebrow: "Software Engineering",
    title: "Build full-stack systems and production-ready applications.",
    desc: "Master architectural patterns, API development, and secure deployments. Transition directly into a highly capable full-stack engineering role.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    badgeLabel: "Admissions Open",
    card1Label: "Career Focus", card1Value: "Full-Stack Roles", card1Icon: <Code2 size={20}/>,
    card2Label: "Format", card2Value: "24-Week Cohort", card2Icon: <Clock size={20}/>,
    accentFrom: "from-blue-500/40", accentTo: "to-cyan-500/40", glowBg: "bg-blue-400"
  },
  {
    id: "data",
    tab: "AI & Data",
    eyebrow: "Data Science & Analytics",
    title: "Advance into machine learning and model-driven decision making.",
    desc: "Extract business intelligence from raw data. Learn predictive modeling, deep learning architectures, and deploy robust ML pipelines.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    badgeLabel: "AI & Data Track",
    card1Label: "Career Focus", card1Value: "Data Science Roles", card1Icon: <DatabaseIcon size={20}/>,
    card2Label: "Format", card2Value: "24-Week Cohort", card2Icon: <Clock size={20}/>,
    accentFrom: "from-indigo-500/40", accentTo: "to-purple-500/40", glowBg: "bg-indigo-400"
  },
  {
    id: "product",
    tab: "Product",
    eyebrow: "Product Management",
    title: "Move into product strategy, execution, and growth ownership.",
    desc: "Lead cross-functional teams and execute go-to-market strategies. Master roadmapping, agile workflows, and data-driven prioritization.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    badgeLabel: "Product Cohort",
    card1Label: "Career Focus", card1Value: "Product Leadership", card1Icon: <Target size={20}/>,
    card2Label: "Format", card2Value: "24-Week Cohort", card2Icon: <Clock size={20}/>,
    accentFrom: "from-emerald-500/40", accentTo: "to-teal-500/40", glowBg: "bg-emerald-400"
  },
  {
    id: "marketing",
    tab: "Marketing",
    eyebrow: "Digital Marketing",
    title: "Build campaign, analytics, and performance marketing capability.",
    desc: "Drive measurable ROI through advanced SEO manipulation, high-budget paid media execution, and deep conversion rate optimization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    badgeLabel: "Growth Track",
    card1Label: "Career Focus", card1Value: "Performance Marketing", card1Icon: <LineChart size={20}/>,
    card2Label: "Format", card2Value: "24-Week Cohort", card2Icon: <Clock size={20}/>,
    accentFrom: "from-orange-500/40", accentTo: "to-amber-500/40", glowBg: "bg-orange-400"
  },
  {
    id: "genai",
    tab: "GenAI",
    eyebrow: "Generative AI",
    title: "Learn prompting, workflows, and practical AI implementation.",
    desc: "Architect LLM-powered applications and integrate sophisticated GenAI capabilities directly into enterprise products cleanly.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    badgeLabel: "Innovation Track",
    card1Label: "Career Focus", card1Value: "AI Implementation", card1Icon: <BrainCircuit size={20}/>,
    card2Label: "Format", card2Value: "24-Week Cohort", card2Icon: <Clock size={20}/>,
    accentFrom: "from-purple-500/40", accentTo: "to-pink-500/40", glowBg: "bg-purple-400"
  }
];

const Advance = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const filteredPrograms = filter === "All" ? programs : programs.filter(p => p.cat === filter);
  const curHero = heroData[activeHeroIdx];

  return (
    <div className="bg-[#FCFCFD] text-slate-900 font-['Plus_Jakarta_Sans'] min-h-screen">
      <Helmet>
        <title>Advanced Programs | Krutanic</title>
        <meta name="description" content="Explore advanced programs in software, data, product, and marketing." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

        .k-shell { width: 100%; max-width: 1240px; margin: 0 auto; padding: 0 24px; }
        .k-section { padding: 112px 0; }
        
        .k-title { font-family: 'Outfit', sans-serif; font-size: clamp(36px, 4.5vw, 42px); font-weight: 700; color: #0F172A; letter-spacing: -0.02em; line-height: 1.15; }
        .k-subtitle { font-size: 18px; color: #475569; line-height: 1.6; max-width: 600px; }

        .btn-primary { background: #0F172A; color: white; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; transition: 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .btn-primary:hover { background: #1E293B; transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: #0F172A; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; border: 1px solid #CBD5E1; transition: 0.2s; }
        .btn-ghost:hover { background: #F8FAFC; border-color: #94A3B8; }

        .k-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .k-card:hover { border-color: #CBD5E1; box-shadow: 0 16px 32px -8px rgba(0,0,0,0.08); transform: translateY(-4px); }
        
        .sticky-hub { 
          position: fixed; 
          bottom: 0; 
          left: 0; 
          width: 100%; 
          height: 80px; 
          background: #6D28D9; 
          color: #fff;
          z-index: 100; 
          transform: translateY(100%); 
          transition: 0.4s; 
          display: flex; 
          align-items: center; 
          box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
        }
        .sticky-hub.visible { transform: translateY(0); }
        .countdown-box { background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-variant-numeric: tabular-nums; }

        .k-gradient-text { background: linear-gradient(135deg, #0F172A 0%, #064E3B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        @keyframes subtleFadeSlide {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes elegantCrossfade {
          0% { opacity: 0; transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-subtle-slide { animation: subtleFadeSlide 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-elegant-crossfade { animation: elegantCrossfade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>

      {/* 1. HERO SECTION (Dynamic Premium Banner) */}
      <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-28 overflow-hidden border-b border-teal-900 transition-colors duration-1000" style={{ background: "linear-gradient(135deg, #0F172A 0%, #064E3B 100%)" }}>
         {/* Subtle overlay elements */}
         <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwaGF0aCBkPSJNMCAwdjhoOHYtOGgtOHptNCA0YzAgMS4xLS45IDItMiAyUyAwIDUuMSAwIDQgLjkgMiAyIDIgNCAyLjkgNCA0em0yIDBjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjE1Ii8+PC9zdmc+')] mix-blend-overlay"></div>
         {/* Dynamic Glow Background */}
         <div key={curHero.id + "glow"} className={`animate-elegant-crossfade absolute -top-60 -right-20 w-[600px] h-[600px] ${curHero.glowBg} rounded-full blur-[160px] opacity-20 pointer-events-none`}></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#022c22]/80 to-transparent pointer-events-none z-0"></div>

         <div className="k-shell relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
               
               {/* Left Column */}
               <div className="flex flex-col h-full justify-center min-h-[450px]">
                  {/* Eyebrow Label */}
                  <div key={curHero.id + "eyebrow"} className="animate-subtle-slide inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 shadow-inner border border-white/20 rounded-full text-[11px] font-bold text-white/90 uppercase tracking-widest mb-6 backdrop-blur-sm w-fit">
                     <Award size={14}/> {curHero.eyebrow}
                  </div>
                  
                  {/* Headline */}
                  <h1 key={curHero.id + "headline"} className="animate-subtle-slide font-outfit text-4xl sm:text-5xl lg:text-[48px] font-bold text-white leading-[1.15] tracking-tight mb-5 min-h-[110px] lg:min-h-[120px]">
                     {curHero.title}
                  </h1>
                  
                  {/* Supporting Paragraph */}
                  <p key={curHero.id + "desc"} className="animate-subtle-slide text-[17px] text-emerald-50/70 leading-relaxed mb-10 max-w-[480px] font-medium min-h-[85px]">
                     {curHero.desc}
                  </p>
                  
                  {/* Dynamic Category Selector (Tabs) */}
                  <div className="flex flex-wrap gap-2 mb-10">
                     {heroData.map((tab, idx) => (
                        <button 
                           key={tab.id} 
                           onClick={() => setActiveHeroIdx(idx)}
                           className={`px-4 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-all duration-300 border ${
                              activeHeroIdx === idx 
                              ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/15'
                           }`}
                        >
                           {tab.tab}
                        </button>
                     ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                     <button onClick={() => document.getElementById('catalog').scrollIntoView({behavior:'smooth'})} className="bg-emerald-500 text-white px-7 py-3.5 rounded-lg font-bold text-sm hover:bg-emerald-400 transition-colors shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] flex justify-center items-center gap-2 border border-emerald-400">
                        View Details <ArrowRight size={16}/>
                     </button>
                     <button onClick={() => setShowApplyForm(true)} className="bg-transparent text-white px-7 py-3.5 rounded-lg font-bold text-sm border border-white/20 hover:bg-white/10 transition-colors">
                        Request Syllabus
                     </button>
                  </div>

                  {/* Metadata Cards */}
                  <div key={curHero.id + "cards"} className="grid grid-cols-2 gap-4 animate-subtle-slide">
                     <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-slate-900/60 transition-colors">
                        <div className="w-10 h-10 bg-white/10 rounded-lg text-white/90 flex items-center justify-center shrink-0 border border-white/10">{curHero.card1Icon}</div>
                        <div>
                           <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-0.5">{curHero.card1Label}</p>
                           <p className="text-[13px] font-bold text-white">{curHero.card1Value}</p>
                        </div>
                     </div>
                     <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-slate-900/60 transition-colors">
                        <div className="w-10 h-10 bg-white/10 rounded-lg text-white/90 flex items-center justify-center shrink-0 border border-white/10">{curHero.card2Icon}</div>
                        <div>
                           <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-0.5">{curHero.card2Label}</p>
                           <p className="text-[13px] font-bold text-white">{curHero.card2Value}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column (Visual Banner) */}
               <div className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 h-[480px]">
                  {/* Dynamic Gradient Behind Image */}
                  <div key={curHero.id + "gradient"} className={`animate-elegant-crossfade absolute inset-0 bg-gradient-to-tr ${curHero.accentFrom} ${curHero.accentTo} rounded-[28px] blur-2xl transform scale-105 opacity-60`}></div>
                  
                  <div className="relative bg-slate-800 rounded-[28px] border border-white/20 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl h-full flex flex-col">
                     <div className="absolute top-4 right-4 p-0 z-20">
                        <div key={curHero.id + "badge"} className="animate-subtle-slide bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 border border-white/50 cursor-default">
                           <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                           <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">{curHero.badgeLabel}</span>
                        </div>
                     </div>
                     
                     <img 
                        key={curHero.id + "img"}
                        src={curHero.image} 
                        alt={curHero.eyebrow} 
                        className="animate-elegant-crossfade w-full h-full object-cover rounded-[20px] opacity-90 transition-transform duration-1000 hover:scale-[1.03]"
                     />
                     
                     <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="bg-slate-900/85 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                 <Users size={18} className="text-blue-300"/>
                              </div>
                              <div>
                                 <p className="text-[10px] text-blue-200/80 uppercase tracking-widest font-bold mb-0.5">Mentor-Led Delivery</p>
                                 <p className="text-[13px] font-bold text-white">Strictly Limited Batch Sizes</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* 2. PROGRAM CATEGORY RAIL & CATALOG */}
      <section className="k-section bg-[#F8FAFC]" id="catalog">
         <div className="k-shell">
            <div className="mb-14 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                  <h2 className="k-title mb-4 max-w-xl">Discover Advanced Programs</h2>
                  <p className="text-slate-500 text-base max-w-md">Role-aligned curriculums designed to help you specialize and transition safely.</p>
               </div>
               
               {/* Segmented Control */}
               <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/50 rounded-xl border border-slate-200/60 shadow-inner">
                  {["All", "Engineering", "AI & Data", "Business & Growth", "GenAI"].map(c => (
                     <button 
                        key={c} 
                        onClick={() => setFilter(c)} 
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                           filter === c 
                           ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                           : 'text-slate-500 hover:text-slate-900 hover:bg-white/50 border border-transparent'
                        }`}
                     >
                        {c}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPrograms.map(p => (
                  <div key={p.id} className="k-card flex flex-col overflow-hidden relative group bg-white cursor-pointer" onClick={() => navigate(p.link)}>
                     {/* Top Accent Stripe */}
                     <div className={`absolute top-0 left-0 w-full h-1.5 ${p.accent} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                     
                     <div className="p-8 pb-10 flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                           <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${p.lightAccent}`}>
                              {p.cat}
                           </div>
                           <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                              <Clock size={12}/> {p.dur}
                           </span>
                        </div>

                        <h3 className="text-[22px] font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-[1.3]">{p.name}</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed flex-grow">{p.positioning}</p>
                        
                        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 mb-8">
                           <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Ideal for</p>
                           <p className="text-[13px] text-slate-700 font-semibold leading-relaxed">{p.idealFor}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                           {p.tools.map(t => (
                              <span key={t} className="text-[11px] font-bold bg-white border border-slate-200 text-slate-500 px-2.5 py-1 rounded-md shadow-sm">
                                 {t}
                              </span>
                           ))}
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between group-hover:border-emerald-100 transition-colors">
                           <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">View Program Details</span>
                           <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                              <ArrowRight size={14}/>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 3. WHY KRUTANIC (Value Framework) */}
      <section className="k-section bg-[#F0F4F8] border-t border-slate-200 overflow-hidden relative">
         {/* Subtle background abstract element */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-200/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
         
         <div className="k-shell relative z-10">
            <div className="mb-16 max-w-2xl">
               <h2 className="k-title mb-6">Why Krutanic Advanced Programs</h2>
               <p className="k-subtitle text-slate-600">We prioritize structured learning, applied technical frameworks, and measurable role readiness over simple video consumption.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Highlighted Master Pillar */}
               <div className="lg:col-span-7 bg-[#0F172A] rounded-2xl p-10 md:p-14 border border-slate-800 shadow-xl flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-150"></div>
                  
                  <div className="relative z-10">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6 backdrop-blur-sm">
                        <CheckCircle2 size={12}/> The Methodology
                     </div>
                     <h3 className="font-outfit text-3xl md:text-4xl font-bold text-white leading-[1.2] mb-6">Structured 24-week professional curriculums</h3>
                     <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-10 max-w-lg">
                        Follow an intentional syllabus that guides you from fundamental mental models to the deployment of enterprise-grade projects. Designed for working professionals managing transition timelines.
                     </p>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-semibold text-slate-300 bg-white/5 p-6 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Step-by-step logic</div>
                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Code-review driven</div>
                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Weekly strict tracking</div>
                        <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Predictable outcomes</div>
                     </div>
                  </div>
               </div>
               
               {/* Supporting Pillars */}
               <div className="lg:col-span-5 flex flex-col gap-8">
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center relative overflow-hidden">
                     <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                        <Users size={20}/>
                     </div>
                     <h4 className="text-lg font-bold text-slate-900 mb-3">Mentor-led technical checks</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">
                        Execute tasks and receive direct, architectural feedback from industry engineers. It stops you from building bad habits.
                     </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center relative overflow-hidden">
                     <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                        <MonitorPlay size={20}/>
                     </div>
                     <h4 className="text-lg font-bold text-slate-900 mb-3">Industry-relevant tooling</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">
                        Configure exactly the same software, frameworks, and deployment pipelines utilized actively by modern tech teams.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. EDUCATIONAL MODEL (Process) */}
      <section className="py-24 bg-white border-t border-slate-200">
         <div className="k-shell">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Pedagogy</span>
               <h2 className="font-outfit text-3xl md:text-4xl font-bold text-slate-900 mb-6">A disciplined system sequence</h2>
               <p className="text-lg text-slate-500 mx-auto leading-relaxed">
                  We rely on a cyclical process of absorbing models, executing code, and receiving highly targeted critique.
               </p>
            </div>

            <div className="relative">
               {/* Connecting Line Desktop */}
               <div className="hidden lg:block absolute top-[45px] left-10 right-10 h-[2px] bg-slate-100 z-0"></div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-6 relative z-10">
                  {[
                     { step: "01", icon: <BrainCircuit size={20}/>, title: "Learn", desc: "Formulate mental models via expert-led framework sessions." },
                     { step: "02", icon: <Code2 size={20}/>, title: "Practice", desc: "Execute weekly assignments to lock in syntax understanding." },
                     { step: "03", icon: <Kanban size={20}/>, title: "Build", desc: "Develop end-to-end portfolio projects showing capability." },
                     { step: "04", icon: <MessageSquare size={20}/>, title: "Review", desc: "Parse direct technical feedback from reviewers." },
                     { step: "05", icon: <Target size={20}/>, title: "Verify", desc: "Clear mock interviews before pursuing live interviews." }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col relative group">
                        <div className="w-24 h-24 rounded-full bg-white border-8 border-[#FCFCFD] shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center mb-6 z-10 mx-auto lg:mx-0 transition-transform group-hover:scale-105">
                           <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold border-2 border-white">{item.step}</span>
                           <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
                              {item.icon}
                           </div>
                        </div>
                        <div className="text-center lg:text-left">
                           <h4 className="text-[17px] font-bold text-slate-900 mb-3">{item.title}</h4>
                           <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. OUTCOMES & LEARNER SUPPORT (Matrix) */}
      <section className="py-24 relative bg-[#0B1121] overflow-hidden">
         {/* Premium subtle glow in dark BG */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="k-shell relative z-10">
            <div className="mb-16 md:flex md:justify-between md:items-end border-b border-white/10 pb-8">
               <div className="max-w-2xl">
                  <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-4">Outcomes & Career Scaffolding</h2>
                  <p className="text-slate-400 text-lg">Beyond the curriculum, we engineer an ecosystem designed to optimize your market visibility.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                     <Workflow size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Execution</h4>
                  <ul className="space-y-4">
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Live mentor sessions</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Tool-based environments</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Weekly code reviews</li>
                  </ul>
               </div>

               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors relative">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                     <FileText size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Portfolio</h4>
                  <ul className="space-y-4">
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Applied capstones</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> GitHub repository review</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Artifact generation</li>
                  </ul>
               </div>

               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                     <Target size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Transition</h4>
                  <ul className="space-y-4">
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Technical mock prep</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> Resume engineering</li>
                     <li className="text-sm text-slate-400 flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div> LinkedIn optimization</li>
                  </ul>
               </div>

               <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-emerald-900/20 transition-colors border-emerald-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20"><ShieldCheck size={100} className="text-emerald-500"/></div>
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center mb-6">
                     <Award size={24} />
                  </div>
                  <h4 className="relative z-10 text-sm font-bold text-white mb-6 uppercase tracking-widest">Verification</h4>
                  <ul className="relative z-10 space-y-4">
                     <li className="text-sm text-slate-300 font-medium flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div> Credential issuance</li>
                     <li className="text-sm text-slate-300 font-medium flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div> Placement referrals</li>
                     <li className="text-sm text-slate-300 font-medium flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div> Ongoing network</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 6. LEARNER TRANSITIONS */}
      <section className="py-24 bg-[#F8FAFC]">
         <div className="k-shell">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="k-title mb-4">Demonstrated Transitions</h2>
               <p className="text-lg text-slate-500">Professionals repositioning into high-growth, technically demanding roles.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
               {/* Featured Editoral Story */}
               <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-slate-100 group-hover:text-slate-200 transition-colors"><Star size={120}/></div>
                  
                  <div className="relative z-10 flex-grow">
                     <div className="flex gap-1 mb-8 text-amber-400">
                        <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
                     </div>
                     <h3 className="text-2xl md:text-[28px] font-outfit text-slate-900 leading-[1.4] mb-10 text-balance">
                        “The structured curriculum and intense feedback loop on my casework helped me formulate strategy the exact way tech hiring managers expect. It was a complete professional reset.”
                     </h3>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-8 mt-auto">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 font-outfit text-xl">
                           AS
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-[15px]">Ananya Sharma</p>
                           <p className="text-sm font-medium text-slate-500">Data Analyst → Product Manager</p>
                        </div>
                     </div>
                     <span className="hidden sm:block px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">Product Track</span>
                  </div>
               </div>
               
               {/* Supporting Stories */}
               <div className="flex flex-col gap-6 lg:gap-8">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex-1 flex flex-col justify-between relative overflow-hidden">
                     <p className="text-slate-700 text-[15px] leading-relaxed mb-8 flex-grow relative z-10">
                        “Watching logic scale into deployed APIs under mentor guidance gave me the architectural confidence to pursue senior backend roles.”
                     </p>
                     <div className="border-t border-slate-100 pt-5 flex items-center gap-3 relative z-10 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">RG</div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">Rohan Gupta</p>
                           <p className="text-[12px] text-slate-500 font-medium">Software Engineer</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 flex-1 flex flex-col justify-between relative overflow-hidden">
                     <p className="text-slate-700 text-[15px] leading-relaxed mb-8 flex-grow relative z-10">
                        “Running live ad-sets and performing advanced analytics audits completely redefined my workflow.”
                     </p>
                     <div className="border-t border-slate-100 pt-5 flex items-center gap-3 relative z-10 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">SV</div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">Sanya Verma</p>
                           <p className="text-[12px] text-slate-500 font-medium">Growth Lead</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. TRUSTED NETWORK (Premium Layout) */}
      <section className="py-20 bg-white border-y border-slate-200">
         <div className="k-shell">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="w-full md:w-1/3 text-center md:text-left">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3 block">Network</span>
                  <h3 className="font-outfit text-2xl font-bold text-slate-900 mb-3">Industry Recognition</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                     Graduates from Krutanic advanced cohorts earn interviews across high-growth product teams and global enterprises.
                  </p>
               </div>
               
               <div className="w-full md:w-2/3">
                  <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-100 shadow-inner">
                     <div className="opacity-60 mix-blend-multiply hover:opacity-100 transition-opacity duration-300">
                        {/* We reuse the carousel but inside a highly designed block so it feels intentional */}
                        <ClientsCarousel />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. CHOOSE THE RIGHT PROGRAM */}
      <section className="py-24 bg-[#FCFCFD] relative overflow-hidden">
         <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
         <div className="k-shell">
            <div className="max-w-2xl mb-16 mx-auto text-center">
               <h2 className="k-title mb-4">Strategic Paths</h2>
               <p className="text-lg text-slate-500 mx-auto">Evaluate your current profile and select the specialization track built for your next career maneuver.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
               {[
                  { title: "Software Engineering", desc: "For builders aiming to construct scalable logic, full-stack applications, and secure REST APIs.", path: "MERN Stack Engineering", icon: <Code2 size={24}/>, tint: "bg-blue-50 text-blue-600 border-blue-100" },
                  { title: "Data & Intelligence", desc: "For analysts working with raw datasets, predictive modeling, and deploying machine learning pipelines.", path: "Data Science & Analytics", icon: <DatabaseIcon size={24}/>, tint: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                  { title: "Product & Growth", desc: "For leaders orchestrating product vision, go-to-market strategies, and data-driven performance campaigns.", path: "PM & Performance", icon: <Target size={24}/>, tint: "bg-emerald-50 text-emerald-600 border-emerald-100" },
               ].map((g, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col group">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 border ${g.tint}`}>
                        {g.icon}
                     </div>
                     <h4 className="text-xl font-bold text-slate-900 mb-3">{g.title}</h4>
                     <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium flex-grow">{g.desc}</p>
                     
                     <div className="pt-5 border-t border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Recommended Track</p>
                        <p className="text-[15px] font-bold text-slate-800">{g.path}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 9. ADMISSIONS CTA (Split Premium Block) */}
      <section className="py-24 bg-white">
         <div className="k-shell">
            <div className="bg-slate-900 rounded-[32px] p-10 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border border-slate-800 shadow-2xl relative overflow-hidden">
               {/* Background glowing effects */}
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
               
               <div className="relative z-10">
                  <span className="inline-block px-3 py-1 border border-white/20 bg-white/5 rounded-full text-[11px] font-bold text-white uppercase tracking-widest mb-6 backdrop-blur-md">Admissions Strategy</span>
                  <h2 className="font-outfit text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.15]">Determine your program fit.</h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                     Speak directly with an advisor regarding curriculum details, expected outcomes, and cohort availability before securing enrollment.
                  </p>
               </div>
               
               <div className="relative z-10 flex flex-col sm:flex-row gap-5 lg:justify-end">
                  <button onClick={() => document.getElementById('catalog').scrollIntoView({behavior:'smooth'})} className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-[15px] border border-white/10 hover:bg-white/10 transition-colors text-center backdrop-blur-md">
                     Compare Catalog
                  </button>
                  <button onClick={() => setShowApplyForm(true)} className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-[15px] hover:bg-slate-100 transition-colors text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] flex justify-center items-center gap-2">
                     Request a Callback
                  </button>
               </div>
            </div>
         </div>
      </section>



      {/* STICKY FOOTER (Clean & restrained) */}
      <div className={`sticky-hub ${scrolled ? 'visible' : ''}`}>
        <div className="k-shell flex justify-between items-center w-full">
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
           <div className="flex gap-8 items-center">
              <button onClick={() => setShowApplyForm(true)} className="text-xs font-black uppercase hidden xl:flex items-center gap-2 hover:opacity-80 transition-all text-white">
                 Request a Callback
              </button>
              <button onClick={() => document.getElementById('catalog').scrollIntoView({behavior:'smooth'})} className="bg-white text-[#6D28D9] hover:scale-105 py-2.5 px-6 rounded-lg text-sm font-black transition-all shadow-sm flex items-center gap-2">
                 View Catalog
              </button>
           </div>
        </div>
      </div>

      <Toaster position="top-center" />
      {showApplyForm && <AdvancedApplyPopup onClose={() => setShowApplyForm(false)} />}
    </div>
  );
};

export default Advance;
