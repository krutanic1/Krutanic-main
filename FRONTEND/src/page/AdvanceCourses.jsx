import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import birendraImg from "../assets/alumini/birendra.jpg";
import rajaImg from "../assets/alumini/raja.jpg";
import mithunImg from "../assets/alumini/mithun.jpg";
import advanceHeroImg from "../../krutanic/images/advance.jpg";
import BannerSlider from "../Components/BannerSlider";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import FeatureStrip from "../Components/FeatureStrip";
import ProgramExplorer from "../Components/ProgramExplorer";
import Testimonial from "../Components/testimonial";
import LearnerBenefits from "../Components/LearnerBenefits";
import ClientsCarousel from "../Components/our_alumni2";
import {
  FaQuoteLeft,
  FaNetworkWired,
  FaShieldAlt,
  FaSearchDollar,
  FaRocket,
  FaChartBar,
  FaGlobe,
  FaArrowRight,
  FaLaptopCode,
  FaBullhorn,
  FaBriefcase,
  FaGraduationCap,
  FaShareAlt,
  FaEnvelope,
  FaBrain,
  FaChartLine,
  FaCoins,
  FaDollarSign,
  FaFileAlt,
  FaBoxes,
  FaNewspaper,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaStar,
  FaAward,
  FaBuilding,
  FaUsers
} from "react-icons/fa";

const mediaHighlights = [
  {
    publisher: "The Economic Times",
    title: "Digital Marketing ruling the current upskilling market: Survey",
    link: "https://economictimes.indiatimes.com/tech/tech-bytes/digital-marketing-ruling-the-current-upskilling-market-survey/articleshow/82208690.cms",
    color: "bg-blue-50 text-blue-700",
    date: "March 2024"
  },
  {
    publisher: "Financial Express",
    title: "Upward trajectory: 200% rise in enrolment in upskilling and reskilling courses",
    link: "https://www.financialexpress.com/jobs-career/education-upward-trajectory-200-rise-in-enrolment-in-upskilling-and-reskilling-courses-2315472/",
    color: "bg-orange-50 text-orange-700",
    date: "Feb 2024"
  },
  {
    publisher: "The Tribune",
    title: "5 courses that will help you upskill",
    link: "https://www.tribuneindia.com/news/jobs-careers/5-courses-that-will-help-you-upskill-320075",
    color: "bg-emerald-50 text-emerald-700",
    date: "Jan 2024"
  }
];

const columnsData = [
  {
    category: "Technology",
    icon: <FaLaptopCode className="text-[#bf3b2b]" />,
    count: "2 Programs",
    cards: [
      {
        type: "icon",
        icon: <FaNetworkWired />,
        title: "Data Science Advanced Program",
        desc: "Master Machine Learning, AI ethics, and large-scale neural architectures.",
        link: "/DataScience",
        batch: "Upcoming"
      },
      {
        type: "icon",
        icon: <FaChartBar />,
        title: "Data Analytics Advanced Program",
        desc: "Master Excel, SQL, Python, and Power BI to drive business decisions with data.",
        link: "/DataAnalytics",
        batch: "1 May 2026"
      }
    ]
  },
  {
    category: "Marketing",
    icon: <FaBullhorn className="text-[#bf3b2b]" />,
    count: "2 Programs",
    cards: [
      {
        type: "icon",
        icon: <FaSearchDollar />,
        title: "Digital Marketing Advanced Program",
        desc: "Multi-channel strategies, consumer psychology, and scalable digital campaigns.",
        link: "/DigitalMarket",
        batch: "10 May 2026"
      },
      {
        type: "icon",
        icon: <FaBrain />,
        title: "Prompt Engineering with GenAI Advanced Program",
        desc: "Master the art of communicating with and optimizing Large Language Models.",
        link: "/PromptEngineering",
        batch: "Upcoming"
      }
    ]
  },
  {
    category: "Business",
    icon: <FaBriefcase className="text-[#bf3b2b]" />,
    count: "2 Programs",
    cards: [
      {
        type: "icon",
        icon: <FaRocket />,
        title: "Product Management Advanced Program",
        desc: "Leading product lifecycle, agile methodologies, and cross-functional teams.",
        link: "/ProductManagement",
        batch: "Upcoming"
      },
      {
        type: "icon",
        icon: <FaLaptopCode />,
        title: "MERN Stack Development Advanced Program",
        desc: "Full-stack web development utilizing MongoDB, Express, React, and Node.js.",
        link: "/MernStack",
        batch: "Upcoming"
      }
    ]
  }
];

const learnerTestimonials = [
  {
    name: "Raja Singh",
    role: "Stock Market Analyst",
    experience: "4 Years of Experience",
    date: "Aug 9, 2023",
    image: rajaImg,
    quote:
      "Recently completed the stock market course and found it exceptionally informative and beneficial. The course was well-structured, making complex concepts easy to understand and practical to apply.",
  },
  {
    name: "Birendra Kumar",
    role: "Data Science Associate",
    experience: "10 Years of Experience",
    date: "Aug 17, 2022",
    image: birendraImg,
    quote:
      "I completed my internship in stock market and also pursued more courses here. Great mentorship and training made a significant positive impact on my learning journey.",
  },
  {
    name: "Mithun Prajapati",
    role: "Full Stack Developer",
    experience: "2 Years of Experience",
    date: "Mar 10, 2021",
    image: mithunImg,
    quote:
      "Successfully completed my full stack web development internship at Krutanic. Sessions were interactive, practical, and highly engaging with excellent mentor support.",
  },
];

const capstoneSteps = [
  {
    step: "1",
    title: "Bring Your Employer's Business Problem",
    description:
      "Go back and impress your boss and colleagues with the Data & AI solutions you come up with.",
  },
  {
    step: "2",
    title: "Bring a Future Employer's Problem",
    description:
      "Work on a challenge that helps you build a stronger portfolio for hiring managers.",
  },
  {
    step: "3",
    title: "Choose a Problem From Your Domain",
    description:
      "Pick a project from your career track and showcase practical problem-solving skills.",
  },
];

const capstoneTracks = [
  { title: "Marketing", icon: FaBullhorn },
  { title: "Finance", icon: FaDollarSign },
  { title: "Sales", icon: FaChartLine },
  { title: "Human Resources", icon: FaFileAlt },
  { title: "Operations and Supply chain", icon: FaBoxes },
];

const AdvanceCourses = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaHighlights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-orange-200">
      <BannerSlider />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 md:pb-16">

        {/* 2. Feature Highlights (About/Benefits) */}
        <div className="mt-0 -mx-6 lg:-mx-8">
          <FeatureStrip />
        </div>

        {/* 3. Program Explorer (The Course Catalog) */}
        <ProgramExplorer columnsData={columnsData} />

        {/* Official Testimonial Section (Matching Home Page) */}
        <div className="testimonial mt-12 mb-20 overflow-hidden">
          <h1 className="feedback-heading text-center text-3xl md:text-5xl font-black text-slate-900 mb-10">
            Our Mentees' Feedback
          </h1>
          <Testimonial />
        </div>

        {/* 5. Apply CTA Banner - Cinematic High-Impact Version */}
        <div 
          className="my-16 md:my-24 rounded-[32px] md:rounded-[48px] p-10 md:p-20 shadow-2xl relative overflow-hidden text-center max-w-6xl mx-auto border border-white/10 group"
          style={{ 
            backgroundImage: `url('/cta_bg.png')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-slate-900/40"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
              Ready to Transform Your Career?
            </h2>
            <p className="text-white/90 mb-10 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Step into the future of tech. Apply now for exclusive access to advanced modules and industry-leading mentorship.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full sm:w-auto bg-white text-slate-900 font-black py-4 px-12 rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-2xl text-lg uppercase tracking-wider transform hover:scale-105"
              >
                Start Application
              </button>
            </div>
          </div>
        </div>

        {/* 6. Learner Benefits (Value Pillars) */}
        <LearnerBenefits />

        {/* 7. Our Elite Hiring Partners (Matching Home Page) */}
        <div className="bg-white py-20 px-6 mt-12 rounded-[40px] border border-slate-50 shadow-sm">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Our Elite <span className="text-orange-600">Hiring Partners</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Graduates from our advanced programs go on to drive immense value at top global firms.
            </p>
          </div>
          <ClientsCarousel />
        </div>

        {/* Modal handled by state */}
        {showApplyForm && <AdvancedApplyPopup onClose={() => setShowApplyForm(false)} />}


        {/* Value Proposition Section */}
        <div className="mt-28 mb-16 px-6 lg:px-12 bg-[#fafbfc] rounded-[40px] py-20 border border-gray-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.01)] relative overflow-hidden text-left" style={{ textAlign: "left" }}>
          {/* Subtle bg decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">Advanced Training?</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-base sm:text-lg leading-relaxed px-2">
              Step beyond generic programs. Our advanced programs are engineered exclusively for professionals aiming for leadership and mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
            {[
              { icon: <FaStar />, title: "1-on-1 Mentorship", desc: "Connect exclusively with industry veterans. Get direct feedback, career strategy, and exclusive insights to accelerate your vertical growth.", bg: "bg-blue-50 text-blue-600" },
              { icon: <FaAward />, title: "Global Certification", desc: "Earn verifiable, globally-recognized certifications that dramatically elevate your resume and explicitly validate your advanced expertise.", bg: "bg-orange-50 text-orange-600" },
              { icon: <FaBuilding />, title: "Live Architectures", desc: "Work directly on live enterprise-grade projects. Deal with massive scale, real data, and deployment strategies mirroring FAANG stacks.", bg: "bg-green-50 text-green-600" },
              { icon: <FaCheckCircle />, title: "Placement Assistance", desc: "Gain direct access to our 500+ hiring partners aggressively looking for certified profiles. Prepare with elite mock interviews and portfolio tracking.", bg: "bg-purple-50 text-purple-600" },
              { icon: <FaRocket />, title: "Project-Based Learning", desc: "Execute 50+ industry-standard projects across the program. Transition from theoretical knowledge to building production-ready systems.", bg: "bg-red-50 text-red-600" },
              { icon: <FaUsers />, title: "Industry Masterclasses", desc: "Gain exclusive access to weekly masterclasses led by experts from top-tier firms. Stay updated with the latest industry trends and best practices.", bg: "bg-cyan-50 text-cyan-600" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${item.bg} rounded-2xl md:rounded-3xl flex-shrink-0 flex items-center justify-center text-2xl md:text-3xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 mb-20 rounded-[30px] bg-white px-4 py-8 text-black shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
          <h2 className="text-center text-[2rem] font-extrabold tracking-tight text-black md:text-[3.2rem]">
            Choose Your Capstone Project
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="relative pl-10">
              <div className="absolute left-[18px] top-3 bottom-0 w-px bg-[#e5e7eb]" aria-hidden="true" />
              <div className="space-y-8">
                {capstoneSteps.map((item, index) => (
                  <div key={item.step} className="relative">
                    <div className={`absolute -left-10 top-0 flex h-10 w-10 items-center justify-center rounded-full text-base font-bold ${index === 0 ? 'bg-[#f15b29] text-white shadow-[0_10px_24px_rgba(241,91,41,0.25)]' : 'border border-[#d1d5db] bg-white text-[#6b7280]'}`}>
                      {item.step}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[1.15rem] font-bold leading-snug text-[#111827] md:text-[1.45rem]">
                        {item.title}
                      </h3>
                      {index === 0 && (
                        <p className="mt-4 flex max-w-[36rem] items-start gap-3 text-[1rem] leading-8 text-[#374151] md:text-[1.1rem]">
                          <span className="mt-2 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#f15b29] text-[#f15b29]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#f15b29]" />
                          </span>
                          <span>{item.description}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {capstoneTracks.map((track, index) => {
                const Icon = track.icon;
                const isWide = index === 4;
                return (
                  <article
                    key={track.title}
                    className={`flex items-center gap-4 rounded-[22px] border border-[#f15b29] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] ${isWide ? 'sm:col-span-2 sm:max-w-[34rem] sm:justify-self-center' : ''}`}
                  >
                    <div className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-[16px] border border-[#f15b29] bg-[#f5f5f5] text-[2rem] text-[#f15b29]">
                      <Icon />
                    </div>
                    <div className="relative flex-1">
                      <div className="inline-block rounded-full border border-[#f15b29] px-5 py-3 text-[1.15rem] font-medium leading-none text-[#3f3f46]">
                        {track.title}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>



        {/* 8. Media Highlights section - Dynamic Pop Version */}
        <div className="mt-24 mb-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Media <span className="text-orange-600">Highlights</span>
            </h2>
            <div className="w-20 h-1.5 bg-orange-600 rounded-full mx-auto mb-6"></div>
          </div>

          <div className="relative max-w-2xl mx-auto h-[320px] md:h-[280px]">
            {mediaHighlights.map((news, idx) => (
              <a 
                key={idx}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute inset-0 group bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(255,107,45,0.15)] transition-all duration-700 ease-in-out flex flex-col h-full
                  ${idx === currentMediaIndex 
                    ? 'opacity-100 scale-100 translate-y-0 z-20' 
                    : 'opacity-0 scale-95 translate-y-8 z-10 pointer-events-none'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] ${news.color}`}>
                    {news.publisher}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-orange-600 transition-colors">
                    <FaNewspaper size={20} />
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-tight flex-1 group-hover:text-orange-600 transition-colors">
                  "{news.title}"
                </h3>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <span className="text-slate-400 text-[12px] font-bold uppercase tracking-widest">{news.date}</span>
                  <div className="flex items-center gap-2 text-orange-600 font-extrabold text-sm uppercase tracking-wider">
                    Full Coverage <FaExternalLinkAlt size={12} />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {mediaHighlights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMediaIndex(idx)}
                className={`h-2 transition-all duration-500 rounded-full ${
                  idx === currentMediaIndex ? 'w-12 bg-orange-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

      </main>

      {/* Fixed Bottom Contact Banner with Shining Effect */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#f15b29] via-[#ff7d4d] to-[#f15b29] text-white py-3 px-4 z-[100] text-center shadow-[0_-10px_30px_rgba(241,91,41,0.3)] border-t border-white/20 overflow-hidden">
        {/* Shine/Shimmer Effect Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="w-[100px] h-full bg-white/30 skew-x-[-25deg] absolute top-0 -left-[150px] animate-[shine_4s_infinite]"></div>
        </div>

        <p className="text-[10px] md:text-sm font-black tracking-wider flex items-center justify-center gap-2 relative z-10 drop-shadow-sm uppercase">
          <span>Feel free to reach out to us at <a href="tel:9380736449" className="hover:text-white/80 transition-colors bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">9380736449</a> or simply</span>
          <button 
            onClick={() => setShowApplyForm(true)} 
            className="group flex items-center gap-1.5 bg-white text-[#f15b29] px-4 py-1 rounded-full text-[9px] md:text-xs font-black shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Request a Callback
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <span>, and we'll get in touch shortly.</span>
        </p>

        <style>{`
          @keyframes shine {
            0% { left: -150px; }
            30% { left: 120%; }
            100% { left: 120%; }
          }
        `}</style>
      </div>
    </div>
  );
};



export default AdvanceCourses;
