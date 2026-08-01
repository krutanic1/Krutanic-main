import React from 'react';
import { FaStar } from 'react-icons/fa';

// Import real mentor images
import akashImg from '../../assets/mentors/akash.jpg';
import deepakImg from '../../assets/mentors/deepak.jpg';
import nishithaImg from '../../assets/mentors/nishitha.jpg';
import subraImg from '../../assets/mentors/Subhra.jpg';
import rahulImg from '../../assets/mentors/rahul.jpg';
import rudraImg from '../../assets/mentors/rudra.jpg';
import aashishImg from '../../assets/mentors/aashish.jpg';
import sachinImg from '../../assets/mentors/sachin.jpg';

const MentorShowcase = () => {
  const mentors = [
    { 
      name: "Akash R", 
      domain: "GRAPHIC DESIGN", 
      exp: "5.5+", 
      img: akashImg,
      company: "Ex-Google",
      position: "Senior Designer"
    },
    { 
      name: "Deepak Kumar", 
      domain: "MOBILE APP DEV", 
      exp: "5+", 
      img: deepakImg,
      company: "Ex-Amazon",
      position: "App Architect"
    },
    { 
      name: "Nishitha Jha", 
      domain: "PSYCHOLOGY", 
      exp: "7+", 
      img: nishithaImg,
      company: "Ex-Nielsen",
      position: "Lead Consultant"
    },
    { 
      name: "Subra Prakash", 
      domain: "SR. SME DATA SCIENCE", 
      exp: "7+", 
      img: subraImg,
      company: "Ex-Microsoft",
      position: "Data Scientist"
    },
    { 
      name: "Rahul Srivastava", 
      domain: "EMBEDDED SYSTEM", 
      exp: "19+", 
      img: rahulImg,
      company: "Ex-Intel",
      position: "Technical Director"
    },
    { 
      name: "Rudra Pratap", 
      domain: "CYBER SECURITY", 
      exp: "6.5+", 
      img: rudraImg,
      company: "Ex-Cisco",
      position: "Security Lead"
    },
    { 
      name: "Dr. Aashish Mishra", 
      domain: "ARTIFICIAL INTELLIGENCE", 
      exp: "17+", 
      img: aashishImg,
      company: "Ex-IBM",
      position: "AI Research Lead"
    },
    { 
      name: "Sachin Kumar", 
      domain: "FULL STACK DEV", 
      exp: "6+", 
      img: sachinImg,
      company: "Ex-Meta",
      position: "Software Architect"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 font-sans relative overflow-hidden">
      {/* Light subtle glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-4 block">Industry Experts</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-['Outfit'] tracking-tight">
            Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real</span> Professionals
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Directly interact with mentors who have decades of experience leading global teams at top tech companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <div 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={index * 50} 
              className="group relative rounded-xl bg-[#1c1c1c] border border-[#2a2a2a] overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[220px]"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none z-0"></div>

              <div className="p-5 flex justify-between items-start relative z-10">
                {/* Left Side: Info */}
                <div className="flex-1 pr-2">
                  <div className="inline-block px-2 py-0.5 bg-white text-black text-[10px] font-bold tracking-wider rounded-sm mb-3">
                    MENTOR
                  </div>
                  <h3 className="text-white font-bold text-[1.1rem] leading-tight mb-1">{mentor.name}</h3>
                  <p className="text-[#d4af37] text-[10px] font-bold tracking-wider mb-2 uppercase">{mentor.domain}</p>
                  <p className="text-slate-300 text-[11px] leading-tight">{mentor.company}</p>
                  <p className="text-slate-400 text-[11px] leading-tight mb-3">{mentor.position}</p>
                  
                  <div className="mt-auto">
                    <span className="text-[#f6d365] font-semibold text-xs tracking-wide">{mentor.exp} Years</span>
                  </div>
                </div>

                {/* Right Side: Photo */}
                <div className="w-[72px] h-[72px] shrink-0 relative mt-2">
                  <div className="absolute inset-0 rounded-full border-[1.5px] border-[#333] shadow-[0_0_15px_rgba(0,0,0,0.8)] z-0"></div>
                  <img src={mentor.img} alt={mentor.name} className="w-full h-full rounded-full object-cover relative z-10 border-[1.5px] border-[#2a2a2a]" />
                  {/* Subtle ring around image on hover */}
                  <div className="absolute -inset-[3px] rounded-full border border-[#d4af37]/20 group-hover:border-[#d4af37]/60 transition-colors duration-300 z-0"></div>
                </div>
              </div>

              {/* Bottom Footer Ribbon */}
              <div className="bg-[#151515] border-t border-[#2a2a2a] px-4 py-2 flex items-center justify-between mt-auto relative z-10">
                <div className="flex items-center text-[9px] font-bold text-[#d4af37] tracking-wider uppercase">
                  {mentor.exp} YEARS OF EXPERIENCE <span className="mx-1.5 text-slate-600">|</span> 5.0 <FaStar className="ml-0.5 text-[#d4af37] w-2.5 h-2.5 mb-[1px]" />
                </div>
                {/* Decorative Compass / Target Icon */}
                <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4af37] transition-colors" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorShowcase;
