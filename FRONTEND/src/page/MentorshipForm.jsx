import axios from "axios";
import React, { useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import "./MentorshipForm.css";

const MentorshipForm = ({ isPopup, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeEmail: "",
    number: "",
    collegeName: "",
    domain: "",
    passingyear: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

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

    if (!emailVerified) {
      toast.error("Please verify your email before submitting.");
      setIsSubmitting(false);
      return;
    }

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
      });
      toast.success("Registration successful!");
      setIsSubmitting(false);
      setTimeout(() => {
        ClearForm();
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
      console.error(error.response?.data?.error);
    }
  };

  const sendOTP = async () => {
    if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(`${API}/mentorship-send-otp`, { email: formData.email });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${API}/mentorship-verify-otp`, { email: formData.email, otp });
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
    setOtpSent(false);
    setOtp("");
    setEmailVerified(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {!isPopup && (
        <button
          // className="submit-btn-premium w-auto px-10"
          onClick={() => setShowForm(true)}
        >
          
        </button>
      )}

      {(showForm || isPopup) && (
        <div className="mentorship-modal-overlay" onClick={ClearForm}>
          <div className="mentorship-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mentorship-modal-header">
              <button className="close-btn-glass" onClick={ClearForm}>
                <i className="fa fa-times"></i>
              </button>
              <h2>Apply Now</h2>
              <p>Elevate your career with expert mentorship</p>
            </div>

            <div className="mentorship-form-container">
              <form onSubmit={handleFormSubmit} className="mentorship-form-grid">
                <div className="form-group-modern">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email id"
                    disabled={emailVerified}
                    required
                  />
                </div>

                {!emailVerified ? (
                  !otpSent ? (
                    <button
                      type="button"
                      onClick={sendOTP}
                      className="shared-form-verify mb-3"
                    >
                      Verify Email
                    </button>
                  ) : (
                    <div className="shared-form-otp mb-3">
                       <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className=""
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="shared-form-submit !bg-emerald-600 !shadow-none whitespace-nowrap"
                      >
                        Submit OTP
                      </button>
                    </div>
                  )
                ) : (
                  <div className="shared-form-status mb-3">
                    ✅ Email Verified
                  </div>
                )}

                <div className="form-group-modern">
                  <input
                    type="email"
                    name="collegeEmail"
                    value={formData.collegeEmail}
                    onChange={handleInputChange}
                    placeholder="College Email id"
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Whatsapp Number"
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    placeholder="College Name"
                    required
                  />
                </div>

                <div className="form-group-modern">
                  <select
                    id="passingyear"
                    name="passingyear"
                    value={formData.passingyear}
                    onChange={handleInputChange}
                    required
                  >
                    <option disabled value="">Select year of study</option>
                    <option value="1st year">1st year</option>
                    <option value="2nd year">2nd year</option>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Passed Out">Passed Out</option>
                  </select>
                </div>

                <div className="form-group-modern">
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    required
                  >
                    <option disabled value="">Select a Domain</option>
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
                      "Graphics Design",
                      "Embedded System",
                      "Cloud Computing",
                      "IOT & Robotics",
                      "Auto Cad",
                    ].map((domain, index) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !emailVerified}
                  className="submit-btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="form-loader"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorshipForm;
