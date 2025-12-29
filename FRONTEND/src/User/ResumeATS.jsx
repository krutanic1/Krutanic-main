import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaUpload, FaFileAlt, FaSpinner, FaChartBar, FaLightbulb, FaQuestionCircle } from "react-icons/fa";
import API from "../API";
const ResumeATS = () => {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const fileInputRef = useRef(null);     
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to use this feature!", { id: "login-error" });
      return;
    }
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API}/users`, { params: { userId } });
      setResumeUrl(res.data.pdfUrl || "");
    } catch (err) {
      toast.error("Failed to load user data.", { id: "fetch-error" });
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      toast.error("No file selected!", { id: "no-file" });
      return;
    }
    const maxSizeInBytes = 1048576; // 1MB
    if (selectedFile.size > maxSizeInBytes) {
      toast.error("File size exceeds 1MB limit!", { id: "file-too-large" });
      e.target.value = null;
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!", { id: "invalid-file" });
      return;
    }
    setFile(selectedFile);
    setAtsResult(null);
  };
  const uploadResume = async () => {
    if (!file) {
      toast.error("Please select a file to upload!", { id: "toast-error" });
      return;
    }
    if (!userId) {
      toast.error("Please log in to upload a resume!", { id: "toast-error" });
      return;
    }
    setIsUploading(true);
    toast.loading("Uploading resume...", { id: "toast-loading" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    try {
      const uploadRes = await axios.post(`${API}/resume-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeUrl(uploadRes.data.pdfUrl);
      setFile(null);
      toast.success("Resume uploaded successfully!", { id: "toast-success" });
    } catch (err) {
      toast.error("Upload failed! Please try again.", { id: "toast-error" });
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeUrl) {
      toast.error("Please upload a resume first!", { id: "toast-error" });
      return;
    }
    if (!userId) {
      toast.error("Please log in to analyze your resume!", {
        id: "toast-error",
      });
      return;
    }
    setIsAnalyzing(true);
    // toast.loading("Analyzing resume...", { id: "toast-loading" });
    try {
      const res = await axios.post(`${API}/score-uploaded-resume`, { userId });
      setAtsResult(res.data);
      toast.success("Resume analyzed successfully!", { id: "toast-success" });
    } catch (err) {
      toast.error("Analysis failed! Please try again.", { id: "toast-error" });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const InstructionsDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-orange-600">Instructions</h3>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        <div className="text-gray-700 space-y-3">
          <p>Follow these steps to analyze your resume:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Select Resume" to choose your PDF file</li>
            <li>Click "Upload Resume" to upload your file</li>
            <li>Click "Analyze Resume" to get your ATS score</li>
            <li>Review the detailed analysis and improvement tips</li>
          </ol>
          <p className="text-sm italic">
           <span className="text-orange-600"> Note:</span> Only PDF files up to 1MB are accepted. Please login to use all features.
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="fixed top-[70px] flex items-center justify-center -z-10 over w-[100%] h-[calc(100vh-120px)] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden overflow-auto bg-white">
      <Toaster position="top-center" />
      <div className="bg-white  pt-20 rounded-2xl shadow-2xl p-10">
        <div className="flex justify-between items-center  mb-6">
          <h2 className="text-3xl font-bold text-black text-center flex items-center gap-2">
            <FaChartBar /> Ultimate ATS Analyzer
          </h2>
          <button
            onClick={() => setShowInstructions(true)}
            className="text-orange-600 hover:text-orange-700 transition-all ml-3"
            title="View Instructions"
          >
            <FaQuestionCircle size={24} />
          </button>
        </div>
        {!userId && (
          <p className="text-black text-center mb-6 font-medium animate-pulse">
            Please log in to unlock full features!
          </p>
        )}
        <div className="flex flex-col items-center gap-4 mb-8">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-all disabled:opacity-50"
              disabled={isUploading || isAnalyzing || !userId}
            >
              <FaUpload /> {resumeUrl ? "Update Resume" : "Select Resume"}
            </button>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 transition-all"
              >
                <FaFileAlt /> View Resume
              </a>
            )}
          </div>
          {file && (
            <p className="text-sm text-gray-600">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p> 
          )}
          {file && (
            <button
              onClick={uploadResume}
              className="w-48 py-3 bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-full hover:from-orange-300 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isUploading || isAnalyzing}
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaUpload />
              )}
              {isUploading ? "Uploading..." : "Upload Resume"}
            </button>
          )}
        </div>
        {resumeUrl && !file && (
          <div className="flex justify-center mb-8">
            <button
              onClick={analyzeResume}
              className="w-48 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isUploading || isAnalyzing}
            >
              {isAnalyzing ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaChartBar />
              )}
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        )}
        {atsResult && (
          <div className="mt-20 pt-30 space-y-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                ATS Analysis Result
              </h3>
                 <span className="font-bold cursor-pointer bg-black px-3 py-1 text-white rounded-full" onClick={() => setAtsResult(null)}>X</span>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
              <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                <FaChartBar /> ATS Score Overview
              </h3>
         
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-orange-600">
                    {atsResult.score}
                  </p>
                  <p className="text-gray-600">
                    Match Percentage: {atsResult.matchPercentage}%
                  </p>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#c2410c"
                      strokeWidth="3"
                      strokeDasharray={`${atsResult.matchPercentage}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-black">
                    {atsResult.matchPercentage}%
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detailed Analysis
              </h3>
              {Object.entries(atsResult.details).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <span className="capitalize text-gray-700">{key}</span>
                  <span className="text-orange-600 font-medium">
                    {value}/10
                  </span>
                </div>
              ))}
              <p className="text-sm text-gray-600 mt-4">
                Keywords Found:{" "}
                <span className="text-orange-600">
                  {atsResult.matchedKeywords.join(", ")}
                </span>
              </p>
            </div>
            {atsResult.feedback.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <FaLightbulb /> Improvement Tips
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {atsResult.feedback.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {showInstructions && <InstructionsDialog />}
      </div>
    </div>
  );
};
export default ResumeATS;