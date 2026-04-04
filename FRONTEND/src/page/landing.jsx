import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import { color } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
// import { FaHandshake } from "react-icons/fa";
import { FaLaptopCode, FaBriefcase, FaClock, FaGlobe, FaCheckCircle, FaStar, FaUserAlt, FaArrowRight, FaChartLine, FaCertificate, FaShieldAlt, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

import ShuffleHero from "../Components/ShuffleHero";
import ClientsCarousel from "../Components/our_alumni2";
import Testimonial from "../Components/testimonial";
import Popularcourse from "../Components/popularcourse";

// import whychoose from "../assets/whatmakedifferent.png";
import specialization from "../../krutanic/images/publicspeech.jpg";
import whyimg from "../assets/whychoose.jpg";
import corporate from "../../krutanic/images/asdfg.jpg";
import comingsoon from "../assets/comingsoon.jpg";
import internshipCertificate from "../assets/certificates/c/internship.jpg";
import trainingCertificate from "../assets/certificates/c/training.jpg";

// import roadmap from "../assets/roadmap.png";
import AdvanceCounses from "../Components/advancecourses";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 40,
      anchorPlacement: "top-bottom",
      easing: "ease-out-cubic",
    });
  }, []);

  const corporatePoints = [
    {
      title: "Empowerment",
      text: "Structured programs that strengthen professional abilities and create new opportunities for advancement.",
    },
    {
      title: "Innovative Learning",
      text: "Real-time training with the latest technologies for hands-on, impactful learning experiences.",
    },
    {
      title: "Collaborative Networking",
      text: "Engage in shared projects and interactive sessions that foster meaningful industry connections.",
    },
    {
      title: "Creative Solutions",
      text: "Encourage strategic problem-solving and innovation to meet modern business challenges.",
    },
  ];

  const landingCredentialHighlights = [
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

  const landingCredentialStats = [
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
      accent: "orange",
    },
  ];

  return (
    <div id="landingpage" className="landing-neo">
      {/* section hero */}
      <div className="hero">
        <ShuffleHero />
      </div>
      {/* section hero end */}

      {/* section aboutus */}
      <div className="aboutus aboutus-vibrant">
        <div className="about1stdiv">
          <div className="text">
            <span className="about-kicker" data-aos="fade-right">About Us</span>
            <h1 data-aos="zoom-in">The Algorithmic <span>Path to Mastery.</span></h1>
            <p>
              {/* Krutanic is your trusted partner for career growth, offering advanced tech courses designed to prepare you for the fast-paced job market. We focus on delivering industry-relevant skills through expert guidance, ensuring that you gain both theoretical knowledge and practical experience. Each course is backed by hands-on projects, allowing you to work on real-world challenges that employers value. Whether you're starting your career or looking to upskill, our programs in Web Development, Data Science, and Digital Marketing are tailored to help you succeed. Join Krutanic today and take the next step toward achieving your career goals. */}
              Krutanic is dedicated to empowering your career growth with industry-leading tech courses designed for today’s fast-evolving job market. Learn from experienced industry experts who provide expert guidance and hands-on training through real-world projects. Gain personalized placement support and mentorship as you advance, whether you’re starting fresh or upskilling. Join Krutanic and explore courses that boost your skills and open doors to new career opportunities.

            </p>
            <Link to="/AboutUs">
              <button className="btnblack">LEARN MORE</button>{" "}
            </Link>
            <div className="number">
              <h2 data-aos="fade-right">
                <span className="fa fa-globe"></span> 250+ Hiring Partners
              </h2>
              <h2 data-aos="fade-right">
                <span className="fa fa-globe"></span> 170+ Global Mentors
              </h2>
            </div>
          </div>
          <div className="box">
            <div data-aos="zoom-in" data-aos-delay="500">
              <span className="fa fa-graduation-cap"></span>
              <h3>Explore Industry-Leading Courses</h3>
              <p>Deep-dive into specialized curriculums designed by architects of modern data stacks.</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="1000">
              <span className="fa fa-briefcase"></span>
              <h3>Learn from Experienced Experts</h3>
              <p>Direct mentorship from senior practitioners currently solving complex global data challenges.</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="500">
              <span className="fa fa-laptop"></span>
              <h3>Gain Hands-On Experience</h3>
              <p>Deploy real-world projects in our integrated cloud sandboxes with instant feedback loops.</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="1000">
              <span className="fa fa-line-chart"></span>
              <h3>Get Personalized Support</h3>
              <p>End-to-end placement guidance and portfolio optimization tailored to your career trajectory.</p>
            </div>
          </div>
        </div>
        <div className="boxfour">
          <div data-aos="fade-up" data-aos-duration="200" data-aos-delay="200"  >
            <span className="fa fa-book text-blue-700"></span>
            <h2>Courses for All Levels</h2>
          </div>
          <div data-aos="fade-up" data-aos-duration="400" data-aos-delay="600"  >
            <span className="fa fa-flag text-yellow-500"></span>
            <h2>Success Starts Here</h2>
          </div>
          <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="800" >
            <span className="fa fa-globe text-green-700"></span>
            <h2>Flexible Learning</h2>
          </div>
          <div data-aos="fade-up" data-aos-duration="800" data-aos-delay="1200"  >
            <span className="fa fa-key text-purple-700"></span>
            <h2>Unlock Potential</h2>
          </div>
        </div>
      </div>
      {/* section aboutus end*/}

      {/* section learning centre */}
      <div className="learning-centre" data-aos="fade-up">
        <div className="learning-centre-content">
          <p className="eyebrow">Find Us In Your Neighborhood</p>
          <h2>
            Build Job-Ready Skills at our
            <span> Krutanic Learning Centre</span>
          </h2>
          <ul>
            <li>
              <span className="fa fa-users" aria-hidden="true"></span>
              100% classroom-focused guided learning experience
            </li>
            <li>
              <span className="fa fa-sitemap" aria-hidden="true"></span>
              Advance your career in AI, Data Science, and Full Stack Development
            </li>
            <li>
              <span className="fa fa-rocket" aria-hidden="true"></span>
              Career guidance, mock interviews, and hands-on projects
            </li>
          </ul>
          <div className="learning-centre-actions">
            <Link to="/ContactUs" className="btn-outline-centre">Explore centres</Link>
            <Link to="/ContactUs" className="btn-primary-centre">Request a callback</Link>
          </div>
        </div>
        <div className="learning-centre-image" data-aos="zoom-in" data-aos-delay="250">
          <img src={corporate} alt="Krutanic learning centre support" />
        </div>
      </div>
      {/* section learning centre end */}

      {/* section certifications */}
      <div className="landing-certifications" data-aos="fade-up">
        <div className="landing-cert-grid">
          <div className="landing-cert-left">
            <p className="landing-cert-chip">Global Standards</p>
            <h2>
              Globally <span>Recognized</span> Certification
            </h2>
            <span className="landing-cert-bar" aria-hidden="true" />

            <div className="landing-cert-feature-wrap">
              {landingCredentialHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="landing-cert-feature">
                    <Icon className="landing-cert-feature-icon" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="landing-cert-stat-wrap">
              {landingCredentialStats.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className={`landing-cert-stat ${item.accent}`}>
                    <Icon className="landing-cert-stat-icon" />
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                );
              })}
            </div>

            <div className="landing-cert-heading-row">
              <div>
                <h4>Your Credentials</h4>
                <p>Industry-standard validation</p>
              </div>
              <a href={internshipCertificate} target="_blank" rel="noreferrer">
                Preview <FaExternalLinkAlt />
              </a>
            </div>

            <Link to="/Mentorship" className="landing-cert-cta">Get Certified Now</Link>
          </div>

          <div className="landing-cert-images">
            <article className="landing-cert-card">
              <img src={internshipCertificate} alt="Certificate of internship" />
              <div className="landing-cert-card-footer">
                <span>Certificate of Internship</span>
                <a href={internshipCertificate} download>
                  <FaDownload />
                </a>
              </div>
            </article>

            <article className="landing-cert-card">
              <img src={trainingCertificate} alt="Training completion certificate" />
              <div className="landing-cert-card-footer">
                <span>Training Completion</span>
                <a href={trainingCertificate} download>
                  <FaDownload />
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
      {/* section certifications end */}


      {/* <div className="roadmap">
          <div>
          <h1>| Roadmap to your Success</h1>
            <img src={roadmap} alt="Road Map" />
          </div>
        </div> */}

      {/* provide section */}

      <div className="providesection provide-vibrant">
        <div className="provide">
          <div className="provide-head" data-aos="fade-up">
            <span className="provide-kicker">The Algorithmic Advantage</span>
            <h2 className="provide-title">The Algorithmic Advantage</h2>
            <p>
              Our platform is engineered to bridge the gap between academic theory and high-stakes industrial reality.
              Experience the Krutanic ecosystem.
            </p>
          </div>

          <div className="providecards">
            <article data-aos="fade-up" className="provide1">
              <span className="fa fa-graduation-cap text-green-500"></span>
              <h2>Expert Mentorship</h2>
              <p>Learn directly from lead scientists and engineers currently working on global data problems.</p>
              <a href="/mentors" className="provide-link">Meet Our Mentors <i className="fa fa-arrow-right" /></a>
            </article>

            <article data-aos="fade-up" className="provide1 provide1--accent">
              <span className="fa fa-map text-orange-500"></span>
              <h2>Customized Paths</h2>
              <p>Every career trajectory is unique. Our adaptive curriculum adjusts to your specific goals and pace.</p>
            </article>

            <article data-aos="fade-up" className="provide1">
              <span className="fa fa-briefcase text-blue-700"></span>
              <h2>Industrial Training</h2>
              <p>Work on live projects following MNC development standards and production workflows.</p>
            </article>

            <article data-aos="fade-up" className="provide1 provide1--success">
              <span className="fa fa-trophy text-red-500"></span>
              <h2>Proven Success</h2>
              <p>Our alumni do not just get jobs; they lead teams across high-growth technology organizations.</p>
              <div className="provide-badges" aria-hidden="true">
                <span>AI</span>
                <span>DS</span>
                <span>ML</span>
                <span>BI</span>
              </div>
            </article>
          </div>

          <div className="provide-cta" data-aos="fade-up">
            <div className="provide-cta-copy">
              <h3 className="provide-cta-title">Ready to begin your data journey?</h3>
              <p className="provide-cta-desc">Join the next cohort. Limited spots are available for the premium mentorship path.</p>
            </div>
            <Link to="/Advance" className="provide-cta-btn">Claim Your Spot</Link>
          </div>
        </div>
      </div>

      {/* section provide end*/}

      {/* section alumni work */}

      <div className="workat">
        <div className="alumni">
          <h1 data-aos="zoom-in">| Our alumni at top Brands</h1>
          <p>
            Their success stories inspire current students to aim for global
            excellence in their careers.
          </p>
          <ClientsCarousel />
        </div>
      </div>

      {/* section alumni work end */}

      {/* section specialization */}

      <div className="specialization">
        <div>
          <h1 data-aos="zoom-in">| Our specialization</h1>
          <p>
            Building Expertise and Confidence with a Complete Online Certification and Mentorship Experience
          </p>
          <div className="specializationiner">
            <div data-aos="fade-up-right" className="img">
              <img src={specialization} alt="Bangalore Internship companies for students " />
            </div>
            <div className="textdiv">
              <div data-aos="fade-left" data-aos-duration="400" data-aos-delay="400" className="specialtext">
                <span className="fa fa-check-square-o"></span>
                <p>
                  {" "}
                  We cover all aspects, from basic concepts to advanced techniques, ensuring you gain comprehensive tech skills.
                </p>
              </div>
              <div data-aos="fade-left" data-aos-duration="600" data-aos-delay="600" className="specialtext">
                <span className="fa fa-search"></span>
                <p>
                  Your learning journey is closely monitored through regular assessments to guarantee you fully understand and retain the digital marketing concepts taught.
                </p>
              </div>
              <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="800" className="specialtext">
                <span className="fa fa-star"></span>
                <p>
                  Each program is structured to meet individual needs, ensuring maximum growth and success in professional training.
                </p>
              </div>
              <div data-aos="fade-left" data-aos-duration="1200" data-aos-delay="1200" className="specialtext">
                <span className="fa fa-gear"></span>
                <p>
                  Our personalized approach empowers you to progress at your own pace, delivering a comprehensive and effective online certification experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* section specialization end */}

      {/* section Popular course */}

      <div className="popularcourse">
        <h1 data-aos="zoom-in">| Popular Courses</h1>
        <Popularcourse />
      </div>

      {/* section Popular course end */}

      {/* advance courses */}
      <div className="popularcourse" >
        <AdvanceCounses />
      </div>
      {/* advance courses end  */}



      {/* section mission vission  */}

      <div className="misvis">
        <div className="mission">
          <h1 data-aos="zoom-in">| OUR MISSION</h1>
          <ul>
            <li> Expert faculty with real-world experience</li>
            <li>Comprehensive support for students</li>
            <li>Interactive learning approach</li>
            <li>Proven track record of success</li>
          </ul>
        </div>
        <div className="vission">
          <h1 data-aos="zoom-in">| OUR VISION</h1>
          <p>
            Our vision is to be the leading provider of special education camps
            for programming, empowering students to achieve their full
            potential.
          </p>
          <Link to="/AboutUs">
            <button className="btnwhite">LEARN MORE</button>
          </Link>
        </div>
      </div>

      {/* section mission vission end  */}

      {/* section testimonial */}

      <div className="testimonial">
        <h1 className="feedback-heading" data-aos="fade-up">Our Mentees' Feedback</h1>
        <Testimonial />
      </div>

      {/* section testimonial end */}

      {/* section Corporate Solution */}

      {/* Corporate Solutions Modern UI */}
      <section id="corporate-solutions" className="corporate-redesign">
        <div className="corporate-wrap">
          <header className="corporate-head" data-aos="fade-up">
            <h2>| Corporate Solutions</h2>
            <p>
              Krutanic builds meaningful partnerships to deliver tailored training, practical projects,
              and advanced tools that accelerate skill development and drive lasting success.
            </p>
          </header>

          <div className="corporate-grid">
            <div className="corporate-media" data-aos="fade-right" data-aos-duration="900">
              <img src={corporate} alt="Corporate training collaboration" />
            </div>

            <div className="corporate-list">
              {corporatePoints.map((item, index) => (
                <article
                  key={item.title}
                  className="corporate-item"
                  data-aos="fade-left"
                  data-aos-duration="600"
                  data-aos-delay={120 + index * 90}
                >
                  <span className="corporate-arrow" aria-hidden="true">→</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* section Our Partner */}

      <div className="workat">
        <div className="alumni">
          <h1 data-aos="zoom-in">| Our Hiring Partners</h1>
          <ClientsCarousel />
        </div>
      </div>

      {/* section Our Partner */}

      <div className="whitediv">
        {/* what makes us different */}

        {/* <div className="whatmakesusdifferent">
          <h1 data-aos="zoom-in">| What Makes Us Different ?</h1>
          <div className="whatmakesusdifferentdiv">
            <img src={whychoose} alt="img" />
          </div>
        </div> */}

        {/* what makes us different end */}


      </div>
    </div>
  );
};
export default HomePage;
