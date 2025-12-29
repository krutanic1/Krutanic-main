import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";
const MyJob = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/jobapplications/${userId}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
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
  useEffect(() => {
    fetchApplications();
  }, []);
  const stages = ["Application Submitted", "Pending Review", "Under Review"];
  const statusToProgress = (status) => {
    switch (status) {
      case "Pending Review":
        return 1; // Index of "Pending Review"
      case "Under Review":
        return 2; // Index of "Under Review"
      case "Selected":
        return 3; // Final stage (Accepted)
      case "Rejected":
        return 3; // Final stage (Rejected)
      default:
        return 0; // Default to "Application Submitted"
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-500"; // Green for accepted
      case "Rejected":
        return "bg-red-500"; // Red for rejected
      default:
        return "bg-blue-500"; // Blue for in-progress
    }
  };
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-gray-200">
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            My Job Applications
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
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
          ) : applications.length > 0 ? (
            <div className="grid gap-6">
              {applications.map((job, index) => {
                const progress = statusToProgress(job.status);
                const progressWidth = `${
                  (progress / (job.status === "Selected" || job.status === "Rejected" ? 3 : 2)) * 100
                }%`;
                const statusColor = getStatusColor(job.status);
                const finalStatus = job.status === "Selected" ? "Accepted" : job.status === "Rejected" ? "Rejected" : null;
                return (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h2 className="text-xl font-semibold text-black">
                      {job.title}
                    </h2>
                    <div className="mt-2 text-gray-600">
                      <span className="flex items-center">
                        <i className="fa fa-building mr-2 text-orange-500"></i>
                        {job.company}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-500">
                      <span className="flex items-center">
                        <i className="fa fa-calendar mr-2 text-orange-500"></i>
                        Applied on {convertToIST(job.createdAt)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="relative w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className={`absolute top-0 left-0 h-2 rounded-full ${statusColor} transition-all duration-500`}
                          style={{ width: progressWidth }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        {[...stages, finalStatus].filter(Boolean).map((stage, idx) => (
                          <span
                            key={idx}
                            className={`font-medium ${
                              idx <= progress
                                ? job.status === "Rejected" && idx === 3
                                  ? "text-red-500"
                                  : job.status === "Selected" && idx === 3
                                  ? "text-green-500"
                                  : "text-blue-500"
                                : "text-gray-400"
                            }`}
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No Job Applications Yet
              </h2>
              <p className="mt-2 text-gray-500">
                Start applying to jobs to see them listed here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyJob;