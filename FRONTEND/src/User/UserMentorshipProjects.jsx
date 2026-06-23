import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const UserMentorshipProjects = () => {
  const [courseName, setCourseName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);

  // Fetch enrollment data to get courseName
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          toast.error("User email not found");
          setLoading(false);
          return;
        }

        // Fetch enrollment
        const enrollResponse = await axios.get(`${API}/enrollments`, {
          params: { userEmail },
        });

        if (enrollResponse.data && enrollResponse.data.length > 0) {
          const fetchedCourseName = enrollResponse.data[0].domain?.title;
          setCourseName(fetchedCourseName);

          if (fetchedCourseName) {
            // Fetch projects
            try {
              const projectResponse = await axios.get(
                `${API}/api/mentorship-projects/${encodeURIComponent(fetchedCourseName)}`
              );
              if (projectResponse.data && projectResponse.data.projects) {
                setProjects(projectResponse.data.projects);
              } else {
                setProjects(Array(12).fill(""));
              }
            } catch (err) {
              if (err.response && err.response.status === 404) {
                setProjects(Array(12).fill(""));
              } else {
                console.error("Error fetching projects:", err);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

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

  const handleWeekClick = (index, link) => {
    if (!link) {
      toast("No project link assigned for this week yet.", { icon: 'ℹ️' });
      return;
    }
    setSelectedWeek(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mentorship Projects</h1>
        <p className="text-gray-600 mb-8">
          {courseName ? `Projects for ${courseName}` : "Your enrolled course projects will appear here."}
        </p>

        {courseName && projects.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with buttons */}
            <div className="lg:w-1/3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 h-fit">
              {projects.map((link, index) => {
                const hasLink = !!link;
                const isSelected = selectedWeek === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleWeekClick(index, link)}
                    className={`p-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 shadow-sm border
                      ${isSelected 
                        ? 'bg-primary text-white border-primary transform scale-105 shadow-md' 
                        : hasLink 
                          ? 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary hover:shadow-md' 
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                      }
                    `}
                  >
                    Week {index + 1}
                  </button>
                );
              })}
            </div>

            {/* PDF Viewer Area */}
            <div className="lg:w-2/3">
              {selectedWeek !== null && projects[selectedWeek] ? (
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 h-[600px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Week {selectedWeek + 1} Project</h2>
                    <a 
                      href={projects[selectedWeek]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 text-sm"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Open in Drive
                    </a>
                  </div>
                  <div className="flex-grow w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                    {getPreviewLink(projects[selectedWeek]) ? (
                      <iframe
                        src={getPreviewLink(projects[selectedWeek])}
                        className="w-full h-full absolute inset-0"
                        allow="autoplay"
                        title={`Week ${selectedWeek + 1} Project`}
                      ></iframe>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
                        <span className="material-symbols-outlined text-4xl mb-2">link</span>
                        <p>Preview not available for this link type.</p>
                        <a href={projects[selectedWeek]} target="_blank" rel="noopener noreferrer" className="text-primary mt-2 hover:underline">
                          Click here to open link
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">description</span>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Week</h3>
                  <p className="text-gray-400 max-w-sm">
                    Click on any of the available weeks from the list to view the project details and resources.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMentorshipProjects;
