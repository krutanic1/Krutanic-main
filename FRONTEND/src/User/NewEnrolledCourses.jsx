import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import UserSidebar from "./UserSidebar";

const NewEnrolledCourses = () => {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const [enrollData, setEnrollData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      setEnrollData(response.data);
      if (response.data && response.data.length > 0) {
        setSelectedCourse(response.data[0].domain);
      }
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (title, sessionlist, startIndex = 0) => {
    navigate("/Learning", {
      state: { courseTitle: title, sessions: sessionlist, startIndex },
    });
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
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

  return (
    <div className="bg-background-light min-h-screen h-screen flex flex-col font-display overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Navigation */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-gray-900">
            <button
              className="p-1 rounded-md hover:bg-gray-100 text-gray-600 lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/Dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Krutanic" className="h-8" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center justify-center rounded-lg h-10 w-10 hover:bg-gray-100 text-gray-700">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link to="/Setting" className="hidden sm:flex items-center justify-center rounded-lg h-10 w-10 hover:bg-gray-100 text-gray-700">
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
          <div className="relative group cursor-pointer">
            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold text-lg border-2 border-white shadow-sm">
              {userData?.fullname?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar */}
        <UserSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background-light relative">
          {selectedCourse ? (
            <div className="max-w-5xl mx-auto p-6 md:p-8 pb-20">
              {/* Course Detail Header */}
              <div className="flex flex-col gap-6 mb-10">
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
                      onClick={() => handleStartLearning(selectedCourse.title, selectedCourse.session)}
                      className="bg-primary hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm shadow-primary/30 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">play_arrow</span> DEMO
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
                            className={`grid grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center transition-colors group cursor-pointer ${
                              isFirst ? "bg-primary/5" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className={`col-span-1 font-bold ${isFirst ? "text-primary" : "text-gray-500"}`}>
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div
                              className={`col-span-7 md:col-span-8 font-medium capitalize ${
                                isFirst
                                  ? "text-primary"
                                  : "text-gray-900 group-hover:text-primary transition-colors"
                              }`}
                            >
                              {selectedCourse.session[key].title || key}
                            </div>
                            <div className="col-span-4 md:col-span-3 flex justify-end">
                              <button
                                onClick={() =>
                                  handleStartLearning(selectedCourse.title, selectedCourse.session, index)
                                }
                                className={`transition-transform hover:scale-110 ${
                                  isFirst ? "text-primary" : "text-primary/70 hover:text-primary"
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
        </main>
      </div>
    </div>
  );
};

export default NewEnrolledCourses;
