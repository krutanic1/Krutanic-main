import { Helmet } from "react-helmet";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import API from "../API";
import logo from '../assets/LOGO3.png';
import Footer from "../Components/Footer";
import Header from "../Components/Header";

import Typed from 'typed.js';

const TalentHunt = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const el = React.useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Upcoming Events'],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events/summary`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinNow = (eventId) => {
    const token = localStorage.getItem("eventToken");
    if (token) {
      // User is logged in, redirect to dashboard
      navigate("/EventDashboard");
    } else {
      // User not logged in, redirect to login
      navigate("/EventLogin", { state: { message: "Please login to join this event", from: { pathname: "/EventDashboard" } } });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Krutanic Talent Hunt | Discover Top Tech Talent</title>
        <meta name="description" content="Participate in Krutanic Talent Hunt events and showcase your skills." />
      </Helmet>
      <Toaster position="top-center" />

      <Header />



      {/* Events Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-12">
            <div className="flex items-center mb-3">
              <div className="h-10 w-1.5 bg-orange-600 mr-4 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-600">
                <span ref={el}></span>
              </h2>
            </div>
            <p className="text-orange-600 text-lg ml-6">Browse our latest training programs and workshops</p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div
                  key={event._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Event Image */}
                  <div className="h-56 overflow-hidden relative p-3">
                    <Link to={`/register/${event.slug}`}>
                      <img
                        src={event.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent m-3 rounded-lg pointer-events-none"></div>
                    <div className="absolute top-7 right-7 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                      {event.type || "Workshop"}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <Link to={`/register/${event.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] hover:text-orange-600 transition-colors">
                        {event.title}
                      </h3>
                    </Link>

                    {/* Date & Time */}
                    {(event.startDate || event.start || event.date) && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">
                          {new Date(event.startDate || event.start || event.date).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {event.shortDescription || event.fullDescription || event.description || "Enhance your skills with our comprehensive training program designed by industry experts."}
                    </p>

                    {/* Footer with CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-semibold">
                          {event.coin ? (
                            <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                              <span className="mr-1">🏆</span> {event.coin} Coins
                            </span>
                          ) : (
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Free Entry</span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/register/${event.slug}`}
                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-7xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Active Events</h3>
              <p className="text-gray-600 text-lg mb-6">Check back soon for upcoming training programs and workshops!</p>
              <Link
                to="/ContactUs"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Us for Updates
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TalentHunt;
