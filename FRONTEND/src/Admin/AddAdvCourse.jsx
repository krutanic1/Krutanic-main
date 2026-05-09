import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import "react-quill/dist/quill.snow.css";

const AddAdvCourse = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const toggleVisibility = () => {
    setiscourseFormVisible((prevState) => !prevState);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingCourseId(null);
    setShow(true);
    setiscourseFormVisible(false);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    const newCourse = {
      title: title.trim(),
      description: description.trim(),
      show: show
    };
    try {
      if (editingCourseId) {
        const response = await axios.put(
          `${API}/editadvcourse/${editingCourseId}`,
          newCourse
        );
        alert("Advance course updated successfully!");
      } else {
        const response = await axios.post(`${API}/createadvcourse`, newCourse);
        alert("Advance course created successfully!");
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("There was an error submitting the advance course:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Add timestamp to prevent browser caching
      const response = await axios.get(`${API}/getadvcourses?t=${Date.now()}`);
      console.log("Advance courses response:", response.data);
      setCourses(response.data || []);
    } catch (error) {
      console.error("There was an error fetching advance courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (_id, selectedCourse) => {
    if (selectedCourse.session && Object.keys(selectedCourse.session).length > 0) {
      alert("You can't delete this course because it has sessions");
      return;
    } else {
      const isConfirmed = window.confirm("Are you sure you want to delete this advance course?");
      if (isConfirmed) {
        axios
          .delete(`${API}/deleteadvcourse/${_id}`)
          .then((response) => {
            setCourses((prevCourses) =>
              prevCourses.filter((course) => course._id !== _id)
            );
          })
          .catch((error) => {
            console.error("There was an error deleting the advance course:", error);
          });
      }
    }
  };

  const handleEdit = (courseId) => {
    const isConfirmed = window.confirm("Are you sure you want to edit this?");
    if (isConfirmed) {
      const courseToEdit = courses.find((course) => course._id === courseId);
      setTitle(courseToEdit.title);
      setDescription(courseToEdit.description);
      setShow(courseToEdit.show !== undefined ? courseToEdit.show : true);
      setEditingCourseId(courseId);
      setiscourseFormVisible(true);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div id="AdminAddCourse">
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSumbit}>
            <h2>{editingCourseId ? "Edit Advance Course" : "Add New Advance Course"}</h2>
            <span onClick={resetForm}>✖</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter advance course title"
              required
            />
            <textarea
              placeholder="Enter advance course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="checkbox" 
                id="showCourse" 
                checked={show} 
                onChange={(e) => setShow(e.target.checked)} 
              />
              <label htmlFor="showCourse">Show in Dashboard Access Form</label>
            </div>
            <input className="cursor-pointer" type="submit" value={editingCourseId ? "Update Advance Course" : "Add Advance Course"} />
          </form>
        </div>
      )}
      {loading ? (
        <div id="loader">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="coursetable">
          <div>
            <h2>Added Advance Courses</h2>
            <button className="p-2 border border-black rounded-md" onClick={toggleVisibility}>
              + Add New Advance Course
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Course Title</th>
                <th>Show/Hide</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{course.title}</td>
                    <td>{course.show ? "Visible" : "Hidden"}</td>
                    <td>
                      <button>
                        <i className="fa fa-edit" onClick={() => handleEdit(course._id)}></i>
                      </button>
                      <button onClick={() => handleDelete(course._id, course)}>
                        <i className="fa fa-trash-o text-red-600"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No advance courses found. Click "+ Add New Advance Course" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddAdvCourse;
