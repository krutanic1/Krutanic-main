import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Users, Target,
  CheckCircle2, Clock, Code2, LineChart,
  Megaphone, Kanban, BrainCircuit,
  FileText, MessageSquare, MonitorPlay,
  Award, Star, Workflow,
  ChevronDown, Zap, BookOpen, Globe, TrendingUp, Sparkles, PhoneCall
} from "lucide-react";
import { Toaster } from "react-hot-toast";

import ClientsCarousel from "../Components/our_alumni";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import CountdownTimer from "./AdvanceCourse/Components/CountdownTimer";
import "./Advance.css";

/* ── FRAMER MOTION VARIANTS ──────────────────────────────── */
const fadeUp    = { hidden: { opacity: 0, y: 50  }, visible: { opacity: 1, y: 0, transition: { duration: 0.7,  ease: [0.22,1,0.36,1] } } };
const fadeLeft  = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } };
const fadeRight = { hidden: { opacity: 0, x: 60  }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } };
const stagger   = { hidden: { opacity: 0 },         visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

/* ── SCROLL PROGRESS BAR ─────────────────────────────────── */
const ScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setP((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="adv-progress" style={{ width: `${p}%` }} />;
};

/* ── REAL ANIMATED COUNTER ───────────────────────────────── */
const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true;
        let startTime;
        const step = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
          else setCount(end);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── DATABASE ICON ───────────────────────────────────────── */
function DatabaseIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */

const programs = [
  { id:"da",   bg:"/course-bgs/da_bg.png",   icon:<LineChart size={22}/>,     name:"Data Analytics",            positioning:"Master data visualization, reporting, and business intelligence.",    dur:"24 Weeks", idealFor:"Professionals driving data decisions.",           tools:["PowerBI","SQL","Tableau"],      link:"/DataAnalytics",      cat:"AI & Data",        accentColor:"#818cf8" },
  { id:"ds",   bg:"/course-bgs/ds_bg.png",   icon:<DatabaseIcon size={22}/>,  name:"Data Science",              positioning:"Learn data science, machine learning, and model deployment.",         dur:"24 Weeks", idealFor:"Analysts moving into machine learning.",          tools:["Python","PyTorch","Scikit"],    link:"/DataScience",        cat:"AI & Data",        accentColor:"#818cf8" },
  { id:"mern", bg:"/course-bgs/mern_bg.png", icon:<Code2 size={22}/>,        name:"MERN Stack Engineering",    positioning:"Build secure, production-ready full-stack applications.",             dur:"24 Weeks", idealFor:"Aspiring software engineers scaling APIs.",        tools:["React","Node.js","MongoDB"],    link:"/MernStack",          cat:"Engineering",      accentColor:"#3b82f6" },
  { id:"dm",   bg:"/course-bgs/dm_bg.png",   icon:<Megaphone size={22}/>,     name:"Digital Marketing",         positioning:"Execute SEO, paid media, and performance growth campaigns.",         dur:"24 Weeks", idealFor:"Marketers shifting to performance-driven roles.", tools:["Meta Ads","GA4","SEO"],         link:"/DigitalMarket",      cat:"Business & Growth", accentColor:"#10b981" },
  { id:"pm",   bg:"/course-bgs/pm_bg.png",   icon:<Kanban size={22}/>,        name:"Product Management",        positioning:"Learn product strategy, roadmapping, and agile execution.",          dur:"24 Weeks", idealFor:"PMs transitioning from tech or marketing.",       tools:["Jira","Agile","Analytics"],    link:"/ProductManagement",  cat:"Business & Growth", accentColor:"#0ea5e9" },
  { id:"pe",   bg:"/course-bgs/pe_bg.png",   icon:<BrainCircuit size={22}/>,  name:"Prompt Engineering",        positioning:"Design robust GenAI workflows and enterprise AI guardrails.",        dur:"24 Weeks", idealFor:"Leaders implementing LLM-powered solutions.",      tools:["Prompting","LangChain","LLMs"], link:"/PromptEngineering",  cat:"GenAI",            accentColor:"#c084fc" },
];

const heroData = [
  { id:"engineering", tab:"Engineering", eyebrow:"Software Engineering",     title:"Build full-stack systems and production-ready applications.",             desc:"Master architectural patterns, API development, and secure deployments. Transition directly into a highly capable full-stack engineering role.",             image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", badgeLabel:"Admissions Open",    card1Label:"Career Focus", card1Value:"Full-Stack Roles",       card1Icon:<Code2 size={15}/>,         card2Label:"Format", card2Value:"24-Week Cohort", card2Icon:<Clock size={15}/> },
  { id:"data",        tab:"AI & Data",   eyebrow:"Data Science & Analytics", title:"Advance into machine learning and model-driven decision making.",         desc:"Extract business intelligence from raw data. Learn predictive modeling, deep learning architectures, and deploy robust ML pipelines.",                     image:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", badgeLabel:"AI & Data Track",    card1Label:"Career Focus", card1Value:"Data Science Roles",     card1Icon:<DatabaseIcon size={15}/>,  card2Label:"Format", card2Value:"24-Week Cohort", card2Icon:<Clock size={15}/> },
  { id:"product",     tab:"Product",     eyebrow:"Product Management",       title:"Move into product strategy, execution, and growth ownership.",           desc:"Lead cross-functional teams and execute go-to-market strategies. Master roadmapping, agile workflows, and data-driven prioritization.",                   image:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", badgeLabel:"Product Cohort",     card1Label:"Career Focus", card1Value:"Product Leadership",     card1Icon:<Target size={15}/>,        card2Label:"Format", card2Value:"24-Week Cohort", card2Icon:<Clock size={15}/> },
  { id:"marketing",   tab:"Marketing",   eyebrow:"Digital Marketing",        title:"Build campaign, analytics, and performance marketing capability.",        desc:"Drive measurable ROI through advanced SEO, high-budget paid media execution, and deep conversion rate optimization.",                                       image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", badgeLabel:"Growth Track",       card1Label:"Career Focus", card1Value:"Performance Marketing",  card1Icon:<LineChart size={15}/>,     card2Label:"Format", card2Value:"24-Week Cohort", card2Icon:<Clock size={15}/> },
  { id:"genai",       tab:"GenAI",       eyebrow:"Generative AI",            title:"Learn prompting, workflows, and practical AI implementation.",           desc:"Architect LLM-powered applications and integrate sophisticated GenAI capabilities directly into enterprise products.",                                      image:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", badgeLabel:"Innovation Track",   card1Label:"Career Focus", card1Value:"AI Implementation",      card1Icon:<BrainCircuit size={15}/>,  card2Label:"Format", card2Value:"24-Week Cohort", card2Icon:<Clock size={15}/> },
];

const marqueeItems = [
  "MERN Stack Engineering","Data Science","Data Analytics",
  "Digital Marketing","Product Management","Prompt Engineering",
  "24-Week Cohorts","1:1 Mentorship","Live Code Reviews",
  "Paid Internship","Placement Support","Portfolio Projects",
  "Mock Interviews","Career Transitions","Industry Mentors",
];

/* Real career transformation stories */
const transformations = [
  { from:"IT Support Engineer",  to:"Full-Stack Developer",   result:"First offer: ₹18 LPA",            weeks:"24 weeks", color:"#3b82f6", initials:"AK", name:"Arjun K.", track:"MERN Stack" },
  { from:"Marketing Executive",  to:"Product Manager",        result:"Joined a Series B company",        weeks:"24 weeks", color:"#c084fc", initials:"RD", name:"Riya D.",  track:"Product Management" },
  { from:"Excel Analyst",        to:"Data Scientist",         result:"3× salary increase in 6 months",   weeks:"24 weeks", color:"#818cf8", initials:"PS", name:"Priya S.", track:"Data Science" },
  { from:"Content Writer",       to:"Growth Lead",            result:"Leading a 5-person growth team",   weeks:"24 weeks", color:"#10b981", initials:"NK", name:"Nikhil K.",track:"Digital Marketing" },
];

const whyItems = [
  { icon:<BookOpen size={20}/>,    color:"#10b981", title:"Structured 24-Week Curriculums",   desc:"Follow an intentional syllabus from fundamental mental models to enterprise-grade project deployment." },
  { icon:<Users size={20}/>,       color:"#818cf8", title:"Mentor-Led Technical Reviews",     desc:"Execute tasks and receive direct architectural feedback from industry engineers every single week." },
  { icon:<MonitorPlay size={20}/>, color:"#0ea5e9", title:"Industry-Relevant Tooling",        desc:"Configure the same software, frameworks, and pipelines used by modern tech teams at top companies." },
  { icon:<TrendingUp size={20}/>,  color:"#f59e0b", title:"Career Outcome Engineering",      desc:"Technical mock prep, resume engineering, and LinkedIn optimization built directly into the program." },
  { icon:<Globe size={20}/>,       color:"#c084fc", title:"Real Portfolio Projects",          desc:"Build documented, end-to-end projects that prove your capabilities to any hiring manager." },
  { icon:<Zap size={20}/>,         color:"#10b981", title:"Predictable Weekly Progress",     desc:"Weekly strict tracking with code reviews keeps you on schedule and moving toward your role." },
];

const faqs = [
  { q:"Who are these Advanced Programs designed for?",    a:"Advanced Programs are built for graduates, working professionals, and career-changers looking to specialize in tech, data, product, or marketing. No prior professional experience required — just drive and commitment." },
  { q:"Are the programs 100% online?",                   a:"Yes — all sessions, mentor interactions, assignments, and assessments are conducted entirely online, giving you full flexibility to learn while managing your current commitments." },
  { q:"What does the 24-week format look like?",         a:"Each week has a defined objective: framework sessions, hands-on assignments, code reviews, and project milestones. Designed for working professionals who need a predictable, manageable schedule." },
  { q:"Do I get a certificate?",                         a:"Yes. Every program includes a Course Completion Certificate, placement referrals, resume engineering support, and LinkedIn optimization to maximize your market visibility." },
  { q:"How small are the batch sizes?",                  a:"Batches are strictly limited to ensure each learner receives genuine, individualized mentor attention. We prioritize quality of instruction over enrollment volume." },
  { q:"Can I take more than one program?",               a:"Absolutely. Many learners stack programs — combining Data Science with Prompt Engineering, for example — to build a rare multidisciplinary advantage in the job market." },
  { q:"What placement support is included?",             a:"Placement support includes resume reviews, LinkedIn optimization, technical interview prep through mock sessions, and direct referrals to our hiring partner network." },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const Advance = () => {
  const navigate = useNavigate();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [filter, setFilter]               = useState("All");
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [activeFaq, setActiveFaq]         = useState(null);

  // Unprecedented Hero Effects State
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [heroCount, setHeroCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { 
    window.scrollTo(0, 0); 
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Hero: Animate count to 24
  useEffect(() => {
    let start = 0;
    const end = 24;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setHeroCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, []);


  // Mouse spotlight logic
  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const t = setInterval(() => setActiveHeroIdx(i => (i + 1) % 4), 6000);
    return () => clearInterval(t);
  }, []);

  const filteredPrograms = filter === "All" ? programs : programs.filter(p => p.cat === filter);
  const curHero = heroData[activeHeroIdx];

  return (
    <div className="adv-page">
      <Helmet>
        <title>Advanced Programs | Krutanic</title>
        <meta name="description" content="5 advanced programs in software, data, product, marketing, and AI. 24-week structured cohorts with expert mentorship and guaranteed placement support." />
      </Helmet>

      <ScrollProgress />

      {/* Ambient background */}
      <div className="adv-orb adv-orb-1" />
      <div className="adv-orb adv-orb-2" />
      <div className="adv-orb adv-orb-3" />
      <div className="adv-grid-bg" />

      {/* Floating Sticky CTA */}
      <motion.div className="adv-sticky-cta" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ delay:1.8, duration:0.5 }}>
        <button onClick={() => setShowApplyForm(true)} id="adv-sticky-apply">
          Apply Now <ArrowRight size={15} />
        </button>
      </motion.div>

      {/* ═══ § 1 — THE NEW HERO ═════════════════════ */}
      <section className="adv-hero-v2">
        <motion.div className="adv-hero-v2-content" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="adv-hero-v2-badge" variants={fadeUp}>
            <span className="adv-badge-v2-dot" />
            4 Trending Courses · Now Enrolling
          </motion.div>

          <motion.h1 className="adv-hero-v2-title" variants={fadeUp}>
            Where <span className="adv-grad">Tech,</span><br />
            <span className="adv-grad">Data</span> & <span className="adv-grad-purple">Business</span><br />
            Converge.
          </motion.h1>

          <motion.p className="adv-hero-v2-sub" variants={fadeUp}>
            Krutanic Advanced Programs are exclusive professional certification programs spanning Software Engineering, Data Science, and Growth — each built for real careers, not just credentials.
          </motion.p>

          <motion.div className="adv-hero-v2-ctas" variants={fadeUp}>
            <button className="adv-v2-btn-primary" id="adv-hero-explore" onClick={() => document.getElementById("catalog").scrollIntoView({ behavior:"smooth" })}>
              Explore Programs <ArrowRight size={15} />
            </button>
            <button className="adv-v2-btn-secondary" onClick={() => setShowApplyForm(true)}>Apply Now</button>
          </motion.div>

          <motion.div className="adv-trust-v2-pills" variants={fadeUp}>
            <span className="adv-pill-v2"><Star size={12} style={{ color: "#fbbf24" }} /> 4.9 / 5 Rating</span>
            <span className="adv-pill-v2"><CheckCircle2 size={12} style={{ color: "#22c55e" }} /> 100% Online</span>
            <span className="adv-pill-v2"><Award size={12} style={{ color: "#c084fc" }} /> Certificate + Rec. Letter</span>
            <span className="adv-pill-v2"><Users size={12} style={{ color: "#818cf8" }} /> 12,000+ Graduates</span>
          </motion.div>
        </motion.div>

        {/* Right — Program Preview Cards */}
        <motion.div
          className="adv-hero-v2-cards"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22,1,0.36,1] }}
        >
          {programs.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              className={`adv-hero-v2-mini-card ${activeHeroIdx === i ? "active" : ""}`}
              style={{ "--accent": p.accentColor }}
              onClick={() => navigate(p.link)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className="adv-mini-v2-icon" style={{ color: p.accentColor }}>
                {p.icon}
              </div>
              <div>
                <div className="adv-mini-v2-title">{p.name}</div>
                <div className="adv-mini-v2-sub">{p.dur} · {p.cat}</div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(p.link); }}
                style={{ 
                  marginLeft: "auto", 
                  fontSize: "0.75rem", 
                  fontWeight: 800, 
                  textTransform: "uppercase", 
                  padding: "0.35rem 0.8rem", 
                  borderRadius: "4px", 
                  background: p.accentColor, 
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, filter 0.2s ease"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(1)"; }}
              >
                TRENDING
              </button>
            </motion.div>
          ))}

          {/* Active program preview */}
          <AnimatePresence mode="wait">
            {programs[activeHeroIdx] && (
              <motion.div
                key={activeHeroIdx}
                className="adv-hero-v2-preview"
                style={{ 
                  "--accent": programs[activeHeroIdx].accentColor,
                  backgroundImage: `linear-gradient(90deg, rgba(10,10,20,0.7) 20%, rgba(10,10,20,0.2) 100%), url(${programs[activeHeroIdx].bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="adv-preview-v2-tag" style={{ color: programs[activeHeroIdx].accentColor }}>
                  {programs[activeHeroIdx].cat}
                </div>
                <div className="adv-preview-v2-title">{programs[activeHeroIdx].name}</div>
                <p className="adv-preview-v2-desc">{programs[activeHeroIdx].positioning}</p>
                <button onClick={() => navigate(programs[activeHeroIdx].link)} className="adv-preview-v2-link" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                  View Full Program <ArrowRight size={15} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ════════════════════════════════════════ */}
      <div className="adv-marquee-bar">
        <div className="adv-marquee-track">
          {[...marqueeItems,...marqueeItems].map((item, i) => (
            <span key={i} className="adv-marquee-item">
              <CheckCircle2 size={13} style={{ color:"#10b981", flexShrink:0 }} />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ § 2 — THE HARD TRUTH (WOW MOMENT #1) ══════════ */}
      <section className="adv-truth-section">
        <motion.div className="adv-truth-inner"
          initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger}>

          <motion.div className="adv-truth-pretag" variants={fadeUp}>
            <Sparkles size={13} /> The Reality Check
          </motion.div>

          <motion.ul className="adv-truth-crossed" variants={stagger}>
            {[
              "3 years of YouTube tutorials.",
              "47 downloaded certificate PDFs.",
              "200+ hours of passive video watching.",
              "Hundreds of unread course emails.",
            ].map((line, i) => (
              <motion.li key={i} variants={fadeUp} custom={i}>{line}</motion.li>
            ))}
          </motion.ul>

          <motion.div className="adv-truth-punchline" variants={fadeUp}>
            Still No Offer?
            <span>There is a better way.</span>
          </motion.div>

          <motion.div className="adv-truth-pivot" variants={fadeUp}>
            <div className="adv-truth-divider" />
            <p>
              Krutanic Advanced Programs replace passive consumption with structured execution, mentor-validated projects, and a direct path to a role — in exactly 24 weeks.
            </p>
            <div className="adv-truth-divider" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ § 3 — ANIMATED STATS BAND ═════════════════════ */}
      <div className="adv-stats-band">
        <div className="adv-stats-inner">
          {[
            { end:5000, suffix:"+",     label:"Career Transitions"   },
            { end:95,   suffix:"%",     label:"Learner Success Rate" },
            { end:24,   suffix:" Wks",  label:"Structured Program"   },
            { end:6,    suffix:"+",     label:"Advanced Tracks"      },
          ].map((s, i) => (
            <motion.div key={i} className="adv-stat-item"
              initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}
              transition={{ delay: i * 0.12 }}>
              <div className="adv-stat-val">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="adv-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ § 4 — PROGRAM CATALOG ══════════════════════════ */}
      <section className="adv-section" id="catalog">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
          <div className="adv-label">Advanced Programs</div>
          <h2 className="adv-h2">
            Choose Your{" "}
            <span style={{ background:"linear-gradient(135deg,#fff 0%,#10b981 60%,#14b8a6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Specialization
            </span>
          </h2>
          <p style={{ color:"var(--adv-muted)", fontSize:"1.05rem", maxWidth:520, marginBottom:"2.5rem" }}>
            Role-aligned curriculums designed to help you specialize and transition safely into high-demand careers.
          </p>
        </motion.div>

        <div className="adv-catalog-header">
          <div className="adv-filter-bar">
            {["All","Engineering","AI & Data","Business & Growth","GenAI"].map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`adv-filter-btn ${filter === c ? "active" : ""}`}>{c}</button>
            ))}
          </div>
        </div>

        <motion.div layout className="adv-programs-grid"
          initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-50px" }} variants={stagger}>
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map(p => (
              <motion.div key={p.id} className="adv-prog-card"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                style={{ 
                  "--accent-color": p.accentColor,
                  backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 15, 0.4), rgba(10, 10, 15, 0.8)), url(${p.bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
                onClick={() => navigate(p.link)}>
                <div className="adv-prog-card-body">
                  <div className="adv-prog-icon-row">
                    <div className="adv-prog-icon-wrap" style={{ color: p.accentColor }}>{p.icon}</div>
                    <span className="adv-prog-cat-badge">{p.cat}</span>
                    <span className="adv-prog-dur"><Clock size={11}/> {p.dur}</span>
                  </div>
                  <h3 className="adv-prog-name">{p.name}</h3>
                  <p className="adv-prog-desc">{p.positioning}</p>
                  <div className="adv-prog-ideal">
                    <div className="adv-ideal-label">Ideal for</div>
                    <div className="adv-ideal-val">{p.idealFor}</div>
                  </div>
                  <div className="adv-prog-tools">
                    {p.tools.map(t => <span key={t} className="adv-tool-chip">{t}</span>)}
                  </div>
                  <div className="adv-prog-cta-row">
                    <span className="adv-prog-cta-text">View Program Details</span>
                    <div className="adv-prog-arrow"><ArrowRight size={13}/></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ § 5 — WHY IT WORKS ═════════════════════════════ */}
      <div className="adv-section-full adv-why-bg" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="adv-section-inner">
          <motion.div style={{ textAlign:"center" }} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <div className="adv-label" style={{ justifyContent:"center" }}>The System</div>
            <h2 className="adv-h2 adv-h2-center">
              Why Our Method{" "}
              <span style={{ background:"linear-gradient(135deg,#fff 0%,#10b981 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Actually Works
              </span>
            </h2>
            <p className="adv-desc">
              We replace passive video consumption with structured execution, mentor accountability, and applied projects that create real evidence of capability.
            </p>
          </motion.div>
          <motion.div className="adv-why-grid"
            initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-60px" }} variants={stagger}>
            {whyItems.map((item, i) => (
              <motion.div className="adv-why-card" key={i} variants={fadeUp}>
                <div className="adv-why-icon" style={{ color: item.color }}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ § 6 — THE JOURNEY (Process) ═══════════════════ */}
      <section className="adv-section" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <motion.div style={{ textAlign:"center" }} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
          <div className="adv-label" style={{ justifyContent:"center" }}>The 24-Week Journey</div>
          <h2 className="adv-h2 adv-h2-center">A Disciplined System, Week by Week</h2>
          <p className="adv-desc">
            Every week is purposeful. Every action is tracked. Every output is reviewed by someone who has done it professionally.
          </p>
        </motion.div>
        <div className="adv-steps-wrap">
          <div className="adv-steps-line" />
          <motion.div className="adv-steps-grid"
            initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            {[
              { step:"01", icon:<BrainCircuit size={20}/>, title:"Learn",    desc:"Expert-led framework sessions build your mental model from the ground up." },
              { step:"02", icon:<Code2 size={20}/>,        title:"Practice", desc:"Weekly hands-on assignments turn concepts into muscle memory." },
              { step:"03", icon:<Kanban size={20}/>,       title:"Build",    desc:"End-to-end portfolio projects create real evidence of your capability." },
              { step:"04", icon:<MessageSquare size={20}/>,title:"Review",   desc:"Direct technical feedback from industry reviewers catches every gap." },
              { step:"05", icon:<Target size={20}/>,       title:"Verify",   desc:"Mock interviews and role readiness checks before you go live." },
            ].map((item, i) => (
              <motion.div key={i} className="adv-step-item" variants={fadeUp}>
                <div className="adv-step-circle">
                  <span className="adv-step-num">{item.step}</span>
                  {item.icon}
                </div>
                <div>
                  <div className="adv-step-title">{item.title}</div>
                  <div className="adv-step-desc">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ § 7 — CAREER TRANSFORMATIONS (WOW MOMENT #2) ══ */}
      <section className="adv-transform-section">
        <motion.div className="adv-transform-inner"
          initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-80px" }} variants={stagger}>

          <motion.div variants={fadeUp}>
            <div className="adv-label">Real Results</div>
            <h2 className="adv-h2">
              From Where They Were,{" "}
              <span style={{ background:"linear-gradient(135deg,#fff 0%,#10b981 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                to Where They Are.
              </span>
            </h2>
            <p style={{ color:"var(--adv-muted)", fontSize:"1.05rem", maxWidth:560, marginBottom:"3rem" }}>
              Not success stories written by marketing. These are real career pivots from real people — verified, measured, and repeatable.
            </p>
          </motion.div>

          <div className="adv-transform-grid">
            {transformations.map((t, i) => (
              <motion.div key={i} className="adv-transform-card"
                style={{ "--tc-color": t.color }}
                initial={{ opacity:0, y:40 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:"-60px" }}
                transition={{ duration:0.65, delay: i * 0.12, ease:[0.22,1,0.36,1] }}>

                <div className="adv-tc-avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>

                <div className="adv-tc-journey">
                  <span className="adv-tc-from">{t.from}</span>
                  <span className="adv-tc-arrow">→</span>
                  <span className="adv-tc-to">{t.to}</span>
                </div>

                <div className="adv-tc-result">{t.result}</div>

                <div className="adv-tc-meta">
                  <div>
                    <div className="adv-tc-name">{t.name}</div>
                    <div style={{ fontSize:"0.78rem", color:"var(--adv-muted)" }}>{t.track}</div>
                  </div>
                  <div className="adv-tc-weeks">
                    <Clock size={11} /> {t.weeks}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══ § 8 — OUTCOMES MATRIX ══════════════════════════ */}
      <div className="adv-section-full" style={{ borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="adv-section-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <div className="adv-label">Career Scaffolding</div>
            <h2 className="adv-h2">
              What You Get{" "}
              <span style={{ color:"#10b981" }}>Beyond the Curriculum</span>
            </h2>
            <p style={{ color:"var(--adv-muted)", fontSize:"1.05rem", maxWidth:580, marginBottom:"3rem" }}>
              An ecosystem designed to maximize your market visibility and accelerate your transition — not just a course.
            </p>
          </motion.div>
          <motion.div className="adv-outcomes-grid"
            initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            {[
              { icon:<Workflow size={20}/>, iconBg:"rgba(129,140,248,0.18)", iconColor:"#818cf8", dotColor:"#4b5563", title:"Execution", items:["Live mentor sessions","Tool-based environments","Weekly code reviews"] },
              { icon:<FileText size={20}/>, iconBg:"rgba(14,165,233,0.18)",  iconColor:"#0ea5e9", dotColor:"#4b5563", title:"Portfolio",  items:["Applied capstone projects","GitHub repo review","Artifact generation"] },
              { icon:<Target size={20}/>,   iconBg:"rgba(16,185,129,0.18)", iconColor:"#10b981", dotColor:"#4b5563", title:"Transition", items:["Technical mock prep","Resume engineering","LinkedIn optimization"] },
              { icon:<Award size={20}/>,    iconBg:"#10b981",              iconColor:"#fff",    dotColor:"#10b981", title:"Verification",items:["Credential issuance","Placement referrals","Alumni network access"], highlight:true },
            ].map((card, i) => (
              <motion.div key={i} className="adv-outcome-card" variants={fadeUp}
                style={card.highlight ? { borderColor:"rgba(16,185,129,0.28)" } : {}}>
                <div className="adv-outcome-icon"
                  style={{ background:card.iconBg, color:card.iconColor, boxShadow:card.highlight?"0 0 24px rgba(16,185,129,0.3)":"none" }}>
                  {card.icon}
                </div>
                <div className="adv-outcome-title">{card.title}</div>
                <ul className="adv-outcome-list">
                  {card.items.map((item, j) => (
                    <li key={j}><div className="adv-outcome-dot" style={{ background:card.dotColor }}/>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ § 9 — SOCIAL PROOF WALL ════════════════════════ */}
      <section className="adv-section">
        <motion.div style={{ textAlign:"center" }} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
          <div className="adv-label" style={{ justifyContent:"center" }}>Student Voices</div>
          <h2 className="adv-h2 adv-h2-center">
            Words From People Who{" "}
            <span style={{ color:"#10b981" }}>Made the Leap</span>
          </h2>
          <p className="adv-desc">Not curated marketing quotes. Real words, from real people, about a real transformation.</p>
        </motion.div>

        <motion.div className="adv-proof-grid"
          initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
          <motion.div className="adv-proof-featured" variants={fadeLeft}>
            <div className="adv-stars">
              {[...Array(5)].map((_,j) => <Star key={j} size={14} fill="currentColor"/>)}
            </div>
            <p className="adv-proof-text">
              "The structured curriculum and intense feedback loop on my casework helped me formulate strategy the exact way tech hiring managers expect. It was a complete professional reset — I went from data analyst to product manager in under 8 months."
            </p>
            <div className="adv-proof-author">
              <div className="adv-proof-avatar">AS</div>
              <div>
                <div className="adv-proof-name">Ananya Sharma</div>
                <div className="adv-proof-role">Data Analyst → Product Manager</div>
              </div>
              <span className="adv-proof-track">Product Track</span>
            </div>
          </motion.div>

          <div className="adv-proof-side">
            <motion.div className="adv-proof-small" variants={fadeRight}>
              <div className="adv-stars">{[...Array(5)].map((_,j) => <Star key={j} size={12} fill="currentColor"/>)}</div>
              <p className="adv-proof-text-sm">
                "Watching logic scale into deployed APIs under mentor guidance gave me the architectural confidence to pursue senior backend roles. The weekly reviews were exactly what I needed."
              </p>
              <div className="adv-proof-author" style={{ paddingTop:"1rem" }}>
                <div className="adv-proof-avatar" style={{ background:"#3b82f6", width:38, height:38, fontSize:"0.8rem" }}>RG</div>
                <div>
                  <div className="adv-proof-name" style={{ fontSize:"0.88rem" }}>Rohan Gupta</div>
                  <div className="adv-proof-role">Software Engineer</div>
                </div>
              </div>
            </motion.div>
            <motion.div className="adv-proof-small" variants={fadeRight}>
              <div className="adv-stars">{[...Array(5)].map((_,j) => <Star key={j} size={12} fill="currentColor"/>)}</div>
              <p className="adv-proof-text-sm">
                "Running live ad-sets and performing analytics audits completely redefined my career. I now lead a growth team with confidence that only comes from real practice."
              </p>
              <div className="adv-proof-author" style={{ paddingTop:"1rem" }}>
                <div className="adv-proof-avatar" style={{ background:"#10b981", width:38, height:38, fontSize:"0.8rem" }}>SV</div>
                <div>
                  <div className="adv-proof-name" style={{ fontSize:"0.88rem" }}>Sanya Verma</div>
                  <div className="adv-proof-role">Growth Lead</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══ § 10 — ALUMNI NETWORK ══════════════════════════ */}
      <div className="adv-section-full" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="adv-section-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <div className="adv-label">Alumni Network</div>
            <h2 className="adv-h2">Our Graduates Work Here</h2>
            <p style={{ color:"var(--adv-muted)", fontSize:"1rem", maxWidth:520, marginBottom:"2.5rem" }}>
              Krutanic Advanced cohort graduates earn interviews across high-growth product teams and global enterprises.
            </p>
          </motion.div>
          <div className="adv-alumni-wrap"><ClientsCarousel /></div>
        </div>
      </div>

      {/* ═══ § 11 — COMPARE TABLE ═══════════════════════════ */}
      <section className="adv-section" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <motion.div style={{ textAlign:"center" }} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
          <div className="adv-label" style={{ justifyContent:"center" }}>Compare</div>
          <h2 className="adv-h2 adv-h2-center">
            Which Program is{" "}
            <span style={{ color:"#10b981" }}>Right for You?</span>
          </h2>
          <p className="adv-desc">Evaluate across key dimensions to find your perfect specialization track.</p>
        </motion.div>
        <motion.div className="adv-compare-wrap" initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
          <table className="adv-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                {programs.slice(0,4).map(p => (
                  <th key={p.id} style={{ color: p.accentColor }}>{p.name.split(" ").slice(0,2).join(" ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label:"Duration",           vals:["24 Weeks","24 Weeks","24 Weeks","24 Weeks"] },
                { label:"Format",             vals:["Live Cohort","Live Cohort","Live Cohort","Live Cohort"] },
                { label:"Live Mentorship",    vals:["✓","✓","✓","✓"] },
                { label:"Portfolio Projects", vals:["✓","✓","✓","✓"] },
                { label:"Certificate",        vals:["✓","✓","✓","✓"] },
                { label:"Placement Support",  vals:["✓","✓","✓","✓"] },
                { label:"Best For",           vals:["Developers","Analysts","BI Pros","Marketers"] },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="adv-compare-feature">{row.label}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} className={v==="✓"?"adv-check-cell":""}>{v}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td style={{ borderBottom:"none" }}/>
                {programs.slice(0,4).map(p => (
                  <td key={p.id} style={{ borderBottom:"none", paddingTop:"2rem" }}>
                    <button onClick={() => setShowApplyForm(true)} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", padding:"0.7rem 1rem", borderRadius:"10px", background:"transparent", border:`1px solid ${p.accentColor}`, color:p.accentColor, fontWeight:700, fontSize:"0.85rem", cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.3s ease" }}
                      onMouseOver={e => { e.currentTarget.style.background = `${p.accentColor}18`; }}
                      onMouseOut={e =>  { e.currentTarget.style.background = "transparent"; }}>
                      Apply Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ═══ § 12 — FAQ ═════════════════════════════════════ */}
      <div className="adv-section-full adv-dark-faq-bg" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div className="adv-section-inner">
          <motion.div style={{ textAlign:"center", marginBottom:"3.5rem" }} initial="hidden" whileInView="visible" viewport={{ once:true }} variants={fadeUp}>
            <div className="adv-label" style={{ justifyContent:"center" }}>FAQ</div>
            <h2 className="adv-h2 adv-h2-center">
              Every Question,{" "}
              <span style={{ color:"#10b981" }}>Answered Honestly</span>
            </h2>
          </motion.div>
          <motion.div className="adv-dark-faq-wrap" initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
            {faqs.map((faq, i) => (
              <motion.div className="adv-dark-faq-item" key={i} variants={fadeUp}>
                <div className="adv-dark-faq-q" onClick={() => setActiveFaq(activeFaq===i ? null : i)} id={`adv-faq-${i}`}>
                  <span>{faq.q}</span>
                  <motion.div animate={{ rotate: activeFaq===i ? 180 : 0 }} transition={{ duration:0.3 }} style={{ flexShrink:0, color:"var(--adv-muted)" }}>
                    <ChevronDown size={14}/>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {activeFaq===i && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35 }} style={{ overflow:"hidden" }}>
                      <div className="adv-dark-faq-a">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ § 13 — THE PROMISE (Final CTA) ════════════════ */}
      <section className="adv-final-cta">
        <div className="adv-final-mesh" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <div className="adv-final-eyebrow"><Sparkles size={13}/> Begin Your Journey</div>
          </motion.div>
          <motion.h2 className="adv-final-title" variants={fadeUp}>
            Your Next Role Starts<br />
            With <em>One Decision.</em>
          </motion.h2>
          <motion.p className="adv-final-sub" variants={fadeUp}>
            Speak with an advisor about curriculum details, expected outcomes, and cohort availability. No pressure — just clarity on whether this is right for you.
          </motion.p>
          <motion.div className="adv-final-btns" variants={fadeUp}>
            <button className="adv-btn-primary" onClick={() => setShowApplyForm(true)} id="adv-final-apply">
              Request a Callback <ArrowRight size={15}/>
            </button>
            <button className="adv-btn-secondary" id="adv-final-explore"
              onClick={() => document.getElementById("catalog").scrollIntoView({ behavior:"smooth" })}>
              Explore Catalog
            </button>
          </motion.div>
          <motion.p className="adv-final-note" variants={fadeUp}>
            Limited seats per cohort · No obligation · Free advisor session
          </motion.p>
        </motion.div>
      </section>

      <Toaster position="top-center" />
      {showApplyForm && <AdvancedApplyPopup onClose={() => setShowApplyForm(false)} />}
      
      {/* 50% Scholarship Sticky Banner */}
      <div className={`adv-sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="adv-section-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '800' }}>
                 <span style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>🚨</span>
                 <span>50% Scholarship closing in just 2 days.</span>
              </div>
              <div className="adv-sticky-timer-wrap">
                 <span>Batch closing in</span>
                 <CountdownTimer />
              </div>
           </div>
           <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button onClick={() => window.location.href='tel:9380736449'} className="adv-sticky-call">
                 <PhoneCall size={15} /> Request a Callback
              </button>
              <button className="adv-sticky-btn" onClick={() => { document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>
                 View Catalog
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Advance;
