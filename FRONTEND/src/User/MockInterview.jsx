import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../API";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";

const MockInterview = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [nextAction, setNextAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraWarning, setCameraWarning] = useState(null);
  const [voiceWarning, setVoiceWarning] = useState(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const lastWarningTimeRef = useRef(0); // For debouncing camera warnings

  // Show camera warning (top, red) with debounce
  const showCameraWarning = (message) => {
    const now = Date.now();
    if (now - lastWarningTimeRef.current < 5000) return; // Debounce: only show every 5 seconds
    setCameraWarning(message);
    lastWarningTimeRef.current = now;
    setTimeout(() => setCameraWarning(null), 5000);
  };
  // Show voice warning (bottom, yellow) for 5 seconds
  const showVoiceWarning = (message) => {
    setVoiceWarning(message);
    setTimeout(() => setVoiceWarning(null), 5000);
  };
  // Start Interview
  const beginInterview = async () => {
    setLoading(true);
    try {
      const sessionRes = await axios.post(`${API}/start-session`);
      setSessionId(sessionRes.data.sessionId);
      setInterviewStarted(true);
      setShowInstructions(true);
    } catch (error) {
      console.error("Error starting interview:", error);
      showCameraWarning("Failed to start the interview.");
    } finally {
      setLoading(false);
    }
  };
  // Continue Interview
  const continueInterview = async () => {
    if (!selectedDomain || !sessionId) return;
    setLoading(true);
    setShowInstructions(false);
    try {
      const res = await axios.get(
        `${API}/questions?sessionId=${sessionId}&category=${selectedDomain}`
      );
      const question = res.data.question;
      console.log("Fetched first question:", question);
      setCurrentQuestion(question);
      setAnswer("");
      setFeedback(null);
      setNextAction(null);
    } catch (error) {
      console.error("Error fetching question:", error);
      showCameraWarning("Failed to fetch question.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel Interview
  const cancelInterview = () => {
    setShowInstructions(false);
    setInterviewStarted(false);
    setSessionId(null);
    stopVideo();
  };

  // Fetch New Question
  const fetchQuestion = async () => {
    if (!selectedDomain || !sessionId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/questions?sessionId=${sessionId}&category=${selectedDomain}`
      );
      const question = res.data.question;
      console.log("Fetched new question:", question);
      setCurrentQuestion(question);
      setAnswer("");
      setFeedback(null);
      setNextAction(null);
    } catch (error) {
      console.error("Error fetching question:", error);
      showCameraWarning("Failed to fetch question.");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Speech Recognition Setup
  const startSpeechRecognition = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      showCameraWarning("Your browser does not support speech recognition.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false; // Only use final results to avoid duplicates

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript)
        .join(" ");
      if (transcript) {
        setAnswer((prev) => prev + (prev ? " " : "") + transcript); // Append only final results
      }
    };

    recognition.onstart = () => {
      setIsRecording(true);
      if (analyserRef.current) {
        detectVoicePitch(analyserRef.current);
      }
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit Response
  const submitResponse = async () => {
    if (!answer.trim()) {
      showCameraWarning("Please provide an answer before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/evaluate`, { sessionId, answer });
      const { evaluation, nextAction } = res.data;
      setFeedback(evaluation);
      setNextAction(nextAction);
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(`${evaluation} ${nextAction}`);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      console.error("Error evaluating response:", error);
      showCameraWarning("Failed to evaluate response.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Next Step
  const handleNextStep = () => {
    console.log("Next action triggered:", nextAction);
    const score = parseInt(feedback.match(/(\d+)/)?.[0] || 0);
    if (score >= 7) {
      fetchQuestion();
    } else {
      setInterviewStarted(false);
      setSessionId(null);
      setCurrentQuestion(null);
      setAnswer("");
      setFeedback(null);
      setNextAction(null);
      stopVideo();
    }
  };

  // Fetch User Domain
  useEffect(() => {
    const getUserDomain = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        showCameraWarning("User is not logged in.");
        return;
      }
      try {
        const res = await axios.get(`${API}/get-domain`, { params: { email: userEmail } });
        setSelectedDomain(res.data.domain || null);
      } catch (error) {
        console.error("Error fetching domain:", error);
        showCameraWarning("Failed to fetch domain.");
      }
    };
    getUserDomain();
  }, []);

  // Video and Anti-Cheating Setup
  useEffect(() => {
    let model;
    const setupVideoAndAntiCheating = async () => {
      if (currentQuestion && !videoStream && !loading) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.error("Video playback error:", e));
        }

        // Load FaceMesh for gaze and head tracking
        model = await facemesh.load();
        detectFace(model);

        // Setup audio context for pitch detection
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;
      }
    };

    setupVideoAndAntiCheating();

    return () => {
      stopVideo();
      if (audioContextRef.current) audioContextRef.current.close();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [currentQuestion, loading]);

  // Anti-Cheating: Face Detection
  const detectFace = async (model) => {
    if (videoRef.current && !loading) {
      const predictions = await model.estimateFaces(videoRef.current);
      if (predictions.length > 0) {
        const keypoints = predictions[0].scaledMesh;
        const nose = keypoints[1];
  
        // Threshold for head rotation
        const headRotationThreshold = 100; // Adjusted for leniency
  
        // Check if head is rotated too far from center
        const isHeadRotated = Math.abs(nose[0] - videoRef.current.width / 2) > headRotationThreshold;
  
        if (isHeadRotated) {
          console.log("Cheating detected: Head rotated too far!");
          showCameraWarning("Please keep your head centered and facing the camera.");
        }
      }
      requestAnimationFrame(() => detectFace(model));
    }
  };

  // Anti-Cheating: Voice Pitch Detection
  const detectVoicePitch = (analyser) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkPitch = () => {
      if (!isRecording) return;
      analyser.getByteFrequencyData(dataArray);
      let maxAmplitude = 0;
      let dominantFreqIndex = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxAmplitude) {
          maxAmplitude = dataArray[i];
          dominantFreqIndex = i;
        }
      }
      const frequency = (dominantFreqIndex * audioContextRef.current.sampleRate) / analyser.fftSize;
      const isValidPitch = frequency > 85 && frequency < 255;
      const hasMultiplePeaks = dataArray.filter((val) => val > maxAmplitude * 0.5).length > 5;
 
      if (!isValidPitch || hasMultiplePeaks) {
        console.log("Cheating detected: Abnormal pitch or multiple voices!");
        showVoiceWarning("Only one voice should be detected.");
      }
      requestAnimationFrame(checkPitch);
    };
    checkPitch();
  };

  // Stop Video Stream
  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
      console.log("Webcam stream stopped");
    }
  };

  // Speak Current Question
  useEffect(() => {
    if (currentQuestion && !loading) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      setTimeout(() => window.speechSynthesis.speak(utterance), 100);
    }
  }, [currentQuestion, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl transform transition-all hover:scale-[1.02] relative">
        {cameraWarning && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 rounded-t-2xl flex items-center justify-between animate-slide-down">
            <span>{cameraWarning}</span>
            <button
              onClick={() => setCameraWarning(null)}
              className="text-white font-bold text-lg hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}
        {voiceWarning && (
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-black p-4 rounded-b-2xl flex items-center justify-between animate-slide-up">
            <span>{voiceWarning}</span>
            <button
              onClick={() => setVoiceWarning(null)}
              className="text-black font-bold text-lg hover:text-gray-800"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black text-center">Mock Interview</h1>
        </div>
        {interviewStarted && currentQuestion && !loading && (
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mb-8">
            <div className="flex justify-between gap-4">
              <div className="w-1/2 relative">
                <div
                  className={`h-48 rounded-lg flex items-center justify-center overflow-hidden ${
                    isSpeaking ? "border-4 border-green-500" : "border-2 border-gray-300"
                  }`}
                >
                  <div className="relative w-full h-full bg-black">
                    {isSpeaking && (
                      <div className="absolute bottom-2 left-2 flex space-x-1">
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }} 
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">AI Interviewer</p>
              </div>
              <div className="w-1/2 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="h-48 w-full rounded-lg object-cover border-2 border-gray-300"
                />
                {videoStream && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                    REC
                  </div>
                )}
                <p className="text-center text-sm text-gray-600 mt-2">You</p>
              </div>
            </div>
          </div>
        )}
        {!interviewStarted && (
          <div className="flex justify-center mb-8">
            <button
              onClick={beginInterview}
              disabled={loading || !selectedDomain}
              className={`w-48 py-3 bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-full hover:from-orange-300 hover:to-orange-600 transition-all disabled:opacity-50`}
            >
              {loading ? "Starting..." : "Begin Interview"}
            </button>
          </div>
        )}
        {showInstructions && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative">
              <button
                onClick={cancelInterview}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-black mb-4">Interview Instructions</h2>
              <p className="text-gray-700">
                Welcome to the Mock Interview! Here’s how it works:
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>You’ll be asked a series of questions based on your domain.</li>
                  <li>Answer by typing or speaking (use the "Start Speaking" button).</li>
                  <li>Submit your answer to receive feedback from the AI.</li>
                  <li>
                    If your answer scores 7 or higher, you’ll get a new question; otherwise,
                    you’ll restart the interview.
                  </li>
                  <li>Use Chrome or Edge for the best voice experience.</li>
                </ul>
              </p>
              <button
                onClick={continueInterview}
                disabled={loading}
                className={`w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-orange-300 text-white rounded-full hover:from-orange-300 hover:to-orange-600 transition-all disabled:opacity-50`}
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        )}
        {loading && interviewStarted && !showInstructions && (
          <p className="text-center text-lg text-gray-600 animate-pulse">Loading...</p>
        )}
        {currentQuestion && !loading && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Question:</h3>
            <p className="text-gray-700 mb-6">{currentQuestion}</p>
            <textarea
              rows="5"
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600 transition-all"
            />
            <div className="mt-4 flex justify-start gap-4">
              <button
                onClick={() => (isRecording ? stopSpeechRecognition() : startSpeechRecognition())}
                className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-all"
              >
                {isRecording ? "Stop Speaking" : "Start Speaking"}
              </button>
            </div>
            <button
              onClick={submitResponse}
              disabled={loading}
              className={`w-full py-3 mt-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50`}
            >
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
            {feedback && (
              <div className="mt-8 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">Feedback:</h3>
                <p className="text-gray-700">{feedback}</p>
                <p className="text-gray-600 mt-2">{nextAction}</p>
                <button
                  onClick={handleNextStep}
                  className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-all"
                >
                  Continue
                </button>
              </div>
            )}
          </div> 
        )} 
      </div>
    </div>
  ); 
};

// CSS for animations
const styles = `
  @keyframes slide-down {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(0); }
  }
  @keyframes slide-up { 
    0% { transform: translateY(100%); }
    100% { transform: translateY(0); }
  }
  .animate-slide-down { 
    animation: slide-down 0.3s ease-out;
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out; 
  }
`;

export default MockInterview; 