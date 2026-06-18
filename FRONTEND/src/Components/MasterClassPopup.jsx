import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MasterClassPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex p-4 md:p-8 overflow-y-auto"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg m-auto bg-[#050505] rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.15)] p-5 md:p-8 flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-black/50 rounded-full p-2 border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Hand Pointer Icon */}
              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute top-4 right-12 md:top-6 md:right-16 text-xl md:text-2xl"
              >
                👇
              </motion.div>

              {/* Poster Image */}
              <div className="w-full max-w-[220px] md:max-w-[320px] mb-4 md:mb-6 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,120,255,0.2)]">
                <img 
                  src="/posters/new_poster.jpeg" 
                  alt="MasterClass Certificate" 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Value Stack Box */}
              <div className="w-full bg-[#11162e] border border-[#00ffcc] rounded-xl p-5 md:p-6 shadow-[0_0_20px_rgba(0,255,204,0.15)] relative overflow-hidden">
                {/* Subtle glow inside the box */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffcc]/5 blur-3xl rounded-full pointer-events-none"></div>
                
                <ul className="space-y-3 md:space-y-4 text-xs md:text-[15px] text-gray-200 leading-snug font-medium relative z-10 max-h-[35vh] md:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Receive a Complete Data Analyst Career Roadmap PDF — Step-by-Step Path from Freshers to First Job <strong className="text-white whitespace-nowrap">(Worth Rs. 2,500)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Get a Skill Mapping Worksheet for Non-Tech Candidates — Translate Your Current Skills into Data Strengths <strong className="text-white whitespace-nowrap">(Worth Rs. 1,500)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Unlock 5 Real-World Practice Datasets with Project Briefs (Sales, HR, E-commerce, Movies, Jobs) <strong className="text-white whitespace-nowrap">(Worth Rs. 3,500)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Download 50+ Data Analyst Interview Questions + Answers PDF (SQL, Excel, Power BI, Statistics, Case Studies) <strong className="text-white whitespace-nowrap">(Worth Rs. 3,000)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Receive a Portfolio Project Checklist — What to Build, How to Present, and Where to Showcase <strong className="text-white whitespace-nowrap">(Worth Rs. 2,000)</strong></span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Obtain Live Session Notes + Summary Slides for Future Reference <strong className="text-white whitespace-nowrap">(Worth Rs. 1,500)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">◆</span>
                    <span>Earn a Live Attendance Certificate <strong className="text-white whitespace-nowrap">(Priceless)</strong></span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Direct them to the actual classes list or registration logic
                  onClose();
                  const el = document.getElementById("active-classes");
                  if(el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-6 md:mt-8 w-full max-w-[340px] px-6 py-3 md:py-4 rounded-full border border-purple-400 bg-gradient-to-r from-purple-800 to-pink-700 text-white font-extrabold text-base md:text-xl shadow-[0_0_20px_rgba(216,70,188,0.5)] transition-shadow hover:shadow-[0_0_35px_rgba(216,70,188,0.8)] flex-shrink-0"
              >
                Enroll Now for <span className="line-through opacity-70 font-medium">Rs. 2000</span> FREE
              </motion.button>
              
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MasterClassPopup;
