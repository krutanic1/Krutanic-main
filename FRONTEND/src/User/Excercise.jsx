import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const Exercise = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pastResults, setPastResults] = useState([]);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // timer 

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );

  const fetchPastResults = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    try {
      const response = await axios.get(`${API}/user-results`, {
        params: { email },
      });
      setPastResults(response.data || []);
    } catch (err) {
      console.error("Error fetching past results:", err);
    }
  };

  useEffect(() => {
    fetchPastResults();
  }, []);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const email = localStorage.getItem("userEmail");
      if (!email) {
        throw new Error("User not logged in.");
      }
      const response = await axios.get(`${API}/exercise-questions`, {
        params: { email },
      });
      setQuestions(response.data || []);
      setAnswers({});
      setFeedback(null);
      setTestStarted(true);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  const handleSubmit = async () => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      setError(`Please answer all questions (${unanswered} remaining)`);
      return;
    }
    try {
      setLoading(true);
      const email = localStorage.getItem("userEmail");
      const response = await axios.post(`${API}/exercise-evaluate`, {
        questions,
        answers: Object.values(answers),
        email,
      });
      setFeedback(response.data);
      await fetchPastResults();
    } catch (err) {
      console.error("Error submitting answers:", err);
      setError("Failed to submit answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StartDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-orange-500">Test Instructions</h2>
        <div className="text-gray-700 mb-6 font-semibold">
          <p>• Duration: 15 minutes</p>
          <p>• Number of questions: 8 </p>
          <p>• Single choice per question</p>
          <p>• All questions must be answered</p>
          <p>• Timer will auto-submit when time runs out</p>
        </div> 
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowStartDialog(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowStartDialog(false);
              fetchQuestions();
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-[70px] flex items-center justify-center -z-10 over w-[100%] h-[calc(100vh-120px)] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden overflow-auto bg-white">
      <div className="bg-white h-[80dvh] w-[700px] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden overflow-auto  rounded-2xl shadow-2xl p-10">
        {error && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-8 text-center text-red-600">
         {error}
        </div>
       )}
    {!testStarted && (
      <div className="text-center">
        <p className="text-3xl font-bold text-black mb-7">MCQ Test</p>
        {pastResults.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Test Results</h3>
            {pastResults.map((result, index) => (
              <div key={index} className="p-3 border-b border-gray-200">
                <p>
                  <strong>Test Date:</strong>{" "}
                  {new Date(result.testDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Correct:</strong> {result.correctAnswers} /{" "}
                  {result.totalQuestions}
                </p>
                <p>
                  <strong>Incorrect:</strong> {result.incorrectAnswers}
                </p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowStartDialog(true)}
          className="w-48 py-3 bg-orange-700 text-white rounded-full font-semibold"
        >
          Start Your Test
        </button>
      </div>
    )}
    {testStarted && (
      <div className="">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setTestStarted(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-all"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
          <div className="text-gray-600">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>
        {loading ? (
          <p className="text-center text-lg text-gray-600 animate-pulse">Loading...</p>
        ) : questions.length > 0 ? (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-6 p-6 border rounded-xl bg-white">
              <p className="text-lg font-medium mb-4">
                <strong>Q{currentQuestionIndex + 1}:</strong>{" "}
                {questions[currentQuestionIndex].question}
              </p>
              <div className="space-y-3">
                {questions[currentQuestionIndex].options.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={() => handleAnswerChange(option)}
                      className="text-orange-600 focus:ring-orange-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                }
                className={`px-4 py-2 rounded-full transition-all ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-700"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() =>
                    answers[currentQuestionIndex] &&
                    setCurrentQuestionIndex((prev) =>
                      Math.min(prev + 1, questions.length - 1)
                    )
                  }
                  className={`px-4 py-2 rounded-full transition-all ${
                    answers[currentQuestionIndex]
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-gray-300 cursor-not-allowed text-gray-700"
                  }`}
                  disabled={!answers[currentQuestionIndex]}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="w-48 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 transition-all font-semibold"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No questions available.</p>
        )}
      </div>
    )}

    {feedback && (
      <div className="mt-8 bg-green-50 p-6 rounded-xl border border-green-200">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Results</h2>
        <p
          className={
            feedback.isImproved ? "text-green-700" : "text-red-700"
          }
        >
          {feedback.message}
        </p>
        <p className="text-gray-700">Total Questions: {feedback.total}</p>
        <p className="text-gray-700">Correct: {feedback.correct}</p>
        <p className="text-gray-700">Incorrect: {feedback.incorrect}</p>
        {feedback.isImproved && (
          <p className="text-gray-700">
            <strong>Updated Test Date:</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>
        )}
      </div>
    )}
    {showStartDialog && <StartDialog />}
  </div>
</div>
  );
};
export default Exercise;
