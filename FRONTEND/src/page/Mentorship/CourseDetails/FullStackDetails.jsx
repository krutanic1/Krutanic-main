import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaStar, FaCalendarAlt, FaChalkboardTeacher, FaProjectDiagram, 
  FaUserGraduate, FaChevronDown, FaChevronUp, FaFileDownload, 
  FaHeadset, FaCheckCircle, FaArrowRight, FaHome, FaChevronRight, FaBriefcase 
} from "react-icons/fa";
import { fullStackData as data } from "./fullStackData";
import MentorshipForm from "../../MentorshipForm";
import sachinImg from "../../../assets/mentors/sachin.jpg";
import "./CourseDetails.css";

const learningCategories = [
  {
    title: "Self-guided",
    price: "₹6,999/-",
    features: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "No Live Sessions",
      "No Doubt Clearing Session",
      "No Mentor Guidance",
      "No Placement Assistance",
      "No Mock Interviews"
    ],
    links: ["Slot Booking Link"]
  },
  {
    title: "Instructor Led",
    price: "₹9,999/-",
    features: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "Live Sessions",
      "Doubt Clearing Session",
      "Mentor Guidance",
      "No Placement Assistance",
      "No Mock Interviews"
    ],
    links: ["Slot Booking Link"]
  },
  {
    title: "Career Advancement",
    price: "₹15,999/-",
    features: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "Live Sessions",
      "Doubt Clearing Session",
      "Mentor Guidance",
      "Placement Assistance",
      "Mock Interviews",
      "Access to Our Hiring Partners",
      "ATS-Friendly Resume Building",
      "Personality Development"
    ],
    links: ["Slot Booking Link"]
  }
];

const FullStackDetails = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Breadcrumbs = () => (
    <nav className="cd-breadcrumbs">
      <Link to="/"><FaHome /> Home</Link>
      <FaChevronRight className="sep" />
      <Link to="/Mentorship">Mentorship</Link>
      <FaChevronRight className="sep" />
      <span className="current">{data.title}</span>
    </nav>
  );

  return (
    <div className="cd-container">
      {/* Hero Section */}
      <section className="cd-hero">
        <div className="cd-hero__grid">
          <div className="cd-hero__content">
            <Breadcrumbs />
            <div className="cd-hero__badge">Launch Team 2024</div>
            <h1 className="cd-hero__title">{data.title}</h1>
            <p className="cd-hero__pitch">
              Master the MERN stack and become a job-ready developer with 1:1 mentorship and real-world projects.
            </p>
            <div className="cd-hero__info-chips">
              <span className="chip"><FaCalendarAlt /> {data.duration}</span>
              <span className="chip"><FaChalkboardTeacher /> {data.format}</span>
              <span className="chip"><FaProjectDiagram /> Project-based</span>
              <span className="chip"><FaUserGraduate /> {data.level}</span>
            </div>
            <div className="cd-hero__rating">
              <div className="stars">
                {[1,2,3,4,5].map(i => <FaStar key={i} />)}
              </div>
              <span className="rating-text">{data.rating}/5 Rating • {data.enrolled} learners</span>
            </div>
            <div className="cd-hero__actions">
              <button className="cd-btn-primary" onClick={() => setShowForm(true)}>
                Enroll Now <FaArrowRight />
              </button>
              <button className="cd-btn-secondary" onClick={() => setShowForm(true)}>
                Talk to Advisor <FaHeadset />
              </button>
            </div>
          </div>
          
          <div className="cd-hero__visual">
            <div className="cd-hero-card">
              <div className="cd-hero-card__header">
                 <img src="/course_thumbnails/Full Stack Web.jpg" alt="Full Stack" />
              </div>
              <div className="cd-hero-card__body">
                 <h3>Program Highlights</h3>
                 <ul>
                   <li><FaCheckCircle /> 100% Internship Access</li>
                   <li><FaCheckCircle /> 5+ Real-world Projects</li>
                   <li><FaCheckCircle /> 1:1 Live Mentor Support</li>
                   <li><FaCheckCircle /> Professional Certification</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="cd-section cd-outcomes">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">What You Will <span>Learn</span></h2>
            <p className="cd-section__sub">Transform from a beginner to a proficient engineer with these core competencies.</p>
          </div>
          <div className="cd-outcome-grid">
            {data.outcomes.map((item, i) => (
              <div key={i} className="cd-outcome-card">
                <div className="icon"><item.icon /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Strip */}
      <section className="cd-tech-strip">
        <div className="cd-tech-strip__inner">
          {data.tools.map((tool, i) => (
            <div key={i} className="cd-tech-badge">
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="cd-section cd-section--alt cd-curriculum">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">Curriculum <span>Roadmap</span></h2>
            <p className="cd-section__sub">A structured, step-by-step journey designed for deep understanding.</p>
          </div>
          <div className="cd-curriculum-container">
            <div className="cd-curriculum-tabs">
              {data.curriculum.map((mod, i) => (
                <button 
                  key={i} 
                  className={`cd-curriculum-tab ${activeModule === i ? 'active' : ''}`}
                  onClick={() => setActiveModule(i)}
                >
                  <span className="mod-num">{mod.module}</span>
                  <span className="mod-title">{mod.title}</span>
                </button>
              ))}
            </div>
            <div className="cd-curriculum-content">
              <div className="cd-module-card">
                <h3>{data.curriculum[activeModule].title}</h3>
                <ul>
                  {data.curriculum[activeModule].topics.map((topic, j) => (
                    <li key={j}><FaCheckCircle /> {topic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="cd-section cd-projects">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">Real-world <span>Projects</span></h2>
            <p className="cd-section__sub">Build a portfolio that gets you hired. High-impact projects with real outcomes.</p>
          </div>
          <div className="cd-projects-grid">
            {data.projects.map((project, i) => (
              <div key={i} className="cd-project-card">
                <div className="tag">Portfolio Project</div>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="tech-stack">
                  {project.tech.map((t, j) => <span key={j}>{t}</span>)}
                </div>
                <div className="impact">
                  <strong>Impact:</strong> {project.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="cd-section cd-careers">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">{data.careerPaths.title}</h2>
            <p className="cd-section__sub">{data.careerPaths.subtitle}</p>
          </div>
          <div className="cd-careers-grid">
            {data.careerPaths.roles.map((role, i) => (
              <div key={i} className="cd-career-card">
                <div className="cd-career-card__header">
                  <span className="level-badge">{role.level}</span>
                  <div className="icon-wrap">
                     {i === 0 && <FaArrowRight />}
                     {i === 1 && <FaCheckCircle />}
                     {i === 2 && <FaUserGraduate />}
                     {i === 3 && <FaStar />}
                     {i === 4 && <FaProjectDiagram />}
                     {i === 5 && <FaBriefcase />}
                  </div>
                </div>
                <h3>{role.title}</h3>
                <p>{role.desc}</p>
                <div className="cd-career-card__tools">
                  <strong>What you'll use:</strong>
                  <div className="tools-list">
                    {role.tools.map((t, j) => <span key={j}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cd-careers-footer">
             <div className="progression-strip">
                <span>You may also grow into:</span>
                {data.careerPaths.progression.map((p, i) => (
                  <span key={i} className="p-tag">{p}</span>
                ))}
             </div>
             <p className="credibility-note">
                * Career outcomes depend on your project execution, portfolio strength, communication, and interview readiness. Krutanic supports this journey through mentor guidance and internship access.
             </p>
          </div>
        </div>
      </section>

      {/* Learning Experience & Mentor */}
      <section className="cd-dual-section">
        <div className="cd-section__inner cd-dual-grid">
          <div className="cd-experience">
             <h2 className="cd-section__title">The Krutanic <span>Experience</span></h2>
             <div className="cd-exp-list">
                <div className="cd-exp-item">
                   <div className="icon"><FaChalkboardTeacher /></div>
                   <div>
                      <h4>Mentor-led Sessions</h4>
                      <p>Not just pre-recorded videos. Get live guidance from experts.</p>
                   </div>
                </div>
                <div className="cd-exp-item">
                   <div className="icon"><FaHeadset /></div>
                   <div>
                      <h4>24/7 Doubt Support</h4>
                      <p>Get your queries resolved quickly by our dedicated support team.</p>
                   </div>
                </div>
                <div className="cd-exp-item">
                   <div className="icon"><FaBriefcase /></div>
                   <div>
                      <h4>Internship Access</h4>
                      <p>Exclusive access to internships with 100+ hiring partners.</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="cd-mentor">
             <div className="cd-mentor-card">
                <div className="cd-mentor-card__img">
                   <img src={sachinImg} alt={data.mentor.name} />
                </div>
                <div className="cd-mentor-card__info">
                   <span className="domain">Lead Mentor</span>
                   <h3>{data.mentor.name}</h3>
                   <p className="role">{data.mentor.role} • {data.mentor.experience}</p>
                   <p className="bio">{data.mentor.bio}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="cd-section cd-section--alt">
        <div className="cd-section__inner">
          <div className="cd-section__header center">
            <h2 className="cd-section__title">Learning <span>Categories</span></h2>
            <p className="max-w-3xl mx-auto text-[15px] text-[var(--muted)] mt-4">
              Choose the learning format that fits your schedule and career goals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            {learningCategories.map((cat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow)] flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--text)] mb-3">{cat.title}</h3>
                  <div className="text-4xl font-black tracking-tight text-[#2563EB] mb-6">{cat.price}</div>
                  <ul className="space-y-3 mb-6">
                    {cat.features.map((feature, j) => {
                      const isUnavailable = feature.includes("No ");
                      return (
                        <li
                          key={j}
                          className={`flex items-start gap-3 text-[15px] ${isUnavailable ? "text-gray-400 line-through opacity-70" : "text-[var(--text)]"}`}
                        >
                          <span className={`mt-2 h-2 w-2 rounded-full ${isUnavailable ? "bg-gray-400" : "bg-[#2563EB]"}`}></span>
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="space-y-3">
                  {cat.links.map((link, j) => (
                    <button
                      key={j}
                      type="button"
                      className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Steps */}
      <section className="cd-section cd-section--alt cd-steps">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">How to <span>Enroll</span></h2>
          </div>
          <div className="cd-steps-grid">
             {[
               { title: "Register", desc: "Fill out the application form with your details." },
               { title: "Consultation", desc: "Speak with our career advisors for guidance." },
               { title: "Onboarding", desc: "Submit documentation and complete enrollment." },
               { title: "Start Learning", desc: "Get access to the portal and meet your mentor." }
             ].map((step, i) => (
               <div key={i} className="cd-step-card">
                  <div className="step-num">{i + 1}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="cd-section cd-faq">
        <div className="cd-section__inner">
          <div className="cd-faq-wrap">
            <div className="cd-section__header center">
              <h2 className="cd-section__title">Frequently Asked <span>Questions</span></h2>
            </div>
            <div className="cd-faq-list">
              {data.faqs.map((faq, i) => (
                <details key={i} className="cd-faq-item">
                   <summary>
                     {faq.q}
                     <span className="icon-toggle">
                       <FaChevronDown className="down" />
                       <FaChevronUp className="up" />
                     </span>
                   </summary>
                   <div className="answer">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cd-final-cta">
         <div className="cd-final-cta__content">
            <h2>Ready to start your Full Stack Journey?</h2>
            <p>Join {data.enrolled} who are already transforming their careers with Krutanic.</p>
            <div className="actions">
               <button className="cd-btn-primary" onClick={() => setShowForm(true)}>Enroll Now</button>
               <button className="cd-btn-outline" onClick={() => setShowForm(true)}>Talk to Advisor</button>
            </div>
         </div>
      </section>

      {/* Sticky Bottom CTA (Mobile) */}
      <div className={`cd-sticky-mobile ${isScrolled ? 'visible' : ''}`}>
         <button className="cd-btn-primary full" onClick={() => setShowForm(true)}>Enroll in Full Stack</button>
      </div>

      {showForm && <MentorshipForm isPopup onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default FullStackDetails;
