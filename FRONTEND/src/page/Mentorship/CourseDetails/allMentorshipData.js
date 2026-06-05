import {
  FaCode, FaDatabase, FaServer, FaShieldAlt, FaMobileAlt, FaRocket,
  FaCheckCircle, FaStar, FaUserGraduate, FaProjectDiagram, FaBriefcase, FaArrowRight, FaChartLine, FaRobot, FaCloud
} from 'react-icons/fa';

import { fullStackData } from './fullStackData';
import { androidAppData } from './androidAppData';
import aashishImg from '../../../assets/mentors/aashish.jpg';
import akashImg from '../../../assets/mentors/akash.jpg';
import deepakImg from '../../../assets/mentors/deepak.jpg';
import sachinImg from '../../../assets/mentors/sachin.jpg';
import rahulImg from '../../../assets/mentors/rahul.jpg';
import rudraImg from '../../../assets/mentors/rudra.jpg';
import subhraImg from '../../../assets/mentors/Subhra.jpg';
import nishithaImg from '../../../assets/mentors/nishitha.jpg';

export const allMentorshipData = {
  'full-stack-web-development': { ...fullStackData, thumbnail: '/course_thumbnails/Full Stack Web.jpg', mentorImage: sachinImg },
  'android-app-development': { ...androidAppData, thumbnail: '/course_thumbnails/Android App.jpg', mentorImage: deepakImg },

  'artificial-intelligence': {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    thumbnail: '/course_thumbnails/Artificial Intelligence.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Artificial Intelligence?',
    whyPoints: [
      'Powers intelligent automation in industries like healthcare, finance, manufacturing, and more',
      'Enhances user experiences through chat bots, recommendation systems, and voice assistants',
      'Enables machines to mimic human decision-making and behavior',
      'Drives innovation in fields like robotics, autonomous vehicles, and smart devices',
      'Offers high-demand, future-proof careers with global opportunities',
      'Forms the backbone of emerging technologies like machine learning, computer vision, and NLP'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry related curriculum designed by the working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real time industrial projects: One minor project and One major project.',
          'All mentors will be assigned as project leads and guide the intern till the completion of the project.',
          'Additional projects for personal development when required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Artificial Intelligence',
      'Python Programming for AI',
      'Data Handling and Preprocessing',
      'AI in Robotics and Automation',
      'Fundamentals of Machine Learning',
      'Computer Vision and Image Processing',
      'Ethical AI & Responsible Development',
      'AI Model Deployment and APIs',
      'Natural Language Processing (NLP)',
      'Neural Networks and Deep Learning',
      'Reinforcement Learning Basics',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Dr Aashish Mishra',
      role: 'Artificial Intelligence',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust AI solutions for top tech companies.'
    },
    mentorImage: aashishImg,
    outcomes: [
      { title: 'Core AI Fundamentals', desc: 'Understand foundational AI principles including agent-based systems, decision-making, and common algorithms.', icon: FaRobot },
      { title: 'Practical Tooling', desc: 'Hands-on experience with TensorFlow, Keras, Scikit-learn, NumPy and OpenCV.', icon: FaCode },
      { title: 'Production Deployment', desc: 'Build, deploy, and monitor AI models with APIs and cloud platforms.', icon: FaServer },
      { title: 'Career Readiness', desc: 'Portfolio projects, mock interviews, and job support for placement.', icon: FaUserGraduate }
    ],
    tools: [
      { name: 'TensorFlow / Keras' },
      { name: 'Pandas / NumPy' },
      { name: 'Python' },
      { name: 'Scikit-learn' },
      { name: 'OpenCV' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Artificial Intelligence', topics: ['Overview of AI concepts', 'Industry use cases', 'Setting up environment'] },
      { module: 'Module 2', title: 'Python Programming for AI', topics: ['Python basics', 'Data structures', 'NumPy and Pandas'] },
      { module: 'Module 3', title: 'Data Handling and Preprocessing', topics: ['Cleaning data', 'Normalization', 'Feature selection'] },
      { module: 'Module 4', title: 'Fundamentals of Machine Learning', topics: ['Supervised vs Unsupervised', 'Regression, Classification', 'Evaluation metrics'] },
      { module: 'Module 5', title: 'Neural Networks and Deep Learning', topics: ['ANN basics', 'Activation functions', 'TensorFlow/Keras workflows'] },
      { module: 'Module 6', title: 'Natural Language Processing (NLP)', topics: ['Tokenization', 'TF-IDF', 'Intro to transformers'] },
      { module: 'Module 7', title: 'Computer Vision and Image Processing', topics: ['Image transformations', 'CNNs', 'Object detection basics'] },
      { module: 'Module 8', title: 'Reinforcement Learning Basics', topics: ['Agents, rewards, policies', 'Q-learning basics'] },
      { module: 'Module 9', title: 'AI in Robotics and Automation', topics: ['Sensor integration', 'Path planning basics', 'RPA overview'] },
      { module: 'Module 10', title: 'AI Model Deployment and APIs', topics: ['Flask/FastAPI for model serving', 'Cloud deployment', 'Monitoring'] },
      { module: 'Module 11', title: 'Ethical AI & Responsible Development', topics: ['Bias and fairness', 'Explainability', 'Regulatory considerations'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['End-to-end project', 'Resume and portfolio setup', 'Mock interviews'] }
    ],
    projects: [
      { title: 'Capstone AI Project', desc: 'Build and deploy an end-to-end AI application with real data, APIs and monitoring.', tech: ['TensorFlow', 'Flask', 'Cloud'], impact: 'Portfolio-grade project demonstrating practical AI skills.' },
      { title: 'Industry Case Study', desc: 'Solve a live business problem using AI techniques and present measurable outcomes.', tech: ['Pandas', 'Scikit-learn', 'Visualization'], impact: 'Real-world problem-solving experience.' },
      { title: 'Capstone Project', desc: 'A comprehensive AI system integrating multiple models, data pipelines, and production deployment with monitoring and optimization.', tech: ['PyTorch', 'TensorFlow', 'Cloud Deployment'], impact: 'Demonstrates end-to-end AI solution architecture and production-grade implementation expertise.' }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: "I have gained a really hands on experience which was delivered by Akash sir. Very supportive and endless worthy experience.", detail: 'Highly recommended.' },
      { name: 'Sahad K', text: "Got placement at Wipro through Krutanic support team. Grateful to mentors and counsellor support.", detail: 'Thanks to the Krutanic team.' },
      { name: 'Pranali Shinde', text: "Thrilled to share my enriching experience from the AI internship — incredible opportunity to deepen knowledge and skills.", detail: 'Valuable mentorship.' },
      { name: 'Sunil Kumar', text: "Outstanding experience in Data Science program; learned a lot of industrial things and practical skills.", detail: 'Strong recommendation.' }
    ],
    certifications: [
      'Training Completion Certificate validating acquired AI skills',
      'Internship Completion Certificate certified by Adobe',
      'Letter of Recommendation for job and placement',
      'Certificate of Excellence based on performance'
    ],
    faqs: [
      { q: 'Do I need prior coding experience?', a: 'No, this program starts from the basics and gradually builds up to advanced AI concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build industrial projects and a capstone to solidify learning and build your portfolio.' },
      { q: 'What support do mentors provide?', a: 'Mentors act as project leads guiding interns through live sessions and project completion.' },
      { q: 'Is internship support included?', a: 'Yes, internship opportunities exist across 200+ hiring partners.' },
      { q: 'Are session recordings available?', a: 'Recordings of live sessions are available with 1-year LMS access.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in Artificial Intelligence',
      subtitle: 'Roles across industry including AI Engineer, ML Engineer, Computer Vision Engineer, Data Scientist and NLP Engineer.',
      roles: [
        { title: 'AI Engineer', desc: 'Design and deploy intelligent systems using ML and deep learning.', tools: ['TensorFlow', 'Keras'], level: 'Professional' },
        { title: 'Machine Learning Engineer', desc: 'Build and optimize predictive models for real-world applications.', tools: ['Scikit-learn', 'Cloud'], level: 'Professional' },
        { title: 'Computer Vision Engineer', desc: 'Develop image/video analysis solutions using CNNs and OpenCV.', tools: ['OpenCV', 'CNNs'], level: 'Specialist' },
        { title: 'Data Scientist (AI-focused)', desc: 'Analyze complex datasets and build decision-making tools.', tools: ['Pandas', 'NumPy'], level: 'Professional' },
        { title: 'NLP Engineer', desc: 'Work on language processing tasks like chatbots and sentiment analysis.', tools: ['Transformers', 'NLTK'], level: 'Specialist' }
      ],
      progression: ['Junior AI Developer', 'AI Engineer', 'Senior AI Engineer', 'Tech Lead', 'Architect']
    }
  },

  'machine-learning': {
    id: 'machine-learning',
    title: 'Machine Learning',
    thumbnail: '/course_thumbnails/Machine Learning.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Machine Learning?',
    whyPoints: [
      'Automates decision-making based on data patterns',
      'Solves complex problems beyond traditional programming',
      'High demand across industries like healthcare, finance, and e-commerce',
      'Foundation for AI advancements like chatbots and recommendation systems',
      'Continuously improves with more data and usage',
      'Offers lucrative and future-proof career opportunities'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by working professionals in top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide interns until project completion.',
          'Additional projects for personal development when required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Machine Learning',
      'Python for Machine Learning',
      'Data Preprocessing & Feature Engineering',
      'Unsupervised Learning Algorithms',
      'Model Evaluation & Validation Techniques',
      'Dimensionality Reduction Techniques',
      'Introduction to Deep Learning',
      'Model Deployment & Productionization',
      'Supervised Learning Algorithms',
      'Ensemble Methods (Bagging & Boosting)',
      'Time Series Forecasting',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Subra Prakash',
      role: 'Sr. SME Data Science',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust machine learning solutions for top tech companies.'
    },
    mentorImage: subhraImg,
    outcomes: [
      { title: 'ML Foundations', desc: 'Master supervised, unsupervised, and reinforcement learning concepts with hands-on practice.', icon: FaCode },
      { title: 'Data Handling', desc: 'Learn data preprocessing, feature engineering, and working with real-world datasets.', icon: FaDatabase },
      { title: 'Model Development', desc: 'Build, train, and optimize ML models using Scikit-learn, TensorFlow, and modern frameworks.', icon: FaRocket },
      { title: 'Production Deployment', desc: 'Deploy models to production environments and monitor performance in real-world applications.', icon: FaServer }
    ],
    tools: [
      { name: 'Python' },
      { name: 'Scikit-learn' },
      { name: 'Pandas & NumPy' },
      { name: 'Matplotlib' },
      { name: 'Seaborn' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Machine Learning', topics: ['Understand ML concepts and types (supervised, unsupervised, reinforcement)', 'Overview of ML applications in real-world scenarios', 'Differences between ML, AI, and data science'] },
      { module: 'Module 2', title: 'Python for Machine Learning', topics: ['Python basics and libraries (NumPy, Pandas)', 'Data manipulation and analysis', 'Introduction to Jupyter Notebooks for ML workflows'] },
      { module: 'Module 3', title: 'Data Preprocessing & Feature Engineering', topics: ['Handling missing values and outliers', 'Data normalization and scaling', 'Feature selection and extraction techniques'] },
      { module: 'Module 4', title: 'Supervised Learning Algorithms', topics: ['Linear and logistic regression', 'Decision trees and random forests', 'Support Vector Machines (SVM)', 'K-Nearest Neighbors (KNN)'] },
      { module: 'Module 5', title: 'Unsupervised Learning Algorithms', topics: ['Clustering techniques: K-means, hierarchical clustering', 'Association rules and market basket analysis', 'Anomaly detection methods'] },
      { module: 'Module 6', title: 'Model Evaluation & Validation Techniques', topics: ['Train-test split and cross-validation', 'Metrics: accuracy, precision, recall, F1-score, ROC-AUC', 'Confusion matrix interpretation'] },
      { module: 'Module 7', title: 'Ensemble Methods (Bagging & Boosting)', topics: ['Concept of ensemble learning', 'Random Forest algorithm', 'Gradient Boosting Machines (GBM), AdaBoost, XGBoost'] },
      { module: 'Module 8', title: 'Dimensionality Reduction Techniques', topics: ['Principal Component Analysis (PCA)', 't-SNE for visualization', 'Feature reduction benefits and use cases'] },
      { module: 'Module 9', title: 'Time Series Forecasting', topics: ['Basics of time series data', 'Moving averages and smoothing techniques', 'ARIMA and seasonal models'] },
      { module: 'Module 10', title: 'Introduction to Deep Learning', topics: ['Neural networks fundamentals', 'Activation functions and architectures', 'Frameworks: TensorFlow and Keras basics'] },
      { module: 'Module 11', title: 'Model Deployment & Productionization', topics: ['Saving and loading ML models', 'Introduction to APIs for ML model serving', 'Monitoring and maintaining models in production'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['Develop an end-to-end ML project', 'Prepare portfolio and GitHub repositories', 'Practice common ML interview questions and coding challenges'] }
    ],
    projects: [
      {
        title: 'Minor Industrial Project',
        desc: 'A guided project where you build a complete ML application with data preprocessing, model training, and evaluation under mentor supervision.',
        tech: ['Python', 'Scikit-learn', 'Pandas'],
        impact: 'Strong understanding of end-to-end ML project workflow in a mentor-led setup.'
      },
      {
        title: 'Major Industrial Project',
        desc: 'A production-style ML application with ensemble methods, hyperparameter tuning, and deployment.',
        tech: ['Python', 'XGBoost', 'Flask/FastAPI'],
        impact: 'Portfolio-ready major project showcasing ML expertise and deployment readiness.'
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive ML system integrating feature engineering, advanced algorithms, hyperparameter optimization, and production deployment with monitoring.',
        tech: ['Scikit-learn', 'TensorFlow', 'Cloud Platform'],
        impact: 'Demonstrates complete ML system design from data ingestion to model serving with real-world scalability and performance optimization.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained really hands on experience with ML which was delivered excellently. Akash sir was very supportive and an endless worthy experience.', detail: 'Perfect for anyone looking to master Machine Learning.' },
      { name: 'Tejas Kolekar', text: 'Thrilled to share my enriching experience from the ML internship with Krutanic. This 3-month program was an incredible opportunity to deepen knowledge and skills in ML.', detail: 'Great mentorship and real-world projects.' },
      { name: 'Pranali Shinde', text: 'Excited to share that I\'ve completed a Data Science course from Krutanic! Amazing journey diving into data visualization, EDA, and machine learning.', detail: 'Gained valuable skills applicable to real-world projects.' },
      { name: 'Sunil Kumar', text: 'Outstanding experience in ML program at Krutanic; learned a lot of new industrial things and practical skills.', detail: 'Strong recommendation for ML enthusiasts.' }
    ],
    certifications: [
      'Training Completion Certificate validating acquired Machine Learning skills',
      'Internship Completion Certificate certified by Adobe',
      'Letter of Recommendation for job and placement',
      'Certificate of Excellence based on performance'
    ],
    faqs: [
      { q: 'Do I need prior coding experience?', a: 'No, this program starts from Python basics and gradually builds up to advanced ML concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in Machine Learning',
      subtitle: 'Build skills that map to high-demand ML and data roles across startups, enterprises, and freelance platforms.',
      roles: [
        { title: 'Machine Learning Engineer', desc: 'Design, build, and deploy ML models into scalable applications.', tools: ['Python', 'Scikit-learn', 'TensorFlow'], level: 'Professional' },
        { title: 'Data Scientist', desc: 'Use machine learning to analyze data, generate insights, and create predictive models.', tools: ['Python', 'Pandas', 'Visualization'], level: 'Professional' },
        { title: 'Research Scientist (AI/ML)', desc: 'Focus on developing new algorithms and advancing the field of machine learning.', tools: ['TensorFlow', 'PyTorch', 'Research'], level: 'Specialist' },
        { title: 'Natural Language Processing Engineer', desc: 'Specialize in language-based models for chatbots, translation, sentiment analysis.', tools: ['NLP Libraries', 'Transformers', 'NLTK'], level: 'Specialist' },
        { title: 'AI Engineer', desc: 'Develop intelligent systems using ML, deep learning, and algorithms for real-world applications.', tools: ['Python', 'Deep Learning', 'APIs'], level: 'Professional' },
        { title: 'Computer Vision Engineer', desc: 'Build models for image and video analysis in areas like facial recognition and autonomous driving.', tools: ['OpenCV', 'CNNs', 'Computer Vision'], level: 'Specialist' }
      ],
      progression: ['Junior ML Developer', 'ML Engineer', 'Senior ML Engineer', 'Tech Lead (ML)', 'ML Architect']
    }
  },

  'cyber-security': {
    id: 'cyber-security',
    title: 'Cyber Security',
    thumbnail: '/course_thumbnails/Cyber Security.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Cyber Security?',
    whyPoints: [
      'Protects organizations from cyber threats, data breaches, and financial loss',
      'High demand across industries like banking, healthcare, government, and e-commerce',
      'Enables secure digital transformation and trust in online systems',
      'Creates future-proof careers with strong growth and competitive salaries',
      'Supports compliance, privacy, and risk management across modern businesses',
      'Builds expertise in defense, detection, incident response, and ethical hacking'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide interns until project completion.',
          'Additional projects for personal development when required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Cyber Security',
      'Networking Fundamentals',
      'Operating Systems & Linux Basics',
      'Web Application Security',
      'Network Security & Firewalls',
      'Vulnerability Assessment Tools',
      'Malware Analysis and Prevention',
      'Incident Response & Digital Forensics',
      'Cryptography and Encryption',
      'Ethical Hacking and Penetration Testing',
      'Security Information & Event Management (SIEM)',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Rudra Pratap',
      role: 'Cyber Security',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience securing systems, leading incident response, and building practical cyber security teams.'
    },
    mentorImage: rudraImg,
    outcomes: [
      { title: 'Security Fundamentals', desc: 'Understand cyber threats, attack surfaces, defensive controls, and the CIA triad.', icon: FaShieldAlt },
      { title: 'Network Defense', desc: 'Build confidence with networking concepts, firewalls, IDS/IPS, and secure communication.', icon: FaServer },
      { title: 'Hands-on Tools', desc: 'Practice with Kali Linux, Wireshark, Nmap, Metasploit, Burp Suite, Nessus, and SIEM tools.', icon: FaCode },
      { title: 'Career Readiness', desc: 'Prepare for real-world cyber security roles with projects, mock interviews, and portfolio support.', icon: FaUserGraduate }
    ],
    tools: [
      { name: 'Wireshark' },
      { name: 'Nmap' },
      { name: 'Kali Linux' },
      { name: 'Metasploit Framework' },
      { name: 'Burp Suite' },
      { name: 'Splunk' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Cyber Security', topics: ['Understanding cyber threats, attacks, and vulnerabilities', 'Types of cyber attacks: phishing, ransomware, DoS, etc.', 'CIA triad: Confidentiality, Integrity, Availability'] },
      { module: 'Module 2', title: 'Networking Fundamentals', topics: ['OSI and TCP/IP models', 'IP addressing, subnets, and ports', 'Protocols: HTTP, HTTPS, FTP, DNS, etc.'] },
      { module: 'Module 3', title: 'Operating Systems & Linux Basics', topics: ['Linux command line essentials', 'File systems and permissions', 'System processes, services, user management, and scripting basics'] },
      { module: 'Module 4', title: 'Web Application Security', topics: ['OWASP Top 10 vulnerabilities', 'SQL Injection, Cross-Site Scripting (XSS), CSRF', 'Input validation and secure coding practices'] },
      { module: 'Module 5', title: 'Network Security & Firewalls', topics: ['Firewall types and configurations', 'Intrusion Detection & Prevention Systems (IDS/IPS)', 'VPNs and secure tunneling protocols'] },
      { module: 'Module 6', title: 'Vulnerability Assessment Tools', topics: ['Using Nmap, Nessus, and OpenVAS', 'Automated scanning techniques', 'Analyzing vulnerability reports and remediation'] },
      { module: 'Module 7', title: 'Ethical Hacking and Penetration Testing', topics: ['Phases of penetration testing', 'Information gathering and scanning', 'Exploitation, post-exploitation, reporting and documentation'] },
      { module: 'Module 8', title: 'Malware Analysis and Prevention', topics: ['Types of malware: viruses, trojans, worms, ransomware', 'Static and dynamic malware analysis', 'Sandboxing and reverse engineering basics'] },
      { module: 'Module 9', title: 'Incident Response & Digital Forensics', topics: ['Incident response lifecycle', 'Evidence collection and chain of custody', 'Disk imaging, data recovery, and forensics tools'] },
      { module: 'Module 10', title: 'Cryptography and Encryption', topics: ['Symmetric vs asymmetric encryption', 'Hashing algorithms (MD5, SHA)', 'Public Key Infrastructure (PKI) and SSL/TLS'] },
      { module: 'Module 11', title: 'Security Information & Event Management (SIEM)', topics: ['Introduction to SIEM tools like Splunk', 'Log analysis and correlation', 'Threat detection, real-time monitoring, and alerting'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['Conduct a complete security assessment', 'Simulate attack and defense scenarios', 'Resume and LinkedIn optimization and interview prep'] }
    ],
    projects: [
      {
        title: 'Minor Security Project',
        desc: 'A guided project where you assess a small system or web app, identify vulnerabilities, and document remediations.',
        tech: ['Nmap', 'Burp Suite', 'OWASP'],
        impact: 'Strong understanding of practical vulnerability assessment and reporting.'
      },
      {
        title: 'Major Security Project',
        desc: 'A production-style project covering network defense, incident response, and SIEM monitoring for a simulated environment.',
        tech: ['Splunk', 'Kali Linux', 'Wireshark'],
        impact: 'Portfolio-ready major project showcasing defensive and offensive security capabilities.'
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive security infrastructure assessment and hardening project including threat modeling, penetration testing, incident response planning, and compliance validation.',
        tech: ['Splunk', 'Metasploit', 'Cloud Security'],
        impact: 'Demonstrates enterprise-level security architecture expertise, threat analysis capability, and readiness for security operations and compliance roles.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained a really hands on experience with security tools and techniques. The mentorship was supportive and the experience was valuable.', detail: 'Highly recommended for cyber security beginners.' },
      { name: 'Rajendra Prasad', text: 'I researched the certificate and found it genuine and verified. The training and real-world projects were excellent.', detail: 'Perfect for quality training and practical learning.' },
      { name: 'Sahad K', text: 'I realised Krutanic solutions is the best company ever for training and internship provider. I learned a lot of new industrial things.', detail: 'Strong support from mentors and counsellors.' },
      { name: 'Sunil Kumar', text: 'My experience was outstanding. The program gave me practical exposure and helped build confidence for real cyber security work.', detail: 'Very useful for career growth.' }
    ],
    certifications: [
      'Training Completion Certificate validating acquired Cyber Security skills',
      'Internship Completion Certificate certified by Adobe',
      'Letter of Recommendation for job and placement',
      'Certificate of Excellence based on performance'
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No, this program starts from the basics and gradually builds up to advanced cyber security concepts.' },
      { q: 'Will I build real-world projects?', a: 'Yes, you will build 2 real-time industrial projects (one minor, one major) to solidify your learning and build your portfolio.' },
      { q: 'What kind of mentor support is included?', a: 'Mentors act as project leads, guiding you through live sessions and assisting you until the completion of your projects.' },
      { q: 'Is internship support included?', a: 'Yes, you gain access to an internship program with opportunities across 200+ hiring partners.' },
      { q: 'What happens if I miss a live session?', a: 'Recordings of all live sessions are available with 1-year access in our LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in Cyber Security',
      subtitle: 'Build skills that map to high-demand security roles across enterprises, SOC teams, consulting, and response functions.',
      roles: [
        { title: 'Cyber Security Analyst', desc: 'Monitor networks, detect vulnerabilities, and respond to security incidents.', tools: ['SIEM', 'Wireshark', 'Nmap'], level: 'Entry-level' },
        { title: 'Ethical Hacker / Penetration Tester', desc: 'Simulate cyberattacks to identify and fix security flaws before malicious actors exploit them.', tools: ['Kali Linux', 'Burp Suite', 'Metasploit'], level: 'Specialist' },
        { title: 'SOC Analyst', desc: 'Continuously monitor and analyze security posture on an organizational level.', tools: ['Splunk', 'Alerting', 'Threat Intel'], level: 'Professional' },
        { title: 'Incident Response Specialist', desc: 'Respond rapidly to breaches, conduct forensic analysis, and mitigate damage caused by cyber attacks.', tools: ['Forensics', 'Playbooks', 'IR Tools'], level: 'Specialist' },
        { title: 'Security Engineer', desc: 'Design and implement secure network solutions to defend against hacking, malware, and other cyber threats.', tools: ['Firewalls', 'IDS/IPS', 'Hardening'], level: 'Professional' },
        { title: 'Information Security Manager', desc: 'Oversee security strategies, compliance, and risk management policies within an organization.', tools: ['Risk Management', 'Compliance', 'Leadership'], level: 'Senior' }
      ],
      progression: ['Junior Security Analyst', 'Security Analyst', 'Senior Security Analyst', 'Security Lead', 'Security Architect']
    }
  },

  'data-science': {
    id: 'data-science',
    title: 'Data Science',
    thumbnail: '/course_thumbnails/Data Science.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Data Science?',
    whyPoints: [
      'Data analysts turn raw data into actionable insights, helping businesses make smarter decisions.',
      'Their ability to identify patterns and trends improves operational efficiency and strategy.',
      'High demand across industries like finance, healthcare, marketing, and e-commerce fuels strong career growth.',
      'Data analytics skills are practical and versatile — from Excel and SQL to Python and Power BI.',
      'Analysts often collaborate with stakeholders, enhancing their communication and business acumen.',
      'It serves as a stepping stone to advanced roles like data scientist, BI analyst, and machine learning engineer.'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by the working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide the intern till the completion of the project.',
          'Additional projects for personal development can be required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Data Analytics',
      'Excel for Data Analysis',
      'SQL for Data Extraction',
      'Data Cleaning and Preprocessing',
      'Exploratory Data Analysis (EDA)',
      'Statistics for Data Analytics',
      'Dashboarding and Reporting',
      'Case Studies & Industry Applications',
      'Python for Data Analytics',
      'Data Visualization with Power BI/Tableau',
      'Business Analytics Concepts',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Subra Prakash',
      role: 'Sr. SME Data Science',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust data analytics and data science solutions for top tech companies.',
    },
    mentorImage: subhraImg,
    outcomes: [
      { title: 'Data Storytelling', desc: 'Transform raw data into actionable insights and clear recommendations for business stakeholders.', icon: FaChartLine },
      { title: 'Excel, SQL & Python', desc: 'Work fluently with spreadsheets, SQL queries, and Python-based data workflows.', icon: FaCode },
      { title: 'Visualization & BI', desc: 'Build dashboards and reports using Power BI, Tableau, and exploratory data analysis techniques.', icon: FaBriefcase },
      { title: 'Career Readiness', desc: 'Prepare for analyst roles with capstone projects, interview prep, and portfolio support.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Microsoft Excel' },
      { name: 'SQL (MySQL/PostgreSQL)' },
      { name: 'Python (Pandas & NumPy)' },
      { name: 'Jupyter Notebook' },
      { name: 'Google Sheets / Looker Studio' },
      { name: 'Power BI / Tableau' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Data Analytics', topics: ['Understand the role of a data analyst', 'Overview of data types and sources', 'Analytics process and life cycle', 'Real-world use cases across industries'] },
      { module: 'Module 2', title: 'Excel for Data Analysis', topics: ['Data sorting, filtering, and formatting', 'Formulas, functions, and pivot tables', 'Charts and graphs for visualization', 'Lookup functions (VLOOKUP, INDEX-MATCH)'] },
      { module: 'Module 3', title: 'SQL for Data Extraction', topics: ['Basic to advanced SQL queries', 'Filtering, joining, grouping, and aggregating data', 'Subqueries and nested queries', 'Creating and managing relational databases'] },
      { module: 'Module 4', title: 'Data Cleaning and Preprocessing', topics: ['Handling missing and duplicate values', 'Data type conversions', 'Outlier detection and treatment', 'Normalization and standardization'] },
      { module: 'Module 5', title: 'Exploratory Data Analysis (EDA)', topics: ['Analyzing distributions and patterns', 'Correlation and feature relationships', 'Univariate and bivariate analysis', 'Visualizing trends and summaries'] },
      { module: 'Module 6', title: 'Statistics for Data Analytics', topics: ['Descriptive statistics: mean, median, mode', 'Probability distributions', 'Hypothesis testing and p-values', 'Statistical significance and confidence intervals'] },
      { module: 'Module 7', title: 'Dashboarding and Reporting', topics: ['Creating dashboards and reports', 'Charts: bar, line, pie, maps, and more', 'Filtering and slicers for interactivity', 'Sharing reports and publishing dashboards'] },
      { module: 'Module 8', title: 'Case Studies & Industry Applications', topics: ['Domain-wise analytics: healthcare, e-commerce, finance', 'Solving business problems with data', 'End-to-end project simulations', 'Interpreting analytics results for stakeholders'] },
      { module: 'Module 9', title: 'Python for Data Analytics', topics: ['Python basics: variables, loops, functions', 'Using Pandas and NumPy for data manipulation', 'Reading and writing datasets (CSV, Excel)', 'Data wrangling and transformation'] },
      { module: 'Module 10', title: 'Data Visualization with Power BI/Tableau', topics: ['Creating dashboards and reports', 'Charts: bar, line, pie, maps, and more', 'Filtering and slicers for interactivity', 'Sharing reports and publishing dashboards'] },
      { module: 'Module 11', title: 'Business Analytics Concepts', topics: ['KPI identification and tracking', 'A/B testing and experimentation', 'Forecasting and trend analysis', 'Use cases in sales, marketing, finance, and HR'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['Execute a real-world data analytics project', 'Prepare portfolio-ready visualizations and reports', 'Practice interview questions and analytics case rounds', 'Placement assistance mock interview preparation'] }
    ],
    projects: [
      {
        title: 'Minor Industrial Project',
        desc: 'A guided project where you clean, analyze, and visualize a real business dataset under mentor supervision.',
        tech: ['Excel', 'SQL', 'Power BI'],
        impact: 'Strong understanding of end-to-end data analytics project workflow in a mentor-led setup.'
      },
      {
        title: 'Major Industrial Project',
        desc: 'A production-style analytics project with dashboards, reporting, and actionable stakeholder insights.',
        tech: ['Python', 'SQL', 'Tableau', 'Power BI'],
        impact: 'Portfolio-ready major project showcasing ownership, scalability, and delivery readiness.'
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive data analytics platform with advanced dashboarding, predictive analytics, and business intelligence features integrated into a cohesive solution.',
        tech: ['Python', 'Advanced SQL', 'Tableau/Power BI'],
        impact: 'Demonstrates expertise in end-to-end data pipelines, advanced analytics, and stakeholder-ready insights delivery.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained a really hands on experience with graphic design which was delivered by Akash sir was very supportive and endless worthy experience so far.', detail: 'Great for practical learning.' },
      { name: 'Rajendra Prasad', text: 'I researched and found the correct certificate on Linkedin and scan that and found it 100% genuine and verified successfully. Krutanic company is perfect with quality training and real world projects.', detail: 'Strong recommendation.' },
      { name: 'Sahad K', text: 'I got placement at Wipro through krutanic support team. I am really grateful that I got to learn from Al Mentor Ashish sir and support from my counsellor was really helpful.', detail: 'Excellent mentor support.' },
      { name: 'Sunil Kumar', text: 'I have enrolled for Data Science program at Krutanic solutions and my experience is outstanding. Perfect for quality training and real world projects.', detail: 'Highly valuable experience.' },
      { name: 'Shubham Rai', text: 'Krutanic Group is truly doing a remarkable job by creating learning spaces that are not only informative but also inspiring.', detail: 'Great for career growth.' },
      { name: 'Pranali Shinde', text: 'It was an amazing journey diving into data visualization, exploratory data analysis, SQL, and machine learning. Valuable skills for real-world projects.', detail: 'Very enriching experience.' }
    ],
    certifications: [
      'Training Completion Certificate validating the skills you acquired',
      'Internship Completion certificate certified by Accenture/Adobe',
      'Letter of Recommendation (LOR) for your job/placement',
      'Certificate of excellence based on your performance'
    ],
    faqs: [
      { q: 'Do I need prior knowledge?', a: 'No prior experience is required. We teach you everything from scratch, focusing on logic, analytics, and technical execution.' },
      { q: 'Will I work on real-world projects?', a: 'Yes, you will build 2 real-time industrial projects, one minor and one major, with mentor guidance.' },
      { q: 'What support do mentors provide?', a: 'Mentors act as project leads and guide you through live sessions, projects, and completion support.' },
      { q: 'Is internship support included?', a: 'Yes, the program includes internship support and exposure to 200+ hiring partners.' },
      { q: 'Are recordings available?', a: 'Yes, all live sessions are recorded and available with 1 year access in the LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in Data Science',
      subtitle: 'Build skills that map to high-demand analytics roles across startups, enterprises, and product teams.',
      roles: [
        { title: 'Data Scientist', desc: 'Analyze complex data sets to derive actionable insights and build predictive models.', tools: ['Python', 'Pandas', 'Scikit-learn'], level: 'Professional' },
        { title: 'Data Engineer', desc: 'Build and maintain data pipelines, ensuring efficient data flow and storage.', tools: ['Python', 'Spark', 'SQL'], level: 'Professional' },
        { title: 'Business Intelligence Analyst', desc: 'Create dashboards and visualizations to help stakeholders understand key metrics.', tools: ['Power BI', 'Tableau', 'SQL'], level: 'Entry-level' },
        { title: 'Big Data Engineer', desc: 'Work with big data technologies like Hadoop and Spark to process and analyze large-scale data.', tools: ['Hadoop', 'Spark', 'HDFS'], level: 'Specialist' },
        { title: 'Data Analyst', desc: 'Interpret data trends and generate reports to support business decision-making.', tools: ['Excel', 'SQL', 'Visualization'], level: 'Entry-level' },
        { title: 'Machine Learning Engineer', desc: 'Design, develop, and deploy machine learning models into production.', tools: ['Python', 'TensorFlow', 'Scikit-learn'], level: 'Professional' }
      ],
      progression: ['Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Data/AI Architect']
    }
  },

  'data-analytics': {
    id: 'data-analytics',
    title: 'Data Analytics',
    thumbnail: '/course_thumbnails/Data Analytics.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Data Analytics?',
    whyPoints: [
      'Data analysts turn raw data into actionable insights, helping businesses make smarter decisions.',
      'Their ability to identify patterns and trends improves operational efficiency and strategy.',
      'High demand across industries like finance, healthcare, marketing, and e-commerce fuels strong career growth.',
      'Data analytics skills are practical and versatile — from Excel and SQL to Python and Power BI.',
      'Analysts often collaborate with stakeholders, enhancing their communication and business acumen.',
      'It serves as a stepping stone to advanced roles like data scientist, BI analyst, and machine learning engineer.'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by the working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide the intern till the completion of the project.',
          'Additional projects for personal development can be required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Data Analytics',
      'Excel for Data Analysis',
      'SQL for Data Extraction',
      'Data Cleaning and Preprocessing',
      'Exploratory Data Analysis (EDA)',
      'Statistics for Data Analytics',
      'Dashboarding and Reporting',
      'Case Studies & Industry Applications',
      'Python for Data Analytics',
      'Data Visualization with Power BI/Tableau',
      'Business Analytics Concepts',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Subra Prakash',
      role: 'Sr. SME Data Science',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust data analytics solutions for top tech companies.',
    },
    mentorImage: subhraImg,
    outcomes: [
      { title: 'Analytics Foundations', desc: 'Understand the role of a data analyst, analytics life cycle, and real-world business use cases.', icon: FaChartLine },
      { title: 'Excel, SQL & Python', desc: 'Work with Excel, SQL, Python, Pandas, and NumPy to handle, query, and transform data.', icon: FaCode },
      { title: 'Dashboards & Reporting', desc: 'Create interactive dashboards and stakeholder-ready reports using Power BI and Tableau.', icon: FaBriefcase },
      { title: 'Career Readiness', desc: 'Prepare for analyst roles with capstone projects, interview prep, and portfolio support.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Microsoft Excel' },
      { name: 'SQL (MySQL/PostgreSQL)' },
      { name: 'Python (Pandas & NumPy)' },
      { name: 'Jupyter Notebook' },
      { name: 'Google Sheets / Looker Studio' },
      { name: 'Power BI / Tableau' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Data Analytics', topics: ['Understand the role of a data analyst', 'Overview of data types and sources', 'Analytics process and life cycle', 'Real-world use cases across industries'] },
      { module: 'Module 2', title: 'Excel for Data Analysis', topics: ['Data sorting, filtering, and formatting', 'Formulas, functions, and pivot tables', 'Charts and graphs for visualization', 'Lookup functions (VLOOKUP, INDEX-MATCH)'] },
      { module: 'Module 3', title: 'SQL for Data Extraction', topics: ['Basic to advanced SQL queries', 'Filtering, joining, grouping, and aggregating data', 'Subqueries and nested queries', 'Creating and managing relational databases'] },
      { module: 'Module 4', title: 'Data Cleaning and Preprocessing', topics: ['Handling missing and duplicate values', 'Data type conversions', 'Outlier detection and treatment', 'Normalization and standardization'] },
      { module: 'Module 5', title: 'Exploratory Data Analysis (EDA)', topics: ['Analyzing distributions and patterns', 'Correlation and feature relationships', 'Univariate and bivariate analysis', 'Visualizing trends and summaries'] },
      { module: 'Module 6', title: 'Statistics for Data Analytics', topics: ['Descriptive statistics: mean, median, mode', 'Probability distributions', 'Hypothesis testing and p-values', 'Statistical significance and confidence intervals'] },
      { module: 'Module 7', title: 'Dashboarding and Reporting', topics: ['Creating dashboards and reports', 'Charts: bar, line, pie, maps, and more', 'Filtering and slicers for interactivity', 'Sharing reports and publishing dashboards'] },
      { module: 'Module 8', title: 'Case Studies & Industry Applications', topics: ['Domain-wise analytics: healthcare, e-commerce, finance', 'Solving business problems with data', 'End-to-end project simulations', 'Interpreting analytics results for stakeholders'] },
      { module: 'Module 9', title: 'Python for Data Analytics', topics: ['Python basics: variables, loops, functions', 'Using Pandas and NumPy for data manipulation', 'Reading and writing datasets (CSV, Excel)', 'Data wrangling and transformation'] },
      { module: 'Module 10', title: 'Data Visualization with Power BI/Tableau', topics: ['Creating dashboards and reports', 'Charts: bar, line, pie, maps, and more', 'Filtering and slicers for interactivity', 'Sharing reports and publishing dashboards'] },
      { module: 'Module 11', title: 'Business Analytics Concepts', topics: ['KPI identification and tracking', 'A/B testing and experimentation', 'Forecasting and trend analysis', 'Use cases in sales, marketing, finance, and HR'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['Execute a real-world data analytics project', 'Prepare portfolio-ready visualizations and reports', 'Practice interview questions and analytics case rounds', 'Placement assistance program mock interview preparation'] }
    ],
    projects: [
      {
        title: 'Minor Industrial Project',
        desc: 'A guided project where you clean, analyze, and visualize a real business dataset under mentor supervision.',
        tech: ['Excel', 'SQL', 'Power BI'],
        impact: 'Strong understanding of end-to-end data analytics project workflow in a mentor-led setup.'
      },
      {
        title: 'Major Industrial Project',
        desc: 'A production-style analytics project with dashboards, reporting, and actionable stakeholder insights.',
        tech: ['Python', 'SQL', 'Tableau', 'Power BI'],
        impact: 'Portfolio-ready major project showcasing ownership, scalability, and delivery readiness.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained a really hands on experience with data analytics which was delivered by Akash sir. Very supportive and endless worthy experience so far.', detail: 'Great for practical learning.' },
      { name: 'Rajendra Prasad', text: 'I researched and found the correct certificate on Linkedin and scan that and found it 100% genuine and verified successfully.', detail: 'Strong recommendation.' },
      { name: 'Sahad K', text: 'I realised Krutanic solutions is the best company ever for training and internship provider. I learned a lot of new industrial things.', detail: 'Excellent mentor support.' },
      { name: 'Sunil Kumar', text: 'I have enrolled for Data Science program at Krutanic solutions and my experience is outstanding. Perfect for quality training and real world projects.', detail: 'Highly valuable experience.' },
      { name: 'Shubham Rai', text: 'Krutanic Group is truly doing a remarkable job by creating learning spaces that are not only informative but also inspiring.', detail: 'Great for career growth.' },
      { name: 'Pranali Shinde', text: 'Amazing journey diving into data visualization, exploratory data analysis, SQL, and machine learning. Valuable skills for real-world projects.', detail: 'Very enriching experience.' }
    ],
    certifications: [
      'Training Completion Certificate validating the skills you acquired',
      'Internship Completion certificate certified by Adobe',
      'Letter of Recommendation (LOR) for your job/placement',
      'Certificate of excellence based on your performance'
    ],
    faqs: [
      { q: 'Do I need prior knowledge?', a: 'No prior experience is required. We teach you everything from scratch, focusing on logic, analytics, and technical execution.' },
      { q: 'Will I work on real-world projects?', a: 'Yes, you will build 2 real-time industrial projects, one minor and one major, with mentor guidance.' },
      { q: 'What support do mentors provide?', a: 'Mentors act as project leads and guide you through live sessions, projects, and completion support.' },
      { q: 'Is internship support included?', a: 'Yes, the program includes internship support and exposure to 200+ hiring partners.' },
      { q: 'Are recordings available?', a: 'Yes, all live sessions are recorded and available with 1 year access in the LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in Data Analytics',
      subtitle: 'Build skills that map to high-demand analytics roles across finance, healthcare, marketing, e-commerce, and product teams.',
      roles: [
        { title: 'Data Analyst', desc: 'Interpret and analyze data to help organizations make strategic decisions using tools like Excel, SQL, and BI software.', tools: ['Excel', 'SQL', 'Power BI'], level: 'Entry-level' },
        { title: 'Business Analyst', desc: 'Bridge the gap between data and business needs by interpreting trends and providing actionable insights.', tools: ['Reporting', 'Stakeholder management', 'SQL'], level: 'Professional' },
        { title: 'Operations Analyst', desc: 'Use analytics to streamline processes, reduce costs, and improve efficiency in business operations.', tools: ['Excel', 'Dashboards', 'Process analytics'], level: 'Professional' },
        { title: 'Product Analyst', desc: 'Leverage product usage data to optimize features, improve user experience, and drive growth.', tools: ['Product metrics', 'A/B testing', 'SQL'], level: 'Specialist' },
        { title: 'Data Visualization Specialist', desc: 'Design interactive dashboards and reports to communicate data findings clearly and effectively.', tools: ['Tableau', 'Power BI', 'Looker Studio'], level: 'Specialist' },
        { title: 'Marketing Analyst', desc: 'Analyze campaign performance, customer behavior, and ROI to guide marketing strategies.', tools: ['Excel', 'SQL', 'Analytics'], level: 'Professional' }
      ],
      progression: ['Data Analyst', 'Senior Analyst', 'Business/BI Analyst', 'Lead Analyst', 'Analytics Manager']
    }
  },

  'ui-ux-design': {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    thumbnail: '/course_thumbnails/ui-ux-design.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why UI/UX Design?',
    whyPoints: [
      'Enhances user experience and satisfaction, directly impacting product success.',
      'Boosts user retention and engagement through intuitive, delightful interfaces.',
      'Improves accessibility, making products usable for all users including those with disabilities.',
      'Increases conversion rates by optimizing user flows and interactions.',
      'Strengthens brand identity and creates memorable digital experiences.',
      'Reduces development costs by preventing costly design mistakes early in the process.'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by the working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide the intern till the completion of the project.',
          'Additional projects for personal development can be required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to UI/UX Design',
      'Design Thinking Process',
      'User Research & Personas',
      'Information Architecture',
      'Visual Design Principles',
      'Prototyping Tools (Figma, Adobe XD)',
      'Interaction Design',
      'Responsive & Mobile Design',
      'Wire framing & Sketching',
      'Typography & Color Theory',
      'Usability Testing',
      'Portfolio & Case Study Creation'
    ],
    mentor: {
      name: 'Akash R',
      role: 'Senior UI/UX Designer',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience in designing and deploying user-centered digital solutions for leading tech companies.',
    },
    mentorImage: akashImg,
    outcomes: [
      { title: 'Design Foundations', desc: 'Master UI vs UX, design principles, and the role of designers in product development.', icon: FaCheckCircle },
      { title: 'Design Tools Proficiency', desc: 'Get hands-on with Figma, Adobe XD, and prototyping tools for creating professional designs.', icon: FaRocket },
      { title: 'User-Centered Design', desc: 'Learn user research, personas, and testing to create experiences that users love.', icon: FaBriefcase },
      { title: 'Portfolio Ready', desc: 'Build a compelling design portfolio with case studies for job opportunities and freelance projects.', icon: FaUserGraduate },
    ],
    tools: [
      { name: 'Figma' },
      { name: 'Adobe XD' },
      { name: 'Adobe Illustrator' },
      { name: 'Sketch' },
      { name: 'Whimsical' },
      { name: 'Prototyping & Collaboration Tools' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to UI/UX Design', topics: ['Basics of UI vs UX', 'Importance in product development', 'Roles and responsibilities of a UI/UX designer'] },
      { module: 'Module 2', title: 'Design Thinking Process', topics: ['Empathize, Define, Ideate, Prototype, Test', 'Problem-solving and innovation framework'] },
      { module: 'Module 3', title: 'User Research & Personas', topics: ['Conducting user interviews and surveys', 'Creating user personas and journey maps'] },
      { module: 'Module 4', title: 'Wire framing & Sketching', topics: ['Low-fidelity wire frames', 'Tools for sketching UI layouts'] },
      { module: 'Module 5', title: 'Information Architecture', topics: ['Organizing content and navigation', 'Site maps and user flows'] },
      { module: 'Module 6', title: 'Visual Design Principles', topics: ['Layout, balance, contrast, alignment, proximity', 'UI consistency and clarity'] },
      { module: 'Module 7', title: 'Typography & Color Theory', topics: ['Choosing fonts and typefaces', 'Color psychology and palette creation'] },
      { module: 'Module 8', title: 'Prototyping Tools (Figma, Adobe XD)', topics: ['Creating interactive prototypes', 'Collaborating and sharing designs'] },
      { module: 'Module 9', title: 'Interaction Design', topics: ['Micro-interactions and animations', 'Designing user-friendly controls'] },
      { module: 'Module 10', title: 'Responsive & Mobile Design', topics: ['Designing for various screen sizes', 'Mobile-first and adaptive design'] },
      { module: 'Module 11', title: 'Usability Testing', topics: ['Testing prototypes with users', 'Collecting feedback and iterating designs'] },
      { module: 'Module 12', title: 'Portfolio & Case Study Creation', topics: ['Documenting design projects', 'Presenting case studies professionally'] }
    ],
    projects: [
      {
        title: 'Minor Industrial Project',
        desc: 'A guided design project where you research, prototype, and test a UI/UX solution under mentor supervision.',
        tech: ['Figma', 'User Research', 'Prototyping'],
        impact: 'Strong understanding of end-to-end design workflow and user-centered principles in a mentor-led setup.'
      },
      {
        title: 'Major Industrial Project',
        desc: 'A production-style design project with complete case study, testing, and stakeholder presentation.',
        tech: ['Adobe XD', 'Interaction Design', 'Usability Testing', 'Prototyping'],
        impact: 'Portfolio-ready major project showcasing design thinking, user empathy, and delivery excellence.'
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive design system with complete visual language, component library, interaction guidelines, and multi-platform design specifications.',
        tech: ['Figma', 'Design Systems', 'Adobe Suite'],
        impact: 'Demonstrates mastery of scalable design practices, enterprise-grade design thinking, and professional design system architecture.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained a really hands on experience with UI/UX design which was delivered by Akash sir. Very supportive and endless worthy experience so far.', detail: 'Great for practical learning.' },
      { name: 'Rajendra Prasad', text: 'I researched and found the correct certificate on Linkedin and scanned that and found it 100% genuine and verified successfully.', detail: 'Strong recommendation.' },
      { name: 'Sahad K', text: 'I realised Krutanic solutions is the best company ever for training and internship provider. I learned a lot of new industrial things.', detail: 'Excellent mentor support.' },
      { name: 'Sunil Kumar', text: 'I have enrolled for UI/UX Design program at Krutanic solutions and my experience is outstanding. Perfect for quality training and real world projects.', detail: 'Highly valuable experience.' },
      { name: 'Shubham Rai', text: 'Krutanic Group is truly doing a remarkable job by creating learning spaces that are not only informative but also inspiring.', detail: 'Great for career growth.' },
      { name: 'Tejas Kolekar', text: 'Krutanics UI/UX Design program was a fantastic learning experience. The course covered essential design tools like Figma, Adobe XD, and UX principles, providing a strong foundation for building user-centered products.', detail: 'Highly recommended.' }
    ],
    certifications: [
      'Training Completion Certificate validating the skills you acquired',
      'Internship Completion certificate certified by Adobe',
      'Letter of Recommendation (LOR) for your job/placement',
      'Certificate of excellence based on your performance'
    ],
    faqs: [
      { q: 'Do I need prior design experience?', a: 'No, this program starts from the basics. We teach design thinking, tools, and principles from scratch to advanced levels.' },
      { q: 'Will I work on real-world projects?', a: 'Yes, you will build 2 real-time industrial projects, one minor and one major, with mentor guidance.' },
      { q: 'What design tools will I learn?', a: 'You will master industry-standard tools like Figma, Adobe XD, Adobe Illustrator, and Sketch.' },
      { q: 'Is internship support included?', a: 'Yes, the program includes internship support and exposure to 200+ hiring partners.' },
      { q: 'Can I build a portfolio during the course?', a: 'Yes, you will build portfolio-ready case studies and projects throughout the program that showcase your design expertise.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in UI/UX Design',
      subtitle: 'Build skills that map to high-demand design roles across startups, tech companies, agencies, and enterprises globally.',
      roles: [
        { title: 'UI Designer', desc: 'Focus on designing visually appealing and interactive interfaces that are intuitive and user-friendly.', tools: ['Figma', 'Adobe XD', 'Design Systems'], level: 'Entry-level' },
        { title: 'UX Designer', desc: 'Enhance user experience through research, testing, and optimization of digital products and services.', tools: ['User Research', 'Prototyping', 'Usability Testing'], level: 'Professional' },
        { title: 'Interaction Designer', desc: 'Design interactive elements like animations, transitions, and feedback systems for seamless user experiences.', tools: ['Interaction Prototyping', 'Animation', 'Micro-interactions'], level: 'Professional' },
        { title: 'Visual Designer', desc: 'Specialize in the aesthetics, branding, and visual consistency of digital products and marketing materials.', tools: ['Adobe Suite', 'Design Systems', 'Illustration'], level: 'Specialist' },
        { title: 'Product Designer', desc: 'Oversee the end-to-end product design process, bridging UX research, UI design, and business objectives.', tools: ['Product Strategy', 'End-to-end Design', 'Stakeholder Management'], level: 'Senior' },
        { title: 'UX Researcher', desc: 'Conduct user research, testing, and analytics to guide design decisions and improve product usability.', tools: ['User Research', 'Testing', 'Analytics'], level: 'Specialist' }
      ],
      progression: ['UI Designer', 'UX Designer', 'Product Designer', 'Senior Designer', 'Design Lead/Manager']
    }
  },

  'devops': {
    id: 'devops',
    title: 'DevOps',
    thumbnail: '/course_thumbnails/DevOps.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '15,000+ Mentees Trained',
    rating: 4.85,
    pitch: 'Transform Your Passion into A Successful Career In Tech',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why DevOps?',
    whyPoints: [
      'Enables CI/CD for faster and reliable software delivery.',
      'Bridges the gap between development and operations teams.',
      'Reduces time to market through rapid, automated deployments.',
      'Improves product quality with early bug detection and feedback.',
      'Enhances operational efficiency using automation and Infrastructure as Code (IaC).',
      'High demand for DevOps professionals across industries.'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by the working professionals in the top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide the intern till the completion of the project.',
          'Additional projects for personal development can be required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to DevOps',
      'Linux Fundamentals',
      'Version Control with Git & GitHub',
      'Continuous Integration with Jenkins',
      'Containerization with Docker',
      'Configuration Management with Ansible',
      'Cloud Platforms (AWS / Azure Basics)',
      'Infrastructure as Code (Terraform)',
      'Build Tools (Maven/Gradle)',
      'Container Orchestration with Kubernetes',
      'Monitoring and Logging (Prometheus + Grafana)',
      'Capstone Project & Interview Preparation'
    ],
    mentor: {
      name: 'Aashish Mishra',
      role: 'Sr. Cloud & DevOps Engineer',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and operating cloud-native infrastructure and CI/CD systems for enterprise teams.',
    },
    mentorImage: aashishImg,
    outcomes: [
      { title: 'DevOps Foundations', desc: 'Understand DevOps culture, CI/CD, and lifecycle practices.', icon: FaCheckCircle },
      { title: 'Toolchain Mastery', desc: 'Gain hands-on experience with Docker, Kubernetes, Jenkins, Ansible, and Terraform.', icon: FaRocket },
      { title: 'Cloud & Automation', desc: 'Deploy and manage cloud infrastructure with IaC and automation best practices.', icon: FaCloud },
      { title: 'Career Ready', desc: 'Prepare for roles with project-based deliverables, resume support, and mock interviews.', icon: FaUserGraduate }
    ],
    tools: [
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'Ansible' },
      { name: 'Terraform' },
      { name: 'Jenkins' },
      { name: 'Git & GitHub' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to DevOps', topics: ['Understanding DevOps culture and lifecycle', 'Key differences between Agile, DevOps, and traditional SDLC', 'Benefits of DevOps in modern software delivery', 'Overview of CI/CD, IaC, and Monitoring'] },
      { module: 'Module 2', title: 'Linux Fundamentals', topics: ['Basic Linux commands and shell scripting', 'File system navigation and permissions', 'Package management and system processes', 'Networking commands and SSH'] },
      { module: 'Module 3', title: 'Version Control with Git & GitHub', topics: ['Git basics: init, add, commit, push, pull', 'Branching, merging, and resolving conflicts', 'Using GitHub for collaboration', 'Git workflows and version tracking'] },
      { module: 'Module 4', title: 'Continuous Integration with Jenkins', topics: ['Installing and configuring Jenkins', 'Creating freestyle and pipeline jobs', 'Integrating Git with Jenkins', 'Automating test and build processes'] },
      { module: 'Module 5', title: 'Containerization with Docker', topics: ['Understanding images, containers, and Dockerfile', 'Building and running containers', 'Docker Compose for multi-container setups', 'Pushing to Docker Hub'] },
      { module: 'Module 6', title: 'Configuration Management with Ansible', topics: ['Introduction to Ansible and YAML syntax', 'Writing playbooks and managing inventories', 'Automating server configuration and app deployment', 'Roles and modular tasks'] },
      { module: 'Module 7', title: 'Cloud Platforms (AWS / Azure Basics)', topics: ['Overview of cloud computing and services', 'Launching EC2 instances', 'S3 storage basics', 'IAM and basic networking'] },
      { module: 'Module 8', title: 'Infrastructure as Code (Terraform)', topics: ['Introduction to IaC and Terraform syntax', 'Writing .tf files for AWS resource provisioning', 'Using Terraform CLI', 'Managing state and variable files'] },
      { module: 'Module 9', title: 'Build Tools (Maven/Gradle)', topics: ['Introduction to build automation tools', 'Creating and managing dependencies', 'Building Java applications using Maven/Gradle', 'Customizing build lifecycles'] },
      { module: 'Module 10', title: 'Container Orchestration with Kubernetes', topics: ['Kubernetes architecture and components', 'Deployments, pods, services, and replicas', 'Config Maps, Secrets, and Volumes', 'Managing apps with kubectl'] },
      { module: 'Module 11', title: 'Monitoring and Logging (Prometheus + Grafana)', topics: ['Setting up Prometheus for metrics collection', 'Creating dashboards with Grafana', 'Configuring alerts', 'Monitoring containerized apps'] },
      { module: 'Module 12', title: 'Capstone Project & Interview Preparation', topics: ['End-to-end CI/CD pipeline project', 'Integrate Docker, Jenkins, Git, and Kubernetes', 'Resume building and GitHub portfolio', 'Mock interviews and DevOps scenario questions'] }
    ],
    projects: [
      {
        title: 'Minor Industrial Project',
        desc: 'Build a CI pipeline and containerize a sample application, deploy to a cloud environment.',
        tech: ['Docker', 'Jenkins', 'AWS'],
        impact: 'Hands-on experience automating builds, tests, and deployments.'
      },
      {
        title: 'Major Industrial Project',
        desc: 'Design and implement a production-ready CI/CD pipeline with infrastructure as code and monitoring.',
        tech: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
        impact: 'A portfolio-ready project demonstrating end-to-end deployment and observability.'
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive DevOps solution with complete infrastructure automation, multi-environment deployment, security hardening, and enterprise-grade monitoring and observability.',
        tech: ['Kubernetes', 'Terraform', 'GitOps', 'Cloud Platform'],
        impact: 'Demonstrates production-grade DevOps expertise, infrastructure architecture mastery, and enterprise deployment practices.'
      }
    ],
    milestones: [
      { label: 'Google Ratings', value: '4.8/5' },
      { label: 'Global Market Size', value: 'USD 200 Billion' },
      { label: 'Hiring Partners', value: '200+' },
      { label: 'Job Openings', value: '25,000+' },
      { label: 'Average Salary', value: '10+ LPA' },
      { label: 'Mentees Trained', value: '15k+' }
    ],
    studentReviews: [
      { name: 'Ramshad K', text: 'I have gained a really hands on experience with DevOps which was delivered by Aashish sir. Very supportive and endless worthy experience so far.', detail: 'Great for practical learning.' },
      { name: 'Rajendra Prasad', text: 'I researched and found the correct certificate on Linkedin and scanned that and found it 100% genuine and verified successfully.', detail: 'Strong recommendation.' },
      { name: 'Sahad K', text: 'I realised Krutanic solutions is the best company ever for training and internship provider. I learned a lot of new industrial things.', detail: 'Excellent mentor support.' },
      { name: 'Sunil Kumar', text: 'I got placement at Wipro through krutanic support team. I am really grateful that I got to learn from mentor Aashish sir and support from my counsellor was really helpful.', detail: 'Highly valuable experience.' },
      { name: 'Shubham Rai', text: 'Krutanic Group is truly doing a remarkable job by creating learning spaces that are not only informative but also inspiring.', detail: 'Great for career growth.' }
    ],
    certifications: [
      'Training Completion Certificate validating the skills you acquired',
      'Internship Completion certificate certified by industry partners',
      'Letter of Recommendation (LOR) for your job/placement',
      'Certificate of excellence based on your performance'
    ],
    faqs: [
      { q: 'Do I need prior experience?', a: 'No prior experience is required. We start from foundational Linux and version control before moving to advanced automation.' },
      { q: 'Will I work on real-world projects?', a: 'Yes, you will build 2 real-time industrial projects, one minor and one major, with mentor guidance.' },
      { q: 'What cloud platforms are covered?', a: 'We cover core concepts across AWS and Azure basics, with hands-on labs for EC2, S3, and IAM.' },
      { q: 'Is internship support included?', a: 'Yes, the program includes internship support and exposure to 200+ hiring partners.' },
      { q: 'Are recordings available?', a: 'Yes, all live sessions are recorded and available with 1 year access in the LMS portal.' }
    ],
    careerPaths: {
      title: 'Career Opportunities in DevOps',
      subtitle: 'Build skills that map to high-demand roles across cloud-native engineering, SRE, and infrastructure automation.',
      roles: [
        { title: 'DevOps Engineer', desc: 'Design and implement automated deployment pipelines, monitor systems, and manage infrastructure.', tools: ['Docker', 'Kubernetes', 'Terraform'], level: 'Professional' },
        { title: 'Site Reliability Engineer (SRE)', desc: 'Ensure system reliability and performance by combining software engineering with IT operations.', tools: ['Monitoring', 'Scripting', 'Automation'], level: 'Senior' },
        { title: 'Cloud DevOps Engineer', desc: 'Focus on deploying and maintaining cloud infrastructure using tools like AWS, Azure, Docker, and Kubernetes.', tools: ['AWS', 'Azure', 'Kubernetes'], level: 'Professional' },
        { title: 'CI/CD Pipeline Architect', desc: 'Design scalable and efficient CI/CD workflows to improve development velocity and reduce deployment errors.', tools: ['Jenkins', 'GitHub Actions', 'Pipelines'], level: 'Senior' },
        { title: 'Infrastructure Automation Engineer', desc: 'Automate infrastructure provisioning and configuration using tools like Terraform and Ansible.', tools: ['Terraform', 'Ansible'], level: 'Professional' }
      ],
      progression: ['Junior Engineer', 'DevOps Engineer', 'Senior Engineer', 'Lead/Architect', 'Manager/Director']
    }
  },

  'business-analytics': {
    id: 'business-analytics',
    title: 'Business Analytics',
    thumbnail: '/course_thumbnails/Business Analytics.jpg',
    duration: '2/3 Months',
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
      },
      {
        title: 'Capstone Project',
        desc: 'A comprehensive project that integrates all technical and business skills, demonstrating production-ready implementation with real-world impact and scalability.',
        tech: ['Full Stack Technologies', 'Cloud Deployment', 'Best Practices'],
        impact: 'Showcases complete mastery of the domain with enterprise-grade execution and ability to lead complex projects.'
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,500+ Mentees',
    rating: 4.8,
    mentor: {
      name: 'Rahul Srivastava',
      role: 'Embedded System',
      experience: '10+ Years',
      bio: 'Industry expert with over 10 years of experience building and deploying robust solutions for top tech companies.',
    },
    mentorImage: rahulImg,
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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
    duration: '2/3 Months',
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

  'psychology': {
    id: 'psychology',
    title: 'Psychology',
    thumbnail: '/course_thumbnails/Psychology.jpg',
    duration: '2/3 Months',
    format: 'Live Mentor-led',
    level: 'Beginner to Pro',
    enrolled: '12,000+ Mentees',
    rating: 4.8,
    pitch: 'Understand Mind, Behavior and Human Relations to Excel in Counseling and Care',
    providerNote: 'We are now an accredited partner under Krutanic.',
    contactInfo: ['www.krutanic.com', 'support@krutanic.com'],
    aboutTitle: 'About Us',
    aboutDescription: 'Krutanic is at the forefront of transforming education through cutting-edge technology. Our comprehensive platform empowers learners with personalized learning experiences, collaborative tools, and real-time analytics. With adaptive assessments and interactive content creation, we enhance student engagement and achievement. Join us in revolutionizing education for the digital age, driving positive outcomes and preparing learners for success in tomorrow\'s world.',
    whyTitle: 'Why Psychology?',
    whyPoints: [
      'Dives deep into understanding human behavior, thoughts, and emotions',
      'Essential for careers in counseling, clinical therapy, human resources, and marketing',
      'Helps in personal growth, self-awareness, and building healthier relationships',
      'High demand in corporate mental wellness, educational institutes, and community development',
      'Enables professionals to address mental health challenges and drive social impact',
      'Provides a foundation for research, coaching, user psychology (UX), and organizational development'
    ],
    trainingProgram: [
      {
        phase: 'Month 1',
        title: 'Training and Internship Program',
        items: [
          'Live sessions with industrial experts having experience above 10 years in the industry.',
          'Recordings of all live sessions available with 1 year access in our LMS portal.',
          'Industry-related curriculum designed by working professionals in top hierarchy.'
        ]
      },
      {
        phase: 'Month 2',
        title: 'Training and Internship Program',
        items: [
          'Two real-time industrial projects: one minor project and one major project.',
          'All mentors are assigned as project leads and guide interns until project completion.',
          'Additional projects for personal development when required.'
        ]
      }
    ],
    moduleOverview: [
      'Introduction to Psychology',
      'Cognitive & Behavioral Processes',
      'Developmental Psychology',
      'Social & Cultural Psychology',
      'Personality Theories & Assessment',
      'Abnormal Psychology & Mental Health',
      'Research Methodology & Ethics',
      'Therapeutic Approaches & Counseling',
      'Organizational & Industrial Psychology',
      'UX Psychology & Behavioral Design',
      'Mental Health in the Modern Workplace',
      'Capstone Project & Case Study Analysis'
    ],
    mentor: {
      name: 'Nishitha Jha',
      role: 'Lead Psychology Mentor & Consultant',
      experience: '7+ Years',
      bio: 'Professional counseling consultant with over 7 years of experience helping individuals navigate behavioral changes and mental wellness.'
    },
    mentorImage: nishithaImg,
    outcomes: [
      { title: 'Core Fundamentals', desc: 'Master foundational psychological concepts, behavioral patterns, and cognitive models.', icon: FaCheckCircle },
      { title: 'Counseling Skills', desc: 'Learn standard therapeutic communication and counseling protocols.', icon: FaRocket },
      { title: 'Real-world Application', desc: 'Analyze real-life case studies and design interventions for human wellness.', icon: FaBriefcase },
      { title: 'UX & Organizational Insights', desc: 'Apply psychological principles to user research, product design, and workplace wellness.', icon: FaUserGraduate }
    ],
    tools: [
      { name: 'Therapeutic Communication' }, { name: 'Cognitive Assessments' }, { name: 'Case Studies' }, 
      { name: 'UX Psychology (Gestalt Laws)' }, { name: 'Workplace Wellness Playbooks' }, { name: 'Research Methodologies' }
    ],
    curriculum: [
      { module: 'Module 1', title: 'Introduction to Psychology', topics: ['History and foundations of psychology', 'Key subfields and career prospects', 'Scientific methods in behavior study'] },
      { module: 'Module 2', title: 'Cognitive & Behavioral Processes', topics: ['Perception, learning, and memory systems', 'Behavioral psychology and environmental triggers', 'Cognitive load and processing information'] },
      { module: 'Module 3', title: 'Abnormal Psychology & Mental Health', topics: ['Overview of mental disorders (DSM-5 basics)', 'Signs, symptoms, and coping strategies', 'De-stigmatization and awareness campaigns'] },
      { module: 'Module 4', title: 'Therapeutic Approaches & Counseling', topics: ['Introduction to CBT, humanistic therapy, and psychotherapy', 'Ethics in counseling and client boundaries', 'Active listening and empathetic response building'] },
      { module: 'Module 5', title: 'UX & Workplace Psychology', topics: ['Applying psychology to UI/UX design (Gestalt principles)', 'Stress management and employee motivation', 'Conflict resolution and emotional intelligence'] }
    ],
    projects: [
      {
        title: 'Clinical Case Study Analysis',
        desc: 'Conduct a thorough assessment of a simulated psychological case study, drafting counseling recommendation sheets.',
        tech: ['CBT Frameworks', 'Clinical Guidelines', 'Case Analysis'],
        impact: 'Demonstrated proficiency in interpreting behavioral symptoms and structuring counseling strategies.'
      },
      {
        title: 'Workplace Wellness Initiative Design',
        desc: 'Create an end-to-end mental health and wellness program for a corporate client, including metrics for success.',
        tech: ['Industrial Psychology', 'Program Development', 'Conflict Resolution'],
        impact: 'Portfolio-ready workplace strategy addressing employee burnout and team dynamics.'
      }
    ],
    faqs: [
      { q: 'Do I need a science background to join this program?', a: 'No, this program starts from the foundational basics of human psychology and behavior, making it accessible to learners from all streams.' },
      { q: 'Will I get practical exposure?', a: 'Yes, you will analyze real-world case studies and build a practical workplace wellness initiative as part of your projects.' },
      { q: 'What careers can I pursue after this?', a: 'Careers include counseling assistant, HR specialist, mental wellness consultant, user experience (UX) researcher, and life coach.' },
      { q: 'What kind of support will I receive?', a: 'You will receive live mentor sessions led by Nishitha Jha, project reviews, and placement assistance through our network.' }
    ],
    careerPaths: {
      title: 'Career Paths in Psychology',
      subtitle: 'Build critical analytical and behavioral skills that map to wellness, HR, research, and corporate strategy roles.',
      roles: [
        { title: 'Mental Wellness Counselor', desc: 'Provide guidance and mental health support within institutional frameworks.', tools: ['Active Listening', 'CBT'], level: 'Professional' },
        { title: 'UX Researcher / UX Psychologist', desc: 'Study user behavior and design interface journeys based on cognitive habits.', tools: ['User Testing', 'Cognitive Science'], level: 'Specialist' },
        { title: 'HR & Talent Manager', desc: 'Resolve workplace conflicts and design employee engagement programs.', tools: ['Conflict Resolution', 'EQ'], level: 'Professional' },
        { title: 'Behavioral Consultant / Coach', desc: 'Assist clients with personal goal-setting, habit building, and productivity.', tools: ['Goal Setting', 'Motivation Science'], level: 'Specialist' }
      ],
      progression: ['Junior Consultant', 'Psychology Specialist', 'Lead Counselor', 'Director of Wellness', 'HR/UX Architect']
    }
  },
};