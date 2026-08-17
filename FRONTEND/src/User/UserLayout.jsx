import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import UserSidebar from "./UserSidebar";
import axios from "axios";
import API from "../API";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, profileRes] = await Promise.all([
          axios.get(`${API}/users`, { params: { userId }, headers }),
          axios.get(`${API}/profile`, { params: { userId }, headers }).catch(() => ({ data: null }))
        ]);
        setUserData(userRes.data);
        setUserProfile(profileRes.data);
      } catch (err) {
        console.log("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [userId]);

  const handleWhatsAppSupport = () => {
    const phoneNumber = "7795680178";
    const name = userData?.fullname || "Student";
    const email = userData?.email || "No Email";
    const message = `Hello, I need support.\nName: ${name}\nEmail: ${email}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-20 relative">
        <div className="flex items-center gap-4 text-gray-900">
          <button
            className="p-1 rounded-md hover:bg-gray-100 text-gray-600 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Krutanic" className="h-8" />
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          {/* WhatsApp Support Button */}
          <button
            onClick={handleWhatsAppSupport}
            className="hidden sm:flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold tracking-wide"
            title="Contact Support"
          >
            <i className="fa fa-whatsapp text-lg"></i>
            <span className="truncate">Support</span>
          </button>

          <Link
            to="/Setting"
            className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-bold leading-normal tracking-wide"
          >
            <span className="truncate">Change Password</span>
          </Link>
          <div className="relative group cursor-pointer">
            {userProfile?.personal?.avatar ? (
              <img src={userProfile.personal.avatar} alt="Avatar" className="w-10 h-10 object-cover rounded-full bg-primary/10 border-2 border-primary/20 shadow-sm" />
            ) : (
              <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
                {userData?.fullname?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <UserSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
