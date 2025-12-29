import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Playground = () => {
  const userId = localStorage.getItem("eventuserId");
  const [state, setState] = useState({
    isDialogOpen: false,
    currentQuiz: null,
    currentQuestionIndex: 0,
    selectedOption: null,
    score: 0,
    quizCompleted: false,
    appliedUsers: [],
    timeLeft: 60,
    applied: [],
    quizEndedDueToTabSwitch: false,
    showInstructions: false,
  });
  const scoreRef = useRef(0);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await axios.get(`${API}/${endpoint}`);
      setter(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const fetchAppliedUsers = () =>
    fetchData("events-with-applications", (data) =>
      setState((prev) => ({
        ...prev,
        appliedUsers: data.filter((event) =>
          event.enrollments.some((enrollment) => enrollment.userId === userId)
        ),
      }))
    );

  const fetchApplied = () =>
    fetchData("eventapplications", (data) =>
      setState((prev) => ({ ...prev, applied: data }))
    );

  useEffect(() => {
    fetchAppliedUsers();
    fetchApplied();
  }, []);

  useEffect(() => {
    let timer;
    if (state.isDialogOpen && !state.quizCompleted && state.timeLeft > 0) {
      timer = setInterval(
        () => setState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 })),
        1000
      );
    } else if (state.timeLeft === 0) {
      nextQuestion();
    }
    return () => clearInterval(timer);
  }, [state.isDialogOpen, state.timeLeft, state.quizCompleted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.isDialogOpen && !state.quizCompleted) {
        storeScore(scoreRef.current);
      }
    }; 
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.isDialogOpen, state.quizCompleted]);

  const startQuiz = (quiz) => {
    setState((prev) => ({
      ...prev,
      currentQuiz: quiz,
      showInstructions: true,
    }));
  };

  const beginQuiz = () =>
    setState((prev) => ({
      ...prev,
      showInstructions: false,
      isDialogOpen: true,
      currentQuestionIndex: 0,
      score: 0,
      selectedOption: null,
      quizCompleted: false,
      timeLeft: 60,
    }));

  const reset = () =>
    setState((prev) => ({
      ...prev,
      showInstructions: false,
      isDialogOpen: false,
      currentQuestionIndex: 0,
      selectedOption: null,
      quizCompleted: false,
      quizEndedDueToTabSwitch: false,
    }));

  const storeScore = async (finalScore) => {
    try {
      await axios.post(`${API}/finalscore`, {
        userId,
        eventId: state.currentQuiz._id,
        coin: finalScore,
      });
      toast.success("Quiz auto-submitted due to tab switch!");
      setState((prev) => ({
        ...prev,
        quizEndedDueToTabSwitch: true,
        isDialogOpen: false,
      }));
      fetchAppliedUsers();
      fetchApplied();
    } catch (error) {
      console.error(
        "Error auto-submitting score:",
        error.response?.data || error.message
      );
    }
  };

  const finishScore = async (finalScore) => {
    try {
      await axios.post(`${API}/finalscore`, {
        userId,
        eventId: state.currentQuiz._id,
        coin: finalScore,
      });
      toast.success("Quiz completed successfully!");
      fetchAppliedUsers();
      fetchApplied();
      reset();
      // setState(prev => ({ ...prev, quizCompleted: false, isDialogOpen: false }));
    } catch (error) {
      console.error(
        "Error submitting final score:",
        error.response?.data || error.message
      );
    }
  };

  const nextQuestion = () => {
    // if (!state.selectedOption)
    //   return toast.error("Please select an option before proceeding.");

    const currentQuestion =
      state.currentQuiz.questions[state.currentQuestionIndex];
    if (state.selectedOption === currentQuestion.answer) {
      const newScore = state.score + currentQuestion.coin;
      scoreRef.current = newScore;
      setState((prev) => ({ ...prev, score: newScore }));
    }

    const nextIndex = state.currentQuestionIndex + 1;
    setState((prev) =>
      nextIndex < state.currentQuiz.questions.length
        ? {
            ...prev,
            currentQuestionIndex: nextIndex,
            timeLeft: 60,
            selectedOption: null,
          }
        : { ...prev, quizCompleted: true, selectedOption: null }
    );
  };

  const quitQuiz = () => {
    const confirm = window.confirm("Are you sure you want to quit the quiz?");
    if (!confirm) return;
    reset();
    toast("You have exited the quiz. You can retake it before end of this event time.", {
      icon: "⚠️",
    });
  };

  const {
    appliedUsers,
    applied,
    currentQuiz,
    currentQuestionIndex,
    selectedOption,
    timeLeft,
    quizCompleted,
    isDialogOpen,
    quizEndedDueToTabSwitch,
    showInstructions,
    score,
  } = state;


  return (
    <div className="eventheight scrollbar-hidden text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {quizEndedDueToTabSwitch && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-red-700 p-6 rounded-lg w-full max-w-md text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Quiz Ended</h2>
            <p className="text-white mb-4">
              You switched tabs. Your score has been saved.
            </p>
            <button
              onClick={reset}
              className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-300 transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {showInstructions && (
        <div className="fixed inset-0 z-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <div className="p-6 rounded-lg w-full max-w-md shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="text-sm mb-4">
              Don't switch tabs or leave the page. Your quiz will be
              auto-submitted if you do.
            </p>
            <button
              onClick={beginQuiz}
              className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Start Quiz
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 bg-red-600 rounded-md hover:bg-red-700 transition ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="h-full backdrop-blur-xl  p-1">
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {appliedUsers.filter((quiz) => quiz.status === "Ongoing").length >
          0 ? (
            appliedUsers
              .filter((quiz) => quiz.status === "Ongoing")
              .map((quiz, index) => {
                const appliedQuiz = applied.find(
                  (item) =>
                    item.eventId?._id === quiz._id &&
                    item.userId?._id === userId
                );
                const hasCoins = appliedQuiz?.coin !== null;
                return (
                  <div
                    key={index}
                    className="p-[4px] relative overflow-hidden  rounded-md text-center backdrop-blur-md shadow-xl border border-[#eeeeee2d] hover:shadow-xl transition-shadow duration-300 w-full lg:min-w-[500px] mx-auto">
                       <span className="absolute  inset-0 bg-gradient-to-r animate-pulse from-blue-500 to-purple-500 mask mask-out"></span>
                       <span className="relative block rounded-md bg-[#000000] w-full px-4 py-3">
                    <h2 className="text-lg text-center font-semibold mb-2">
                      {quiz.title}
                    </h2>
                    <h2 className="text-center animate-bounce">
                      {quiz.status}
                    </h2>
                    <p className="text-md text-center mt-2">
                      {new Date(quiz.start).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    {!hasCoins ? (
                      <button
                        onClick={() => startQuiz(quiz)}
                        className="px-4 py-2 mt-3 w-full active:animate-ping bg-gradient-to-r  from-blue-500 to-purple-500 rounded-md transition-colors duration-200"
                      >
                        Start Quiz
                      </button>
                    ) : (
                      <h2 className="text-md px-4 py-2 mt-3 rounded-md bg-gradient-to-r  from-green-500 to-green-800 text-white">Completed</h2>
                    )}
                      </span>
                  </div>
                );
              })
          ) : (
            <div className=" absolute -z-10 top-[50%] left-[50%] trannform translate-x-[-50%] translate-y-[-50%]">
              <h2 className="text-lg font-semibold text-black mb-2 text-center w-full">
              No Ongoing Quiz Available
            </h2>
            </div>
          )}
        </div>
      </div>

      {isDialogOpen && currentQuiz?.questions?.length > 0 && !quizCompleted && (
        <div className="fixed inset-0 z-[99] bg-black">
          <div className="bg-[#000000] p-6 rounded-lg w-full absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-between rounded-full items-center py-5 px-12">
              <div className="text-center font-bold text-white">
                Question {currentQuestionIndex + 1} of{" "}
                {currentQuiz.questions.length}
              </div>
              <div className="text-lg text-center  p-3 whitespace-nowrap  text-red-700 font-bold tracking-wide  drop-shadow-lg">
               <span className="animate-pulse">⏳</span> Time Left: {timeLeft}s
              </div>
              <div>{currentQuiz.title}</div>
            </div>
            <div className="relative flex justify-between items-center text-center my-4 gap-3 p-[3px] rounded-full">
              <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r animate-pulse from-blue-500 to-purple-500"></div>
              <div className="relative bg-[#000000] w-full text-lg rounded-full p-10">
                {currentQuiz.questions[currentQuestionIndex].question}{" "} <span className="text-blue-600"> ( {currentQuiz.questions[currentQuestionIndex].coin} coins )</span>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((opt) => (
                <label
                  key={opt}
                  className={`relative flex items-center p-[3px] rounded-full cursor-pointer transition-colors duration-200 ${
                    selectedOption ===
                    currentQuiz.questions[currentQuestionIndex][`option${opt}`]
                      ? "border-transparent"
                      : "border border-[#eeeeee2d]"
                  }`}
                >
                  <span className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-blue-500 to-purple-500"></span>
                  <span className="relative flex items-center bg-[#000000] w-full h-full  rounded-full p-5">
                    <input
                      type="radio"
                      name="option"
                      checked={
                        selectedOption ===
                        currentQuiz.questions[currentQuestionIndex][
                          `option${opt}`
                        ]
                      }
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          selectedOption:
                            currentQuiz.questions[currentQuestionIndex][
                              `option${opt}`
                            ],
                        }))
                      }
                      className={`mr-2 ${
                        selectedOption ===
                        currentQuiz.questions[currentQuestionIndex][
                          `option${opt}`
                        ]
                          ? "animate-ping"
                          : ""
                      }`}
                    />
                    {
                      currentQuiz.questions[currentQuestionIndex][
                        `option${opt}`
                      ]
                    }
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={quitQuiz}
                className="relative p-[3px] rounded-full w-full text-white bg-black"
              >
                <span className="absolute inset-0 bg-gradient-to-r animate-pulse from-blue-500 to-purple-500 rounded-full p-[2px] mask mask-out"></span>
                <span className="relative block font-bold bg-black rounded-full px-4 py-3">
                  Quit
                </span>
              </button>
              <button
                onClick={nextQuestion}
                className="relative p-[3px] rounded-full w-full  text-white bg-black"
              >
                <span className="absolute inset-0 bg-gradient-to-r animate-pulse   from-blue-500 to-purple-500 rounded-full p-[2px] mask mask-out"></span>
                <span className="relative block active:animate-ping font-bold  bg-black rounded-full px-4 py-3">
                {currentQuestionIndex + 1 === currentQuiz.questions.length
                  ? "Submit"
                  : "Next"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {quizCompleted && (
        <div className="fixed inset-0 z-[99] bg-black bg-opacity-100 flex items-center justify-center">
          <div className=" p-6 rounded-lg w-full max-w-md shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4 animate-bounce">Quiz Completed!</h2>
            {/* <button
              onClick={reset}
              className="px-6 py-2 bg-black border border-gray-600 rounded-md hover:bg-gray-900 transition-colors duration-200"
            >
              Close
            </button> */}
            <button
              onClick={() => finishScore(score)}
              className="px-6 py-2 bg-black border border-gray-600 rounded-md active:animate-ping transition-colors duration-200"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;
