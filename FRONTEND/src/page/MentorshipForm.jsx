import axios from "axios";
import React, { useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import "./MentorshipForm.css";
import { FaEnvelope, FaUser, FaPhoneAlt, FaGraduationCap, FaBriefcase, FaArrowRight, FaCheckCircle, FaTimes, FaClock } from "react-icons/fa";
import girlImg from "../assets/girl.png";

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
          onClick={() => setShowForm(true)}
          className="hidden"
        >
        </button>
      )}

      {(showForm || isPopup) && (
        <div className="mentorship-modal-overlay" onClick={ClearForm}>
          <div className="mentorship-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mentorship-modal-body">
              {/* Left Column: Visuals & Value Prop */}
              <div className="mentorship-modal-visual">
                <div className="visual-branding">
                  <div className="visual-logo">
                    <span className="logo-k">K</span>
                    <span className="logo-text">Mentorship</span>
                  </div>
                  <h2 className="visual-title">Begin Your <span>Professional</span> Journey</h2>
                  <p className="visual-desc">Join 10,000+ students already learning from top industry mentors.</p>
                </div>
                
                <div className="visual-features">
                  <div className="visual-feature">
                    <div className="feature-icon"><FaUser /></div>
                    <div className="feature-text">
                      <h4>1:1 Mentorship</h4>
                      <p>Personalized guidance from experts</p>
                    </div>
                  </div>
                  <div className="visual-feature">
                    <div className="feature-icon"><FaCheckCircle /></div>
                    <div className="feature-text">
                      <h4>Certified Outcomes</h4>
                      <p>Industry-recognized credentials</p>
                    </div>
                  </div>
                  <div className="visual-feature">
                    <div className="feature-icon"><FaBriefcase /></div>
                    <div className="feature-text">
                      <h4>Career Support</h4>
                      <p>Internship and placement help</p>
                    </div>
                  </div>
                </div>

                <div className="visual-image-container">
                  <img src={girlImg} alt="Student" className="visual-person-img" />
                  <div className="visual-floating-card">
                    <div className="card-avatars">
                      <div className="avatar">JS</div>
                      <div className="avatar">RK</div>
                      <div className="avatar">AM</div>
                      <div className="avatar-plus">+12k</div>
                    </div>
                    <span>Active Learners</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="mentorship-modal-form-side">
                <button className="mentorship-modal-close-btn" onClick={ClearForm}>
                  <FaTimes />
                </button>
                
                <div className="form-side-header">
                  <h3>Apply for Mentorship</h3>
                  <p>Fill in your details to get started with your preferred track.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="mentorship-form-grid-new">
                  <div className="form-input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  <div className="form-input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email ID"
                      disabled={emailVerified}
                      required
                    />
                  </div>

                  <div className="form-verification-zone">
                    {!emailVerified ? (
                      !otpSent ? (
                        <button
                          type="button"
                          onClick={sendOTP}
                          className="verify-email-btn"
                        >
                          Verify Email
                        </button>
                      ) : (
                        <div className="otp-input-group">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                          />
                          <button
                            type="button"
                            onClick={verifyOTP}
                            className="verify-otp-btn"
                          >
                            Submit
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="verification-success">
                        <FaCheckCircle /> Email Verified
                      </div>
                    )}
                  </div>

                  <div className="form-input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="collegeEmail"
                      value={formData.collegeEmail}
                      onChange={handleInputChange}
                      placeholder="College Email ID"
                      required
                    />
                  </div>

                  <div className="form-input-wrapper">
                    <FaPhoneAlt className="input-icon" />
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder="WhatsApp Number"
                      required
                    />
                  </div>

                  <div className="form-input-wrapper">
                    <FaGraduationCap className="input-icon" />
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      placeholder="College Name"
                      required
                    />
                  </div>

                  <div className="form-input-wrapper">
                    <FaClock className="input-icon" />
                    <select
                      id="passingyear"
                      name="passingyear"
                      value={formData.passingyear}
                      onChange={handleInputChange}
                      required
                    >
                      <option disabled value="">Year of Study</option>
                      <option value="1st year">1st year</option>
                      <option value="2nd year">2nd year</option>
                      <option value="3rd year">3rd year</option>
                      <option value="4th year">4th year</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Passed Out">Passed Out</option>
                    </select>
                  </div>

                  <div className="form-input-wrapper full-width">
                    <FaBriefcase className="input-icon" />
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
                        "Psychology",
                      ].map((domain, index) => (
                        <option key={index} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-submit-zone">
                    <button
                      type="submit"
                      disabled={isSubmitting || !emailVerified}
                      className="submit-application-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="submit-loader"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Application <FaArrowRight />
                        </>
                      )}
                    </button>
                    <p className="form-privacy-note">Your data is secure and encrypted.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorshipForm;
