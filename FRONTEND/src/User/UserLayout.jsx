import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import UserSidebar from "./UserSidebar";

const UserLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <Link to="/Dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Krutanic" className="h-8" />
          </Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            to="/Dashboard"
            className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-bold leading-normal tracking-wide"
          >
            <span className="truncate">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <UserSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background-light">
          {title && (
            <div className="bg-white border-b border-gray-100 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
