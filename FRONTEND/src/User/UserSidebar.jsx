import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const UserSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  const hasFetched = useRef(false);
  const [componentsAccess, setComponentsAccess] = useState({
    atschecker: false,
    jobboard: false,
    myjob: false,
    mockinterview: false,
    exercise: false
  });

  const [courseName, setCourseName] = useState("");
  const [userProgram, setUserProgram] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isFullyPaid, setIsFullyPaid] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API}/users`, { params: { userId } });
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const fetchEnrollmentData = async () => {
    if (!localStorage.getItem("userEmail")) return;
    try {
      const response = await axios.get(`${API}/enrollments`, {
        params: { userEmail: localStorage.getItem("userEmail") },
      });
      if (response.data && response.data.length > 0) {
        setCourseName(response.data[0].domain?.title || "");
        setUserProgram(response.data[0].program || "");
        setEnrollmentDate(response.data[0].createdAt);
        setPaymentStatus(response.data[0].status || "");

        // Global payment check
        const allPaid = response.data.every(e => (e.programPrice - e.paidAmount) <= 0);
        setIsFullyPaid(allPaid);
      }
    } catch (error) {
      console.error("Error fetching enrollment data for sidebar:", error);
    }
  };

  const fetchComponentsAccess = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API}/user-components`, {
        params: { userId },
      });
      if (response.data && response.data.components) {
        setComponentsAccess(response.data.components);
      }
    } catch (err) {
      console.error("Failed to fetch components access:", err);
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

  const handleRestrictedClick = (path, hasAccess) => {
    if (!hasAccess) {
      toast.error("Upgrade the plan to access this feature");
    } else {
      navigate(path);
    }
  };

  const handleUpgradeClick = () => {
    const phoneNumber = "7829102936";
    const name = userData?.fullname || "Student";
    const email = userData?.email || "No Email";
    const course = courseName || "Course";

    const message = `Hello, I want to upgrade to pro.\nName: ${name}\nEmail: ${email}\nCourse: ${course}`;
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    let isCancelled = false;
    setLoading(true);

    // Fallback timeout to ensure loading state is cleared after 8 seconds
    const fallbackTimeout = setTimeout(() => {
      if (!isCancelled) {
        setLoading(false);
      }
    }, 8000);

    Promise.all([fetchUserData(), fetchComponentsAccess(), fetchEnrollmentData()])
      .catch((err) => {
        if (!isCancelled) {
          console.error("Error fetching sidebar data:", err);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          clearTimeout(fallbackTimeout);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const menuItems = [
    { path: "/Dashboard", label: "Home", icon: "home", restricted: false },
    { path: "/EnrolledCourses", label: "Enrolled Courses", icon: "menu_book", restricted: false },
    { path: "/resume-builder", label: "Resume Builder", icon: "edit_document", restricted: false },
    // { path: "/JobBoard", label: "Job Board", icon: "work", restricted: true, access: "jobboard" },
    { path: "/MyJob", label: "My Job", icon: "person", restricted: true, access: "myjob" },
    { path: "/MockInterview", label: "Mock Prep", icon: "assignment", restricted: true, access: "mockinterview" },
    { path: "/Exercise", label: "Exercise Prep", icon: "edit_note", restricted: true, access: "exercise" },
    { path: "/ResumeATS", label: "ATS Checker", icon: "fact_check", restricted: true, access: "atschecker" },
    { path: "/events", label: "Join Events", icon: "celebration", restricted: false },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-100 ${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col shrink-0 overflow-y-auto fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto pt-16 lg:pt-0`}>
        {loading && !userData ? (
          /* Skeleton Loader - Only show if absolutely no data and loading */
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl animate-pulse">
              <div className="bg-gray-200 rounded-full size-12 shrink-0"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse">
                  <div className="size-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-2">
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : (<>
          <div className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-6 p-3 bg-background-light rounded-xl">
              <div className="bg-primary/20 rounded-full size-12 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {userData?.fullname?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-gray-900 text-sm font-bold leading-normal truncate capitalize">{userData?.fullname || "Student"}</h1>
                <p className="text-gray-500 text-xs font-normal leading-normal truncate">{userData?.email || ""}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const active = isActive(item.path);

                let hasAccess = item.restricted ? componentsAccess[item.access] : true;

                // Automatic unlock for Career Advancement after 1 month AND full payment
                if (item.restricted && !hasAccess && userProgram?.includes("Career Advancement") && enrollmentDate && paymentStatus === "fullPaid") {
                  const joinedDate = new Date(enrollmentDate);
                  const currentDate = new Date();
                  const diffTime = Math.abs(currentDate - joinedDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 30) {
                    hasAccess = true;
                  }
                }

                if (item.restricted) {
                  return (
                    <button
                      key={item.path}
                      title={!hasAccess ? "Upgrade to Pro" : ""}
                      onClick={() => handleRestrictedClick(item.path, hasAccess)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left ${active
                        ? "bg-primary/10 text-primary border-r-4 border-primary/50"
                        : `hover:bg-gray-50 text-gray-600 ${!hasAccess ? 'opacity-50' : ''}`
                        }`}
                    >
                      <span className={`material-symbols-outlined ${active ? 'fill-icon text-primary' : 'text-gray-400 group-hover:text-primary'} transition-colors`}>
                        {item.icon}
                      </span>
                      <p className={`text-sm leading-normal ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                    </button>
                  );
                }

                if (item.path === "/EnrolledCourses" && !isFullyPaid) {
                  return (
                    <button
                      key={item.path}
                      onClick={() => toast.error("Complete your payment to access Enrolled Courses")}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left hover:bg-gray-50 text-gray-600 opacity-50`}
                      title="Complete your payment to access this feature"
                    >
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                        {item.icon}
                      </span>
                      <p className="text-sm leading-normal font-medium">{item.label}</p>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${active
                      ? "bg-primary/10 text-primary border-r-4 border-primary/50"
                      : "hover:bg-gray-50 text-gray-600"
                      }`}
                  >
                    <span className={`material-symbols-outlined ${active ? 'fill-icon text-primary' : 'text-gray-400 group-hover:text-primary'} transition-colors`}>
                      {item.icon}
                    </span>
                    <p className={`text-sm leading-normal ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-auto p-6 pt-2 border-t border-gray-100">
            {!userProgram?.includes("Career Advancement") && (
              <button
                onClick={handleUpgradeClick}
                className="btn-shine w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg mb-4 hover:opacity-90 transition-opacity group"
              >
                <span className="material-symbols-outlined text-white">rocket_launch</span>
                <p className="text-sm font-bold leading-normal text-white">Upgrade to Pro</p>
              </button>
            )}

            <Link to="/Setting" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isActive("/Setting") ? "bg-primary/10 text-primary border-r-4 border-primary/50" : "hover:bg-gray-50 text-gray-600"
              }`}>
              <span className={`material-symbols-outlined ${isActive("/Setting") ? 'fill-icon text-primary' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>settings</span>
              <p className={`text-sm leading-normal ${isActive("/Setting") ? 'font-bold' : 'font-medium'}`}>Setting</p>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors group w-full">
              <span className="material-symbols-outlined text-red-400 group-hover:text-red-600 transition-colors">logout</span>
              <p className="text-sm font-medium leading-normal">LogOut</p>
            </button>
          </div>
        </>)}
      </aside>


      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserSidebar;
