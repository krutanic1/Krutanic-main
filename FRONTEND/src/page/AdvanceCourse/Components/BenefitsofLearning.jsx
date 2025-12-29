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
              className="text-center  font-bold mb-8 text-orange-700"
            >
              | Discover the Benefits of Learning with{" "}
              <span className="text-white font-bold">Krutanic</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:px-20">
              {learn.map((learn, index) => (
                <div
                data-aos="fade-up" 
                  key={index}
                  className="flex flex-col items-center text-center bg-[#080810]  p-6 rounded-lg hover:shadow-lg transition duration-300"
                >
                  <div className="text-orange-500 text-4xl mb-4 hover:text-white">
                    {learn.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{learn.title}</h3>
                  <p className="text-gray-400">{learn.description}</p>
                </div>
              ))}
            </div>
       </div>
    </div>
  )
}

export default BenefitsofLearning
