import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const AdminInterviewQuestions = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [advCourses, setAdvCourses] = useState([]);

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getadvcourses?t=${Date.now()}`);
      setAdvCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch existing questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/getinterviewquestions`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchQuestions();
  }, []);

  // When a course is selected, find if we already have questions for it to pre-fill the text area
  useEffect(() => {
    if (selectedCourse) {
      const courseQuestions = questions.filter(q => q.courseTitle === selectedCourse);
      if (courseQuestions.length > 0) {
        setJsonInput(JSON.stringify(courseQuestions.map(q => ({ heading: q.heading, questions: q.questions })), null, 2));
      } else {
        setJsonInput("");
      }
    }
  }, [selectedCourse, questions]);

  const handleSave = async () => {
    if (!selectedCourse) {
      alert("Please select a course from the dropdown first.");
      return;
    }

    try {
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        alert("Input must be a JSON array.");
        return;
      }

      setLoading(true);
      const response = await axios.post(`${API}/api/updatecoursequestions`, {
        courseTitle: selectedCourse,
        data: parsedData
      });
      alert(`Interview questions for ${selectedCourse} saved successfully!`);
      setJsonInput("");
      fetchQuestions(); // Refresh data
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert("Invalid JSON format. Please check for syntax errors.");
      } else if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to save questions.");
      } else {
        alert("An error occurred while saving questions.");
      }
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="AdminAddCourse" className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Interview Questions</h1>
      
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700">
          <strong>Instructions:</strong> Select a course from the dropdown below, then enter the interview questions in JSON format. The JSON should be an array of objects containing a <code>heading</code> and <code>questions</code>. You do <strong>not</strong> need to add the course name in the JSON manually.
        </p>
        
        <div className="mt-4 mb-4 flex items-center gap-2">
          <label className="text-md font-bold">Select Target Course:</label>
          <select 
            className="p-2 border rounded font-semibold text-gray-800"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Choose Course --</option>
            {advCourses.map(course => (
              <option key={course._id} value={course.title}>{course.title}</option>
            ))}
          </select>
        </div>

        <p className="text-sm font-semibold mt-2">Example JSON Format:</p>
        <pre className="text-xs mt-2 bg-white p-2 rounded border">
{`[
  {
    "heading": "Introduction to Data Science",
    "questions": [
      "What is data science?",
      "Explain SQL"
    ]
  }
]`}
        </pre>
      </div>

      <div className="flex flex-col mb-4">
        <label className="font-semibold mb-2">JSON Input {selectedCourse && <span className="text-green-600">(Editing: {selectedCourse})</span>}</label>
        <textarea
          className="w-full h-96 p-4 border rounded font-mono text-sm"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={selectedCourse ? `Paste your JSON array for ${selectedCourse} here...` : "Select a course first to add JSON..."}
          disabled={!selectedCourse}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading || !selectedCourse}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold"
      >
        {loading ? "Saving..." : "Save Questions"}
      </button>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Current Questions in Database</h2>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions currently added.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-white p-4 shadow rounded relative border-l-4 border-indigo-500">
                <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">Course: {q.courseTitle}</span>
                <h3 className="text-lg font-bold text-gray-800 mb-3 pr-24">{q.heading}</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {q.questions.map((item, qIndex) => (
                    <li key={qIndex} className="text-gray-700">{item}</li>
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

export default AdminInterviewQuestions;
