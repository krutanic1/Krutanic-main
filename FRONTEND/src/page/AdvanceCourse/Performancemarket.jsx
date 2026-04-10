import React, { useState } from "react";
import PM from "../../assets/Advanced Course Images/Performance marketing/PM.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfpm from "../../../krutanic/Performance marketing Advanced Program.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import ClientsCarousel from "../../Components/our_alumni";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
];

const curriculum = [
  {
    week: "Weeks 1-2",
    title: "Advanced SEO and SEM",
    objectives:
      "Build search strategy with technical SEO, keyword systems, and paid search fundamentals for measurable growth.",
    topics: [
      "On-page and Off-page SEO",
      "Keyword Intelligence",
      "SEO Tooling",
      "SEM Basics",
      "Landing Page Alignment",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Campaign Planning and Strategy",
    objectives:
      "Design high-performance campaigns with clear objectives, KPI frameworks, and audience-led planning.",
    topics: [
      "Objective Setting",
      "Audience Segmentation",
      "Budget Planning",
      "KPI Design",
      "Competitive Benchmarking",
    ],
  },
  {
    week: "Week 5",
    title: "Google Ads and SEM Execution",
    objectives:
      "Create and optimize paid search campaigns through bid strategy, ad quality improvements, and testing loops.",
    topics: [
      "Account Setup",
      "Bidding Strategy",
      "Ad Copy",
      "Quality Score",
      "Search Testing",
    ],
  },
  {
    week: "Week 6-7",
    title: "Social Media Advertising",
    objectives:
      "Deploy social ad campaigns across major platforms with creative optimization and retargeting workflows.",
    topics: [
      "Meta Ads",
      "LinkedIn Ads",
      "Lookalike Audiences",
      "Creative Strategy",
      "Social Insights",
    ],
  },
  {
    week: "Week 8",
    title: "Display and Retargeting",
    objectives:
      "Drive re-engagement and conversion efficiency with display strategy and dynamic retargeting frameworks.",
    topics: [
      "Display Networks",
      "Banner Systems",
      "Retargeting",
      "Audience Signals",
      "Optimization Tools",
    ],
  },
  {
    week: "Week 9-10",
    title: "Conversion Rate Optimization",
    objectives:
      "Improve conversion quality using user behavior insights, funnel analysis, and experiment-driven optimization.",
    topics: [
      "Landing Page CRO",
      "Heatmap Analysis",
      "A/B and Multivariate Tests",
      "Funnel Diagnostics",
      "CRO Tooling",
    ],
  },
  {
    week: "Week 11",
    title: "Performance Email Marketing",
    objectives:
      "Build automated email sequences that improve engagement, conversion, and retention outcomes.",
    topics: [
      "Segmentation",
      "Automation Flows",
      "Open and CTR Tracking",
      "Email Sequences",
      "Lifecycle Journeys",
    ],
  },
  {
    week: "Week 12",
    title: "Marketing Analytics and AI",
    objectives:
      "Use analytics and attribution to evaluate performance and prioritize profitable campaign actions.",
    topics: [
      "GA Tracking",
      "Attribution Models",
      "ROAS Analysis",
      "Data Dashboards",
      "Actionable Insights",
    ],
  },
  {
    week: "Week 13-14",
    title: "Affiliate and Influencer Performance",
    objectives:
      "Scale performance through affiliate and creator channels with trackable ROI frameworks.",
    topics: [
      "Affiliate Programs",
      "Influencer Partnerships",
      "ROI Tracking",
      "Campaign Compliance",
      "Performance Reporting",
    ],
  },
  {
    week: "Week 15-16",
    title: "Advanced Optimization and Scaling",
    objectives:
      "Scale winning campaigns with channel reallocation, automation, and high-confidence reporting.",
    topics: [
      "Campaign Scaling",
      "Automation Workflows",
      "Budget Reallocation",
      "Channel Testing",
      "Performance Reports",
    ],
  },
  {
    week: "Week 17-20",
    title: "Capstone Project",
    objectives:
      "Deliver an end-to-end full-funnel performance campaign with measurable business impact.",
    topics: [
      "Campaign Blueprint",
      "KPI Mapping",
      "Creative and Copy",
      "Cross-channel Execution",
      "Result Presentation",
    ],
  },
  {
    week: "Week 21-24",
    title: "Placement Preparation",
    objectives:
      "Prepare for interviews and hiring processes with strong portfolio evidence and role positioning.",
    topics: [
      "Resume Strategy",
      "Mock Interviews",
      "LinkedIn Positioning",
      "Networking",
      "Portfolio Storytelling",
    ],
  },
];

const overviewTopics = [
  "Paid Media Strategy",
  "Conversion Rate Optimization",
  "Data-Driven Analytics",
  "Social and Search Campaigns",
  "A/B Testing Systems",
  "Attribution and ROI Modeling",
];

const whyChoose = [
  {
    title: "Measurable Impact",
    description:
      "Performance marketing is outcome-driven with direct links to growth and revenue.",
  },
  {
    title: "High Earning Potential",
    description:
      "Roles tied to campaign outcomes and ROI often offer strong compensation.",
  },
  {
    title: "Cross-Channel Expertise",
    description:
      "Build capability across search, social, display, email, and affiliate ecosystems.",
  },
  {
    title: "Continuous Optimization",
    description:
      "Every campaign can be improved through data, testing, and strategic iteration.",
  },
  {
    title: "Business Visibility",
    description:
      "Your work directly affects CAC, conversions, revenue, and profitability metrics.",
  },
  {
    title: "Fast Growth Path",
    description:
      "High-performance marketers quickly progress into strategic growth leadership roles.",
  },
];

const keyTakeaways = [
  "Plan and execute high-performance paid campaigns across key digital channels.",
  "Optimize conversion journeys using CRO principles and experimentation systems.",
  "Build strong reporting frameworks using attribution and ROI analysis.",
  "Use audience segmentation and creative strategy to improve ad efficiency.",
  "Scale campaigns responsibly with budget reallocation and performance controls.",
  "Showcase portfolio-grade campaign execution for hiring and role transitions.",
];

const roles = [
  {
    title: "Performance Marketing Manager",
    text: "Lead paid growth strategy and channel performance optimization.",
    avg: "Package range: Rs 10-22 LPA",
  },
  {
    title: "PPC Specialist",
    text: "Manage paid search and display campaigns for efficient acquisition.",
    avg: "Package range: Rs 5-14 LPA",
  },
  {
    title: "Social Ads Specialist",
    text: "Build and optimize paid campaigns across social ecosystems.",
    avg: "Package range: Rs 5-13 LPA",
  },
  {
    title: "CRO Specialist",
    text: "Improve conversion rates through funnel and landing page optimization.",
    avg: "Package range: Rs 6-15 LPA",
  },
  {
    title: "Marketing Analyst",
    text: "Analyze campaign performance and recommend high-impact optimizations.",
    avg: "Package range: Rs 4-10 LPA",
  },
  {
    title: "Campaign Manager",
    text: "Own campaign execution from strategy through reporting and scale.",
    avg: "Package range: Rs 6-16 LPA",
  },
  {
    title: "Paid Media Manager",
    text: "Drive paid media direction and channel-wise growth outcomes.",
    avg: "Package range: Rs 8-20 LPA",
  },
  {
    title: "Biddable Media Specialist",
    text: "Optimize bids and budgets to maximize return across paid platforms.",
    avg: "Package range: Rs 6-14 LPA",
  },
  {
    title: "Programmatic Specialist",
    text: "Automate and optimize digital ad delivery for precision targeting.",
    avg: "Package range: Rs 7-18 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in this Performance Marketing program?",
      answer:
        "The program covers paid media, CRO, analytics, attribution, campaign testing, and growth execution.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, practical projects, and performance campaign simulations.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, learners work on practical campaign plans, optimization drills, and capstone execution.",
    },
    {
      question: "How long is the program?",
      answer: "The program runs for 24 weeks.",
    },
  ],
  Eligibility: [
    {
      question: "What are the prerequisites?",
      answer:
        "No strict prerequisites. Basic understanding of digital channels is helpful.",
    },
    {
      question: "Do I need prior performance marketing experience?",
      answer:
        "No, beginners and upskillers can both use this path effectively.",
    },
    {
      question: "Can beginners apply?",
      answer: "Yes, the curriculum starts from core concepts and scales to advanced execution.",
    },
    {
      question: "Is there any age restriction?",
      answer: "No, there is no age restriction.",
    },
  ],
  Community: [
    {
      question: "How can I interact with other participants?",
      answer:
        "Through cohort groups, peer review activities, and structured networking sessions.",
    },
    {
      question: "Is mentorship available?",
      answer:
        "Yes, mentors provide campaign feedback, strategic input, and career guidance.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni and support channels remain available.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "Learners come from varied backgrounds including agencies, ecommerce, SaaS, and startups.",
    },
  ],
  Lectures: [
    {
      question: "Are sessions live or recorded?",
      answer: "Both live and recorded content are available for flexible learning.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Sessions include tactical breakdowns, campaign critiques, and real-time Q&A.",
    },
    {
      question: "Can I replay missed lectures?",
      answer: "Yes, recordings are available for all modules.",
    },
    {
      question: "How often are live sessions held?",
      answer: "Live sessions are held weekly.",
    },
  ],
  Certification: [
    {
      question: "Will I receive a certificate upon completion?",
      answer: "Yes, successful learners receive a professional completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It validates applied campaign execution and performance analytics readiness.",
    },
    {
      question: "Can I add this certification to resume or LinkedIn?",
      answer: "Yes, it can be showcased on both.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, certification is included after successful completion.",
    },
  ],
  Opportunities: [
    {
      question: "What career opportunities does this open?",
      answer:
        "You can target PPC, paid media, performance marketing, CRO, and campaign management roles.",
    },
    {
      question: "Will I receive placement assistance?",
      answer: "Yes, placement and interview preparation support are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Selected learners may access internship and project pathways through partner networks.",
    },
    {
      question: "How does this help in career advancement?",
      answer:
        "You develop measurable growth execution depth and portfolio-ready campaign outcomes.",
    },
  ],
};

const Performancemarket = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="pf-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,800&display=swap');

        :root {
          --bg: #f3f1f1;
          --panel: #ffffff;
          --ink: #171717;
          --muted: #626262;
          --line: #ded8d5;
          --accent: #c43609;
          --radius: 18px;
          --shadow: 0 20px 40px rgba(29, 20, 13, 0.08);
        }

        * { box-sizing: border-box; }

        .pf-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .pf-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .pf-btn {
          background: linear-gradient(180deg, #d64d1d 0%, #af2f06 100%);
          border: 0;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
          padding: 10px 18px;
          text-transform: uppercase;
        }

        .pf-section { padding: 52px 0; }
        .pf-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .pf-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .pf-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .pf-chip {
          background: #f0e0db;
          border-radius: 999px;
          color: #8a4f40;
          display: inline-flex;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 6px 12px;
          text-transform: uppercase;
        }

        .pf-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .pf-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .pf-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .pf-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 420px;
          margin-bottom: 18px;
        }

        .pf-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .pf-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .pf-stat-value { font-size: 18px; font-weight: 700; }

        .pf-hero-media { position: relative; }

        .pf-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .pf-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .pf-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .pf-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .pf-accordion { display: grid; gap: 14px; }

        .pf-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .pf-module.open { border-color: #d05b36; }

        .pf-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .pf-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pf-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .pf-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .pf-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .pf-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .pf-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .pf-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .pf-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .pf-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .pf-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .pf-overview-grid,
        .pf-why-grid,
        .pf-role-grid,
        .pf-metric-grid,
        .pf-faq-grid {
          display: grid;
          gap: 16px;
        }

        .pf-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pf-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pf-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pf-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .pf-faq-grid { grid-template-columns: 250px 1fr; }

        .pf-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .pf-card h4 { margin: 0 0 8px; font-size: 20px; }
        .pf-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .pf-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .pf-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .pf-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .pf-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .pf-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .pf-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .pf-center { text-align: center; }

        .pf-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .pf-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .pf-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .pf-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }

        .pf-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .pf-fixed-price {
          align-items: center;
          background: #ffffffee;
          backdrop-filter: blur(6px);
          border-top: 1px solid var(--line);
          bottom: 0;
          color: var(--ink);
          display: flex;
          font-size: 14px;
          font-weight: 700;
          justify-content: flex-start;
          left: 0;
          letter-spacing: 0.4px;
          min-height: 56px;
          padding: 10px 24px;
          position: fixed;
          text-transform: uppercase;
          width: 100%;
          z-index: 120;
        }

        .pf-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .pf-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .pf-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .pf-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .pf-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .pf-invest h3 { font-size: 40px; margin: 6px 0; }
        .pf-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .pf-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .pf-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .pf-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .pf-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .pf-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .pf-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .pf-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .pf-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .pf-break-row:last-child { border-bottom: 0; }

        .pf-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .pf-partner img { height: 76px; object-fit: contain; }

        .pf-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .pf-faq-menu button {
          background: #fff;
          border: 1px solid #e7e0dc;
          border-radius: 10px;
          cursor: pointer;
          display: block;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
          padding: 10px 12px;
          text-align: left;
          width: 100%;
        }

        .pf-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .pf-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .pf-faq-head {
          align-items: center;
          background: #fff;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          padding: 12px 14px;
          width: 100%;
          border: 0;
          font-family: inherit;
          text-align: left;
        }

        .pf-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .pf-hero,
          .pf-curr-grid,
          .pf-overview-grid,
          .pf-why-grid,
          .pf-role-grid,
          .pf-metric-grid,
          .pf-pay-grid,
          .pf-faq-grid,
          .pf-takeaway-grid,
          .pf-invest-grid {
            grid-template-columns: 1fr;
          }

          .pf-floating-card { left: 14px; }
          .pf-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .pf-section { padding: 42px 0; }
          .pf-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="pf-shell">
        <section className="pf-hero">
          <div>
            <div className="pf-chip">Advanced Program 2026</div>
            <h1>Master <span>Performance</span> that Scales Revenue.</h1>
            <p className="pf-sub">
              A premium program for performance marketers who want to plan, execute, and optimize campaigns with measurable business impact.
            </p>

            <div className="pf-stats">
              {heroStats.map((item) => (
                <article className="pf-stat" key={item.label}>
                  <div className="pf-stat-label">{item.label}</div>
                  <div className="pf-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Performance Marketing" />
          </div>

          <div className="pf-hero-media">
            <div className="pf-media-box">
              <img src={PM} alt="Performance marketing mentor" />
            </div>
            <aside className="pf-floating-card">
              <h4>Outcome Focused</h4>
              <p>Design high-ROI growth systems with data-backed execution and optimization frameworks.</p>
            </aside>
          </div>
        </section>

        <section className="pf-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A tactical progression from campaign foundations to multi-channel scaling and performance leadership.
          </p>

          <div className="pf-curr-grid">
            <div className="pf-accordion">
              {curriculum.map((module, index) => {
                const isOpen = openModule === index;
                return (
                  <article className={`pf-module ${isOpen ? "open" : ""}`} key={module.title}>
                    <div
                      className="pf-module-head"
                      role="button"
                      tabIndex={0}
                      onClick={() => setOpenModule(isOpen ? -1 : index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          setOpenModule(isOpen ? -1 : index);
                        }
                      }}
                    >
                      <div>
                        <div className="pf-module-week">{module.week}</div>
                        <div className="pf-module-title">{module.title}</div>
                      </div>
                      <span className="pf-module-toggle">{isOpen ? "-" : "+"}</span>
                    </div>

                    {isOpen && (
                      <div className="pf-module-body">
                        <p className="pf-module-objective">{module.objectives}</p>
                        <div className="pf-tag-wrap">
                          {module.topics.map((topic) => (
                            <span className="pf-tag" key={topic}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="pf-side-panel">
              <h3>Speak with an Advisor</h3>
              <p>Get a personalized roadmap for performance marketing roles and growth tracks.</p>
              <ApplyForm />
            </aside>
          </div>
        </section>

        <section className="pf-section">
          <h2>Program Overview</h2>
          <div className="pf-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="pf-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="pf-section">
          <h2>Why Choose Performance Marketing?</h2>
          <p className="lead">Build one of the most measurable and business-critical skillsets in modern marketing.</p>
          <div className="pf-why-grid">
            {whyChoose.map((item) => (
              <article className="pf-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pf-section">
          <h2>Key Takeaways</h2>
          <div className="pf-takeaway-grid">
            <ul className="pf-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="pf-image">
              <img src={PM} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="pf-section">
          <BenefitsofLearning />
        </section>

        <section className="pf-section">
          <div className="pf-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access detailed curriculum, campaign frameworks, and optimization playbooks.
              </p>
            </div>
            <a href={pdfpm} target="_blank" rel="noreferrer" className="pf-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="pf-section pf-career">
        <div className="pf-shell">
          <div className="pf-center">
            <h2>Career Opportunities in Performance Marketing</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for high-impact paid media, analytics, and growth marketing roles.
            </p>
          </div>

          <div className="pf-role-grid">
            {roles.map((role) => (
              <article className="pf-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="pf-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-shell">
          <h2 className="pf-center">Our Alumni at Top Brands</h2>
          <p className="lead pf-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-shell">
          <h2 className="pf-center">Course Benefits at a Glance</h2>
          <div className="pf-metric-grid">
            <article className="pf-metric"><h4>320+</h4><p>Mentees Placed</p></article>
            <article className="pf-metric"><h4>9+ LPA</h4><p>Average CTC</p></article>
            <article className="pf-metric"><h4>93%</h4><p>Placement Rate</p></article>
            <article className="pf-metric"><h4>520+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-shell">
          <Certification />
        </div>
      </section>

      <section className="pf-section">
        <div className="pf-shell">
          <div className="pf-invest">
            <div className="pf-invest-sub">Program Investment</div>
            <h3>Rs 95,999</h3>
            <div className="pf-invest-sub">Total fee (incl. GST)</div>

            <div className="pf-invest-grid">
              <div className="pf-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="pf-invest-item">
                <strong>Installment 1: Rs 43,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="pf-invest-item">
                <strong>Installment 2: Rs 42,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="pf-pay-grid">
            <div className="pf-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 95,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="pf-breakdown">
              <div className="pf-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="pf-break-row"><span>Installment 1</span><strong>Rs 43,000</strong></div>
              <div className="pf-break-row"><span>Installment 2</span><strong>Rs 42,999</strong></div>
            </div>
          </div>

          <div className="pf-partner">
            <p className="pf-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="pf-section" style={{ background: "#fff" }}>
        <div className="pf-shell">
          <StoreSection />
        </div>
      </section>

      <section className="pf-section" style={{ background: "#fff" }}>
        <div className="pf-shell">
          <h2 className="pf-center">Ask Us Anything</h2>
          <div className="pf-faq-grid">
            <aside className="pf-faq-menu">
              {Object.keys(faqData).map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenFAQ(null);
                  }}
                >
                  {category}
                </button>
              ))}
            </aside>

            <div>
              {faqData[activeCategory].map((faq, index) => (
                <article className="pf-faq-item" key={faq.question}>
                  <button
                    className="pf-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="pf-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pf-fixed-price">Price: <strong>Rs 95,999 inclusive of taxes</strong></div>
    </div>
  );
};

export default Performancemarket;
