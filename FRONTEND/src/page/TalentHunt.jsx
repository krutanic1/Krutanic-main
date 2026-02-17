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
  const [topEarners, setTopEarners] = useState([]);
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
    fetchTopEarners();
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

  const fetchTopEarners = async () => {
    try {
      const response = await axios.get(`${API}/top-earners`);
      setTopEarners(response.data);
    } catch (error) {
      console.error("Error fetching top earners:", error);
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

      {/* Top Winners Section */}
      {topEarners.length > 0 && (
        <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
                🏆 Previous Top Winners
              </h2>
              <p className="text-purple-200 text-sm md:text-lg">Champions who won prizes across all events</p>

              {/* Total Distributed Prizes Banner */}
              <div className="mt-4 md:mt-6 inline-block">
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-4 py-2 md:px-8 md:py-4 rounded-full shadow-2xl border-2 md:border-4 border-green-300 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xl md:text-3xl">💰</span>
                    <div className="text-left">
                      <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">Distributed Prizes Till Now</p>
                      <p className="text-white font-bold text-xl md:text-2xl lg:text-3xl">₹30,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Podium Display */}
            <div className="flex justify-center items-end gap-2 md:gap-4 lg:gap-8 max-w-4xl mx-auto">
              {/* Second Place */}
              {topEarners[1] && (
                <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
                  <div className="relative mb-2 md:mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center border-2 md:border-4 border-gray-400 shadow-2xl">
                      {topEarners[1].profilePhoto ? (
                        <img src={topEarners[1].profilePhoto} alt={topEarners[1].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">2</span>
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-sm md:text-xl font-bold text-gray-700">2</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-t-2xl px-3 py-4 md:px-6 md:py-8 lg:py-12 w-28 md:w-40 lg:w-48 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <p className="text-white font-bold text-xs md:text-base lg:text-lg mb-1 md:mb-2 line-clamp-1">{topEarners[1].name || 'Gaurav Singh'}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2 mb-1 md:mb-2">
                      <p className="text-yellow-300 font-bold text-base md:text-xl lg:text-2xl">₹{topEarners[1].totalPrizeMoney || 0}</p>
                      <p className="text-gray-200 text-xs hidden md:block">Total Prize Won</p>
                    </div>
                    <p className="text-gray-200 text-xs hidden md:block">🪙 {topEarners[1].totalCoins || 0} coins • {topEarners[1].eventsWon || 0} events</p>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topEarners[0] && (
                <div className="flex flex-col items-center" data-aos="fade-up">
                  <div className="relative mb-2 md:mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center border-2 md:border-4 border-yellow-500 shadow-2xl animate-pulse">
                      {topEarners[0].profilePhoto ? (
                        <img src={topEarners[0].profilePhoto} alt={topEarners[0].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">1</span>
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-xl md:text-2xl font-bold text-yellow-900">👑</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-600 rounded-t-2xl px-3 py-6 md:px-6 md:py-12 lg:py-16 w-32 md:w-48 lg:w-56 text-center shadow-2xl transform hover:scale-105 transition-all duration-300 relative">
                    <div className="absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-2 py-0.5 md:px-4 md:py-1 rounded-full text-xs font-bold shadow-lg">
                      CHAMPION
                    </div>
                    <p className="text-white font-bold text-sm md:text-lg lg:text-xl mb-2 md:mb-3 line-clamp-1">{topEarners[0].name || 'Preeti Shinde'}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 md:px-4 md:py-2 mb-1 md:mb-2">
                      <p className="text-yellow-100 font-bold text-lg md:text-2xl lg:text-3xl">₹{topEarners[0].totalPrizeMoney || 0}</p>
                      <p className="text-yellow-200 text-xs hidden md:block">Total Prize Won</p>
                    </div>
                    <p className="text-yellow-100 text-xs hidden md:block">🪙 {topEarners[0].totalCoins || 0} coins • {topEarners[0].eventsWon || 0} events</p>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topEarners[2] && (
                <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
                  <div className="relative mb-2 md:mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 flex items-center justify-center border-2 md:border-4 border-orange-500 shadow-2xl">
                      {topEarners[2].profilePhoto ? (
                        <img src={topEarners[2].profilePhoto} alt={topEarners[2].name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">3</span>
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-sm md:text-xl font-bold text-orange-900">3</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-2xl px-3 py-4 md:px-6 md:py-8 lg:py-12 w-28 md:w-40 lg:w-48 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <p className="text-white font-bold text-xs md:text-base lg:text-lg mb-1 md:mb-2 line-clamp-1">{topEarners[2].name || 'Saloni Pal'}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2 mb-1 md:mb-2">
                      <p className="text-yellow-300 font-bold text-base md:text-xl lg:text-2xl">₹{topEarners[2].totalPrizeMoney || 0}</p>
                      <p className="text-orange-100 text-xs hidden md:block">Total Prize Won</p>
                    </div>
                    <p className="text-orange-100 text-xs hidden md:block">🪙 {topEarners[2].totalCoins || 0} coins • {topEarners[2].eventsWon || 0} events</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional mentees if any */}
            {topEarners.length > 3 && (
              <div className="text-center mt-8">
                <div className="flex justify-center items-center gap-2">
                  {topEarners.slice(3, 7).map((earner, index) => (
                    <div key={earner._id} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg overflow-hidden">
                      {earner.profilePhoto ? (
                        <img src={earner.profilePhoto} alt={earner.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white font-bold">
                          {earner.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  ))}
                  <span className="text-purple-200 font-semibold ml-2">+{topEarners.length - 3}k Mentees</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TalentHunt;
