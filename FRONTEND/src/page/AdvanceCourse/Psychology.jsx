import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBrain, FaUserGraduate, FaBalanceScale, FaChevronDown, 
  FaCheckCircle, FaStar, FaUsers, FaSearch, FaGavel, 
  FaVideo, FaClipboardList, FaDownload, FaUserTie
} from "react-icons/fa";
import MedProFormModal from "../MedProFormModal";
import "./Psychology.css";

const Psychology = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('Forensic Psychology');

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const whoShouldEnroll = [
    { title: "Psychology Students", desc: "Translate your theoretical psychology knowledge into specialized forensic and legal applications." },
    { title: "Criminal Justice Aspirants", desc: "Understand the human mind behind the crime to excel in law enforcement and criminology roles." },
    { title: "Future Forensic Psychologists", desc: "Build a strong foundational portfolio to prepare for advanced degrees and clinical forensic practice." },
    { title: "Counselors & Mental Health Pros", desc: "Expand your practice by learning to navigate the intersection of mental health and the legal system." },
    { title: "Behavioral Researchers", desc: "Dive deep into crime data, victimology, and behavioral analysis for academic or investigative research." },
    { title: "Media & Social Science Learners", desc: "Study the public perception of crime, the CSI effect, and ethical reporting of violence and trauma." }
  ];

  const outcomes = [
    { icon: <FaBrain />, title: "Foundations & Scope", desc: "Master the core differences between forensic psychology and criminology." },
    { icon: <FaSearch />, title: "Behavioral Patterns", desc: "Analyze criminal behavior, profiling reality, and motives behind offenses." },
    { icon: <FaUsers />, title: "Victimology", desc: "Understand victim psychology, trauma responses, and crisis intervention." },
    { icon: <FaBalanceScale />, title: "Courtroom Assessment", desc: "Evaluate competency to stand trial and criminal responsibility." },
    { icon: <FaClipboardList />, title: "Risk Evaluation", desc: "Learn violence prediction frameworks and risk assessment methodologies." },
    { icon: <FaGavel />, title: "Legal & Ethical Standards", desc: "Navigate the complex ethics of acting as an expert witness." },
    { icon: <FaVideo />, title: "Media Influence", desc: "Critique the impact of media on crime perception and public bias." }
  ];

  const curriculum = [
    { 
      title: "Module 1: Foundations of Forensic Psychology", 
      desc: "An introduction to the field, its applications, and its unique role in the justice system.",
      subtopics: [
        "What is Forensic Psychology? Uses and Advantages",
        "Difference Between Forensic Psychology and Criminology",
        "The Role and Scope of a Forensic Psychologist",
        "Practical Implementation Techniques in the Field",
        "Criminal Behavior: The Nature vs Nurture Debate"
      ]
    },
    { 
      title: "Module 2: Crime & the Human Mind", 
      desc: "Deep dive into profiling, offending behaviors, and the psychology of victims.",
      subtopics: [
        "Criminal Profiling and Behavioral Patterns",
        "Observing and Analyzing Violent Behavior",
        "Basics of Sexual Offending Psychology",
        "Victim Psychology and Trauma Response",
        "Eyewitness Memory and Reliability Issues",
        "Risk Assessment and Recidivism Factors"
      ]
    },
    { 
      title: "Module 3: Inside the Courtroom", 
      desc: "Understand how psychologists assess individuals for legal proceedings.",
      subtopics: [
        "Competency to Stand Trial Evaluations",
        "Criminal Responsibility Assessments",
        "Evaluating Mental State at the Time of Offense",
        "Risk Assessment and Violence Prediction",
        "Victim Impact Assessments",
        "Ethics and Professional Standards in Forensic Practice"
      ]
    },
    { 
      title: "Module 4: Victims & Media", 
      desc: "Examine how crime is portrayed, perceived, and its secondary impacts.",
      subtopics: [
        "Profiling: Media Myths vs Scientific Reality",
        "The CSI Effect and Public Misconceptions",
        "Media Influence on Crime Perception",
        "Secondary Victimization by Media Coverage",
        "Ethical Reporting of Crime and Violence",
        "Forensic Failures and Lessons Learned",
        "Psychological Impact of Trials on Victims",
        "Copycat Crimes and Crisis Communication"
      ]
    }
  ];

  const faqs = [
    { q: "Do I need a background in psychology or law?", a: "While an interest in human behavior or criminal justice helps, this program is structured to guide learners from foundational concepts to advanced applications. It is open to dedicated beginners and professionals alike." },
    { q: "Is this program heavily theoretical?", a: "No. While theory is covered, Krutanic emphasizes a practical, case-based learning approach. You will analyze real-world case studies and engage in behavioral analysis exercises." },
    { q: "Who will be mentoring me?", a: "You will be mentored by Deepak V, an experienced professional with a background as a Behavioral Analyst for State CID, Senior Consultant Psychologist, and Visiting Faculty at leading legal institutions." },
    { q: "Will this guarantee me a job as a Forensic Psychologist?", a: "Becoming a licensed clinical forensic psychologist requires advanced postgraduate degrees. However, this program provides a powerful portfolio and practical knowledge base to accelerate your academic journey, research career, or related roles in criminal justice and HR." },
    { q: "Are the case studies relevant to India?", a: "Yes, the curriculum blends global forensic principles with India-relevant case studies and socially grounded examples to ensure you understand the local context." },
    { q: "Is the program fully online?", a: "Yes, the entire program is delivered 100% online, allowing you to learn from top experts regardless of your location." }
  ];

  return (
    <div className="psy-page">
      <Helmet>
        <title>Forensic Psychology Program | Krutanic</title>
        <meta name="description" content="Decode Crime. Understand the Mind. Build a Career in Forensic Psychology with Krutanic's mentor-led program." />
      </Helmet>

      {/* Ambient Backgrounds */}
      <div className="psy-ambient-orb-1"></div>
      <div className="psy-ambient-orb-2"></div>

      {/* HERO SECTION */}
      <section className="psy-hero">
        <div className="psy-hero-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div className="psy-hero-pills" variants={fadeUp}>
              <span className="psy-pill"><FaStar color="#fbbf24" /> 4.8/5 Trending</span>
              <span className="psy-pill">2-3 Months</span>
              <span className="psy-pill">100% Online</span>
            </motion.div>
            
            <motion.h1 className="psy-hero-title" variants={fadeUp}>
              Decode Crime. <br/>Understand the Mind.
            </motion.h1>
            
            <motion.p className="psy-hero-subtitle" variants={fadeUp}>
              A practical, mentor-led forensic psychology program designed to help you understand criminal behavior, victim response, courtroom psychology, behavioral analysis, and the real-world psychological dimensions of crime and justice.
            </motion.p>
            
            <motion.div className="psy-hero-ctas" variants={fadeUp}>
              <button onClick={() => setIsModalOpen(true)} className="psy-btn-primary">Apply Now</button>
              <a href="#curriculum" className="psy-btn-secondary">View Curriculum</a>
            </motion.div>
          </motion.div>

          {/* Trust Box */}
          <motion.div 
            className="psy-hero-trust"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>Why Study Forensic Psychology?</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.2rem", fontSize: "1.1rem", color: "#e2e8f0" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBrain color="#8b5cf6" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Beyond Stereotypes</strong> <br/> Understand criminal behavior beyond media myths and assumptions.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBalanceScale color="#8b5cf6" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Justice & Ethics</strong> <br/> Learn how psychology supports investigations and legal processes.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaSearch color="#8b5cf6" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Analytical Mindset</strong> <br/> Develop skills for victim-centered analysis and behavioral tracking.</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="psy-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="law-overview-content" style={{textAlign: "center", maxWidth: "900px", margin: "0 auto"}}>
          <motion.h2 className="psy-section-title" variants={fadeUp} style={{marginBottom: "2rem"}}>Program Overview</motion.h2>
          <motion.p variants={fadeUp} style={{ color: "var(--genz-text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            Forensic psychology sits at the fascinating intersection of psychology, crime, behavior, and justice. While criminology looks at broad societal trends of crime, forensic psychology zooms in on the individual mind. It helps learners understand not just why people behave the way they do, but how psychology actively operates in investigations, courtrooms, trauma response, and media narratives.
          </motion.p>
          <motion.p variants={fadeUp} style={{ color: "var(--genz-text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            This program cuts through the Hollywood "CSI effect" to deliver the scientific reality of the field. You will explore how forensic psychologists evaluate competency to stand trial, how eyewitness memory falters, and how victims process trauma during the pursuit of justice.
          </motion.p>
          <motion.p variants={fadeUp} style={{ color: "var(--genz-text-muted)", fontSize: "1.1rem" }}>
            At Krutanic, we bridge the gap between theory and application. Through carefully curated modules and mentor-led guidance, you will build a practical understanding of behavioral patterns and ethical practice, setting a solid foundation for future academic, research, or investigative pathways.
          </motion.p>
        </motion.div>
      </section>

      {/* MENTOR SECTION */}
      <section className="psy-section" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            Learn from an Industry Expert
          </motion.h2>
          
          <motion.div 
            className="psy-card" 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeUp}
            style={{ display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "center", background: "linear-gradient(135deg, rgba(20,20,30,0.8), rgba(139,92,246,0.1))" }}
          >
            <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "250px", height: "250px", borderRadius: "50%", background: "var(--genz-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", color: "#fff", boxShadow: "0 0 40px rgba(139,92,246,0.4)", border: "4px solid rgba(255,255,255,0.1)" }}>
                <FaUserTie />
              </div>
            </div>
            <div style={{ flex: "2 1 400px" }}>
              <h3 style={{ fontSize: "2.2rem", color: "#ffffff", marginBottom: "0.5rem" }}>Deepak V</h3>
              <p style={{ color: "#a5b4fc", fontSize: "1.2rem", fontWeight: "500", marginBottom: "1.5rem" }}>Forensic Psychology Mentor</p>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
                A distinguished forensic psychologist specializing in criminal behavior analysis, victimology, and courtroom psychological evaluations with extensive experience working alongside law enforcement agencies.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {/* <div style={{ borderLeft: "3px solid var(--genz-primary)", paddingLeft: "1rem" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "#fff" }}>5+ Years Investigative Exp.</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--genz-text-muted)" }}>Behavioral Analyst at State CID</p>
                </div> */}
                <div style={{ borderLeft: "3px solid #06b6d4", paddingLeft: "1rem" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "#fff" }}>4+ Years Clinical Practice</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--genz-text-muted)" }}>Senior Consultant Psychologist</p>
                </div>
                <div style={{ borderLeft: "3px solid #f59e0b", paddingLeft: "1rem" }}>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "#fff" }}>2+ Years Academic Training</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--genz-text-muted)" }}>Visiting Faculty at National Legal Institutions</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO SHOULD ENROLL */}
      <section className="psy-section">
        <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Who Should Enroll
        </motion.h2>
        
        <motion.div className="psy-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {whoShouldEnroll.map((item, index) => (
            <motion.div className="law-card-small" key={index} variants={fadeUp} style={{ background: "var(--genz-card)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--genz-border)" }}>
              <h4 style={{ color: "#a5b4fc", fontSize: "1.25rem", marginBottom: "0.75rem" }}>{item.title}</h4>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "0.95rem" }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* OUTCOMES */}
      <section className="psy-section" style={{ background: "rgba(3,0,20,0.5)" }}>
        <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          What You Will Master
        </motion.h2>
        
        <motion.div className="law-grid-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {outcomes.map((item, index) => (
            <motion.div className="psy-card" key={index} variants={fadeUp} style={{ padding: "2rem" }}>
              <div className="psy-card-icon" style={{ width: "45px", height: "45px", fontSize: "1.3rem", marginBottom: "1rem" }}>{item.icon}</div>
              <h4 style={{ fontSize: "1.2rem" }}>{item.title}</h4>
              <p style={{ fontSize: "0.95rem" }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PRACTICAL LEARNING APPROACH */}
      <section className="psy-section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            How You Learn at Krutanic
          </motion.h2>
          <motion.p style={{ textAlign: "center", fontSize: "1.1rem", color: "var(--genz-text-muted)", marginBottom: "3rem" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            We believe that forensic psychology cannot be learned solely through textbooks. Our methodology focuses on hands-on application and real-world readiness.
          </motion.p>

          <motion.div className="psy-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div className="psy-card" variants={fadeUp} style={{ padding: "2rem" }}>
              <FaSearch color="#8b5cf6" size={30} style={{ marginBottom: "1rem" }}/>
              <h4 style={{ fontSize: "1.3rem", color: "#fff" }}>Real Case-Based Learning</h4>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "1rem" }}>Analyze actual forensic cases with a strong focus on the Indian context and globally recognized criminal profiles.</p>
            </motion.div>
            <motion.div className="psy-card" variants={fadeUp} style={{ padding: "2rem" }}>
              <FaClipboardList color="#06b6d4" size={30} style={{ marginBottom: "1rem" }}/>
              <h4 style={{ fontSize: "1.3rem", color: "#fff" }}>Behavioral Analysis Exercises</h4>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "1rem" }}>Engage in practical interpretation of crime scenes, offender behaviors, and trauma-related scenarios.</p>
            </motion.div>
            <motion.div className="psy-card" variants={fadeUp} style={{ padding: "2rem" }}>
              <FaUserGraduate color="#f59e0b" size={30} style={{ marginBottom: "1rem" }}/>
              <h4 style={{ fontSize: "1.3rem", color: "#fff" }}>Portfolio-Building</h4>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "1rem" }}>Complete capstone-style analysis projects that demonstrate your analytical mindset to future academic panels or employers.</p>
            </motion.div>
            <motion.div className="psy-card" variants={fadeUp} style={{ padding: "2rem" }}>
              <FaUsers color="#8b5cf6" size={30} style={{ marginBottom: "1rem" }}/>
              <h4 style={{ fontSize: "1.3rem", color: "#fff" }}>Guided Mentor Feedback</h4>
              <p style={{ color: "var(--genz-text-muted)", fontSize: "1rem" }}>Receive personalized feedback from an expert who has evaluated real cases alongside law enforcement.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="psy-section" id="curriculum">
        <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          The Mind's Compass: A 4-Phase Journey
        </motion.h2>
        
        <div className="psy-timeline">
          {curriculum.map((item, index) => (
            <motion.div 
              className="psy-module" 
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="psy-module-num">{index + 1}</div>
              <h3 className="psy-module-title" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => setActiveModule(activeModule === index ? null : index)}>
                {item.title}
                <FaChevronDown style={{ fontSize: "1rem", color: "var(--genz-primary)", transform: activeModule === index ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
              </h3>
              <p className="psy-module-desc">{item.desc}</p>
              
              <AnimatePresence>
                {activeModule === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="law-accordion-list" style={{ listStyle: "none", padding: 0, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                      {item.subtopics.map((sub, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem", color: "#e2e8f0" }}>
                           <span style={{ color: "var(--genz-primary)" }}>▹</span> {sub}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button onClick={() => setIsModalOpen(true)} className="psy-btn-secondary"><FaDownload style={{ marginRight: "8px" }} /> Download Syllabus</button>
        </div>
      </section>

      {/* PRICING */}
      <section className="psy-section">
        <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} style={{ marginBottom: "4rem" }}>
          Program Investment
        </motion.h2>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="psy-card psy-pricing-highlight" variants={fadeUp} style={{ textAlign: "left", padding: "0", overflow: "hidden", maxWidth: "950px", margin: "0 auto", position: "relative" }}>
            <div className="psy-grid-2" style={{ gap: "0" }}>
              <div style={{ padding: "4rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div className="psy-pricing-badge" style={{ position: "relative", top: "0", left: "0", transform: "none", alignSelf: "flex-start", marginBottom: "1rem" }}>Recommended</div>
                <h3 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Forensic Psychology Pack</h3>
                <p style={{ fontSize: "1.1rem", marginBottom: "2.5rem", color: "var(--genz-text-muted)", lineHeight: "1.6" }}>The complete 4-phase journey to master forensic assessment, victimology, and courtroom psychology.</p>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#8b5cf6" size={20} style={{ flexShrink: 0 }}/> <span><strong>Full curriculum access</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#8b5cf6" size={20} style={{ flexShrink: 0 }}/> <span>Indian context <strong>case studies</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#8b5cf6" size={20} style={{ flexShrink: 0 }}/> <span>Behavioral <strong>analysis projects</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#8b5cf6" size={20} style={{ flexShrink: 0 }}/> <span>Guided <strong>mentorship</strong></span></li>
                  <li style={{ marginBottom: "0", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#8b5cf6" size={20} style={{ flexShrink: 0 }}/> <span><strong>Certification</strong> upon completion</span></li>
                </ul>
              </div>
              
              <div style={{ background: "rgba(20, 20, 30, 0.5)", padding: "4rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ color: "#a5b4fc", fontSize: "1.1rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>Program Fee</p>
                <h4 style={{ fontSize: "4.5rem", color: "#ffffff", margin: "0 0 0.5rem 0", lineHeight: "1" }}>₹11,999</h4>
                <p style={{ color: "var(--genz-text-muted)", fontSize: "1rem", marginBottom: "2.5rem" }}>One-time payment. Full access.</p>
                <button onClick={() => setIsModalOpen(true)} className="psy-btn-primary" style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>Enroll Now</button>
                <p style={{ color: "var(--genz-text-muted)", fontSize: "0.9rem", marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <FaCheckCircle color="#22c55e" /> Secure Enrollment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="psy-section">
        <motion.h2 className="psy-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Frequently Asked Questions
        </motion.h2>
        
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {faqs.map((faq, index) => (
            <div className="psy-faq-item" key={index}>
              <div 
                className="psy-faq-question" 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                {faq.q}
                <motion.div animate={{ rotate: activeFaq === index ? 180 : 0 }}>
                  <FaChevronDown color="#8b5cf6" />
                </motion.div>
              </div>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="psy-faq-answer">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <MedProFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedCourse={selectedCourse} />
    </div>
  );
};

export default Psychology;
