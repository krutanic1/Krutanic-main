import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import playerlogo from "./playerlogo.jpg";

const NewLearning = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { courseTitle, sessions } = location.state || {};

  const sessionKeys = sessions ? Object.keys(sessions) : [];
  const totalSessions = sessionKeys.length;

  const handleSessionClick = (key, index) => {
    setSelectedSession({ key, ...sessions[key] });
    setCurrentSessionIndex(index);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentSessionIndex > 0) {
      const newIndex = currentSessionIndex - 1;
      const key = sessionKeys[newIndex];
      setSelectedSession({ key, ...sessions[key] });
      setCurrentSessionIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentSessionIndex < totalSessions - 1) {
      const newIndex = currentSessionIndex + 1;
      const key = sessionKeys[newIndex];
      setSelectedSession({ key, ...sessions[key] });
      setCurrentSessionIndex(newIndex);
    }
  };

  const handleSelectChange = (e) => {
    const index = parseInt(e.target.value);
    const key = sessionKeys[index];
    setSelectedSession({ key, ...sessions[key] });
    setCurrentSessionIndex(index);
  };

  useEffect(() => {
    if (sessions && sessionKeys.length > 0) {
      const firstKey = sessionKeys[0];
      setSelectedSession({ key: firstKey, ...sessions[firstKey] });
    }
  }, [sessions]);

  if (!sessions || !selectedSession) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentSessionIndex + 1) / totalSessions) * 100);

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 px-4 md:px-6 py-3 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/Dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Krutanic" className="h-8" />
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/Dashboard" className="text-gray-700 hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
              <Link to="/EnrolledCourses" className="text-primary text-sm font-medium border-b-2 border-primary pb-0.5">My Courses</Link>
            </nav>
            <div className="flex items-center gap-2">
              {/* Mobile back button */}
              <Link
                to="/Dashboard"
                className="flex md:hidden items-center justify-center rounded-lg size-9 bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              {/* Desktop back button */}
              <Link
                to="/Dashboard"
                className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors"
              >
                <span className="truncate">Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:px-8 md:py-6">
        {/* Breadcrumbs & Progress */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
            <Link to="/EnrolledCourses" className="text-gray-500 hover:text-primary transition-colors font-medium">My Courses</Link>
            <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
            <span className="text-gray-500 font-medium">{courseTitle}</span>
            <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
            <span className="text-gray-900 font-medium capitalize">{selectedSession.key}: {selectedSession.title}</span>
          </div>
          {/* Progress Pill */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Progress</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-gray-900 text-sm font-bold">{progress}%</span>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative group mb-8">
          {/* Video iframe or placeholder */}
          {isPlaying && selectedSession.description ? (
            <iframe
              src={`https://drive.google.com/file/d/${selectedSession.description}/preview`}
              allow="autoplay"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <>
              {/* Thumbnail/Logo Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 z-10">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={playerlogo} alt="Course" className="max-w-[200px] opacity-50" />
                </div>
              </div>
              {/* Play Button */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="size-20 md:size-24 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[48px] md:text-[56px] ml-2">play_arrow</span>
                </button>
              </div>
              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 w-full p-6 z-30 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-90 mb-1">
                    {currentSessionIndex < totalSessions - 1
                      ? `Up Next: ${sessions[sessionKeys[currentSessionIndex + 1]]?.title}`
                      : "This is the last session"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls & Session Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Title & Content */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">{courseTitle}</h1>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-4 text-gray-600 leading-relaxed">
              <h3 className="text-xl font-bold text-gray-900 mb-2">About this session</h3>
              <p className="capitalize">
                <strong>{selectedSession.key}:</strong> {selectedSession.title}
              </p>
              <p>
                This session is part of the {courseTitle} course. Watch the video above to learn the concepts covered in this module.
                Take notes and practice the exercises to reinforce your understanding.
              </p>

              <div className="flex gap-4 mt-6 p-4 bg-white rounded-xl border border-gray-100">
                <div className="bg-primary/10 p-3 rounded-lg text-primary h-fit">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Learning Tip</h4>
                  <p className="text-sm">Take notes while watching and try to implement what you learn immediately after each session for better retention.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewLearning;
