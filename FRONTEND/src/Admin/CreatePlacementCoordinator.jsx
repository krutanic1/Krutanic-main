import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const CreatePlacementCoordinator = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [coordinators, setCoordinators] = useState([]);
  const [editingCoordinatorId, setEditingCoordinatorId] = useState(null);

  // Toggle visibility of the form
  const toggleVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCoordinator = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    try {
      if (editingCoordinatorId) {
        const response = await axios.put(
          `${API}/updatecoordinator/${editingCoordinatorId}`,
          newCoordinator
        );
        toast.success("Placement coordinator updated successfully");
      } else {
        const response = await axios.post(
          `${API}/createcoordinator`,
          newCoordinator
        );
        toast.success("Placement coordinator created successfully");
      }
      fetchCoordinators();
      resetForm();
    } catch (error) {
      toast.error(
        "There was an error while creating or updating the coordinator"
      );
      console.error("Error creating or updating coordinator", error);
    }
  };

  // Fetch all placement coordinators
  const fetchCoordinators = async () => {
    try {
      const response = await axios.get(`${API}/getcoordinators`);
      setCoordinators(response.data);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  // Reset form after submission
  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
    });
    setEditingCoordinatorId(null);
    setIsFormVisible(false);
  };

  // Handle input changes in the form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle deletion of a coordinator account
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this placement coordinator account?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deletecoordinator/${id}`);
        toast.success("Placement coordinator deleted successfully");
        fetchCoordinators();
      } catch (error) {
        toast.error("There was an error deleting the coordinator");
        console.error("Error deleting coordinator", error);
      }
    }
  };

  // Handle editing a coordinator's details
  const handleEdit = (coordinator) => {
    setFormData({
      fullname: coordinator.fullname,
      email: coordinator.email,
      password: coordinator.password,
    });
    setEditingCoordinatorId(coordinator._id);
    setIsFormVisible(true);
  };

  // Handle sending email to the coordinator
  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
  
    try {
      // Sending email to placement coordinator
      const response = await axios.post(`${API}/sendmailtoplacementcoordinator`, emailData);
  
      if (response.status === 200) {
        toast.success('Email sent successfully!');
  
        // Updating mailSended flag after sending the email
        const coordinatorData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(`${API}/mailsendedplacementcoordinator/${value._id}`, coordinatorData);
  
        if (updateResponse.status === 200) {
          toast.success('Placement Coordinator record updated successfully!');
        } else {
          toast.error('Failed to update Placement Coordinator record.');
        }
      } else {
        toast.error('Failed to send email.');
      }
    } catch (error) {
      toast.error('An error occurred while sending the email.');
      console.error('Error sending email:', error);
    }
    fetchCoordinators(); // Refresh the coordinators list after sending the email
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {isFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>
              {editingCoordinatorId
                ? "Edit Placement Coordinator"
                : "Create Placement Coordinator"}
            </h2>
            <span onClick={resetForm}>✖</span>
            <input
              value={formData.fullname}
              onChange={handleChange}
              type="text"
              name="fullname"
              placeholder="Enter full Name"
              required
            />
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter email id"
              required
            />
            <input
              type="password"
              placeholder="Create password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editingCoordinatorId ? "Update Account" : "Create Account"}
            />
          </form>
        </div>
      )}

      <div className="coursetable">
        <h1>Placement Coordinator Accounts List:</h1>
        <span onClick={toggleVisibility}>+ Add New Coordinator</span>
        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Full Name</th>
              <th>Email</th>
              {/* <th>Password</th> */}
              <th>Action</th>
              <th>Send Login Credentials</th>
            </tr>
          </thead>
          <tbody>
            {coordinators?.map((coordinator, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{coordinator.fullname}</td>
                <td>{coordinator.email}</td>
                {/* <td>{coordinator.password}</td> */}
                <td>
                  <button onClick={() => handleEdit(coordinator)}><i className="fa fa-edit"></i></button>
                  <button onClick={() => handleDelete(coordinator._id)}><i className="fa fa-trash-o text-red-600"></i></button>
                </td>
                <td>
                  <button
                    onClick={() => handleSendEmail(coordinator)}
                    disabled={coordinator.mailSended}
                  >
                    {coordinator.mailSended ? (
                      <i className="fa fa-send-o text-green-600"></i>
                    ) : (
                      <i className="fa fa-send-o text-red-600"></i>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreatePlacementCoordinator;
