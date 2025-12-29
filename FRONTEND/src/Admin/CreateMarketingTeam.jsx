import React, { useEffect, useState } from "react";
import API from "../API";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const CreateMarketingTeam = () => {
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [getteamName, setGetTeamName] = useState([]);
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [editingOperationId, setEditingOperationId] = useState(null);
  const [operation, setOperation] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    designation: "",
     team: "",
     password: "",
  });


  const toggleVisibility = () => {
    setiscourseFormVisible((prevState) => !prevState);
  };

  const handleAddTeamname = (e) => {
    e.preventDefault();
    const teamData = {
      teamname: teamName.trim(),
    };
    axios
      .post(`${API}/addmarketingteamname`, teamData)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Team added successfully!");
          setTeamName(" ");
          fetchTeamname();
        } else {
          toast.error("Failed to add team.");
        }
      })
      .catch((error) => {
        console.error("There was an error adding the team:", error);
        toast.error("please enter a team name.");
      });
  };

  const fetchTeamname = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getmarketingteamname`);
      setGetTeamName(response.data);
    } catch (error) {
      console.error("There was an error fetching teamname:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); 
    const newOperation = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      designation: formData.designation.trim(),
      team: formData.team.trim(),
      password: formData.password.trim(),
    };
    try {
      if (editingOperationId) {
        const response = await axios.put(
          `${API}/updatemarketing/${editingOperationId}`,
          newOperation
        );
        toast.success("Data updated successfully");
      } else {
        const response = await axios.post(
          `${API}/createmarketing`,
          newOperation
        );
        toast.success("Marketing created successfully");
      }
      fetchOperation();
      resetForm();
    } catch (error) {
      toast.error("There was an error while creating or updating");
      console.error("Error creating or updating", error);
    }
  };

  const fetchOperation = async () => {
    try {
      const response = await axios.get(`${API}/getmarketing`);
      setOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching operation:", error);
    }
  };

  useEffect(() => {
    fetchOperation();
    fetchTeamname();
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      designation:"",
      team: "",
      password: "", 
    });
    setEditingOperationId(null);
    setiscourseFormVisible(false);
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
        fetchOperation();
      } catch (error) {
        alert("There was an error deleting the operation");
        console.error("Error deleting operation", error);
      }
    }
  };
  const handleEdit = (operation) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the operation details?"
    );
    if (isConfirmed) {
      setFormData({
        fullname: operation.fullname.trim(),
        email: operation.email.trim(),
        designation: operation.designation.trim(),
        team: operation.team.trim(),
        password: operation.password,
      });
      setEditingOperationId(operation._id);
      setiscourseFormVisible(true);
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
    fetchOperation();
  };

  const handleloginteam = async (email, password) => {
    try {
      const response = await axios.post(`${API}/checkmarketingauth`, { email, password });
      if (response.status === 200) {
        toast.success("Login successful!");
        const loginTime = new Date().getTime();
        setTimeout(() => {
          localStorage.setItem("marketingToken", response.data.token);
          localStorage.setItem("marketingUser", response.data.marketingName);
          localStorage.setItem("sessionStartTime", loginTime);
          window.open("/marketing/home", "_blank");
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login!");
    }
  };

  return (
    <div id="create-marketing-team">
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>{editingOperationId ? "Edit Account" : "Create Account"}</h2>
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
            <select name="designation" id="designation" value={formData.designation} onChange={handleChange} required>
              <option disabled value="">Select Designation</option>
              {/* <option value="MANAGER">MANAGER</option> */}
              <option value="LEADER">LEADER</option>
              <option value="EXECUTIVE">EXECUTIVE</option>
            </select>
            <select name="team" id="team" value={formData.team} onChange={handleChange} required>
              <option disabled value="">Select Team</option>
              {getteamName.map((team, index) => { return(  <option key={index} value={team.teamname}>{team.teamname}</option>)})}
            </select>
            <input
              type="text"
              placeholder="Create password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editingOperationId ? "Update Account" : "Create Account"}
            />
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h1>Marketing List:</h1>
          <span onClick={toggleVisibility}>+ Add New</span>
        </div>
        <div>
          <form
            onSubmit={handleAddTeamname}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              name="teamname"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value.toUpperCase())}
              id="teamname"
              placeholder="Add New Team.."
              className="px-2 py-1 border rounded-md"
            />
            <input
              type="submit"
              value="Add Team"
              className="bg-blue-500 px-2 py-1 border rounded-md"
            />
          </form>
          <div className="flex gap-2 items-center">
            <h2>Total Teams</h2>
            <select className="px-2 py-1 border rounded-md">
              {getteamName.map((team, index) => {
                return (
                  <option key={index} value={team.teamname}>
                    {team.teamname}
                  </option>
                );
              })}
            </select>
          </div>
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
              <th>Login</th>
              <th>Action</th>
              <th>Send Login Credentials</th>
              {/* <th>Assinged Target</th> */}
              {/* <th>Target</th> */}
            </tr>
          </thead>
          <tbody>
            {operation?.map((operation, index) => (
              <tr key={index} className={`${operation.designation}`}>
                <td>{index + 1}</td>
                <td>{operation.fullname}</td>
                <td>{operation.email}</td>
                 <td>{operation.designation}</td>
                  <td>{operation.team}</td>
                <td>{operation.password}</td>
                <td className="cursor-pointer font-semibold" onClick={() => handleloginteam(operation.email, operation.password)}>Login <i className="fa fa-sign-in"></i></td>
                <td>
                  <button onClick={() => handleEdit(operation)}>
                    <i className="fa fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(operation._id)}>
                    <i className="fa fa-trash-o text-red-600"></i>
                  </button>
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

export default CreateMarketingTeam;
