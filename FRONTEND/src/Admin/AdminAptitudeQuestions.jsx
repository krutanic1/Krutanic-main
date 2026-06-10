import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const AdminAptitudeQuestions = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);

  // Fetch existing questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/getallaptitudequestions`);
      setQuestionsList(res.data);
    } catch (error) {
      console.error("Error fetching aptitude questions:", error);
      toast.error("Failed to load existing questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSave = async () => {
    if (!jsonInput.trim()) {
      toast.error("Please enter JSON data");
      return;
    }

    try {
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        toast.error("Input must be a JSON array.");
        return;
      }

      setLoading(true);
      await axios.post(`${API}/api/updateaptitudequestions`, {
        data: parsedData
      });
      toast.success("Aptitude questions saved successfully!");
      setJsonInput("");
      fetchQuestions(); // Refresh data
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON format. Please check for syntax errors.");
      } else if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed to save questions.");
      } else {
        toast.error("An error occurred while saving questions.");
      }
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this category and level?")) {
      try {
        setLoading(true);
        await axios.delete(`${API}/api/deleteaptitudequestion?id=${id}`);
        toast.success("Deleted successfully!");
        fetchQuestions();
      } catch (error) {
        toast.error("Failed to delete.");
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="AdminAddCourse" className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Aptitude Questions</h1>
      
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700 mb-2">
          <strong>Instructions:</strong> Paste the JSON containing the category, level, and questions below. The JSON must be an array of objects.
        </p>
        
        <p className="text-sm font-semibold mt-2">Example JSON Format:</p>
        <pre className="text-xs mt-2 bg-white p-2 rounded border overflow-x-auto">
{`[
  {
    "category": "Calculation",
    "level": "Easy",
    "questions": [
      {
        "questionText": "What is 2 + 2?",
        "options": ["2", "3", "4", "5"],
        "correctOption": "4"
      }
    ]
  }
]`}
        </pre>
      </div>

      <div className="flex flex-col mb-4">
        <label className="font-semibold mb-2">JSON Input</label>
        <textarea
          className="w-full h-96 p-4 border rounded font-mono text-sm"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste your JSON array here..."
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold"
      >
        {loading ? "Saving..." : "Save Questions"}
      </button>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Current Questions in Database</h2>
        {questionsList.length === 0 ? (
          <p className="text-gray-500">No questions currently added.</p>
        ) : (
          <div className="space-y-6">
            {questionsList.map((q, index) => (
              <div key={q._id} className="bg-white p-4 shadow rounded relative border-l-4 border-indigo-500">
                <button 
                  onClick={() => handleDelete(q._id)}
                  className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200"
                >
                  Delete
                </button>
                <div className="flex gap-4 items-center mb-3">
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">Category: {q.category}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    q.level === "Easy" ? "bg-green-100 text-green-800" :
                    q.level === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>Level: {q.level}</span>
                </div>
                
                <h3 className="text-md font-bold text-gray-800 mb-2">Questions ({q.questions?.length || 0}):</h3>
                <ul className="list-decimal pl-5 space-y-2 text-sm bg-gray-50 p-4 rounded">
                  {q.questions?.map((item, qIndex) => (
                    <li key={qIndex} className="text-gray-700 font-medium">
                      {item.questionText}
                      <ul className="list-disc pl-5 mt-1 font-normal text-gray-500 space-y-1">
                        {item.options.map((opt, oIndex) => (
                          <li key={oIndex} className={opt === item.correctOption ? "text-green-600 font-bold" : ""}>
                            {opt} {opt === item.correctOption && "(Correct)"}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAptitudeQuestions;
