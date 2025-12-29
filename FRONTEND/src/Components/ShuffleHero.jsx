import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import images1 from '../assets/Advanced Course Images/Data science/DS.jpg'
import images2 from '../assets/Advanced Course Images/Digital Markting/DM.png'
import images3 from '../assets/Advanced Course Images/Investment banking/IB 6.jpg'
import images4 from '../assets/Advanced Course Images/Mern Stack Development/MSD 2.jpg'
import images5 from '../assets/Advanced Course Images/Product management/PM 4.jpg'
import images6 from '../assets/Advanced Course Images/Product management/pm.jpg'
import images7 from '../assets/Advanced Course Images/Data science/DS 3.jpg'
import images8 from '../assets/Advanced Course Images/Digital Markting/DM 3.jpg'
import images9 from '../assets/mentorshipcourses/DA.jpg'

const ShuffleHero = () => {
    const el = useRef(null);
    useEffect(() => {
      const typed = new Typed(el.current, {
        strings: [
          'A Successful Career In Tech',
          'A Path Way to Tech Career',
          'Skills for Your Dream Job.',
          'Expert Professional',
          'Industry-Focused Skills',
          'Essential Tech Tools.',
          'Navigate Your Tech Career.',
          'Building a Future in Tech',
          'Turn Passion into Tech.'
        ],
        typeSpeed: 110,
        loop: true,
      });
      
      return () => {
        typed.destroy();
      };
    }, []);
    
  return (
    <section className="w-ful px-[20px] py-[30px] grid grid-cols-1 md:grid-cols-2 items-center gap-10 ">
      <div className="textsuffle">
        <h2 style={{color:"rgb(241 91 41)",textAlign:'left'}} className="block mb-4 text-3xl font-medium">
         | Best Learning Platform
        </h2>
        <p className="text-xl md:text-5xl font-semibold text-white" style={{fontSize:'40px'}}>
          Transform Your Passion into <br />  <span className="text-md tracking-tighter" ref={el} style={{color:"rgb(241 91 41)"}} />
        </p>  
        <br/>
        {/* <h1 id="newh1">Kickstart Your Career with Online Courses + Internships | Bangalore, Delhi, Mumbai, etc.</h1> */}
        <p className="text-white max-w-[500px]">At KRUTANIC, we transform your passion into a successful profession. Our expertly crafted digital skill development courses provide you with the tools to excel in today’s competitive digital world. Join us now and take the first step toward a bright future. 
        Join us and start your future.</p>
        <br/>
        
        <Link to='/Advance'><button className="bg-white hover:text-orange-700 text-black font-bold py-2 px-4 rounded">KNOW MORE</button></Link>
      </div>
      <ShuffleGrid />
    </section>
  );
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};


const squareData = [
  {
    id: 1,
   src:`${images1}`,
  },
  {
    id: 2,
   src:`${images2}`,
  },
  {
    id: 3,
   src:`${images3}`,
  },
  {
    id: 4,
   src:`${images4}`,
  },
  {
    id: 5,
   src:`${images5}`,
  },
  {
    id: 6,
   src:`${images6}`,
  },
  {
    id: 7,
   src:`${images7}`,
  },
  {
    id: 8,
   src:`${images8}`,
  },
  {
    id: 9,
   src:`${images9}`,
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 4.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        borderRadius:"10px"
        
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 4000);
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;