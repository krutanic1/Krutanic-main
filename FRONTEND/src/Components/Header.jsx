import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo3 from "../assets/LOGO3.png";
import AdvancedApplyPopup from "./AdvancedApplyPopup";
import { Rocket, ChevronDown, ChevronRight, MonitorPlay, Settings, Briefcase, HeartPulse } from "lucide-react";

const programsCategories = [
  {
    name: "Computer Science",
    icon: <MonitorPlay size={16} className="text-slate-500" />,
    courses: [
      { label: "Full Stack Web Development", to: "/MernStack" },
      { label: "Artificial Intelligence", to: "/mentorship/artificial-intelligence" },
      { label: "Data Science", to: "/DataScience" },
      { label: "Cyber Security", to: "/mentorship/cyber-security" },
      { label: "Cloud Computing", to: "/mentorship/cloud-computing" },
      { label: "Android App Development", to: "/mentorship/android-app-development" },
      { label: "UI/UX Design", to: "/UIUXDesign" },
      { label: "DevOps", to: "/mentorship/devops" },
      { label: "Machine Learning", to: "/mentorship/machine-learning" }
    ]
  },
  {
    name: "Management",
    icon: <Briefcase size={16} className="text-slate-500" />,
    courses: [
      { label: "Digital Marketing", to: "/DigitalMarket" },
      { label: "Business Analytics", to: "/mentorship/business-analytics" },
      { label: "Finance", to: "/mentorship/finance" },
      { label: "Human Resource", to: "/mentorship/human-resource" },
      { label: "Stock Marketing", to: "/mentorship/stock-marketing" },
      { label: "Product Management", to: "/ProductManagement" }
    ]
  },
  {
    name: "Electronics/Electrical",
    icon: <Settings size={16} className="text-slate-500" />,
    courses: [
      { label: "Embedded Systems", to: "/mentorship/embedded-systems" },
      { label: "VLSI Design", to: "/mentorship/vlsi-design" },
      { label: "IOT & Robotics", to: "/mentorship/iot-robotics" }
    ]
  },
  {
    name: "Mechanical",
    icon: <Settings size={16} className="text-slate-500" />,
    courses: [
      { label: "Auto CAD", to: "/mentorship/auto-cad" },
      { label: "Graphics Design", to: "/mentorship/graphics-design" }
    ]
  },
  {
    name: "Medical",
    icon: <HeartPulse size={16} className="text-slate-500" />,
    courses: [
      { label: "Psychology", to: "/mentorship/psychology" }
    ]
  }
];

const topNav = [
  { label: "Our Courses", to: "/Mentorship", categories: programsCategories },
  { label: "Advanced Program", to: "/Advance" },
  { label: "Alumni", to: "/Alumni" },
  { label: "Refer and Earn", to: "/ReferAndEarn" }
];

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#ececf5] bg-white/95 backdrop-blur-md">
        <div ref={menuRef} className="mx-auto flex w-[94%] max-w-7xl items-center justify-between gap-3 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo3} alt="Krutanic" className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex relative">
            {topNav.map((item) => {
              if (item.categories) {
                return (
                  <div key={item.to} className="relative group">
                    <Link
                      to={item.to}
                      className={`flex items-center gap-1 rounded-lg px-2 xl:px-3 py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.02em] transition-colors hover:bg-[#f2f4ff] whitespace-nowrap ${location.pathname.toLowerCase() === item.to.toLowerCase() ? "text-[#f15b29] text-shine" : "text-[#1f2937]"}`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                    </Link>
                    
                    {/* Primary Dropdown Menu (Categories) */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left group-hover:translate-y-0 translate-y-2 z-50">
                      <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-2 min-w-[260px] flex flex-col gap-1">
                        {item.categories.map((cat, idx) => (
                          <div key={idx} className="relative group/category">
                            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 border border-slate-200">
                                  {cat.icon}
                                </span>
                                <span className="text-sm font-medium">{cat.name}</span>
                              </div>
                              <ChevronRight size={14} className="text-slate-400 group-hover/category:text-[#f15b29]" />
                            </div>
                            
                            {/* Nested Dropdown Menu (Courses) */}
                            <div className="absolute top-0 left-full pl-2 opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible transition-all duration-300 transform origin-top-left group-hover/category:translate-x-0 translate-x-2 z-50">
                              <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 p-2 min-w-[280px] max-h-[400px] overflow-y-auto flex flex-col gap-1">
                                {cat.courses.map((course, cIdx) => (
                                  <Link 
                                    key={cIdx} 
                                    to={course.to}
                                    className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-[#f15b29] text-sm font-medium"
                                  >
                                    {course.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-2 xl:px-3 py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.02em] transition-colors hover:bg-[#f2f4ff] whitespace-nowrap ${location.pathname.toLowerCase() === item.to.toLowerCase() ? "text-[#f15b29] text-shine" : "text-[#1f2937]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/MasterClass"
              className="ml-1 xl:ml-2 rounded-2xl bg-gradient-to-r from-[#ff8a00] to-[#ff3d00] px-3 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold uppercase text-white shadow-[0_8px_20px_rgba(255,107,45,0.28)] whitespace-nowrap flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Rocket size={16} className="text-white" />
              Masterclass
            </Link>
            <Link to="/login" className="ml-1 xl:ml-2 rounded-2xl bg-[#ff6b2d] px-3 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold uppercase text-white shadow-[0_8px_20px_rgba(255,107,45,0.28)] whitespace-nowrap">
              Login
            </Link>
            <button
              onClick={() => setShowPopup(true)}
              className="ml-1 xl:ml-2 rounded-2xl border-2 border-[#ff6b2d] text-[#ff6b2d] hover:bg-[#ff6b2d] hover:text-white px-3 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold uppercase transition-all whitespace-nowrap"
            >
              Request a Callback
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="rounded-lg border border-[#dbe0f3] px-3 py-2 text-[#0f172a] lg:hidden"
            aria-label="Toggle menu"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>

        {isMobileOpen && (
          <div className="border-t border-[#ececf5] bg-white lg:hidden">
            <div className="mx-auto grid w-[94%] max-w-7xl gap-2 py-3">
              {topNav.map((item) => {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-3 py-2 text-sm font-medium uppercase ${location.pathname.toLowerCase() === item.to.toLowerCase() ? "text-[#f15b29] text-shine" : "text-[#1f2937]"} hover:bg-[#f5f7ff]`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 p-2 mt-2 border-t border-slate-100">
                <Link to="/MasterClass" className="rounded-xl bg-gradient-to-r from-[#ff8a00] to-[#ff3d00] px-3 py-2 text-center text-sm font-semibold uppercase text-white flex items-center justify-center gap-2 shadow-md">
                  <Rocket size={16} className="text-white" />
                  Masterclass
                </Link>
                <Link to="/login" className="rounded-xl bg-[#ff6b2d] px-3 py-2 text-center text-sm font-semibold uppercase text-white">
                  Login
                </Link>
                <button
                  onClick={() => setShowPopup(true)}
                  className="rounded-xl border-2 border-[#ff6b2d] text-[#ff6b2d] px-3 py-2 text-center text-sm font-semibold uppercase hover:bg-[#ff6b2d] hover:text-white transition-all"
                >
                  Request a Callback
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {showPopup && <AdvancedApplyPopup onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Header;
