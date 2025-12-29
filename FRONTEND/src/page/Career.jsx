import React, { useEffect, useRef, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import careeraboutimg from "../assets/Collaborate1.svg";
import { GiGearStickPattern } from "react-icons/gi";
import { TbCirclesFilled } from "react-icons/tb";
import { GiShakingHands } from "react-icons/gi";
import { IoMdInfinite } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import { SiRipple } from "react-icons/si";

import img from '../assets/career.jpg'

const Career = () => {
  const jobSectionRef = useRef(null);
  const scrollToJobs = () => {
    jobSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [openJobIndex, setOpenJobIndex] = useState(null); 
  const jobList = [
    {
      title: "Marketing Specialist (Lead Generater)",
      department: "Marketing",
      description:"Lead and execute innovative marketing campaigns to drive brand awareness and engagement. Ideal for creative thinkers with a flair for digital marketing.",
      location: "Bangalore",
    },
    // { title: "Business Development Associate (BDA)", 
    //   department: "Sales",
    //    location: "Bangalore",
    //     description:"Identify and engage potential clients, presenting our courses effectively. A role perfect for individuals with strong communication and sales skills.",
    //   },
    { title: "Operations Executive", 
      department: "Back Office",
       location: "Bangalore",
      description:"Manage day-to-day operations, ensuring smooth processes and efficiency. A great fit for detail-oriented individuals who excel at multitasking.",
      },
    {
      title: "HR Specialist",
      department: "HR",
      location: "Bangalore",
      description:"Handle recruitment, employee engagement, and HR strategies to support our growing team. Ideal for those with strong interpersonal skills and HR expertise.",
    },
    { title: "Business Operations Executive", 
      department: "Back Office",
       location: "Bangalore",
      description:"Oversee and streamline business operations, working closely with different departments to optimize performance and processes.",
      },
    { title: "Content Writer", 
      department: "Digital Marketing",
       location: "Bangalore",
      description:"Create compelling and engaging content for our website, blogs, and social media channels. Perfect for creative writers with a passion for storytelling.",
      },
    { title: "Corporate Placement Coordinator", 
      department: "Back Office",
       location: "Bangalore",
      description:"Build and maintain relationships with corporate partners to facilitate placement opportunities for our learners. A role for those who excel in networking and coordination.",
      },
    { title: " Product Manager", 
      department: "Back Office",
       location: "Bangalore",
      description:"Oversee the development and launch of new courses, ensuring they meet market needs and deliver value to our learners. Ideal for strategic thinkers with product management experience.",
      },
    { title: "Corporate Mentor", 
      department: "Back Office",
       location: "Bangalore",
      description:"We are looking for an experienced Corporate Mentor with at least 5 years in a corporate environment. The ideal candidate will have strong leadership, coaching, and mentorship skills to guide and empower employees at all levels. You will play a key role in fostering professional growth, enhancing team development, and driving organizational success.",
      },
  ];
  const toggleVisibility = (index) => {
    setOpenJobIndex(openJobIndex === index ? null : index); 
  };
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  const [reveal, setReveal] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const revealThreshold = 100; 
    const direction = currentScrollY > lastScrollY ? "down" : "up";
    setScrollDirection(direction);
    if (currentScrollY > revealThreshold && direction === "down") {
      setReveal(true);
    } else if (direction === "up") {
      setReveal(false);
    }
    setLastScrollY(currentScrollY); 
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  const words = "Krutanic is your gateway to mastering industry-leading skills. As a premier course provider, we are dedicated to offering high-quality, in-demand programs designed to empower individuals and help them excel in their careers. With a strong focus on delivering real-world skills.".split(" "); // Split the text into words

  return (
    <div id="career" className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section  style={{ backgroundImage: `url(${img})` }} className={`py-[20px]  bg-cover bg-center h-[100dvh] flex items-center justify-center  px-[10px]`}>
       <div className="flex  container mx-auto  justify-between px-4">
       <div className="w-full text-center flex items-center justify-center flex-col ">
          <h1
          data-aos="fade-up"   className="text-4xl font-bold mb-4 text-orange-700">
            Join Our Mission to Transform Education
          </h1>
          <p
          data-aos="fade-up"   className="text-xl mb-8">
            Be part of a team that's shaping the future of learning
          </p>
          <button
          data-aos="fade-up"  
            onClick={scrollToJobs}
            className="bg-white text-orange-600 px-8 py-3 rounded-full text-xl font-semibold "
          >
            View Open Positions
          </button>
        </div>
       </div>
      </section>

      {/* about us */}
      <section className="py-[60px] px-[10px] z-10 relative ">
        <div className="container mx-auto px-4">
          <div className="lg:flex">
            <div className="w-full lg:w-1/2 mb-4 flex flex-col">
              <h1 data-aos="fade-up"   className=" font-bold mb-6 text-orange-700">
                | About Our Company
              </h1>
             <p className=" text-2xl">
        {words.map((word, index) => (
          <span
            key={index}
            className={`mr-2 inline-block ${
              reveal
                ? "opacity-100 blur-none transition-all duration-1000"
                : scrollDirection === "up" && index >= words.length - 1
                ? "opacity-0 blur-md transition-all duration-1000"
                : "opacity-0 blur-md"
            }`}
            style={{
              transitionDelay: `${Math.abs(index - (reveal ? 0 : words.length - 1)) * 100}ms`,
            }}
          >
            {word}{" "}
          </span>
        ))}
      </p>
            </div>
            <div data-aos="fade-up"   className="relative overflow-hidden w-full lg:w-1/2">
              <img
                src={careeraboutimg}
                alt="Team collaboration"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-[60px] px-[10px] z-10 relative">
        <div className="container mx-auto px-4">
          <h1 data-aos="fade-up"   className=" font-bold text-center mb-12 text-orange-700">
            | Our Values
          </h1>
          <div data-aos="fade-up"  className="grid md:grid-cols-3 gap-3">
            {[
              {
                title: "Innovation",
                description:
                  "We constantly push the boundaries of what's possible in edtech.",
                  icon:<GiGearStickPattern />
              },
              {
                title: "Inclusivity",
                description:
                  "We believe in making quality education accessible to everyone.",
                  icon:<TbCirclesFilled />

              },
              {
                title: "Collaboration",
                description:
                  "We foster a culture of teamwork and open communication.",
                  icon:<GiShakingHands />
              },
              {
                title: "Lifelong Learning",
                description: "We encourage continuous growth and development.",
                icon:<IoMdInfinite />
              },
              {
                title: "Integrity",
                description:
                  "We uphold the highest standards of honesty and ethical behavior.",
                  icon:<IoShieldCheckmark />

              },
              {
                title: "Impact",
                description:
                  "We measure our success by the positive change we create in learners' lives.",
                  icon:<SiRipple />
              },
            ].map((value, index) => (
              <div key={index} className="bg-[#080810] rounded-md">
                <div className="px-3 py-5 text-center">
                   <span className="text-4xl inline-block">{value.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      {/* Job Section */}
      <section ref={jobSectionRef} id="job-openings" className="z-10 relative bg-[#080810ce]  px-[10px]  py-[60px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up"   className=" font-bold text-center mb-12 text-orange-700">
            | Current Job Openings
          </h1>
          <div data-aos="fade-up"   className="space-y-10">
            {jobList.map((job, index) => (
              <div key={index} className="border-b p-2 rounded-lg shadow-md ">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleVisibility(index)}
                >
                  <span className="text-lg font-semibold">{job.title}</span>
                  <span className="text-sm text-gray-500">
                   {job.location}
                  </span>
                </div>
                <div
                  className={` mt-2 mb-2 text-white transition-all max-h-0 overflow-hidden ${
                    openJobIndex === index
                      ? "opacity-100 max-h-[500px]"
                      : "opacity-0 max-h-0"
                  }`}
                >
                  <p className="py-5">
                    {job.description}
                  </p>
                   {/* <div>
                    <h2>Kindly Share your updated resume</h2>
                   </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  
 
         {/* Why Work With Us */}
      <section className="py-[60px] px-[10px] z-10  relative bg-white text-black ">
        <div className="container mx-auto px-4">
          <h1 data-aos="fade-up"   className=" font-bold text-center mb-12 text-orange-700">
            | Why Work With Us
          </h1>
          <div data-aos="fade-up"   className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Career Growth",
                description: " Clear pathways for professional development and internal promotions.",
              },
              {
                title: "Team Collaboration",
                description: "A culture that nurture teamwork and idea exchange.",
              },
              {
                title: "Recognition",
                description:
                  "Acknowledgment of hard work through rewards and bonuses.",
              },
              {
                title: "Paid Leave",
                description:
                  "Generous paid leave options to support your personal time and well-being.",
              },
              {
                title: "Learning and Development",
                description:
                  "Access to training programs and certifications to advance your skillset.",
              },
              {
                title: "Inclusive Culture",
                description:
                  "A diverse and inclusive workplace where every voice is valued.",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-orange-700 text-white p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Career;
