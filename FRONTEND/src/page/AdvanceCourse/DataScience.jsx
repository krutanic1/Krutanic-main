import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import AOS from "aos";
import API from "../../API";
import "aos/dist/aos.css";
import axios from "axios";
import { RiCustomerService2Fill } from "react-icons/ri";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";

import pdfds from "../../../krutanic/DataScienceAdvancedProgram.pdf";

import DS from "../../assets/Advanced Course Images/Data science/DS.jpg";
// import curriculumimage from "../../assets/Advanced Course Images/Data science/DS 4.jpg";
import toast, { Toaster } from "react-hot-toast";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import FlexiblePaymentOption from "./Components/FlexiblePaymentOption";

const DataScience = () => {
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
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const courseTopics = [
    { title: "Advanced Machine Learning Algorithms", icon: "🌐" },
    { title: "Big Data Analytics with Hadoop and Spark", icon: "🎣" },
    { title: "Deep Learning with TensorFlow and Keras", icon: "⚡" },
    { title: "Feature Engineering and Model Optimization", icon: "🛣️" },
    { title: "AI Applications and Real-World Case Studies", icon: "🗃️" },
    { title: "Natural Language Processing(NLP) Methodology", icon: "🗃️" },
  ];

  const modules = [
    {
      title: "Advanced Machine Learning Techniques",
      objectives:
        "Learn advanced algorithms for solving complex problems using machine learning models.",
      topics: [
        "Supervised and Unsupervised Learning",
        "Ensemble Methods",
        "Model Evaluation",
        "Cross-Validation",
        "Hyperparameter Tuning",
      ],
    },
    {
      title: "Deep Learning with TensorFlow and Keras",
      objectives:
        "Master deep learning techniques for image recognition, NLP, and more.",
      topics: [
        "Neural Networks Fundamentals",
        "Convolutional Neural Networks (CNNs)",
        "Recurrent Neural Networks (RNNs)",
        "TensorFlow and Keras Basics",
        "Model Optimization",
      ],
    },
    {
      title: "Big Data Analytics",
      objectives:
        "Work with tools like Hadoop and Spark to manage and analyze large datasets.",
      topics: [
        "Hadoop Ecosystem",
        "Spark for Data Processing",
        "NoSQL Databases",
        "Data Pipeline Construction",
        "Real-Time Data Processing",
      ],
    },
    {
      title: "Feature Engineering and Model Optimization",
      objectives:
        "Enhance your models with effective feature engineering and optimization techniques.",
      topics: [
        "Feature Extraction",
        "Feature Selection",
        "Dimensionality Reduction",
        "Regularization",
        "Model Tuning",
      ],
    },
    {
      title: " AI Applications and Real-World Case Studies",
      objectives:
        "Apply AI and data science techniques to real-world problems across industries.",
      topics: [
        "AI in Healthcare, Finance, and Retail",
        "Fraud Detection Models",
        "Predictive Analytics",
        "Case Study Projects",
        "Deployment Strategies",
      ],
    },
  ];

  const jobRoles = [
    {
      title: "Data Scientist",
      description:
        "Analyzes data and builds models to extract insights and make predictions.",
    },
    {
      title: "Data Analyst",
      description:
        "Interprets data to help businesses make informed decisions.",
    },
    {
      title: "Machine Learning Engineer",
      description:
        "Develops and deploys machine learning models to automate tasks and improve accuracy.",
    },
    {
      title: "Data Engineer",
      description:
        "Creates and maintains data pipelines for efficient data processing.",
    },
    {
      title: "Business Intelligence Analyst",
      description:
        "Analyzes data to drive business decisions and optimize performance.",
    },
    {
      title: "AI Engineer",
      description:
        "Designs AI systems to solve complex problems using machine learning.",
    },
    {
      title: " Big Data Specialist",
      description:
        "Expert in analyzing massive datasets for actionable insights..",
    },
    {
      title: "Data Science Consultant",
      description:
        "Provides data-driven solutions to optimize business strategies and outcomes.",
    },
    {
      title: "Quantitative Analyst",
      description:
        "Builds models to analyze financial data and predict market trends.",
    },
  ];

  const Difference = [
    {
      title: "High Demand",
      description:
        "The need for data scientists is growing rapidly, with job opportunities expected to increase by 35% by 2025.",
      icon: "👥",
    },
    {
      title: "Lucrative Salaries",
      description:
        "Data scientists earn competitive salaries, often exceeding ₹100,000 annually, with further potential as expertise grows.",
      icon: "📘",
    },
    {
      title: "Industry Versatility",
      description:
        "Data science is essential across multiple industries, including healthcare, finance, and marketing, offering diverse career opportunities.",
      icon: "📦",
    },
    {
      title: "Impactful Work",
      description:
        "Data scientists make a difference by solving real-world problems, improving decision-making, and driving innovations.",
      icon: "💼",
    },
    {
      title: "In-Demand Skills",
      description:
        "Proficiency in tools like Python and machine learning algorithms is highly valued, ensuring career longevity and job security.",
      icon: "💻",
    },
    {
      title: "Continuous Innovation",
      description:
        "The field evolves rapidly, offering constant opportunities to learn and grow professionally with emerging technologies",
      icon: "🔗",
    },
  ];

  const faqData = {
    Program: [
      {
        question: "What topics are covered in the Data Science program?",
        answer:
          "The program covers advanced machine learning, deep learning, big data technologies, and industry-specific applications like business forecasting, fraud detection, and customer 	segmentation.",
      },
      {
        question: "How is the course delivered?",
        answer:
          "The course is delivered online with a blend of live sessions, recorded lectures, hands-on workshops, and practical projects.",
      },
      {
        question: "Will I get hands-on experience?",
        answer:
          "Yes, the course includes real-world case studies and hands-on projects to apply your skills in solving industry-specific problems.",
      },
      {
        question: "How long is the program?",
        answer:
          "The program is 6 months long, with flexible learning options designed for professionals.",
      },
    ],
    Eligibility: [
      {
        question: "What are the prerequisites for the program?",
        answer:
          "Basic programming knowledge (preferably Python) and a foundational understanding of statistics and machine learning concepts are recommended.",
      },
      {
        question: "Do I need a background in data science?",
        answer:
          "While prior experience in data science is helpful, it's not mandatory. We provide foundational support to help you succeed in the advanced topics.",
      },
      {
        question: "Can beginners apply?",
        answer:
          "This course is designed for learners with a basic understanding of data analysis and programming. Beginners in data science should be prepared to grasp complex topics quickly.",
      },
      {
        question: "Is there any age restriction?",
        answer:
          "No, the program is open to anyone who meets the basic eligibility criteria, regardless of age.",
      },
    ],
    Community: [
      {
        question: " How can I interact with other participants?",
        answer:
          "Engage with peers through discussion forums, collaborative projects, and networking opportunities designed to foster connections within the global data science community.",
      },
      {
        question: "Is there mentorship available?",
        answer:
          "Yes, personalized mentoring from industry professionals will be provided throughout the course to guide you and offer real-time feedback.",
      },
      {
        question: "Can I access support after the course ends?",
        answer:
          "Absolutely! Graduates gain continued access to community forums, alumni events, and ongoing support.",
      },
      {
        question: "How diverse is the community?",
        answer:
          "Our community is international, bringing together a diverse group of professionals from various industries and backgrounds.",
      },
    ],
    Lectures: [
      {
        question: "Are the lectures pre-recorded or live?",
        answer:
          "The program includes both live sessions and pre-recorded lectures, allowing for flexibility in learning while ensuring direct interaction with instructors.",
      },
      {
        question: "How interactive are the sessions?",
        answer:
          "The live sessions are interactive, with opportunities to ask questions, engage in hands-on exercises, and receive personalized feedback.",
      },
      {
        question: "Can I replay the lectures if I miss one?",
        answer:
          "Yes, all recorded lectures are available for on-demand viewing, so you can catch up at your convenience.",
      },
      {
        question: "How often are live sessions held?",
        answer:
          "Live sessions are scheduled weekly and are designed to accommodate learners in various time zones.",
      },
    ],
    Certification: [
      {
        question: "Will I receive a certificate upon completion?",
        answer:
          "Yes, after completing the program, you will receive an official Data Science certification from Krutanic Solutions.",
      },
      {
        question: "Is the certification recognized by employers?",
        answer:
          "Yes, the certification is recognized in the industry and demonstrates your proficiency in advanced data science techniques.",
      },
      {
        question:
          "Can I add this certification to my resume or LinkedIn profile?",
        answer:
          "Yes, you can add your certification to your resume and LinkedIn profile to showcase your new skills to potential employers.",
      },
      {
        question: "Is the certification free?",
        answer:
          "The certification is awarded upon successful completion of the course and is included as part of the program fee.",
      },
    ],
    Opportunities: [
      {
        question: "What career opportunities will this course open for me?",
        answer:
          "This program prepares you for roles such as Data Scientist, Machine Learning Engineer, AI Specialist, and Data Analyst across various industries like finance, healthcare, and tech.",
      },
      {
        question: "Will I receive job placement assistance?",
        answer:
          "Yes, we provide career support, including job placement assistance, resume reviews, and interview preparation.",
      },
      {
        question: "Are internships available through this program?",
        answer:
          "We offer internship opportunities through our partnerships with top companies, providing real-world experience to help you kick-start your career.",
      },
      {
        question: "How will this course help in advancing my career?",
        answer:
          "By mastering advanced data science skills, you will become a highly competitive candidate for senior-level roles, equipped with practical, industry-relevant knowledge.",
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
    AOS.init({ duration: 2000, once: false });
  }, []);

  const handleBrochureClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
const [actionType , setActionType] = useState();
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
        domainOther:formData.domain === "Other" ? formData.domainOther : undefined,
        interestedDomain: "Data Science",
        reason: actionType,
      });
      toast.success("Registration successful! Opening the brochure...");
      setTimeout(() => {
        window.open(pdfds, "_blank");
        OffForm();
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };
  const [activeModule, setActiveModule] = useState(null);

  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const displayDate = currentDay > 10 || currentMonth > 1 
    ? `10th ${new Date(today.setMonth(currentMonth + 1)).toLocaleString('en', { month: 'long' })} 2025`
    : "10th February 2025";
    // const randomNumber = Math.floor(Math.random() * 6) + 20;
    
  return (
    <div>
      <div className="bg-black text-white">
        <Toaster position="top-center" reverseOrder={false} />
        {/* 1 hero part */}
        <section
          id="advancedatabg"
          className="py-[60px] shadow-lg shadow-[#f15b29]  px-[10px] min-h-screen flex items-center justify-center"
        >
          <div className="container mx-auto ">
            <div className="">
              <h1 data-aos="fade-up" className="text-4xl text-center font-bold mb-3">
                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#f15b29] relative inline-block">
                  <i className="relative text-white ">
                    {" "}
                    Take Your Career to the Next Level with{" "}
                  </i>
                </span>

                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#000] relative inline-block">
                  <i className="relative text-white ">Data Science</i>
                </span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div
                data-aos="fade-up"
                className=" border border-gray-700 p-6 flex flex-col backdrop-blur-md  bg-[#ffffff59] text-black items-center  rounded-md"
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
                <p className="">{displayDate}</p>

                <p className="mt-2 text-md border border-[#f15b29] rounded-lg px-2 py-1">
                  {" "}
                  Available Cohort{" "}
                </p>
                <p className="mt-2 text-md"><span className="line-through">60/60</span> Batch Closed </p>
                <p>40/60</p>
              </div>
              <div
                data-aos="fade-up"
                className=" border border-gray-700 p-6 flex flex-col backdrop-blur-md bg-[#ffffff59] text-black items-center   rounded-md"
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
                <p className="">6 Months</p>
              </div>
              <div
                data-aos="fade-up"
                className=" border border-gray-700 p-6 flex flex-col backdrop-blur-md bg-[#ffffff59] text-black items-center   rounded-md"
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
                <p className="">
                  <span className="text-[#f15b29]">★★★★</span>☆ (4.8/5)
                </p>
              </div>
            </div>
            <div className=" flex items-center justify-center mt-6">
              <ApplyNowButton courseValue="Data Science"/>
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* circulum section updated  */}

        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className=" font-bold text-center mb-8 text-[#f15b29]"
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
              <ApplyForm />
            </div>

              </div>
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />
        {/* 14 why choose us */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto  text-center">
            <h1 data-aos="fade-up" className="text-[#f15b29] font-bold mb-6">
              | Why Choose <span className="text-white">Data Science ? </span>
            </h1>
            <p data-aos="fade-up" className="text-gray-400 mb-12">
              Discover the potential of data by learning advanced analytical
              skills and unlocking insights that can drive innovation and shape
              the future of industries
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
          <div className="container mx-auto lg:flex lg:gap-10 flex-col lg:flex-row">
            {/* Left side: Key Outcomes */}
            <div className="w-full mb-3 lg:mb-0">
              <h1 data-aos="fade-up" className=" font-bold mb-4 text-[#f15b29]">
                | Key Takeaways
              </h1>
              <ul data-aos="fade-up" className="space-y-4">
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Master Advanced Machine Learning and AI Techniques
                  </span>
                 Gain expertise with  deep learning models through the best AI and machine learning training in India. Solve industry-specific problems with hands-on projects.
                </li>
                <li>
                  <li>
                    <span className="font-semibold text-[#f15b29]">
                      Develop Big Data Expertise{" "}
                    </span>
                   Work with Hadoop, Spark, and NoSQL databases in our big data certification courses to process and analyze large-scale datasets efficiently.
                  </li>
                  <span className="font-semibold text-[#f15b29]">
                    Enhance Data Visualization Skills
                  </span>
                  Build dashboards with Tableau and Power BI in our data visualization training programs to communicate insights effectively.
                  <li>
                    <span className="font-semibold text-[#f15b29]">
                      Learn Predictive Analytics{"  "}
                    </span>
                    Apply predictive analytics training and statistical models to forecast business trends and outcomes from real data.
                  </li>
                  <li>
                    <span className="font-semibold text-[#f15b29]">
                      Optimize Data Pipelines{"  "}
                    </span>
                    Design workflows to collect, clean, and prepare data using tools taught in our advanced data science courses in India.
                  </li>
                  {isExpanded && (
                    <>
                      <li>
                        <span className="font-semibold text-[#f15b29]">
                          Solve Business Problems with Data{"  "}
                        </span>
                        Use data science internship projects in Bangalore to uncover patterns, deliver insights, and support decision-making with real-time data.
                      </li>
                    </>
                  )}
                </li>

                {/* Hidden additional content */}
                {isExpanded && (
                  <>
                    {/* Paragraphs */}
                    <p className="mt-4">
                      <span className="font-semibold text-[#f15b29]">Create Effective Content Marketing Campaigns </span> 
Join our digital marketing training in India to design strategies that attract, engage, and convert target audiences. 
                    </p>
                    <p>
                      <span className="font-semibold text-[#f15b29]">Leverage Automation for Campaign Optimization </span>
Learn to use marketing automation tools to streamline campaigns, nurture leads, and drive higher ROI through advanced digital marketing courses. 
                    </p>
                  </>
                )}
              </ul>
              <button
                data-aos="fade-up"
                onClick={toggleExpand}
                className="mt-4 px-4 py-2 text-white font-medium border rounded"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            {/* Right side: Image */}
            <div
              data-aos="fade-up"
              className="lg:w-1/2 w-full h-[300px] rounded-lg shadow-lg shadow-slate-700 overflow-hidden"
            >
              <img
                src={DS}
                alt="Curriculum"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 4 Curriculum Section */}


        {/* 5 download curriculum section */}
        <section className="py-[60px] px-[10px]">
          <div data-aos="fade-up" className="container mx-auto p-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-5 rounded-lg shadow-lg border-2 border-[#f15b29]">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold mb-2 text-[#f15b29]">
                | Get the Full Course Breakdown
              </h2>
              <p className="text-gray-400 text-sm">
                Access the detailed curriculum with key modules and learning
                outcomes of the Data Science program.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3">
              <button
                className="bg-[#f15b29] hover:bg-[#f15b29] text-white font-semibold py-2 px-6 rounded flex items-center gap-2"
                onClick={handleBrochureClick}
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
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-1.5 rounded-md"
                    
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
                      onClick={(e) => setActionType('Only Download Brochure')}
                      className="px-4 py-2 w-full bg-[#f15b29] text-white rounded-md"
                    >
                     <i className="fa fa-download"></i>
                    </button>
                    <button
                      type="submit"
                      onClick={(e) => setActionType('Requested To Call Back')}
                      className="px-4 py-2 w-full bg-[#f15b29] flex items-center justify-center gap-1 text-white rounded-md"
                    >
                   <i className="fa fa-download"></i> + <RiCustomerService2Fill />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* 7 alumni section  */}
        <hr className=" opacity-10" />
        {/* 13 job roles section  */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className="text-[#f15b29] text-center  font-bold mb-8"
            >
              | Career Opportunities in{" "}
              <span className="text-white font-bold">Data Science</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobRoles.map((role, index) => (
                <div
                  data-aos="fade-up"
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
                  <span className="text-[#f15b29] font-bold">Data Science</span>{" "}
                  techniques with hands-on projects, expert-led sessions, and
                  real-world applications.
                </p>
                <div
                  data-aos="fade-up"
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:px-20"
                >
                  <div className=" inline-block p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">200+</h3>
                    <p className="mt-2 text-gray-300">Mentees Placed</p>
                  </div>
                  <div className=" inline-block p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">
                      10+ LPA
                    </h3>
                    <p className="mt-2 text-gray-300">Average CTC</p>
                  </div>
                  <div className=" inline-block p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">93%</h3>
                    <p className="mt-2 text-gray-300">Placement Rate</p>
                  </div>
                  <div className=" inline-block p-6 rounded-lg text-center">
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
              <div className="md:w-1/6 w-full p-3 lg:border-r border-b md:border-b-0 text-black border-[#f15b29]">
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
        <section className=" relative">
          <div
            className={`fixed bottom-0 left-0 w-full bg-white border-t border-black z-10 shadow-md flex justify-between items-center p-4   transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <p className="text-lg font-semibold text-black">
              Program fees 61,999/-
            </p>
            <div className=" relative flex space-x-4">
              <button className="flex items-center px-3 py-2 border rounded-md text-white bg-black  hover:text-[#f15b29]">
                <a
                  href="https://rzp.io/rzp/Advanced_Program_Slot_Booking"
                  target="blank"
                  className="text-[#f15b29] whitespace-nowrap"
                >
                  Enroll Now
                </a>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataScience;
