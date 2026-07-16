import { 
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight,
  FaMicrochip, FaRobot, FaWifi, FaTools
} from "react-icons/fa";

export const embeddedSystemsData = {
  id: "embedded-systems",
  title: "Embedded Systems",
  duration: "2/3 Months",
  format: "Live Mentor-led",
  level: "Beginner to Pro",
  enrolled: "15,000+ Mentees Trained",
  rating: 4.85,
  pitch: "Transform Your Passion into A Successful Career In Tech with Embedded Systems.",
  providerNote: "We are now an accredited partner under Adobe.",
  contactInfo: ["www.krutanic.com", "support@krutanic.com"],
  aboutTitle: "About Us",
  aboutDescription: "Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow's world.",
  whyTitle: "Why Embedded Systems?",
  whyPoints: [
    "Power core technologies like IoT, robotics, and automation.",
    "Essential in consumer electronics, automotive, aerospace, and healthcare.",
    "High demand for skilled professionals across industries.",
    "Offers a blend of hardware and software skills.",
    "Enables real-time, reliable, and efficient system performance.",
    "Critical for innovation in smart devices and connected systems."
  ],
  trainingProgram: [
    {
      phase: "Month 1",
      title: "Training and Internship Program",
      items: [
        "Live sessions with industrial experts having experience above 10 years in the industry.",
        "Recordings of all live sessions available with 1 year access in our LMS portal.",
        "Industry related curriculum designed by the working professionals in the top hierarchy."
      ]
    },
    {
      phase: "Month 2",
      title: "Training and Internship Program",
      items: [
        "Two real time industrial projects: One minor project and One major project.",
        "All mentors will be assigned as project leads and guide the intern till the completion of the project.",
        "Additional projects for personal development can be required."
      ]
    }
  ],
  moduleOverview: [
    "Introduction to Embedded Systems",
    "Microcontrollers & Microprocessors",
    "Embedded C Programming",
    "Digital Electronics & Circuit Design",
    "Communication Protocols (UART, I2C, SPI)",
    "Sensors and Actuators",
    "Real-Time Operating Systems (RTOS)",
    "Embedded Linux / Bare Metal Programming",
    "PCB Design & Simulation (KiCad, Eagle)",
    "IoT Integration with Embedded Devices",
    "System Testing & Debugging Techniques",
    "Capstone Project & Interview Preparation"
  ],
  mentor: {
    name: "Rahul Srivastava",
    role: "Embedded Systems Engineer",
    experience: "19+ Years",
    bio: "Industry expert with hands-on experience designing embedded hardware and software systems for various electronic devices.",
  },
  mentorImage: "/src/assets/mentors/rahul.jpg",
  outcomes: [
    { title: "Hardware Integration", desc: "Understand and connect hardware components like microcontrollers, sensors, and actuators.", icon: FaMicrochip },
    { title: "Low-Level Programming", desc: "Write efficient code in Embedded C to control hardware.", icon: FaCode },
    { title: "Protocol Mastery", desc: "Implement serial communication protocols (UART, I2C, SPI).", icon: FaWifi },
    { title: "PCB & Debugging", desc: "Design circuit boards and utilize oscilloscopes and logic analyzers.", icon: FaTools },
  ],
  tools: [
    { name: "Arduino" },
    { name: "MPLAB X IDE" },
    { name: "FREE RTOS" },
    { name: "KEIL" }
  ],
  curriculum: [
    {
      module: "Module 1",
      title: "Introduction to Embedded Systems",
      topics: [
        "Understand the definition and real-world applications",
        "Explore system components: hardware, software, and firmware",
        "Learn about embedded constraints (power, memory, performance)"
      ]
    },
    {
      module: "Module 2",
      title: "Microcontrollers & Microprocessors",
      topics: [
        "Understand the architecture and key differences",
        "Explore examples like 8051, ARM, AVR, and Arduino",
        "Learn how to select a microcontroller for a project"
      ]
    },
    {
      module: "Module 3",
      title: "Embedded C Programming",
      topics: [
        "Learn data types, loops, conditionals, and functions in C",
        "Interface peripherals like LEDs, motors, and sensors",
        "Understand memory management and register-level programming"
      ]
    },
    {
      module: "Module 4",
      title: "Digital Electronics & Circuit Design",
      topics: [
        "Basics of logic gates, multiplexers, flip-flops, counters",
        "Learn circuit design techniques and boolean algebra",
        "Work on breadboards and simulation tools"
      ]
    },
    {
      module: "Module 5",
      title: "Communication Protocols (UART, I2C, SPI, CAN)",
      topics: [
        "Study synchronous and asynchronous communication",
        "Interface devices using serial protocols",
        "Understand timing, addressing, and data transfer"
      ]
    },
    {
      module: "Module 6",
      title: "Sensors and Actuators",
      topics: [
        "Learn about analog and digital sensors",
        "Interface actuators like servos, motors, and buzzers",
        "Read sensor data and convert it for microcontroller input"
      ]
    },
    {
      module: "Module 7",
      title: "Real-Time Operating Systems (RTOS)",
      topics: [
        "Understand tasks, scheduling, semaphores, and queues",
        "Learn multitasking in embedded systems",
        "Implement RTOS on microcontrollers"
      ]
    },
    {
      module: "Module 8",
      title: "Embedded Linux / Bare Metal Programming",
      topics: [
        "Explore Linux kernel, bootloaders, and drivers",
        "Understand file systems, GPIO access, and system calls",
        "Learn bare-metal coding without an OS for speed-critical applications"
      ]
    },
    {
      module: "Module 9",
      title: "PCB Design & Simulation (using tools like KiCad, Eagle)",
      topics: [
        "Schematic capture and layout design",
        "Place components and route tracks",
        "Run simulations and generate Gerber files"
      ]
    },
    {
      module: "Module 10",
      title: "IoT Integration with Embedded Devices",
      topics: [
        "Interface Wi-Fi/Bluetooth modules (e.g., ESP8266, ESP32)",
        "Send data to cloud platforms like ThingSpeak or Firebase",
        "Control devices remotely via mobile apps or web servers"
      ]
    },
    {
      module: "Module 11",
      title: "System Testing & Debugging Techniques",
      topics: [
        "Use tools like oscilloscopes, logic analyzers, and multimeters",
        "Debug embedded C code using breakpoints and watches",
        "Perform unit, integration, and system-level testing"
      ]
    },
    {
      module: "Module 12",
      title: "Capstone Project & Interview Preparation",
      topics: [
        "Build a real-world embedded system project",
        "Document the design, code, and outcomes",
        "Prepare for technical interviews and coding rounds"
      ]
    }
  ],
  faqs: [
    { q: "Do I need prior coding experience?", a: "Basic understanding of programming is helpful, but we start from the fundamentals of C programming to ensure everyone can follow along." },
    { q: "Will I work on real hardware?", a: "Yes, you will work with microcontrollers, sensors, and actuators to build real-world embedded systems." },
    { q: "What kind of mentor support is included?", a: "You get 1:1 doubt-clearing sessions, weekly live classes, and project reviews from industry experts." },
    { q: "Is internship support included?", a: "Yes, Krutanic provides internship support and project-based mentorship aligned with industry requirements." },
    { q: "What happens if I miss a live session?", a: "All live sessions are recorded and made available on your learning dashboard for later viewing." }
  ],
  careerPaths: {
    title: "Career Opportunities in Embedded Systems",
    subtitle: "Build skills that map to real developer roles in hardware and software integration.",
    roles: [
      {
        title: "Embedded Systems Engineer",
        desc: "Design and develop embedded hardware and software for various electronic devices.",
        tools: ["Microcontrollers", "Embedded C", "Hardware Design"],
        level: "Core Role"
      },
      {
        title: "Firmware Developer",
        desc: "Write low-level code that directly controls hardware components.",
        tools: ["C/C++", "RTOS", "Device Drivers"],
        level: "Core Role"
      },
      {
        title: "Embedded Software Developer",
        desc: "Develop applications and drivers that run on microcontrollers or embedded processors.",
        tools: ["Linux", "Embedded C", "Protocols"],
        level: "Specialist"
      },
      {
        title: "IoT Developer",
        desc: "Build Internet of Things devices by integrating sensors, actuators, and embedded platforms.",
        tools: ["Wi-Fi/Bluetooth", "Cloud Platforms", "Sensors"],
        level: "Specialist"
      },
      {
        title: "Hardware Design Engineer",
        desc: "Design PCBs (Printed Circuit Boards) and integrate microcontrollers and peripherals.",
        tools: ["KiCad", "Eagle", "Simulation"],
        level: "Hardware Role"
      },
      {
        title: "System Validation & Testing Engineer",
        desc: "Test embedded systems for performance, reliability, and compliance.",
        tools: ["Oscilloscopes", "Logic Analyzers", "Multimeters"],
        level: "Quality Assurance"
      }
    ],
    progression: ["Firmware Developer", "Embedded Software Developer", "Embedded Systems Engineer", "IoT Developer", "Hardware Design Engineer"]
  },
  projects: [
    {
      title: "Minor Industrial Project",
      desc: "A guided project where you build an embedded system using microcontrollers and sensors.",
      tech: ["Arduino", "Sensors", "Embedded C"],
      impact: "Strong understanding of hardware-software integration."
    },
    {
      title: "Major Industrial Project",
      desc: "A real-time embedded application using RTOS and communication protocols.",
      tech: ["RTOS", "UART/SPI", "ARM Cortex"],
      impact: "Portfolio-ready project showcasing multitasking and peripheral integration."
    },
    {
      title: "Capstone Project",
      desc: "A comprehensive end-to-end IoT embedded project involving PCB design, cloud connectivity, and device control.",
      tech: ["IoT", "Wi-Fi Module", "PCB Design", "Cloud integration"],
      impact: "Demonstrates mastery of embedded systems and IoT, making you job-ready."
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
  certifications: [
    "Training Completion Certificate validating acquired skills",
    "Internship Completion Certificate certified by Adobe",
    "Letter of Recommendation for job and placement",
    "Certificate of Excellence based on performance"
  ],
  studentReviews: [
    {
      name: "Sahad K",
      text: "I got placement at Wipro through krutanic support team. I am really grateful that I got to learn from AI Mentor Ashish sir and support from my counsellor was really helpful.",
      detail: ""
    },
    {
      name: "Tejas Kolekar",
      text: "I am thrilled to share my enriching experience from the Artificial Intelligence and Machine Learning Internship I recently completed with Krutanic, in collaboration with Wipro.",
      detail: ""
    }
  ]
};
