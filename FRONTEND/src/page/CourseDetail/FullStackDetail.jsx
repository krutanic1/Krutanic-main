import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

import { fullStackData } from "../../data/fullStackCourseData";
import "./course-detail.css";
import MentorshipForm from "../MentorshipForm";

import sachin from "../../assets/mentors/sachin.jpg";
import certificate1 from "../../assets/certificates/c/internship.jpg"; 
import certificate3 from "../../assets/certificates/c/training.jpg";

const FullStackDetail = () => {
  const navigate = useNavigate();
  const data = fullStackData;
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cd-page">
      <Helmet>
        <title>{data.title} - Krutanic</title>
        <meta name="description" content={data.subHeadline} />
      </Helmet>

      {showForm && <MentorshipForm setShowForm={setShowForm} />}

      {/* 1. HERO SECTION */}
      <section className="cd-hero">
        <div className="cd-container">
          <div className="cd-split-layout">
            <div className="cd-hero-left" data-aos="fade-right">
              <span className="cd-eyebrow">Full Stack Web Development</span>
              <h1 className="cd-hero-title">Production-Ready Engineer in 12 Weeks</h1>
              <p className="mb-10 text-xl max-w-xl text-[var(--muted)]">
                {data.subHeadline}
              </p>
              
              <div className="flex gap-4 cd-hero-ctas">
                <button className="cd-btn cd-btn--primary" onClick={() => setShowForm(true)}>
                  Apply for Next Cohort
                </button>
                <button className="cd-btn cd-btn--outline" onClick={() => setShowForm(true)}>
                  Book Free Call
                </button>
              </div>
            </div>
            
            <div className="cd-hero-right" data-aos="fade-up">
              <div className="cd-hero-stats-card">
                <div className="cd-hero-stat-item">
                  <h4>87%</h4>
                  <p>Land tech jobs within 6 weeks of graduation</p>
                </div>
                <div className="cd-hero-stat-item">
                  <h4>15+</h4>
                  <p>Real-world projects built and deployed</p>
                </div>
                <div className="cd-hero-stat-item">
                  <h4>4.7/5</h4>
                  <p>Average rating from 2,298 successful learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM / SOLUTION (Why this program) */}
      <section className="cd-section cd-section--alt">
        <div className="cd-container">
          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up">
            <span className="cd-eyebrow">The Mentorship Difference</span>
            <h2 className="cd-section-title">Escape Tutorial Hell.</h2>
            <p>
              Watching tutorials won't make you job-ready. Companies hire developers who can build, deploy, and scale real applications from day one. 
            </p>
          </div>
          
          <div className="cd-diff-grid" data-aos="fade-up">
            <div className="cd-diff-card">
              <div className="cd-diff-icon">🎯</div>
              <h3>Structured Curriculum</h3>
              <p>No more guessing what to learn next. Follow a clear path from basic HTML to complex microservices architecture.</p>
            </div>
            <div className="cd-diff-card">
              <div className="cd-diff-icon">💻</div>
              <h3>Live Code Reviews</h3>
              <p>Senior engineers review your code line-by-line, teaching you how to write clean, production-grade logic.</p>
            </div>
            <div className="cd-diff-card">
              <div className="cd-diff-icon">🚀</div>
              <h3>Interview Readiness</h3>
              <p>Mock interviews, resume optimization, and GitHub profile polish before you ever speak to a recruiter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM */}
      <section className="cd-section">
        <div className="cd-container">
          <div className="cd-split-layout">
            <div className="cd-split-left-sticky" data-aos="fade-right">
              <span className="cd-eyebrow">Curriculum Roadmap</span>
              <h2 className="cd-section-title">Your 12-Week Journey.</h2>
              <p className="mb-6">Intensive, project-based learning. Requires 30-40 hours per week of dedicated effort to master the modern web.</p>
              
              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[var(--border)]">
                <h4 className="font-bold mb-2">Working Professional?</h4>
                <p className="text-[15px] m-0">We offer an 18-week extended track option designed specifically for those with full-time jobs.</p>
              </div>
            </div>
            
            <div className="cd-module-list" data-aos="fade-up">
              {data.curriculum.map((mod, i) => (
                <div key={i} className="cd-module-card">
                  <div className="cd-module-left">
                    <span className="cd-module-tag">{mod.weeks}</span>
                    <div className="cd-module-line"></div>
                  </div>
                  <div className="cd-module-right">
                    <div className="cd-module-header">
                      <h3 className="cd-module-title">{mod.title}</h3>
                      <span className="cd-module-difficulty">{mod.difficulty}</span>
                    </div>
                    <div className="cd-module-content">
                      <p>{mod.what}</p>
                      <h5>Projects Built</h5>
                      <p className="text-[15px]">{mod.projects.join(", ")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TECH STACK */}
      <section className="cd-section cd-section--alt">
        <div className="cd-container">
          <div className="text-center" data-aos="fade-up">
            <span className="cd-eyebrow">Tech Stack</span>
            <h2 className="cd-section-title">The Modern MERN Ecosystem.</h2>
          </div>
          
          <div className="cd-tech-grid" data-aos="fade-up">
            {data.ecosystems.map((eco, i) => (
              <div key={i} className="cd-tech-card">
                <h3>{eco.category.split(" (")[0]}</h3>
                <p>{eco.why}</p>
                <span className="cd-tech-mono">{eco.tools}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO PROJECTS */}
      <section className="cd-section">
        <div className="cd-container">
          <div className="text-center" data-aos="fade-up">
            <span className="cd-eyebrow">Portfolio</span>
            <h2 className="cd-section-title">Build to get hired.</h2>
          </div>
          
          <div className="cd-projects-grid" data-aos="fade-up">
            {data.projects.slice(0, 2).map((proj, i) => (
              <div key={i} className="cd-project-card">
                <div className="cd-project-visual">
                  <h3>{proj.title.split(" ")[0]}</h3>
                </div>
                <div className="cd-project-info">
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  <div className="cd-project-tags">
                    <span className="cd-project-tag">React</span>
                    <span className="cd-project-tag">Node.js</span>
                    <span className="cd-project-tag">MongoDB</span>
                    <span className="cd-project-tag">Tailwind</span>
                  </div>
                  <div className="cd-project-hiring">
                    <p><strong>Hiring Context:</strong> {proj.hiring_context}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MENTORS */}
      <section className="cd-section cd-section--alt">
        <div className="cd-container">
          <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
            <span className="cd-eyebrow">Expert Guidance</span>
            <h2 className="cd-section-title">Learn from real engineers.</h2>
            <p>Our mentors have built systems at scale and know exactly what top-tier tech companies look for in candidates.</p>
          </div>
            
          <div className="cd-mentors-grid" data-aos="fade-up">
            {data.mentors.map((mentor, i) => (
              <div key={i} className="cd-mentor-card">
                <img src={sachin} alt={mentor.name} className="cd-mentor-img"/>
                <div className="cd-mentor-info">
                  <h3>{mentor.name}</h3>
                  <div className="cd-mentor-role">{mentor.role}</div>
                  <p>{mentor.background}</p>
                  <div className="cd-mentor-quote">"{mentor.testimonial}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CAREER SUPPORT & CERTIFICATES */}
      <section className="cd-section">
        <div className="cd-container">
          <div className="cd-split-layout" data-aos="fade-up">
            <div>
              <span className="cd-eyebrow">Outcomes</span>
              <h2 className="cd-section-title">Placement Support & Guarantees.</h2>
              <p className="mb-6">We don't sell fake "100% job guarantees". We provide rigorous placement support, mock interviews, and direct introductions to 100+ hiring partners.</p>
              
              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-[var(--border)] mb-8">
                <h4 className="font-bold mb-2">50% Tuition Refund Policy</h4>
                <p className="text-[15px] m-0">If you successfully complete the program and don't receive a job offer within 3 months, we refund 50% of your tuition.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[15px] font-medium text-[var(--text)]">
                <div className="flex gap-2"><span>✓</span> Resume Optimization</div>
                <div className="flex gap-2"><span>✓</span> GitHub Profile Polish</div>
                <div className="flex gap-2"><span>✓</span> Mock Interviews</div>
                <div className="flex gap-2"><span>✓</span> Job Board Access</div>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <img src={certificate1} alt="Internship Certificate" className="w-1/2 rounded-xl border border-[var(--border)] shadow-[var(--shadow)]" />
              <img src={certificate3} alt="Training Certificate" className="w-1/2 rounded-xl border border-[var(--border)] shadow-[var(--shadow)] translate-y-12" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="cd-section cd-section--alt">
        <div className="cd-container">
          <div className="text-center" data-aos="fade-up">
            <span className="cd-eyebrow">Alumni</span>
            <h2 className="cd-section-title">Transformation stories.</h2>
          </div>
          
          <div className="cd-test-grid" data-aos="fade-up">
            {data.testimonials.map((test, i) => (
              <div key={i} className="cd-test-card">
                <p>"{test.quote}"</p>
                <div className="cd-test-author">
                  <img src={test.image} alt={test.author}/>
                  <div>
                    <h4>{test.author}</h4>
                    <span>{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="cd-cta-footer">
        <div className="cd-container" data-aos="zoom-in">
          <h2>Ready to launch your engineering career?</h2>
          <p>Join the next cohort starting soon. Limited seats available to ensure personalized mentorship.</p>
          
          <div className="flex justify-center gap-4">
            <button className="cd-btn cd-btn--primary" onClick={() => setShowForm(true)}>
              Enroll in Next Cohort
            </button>
            <button className="cd-btn cd-btn--outline" onClick={() => setShowForm(true)}>
              Book Free Counseling Call
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FullStackDetail;
