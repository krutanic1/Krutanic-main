import {
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight, FaChartLine, FaRobot
} from 'react-icons/fa';

import { fullStackData } from './fullStackData';
import { androidAppData } from './androidAppData';

export const allMentorshipData = {
  'full-stack-web-development': { ...fullStackData, thumbnail: '/course_thumbnails/Full Stack Web.jpg' },
  'android-app-development': { ...androidAppData, thumbnail: '/course_thumbnails/Android App.jpg' },

  'artificial-intelligence': {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    thumbnail: '/course_thumbnails/Artificial Intelligence.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead AI Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Artificial Intelligence.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Artificial Intelligence', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior AI Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Artificial Intelligence Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead AI Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'machine-learning': {
    id: 'machine-learning',
    title: 'Machine Learning',
    thumbnail: '/course_thumbnails/Machine Learning.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead ML Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Machine Learning.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Machine Learning', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior ML Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Machine Learning Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead ML Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'cyber-security': {
    id: 'cyber-security',
    title: 'Cyber Security',
    thumbnail: '/course_thumbnails/Cyber Security.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Security Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Cyber Security.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Cyber Security', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Security Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Cyber Security Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Security Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'data-science': {
    id: 'data-science',
    title: 'Data Science',
    thumbnail: '/course_thumbnails/Data Science.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Data Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Data Science.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Data Science', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Data Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Data Science Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Data Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'data-analytics': {
    id: 'data-analytics',
    title: 'Data Analytics',
    thumbnail: '/course_thumbnails/Data Analytics.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Data Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Data Analytics.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Data Analytics', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Data Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Data Analytics Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Data Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'ui-ux-design': {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    thumbnail: '/course_thumbnails/ui-ux-design.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Design Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of UI/UX Design.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to UI/UX Design', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Design Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'UI/UX Design Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Design Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'devops': {
    id: 'devops',
    title: 'DevOps',
    thumbnail: '/course_thumbnails/DevOps.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Cloud Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of DevOps.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to DevOps', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Cloud Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'DevOps Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Cloud Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'business-analytics': {
    id: 'business-analytics',
    title: 'Business Analytics',
    thumbnail: '/course_thumbnails/Business Analytics.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Data Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Business Analytics.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Business Analytics', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Data Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Business Analytics Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Data Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'finance': {
    id: 'finance',
    title: 'Finance',
    thumbnail: '/course_thumbnails/FinTech.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Finance Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Finance.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Finance', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Finance Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Finance Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Finance Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'human-resource': {
    id: 'human-resource',
    title: 'Human Resource',
    thumbnail: '/course_thumbnails/Human Resource.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead HR Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Human Resource.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Human Resource', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior HR Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Human Resource Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead HR Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    thumbnail: '/course_thumbnails/Digital Marketing.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Marketing Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Digital Marketing.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Digital Marketing', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Marketing Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Digital Marketing Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Marketing Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'stock-marketing': {
    id: 'stock-marketing',
    title: 'Stock Marketing',
    thumbnail: '/course_thumbnails/Stock Marketing.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Finance Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Stock Marketing.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Stock Marketing', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Finance Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Stock Marketing Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Finance Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'graphics-design': {
    id: 'graphics-design',
    title: 'Graphics Design',
    thumbnail: '/course_thumbnails/Graphic Designing.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Design Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Graphics Design.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Graphics Design', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Design Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Graphics Design Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Design Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'embedded-system': {
    id: 'embedded-system',
    title: 'Embedded System',
    thumbnail: '/course_thumbnails/Embedded System.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Hardware Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Embedded System.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Embedded System', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Hardware Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Embedded System Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Hardware Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'cloud-computing': {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    thumbnail: '/course_thumbnails/Cloud Computing.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Cloud Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Cloud Computing.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Cloud Computing', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Cloud Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Cloud Computing Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Cloud Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'iot-robotics': {
    id: 'iot-robotics',
    title: 'IOT & Robotics',
    thumbnail: '/course_thumbnails/iot-robotics.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Hardware Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of IOT & Robotics.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to IOT & Robotics', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Hardware Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'IOT & Robotics Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Hardware Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'vlsi-design': {
    id: 'vlsi-design',
    title: 'VLSI Design',
    thumbnail: '/course_thumbnails/Embedded System.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Hardware Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of VLSI Design.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to VLSI Design', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Hardware Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'VLSI Design Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Hardware Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },

  'auto-cad': {
    id: 'auto-cad',
    title: 'Auto Cad',
    thumbnail: '/course_thumbnails/Auto Cad.jpg',
    duration: '3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Lead Design Mentor',
      role: 'Senior Industry Expert',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master the foundational principles and core concepts of Auto Cad.', icon: FaCheckCircle },
      { title: 'Advanced Techniques', desc: 'Learn industry-standard tools and advanced methodologies.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Apply your skills to solve complex problems and build scalable solutions.', icon: FaBriefcase },
      { title: 'Job Readiness', desc: 'Prepare for top roles with interview prep and portfolio building.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Industry Standard Tools' }, { name: 'Modern Frameworks' }, { name: 'Analytics' }, 
      { name: 'Cloud Platforms' }, { name: 'Version Control' }, { name: 'Agile/Scrum' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Auto Cad', topics: ['Overview of concepts', 'Setting up the environment', 'Basic principles', 'Industry use cases'] },
      { module: 'Module 2', title: 'Core Methodologies', topics: ['In-depth exploration', 'Tools and frameworks', 'Best practices', 'Hands-on exercises'] },
      { module: 'Module 3', title: 'Advanced Concepts', topics: ['Complex scenarios', 'Optimization techniques', 'Security and performance', 'Integration'] },
      { module: 'Module 4', title: 'Industry Projects', topics: ['Real-world problem solving', 'Project planning', 'Execution', 'Testing and validation'] },
      { module: 'Module 5', title: 'Capstone & Portfolio', topics: ['Building a complete project from scratch', 'Documentation', 'Portfolio enhancement', 'Interview preparation'] }
    ],
    projects: [
      {
        title: 'Industrial Capstone Project',
        desc: 'A comprehensive project integrating all learned skills to solve a real business problem.',
        tech: ['Modern Stack', 'Cloud Integration', 'Analytics'],
        impact: 'Demonstrated ability to execute end-to-end solutions independently.'
      },
      {
        title: 'Live Case Study Application',
        desc: 'Hands-on implementation of a live industry case study with measurable outcomes.',
        tech: ['Best Practices', 'Agile', 'Optimization'],
        impact: 'Mastered practical application of theoretical concepts.'
      }
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Paths After the Program',
      subtitle: 'Build skills that map to high-demand roles across startups and enterprises globally.',
      roles: [
        { title: 'Junior Design Specialist', desc: 'Execute foundational tasks and support senior team members.', tools: ['Basic Tools', 'Reporting'], level: 'Entry-level' },
        { title: 'Auto Cad Engineer/Analyst', desc: 'Design, build, and maintain core solutions and systems.', tools: ['Advanced Frameworks', 'Cloud'], level: 'Professional' },
        { title: 'Freelance Consultant', desc: 'Work independently on custom projects for various clients.', tools: ['Client Management', 'End-to-end execution'], level: 'Independent' },
        { title: 'Lead Design Expert', desc: 'Lead teams and architect complex solutions for enterprise clients.', tools: ['Strategy', 'Architecture', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Executive', 'Specialist', 'Senior Professional', 'Team Lead', 'Architect/Manager']
    }
  },
};