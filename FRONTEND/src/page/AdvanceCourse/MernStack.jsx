import React, { useState } from "react";
import MERNHero from "../../../krutanic/images/msad1.jpg";
import MERNOutcomes from "../../assets/Advanced Course Images/Mern Stack Development/mern.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfms from "../../../krutanic/Mern Stack Web Development Advanced Program.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import ClientsCarousel from "../../Components/our_alumni";
import StoreSection from "./Components/StoreSection";
import Certification from "./Components/Certification";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";

const heroStats = [
  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
];

const curriculum = [
  {
    week: "Weeks 1-2",
    title: "MERN Foundations",
    objectives:
      "Understand the architecture of MongoDB, Express, React, and Node and set up a modern dev workflow.",
    topics: [
      "MERN Architecture",
      "Node Setup",
      "MongoDB Basics",
      "JavaScript ES6+",
      "Project Structure",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "MongoDB and Express Fundamentals",
    objectives:
      "Build robust backend services with schema design, CRUD operations, routing, and middleware.",
    topics: [
      "Schema Modeling",
      "CRUD",
      "Express Routing",
      "Middleware",
      "API Patterns",
    ],
  },
  {
    week: "Week 5-6",
    title: "Frontend with React",
    objectives:
      "Create responsive interfaces with reusable components, routing, and state management patterns.",
    topics: [
      "Component Design",
      "React Router",
      "Hooks",
      "State Patterns",
      "UI Integration",
    ],
  },
  {
    week: "Week 7",
    title: "Advanced MongoDB",
    objectives:
      "Improve data performance and security using indexing, aggregations, and best-practice modeling.",
    topics: [
      "Aggregation",
      "Indexing",
      "Query Optimization",
      "Backups",
      "Security",
    ],
  },
  {
    week: "Week 8-9",
    title: "Backend Engineering with Node and Express",
    objectives:
      "Develop scalable APIs and service layers with robust error handling and async control flows.",
    topics: [
      "Async Patterns",
      "Error Handling",
      "Service Layers",
      "Sessions and Cookies",
      "API Contracts",
    ],
  },
  {
    week: "Week 10",
    title: "Full-Stack Integration",
    objectives:
      "Connect frontend and backend cleanly and deploy complete applications with stable workflows.",
    topics: [
      "React-API Integration",
      "Data Flow",
      "Axios",
      "Deployment Basics",
      "Environment Setup",
    ],
  },
  {
    week: "Week 11-12",
    title: "Advanced React",
    objectives:
      "Scale frontend architecture using context, custom hooks, and performance optimization techniques.",
    topics: [
      "Context API",
      "Custom Hooks",
      "Performance Tuning",
      "Composition",
      "State Architecture",
    ],
  },
  {
    week: "Week 13-14",
    title: "REST APIs and Authentication",
    objectives:
      "Secure applications with JWT and modern API security practices.",
    topics: [
      "JWT Auth",
      "Protected Routes",
      "OAuth Concepts",
      "API Security",
      "Authorization",
    ],
  },
  {
    week: "Week 14-15",
    title: "Performance and Debugging",
    objectives:
      "Diagnose bottlenecks and optimize frontend and backend systems for production quality.",
    topics: [
      "DevTools Profiling",
      "React Debugging",
      "Node Debugging",
      "Performance Fixes",
      "Best Practices",
    ],
  },
  {
    week: "Week 16",
    title: "Deployment and Scaling",
    objectives:
      "Ship and scale MERN applications using CI/CD, containers, and cloud deployment strategies.",
    topics: [
      "CI/CD",
      "Docker",
      "Cloud Deployments",
      "Monitoring",
      "Scaling Patterns",
    ],
  },
  {
    week: "Week 17-20",
    title: "Capstone Project",
    objectives:
      "Build an end-to-end MERN product to demonstrate real-world development capability.",
    topics: [
      "Capstone Build",
      "Project Reviews",
      "Portfolio Packaging",
      "Resume Refinement",
      "Interview Prep",
    ],
  },
  {
    week: "Week 21-24",
    title: "Placement Preparation",
    objectives:
      "Prepare for full-stack interviews with strong portfolio storytelling and job search strategy.",
    topics: [
      "Resume Optimization",
      "Mock Interviews",
      "LinkedIn Positioning",
      "Networking",
      "Offer Readiness",
    ],
  },
];

const overviewTopics = [
  "MongoDB Database Design",
  "Express API Engineering",
  "React Frontend Architecture",
  "Node Backend Development",
  "Authentication and Security",
  "Deployment and Scaling",
];

const whyChoose = [
  {
    title: "High Demand",
    description:
      "Full-stack developers with MERN expertise are consistently in demand across industries.",
  },
  {
    title: "Strong Compensation",
    description:
      "Specialized full-stack implementation skills command competitive salary ranges.",
  },
  {
    title: "Full-Stack Ownership",
    description:
      "Build and ship complete products from frontend experience to backend architecture.",
  },
  {
    title: "Versatile Career Paths",
    description:
      "Target frontend, backend, full-stack, and platform roles with one strong stack.",
  },
  {
    title: "Modern Tooling",
    description:
      "Use production-grade workflows with APIs, containers, cloud, and CI/CD systems.",
  },
  {
    title: "Continuous Growth",
    description:
      "The JavaScript ecosystem evolves rapidly, creating constant learning opportunities.",
  },
];

const keyTakeaways = [
  "Build robust APIs and backend services using Node.js, Express, and MongoDB.",
  "Create scalable React applications with reusable components and state architecture.",
  "Implement secure authentication and authorization workflows for production apps.",
  "Optimize app performance with debugging and profiling best practices.",
  "Deploy and monitor full-stack applications with modern DevOps workflows.",
  "Showcase a portfolio-ready capstone that demonstrates end-to-end MERN expertise.",
];

const roles = [
  {
    title: "Full-Stack Developer",
    text: "Build complete web products across frontend and backend systems.",
    avg: "Package range: Rs 6-18 LPA",
  },
  {
    title: "MERN Stack Developer",
    text: "Ship feature-rich applications using MongoDB, Express, React, and Node.",
    avg: "Package range: Rs 6-20 LPA",
  },
  {
    title: "Frontend Developer",
    text: "Create high-quality user interfaces and interactive application experiences.",
    avg: "Package range: Rs 4-14 LPA",
  },
  {
    title: "Backend Developer",
    text: "Engineer secure and scalable API services and backend infrastructure.",
    avg: "Package range: Rs 5-16 LPA",
  },
  {
    title: "API Developer",
    text: "Design and maintain API ecosystems for modern web applications.",
    avg: "Package range: Rs 5-14 LPA",
  },
  {
    title: "Web Application Architect",
    text: "Define scalable architecture and technical direction for web platforms.",
    avg: "Package range: Rs 12-35 LPA",
  },
  {
    title: "React Developer",
    text: "Build performant frontend systems using component-driven architecture.",
    avg: "Package range: Rs 5-15 LPA",
  },
  {
    title: "JavaScript Developer",
    text: "Develop interactive web solutions across frontend and backend environments.",
    avg: "Package range: Rs 4-12 LPA",
  },
  {
    title: "Software Engineer",
    text: "Build maintainable software systems and collaborate across product teams.",
    avg: "Package range: Rs 6-20 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the MERN Stack program?",
      answer:
        "The program covers MongoDB, Express.js, React.js, Node.js, APIs, authentication, and deployment workflows.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, practical labs, and full-stack project implementation.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, you build end-to-end applications and implement real-world full-stack use cases.",
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
        "Basic JavaScript and web fundamentals are helpful but not mandatory.",
    },
    {
      question: "Do I need prior MERN experience?",
      answer:
        "No, the program is suitable for beginners and developers transitioning to full-stack roles.",
    },
    {
      question: "Can beginners apply?",
      answer: "Yes, the sequence starts from fundamentals and scales to advanced implementation.",
    },
    {
      question: "Is there an age restriction?",
      answer: "No, there is no age restriction.",
    },
  ],
  Community: [
    {
      question: "How can I interact with other participants?",
      answer:
        "Through cohort channels, peer reviews, project collaboration, and networking sessions.",
    },
    {
      question: "Is mentorship available?",
      answer: "Yes, mentors support implementation quality, architecture, and interview readiness.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni and support channels remain available after graduation.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "Learners come from engineering, IT services, startups, and non-tech transition backgrounds.",
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
        "Sessions include coding walkthroughs, architecture discussions, and real-time feedback.",
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
      question: "Will I receive a certificate on completion?",
      answer: "Yes, successful participants receive a completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It demonstrates practical full-stack capability and portfolio-backed readiness.",
    },
    {
      question: "Can I add this certification to resume or LinkedIn?",
      answer: "Yes, it can be added to both.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, it is included upon successful completion.",
    },
  ],
  Opportunities: [
    {
      question: "What career opportunities does this open?",
      answer:
        "You can target MERN Stack Developer, Full-Stack Developer, Frontend Developer, Backend Developer, and API Engineer roles.",
    },
    {
      question: "Is placement support included?",
      answer: "Yes, placement and interview preparation support are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Selected learners may access internship and project opportunities via partner networks.",
    },
    {
      question: "How does this help career growth?",
      answer:
        "You graduate with deployable projects, architecture depth, and clear interview stories.",
    },
  ],
};

const MernStack = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="ms-page">
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

        .ms-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .ms-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .ms-btn {
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

        .ms-section { padding: 52px 0; }
        .ms-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .ms-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .ms-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .ms-chip {
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

        .ms-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .ms-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .ms-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .ms-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 420px;
          margin-bottom: 18px;
        }

        .ms-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .ms-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .ms-stat-value { font-size: 18px; font-weight: 700; }

        .ms-hero-media { position: relative; }

        .ms-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .ms-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .ms-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .ms-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .ms-accordion { display: grid; gap: 14px; }

        .ms-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .ms-module.open { border-color: #d05b36; }

        .ms-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .ms-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ms-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .ms-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .ms-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .ms-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .ms-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .ms-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .ms-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .ms-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .ms-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .ms-overview-grid,
        .ms-why-grid,
        .ms-role-grid,
        .ms-metric-grid,
        .ms-faq-grid {
          display: grid;
          gap: 16px;
        }

        .ms-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ms-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ms-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ms-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .ms-faq-grid { grid-template-columns: 250px 1fr; }

        .ms-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .ms-card h4 { margin: 0 0 8px; font-size: 20px; }
        .ms-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .ms-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .ms-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .ms-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .ms-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .ms-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .ms-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .ms-center { text-align: center; }

        .ms-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .ms-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .ms-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .ms-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }
        
        .ms-role-card h4 {
          font-weight: 700;
        }

        .ms-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .ms-fixed-price {
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

        .ms-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .ms-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .ms-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .ms-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .ms-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .ms-invest h3 { font-size: 40px; margin: 6px 0; }
        .ms-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .ms-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .ms-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .ms-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .ms-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .ms-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .ms-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .ms-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .ms-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .ms-break-row:last-child { border-bottom: 0; }

        .ms-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .ms-partner img { height: 76px; object-fit: contain; }

        .ms-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .ms-faq-menu button {
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

        .ms-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .ms-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .ms-faq-head {
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

        .ms-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .ms-hero,
          .ms-curr-grid,
          .ms-overview-grid,
          .ms-why-grid,
          .ms-role-grid,
          .ms-metric-grid,
          .ms-pay-grid,
          .ms-faq-grid,
          .ms-takeaway-grid,
          .ms-invest-grid {
            grid-template-columns: 1fr;
          }

          .ms-floating-card { left: 14px; }
          .ms-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .ms-section { padding: 42px 0; }
          .ms-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="ms-shell">
        <section className="ms-hero">
          <div>
            <div className="ms-chip">Advanced Program 2026</div>
            <h1>Master the <span>Stack</span> to Ship Products.</h1>
            <p className="ms-sub">
              A premium full-stack learning path to build production-grade web applications from backend APIs to polished frontend experiences.
            </p>

            <div className="ms-stats">
              {heroStats.map((item) => (
                <article className="ms-stat" key={item.label}>
                  <div className="ms-stat-label">{item.label}</div>
                  <div className="ms-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Mern Stack" />
          </div>

          <div className="ms-hero-media">
            <div className="ms-media-box">
              <img src={MERNHero} alt="MERN stack mentor" />
            </div>
            <aside className="ms-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build deployable full-stack applications with architecture, performance, and security best practices.</p>
            </aside>
          </div>
        </section>

        <section className="ms-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A practical progression from fundamentals to production deployment for modern JavaScript full-stack engineering.
          </p>

          <div className="ms-accordion">
            {curriculum.map((module, index) => {
              const isOpen = openModule === index;
              return (
                <article className={`ms-module ${isOpen ? "open" : ""}`} key={module.title}>
                  <div
                    className="ms-module-head"
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
                      <div className="ms-module-week">{module.week}</div>
                      <div className="ms-module-title">{module.title}</div>
                    </div>
                    <span className="ms-module-toggle">{isOpen ? "-" : "+"}</span>
                  </div>

                  {isOpen && (
                    <div className="ms-module-body">
                      <p className="ms-module-objective">{module.objectives}</p>
                      <div className="ms-tag-wrap">
                        {module.topics.map((topic) => (
                          <span className="ms-tag" key={topic}>{topic}</span>
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
            <p className="lead mb-6" style={{ margin: "0 auto 24px" }}>Get a personalized learning path to become a job-ready full-stack developer.</p>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <ApplyForm courseValue="MERN Stack" />
            </div>
          </div>
        </section>

        <section className="ms-section">
          <h2>Program Overview</h2>
          <div className="ms-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="ms-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="ms-section">
          <h2>Why Choose MERN Stack Development?</h2>
          <p className="lead">Build one of the most employable, end-to-end engineering skillsets in modern web development.</p>
          <div className="ms-why-grid">
            {whyChoose.map((item) => (
              <article className="ms-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ms-section">
          <h2>Key Takeaways</h2>
          <div className="ms-takeaway-grid">
            <ul className="ms-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="ms-image">
              <img src={MERNOutcomes} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="ms-section">
          <BenefitsofLearning />
        </section>

        <section className="ms-section">
          <div className="ms-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access the detailed curriculum, project blueprint, and placement preparation plan.
              </p>
            </div>
            <a href={pdfms} target="_blank" rel="noreferrer" className="ms-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="ms-section ms-career">
        <div className="ms-shell">
          <div className="ms-center">
            <h2>Career Opportunities in MERN Stack Development</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for full-stack roles across startups, product companies, and enterprise teams.
            </p>
          </div>

          <div className="ms-role-grid">
            {roles.map((role) => (
              <article className="ms-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="ms-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ms-section">
        <div className="ms-shell">
          <h2 className="ms-center">Our Alumni at Top Brands</h2>
          <p className="lead ms-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="ms-section">
        <div className="ms-shell">
          <h2 className="ms-center">Course Benefits at a Glance</h2>
          <div className="ms-metric-grid">
            <article className="ms-metric"><h4>280+</h4><p>Mentees Placed</p></article>
            <article className="ms-metric"><h4>11+ LPA</h4><p>Average CTC</p></article>
            <article className="ms-metric"><h4>92%</h4><p>Placement Rate</p></article>
            <article className="ms-metric"><h4>460+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="ms-section">
        <div className="ms-shell">
          <Certification />
        </div>
      </section>

      <section className="ms-section">
        <div className="ms-shell">
          <div className="ms-invest">
            <div className="ms-invest-sub">Program Investment</div>
            <h3>Rs 61,999</h3>
            <div className="ms-invest-sub">Total fee (incl. GST)</div>

            <div className="ms-invest-grid">
              <div className="ms-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="ms-invest-item">
                <strong>Installment 1: Rs 26,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="ms-invest-item">
                <strong>Installment 2: Rs 25,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="ms-pay-grid">
            <div className="ms-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 61,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="ms-breakdown">
              <div className="ms-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="ms-break-row"><span>Installment 1</span><strong>Rs 26,000</strong></div>
              <div className="ms-break-row"><span>Installment 2</span><strong>Rs 25,999</strong></div>
            </div>
          </div>

          <div className="ms-partner">
            <p className="ms-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="ms-section" style={{ background: "#fff" }}>
        <div className="ms-shell">
          <StoreSection />
        </div>
      </section>

      <section className="ms-section" style={{ background: "#fff" }}>
        <div className="ms-shell">
          <h2 className="ms-center">Ask Us Anything</h2>
          <div className="ms-faq-grid">
            <aside className="ms-faq-menu">
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
                <article className="ms-faq-item" key={faq.question}>
                  <button
                    className="ms-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="ms-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="ms-fixed-price">
        <span>Program Fee: <strong>Rs 61,999 inclusive of taxes</strong></span>
        <ApplyNowButton courseValue="Mern Stack" />
      </div>
    </div>
  );
};

export default MernStack;
