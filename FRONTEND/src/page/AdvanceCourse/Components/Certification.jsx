import React from "react";
import { ShieldCheck, TrendingUp, Globe, Award } from "lucide-react";
import advance from "../../../assets/certificates/Advance/Advance certificate completion.jpg";

const Certification = ({ isDark = false }) => {
  return (
    <div className="py-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[10px] font-black uppercase tracking-widest">
              <Award size={12} /> Professional Credential
           </div>
           <h2 className={`font-outfit font-black text-3xl md:text-5xl mb-4 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
             Global <span className="text-orange-600">Certification</span>
           </h2>
           <p className="max-w-[600px] text-gray-500 text-lg leading-relaxed font-medium">
             Evidence your expertise with a professional-grade certification recognized by 500+ global technology and finance partners.
           </p>
        </div>

        <div className="px-4 md:px-10 lg:px-20">
          <div className={`lg:flex items-center gap-16 rounded-[40px] p-8 md:p-14 transition-all duration-700 hover:shadow-2xl ${
            isDark 
            ? 'bg-[#1E1B4B] border border-white/5' 
            : 'bg-white border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.06)]'
          }`}>
            <div className="lg:w-[45%] w-full">
              <div className="relative group">
                <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 ${isDark ? 'bg-purple-600' : 'bg-orange-600'}`}></div>
                <div className="relative overflow-hidden rounded-2xl shadow-lg border border-black/5 bg-gray-50">
                   <img
                     src={advance}
                     alt="Professional Certification"
                     className="w-full transform group-hover:scale-[1.02] transition-transform duration-700"
                   />
                </div>
              </div>
            </div>

            <div className="lg:w-[55%] w-full mt-12 lg:mt-0">
              <div className="space-y-10">
                <div className="flex gap-6 group">
                   <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                      <ShieldCheck size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        Industrial Validation
                      </h3>
                      <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Graduates receive a unique verifiable ID that establishes absolute project-based competency in your domain.
                      </p>
                   </div>
                </div>
              

                <div className="flex gap-6 group">
                   <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <TrendingUp size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        Hiring Signal
                      </h3>
                      <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        Our certification is recognized as a 'Tier-1 Hiring Signal' by our network of 500+ global corporate partners.
                      </p>
                   </div>
                </div>

                <div className="flex gap-6 group">
                   <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                      <Globe size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        Institutional Mobility
                      </h3>
                      <p className={`text-base leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        The Krutanic credential facilitates seamless transition into high-growth roles in international tech hubs.
                      </p>
                   </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4 opacity-60">
                 <img src="https://img.icons8.com/color/48/linkedin.png" className="w-6 h-6 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="LinkedIn" />
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shareable on global networks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
