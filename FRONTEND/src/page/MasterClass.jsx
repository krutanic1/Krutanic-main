import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from "react";
import HomePopup from "../Components/HomePopup";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import API from "../API";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import img from "../assets/masterclasscertificate.jpg";
import imghero from "../assets/masterclass.jpeg";
import imgalt from "../assets/defaultmasterclass.jpg";
import Popularcourse from "../Components/popularcourse";

import dsPoster from "../../krutanic/images/poster/datascience.png";
import mernPoster from "../../krutanic/images/poster/mern.png";
import pmPoster from "../../krutanic/images/poster/productmanagement.png";

const MasterClass = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isRegisterForm, setisRegisterForm] = useState(false);
  const [isDownloadForm, setisDownloadForm] = useState(false);
  const [allMasterClass, setallMasterClass] = useState([]);
  const [upcomingMasterClass, setUpcomingMasterClass] = useState([]);
  const [ongoingMasterClass, setOngoingMasterClass] = useState([]);
  const [completedMasterClass, setCompletedMasterClass] = useState([]);
  const [selectedMasterClass, setSelectedMasterClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    field: "",
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
      experience: "",
      field: "",
      phone: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "email" ? value.toLowerCase() : value,
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
      setUpcomingMasterClass(
        response.data.filter((item) => item.status === "upcoming")
      );
      setOngoingMasterClass(
        response.data.filter((item) => item.status === "ongoing")
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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/mentorship`;
    let shared = false;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Krutanic Mentorship Program',
          text: 'Check out the Krutanic Mentorship Program!',
          url: shareUrl,
        });
        shared = true;
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
    if (!shared) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Mentorship link copied to clipboard!");
        } else {
          throw new Error("Clipboard API not available");
        }
      } catch (err) {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textArea);
          if (successful) {
            toast.success("Mentorship link copied to clipboard!");
          } else {
            throw new Error("execCommand copy failed");
          }
        } catch (fallbackErr) {
          console.error("Failed to copy link:", fallbackErr);
          toast.error("Failed to copy link.");
        }
      }
    }
  };

  const activeMasterClasses = [...allMasterClass].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const latestCompletedMasterClass = [...completedMasterClass]
    .sort((a, b) => new Date(b.end) - new Date(a.end))
    .slice(0, 2);

  const formatClassDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatClassDateTime = (dateValue) =>
    new Date(dateValue).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

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
      <div className="mc-shell">
        <section
          className="mc-hero"
          style={{ backgroundImage: `url(${imghero})` }}
        >
          <span className="mc-eyebrow">Elevate your career</span>
          <h1>
            Masterclasses <span>to Boost</span> Your Skills
          </h1>
          <p>
            Gain exclusive access to industry giants and transformative
            learning experiences.
          </p>
          <button
            onClick={() => {
              const target = document.getElementById("active-classes");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Now
          </button>
        </section>

        <section className="mc-status-strip">
          <div className="mc-status-card">
            <strong>{upcomingMasterClass.length}</strong>
            <span>Upcoming</span>
          </div>
          <div className="mc-status-card">
            <strong>{ongoingMasterClass.length}</strong>
            <span>Ongoing</span>
          </div>
          <div className="mc-status-card">
            <strong>{completedMasterClass.length}</strong>
            <span>Completed</span>
          </div>
        </section>

        <div className="mc-web-intro">
          <section className="mc-about">
            <h2>About Krutanic</h2>
            <p>
              Krutanic MasterClass is an interactive learning platform where
              students learn directly from industry experts and top educators
              through free, career-focused sessions in Data Science, AI, Full
              Stack Development, Marketing, Cyber Security, and more.
            </p>
          </section>

          <section className="mc-benefit-grid">
            <article>
              <i className="fa fa-certificate"></i>
              <h3>Certificate</h3>
            </article>
            <article>
              <i className="fa fa-mortar-board"></i>
              <h3>Expert Mentors</h3>
            </article>
            <article>
              <i className="fa fa-video-camera"></i>
              <h3>Live Networking</h3>
            </article>
            <article>
              <i className="fa fa-handshake-o"></i>
              <h3>Hands-on Labs</h3>
            </article>
            <article>
              <i className="fa fa-briefcase"></i>
              <h3>Lifetime Access</h3>
            </article>
            <article>
              <i className="fa fa-users"></i>
              <h3>24/7 Support</h3>
            </article>
          </section>
        </div>

        <section className="mc-classes" id="active-classes">
          <div className="mc-section-head">
            <h2>Active Classes</h2>
            <span>View all</span>
          </div>
          <div className="mc-classes-strip">
            {activeMasterClasses.map((masterclass) => (
              <article className="mc-class-card" key={masterclass._id}>
                <div className="mc-class-thumb">
                  <img
                    src={masterclass.image}
                    alt={masterclass.title}
                    onError={(e) => (e.target.src = imgalt)}
                  />
                  <span className={`mc-badge mc-${masterclass.status}`}>
                    {masterclass.status}
                  </span>
                </div>
                <div className="mc-class-body">
                  <h3>{masterclass.title}</h3>
                  <p>{formatClassDate(masterclass.start)}</p>
                  <div className="mc-class-actions">
                    <button
                      className="mc-action-btn"
                      onClick={() =>
                        masterclass.status === "completed"
                          ? handleDownload(masterclass)
                          : handleApply(masterclass)
                      }
                    >
                      {masterclass.status === "completed"
                        ? "Get Certificate"
                        : "Register Now"}
                    </button>
                    <button
                      className="mc-share-btn"
                      onClick={handleShare}
                      title="Share Mentorship Link"
                    >
                      <i className="fa fa-share-alt"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mc-web-media">
          <section className="mc-industrial">
            <h2>Industrial Talks EP. 12</h2>
            <div className="mc-industrial-card">
              <div className="mc-play-button">
                <i className="fa fa-play"></i>
              </div>
              <h3>#Precision in Engineering</h3>
              <p>
                Join Karam Dharmanandra Singh from BOSCH and discover modern
                product practices.
              </p>
            </div>
          </section>

          <section className="mc-certificate">
            <div className="mc-section-head">
              <h2>Certified Excellence</h2>
            </div>
            <p>
              Validate your expertise with industry-recognized certifications.
            </p>
            <img src={img} alt="Certificate preview" />
          </section>
        </div>

        {/* <section className="mc-industrial-video">
          <div className="mc-section-head">
            <h2>Industrial Talk Session</h2>
          </div>
          <div className="mc-industrial-video-card">
            <a
              className="mc-industrial-thumb-link"
              href="https://drive.google.com/file/d/15rAhofL6ei6Gxy9fHRrkcjXB4SMGMzft/preview"
              target="_blank"
              rel="noreferrer"
              aria-label="Open industrial talk session"
            >
              <img
                src="/course_thumbnails/industrytalksession.jpg"
                alt="Industrial Talk Session Thumbnail"
                className="mc-industrial-thumb"
              />
              <span className="mc-industrial-thumb-play">
                <i className="fa fa-play"></i>
              </span>
            </a>
            <div className="mc-industrial-video-text">
              <h3>Podcast on Career Advancement</h3>
              <p>
                With Karam Dharmanandra Singh, manager at BOSCH. Learn how
                product teams operate and how to prepare for industry projects.
              </p>
            </div>
          </div>
        </section> */}

        <div className="mc-web-trust">
          <section className="mc-why">
            <article>
              <i className="fa fa-certificate"></i>
              <div>
                <h3>Industry Certification</h3>
                <p>Accepted by recruiters and organizations worldwide.</p>
              </div>
            </article>
            <article>
              <i className="fa fa-line-chart"></i>
              <div>
                <h3>Career Guidance</h3>
                <p>Personalized internship tracks and practical mentorship.</p>
              </div>
            </article>
            <article>
              <i className="fa fa-globe"></i>
              <div>
                <h3>Networking</h3>
                <p>
                  Connect with thousands of peers and mentors in our groups.
                </p>
              </div>
            </article>
          </section>

          {latestCompletedMasterClass.length > 0 && (
            <section className="mc-completed">
              <div className="mc-section-head">
                <h2>Recently Completed</h2>
              </div>
              <div className="mc-completed-list">
                {latestCompletedMasterClass.map((masterclass) => (
                  <article className="mc-completed-item" key={masterclass._id}>
                    <img
                      src={masterclass.image}
                      alt={masterclass.title}
                      onError={(e) => (e.target.src = imgalt)}
                    />
                    <div>
                      <h3>{masterclass.title}</h3>
                      <p>{formatClassDate(masterclass.end)}</p>
                    </div>
                    {masterclass.pdfstatus && (
                      <button onClick={() => handleDownload(masterclass)}>
                        <i className="fa fa-download"></i>
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="mc-popular">
          <div className="mc-section-head">
            <h2>Popular Courses</h2>
          </div>
          <Popularcourse />
        </section>

        {completedMasterClass.length > 0 && (
          <section className="mc-completed-catalog">
            <div className="mc-section-head">
              <h2>All Completed Masterclasses</h2>
            </div>
            <div className="mc-completed-cards">
              {[...completedMasterClass]
                .reverse()
                .map((masterclass) => (
                  <article className="mc-completed-card" key={masterclass._id}>
                    <img
                      src={masterclass.image}
                      alt={masterclass.title}
                      onError={(e) => (e.target.src = imgalt)}
                    />
                    <div>
                      <h3>{masterclass.title}</h3>
                      <p>Start: {formatClassDateTime(masterclass.start)}</p>
                      <p>End: {formatClassDateTime(masterclass.end)}</p>
                      <span>
                        {masterclass.applications?.length ||
                          masterclass.applications ||
                          0}{" "}
                        learners participated
                      </span>
                    </div>
                    {masterclass.pdfstatus && (
                      <button onClick={() => handleDownload(masterclass)}>
                        Certificate
                      </button>
                    )}
                  </article>
                ))}
            </div>
          </section>
        )}

        <section className="mc-faq">
          <div className="mc-section-head">
            <h2>Frequently Asked</h2>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} className="mc-faq-item">
              <button onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <i className={`fa ${openIndex === index ? "fa-minus" : "fa-plus"}`}></i>
              </button>
              {openIndex === index && <p>{faq.answer}</p>}
            </div>
          ))}
        </section>

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
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Work experience (Years)</option>
                <option value="0-2">0-2</option>
                <option value="2-4">2-4</option>
                <option value="4-6">4-6</option>
                <option value="6-8">6+</option>
                
              </select>
              <input
                type="text"
                placeholder="In which field are you currently working"
                name="field"
                value={formData.field}
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
