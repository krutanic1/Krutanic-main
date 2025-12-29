import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";
const PostedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const userId = localStorage.getItem("userId");
  const checkResumeStatus = async () => {
    if (!userId) {
      console.error("No userId found in localStorage");
      setResumeUploaded(false);
      return;
    }
    try {
      console.log("userId from localStorage:", userId);
      console.log("Fetching from:", `${API}/user/${userId}/id`);
      const response = await axios.get(`${API}/user/${userId}/id`);
      console.log("User data:", response.data);
      if (response.data.jobResume && response.data.jobResume.trim() !== "") {
        setResumeUploaded(true);
      } else {
        setResumeUploaded(false);
      }
    } catch (error) {
      console.error("Error checking resume status:", error);
      setResumeUploaded(false);
    }
  };
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/jobs-with-users`);
      setJobs(response.data);
      if (response.data.length > 0) setSelectedJob(response.data[0]);
    } catch (error) {
      console.error("There was an error fetching Jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select a resume to upload.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("userId", userId);
    try {
      const response = await axios.post(`${API}/job-resume-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.jobResume) {
        setResumeUploaded(true);
        alert("Resume uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  }; 
  const handleApply = async () => {
    try {
      if (!userId || !selectedJob) {
        alert("User ID or Job is missing.");
        return;
      }
      const response = await axios.post(`${API}/jobapplications`, {
        userId,
        jobId: selectedJob._id,
        title: selectedJob.title,
        company: selectedJob.company,
      });
      setShowDialog(true);
      fetchJobs();
    } catch (error) {
      console.error("Error submitting job application:", error);
      alert("Failed to apply for the job. Please try again.");
    }
  };
  useEffect(() => {
    const initializeComponent = async () => {
      await checkResumeStatus();
      if (resumeUploaded) {
        fetchJobs();
      }
    };
    initializeComponent();
  }, [resumeUploaded]);
  if (!resumeUploaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-gray-200 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upload Your Resume
          </h2>
          <p className="text-gray-600 mb-4">
            Please upload your resume (PDF only) to access the job portal.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 w-full text-gray-700"
          />
          <button
            onClick={handleResumeUpload}
            disabled={uploading || !resumeFile}
            className={`w-full py-2 rounded-md font-medium text-white ${
              uploading || !resumeFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            } transition-colors`}
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      </div>
    );
  }
  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-gray-200 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-screen h-screen mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Available Jobs
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-orange-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
            </div> 
          ) : jobs.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No Jobs Available
              </h2>
              <p className="mt-2 text-gray-500">
                Check back later for new opportunities!
              </p>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-8rem)] gap-4">
              <div className="w-2/5 bg-white shadow-md rounded-lg p-4 overflow-y-auto scrollbar-hide">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedJob?._id === job._id ? "bg-orange-50" : ""
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <h2 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h2>
                    <div className="mt-1 text-gray-600">
                      <span className="flex items-center">
                        <i className="fa fa-building mr-2 text-orange-600"></i>
                        {job.company}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-500 text-sm">
                      <span className="flex items-center">
                        <i className="fa fa-calendar mr-2 text-orange-600"></i>
                        {convertToIST(job.createdAt)}
                      </span>
                    </div>
                    <div className="mt-2">
                      {job.applications.includes(userId) ? (
                        <span className="text-red-500 text-sm font-medium">
                          Already Applied
                        </span>
                      ) : (
                        <button className="text-orange-600 text-sm font-medium hover:underline">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-3/5 bg-white shadow-md rounded-lg p-6 overflow-y-auto scrollbar-hide flex flex-col">
                {selectedJob ? (
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {selectedJob.title}
                    </h2>
                    <div className="text-gray-600">
                      <span className="flex items-center mb-2">
                        <i className="fa fa-building mr-2 text-orange-600"></i>
                        {selectedJob.company}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      <span className="flex items-center mb-1">
                        <i className="fa fa-calendar-check-o mr-2 text-orange-600"></i>
                        Posted: {convertToIST(selectedJob.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <i className="fa fa-calendar-times-o mr-2 text-orange-600"></i>
                        Expires: {convertToIST(selectedJob.expiryDate)}
                      </span>
                    </div>
                    <pre className="mt-3 text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {selectedJob.description}
                    </pre>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-10 flex-1">
                    Select a job from the left to view details.
                  </p>
                )}
                {selectedJob && (
                  <div className="mt-4">
                    {selectedJob.applications.includes(userId) ? (
                      <button className="w-full py-2 bg-red-500 text-white rounded-md font-medium cursor-not-allowed">
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        className="w-full py-2 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Application Submitted
                </h3>
                <p className="text-gray-600">
                  Your application for <strong>{selectedJob?.title}</strong> at{" "}
                  <strong>{selectedJob?.company}</strong> has been submitted
                  successfully. Please wait for confirmation from the placement
                  coordinator team.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDialog(false)}
                    className="py-2 px-4 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    
  );
};
export default PostedJob;