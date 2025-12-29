import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from '../../API';
import { RiCustomerService2Fill } from "react-icons/ri";
import BenefitsofLearning from "./Components/BenefitsofLearning";

import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";

import PM from "../../assets/Advanced Course Images/Performance marketing/PM.png";
import curriculumimage from "../../assets/Advanced Course Images/Performance marketing/pm.jpg";
import FlexiblePaymentOption from "./Components/FlexiblePaymentOption";

import pdfpm from "../../../krutanic/Performance marketing Advanced Program.pdf";
import toast ,{Toaster} from 'react-hot-toast';
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
const Performancemarket = () => {
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    currentRole: "",
    experience: "",
    goal: "",
    goalOther: "",
    domain: "",
    domainOther: "",
    interestedDomain: "",
  });


  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const courseTopics = [
    { title: "Advanced Paid Media Campaign Strategiescs", icon: "🌐" },
    { title: "Conversion Rate Optimization (CRO)", icon: "🎣" },
    { title: "Data-Driven Marketing Analytics", icon: "⚡" },
    { title: "Social Media Ads and PPC Management", icon: "🛣️" },
    { title: "A/B Testing and Campaign Optimization", icon: "🗃️" },
    { title: "Attribution Models and ROI Measurement", icon: "🗃️" },
  ];

  const modules = [
    {
      title: "Advanced Paid Media Campaign Strategies",
      objectives:
        "Learn advanced techniques for running highly targeted paid media campaigns on platforms like Google Ads and Facebook.",
      topics: [
        "Google Ads Campaigns",
        "Facebook and Instagram Ads",
        "Bing Ads and Retargeting",
        "toBudget Allocation and Bidding Strategies",
        "Campaign Reporting and Analytics",
      ],
    },
    {
      title: "Conversion Rate Optimization (CRO)",
      objectives:
        "Master the strategies and tools for optimizing landing pages and websites to increase conversions.",
      topics: [
        "Landing Page Optimization",
        "Heatmaps and User Behavior Analysis",
        "A/B Testing and Multivariate Testing",
        "Funnel Analysis and Optimization",
        "Tools for CRO (Optimizely, Unbounce)",
      ],
    },
    {
      title: "Data-Driven Marketing Analytics",
      objectives:
        "Understand how to leverage data to optimize campaigns and measure ROI effectively.",
      topics: [
        "Google Analytics for Campaigns",
        "Metrics and KPIs for Performance Marketing",
        "Attribution Models",
        "Audience Segmentation and Targeting",
        "Data Visualization and Reporting",
      ],
    },
    {
      title: "Social Media Ads and PPC Management",
      objectives:
        "Learn to design and manage successful PPC and social media ad campaigns to boost traffic and engagement.",
      topics: [
        "Facebook Ads Manager",
        "Instagram and LinkedIn Ads",
        "Google Display Network",
        "Paid Search Campaigns",
        "Social Media Strategy and Budgeting",
      ],
    },
    {
      title: "A/B Testing and Campaign Optimization",
      objectives:
        "Apply A/B testing strategies to optimize ad creatives, landing pages, and campaigns for better performance.",
      topics: [
        "Testing Ad Copy and Creatives",
        "Measuring and Analyzing Test Results",
        "Continuous Campaign Optimization",
        "Best Practices for A/B Testing",
        "Tools for A/B Testing (VWO, Google Optimize)",
      ],
    },
  ];

  const jobRoles = [
    {
      title: "Performance Marketing Manager",
      description:
        "Leads paid campaigns and optimizes performance across platforms.",
    },
    {
      title: "PPC Specialist",
      description:
        "Manages paid search and display advertising campaigns to maximize conversions.",
    },
    {
      title: "Social Media Ads Specialist",
      description:
        "Creates and optimizes paid ad campaigns on social media platforms like Facebook, Instagram, and LinkedIn.",
    },
    {
      title: "Conversion Rate Optimization (CRO) Specialist",
      description:
        "Focuses on improving the conversion rates of landing pages and websites.",
    },
    {
      title: "Marketing Analyst",
      description:
        "Analyzes data and campaign performance to optimize marketing strategies.",
    },
    {
      title: "Campaign Manager",
      description:
        "Oversees digital marketing campaigns, including strategy development, execution, and optimization.",
    },
    {
      title: "Biddable Media Specialist",
      description:
        "Manages paid advertising campaigns across platforms to maximize ROI.",
    },
    {
      title: "Paid Media Manager",
      description:
        "Oversees and optimizes paid media strategies to drive brand growth.",
    },
    {
      title: " Programmatic Advertising Specialist",
      description:
        "Automates and manages digital ad placements for targeted audience reach.",
    },
  ];

  const Difference = [
    {
      title: "Data-Driven Results",
      description:
        "Focuses on measurable outcomes, using metrics like CTR, CPC, and ROAS to optimize campaigns.",
      icon: "👥",
    },
    {
      title: "High Earnings",
      description:
        "Performance-based pay leads to lucrative compensation tied to campaign success.",
      icon: "📘",
    },
    {
      title: "Constant Optimization",
      description:
        "The role is dynamic, requiring ongoing adjustments to campaigns for improved performance.",
      icon: "📦",
    },
    {
      title: "Cross-Channel Expertise",
      description:
        "Involves working with multiple channels like PPC and social media to drive conversions.",
      icon: "💼",
    },
    {
      title: "Impactful Outcomes",
      description:
        "Directly contributes to a company’s revenue growth through optimized campaigns.",
      icon: "💻",
    },
    {
      title: "Fast-Paced Growth",
      description:
        "The need for constant analysis and refinement ensures you’re always learning and improving.",
      icon: "🔗",
    },
  ];

  const faqData = {
    Program: [
      {
        question:
          "What topics are covered in the Performance Marketing program?",
        answer:
          "The program covers advanced paid media campaigns, conversion rate optimization (CRO), A/B testing, social media ads, and performance marketing analytics.",
      },
      {
        question: "How is the course delivered?",
        answer:
          "The course is delivered online with a mix of live sessions, recorded lectures, hands-on workshops, and real-world projects.",
      },
      {
        question: "Will I get hands-on experience?",
        answer:
          "Yes, the course includes live projects, case studies, and campaign management, providing real-world experience in performance marketing.",
      },
      {
        question: "How long is the program?",
        answer:
          "The program runs for 6 months, with flexible schedules suitable for working professionals.",
      },
    ],
    Eligibility: [
      {
        question: "What are the prerequisites for the program?",
        answer:
          "Basic knowledge of digital marketing or familiarity with online platforms is recommended but not mandatory.",
      },
      {
        question: "Do I need a background in performance marketing?",
        answer:
          "No, this course is suitable for both beginners and individuals looking to expand their marketing skills.",
      },
      {
        question: "Can beginners apply?",
        answer:
          "Yes, the program is designed for beginners who want to master performance marketing strategies.",
      },
      {
        question: "Is there any age restriction?",
        answer:
          "No, the course is open to learners of all ages who meet the basic eligibility criteria.",
      },
    ],
    Community: [
      {
        question: "How can I interact with other participants?",
        answer:
          "Engage with peers through discussion forums, group projects, and networking opportunities designed to foster collaboration and learning.",
      },
      {
        question: "Is mentorship available?",
        answer:
          "Yes, personalized mentoring from industry professionals will guide you through the course and provide valuable insights.",
      },
      {
        question: "Can I access support after the course ends?",
        answer:
          "Absolutely! Graduates have continued access to community forums, alumni events, and ongoing learning resources.",
      },
      {
        question: "How diverse is the community?",
        answer:
          "Our community is global, consisting of learners and professionals from various industries and countries.",
      },
    ],
    Lectures: [
      {
        question: "Are the lectures pre-recorded or live?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
      },
      {
        question: "How interactive are the sessions?",
        answer:
          "The live sessions are highly interactive, with opportunities for Q&A, hands-on exercises, and real-time feedback.",
      },
      {
        question: "Can I replay the lectures if I miss one?",
        answer:
          "Yes, all recorded lectures are available for on-demand viewing, so you can catch up at your convenience.",
      },
      {
        question: "How often are live sessions held?",
        answer:
          "Live sessions are scheduled weekly and are designed to accommodate learners in multiple time zones.",
      },
    ],
    Certification: [
      {
        question: "Will I receive a certificate upon completion?",
        answer:
          "Yes, you will receive an official Performance Marketing Certification from Krutanic Solutions after completing the program.",
      },
      {
        question: "Is the certification recognized by employers?",
        answer:
          "Yes, the certification is recognized within the industry and validates your expertise in performance marketing.",
      },
      {
        question:
          "Can I add this certification to my resume or LinkedIn profile?",
        answer:
          "Yes, you can add the certification to your resume and LinkedIn profile to showcase your new skills.",
      },
      {
        question: "Is the certification free?",
        answer:
          "The certification is awarded after successful completion of the course and is included in the program fee.",
      },
    ],
    Opportunities: [
      {
        question: "What career opportunities will this course open for me?",
        answer:
          "The program prepares you for roles such as Performance Marketing Manager, PPC Specialist, Social Media Ads Manager, and Campaign Manager.",
      },
      {
        question: "Will I receive job placement assistance?",
        answer:
          "Yes, we provide career support, including job placement assistance, resume reviews, and interview coaching.",
      },
      {
        question: "Are internships available through this program?",
        answer:
          "Yes, we offer internship opportunities with top companies to help you gain hands-on experience.",
      },
      {
        question: "How will this course help in advancing my career?",
        answer:
          "By mastering advanced performance marketing techniques, you’ll become a competitive candidate for senior-level roles in the digital marketing field.",
      },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > lastScrollPos) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  const handleBrochureClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
const [actionType, setActionType] = useState();
  const handleFormSubmit = async (e , actionType) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/advance/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.number,
        currentRole: formData.currentRole,
        experience: formData.experience,
        goal: formData.goal,
        goalOther: formData.goal === "Other" ? formData.goalOther : undefined,
        domain: formData.domain,
        domainOther: formData.domain === "Other" ? formData.domainOther : undefined,
        interestedDomain:"Performance Marketing",
        reason: actionType,
      });
      toast.success("Registration successful! Opening the brochure...");
      setTimeout(() => {
        window.open(pdfpm, "_blank");
        setShowForm(false);
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
    setFormData({
      name: "",
      email: "",
      number: "",
      currentRole: "",
      experience: "",
      goal: "",
      goalOther: "",
      domain: "",
      domainOther: "",
      interestedDomain: "",
    });
  };
  const OffForm = () =>{
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      number: "",
      currentRole: "",
      experience: "",
      goal: "",
      goalOther: "",
      domain: "",
      domainOther: "",
    });
  }
   const [activeModule, setActiveModule] = useState(null);
  
    const toggleModule = (index) => {
      setActiveModule(activeModule === index ? null : index);
    };

    const today = new Date();
    const currentMonth = today.getMonth(); // Get the current month (0-based, so 0 = January)
    const currentDay = today.getDate(); // Get the current day of the month
    const displayDate = currentDay > 10 || currentMonth > 1 // Past February 15th
      ? `10th ${new Date(today.setMonth(currentMonth + 1)).toLocaleString('en', { month: 'long' })} 2025`
      : "10th February 2025";
      // const randomNumber = Math.floor(Math.random() * 6) + 20;
  return (
    <div>
      <div className="bg-black text-white">
          <Toaster position="top-center" reverseOrder={false}/>
        {/* 1 hero part */}
        <section
          id="advanceperformancebg"
          className=" py-[60px] px-[10px] shadow-lg shadow-[#f15b29] min-h-screen flex items-center justify-center"
        >
          <div className="container mx-auto">
            <div className="">
              <h1
                data-aos="fade-up"
                className="text-4xl text-center font-bold mb-4"
              >
                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#f15b29] relative inline-block">
                  <i className="relative text-white ">
                    {" "}
                    Take Your Career to the Next Level with{" "}
                  </i>
                </span>

                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#000] relative inline-block">
                  <i className="relative text-white "> Performance Marketing</i>
                </span>
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  data-aos="fade-up"
                  className="flex flex-col backdrop-blur-md bg-[#ffffff59] text-black items-center p-6 border border-gray-700 rounded-md"
                >
                  <div className="bg-[#f15b29] p-3 rounded-full">
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
                  <p>{displayDate}</p>
                  <p className="mt-2 text-md border border-[#f15b29] rounded-lg px-2 py-1">
                    {" "}
                    Available Cohort{" "}
                  </p>
                  <p className="mt-2 text-md"><span className="line-through">60/60</span> Batch Closed </p>
                  <p>22/60</p>
                </div>
                <div
                  data-aos="fade-up"
                  className="flex flex-col backdrop-blur-md bg-[#ffffff59] text-black items-center p-6 border  border-gray-700 rounded-md"
                >
                  <div className="bg-[#f15b29] p-3 rounded-full">
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
                  <p>6 Months </p>
                </div>

                <div
                  data-aos="fade-up"
                  className="flex flex-col backdrop-blur-md bg-[#ffffff59] text-black items-center p-6 border border-gray-700 rounded-md"
                >
                  <div className="bg-[#f15b29] p-3 rounded-full">
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
                  <p>
                    <span className="text-[#f15b29]">★★★★</span>☆ (4.9/5)
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-3">
              <ApplyNowButton courseValue="Peformance Market"/>
            </div>
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

          {/* 4 Curriculum Section */}
          <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className=" font-bold text-center mb-5 text-[#f15b29]"
            >
              | Curriculum
            </h1>
            <div className="lg:flex lg:gap-8">
              
            <div className="lg:w-1/2 w-full">
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="pb-5">
                      <button
                        className="w-full text-left hover:text-[#f15b29] transition-colors duration-300 focus:outline-none"
                        onClick={() => toggleModule(index)}
                      >
                        <h3 className="text-xl font-semibold">
                          Module {index + 1}: {module.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {module.objectives}
                        </p>
                      </button>
                      {activeModule === index && (
                        <div className="mt-4">
                          <ul className="list-disc pl-9 text-gray-300">
                            {module.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="mb-2">
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span>and more..</span>
              </div>
              <div className="lg:w-1/2 w-full lg:h-[450px] rounded-lg overflow-hidden mb-5 lg:mb-0 ">
                
                <div className="">
              <ApplyForm courseValue="Data Science"/>
            </div>
              </div>
            </div>
          </div>
        </section>

        <hr className=" opacity-10" />


        {/* 14 why choose us */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto  text-center">
            <h1 data-aos="fade-up" className="text-[#f15b29]  font-bold mb-6">
              | Why Choose{" "}
              <span className="text-white">Performance Marketing ? </span>
            </h1>
            <p data-aos="fade-up" className="text-gray-400 mb-12">
              Develop the skills to create and optimize marketing campaigns that
              deliver measurable results and maximize return on investment for
              businesses
            </p>
            <div
              data-aos="fade-up"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {Difference.map((Difference, index) => (
                <div
                  data-aos="fade-up"
                  key={index}
                  className="bg-[#080810] p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition"
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
          <div data-aos="fade-up" className="mt-[20px] text-center">
            And more
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 15 why learn with us */}
        <section className="py-[60px] px-[10px]">
          <BenefitsofLearning />
        </section>
        <hr className=" opacity-10" />

        {/* 2 Course Overview Section */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className=" font-bold text-center mb-12 text-[#f15b29]"
            >
              | Program Overview
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {courseTopics.map((topic, index) => (
                <div
                  data-aos="fade-up"
                  key={index}
                  className="bg-[#080810] p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-bold uppercase text-white hover:text-[#f15b29] transition-colors duration-300">
                    {topic.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 3 key outcome section  */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto lg:flex flex-col lg:flex-row gap-3">
            <div className="w-full mb-3 lg:mb-0">
              <h1 data-aos="fade-up" className=" font-bold mb-4 text-[#f15b29]">
                | Key Takeaways
              </h1>
              <ul data-aos="fade-up" className="space-y-4">
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Master Performance Marketing Campaigns
                  </span>
                  Learn to plan, execute, and optimize paid campaigns across
                  platforms like Google Ads, Facebook, and more to maximize ROI.
                </li>
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Develop Expertise in Conversion Rate Optimization
                  </span>

                  {isExpanded && (
                    <span>
                      &nbsp;Gain hands-on experience with CRO techniques to
                      increase conversions and improve campaign performance.
                    </span>
                  )}
                </li>
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Leverage Data-Driven Marketing Analytics
                  </span>
                  Use data analytics tools to track campaign performance,
                  optimize results, and drive targeted traffic.
                </li>
                <span className="font-semibold text-[#f15b29]">
                  Enhance Campaigns with A/B Testing and Optimization
                </span>
                Learn to apply A/B testing methodologies to refine campaigns,
                improve performance, and increase conversion rates.
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    -- : Optimize Campaign Performance
                  </span>
                  Continuously monitor and tweak campaigns to improve key
                  metrics such as CPC, CPA, and ROI.
                </li>
                {/* Hidden additional content */}
                {isExpanded && (
                  <>
                    {/* Paragraphs */}
                    {/* <p className="mt-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fuga libero velit autem deleniti dignissimos hic, labore
                    esse iusto earum repellat?
                  </p> */}

                    <li>
                      <span className="font-semibold text-[#f15b29]">
                        -- : Leverage Data Analytics for Insights
                      </span>
                    </li>
                    <li>
                      <span className="font-semibold text-[#f15b29]">
                        -- : Focus on Conversion Rate Optimization (CRO)
                      </span>
                      Implement strategies to enhance user experience and
                      increase conversion rates on websites and landing pages.
                    </li>
                  </>
                )}
              </ul>
              <button
                data-aos="fade-up"
                onClick={toggleExpand}
                className="mt-4 px-4 py-2 text-white font-medium border  rounded"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            <div
              data-aos="fade-up"
              className="lg:w-1/2 w-full h-[300px] rounded-lg shadow-lg shadow-[#f15b29] overflow-hidden"
            >
              <img
                src={PM}
                alt="Curriculum"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

      

        {/* 5 download curriculum section */}

        <section className="py-[60px] px-[10px]">
          <div
            data-aos="fade-up"
            className="container mx-auto p-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-5 rounded-lg shadow-lg border-2 border-[#f15b29]"
          >
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold mb-2 text-[#f15b29]">
                | Get the Full Course Breakdown
              </h2>
              <p className="text-gray-400 text-sm">
                Access the detailed curriculum with key modules and learning
                outcomes of the Performance Marketing program.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3">
              <button
                className="bg-[#f15b29] hover:bg-[#f15b29] text-white font-semibold py-2 px-6 rounded flex items-center gap-2"
                onClick={handleBrochureClick} // Open the form when clicked
              >
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
          </div>

          {/* Dialog Box for Form */}
           {showForm && (
                      <div className="fixed top-8 inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-[999]">
                        <div className="bg-white text-black p-3 rounded-lg shadow-lg w-96">
                          <span className="text-md float-end mb-2 font-bold border rounded-full px-2 cursor-pointer"  onClick={OffForm}>X</span>
                          <h3 className="text-md text-center font-semibold mb-2">
                            Register to Download Brochure
                          </h3>
                          <form className="space-y-2" onSubmit={(e) => handleFormSubmit(e, actionType)}>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              placeholder="Enter your name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            />
                            <input
                              type="text"
                              id="number"
                              name="number"
                              placeholder="Enter your phone number"
                              value={formData.number}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            />
                            <select
                              id="currentRole"
                              name="currentRole"
                              value={formData.currentRole}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            >
                              <option disabled value="">What do you currently do?</option>
                              <option value="Founder">Founder</option>
                              <option value="Student">Student</option>
                              <option value="Working Professional">
                                Working Professional
                              </option>
                              <option value="Self Employed">Self Employed</option>
                            </select>
                            <select
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            >
                              <option disabled value="">Select Experience</option>
                              <option value="0 year">0 year (Fresher)</option>
                              <option value="1-2 years">1-2 years</option>
                              <option value="3-5 years">3-5 years</option>
                              <option value="5+ years">5+ years</option>
                            </select>
                            <select
                              id="goal"
                              name="goal"
                              value={formData.goal}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            >
                              <option disabled value="">Goal of taking this program</option>
                              <option value="Career Transition">Career Transition</option>
                              <option value="Kickstart Career">Kickstart Career</option>
                              <option value="Upskilling">Upskilling</option>
                              <option value="Other">Other</option>
                            </select>
                            {formData.goal === "Other" && (
                              <input
                                type="text"
                                name="goalOther"
                                value={formData.goalOther}
                                onChange={handleInputChange}
                                placeholder="Please specify your goal"
                                className="w-full border border-gray-300 p-1.5 rounded-md mt-2"
                                required
                              />
                            )}
                            <select
                              id="domain"
                              name="domain"
                              value={formData.domain}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 p-1.5 rounded-md"
                              required
                            >
                              <option disabled value="">Domain currently working in</option>
                              <option value="Digital Marketing/Performance marketing">
                                Digital Marketing/Performance Marketing
                              </option>
                              <option value="Marketing/Sales">Marketing/Sales</option>
                              <option value="Management/Operations">
                                Management/Operations
                              </option>
                              <option value="IT/Tech/Product">IT/Tech/Product</option>
                              <option value="Other">Other</option>
                            </select>
                            {formData.domain === "Other" && (
                              <input
                                type="text"
                                name="domainOther"
                                value={formData.domainOther}
                                onChange={handleInputChange}
                                placeholder="Please specify your domain"
                                className="w-full border border-gray-300 p-1.5 rounded-md mt-2"
                                required
                              />
                            )}
                           <div className="flex justify-center gap-2">
                                               <button
                                                 type="submit"
                                                 onClick={(e) => setActionType("Only Download Brochure")}
                                                 className="px-4 py-2 w-full bg-[#f15b29] text-white rounded-md"
                                               >
                                                 <i className="fa fa-download"></i>
                                               </button>
                                               <button
                                                 type="submit"
                                                 onClick={(e) => setActionType("Requested To Call Back")}
                                                 className="px-4 py-2 w-full bg-[#f15b29] flex items-center justify-center gap-1 text-white rounded-md"
                                               >
                                                 <i className="fa fa-download"></i> +{" "}
                                                 <RiCustomerService2Fill />
                                               </button>
                                             </div>
                          </form>
                        </div>
                      </div>
                    )}
        </section>

        <hr className=" opacity-10" />

        {/* 13 job roles section  */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1 className="text-[#f15b29] text-center  font-bold mb-8">
              | Career Opportunities in{" "}
              <span className="text-white font-bold">
                Performance Marketing{" "}
              </span>
            </h1>
            <div
              data-aos="fade-up"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {jobRoles.map((role, index) => (
                <div
                  key={index}
                  className="border-l-4 border-[#f15b29] bg-[#080810] rounded-md p-4 text-white shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-4">{role.title}</h3>
                  <p>{role.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-aos="fade-up" className="mt-[20px] text-center">
            And more
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 12 key highlight section */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <div className="">
              <div className=" w-full mb-8 lg:mb-0">
                <h1
                  data-aos="fade-up"
                  className=" text-center font-bold mb-6 text-[#f15b29]"
                >
                  | Course Benefits at a Glance
                </h1>
                <p data-aos="fade-up" className="text-lg text-center mb-8">
                  Master advanced{" "}
                  <span className="text-[#f15b29] font-bold">
                    Performance Marketing
                  </span>{" "}
                  techniques with hands-on projects, expert-led sessions, and
                  real-world applications.
                </p>
                <div
                  data-aos="fade-up"
                  className="grid grid-cols-2 md:grid-cols-4 gap-2"
                >
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">200+</h3>
                    <p className="mt-2 text-gray-300">Mentees Placed</p>
                  </div>
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">
                      12+ LPA
                    </h3>
                    <p className="mt-2 text-gray-300">Average CTC</p>
                  </div>
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">95%</h3>
                    <p className="mt-2 text-gray-300">Placement Rate</p>
                  </div>
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">450+</h3>
                    <p className="mt-2 text-gray-300">Hiring Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 8 Certification section */}
        <section className="py-[60px] px-[10px]">
          <div data-aos="fade-up">
            <Certification />
          </div>
        </section>
        <hr className=" opacity-10" />

        <section>
          <FlexiblePaymentOption/>
         </section>

        {/* 9 mentors section  */}
        {/* <section className="py-[60px] px-[10px]">
          <div data-aos="fade-up" className="container mx-auto">
            <MentorSection />
          </div>
        </section>
        <hr className=" opacity-10" /> */}

        {/* 16 store section  */}
        <section className="py-[60px] px-[10px] bg-white">
          <StoreSection />
        </section>

        {/* 17 new FAQ section */}
        <section className="py-[60px] px-[10px] bg-white">
          <div data-aos="fade-up" className="container mx-auto">
            <h1 className="text-center mb-2  font-bold text-[#f15b29]">
              | Ask Us Anything
            </h1>
            <div className="flex justify-center   flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-1/6 w-full p-3 border-r border-b md:border-b-0 text-black border-[#f15b29]">
                <ul className="space-y-2">
                  {Object.keys(faqData).map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        setActiveCategory(category);
                        setOpenFAQ(null); // Reset any open question
                      }}
                      className={`cursor-pointer border font-bold text-black py-2 px-4 rounded-lg ${
                        activeCategory === category ? " text-[#f15b29]" : ""
                      }`}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Content */}
              <div className="md:w-3/4 w-full p-3">
                <h2 className="text-2xl font-bold mb-4 text-[#f15b29]">
                  {activeCategory} :
                </h2>
                <ul className="space-y-4 ">
                  {faqData[activeCategory].map((faq, index) => (
                    <li
                      className="border  overflow-hidden rounded-lg "
                      key={index}
                    >
                      <button
                        onClick={() =>
                          setOpenFAQ(openFAQ === index ? null : index)
                        }
                        className="w-full text-left text-black py-3 px-5  flex justify-between items-center"
                      >
                        {faq.question}
                        <span className="text-[#f15b29] font-bold text-2xl">
                          {openFAQ === index ? "-" : "+"}
                        </span>
                      </button>
                      {openFAQ === index && (
                        <div className="p-4 border-t bg-slate-100 text-black">
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

        {/* 11 scrolling section */}
        <section className="">
          <div
            className={`fixed bottom-0 left-0 w-full bg-white z-10 shadow-md flex justify-between items-center gap-[20px] p-4   transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <p className="text-xl font-semibold text-black">
              {" "}
              Program fees 60,999/-
            </p>
            <button className="flex items-center justify-center px-3 py-2 border rounded-md text-white bg-black  hover:text-[#f15b29]">
              <a
                 href="https://rzp.io/rzp/Advanced_Program_Slot_Booking"
                target="blank"
                className="text-[#f15b29] whitespace-nowrap"
              >
                Enroll Now
              </a>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Performancemarket;
