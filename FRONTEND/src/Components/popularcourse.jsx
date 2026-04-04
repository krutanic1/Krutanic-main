import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ds = "/course_thumbnails/Data Science.jpg";
const fsd = "/course_thumbnails/Full Stack Web.jpg";
const ai = "/course_thumbnails/Artificial Intelligence.jpg";
const da = "/course_thumbnails/Data Analytics.jpg";
const cc = "/course_thumbnails/Cloud Computing.jpg";

const Popularcourse = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    slidesToShow: 4,
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
          slidesToShow: 3
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2
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

  return (
    <div className="clients">
      <div className="container1">
        <Slider {...settings}>
          <div className="course">
            <div>
              <img src={fsd} alt="" />
              <div>
                <h2>Full Stack Web Development</h2>
                <p>
                  Building and managing both the front-end and back-end of
                  websites
                </p>
                <p>
                  4.9 <span>★★★★</span>★ ( 2,702 )
                </p>
                <Link to="/mentorship">
                  <button className="btn">Know More</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="course">
            <div>
              <img src={ai} alt="" />
              <div>
                <h2>Artificial Intelligence</h2>
                <p>
                  Creating systems that simulate human intelligence for tasks
                  like decision-making.
                </p>
                <p>
                  4.7 <span>★★★★</span>★ ( 2,712 )
                </p>
                <Link to="/mentorship">
                  <button className="btn">Know More</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="course">
            <div>
              <img src={da} alt="" />
              <div>
                <h2>Data Analytics</h2>
                <p>
                  Interpreting data to help businesses improve performance and
                  make decisions.
                </p>
                <p>
                  4.8 <span>★★★★</span>★ ( 1,796 )
                </p>
                <Link to="/mentorship">
                  <button className="btn">Know More</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="course">
            <div>
              <img src={cc} alt="" />
              <div>
                <h2>Cloud Computing</h2>
                <p>
                  Providing scalable computing resources and storage via the
                  internet.
                </p>
                <p>
                  4.7 <span>★★★★</span>★ ( 1,507 )
                </p>
                <Link to="/mentorship">
                  <button className="btn">Know More</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="course">
            <div>
              <img src={ds} alt="" />
              <div>
                <h2>Data Science</h2>
                <p>
                  Analyzing large data sets to extract insights and inform
                  decisions.
                </p>
                <p>
                  4.8 <span>★★★★</span>★ ( 1,501 )
                </p>
                <Link to="/mentorship">
                  <button className="btn">Know More</button>
                </Link>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Popularcourse;
