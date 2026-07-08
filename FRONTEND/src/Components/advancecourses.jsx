import React from "react";
import { Link } from "react-router-dom";
import mernBrochure from "../../krutanic/Mern Stack Web Development Advanced Program.pdf";
import dataScienceBrochure from "../../krutanic/DataScienceAdvancedProgram.pdf";
import dataAnalyticsBrochure from "../../krutanic/dataanalytices new advnace Brouchuer.pdf";
import digitalMarketingBrochure from "../../krutanic/Digital Marketing Advanced Program.pdf";
import investmentBankingBrochure from "../../krutanic/Investment Banking Advanced Program.pdf";
import productManagementBrochure from "../../krutanic/Product management Advanced program.pdf";
import promptEngineeringBrochure from "../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";
import DownloadBrochureButton from "../page/AdvanceCourse/Components/DownloadBrochureButton";

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
      batch: "10th Aug",
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
      batch: "10th Aug",
      brochure: dataAnalyticsBrochure,
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
      batch: "Upcoming",
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
      title: "AI-Driven Resume Building",
      description: "Craft personalized, ATS-friendly resumes optimized by advanced AI tools.",
      icon: <i className="fa fa-file-text-o" aria-hidden="true"></i>,
    },
    {
      title: "Project-Based Learning",
      description: "Master complex concepts through real-world, industry-relevant projects.",
      icon: <i className="fa fa-laptop" aria-hidden="true"></i>,
    },
    {
      title: "Dedicated Career Counseling",
      description: "Receive personalized mentorship to navigate your career trajectory.",
      icon: <i className="fa fa-briefcase" aria-hidden="true"></i>,
    },
    {
      title: "AI-Powered Mock Interviews",
      description: "Refine your interview skills with advanced AI simulation technologies.",
      icon: <i className="fa fa-comments-o" aria-hidden="true"></i>,
    },
    {
      title: "Direct Referral Support",
      description: "Gain exclusive access to job referrals through our partner network.",
      icon: <i className="fa fa-users" aria-hidden="true"></i>,
    },
    {
      title: "Global Alumni Network",
      description: "Connect and collaborate with professionals and leaders worldwide.",
      icon: <i className="fa fa-globe" aria-hidden="true"></i>,
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
                <DownloadBrochureButton
                  courseValue={course.title}
                  brochureLink={course.brochure}
                  label="Syllabus"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f15b29] px-3 py-2.5 text-base font-semibold text-white transition hover:bg-[#d94f21]"
                />
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

      <div className="mt-16 px-4 md:px-0">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold leading-tight text-[#030712] md:text-4xl">
            Why Choose Our <span className="text-[#f15b29]">Advanced Courses</span>?
          </h2>
          <p className="mt-4 text-base text-[#4b5563]">
            Elevate your career with our industry-leading curriculum and comprehensive support network.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Difference.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-start rounded-2xl border border-[#e5e7eb] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#f15b29] hover:shadow-[0_12px_24px_rgba(241,91,41,0.08)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff5ee] text-2xl text-[#f15b29] transition-colors group-hover:bg-[#f15b29] group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#111827]">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#4b5563]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvanceCounses;
