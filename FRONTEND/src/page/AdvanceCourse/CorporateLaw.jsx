import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaBalanceScale, FaHandshake, FaBriefcase, FaChevronDown, FaCheckCircle, FaStar, FaBuilding } from "react-icons/fa";
import MedProFormModal from "../MedProFormModal";
import "./CorporateLaw.css";

const CorporateLaw = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
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

  const curriculum = [
    { title: "Corporate Governance & Compliance", desc: "Understand the regulatory frameworks, fiduciary duties, and board structures that govern modern corporations." },
    { title: "Mergers & Acquisitions (M&A)", desc: "Master the legal intricacies of structuring deals, due diligence, anti-trust laws, and hostile takeovers." },
    { title: "Contract Drafting & Negotiation", desc: "Learn to draft iron-clad corporate contracts, term sheets, and NDAs. Practice high-stakes negotiation tactics." },
    { title: "Intellectual Property & Tech Law", desc: "Protect corporate assets by understanding patents, trademarks, software licensing, and data privacy regulations." },
    { title: "Securities & Capital Markets", desc: "Navigate IPOs, venture capital funding, SEC compliance, and insider trading laws." },
    { title: "Dispute Resolution & Arbitration", desc: "Explore alternative dispute resolution (ADR), commercial litigation, and international arbitration procedures." }
  ];

  const faqs = [
    { q: "Do I need a law degree to enroll?", a: "While beneficial, it is not strictly required. This course is ideal for law students, paralegals, and business executives looking to master corporate legal strategy." },
    { q: "Who are the instructors?", a: "You will be mentored by senior partners from top-tier corporate law firms and in-house legal counsel from Fortune 500 companies." },
    { q: "Is there practical drafting experience?", a: "Yes. A core component of the course involves drafting actual contracts, term sheets, and compliance reports which are reviewed by mentors." },
    { q: "What are the career prospects?", a: "Graduates are highly sought after for roles as Corporate Counsel, Legal Analysts, M&A Consultants, and Compliance Officers." }
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
              An elite program designed to equip you with the legal acumen to navigate M&A, corporate governance, and complex contract negotiations in the corporate world.
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
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBalanceScale color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Mentorship from Top Partners</strong> <br/> Learn directly from leading corporate lawyers.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaBriefcase color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Premium Placements</strong> <br/> Dedicated support to land roles in top law firms & MNCs.</span></li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}><FaCheckCircle color="#f59e0b" size={24} style={{flexShrink:0, marginTop:"4px"}}/> <span><strong>Practical Drafting & M&A</strong> <br/> Hands-on experience drafting real-world corporate documents.</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CORE COMPETENCIES */}
      <section className="law-section">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          What You Will Master
        </motion.h2>
        
        <motion.div className="law-grid-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
          <motion.div className="law-card" variants={fadeUp}>
            <div className="law-card-icon"><FaBuilding /></div>
            <h4>Mergers & Acquisitions</h4>
            <p>Navigate complex M&A deals, conduct thorough legal due diligence, and structure successful corporate takeovers.</p>
          </motion.div>
          <motion.div className="law-card" variants={fadeUp}>
            <div className="law-card-icon"><FaHandshake /></div>
            <h4>Contract Negotiation</h4>
            <p>Master the art of drafting and negotiating iron-clad corporate agreements, from employment contracts to complex vendor SLAs.</p>
          </motion.div>
          <motion.div className="law-card" variants={fadeUp}>
            <div className="law-card-icon"><FaBalanceScale /></div>
            <h4>Corporate Governance</h4>
            <p>Ensure legal compliance, advise boards of directors, and manage risk in highly regulated corporate environments.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CURRICULUM */}
      <section className="law-section" id="curriculum">
        <motion.h2 className="law-section-title" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          Program Curriculum
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
              <h3 className="law-module-title">{item.title}</h3>
              <p className="law-module-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

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
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span><strong>Complete</strong> Curriculum Access</span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Practical <strong>Drafting Exercises</strong></span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span><strong>M&A</strong> Case Studies</span></li>
                  <li style={{ marginBottom: "1.2rem", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span>Professional <strong>Mentorship</strong></span></li>
                  <li style={{ marginBottom: "0", display: "flex", gap: "12px", alignItems: "center", fontSize: "1.1rem" }}><FaCheckCircle color="#f59e0b" size={20} style={{ flexShrink: 0 }}/> <span><strong>Career Placement</strong> Support</span></li>
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
                  <FaChevronDown />
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
