import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    name: "John Doe",
    course: "React Basics",
    review:
      "This course was amazing! I learned so much about React fundamentals.",
    image:
      "https://images.unsplash.com/photo-1730973915515-e79273d90b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDV8fHxlbnwwfHx8fHw%3D",
  },
  {
    name: "Jane Smith",
    course: "Advanced JavaScript",
    review:
      "Excellent explanations and practical examples. Highly recommend it!",
    image:
      "https://images.unsplash.com/photo-1730973915515-e79273d90b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDV8fHxlbnwwfHx8fHw%3D",
  },
  {
    name: "Jane Smith",
    course: "Advanced JavaScript",
    review:
      "Excellent explanations and practical examples. Highly recommend it!",
    image:
      "https://images.unsplash.com/photo-1730973915515-e79273d90b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDV8fHxlbnwwfHx8fHw%3D",
  },
  {
    name: "Jane Smith",
    course: "Advanced JavaScript",
    review:
      "Excellent explanations and practical examples. Highly recommend it!",
    image:
      "https://images.unsplash.com/photo-1730973915515-e79273d90b7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMDV8fHxlbnwwfHx8fHw%3D",
  },

  // Add more testimonials as needed
];

const Feedback = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div>
      <div className="mb-20">
        <h1
          data-aos="fade-up"
          className="text-4xl text-center my-10 font-semibold"
        >
          Testimonials
        </h1>

        {/* Left to Right Marquee */}
        <marquee
          data-aos="fade-up"
          behavior="scroll"
          direction="left"
          scrollamount="8"
        >
          <div className="px-20 flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex bg-teal-900 h-44 w-[500px] rounded-md overflow-hidden whitespace-pre-wrap"
              >
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="px-2 py-3">
                  <h1>{testimonial.name}</h1>
                  <h2>{testimonial.course}</h2>
                  <p>{testimonial.review}</p>
                </div>
              </div>
            ))}
          </div>
        </marquee>

        {/* Right to Left Marquee */}
        <marquee
          data-aos="fade-up"
          behavior="scroll"
          direction="right"
          scrollamount="8"
        >
          <div className="px-20 flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex bg-teal-900 h-44 w-[500px] rounded-md overflow-hidden whitespace-pre-wrap"
              >
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="px-2 py-2">
                  <h1>{testimonial.name}</h1>
                  <h2>{testimonial.course}</h2>
                  <p>{testimonial.review}</p>
                </div>
              </div>
            ))}
          </div>
        </marquee>

        {/* Left to Right Marquee */}
        <marquee
          data-aos="fade-up"
          behavior="scroll"
          direction="left"
          scrollamount="8"
        >
          <div className="px-20 flex items-center gap-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex bg-teal-900 h-44 w-[500px] rounded-md overflow-hidden whitespace-pre-wrap"
              >
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="px-2 py-3">
                  <h1>{testimonial.name}</h1>
                  <h2>{testimonial.course}</h2>
                  <p>{testimonial.review}</p>
                </div>
              </div>
            ))}
          </div>
        </marquee>
      </div>
    </div>
  );
};

export default Feedback;
