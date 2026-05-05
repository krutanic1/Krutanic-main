import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamTeamLogin = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const managerId = localStorage.getItem("advTeamId");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const mgrRes = await axios.get(`${API}/getadvteam`, { params: { advTeamId: managerId } });
      const mgr = mgrRes.data;

      const allRes = await axios.get(`${API}/getadvteam`);
      const allMembers = allRes.data;

      const managerTeams = mgr.teams && mgr.teams.length > 0 ? mgr.teams : [mgr.team];

      const filtered = allMembers.filter(member => {
        if (member._id === managerId) return false;
        const memberTeams = member.teams && member.teams.length > 0 ? member.teams : [member.team];
        return managerTeams.some(t => memberTeams.includes(t)) || managerTeams.includes(member.team) || memberTeams.includes(mgr.team);
      });

      setTeamMembers(filtered);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = async (userId) => {
    try {
      const response = await axios.post(`${API}/manager-impersonate-advteam`, { userId, managerId });
      if (response.status === 200) {
        toast.success("Impersonation successful!");
        const loginTime = new Date().getTime();
        setTimeout(() => {
          localStorage.setItem("advTeamId", response.data.bdaId);
          localStorage.setItem("advTeamName", response.data.bdaName);
          localStorage.setItem("advTeamToken", response.data.token);
          localStorage.setItem("advTeamSessionStartTime", loginTime);
          localStorage.setItem("advTeamDesignation", response.data.designation || "");
          localStorage.setItem("advTeamReadOnly", "true"); // Readonly flag
          window.open("/advteam/home", "_blank");
        }, 500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to login to team member");
    }
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="coursetable" style={{ marginLeft: "270px" }}>
        <div>
          <h2>Team Members Login</h2>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <tr key={member._id} className={`${member.designation}`}>
                    <td>{index + 1}</td>
                    <td>{member.fullname}</td>
                    <td>{member.email}</td>
                    <td>{member.designation}</td>
                    <td>{member.team || (member.teams ? member.teams.join(", ") : "")}</td>
                    <td>
                      <div 
                        className="cursor-pointer font-semibold bg-blue-500 text-white px-3 py-1 rounded w-max"
                        onClick={() => handleLogin(member._id)}
                      >
                        Login <i className="fa fa-sign-in"></i>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No team members found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvTeamTeamLogin;
