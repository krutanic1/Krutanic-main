import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";
import logo from "../assets/logo.jpg";
// import DOMPurify from "dompurify";

const AddModule = () => {
  const [isLeftSidebar, setisLeftSidebar] = useState(true);
  const [isModuleFormVisible, setisModuleFormVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [editingModule, setEditingModule] = useState(null);

  const leftVisibility = () => {
    setisLeftSidebar((prevState) => !prevState);
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API}/getcourses`);
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0]);
      }
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };
  const handleModuleSubmit = async (event) => {
    event.preventDefault();

    if (selectedCourse) {
      const newModul = {
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
      };
      const updatedCourse = { ...selectedCourse };
      if (editingModule) {
        updatedCourse.session[editingModule] = newModul;
      } else {
        updatedCourse.session = {
          ...updatedCourse.session,
          [`session${Object.keys(updatedCourse.session).length + 1}`]: newModul,
        };
      }
      try {
        await axios.put(
          `${API}/updatecourse/${selectedCourse._id}`,
          updatedCourse
        );
        alert(editingModule ? "Session Updated" : "Session Added");
        setSelectedCourse(updatedCourse);
        setModuleTitle("");
        setModuleDescription("");
        setEditingModule(null);
        setisModuleFormVisible(false);
      } catch (error) {
        console.error("There was an error updating the course:", error);
      }
    }
  };
  const handleEditModule = (key) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit this session"
    );
    if (isConfirmed) {
      const session = selectedCourse.session[key];
      setModuleTitle(session.title);
      setModuleDescription(session.description);
      setEditingModule(key);
      setisModuleFormVisible(true);
    }
  };
  const handleDeleteModule = async (key) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this session"
    );
    if (isConfirmed) {
      if (selectedCourse) {
        const updatedCourse = { ...selectedCourse };
        delete updatedCourse.session[key];

        try {
          await axios.put(
            `${API}/updatecourse/${selectedCourse._id}`,
            updatedCourse
          );
          setSelectedCourse(updatedCourse);
          alert("Session Deleted");
        } catch (error) {
          console.error("There was an error deleting the module:", error);
        }
      }
    }
  };
  const resetForm = () => {
    setModuleTitle("");
    setModuleDescription("");
    setEditingModule(null);
    setisModuleFormVisible(false);
  };

  if(!selectedCourse){
    return <div id="loader">
    <div className="three-body">
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  </div>
  </div>;
 }
  return (
    <div id="addmodule" >
      {isLeftSidebar && (
        <div className="left">
          <h2>Course List</h2>
          <ul>
            {courses.map((course, index) => (
              <li key={index} onClick={() => handleCourseClick(course)}>
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="right">
        {selectedCourse && (
          <div>
            <div className="moduletop">
              <span onClick={leftVisibility}>☰</span>
              <h2>{selectedCourse.title}</h2>
              <span onClick={() => setisModuleFormVisible(true)}>
                + Add Session
              </span>
            </div>
            {isModuleFormVisible && (
              <div className="moduleform">
                <form onSubmit={handleModuleSubmit}>
                    <h2>
                      {editingModule ? "Update Session" : "Add New Session"}{" "}
                    </h2>
                  <strong>
                    <span onClick={resetForm}>✖</span>
                  </strong>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter the Session Title"
                    value={moduleTitle}
                    required
                    onChange={(e) => setModuleTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Enter the Session video link"
                    value={moduleDescription}
                    required
                    onChange={(e) => setModuleDescription(e.target.value)}
                  />
                  <input
                    className="button"
                    type="submit"
                    value={editingModule ? "Update Session" : "Add New Session"}
                  />
                </form>
              </div>
            )}

            <div className="modulediv">
              <table>
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Title</th>
                    <th>Link</th>
                    <th>Video</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(selectedCourse.session).map((key) => (
                    <tr key={key}>
                      <td className=" capitalize">{key}</td>
                      <td>{selectedCourse.session[key].title}</td>
                      <td>{selectedCourse.session[key].description}</td>
                      <td>
                        <div className="video">
                          <img src={logo} alt="" />
                          <iframe
                            src={`https://drive.google.com/file/d/${selectedCourse.session[key].description}/preview`}
                            allow="autoplay"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </td>
                      <td>
                        {" "}
                        <button onClick={() => handleEditModule(key)}>
                         <i className="fa fa-edit"></i>
                        </button>
                        <button onClick={() => handleDeleteModule(key)}>
                          <i className="fa fa-trash-o text-red-600"></i>
                        </button>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="description">
                <h3>Description of {selectedCourse.title} !!!</h3>
                <pre>
                  {selectedCourse.description}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddModule;
