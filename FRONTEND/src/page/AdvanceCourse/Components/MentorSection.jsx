import React from "react";
import { Linkedin, Award, Briefcase, Terminal } from "lucide-react";
import mentorImg from "../../../assets/careers/WhatsApp Image 2026-08-10 at 7.09.29 PM.jpeg";

const mentors = [
  {
    name: "Kumaraguru MJ",
    title: "Senior Technical Trainer",
    image: "/image.png",
    linkedin: "https://www.linkedin.com/in/th3kumara9uru/",
    about: "Senior Technical Trainer with 12+ years of experience designing and delivering industry-focused technical programs for engineering graduates, corporate professionals, and enterprise clients. My expertise spans Python development, advanced SQL operations, data engineering, backend development, Power BI, and data automation. I specialize in converting complex technical concepts into practical, project-driven learning experiences that prepare learners for real-world software engineering roles.",
    experience: { title: "12+ Years Experience", sub: "Corporate & Enterprise Training" },
    expertise: { title: "Core Expertise", sub: "Python, SQL, Data Engineering, BI" },
    industrial: { title: "Industrial Execution", sub: "Production-oriented coding & ETL" },
    skills: ["Python", "FastAPI", "Pandas", "SQL", "Power BI", "Data Engineering", "AWS", "Machine Learning"]
  },
  {
    name: "Vinothkumar Ravi",
    title: "Data Analytics & Data Science Trainer",
    image: mentorImg,
    linkedin: "https://www.linkedin.com/in/vinothkumar-ravi/",
    about: "Experienced Analyst with a demonstrated history of working in E-Learning & Political Organizations. Skilled in Data Science, Operational management, MS-office, Google sheets, CRM and Survey Training. Strong administrative professional with a Data Analytics focus in Big Data from Bharathiar University.",
    experience: { title: "Industry Experience", sub: "Business Analyst at Matrimony.com & EFA Operator" },
    expertise: { title: "Core Expertise", sub: "Data Science, Advanced SQL, Python, Power BI" },
    industrial: { title: "Educational Background", sub: "Data Analytics & Big Data, Bharathiar University" },
    skills: ["Python", "SQL", "Tableau", "Power BI", "Data Science", "Operational Management", "Google Sheets", "Business Intelligence"]
  }
];

const MentorSection = () => {
  return (
    <section className="da-sec-white">
      <div className="shell">
        <h2 className="sec-title">Meet Your Mentors</h2>
        <p className="sec-sub">Learn directly from industry veterans and experienced analysts with deep expertise in data automation, backend development, and big data analytics.</p>
        
        <div className="flex flex-col gap-12">
          {mentors.map((mentor, idx) => (
            <div key={idx} className="p-card flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
              
              <div className="w-full md:w-1/3 flex flex-col items-center text-center z-10">
                <div className="w-48 h-56 rounded-2xl overflow-hidden mb-6 border-4 border-white shadow-xl bg-gray-100">
                  <img 
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover object-top scale-105"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&size=200&background=086F70&color=fff`; }}
                  />                                                                     
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{mentor.name}</h3>
                <p className="text-teal-700 font-bold text-sm mb-4">{mentor.title}</p>
                <a 
                  href={mentor.linkedin}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-[#0A66C2] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#004182] transition-colors"
                >
                  <Linkedin size={16} /> Connect on LinkedIn
                </a>
              </div>
              
              <div className="w-full md:w-2/3 z-10">
                <h4 className="text-xl font-bold mb-4 text-gray-900">About the Mentor</h4>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {mentor.about}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg"><Briefcase size={20} /></div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{mentor.experience.title}</div>
                      <div className="text-xs text-gray-500">{mentor.experience.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg"><Terminal size={20} /></div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{mentor.expertise.title}</div>
                      <div className="text-xs text-gray-500">{mentor.expertise.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 text-teal-700 rounded-lg"><Award size={20} /></div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{mentor.industrial.title}</div>
                      <div className="text-xs text-gray-500">{mentor.industrial.sub}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Areas of Interest</h5>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorSection;
