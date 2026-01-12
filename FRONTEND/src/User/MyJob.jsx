import React, { useState } from "react";
import axios from "axios";
import API from "../API";

const MyJob = () => {
  const [formData, setFormData] = useState({
    keyword: "",
    platforms: ["linkedin", "indeed", "unstop"],
    experience: "",
    company: "",
    remoteStatus: "",
    location: "",
    resultsPerSite: 20
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalResults: 0
  });

  const JOBS_PER_PAGE = 5;
  const MAX_JOBS = 25;

  const handleSearch = async (page = 1) => {
    if (!formData.keyword.trim()) {
      setError("Please enter a job keyword");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Submit job search
      const submitResponse = await axios.post(`${API}/api/jobs/search`, {
        keyword: formData.keyword,
        platforms: formData.platforms,
        experience: formData.experience || undefined,
        company: formData.company || undefined,
        remoteStatus: formData.remoteStatus || undefined,
        location: formData.location || undefined,
        resultsPerSite: formData.resultsPerSite
      }, {
        timeout: 60000 // Match backend timeout
      });

      // Step 2: Use results directly (Sync mode)
      const { jobs, total } = submitResponse.data;

      if (jobs && Array.isArray(jobs)) {
        const limitedJobs = jobs.slice(0, MAX_JOBS);
        setJobs(limitedJobs);
        setCurrentPage(1);
        setPagination({
          page: 1,
          totalResults: jobs.length // or total
        });
        setLoading(false);
      } else {
        setJobs([]);
        setError("No jobs found");
        setLoading(false);
      }

    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch jobs. Try again.");
      console.error("Job search error:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Job Search Aggregator
        </h1>

        {/* Search Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Keyword - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Keyword * (Example :- React Developer)
              </label>
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleInputChange}
                placeholder="Enter job role or skill"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Location - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Example :- Bengaluru"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Company - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company (optional)
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Filter by company name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Default</option>
                <option value="entry">0-2 years</option>
                <option value="mid">3-6 years</option>
                <option value="senior">7+ years</option>
              </select>
            </div>

            {/* Remote Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type
              </label>
              <select
                name="remoteStatus"
                value={formData.remoteStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Default</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>


            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results per platform
              </label>
              <select
                name="resultsPerSite"
                value={formData.resultsPerSite}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div> */}
          </div>

          {/* Platform Selection */}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Platforms
            </label>
            <div className="flex flex-wrap gap-3">
              {["linkedin", "indeed", "unstop"].map(platform => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    formData.platforms.includes(platform)
                      ? "bg-primary text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div> */}

          {/* Search Button */}
          <button
            onClick={() => handleSearch(1)}
            disabled={loading || !formData.keyword.trim()}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-primary mx-auto mb-4"
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
              <p className="text-gray-600">Scraping the Internet... This may take 30-60 seconds</p>
            </div>
          </div>
        )}

        {/* Job Results */}
        {!loading && jobs.length > 0 && (
          <div>
            <div className="grid gap-4">
              {jobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE).map((job, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {job.jobTitle}
                    </h3>
                    {/* <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {job.platform}
                    </span> */}
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700 flex items-center">
                      <i className="fa fa-building mr-2 text-orange-500"></i>
                      {job.company}
                    </p>
                    {job.location && (
                      <p className="text-gray-600 flex items-center">
                        <i className="fa fa-map-marker mr-2 text-orange-500"></i>
                        {job.location}
                      </p>
                    )}
                    {job.salary && (
                      <p className="text-gray-700 font-semibold flex items-center">
                        <i className="fa fa-money mr-2 text-orange-500"></i>
                        {job.salary}
                      </p>
                    )}
                    {job.employmentType && (
                      <p className="text-gray-600 flex items-center">
                        <i className="fa fa-briefcase mr-2 text-orange-500"></i>
                        {job.employmentType}
                      </p>
                    )}
                    {job.remoteStatus && (
                      <p className="text-gray-600 flex items-center">
                        <i className="fa fa-laptop mr-2 text-orange-500"></i>
                        {job.remoteStatus}
                      </p>
                    )}
                    {job.postedDate && (
                      <p className="text-gray-500 text-sm">
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {job.descriptionSnippet && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.descriptionSnippet}
                    </p>
                  )}

                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    View Job
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {jobs.length > JOBS_PER_PAGE && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  <i className="fa fa-chevron-left mr-2"></i>
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(jobs.length / JOBS_PER_PAGE) }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNum
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(jobs.length / JOBS_PER_PAGE), prev + 1))}
                  disabled={currentPage === Math.ceil(jobs.length / JOBS_PER_PAGE)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  Next
                  <i className="fa fa-chevron-right ml-2"></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && jobs.length === 0 && formData.keyword && (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search filters or keywords
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-6 text-center text-gray-600 text-sm">
          © 2026 All Rights Reserved. Powered by Krutanic.
        </footer>
      </div>
    </div>
  );
};

export default MyJob;