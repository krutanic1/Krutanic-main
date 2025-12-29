import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const OurPartner = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 8,
    slidesToScroll: 2,
    dots: false,
    rtl: true, 
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };
  return (
    <div className="clients">
      <div className="container">
        <Slider {...settings}>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src="https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg"/>
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src="https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
            <div className="box">
              <img alt="client logo" className="client-img" src= "https://www.wipro.com/content/dam/wipro/social-icons/wipro_new_logo.svg" />
            </div>
        </Slider>
      </div>
    
    </div>
  );
};

export default OurPartner;
