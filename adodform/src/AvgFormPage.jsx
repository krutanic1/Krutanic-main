import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './AvgFormPage.css';
import AdobePartnerBadge from './assets/adobe_partner_badge.png';

// Fallback images (reusing existing assets)
import SubhraImg from './assets/mentors/Subhra.jpg';
import RudraImg from './assets/mentors/rudra.jpg';
import CardRoadmap from './assets/card_roadmap.png';
import CardPortfolio from './assets/card_portfolio.png';
import CardSuccess from './assets/card_success.png';
import ProjectAIDashboard from './assets/project_ai_dashboard.png';
import ProjectSaaS from './assets/project_saas_payment.png';
import ProjectAnalytics from './assets/project_analytics_dashboard.png';
import ProjectCyber from './assets/project_cyber_security.png';
import ProjectAndroid from './assets/project_android_app.png';
import ProjectUIUX from './assets/project_uiux_design.png';
import ProjectCloud from './assets/project_cloud_infra.png';
import ProjectDevOps from './assets/project_devops_pipeline.png';
import ProjectML from './assets/project_ml_model.png';

/* --- SVG Icons --- */
const CheckIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ArrowRightIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CodeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const BriefcaseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

/* --- The 10 Tech Domains --- */
const DOMAINS_LIST = [
  { id: 1, name: 'Data Science', code: 'DS' },
  { id: 2, name: 'Data Analytics', code: 'DA' },
  { id: 3, name: 'Artificial intelligence', code: 'AI' },
  { id: 4, name: 'Machine Learning', code: 'ML' },
  { id: 5, name: 'Full stack web development', code: 'FSD' },
  { id: 6, name: 'Cyber Security', code: 'CS' },
  { id: 7, name: 'Android App Dev', code: 'AD' },
  { id: 8, name: 'UI / UX Design', code: 'UX' },
  { id: 9, name: 'Cloud Computing', code: 'CC' },
  { id: 10, name: 'DevOps', code: 'DO' }
];

/* --- Projects Data --- */
const PROJECTS = [
  {
    title: 'AI Resume Screening Dashboard',
    tools: 'Python · NLP · React',
    desc: 'Build a full-stack dashboard that parses resumes and scores them against JDs.',
    portfolio: 'Live deployment, GitHub repo, System architecture doc',
    img: ProjectAIDashboard
  },
  {
    title: 'SaaS Application with Payments',
    tools: 'MERN Stack · Stripe API',
    desc: 'A complete multi-tenant SaaS app with authentication and payment gateways.',
    portfolio: 'Deployed web app, REST API docs, GitHub repo',
    img: ProjectSaaS
  },
  {
    title: 'Sales Analytics Dashboard',
    tools: 'SQL · Power BI · Excel',
    desc: 'Analyze customer purchase patterns and build interactive sales dashboards.',
    portfolio: 'Interactive dashboard link, SQL query scripts, Data report',
    img: ProjectAnalytics
  },
  {
    title: 'Cyber Threat Detection System',
    tools: 'Python · Wireshark · Splunk',
    desc: 'Monitor and detect network intrusions using real packet analysis and alerting.',
    portfolio: 'Threat report, Detection scripts, GitHub repo',
    img: ProjectCyber
  },
  {
    title: 'Android Expense Tracker App',
    tools: 'Kotlin · Firebase · Jetpack',
    desc: 'A fully functional Android app for tracking personal expenses with cloud sync.',
    portfolio: 'Play Store link, APK, GitHub repo',
    img: ProjectAndroid
  },
  {
    title: 'UI/UX Design System',
    tools: 'Figma · Adobe XD · Zeplin',
    desc: 'Design a complete product design system with reusable components and prototypes.',
    portfolio: 'Figma prototype link, Component library, Case study',
    img: ProjectUIUX
  },
  {
    title: 'Cloud Infrastructure on AWS',
    tools: 'AWS · Terraform · VPC',
    desc: 'Deploy a production-grade multi-tier architecture using EC2, RDS, S3, and ALB.',
    portfolio: 'Architecture diagram, IaC scripts, Live URL',
    img: ProjectCloud
  },
  {
    title: 'DevOps CI/CD Pipeline',
    tools: 'Docker · Jenkins · Kubernetes',
    desc: 'Automate build, test and deployment pipelines with containerised microservices.',
    portfolio: 'Pipeline config, Docker images, GitHub Actions repo',
    img: ProjectDevOps
  },
  {
    title: 'ML Sentiment Analysis Engine',
    tools: 'Python · TensorFlow · Flask',
    desc: 'Train and deploy a sentiment classifier with a REST API and live demo interface.',
    portfolio: 'API endpoint, Model card, Jupyter notebook',
    img: ProjectML
  }
];

/* --- Mentors Data --- */
const MENTORS = [
  {
    name: 'Ankit Rao',
    role: 'Senior Software Engineer',
    domain: 'Full Stack & Cloud Mentor',
    quote: 'I help students turn incomplete college projects into deployable products.',
    img: SubhraImg 
  },
  {
    name: 'Priya Sharma',
    role: 'Data Scientist',
    domain: 'Data Science & Analytics Mentor',
    quote: 'Stop watching tutorials. Start building predictive models that solve real business problems.',
    img: RudraImg
  }
];

/* --- Timeline Data --- */
const TIMELINE = [
  { stage: 'Week 0', title: 'Diagnostic & Domain Selection', desc: 'Identify your current skill level and choose the right domain.' },
  { stage: 'Weeks 1–3', title: 'Core Skill Foundations', desc: 'Guided practice and fundamental concepts with live mentor sessions.' },
  { stage: 'Weeks 4–7', title: 'Portfolio Project Building', desc: 'Build your flagship project with regular code reviews.' },
  { stage: 'Weeks 8–10', title: 'Deployment & Polish', desc: 'Mentor reviews, application deployment, and GitHub optimization.' },
  { stage: 'Final Phase', title: 'Placement Readiness', desc: 'Resume building, mock interviews, and job search strategy.' }
];

/* --- Reviews Data --- */
const REVIEWS = [
  {
    name: 'Harsha',
    college: '2026 graduate, Bengaluru',
    domain: 'Full Stack Dev',
    quote: 'I stopped randomly learning tutorials and shipped a deployable MERN application with payments, admin controls, and deployment.',
    initials: 'H'
  },
  {
    name: 'Aisha Khan',
    college: '2025 graduate, Delhi',
    domain: 'Data Science',
    quote: 'The mentor feedback on my predictive model was eye-opening. It gave me the confidence to apply for actual roles.',
    initials: 'AK'
  },
  {
    name: 'Rahul Desai',
    college: '2024 graduate, Pune',
    domain: 'Cloud Computing',
    quote: 'Instead of just reading about AWS, I actually deployed a scalable architecture. That is what got me shortlists.',
    initials: 'RD'
  },
  {
    name: 'Pavan B V',
    college: '2025 graduate, Bengaluru',
    domain: 'Data & Technology',
    quote: 'Guidance and supervision soon blossomed in my learning journey. Thank you for providing such a valuable opportunity. The knowledge gained was instrumental in making me understand the domain better.',
    initials: 'PV'
  },
  {
    name: 'Dabhade',
    college: 'Graduate, Pune',
    domain: 'Psychology & Tech',
    quote: 'It is truly psychological theories and practical skills combined. The mentor is enabling me with ideas helpful in unconventional theories and practical skills. The focus on learning and structure to real world scenarios was understanding.',
    initials: 'D'
  },
  {
    name: 'Parthi Kumar',
    college: '2025 graduate',
    domain: 'Machine Learning',
    quote: 'I am grateful for Centino for this wonderful opportunity. During this internship program I gained valuable knowledge and hands-on experience in various aspects of cybersecurity. One of the highlights was working on an individual video project where I had the opportunity to deal with a pipeline and identify vulnerabilities.',
    initials: 'PK'
  },
  {
    name: 'Prabash Tankala',
    college: 'Graduate, Hyderabad',
    domain: 'Full Stack Dev',
    quote: 'This experience allowed me to enhance my technical skills. I recently completed a rewarding internship at Centino where I had the opportunity to delve deeply into the field of Machine Learning over a period of two months.',
    initials: 'PT'
  },
  {
    name: 'Auchi Makheja',
    college: '2026 graduate, Delhi',
    domain: 'Data Science',
    quote: 'I got to learn how to build a strong networking and create posts for the team. In the Mentorship period we formed three tasks of getting mastered of different fields giving enrollment in the various seminars for different courses and internship programs.',
    initials: 'AM'
  },
  {
    name: 'Ian Yaseen',
    college: '2025 graduate, Chennai',
    domain: 'Data & Software Engineering',
    quote: 'Boom rewarding. The program provided me with invaluable skills and insights that I am eager to apply in my professional endeavors.',
    initials: 'IY'
  },
  {
    name: 'Sneha Reddy',
    college: '2025 graduate, Hyderabad',
    domain: 'Cyber Security',
    quote: 'The ethical hacking labs and threat analysis guidance were top notch. Practical hands-on experience with real security tools gave my resume the edge it needed.',
    initials: 'SR'
  },
  {
    name: 'Vikram Mehta',
    college: '2024 graduate, Mumbai',
    domain: 'DevOps',
    quote: 'Mastered Docker, Kubernetes, and Terraform with continuous mentor support. The CI/CD pipeline project I built is now a major talking point in every interview.',
    initials: 'VM'
  },
  {
    name: 'Ananya Gupta',
    college: '2026 graduate, Kolkata',
    domain: 'AI & ML',
    quote: 'Generative AI and LLM project modules helped me build something I could actually show in interviews. The domain guidance was genuinely transformational.',
    initials: 'AG'
  },
  {
    name: 'Rohan Verma',
    college: '2025 graduate, Jaipur',
    domain: 'Full Stack Dev',
    quote: 'Building full-stack MERN apps with live corporate codebases set my resume apart. The structured roadmap made it clear what to build and why.',
    initials: 'RV'
  },
  {
    name: 'Kavya Nair',
    college: '2026 graduate, Kochi',
    domain: 'UI / UX Design',
    quote: 'The mentor reviewed my Figma prototypes in detail and helped me understand design systems from a product perspective, not just aesthetics.',
    initials: 'KN'
  },
  {
    name: 'Arjun Krishnamurthy',
    college: '2025 graduate, Chennai',
    domain: 'Cloud Computing',
    quote: 'I went from being confused about certifications to having a working AWS architecture deployed and documented. This is what internship should look like.',
    initials: 'AKR'
  },
  {
    name: 'Priya Mukherjee',
    college: '2024 graduate, Kolkata',
    domain: 'Data Analytics',
    quote: 'The Power BI project with real datasets was exactly what I needed. My portfolio went from empty to impressive in 8 weeks.',
    initials: 'PM'
  },
  {
    name: 'Siddharth Joshi',
    college: '2026 graduate, Ahmedabad',
    domain: 'Android App Dev',
    quote: 'Built and published my first Kotlin app on the Play Store during the program. Having a live app link in my resume changed everything.',
    initials: 'SJ'
  },
  {
    name: 'Megha Singh',
    college: '2025 graduate, Lucknow',
    domain: 'Data Science',
    quote: 'The structured approach to learning Python and building predictive models gave me confidence that no online course ever did. The mentor reviews were honest and detailed.',
    initials: 'MS'
  },
  {
    name: 'Tanmay Kulkarni',
    college: '2024 graduate, Nagpur',
    domain: 'DevOps',
    quote: 'I had zero DevOps knowledge when I joined. By the end I had a working Jenkins pipeline, Docker containers, and a monitored deployment. Incredible structured guidance.',
    initials: 'TK'
  },
  {
    name: 'Divya Sharma',
    college: '2026 graduate, Bhopal',
    domain: 'AI',
    quote: 'The LLM integration project was hands down the best thing on my GitHub. Multiple interviewers specifically asked about it. Worth every session.',
    initials: 'DS'
  },
  {
    name: 'Nikhil Rao',
    college: '2025 graduate, Vizag',
    domain: 'Cyber Security',
    quote: 'Learned penetration testing concepts in a structured lab environment. The certification badge from the program added real credibility to my profile.',
    initials: 'NR'
  },
  {
    name: 'Pooja Iyer',
    college: '2024 graduate, Coimbatore',
    domain: 'Full Stack Dev',
    quote: 'The project architecture guidance was invaluable. I now understand how to structure a production-grade application, not just write code that works.',
    initials: 'PI'
  },
  {
    name: 'Aarav Sharma',
    college: '2025 graduate, Delhi',
    domain: 'Machine Learning',
    quote: 'The hands-on ML project and dedicated mentorship helped me transition from theory to actual deployable models. Got placed within a month of completing the program.',
    initials: 'AS'
  }
];

/* --- FAQ Data --- */
const FAQS = [
  {
    q: 'How does the Adobe Authorized Training Partner certification benefit me?',
    a: 'As an Official Adobe Authorized Training Partner, our program delivers industry-aligned curriculum and recognized certification badges that recruiters at top tech firms prioritize.'
  },
  {
    q: 'Can I switch or explore multiple of the 10 domains during mentorship?',
    a: 'Yes! While you select a primary domain for intensive training, our career counselors help align foundational modules across connected domains so you build a versatile tech profile.'
  },
  {
    q: 'What type of mentorship and project support is provided?',
    a: 'You get 1:1 dedicated sessions with active industry tech leads, weekly live hands-on labs, portfolio code reviews, and guaranteed interview preparation.'
  },
  {
    q: 'Is there placement assistance provided?',
    a: 'We provide comprehensive career support: resume building, portfolio review, mock interviews, and job search strategy, along with access to our hiring network.'
  }
];

const AvgFormPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeFaq, setActiveFaq] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    personalEmail: '',
    contactNumber: '',
    whatsappNumber: '',
    collegeName: '',
    branchName: '',
    collegeEmail: '',
    yearOfStudying: '',
    placementCellEmail: '',
    crNameAndNumber: '',
    interestedDomain: '',
    primaryObjective: '',
    preferredLanguage: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectDomain = (domainName) => {
    setFormData(prev => ({ ...prev, interestedDomain: domainName }));
    if (errors.interestedDomain) {
      setErrors(prev => ({ ...prev, interestedDomain: '' }));
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById('avg-mentorship-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  /* Step Validations */
  const validateStep1 = () => {
    let errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.personalEmail.trim() || !emailRegex.test(formData.personalEmail)) errs.personalEmail = 'Valid email is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.replace(/\D/g, '').length < 7) errs.contactNumber = 'Valid contact number is required';
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.replace(/\D/g, '').length < 7) errs.whatsappNumber = 'Valid WhatsApp number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    let errs = {};
    if (!formData.collegeName.trim()) errs.collegeName = 'College Name is required';
    if (!formData.branchName.trim()) errs.branchName = 'Branch Name is required';
    if (!formData.collegeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) errs.collegeEmail = 'Valid college email is required';
    if (!formData.yearOfStudying.trim()) errs.yearOfStudying = 'Year of Studying is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    let errs = {};
    if (!formData.interestedDomain) errs.interestedDomain = 'Please select a domain';
    if (!formData.primaryObjective.trim()) errs.primaryObjective = 'Primary Objective is required';
    if (!formData.preferredLanguage.trim()) errs.preferredLanguage = 'Preferred Language is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 4) return;

    setIsSubmitting(true);

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxhXxyWD6Wqy1bPF5kmgdauNZesCssV2ndSuJKcv4mKsldfSt-q0Qn11pxg9Blplfbm/exec";

    try {
      const params = new URLSearchParams();
      params.append('fullName', formData.fullName);
      params.append('personalEmail', formData.personalEmail);
      params.append('contactNumber', formData.contactNumber);
      params.append('whatsappNumber', formData.whatsappNumber);
      params.append('collegeName', formData.collegeName);
      params.append('branchName', formData.branchName);
      params.append('collegeEmail', formData.collegeEmail);
      params.append('yearOfStudying', formData.yearOfStudying);
      params.append('placementCellEmail', formData.placementCellEmail);
      params.append('crNameAndNumber', formData.crNameAndNumber);
      params.append('interestedDomain', formData.interestedDomain);
      params.append('primaryObjective', formData.primaryObjective);
      params.append('preferredLanguage', formData.preferredLanguage);
      params.append('formSource', 'avg');

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Roadmap request submitted successfully!");
    } catch (err) {
      console.error("Form submission error:", err);
      setIsSubmitting(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="avg-wrapper">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      <nav className="avg-nav">
        <div className="avg-container avg-nav-inner">
          <a href="/" className="avg-brand-badge">
            <div className="avg-adobe-logo-box">
              <span>Adobe</span>
            </div>
            <div>
              <div className="avg-brand-title">Krutanic x Adobe</div>
              <span className="avg-brand-sub">Authorized Training Partner</span>
            </div>
          </a>

          <div className="avg-nav-trust-tag">
            <div className="avg-pulse-dot"></div>
            <span>Live 1:1 Career Mentorship</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="avg-hero">
        <div className="avg-container avg-hero-grid">
          {/* Left Text */}
          <div className="avg-hero-content">
            <div className="avg-hero-badge">
              <span>Adobe Certified Training Partner • Live 1:1 Career Mentorship</span>
            </div>
            <h1 className="avg-hero-title">
              Turn your engineering skills into a portfolio recruiters can <span className="highlight">actually evaluate.</span>
            </h1>
            <p className="avg-hero-desc">
              Choose the right tech domain, build real projects with mentor feedback, and prepare for internships and placements with a structured career roadmap.
            </p>

            <div className="avg-hero-features-list">
              <div className="avg-hero-feat-item">
                <CheckIcon /> Live mentor reviews
              </div>
              <div className="avg-hero-feat-item">
                <CheckIcon /> Real-world projects
              </div>
              <div className="avg-hero-feat-item">
                <CheckIcon /> Career & placement preparation
              </div>
            </div>

            <div className="avg-hero-actions">
                <button className="avg-btn-primary" onClick={scrollToForm}>
                  Get My Free Career Roadmap
                </button>
                <button className="avg-btn-secondary" onClick={() => document.getElementById('projects-section').scrollIntoView({behavior: 'smooth'})}>
                  See Student Projects
                </button>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="avg-form-card" id="avg-mentorship-form">
            {!submitted ? (
              <>
                <div className="avg-form-header">
                  <h3>Find the right tech path in 3 minutes</h3>
                  <p>Tell us where you are in your journey. We’ll recommend the best-fit domain and next batch.</p>
                </div>

                {/* Step indicator */}
                <div className="avg-step-bar">
                  <div className={`avg-step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>1</div>
                  <div className={`avg-step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>2</div>
                  <div className={`avg-step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>3</div>
                  <div className={`avg-step-item ${currentStep >= 4 ? 'active' : ''}`}>4</div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="avg-step-content">
                      <div className="avg-form-group">
                        <label>Full Name *</label>
                        <input type="text" name="fullName" placeholder="Enter your full name" className="avg-form-input" value={formData.fullName} onChange={handleInputChange} />
                        {errors.fullName && <div className="avg-error-text">{errors.fullName}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Personal Email *</label>
                        <input type="email" name="personalEmail" placeholder="john@example.com" className="avg-form-input" value={formData.personalEmail} onChange={handleInputChange} />
                        {errors.personalEmail && <div className="avg-error-text">{errors.personalEmail}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Contact Number *</label>
                        <input type="tel" name="contactNumber" placeholder="+91" className="avg-form-input" value={formData.contactNumber} onChange={handleInputChange} />
                        {errors.contactNumber && <div className="avg-error-text">{errors.contactNumber}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>WhatsApp Number *</label>
                        <input type="tel" name="whatsappNumber" placeholder="+91" className="avg-form-input" value={formData.whatsappNumber} onChange={handleInputChange} />
                        {errors.whatsappNumber && <div className="avg-error-text">{errors.whatsappNumber}</div>}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Academic Details */}
                  {currentStep === 2 && (
                    <div className="avg-step-content">
                      <div className="avg-form-group">
                        <label>College Name *</label>
                        <input type="text" name="collegeName" placeholder="Your University/College" className="avg-form-input" value={formData.collegeName} onChange={handleInputChange} />
                        {errors.collegeName && <div className="avg-error-text">{errors.collegeName}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Branch Name *</label>
                        <input type="text" name="branchName" placeholder="e.g. Computer Science" className="avg-form-input" value={formData.branchName} onChange={handleInputChange} />
                        {errors.branchName && <div className="avg-error-text">{errors.branchName}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>College Email ID *</label>
                        <input type="email" name="collegeEmail" placeholder="student@college.edu" className="avg-form-input" value={formData.collegeEmail} onChange={handleInputChange} />
                        {errors.collegeEmail && <div className="avg-error-text">{errors.collegeEmail}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Year Of Studying *</label>
                        <select name="yearOfStudying" className="avg-form-select" value={formData.yearOfStudying} onChange={handleInputChange}>
                          <option value="">Select Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduates">Graduates</option>
                        </select>
                        {errors.yearOfStudying && <div className="avg-error-text">{errors.yearOfStudying}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Placement Cell Email (Optional)</label>
                        <input type="email" name="placementCellEmail" placeholder="tpo@college.edu" className="avg-form-input" value={formData.placementCellEmail} onChange={handleInputChange} />
                      </div>
                      <div className="avg-form-group">
                        <label>CR's Name & Number (Optional)</label>
                        <input type="text" name="crNameAndNumber" placeholder="Name - Phone" className="avg-form-input" value={formData.crNameAndNumber} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Program Goals */}
                  {currentStep === 3 && (
                    <div className="avg-step-content">
                      <div className="avg-form-group">
                        <label>Interested Domain *</label>
                        <div className="avg-domain-select-grid">
                          {DOMAINS_LIST.map((d) => (
                            <div
                              key={d.id}
                              className={`avg-domain-radio-card ${formData.interestedDomain === d.name ? 'selected' : ''}`}
                              onClick={() => selectDomain(d.name)}
                            >
                              <span className="avg-domain-radio-name">{d.name}</span>
                            </div>
                          ))}
                        </div>
                        {errors.interestedDomain && <div className="avg-error-text">{errors.interestedDomain}</div>}
                      </div>
                      <div className="avg-form-group" style={{ marginTop: '16px' }}>
                        <label>Primary Objective *</label>
                        <select name="primaryObjective" className="avg-form-select" value={formData.primaryObjective} onChange={handleInputChange}>
                          <option value="">Why are you joining?</option>
                          <option value="Skill Development & Industry Exposure">Skill Development & Industry Exposure</option>
                          <option value="Career Growth Opportunity">Career Growth Opportunity</option>
                          <option value="Learning from Industry Leaders">Learning from Industry Leaders</option>
                          <option value="To Gain Exposure to Emerging Technologies">To Gain Exposure to Emerging Technologies</option>
                        </select>
                        {errors.primaryObjective && <div className="avg-error-text">{errors.primaryObjective}</div>}
                      </div>
                      <div className="avg-form-group">
                        <label>Preferred Language *</label>
                        <input type="text" name="preferredLanguage" placeholder="e.g. English, Hindi" className="avg-form-input" value={formData.preferredLanguage} onChange={handleInputChange} />
                        {errors.preferredLanguage && <div className="avg-error-text">{errors.preferredLanguage}</div>}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Summary & Submit */}
                  {currentStep === 4 && (
                    <div className="avg-step-content">
                      <div className="avg-summary-box">
                        <h4>Confirm your details:</h4>
                        <p>
                          <strong>Name:</strong> {formData.fullName}<br />
                          <strong>Email:</strong> {formData.personalEmail}<br />
                          <strong>Phone:</strong> {formData.contactNumber}<br />
                          <strong>Domain:</strong> <span className="highlight-text">{formData.interestedDomain}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Action Buttons */}
                  <div className="avg-form-actions">
                    {currentStep > 1 && (
                      <button type="button" className="avg-btn-secondary" onClick={prevStep}>
                        Back
                      </button>
                    )}

                    {currentStep < 4 ? (
                      <button type="button" className="avg-btn-primary" onClick={nextStep}>
                        Continue <ArrowRightIcon />
                      </button>
                    ) : (
                      <button type="submit" className="avg-btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Book My Free Career Roadmap'}
                      </button>
                    )}
                  </div>
                  
                  <div className="avg-form-privacy">
                    Your details stay private. No spam. A counsellor will contact you on WhatsApp.
                  </div>
                </form>
              </>
            ) : (
              <div className="avg-success-state">
                <div className="avg-success-icon">
                  <CheckIcon size={32} />
                </div>
                <h3>Roadmap Request Received</h3>
                <p>
                  Thank you <strong>{formData.fullName}</strong>. Your request for <span className="highlight-text">{formData.interestedDomain}</span> has been registered.
                </p>
                <p className="avg-success-sub">Our career advisor will message you on WhatsApp shortly.</p>
              </div>
            )}
            
            {/* Ethical Urgency Block */}
            <div className="avg-urgency-block">
                <div className="urgency-item"><strong>Next cohort:</strong> September 2026</div>
                <div className="urgency-item"><strong>Format:</strong> Live sessions + 1:1 mentor reviews</div>
                <div className="urgency-item"><strong>Status:</strong> Applications under review</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Sticky CTA */}
      <div className="avg-mobile-sticky-cta">
        <button className="avg-btn-primary" onClick={scrollToForm}>
            Get My Career Roadmap
        </button>
      </div>

      {/* Why Students Join Section */}
      <section className="avg-section avg-pain-points">
        <div className="avg-container">
          <div className="avg-section-header text-center">
            <h2 className="avg-section-title">Is this right for you?</h2>
            <p className="avg-section-sub">
              Engineering students face common challenges. We built this program to solve them.
            </p>
          </div>
          
          <div className="avg-pain-grid">
            <div className="avg-pain-card">
              <div className="pain-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 12l-4-4-4 4"/><path d="M12 8v8"/></svg>
              </div>
              <div className="pain-card-content">
                <h4>Adobe Certified Professional</h4>
                <p>Earn a credential directly from Adobe that validates your skills globally. This isn't just a course completion certificate; it's an industry standard.</p>
                <div className="pain-solution">
                  <span className="pain-solution-badge">Step 1</span> Become a Certified Professional
                </div>
              </div>
            </div>
            <div className="avg-pain-card">
              <div className="pain-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <div className="pain-card-content">
                <h4>Corporate-Level Training</h4>
                <p>Learn the exact frameworks and workflows used by top product companies. Build applications that meet rigorous enterprise quality standards.</p>
                <div className="pain-solution">
                  <span className="pain-solution-badge">Step 2</span> Train like a Corporate Engineer
                </div>
              </div>
            </div>
            <div className="avg-pain-card">
              <div className="pain-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <div className="pain-card-content">
                <h4>Direct Placement Advantage</h4>
                <p>Recruiters prioritize certified talent. Bypass the initial screening rounds with a portfolio and certification that proves you can deliver from day one.</p>
                <div className="pain-solution">
                  <span className="pain-solution-badge">Step 3</span> Fast-track your hiring process
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Will Build Section */}
      <section id="projects-section" className="avg-section avg-projects">
        <div className="avg-container">
          <div className="avg-section-header">
            <h2 className="avg-section-title">What You Will Build</h2>
            <p className="avg-section-sub">
              Students trust tangible outputs. Here is what goes on your GitHub and resume.
            </p>
          </div>

          <div className="avg-projects-grid">
            {PROJECTS.map((proj, idx) => (
              <div className="avg-project-card" key={idx}>
                {proj.img ? (
                  <img src={proj.img} alt={proj.title} className="project-image" />
                ) : (
                  <div className="project-image-placeholder">
                      <span>Project Preview</span>
                  </div>
                )}
                <div className="project-content">
                    <span className="project-tools">{proj.tools}</span>
                    <h4 className="project-title">{proj.title}</h4>
                    <p className="project-desc">{proj.desc}</p>
                    <div className="project-portfolio">
                        <strong>Portfolio Output:</strong> {proj.portfolio}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Mentors Section */}
      <section className="avg-section avg-mentors">
        <div className="avg-container">
          <div className="avg-section-header">
            <h2 className="avg-section-title">Learn with Domain Specialists</h2>
            <p className="avg-section-sub">
              Get 1:1 feedback from working professionals who know what the industry demands today.
            </p>
          </div>

          <div className="avg-mentors-grid">
            {MENTORS.map((mentor, idx) => (
              <div className="avg-mentor-card" key={idx}>
                <img src={mentor.img} alt={mentor.name} className="mentor-img" />
                <div className="mentor-info">
                  <h4 className="mentor-name">{mentor.name}</h4>
                  <p className="mentor-role">{mentor.role}</p>
                  <span className="mentor-domain">{mentor.domain}</span>
                  <p className="mentor-quote">"{mentor.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Journey / Timeline Section */}
      <section className="avg-section avg-timeline-section">
        <div className="avg-container">
          <div className="avg-section-header text-center">
            <h2 className="avg-section-title">Transparent Learning Timeline</h2>
            <p className="avg-section-sub">A structured path from diagnostic to placement readiness.</p>
          </div>

          <div className="avg-timeline">
            {TIMELINE.map((item, idx) => (
              <div className="timeline-item" key={idx}>
                <div className="timeline-left">
                  <div className="timeline-step-num">{idx + 1}</div>
                  {idx < TIMELINE.length - 1 && <div className="timeline-connector"></div>}
                </div>
                <div className="timeline-body">
                  <span className="timeline-stage-badge">{item.stage}</span>
                  <h4 className="timeline-title">{item.title}</h4>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Work / Reviews Section (Masonry Grid) */}
      <section className="avg-section avg-reviews-section">
        <div className="avg-container">
          <div className="avg-section-header text-center">
            <h2 className="avg-section-title">A Testimony to What We Do</h2>
            <p className="avg-section-sub">
              Hear from engineering students who built their portfolios with us.
            </p>
          </div>

          <div className="avg-reviews-masonry">
            {REVIEWS.map((rev, idx) => (
              <div className="avg-review-card" key={idx}>
                <p className="avg-review-text">"{rev.quote}"</p>
                <div className="avg-review-user">
                  <div className="avg-review-avatar">{rev.initials}</div>
                  <div className="avg-review-info">
                    <h5>{rev.name}</h5>
                    <p>{rev.college}</p>
                    <span className="avg-review-domain-badge">{rev.domain}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="avg-section avg-faq-section">
        <div className="avg-container">
          <div className="avg-section-header text-center">
            <h2 className="avg-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="avg-faq-list">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="avg-faq-item"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="avg-faq-q">
                  <span>{faq.q}</span>
                  <span>{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && <div className="avg-faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="avg-footer">
        <div className="avg-container">
          <p>© 2026 Krutanic. Official Adobe Authorized Training Partner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AvgFormPage;
