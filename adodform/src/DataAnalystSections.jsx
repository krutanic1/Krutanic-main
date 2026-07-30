import React, { useState } from 'react';
import './DataAnalystSections.css';
import ImgResume from './assets/card_resume.png';
import ImgLinkedIn from './assets/card_linkedin.png';
import ImgInterview from './assets/card_interview.png';
import ImgPortfolio from './assets/card_portfolio.png';
import ImgMentorship from './assets/card_mentorship.png';
import ImgProjects from './assets/card_projects.png';
import ImgTools from './assets/card_tools.png';
import ImgGrowth from './assets/card_growth.png';
import ImgSalesDash from './assets/card_sales_dashboard.png';
import ImgCustomer from './assets/card_customer_analysis.png';
import ImgMarketing from './assets/card_marketing_dashboard.png';
import ImgCapstone from './assets/card_capstone.png';
import ImgBengaluru from './assets/card_bengaluru.png';

/* ─── SVG Icon Library ───────────────────────────────────────── */
const Icon = {
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Award: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
  Code: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ─── Outcomes / Proof Stats ─────────────────────────────────────── */
export const StatsBar = () => (
  <section className="das-section das-outcomes-section">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Placement Outcomes</span>
        <h2 className="das-section-title">Real Career Outcomes, Not Just Course Completion</h2>
        <p className="das-section-sub">Proof that this program drives careers. Built from real learner outcomes, hiring partnerships, and placement support data.</p>
      </div>

      <div className="das-outcomes-bento">
        {/* Featured Hero Stat */}
        <div className="das-outcome-card das-outcome-hero">
          <div className="das-outcome-value">15</div>
          <div className="das-outcome-label">Guaranteed Interviews</div>
          <div className="das-outcome-desc">Guaranteed interview opportunities with top hiring partners.</div>
        </div>

        {/* Medium Featured Stat */}
        <div className="das-outcome-card das-outcome-hero-alt">
          <div className="das-outcome-value">₹16L</div>
          <div className="das-outcome-label">Highest Package</div>
          <div className="das-outcome-desc">Achieved by recent cohort graduates in top tech companies.</div>
        </div>

        {/* Supporting Small Stats */}
        <div className="das-outcome-card das-outcome-small">
          <div className="das-outcome-value">450+</div>
          <div className="das-outcome-label">Hiring Partners</div>
        </div>
        <div className="das-outcome-card das-outcome-small">
          <div className="das-outcome-value">87%</div>
          <div className="das-outcome-label">Placed in 60 Days</div>
        </div>
        <div className="das-outcome-card das-outcome-small">
          <div className="das-outcome-value">200+</div>
          <div className="das-outcome-label">Students Placed</div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Why Krutanic ─────────────────────────────────────────────── */
export const WhyKrutanic = () => (
  <section className="das-section das-why">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">About Krutanic</span>
        <h2 className="das-section-title">Built for Job-Readiness, Not Just Learning</h2>
        <p className="das-section-sub">Krutanic is a career acceleration platform built to help students and professionals transition from learning to employment through industry-aligned training, practical project experience, expert mentorship, and dedicated placement support.</p>
      </div>
      <div className="das-cards-grid-4">
        {[
          { icon: <Icon.MapPin />, title: 'Bengaluru-Based', desc: 'Operating from India\'s technology hub, with direct access to top companies and hiring networks.', img: ImgBengaluru, tag: 'Location' },
          { icon: <Icon.Shield />, title: 'Career-Focused Learning', desc: 'Every module is designed to build job-ready skills through practical learning, real-world projects, and industry-relevant experience.', img: ImgResume, tag: 'Certification' },
          { icon: <Icon.Users />, title: 'Cohort of 30', desc: 'Small batches designed for focused mentorship, individual attention, and real feedback.', img: ImgMentorship, tag: 'Community' },
          { icon: <Icon.TrendingUp />, title: 'Outcome-First Model', desc: 'Every module is mapped to a job requirement, not an academic syllabus.', img: ImgGrowth, tag: 'Approach' },
        ].map((c) => (
          <div className="das-compact-card" key={c.title}>
            <div className="das-compact-img" style={{backgroundImage: `url(${c.img})`}}>
              <span className="das-compact-tag">{c.tag}</span>
            </div>
            <div className="das-compact-body">
              <div className="das-compact-icon">{c.icon}</div>
              <h4 className="das-compact-title">{c.title}</h4>
              <p className="das-compact-desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Who This Is For ──────────────────────────────────────────── */
export const WhoThisIsFor = () => (
  <section className="das-section das-who" style={{backgroundColor: 'var(--das-surface-soft)'}}>
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Who Should Apply</span>
        <h2 className="das-section-title">This Program is Designed For You If…</h2>
      </div>
      <div className="das-cards-grid-3">
        {[
          { icon: <Icon.BookOpen />, title: 'Final-Year Students', desc: 'Build a job-ready portfolio before graduation and enter the market with a verified data skillset.', img: ImgProjects, tag: 'Students' },
          { icon: <Icon.Award />, title: 'Recent Graduates', desc: 'Move from degree to data role with structured training, real projects, and dedicated placement support.', img: ImgResume, tag: 'Graduates' },
          { icon: <Icon.Briefcase />, title: 'Working Professionals', desc: 'Transition into data roles or advance in your current domain with updated industry tools and skills.', img: ImgGrowth, tag: 'Professionals' },
          { icon: <Icon.TrendingUp />, title: 'Career Switchers', desc: 'Switch from any non-tech background into analytics with a guided, mentorship-led learning path.', img: ImgMentorship, tag: 'Switchers' },
          { icon: <Icon.Target />, title: 'Job Seekers', desc: 'Accelerate your job hunt with guaranteed interviews, resume building, and dedicated placement support.', img: ImgInterview, tag: 'Job Seekers' },
          { icon: <Icon.Users />, title: 'Aspiring Analysts', desc: 'Anyone passionate about data who wants to build a high-growth, future-proof career from the ground up.', img: ImgCustomer, tag: 'Enthusiasts' },
        ].map((c) => (
          <div className="das-compact-card" key={c.title}>
            <div className="das-compact-img" style={{backgroundImage: `url(${c.img})`}}>
              <span className="das-compact-tag">{c.tag}</span>
            </div>
            <div className="das-compact-body">
              <div className="das-compact-icon">{c.icon}</div>
              <h4 className="das-compact-title">{c.title}</h4>
              <p className="das-compact-desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Career Roles ─────────────────────────────────────────────── */
export const CareerRoles = () => (
  <section className="das-section">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Career Outcomes</span>
        <h2 className="das-section-title">Roles You Can Target After This Program</h2>
        <p className="das-section-sub">Our alumni work across analytics, business intelligence, product, and operations functions at top companies.</p>
      </div>
      <div className="das-roles-grid">
        {[
          'Data Analyst', 'BI Analyst', 'Business Analyst', 'Junior Data Analyst',
          'Product Analyst', 'Operations Analyst', 'SQL / Reporting Analyst', 'Analytics Consultant',
        ].map((role) => (
          <div className="das-role-pill" key={role}>
            <span className="das-role-dot"></span>
            {role}
          </div>
        ))}
      </div>
      <div className="das-outcomes-strip">
        <div className="das-outcome-item"><span className="das-outcome-val">₹16L</span><span className="das-outcome-lbl">Highest Package</span></div>
        <div className="das-outcome-divider"></div>
        <div className="das-outcome-item"><span className="das-outcome-val">₹8.2L</span><span className="das-outcome-lbl">Average Package</span></div>
        <div className="das-outcome-divider"></div>
        <div className="das-outcome-item"><span className="das-outcome-val">93%</span><span className="das-outcome-lbl">Placement Rate</span></div>
        <div className="das-outcome-divider"></div>
        <div className="das-outcome-item"><span className="das-outcome-val">87%</span><span className="das-outcome-lbl">Placed in 60 Days</span></div>
      </div>
    </div>
  </section>
);

/* ─── Curriculum Roadmap ───────────────────────────────────────── */
export const CurriculumRoadmap = () => (
  <section className="das-section" style={{backgroundColor: 'var(--das-surface-soft)'}}>
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Program Curriculum</span>
        <h2 className="das-section-title">A Structured Path from Foundations to Placement</h2>
        <p className="das-section-sub">Six progressive phases designed to take you from data fundamentals to job-ready analyst in a practical, mentor-led environment.</p>
      </div>
      <div className="das-roadmap">
        {[
          { phase: 'Phase 1', title: 'Excel & SQL Foundations', desc: 'Data cleaning, pivot tables, advanced Excel functions, SQL queries, joins, subqueries, and aggregations.' },
          { phase: 'Phase 2', title: 'Python & Statistics', desc: 'Python basics, pandas, NumPy, data manipulation, exploratory data analysis, and statistical thinking.' },
          { phase: 'Phase 3', title: 'BI & Dashboarding', desc: 'Power BI and Tableau dashboard design, data modeling, storytelling with charts, and executive reporting.' },
          { phase: 'Phase 4', title: 'Marketing & Business Analytics', desc: 'Campaign analysis, funnel metrics, cohort analysis, e-commerce data, and business intelligence reporting.' },
          { phase: 'Phase 5', title: 'Advanced Analytics & Capstone', desc: 'Machine learning basics, Plotly visualizations, advanced case studies, and an end-to-end capstone project.' },
          { phase: 'Phase 6', title: 'Placement Preparation', desc: 'Resume building, LinkedIn optimization, mock interviews, portfolio review, and hiring process coaching.' },
        ].map((item, i) => (
          <div className="das-roadmap-item" key={item.phase}>
            <div className="das-roadmap-marker">
              <span className="das-roadmap-num">{i + 1}</span>
              {i < 5 && <span className="das-roadmap-line"></span>}
            </div>
            <div className="das-roadmap-content">
              <span className="das-roadmap-phase">{item.phase}</span>
              <h4 className="das-roadmap-title">{item.title}</h4>
              <p className="das-roadmap-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Real Projects ────────────────────────────────────────────── */
export const RealProjects = () => (
  <section className="das-section">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Hands-On Projects</span>
        <h2 className="das-section-title">Work on Real Business Problems, Not Toy Datasets</h2>
        <p className="das-section-sub">Portfolio-ready projects across industries that demonstrate analytical thinking to hiring managers.</p>
      </div>
      <div className="das-cards-grid-2">
        {[
          { title: 'Sales & Customer Performance Dashboard', desc: 'Build an end-to-end sales reporting dashboard using SQL and Power BI, tracking revenue, conversion, and churn metrics.', img: ImgSalesDash, tags: ['SQL', 'Power BI', 'Excel'] },
          { title: 'Customer Behavior & Insights Analysis', desc: 'Analyze customer data using Python and pandas to identify purchase patterns, segmentation, and retention drivers.', img: ImgCustomer, tags: ['Python', 'pandas', 'Plotly'] },
          { title: 'Marketing Campaign Performance Dashboard', desc: 'Measure campaign ROI, funnel performance, and audience behavior using Tableau and Google Analytics data.', img: ImgMarketing, tags: ['Tableau', 'Analytics', 'KPI'] },
          { title: 'End-to-End Business Analytics Capstone', desc: 'A full simulation of a business analytics engagement — from data extraction to board-level insight presentation.', img: ImgCapstone, tags: ['Python', 'SQL', 'Power BI'] },
        ].map((p) => (
          <div className="das-project-complete-card" key={p.title}>
            <div className="das-project-complete-img" style={{backgroundImage: `url(${p.img})`}}>
              <div className="das-project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
            </div>
            <div className="das-project-complete-body">
              <h4 className="das-project-title">{p.title}</h4>
              <p className="das-project-desc">{p.desc}</p>
              <div className="das-project-label"><Icon.BarChart /> Portfolio-Ready Project</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Tools Covered ────────────────────────────────────────────── */
export const ToolsCovered = () => {
  const toolCategories = [
    {
      cat: 'Analytics & Programming',
      color: '#3776AB',
      tools: [
        { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
        { name: 'pandas', icon: 'https://cdn.simpleicons.org/pandas/150458' },
        { name: 'NumPy', icon: 'https://cdn.simpleicons.org/numpy/013243' },
        { name: 'Plotly', icon: 'https://cdn.simpleicons.org/plotly/3F4F75' },
        { name: 'Scikit-learn', icon: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
      ],
    },
    {
      cat: 'Databases & SQL',
      color: '#4479A1',
      tools: [
        { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
        { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
        { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
        { name: 'BigQuery', icon: 'https://cdn.simpleicons.org/googlebigquery/4285F4' },
        { name: 'AWS Redshift', icon: 'https://cdn.simpleicons.org/amazonredshift/8C4FFF' },
      ],
    },
    {
      cat: 'BI & Visualization',
      color: '#F2C811',
      tools: [
        { name: 'Power BI', icon: 'https://img.icons8.com/color/48/power-bi.png' },
        { name: 'Tableau', icon: 'https://img.icons8.com/color/48/tableau-software.png' },
        { name: 'Excel', icon: 'https://img.icons8.com/color/48/microsoft-excel-2019--v1.png' },
        { name: 'Looker', icon: 'https://img.icons8.com/color/48/google-looker.png' },
        { name: 'Grafana', icon: 'https://img.icons8.com/color/48/grafana.png' },
      ],
    },
    {
      cat: 'Cloud & Big Data',
      color: '#FF9900',
      tools: [
        { name: 'AWS', icon: 'https://img.icons8.com/color/48/amazon-web-services.png' },
        { name: 'Azure', icon: 'https://img.icons8.com/color/48/azure-1.png' },
        { name: 'GCP', icon: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
        { name: 'Apache Spark', icon: 'https://cdn.simpleicons.org/apachespark/E25A1C' },
        { name: 'Airflow', icon: 'https://cdn.simpleicons.org/apacheairflow/017CEE' },
      ],
    },
    {
      cat: 'Dev & Career Tools',
      color: '#181717',
      tools: [
        { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/181717' },
        { name: 'Jupyter', icon: 'https://cdn.simpleicons.org/jupyter/F37626' },
        { name: 'Notion', icon: 'https://cdn.simpleicons.org/notion/000000' },
        { name: 'LinkedIn', icon: 'https://img.icons8.com/color/48/linkedin.png' },
        { name: 'VS Code', icon: 'https://img.icons8.com/color/48/visual-studio-code-2019.png' },
      ],
    },
  ];
  return (
    <section className="das-section das-tools-bento-section">
      <div className="das-container">
        <div className="das-section-header">
          <span className="das-label">Tools & Platforms</span>
          <h2 className="das-section-title">40+ Enterprise Tools Across the Full Data Stack</h2>
          <p className="das-section-sub">From SQL to cloud data warehousing — coverage that matches what top companies actually use in production.</p>
        </div>
        
        <div className="das-bento-grid">
          {toolCategories.map(({ cat, tools }, index) => (
            <div className={`das-bento-card ${index === 4 ? 'das-bento-wide' : ''}`} key={cat}>
              <div className="das-bento-header">
                <span className="das-bento-cat-title">{cat}</span>
              </div>
              <div className="das-bento-body">
                {tools.map((tool) => (
                  <div className="das-bento-pill" key={tool.name}>
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      className="das-bento-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="das-bento-name">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="das-bento-footer">
          <p>Learn the same stack used across analytics, BI, cloud, and reporting teams.</p>
        </div>
      </div>
    </section>
  );
};

/* ─── Career Support ───────────────────────────────────────────── */
export const CareerSupport = () => (
  <section className="das-section">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Placement Support</span>
        <h2 className="das-section-title">Career Preparation, Not Just a Certificate</h2>
        <p className="das-section-sub">Our placement team works with you end-to-end — from building your profile to navigating interview rounds.</p>
      </div>
      <div className="das-cards-grid-3">
        {[
          { icon: <Icon.FileText />, title: 'Resume Building', desc: 'ATS-optimized resume crafted with your projects, skills, and target role positioning.', img: ImgResume, badge: 'Career' },
          { icon: <Icon.LinkedIn />, title: 'LinkedIn Optimization', desc: 'Profile revamp with keyword strategy, featured projects, and hiring manager appeal.', img: ImgLinkedIn, badge: 'Branding' },
          { icon: <Icon.Users />, title: 'Mock Interviews', desc: 'Role-specific interview simulations covering technical, case study, and behavioral rounds.', img: ImgInterview, badge: 'Practice' },
          { icon: <Icon.BarChart />, title: 'Portfolio Review', desc: 'Expert review of your capstone, dashboards, and project work before job applications.', img: ImgPortfolio, badge: 'Projects' },
          { icon: <Icon.BookOpen />, title: 'Case Study Practice', desc: 'Practice sessions on business analysis cases commonly used in analytics hiring rounds.', img: ImgProjects, badge: 'Analytics' },
          { icon: <Icon.Target />, title: 'Interview Preparation', desc: 'Structured coaching on job description decoding, stakeholder questions, and data storytelling.', img: ImgMentorship, badge: 'Coaching' },
          { icon: <Icon.Users />, title: 'Group Discussions', desc: 'Simulated group discussions to enhance your communication, leadership, and structured thinking skills.', img: ImgCustomer, badge: 'Soft Skills' },
          { icon: <Icon.TrendingUp />, title: 'Salary Negotiation Guidance', desc: 'Tactical advice on handling offers, benchmark salaries, and navigating compensation discussions.', img: ImgGrowth, badge: 'Offers' },
          { icon: <Icon.Briefcase />, title: 'Interview Scheduling Support', desc: 'End-to-end coordination with our hiring partners to get you directly into the interview pipeline.', img: ImgSalesDash, badge: 'Logistics' },
        ].map((c) => (
          <div className="das-compact-card" key={c.title}>
            <div className="das-compact-img" style={{backgroundImage: `url(${c.img})`}}>
              <span className="das-compact-tag">{c.badge}</span>
            </div>
            <div className="das-compact-body">
              <div className="das-compact-icon">{c.icon}</div>
              <h4 className="das-compact-title">{c.title}</h4>
              <p className="das-compact-desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


/* ─── Hiring Partners ──────────────────────────────────────────── */
export const HiringPartners = () => (
  <section className="das-section">
    <div className="das-container">
      <div className="das-section-header">
        <span className="das-label">Hiring Network</span>
        <h2 className="das-section-title">450+ Companies Actively Hiring Our Graduates</h2>
        <p className="das-section-sub">From startups to enterprise — our alumni network spans companies across tech, finance, e-commerce, healthcare, and consulting.</p>
      </div>
      <div className="das-partners-grid">
        {['Infosys', 'TCS', 'Wipro', 'Accenture', 'Capgemini', 'Cognizant', 'HCL', 'Tech Mahindra',
          'Deloitte', 'EY', 'KPMG', 'PwC', 'Amazon', 'Flipkart', 'Paytm', 'Swiggy'].map((c) => (
          <div className="das-partner-badge" key={c}>{c}</div>
        ))}
      </div>
      <p className="das-partners-note">and 430+ more companies across industries</p>
    </div>
  </section>
);

/* ─── FAQ ──────────────────────────────────────────────────────── */
const faqs = [
  { q: 'Who can apply for this program?', a: 'Final-year students, graduates, working professionals with 1–10 years of experience, and career switchers from non-tech backgrounds are all eligible. No prior data or coding experience is required.' },
  { q: 'Is this suitable for working professionals?', a: 'Yes. The program offers weekday, weekend, and flexible batch options specifically designed around professional schedules. Many of our alumni joined while employed.' },
  { q: 'Is placement support included in the program?', a: 'Yes. Dedicated placement assistance covers resume building, LinkedIn optimization, mock interviews, portfolio review, and active connections with 450+ hiring partners.' },
  { q: 'What tools and technologies will I learn?', a: 'You will work with 40+ tools including Python, SQL, Excel, Power BI, Tableau, pandas, NumPy, Plotly, MySQL, PostgreSQL, BigQuery, Spark, Airflow, Azure, GCP, and machine learning basics.' },
  { q: 'Do I need a coding background to join?', a: 'No. The program starts from Excel and SQL foundations and progressively builds into Python and analytics. It is designed for learners without prior programming experience.' },
  { q: 'Are the classes live and interactive?', a: 'Yes. All sessions are live, interactive, and expert-led. Recordings are provided for revision, and the small cohort size of 30 ensures individual attention.' },
  { q: 'Will I work on real projects?', a: 'Yes. You will complete multiple real-world projects including a sales dashboard, customer behavior analysis, marketing performance dashboard, and an end-to-end business analytics capstone.' },
  { q: 'What certificate will I receive?', a: 'You will receive a certificate of completion with a unique, verifiable certificate ID, plus skill-based certificates for individual modules. Credentials are shareable on LinkedIn.' },
];

export const FAQBlock = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="das-section" style={{backgroundColor: 'var(--das-surface-soft)'}}>
      <div className="das-container das-faq-layout">
        <div className="das-faq-left">
          <span className="das-label">Common Questions</span>
          <h2 className="das-section-title">Clarity Before You Apply</h2>
          <p className="das-section-sub">Everything you need to know about the program, eligibility, and support.</p>
        </div>
        <div className="das-faq-list">
          {faqs.map((faq, i) => (
            <div className={`das-faq-item ${open === i ? 'open' : ''}`} key={i} onClick={() => setOpen(open === i ? null : i)}>
              <div className="das-faq-q">
                <span>{faq.q}</span>
                <span className={`das-faq-chevron ${open === i ? 'rotated' : ''}`}><Icon.ChevronDown /></span>
              </div>
              {open === i && <div className="das-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Final CTA ────────────────────────────────────────────────── */
export const FinalCTA = () => {
  const scrollToForm = () => document.querySelector('.da-form-card')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="das-final-cta">
      <div className="das-container das-cta-inner">
        <div>
          <h2 className="das-cta-title">Ready to Start Your Data Analytics Career?</h2>
          <p className="das-cta-sub">Limited cohort of 30. Upcoming batch filling fast. Speak to a career advisor before seats are filled.</p>
        </div>
        <div className="das-cta-actions">
          <button className="das-cta-btn" onClick={scrollToForm}>Book Free Career Consultation</button>
          <div className="das-cta-trust">
            <span><Icon.Clock /> Response within 24 hours</span>
            <span><Icon.Shield /> No spam guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
