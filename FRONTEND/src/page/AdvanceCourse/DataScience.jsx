import React, { useState } from "react";
import DSHero from "../../../krutanic/images/dsad1.jpg";
import DSOutcomes from "../../../krutanic/images/dsad2.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfds from "../../../krutanic/DataScienceAdvancedProgram.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";

const heroStats = [

  { label: "Duration", value: "24 Weeks" },
  { label: "Program Rating", value: "4.9/5" },
];

const curriculum = [
  {
    week: "Weeks 1-2",
    title: "Advanced Machine Learning Techniques",
    objectives:
      "Learn advanced supervised and unsupervised algorithms, ensemble models, evaluation, and hyperparameter tuning with practical model optimization.",
    topics: [
      "Supervised and Unsupervised Learning",
      "Ensemble Methods",
      "Model Evaluation and Metrics",
      "Cross Validation",
      "Hyperparameter Optimization",
    ],
  },
  {
    week: "Weeks 3-4",
    title: "Deep Learning with TensorFlow and Keras",
    objectives:
      "Train deeper neural architectures for image, sequence, and NLP tasks while understanding optimization and deployment tradeoffs.",
    topics: [
      "Neural Network Fundamentals",
      "CNN",
      "RNN and LSTM",
      "TensorFlow and Keras",
      "Fine Tuning",
    ],
  },
  {
    week: "Week 5",
    title: "Big Data Analytics",
    objectives:
      "Work with Hadoop and Spark for distributed processing, large dataset analytics, and real-time pipelines.",
    topics: [
      "Hadoop Ecosystem",
      "Spark Processing",
      "NoSQL",
      "Data Pipelines",
      "Kafka and Streaming",
    ],
  },
  {
    week: "Week 6-7",
    title: "Feature Engineering and Model Optimization",
    objectives:
      "Design features, apply dimensionality reduction, and improve model reliability with regularization and tuning workflows.",
    topics: [
      "Feature Extraction",
      "Feature Selection",
      "PCA and t-SNE",
      "Regularization",
      "Grid and Random Search",
    ],
  },
  {
    week: "Week 8",
    title: "AI Applications and Real-World Case Studies",
    objectives:
      "Use AI to solve real business problems across healthcare, finance, and retail with end-to-end applied case studies.",
    topics: [
      "Industry AI Use Cases",
      "Fraud Detection",
      "Predictive Analytics",
      "Case Study Reviews",
      "Deployment Strategies",
    ],
  },
  {
    week: "Week 9-10",
    title: "Natural Language Processing",
    objectives:
      "Master NLP pipelines, text representation, and transformer model workflows for modern language applications.",
    topics: [
      "Text Preprocessing",
      "Sentiment Analysis",
      "Named Entity Recognition",
      "Embeddings",
      "Transformers",
    ],
  },
  {
    week: "Week 11-12",
    title: "Data Visualization and Communication",
    objectives:
      "Present complex findings with dashboards and visual narratives that help teams make faster, better decisions.",
    topics: [
      "Matplotlib and Seaborn",
      "Plotly Dashboards",
      "Power BI and Tableau",
      "Data Storytelling",
      "Stakeholder Communication",
    ],
  },
  {
    week: "Week 13-14",
    title: "Cloud Computing for Data Science",
    objectives:
      "Deploy and scale models on cloud platforms using production-oriented data and model lifecycle practices.",
    topics: [
      "AWS, Azure, GCP",
      "Cloud Model Deployment",
      "Scalable Processing",
      "Cloud Storage",
      "Monitoring",
    ],
  },
  {
    week: "Week 15-16",
    title: "Ethical AI and Responsible Data Science",
    objectives:
      "Build ethical systems that account for fairness, privacy, bias, and governance requirements.",
    topics: [
      "Bias in ML",
      "Fairness and Ethics",
      "Privacy and Compliance",
      "Transparency",
      "Responsible AI",
    ],
  },
  {
    week: "Week 17-20",
    title: "Capstone Project and Career Preparation",
    objectives:
      "Execute a full capstone project with project documentation, model delivery, and portfolio presentation.",
    topics: [
      "Capstone Project",
      "ML and AI Integration",
      "End-to-End Delivery",
      "Documentation",
      "Portfolio Building",
    ],
  },
  {
    week: "Week 21-24",
    title: "Placement Preparation",
    objectives:
      "Prepare with resume strategy, mock interviews, and placement support for data and AI roles.",
    topics: [
      "Resume Building",
      "Interview Preparation",
      "Communication",
      "Portfolio Review",
      "Placement Assistance",
    ],
  },
];

const overviewTopics = [
  "Advanced Machine Learning Algorithms",
  "Big Data Analytics with Hadoop and Spark",
  "Deep Learning with TensorFlow and Keras",
  "Feature Engineering and Model Optimization",
  "AI Applications and Real-World Case Studies",
  "Natural Language Processing Methodology",
];

const whyChoose = [
  {
    title: "High Demand",
    description:
      "Data science demand continues to rise across product, analytics, and AI-first teams.",
  },
  {
    title: "Lucrative Salaries",
    description:
      "Specialized practitioners command strong compensation with high growth potential.",
  },
  {
    title: "Industry Versatility",
    description:
      "Apply your skills in finance, healthcare, retail, SaaS, and enterprise operations.",
  },
  {
    title: "Impactful Work",
    description:
      "Solve decisions that materially improve customer outcomes and business growth.",
  },
  {
    title: "In-Demand Skills",
    description:
      "Master Python, model building, deployment, and experimentation workflows.",
  },
  {
    title: "Continuous Innovation",
    description:
      "Stay relevant through fast-moving developments in LLMs, tooling, and infrastructure.",
  },
];

const keyTakeaways = [
  "Master advanced machine learning and deep learning techniques for real use-cases.",
  "Develop big data expertise with Hadoop, Spark, and scalable pipeline architecture.",
  "Build strong visualization and storytelling capability with business dashboards.",
  "Apply predictive analytics to forecasting, risk, and decision intelligence.",
  "Design robust data preparation and feature workflows that improve model quality.",
  "Solve real business problems with capstone-style projects and portfolio outcomes.",
];

const roles = [
  {
    title: "Data Scientist",
    text: "Lead analytical decisions and discover non-obvious business patterns.",
    avg: "Package range: Rs 8-18 LPA",
  },
  {
    title: "Data Analyst",
    text: "Interpret data and build reporting systems to support decision-making.",
    avg: "Package range: Rs 4-10 LPA",
  },
  {
    title: "Machine Learning Engineer",
    text: "Deploy and optimize machine learning systems for production scale.",
    avg: "Package range: Rs 10-22 LPA",
  },
  {
    title: "Data Engineer",
    text: "Build high-throughput data pipelines and resilient infrastructure.",
    avg: "Package range: Rs 8-20 LPA",
  },
  {
    title: "Business Intelligence Analyst",
    text: "Transform business data into strategic, executable insights.",
    avg: "Package range: Rs 5-12 LPA",
  },
  {
    title: "AI Engineer",
    text: "Build AI-driven products and intelligent automation systems.",
    avg: "Package range: Rs 12-28 LPA",
  },
  {
    title: "Big Data Specialist",
    text: "Work with large-scale processing and high-volume data ecosystems.",
    avg: "Package range: Rs 9-20 LPA",
  },
  {
    title: "Data Science Consultant",
    text: "Guide organizations with data strategy and model-led business execution.",
    avg: "Package range: Rs 10-24 LPA",
  },
  {
    title: "Quantitative Analyst",
    text: "Build statistical and mathematical models for complex forecasting.",
    avg: "Package range: Rs 8-22 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the Data Science program?",
      answer:
        "The program covers machine learning, deep learning, big data technologies, NLP, cloud deployment, and industry use-cases.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course is delivered with a blend of live sessions, recordings, practical tasks, and structured projects.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, hands-on projects and case studies are integrated throughout the curriculum.",
    },
    {
      question: "How long is the program?",
      answer:
        "The program runs for 24 weeks with a progressive module structure.",
    },
  ],
  Eligibility: [
    {
      question: "What are the prerequisites for the program?",
      answer:
        "Basic programming familiarity and comfort with analytical thinking are recommended.",
    },
    {
      question: "Do I need prior data science experience?",
      answer:
        "Prior experience helps, but the learning path is designed to build up progressively.",
    },
    {
      question: "Can beginners apply?",
      answer:
        "Learners with a strong commitment and basic technical foundation can apply.",
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
        "Through group sessions, cohort channels, collaborative assignments, and alumni events.",
    },
    {
      question: "Is there mentorship available?",
      answer: "Yes, mentor support is available throughout the program journey.",
    },
    {
      question: "Can I access support after the course ends?",
      answer:
        "Yes, alumni and support channels remain available after completion.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "The cohort includes professionals and learners from diverse backgrounds and industries.",
    },
  ],
  Lectures: [
    {
      question: "Are the lectures pre-recorded or live?",
      answer:
        "Both, so you can learn with flexibility while still attending live mentor sessions.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Live sessions are discussion-heavy and include interactive problem solving.",
    },
    {
      question: "Can I replay missed lectures?",
      answer: "Yes, recordings are available for review.",
    },
    {
      question: "How often are live sessions held?",
      answer: "Live sessions are held weekly with structured support touchpoints.",
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
        "It demonstrates practical capability and project readiness in data roles.",
    },
    {
      question: "Can I add this certification to my resume or LinkedIn profile?",
      answer: "Yes, it can be added to both.",
    },
    {
      question: "Is the certification free?",
      answer: "Certification is included with successful program completion.",
    },
  ],
  Opportunities: [
    {
      question: "What career opportunities does this open?",
      answer:
        "You can target roles across analytics, machine learning, AI engineering, and data infrastructure.",
    },
    {
      question: "Will I receive job placement assistance?",
      answer: "Yes, career guidance and placement support are included.",
    },
    {
      question: "Are internships available through this program?",
      answer:
        "Selected learners may access internship pathways based on partner opportunities.",
    },
    {
      question: "How will this help advance my career?",
      answer:
        "You build portfolio-grade work, practical technical depth, and interview readiness.",
    },
  ],
};

const DataScience = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="ds-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,800&display=swap');

        :root {
          --bg: #f3f1f1;
          --panel: #ffffff;
          --ink: #171717;
          --muted: #626262;
          --line: #ded8d5;
          --accent: #c43609;
          --accent-dark: #8f2100;
          --radius: 18px;
          --shadow: 0 20px 40px rgba(29, 20, 13, 0.08);
        }

        * { box-sizing: border-box; }

        .ds-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
          padding-bottom: 74px;
        }

        .ds-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .ds-btn {
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

        .ds-section { padding: 52px 0; }
        .ds-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .ds-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .ds-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .ds-chip {
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

        .ds-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .ds-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .ds-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .ds-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 560px;
          margin-bottom: 18px;
        }

        .ds-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .ds-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .ds-stat-value { font-size: 18px; font-weight: 700; }

        .ds-hero-media { position: relative; }

        .ds-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .ds-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .ds-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .ds-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .ds-accordion { display: grid; gap: 14px; }

        .ds-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .ds-module.open { border-color: #d05b36; }

        .ds-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .ds-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ds-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .ds-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .ds-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .ds-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .ds-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .ds-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .ds-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .ds-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .ds-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .ds-overview-grid,
        .ds-why-grid,
        .ds-role-grid,
        .ds-metric-grid,
        .ds-faq-grid {
          display: grid;
          gap: 16px;
        }

        .ds-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ds-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ds-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ds-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .ds-faq-grid { grid-template-columns: 250px 1fr; }

        .ds-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .ds-card h4 { margin: 0 0 8px; font-size: 20px; }
        .ds-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .ds-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .ds-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .ds-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .ds-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .ds-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .ds-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .ds-center { text-align: center; }

        .ds-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .ds-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .ds-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .ds-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }

        .ds-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .ds-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .ds-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .ds-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .ds-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .ds-invest h3 { font-size: 40px; margin: 6px 0; }
        .ds-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .ds-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .ds-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .ds-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .ds-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .ds-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .ds-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .ds-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .ds-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .ds-break-row:last-child { border-bottom: 0; }

        .ds-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .ds-partner img { height: 76px; object-fit: contain; }

        .ds-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .ds-faq-menu button {
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

        .ds-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .ds-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .ds-faq-head {
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

        .ds-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        .ds-fixed-price {
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

        .ds-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 8px;
        }

        @media (max-width: 1080px) {
          .ds-hero,
          .ds-curr-grid,
          .ds-overview-grid,
          .ds-why-grid,
          .ds-role-grid,
          .ds-metric-grid,
          .ds-pay-grid,
          .ds-faq-grid,
          .ds-takeaway-grid,
          .ds-invest-grid {
            grid-template-columns: 1fr;
          }

          .ds-floating-card { left: 14px; }
          .ds-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .ds-section { padding: 42px 0; }
          .ds-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="ds-shell">
        <section className="ds-hero">
          <div>
            <div className="ds-chip">Advanced Program 2026</div>
            <h1>Master the <span>Science</span> of Data.</h1>
            <p className="ds-sub">
              A high-end editorial learning experience designed for elite practitioners.
              Build production intelligence systems with clarity, precision, and speed.
            </p>

            <div className="ds-stats">
              {heroStats.map((item) => (
                <article className="ds-stat" key={item.label}>
                  <div className="ds-stat-label">{item.label}</div>
                  <div className="ds-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Data Science" />
          </div>

          <div className="ds-hero-media">
            <div className="ds-media-box">
              <img src={DSHero} alt="Data science mentor" />
            </div>
            <aside className="ds-floating-card">
              <h4>Outcome Focused</h4>
              <p>Graduates have built teams at Google, Meta, and Netflix.</p>
            </aside>
          </div>
        </section>

        <section className="ds-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A rigorous path from fundamentals to neural architectures and modern LLM systems.
            Curated for serious practitioners building at industry scale.
          </p>

          <div className="ds-curr-grid">
            <div className="ds-accordion">
              {curriculum.map((module, index) => {
                const isOpen = openModule === index;
                return (
                  <article className={`ds-module ${isOpen ? "open" : ""}`} key={module.title}>
                    <div
                      className="ds-module-head"
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
                        <div className="ds-module-week">{module.week}</div>
                        <div className="ds-module-title">{module.title}</div>
                      </div>
                      <span className="ds-module-toggle">{isOpen ? "-" : "+"}</span>
                    </div>

                    {isOpen && (
                      <div className="ds-module-body">
                        <p className="ds-module-objective">{module.objectives}</p>
                        <div className="ds-tag-wrap">
                          {module.topics.map((topic) => (
                            <span className="ds-tag" key={topic}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="ds-side-panel">
              <h3>Speak with an Advisor</h3>
              <p>Get a personalized curriculum walkthrough and career roadmap.</p>
              <ApplyForm />
            </aside>
          </div>
        </section>

        <section className="ds-section">
          <h2>Program Overview</h2>
          <div className="ds-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="ds-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Why Choose Data Science?</h2>
          <p className="lead">Build one of the most future-proof skillsets across analytics, AI, and modern product organizations.</p>
          <div className="ds-why-grid">
            {whyChoose.map((item) => (
              <article className="ds-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ds-section">
          <h2>Key Takeaways</h2>
          <div className="ds-takeaway-grid">
            <ul className="ds-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="ds-image">
              <img src={DSOutcomes} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="ds-section">
          <BenefitsofLearning />
        </section>

        <section className="ds-section">
          <div className="ds-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access the detailed curriculum with modules, outcomes, and execution roadmap.
              </p>
            </div>
            <a href={pdfds} target="_blank" rel="noreferrer" className="ds-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="ds-section ds-career">
        <div className="ds-shell">
          <div className="ds-center">
            <h2>Career Opportunities in Data Science</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for high-impact roles across product, platform, and applied AI teams.
            </p>
          </div>

          <div className="ds-role-grid">
            {roles.map((role) => (
              <article className="ds-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="ds-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-shell">
          <h2 className="ds-center">Our Alumni at Top Brands</h2>
          <p className="lead ds-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-shell">
          <h2 className="ds-center">Course Benefits at a Glance</h2>
          <div className="ds-metric-grid">
            <article className="ds-metric"><h4>200+</h4><p>Mentees Placed</p></article>
            <article className="ds-metric"><h4>10+ LPA</h4><p>Average CTC</p></article>
            <article className="ds-metric"><h4>93%</h4><p>Placement Rate</p></article>
            <article className="ds-metric"><h4>450+</h4><p>Hiring Partners</p></article>
          </div>
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-shell">
          <Certification />
        </div>
      </section>

      <section className="ds-section">
        <div className="ds-shell">
          <div className="ds-invest">
            <div className="ds-invest-sub">Program Investment</div>
            <h3>Rs 65,999</h3>
            <div className="ds-invest-sub">Total fee (incl. GST)</div>

            <div className="ds-invest-grid">
              <div className="ds-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="ds-invest-item">
                <strong>Installment 1: Rs 28,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="ds-invest-item">
                <strong>Installment 2: Rs 27,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="ds-pay-grid">
            <div className="ds-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 65,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="ds-breakdown">
              <div className="ds-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="ds-break-row"><span>Installment 1</span><strong>Rs 28,000</strong></div>
              <div className="ds-break-row"><span>Installment 2</span><strong>Rs 27,999</strong></div>
            </div>
          </div>

          <div className="ds-partner">
            <p className="ds-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="ds-section" style={{ background: "#fff" }}>
        <div className="ds-shell">
          <StoreSection />
        </div>
      </section>

      <section className="ds-section" style={{ background: "#fff" }}>
        <div className="ds-shell">
          <h2 className="ds-center">Ask Us Anything</h2>
          <div className="ds-faq-grid">
            <aside className="ds-faq-menu">
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
                <article className="ds-faq-item" key={faq.question}>
                  <button
                    className="ds-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="ds-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="ds-fixed-price">Price: <strong>Rs 65999 inclusive of GST</strong></div>
    </div>
  );
};

export default DataScience;
