import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBalanceScale, FaHandshake, FaBriefcase, FaChevronDown, 
  FaCheckCircle, FaStar, FaBuilding, FaUserGraduate, 
  FaChartLine, FaGavel, FaShieldAlt, FaFileContract, 
  FaDownload, FaComments
} from "react-icons/fa";
import MedProFormModal from "../MedProFormModal";
import "./CorporateLaw.css";

const CorporateLaw = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('Corporate Law');

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
    { title: "Law Students", desc: "Build a strong foundation in corporate transactions, making you highly competitive for top law firm placements." },
    { title: "Fresh Graduates", desc: "Bridge the gap between academic theory and practical corporate law, making you ready for day-one responsibilities." },
    { title: "Junior Associates", desc: "Accelerate your career trajectory by mastering complex drafting, M&A structures, and compliance frameworks." },
    { title: "In-House Legal Aspirants", desc: "Learn to handle contracts, governance, and risk management from the inside of a corporation." },
    { title: "Compliance Professionals", desc: "Deepen your understanding of statutory regulations and corporate governance to lead compliance functions effectively." },
    { title: "Founders & Entrepreneurs", desc: "Gain critical legal understanding to structure your company, negotiate term sheets, and protect intellectual property." }
  ];

  const outcomes = [
    { icon: <FaBuilding />, title: "Company Formation", desc: "Master the legal structure of modern business entities." },
    { icon: <FaBalanceScale />, title: "Corporate Governance", desc: "Advising boards and navigating corporate governance processes." },
    { icon: <FaShieldAlt />, title: "Regulatory Compliance", desc: "Managing statutory and regulatory compliance risks." },
    { icon: <FaFileContract />, title: "Contract Drafting", desc: "Drafting and negotiating iron-clad corporate agreements." },
    { icon: <FaHandshake />, title: "Mergers & Acquisitions", desc: "Structuring M&A deals and conducting legal due diligence." },
    { icon: <FaChartLine />, title: "Securities & Markets", desc: "Understanding capital markets and securities regulations." },
    { icon: <FaGavel />, title: "Dispute Resolution", desc: "Handling arbitration, litigation strategy, and dispute basics." }
  ];

  const curriculum = [
    { 
      title: "Corporate Governance & Compliance", 
      desc: "Understand the regulatory frameworks, fiduciary duties, and board structures that govern modern corporations.",
      subtopics: [
        "Nature and scope of corporate law",
        "Types of companies and business entities",
        "Incorporation and corporate personality",
        "Memorandum and articles",
        "Directors, KMPs, and board powers",
        "Meetings, resolutions, disclosures, reporting",
        "Corporate governance frameworks",
        "Statutory registers, filings, and compliance management"
      ]
    },
    { 
      title: "Mergers & Acquisitions (M&A)", 
      desc: "Master the legal intricacies of structuring deals, due diligence, anti-trust laws, and hostile takeovers.",
      subtopics: [
        "Business transfers and restructuring",
        "Deal structures",
        "Legal due diligence",
        "Transaction documentation",
        "Share purchase and asset purchase concepts",
        "Takeovers and regulatory approvals",
        "Competition and anti-trust basics",
        "Post-merger integration risk areas"
      ]
    },
    { 
      title: "Contract Drafting & Negotiation", 
      desc: "Learn to draft iron-clad corporate contracts, term sheets, and NDAs. Practice high-stakes negotiation tactics.",
      subtopics: [
        "Contract law fundamentals in corporate practice",
        "Drafting clauses with commercial intent",
        "NDAs, employment agreements, vendor agreements, shareholder agreements",
        "Boilerplate clauses",
        "Risk allocation",
        "Negotiation strategy",
        "Reviewing, redlining, and closing legal comments"
      ]
    },
    { 
      title: "Intellectual Property & Tech Law", 
      desc: "Protect corporate assets by understanding patents, trademarks, software licensing, and data privacy regulations.",
      subtopics: [
        "IP ownership in companies",
        "Trademarks, copyright, patents, trade secrets",
        "Software licensing",
        "Technology contracts",
        "Confidential information",
        "Data protection and privacy considerations",
        "Corporate handling of digital assets"
      ]
    },
    { 
      title: "Securities & Capital Markets", 
      desc: "Navigate IPOs, venture capital funding, SEC compliance, and insider trading laws.",
      subtopics: [
        "Share capital and securities",
        "Private placements and fundraising",
        "Venture capital and investment rounds",
        "Public offerings overview",
        "Disclosure and compliance concepts",
        "Investor rights",
        "Insider trading and market conduct basics"
      ]
    },
    { 
      title: "Dispute Resolution & Arbitration", 
      desc: "Explore alternative dispute resolution (ADR), commercial litigation, and international arbitration procedures.",
      subtopics: [
        "Corporate disputes and risk scenarios",
        "Arbitration process",
        "Commercial litigation overview",
        "Breach and enforcement remedies",
        "Shareholder and contractual disputes",
        "Strategy, evidence, and settlement considerations"
      ]
    }
  ];

  const faqs = [
    { q: "Do I need a law degree to enroll?", a: "While a law degree is highly beneficial, it is not strictly required. This course is designed to be highly accessible for law students, fresh graduates, and business professionals alike who want to build a deep understanding of corporate law." },
    { q: "Who are the instructors?", a: "You will be guided by experienced legal professionals, practicing corporate lawyers, and industry experts who bring real-world transaction and litigation experience directly into the classroom." },
    { q: "Is there practical drafting experience?", a: "Absolutely. We go beyond theory. You will be engaging in hands-on drafting exercises, including NDAs, shareholder agreements, and term sheets, preparing you for real corporate legal workflows." },
    { q: "What are the career prospects?", a: "Completing this advanced program prepares you for highly sought-after roles within corporate legal teams, top-tier law firms, compliance departments, and transaction advisory services." },
    { q: "Is the program suitable for students and working professionals?", a: "Yes, the program is structured flexibly to accommodate the schedules of both ambitious law students and busy working professionals looking to upskill." },
    { q: "Will I learn real corporate documents and transaction workflows?", a: "Yes. The curriculum includes practical exposure through case studies, transaction document review, and due diligence simulations to mirror exact real-world tasks." },
    { q: "Is the program fully online?", a: "Yes, the entire program is delivered 100% online, offering you the convenience of learning from anywhere while maintaining high-touch mentorship." }
  ];

  return (
    <div className="law-page">
      <Helmet>
        <title>Corporate Law Advanced Program | Krutanic</title>
        <meta name="description" content="Master Corporate Law, M&A, and Contract Drafting with Krutanic. Learn from top legal experts and secure high-paying legal roles." />
      </Helmet>

      {/* Ambient Backgrounds */}
      <div className="law-ambient-orb-1"></div>
      <div className="law-ambient-orb-2"></div>

      {/* HERO SECTION */}
      <section className="law-hero">
        <div className="law-hero-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div className="law-hero-pills" variants={fadeUp}>
              <span className="law-pill"><FaStar color="#f59e0b" /> 4.9/5 Top Rated</span>
              <span className="law-pill">6-9 Months</span>
              <span className="law-pill">100% Online</span>
            </motion.div>
            
            <motion.h1 className="law-hero-title" variants={fadeUp}>
              Master the Art of <br/>Corporate Law
            </motion.h1>
            
            <motion.p className="law-hero-subtitle" variants={fadeUp}>
              An elite, practice-oriented program designed to help you master company law, corporate governance, compliance, mergers and acquisitions, securities regulation, contract drafting, and dispute resolution for the modern legal and business landscape.
            </motion.p>
            
            <motion.div className="law-hero-ctas" variants={fadeUp}>
              <button onClick={() => setIsModalOpen(true)} className="law-btn-primary">Apply Now</button>
              <a href="#curriculum" className="law-btn-secondary">View Curriculum</a>
            </motion.div>
          </motion.div>

          {/* Trust Box */}
          <motion.div 
            className="law-hero-trust"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>Why Corporate Law?</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.2rem", fontSize: "1.1rem", color: "#e2e8f0" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBalanceScale color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Central Role in Business</strong> <br/> Become indispensable in core business decision-making.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBriefcase color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Universal Relevance</strong> <br/> High demand across startups, MNCs, law firms, and consulting.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaCheckCircle color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>High-Value Practical Work</strong> <br/> Specialize in contract drafting, M&A, due diligence, and advisory.</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="law-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="law-overview-content" style={{textAlign: "center"}}>
          <motion.h2 className="law-section-title" variants={fadeUp} style={{marginBottom: "2rem"}}>Program Overview</motion.h2>
          <motion.p variants={fadeUp}>
            Corporate law is the complex legal framework that governs the formation, functioning, financing, restructuring, compliance, and winding up of companies. In today's dynamic global economy, it intersects seamlessly with governance, contracts, taxation, employment, securities, insolvency, intellectual property, and dispute management.
          </motion.p>
          <motion.p variants={fadeUp}>
            Why does it matter? Modern businesses operate in highly regulated environments. The demand for legal professionals who can confidently navigate transactions, enforce governance, manage regulatory risk, and drive growth is higher than ever.
          </motion.p>
          <motion.p variants={fadeUp}>
            This program helps learners build immense practical capability. It is not merely theoretical; it is designed to immerse you in real-world legal workflows, empowering you to draft authentic documents and advise on actual corporate scenarios. Krutanic provides the premier platform for this learning journey, offering expert mentorship, career-oriented support, and a comprehensive curriculum tailored for tomorrow's leading corporate advisors.
          </motion.p>
        </motion.div>
      </section>

      {/* WHO SHOULD ENROLL */}
      <section className="law-section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Who Should Enroll
        </motion.h2>
        
        <motion.div className="law-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {whoShouldEnroll.map((item, index) => (
            <motion.div className="law-card-small" key={index} variants={fadeUp}>
              <h4>{item.title}</h4>
              <p style={{ color: "var(--law-text-muted)", fontSize: "0.95rem" }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CORE COMPETENCIES / OUTCOMES */}
      <section className="law-section">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          What You Will Master
        </motion.h2>
        
        <motion.div className="law-grid-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          {outcomes.map((item, index) => (
            <motion.div className="law-card" key={index} variants={fadeUp} style={{ padding: "2rem" }}>
              <div className="law-card-icon" style={{ width: "45px", height: "45px", fontSize: "1.3rem", marginBottom: "1rem" }}>{item.icon}</div>
              <h4 style={{ fontSize: "1.2rem" }}>{item.title}</h4>
              <p style={{ fontSize: "0.95rem" }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA BANNER 1 */}
      <motion.div className="law-banner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h3>Ready to Build Practical Expertise?</h3>
        <p>Join the advanced program and elevate your legal career with hands-on drafting, real case studies, and expert mentorship.</p>
        <button onClick={() => setIsModalOpen(true)} className="law-btn-primary">Apply Now</button>
      </motion.div>

      {/* CURRICULUM */}
      <section className="law-section" id="curriculum">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Detailed Curriculum
        </motion.h2>
        
        <div className="law-timeline">
          {curriculum.map((item, index) => (
            <motion.div 
              className="law-module" 
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="law-module-num">{index + 1}</div>
              <h3 className="law-module-title" style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => setActiveModule(activeModule === index ? null : index)}>
                {item.title}
                <FaChevronDown style={{ fontSize: "1rem", color: "var(--law-primary)", transform: activeModule === index ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
              </h3>
              <p className="law-module-desc">{item.desc}</p>
              
              <AnimatePresence>
                {activeModule === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="law-accordion-list">
                      {item.subtopics.map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button onClick={() => setIsModalOpen(true)} className="law-btn-secondary"><FaDownload style={{ marginRight: "8px" }} /> Download Syllabus</button>
        </div>
      </section>

      {/* TRAINING APPROACH & MENTORSHIP */}
      <section className="law-section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <motion.div className="law-grid-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="law-card" variants={fadeUp}>
            <div className="law-card-icon"><FaGavel /></div>
            <h3>Practical Training Approach</h3>
            <p style={{ marginTop: "1rem" }}>We focus on experiential learning. You won't just read laws; you will apply them. Our approach includes:</p>
            <ul className="law-accordion-list">
              <li>Drafting exercises and contract review</li>
              <li>Real-world corporate case studies</li>
              <li>Legal due diligence simulations</li>
              <li>Transaction document review and redlining</li>
              <li>Compliance-based assignments</li>
              <li>Live negotiation practice scenarios</li>
            </ul>
          </motion.div>
          <motion.div className="law-card" variants={fadeUp}>
            <div className="law-card-icon"><FaUserGraduate /></div>
            <h3>Mentorship & Support</h3>
            <p style={{ marginTop: "1rem" }}>Learn from those who have been there. Our mentor-led approach ensures you are guided every step of the way:</p>
            <ul className="law-accordion-list">
              <li>Expert guidance from experienced legal professionals</li>
              <li>Structured progression through complex topics</li>
              <li>Personalized feedback on your drafting assignments</li>
              <li>Career-oriented support for interview readiness</li>
              <li>Profile-building advice for securing top placements</li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* CAREER PATHWAYS */}
      <section className="law-section">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Certification & Career Pathways
        </motion.h2>
        <motion.div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p style={{ fontSize: "1.1rem", color: "var(--law-text-muted)", marginBottom: "3rem" }}>
            Graduating from the Krutanic Corporate Law program prepares you for a multitude of prestigious roles. We focus on role readiness and portfolio-building to help you secure positions in:
          </p>
          <div className="law-grid-3">
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Corporate Legal Teams</h4></div>
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Top Law Firms</h4></div>
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Compliance & Governance</h4></div>
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Contract Management</h4></div>
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Transaction Advisory</h4></div>
            <div className="law-card-small" style={{ padding: "1.5rem" }}><h4>Startup Legal Ops</h4></div>
          </div>
        </motion.div>
      </section>

      {/* CTA BANNER 2 */}
      <motion.div className="law-banner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(3, 0, 20, 0.8) 100%)", borderColor: "#22c55e" }}>
        <h3 style={{ color: "#4ade80" }}>Talk to an Advisor</h3>
        <p>Unsure if this program is the right fit for your career goals? Our academic advisors are here to help.</p>
        <button onClick={() => setIsModalOpen(true)} className="law-btn-secondary" style={{ borderColor: "#22c55e", color: "#4ade80" }}><FaComments style={{ marginRight: "8px" }} /> Request a Callback</button>
      </motion.div>

      {/* PRICING */}
      <section className="law-section">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} style={{ marginBottom: "4rem" }}>
          Program Investment
        </motion.h2>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="law-card law-pricing-highlight" variants={fadeUp} style={{ textAlign: "left", padding: "0", overflow: "hidden", maxWidth: "950px", margin: "0 auto", position: "relative" }}>
            <div className="law-grid-2" style={{ gap: "0" }}>
              <div className="law-pricing-left">
                <div className="law-pricing-badge" style={{ position: "relative", top: "0", left: "0", transform: "none", alignSelf: "flex-start", marginBottom: "1rem" }}>Recommended</div>
                <h3 className="law-pricing-title" style={{ marginTop: "0" }}>Comprehensive Program</h3>
                <p style={{ fontSize: "1.1rem", marginBottom: "2.5rem", color: "var(--law-text-muted, #9ca3af)", lineHeight: "1.6" }}>Everything you need to master corporate law, build your portfolio, and accelerate your legal career in one complete package.</p>
                
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span><strong>Full curriculum access</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Practical <strong>drafting exercises</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Real-world <strong>case studies</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Professional <strong>mentorship</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span><strong>Career support</strong> and placement readiness</span></li>
                  <li style={{ marginBottom: "0", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Downloadable <strong>practice materials</strong></span></li>
                </ul>
              </div>
              
              <div className="law-pricing-right">
                <p style={{ color: "#f59e0b", fontSize: "1.1rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700" }}>Program Fee</p>
                <h4 style={{ fontSize: "4.5rem", color: "#ffffff", margin: "0 0 0.5rem 0", lineHeight: "1" }}>₹11,999</h4>
                <p style={{ color: "var(--law-text-muted, #9ca3af)", fontSize: "1rem", marginBottom: "2.5rem" }}>One-time payment. Full access.</p>
                <button onClick={() => setIsModalOpen(true)} className="law-btn-primary" style={{ width: "100%", padding: "1.2rem", fontSize: "1.2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>Enroll Now</button>
                <p style={{ color: "var(--law-text-muted, #9ca3af)", fontSize: "0.9rem", marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <FaCheckCircle color="#22c55e" /> Secure Enrollment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="law-section">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Frequently Asked Questions
        </motion.h2>
        
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {faqs.map((faq, index) => (
            <div className="law-faq-item" key={index}>
              <div 
                className="law-faq-question" 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                {faq.q}
                <motion.div animate={{ rotate: activeFaq === index ? 180 : 0 }}>
                  <FaChevronDown color="#f59e0b" />
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
                    <div className="law-faq-answer">{faq.a}</div>
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

export default CorporateLaw;
