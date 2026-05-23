import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import debounce from "lodash/debounce";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";

const NewDashboard = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const [enrollData, setenrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showTraining, setShowTraining] = useState(false);
  const [userData, setUserData] = useState(null);
  const hasFetched = useRef(false);
  const [componentsAccess, setComponentsAccess] = useState({
    atschecker: false,
    jobboard: false,
    myjob: false,
    mockinterview: false,
    exercise: false,
  });

  const fetchUserData = async () => {
    if (!userId) {
      console.log("User not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/users`, { params: { userId } });
      setUserData(response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  const fetchComponentsAccess = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API}/user-components`, {
        params: { userId },
      });
      setComponentsAccess(response.data.components);
    } catch (err) {
      console.error("Failed to fetch components access:", err);
    }
  };

  const fetchenrollData = debounce(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/enrollments`, { params: { userEmail } });
      setenrollData(response.data);
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSubmit = async (data) => {
    if (!window.confirm("Are you sure your internship is complete? If not, please cancel. If it's complete, click 'ok' to proceed.")) {
      return;
    }
    if (!window.confirm("Do you really want to apply for your certificate?")) {
      return;
    }

    const name = data.fullname
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const email = data.email;
    const domain = data.domain.title;

    try {
      const response = await axios.post(`${API}/applycertificate`, {
        name,
        email,
        domain,
      });
      toast.success("Certificate Apply successfully!");
      fethCertificate();
    } catch (error) {
      console.error("Error adding certificate:", error.response?.data?.error || "Server error");
      toast.error("Failed to apply, or you have already applied.");
    }
  };

  const fethCertificate = async () => {
    try {
      const response = await axios.get(`${API}/getcertificate`, {
        params: { email: userEmail },
      });
      setCertificate(response.data);
    } catch (error) {
      console.error("There was an error fetching certificate:", error);
    }
  };

  /* Helper to generate Training Certificate URL */
  const getTrainingCertUrl = () => {
    if (!selectedCertificate) return "";
    let finalOutput = selectedCertificate.domain + " on " + new Date(selectedCertificate.startdate).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(selectedCertificate.name)}/fl_layer_apply,y_20/co_rgb:000000,l_text:times%20new%20roman_25_bold_normal_left:${encodeURIComponent(finalOutput)}/fl_layer_apply,y_225/training_certificate_demo_vknkst`;
  };

  /* Helper to add to LinkedIn */
  const addLinkedin = (data, isTraining = false) => {
    let year = new Date(data.date).toLocaleDateString("en-US", { year: "numeric" });
    let month = new Date(data.date).toLocaleDateString("en-US", { month: "numeric" });
    let certUrl = isTraining ? getTrainingCertUrl() : data.url;
    let certName = isTraining ? `Training Certificate - ${data.domain}` : data.domain;

    let linkurl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=Krutanic&issueYear=${year}&issueMonth=${month}&certUrl=${certUrl}&certId=${data._id}`;
    window.open(linkurl, "_blank");
  };

  /* Download Internship Certificate via Proxy */
  const downloadInternshipCertificate = () => {
    // Use backend proxy to force download and avoid CORS issues
    const proxyUrl = `${API}/download-proxy?url=${encodeURIComponent(selectedCertificate.url)}`;
    window.open(proxyUrl, "_self"); // Trigger download in same tab
    toast.success("Download started...");
  };

  /* Removed old trainingCertificateDownload function as it's replaced or unused for direct download now */

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/Login");
    }, 1500);
  };

  /* Read watched count from localStorage for a given enrollment, merging with backend progress */
  const getWatchedCount = (enrollmentId, sessionlist, dbWatchedSessions = []) => {
    try {
      const key = `krutanic_progress_${enrollmentId}`;
      const raw = localStorage.getItem(key);
      const localWatched = raw ? JSON.parse(raw) : [];

      // Combine unique keys from both sources
      const combined = new Set([...localWatched, ...(dbWatchedSessions || [])]);
      const sessionKeys = sessionlist ? Object.keys(sessionlist) : [];
      return sessionKeys.filter((k) => combined.has(k)).length;
    } catch {
      return 0;
    }
  };

  const handleStartLearning = (id, title, sessionlist, thumbnail, isFullyPaid) => {
    navigate("/Learning", {
      state: { courseTitle: title, sessions: sessionlist, thumbnail, enrollmentId: id, isFullyPaid },
    });
  };

  const handleStartLearningClick = async (item) => {
    const isFullyPaid = (item.programPrice - item.paidAmount) <= 0;
    let sessionData = item.domain?.session;
    try {
      if (!sessionData || Object.keys(sessionData).length === 0) {
        setLoading(true);
        const res = await axios.get(`${API}/enrollments/${item._id}/sessions`);
        sessionData = res.data.session || {};
        setLoading(false);
      }
    } catch (error) {
      console.warn("Could not fetch sessions for Start Learning", error);
      setLoading(false);
    }

    handleStartLearning(
      item._id,
      item.domain?.title,
      sessionData,
      getThumbnail(item.domain?.title) || item.domain?.thumbnail || item.domain?.image,
      isFullyPaid
    );
  };

  const handleRestrictedClick = (path, hasAccess) => {
    if (!hasAccess) {
      toast.error("Upgrade the plan to access this feature");
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchenrollData();
    fethCertificate();
    fetchUserData();
    fetchComponentsAccess();
  }, []);

  // Thumbnail Mapping
  const courseThumbnails = {
    "Full Stack Web Development": "Full Stack Web.jpg",
    "Data Science": "Data Science.jpg",
    "Digital Marketing": "Digital Marketing.jpg",
    "Business Analytics": "Business Analytics.jpg",
    "Data Analytics": "Data Analytics.jpg",
    "Human Resource": "Human Resource.jpg",
    "HR": "Human Resource.jpg",
    "Finance": "FinTech.jpg",
    "FinTech": "FinTech.jpg",
    "Investment Banking": "FinTech.jpg",
    "Operations": "Supply Chain.jpg",
    "Supply Chain Management": "Supply Chain.jpg",
    "Product Management": "Business Analytics.jpg",
    "Artificial Intelligence": "Artificial Intelligence.jpg",
    "Machine Learning": "Machine Learning.jpg",
    "Cyber Security": "Cyber Security.jpg",
    "Ethical Hacking": "Cyber Security.jpg",
    "Cloud Computing": "Cloud Computing.jpg",
    "AWS": "Cloud Computing.jpg",
    "Azure": "Cloud Computing.jpg",
    "DevOps": "DevOps.jpg",
    "Android Development": "Android App.jpg",
    "App Development": "Android App.jpg",
    "Web Development": "Full Stack Web.jpg",
    "Full Stack": "Full Stack Web.jpg",
    "MERN": "Full Stack Web.jpg",
    "UI/UX Design": "ui-ux-design.jpg",
    "Graphic Design": "Graphic Designing.jpg",
    "Stock Market": "Stock Marketing.jpg",
    "Trading": "Stock Marketing.jpg",
    "Psychology": "Psychology.jpg",
    "Robotics": "iot-robotics.jpg",
    "IoT": "iot-robotics.jpg",
    "Internet of Things": "iot-robotics.jpg",
    "Embedded Systems": "Embedded System.jpg",
    "Genetics": "Nano Technology &  Genetic.jpg",
    "Nano Technology": "Nano Technology &  Genetic.jpg",
    "AutoCAD": "Auto Cad.jpg",
  };

  const getThumbnail = (title) => {
    if (!title) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";

    const key = Object.keys(courseThumbnails).find(k => title.toLowerCase().includes(k.toLowerCase()));
    if (key) {
      return new URL(`./thumnails/${courseThumbnails[key]}`, import.meta.url).href;
    }

    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
  };


  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-orange-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <span className="material-symbols-outlined text-white text-2xl">verified</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Certificate of Completion</h3>
                  <p className="text-white/80 text-sm">{selectedCertificate.domain}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Toggle: Internship / Training */}
            <div className="flex justify-center py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-0 bg-gray-200 rounded-full p-1">
                <button
                  onClick={() => setShowTraining(false)}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${!showTraining
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  🎓 Internship
                </button>
                <button
                  onClick={() => setShowTraining(true)}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${showTraining
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  📘 Training
                </button>
              </div>
            </div>

            {/* Certificate Image */}
            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src={showTraining ? getTrainingCertUrl() : selectedCertificate.url}
                  alt="Certificate"
                  className="w-full object-contain"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 bg-white border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left side - Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">business</span>
                    <span>Issued by <strong className="text-gray-900">KRUTANIC</strong></span>
                  </div>
                  <a
                    className="text-primary hover:text-orange-600 flex items-center gap-1 font-medium transition-colors"
                    href={showTraining ? getTrainingCertUrl() : selectedCertificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                    View Full Size
                  </a>
                </div>

                {/* Right side - Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="bg-[#0077B5] hover:bg-[#006097] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    onClick={() => addLinkedin(selectedCertificate, showTraining)}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    {showTraining ? 'Add Training to LinkedIn' : 'Add Internship to LinkedIn'}
                  </button>
                  <button
                    className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    onClick={() => {
                      if (showTraining) {
                        const trainingUrl = getTrainingCertUrl();
                        const proxyUrl = `${API}/download-proxy?url=${encodeURIComponent(trainingUrl)}`;
                        window.open(proxyUrl, '_self');
                        toast.success('Download started...');
                      } else {
                        downloadInternshipCertificate();
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar - Removed as it's in UserLayout */}

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-background-light p-4 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Page Header & Stats */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">My Dashboard</h1>
                  <p className="text-gray-500">Track your progress and manage your courses</p>
                </div>
                <div className="block sm:hidden">
                  <Link to="/Setting" className="w-full flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white border border-gray-200 text-gray-900 text-sm font-medium shadow-sm">
                    Change Password
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-8xl text-primary">menu_book</span>
                  </div>
                  <p className="text-gray-500 font-medium text-sm mb-2 z-10">Enrolled Courses</p>
                  <p className="text-gray-900 text-4xl font-bold z-10">{enrollData.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-8xl text-primary">play_circle</span>
                  </div>
                  <p className="text-gray-500 font-medium text-sm mb-2 z-10">Active Courses</p>
                  <p className="text-gray-900 text-4xl font-bold z-10">{enrollData.filter((item) => item.status === "fullPaid").length}</p>
                </div>
                <button
                  onClick={() => navigate("/resume-builder")}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group text-left hover:shadow-md transition-shadow"
                >
                  <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-8xl text-primary">edit_document</span>
                  </div>
                  <p className="text-gray-500 font-medium text-sm mb-2 z-10">Resume Builder</p>
                  <p className="text-gray-900 text-lg font-bold z-10 leading-tight">Create and download your ATS-friendly resume</p>
                </button>
              </div>
            </div>

            {/* Course Cards Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">school</span>
                  Current Courses
                </h2>
                <Link to="/EnrolledCourses" className="text-primary text-sm font-medium hover:underline">View All</Link>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {enrollData.map((item, index) => {
                    // Check if fully paid: explicit status OR 0 remaining
                    // Note: accessing programPrice/paidAmount, handling potential undefineds with default 0
                    const price = item.programPrice || 0;
                    const paid = item.paidAmount || 0;
                    const remaining = price - paid;
                    const isFullyPaid = remaining <= 0;

                    return (
                      <div key={index} className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative ${!isFullyPaid ? '' : ''}`}>
                        {!isFullyPaid && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">Payment Pending</div>
                        )}
                        <div className="p-5 flex flex-col md:flex-row gap-6">
                          <div className={`w-full md:w-80 aspect-video shrink-0 rounded-lg overflow-hidden ${!isFullyPaid ? 'grayscale' : ''}`}>
                            <img
                              src={getThumbnail(item.domain?.title) || item.domain?.thumbnail || item.domain?.image}
                              alt={item.domain?.title}
                              className="w-full h-full object-fill"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-2 mb-2">
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-medium">{item.domain?.category || "Course"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                <span>4.5</span>
                                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              </div>
                            </div>
                            <h3 className="text-gray-900 text-lg font-bold leading-tight mb-2">{item.domain?.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.domain?.description?.substring(0, 100) || "Master the skills in this comprehensive course."}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                <span>Opted: {item.monthOpted}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">play_lesson</span>
                                <span>{item.progressStats ? item.progressStats.totalSessionsCount : Object.keys(item.domain?.session || {}).length} Sessions</span>
                              </div>
                            </div>
                            <div className="mt-8 flex flex-wrap gap-3">
                              <button
                                onClick={() => handleStartLearningClick(item)}
                                className="flex-1 min-w-[140px] bg-primary hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                                {isFullyPaid ? "Start Learning" : "Watch Demo"}
                              </button>
                              {isFullyPaid && (
                                <button
                                  onClick={() => handleSubmit(item)}
                                  className="flex-1 min-w-[140px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                                  Certificate
                                </button>
                              )}
                              {!isFullyPaid && (
                                <a
                                  href="https://smartpay.easebuzz.in/219610/Krutanic"
                                  target="_blank"
                                  className="flex-1 min-w-[140px] bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                  Pay ₹{remaining}
                                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Certificates Section */}
            <section className="pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  Certificates
                </h2>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <th className="p-4 font-semibold">Certificate Name</th>
                        <th className="p-4 font-semibold">Date Applied</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {certificate ? (
                        <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="size-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[20px]">code</span>
                            </div>
                            {certificate.domain}
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(certificate.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-4">
                            {certificate.delivered ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                <span className="size-1.5 rounded-full bg-green-500"></span>
                                Issued
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {certificate.delivered ? (
                              <button
                                onClick={() => { setShowTraining(false); setSelectedCertificate(certificate); }}
                                className="text-primary hover:text-orange-700 font-medium inline-flex items-center gap-1"
                              >
                                View
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 cursor-not-allowed flex items-center justify-end gap-1">
                                View
                                <span className="material-symbols-outlined text-[16px]">lock</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">workspace_premium</span>
                            <p>No certificate applications found.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
