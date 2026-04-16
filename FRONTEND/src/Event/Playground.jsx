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
    timeLeft: 30,
    applied: [],
    quizEndedDueToTabSwitch: false,
    showInstructions: false,
    hasCameraPermission: false,
    showAudioWarning: false,
    cameraExpanded: false,
    cameraPiPActive: false,
  });
  const scoreRef = useRef(0);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [retryCamera, setRetryCamera] = useState(0);

  const waitForVideoReady = (videoEl) =>
    new Promise((resolve, reject) => {
      if (!videoEl) {
        reject(new Error("Video element missing"));
        return;
      }

      if (videoEl.readyState >= 2) {
        resolve();
        return;
      }

      const onLoaded = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(new Error("Video stream not ready"));
      };

      const cleanup = () => {
        videoEl.removeEventListener("loadedmetadata", onLoaded);
        videoEl.removeEventListener("error", onError);
      };

      videoEl.addEventListener("loadedmetadata", onLoaded, { once: true });
      videoEl.addEventListener("error", onError, { once: true });

      setTimeout(() => {
        cleanup();
        reject(new Error("Timed out waiting for camera stream"));
      }, 2500);
    });

  const openCameraPiP = async ({ showPinnedToast = true } = {}) => {
    const videoEl = videoRef.current;

    if (!videoEl) {
      toast.error("Camera is not ready yet.");
      return false;
    }

    if (!document.pictureInPictureEnabled || videoEl.disablePictureInPicture) {
      toast.error("Picture-in-Picture is not supported in this browser.");
      return false;
    }

    try {
      await waitForVideoReady(videoEl);
      await videoEl.play();
      await videoEl.requestPictureInPicture();
      setState((prev) => ({ ...prev, cameraPiPActive: true }));

      if (showPinnedToast) {
        toast.success("Camera pinned in Picture-in-Picture window.");
      }
      return true;
    } catch (error) {
      console.error("Open PiP failed:", error);
      toast.error("Unable to open camera window. Click Pin again.");
      return false;
    }
  };

  const toggleCameraPiP = async () => {
    const videoEl = videoRef.current;

    if (!videoEl) {
      toast.error("Camera is not ready yet.");
      return;
    }

    if (!document.pictureInPictureEnabled || videoEl.disablePictureInPicture) {
      toast.error("Picture-in-Picture is not supported in this browser.");
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setState((prev) => ({ ...prev, cameraPiPActive: false }));
        return;
      }

      await openCameraPiP();
    } catch (error) {
      console.error("PiP toggle failed:", error);
      toast.error("Unable to start Picture-in-Picture.");
    }
  };

  const toggleCameraExpanded = async () => {
    // When minimizing from full mode, try to keep camera visible via PiP.
    if (state.cameraExpanded) {
      setState((prev) => ({ ...prev, cameraExpanded: false }));

      const videoEl = videoRef.current;
      if (
        !state.cameraPiPActive &&
        videoEl &&
        document.pictureInPictureEnabled &&
        !videoEl.disablePictureInPicture
      ) {
        const opened = await openCameraPiP({ showPinnedToast: false });
        if (opened) {
          toast.success("Camera pinned while recorder is minimized.");
        } else {
          toast("Click Pin to keep camera visible across windows.", { icon: "📌" });
        }
      }
      return;
    }

    setState((prev) => ({ ...prev, cameraExpanded: true }));
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const onEnterPiP = () => {
      setState((prev) => ({ ...prev, cameraPiPActive: true }));
    };

    const onLeavePiP = () => {
      setState((prev) => ({ ...prev, cameraPiPActive: false }));
    };

    videoEl.addEventListener("enterpictureinpicture", onEnterPiP);
    videoEl.addEventListener("leavepictureinpicture", onLeavePiP);

    return () => {
      videoEl.removeEventListener("enterpictureinpicture", onEnterPiP);
      videoEl.removeEventListener("leavepictureinpicture", onLeavePiP);
    };
  }, [state.isDialogOpen]);

  // Fake Proctoring: Request Camera & Audio Access
  useEffect(() => {
    let stream;
    let animationFrameId;

    const startProctoring = async () => {
      if (state.isDialogOpen && !state.quizCompleted) {
        try {
          // Request both video and audio
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

          // Setup Video
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          // Setup Audio Analysis
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }
          audioContextRef.current = audioContext;
          const analyser = audioContext.createAnalyser();
          analyserRef.current = analyser;
          analyser.fftSize = 256;

          const source = audioContext.createMediaStreamSource(stream);
          sourceRef.current = source;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / dataArray.length;

            // Threshold for "Sound Spike" (adjust as needed, e.g., 30)
            if (average > 60) {
              setState(prev => {
                if (!prev.showAudioWarning) {
                  return { ...prev, showAudioWarning: true };
                }
                return prev;
              });

              // Hide warning after 2 seconds
              setTimeout(() => {
                setState(prev => ({ ...prev, showAudioWarning: false }));
              }, 2000);
            }

            animationFrameId = requestAnimationFrame(checkVolume);
          };

          checkVolume();

          setState(prev => ({ ...prev, hasCameraPermission: true }));
        } catch (err) {
          console.error("Access denied or error:", err);
          setState(prev => ({ ...prev, hasCameraPermission: false }));
        }
      }
    };

    const stopProctoring = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };

    if (state.isDialogOpen && !state.quizCompleted) {
      startProctoring();
    } else {
      stopProctoring();
    }

    return () => {
      stopProctoring();
    };
  }, [state.isDialogOpen, state.quizCompleted, retryCamera]);

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
      // Only punish if camera permission is ALREADY granted (quiz is active)
      if (document.hidden && state.isDialogOpen && !state.quizCompleted && state.hasCameraPermission) {
        storeScore(scoreRef.current);
      }
    };

    const handleFullscreenChange = () => {
      // Only punish if camera permission is ALREADY granted AND fullscreen is actually supported
      const isFullscreenSupported = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;

      // Check both standard and vendor-prefixed fullscreen properties
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

      if (isFullscreenSupported && !isFullscreen && state.isDialogOpen && !state.quizCompleted && state.hasCameraPermission) {
        storeScore(scoreRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // For Safari

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [state.isDialogOpen, state.quizCompleted, state.hasCameraPermission]);

  const startQuiz = (quiz) => {
    // Block mobile users (screen width < 768px)
    if (window.innerWidth < 768) {
      toast.error("This quiz is only available on Desktop or Laptop devices for proctoring integrity.", {
        duration: 4000,
        icon: "💻",
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      currentQuiz: quiz,
      showInstructions: true,
    }));
  };

  const beginQuiz = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        await document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        await document.documentElement.msRequestFullscreen();
      } else {
        console.warn("Fullscreen API not supported on this device (likely iOS). Proceeding without fullscreen.");
      }
    } catch (err) {
      console.error("Error attempting to enable full-screen mode:", err);
      // Proceed anyway - don't block user if fullscreen fails
    }

    setState((prev) => ({
      ...prev,
      showInstructions: false,
      isDialogOpen: true,
      currentQuestionIndex: 0,
      score: 0,
      selectedOption: null,
      quizCompleted: false,
      timeLeft: 30,
      cameraExpanded: false,
      cameraPiPActive: false,
    }));
  };

  const reset = () =>
    setState((prev) => ({
      ...prev,
      showInstructions: false,
      isDialogOpen: false,
      currentQuestionIndex: 0,
      selectedOption: null,
      quizCompleted: false,
      quizEndedDueToTabSwitch: false,
      cameraExpanded: false,
      cameraPiPActive: false,
      showAudioWarning: false,
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
          timeLeft: 30,
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
            <h2 className="text-xl font-bold mb-4 text-white">Quiz Terminated</h2>
            <p className="text-white mb-4">
              You exited fullscreen or switched tabs. Your score has been submitted as-is.
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
          <div className="p-8 rounded-lg w-full max-w-lg shadow-2xl bg-white text-black text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse"></div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">⚠️ Quiz Rules & Terms</h2>

            <div className="text-left space-y-4 mb-8 text-sm text-gray-700 bg-gray-100 p-4 rounded-md border border-gray-200">
              <p className="flex items-center gap-2">
                <span className="text-xl">📷</span>
                <span><strong>Camera & Microphone Required:</strong> You must allow access. You will be monitored.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-xl">🖥️</span>
                <span><strong>Fullscreen Mode:</strong> The quiz will force fullscreen. Exiting it will terminate the quiz.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-xl">🚫</span>
                <span><strong>No Tab Switching:</strong> Switching tabs or windows will auto-submit your score immediately.</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-xl">🤫</span>
                <span><strong>Stay Silent:</strong> Loud noises may trigger warnings.</span>
              </p>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              By clicking "Start Quiz", you agree to these terms and conditions.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={beginQuiz}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition transform"
              >
                I Agree & Start Quiz
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-full backdrop-blur-xl  p-1">
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
          {appliedUsers.filter((quiz) => quiz.status === "ongoing").length >
            0 ? (
            appliedUsers
              .filter((quiz) => quiz.status === "ongoing")
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
          {/* FAKE PROCTORING WEBCAM */}
          <div
            className={`${state.cameraExpanded
              ? "fixed inset-0 z-[120] rounded-none border-0"
              : "absolute top-2 right-2 md:top-4 md:right-4 z-[100] w-40 md:w-64 rounded-lg border-2 border-red-600"
              } overflow-hidden shadow-xl bg-black transition-all duration-300`}
          >
            <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 flex items-center justify-between gap-2 animate-pulse">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"></span>
                REC
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleCameraExpanded}
                  className="px-1.5 py-0.5 rounded bg-black/30 hover:bg-black/50"
                >
                  {state.cameraExpanded ? "Min" : "Full"}
                </button>
                <button
                  type="button"
                  onClick={toggleCameraPiP}
                  className={`px-1.5 py-0.5 rounded ${state.cameraPiPActive ? "bg-green-700" : "bg-black/30 hover:bg-black/50"}`}
                >
                  {state.cameraPiPActive ? "Pinned" : "Pin"}
                </button>
              </div>
            </div>
            {state.showAudioWarning && (
              <div className="absolute inset-0 z-10 bg-red-600 bg-opacity-90 flex flex-col items-center justify-center text-white text-center p-2 animate-bounce">
                <span className="text-xl md:text-2xl">🤫</span>
                <span className="text-[10px] md:text-xs font-bold uppercase">Stay Silent!</span>
                <span className="text-[8px] md:text-[10px]">Noise Detected</span>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full ${state.cameraExpanded ? "h-[calc(100vh-32px)]" : "h-24 md:h-40"
                } object-cover transform scale-x-[-1]`}
            />
          </div>

          <div className="bg-[#000000] p-6 rounded-lg w-full absolute top-[55%] md:top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300">
            {!state.hasCameraPermission ? (
              <div className="text-center text-white py-10">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Camera Access Required</h2>
                <p className="mb-6">You must allow camera access to take this quiz. We use it for proctoring.</p>
                <button
                  onClick={() => setRetryCamera(prev => prev + 1)}
                  className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition animate-pulse"
                >
                  Enable Camera & Retry
                </button>
                <p className="mt-4 text-xs text-gray-400">
                  (If blocked, please click the lock icon in your address bar and reset permissions)
                </p>
              </div>
            ) : (
              <>
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
                  <div className="relative bg-[#000000] w-full text-lg rounded-full p-10 text-white">
                    {currentQuiz.questions[currentQuestionIndex].question}{" "} <span className="text-blue-600"> ( {currentQuiz.questions[currentQuestionIndex].coin} coins )</span>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                  {[1, 2, 3, 4].map((opt) => (
                    <label
                      key={opt}
                      className={`relative flex items-center p-[3px] rounded-full cursor-pointer transition-colors duration-200 ${selectedOption ===
                        currentQuiz.questions[currentQuestionIndex][`option${opt}`]
                        ? "border-transparent"
                        : "border border-[#eeeeee2d]"
                        }`}
                    >
                      <span className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-blue-500 to-purple-500"></span>
                      <span className="relative flex items-center bg-[#000000] w-full h-full  rounded-full p-5 text-white">
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
                          className={`mr-2 ${selectedOption ===
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
              </>
            )}
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
