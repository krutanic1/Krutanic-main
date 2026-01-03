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
    exercise: false,
  });

  const fetchUserData = async () => {
    if (!userId) return;
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

  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchUserData();
    fetchComponentsAccess();
  }, []);

  const menuItems = [
    { path: "/Dashboard", label: "Home", icon: "home", restricted: false },
    { path: "/EnrolledCourses", label: "Enrolled Courses", icon: "menu_book", restricted: false },
    { path: "/JobBoard", label: "Job Board", icon: "work", restricted: true, access: "jobboard" },
    { path: "/MyJob", label: "My Job", icon: "person", restricted: true, access: "myjob" },
    { path: "/MockInterview", label: "Mock Prep", icon: "assignment", restricted: true, access: "mockinterview" },
    { path: "/Exercise", label: "Exercise Prep", icon: "edit_note", restricted: true, access: "exercise" },
    { path: "/ResumeATS", label: "ATS Checker", icon: "fact_check", restricted: true, access: "atschecker" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-100 ${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col shrink-0 overflow-y-auto fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto pt-16 lg:pt-0`}>
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
              const hasAccess = item.restricted ? componentsAccess[item.access] : true;
              
              if (item.restricted) {
                return (
                  <button
                    key={item.path}
                    onClick={() => handleRestrictedClick(item.path, hasAccess)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full text-left ${
                      active
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

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    active
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
          <Link to="/Setting" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group mb-1 ${
            isActive("/Setting") ? "bg-primary/10 text-primary border-r-4 border-primary/50" : "hover:bg-gray-50 text-gray-600"
          }`}>
            <span className={`material-symbols-outlined ${isActive("/Setting") ? 'fill-icon text-primary' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>settings</span>
            <p className={`text-sm leading-normal ${isActive("/Setting") ? 'font-bold' : 'font-medium'}`}>Setting</p>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors group w-full">
            <span className="material-symbols-outlined text-red-400 group-hover:text-red-600 transition-colors">logout</span>
            <p className="text-sm font-medium leading-normal">LogOut</p>
          </button>
        </div>
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
