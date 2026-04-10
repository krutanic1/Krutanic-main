import React, { useState } from "react";
import PMHero from "../../../krutanic/images/pmad1.jpg";
import PMOutcomes from "../../../krutanic/images/pmad2.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfpmm from "../../../krutanic/Product management Advanced program.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
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
    title: "Introduction to Product Management",
    objectives:
      "Build foundational PM thinking around product lifecycle, user pain points, and business impact metrics.",
    topics: [
      "PM Role and Scope",
      "Product Lifecycle",
      "User Needs Mapping",
      "PM Metrics",
      "Stakeholder Context",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Market Research and Competitive Analysis",
    objectives:
      "Use market intelligence frameworks to prioritize opportunities and position products effectively.",
    topics: [
      "Customer Discovery",
      "Competitive Analysis",
      "Trend Mapping",
      "Opportunity Sizing",
      "SWOT Application",
    ],
  },
  {
    week: "Week 5-6",
    title: "Product Vision and Strategy",
    objectives:
      "Define product vision and convert strategic goals into clear roadmap initiatives.",
    topics: [
      "Vision Crafting",
      "Strategic Frameworks",
      "Goal Alignment",
      "Roadmap Planning",
      "Prioritization",
    ],
  },
  {
    week: "Week 7-8",
    title: "Agile Product Development",
    objectives:
      "Execute agile product cycles with cross-functional teams using iterative delivery systems.",
    topics: [
      "Agile Principles",
      "Scrum and Kanban",
      "User Stories",
      "Backlog Grooming",
      "Sprint Rituals",
    ],
  },
  {
    week: "Week 9-10",
    title: "Product Design and UX",
    objectives:
      "Translate user insight into usable product experiences through testing and design collaboration.",
    topics: [
      "Design Thinking",
      "Wireframing",
      "Usability Testing",
      "User Research",
      "Feedback Loops",
    ],
  },
  {
    week: "Week 11-12",
    title: "Data-Driven Decision Making",
    objectives:
      "Use analytics and experimentation to validate hypotheses and optimize product outcomes.",
    topics: [
      "Product Analytics",
      "KPI Frameworks",
      "A/B Testing",
      "Experiment Design",
      "Data Visualization",
    ],
  },
  {
    week: "Week 13-14",
    title: "Pricing and Monetization",
    objectives:
      "Develop monetization models and pricing strategy aligned with product value and market dynamics.",
    topics: [
      "Pricing Models",
      "Revenue Design",
      "Price Sensitivity",
      "Unit Economics",
      "Monetization Metrics",
    ],
  },
  {
    week: "Week 15-16",
    title: "Stakeholder Management",
    objectives:
      "Drive alignment across business, design, engineering, and GTM teams through structured communication.",
    topics: [
      "Stakeholder Mapping",
      "Executive Communication",
      "Conflict Resolution",
      "Alignment Frameworks",
      "Decision Hygiene",
    ],
  },
  {
    week: "Week 17-18",
    title: "Product Launch and Go-to-Market",
    objectives:
      "Plan launch strategy from positioning to execution with measurable launch success metrics.",
    topics: [
      "Launch Planning",
      "Positioning",
      "Messaging",
      "GTM Channels",
      "Launch Measurement",
    ],
  },
  {
    week: "Week 19-20",
    title: "Scaling Products",
    objectives:
      "Manage growth-stage product operations while balancing technical constraints and user outcomes.",
    topics: [
      "Scaling Operations",
      "Portfolio Management",
      "Continuous Improvement",
      "Technical Debt",
      "Growth Trade-offs",
    ],
  },
  {
    week: "Week 21-22",
    title: "Emerging Trends in PM",
    objectives:
      "Integrate AI, PLG, and modern product tooling into your product leadership toolkit.",
    topics: [
      "AI in PM",
      "Product-Led Growth",
      "No-Code Tooling",
      "Sustainability Lens",
      "Future PM Skills",
    ],
  },
  {
    week: "Week 23-24",
    title: "Capstone and Placement Preparation",
    objectives:
      "Deliver an end-to-end product case and position yourself strongly for PM interviews.",
    topics: [
      "Capstone Case",
      "Resume and Portfolio",
      "Interview Frameworks",
      "Networking Strategy",
      "Career Positioning",
    ],
  },
];

const overviewTopics = [
  "Product Roadmapping",
  "Agile and Lean Product Workflows",
  "User-Centered Product Design",
  "Market and Competitor Intelligence",
  "Go-to-Market Execution",
  "Data-Informed Product Decisions",
];

const whyChoose = [
  {
    title: "High Demand",
    description:
      "Companies increasingly rely on strong PM talent to lead product innovation and growth.",
  },
  {
    title: "Competitive Salaries",
    description:
      "Product roles are among the highest growth and highest value positions in technology teams.",
  },
  {
    title: "Cross-Functional Leadership",
    description:
      "PMs shape outcomes by coordinating design, engineering, marketing, and business teams.",
  },
  {
    title: "Impactful Work",
    description:
      "You influence real user experiences and business outcomes through every product decision.",
  },
  {
    title: "Strategic + Execution Blend",
    description:
      "The role combines big-picture strategy with practical day-to-day problem solving.",
  },
  {
    title: "Strong Career Progression",
    description:
      "Career paths expand into leadership roles like Head of Product, VP Product, and CPO.",
  },
];

const keyTakeaways = [
  "Develop product sense through user, market, and business understanding.",
  "Build roadmaps that align strategy with execution and measurable outcomes.",
  "Lead agile product teams with clear priorities and communication discipline.",
  "Use analytics and experiments to validate product decisions with confidence.",
  "Design product launches with positioning, messaging, and GTM alignment.",
  "Create a portfolio-grade capstone case for interviews and career growth.",
];

const roles = [
  {
    title: "Product Manager",
    text: "Own product direction, prioritization, and cross-functional execution.",
    avg: "Package range: Rs 10-28 LPA",
  },
  {
    title: "Product Marketing Manager",
    text: "Lead product positioning, messaging, and go-to-market strategy.",
    avg: "Package range: Rs 8-22 LPA",
  },
  {
    title: "Product Owner",
    text: "Manage backlog quality and align delivery with user and business outcomes.",
    avg: "Package range: Rs 9-22 LPA",
  },
  {
    title: "Product Analyst",
    text: "Use behavioral and product data to guide prioritization and improvements.",
    avg: "Package range: Rs 6-16 LPA",
  },
  {
    title: "Growth Product Manager",
    text: "Drive growth loops and retention strategy through product experimentation.",
    avg: "Package range: Rs 12-30 LPA",
  },
  {
    title: "UX Product Strategist",
    text: "Bridge user research, design quality, and product outcomes.",
    avg: "Package range: Rs 8-20 LPA",
  },
  {
    title: "Product Development Lead",
    text: "Coordinate full product lifecycle from problem definition to launch.",
    avg: "Package range: Rs 12-26 LPA",
  },
  {
    title: "VP Product",
    text: "Lead portfolio strategy and product organization alignment.",
    avg: "Package range: Rs 35-90 LPA",
  },
  {
    title: "Chief Product Officer",
    text: "Own company-wide product vision, innovation, and strategic direction.",
    avg: "Package range: Rs 50-120 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the Product Management program?",
      answer:
        "The program covers product strategy, agile execution, UX, analytics, GTM, and product leadership fundamentals.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, practical assignments, and capstone-oriented learning.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, through product cases, strategy exercises, and an end-to-end capstone project.",
    },
    {
      question: "How long is the program?",
      answer: "The program runs for 24 weeks.",
    },
  ],
  Eligibility: [
    {
      question: "What are the prerequisites for this program?",
      answer:
        "No strict prerequisites. Curiosity, problem-solving mindset, and consistency are key.",
    },
    {
      question: "Do I need prior PM experience?",
      answer:
        "No, the curriculum supports both beginners and professionals transitioning into PM roles.",
    },
    {
      question: "Can beginners apply?",
      answer: "Yes, beginners can apply and build from fundamentals to advanced PM execution.",
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
        "Through cohort groups, peer review sessions, project collaboration, and networking touchpoints.",
    },
    {
      question: "Is mentorship available?",
      answer:
        "Yes, mentors guide product thinking, case quality, and career preparation.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni channels and support resources remain available.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "Learners come from engineering, business, design, and operations backgrounds.",
    },
  ],
  Lectures: [
    {
      question: "Are sessions live or recorded?",
      answer: "Both live and recorded content are included for flexibility.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Sessions include case-based discussions, framework drills, and practical feedback.",
    },
    {
      question: "Can I replay missed lectures?",
      answer: "Yes, recordings are available for review.",
    },
    {
      question: "How often are live sessions held?",
      answer: "Live sessions are conducted weekly.",
    },
  ],
  Certification: [
    {
      question: "Will I receive a certificate on completion?",
      answer: "Yes, successful learners receive a professional completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It demonstrates product execution capability and portfolio-backed readiness.",
    },
    {
      question: "Can I add the certification to resume or LinkedIn?",
      answer: "Yes, it is intended for professional showcase.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, certification is included for successful completion.",
    },
  ],
  Opportunities: [
    {
      question: "What roles can I target after the program?",
      answer:
        "You can target PM, Product Analyst, Product Owner, PMM, and growth-focused product roles.",
    },
    {
      question: "Is placement support included?",
      answer: "Yes, placement assistance and interview prep are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Selected learners may get internship and project opportunities based on partner openings.",
    },
    {
      question: "How does this help career growth?",
      answer:
        "You build strategic and execution depth with a strong capstone portfolio for PM interviews.",
    },
  ],
};

const ProductManagement = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="pm-page">
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

        .pm-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .pm-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .pm-btn {
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

        .pm-section { padding: 52px 0; }
        .pm-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .pm-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .pm-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .pm-chip {
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

        .pm-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .pm-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .pm-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .pm-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 420px;
          margin-bottom: 18px;
        }

        .pm-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .pm-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .pm-stat-value { font-size: 18px; font-weight: 700; }

        .pm-hero-media { position: relative; }

        .pm-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .pm-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .pm-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .pm-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .pm-accordion { display: grid; gap: 14px; }

        .pm-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .pm-module.open { border-color: #d05b36; }

        .pm-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .pm-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pm-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .pm-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .pm-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .pm-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .pm-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .pm-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .pm-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .pm-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .pm-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .pm-overview-grid,
        .pm-why-grid,
        .pm-role-grid,
        .pm-metric-grid,
        .pm-faq-grid {
          display: grid;
          gap: 16px;
        }

        .pm-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pm-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pm-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pm-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .pm-faq-grid { grid-template-columns: 250px 1fr; }

        .pm-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .pm-card h4 { margin: 0 0 8px; font-size: 20px; }
        .pm-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .pm-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .pm-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .pm-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .pm-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .pm-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .pm-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .pm-center { text-align: center; }

        .pm-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .pm-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .pm-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .pm-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }
        
        .pm-role-card h4 {
          font-weight: 700;
        }

        .pm-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .pm-fixed-price {
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

        .pm-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .pm-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .pm-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .pm-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .pm-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .pm-invest h3 { font-size: 40px; margin: 6px 0; }
        .pm-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .pm-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .pm-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .pm-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .pm-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .pm-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .pm-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .pm-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .pm-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .pm-break-row:last-child { border-bottom: 0; }

        .pm-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .pm-partner img { height: 76px; object-fit: contain; }

        .pm-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .pm-faq-menu button {
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

        .pm-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .pm-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .pm-faq-head {
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

        .pm-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .pm-hero,
          .pm-curr-grid,
          .pm-overview-grid,
          .pm-why-grid,
          .pm-role-grid,
          .pm-metric-grid,
          .pm-pay-grid,
          .pm-faq-grid,
          .pm-takeaway-grid,
          .pm-invest-grid {
            grid-template-columns: 1fr;
          }

          .pm-floating-card { left: 14px; }
          .pm-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .pm-section { padding: 42px 0; }
          .pm-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="pm-shell">
        <section className="pm-hero">
          <div>
            <div className="pm-chip">Advanced Program 2026</div>
            <h1>Master the <span>Craft</span> of Product.</h1>
            <p className="pm-sub">
              A premium learning path for modern product leaders to build, launch, and scale products with strategic clarity.
            </p>

            <div className="pm-stats">
              {heroStats.map((item) => (
                <article className="pm-stat" key={item.label}>
                  <div className="pm-stat-label">{item.label}</div>
                  <div className="pm-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Product Management" />
          </div>

          <div className="pm-hero-media">
            <div className="pm-media-box">
              <img src={PMHero} alt="Product management mentor" />
            </div>
            <aside className="pm-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build portfolio-ready product cases and strategic execution depth for top PM roles.</p>
            </aside>
          </div>
        </section>

        <section className="pm-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A rigorous pathway from product foundations to strategic execution and leadership-ready decision making.
          </p>

          <div className="pm-curr-grid">
            <div className="pm-accordion">
              {curriculum.map((module, index) => {
                const isOpen = openModule === index;
                return (
                  <article className={`pm-module ${isOpen ? "open" : ""}`} key={module.title}>
                    <div
                      className="pm-module-head"
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
                        <div className="pm-module-week">{module.week}</div>
                        <div className="pm-module-title">{module.title}</div>
                      </div>
                      <span className="pm-module-toggle">{isOpen ? "-" : "+"}</span>
                    </div>

                    {isOpen && (
                      <div className="pm-module-body">
                        <p className="pm-module-objective">{module.objectives}</p>
                        <div className="pm-tag-wrap">
                          {module.topics.map((topic) => (
                            <span className="pm-tag" key={topic}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="pm-side-panel">
              <h3>Speak with an Advisor</h3>
              <p>Get a personalized roadmap to transition into high-impact product roles.</p>
              <ApplyForm />
            </aside>
          </div>
        </section>

        <section className="pm-section">
          <h2>Program Overview</h2>
          <div className="pm-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="pm-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="pm-section">
          <h2>Why Choose Product Management?</h2>
          <p className="lead">Build strategic leverage by solving the right product problems with execution excellence.</p>
          <div className="pm-why-grid">
            {whyChoose.map((item) => (
              <article className="pm-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pm-section">
          <h2>Key Takeaways</h2>
          <div className="pm-takeaway-grid">
            <ul className="pm-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="pm-image">
              <img src={PMOutcomes} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="pm-section">
          <BenefitsofLearning />
        </section>

        <section className="pm-section">
          <div className="pm-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access the detailed curriculum, product templates, and capstone structure.
              </p>
            </div>
            <a href={pdfpmm} target="_blank" rel="noreferrer" className="pm-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="pm-section pm-career">
        <div className="pm-shell">
          <div className="pm-center">
            <h2>Career Opportunities in Product Management</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              Build readiness for strategic product, growth, and leadership-oriented PM roles.
            </p>
          </div>

          <div className="pm-role-grid">
            {roles.map((role) => (
              <article className="pm-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="pm-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pm-section">
        <div className="pm-shell">
          <h2 className="pm-center">Our Alumni at Top Brands</h2>
          <p className="lead pm-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="pm-section">
        <div className="pm-shell">
          <h2 className="pm-center">Course Benefits at a Glance</h2>
          <div className="pm-metric-grid">
            <article className="pm-metric"><h4>250+</h4><p>Mentees Placed</p></article>
            <article className="pm-metric"><h4>12+ LPA</h4><p>Average CTC</p></article>
            <article className="pm-metric"><h4>91%</h4><p>Placement Rate</p></article>
            <article className="pm-metric"><h4>420+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="pm-section">
        <div className="pm-shell">
          <Certification />
        </div>
      </section>

      <section className="pm-section">
        <div className="pm-shell">
          <div className="pm-invest">
            <div className="pm-invest-sub">Program Investment</div>
            <h3>Rs 65,999</h3>
            <div className="pm-invest-sub">Total fee (incl. GST)</div>

            <div className="pm-invest-grid">
              <div className="pm-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="pm-invest-item">
                <strong>Installment 1: Rs 28,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="pm-invest-item">
                <strong>Installment 2: Rs 27,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="pm-pay-grid">
            <div className="pm-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 65,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="pm-breakdown">
              <div className="pm-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="pm-break-row"><span>Installment 1</span><strong>Rs 28,000</strong></div>
              <div className="pm-break-row"><span>Installment 2</span><strong>Rs 27,999</strong></div>
            </div>
          </div>

          <div className="pm-partner">
            <p className="pm-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="pm-section" style={{ background: "#fff" }}>
        <div className="pm-shell">
          <StoreSection />
        </div>
      </section>

      <section className="pm-section" style={{ background: "#fff" }}>
        <div className="pm-shell">
          <h2 className="pm-center">Ask Us Anything</h2>
          <div className="pm-faq-grid">
            <aside className="pm-faq-menu">
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
                <article className="pm-faq-item" key={faq.question}>
                  <button
                    className="pm-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="pm-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pm-fixed-price">Price: <strong>Rs 65,999 inclusive of taxes</strong></div>
    </div>
  );
};

export default ProductManagement;
