import React, { useState } from "react";
import logo from "../assets/LOGO3.png";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Events from "./Events";
import toast, { Toaster } from "react-hot-toast";
import Playground from "./Playground";
const EventDashBoard = () => {
  const [activePage, setActivePage] = useState("events");
  const [information, setInformation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("eventUserName") || "User";

  const handleLogOut = () => {
    toast.success("Logout Successful!");
    setTimeout(() => {
      localStorage.removeItem("eventuserId");
      localStorage.removeItem("eventuserEmail");
      localStorage.removeItem("eventToken");
      localStorage.removeItem("eventUserName");
      navigate("/events");
    }, 1500);
  };

  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <Profile />;
      case "quiz":
        return <Playground />;
      case "events":
        return <Events />;
      default:
        return <Events />;
    }
  };

  const navigationItems = [
    { id: "events", label: "Events", icon: "fa-calendar" },
    { id: "quiz", label: "Playground", icon: "fa-gamepad" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-center" />

      {/* Modern Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={logo}
                alt="Krutanic"
                className="h-10 cursor-pointer"
                onClick={() => navigate("/events")}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${activePage === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <i className={`fa ${item.icon} mr-2`}></i>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* WhatsApp Support Button */}
              <a
                href="https://wa.me/7795680178?text=I%20am%20here%20from%20events%20dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium"
              >
                <i className="fa fa-whatsapp text-xl"></i>
                <span className="hidden lg:block">Support</span>
              </a>

              {/* User Profile Button */}
              <button
                onClick={() => setActivePage("profile")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${activePage === "profile"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block font-medium">{userName}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg font-medium text-left transition-all ${activePage === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <i className={`fa ${item.icon} mr-3`}></i>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2026 Krutanic Events. All Rights Reserved.
            </p>
            <div className="flex items-center gap-3">
              {/* Info Button */}
              <button
                onClick={() => setInformation(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium"
              >
                <i className="fa fa-info-circle"></i>
                <span className="hidden sm:inline">Rewards Info</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium"
              >
                <i className="fa fa-sign-out"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Information Modal */}
      {information && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">🏆 Krutanic Coins Rewards</h2>
              <button
                onClick={() => setInformation(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <p className="text-gray-800">
                  <strong className="text-blue-700">Collect 5000 Krutanic Coins</strong> to unlock exclusive offers and rewards!
                </p>
              </div>

              {/* Main Offers */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-2">
                    ⭐
                  </span>
                  Available Offers
                </h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                    <h4 className="font-semibold text-gray-900 mb-1">Krutanic Self-Learning Program</h4>
                    <p className="text-sm text-gray-600">Choose any domain and gain access to our comprehensive self-learning program.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                    <h4 className="font-semibold text-gray-900 mb-1">Placement Assistance Program</h4>
                    <p className="text-sm text-gray-600">Get expert guidance and support to kickstart your career journey.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                    <h4 className="font-semibold text-gray-900 mb-1">₹1000 Cash Reward</h4>
                    <p className="text-sm text-gray-600">Redeem your coins to receive up to ₹1000 in cash.</p>
                  </div>
                </div>
              </div>

              {/* Additional Offers */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-2">
                    💰
                  </span>
                  Bonus Offers
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Add 2000 Coins → Get ₹2000 Cash</h4>
                    <p className="text-sm text-gray-600">Add 2000 more coins to your redemption and receive up to ₹2000.</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Add 4000 Coins → Get ₹3000 Cash</h4>
                    <p className="text-sm text-gray-600">Increase to 9000 total coins and receive up to ₹3000 in cash.</p>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <p className="font-semibold text-gray-900 mb-2">Ready to redeem your coins?</p>
                <p className="text-gray-600 mb-3">Contact us to convert your Krutanic Coins into any of the offers above.</p>
                <div className="flex items-center space-x-2 text-blue-600">
                  <i className="fa fa-envelope"></i>
                  <a
                    href="mailto:support@krutanic.com"
                    className="font-semibold hover:underline"
                  >
                    support@krutanic.com
                  </a>
                </div>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-500 text-center italic">
                Make sure to collect enough coins to access these valuable offers!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashBoard;
