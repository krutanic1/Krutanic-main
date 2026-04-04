import { Helmet } from 'react-helmet';
import React, { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import certificate1 from "../assets/certificates/c/completion.jpg";
import certificate3 from "../assets/certificates/c/training.jpg";
import adobe from "../assets/certificates/c/internship.jpg"
// import accreditedby from "../assets/poplogo/accreditedby.png"
import FAQMentor from "./Mentorship/FAQMentor";
import EnrollMentor from "./Mentorship/EnrollMentor";
import PopularCourse from "./Mentorship/PopularCourse";
import CourseMentor from "./Mentorship/CourseMentor";
import Getintouch from "../Components/Getintouch";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import MentorShipMentors from "../Components/MentorShipMentors";
import MentorshipForm from "./MentorshipForm";
import mentorshipHeroImage from "../assets/Collaboration pics/college collab 3.jpg";
import {
  FaBriefcase,
  FaChartLine,
  FaCertificate,
  FaShieldAlt,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";

const credentialHighlights = [
  {
    title: "Elite Network",
    text: "Created for business leaders, advisors and innovators",
    icon: FaBriefcase,
  },
  {
    title: "Career Growth",
    text: "Builds skills and creativity for career growth",
    icon: FaChartLine,
  },
];

const credentialStats = [
  {
    value: "100+",
    label: "Internship Partners",
    icon: FaCertificate,
    accent: "orange",
  },
  {
    value: "Expert",
    label: "Approved Program",
    icon: FaShieldAlt,
    accent: "blue",
  },
];

const Mentorship = () => {
  const [showPopup, setShowPopup] = useState(false);


  const courseSectionRef = useRef(null);
  const scrollToCourse = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    AOS.init({ duration: 2000, once: false });
    document.body.classList.add("mentorship-theme-active");

    let interval;
    const timer = setTimeout(() => {
      setShowPopup(true);
      interval = setInterval(() => {
        setShowPopup(true);
      }, 60000);
    }, 5000);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
      document.body.classList.remove("mentorship-theme-active");
    };
  }, []);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/FeeStructure");
  };

  return (
    <div id="mentorship" className="mentorship-page">
      {showPopup && <MentorshipForm isPopup={true} onClose={() => setShowPopup(false)} />}
      <Helmet>
        <title>Krutanic Mentorship Program - Data Science, AI, Full Stack, Digital Marketing  </title>
        <meta name="keywords" content="Top E-learning, mentorship, tech mentorship, data science, coding, online learning, career growth" />
        <meta name="description" content="Krutanic offers a career-driven Mentorship Program with expert guidance, hands-on training, and 100+ internship opportunities in Data Science, Artificial Intelligence, Machine Learning, Cyber Security, Full Stack Web Development, Cloud Computing, and Digital Marketing" />
        <meta property="og:title" content="Top E-Learning Mentorship Programs | Krutanic" />
        <meta property="og:url" content="https://www.krutanic.com/Mentorship" />
        <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png" />
        <meta property="og:description" content="Join Krutanic’s top e-learning mentorship to grow your tech, coding, and data skills with expert guidance." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta property="twitter:title" content="Top E-Learning Mentorship Programs | Krutanic" />
        <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png" />
        <meta property="twitter:description" content="Join Krutanic’s top e-learning mentorship to grow your tech, coding, and data skills with expert guidance." />
        <link rel="canonical" href="https://www.krutanic.com/Mentorship" />
      </Helmet>

      <section id="mentorshipbg" className="mentorship-hero section-space">
        <div className="container mentorship-hero-card" data-aos="fade-up">
          <div className="mentorship-hero-content">
            <span className="mentorship-chip">Career acceleration track</span>
            <h1>
              Discover a smarter way to learn with Krutanic&apos;s
              <span>Mentorship Program.</span>
            </h1>
            <p>
              Gain personalized career guidance, hands-on training, and expert mentorship to achieve your professional and personal goals. Build new skills, advance faster, and unlock meaningful opportunities.
            </p>
            <button
              onClick={scrollToCourse}
              className="mentorship-primary-btn"
            >
              Explore Course Catalog
            </button>

            <div className="mentorship-hero-stats">
              <article>
                <strong>100+</strong>
                <span>Internship partners</span>
              </article>
              <article>
                <strong>1:1</strong>
                <span>Mentor guidance</span>
              </article>
              <article>
                <strong>Live</strong>
                <span>Project-based sessions</span>
              </article>
            </div>
          </div>

          <div className="mentorship-hero-form-wrap">
            <img
              src={mentorshipHeroImage}
              alt="Learners collaborating during a mentorship session"
              className="mentorship-hero-image"
            />
          </div>
        </div>
      </section>

      <div className="mentorship-divider" />

      <section ref={courseSectionRef} className="section-space">
        <div className="container mentorship-surface">
          <div className="section-head">
            <h2>Curated <span>Specializations</span></h2>
          </div>
          <CourseMentor />
        </div>
      </section>

      <div className="mentorship-divider" />

      <section className="section-space">
        <div className="container mentorship-surface">
          <div className="section-head">
            <h2>Popular <span>Courses</span></h2>
          </div>
          <PopularCourse />
        </div>
      </section>

      <div className="mentorship-divider" />

      <section className="section-space">
        <div className="container mentorship-certifications">
          <div className="certification-grid">
            <div className="certification-points">
              <p className="credential-chip">Global Standards</p>
              <h2>
                Globally <span>Recognized</span> Certification
              </h2>
              <span className="credential-bar" aria-hidden="true" />

              <div className="credential-feature-wrap">
                {credentialHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="point-item">
                      <div className="point-icon"><Icon /></div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="credential-stat-wrap">
                {credentialStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.label} className={`credential-stat ${item.accent}`}>
                      <Icon className="credential-stat-icon" />
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </article>
                  );
                })}
              </div>

              <div className="credential-heading-row">
                <div>
                  <h4>Your Credentials</h4>
                  <p>Industry-standard validation</p>
                </div>
                <a href={adobe} target="_blank" rel="noreferrer">
                  Preview <FaExternalLinkAlt />
                </a>
              </div>

              <button className="mentorship-primary-btn credential-cta">
                Get Certified Now
              </button>
              <p className="credential-note">Authorized by global education consortiums.</p>
            </div>

            <div className="certification-images">
              <article className="credential-card">
                <img
                  src={adobe}
                  alt="Mentorship internship certificate"
                />
                <div className="credential-card-footer">
                  <span>Certificate of Internship</span>
                  <a href={adobe} download>
                    <FaDownload />
                  </a>
                </div>
              </article>

              <article className="credential-card">
                <img
                  src={certificate3}
                  alt="Mentorship training certificate"
                />
                <div className="credential-card-footer">
                  <span>Training Completion</span>
                  <a href={certificate3} download>
                    <FaDownload />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container mentorship-pricing-cta">
          <h2>Want to know the fee structure?</h2>
          <p>
            Find detailed information about our mentorship tracks, schedules, and fee plans.
          </p>
          <button
            onClick={handleNavigate}
            className="mentorship-primary-btn"
          >
            View Pricing Information
          </button>
        </div>
      </section>

      <div className="mentorship-divider" />

      <section className="section-space">
        <div className="container mentorship-surface">
          <div className="section-head center">
            <h2>Meet Your <span>Architects of Success.</span></h2>
          </div>
          <MentorShipMentors />
        </div>
      </section>

      <section className="section-space">
        <div className="container mentorship-surface">
          <div className="section-head center">
            <h2>Frequently Asked <span>Questions.</span></h2>
          </div>
          <FAQMentor />
        </div>
      </section>

      <section className="section-space">
        <div className="container mentorship-surface">
          <EnrollMentor />
        </div>
      </section>

      <section className="section-space section-last">
        <div className="container">
          <Getintouch />
        </div>
      </section>

      <div className="mentorship-whatsapp">
        <a
          href="https://api.whatsapp.com/send?phone=919380736449&text=Hello%20Krutanic%20Team,%0A%0AI%20have%20some%20queries%20regarding%20my%20course.%0A%0AThank%20you!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-whatsapp" />
        </a>
      </div>
    </div>
  );
};

export default Mentorship;
