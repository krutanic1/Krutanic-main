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
import timelineBg from '../../../assets/timeline_bg.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CourseDetails.css";

// Lightweight countdown component used in AI promo bar
const Countdown = ({ targetOffsetMinutes = 30 }) => {
  const target = useMemo(() => Date.now() + targetOffsetMinutes * 60 * 1000, [targetOffsetMinutes]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Math.floor((target - now) / 1000));
  const mins = String(Math.floor(diff / 60)).padStart(2, '0');
  const secs = String(diff % 60).padStart(2, '0');
  return <span className="ai-countdown-timer">{mins}:{secs}</span>;
};

const learningCategories = [
  {
    title: "Solo Sprint",
    subtitle: "Learn at your own pace",
    price: "₹6,999",
    theme: "blue",
    icon: FaUserGraduate,
    features: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "No Live Sessions",
      "No Doubt Clearing Session",
      "No Mentor Guidance",
      "No Placement Assistance"
    ],
    links: ["Slot Booking Link"]
  },
  {
    title: "Live Edge",
    subtitle: "Get real time assistance",
    price: "₹9,999",
    theme: "purple",
    icon: FaChalkboardTeacher,
    features: [
      "All benefits of Solo Sprint",
      "Live Sessions",
      "Doubt Clearing Session",
      "Mentor Guidance",
      "No Placement Assistance"
    ],
    links: ["Slot Booking Link", "Full Registration Link"]
  },
  {
    title: "Career Edge",
    subtitle: "Get Job ready",
    price: "₹15,999",
    theme: "green",
    icon: FaBriefcase,
    features: [
      "All benefits of Solo Sprint + Live Edge",
      "Placement Assistance",
      "Mock Interviews",
      "Access to Our Hiring Partners",
      "ATS-Friendly Resume Building"
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
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden cd-hero-modern">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="absolute top-8 left-8 z-20">
            <Breadcrumbs />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 -mt-[80px]">

          <h1 className="text-white text-[42px] sm:text-[60px] md:text-[90px] lg:text-[110px] font-black leading-[0.9] tracking-tighter text-center mb-8 drop-shadow-2xl text-glow" style={{ textShadow: '0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)' }}>
            {data.title}
          </h1>

          <p className="text-white/80 text-base md:text-xl text-center max-w-2xl mb-10 font-light leading-relaxed">
            {data.pitch || `Master ${data.title} and become a job-ready professional with 1:1 mentorship and real-world projects.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-white/90 text-sm backdrop-blur-xl bg-white/5 border border-white/10">
              <FaCalendarAlt className="text-white/60" /> {data.duration}
            </span>
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-white/90 text-sm backdrop-blur-xl bg-white/5 border border-white/10">
              <FaChalkboardTeacher className="text-white/60" /> {data.format}
            </span>
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-white/90 text-sm backdrop-blur-xl bg-white/5 border border-white/10">
              <FaProjectDiagram className="text-white/60" /> Project-based
            </span>
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-white/90 text-sm backdrop-blur-xl bg-white/5 border border-white/10">
              <FaStar className="text-yellow-400" /> {data.rating}/5
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <button onClick={() => setShowForm(true)} className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:scale-105 hover:bg-white/90 button-glow flex items-center justify-center gap-2">
              Enroll Now <FaArrowRight />
            </button>
            <button onClick={() => setShowForm(true)} className="w-full sm:w-auto px-10 py-4 rounded-full liquid-glass border border-white/20 text-white font-medium text-sm tracking-wide transition-all hover:bg-white/10 flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md">
              Talk to Advisor <FaHeadset />
            </button>
          </div>
        </div>

        {/* Floating Sound/Experience indicator (bottom left) */}
        <div className="absolute bottom-10 left-10 hidden lg:flex items-center gap-4 z-10">
           <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="w-3 h-[2px] bg-white rounded-full"></div>
           </div>
           <div className="text-white/60 text-[10px] font-medium uppercase tracking-widest leading-relaxed">
             Experience<br/>With Sound
           </div>
        </div>
      </section>

      {(data.aboutDescription || (data.whyPoints && data.whyPoints.length > 0)) && (
        <section className="py-20 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.aboutDescription && (
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">{data.aboutTitle || "About Us"}</h2>
                <p className="text-[#475569] text-lg leading-relaxed">{data.aboutDescription}</p>
              </div>
            )}

            {data.whyPoints?.length > 0 && (
              <div className="mx-auto max-w-5xl mt-12 relative z-10 shadow-2xl rounded-2xl">
                {/* Chalkboard Surface (Black/Dark Green with noise) */}
                <div className="bg-[#1A2F25] relative p-10 md:p-14 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border border-[#112019] h-full flex flex-col items-center overflow-hidden">
                  {/* Subtle chalk dust texture overlay using radial gradients */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.9)_100%)] pointer-events-none"></div>
                  <div className="absolute inset-0 opacity-[0.20] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                  {/* Chalk Title */}
                  <div className="relative z-10 text-center mb-16 w-full">
                    <h2 className="text-4xl md:text-[3.5rem] text-[#F8F9FA] opacity-90 pb-4 border-b border-white/20 inline-block px-12" style={{ fontFamily: "'Dancing Script', cursive", textShadow: "0px 0px 4px rgba(255,255,255,0.4)" }}>
                      {data.whyTitle || "Why Choose This Program?"}
                    </h2>
                  </div>

                  {/* Chalk Content Grid */}
                  <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12">
                    {data.whyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-5 transition-transform hover:-translate-y-1 group">
                        <span className="text-[#A3E635] mt-0 text-3xl opacity-80 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "'Dancing Script', cursive" }}>✓</span>
                        <p className="text-[#F1F5F9] text-[1.05rem] md:text-lg leading-relaxed font-medium opacity-85 tracking-wide" style={{ textShadow: "0px 0px 1px rgba(255,255,255,0.3)" }}>
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Eraser smudges simulation */}
                  <div className="absolute bottom-8 right-16 w-48 h-24 bg-white opacity-[0.05] rounded-[100%] filter blur-xl rotate-[20deg] pointer-events-none"></div>
                  <div className="absolute top-20 left-20 w-64 h-32 bg-white opacity-[0.03] rounded-[100%] filter blur-2xl -rotate-[15deg] pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/3 w-32 h-16 bg-white opacity-[0.02] rounded-[100%] filter blur-lg pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {data.trainingProgram?.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle geometric background image */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-[0.25] pointer-events-none z-0" 
            style={{ backgroundImage: `url(${timelineBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
          ></div>
          
          {/* Subtle blue ambient glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 mix-blend-multiply">
             <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 filter blur-[100px] opacity-40"></div>
             <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100 filter blur-[80px] opacity-40"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4 tracking-tight">
                Training and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Internship Program</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                A structured journey from foundational learning to real-world experience and career placement.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Vertical Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-blue-200 to-transparent -translate-x-1/2 rounded-full z-0"></div>

              <div className="space-y-12 md:space-y-20 relative z-10">
                {data.trainingProgram.map((phase, i) => (
                  <div key={i} className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Timeline Dot */}
                    <div className="hidden md:flex absolute left-1/2 w-8 h-8 rounded-full bg-white border-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] -translate-x-1/2 z-10 items-center justify-center"></div>
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        {/* Decorative subtle numbering/accent */}
                        <div className="absolute -right-4 -top-6 text-9xl font-black text-slate-50 opacity-60 group-hover:text-blue-50 group-hover:opacity-40 transition-colors duration-500 pointer-events-none select-none">
                          0{i + 1}
                        </div>
                        
                        <div className="relative z-10">
                          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-5 border border-blue-100">
                            {phase.phase}
                          </span>
                          <h3 className="text-2xl font-bold text-slate-800 mb-6">{phase.title}</h3>
                          <ul className="space-y-4">
                            {phase.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3 text-slate-600">
                                <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0 text-lg" />
                                <span className="leading-relaxed font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Post-Training Card (Always at the end) */}
                <div className={`relative flex flex-col md:flex-row items-center ${data.trainingProgram.length % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot for Post-Training */}
                  <div className="hidden md:flex absolute left-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.4)] -translate-x-1/2 z-10 items-center justify-center"></div>
                  
                  <div className={`w-full md:w-1/2 ${data.trainingProgram.length % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700 shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-40 h-40 bg-[#10B981] opacity-10 rounded-full filter blur-[50px] pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <span className="inline-block bg-[#10B981]/20 text-[#34D399] text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full mb-5 border border-[#10B981]/30">
                          Post-Training
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-6">Placement Support</h3>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3 text-slate-300">
                            <FaCheckCircle className="text-[#34D399] mt-1 flex-shrink-0 text-lg" />
                            <span className="leading-relaxed font-medium">Dedicated placement assistance with access to 200+ hiring partners.</span>
                          </li>
                          <li className="flex items-start gap-3 text-slate-300">
                            <FaCheckCircle className="text-[#34D399] mt-1 flex-shrink-0 text-lg" />
                            <span className="leading-relaxed font-medium">ATS-friendly resume building and LinkedIn profile optimization.</span>
                          </li>
                          <li className="flex items-start gap-3 text-slate-300">
                            <FaCheckCircle className="text-[#34D399] mt-1 flex-shrink-0 text-lg" />
                            <span className="leading-relaxed font-medium">Mock interviews with industry experts to prepare for technical and HR rounds.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {data.moduleOverview?.length > 0 && (
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Modules <span className="text-blue-600">Overview</span></h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Master these essential technologies and tools to become a complete professional in this domain.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              {data.moduleOverview.map((item, i) => (
                <div key={i} className="group relative bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default flex items-center gap-5 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] flex-grow-0">
                  {/* Subtle Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-colors duration-500 pointer-events-none"></div>
                  
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 group-hover:bg-blue-500 transition-colors duration-300"></div>
                  
                  {/* Faint Index Number */}
                  <span className="text-slate-200 font-black text-3xl group-hover:text-blue-200 transition-colors duration-300 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                  
                  {/* Module Title */}
                  <span className="text-slate-700 font-bold text-[15px] leading-snug group-hover:text-blue-900 transition-colors duration-300 z-10">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Dark Outcomes Section */}
      {data.outcomes?.length > 0 && (
        <section className="relative py-28 bg-[#0B0F19] overflow-hidden">
          {/* Abstract Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                What You Will <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Learn</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Transform from a beginner to a proficient expert with these core competencies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {data.outcomes.map((item, i) => (
                <div key={i} className="group relative bg-[#111827]/80 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.15)] flex flex-col h-full">
                  
                  {/* Subtle Card Background Pattern / Glow */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-colors duration-500 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 text-2xl group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500">
                        <item.icon />
                      </div>
                      <span className="text-slate-800 font-black text-6xl select-none group-hover:text-slate-700 transition-colors duration-500">
                        0{i + 1}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-cyan-300 transition-colors duration-300">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-[1.05rem] group-hover:text-slate-300 transition-colors duration-300 flex-grow">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
        <section className="relative py-24 bg-[#0a0a0a] overflow-hidden cd-milestones-modern">
          {/* Background Image with Parallax effect */}
          <div 
            className="absolute inset-0 z-0 opacity-50 mix-blend-screen"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0"></div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
                Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Highlights</span>
              </h2>
              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Discover why this Full Stack Development course is essential for your learning journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.milestones.map((item, i) => (
                <article 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 text-center shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 group" 
                  key={i}
                >
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {item.value}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base font-semibold tracking-widest uppercase">
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Syllabus Section */}
      <section className="py-20 bg-[#F4F7FB]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-black mb-12 font-sans tracking-tight">
            Syllabus
          </h2>
          
          <div className="bg-[#E9F0F7] rounded-[32px] p-6 md:p-12 w-full max-w-4xl mx-auto shadow-sm">
            <div className="flex flex-col gap-4">
              {data.curriculum.map((mod, i) => (
                <div key={i} className="flex flex-col">
                  <div 
                    onClick={() => setActiveModule(activeModule === i ? null : i)}
                    className={`bg-white px-6 py-4 flex items-center justify-between border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all ${activeModule === i ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                  >
                    <span className="text-gray-700 font-medium text-sm md:text-base">
                      {i + 1}. {mod.title}
                    </span>
                    <FaChevronDown className={`text-gray-400 text-sm transition-transform duration-300 ${activeModule === i ? 'rotate-180' : ''}`} />
                  </div>
                  {activeModule === i && (
                    <div className="bg-white px-6 pb-5 rounded-b-2xl border-t-0 border border-gray-100 shadow-sm border-t border-dashed border-gray-200 pt-3">
                      <ul className="space-y-3">
                        {mod.topics.map((topic, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                            <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
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
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              {data.careerPaths?.title}
            </h2>
            <p className="text-[#475569] text-lg leading-relaxed">
              {data.careerPaths?.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.careerPaths?.roles?.map((role, i) => {
              const getCareerImage = (roleTitle) => {
                const title = (roleTitle || '').toLowerCase();
                if (title.includes('full stack') || title.includes('fullstack')) return '/careers/fullstack_dev_art_1785910731365.png';
                if (title.includes('frontend') || title.includes('front end')) return '/careers/frontend_dev_art_1785910708654.png';
                if (title.includes('backend') || title.includes('back end')) return '/careers/backend_dev_art_1785910720384.png';
                if (title.includes('devops')) return '/careers/devops_art_1785910746873.png';
                if (title.includes('mobile') || title.includes('react native')) return '/careers/mobile_dev_art_1785910775132.png';
                return '/careers/tech_lead_art_1785910763986.png';
              };

              return (
                <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
                  
                  {/* Subtle Background Image Layer */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <img 
                      src={getCareerImage(role.title)} 
                      alt="" 
                      className="w-full h-full object-cover opacity-[0.35] group-hover:opacity-[0.55] group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/80"></div>
                  </div>

                  {/* Top Header: Badge & Icon */}
                  <div className="relative z-10 flex justify-between items-start p-8 pb-4">
                    <span className="bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-md shadow-sm">
                      {role.level || "Professional"}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#1D4ED8] bg-white group-hover:bg-[#EFF6FF] transition-colors shadow-sm">
                      {i === 0 && <FaArrowRight className="text-sm" />}
                      {i === 1 && <FaCheckCircle className="text-sm" />}
                      {i === 2 && <FaUserGraduate className="text-sm" />}
                      {i === 3 && <FaStar className="text-sm" />}
                      {i === 4 && <FaProjectDiagram className="text-sm" />}
                      {i === 5 && <FaBriefcase className="text-sm" />}
                    </div>
                  </div>
                  
                  <div className="relative z-10 px-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{role.title}</h3>
                    <p className="text-[#64748B] text-sm mb-8 leading-relaxed flex-grow">
                      {role.desc}
                    </p>
                  </div>
                  
                  <div className="relative z-10 p-8 pt-6 border-t border-[#E2E8F0]/60 bg-white/40 backdrop-blur-[2px]">
                    <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-4">What you'll use:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.tools?.map((t, j) => (
                        <span key={j} className="bg-white/90 border border-[#E2E8F0] text-[#475569] text-xs px-3 py-1.5 rounded-md font-medium shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {data.careerPaths?.progression && (
            <div className="mt-16 flex justify-center">
              <div className="inline-flex flex-wrap items-center gap-4 bg-white border border-[#E2E8F0] p-2 pr-6 rounded-full shadow-sm">
                <span className="text-[#475569] font-medium text-sm ml-4">You may also grow into:</span>
                <div className="flex items-center gap-3">
                  {data.careerPaths.progression.map((p, i) => (
                    <span key={i} className="text-[#0F172A] text-sm font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Light Glassmorphism Experience & Mentor Section */}
      <section className="relative py-24 overflow-hidden bg-[#F8FAFC]">
        {/* Soft Pastel Mesh Gradients for Light Glassmorphism */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
              The Krutanic <span className="text-blue-600">Experience</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">A premium, immersive learning environment engineered for your success.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Features (Frosted Glass Panels) */}
            <div className="lg:col-span-7 space-y-6">
              {[
                { icon: FaChalkboardTeacher, title: "Mentor-led Sessions", desc: "Not just pre-recorded videos. Get live guidance from industry experts." },
                { icon: FaHeadset, title: "24/7 Doubt Support", desc: "Get your queries resolved quickly by our dedicated technical support team." },
                { icon: FaBriefcase, title: "Internship Access", desc: "Exclusive access to internships with 200+ hiring partners worldwide." }
              ].map((item, i) => (
                <div key={i} className="group relative bg-white/60 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start gap-6 overflow-hidden">
                  
                  {/* Subtle hover glow */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-full blur-2xl transition-colors duration-500 pointer-events-none"></div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 text-2xl flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300 z-10">
                    <item.icon />
                  </div>
                  <div className="z-10">
                    <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">{item.title}</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Side: Mentor Profile (Premium Glass Card) */}
            <div className="lg:col-span-5 relative">
              
              <div className="relative bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 md:p-12 flex flex-col items-center text-center overflow-hidden group">
                 
                 {/* Decorative background circle inside the card */}
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                 {data.mentorImage !== null && (
                   <div className="relative mb-8">
                     <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                     <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-blue-100 to-purple-200 relative z-10 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                       <img src={data.mentorImage || sachinImg} alt={data.mentor.name} className="w-full h-full object-cover rounded-full border-4 border-white" />
                     </div>
                   </div>
                 )}
                
                 <span className="px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                   Lead Mentor
                 </span>
                 <h3 className="text-3xl font-black text-slate-800 mb-2">{data.mentor.name}</h3>
                 <p className="text-blue-600 font-semibold mb-6">{data.mentor.role} • {data.mentor.experience}</p>
                 
                 <div className="w-16 h-[2px] bg-slate-200 mb-6"></div>
                 
                 <p className="text-slate-600 leading-relaxed font-medium text-[1.05rem]">
                   {data.mentor.bio}
                 </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {data.certifications?.length > 0 && (
        <section className="relative w-full overflow-hidden bg-[#F4F5F9] pt-24 pb-32">
          {/* Centered Title */}
          <div className="relative z-10 text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-[2.5rem] font-bold text-[#1F2937]">Certify your Success</h2>
          </div>

          {/* SVG Wave Background Layer */}
          <div className="absolute left-0 right-0 bottom-0 w-full h-[60%] md:h-[55%] z-0 flex flex-col">
             <svg viewBox="0 0 1440 120" className="w-full h-[100px] md:h-[150px] flex-shrink-0" preserveAspectRatio="none">
                <path fill="#231E3D" d="M0,60 C400,120 1000,0 1440,60 L1440,120 L0,120 Z"></path>
             </svg>
             <div className="w-full flex-grow bg-[#231E3D] -mt-[1px]"></div>
          </div>

          {/* Certificates Container */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            
            {/* Certificate 1: Training */}
            <div className="bg-white p-2 md:p-3 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-500 w-full max-w-[500px]">
              <img src={certTraining} alt="Training Certificate" className="w-full h-auto object-cover rounded border border-gray-100" />
            </div>

            {/* Certificate 2: Internship */}
            <div className="bg-white p-2 md:p-3 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-500 w-full max-w-[500px]">
              <img src={certInternship} alt="Internship Certificate" className="w-full h-auto object-cover rounded border border-gray-100" />
            </div>

          </div>
        </section>
      )}

      {/* Horizontal Scrolling Reviews Section */}
      {data.studentReviews?.length > 0 && (
        <section className="py-24 bg-[#F4F5F9] relative overflow-hidden">
          <style>{`
            @keyframes marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              animation: marquee-left 200s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-marquee-right {
              animation: marquee-right 200s linear infinite;
              display: flex;
              width: max-content;
            }
            .animate-marquee-left:hover, .animate-marquee-right:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-[2.5rem] font-bold text-[#111827] mb-4">
                Reviews: A Testimony to What We Do
              </h2>
              <p className="text-[#6B7280] text-[1.1rem]">See what our learners have to say about us</p>
            </div>
          </div>

          {/* Marquee Container */}
          <div className="w-full flex flex-col gap-6 overflow-hidden relative">
            
            {/* Top Row (Scrolls Left) */}
            <div className="animate-marquee-left gap-6 px-4">
              {Array(2).fill(data.studentReviews).flat().map((review, i) => {
                const sentences = review.text.split('.');
                const summary = sentences[0] + (sentences.length > 1 ? '' : '');
                const restOfText = sentences.slice(1).join('.').trim();
                const displayRest = restOfText.length > 0 ? restOfText : review.text;

                return (
                  <div key={`top-${i}`} className="w-[85vw] sm:w-[400px] lg:w-[450px] bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow flex-shrink-0">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm border border-indigo-50 flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 text-[1.05rem] leading-tight">{review.name}</h4>
                        {review.detail && <p className="text-[12.5px] text-purple-700 mt-1 leading-snug">{review.detail}</p>}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-bold text-[#1F2937] text-[15px] mb-3 leading-snug">{summary}</h5>
                      <p className="text-[#4B5563] text-[13.5px] leading-relaxed line-clamp-3">
                        {displayRest}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row (Scrolls Right) */}
            <div className="animate-marquee-right gap-6 px-4">
              {Array(2).fill([...data.studentReviews].reverse()).flat().map((review, i) => {
                const sentences = review.text.split('.');
                const summary = sentences[0] + (sentences.length > 1 ? '' : '');
                const restOfText = sentences.slice(1).join('.').trim();
                const displayRest = restOfText.length > 0 ? restOfText : review.text;

                return (
                  <div key={`bottom-${i}`} className="w-[85vw] sm:w-[400px] lg:w-[450px] bg-white rounded-lg p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow flex-shrink-0">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm border border-indigo-50 flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 text-[1.05rem] leading-tight">{review.name}</h4>
                        {review.detail && <p className="text-[12.5px] text-purple-700 mt-1 leading-snug">{review.detail}</p>}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-bold text-[#1F2937] text-[15px] mb-3 leading-snug">{summary}</h5>
                      <p className="text-[#4B5563] text-[13.5px] leading-relaxed line-clamp-3">
                        {displayRest}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* Pick Your Plan Pricing Section */}
      <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-tight mb-4 tracking-tight max-w-3xl mx-auto">
              Unlock Your Potential: Choose Your Path and Join 50k+ Achievers.
            </h2>
          </div>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {learningCategories.map((cat, i) => {
              const isBlue = cat.theme === 'blue';
              const isPurple = cat.theme === 'purple';
              const isGreen = cat.theme === 'green';

              const iconBg = isBlue ? 'bg-blue-100 text-blue-600' : isPurple ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600';
              const titleColor = isBlue ? 'text-[#1d4ed8]' : isPurple ? 'text-[#7e22ce]' : 'text-[#15803d]';
              const lineColor = isBlue ? 'bg-[#93c5fd]' : isPurple ? 'bg-[#d8b4fe]' : 'bg-[#86efac]';
              const Icon = cat.icon;

              return (
                <div key={i} className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                    <Icon className="text-xl" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-xl font-bold mb-1 ${titleColor}`}>{cat.title}</h3>
                  <p className="text-[13.5px] text-slate-600 mb-6">{cat.subtitle}</p>

                  {/* Price */}
                  <div className="text-[2.5rem] font-black text-[#111827] mb-2">{cat.price}</div>
                  <p className="text-[12.5px] text-slate-500 mb-6 text-center">Enroll now to enjoy extra early bird discounts!</p>

                  {/* Separator Line */}
                  <div className={`w-full h-[2px] rounded-full mb-8 ${lineColor}`}></div>

                  {/* Features List */}
                  <div className="w-full flex-grow mb-8 space-y-4">
                    {cat.features.map((feature, j) => {
                      const isUnavailable = feature.includes("No ");
                      const checkColor = isBlue ? 'text-blue-600' : isPurple ? 'text-purple-600' : 'text-green-600';
                      
                      return (
                        <div key={j} className={`flex items-start gap-3 ${isUnavailable ? 'opacity-50 grayscale line-through text-slate-400' : 'text-slate-800'}`}>
                          <FaCheckCircle className={`mt-1 flex-shrink-0 text-[15px] ${isUnavailable ? 'text-slate-400' : checkColor}`} />
                          <span className="text-[14px] font-medium leading-snug">{feature}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Buttons */}
                  <div className="w-full space-y-3 mt-auto">
                    {cat.links.map((link, j) => {
                      const btnClass = "w-full rounded-md border-2 border-black bg-white px-4 py-3.5 text-[15px] font-bold text-black transition hover:bg-black hover:text-white flex items-center justify-center gap-2";
                      
                      if (link === "Slot Booking Link" || link === "https://rzp.io/rzp/Career_Advance_Slot_Booking") {
                        const hrefUrl = link === "Slot Booking Link" ? "https://pages.razorpay.com/Instructor_Led_Slot_Booking" : link;
                        return (
                          <a key={j} href={hrefUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
                            Enroll Now ↗
                          </a>
                        );
                      }
                      if (link === "Full Registration Link" || link === "Career Advancement Full Registration") {
                        const hrefUrl = link === "Full Registration Link" ? "https://pages.razorpay.com/Instructor_Led_Full_Enrollment" : "https://pages.razorpay.com/Career_Advancement_Full_Reg";
                        return (
                          <a key={j} href={hrefUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
                            Full Registration ↗
                          </a>
                        );
                      }
                      return (
                        <button key={j} type="button" onClick={() => setShowForm(true)} className={btnClass}>
                          {link} ↗
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })}
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
          <div className="ai-promo-info">
            <div className="ai-text">🎓 UP TO 40% SCHOLARSHIP</div>
            <div className="ai-promo-desc">Limited Scholarship Slots • Registration Closes When the Current Intake Is Full</div>
          </div>
          <div className="ai-promo-timer-wrap">
            <div className="ai-promo-timer-label">Ends In</div>
            <div className="ai-countdown">
              <Countdown targetOffsetMinutes={30} />
            </div>
          </div>
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
