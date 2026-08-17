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
    { label: "Alumni Outcomes", to: "/Alumni" },
    { label: "About Us", to: "/AboutUs" },
    { label: "Career", to: "/Career" },
    { label: "Refer and Earn", to: "/ReferAndEarn" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 px-6 sm:px-12 font-sans relative overflow-hidden shadow-2xl border-t border-white/5">
      
      <div className="max-w-7xl mx-auto align-top">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 border-b border-white/10 pb-12 relative z-10 w-full mb-8">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 pr-0 md:pr-12">
            <div className="mb-6 bg-white w-fit px-4 py-2.5 rounded text-white shadow-sm border border-white/10">
              <img src={logo} alt="Krutanic" className="h-7 md:h-8 w-auto mix-blend-multiply" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Structured learning, expert mentorship, and measured career outcomes.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/krutanic" className="w-10 h-10 rounded bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><FaLinkedinIn size={14}/></a>
              <a href="https://www.instagram.com/krutanic" className="w-10 h-10 rounded bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><FaInstagram size={15}/></a>
              <a href="#" className="w-10 h-10 rounded bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><FaTwitter size={14}/></a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h2 className="text-white font-semibold text-xs mb-5 uppercase tracking-widest text-[#F15B29]">Platform</h2>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white font-semibold text-xs mb-5 uppercase tracking-widest text-[#F15B29]">Discover</h2>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="col-span-2 md:col-span-3 lg:ml-auto">
             <h2 className="text-white font-semibold text-xs mb-5 uppercase tracking-widest text-[#F15B29]">Contact</h2>
             <ul className="space-y-4">
                <li>
                  <a href="mailto:support@krutanic.com" className="flex items-start gap-3 group text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    <FaEnvelope className="mt-1 shrink-0" />
                    <span>support@krutanic.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+917829104024" className="flex items-start gap-3 group text-gray-400 hover:text-white transition-colors text-sm font-medium">
                    <FaPhoneAlt className="mt-1 shrink-0" />
                    <span>+91 7829104024</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-gray-400 text-sm font-medium">
                  <FaMapMarkerAlt className="mt-1 shrink-0" />
                  <span className="leading-relaxed">Bengaluru, KA, India</span>
                </li>
             </ul>
          </div>
          
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-semibold tracking-wide">
          <p>&copy; {new Date().getFullYear()} Krutanic. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link to="/Terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/Privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/RefundPolicy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
