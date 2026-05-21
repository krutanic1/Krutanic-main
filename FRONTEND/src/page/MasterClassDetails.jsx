import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  BookOpen, 
  ShieldAlert, 
  Sparkles,
  Play,
  Heart,
  TrendingUp,
  XCircle,
  HelpCircle,
  PhoneCall
} from "lucide-react";

const MasterClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [masterclass, setMasterclass] = useState(null);
  const [relatedClasses, setRelatedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    field: "",
    gradYear: "",
    whatsappUpdates: true
  });

  // Fetch MasterClass details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/masterclass/by-slug-or-id/${id}`);
        if (response.data) {
          setMasterclass(response.data.masterclass);
          setRelatedClasses(response.data.related || []);
        } else {
          setMasterclass(null);
        }
      } catch (err) {
        console.error("Error fetching masterclass details:", err);
        setMasterclass(null);
        toast.error("Failed to load masterclass details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Countdown timer logic
  useEffect(() => {
    if (!masterclass?.start) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(masterclass.start) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [masterclass]);

  // Sticky CTA scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (!formRef.current) return;
      const formPosition = formRef.current.getBoundingClientRect().top;
      // Show sticky CTA on mobile if user scrolled past the form
      setShowStickyCta(formPosition < 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#030712] min-h-screen text-white animate-pulse">
        {/* Announcement bar skeleton */}
        <div className="h-10 bg-white/[0.04] w-full" />

        {/* Hero skeleton */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="h-5 w-36 bg-white/[0.06] rounded-full" />
            <div className="h-12 w-4/5 bg-white/[0.08] rounded-xl" />
            <div className="h-12 w-3/5 bg-white/[0.06] rounded-xl" />
            <div className="h-4 w-full bg-white/[0.05] rounded-lg" />
            <div className="h-4 w-5/6 bg-white/[0.04] rounded-lg" />
            <div className="grid grid-cols-4 gap-4 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-9 h-9 rounded-full bg-white/[0.06]" />
              <div className="w-9 h-9 rounded-full bg-white/[0.06]" />
              <div className="w-9 h-9 rounded-full bg-white/[0.06]" />
              <div className="h-4 w-40 bg-white/[0.05] rounded-lg ml-2" />
            </div>
          </div>
          {/* Right — form card */}
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-5">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
                ))}
              </div>
              <div className="h-5 w-48 bg-white/[0.06] rounded-lg mx-auto" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-11 bg-white/[0.04] rounded-xl border border-white/[0.06]" />
              ))}
              <div className="h-12 bg-[#ff6b2d]/20 rounded-xl border border-[#ff6b2d]/20" />
            </div>
          </div>
        </section>

        {/* Trust bar skeleton */}
        <div className="border-y border-white/[0.06] py-6">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 items-center">
                <div className="h-8 w-24 bg-white/[0.06] rounded-lg" />
                <div className="h-3 w-32 bg-white/[0.04] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (!masterclass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-white px-4">
        <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2">Masterclass Not Found</h2>
        <p className="text-slate-450 mb-6 text-center max-w-md">
          The masterclass session you are looking for may have been removed or rescheduled.
        </p>
        <Link to="/MasterClass" className="px-6 py-3 bg-[#ff6b2d] rounded-full font-bold hover:bg-[#e0561f] transition-all">
          View All Masterclasses
        </Link>
      </div>
    );
  }

  // Fallback / auto-generated data builder for maximum premium detailing
  const getTailoredContent = () => {
    const title = (masterclass.title || "").toLowerCase();
    
    // Parse helper
    const safeParseJson = (str, fallback) => {
      if (!str) return fallback;
      if (typeof str !== "string") return Array.isArray(str) ? str : fallback;
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch (e) {
        return fallback;
      }
    };

    // Helper for splitting strings to arrays
    const safeSplit = (val, fallback) => {
      if (!val) return fallback;
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        return val.split(",").map(item => item.trim()).filter(Boolean);
      }
      return fallback;
    };

    // Default general fallbacks
    const defaultSubheading = "Accelerate your career path with industry-recognized frameworks, hands-on tutorials, and live Q&A with top mentors.";
    const defaultWhyAttend = "Are you feeling stuck in your learning journey without a clear roadmap? Most self-learners get lost in random video tutorials, struggle to build real-world projects, and remain anxious about technical interviews. This masterclass cuts through the noise, providing a structured, step-by-step framework to land high-paying roles.";

    // We build the primary data directly from database fields
    let data = {
      subheading: masterclass.subheading || defaultSubheading,
      duration: masterclass.duration || "90 Minutes",
      venue: masterclass.venue || "Online Live Session",
      registeredCount: masterclass.registeredCount || ( (95 + (masterclass._id ? [...masterclass._id.toString()].reduce((a, c) => a + c.charCodeAt(0), 0) % 60 : 0)) + (masterclass.applications ? masterclass.applications.length : 0) ),
      rating: masterclass.rating || "4.8",
      level: masterclass.level || "Intermediate to Advanced Level",
      price: masterclass.price ,
      language: masterclass.language || "English",
      certificateAvailable: masterclass.certificateAvailable || "Yes, Industry Recognized",
      
      instructorName: masterclass.instructorName || "Industry Lead Mentor",
      instructorLinkedIn: masterclass.instructorLinkedIn || "",
      instructorDesignation: masterclass.instructorDesignation || "Senior Technical Advisor",
      instructorExpertise: masterclass.instructorExpertise || "Technology Expert",
      instructorCredibility: masterclass.instructorCredibility || "Successfully trained and mentored professionals globally.",
      instructorExperience: masterclass.instructorExperience || "5+ Years",
      instructorLearnersMentored: masterclass.instructorLearnersMentored || "5,000+",
      instructorRating: masterclass.instructorRating || "4.9",
      instructorSessions: masterclass.instructorSessions || "40+ Live Classes",
      instructorCompanyTags: safeSplit(masterclass.instructorCompanyTags, ["Industry Mentor"]),
      instructorPhoto: masterclass.instructorPhoto || masterclass.image,

      whyAttend: masterclass.whyAttend || defaultWhyAttend,
      whoShouldAttend: safeSplit(masterclass.whoShouldAttend, ["Students & Freshers looking for direction", "Working professionals aiming for a transition", "Self-learners seeking industry-level validation"]),
      before: safeSplit(masterclass.transformationBefore, ["Confused by random tutorial loops", "No portfolio to display key skills", "Fearing mock technical interviews", "Unsure of exact career roadmaps"]),
      after: safeSplit(masterclass.transformationAfter, ["Equipped with a solid structured roadmap", "Built a deployable production-grade project", "Confident in clearing tech hiring rounds", "Clear, step-by-step career actionable plan"]),
      
      takeaways: safeParseJson(masterclass.whatYouWillLearn, []),
      faqs: safeParseJson(masterclass.faqs, [])
    };

    // ONLY if database fields are missing, do we apply category-specific tailored fallbacks
    if (title.includes("automation") || title.includes("testing") || title.includes("qa")) {
      if (!masterclass.instructorName) data.instructorName = "Abhijeet Gupta";
      if (!masterclass.instructorDesignation) data.instructorDesignation = "Project Engineer at WIPRO";
      if (!masterclass.instructorCredibility) data.instructorCredibility = "Successfully trained and mentored over 5,000+ QA professionals globally.";
      if (!masterclass.instructorCompanyTags) data.instructorCompanyTags = ["WIPRO", "QA Specialist", "Automation Advocate"];
      
      if (data.takeaways.length === 0) {
        data.takeaways = [
          { title: "Test Automation Architecture", desc: "Understand how to build scalable, maintainable Page Object Model (POM) frameworks using Selenium and Java/Python." },
          { title: "API Testing Fundamentals", desc: "Master API verification using Postman and RestAssured, automating end-to-end user journeys." },
          { title: "DevOps & CI/CD Pipeline", desc: "Integrate your automated suites with Jenkins, GitHub Actions, and get instant feedback loops." },
          { title: "Industry QA Best Practices", desc: "Learn real-world defect logging, test metrics, and standard software quality benchmarks." }
        ];
      }
    } else if (title.includes("datascience") || title.includes("data science") || title.includes("data analytics") || title.includes("analytics") || title.includes("sql")) {
      if (!masterclass.instructorName) data.instructorName = "Dr. Amit Verma";
      if (!masterclass.instructorDesignation) data.instructorDesignation = "Senior Data Scientist (Ex-Amazon)";
      if (!masterclass.instructorCredibility) data.instructorCredibility = "Led data intelligence models for heavy logistics at Amazon. Mentored 8,000+ students.";
      if (!masterclass.instructorExperience) data.instructorExperience = "8+ Years";
      if (!masterclass.instructorLearnersMentored) data.instructorLearnersMentored = "8,000+";
      if (!masterclass.instructorCompanyTags) data.instructorCompanyTags = ["Ex-Amazon", "Data Scientist", "IIT Alumnus"];

      if (data.takeaways.length === 0) {
        data.takeaways = [
          { title: "Machine Learning Pipelines", desc: "Learn regression, decision trees, and validation steps to train real-world prediction engines." },
          { title: "SQL & Pandas Data Manipulation", desc: "Clean, filter, and extract high-value insights from messy multi-million row datasets." },
          { title: "Business Metrics Dashboards", desc: "Build interactive visual storytelling metrics using PowerBI / Tableau that executives love." },
          { title: "Cracking Data Interviews", desc: "Study the exact case studies and coding questions asked in Amazon and Google screening rounds." }
        ];
      }
    } else if (title.includes("mern") || title.includes("full stack") || title.includes("web") || title.includes("react") || title.includes("node")) {
      if (!masterclass.instructorName) data.instructorName = "Sandeep Kumar";
      if (!masterclass.instructorDesignation) data.instructorDesignation = "Lead Tech Architect (Ex-Google)";
      if (!masterclass.instructorCredibility) data.instructorCredibility = "Built scalable cloud microservices serving millions of active users. Passionate tech educator.";
      if (!masterclass.instructorExperience) data.instructorExperience = "7+ Years";
      if (!masterclass.instructorLearnersMentored) data.instructorLearnersMentored = "10,000+";
      if (!masterclass.instructorCompanyTags) data.instructorCompanyTags = ["Ex-Google", "MERN Expert", "System Architect"];

      if (data.takeaways.length === 0) {
        data.takeaways = [
          { title: "React State & Design Patterns", desc: "Design elegant state architectures with clean rendering optimization and custom hooks." },
          { title: "Node.js REST API Architecture", desc: "Structure robust endpoints, middleware, authentication, and error handlers from scratch." },
          { title: "MongoDB Modeling & Queries", desc: "Model non-relational database structures for speed and consistency, avoiding common pitfalls." },
          { title: "Production Cloud Deployment", desc: "Deploy MERN applications securely to AWS/Vercel with automated GitHub integration." }
        ];
      }
    } else if (title.includes("product") || title.includes("management") || title.includes("pm")) {
      if (!masterclass.instructorName) data.instructorName = "Neha Sharma";
      if (!masterclass.instructorDesignation) data.instructorDesignation = "Product Manager (Ex-Microsoft)";
      if (!masterclass.instructorCredibility) data.instructorCredibility = "Shipped premium product features at Microsoft. Mentored 4,000+ aspiring product leads.";
      if (!masterclass.instructorExperience) data.instructorExperience = "6+ Years";
      if (!masterclass.instructorLearnersMentored) data.instructorLearnersMentored = "4,000+";
      if (!masterclass.instructorCompanyTags) data.instructorCompanyTags = ["Ex-Microsoft", "PM Mentor", "B-School Speaker"];

      if (data.takeaways.length === 0) {
        data.takeaways = [
          { title: "PRDs & Feature Mapping", desc: "Learn to write crisp, comprehensive Product Requirement Documents and outline feature sets." },
          { title: "User Research & Prototyping", desc: "Conduct qualitative user research and build high-fidelity interactive wireframes." },
          { title: "Retention Funnels & Metrics", desc: "Analyze North Star metrics, cohort retention, and identify growth friction points." },
          { title: "PM Case Interview Mastery", desc: "Understand product-sense and execution questions commonly asked by Tier-1 product tech companies." }
        ];
      }
    }

    // Default general takeaways if still empty
    if (data.takeaways.length === 0) {
      data.takeaways = [
        { title: "Industry Production Standards", desc: "Learn how professional engineering teams structure repositories, run tests, and code clean." },
        { title: "System Design Essentials", desc: "Grasp load balancing, microservices, and database selection for high-traffic platforms." },
        { title: "Data Structures & Algorithms", desc: "Build correct mental models for optimizing complex algorithm performance and runtime." },
        { title: "Modern Tech Career Pathways", desc: "Deconstruct the current tech landscape to identify highest-paying skill demand areas." }
      ];
    }

    // Default FAQs if still empty
    if (data.faqs.length === 0) {
      data.faqs = [
        { q: "Is this masterclass really free?", a: "Yes, this masterclass is 100% free of charge. Our mission at Krutanic is to make top-tier industry knowledge and mentorship accessible to everyone." },
        { q: "Will I get a certificate for attending?", a: "Yes! All participants who attend the live session will receive an official digital Certificate of Completion from Krutanic." },
        { q: "Will there be a recording provided?", a: "The recording will only be available to registered members. We highly recommend attending live so you can participate in the live Q&A session with the instructor." },
        { q: "Who can attend this session?", a: "Any student, fresher, self-learner, or working professional interested in upskilling, mastering automation, development, or tech roles is welcome to join." },
        { q: "How will I receive the joining link?", a: "After registration, you will get instant access to our WhatsApp community group. The live joining link will be sent to your email and shared in the community group before the event starts." },
        { q: "Is there a Q&A session?", a: "Yes, the last 20-30 minutes of the live session are entirely dedicated to a live interactive Q&A session with our mentor to clear your career/tech doubts." }
      ];
    }

    return data;
  };

  const info = getTailoredContent();

  // Converts any Google Drive share link to an embeddable image URL
  const convertGoogleDriveUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    const trimmed = url.trim();
    // Already correct lh3 format — return as-is
    if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;
    // /file/d/FILE_ID/...
    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/?&#]+)/);
    if (fileMatch) {
      return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
    }
    // ?id=FILE_ID or &id=FILE_ID (covers uc?export=view, open?id=, thumbnail?id=)
    const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
    if (idMatch && trimmed.includes("drive.google.com")) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return trimmed;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API}/masterclassapply/${masterclass._id}`,
        {
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          experience: formData.experience || "0-2",
          field: formData.field,
          gradYear: formData.gradYear
        }
      );
      
      toast.success("Successfully registered for the MasterClass!");
      setSuccess(true);
      
      // Auto-redirect to WhatsApp group link after 3 seconds
      setTimeout(() => {
        window.open(masterclass.link, "_blank");
      }, 3000);
    } catch (error) {
      console.error("Error registering:", error);
      toast.error(
        error.response?.data?.message || "There was an error while submitting your registration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: masterclass.title,
        text: `Check out this live masterclass: ${masterclass.title} on Krutanic!`,
        url: shareUrl
      }).catch(err => console.error(err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const formatEventDate = (dateVal) => {
    return new Date(dateVal).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatEventTime = (dateVal) => {
    return new Date(dateVal).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="bg-[#030712] text-slate-100 font-sans min-h-screen selection:bg-[#ff6b2d] selection:text-white relative overflow-x-hidden">
      <Helmet>
        <title>{`${masterclass.title} | Free Live Masterclass | Krutanic`}</title>
        <meta name="description" content={info.subheading} />
        <link rel="canonical" href={`https://www.krutanic.com/MasterClass/${masterclass._id}`} />
      </Helmet>
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Announcement Bar - Gradient Mesh */}
      <div className="bg-gradient-to-r from-[#ff6b2d] via-indigo-600 to-[#14b8a6] py-2.5 px-4 text-center text-xs md:text-sm font-bold text-white sticky top-0 z-50 shadow-[0_4px_25px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2">
        <Sparkles size={16} className="animate-pulse" />
        <span className="tracking-wide">🔥 SCARCITY WARNING: Limited Spots! Live Interactive Q&A.</span>
        <button onClick={scrollToForm} className="underline hover:text-gray-200 transition ml-2 font-black uppercase tracking-wider">Register Free &rarr;</button>
      </div>

      {/* Hero Section with Glowing Mesh Gradients */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-white/[0.06] bg-[#030712]">
        {/* Glow meshes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent blur-[160px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#ff6b2d]/8 to-pink-600/5 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/[0.04] border border-white/[0.1] text-[#ff7d45] uppercase tracking-widest mb-6 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  Live Event Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-display tracking-tight">
                  Mastering <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b2d] via-[#ff8c2d] to-indigo-400">{masterclass.title}</span>
                </h1>
                <p className="mt-5 text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                  {info.subheading}
                </p>
              </div>

              {/* Event Metadata Chips - Glassmorphism */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Start Date</span>
                  <span className="text-white text-sm font-extrabold mt-1 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#ff6b2d]" />
                    {new Date(masterclass.start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Start Time</span>
                  <span className="text-white text-sm font-extrabold mt-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#ff6b2d]" />
                    {formatEventTime(masterclass.start)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Duration</span>
                  <span className="text-white text-sm font-extrabold mt-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#ff6b2d]" />
                    {info.duration}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Venue</span>
                  <span className="text-emerald-400 text-sm font-extrabold mt-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-400 animate-bounce" />
                    Live Webcast
                  </span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 flex-wrap mt-2">
                <div className="flex -space-x-3">
                  <img className="w-9 h-9 rounded-full border-2 border-[#030712]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030712]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030712]" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030712]" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-200 font-extrabold text-sm">{info.registeredCount} Professionals Registered</span>
                  <span className="text-slate-400 text-xs">Selling out fast • Limited seats available</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs font-semibold shadow-md">
                  <span className="text-yellow-500 font-bold">★ {info.rating}</span>
                  <span className="text-slate-400">({info.level})</span>
                </div>
              </div>
            </div>

            {/* Hero Right Content: Neon Glass Registration Form Card */}
            <div className="lg:col-span-5" ref={formRef}>
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 md:p-8 relative overflow-hidden group">
                
                {/* Neon Top Line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff6b2d] via-indigo-500 to-[#14b8a6]"></div>

                {/* Free Badge */}
                <div className="absolute -top-1.5 right-6 bg-[#ff6b2d] text-white text-xs font-black uppercase py-1 px-3.5 rounded-full tracking-wider shadow-lg">
                  {info.price }
                </div>

                {/* Countdown Timer Wrapper */}
                <div className="mb-6 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Live Session Starts In</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 flex flex-col justify-center shadow-inner">
                      <span className="text-white text-xl font-black">{timeLeft.days}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Days</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 flex flex-col justify-center shadow-inner">
                      <span className="text-white text-xl font-black">{timeLeft.hours}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Hrs</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 flex flex-col justify-center shadow-inner">
                      <span className="text-white text-xl font-black">{timeLeft.minutes}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Min</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 flex flex-col justify-center shadow-inner">
                      <span className="text-[#ff6b2d] text-xl font-black">{timeLeft.seconds}</span>
                      <span className="text-slate-500 text-[10px] uppercase font-bold mt-0.5">Sec</span>
                    </div>
                  </div>
                </div>

                {/* Success Registration State */}
                {success ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                      <CheckCircle size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
                    <p className="text-slate-450 text-sm mb-6 max-w-sm">
                      We have secured your free seat. You are now being redirected to the WhatsApp community group to receive the live link.
                    </p>
                    <a
                      href={masterclass.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg"
                    >
                      Join WhatsApp Group Now
                      <ArrowRight size={18} />
                    </a>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-white mb-4 text-center">Secure Your Free Spot Now</h3>
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="phone"
                          placeholder="WhatsApp Number"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          name="experience"
                          required
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-3 text-slate-400 text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        >
                          <option value="" className="bg-[#030712]">Years of Experience</option>
                          <option value="student" className="bg-[#030712]">Student / Fresher</option>
                          <option value="0-2" className="bg-[#030712]">Professional (0-2 Yrs)</option>
                          <option value="2-5" className="bg-[#030712]">Professional (2-5 Yrs)</option>
                          <option value="5+" className="bg-[#030712]">Professional (5+ Yrs)</option>
                        </select>
                        <input
                          type="text"
                          name="field" 
                          placeholder="Current Role"
                          
                          required
                          value={formData.field}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        />
                      </div>
                      {/* <div>
                        <input
                          type="text"
                          name="gradYear"
                          placeholder="Graduation Year"
                          value={formData.gradYear}
                          onChange={handleInputChange}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#ff6b2d] focus:bg-white/[0.05] focus:ring-2 focus:ring-[#ff6b2d]/25 transition-all"
                        />
                      </div> */}
                      
                      <div className="flex items-start gap-2.5 mt-1">
                        <input
                          type="checkbox"
                          name="whatsappUpdates"
                          id="whatsappUpdates"
                          checked={formData.whatsappUpdates}
                          onChange={handleInputChange}
                          className="mt-1 accent-[#ff6b2d] rounded"
                        />
                        <label htmlFor="whatsappUpdates" className="text-slate-400 text-xs leading-snug cursor-pointer select-none">
                          Yes, send me class links, updates, and learning materials on WhatsApp.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-[#ff6b2d] to-[#ff8c2d] text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,107,45,0.4)] transition-all flex items-center justify-center gap-2 text-sm md:text-base mt-2 hover:scale-[1.02] active:scale-[0.98] transform font-display uppercase tracking-wider"
                      >
                        {submitting ? "Processing..." : "Register for Free Now"}
                        <ArrowRight size={18} />
                      </button>

                      <p className="text-center text-[10px] text-slate-500 leading-normal">
                        *Note: We limit entries to ensure high-quality live server streaming. Joining link will also be dispatched to your registered email ID.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sticky Topbar Nav */}
      <div className="bg-[#030712]/75 backdrop-blur-xl border-b border-white/[0.06] py-4 px-4 sticky top-[38px] z-40 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-white font-extrabold text-xl tracking-wider font-display flex items-center gap-1.5">
            <span className="text-[#ff6b2d]">KRUTANIC</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/Mentorship" className="hover:text-white transition">Programs</Link>
            <Link to="/MasterClass" className="text-white hover:text-white transition flex items-center gap-1">
              Masterclasses <span className="w-1.5 h-1.5 bg-[#ff6b2d] rounded-full"></span>
            </Link>
            <Link to="/Alumni" className="hover:text-white transition">Success Stories</Link>
            <Link to="/ContactUs" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition text-slate-400 hover:text-white">
              <Share2 size={18} />
            </button>
            <button onClick={scrollToForm} className="px-5 py-2.5 bg-gradient-to-r from-[#ff6b2d] to-[#ff8c2d] hover:shadow-[0_0_20px_rgba(255,107,45,0.3)] rounded-xl text-xs font-bold text-white transition-all">
              Register Free
            </button>
          </div>
        </div>
      </div>

      {/* Trust Metrics Strip */}
      <div className="border-b border-white/[0.06] bg-white/[0.01] py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black text-[#ff6b2d]">20,000+</span>
              <span className="text-slate-400 text-xs md:text-sm font-semibold">Active Global Learners</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black text-white">400+</span>
              <span className="text-slate-400 text-xs md:text-sm font-semibold">Live Events Conducted</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black text-white">94%</span>
              <span className="text-slate-400 text-xs md:text-sm font-semibold">Career Transition Rate</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black text-emerald-400">100%</span>
              <span className="text-slate-400 text-xs md:text-sm font-semibold">Practical & Hands-On</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Landing Details */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-16 flex flex-col gap-24">
        
        {/* Why Attend / Problem Statement Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold text-[#ff6b2d] uppercase tracking-widest block mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff6b2d] rounded-full animate-ping"></span> The Real Challenge
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
              Why most self-learners fail to make it in tech
            </h2>
            <p className="text-slate-450 mt-5 text-sm md:text-base leading-relaxed">
              Standard coding videos show you how to type lines, but completely miss how to scale structures, resolve architecture constraints, and think like a senior engineer. We build roadmaps that get results.
            </p>
          </div>
          <div className="lg:col-span-7 bg-white/[0.01] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff6b2d] rounded"></span>
              What this Live Session Solves for you
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <XCircle size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Unstructured Learning</h4>
                  <p className="text-slate-450 text-xs mt-1 leading-normal">Stop jumping from one random YouTube video to another without progress.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <XCircle size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Lack of Real-world Build</h4>
                  <p className="text-slate-455 text-xs mt-1 leading-normal">Theoretical tutorials don't help you build actual production-ready software.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Live Mentor Guidance</h4>
                  <p className="text-slate-455 text-xs mt-1 leading-normal">Clear doubts instantly during live session rather than waiting for forums.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold">Complete Interview Prep</h4>
                  <p className="text-slate-455 text-xs mt-1 leading-normal">Get the specific blueprint to tackle technical panel screenings.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Instructor Credentials Section */}
        <section className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-600/5 blur-[120px] rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Instructor Left Image & Company Tags */}
            <div className="lg:col-span-4 flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff6b2d]/20 blur-2xl rounded-full scale-95 animate-pulse"></div>
                <img 
                  className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white/[0.08] shadow-2xl relative z-10" 
                  src={convertGoogleDriveUrl(info.instructorPhoto)} 
                  alt={info.instructorName} 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80" }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{info.instructorName}</h3>
                <p className="text-[#ff6b2d] text-xs font-semibold mt-1 uppercase tracking-widest">{info.instructorDesignation}</p>
                
                {info.instructorLinkedIn && (
                  <div className="mt-4 flex justify-center w-full">
                    <a href={info.instructorLinkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-transparent hover:bg-[#0077b5]/10 border border-[#0077b5] rounded-full text-xs font-bold text-[#0077b5] transition-all">
                      <i className="fa fa-linkedin-square text-[16px]"></i> Connect on LinkedIn
                    </a>
                  </div>
                )}
                
                {/* Company Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-3.5">
                  {info.instructorCompanyTags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[10px] font-bold text-slate-300">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor Right Stats & Text */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Meet Your Mentor</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
                  Learn from someone who has been there, done that
                </h2>
                <p className="text-slate-300 mt-4 text-sm md:text-base leading-relaxed">
                  {info.instructorCredibility} Work directly with an expert who understands the hurdles of building and deploying modern architecture and is active in top-tier industry projects.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-center shadow-inner">
                  <span className="block text-2xl font-black text-[#ff6b2d]">{info.instructorExperience}</span>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold mt-1.5">Exp Years</span>
                </div>
                <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-center shadow-inner">
                  <span className="block text-2xl font-black text-white">{info.instructorLearnersMentored}</span>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold mt-1.5">Mentored</span>
                </div>
                <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-center shadow-inner">
                  <span className="block text-2xl font-black text-white">{info.instructorSessions}</span>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold mt-1.5">Live Classes</span>
                </div>
                <div className="bg-[#030712] border border-white/[0.06] rounded-2xl p-4 text-center shadow-inner">
                  <span className="block text-2xl font-black text-emerald-400">★ {info.instructorRating}</span>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold mt-1.5">Rating</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#ff6b2d] uppercase tracking-widest block mb-2">Curriculum Highlights</span>
            <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">
              4 Takeaway strategies you will master in this session
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              We skip generic introductions and dive straight into implementation schemas, optimizations, and architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {info.takeaways.map((takeaway, idx) => (
              <div key={idx} className="bg-white/[0.01] backdrop-blur-md border border-white/[0.05] hover:border-[#ff6b2d]/50 hover:bg-white/[0.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-3xl p-6 transition-all duration-300 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b2d]/10 to-[#ff8c2d]/15 border border-[#ff6b2d]/25 text-[#ff7d45] flex items-center justify-center flex-shrink-0">
                  <span className="font-extrabold text-sm">0{idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-white text-base font-extrabold">{takeaway.title}</h3>
                  <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">{takeaway.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who Should Attend Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold text-[#ff6b2d] uppercase tracking-widest block mb-2">Target Audience</span>
            <h2 className="text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
              Is this session designed for you?
            </h2>
            <p className="text-slate-400 mt-4 text-sm md:text-base leading-relaxed">
              Whether you are struggling to build structured applications or transitioning from non-technical departments, this masterclass meets your requirements.
            </p>
            <div className="mt-6 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.06] flex gap-3">
              <Sparkles className="text-[#ff6b2d] flex-shrink-0 animate-spin" size={20} style={{ animationDuration: '4s' }} />
              <p className="text-xs text-slate-300 leading-normal">
                <strong>Our Commitment:</strong> We ensure everything taught is directly mapped to current job requirements in top tier companies.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {info.whoShouldAttend.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-r from-[#0c0f24]/50 to-transparent border border-white/[0.06] rounded-2xl p-4 flex gap-3 items-center shadow-md">
                <CheckCircle size={18} className="text-[#ff6b2d] flex-shrink-0" />
                <span className="text-slate-200 text-xs font-bold">{item.trim()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Masterclass Outcome / Before vs After Transformation */}
        <section className="flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#ff6b2d] uppercase tracking-widest block mb-2">Real Value & Outcomes</span>
            <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">
              The Path to Transformation
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              We align our sessions to deliver immediate, noticeable changes in your engineering mindset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before Card */}
            <div className="bg-gradient-to-br from-red-950/10 to-red-900/5 border border-red-500/10 rounded-3xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-red-500 mb-6 flex items-center gap-2">
                <ShieldAlert size={20} />
                Before Attending
              </h3>
              <ul className="flex flex-col gap-4">
                {info.before.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs md:text-sm text-slate-400 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After Card */}
            <div className="bg-gradient-to-br from-emerald-950/10 to-emerald-900/5 border border-emerald-500/15 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none"></div>
              <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <CheckCircle size={20} />
                After Attending
              </h3>
              <ul className="flex flex-col gap-4">
                {info.after.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs md:text-sm text-white leading-relaxed font-bold">
                    <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Polished Grid / Event Info grid */}
        <section className="bg-white/[0.01] border border-white/[0.05] backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center font-display">Event Details Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border-b sm:border-b-0 sm:border-r border-white/[0.08] pb-4 sm:pb-0 sm:pr-6 flex flex-col gap-1">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Date & Time</span>
              <span className="text-white text-sm font-bold mt-1">{formatEventDate(masterclass.start)}</span>
              <span className="text-slate-400 text-xs">{formatEventTime(masterclass.start)} IST</span>
            </div>
            <div className="border-b sm:border-b-0 sm:border-r border-white/[0.08] pb-4 sm:pb-0 sm:pr-6 flex flex-col gap-1">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Price & Certification</span>
              <span className="text-[#ff6b2d] text-sm font-bold mt-1">{info.price || "100% Free Session"}</span>
              <span className="text-slate-400 text-xs">Certificate Available for Live Attendees</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Format & Language</span>
              <span className="text-white text-sm font-bold mt-1">Live Online Webcast</span>
              <span className="text-slate-400 text-xs">Delivered in {info.language}</span>
            </div>
          </div>
        </section>

        {/* Urgency CTA banner section */}
        <section className="bg-gradient-to-r from-[#ff6b2d] via-indigo-600 to-[#14b8a6] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 blur-xl rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-xl rounded-full"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-5 items-center">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider">
              Free Live Stream Event
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight font-display">
              Ready to take the next step in your career journey?
            </h2>
            <p className="text-white/95 text-sm md:text-base leading-relaxed">
              Don't miss out on this high-value interactive session. Claim your seat now, ask your doubts live, and secure your industry certificate.
            </p>
            <button 
              onClick={scrollToForm}
              className="mt-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-extrabold rounded-xl transition shadow-[0_4px_30px_rgba(255,255,255,0.2)] flex items-center gap-2 hover:scale-[1.02] transform"
            >
              Register for Free Now
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
          <div className="text-center">
            <span className="text-xs font-bold text-[#ff6b2d] uppercase tracking-widest block mb-2">FAQs</span>
            <h2 className="text-3xl font-extrabold text-white font-display">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-4">
            {info.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white/[0.01] border border-white/[0.05] hover:border-white/[0.09] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm md:text-base text-slate-100 hover:text-[#ff7d45] transition"
                  >
                    <span>{faq.q || faq.question}</span>
                    {isOpen ? <ChevronUp size={18} className="text-[#ff6b2d]" /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-350 text-xs md:text-sm leading-relaxed border-t border-white/[0.05] pt-4 bg-white/[0.01]">
                      {faq.a || faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Masterclasses */}
        {relatedClasses.length > 0 && (
          <section className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white font-display">
                Other Upcoming Masterclasses
              </h2>
              <p className="text-slate-500 text-xs mt-1">Explore other fields and continue upskilling.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedClasses.map((item) => (
                <div key={item._id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#ff6b2d]/55 hover:shadow-2xl transition flex flex-col h-100">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-40 object-cover" 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" }}
                    />
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-blue-600 tracking-wider uppercase">
                      {item.status}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                    <div>
                      <h3 className="text-white text-sm font-bold line-clamp-2 leading-tight">{item.title}</h3>
                      <p className="text-slate-555 text-[10px] mt-1.5">
                        {new Date(item.start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/MasterClass/${item.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-")}`)}
                      className="w-full py-2 bg-[#030712] border border-white/[0.08] hover:border-[#ff6b2d] rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      Learn More
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Mobile CTA */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#030712]/95 border-t border-white/[0.06] p-4 z-40 md:hidden flex items-center justify-between backdrop-blur-md animate-slide-up shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Online Session</span>
            <span className="text-[#ff6b2d] text-xs font-extrabold">100% Free Seats</span>
          </div>
          <button 
            onClick={scrollToForm}
            className="px-6 py-3 bg-[#ff6b2d] hover:bg-[#e0561f] text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-1.5"
          >
            Register Free
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
};

export default MasterClassDetails;
