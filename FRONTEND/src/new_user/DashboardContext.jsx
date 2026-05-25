import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/* ─── localStorage progress helper ─── */
export const getWatchedFromStorage = (enrollmentId, sessionObj, dbWatchedSessions = []) => {
    try {
        const key = `krutanic_progress_${enrollmentId}`;
        const raw = localStorage.getItem(key);
        const localWatched = raw ? JSON.parse(raw) : [];
        const combined = new Set([...localWatched, ...(dbWatchedSessions || [])]);
        const keys = sessionObj ? Object.keys(sessionObj) : [];
        return keys.filter((k) => combined.has(k)).length;
    } catch {
        return 0;
    }
};

/* ─── Thumbnail helper ─── */
const courseThumbnails = {
    "Full Stack Web Development": "Full Stack Web.jpg",
    "Data Science": "Data Science.jpg",
    "Digital Marketing": "Digital Marketing.jpg",
    "Business Analytics": "Business Analytics.jpg",
    "Data Analytics": "Data Analytics.jpg",
    "Human Resource": "Human Resource.jpg",
    "HR": "Human Resource.jpg",
    "Finance": "FinTech.jpg",
    "FinTech": "FinTech.jpg",
    "Investment Banking": "FinTech.jpg",
    "Operations": "Supply Chain.jpg",
    "Supply Chain Management": "Supply Chain.jpg",
    "Product Management": "Business Analytics.jpg",
    "Artificial Intelligence": "Artificial Intelligence.jpg",
    "Machine Learning": "Machine Learning.jpg",
    "Cyber Security": "Cyber Security.jpg",
    "Ethical Hacking": "Cyber Security.jpg",
    "Cloud Computing": "Cloud Computing.jpg",
    "AWS": "Cloud Computing.jpg",
    "Azure": "Cloud Computing.jpg",
    "DevOps": "DevOps.jpg",
    "Android Development": "Android App.jpg",
    "App Development": "Android App.jpg",
    "Web Development": "Full Stack Web.jpg",
    "Full Stack": "Full Stack Web.jpg",
    "MERN": "Full Stack Web.jpg",
    "UI/UX Design": "ui-ux-design.jpg",
    "Graphic Design": "Graphic Designing.jpg",
    "Stock Market": "Stock Marketing.jpg",
    "Trading": "Stock Marketing.jpg",
    "Psychology": "Psychology.jpg",
    "Robotics": "iot-robotics.jpg",
    "IoT": "iot-robotics.jpg",
    "Internet of Things": "iot-robotics.jpg",
    "Embedded Systems": "Embedded System.jpg",
    "Genetics": "Nano Technology &  Genetic.jpg",
    "Nano Technology": "Nano Technology &  Genetic.jpg",
    "AutoCAD": "Auto Cad.jpg",
};

export const getThumbnail = (title) => {
    if (!title) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
    const key = Object.keys(courseThumbnails).find((k) => title.toLowerCase().includes(k.toLowerCase()));
    if (key) {
        return new URL(`../User/thumnails/${courseThumbnails[key]}`, import.meta.url).href;
    }
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400";
};

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const authHeaders = { Authorization: `Bearer ${token}` };

    const { data: userData, isLoading: isUserLoading } = useQuery({
        queryKey: ['users', userId],
        queryFn: async () => {
            const res = await axios.get(`${API}/users`, { params: { userId }, headers: authHeaders });
            return res.data;
        },
        enabled: !!userId && !!token,
        staleTime: 1000 * 60 * 5, // Cache for 5 mins
    });

    const { data: enrollRes, isLoading: isEnrollLoading } = useQuery({
        queryKey: ['enrollments', userEmail, userData?.advance],
        queryFn: async () => {
            const endpoint = userData?.advance ? `${API}/advenrollments` : `${API}/enrollments`;
            const res = await axios.get(endpoint, { params: { userEmail }, headers: authHeaders });
            return res.data;
        },
        enabled: !!userEmail && !!token && userData !== undefined,
        staleTime: 1000 * 60 * 5,
    });

    const { data: userProfile, isLoading: isProfileLoading } = useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const res = await axios.get(`${API}/profile`, { params: { userId }, headers: authHeaders });
            return res.data;
        },
        enabled: !!userId && !!token,
        staleTime: 1000 * 60 * 5,
        retry: 1, // Don't retry infinitely if profile doesn't exist
    });

    const loading = isUserLoading || isEnrollLoading || isProfileLoading;
    const enrollData = Array.isArray(enrollRes) ? enrollRes : [];

    const handleLogout = () => {
        toast.success("Logged out successfully!");
        setTimeout(() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            queryClient.clear();
            navigate("/Login");
        }, 1500);
    };

    // Derived values used across pages
    const enrollment = enrollData?.[0];
    const totalSessions = enrollment?.progressStats?.totalSessionsCount || 0;
    const watchedSessions = enrollment?.progressStats?.watchedSessionsCount || 0;
    const progressPct = enrollment?.progressStats?.progressPct || 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "—";
    const programPrice = enrollment?.programPrice || 0;
    const paidAmount = enrollment?.paidAmount || 0;
    const isFullyPaid = (enrollment?.status || "") === "fullPaid" || (programPrice > 0 && paidAmount >= programPrice);

    return (
        <DashboardContext.Provider
            value={{
                userData,
                enrollData,
                userProfile,
                enrollment,
                loading,
                totalSessions,
                watchedSessions,
                progressPct,
                programName,
                isFullyPaid,
                handleLogout,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
    return ctx;
};

export default DashboardContext;
