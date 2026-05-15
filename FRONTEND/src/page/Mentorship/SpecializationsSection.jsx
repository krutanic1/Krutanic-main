import React, { useState } from 'react';
import { FaStar, FaArrowRight, FaClock, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SpecializationsSection = () => {
  const [activeTab, setActiveTab] = useState('Computer Science');
  const navigate = useNavigate();

  const tabs = ['Computer Science', 'Management', 'Electronics/Electrical', 'Mechanical'];

  const courses = [
    // Computer Science
    { title: "Full Stack Web Development", domain: "Computer Science", rating: 4.9, students: "2,298+", duration: "2/3 Months", link: "/mentorship/full-stack-web-development", desc: "Master MERN stack and build production-ready applications." },
    { title: "Artificial Intelligence", domain: "Computer Science", rating: 4.8, students: "2,340+", duration: "2/3 Months", link: "/mentorship/artificial-intelligence", desc: "Learn neural networks, deep learning, and AI implementation." },
    { title: "Data Science", domain: "Computer Science", rating: 4.9, students: "2,690+", duration: "2/3 Months", link: "/mentorship/data-science", desc: "Analyze complex data sets and derive actionable insights." },
    { title: "Cyber Security", domain: "Computer Science", rating: 4.7, students: "1,850+", duration: "2/3 Months", link: "/mentorship/cyber-security", desc: "Protect systems and networks from digital attacks and threats." },
    { title: "Cloud Computing", domain: "Computer Science", rating: 4.8, students: "2,156+", duration: "2/3 Months", link: "/mentorship/cloud-computing", desc: "Build scalable infrastructure on AWS and Azure platforms." },
    { title: "Android App Development", domain: "Computer Science", rating: 4.7, students: "1,520+", duration: "2/3 Months", link: "/mentorship/android-app-development", desc: "Build native Android applications with Java and Kotlin." },
    { title: "UI/UX Design", domain: "Computer Science", rating: 4.9, students: "1,840+", duration: "2/3 Months", link: "/mentorship/ui-ux-design", desc: "Design stunning user interfaces and great user experiences." },
    { title: "DevOps", domain: "Computer Science", rating: 4.8, students: "1,260+", duration: "2/3 Months", link: "/mentorship/devops", desc: "Bridge the gap between development and operations teams." },
    { title: "Machine Learning", domain: "Computer Science", rating: 4.9, students: "2,140+", duration: "2/3 Months", link: "/mentorship/machine-learning", desc: "Train models to learn from data and make predictions." },
    
    // Management
    { title: "Digital Marketing", domain: "Management", rating: 4.8, students: "2,257+", duration: "2/3 Months", link: "/mentorship/digital-marketing", desc: "Master SEO, SEM, and social media marketing strategies." },
    { title: "Business Analytics", domain: "Management", rating: 4.7, students: "1,940+", duration: "2/3 Months", link: "/mentorship/business-analytics", desc: "Bridging the gap between business and data for better decisions." },
    { title: "Finance", domain: "Management", rating: 4.6, students: "1,120+", duration: "2/3 Months", link: "/mentorship/finance", desc: "Learn financial planning, investment, and analysis." },
    { title: "Human Resource", domain: "Management", rating: 4.7, students: "950+", duration: "2/3 Months", link: "/mentorship/human-resource", desc: "Master recruitment, talent management, and HR operations." },
    { title: "Stock Marketing", domain: "Management", rating: 4.8, students: "3,140+", duration: "2/3 Months", link: "/mentorship/stock-marketing", desc: "Learn trading, investment strategies, and market analysis." },

    // Electronics/Electrical
    { title: "Embedded Systems", domain: "Electronics/Electrical", rating: 4.7, students: "1,200+", duration: "2/3 Months", link: "/mentorship/embedded-systems", desc: "Design and program hardware systems for real-world apps." },
    { title: "VLSI Design", domain: "Electronics/Electrical", rating: 4.6, students: "980+", duration: "2/3 Months", link: "/mentorship/vlsi-design", desc: "Learn integrated circuit design and semiconductor technology." },
    { title: "IOT & Robotics", domain: "Electronics/Electrical", rating: 4.8, students: "1,450+", duration: "2/3 Months", link: "/mentorship/iot-robotics", desc: "Connect devices and build intelligent robotic systems." },

    // Mechanical
    { title: "Auto CAD", domain: "Mechanical", rating: 4.8, students: "1,340+", duration: "2/3 Months", link: "/mentorship/auto-cad", desc: "Master precision engineering design and manufacturing tools." },
    { title: "Graphics Design", domain: "Mechanical", rating: 4.7, students: "2,100+", duration: "2/3 Months", link: "/mentorship/graphics-design", desc: "Learn visual storytelling and digital art creation." },
  ];

  const filteredCourses = courses.filter(c => c.domain === activeTab);

  return (
    <section className="km-spec" id="specializations">
      <div className="km-spec__header" data-aos="fade-up">
        <div className="km-section-chip">All Domains</div>
        <h2 className="km-section-title">Specialized <span>Mentorship</span> Tracks</h2>
        <p className="km-section-sub">Choose a specialization that aligns with your career goals and learn from industry masters.</p>
      </div>

      <div className="km-spec__tabs" data-aos="fade-up">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`km-spec__tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#f15b29' : 'white',
              color: activeTab === tab ? 'white' : '#334155',
              borderColor: activeTab === tab ? '#f15b29' : '#e2e8f0'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="km-spec__grid">
        {filteredCourses.map((course, index) => (
          <div className="km-card" key={index} data-aos="fade-up" data-aos-delay={index * 50}>
            <div className="km-card__body">
              <div className="km-card__badges">
                <span className="km-card__badge km-card__badge--green">LIVE</span>
                <span className="km-card__badge">CERTIFIED</span>
              </div>
              <h3 className="km-card__title">{course.title}</h3>
              <p className="km-card__desc">{course.desc}</p>
              
              <div className="km-card__meta">
                <div className="km-card__left-meta">
                  <div className="km-card__stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < 4 ? "#f59e0b" : "#e2e8f0"} size={14} />
                    ))}
                    <span className="km-card__rating-num">{course.rating}</span>
                  </div>
                </div>
                <div className="km-card__right-meta">
                  <div className="km-card__meta-item"><FaClock /> {course.duration}</div>
                  <div className="km-card__meta-item"><FaUsers /> {course.students}</div>
                </div>
              </div>

              <div className="km-card__actions">
                <button className="km-card__btn-primary" onClick={() => navigate(course.link)}>
                  Program Details <FaArrowRight style={{marginLeft: '8px'}} size={12} />
                </button>
              </div>
              <div className="km-card__accent-line"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecializationsSection;
