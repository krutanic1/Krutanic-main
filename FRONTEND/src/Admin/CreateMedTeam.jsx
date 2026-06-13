import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const CreateMedTeam = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [medteam, setMedTeam] = useState([]);
  const [getteamName, setGetTeamName] = useState([]);
  const [teams, setTeams] = useState([{ id: 1, name: "" }]);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    team: "",
    designation: "",
  });

  const [editingMedTeamId, setEditingMedTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleVisibility = () => {
    setiscourseFormVisible((prevState) => !prevState);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    // For MANAGER, join all team names; for others, use single team
    const teamValue = formData.designation === "MED MANAGER"
      ? teams.map(t => t.name.trim()).filter(name => name !== "").join(", ")
      : formData.team.trim();
    const newMedTeam = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      team: teamValue,
      designation: formData.designation.trim(),
      teams: formData.designation === "MED MANAGER" ? teams.map(t => t.name.trim()).filter(name => name !== "") : [],
      appendTeams: editingMedTeamId ? true : false, // Append teams when editing
    };
    try {
      if (editingMedTeamId) {
        const response = await axios.put(
          `${API}/updatemedteam/${editingMedTeamId}`,
          newMedTeam
        );
        toast.success("MedTeam updated successfully!");
        // Update local state immediately with returned data
        setMedTeam((prevMedTeam) =>
          prevMedTeam.map((item) => item._id === editingMedTeamId ? response.data : item)
        );
      } else {
        const response = await axios.post(`${API}/createmedteam`, newMedTeam);
        toast.success("MedTeam created successfully!");
        // Append new MedTeam to local state immediately
        // Ensure status is Active as backend doesn't return it explicitly in all cases but defaults usually
        // If backend schema defaults status to 'Active', response.data will have it if it returns the saved object.
        // Backend code: res.status(201).json(newmedteam); -> newmedteam is the mongoose doc, so it has defaults.
        setMedTeam((prevMedTeam) => [response.data, ...prevMedTeam]);
      }
      resetForm();
      // fetchMedTeam(); // Removed to prevent flickering/delay. We rely on optimistic/response update.
    } catch (error) {
      const errorMessage = error.response?.data?.message || "There was an error while creating or updating the medteam";
      toast.error(errorMessage);
      console.error("There was an error submitting the medteam:", error);
    }
  };

  const fetchMedTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getmedteam`);
      setMedTeam(response.data.filter((item) => item && item.status === "Active" && item.designation && !item.designation.includes("ADV")));
    } catch (error) {
      console.error("There was an error fetching medteam:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamname = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getmedteamname`);
      setGetTeamName(response.data);
    } catch (error) {
      console.error("There was an error fetching teamname:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedTeam();
    fetchTeamname();
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      team: "",
      designation: "",
    });
    setTeams([{ id: 1, name: "" }]);
    setEditingMedTeamId(null);
    setiscourseFormVisible(false);
  };

  // Functions for managing dynamic teams
  const handleAddTeam = () => {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setTeams([...teams, { id: newId, name: "" }]);
  };

  const handleRemoveTeam = (id) => {
    if (teams.length > 1) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const handleTeamNameChange = (id, value) => {
    setTeams(teams.map(t => t.id === id ? { ...t, name: value } : t));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "fullname" || name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleDelete = async (_id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the MedTeam account?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deletemedteam/${_id}`);
        setMedTeam((prevMedTeam) => prevMedTeam.filter((item) => item._id !== _id));
        toast.success("MedTeam deleted successfully!");
      } catch (error) {
        console.error("There was an error deleting the medteam:", error);
        toast.error("Failed to delete MedTeam.");
        fetchMedTeam(); // Revert on error
      }
    }
  };
  const handleEdit = (medteamId) => {
    setFormData({
      fullname: medteamId.fullname,
      email: medteamId.email,
      password: medteamId.password,
      team: medteamId.team,
      designation: medteamId.designation,
    });

    // If the person is a MANAGER and has existing teams, load them
    if (medteamId.designation === "MED MANAGER" && medteamId.teams && medteamId.teams.length > 0) {
      setTeams(medteamId.teams.map((teamName, index) => ({ id: index + 1, name: teamName })));
    } else {
      setTeams([{ id: 1, name: "" }]);
    }

    setEditingMedTeamId(medteamId._id);
    setiscourseFormVisible(true);
  };

  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
    try {
      const response = await axios.post(`${API}/sendmailtomedteam`, emailData);
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const medteamData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedmedteam/${value._id}`,
          medteamData
        );
        if (updateResponse.status === 200) {
          toast.success("MedTeam record updated successfully!");
        } else {
          toast.error("Failed to update MedTeam record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
    fetchMedTeam();
  };

  const handleChangeStatus = async (medteamId, status) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to ${status} this account?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(`${API}/updatemedteamstatus/${medteamId}`, { status });
        if (response.status === 200) {
          toast.success(`Account ${status} successfully!`);
          if (status === "Inactive") {
            setMedTeam((prevMedTeam) => prevMedTeam.filter((item) => item._id !== medteamId));
          } else {
            fetchMedTeam();
          }
        } else {
          toast.error("Failed to update account status.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the status.");
      }
    }
  }


  const handleAddTeamname = (e) => {
    e.preventDefault();
    const teamData = {
      teamname: teamName.trim(),
    };
    // console.log("teamData", teamData);
    axios.post(`${API}/addmedteamname`, teamData)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Team added successfully!");
          setTeamName(" ");
          fetchMedTeam();
          fetchTeamname();
        } else {
          toast.error("Failed to add team.");
        }
      })
      .catch((error) => {
        console.error("There was an error adding the team:", error);
        toast.error("please enter a team name.");
      });
  }

  const handleloginteam = async (userId, role) => {
    try {
      const response = await axios.post(`${API}/api/admin/impersonate`, 
        { userId, role },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Impersonation successful!");
        const { token, medTeamId, userId: resUserId, medTeamName, designation, user } = response.data;
        
        // Pass credentials via URL so the new tab can save them to its own sessionStorage
        // We use fallbacks to ensure compatibility with different backend response formats
        const targetId = medTeamId || resUserId || userId;
        const targetName = medTeamName || user?.name || "";
        const targetRole = designation || role;

        const impersonateUrl = `/medteam/home?impToken=${encodeURIComponent(token)}&impId=${targetId}&impName=${encodeURIComponent(targetName)}&impRole=${encodeURIComponent(targetRole)}&impType=medTeamToken`;
        
        setTimeout(() => {
          window.open(impersonateUrl, "_blank");
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Impersonation failed!");
    }
  };

  const handleChangeAccess = async (id, currentAccess) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to change the access of this account?`
    );
    if (isConfirmed) {
      try {
        const newAccess = !currentAccess;
        const response = await axios.put(`${API}/updatemedteamaccess/${id}`, { Access: newAccess });
        if (response.status === 200) {
          toast.success(`Account access changed successfully!`);
          setMedTeam((prevMedTeam) =>
            prevMedTeam.map((item) =>
              item._id === id ? { ...item, Access: newAccess } : item
            )
          );
        } else {
          toast.error("Failed to update account");
        }
      } catch (error) {
        toast.error("An error occurred while updating the account");
        fetchMedTeam(); // Revert on error
      }
    }
  }

  return (
    <div id="AdminAddCourse" >
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSumbit}>
            <span onClick={resetForm}>✖</span>
            <h2>{editingMedTeamId ? "Edit MedTeam Account" : "Create MedTeam Account"}</h2>
            <input
              value={formData.fullname}
              onChange={handleChange}
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter First Name"
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
              <option value="MED MANAGER">MED MANAGER</option>
              <option value="MED LEADER">MED LEADER</option>
              <option value="BOE">BOE</option>
            </select>

            {/* Show single team select for BOE and LEADER */}
            {(formData.designation === "BOE" || formData.designation === "MED LEADER" || formData.designation === "") && (
              <select name="team" id="team" value={formData.team} onChange={handleChange} required={formData.designation !== "MED MANAGER"}>
                <option disabled value="">Select Team</option>
                {getteamName.map((team, index) => { return (<option key={index} value={team.teamname}>{team.teamname}</option>) })}
              </select>
            )}

            {/* Show dynamic teams section for MANAGER */}
            {formData.designation === "MED MANAGER" && (
              <div className="teams-section" style={{ width: '100%' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Manage Teams:</label>
                {teams.map((team, index) => (
                  <div key={team.id} className="flex gap-2 items-center" style={{ marginBottom: '8px' }}>
                    <select
                      value={team.name}
                      onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                      required
                      style={{ flex: 1 }}
                    >
                      <option disabled value="">Select Team {index + 1}</option>
                      {getteamName.map((t, idx) => (
                        <option key={idx} value={t.teamname}>{t.teamname}</option>
                      ))}
                    </select>
                    {teams.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeam(team.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        title="Remove Team"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  style={{ marginTop: '8px' }}
                >
                  + Add Team
                </button>
              </div>
            )}
            <input
              type="text"
              value={formData.password}
              onChange={handleChange}
              required
              name="password"
              id="password"
              placeholder="Create password"
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editingMedTeamId ? "Edit Account" : "Create Account"}
            />
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h2>Team Lists</h2>
          <span onClick={toggleVisibility}>+ Add New Member</span>
        </div>
        <div>
          <form onSubmit={handleAddTeamname} className="flex gap-2 items-center">
            <input type="text" name="teamname" value={teamName} onChange={(e) => setTeamName(e.target.value)} id="teamname" placeholder="Add New Team.." className="px-2 py-1 border rounded-md" />
            <input type="submit" value="Add Team" className="bg-blue-500 px-2 py-1 border rounded-md" />
          </form>
          <div className="flex gap-2 items-center">
            <h2>Total Teams</h2>
            <select className="px-2 py-1 border rounded-md">
              {getteamName.map((team, index) => { return (<option key={index} value={team.teamname}>{team.teamname}</option>) })}
            </select>
          </div>
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
                <th>Team</th>
                <th>Password</th>
                <th>Login</th>
                <th>Status</th>
                <th>Action</th>
                <th>Add Team Active</th>
                <th>Send Login Credentials</th>
              </tr>
            </thead>
            <tbody>
              {medteam.map((medteam, index) => (
                <tr key={index} className={`${medteam.designation}`}>
                  <td>{index + 1}</td>
                  <td>{medteam.fullname}</td>
                  <td >{medteam.email}</td>
                  <td>{medteam.designation}</td>
                  <td>{medteam.team}</td>
                  <td>{medteam.password}</td>
                  <td className="cursor-pointer font-semibold" onClick={() => handleloginteam(medteam._id, medteam.designation)}>Login <i className="fa fa-sign-in"></i></td>
                  <td>{medteam.status}</td>
                  <td>
                    <button title="Edit" onClick={() => handleEdit(medteam)}><i className="fa fa-edit"></i></button>
                    <button title="Delete" onClick={() => handleDelete(medteam._id)}><i className="fa fa-trash-o text-red-600"></i></button>
                    <button title="Inactive MedTeam" onClick={() => handleChangeStatus(medteam._id, "Inactive")}><i className="fa fa-eye-slash"></i></button>
                  </td>
                  <td>
                    <div className="cursor-pointer">
                      {medteam.Access === true ? (
                        <i onClick={() => handleChangeAccess(medteam._id, medteam.Access)} title="Access given" className="fa fa-check text-green-900"></i>
                      ) : (
                        <i onClick={() => handleChangeAccess(medteam._id, medteam.Access)} title="Access not given" className="fa fa-times text-red-600"></i>
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      className=" cursor-pointer"
                      onClick={() => handleSendEmail(medteam)}
                      disabled={medteam.mailSended}
                    >
                      {medteam.mailSended ? (
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

export default CreateMedTeam;
