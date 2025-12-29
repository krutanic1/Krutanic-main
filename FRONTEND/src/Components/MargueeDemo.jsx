import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MarqueeDemo = () => {
  const sliderSettings = {
    slidesToScroll: 1,
    slidesToShow: 4,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    speed: 8000,
    arrows: false,
  };

  return (
    <section id="features" className="blue">
      <div className="content">
        <Slider {...sliderSettings} className="slider slider-nav">
          <div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt=""
                src="https://avatar.vercel.sh/jane"
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  <h1>hello</h1>
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt=""
                src="https://avatar.vercel.sh/jane"
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  <h1>hello</h1>
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt=""
                src="https://avatar.vercel.sh/jane"
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  <h1>hello</h1>
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt=""
                src="https://avatar.vercel.sh/jane"
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  <h1>hello</h1>
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="rounded-full"
                width="32"
                height="32"
                alt=""
                src="https://avatar.vercel.sh/jane"
              />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  <h1>hello</h1>
                </figcaption>
                <p className="text-xs font-medium dark:text-white/40">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default MarqueeDemo;
