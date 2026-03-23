import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../../API";
import axios from "axios";
import { RiCustomerService2Fill } from "react-icons/ri";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import StoreSection from "./Components/StoreSection";
import IB from "../../assets/Advanced Course Images/Investment banking/INB.png";
import pdfib from "../../../krutanic/Investment Banking Advanced Program.pdf";
import curriculumimage from "../../assets/Advanced Course Images/Investment banking/IB 6.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import toast, { Toaster } from "react-hot-toast";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
const Investmentbanking = () => {
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // scrolling
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
    reason: "",
  });

    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const courseTopics = [
    {
      title: "Advanced Corporate Finance and Valuation Techniques",
      icon: "🌐",
    },
    { title: "Investment Banking Models and Financial Statements", icon: "🎣" },
    { title: "Mergers & Acquisitions (M&A) Advisory", icon: "⚡" },
    { title: "Private Equity and Venture Capital", icon: "🛣️" },
    { title: "Risk Management and Financial Strategies", icon: "🗃️" },
    { title: "Investment Banking Regulations and Ethics", icon: "🗃️" },
  ];

  const modules = [
    {
      week: "Weeks 1-2",
      title: "Introduction to Investment Banking",
      objectives:
        "Understand the structure and function of investment banks within the global financial system. Gain insight into the services provided by investment banks and the regulatory environment they operate in.",
      topics: [
        "Overview of the global financial market and the investment banking ecosystem",
        "Key functions of investment banks (M&A, underwriting, capital raising)",
        "Roles of investment bankers: analysts, sales, trading, and research",
        "Introduction to the regulatory framework (SEC, FINRA, Basel III)",
      ],
    },
    {
      week: "Weeks 3-4",
      title: "Financial Analysis and Valuation Techniques",
      objectives:
        "Proficiency in performing DCF and CCA to value companies and assets. Apply valuation techniques in real-world scenarios to assess business value and investment opportunities.",
      topics: [
        "Financial statement analysis (income statements, balance sheets, cash flow statements)",
        "Ratio analysis (ROE, ROA, P/E ratios)",
        "Discounted Cash Flow (DCF) and comparable company analysis (CCA)",
        "Mergers and Acquisitions (M&A) valuation methods",
      ],
    },
    {
      week: "Week 5-6",
      title: "Capital Markets and Underwriting",
      objectives:
        "Understand the processes involved in capital raising and the role of underwriters. Gain practical knowledge of how to price and manage risks in capital market transactions.",
      topics: [
        "Capital raising strategies: IPOs, follow-on offerings, private placements",
        "The underwriting process: roles of underwriters, bookbuilding, pricing strategies",
        "Secondary markets and liquidity considerations",
        "Risk management in capital market transactions",
      ],
    },
    {
      week: "Week 7",
      title: "Mergers and Acquisitions",
      objectives:
        "Ability to conduct due diligence and assess the financial and strategic aspects of M&A transactions. Proficiency in using financial models for transaction analysis and valuation.",
      topics: [
        "Types of M&A transactions (mergers, acquisitions, divestitures, spin-offs)",
        "Due diligence process: financial, legal, and operational aspects",
        "Negotiation strategies and integration planning",
        "Regulatory considerations in M&A (antitrust, competition laws)",
      ],
    },
    {
      week: "Week 8-9",
      title: "Financial Modeling and Forecasting",
      objectives:
        "Ability to perform sensitivity analysis to understand the impact of changes in variables on financial outcomes. Apply these skills in real-world financial planning and budgeting.",
      topics: [
        "Building financial models: income statements, balance sheets, cash flow statements",
        "Sensitivity analysis and scenario planning",
        "Projected financials and budget forecasting",
        "Stress testing financial models under different economic scenarios",
      ],
    },
    {
      week: "Week 10",
      title: "Corporate Governance and Ethical Considerations",
      objectives:
        "Develop awareness of ethical practices and the importance of integrity in investment banking. Learn from case studies to avoid common pitfalls in governance and decision-making.",
      topics: [
        "Corporate governance frameworks and practices",
        "Ethical considerations in investment banking (conflicts of interest, insider trading)",
        "Role of boards and committees in financial oversight",
        "Case studies on corporate governance failures and lessons learned",
      ],
    },
    {
      week: "Week 11-12",
      title: "Investment Strategies and Portfolio Management",
      objectives:
        "Understand portfolio performance metrics and how to assess investment success. Proficiency in constructing diversified portfolios using different investment strategies.",
      topics: [
        "Asset allocation and risk management strategies",
        "Portfolio construction techniques (active vs. passive management)",
        "Performance measurement and attribution",
        "Sectoral and thematic investment strategies",
      ],
    },
    {
      week: "Week 13-14",
      title: "Derivatives and Risk Management",
      objectives:
        "Ability to apply arbitrage strategies and understand the implications of market volatility. Knowledge of how derivatives can be used to protect against financial risks in real-world scenarios.",
      topics: [
        "Understanding derivatives (futures, options, swaps)",
        "Risk management strategies using derivatives",
        "Hedging techniques and arbitrage strategies",
        "Case studies on financial crises and risk management failures",
      ],
    },
    {
      week: "Week 14-15",
      title: "International Finance and Global Market Trends",
      objectives:
        "Understanding the global economic indicators and their impact on investment decisions. Skills for handling cross-border transactions and adapting to international financial markets.",
      topics: [
        "Foreign exchange markets and currency risk management",
        "Global economic indicators and their impact on markets",
        "Cross-border M&A and international capital raising",
        "Regulatory and political risks in international finance",
      ],
    },
    {
      week: "Week 16",
      title: "Private Equity and Venture Capital",
      objectives:
        "Gain insight into the investment processes of private equity and venture capital firms.",
      topics: [
        "Fundraising and Fund Structure",
        "Deal Sourcing and Screening",
        "Valuation in Private Equity Deals",
        "Exit Strategies: IPOs, M&A",
      ],
    },
    {
      week: "Week 17-20",
      title: "Capstone Project",
      objectives:
        "Students will demonstrate their understanding of investment banking through a comprehensive project. They will create a strong portfolio, showcasing their ability to conduct research, perform analysis, and present findings effectively to industry experts.",
      topics: [
        "Practical application of skills in a real-world investment banking scenario",
        "Research and analysis of a live market case",
        "Portfolio management and investment strategy development",
        "Final project presentation and portfolio evaluation",
      ],
    },
    {
      week: "Week 21-24",
      title: "Placement Preparation",
      objectives:
        "Students will be well-prepared for the job market with a professional portfolio, strong resume, and interview skills. They will understand how to effectively present their capstone project and network with industry professionals.",
      topics: [
        "Resume Building and LinkedIn Optimization",
        "Interview Tips and Mock Interviews with industry professionals",
        "Job Search Strategies, Networking, and Building a Professional Portfolio",
        "Presentation skills for job interviews and client pitches",
      ],
    },
  ];

  const jobRoles = [
    {
      title: "Investment Banking Analyst",
      description:
        "Assists in the execution of investment deals, financial modeling, and client analysis.",
    },
    {
      title: "Mergers & Acquisitions (M&A) Analyst",
      description:
        "Specializes in analyzing and advising on mergers and acquisitions, including deal structuring and negotiation.",
    },
    {
      title: "Private Equity Analyst",
      description:
        "Focuses on investment strategies and funding in private companies and startups.",
    },
    {
      title: "Financial Analyst",
      description:
        "Analyzes financial data, prepares reports, and supports decision-making for investments and business strategies.",
    },
    {
      title: "Corporate Finance Specialist",
      description:
        "Works on financial planning, strategy, and corporate decision-making, focusing on maximizing company value.",
    },
    {
      title: "Risk Management Analyst",
      description:
        "Identifies and mitigates financial risks in investment portfolios, mergers, and corporate strategies.",
    },
    {
      title: "Equity Research Analyst",
      description:
        "Evaluates stocks and market trends to guide investment decisions.",
    },
    {
      title: "Portfolio Manager",
      description:
        "Provides strategic financial guidance for mergers, acquisitions, and restructuring.",
    },
    {
      title: "Corporate Finance Advisor",
      description:
        "Manages investment portfolios to maximize returns and mitigate risks.",
    },
  ];

  const Difference = [
    {
      title: "Networking",
      description:
        "Investment banking opens doors to influential professionals across finance, business, and government.",
      icon: "👥",
    },
    {
      title: "Impactful Deals",
      description:
        "Work on major mergers, acquisitions, and IPOs, shaping the global economy.",
      icon: "📘",
    },
    {
      title: "Expert Learning",
      description:
        "Gain insights from leading financial experts, rapidly advancing your skills.",
      icon: "📦",
    },
    {
      title: "Challenging Work",
      description:
        "Tackle intellectually stimulating problems requiring innovative solutions.",
      icon: "💼",
    },
    {
      title: "Entrepreneurial Growth",
      description:
        "Upskill your banking experience to transition into private equity or start your own venture.",
      icon: "💻",
    },
    {
      title: "Job Security",
      description:
        "Investment bankers enjoy stability due to the essential role they play in the financial markets.",
      icon: "🔗",
    },
  ];

  const faqData = {
    Program: [
      {
        question: "What topics are covered in the Investment Banking program?",
        answer:
          "The program covers corporate finance, M&A advisory, financial modeling, valuation techniques, and private equity strategies, along with investment banking regulations and ethics.",
      },
      {
        question: "How is the course delivered?",
        answer:
          "The course is delivered online with a combination of live sessions, recorded lectures, practical workshops, and real-world case studies.",
      },
      {
        question: "Will I get hands-on experience?",
        answer:
          "Yes, you’ll work on real-world financial models, case studies, and projects to apply your knowledge in investment banking scenarios.",
      },
      {
        question: "How long is the program?",
        answer:
          "The program lasts for 6 months with flexible learning options, ideal for professionals looking to advance their careers.",
      },
    ],
    Eligibility: [
      {
        question: "What are the prerequisites for the program?",
        answer:
          "A basic understanding of finance and accounting principles is recommended, but not mandatory.",
      },
      {
        question: "Do I need prior experience in investment banking?",
        answer:
          "No, this course is designed for both beginners and those looking to deepen their knowledge in investment banking.",
      },
      {
        question: "Can beginners apply?",
        answer:
          "Yes, the program is designed for beginners who are eager to learn the fundamentals of investment banking.",
      },
      {
        question: "Is there any age restriction?",
        answer:
          "No, the program is open to individuals of all ages who meet the eligibility criteria.",
      },
    ],
    Community: [
      {
        question: "How can I interact with other participants?",
        answer:
          "Engage with peers through discussion forums, group projects, and networking opportunities with mentors and professionals.",
      },
      {
        question: "Is mentorship available?",
        answer:
          "Yes, you will receive personalized mentorship from industry experts to guide you throughout the course.",
      },
      {
        question: "Can I access support after the course ends?",
        answer:
          "Yes, alumni gain access to ongoing support, including community forums and exclusive events.",
      },
      {
        question: "How diverse is the community?",
        answer:
          "Our community is global, bringing together professionals from various backgrounds and industries.",
      },
    ],
    Lectures: [
      {
        question: "Are the lectures pre-recorded or live?",
        answer:
          "The program features both live sessions and pre-recorded lectures for flexibility.",
      },
      {
        question: "How interactive are the sessions?",
        answer:
          "Live sessions include Q&A, hands-on exercises, and real-time feedback from instructors.",
      },
      {
        question: "Can I replay the lectures if I miss one?",
        answer:
          "Yes, all recorded lectures are available for on-demand viewing.",
      },
      {
        question: "How often are live sessions held?",
        answer:
          "Weekly live sessions are scheduled to accommodate multiple time zones.",
      },
    ],
    Certification: [
      {
        question: "Will I receive a certificate upon completion?",
        answer:
          "Yes, after completing the program, you will receive an official Investment Banking certification from Krutanic Solutions.",
      },
      {
        question: "Is the certification recognized by employers?",
        answer:
          "Yes, the certification is industry-recognized and demonstrates your expertise in investment banking.",
      },
      {
        question:
          "Can I add the certification to my resume or LinkedIn profile?",
        answer:
          "Yes, you can share your certification on professional platforms like LinkedIn and on your resume.",
      },
      {
        question: "Is the certification free?",
        answer: "Yes, the certification is included in the program fee.",
      },
    ],
    Opportunities: [
      {
        question: "What career opportunities will this course open for me?",
        answer:
          "The program prepares you for roles such as Investment Banker, M&A Analyst, Financial Analyst, Private Equity Analyst, and more.",
      },
      {
        question: "Will I receive job placement assistance?",
        answer:
          "Yes, we provide job placement assistance, resume building, interview coaching, and career support.",
      },
      {
        question: "Are internships available through this program?",
        answer:
          "Yes, internship opportunities with top firms are available to provide hands-on experience.",
      },
      {
        question: "How will this course help in advancing my career?",
        answer:
          "By mastering advanced financial models, M&A strategies, and investment techniques, you will become a highly competitive candidate in the investment banking field.",
      },
    ],
  };

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
  
    const sendOTP = async () => {
        if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            await axios.post(`${API}/advance-send-otp`, { email: formData.email });
            toast.success("OTP sent to your email!");
            setOtpSent(true);
        } catch (error) {
            toast.error("Failed to send OTP. Try again.");
        }
    };

    const verifyOTP = async () => {
        try {
            const response = await axios.post(`${API}/advance-verify-otp`, { email: formData.email, otp });
            if (response.data.success) {
                toast.success("Email verified successfully!");
                setEmailVerified(true);
                setOtp("");
                setOtpSent(false);
            } else {
                toast.error("Invalid OTP. Try again.");
            }
        } catch (error) {
            toast.error("Verification failed or Invalid OTP.");
        }
    };

  const handleFormSubmit = async (e, actionType) => {
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
        domainOther:
          formData.domain === "Other" ? formData.domainOther : undefined,
        interestedDomain: "Investment Banking",
        reason: formData.reason,
      });
      toast.success("Registration successful! Opening the brochure...");
      setTimeout(() => {
        window.open(pdfib, "_blank");
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
      reason: "",
    });
  };
  const OffForm = () => {
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
      interestedDomain: "",
      reason: "",
    });
  };

  const [activeModule, setActiveModule] = useState(null);

  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const today = new Date();
  const currentMonth = today.getMonth(); // Get the current month (0-based, so 0 = January)
  const currentDay = today.getDate(); // Get the current day of the month
  const displayDate =
    currentDay > 10 || currentMonth > 1 // Past February 15th
      ? `10th ${new Date(today.setMonth(currentMonth + 1)).toLocaleString(
          "en",
          { month: "long" }
        )} 2025`
      : "10th February 2025";
  // const randomNumber = Math.floor(Math.random() * 6) + 20;
  return (
    <div>
      <div className="bg-black text-white">
        <Toaster position="top-center" reverseOrder={false} />
        {/* 1 hero part */}
        <section
          id="advanceinvestmentbg"
          className="py-[60px] px-[10px] shadow-lg shadow-[#f15b29] min-h-screen flex items-center justify-center"
        >
          <div className="container mx-auto">
            <div className=" text-center">
              <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">
                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#f15b29] relative inline-block">
                  <i className="relative text-white ">
                    {" "}
                    Take Your Career to the Next Level with{" "}
                  </i>
                </span>

                <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#000] relative inline-block">
                  <i className="relative text-white ">Investment Banking</i>
                </span>
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  data-aos="fade-up"
                  className=" backdrop-blur-md bg-[#ffffff59] text-black flex flex-col items-center p-6 border border-gray-700 rounded-md"
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
                  <p className="mt-2 text-md">
                    <span className="line-through">60/60</span> Batch Closed{" "}
                  </p>
                  <p>25/60</p>
                </div>

                <div
                  data-aos="fade-up"
                  className=" backdrop-blur-md bg-[#ffffff59] text-black flex flex-col items-center p-6 border  border-gray-700 rounded-md"
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
                  className=" backdrop-blur-md bg-[#ffffff59] text-black flex flex-col items-center p-6 border border-gray-700 rounded-md"
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
                    <span className="text-[#f15b29]">★★★★</span>☆ (4.5/5)
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-3">
                <ApplyNowButton courseValue="Investment Banking" />
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
                          {module.week}: {module.title}
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
              </div>
              <div className="lg:w-1/2 w-full rounded-lg overflow-hidden mb-5 lg:mb-0">
                <ApplyForm courseValue="Data Science" />
              </div>
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* 14 why choose us */}
        <section className=" py-[60px] px-[10px]">
          <div className="container mx-auto text-center">
            <h1 data-aos="fade-up" className="text-[#f15b29]  font-bold mb-6">
              | Why Choose{" "}
              <span className="text-white">Investment Banking ? </span>
            </h1>
            <p data-aos="fade-up" className="text-gray-400 mb-12">
              Acquire the knowledge and tools needed to excel in investment
              banking, from managing financial portfolios to influencing global
              economic trends
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
        </section>
        <hr className=" opacity-10" />

        {/* 15 why learn with us */}
        <section className="  py-[60px] px-[10px]">
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
                  <h3 className="text-xl font-bold uppercase text-white  hover:text-[#f15b29] transition-colors duration-300">
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
          <div className="container mx-auto lg:flex gap-4">
            {/* Left side: Key Outcomes */}
            <div className="w-full">
              <h1 data-aos="fade-up" className=" font-bold mb-4 text-[#f15b29]">
                | Key Takeaways
              </h1>
              <ul className="space-y-4">
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Master Advanced Investment Banking Strategies{" "}
                  </span>
                  Learn to structure and execute complex financial transactions,
                  including IPOs, mergers, and acquisitions, using advanced
                  investment banking techniques.
                </li>
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Develop Expertise in Financial Analysis and Modeling{" "}
                  </span>
                  <span>
                    &nbsp;Gain hands-on experience with financial statements,
                    DCF models, and LBO analysis, equipping you to make informed
                    investment decisions.
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-[#f15b29]">
                    Navigate M&A and Private Equity Deals{" "}
                  </span>
                  Understand the intricacies of M&A deals, private equity
                  financing, and the strategies behind successful transactions.
                </li>
                <span className="font-semibold text-[#f15b29]">
                  Strengthen Risk Management and Regulatory Knowledge{" "}
                </span>
                Build and maintain relationships with corporate clients,
                investors, and other stakeholders to provide financial advisory
                services. Regulatory Compliance and Financial Regulations.
                {/* Hidden additional content */}
                {isExpanded && (
                  <>
                    {/* Paragraphs */}

                    <li>
                      <span className="font-semibold text-[#f15b29]">
                        Risk Management{" "}
                      </span>
                      Stay informed about financial regulations and compliance
                      standards to ensure legal and ethical practices in
                      investment banking.
                    </li>
                    <li>
                      <span className="font-semibold text-[#f15b29]">
                        Financial Risk Management Strategies.
                      </span>
                    </li>
                    <li>
                      <span className="font-semibold text-[#f15b29]">
                        Regulatory Compliance in Banking.
                      </span>
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

            {/* Right side: Image */}
            <div
              data-aos="fade-up"
              className="lg:w-1/2 w-full rounded-lg shadow-lg h-[300px] shadow-[#E0E0E1] overflow-hidden"
            >
              <img
                src={IB}
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
                outcomes of the Investment Banking program.
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
                <span
                  className="text-md float-end mb-2 font-bold border rounded-full px-2 cursor-pointer"
                  onClick={OffForm}
                >
                  X
                </span>
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
                    disabled={emailVerified}
                  required
                  />
                {!emailVerified ? (
                    !otpSent ? (
                        <button
                            type="button"
                            onClick={sendOTP}
                            className="w-full bg-[#f15b29] text-white p-1.5 rounded-md text-sm mt-2 transition"
                        >
                            Verify Email
                        </button>
                    ) : (
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full border border-gray-300 p-1.5 rounded-md text-black"
                            />
                            <button
                                type="button"
                                onClick={verifyOTP}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap"
                            >
                                Submit OTP
                            </button>
                        </div>
                    )
                ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1.5 rounded-md mt-2 text-center text-sm">
                        ✅ Email Verified
                    </div>
                )}
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
                    <option disabled value="">
                      What do you currently do?
                    </option>
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
                    <option disabled value="">
                      Select Experience
                    </option>
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
                    <option disabled value="">
                      Goal of taking this program
                    </option>
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
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-1.5 rounded-md"
                    required
                  >
                    <option disabled value="">
                      Reason for taking this program
                    </option>
                    <option value="I Want to Know More About the Program">I Want to Know More About the Program</option>
                    <option value="I've Reviewed the Program – Need Career Guidance">I've Reviewed the Program – Need Career Guidance</option>
                    <option value="I'm Ready to Enroll">I'm Ready to Enroll</option>
                    <option value="I'm Already Enrolled – Need Support">I'm Already Enrolled – Need Support</option>
                  </select>
                  <select
                    id="domain"
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-1.5 rounded-md"
                    required
                  >
                    <option disabled value="">
                      Domain currently working in
                    </option>
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
                                     type="submit" disabled={!emailVerified}
                                     onClick={(e) => setActionType("Only Download Brochure")}
                                     className="px-4 py-2 w-full bg-[#f15b29] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                     <i className="fa fa-download"></i>
                                   </button>
                                   <button
                                     type="submit" disabled={!emailVerified}
                                     onClick={(e) => setActionType("Requested To Call Back")}
                                     className="px-4 py-2 w-full bg-[#f15b29] flex items-center justify-center gap-1 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
        <section className=" py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className="text-[#f15b29] text-center  font-bold mb-8"
            >
              | Career Opportunities in{" "}
              <span className="text-white font-bold">Investment Banking</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobRoles.map((role, index) => (
                <div
                  data-aos="fade-up"
                  key={index}
                  className="border-l-4 border-[#f15b29] bg-black p-4 text-white shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p>{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <hr className=" opacity-10" />

        {/* Clients Carousel */}
        <div className="workat">
          <div className="alumni">
            <h1 className="text-[#f15b29] font-bold mb-6 text-center">
              | Our alumni at top Brands
            </h1>
            <p className="text-gray-400 mb-12 text-center">
              Their success stories inspire current students to aim for global
              excellence in their careers.
            </p>
            <ClientsCarousel />
          </div>
        </div>
        <hr className=" opacity-10" />

        {/* 12 key highlight section */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <div className=" mx-auto px-4 flex flex-col lg:flex-row gap-5">
              <div className="w-full mb-8 lg:mb-0">
                <h1
                  data-aos="fade-up"
                  className=" font-bold text-center mb-6 text-[#f15b29]"
                >
                  | Course Benefits at a Glance
                </h1>
                <p data-aos="fade-up" className="text-lg text-center mb-8">
                  Master advanced{" "}
                  <span className="text-[#f15b29] font-bold">
                    Investment Banking
                  </span>{" "}
                  techniques with hands-on projects, expert-led sessions, and
                  real-world applications.
                </p>
                <div
                  data-aos="fade-up"
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">200+</h3>
                    <p className="mt-2 text-gray-300">Mentees Placed</p>
                  </div>
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">
                      9+ LPA
                    </h3>
                    <p className="mt-2 text-gray-300">Highest CTC</p>
                  </div>
                  <div className=" p-6 rounded-lg text-center">
                    <h3 className="text-3xl font-bold text-[#f15b29]">96%</h3>
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

        {/* Flexible Payment Options */}
        <section className="py-[60px] px-[10px]">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-center font-extrabold text-[#f15b29] mb-12 text-3xl md:text-4xl">
              Our Flexible Payment Options
            </h1>
            
            {/* Payment Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left: Total Fee Box */}
              <div className="bg-gradient-to-br from-[#f15b29] to-[#b5401f] rounded-l-[80px] rounded-r-lg p-8 md:p-12 flex flex-col justify-center items-center shadow-2xl">
                <p className="text-white text-lg md:text-xl mb-4 font-medium">Total program fee</p>
                <p className="text-white text-5xl md:text-6xl font-bold">₹53,100</p>
                <p className="text-white text-sm mt-3 opacity-90">Inclusive of taxes</p>
              </div>
              
              {/* Right: Payment Breakdown */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-[#eee] text-lg">Registration</span>
                  <span className="text-[#eee] text-lg font-semibold">₹10,000</span>
                </div>
                <div className="py-3 border-b border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-[#eee] text-lg">Installment 1</span>
                    <span className="text-[#eee] text-lg font-semibold">₹21,550</span>
                  </div>
                  <p className="text-[#aaa] text-xs mt-1">*First installment must be paid within 15 days from the date of registration</p>
                </div>
                <div className="py-3 border-b border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-[#eee] text-lg">Installment 2</span>
                    <span className="text-[#eee] text-lg font-semibold">₹21,550</span>
                  </div>
                  <p className="text-[#aaa] text-xs mt-1">*Second installment must be paid within 15 days of first installment</p>
                </div>
              </div>
            </div>
            
            
            
            {/* Financial Partner */}
            <div className="flex flex-col justify-center items-center mt-12">
              <p className="mb-2 text-[#f15b29]">| Our Financial Partner</p>
              <img src={Flashaidlogo} alt="Financial Partner" className="h-[80px]"/>
            </div>
          </div>
        </section>

        {/* 9 mentors section  */}
        {/* <section className="py-[60px] px-[10px]">
          <div data-aos="fade-up" className="container mx-auto">
            <MentorSection />
          </div>
        </section>
        <hr className=" opacity-10" /> */}

        {/* 16 store section  */}
        <section className="bg-white py-[60px] px-[10px]">
          <StoreSection />
        </section>

        {/* 17 new FAQ section */}
        <section className=" bg-white py-[60px] px-[10px]">
          <div data-aos="fade-up" className="container mx-auto">
            <h1 className="text-center mb-2  font-bold text-[#f15b29]">
              | Ask Us Anything
            </h1>
            <div className="flex justify-center flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-1/4 w-full p-3 lg:border-r border-b md:border-b-0 text-black border-[#f15b29]">
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
                      className="border overflow-hidden rounded-lg "
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
                        <div className="p-4 bg-slate-100 text-black">
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
        <section>
          <div
            className={`fixed bottom-0 left-0 w-full z-10 bg-[#fff] shadow-md flex justify-between items-center p-4  transition-transform duration-300 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <p className="text-lg font-semibold text-black">
              Program fees 45,000/- + 18% GST
            </p>
            <div className="flex space-x-2">
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

export default Investmentbanking;
