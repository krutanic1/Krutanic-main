import { Helmet } from "react-helmet";
import { useState , useMemo, useEffect } from "react";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import axios from "axios";
import AlumniData from "../Components/alumniData";
import API from "../API";
import { FaStar, FaSearch, FaSlidersH, FaBriefcase, FaChartLine } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import alumniIndian from "../assets/alumni_indian.png";

const Alumni = () => {
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [filters, setFilters] = useState({ post: "", location: "", role: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({ post: false, location: false, role: false,});
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [filteredResults, setFilteredResults] = useState(AlumniData);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const uniqueValues = useMemo(
    () => ({  
      posts: [...new Set(AlumniData.map((a) => a.post))].sort(),
      locations: [...new Set(AlumniData.map((a) => a.location))].sort(),
      roles: [...new Set(AlumniData.map((a) => a.role))].sort(),
    }),
    []
  );

  const handleSelect = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setDropdownOpen((prev) => ({ ...prev, [field]: false }));
  };

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
    if (!alumni?.name) {
      console.warn("Invalid alumni:", alumni);
      return;
    }
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

  const Dropdown = ({ field, placeholder, options }) => (
    <div className="w-full relative">
      <button
        onClick={() =>
          setDropdownOpen((prev) => ({ ...prev, [field]: !prev[field] }))
        }
        className="w-full bg-black text-white px-4 py-2 rounded-md text-sm text-left flex justify-between"
      >
        {filters[field] || placeholder}
      </button>
      {dropdownOpen[field] && (
        <div className="absolute z-10 w-full bg-[#1A1A1A] text-white rounded-md mt-1 max-h-40 overflow-y-auto scrollbar-hide">
          <button
            onClick={() => handleSelect(field, "")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
          >
            {placeholder}
          </button>
          {options.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(field, item)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container m-auto px-[10px] py-[20px]">
      <Helmet>
          <title>Krutanic Alumni | Success Stories from E-Learning Leaders</title>
          <meta name="keywords" content="e-learning alumni, Krutanic graduates, tech careers, coding success, mentorship stories"/>
          <meta name="description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <meta property="og:title" content="Krutanic Alumni | Success Stories from E-Learning Leaders"/>
          <meta property="og:url" content="https://www.krutanic.com/Alumni"/>
          <meta property="og:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta property="og:description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <meta property="og:type" content="website"/>
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:title" content="Krutanic Alumni | Success Stories from E-Learning Leaders"/>
          <meta name="twitter:image" content="https://www.krutanic.com/assets/LOGO3-Do06qODb.png"/>
          <meta name="twitter:description" content="Explore how Krutanic alumni achieved career success through our top e-learning programs. Real stories in tech, coding, and data science mentorship."/>
          <link rel="canonical" href="https://www.krutanic.com/Alumni" />
      </Helmet>
      <div className="max-w-5xl mx-auto pt-4 md:pt-10 pb-16">
        {/* Header Section from Design */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-3 py-1.5 mb-6 border border-orange-100 shadow-sm">
            <FaStar className="text-[#F15B29]" size={14}/>
            <span className="text-xs font-bold text-[#F15B29]">4.9/5 Rating</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest pl-2 border-l border-gray-300">GLOBAL COMMUNITY</span>
          </div>

          <h1 className="text-[52px] md:text-[72px] leading-[1.05] font-extrabold text-[#111] tracking-tighter mb-4">
            Our <span className="text-[#F15B29]">Legacy</span><br/>In Motion.
          </h1>
          <p className="text-gray-600 font-medium text-lg md:text-xl mb-8 max-w-sm leading-relaxed">
            Connect with 5,000+ alumni from top tech firms worldwide.
          </p>

          {/* Search Bar + Filter */}
          <div className="flex gap-4 mb-5 max-w-2xl">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center px-6 h-16">
              <FaSearch className="text-gray-400 shrink-0 text-xl" />
              <input 
                type="text" 
                placeholder="Search role or company..." 
                className="w-full bg-transparent outline-none px-4 text-base font-medium text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-16 w-16 bg-[#F15B29] rounded-3xl flex items-center justify-center text-white shadow-lg hover:bg-[#d84a1e] transition-colors shrink-0 text-2xl">
              <FaSlidersH />
            </button>
          </div>

        </div>

        {/* Featured Pioneers Section */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Featured Pioneers</h2>
          <span className="cursor-pointer text-[#F15B29] text-[10px] font-extrabold uppercase tracking-widest hover:underline mb-1">View All</span>
        </div>

        <div className="pb-8 -mx-2 px-2 alumni-slider-container">
          <style>{`
            .alumni-slider-container .slick-slide { padding: 0 10px; box-sizing: border-box; }
            .alumni-slider-container .slick-slide > div { margin-bottom: 24px; }
            .alumni-slider-container .slick-dots li button:before { font-size: 10px; color: #d1d5db; }
            .alumni-slider-container .slick-dots li.slick-active button:before { color: #F15B29; }
          `}</style>
          {filteredResults.length ? (
            <div className="flex flex-col gap-6">
              {[
                [...filteredResults].reverse().filter((_, i) => i % 3 === 0),
                [...filteredResults].reverse().filter((_, i) => i % 3 === 1),
                [...filteredResults].reverse().filter((_, i) => i % 3 === 2)
              ].map((rowItems, rowIndex) => {
                if (rowItems.length === 0) return null;
                // Duplicate items if too few to prevent react-slick continuous scroll glitching
                const displayItems = rowItems.length < 4 ? [...rowItems, ...rowItems, ...rowItems, ...rowItems] : rowItems;
                
                return (
                  <Slider
                    key={rowIndex}
                    infinite={true}
                    autoplay={true}
                    autoplaySpeed={0}
                    speed={5000 + (rowIndex * 1500)}
                    cssEase="linear"
                    slidesToShow={3}
                    slidesToScroll={1}
                    arrows={false}
                    pauseOnHover={true}
                    rtl={rowIndex === 1}
                    responsive={[
                      { breakpoint: 1200, settings: { slidesToShow: 2 } },
                      { breakpoint: 768, settings: { slidesToShow: 1 } }
                    ]}
                  >
                    {displayItems.map((alumni, i) => (
                      <div key={i} className="h-full" style={{ padding: '0 10px' }} dir={rowIndex === 1 ? 'rtl' : 'ltr'}>
                        <div
                          className="mx-auto bg-white border border-gray-100 rounded-[32px] p-6 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer duration-300"
                          onClick={() => handleCardClick(alumni)}
                          dir="ltr"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white ring-2 ring-gray-100">
                              {alumni.name.charAt(0)}
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-[#F15B29] font-extrabold tracking-widest uppercase mb-0.5">Package</div>
                              <div className="text-xl font-extrabold text-[#111] leading-none">{alumni.package || "Custom"}</div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{alumni.name}</h3>
                            <p className="text-sm text-blue-700 font-semibold">{alumni.role || "Professional"} at {alumni.post}</p>
                          </div>

                          <div className="flex gap-3">
                            <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                              <div className="text-[10px] text-gray-400 font-bold tracking-widest mb-1.5 uppercase">Pre-Krutanic</div>
                              <div className="text-sm font-bold text-gray-800">{alumni.pre}</div>
                            </div>
                            <div className="flex-1 bg-orange-50/50 rounded-2xl p-4 border border-[#F15B29]/10">
                              <div className="text-[10px] text-[#F15B29] font-bold tracking-widest mb-1.5 uppercase">Post-Krutanic</div>
                              <div className="text-sm font-bold text-[#df400b]">{alumni.package || alumni.post}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic p-4">No alumni found matching your criteria.</p>
          )}
        </div>

        {/* Mentorship Banner */}
        <div className="my-10 bg-[#3B5498] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-[40px]"></div>
          <div className="absolute bottom-0 right-10 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl translate-y-20"></div>
          
          <div className="relative z-10 max-w-sm">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-200 mb-4 uppercase">Bridge the Gap</p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-5 tracking-tight">Elevate Your Career with 1-1 Mentorship</h2>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed mb-8">Book a session with us and get insider interview secrets.</p>
            <button 
              onClick={() => setShowApplyPopup(true)}
              className="bg-white text-[#3B5498] font-bold py-3.5 px-8 rounded-2xl text-sm shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
            >
              Book a Session
            </button>
          </div>
        </div>

        {/* Success Stories & Stats Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50 font-sans cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-[#111] overflow-hidden shrink-0 shadow-lg border-2 border-white ring-1 ring-gray-100">
                <img src={alumniIndian} alt="Indian Professional Success Story" className="w-full h-full object-cover"/>
              </div>
              <div>
                <p className="text-[#3B5498] text-[10px] font-extrabold tracking-widest uppercase mb-1.5 flex items-center gap-1">Transition Story</p>
                <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug mb-3">"From Sales to Software Engineering at Microsoft"</h4>
                <div className="text-gray-400 text-xs font-bold hover:text-gray-900 transition-colors uppercase tracking-wider flex items-center gap-1">Read More <span className="text-lg leading-none">&rarr;</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#FFF6F3] rounded-[32px] p-6 md:p-8 border border-[#F15B29]/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-[#F15B29] opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                  <FaChartLine size={80}/>
                </div>
                <div className="text-[#F15B29] mb-4 relative z-10"><FaChartLine size={24}/></div>
                <div className="text-[10px] text-gray-500 font-extrabold tracking-widest uppercase mb-1 relative z-10">Avg Hike</div>
                <div className="text-4xl font-extrabold text-[#df400b] tracking-tight relative z-10">140%</div>
              </div>
              <div className="bg-[#EDF4FF] rounded-[32px] p-6 md:p-8 border border-blue-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 text-blue-500 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  <FaBriefcase size={80}/>
                </div>
                <div className="text-blue-600 mb-4 relative z-10"><FaBriefcase size={22}/></div>
                <div className="text-[10px] text-gray-500 font-extrabold tracking-widest uppercase mb-1 relative z-10">Placement</div>
                <div className="text-4xl font-extrabold text-[#2F67B5] tracking-tight relative z-10">98%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showApplyPopup && <AdvancedApplyPopup onClose={() => setShowApplyPopup(false)} />}
      {selectedAlumni && (
        <div className="fixed inset-0 px-1 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-lg p-3 max-h-[80vh] overflow-y-auto scrollbar-hide">
            <button
              onClick={handleCloseDialog}
              className="absolute top-0 right-3 text-xl font-bold"
              aria-label="Close dialog"
            >
              x
            </button>
            {!isFlipped ? (
              <>
                <div className="flex gap-4 items-center mb-4">
                  {/* <img
                    src={selectedAlumni.image}
                    alt={selectedAlumni.name}
                    className="w-24 h-24 rounded-full border-4 border-purple-700"
                  /> */}
                  <div>
                    <h2 className="text-xl font-bold">{selectedAlumni.name}
                    </h2>
                    <p className="text-sm">
                      {selectedAlumni.role} at  {selectedAlumni.post}
                    
                    </p>
                    {/* <p className="text-sm ">
                      Package : {selectedAlumni.package}
                    </p> */}
                      <a
                      href={selectedAlumni.linkdinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 border border-blue-600 text-blue-600 px-4 rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                    >
                      In Connect
                    </a>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  <p>📍{selectedAlumni.location}</p>
                  <p>
                    {/* 🎓{selectedAlumni.college} | {selectedAlumni.degree} */}
                  </p>
                  <p>💼{selectedAlumni.experience}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Pre Krutanic</p>
                    <p className="font-semibold">{selectedAlumni.pre}</p>
                    <p className="text-xs">{selectedAlumni.preRole}</p>
                  </div>
                  <div className="text-2xl">➡️</div>
                  <div>
                    <p className="text-xs text-gray-500">Post Krutanic</p>
                    <p className="font-semibold">{selectedAlumni.post}</p>
                    
                    {/* <p className="text-xs">{selectedAlumni.postRole}</p> */}
                  </div>
                </div>
                <div className="border p-4 rounded bg-gray-100">
                  <div className="text-base font-semibold mb-1">
                    Connect 1-1 with Alumni
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    We will match you with the alumni based on their
                    availability.
                  </p>
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-[#F15B29] text-white font-bold py-2 rounded"
                  >
                    REQUEST FOR 1-1 SESSION
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-md font-bold mb-4">
                  Take your career to the next level!
                </h2>
                {formErrors.general && (
                  <p className="text-red-500 text-sm mb-4">
                    {formErrors.general}
                  </p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="contact"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Contact number"
                      required
                    />
                    {formErrors.contact && (
                      <p className="text-red-500 text-xs">
                        {formErrors.contact}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Email"
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      name="graduationYear"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Graduation year"
                      required
                    />
                    {formErrors.graduationYear && (
                      <p className="text-red-500 text-xs">
                        {formErrors.graduationYear}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="currentCompany"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Current company"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Years of experience"
                      required
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Select Advanced Domains
                    </p>
                    <div className="grid grid-rows-4 grid-flow-col gap-x-8">
                      {[
                        "Data Science",
                        "Digital Marketing",
                        "Investment Banking",
                        "Product Management",
                        "MERN Stack Development",
                        "Performance Marketing",
                        "Generative AI With Prompt Engineering",
                        "Automation Testing",
                      ].map((domain) => (
                        <div key={domain} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={domain}
                            name="advancedDomains"
                            value={domain}
                            className="h-3 w-3 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={domain}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {domain}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#F15B29] text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
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
