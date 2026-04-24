import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    link: "/MernStack",
    badge: "Full Stack Development",
    title: "MERN Stack",
    highlight: "Development",
    sub: "Build production-grade web apps with MongoDB, Express, React & Node.js",
    tag1: "React", tag2: "Node.js", tag3: "MongoDB",
    bg: "linear-gradient(135deg, #0d1b2a 0%, #1a2e4a 45%, #0a3d62 100%)",
    accent: "#00d2ff",
    accentSoft: "rgba(0,210,255,0.12)",
    icon: "⚡",
    shape: "M",
  },
  {
    link: "/DataScience",
    badge: "AI & Analytics",
    title: "Data Science",
    highlight: "Advanced Program",
    sub: "Master Machine Learning, Deep Learning, Python and real-world data pipelines",
    tag1: "Python", tag2: "ML/AI", tag3: "TensorFlow",
    bg: "linear-gradient(135deg, #0b132b 0%, #1c2951 45%, #1a0533 100%)",
    accent: "#a855f7",
    accentSoft: "rgba(168,85,247,0.12)",
    icon: "🧠",
    shape: "DS",
  },
  {
    link: "/DigitalMarket",
    badge: "Marketing & Growth",
    title: "Digital Marketing",
    highlight: "Advanced Program",
    sub: "Drive growth with SEO, Paid Ads, Social Media and Performance Marketing strategies",
    tag1: "SEO", tag2: "Google Ads", tag3: "Meta Ads",
    bg: "linear-gradient(135deg, #1a0a00 0%, #3d1a00 45%, #7c2d00 100%)",
    accent: "#ff6b35",
    accentSoft: "rgba(255,107,53,0.12)",
    icon: "📈",
    shape: "DM",
  },
  {
    link: "/DataAnalytics",
    badge: "Business Intelligence",
    title: "Data Analytics",
    highlight: "Advanced Program",
    sub: "Transform raw data into powerful insights with Excel, Power BI & SQL",
    tag1: "Power BI", tag2: "SQL", tag3: "Excel",
    bg: "linear-gradient(135deg, #001a1a 0%, #003333 45%, #005252 100%)",
    accent: "#00e5c3",
    accentSoft: "rgba(0,229,195,0.12)",
    icon: "📊",
    shape: "DA",
  },
  {
    link: "/ProductManagement",
    badge: "Product Leadership",
    title: "Product Management",
    highlight: "Advanced Program",
    sub: "Lead product vision, roadmaps and cross-functional teams at top tech companies",
    tag1: "Jira", tag2: "Figma", tag3: "Mixpanel",
    bg: "linear-gradient(135deg, #1a0a0a 0%, #3a1212 45%, #6b1a1a 100%)",
    accent: "#ff4d4d",
    accentSoft: "rgba(255,77,77,0.12)",
    icon: "🚀",
    shape: "PM",
  },
  {
    link: "/PromptEngineering",
    badge: "Generative AI",
    title: "Prompt Engineering",
    highlight: "Mastery Program",
    sub: "Design powerful AI prompts for ChatGPT, Claude, Gemini and LLM-powered products",
    tag1: "ChatGPT", tag2: "LLMs", tag3: "Claude",
    bg: "linear-gradient(135deg, #0a001a 0%, #1a0033 45%, #2d0052 100%)",
    accent: "#e040fb",
    accentSoft: "rgba(224,64,251,0.12)",
    icon: "✨",
    shape: "AI",
  },
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
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      style={{ width: '100%', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        .bs-track {
          display: flex;
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .bs-slide {
          min-width: 100%;
          height: 200px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        @media (min-width: 768px) {
          .bs-slide { height: 340px; }
        }
        @media (min-width: 1024px) {
          .bs-slide { height: 50vh; }
        }

        /* Animated background orbs */
        .bs-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
        }
        .bs-orb-1 {
          width: 50%;
          height: 130%;
          top: -15%;
          right: -5%;
        }
        .bs-orb-2 {
          width: 30%;
          height: 80%;
          bottom: -20%;
          left: 10%;
          opacity: 0.18;
        }

        /* Grid lines overlay */
        .bs-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Big decorative letter */
        .bs-deco {
          position: absolute;
          right: 6%;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(80px, 18vw, 260px);
          font-weight: 900;
          letter-spacing: -8px;
          opacity: 0.06;
          color: #fff;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }

        /* Content area */
        .bs-content {
          position: relative;
          z-index: 2;
          padding: clamp(16px, 4vw, 60px) clamp(20px, 6vw, 90px);
          max-width: 700px;
        }

        .bs-badge {
          display: inline-block;
          font-size: clamp(9px, 1.1vw, 13px);
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid;
          margin-bottom: clamp(6px, 1.5vw, 16px);
          color: #fff;
        }

        .bs-title {
          font-size: clamp(22px, 3vw, 56px);
          font-weight: 900;
          line-height: 1.0;
          color: #ffffff;
          margin: 0 0 clamp(4px, 0.8vw, 10px);
          letter-spacing: -1px;
          white-space: nowrap;
        }

        .bs-highlight {
          display: block;
          font-size: clamp(14px, 2.2vw, 36px);
          font-weight: 700;
          margin-bottom: clamp(8px, 1.5vw, 18px);
          opacity: 0.9;
        }

        .bs-sub {
          font-size: clamp(10px, 1.2vw, 17px);
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin-bottom: clamp(10px, 2vw, 28px);
          max-width: 480px;
        }

        .bs-tags {
          display: flex;
          gap: clamp(6px, 1vw, 12px);
          flex-wrap: wrap;
        }

        .bs-tag {
          font-size: clamp(9px, 0.9vw, 13px);
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
        }

        /* CTA button */
        .bs-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(10px, 1vw, 14px);
          font-weight: 700;
          padding: clamp(7px, 1vw, 12px) clamp(14px, 2vw, 26px);
          border-radius: 999px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: #fff;
          margin-top: clamp(8px, 1.5vw, 20px);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bs-cta:hover {
          transform: translateY(-2px);
          text-decoration: none;
          color: #fff;
        }

        /* Nav buttons */
        .bs-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(32px, 4vw, 52px);
          height: clamp(32px, 4vw, 52px);
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s, background 0.2s;
        }
        div:hover .bs-nav-btn { opacity: 1; }
        .bs-nav-btn:hover { background: rgba(255,255,255,0.25); }

        .bs-dots {
          position: absolute;
          bottom: clamp(8px, 2vw, 20px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: clamp(6px, 1vw, 12px);
          z-index: 10;
        }
        .bs-dot {
          width: clamp(6px, 0.7vw, 10px);
          height: clamp(6px, 0.7vw, 10px);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(255,255,255,0.35);
          padding: 0;
        }
        .bs-dot.active {
          background: #fff;
          transform: scale(1.35);
          box-shadow: 0 0 10px rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Track */}
      <div className="bs-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, i) => (
          <div key={i} className="bs-slide" style={{ background: slide.bg }}>
            {/* Grid overlay */}
            <div className="bs-grid" />

            {/* Glow orbs */}
            <div className="bs-orb bs-orb-1" style={{ background: slide.accent }} />
            <div className="bs-orb bs-orb-2" style={{ background: slide.accent }} />

            {/* Big decorative letter */}
            <div className="bs-deco">{slide.shape}</div>

            {/* Content */}
            <div className="bs-content">
              <span
                className="bs-badge"
                style={{ borderColor: slide.accent + '66', background: slide.accentSoft, color: slide.accent }}
              >
                {slide.icon} &nbsp;{slide.badge}
              </span>

              <h2 className="bs-title">{slide.title}</h2>
              <span className="bs-highlight" style={{ color: slide.accent }}>
                {slide.highlight}
              </span>

              <p className="bs-sub">{slide.sub}</p>

              <div className="bs-tags">
                <span className="bs-tag">{slide.tag1}</span>
                <span className="bs-tag">{slide.tag2}</span>
                <span className="bs-tag">{slide.tag3}</span>
              </div>

              <Link
                to={slide.link}
                className="bs-cta"
                style={{
                  background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}aa)`,
                  boxShadow: `0 8px 24px ${slide.accent}44`,
                }}
              >
                Explore Program →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Prev */}
      <button className="bs-nav-btn" style={{ left: 16 }} onClick={prevSlide} aria-label="Previous">
        <FaChevronLeft size={16} />
      </button>

      {/* Next */}
      <button className="bs-nav-btn" style={{ right: 16 }} onClick={nextSlide} aria-label="Next">
        <FaChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="bs-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`bs-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
