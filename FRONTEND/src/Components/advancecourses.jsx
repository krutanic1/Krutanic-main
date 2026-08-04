import React from "react";
import { Link } from "react-router-dom";
import mernBrochure from "../../krutanic/Mern Stack Web Development Advanced Program.pdf";
import dataScienceBrochure from "../../krutanic/DataScienceAdvancedProgram.pdf";
import dataAnalyticsBrochure from "../../krutanic/dataanalytices new advnace Brouchuer.pdf";
import digitalMarketingBrochure from "../../krutanic/Digital Marketing Advanced Program.pdf";
import productManagementBrochure from "../../krutanic/Product management Advanced program.pdf";
import promptEngineeringBrochure from "../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";
import DownloadBrochureButton from "../page/AdvanceCourse/Components/DownloadBrochureButton";
import premiumBg from "./premium_tech_bg.png";

const AdvanceCounses = () => {
  // Flagship Course Data
  const flagshipCourse = {
    title: "Data Science Advanced Program",
    description: "Master machine learning, statistical modeling, and data engineering. Build a portfolio of complex, real-world data solutions to accelerate your transition into senior data roles.",
    tags: ["Live Mentoring", "100% Placement Assistance"],
    stats: [
      { label: "Duration", value: "6 Months", icon: "fa-clock-o" },
      { label: "Cohort", value: "10th Aug", icon: "fa-calendar-check-o" },
      { label: "Format", value: "Live Classes", icon: "fa-video-camera" }
    ],
    brochure: dataScienceBrochure,
    icon: <i className="fa fa-database" aria-hidden="true"></i>,
  };

  // Supporting Courses Data
  const supportingCourses = [
    {
      title: "MERN Stack Development",
      description: "Build scalable web apps from frontend to backend.",
      category: "Engineering",
      duration: "6 Months",
      brochure: mernBrochure,
      icon: "fa-code",
      link: "/MernStack"
    },
    {
      title: "Data Analytics",
      description: "Drive strategic decisions using Python and PowerBI.",
      category: "Data & BI",
      duration: "6 Months",
      brochure: dataAnalyticsBrochure,
      icon: "fa-bar-chart",
      link: "/DataAnalytics"
    },
    {
      title: "Product Management",
      description: "Lead product lifecycles and agile execution strategies.",
      category: "Management",
      duration: "6 Months",
      brochure: productManagementBrochure,
      icon: "fa-cube",
      link: "/ProductManagement"
    },
    {
      title: "Prompt Engineering AI",
      description: "Design LLM workflows for business automation.",
      category: "Artificial Intelligence",
      duration: "6 Months",
      brochure: promptEngineeringBrochure,
      icon: "fa-android",
      link: "/PromptEngineering"
    },
    {
      title: "Digital Marketing",
      description: "Master performance marketing and growth hacking.",
      category: "Marketing",
      duration: "6 Months",
      brochure: digitalMarketingBrochure,
      icon: "fa-bullhorn",
      link: "/DigitalMarket"
    }
  ];

  return (
    <section 
      className="relative w-full py-20 lg:py-32 font-inter border-y border-gray-100 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${premiumBg})`, backgroundColor: "#faf9f6" }}
    >
      {/* Soft overlay to ensure content remains highly legible over the abstract background */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none backdrop-blur-[1px]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl" data-aos="fade-right">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-orange-500" />
              <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Premium Pathways</span>
            </div>
            <h2 className="text-4xl lg:text-[46px] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Master the skills that <span className="text-orange-500">drive the future</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Curated advanced programs designed by industry leaders. Shift your career trajectory with hands-on projects, personalized mentorship, and globally recognized certifications.
            </p>
          </div>
          <div className="hidden md:block" data-aos="fade-left">
            <Link to="/advance" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-7 py-4 text-sm font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all shadow-sm">
              Explore All Programs
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Flagship Course */}
          <div className="lg:col-span-7 group relative flex flex-col justify-between rounded-xl bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden" data-aos="fade-up">
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-50 rounded-bl-[100px] opacity-60 transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-8">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-orange-700">
                  Flagship Program
                </span>
              </div>
              
              <div className="w-16 h-16 rounded-lg bg-gray-900 text-white flex items-center justify-center text-3xl mb-8 shadow-xl shadow-gray-900/10">
                {flagshipCourse.icon}
              </div>

              <h3 className="text-3xl sm:text-[38px] font-extrabold text-gray-900 mb-5 leading-[1.1]">
                {flagshipCourse.title}
              </h3>
              
              <p className="text-[17px] text-gray-600 mb-8 leading-relaxed max-w-lg">
                {flagshipCourse.description}
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                {flagshipCourse.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-md bg-gray-50 border border-gray-100 text-[13px] font-semibold text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 w-full mt-auto">
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 mb-8">
                {flagshipCourse.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="text-gray-400 mb-2 text-lg"><i className={`fa ${stat.icon}`}></i></div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-[15px] font-bold text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/DataScience" className="flex-1 inline-flex items-center justify-center bg-orange-500 text-white px-6 py-4 rounded-md font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25">
                  View Program Details
                </Link>
                <DownloadBrochureButton
                  courseValue={flagshipCourse.title}
                  brochureLink={flagshipCourse.brochure}
                  label="Download Syllabus"
                  className="flex-1 inline-flex items-center justify-center bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-md font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right: Supporting Courses Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {supportingCourses.map((course, idx) => (
              <div key={idx} className="group relative flex items-center p-5 sm:p-6 rounded-lg bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all duration-300 h-full" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="w-14 h-14 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 text-xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors flex-shrink-0 mr-5">
                  <i className={`fa ${course.icon}`}></i>
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {course.category} • {course.duration}
                  </div>
                  <h4 className="text-[16px] font-bold text-gray-900 mb-1 truncate group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-[13px] text-gray-500 line-clamp-1">
                    {course.description}
                  </p>
                </div>

                <Link to={course.link} className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-all flex-shrink-0" aria-label={`Explore ${course.title}`}>
                  <i className="fa fa-arrow-right text-sm"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Strip */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden" data-aos="fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 opacity-50 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10 w-full lg:w-auto">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
              <i className="fa fa-shield text-2xl"></i>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-[19px] mb-1">Industry Vetted Curriculum</h4>
              <p className="text-gray-500 text-sm">Learn the exact tools used by top tech companies</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-8 sm:gap-12 relative z-10 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12">
            <div className="flex flex-col">
              <div className="text-gray-900 font-black text-3xl mb-1">500+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hiring Partners</div>
            </div>
            <div className="flex flex-col">
              <div className="text-gray-900 font-black text-3xl mb-1">30%</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg Salary Hike</div>
            </div>
            <div className="flex flex-col">
              <div className="text-gray-900 font-black text-3xl mb-1">1:1</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Career Mentorship</div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden" data-aos="fade-up">
          <Link to="/advance" className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-4 w-full sm:w-auto text-sm font-bold text-white shadow-lg shadow-orange-500/25">
            Explore All Programs
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default AdvanceCounses;
