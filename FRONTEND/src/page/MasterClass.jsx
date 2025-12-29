import { Helmet } from "react-helmet";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import API from "../API";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import img from "../assets/masterclasscertificate.jpg";
import imghero from "../assets/masterhero.jpg";
import imgmentor from "../assets/Advanced Course Images/Product management/pm.jpg";
import imgadvance from "../assets/courses/feesimg.jpeg";
import imgalt from "../assets/defaultmasterclass.jpg";
import Popularcourse from "../Components/popularcourse";
import logo from "../User/playerlogo.jpg";

const MasterClass = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const [openIndex, setOpenIndex] = useState(null);
  const [isRegisterForm, setisRegisterForm] = useState(false);
  const [isDownloadForm, setisDownloadForm] = useState(false);
  const [allMasterClass, setallMasterClass] = useState([]);
  const [completedMasterClass, setCompletedMasterClass] = useState([]);
  const [selectedMasterClass, setSelectedMasterClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clgemail: "",
    collegename: "",
    phone: "",
  });
  const [certificateData, setCertificateData] = useState({
    name: "",
    email: "",
    clgemail: "",
    phone: "",
  });
  const faqs = [
    {
      question: "How do I register for the masterclass?",
      answer:
        "Simply click the Register Now button and fill in your required details and join the community group.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Yes! After completing a MasterClass, you will receive a certificate of completion.",
    },
    {
      question: "Do I need to pay any fees?",
      answer:
        "Our MasterClasses are free of cost, making learning accessible to everyone.",
    },
    {
      question: "Can I interact with the mentor?",
      answer:
        "Yes! Our sessions are live and interactive, allowing you to ask questions and engage with mentors.",
    },
    {
      question: "What are the technical requirements to attend?",
      answer:
        "A stable internet connection, a laptop or mobile device, and a willingness to learn!",
    },
    {
      question: "How do I access the Masterclass session link?",
      answer:
        "Once registered, you will receive the session link via email before the class starts even you will be added community group.",
    },
  ];
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const closeForm = () => {
    setisRegisterForm(false);
    setisDownloadForm(false);
    setSelectedMasterClass(null);
    setFormData({
      name: "",
      email: "",
      clgemail: "",
      collegename: "",
      phone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "email" || name === "clgemail" ? value.toLowerCase() : value,
    });
  };

  const fetchMasterclass = async () => {
    try {
      const response = await axios.get(`${API}/allmasterclasswithsapplicant`);
      setallMasterClass(
        response.data.filter(
          (item) => item.status === "upcoming" || item.status === "ongoing"
        )
      );
      setCompletedMasterClass(
        response.data.filter((item) => item.status === "completed")
      );
    } catch (error) {
      console.error("There was an error fetching MasterClass:", error);
    }
  };

  useEffect(() => {
    fetchMasterclass();
  }, []);

  const handleApply = async (masterClass) => {
    setSelectedMasterClass(masterClass);
    setisRegisterForm(true);
  };

  const handleDownload = async (masterClass) => {
    setSelectedMasterClass(masterClass);
    setisDownloadForm(true);
  };

  const downloadCertificate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // console.log("Submitted Email:", email);
    // console.log("Submitted id:", selectedMasterClass);
    try {
      const response = await axios.get(
        `${API}/masterclassauth/${selectedMasterClass._id}/${email}`
      );
      const certificateData = response.data;
      // console.log("final",response.data);
      setisDownloadForm(false);
      setSelectedMasterClass(null);

      if (!certificateData.certificate) {
        throw new Error("Certificate not available");
      }

      // console.log("masteruser", certificateData.certificate);

      // Fetch the image as blob to force download
      const imageResponse = await fetch(certificateData.certificate);
      const blob = await imageResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "certificate.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API}/masterclassapply/${selectedMasterClass._id}`,
        formData
      );
      toast.success("Successfully Applied! Join our Community group");
      setTimeout(() => {
        window.open(selectedMasterClass.link, "_blank");
      }, 3000);
      fetchMasterclass();
      closeForm();
    } catch (error) {
      console.error("Error applying for MasterClass", error);
      toast.error(
        error.response?.data?.message || "Error applying for MasterClass"
      );
    }
  };

  return (
    <div id="MasterClass">
      <Helmet>
        <title>Krutanic MasterClass | Upskill in Tech, Coding & AI</title>
        <meta
          name="keywords"
          content="e-learning, Krutanic MasterClass, coding, data science, AI courses, tech upskilling, online mentorship"
        />
        <meta
          name="description"
          content="Join Krutanic MasterClass to learn top tech skills from industry leaders. Master coding, data science, AI, and more with hands-on learning and mentorship."
        />

        <meta
          property="og:title"
          content="Krutanic MasterClass | Upskill in Tech, Coding & AI"
        />
        <meta
          property="og:url"
          content="https://www.krutanic.com/MasterClass"
        />
        <meta
          property="og:image"
          content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"
        />
        <meta
          property="og:description"
          content="Join Krutanic MasterClass to learn top tech skills from industry leaders. Master coding, data science, AI, and more with hands-on learning and mentorship."
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta
          property="twitter:title"
          content="Krutanic MasterClass | Upskill in Tech, Coding & AI"
        />
        <meta
          name="twitter:image"
          content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"
        />
        <meta
          property="twitter:description"
          content="Join Krutanic MasterClass to learn top tech skills from industry leaders. Master coding, data science, AI, and more with hands-on learning and mentorship."
        />

        <link rel="canonical" href="https://www.krutanic.com/MasterClass" />
      </Helmet>

      <Toaster position="top-center" reverseOrder={false} />
      <div className="masterclassherosection">
        <img src={imghero} alt="" />
      </div>

      {/* <div className="masterclasshero">
        <input
          className="radio"
          type="radio"
          name="card"
          id="cardUno"
          defaultChecked
        />
        <label
          className="content"
          htmlFor="cardUno"
          style={{ backgroundImage: `url(${imghero})` }}
        >
          <h1 className="title-card">
            Masterclasses to Boost Your Skills
          </h1>
          <h3 className="card-title subsubtitle">
            <span>Join our comprehensive masterclass and take your expertise to the next level. Learn from industry experts and transform your career.</span>
          </h3>
        </label>
        <input className="radio" type="radio" name="card" id="cardDos" />
        <label
          className="content"
          htmlFor="cardDos"
          style={{ backgroundImage: `url(${imgmentor})` }}
        >
          <h1 className="title-card">
            <span className="marg-bott">EXAMPLE TITLE OF MY CARD</span>
            <span className="subtitle">EXAMPLE SOME SUBTITLE OR HEADER</span>
          </h1>
          <h3 className="card-title subsubtitle">
            <span>EXAMPLE SOME ADDITIONS</span>
          </h3>
        </label>
        <input className="radio" type="radio" name="card" id="cardTres" />
        <label
          className="content"
          htmlFor="cardTres"
          style={{ backgroundImage: `url(${imgadvance})` }}
        >

        </label>
      </div>  */}
      <div className="aboutwhy">
        <div className="about">
          <h1>| About Masterclass</h1> <br />
          <p>
            Krutanic MasterClass is an interactive online learning platform
            where students learn directly from industry experts and top
            educators through free, career-focused masterclasses in Data
            Science, AI, Full Stack Development, Digital Marketing, Cyber
            Security and more. <br />
            <br /> Whether you aim to upskill, explore new fields, or prepare
            for internships and job opportunities, our online courses help you
            build practical skills and gain a competitive edge.
          </p>
        </div>
        <div className="why">
          <h1>| Why Join Krutanic Masterclass ? </h1> <br />
          <div>
            <div className="item">
              <i className="fa fa-certificate"></i>
              <h2>Certificate</h2>
            </div>
            <div className="item">
              <i className="	fa fa-mortar-board"></i>
              <h2>Expert Mentor</h2>
            </div>
            <div className="item">
              <i className="fa fa-line-chart"></i>
              <h2>Career Guidance</h2>
            </div>
            <div className="item">
              <i className="fa fa-video-camera"></i>
              <h2>Live Interactive</h2>
            </div>
            <div className="item">
              <i className="fa fa-briefcase"></i>
              <h2>Industrial Topic</h2>
            </div>
            <div className="item">
              <i className="fa fa-rupee"></i>
              <h2>Free of Cost</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="classess">
        <div>
          {allMasterClass?.map((masterclass, index) => (
            <div className="item">
              <img
                src={masterclass.image}
                alt="masterclass"
                onError={(e) => (e.target.src = imgalt)}
              />
              <div className="text" key={masterclass._id || index}>
                <div className="content">
                  <h2>{masterclass.title}</h2>
                  <h3>
                    Start time:{" "}
                    {new Date(masterclass.start).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </h3>
                  <h3>
                    End time:{" "}
                    {new Date(masterclass.end).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </h3>
                </div>
                {masterclass.status === "upcoming" ? (
                  <div className="register">
                    <p>Registration will start soon !</p>
                  </div>
                ) : (
                  <div className="register">
                    <span>
                      {masterclass.applications} learners have registered
                    </span>
                    <button onClick={() => handleApply(masterclass)}>
                      Register Now
                    </button>
                    {/* <button onClick={() => handleDownload(masterclass)} className="fa fa-download" > Certificate</button> */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="benifits">
        <h1>| Benefits of the Masterclass</h1> <br />
        <div>
          <div className="item">
            <i className="fa fa-certificate"></i>
            <h2>Industry-Recognized Certification</h2>
            <p>
              Receive a certificate upon completion to boost your credentials.
            </p>
          </div>
          <div className="item">
            <i className="fa fa-line-chart"></i>
            <h2>Career Guidance </h2>
            <p> Get personalized advice to navigate your career path.</p>
          </div>
          <div className="item">
            <i className="fa fa-globe"></i>
            <h2>Networking Opportunities</h2>
            <p>Connect with like-minded professionals and industry leaders.</p>
          </div>
        </div>
      </div>

      <div className="industrialtalk">
        <h1>| Industrial Talks</h1>
        <div>
          <div className="item">
            <iframe
              src={`https://drive.google.com/file/d/10uvyAF51jXUuxFJVS8Af9hXeTNFfnCTO/preview?usp=sharing`}
              allow="autoplay"
              allowFullScreen
            ></iframe>
            <div className="text">
              <div className="content">
                <h3>Podcast on Career Advancement with</h3>
                <h2>Karam Dharmanandra Singh</h2>
                <h3>
                  Manager at <span>BOSCH</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="certificateparticipate">
        <div className="text">
          <h1>| Certificate of Participation</h1> <br />
          <p>
            After attending the Krutanic masterclass, you'll receive a
            certificate of participation. <br />
            <br /> This certificate acknowledges your commitment to professional
            development and can be shared on LinkedIn and other professional
            platforms to highlight your expertise and showcase your continuous
            learning.
          </p>
        </div>
        <div className="image">
          <img src={img} alt="" />
        </div>
      </div>

      {/* completed course section */}
      <div className="classess">
        <div>
          {completedMasterClass
            ?.slice()
            .reverse()
            .map((masterclass, index) => (
              <div className="item">
                <img
                  src={masterclass.image}
                  alt="masterclass"
                  onError={(e) => (e.target.src = imgalt)}
                />
                <div className="text" key={masterclass._id || index}>
                  <div className="content">
                    <h2>{masterclass.title}</h2>
                    <h3>
                      Start time:{" "}
                      {new Date(masterclass.start).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </h3>
                    <h3>
                      End time:{" "}
                      {new Date(masterclass.end).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </h3>
                  </div>
                  <div className="register">
                    <span>
                      {masterclass.applications} learners have participated
                    </span>
                    {masterclass.pdfstatus && (
                      <button
                        onClick={() => handleDownload(masterclass)}
                        className="fa fa-download"
                      >
                        {" "}
                        Certificate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="popularcourse">
        <h1 data-aos="zoom-in">| Popular Courses</h1>
        <Popularcourse />
      </div>

      <div className="faqsection">
        <div className="max-w-[1200px] mx-auto p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b py-2">
              <button
                className="w-full text-left font-semibold text-lg flex justify-between"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>{openIndex === index ? "▲" : "▼"}</span>
              </button>
              {openIndex === index && (
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Registration Form */}
      {isRegisterForm && selectedMasterClass && (
        <div id="registrationform">
          <div className="form">
            <div className="close">
              <h3>Register NOW!</h3>
              <span className="fa fa-close" onClick={closeForm}></span>
            </div>
            <h3 className="title">{selectedMasterClass.title}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Personal Email id"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Student's College Email id"
                name="clgemail"
                value={formData.clgemail}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Enter College Name"
                name="collegename"
                value={formData.collegename}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="WhatsApp Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input className="submitbtn" type="submit" value="SUBMIT" />
              <p>
                <span>NOTE : </span>Enter your details carefully, they will
                appear on your certificate.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Download Form */}
      {isDownloadForm && selectedMasterClass && (
        <div id="registrationform">
          <div className="form">
            <div className="close">
              <h3>Download Certificate!</h3>
              <span className="fa fa-close" onClick={closeForm}></span>
            </div>
            <h3 className="title">{selectedMasterClass.title}</h3>
            <form onSubmit={downloadCertificate}>
              <input
                type="email"
                name="email"
                placeholder="Personal Email id"
                required
              />
              <input className="submitbtn" type="submit" value="SUBMIT" />
              <p>
                <span>NOTE : </span>Please enter the same Email that you used
                during registration.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterClass;
