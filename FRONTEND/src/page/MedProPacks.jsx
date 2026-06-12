import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaBrain, FaHeart, FaUserGraduate, FaHospital, FaBriefcase, FaCrown, FaUserTie,
  FaFileAlt, FaBalanceScale, FaLightbulb, FaUsers, FaRegCalendarAlt, FaStar,
  FaCheckCircle, FaChevronDown, FaPlay, FaMedal, FaTrophy, FaAward, FaChalkboardTeacher, FaArrowRight,
  FaGlobe, FaChartLine
} from "react-icons/fa";
import { MdPsychology, MdGavel, MdOutlineScience, MdAccountBalance, MdSecurity } from "react-icons/md";
import { IoDiamondOutline } from "react-icons/io5";
import "./MedProPacks.css";
import MedProFormModal from "./MedProFormModal";

// ── VARIANTS ──────────────────────────────────────────────────
const fadeUp   = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } };
const fadeRight= { hidden: { opacity: 0, x: 60  }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } };
const stagger  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };

// ── COUNTER ──────────────────────────────────────────────────
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
  return <span>{end.toLocaleString()}{suffix}</span>;
};

// ── SCROLL PROGRESS ───────────────────────────────────────────
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
  return <div className="mp2-progress" style={{ width: `${p}%` }} />;
};

// ── DATA ──────────────────────────────────────────────────────
const programs = [
  {
    id: "forensic",
    badge: "Bestseller",
    badgeColor: "#f59e0b",
    Icon: MdPsychology,
    accentColor: "#c084fc",
    gradient: "linear-gradient(90deg, rgba(10,10,20,0.95) 20%, rgba(192,132,252,0.5) 100%)",
    image: "/medpro/forensic.png",
    title: "Forensic Psychology",
    subtitle: "Where Law Meets the Mind",
    duration: "2-3 Months",
    level: "Advanced",
    domain: "Psychology · Law",
    description: "Master the intersection of psychological science and the criminal justice system. From psychological profiling and offender analysis to courtroom testimony, victim support, and forensic assessment — this program positions you at the cutting edge of legal psychology.",
    outcomes: ["Forensic Psychological Assessment", "Criminal Profiling & Behavioural Analysis", "Courtroom Expert Witness Preparation", "Victim Support & Trauma Counselling", "Legal Documentation & Report Writing"],
    roles: ["Forensic Psychologist", "Criminal Profiler", "Legal Consultant", "Victim Advocate"],
    link: "/forensic-psychology"
  },
  {
    id: "clinical",
    badge: "Most Popular",
    badgeColor: "#22c55e",
    Icon: FaBrain,
    accentColor: "#818cf8",
    gradient: "linear-gradient(90deg, rgba(10,10,20,0.95) 20%, rgba(129,140,248,0.5) 100%)",
    image: "/medpro/clinical.png",
    title: "Clinical Psychology",
    subtitle: "Decode the Human Mind",
    duration: "2-3 Months",
    level: "Professional",
    domain: "Psychology · Mental Health",
    description: "A comprehensive, career-first deep dive into clinical mental health. Explore advanced therapeutic techniques, psychodiagnosis, behavioral analysis, trauma-informed care, and real Indian case studies. Graduate with a portfolio, certificate, and mentorship from a practicing Lead Consultant.",
    outcomes: ["Clinical Assessment & Psychodiagnosis", "CBT, DBT & Integrative Therapy Approaches", "Trauma-Informed Practice", "Mental Health Advocacy & Awareness", "Portfolio-Based Career Readiness"],
    roles: ["Clinical Psychologist", "Counselling Psychologist", "Mental Health Consultant", "UX Researcher"],
    link: "/clinical-psychology"
  },
  {
    id: "law",
    badge: "New",
    badgeColor: "#06b6d4",
    Icon: MdGavel,
    accentColor: "#e879f9",
    gradient: "linear-gradient(90deg, rgba(10,10,20,0.95) 20%, rgba(232,121,249,0.5) 100%)",
    image: "/medpro/law.png",
    title: "Corporate Law",
    subtitle: "Navigate Corporate Power Structures",
    duration: "2-3 Months",
    level: "Intermediate–Advanced",
    domain: "Law · Finance",
    description: "From high-stakes M&A transactions and legal due diligence to corporate governance, IP law, and securities regulation — this program equips aspiring legal professionals with the technical expertise demanded by India's top law firms and corporate legal departments.",
    outcomes: ["Mergers & Acquisitions Deep Dive", "Legal Due Diligence & Documentation", "Corporate Governance Frameworks", "IP & Securities Law Fundamentals", "Negotiation & Deal Structuring"],
    roles: ["Corporate Lawyer", "Legal Analyst", "Compliance Officer", "In-House Counsel"],
    link: "/corporate-law"
  },
  {
    id: "psychology",
    badge: "Trending",
    badgeColor: "#3b82f6",
    Icon: MdOutlineScience,
    accentColor: "#3b82f6",
    gradient: "linear-gradient(90deg, rgba(10,10,20,0.95) 20%, rgba(59,130,246,0.5) 100%)",
    image: "/medpro/psychology.png",
    title: "Psychology",
    subtitle: "Explore the Human Mind & Behavior",
    duration: "2-3 Months",
    level: "Beginner–Intermediate",
    domain: "Psychology · Science",
    description: "A foundational to advanced journey into general psychology. Understand cognitive processes, human development, social interactions, and behavioral theories. Perfect for beginners or those seeking to apply psychological principles in HR, marketing, or general management.",
    outcomes: ["Cognitive & Behavioral Analysis", "Social Psychology & Group Dynamics", "Developmental Stages & Learning Theories", "Personality Psychology", "Research Methods & Ethics"],
    roles: ["Behavioral Analyst", "HR Specialist", "Market Researcher", "Educational Consultant"],
    link: "/psychology"
  }
];

const whyKrutanic = [
  { Icon: FaLightbulb,  color: "#c084fc", title: "Project-First Learning",    desc: "Hands-on case studies and portfolio projects — not passive video lectures." },
  { Icon: FaUserTie,     color: "#818cf8", title: "Practicing Mentors",        desc: "Learn from experts who work in the field, not just academics." },
  { Icon: FaUsers,      color: "#e879f9", title: "Active Community",          desc: "Peer cohorts, group discussions, and a lifelong professional network." },
  { Icon: FaTrophy,     color: "#fbbf24", title: "Career Outcomes",           desc: "Certificate, letter of recommendation, and internship prep built in." },
  { Icon: FaGlobe,      color: "#22c55e", title: "Culturally Relevant",       desc: "Indian case studies and context for real-world application in India." },
  { Icon: FaChartLine,  color: "#f472b6", title: "Industry-Aligned Curriculum", desc: "Constantly updated to reflect what employers actually hire for." }
];

const stats = [
  { end: 12000, suffix: "+", label: "Program Graduates" },
  { end: 95,    suffix: "%", label: "Learner Satisfaction" },
  { end: 7,     suffix: "+", label: "Years of Excellence" },
  { end: 3,     suffix: "",  label: "Elite Specializations" }
];

const testimonials = [
  { name: "Priya S.",  role: "Forensic Psychology Graduate", initials: "PS", stars: 5, program: "Forensic Psychology",  text: "The forensic assessment modules were unlike anything I've seen elsewhere. I now consult for a legal firm as a forensic specialist." },
  { name: "Arjun M.",  role: "HR Professional, Bangalore",   initials: "AM", stars: 5, program: "Clinical Psychology",   text: "Nishitha's mentorship transformed my understanding of human behavior. The portfolio I built landed me my first psychology role." },
  { name: "Sneha K.",  role: "Corporate Associate, Delhi",   initials: "SK", stars: 5, program: "Corporate Law",         text: "The M&A and due diligence modules were exactly what I needed to crack my interview at a top law firm. Highly practical." },
  { name: "Rahul T.",  role: "Mental Health Consultant",     initials: "RT", stars: 5, program: "Clinical Psychology",   text: "Real case studies, real mentorship, real career support. This program is genuinely different from anything else available online." }
];

const faqs = [
  { q: "Who are these programs designed for?",   a: "These programs are designed for graduates, working professionals, and career-changers looking to enter or advance in psychology, law, or related fields. No prior professional experience is required." },
  { q: "Are the programs 100% online?",          a: "Yes — all sessions, mentorship, resources, and assessments are conducted entirely online, giving you full flexibility to learn at your own pace." },
  { q: "Do I get a certificate?",                a: "Yes. Every program includes a Course Completion Certificate and a Professional Letter of Recommendation from your program mentor." },
  { q: "Can I take more than one program?",      a: "Absolutely. Many of our students complete two programs — for example, Forensic Psychology and Clinical Psychology — to build an even stronger professional profile." },
  { q: "Is there live mentorship included?",     a: "Yes — each program includes live mentor sessions, case discussions, project reviews, and personalized guidance from practicing professionals." },
  { q: "What makes MedPro Packs different?",     a: "MedPro Packs go beyond theory. You graduate with a real portfolio, live mentor access, Indian cultural context, and career support that general online courses simply don't offer." }
];

const marqueeItems = [
  "Forensic Psychology", "Clinical Psychology", "Corporate Law",
  "Expert Mentorship", "Portfolio-Based Learning", "Certificate Included",
  "Career-Focused Outcomes", "Real Case Studies", "Indian Context",
  "Live Sessions", "Professional Community", "7+ Years of Excellence"
];

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const MedProPacks = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeProgram, setActiveProgram] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleApply = (courseName = "") => {
    setSelectedCourse(courseName);
    setIsModalOpen(true);
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Auto-rotate the active program in the hero section every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProgram((prev) => (prev + 1) % programs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mp2-page">
      <Helmet>
        <title>MedPro Packs — Psychology, Law & More | Krutanic</title>
        <meta name="description" content="Explore Krutanic's elite MedPro Packs: Forensic Psychology, Clinical Psychology, and Corporate Law. Expert mentorship, portfolio-first learning, and career-ready outcomes." />
      </Helmet>

      <ScrollProgress />

      {/* Background */}
      <div className="mp2-orb mp2-orb-1" />
      <div className="mp2-orb mp2-orb-2" />
      <div className="mp2-orb mp2-orb-3" />
      <div className="mp2-grid-bg" />

      {/* Sticky CTA */}
      <motion.div className="mp2-sticky-cta" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
        <button onClick={() => handleApply("General Enquiry")} id="mp-sticky-apply">Apply Now <FaArrowRight /></button>
      </motion.div>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="mp2-hero">
        <motion.div className="mp2-hero-content" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="mp2-hero-badge" variants={fadeUp}>
            <span className="mp2-badge-dot" />
            3 Elite Programs · Now Enrolling
          </motion.div>

          <motion.h1 className="mp2-hero-title" variants={fadeUp}>
            Where <span className="mp2-serif mp2-grad">Science,</span><br />
            <span className="mp2-serif mp2-grad">Law</span> & <span className="mp2-serif mp2-grad-pink">Mind</span><br />
            Converge.
          </motion.h1>

          <motion.p className="mp2-hero-sub" variants={fadeUp}>
            Krutanic MedPro Packs are exclusive professional certification programs spanning
            Forensic Psychology, Clinical Psychology, and Corporate Law — each built for
            real careers, not just credentials.
          </motion.p>

          <motion.div className="mp2-hero-ctas" variants={fadeUp}>
            <a href="#programs" className="mp2-btn-primary" id="mp-hero-explore">
              Explore Programs <FaArrowRight />
            </a>
            <button className="mp2-btn-secondary" onClick={() => handleApply(programs[activeProgram].title)}>Apply Now</button>
          </motion.div>

          <motion.div className="mp2-trust-pills" variants={fadeUp}>
            <span className="mp2-pill"><FaStar style={{ color: "#fbbf24" }} /> 4.9 / 5 Rating</span>
            <span className="mp2-pill"><FaCheckCircle style={{ color: "#22c55e" }} /> 100% Online</span>
            <span className="mp2-pill"><FaAward style={{ color: "#c084fc" }} /> Certificate + Rec. Letter</span>
            <span className="mp2-pill"><FaUsers style={{ color: "#818cf8" }} /> 12,000+ Graduates</span>
          </motion.div>
        </motion.div>

        {/* Right — Program Preview Cards */}
        <motion.div
          className="mp2-hero-cards"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22,1,0.36,1] }}
        >
          {programs.map((p, i) => (
            <motion.div
              key={p.id}
              className={`mp2-hero-mini-card ${activeProgram === i ? "active" : ""}`}
              style={{ "--accent": p.accentColor }}
              onClick={() => setActiveProgram(i)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
            >
              <div className="mp2-mini-icon" style={{ color: p.accentColor }}>
                <p.Icon />
              </div>
              <div>
                <div className="mp2-mini-title">{p.title}</div>
                <div className="mp2-mini-sub">{p.duration} · {p.level}</div>
              </div>
              <span className="mp2-mini-badge" style={{ background: p.badgeColor }}>{p.badge}</span>
            </motion.div>
          ))}

          {/* Active program preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram}
              className="mp2-hero-preview"
              style={{ background: `${programs[activeProgram].gradient}, url(${programs[activeProgram].image}) center/cover no-repeat`, "--accent": programs[activeProgram].accentColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mp2-preview-tag" style={{ color: programs[activeProgram].accentColor }}>
                {programs[activeProgram].domain}
              </div>
              <div className="mp2-preview-title">{programs[activeProgram].subtitle}</div>
              <p className="mp2-preview-desc">{programs[activeProgram].description.slice(0, 140)}…</p>
              <Link to={programs[activeProgram].link} className="mp2-btn-text">View Full Program →</Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ══════════════════════════════════════════ */}
      <div className="mp2-marquee-bar">
        <div className="mp2-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mp2-marquee-item">
              <FaCheckCircle className="mp2-marquee-icon" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ STATS BAND ═══════════════════════════════════════ */}
      <div className="mp2-stats-band">
        <div className="mp2-stats-inner">
          {stats.map((s, i) => (
            <motion.div key={i} className="mp2-stat-item" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="mp2-stat-val"><AnimatedCounter end={s.end} suffix={s.suffix} /></div>
              <div className="mp2-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ PROGRAMS ════════════════════════════════════════ */}
      <section className="mp2-section" id="programs">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="mp2-label">The Programs</div>
          <h2 className="mp2-h2 mp2-h2-center">
            Three Disciplines. <span className="mp2-accent">One Platform.</span>
          </h2>
          <p className="mp2-desc">
            Each MedPro Pack is a deeply curated, career-focused program designed by industry
            practitioners — not generalists. Choose your specialization, or stack multiple for a
            rare multidisciplinary edge in the professional world.
          </p>
        </motion.div>

        <div className="mp2-programs-list">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.id}
              className="mp2-prog-card"
              style={{ "--accent": prog.accentColor }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              {/* Top ribbon */}
              <div className="mp2-prog-ribbon" style={{ background: `${prog.gradient}, url(${prog.image}) center/cover no-repeat` }}>
                <div className="mp2-prog-header">
                  <div className="mp2-prog-icon" style={{ color: prog.accentColor, borderColor: prog.accentColor }}>
                    <prog.Icon />
                  </div>
                  <div>
                    <span className="mp2-prog-domain">{prog.domain}</span>
                    <h3 className="mp2-prog-title" style={{ color: prog.accentColor }}>{prog.title}</h3>
                    <div className="mp2-prog-subtitle">{prog.subtitle}</div>
                  </div>
                  <span className="mp2-prog-badge" style={{ background: prog.badgeColor }}>{prog.badge}</span>
                </div>
                <div className="mp2-prog-meta-row">
                  <span className="mp2-meta-pill"><FaRegCalendarAlt /> {prog.duration}</span>
                  <span className="mp2-meta-pill"><FaChartLine /> {prog.level}</span>
                  <span className="mp2-meta-pill"><FaGlobe /> 100% Online</span>
                </div>
              </div>

              {/* Body */}
              <div className="mp2-prog-body">
                <div className="mp2-prog-desc-col">
                  <p className="mp2-prog-description">{prog.description}</p>
                  <div className="mp2-prog-outcomes">
                    <div className="mp2-outcomes-label">What You'll Learn</div>
                    <ul>
                      {prog.outcomes.map((o, j) => (
                        <li key={j}><FaCheckCircle style={{ color: prog.accentColor }} /> {o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mp2-prog-cta-col">
                  <div className="mp2-prog-roles">
                    <div className="mp2-outcomes-label">Career Paths</div>
                    {prog.roles.map((r, j) => (
                      <div key={j} className="mp2-role-chip" style={{ borderColor: `${prog.accentColor}40`, color: prog.accentColor }}>
                        <FaBriefcase size={11} /> {r}
                      </div>
                    ))}
                  </div>
                  <div className="mp2-prog-actions">
                    <Link to={prog.link} className="mp2-prog-btn" style={{ background: `linear-gradient(135deg, ${prog.accentColor} 0%, ${prog.badgeColor} 100%)` }}>
                      Explore Program <FaArrowRight />
                    </Link>
                    <button className="mp2-prog-btn-outline" onClick={() => handleApply(prog.title)} style={{ borderColor: prog.accentColor, color: prog.accentColor }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ WHY KRUTANIC ════════════════════════════════════ */}
      <div className="mp2-section-full mp2-why-bg">
        <div className="mp2-section-inner">
          <motion.div style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mp2-label" style={{ justifyContent: "center" }}>Why Krutanic</div>
            <h2 className="mp2-h2 mp2-h2-center">
              A Different Kind of <span className="mp2-accent">Learning Experience</span>
            </h2>
            <p className="mp2-desc" style={{ maxWidth: 680 }}>
              We didn't just create online courses. We built career launchpads — with mentors who
              practice what they teach, projects that build real portfolios, and a community that
              supports you long after you graduate.
            </p>
          </motion.div>
          <motion.div className="mp2-why-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
            {whyKrutanic.map((item, i) => (
              <motion.div className="mp2-why-card" key={i} variants={fadeUp}>
                <div className="mp2-why-icon" style={{ color: item.color }}>
                  <item.Icon />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ COMPARE PROGRAMS ════════════════════════════════ */}
      <section className="mp2-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="mp2-label">Compare</div>
          <h2 className="mp2-h2 mp2-h2-center">
            Which Program is <span className="mp2-accent">Right for You?</span>
          </h2>
        </motion.div>
        <motion.div className="mp2-compare-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <table className="mp2-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                {programs.map(p => (
                  <th key={p.id} style={{ color: p.accentColor }}>{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Duration",       vals: ["2-3 Months", "2-3 Months", "2-3 Months", "2-3 Months"] },
                { label: "Level",          vals: ["Advanced", "Professional", "Intermediate–Advanced", "Beginner–Intermediate"] },
                { label: "Live Mentorship",vals: ["✓", "✓", "✓", "✓"] },
                { label: "Portfolio Projects", vals: ["✓", "✓", "✓", "✓"] },
                { label: "Certificate",    vals: ["✓", "✓", "✓", "✓"] },
                { label: "Rec. Letter",    vals: ["✓", "✓", "✓", "✓"] },
                { label: "Case Studies",   vals: ["Forensic / Legal", "Clinical / Indian Context", "Corporate / M&A", "Behavioral / Social"] },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="mp2-compare-feature">{row.label}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} className={v === "✓" ? "mp2-check-cell" : ""} style={v === "✓" ? { color: programs[j].accentColor } : {}}>
                      {v === "✓" ? <FaCheckCircle /> : v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="mp2-compare-feature" style={{ borderBottom: "none" }}></td>
                {programs.map((p) => (
                  <td key={p.id} style={{ borderBottom: "none", paddingTop: "2rem" }}>
                    <button 
                      className="mp2-prog-btn-outline" 
                      onClick={() => handleApply(p.title)} 
                      style={{ borderColor: p.accentColor, color: p.accentColor, width: "100%", justifyContent: "center" }}
                    >
                      Apply Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════ */}
      <div className="mp2-section-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mp2-section-inner">
          <motion.div style={{ textAlign: "center", marginBottom: "3.5rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mp2-label" style={{ justifyContent: "center" }}>Student Voices</div>
            <h2 className="mp2-h2 mp2-h2-center">What Graduates <span className="mp2-accent">Say</span></h2>
          </motion.div>
          <motion.div className="mp2-testi-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {testimonials.map((t, i) => (
              <motion.div className="mp2-testi-card" key={i} variants={fadeUp}>
                <div className="mp2-testi-top">
                  <div className="mp2-testi-stars">
                    {Array(t.stars).fill(0).map((_, j) => <FaStar key={j} />)}
                  </div>
                  <div className="mp2-testi-program">{t.program}</div>
                </div>
                <div className="mp2-testi-quote">"</div>
                <p className="mp2-testi-text">{t.text}</p>
                <div className="mp2-testi-author">
                  <div className="mp2-testi-avatar">{t.initials}</div>
                  <div>
                    <div className="mp2-testi-name">{t.name}</div>
                    <div className="mp2-testi-role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ CERTIFICATION ════════════════════════════════════ */}
      <section className="mp2-section">
        <motion.div style={{ textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="mp2-label" style={{ justifyContent: "center" }}>Credentials</div>
          <h2 className="mp2-h2 mp2-h2-center">
            Credentials That <span className="mp2-accent">Open Doors</span>
          </h2>
        </motion.div>
        <motion.div className="mp2-cert-row" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div className="mp2-cert-card" variants={fadeUp}>
            <div className="mp2-cert-icon"><FaTrophy /></div>
            <h4>Course Completion Certificate</h4>
            <p>A verifiable certificate demonstrating mastery of your chosen specialty — ready for your LinkedIn profile, job applications, and academic pathways.</p>
          </motion.div>
          <motion.div className="mp2-cert-card" variants={fadeUp}>
            <div className="mp2-cert-icon"><FaAward /></div>
            <h4>Letter of Recommendation</h4>
            <p>A personalized, professionally written letter from your program mentor — one of the most powerful career tools you can have when entering the field.</p>
          </motion.div>
          <motion.div className="mp2-cert-card" variants={fadeUp}>
            <div className="mp2-cert-icon"><FaBriefcase /></div>
            <h4>Portfolio of Work</h4>
            <p>Graduate with documented, real project work — assessments, case analyses, and capstone projects that prove your skills to any employer.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════ */}
      <div className="mp2-section-full mp2-faq-bg">
        <div className="mp2-section-inner">
          <motion.div style={{ textAlign: "center", marginBottom: "3.5rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mp2-label" style={{ justifyContent: "center" }}>FAQ</div>
            <h2 className="mp2-h2 mp2-h2-center">
              Frequently Asked <span className="mp2-accent">Questions</span>
            </h2>
          </motion.div>
          <motion.div className="mp2-faq-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {faqs.map((faq, i) => (
              <motion.div className="mp2-faq-item" key={i} variants={fadeUp}>
                <div className="mp2-faq-q" onClick={() => setActiveFaq(activeFaq === i ? null : i)} id={`mp-faq-${i}`}>
                  <span>{faq.q}</span>
                  <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <FaChevronDown size={13} />
                  </motion.div>
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
                      <div className="mp2-faq-a">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ FINAL CTA ════════════════════════════════════════ */}
      <section className="mp2-final-cta">
        <div className="mp2-final-mesh" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <div className="mp2-label" style={{ justifyContent: "center" }}>Begin Your Journey</div>
          </motion.div>
          <motion.h2 className="mp2-final-title" variants={fadeUp}>
            Ready to <em>Build Your Career</em><br />at the Intersection of Science & Law?
          </motion.h2>
          <motion.p className="mp2-final-sub" variants={fadeUp}>
            Join thousands of graduates who chose Krutanic MedPro Packs to launch
            careers in forensic psychology, clinical practice, and corporate law.
          </motion.p>
          <motion.div className="mp2-final-btns" variants={fadeUp}>
            <button className="mp2-btn-primary" onClick={() => handleApply("General Enquiry")}>Apply Now →</button>
            <a href="#programs" className="mp2-btn-secondary" id="mp-final-explore">
              Explore Programs
            </a>
          </motion.div>
        </motion.div>
      </section>

      <MedProFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedCourse={selectedCourse} />
    </div>
  );
};

export default MedProPacks;
