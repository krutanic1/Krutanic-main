import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo3 from "../assets/LOGO3.png";
import AdvancedApplyPopup from "./AdvancedApplyPopup";

const topNav = [
  { label: "Mentorship Program", to: "/Mentorship" },
  { label: "Advanced Program", to: "/Advance" },
  { label: "Alumni", to: "/Alumni" },
  { label: "Masterclass", to: "/MasterClass" },
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

          <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
            {topNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-2 xl:px-3 py-2 text-xs xl:text-sm font-semibold uppercase tracking-[0.02em] transition-colors hover:bg-[#f2f4ff] ${location.pathname.toLowerCase() === item.to.toLowerCase() ? "text-[#f15b29]" : "text-[#1f2937]"}`}
              >
                {item.label}
              </Link>
            ))}
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
              {topNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium uppercase ${location.pathname.toLowerCase() === item.to.toLowerCase() ? "text-[#f15b29]" : "text-[#1f2937]"} hover:bg-[#f5f7ff]`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 p-2">
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
