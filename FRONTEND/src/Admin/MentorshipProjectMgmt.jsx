import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const MentorshipProjectMgmt = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [projects, setProjects] = useState(Array(12).fill(""));
  const [loading, setLoading] = useState(false);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API}/getcourses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  // Fetch projects when course changes
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedCourse) {
        setProjects(Array(12).fill(""));
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/mentorship-projects/${encodeURIComponent(selectedCourse)}`);
        if (response.data && response.data.projects) {
          setProjects(response.data.projects);
        } else {
          setProjects(Array(12).fill(""));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProjects(Array(12).fill(""));
        } else {
          console.error("Error fetching projects:", error);
          toast.error("Failed to load projects");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCourse]);

  const handleLinkChange = (index, value) => {
    const newProjects = [...projects];
    newProjects[index] = value;
    setProjects(newProjects);
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course first");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API}/api/mentorship-projects`,
        { courseName: selectedCourse, projects },
        { withCredentials: true }
      );
      toast.success("Projects saved successfully!");
    } catch (error) {
      console.error("Error saving projects:", error);
      toast.error("Failed to save projects");
    } finally {
      setLoading(false);
    }
  };

  // Convert regular google drive link to preview link for iframe
  const getPreviewLink = (link) => {
    if (!link) return null;
    try {
      if (link.includes("drive.google.com/file/d/")) {
        const fileId = link.split("/d/")[1].split("/")[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      return link;
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="admin-content-wrap p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          Mentorship Projects Management
        </h1>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Weekly Projects for {selectedCourse}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {projects.map((link, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Week {index + 1} - Google Drive Link
                      </label>
                      <input
                        type="text"
                        placeholder="Paste Google Drive PDF link here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    {link && getPreviewLink(link) && (
                      <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-inner shrink-0">
                        <iframe
                          src={getPreviewLink(link)}
                          className="w-full h-full"
                          allow="autoplay"
                          title={`Week ${index + 1} Preview`}
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Projects"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipProjectMgmt;
