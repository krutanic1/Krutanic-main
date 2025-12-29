import React, { useState } from "react";
import fullStack from "../../assets/mentorshipcourses/full stack.png";
import android from "../../assets/mentorshipcourses/android.png";
import artificial from "../../assets/mentorshipcourses/AI.png";
import machine from "../../assets/mentorshipcourses/Machine learning.png";
import cyber from "../../assets/mentorshipcourses/cyber.png";
import datascience from "../../assets/mentorshipcourses/Data science.png";
import cloudcomputing from "../../assets/mentorshipcourses/cloud computing.png";
import embeddedsystem from "../../assets/mentorshipcourses/embedded.png";
import iotandrobotics from "../../assets/mentorshipcourses/robotics.png";
import autocad from "../../assets/mentorshipcourses/Autocad.png";
import uiux from "../../assets/mentorshipcourses/ui & ux.png";
import graphicdesign from "../../assets/mentorshipcourses/graphic.png";
import bussinessanalytics from "../../assets/mentorshipcourses/buis.. analytics.png";
import digitalmarketing from "../../assets/mentorshipcourses/digital marketing.png";
import finance from "../../assets/mentorshipcourses/finance.png";
import hr from "../../assets/mentorshipcourses/HR.png";
import stockmarketing from "../../assets/mentorshipcourses/stock market.png";
import supplychainmanagement from "../../assets/mentorshipcourses/supply.png";
import psycho from "../../assets/mentorshipcourses/psyc.png";
import fintech from "../../assets/mentorshipcourses/fintech.png";
// import nano from "../../assets/mentorshipcourses/genetic.png";
import dataanalytics from "../../assets/mentorshipcourses/DA.jpg";
import devops from "../../assets/mentorshipcourses/DEVOPS.jpg";
import automationtesting from "../../assets/mentorshipcourses/automatingtestingmin.avif";
import { RiCustomerService2Fill } from "react-icons/ri";
import pdf1 from "../../../krutanic/Android Development.pdf";
import pdf2 from "../../../krutanic/Artificial Intelligence.pdf";
import pdf3 from "../../../krutanic/AutoCad Brochure.pdf";
import pdf4 from "../../../krutanic/Business Analytics.pdf";
import pdf5 from "../../../krutanic/Cloud Computing.pdf";
import pdf6 from "../../../krutanic/Cyber Security.pdf";
import pdf7 from "../../../krutanic/Data Analytics.pdf";
import pdf8 from "../../../krutanic/Data Science.pdf";
import pdf9 from "../../../krutanic/Dev ops.pdf";
import pdf10 from "../../../krutanic/Digital Marketing.pdf";
import pdf11 from "../../../krutanic/Embedded System.pdf";
import pdf12 from "../../../krutanic/Finance.pdf";
import pdf13 from "../../../krutanic/FinTech.pdf";
import pdf14 from "../../../krutanic/Full Stack Development.pdf";
import pdf15 from "../../../krutanic/Graphic Design.pdf";
import pdf16 from "../../../krutanic/Human Resource.pdf";
import pdf17 from "../../../krutanic/IOT and Robotics.pdf";
import pdf18 from "../../../krutanic/Machine Learning.pdf";
import pdf19 from "../../../krutanic/Automation Testing.pdf";
import pdf20 from "../../../krutanic/Psychology.pdf";
import pdf21 from "../../../krutanic/Stock Market.pdf";
import pdf22 from "../../../krutanic/Supply Chain Management.pdf";
import pdf23 from "../../../krutanic/UI  UX-min.pdf";

import axios from "axios";
import API from "../../API";
import toast, { Toaster } from "react-hot-toast";

const CourseMentor = ({}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeEmail: "",
    number: "",
    collegeName: "",
    domain: "",
    passingyear: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("Computer science");

  const categories = [
    "Computer science",
    "Management",
    "Electronics/Electrical",
    "Medical",
    "Mechanical",
  ];
  const coursesData = {
    "Computer science": [
      {
        id: 1,
        title: "Full Stack Web Development",
        image: `${fullStack}`,
        pdf: `${pdf14}`,
        description:
          "Building and managing both the front-end and back-end of websites.",
        rating: 4.7,
        studentsTaken: 2298,
      },
      {
        id: 2,
        title: "Android App Development",
        image: `${android}`,
        pdf: `${pdf1}`,
        description:
          "Designing and developing mobile apps for Android devices.",
        rating: 4.9,
        studentsTaken: 1980,
      },
      {
        id: 3,
        title: "Artificial Intelligence",
        image: `${artificial}`,
        pdf: `${pdf2}`,
        description:
          "Creating systems that simulate human intelligence for tasks like decision-making.",
        rating: 4.8,
        studentsTaken: 2340,
      },
      {
        id: 4,
        title: "Machine Learning",
        image: `${machine}`,
        pdf: `${pdf18}`,
        description:
          "Teaching machines to recognize patterns and make predictions from data.",
        rating: 4.7,
        studentsTaken: 2456,
      },
      {
        id: 5,
        title: "Cyber Security",
        image: `${cyber}`,
        pdf: `${pdf6}`,
        description:
          "Protecting networks, systems, and data from cyber attacks.",
        rating: 4.9,
        studentsTaken: 2409,
      },
      {
        id: 6,
        title: "Data Science",
        image: `${datascience}`,
        pdf: `${pdf8}`,
        description:
          "Analyzing large data sets to extract insights and inform decisions.",
        rating: 4.8,
        studentsTaken: 2699,
      },
      {
        id: 7,
        title: "Data Analytics",
        image: `${dataanalytics}`,
        pdf: `${pdf7}`,
        description:
          "Interpreting data to help businesses improve performance and make decisions.",
        rating: 4.7,
        studentsTaken: 2690,
      },
      {
        id: 8,
        title: "UI/UX Design",
        image: `${uiux}`,
        pdf: `${pdf23}`,
        description:
          "Designing intuitive user interfaces and ensuring a positive experience.",
        rating: 4.9,
        studentsTaken: 2590,
      },
      {
        id: 9,
        title: "DevOps",
        image: `${devops}`,
        pdf: `${pdf9}`,
        description: "Implement DevOps practices for software development.",
        rating: 4.8,
        studentsTaken: 1899,
      },
      {
        id: 21,
        title: "Automation Testing",
        image: `${automationtesting}`,
        pdf: `${pdf19}`,
        description: "Speed, Accuracy, Efficiency—Redefining Quality",
        rating: 4.5,
        studentsTaken: 1275,
      },
    ],
    Management: [
      {
        id: 10,
        title: "Business Analytics",
        image: `${bussinessanalytics}`,
        pdf: `${pdf4}`,
        description: "Using data to optimize business decisions and strategies",
        rating: 4.7,
        studentsTaken: 2102,
      },
      {
        id: 11,
        title: "Finance",
        image: `${finance}`,
        pdf: `${pdf12}`,
        description:
          "Managing money, investments, and financial planning for individuals or companies.",
        rating: 4.8,
        studentsTaken: 2076,
      },
      {
        id: 12,
        title: "Human Resource",
        image: `${hr}`,
        pdf: `${pdf16}`,
        description:
          "Overseeing recruitment, employee development, and organizational culture.",
        rating: 4.9,
        studentsTaken: 2087,
      },
      {
        id: 13,
        title: "Digital Marketing",
        image: `${digitalmarketing}`,
        pdf: `${pdf10}`,
        description:
          " Promoting products and services through digital channels like social media and search engines.",
        rating: 4.7,
        studentsTaken: 2257,
      },
      {
        id: 14,
        title: "Stock Marketing",
        image: `${stockmarketing}`,
        pdf: `${pdf21}`,
        description:
          "Trading stocks, bonds, and other securities in financial markets.",
        rating: 4.8,
        studentsTaken: 980,
      },
      {
        id: 15,
        title: "Supply Chain Management",
        image: `${supplychainmanagement}`,
        pdf: `${pdf22}`,
        description:
          "Managing the production, distribution, and delivery of products.",
        rating: 4.7,
        studentsTaken: 1069,
      },
      {
        id: 16,
        title: "Graphics Design",
        image: `${graphicdesign}`,
        pdf: `${pdf15}`,
        description: "Creating visual content for digital and print media.",
        rating: 4.9,
        studentsTaken: 2669,
      },
      {
        id: 17,
        title: "Fintech",
        image: `${fintech}`,
        pdf: `${pdf13}`,
        description:
          "Technology to improve financial services like banking, payments, and investments.",
        rating: 4.8,
        studentsTaken: 1250,
      },
    ],
    "Electronics/Electrical": [
      {
        id: 18,
        title: "Embedded System",
        image: `${embeddedsystem}`,
        pdf: `${pdf11}`,
        description:
          "Designing computer systems integrated into devices for specific functions.",
        rating: 4.9,
        studentsTaken: 1645,
      },
      {
        id: 19,
        title: "Cloud Computing",
        image: `${cloudcomputing}`,
        pdf: `${pdf5}`,
        description:
          "Providing scalable computing resources and storage via the internet.",
        rating: 4.8,
        studentsTaken: 2156,
      },
      {
        id: 20,
        title: "IOT & Robotics",
        image: `${iotandrobotics}`,
        pdf: `${pdf17}`,
        description:
          "Developing robots and devices that communicate over the internet to perform tasks.",
        rating: 4.7,
        studentsTaken: 1260,
      },
    ],
    Medical: [
      // {
      //   id: 21,
      //   title: "Nano Technology & Genetic Engineering",
      //   image: `${nano}`,
      //   pdf: `${pdf19}`,
      //   description:
      //     " Modifying organisms’ genes or manipulating matter at a microscopic level for innovation.",
      //   rating: 4.9,
      //   studentsTaken: 890,
      // },
      {
        id: 22,
        title: "Psychology",
        image: `${psycho}`,
        pdf: `${pdf20}`,
        description:
          "Studying mental processes and behavior to understand and address human conditions.",
        rating: 4.8,
        studentsTaken: 709,
      },
    ],
    Mechanical: [
      {
        id: 23,
        title: "Auto Cad",
        image: `${autocad}`,
        pdf: `${pdf3}`,
        description:
          "Using software to create detailed 2D and 3D designs for engineering and architecture.",
        rating: 4.7,
        studentsTaken: 999,
      },
    ],
  };
  const handleBrochureClick = (course) => {
    setSelectedCourse(course);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState();

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setIsSubmitting(true);

    // if (!emailVerified) {
    //   toast.error("Please verify your email before submitting.");
    //   return;
    // }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!phoneRegex.test(formData.number)) {
      toast.error("Please enter a valid phone number.");
      setIsSubmitting(false);
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }
    try {
      await axios.post(`${API}/mentorship/register`, {
        name: formData.name,
        email: formData.email,
        collegeEmail: formData.collegeEmail,
        phone: formData.number,
        collegeName: formData.collegeName,
        domain: formData.domain,
        passingyear: formData.passingyear,
        reason: actionType,
      });
      toast.success("Registration successful! Opening the brochure...");
      setIsSubmitting(false);
      setTimeout(() => {
        window.open(selectedCourse.pdf, "_blank");
        ClearForm();
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error.response?.data?.error);
      setIsSubmitting(false);
    }
  };

  const ClearForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      collegeEmail: "",
      number: "",
      collegeName: "",
      domain: "",
      passingyear: "",
    });
  };

//   const [otpSent, setOtpSent] = useState(false);
// const [otp, setOtp] = useState("");
// const [emailVerified, setEmailVerified] = useState(false);

//   const sendOTP = async () => {
//     if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }
  
//     try {
//       const response = await axios.post(`${API}/mentorship-send-otp`, { email: formData.email });
//       toast.success("OTP sent to your email!");
//       setOtpSent(true);
//     } catch (error) {
//       toast.error("Failed to send OTP. Try again.");
//     }
//   };
  
//   const verifyOTP = async () => {
//     try {
//       const response = await axios.post(`${API}/mentorship-verify-otp`, { email: formData.email, otp });
//       if (response.data.success) {
//         toast.success("Email verified successfully!");
//         setEmailVerified(true);
//         setOtp("");
//         setOtpSent(false)
//       } else {
//         toast.error("Invalid OTP. Try again.");
//       }
//     } catch (error) {
//       toast.error("Verification failed.");
//     }
//   };
  

  return (
    <div>
      <div className="container mx-auto">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="font-bold text-center text-[#f15b29] mb-10">
          | Our Mentorship Courses
        </h1>
        <div className="flex justify-center flex-wrap mb-8 gap-3 ">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md border-b transition ${
                category === selectedCategory
                  ? "bg-[#f15b29] text-white"
                  : "bg-[#080810] text-white hover:bg-orange-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:px-24">
          {selectedCategory &&
            coursesData[selectedCategory] &&
            coursesData[selectedCategory].map((course) => (
              <div
                data-aos="fade-in"
                key={course.id}
                className="bg-[#080808] shadow-sm shadow-slate-50 relative rounded-lg overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-[220px] w-full object-cover hover:scale-110 ease-linear duration-700"
                  loading="lazy"
                />
                <div className="px-2 py-2">
                  <h3 className="font-bold text-md mb-2">
                    {course.title}
                    {course.title === "Automation Testing" ? (
                      <span> ( Career Advancement Only )</span>
                    ) : null}
                  </h3>
                  <p className="mb-2">{course.description}</p>
                  <p className="mb-2">
                    {course.rating} <span className="text-[#f15b29]">★★★★</span>
                    ★ ({course.studentsTaken}){" "}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-[#000] shadow-sm shadow-slate-50 border-gray-800 text-[#eee] flex items-center justify-center font-semibold rounded transition"
                      onClick={() => handleBrochureClick(course)}
                    >
                      Brochure
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal/Dialog Box for Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-[400px]">
            <span
              className="text-xl bg-black text-white px-2 cursor-pointer rounded-full font-bold float-end"
              onClick={ClearForm}
            >
              X
            </span>
            <h2 className="text-lg text-center font-semibold mb-4">
              Register to Access Brochure
            </h2>
            <form onSubmit={(e) => handleFormSubmit(e, actionType)}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Id"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              {/* {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOTP}
                  className="bg-blue-500 text-white px-4 py-2 mb-3 rounded"
                >
                  Get OTP
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="mb-3 p-2 w-full border rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="bg-green-500 text-white px-4 py-2 mb-3 rounded"
                  >
                    Verify OTP
                  </button>
                </>
              )} */}
              <input
                type="email"
                name="collegeEmail"
                value={formData.collegeEmail}
                onChange={handleInputChange}
                placeholder="College Email Id"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Whatsapp Number"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                placeholder="College Name"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <select
                id="passingyear"
                name="passingyear"
                value={formData.passingyear}
                onChange={handleInputChange}
                className="w-full border  p-2 mb-3  rounded"
                required
              >
                <option disabled value="">
                  {" "}
                  Select year of study
                </option>
                <option value="1st year">1st year</option>
                <option value="2nd year">2nd year</option>
                <option value="3rd year">3rd year</option>
                <option value="4th year">4th year</option>
                <option value="Graduated">Graduated</option>
                <option value="Passed Out">Passed Out</option>
              </select>

              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="mb-4 p-2 w-full border rounded"
                required
              >
                <option disabled value="">
                  Select a Domain
                </option>
                {[
                  "Full Stack Web Development",
                  "Android App Development",
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Cyber Security",
                  "Data Science",
                  "Data Analytics",
                  "UI/UX Design",
                  "DevOps",
                  "Automation Testing",
                  "Business Analytics",
                  "Finance",
                  "Human Resource",
                  "Digital Marketing",
                  "Stock Marketing",
                  "Supply Chain Management",
                  "Fintech",
                  "Graphics Design",
                  "Embedded System",
                  "Cloud Computing",
                  "IOT & Robotics",
                  "Nano Technology & Genetic Engineering",
                  "Psychology",
                  "Auto Cad",
                ].map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 justify-center items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => setActionType("Only Download Brochure")}
                  className="px-4 py-2 w-full bg-[#f15b29] text-white rounded-md"
                >
                  <i className="fa fa-download"></i>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => setActionType("Requested To Call Back")}
                  className="px-4 py-2 w-full bg-[#f15b29] flex items-center justify-center gap-1 text-white rounded-md"
                >
                  <i className="fa fa-download"></i> + <RiCustomerService2Fill /> +{" "}
                  <span className="fa fa-graduation-cap"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMentor;
