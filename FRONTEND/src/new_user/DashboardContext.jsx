import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

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
    "UI/UX Design": "UI & UX Design.jpg",
    "Graphic Design": "Graphic Designing.jpg",
    "Stock Market": "Stock Marketing.jpg",
    "Trading": "Stock Marketing.jpg",
    "Psychology": "Psychology.jpg",
    "Robotics": "IOT & Robotics.jpg",
    "IoT": "IOT & Robotics.jpg",
    "Internet of Things": "IOT & Robotics.jpg",
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
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    const [userData, setUserData] = useState(null);
    const [enrollData, setEnrollData] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [userRes, enrollRes, profileRes] = await Promise.all([
                userId ? axios.get(`${API}/users`, { params: { userId }, headers }) : Promise.resolve({ data: null }),
                userEmail ? axios.get(`${API}/enrollments`, { params: { userEmail }, headers }) : Promise.resolve({ data: [] }),
                userId ? axios.get(`${API}/profile`, { params: { userId }, headers }).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
            ]);
            setUserData(userRes.data);
            setEnrollData(Array.isArray(enrollRes.data) ? enrollRes.data : []);
            setUserProfile(profileRes.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAll();
    }, []);

    const handleLogout = () => {
        toast.success("Logged out successfully!");
        setTimeout(() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            navigate("/Login");
        }, 1500);
    };

    // Derived values used across pages
    const enrollment = enrollData?.[0];
    const totalSessions = enrollment?.domain?.session ? Object.keys(enrollment.domain.session).length : 0;
    const watchedSessions = enrollment
        ? getWatchedFromStorage(enrollment._id, enrollment.domain?.session, enrollment.watchedSessions)
        : 0;
    const progressPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "—";
    const isFullyPaid = (enrollment?.status || "") === "fullPaid";

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
        </DashboardContext.Provider >
    );
};

export const useDashboard = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
    return ctx;
};

export default DashboardContext;
