import React from 'react';
import Slider from 'react-slick';
import { Star, CheckCircle } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import r1 from '../assets/alumini/birendra.jpg';
import r2 from '../assets/alumini/raja.jpg';
import r3 from '../assets/alumini/mithun.jpg';
import r4 from '../assets/alumini/prabhleen.jpg';
import r5 from '../assets/alumini/rohan.jpg';
import r6 from '../assets/alumini/manish.jpg';

const Testimonial = () => {
  const testimonials = [
    {
      name: "RAJA SINGH",
      college: "Ujjain Engineering College",
      course: "Stock Marketing",
      image: r2,
      review: "The stock market course was exceptionally informative. The well-structured modules made complex financial concepts easy to understand and apply in real-world trading scenarios.",
    },
    {
      name: "BIRENDRA KUMAR",
      college: "TMB University",
      course: "Stock Marketing",
      image: r1,
      review: "Great mentorship and practical training. Completing my internship here significantly boosted my confidence and gave me a clear perspective on market dynamics.",
    },
    {
      name: "MITHUN PRAJAPATI",
      college: "VIT Bhopal",
      course: "Full Stack Development",
      image: r3,
      review: "The Full Stack Web Development internship was truly interactive. The mentor support was excellent, helping me build production-ready applications with modern stacks.",
    },
    {
      name: "PRABHLEEN KAUR",
      college: "Govt Girls College",
      course: "Artificial Intelligence",
      image: r4,
      review: "A joyful and enriching AI internship experience. Concepts were explained with extreme clarity, and the hands-on projects were perfect for skill building.",
    },
    {
      name: "ROHAN SINGH",
      college: "Amrita University",
      course: "Embedded System",
      image: r5,
      review: "The learning environment was incredibly supportive. The team's guidance during my Embedded Systems training was instrumental in my career progression.",
    },
    {
      name: "MANISH KUMAR",
      college: "DY Patil University",
      course: "Data Science",
      image: r6,
      review: "Loved the learning experience. The mentors are amazingly knowledgeable, and the doubt-resolution system is one of the best I've encountered in online learning.",
    },
  ];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    speed: 1000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-4 pb-8">
              <div className="bg-white rounded-[32px] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-[380px] hover:shadow-[0_20px_50px_rgba(255,107,45,0.1)] transition-all duration-500 group">
                
                {/* Header: Rating & Verified */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} fill="#ff6b2d" className="text-orange-600" />
                    ))}
                  </div>
                  <div className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} />
                    VERIFIED LEARNER
                  </div>
                </div>

                {/* Body: Review Text */}
                <div className="flex-1 overflow-hidden">
                  <p className="text-slate-600 text-lg leading-relaxed italic line-clamp-6">
                    "{item.review}"
                  </p>
                </div>

                {/* Footer: User Profile */}
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-600 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-slate-900 font-bold truncate leading-tight">{item.name}</h4>
                    <p className="text-orange-600 text-xs font-bold mt-1 truncate">{item.course}</p>
                    <p className="text-slate-400 text-[10px] truncate mt-0.5">{item.college}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonial;
