import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

// Helper to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const AptitudeTest = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableLevels, setAvailableLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  
  const [questions, setQuestions] = useState([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute per question
  
  const [score, setScore] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/getaptitudecategories`);
      setCategoriesData(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      toast.error("Failed to load categories.");
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedLevel(""); // reset level
    const catData = categoriesData.find(c => c.category === category);
    setAvailableLevels(catData ? catData.levels : []);
  };

  const startTest = async () => {
    if (!selectedCategory || !selectedLevel) {
      toast.error("Please select a category and level first.");
      return;
    }
    try {
      const res = await axios.get(`${API}/api/getaptitudequestions`, {
        params: { category: selectedCategory, level: selectedLevel }
      });
      if (res.data && res.data.questions && res.data.questions.length > 0) {
        const shuffledQuestions = shuffleArray(res.data.questions);
        setQuestions(shuffledQuestions);
        setIsTestStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsTestFinished(false);
        setTimeLeft(60);
      } else {
        toast.error("No questions found for this selection.");
      }
    } catch (error) {
      console.error("Error fetching questions", error);
      toast.error("Failed to load questions.");
    }
  };

  // Timer logic
  useEffect(() => {
    if (isTestStarted && !isTestFinished) {
      if (timeLeft === 0) {
        handleNextQuestion(false); // auto submit as incorrect if time runs out
      } else {
        const timerId = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }
  }, [isTestStarted, isTestFinished, timeLeft]);

  const handleNextQuestion = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60); // reset timer for next question
    } else {
      setIsTestFinished(true);
    }
  };

  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctOption;
    handleNextQuestion(isCorrect);
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestFinished(false);
    setSelectedCategory("");
    setSelectedLevel("");
    setQuestions([]);
  };

  if (!isTestStarted) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Aptitude Test</h1>
            <p className="text-gray-500 mt-2">Test your skills and practice for interviews. Each question has a 1-minute time limit.</p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="">-- Choose Category --</option>
                {categoriesData.map((c, i) => (
                  <option key={i} value={c.category}>{c.category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
                disabled={!selectedCategory}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">-- Choose Level --</option>
                {availableLevels.map((lvl, i) => (
                  <option key={i} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={startTest}
              disabled={!selectedCategory || !selectedLevel}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-4 shadow-md"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestFinished) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center mt-12">
        <div className="bg-white rounded-xl shadow-xl p-10 border-t-8 border-primary">
          <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">task_alt</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            You scored <span className="font-bold text-primary text-2xl">{score}</span> out of <span className="font-bold text-2xl">{questions.length}</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div className="bg-primary h-4 rounded-full transition-all duration-1000" style={{ width: `${(score/questions.length)*100}%` }}></div>
          </div>
          <button 
            onClick={resetTest}
            className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
          >
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-full text-xs uppercase tracking-wider">
              {selectedCategory} • {selectedLevel}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-mono font-bold text-lg border border-red-100 shadow-sm">
            <span className="material-symbols-outlined">timer</span>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        </div>

        {/* Question Body */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
            {currentQ.questionText}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className="text-left w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 group flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center font-bold text-gray-600 transition-colors shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-gray-700 font-medium group-hover:text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
