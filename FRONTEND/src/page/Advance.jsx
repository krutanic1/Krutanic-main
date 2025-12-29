import {Helmet} from 'react-helmet';
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { EffectCube, Pagination, Autoplay } from "swiper/modules";

import img1 from "../assets/Advanced Course Images/Mern Stack Development/MSD 2.jpg";
import img2 from "../assets/Advanced Course Images/Digital Markting/DM 4.jpg";
import img3 from "../assets/Advanced Course Images/Data science/DS 4.jpg";
import img4 from "../assets/Advanced Course Images/Product management/PM 5.jpg";
import bgImage from "../assets/BG12.png";
import successmap from "../assets/1.png";
import girl from "../assets/girl.png"
import img from "../assets/developers/hacker.png"

import faqimg from '../assets/Advanced Course Images/Digital Markting/questionmark.jpg'
import datascience from '../assets/Advanced Course Images/Data science/DS 3.jpg'
import digital from '../assets/Advanced Course Images/Digital Markting/DM 1.jpg'
import Investmentbanking from '../assets/Advanced Course Images/Investment banking/IB 6.jpg'
import MERN from '../assets/Advanced Course Images/Mern Stack Development/MSD 1.jpg'
import ProductManagement from '../assets/Advanced Course Images/Product management/PM 4.jpg'
import  ProformanceMarket from '../assets/Advanced Course Images/Performance marketing/PM 3.jpg'
import AutomationTesting from '../assets/Advanced Course Images/AutomationvTesting/automationtesting.jpg'
import PromptAi from '../assets/Advanced Course Images/Prompt AI/prompt.avif'


import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";





const faqs = [
  {
    question: "Do I need a laptop to do the course?",
    answer:
      "A Laptop is mandatory to do the course. This is primarily because all your projects are industry-level and you would be able to do those projects only on a Laptop.",
  },
  {
    question: "What tools or software do I need for the course?",
    answer:
      "You will need access to a laptop/PC with internet connectivity, along with the relevant software tools and platforms, which will be shared by the instructors during the course.",
  },
  {
    question: "What is the duration of this course?",
    answer:
      "This Online Program will happen across 6 months. We will also share a detailed program calendar with you post your Admission.",
  },
  {
    question: "The course is available in which languages?",
    answer:
      "The course will happen only in English, not in any other regional language.",
  },
  {
    question: "Can I access the course material after the program ends?",
    answer:
      "Yes, all recorded sessions, course materials, and resources will be available to you even after the course ends for continued learning.",
  },
];

const Advance = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  
  const handleViewCourse1 = () => {
    navigate("/DataScience");
  };
  const handleViewCourse2 = () => {
    navigate("/DigitalMarket");
  };
  const handleViewCourse3 = () => {
    navigate("/Investmentbanking");
  };
  const handleViewCourse4 = () => {
    navigate("/MernStack");
  };
  const handleViewCourse5 = () => {
    navigate("/ProductManagement");
  };
  const handleViewCourse6 = () => {
    navigate("/Performancemarket");
  };  
  const handleViewCourse7 = () => {
    navigate("/AutomationTesting");
  };  
  const handleViewCourse8 = () => {
    navigate("/PromptEngineering");
  };  


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const courseSectionRef = useRef(null);
  const scrollToCourse = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "auto" });
  };

//FORM DATA SECTION
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
  interestedDomain:""
});
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
const handleBrochureClick = () => {
  setShowForm(true);
};

const FormOff = () => {
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
  });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!phoneRegex.test(formData.number)) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  if (!emailRegex.test(formData.email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

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
      interestedDomain: formData.interestedDomain,
      reason: "Requested To Call Back",
    });
    toast.success(`You have successfully applied, Our counselor will connect with you shortly.`);
    FormOff();
  } catch (error) {
    toast.error(
      error.response?.data?.error || "Something went wrong. Please try again."
    );
  }
};



  return (
    <div id="advance" className="">

      <Helmet>
        <title>Krutanic Advanced Program -Expert-Led Tech Courses with Internships 
</title>
        <meta name="description" content="Gain real-world skills with Krutanic's Advanced Program. Expert-led tech courses, best internships, certifications & placement support for your dream career."/>
        <meta name="keywords" content="online learning, career development, professional courses, tech training, data science, coding, upskilling, e-learning platform"/>
        <link rel="canonical" href="https://www.krutanic.com/Advance"/>
        <meta property="og:title" content="Krutanic Advance: Expert-Led Online Courses for Career Growth"/>
        <meta property="og:description" content="Advance your career with Krutanic's expert-led online courses in tech, data science, and coding. Gain in-demand skills and certifications."/>
        <meta property="og:url" content="https://www.krutanic.com/Advance"/>
        <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Krutanic Advance: Expert-Led Online Courses for Career Growth"/>
        <meta name="twitter:description" content="Advance your career with Krutanic's expert-led online courses in tech, data science, and coding. Gain in-demand skills and certifications."/>
        <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>

      </Helmet>











        <Toaster position="top-center" reverseOrder={false} />
          <section className="px-[10px] py-[60px]">
         <div  data-aos="fade-up" className="width flex items-center justify-center flex-wrap gap-[5rem]">
          <div  className="content lg:w-1/2 md:w-1/2 flex items-start flex-col max-[600px]:order-1 ">
            <h1  className="text-4xl font-bold mb-4 ">
          <span className="text-[#f15b29]">Transform with Krutanic’s Hands-On Learning Experience</span>
            </h1>
            <p  className="text-md mb-8 text-white">   
The Krutanic Advanced Program delivers an intensive, career-focused curriculum that blends theoretical learning with practical industry training. Students gain real-world project experience and mentor guidance, enabling them to confidently master the demands of Digital Marketing, Advanced Data Science, Investment Banking, Performance Marketing, Product Management, and MERN Stack Development. For more details and placement-support information, fill out the registration form.            </p>
            <button
             onClick={scrollToCourse}
              
              className="bg-[#f15b29] hover:bg-orange-700 text-white transition-colors duration-300 px-6 py-3 rounded-lg font-semibold"
            >
              Find Your Course

            </button>
          </div>
          <div className="">
          <Swiper
            effect={"cube"}
            loop="true"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            grabCursor={true}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            modules={[EffectCube, Autoplay, Pagination]}          
          >
            <SwiperSlide className=" shadow-lg shadow-orange-800">
              <img src={img1} />
            </SwiperSlide>
            <SwiperSlide className=" shadow-lg shadow-orange-800">
              <img src={img2} />
            </SwiperSlide>
            <SwiperSlide className=" shadow-lg shadow-orange-800">
              <img src={img3} />
            </SwiperSlide>
            <SwiperSlide className=" shadow-lg shadow-orange-800">
              <img src={img4} />
            </SwiperSlide>
          </Swiper>
          </div>
        
         </div>
        </section> 
        <hr className=" opacity-10"/>


      {/* Our Course Section */}
      <section ref={courseSectionRef} className="px-[10px] py-[60px]">
       <div className="width">
       <h1 className=" font-bold text-center py-5 text-[#f15b29]">
         | Our Advanced Courses
        </h1>
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-[10px] md:px-12 lg:px-26">
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
           <div className="overflow-hidden  lg:h-[300px]">
           <img
              src={datascience}
              alt="Data Science"
              className="hover:scale-110  ease-linear duration-700"
            />
           </div>
            <div className="p-2">
            <h3 className="text-xl font-semibold text-white mb-2">
              Data Science
            </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Analyzing data to find insights that guide business decisions.
            </p>
            <button
              onClick={handleViewCourse1}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
              Explore Details
            </button>
            </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center ">
           <div className="overflow-hidden lg:h-[300px]">
           <img
              src={digital}
              alt="digital marketing"
              className="hover:scale-110  ease-linear duration-700"
            />
           </div>
            <div className="p-2">
            <h3 className="text-xl font-semibold text-white mb-2">
              Digital Marketing
            </h3>
            <p className="text-sm text-white mb-4">
            Promoting products online through channels like social media, SEO, and ads to drive business goals.
            </p>
            <button
              onClick={handleViewCourse2}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
             Explore Details
            </button>
            </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
           <div className="overflow-hidden lg:h-[300px]">
           <img
              src={Investmentbanking}
              alt="Investment banking"
              className="hover:scale-110 ease-linear duration-700"
            />
           </div>
            <div className="p-2">
            <h3 className="text-xl font-semibold text-white mb-2">
              Investment Banking
            </h3>
            <p className="text-sm text-white mb-4">
            Advising on financial transactions and raising capital for companies.
            </p>
            <button
              onClick={handleViewCourse3}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
              Explore Details
            </button>
            </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
           <div className="overflow-hidden lg:h-[300px]">
           <img
              src={MERN}
              alt="MERN"
              className="hover:scale-110 ease-linear duration-700"
            />
           </div>
           <div className="p-2">
           <h3 className="text-xl font-semibold text-white mb-2">
              MERN Stack Devlopment
            </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Building web apps using MongoDB, Express.js, React, and Node.js
            </p>
            <button
              onClick={handleViewCourse4}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
              Explore Details
            </button>
           </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
            <div className="overflow-hidden lg:h-[300px]">
            <img
              src={ProductManagement}
              alt="Product Management"
              className="hover:scale-110 ease-linear duration-700"
            />
            </div>
            <div className="p-2">
            <h3 className="text-xl font-semibold text-white mb-2">
              Product Management
            </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Overseeing a product’s development from concept to market.

            </p>
            <button
              onClick={handleViewCourse5}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
               Explore Details
            </button>
            </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
            <div className="overflow-hidden lg:h-[300px]"> 
            <img
              src={ProformanceMarket}
              alt="Proformance Market"
              className="hover:scale-110 ease-linear duration-700"
            />
            </div>
             <div className="p-2">
             <h3 className="text-xl font-semibold text-white mb-2">
              Performance Marketing
            </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Marketing based on measurable actions, like clicks or sales.

            </p>
            <button
              onClick={handleViewCourse6}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
              Explore Details
            </button>
             </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
            <div className="relative overflow-hidden lg:h-[300px]"> 
            {/* <span className="absolute top-0 left-0 bg-red-500 rounded-br-md text-white px-2 py-1 text-sm font-semibold">
      Newly Launched
    </span> */}
            <img
              src={AutomationTesting}
              alt="Automation Testing"
              className="hover:scale-110 ease-linear duration-700"
            />
            </div>
             <div className="p-2">
             <h3 className="text-xl font-semibold text-white mb-2">
              Automation Testing
              </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Streamlining Quality with Precision: Empowering Automation Testing

            </p>
            <button
              onClick={handleViewCourse7}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] hover:text-white ease-linear duration-700"
            >
              Explore Details
            </button>
             </div>
          </div>
          <div className="bg-[#080808] shadow-sm shadow-slate-50 rounded-xl overflow-hidden flex flex-col items-center">
            <div className=" relative overflow-hidden lg:h-[300px]"> 
            {/* <span className="absolute top-0 left-0 bg-red-500 rounded-br-md text-white px-2 py-1 text-sm font-semibold">
      Newly Launched
    </span> */}
            <img
              src={PromptAi}
              alt="Prompt engineering for generative AI"
              className="hover:scale-110 ease-linear duration-700"
            />
            </div>
             <div className="p-2">
             <h3 className="text-xl font-semibold text-white mb-2">
             Generative AI With Prompt Engineering 
            </h3>
            <p className="text-sm -tracking-tighter text-white mb-4">
            Crafting the Future: Precision Prompt Engineering for Next-Gen AI

            </p>
            <button
              onClick={handleViewCourse8}
              className="bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] px-4 py-2 rounded-md hover:bg-[#f15b29] ease-linear duration-700"
            >
              Explore Details
            </button>
             </div>
          </div>
        </div>
       </div>
      </section>
      <hr className=" opacity-10"/>

       <section className="talktoadvisor px-[10px] py-[60px]">
          <div className="width rounded-lg overflow-hidden"> 
           <img onClick={handleBrochureClick} src={bgImage} alt="" className="cursor-pointer" />
          </div>
       </section>
       {showForm && (
                  <div className="fixed inset-0 lg:top-10 left-0 top-[20%] bg-gray-700 bg-opacity-50    z-[999] lg:flex justify-center items-center px-[20px]">
                    <div className="bg-white overflow-hidden lg:w-[800px] lg:flex md:flex  rounded-lg">
                      <div
                        id="hidden"
                        className="lg:w-1/2 md:w-1/2 relative text-black rounded-lg"
                      >
                        <h2 className="text-center font-bold text-[#f15b29] my-2">
                          Krutanic
                        </h2>
                        <ul className=" text-lg space-y-2 px-2">
                          <li>
                            <i className="fa fa-hand-o-right text-[#f15b29] pr-2"></i>Hands-On
                            Learing Via 50+ Projects
                          </li>
                          <li>
                            <i className="fa fa-hand-o-right text-[#f15b29] pr-2"></i>1:1
                            Mentorship From AI Specialists
                          </li>
                          <li>
                            <i className="fa fa-hand-o-right text-[#f15b29] pr-2"></i>
                            Personalized Career Guidence{" "}
                          </li>
                        </ul>
                        <div className="flex items-center justify-center">
                          <img
                            src={girl}
                            alt="girl"
                            className="absolute  bottom-0 h-[280px]"
                          />
                        </div>
                      </div>
                      <div className="rounded-lg lg:w-1/2 md:w-1/2 text-black p-3">
                        <h3 className="text-md text-center font-semibold mb-2">
                          Apply Now
                        </h3>
                        <form onSubmit={handleFormSubmit} className="space-y-2">
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
                            type="number"
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
                              {" "}
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
                          <select
                            id="interestedDomain"
                            name="interestedDomain"
                            value={formData.interestedDomain}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 p-1.5 rounded-md"
                            required
                          >
                            <option disabled value="">
                              Select interested domain
                            </option>
                            <option value="Data Science">
                            Data Science
                            </option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Investment Banking"> Investment Banking</option>
                            <option value="MERN Stack Devlopment">MERN Stack Devlopment</option>
                            <option value="Product Management">Product Management</option>
                            <option value="Performance Marketing">Performance Marketing</option>
                            <option value="Automation Testing">Automation Testing</option>
                            <option value="Generative AI With Prompt Engineering">Generative AI With Prompt Engineering</option>
                          </select>
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={FormOff}
                              className="px-4 py-1 text-gray-500 border border-gray-300 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1 bg-[#f15b29] text-white rounded-md"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
       )}
       <hr className=" opacity-10"/>

        {/* roadmap section */}
      <section className="px-[10px] lg:py-[60px] py-[20px]">
        <h1 className="font-bold text-center text-[#f15b29]">| Path To Success</h1>
        <div className="width lg:px-20">
           <img src={successmap} alt="Success Map" />
        </div>
      </section>
      <hr className=" opacity-10"/>

       {/* program info  */}
       <section className="px-[10px] py-[60px]">
        <div className="width">
          <h1 data-aos='fade-up' className=" text-center text-[#f15b29] justify-center font-semibold mb-9">
            | We have designed a flexible program for you{" "}
          </h1>
          <div data-aos='fade-up' className="px-4 grid lg:grid-cols-3 gap-3 text-white">
           
            <div className="bg-[#080808] rounded-lg p-4 text-center">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">
                {" "}
                Seeking practical experience?
              </h3>
              <p className="text-sm">
                Participate in hands-on projects and real-world case studies
                that enhance your learning and prepare you for the job market.
              </p>
            </div>

            
            <div className="bg-[#080808] rounded-lg p-4 text-center hover:shadow-lg">
              <div className="text-3xl mb-4">👨‍👩‍👦</div>
              <h3 className="text-xl font-semibold mb-2">
                Want to learn on the go?
              </h3>
              <p className="text-sm">
                Access our friendly platform and study anytime, anywhere, making
                your education truly portable and convenient.
              </p>
            </div>

            
            <div className="bg-[#080808] rounded-lg p-4 text-center hover:shadow-lg">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2">
                {" "}
                Jobs & class timings clash?
              </h3>
              <p className="text-sm">
                Our adaptable programs let you learn anytime, anywhere, ensuring
                you don’t miss out on opportunities.
              </p>
            </div>

           
            <div className="bg-[#080808]  rounded-lg p-4 text-center hover:shadow-lg">
              <div className="text-3xl mb-4">📑</div>
              <h3 className="text-xl font-semibold mb-2">
                Looking for community support?
              </h3>
              <p className="text-sm">
                Engage with fellow learners through discussion forums, group
                projects, and networking events.
              </p>
            </div>

          
            <div className="bg-[#080808] lg:col-span-2 rounded-lg p-4 text-center hover:shadow-lg">
              <div className="text-3xl mb-4">❓</div>
              <h3 className="text-xl font-semibold mb-2">
                {" "}
                Need guidance on career paths?
              </h3>
              <p className="text-sm">
                Take advantage of tailored career services, including resume
                reviews, interview coaching, and job placement assistance to
                help you achieve your professional goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      <hr className=" opacity-10"/>

       {/* what our student say */}
      <section className=" px-[10px] py-[60px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up" className=" font-bold text-center mb-12 text-[#f15b29]">
            | Voices of Our Students
          </h1>
          <div data-aos="fade-up"   className="grid md:grid-cols-3 lg:gap-8 gap-3">
            {[
              {
                image: `${img}`,
                name: <a href="https://in.linkedin.com/in/mohammedafan" target="blank" >"Mohammed Afan R" </a>,
                role: "MERN Developer",
                quote: "my journey with krutanic Innovators has been an incredible learning experience. The hands-on projects and guidance from experts have truly shaped my skills and passion for development.",
              },
              {
                image: `${img}`,
                name: <a href="https://in.linkedin.com/in/danish-raja-akhtar" target="blank" >"Danish Raja Akhtar"</a>,
                role: "Web Developer",
                quote: "Being a student here has been amazing! The mentorship and teamwork have helped me develop both technically and personally. I feel more confident in my skills every day.",
              },
              {
                image: `${img}`,
                name: <a href="https://in.linkedin.com/in/suryansh-saxena" target="blank" >"Suryansh Saxena" </a>,
                role: "MERN Developer",
                quote: "I’ve gained so much from krutanic Solution. The exposure to real-world challenges has helped me grow my problem-solving skills and prepared me for a successful career in tech.",
              },
              
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#080808] border border-slate-900 rounded-md">
                <div className="p-6">
                  <p className="mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full mr-4">
                      <img src={testimonial.image} alt="employee" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <h2 className="font-semibold">{testimonial.name}</h2>
                      <p className="text-sm text-[#F15B29] italic">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-[10px] py-[60px] bg-white">
        <div className="container width ">
          <h1 data-aos="fade-up" className=" font-bold text-[#f15b29] text-center py-5">
           | Frequently Asked Questions
          </h1>
         <div className="lg:flex lg:gap-2  overflow-hidden">
         <div  className="lg:space-y-6 space-y-1 lg:w-1/2">
            {faqs.map((faq, index) => (
              <div  key={index} className="border border-[#00000034] rounded-lg overflow-hidden ease-linear duration-500">
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-[#161515]"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <span className="text-2xl text-[#f15b29]">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-[#e5e5e9]">
                    <p className="text-black">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div  className=" lg:w-1/2 lg:mt-0 mt-4  overflow-hidden rounded-lg">
            <img className="w-full rounded-lg" src={faqimg} alt="img" />
          </div>
         </div>
        </div>
      </section>
     
    <div className="fixed bottom-8 bg-green-800 animate-bounce right-7 z-50 px-3 py-2 rounded-full">
        <a
          href="https://api.whatsapp.com/send?phone=919380736449&text=Hello%20Krutanic%20Team,%0A%0AI%20have%20some%20queries%20regarding%20my%20course.%0A%0AThank%20you!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-whatsapp rounded-full text-[3rem]"></i>
        </a>
      </div>
      
       {/* <section>
          <Getintouch/>
       </section> */}
       
    </div>
  );
};

export default Advance;
