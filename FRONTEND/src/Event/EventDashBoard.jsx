import React, { useState } from "react";
import logo from "../assets/logowhite.png";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Events from "./Events";
import toast, { Toaster } from "react-hot-toast";
import Playground from "./Playground";

const EventDashBoard = () => {
  const [activePage, setActivePage] = useState("events");
  const [information, setInformation] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    toast.success("Logout Successful!", {
      style: {
        border: "1px solid #f15b29",
        padding: "16px",
        color: "#ffffff",
        background: "#1d1e20",
      },
      iconTheme: {
        primary: "#f15b29",
        secondary: "#ffffff",
      },
    });
    setTimeout(() => {
      localStorage.removeItem("eventuserId");
      localStorage.removeItem("eventuserEmail");
      localStorage.removeItem("eventToken");
      localStorage.removeItem("eventUserName");
      navigate("/Talenthunt");
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

  return (
    <div className="">
      <Toaster position="top-center" reverseOrder={false} />

      <header className="sticky top-0 z-50 bg-[#080808] text-white  shadow-lg px-[10px] py-3">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="Logo"
            className="w-24 lg:w-36 transform hover:scale-105 transition-transform duration-300"
          />

          <nav className="flex gap-2 font-semibold">
            <button
              onClick={() => setActivePage("events")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activePage === "events"
                  ? " text-purple-700 ease-linear duration-300 shadow-md"
                  : " hover:bg-gray-950"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActivePage("quiz")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activePage === "quiz"
                  ? " text-purple-700 ease-linear duration-300 shadow-md"
                  : " hover:bg-gray-950"
              }`}
            >
              Playground
            </button>
          </nav>

          <i
            onClick={() => setActivePage("profile")}
            className={`fa fa-user text-xl mr-2 cursor-pointer ease-linear hover:text-purple-700 transition-colors duration-300 ${
              activePage === "profile"
                ? " text-purple-700 ease-linear duration-300 shadow-md"
                : " hover:bg-gray-950"
            }`}
            aria-hidden="true"
          />
        </div>
      </header>

      <main>{renderPage()}</main>

      <footer className="backdrop-blur-md sticky b-0 z-50 text-white bg-[#080808]  px-[10px] py-2 shadow-lg">
        <div className=" mx-auto flex items-center justify-between">
          <p className="text-sm opacity-75 hover:opacity-100 transition-opacity duration-300">
            © 2024 Krutanic Event. All Rights Reserved.
          </p>
          <div className="flex gap-4 items-center">
            <i
              className="fa fa-info-circle text-xl hover:text-purple-700 ease-linear duration-300 shadow-md animate-bounce cursor-pointer"
              onClick={() => setInformation(true)}
              aria-hidden="true"
            ></i>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </footer>

      {information && (
        <div className="fixed inset-0 z-50 bg-opacity-70 bg-black p-3  flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <span className=" text-xl cursor-pointer float-right" onClick={() => setInformation(false)}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </span>
            <div className="p-4">
              <h2 className="text-center font-bold text-xl mb-4">
                Krutanic Coins Redemption Instructions
              </h2>

              <p className="mb-4">
                <strong>Collect 5000 Krutanic Coins:</strong>
                <br />
                Unlock exclusive offers by collecting a total of 5000 Krutanic
                Coins.
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">
                  Available Offers:
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Krutanic Self-Learning Program: </strong> Choose any
                    domain and gain access to our self-learning program.
                  </li>
                  <li>
                    <strong>Placement Assistance Program: </strong> Get access
                    to our placement assistance program to help kickstart your
                    career.
                  </li>
                  <li>
                    <strong>₹1000 Cash: </strong> Redeem your coins to receive
                    up to ₹1000 in cash.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">
                  Additional Offers:
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Add 2000 Coins for ₹2000 Cash: </strong> Add 2000
                    more coins to your redemption and receive up to ₹2000 in
                    cash.
                  </li>
                  <li>
                    <strong>Add 4000 Coins for ₹3000 Cash: </strong> Increase
                    your total redemption to 9000 coins and receive up to ₹3000
                    in cash.
                  </li>
                </ul>
              </div>

              <p className="mb-4">
                <strong>Note:</strong> Make sure to collect enough coins to
                access these valuable offers!
              </p>

              <div className="border border-gray-950 p-4 rounded-md text-center">
                <p className="font-semibold">Ready to redeem your coins?</p>
                <p>
                  Contact us to convert your Krutanic Coins into any of the
                  offers above.
                </p>
                <p className="mt-2 font-semibold">
                  Email:{" "}
                  <a
                    href="mailto:support@krutanic.com"
                    className="text-blue-600 underline"
                  >
                    support@krutanic.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashBoard;
