import React from "react";
import { Link } from "react-router-dom";
import mernBrochure from "../../krutanic/Mern Stack Web Development Advanced Program.pdf";
import dataScienceBrochure from "../../krutanic/DataScienceAdvancedProgram.pdf";
import digitalMarketingBrochure from "../../krutanic/Digital Marketing Advanced Program.pdf";
import investmentBankingBrochure from "../../krutanic/Investment Banking Advanced Program.pdf";
import productManagementBrochure from "../../krutanic/Product management Advanced program.pdf";
import automationTestingBrochure from "../../krutanic/Automation testing Advanced Program.pdf";
import promptEngineeringBrochure from "../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";

// import ds from '../assets/Advanced Course Images/Data science/DS 3.jpg'
// import dm from '../assets/Advanced Course Images/Digital Markting/DM 1.jpg'
// import ib from '../assets/Advanced Course Images/Investment banking/IB 6.jpg'
// import mern from '../assets/Advanced Course Images/Mern Stack Development/MSD 1.jpg'
// import pm from '../assets/Advanced Course Images/Product management/PM 4.jpg'
// import pfm from '../assets/Advanced Course Images/Performance marketing/PM 3.jpg'

const AdvanceCounses = () => {
  const courses = [
    {
      institute: "KRUTANIC School Of Technology",
      title: "Data Science",
      description: "Analyze complex datasets and build practical machine learning solutions for business use-cases.",
      icon: <i className="fa fa-database" aria-hidden="true"></i>,
      badge: "New Course",
      badgeClass: "bg-[#1d5fae] text-white",
      support: "Live Project Mentoring",
      credential: "Certification",
      duration: "6 Months",
      batch: "31st May",
      brochure: dataScienceBrochure,
    },
    {
      institute: "KRUTANIC School Of Technology",
      title: "Data Analytics",
      description: "Master Excel, SQL, Python, and Power BI to drive business decisions with data.",
      icon: <i className="fa fa-bar-chart" aria-hidden="true"></i>,
      badge: "In Demand",
      badgeClass: "bg-[#086f70] text-white",
      support: "Industrial Project Case Studies",
      credential: "Professional Certificate",
      duration: "6 Months",
      batch: "31st May",
      brochure: "", 
    },
    {
      institute: "KRUTANIC School Of Technology",
      title: "Digital Marketing",
      description: "Master performance marketing, social media strategy, and data-driven growth campaigns.",
      icon: <i className="fa fa-bullhorn" aria-hidden="true"></i>,
      badge: "Popular",
      badgeClass: "bg-[#0b6b8a] text-white",
      support: "Placement & Portfolio Support",
      credential: "Advanced Certificate",
      duration: "6 Months",
      batch: "31st May",
      brochure: digitalMarketingBrochure,
    },

    {
      institute: "KRUTANIC Product School",
      title: "Product Management",
      description: "Plan and launch products with user-first strategy, agile execution, and growth metrics.",
      icon: <i className="fa fa-cube" aria-hidden="true"></i>,
      badge: "Career Switch",
      badgeClass: "bg-[#7c3aed] text-white",
      support: "Mentor Feedback",
      credential: "Executive Program",
      duration: "6 Months",
      brochure: productManagementBrochure,
    },
    {
      institute: "KRUTANIC AI School",
      title: "Prompt Engineering AI",
      description: "Design reliable prompts and AI workflows for productivity, automation, and business applications.",
      icon: <i className="fa fa-android" aria-hidden="true"></i>,
      badge: "Future Skills",
      badgeClass: "bg-[#dc2626] text-white",
      support: "AI Career Guidance",
      credential: "Certification",
      duration: "6 Months",
      brochure: promptEngineeringBrochure,
    },
    {
      institute: "KRUTANIC School Of Technology",
      title: "MERN Stack Development",
      description: "Build production-ready web apps with MongoDB, Express.js, React, and Node.js.",
      icon: <i className="fa fa-code" aria-hidden="true"></i>,
      badge: "Bestseller",
      badgeClass: "bg-[#6b0f44] text-white",
      support: "360 Degree Career Support",
      credential: "Executive Diploma",
      duration: "6 Months",
      brochure: mernBrochure,
    },
    {
      institute: "KRUTANIC QA School",
      title: "Automation Testing",
      description: "Build robust test automation pipelines for web apps with real-world QA workflows.",
      icon: <i className="fa fa-refresh" aria-hidden="true"></i>,
      badge: "In Demand",
      badgeClass: "bg-[#2563eb] text-white",
      support: "Job Ready Assessments",
      credential: "Advanced Certificate",
      duration: "6 Months",
      brochure: automationTestingBrochure,
    },
  ];

  // const sections = [
  //   {
  //     title: "Expert-led instruction from industry professionals",
  //     content: "Learn from the best! Our courses are taught by experienced professionals who bring real-world insights and advanced expertise to every lesson."
  //   },
  //   {
  //     title: "Hands-on projects and real-world applications",
  //     content: "Get the practical experience you need to succeed. Our courses focus on hands-on projects and real-life scenarios, giving you the opportunity to apply what you’ve learned in meaningful ways."
  //   },
  //   {
  //     title: "Flexible learning schedules to fit your lifestyle",
  //     content: "Life is busy! Our flexible online and in-person options allow you to learn at your own pace, fitting your studies around your work, family, and other commitments."
  //   },
  //   {
  //     title: "Cutting-edge curriculum updated regularly",
  //     content: "Stay ahead of the curve. Our curriculum is continually updated to reflect the latest industry trends, tools, and techniques, ensuring that you’re always learning the most relevant skills."
  //   },
  //   {
  //     title: "Comprehensive support and mentoring",
  //     content: "You’re never alone in your learning journey. We offer personalized support, mentorship, and access to a vibrant community of fellow learners to guide you every step of the way."
  //   },
  //   {
  //     title: "Networking opportunities with professionals and peers",
  //     content: "Connect with a wide network of industry professionals, alumni, and fellow students. Our courses provide numerous opportunities for networking, helping you expand your career prospects."
  //   },
  //   {
  //     title: "Certification and career advancement",
  //     content: "Enhance your resume with a recognized certification upon completion of your course. Our graduates often experience accelerated career growth, promotions, and new job opportunities in their fields."
  //   },
  //   {
  //     title: "Global learning community",
  //     content: "Join a diverse, global group of learners from all corners of the world. Share ideas, collaborate, and expand your perspectives with fellow students from a variety of backgrounds and industries."
  //   },
  //   {
  //     title: "Tailored learning paths for every skill level",
  //     content: "Whether you're a beginner or looking to level up your expertise, we offer courses for all levels. Our tailored learning paths ensure that you get the most out of your educational experience, no matter your starting point."
  //   }
  // ];

  const Difference = [
    {
      title: "Resume Making With AI",
      description: "Create AI-enhanced, personalized resumes.",
      icon: "📝",
    },
    {
      title: "Hands-on Learning",
      description: "Learn through real-world projects.",
      icon: "🔧",
    },
    {
      title: "Careers Counselling",
      description: "Get personalized career advice.",
      icon: "💼",
    },
    {
      title: "AI-Powered Mock Interviews",
      description: "Prepare with AI-driven mock interviews.",
      icon: "🤖",
    },
    {
      title: "Help With Referrals",
      description: "Receive guidance on job referrals.",
      icon: "🔗",
    },
    {
      title: "Global Network",
      description: "Connect with professionals worldwide.",
      icon: "🌐",
    },
  ];




  return (
    <section className="space-y-12">
      <div className="rounded-[28px] border border-[#ead9d9] bg-[#f3f3f5] p-4 md:p-7">

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#111827]">Trending Courses</p>
          <h1 data-aos="zoom-in" className="mt-2 text-3xl font-bold leading-tight text-[#030712] md:text-5xl">
            Explore our <span className="text-[#d97706]">advanced programs</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group flex h-full flex-col rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
            >
              <div className="mb-4">
                <div className="flex min-h-[142px] w-full items-center justify-center rounded-2xl bg-[#fff5ee] text-[88px] text-[#f15b29]">
                  {course.icon}
                </div>
              </div>

              <h2 className="mt-1 text-[34px] leading-[1.12] font-bold text-[#111827]">
                {course.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4b5563]">{course.description}</p>

              <span className="mt-3 inline-flex w-fit rounded-lg bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#0d58a6]">
                {course.support}
              </span>
              <div className="mt-4 space-y-2 text-sm text-[#111827]">
                <p className="flex items-center gap-2 text-orange-600 font-bold">
                  <i className="fa fa-clock-o" aria-hidden="true"></i>
                  <span>Cohort: {course.batch || "Upcoming"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa fa-id-card-o" aria-hidden="true"></i>
                  <span>{course.credential}</span>
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa fa-calendar-o" aria-hidden="true"></i>
                  <span>{course.duration}</span>
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  to="/advance"
                  className="inline-flex items-center justify-center rounded-xl border border-[#111827] px-3 py-2.5 text-base font-semibold text-[#111827] transition hover:bg-[#111827] hover:text-white"
                >
                  View Program
                </Link>
                {(course.title === "Digital Marketing" || course.title === "Data Analytics") ? (
                  <a
                    href={course.brochure}
                    download={`${course.title} - Brochure.pdf`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f15b29] px-3 py-2.5 text-base font-semibold text-white transition hover:bg-[#d94f21]"
                  >
                    <i className="fa fa-arrow-down" aria-hidden="true"></i>
                    Syllabus
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-400 px-3 py-2.5 text-base font-semibold text-white cursor-not-allowed"
                  >
                    <i className="fa fa-lock" aria-hidden="true"></i>
                    Syllabus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link to="/advance" className="inline-flex items-center gap-2 rounded-full bg-[#f15b29] px-5 py-2.5 font-semibold text-white shadow-[0_10px_24px_rgba(241,91,41,0.25)] transition hover:bg-[#d94f21]">
            View All Advanced Courses
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
      </div>

      {/* <div className="mt-8">
        <h1 className="text-2xl font-bold my-6">
         | Why Choose Our Advanced Courses?
        </h1>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Expert-led instruction from industry professionals
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Hands-on projects and real-world applications
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Flexible learning schedules to fit your lifestyle
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Cutting-edge curriculum updated regularly
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Comprehensive support and mentoring
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Networking opportunities with professionals and peers
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Certification and career advancement
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Global learning community
          </li>
          <li className="flex items-center gap-2">
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
            Tailored learning paths for every skill level
          </li>
        </ul>
      </div> */}
      <div>
        <h1 className="my-10 text-2xl font-bold">
          | Why Choose Our Advanced Courses?
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          {Difference.map((Difference, index) => (
            <div
              key={index}
              className="provide1 rounded-2xl border border-[#f0dfd6] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-[#f15b29] text-4xl mb-4">
                {Difference.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#f15b29]">
                {Difference.title}
              </h3>
              <p className="text-[#334155]">{Difference.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvanceCounses;
