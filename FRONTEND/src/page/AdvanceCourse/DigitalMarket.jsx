import React, { useState } from "react";
import DMHero from "../../../krutanic/images/dmad1.jpg";
import DMOutcomes from "../../../krutanic/images/dmad2.jpg";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import pdfdm from "../../../krutanic/Digital Marketing Advanced Program.pdf";
import BenefitsofLearning from "./Components/BenefitsofLearning";
import Certification from "./Components/Certification";
import StoreSection from "./Components/StoreSection";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";

const heroStats = [
  { label: "Placement Rate", value: "93%" },
  { label: "Hiring Partners", value: "450+" },
];

const curriculum = [
  {
    week: "Module 1",
    title: "Social Media Marketing (SMM)",
    objectives: "Strategy, Content & Growth. Master the platform ecosystem and build brand-level case studies.",
    topics: [
      "Social Media Fundamentals",
      "Instagram Marketing & Funnel",
      "Content Strategy & Ideation",
      "Short-form Reels Strategy",
      "LinkedIn Personal Branding",
      "YouTube Growth Strategy",
      "AI Content Tools (Canva/AI)",
      "Campaign Optimization"
    ],
  },
  {
    week: "Module 2",
    title: "Search Engine Optimization (SEO)",
    objectives: "Organic Growth & Higher Rankings. Technical, On-page, and Off-page mastery.",
    topics: [
      "SEO Fundamentals",
      "On-Page, Technical & Off-Page",
      "AI-Powered Content Optimization",
      "Google Search Console",
      "Keyword Research (Myntra)",
      "Website SEO Audits",
      "E-commerce & SaaS SEO",
      "URL Structuring"
    ],
  },
  {
    week: "Module 3",
    title: "Performance Marketing",
    objectives: "Paid Ads & Data-Driven Growth. Mastering Meta and Google Ads ROI.",
    topics: [
      "Marketing Funnels & KPIs",
      "CTR, CPA, ROAS Metrics",
      "Excel for Marketing Analytics",
      "Meta Ads (FB/Instagram)",
      "Google Ads (Search/Shopping)",
      "Google Analytics (GA4)",
      "A/B Testing",
      "Looker Studio Dashboards"
    ],
  },
  {
    week: "Module 4",
    title: "Advanced Marketing & Automation",
    objectives: "Scaling & Growth Systems. Omnichannel and conversion optimization.",
    topics: [
      "Conversion Rate Optimization",
      "Email Marketing Automation",
      "Omnichannel (WhatsApp/SMS)",
      "Influencer & Affiliate Marketing",
      "E-Commerce Growth Strategies",
      "Retargeting Systems",
      "App & B2B (LinkedIn Ads)"
    ],
  },
  {
    week: "Module 5",
    title: "Career Acceleration",
    objectives: "Job Readiness & Personal Branding. Resume building and mock interviews.",
    topics: [
      "Resume Building",
      "LinkedIn Optimization",
      "Portfolio Development",
      "Industry Case Studies",
      "Mock Interviews",
      "Placement Support"
    ],
  },
];

const overviewTopics = [
  "Industry-Driven Curriculum",
  "Mentor-Led Learning",
  "Full-Funnel Expertise",
  "Execution-First Approach",
  "Small Cohorts (High Attention)",
  "Live Campaign Execution",
  "Portfolio Projects",
  "Data & AI Integration",
  "Career Acceleration Support",
  "Outcome-Focused Training"
];

const whyChoose = [
  {
    title: "10M+ Jobs Worldwide",
    description: "Digital marketing is one of the fastest growing industries globally with increasing demand."
  },
  {
    title: "Budget Transformation",
    description: "70%+ of marketing budgets are shifting towards digital platforms, creating endless roles."
  },
  {
    title: "Online Essential",
    description: "90% of businesses are online today; a digital presence is no longer optional."
  }
];

const keyTakeaways = [
  "Skills: Google Forms, ChatGPT, Canva, Grammarly, Notion, Figma.",
  "SEO: Search Console, SEMRUSH, Ahrefs, Ubersuggest, GA4, ScreamingFrog.",
  "Social: Meta Business Suite, YouTube, TikTok, LinkedIn, Buffer, Hootsuite.",
  "Ads: Meta Ads Manager, Google Ads, Zapier, Webflow, HubSpot, Mailchimp."
];

const roles = [
  {
    title: "Performance Marketing Analyst",
    text: "Analyze and optimize paid campaigns for maximum ROI.",
    avg: "Salary: ₹4-7 LPA",
  },
  {
    title: "Paid Media Specialist",
    text: "Master Google and Meta ads for large scale acquisition.",
    avg: "Salary: ₹5-9 LPA",
  },
  {
    title: "Social Media Manager",
    text: "Manage brand voice and community across social platforms.",
    avg: "Salary: ₹4-7 LPA",
  },
  {
    title: "SEO Specialist",
    text: "Drive sustainable organic traffic through technical expertise.",
    avg: "Salary: ₹4-8 LPA",
  },
  {
    title: "Digital Marketing Executive",
    text: "Handle day-to-state digital operations for brands.",
    avg: "Salary: ₹3.5-6 LPA",
  },
  {
    title: "Growth Marketing Associate",
    text: "Execute rapid experiments to unlock scalable growth loops.",
    avg: "Salary: ₹5-10 LPA",
  },
];

const faqData = {
  Program: [
    {
      question: "What topics are covered in the Digital Marketing program?",
      answer:
        "The program covers SEO, PPC, social media, email automation, content strategy, analytics, and growth systems.",
    },
    {
      question: "How is the course delivered?",
      answer:
        "The course includes live sessions, recordings, guided assignments, and campaign-based projects.",
    },
    {
      question: "Will I get hands-on experience?",
      answer:
        "Yes, you will run practical projects with channel planning, execution, and reporting workflows.",
    },
    {
      question: "How long is the program?",
      answer:
        "The program runs for 24 weeks with a progressive, portfolio-focused structure.",
    },
  ],
  Eligibility: [
    {
      question: "What are the prerequisites for this program?",
      answer:
        "No mandatory prerequisites. Basic comfort with digital tools is helpful.",
    },
    {
      question: "Do I need prior digital marketing experience?",
      answer:
        "No, both beginners and early practitioners can use this track to become job-ready.",
    },
    {
      question: "Can beginners apply?",
      answer:
        "Yes, the sequence starts with fundamentals and builds up to advanced execution.",
    },
    {
      question: "Is there any age restriction?",
      answer: "No, the program is open to all eligible learners.",
    },
  ],
  Community: [
    {
      question: "How can I interact with other participants?",
      answer:
        "You can collaborate through cohort groups, assignment reviews, and peer learning sessions.",
    },
    {
      question: "Is mentorship available?",
      answer:
        "Yes, mentors provide guidance on projects, campaign design, and career positioning.",
    },
    {
      question: "Can I access support after completion?",
      answer: "Yes, alumni and ongoing support channels are available after graduation.",
    },
    {
      question: "How diverse is the community?",
      answer:
        "Learners come from varied industries including ecommerce, SaaS, agencies, and startups.",
    },
  ],
  Lectures: [
    {
      question: "Are sessions live or recorded?",
      answer:
        "Both. Live sessions for interaction and recordings for flexible revision.",
    },
    {
      question: "How interactive are the sessions?",
      answer:
        "Sessions include practical breakdowns, campaign critiques, and tactical discussions.",
    },
    {
      question: "Can I replay missed lectures?",
      answer: "Yes, recordings are available for each module.",
    },
    {
      question: "How often are live sessions held?",
      answer: "Live sessions are conducted weekly.",
    },
  ],
  Certification: [
    {
      question: "Will I receive a certificate on completion?",
      answer: "Yes, eligible learners receive a professional completion certificate.",
    },
    {
      question: "Is the certification recognized by employers?",
      answer:
        "It demonstrates practical execution capability and portfolio-backed readiness.",
    },
    {
      question: "Can I add this certification to resume/LinkedIn?",
      answer: "Yes, it is designed for professional showcase.",
    },
    {
      question: "Is certification included in the fee?",
      answer: "Yes, it is included for successful graduates.",
    },
  ],
  Opportunities: [
    {
      question: "What roles can I target after this program?",
      answer:
        "You can target SEO, paid media, growth, lifecycle, social, and analytics roles.",
    },
    {
      question: "Is there placement support?",
      answer: "Yes, placement assistance and interview support are included.",
    },
    {
      question: "Are internships available?",
      answer:
        "Select learners may access internship and project opportunities through partner networks.",
    },
    {
      question: "How does this help career growth?",
      answer:
        "You graduate with campaign execution depth, measurable outcomes, and a hiring-ready portfolio.",
    },
  ],
};

const DigitalMarket = () => {
  const [openModule, setOpenModule] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Program");
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="dm-page">
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

        .dm-page {
          background:
            radial-gradient(circle at 8% 8%, rgba(196, 54, 9, 0.08), transparent 34%),
            radial-gradient(circle at 95% 55%, rgba(15, 77, 98, 0.09), transparent 28%),
            var(--bg);
          color: var(--ink);
          font-family: "Sora", "Segoe UI", sans-serif;
        }

        .dm-shell {
          width: min(100%, calc(100% - 32px));
          margin: 0 auto;
        }

        .dm-btn {
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

        .dm-section { padding: 52px 0; }
        .dm-section h2 { font-size: clamp(32px, 4vw, 50px); margin: 0 0 12px; }
        .dm-section p.lead {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 0 26px;
          max-width: 760px;
        }

        .dm-hero {
          border-top: 1px solid var(--line);
          display: grid;
          gap: 32px;
          grid-template-columns: 1fr 1fr;
          padding: 26px 0 28px;
        }

        .dm-chip {
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

        .dm-hero h1 {
          font-size: clamp(42px, 5vw, 74px);
          line-height: 0.98;
          margin: 16px 0;
        }

        .dm-hero h1 span {
          color: var(--accent);
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-weight: 800;
        }

        .dm-sub {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.6;
          max-width: 520px;
          margin-bottom: 22px;
        }

        .dm-stats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 420px;
          margin-bottom: 18px;
        }

        .dm-stat {
          background: var(--panel);
          border: 1px solid #eadeda;
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 16px 14px;
        }

        .dm-stat-label {
          color: #8a8a8a;
          font-size: 11px;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .dm-stat-value { font-size: 18px; font-weight: 700; }

        .dm-hero-media { position: relative; }

        .dm-media-box {
          background: radial-gradient(circle at 25% 20%, #17627c 0%, #0d1826 70%);
          border-radius: 22px;
          box-shadow: 0 24px 46px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          padding: 18px;
        }

        .dm-media-box img {
          border-radius: 16px;
          display: block;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          width: 100%;
        }

        .dm-floating-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(19, 16, 11, 0.18);
          left: -20px;
          max-width: 300px;
          padding: 16px;
          position: absolute;
          bottom: -20px;
        }

        .dm-curr-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 2fr 1fr;
        }

        .dm-accordion { display: grid; gap: 14px; }

        .dm-module {
          background: var(--panel);
          border: 1px solid #e7e0dc;
          border-radius: var(--radius);
          padding: 18px;
        }

        .dm-module.open { border-color: #d05b36; }

        .dm-module-head {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }

        .dm-module-week {
          color: #9b9b9b;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .dm-module-title { font-size: 24px; font-weight: 600; margin-top: 5px; }
        .dm-module-toggle { color: #7b7b7b; font-size: 24px; line-height: 1; }

        .dm-module-body {
          border-top: 1px solid #eee4de;
          margin-top: 16px;
          padding-top: 15px;
        }

        .dm-module-objective {
          color: #4b4b4b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .dm-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .dm-tag {
          background: #f3e7e1;
          border-radius: 999px;
          color: #8d4d3b;
          font-size: 11px;
          padding: 5px 11px;
        }

        .dm-side-panel {
          background: var(--panel);
          border: 1px solid #e8e0dc;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          height: fit-content;
          padding: 20px;
        }

        .dm-side-panel h3 { font-size: 28px; margin: 0 0 6px; }
        .dm-side-panel p { color: #6f6f6f; font-size: 14px; margin: 0 0 16px; }

        .dm-overview-grid,
        .dm-why-grid,
        .dm-role-grid,
        .dm-metric-grid,
        .dm-faq-grid {
          display: grid;
          gap: 16px;
        }

        .dm-overview-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .dm-why-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .dm-role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .dm-metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .dm-faq-grid { grid-template-columns: 250px 1fr; }

        .dm-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          padding: 20px;
        }

        .dm-card h4 { margin: 0 0 8px; font-size: 20px; }
        .dm-card p { margin: 0; color: #5f5f5f; line-height: 1.6; }

        .dm-takeaway-grid {
          align-items: center;
          display: grid;
          gap: 22px;
          grid-template-columns: 1.3fr 1fr;
        }

        .dm-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: 10px;
        }

        .dm-list li {
          list-style: none;
          padding-left: 16px;
          position: relative;
          color: #454545;
          line-height: 1.55;
        }

        .dm-list li::before {
          background: #cb4213;
          border-radius: 50%;
          content: "";
          height: 6px;
          left: 0;
          position: absolute;
          top: 9px;
          width: 6px;
        }

        .dm-image {
          border-radius: 16px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .dm-image img {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
        }

        .dm-center { text-align: center; }

        .dm-brochure {
          align-items: center;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          background: #fff;
        }

        .dm-career { background: #eceaea; border-top: 1px solid #ddd8d5; border-bottom: 1px solid #ddd8d5; }

        .dm-role-card {
          background: #f7f5f4;
          border: 1px solid #e6dfdc;
          border-radius: 16px;
          min-height: 190px;
          padding: 22px;
          position: relative;
        }

        .dm-role-dot {
          background: #be3a10;
          border-radius: 50%;
          height: 10px;
          margin-bottom: 16px;
          width: 10px;
        }
        
        .dm-role-card h4 {
          font-weight: 700;
        }

        .dm-role-card strong {
          color: #b12e03;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .dm-fixed-price {
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

        .dm-fixed-price strong {
          color: var(--accent-dark);
          margin-left: 6px;
        }

        .dm-metric {
          text-align: center;
          padding: 16px;
          border: 1px solid #e6dfdc;
          border-radius: 14px;
          background: #fff;
        }

        .dm-metric h4 { margin: 0; color: #bf390d; font-size: 30px; }
        .dm-metric p { margin: 6px 0 0; color: #5f5f5f; }

        .dm-invest {
          background: #fdfcfc;
          border: 2px solid #ca3f12;
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 28px;
        }

        .dm-invest h3 { font-size: 40px; margin: 6px 0; }
        .dm-invest-sub { color: #7a7a7a; font-size: 13px; text-transform: uppercase; }

        .dm-invest-grid {
          border-top: 1px solid #ece4e0;
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 20px;
          padding-top: 16px;
        }

        .dm-invest-item strong { color: #bf390d; display: block; margin-bottom: 6px; }
        .dm-invest-item span { color: #5e5e5e; font-size: 13px; line-height: 1.5; }

        .dm-pay-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr 1fr;
          margin-top: 16px;
        }

        .dm-fee-box {
          background: linear-gradient(145deg, #df5a2c 0%, #b73b14 100%);
          border-radius: 26px;
          color: #fff;
          padding: 24px;
          text-align: center;
        }

        .dm-fee-box .fee { font-size: 48px; font-weight: 800; line-height: 1.1; }

        .dm-breakdown {
          background: #fff;
          border: 1px solid #e8e0dc;
          border-radius: 16px;
          padding: 16px;
        }

        .dm-break-row {
          border-bottom: 1px solid #ebe3df;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
        }

        .dm-break-row:last-child { border-bottom: 0; }

        .dm-partner {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .dm-partner img { height: 76px; object-fit: contain; }

        .dm-faq-menu {
          border: 1px solid #e5deda;
          border-radius: 14px;
          background: #fff;
          padding: 12px;
          height: fit-content;
        }

        .dm-faq-menu button {
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

        .dm-faq-menu button.active {
          border-color: #d35e39;
          color: #b9380f;
        }

        .dm-faq-item {
          border: 1px solid #e7e0dc;
          border-radius: 12px;
          margin-bottom: 10px;
          overflow: hidden;
        }

        .dm-faq-head {
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

        .dm-faq-body {
          background: #f8f5f4;
          color: #4f4f4f;
          padding: 12px 14px;
          border-top: 1px solid #e7e0dc;
        }

        @media (max-width: 1080px) {
          .dm-hero,
          .dm-curr-grid,
          .dm-overview-grid,
          .dm-why-grid,
          .dm-role-grid,
          .dm-metric-grid,
          .dm-pay-grid,
          .dm-faq-grid,
          .dm-takeaway-grid,
          .dm-invest-grid {
            grid-template-columns: 1fr;
          }

          .dm-floating-card { left: 14px; }
          .dm-brochure { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 780px) {
          .dm-section { padding: 42px 0; }
          .dm-module-title { font-size: 21px; }
        }
      `}</style>

      <div className="dm-shell">
        <section className="dm-hero">
          <div>
            <div className="dm-chip">Advanced Program 2026</div>
            <h1>Digital Marketing & <span>Growth</span> Accelerator.</h1>
            <p className="dm-sub">
              A ladder for a brighter future. Master the full funnel: SMM, SEO, and Performance Marketing through execution-first training. 
            </p>

            <div className="dm-stats">
              {heroStats.map((item) => (
                <article className="dm-stat" key={item.label}>
                  <div className="dm-stat-label">{item.label}</div>
                  <div className="dm-stat-value">{item.value}</div>
                </article>
              ))}
            </div>

            <ApplyNowButton courseValue="Digital Marketing" />
          </div>

          <div className="dm-hero-media">
            <div className="dm-media-box">
              <img src={DMHero} alt="Digital marketing mentor" />
            </div>
            <aside className="dm-floating-card">
              <h4>Outcome Focused</h4>
              <p>Build campaign outcomes that map directly to acquisition, retention, and revenue growth.</p>
            </aside>
          </div>
        </section>

        <section className="dm-section">
          <h2>Curriculum</h2>
          <p className="lead">
            A practical, high-rigor roadmap from marketing foundations to full-funnel growth execution.
            Designed for modern digital operators.
          </p>

          <div className="dm-accordion">
            {curriculum.map((module, index) => {
              const isOpen = openModule === index;
              return (
                <article className={`dm-module ${isOpen ? "open" : ""}`} key={module.title}>
                  <div
                    className="dm-module-head"
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
                      <div className="dm-module-week">{module.week}</div>
                      <div className="dm-module-title">{module.title}</div>
                    </div>
                    <span className="dm-module-toggle">{isOpen ? "-" : "+"}</span>
                  </div>

                  {isOpen && (
                    <div className="dm-module-body">
                      <p className="dm-module-objective">{module.objectives}</p>
                      <div className="dm-tag-wrap">
                        {module.topics.map((topic) => (
                          <span className="dm-tag" key={topic}>{topic}</span>
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
            <p className="lead mb-6" style={{ margin: "0 auto 24px" }}>Get a personalized roadmap to transition or accelerate your growth marketing career.</p>
            <div style={{ width: "min(90%, calc(100% - 32px))", margin: "auto", padding: "0" }}>
              <ApplyForm courseValue="Digital Marketing" />
            </div>
          </div>
        </section>

        <section className="dm-section">
          <h2>Program Overview</h2>
          <div className="dm-overview-grid">
            {overviewTopics.map((topic) => (
              <article className="dm-card" key={topic}>
                <h4>{topic}</h4>
              </article>
            ))}
          </div>
        </section>

        <section className="dm-section">
          <h2>Why Choose Digital Marketing?</h2>
          <p className="lead">Build one of the most versatile and high-velocity career paths in the digital economy.</p>
          <div className="dm-why-grid">
            {whyChoose.map((item) => (
              <article className="dm-card" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dm-section">
          <h2>Key Takeaways</h2>
          <div className="dm-takeaway-grid">
            <ul className="dm-list">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="dm-image">
              <img src={DMOutcomes} alt="Key outcomes" />
            </div>
          </div>
        </section>

        <section className="dm-section">
          <BenefitsofLearning />
        </section>

        <section className="dm-section">
          <div className="dm-brochure">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "32px" }}>Get the Full Course Breakdown</h2>
              <p className="lead" style={{ margin: 0 }}>
                Access the detailed curriculum with channel strategy, execution templates, and case studies.
              </p>
            </div>
            <a href={pdfdm} target="_blank" rel="noreferrer" className="dm-btn" style={{ textDecoration: "none" }}>
              Download
            </a>
          </div>
        </section>
      </div>

      <section className="dm-section dm-career">
        <div className="dm-shell">
          <div className="dm-center">
            <h2>Career Opportunities in Digital Marketing</h2>
            <p className="lead" style={{ margin: "0 auto", maxWidth: "640px" }}>
              The program prepares you for high-impact growth, performance, and digital strategy roles.
            </p>
          </div>

          <div className="dm-role-grid">
            {roles.map((role) => (
              <article className="dm-role-card" key={role.title}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div className="dm-role-dot" style={{ marginBottom: 0 }} />
                  <h4 style={{ margin: 0 }}>{role.title}</h4>
                </div>
                <p>{role.text}</p>
                <strong>{role.avg}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dm-section">
        <div className="dm-shell">
          <h2 className="dm-center">Our Alumni at Top Brands</h2>
          <p className="lead dm-center" style={{ margin: "0 auto 18px", maxWidth: "760px" }}>
            Their success stories inspire current students to aim for global excellence.
          </p>
          <ClientsCarousel />
        </div>
      </section>

      <section className="dm-section">
        <div className="dm-shell">
          <h2 className="dm-center">About Krutanic</h2>
          <p className="lead dm-center" style={{ margin: "0 auto 18px", maxWidth: "800px" }}>
            Krutanic is a fast-growing EdTech platform dedicated to empowering students & professionals with industry-relevant skills. Founded in 2024, we focus on bridging the gap between academic learning and real-world requirements. Aligned with NSDC (National Skill Development Corporation), we ensure high-quality, job-ready training.
          </p>
          <div className="dm-metric-grid">
            <article className="dm-metric"><h4>200+</h4><p>Students Placed</p></article>
            <article className="dm-metric"><h4>450+</h4><p>Hiring Partners</p></article>
            <article className="dm-metric"><h4>4.7</h4><p>Rated Program</p></article>
            <article className="dm-metric"><h4>93%</h4><p>Placement Rate</p></article>
          </div>
        </div>
      </section>

      <section className="dm-section">
        <div className="dm-shell">
          <Certification />
        </div>
      </section>

      <section className="dm-section">
        <div className="dm-shell">
          <div className="dm-invest">
            <div className="dm-invest-sub">Program Investment</div>
            <h3>Rs 95,999</h3>
            <div className="dm-invest-sub">Total fee (incl. GST)</div>

            <div className="dm-invest-grid">
              <div className="dm-invest-item">
                <strong>Rs 10,000</strong>
                <span>Registration fee to reserve your seat in this premium cohort.</span>
              </div>
              <div className="dm-invest-item">
                <strong>Installment 1: Rs 43,000</strong>
                <span>Payable within 15 days from date of registration.</span>
              </div>
              <div className="dm-invest-item">
                <strong>Installment 2: Rs 42,999</strong>
                <span>Payable within 15 days after installment 1.</span>
              </div>
            </div>
          </div>

          <div className="dm-pay-grid">
            <div className="dm-fee-box">
              <div>Total Program Fee</div>
              <div className="fee">Rs 95,999</div>
              <div>Inclusive of taxes</div>
            </div>
            <div className="dm-breakdown">
              <div className="dm-break-row"><span>Registration</span><strong>Rs 10,000</strong></div>
              <div className="dm-break-row"><span>Installment 1</span><strong>Rs 43,000</strong></div>
              <div className="dm-break-row"><span>Installment 2</span><strong>Rs 42,999</strong></div>
            </div>
          </div>

          <div className="dm-partner">
            <p className="dm-invest-sub">Our Financial Partner</p>
            <img src={Flashaidlogo} alt="Financial partner" />
          </div>
        </div>
      </section>

      <section className="dm-section" style={{ background: "#fff" }}>
        <div className="dm-shell">
          <StoreSection />
        </div>
      </section>

      <section className="dm-section" style={{ background: "#fff" }}>
        <div className="dm-shell">
          <h2 className="dm-center">Ask Us Anything</h2>
          <div className="dm-faq-grid">
            <aside className="dm-faq-menu">
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
                <article className="dm-faq-item" key={faq.question}>
                  <button
                    className="dm-faq-head"
                    type="button"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <strong>{openFAQ === index ? "-" : "+"}</strong>
                  </button>
                  {openFAQ === index && <div className="dm-faq-body">{faq.answer}</div>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="dm-fixed-price">
        <span>Program Fee: <strong>Rs 95,999 inclusive of taxes</strong></span>
        <ApplyNowButton courseValue="Digital Marketing" />
      </div>
    </div>
  );
};

export default DigitalMarket;
