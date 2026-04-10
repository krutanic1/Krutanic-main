import React, { useState } from "react";
import PEHero from "../../../krutanic/images/pead1.jpg";
import PEOutcomes from "../../../krutanic/images/pead2.jpg";
import pdfds from "../../../krutanic/Prompt engineering for generative AI Advanced Program.pdf";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
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
    title: "Introduction to Prompt Engineering",
    objectives:
      "Understand core prompt engineering principles and how prompts shape AI output quality.",
    topics: [
      "Prompt Engineering Basics",
      "LLM Behavior Patterns",
      "Prompt Structure",
      "Quality Evaluation",
      "Use Cases Overview",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Effective Prompting Techniques",
    objectives:
      "Use zero-shot, few-shot, and chain-of-thought methods to improve reliability and relevance.",
    topics: [
      "Zero-shot Prompting",
      "Few-shot Prompting",
      "Chain-of-thought",
      "Role and Persona Prompting",
      "Output Constraints",
    ],
  },
  {
    week: "Week 5-6",
    title: "Refinement and Output Control",
    objectives:
      "Refine outputs iteratively with structured constraints and objective-aligned feedback loops.",
    topics: [
      "Prompt Iteration",
      "Constraint Design",
      "Response Calibration",
      "Style Controls",
      "Evaluation Rubrics",
    ],
  },
  {
    week: "Week 7-8",
    title: "Context Engineering and Multi-Step Prompts",
    objectives:
      "Build context-rich prompts and chaining strategies for complex problem-solving workflows.",
    topics: [
      "Context Injection",
      "Task Decomposition",
      "Prompt Chaining",
      "Memory Handling",
      "Instruction Hierarchy",
    ],
  },
  {
    week: "Week 9-10",
    title: "Prompting for Content and Coding",
    objectives:
      "Apply prompting for content systems, ideation, and AI-assisted development workflows.",
    topics: [
      "Content Generation",
      "Creative Ideation",
      "Code Prompting",
      "Debug Assistance",
      "Documentation Workflows",
    ],
  },
  {
    week: "Week 11-12",
    title: "Model APIs and Tool Integration",
    objectives:
      "Integrate prompts into product workflows using APIs, templates, and automation systems.",
    topics: [
      "LLM APIs",
      "Prompt Templates",
      "System Messages",
      "Tool Calling Concepts",
      "Workflow Automation",
    ],
  },
  {
    week: "Week 13-14",
    title: "Prompt Evaluation and Guardrails",
    objectives:
      "Design evaluation frameworks for consistency, safety, and performance across AI outputs.",
    topics: [
      "Prompt Testing",
      "Hallucination Controls",
      "Safety Guardrails",
      "Bias Awareness",
      "Reliability Metrics",
    ],
  },
  {
    week: "Week 15-16",
    title: "Ethics and Responsible AI Prompting",
    objectives:
      "Apply responsible prompting practices and ethical principles in production contexts.",
    topics: [
      "AI Ethics",
      "Bias Mitigation",
      "Responsible Usage",
      "Data Sensitivity",
      "Policy Alignment",
    ],
  },
  {
    week: "Week 17-20",
    title: "Capstone Project",
    objectives:
      "Build a practical prompt-engineering solution for a real business or product use case.",
    topics: [
      "Problem Framing",
      "Prompt System Design",
      "Evaluation Plan",
      "Iteration Cycles",
      "Final Presentation",
    ],
  },
  {
    week: "Week 21-24",
    title: "Placement Preparation",
    objectives:
      "Build portfolio readiness and interview confidence for AI prompt and workflow roles.",
    topics: [
      "Resume and LinkedIn",
      "Portfolio Positioning",
      "Mock Interviews",
      "Case Presentations",
      "Job Strategy",
    ],
  },
];

const overviewTopics = [
  "Advanced Prompt Strategies",
  "Iterative Refinement Systems",
  "API and Workflow Integration",
  "AI Assistants and Chatbots",
  "Ethical and Safe Prompting",
  "Future Trends in GenAI",
];

const whyChoose = [
  {
    title: "High-Demand Skill",
    description:
      "Prompt engineering is becoming a core capability across AI product and content teams.",
  },
  {
    title: "Practical Impact",
    description:
      "Well-designed prompts directly improve output quality, productivity, and automation outcomes.",
  },
  {
    title: "Creative Control",
    description:
      "Shape model behavior with precision for writing, coding, research, and decision support tasks.",
  },
  {
    title: "Cross-Industry Utility",
    description:
      "Apply prompt skills in marketing, product, education, operations, and engineering domains.",
  },
  {
    title: "Future-Proof Growth",
    description:
      "As GenAI evolves, prompt and context engineering remain high-value strategic skills.",
  },
  {
    title: "Fast Career Transition",
    description:
      "Build an AI portfolio quickly and move into emerging AI-enabled roles.",
  },
];

const keyTakeaways = [
  "Build robust prompts that produce reliable, context-aware AI responses.",
  "Use iterative refinement loops to improve output quality and consistency.",
  "Apply structured prompting to content, coding, and decision workflows.",
  "Integrate prompt systems into real applications using API-based workflows.",
  "Design guardrails to reduce hallucinations and improve response safety.",
  "Publish portfolio-grade AI prompt projects for hiring and career growth.",
];

const roles = [
  {
    title: "Prompt Engineer",
    text: "Design and optimize prompts for production AI use-cases.",
    avg: "Package range: Rs 8-24 LPA",
  },
  {
    title: "AI Content Specialist",
    text: "Build AI-assisted content pipelines with quality and consistency controls.",
    avg: "Package range: Rs 5-14 LPA",
  },
  {
    title: "Chatbot Developer",
    text: "Create conversational AI experiences with prompt-driven behavior design.",
    avg: "Package range: Rs 6-18 LPA",
  },
  {
    title: "AI Research Associate",
    text: "Experiment with model prompting and evaluation frameworks.",
    avg: "Package range: Rs 8-20 LPA",
  },
  {
    title: "Marketing Automation Specialist",
    text: "Use GenAI prompting to scale campaign content and customer journeys.",
    avg: "Package range: Rs 5-14 LPA",
  },
  {
    title: "AI Product Manager",
    text: "Lead AI product outcomes with prompt and model behavior strategy.",
    avg: "Package range: Rs 12-30 LPA",
  },
  {
    title: "AI Data Trainer",
    text: "Improve model quality through structured data and prompt feedback loops.",
    avg: "Package range: Rs 5-13 LPA",
  },
  {
    title: "Technical Writer (AI)",
    text: "Create AI-native documentation and instruction systems for teams.",
    avg: "Package range: Rs 5-12 LPA",
  },
  {
    title: "Conversational UX Designer",
    text: "Design natural conversational interfaces across AI experiences.",
    avg: "Package range: Rs 7-18 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the Prompt Engineering program?",
      answer:
        "The program covers prompting techniques, refinement systems, API integration, ethics, and applied AI workflows.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, practical labs, and portfolio-oriented projects.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, learners build practical prompt systems and deploy real workflow use-cases.",
    },
    {
      question: "How long is the program?",
      answer: "The program runs for 24 weeks.",
    },
  ],
  Eligibility: [
    {
      question: "Do I need prior AI experience?",
      answer:
        "No prior AI background is required, though basic familiarity with digital tools is helpful.",
    },
    {
      question: "Do I need coding skills?",
      answer:
        "Coding is not mandatory; technical and non-technical learners are both supported.",
    },
    {
      question: "Can beginners apply?",
      answer: "Yes, beginners can apply and grow through the structured learning path.",
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
        "Through cohort groups, discussion forums, collaborative projects, and live learning sessions.",
    },
    {
      question: "Is mentorship available?",
      answer:
        "Yes, mentors support project execution, AI workflows, and career development.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni and support channels remain accessible after graduation.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "The community includes professionals from product, marketing, engineering, education, and business roles.",
    },
  ],
  Lectures: [
    {
      question: "Are sessions live or recorded?",
      answer: "Both live and recorded formats are available for flexibility.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Sessions include practical exercises, prompt critiques, and real-time feedback.",
    },
    {
      question: "Can I replay missed lectures?",
      answer: "Yes, recordings are provided for all modules.",
    },
    {
      question: "How often are live sessions held?",
      answer: "Live sessions are held weekly.",
    },
  ],
  Certification: [
    {
      question: "Will I receive a certificate upon completion?",
      answer: "Yes, successful participants receive a completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It validates applied prompt engineering capability across production-grade AI workflows.",
    },
    {
      question: "Can I add this certification to resume or LinkedIn?",
      answer: "Yes, it can be showcased on both.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, certification is included with successful completion.",
    },
  ],
  Opportunities: [
    {
      question: "What career opportunities does this course open?",
      answer:
        "You can target roles like Prompt Engineer, AI Content Specialist, Conversational UX, and AI workflow specialist.",
    },
    {
      question: "Will I receive placement support?",
      answer: "Yes, placement assistance and interview support are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Selected learners may access internships and project pathways through partner opportunities.",
    },
    {
      question: "How does this help in career advancement?",
      answer:
        "You build practical AI execution skills and a portfolio that demonstrates real-world capability.",
    },
  ],
};

const PromptEngineering = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="pe-page">
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

        .pe-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .pe-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .pe-btn {
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

        .pe-section { padding: 52px 0; }
        .pe-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .pe-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .pe-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .pe-chip {
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

        .pe-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .pe-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .pe-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .pe-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 420px;
          margin-bottom: 18px;
        }

        .pe-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .pe-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .pe-stat-value { font-size: 18px; font-weight: 700; }

        .pe-hero-media { position: relative; }

        .pe-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .pe-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .pe-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .pe-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .pe-accordion { display: grid; gap: 14px; }

        .pe-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .pe-module.open { border-color: #d05b36; }

        .pe-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .pe-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pe-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .pe-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .pe-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .pe-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .pe-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .pe-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .pe-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .pe-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .pe-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .pe-overview-grid,
        .pe-why-grid,
        .pe-role-grid,
        .pe-metric-grid,
        .pe-faq-grid {
          display: grid;
          gap: 16px;
        }

        .pe-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pe-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pe-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .pe-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .pe-faq-grid { grid-template-columns: 250px 1fr; }

        .pe-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .pe-card h4 { margin: 0 0 8px; font-size: 20px; }
        .pe-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .pe-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .pe-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .pe-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .pe-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .pe-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .pe-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .pe-center { text-align: center; }

        .pe-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .pe-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .pe-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .pe-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }

        .pe-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .pe-fixed-price {
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

        .pe-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .pe-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .pe-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .pe-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .pe-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .pe-invest h3 { font-size: 40px; margin: 6px 0; }
        .pe-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .pe-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .pe-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .pe-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .pe-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .pe-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .pe-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .pe-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .pe-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .pe-break-row:last-child { border-bottom: 0; }

        .pe-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .pe-partner img { height: 76px; object-fit: contain; }

        .pe-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .pe-faq-menu button {
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

        .pe-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .pe-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .pe-faq-head {
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

        .pe-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .pe-hero,
          .pe-curr-grid,
          .pe-overview-grid,
          .pe-why-grid,
          .pe-role-grid,
          .pe-metric-grid,
          .pe-pay-grid,
          .pe-faq-grid,
          .pe-takeaway-grid,
          .pe-invest-grid {
            grid-template-columns: 1fr;
          }

          .pe-floating-card { left: 14px; }
          .pe-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .pe-section { padding: 42px 0; }
          .pe-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="pe-shell">
        <section className="pe-hero">
          <div>
            <div className="pe-chip">Advanced Program 2026</div>
            <h1>Master <span>Prompting</span> for Generative AI.</h1>
            <p className="pe-sub">
              A premium learning experience to design high-performing prompt systems for content, coding, automation, and AI product workflows.
            </p>

            <div className="pe-stats">
              {heroStats.map((item) => (
                <article className="pe-stat" key={item.label}>
                  <div className="pe-stat-label">{item.label}</div>
                  <div className="pe-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Prompt Engineering" />
          </div>

          <div className="pe-hero-media">
            <div className="pe-media-box">
              <img src={PEHero} alt="Prompt engineering mentor" />
            </div>
            <aside className="pe-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build production-grade prompt workflows that improve quality, reliability, and speed across AI tasks.</p>
            </aside>
          </div>
        </section>

        <section className="pe-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A hands-on roadmap from foundational prompting to advanced context engineering and AI workflow deployment.
          </p>

          <div className="pe-curr-grid">
            <div className="pe-accordion">
              {curriculum.map((module, index) => {
                const isOpen = openModule === index;
                return (
                  <article className={`pe-module ${isOpen ? "open" : ""}`} key={module.title}>
                    <div
                      className="pe-module-head"
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
                        <div className="pe-module-week">{module.week}</div>
                        <div className="pe-module-title">{module.title}</div>
                      </div>
                      <span className="pe-module-toggle">{isOpen ? "-" : "+"}</span>
                    </div>

                    {isOpen && (
                      <div className="pe-module-body">
                        <p className="pe-module-objective">{module.objectives}</p>
                        <div className="pe-tag-wrap">
                          {module.topics.map((topic) => (
                            <span className="pe-tag" key={topic}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="pe-side-panel">
              <h3>Speak with an Advisor</h3>
              <p>Get a personalized roadmap for prompt engineering and GenAI role transitions.</p>
              <ApplyForm />
            </aside>
          </div>
        </section>

        <section className="pe-section">
          <h2>Program Overview</h2>
          <div className="pe-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="pe-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="pe-section">
          <h2>Why Choose Prompt Engineering?</h2>
          <p className="lead">Build one of the fastest-growing AI capabilities with direct business and product impact.</p>
          <div className="pe-why-grid">
            {whyChoose.map((item) => (
              <article className="pe-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pe-section">
          <h2>Key Takeaways</h2>
          <div className="pe-takeaway-grid">
            <ul className="pe-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="pe-image">
              <img src={PEOutcomes} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="pe-section">
          <BenefitsofLearning />
        </section>

        <section className="pe-section">
          <div className="pe-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access detailed modules, prompt templates, and capstone execution structure.
              </p>
            </div>
            <a href={pdfds} target="_blank" rel="noreferrer" className="pe-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="pe-section pe-career">
        <div className="pe-shell">
          <div className="pe-center">
            <h2>Career Opportunities in Prompt Engineering</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for emerging AI-first roles across product, content, and automation teams.
            </p>
          </div>

          <div className="pe-role-grid">
            {roles.map((role) => (
              <article className="pe-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="pe-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pe-section">
        <div className="pe-shell">
          <h2 className="pe-center">Our Alumni at Top Brands</h2>
          <p className="lead pe-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="pe-section">
        <div className="pe-shell">
          <h2 className="pe-center">Course Benefits at a Glance</h2>
          <div className="pe-metric-grid">
            <article className="pe-metric"><h4>240+</h4><p>Mentees Placed</p></article>
            <article className="pe-metric"><h4>12+ LPA</h4><p>Average CTC</p></article>
            <article className="pe-metric"><h4>91%</h4><p>Placement Rate</p></article>
            <article className="pe-metric"><h4>410+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="pe-section">
        <div className="pe-shell">
          <Certification />
        </div>
      </section>

      <section className="pe-section">
        <div className="pe-shell">
          <div className="pe-invest">
            <div className="pe-invest-sub">Program Investment</div>
            <h3>Rs 65,999</h3>
            <div className="pe-invest-sub">Total fee (incl. GST)</div>

            <div className="pe-invest-grid">
              <div className="pe-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="pe-invest-item">
                <strong>Installment 1: Rs 28,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="pe-invest-item">
                <strong>Installment 2: Rs 27,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="pe-pay-grid">
            <div className="pe-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 65,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="pe-breakdown">
              <div className="pe-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="pe-break-row"><span>Installment 1</span><strong>Rs 28,000</strong></div>
              <div className="pe-break-row"><span>Installment 2</span><strong>Rs 27,999</strong></div>
            </div>
          </div>

          <div className="pe-partner">
            <p className="pe-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="pe-section" style={{ background: "#fff" }}>
        <div className="pe-shell">
          <StoreSection />
        </div>
      </section>

      <section className="pe-section" style={{ background: "#fff" }}>
        <div className="pe-shell">
          <h2 className="pe-center">Ask Us Anything</h2>
          <div className="pe-faq-grid">
            <aside className="pe-faq-menu">
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
                <article className="pe-faq-item" key={faq.question}>
                  <button
                    className="pe-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="pe-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pe-fixed-price">Price: <strong>Rs 65,999 inclusive of GST</strong></div>
    </div>
  );
};

export default PromptEngineering;
