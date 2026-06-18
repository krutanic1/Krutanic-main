
filepath = r"c:\Users\tarun\OneDrive\Desktop\Krutanic-main-1\FRONTEND\src\page\MasterClass.jsx"
top_half = """import { Helmet } from 'react-helmet-async';
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
import { motion } from "framer-motion";
import { FaCheckCircle, FaStar, FaTwitter, FaPlay, FaDownload, FaShareAlt, FaGraduationCap, FaLaptopCode, FaChartLine, FaQuoteLeft, FaCertificate, FaRegClock, FaRocket, FaUserTie, FaBolt, FaBrain } from "react-icons/fa";

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

"""
new_jsx = """  return (
    <div id="MasterClass" className="max-w-[100vw] overflow-x-hidden bg-slate-950 font-sans text-slate-200">
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

        <meta property="og:title" content="Krutanic MasterClass | Upskill in Tech, Coding & AI" />
        <meta property="og:url" content="https://www.krutanic.com/MasterClass" />
        <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png" />
        <meta property="og:description" content="Join Krutanic MasterClass to learn top tech skills from industry leaders. Master coding, data science, AI, and more with hands-on learning and mentorship." />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta property="twitter:title" content="Krutanic MasterClass | Upskill in Tech, Coding & AI" />
        <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png" />
        <meta property="twitter:description" content="Join Krutanic MasterClass to learn top tech skills from industry leaders. Master coding, data science, AI, and more with hands-on learning and mentorship." />

        <link rel="canonical" href="https://www.krutanic.com/MasterClass" />
      </Helmet>

      <Toaster position="top-center" reverseOrder={false} />

      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-20 px-4 md:px-8 lg:px-16 flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">The Clock Is Ticking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 leading-tight">
            Don't Miss Out on Your Chance to Thrive in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Revolution</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl leading-relaxed">
            Master the most in-demand skills in Tech, AI, and Data Science. Secure your future before the industry leaves you behind. 
          </p>

          <button 
            onClick={() => {
              const el = document.getElementById("active-classes");
              if(el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative text-lg flex items-center gap-2">
              Browse Active Masterclasses <FaRocket className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=1" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=2" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-slate-900" src="https://i.pravatar.cc/100?img=3" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-white">+5k</div>
            </div>
            <span>Professionals upskilled this month</span>
          </div>
        </motion.div>
      </section>

      {/* What You Will Learn */}
      <section className="relative w-full py-20 px-4 md:px-8 lg:px-16 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <FaBrain className="text-5xl text-purple-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Here's what you can expect to learn</h2>
            <p className="text-lg text-slate-400">Practical, outcome-driven frameworks designed for career acceleration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Capitalizing on Tech Shifts", desc: "Understand how emerging technologies shape the future and position yourself for massive career growth before it becomes a missed opportunity.", icon: <FaChartLine /> },
              { title: "Advanced Technical Workflows", desc: "Master the exact processes, tools, and coding frameworks used by Tier-1 product companies to build robust applications.", icon: <FaLaptopCode /> },
              { title: "Data-Driven Decision Making", desc: "Gain insights into data analytics, allowing you to scale business operations and significantly boost your earning potential.", icon: <FaBolt /> },
              { title: "High-Value Portfolio Creation", desc: "Acquire the skills needed to build production-ready projects that demonstrate your practical capability to top recruiters.", icon: <FaCheckCircle /> }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="group relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="text-3xl text-cyan-400 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="relative w-full py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <FaUserTie className="text-5xl text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Who is this for?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">If you want to stay relevant, increase your value, and lead in your industry, you need to be here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Tech Enthusiasts & Students", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=80", color: "from-cyan-500/80" },
              { title: "Software Engineers", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80", color: "from-purple-500/80" },
              { title: "Founders & Marketers", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=500&q=80", color: "from-blue-500/80" }
            ].map((role, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/10 group"
              >
                <img src={role.img} alt={role.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className={`absolute inset-0 bg-gradient-to-t ${role.color} via-slate-900/60 to-transparent opacity-90`}></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white tracking-wide">{role.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center max-w-4xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
              <strong className="text-white">Picture this:</strong> In just a few months, you've mastered the exact skills top employers are demanding right now. Your professional value has skyrocketed, you're building production-grade projects effortlessly, and you're at the forefront of the technological wave instead of struggling to catch up.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative w-full py-20 px-4 md:px-8 lg:px-16 bg-slate-900/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-cyan-900/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Don't Just Take Our Word For It</h2>
            <p className="text-lg text-slate-400">Industry leaders are already confirming what we know.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {[
              {
                name: "Santiago", handle: "@svpino",
                text: "AI will not replace you. A person using AI will.",
                date: "6:30 PM · Jan 5, 2023", stats: "782 replies · 7.1K shares",
                glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
                border: "border-cyan-500/30"
              },
              {
                name: "Kunal Shah", handle: "@kunalb11",
                text: "AI as it stands today is likely to wipe out a lot of inefficiency in days to come. Largest employer of the world is inefficiency.",
                date: "2:12 AM · Mar 28, 2023", stats: "97 replies · 186 shares",
                glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                border: "border-purple-500/30"
              },
              {
                name: "Logan.GPT", handle: "@LoganK",
                text: "Perhaps one of the most profound impacts of the current AI boom is the number of new developers it will create. People are realizing just how powerful this technology is.",
                date: "7:38 PM · Apr 17, 2023", stats: "40 replies · 288 likes",
                glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
                border: "border-cyan-500/30"
              },
              {
                name: "Sam Altman", handle: "@sama",
                text: "I think AI is going to be the greatest force for economic empowerment and a lot of people getting rich we have ever seen.",
                date: "11:02 PM · Feb 13, 2023", stats: "1K replies · 10.3K likes",
                glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                border: "border-purple-500/30"
              }
            ].map((tweet, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className={`p-6 rounded-2xl bg-slate-900 border ${tweet.border} ${tweet.glow} transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xl">
                      {tweet.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{tweet.name} <span className="text-cyan-500 ml-1">✓</span></h4>
                      <p className="text-sm text-slate-500">{tweet.handle}</p>
                    </div>
                  </div>
                  <FaTwitter className="text-2xl text-cyan-500/80" />
                </div>
                <p className="text-lg text-slate-200 mb-4">{tweet.text}</p>
                <div className="text-sm text-slate-500 border-t border-slate-800 pt-3 flex justify-between">
                  <span>{tweet.date}</span>
                  <span>{tweet.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold mb-6">
              <FaCertificate /> Industry Recognized
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Rock your brand new certificate on LinkedIn!
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Earn a prestigious internationally recognized certificate upon successfully completing the masterclass, solidifying your professional credibility. Showcase your achievement on your resume and LinkedIn profile, demonstrating your commitment to staying ahead in the industry.
            </p>
            <ul className="space-y-4 mb-10">
              {['Verifiable Credentials', 'Shareable on LinkedIn', 'Lifetime Validity'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <FaCheckCircle className="text-cyan-400 text-xl" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img src={img} alt="Certificate preview" className="relative w-full rounded-2xl border border-white/10 shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ACTIVE CLASSES LISTING */}
      <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 bg-slate-900 border-t border-white/5" id="active-classes">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Live Now & Upcoming
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Secure Your Spot</h2>
            <p className="text-lg text-slate-400">Join our hands-on, expert-led masterclasses before they fill up.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeMasterClasses.map((masterclass) => {
              return (
                <motion.article 
                  whileHover={{ y: -5 }}
                  className="flex flex-col bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-xl w-full max-w-[420px] mx-auto cursor-pointer group"
                  key={masterclass._id}
                  onClick={(e) => {
                    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I" && !e.target.closest("button")) {
                      if (masterclass.status !== "completed") {
                        navigate(`/MasterClass/${slugify(masterclass.title)}`);
                      }
                    }
                  }}
                >
                  <div className="relative overflow-hidden h-[200px]">
                    <img
                      src={convertGoogleDriveUrl(masterclass.image)}
                      alt={masterclass.title}
                      className="w-full h-[200px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-lg border ${
                      masterclass.status === "upcoming"
                        ? "bg-purple-600/80 border-purple-400/50 text-white backdrop-blur-sm"
                        : masterclass.status === "ongoing"
                        ? "bg-cyan-500/80 border-cyan-400/50 text-white backdrop-blur-sm"
                        : "bg-slate-700/80 border-slate-500/50 text-slate-200 backdrop-blur-sm"
                    }`}>
                      {masterclass.status}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-grow justify-between relative z-10 -mt-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5 w-max px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-cyan-400 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                        <i className="fa fa-fire text-orange-400 text-xs"></i>
                        <span>
                          {masterclass.registeredCount 
                            ? masterclass.registeredCount 
                            : ( (95 + (masterclass._id ? [...masterclass._id.toString()].reduce((a, c) => a + c.charCodeAt(0), 0) % 60 : 0)) + (masterclass.applications || 0) )
                          } REGISTERED
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[56px]">
                        {masterclass.title}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="border-t border-white/10 pt-4 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1"><FaRegClock /> Starts On</span>
                        <span className="text-sm font-bold text-slate-300">
                          {new Date(masterclass.start).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })} | {formatClassTimeScaler(masterclass.start, masterclass.duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="flex-grow py-3.5 bg-white/10 hover:bg-cyan-500 text-white text-xs font-bold uppercase rounded-xl text-center transition-all duration-300 tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                          onClick={() =>
                            masterclass.status === "completed"
                              ? handleDownload(masterclass)
                              : navigate(`/MasterClass/${slugify(masterclass.title)}`)
                          }
                        >
                          {masterclass.status === "completed" ? "Get Certificate" : "Secure Spot Now"}
                        </button>
                        <button
                          className="p-3.5 border border-white/10 hover:border-purple-400 hover:bg-purple-500/20 hover:text-purple-400 text-slate-400 rounded-xl transition-all duration-300"
                          onClick={() => handleShare(masterclass)}
                          title="Share Link"
                        >
                          <FaShareAlt />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Completed Classes Catalog */}
      {completedMasterClass.length > 0 && (
          <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 bg-slate-950">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Past Masterclasses</h2>
                <p className="text-lg text-slate-400">Missed a session? You can still catch up.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...completedMasterClass]
                  .reverse()
                  .slice(0, 8)
                  .map((masterclass) => (
                    <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-colors" key={masterclass._id}>
                      <img
                        src={convertGoogleDriveUrl(masterclass.image)}
                        alt={masterclass.title}
                        className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        onError={(e) => (e.target.src = imgalt)}
                      />
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-slate-200 line-clamp-2 mb-2 group-hover:text-cyan-400">{masterclass.title}</h3>
                        <p className="text-[11px] text-slate-500 mb-3">{formatClassDate(masterclass.end)}</p>
                        {masterclass.pdfstatus && (
                          <button 
                            onClick={() => handleDownload(masterclass)}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <FaDownload /> Download Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

      {/* FAQs */}
      <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 bg-slate-900 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-xl bg-slate-950/50 overflow-hidden">
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-200">{faq.question}</span>
                  <span className={`text-cyan-500 transform transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                    <i className="fa fa-plus"></i>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2 text-slate-400 border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative w-full py-24 px-4 md:px-8 lg:px-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-cyan-600/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Are You Ready to Step Up?</h2>
          <p className="text-xl text-slate-400 mb-10">Stop watching others succeed. Start building your own tech legacy today. The next Masterclass is starting soon.</p>
          <button 
            onClick={() => {
              const el = document.getElementById("active-classes");
              if(el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] text-xl tracking-wide"
          >
            Claim Your Spot Now <FaRocket className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Modals - Registration */}
      {isRegisterForm && selectedMasterClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 flex justify-between items-center bg-slate-950 border-b border-white/5">
              <h3 className="font-bold text-white">Register NOW!</h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa fa-close text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-6">{selectedMasterClass.title}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <input
                  type="email"
                  placeholder="Personal Email id"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none"
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="WhatsApp Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transition-all">
                  SUBMIT REGISTRATION
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  <span className="text-cyan-500 font-bold">NOTE:</span> Enter details carefully, they will appear on your certificate.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modals - Download Certificate */}
      {isDownloadForm && selectedMasterClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 flex justify-between items-center bg-slate-950 border-b border-white/5">
              <h3 className="font-bold text-white">Download Certificate</h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa fa-close text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-6">{selectedMasterClass.title}</h3>
              <form onSubmit={downloadCertificate} className="flex flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Personal Email id"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all">
                  DOWNLOAD NOW
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  <span className="text-purple-400 font-bold">NOTE:</span> Please enter the same Email that you used during registration.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MasterClass;
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(top_half + new_jsx)
