import React, { useEffect, useState } from "react";
import API from "../API";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const MarketingAddExecutive = () => {
  const marketingToken = localStorage.getItem("marketingToken");
  const [isFormVisible, setisFormVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editingExecutiveId, setEditingExecutiveId] = useState(null);
  const [executive, setExecutive] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    designation: "",
  });

  const toggleVisibility = () => {
    setisFormVisible((prevState) => !prevState);
  };

  const fetchUserData = async () => {
    if (!marketingToken) {
      alert("login first");
      console.log("Marketing User not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getmarketinguser`, {
        params: { marketingToken },
      });
      setUserData(response.data);
      console.log("my data", response.data);
    } catch (err) {
      console.log("Failed to fetch user data");
    }
  };

  const fetchExecutive = async () => {
    try {
      const response = await axios.get(`${API}/getmarketing`);
      const filteredExecutives = response.data.filter(
        (item) => item.team === userData.team
      );
      setExecutive(filteredExecutives);
    } catch (error) {
      console.error("There was an error fetching Executive:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.team) {
      fetchExecutive();
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const newExecutive = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      designation: formData.designation.trim(),
      team: userData.team,
    };

    try {
      if (editingExecutiveId) {
        const response = await axios.put(
          `${API}/updatemarketing/${editingExecutiveId}`,
          newExecutive
        );
        toast.success("Data updated successfully");
      } else {
        const response = await axios.post(
          `${API}/createmarketing`,
          newExecutive
        );
        toast.success("Executive created successfully");
      }
      fetchExecutive();
      resetForm();
    } catch (error) {
      toast.error("There was an error while creating or updating");
      console.error("Error creating or updating", error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      designation: "",
    });
    setEditingExecutiveId(null);
    setisFormVisible(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the operation account?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deletemarketing/${id}`);
        alert("data deleted successfully");
        fetchExecutive();
      } catch (error) {
        alert("There was an error deleting the operation");
        console.error("Error deleting operation", error);
      }
    }
  };
  const handleEdit = (executive) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the executive details?"
    );
    if (isConfirmed) {
      setFormData({
        fullname: executive.fullname.trim(),
        email: executive.email.trim(),
        designation: executive.designation.trim(),
      });
      setEditingExecutiveId(executive._id);
      setisFormVisible(true);
    }
  };
  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
    try {
      const response = await axios.post(
        `${API}/sendmailtomarketing`,
        emailData
      );
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const operationData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedmarketing/${value._id}`,
          operationData
        );
        if (updateResponse.status === 200) {
          toast.success("Operation record updated successfully!");
        } else {
          toast.error("Failed to update student record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
    fetchExecutive();
  };
  return (
    <div id="AddExecutive">
      <Toaster position="top-center" reverseOrder={false} />
      {isFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>{editingExecutiveId ? "Edit Account" : "Create Account"}</h2>
            <span onClick={resetForm}>✖</span>
            <input
              value={formData.fullname}
              onChange={handleChange}
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter full Name"
              required
            />
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder="Enter email id"
              required
            />
            <select
              name="designation"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            >
              <option disabled value="">
                Select Designation
              </option>
              {/* <option value="MANAGER">MANAGER</option> */}
              <option value="LEADER">LEADER</option>
              <option value="EXECUTIVE">EXECUTIVE</option>
            </select>

            {/* <input
              type="text"
              placeholder="Create password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            /> */}
            <input
              className="cursor-pointer"
              type="submit"
              value={editingExecutiveId ? "Update Account" : "Create Account"}
            />
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h2>Marketing Executive List:</h2>
          <span onClick={toggleVisibility}>+ Add New</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Team</th>
              <th>Password</th>
              {/* <th>Login</th> */}
              <th>Action</th>
              <th>Send Login Credentials</th>
            </tr>
          </thead>
          <tbody>
            {executive?.map((operation, index) => (
              <tr key={index} className={`${operation.designation}`}>
                <td>{index + 1}</td>
                <td>{operation.fullname}</td>
                <td>{operation.email}</td>
                <td>{operation.designation}</td>
                <td>{operation.team}</td>
                <td>{operation.password}</td>
                {/* <td className="cursor-pointer font-semibold" onClick={() => handleloginteam(operation.email, operation.password)}>Login <i className="fa fa-sign-in"></i></td> */}
                <td>
                  <button onClick={() => handleEdit(operation)}>
                    <i className="fa fa-edit"></i>
                  </button>
                  {/* Delete button hidden for leaders - only admin can delete 
                  <button onClick={() => handleDelete(operation._id)}>
                    <i className="fa fa-trash-o text-red-600"></i>
                  </button>
                  */}
                </td>
                <td>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSendEmail(operation)}
                    disabled={operation.mailSended}
                  >
                    {operation.mailSended ? (
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
      </div>
    </div>
  );
};

export default MarketingAddExecutive;
