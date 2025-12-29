import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const InactiveBda = () => {
  
    const [bda, setBda] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBda = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data.filter((item) => item && item.status === "Inactive"));
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    } finally{
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBda();
  
  }, []);





  const handleloginteam = async (email,password) => {
    try {
      const response = await axios.post(`${API}/checkbdaauth`, { email, password });
      if (response.status === 200) {
      toast.success("Login successful!");
      const loginTime = new Date().getTime();
      setTimeout(() => {
      localStorage.setItem("bdaId", response.data.bdaId);
      localStorage.setItem("bdaName", response.data.bdaName);
      localStorage.setItem("bdaToken", response.data.token);
       localStorage.setItem("sessionStartTime", loginTime);
       window.open("/Home", "_blank"); 
    }, 500);
    }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP!");
    }
  };

   const handleChangeStatus = async (bdaId, status) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to ${status} this account?`
    );
    if (isConfirmed) {
      try {
        const response = await axios.put(`${API}/updatestatus/${bdaId}`, { status });
        if (response.status === 200) {
          toast.success(`Account ${status} successfully!`);
          fetchBda();
        } else {
          toast.error("Failed to update account status.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the status.");
      }
    }
  }


  return (
    <div id="AdminAddCourse" >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="coursetable">
        <div>
          <h2>Team Lists</h2>
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
                <th>Action</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bda.map((bda, index) => (
                <tr key={index} className={`${bda.designation}`}>
                  <td>{index + 1}</td>
                  <td>{bda.fullname}</td>
                  <td >{bda.email}</td>
                  <td>{bda.designation}</td>
                  <td>{bda.team}</td>
                  <td>{bda.password}</td>
                  <td className="cursor-pointer font-semibold" onClick={() => handleloginteam(bda.email, bda.password)}>Login <i className="fa fa-sign-in"></i></td>
                  <td>
                    <button title="Active BDA" onClick={() => handleChangeStatus(bda._id , "Active")}><i className="fa fa-eye-slash"></i></button>
                  </td>
                  <td>
                    {bda.status}
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

export default InactiveBda;
