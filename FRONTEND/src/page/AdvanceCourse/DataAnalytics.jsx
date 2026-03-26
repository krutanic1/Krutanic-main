import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import ClientsCarousel from "../../Components/our_alumni";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import curriculumimage from "../../assets/Advanced Course Images/Data science/DS 4.jpg";
import daHero from "../../assets/Advanced Course Images/Data science/DS 3.jpg";
import pdfDataAnalytics from "../../../krutanic/Data Analytics Advanced program.pdf";

const DataAnalytics = () => {
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  const courseTopics = [
    { title: "Excel Foundations", icon: "📊" },
    { title: "Advanced Excel Dashboards", icon: "📈" },
    { title: "SQL Fundamentals", icon: "🗄️" },
    { title: "Advanced SQL Queries", icon: "⚡" },
    { title: "Python for Data Analysis", icon: "🐍" },
    { title: "Power BI and DAX", icon: "📉" },
  ];

  const modules = [
    {
      week: "Weeks 1-2",
      title: "Excel Foundations",
      objectives:
        "Build a strong base in Excel for cleaning, organizing, and handling raw business data effectively.",
      topics: [
        "Introduction to Excel interface",
        "Formatting and data cleaning",
        "Basic formulas and operators",
        "Text and date functions",
        "Conditional functions",
        "Data sorting and filtering",
      ],
    },
    {
      week: "Weeks 3-4",
      title: "Advanced Excel and Dashboards",
      objectives:
        "Learn advanced lookup techniques, pivot analysis, and dashboard design for decision-ready reports.",
      topics: [
        "Named ranges",
        "VLOOKUP, XLOOKUP, INDEX-MATCH",
        "Pivot tables and pivot charts",
        "Advanced conditional logic",
        "Visualization techniques",
        "Interactive dashboard building",
      ],
    },
    {
      week: "Weeks 5-6",
      title: "SQL Fundamentals",
      objectives:
        "Understand relational databases and write structured queries for extracting and summarizing insights.",
      topics: [
        "Database basics",
        "SELECT, WHERE, GROUP BY",
        "Aggregation functions",
        "Conditional statements",
        "Creating and managing databases",
      ],
    },
    {
      week: "Weeks 7-8",
      title: "Advanced SQL Queries",
      objectives:
        "Solve practical business problems with optimized SQL using joins, subqueries, and CTEs.",
      topics: [
        "JOIN statements",
        "Subqueries",
        "Common table expressions (CTEs)",
        "Advanced SQL statements",
        "Case-based query practice",
      ],
    },
    {
      week: "Weeks 9-10",
      title: "Structured Problem Solving and Case Studies",
      objectives:
        "Develop structured thinking for business decision-making using data-driven logic.",
      topics: [
        "Problem solving frameworks",
        "Growth strategy cases",
        "Profitability analysis",
        "Guesstimates",
        "Data interpretation for decisions",
      ],
    },
    {
      week: "Weeks 11-12",
      title: "Python Programming Foundations",
      objectives:
        "Build core programming skills required for advanced data manipulation and analysis tasks.",
      topics: [
        "Introduction to Python",
        "Variables and data types",
        "Operators and control flow",
        "Lists and list comprehensions",
        "User-defined functions",
      ],
    },
    {
      week: "Weeks 13-14",
      title: "Python for Data Analysis",
      objectives:
        "Work with larger datasets using Python libraries and perform structured transformations.",
      topics: [
        "Map, reduce, filter",
        "NumPy",
        "Pandas",
        "Data cleaning and transformation",
        "Working with DataFrames",
      ],
    },
    {
      week: "Weeks 15-16",
      title: "Data Visualization with Python",
      objectives:
        "Create meaningful visual insights and identify patterns, trends, and correlations.",
      topics: [
        "Visualization concepts",
        "Matplotlib",
        "Seaborn",
        "Exploratory data analysis (EDA)",
      ],
    },
    {
      week: "Weeks 17-18",
      title: "Power BI Foundations",
      objectives:
        "Learn to connect, model, and present business data through professional reports.",
      topics: [
        "Kickstart with Power BI",
        "Connecting and transforming data",
        "Data modeling",
        "Basic report creation",
      ],
    },
    {
      week: "Weeks 19-20",
      title: "Power BI Advanced and DAX",
      objectives:
        "Build interactive dashboards with advanced analytical calculations for real-world use cases.",
      topics: [
        "DAX functions",
        "Advanced calculations",
        "Dashboard design principles",
        "Publishing and sharing reports",
      ],
    },
    {
      week: "Weeks 21-22",
      title: "Capstone Project",
      objectives:
        "Integrate SQL, Python, and BI into an end-to-end analytics project and present outcomes.",
      topics: [
        "End-to-end data cleaning",
        "SQL querying",
        "Python analysis",
        "Power BI dashboard creation",
        "Final business presentation",
      ],
    },
    {
      week: "Weeks 22-24",
      title: "Placement Preparation",
      objectives:
        "Get placement-ready with professional profiles, interview practice, and portfolio polishing.",
      topics: [
        "Resume building",
        "LinkedIn optimization",
        "Mock interviews",
        "Case study practice",
        "Portfolio review",
      ],
    },
  ];

  const jobRoles = [
    { title: "Data Analyst", description: "Analyze business data and provide actionable insights for growth." },
    { title: "Business Analyst", description: "Bridge business goals with data-backed recommendations." },
    { title: "BI Developer", description: "Design dashboards and reporting systems for data-driven teams." },
    { title: "Reporting Analyst", description: "Build recurring reports and performance tracking frameworks." },
    { title: "Product Analyst", description: "Use product metrics and user behavior data to improve outcomes." },
    { title: "SQL Developer", description: "Create and optimize SQL queries and data pipelines." },
    { title: "Marketing Analyst", description: "Measure campaign performance and optimize marketing ROI." },
    { title: "Financial Analyst", description: "Drive finance decisions through analytical models and reporting." },
    { title: "Operations Analyst", description: "Improve operational efficiency using process and performance data." },
  ];

  const whyDataAnalytics = [
    {
      title: "Strong Industry Demand",
      description:
        "Data analytics remains one of the most in-demand skills across sectors as organizations become data-first.",
      icon: "📌",
    },
    {
      title: "Future-Proof Career",
      description:
        "Businesses continuously generate data, creating long-term demand for professionals who can interpret it.",
      icon: "🧭",
    },
    {
      title: "Cross-Industry Opportunities",
      description:
        "From finance and healthcare to marketing and product, analytics roles exist in every major industry.",
      icon: "🌍",
    },
    {
      title: "Portfolio-Centric Learning",
      description:
        "Hands-on projects and case studies help you build proof of work that recruiters actually evaluate.",
      icon: "🧩",
    },
    {
      title: "Placement-Oriented Structure",
      description:
        "Includes mock interviews, profile optimization, and real-world project storytelling for job readiness.",
      icon: "🎯",
    },
    {
      title: "Modern Tool Stack",
      description:
        "Master the tools used by employers: Excel, SQL, Python, Power BI, and data visualization workflows.",
      icon: "🛠️",
    },
  ];

  const faqData = {
    Program: [
      {
        question: "What is the duration of this program?",
        answer:
          "The Data Analytics Advanced Program runs for 24 weeks with structured learning from foundations to capstone and placement prep.",
      },
      {
        question: "Which tools will I learn in this course?",
        answer:
          "You will learn Excel, SQL, Python, Power BI, and dashboarding techniques with project-based implementation.",
      },
      {
        question: "Is this program beginner friendly?",
        answer:
          "Yes. The curriculum starts from fundamentals and gradually progresses to advanced analytics and business case solving.",
      },
      {
        question: "Will there be practical projects?",
        answer:
          "Yes. The curriculum includes assignments, case studies, and a capstone project for portfolio building.",
      },
    ],
    Certification: [
      {
        question: "Will I get a certificate after completion?",
        answer:
          "Yes, you will receive a Data Analytics Advanced Program certificate after successful completion.",
      },
      {
        question: "Can I use this certificate on LinkedIn and resume?",
        answer:
          "Yes. You can add it to your resume, LinkedIn profile, and professional portfolio.",
      },
      {
        question: "Does the certificate include project proof?",
        answer:
          "Your capstone and assignments can be showcased as portfolio proof alongside your certificate.",
      },
      {
        question: "Is the certificate included in the fee?",
        answer: "Yes, certification is included in the program fee.",
      },
    ],
    Opportunities: [
      {
        question: "What career roles can I target after this course?",
        answer:
          "You can apply for roles like Data Analyst, BI Developer, Reporting Analyst, Business Analyst, and SQL Developer.",
      },
      {
        question: "Will I get placement guidance?",
        answer:
          "Yes, the program includes resume support, interview preparation, case-based practice, and portfolio reviews.",
      },
      {
        question: "Are there interview preparation sessions?",
        answer:
          "Yes, the final phase includes mock interviews and role-specific preparation support.",
      },
      {
        question: "How is this program different from short tool-based courses?",
        answer:
          "It combines tools, business problem-solving, end-to-end projects, and placement preparation in one structured path.",
      },
    ],
  };

  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(currentScrollPos > lastScrollPos);
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const displayDate =
    currentDay > 10 || currentMonth > 1
      ? `10th ${new Date(today.setMonth(currentMonth + 1)).toLocaleString("en", {
          month: "long",
        })} 2026`
      : "10th February 2026";

  return (
    <div className="bg-black text-white">
      <section
        className="py-[60px] shadow-lg shadow-[#f15b29] px-[10px] min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${daHero})`,
        }}
      >
        <div className="container mx-auto">
          <h1 data-aos="fade-up" className="text-center text-4xl font-bold mb-3">
            <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#f15b29] relative inline-block">
              <i className="relative text-white">Take Your Career to the Next Level with</i>
            </span>
            <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#000] relative inline-block">
              <i className="relative text-white"> Data Analytics</i>
            </span>
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div data-aos="fade-up" className="flex flex-col backdrop-blur-md bg-black/45 text-white items-center p-6 border border-[#f15b29]/40 rounded-md">
              <p className="mt-2 font-semibold text-lg">Batch Starting</p>
              <p>{displayDate}</p>
              <p className="mt-2 text-md border border-[#f15b29] rounded-lg px-2 py-1">Available Cohort</p>
              <p className="mt-2 text-md"><span className="line-through">60/60</span> Batch Closed</p>
              <p>34/60</p>
            </div>
            <div data-aos="fade-up" className="flex flex-col backdrop-blur-md bg-black/45 text-white items-center p-6 border border-[#f15b29]/40 rounded-md">
              <p className="mt-2 font-semibold text-lg">Duration</p>
              <p>24 weeks</p>
              <p>6 months</p>
            </div>
            <div data-aos="fade-up" className="flex flex-col backdrop-blur-md bg-black/45 text-white items-center p-6 border border-[#f15b29]/40 rounded-md">
              <p className="mt-2 font-semibold text-lg">Program Rating</p>
              <p><span className="text-[#f15b29]">★★★★</span>☆ (4.7/5)</p>
              <p className="text-sm mt-1">Industry-aligned curriculum</p>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            <ApplyNowButton courseValue="Data Analytics" />
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto lg:flex lg:gap-8">
          <div className="lg:w-1/2 w-full">
            <h1 data-aos="fade-up" className="font-bold mb-5 text-[#f15b29]">| Curriculum</h1>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div key={index} className="pb-5">
                  <button
                    className="w-full text-left hover:text-[#f15b29] transition-colors duration-300 focus:outline-none"
                    onClick={() => toggleModule(index)}
                  >
                    <h3 className="text-xl font-semibold">{module.week}: {module.title}</h3>
                    <p className="text-sm text-gray-400">{module.objectives}</p>
                  </button>
                  {activeModule === index && (
                    <div className="mt-4">
                      <ul className="list-disc pl-9 text-gray-300">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="mb-2">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full rounded-lg overflow-hidden mb-5 lg:mb-0">
            <ApplyForm courseValue="Data Analytics" />
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto text-center">
          <h1 data-aos="fade-up" className="text-[#f15b29] font-bold mb-6">| Why Choose <span className="text-white">Data Analytics?</span></h1>
          <p data-aos="fade-up" className="text-gray-400 mb-12">
            Data Analytics is one of the most in-demand career options in the digital economy. Learn to turn raw data into business impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyDataAnalytics.map((item, index) => (
              <div data-aos="fade-up" key={index} className="bg-[#080810] p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition">
                <div className="text-[#f15b29] text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg text-[#f15b29] font-bold mb-3">{item.title}</h3>
                <p className="text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up" className="font-bold text-center mb-12 text-[#f15b29]">| Program Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {courseTopics.map((topic, index) => (
              <div data-aos="fade-up" key={index} className="bg-[#080810] p-6 rounded-lg text-center transition-transform duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-bold uppercase text-white hover:text-[#f15b29] transition-colors duration-300">{topic.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto lg:flex flex-col lg:flex-row gap-6">
          <div className="w-full mb-3 lg:mb-0">
            <h1 data-aos="fade-up" className="font-bold mb-4 text-[#f15b29]">| Key Takeaways</h1>
            <ul className="space-y-4">
              <li>
                <span className="font-semibold text-[#f15b29]">Master End-to-End Analytics Workflow </span>
                Build confidence across Excel, SQL, Python, and Power BI to solve real business problems.
              </li>
              <li>
                <span className="font-semibold text-[#f15b29]">Make Data-Driven Business Decisions </span>
                Learn structured problem-solving and case approaches used by analytics teams.
              </li>
              <li>
                <span className="font-semibold text-[#f15b29]">Build Portfolio-Ready Projects </span>
                Complete a capstone project that demonstrates your practical, job-ready skills.
              </li>
              <li>
                <span className="font-semibold text-[#f15b29]">Become Placement Ready </span>
                Prepare with resume reviews, LinkedIn optimization, and mock interviews.
              </li>
              {isExpanded && (
                <>
                  <li>
                    <span className="font-semibold text-[#f15b29]">Create Interactive Dashboards </span>
                    Convert complex datasets into clear business stories and visual reports.
                  </li>
                  <li>
                    <span className="font-semibold text-[#f15b29]">Work with Industry-Relevant Tools </span>
                    Learn the tools employers use in analytics, reporting, and business intelligence teams.
                  </li>
                </>
              )}
            </ul>
            <button onClick={toggleExpand} className="mt-4 px-4 py-2 text-white font-medium border rounded">
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
          <div data-aos="fade-up" className="lg:w-1/2 w-full h-[320px] rounded-lg shadow-lg shadow-[#926E4E] overflow-hidden">
            <img src={daHero} alt="Data Analytics" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div data-aos="fade-up" className="container mx-auto p-5 flex flex-col md:flex-row justify-between items-center flex-wrap gap-5 rounded-lg shadow-lg border-2 border-[#f15b29]">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold mb-2 text-[#f15b29]">| Get the Full Course Breakdown</h2>
            <p className="text-gray-400 text-sm">
              Download the detailed Data Analytics Advanced Program brochure with module-level outcomes and roadmap.
            </p>
          </div>
          <button
            className="bg-[#f15b29] text-white font-semibold py-2 px-6 rounded flex items-center gap-2"
            onClick={() => window.open(pdfDataAnalytics, "_blank")}
          >
            Download Brochure
          </button>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up" className="text-[#f15b29] text-center font-bold mb-8">
            | Career Opportunities in <span className="text-white font-bold">Data Analytics</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobRoles.map((role, index) => (
              <div data-aos="fade-up" key={index} className="border-l-4 border-[#f15b29] bg-[#080810] rounded-md p-4 text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{role.title}</h3>
                <p>{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <div className="workat">
        <div className="alumni">
          <h1 className="text-[#f15b29] font-bold mb-6 text-center">| Our alumni at top Brands</h1>
          <p className="text-gray-400 mb-12 text-center">Their success stories inspire current students to aim for global excellence.</p>
          <ClientsCarousel />
        </div>
      </div>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-center font-extrabold text-[#f15b29] mb-12 text-3xl md:text-4xl">Our Flexible Payment Options</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-[#f15b29] to-[#b5401f] rounded-l-[80px] rounded-r-lg p-8 md:p-12 flex flex-col justify-center items-center shadow-2xl">
              <p className="text-white text-lg md:text-xl mb-4 font-medium">Total program fee</p>
              <p className="text-white text-5xl md:text-6xl font-bold">₹40,000</p>
              <p className="text-white text-sm mt-3 opacity-90">+18% GST | 24 weeks</p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-600">
                <span className="text-[#eee] text-lg">Registration</span>
                <span className="text-[#eee] text-lg font-semibold">₹10,000</span>
              </div>
              <div className="py-3 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-[#eee] text-lg">Installment 1</span>
                  <span className="text-[#eee] text-lg font-semibold">₹15,000</span>
                </div>
                <p className="text-[#aaa] text-xs mt-1">First installment must be paid within 15 days of registration.</p>
              </div>
              <div className="py-3 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-[#eee] text-lg">Installment 2</span>
                  <span className="text-[#eee] text-lg font-semibold">₹15,000</span>
                </div>
                <p className="text-[#aaa] text-xs mt-1">Second installment must be paid within 15 days of installment 1.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-12">
            <p className="mb-2 text-[#f15b29]">| Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial Partner" className="h-[80px]" />
          </div>
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <div data-aos="fade-up">
          <Certification />
        </div>
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px]">
        <BenefitsofLearning />
      </section>

      <hr className="opacity-10" />

      <section className="py-[60px] px-[10px] bg-white">
        <StoreSection />
      </section>

      <section className="py-[60px] px-[10px] bg-white">
        <div data-aos="fade-up" className="container mx-auto">
          <h1 className="text-center mb-2 font-bold text-[#f15b29]">| Ask Us Anything</h1>
          <div className="flex justify-center flex-col md:flex-row">
            <div className="md:w-1/6 w-full p-3 lg:border-r border-b md:border-b-0 text-black border-[#f15b29]">
              <ul className="space-y-2">
                {Object.keys(faqData).map((category) => (
                  <li
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setOpenFAQ(null);
                    }}
                    className={`cursor-pointer border font-bold text-black py-2 px-4 rounded-lg ${activeCategory === category ? "text-[#f15b29]" : ""}`}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-3/4 w-full p-3">
              <h2 className="text-2xl font-bold mb-4 text-[#f15b29]">{activeCategory} :</h2>
              <ul className="space-y-4">
                {faqData[activeCategory].map((faq, index) => (
                  <li className="border overflow-hidden rounded-lg" key={index}>
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full text-left text-black py-3 px-5 flex justify-between items-center"
                    >
                      {faq.question}
                      <span className="text-[#f15b29] font-bold text-2xl">{openFAQ === index ? "-" : "+"}</span>
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

      <section>
        <div className={`fixed bottom-0 left-0 w-full bg-white z-10 shadow-md flex justify-between items-center p-4 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
          <p className="text-lg font-semibold text-black">Program fees 40,000/- + 18% GST</p>
          <div className="flex space-x-4">
            <button className="flex items-center px-3 py-2 border rounded-md text-white bg-black hover:text-[#f15b29]">
              <a href="https://rzp.io/rzp/Advanced_Program_Slot_Booking" target="blank" className="text-[#f15b29] whitespace-nowrap">
                Enroll Now
              </a>
            </button>
          </div>
        </div>
      </section>

      <div className="hidden">
        <img src={curriculumimage} alt="curriculum-preload" />
      </div>
    </div>
  );
};

export default DataAnalytics;
