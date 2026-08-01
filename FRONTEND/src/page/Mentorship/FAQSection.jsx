import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What makes Krutanic Mentorship different?",
      a: "Unlike traditional courses, we focus on 1:1 mentorship and live sessions with industry practitioners. You build real products, not just toy examples, and get direct internship support through our partner network."
    },
    {
      q: "Do I need prior coding knowledge?",
      a: "No, our programs are designed for all levels. We start with the fundamentals and gradually move to advanced concepts. However, having a passion for the domain is essential!"
    },
    {
      q: "What is the duration of the mentorship?",
      a: "Most specialized tracks range from 4 to 6 months. This includes live training, project work, and career support phases."
    },
    {
      q: "Will I get placement assistance?",
      a: "Yes! We provide dedicated career support, including resume building, mock interviews, and access to our 100+ partner firms for internships and full-time roles."
    },
    {
      q: "Are the sessions recorded?",
      a: "Yes, all live sessions are recorded and made available on your student dashboard for lifelong access, so you never miss a lesson."
    }
  ];

  return (
    <section className="py-24 bg-white font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Header (Sticky) */}
          <div className="w-full lg:w-4/12 relative">
            <div className="lg:sticky lg:top-32">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-4 block">Support</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-['Outfit'] tracking-tight">
                Common <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Questions</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                Everything you need to know about the mentorship program and your career journey.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm font-bold text-slate-800 mb-2">Still have questions?</p>
                <a 
                  href="https://api.whatsapp.com/send?phone=919380736449" 
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  Chat with our team on WhatsApp 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="w-full lg:w-8/12">
            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'bg-white border-blue-100 shadow-[0_10px_40px_rgba(37,99,235,0.08)]' 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className={`font-bold text-lg pr-8 transition-colors duration-300 ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                        {faq.q}
                      </span>
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                        {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
                      </div>
                    </button>
                    
                    <div 
                      className={`px-6 transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0 pointer-events-none'
                      }`}
                    >
                      <p className="text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
