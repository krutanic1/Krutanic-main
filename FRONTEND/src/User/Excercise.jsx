import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const Exercise = () => {
  const [view, setView] = useState("landing");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Beginner");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(900);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const courseRes = await axios.get(`${API}/exercise/courses`);
        const availableCourses = courseRes.data || [];
        setCourses(availableCourses);

        let defaultCourse = availableCourses.length > 0 ? availableCourses[0] : "";

        if (email) {


          // Fetch user enrollments to auto-select and RESTRICT course
          try {
            const enrollRes = await axios.get(`${API}/enrollments`, { params: { userEmail: email } });
            if (enrollRes.data && enrollRes.data.length > 0) {
              // Get all enrolled course titles that exist in available exercise topics
              // Use Set to strictly avoid duplicates
              const uniqueEnrolledTitles = [...new Set(
                enrollRes.data
                  .map(e => e.domain?.title)
                  .filter(title => title && availableCourses.includes(title))
              )];

              if (uniqueEnrolledTitles.length > 0) {
                // RESTRICT available courses to only what the user is enrolled in
                setCourses(uniqueEnrolledTitles);
                defaultCourse = uniqueEnrolledTitles[0];
              }
            }
          } catch (enrollErr) {
            console.error("Error fetching enrollments:", enrollErr);
          }
        }

        if (defaultCourse) {
          setSelectedCourse(defaultCourse);
        }

      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (view === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view, timeLeft]);

  const startTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) throw new Error("Please log in to start.");

      const res = await axios.get(`${API}/exercise/questions`, {
        params: {
          course: selectedCourse,
          difficulty: selectedDifficulty,
          email
        }
      });

      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
        setAnswers({});
        setMarkedQuestions(new Set());
        setCurrentQuestionIndex(0);
        setTimeLeft(selectedDifficulty === "Beginner" ? 1200 : selectedDifficulty === "Intermediate" ? 900 : 600);
        setView("quiz");
      } else {
        setError("No questions found for this selection. Please try another.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to start test.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };

  const toggleMark = () => {
    const newMarked = new Set(markedQuestions);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedQuestions(newMarked);
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      const answersArray = questions.map((_, i) => answers[i] || null);

      const res = await axios.post(`${API}/exercise/evaluate`, {
        questions,
        answers: answersArray,
        email
      });

      setResult(res.data);
      setView("result");

      const historyRes = await axios.get(`${API}/exercise/user-results`, { params: { email } });
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to submit test.");
    } finally {
      setLoading(false);
    }
  };

  const getQuestionStatusClass = (index) => {
    const isCurrent = currentQuestionIndex === index;
    const isAnswered = answers[index] !== undefined;
    const isMarked = markedQuestions.has(index);

    if (isCurrent) return "bg-orange-50 border-3 border-primary text-primary font-bold shadow-lg ring-2 ring-primary/20";
    if (isMarked) return "bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-semibold";
    if (isAnswered) return "bg-green-500 border-2 border-green-600 text-white font-semibold hover:bg-green-600";
    return "bg-white border-2 border-gray-300 text-gray-600 font-medium hover:border-primary hover:text-primary hover:bg-orange-50";
  };

  // Render Components
  if (view === "landing") {
    return (
      <div className="font-display bg-white min-h-screen text-text-main p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">




          <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="w-full md:w-2/5 min-h-[200px] bg-gray-100 relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}></div>
            </div>
            <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-text-main">Ready to verify your skills?</h2>
                <p className="text-gray-500 text-sm mt-2">Select a subject and difficulty level to begin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-gray-500">Subject</label>
                  <select
                    className="block w-full rounded-lg border-border-light bg-background-light p-2.5 text-sm focus:border-primary focus:ring-primary text-text-main disabled:opacity-60 disabled:cursor-not-allowed"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={courses.length === 1}
                  >
                    <option value="" disabled>Select a Subject</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-gray-500">Difficulty</label>
                  <select
                    className="block w-full rounded-lg border-border-light bg-background-light p-2.5 text-sm focus:border-primary focus:ring-primary text-text-main"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                onClick={startTest}
                disabled={loading || !selectedCourse}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 px-6 text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Start New Test"}
                {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </div>
          </div>

          {/* Quick Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-blue-500">verified</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">Skill Validation</h3>
              <p className="text-sm text-gray-500">Test your knowledge against industry standards and validate your expertise in specific domains.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-purple-500">psychology</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">Identify Gaps</h3>
              <p className="text-sm text-gray-500">Discover areas for improvement and focus your learning journey where it matters most.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-light shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-green-500">trending_up</span>
              </div>
              <h3 className="font-bold text-text-main mb-2">Career Growth</h3>
              <p className="text-sm text-gray-500">Regular self-assessment is key to continuous professional development and interview readiness.</p>
            </div>
          </div>


        </div>
      </div>
    );
  }

  if (view === "quiz") {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-orange-50 font-display text-text-main overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 lg:px-10 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to quit?")) setView("landing");
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium hidden sm:block">Exit Test</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-bold tracking-tight text-gray-800">{selectedCourse}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-gray-200 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
              <span className={`font-bold tabular-nums text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-gray-800'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <button
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto relative scroll-smooth">
            <div className="w-full max-w-4xl mx-auto p-6 lg:p-10 flex flex-col gap-8 pb-32">
              {/* Progress Header */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">Question {currentQuestionIndex + 1}</span>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1 capitalize">{selectedDifficulty} Level</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{(currentQuestionIndex + 1).toString().padStart(2, '0')}</span>
                    <span className="text-lg text-gray-500 font-medium">/ {questions.length}</span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500 transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-10 flex flex-col gap-8">
                <div className="flex gap-4">
                  <div className="flex-none pt-1">
                    <span className="flex items-center justify-center size-10 rounded-full bg-primary text-white font-bold text-base shadow-md">Q{currentQuestionIndex + 1}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-gray-800">
                    {questions[currentQuestionIndex].question}
                  </h3>
                </div>

                <div className="flex flex-col gap-4 pl-0 md:pl-14">
                  {questions[currentQuestionIndex].options.map((option, i) => (
                    <label
                      key={i}
                      className="group relative flex items-center gap-4 rounded-xl border-2 border-gray-200 p-5 cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 has-[:checked]:border-primary has-[:checked]:bg-orange-50 has-[:checked]:shadow-lg"
                    >
                      <input
                        className="peer h-5 w-5 border-2 border-gray-300 bg-transparent text-transparent checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all rounded-full"
                        type="radio"
                        name={`question_${currentQuestionIndex}`}
                        value={option}
                        checked={answers[currentQuestionIndex] === option}
                        onChange={() => handleAnswer(option)}
                      />
                      <div className="flex items-center justify-center size-10 rounded-lg bg-gray-100 font-bold text-base text-gray-600 group-hover:text-primary group-hover:bg-orange-100 peer-checked:bg-primary peer-checked:text-white transition-all shadow-sm">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex grow flex-col">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900 capitalize leading-relaxed">{option}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer Nav */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 gap-3 sm:gap-4">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all font-bold transform active:scale-95 w-full sm:min-w-[180px] sm:flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                  Previous
                </button>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-[2]">
                  <button
                    onClick={toggleMark}
                    className={`flex sm:hidden items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold shadow-md w-full ${markedQuestions.has(currentQuestionIndex)
                      ? "bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100"
                      : "text-primary border-primary/30 bg-white hover:bg-primary/10 hover:border-primary"
                      }`}
                  >
                    <span className={`material-symbols-outlined ${markedQuestions.has(currentQuestionIndex) ? "fill" : ""}`}>flag</span>
                    {markedQuestions.has(currentQuestionIndex) ? "Marked" : "Mark for Review"}
                  </button>
                  <button
                    onClick={toggleMark}
                    className={`hidden sm:flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-bold shadow-md sm:min-w-[180px] sm:flex-1 ${markedQuestions.has(currentQuestionIndex)
                      ? "bg-yellow-50 text-yellow-700 border-yellow-400 hover:bg-yellow-100"
                      : "text-primary border-primary/30 bg-white hover:bg-primary/10 hover:border-primary"
                      }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${markedQuestions.has(currentQuestionIndex) ? "fill" : ""}`}>flag</span>
                    {markedQuestions.has(currentQuestionIndex) ? "Marked" : "Mark for Review"}
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all font-bold transform active:scale-95 w-full sm:min-w-[180px] sm:flex-1 whitespace-nowrap"
                    >
                      Next Question
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      onClick={submitTest}
                      className="flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:from-green-700 hover:to-green-600 transition-all font-bold transform active:scale-95 w-full sm:min-w-[180px] sm:flex-1 whitespace-nowrap"
                    >
                      Submit Test
                      <span className="material-symbols-outlined">check_circle</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className={`fixed inset-y-0 right-0 w-80 border-l-2 border-gray-200 bg-white flex flex-col z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 shadow-xl lg:shadow-none ${showMobileSidebar ? "translate-x-0" : "translate-x-full"}`}>
            {/* Mobile close */}
            <div className="lg:hidden p-4 flex justify-end border-b border-gray-200">
              <button onClick={() => setShowMobileSidebar(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-br from-orange-50 to-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Time Remaining</h3>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col items-center justify-center bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
                  <span className="text-3xl font-bold text-gray-800">{Math.floor(timeLeft / 60)}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase mt-1">Minutes</span>
                </div>
                <div className="flex flex-col justify-center font-bold text-2xl text-gray-400">:</div>
                <div className="flex flex-1 flex-col items-center justify-center bg-white rounded-xl p-4 border-2 border-primary shadow-sm">
                  <span className={`text-3xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-primary'}`}>{(timeLeft % 60).toString().padStart(2, "0")}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase mt-1">Seconds</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-5">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowMobileSidebar(false);
                    }}
                    className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all relative shadow-sm hover:shadow-md ${getQuestionStatusClass(idx)}`}
                  >
                    {idx + 1}
                    {markedQuestions.has(idx) && (
                      <span className="absolute -top-1 -right-1 size-3 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <div className="size-4 rounded-full bg-green-500 shadow-sm"></div> Answered
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <div className="size-4 rounded-full border-3 border-primary bg-orange-50 shadow-sm"></div> Current
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <div className="size-4 rounded-full bg-yellow-100 border-2 border-yellow-400 shadow-sm"></div> Review
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <div className="size-3 rounded-full bg-gray-200 border border-gray-300"></div> Not Visited
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-light bg-background-light">
              <button
                onClick={submitTest}
                className="w-full py-3 px-4 rounded-lg bg-text-main text-white font-bold hover:opacity-90 transition-opacity"
              >
                Submit Test
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (view === "result" && result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-border-light">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">
            {result.isImproved ? "🏆" : "📊"}
          </div>
          <h2 className="text-3xl font-black text-text-main mb-2">Test Complete!</h2>
          <p className="text-gray-500 mb-8">{result.message}</p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{result.correct}</p>
              <p className="text-xs uppercase text-gray-400 font-bold">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{result.incorrect}</p>
              <p className="text-xs uppercase text-gray-400 font-bold">Incorrect</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{result.total}</p>
              <p className="text-xs uppercase text-gray-400 font-bold">Total</p>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${(result.correct / result.total) * 100}%` }}
            ></div>
          </div>

          <button
            onClick={() => {
              setView("landing");
              setQuestions([]);
              setResult(null);
            }}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
          >
            Back to Dashboard
          </button>
          {/* Footer */}
          <footer className="mt-16 py-6 text-center text-gray-600 text-sm">
            © 2024 All Rights Reserved. Powered by Krutanic.
          </footer>        </div>
      </div>
    );
  }

  return null;
};

export default Exercise;
