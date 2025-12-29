import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AddTeam = () => {
 const bdaId = localStorage.getItem("bdaId");
  const [bdaData, setBdaData] = useState(null);
  const fetchBdaData = async () => {
    try {
      const response = await axios.get(`${API}/getbda`, { params: { bdaId } });
      if (response.data.status === "Inactive") {
        toast.error("Your account is inactive. Please contact the admin.");
        setTimeout(() => {
          localStorage.removeItem("bdaId");
          localStorage.removeItem("bdaName");
          localStorage.removeItem("bdaToken");
          localStorage.removeItem("sessionStartTime");
          navigate("/TeamLogin");
          window.location.reload();
        }, 1500);
      } else {
        setBdaData(response.data);
      }
    } catch (err) {
      console.log("Failed to fetch bda data");
    }
  };
  useEffect(() => {
    fetchBdaData();
  }, [bdaId]);

  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    team: "",
    designation: "",
  });
  const [bda, setBda] = useState([]);
  const [editingBdaId, setEditingBdaId] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleVisibility = () => {
    setiscourseFormVisible((prevState) => !prevState);
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    const newBda = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      team: formData.team.trim(),
      designation: formData.designation.trim(),
    };
    try {
      if (editingBdaId) {
        const response = await axios.put(
          `${API}/updatebda/${editingBdaId}`,
          newBda
        );
        toast.success("BDA updated successfully!");
      } else {
        const response = await axios.post(` ${API}/createbda`, newBda);
        toast.success("BDA created successfully!");
      }
      resetForm();
      fetchBda();
    } catch (error) {
      toast.error("There was an error while creating or updating the bda");
      console.error("There was an error submitting the bda:", error);
    }
  };
      
  const navigate = useNavigate();
  const fetchBda = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getbda`);
      // console.log(response.data);
      setBda(response.data);
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBda();
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      team: "",
      designation: "",
    });
    setEditingBdaId(null);
    setiscourseFormVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "fullname" || name === "email" ? value.toLowerCase() : value,
    }));
  };

  // const handleDelete = (_id) => {
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete the BDA account?"
  //   );
  //   if (isConfirmed) {
  //     axios
  //       .delete(`${API}/deletebda/${_id}`)
  //       .then((response) => {
  //         fetchBda();
  //       })
  //       .catch((error) => {
  //         console.error("There was an error deleting the bda:", error);
  //       });
  //   }
  // };

  // const handleEdit = (bdaId) => {
  //   setFormData({
  //     fullname: bdaId.fullname,
  //     email: bdaId.email,
  //     password: bdaId.password,
  //     team: bdaId.team,
  //     designation: bdaId.designation,
  //   });
  //   setEditingBdaId(bdaId._id);
  //   setiscourseFormVisible(true);
  // };

  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
    try {
      const response = await axios.post(`${API}/sendmailtobda`, emailData);
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const bdaData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedbda/${value._id}`,
          bdaData
        );
        if (updateResponse.status === 200) {
          toast.success("BDA record updated successfully!");
        } else {
          toast.error("Failed to update Bda record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
    fetchBda();
  };


  return (
    <div id="AdminAddCourse" >
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSumbit}>
            <span onClick={resetForm}>✖</span>
            <h2>{editingBdaId ? "Edit BDA Account" : "Create BDA Account"}</h2>
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
              <option value="MANAGER">MANAGER</option>
              <option value="LEADER">LEADER</option>
              <option value="BDA">BDA</option>
            </select>
            <select name="team" id="team" value={formData.team} onChange={handleChange} required>
              <option disabled value="">Select Team</option>
              <option value="TITAN">TITAN</option>
              <option value="GLADIATOR">GLADIATOR</option>
              <option value="BEAST">BEAST</option>
              <option value="WARRIOR">WARRIOR</option>
              <option value="NO TEAM">NO TEAM</option>
            </select>
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
              value={editingBdaId ? "Edit Account" : "Create Account"}
            />
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h2>Team Lists</h2>
          <span onClick={toggleVisibility}>+ Add New Member</span>
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
                {/* <th>Action</th> */}
                <th>Send Login Credentials</th>
              </tr>
            </thead>
            <tbody>
              {bda.map((bda, index) => (
                <tr key={index} className={`${bda.designation}`}>
                  <td>{index + 1}</td>
                  <td>{bda.fullname}</td>
                  <td>{bda.email}</td>
                  <td>{bda.designation}</td>
                  <td>{bda.team}</td>
                  <td>{bda.password}</td>
                  {/* <td>
                    <button onClick={() => handleEdit(bda)}><i className="fa fa-edit"></i></button>
                    <button onClick={() => handleDelete(bda._id)}><i className="fa fa-trash-o text-red-600"></i></button>
                  </td> */}
                  <td>
                    <div
                      className=" cursor-pointer"
                      onClick={() => handleSendEmail(bda)}
                      disabled={bda.mailSended}
                    >
                      {bda.mailSended ? (
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

export default AddTeam;
