import React from "react";

const EnrollMentor = () => {
  const slides = [
    {
      title: "Register with us",
      description:
        "Explore pro courses and register for the interested course by filling out the form.",
      icon: "🔍", // Replace with actual icon
    },
    {
      title: "You will get a call",
      description:
        "You will soon get a call from one of our senior executives regarding a few details.",
      icon: "💡", // Replace with actual icon
    },
    {
      title: "Provide the  details",
      description:
        "Simply provide the required information to the senior executive.",
      icon: "🚀", // Replace with actual icon
    },
    {
      title: "Pay  course fee",
      description: "Complete the payment process to enroll in the course.",
      icon: "💳", // Replace with actual icon
    },
  ];
  return (
    <div>
      <div className="container mx-auto">
        <h1
          data-aos='fade-up'
          className="text-center text-[#f15b29]"
        >
          | How to Enroll with us.
        </h1>
        <div
          data-aos='fade-up'
          className="relative w-full p-4 text-white flex items-center justify-center"
        >
          <div className="flex items-center justify-center flex-wrap text-center gap-10  sm:flex-col md:flex-row">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`flex flex-col items-center transition-all hover:scale-110 duration-300 ease-linear`}
              >
                <div className="text-4xl">{slide.icon}</div>
                <h3 className="text-xl font-semibold mt-4">
                  <span className="mr-2">{index + 1}.</span>
                  {slide.title}
                </h3>
                <p className="text-sm mt-2">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollMentor;
