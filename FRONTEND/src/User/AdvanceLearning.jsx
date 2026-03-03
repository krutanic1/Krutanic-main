import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../API";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import playerlogo from "./playerlogo.jpg";

const AdvanceLearning = () => {
    const [selectedSession, setSelectedSession] = useState(null);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        courseTitle: stateTitle,
        sessions: stateSessions,
        startIndex = 0,
        thumbnail: stateThumbnail,
        enrollmentId: stateEnrollmentId,
        watchedSessionsFromDB
    } = location.state || {};

    // Self-fetch state when navigating directly (refresh/direct URL)
    const [fetchedSessions, setFetchedSessions] = useState(null);
    const [fetchedTitle, setFetchedTitle] = useState(null);
    const [fetchedEnrollmentId, setFetchedEnrollmentId] = useState(null);
    const [fetchedThumbnail, setFetchedThumbnail] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);

    // Watched Sessions Logic
    const [watchedSessions, setWatchedSessions] = useState(watchedSessionsFromDB || []);

    useEffect(() => {
        if (!stateSessions) {
            const userEmail = localStorage.getItem("userEmail");
            const token = localStorage.getItem("token");
            if (!userEmail || !token) return;

            setFetchLoading(true);
            axios.get(`${API}/advenrollments`, { params: { userEmail }, headers: { Authorization: `Bearer ${token}` } })
                .then(async (res) => {
                    const enroll = Array.isArray(res.data) ? res.data[0] : null;
                    if (!enroll) return;
                    const sessRes = await axios.get(`${API}/advenrollments/${enroll._id}/sessions`);
                    setFetchedSessions(sessRes.data?.session || {});
                    setFetchedTitle(enroll.domain?.title || enroll.domain || enroll.program || "Course");
                    setFetchedEnrollmentId(enroll._id);
                    setFetchedThumbnail(null);
                    setWatchedSessions(enroll.watchedSessions || []);
                })
                .catch((err) => {
                    console.error("Failed to self-fetch sessions:", err);
                })
                .finally(() => setFetchLoading(false));
        }
    }, [stateSessions]);

    const sessions = stateSessions || fetchedSessions;
    const courseTitle = stateTitle || fetchedTitle;
    const enrollmentId = stateEnrollmentId || fetchedEnrollmentId;
    const thumbnail = stateThumbnail || fetchedThumbnail;

    const sessionKeys = sessions ? Object.keys(sessions) : [];
    const totalSessions = sessionKeys.length;

    // Mark session as watched
    const markWatched = async (sessionKey) => {
        if (!enrollmentId || watchedSessions.includes(sessionKey)) return;

        const updatedWatched = [...watchedSessions, sessionKey];
        setWatchedSessions(updatedWatched);

        try {
            await axios.post(`${API}/updateprogress`, {
                enrollmentId,
                watchedSessions: updatedWatched
            });
            // Invalidate queries to refresh dashboard/training progress
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            // Optionally sync back if backend returns full list
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    const handleSessionClick = (key, index) => {
        setSelectedSession({ key, ...sessions[key] });
        setCurrentSessionIndex(index);
        setIsPlaying(true);
        markWatched(key);
    };

    const handlePrevious = () => {
        if (currentSessionIndex > 0) {
            const newIndex = currentSessionIndex - 1;
            const key = sessionKeys[newIndex];
            setSelectedSession({ key, ...sessions[key] });
            setCurrentSessionIndex(newIndex);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        if (currentSessionIndex < totalSessions - 1) {
            const newIndex = currentSessionIndex + 1;
            const key = sessionKeys[newIndex];
            setSelectedSession({ key, ...sessions[key] });
            setCurrentSessionIndex(newIndex);
            setIsPlaying(true);
            markWatched(key);
        }
    };

    useEffect(() => {
        if (sessions && sessionKeys.length > 0) {
            const initialIndex = startIndex < sessionKeys.length ? startIndex : 0;
            const initialKey = sessionKeys[initialIndex];
            setSelectedSession({ key: initialKey, ...sessions[initialKey] });
            setCurrentSessionIndex(initialIndex);
        }
    }, [sessions, startIndex]);

    if (!sessions || !selectedSession) {
        if (fetchLoading) {
            return (
                <div className="min-h-screen bg-background-light flex items-center justify-center font-display">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        <p className="text-gray-500 font-medium">Loading sessions...</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center font-display">
                <div className="flex flex-col items-center gap-6 text-center px-4">
                    <span className="material-symbols-outlined text-6xl text-gray-300">video_library</span>
                    <p className="text-gray-600 font-medium text-lg">No sessions found.</p>
                    <button
                        onClick={() => navigate("/advancedashboard/training")}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Go to Training
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light min-h-screen flex flex-col font-display">
            <Toaster position="top-center" reverseOrder={false} />

            <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:px-8 md:py-6">
                {/* Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                        <span className="text-gray-500 font-medium">Program</span>
                        <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
                        <span className="text-gray-500 font-medium">{courseTitle}</span>
                        <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
                        <span className="text-gray-900 font-medium capitalize">{selectedSession.key}: {selectedSession.title}</span>
                    </div>
                </div>

                {/* Video Player Section */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative group mb-8">
                    {isPlaying && selectedSession.description ? (
                        <iframe
                            src={`https://drive.google.com/file/d/${selectedSession.description}/preview`}
                            allow="autoplay"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 z-10">
                                {thumbnail ? (
                                    <img src={thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img src={playerlogo} alt="Course" className="max-w-[200px] opacity-50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                            </div>
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <button
                                    onClick={() => { setIsPlaying(true); markWatched(selectedSession.key); }}
                                    className="size-20 md:size-24 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[48px] md:text-[56px]">play_arrow</span>
                                </button>
                            </div>
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

                {/* Navigation */}
                <div className="flex justify-between items-center gap-4 mb-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentSessionIndex === 0}
                        className={`flex-1 min-w-0 flex items-center gap-3 p-4 rounded-xl border transition-all ${currentSessionIndex === 0
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-200 hover:border-primary hover:shadow-md cursor-pointer"}`}
                    >
                        <div className="size-10 shrink-0 rounded-full flex items-center justify-center bg-primary/10">
                            <span className="material-symbols-outlined text-xl text-primary">skip_previous</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left overflow-hidden">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Previous</p>
                            <p className="font-medium truncate">
                                {currentSessionIndex > 0 ? sessions[sessionKeys[currentSessionIndex - 1]]?.title : "None"}
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentSessionIndex >= totalSessions - 1}
                        className={`flex-1 min-w-0 flex items-center gap-3 p-4 rounded-xl border transition-all ${currentSessionIndex >= totalSessions - 1
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-200 hover:border-primary hover:shadow-md cursor-pointer"}`}
                    >
                        <div className="flex-1 min-w-0 text-right overflow-hidden">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Next</p>
                            <p className="font-medium truncate">
                                {currentSessionIndex < totalSessions - 1 ? sessions[sessionKeys[currentSessionIndex + 1]]?.title : "None"}
                            </p>
                        </div>
                        <div className="size-10 shrink-0 rounded-full flex items-center justify-center bg-primary/10">
                            <span className="material-symbols-outlined text-xl text-primary">skip_next</span>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">{courseTitle}</h1>
                        <div className="py-6 space-y-4 text-gray-600 leading-relaxed">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">About this session</h3>
                            <p className="capitalize"><strong>{selectedSession.key}:</strong> {selectedSession.title}</p>
                            <p>This session is part of the {courseTitle} program. Complete all sessions to build your progress.</p>
                        </div>
                    </div>

                    {/* Session List */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-900 text-lg">Program Sessions</h3>
                        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                            {sessionKeys.map((key, idx) => {
                                const isActive = idx === currentSessionIndex;
                                const isWatched = watchedSessions.includes(key);
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleSessionClick(key, idx)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border ${isActive
                                            ? "bg-orange-50 border-primary text-primary"
                                            : "bg-white border-gray-100 hover:border-gray-300 text-gray-700"}`}
                                    >
                                        <div className={`size-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${isWatched ? "bg-green-500 text-white" : isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                            {isWatched ? <span className="material-symbols-outlined text-sm">check</span> : <span>{idx + 1}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-gray-800"}`}>
                                                {sessions[key]?.title || key}
                                            </p>
                                        </div>
                                        {isActive && <span className="material-symbols-outlined text-primary text-[18px]">play_circle</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdvanceLearning;
