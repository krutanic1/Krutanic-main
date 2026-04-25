import { Helmet } from 'react-helmet-async';
import { useState , useMemo, useEffect } from "react";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import axios from "axios";
import AlumniData from "../Components/alumniData";
import API from "../API";
import { FaSearch, FaArrowRight, FaRobot, FaBullhorn, FaBuilding, FaUserTie, FaCheckCircle, FaLaptopCode, FaFileAlt, FaUsers } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import alumniIndian from "../assets/alumni_indian.png";

const Alumni = () => {
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [filters, setFilters] = useState({ post: "", location: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [filteredResults, setFilteredResults] = useState(AlumniData);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFilteredResults(
      AlumniData.filter((a) => {
        const matchesFilters = Object.entries(filters).every(([k, v]) => !v || a[k] === v);
        const matchesQuery = !searchQuery || 
          (a.name && a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (a.role && a.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (a.post && a.post.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (a.location && a.location.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilters && matchesQuery;
      })
    );
  }, [filters, searchQuery]);

  const handleCardClick = (alumni) => {
    if (!alumni?.name) return;
    setIsFlipped(false);
    setSelectedAlumni(alumni);
  };

  const handleCloseDialog = () => {
    setSelectedAlumni(null);
    setIsFlipped(false);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const errors = {};

    // Frontend validation
    if (!data.email.includes("@")) errors.email = "Invalid email";
    if (data.contact?.length < 10) errors.contact = "Invalid phone number";
    if (!data.graduationYear || data.graduationYear < 1900)
      errors.graduationYear = "Invalid year";

    setFormErrors(errors);

    if (Object.keys(errors).length) return;

    try {
      const response = await axios.post(`${API}/alumni-data`, {
        fullName: data.fullName,
        contact: data.contact,
        email: data.email,
        graduationYear: Number(data.graduationYear),
        currentCompany: data.currentCompany,
        yearsOfExperience: Number(data.yearsOfExperience),
        advancedDomains: data.advancedDomains
          ? Array.isArray(data.advancedDomains)
            ? data.advancedDomains
            : [data.advancedDomains]
          : [],
      });

      if (!response.data.success) {
        setFormErrors({ general: response.data.message });
        return;
      }

      handleCloseDialog();
      alert("Form submitted successfully!");
    } catch (error) {
      setFormErrors({ general: "Failed to submit form. Please try again." });
    }
  };

  const sliderSettings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: "linear",
    speed: 6000,
    arrows: false,
    dots: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, speed: 4000 } },
      { breakpoint: 768, settings: { slidesToShow: 1, speed: 3000 } }
    ]
  };

  const sliderSettingsRev = {
    ...sliderSettings,
    rtl: true,
  };

  // Split results into 3 groups for 3 parallel rows
  const row1 = useMemo(() => filteredResults.filter((_, i) => i % 3 === 0), [filteredResults]);
  const row2 = useMemo(() => filteredResults.filter((_, i) => i % 3 === 1), [filteredResults]);
  const row3 = useMemo(() => filteredResults.filter((_, i) => i % 3 === 2), [filteredResults]);

  const AlumniCard = ({ alumni }) => (
    <div className="px-3 pb-6 h-full">
      <div 
        className="bg-white border border-gray-200/80 rounded-[24px] p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all cursor-pointer flex flex-col h-[320px] group" 
        onClick={() => handleCardClick(alumni)}
      >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700 font-extrabold text-lg border border-gray-200 group-hover:bg-[#F15B29] group-hover:text-white transition-colors shadow-sm">
              {alumni.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-base font-extrabold text-gray-900 mb-0.5 truncate">{alumni.name}</div>
              <div className="text-xs font-semibold text-gray-500 truncate">
                {alumni.role || "Professional"}, <span className="text-gray-900">{alumni.post}</span>
              </div>
            </div>
        </div>
        
        <div className="flex-1 bg-[#FAFAFA] rounded-xl p-5 border border-gray-100 space-y-4">
            <div>
              <div className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase mb-1.5">Before Krutanic</div>
              <div className="text-xs font-bold text-gray-700 truncate">{alumni.pre}</div>
            </div>
            <div className="h-px bg-gray-200/60 w-full relative">
            </div>
            <div>
              <div className="flex justify-between items-start mb-1.5">
                  <div className="text-[9px] font-extrabold tracking-widest text-[#F15B29] uppercase">After Krutanic</div>
                  {alumni.package && <div className="text-[9px] font-extrabold text-[#F15B29] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">{alumni.package}</div>}
              </div>
              <div className="text-xs font-extrabold text-gray-900 truncate">{alumni.postRole || alumni.post}</div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container m-auto px-[10px] py-[20px]">
      <Helmet>
          <title>Krutanic Outcomes | Career Transitions & Alumni Network</title>
          <meta name="keywords" content="e-learning alumni, Krutanic graduates, tech careers, coding success, mentorship stories, job placement"/>
          <meta name="description" content="See how Krutanic learners transition into high-growth roles, secure competitive packages, and build lasting professional networks."/>
          <meta property="og:title" content="Krutanic Outcomes | Career Transitions & Alumni Network"/>
          <meta property="og:url" content="https://www.krutanic.com/Alumni"/>
          <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta property="og:description" content="See how Krutanic learners transition into high-growth roles, secure competitive packages, and build lasting professional networks."/>
          <meta property="og:type" content="website"/>
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:title" content="Krutanic Outcomes | Career Transitions & Alumni Network"/>
          <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta name="twitter:description" content="See how Krutanic learners transition into high-growth roles, secure competitive packages, and build lasting professional networks."/>
          <link rel="canonical" href="https://www.krutanic.com/Alumni" />
      </Helmet>
      
      <div className="max-w-[1200px] mx-auto pt-4 md:pt-10 pb-16">
        
        {/* 1. Poster-style hero */}
        <div className="mb-14 bg-[#0B0F19] rounded-[32px] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F15B29] opacity-15 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="max-w-2xl w-full">
              <h1 className="text-[44px] md:text-[60px] leading-[1.1] font-bold text-white tracking-tight mb-6 font-serif">
                Career Outcomes Across <br/><span className="text-[#F15B29] font-sans font-extrabold tracking-tighter">High-Growth Roles</span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
                See how Krutanic learners transition into new careers, secure competitive roles, and build lasting professional networks. 
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 backdrop-blur-sm flex items-center gap-3">
                  <FaUserTie className="text-[#F15B29] text-xl" />
                  <span className="text-sm font-semibold text-white tracking-wide">Active Career Guidance</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 backdrop-blur-sm flex items-center gap-3">
                  <FaCheckCircle className="text-[#F15B29] text-xl" />
                  <span className="text-sm font-semibold text-white tracking-wide">Interview Preparation</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 backdrop-blur-sm flex items-center gap-3">
                  <FaBuilding className="text-[#F15B29] text-xl" />
                  <span className="text-sm font-semibold text-white tracking-wide">Hiring-Readiness Support</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-[420px] hidden lg:block shrink-0">
              <div className="bg-[#111827]/80 backdrop-blur-md border border-gray-700/50 rounded-[28px] p-8 relative shadow-2xl">
                 <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-6">Recent Transition</div>
                 
                 <div className="bg-[#1F2937]/50 rounded-2xl p-5 mb-5 border border-gray-700">
                    <div className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Before Krutanic</div>
                    <div className="text-white font-semibold flex items-center justify-between text-base">
                       <span>Sales Associate</span>
                       <span className="text-gray-400 font-medium text-sm">Retail</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-center my-3 text-[#F15B29]">
                   <div className="bg-[#F15B29]/10 rounded-full p-2 border border-[#F15B29]/20">
                     <FaArrowRight size={16} />
                   </div>
                 </div>
                 
                 <div className="bg-[#1F2937] rounded-2xl p-5 mt-5 border border-gray-700 shadow-inner">
                    <div className="text-xs font-bold text-[#F15B29] mb-1.5 uppercase tracking-widest">After Krutanic</div>
                    <div className="text-white font-semibold flex items-center justify-between text-lg">
                       <span>Software Engineer</span>
                       <span className="text-gray-300 font-bold text-sm bg-white/10 px-2 py-1 rounded">Microsoft</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Outcomes proof strip */}
        <div className="mb-24">
          <div className="text-center md:text-left mb-6">
             <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400">Outcomes & Network Reach</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-0 border-y border-gray-200 py-10">
             <div className="lg:px-6 lg:border-r border-gray-200 last:border-0 pl-2">
               <div className="text-3xl font-extrabold text-gray-900 mb-1.5 font-serif tracking-tight">5,000+</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Learner Network</div>
             </div>
             <div className="lg:px-6 lg:border-r border-gray-200 last:border-0">
               <div className="text-3xl font-extrabold text-gray-900 mb-1.5 font-serif tracking-tight">300+</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Hiring Companies</div>
             </div>
             <div className="lg:px-6 lg:border-r border-gray-200 last:border-0 pl-2 md:pl-0">
               <div className="text-3xl font-extrabold text-[#F15B29] mb-1.5 font-serif tracking-tight">140%</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Featured Salary Growth</div>
             </div>
             <div className="lg:px-6 lg:border-r border-gray-200 last:border-0">
               <div className="text-3xl font-extrabold text-gray-900 mb-1.5 font-serif tracking-tight">45%</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Role Transitions</div>
             </div>
             <div className="lg:px-6 lg:border-r border-gray-200 last:border-0 pl-2 md:pl-0">
               <div className="text-3xl font-extrabold text-gray-900 mb-1.5 font-serif tracking-tight">1-on-1</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Mentorship Support</div>
             </div>
             <div className="lg:px-6">
               <div className="text-3xl font-extrabold text-gray-900 mb-1.5 font-serif tracking-tight">12+</div>
               <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Projects Required</div>
             </div>
          </div>
        </div>

        {/* 3. Featured learner transitions */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Featured Learner Transitions</h2>
              <p className="text-gray-600 mt-2 font-medium text-lg">Documented career changes from recent cohorts.</p>
            </div>
          </div>

          <div className="alumni-slider-rows space-y-4">
            {/* Row 1: Forward */}
            <div className="overflow-hidden">
              <Slider {...sliderSettings}>
                {row1.map((alumni, i) => (
                  <AlumniCard key={`row1-${i}`} alumni={alumni} />
                ))}
              </Slider>
            </div>

            {/* Row 2: Backward (Parallel) */}
            <div className="overflow-hidden">
              <Slider {...sliderSettingsRev}>
                {row2.map((alumni, i) => (
                  <AlumniCard key={`row2-${i}`} alumni={alumni} />
                ))}
              </Slider>
            </div>

            {/* Row 3: Forward */}
            <div className="overflow-hidden">
              <Slider {...sliderSettings}>
                {row3.map((alumni, i) => (
                  <AlumniCard key={`row3-${i}`} alumni={alumni} />
                ))}
              </Slider>
            </div>
          </div>
        </div>

        {/* 4. Browse outcomes */}
        <div className="mb-24 bg-white border border-gray-200 rounded-[40px] p-10 md:p-14 shadow-sm shadow-gray-100/50">
           <div className="mb-10 lg:w-2/3">
             <h3 className="text-3xl font-extrabold text-gray-900">Explore Alumni Pathways</h3>
             <p className="text-gray-600 mt-2 text-lg font-medium">Find documented journeys matching your background or career goals.</p>
           </div>
           
           <div className="flex flex-col gap-8">
             <div className="relative max-w-3xl">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search by role, company, or learning path..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-[24px] py-5 pl-14 pr-6 text-sm font-semibold text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all appearance-none shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             <div className="flex flex-wrap gap-3">
               {['Software Engineering', 'AI & Data', 'Marketing', 'Career Switchers', 'Freshers', 'Salary Growth', 'Top Companies'].map(cat => (
                 <button key={cat} className="px-6 py-3 bg-white border border-gray-200 rounded-[20px] text-sm font-extrabold text-gray-600 hover:border-[#F15B29] hover:text-[#F15B29] hover:shadow-sm transition-all">
                   {cat}
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* 5. Editorial success stories */}
        <div className="mb-24">
          <div className="flex flex-col mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Case Studies</h2>
            <p className="text-gray-600 mt-2 text-lg font-medium">Detailed looks into significant career transitions.</p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Featured Story */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col group cursor-pointer hover:shadow-xl hover:border-gray-300 transition-all">
               <div className="h-72 bg-gradient-to-tr from-gray-900 to-gray-800 relative overflow-hidden">
                  <img src={alumniIndian} alt="Featured Case Study" className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-1000"/>
                  <div className="absolute top-6 left-6 bg-white px-4 py-2 text-[10px] font-extrabold tracking-widest uppercase text-gray-900 rounded-lg shadow-sm border border-gray-100">
                    Operations to Data Science
                  </div>
               </div>
               <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5 group-hover:text-[#F15B29] transition-colors tracking-tight">Building the technical depth required to pivot into advanced analytics.</h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-10 flex-1 font-medium">After three years in operational management, the lack of technical skills blocked entry into data analytics. Through 1-on-1 mentorship and capstone projects, the transition resulted in a data science role at a tier-1 firm.</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 border-t border-gray-100">
                     <div>
                        <div className="font-extrabold text-gray-900 text-base">Priya Patel</div>
                        <div className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Program Completed: Data Science</div>
                     </div>
                      <div className="text-sm font-extrabold text-[#F15B29] flex items-center gap-2">Read Full Story</div>
                  </div>
               </div>
            </div>
            
            {/* Secondary Stories */}
            <div className="lg:col-span-5 flex flex-col gap-8">
               <div className="flex-1 bg-white border border-gray-200 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col group cursor-pointer hover:shadow-xl hover:border-gray-300 transition-all">
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Fresher to Full Stack</div>
                  <h4 className="text-xl font-extrabold text-gray-900 mb-4 leading-snug group-hover:text-[#F15B29] transition-colors">From basic frontend knowledge to a complete full-stack portfolio.</h4>
                  <p className="text-sm text-gray-600 mb-8 flex-1 font-medium leading-relaxed">Gaining the practical architecture knowledge and project experience that product companies test for during technical interviews.</p>
                  <div className="pt-6 border-t border-gray-100">
                    <div className="text-base font-extrabold text-gray-900 flex justify-between items-center group-hover:text-[#F15B29] transition-colors">
                      Rahul Sharma 
                    </div>
                  </div>
               </div>
               <div className="flex-1 bg-white border border-gray-200 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col group cursor-pointer hover:shadow-xl hover:border-gray-300 transition-all">
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Marketing to Product</div>
                  <h4 className="text-xl font-extrabold text-gray-900 mb-4 leading-snug group-hover:text-[#F15B29] transition-colors">Mapping marketing intuition into structured product management.</h4>
                  <p className="text-sm text-gray-600 mb-8 flex-1 font-medium leading-relaxed">How targeted resume reviews and mock execution interviews converted existing experience into a PM offer.</p>
                  <div className="pt-6 border-t border-gray-100">
                    <div className="text-base font-extrabold text-gray-900 flex justify-between items-center group-hover:text-[#F15B29] transition-colors">
                      Ananya Gupta 
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 6. Career support system */}
        <div className="mb-24">
          <div className="text-center md:text-left mb-12 lg:w-2/3">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Career Support Behind the Outcomes</h2>
            <p className="text-gray-600 mt-3 text-lg font-medium">The structured guidance and dedicated services that facilitate these transitions.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaUserTie className="text-[#F15B29] text-2xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Mentor-Led Sessions</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Direct 1-on-1 guidance from active industry professionals who understand current hiring needs.</p>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaLaptopCode className="text-[#F15B29] text-2xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Project Portfolio Reviews</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Code and architecture reviews to ensure your portfolio demonstrates production-level competence.</p>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaRobot className="text-[#F15B29] text-2xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Mock Interviews</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Simulated technical and behavioral rounds to build confidence and refine your communication.</p>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaFileAlt className="text-[#F15B29] text-2xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Resume & Profile Review</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Strategic structuring of your past experience and new skills to pass automated and manual screening.</p>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaBullhorn className="text-[#F15B29] text-xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Hiring-Readiness Guidance</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Comprehensive coaching on the end-to-end recruitment process across different company tiers.</p>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-[#FFF6F3] border border-[#F15B29]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <FaUsers className="text-[#F15B29] text-2xl" />
                </div>
                <div>
                   <h4 className="text-lg font-extrabold text-gray-900 mb-2">Alumni & Community Referrals</h4>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">Leveraging the network of past learners for insights and potential internal visibility.</p>
                </div>
             </div>
          </div>
        </div>

        {/* 7. Alumni network and hiring ecosystem */}
        <div className="mb-24 bg-[#FAFAFA] border border-gray-200 rounded-[40px] p-10 md:p-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="order-2 lg:order-1">
               <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">The Alumni Employer Ecosystem</h2>
               <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">Our graduates leverage their skills across a diverse range of organizations, building careers in environments that match their goals.</p>
               
               <div className="grid grid-cols-2 gap-8">
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="font-extrabold text-gray-900 text-sm mb-2">Global Enterprises</div>
                   <div className="text-sm text-gray-500 font-medium leading-snug">Enterprise scale and enterprise architecture.</div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="font-extrabold text-gray-900 text-sm mb-2">Product Companies</div>
                   <div className="text-sm text-gray-500 font-medium leading-snug">Core technology and product innovation.</div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="font-extrabold text-gray-900 text-sm mb-2">High-Growth Startups</div>
                   <div className="text-sm text-gray-500 font-medium leading-snug">Agile development and rapid scaling logic.</div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="font-extrabold text-gray-900 text-sm mb-2">Consulting Firms</div>
                   <div className="text-sm text-gray-500 font-medium leading-snug">Client solutions and technical strategy.</div>
                 </div>
               </div>
             </div>
             
             <div className="order-1 lg:order-2 bg-white rounded-[32px] border border-gray-200 p-10 md:p-14 shadow-lg shadow-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 items-center text-center opacity-40 grayscale">
                   {/* Logos or structured text representations */}
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Microsoft</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Amazon</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Google</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Meta</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Netflix</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">IBM</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Deloitte</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Accenture</div>
                   <div className="text-[22px] font-extrabold text-gray-800 tracking-tighter">Oracle</div>
                </div>
             </div>
          </div>
        </div>

        {/* 8. Final guidance CTA */}
        <div className="mb-10 bg-[#0B0F19] rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#F15B29] opacity-15 blur-[120px] pointer-events-none rounded-[100%]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-white tracking-tight">Plan your next career move with Krutanic.</h2>
            <p className="text-gray-300 text-lg md:text-xl mb-12 font-medium">Discuss your prior experience, specific goals, and how structured mentorship can support your transition.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button 
                onClick={() => setShowApplyPopup(true)}
                className="bg-[#F15B29] text-white font-extrabold py-4 px-10 rounded-2xl text-base hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-[0_8px_30px_rgba(241,91,41,0.3)]"
              >
                Book a Career Strategy Session
              </button>
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="bg-transparent border border-white/20 text-white font-extrabold py-4 px-10 rounded-2xl text-base hover:bg-white/5 transition-all"
              >
                Browse Program Details
              </button>
            </div>
          </div>
        </div>

      </div>

      {showApplyPopup && <AdvancedApplyPopup onClose={() => setShowApplyPopup(false)} />}
      
      {/* Detail Dialog */}
      {selectedAlumni && (
        <div className="fixed inset-0 px-4 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] p-10 max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl">
            <button
              onClick={handleCloseDialog}
              className="absolute top-6 right-8 text-3xl font-light text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Close dialog"
            >
              &times;
            </button>
            {!isFlipped ? (
              <>
                <div className="flex gap-6 items-center mb-10">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-[20px] flex items-center justify-center text-gray-800 font-extrabold text-3xl shadow-sm">
                    {selectedAlumni.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{selectedAlumni.name}</h2>
                    <p className="text-base font-semibold text-gray-600 mb-0">
                      {selectedAlumni.role} at <span className="text-gray-900">{selectedAlumni.post}</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-gray-100 text-sm font-bold text-gray-700">📍 {selectedAlumni.location || "Global"}</div>
                  <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-gray-100 text-sm font-bold text-gray-700">💼 {selectedAlumni.experience || "Professional"} Experience</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#F15B29]"></div>
                  
                  <div className="mb-6">
                    <p className="text-[10px] tracking-widest uppercase font-extrabold text-gray-400 mb-2">Before Krutanic</p>
                    <p className="font-extrabold text-gray-900 text-lg">{selectedAlumni.pre}</p>
                    <p className="text-sm text-gray-500 font-semibold mt-1">{selectedAlumni.preRole}</p>
                  </div>
                  
                  <div className="h-px bg-gray-200 mb-6"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] tracking-widest uppercase font-extrabold text-[#F15B29]">After Krutanic</p>
                      {selectedAlumni.package && <p className="text-[10px] uppercase tracking-widest font-extrabold text-[#F15B29] bg-orange-50 px-2 py-1 rounded">Outcome: {selectedAlumni.package}</p>}
                    </div>
                    <p className="font-extrabold text-gray-900 text-lg">{selectedAlumni.postRole || selectedAlumni.post}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl text-center">
                  <div className="text-xl font-extrabold text-gray-900 mb-2">
                    Connect 1-1 with {selectedAlumni.name.split(" ")[0]}
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-8">
                    We match learners with alumni based on availability and background alignment.
                  </p>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-[#F15B29] text-white font-extrabold py-4 px-6 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all"
                  >
                    REQUEST GUIDANCE SESSION
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                  Ready to map your transition?
                </h2>
                {formErrors.general && (
                  <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl mb-6">
                    {formErrors.general}
                  </p>
                )}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <input
                        type="tel"
                        name="contact"
                        className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                        placeholder="Contact number"
                        required
                      />
                      {formErrors.contact && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold pl-1">{formErrors.contact}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                        placeholder="Email"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold pl-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <input
                        type="number"
                        name="graduationYear"
                        className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                        placeholder="Grad. Year"
                        required
                      />
                      {formErrors.graduationYear && (
                        <p className="text-red-500 text-xs mt-1.5 font-bold pl-1">
                          {formErrors.graduationYear}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                        placeholder="Years of Exp."
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="currentCompany"
                      className="w-full bg-white border border-gray-300 rounded-xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#F15B29]/20 focus:border-[#F15B29] outline-none transition-all shadow-sm shadow-gray-50"
                      placeholder="Current company (or None)"
                      required
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-5">
                      Interested Career Path
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Data Science & AI",
                        "Software Engineering",
                        "Product Management",
                        "Marketing & Growth"
                      ].map((domain) => (
                        <label key={domain} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="advancedDomains"
                            value={domain}
                            className="w-4 h-4 rounded border-gray-300 text-[#F15B29] focus:ring-[#F15B29]"
                          />
                          <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                            {domain}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="bg-white border border-gray-300 text-gray-700 font-extrabold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#F15B29] text-white font-extrabold py-4 px-8 rounded-xl hover:bg-orange-600 hover:-translate-y-1 hover:shadow-lg transition-all shadow-md"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Alumni;

