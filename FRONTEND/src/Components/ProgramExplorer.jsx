import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgramExplorer = ({ columnsData }) => {
  const navigate = useNavigate();

  // Helper to get image based on course title
  function getCategoryImage(title) {
    const t = title.toLowerCase();
    if (t.includes('data science')) return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800";
    if (t.includes('data analytics')) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
    if (t.includes('digital market')) return "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800";
    if (t.includes('mern')) return "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800";
    if (t.includes('product management')) return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800";
    if (t.includes('prompt') || t.includes('ai')) return "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";
  }

  // Flatten programs from columnsData and add necessary fields for the UI
  const allPrograms = React.useMemo(() => {
    if (!columnsData) return [];
    return columnsData.reduce((acc, col) => {
      const programsWithCategory = col.cards.map((card, idx) => ({
        ...card,
        id: `${col.category}-${idx}`,
        category: col.category,
        image: getCategoryImage(card.title),
        highlight: idx === 0
      }));
      return [...acc, ...programsWithCategory];
    }, []);
  }, [columnsData]);

  // The 6 specific popular courses for the sidebar
  const popularCourses = [
    { name: "Data Science", link: "/DataScience" },
    { name: "Data Analytics", link: "/DataAnalytics" },
    { name: "Digital Marketing", link: "/DigitalMarket" },
    { name: "MERN Stack Development", link: "/MernStack" },
    { name: "Product Management", link: "/ProductManagement" },
    { name: "Generative AI", link: "/PromptEngineering" }
  ];

  return (
    <section id="explore-programs" className="bg-[#fffbf9] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="mb-14 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0f172a] mb-4">
            Explore <span className="text-orange-600">Our Programs</span>
          </h2>
          <div className="w-20 h-1.5 bg-orange-600 rounded-full mx-auto lg:mx-0"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-orange-600 px-6 py-5">
                <span className="text-white font-bold text-sm uppercase tracking-widest">Popular</span>
              </div>
              {popularCourses.map((course) => (
                <button
                  key={course.name}
                  onClick={() => navigate(course.link)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-300 text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-medium border-b border-slate-50 last:border-0"
                >
                  <span className="text-sm">{course.name}</span>
                  <ChevronRight size={16} className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-fr">
              {allPrograms.length > 0 ? (
                allPrograms.map((program) => (
                  <div 
                    key={program.id}
                    className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:-translate-y-2 group flex flex-col h-full md:max-w-[360px] lg:max-w-[400px] xl:max-w-none mx-auto w-full md:min-h-[420px]"
                  >
                    {/* 16:9 Image Container */}
                    <div className="relative aspect-video overflow-hidden flex-shrink-0">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-white/20 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center">
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">KT</span>
                          </div>
                          <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Industry Recognized</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Component */}
                    <div className="p-6 flex flex-col flex-1">
                      <div>
                        <div className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 w-fit">
                          {program.category}
                        </div>
                        <h3 className="text-[17px] font-bold text-slate-900 mb-5 leading-snug group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 h-12">
                          {program.title}
                        </h3>
                      </div>
                      
                      <div className="pt-5 border-t border-slate-50 space-y-3 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[12px] font-medium uppercase tracking-wider">Duration</span>
                          <span className="text-slate-800 font-bold text-[13px]">{program.duration || "2/3 Months"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[12px] font-medium uppercase tracking-wider">Starting</span>
                          <span className="text-orange-600 font-bold text-[13px]">{program.batch || "Upcoming"}</span>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          onClick={() => navigate(program.link)}
                          className={`
                            w-full py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] text-center transition-all duration-300
                            ${program.highlight 
                              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700' 
                              : 'bg-slate-50 text-slate-800 hover:bg-orange-600 hover:text-white border border-slate-100'
                            }
                          `}
                        >
                          View Program
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ChevronRight size={32} className="text-slate-300 rotate-90" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Expanding Courses</h4>
                  <p className="text-slate-500 text-sm">New advanced programs are coming soon to this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramExplorer;
