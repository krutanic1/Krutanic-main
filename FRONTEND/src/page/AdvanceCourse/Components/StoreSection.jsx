import React from 'react'

const StoreSection = () => {

    const features = [
        {
          title: "Community of Innovators",
          description:
            "Be part of a vibrant community of learners and industry professionals who inspire growth and creativity.",
        },
        {
          title: "Diverse Course Catalog",
          description:
            "Choose from a wide range of topics, from technology and business to personal development.",
        },
        {
          title: "Performance Tracking",
          description:
            "Monitor your progress through intuitive dashboards and receive feedback to keep improving.",
        },
        {
          title: "Learn from Industry Leaders",
          description:
            "Our instructors are seasoned professionals with years of experience in their respective fields.",
        },
        {
          title: "Exclusive Resources",
          description:
            "Access curated materials, eBooks, templates, and tools to enrich your learning journey.",
        },
        {
          title: "Lifetime Access",
          description:
            "Revisit the content anytime, even after completing the course, to keep your skills sharp.",
        },
      ];
    

  return (
    <div>
       <div className="container mx-auto">
            <h1
              data-aos="fade-up"
              className=" text-[#f15b29] font-bold text-center mb-10"
            >
              | Let’s Reveal What’s in Store!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  data-aos="fade-up"
                  key={index}
                  className="relative bg-white p-6 shadow-lg rounded-lg border-l-8 border-[#f15b29]"
                >
                  <div className="absolute -top-4 left-4 bg-[#f15b29] text-white w-8 h-8 flex items-center justify-center rounded-full">
                    <span className="text-xl font-bold">📄</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
    </div>
  )
}

export default StoreSection
