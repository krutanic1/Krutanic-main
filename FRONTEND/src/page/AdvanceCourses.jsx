import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import logo from '../assets/courses/logo.jpg'

import AOS from "aos";
import "aos/dist/aos.css";

const AdvanceCourses = () => {
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const courseTopics = [
    { title: "topics", icon: "🌐" },
    { title: "topics", icon: "🎣" },
    { title: "topics", icon: "⚡" },
    { title: "topics", icon: "🛣️" },
    { title: "topics", icon: "🗃️" },
    { title: "topics", icon: "🗃️" },
  ];

  const modules = [
    {
      title: "",
      objectives: "Short description about this module",
      topics: ["topics", "topics", "topics", "topics", "topics"],
    },
    {
      title: "",
      objectives: "Short description about this module",
      topics: ["topics", "topics", "topics", "topics", "topics"],
    },
    {
      title: "",
      objectives: "Short description about this module",
      topics: ["topics", "topics", "topics", "topics", "topics"],
    },
    {
      title: "",
      objectives: "Short description about this module",
      topics: ["topics", "topics", "topics", "topics", "topics"],
    },
    {
      title: "",
      objectives: "Short description about this module",
      topics: ["topics", "topics", "topics", "topics", "topics"],
    },
  ];

  // scrolling
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  // scrolling ends
  // enrolledment slides
  const [currentSlide, setCurrentSlide] = useState(0);
  // scrolling
  // testimonial
  const [currentSlide1, setCurrentSlide1] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > lastScrollPos) {
        setIsVisible(true); // Show on scroll down
      } else {
        setIsVisible(false); // Hide on scroll up
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const slides = [
    {
      title: "Register with us",
      description:
        "Explore pro courses and register for the interested course by filling out the form.",
      icon: "🔍", // Replace with actual icon
    },
    {
      title: "You will get a call",
      description:
        "You will soon get a call from one of our senior executives regarding a few details.",
      icon: "💡", // Replace with actual icon
    },
    {
      title: "Provide the  details",
      description:
        "Simply provide the required information to the senior executive.",
      icon: "🚀", // Replace with actual icon
    },
    {
      title: "Pay  course fee",
      description: "Complete the payment process to enroll in the course.",
      icon: "💳", // Replace with actual icon
    },
  ];

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const features = [
    {
      title: "Lorem Ipsum Dolor Sit Amet",
      description:
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      title: "Sed Ut Perspiciatis",
      description:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    },
    {
      title: "At Veritatis Et Quasi",
      description:
        "Architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    },
    {
      title: "Ut Enim Ad Minima",
      description:
        "Quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
    },
    {
      title: "Quis Autem Vel",
      description:
        "Eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem.",
    },
    {
      title: "Neque Porro Quisquam",
      description:
        "Est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora.",
    },
  ];
  // store section ends here

  // testimonial section
  const testimonial = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod ",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
  ];
  // testimonial ends here

  //  why choose us
  const Difference = [
    {
      title: "Lorem Ipsum Dolor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
      icon: "👥",
    },
    {
      title: "Consectetur Adipiscing",
      description:
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
      icon: "📘",
    },
    {
      title: "Eiusmod Tempor",
      description:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      icon: "📦",
    },
    {
      title: "Labore Et Dolore",
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.",
      icon: "💼",
    },
    {
      title: "Minim Veniam",
      description:
        "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      icon: "💻",
    },
    {
      title: "Ullamco Laboris",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
      icon: "🔗",
    },
  ];
  // FAQ section New one
  const faqData = {
    Program: [
      {
        question: "Lorem ipsum dolor sit amet?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Consectetur adipiscing elit?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Integer nec odio?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
    Eligibility: [
      {
        question: "Qui est eligibile?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Cursus ante dapibus?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Sed cursus ante dapibus?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
    Community: [
      {
        question: "Sed cursus ante dapibus?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Sed cursus ante dapibus?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Career benefits?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
    Lectures: [
      {
        question: "Lectures live or recorded?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Missed a lecture?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "How long are the classes?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
    Certification: [
      {
        question: "Certification available?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Globally recognized?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Exams for certification?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
    Opportunities: [
      {
        question: "Career opportunities?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Placement assistance?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "Hiring from this program?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
    ],
  };
  // NEW faq ends here
  const learn = [ 
    {
      title: "Self paced video content",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      icon: "📅",
    },
    {
      title: "Project driven approach to achieve outcomes",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      icon: "📘",
    },
    {
      title: "Office hours with Mentors for clearing blockers",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      icon: "🕒",
    },
    {
      title: "Access to network of 1000+ learners",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
      icon: "👥",
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  return (
    <div id="advance-course">
      <div id="advancecourse">
        {/* hero part */}
        <section className="">
          <div className="py-12 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">
                Lorem Ipsum:{" "}
                <span className="text-orange-500">
                  Advance Your Career With Our Program
                </span>
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 ">
                <div className="flex flex-col items-center p-6 border border-gray-700 rounded-md mt-6">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                    >
                      <path d="M16 10V7a4 4 0 10-8 0v3H5v10h14V10h-3zm-6 0V7a2 2 0 114 0v3H10z" />
                    </svg>
                  </div>

                  <p className="mt-4 font-semibold text-lg">Batch Starting</p>
                  <p className="text-orange-500">Month Name</p>
                  {/* <p className="mt-2 text-sm">5 seats left</p> */}
                </div>

                <div className="flex flex-col items-center p-6 border  border-gray-700 rounded-md mt-6">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                    >
                      <path d="M5 3v18l7-3 7 3V3H5zm12 13l-5-2.18L7 16V5h10v11z" />
                    </svg>
                  </div>
                  <p className="mt-4 font-semibold text-lg">Duration</p>
                  <p className="text-orange-500">Months </p>
                </div>

                <div className="flex flex-col items-center p-6 border border-gray-700 rounded-md mt-6">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                    >
                      <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm1-13h-2v5h5v-2h-3z" />
                    </svg>
                  </div>
                  <p className="mt-4 font-semibold text-lg">Program Rating</p>
                  <p className="text-orange-500">Rating ⭐</p>
                </div>
              </div>
              <div className="flex justify-center gap-7 ">
                <button className="bg-transparent border border-orange-500 mt-9 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-500 hover:text-black transition">
                  Download Brochure
                </button>
                <button className="bg-transparent border border-orange-500 mt-9 text-orange-500 px-6 py-2 rounded-md hover:bg-orange-500 hover:text-black transition">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Overview Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <h2
              data-aos="fade-down"
              className="text-3xl font-bold text-center mb-12 text-orange-500"
            >
              Course Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {courseTopics.map((topic, index) => (
                <div
                  data-aos="fade-down"
                  key={index}
                  className="bg-[#080810] p-6 rounded-lg text-center "
                >
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-bold uppercase text-white  hover:text-orange-700 transition-colors duration-300">
                    {topic.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-10 px-20">
          <h2
            data-aos="fade-down"
            className="text-3xl font-bold text-center mb-5 text-orange-500"
          >
            Curriculum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modules Section */}
            <div data-aos="fade-down" className="space-y-4 w-full ">
              {modules.map((module, index) => (
                <div key={index} className="border-b border-gray-700 pb-4">
                  <button
                    className="w-full text-left hover:text-orange-400 transition-colors duration-300 focus:outline-none"
                    onClick={() =>
                      document
                        .getElementById(`module-${index}`)
                        .classList.toggle("hidden")
                    }
                  >
                    <h3 className="text-xl font-semibold">
                      Module {index + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-400">{module.objectives}</p>
                  </button>
                  <div id={`module-${index}`} className="hidden mt-4">
                    <ul className="list-disc pl-6 text-gray-300">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="mb-2">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Section */}
            <div
              data-aos="fade-down"
              className="w-full  rounded-xl overflow-hidden"
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1661344287754-5b54e8feb18b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Curriculum"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* download curriculum section */}
        <section className="flex justify-center items-center">
          <div
            data-aos="fade-down"
            className=" p-6 flex justify-between items-center flex-wrap gap-5 rounded-lg shadow-lg border-2 border-orange-600 w-3/4"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">
                Download your course Curriculum
              </h2>
              <p className="text-gray-400 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                impedit exercitationem repellat beatae rerum.
              </p>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 8a1 1 0 011-1h12a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm9 4a1 1 0 10-2 0V9.707l-.293.293a1 1 0 11-1.414-1.414l2-2a1 1 0 011.414 0l2 2a1 1 0 11-1.414 1.414L12 9.707V12z"
                  clipRule="evenodd"
                />
              </svg>
              Download
            </button>
          </div>
        </section>

        {/* testimonial section  */}
        <section className="">
          <div className="py-16 px-4">
            <div className="text-center mb-8">
              <h3 data-aos="fade-down" className="text-3xl font-bold">
                What our <span className="text-orange-500">Students</span> have
                to say
              </h3>
              <p data-aos="fade-down" className="mt-4 text-gray-400">
                Our students rave about the impactful and practical knowledge
                they gain in our Data Analysis course. Have a look at it!
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Bubble Images */}
              <div
                data-aos="fade-down"
                className="flex items-center justify-center space-x-4 mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-red-300"></div>
                <div className="w-16 h-16 rounded-full bg-blue-300"></div>
                <div className="w-20 h-20 rounded-full bg-purple-300"></div>
                <div className="w-14 h-14 rounded-full bg-yellow-300"></div>
                <div className="w-10 h-10 rounded-full bg-green-300"></div>
              </div>

              {/* Grey Box Content */}
              <div
                data-aos="fade-down"
                className="bg-[#080810] text-gray-300 p-6 rounded-lg w-3/4 max-w-2xl"
              >
                <p className="text-lg">{testimonial[currentSlide1].text}</p>
              </div>

              {/* Dots */}
              <div data-aos="fade-down" className="flex space-x-2 mt-4">
                {testimonial.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide1(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentSlide1 === index ? "bg-red-500" : "bg-gray-400"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* new FAQ section */}
        <section className="">
          <div className="">
            <h1
              data-aos="fade-down"
              className="text-center justify-cente text-4xl font-bold text-orange-700"
            >
              FAQ
            </h1>
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-1/4 w-full p-4 border-b md:border-b-0  border-orange-700">
                <ul data-aos="fade-down" className="space-y-2">
                  {Object.keys(faqData).map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setOpenFAQ(null); // Reset any open question
                      }}
                      className={`cursor-pointer py-2 px-4 rounded-lg ${
                        activeCategory === category
                          ? "bg-[#080810] text-orange-700"
                          : ""
                      }`}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Content */}
              <div className="md:w-3/4 w-full p-6">
                <h2
                  data-aos="fade-down"
                  className="text-2xl font-bold mb-4 text-orange-700"
                >
                  {activeCategory} -
                </h2>
                <ul data-aos="fade-down" className="space-y-4">
                  {faqData[activeCategory].map((faq, index) => (
                    <li
                      className="border border-[rgb(255,255,255,0.2)] overflow-hidden rounded-lg "
                      key={index}
                    >
                      <button
                        onClick={() =>
                          setOpenFAQ(openFAQ === index ? null : index)
                        }
                        className="w-full text-left bg-[#080810] text-white py-3 px-5  flex justify-between items-center"
                      >
                        {faq.question}
                        <span className="text-orange-400">
                          {openFAQ === index ? "-" : "+"}
                        </span>
                      </button>
                      {openFAQ === index && (
                        <div className="p-4 bg-[rgb(255,255,255,0.2)] text-white">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* enrollement slide */}
        <section className="">
          <div className="">
            <h1
              data-aos="fade-down"
              className="text-center text-3xl text-orange-500"
            >
              How to Enroll with us.
            </h1>
            <div className="relative w-full py-10 px-5 text-white flex items-center justify-center">
              {/* Slide Content */}
              <div className="flex items-center justify-center  flex-wrap text-center gap-20 px-20 sm:flex-col md:flex-row">
                {slides.map((slide, index) => (
                  <div
                    data-aos="fade-down"
                    key={index}
                    className={`flex flex-col items-center transition-all hover:scale-110 duration-300 ease-linear`}
                  >
                    <div className="text-4xl">{slide.icon}</div>
                    <h3 className="text-xl font-semibold mt-4">
                      <span className="mr-2">{index + 1}.</span>
                      {slide.title}
                    </h3>
                    <p className="text-sm mt-2">{slide.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* scrolling section */}
        <section>
          <div
            className={`fixed bottom-0 left-0 w-full z-10 bg-[#fff] shadow-md flex justify-between items-center px-4 py-4   transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <span className="text-lg font-semibold text-black">
              Lorem ipsum dolor sit.
            </span>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 border rounded-md text-white bg-black  hover:text-orange-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-9-13.5v12m0 0L7.5 10.5m3.5 2.5L16.5 10.5"
                  />
                </svg>
                Brochure
              </button>
              <button className="px-4 py-2 rounded-md text-white bg-black hover:text-orange-700 ">
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* why choose us */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2
              data-aos="fade-down"
              className="text-white text-3xl font-bold mb-6"
            >
              why Choose{" "}
              <span className="text-orange-500">Particular Course Name</span>
            </h2>
            <p data-aos="fade-down" className="text-gray-400 mb-12">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Difference.map((Difference, index) => (
                <div
                  data-aos="fade-down"
                  key={index}
                  className="bg-[#080810] p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition"
                >
                  <div className="text-orange-500 text-4xl mb-4">
                    {Difference.icon}
                  </div>
                  <h3 className="text-lg text-orange-500 font-bold  mb-3">
                    {Difference.title}
                  </h3>
                  <p className="text-white  ">{Difference.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

         {/* why learn with us */}
        <section className="bg-black text-white py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-3xl font-bold mb-8 text-orange-600">
              Why learn with krutanic?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
              {learn.map((learn, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-[#080810]  p-6 rounded-lg hover:shadow-lg transition duration-300"
                >
                  <div className="text-orange-500 text-4xl mb-4 hover:text-white">
                    {learn.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {learn.title}
                  </h3>
                  <p className="text-gray-400">{learn.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* store section  */}
        <section>
          <div className="bg-white py-10 px-6 md:px-16">
            <h2
              data-aos="fade-down"
              className="text-2xl md:text-3xl text-black font-bold text-center mb-10"
            >
              What Do We Have In Store For You?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  data-aos="fade-down"
                  key={index}
                  className="relative bg-white p-6 shadow-lg rounded-lg border-l-8 border-orange-500"
                >
                  <div className="absolute -top-4 left-4 bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                    <span className="text-xl font-bold">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white py-10 px-4 ">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden  border-black">
              <div className="md:w-1/3 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className=" rounded-full flex items-center justify-center shadow-md mx-auto">
                    <img src={logo} alt="" />
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-6 text-center md:text-left">
                <h2
                  data-aos="fade-down"
                  className="text-2xl font-semibold text-gray-800 mb-4"
                >
                  Get in Touch
                </h2>
                <p data-aos="fade-down" className="text-gray-600 mb-6">
                Want to learn more about how Krutanic can shape your
                career? Contact us today, and let’s build your future together!
                </p>
                <button
                  data-aos="fade-down"
                  onClick={handleOpenDialog}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md"
                >
                  Connect With Us
                </button>
              </div>
            </div>

            {/* Dialog Box */}
            {isDialogOpen && (
            <div id="talktoadvisor" >
              <div className="advisor" >
                {/* Left: Form Section */}
                <div className=" relative">
                  <img
                    src={suryansh}
                    alt="Advisor"
                    className=""
                  />
                  {/* Close Button */}
                  <button
                    onClick={handleCloseDialog}
                    className="absolute top-0 left-0 text-xl text-white bg-black  rounded-full px-2 "
                  >
                    X
                  </button>
                </div>
               

                {/* Right: Image Section */}
                <div >
                  <h3 className="text-2xl font-semibold text-black mb-1.5">
                    Talk to Our Advisor
                  </h3>
                  <form>
                    <div className="mb-1.5">
                      <input
                        type="text"
                        id="name"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-1.5">
                      <input
                        type="email"
                        id="email"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mb-1.5">
                      <input
                        type="text"
                        id="phone"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    <div className="mb-1.5">
                      <select
                        id="program"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                      >
                        <option>What is your current role?</option>
                        <option>Web Development</option>
                        <option>Data Science</option>
                        <option>UI/UX Design</option>
                        <option>Digital Marketing</option>
                      </select>
                    </div>
                    <div className="mb-1.5">
                      <select
                        id="program"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                      >
                        <option>Degree</option>
                        <option>Web Development</option>
                        <option>Data Science</option>
                        <option>UI/UX Design</option>
                        <option>Digital Marketing</option>
                      </select>
                    </div>
                    <div className="mb-1.5">
                      <select
                        id="program"
                        className="w-full border-b border-gray-300 rounded-md p-2"
                      >
                        <option>Year of experience</option>
                        <option>Web Development</option>
                        <option>Data Science</option>
                        <option>UI/UX Design</option>
                        <option>Digital Marketing</option>
                      </select>
                    </div>
                    <div className="flex justify-start">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdvanceCourses;
