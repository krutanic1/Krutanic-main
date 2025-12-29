import React, { useEffect, useRef } from "react";
import { FaClock, FaUserFriends, FaGraduationCap } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import feesimg from "../assets/courses/feesimg.jpeg";
import { Link } from "react-router-dom";

const courses = [
  { name: "Full Stack Web Development" },
  { name: "Human Resource" },
  { name: "Android App Development" },
  { name: "Artificial Intelligence" },
  { name: "Machine Learning" },
  { name: "Data Science" },
  {name: "Cyber Security" },
  { name: "Data Analytics" },
  { name: "UI/UX Design" },
  { name: "DevOps" },
  { name: "Bussiness Analytics" },
  { name: "Finance" },
  { name: "Digital Marketing" },
  { name: "Stock Marketing" },
  { name: "Supply Chain Management" },
  { name: "Graphics Design" },
  { name: "Fintech" },
  { name: "Embedded System" },
  { name: "Cloud Computing" },
  { name: "IOT & Robotics" },
  { name: "Psychology" },
  { name: "Auto Cad" },
  { name: "Automation Testing (Career Advancement)" },
];

const features = [
  {
    category: "Self-guided",
    icon: FaClock,
    price: "₹ 6,999",
    points: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "No Live Sessions",
      "No Doubt Clearing Session",
      "No Mentor Guidance",
      "No Placement Assistance",
      "No Mock Interviews",
    ],
    registrationLink: "https://rzp.io/rzp/Self_Guided_Slot_Booking",
    paymentLink: "https://pages.razorpay.com/Self-Paced-Full-Payment",
    description:
      "Explore and learn at your own pace. Take charge of your journey with tools and resources designed for independent exploration and mastery.",
  },
  {
    category: "Instructor Led",
    icon: FaUserFriends,
    price: "₹ 9,999",
    points: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "Live Sessions",
      "Doubt Clearing Session",
      "Mentor Guidance",
      "No Placement Assistance",
      "No Mock Interviews",
    ],
    registrationLink: "https://rzp.io/rzp/Instructor_Led_Slot_Booking",
    paymentLink: "https://rzp.io/rzp/Instructor_Led_Full_Enrollment",
    description:
      "Learn with expert guidance in a structured environment. Benefit from real-time feedback and collaborative learning opportunities..",
  },
  {
    category: "Career Advancement",
    icon: FaGraduationCap,
    price: "₹ 15,999",
    points: [
      "Record Session",
      "Hands On Project",
      "Certification",
      "Live Sessions",
      "Doubt Clearing Session",
      "Mentor Guidance",
      "Placement Assistance",
      "Mock Interviews",
      "Access to Our Hiring Partners",
      "ATS-Friendly Resume Building",
      "Personality Development"
    ],
    registrationLink: "https://rzp.io/rzp/Career_Advance_Slot_Booking",
    paymentLink: "https://rzp.io/rzp/Career_Advancement_Full_Reg",
    description:
      "Elevate your skills and unlock new opportunities. Empower your professional growth with targeted resources and support..",
  },
];


export default function FeeStructure() {


  const LeearningSectionRef = useRef(null);
  const scrollToCourse = () => {
    LeearningSectionRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    AOS.init({ duration: 2000, once: false });
  }, []);

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="py-[60px] px-[10px]">
        <div className="container text-white flex flex-col justify-center lg:py-5 mx-auto lg:flex-row lg:items-center gap-4 lg:justify-between">
          <div className="text-left lg:text-center lg:w-1/2">
            <h1 data-aos="fade-up"  className="text-5xl font-bold leading-none sm:text-6xl">
              Fee
              {" "}
              <span className="text-[#f15b29]">Structure</span>
            </h1>
            <p data-aos="fade-up"  className="mt-6 lg:mb-4 mb-2 text-lg">
              Flexible plans help you learn and grow-pay upfront, split the fee, or use income-share, with internship and placement support included. 
            </p>
            <div data-aos="fade-up"  className="flex flex-col space-y-4 sm:items-center sm:justify-center  sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-center">
              <Link
                to="/Mentorship"
                className="px-8 py-3 text-lg font-semibold border rounded dark:border-gray-800"
              >
               Choose a Course
              </Link>
            </div>
          </div>
          <div data-aos="fade-up"  className=" lg:w-1/2">
            <img src={feesimg} alt="" className="rounded-lg " />
          </div>
        </div>
      </section>
      <hr className=" opacity-10"/>

      {/* Fee Structure Table */}
      <section className="py-[60px] px-[10px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up"  className="text-center font-extrabold  text-[#f15b29] mb-8">
            | Course Fee Structure
          </h1>
          <div data-aos="fade-up"  id="fees">
            <table>
              <thead>
                <tr>
                  <th scope="col">Course Name</th>
                  <th scope="col">Self-guided</th>
                  <th scope="col">Instructor Led</th>
                  <th scope="col">Career Advancement</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index}>
                    <td className=" font-semibold" data-label="Couse Name">
                      {course.name}
                    </td>
                    <td  className="text-center" data-label="Self-guided">
                      {
                        course.name === "Automation Testing (Career Advancement)" ? (
                          <button
                            className="relative line-through  cursor-not-allowed"
                          >
                          --------------
                          </button>
                        ) : (
                          <button
                            onClick={scrollToCourse}
                            className="relative group bg-[#f15b29] text-white px-4 py-2 rounded hover:bg-[#f15b29] focus:outline-none"
                          >
                            Preview
                          </button>
                        )
                      }
                    </td>
                    <td className="text-center"  data-label="Instructor Led">
                    {
                        course.name === "Automation Testing (Career Advancement)" ? (
                          <button
                            className="relative line-through  cursor-not-allowed"
                          >
                            --------------
                          </button>
                        ) : (
                          <button
                            onClick={scrollToCourse}
                            className="relative group bg-[#f15b29] text-white px-4 py-2 rounded hover:bg-[#f15b29] focus:outline-none"
                          >
                            Preview
                          </button>
                        )
                      }
                    </td>
                    <td  className="text-center" data-label="Career Advancement">
                      <button
                        onClick={scrollToCourse}
                        className="relative group bg-[#f15b29] text-white px-4 py-2 rounded hover:bg-[#f15b29] focus:outline-none"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <hr className=" opacity-10"/>
      
      <section ref={LeearningSectionRef} className="py-[60px] px-[10px]">
        <div className="container mx-auto">
          <h1 data-aos="fade-up"  className="text-center font-extrabold text-[#f15b29] mb-5">
            | Learning Categories
          </h1>
          <div data-aos="fade-up" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#ffffff11] shadow-sm shadow-white drop-shadow-md overflow-hidden rounded-3xl transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="px-4 py-5 sm:p-6">
                
                  <h3 className="text-2xl font-medium text-[#eee] flex gap-2 mb-4">
                  <feature.icon className="h-8 w-8 text-[#f15b29] border rounded-full p-2 border-[#2e2e2e]" />  {feature.category}
                  </h3>
                  <p className="mt-2 text-sm text-[#eee]">
                    {feature.description}
                  </p>
                  <p className="mt-4 text-2xl font-semibold text-white">
                    {feature.price}/-
                  </p>
                  <ul className="mt-4 list-disc pl-5 text-[#eee]">
                    {feature.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                    <li>
                      <a
                        href={feature.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f15b29]"
                      >
                        Slot Booking Link
                      </a>
                    </li>
                    
                      {
                        feature.category === "Self-guided" ? null : (
                          <li>
                            <a
                        href={feature.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f15b29]"
                      >
                        Full Registration Link
                      </a>
                       </li>
                        )
                      }
                     
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    
      <section className="text-white">
         <section className="py-[60px] px-[10px]">
          <div className="container mx-auto">
            <h1 data-aos="fade-up"  className="text-center font-extrabold text-[#f15b29] mb-8" >  | Flexible Payment Options </h1>
            <div data-aos="fade-up" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="bg-[#ffffff11] drop-shadow-md overflow-hidden shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl" >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-2xl font-bold text-[#eee]">
                    Installments
                    </h3>
                    <p className="mt-2 text-sm text-[#eee]">
                    Learning is now more accessible than ever. With our flexible EMI options, you can break down the cost of your course into manageable payments. Choose a plan that fits your budget and schedule, and focus on mastering new skills without worrying about the financial burden.
                    </p>
                  </div>
                </div>
                <div className="bg-[#ffffff11] drop-shadow-md overflow-hidden shadow-lg rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl" >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-2xl font-bold text-[#eee]">
                    Full Payment
                    </h3>
                    <p className="mt-2 text-sm text-[#eee]">
                    Invest in your future with a one-time payment that grants you lifetime access to all course materials. No recurring fees or hidden costs—just seamless, uninterrupted learning. Plus, enjoy additional savings with this all-inclusive option, ensuring you get the most value for your education.
                    </p>
                  </div>
                </div>
            </div>
          </div>
         </section>
       </section>
      

      <section className="py-[60px] px-[10px] bg-white">
        <div data-aos="fade-up"   className="container mx-auto text-center">
          <h2 data-aos="fade-up"  className="text-3xl font-extrabold text-[#f15b29]  mb-4">
            | Ready to launch your career with us?
          </h2>
          <p data-aos="fade-up"  className="text-xl  mb-8">
            Your dream career is just a step away. Enroll today and begin your
            transformation
          </p>
          <button  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#f15b29] hover:bg-[#f15b29] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
            <Link  to="/Contactus">Contact Us</Link>
          </button>
        </div>
      </section>
    </div>
  );
}
