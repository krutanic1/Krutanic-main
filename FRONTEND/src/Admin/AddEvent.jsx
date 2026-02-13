import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AddEvent = () => {
  const [isFormVisible, setisFormVisible] = useState(false);
  const [isQuestionFormVisible, setisQuestionFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSetectedEvent] = useState(null);
  const [showAppliedDetails, setShowAppliedDetails] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(null);

  // Bulk Upload State
  const [isBulkUploadVisible, setIsBulkUploadVisible] = useState(false);
  const [bulkJson, setBulkJson] = useState("");


  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    coin: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    type: "MCQ",
    mode: "online",
    location: "Online",
    status: "upcoming",
    isFree: true,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "Asia/Kolkata",
    shortDescription: "",
    fullDescription: "",
    eligibility: "Open for all students",
    benefits: "", // Added benefits as string for textarea
    registrationLink: "",
    maxParticipants: "",
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
    prizeMoney: "",

    image: "",
    faqs: [],
  });

  // ... (rest of code) ...

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "AI",
      type: "MCQ",
      mode: "online",
      location: "Online",
      status: "upcoming",
      isFree: true,
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      timezone: "Asia/Kolkata",
      shortDescription: "",
      fullDescription: "",
      eligibility: "Open for all students",
      benefits: "",
      registrationLink: "",
      maxParticipants: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      prizeMoney: "",

      image: "",
      faqs: [],
    });
    setForm({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
      coin: "",
    })
    setEditId(null);
    setisFormVisible(false);
    setisQuestionFormVisible(false);
    setIsBulkUploadVisible(false);
    setBulkJson("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeQuestions = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare payload. Convert benefits string to array.
    const payload = {
      ...formData,
      benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim() !== '') : []
    };

    try {
      if (editId) {
        await axios.put(`${API}/allevents/${editId}`, payload);
        toast.success("Event updated successfully");
      } else {
        await axios.post(`${API}/addevent`, payload);
        toast.success("Event Added successfully");
      }
      fetchEvent();
      resetForm();
    } catch (error) {
      toast.error(
        "There was an error while creating or updating the Event. Please try again."
      );
      console.error("Error creating or updating Event", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API}/events-with-applications`);
      setAllEvents(response.data);
      // Default select the first event only if nothing is selected and events exist
      if (response.data.length > 0 && !selectedEvent) {
        setSetectedEvent(response.data[0]);
      } else if (selectedEvent) {
        // If something is selected, refresh its data
        const updatedSelected = response.data.find(e => e._id === selectedEvent._id);
        if (updatedSelected) setSetectedEvent(updatedSelected);
      }
    } catch (error) {
      console.error("There was an error fetching Events:", error);
    }
  };



  const handleEdit = (events) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the event?"
    );
    if (isConfirmed) {
      setFormData({
        title: events.title || "",
        slug: events.slug || "",
        category: events.category || "AI",
        type: events.type || "MCQ",
        mode: events.mode || "online",
        location: events.location || "Online",
        status: events.status || "upcoming",
        isFree: events.isFree !== undefined ? events.isFree : true,
        startDate: events.startDate ? new Date(events.startDate).toISOString().slice(0, 10) : "",
        endDate: events.endDate ? new Date(events.endDate).toISOString().slice(0, 10) : "",
        startTime: events.startTime || "",
        endTime: events.endTime || "",
        timezone: events.timezone || "Asia/Kolkata",
        shortDescription: events.shortDescription || "",
        fullDescription: events.fullDescription || "",
        eligibility: events.eligibility || "Open for all students",
        benefits: events.benefits ? events.benefits.join('\n') : "", // Convert array to string for textarea
        registrationLink: events.registrationLink || "",
        maxParticipants: events.maxParticipants || "",
        isPublished: events.isPublished !== undefined ? events.isPublished : false,
        metaTitle: events.metaTitle || "",
        metaDescription: events.metaDescription || "",
        prizeMoney: events.prizeMoney || "",

        image: events.image || "",
        faqs: events.faqs || [],
      });
      setEditId(events._id);
      setisFormVisible(true);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${API}/allevents/${id}`);
      toast.success("Event deleted successfully!");
      fetchEvent();
      if (selectedEvent && selectedEvent._id === id) {
        setSetectedEvent(null);
      }
    } catch (error) {
      toast.error("Error deleting Event");
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    const newQuestion = {
      question: form.question,
      option1: form.option1,
      option2: form.option2,
      option3: form.option3,
      option4: form.option4,
      answer: form.answer,
      coin: form.coin,
    };
    try {
      if (editId) {
        await axios.put(
          `${API}/addquestions/${selectedEvent._id}/questions/${editId}`,
          newQuestion
        );
        toast.success("Question updated successfully");
      } else {
        await axios.put(
          `${API}/addquestions/${selectedEvent._id}`,
          newQuestion
        );
        toast.success("Question added successfully");
      }
      fetchEvent();
      resetForm();
    } catch (error) {
      toast.error(
        "There was an error while adding or updating the question. Please try again."
      );
      console.error("Error adding or updating the question", error);
    }
  };

  const handleDeleteQuestion = async (eventId, questionId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this question?");
    if (!isConfirmed) return;
    try {
      await axios.delete(`${API}/allevents/${eventId}/questions/${questionId}`);
      toast.success("Question deleted successfully!");
      fetchEvent();
    } catch (error) {
      toast.error("Error deleting question");
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };
  const handleEditQuestion = (question) => {
    const isConfirmed = window.confirm("Are you sure you want to edit this question?");
    if (!isConfirmed) return;
    setForm({
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      answer: question.answer,
      coin: question.coin,
    });
    setEditId(question._id);
    setisQuestionFormVisible(true);
  };

  const handleShowAppliedDetails = (eventId) => {
    const event = allEvents.find(event => event._id === eventId);
    setShowAppliedDetails(event);
  };

  const handleStatusChange = async (e, id) => {
    const status = e.target.value;
    try {
      const response = await axios.put(`${API}/updateeventstatus/${id}`, { status: status });
      console.log(response.data.message);
      fetchEvent();
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || error.message);
    }
  };

  const handleSendReminder = async (eventId, eventTitle) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to send reminder emails to all students enrolled in "${eventTitle}"?`
    );
    if (!isConfirmed) return;

    setSendingReminder(eventId);
    try {
      const response = await axios.post(`${API}/send-event-reminder/${eventId}`);
      toast.success(`Reminder emails sent to ${response.data.recipientCount} students!`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to send reminder emails";
      toast.error(errorMsg);
      console.error("Error sending reminder:", error);
    } finally {
      setSendingReminder(null);
    }
  };


  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedQuestions = JSON.parse(bulkJson);
      if (!Array.isArray(parsedQuestions)) {
        toast.error("Invalid format: Root must be an array []");
        return;
      }

      // Basic validation
      const isValid = parsedQuestions.every(q =>
        q.question && q.option1 && q.option2 && q.option3 && q.option4 && q.answer
      );

      if (!isValid) {
        toast.error("Invalid data: Each question must have question, 4 options, and an answer.");
        return;
      }

      await axios.put(`${API}/addquestions/${selectedEvent._id}/bulk`, { questions: parsedQuestions });
      toast.success(`${parsedQuestions.length} Questions added successfully`);
      fetchEvent();
      resetForm();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON syntax. Please check your input.");
      } else {
        toast.error("Error adding bulk questions.");
        console.error("Bulk upload error", error);
      }
    }
  };

  return (
    <div id="Event" className="ml-[270px] p-4 max-w-[calc(100vw-280px)] overflow-x-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Event Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editId ? "Edit Event" : "Add Event"}</h2>
              <span onClick={resetForm} className="cursor-pointer text-xl font-bold">✖</span>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CORE EVENT */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-semibold text-lg border-b pb-1 mb-2">Core Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium">Title *</label>
                <input
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Slug (SEO URL) *</label>
                <input
                  value={formData.slug}
                  onChange={handleChange}
                  type="text"
                  name="slug"
                  placeholder="event-url-slug"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
                  <option value="AI">AI</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Business Analytics">Business Analytics</option>
                  <option value="Full Stack Web Development">Full Stack Web Development</option>
                  <option value="Android App Development">Android App Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="DevOps">DevOps</option>
                  {/* <option value="Automation Testing">Automation Testing</option> */}
                  <option value="Finance">Finance</option>
                  <option value="Human Resource">Human Resource</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Stock Marketing">Stock Marketing</option>
                  {/* <option value="Supply Chain Management">Supply Chain Management</option> */}
                  {/* <option value="Fintech">Fintech</option> */}
                  <option value="Graphics Design">Graphics Design</option>
                  <option value="Embedded System">Embedded System</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="IOT & Robotics">IOT & Robotics</option>
                  {/* <option value="Nano Technology & Genetic Engineering">Nano Technology & Genetic Engineering</option> */}
                  {/* <option value="Psychology">Psychology</option> */}
                  <option value="Auto Cad">Auto Cad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  value={formData.image}
                  onChange={handleChange}
                  type="text"
                  name="image"
                  placeholder="https://..."
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Type</label>
                <input
                  value={formData.type}
                  onChange={handleChange}
                  type="text"
                  name="type"
                  placeholder="MCQ / Hackathon / Workshop"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Mode</label>
                <select name="mode" value={formData.mode} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  value={formData.location}
                  onChange={handleChange}
                  type="text"
                  name="location"
                  placeholder="Location (e.g. Online, Bangalore)"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                  />
                  Is Free?
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  Is Published?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>


              {/* DATE & TIME */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg border-b pb-1 mb-2">Date & Time</h3>
              </div>

              <div>
                <label className="block text-sm font-medium">Start Date *</label>
                <input
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date"
                  name="startDate"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  value={formData.endDate}
                  onChange={handleChange}
                  type="date"
                  name="endDate"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  value={formData.startTime}
                  onChange={handleChange}
                  type="time"
                  name="startTime"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">End Time</label>
                <input
                  value={formData.endTime}
                  onChange={handleChange}
                  type="time"
                  name="endTime"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Timezone</label>
                <input
                  value={formData.timezone}
                  onChange={handleChange}
                  type="text"
                  name="timezone"
                  className="w-full p-2 border rounded"
                />
              </div>


              {/* CONTENT */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg border-b pb-1 mb-2">Content & Registration</h3>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium">Short Description (Max 200 chars)</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={handleChange}
                  name="shortDescription"
                  maxLength="200"
                  rows="2"
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium">Full Description</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={handleChange}
                  name="fullDescription"
                  rows="4"
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium">Benefits (One per line)</label>
                <textarea
                  value={formData.benefits}
                  onChange={handleChange}
                  name="benefits"
                  rows="3"
                  className="w-full p-2 border rounded"
                  placeholder="Certificate&#10;Ranking&#10;Exposure"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">Eligibility</label>
                <input
                  value={formData.eligibility}
                  onChange={handleChange}
                  type="text"
                  name="eligibility"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Max Participants</label>
                <input
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  type="number"
                  name="maxParticipants"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Prize Money / Rewards</label>
                <input
                  value={formData.prizeMoney}
                  onChange={handleChange}
                  type="text"
                  name="prizeMoney"
                  placeholder="e.g. ₹50,000 or Win Goodies"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium">Registration Link *</label>
                <input
                  value={formData.registrationLink}
                  onChange={handleChange}
                  type="text"
                  name="registrationLink"
                  placeholder="https://..."
                  required
                  className="w-full p-2 border rounded"
                />
              </div>


              {/* SEO */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg border-b pb-1 mb-2">SEO</h3>
              </div>

              <div>
                <label className="block text-sm font-medium">Meta Title</label>
                <input
                  value={formData.metaTitle}
                  onChange={handleChange}
                  type="text"
                  name="metaTitle"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Meta Description</label>
                <input
                  value={formData.metaDescription}
                  onChange={handleChange}
                  type="text"
                  name="metaDescription"
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* FAQs */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg border-b pb-1 mb-2">FAQs</h3>
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const newFaqs = [...formData.faqs];
                          newFaqs[index].question = e.target.value;
                          setFormData({ ...formData, faqs: newFaqs });
                        }}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => {
                          const newFaqs = [...formData.faqs];
                          newFaqs[index].answer = e.target.value;
                          setFormData({ ...formData, faqs: newFaqs });
                        }}
                        className="w-full p-2 border rounded"
                        rows="2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = formData.faqs.filter((_, i) => i !== index);
                        setFormData({ ...formData, faqs: newFaqs });
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 h-fit mt-1"
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: "", answer: "" }] })}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  + Add FAQ
                </button>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editId ? "Update Event" : "Create Event"}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      {isQuestionFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editId ? "Edit Question" : "Add Question"}</h2>
              <span onClick={resetForm} className="cursor-pointer text-xl font-bold">✖</span>
            </div>
            <form onSubmit={handleSubmitQuestion} className="flex flex-col gap-3">
              <input
                value={form.question}
                onChange={handleChangeQuestions}
                type="text"
                name="question"
                placeholder="Enter Question"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.option1}
                onChange={handleChangeQuestions}
                type="text"
                name="option1"
                placeholder="Option 1"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.option2}
                onChange={handleChangeQuestions}
                type="text"
                name="option2"
                placeholder="Option 2"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.option3}
                onChange={handleChangeQuestions}
                type="text"
                name="option3"
                placeholder="Option 3"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.option4}
                onChange={handleChangeQuestions}
                type="text"
                name="option4"
                placeholder="Option 4"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.answer}
                onChange={handleChangeQuestions}
                type="text"
                name="answer"
                placeholder="Correct Answer"
                required
                className="p-2 border rounded"
              />
              <input
                value={form.coin}
                onChange={handleChangeQuestions}
                type="number"
                name="coin"
                placeholder="Coins"
                required
                className="p-2 border rounded"
              />

              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2">
                {editId ? "Update Question" : "Create Question"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkUploadVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bulk Upload Questions (JSON)</h2>
              <span onClick={resetForm} className="cursor-pointer text-xl font-bold">✖</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Paste a JSON array of questions. Correct format:
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-24">
                {`[
  {
    "question": "Q1 text",
    "option1": "Op1",
    "option2": "Op2",
    "option3": "Op3",
    "option4": "Op4",
    "answer": "Op3",
    "coin": 5
  }
]`}
              </pre>
            </p>
            <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3 flex-1 overflow-hidden">
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder="Paste JSON here..."
                className="p-2 border rounded font-mono text-sm w-full h-64 resize-none"
                required
              ></textarea>
              <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 mt-2">
                Upload Questions
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Applied Details Modal */}
      {showAppliedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl m-4 max-h-[80vh] flex flex-col relative">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h2 className="text-2xl font-bold">Applied Users</h2>
              <span onClick={() => setShowAppliedDetails(null)} className="cursor-pointer text-xl font-bold hover:text-red-800">✖</span>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">Sl</th>
                      <th className="p-3 border">Name</th>
                      <th className="p-3 border">Email</th>
                      <th className="p-3 border">Phone</th>
                      <th className="p-3 border">College Email</th>
                      <th className="p-3 border">College Name</th>
                      <th className="p-3 border">Coins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showAppliedDetails?.userDetails?.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">{user.name}</td>
                        <td className="p-3 border">{user.email}</td>
                        <td className="p-3 border">{user.phone}</td>
                        <td className="p-3 border">{user.collegeEmailId}</td>
                        <td className="p-3 border">{user.collegeName}</td>
                        {showAppliedDetails?.enrollments?.map((item) => (
                          item.userId === user._id && <td key={item.userId} className="p-3 border">{item.coin || 0}</td>
                        ))}
                      </tr>
                    ))}
                    {(!showAppliedDetails?.userDetails || showAppliedDetails.userDetails.length === 0) && (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">No users applied yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events List</h1>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            onClick={() => {
              resetForm();
              setisFormVisible(true);
            }}
          >
            + Add Events
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2 border">Sl No.</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Questions</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Applied</th>
                <th className="p-2 border">Visibility</th>
                <th className="p-2 border">Change Status</th>
                <th className="p-2 border">Send Reminder</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {allEvents?.map((events, index) => {
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border cursor-pointer font-medium text-blue-600 hover:underline truncate max-w-[150px]" title={events.title} onClick={() => setSetectedEvent(events)}>{events.title}</td>
                    <td className="p-2 border text-center">{events.questions?.length || 0}</td>
                    <td className="p-2 border">
                      {events.startDate ? new Date(events.startDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2 border capitalize">{events.status}</td>
                    <td className="p-2 border text-center cursor-pointer text-red-600 font-bold hover:underline" onClick={() => handleShowAppliedDetails(events._id)}>
                      {events.enrollments?.length || 0}
                    </td>
                    <td className="p-2 border text-center">
                      {events.isPublished ? <span className="text-green-600 font-bold">Published</span> : <span className="text-gray-500">Draft</span>}
                    </td>
                    <td className="p-2 border">
                      <select
                        className="p-1 border rounded text-sm w-full"
                        value={events.status}
                        onChange={(e) => handleStatusChange(e, events._id)}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        className={`px-3 py-1 rounded text-sm transition ${
                          sendingReminder === events._id
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                        onClick={() => handleSendReminder(events._id, events.title)}
                        disabled={sendingReminder === events._id || (events.enrollments?.length || 0) === 0}
                        title={(events.enrollments?.length || 0) === 0 ? "No students enrolled" : "Send reminder email"}
                      >
                        {sendingReminder === events._id ? (
                          <>
                            <i className="fa fa-spinner fa-spin"></i> Sending...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-envelope"></i> Send
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2 justify-center">
                        <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(events)}>
                          <i className="fa fa-edit"></i> Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(events._id)}>
                          <i className="fa fa-trash-o"></i> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {allEvents.length === 0 && (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEvent && selectedEvent.title && (
        <div className="mt-8 bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">Questions for: <span className="text-blue-600">{selectedEvent.title}</span></h2>
            <button
              onClick={() => {
                setEditId(null);
                setForm({
                  question: "", option1: "", option2: "", option3: "", option4: "", answer: "", coin: ""
                });
                setisQuestionFormVisible(true)
              }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              + Add Question
            </button>
            <button
              onClick={() => setIsBulkUploadVisible(true)}
              className="ml-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              + Bulk Upload JSON
            </button>
          </div>

          <div className="space-y-4">
            {selectedEvent?.questions?.length ? (
              selectedEvent.questions.map((question, index) => (
                <div key={index} className="p-4 border rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-lg mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <div className="flex gap-2">
                      <button className="text-blue-500" onClick={() => handleEditQuestion(question)}>
                        <i className="fa fa-edit"></i>
                      </button>
                      <button className="text-red-500" onClick={() => handleDeleteQuestion(selectedEvent._id, question._id)}>
                        <i className="fa fa-trash-o"></i>
                      </button>
                    </div>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 pl-4 list-disc">
                    <li>{question.option1}</li>
                    <li>{question.option2}</li>
                    <li>{question.option3}</li>
                    <li>{question.option4}</li>
                  </ul>
                  <p className="text-sm font-semibold text-green-700 bg-green-100 inline-block px-2 py-1 rounded">
                    Answer: {question.answer} <span className="ml-2 text-gray-600">({question.coin} coins)</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No questions available for this event.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AddEvent;
