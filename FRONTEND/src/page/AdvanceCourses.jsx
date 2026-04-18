import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientsCarousel from "../Components/our_alumni";
import BannerSlider from "../Components/BannerSlider";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import birendraImg from "../assets/alumini/birendra.jpg";
import rajaImg from "../assets/alumini/raja.jpg";
import mithunImg from "../assets/alumini/mithun.jpg";
import advanceHeroImg from "../../krutanic/images/advance.jpg";
import SuccessPath from "../Components/SuccessPath";
import ProgramGrid from "../Components/ProgramGrid";
import { FaCheckCircle, FaStar, FaAward, FaBuilding } from "react-icons/fa";
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
  FaBoxes
} from "react-icons/fa";

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

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-orange-200">
      <BannerSlider />

      <main className="max-w-[1240px] mx-auto px-6 py-16 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-10 mt-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#eff2ff] text-[#3453d1] font-bold text-[10px] uppercase tracking-widest py-2 px-4 rounded-full mb-6">
              Program Catalog
            </span>
            <h1 className="text-[3.5rem] lg:text-[5rem] font-extrabold tracking-tight text-[#111] leading-[1.05]">
              Build Career-Ready <br />Skills <span className="text-[#ff6a14]">for the Future</span>
            </h1>
            <p className="mt-6 text-[#555] text-lg lg:text-xl max-w-lg leading-relaxed">
              Explore our high-velocity learning paths designed for the next generation of industry leaders and technical pioneers.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-12">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">100%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Placement Support</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">1:1</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Industry Mentorship</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">Live</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Hands-on Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">Project</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Based Learning</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">Real-World</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Capstone Projects</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#111]">Elite</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a14]">Certification</span>
              </div>
            </div>

            <div className="mt-12">
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full sm:w-auto bg-[#ff6a14] text-white font-bold py-4 px-10 rounded-xl hover:bg-[#e85a0d] transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-2"
              >
                Apply for this Program <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="relative mt-4 w-full flex-grow lg:mt-12 flex flex-col items-center">
            <div className="overflow-hidden rounded-[30px] border border-[#ececec] bg-white p-2 shadow-[0_20px_45px_rgba(15,23,42,0.12)] w-full">
              <img
                src={advanceHeroImg}
                alt="Advanced learning programs"
                className="h-[420px] w-full rounded-[24px] object-cover object-center md:h-[500px]"
              />
            </div>

            <div className="absolute left-0 top-8 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-3xl font-extrabold text-[#f15b29] leading-none">6</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3453d1]">Programs</p>
            </div>

            <div className="hidden lg:flex absolute -right-20 top-1/2 -translate-y-1/2 flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                  <FaAward size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Top Rated</p>
                  <p className="text-[10px] text-gray-500">Industry Recognized</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-pulse delay-700">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                  <FaBuilding size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Elite Partners</p>
                  <p className="text-[10px] text-gray-500">500+ Hiring Partners</p>
                </div>
              </div>
            </div>
            
            {/* Success Path Section - Visible only on Desktop to keep mobile layout clean */}
            <div className="hidden lg:flex mt-28 w-full justify-center">
              <SuccessPath />
            </div>
          </div>
        </div>

        <div className="my-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-[40px] p-8 md:p-16 shadow-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Apply now and get access to hands-on learning, expert mentorship, and personalized career guidance.
            </p>
            <button
              onClick={() => setShowApplyForm(true)}
              className="bg-white text-orange-600 font-bold py-4 px-12 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-xl text-lg uppercase tracking-wider"
            >
              Start Application
            </button>
          </div>
        </div>

        {/* Apply Form Modal */}
        {showApplyForm && <AdvancedApplyPopup onClose={() => setShowApplyForm(false)} />}

        {/* Grid Section - Redesigned for Professional Equal-Height SaaS Look */}
        <ProgramGrid columnsData={columnsData} />

        {/* CTA Banner Section */}
        <div className="mt-28 relative overflow-hidden bg-gradient-to-r from-[#ce390f] via-[#d64111] to-[#ee6916] rounded-[40px] p-12 lg:p-20 text-white shadow-xl shadow-orange-500/10">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-16">
            <FaGraduationCap size={450} color="#fff" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-[44px] font-extrabold mb-6 leading-tight tracking-tight">Can't find your <br /> perfect program?</h2>
            <p className="text-base lg:text-lg text-white/90 mb-10 max-w-md leading-relaxed font-light">
              Speak with our academic advisors to build a custom learning path that aligns with your professional ambitions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contactus" className="bg-white text-[#d64111] font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="mt-28 mb-16 px-6 lg:px-12 bg-[#fafbfc] rounded-[40px] py-20 border border-gray-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.01)] relative overflow-hidden text-left" style={{ textAlign: "left" }}>
          {/* Subtle bg decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">Advanced Training?</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-lg leading-relaxed">
              Step beyond generic bootcamps. Our advanced programs are engineered exclusively for professionals aiming for leadership and mastery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-left">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaStar />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1-on-1 Mentorship</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Connect exclusively with industry veterans. Get direct feedback, career strategy, and exclusive insights to accelerate your vertical growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 transform md:translate-y-6">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaAward />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Certification</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Earn verifiable, globally-recognized certifications that dramatically elevate your resume and explicitly validate your advanced expertise.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaBuilding />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Architectures</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Work directly on live enterprise-grade projects. Deal with massive scale, real data, and deployment strategies mirroring FAANG stacks.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 transform md:translate-y-6">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <FaCheckCircle />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Placement Assistance</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Gain direct access to our 250+ hiring partners aggressively looking for certified profiles. Prepare with elite mock interviews and portfolio tracking.
              </p>
            </div>
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

        <div className="mt-24 mb-20">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111] tracking-tight">
              What Our <span className="text-[#f15b29]">Learners Have To Say</span>
            </h2>
            <div className="mt-3 flex items-center gap-2 text-[#2f2f2f] font-semibold text-xl">
              <FaStar className="text-[#f8b400]" />
              <span>4.5</span>
              <span className="text-[#878787]">•</span>
              <span>7812 Ratings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {learnerTestimonials.map((item) => (
              <article key={item.name} className="group">
                <div className="relative rounded-[28px] border border-[#ececec] bg-[#f5f5f5] p-7 min-h-[290px] shadow-[0_10px_22px_rgba(0,0,0,0.04)]">
                  <FaQuoteLeft className="text-[#f15b29] text-3xl mb-4" />
                  <p className="text-[#1f1f1f] text-[17px] leading-8 line-clamp-5">{item.quote}</p>
                  <div className="mt-5 pt-4 border-t border-[#e2e2e2] flex items-center justify-end">
                    <span className="text-[#444] font-medium">{item.date}</span>
                  </div>
                  <span className="absolute left-16 -bottom-4 h-8 w-8 rotate-45 bg-[#f5f5f5] border-r border-b border-[#ececec]" />
                </div>

                <div className="mt-8 flex items-center gap-4 px-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md" />
                  <div>
                    <h3 className="text-2xl font-bold text-[#111]">{item.name}</h3>
                    <p className="text-[#555] text-lg">{item.role}</p>
                    <p className="text-[#555] text-lg">{item.experience}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Hiring Partners Carousel block */}
        <div className="mt-28 mb-16 py-10 bg-white border-y border-gray-100">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Our Elite Hiring Partners</h2>
            <p className="text-gray-500">Graduates from our advanced programs go on to drive immense value at top global firms.</p>
          </div>
          <div className="w-full transition-all duration-500">
            <ClientsCarousel />
          </div>
        </div>

      </main>
    </div>
  );
};



export default AdvanceCourses;
