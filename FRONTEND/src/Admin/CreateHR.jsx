import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const CreateHR = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [hrList, setHrList] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    designation: "HR Manager",
  });

  const [editingHrId, setEditingHrId] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newHR = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      designation: formData.designation.trim(),
    };
    try {
      if (editingHrId) {
        const response = await axios.put(`${API}/updatehr/${editingHrId}`, newHR);
        toast.success("HR updated successfully!");
        setHrList((prev) => prev.map((item) => (item._id === editingHrId ? response.data : item)));
      } else {
        const response = await axios.post(`${API}/createhr`, newHR);
        toast.success("HR created successfully!");
        setHrList((prev) => [response.data, ...prev]);
      }
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "There was an error while creating or updating the HR";
      toast.error(errorMessage);
    }
  };

  const fetchHR = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/gethr`);
      setHrList(response.data.filter((item) => item && item.status === "Active"));
    } catch (error) {
      console.error("There was an error fetching HR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHR();
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      designation: "HR Manager",
    });
    setEditingHrId(null);
    setIsFormVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "fullname" || name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleDelete = async (_id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this HR account?");
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deletehr/${_id}`);
        setHrList((prev) => prev.filter((item) => item._id !== _id));
        toast.success("HR deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete HR.");
      }
    }
  };

  const handleEdit = (hr) => {
    setFormData({
      fullname: hr.fullname,
      email: hr.email,
      password: hr.password || "",
      designation: hr.designation || "HR Manager",
    });
    setEditingHrId(hr._id);
    setIsFormVisible(true);
  };

  const handleSendEmail = async (hr) => {
    try {
      const response = await axios.post(`${API}/sendmailtohr`, {
        fullname: hr.fullname,
        email: hr.email,
      });
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        await axios.put(`${API}/mailsendedhr/${hr._id}`, { mailSended: true });
        fetchHR();
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
  };

  const handleChangeStatus = async (hrId, status) => {
    const isConfirmed = window.confirm(`Are you sure you want to make this account ${status}?`);
    if (isConfirmed) {
      try {
        await axios.put(`${API}/updatehrstatus/${hrId}`, { status });
        toast.success(`Account status updated to ${status}!`);
        if (status === "Inactive") {
          setHrList((prev) => prev.filter((item) => item._id !== hrId));
        } else {
          fetchHR();
        }
      } catch (error) {
        toast.error("An error occurred while updating status.");
      }
    }
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {isFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <span onClick={resetForm}>✖</span>
            <h2>{editingHrId ? "Edit HR Account" : "Create HR Account"}</h2>
            <input
              value={formData.fullname}
              onChange={handleChange}
              type="text"
              name="fullname"
              placeholder="Full Name"
              required
            />
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Email ID"
              required
            />
            <input
              value={formData.designation}
              onChange={handleChange}
              type="text"
              name="designation"
              placeholder="Designation (e.g. HR Manager)"
              required
            />
            <input
              type="text"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Create password"
              required={!editingHrId}
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editingHrId ? "Update Account" : "Create Account"}
            />
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h2>HR List</h2>
          <span onClick={toggleVisibility}>+ Add New HR</span>
        </div>
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
                <th>Send Credentials</th>
              </tr>
            </thead>
            <tbody>
              {hrList.map((hr, index) => (
                <tr key={hr._id}>
                  <td>{index + 1}</td>
                  <td>{hr.fullname}</td>
                  <td>{hr.email}</td>
                  <td>{hr.designation}</td>
                  <td>{hr.status}</td>
                  <td>
                    <button title="Edit" onClick={() => handleEdit(hr)}>
                      <i className="fa fa-edit"></i>
                    </button>
                    <button title="Delete" onClick={() => handleDelete(hr._id)}>
                      <i className="fa fa-trash-o text-red-600"></i>
                    </button>
                    <button title="Deactivate" onClick={() => handleChangeStatus(hr._id, "Inactive")}>
                      <i className="fa fa-eye-slash"></i>
                    </button>
                  </td>
                  <td>
                    <div className="cursor-pointer" onClick={() => handleSendEmail(hr)}>
                      {hr.mailSended ? (
                        <i className="fa fa-send-o text-green-600"></i>
                      ) : (
                        <i className="fa fa-send-o text-red-600"></i>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreateHR;
