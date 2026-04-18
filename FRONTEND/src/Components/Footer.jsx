import React from "react";
import { Link } from "react-router-dom";
import Razorpay from "../assets/Razorpay.png";
import Easebuzz from "../assets/easebuzz.jpeg";
import logo from "../assets/LOGO3.png";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaLinkedinIn, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const exploreLinks = [
    { label: "Home", to: "/" },
    { label: "Programs", to: "/Advance" },
    { label: "Mentorship", to: "/Mentorship" },
    { label: "Masterclass", to: "/MasterClass" },
  ];

  const supportLinks = [
    { label: "Events", to: "/events" },
    { label: "Contact Us", to: "/ContactUs" },
    { label: "About Us", to: "/AboutUs" },
    { label: "Career", to: "/Career" },
  ];

  return (
    <footer className="bg-white text-gray-600 pt-20 pb-10 px-6 sm:px-12 font-sans border-t border-gray-100 relative overflow-hidden mt-10">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#F15B29] rounded-full mix-blend-multiply filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto align-top">
        
        {/* Top Contact Cards Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20 relative z-10">
          <a href="mailto:support@krutanic.com" className="bg-white hover:bg-orange-50/30 border border-gray-100/80 hover:border-orange-100 rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 transition-all duration-300 group flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(241,91,41,0.06)] hover:-translate-y-1">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F15B29] group-hover:scale-110 group-hover:bg-[#F15B29] group-hover:text-white transition-all duration-300 mb-2 sm:mb-4 shadow-sm border border-orange-100/50">
              <FaEnvelope className="text-[16px] sm:text-[20px]" />
            </div>
            <h3 className="text-gray-900 font-bold tracking-wide mb-0.5 sm:mb-1 text-[13px] sm:text-[16px]">Email Us</h3>
            <p className="text-[10px] sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium break-all">support@krutanic.com</p>
          </a>

          <a href="tel:+917829104024" className="bg-white hover:bg-orange-50/30 border border-gray-100/80 hover:border-orange-100 rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 transition-all duration-300 group flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(241,91,41,0.06)] hover:-translate-y-1">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F15B29] group-hover:scale-110 group-hover:bg-[#F15B29] group-hover:text-white transition-all duration-300 mb-2 sm:mb-4 shadow-sm border border-orange-100/50">
              <FaPhoneAlt className="text-[15px] sm:text-[18px]" />
            </div>
            <h3 className="text-gray-900 font-bold tracking-wide mb-0.5 sm:mb-1 text-[13px] sm:text-[16px]">Call Us</h3>
            <p className="text-[10px] sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium">+91 7829104024</p>
          </a>

          <a href="https://wa.me/7829104024" target="_blank" rel="noreferrer" className="bg-white hover:bg-green-50/30 border border-gray-100/80 hover:border-green-100 rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 transition-all duration-300 group flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.06)] hover:-translate-y-1">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 mb-2 sm:mb-4 shadow-sm border border-green-100/50">
              <FaWhatsapp className="text-[18px] sm:text-[22px]" />
            </div>
            <h3 className="text-gray-900 font-bold tracking-wide mb-0.5 sm:mb-1 text-[13px] sm:text-[16px]">WhatsApp</h3>
            <p className="text-[10px] sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium">Instant Support</p>
          </a>

          <a href="https://maps.google.com/?q=Bengaluru,Karnataka" target="_blank" rel="noreferrer" className="bg-white hover:bg-orange-50/30 border border-gray-100/80 hover:border-orange-100 rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 transition-all duration-300 group flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30_rgba(241,91,41,0.06)] hover:-translate-y-1">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F15B29] group-hover:scale-110 group-hover:bg-[#F15B29] group-hover:text-white transition-all duration-300 mb-2 sm:mb-4 shadow-sm border border-orange-100/50">
              <FaMapMarkerAlt className="text-[16px] sm:text-[20px]" />
            </div>
            <h3 className="text-gray-900 font-bold tracking-wide mb-0.5 sm:mb-1 text-[13px] sm:text-[16px]">Location</h3>
            <p className="text-[10px] sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium">Bengaluru, KA</p>
          </a>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-6 border-b border-gray-200/60 pb-12 relative z-10 w-full">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 pr-0 md:pr-10">
            <div className="flex items-center gap-3 mb-6 bg-white w-fit px-3 py-2 rounded-[14px] shadow-[0_0_15px_rgba(0,0,0,0.02)] border border-gray-50">
              <img src={logo} alt="Krutanic" className="h-10 w-auto" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f15b29] mb-3">
              Learn. Build. Grow.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              Accelerate your career with industry-ready learning. Master coding, design, and data with top-tier mentorship globally.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#F15B29] hover:border-[#F15B29] hover:text-white transition-all hover:-translate-y-1 shadow-sm"><FaLinkedinIn size={14}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#F15B29] hover:border-[#F15B29] hover:text-white transition-all hover:-translate-y-1 shadow-sm"><FaInstagram size={16}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#F15B29] hover:border-[#F15B29] hover:text-white transition-all hover:-translate-y-1 shadow-sm"><FaTwitter size={14}/></a>
            </div>
          </div>

          {/* Links Col 1 - Side by side on mobile */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h2 className="text-gray-900 font-extrabold text-xs mb-6 uppercase tracking-[0.2em] border-b border-[#F15B29] w-fit pb-1.5 inline-block border-b-2">Explore</h2>
            <ul className="space-y-4">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-500 hover:text-[#F15B29] hover:translate-x-1 inline-block transition-all text-sm font-semibold tracking-wide">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 - Side by side on mobile */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-gray-900 font-extrabold text-xs mb-6 uppercase tracking-[0.2em] border-b border-[#F15B29] w-fit pb-1.5 inline-block border-b-2">Support</h2>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-500 hover:text-[#F15B29] hover:translate-x-1 inline-block transition-all text-sm font-semibold tracking-wide">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Providers block wrapper - Full width on small mobile if needed */}
          <div className="col-span-2 md:col-span-3">
             <h2 className="text-gray-900 font-extrabold text-xs mb-6 uppercase tracking-[0.2em] border-b border-gray-200 w-fit pb-1.5 inline-block">Secure Payments</h2>
             <div className="flex flex-wrap items-center gap-3 bg-gray-50/80 p-5 rounded-[20px] border border-gray-100/80">
               <div className="bg-white px-3 py-2 rounded-lg shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
                 <img src={Razorpay} alt="Razorpay" className="h-5 w-auto object-contain" />
               </div>
               <div className="bg-white px-3 py-2 rounded-lg shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
                 <img src={Easebuzz} alt="Easebuzz" className="h-5 w-auto object-contain" />
               </div>
             </div>
          </div>
          
        </div>

        {/* Bottom copyright block */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-xs text-gray-400 font-bold tracking-wider uppercase">
          <p>&copy; {new Date().getFullYear()} KRUTANIC. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0 px-2 justify-center md:justify-end">
            <Link to="/Terms" className="hover:text-[#F15B29] transition-colors">Terms of Service</Link>
            <Link to="/Privacy" className="hover:text-[#F15B29] transition-colors">Privacy Policy</Link>
            <Link to="/RefundPolicy" className="hover:text-[#F15B29] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
