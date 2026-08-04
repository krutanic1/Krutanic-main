import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from "../assets/LOGO3.png";
import Getintouch from "../Components/Getintouch";
import ClientsCarousel from "../Components/our_alumni2";
import "../style/AboutUs.css";

const stats = [
  { value: "10,000+", label: "Students Trained" },
  { value: "170+",    label: "Global Mentors" },
  { value: "500+",    label: "Hiring Partners" },
  { value: "95%",     label: "Placement Rate" },
];

const pillars = [
  { icon: "fa fa-graduation-cap", num: "01", title: "Expert Mentorship",    desc: "Learn directly from industry professionals with 10+ years of hands-on experience at top companies." },
  { icon: "fa fa-laptop",         num: "02", title: "Hands-on Projects",    desc: "Build real-world projects that go straight into your portfolio and impress hiring managers." },
  { icon: "fa fa-briefcase",      num: "03", title: "Placement Support",    desc: "Dedicated career assistance — from resume building to mock interviews and job referrals." },
  { icon: "fa fa-map",            num: "04", title: "Flexible Learning",    desc: "Study at your own pace with live classes, recorded sessions, and round-the-clock mentor access." },
];

const values = [
  { icon: "fa fa-lightbulb-o", title: "Outcome-Driven", desc: "We don't just teach theory. Every module is designed with one goal: making you highly employable." },
  { icon: "fa fa-users", title: "Community First", desc: "Learning is better together. We foster a vibrant community of peers, alumni, and industry leaders." },
  { icon: "fa fa-rocket", title: "Relentless Innovation", desc: "Tech moves fast, and so do we. Our curriculum is constantly updated to match current industry demands." },
];

const timeline = [
  { year: "2024", title: "The Foundation", desc: "Krutanic was born with a mission to bridge the gap between academic education and industry expectations." },
  { year: "1000+ Learners", title: "Early Adoption", desc: "Within months, we reached our first major milestone, placing students in top-tier product and service companies." },
  { year: "500+ Partners", title: "Corporate Trust", desc: "We established strong hiring partnerships, ensuring our graduates get priority access to premier job roles." },
  { year: "The Future", title: "Global Expansion", desc: "Scaling our tech ecosystem to empower the next million learners across borders with cutting-edge AI integration." },
];

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 40, easing: "ease-out-cubic" });
  }, []);

  return (
    <div id="au-page">

      {/* ─── HERO ─── */}
      <section className="relative w-full bg-white py-20 lg:py-28 overflow-hidden font-inter border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column */}
            <div className="flex flex-col items-start space-y-6" data-aos="fade-right">
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-gray-500">
                About Us
              </span>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                Empowering students and professionals to become <span className="text-blue-600">job-ready.</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                We bridge the gap between academic theory and industry demands. Gain the skills, mentorship, and real-world experience you need to launch and accelerate your tech career.
              </p>
              
              <div className="pt-4">
                <Link to="/mentorship" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors shadow-sm">
                  Explore Programs
                  <i className="fa fa-arrow-right ml-2" />
                </Link>
              </div>
              
              {/* Proof Stats */}
              <div className="flex items-center gap-10 pt-8 mt-4 border-t border-gray-100 w-full">
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Hiring Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">10,000+</div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Students Trained</div>
                </div>
              </div>
            </div>

            {/* Right Column (Benefits) */}
            <div className="flex flex-col space-y-4" data-aos="fade-left" data-aos-delay="100">
              
              {/* Benefit 1 */}
              <div className="flex gap-5 p-6 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="mt-1 flex-shrink-0 text-gray-900">
                  <i className="fa fa-graduation-cap text-xl" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-1.5">Industry-Leading Curriculum</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Learn from specialized curriculums designed directly by architects and leaders in modern tech.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-5 p-6 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="mt-1 flex-shrink-0 text-gray-900">
                  <i className="fa fa-laptop text-xl" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-1.5">Hands-On Experience</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Deploy real-world projects in our integrated cloud sandboxes with instant feedback loops.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-5 p-6 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="mt-1 flex-shrink-0 text-gray-900">
                  <i className="fa fa-line-chart text-xl" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-1.5">Personalized Placement</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Get end-to-end placement guidance and portfolio optimization tailored to your career trajectory.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div className="au-stats-row">
        {stats.map((s, i) => (
          <div className="au-stat-item" key={i} data-aos="fade-up" data-aos-delay={i * 70}>
            <span className="au-stat-val">{s.value}</span>
            <span className="au-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ─── LOGO WALL (ALUMNI COMPANIES) ─── */}
      <section className="au-logowall">
        <div className="au-wrap">
          <div data-aos="fade-up">
            <h2 className="au-section-h2">Where Our Alumni Work</h2>
            <p className="text-center">Join 10,000+ professionals placed at top global companies.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <ClientsCarousel />
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section className="au-section au-values">
        <div className="au-wrap">
          <div className="au-section-head" data-aos="fade-up">
            <p className="au-kicker"><i className="fa fa-heart" /> Our DNA</p>
            <h2 className="au-section-h2">The Values That Drive Us</h2>
            <p>Everything we do is built on a foundation of quality, integrity, and a relentless focus on student outcomes.</p>
          </div>
          <div className="au-values-grid">
            {values.map((v, i) => (
              <div className="au-value-card" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="au-value-icon"><i className={v.icon} /></div>
                <h3 className="au-value-title">{v.title}</h3>
                <p className="au-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="au-section au-mission">
        <div className="au-wrap">
          <div className="au-mission-grid">
            <div data-aos="fade-right" style={{ position: 'relative' }}>
              <div className="au-mission-left-label">THE MISSION</div>
              <p className="au-kicker"><i className="fa fa-flag" /> Our Mission</p>
              <h2 className="au-section-h2">
                Redefining How<br />
                India <span className="au-highlight-orange">Upskills</span>
              </h2>
              <div className="au-rule-orange" />
            </div>
            <div data-aos="fade-left">
              <div className="au-mission-text">
                <p>
                  We believe quality education should never be a barrier to opportunity.
                  Krutanic bridges the gap by merging academic rigour with practical training,
                  expert mentorship, and a curriculum that delivers real results.
                </p>
                <p>
                  Our commitment goes beyond teaching skills — we foster critical thinking,
                  problem-solving ability, and professional confidence to help every learner
                  thrive in today's fast-moving digital economy.
                </p>
              </div>
              <div className="au-mission-highlight-box">
                <p>
                  "From our first cohort to 10,000+ alumni placed across 500+ companies
                  — every step has been driven by one belief: education changes lives."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="au-timeline-section">
        <div className="au-wrap">
          <div className="au-section-head au-section-head-dark" data-aos="fade-up">
            <p className="au-kicker"><i className="fa fa-history" /> Our Journey</p>
            <h2 className="au-section-h2">Milestones of Impact</h2>
            <p>A look back at how we've grown from an idea to a leading EdTech platform.</p>
          </div>
          <div className="au-timeline-container">
            {timeline.map((item, i) => (
              <div className="au-timeline-item" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="au-timeline-dot" />
                <div className="au-timeline-year">{item.year}</div>
                <div className="au-timeline-title">{item.title}</div>
                <div className="au-timeline-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPROACH ─── */}
      <section className="au-section au-pillars-section" style={{ background: '#0a1628' }}>
        <div className="au-wrap">
          <div className="au-section-head au-section-head-dark" data-aos="fade-up">
            <p className="au-kicker"><i className="fa fa-check-square-o" /> The Ecosystem</p>
            <h2 className="au-section-h2">
              What Makes Us <span className="au-highlight-orange">Different</span>
            </h2>
            <p>Our proprietary learning methodology combines human mentorship with project-based learning.</p>
          </div>
          <div className="au-pillars-grid">
            {pillars.map((p, i) => (
              <div className="au-pillar-card" key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="au-pillar-icon-wrap"><i className={p.icon} /></div>
                <span className="au-pillar-num">{p.num}</span>
                <h3 className="au-pillar-title">{p.title}</h3>
                <p className="au-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY / TESTIMONIAL ─── */}
      <section className="au-section au-story-section">
        <div className="au-wrap">
          <div className="au-story-grid">
            <div data-aos="fade-right">
              <p className="au-kicker"><i className="fa fa-quote-left" /> The Impact</p>
              <h2 className="au-section-h2">
                Real Outcomes for <br /><span className="au-highlight-orange">Real People</span>
              </h2>
              <div className="au-rule-orange" />
              <div className="au-story-body">
                <p>
                  The true measure of our success isn't in the number of courses we offer,
                  but in the lives we help transform. From career switchers to recent graduates,
                  Krutanic provides the launchpad for tech careers.
                </p>
                <p>
                  With a <strong>95% placement rate</strong> and <strong>average salary hikes of 65%</strong>,
                  our alumni are now leading teams, shipping global products, and shaping the future of technology.
                </p>
              </div>
            </div>

            <div className="au-story-right" data-aos="fade-left" data-aos-delay="100">
              <div className="au-quote-card">
                <div className="au-quote-mark">"</div>
                <p className="au-quote-text">
                  "Krutanic didn't just teach me coding; they taught me how to think like an engineer. 
                  The mentorship and real-world projects were the exact bridge I needed to land my dream role."
                </p>
                <span className="au-quote-attr">— Rahul M., Placed at Amazon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="au-cta-section" data-aos="fade-up">
        <div className="au-wrap">
          <h2 className="au-cta-h2">Ready to Accelerate Your Career?</h2>
          <p className="au-cta-desc">
            Join the elite network of tech professionals. Limited spots available in our upcoming cohort.
          </p>
          <Link to="/mentorship" className="au-cta-button-light">
            Apply Now <i className="fa fa-arrow-right" />
          </Link>
        </div>
      </section>

      {/* ─── GET IN TOUCH ─── */}
      <div className="au-getintouch">
        <Getintouch />
      </div>
    </div>
  );
};

export default AboutUs;
