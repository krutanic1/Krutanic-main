import React from 'react';

const BenefitsofLearning = ({ isDark = false }) => {

    const learn = [
        {
          title: "Industry-Experienced Mentors",
          description:
            "Learn from experts with real-world experience in data science and machine learning, guiding you through practical, hands-on projects.",
          icon: "📅",
        },
        {
          title: "Career Support",
          description:
            "Benefit from comprehensive career services, including resume building, interview coaching, and job placement assistance to secure your dream role.",
          icon: "📘",
        },
        {
          title: "Networking Opportunities",
          description:
            "Join a vibrant community of professionals, mentors, and alumni, offering valuable networking and collaboration prospects.",
          icon: "🕒",
        },
        {
          title: "Real-World Projects",
          description:
            "Work on live, industry-relevant projects that provide practical experience and make your portfolio stand out to employers",
          icon: "👥",
        },
      ];

  return (
    <div>
       <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className={`text-center font-bold mb-8 text-3xl md:text-5xl ${isDark ? 'text-white' : 'text-[#c43609]'}`}
            >
              Discover the <span className={isDark ? 'text-purple-400' : ''}>Benefits</span> of Learning 
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:px-20">
              {learn.map((item, index) => (
                <div
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                data-aos-offset="150"
                data-aos-once="false"
                  key={index}
                  className={`flex flex-col items-center text-center p-8 rounded-2xl transition duration-300 ${
                    isDark 
                    ? 'bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10' 
                    : 'bg-white border border-[#efcfc2] shadow-md hover:shadow-xl'
                  }`}
                >
                  <div className={`text-4xl mb-4 ${isDark ? '' : 'text-orange-500'}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#c43609]'}`}>{item.title}</h3>
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#4b4b4b]'}`}>{item.description}</p>
                </div>
              ))}
            </div>
       </div>
    </div>
  )
}

export default BenefitsofLearning
