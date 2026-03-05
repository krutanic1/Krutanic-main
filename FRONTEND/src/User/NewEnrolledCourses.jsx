import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";


const NewEnrolledCourses = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const isAdvance = localStorage.getItem("advance") === "true";
  const [enrollData, setEnrollData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API}/users`, { params: { userId } });
      setUserData(response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  const fetchEnrollData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/enrollments`, { params: { userEmail } });
      const mapped = response.data.map(e => {
        const price = e.programPrice || 0;
        const paid = e.paidAmount || 0;
        const remaining = price - paid;
        const isFullyPaid = remaining <= 0;
        return {
          ...e,
          isFullyPaid,
          domain: { ...e.domain, progressStats: e.progressStats, _enrollmentId: e._id }
        };
      });
      setEnrollData(mapped);
      if (mapped && mapped.length > 0) {
        const first = mapped[0];
        if (!first.domain?.session || Object.keys(first.domain.session).length === 0) {
          try {
            const sessionRes = await axios.get(`${API}/enrollments/${first._id}/sessions`);
            first.domain.session = sessionRes.data.session;
          } catch (err) {
            console.warn("Could not fetch sessions for initial course", err);
          }
        }
        setSelectedCourse({ ...first.domain, isFullyPaid: first.isFullyPaid });
      }
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (title, sessionlist, enrollmentId, isFullyPaid, startIndex = 0) => {
    navigate("/Learning", {
      replace: true,
      state: { courseTitle: title, sessions: sessionlist, startIndex, thumbnail: getThumbnail(title) || selectedCourse?.thumbnail, enrollmentId, isFullyPaid },
    });
  };

  const handleCourseClick = async (enrollment) => {
    const course = enrollment.domain;
    if (!course.session || Object.keys(course.session).length === 0) {
      try {
        const sessionRes = await axios.get(`${API}/enrollments/${enrollment._id}/sessions`);
        course.session = sessionRes.data.session;
      } catch (err) {
        console.warn("Could not fetch sessions for selected course", err);
      }
    }
    setSelectedCourse({ ...course, isFullyPaid: enrollment.isFullyPaid });
  };

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/Login");
    }, 1500);
  };

  useEffect(() => {
    fetchEnrollData();
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

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
    "UI/UX Design": "UI & UX Design.jpg",
    "Graphic Design": "Graphic Designing.jpg",
    "Stock Market": "Stock Marketing.jpg",
    "Trading": "Stock Marketing.jpg",
    "Psychology": "Psychology.jpg",
    "Robotics": "IOT & Robotics.jpg",
    "IoT": "IOT & Robotics.jpg",
    "Internet of Things": "IOT & Robotics.jpg",
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
    <div className="bg-background-light min-h-screen h-screen flex flex-col font-display overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Navigation - Removed */}

      {/* Main Layout */}
      <div className="flex flex-1 h-full overflow-hidden">

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background-light relative">
          {selectedCourse ? (
            <div className="max-w-5xl mx-auto p-6 md:p-8 pb-20">
              {/* Course Detail Header */}
              <div className="flex flex-col gap-6 mb-10">
                {(selectedCourse.thumbnail || getThumbnail(selectedCourse.title)) && (
                  <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={getThumbnail(selectedCourse.title) || selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-full h-full object-fill"
                    />
                  </div>
                )}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                        {selectedCourse.title?.split(" ")[0] || "Course"}
                      </span>
                      <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {selectedCourse.session ? Object.keys(selectedCourse.session).length : 0} Sessions
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {selectedCourse.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          K
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Instructor: <span className="text-gray-900 font-medium">Krutanic Team</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleStartLearning(selectedCourse.title, selectedCourse.session, selectedCourse._enrollmentId, selectedCourse.isFullyPaid)}
                      className="bg-primary hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-primary/30 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">play_arrow</span> {selectedCourse.isFullyPaid ? "START LEARNING" : "WATCH DEMO"}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">About this course</h4>
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {selectedCourse.description || "No description available for this course."}
                  </p>
                  {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedCourse.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-900 text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum Table */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
                  <span className="text-sm text-gray-500">
                    {selectedCourse.session ? Object.keys(selectedCourse.session).length : 0} Sessions
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7 md:col-span-8">Session Title</div>
                    <div className="col-span-4 md:col-span-3 text-right">Action</div>
                  </div>
                  {/* Table Body */}
                  <div className="divide-y divide-gray-100">
                    {selectedCourse.session &&
                      Object.keys(selectedCourse.session).map((key, index) => {
                        const isFirst = index === 0;

                        return (
                          <div
                            key={key}
                            className={`grid grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center transition-colors group cursor-pointer ${isFirst ? "bg-primary/5" : "hover:bg-gray-50"
                              }`}
                          >
                            <div className={`col-span-1 font-bold ${isFirst ? "text-primary" : "text-gray-500"}`}>
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div
                              className={`col-span-7 md:col-span-8 font-medium capitalize ${isFirst
                                ? "text-primary"
                                : "text-gray-900 group-hover:text-primary transition-colors"
                                }`}
                            >
                              {!selectedCourse.isFullyPaid && !isFirst ? "Session Locked" : (selectedCourse.session[key].title || key)}
                            </div>
                            <div className="col-span-4 md:col-span-3 flex justify-end">
                              <button
                                onClick={() =>
                                  handleStartLearning(selectedCourse.title, selectedCourse.session, selectedCourse._enrollmentId, selectedCourse.isFullyPaid, index)
                                }
                                className={`transition-transform hover:scale-110 ${isFirst ? "text-primary" : "text-primary/70 hover:text-primary"
                                  }`}
                              >
                                <span className="material-symbols-outlined">play_circle</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <span className="material-symbols-outlined text-5xl mb-3">school</span>
                <p className="text-lg font-medium">Select a course to view details</p>
              </div>
            </div>
          )}
          {/* Footer */}
          <footer className="mt-16 py-6 text-center text-gray-600 text-sm border-t border-gray-200">
            © 2026 All Rights Reserved. Powered by Krutanic.
          </footer>        </main>
      </div>
    </div>
  );
};

export default NewEnrolledCourses;
