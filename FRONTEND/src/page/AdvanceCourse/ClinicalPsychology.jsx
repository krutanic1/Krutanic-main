import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, useInView } from "framer-motion";
import nishithaImg from "../../assets/mentors/nishitha.jpg";
import {
  FaBrain, FaHeart, FaUsers, FaChartLine, FaCheckCircle,
  FaBriefcase, FaBookOpen, FaProjectDiagram,
  FaUserMd, FaChevronDown, FaGraduationCap, FaHandHoldingHeart,
  FaMicroscope, FaBuilding, FaSchool, FaLinkedinIn, FaTwitter,
  FaInstagram, FaArrowRight, FaShieldAlt, FaRocket, FaGlobe,
  FaCheck, FaHandshake, FaTrophy, FaFileAlt, FaHospital,
  FaFlask, FaCrown, FaClipboardList, FaStar, FaAward,
  FaLightbulb, FaChalkboardTeacher, FaNetworkWired
} from "react-icons/fa";
import { MdPsychology, MdOutlineHealthAndSafety, MdWorkOutline, MdOutlineScience } from "react-icons/md";
import MedProFormModal from "../MedProFormModal";
import "./ClinicalPsychology.css";

// ── MOTION VARIANTS ────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

// ── SCROLL PROGRESS BAR ────────────────────────────────────────
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setProgress((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="cp-progress-bar" style={{ width: `${progress}%` }} />;
};

// ── ANIMATED COUNTER ───────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "", duration = 2200 }) => {
  return <span>{end.toLocaleString()}{suffix}</span>;
};

// ── NEURAL PARTICLE CANVAS ──────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.45 + 0.08,
      hue: Math.random() < 0.6 ? 280 : 300
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${p.opacity})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 155) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${(p.hue + q.hue) / 2}, 80%, 75%, ${0.1 * (1 - dist / 155)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="cp-canvas" />;
};

// ── BRAIN SVG ──────────────────────────────────────────────────
const BrainSVG = () => (
  <svg viewBox="0 0 420 400" xmlns="http://www.w3.org/2000/svg" className="cp-brain-svg">
    <defs>
      <radialGradient id="brG1" cx="35%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#e879f9" stopOpacity="0.95"/>
        <stop offset="60%" stopColor="#c084fc" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2"/>
      </radialGradient>
      <radialGradient id="brG2" cx="65%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9"/>
        <stop offset="60%" stopColor="#818cf8" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.1"/>
      </radialGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softglow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="210" cy="200" rx="175" ry="155" fill="none" stroke="rgba(192,132,252,0.12)" strokeWidth="1"/>
    <path d="M210 80 C170 80 115 95 95 130 C75 165 70 185 75 210 C80 235 90 260 110 280 C130 300 155 315 175 315 C190 315 200 310 210 300"
          fill="url(#brG1)" filter="url(#glow)" opacity="0.85"/>
    <path d="M210 80 C250 80 305 95 325 130 C345 165 350 185 345 210 C340 235 330 260 310 280 C290 300 265 315 245 315 C230 315 220 310 210 300"
          fill="url(#brG2)" filter="url(#glow)" opacity="0.85"/>
    <path d="M210 80 C170 80 115 95 95 130 C75 165 70 185 75 210 C80 235 90 260 110 280 C130 300 155 315 210 300 C265 315 290 300 310 280 C330 260 340 235 345 210 C350 185 345 165 325 130 C305 95 250 80 210 80Z"
          fill="none" stroke="rgba(192,132,252,0.4)" strokeWidth="2" filter="url(#softglow)"/>
    <line x1="210" y1="100" x2="210" y2="295" stroke="rgba(232,121,249,0.5)" strokeWidth="2.5" strokeDasharray="8 4"/>
    <path d="M100 145 Q135 138 155 155 Q170 168 165 185" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M85 175 Q120 165 145 180 Q165 192 162 215" stroke="#e879f9" strokeWidth="1.8" fill="none" opacity="0.5"/>
    <path d="M90 215 Q120 208 142 222 Q158 232 155 252" stroke="#c084fc" strokeWidth="1.8" fill="none" opacity="0.5"/>
    <path d="M105 255 Q132 248 150 262" stroke="#818cf8" strokeWidth="1.5" fill="none" opacity="0.45"/>
    <path d="M320 145 Q285 138 265 155 Q250 168 255 185" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M335 175 Q300 165 275 180 Q255 192 258 215" stroke="#e879f9" strokeWidth="1.8" fill="none" opacity="0.5"/>
    <path d="M330 215 Q300 208 278 222 Q262 232 265 252" stroke="#c084fc" strokeWidth="1.8" fill="none" opacity="0.5"/>
    <path d="M175 140 Q210 120 245 140" stroke="#e879f9" strokeWidth="2" fill="none" opacity="0.7"/>
    <path d="M172 190 Q210 175 248 190" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M175 245 Q210 260 245 245" stroke="#a78bfa" strokeWidth="1.8" fill="none" opacity="0.5"/>
    {[
      [155,155],[105,200],[130,250],[170,120],[155,275],
      [265,155],[315,200],[290,250],[250,120],[265,275],
      [210,115],[210,200],[210,285]
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="7" fill="rgba(192,132,252,0.1)"/>
        <circle cx={cx} cy={cy} r="4.5" fill="#c084fc" opacity="0.9" filter="url(#softglow)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.5 + (i % 4) * 0.7}s`} repeatCount="indefinite"/>
          <animate attributeName="r" values="3.5;5.5;3.5" dur={`${2.5 + (i % 4) * 0.7}s`} repeatCount="indefinite"/>
        </circle>
      </g>
    ))}
    <ellipse cx="155" cy="195" rx="60" ry="80" fill="rgba(192,132,252,0.05)"/>
    <ellipse cx="265" cy="195" rx="60" ry="80" fill="rgba(218,112,214,0.05)"/>
  </svg>
);

// ── MARQUEE DATA (text only, no emojis) ───────────────────────
const marqueeItems = [
  "4-Phase Curriculum", "Expert-Led Learning", "Real Indian Case Studies",
  "Career Support Included", "Portfolio-First Approach", "Active Mentorship",
  "Industry-Relevant Skills", "Evidence-Based Learning", "High Social Impact",
  "Career-Focused Outcomes", "Certificate + Recommendation", "Practical Psychology",
];

// ── DATA CONSTANTS ──────────────────────────────────────────────

const whyMatters = [
  { icon: <FaChartLine />, color: "#c084fc", title: "Growing Career Opportunities", desc: "20% annual growth creating thousands of new roles across all sectors of society." },
  { icon: <FaHeart />,     color: "#e879f9", title: "High Social Impact",           desc: "Directly improve the well-being of individuals, families, and entire communities." },
  { icon: <FaHandshake />, color: "#818cf8", title: "Human-Centered Skillset",      desc: "Psychology skills are valued in healthcare, HR, UX design, and senior leadership." },
  { icon: <FaRocket />,    color: "#a78bfa", title: "Future-Ready Profession",      desc: "Mental health is a global priority — demand for professionals will only grow rapidly." }
];

const whyUs = [
  { icon: <FaLightbulb />,         title: "Learn by Doing",           desc: "Hands-on projects and practical applications instead of passive, theory-heavy lectures." },
  { icon: <FaChalkboardTeacher />, title: "Expert Mentorship",        desc: "Learn directly from experienced psychology professionals with real clinical insight." },
  { icon: <FaUsers />,             title: "Community & Collaboration", desc: "Peer learning, group discussions, networking, and ongoing support throughout." },
  { icon: <FaBriefcase />,         title: "Career Readiness",         desc: "Portfolio development, internship preparation, and professional guidance built in." }
];

const careerTracks = [
  {
    icon: <FaHospital />, color: "#c084fc", label: "Clinical Track",
    roles: ["Clinical Psychologist", "Counseling Psychologist", "Rehabilitation Specialist"]
  },
  {
    icon: <FaBriefcase />, color: "#e879f9", label: "Business Track",
    roles: ["Organizational Psychologist", "Human Behavior Analyst", "UX Researcher"]
  },
  {
    icon: <MdOutlineScience />, color: "#818cf8", label: "Research Track",
    roles: ["Research Assistant", "Social Psychology Researcher", "Behavioral Science Specialist"]
  },
  {
    icon: <FaCrown />, color: "#a78bfa", label: "Leadership Track",
    roles: ["Senior Therapist", "Mental Health Program Lead", "Head of Human Resources"]
  }
];

const standout = [
  { num: "01", title: "Real Indian Case Studies",   desc: "Learn using culturally relevant psychological scenarios that reflect real Indian contexts and challenges." },
  { num: "02", title: "Portfolio-Based Learning",   desc: "Graduate with documented proof of skills — employers trust portfolios far more than certificates alone." },
  { num: "03", title: "Professional Community",     desc: "Collaborate with peers and mentors in an active, supportive, and growing psychology learning network." },
  { num: "04", title: "Career Support",             desc: "Interview preparation, networking opportunities, and professional guidance included throughout." }
];

const curriculum = [
  {
    phase: "Phase 01", title: "Foundations of the Self",
    topics: ["Psychology beyond myths", "Understanding behavior", "Identity and personality", "Attachment and relationships"],
    project: "Psychology Observation Journal",
    outcome: "Develop self-awareness and foundational understanding of human behavior."
  },
  {
    phase: "Phase 02", title: "Social & Emotional Psychology",
    topics: ["Social perception", "Stereotypes and biases", "Emotional regulation", "Social influence"],
    project: "Emotion Diary Analysis",
    outcome: "Understand emotions and human social interactions at a deep level."
  },
  {
    phase: "Phase 03", title: "Mental Health & Healing",
    topics: ["Psychological disorders", "Anxiety and depression", "Trauma awareness", "Therapy approaches"],
    project: "Mental Health Awareness Campaign",
    outcome: "Build empathy and genuine mental health literacy for real-world impact."
  },
  {
    phase: "Phase 04", title: "Applied Psychology & Career Development",
    topics: ["Applied psychology", "Career pathways", "Networking strategies", "Professional growth"],
    project: "Personal Psychology Career Blueprint",
    outcome: "Create a concrete roadmap toward a fulfilling psychology career."
  }
];

const mentorHighlights = [
  "Human-centered teaching approach",
  "Practical clinical insights",
  "Real-world case discussions",
  "Personalized guidance"
];

const resources = [
  {
    icon: <FaBriefcase />, title: "Career Launchpad",
    items: [
      { icon: <FaRocket />,    text: "Internship Opportunities" },
      { icon: <FaShieldAlt />, text: "Interview Preparation" },
      { icon: <FaNetworkWired />, text: "Community Access" }
    ]
  },
  {
    icon: <FaBookOpen />, title: "Learning Resources",
    items: [
      { icon: <FaMicroscope />, text: "Academic Research Access" },
      { icon: <FaBrain />,      text: "Psychometric Assessment Practice" },
      { icon: <FaGlobe />,      text: "Curated Reading Lists" }
    ]
  }
];

const projects = [
  { title: "The Social Media Mind",      desc: "Analyze online identity formation and digital behavior patterns in modern society." },
  { title: "Culture & Career Decisions", desc: "Study social and family influences on career choices across Indian cultural contexts." },
  { title: "Mental Health Stigma",       desc: "Investigate cultural barriers to seeking psychological support and propose solutions." },
  { title: "Adapting Therapy Models",    desc: "Explore culturally responsive psychological interventions for Indian communities." }
];

const testimonials = [
  { name: "Priya S.",   role: "Psychology Graduate, Delhi",         initials: "PS", stars: 5, text: "The practical case studies completely transformed my understanding of mental health. This isn't just theory — it's real-world psychology I apply every single day." },
  { name: "Arjun M.",   role: "HR Professional, Bangalore",         initials: "AM", stars: 5, text: "As someone from a non-psychology background, I was amazed by how accessible yet genuinely deep the content is. The mentor support was exceptional throughout." },
  { name: "Sneha K.",   role: "Counseling Intern, Mumbai",          initials: "SK", stars: 5, text: "The portfolio I built during this course directly helped me land my internship. The community and mentorship made all the difference in my early career." },
  { name: "Rahul T.",   role: "UX Researcher, Pune",                initials: "RT", stars: 5, text: "Understanding human behavior through psychology gave my UX career a massive edge. The curriculum is genuinely ahead of anything else I've tried online." },
  { name: "Ananya B.",  role: "Mental Health Advocate, Chennai",    initials: "AB", stars: 5, text: "Life-changing. I now run mental health awareness workshops thanks to what I learned here. The cultural case studies were incredibly relevant and refreshing." },
  { name: "Vikram N.",  role: "Organizational Psychologist, Hyderabad", initials: "VN", stars: 5, text: "The career support and networking community opened doors I didn't even know existed. Highly recommend for anyone serious about a psychology career." }
];

const industryLogos = [
  { icon: <FaBuilding />,         label: "NIMHANS" },
  { icon: <FaHeart />,            label: "iCall" },
  { icon: <FaHospital />,         label: "Fortis Healthcare" },
  { icon: <FaGlobe />,            label: "YourDOST" },
  { icon: <FaMicroscope />,       label: "AIIMS" },
  { icon: <FaUsers />,            label: "iHope" },
  { icon: <FaHandHoldingHeart />, label: "Vandrevala Foundation" },
  { icon: <FaGraduationCap />,    label: "IIT Bombay" }
];

const faqs = [
  { q: "Do I need a psychology background to enroll?",    a: "No prior background is required. This program builds foundational knowledge before moving to advanced applications — anyone with a strong interest in human behavior can succeed." },
  { q: "Is this program practical or theoretical?",       a: "Both. You'll learn core theoretical frameworks, but spend significant time on real-world case studies, portfolio projects, and mentored applied practice." },
  { q: "Will there be live mentorship sessions?",         a: "Yes. You'll have access to experienced psychology professionals for guidance, case discussions, and personalized feedback throughout the program." },
  { q: "How much time should I commit weekly?",           a: "We recommend 8–12 hours per week to fully engage with material, attend sessions, and complete your applied portfolio projects at a deep level." },
  { q: "What career outcomes can I expect?",              a: "Graduates often pursue roles in counseling, HR, UX research, mental health advocacy, organizational psychology, and academic research across India." },
  { q: "Is there a certificate upon completion?",         a: "Yes — you receive a Course Completion Certificate and a Professional Letter of Recommendation that enhance your LinkedIn profile and academic/internship applications." }
];

const compareRows = [
  { feature: "Learning Approach",  bad: "Theory-heavy lectures",         good: "Project-first, hands-on learning" },
  { feature: "Practical Exposure", bad: "Limited case studies",           good: "Real Indian case studies throughout" },
  { feature: "Assignments",        bad: "Generic, repetitive tasks",       good: "Portfolio-building capstone projects" },
  { feature: "Mentorship",         bad: "Minimal or none",                 good: "Expert guidance from day one" },
  { feature: "Career Focus",       bad: "Degree-oriented only",            good: "Career-focused outcomes guaranteed" },
  { feature: "Community",          bad: "Isolated learning experience",    good: "Active, vibrant peer community" }
];

// ── FLOAT CARD CONFIG (svg icons, no emojis) ───────────────────
const floatCards = [
  { pos: "cp-fcard-1", iconClass: "purple", label: "Mental Health",          sub: "Core Foundation",  Icon: MdPsychology },
  { pos: "cp-fcard-2", iconClass: "pink",   label: "Human Behavior",         sub: "Deep Insights",    Icon: FaUsers },
  { pos: "cp-fcard-3", iconClass: "blue",   label: "Emotional Intelligence", sub: "Self Mastery",     Icon: FaHeart },
  { pos: "cp-fcard-4", iconClass: "teal",   label: "Psych Assessment",       sub: "Applied Skills",   Icon: FaClipboardList },
];

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const ClinicalPsychology = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('Clinical Psychology');
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="cp-page">
      <Helmet>
        <title>Clinical Psychology Course | Decode the Mind | Krutanic</title>
        <meta name="description" content="Explore the science of human behavior, emotions, cognition, and mental health. Build a meaningful career in Clinical Psychology with expert mentorship, real Indian case studies, and a portfolio that gets you hired." />
        <meta property="og:title" content="Clinical Psychology Course — Krutanic" />
        <meta property="og:description" content="Premium Clinical Psychology learning experience: mentorship, real case studies, career support, certification." />
      </Helmet>

      {/* Background */}
      <ScrollProgress />
      <NeuralCanvas />
      <div className="cp-orb cp-orb-1" />
      <div className="cp-orb cp-orb-2" />
      <div className="cp-orb cp-orb-3" />
      <div className="cp-watermark">MIND</div>

      {/* Sticky CTA */}
      <motion.div className="cp-sticky-cta" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }}>
        <button onClick={() => setIsModalOpen(true)} id="sticky-cta">
          Start Learning <FaArrowRight />
        </button>
      </motion.div>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="cp-hero">
        <div className="cp-hero-inner">

          {/* LEFT */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div className="cp-hero-badge" variants={fadeUp}>
              <span className="cp-badge-live" />
              Enrolling Now · Clinical Psychology
            </motion.div>

            <motion.h1 className="cp-hero-title" variants={fadeUp}>
              <span className="cp-serif">Decode</span> the Mind.<br />
              Understand Yourself.<br />
              Build Your <span style={{ color: "#c084fc" }}>Career.</span>
            </motion.h1>

            <motion.p className="cp-hero-sub" variants={fadeUp}>
              Explore the science of human behavior, emotions, cognition, and mental health
              through practical learning, real-world case studies, expert mentorship, and
              portfolio-building projects designed for a career-first future.
            </motion.p>

            <motion.div className="cp-hero-ctas" variants={fadeUp}>
              <button onClick={() => setIsModalOpen(true)} className="cp-btn-primary" id="hero-start">
                Start Learning <FaArrowRight />
              </button>
              <a href="#curriculum" className="cp-btn-secondary" id="hero-curriculum">
                View Curriculum
              </a>
            </motion.div>

            {/* Trust pills */}
            <motion.div className="cp-hero-trust-row" variants={fadeUp}>
              <span className="cp-trust-pill">
                <FaStar className="cp-trust-pill-icon" style={{ color: "#fbbf24" }} /> 4.9 / 5 Rating
              </span>
              <span className="cp-trust-pill">
                <FaGraduationCap className="cp-trust-pill-icon" style={{ color: "#c084fc" }} /> 4-Phase Curriculum
              </span>
              <span className="cp-trust-pill">
                <FaCheckCircle className="cp-trust-pill-icon" style={{ color: "#22c55e" }} /> Certificate Included
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div className="cp-hero-stats" variants={stagger} style={{ marginTop: "2.5rem" }}>
              <div className="cp-stat">
                <div className="cp-stat-val">20%</div>
                <div className="cp-stat-label">Annual Growth in Mental Health Industry</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">73M+</div>
                <div className="cp-stat-label">People Affected by Mental Health Challenges</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">50k+</div>
                <div className="cp-stat-label">New Psychology Career Opportunities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Brain Visual */}
          <motion.div
            className="cp-hero-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cp-brain-wrap">
              <div className="cp-brain-inner">
                <div className="cp-brain-ring cp-brain-ring-1" />
                <div className="cp-brain-ring cp-brain-ring-2" />
                <div className="cp-brain-ring cp-brain-ring-3" />
                <div className="cp-brain-glow-center" />
                <BrainSVG />
                <div className="cp-float-cards">
                  {floatCards.map((c, i) => (
                    <motion.div
                      key={i}
                      className={`cp-fcard ${c.pos}`}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={`cp-fcard-icon ${c.iconClass}`}>
                        <c.Icon />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f8fafc" }}>{c.label}</div>
                        <span className="cp-fcard-label">{c.sub}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MARQUEE TRUST BAR ══════════════════════════════════ */}
      <div className="cp-marquee-bar">
        <div className="cp-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="cp-marquee-item">
              <span className="cp-marquee-dot-icon"><FaCheckCircle size={10} /></span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ COUNTER BAND ═══════════════════════════════════════ */}
      <div className="cp-counter-band">
        <div className="cp-counter-inner">
          {[
            { end: 73,    suffix: "M+", desc: "People Affected by Mental Health Challenges Globally" },
            { end: 20,    suffix: "%",  desc: "Annual Growth in the Global Mental Health Sector" },
            { end: 50000, suffix: "+",  desc: "New Psychology Career Opportunities Emerging Worldwide" }
          ].map((c, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="cp-counter-val"><AnimatedCounter end={c.end} suffix={c.suffix} /></span>
              <p className="cp-counter-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ WHY THE MIND MATTERS ═══════════════════════════════ */}
      <section className="cp-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Why It Matters</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 1.25rem" }}>
            The Mind is the <span className="cp-accent">New Frontier</span>
          </h2>
        </motion.div>
        <motion.p className="cp-desc" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Psychology is no longer limited to therapy rooms. Understanding human behavior powers
          leadership, healthcare, education, product design, research, and organizational success.
          The demand for psychology professionals keeps rising as society prioritizes mental well-being.
        </motion.p>
        <motion.div className="cp-why-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          {whyMatters.map((item, i) => (
            <motion.div className="cp-why-card" key={i} variants={fadeUp}>
              <div className="cp-why-icon-wrap" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ WHY LEARN WITH US ══════════════════════════════════ */}
      <section className="cp-section" style={{ paddingTop: 0 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Our Approach</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
            A Learning Experience Built for <span className="cp-accent">Real Growth</span>
          </h2>
        </motion.div>
        <motion.div className="cp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          {whyUs.map((item, i) => (
            <motion.div className="cp-card" key={i} variants={fadeUp}>
              <div className="cp-card-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ CAREER PATHWAYS ════════════════════════════════════ */}
      <div className="cp-section-full cp-career-bg">
        <div className="cp-section-inner">
          <motion.div style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="cp-label" style={{ justifyContent: "center" }}>Career Pathways</div>
            <h2 className="cp-h2 cp-h2-center" style={{ marginBottom: "3rem" }}>
              One Foundation. <span className="cp-accent">Endless</span> Career Possibilities.
            </h2>
          </motion.div>

          <motion.div className="cp-career-foundation" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="cp-found-badge">
              <FaBrain style={{ color: "#c084fc", fontSize: "1.2rem" }} />
              Foundational Psychology Skills
            </div>
          </motion.div>

          <div className="cp-tree-connector">
            <div className="cp-connector-stem" />
            <div className="cp-connector-spread" />
          </div>

          <motion.div className="cp-track-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            {careerTracks.map((track, i) => (
              <motion.div className="cp-track-card" key={i} variants={fadeUp}>
                <div className="cp-track-card-inner" />
                <div className="cp-track-icon-wrap" style={{ color: track.color }}>
                  {track.icon}
                </div>
                <div className="cp-track-name">{track.label}</div>
                <ul className="cp-track-roles">
                  {track.roles.map((role, j) => (
                    <li key={j}>{role}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ WHAT MAKES IT DIFFERENT ════════════════════════════ */}
      <section className="cp-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">What's Different</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
            What Makes This Program <span className="cp-accent">Stand Out?</span>
          </h2>
        </motion.div>
        <motion.div className="cp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          {standout.map((item, i) => (
            <motion.div className="cp-card" key={i} variants={fadeUp} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: "-0.5rem", right: "1.5rem",
                fontSize: "5rem", fontWeight: 900, color: "rgba(192,132,252,0.08)",
                fontFamily: "monospace", lineHeight: 1, pointerEvents: "none",
                letterSpacing: "-0.05em"
              }}>{item.num}</div>
              <h4 style={{ color: "#c084fc", fontSize: "1.25rem", marginBottom: "0.75rem" }}>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ CURRICULUM TIMELINE ════════════════════════════════ */}
      <section className="cp-section" id="curriculum" style={{ paddingTop: 0 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Curriculum</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 1.25rem" }}>
            Your Clinical Psychology <span className="cp-accent">Learning Journey</span>
          </h2>
        </motion.div>
        <motion.p className="cp-desc" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          A structured 4-phase journey from foundational understanding to career-ready professional,
          with a compelling portfolio at every milestone.
        </motion.p>

        <div className="cp-timeline-wrap">
          <div className="cp-timeline-line" />
          {curriculum.map((item, i) => (
            <motion.div
              className="cp-tl-item" key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
            >
              <div className="cp-tl-node">{i + 1}</div>
              <div className="cp-tl-card">
                <div className="cp-tl-phase">{item.phase}</div>
                <h3 className="cp-tl-title">{item.title}</h3>
                <div className="cp-tl-chips">
                  {item.topics.map((t, j) => <span className="cp-tl-chip" key={j}>{t}</span>)}
                </div>
                <div className="cp-tl-footer">
                  <div className="cp-tl-meta">
                    <strong>Project</strong>
                    <span>{item.project}</span>
                  </div>
                  <div className="cp-tl-meta">
                    <strong>Outcome</strong>
                    <span>{item.outcome}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ MENTOR ══════════════════════════════════════════════ */}
      <div className="cp-section-full">
        <div className="cp-section-inner">
          <div className="cp-mentor-grid">
            <motion.div className="cp-mentor-img-outer" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft}>
              <div className="cp-mentor-stat-badge">
                <strong>7+</strong>
                <span>Yrs Experience</span>
              </div>
              <div className="cp-mentor-img-frame">
                <img src={nishithaImg} alt="Nishitha Jha — Lead Psychology Mentor" />
                <div className="cp-mentor-img-fade" />
                <div className="cp-mentor-name-tag">
                  <strong>Nishitha Jha</strong>
                  <span>Lead Consultant · Clinical Psychology</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="cp-mentor-text" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}>
              <div className="cp-label">Expert Mentorship</div>
              <h2>
                Learn from <em>Nishitha Jha</em> —<br />A Practicing Professional
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {[1,2,3,4,5].map(i => (
                  <FaStar key={i} style={{ color: "#fbbf24", fontSize: "1.1rem" }} />
                ))}
                <span style={{ color: "var(--cp-muted)", fontSize: "0.9rem", marginLeft: "0.25rem" }}>
                  5.0 · Lead Consultant · Psychology
                </span>
              </div>
              <p>
                Learn from Nishitha Jha — a Lead Consultant with 7+ years of experience in
                Clinical &amp; Applied Psychology. She brings academic rigor together with
                real clinical experience, guiding students through culturally relevant Indian
                case studies, reflective practice, and mentored portfolio development that
                genuinely prepares you for a meaningful, impactful career.
              </p>
              <div className="cp-mentor-checks">
                {mentorHighlights.map((h, i) => (
                  <div className="cp-mentor-check" key={i}>
                    <div className="cp-check-dot"><FaCheck style={{ fontSize: "0.55rem" }} /></div>
                    {h}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ RESOURCES ═══════════════════════════════════════════ */}
      <section className="cp-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Resources</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
            Your Psychology <span className="cp-accent">Success Toolkit</span>
          </h2>
        </motion.div>
        <motion.div className="cp-resource-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          {resources.map((res, i) => (
            <motion.div className="cp-resource-card" key={i} variants={fadeUp}>
              <div className="cp-card-icon">{res.icon}</div>
              <h4>{res.title}</h4>
              <ul className="cp-resource-list">
                {res.items.map((item, j) => (
                  <li key={j}>{item.icon} {item.text}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ CAPSTONE PROJECTS ═══════════════════════════════════ */}
      <section className="cp-section" style={{ paddingTop: 0 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Capstone Projects</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
            Graduate With More Than <span className="cp-accent">Knowledge</span>
          </h2>
        </motion.div>
        <motion.div className="cp-projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          {projects.map((proj, i) => (
            <motion.div className="cp-proj-card" key={i} variants={fadeUp}>
              <div className="cp-proj-card-glow" />
              <div className="cp-proj-num">Project {String(i + 1).padStart(2, "0")}</div>
              <h4>{proj.title}</h4>
              <p>{proj.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="cp-proj-banner" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-proj-banner-text">
            <strong>Build a portfolio that proves your skills to employers</strong>
            <span>Real projects. Real outcomes. Real career impact.</span>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="cp-btn-primary" id="projects-cta">
            Apply Now <FaArrowRight />
          </button>
        </motion.div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════════ */}
      <div className="cp-section-full" style={{
        background: "linear-gradient(180deg, rgba(192,132,252,0.04) 0%, transparent 100%)",
        borderTop: "1px solid rgba(255,255,255,0.09)",
        borderBottom: "1px solid rgba(255,255,255,0.09)"
      }}>
        <div className="cp-section-inner">
          <motion.div style={{ textAlign: "center", marginBottom: "4rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="cp-label" style={{ justifyContent: "center" }}>Student Voices</div>
            <h2 className="cp-h2 cp-h2-center">
              What <span className="cp-accent">Students</span> Say
            </h2>
          </motion.div>
          <motion.div className="cp-testi-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            {testimonials.map((t, i) => (
              <motion.div className="cp-testi-card" key={i} variants={fadeUp}>
                <div className="cp-testi-top">
                  <div className="cp-testi-stars">
                    {Array(t.stars).fill(0).map((_, j) => (
                      <FaStar key={j} className="cp-testi-star" />
                    ))}
                  </div>
                  <div className="cp-quote-mark">"</div>
                </div>
                <p className="cp-testi-text">{t.text}</p>
                <div className="cp-testi-author">
                  <div className="cp-testi-avatar">{t.initials}</div>
                  <div>
                    <div className="cp-testi-name">{t.name}</div>
                    <div className="cp-testi-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ INDUSTRY RECOGNITION ════════════════════════════════ */}
      <section className="cp-section">
        <motion.div style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label" style={{ justifyContent: "center" }}>Industry Impact</div>
          <h2 className="cp-h2 cp-h2-center" style={{ marginBottom: "0.5rem" }}>
            Where Psychology Skills <span className="cp-accent">Create Impact</span>
          </h2>
        </motion.div>
        <motion.div className="cp-logos-row" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {industryLogos.map((logo, i) => (
            <motion.div className="cp-logo-chip" key={i} variants={fadeUp}>
              {logo.icon} {logo.label}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ CERTIFICATION ═══════════════════════════════════════ */}
      <section className="cp-section" style={{ paddingTop: 0 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label">Credentials</div>
          <h2 className="cp-h2 cp-h2-center" style={{ maxWidth: 700, margin: "0 auto 4rem" }}>
            Credentials That <span className="cp-accent">Open Doors</span>
          </h2>
        </motion.div>
        <motion.div className="cp-cert-row" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
          <motion.div className="cp-cert-card" variants={fadeUp}>
            <div className="cp-cert-icon-wrap"><FaTrophy /></div>
            <h4>Course Completion Certificate</h4>
            <p>A verifiable certificate demonstrating your mastery of clinical psychology concepts and practical applied skills.</p>
          </motion.div>
          <motion.div className="cp-cert-card" variants={fadeUp}>
            <div className="cp-cert-icon-wrap"><FaAward /></div>
            <h4>Professional Letter of Recommendation</h4>
            <p>A personalized recommendation letter from your mentor highlighting your achievements and professional potential.</p>
          </motion.div>
        </motion.div>
        <motion.ul className="cp-cert-pills" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {[
            { icon: <FaCheckCircle />, text: "LinkedIn Enhancement" },
            { icon: <FaCheckCircle />, text: "Higher Credibility" },
            { icon: <FaCheckCircle />, text: "Academic Applications" },
            { icon: <FaCheckCircle />, text: "Internship Applications" }
          ].map((b, i) => (
            <motion.li key={i} variants={fadeUp}>
              {b.icon} {b.text}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ═══ COMPARISON TABLE ════════════════════════════════════ */}
      <div className="cp-section-full cp-compare-bg">
        <div className="cp-section-inner">
          <motion.div style={{ textAlign: "center", marginBottom: "3rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="cp-label" style={{ justifyContent: "center" }}>Why This Program</div>
            <h2 className="cp-h2 cp-h2-center">
              The Clearest <span className="cp-accent">Comparison</span>
            </h2>
          </motion.div>
          <motion.div className="cp-compare-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <table className="cp-compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Learning</th>
                  <th>This Program</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td><span className="cp-bad"><FaCheckCircle style={{ opacity: 0 }} /></span>{row.bad}</td>
                    <td><span className="cp-good"><FaCheckCircle /></span>{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>

      {/* ═══ PRICING ══════════════════════════════════════════════════ */}
      <section className="cp-section">
        <motion.h2 className="cp-h2 cp-h2-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} style={{ marginBottom: "4rem" }}>
          Program Investment
        </motion.h2>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <motion.div className="cp-card" variants={fadeUp} style={{ textAlign: "left", padding: "0", overflow: "hidden", maxWidth: "950px", margin: "0 auto", position: "relative", border: "1px solid var(--cp-border-purple)" }}>
            <div className="cp-grid-2" style={{ gap: "0" }}>
              <div className="cp-pricing-left">
                <div className="cp-pricing-badge" style={{ position: "relative", top: "0", left: "0", transform: "none", alignSelf: "flex-start", marginBottom: "1rem" }}>Recommended</div>
                <h3 className="cp-pricing-title" style={{ marginTop: "0" }}>Comprehensive Program</h3>
                <p style={{ fontSize: "1.1rem", marginBottom: "2.5rem", color: "var(--cp-muted)", lineHeight: "1.6" }}>Everything you need to master clinical psychology, build your portfolio, and accelerate your career in one complete package.</p>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="var(--cp-purple)" size={20} style={{ flexShrink: 0 }}/> <span><strong>4-Phase</strong> Curriculum Access</span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="var(--cp-purple)" size={20} style={{ flexShrink: 0 }}/> <span>Practical <strong>Case Studies</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="var(--cp-purple)" size={20} style={{ flexShrink: 0 }}/> <span><strong>Portfolio</strong> Development</span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="var(--cp-purple)" size={20} style={{ flexShrink: 0 }}/> <span>Professional <strong>Certification</strong></span></li>
                  <li style={{ marginBottom: "0", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="var(--cp-purple)" size={20} style={{ flexShrink: 0 }}/> <span><strong>Career Development</strong> Resources</span></li>
                </ul>
              </div>
              
              <div className="cp-pricing-right">
                <p style={{ color: "var(--cp-purple)", fontSize: "1.1rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>Program Fee</p>
                <h4 style={{ fontSize: "4.5rem", color: "#ffffff", margin: "0 0 0.5rem 0", lineHeight: "1" }}>₹11,999</h4>
                <p style={{ color: "var(--cp-muted)", fontSize: "1rem", marginBottom: "2.5rem" }}>One-time payment. Full access.</p>
                <button onClick={() => setIsModalOpen(true)} className="cp-btn-primary" style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>Enroll Now</button>
                <p style={{ color: "var(--cp-muted)", fontSize: "0.9rem", marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <FaCheckCircle color="#22c55e" /> Secure Enrollment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════ */}
      <section className="cp-section">
        <motion.div style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="cp-label" style={{ justifyContent: "center" }}>FAQ</div>
          <h2 className="cp-h2 cp-h2-center" style={{ marginBottom: "4rem" }}>
            Frequently Asked <span className="cp-accent">Questions</span>
          </h2>
        </motion.div>
        <motion.div className="cp-faq-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {faqs.map((faq, i) => (
            <motion.div className="cp-faq-item" key={i} variants={fadeUp}>
              <div className="cp-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)} id={`faq-${i}`}>
                <span>{faq.q}</span>
                <div className="cp-faq-chevron">
                  <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <FaChevronDown size={12} />
                  </motion.div>
                </div>
              </div>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="cp-faq-a">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════ */}
      <section className="cp-final-cta">
        <div className="cp-final-mesh" />
        <div className="cp-final-cta-border" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div className="cp-label" style={{ justifyContent: "center" }}>Your Journey Starts Here</div>
          </motion.div>
          <motion.h2 className="cp-final-title" variants={fadeUp}>
            Ready to Understand<br />the <em>Human Mind?</em>
          </motion.h2>
          <motion.p className="cp-final-sub" variants={fadeUp}>
            Take the first step toward building a meaningful career in psychology while gaining
            deeper insight into human behavior, mental well-being, and your own potential.
          </motion.p>
          <motion.div className="cp-final-btns" variants={fadeUp}>
            <button onClick={() => setIsModalOpen(true)} className="cp-btn-primary" id="final-apply">
              Apply Now <FaArrowRight />
            </button>
            <button className="cp-btn-secondary" id="final-brochure">
              Download Curriculum
            </button>
          </motion.div>
        </motion.div>
      </section>

      <MedProFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedCourse={selectedCourse} />
    </div>
  );
};

export default ClinicalPsychology;
