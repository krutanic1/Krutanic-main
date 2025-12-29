import React, { useEffect, useState } from "react";
import registerguideimg1 from "../assets/Formfill.png";
import registerguideimg2 from "../assets/Registration.png";
import registerguideimg3 from "../assets/waitfortheresponse.png";
import toast, { Toaster } from "react-hot-toast";

import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    cno: "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzK2IzfOrP43zo2ffORev5hfW3PGlkC76X-9aj63m-lAtmpCJrZpIO8bRzxzA1g8HsSSA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
          mode: "no-cors",
        }
      );
      toast.success("Form submitted successfully!");
      setFormData({
        fname: "",
        email: "",
        cno: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit collaboration request");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div id="contactus">
       <Toaster position="top-center" reverseOrder={false}/>
      <main className="flex">
        <section className="flex-content padding_2x">
          <article>
            <h1
              data-aos="fade-up"
              data-aos-offset="300"
              data-aos-duration="600"
              data-aos-delay="50"
              data-aos-easing="linear"
              className="title big"
            >
              Contact Us
            </h1>
          </article>
        </section>
      </main>
      <div className="section1">
        <section className="flex-content padding_2x">
          <h1
            data-aos="fade-up"
            data-aos-offset="300"
            data-aos-duration="500"
            data-aos-delay="100"
            data-aos-easing="linear"
            className="title medium"
          >
            We’re here to help you with any queries
          </h1>
          <p
            data-aos="fade-up"
            data-aos-offset="300"
            data-aos-duration="700"
            data-aos-delay="200"
            data-aos-easing="linear"
          >
            We’re here to help you with any queries, concerns, or suggestions
            you may have. Whether you’re looking for information on our courses,
            want to know more about our services, or need assistance with your
            enrollment, our team is ready to assist you.
          </p>
        </section>
        <section data-aos="fade-up" className="flex-content padding_2x">
          <form id="form" className="padding_2x" onSubmit={handleSubmit}>
            <h2 className="text-center font-semibold text-2xl title">
              Get In Touch
            </h2>
            <fieldset>
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="Full Name"
                maxLength="60"
                value={formData.fname}
                onChange={handleChange}
                className="placeholder:text-black"
                required
              />
            </fieldset>
            <fieldset>
              <input
                type="tel"
                name="cno"
                id="cno"
                placeholder="Contact Number"
                maxLength="15"
                value={formData.cno}
                onChange={handleChange}
                className="placeholder:text-black"
                required
              />
            </fieldset>
            <fieldset>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Id"
                value={formData.email}
                onChange={handleChange}
                className="placeholder:text-black"
                required
              />
            </fieldset>
            <fieldset>
              <textarea
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full resize-none border h-40 px-2 py-2 bg-[#f7f7f7] rounded-lg placeholder:text-black"
                name="message"
                id="message"
                required
              ></textarea>
            </fieldset>
            <fieldset>
              <button type="submit" className="btn2">
                SUBMIT DETAILS
              </button>
            </fieldset>
          </form>
          {feedback && (
            <p className="text-center text-green-500 mt-4">{feedback}</p>
          )}
        </section>
      </div>

      {/* SECTION 2 form*/}
      <div className="sections section2 padding_2x">
        <h1 data-aos="fade-up" className="text-center title">
          How to connect with us
        </h1>
        <article className="cards padding_2x max-w-[1500px] mx-auto">
          <section
            data-aos="zoom-in"
            className="flex-content padding_2x text-white"
          >
            <figure>
              <img src={registerguideimg1} alt="" loading="lazy" />
            </figure>
            <h2 className="title small pt-2">
              Fill the <em>form</em>
            </h2>
            <p className="py-2">
              Fill out the form below to express your interest,
            </p>
            <p>
              Provide your details so our team can connect with you and guide
              you through your next steps. Start building your future by taking
              the top-rated industry-driven courses with krutanic today!
            </p>
          </section>
          <section
            data-aos="zoom-in"
            className="flex-content padding_2x text-white"
          >
            <figure>
              <img src={registerguideimg2} alt="" loading="lazy" />
              <h2 className="title small pt-2">
                <em>Register</em> with us
              </h2>
              <p className="py-2">Join us today to gain expert guidance,</p>
              <p>
                Hands-on projects, and real-world industry insights. Your
                journey to mastering new skills and advancing your career is
                just a few clicks away to begin your journey toward success.!
              </p>
            </figure>
          </section>
          <section
            data-aos="zoom-in"
            className="flex-content padding_2x text-white"
          >
            <figure>
              <img src={registerguideimg3} alt="" loading="lazy" />
              <h2 className="title small pt-2">
                Wait for the <em>response</em>
              </h2>
              <p className="py-2">
                Once Your registration is complete our team will review your
                information,
              </p>
              <p>
                Stay tuned as we prepare to provide you with personalized
                learning opportunities and updates. Get ready to take your
                skills to the next level!
              </p>
            </figure>
          </section>
        </article>
      </div>

      {/* map section */}
      <section className="mapsection">
        <div className="mapsectiondiv">
          <div>
            <h2 data-aos="zoom-down">Our Locations</h2>
            <p data-aos="zoom-down">
              We have locations all over in India. Find one near you!
            </p>
          </div>
          <div>
            <iframe
              data-aos="zoom-in"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.653609138051!2d77.65305207507463!3d12.865635287440112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d696e67880f%3A0x5b9a53aa71b83daa!2sKrutanic%20Solutions!5e0!3m2!1sen!2sin!4v1732343734618!5m2!1sen!2sin"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
