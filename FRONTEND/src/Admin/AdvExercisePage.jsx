import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvExercisePage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [replaceExisting, setReplaceExisting] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch both advanced and regular courses
                const [advRes, regRes] = await Promise.all([
                    axios.get(`${API}/getadvcourses`),
                    axios.get(`${API}/getcourses`)
                ]);

                // Combine and Deduplicate (just in case)
                const combined = [...advRes.data, ...regRes.data];
                const uniqueCourses = combined.filter((course, index, self) =>
                    index === self.findIndex((c) => c._id === course._id)
                ).sort((a, b) => a.title.localeCompare(b.title));

                setCourses(uniqueCourses);
            } catch (err) {
                console.error("Error fetching courses", err);
                toast.error("Failed to load courses");
            }
        };
        fetchCourses();
    }, []);

    // Fetch stats when a course is selected
    useEffect(() => {
        if (!selectedCourse) {
            setStats(null);
            return;
        }
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API}/exercise/stats`, { params: { course: selectedCourse } });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();
    }, [selectedCourse]);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            return toast.error("Please select a Course");
        }

        if (!jsonInput.trim()) {
            return toast.error("Please paste the JSON question data");
        }

        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(jsonInput);
            if (!Array.isArray(parsedQuestions)) {
                throw new Error("JSON must be an array of objects []");
            }
        } catch (err) {
            return toast.error("Invalid JSON format: " + err.message);
        }

        setLoading(true);
        try {
            const payload = {
                course: selectedCourse,
                replaceExisting,
                questions: parsedQuestions
            };

            const res = await axios.post(`${API}/exercise/upload`, payload);
            toast.success(res.data.message || "Upload successful!");
            setJsonInput(""); // clear after success

            // Refresh stats
            const statsRes = await axios.get(`${API}/exercise/stats`, { params: { course: selectedCourse } });
            setStats(statsRes.data);

        } catch (err) {
            console.error("Upload error:", err.response?.data || err);
            toast.error(err.response?.data?.error || "Failed to upload questions");
        } finally {
            setLoading(false);
        }
    };

    const copyTemplate = () => {
        const template = [
            {
                "difficulty": "Beginner",
                "question": "What is Node.js?",
                "options": ["A web browser", "A runtime environment", "A database", "A framework"],
                "correctAnswer": "A runtime environment",
                "explanation": "Node.js allows running JS on the server.",
                "topic": "Basics"
            }
        ];
        setJsonInput(JSON.stringify(template, null, 2));
        toast.success("Template copied to input!");
    };

    return (
        <div id="AdminAddCourse" style={{ padding: '20px' }}>
            <Toaster />
            <div className="form" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <h2 style={{ margin: 0 }}>Exercise Management</h2>
                        <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Upload question banks dynamically for all courses.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <label>Target Course</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
                            >
                                <option value="">-- Select Course --</option>
                                {courses.map(c => (
                                    <option key={c._id} value={c.title}>{c.title}</option>
                                ))}
                            </select>

                            {stats && (
                                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#495057' }}>Current Active Questions in Database</h4>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
                                        <div style={{ background: '#d1e7dd', color: '#0f5132', padding: '5px 10px', rounded: '4px' }}>
                                            <strong>Beginner:</strong> {stats.Beginner}
                                        </div>
                                        <div style={{ background: '#fff3cd', color: '#664d03', padding: '5px 10px', rounded: '4px' }}>
                                            <strong>Intermediate:</strong> {stats.Intermediate}
                                        </div>
                                        <div style={{ background: '#f8d7da', color: '#842029', padding: '5px 10px', rounded: '4px' }}>
                                            <strong>Advanced:</strong> {stats.Advanced}
                                        </div>
                                        <div style={{ background: '#e2e3e5', color: '#41464b', padding: '5px 10px', rounded: '4px' }}>
                                            <strong>Total:</strong> {stats.Total}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#ffebee', padding: '15px', borderRadius: '8px', border: '1px solid #ffcdd2', marginBottom: '20px' }}>
                                <input
                                    type="checkbox"
                                    checked={replaceExisting}
                                    onChange={(e) => setReplaceExisting(e.target.checked)}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                <div>
                                    <strong style={{ color: '#d32f2f', display: 'block' }}>Replace Existing Questions (Soft Delete)</strong>
                                    <span style={{ fontSize: '12px', color: '#c62828' }}>If checked, all current questions for this course are removed from the active test pool before inserting new ones. Pending student tests will not crash.</span>
                                </div>
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ margin: 0 }}>Questions Payload (JSON Array)</label>
                                <button type="button" onClick={copyTemplate} style={{ background: 'none', border: 'none', color: '#f15b29', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0 }}>
                                    Load Example Template
                                </button>
                            </div>

                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='[ { "difficulty": "Beginner", "question": "...", "options": ["A","B","C","D"], "correctAnswer": "A" } ]'
                                style={{ width: '100%', height: '400px', fontFamily: 'monospace', fontSize: '13px', padding: '15px', background: '#282c34', color: '#abb2bf', borderRadius: '8px', marginTop: '10px', border: 'none', resize: 'vertical' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: '20px', padding: '15px 30px', fontWeight: 'bold', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? "Uploading to Database..." : "Upload Questions"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdvExercisePage;
