import React, { useEffect, useState, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from "react-router-dom";
// import { color } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
// import { FaHandshake } from "react-icons/fa";
import { FaLaptopCode, FaBriefcase, FaClock, FaGlobe, FaCheckCircle, FaStar, FaUserAlt, FaArrowRight, FaChartLine, FaCertificate, FaShieldAlt, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

import ShuffleHero from "../Components/ShuffleHero";
import CodeNestHero from "../Components/CodeNestHero";
import ClientsCarousel from "../Components/our_alumni2";
import Testimonial from "../Components/testimonial";
import Popularcourse from "../Components/popularcourse";

// import whychoose from "../assets/whatmakedifferent.png";
import specialization from "../../krutanic/images/publicspeech.jpg";
import whyimg from "../assets/whychoose.jpg";
import corporate from "../../krutanic/images/learning-centre.png";
import comingsoon from "../assets/comingsoon.jpg";
import internshipCertificate from "../assets/certificates/c/internship.jpg";
import trainingCertificate from "../assets/certificates/c/training.jpg";

// import roadmap from "../assets/roadmap.png";
import AdvanceCounses from "../Components/advancecourses";
import learningCentreHero from "../assets/learning-centre-hero-2.png";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, inView]);

  return <span ref={ref}>{count}</span>;
};

const HomePage = () => {
  const [showApplyPopup, setShowApplyPopup] = useState(false);

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
      <div className="w-full">
        {/* <ShuffleHero /> */}
        <CodeNestHero />
      </div>
      {/* section hero end */}

      {/* section aboutus */}
      <section className="relative w-full bg-white py-20 lg:py-28 overflow-hidden font-inter border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column */}
            <div className="flex flex-col items-start space-y-6" data-aos="fade-right">
              <div className="flex items-center">
                <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  About Us
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                Empowering students and professionals to become <span className="text-emerald-600">job-ready.</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                We bridge the gap between academic theory and industry demands. Gain the skills, mentorship, and real-world experience you need to launch and accelerate your tech career.
              </p>
              
              <div className="pt-4">
                <Link to="/mentorship" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm">
                  Explore Programs
                  <i className="fa fa-arrow-right ml-2" />
                </Link>
              </div>
              
              {/* Proof Stats */}
              <div className="flex items-center gap-10 pt-8 mt-4 border-t border-gray-100 w-full">
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">
                    <AnimatedNumber value={500} />+
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Hiring Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">
                    <AnimatedNumber value={170} />+
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">Global Mentors</div>
                </div>
              </div>
            </div>

            {/* Right Column (Benefits) */}
            <div className="flex flex-col space-y-4" data-aos="fade-left" data-aos-delay="100">
              
              {/* Benefit 1 */}
              <div className="flex gap-5 p-6 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex-shrink-0 text-emerald-600 bg-emerald-50 w-11 h-11 flex items-center justify-center rounded-lg">
                  <i className="fa fa-graduation-cap text-lg" />
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
                <div className="flex-shrink-0 text-emerald-600 bg-emerald-50 w-11 h-11 flex items-center justify-center rounded-lg">
                  <i className="fa fa-laptop text-lg" />
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
                <div className="flex-shrink-0 text-emerald-600 bg-emerald-50 w-11 h-11 flex items-center justify-center rounded-lg">
                  <i className="fa fa-line-chart text-lg" />
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
      {/* section aboutus end*/}

      {/* section learning centre */}
      <section className="relative w-full bg-[#faf9f6] py-20 lg:py-28 overflow-hidden font-inter border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col items-start" data-aos="fade-right">
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-emerald-600 mb-6">
                Find Us In Your Neighborhood
              </span>
              
              <h2 className="text-3xl lg:text-[42px] font-extrabold text-gray-900 leading-[1.2] tracking-tight mb-6">
                Become Job-Ready in <span className="text-emerald-500">AI, Full Stack, Data Science & Cloud</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Learn through live projects, classroom mentoring, internship exposure, and career support designed for students and professionals.
              </p>
              
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <i className="fa fa-users text-[10px]" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">100% classroom-focused guided learning experience</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <i className="fa fa-sitemap text-[10px]" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Advance your career with industry-relevant skills</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <i className="fa fa-rocket text-[10px]" />
                  </div>
                  <span className="text-[15px] font-semibold text-gray-800">Career guidance, mock interviews, and hands-on projects</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link to="/ContactUs" className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25">
                  Book Free Career Counseling
                </Link>
                <Link to="/ContactUs" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                  Explore Programs
                </Link>
              </div>
              
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Next cohort starts soon — Limited classroom seats
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-6 relative w-full mt-8 lg:mt-0" data-aos="fade-left" data-aos-delay="100">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100/50 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                <img 
                  src={learningCentreHero} 
                  alt="Krutanic Learning Centre" 
                  className="w-full h-[400px] sm:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badge */}
                {/* <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/20 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">Offline Learning Centre</span>
                </div> */}
                
                {/* Bottom Stat Pill */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 bg-white px-5 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                    <i className="fa fa-star text-lg" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900 leading-tight">100%</div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Guided Learning</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      {/* section learning centre end */}

      {/* section certifications */}
      <section className="relative w-full bg-[#f8f9fa] py-20 lg:py-28 overflow-hidden font-inter border-b border-gray-100">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-6 flex flex-col items-start" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-700">
                  Global Standards
                </span>
              </div>
              
              <div className="text-4xl lg:text-[44px] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-10">
                Globally <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400">Recognized</span><br /> Certification
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-5">
                {landingCredentialHighlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl transition-shadow duration-300">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-5">
                        <Icon className="text-xl" />
                      </div>
                      <div className="text-[17px] font-bold text-gray-900 mb-2">{item.title}</div>
                      <div className="text-[14px] text-gray-500 leading-relaxed font-medium">{item.text}</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-10">
                {landingCredentialStats.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-xl transition-shadow duration-300 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                        <Icon className="text-2xl" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-gray-900 leading-tight">{item.value}</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="w-full bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xl font-bold text-gray-900 mb-1">Your Credentials</div>
                  <div className="text-sm text-gray-500 font-medium">Industry-standard validation</div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto relative z-10">
                  <a href={internshipCertificate} target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition-colors group">
                    Preview <FaExternalLinkAlt className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <Link to="/Mentorship" className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                    Get Certified Now
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 pointer-events-none" />
              </div>
            </div>

            {/* Right Column: Certificates */}
            <div className="lg:col-span-6 relative mt-16 lg:mt-0" data-aos="fade-left" data-aos-delay="100">
              <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                
                {/* Back Certificate */}
                <div className="absolute top-4 sm:top-0 right-0 sm:right-4 w-[85%] transform rotate-6 hover:rotate-3 transition-transform duration-500">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-200">
                    <img 
                      src={trainingCertificate} 
                      alt="Training completion certificate" 
                      className="w-full h-auto rounded-lg border border-gray-100"
                    />
                  </div>
                </div>
                
                {/* Front Certificate */}
                <div className="absolute bottom-4 left-0 w-[90%] transform -rotate-3 hover:rotate-0 transition-transform duration-700 z-10">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] border border-gray-200">
                    <img 
                      src={internshipCertificate} 
                      alt="Certificate of internship" 
                      className="w-full h-auto rounded-lg border border-gray-100"
                    />
                  </div>
                  
                  {/* Floating Trust Badge */}
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 z-20 bg-white px-4 py-2.5 rounded-xl shadow-xl border border-gray-200 flex items-center gap-2.5 transform hover:-translate-y-1 transition-transform">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <i className="fa fa-shield text-[12px]" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-900 tracking-wider uppercase">Industry Validated</span>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </section>
      {/* section certifications end */}


      {/* <div className="roadmap">
          <div>
          <h1>| Roadmap to your Success</h1>
            <img src={roadmap} alt="Road Map" />
          </div>
        </div> */}

      {/* provide section (Minimal Editorial Redesign) */}
      <section className="relative bg-white py-24 lg:py-32 border-y border-gray-100 font-inter">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative">
            
            {/* Left Column - Copy & CTA */}
            <div className="flex flex-col items-start lg:sticky lg:top-32" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-green-500" />
                <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">Ecosystem Transformation</span>
              </div>
              
              <h2 className="text-4xl lg:text-[46px] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
                The <span className="text-green-600">Algorithmic</span> Advantage
              </h2>
              
              <p className="text-[17px] text-gray-600 leading-relaxed mb-10 max-w-lg">
                Our platform is engineered to bridge the gap between academic theory and high-stakes industrial reality. Experience a transformation designed to take you from learner to professional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-14">
                <button onClick={() => setShowApplyPopup(true)} className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-sm">
                  Claim Your Spot
                </button>
                <Link to="/Mentorship" className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-sm hover:border-gray-900 transition-colors">
                  Meet Our Mentors
                </Link>
              </div>
              
              {/* Micro-proof */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100 w-full">
                <div>
                  <div className="text-3xl font-black text-gray-900 mb-1">500+</div>
                  <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Hiring Partners</div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">AI</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">DS</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">ML</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">BI</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Core Domains</div>
                </div>
              </div>
            </div>

            {/* Right Column - Clean Vertical Stack */}
            <div className="relative w-full flex flex-col mt-8 lg:mt-0" data-aos="fade-left" data-aos-delay="100">
              <div className="space-y-12">
                
                {/* Panel 1 */}
                <div className="relative flex items-start gap-6 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors group-hover:bg-green-600 group-hover:text-white">
                    01
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Learn from working experts</h3>
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      Gain direct insights and mentorship from lead scientists and engineers actively solving global data challenges.
                    </p>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="relative flex items-start gap-6 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors group-hover:bg-green-600 group-hover:text-white">
                    02
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Follow a path tailored to goals</h3>
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      Adaptive curriculum adjusts to your specific trajectory and pace.
                    </p>
                  </div>
                </div>
                
                {/* Panel 3 */}
                <div className="relative flex items-start gap-6 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors group-hover:bg-green-600 group-hover:text-white">
                    03
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Build through production projects</h3>
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      Work on live initiatives following MNC development standards.
                    </p>
                  </div>
                </div>

                {/* Panel 4 */}
                <div className="relative flex items-start gap-6 group">
                  <div className="mt-1 w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors group-hover:bg-green-600 group-hover:text-white">
                    04
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Graduate with outcomes</h3>
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      Emerge with credibility and lead teams across high-growth organizations.
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </section>
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
      <section className="relative w-full bg-white py-24 lg:py-32 font-inter overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="mb-16 text-center max-w-3xl mx-auto" data-aos="fade-up">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[1px] w-8 bg-emerald-500" />
              <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Our Specialization</span>
              <div className="h-[1px] w-8 bg-emerald-500" />
            </div>
            <h2 className="text-3xl lg:text-[42px] font-extrabold text-gray-900 leading-[1.2] tracking-tight mb-6">
              Building Expertise & <span className="text-emerald-500">Confidence</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Experience a complete online certification and mentorship journey tailored for your professional success.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Image Anchor */}
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] group h-full" data-aos="fade-right">
              <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
              <img 
                src={specialization} 
                alt="Krutanic Specialization and Mentorship" 
                className="w-full h-full min-h-[500px] lg:min-h-[650px] object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 z-20 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 max-w-[260px] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm">
                    <i className="fa fa-certificate text-xl"></i>
                  </div>
                  <div className="text-3xl font-black text-gray-900">100%</div>
                </div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] leading-relaxed">
                  Certified Mentorship <br/> Experience
                </div>
              </div>
            </div>

            {/* Right Side Cards (Staggered Layout) */}
            <div className="flex flex-col gap-6 relative py-4">
              
              {/* Vertical connecting line for desktop */}
              <div className="hidden lg:block absolute left-6 top-10 bottom-10 w-[2px] bg-gray-100 z-0" />

              {/* Card 1 */}
              <div className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-emerald-100 transition-all duration-300 z-10" data-aos="fade-left" data-aos-delay="100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 sm:gap-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 flex-shrink-0 shadow-sm">
                    <span className="font-bold text-lg sm:text-xl font-mono">01</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[19px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">End-to-End Skill Building</h3>
                    <p className="text-[15px] text-gray-500 leading-relaxed">
                      We cover all aspects, from basic concepts to advanced techniques, ensuring you gain comprehensive, industry-ready tech skills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-emerald-100 transition-all duration-300 lg:ml-12 z-10" data-aos="fade-left" data-aos-delay="200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 sm:gap-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 flex-shrink-0 shadow-sm">
                    <span className="font-bold text-lg sm:text-xl font-mono">02</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[19px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">Guided Progress Tracking</h3>
                    <p className="text-[15px] text-gray-500 leading-relaxed">
                      Your learning journey is closely monitored through regular assessments to guarantee mastery and retention of critical concepts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-emerald-100 transition-all duration-300 z-10" data-aos="fade-left" data-aos-delay="300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 sm:gap-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 flex-shrink-0 shadow-sm">
                    <span className="font-bold text-lg sm:text-xl font-mono">03</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[19px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">Outcome-Focused Paths</h3>
                    <p className="text-[15px] text-gray-500 leading-relaxed">
                      Each program is meticulously structured to meet individual needs, ensuring maximum growth and success in professional training.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-emerald-100 transition-all duration-300 lg:ml-12 z-10" data-aos="fade-left" data-aos-delay="400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 sm:gap-6 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 flex-shrink-0 shadow-sm">
                    <span className="font-bold text-lg sm:text-xl font-mono">04</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[19px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">Personalized Journey</h3>
                    <p className="text-[15px] text-gray-500 leading-relaxed">
                      Our personalized approach empowers you to progress at your own pace, delivering a highly effective certification experience.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
      {/* section specialization end */}



      {/* advance courses */}
      <div className="popularcourse" >
        <AdvanceCounses />
      </div>
      {/* advance courses end  */}



      {/* section mission vission  */}
      <section className="relative w-full py-24 lg:py-40 bg-white font-inter border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left: Our Vision (Editorial Statement) */}
            <div className="lg:col-span-5 flex flex-col" data-aos="fade-right">
              {/* Minimal Label */}
              <div className="mb-10">
                <div className="h-[2px] w-12 bg-gray-900 mb-4" />
                <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Our Vision</span>
              </div>
              
              {/* Confident Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-8">
                The global benchmark for <span className="text-emerald-500">innovative</span> education.
              </h2>
              
              {/* Body Text */}
              <p className="text-[17px] text-gray-500 leading-relaxed mb-12 max-w-md font-medium">
                Our vision is to be the leading provider of specialized education programs, empowering students to break barriers, master programming, and achieve their full potential in the digital economy.
              </p>
              
              {/* Restrained CTA */}
              <div>
                <Link to="/AboutUs" className="inline-flex items-center gap-3 text-gray-900 font-bold text-sm tracking-wide uppercase group hover:text-emerald-600 transition-colors">
                  <span className="border-b border-gray-300 group-hover:border-emerald-600 pb-1 transition-colors">Discover Our Story</span>
                  <i className="fa fa-long-arrow-right transform group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Our Mission (Minimalist Content Panels) */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col" data-aos="fade-left" data-aos-delay="100">
              {/* Minimal Label */}
              <div className="mb-10 sm:hidden lg:block">
                <div className="h-[2px] w-12 bg-gray-200 mb-4" />
                <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase">Our Mission</span>
              </div>
              
              <div className="flex flex-col border-t border-gray-200 mt-4 lg:mt-0">
                {[
                  { num: "01", title: "Expert Faculty", desc: "Learn directly from industry veterans with extensive real-world engineering experience." },
                  { num: "02", title: "Comprehensive Support", desc: "End-to-end guidance providing personalized mentorship from enrollment to final placement." },
                  { num: "03", title: "Interactive Learning", desc: "Engage in collaborative problem-solving environments rooted in practical application." },
                  { num: "04", title: "Proven Track Record", desc: "Thousands of successful career transitions into top-tier global technology roles." },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-8 py-8 border-b border-gray-200 group">
                    <div className="text-[13px] font-bold text-gray-300 font-mono pt-1.5 group-hover:text-emerald-500 transition-colors">
                      {item.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[22px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                      <p className="text-[15px] text-gray-500 leading-relaxed max-w-md">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* section mission vission end  */}

      {/* section testimonial */}

      <div className="testimonial">
        <h1 className="feedback-heading" data-aos="fade-up">Our Mentees' Feedback</h1>
        <Testimonial />
      </div>

      {/* section testimonial end */}

      {/* section Corporate Solution */}

      {/* section Corporate Solution */}
      <section id="corporate-solutions" className="relative w-full py-24 lg:py-36 bg-[#faf9f6] font-inter border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Vision & Image */}
            <div className="lg:col-span-5 flex flex-col" data-aos="fade-right">
              <div className="mb-8">
                <div className="h-[2px] w-12 bg-emerald-500 mb-5" />
                <span className="text-gray-500 text-[11px] font-bold tracking-[0.2em] uppercase">Enterprise Partnerships</span>
              </div>
              
              <h2 className="text-4xl lg:text-[46px] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-8">
                Accelerate team capabilities with <span className="text-emerald-600">tailored learning</span>.
              </h2>
              
              <p className="text-[17px] text-gray-600 leading-relaxed font-medium mb-12">
                Krutanic builds meaningful partnerships to deliver practical projects, advanced tools, and specialized training that drive lasting enterprise success.
              </p>
              
              {/* Refined Image Treatment */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] group">
                <img 
                  src={corporate} 
                  alt="Corporate Training Collaboration" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gray-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              </div>
            </div>

            {/* Right Column: Structured Pillars */}
            <div className="lg:col-span-7 flex flex-col w-full mt-4 lg:mt-0" data-aos="fade-left" data-aos-delay="100">
              
              {/* Featured Pillar (01) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 lg:mb-10 group transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10">
                  <div className="text-sm font-bold text-gray-300 font-mono group-hover:text-emerald-500 transition-colors">01</div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight group-hover:text-emerald-600 transition-colors">
                      {corporatePoints[0].title}
                    </h3>
                    <p className="text-[16px] sm:text-[17px] text-gray-600 leading-relaxed font-medium">
                      {corporatePoints[0].text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Pillars (02, 03, 04) */}
              <div className="flex flex-col">
                {corporatePoints.slice(1).map((item, index) => (
                  <div key={item.title} className="flex flex-col sm:flex-row gap-6 sm:gap-10 py-8 border-t border-gray-200 group relative">
                    {/* Subtle left hover indicator */}
                    <div className="absolute left-[-24px] lg:left-[-32px] top-1/2 -translate-y-1/2 w-[3px] h-0 bg-emerald-500 group-hover:h-3/4 transition-all duration-300 ease-out hidden sm:block opacity-0 group-hover:opacity-100" />
                    
                    <div className="text-sm font-bold text-gray-300 font-mono pt-1 group-hover:text-emerald-500 transition-colors">
                      0{index + 2}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-[22px] font-bold text-gray-900 mb-2.5 group-hover:text-emerald-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[15px] text-gray-500 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
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
      {showApplyPopup && <AdvancedApplyPopup onClose={() => setShowApplyPopup(false)} />}
    </div>
  );
};
export default HomePage;
