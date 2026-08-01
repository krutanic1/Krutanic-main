import React, { useState, useEffect } from 'react';
import { FaLaptopCode, FaDatabase, FaPaintBrush, FaShieldAlt, FaArrowRight, FaCheckCircle, FaChartBar, FaMicrochip, FaCogs, FaStar, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/pathways_bg.png';
import csBg from '../../assets/cs_bg_light_1785591174516.png';
import mgtBg from '../../assets/mgt_bg_light_1785591184949.png';
import elecBg from '../../assets/elec_bg_light_1785591194813.png';
import mechBg from '../../assets/mech_bg_light_1785591204279.png';
import './MentorshipPremium.css';
import './Pathways.css';

const programGroups = [
  {
    id: "cs",
    label: "Computer Science",
    subtitle: "Software & Technology",
    icon: <FaLaptopCode />,
    bgImage: csBg,
    accent: "#2563eb",
    bgLight: "#eff6ff",
    accentSoft: "rgba(37, 99, 235, 0.1)",
    accentBorder: "rgba(37, 99, 235, 0.25)",
    items: [
      { id: "fsd", title: "Full Stack Web Development", description: "Become a complete engineer capable of building scalable web applications.", bullets: ["MERN stack apps", "System design", "API development"], tools: ["React", "Node.js", "MongoDB"], roles: ["Full Stack Developer", "Backend Engineer"], link: "/mentorship/full-stack-web-development", rating: "4.8/5", duration: "2-3 Months" },
      { id: "ai", title: "Artificial Intelligence", description: "Lead the AI revolution by building neural networks and intelligent systems.", bullets: ["Custom AI models", "Deep Learning", "Computer Vision"], tools: ["Python", "TensorFlow", "PyTorch"], roles: ["AI Engineer", "ML Researcher"], link: "/mentorship/artificial-intelligence", rating: "4.9/5", duration: "2-3 Months" },
      { id: "ds", title: "Data Science", description: "Extract actionable insights from complex datasets with modern tools.", bullets: ["Predictive modeling", "Data visualization", "Statistics"], tools: ["Python", "Pandas", "Tableau"], roles: ["Data Scientist", "Analyst"], link: "/mentorship/data-science", rating: "4.7/5", duration: "2-3 Months" },
      { id: "da", title: "Data Analytics", description: "Translate raw data into clear business recommendations.", bullets: ["Data visualization", "SQL queries", "Reporting"], tools: ["SQL", "Excel", "PowerBI"], roles: ["Data Analyst", "BI Analyst"], link: "/mentorship/data-analytics", rating: "4.6/5", duration: "2-3 Months" },
      { id: "cyb", title: "Cyber Security", description: "Defend digital perimeters and protect organizational data.", bullets: ["Ethical hacking", "Network security", "Pen testing"], tools: ["Kali Linux", "Wireshark", "Metasploit"], roles: ["Security Analyst"], link: "/mentorship/cyber-security", rating: "4.9/5", duration: "2-3 Months" },
      { id: "cld", title: "Cloud Computing", description: "Architect and manage scalable cloud infrastructure.", bullets: ["AWS/Azure", "Serverless", "Cloud networking"], tools: ["AWS", "Azure", "Docker"], roles: ["Cloud Architect", "Cloud Engineer"], link: "/mentorship/cloud-computing", rating: "4.8/5", duration: "2-3 Months" },
      { id: "and", title: "Android App Development", description: "Master native mobile development for Android platforms.", bullets: ["Native Apps", "Play Store Deployment", "APIs"], tools: ["Java", "Kotlin", "Firebase"], roles: ["Android Developer"], link: "/mentorship/android-app-development", rating: "4.7/5", duration: "2-3 Months" },
      { id: "uiux", title: "UI/UX Design", description: "Craft intuitive, beautiful digital experiences that users love.", bullets: ["High-fidelity prototypes", "User research", "Design systems"], tools: ["Figma", "Adobe XD", "Miro"], roles: ["Product Designer", "UI/UX Designer"], link: "/mentorship/ui-ux-design", rating: "4.8/5", duration: "2-3 Months" },
      { id: "devops", title: "DevOps", description: "Bridge development and operations with CI/CD automation.", bullets: ["CI/CD Pipelines", "IaC", "Container orchestration"], tools: ["Jenkins", "Kubernetes", "Docker"], roles: ["DevOps Engineer", "SRE"], link: "/mentorship/devops", rating: "4.7/5", duration: "2-3 Months" },
      { id: "ml", title: "Machine Learning", description: "Train intelligent systems that learn and adapt from data.", bullets: ["Supervised ML", "Algorithm optimization", "Deployment"], tools: ["Python", "Keras", "Scikit-Learn"], roles: ["ML Engineer"], link: "/mentorship/machine-learning", rating: "4.8/5", duration: "2-3 Months" }
    ]
  },
  {
    id: "mgt",
    label: "Management",
    subtitle: "Business & Strategy",
    icon: <FaChartBar />,
    bgImage: mgtBg,
    accent: "#4f46e5",
    bgLight: "#eef2ff",
    accentSoft: "rgba(79, 70, 229, 0.1)",
    accentBorder: "rgba(79, 70, 229, 0.25)",
    items: [
      { id: "dm", title: "Digital Marketing", description: "Drive business growth through modern digital marketing strategies.", bullets: ["SEO/SEM", "Content Strategy", "Performance Marketing"], tools: ["Google Analytics", "Ads", "HubSpot"], roles: ["Marketing Manager", "Growth Hacker"], link: "/mentorship/digital-marketing", rating: "4.8/5", duration: "2-3 Months" },
      { id: "ba", title: "Business Analytics", description: "Bridge the gap between data and business strategy.", bullets: ["Business Modeling", "Data Interpretation", "Strategic Planning"], tools: ["Excel", "PowerBI", "Tableau"], roles: ["Business Analyst"], link: "/mentorship/business-analytics", rating: "4.7/5", duration: "2-3 Months" },
      { id: "fin", title: "Finance", description: "Master financial modeling and corporate finance principles.", bullets: ["Financial Modeling", "Valuation", "Risk Management"], tools: ["Excel", "Financial software"], roles: ["Financial Analyst"], link: "/mentorship/finance", rating: "4.6/5", duration: "2-3 Months" },
      { id: "hr", title: "Human Resource", description: "Build and manage high-performing teams effectively.", bullets: ["Talent Acquisition", "Employee Relations", "HR Analytics"], tools: ["HRIS", "LinkedIn Recruiter"], roles: ["HR Manager"], link: "/mentorship/human-resource", rating: "4.7/5", duration: "2-3 Months" },
      { id: "sm", title: "Stock Marketing", description: "Understand market trends and trading strategies in depth.", bullets: ["Technical Analysis", "Portfolio Management", "Derivatives"], tools: ["Trading Terminals", "Chart Software"], roles: ["Trader", "Investment Analyst"], link: "/mentorship/stock-marketing", rating: "4.8/5", duration: "2-3 Months" }
    ]//sdgsudho;sdhp
  },
  {
    id: "elec",
    label: "Electronics",
    subtitle: "Hardware & Systems",
    icon: <FaMicrochip />,
    bgImage: elecBg,
    accent: "#0891b2",
    bgLight: "#ecfeff",
    accentSoft: "rgba(8, 145, 178, 0.1)",
    accentBorder: "rgba(8, 145, 178, 0.25)",
    items: [
      { id: "emb", title: "Embedded Systems", description: "Design and program embedded microcontrollers for real-world applications.", bullets: ["Microcontroller Programming", "RTOS", "Hardware Interfacing"], tools: ["C/C++", "Keil", "Arduino"], roles: ["Embedded Engineer"], link: "/mentorship/embedded-systems", rating: "4.7/5", duration: "2-3 Months" },
      { id: "vlsi", title: "VLSI Design", description: "Master Very Large Scale Integration design and chip architecture.", bullets: ["Digital Logic Design", "Verilog/VHDL", "Physical Design"], tools: ["Cadence", "Synopsys"], roles: ["VLSI Engineer"], link: "/mentorship/vlsi-design", rating: "4.8/5", duration: "2-3 Months" },
      { id: "iot", title: "IOT & Robotics", description: "Build connected devices and robotic systems for the future.", bullets: ["Sensor Integration", "IoT Protocols", "Robotics Kinematics"], tools: ["Raspberry Pi", "ROS", "Python"], roles: ["IoT Engineer", "Robotics Engineer"], link: "/mentorship/iot-robotics", rating: "4.9/5", duration: "2-3 Months" }
    ]
  },
  {
    id: "mech",
    label: "Mechanical",
    subtitle: "Design & Manufacturing",
    icon: <FaCogs />,
    bgImage: mechBg,
    accent: "#0d9488",
    bgLight: "#f0fdfa",
    accentSoft: "rgba(13, 148, 136, 0.1)",
    accentBorder: "rgba(13, 148, 136, 0.25)",
    items: [
      { id: "cad", title: "Auto CAD", description: "Master computer-aided design for mechanical engineering applications.", bullets: ["2D Drafting", "3D Modeling", "Assembly Design"], tools: ["AutoCAD", "SolidWorks"], roles: ["Design Engineer", "CAD Drafter"], link: "/mentorship/auto-cad", rating: "4.7/5", duration: "2-3 Months" },
      { id: "gd", title: "Graphics Design", description: "Master visual storytelling and brand communication at scale.", bullets: ["Brand identity design", "Digital marketing assets", "Typography"], tools: ["Photoshop", "Illustrator", "InDesign"], roles: ["Visual Designer", "Brand Designer"], link: "/mentorship/graphics-design", rating: "4.7/5", duration: "2-3 Months" }
    ]
  }
];

// Helper: convert hex colour to "r, g, b" string for rgba() usage
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// ─── DESKTOP LAYOUT (unchanged) ───────────────────────────────────────────────
const DesktopSpecializations = ({ activeGroup, activeCourse, handleGroupChange, setActiveCourse, navigate }) => (
  <section
    className="pm-pathways-section pm-desktop-only"
    id="specializations"
    style={{
      backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.95)), url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  >
    <div className="pm-pathways-container">

      {/* Left Column: Intro */}
      <div className="pm-pathways-intro" data-aos="fade-up">
        <h2 className="pm-pathways-title">Curated Professional Pathways</h2>
        <p className="pm-pathways-subtitle">
          Move beyond standard courses. Choose a focused mentorship track designed to accelerate your transition into high-demand technology roles.
        </p>
      </div>

      {/* Right Column: Interactive Area */}
      <div className="pm-pathways-interactive" data-aos="fade-up" data-aos-delay="50">

        {/* Top Program Tabs */}
        <div className="pm-program-tabs">
          {programGroups.map((group) => (
            <button
              key={group.id}
              className={`pm-program-tab ${activeGroup.id === group.id ? "active" : ""}`}
              onClick={() => handleGroupChange(group)}
              style={
                activeGroup.id === group.id
                  ? { background: activeCourse.theme?.soft || activeGroup.accentSoft, color: activeCourse.theme?.accent || activeGroup.accent, borderColor: activeCourse.theme?.accent || activeGroup.accent }
                  : {}
              }
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Bottom Layout: Sidebar + Details Panel */}
        <div className="pm-pathways-layout">

          {/* Left Sidebar: Subcategory Course List */}
          <aside className="pm-course-sidebar">
            <div className="pm-sidebar-inner-timeline">
              {activeGroup.items.map((course) => (
                <button
                  key={course.id}
                  className={`pm-timeline-link ${activeCourse.id === course.id ? "active" : ""}`}
                  onClick={() => setActiveCourse(course)}
                >
                  <div className="pm-timeline-node-wrapper">
                    <div
                      className="pm-timeline-node"
                      style={{
                        borderColor: activeCourse.id === course.id ? activeGroup.accent : 'transparent',
                        backgroundColor: activeCourse.id === course.id ? '#ffffff' : '#cbd5e1'
                      }}
                    />
                    {activeCourse.id === course.id && (
                      <div className="pm-timeline-glow" style={{ background: activeGroup.accent }} />
                    )}
                  </div>
                  <span
                    className="pm-timeline-text"
                    style={{ color: activeCourse.id === course.id ? '#0f172a' : '#64748b' }}
                  >
                    {course.title}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Right Panel: Selected Course Details */}
          <div
            className="pm-course-panel"
            style={{
              backgroundColor: activeGroup.bgLight || '#f8fafc',
              backgroundImage: `linear-gradient(135deg, ${activeGroup.bgLight}D9 0%, ${activeGroup.bgLight}F2 100%), url(${activeGroup.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'normal'
            }}
          >
            <div className="pm-course-panel-inner">
              <div className="pm-course-top">
                <div>
                  <p className="pm-course-eyebrow">FOR {activeGroup.label.toUpperCase()} PROFESSIONALS</p>
                  <h3>{activeCourse.title}</h3>
                </div>

                <div className="pm-course-meta">
                  <div className="pm-meta-stat">
                    <span className="pm-stat-val">{activeCourse.rating.split('/')[0]}<small className="pm-stat-small">/5</small></span>
                    <span className="pm-stat-lbl">Rating</span>
                  </div>
                  <div className="pm-stat-divider"></div>
                  <div className="pm-meta-stat">
                    <span className="pm-stat-val">{activeCourse.duration.split(' ')[0]}</span>
                    <span className="pm-stat-lbl">{activeCourse.duration.split(' ')[1] || 'Months'}</span>
                  </div>
                </div>
              </div>

              <p className="pm-course-desc">{activeCourse.description}</p>

              <div className="pm-course-content-grid">
                <div className="pm-course-bullets-section">
                  <p className="pm-section-label">WHAT YOU'LL MASTER</p>
                  <ul className="pm-course-bullets">
                    {activeCourse.bullets?.map((item, i) => (
                      <li key={i}><FaCheckCircle style={{ color: activeGroup.accent }} /> {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="pm-tools-container">
                  <p className="pm-section-label">CORE TOOLS & TECHNOLOGIES</p>
                  <div className="pm-tools-box">
                    {activeCourse.tools?.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <p className="pm-section-label">TARGET ROLES</p>
                    <div className="pm-roles-box">
                      {activeCourse.roles?.map((role) => (
                        <span key={role}>{role}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pm-course-panel-footer">
                <button
                  className="pm-panel-btn-primary"
                  onClick={() => navigate(activeCourse.link)}
                  style={{ backgroundColor: activeGroup.accent, color: '#ffffff' }}
                >
                  View Detailed Syllabus <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);

// ─── MOBILE LAYOUT (brand new) ────────────────────────────────────────────────
const MobileSpecializations = ({ navigate }) => {
  const [activeGroup, setActiveGroup] = useState(programGroups[0]);
  const [activeCourse, setActiveCourse] = useState(programGroups[0].items[0]);

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setActiveCourse(group.items[0]);
  };

  const accent = activeGroup.accent;
  const accentSoft = activeGroup.accentSoft;
  const accentBorder = activeGroup.accentBorder;

  return (
    <section className="msp-section pm-mobile-only" id="specializations-mobile">

      {/* ① Intro Block */}
      <div className="msp-intro">
        <span className="msp-eyebrow">Curated Pathways</span>
        <h2 className="msp-heading">Curated Professional Pathways</h2>
        <p className="msp-subtext">
          Choose a focused mentorship track and accelerate your career into high-demand roles.
        </p>
      </div>

      {/* ② Fixed 2×2 Category Grid — never scrolls, always fully visible */}
      <div className="msp-cat-grid-wrap">
        <div className="msp-cat-grid">
          {programGroups.map((group) => {
            const isActive = activeGroup.id === group.id;
            return (
              <button
                key={group.id}
                className={`msp-cat-cell ${isActive ? 'msp-cat-cell-active' : ''}`}
                onClick={() => handleGroupChange(group)}
                style={{
                  '--cat-accent': accent,
                  '--cat-accent-soft': accentSoft,
                  '--cat-accent-border': accentBorder,
                  '--cat-accent-rgb': hexToRgb(accent),
                }}
              >
                {/* Top row: icon + active check badge */}
                <div className="msp-cat-top-row">
                  <span className="msp-cat-icon">{group.icon}</span>
                  <span className="msp-cat-check">✓</span>
                </div>

                {/* Domain label — hero text */}
                <span className="msp-cat-label">{group.label}</span>

                {/* Subtitle */}
                <span className="msp-cat-sub">{group.subtitle}</span>

                {/* Left accent strip — appears on active via CSS */}
                <span className="msp-cat-strip" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>


      {/* ③ Pathway Chip Rail — horizontal scroll allowed here */}
      <div className="msp-pathway-label-row">
        <span className="msp-pathway-label" style={{ color: accent }}>
          {activeGroup.label} Pathways
        </span>
        <span className="msp-pathway-count">{activeGroup.items.length} tracks</span>
      </div>
      <div className="msp-chip-rail msp-pathway-rail">
        {activeGroup.items.map((course) => (
          <button
            key={course.id}
            className={`msp-chip msp-chip-sm ${activeCourse.id === course.id ? 'msp-chip-active' : ''}`}
            onClick={() => setActiveCourse(course)}
            style={activeCourse.id === course.id ? {
              background: accentSoft,
              color: accent,
              borderColor: accentBorder,
              fontWeight: 700
            } : {}}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* ④ Featured Pathway Card */}
      <div className="msp-card-wrap">
        <div
          className="msp-card"
          style={{
            backgroundColor: activeGroup.bgLight || '#f1f5f9',
            backgroundImage: `linear-gradient(160deg, ${activeGroup.bgLight}D9 0%, ${activeGroup.bgLight}F2 100%), url(${activeGroup.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'normal'
          }}
        >
          {/* Card Header */}
          <div className="msp-card-header">
            <span className="msp-card-eyebrow">For {activeGroup.label} Professionals</span>
            <h3 className="msp-card-title">{activeCourse.title}</h3>

            {/* Badges Row */}
            <div className="msp-badge-row">
              <span className="msp-badge" style={{ background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.3)', color: '#d97706' }}>
                <FaStar style={{ fontSize: '0.7rem' }} />
                {activeCourse.rating}
              </span>
              <span className="msp-badge" style={{ background: 'rgba(0,0,0,0.04)', borderColor: 'rgba(0,0,0,0.08)', color: '#475569' }}>
                <FaClock style={{ fontSize: '0.7rem' }} />
                {activeCourse.duration}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="msp-card-desc">{activeCourse.description}</p>

          {/* What You'll Master */}
          <div className="msp-card-block">
            <p className="msp-block-label">What You'll Master</p>
            <ul className="msp-bullet-list">
              {activeCourse.bullets?.map((item, i) => (
                <li key={i}>
                  <FaCheckCircle className="msp-check-icon" style={{ color: activeGroup.accent }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Technologies */}
          <div className="msp-card-block">
            <p className="msp-block-label">Core Tools & Technologies</p>
            <div className="msp-pill-row">
              {activeCourse.tools?.map((tool) => (
                <span key={tool} className="msp-pill" style={{ background: 'rgba(255,255,255,0.13)', borderColor: 'rgba(255,255,255,0.18)' }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Target Roles */}
          <div className="msp-card-block">
            <p className="msp-block-label">Target Roles</p>
            <div className="msp-pill-row">
              {activeCourse.roles?.map((role) => (
                <span key={role} className="msp-pill msp-pill-accent" style={{ background: accentSoft, borderColor: accentBorder, color: accent }}>
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="msp-card-footer">
            <button
              className="msp-cta-btn"
              onClick={() => navigate(activeCourse.link)}
              style={{ backgroundColor: activeGroup.accent, color: '#ffffff' }}
            >
              View Detailed Syllabus
              <FaArrowRight className="msp-cta-arrow" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const SpecializationsSection = () => {
  const [activeGroup, setActiveGroup] = useState(programGroups[0]);
  const [activeCourse, setActiveCourse] = useState(programGroups[0].items[0]);
  const navigate = useNavigate();

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setActiveCourse(group.items[0]);
  };

  return (
    <>
      {/* Desktop: Unchanged */}
      <DesktopSpecializations
        activeGroup={activeGroup}
        activeCourse={activeCourse}
        handleGroupChange={handleGroupChange}
        setActiveCourse={setActiveCourse}
        navigate={navigate}
      />

      {/* Mobile: Brand-new standalone component */}
      <MobileSpecializations navigate={navigate} />
    </>
  );
};

export default SpecializationsSection;
