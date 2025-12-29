import React, { useState } from "react";
import { Link } from "react-router-dom";

// import ds from '../assets/Advanced Course Images/Data science/DS 3.jpg'
// import dm from '../assets/Advanced Course Images/Digital Markting/DM 1.jpg'
// import ib from '../assets/Advanced Course Images/Investment banking/IB 6.jpg'
// import mern from '../assets/Advanced Course Images/Mern Stack Development/MSD 1.jpg'
// import pm from '../assets/Advanced Course Images/Product management/PM 4.jpg'
// import pfm from '../assets/Advanced Course Images/Performance marketing/PM 3.jpg'

const AdvanceCounses = () => {
  const courses = [
    {
      title: "MERN Stack Devlopment",
      description:
        "Building web apps using MongoDB, Express.js, React, and Node.js",
      icon: <i className="fa fa-code" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Data Science",
      description:
        "Analyzing data to find insights that guide business decisions.",
      icon: <i className="fa fa-database" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Digital Marketing",
      description:
        "Promoting products online through channels like social media to drive business goals.",
      icon: <i className="fa fa-bullhorn" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Investment Banking",
      description:
        "Advising on financial transactions and raising capital for companies.",
      icon: <i className="fa fa-bank"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Product Management",
      description:
        "Overseeing a product’s development from concept to market.",
      icon: <i className="fa fa-cube" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Performance Marketing",
      description:
        "Marketing based on measurable actions, like clicks or sales.",
      icon: <i className="fa fa-line-chart" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Automation Testing",
      description:
        "Streamlining Quality with Precision: Empowering Automation Testing",
      icon: <i className="fa fa-refresh" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
    {
      title: "Prompt Engineering AI",
      description:
        "Crafting the Future: Precision Prompt Engineering for Next-Gen AI",
      icon: <i className="fa fa-android" aria-hidden="true"></i>,
      level: "Advanced",
      duration: "6 Months",
    },
  ];

  // State to manage which section is open
  const [openSection, setOpenSection] = useState(1);

  // Function to handle section click
  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

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
    <section>
      <div className="rounded-xl py-1 bg-center bg-cover bg-[url('https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=1639&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
       <h1 data-aos="zoom-in">| Our advanced program</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-[#00000021] border hover:scale-105 ease-linear duration-300 backdrop-blur-sm shadow-[#070707c7] drop-shadow-xl text-white rounded-lg shadow-md p-4 m-3"
            >
              <h2 className=" text-lg font-bold mb-2">
                <span className="text-3xl mr-3 text-[#FE4323]">{course.icon}</span>
                {course.title}
              </h2>
              <p className=" text-sm mb-4">{course.description}</p>
              <p className=" text-sm mb-4">Duration: {course.duration}</p>
              <p className=" text-sm">Level: {course.level}</p>
              {/* <button className=" bg-[#f15b29] text-white font-bold py-2 px-4 rounded">
                Know more
              </button> */}
            </div>
          ))}
        </div>
        <div className="my-10 text-center">
          <button className="border group px-3 py-1.5 rounded-full">
            <Link to="/advance"> View All Advanced Courses <i className="fa fa-arrow-right ml-2 border  rounded-full p-2 group-hover:translate-x-1 ease-linear duration-300 " aria-hidden="true"></i></Link> 
          </button>
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
       <h1 className="text-2xl font-bold my-10">
         | Why Choose Our Advanced Courses?
        </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              {Difference.map((Difference, index) => (
                <div
                  key={index}
                  className="provide1 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition"
                >
                  <div className="text-[#f15b29] text-4xl mb-4">
                    {Difference.icon}
                  </div>
                  <h3 className="text-lg text-[#f15b29] font-bold  mb-3">
                    {Difference.title}
                  </h3>
                  <p className="text-white  ">{Difference.description}</p>
                </div>
              ))}
            </div>
    </div>
    </section>
  );
};

export default AdvanceCounses;
