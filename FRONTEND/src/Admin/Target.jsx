import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Target = () => {
  const [bda, setBda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState({});
  const [noOfPayments, setNoOfPayments] = useState({});
  const [getteamName, setGetTeamName] = useState([]);
  const [teamTarget, setTeamTarget] = useState({});
  const [noOfPayment, setNoOfPayment] = useState({});
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [teamRevenue, setTeamRevenue] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [months, setMonths] = useState([]);

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const fetchBda = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data);
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled students to calculate actual revenue
  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      setEnrolledStudents(response.data);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  // Get month name from date
  const getMonthFromDate = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = new Date(date).getMonth();
    return months[monthIndex];
  };

  // Get current month name
  const getCurrentMonthName = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return months[new Date().getMonth()];
  };

  // Get the previous months including the current month
  const getPastMonths = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthIndex = new Date().getMonth();
    let pastMonths = [];
    for (let i = currentMonthIndex; i >= 0; i--) {
      pastMonths.push(months[i]);
    }
    return pastMonths;
  };

  // Calculate team revenue when BDA and enrolled students data are available
  useEffect(() => {
    if (bda.length > 0 && enrolledStudents.length > 0 && selectedMonth) {
      const revenueByTeam = {};
      
      // Filter students: fullPaid status and selected month
      const fullyPaidStudents = enrolledStudents.filter((student) => {
        const isSelectedMonth = getMonthFromDate(student.createdAt) === selectedMonth;
        const isFullPaid = student.status === "fullPaid";
        
        return isSelectedMonth && isFullPaid;
      });
      
      console.log("Selected Month:", selectedMonth);
      console.log("Total FullPaid Students in", selectedMonth, ":", fullyPaidStudents.length);
      
      fullyPaidStudents.forEach((student) => {
        // Find the BDA by counselor name (case-insensitive match)
        const bdaMatch = bda.find(
          (b) => b.fullname?.toLowerCase().trim() === student.counselor?.toLowerCase().trim()
        );
        
        if (bdaMatch && bdaMatch.team) {
          const teamName = bdaMatch.team;
          // Use programPrice for fully paid students (the total course value)
          const amount = Number(student.programPrice) || 0;
          
          if (!revenueByTeam[teamName]) {
            revenueByTeam[teamName] = 0;
          }
          revenueByTeam[teamName] += amount;
          
          console.log(`Student: ${student.fullname}, Counselor: ${student.counselor}, Team: ${teamName}, Amount: ${amount}`);
        } else {
          console.log(`No BDA match for counselor: ${student.counselor}`);
        }
      });
      
      console.log("Revenue by Team:", revenueByTeam);
      setTeamRevenue(revenueByTeam);
    }
  }, [bda, enrolledStudents, selectedMonth]);

  useEffect(() => {
    fetchBda();
    fetchEnrolledStudents();
    const currentMonthName = getCurrentMonthName();
    setSelectedMonth(currentMonthName);
    setMonths(getPastMonths());
  }, []);

  // const handleInputChange = (e, id) => {
  //   setTargets((prev) => ({
  //     ...prev,
  //     [id]: e.target.value,
  //   }));
  // };
  const handleInputChange = (e, id, field) => {
    const value = e.target.value;

    if (field === "target") {
      setTargets((prev) => ({ ...prev, [id]: value }));
    } else if (field === "payments") {
      setNoOfPayments((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAsignTarget = async (e, id) => {
    e.preventDefault();
    const targetValue = targets[id];
     const payments = noOfPayments[id];
    // if (!targetValue) {
    //   toast.error("Please enter a target value.");
    //   return;
    // }
    // console.log("targetValue", targetValue, id);

    try {
      const response = await axios.post(`${API}/assigntarget/${id}`, {
        target: {
          currentMonth,
          targetValue: targetValue,
            payments,
        },
      });
      // console.log("response", response);
      if (response.status === 200) {
        toast.success("Target assigned successfully.");
        setTargets((prev) => ({
          ...prev,
          [id]: "",
        }));
        setNoOfPayments((prev) => ({ ...prev, [id]: "" }));
        fetchBda();
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
      "Are you sure you want to delete this target? This action cannot be undone." +
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
              fetchBda();
            } else {
              toast.error("Failed to delete target.");
            }
          })
          .catch((error) => {
            console.error("Error deleting target:", error);
            toast.error("Server error while deleting target.");
          });
      } else {
        toast.error("You can't delete a target from a previous month.");
        console.warn("Restricted deletion attempt:", target);
      }
    }
  };

  const fetchTeamname = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getteamname`);
      setGetTeamName(response.data);
    } catch (error) {
      console.error("There was an error fetching teamname:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamname();
  }, []);

  // const handleInputChangeTeam = (e, teamId) => {
  //   const { value } = e.target;
  //   setTeamTarget((prev) => ({
  //     ...prev,
  //     [teamId]: value,
  //   }));
  // };

  const handleInputChangeTeam = (e, id, field) => {
    const value = e.target.value;
    if (field === "target") {
      setTeamTarget((prev) => ({ ...prev, [id]: value }));
    } else if (field === "payments") {
      setNoOfPayment((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAsignTargetToTeam = async (e, teamId) => {
    e.preventDefault();
    const targetValue = teamTarget[teamId];
    const payments = noOfPayment[teamId];
    //  console.log(targetValue , teamId);
    //  if (!targetValue) return;
    try {
      const payload = {
        teamId,
        targetValue,
        payments,
        currentMonth,
      };
      const response = await axios.post(`${API}/targetassigntoteam`, payload);
      // console.log("Target Assigned");
      setTeamTarget((prev) => ({ ...prev, [teamId]: "" }));
      setNoOfPayment((prev) => ({ ...prev, [teamId]: "" }));
      fetchTeamname();
    } catch (error) {
      console.error("Error assigning target:", error);
    }
  };
  const handleDeleteTargetTeam = async (target, teamId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this target?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${API}/delete-target`, {
        data: {
          teamId,
          targetId: target._id,
        },
      });
      fetchTeamname();
    } catch (error) {
      console.error("Error deleting target:", error);
    }
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <h2>Target Assign to Team</h2>
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Month: </label>
          <select
            className="border border-black px-3 py-2 rounded-lg"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="coursetable">
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
                  <th>Team Name</th>
                  <th>Target</th>
                  <th>Current Month</th>
                  <th>Actual Revenue</th>
                  <th>Pending Revenue</th>
                  <th>Target Assign</th>
                </tr>
              </thead>
              <tbody>
                {getteamName.map((team, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{team.teamname}</td>
                    <td>
                      <select className="border rounded-md px-2 py-1">
                        {team.target.map((target, index) => (
                          <option key={index}>
                            {new Date(
                              `${target.currentMonth}-01`
                            ).toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            : {target.targetValue}
                          </option>
                        ))}
                      </select>
                      <select className="border rounded-md px-2 py-1">
                        {team.target.map((target, index) => (
                          <option key={index}>{target.payments}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {team.target.length > 0 &&
                      team.target[team.target.length - 1].currentMonth ===
                        currentMonth ? (
                        <p>
                          {team.target[team.target.length - 1].currentMonth} : ₹
                          {team.target[team.target.length - 1].targetValue}
                          <i
                            className="fa fa-trash cursor-pointer text-red-600 ml-2"
                            title="Delete Target"
                            onClick={() =>
                              handleDeleteTargetTeam(
                                team.target[team.target.length - 1],
                                team._id
                              )
                            }
                          ></i>{" "}
                          | {team.target[team.target.length - 1].payments}
                        </p>
                      ) : (
                        <p>No target assigned</p>
                      )}
                    </td>
                    <td>
                      <p className="text-green-600 font-semibold">
                        ₹{teamRevenue[team.teamname]?.toLocaleString() || 0}
                      </p>
                    </td>
                    <td>
                      <p className="text-red-600 font-semibold">
                        {team.target.length > 0 && team.target[team.target.length - 1].currentMonth === currentMonth
                          ? `₹${(Number(team.target[team.target.length - 1].targetValue) - (teamRevenue[team.teamname] || 0)).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </td>
                    <td>
                      {team.target.length > 0 &&
                      team.target[team.target.length - 1].currentMonth ===
                        currentMonth ? (
                        <p>already assign</p>
                      ) : (
                        <form
                          onSubmit={(e) => handleAsignTargetToTeam(e, team._id)}
                        >
                          <input
                            type="text"
                            placeholder="Traget amount"
                            value={teamTarget[team._id] || ""}
                            onChange={(e) =>
                              handleInputChangeTeam(e, team._id, "target")
                            }
                            // onChange={(e) => handleInputChangeTeam(e, team._id)}
                            name="teamTarget"
                            className="border rounded-md px-2 py-1 mr-2"
                          />
                          <input
                            type="text"
                            value={noOfPayment[team._id] || ""}
                            onChange={(e) =>
                              handleInputChangeTeam(e, team._id, "payments")
                            }
                            className="border rounded-md px-2 py-1"
                            placeholder="No of Payment"
                          />
                          <button type="submit" id="target">
                            Submit
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <h2>Target Assign To BDA</h2>
      <div className="coursetable">
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
                <th>Target</th>
                <th>Current Month</th>
                <th>Target Assign</th>
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
                  <td>
                    <select className="border rounded-md px-2 py-1">
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
                    <select className="border rounded-md px-2 py-1">
                      {bda.target.map((target, index) => (
                        <option key={index}>
                        {target.payments}
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
                        ></i> | {" "}  {bda.target[bda.target.length - 1].payments}
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
                          placeholder="Target amount"
                          value={targets[bda._id] || ""}
                          onChange={(e) =>
                            handleInputChange(e, bda._id, "target")
                          }
                          name="target"
                          className="border rounded-md px-1 py-1 mr-1"
                        />
                        <input
                          type="text"
                          placeholder="No of Payments"
                          value={noOfPayments[bda._id] || ""}
                          onChange={(e) =>
                            handleInputChange(e, bda._id, "payments")
                          }
                          className="border rounded-md px-1 py-1"
                        />
                        <button type="submit" id="target">
                          Submit
                        </button>
                      </form>
                    )}
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

export default Target;