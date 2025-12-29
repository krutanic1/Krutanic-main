import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import c1 from "../assets/company logo/1.png";
import c2 from "../assets/company logo/2.png";
import c3 from "../assets/company logo/3.png";
import c4 from "../assets/company logo/4.png";
import c5 from "../assets/company logo/5.png";
import c6 from "../assets/company logo/6.png";
import c7 from "../assets/company logo/7.png";
import c8 from "../assets/company logo/8.png";
import c9 from "../assets/company logo/9.png";
import c10 from "../assets/company logo/10.png";
import c11 from "../assets/company logo/11.png";
import c12 from "../assets/company logo/12.png";
import c13 from "../assets/company logo/13.png";
import c14 from "../assets/company logo/14.png";
import c15 from "../assets/company logo/15.png";
import c16 from "../assets/company logo/16.png";
import c17 from "../assets/company logo/17.png";
import c18 from "../assets/company logo/18.png";
import c19 from "../assets/company logo/19.png";
import c20 from "../assets/company logo/20.png";
import c21 from "../assets/company logo/21.png";
import c22 from "../assets/company logo/22.png";
import c23 from "../assets/company logo/23.webp";
import c24 from "../assets/company logo/24.png";
import c25 from "../assets/company logo/25.png";
import c26 from "../assets/company logo/26.png";
import c27 from "../assets/company logo/27.png";
import c28 from "../assets/company logo/28.png";

const ClientsCarousel = () => {
  const settings = {
    Infinite: true,
    autoplay: true,
    autoplaySpeed: -100,
    slidesToShow: 10,
    slidesToScroll: 1,
    cssEase: "linear",
    speed: 4000,
    arrow: false,
  };

  const settings1 = {
    Infinite: true,
    autoplay: true,
    autoplaySpeed: -100,
    slidesToShow: 10,
    slidesToScroll: 1,
    cssEase: "linear",
    dots: false,
    speed: 4000,
    arrow: false,
    rtl: true,
  };

  return (
    <div className="workatslider">
      <div className="clients">
        <Slider {...settings}>
          <div className="box">
            <img alt="client logo" className="client-img" src={c1} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c2} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c3} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c4} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c5} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c6} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c7} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c8} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c9} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c10} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c11} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c12} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c13} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c14} />
          </div>
        </Slider>
      </div>
      <div className="clients">
        <Slider {...settings1}>
          <div className="box">
            <img alt="client logo" className="client-img" src={c15} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c16} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c17} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c18} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c19} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c20} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c21} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c22} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c23} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c24} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c25} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c26} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c27} />
          </div>
          <div className="box">
            <img alt="client logo" className="client-img" src={c28} />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default ClientsCarousel;
