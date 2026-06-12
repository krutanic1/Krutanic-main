import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";
import { BrainCircuit, BookOpen, Layers, Play, Clock, CheckCircle2, ChevronRight, Award, RotateCcw, AlertTriangle } from "lucide-react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

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
    if (isTestStarted && !isTestFinished && !isTransitioning) {
      if (timeLeft === 0) {
        handleNextQuestion(false); // auto submit as incorrect if time runs out
      } else {
        const timerId = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }
  }, [isTestStarted, isTestFinished, timeLeft, isTransitioning]);

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
    setIsTransitioning(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (option) => {
    if (isTransitioning) return;
    
    setSelectedOption(option);
    setIsTransitioning(true);
    
    const isCorrect = option === questions[currentQuestionIndex].correctOption;
    
    // Add a slight delay for visual feedback
    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 600);
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setIsTestFinished(false);
    setSelectedCategory("");
    setSelectedLevel("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  // 1. Initial Setup Screen
  if (!isTestStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

          <div className="p-10 md:p-14 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <BrainCircuit className="text-white w-10 h-10 transform -rotate-3" />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Skill Assessment
              </h1>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Validate your expertise with our professional aptitude evaluations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                  Assessment Category
                </label>
                <div className="relative">
                  <div 
                    onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsLevelDropdownOpen(false); }}
                    className={`w-full flex justify-between items-center cursor-pointer bg-white border-2 rounded-xl px-5 py-4 transition-all font-medium text-lg shadow-sm ${isCategoryDropdownOpen ? 'border-indigo-500 ring-4 ring-indigo-500/20 text-gray-800' : 'border-gray-100 hover:border-gray-200 text-gray-800'}`}
                  >
                    <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
                      {selectedCategory || "Select a domain..."}
                    </span>
                    <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                  </div>
                  
                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto transform origin-top animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        {categoriesData.map((c, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              handleCategoryChange({ target: { value: c.category } });
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`px-5 py-3 cursor-pointer transition-colors ${selectedCategory === c.category ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-l-4 border-transparent'}`}
                          >
                            {c.category}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  <Layers className="w-4 h-4 mr-2 text-purple-500" />
                  Difficulty Level
                </label>
                <div className="relative">
                  <div 
                    onClick={() => { if (selectedCategory) { setIsLevelDropdownOpen(!isLevelDropdownOpen); setIsCategoryDropdownOpen(false); } }}
                    className={`w-full flex justify-between items-center bg-white border-2 rounded-xl px-5 py-4 transition-all font-medium text-lg shadow-sm ${!selectedCategory ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400' : 'cursor-pointer text-gray-800'} ${isLevelDropdownOpen ? 'border-indigo-500 ring-4 ring-indigo-500/20' : (!selectedCategory ? '' : 'border-gray-100 hover:border-gray-200')}`}
                  >
                    <span className={selectedLevel ? "text-gray-900" : "text-gray-400"}>
                      {selectedLevel || "Select proficiency..."}
                    </span>
                    <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isLevelDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                  </div>
                  
                  {isLevelDropdownOpen && selectedCategory && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLevelDropdownOpen(false)}></div>
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto transform origin-top animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        {availableLevels.map((lvl, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setSelectedLevel(lvl);
                              setIsLevelDropdownOpen(false);
                            }}
                            className={`px-5 py-3 cursor-pointer transition-colors ${selectedLevel === lvl ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-500' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-l-4 border-transparent'}`}
                          >
                            {lvl}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={startTest}
                  disabled={!selectedCategory || !selectedLevel}
                  className="w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 overflow-hidden group"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center gap-2">
                    Start Evaluation <Play className="w-5 h-5 fill-current" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Result Screen
  if (isTestFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultMessage = "Good Effort!";
    let resultColor = "text-yellow-500";
    let bgGradient = "from-yellow-400 to-orange-500";
    
    if (percentage >= 80) {
      resultMessage = "Outstanding Performance!";
      resultColor = "text-emerald-500";
      bgGradient = "from-emerald-400 to-teal-500";
    } else if (percentage < 50) {
      resultMessage = "Needs Improvement";
      resultColor = "text-red-500";
      bgGradient = "from-red-400 to-rose-500";
    }

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center relative border border-gray-100">
          <div className={`h-32 bg-gradient-to-r ${bgGradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative px-8 pb-12">
            <div className={`w-28 h-28 mx-auto -mt-14 bg-white rounded-full p-2 shadow-xl mb-6 flex items-center justify-center border-4 ${percentage >= 80 ? 'border-emerald-100' : percentage < 50 ? 'border-red-100' : 'border-yellow-100'}`}>
              <Award className={`w-14 h-14 ${resultColor}`} />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{resultMessage}</h2>
            <p className="text-gray-500 mb-8 font-medium">Evaluation complete for {selectedCategory}</p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-600 font-bold uppercase tracking-wider text-sm">Final Score</span>
                <span className={`text-4xl font-black ${resultColor}`}>{score}<span className="text-xl text-gray-400">/{questions.length}</span></span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${bgGradient}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="mt-3 text-right text-sm font-bold text-gray-500">{percentage}% Accuracy</div>
            </div>

            <button 
              onClick={resetTest}
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100 group w-full sm:w-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-600 group-hover:-rotate-180 transition-all duration-500" />
              Take Another Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Test Screen
  const currentQ = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedCategory}</h2>
              <p className="text-sm font-medium text-indigo-600">{selectedLevel} Level</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Question</p>
              <p className="text-2xl font-black text-gray-900">{currentQuestionIndex + 1}<span className="text-gray-400 text-lg">/{questions.length}</span></p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
          
          {/* Timer Ribbon */}
          <div className={`absolute top-0 inset-x-0 h-1.5 ${timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-transparent'}`}></div>

          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-8 gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {currentQ.questionText}
              </h3>
              
              {/* Timer Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg shrink-0 border-2 transition-colors ${timeLeft <= 10 ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-700'}`}>
                <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'animate-bounce' : ''}`} />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>
            </div>

            <div className="space-y-4">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                
                // Styling logic for options after selection
                let optionClasses = "border-2 border-gray-100 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 text-gray-700";
                let iconClasses = "bg-gray-100 text-gray-500";
                
                if (isTransitioning) {
                  if (isSelected) {
                    optionClasses = "border-2 border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]";
                    iconClasses = "bg-indigo-500 text-white";
                  } else {
                    optionClasses = "border-2 border-gray-50 bg-gray-50 text-gray-400 opacity-60";
                    iconClasses = "bg-gray-100 text-gray-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isTransitioning}
                    className={`w-full text-left p-5 rounded-2xl flex items-center gap-5 transition-all duration-300 group ${optionClasses}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors shrink-0 ${iconClasses} ${!isTransitioning ? 'group-hover:bg-indigo-500 group-hover:text-white' : ''}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg font-medium leading-relaxed">{option}</span>
                    
                    {/* Visual indicator for selected option */}
                    {isTransitioning && isSelected && (
                      <div className="ml-auto">
                        <CheckCircle2 className="w-6 h-6 text-indigo-500 animate-in fade-in zoom-in duration-200" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {timeLeft <= 10 && !isTransitioning && (
          <div className="mt-4 flex items-center justify-center text-red-500 font-medium animate-pulse">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Hurry up! Time is running out.
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeTest;
