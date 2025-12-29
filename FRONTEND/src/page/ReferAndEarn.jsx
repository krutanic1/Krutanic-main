import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import API from "../API";
const ReferAndEarn = () => {
   
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    friendName: "",
    friendPhone: "",
    friendCollege: "",
    course: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, phone, friendName, friendPhone, friendCollege, course } = formData;
    if (!name || !phone || !friendName || !friendPhone || !friendCollege || !course) {
      alert("Please fill in all fields.");
      return;
    }
     const response = axios.post(`${API}/referandearn`, formData)
      .then((response) => {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          phone: "",
          friendName: "", 
          friendPhone: "",
          friendCollege: "",
          course: "",
        });
      })
      .catch((error) => {
        console.error("There was an error submitting the form:", error);
        alert("There was an error submitting the form. Please try again later.");
      });  
  }

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [course, setCourse] = useState([]);
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getcourses`);
      setCourse(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const faqs = [
    {
      question: "Who can Refer?",
      answer:
        "If you’ve already taken the program, you can share the opportunity with someone who might benefit just like you did.If you haven’t taken the program yet, you can still refer someone who’s interested in learning and growing their skills.",
    },
    {
      question:
        "Will it be considered my referral if my friend/contact already exists in the Krutanic Database?",
      answer:
        "No, if your friend or contact is already a part of the Krutanic database then you are NOT eligible for the referral reward. Krutanic will only consider an enrollment referred if it is new and eligible.",
    },
    {
      question: "Do I need to be a MyCaptain learner to refer my friends?",
      answer:
        "Yes, anyone and everyone is welcome to refer.Just sign up as a referrer—it’s quick and easy. Once you're signed up, you’ll get a unique referral link that you can share with anyone you choose.That’s it—refer freely and help others discover the program!",
    },
    {
      question: "How You Receive Your Referral Reward",
      answer:
        "After your friend successfully enrolls using your unique referral link, you’ll receive an email from our team asking you to share your bank details.If the referral reward is monetary, the amount will be credited directly to your bank account. Please ensure your details are accurate to avoid any delays in processing.",
    },

    {
      question: "When Will I Receive My Referral Cash back Amount?",
      answer:
        "Your referral cash back amount will be processed after your referred candidate successfully 'clearing the due amount'.Once verified, the reward  will be transferred to your bank account within 7–10 business days of submitting your bank details.!",
    },
  ];

   const formSectionRef = useRef(null);
    const refertoform = () => {
      formSectionRef.current?.scrollIntoView({ behavior: "auto" });
    };
  
  return (
    <div id="refer-and-earn" className="refer-and-earn">
      <div className="container-refer-and-earn">
        <div className="refer-and-earn-content">
          <h2>Refer Friends. Empower Careers. Get Rewarded!</h2>
          <p>
            Earn up to ₹700 for every successful referral based on your friend’s
            enrollment amount.
          </p>
          <div className="btn">
            <button onClick={refertoform} className="refer-button">Refer Now</button>
            {/* <button className="eligible-button">View Eligible Programs</button> */}
          </div>
        </div>
      </div>

      <div className="container_How_It_Works">
        <div className="how_it_works_content">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>
                <i className="fa fa-user-plus" aria-hidden="true"></i> Refer Your
                Friend
              </h3>
              <p>Share the form and invite friends.</p>
            </div>
            <div className="step">
              <h3>
                <i className="fa fa-users" aria-hidden="true"></i> Friend Enrolls
              </h3>
              <p>Friend joins an online course.</p>
            </div>
            <div className="step">
              <h3>
                <i className="fa fa-money" aria-hidden="true"></i> You Get Paid
              </h3>
              <p>Get reward based on enrollment fee.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container_referral_Reward_Breakdown">
        <div className="referral_reward_breakdown_content">
          <h2>Referral Reward Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Enrollment Amount</th>
                <th>Your Reward</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Less than ₹7,000</td>
                <td>₹300</td>
              </tr>
              <tr>
                <td>₹7,000 - ₹10,000</td>
                <td>₹500</td>
              </tr>
              <tr>
                <td>More than ₹10,000</td>
                <td>₹700</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="why_refer">
        <div className="why_refer_content">
          <h2>Why Refer?</h2>
          <div className="benefits">
            <div className="benift_box">
              <span>
                <i className="fa fa-graduation-cap" aria-hidden="true"></i>
              </span>
              <p>Help your friends access quality education</p>
            </div>
            <div className="benift_box">
              <span>
                <i className="fa fa-inr" aria-hidden="true"></i>
              </span>
              <p>Earn up to ₹700 per referral</p>
            </div>
            <div className="benift_box">
              <span>
                <i className="fa fa-users" aria-hidden="true"></i>
              </span>
              <p>Be part of a thriving learner community</p>
            </div>
            <div className="benift_box">
              <span>
                <i className="fa fa-scissors" aria-hidden="true"></i>
              </span>
              <p>Quick & easy process</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={formSectionRef} className="container_form">
        <div  className="form_content">
          <h2>Fill the Form to Start Earning</h2>

          <div  className="form">
            <h3>REFER AND EARN</h3>
            <p>Explore Earning Opportunities & Rewards.</p>
            <form onSubmit={handleFormSubmit}>
              <input value={formData.name} onChange={handleChange} name="name" type="text" placeholder="Your Name" required />
              <input value={formData.phone} onChange={handleChange} name="phone" type="number" placeholder="Your Phone No" required />
              <input value={formData.friendName} onChange={handleChange} name="friendName" type="text" placeholder="Friend's Name" required />
              <input value={formData.friendPhone} onChange={handleChange} name="friendPhone" type="number" placeholder="Friend's Phone No" required />
              <input value={formData.friendCollege} onChange={handleChange} name="friendCollege" type="text" placeholder="Friend's College Name" required />
              <select value={formData.course} onChange={handleChange} name="course" required>
                <option value="" disabled selected>
                  Select Course
                </option>
                {course.map((item) => (
                  <option value={item.title}>{item.title}</option>
                ))}
              </select>
              <button type="submit">Submit</button>
            </form>
            <span>
              <i className="fa fa-lock"></i> Your personal
              information is secure with us
            </span>
          </div>
        </div>
      </div>

      <div className="frequentlyaskedquestions">
        <div className="faq_content">
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className=" rounded-lg overflow-hidden ease-linear duration-500"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-[#080808]"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <span className="text-2xl bg-black px-2 rounded-full text-[#f15b29]">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="p-4 bg-[rgb(255,255,255,0.2)] ">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="trustandtestimonials">
        <div className="trust_content">
          <h2>Trust & Testimonials</h2>
          <div className="testimonials__box">
            <div className="testimonial">
              <div className="profile">
                <div>
                  <h4>Sumit Sahu</h4>
                  <span>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star-half" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <p>
                I referred my friend to the Data Science program, and the process was seamless. The reward was credited promptly after my friend enrolled. Highly recommend!
              </p>
            </div>
            <div className="testimonial">
              <div className="profile">
                <div>
                  <h4>Ritik</h4>
                  <span>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star-o" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <p>
                "The referral program is a great way to help friends and earn
                rewards. I referred a friend to the Full Stack Web Developement program, and the support
                team was very helpful throughout the process."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
