import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
const AssignTarget = () => {
  const bdaId = localStorage.getItem("bdaId");
  const [bdaData, setBdaData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [targets, setTargets] = useState({});
  const [getteamName, setGetTeamName] = useState([]);
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  useEffect(() => {
    const fetchBdaData = async () => {
      if (!bdaId) {
        console.warn("Team user not logged in");
        return;
      }
      try {
        const response = await axios.get(`${API}/getbda`, { params: { bdaId } });
        setBdaData(response.data);
        setSelectedTeam(response.data.team);
      } catch (err) {
        console.log("Failed to fetch bda data");
      }
    };

    fetchBdaData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API}/getbda`);
      setAllData(response.data);
    } catch (error) {
      console.error("There was an error fetching all Data:", error);
    }
  };

  const handleInputChange = (e, id) => {
    setTargets((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };
  const handleAsignTarget = async (e, id) => {
    e.preventDefault();
    const targetValue = targets[id];
    if (!targetValue) {
      toast.error("Please enter a target value.");
      return;
    }
    try {
      const response = await axios.post(`${API}/assigntarget/${id}`, {
        target: {
          currentMonth,
          targetValue: targetValue,
        },
      });
      if (response.status === 200) {
        toast.success("Target assigned successfully.");
        setTargets((prev) => ({
          ...prev,
          [id]: "",
        }));
        fetchAllData();
      } else {
        toast.error("Failed to assign target.");
      }
    } catch (error) {
      console.error("Error assigning target:", error);
      toast.error("Server error while assigning target.");
    }
  };

  const handleDeleteTarget = (target, id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this target? This action cannot be undone."+
      "Please ok to proceed."
      );
    if (confirmation) {
        if (target.currentMonth === currentMonth) {
            axios
              .put(`${API}/deletetarget/${id}`, {
                target: target,
              })
              .then((response) => {
                if (response.status === 200) {
                  toast.success("Target deleted successfully.");
                  fetchAllData();
                } else {
                  toast.error("Failed to delete target.");
                }
              })
              .catch((error) => {
                console.error("Error deleting target:", error);
                toast.error("Server error while deleting target.");
              });
          }else{
            toast.error("You can't delete a target from a previous month.");
            console.warn("Restricted deletion attempt:", target);
          }
    }
  };

  const fetchTeamname = async () => {
    try {
      const response = await axios.get(`${API}/getteamname`);
      setGetTeamName(response.data);
    } catch (error) {
      console.error("There was an error fetching teamname:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchTeamname();
  }, []);

  const filteredData = allData.filter((bda) => bda.team === selectedTeam);
  const selectedTeamTarget = getteamName
  .filter((team) => team.teamname === selectedTeam)
  .map((team) => {
    const lastTarget =
      team.target && team.target.length > 0
        ? team.target[team.target.length - 1]
        : null;

    return lastTarget?.currentMonth === currentMonth ? lastTarget : null;
  })[0];

  return (
    <div id="AdminAddCourse">
         <Toaster position="top-center" reverseOrder={false} />
      <div className="coursetable">
        <div className="mb-2">
          <h2 className="flex items-center gap-2">{selectedTeam}</h2>
          <p> {selectedTeamTarget ? (
      <p className="text-lg font-bold">
      Target: ₹ {selectedTeamTarget.targetValue}/- &nbsp;&nbsp; CurrentMonth: {selectedTeamTarget.currentMonth}
      </p>
    ) : (
      <p>No target assigned</p>
    )}</p>
          {bdaData && bdaData.designation === "MANAGER" && (
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
              {bdaData && bdaData.team && <option value={bdaData.team}>Your Team</option>}
              {getteamName.map((team, index) => {return(<option key={index} value={team.teamname}>{team.teamname}</option>)})}
            </select>
          )}
        </div>
        <table border="1">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Target</th>
              <th>Current Month</th>
              <th>Target Assign</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bda, index) => (
              <tr key={index} className="hover:bg-slate-100">
                <td>{index + 1}</td>
                <td>{bda.fullname}</td>
                <td>{bda.email}</td>
                <td>{bda.designation}</td>
                <td>
                    <select
                      className="border rounded-md px-2 py-1">
                      {bda.target.map((target, index) => (
                        <option key={index}>
                          {new Date(`${target.currentMonth}-01`).toLocaleString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}{" "}
                          : {target.targetValue}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {bda.target.length > 0 &&
                    bda.target[bda.target.length - 1].currentMonth ===
                      currentMonth ? (
                      <p>
                        {bda.target[bda.target.length - 1].currentMonth} : ₹
                        {bda.target[bda.target.length - 1].targetValue}
                        <i
                          className="fa fa-trash cursor-pointer text-red-600 ml-2"
                          title="Delete Target"
                          onClick={() =>
                            handleDeleteTarget(
                              bda.target[bda.target.length - 1],
                              bda._id
                            )
                          }
                        ></i>
                      </p>
                    ) : (
                      <p>No target assigned</p>
                    )}
                  </td>
                  <td>
                    {bda.target.length > 0 &&
                    bda.target[bda.target.length - 1].currentMonth ===
                      currentMonth ? (
                      <p>already assign</p>
                    ) : (
                      <form onSubmit={(e) => handleAsignTarget(e, bda._id)}>
                        <input
                          type="text"
                          value={targets[bda._id] || ""}
                          onChange={(e) => handleInputChange(e, bda._id)}
                          name="target"
                          className="border rounded-md px-2 py-1"
                        />
                        <button type="submit" className="ml-2">
                          Submit
                        </button>
                      </form>
                    )}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTarget;
