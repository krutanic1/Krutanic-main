import React, { useState, useEffect, useRef } from 'react';
import { FaDownload, FaShareAlt, FaCheckCircle } from 'react-icons/fa';
import certInternship from '../../assets/certificates/c/internship.jpg';
import certTraining from '../../assets/certificates/c/training.jpg';

const CredentialSection = () => {
  const [activeCert, setActiveCert] = useState('training');
  const rightColumnRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCert(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    const cards = rightColumnRef.current?.querySelectorAll('.cert-card-wrap');
    if (cards) {
      cards.forEach((card) => observer.observe(card));
    }

    return () => {
      if (cards) {
        cards.forEach((card) => observer.unobserve(card));
      }
    };
  }, []);

  const scrollToCert = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="relative bg-[#f4f7ff] font-sans">
      {/* Soft abstract background blobs - fixed to viewport */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="sticky top-0 w-full h-screen">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-blue-400/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-400/5 blur-[100px]"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* LEFT CONTENT - STICKY */}
          <div className="w-full lg:w-5/12 relative">
            <div className="lg:sticky lg:top-32 lg:h-[calc(100vh-16rem)] flex flex-col justify-center py-16 lg:py-0">
              <span className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 block">Certificate</span>
              
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Will you be certified? Of course! It’ll look great on your resume and LinkedIn
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Validate your hard work with dual certifications that are recognized by top hiring partners and industry leaders. Every certificate includes a unique verification code.
              </p>

              {/* Custom Toggle / Scroll Nav */}
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md relative">
                <button 
                  onClick={() => scrollToCert('training')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeCert === 'training' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                >
                  <FaCheckCircle className={activeCert === 'training' ? 'text-white' : 'text-slate-300'} />
                  Training
                </button>
                <button 
                  onClick={() => scrollToCert('internship')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeCert === 'internship' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                >
                  <FaCheckCircle className={activeCert === 'internship' ? 'text-white' : 'text-slate-300'} />
                  Internship
                </button>
              </div>
              
              <div className="mt-10 flex gap-8">
                 <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 font-['Outfit']">12k+</span>
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Verified Profiles</span>
                 </div>
                 <div className="w-px h-12 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 font-['Outfit']">500+</span>
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Colleges Impacted</span>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT CERTIFICATE DISPLAY - SCROLLING */}
          <div className="w-full lg:w-7/12 relative py-8 lg:py-16" ref={rightColumnRef}>
            
            {/* TRAINING CERT */}
            <div id="training" className="cert-card-wrap w-full relative perspective-1000 flex items-center justify-center mb-16 lg:mb-32">
              <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-4 md:p-8 flex items-center justify-center overflow-hidden group">
                {/* Scaler-style left blue bar accent */}
                <div className="absolute top-0 left-0 bottom-0 w-4 md:w-8 bg-blue-800 border-r-4 md:border-r-8 border-blue-600 z-0"></div>
                <div className="relative z-10 w-full h-full flex flex-col pl-6 md:pl-10">
                   <div className="flex-1 w-full relative overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center p-2 hover:scale-[1.02] transition-transform duration-500">
                     <img src={certTraining} alt="Training Certificate" className="w-full h-full object-contain object-center" />
                   </div>
                   <div className="flex items-center justify-between mt-4 md:mt-6 bg-slate-50 px-4 md:px-6 py-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-sm font-bold text-slate-800 capitalize">Certificate</span>
                        <p className="text-xs text-slate-500 mt-0.5">Instant Verification Enabled</p>
                      </div>
                      <div className="flex gap-2 md:gap-3 pointer-events-auto">
                         <a href={certTraining} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"><FaDownload /></a>
                         <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"><FaShareAlt /></button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* INTERNSHIP CERT */}
            <div id="internship" className="cert-card-wrap w-full relative perspective-1000 flex items-center justify-center mb-16 lg:mb-0">
              <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-4 md:p-8 flex items-center justify-center overflow-hidden group">
                {/* Scaler-style left blue bar accent */}
                <div className="absolute top-0 left-0 bottom-0 w-4 md:w-8 bg-blue-800 border-r-4 md:border-r-8 border-blue-600 z-0"></div>
                <div className="relative z-10 w-full h-full flex flex-col pl-6 md:pl-10">
                   <div className="flex-1 w-full relative overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center p-2 hover:scale-[1.02] transition-transform duration-500">
                     <img src={certInternship} alt="Internship Certificate" className="w-full h-full object-contain object-center" />
                   </div>
                   <div className="flex items-center justify-between mt-4 md:mt-6 bg-slate-50 px-4 md:px-6 py-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-sm font-bold text-slate-800 capitalize">Certificate</span>
                        <p className="text-xs text-slate-500 mt-0.5">Instant Verification Enabled</p>
                      </div>
                      <div className="flex gap-2 md:gap-3 pointer-events-auto">
                         <a href={certInternship} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"><FaDownload /></a>
                         <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"><FaShareAlt /></button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialSection;
