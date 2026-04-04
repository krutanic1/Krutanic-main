import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import API from "../API";
import heroImage from "../assets/career.jpg";

const steps = [
  {
    icon: "fa-user-plus",
    title: "Refer your friend",
    text: "Share the form or link with someone who wants to learn and grow.",
  },
  {
    icon: "fa-users",
    title: "Friend enrolls",
    text: "They pick a course, complete enrollment, and get verified.",
  },
  {
    icon: "fa-money",
    title: "You get paid",
    text: "Your reward is transferred after the enrollment is confirmed.",
  },
];

const rewards = [
  { range: "Up to ₹7,000", reward: "₹300" },
  { range: "₹7,000 - ₹10,000", reward: "₹500" },
  { range: "Above ₹10,000", reward: "₹700" },
];

const benefits = [
  {
    icon: "fa-graduation-cap",
    title: "Access quality education",
    text: "Help someone start a course that can move their career forward.",
  },
  {
    icon: "fa-gift",
    title: "Earn premium rewards",
    text: "Get a cash reward when your referral completes the process.",
  },
  {
    icon: "fa-users",
    title: "Grow the community",
    text: "Bring more learners into a network that shares opportunities.",
  },
  {
    icon: "fa-bolt",
    title: "Quick verification",
    text: "The process is simple, traceable, and easy to submit from mobile or web.",
  },
];

const testimonials = [
  {
    name: "Ayan Mehta",
    role: "Final Year Student",
    initials: "AM",
    text:
      "I referred two friends and both completed enrollment smoothly. The payout landed right on time, and the entire flow was straightforward.",
  },
  {
    name: "Piyush Sharma",
    role: "Software Engineer",
    initials: "PS",
    text:
      "The form took less than a minute to submit. I liked that I could track the referral easily and the reward was credited without follow-up.",
  },
  {
    name: "Rohan Das",
    role: "Marketing Specialist",
    initials: "RD",
    text:
      "Krutanic makes the referral process feel professional. The structure is clear, the support is responsive, and the reward is worth sharing.",
  },
];

const faqs = [
  {
    question: "When will I receive my referral reward?",
    answer:
      "Rewards are processed after the referred learner completes enrollment and the payment is verified. Once approved, the amount is transferred within the stated processing window.",
  },
  {
    question: "Is there a limit on how many friends I can refer?",
    answer:
      "No. You can refer as many eligible friends as you want. Each valid referral is reviewed independently and rewarded according to the enrollment amount.",
  },
  {
    question: "What if my friend enrolls later?",
    answer:
      "That is fine. As long as the referral is submitted before or during the enrollment cycle, it can still be tracked and validated by the team.",
  },
  {
    question: "Do I need to be a student to refer others?",
    answer:
      "No. Anyone who wants to share the opportunity can refer, provided the referral details are accurate and the candidate is eligible.",
  },
];

const ReferAndEarn = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    friendName: "",
    friendPhone: "",
    friendCollege: "",
    course: "",
  });
  const [openIndex, setOpenIndex] = useState(null);
  const [courses, setCourses] = useState([]);

  const stepsRef = useRef(null);
  const formSectionRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/getcourses`);
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("There was an error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const toggleFAQ = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const scrollToSteps = () => {
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, friendName, friendPhone, friendCollege, course } = formData;
    if (!name || !phone || !friendName || !friendPhone || !friendCollege || !course) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`${API}/referandearn`, formData);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        phone: "",
        friendName: "",
        friendPhone: "",
        friendCollege: "",
        course: "",
      });
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      alert("There was an error submitting the form. Please try again later.");
    }
  };

  return (
    <div id="refer-and-earn" className="refer-and-earn">
      <div className="refer-page">
        <section className="refer-hero">
          <div className="refer-hero-copy">
            <span className="refer-eyebrow">Referral program 2024</span>
            <h1 className="refer-title">
              Refer Friends.
              <br />
              Empower <span>Careers.</span>
              <br />
              Get Rewarded!
            </h1>
            <p className="refer-intro">
              Share Krutanic with your network and earn a premium reward for every successful enrollment. The process is fast, transparent, and built for students and professionals.
            </p>
            <div className="refer-actions">
              <button type="button" className="refer-primary" onClick={scrollToForm}>
                Refer Now
              </button>
              <button type="button" className="refer-secondary" onClick={scrollToSteps}>
                How it works
              </button>
            </div>
          </div>

          <div className="refer-hero-visual">
            <div className="refer-hero-image-card">
              <img src={heroImage} alt="Referral program collaboration" className="refer-hero-image" />
              <div className="refer-hero-overlay">
                <div className="refer-overlay-icon">
                  <i className="fa fa-gift" aria-hidden="true"></i>
                </div>
                <div>
                  <p>Total rewards paid</p>
                  <strong>₹24,50,000+</strong>
                </div>
              </div>
            </div>
            <div className="refer-hero-note">
              <span>Secure payout tracking</span>
              <strong>Bank transfer after verification</strong>
            </div>
          </div>
        </section>

        <section ref={stepsRef} className="refer-section refer-steps-section">
          <div className="section-heading">
            <span>How it works</span>
            <h2>Three Steps to Success</h2>
          </div>
          <div className="refer-step-grid">
            {steps.map((step, index) => (
              <article key={step.title} className="refer-step-card">
                <div className="refer-step-icon">
                  <i className={`fa ${step.icon}`} aria-hidden="true"></i>
                </div>
                <div className="refer-step-index">0{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="refer-section refer-reward-section">
          <div className="section-heading">
            <span>Reward breakdown</span>
            <h2>The more they invest, the more you earn</h2>
          </div>
          <div className="refer-table-card">
            <table className="refer-table">
              <thead>
                <tr>
                  <th>Enrollment Amount</th>
                  <th>Your Reward</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.range}>
                    <td>{reward.range}</td>
                    <td>{reward.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="refer-table-note">
              Rewards are finalised after eligibility checks and verified enrollment.
            </p>
          </div>
        </section>

        <section className="refer-section refer-benefit-section">
          <div className="section-heading section-heading-left">
            <span>Why recommend Krutanic?</span>
            <h2>Better education, better rewards, better community</h2>
            <p>
              Join thousands of students building a better future through community-driven learning and verified referrals.
            </p>
          </div>
          <div className="refer-benefit-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="refer-benefit-card">
                <div className="refer-benefit-icon">
                  <i className={`fa ${benefit.icon}`} aria-hidden="true"></i>
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section ref={formSectionRef} className="refer-form-section">
          <div className="refer-form-copy">
            <span>Ready to refer?</span>
            <h2>Fill in the details and we’ll take it from there.</h2>
            <p>
              Your referral will receive a special invite, while you keep track of the payout from one simple form.
            </p>
            <ul className="refer-form-points">
              <li>
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                Takes less than 60 seconds
              </li>
              <li>
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                Automated tracking via phone number
              </li>
              <li>
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                No upfront referral fees
              </li>
            </ul>
          </div>

          <div className="refer-form-card">
            <div className="refer-form-header">
              <span>Refer and earn</span>
              <h3>Submit your referral</h3>
            </div>

            <form className="refer-form" onSubmit={handleFormSubmit}>
              <div className="refer-form-grid">
                <label>
                  <span>Your Name</span>
                  <input value={formData.name} onChange={handleChange} name="name" type="text" placeholder="John Doe" required />
                </label>
                <label>
                  <span>Your Phone No</span>
                  <input value={formData.phone} onChange={handleChange} name="phone" type="tel" placeholder="+91 9876543210" required />
                </label>
                <label>
                  <span>Friend's Name</span>
                  <input value={formData.friendName} onChange={handleChange} name="friendName" type="text" placeholder="Jane Smith" required />
                </label>
                <label>
                  <span>Friend's Phone No</span>
                  <input value={formData.friendPhone} onChange={handleChange} name="friendPhone" type="tel" placeholder="+91 9876543210" required />
                </label>
              </div>

              <label>
                <span>Friend's College Name</span>
                <input value={formData.friendCollege} onChange={handleChange} name="friendCollege" type="text" placeholder="University of Technology" required />
              </label>

              <label>
                <span>Select Course</span>
                <select value={formData.course} onChange={handleChange} name="course" required>
                  <option value="" disabled>
                    Choose a course
                  </option>
                  {courses.map((item) => (
                    <option key={item._id || item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="refer-submit-button">
                Submit Referral <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </button>
            </form>

            <p className="refer-form-footnote">
              <i className="fa fa-lock" aria-hidden="true"></i>
              Your personal information is secure with us.
            </p>
          </div>
        </section>

        <section className="refer-section refer-testimonial-section">
          <div className="section-heading">
            <span>What our advocates say</span>
            <h2>Real people, real payouts</h2>
          </div>
          <div className="refer-testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="refer-testimonial-card">
                <div className="refer-rating" aria-label="Five star rating">
                  <i className="fa fa-star" aria-hidden="true"></i>
                  <i className="fa fa-star" aria-hidden="true"></i>
                  <i className="fa fa-star" aria-hidden="true"></i>
                  <i className="fa fa-star" aria-hidden="true"></i>
                  <i className="fa fa-star" aria-hidden="true"></i>
                </div>
                <p>{testimonial.text}</p>
                <div className="refer-testimonial-user">
                  <div className="refer-avatar">{testimonial.initials}</div>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="refer-section refer-faq-section">
          <div className="section-heading">
            <span>Frequently asked questions</span>
            <h2>Clear answers before you refer</h2>
          </div>
          <div className="refer-faq-list">
            {faqs.map((faq, index) => (
              <article key={faq.question} className={`refer-faq-item ${openIndex === index ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="refer-faq-button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <i className={`fa ${openIndex === index ? "fa-chevron-up" : "fa-chevron-down"}`} aria-hidden="true"></i>
                </button>
                {openIndex === index && <div className="refer-faq-answer">{faq.answer}</div>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReferAndEarn;
