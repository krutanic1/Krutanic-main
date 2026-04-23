import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  { img: "/posters/mern.png", link: "/MernStack" },
  { img: "/posters/data science.png", link: "/DataScience" },
  { img: "/posters/degital marketing.png", link: "/DigitalMarket" },
  { img: "/posters/data analyst.png", link: "/DataAnalytics" },
  { img: "/posters/prodect mangement.png", link: "/ProductManagement" },
  { img: "/posters/prompt_eng.png", link: "/PromptEngineering" },
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div 
      className="w-full overflow-hidden relative shadow-[0_4px_30px_rgba(0,0,0,0.08)] group bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        .slide-container {
          display: flex;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .slide-item {
          min-width: 100%;
        }
        .banner-img {
          width: 100%;
          object-fit: cover;
          display: block;
          /* Mobile height & focus (Stay Perfect) */
          height: 200px;
          object-position: right center;
        }
        @media (min-width: 768px) {
          .banner-img {
            height: 380px;
            object-position: center center;
          }
        }
        @media (min-width: 1024px) {
          .banner-img {
            height: 600px;
            object-position: center top; /* Priority to show the heading text */
          }
        }
      `}</style>

      {/* Slides */}
      <div 
        className="slide-container"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="slide-item">
            <Link to={slide.link} className="block w-full h-full">
              <img 
                src={slide.img} 
                alt={`Banner ${index + 1}`}
                className="banner-img"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
              current === index 
                ? 'bg-[#FF6B35] scale-125 shadow-[0_0_10px_rgba(255,107,53,0.5)]' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
