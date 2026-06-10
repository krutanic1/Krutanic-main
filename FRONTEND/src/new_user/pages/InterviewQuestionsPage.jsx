import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../API"; 
import "../new-dashboad.css"; 
import { useDashboard } from "../DashboardContext"; 

const InterviewQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); 
  
  // Get student's enrolled course info
  const { enrollment } = useDashboard();
  
  const domainVal = enrollment?.domain;
  const enrolledCourseTitle = (domainVal && typeof domainVal === 'object' ? domainVal.title : domainVal) || enrollment?.program || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API}/api/getinterviewquestions`);
        
        // Filter questions using strict courseTitle matching
        const filteredQuestions = response.data.filter(q => {
          if (!enrolledCourseTitle || !q.courseTitle) return false;
          return q.courseTitle.trim() === enrolledCourseTitle.trim();
        });

        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("Error fetching interview questions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (enrolledCourseTitle) {
      fetchQuestions();
    } else if (enrollment === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [enrolledCourseTitle, enrollment]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-[#f8fafc]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin opacity-80"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-blue-500 animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 rounded-full border-b-4 border-purple-500 animate-spin opacity-40" style={{ animationDuration: '2s' }}></div>
        </div>
        <p className="mt-6 text-slate-500 font-medium tracking-wide animate-pulse">Curating your questions...</p>
      </div>
    );
  }

  // Empty State
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/40 border border-slate-100 p-16 text-center max-w-2xl mx-auto w-full transform hover:scale-[1.01] transition-transform duration-500">
          <div className="mx-auto w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-20"></div>
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
            </svg>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Check Back Soon!</h3>
          <p className="text-slate-500 text-lg leading-relaxed">
            We're currently preparing the ultimate interview guide for <span className="font-bold text-indigo-600">{enrolledCourseTitle}</span>. Your materials will appear here shortly.
          </p>
        </div>
      </div>
    );
  }

  // Active section data
  const activeSection = questions[activeTab];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        {/* Premium Header */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight pb-2">
            Interview Mastery
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Exclusive preparation material for <span className="text-indigo-600 font-bold px-1">{enrolledCourseTitle}</span>
          </p>
        </div>
        
        {/* Main Layout: Sticky Sidebar + Scrolling Content */}
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Sidebar (Topics) - Sticky */}
          <div className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-slate-200/60 p-6 lg:p-8 flex flex-col sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6 px-2 sticky top-0 bg-white z-10 pb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">Modules</h3>
            </div>
            
            <div className="space-y-2 flex-1">
              {questions.map((section, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                    window.scrollTo({ top: 300, behavior: 'smooth' }); // Smooth scroll slightly down to focus content
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                    activeTab === idx 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 scale-[1.02]' 
                      : 'hover:bg-slate-50 text-slate-600 hover:shadow-sm border border-transparent hover:border-slate-100'
                  }`}
                >
                  {/* Subtle highlight effect for active tab */}
                  {activeTab === idx && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  )}
                  
                  <span className="font-semibold truncate pr-3 relative z-10 text-[15px]">{section.heading}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold transition-all relative z-10 shadow-sm ${
                    activeTab === idx 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200/60 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                  }`}>
                    {section.questions.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area (Questions) */}
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 lg:p-12 relative min-h-[500px]">
            {activeSection && (
              <div className="max-w-4xl mx-auto animate-fade-in-up" key={activeTab}> {/* Added key to re-trigger animation on tab change */}
                
                {/* Topic Header */}
                <div className="mb-10 pb-8 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">Module {activeTab + 1}</span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                      {activeSection.heading}
                    </h2>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide border border-indigo-100/50 flex-shrink-0 flex items-center gap-2 shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {activeSection.questions.length} Questions
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6 pb-4">
                  {activeSection.questions.map((q, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-white p-6 lg:p-8 rounded-[1.5rem] border border-slate-200/80 shadow-sm hover:shadow-lg hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'both' }}
                    >
                      {/* Interactive Side Accent */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                      
                      <div className="flex items-start gap-5 lg:gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium text-[16px] lg:text-[17px] pt-2.5 group-hover:text-slate-900 transition-colors">
                          {q}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
              </div>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Global styles for animations & scrollbar */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default InterviewQuestionsPage;
