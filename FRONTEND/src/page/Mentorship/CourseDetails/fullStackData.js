import { 
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight
} from "react-icons/fa";

export const fullStackData = {
  id: "fullstack",
  title: "Full Stack Web Development",
  duration: "3 Months",
  format: "Live Mentor-led",
  level: "Beginner to Pro",
  enrolled: "2,298+ Students",
  rating: 4.7,
  mentor: {
    name: "Sachin Kumar",
    role: "Senior Full Stack Engineer",
    experience: "6+ Years",
    bio: "Expert in MERN stack development and cloud architecture. Sachin has mentored 1000+ students and helped them transition into high-paying tech roles.",
  },
  outcomes: [
    { title: "Frontend Mastery", desc: "Build highly interactive UIs using React, Redux, and modern CSS frameworks.", icon: FaCode },
    { title: "Backend Architecture", desc: "Design scalable server-side logic using Node.js and Express.js.", icon: FaServer },
    { title: "Database Management", desc: "Master SQL and NoSQL databases like MongoDB for efficient data storage.", icon: FaDatabase },
    { title: "Deployment & DevOps", desc: "Learn to deploy applications on AWS/Vercel and manage CI/CD pipelines.", icon: FaRocket },
  ],
  tools: [
    { name: "React.js" }, { name: "Node.js" }, { name: "Express" }, 
    { name: "MongoDB" }, { name: "Redux" }, { name: "Tailwind" },
    { name: "AWS" }, { name: "Git/GitHub" }, { name: "Postman" }
  ],
  curriculum: [
    {
      module: "Module 1",
      title: "Web Foundations & UI",
      topics: ["HTML5 & Semantic Tags", "CSS3 Flexbox & Grid", "Advanced JavaScript (ES6+)", "Responsive Design Principles"]
    },
    {
      module: "Module 2",
      title: "React Frontend Mastery",
      topics: ["React Components & Props", "State Management (Hooks)", "Client-side Routing", "API Integration with Axios"]
    },
    {
      module: "Module 3",
      title: "Backend Development",
      topics: ["Node.js Runtime", "Express.js Framework", "RESTful API Design", "Authentication (JWT & OAuth)"]
    },
    {
      module: "Module 4",
      title: "Database & Data Modeling",
      topics: ["NoSQL with MongoDB", "Mongoose Schemas", "CRUD Operations", "Aggregation Pipelines"]
    },
    {
      module: "Module 5",
      title: "Deployment & Security",
      topics: ["Environment Variables", "CORS & Security Headers", "Vercel/Render Deployment", "Basic DevOps Workflow"]
    },
    {
      module: "Module 6",
      title: "Capstone Project",
      topics: ["Requirement Analysis", "Full Stack Implementation", "Code Reviews & Optimization", "Deployment & Portfolio Live"]
    }
  ],
  projects: [
    {
      title: "E-commerce Ecosystem",
      desc: "A full-featured store with payment integration, admin dashboard, and real-time inventory.",
      tech: ["React", "Node", "MongoDB", "Stripe"],
      impact: "Mastered complex state management and payment flows."
    },
    {
      title: "Collaborative Task Manager",
      desc: "Real-time project management tool with drag-and-drop and team collaboration features.",
      tech: ["Socket.io", "React", "Express"],
      impact: "Implemented real-time bi-directional communication."
    }
  ],
  faqs: [
    { q: "Do I need prior coding experience?", a: "No, this program starts from the very basics of web development. We've designed it to take you from a beginner to a job-ready developer." },
    { q: "Will I build real-world projects?", a: "Yes, you will build 5+ projects including a complete MERN stack E-commerce application and a Social Media dashboard." },
    { q: "What kind of mentor support is included?", a: "You get 1:1 doubt-clearing sessions, weekly live classes, and project reviews from industry experts." },
    { q: "Is internship support included?", a: "Yes, Krutanic provides exclusive access to internship opportunities with over 100+ hiring partners after successful program completion." },
    { q: "What happens if I miss a live session?", a: "All live sessions are recorded and made available on your learning dashboard for later viewing." }
  ],
  careerPaths: {
    title: "Career Paths After the Program",
    subtitle: "Build skills that map to real developer roles across frontend, backend, full stack, and internship pathways. Your career trajectory depends on your project quality, consistency, and portfolio strength.",
    roles: [
      {
        title: "Frontend Developer",
        desc: "Build responsive and interactive user interfaces using modern JavaScript and React.",
        tools: ["HTML", "CSS", "JavaScript", "React", "API integration"],
        level: "Entry-level"
      },
      {
        title: "Backend Developer",
        desc: "Work on server-side logic, APIs, authentication, and database-connected features.",
        tools: ["Node.js", "Express.js", "MongoDB", "JWT", "REST APIs"],
        level: "Entry-level"
      },
      {
        title: "Full Stack Developer",
        desc: "Build complete applications from UI to backend and deployment.",
        tools: ["React", "Node.js", "Express", "MongoDB", "Git", "Deployment"],
        level: "Growth role"
      },
      {
        title: "MERN Stack Developer",
        desc: "Build modern JavaScript-based applications for startup and product environments.",
        tools: ["MongoDB", "Express", "React", "Node.js"],
        level: "Growth role"
      },
      {
        title: "Web Application Developer",
        desc: "Develop business platforms, dashboards, portals, and admin systems.",
        tools: ["React", "APIs", "Databases", "Auth workflows"],
        level: "Professional"
      },
      {
        title: "Software Development Intern",
        desc: "Gain industry experience and strengthen your portfolio through trainee opportunities.",
        tools: ["Project work", "GitHub", "Mentor reviews", "Deployment"],
        level: "Internship path"
      }
    ],
    progression: ["Junior Full Stack Engineer", "Product Engineer", "Software Engineer", "Startup Developer", "Freelance Web Developer"]
  }
};
