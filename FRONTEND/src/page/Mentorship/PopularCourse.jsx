import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const thumbnail = (fileName) => `/course_thumbnails/${encodeURIComponent(fileName)}`;


const PopularCourse = ({ hideHeading = false }) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const popularCourses = [
    {
      id: 1,
      title: "Full Stack Web Developer",
      description: "Building and managing both the front-end and back-end of websites",
      rating: 4.7,
      studentsTaken: 2298,
      image: thumbnail("Full Stack Web.jpg"),
      },
    {
      id: 2,
      title: "Artificial Intelligence",
      description: "Creating systems that simulate human intelligence for tasks like decision-making.",
        rating: 4.8,
        studentsTaken: 2340,
      image: thumbnail("Artificial Intelligence.jpg"),
      },
    {
      id: 3,
      title: "Data Analytics",
      description: "Interpreting data to help businesses improve performance and make decisions.",
        rating: 4.7,
        studentsTaken: 2690,
      image: thumbnail("Data Analytics.jpg"),
      },
    {
      id: 4,
      title: "Cloud Computing",
      description: "Providing scalable computing resources and storage via the internet.",
        rating: 4.8,
        studentsTaken: 2156,
      image: thumbnail("Cloud Computing.jpg"),
      },
    {
      id: 5,
      title: "Data Science",
      description: "Analyzing large data sets to extract insights and inform decisions.",
      rating: 4.8,
      studentsTaken: 2699,
      image: thumbnail("Data Science.jpg"),
      },
    {
      id: 6,
      title: "Digital Marketing",
      description: "Promoting products and services through digital channels like social media and search engines.",
        rating: 4.7,
        studentsTaken: 2257,
      image: thumbnail("Digital Marketing.jpg"),
      },
  ];


  return (
    <section className="py-[60px] px-[10px]">
      <div className="container mx-auto">
        {!hideHeading && (
          <h1 className=" font-bold text-center text-[#f15b29] lg:mb-10 mb-6">
            | Our Popular Courses
          </h1>
        )}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:px-10"
        >
          {popularCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white text-[#101522] border border-[#d8deea] shadow-md shadow-slate-300/40 rounded-xl overflow-hidden group transition duration-300 cursor-pointer ${
                hoveredId && hoveredId !== course.id
                  ? "lg:filter lg:blur-sm"
                  : ""
              }`}
              onClick={() => {
                if (course.title === "Full Stack Web Developer") {
                  navigate("/mentorship/full-stack-web-development");
                  window.scrollTo(0, 0);
                }
              }}
              onMouseEnter={() => setHoveredId(course.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="px-3 py-3">
                <h3 className="text-xl font-semibold mb-2 text-[#111827]">
                  {course.title}
                </h3>
                <p className="text-[#475467]">{course.description}</p>
                <p className="mb-2 text-[#344054]">{course.rating} <span className="text-[#f15b29]">★★★★</span>★ ({course.studentsTaken}) </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourse;
