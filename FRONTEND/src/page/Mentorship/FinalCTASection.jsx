import React from 'react';
import { FaChevronRight, FaWhatsapp } from 'react-icons/fa';

const FinalCTASection = ({ onOpenForm }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans flex justify-center">
      <div className="max-w-6xl w-full rounded-[2.5rem] bg-[#0a0f1c] relative overflow-hidden shadow-2xl py-20 px-6 md:px-16 text-center border border-slate-800">
        
        {/* Animated Glow Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] rounded-full bg-blue-600/20 blur-[120px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[80%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 font-['Outfit'] tracking-tight leading-tight">
            Ready to Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Professional Path?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Join 10,000+ students already accelerating their careers with Krutanic. Don't let your dream career wait any longer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button 
              onClick={onOpenForm}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Book Free Counseling 
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a 
              href="https://api.whatsapp.com/send?phone=919380736449" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaWhatsapp className="text-green-400 text-[1.3rem]" /> Contact Support
            </a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">
            <span>Free consultation</span> 
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span> 
            <span>No obligation</span> 
            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700"></span> 
            <span>Career roadmap included</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
