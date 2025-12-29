import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import "react-quill/dist/quill.snow.css";

const AddCourse = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
   const [loading, setLoading] = useState(true);

  const toggleVisibility = () => {
    console.log("open hua");
    setiscourseFormVisible((prevState) => !prevState);
    // setiscourseFormVisible(!iscourseFormVisible);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingCourseId(null);
    setiscourseFormVisible(false);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    const newCourse = {
      title: title.trim(),
      description: description.trim(),
    };
    try {
      if (editingCourseId) {
        const response = await axios.put(
          `${API}/editcourse/${editingCourseId}`,
          newCourse
        );
        alert("Course updated successfully!");
      } else {
        const response = await axios.post(` ${API}/createcourse`, newCourse);
        alert("Course created successfully!");
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("There was an error submitting the course:", error);
    }
  };
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getcourses`);
      setCourses(response.data);
    } catch (error) {
      console.error("There was an error fetching courses:", error);
    } finally{
      setLoading(false);
    }
  };
  const handleDelete = (_id,selectedCourse) => {
     if (Object.keys(selectedCourse.session).length > 0) {
      alert("You can't delete this course because it has sessions");
      return;
    }
    else{
      const isConfirmed =  window.confirm("Are you sure you want to delete this course?");
      if(isConfirmed){
        axios
      .delete(`${API}/deletecourse/${_id}`)
      .then((response) => {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== _id)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the course:", error);
      });
      }
    }
  };
  const handleEdit = (courseId) => {
    const isConfirmed = window.confirm("Are you sure you want to edit this?");
     if(isConfirmed){
      const courseToEdit = courses.find((course) => course._id === courseId);
      setTitle(courseToEdit.title);
      setDescription(courseToEdit.description);
      setEditingCourseId(courseId);
      setiscourseFormVisible(true);
     }
  };
  useEffect(() => {
    fetchCourses();
  }, []);


  return (
    <div id="AdminAddCourse" >
       {iscourseFormVisible && (
       <div className="form">
          <form onSubmit={handleSumbit}>
            <h2>{editingCourseId ? "Edit Course" : "Add New Course"}</h2>
            <span onClick={resetForm}>✖</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              required
            />
            <textarea 
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input className="cursor-pointer" type="submit" value="Add Course" />
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
        <h2>Added Courses</h2>
          <button className="p-2 border border-black rounded-md" onClick={toggleVisibility}> + Add New Course</button>
        </div>
       
        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Course Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.title}</td>
                <td>
                  <button ><i className="fa fa-edit" onClick={() => handleEdit(course._id)}></i></button>
                  <button onClick={() => handleDelete(course._id,course)}><i className="fa fa-trash-o text-red-600"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
export default AddCourse;
