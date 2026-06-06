import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap, FaRegClock, FaBriefcase, FaUserCheck, FaChevronDown, FaCheckCircle, FaStar, FaBrain, FaGavel, FaHandHoldingHeart, FaSearch, FaClipboardList, FaFileAlt, FaProjectDiagram, FaCertificate, FaUserTie, FaQuoteLeft, FaBookOpen } from "react-icons/fa";
import "./ForensicPsychology.css";

const ForensicPsychology = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const faqs = [
    {
      question: "What is forensic psychology?",
      answer: "Forensic psychology involves applying psychological knowledge and methods to both civil and criminal legal questions. It sits at the intersection of human behavior and the justice system."
    },
    {
      question: "Do I need a psychology background?",
      answer: "While a background in psychology or criminal justice is helpful, this program is designed to build foundational knowledge before moving into advanced applications. Anyone with a strong interest in human behavior and law can succeed."
    },
    {
      question: "Can this help me prepare for advanced study?",
      answer: "Yes. Understanding clinical assessment, profiling, and legal frameworks gives you a strong competitive edge if you plan to pursue a master's or doctoral degree in the future."
    },
    {
      question: "What careers relate to this path?",
      answer: "Graduates often work in rehabilitation centres, NGOs, legal support environments, victim advocacy, research, and consulting for law enforcement or legal firms."
    },
    {
      question: "Is this course practical or theoretical?",
      answer: "Both. You will learn the theoretical foundations of criminal behavior, but you will spend a significant amount of time applying that knowledge to mock case files, assessments, and courtroom simulations."
    },
    {
      question: "How much time should I commit weekly?",
      answer: "We recommend dedicating 10-15 hours per week to fully engage with the course material, attend live mentor sessions, and complete your applied projects."
    }
  ];

  // Animation Variants
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

  return (
    <div className="fp-page">
      <Helmet>
        <title>The Forensic Psychology Playground | Krutanic</title>
        <meta name="description" content="Decode Crime. Understand Human Behavior. Build a Meaningful Career in Forensic Psychology." />
      </Helmet>

      {/* Ambient Background Glows & Watermark */}
      <div className="fp-ambient-orb-1"></div>
      <div className="fp-ambient-orb-2"></div>
      
      {/* Extraordinary Watermark */}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-5deg)", fontSize: "20vw", fontWeight: "900", color: "rgba(255,255,255,0.015)", zIndex: 0, pointerEvents: "none", whiteSpace: "nowrap", letterSpacing: "-0.05em" }}>
        FORENSIC
      </div>

      {/* 1. HERO SECTION */}
      <section className="fp-hero">
        <div className="fp-hero-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 className="fp-hero-title" variants={fadeUp}>
              The Forensic <br/>Psychology Playground
            </motion.h1>
            <motion.p className="fp-hero-subtitle" variants={fadeUp} style={{ color: "#c084fc", fontWeight: "600", fontSize: "1.4rem", marginBottom: "1.5rem" }}>
              Decode Crime. Understand Human Behavior. Build a Meaningful Career.
            </motion.p>
            <motion.p className="fp-hero-subtitle" variants={fadeUp}>
              Step into the fascinating world where psychology meets law and criminal investigation. This immersive learning experience helps learners understand criminal behavior, victim psychology, forensic assessment, courtroom psychology, and ethical decision-making while building practical skills through real-world case studies and projects.
            </motion.p>
            <motion.div className="fp-hero-ctas" variants={fadeUp}>
              <Link to="/DashboardAccessForm" className="fp-btn-primary">Apply Now</Link>
              <a href="#curriculum" className="fp-btn-secondary">Explore Curriculum</a>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", border: "1px solid var(--genz-border)", boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)" }}>
              <img src="/indian_forensic_expert.png" alt="Forensic Psychology Expert" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(3,0,20,0.9), transparent)", pointerEvents: "none" }}></div>
              
              {/* Rated 5/5 Overlay */}
              <div style={{ position: "absolute", bottom: "1.5rem", left: "2rem", right: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                <span style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", letterSpacing: "0.5px" }}>Rated 5/5</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <FaStar color="#ffffff" size={20} />
                  <FaStar color="#ffffff" size={20} />
                  <FaStar color="#ffffff" size={20} />
                  <FaStar color="#ffffff" size={20} />
                  <FaStar color="#ffffff" size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. WHY THIS FIELD MATTERS */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          The Mind is the New Frontier
        </motion.h2>
        <motion.p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", fontSize: "1.2rem", color: "var(--genz-text-muted)" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Understanding human behavior has become more important than ever. From criminal investigations and legal proceedings to mental health and rehabilitation, forensic psychology plays a critical role in modern society.
        </motion.p>
        
        <motion.div className="fp-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="fp-card" style={{ textAlign: "center" }} variants={fadeUp}>
            <h3 style={{ fontSize: "3rem", color: "#c084fc", margin: "0 0 1rem 0" }}>73M</h3>
            <p>People affected by mental health challenges.</p>
          </motion.div>
          <motion.div className="fp-card" style={{ textAlign: "center" }} variants={fadeUp}>
            <h3 style={{ fontSize: "3rem", color: "#c084fc", margin: "0 0 1rem 0" }}>20%</h3>
            <p>Annual growth in the global mental health sector.</p>
          </motion.div>
          <motion.div className="fp-card" style={{ textAlign: "center" }} variants={fadeUp}>
            <h3 style={{ fontSize: "3rem", color: "#c084fc", margin: "0 0 1rem 0" }}>50k+</h3>
            <p>New psychology-related opportunities expected in coming years.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. WHY CHOOSE THIS PROGRAM */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          A Playground for Your Ambition
        </motion.h2>
        <motion.div className="fp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {[
            { icon: <FaSearch />, title: "Learn by Doing", desc: "Gain practical exposure through real-world case studies, behavioral analysis exercises, and hands-on projects." },
            { icon: <FaBrain />, title: "Specialized Skill Development", desc: "Develop expertise in criminal profiling, forensic assessments, courtroom psychology, and victim support." },
            { icon: <FaUserTie />, title: "Community & Mentorship", desc: "Learn alongside peers while receiving guidance from experienced professionals." },
            { icon: <FaBriefcase />, title: "Career-Oriented Learning", desc: "Build practical skills that prepare you for future academic and professional opportunities." }
          ].map((item, i) => (
            <motion.div className="fp-card" variants={fadeUp} key={i}>
              <div className="fp-card-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. CAREER PATHWAYS */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Your Career Trajectory
        </motion.h2>
        <motion.p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", fontSize: "1.2rem", color: "var(--genz-text-muted)" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          The skills acquired through forensic psychology can lead to multiple professional pathways.
        </motion.p>
        <motion.div className="fp-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="fp-card" variants={fadeUp}>
            <h4>Foundation Roles</h4>
            <ul style={{ color: "var(--genz-text-muted)", paddingLeft: "1.2rem", marginTop: "1rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Junior Forensic Psychology Associate</li>
              <li style={{ marginBottom: "0.5rem" }}>Research Assistant</li>
              <li>Behavioral Analyst Trainee</li>
            </ul>
          </motion.div>
          <motion.div className="fp-card" variants={fadeUp} style={{ border: "1px solid rgba(192, 132, 252, 0.4)" }}>
            <h4>Specialization Tracks</h4>
            <ul style={{ color: "var(--genz-text-muted)", paddingLeft: "1.2rem", marginTop: "1rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Criminal Profiling & Behavioral Analysis</li>
              <li style={{ marginBottom: "0.5rem" }}>Forensic Clinical Psychology</li>
              <li>Juvenile & Child Forensic Psychology</li>
            </ul>
          </motion.div>
          <motion.div className="fp-card" variants={fadeUp}>
            <h4>Advanced Roles</h4>
            <ul style={{ color: "var(--genz-text-muted)", paddingLeft: "1.2rem", marginTop: "1rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Senior Research Analyst</li>
              <li style={{ marginBottom: "0.5rem" }}>Forensic Consultant</li>
              <li>Behavioral Assessment Specialist</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. PROGRAM ADVANTAGES */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Why This Learning Experience Stands Out
        </motion.h2>
        <motion.div className="fp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {[
            { title: "Real Case Studies", desc: "Analyze realistic behavioral and criminal investigation scenarios." },
            { title: "Portfolio Development", desc: "Create project work that demonstrates your practical understanding." },
            { title: "Professional Network", desc: "Connect with mentors and like-minded learners." },
            { title: "Career Preparation", desc: "Receive guidance on professional development and future opportunities." }
          ].map((item, i) => (
            <motion.div className="fp-card" variants={fadeUp} key={i}>
              <h4 style={{ color: "#c084fc", fontSize: "1.6rem", marginBottom: "0.8rem" }}>{i + 1}. {item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. CURRICULUM */}
      <section className="fp-section" id="curriculum">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          The Mind's Compass – A 4 Phase Journey
        </motion.h2>
        <div className="fp-timeline">
          {[
            { 
              title: "Phase 1: Foundations of Forensic Psychology", 
              desc: "Introduction to Forensic Psychology • Uses and Applications • Practical Implementation • Forensic Psychology vs Criminology • Role of Forensic Psychologists • Nature vs Nurture in Criminal Behavior" 
            },
            { 
              title: "Phase 2: Crime & The Human Mind", 
              desc: "Criminal Profiling • Behavioral Patterns • Violent Behavior Analysis • Sexual Offending • Victim Psychology • Trauma Responses • Eyewitness Reliability • Risk Assessment • Recidivism Analysis" 
            },
            { 
              title: "Phase 3: Inside The Courtroom", 
              desc: "Competency Evaluations • Violence Risk Assessment • Criminal Responsibility Assessment • Mental State at Time of Offense • Victim Impact Assessment • Ethics in Forensic Practice • Professional Standards • Cultural Sensitivity" 
            },
            { 
              title: "Phase 4: Victims & Media", 
              desc: "Trauma Responses • Victim Psychology • Media Influence on Crime Perception • Profiling Myths vs Reality • Forensic Failures • Ethical Crime Reporting • Public Misconceptions • Copycat Crime Phenomenon • Psychological Impact of Trials • Crisis Communication" 
            }
          ].map((module, i) => (
            <motion.div 
              className="fp-module" 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
            >
              <div className="fp-module-num">{i + 1}</div>
              <h3 className="fp-module-title">{module.title}</h3>
              <p className="fp-module-desc">{module.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. MENTOR SECTION */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Learn Directly from an Experienced Forensic Psychology Professional
        </motion.h2>
        <motion.div className="fp-hero-trust" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <p style={{ fontSize: "1.2rem", color: "#e2e8f0", marginBottom: "2rem", lineHeight: "1.8" }}>
            Gain insights from a mentor who combines academic excellence, research experience, and practical forensic investigation knowledge. Learn evidence-based approaches, analytical thinking, ethical practice, and real-world applications of forensic psychology.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", fontSize: "1.1rem", color: "#c084fc", fontWeight: "600" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><FaCheckCircle /> Academic Expertise</li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><FaCheckCircle /> Research-Oriented Thinking</li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><FaCheckCircle /> Practical Forensic Exposure</li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><FaCheckCircle /> Evidence-Based Learning</li>
          </ul>
        </motion.div>
      </section>

      {/* 8. RESOURCES & BENEFITS */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Exclusive Learning Resources
        </motion.h2>
        <motion.div className="fp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="fp-card" variants={fadeUp}>
            <div className="fp-card-icon"><FaBriefcase /></div>
            <h4>Career Development</h4>
            <ul style={{ color: "var(--genz-text-muted)", paddingLeft: "1.2rem", marginTop: "1rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Internship Opportunities</li>
              <li style={{ marginBottom: "0.5rem" }}>Interview Preparation Resources</li>
              <li>Professional Networking Community</li>
            </ul>
          </motion.div>
          <motion.div className="fp-card" variants={fadeUp}>
            <div className="fp-card-icon"><FaBookOpen /></div>
            <h4>Learning Resources</h4>
            <ul style={{ color: "var(--genz-text-muted)", paddingLeft: "1.2rem", marginTop: "1rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>Academic Research Access</li>
              <li style={{ marginBottom: "0.5rem" }}>Psychometric Test Practice</li>
              <li style={{ marginBottom: "0.5rem" }}>Curated Reading Lists</li>
              <li>Recommended Journals & Publications</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* 9. CAPSTONE PROJECT */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Graduate With More Than Knowledge
        </motion.h2>
        <motion.p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem", fontSize: "1.2rem", color: "var(--genz-text-muted)" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Complete a capstone project demonstrating your ability to apply forensic and psychological concepts to real-world situations. Build a professional portfolio that showcases analytical thinking, research ability, and practical application skills.
        </motion.p>
        <motion.div className="fp-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {[
            { title: "The Social Media Mind", desc: "Analyze online identity construction and digital behavior patterns." },
            { title: "Cultural Influence & Career Choices", desc: "Study social and family influences on decision-making." },
            { title: "Mental Health & Help-Seeking Behavior", desc: "Explore barriers and pathways to psychological support." },
            { title: "Adapting Therapy Models", desc: "Examine how psychological approaches can be adapted across cultures." }
          ].map((item, i) => (
            <motion.div className="fp-card" variants={fadeUp} key={i}>
              <div className="fp-card-icon"><FaProjectDiagram /></div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          What Learners Say
        </motion.h2>
        <motion.div className="fp-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {[
            { text: "The real-world case studies and hands-on assignments completely changed how I look at criminal behavior.", author: "Practical Learning" },
            { text: "Mentor support was exceptional. Interactive sessions built my career confidence dramatically.", author: "Career Confidence" },
            { text: "A highly flexible learning experience that didn't compromise on depth or practical exposure.", author: "Flexible & Deep" }
          ].map((item, i) => (
            <motion.div className="fp-card" variants={fadeUp} key={i} style={{ background: "rgba(20, 20, 30, 0.6)" }}>
              <FaQuoteLeft style={{ color: "#c084fc", fontSize: "2rem", marginBottom: "1.5rem", opacity: 0.5 }} />
              <p style={{ fontStyle: "italic", marginBottom: "1.5rem" }}>"{item.text}"</p>
              <h5 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>- {item.author}</h5>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 11. CERTIFICATION */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Your Achievement, Your Edge
        </motion.h2>
        <div className="fp-hero-content" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <FaCertificate style={{ fontSize: "5rem", color: "#c084fc", margin: "0 auto 2rem" }} />
            <p style={{ fontSize: "1.2rem", color: "var(--genz-text-muted)", maxWidth: "800px", margin: "0 auto 3rem" }}>
              Receive professional certification upon successful completion of the program. Showcase your accomplishment on resumes, professional profiles, and future academic applications.
            </p>
            <div className="fp-hero-pills" style={{ justifyContent: "center" }}>
              <span className="fp-pill"><FaCheckCircle color="#c084fc"/> Certificate of Completion</span>
              <span className="fp-pill"><FaCheckCircle color="#c084fc"/> Portfolio Projects</span>
              <span className="fp-pill"><FaCheckCircle color="#c084fc"/> Professional Recognition</span>
              <span className="fp-pill"><FaCheckCircle color="#c084fc"/> Demonstrated Skill Development</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fp-section">
        <motion.h2 className="fp-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Frequently Asked Questions
        </motion.h2>
        <motion.div style={{ maxWidth: "800px", margin: "0 auto" }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {faqs.map((faq, index) => (
            <motion.div key={index} className="fp-faq-item" variants={fadeUp}>
              <div className="fp-faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <motion.div animate={{ rotate: activeFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FaChevronDown color="#8b5cf6" />
                </motion.div>
              </div>
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="fp-faq-answer">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "8rem 2rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <h2 style={{ fontSize: "3.5rem", marginBottom: "1.5rem", background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
            Ready to Understand the Human Mind?
          </h2>
          <p style={{ color: "var(--genz-text-muted)", fontSize: "1.25rem", marginBottom: "3rem", maxWidth: "700px", margin: "0 auto 4rem", fontWeight: "300" }}>
            Take the next step toward mastering forensic psychology and developing practical skills that bridge psychology, law, and human behavior.
          </p>
          <div className="fp-hero-ctas" style={{ justifyContent: "center" }}>
            <Link to="/DashboardAccessForm" className="fp-btn-primary" style={{ fontSize: "1.15rem", padding: "1.25rem 3.5rem" }}>
              Apply Now
            </Link>
            <button className="fp-btn-secondary" style={{ fontSize: "1.15rem", padding: "1.25rem 3.5rem" }}>
              Download Brochure
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default ForensicPsychology;
