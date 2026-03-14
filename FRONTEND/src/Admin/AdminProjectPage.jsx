import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdminProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);

    // Form states
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [roadmap, setRoadmap] = useState({});
    const [jsonRoadmap, setJsonRoadmap] = useState("");
    const [showJsonInput, setShowJsonInput] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [projectsRes, coursesRes] = await Promise.all([
                axios.get(`${API}/api/projects`),
                axios.get(`${API}/getcourses`)
            ]);
            setProjects(projectsRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const initializeRoadmap = () => {
        const newRoadmap = {};
        for (let i = 1; i <= 24; i++) {
            newRoadmap[i] = { phase: "", tasks: ["", "", "", "", ""] };
        }
        setRoadmap(newRoadmap);
    };

    const toggleForm = () => {
        if (!isFormVisible) {
            if (!editingProjectId) {
                initializeRoadmap();
            }
        }
        setIsFormVisible(!isFormVisible);
    };

    const resetForm = () => {
        setEditingProjectId(null);
        setSelectedCourseId("");
        setTitle("");
        setDescription("");
        setLevel("Beginner");
        initializeRoadmap();
        setJsonRoadmap("");
        setShowJsonInput(false);
        setIsFormVisible(false);
    };

    const handleTaskChange = (week, taskIdx, value) => {
        const updatedRoadmap = { ...roadmap };
        updatedRoadmap[week].tasks[taskIdx] = value;
        setRoadmap(updatedRoadmap);
    };

    const handlePhaseChange = (week, value) => {
        const updatedRoadmap = { ...roadmap };
        updatedRoadmap[week].phase = value;
        setRoadmap(updatedRoadmap);
    };

    const handleApplyJson = () => {
        try {
            const parsed = JSON.parse(jsonRoadmap);
            // Validation: Ensure weeks 1-24 exist
            const formatted = {};
            for (let i = 1; i <= 24; i++) {
                if (!parsed[i] || !parsed[i].phase || !Array.isArray(parsed[i].tasks)) {
                    throw new Error(`Invalid data for Week ${i}. Must have "phase" string and "tasks" array.`);
                }
                formatted[i] = parsed[i];
            }
            setRoadmap(formatted);
            toast.success("Roadmap applied from JSON!");
            setShowJsonInput(false);
        } catch (error) {
            toast.error("Invalid JSON format: " + error.message);
        }
    };

    const copyTemplate = () => {
        const template = {};
        for (let i = 1; i <= 24; i++) {
            template[i] = {
                phase: `Phase ${Math.ceil(i / 4)}`,
                tasks: ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"]
            };
        }
        setJsonRoadmap(JSON.stringify(template, null, 2));
        toast.success("Template copied to textarea");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!selectedCourseId || !title || !description) {
            return toast.error("Please fill in all basic project details");
        }

        const projectData = {
            _id: editingProjectId,
            courseId: selectedCourseId,
            title,
            description,
            level,
            roadmap
        };

        try {
            await axios.post(`${API}/api/projects`, projectData);
            toast.success(editingProjectId ? "Project updated!" : "Project created!");
            fetchInitialData();
            resetForm();
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error(error.response?.data?.message || "Error saving project");
        }
    };

    const handleEdit = (project) => {
        setEditingProjectId(project._id);
        setSelectedCourseId(project.courseId._id || project.courseId);
        setTitle(project.title);
        setDescription(project.description);
        setLevel(project.level);

        // Handle Map/Object roadmap from backend
        const rawRoadmap = project.roadmap instanceof Map
            ? Object.fromEntries(project.roadmap)
            : project.roadmap;

        // Ensure all 24 weeks exist for editing
        const fullRoadmap = {};
        for (let i = 1; i <= 24; i++) {
            fullRoadmap[i] = rawRoadmap[i] || { phase: "", tasks: ["", "", "", "", ""] };
        }
        setRoadmap(fullRoadmap);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`${API}/api/projects/${id}`);
            toast.success("Project deleted!");
            fetchInitialData();
        } catch (error) {
            toast.error("Error deleting project");
        }
    };

    return (
        <div id="AdminAddCourse">
            <Toaster />
            {isFormVisible && (
                <div className="form">
                    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', height: '80vh' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>{editingProjectId ? "Edit Project" : "Add New Project"}</h2>
                            <span onClick={resetForm} style={{ fontSize: '24px', cursor: 'pointer' }}>✖</span>
                        </div>

                        <label>Select Course</label>
                        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
                            <option value="">-- Select Course --</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.title}</option>
                            ))}
                        </select>

                        <label>Project Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required />

                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project Description" required style={{ height: '100px' }} />

                        <label>Difficulty Level</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>

                        <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            24-Week Roadmap
                            <button
                                type="button"
                                onClick={() => setShowJsonInput(!showJsonInput)}
                                style={{ fontSize: '12px', background: '#333', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
                            >
                                {showJsonInput ? "Switch to Manual Input" : "Import from JSON"}
                            </button>
                        </h3>

                        {showJsonInput ? (
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                                    Paste your 24-week roadmap JSON here.
                                    <button type="button" onClick={copyTemplate} style={{ color: '#f15b29', background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px' }}>
                                        [View Template]
                                    </button>
                                </p>
                                <textarea
                                    value={jsonRoadmap}
                                    onChange={(e) => setJsonRoadmap(e.target.value)}
                                    placeholder="Paste JSON roadmap..."
                                    style={{ height: '300px', fontFamily: 'monospace', fontSize: '12px', background: '#f8f8f8' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyJson}
                                    style={{ background: '#f15b29', padding: '10px', marginTop: '10px' }}
                                >
                                    Apply JSON Roadmap
                                </button>
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: '12px', color: '#666' }}>Enter the phase name and 5 tasks for each week.</p>
                                <div style={{ marginTop: '20px' }}>
                                    {Object.keys(roadmap).map(week => (
                                        <div key={week} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#f15b29' }}>Week {week}</h4>
                                            <label style={{ fontSize: '12px' }}>Phase Name</label>
                                            <input
                                                type="text"
                                                placeholder={`Week ${week} Phase (e.g. Authentication Setup)`}
                                                value={roadmap[week].phase}
                                                onChange={(e) => handlePhaseChange(week, e.target.value)}
                                                required
                                            />
                                            <div style={{ marginTop: '10px' }}>
                                                <label style={{ fontSize: '12px' }}>Tasks (Day 1 - Day 5)</label>
                                                {roadmap[week].tasks.map((task, idx) => (
                                                    <input
                                                        key={idx}
                                                        type="text"
                                                        placeholder={`Day ${idx + 1} Task`}
                                                        value={task}
                                                        onChange={(e) => handleTaskChange(week, idx, e.target.value)}
                                                        required
                                                        style={{ marginBottom: '5px' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <button type="submit" className="cursor-pointer" style={{ marginTop: '20px', padding: '15px', fontWeight: 'bold' }}>
                            {editingProjectId ? "Update Project" : "Create Project"}
                        </button>
                    </form>
                </div>
            )}

            <div className="coursetable">
                <div style={{ marginBottom: '20px' }}>
                    <h2>Project Management</h2>
                    <button className="p-2 border border-black rounded-md" onClick={toggleForm}>
                        + Add New Project
                    </button>
                </div>

                {loading ? (
                    <div id="loader">
                        <div className="three-body">
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                        </div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Sl No.</th>
                                <th>Course</th>
                                <th>Project Name</th>
                                <th>Level</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((proj, index) => (
                                <tr key={proj._id}>
                                    <td>{index + 1}</td>
                                    <td>{proj.courseId?.title || "Unknown Course"}</td>
                                    <td>{proj.title}</td>
                                    <td>{proj.level}</td>
                                    <td>
                                        <button onClick={() => handleEdit(proj)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(proj._id)}>
                                            <i className="fa fa-trash-o text-red-600"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="5">No projects found. Add one to get started!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminProjectPage;
