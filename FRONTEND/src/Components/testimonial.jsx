import React from 'react';
import Slider from 'react-slick';
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
      review:
        "Recently completed the stock market course and found it exceptionally informative and beneficial. The course was well-structured, making complex concepts easy to understand and practical to apply.",
    },
    {
      name: "BIRENDRA KUMAR",
      college: "TMB University",
      course: "Stock Marketing",
      image: r1,
      review:
        "I completed my internship in stock market and also pursued more courses here. Great mentorship and training made a significant positive impact on my learning journey.",
    },
    {
      name: "MITHUN PRAJAPATI",
      college: "VIT Bhopal",
      course: "Full Stack Web Development",
      image: r3,
      review:
        "Successfully completed my full stack web development internship at Krutanic. Sessions were interactive, practical, and highly engaging with excellent mentor support.",
    },
    {
      name: "PRABHLEEN KAUR",
      college: "Government Girls College",
      course: "Artificial Intelligence",
      image: r4,
      review:
        "A joyful experience while pursuing my internship in artificial intelligence. The mentor was cooperative, kind, and explained every concept with clarity.",
    },
    {
      name: "ROHAN SINGH",
      college: "Amrita Vidyapeeth University",
      course: "Embedded System",
      image: r5,
      review:
        "Recently completed an internship with Krutanic and it was enriching. The learning environment was supportive and the team guidance was excellent.",
    },
    {
      name: "MANISH KUMAR",
      college: "DY Patil University",
      course: "Data Science",
      image: r6,
      review:
        "Loved my learning experience with Krutanic. The mentor was amazing and knowledgeable, and the team helped resolve doubts quickly throughout the course.",
    },
  ];

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: 'linear',
    dots: false,
    speed: 7000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="testimonialdiv">
      <div className="testimonialcontainer">
        <Slider {...settings}>
          {testimonials.map((item) => (
            <div key={item.name} className="feedback-slide">
              <article className="feedback-card">
                <div className="feedback-quote-wrap">
                  <p>{item.review}</p>
                </div>

                <div className="feedback-user">
                  <img alt={item.name} src={item.image} />
                  <div>
                    <h2>{item.name}</h2>
                    <h3>{item.college}</h3>
                    <p>{item.course}</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonial;
