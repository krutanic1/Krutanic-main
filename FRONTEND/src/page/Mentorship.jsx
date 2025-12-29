import {Helmet} from 'react-helmet';
import React, {useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import certificate1 from "../assets/certificates/c/completion.jpg";
import certificate3 from "../assets/certificates/c/training.jpg";
import adobe from "../assets/certificates/c/internship.jpg"
// import accreditedby from "../assets/poplogo/accreditedby.png"
import Testimonial from "../Components/testimonial";
import FAQMentor from "./Mentorship/FAQMentor";
import EnrollMentor from "./Mentorship/EnrollMentor";
import PopularCourse from "./Mentorship/PopularCourse"; 
import CourseMentor from "./Mentorship/CourseMentor";
import Getintouch from "../Components/Getintouch";
import { useNavigate } from "react-router-dom";
import MentorShipMentors from "../Components/MentorShipMentors";
import MentorshipForm from "./MentorshipForm";
import LinkedIn from '../Components/LinkedIn';


const Mentorship = () => {


  const courseSectionRef = useRef(null);
  const scrollToCourse = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    AOS.init({ duration: 2000, once: false });
  }, []);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/FeeStructure");
  };

  return (
    <div id="mentorship" className="text-white bg-black">
    <Helmet>
        <title>Krutanic Mentorship Program - Data Science, AI, Full Stack, Digital Marketing  </title>
        <meta name="keywords" content="Top E-learning, mentorship, tech mentorship, data science, coding, online learning, career growth"/>
        <meta name="description" content="Krutanic offers a career-driven Mentorship Program with expert guidance, hands-on training, and 100+ internship opportunities in Data Science, Artificial Intelligence, Machine Learning, Cyber Security, Full Stack Web Development, Cloud Computing, and Digital Marketing"/>
        <meta property="og:title" content="Top E-Learning Mentorship Programs | Krutanic"/>
        <meta property="og:url" content="https://www.krutanic.com/Mentorship"/>
        <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
        <meta property="og:description" content="Join Krutanic’s top e-learning mentorship to grow your tech, coding, and data skills with expert guidance."/>
        <meta property="og:type" content="website"/>
        <meta name="twitter:card" content="summary"/>
        <meta property="twitter:title" content="Top E-Learning Mentorship Programs | Krutanic"/>
        <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
        <meta property="twitter:description" content="Join Krutanic’s top e-learning mentorship to grow your tech, coding, and data skills with expert guidance."/>
        <link rel="canonical" href="https://www.krutanic.com/Mentorship"/>
    </Helmet>

      {/* Hero Section */}
      <section id="mentorshipbg" className="h-[650px] shadow-lg shadow-[#f15b29]  flex  items-center justify-center py-[60px] px-[10px] overflow-hidden">
        <div className="container mx-auto">
        <div data-aos="fade-up" className="rounded-lg backdrop-blur-xl text-center py-2 bg-[#ffffff46]">      
            <div className="flex flex-col  items-center justify-center lg:py-[20px]">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-6">
                Discover  a Smarter Way to Learn with Krutanic's {" "}
                <span className="text-[#f15b29]">MENTORSHIP PROGRAM.</span>
              </h1>
              <p className="text-lg text-black mb-6">
                Gain personalized career guidance, hands-on training, and expert mentorship to achieve your professional and personal goals. Whether you want to build new skills, advance in your career, or explore fresh opportunities, our mentorship program provides the support you need to succeed. 
              </p>
              <button
                onClick={scrollToCourse}
                className=" border border-[#f15b29] mb-3 lg:mb-0 text-black px-6 py-3 rounded-md font-semibold"
              >
                Explore Courses Catolog
              </button>
            </div>
            <div className=" flex items-center justify-center">
             <MentorshipForm/>
            </div>
        </div>
        </div>
      
      </section>
      
      <hr className=" opacity-10"/>

      <section ref={courseSectionRef} className="py-[60px] px-[10px]">
        <CourseMentor />
      </section>
       <hr className=" opacity-10"/>

      <section className="py-[60px] px-[10px]">
        <PopularCourse />
      </section>
       <hr className=" opacity-10"/>

       {/* <section className="py-[60px] px-[10px]">
        <div className="container mx-auto flex items-center justify-center">
            <img src={accreditedby} alt="accreditedby" className="rounded-xl w-[900px]" />
        </div>
      </section>
       <hr className=" opacity-10"/> */}

      {/* certification section */}
      <section className="py-[60px] px-[10px]"> 
        <div className="container mx-auto">
          <h1
            className=" font-bold text-[#f15b29] mb-2 text-center justify-center"
          >
            | Certification Overview
          </h1>
          <div className="p-6">
            <div>
              <div className="flex items-center flex-col lg:flex-row px-3 gap-5 py-2">
                {/* Left Section */}
                <div className="w-full">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white">
                      Program Highlight
                    </h2>
                    <p className="text-gray-300"></p>
                  </div>

                  <div className="space-y-6 flex flex-wrap">
                    <div className="flex items-center gap-4 lg:w-1/2 md:w-1/2">
                      <div className="bg-[#f15b29] p-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <p className="text-white">
                        Created for business leaders, advisors and innovators 
                      </p>
                    </div>

                    <div className="flex items-center gap-4 lg:w-1/2 md:w-1/2">
                      <div className="bg-[#f15b29] p-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <p className="text-white">
                        Builds skills and creativity for career growth 
                      </p>
                    </div>

                    <div className="flex items-center gap-4 lg:w-1/2 md:w-1/2">
                      <div className="bg-[#f15b29] p-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                        <p className="text-white"> 100+ Internship Partners</p>
                    </div>

                    <div className="flex items-center gap-4 lg:w-1/2 md:w-1/2">
                      <div className="bg-[#f15b29] p-2 rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                        <p className="text-white"> Approved by leading industry experts </p>
                    </div>
                  </div>
                </div>

              </div>
                <div className="w-full mt-5">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-2 md:grid md:grid-cols-2 md:gap-3 ">               
                        <div className="px-2 mb-5 lg:mb-0">
                          <img
                           src={adobe}
                            alt="Program Image 1"
                            className="w-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="px-2">
                          <img
                            src={certificate3}
                            alt="Program Image 3"
                            className="w-full object-cover rounded-lg"
                          />
                        </div>                    
                    </div>   

                    {/* <div className="flex items-center justify-center mt-5">
                      <img src={adobe} alt="adobe certificate" className=' object-cover rounded-lg w-[800px]' />  
                    </div>         */}
                </div>
     
            </div>
          </div>
        </div>
      </section>
       <hr className=" opacity-10"/>

      {/* Testimonials Section */}
      <section id="advancesection" className="py-[60px] px-[10px]">

         <h1 data-aos='fade-up' className="text-center text-[#f15b29]"> | What Our Mentees Are Saying</h1>
       
        <div data-aos='fade-up' className="testimonial">
          <Testimonial />
          <LinkedIn />
        </div>
      </section>

      {/* fee structure reference  */}
      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto flex items-center justify-center border-t border-b border-gray-400 rounded-3xl py-6">
          <div className="text-center">
            <h1 className=" font-bold text-[#f15b29] mb-4">
              Want to Know the Fee Structure?
            </h1>
            <p className="text-white mb-6">
            Find detailed information about our mentorship program and fees on the subsequent page.
            </p>
            <button
              onClick={handleNavigate}
              className="bg-[#f15b29] hover:bg-[#f15b29] text-white font-semibold py-2 px-4 rounded"
            >
              View Pricing Information
            </button>
          </div>
        </div>
      </section>
       <hr className=" opacity-10"/>


        {/* mentors section */}
      <section className="py-[60px] px-[10px]">
        <div>
          <MentorShipMentors/>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-[60px] px-[10px]">
        <FAQMentor />
      </section>

      {/* enrollement section */}
      <section className="py-[60px] px-[10px]">
        <EnrollMentor />
      </section>
 
       <section>
        <Getintouch/>
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
  
         
    </div>
  );
};

export default Mentorship;
