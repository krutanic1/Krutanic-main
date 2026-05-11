import { 
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight
} from "react-icons/fa";

export const androidAppData = {
  id: "android-app-development",
  title: "Android App Development",
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
  whyTitle: "Why Android App Development?",
  whyPoints: [
    "Android powers over 70% of global smartphones, ensuring a massive user base.",
    "High demand across startups and enterprises creates abundant job opportunities.",
    "Being open-source, Android allows full customization and flexibility in app development.",
    "Tools like Android Studio, Kotlin, and Firebase streamline robust app creation.",
    "Android apps are essential in booming sectors like fintech, healthcare, and education.",
    "Offers excellent career growth with full-time, freelance, and global work options."
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
    "Introduction to Android",
    "Kotlin Programming Basics",
    "Android Studio and Emulator Setup",
    "Activities and Intents",
    "Navigation and Fragments",
    "Networking and APIs",
    "Advanced UI and Animations",
    "App Testing and Debugging",
    "UI Design with XML",
    "Data Storage in Android",
    "Firebase Integration",
    "Capstone Project and Interview Preparation"
  ],
  mentor: {
    name: "Deepak Kumar",
    role: "Mobile App Development",
    experience: "10+ Years",
    bio: "Industry expert with over 10 years of experience building and deploying robust Android applications for top tech companies.",
  },
  mentorImage: "/src/assets/mentors/deepak.jpg",
  outcomes: [
    { title: "Kotlin Mastery", desc: "Master Kotlin syntax including variables, data types, functions, OOP concepts, and control flow for robust Android development.", icon: FaCode },
    { title: "UI/UX Design", desc: "Design intuitive interfaces using XML, Layout types, and Material Design principles for user-friendly apps.", icon: FaMobileAlt },
    { title: "Data Management", desc: "Master Shared Preferences, SQLite, Room persistence library, and Firebase for comprehensive data handling.", icon: FaDatabase },
    { title: "API Integration & Testing", desc: "Integrate RESTful APIs using Retrofit, implement Firebase services, and test with JUnit and Espresso frameworks.", icon: FaShieldAlt },
  ],
  tools: [
    { name: "Kotlin" },
    { name: "Android Studio" },
    { name: "Firebase" },
    { name: "SQLite / Room" },
    { name: "Retrofit" },
    { name: "JUnit / Espresso" }
  ],
  curriculum: [
    {
      module: "Module 1",
      title: "Introduction to Android",
      topics: ["Overview of Android OS architecture", "Android Studio structure and files", "Understanding Android app components (Activities, Services, Broadcast Receivers, Content Providers)"]
    },
    {
      module: "Module 2",
      title: "Kotlin Programming Basics",
      topics: ["Kotlin syntax: variables, data types, and functions", "Control flow: conditionals and loops", "OOP concepts: classes, objects, inheritance, interfaces in Kotlin"]
    },
    {
      module: "Module 3",
      title: "Android Studio and Emulator Setup",
      topics: ["Installing and configuring Android Studio IDE", "Creating and running projects", "Setting up Android Virtual Device (AVD) emulator", "Running apps on physical devices"]
    },
    {
      module: "Module 4",
      title: "UI Design with XML",
      topics: ["Basics of Views and View Groups", "Layout types: Linear Layout, Relative Layout, Constraint Layout", "Using Material Design principles for UI/UX", "Styling and themes"]
    },
    {
      module: "Module 5",
      title: "Activities and Intents",
      topics: ["Activity lifecycle and states", "Creating and managing multiple activities", "Using explicit and implicit intents for navigation and data passing"]
    },
    {
      module: "Module 6",
      title: "Navigation and Fragments",
      topics: ["Fragment lifecycle and usage", "Implementing navigation components", "Using Bottom Navigation and Navigation Drawer"]
    },
    {
      module: "Module 7",
      title: "Data Storage in Android",
      topics: ["Shared Preferences for key-value storage", "SQLite database basics", "Room persistence library for database abstraction"]
    },
    {
      module: "Module 8",
      title: "Networking and APIs",
      topics: ["Introduction to RESTful APIs", "Using Retrofit for network requests", "JSON parsing and data binding"]
    },
    {
      module: "Module 9",
      title: "Firebase Integration",
      topics: ["Firebase Authentication setup", "Real-time Database usage", "Cloud Messaging for push notifications"]
    },
    {
      module: "Module 10",
      title: "Advanced UI and Animations",
      topics: ["RecyclerView and Adapters for lists", "Creating custom UI components", "Implementing animations and transitions"]
    },
    {
      module: "Module 11",
      title: "App Testing and Debugging",
      topics: ["Debugging using Android Studio tools", "Unit testing with JUnit", "UI testing with Espresso framework"]
    },
    {
      module: "Module 12",
      title: "Capstone Project and Interview Preparation",
      topics: ["Building a complete Android app from scratch", "Portfolio and resume development", "Mock interviews and technical quizzes"]
    }
  ],
  projects: [
    {
      title: "Minor Industrial Project",
      desc: "A guided project where you build a complete Android application with UI, data storage, and API integration under mentor supervision.",
      tech: ["Kotlin", "Android Studio", "SQLite", "Retrofit"],
      impact: "Strong understanding of end-to-end Android project architecture in a mentor-led setup."
    },
    {
      title: "Major Industrial Project",
      desc: "A production-style Android application with Firebase integration, advanced UI components, and comprehensive testing.",
      tech: ["Kotlin", "Firebase", "RecyclerView", "JUnit/Espresso"],
      impact: "Portfolio-ready major project showcasing ownership, scalability, and delivery readiness."
    },
    {
      title: "Capstone Project",
      desc: "A comprehensive end-to-end Android application integrating all learned concepts: complex UI/UX, backend services, data persistence, and advanced features like push notifications and analytics.",
      tech: ["Kotlin", "Firebase", "Jetpack Components", "Cloud Integration"],
      impact: "Demonstrates mastery of Android development with a production-ready app, portfolio validation, and app store publication readiness."
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
      name: "Paidi Venkata",
      text: "Certificate of Training Completion from Krutanic Solutions in the field of Android App Development. Incredible hands-on learning experience with expert mentors.",
      detail: "#krutanic #android #app #development #androidstudio"
    },
    {
      name: "Ramshad K",
      text: "I have gained really hands-on experience with Android development which was delivered excellently. Akash sir was very supportive and an endless worthy experience.",
      detail: "Perfect for anyone looking to master Android development."
    },
    {
      name: "Sahad K",
      text: "Got placement at Wipro through Krutanic support team. I am really grateful that I got to learn from excellent mentors. Support from my counsellor was really helpful.",
      detail: "All thanks to Bhoomika mam and the entire Krutanic team."
    },
    {
      name: "Aman Nema",
      text: "Krutanic's training program was fantastic. The course covered essential Android technologies, practical projects, and expert guidance from mentors.",
      detail: "Highly recommended for beginners and aspiring Android developers."
    }
  ],
  certifications: [
    "Training Completion Certificate validating acquired Android development skills",
    "Internship Completion Certificate certified by Adobe",
    "Letter of Recommendation for job and placement",
    "Certificate of Excellence based on performance"
  ],
  faqs: [
    { q: "Do I need prior coding experience?", a: "No, this program starts from the basics of programming with Kotlin and gradually builds up to advanced Android concepts." },
    { q: "Will I build real-world projects?", a: "Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio." },
    { q: "What kind of mentor support is included?", a: "Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects." },
    { q: "Is internship support included?", a: "Yes, you gain access to an internship program with opportunities across 200+ hiring partners." },
    { q: "What happens if I miss a live session?", a: "Recordings of all live sessions are available with 1-year access in our LMS portal." }
  ],
  careerPaths: {
    title: "Career Opportunities in Android App Development",
    subtitle: "Build skills that map to high-demand mobile developer roles across startups, enterprises, and freelance platforms.",
    roles: [
      {
        title: "Android App Developer",
        desc: "Design, build, and maintain native Android applications using Kotlin or Java.",
        tools: ["Kotlin", "Android Studio", "APIs"],
        level: "Entry-level"
      },
      {
        title: "Mobile UI/UX Developer",
        desc: "Focus on creating user-friendly and visually appealing interfaces for Android apps.",
        tools: ["XML", "Material Design", "Figma/Adobe"],
        level: "Specialist"
      },
      {
        title: "DevOps Engineer",
        desc: "Manage deployment, CI/CD pipelines, and infrastructure automation for mobile app deployment.",
        tools: ["GitHub Actions", "Firebase Deploy", "Monitoring"],
        level: "Growth role"
      },
      {
        title: "Firebase Developer",
        desc: "Specialize in integrating Firebase services like Authentication, Database, and Cloud Messaging into Android apps.",
        tools: ["Firebase Auth", "Realtime Database", "FCM"],
        level: "Specialist"
      },
      {
        title: "Mobile App Tester (QA)",
        desc: "Test Android applications for usability, performance, and bugs to ensure quality standards.",
        tools: ["JUnit", "Espresso", "Debugging tools"],
        level: "Quality Assurance"
      },
      {
        title: "Full Stack Mobile Developer",
        desc: "Combine Android front-end development with backend services and APIs for complete solutions.",
        tools: ["Kotlin", "Node.js/Python", "Databases"],
        level: "Professional"
      }
    ],
    progression: ["Junior Android Developer", "Mobile Engineer", "Senior Android Developer", "Tech Lead (Mobile)", "Mobile Architect"]
  }
};
