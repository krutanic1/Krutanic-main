export const fullStackData = {
  id: "full-stack-web-development",
  title: "Full Stack Web Development",
  badge: "Next Cohort: May 12, 2025",
  rating: 4.7,
  learners: 2298,
  duration: "12 Weeks",
  format: "Mentor-Led",
  delivery: "Project-Based",
  level: "Beginner Friendly",
  headline: "From Tutorial Hell to Production-Ready Engineer in 12 Weeks",
  subHeadline: "Stop watching YouTube tutorials. Start building real projects with a working engineer reviewing your code every week.",
  stat: "87% of our graduates land tech jobs within 6 weeks of completing the program",
  description: "We don't just teach code; we engineer careers. This intensive 12-week program forces you out of passive learning and into active building. You'll master modern React and Node.js architectures, survive rigorous code reviews, and deploy production-grade applications that make hiring managers pay attention.",
  
  highlights: [
    { title: "12 Weeks of Intensive, Hands-On Learning", desc: "Structured progression from basics to advanced full-stack deployment." },
    { title: "Weekly 1:1 Code Reviews + Group Mentorship", desc: "Real engineers tear down and rebuild your code to industry standards." },
    { title: "No Prerequisites Required", desc: "From zero coding experience to your first paid project in 3 months." },
    { title: "Guaranteed Internship or Placement Support", desc: "If you don't get a job offer within 3 months, 50% refund." }
  ],

  outcomes: [
    { 
      title: "Frontend Architecture", 
      desc: "Build high-performance React applications with SEO optimization, lazy loading, and state management. This is what companies like Amazon and Flipkart test in interviews.",
      salary: "React developers in India earn 8-15 LPA after 1 year"
    },
    { 
      title: "Backend & API Systems", 
      desc: "Develop secure REST APIs using Node.js and Express. Understand middleware, caching, and secure architectures used by top startups.",
      salary: "Backend engineers command 10-18 LPA roles"
    },
    { 
      title: "Database Design & Scaling", 
      desc: "Design scalable MongoDB schemas, handle complex aggregations, and sync data in real-time. Stop relying on simple local JSON files.",
      salary: "Database optimization is a key mid-level developer skill"
    },
    { 
      title: "Authentication & Security", 
      desc: "Implement enterprise-grade JWT auth, OAuth, and role-based access control. Protect your apps against common OWASP vulnerabilities.",
      salary: "Security knowledge fast-tracks you past junior roles"
    }
  ],

  ecosystems: [
    {
      category: "Frontend Ecosystem (React Dominance)",
      tools: "HTML5, CSS3, JavaScript (ES2024), React.js 18+, React Router v6, Tailwind CSS",
      why: "React powers 43% of the web. Learning modern patterns (hooks, suspense) makes you job-ready for startups & enterprises.",
      stats: "Required in 70% of modern frontend roles."
    },
    {
      category: "Backend Ecosystem (Node.js Speed)",
      tools: "Node.js 20+, Express.js, JWT, Bcrypt, Multer",
      why: "Node lets you write backend in JavaScript. It handles asynchronous operations brilliantly, perfect for real-time apps.",
      stats: "Used by Netflix, Uber, and PayPal."
    },
    {
      category: "Database & Cloud (Modern Data)",
      tools: "MongoDB, Mongoose, Redis (basics), Cloudinary",
      why: "NoSQL databases allow rapid iteration. Storing data efficiently separates the juniors from the mid-level engineers.",
      stats: "MongoDB is the #1 database for modern MERN stacks."
    },
    {
      category: "Engineering Workflow (What We Don't Teach)",
      tools: "Git, GitHub, Vercel, Render, Postman",
      why: "We DON'T teach jQuery or PHP. We focus exclusively on the modern stack that gets you hired in 2025.",
      stats: "Git is required in 100% of software engineering jobs."
    }
  ],

  curriculum: [
    {
      module: "Module 1",
      weeks: "Weeks 1-2",
      title: "Web & Programming Foundations",
      difficulty: "Beginner",
      time: "15-20 hours",
      what: "Build 5 websites from scratch using HTML5, CSS3, and vanilla JavaScript. Create a responsive portfolio website.",
      why: "80% of interview questions test these fundamentals. Master these first, and everything else becomes easy.",
      projects: ["Personal Portfolio Site", "Todo App", "Weather App (API integration intro)"],
      outcomes: "You will be able to build pixel-perfect responsive layouts and handle basic API fetching."
    },
    {
      module: "Module 2",
      weeks: "Weeks 3-5",
      title: "Advanced React Frontend Engineering",
      difficulty: "Intermediate",
      time: "25-30 hours",
      what: "Dive deep into React 18+. Master Hooks, Context API, Redux Toolkit, and Tailwind CSS for rapid UI development.",
      why: "React is the industry standard. Companies hire developers who understand state flow, not just those who can render HTML.",
      projects: ["E-Commerce UI", "Movie Database Clone", "Dashboard with Charts"],
      outcomes: "You will be able to architect complex frontend states and build single-page applications."
    },
    {
      module: "Module 3",
      weeks: "Weeks 6-8",
      title: "Node.js & Backend Architecture",
      difficulty: "Intermediate to Advanced",
      time: "25-30 hours",
      what: "Build RESTful APIs with Node and Express. Handle authentication, file uploads, and secure routing.",
      why: "A frontend without a backend is just a mock. Real value is created when you control the data layer.",
      projects: ["User Auth Microservice", "Blogging API", "Image Upload Server"],
      outcomes: "You will be able to design APIs, authenticate users securely, and process server-side logic."
    },
    {
      module: "Module 4",
      weeks: "Weeks 9-10",
      title: "Databases & Full Stack Integration",
      difficulty: "Advanced",
      time: "30 hours",
      what: "Connect React to Node. Design MongoDB schemas using Mongoose. Implement complex database queries.",
      why: "Full-stack integration is where things break. Debugging the boundary between client and server is a crucial senior skill.",
      projects: ["Social Media Feed (Full Stack)", "Real-time Chat App Basics"],
      outcomes: "You will be able to wire a complete application from the database to the browser."
    },
    {
      module: "Module 5",
      weeks: "Weeks 11-12",
      title: "Production Capstone & Interview Prep",
      difficulty: "Expert",
      time: "40+ hours",
      what: "Build your final capstone. Deploy it live. Polish your GitHub. Go through 3 mock interviews with industry seniors.",
      why: "Your capstone is your resume. If it's impressive, deployed, and clean, you skip the technical screening queue.",
      projects: ["Final Production Capstone (e.g., SaaS Clone)"],
      outcomes: "You will have a deployed portfolio, an optimized resume, and interview readiness."
    }
  ],

  projects: [
    {
      title: "TaskFlow Manager - Production-Ready Productivity App",
      description: "A collaborative task management app with real-time updates, user authentication, and smart filtering.",
      challenges: [
        "JWT-based authentication with refresh tokens",
        "Real-time state sync with MongoDB",
        "Advanced React patterns (useContext, custom hooks)",
        "Deployed on Vercel with CI/CD pipeline"
      ],
      hiring_context: "It demonstrates you can build something users actually want to use. The codebase is clean, well-documented, and deployed to production.",
      tech: "React 18, Node.js, Express, MongoDB, Tailwind, JWT",
      links: { demo: "#", github: "#", video: "#" },
      time: "Built over 2 weeks",
      feedback: "80% of students feel confident showing this to companies."
    },
    {
      title: "ShopNex - Full Stack E-Commerce Platform",
      description: "A complete shopping platform featuring product catalogs, cart management, and payment gateway simulation.",
      challenges: [
        "Complex Redux state management for cart operations",
        "Secure checkout data handling",
        "Admin dashboard for product management",
        "Pagination and advanced search filtering"
      ],
      hiring_context: "E-commerce apps test your ability to handle complex state, monetary logic, and relational data—exactly what enterprise companies look for.",
      tech: "MERN Stack, Redux Toolkit, Cloudinary",
      links: { demo: "#", github: "#", video: "#" },
      time: "Built over 3 weeks",
      feedback: "The #1 project that gets our graduates hired at product companies."
    }
  ],

  mentors: [
    {
      name: "Sachin Kumar",
      role: "Lead Full Stack Mentor",
      experience: "6+ Years Industry Experience",
      background: "Former Tech Lead @ InnovateTech",
      specialization: "Scalable Backend Systems, Node.js",
      philosophy: "Sachin has led teams building systems that serve 2M+ users. He's obsessed with clean code and teaching through first-principles thinking. Every week, he does 1:1 code reviews on your projects and gives brutally honest feedback on what will and won't impress companies.",
      stats: [
        "4/5 students he mentors get tech job offers within 6 weeks",
        "Mentored 200+ developers; 87% rate him 5/5",
        "Can't stand hand-holding—expects effort, gives expert feedback"
      ],
      testimonial: "Sachin's code reviews changed how I think about architecture. My interview performance improved 10x.",
      testimonial_author: "- Priya, Software Engineer @ Amazon",
      image: "sachin.jpg"
    },
    {
      name: "Rudra Pratap",
      role: "Frontend Specialist & Interview Coach",
      experience: "5+ Years Experience",
      background: "Senior SDE @ Flipkart",
      specialization: "React Performance, System Design",
      philosophy: "Rudra knows exactly what top-tier tech companies look for in frontend candidates. He focuses heavily on rendering optimization, modern hooks, and turning you into a developer who thinks about performance first.",
      stats: [
        "Conducted 150+ technical interviews for product companies",
        "Specializes in rescuing developers stuck in 'tutorial hell'"
      ],
      testimonial: "Rudra showed me how my React code was re-rendering 50 times unnecessarily. Learning optimization from him got me my current job.",
      testimonial_author: "- Rahul, Frontend Dev @ CRED",
      image: "rudra.jpg" // map appropriately
    }
  ],

  testimonials: [
    {
      quote: "I went from copy-pasting Stack Overflow to understanding system design. Sachin's code reviews were painful but necessary. I landed at Amazon with a 12 LPA offer 5 weeks after the program ended.",
      author: "Arjun Sharma",
      role: "Software Engineer @ Amazon",
      salary: "12 LPA Offer",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "Coming from a commerce background, I was scared. But the first 2 weeks demystified everything. Now I'm building a SaaS product and just closed a $50K seed round. This program changes lives.",
      author: "Priya Patel",
      role: "Founder @ TechSaaS",
      salary: "Startup Founder",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "I had 2 years of experience but was stuck in a support role. Krutanic's MERN stack curriculum modernized my skills. I switched to a product company with a 150% salary hike.",
      author: "Karthik N.",
      role: "Full Stack Developer @ TCS",
      salary: "150% Hike",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ],

  pricing: {
    standard: "₹99,999",
    roi_salary: "₹8.5 LPA (₹70,833/month)",
    recovery: "~1.4 months of salary",
    plans: [
      { name: "Full Upfront", price: "₹99,999", desc: "Best value. Save ₹5,000." },
      { name: "Monthly EMIs", price: "₹35,000 × 3", desc: "Pay as you learn across 3 months." },
      { name: "Income Share (ISA)", price: "₹0 Upfront", desc: "Pay 10% of salary for 18 months only after you land a job (min ₹5K/mo)." }
    ],
    scholarships: [
      "Women in Tech: 20% off",
      "Tier-2/3 City Students: 20% off",
      "Referral Bonus: Refer a friend, both get 15% off"
    ]
  },

  faqs: [
    {
      q: "I have zero coding experience. Can I really do this?",
      a: "Yes. 40% of our current cohort started with zero experience. The first 2 weeks are foundational. By week 3, you're building real projects. What matters isn't where you start—it's your commitment. If you can dedicate 30-40 hours/week for 12 weeks, you'll graduate job-ready."
    },
    {
      q: "Is 12 weeks enough to learn full-stack development?",
      a: "It's enough to become dangerous, not everything. Here's the honest answer: You'll build 15+ real projects, understand core concepts deeply, and have a portfolio that gets interviews. After you get hired, you'll spend years mastering advanced patterns. Our job is to get you to the starting line."
    },
    {
      q: "How much does it cost?",
      a: "₹99,999 for the full 12-week program (paid upfront) or ₹35,000 × 3 months. We offer scholarships for women and students from tier-2/3 cities (20% off). If you don't land a job within 3 months, 50% refund."
    },
    {
      q: "Will I get a job guarantee?",
      a: "We don't guarantee jobs. We guarantee job readiness. By the end, you'll have 15+ production projects, mock interview practice, and direct introductions to 100+ companies. 87% of graduates land jobs within 6 weeks. If you don't get an offer within 3 months, we refund 50% of your tuition."
    },
    {
      q: "What if I have a job and limited time?",
      a: "This program requires 30-40 hours/week. If you're working full-time, you can take 18 weeks instead (same price, half-pace). But honestly, most working professionals struggle unless they are highly disciplined. We recommend taking a month off or switching to a part-time role."
    },
    {
      q: "What's the schedule?",
      a: "Monday-Friday: 6 PM - 8 PM live sessions (optional but recommended). Self-paced projects during the day (you control when/how). Weekend 1:1 mentorship (book your slot). It's not a rigid bootcamp—it's structured flexibility."
    },
    {
      q: "What if I'm not good at coding?",
      a: "'Good at coding' is subjective. What matters is persistence. Your mentor will keep pushing until you understand. We track progress weekly. If you're falling behind, we add extra support sessions at no extra cost."
    },
    {
      q: "What's the success rate for freshers vs experienced people?",
      a: "Freshers: 89% placement rate, 6-week average time to job. Career Switchers: 82%, 7-week average. Already Working: 75%, 8-week average (because working people sometimes search less aggressively)."
    },
    {
      q: "Do I get a certificate?",
      a: "Two certificates: 1. Training Completion: Proves you completed a rigorous mentor-led program. 2. Internship Experience: Proof of 4 weeks real-project work under mentor guidance. Both are LinkedIn-worthy and company-recognized."
    },
    {
      q: "What tech stack will I learn?",
      a: "MERN (MongoDB, Express, React, Node.js) with modern tools like Tailwind and Vercel. We choose these because React has 43% market share and Node.js is the most flexible backend."
    },
    {
      q: "Can I learn different tech (Python, Django, etc.)?",
      a: "This program is specifically React/Node.js. If you want a different stack, talk to us. We might customize (costs extra, slower timeline), but MERN is our flagship."
    },
    {
      q: "What if I don't like my mentor?",
      a: "You can switch mentors for free once. We want you working with someone whose style clicks with you."
    },
    {
      q: "Is this program beginner-friendly?",
      a: "Yes, with a caveat. 'Beginner-friendly' doesn't mean 'easy.' We don't assume prior knowledge, but we expect hard work. The drop-out rate is 8% (people who quit mid-program)."
    },
    {
      q: "Can international students join?",
      a: "Yes, for ₹150,000 (higher because of timezone coordination). Only accepting 2-3 international students per cohort. Sessions are recorded for asynchronous viewing."
    }
  ]
};
