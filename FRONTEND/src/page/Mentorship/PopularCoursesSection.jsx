import React from 'react';
import { FaStar, FaClock, FaArrowRight, FaRobot, FaCloud, FaBullhorn, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Import the generated images
import fullstackImg from '../../assets/courses/course_fullstack.png';
import datascienceImg from '../../assets/courses/course_datascience.png';

const PopularCoursesSection = () => {
  const navigate = useNavigate();

  const otherTracks = [
    {
      title: "Data Science",
      subtitle: "Turn raw data into business decisions",
      rating: 4.8,
      duration: "3 Months",
      link: "/mentorship/data-science",
      image: datascienceImg,
      icon: null,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Artificial Intelligence",
      subtitle: "Master ML models & systems",
      rating: 4.8,
      duration: "3 Months",
      link: "/mentorship/artificial-intelligence",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400&h=400",
      icon: <FaRobot />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Cloud Computing",
      subtitle: "Design scalable architectures",
      rating: 4.8,
      duration: "3 Months",
      link: "/mentorship/cloud-computing",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=400",
      icon: <FaCloud />,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Digital Marketing",
      subtitle: "Data-driven growth strategies",
      rating: 4.7,
      duration: "2 Months",
      link: "/mentorship/digital-marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=400",
      icon: <FaBullhorn />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    }
  ];

  return (
    <section className="bg-white py-24 px-4 sm:px-8 lg:px-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-14 md:mb-20 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Curated Pathways</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Master your craft.<br className="hidden md:block"/>
            <span className="text-slate-400 font-medium"> Accelerate your career.</span>
          </h2>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* HERO / FLAGSHIP COURSE (Left 7 cols) */}
          <div 
            onClick={() => navigate('/mentorship/full-stack-web-development')}
            className="lg:col-span-7 group relative bg-[#0B1120] rounded-[2.5rem] p-8 md:p-12 overflow-hidden cursor-pointer shadow-2xl transition-transform duration-500 hover:-translate-y-1 flex flex-col h-full min-h-[500px]"
          >
            {/* Background Image / Art */}
            <div className="absolute inset-0 z-0">
               {/* Gradients to blend the image */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/90 to-transparent z-10"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10"></div>
               <img 
                 src={fullstackImg} 
                 alt="Full Stack Development" 
                 className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out mix-blend-screen"
               />
            </div>
            
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] z-0" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-20 flex flex-col h-full justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-10">
                  <span className="bg-white/10 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 shadow-lg">
                    Flagship Program
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Full Stack Web Developer
                </h3>
                <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed mb-8 drop-shadow-md">
                  Transform into a production-ready engineer. Build, deploy, and scale modern web applications with intensive 1:1 mentor guidance.
                </p>
              </div>

              <div className="mt-8">
                {/* Glassmorphism Stats Row */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-8 bg-[#0B1120]/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 w-fit shadow-xl">
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-amber-400" size={16} />
                    <span className="text-white font-bold text-sm md:text-base">4.8 Rating</span>
                  </div>
                  <div className="w-px h-6 bg-white/10 hidden md:block"></div>
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-emerald-400" size={16} />
                    <span className="text-white font-bold text-sm md:text-base">100% Placement Prep</span>
                  </div>
                  <div className="w-px h-6 bg-white/10 hidden md:block"></div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-blue-300" size={16} />
                    <span className="text-white font-bold text-sm md:text-base">3 Months</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white px-7 py-4 rounded-full font-bold text-sm md:text-base flex items-center group-hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                    Explore Flagship Track 
                    <FaArrowRight className="ml-2.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECONDARY TRACKS (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-full justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between px-2">
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Highly Specialized Tracks</h4>
              </div>

              <div className="flex flex-col space-y-3">
                {otherTracks.map((track, idx) => (
                  <div 
                    key={idx}
                    onClick={() => navigate(track.link)}
                    className="group flex items-center p-3 md:p-4 bg-slate-50 hover:bg-white rounded-[1.25rem] cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
                  >
                    {track.image ? (
                      <div className="w-16 h-16 rounded-xl shrink-0 mr-4 overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl shrink-0 mr-4 ${track.bg} ${track.color} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        {track.icon}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0 pr-4">
                      <h5 className="text-[1.1rem] font-bold text-slate-900 truncate mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{track.title}</h5>
                      <p className="text-sm text-slate-500 truncate">{track.subtitle}</p>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center text-[0.7rem] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 mb-2 shadow-sm">
                        <FaStar className="text-amber-400 mr-1.5" size={10} /> {track.rating}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <FaArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore All CTA */}
            <div 
              onClick={() => navigate('/mentorship')}
              className="mt-6 md:mt-8 p-6 md:p-7 rounded-[1.25rem] border-2 border-dashed border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all group gap-4"
            >
              <div>
                <h5 className="font-bold text-slate-900 text-lg mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Don't see your domain?</h5>
                <p className="text-sm text-slate-500">Explore all 20+ career accelerators.</p>
              </div>
              <div className="text-blue-600 font-bold flex items-center bg-blue-50 px-5 py-2.5 rounded-full group-hover:bg-blue-100 transition-colors whitespace-nowrap">
                View Catalog <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCoursesSection;
