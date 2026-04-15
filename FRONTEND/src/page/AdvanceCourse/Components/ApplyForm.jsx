import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import API from "../../../API";
import "../../../page/MentorshipForm.css";
import toast, { Toaster } from "react-hot-toast";

const ApplyForm = ({ courseValue = "this program" }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    currentRole: "",
    experience: "",
    goal: "",
    goalOther: "",
    reason: "",
    domain: "",
    domainOther: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailVerified) {
      toast.error("Please verify your email before submitting.");
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(formData.number)) {
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
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
        reason: formData.reason,
        domain: formData.domain,
        domainOther:
          formData.domain === "Other" ? formData.domainOther : undefined,
        interestedDomain: courseValue,
      });
      toast.success(
        `You have successfully applied for the ${courseValue}. Our counselor will connect with you shortly.`
      );
      FormOff();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      await axios.post(`${API}/advance-send-otp`, { email: formData.email });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${API}/advance-verify-otp`, {
        email: formData.email,
        otp,
      });
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

  const FormOff = () => {
    setFormData({
      name: "",
      email: "",
      number: "",
      currentRole: "",
      experience: "",
      goal: "",
      goalOther: "",
      reason: "",
      domain: "",
      domainOther: "",
    });
    setOtpSent(false);
    setOtp("");
    setEmailVerified(false);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full">
        <div className="shared-form-shell !w-full !max-w-none">
          <div className="shared-form-header">
            <button
              type="button"
              className="shared-form-close opacity-0 pointer-events-none"
              aria-hidden="true"
            >
              <i className="fa fa-times"></i>
            </button>
            <h2 className="text-center">Apply for {courseValue}</h2>
            <p className="text-center">
              Share your details and verify your email once. We will connect
              you with the right counselor for the next step.
            </p>
          </div>

          <div className="shared-form-body">
            <form onSubmit={handleFormSubmit} className="shared-form-grid">
              <div className="shared-form-field">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="shared-form-field">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={emailVerified}
                  required
                />
              </div>

              {!emailVerified ? (
                !otpSent ? (
                  <div className="shared-form-field">
                    <button
                      type="button"
                      onClick={sendOTP}
                      className="shared-form-verify"
                    >
                      Verify Email
                    </button>
                  </div>
                ) : (
                  <div className="shared-form-field">
                    <div className="shared-form-otp">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="shared-form-submit !w-auto !px-5 !min-h-[48px] !bg-emerald-600 !shadow-none"
                      >
                        Submit OTP
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="shared-form-field">
                  <div className="shared-form-status">
                    Email verified successfully
                  </div>
                </div>
              )}

              <div className="shared-form-field">
                <input
                  type="text"
                  id="number"
                  name="number"
                  placeholder="Enter your phone number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="shared-form-field">
                <select
                  id="currentRole"
                  name="currentRole"
                  value={formData.currentRole}
                  onChange={handleInputChange}
                  required
                >
                  <option disabled value="">
                    What do you currently do?
                  </option>
                  <option value="Founder">Founder</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Self Employed">Self Employed</option>
                </select>
              </div>

              <div className="shared-form-field">
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
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
              </div>

              <div className="shared-form-field">
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
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
              </div>

              {formData.goal === "Other" && (
                <div className="shared-form-field">
                  <input
                    type="text"
                    name="goalOther"
                    value={formData.goalOther}
                    onChange={handleInputChange}
                    placeholder="Please specify your goal"
                    required
                  />
                </div>
              )}

              <div className="shared-form-field">
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                >
                  <option disabled value="">
                    Reason to take this program
                  </option>
                  <option value="I Want to Know More About the Program">
                    I Want to Know More About the Program
                  </option>
                  <option value="I've Reviewed the Program – Need Career Guidance">
                    I've Reviewed the Program - Need Career Guidance
                  </option>
                  <option value="I'm Ready to Enroll">I'm Ready to Enroll</option>
                  <option value="I'm Already Enrolled – Need Support">
                    I'm Already Enrolled - Need Support
                  </option>
                </select>
              </div>

              <div className="shared-form-field">
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                >
                  <option disabled value="">
                    Domain currently working in
                  </option>
                  <option value="Digital Marketing/Performance marketing">
                    Digital Marketing/Performance Marketing
                  </option>
                  <option value="Marketing/Sales">Marketing/Sales</option>
                  <option value="Management/Operations">Management/Operations</option>
                  <option value="IT/Tech/Product">IT/Tech/Product</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.domain === "Other" && (
                <div className="shared-form-field">
                  <input
                    type="text"
                    name="domainOther"
                    value={formData.domainOther}
                    onChange={handleInputChange}
                    placeholder="Please specify your domain"
                    required
                  />
                </div>
              )}

              <div className="shared-form-actions">
                <button
                  type="submit"
                  disabled={loading || !emailVerified}
                  className="shared-form-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="shared-form-loader"></div>
                      Loading...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;
