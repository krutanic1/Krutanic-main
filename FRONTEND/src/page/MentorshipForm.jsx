import axios from "axios";
import React, { useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const MentorshipForm = () => {
  const [showForm, setShowForm] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      collegeEmail:"",
      number: "",
      collegeName: "",
      domain: "",
      passingyear: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
       const [isSubmitting, setIsSubmitting] = useState(false);
      const handleFormSubmit = async (e) => {
        setIsSubmitting(true);
        e.preventDefault();
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
            collegeEmail:formData.collegeEmail,
            phone: formData.number,
            collegeName: formData.collegeName,
            domain: formData.domain,
            passingyear: formData.passingyear,
          });
          toast.success("Registration successful!");
          setIsSubmitting(false);
          setTimeout(() => {
            window.open(selectedCourse.pdf, "_blank");
            ClearForm();
          }, 1500);
        } catch (error) {
          toast.error("Something went wrong. Please try again.");
          setIsSubmitting(false);
          console.error(error.response?.data?.error);
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
    
  return (
    <div>
          <Toaster position="top-center" reverseOrder={false} />
      <button
        className="px-4 py-2 border border-black text-[black] flex items-center justify-center font-semibold rounded transition"
        onClick={() => setShowForm(true)}
      >
        Apply Now
      </button>

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
             Apply Now
            </h2>
            <form onSubmit={handleFormSubmit}>
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
                placeholder="Email id"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <input
                type="email"
                name="collgeEmail"
                value={formData.collegeEmail}
                onChange={handleInputChange}
                placeholder="Collge Email id"
                className="mb-3 p-2 w-full border rounded"
                required
              />
              <input
                type="text"
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

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#f15b29] text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipForm;
