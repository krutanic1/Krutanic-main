import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from "../../../API";
import toast, { Toaster } from "react-hot-toast";

const ApplyNowButton = ({ courseValue }) => {
    const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
    }finally {
      setLoading(false);
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
        data-aos="fade-up"
        onClick={handleBrochureClick}
        className="bg-[#f15b29] border text-white font-semibold  px-6 py-2 hover:rounded-xl ease-linear duration-600  hover:text-black rounded-sm"
      >
        Apply Now
      </button>
      {showForm && (
        <div className=" fixed inset-0 bg-gray-700 bg-opacity-50 z-[999] flex justify-center items-center">
          <div className="bg-white text-black p-3 rounded-lg shadow-lg w-96">
            <h3 className="text-md text-center font-semibold mb-2">
              Apply Now For {courseValue}
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={FormOff}
                  className="px-4 py-1 text-gray-500 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="px-4 py-1 bg-[#f15b29] text-white rounded-md"
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyNowButton;
