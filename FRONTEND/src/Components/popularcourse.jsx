import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import API from "../API";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Advanced Course Posters
import mernPoster from "../../krutanic/images/poster/mern.png";
import dsPoster from "../../krutanic/images/poster/datascience.png";
import daPoster from "../../krutanic/images/poster/dataanalytics.png";
import pmPoster from "../../krutanic/images/poster/productmanagement.png";
import dmPoster from "../../krutanic/images/poster/digitalmarketing.png";
import pePoster from "../../krutanic/images/poster/promptengineering.png";

// Fallback images from assets if needed
import ibPoster from "../assets/Advanced Course Images/Investment banking/INB.png";
import perfPoster from "../assets/Advanced Course Images/Performance marketing/PM.png";
import autoPoster from "../assets/Advanced Course Images/AutomationvTesting/automationtesting.jpg";

const courseMapper = {
  "mern stack development": {
    image: mernPoster,
    description: "Build production-ready web apps with MongoDB, Express.js, React, and Node.js.",
    rating: "4.9",
    stars: "★★★★★",
    reviews: "2,702",
    route: "/MernStack"
  },
  "data science": {
    image: dsPoster,
    description: "Analyze complex datasets and build practical machine learning solutions for business use-cases.",
    rating: "4.8",
    stars: "★★★★",
    reviews: "1,501",
    route: "/DataScience"
  },
  "data analytics": {
    image: daPoster,
    description: "Interpreting data to help businesses improve performance and make decisions.",
    rating: "4.8",
    stars: "★★★★",
    reviews: "1,796",
    route: "/DataAnalytics"
  },
  "product management": {
    image: pmPoster,
    description: "Plan and launch products with user-first strategy, agile execution, and growth metrics.",
    rating: "4.7",
    stars: "★★★★",
    reviews: "1,843",
    route: "/ProductManagement"
  },
  "digital marketing": {
    image: dmPoster,
    description: "Master SEO, SEM, content marketing, and data-driven campaigns.",
    rating: "4.7",
    stars: "★★★★",
    reviews: "1,507",
    route: "/DigitalMarket"
  },
  "prompt engineering with genai": {
    image: pePoster,
    description: "Learn prompt design, generative AI models, and custom AI agent workflows.",
    rating: "4.9",
    stars: "★★★★★",
    reviews: "982",
    route: "/PromptEngineering"
  },
  "investment banking": {
    image: ibPoster,
    description: "Master financial modeling, valuation, and M&A advisory.",
    rating: "4.8",
    stars: "★★★★",
    reviews: "1,211",
    route: "/investmentbanking"
  },
  "performance marketing": {
    image: perfPoster,
    description: "Learn conversion rate optimization, media buying, and analytics.",
    rating: "4.6",
    stars: "★★★★",
    reviews: "854",
    route: "/performancemarketing"
  },
  "automation testing": {
    image: autoPoster,
    description: "Master Selenium, Java, and automated testing frameworks.",
    rating: "4.7",
    stars: "★★★★",
    reviews: "945",
    route: "/automationtesting"
  }
};

const getCourseDetails = (title) => {
  const cleanTitle = title.toLowerCase().trim();
  
  if (courseMapper[cleanTitle]) {
    return courseMapper[cleanTitle];
  }
  
  const keys = Object.keys(courseMapper);
  for (const key of keys) {
    if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
      return courseMapper[key];
    }
  }
  
  return {
    image: dsPoster,
    description: "Learn from industry experts and build industry-grade projects with mentorship.",
    rating: "4.8",
    stars: "★★★★",
    reviews: "1,200",
    route: "/Advance"
  };
};

const Popularcourse = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/getadvcourses`);
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching advanced courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const visibleCourses = courses.filter(c => c.show !== false);
  const coursesToShow = visibleCourses.length > 0 ? visibleCourses : courses;

  const settings = {
    infinite: coursesToShow.length > 1,
    autoplay: true,
    autoplaySpeed: 0,
    slidesToShow: Math.min(4, coursesToShow.length),
    slidesToScroll: 1,
    speed: 6000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, coursesToShow.length)
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, coursesToShow.length)
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  if (coursesToShow.length === 0) {
    return null;
  }

  return (
    <div className="clients">
      <div className="container1">
        <Slider {...settings}>
          {coursesToShow.map((courseItem) => {
            const details = getCourseDetails(courseItem.title);
            return (
              <div className="course" key={courseItem._id}>
                <div>
                  <img src={details.image} alt={courseItem.title} />
                  <div>
                    <h2>{courseItem.title}</h2>
                    <p>{details.description}</p>
                    <p>
                      {details.rating} <span>{details.stars}</span>★ ( {details.reviews} )
                    </p>
                    <Link to={details.route}>
                      <button className="btn">Know More</button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Popularcourse;
