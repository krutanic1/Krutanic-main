import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import akash from "../assets/mentors/akash.jpg";
import deepak from "../assets/mentors/deepak.jpg";
import nishitha from "../assets/mentors/nishitha.jpg";
import subra from "../assets/mentors/Subhra.jpg";
import rudra from "../assets/mentors/rudra.jpg";
import rahul from "../assets/mentors/rahul.jpg";
import aashish from "../assets/mentors/aashish.jpg";
import sachin from "../assets/mentors/sachin.jpg";

const mentors = [
  {
    name: "Akash R",
    designation: "Graphic Design",
    experience: "5.5+ year",
    image: `${akash}`,
  },
  {
    name: "Deepak Kumar",
    designation: "Mobile App Developement",
    experience: "5+ year",
    image: `${deepak}`,
  },
  {
    name: "Nishitha Jha",
    designation: "Psychology",
    experience: "7+ year",
    image: `${nishitha}`,
  },
  {
    name: "Subra Prakash",
    designation: "Sr. SME Data Science",
    experience: "7+ year",
    image: `${subra}`,
  },
  {
    name: "Rahul Srivastava",
    designation: "Embedded System",
    experience: "19+ year",
    image: `${rahul}`,
  },
  {
    name: "Rudra Pratap",
    designation: "Cyber Security",
    experience: "6.5+ year",
    image: `${rudra}`,
  },
  {
    name: "Dr Aashish MIshra",
    designation: "Artificial Intelligence",
    experience: "17+ year",
    image: `${aashish}`,
  },
  {
    name: "Sachin Kumar",
    designation: "Full Stack Web Development",
    experience: "6+ year",
    image: `${sachin}`,
  },
];

const MentorShipMentors = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div className="container mx-auto">
      <div data-aos="fade-up" className="  text-center">
        <h1
          data-aos="fade-up"
          className="text-3xl text-[#f15b29] font-bold mb-4"
        >
          Meet our Mentors{" "}
        </h1>
        <p data-aos="fade-up" className="text-white mb-8">
          Meet the talented and creative minds behind our work. Our mentors
          bring a wealth of experience and a passion for innovation to every
          mentorship course.
        </p>

        <div
          data-aos="fade-up"
          className="grid grid-cols-2 md:grid-cols-4 gap-[10px]"
        >
          {mentors.map((mentor) => (
            <div className=" drop-shadow-lg bg-[#ffffff08] text-[#f15b29] p-[10px]  shadow-md rounded-lg  text-center">
              <div className="rounded-full overflow-hidden h-[100px] w-[100px] mx-auto">
                <img src={mentor.image} alt={mentor.name} className="" />
              </div>
              <h3 className="font-semibold text-lg mt-2">{mentor.name}</h3>
              <p className="text-white text-xs">{mentor.designation}</p>
              <p className="text-white">{mentor.experience}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorShipMentors;
