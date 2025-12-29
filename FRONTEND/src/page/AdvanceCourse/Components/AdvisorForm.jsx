import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from "../../../API";
import toast, { Toaster } from "react-hot-toast";
import girl from "../../../assets/girl.png";
import bgImage from "../../../assets/logo.jpg";
const AdvisorForm = () => {
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleBrochureClick = () => {
    setShowForm(true);
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
        interestedDomain: courseValue,
        reason: "Requested To Call Back",
      });
      toast.success(
        `You have successfully applied for the ${courseValue}. Our counselor will connect with you shortly.`
      );
      FormOff();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
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
    });
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={handleBrochureClick}
        className="bg-[#3774AA] p-2 rounded-md"
      >
        Apply Now
      </button>
      {showForm && (
        <div className="fixed inset-0 lg:top-10 top-[20%] bg-gray-700 bg-opacity-50 z-[999] lg:flex justify-center items-center px-[20px]">
          <div className="bg-white overflow-hidden lg:w-[800px] lg:flex md:flex  rounded-lg">
            <div
              id="hidden"
              className="lg:w-1/2 md:w-1/2 relative text-black rounded-lg"
            >
              <h2 className="text-center font-bold text-[#f15b29] my-2">
                Krutanic Solutions
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
    </div>
  );
};

export default AdvisorForm;
