import { Helmet } from 'react-helmet-async';
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./mentorship-redesign.css";

import certificate3 from "../assets/certificates/c/training.jpg";
import adobe from "../assets/certificates/c/internship.jpg";
import heroImg from "../assets/Collaboration pics/college collab 3.jpg";

import FAQMentor from "./Mentorship/FAQMentor";
import EnrollMentor from "./Mentorship/EnrollMentor";
import PopularCourse from "./Mentorship/PopularCourse";
import CourseMentor from "./Mentorship/CourseMentor";
import Getintouch from "../Components/Getintouch";
import MentorShipMentors from "../Components/MentorShipMentors";
import MentorshipForm from "./MentorshipForm";
import { useNavigate } from "react-router-dom";
import { FaDownload, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

const stats = [
  { value: "100+", label: "Internship Partners", icon: "🤝" },
  { value: "1:1", label: "Mentor Guidance", icon: "🎯" },
  { value: "Live", label: "Project Sessions", icon: "🔴" },
  { value: "Dual", label: "Certification", icon: "📜" },
];

const certBullets = [
  "Portfolio projects reviewed by industry mentors",
  "1:1 mentor feedback and career assessment",
  "Internship access via 100+ partner companies",
  "Job readiness coaching and mock interviews",
];

const Mentorship = () => {
  const [showPopup, setShowPopup] = useState(false);
  const courseSectionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToCourse = () =>
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 80 });
    document.body.classList.add("mentorship-theme-active");
    const t = setTimeout(() => setShowPopup(true), 5000);
    return () => {
      clearTimeout(t);
      document.body.classList.remove("mentorship-theme-active");
    };
  }, []);

  return (
    <div id="mentorship" className="mp-page">
      {showPopup && <MentorshipForm isPopup={true} onClose={() => setShowPopup(false)} />}

      <Helmet>
        <title>Krutanic Mentorship – Data Science, AI, Full Stack & More</title>
        <meta name="description" content="Krutanic Mentorship: expert-led, project-based programs in AI, Data Science, Full Stack, Cyber Security and more. 100+ internship partners, live sessions, dual certification." />
        <link rel="canonical" href="https://www.krutanic.com/Mentorship" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="mp-hero" id="mentorshipbg">
        <div className="mp-hero__bg-grid" aria-hidden="true" />
        <div className="mp-hero__orb mp-hero__orb--1" aria-hidden="true" />
        <div className="mp-hero__orb mp-hero__orb--2" aria-hidden="true" />

        <div className="mp-hero__inner" data-aos="fade-up">
          <div className="mp-hero__content">
            <span className="mp-chip">Career Acceleration Track · Bengaluru</span>
            <h1 className="mp-hero__headline">
              Learn with mentors.<br />
              Build real projects.<br />
              <span>Move into tech careers.</span>
            </h1>
            <p className="mp-hero__sub">
              Mentorship-led programs with live sessions, real project work, internship access, and globally recognized certifications — designed for students and early-career professionals.
            </p>
            <div className="mp-hero__ctas">
              <button className="mp-btn-primary" onClick={scrollToCourse} id="hero-explore-btn">
                Explore Programs ↓
              </button>
              <button className="mp-btn-ghost" onClick={() => setShowPopup(true)} id="hero-advisor-btn">
                Talk to Advisor
              </button>
            </div>

            <div className="mp-hero__stats">
              {stats.map(s => (
                <div key={s.label} className="mp-hero__stat">
                  <span className="mp-hero__stat-icon">{s.icon}</span>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mp-hero__visual">
            <div className="mp-hero__img-wrap">
              <img src={heroImg} alt="Krutanic mentorship session" className="mp-hero__img" />
              <div className="mp-hero__img-overlay" aria-hidden="true" />
            </div>
            <div className="mp-hero__float-card mp-hero__float-card--1">
              <span>🤖</span>
              <div><p>AI & ML</p><small>4.8★ · 2,340 learners</small></div>
            </div>
            <div className="mp-hero__float-card mp-hero__float-card--2">
              <span>💻</span>
              <div><p>Full Stack</p><small>4.7★ · 2,298 learners</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────── */}
      <div className="mp-trust-bar" data-aos="fade-up">
        <span className="mp-trust-bar__label">Internship & Hiring Partners:</span>
        <div className="mp-trust-marquee">
          <div className="mp-trust-track">
            {["TCS","Wipro","Infosys","HCL","Accenture","Cognizant","IBM","Capgemini","Tech Mahindra","Mphasis",
              "TCS","Wipro","Infosys","HCL","Accenture","Cognizant","IBM","Capgemini","Tech Mahindra","Mphasis"
            ].map((c, i) => <span key={i} className="mp-trust-pill">{c}</span>)}
          </div>
        </div>
      </div>

      {/* ── SPECIALIZATIONS ───────────────────────────────── */}
      <section ref={courseSectionRef} className="mp-section" data-aos="fade-up">
        <div className="mp-container mp-surface">
          <div className="mp-section-head">
            <p className="mp-eyebrow">Explore Specializations</p>
            <h2>Curated <span>Mentorship Tracks</span></h2>
            <p className="mp-section-desc">Structured programs across every major tech and business vertical.</p>
          </div>
          <CourseMentor hideHeading />
        </div>
      </section>

      {/* ── POPULAR COURSES ───────────────────────────────── */}
      <section className="mp-section mp-section--alt" data-aos="fade-up">
        <div className="mp-container mp-surface">
          <div className="mp-section-head">
            <p className="mp-eyebrow">High Demand</p>
            <h2>Popular <span>Courses</span></h2>
          </div>
          <PopularCourse hideHeading />
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────── */}
      <section className="mp-section" data-aos="fade-up">
        <div className="mp-container mp-cert-grid">
          <div className="mp-cert-content">
            <p className="mp-eyebrow">Globally Recognized</p>
            <h2>Credentials That <span>Matter</span></h2>
            <p className="mp-cert-lead">Every learner receives industry-standard certifications backed by real project work and mentor-reviewed assessments.</p>
            <ul className="mp-cert-bullets">
              {certBullets.map(b => (
                <li key={b}><FaCheckCircle className="mp-cert-check" />{b}</li>
              ))}
            </ul>
            <div className="mp-cert-actions">
              <a href={adobe} target="_blank" rel="noreferrer" className="mp-btn-outline" id="cert-preview">
                Preview Certificate <FaExternalLinkAlt style={{marginLeft:6,fontSize:12}} />
              </a>
              <button className="mp-btn-primary" onClick={() => setShowPopup(true)} id="cert-enroll">
                Get Certified Now
              </button>
            </div>
          </div>
          <div className="mp-cert-cards">
            <article className="mp-cert-card">
              <img src={adobe} alt="Certificate of Internship" />
              <div className="mp-cert-card__footer">
                <span>Certificate of Internship</span>
                <a href={adobe} download><FaDownload /></a>
              </div>
            </article>
            <article className="mp-cert-card mp-cert-card--offset">
              <img src={certificate3} alt="Training Completion Certificate" />
              <div className="mp-cert-card__footer">
                <span>Training Completion</span>
                <a href={certificate3} download><FaDownload /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ───────────────────────────────────── */}
      <section className="mp-pricing-banner" data-aos="fade-up">
        <div className="mp-container mp-pricing-inner">
          <div>
            <p className="mp-eyebrow" style={{color:"#94adff"}}>Transparent Pricing</p>
            <h2>Want to know the fee structure?</h2>
            <p>Detailed information on mentorship tracks, batch schedules, and fee plans.</p>
          </div>
          <button onClick={() => navigate("/FeeStructure")} className="mp-btn-primary mp-btn-primary--lg" id="pricing-btn">
            View Pricing →
          </button>
        </div>
      </section>

      {/* ── MENTORS ───────────────────────────────────────── */}
      <section className="mp-section" data-aos="fade-up">
        <div className="mp-container mp-surface">
          <div className="mp-section-head center">
            <p className="mp-eyebrow">Meet the Team</p>
            <h2>Architects of <span>Student Success</span></h2>
            <p className="mp-section-desc">Industry practitioners — not just teachers — who bring real-world experience to every session.</p>
          </div>
          <MentorShipMentors hideHeading />
          <div className="mp-mentor-trust">
            {["✅ Expert-Led","✅ Industry Experience","✅ 1:1 Live Sessions","✅ Career Mentorship"].map(t => (
              <span key={t} className="mp-mentor-trust__item">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="mp-section mp-section--alt" data-aos="fade-up">
        <div className="mp-container mp-surface">
          <div className="mp-section-head center">
            <p className="mp-eyebrow">Got Questions?</p>
            <h2>Frequently Asked <span className="mp-orange-text">Questions</span></h2>
          </div>
          <FAQMentor hideHeading />
        </div>
      </section>

      {/* ── ENROLLMENT ────────────────────────────────────── */}
      <section className="mp-section" data-aos="fade-up">
        <div className="mp-container mp-surface">
          <EnrollMentor />
        </div>
      </section>

      {/* ── CONTACT CTA ───────────────────────────────────── */}
      <section className="mp-section mp-section--last">
        <div className="mp-container">
          <div className="mp-final-cta" data-aos="fade-up">
            <div className="mp-final-cta__orb mp-final-cta__orb--1" aria-hidden="true" />
            <div className="mp-final-cta__orb mp-final-cta__orb--2" aria-hidden="true" />
            <p className="mp-eyebrow" style={{color:"#94adff"}}>Your next move starts here</p>
            <h2>Ready to build your career<br/>with expert mentorship?</h2>
            <p>From confusion to career clarity — one track at a time.</p>
            <div className="mp-final-cta__btns">
              <button className="mp-btn-primary mp-btn-primary--lg" onClick={() => setShowPopup(true)} id="final-cta-btn">
                Enroll Now
              </button>
              <button className="mp-btn-ghost" onClick={() => navigate("/ContactUs")} id="final-contact-btn">
                Connect With Us →
              </button>
            </div>
          </div>
          <Getintouch />
        </div>
      </section>

      {/* WhatsApp */}
      <a
        href="https://api.whatsapp.com/send?phone=919380736449&text=Hello%20Krutanic%20Team,%0A%0AI%20have%20some%20queries%20regarding%20my%20course.%0A%0AThank%20you!"
        target="_blank" rel="noopener noreferrer"
        className="mentorship-whatsapp" aria-label="Chat on WhatsApp"
      >
        <i className="fa fa-whatsapp" />
      </a>

      {/* Sticky mobile CTA */}
      <div className="mp-sticky-mobile">
        <button onClick={() => setShowPopup(true)} className="mp-sticky-mobile__btn" id="mobile-sticky-btn">
          🎯 Get Free Consultation
        </button>
      </div>
    </div>
  );
};

export default Mentorship;
