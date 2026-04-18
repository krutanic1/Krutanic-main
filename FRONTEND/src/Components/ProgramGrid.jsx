import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProgramGrid = ({ columnsData }) => {
  // Flattening the data for a clean grid layout
  const allPrograms = columnsData.reduce((acc, col) => {
    const programsWithCategory = col.cards.map(card => ({
      ...card,
      category: col.category,
      categoryIcon: col.icon
    }));
    return [...acc, ...programsWithCategory];
  }, []);

  return (
    <div className="w-full py-12 px-4">
      {/* Container with responsive grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {allPrograms.map((program, index) => (
          <article 
            key={index} 
            className="group relative flex flex-col h-full bg-white rounded-[32px] p-8 transition-all duration-300 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            {/* Top Left Icon Container */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-slate-50 text-orange-600 rounded-2xl flex items-center justify-center text-3xl transition-colors group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-6 duration-500">
                {program.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {program.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow flex flex-col">
              <h3 className="text-xl md:text-2xl font-black text-[#050d2f] leading-tight mb-4 line-clamp-2">
                {program.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {program.desc}
              </p>

              {program.batch && (
                <div className="flex items-center gap-2 mb-8 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100/50">
                  <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batch Starting:</span>
                  <span className="text-[11px] font-black text-[#050d2f]">{program.batch}</span>
                </div>
              )}

              {/* Pinned CTA at the bottom using margin-top: auto */}
              <div className="mt-auto pt-6 border-t border-slate-50">
                <Link 
                  to={program.link} 
                  className="inline-flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-widest hover:gap-5 transition-all duration-300"
                >
                  View Program <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>

            {/* Subtle Card Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-orange-600/10 transition-all"></div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProgramGrid;
