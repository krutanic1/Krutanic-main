import React from 'react';

const BenefitsofLearning = () => {

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
              className="text-center font-bold mb-8 text-[#c43609] text-3xl md:text-4xl"
            >
              | Discover the Benefits of Learning with{" "}
              <span className="text-[#c43609] font-bold">Krutanic</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:px-20">
              {learn.map((learn, index) => (
                <div
                data-aos="fade-up" 
                  key={index}
                  className="flex flex-col items-center text-center bg-white border border-[#efcfc2] p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
                >
                  <div className="text-orange-500 text-4xl mb-4">
                    {learn.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#c43609]">{learn.title}</h3>
                  <p className="text-[#4b4b4b] text-lg leading-relaxed">{learn.description}</p>
                </div>
              ))}
            </div>
       </div>
    </div>
  )
}

export default BenefitsofLearning
