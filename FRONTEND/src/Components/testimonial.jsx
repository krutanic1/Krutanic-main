import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import r1 from '../assets/alumini/birendra.jpg';
import r2 from '../assets/alumini/raja.jpg';
import r3 from '../assets/alumini/mithun.jpg';
import r4 from '../assets/alumini/prabhleen.jpg';
import r5 from '../assets/alumini/rohan.jpg';
import r6 from '../assets/alumini/manish.jpg';

const Testimonial = () => {
  
  const settings = {
    Infinite:true,
    autoplay: true,
    autoplaySpeed: -500,
    slidesToShow: 5,
    slidesToScroll:1,
    cssEase:'linear',
    dots: false,
    speed:4000,
    arrow:false,
    // rtl: true,
    
  };

  return (
    <div className="testimonialdiv">
      <div className="testimonialcontainer mb-20">
        <Slider {...settings}>
          <div className="box">
            <div>
              <div className='revtxt'>
                <p>"Recently completed the stock market course  and I found it to be exceptionally informative and beneficial. The course was well-structured, making complex concepts easy to understand. I learned a great deal about price action and technical analysis, which has significantly improved my trading skills. The instructor's knowledge and teaching style were outstanding, providing practical insights that I can apply in real trading scenarios. Overall, this course has greatly enhanced my understanding of the stock market, and I highly recommend it to anyone looking to deepen their knowledge."</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r2} />
                <div>
                <h2>RAJA SINGH</h2>
                <h3>Ujjain Engineering College</h3>
                  <h3>Stock Marketing</h3>
                </div>
              </div>
            </div>

          </div>
          <div className="box">
            <div>
              <div className='revtxt'>
                <p>" I've completed my Internship on Stock market and I am also doing some more courses here. I had really good mentor. Their trainings and internships have made a significant positive impact on my life. If you haven't done internships or want to gain more skills, I highly recommend checking out Krutanic  for all your needs. They truly set the standard for excellence."</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r1} />
                <div>
                <h2>BIRENDRA KUMAR</h2>
                  <h3>TMB University</h3>
                  <h3>Stock Marketing</h3>
            
                </div>
              </div>
            </div>

          </div> <div className="box">
            <div>
              <div className='revtxt'>
                <p>"I'm excited to share that I have successfully completed my Full Stack web development internship at Krutanic.This intership was an incredibly positive experience.The mentors were highly knowledgeable and conducted interactive and engaging sessions.This intership has been a significant milestone in my journey as a aspiring web developer.I am grateful for the guidance and support I received from the talented team at Krutanic.</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r3} />
                <div>
                <h2>MITHUN PRAJAPATI</h2>
                  <h3>VIT Bhopal</h3>
                  <h3>Full Stack Web Development</h3>
            
                </div>
              </div>
            </div>

          </div> <div className="box">
            <div>
              <div className='revtxt'>
                <p>"I just want to share my joyful experience which I got while persuing my internship in Artificial intelligence under Krutanic My mentor Mr. Ashish is very cooperative & kind he is very polite throughout the course helping me with the project whenever needed everything was very well explained during the course it is worth for me to persuade this course Looking forward for more opportunities"</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r4} />
                <div>
                <h2>PRABHLEEN KAUR</h2>
                  <h3>Government Girls College</h3>
                  <h3>Artificial Intelligence</h3>
            
                </div>
              </div>
            </div>

          </div> <div className="box">
            <div>
              <div className='revtxt'>
                <p>"I recently completed an internship with Krutanic, an edutech company, and it was an enriching experience. Krutanic provides an exceptional learning environment with a supportive and knowledgeable team"</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r5} />
                <div>
                <h2>ROHAN SINGH</h2>
                <h3>Amrita Vidyapeeth University</h3>
                  <h3>Embedded System</h3>
            
                </div>
              </div>
            </div>

          </div>
          <div className="box">
            <div>
              <div className='revtxt'>
                <p>"I definitely loved my experience of learning from Krutanic. The mentor i had was truly amazing and the knowledge she holds is just mind blowing. I definitely wanted to learn more and more from her. Also the Krutanic team is amazing and will help you with all your doubts in no time."</p>
              </div>
              <div className='upr'>
                <img alt="client logo" src={r6} />
                <div>
                <h2>MANISH KUMAR</h2>
                  <h3>DY Patil University</h3>
                  <h3>Data Science</h3>            
                </div>
              </div>
            </div>

          </div>
          
         
          
        </Slider>
      </div>


    </div>
  );
};

export default Testimonial;
