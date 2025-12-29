import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import collabrationImage from "../assets/collaborate 04.svg";
import skills from "../assets/skills.png";
import training from "../assets/training.png";
import placement from "../assets/placement.png";
import colleb from "../assets/COLLAB.png";
import formimg from "../assets/Collaborateform.svg";
import toast ,{Toaster} from 'react-hot-toast';

const Collabration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    number: "",
    email: "",
    collaborationType: "",
    entityType: "",
    organizationName: "",
    collegeName: "",
    additionalInfo: "",
  });
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const stats = [
    { name: "Years of Collaboration", value: "1.5" },
    { name: "Joint Research Projects", value: "150" },
    { name: "Student Internships", value: "10000" },
    { name: "Industry Partnerships", value: "250" },
  ];

  const collebrationSectionRef = useRef(null);
  const scrollTocollebration = () => {
    collebrationSectionRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEntityTypeChange = (entityType) => {
    setFormData({
      ...formData,
      entityType,
      organizationName: "",
      collegeName: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxFKcggnJ4SuwZjZSqFWjnMYacMtpnNsQ7eLQH-HsshB_NKwYMnZO4Ah1LErZhx7VDqLA/exec",
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
        fullName: "",
        number: "",
        email: "",
        collaborationType: "",
        entityType: "",
        organizationName: "",
        collegeName: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit collaboration request");
    }
  };

  const statRefs = useRef([]);

  // Function to animate the counter from 0 to the target value
  const animateCounter = (element, targetValue) => {
    const startValue = 0;
    const duration = 2500; // 2.5 seconds
    const steps = 100;
    const increment = (targetValue - startValue) / steps;
    let currentValue = startValue;
    let step = 0;

    const interval = setInterval(() => {
      currentValue += increment;
      step++;

      element.innerText = Math.floor(currentValue);

      if (step === steps) {
        clearInterval(interval);
        element.innerText = targetValue;
      }
    }, duration / steps);
  };

  useEffect(() => {
    const options = {
      root: null, // observe in the viewport
      threshold: 0.5, // trigger when 50% of the element is in view
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statElement = entry.target;
          const value = statElement.dataset.targetValue;
          animateCounter(statElement, parseFloat(value)); // Start the animation
          observer.unobserve(statElement); // stop observing after animation starts
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    // Initialize IntersectionObserver for each stat value
    statRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      // Clean up the observer when the component is unmounted
      observer.disconnect();
    };
  }, []);


  return (
    <div id="collebration">
       <Toaster position="top-center" reverseOrder={false}/>
      <section className="hero h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden shadow-lg shadow-[#f15b29]">
          <img
            src={collabrationImage}
            alt="Hero background"
            className="opacity-60 w-full h-full object-cover"
          />
        </div>
        <div className="relative flex items-center justify-center flex-col text-center px-6 sm:px-8">
          <h1
            data-aos="fade-up"
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white  "
          >
            Where Achievements Meet
            <span className="before:block m-2 p-1 before:absolute before:-inset-1 before:-skew-y-3 before:bg-[#f15b29] relative inline-block">
              <i className="relative text-white ">Aspirations</i>
            </span>
          </h1>
          <p data-aos="fade-up" className="mt-6 text-xl text-white">
            Join us to recognize success, ignite visionary ideas, and
            collaborate to lead the future of education.
          </p>
          <div className="">
            <button
              data-aos="fade-up"
              onClick={scrollTocollebration}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-white hover:bg-orange-700 hover:text-white  duration-700 ease-linear"
            >
              Explore Partnerships
              <span className=" fa fa-angle-right ml-2 -mr-1 h-5 w-5"></span>
            </button>
          </div>
        </div>
      </section>

      <section className="impact py-12">
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-center flex-col text-center">
            <h2
              data-aos="fade-up"
              className="text-base gradient-text font-semibold tracking-wide uppercase"
            >
              Our Impact
            </h2>
            <h1
              data-aos="fade-up"
              className=" font-extrabold tracking-tight text-white mt-4"
            >
              Driving Innovation Together
            </h1>
            <p
              data-aos="fade-up"
              className="max-w-2xl text-md text-white lg:mx-auto mt-6"
            >
              Let's achieve together - Our collaborations have unlocked new
              opportunities, driving progress, and empowering students and
              professionals to thrive in a rapidly changing world. we are
              building dreams, Together
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div data-aos="fade-up" className="relative">
                <dt className="flex items-center">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-black">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white gradient-text">
                    Innovation in Learning
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white">
                  With the help of AI, interactive tools, and immersive
                  experiences, we’re making complex concepts simple, engaging,
                  and fun to learn.
                </dd>
              </div>

              <div data-aos="fade-up" className="relative">
                <dt className="flex items-center">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-black">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white gradient-text">
                    Opportunities That Matter
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white">
                  From internships to real-world projects, we bridge the gap
                  between knowledge and action, ensuring students are job-ready
                  from day one.
                </dd>
              </div>

              <div data-aos="fade-up" className="relative">
                <dt className="flex items-center">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-black">
                    <span className="text-2xl">💼</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white gradient-text">
                    Industry-Aligned Programs
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white">
                  Our programs are built in collaboration with industry leaders,
                  ensuring that you’re learning what’s relevant today and
                  essential for tomorrow
                </dd>
              </div>

              <div data-aos="fade-up" className="relative">
                <dt className="flex items-center">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-black">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-white gradient-text">
                    Community Building
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-white">
                  Collaborating with top institutions and organizations, we’ve
                  created a platform where learners and educators connect
                  to grow together
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="destinations py-16 px-6 sm:px-8">
        <h1
          data-aos="fade-up"
          className="gradient-text font-extrabold text-center text-white"
        >
          Be a Part of Our Growth Story
        </h1>
        <p
          data-aos="fade-up"
          className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-white text-center"
        >
          Krutanic building a future where education knows no bounds. Together,
          we celebrate progress, spark innovation, and empower learners to reach
          new heights, as well as we create meaningful change, inspire bold
          ideas, and craft a legacy of success. Your journey with us begins
          now—let’s transform learning, together.By working together, we create
          an environment where innovation thrives, opportunities grow, and
          students are empowered to reach their fullest potential.
        </p>
        <hr data-aos="fade-up" className="my-8 border-gray-300" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          <li
            data-aos="fade-up"
            className="small image-1 hover:scale-105 duration-300 ease-linear"
          ></li>
          <li
            data-aos="fade-up"
            className="large image-2 hover:scale-105 duration-300 ease-linear"
          ></li>
          <li
            data-aos="fade-up"
            className="large image-3 hover:scale-105 duration-300 ease-linear"
          ></li>
          <li
            data-aos="fade-up"
            className="small image-4 hover:scale-105 duration-300 ease-linear"
          ></li>
        </ul>
      </section>

      <section className="packages">
        <h1 data-aos="fade-up" className="title gradient-text">
          What Our Collaborations Bring to You
        </h1>
        <p data-aos="fade-up">
          We are always looking for visionary companies and organizations to
          join us on our mission to transform education and careers. By
          partnering with us, you can play a pivotal role in nurturing the next
          generation of innovators, leaders, and problem-solvers. By working
          alongside pioneering companies across technology, business, and
          education sectors, we deliver unparalleled opportunities for learners
          and professionals alike. Together, we are shaping a future where
          innovation and skill-building go hand in hand.
        </p>
        <p data-aos="fade-up">Ready to Join Us?</p>
        <hr data-aos="fade-up" />

        <ul className="grid">
          <li data-aos="fade-up">
            <div className="inline-block">
              <img
                src={skills}
                alt=""
                className="h-10 filter invert brightness-100"
              />
            </div>
            {/* <h4 className="text-2xl font-bold">Collaborate with us</h4> */}
            <p>
              Krutanic bridges knowledge and practice with real-world-focused
              training, let's step into challenges equipped with
              actionable expertise.
            </p>
          </li>
          <li data-aos="fade-up">
            <div className="inline-block">
              <img
                src={training}
                alt=""
                className="h-10 filter invert brightness-100"
              />
            </div>
            {/* <h4 className="text-2xl font-bold">Join our community</h4> */}
            <p>
              Master industry-relevant skills employers crave through Krutanic’s
              Mentor-led programs and achieve personal growth and career
              leadership with confidence.
            </p>
          </li>
          <li data-aos="fade-up">
            <div className="inline-block">
              <img
                src={placement}
                alt=""
                className="h-10 filter invert brightness-100"
              />
            </div>
            {/* <h4 className="text-2xl font-bold">Get involved</h4> */}
            <p>
              Krutanic connects your talent to the right opportunities. With
              strong placement support, your path to success is
              clear and direct.
            </p>
          </li>
          <li data-aos="fade-up">
            <div className="inline-block">
              <img
                src={colleb}
                alt=""
                className="h-10 filter invert brightness-100"
              />
            </div>
            {/* <h4 className="text-2xl font-bold">Be a part of our journey</h4> */}
            <p>
              Innovate, inspire, and educate with Krutanic!, collaborate with us
              to revolutionize learning experiences. Together, we break barriers
              and redefine educational possibilities.
            </p>
          </li>
        </ul>
      </section>

      <section className="testimonials">
        <h1 data-aos="fade-up" className="title text-center mb-2">
          Shaping Futures Through Collaboration
        </h1>
        <hr data-aos="fade-up" />
        <p data-aos="fade-up" className="quote">
          Krutanic recognize that educators and staff play in shaping
          their futures. By collaborating with us, your students become part of
          continuous learning opportunities, we empower our team to stay ahead
          in an ever-evolving educational landscape.
        </p>
        <p data-aos="fade-up" className=" gradient-text">
          Our Bonding with Partners
        </p>
        <p data-aos="fade-up" className="quote">
          We’re committed to your personal and professional growth. From
          exclusive workshops to opportunities for recognition and mentorship,
          we foster an environment where creativity, innovation, and career
          advancement flourish. With us, you're not just working—you’re
          evolving.
        </p>
        <p data-aos="fade-up" className=" gradient-text">
          Your Growth Is Our Priority
        </p>
        <p data-aos="fade-up" className="quote">
          When you join hands with us, you become part of a community that
          values teamwork, respect, and mutual success. We offer flexible work
          policies, rewarding career paths, and an open platform for your ideas.
          Let’s inspire students and make a lasting impact on
          education, together.
        </p>
        <p data-aos="fade-up" className=" gradient-text">
          A Culture Built on Collaboration and Excellence
        </p>
      </section>

      <section className="partnerships py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 data-aos="fade-up" className=" font-extrabold">
              Collaboration by the Numbers
            </h1>
            <p
              data-aos="fade-up"
              className="mt-3 max-w-2xl mx-auto text-xl sm:mt-4"
            >
              Our partnerships have yielded impressive results across various
              metrics.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
          {stats.map((stat, index) => (
        <div
          data-aos="fade-up"
          key={stat.name}
          className="flex flex-col"
        >
          <dt className="order-2 mt-2 text-lg leading-6 font-medium">
            {stat.name}
          </dt>
          <dd
            ref={(el) => (statRefs.current[index] = el)} // Save the ref to be used in the IntersectionObserver
            className="order-1 text-5xl font-extrabold text-[#f15b29]"
            data-target-value={stat.value}
          >
            0 
          </dd>
        </div>
      ))}
          </dl>
        </div>
      </section>

      <section ref={collebrationSectionRef} className=" bg-white text-black">
        <div className="collebrationform lg:flex lg:gap-5">
          {/* First Div (this will come above the form on mobile) */}
          <div className="w-full lg:w-1/2  order-1 text-center mb-4 lg:mb-0">
            <h1 data-aos="fade-up" className="text-4xl gradient-text mb-5">
              Ready to join our network?
            </h1>
            <h3 data-aos="fade-up" className="text-3xl mb-5">
              Let's collaborate and innovate together.
            </h3>
            <img
              data-aos="fade-up"
              src={formimg}
              alt="collebration"
              className="rounded-lg"
            />
          </div>
          <div
            data-aos="fade-up"
            className="w-full lg:w-1/2 border p-6 rounded-lg shadow-lg order-2"
          >
            <header>
              <h2 className="text-2xl font-semibold text-center gradient-text">
                Collaboration Request
              </h2>
              <p className="">
                Fill out this form to start a collaboration with us.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block font-medium">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
               <div className="space-y-2">
                <label htmlFor="fullName" className="block font-medium">
                  Phone or WhatsApp Number
                </label>
                <input
                  id="number"
                  type="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Enter your phone or WhatsApp number"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="collaborationType"
                  className="block font-medium"
                >
                  Type of Collaboration
                </label>
                <select
                  id="collaborationType"
                  name="collaborationType"
                  value={formData.collaborationType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select collaboration type
                  </option>
                  <option value="research">Research Partnership</option>
                  <option value="internship">Internship Program</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-medium">Entity Type</label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="company"
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      id="company"
                      name="entityType"
                      value="company"
                      onChange={() => handleEntityTypeChange("company")}
                      checked={formData.entityType === "company"}
                    />
                    <span>Organisation</span>
                  </label>
                  <label
                    htmlFor="college"
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      id="college"
                      name="entityType"
                      value="college"
                      onChange={() => handleEntityTypeChange("college")}
                      checked={formData.entityType === "college"}
                    />
                    <span>College/University</span>
                  </label>
                </div>
              </div>
              {formData.entityType === "company" && (
                <div className="space-y-2">
                  <label
                    htmlFor="organizationName"
                    className="block font-medium"
                  >
                    Organization Name
                  </label>
                  <input
                    id="organizationName"
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter your organization name"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
              {formData.entityType === "college" && (
                <div className="space-y-2">
                  <label htmlFor="collegeName" className="block font-medium">
                    College/University Name
                  </label>
                  <input
                    id="collegeName"
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="additionalInfo" className="block font-medium">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Please provide any additional details about your collaboration proposal"
                  className="w-full resize-none px-3 py-2 border rounded-md min-h-[100px]"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:text-[#f15b29]"
              >
                Submit Collaboration Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collabration;
