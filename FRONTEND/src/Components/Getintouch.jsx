import React from "react";
import logo from "../assets/courses/logo.jpg";
import { Link } from "react-router-dom";

const Getintouch = () => {
  return (
    <div>
      <section className="py-10 px-4 bg-white">
        <div className="container mx-auto">
          <div
            data-aos="fade-up"
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center border border-[#f15b29] bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="md:w-1/3 flex items-center justify-center p-6">
              <div className="text-center">
                <div className=" rounded-full flex items-center justify-center shadow-md mx-auto">
                  <img src={logo} alt="" />
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-6 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Make Contact
              </h2>
              <p className="text-gray-600 mb-6">
                Want to learn more about how Krutanic can shape your
                career? Contact us today, and let’s build your future together!
              </p>
              <button className="bg-[#f15b29] hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md">
                <Link
                  to="/ContactUs"
                 
                >
                  Connect With Us
                </Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Getintouch;
