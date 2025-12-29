import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AddEvent = () => {
  const [isFormVisible, setisFormVisible] = useState(false);
  const [isQuestionFormVisible, setisQuestionFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSetectedEvent] = useState([]);
  const [showAppliedDetails , setShowAppliedDetails] = useState(null)


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
    start: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      start: "",
    });
    setForm({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    })
    setEditId(null);
    setisFormVisible(false);
    setisQuestionFormVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    // console.log("Form Data:", formData);
    e.preventDefault();
    try {
      if (editId) {
        const response = await axios.put(
          `${API}/allevents/${editId}`,
          formData
        );
        toast.success("MasterClass updated successfully");
      } else {
        const response = await axios.post(`${API}/addevent`, formData);
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
      // console.log("All Events:", response.data);
      setAllEvents(response.data);
      setSetectedEvent(response.data[0]);
    } catch (error) {
      console.error("There was an error fetching MasterClass:", error);
    }
  };



  const handleEdit = (events) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the event?"
    );
    if (isConfirmed) {
      setFormData({
        title: events.title,
        start: new Date(events.start).toISOString().slice(0, 16),
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
      const response = await axios.delete(`${API}/allevents/${id}`);
      toast.success("Event deleted successfully!");
      fetchEvent();
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
      coin:form.coin,
    };
    try {
      let response;
      if (editId) {
        response = await axios.put(
          `${API}/addquestions/${selectedEvent._id}/questions/${editId}`,
          newQuestion
        );
        toast.success("Question updated successfully");
      } else {
        response = await axios.put(
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
      const response = await axios.delete(`${API}/allevents/${eventId}/questions/${questionId}`);
      toast.success("Question deleted successfully!");
      fetchEvent();
    } catch (error) {
      toast.error("Error deleting question");
      console.error("Delete Error:", error.response?.data || error.message);
    }
  };
  const handleEditQuestion = (question) => {
    const isConfirmed = window.confirm("Are you sure you want to edit the event?");
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
    // console.log("Event:", event);
    setShowAppliedDetails(event);
  };

  const handleStatusChange = async (e, id) => {
    const status = e.target.value;
    try {
      const response = await axios.put(`${API}/updatestatus/${id}`, { status: status });
      console.log(response.data.message);
      fetchEvent();
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || error.message);
    }
  };
  
  return (
    <div id="Event" className="ml-[270px]">
      <Toaster position="top-center" reverseOrder={false} />
      {isFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>{editId ? "Edit Event" : "Add Event"}</h2>
            <span onClick={resetForm}>✖</span>
            <input
              value={formData.title}
              onChange={handleChange}
              type="text"
              name="title"
              id="title"
              placeholder="Enter Event title"
              required
            />
            <label htmlFor="start" className="text-gray-500">
              Select Start Date and Time
            </label>
            <input
              value={formData.start}
              onChange={handleChange}
              type="datetime-local"
              name="start"
              id="start"
              required
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editId ? "Update Event" : "Create Event"}
            />
          </form>
        </div>
      )}

      {isQuestionFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmitQuestion}>
            <h2>{editId ? "Edit Questions" : "Add Questions"}</h2>
            <span onClick={resetForm}>✖</span>
            <input
              value={form.question}
              onChange={handleChangeQuestions}
              type="text"
              name="question"
              id="question"
              placeholder="Enter Question"
              required
            />
            <input
              value={form.option1}
              onChange={handleChangeQuestions}
              type="text"
              name="option1"
              id="option1"
              placeholder="Enter Options 1"
              required
            />
            <input
              value={form.option2}
              onChange={handleChangeQuestions}
              type="text"
              name="option2"
              id="option2"
              placeholder="Enter Options 2"
              required
            />
            <input
              value={form.option3}
              onChange={handleChangeQuestions}
              type="text"
              name="option3"
              id="option3"
              placeholder="Enter Options 3"
              required
            />
            <input
              value={form.option4}
              onChange={handleChangeQuestions}
              type="text"
              name="option4"
              id="option4"
              placeholder="Enter Options 4"
              required
            />
            <input
              value={form.answer}
              onChange={handleChangeQuestions}
              type="text"
              name="answer"
              id="answer"
              placeholder="Enter Answer"
              required
            />
            <input
              value={form.coin}
              onChange={handleChangeQuestions}
              type="number"
              name="coin"
              id="coin"
              placeholder="Enter Coin For Correct Answer"
              required
            />

            <input
              className="cursor-pointer"
              type="submit"
              value={editId ? "Update Questions" : "Create Questions"}
            />
          </form>
        </div>
      )}

{showAppliedDetails && (
      <div className="jobdetails">
        <div className="jobdetailsdiv">
          <div className="title">
            <h2>Applied Users</h2>
            <span onClick={() => setShowAppliedDetails(null)}>✖</span>
          </div>

          <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Student College Mail Id</th>
                  <th>College Name</th>
                  <th>Total Coins</th>
                </tr>
              </thead>
              <tbody>
                {showAppliedDetails?.userDetails?.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.collegeEmailId}</td>
                    <td>{user.collegeName}</td>   
                   {showAppliedDetails?.enrollments?.map((item)=>(
                     <td> { item.user_id === user.id ? item.coin : 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    )}


      <div className="coursetable">
        <div>
          <h1>Events List</h1>
          <button
            className="p-2 border border-black rounded-md"
            onClick={() => setisFormVisible(true)}
          >
            {" "}
            + Add Events
          </button>
        </div>
        <div className="qanda">
        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Title</th>
              <th>Total Questions</th>
              <th>Start Time</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Change Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {allEvents?.map((events, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td className=" cursor-pointer" onClick={() => setSetectedEvent(events)}>{events.title}</td>
          <td>{events.questions.length}</td>
          <td>
            {new Date(events.start).toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </td>
          <td>{events.status}</td>
          <td className="cursor-pointer text-red-600 font-bold" onClick={() => handleShowAppliedDetails(events._id)}> {events.enrollments.length}</td>
          <td>
            <select className="border border-gray-800 rounded-full" onChange={(e) => handleStatusChange(e, events._id)} name="status" id="status">
              <option value="Select Status"> Select Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming Events">Upcoming Events</option>
            </select>
          </td>
          <td>
            <button>
              <i
                className="fa fa-edit"
                onClick={() => handleEdit(events)}
              ></i>
            </button>
            <button onClick={() => handleDelete(events._id)}>
              <i className="fa fa-trash-o text-red-700"></i>
            </button>
          </td>
        </tr>
      );
    })}
          </tbody>
        </table>
        </div>
      </div>

      {selectedEvent && (
        <div>
          <div className="coursetable">
          <div className="eventdetail">
            <h2>{selectedEvent.title}</h2>
            <button
              onClick={() => setisQuestionFormVisible(true)}
              className="p-1 flex whitespace-nowrap items-center gap-2 border border-black rounded-md"
            >
              + Add Question
            </button>
          </div>
          <div className="qanda">
            {selectedEvent?.questions?.length ? (
              selectedEvent.questions.map((question, index) => (
                <div key={index}>
                  <p className="flex items-center gap-2">
                    {index + 1}. {question.question}
                    <div className="flex items-center gap-2">
                    <button>
                    <i
                      className="fa fa-edit"
                      onClick={() => handleEditQuestion(question)}
                    ></i>
                  </button>
                  <button onClick={() => handleDeleteQuestion(selectedEvent._id, question._id)}>
                    <i className="fa fa-trash-o text-red-600"></i>
                  </button>
                    </div>
                  </p>
                  <ul>
                    <li>Option1: {question.option1}</li>
                    <li>Option2: {question.option2}</li>
                    <li>Option3: {question.option3}</li>
                    <li>Option4: {question.option4}</li>
                  </ul>
                  <p>
                    <strong>Answer:</strong> {question.answer} ({question.coin} coins)
                  </p>
                </div>
              ))
            ) : (
              <p>No questions available</p>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddEvent;
