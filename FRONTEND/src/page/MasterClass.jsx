import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from "react";
import HomePopup from "../Components/HomePopup";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import img from "../assets/krutanic_certificate.png";
import imghero from "../assets/masterclass.jpeg";
import imgalt from "../assets/defaultmasterclass.jpg";
import Popularcourse from "../Components/popularcourse";

import dsPoster from "../../krutanic/images/poster/datascience.png";
import mernPoster from "../../krutanic/images/poster/mern.png";
import pmPoster from "../../krutanic/images/poster/productmanagement.png";

const MasterClass = () => {
  const navigate = useNavigate();
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

  const handleShare = async (masterclass) => {
    const slug = masterclass?.title ? slugify(masterclass.title) : "";
    const shareUrl = slug ? `${window.location.origin}/MasterClass/${slug}` : `${window.location.origin}/mentorship`;
    let shared = false;
    if (navigator.share) {
      try {
        await navigator.share({
          title: masterclass?.title || 'Krutanic Masterclass',
          text: `Check out this Masterclass: ${masterclass?.title || ""}`,
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
          toast.success("Masterclass link copied to clipboard!");
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
            toast.success("Masterclass link copied to clipboard!");
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

  const formatClassDateScaler = (dateValue) => {
    const d = new Date(dateValue);
    const day = d.getDate();
    const suffix = (dayVal) => {
      if (dayVal > 3 && dayVal < 21) return 'th';
      switch (dayVal % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${day}${suffix(day)} ${month}, ${weekday}`;
  };

  const formatClassTimeScaler = (dateValue, durationStr) => {
    const d = new Date(dateValue);
    const startStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const parsedDur = parseInt(durationStr) || 90;
    const end = new Date(d.getTime() + parsedDur * 60000);
    const endStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startStr} - ${endStr}`;
  };

  const slugify = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // Converts any Google Drive share link to an embeddable image URL
  const convertGoogleDriveUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    const trimmed = url.trim();
    if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;
    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?&#]+)/);
    if (fileMatch) {
      return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
    }
    const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
    if (idMatch && trimmed.includes("drive.google.com")) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return trimmed;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-6xl mx-auto px-4 md:px-0">
            {activeMasterClasses.map((masterclass) => {
              const titleLower = masterclass.title.toLowerCase();
              
              let bannerCopy = "90 Minutes. One Session. Industry Standards.";
              let bannerSubtitle = "A practical guide to master tech frameworks.";
              let dynamicCategoryTag = "✦ Live Upskilling Masterclass";
              
              if (titleLower.includes("automation") || titleLower.includes("testing") || titleLower.includes("qa")) {
                bannerCopy = "90 Minutes. One Playback. Hands-on Blueprint.";
                bannerSubtitle = "A transition guide for automation & testing roles.";
                dynamicCategoryTag = "✦ Practical Automation Build";
              } else if (titleLower.includes("datascience") || titleLower.includes("data science") || titleLower.includes("data analytics") || titleLower.includes("analytics") || titleLower.includes("sql")) {
                bannerCopy = "120 Minutes. One Playback. Basic Coding Skills.";
                bannerSubtitle = "A transition guide for non-tech to Data Science role.";
                dynamicCategoryTag = "✦ AI & Data Science Career";
              } else if (titleLower.includes("mern") || titleLower.includes("full stack") || titleLower.includes("web") || titleLower.includes("react") || titleLower.includes("node")) {
                bannerCopy = "90 Minutes. One Session. Complete MERN blueprint.";
                bannerSubtitle = "A production-ready stack walkthrough.";
                dynamicCategoryTag = "✦ Industry MERN Build";
              } else if (titleLower.includes("product") || titleLower.includes("management") || titleLower.includes("pm")) {
                bannerCopy = "90 Minutes. One Session. PM Case Mastery.";
                bannerSubtitle = "A guide to cracking Tier-1 product management.";
                dynamicCategoryTag = "✦ Product Strategy Guide";
              }
              
              const mRegisteredCount = masterclass.registeredCount || "3,840+";
              const mInstructorName = masterclass.instructorName || "Abhijeet Gupta";
              const mInstructorDesignation = masterclass.instructorDesignation || "Project Engineer";
              const mInstructorPhoto = masterclass.instructorPhoto;

              return (
                <article 
                  className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 w-full max-w-[420px] mx-auto cursor-pointer"
                  key={masterclass._id}
                  onClick={(e) => {
                    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I" && !e.target.closest("button")) {
                      if (masterclass.status !== "completed") {
                        navigate(`/MasterClass/${slugify(masterclass.title)}`);
                      }
                    }
                  }}
                >
                  {/* Banner (Top Half) — Poster Image */}
                  <div className="relative overflow-hidden" style={{ minHeight: "200px" }}>
                    {/* Poster image */}
                    <img
                      src={convertGoogleDriveUrl(masterclass.image)}
                      alt={masterclass.title}
                      className="w-full h-[200px] object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"; }}
                    />
                    {/* Status badge overlay */}
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-lg ${
                      masterclass.status === "upcoming"
                        ? "bg-indigo-600 text-white"
                        : masterclass.status === "ongoing"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-200"
                    }`}>
                      {masterclass.status}
                    </span>



                  </div>

                  {/* Body (Bottom Half) */}
                  <div className="p-5 flex flex-col gap-4 bg-white flex-grow justify-between">
                    <div className="flex flex-col gap-3">
                      {/* Registered Badge */}
                      <div className="flex items-center gap-1.5 w-max px-2 py-1 bg-slate-100/80 rounded-md text-slate-700 text-[10px] font-bold tracking-wider uppercase">
                        <i className="fa fa-fire text-[#ff6b2d] text-xs"></i>
                        <span>
                          {masterclass.registeredCount 
                            ? masterclass.registeredCount 
                            : ( (95 + (masterclass._id ? [...masterclass._id.toString()].reduce((a, c) => a + c.charCodeAt(0), 0) % 60 : 0)) + (masterclass.applications || 0) )
                          } REGISTERED
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug hover:text-[#ff6b2d] transition-colors line-clamp-2 min-h-[44px]">
                        {masterclass.title}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      {/* Starts On Block */}
                      <div className="border-t border-slate-150 pt-3 flex flex-col gap-0.5">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Starts On</span>
                        <span className="text-xs font-bold text-slate-800">
                          {new Date(masterclass.start).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })} | {formatClassTimeScaler(masterclass.start, masterclass.duration)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          className="flex-grow py-3 bg-[#ff6b2d] hover:bg-[#e0561f] text-white text-xs font-bold uppercase rounded-lg text-center transition-all shadow-sm hover:shadow-[#ff6b2d]/25 tracking-wider flex items-center justify-center gap-1"
                          onClick={() =>
                            masterclass.status === "completed"
                              ? handleDownload(masterclass)
                              : navigate(`/MasterClass/${slugify(masterclass.title)}`)
                          }
                        >
                          {masterclass.status === "completed" ? "Get Certificate" : "View More"}
                        </button>
                        <button
                          className="p-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500 rounded-lg transition-all"
                          onClick={() => handleShare(masterclass)}
                          title="Share Mentorship Link"
                        >
                          <i className="fa fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mc-web-media flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto px-4 md:px-0 mt-16 mb-16">
          <section className="mc-why-join flex-1 p-8 bg-white rounded-3xl shadow-md border border-slate-200/80 mb-6 lg:mb-0">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-1" style={{ color: "#1e293b" }}>Why Join</h2>
            <p className="text-xl text-slate-500 mb-8 font-medium">Krutanic Masterclasses</p>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-globe"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Designed</span>
                  <span className="text-slate-500 text-[15px] leading-tight">For AI Era</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-certificate"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Krutanic</span>
                  <span className="text-slate-500 text-[15px] leading-tight">Certificate</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-video-camera"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Live</span>
                  <span className="text-slate-500 text-[15px] leading-tight">Learning</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-magic"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Top</span>
                  <span className="text-slate-500 text-[15px] leading-tight">Instructors</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-book"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Bonus</span>
                  <span className="text-slate-500 text-[15px] leading-tight">Resources</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#fff4f0] flex items-center justify-center text-[#ff6b2d] text-xl w-14 h-14 rounded-xl border border-[#ffe4d6]">
                  <i className="fa fa-question-circle-o"></i>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-[15px] leading-tight">Live</span>
                  <span className="text-slate-500 text-[15px] leading-tight">Quizzes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-slate-200 bg-slate-50 rounded-xl flex justify-between items-center px-5 py-3">
              <span className="text-slate-600 font-medium text-[15px]">Average User Rating</span>
              <div className="flex items-center gap-3">
                <div className="text-amber-400 text-sm flex gap-1">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                </div>
                <span className="font-bold text-slate-800 text-[15px]">4.8/5</span>
              </div>
            </div>
          </section>


          <section className="mc-certificate flex-1 p-8 bg-white rounded-3xl shadow-md border border-slate-200/80 flex flex-col">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2" style={{ color: "#1e293b" }}>Certified Excellence</h2>
            <p className="text-lg text-slate-500 font-medium mb-6">
              Validate your expertise with industry-recognized certifications.
            </p>
            <div className="w-full flex-1 rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-50 p-2 shadow-inner group flex items-center justify-center">
              <img src={img} alt="Certificate preview" className="w-full h-auto max-h-[300px] object-contain rounded-xl transform group-hover:scale-[1.02] transition-transform duration-500 drop-shadow-md" />
            </div>
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
                      src={convertGoogleDriveUrl(masterclass.image)}
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
                      src={convertGoogleDriveUrl(masterclass.image)}
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
