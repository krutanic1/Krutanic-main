import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { 
  FaStar, FaCalendarAlt, FaChalkboardTeacher, FaProjectDiagram, 
  FaUserGraduate, FaChevronDown, FaChevronUp, FaFileDownload, 
  FaHeadset, FaCheckCircle, FaArrowRight, FaHome, FaChevronRight, FaBriefcase,
  FaDownload, FaShareAlt, FaAward, FaIdCard
} from "react-icons/fa";
import { allMentorshipData } from "./allMentorshipData";
import MentorshipForm from "../../MentorshipForm";
import sachinImg from "../../../assets/mentors/sachin.jpg";
import certInternship from '../../../assets/certificates/c/internship.jpg';
import certTraining from '../../../assets/certificates/c/training.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CourseDetails.css";

// Lightweight countdown component used in AI promo bar
const Countdown = ({ targetOffsetHours = 48 }) => {
  const target = useMemo(() => Date.now() + targetOffsetHours * 3600 * 1000, [targetOffsetHours]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Math.floor((target - now) / 1000));
  const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
  const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const secs = String(diff % 60).padStart(2, '0');
  return <span style={{display:'inline-flex',gap:8,alignItems:'center',fontFamily:'monospace'}}>{hrs} : {mins} : {secs}</span>;
};

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
    links: ["Slot Booking Link", "Full Registration Link"]
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
    links: ["https://rzp.io/rzp/Career_Advance_Slot_Booking", "Career Advancement Full Registration"]
  }
];

const MentorshipCourseDetails = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const data = allMentorshipData[courseSlug];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!data) {
    return <Navigate to="/Mentorship" />;
  }

  const Breadcrumbs = () => (
    <nav className="cd-breadcrumbs">
      <Link to="/"><FaHome /> Home</Link>
      <FaChevronRight className="sep" />
      <Link to="/Mentorship">Mentorship</Link>
      <FaChevronRight className="sep" />
      <span className="current">{data.title}</span>
    </nav>
  );

  const reviewSliderSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 9000,
    cssEase: 'linear',
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipeToSlide: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, speed: 7000 } },
      { breakpoint: 640, settings: { slidesToShow: 1, speed: 5000 } }
    ]
  };

  const reviewLoopItems = data.studentReviews ? [...data.studentReviews, ...data.studentReviews] : [];

  return (
    <div className="cd-container">
      {/* Hero Section */}
      <section className="cd-hero">
        <div className="cd-hero__grid">
          <div className="cd-hero__content">
            <Breadcrumbs />
            <div className="cd-hero__badge">{data.providerNote || "Launch Team 2024"}</div>
            <h1 className="cd-hero__title">{data.title}</h1>
            <p className="cd-hero__pitch">{data.pitch || `Master ${data.title} and become a job-ready professional with 1:1 mentorship and real-world projects.`}</p>
            {data.contactInfo?.length > 0 && (
              <p className="cd-hero__contact">{data.contactInfo.join(" | ")}</p>
            )}
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
              <span className="rating-text">{data.rating}/5 Rating • {data.enrolled}</span>
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
                 <img src={data.thumbnail} alt={data.title} />
              </div>
              <div className="cd-hero-card__body">
                 <h3>Program Highlights</h3>
                 <ul>
                   <li><FaCheckCircle /> 100% Internship Access</li>
                   <li><FaCheckCircle /> Real-time Industrial Projects</li>
                   <li><FaCheckCircle /> 1:1 Live Mentor Support</li>
                   <li><FaCheckCircle /> Professional Certification</li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(data.aboutDescription || (data.whyPoints && data.whyPoints.length > 0)) && (
        <section className="cd-section cd-section--alt cd-about-why">
          <div className="cd-section__inner">
            {data.aboutDescription && (
              <div className="cd-about-block">
                <div className="cd-section__header">
                  <h2 className="cd-section__title">{data.aboutTitle || "About Us"}</h2>
                </div>
                <p className="cd-about-copy">{data.aboutDescription}</p>
              </div>
            )}
            {data.whyPoints?.length > 0 && (
              <div className="cd-why-block">
                <div className="cd-section__header">
                  <h2 className="cd-section__title">{data.whyTitle || "Why Choose This Program?"}</h2>
                </div>
                <div className="cd-why-grid">
                  {data.whyPoints.map((point, i) => (
                    <div key={i} className="cd-why-card">
                      <FaCheckCircle />
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {data.trainingProgram?.length > 0 && (
        <section className="cd-section cd-program-structure">
          <div className="cd-section__inner">
            <div className="cd-section__header">
              <h2 className="cd-section__title">Training and <span>Internship Program</span></h2>
            </div>
            <div className="cd-program-grid">
              {data.trainingProgram.map((phase, i) => (
                <article key={i} className="cd-program-card">
                  <span className="phase">{phase.phase}</span>
                  <h3>{phase.title}</h3>
                  <ul>
                    {phase.items.map((item, j) => (
                      <li key={j}><FaCheckCircle /> {item}</li>
                    ))}
                  </ul>
                </article>
              ))}
              <article className="cd-program-card">
                <span className="phase">Post-Training</span>
                <h3>Placement Support</h3>
                <ul>
                  <li><FaCheckCircle /> Dedicated placement assistance with access to 200+ hiring partners.</li>
                  <li><FaCheckCircle /> ATS-friendly resume building and LinkedIn profile optimization.</li>
                  <li><FaCheckCircle /> Mock interviews with industry experts to prepare for technical and HR rounds.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
      )}

      {data.moduleOverview?.length > 0 && (
        <section className="cd-tech-strip cd-module-strip">
          <div className="cd-section__inner">
            <div className="cd-section__header">
              <h2 className="cd-section__title">Modules <span>Overview</span></h2>
            </div>
            <div className="cd-tech-strip__inner">
              {data.moduleOverview.map((item, i) => (
                <div key={i} className="cd-tech-badge">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcome Section */}
      <section className="cd-section cd-outcomes">
        <div className="cd-section__inner">
          <div className="cd-section__header">
            <h2 className="cd-section__title">What You Will <span>Learn</span></h2>
            <p className="cd-section__sub">Transform from a beginner to a proficient expert with these core competencies.</p>
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

      {data.milestones?.length > 0 && (
        <section className="cd-section cd-section--alt cd-milestones">
          <div className="cd-section__inner">
            <div className="cd-section__header">
              <h2 className="cd-section__title">Program <span>Highlights</span></h2>
              <p className="cd-section__sub">Discover why this Full Stack Development course is essential for your learning journey.</p>
            </div>
            <div className="cd-milestone-grid">
              {data.milestones.map((item, i) => (
                <article className="cd-milestone-card" key={i}>
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
                      <p>Exclusive access to internships with 200+ hiring partners.</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="cd-mentor">
             <div className="cd-mentor-card">
                 {data.mentorImage !== null && (
                   <div className="cd-mentor-card__img">
                     <img src={data.mentorImage || sachinImg} alt={data.mentor.name} />
                   </div>
                 )}
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

      {data.certifications?.length > 0 && (
        <section className="km-creds">
          <div className="km-creds__container">
            <div className="km-creds__left">
              <div className="km-section-chip" style={{ color: '#2563EB', borderColor: '#2563EB', backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>Certifications</div>
              <h2 className="km-section-title">Credentials That <span style={{ color: '#2563EB' }}>Matter</span></h2>
              <p className="km-creds__sub">Validate your hard work with dual certifications that are recognized by top hiring partners and industry leaders.</p>
              
              <div className="km-creds__highlights">
                <div className="km-creds__highlight">
                  <div className="km-creds__highlight-icon" style={{ color: '#2563EB' }}><FaAward /></div>
                  <div>
                    <h4>Verified Training</h4>
                    <p>Certification of technical mastery in your chosen domain.</p>
                  </div>
                </div>
                <div className="km-creds__highlight">
                  <div className="km-creds__highlight-icon" style={{ color: '#2563EB' }}><FaIdCard /></div>
                  <div>
                    <h4>Work Experience</h4>
                    <p>Official internship certificate for your real-world contributions.</p>
                  </div>
                </div>
                <div className="km-creds__highlight">
                  <div className="km-creds__highlight-icon" style={{ color: '#2563EB' }}><FaProjectDiagram /></div>
                  <div>
                    <h4>Project Verified</h4>
                    <p>Portfolio-ready validation for your capstone project work.</p>
                  </div>
                </div>
              </div>

              <div className="km-creds__stats">
                <div className="km-creds__stat">
                  <strong style={{ color: '#2563EB' }}>12k+</strong>
                  <span>Verified Profiles</span>
                </div>
                <div className="km-creds__stat">
                  <strong style={{ color: '#2563EB' }}>500+</strong>
                  <span>Colleges Impacted</span>
                </div>
              </div>
              <p className="km-creds__note">*All certificates include unique QR codes for instant recruiter verification.</p>
            </div>

            <div className="km-creds__right">
              <div className="km-cert-card">
                <img src={certTraining} alt="Training Certificate" className="km-cert-card__img" />
                <div className="km-cert-card__footer">
                  <span>Training Certificate</span>
                  <div className="km-cert-card__actions">
                    <a href={certTraining} target="_blank" rel="noreferrer" style={{ color: '#2563EB' }}><FaDownload /></a>
                    <a href="#" style={{ color: '#2563EB' }}><FaShareAlt /></a>
                  </div>
                </div>
              </div>

              <div className="km-cert-card">
                <img src={certInternship} alt="Internship Certificate" className="km-cert-card__img" />
                <div className="km-cert-card__footer">
                  <span>Experience Certificate</span>
                  <div className="km-cert-card__actions">
                    <a href={certInternship} target="_blank" rel="noreferrer" style={{ color: '#2563EB' }}><FaDownload /></a>
                    <a href="#" style={{ color: '#2563EB' }}><FaShareAlt /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {data.studentReviews?.length > 0 && (
        <section className="cd-section cd-reviews">
          <div className="cd-section__inner">
            <div className="cd-section__header center">
              <h2 className="cd-section__title">Students <span>Reviews</span></h2>
            </div>
            <div className="cd-reviews-carousel-wrapper cd-reviews-carousel-wrapper--slick">
              <Slider {...reviewSliderSettings}>
                {reviewLoopItems.map((review, i) => (
                  <div key={i} className="cd-review-slide">
                    <article className="cd-review-card cd-review-card--slick">
                      <div className="cd-review-card__glow"></div>
                      <div className="cd-review-card__top cd-review-card__top--slick">
                        <div className="cd-review-card__profile">
                          <div className="cd-review-card__avatar">{review.name.charAt(0)}</div>
                          <div>
                            <h3>{review.name}</h3>
                          </div>
                        </div>
                        <div className="stars">
                          {[1,2,3,4,5].map((star) => <FaStar key={star} />)}
                        </div>
                      </div>
                      <p>{review.text}</p>
                      {review.detail && <span>{review.detail}</span>}
                    </article>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      )}

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
                  {cat.links.map((link, j) => {
                    if (link === "Slot Booking Link") {
                      return (
                        <a
                          key={j}
                          href="https://pages.razorpay.com/Instructor_Led_Slot_Booking"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Book Slot Now
                        </a>
                      );
                    }
                    if (link === "https://rzp.io/rzp/Career_Advance_Slot_Booking") {
                      return (
                        <a
                          key={j}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Book Slot Now
                        </a>
                      );
                    }
                    if (link === "Full Registration Link") {
                      return (
                        <a
                          key={j}
                          href="https://pages.razorpay.com/Instructor_Led_Full_Enrollment"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Full Registration
                        </a>
                      );
                    }
                    if (link === "Career Advancement Full Registration") {
                      return (
                        <a
                          key={j}
                          href="https://pages.razorpay.com/Career_Advancement_Full_Reg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Full Registration
                        </a>
                      );
                    }
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                      >
                        {link}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Steps */}
      <section className="cd-section cd-steps">
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
            <h2>Ready to start your {data.title} Journey?</h2>
            <p>Join {data.enrolled} who are already transforming their careers with Krutanic.</p>
            <div className="actions">
               <button className="cd-btn-primary" onClick={() => setShowForm(true)}>Enroll Now</button>
               <button className="cd-btn-outline" onClick={() => setShowForm(true)}>Talk to Advisor</button>
            </div>
         </div>
      </section>

      {/* Sticky Bottom CTA - same across all mentorship courses */}
      <div className="ai-sticky-bar" role="dialog" aria-label="Promo">
        <div className="ai-left">
          <span className="ai-emoji">🎓</span>
          <div className="ai-text">30% Scholarship closing in just 2 days.</div>
          <br />
          <div className="ai-countdown">Batch closing in &nbsp;<Countdown targetOffsetHours={48} /></div>
        </div>
        <div className="ai-actions">
          <button className="ai-cta ai-cta-primary" onClick={() => setShowForm(true)}>Enroll in {data.title}</button>
        </div>
      </div>

      {showForm && <MentorshipForm isPopup onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default MentorshipCourseDetails;
