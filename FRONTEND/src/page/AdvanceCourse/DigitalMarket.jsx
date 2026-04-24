import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  ChevronDown, 
  Download, 
  TrendingUp, 
  Award, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  Zap, 
  BarChart3, 
  PieChart, 
  Repeat, 
  Layout,
  PhoneCall,
  UserCheck,
  Video,
  MessagesSquare,
  FileText,
  Rocket,
  Globe,
  Star,
  Users,
  Target,
  Search,
  Monitor,
  Terminal,
  Share2,
  Cpu,
  Mail,
  Smartphone
} from "lucide-react";

import posterImage from "../../../krutanic/images/poster/digitalmarketing.png";
import Flashaidlogo from "../../assets/Flashaidlogo.jpg";
import Certification from "./Components/Certification";
import ClientsCarousel from "../../Components/our_alumni";
import ApplyNowButton from "./Components/ApplyNowButton";
import ApplyForm from "./Components/ApplyForm";
import CourseHeroBanner from "./Components/CourseHeroBanner";
import ImageSlider from "./Components/ImageSlider";
import CourseInfoStrip from "./Components/CourseInfoStrip";
import dmBrochure from "../../../krutanic/Digital Marketing Advanced Program.pdf";

const heroStats = [
  { label: "Placement Rate", value: "93%" },
  { label: "Hiring Partners", value: "250+" },
  { label: "Student Rating", value: "4.7/5" },
  { label: "Students Placed", value: "200+" },
];

const audience = [
  { title: "Students & Graduates", desc: "Build a professional marketing portfolio and land your first role in the digital economy.", icon: <Award size={20} /> },
  { title: "Career Switchers", desc: "Pivot from traditional sales, admin, or support roles into high-growth performance marketing.", icon: <Repeat size={20} /> },
  { title: "Business Owners", desc: "Master the tools to scale your own brand and manage campaigns without expensive agencies.", icon: <Rocket size={20} /> },
  { title: "Working Professionals", desc: "Upskill in data-driven marketing and automation to move into senior strategy or growth roles.", icon: <Briefcase size={20} /> },
  { title: "Freelancers", desc: "Broaden your service offerings from simple posting to full-funnel execution and SEO strategy.", icon: <Globe size={20} /> },
  { title: "Content Creators", desc: "Learn the technical side of distribution, SEO, and paid growth to monetize your brand effectively.", icon: <Star size={20} /> }
];

const marketOpportunity = [
  { title: "Budget Shift", desc: "Global ad spend is aggressively moving from TV and print to digital-first platforms.", icon: <TrendingUp size={24} /> },
  { title: "Skill Gap", desc: "Businesses are struggling to find marketers who understand both creative strategy and technical data.", icon: <Target size={24} /> },
  { title: "Universal Demand", desc: "Digital presence is no longer optional; every industry from local retail to SaaS needs experts.", icon: <Globe size={24} /> }
];

const techStack = [
  { group: "Fundamentals", tools: ["Google Forms", "ChatGPT", "Notion", "Google Drive"] },
  { group: "Content & Design", tools: ["Canva", "QuillBot", "Grammarly", "copy.ai", "Figma"] },
  { group: "Social Media", tools: ["Meta Business Suite", "LinkedIn", "Instagram", "Hootsuite", "Buffer"] },
  { group: "SEO & Search", tools: ["SEMrush", "Ahrefs", "Google Search Console", "Screaming Frog", "Ubersuggest", "Yoast"] },
  { group: "Performance & Ads", tools: ["Google Ads", "Meta Ads Manager", "LinkedIn Ads Manager", "TikTok Ads"] },
  { group: "Analytics & Data", tools: ["GA4", "Looker Studio", "Microsoft Clarity", "Google Tag Manager"] },
  { group: "Automation & CRM", tools: ["Zapier", "HubSpot", "Mailchimp", "ActiveCampaign", "Brevo"] },
  { group: "E-Commerce", tools: ["Shopify", "Webflow", "AppsFlyer", "MoEngage"] }
];

const curriculumRoadmap = [
  { module: "Module 1", title: "Social Media Marketing", summary: "Strategy, Content & Growth Funnels.", topics: "Instagram Reels, LinkedIn Branding, YouTube Growth, AI Content Tools, Viral Loops.", details: "Master the platform ecosystem and build brand-level case studies using AI-driven content generation." },
  { module: "Module 2", title: "Search Engine Optimization", summary: "Organic Rankings & Technical Authority.", topics: "Keywords, On-Page SEO, Technical Audits, Backlinks, Search Console.", details: "Master the art of organic growth and site authority to drive high-intent traffic without ad spend." },
  { module: "Module 3", title: "Performance Marketing", summary: "ROI-Focused Paid Ads & Analytics.", topics: "Google Ads, Meta Ads Manager, GA4, ROAS, A/B Testing.", details: "Learn to manage multi-million budgets with data-driven precision and cross-channel optimization." },
  { module: "Module 4", title: "Advanced Automation", summary: "Omnichannel Growth & Scaling.", topics: "Email Marketing, CRO, Zapier, Retargeting, WhatsApp/SMS.", details: "Build automated systems that nurture leads and scale revenue through omnichannel integration." },
  { module: "Module 5", title: "Career Acceleration", summary: "Job Readiness & Portfolio Execution.", topics: "Resume, Mock Interviews, Live Projects, Referrals.", details: "Final phase focused on personal branding and technical interview preparation for top hiring partners." }
];

const portfolioProjects = [
  { title: "Full-Funnel Meta Campaign", problem: "Launching a scalable acquisition system for a premium D2C brand.", outcome: "Master ad-set structure and budget optimization." },
  { title: "E-commerce SEO Audit", problem: "Identifying technical bottlenecks for a marketplace with 10k+ pages.", outcome: "Build professional site audits for hiring managers." },
  { title: "LinkedIn Thought Leadership", problem: "Building a personal executive brand for a high-value SaaS founder.", outcome: "Master B2B content and distribution strategy." },
  { title: "Omnichannel Automation", problem: "Integrating Email, WhatsApp, and SMS for a holiday discount event.", outcome: "Master CRM logic and multi-channel workflows." }
];

const careerRoles = [
  { role: "Performance Marketer", range: "12 - 22 LPA" },
  { role: "Paid Media Specialist", range: "10 - 18 LPA" },
  { role: "Social Media Manager", range: "08 - 14 LPA" },
  { role: "SEO Specialist", range: "09 - 16 LPA" },
  { role: "Growth Lead", range: "18 - 35 LPA" },
  { role: "Digital Marketing Head", range: "25 - 50 LPA" }
];

const alumniOutcomes = [
  { name: "Ananya Iyer", role: "Journalism Grad", target: "Performance Marketer", company: "Zomato", desc: "Bridging the gap between writing and data-driven ads was the game-changer." },
  { name: "Rohan Verma", role: "Business Owner", target: "Growth Specialist", company: "Nykaa", desc: "I optimized my own store's ROAS from 1.2 to 4.5 before joining my current role." },
  { name: "Priya Sharma", role: "Fresher", target: "SEO Specialist", company: "Microsoft", desc: "The technical SEO module helped me crack one of the hardest agency technical rounds." }
];

const faqCategories = {
  "Program Details": [
    { q: "Is this program for beginners?", a: "Yes, we start from digital fundamentals and move into high-performance execution. No prior marketing experience is required." },
    { q: "What is the class format?", a: "Live interactice sessions on weekends/evenings with industry-level practical activity hours." }
  ],
  "Career Support": [
    { q: "Do you offer placement?", a: "We provide 100% career support, including interview referrals, mock rounds, and portfolio polishing." },
    { q: "Is there a certificate?", a: "Yes, you receive a professional Growth Accelerator Certification recognized by our 250+ hiring partners." }
  ]
};

const DigitalMarket = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeFaqCat, setActiveFaqCat] = useState("Program Details");
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="dm-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap');

        :root {
          --dm-bg: #F7F6F2;
          --dm-text: #1F2937;
          --dm-text-dim: #6B7280;
          --dm-primary: #4F46E5;
          --dm-accent: #818CF8;
          --dm-border: rgba(31, 41, 55, 0.08);
        }

        .dm-page { background: var(--dm-bg); color: var(--dm-text); font-family: 'Plus Jakarta Sans', sans-serif; }
        .shell { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        .dm-section { padding: 100px 0; }
        .dm-sec-white { padding: 100px 0; background: #fff; border-top: 1px solid var(--dm-border); border-bottom: 1px solid var(--dm-border); }

        .sec-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 16px; color: var(--dm-text); text-align: left; }
        .sec-sub { font-size: 17px; color: var(--dm-text-dim); max-width: 600px; margin-bottom: 48px; text-align: left; line-height:1.6; }

        .p-card { 
          background: #fff; 
          border: 1px solid var(--dm-border); 
          border-radius: 12px; 
          padding: 24px; 
          transition: 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .p-card:hover { border-color: var(--dm-accent); box-shadow: 0 8px 30px rgba(0,0,0,0.04); }

        .btn-sec { border: 1px solid var(--dm-border); color: var(--dm-text); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; background:#fff; }

        .faq-item { border: 1px solid var(--dm-border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
        .faq-quest { width:100%; text-align:left; padding: 20px 24px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .faq-ans { padding: 0 24px 24px; font-size: 14px; color: var(--dm-text-dim); line-height: 1.6; }

        .sticky-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 72px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--dm-border); z-index: 99; transform: translateY(100%); transition: 0.4s; display: flex; align-items: center; }
        .sticky-bar.visible { transform: translateY(0); }

        @media (max-width: 768px) { .sec-title { font-size: 28px; } }
      `}</style>

      {/* 1. HERO */}
      <CourseHeroBanner
        badge="Growth Accelerator"
        icon="🚀"
        title="Digital Marketing"
        highlight="Career Certification"
        sub="Master the skills required to lead performance marketing, organic growth, and technical automation for global product brands."
        stats={heroStats}
        bg="linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #4338CA 100%)"
        accent="#818CF8"
        shape="DM"
      >
        <ImageSlider />
      </CourseHeroBanner>

      <CourseInfoStrip 
        accent="#818CF8" 
        courseValue="Digital Marketing" 
        duration="24 Weeks"
        brochureLink={dmBrochure}
      />

      {/* 2. AUDIENCE */}
      <section className="dm-section">
        <div className="shell">
          <h2 className="sec-title">Who this program is for</h2>
          <p className="sec-sub">Essential for anyone aiming to master full-funnel marketing execution, from creators to career switchers.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px'}}>
             {audience.map((item, i) => (
                <div key={i} className="p-card">
                  <div style={{color:'var(--dm-primary)', marginBottom:'16px'}}>{item.icon}</div>
                  <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'10px'}}>{item.title}</h4>
                  <p style={{fontSize:'14px', color:'var(--dm-text-dim)', lineHeight:1.6}}>{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. MARKET OPPORTUNITY */}
      <section className="dm-sec-white">
        <div className="shell text-left">
          <h2 className="sec-title">The Digital Opportunity</h2>
          <p className="sec-sub">Why there has never been a better time to build a technical marketing career.</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'40px'}}>
             {marketOpportunity.map((item, i) => (
               <div key={i} style={{paddingRight:'40px'}}>
                 <div style={{color:'var(--dm-primary)', marginBottom:'20px'}}>{item.icon}</div>
                 <h4 style={{fontSize:'18px', fontWeight:800, marginBottom:'12px'}}>{item.title}</h4>
                 <p style={{fontSize:'15px', color:'var(--dm-text-dim)', lineHeight:1.6}}>{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. TOOLS */}
      <section className="dm-section">
        <div className="shell">
           <h2 className="sec-title">Tool-stack you will master</h2>
           <p className="sec-sub">Gain execution depth across a suite of 40+ industry tools for design, search, and automation.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {techStack.map((group, i) => (
                 <div key={i} className="p-card">
                    <div style={{fontSize:'12px', fontWeight:800, color:'var(--dm-primary)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'16px'}}>{group.group}</div>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                       {group.tools.map(t => (
                          <span key={t} style={{fontSize:'13px', fontWeight:700, background:'var(--dm-bg)', padding:'6px 12px', borderRadius:'6px'}}>{t}</span>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. ROADMAP */}
      <section className="dm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Progressive Learning Roadmap</h2>
           <p className="sec-sub">From organic search foundations to complex performance attribution and career acceleration.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(450px, 1fr))', gap:'16px'}}>
              {curriculumRoadmap.map((item, idx) => (
                 <div key={idx} className="p-card" onClick={() => setExpandedModule(expandedModule === idx ? null : idx)} style={{cursor:'pointer', borderLeft: expandedModule === idx ? '4px solid var(--dm-primary)' : '1px solid var(--dm-border)'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                       <span style={{fontSize:'11px', fontWeight:800, color:'var(--dm-primary)', background:'rgba(79,70,229,0.05)', padding:'4px 12px', borderRadius:'99px'}}>{item.module}</span>
                       <ChevronDown size={16} style={{transform: expandedModule === idx ? 'rotate(180deg)' : 'none', transition:'0.3s'}} />
                    </div>
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'4px'}}>{item.title}</h4>
                    <p style={{fontSize:'14px', color:'var(--dm-text-dim)', marginBottom:'8px'}}>{item.summary}</p>
                    <div style={{fontSize:'13px', fontWeight:700, color:'var(--dm-primary)'}}>{item.topics}</div>
                    {expandedModule === idx && (
                       <div style={{marginTop:'20px', paddingTop:'20px', borderTop:'1px solid var(--dm-border)', color:'var(--dm-text-dim)', fontSize:'14px', lineHeight:1.6}}>
                          {item.details}
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. PROJECTS */}
      <section className="dm-section">
        <div className="shell">
           <h2 className="sec-title">Practical projects and campaigns</h2>
           <p className="sec-sub">Execute end-to-end marketing cycles on real industrial datasets to build your proof-of-work.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'24px'}}>
              {portfolioProjects.map((p, i) => (
                 <div key={i} className="p-card">
                    <h4 style={{fontSize:'20px', fontWeight:800, marginBottom:'16px'}}>{p.title}</h4>
                    <div style={{marginBottom:'16px'}}><div style={{fontSize:'11px', fontWeight:800, color:'var(--dm-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Business Objective</div><p style={{fontSize:'14px'}}>{p.problem}</p></div>
                    <div><div style={{fontSize:'11px', fontWeight:800, color:'var(--dm-text-dim)', textTransform:'uppercase', marginBottom:'4px'}}>Mastered Skill</div><p style={{fontSize:'14px', fontWeight:700, color:'var(--dm-primary)'}}>{p.outcome}</p></div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="dm-sec-white">
        <div className="shell">
           <h2 className="sec-title">How Learning Works</h2>
           <p className="sec-sub">A premium experience focused on live instruction, mentor accountability, and practical lab hours.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'20px'}}>
              {[{t:"Live Classes", d:"Weekend and evening sessions timed for professionals.", i:<Video size={20}/>}, {t:"Technical Mentors", d:"Personal reviews for your campaigns and growth assets.", i:<UserCheck size={20}/>}, {t:"Practical Labs", d:"Weekly activities focused on campaign execution drills.", i:<Terminal size={20}/>}, {t:"Placement Hub", d:"Direct referral pipeline for our 250+ hiring partners.", i:<MessagesSquare size={20}/>}].map((item, i) => (
                 <div key={i} className="p-card text-center">
                    <div style={{color:'var(--dm-primary)', margin:'0 auto 20px', width:'fit-content'}}>{item.i}</div>
                    <div style={{fontWeight:800, marginBottom:'8px'}}>{item.t}</div>
                    <p style={{fontSize:'13px', color:'var(--dm-text-dim)', lineHeight:1.5}}>{item.d}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CAREER PROCESS */}
      <section className="dm-section">
        <div className="shell">
           <h2 className="sec-title">Career Support Process</h2>
           <p className="sec-sub">A transparent 5-step transition workflow to ensure your skills translate into professional results.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'12px'}}>
              {["Profile Audit", "Asset Creation", "Portfolio Review", "Mock Interviews", "Referral Pipeline"].map((step, i) => (
                 <div key={i} style={{padding:'24px', border:'1px solid var(--dm-border)', borderRadius:'12px', background:'#fff', position:'relative', overflow:'hidden'}}>
                    <div style={{fontSize:'32px', fontWeight:950, opacity:0.1, position:'absolute', top:0, left:12}}>0{i+1}</div>
                    <div style={{fontWeight:800, fontSize:'15px', position:'relative', zIndex:2, marginTop:24}}>{step}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. ALUMNI */}
      <section className="dm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Learner outcomes and success</h2>
           <p className="sec-sub">Our graduates have built growth systems for global brands and accelerated their internal career tracks.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:'20px', marginBottom:'48px'}}>
              {alumniOutcomes.map((a, i) => (
                 <div key={i} className="p-card">
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
                       <div><div style={{fontWeight:800}}>{a.name}</div><div style={{fontSize:'12px', color:'var(--dm-text-dim)'}}>{a.role} → {a.target}</div></div>
                       <div style={{fontSize:'14px', fontWeight:800, color:'var(--dm-primary)'}}>{a.company}</div>
                    </div>
                    <p style={{fontSize:'14px', fontStyle:'italic', opacity:0.8}}>"{a.desc}"</p>
                 </div>
              ))}
           </div>
           <ClientsCarousel />
        </div>
      </section>

      {/* 10. PATHS */}
      <section className="dm-section">
        <div className="shell text-left">
           <h2 className="sec-title">Career paths after the program</h2>
           <p className="sec-sub">Target specialized roles with high demand and measurable salary growth models.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'12px'}}>
              {careerRoles.map((r, i) => (
                 <div key={i} className="p-card flex justify-between items-center" style={{padding:'20px'}}>
                    <div style={{fontWeight:800}}>{r.role}</div>
                    <div style={{fontSize:'13px', color:'var(--dm-primary)', fontWeight:700}}>{r.range}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 11. CERTIFICATION */}
      <section className="dm-sec-white">
        <div className="shell">
           <Certification />
        </div>
      </section>

      {/* 12. PRICING */}
      <section className="dm-section" id="pricing">
        <div className="shell">
           <h2 className="sec-title">Program Investment</h2>
           <p className="sec-sub">Transparent enrollment options with secure payment partners and installment plans.</p>
           <div className="p-card" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'60px', padding:'48px', alignItems:'start'}}>
              <div>
                 <div style={{fontSize:'13px', fontWeight:800, color:'var(--dm-primary)', textTransform:'uppercase', marginBottom:'16px'}}>All-access certification</div>
                 <div style={{fontSize:'64px', fontWeight:950, letterSpacing:'-3px', marginBottom:'16px'}}>₹95,999</div>
                 <p style={{color:'var(--dm-text-dim)', marginBottom:'40px', lineHeight:1.6}}>Includes all tools, live sessions, project reviews, and 100% career support access.</p>
                 <div style={{display:'flex', gap:'16px'}}><ApplyNowButton courseValue="Digital Marketing" /><a href={dmBrochure} className="btn-sec">Official Syllabus</a></div>
              </div>
              <div style={{display:'grid', gap:'12px'}}>
                 {[{l:"Seat Reservation", v:"₹10,000"}, {l:"Installment 1", v:"₹43,000"}, {l:"Installment 2", v:"₹42,999"}].map((row, i) => (
                    <div key={i} style={{padding:'20px', background:'var(--dm-bg)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <span style={{fontSize:'13px', fontWeight:700}}>{row.l}</span><span style={{fontWeight:800}}>{row.v}</span>
                    </div>
                 ))}
                 <div style={{marginTop:'12px', display:'flex', alignItems:'center', gap:'12px', opacity:0.6}}><Zap size={18} /> <img src={Flashaidlogo} alt="Flashaid" style={{height:'14px', grayscale:1}} /> <span style={{fontSize:'12px'}}>EMI starting at ₹4,000/month</span></div>
              </div>
           </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="dm-sec-white">
        <div className="shell">
           <h2 className="sec-title">Common Questions</h2>
           <p className="sec-sub">Everything you need to know about the enrollment, learning, and job transition process.</p>
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'60px', alignItems:'start'}}>
              <div style={{display:'grid', gap:'8px'}}>
                 {Object.keys(faqCategories).map(cat => (
                    <button key={cat} onClick={() => { setActiveFaqCat(cat); setOpenFaqIdx(null); }} style={{textAlign:'left', padding:'16px 24px', borderRadius:'10px', fontWeight:700, fontSize:'14px', transition:'0.2s', background: activeFaqCat === cat ? 'var(--dm-primary)' : 'transparent', color: activeFaqCat === cat ? '#fff' : 'var(--dm-text)'}} className={activeFaqCat !== cat ? 'hover:bg-gray-100' : ''}>{cat}</button>
                 ))}
              </div>
              <div style={{display:'grid', gap:'8px'}}>
                 {faqCategories[activeFaqCat].map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}>
                       <div className="faq-quest">{faq.q} <ChevronDown size={14} style={{transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition:'0.3s'}} /></div>
                       <AnimatePresence>{openFaqIdx === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="faq-ans"><div style={{paddingTop:'20px', borderTop:'1px solid var(--dm-border)'}}>{faq.a}</div></motion.div>}</AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 14. FORM */}
      <section className="dm-section">
        <div className="shell">
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'80px', alignItems:'start'}}>
              <div>
                 <h2 className="sec-title">Request a Consultation</h2>
                 <p className="sec-sub">Speak with our technical advisors to review your career roadmap and cohort eligibility.</p>
                 <div style={{display:'grid', gap:'16px'}}>
                    {['24-hour advisor response', 'One-on-one session planning', 'Program suitability audit'].map(t => (
                       <div key={t} style={{display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700}}><CheckCircle2 size={18} className="text-indigo-600" /> {t}</div>
                    ))}
                 </div>
              </div>
              <div className="p-card" style={{padding:'32px', maxWidth:'520px'}}>
                 <div style={{marginBottom:'24px'}}><h3 style={{fontSize:'20px', fontWeight:800, marginBottom:'4px'}}>Advisor Callback Request</h3><p style={{fontSize:'13px', color:'var(--dm-text-dim)'}}>Connect with the KRUTANIC team today.</p></div>
                 <ApplyForm courseValue="Digital Marketing" isPremium={true} />
              </div>
           </div>
        </div>
      </section>

      <div className={`sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="shell flex justify-between items-center w-full">
           <div className="hidden sm:block"><div style={{fontSize:'10px', fontWeight:800, color:'var(--dm-text-dim)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px'}}>Growth Accelerator</div><div style={{fontWeight:800}}>₹95,999 <span style={{fontSize:'12px', color:'var(--dm-primary)', marginLeft:'12px'}}>EMI ₹4,000/MO</span></div></div>
           <div className="flex gap-4 items-center">
              <button onClick={() => window.location.href='tel:9380736449'} className="text-xs font-bold uppercase hidden lg:flex items-center gap-2 hover:text-indigo-600 transition-all"><PhoneCall size={14} /> Callback</button>
              <ApplyNowButton courseValue="Digital Marketing" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalMarket;
