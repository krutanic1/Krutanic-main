import { useEffect, useState } from "react";
import Slider from "react-slick"; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; // Slick Carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Slick Carousel Theme CSS

import AOS from "aos";
import "aos/dist/aos.css";


import danish from '../assets/developers/danish.jpg'
import suryansh from '../assets/developers/suryanshsaxena.jpg'
import affan from '../assets/developers/affan.jpg'

import gallery1 from '../assets/gallery/1.jpg'
import gallery2 from '../assets/gallery/2.jpg'
import gallery3 from '../assets/gallery/3.jpg'
import gallery4 from '../assets/gallery/4.jpg'
import gallery5 from '../assets/gallery/5.jpg'
import gallery6 from '../assets/gallery/6.jpg'
import gallery7 from '../assets/gallery/7.jpg'
import gallery8 from '../assets/gallery/8.jpg'
import gallery9 from '../assets/gallery/9.jpg'
import gallery10 from '../assets/gallery/10.jpg'
import gallery11 from '../assets/gallery/11.jpg'
import gallery12 from '../assets/gallery/12.jpg'
import gallery13 from '../assets/gallery/13.jpg'
import gallery14 from '../assets/gallery/14.jpg'
import gallery15 from '../assets/gallery/15.jpg'
import gallery16 from '../assets/gallery/16.jpg'




import { FaBookOpen } from "react-icons/fa";
import { BsBriefcaseFill } from "react-icons/bs";
import { BsFillLaptopFill } from "react-icons/bs";
import { GiOnTarget } from "react-icons/gi";
import Getintouch from "../Components/Getintouch";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const settings = {
    infinite: true,
    speed: 500, 
    slidesToShow: 4,
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 2000, 
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4, 
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [cards, setCards] = useState([
    `${danish}`,
    `${suryansh}`,
    `${affan}`,
  ]);


  const moveCard = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const lastCard = newCards.pop();
      newCards.unshift(lastCard);
      return newCards;
    });
  };

  useEffect(() => {
    const autoplayInterval = setInterval(moveCard, 4000);
    return () => clearInterval(autoplayInterval);
  }, []);


  const handleCardClick = (index) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const card = newCards.splice(index, 1)[0];
      newCards.unshift(card);
      return newCards;
    });
  };


  return (
      <div className="main_container" id="aboutus">
        <div id="abouttopcontent" className="px-[10px] py-[60px]">
          <main data-aos="fade-up">
            <div  className="content">
              <h2 className="title">About Us</h2>
              <p className="font-semibold">
              Krutanic is your trusted partner for career growth, offering advanced tech courses designed to prepare you for the fast-paced job market. We focus on delivering industry-relevant skills through expert guidance, ensuring that you gain both theoretical knowledge and practical experience. Each course is backed by hands-on projects, allowing you to work on real-world challenges that employers value. Whether you're starting your career or looking to upskill, our programs in Web Development, Data Science, and Digital Marketing are tailored to help you succeed. Join Krutanic today and take the next step toward achieving your career goals.
              </p>
            </div>

            <div className="stack">
              {cards.map((cardId, index) => (
                <div
                  key={cardId}
                  className={`card`}
                  onClick={() => handleCardClick(index)}
                >
                  <img src={cardId} alt="" />
                </div>
              ))}
            </div>
          </main>
        </div>
        <hr className=" opacity-10"/>

   
        <section className="px-[10px] py-[60px]">
          <div className=" mx-auto">
            <h2
              data-aos="fade-up"
              className="text-3xl font-bold text-center title mb-8"
            >
              Our Mission
            </h2>
            <div className="max-w-3xl mx-auto text-lg text-center flex flex-col gap-5 tracking-tighter">
              <p data-aos="fade-up" className="">
                we strive to redefine upskilling through transformative, By
                merging academic rigor with practical learning with expert
                mentorship, hands-on experiences, and an enhanced curriculum, we
                equip individuals with the tools to solve complex challenges,
                innovate, and lead confidently in their careers.
              </p>
              <p data-aos="fade-up" className="">
                Our commitment extends beyond traditional learning, critical
                thinking and real-world problem-solving in a supportive
                environment that inspires growth and success.
              </p>
            </div>
          </div>
        </section>
        

  
        <section className="px-[10px] py-[60px]">
          <div className=" mx-auto">
            <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-8 title">
              Our Story
            </h2>
            <div className="mx-auto max-w-3xl text-lg text-center flex flex-col gap-10 tracking-tighter">
              <p data-aos="fade-up">
                Founded in 2024, Krutanic emerged with a vision to
                make quality education accessible to all. What started as a
                small initiative has grown into a leading corporate company
                trusted by thousands of learners globally.
              </p>
              <p data-aos="fade-up">
                From full-stack web development to AI, data analytics, and cyber
                security, our programs are carefully curated to align with
                industry demands. With a focus on practical learning and career
                readiness, we have successfully guided countless students toward
                achieving their professional dreams.
              </p>
              <p data-aos="fade-up">
                Today, Krutanic continues to innovate, expanding our
                course offerings and strengthening partnerships with industry
                leaders to ensure our learners are future-ready.
              </p>
            </div>
          </div>
        </section>
        <hr className=" opacity-10"/>

        <section className="px-[10px] py-[60px] z-10 ourteam relative">
        <h2 data-aos="fade-up"   className="text-4xl font-bold text-center mb-12 text-orange-700">
          | Life at Krutanic
        </h2>
        <div data-aos="fade-up"  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4 ">
        <div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery4} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery1} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery2} alt="" className="object-cover w-full h-full" />
          </div>
         
          {/* <div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery3} alt="" className="object-cover w-full h-full" />
          </div> */}
<div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery5} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery6} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery8} alt="" className="object-cover w-full h-full" />
          </div>
          

         
          {/* <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery9} alt="" className="object-cover w-full h-full" />
          </div> */}
          
        
          {/* <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery12} alt="" className="object-fill w-full h-full" />
          </div> */}
          {/* <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery15} alt="" className="object-cover w-full h-full" />
          </div> */}
          
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery16} alt="" className="object-cover w-full h-full " />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery7} alt="" className="object-cover w-full h-full" />
          </div>
         
         
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center col-span-2">
            <img src={gallery10} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center">
            <img src={gallery14} alt="" className="object-cover w-full h-full" />
          </div>

         

         
         
         
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center lg:col-span-3">
            <img src={gallery11} alt="" className="object-cover w-full h-full " />
          </div>
        
          <div className="relative overflow-hidden rounded-lg flex items-center justify-center lg:col-span-3">
            <img src={gallery13} alt="" className="object-center w-full h-full  " />
          </div>
          
         
        </div>
        </section>
        <hr className=" opacity-10"/>

 
        <section className="px-[10px] py-[60px]">
          <div className="aboutus" >
            <h2 data-aos="fade-up" className="text-3xl font-bold text-center title mb-8">
              Our Approach
            </h2>
            <div data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              {[
                {
                  title: "Wide Range of Courses",
                  description:
                    "Explore diverse, industry-focused courses to boost your skills.",
                    icon:<FaBookOpen />
                },
                {
                  title: "Industry Expertst",
                  description:
                    "Learn from experienced professionals with real-world insights.",
                    icon:<BsBriefcaseFill />
                },
                {
                  title: "Hands-on Learning",
                  description:
                    "Work on real-world projects to build practical experience.",
                    icon:<BsFillLaptopFill />
                },
                {
                  title: "Career Support",
                  description:
                    "Get personalized placement assistance to land your ideal job.",
                    icon:<GiOnTarget />
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="py-6 text-center bg-[#080808] rounded-md">
                    <span className="text-4xl mb-2 font-bold flex items-center justify-center text-orange-800">{item.icon}</span>
                    <h3 className="font-semibold text-lg mb-2"> {item.title}</h3>
                    <p className="">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <Getintouch/>
        </section>

      </div>
  );
};

export default AboutUs;
