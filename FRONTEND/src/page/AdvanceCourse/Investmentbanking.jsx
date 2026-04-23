import React, { useState } from "react";
import IBHero from "../../../krutanic/images/ibad1.jpg";
import IBOutcomes from "../../../krutanic/images/ibad2.jpg";
import pdfib from "../../../krutanic/Investment Banking Advanced Program.pdf";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import StoreSection from "./Components/StoreSection";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import ImageSlider from "./Components/ImageSlider";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
  { label: "Batch Starting", value: "Upcoming" },
];

const curriculum = [
  {
    week: "Weeks 1-2",
    title: "Introduction to Investment Banking",
    objectives:
      "Build a foundational understanding of investment banking structures, functions, and market roles.",
    topics: [
      "Global Financial Markets",
      "Investment Banking Functions",
      "Roles and Teams",
      "Capital Raising Basics",
      "Regulatory Overview",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Financial Analysis and Valuation",
    objectives:
      "Use valuation frameworks to assess companies and support strategic deal decisions.",
    topics: [
      "Financial Statement Analysis",
      "Ratio Frameworks",
      "DCF Modeling",
      "Comparable Analysis",
      "Transaction Valuation",
    ],
  },
  {
    week: "Week 5-6",
    title: "Capital Markets and Underwriting",
    objectives:
      "Understand debt and equity capital markets, underwriting workflows, and risk management in offerings.",
    topics: [
      "IPOs and Placements",
      "Underwriting Process",
      "Book Building",
      "Pricing Strategy",
      "Market Risk Considerations",
    ],
  },
  {
    week: "Week 7",
    title: "Mergers and Acquisitions",
    objectives:
      "Analyze M&A transactions from due diligence through deal structuring and integration planning.",
    topics: [
      "M&A Deal Types",
      "Due Diligence",
      "Negotiation Dynamics",
      "Deal Structuring",
      "Regulatory Approvals",
    ],
  },
  {
    week: "Week 8-9",
    title: "Financial Modeling and Forecasting",
    objectives:
      "Build robust forecast models and sensitivity analyses to support banking recommendations.",
    topics: [
      "3-Statement Models",
      "Scenario Analysis",
      "Sensitivity Testing",
      "Forecast Design",
      "Stress Testing",
    ],
  },
  {
    week: "Week 10",
    title: "Corporate Governance and Ethics",
    objectives:
      "Apply governance principles and ethical standards to real-world investment banking decisions.",
    topics: [
      "Governance Structures",
      "Ethics in Banking",
      "Conflict Management",
      "Insider Trading Controls",
      "Case Study Reviews",
    ],
  },
  {
    week: "Week 11-12",
    title: "Investment Strategy and Portfolio Management",
    objectives:
      "Understand asset allocation and portfolio logic for risk-aware investment decision making.",
    topics: [
      "Portfolio Construction",
      "Risk Allocation",
      "Active vs Passive",
      "Performance Attribution",
      "Sector Strategies",
    ],
  },
  {
    week: "Week 13-14",
    title: "Derivatives and Risk Management",
    objectives:
      "Use derivatives and hedging mechanisms to manage downside and optimize risk-adjusted outcomes.",
    topics: [
      "Futures and Options",
      "Swaps",
      "Hedging Techniques",
      "Arbitrage Concepts",
      "Risk Controls",
    ],
  },
  {
    week: "Week 14-15",
    title: "International Finance",
    objectives:
      "Evaluate cross-border financial deals with currency, macroeconomic, and geopolitical considerations.",
    topics: [
      "FX Markets",
      "Macro Indicators",
      "Cross-Border Deals",
      "Country Risk",
      "Global Compliance",
    ],
  },
  {
    week: "Week 16",
    title: "Private Equity and Venture Capital",
    objectives:
      "Understand PE and VC investment lifecycles from deal sourcing to exit strategy.",
    topics: [
      "Fund Structures",
      "Deal Sourcing",
      "Valuation in PE",
      "Term Sheet Basics",
      "Exit Strategies",
    ],
  },
  {
    week: "Week 17-20",
    title: "Capstone Project",
    objectives:
      "Deliver a comprehensive market and deal analysis project with portfolio-ready outputs.",
    topics: [
      "Live Case Analysis",
      "Financial Modeling",
      "Investment Memo",
      "Presentation Deck",
      "Expert Review",
    ],
  },
  {
    week: "Week 21-24",
    title: "Placement Preparation",
    objectives:
      "Build interview readiness with polished narratives, technical rounds practice, and industry networking.",
    topics: [
      "Resume and LinkedIn",
      "Mock Interviews",
      "Case Interview Prep",
      "Networking Strategy",
      "Portfolio Positioning",
    ],
  },
];

const overviewTopics = [
  "Corporate Finance and Valuation",
  "Investment Banking Modeling",
  "Mergers and Acquisitions",
  "Private Equity and Venture Capital",
  "Risk and Derivatives",
  "Regulatory and Ethics Frameworks",
];

const whyChoose = [
  {
    title: "High-Impact Deals",
    description:
      "Work on transactions that influence industries, companies, and market direction.",
  },
  {
    title: "Strong Career Upside",
    description:
      "Investment banking careers offer high growth and long-term leadership pathways.",
  },
  {
    title: "Elite Skill Development",
    description:
      "Develop analytical rigor in valuation, modeling, and strategic financial decision-making.",
  },
  {
    title: "Global Opportunity",
    description:
      "Banking and capital markets roles open doors across international financial hubs.",
  },
  {
    title: "Strategic Exposure",
    description:
      "Gain deep exposure to corporate strategy, transactions, and capital structures.",
  },
  {
    title: "Network Leverage",
    description:
      "Build relationships with high-performing professionals across finance ecosystems.",
  },
];

const keyTakeaways = [
  "Build robust valuation and financial modeling capability for strategic deal decisions.",
  "Understand M&A workflows from diligence to structuring and integration.",
  "Develop risk management frameworks for capital markets and portfolio strategy.",
  "Interpret macroeconomic and global indicators in investment decision-making.",
  "Apply governance and ethics principles in high-stakes financial environments.",
  "Present portfolio-ready analyses and investment insights with executive clarity.",
];

const roles = [
  {
    title: "Investment Banking Analyst",
    text: "Support deal execution, modeling, and client advisory documentation.",
    avg: "Package range: Rs 10-22 LPA",
  },
  {
    title: "M&A Analyst",
    text: "Analyze transactions, valuations, and strategic combinations for deal outcomes.",
    avg: "Package range: Rs 12-28 LPA",
  },
  {
    title: "Private Equity Analyst",
    text: "Evaluate private investment opportunities and portfolio growth potential.",
    avg: "Package range: Rs 14-35 LPA",
  },
  {
    title: "Financial Analyst",
    text: "Interpret financial data to guide investment and corporate finance decisions.",
    avg: "Package range: Rs 6-14 LPA",
  },
  {
    title: "Corporate Finance Specialist",
    text: "Drive financial planning and strategic capital decisions for enterprises.",
    avg: "Package range: Rs 8-18 LPA",
  },
  {
    title: "Risk Management Analyst",
    text: "Identify and mitigate financial exposure across portfolios and transactions.",
    avg: "Package range: Rs 7-16 LPA",
  },
  {
    title: "Equity Research Analyst",
    text: "Assess companies and sectors to generate market-aligned investment insights.",
    avg: "Package range: Rs 8-18 LPA",
  },
  {
    title: "Portfolio Manager",
    text: "Manage allocations and optimize risk-adjusted returns across investments.",
    avg: "Package range: Rs 12-40 LPA",
  },
  {
    title: "Corporate Finance Advisor",
    text: "Provide strategic advisory for funding, restructuring, and value creation.",
    avg: "Package range: Rs 10-30 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the Investment Banking program?",
      answer:
        "The program covers valuation, modeling, M&A, capital markets, private equity, risk, and financial strategy.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, practical exercises, and market-focused case projects.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, you work on financial models, transaction cases, and portfolio analysis assignments.",
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
        "Basic finance awareness helps, but the program supports beginners and transitioning professionals.",
    },
    {
      question: "Do I need prior investment banking experience?",
      answer:
        "No, this program is structured for both newcomers and early-career professionals.",
    },
    {
      question: "Can beginners apply?",
      answer: "Yes, the curriculum starts from foundation-level concepts.",
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
        "Through cohort groups, discussion sessions, project collaboration, and networking opportunities.",
    },
    {
      question: "Is mentorship available?",
      answer:
        "Yes, mentors guide analytical development, project quality, and career planning.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni channels and continuous support resources remain available.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "The cohort includes learners from commerce, finance, engineering, and business backgrounds.",
    },
  ],
  Lectures: [
    {
      question: "Are sessions live or recorded?",
      answer: "Both live and recorded content are available.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Sessions include model walkthroughs, Q&A, and practical case problem-solving.",
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
      answer: "Yes, successful participants receive a professional completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It demonstrates practical capability in investment analysis and financial decision frameworks.",
    },
    {
      question: "Can I add this certification to resume or LinkedIn?",
      answer: "Yes, it can be showcased professionally.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, certification is included upon successful completion.",
    },
  ],
  Opportunities: [
    {
      question: "What career opportunities will this course open?",
      answer:
        "You can target analyst roles in investment banking, M&A, equity research, PE, and corporate finance.",
    },
    {
      question: "Will I receive placement assistance?",
      answer: "Yes, interview and placement support are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Selected learners may access internship pathways and project collaborations via partners.",
    },
    {
      question: "How does this help in career advancement?",
      answer:
        "You gain practical analytical depth and portfolio-ready financial projects for high-value roles.",
    },
  ],
};

const Investmentbanking = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="ib-page">
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

        .ib-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .ib-shell {
          width: min(100%, calc(100% - 32px));
          margin: 0 auto;
        }

        .ib-btn {
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

        .ib-section { padding: 24px 0; }
        .ib-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 8px; }
        .ib-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 16px;
          max-width: 760px;
        }

        .ib-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr 1fr;
          padding: 16px 0 20px;
        }

        .ib-chip {
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

        .ib-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 12px 0;
        }

        .ib-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .ib-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 16px;
        }

        .ib-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 560px;
          margin-bottom: 18px;
        }

        .ib-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .ib-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .ib-stat-value { font-size: 18px; font-weight: 700; }

        .ib-hero-media { position: relative; }

        .ib-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
          height: 600px;
        }

        .ib-media-box > div {
          height: 100%;
        }

        .ib-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .ib-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .ib-curr-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 2fr 1fr;
        }

        .ib-accordion { display: grid; gap: 10px; }

        .ib-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 14px;
        }

        .ib-module.open { border-color: #d05b36; }

        .ib-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .ib-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ib-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .ib-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .ib-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .ib-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .ib-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .ib-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .ib-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .ib-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .ib-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .ib-overview-grid,
        .ib-why-grid,
        .ib-role-grid,
        .ib-metric-grid,
        .ib-faq-grid {
          display: grid;
          gap: 16px;
        }

        .ib-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ib-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ib-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ib-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .ib-faq-grid { grid-template-columns: 250px 1fr; }

        .ib-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .ib-card h4 { margin: 0 0 8px; font-size: 20px; }
        .ib-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .ib-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1fr;
          width: 100%;
        }

        .ib-list {
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px 30px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .ib-list {
            grid-template-columns: 1fr;
          }
        }

        .ib-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .ib-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .ib-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .ib-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .ib-center { text-align: center; }

        .ib-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .ib-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .ib-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .ib-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }
        
        .ib-role-card h4 {
          font-weight: 700;
        }

        .ib-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .ib-fixed-price {
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

        .ib-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .ib-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .ib-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .ib-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .ib-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .ib-invest h3 { font-size: 40px; margin: 6px 0; }
        .ib-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .ib-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .ib-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .ib-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .ib-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .ib-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .ib-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .ib-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .ib-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .ib-break-row:last-child { border-bottom: 0; }

        .ib-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .ib-partner img { height: 76px; object-fit: contain; }

        .ib-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .ib-faq-menu button {
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

        .ib-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .ib-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .ib-faq-head {
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

        .ib-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .ib-hero,
          .ib-curr-grid,
          .ib-overview-grid,
          .ib-why-grid,
          .ib-role-grid,
          .ib-metric-grid,
          .ib-pay-grid,
          .ib-faq-grid,
          .ib-takeaway-grid,
          .ib-invest-grid {
            grid-template-columns: 1fr;
          }

          .ib-floating-card { left: 14px; }
          .ib-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .ib-section { padding: 42px 0; }
          .ib-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="ib-shell">
        <section className="ib-hero">
          <div>
            <div className="ib-chip">Advanced Program 2026</div>
            <h1>Master <span>Capital</span> Strategy and Deals.</h1>
            <p className="ib-sub">
              An intensive, high-calibre program engineered to master complex valuation methodologies, M&A execution, and capital market dynamics for aspiring investment banking elites. Develop sophisticated financial modeling skills in Excel and Bloomberg Terminal platforms while mastering the strategic rigour required to navigate high-stakes global transaction landscapes. Join an exclusive tier of finance professionals and accelerate your path to leadership roles in the world's most prestigious investment banks and private equity firms.
            </p>

            <div className="ib-stats">
              {heroStats.map((item) => (
                <article className="ib-stat" key={item.label}>
                  <div className="ib-stat-label">{item.label}</div>
                  <div className="ib-stat-value">{item.value}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="ib-hero-media">
            <div className="ib-media-box">
              <ImageSlider />
            </div>
            <aside className="ib-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build deal-ready financial analysis skills for high-impact capital markets and advisory roles.</p>
            </aside>
          </div>
        </section>

        <section className="ib-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A rigorous roadmap from finance fundamentals to advanced transaction analysis and strategic advisory execution.
          </p>

          <div className="ib-accordion">
            {curriculum.map((module, index) => {
              const isOpen = openModule === index;
              return (
                <article className={`ib-module ${isOpen ? "open" : ""}`} key={module.title}>
                  <div
                    className="ib-module-head"
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
                      <div className="ib-module-week">{module.week}</div>
                      <div className="ib-module-title">{module.title}</div>
                    </div>
                    <span className="ib-module-toggle">{isOpen ? "-" : "+"}</span>
                  </div>

                  {isOpen && (
                    <div className="ib-module-body">
                      <p className="ib-module-objective">{module.objectives}</p>
                      <div className="ib-tag-wrap">
                        {module.topics.map((topic) => (
                          <span className="ib-tag" key={topic}>{topic}</span>
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
            <p className="lead mb-6" style={{ margin: "0 auto 24px" }}>Get a personalized roadmap for investment banking and finance career tracks.</p>
            <div style={{ width: "min(90%, calc(100% - 32px))", margin: "auto", padding: "0" }}>
              <ApplyForm courseValue="Investment Banking" />
            </div>
          </div>
        </section>

        <section className="ib-section">
          <h2>Program Overview</h2>
          <div className="ib-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="ib-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="ib-section">
          <h2>Why Choose Investment Banking?</h2>
          <p className="lead">Build one of the most strategic and high-value skillsets in modern finance and markets.</p>
          <div className="ib-why-grid">
            {whyChoose.map((item) => (
              <article className="ib-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ib-section">
          <h2>Key Takeaways</h2>
          <div className="ib-takeaway-grid">
            <ul className="ib-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ib-section">
          <BenefitsofLearning />
        </section>

        <section className="ib-section">
          <div className="ib-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access detailed module flow, valuation templates, and capstone structure.
              </p>
            </div>
            <button disabled className="ib-btn" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
              Download
            </button>
          </div>
        </section>
      </div>

      <section className="ib-section ib-career">
        <div className="ib-shell">
          <div className="ib-center">
            <h2>Career Opportunities in Investment Banking</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for high-impact finance roles across advisory, research, and portfolio functions.
            </p>
          </div>

          <div className="ib-role-grid">
            {roles.map((role) => (
              <article className="ib-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="ib-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ib-section">
        <div className="ib-shell">
          <h2 className="ib-center">Our Alumni at Top Brands</h2>
          <p className="lead ib-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="ib-section">
        <div className="ib-shell">
          <h2 className="ib-center">Course Benefits at a Glance</h2>
          <div className="ib-metric-grid">
            <article className="ib-metric"><h4>220+</h4><p>Mentees Placed</p></article>
            <article className="ib-metric"><h4>14+ LPA</h4><p>Average CTC</p></article>
            <article className="ib-metric"><h4>90%</h4><p>Placement Rate</p></article>
            <article className="ib-metric"><h4>380+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="ib-section">
        <div className="ib-shell">
          <Certification />
        </div>
      </section>

      <section className="ib-section">
        <div className="ib-shell">
          <div className="ib-invest">
            <div className="ib-invest-sub">Program Investment</div>
            <h3>Rs 47,200</h3>
            <div className="ib-invest-sub">Total fee (incl. GST)</div>

            <div className="ib-invest-grid">
              <div className="ib-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="ib-invest-item">
                <strong>Installment 1: Rs 18,600</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="ib-invest-item">
                <strong>Installment 2: Rs 18,600</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="ib-pay-grid">
            <div className="ib-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 47,200</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="ib-breakdown">
              <div className="ib-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="ib-break-row"><span>Installment 1</span><strong>Rs 18,600</strong></div>
              <div className="ib-break-row"><span>Installment 2</span><strong>Rs 18,600</strong></div>
            </div>
          </div>

          <div className="ib-partner">
            <p className="ib-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="ib-section" style={{ background: "#fff" }}>
        <div className="ib-shell">
          <StoreSection />
        </div>
      </section>

      <section className="ib-section" style={{ background: "#fff" }}>
        <div className="ib-shell">
          <h2 className="ib-center">Ask Us Anything</h2>
          <div className="ib-faq-grid">
            <aside className="ib-faq-menu">
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
                <article className="ib-faq-item" key={faq.question}>
                  <button
                    className="ib-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="ib-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="ib-fixed-price">
        <span>Price: <strong>Rs 47,200 inclusive of taxes</strong></span>
        <ApplyNowButton courseValue="Investment Banking" />
      </div>
    </div>
  );
};

export default Investmentbanking;
