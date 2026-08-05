import { 
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight
} from "react-icons/fa";

export const fullStackData = {
  id: "full-stack-web-development",
  title: "Full Stack Web Development",
  duration: "2/3 Months",
  format: "Live Mentor-led",
  level: "Beginner to Pro",
  enrolled: "15,000+ Mentees Trained",
  rating: 4.85,
  pitch: "Transform your passion into a successful career in tech with mentor-led training, internship support, and real project execution.",
  providerNote: "We are now an accredited partner under Krutanic.",
  contactInfo: ["www.krutanic.com", "support@krutanic.com"],
  aboutTitle: "About Us",
  aboutDescription: "Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow's world.",
  whyTitle: "Why Full Stack Development?",
  whyPoints: [
    "Full stack developers are proficient in both frontend and backend, making them versatile assets to any tech team.",
    "They can independently build complete web applications from scratch, ensuring faster development cycles.",
    "High demand across startups, tech companies, and freelancing platforms due to their broad skill set.",
    "Mastery over the entire tech stack allows better project ownership and problem-solving capabilities.",
    "Opens doors to various roles like frontend, backend, DevOps, and architectural positions.",
    "Full stack development offers continuous learning with evolving tools like React, Node.js, Docker, and CI/CD."
  ],
  trainingProgram: [
    {
      phase: "Month 1",
      title: "Training and Internship Program",
      items: [
        "Live sessions with industrial experts having experience above 10 years in the industry.",
        "Recordings of all live sessions available with 1 year access in our LMS portal.",
        "Industry-related curriculum designed by working professionals in top hierarchy."
      ]
    },
    {
      phase: "Month 2",
      title: "Training and Internship Program",
      items: [
        "Two real-time industrial projects: one minor project and one major project.",
        "All mentors are assigned as project leads and guide interns until project completion.",
        "Additional projects for personal development when required."
      ]
    }
  ],
  moduleOverview: [
    "HTML and CSS Fundamentals",
    "JavaScript Programming",
    "Frontend Framework - React.js",
    "Backend Basics - Node.js and Express.js",
    "Database Integration (MongoDB)",
    "Deployment and Hosting",
    "DevOps Basics for Developers",
    "Advanced React and State Management",
    "Version Control with Git and GitHub",
    "Authentication and Authorization",
    "RESTful API Practices",
    "Capstone Project and Interview Preparation"
  ],
  mentor: {
    name: "Sachin Kumar",
    role: "Senior Full Stack Engineer",
    experience: "6+ Years",
    bio: "Expert in MERN stack development and cloud architecture. Sachin has mentored 1000+ students and helped them transition into high-paying tech roles.",
  },
  mentorImage: "/src/assets/mentors/sachin.jpg",
  outcomes: [
    { title: "Frontend Mastery", desc: "Build reusable components using JSX, manage state and props effectively, and implement routing with React Router.", icon: FaCode },
    { title: "Backend Architecture", desc: "Set up Node.js servers, create RESTful APIs using Express routes, and apply middleware for robust backend workflows.", icon: FaServer },
    { title: "Database Integration", desc: "Understand NoSQL concepts, perform CRUD operations with MongoDB, and connect Express backend using Mongoose.", icon: FaDatabase },
    { title: "Security and Deployments", desc: "Implement authentication, route protection, and deploy full stack apps using modern hosting and CI/CD flows.", icon: FaShieldAlt },
  ],
  tools: [
    { name: "React.js" },
    { name: "Node.js and Express.js" },
    { name: "MongoDB and Mongoose" },
    { name: "Postman" },
    { name: "GitHub" },
    { name: "Vercel" }
  ],
  curriculum: [
    {
      module: "Module 1",
      title: "HTML and CSS Fundamentals",
      topics: ["Structure web pages using semantic HTML tags", "Style with CSS: colors, fonts, spacing, Flexbox and Grid", "Make websites responsive using media queries", "Build basic page layouts and forms"]
    },
    {
      module: "Module 2",
      title: "JavaScript Programming",
      topics: ["Learn variables, data types, and operators", "Use functions, loops, and conditional statements", "Manipulate the DOM dynamically", "Handle user inputs and form validations"]
    },
    {
      module: "Module 3",
      title: "Frontend Framework - React.js",
      topics: ["Build reusable components using JSX", "Manage state and props effectively", "Implement routing using React Router", "Create scalable component-based UI architecture"]
    },
    {
      module: "Module 4",
      title: "Version Control with Git and GitHub",
      topics: ["Initialize Git repositories and commit changes", "Work with branches and resolve merge conflicts", "Push and pull code to and from GitHub", "Collaborate using pull requests and issues"]
    },
    {
      module: "Module 5",
      title: "Backend Basics - Node.js and Express.js",
      topics: ["Set up Node.js and build a basic server", "Create RESTful APIs using Express routes", "Use middleware for logging and error handling", "Serve frontend with Express"]
    },
    {
      module: "Module 6",
      title: "Database Integration (MongoDB)",
      topics: ["Understand NoSQL database concepts", "Perform CRUD operations with MongoDB", "Use Mongoose for schema and model creation", "Connect Express backend to the database"]
    },
    {
      module: "Module 7",
      title: "Deployment and Hosting",
      topics: ["Deploy frontend on Vercel or Netlify", "Deploy backend on Heroku or Render", "Use environment variables and env files", "Monitor live app performance and logs"]
    },
    {
      module: "Module 8",
      title: "Authentication and Authorization",
      topics: ["Implement login and registration features", "Secure routes using JWT or sessions", "Store passwords securely using bcrypt", "Set up role-based access controls"]
    },
    {
      module: "Module 9",
      title: "RESTful API Practices",
      topics: ["Structure REST APIs using best practices", "Test endpoints using Postman", "Handle status codes, errors, and validation", "Follow modular coding structure for scalability"]
    },
    {
      module: "Module 10",
      title: "Advanced React and State Management",
      topics: ["Manage global state using Context API or Redux", "Handle complex UI state and async data flow", "Optimize performance with memoization and lazy loading", "Use Redux DevTools and middleware like thunk"]
    },
    {
      module: "Module 11",
      title: "DevOps Basics for Developers",
      topics: ["Understand CI/CD workflows and pipelines", "Automate deployments using GitHub Actions", "Introduction to Docker for containerization", "Manage code in a team-friendly DevOps environment"]
    },
    {
      module: "Module 12",
      title: "Capstone Project and Interview Preparation",
      topics: ["Build and deploy a complete MERN project", "Showcase work via GitHub and portfolio", "Practice coding questions and mock interviews", "Placement assistance focused preparation"]
    }
  ],
  projects: [
    {
      title: "Minor Industrial Project",
      desc: "A guided project where you build a complete application flow from frontend screens to backend APIs.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      impact: "Strong understanding of end-to-end project architecture in a mentor-led setup."
    },
    {
      title: "Major Industrial Project",
      desc: "A real-time production-style application designed with role-based workflows, API integrations, and deployment.",
      tech: ["MERN Stack", "GitHub", "Postman", "Vercel"],
      impact: "Portfolio-ready major project showcasing ownership, scalability, and delivery readiness."
    },
    {
      title: "Capstone Project",
      desc: "A comprehensive end-to-end project integrating all learned concepts: advanced frontend interactions, robust backend APIs, database optimization, and cloud deployment.",
      tech: ["MERN Stack", "Cloud Deployment", "CI/CD Pipeline"],
      impact: "Demonstrates mastery of full-stack development with production-ready code, portfolio validation, and job-ready credentials."
    }
  ],
  milestones: [
    { label: "Google Ratings", value: "4.8/5" },
    { label: "Global Market Size", value: "USD 200 Billion" },
    { label: "Hiring Partners", value: "200+" },
    { label: "Job Openings", value: "25,000+" },
    { label: "Average Salary", value: "10+ LPA" },
    { label: "Mentees Trained", value: "15k+" }
  ],
  studentReviews: [
    {
      name: "Aman Nema",
      text: "Krutanic's Full Stack Web Development program was a fantastic learning experience. The course covered HTML, CSS, JavaScript, React, and backend development with practical projects and mentor guidance.",
      detail: "Perfect for beginners and aspiring developers looking to enhance web development skills."
    },
    {
      name: "Himendra Shukla",
      text: "Completing my internship at Krutanic was transformative. It gave me hands-on experience in Full Stack Web Development and prepared me for a strong career path.",
      detail: "Grateful for the real-world projects, guidance, and skill-building journey."
    },
    {
      name: "Rajendra Prasad",
      text: "I verified the certificate and found it genuine. Krutanic provides quality training and practical project exposure.",
      detail: "Highly recommended for learners looking for authentic and industry-aligned programs."
    },
    {
      name: "Sunil Kumar",
      text: "My learning experience at Krutanic was outstanding and strongly focused on practical outcomes.",
      detail: "Great support from mentors and operations team throughout the training journey."
    },
    {
      name: "Priya Sharma",
      text: "The MERN stack curriculum was perfectly structured. We built an e-commerce platform from scratch, which gave me immense confidence in my abilities.",
      detail: "Placed at Infosys as a Software Engineer."
    },
    {
      name: "Rohan Gupta",
      text: "The mentors are incredibly knowledgeable and always available. The live sessions felt just like an offline classroom but with the comfort of home.",
      detail: "Now working as a Freelance Full Stack Developer."
    },
    {
      name: "Anjali Verma",
      text: "I loved the focus on real-world projects. Learning React and Node.js through hands-on application was much better than just watching tutorials.",
      detail: "Placed at TCS after completing the internship."
    },
    {
      name: "Vikram Singh",
      text: "Krutanic’s doubt support is unparalleled. Whenever I got stuck with a complex MongoDB query, the support team helped me within minutes.",
      detail: "Backend Developer specializing in Node.js."
    },
    {
      name: "Neha Desai",
      text: "The internship phase was the highlight for me. Getting to work on an actual industry project made my resume stand out to recruiters.",
      detail: "Placed at Wipro with a great package."
    },
    {
      name: "Arjun Reddy",
      text: "Transitioning from a non-CS background was tough, but the mentors broke down complex JavaScript concepts into easily digestible lessons.",
      detail: "Successfully transitioned to a Junior SDE role."
    },
    {
      name: "Sneha Patel",
      text: "The mock interviews and resume building sessions provided at the end of the course were exactly what I needed to land my first tech job.",
      detail: "Frontend Developer at a fast-growing startup."
    },
    {
      name: "Karan Malhotra",
      text: "I gained deep insights into building scalable REST APIs. The architecture patterns taught here are exactly what top tech companies use.",
      detail: "System Analyst and Backend Enthusiast."
    },
    {
      name: "Divya Krishnan",
      text: "What I appreciate most is the modern tech stack. We didn't learn outdated tech; everything was up to date with the latest industry standards.",
      detail: "Placed at Tech Mahindra."
    },
    {
      name: "Rahul Mehta",
      text: "The community of learners is amazing. Collaborating on the major project with my peers taught me a lot about Git and agile development.",
      detail: "Full Stack Developer looking to build scalable apps."
    },
    {
      name: "Pooja Joshi",
      text: "The personalized feedback on my code submissions helped me write cleaner, more efficient code. My mentor genuinely cared about my progress.",
      detail: "SDE-1 at Capgemini."
    },
    {
      name: "Amit Kumar",
      text: "From UI/UX basics to database optimization, this course covers everything. It truly transforms you into a complete full-stack developer.",
      detail: "Web Developer running my own agency."
    },
    {
      name: "Kavita Rao",
      text: "I highly recommend Krutanic to anyone serious about coding. The rigour of the program ensures you are industry-ready from day one.",
      detail: "Placed at Cognizant."
    },
    {
      name: "Sandeep Yadav",
      text: "The best investment I've made in my career. The projects I built during this course are now the highlight of my professional portfolio.",
      detail: "Freelance Developer serving international clients."
    },
    {
      name: "Meera Nair",
      text: "Learning how to integrate third-party APIs and handle authentication securely was my favorite part. The practical approach is brilliant.",
      detail: "React Developer at a Fintech firm."
    },
    {
      name: "Gaurav Chawla",
      text: "The instructors explain the 'why' behind the code, not just the 'how'. This deeper understanding made debugging so much easier for me.",
      detail: "Software Engineer focusing on Web Technologies."
    },
    {
      name: "Isha Kapoor",
      text: "The course pace was perfect. It started with the basics and smoothly ramped up to advanced topics like Redux and JWT authentication.",
      detail: "Placed at HCL Technologies."
    },
    {
      name: "Manoj Tiwari",
      text: "I was struggling to learn on my own, but the structured curriculum and strict deadlines kept me accountable and focused.",
      detail: "Full Stack Intern securing a pre-placement offer."
    },
    {
      name: "Ritu Agarwal",
      text: "Getting certified by Krutanic added significant value to my LinkedIn profile. Recruiters actually reached out to me after I updated it.",
      detail: "SDE at an EdTech Startup."
    },
    {
      name: "Aditya Sen",
      text: "Excellent program with top-notch mentors. The 24/7 support means you never waste time being stuck on a silly bug.",
      detail: "Backend Engineer in a Product company."
    }
  ],
  certifications: [
    "Training Completion Certificate validating acquired skills",
    "Internship Completion Certificate certified by Adobe",
    "Letter of Recommendation for job and placement",
    "Certificate of Excellence based on performance"
  ],
  faqs: [
    { q: "Do I need prior coding experience?", a: "No, this program starts from the very basics of web development. We've designed it to take you from a beginner to a job-ready developer." },
    { q: "Will I build real-world projects?", a: "Yes. You will work on two real-time industrial projects, including one minor and one major implementation with mentor guidance." },
    { q: "What kind of mentor support is included?", a: "You get 1:1 doubt-clearing sessions, weekly live classes, and project reviews from industry experts." },
    { q: "Is internship support included?", a: "Yes, Krutanic provides internship support and project-based mentorship aligned with industry requirements." },
    { q: "What happens if I miss a live session?", a: "All live sessions are recorded and made available on your learning dashboard for later viewing." }
  ],
  careerPaths: {
    title: "Career Opportunities in Full Stack Development",
    subtitle: "Build skills that map to real developer roles across frontend, backend, full stack, DevOps, architecture, and mobile development.",
    roles: [
      {
        title: "Full Stack Developer",
        desc: "Build and maintain both frontend and backend of web applications while ensuring seamless integration.",
        tools: ["React", "Node.js", "Express", "MongoDB"],
        level: "Entry-level"
      },
      {
        title: "Frontend Developer",
        desc: "Focus on creating interactive and user-friendly interfaces using technologies like React or Angular.",
        tools: ["React", "UI state management", "Routing", "Responsive UI"],
        level: "Entry-level"
      },
      {
        title: "DevOps Engineer",
        desc: "Manage deployments, CI/CD pipelines, and infrastructure automation to streamline development workflows.",
        tools: ["GitHub Actions", "Docker", "Cloud deployments", "Monitoring"],
        level: "Growth role"
      },
      {
        title: "Technical Lead / Architect",
        desc: "Oversee technical decisions, system architecture, and guide development teams through projects.",
        tools: ["System design", "Code quality", "Scalability", "Architecture reviews"],
        level: "Growth role"
      },
      {
        title: "Backend Developer",
        desc: "Develop server-side logic, APIs, and database interactions using Node.js, Express, or similar frameworks.",
        tools: ["Node.js", "Express", "MongoDB", "REST APIs"],
        level: "Professional"
      },
      {
        title: "Mobile App Developer (React Native)",
        desc: "Build cross-platform mobile applications using React Native and transferable web development skills.",
        tools: ["React Native", "API integration", "State management", "Deployment"],
        level: "Internship path"
      }
    ],
    progression: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Technical Architect"]
  }
};
