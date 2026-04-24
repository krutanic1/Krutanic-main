import React from "react";

/**
 * CourseHeroBanner
 * Full-width CSS-rendered hero banner for individual course pages.
 * Matches the BannerSlider theme — no images required.
 *
 * Props:
 *  badge      – small label text  e.g. "Full Stack Development"
 *  icon       – emoji or text icon e.g. "⚡"
 *  title      – main course name  e.g. "MERN Stack"
 *  highlight  – coloured subtitle e.g. "Development"
 *  sub        – description text
 *  tags       – array of up to 4 tag strings
 *  bg         – CSS gradient string for background
 *  accent     – hex colour for highlights
 *  shape      – 1-2 letter decorative char e.g. "M"
 */
const CourseHeroBanner = ({
  badge = "Advanced Program",
  icon = "🚀",
  title = "Advanced Course",
  highlight = "Advanced Program",
  sub = "A premium, high-impact learning path for modern professionals.",
  stats = [],
  tags = [],
  bg = "linear-gradient(135deg, #0d1b2a 0%, #1a2e4a 45%, #0a3d62 100%)",
  accent = "#00d2ff",
  shape = "X",
  children,
}) => {
  const accentSoft = accent + "1a";

  return (
    <>
      <style>{`
        .chb-wrap {
          width: 100%;
          min-height: 65vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 60px 0;
        }

        .chb-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 1;
        }

        .chb-orb1 {
          position: absolute;
          width: 45%;
          height: 120%;
          top: -10%;
          right: -5%;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 1;
        }

        .chb-deco {
          position: absolute;
          right: 2%;
          top: 50%;
          transform: translateY(-50%);
          font-size: clamp(120px, 25vw, 400px);
          font-weight: 950;
          opacity: 0.04;
          color: #fff;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .chb-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 5;
        }

        .chb-content {
          max-width: 720px;
        }

        .chb-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid;
          margin-bottom: 24px;
        }

        .chb-title {
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.05;
          color: #ffffff;
          margin: 0 0 12px;
          letter-spacing: -1.5px;
        }

        .chb-highlight {
          display: block;
          font-size: clamp(18px, 2.5vw, 32px);
          font-weight: 700;
          margin-bottom: 24px;
          opacity: 0.95;
        }

        .chb-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 580px;
        }

        .chb-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .chb-stat-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .chb-stat-val {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }

        .chb-stat-lbl {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }

        .chb-media {
          position: relative;
        }

        .chb-media-box {
          background: rgba(255,255,255,0.03);
          border-radius: 32px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
          aspect-ratio: 16/10;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .chb-media-box > * { width: 100% !important; height: 100% !important; object-fit: cover; }

        @media (max-width: 1024px) {
          .chb-container { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .chb-content { margin: 0 auto; }
          .chb-stats-grid { justify-content: center; max-width: 500px; margin: 0 auto 32px; }
          .chb-sub { margin-left: auto; margin-right: auto; }
          .chb-deco { display: none; }
        }

        @media (max-width: 640px) {
          .chb-stats-grid { grid-template-columns: 1fr; }
          .chb-wrap { min-height: auto; padding: 40px 0; }
        }
      `}</style>

      <div className="chb-wrap" style={{ background: bg }}>
        <div className="chb-grid-overlay" />
        <div className="chb-orb1" style={{ background: accent }} />
        <div className="chb-deco">{shape}</div>

        <div className="chb-container">
          <div className="chb-content">
            <span
              className="chb-badge"
              style={{
                borderColor: accent + "50",
                background: accentSoft,
                color: accent,
              }}
            >
              {icon}&nbsp;&nbsp;{badge}
            </span>

            <h1 className="chb-title">{title}</h1>
            <span className="chb-highlight" style={{ color: accent }}>
              {highlight}
            </span>

            <p className="chb-sub">{sub}</p>

            {stats.length > 0 && (
              <div className="chb-stats-grid">
                {stats.map((s) => (
                  <div className="chb-stat-item" key={s.label}>
                    <span className="chb-stat-val">{s.value}</span>
                    <span className="chb-stat-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {children && (
            <div className="chb-media">
              <div className="chb-media-box">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseHeroBanner;
