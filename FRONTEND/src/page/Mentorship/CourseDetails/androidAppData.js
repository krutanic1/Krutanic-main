import { 
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight
} from "react-icons/fa";

export const androidAppData = {
  id: "androidapp",
  title: "Android App Development",
  duration: "3 Months",
  format: "Live Mentor-led",
  level: "Beginner to Pro",
  enrolled: "15,000+ Mentees",
  rating: 4.8,
  mentor: {
    name: "Lead Android Mentor",
    role: "Senior Android Developer",
    experience: "10+ Years",
    bio: "Industry expert with over 10 years of experience building and deploying robust Android applications for top tech companies.",
  },
  outcomes: [
    { title: "Kotlin Mastery", desc: "Build high-performance applications using Kotlin, the official language for Android development.", icon: FaCode },
    { title: "UI/UX Design", desc: "Design intuitive and beautiful user interfaces using XML and Material Design principles.", icon: FaMobileAlt },
    { title: "Data Management", desc: "Master local storage with SQLite/Room and cloud integration with Firebase.", icon: FaDatabase },
    { title: "API Integration", desc: "Connect your apps to the world by integrating RESTful APIs using Retrofit.", icon: FaServer },
  ],
  tools: [
    { name: "Kotlin" }, { name: "Android Studio" }, { name: "Firebase" }, 
    { name: "SQLite/Room" }, { name: "Retrofit" }, { name: "JUnit/Espresso" }
  ],
  curriculum: [
    {
      module: "Module 1",
      title: "Introduction & Kotlin Basics",
      topics: ["Overview of Android OS architecture", "Android Studio structure & app components", "Kotlin syntax, variables, data types, functions", "OOP concepts: classes, inheritance, interfaces"]
    },
    {
      module: "Module 2",
      title: "Android Studio & Emulator Setup",
      topics: ["Installing & configuring Android Studio", "Creating and running projects", "Setting up Android Virtual Device (AVD)", "Running apps on physical devices"]
    },
    {
      module: "Module 3",
      title: "UI Design with XML",
      topics: ["Basics of Views and View Groups", "Layout types: Linear, Relative, Constraint", "Material Design principles for UI/UX", "Styling and themes"]
    },
    {
      module: "Module 4",
      title: "Activities, Intents & Navigation",
      topics: ["Activity lifecycle and states", "Explicit and implicit intents", "Fragment lifecycle and usage", "Bottom Navigation and Navigation Drawer"]
    },
    {
      module: "Module 5",
      title: "Data Storage & APIs",
      topics: ["Shared Preferences & SQLite basics", "Room persistence library", "RESTful APIs & Retrofit for network requests", "JSON parsing and data binding"]
    },
    {
      module: "Module 6",
      title: "Firebase & Advanced UI",
      topics: ["Firebase Auth, Database & Cloud Messaging", "RecyclerView and Adapters", "Custom UI components & animations", "Testing with JUnit & Espresso"]
    }
  ],
  projects: [
    {
      title: "Real-time Chat Application",
      desc: "A fully functional messaging app using Firebase for real-time data sync and authentication.",
      tech: ["Kotlin", "Firebase Auth", "Realtime Database"],
      impact: "Mastered cloud integration and real-time user communication."
    },
    {
      title: "E-Commerce Mobile App",
      desc: "A comprehensive shopping app with product listings, cart management, and local database caching.",
      tech: ["Kotlin", "Retrofit", "Room", "Material Design"],
      impact: "Implemented advanced UI components and robust data persistence."
    }
  ],
  faqs: [
    { q: "Do I need prior coding experience?", a: "No, this program starts from the basics of programming with Kotlin and gradually builds up to advanced Android concepts." },
    { q: "Will I build real-world projects?", a: "Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio." },
    { q: "What kind of mentor support is included?", a: "Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects." },
    { q: "Is internship support included?", a: "Yes, you gain access to an internship program with opportunities across 200+ hiring partners." },
    { q: "What happens if I miss a live session?", a: "Recordings of all live sessions are available with 1-year access in our LMS portal." }
  ],
  careerPaths: {
    title: "Career Paths After the Program",
    subtitle: "Android powers over 70% of global smartphones. Build skills that map to high-demand developer roles across startups and enterprises.",
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
        title: "Freelance Android Developer",
        desc: "Work independently on custom Android app projects for clients and startups.",
        tools: ["Kotlin", "Firebase", "Client Management"],
        level: "Independent"
      },
      {
        title: "Firebase Developer",
        desc: "Specialize in integrating Firebase services like Authentication, Database, and Cloud Messaging.",
        tools: ["Firebase Auth", "Realtime Database", "FCM"],
        level: "Specialist"
      },
      {
        title: "Mobile App Tester (QA)",
        desc: "Test Android applications for usability, performance, and bugs to ensure quality.",
        tools: ["JUnit", "Espresso", "Debugging tools"],
        level: "Quality Assurance"
      },
      {
        title: "Full Stack Mobile Developer",
        desc: "Combine Android front-end development with backend services and APIs.",
        tools: ["Kotlin", "Node.js/Python", "Databases"],
        level: "Professional"
      }
    ],
    progression: ["Junior Android Developer", "Mobile Engineer", "Senior Android Developer", "Tech Lead (Mobile)", "Mobile Architect"]
  }
};
