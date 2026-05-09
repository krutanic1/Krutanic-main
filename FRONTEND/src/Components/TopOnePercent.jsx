import React from "react";
import {
  MonitorPlay,
  CalendarDays,
  BarChart3,
  FileSearch,
  Building2,
  BadgeCheck,
  UserCheck,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    Icon: MonitorPlay,
    title: "Live Cohort-Based Learning",
    sub: "Participate in real-time labs and discussions. Build skills through interactive sessions with peers and experts.",
  },
  {
    Icon: CalendarDays,
    title: "24-Week Intensive Career Program",
    sub: "Follow a structured, week-by-week roadmap. Master everything from core fundamentals to advanced industry-standard tools.",
  },
  {
    Icon: BarChart3,
    title: "Real Industry Projects & Case Studies",
    sub: "Build a job-ready portfolio. Work on actual business datasets from retail, finance, and healthcare sectors.",
  },
  {
    Icon: FileSearch,
    title: "Premium Career Support Ecosystem",
    sub: "Get noticed by top recruiters. We optimize your professional profiles and conduct technical mock interviews.",
  },
  {
    Icon: Building2,
    title: "15 Guaranteed Interview Opportunities*",
    sub: "Fast-track your job search. Get direct access to 500+ hiring partners actively looking for talent.",
  },
  {
    Icon: BadgeCheck,
    title: "Multiple Industry Certifications",
    sub: "Validate your expertise. Earn industry-recognized credentials that demonstrate your proficiency to global employers.",
  },
  {
    Icon: UserCheck,
    title: "Expert Mentorship from Industry Leaders",
    sub: "Get industry-specific guidance. Learn directly from professionals currently working as Lead Experts and Senior Architects.",
  },
  {
    Icon: TrendingUp,
    title: "Built for Serious Career Growth",
    sub: "Targeted at career success. Every module is engineered to bridge the gap between your current role and your target career.",
  },
];

const TopOnePercent = ({ 
  accentColor = "#4DD0C3",
  badge = "Career Acceleration",
  title = "Built for Serious Career Growth",
  titleHighlight = "Serious Career Growth",
  subtitle = "A live, 24-week program with real projects, 1:1 mentorship, and structured placement support — built for people who want an actual transition in their career.",
  customFeatures = null
}) => {
  const displayFeatures = customFeatures || features;

  return (
    <section
      style={{
        padding: "40px 24px",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      {/* Outer container */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "transparent",
          borderRadius: "20px",
          padding: "56px 48px",
          position: "relative",
        }}
      >


        {/* Heading block */}
        <div style={{ textAlign: "left", marginBottom: "48px" }}>
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #E0F7F4, #b2f0eb)",
              color: "#0F766E",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "6px 18px",
              borderRadius: "100px",
              marginBottom: "18px",
              border: "1px solid #99e6df",
            }}
          >
            {badge}
          </span>

          <h2
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              color: "#1A202C",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {title.split(titleHighlight).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span
                    style={{
                      background: "linear-gradient(90deg, #0F766E, #4DD0C3)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {titleHighlight}
                  </span>
                )}
              </React.Fragment>
            ))}
          </h2>

          <p
            style={{
              marginTop: "14px",
              fontSize: "16px",
              color: "#718096",
              fontWeight: 500,
              maxWidth: "560px",
              margin: "14px 0 0",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Styles */}
        <style>{`
          .top1pct-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }
          @media (max-width: 1024px) {
            .top1pct-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .top1pct-grid { grid-template-columns: 1fr; }
            .top1pct-section-inner { padding: 32px 20px !important; }
          }

          .top1pct-card {
            background: #FAFFFE;
            border-radius: 14px;
            padding: 26px 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
            cursor: default;
          }
          .top1pct-card:hover {
            transform: translateY(-4px);
          }

          .top1pct-icon-wrap {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #E0F7F4 0%, #c9f0eb 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 1px solid #a7e8e0;
            color: #0F766E;
            transition: background 0.2s, transform 0.2s;
          }
          .top1pct-card:hover .top1pct-icon-wrap {
            background: linear-gradient(135deg, #4DD0C3 0%, #34B5A8 100%);
            color: #fff;
            transform: scale(1.08);
          }

          .top1pct-title {
            font-size: 14.5px;
            font-weight: 700;
            color: #1A202C;
            line-height: 1.4;
            margin-bottom: 5px;
          }
          .top1pct-sub {
            font-size: 13px;
            color: #64748B;
            font-weight: 500;
            line-height: 1.55;
          }
        `}</style>

        {/* Feature grid */}
        <div className="top1pct-grid">
          {displayFeatures.map(({ Icon, title, sub }, i) => (
            <div key={i} className="top1pct-card">
              <div className="top1pct-icon-wrap">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <div>
                <div className="top1pct-title">{title}</div>
                <div className="top1pct-sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "36px",
            fontSize: "12px",
            color: "#A0AEC0",
            fontWeight: 500,
          }}
        >
          * Interview referrals and placement support are provided to learners who complete
          the full program and meet our placement eligibility criteria.
        </p>
      </div>
    </section>
  );
};

export default TopOnePercent;
