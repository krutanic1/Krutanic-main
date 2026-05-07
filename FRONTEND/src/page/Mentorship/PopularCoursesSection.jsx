import React from 'react';
import { FaStar, FaClock, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// No image imports needed

const PopularCoursesSection = () => {
  const navigate = useNavigate();

  const popularCourses = [
    {
      title: "Full Stack Web Developer",
      desc: "Building and managing both the front-end and back-end of websites",
      rating: 4.7,
      students: "2,298+",
      duration: "3 Months",
      link: "/mentorship/full-stack-web-development"
    },
    {
      title: "Artificial Intelligence",
      desc: "Creating systems that simulate human intelligence for tasks like decision-making.",
      rating: 4.8,
      students: "2,340+",
      duration: "3 Months",
      link: "/mentorship/artificial-intelligence"
    },
    {
      title: "Data Analytics",
      desc: "Interpreting data to help businesses improve performance and make decisions.",
      rating: 4.7,
      students: "2,690+",
      duration: "3 Months",
      link: "/mentorship/data-analytics"
    },
    {
      title: "Cloud Computing",
      desc: "Providing scalable computing resources and storage via the internet.",
      rating: 4.8,
      students: "2,156+",
      duration: "3 Months",
      link: "/mentorship/cloud-computing"
    },
    {
      title: "Data Science",
      desc: "Analyzing large data sets to extract insights and inform decisions.",
      rating: 4.8,
      students: "2,699+",
      duration: "3 Months",
      link: "/mentorship/data-science"
    },
    {
      title: "Digital Marketing",
      desc: "Promoting products and services through digital channels like social media and search engines.",
      rating: 4.7,
      students: "2,257+",
      duration: "3 Months",
      link: "/mentorship/digital-marketing"
    }
  ];

  return (
    <section className="km-popular">
      <div className="km-container">
        <div className="km-popular__header" data-aos="fade-up">
          <div className="km-section-chip">Trending Now</div>
          <h2 className="km-section-title">Most <span>Popular</span> Courses</h2>
          <p className="km-section-sub">Join thousands of students in our top-rated mentorship programs.</p>
        </div>

        <div className="km-popular__grid">
          {popularCourses.map((course, index) => (
            <div 
              key={index} 
              className="km-popular-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 50}
            >
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCoursesSection;
