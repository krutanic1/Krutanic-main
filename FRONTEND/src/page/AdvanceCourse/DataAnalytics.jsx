import React, { useState } from "react";
import daHero from "../../../krutanic/images/daad1.jpg";
import posterImage from "../../../krutanic/images/poster/dataanalytics.png";
import daOutcomes from "../../../krutanic/images/daad2.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfDataAnalytics from "../../../krutanic/Data Analytics Advanced program.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import ClientsCarousel from "../../Components/our_alumni";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import ImageSlider from "./Components/ImageSlider";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Batch Starting", value: "1 May 2026" },
];

const curriculum = [
  {
    week: "Weeks 1-2",
    title: "Excel Foundations",
    objectives:
      "Build a strong Excel base for data cleaning, transformation, and structured business reporting.",
    topics: [
      "Excel Interface",
      "Data Cleaning",
      "Core Formulas",
      "Text and Date Functions",
      "Filtering and Sorting",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Advanced Excel and Dashboards",
    objectives:
      "Create dynamic analysis models with lookups, pivots, and interactive dashboards.",
    topics: [
      "VLOOKUP and XLOOKUP",
      "INDEX-MATCH",
      "Pivot Tables",
      "Dashboard Design",
      "Conditional Logic",
    ],
  },
  {
    week: "Weeks 5-6",
    title: "SQL Fundamentals",
    objectives:
      "Understand relational data and write SQL queries to extract and summarize insights.",
    topics: [
      "Database Basics",
      "SELECT and WHERE",
      "GROUP BY",
      "Aggregate Functions",
      "Table Management",
    ],
  },
  {
    week: "Weeks 7-8",
    title: "Advanced SQL",
    objectives:
      "Solve business scenarios with joins, subqueries, CTEs, and performance-aware query design.",
    topics: [
      "JOINs",
      "Subqueries",
      "CTEs",
      "Window Logic",
      "Optimization Basics",
    ],
  },
  {
    week: "Weeks 9-10",
    title: "Business Problem Solving",
    objectives:
      "Use analytical frameworks to convert business questions into structured data solutions.",
    topics: [
      "Case Frameworks",
      "Profitability Analysis",
      "Growth Cases",
      "Data Interpretation",
      "Decision Logic",
    ],
  },
  {
    week: "Weeks 11-12",
    title: "Python Foundations",
    objectives:
      "Learn core Python syntax and logic for scalable analysis workflows.",
    topics: [
      "Python Basics",
      "Data Types",
      "Control Flow",
      "Functions",
      "Lists and Comprehensions",
    ],
  },
  {
    week: "Weeks 13-14",
    title: "Python for Data Analysis",
    objectives:
      "Manipulate datasets using NumPy and Pandas for practical business use-cases.",
    topics: [
      "NumPy",
      "Pandas",
      "DataFrames",
      "Cleaning and Transformation",
      "Reusable Workflows",
    ],
  },
  {
    week: "Weeks 15-16",
    title: "Visualization with Python",
    objectives:
      "Generate meaningful visual insights and perform exploratory analysis with clarity.",
    topics: [
      "Visualization Principles",
      "Matplotlib",
      "Seaborn",
      "Trend Analysis",
      "EDA",
    ],
  },
  {
    week: "Weeks 17-18",
    title: "Power BI Foundations",
    objectives:
      "Connect, model, and visualize data with professional BI reporting practices.",
    topics: [
      "Power BI Basics",
      "Data Connections",
      "Transformations",
      "Modeling",
      "Report Building",
    ],
  },
  {
    week: "Weeks 19-20",
    title: "Advanced Power BI and DAX",
    objectives:
      "Build advanced calculations and interactive dashboards using DAX and model relationships.",
    topics: [
      "DAX Fundamentals",
      "Calculated Measures",
      "Dashboard UX",
      "Insight Storytelling",
      "Report Publishing",
    ],
  },
  {
    week: "Weeks 21-22",
    title: "Capstone Project",
    objectives:
      "Integrate SQL, Python, and BI into a complete analytics project for portfolio proof.",
    topics: [
      "Data Pipeline",
      "SQL Analysis",
      "Python Modeling",
      "BI Dashboards",
      "Presentation",
    ],
  },
  {
    week: "Weeks 23-24",
    title: "Placement Preparation",
    objectives:
      "Become interview-ready with portfolio storytelling, profile refinement, and role-based practice.",
    topics: [
      "Resume Strategy",
      "LinkedIn Positioning",
      "Mock Interviews",
      "Case Rounds",
      "Portfolio Review",
    ],
  },
];

const overviewTopics = [
  "Excel to Dashboard Workflows",
  "Advanced SQL Querying",
  "Python Data Analysis",
  "Business Problem Solving",
  "Power BI and DAX",
  "Portfolio-Ready Analytics Projects",
];

const whyChoose = [
  {
    title: "High Market Demand",
    description:
      "Data analytics skills are essential across product, finance, operations, and growth teams.",
  },
  {
    title: "Cross-Industry Mobility",
    description:
      "Analytics professionals can work in nearly every major industry and domain.",
  },
  {
    title: "Practical Tool Stack",
    description:
      "Learn tools used by employers daily: Excel, SQL, Python, and Power BI.",
  },
  {
    title: "Data-Driven Decisions",
    description:
      "Help organizations make faster and better decisions using real evidence.",
  },
  {
    title: "Portfolio-Led Learning",
    description:
      "Build projects that clearly demonstrate execution depth to recruiters.",
  },
  {
    title: "Strong Career Growth",
    description:
      "Analytics creates pathways into product, strategy, and leadership roles.",
  },
];

const keyTakeaways = [
  "Analyze business datasets with structured Excel, SQL, and Python workflows.",
  "Build robust dashboards for stakeholders using Power BI and DAX.",
  "Apply analytical frameworks to solve real business and growth problems.",
  "Translate data into decisions with clear visual and narrative storytelling.",
  "Develop end-to-end portfolio projects that mirror practical analytics work.",
  "Prepare for analytics interviews with role-specific problem-solving depth.",
];

const roles = [
  {
    title: "Data Analyst",
    text: "Convert raw data into actionable business insights for decision teams.",
    avg: "Package range: Rs 4-10 LPA",
  },
  {
    title: "Business Analyst",
    text: "Bridge business context and analytics to drive strategic outcomes.",
    avg: "Package range: Rs 5-12 LPA",
  },
  {
    title: "BI Developer",
    text: "Build scalable dashboards and reporting systems for enterprises.",
    avg: "Package range: Rs 6-14 LPA",
  },
  {
    title: "Reporting Analyst",
    text: "Design recurring reports and KPI systems for executive tracking.",
    avg: "Package range: Rs 4-9 LPA",
  },
  {
    title: "Product Analyst",
    text: "Use user and product metrics to improve feature and roadmap outcomes.",
    avg: "Package range: Rs 7-16 LPA",
  },
  {
    title: "SQL Developer",
    text: "Design and optimize SQL-driven data extraction and transformation.",
    avg: "Package range: Rs 5-12 LPA",
  },
  {
    title: "Marketing Analyst",
    text: "Evaluate campaign performance and optimize channel ROI.",
    avg: "Package range: Rs 4-10 LPA",
  },
  {
    title: "Financial Analyst",
    text: "Support finance decisions through quantitative models and reporting.",
    avg: "Package range: Rs 5-12 LPA",
  },
  {
    title: "Operations Analyst",
    text: "Improve process efficiency through operational data insights.",
    avg: "Package range: Rs 4-10 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What is the duration of this program?",
      answer:
        "The Data Analytics program runs for 24 weeks from fundamentals to capstone and placement preparation.",
    },
    {
      question: "Which tools will I learn?",
      answer:
        "You will learn Excel, SQL, Python, Power BI, and practical analytics workflows.",
    },
    {
      question: "Is this beginner friendly?",
      answer:
        "Yes, the learning path is structured for beginners and progressing professionals.",
    },
    {
      question: "Will there be practical projects?",
      answer:
        "Yes, the course includes assignments, case studies, and a portfolio-ready capstone.",
    },
  ],
  Certification: [
    {
      question: "Will I get a certificate after completion?",
      answer:
        "Yes, successful learners receive a Data Analytics completion certificate.",
    },
    {
      question: "Can I use this certificate on LinkedIn and resume?",
      answer: "Yes, you can showcase it on professional profiles and documents.",
    },
    {
      question: "Does the certificate include project proof?",
      answer:
        "Your capstone and case projects can be added to your portfolio alongside the certificate.",
    },
    {
      question: "Is the certificate included in the fee?",
      answer: "Yes, certification is included in the program fee.",
    },
  ],
  Opportunities: [
    {
      question: "What roles can I target after this course?",
      answer:
        "You can target Data Analyst, BI Developer, Business Analyst, Reporting Analyst, and SQL-focused roles.",
    },
    {
      question: "Will I get placement guidance?",
      answer:
        "Yes, the program includes resume support, interview preparation, and portfolio review.",
    },
    {
      question: "Are there interview preparation sessions?",
      answer:
        "Yes, the final phase includes mock interviews and role-based case practice.",
    },
    {
      question: "How is this different from short tool-based courses?",
      answer:
        "It combines tools, business problem solving, projects, and placement preparation in one path.",
    },
  ],
};

const DataAnalytics = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="da-page">
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

        .da-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .da-shell {
          width: min(100%, calc(100% - 32px));
          margin: 0 auto;
        }

        .da-btn {
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

        .da-section { padding: 24px 0; }
        .da-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 8px; }
        .da-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 16px;
          max-width: 760px;
        }

        .da-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr 1fr;
          padding: 16px 0 20px;
        }

        .da-chip {
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

        .da-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 12px 0;
        }

        .da-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .da-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 16px;
        }

        .da-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 560px;
          margin-bottom: 18px;
        }

        .da-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .da-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .da-stat-value { font-size: 18px; font-weight: 700; }

        .da-hero-media { position: relative; }

        .da-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
          height: 600px;
        }

        .da-media-box > div {
          height: 100%;
        }

        .da-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .da-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .da-curr-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 2fr 1fr;
        }

        .da-accordion { display: grid; gap: 10px; }

        .da-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 14px;
        }

        .da-module.open { border-color: #d05b36; }

        .da-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .da-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .da-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .da-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .da-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .da-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .da-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .da-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .da-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .da-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .da-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .da-overview-grid,
        .da-why-grid,
        .da-role-grid,
        .da-metric-grid,
        .da-faq-grid {
          display: grid;
          gap: 16px;
        }

        .da-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .da-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .da-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .da-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .da-faq-grid { grid-template-columns: 250px 1fr; }

        .da-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .da-card h4 { margin: 0 0 8px; font-size: 20px; }
        .da-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .da-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1fr;
          width: 100%;
        }

        .da-list {
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px 30px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .da-list {
            grid-template-columns: 1fr;
          }
        }

        .da-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .da-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .da-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .da-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .da-center { text-align: center; }

        .da-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .da-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .da-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .da-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }
        
        .da-role-card h4 {
          font-weight: 700;
        }

        .da-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .da-fixed-price {
          align-items: center;
          background: #ffffffee;
          backdrop-filter: blur(6px);
          border-top: 1px solid var(--line);
          bottom: 0;
          color: var(--ink);
          display: flex;
          gap: 12px;
          font-size: 14px;
          font-weight: 700;
          justify-content: space-between;
          left: 0;
          letter-spacing: 0.4px;
          min-height: 56px;
          padding: 10px 24px;
          position: fixed;
          text-transform: uppercase;
          width: 100%;
          z-index: 120;
        }

        .da-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .da-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .da-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .da-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .da-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .da-invest h3 { font-size: 40px; margin: 6px 0; }
        .da-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .da-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .da-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .da-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .da-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .da-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .da-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .da-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .da-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .da-break-row:last-child { border-bottom: 0; }

        .da-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .da-partner img { height: 76px; object-fit: contain; }

        .da-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .da-faq-menu button {
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

        .da-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .da-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .da-faq-head {
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

        .da-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .da-hero,
          .da-curr-grid,
          .da-overview-grid,
          .da-why-grid,
          .da-role-grid,
          .da-metric-grid,
          .da-pay-grid,
          .da-faq-grid,
          .da-takeaway-grid,
          .da-invest-grid {
            grid-template-columns: 1fr;
          }

          .da-floating-card { left: 14px; }
          .da-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .da-section { padding: 42px 0; }
          .da-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="da-shell">
        <div style={{ width: "100%", marginBottom: "20px", marginTop: "10px" }}>
          <img 
            src={posterImage} 
            alt="Data Analytics Poster" 
            style={{ width: "100%", height: "auto", borderRadius: "18px", display: "block" }} 
          />
        </div>
        <section className="da-hero">
          <div>
            <div className="da-chip">Advanced Program 2026</div>
            <h1>Master <span>Analytics</span> that Drives Decisions.</h1>
            <p className="da-sub">
              Master the sophisticated analytical frameworks and high-performance tools required to transform massive data streams into precise, actionable business intelligence for global enterprises. Develop expert-level proficiency in SQL, Tableau, Power BI, and Python to bridge the critical gap between raw technical analysis and executive-level strategic decision-making. Gain the foresight and technical rigour needed to drive multi-million dollar growth initiatives and lead data-driven transformations across the world's most innovative organizations.
            </p>

            <div className="da-stats">
              {heroStats.map((item) => (
                <article className="da-stat" key={item.label}>
                  <div className="da-stat-label">{item.label}</div>
                  <div className="da-stat-value">{item.value}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="da-hero-media">
            <div className="da-media-box">
              <ImageSlider />
            </div>
            <aside className="da-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build portfolio-ready analytics systems that support product, growth, and strategy decisions.</p>
            </aside>
          </div>
        </section>

        <section className="da-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A complete learning path from analytical foundations to business-grade dashboard and case execution.
          </p>

          <div className="da-accordion">
            {curriculum.map((module, index) => {
              const isOpen = openModule === index;
              return (
                <article className={`da-module ${isOpen ? "open" : ""}`} key={module.title}>
                  <div
                    className="da-module-head"
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
                      <div className="da-module-week">{module.week}</div>
                      <div className="da-module-title">{module.title}</div>
                    </div>
                    <span className="da-module-toggle">{isOpen ? "-" : "+"}</span>
                  </div>

                  {isOpen && (
                    <div className="da-module-body">
                      <p className="da-module-objective">{module.objectives}</p>
                      <div className="da-tag-wrap">
                        {module.topics.map((topic) => (
                          <span className="da-tag" key={topic}>{topic}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div style={{ marginTop: "32px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <h2 className="mb-4">Speak with an Advisor</h2>
            <p className="lead mb-6" style={{ margin: "0 auto 24px" }}>Get a personalized roadmap for analytics roles and data career transitions.</p>
            <div style={{ width: "min(90%, calc(100% - 32px))", margin: "auto", padding: "0" }}>
              <ApplyForm courseValue="Data Analytics" />
            </div>
          </div>
        </section>

        <section className="da-section">
          <h2>Program Overview</h2>
          <div className="da-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="da-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="da-section">
          <h2>Why Choose Data Analytics?</h2>
          <p className="lead">Build one of the most versatile and business-critical skillsets in modern organizations.</p>
          <div className="da-why-grid">
            {whyChoose.map((item) => (
              <article className="da-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="da-section">
          <h2>Key Takeaways</h2>
          <div className="da-takeaway-grid">
            <ul className="da-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="da-section">
          <BenefitsofLearning />
        </section>

        <section className="da-section">
          <div className="da-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access complete module flow, project structure, and placement preparation details.
              </p>
            </div>
            <a href={pdfDataAnalytics} target="_blank" rel="noreferrer" className="da-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="da-section da-career">
        <div className="da-shell">
          <div className="da-center">
            <h2>Career Opportunities in Data Analytics</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for high-impact analyst roles across product, operations, finance, and growth teams.
            </p>
          </div>

          <div className="da-role-grid">
            {roles.map((role) => (
              <article className="da-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="da-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="da-section">
        <div className="da-shell">
          <h2 className="da-center">Our Alumni at Top Brands</h2>
          <p className="lead da-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="da-section">
        <div className="da-shell">
          <h2 className="da-center">Course Benefits at a Glance</h2>
          <div className="da-metric-grid">
            <article className="da-metric"><h4>260+</h4><p>Mentees Placed</p></article>
            <article className="da-metric"><h4>10+ LPA</h4><p>Average CTC</p></article>
            <article className="da-metric"><h4>92%</h4><p>Placement Rate</p></article>
            <article className="da-metric"><h4>430+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="da-section">
        <div className="da-shell">
          <Certification />
        </div>
      </section>

      <section className="da-section">
        <div className="da-shell">
          <div className="da-invest">
            <div className="da-invest-sub">Program Investment</div>
            <h3>Rs 61,999</h3>
            <div className="da-invest-sub">Total fee (incl. GST)</div>

            <div className="da-invest-grid">
              <div className="da-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="da-invest-item">
                <strong>Installment 1: Rs 26,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="da-invest-item">
                <strong>Installment 2: Rs 25,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="da-pay-grid">
            <div className="da-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 61,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="da-breakdown">
              <div className="da-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="da-break-row"><span>Installment 1</span><strong>Rs 26,000</strong></div>
              <div className="da-break-row"><span>Installment 2</span><strong>Rs 25,999</strong></div>
            </div>
          </div>

          <div className="da-partner">
            <p className="da-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="da-section" style={{ background: "#fff" }}>
        <div className="da-shell">
          <StoreSection />
        </div>
      </section>

      <section className="da-section" style={{ background: "#fff" }}>
        <div className="da-shell">
          <h2 className="da-center">Ask Us Anything</h2>
          <div className="da-faq-grid">
            <aside className="da-faq-menu">
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
                <article className="da-faq-item" key={faq.question}>
                  <button
                    className="da-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="da-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="da-fixed-price">
        <span>Program Fee: <strong>Rs 61,999 inclusive of taxes</strong></span>
        <ApplyNowButton courseValue="Data Analytics" />
      </div>
    </div>
  );
};

export default DataAnalytics;
