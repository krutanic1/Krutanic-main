import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const MedTeamDetail = () => {
  const medTeamId = localStorage.getItem("medTeamId");
  const [detailVisible, setDetailVisible] = useState(false);
  const [medTeamData, setMedTeamData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [managerTeams, setManagerTeams] = useState([]); // Array of teams for managers
  const [selectedMedTeam, setSelectedMedTeam] = useState(null);
  const [getteamName, setGetTeamName] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [showAddMedTeamForm, setShowAddMedTeamForm] = useState(false);
  const [selectedTeamForNewMedTeam, setSelectedTeamForNewMedTeam] = useState(""); // Team selection for new MedTeam
  const [selectedDesignation, setSelectedDesignation] = useState("BOE"); // Designation selection
  const [isSubmittingMedTeam, setIsSubmittingMedTeam] = useState(false); // Loading state for form submission
  const [newMedTeamForm, setNewMedTeamForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchMedTeamData = async () => {
      if (!medTeamId) {
        console.warn("Team user not logged in");
        return;
      }
      try {
        const response = await axios.get(`${API}/getmedteam`, {
          params: { medTeamId },
        });
        setMedTeamData(response.data);
        // For managers, use teams array if available, otherwise parse from team string
        if (response.data.designation?.toUpperCase().includes("MANAGER")) {
          const teamsArray = response.data.teams && response.data.teams.length > 0
            ? response.data.teams
            : response.data.team ? response.data.team.split(", ").map(t => t.trim()) : [];
          setManagerTeams(teamsArray);
          setSelectedTeam(teamsArray[0] || ""); // Default to first team
        } else {
          setSelectedTeam(response.data.team);
          setManagerTeams([response.data.team]);
        }
      } catch (err) {
        console.log("Failed to fetch medTeam data");
      }
    };

    fetchMedTeamData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API}/medteam-with-enrolls`);
      setAllData(response.data);
      console.log("All Data:", response.data);
    } catch (error) {
      console.error("There was an error fetching all Data:", error);
    }
  };

  const fetchTeamname = async () => {
    try {
      const response = await axios.get(`${API}/getmedteamname`);
      setGetTeamName(response.data);
    } catch (error) {
      console.error("There was an error fetching teamname:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchTeamname();
  }, []);
  //add 
  const handleSendEmail_NotUsed = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
    try {
      const response = await axios.post(`${API}/sendmailtomedteam`, emailData);
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const medTeamData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedmedteam/${value._id}`,
          medTeamData
        );
        if (updateResponse.status === 200) {
          toast.success("MedTeam record updated successfully!");
        } else {
          toast.error("Failed to update Bda record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
    fetchAllData();
  };

  // Function to group enrollments by date (last 7 days only)
  const groupByDate = (enrollments) => {
    const result = {};
    const today = new Date();
    const last10Days = new Date();
    last10Days.setDate(today.getDate() - 9); // 10-day range

    enrollments.forEach((item) => {
      const date = new Date(item.createdAt).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      const itemDate = new Date(date);

      // Filter only last 10 days
      if (itemDate >= last10Days && itemDate <= today) {
        if (!result[date]) {
          result[date] = { count: 0, total: 0, credited: 0, booked: 0 };
        }
        result[date].count++;
        result[date].total += item.programPrice || 0;
        result[date].booked += item.paidAmount || 0;
        if (
          item.status === "fullPaid" ||
          (Array.isArray(item.remark) &&
            item.remark[item.remark.length - 1] === "Half_Cleared")
        ) {
          result[date].credited += item.paidAmount || 0;
        }
      }
    });

    return Object.entries(result)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, values]) => ({
        date,
        count: values.count,
        total: values.total,
        booked: values.booked,
        credited: values.credited,
      }));
  };

  // Function to group enrollments by month (current and previous month only)
  const groupByMonth = (enrollments) => {
    const result = {};
    const today = new Date();
    const getMonth = (date, offset) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - offset);
      return newDate.toISOString().slice(0, 7);
    };

    const currentMonth = getMonth(today, 0);
    const prevMonth1 = getMonth(today, 1);
    const prevMonth2 = getMonth(today, 2);
    const prevMonth3 = getMonth(today, 3);

    enrollments.forEach((item) => {
      const month = new Date(item.createdAt).toISOString().slice(0, 7); // Extract YYYY-MM
      // Filter only the last 3 months
      if ([currentMonth, prevMonth1, prevMonth2, prevMonth3].includes(month)) {
        if (!result[month]) {
          result[month] = { count: 0, total: 0, credited: 0 };
        }
        result[month].count++;
        result[month].total += item.programPrice || 0;
        if (
          item.status === "fullPaid" ||
          (Array.isArray(item.remark) &&
            item.remark[item.remark.length - 1] === "Half_Cleared")
        ) {
          result[month].credited += item.paidAmount || 0;
        }
      }
    });

    return Object.entries(result)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, values]) => ({
        month,
        count: values.count,
        total: values.total,
        credited: values.credited,
      }));
  };
  const selectedMedMedTeamDetail = (medTeam) => {
    setSelectedMedTeam(medTeam);
    setDetailVisible(true);
    setDailyRevenue(groupByDate(medTeam.enrollments));
    setMonthlyRevenue(groupByMonth(medTeam.enrollments));
  };
  const resetData = () => {
    setSelectedMedTeam(null);
    setDetailVisible(false);
  };

  // Handler functions for Add MedTeam Member form
  const handleOpenAddMedTeamForm = () => {
    // Pre-select the currently viewed team or first team for managers
    const defaultTeam = selectedTeam || managerTeams[0] || medTeamData?.team || "";
    setSelectedTeamForNewMedTeam(defaultTeam);
    // Default designation to MedTeam
    setSelectedDesignation("BOE");
    setShowAddMedTeamForm(true);
  };

  const handleCloseAddMedTeamForm = () => {
    setShowAddMedTeamForm(false);
    setSelectedTeamForNewMedTeam("");
    setSelectedDesignation("BOE");
    setIsSubmittingMedTeam(false);
    setNewMedTeamForm({
      fullname: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleNewMedTeamInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedTeamForm((prev) => ({
      ...prev,
      [name]: name === "fullname" || name === "email" ? value.toLowerCase() : value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitNewMedTeam = async (e) => {
    e.preventDefault();

    // Validation
    if (!newMedTeamForm.fullname.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (!newMedTeamForm.email.trim()) {
      toast.error("Please enter an email");
      return;
    }

    if (!validateEmail(newMedTeamForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!newMedTeamForm.password || newMedTeamForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate team selection
    if (!selectedTeamForNewMedTeam || !selectedTeamForNewMedTeam.trim()) {
      toast.error("Please select a team");
      return;
    }

    // Use selected designation and team
    const newMedTeamData = {
      fullname: newMedTeamForm.fullname.trim(),
      email: newMedTeamForm.email.trim(),
      phone: newMedTeamForm.phone.trim(),
      password: newMedTeamForm.password.trim(),
      designation: selectedDesignation,
      team: selectedTeamForNewMedTeam,
      teams: selectedDesignation === "MED LEADER" ? [selectedTeamForNewMedTeam] : [], // Leaders get team in teams array
    };

    setIsSubmittingMedTeam(true);
    try {
      const response = await axios.post(`${API}/createmedteam`, newMedTeamData);
      if (response.status === 201) {
        toast.success(`${selectedDesignation} ${newMedTeamForm.fullname} added to ${selectedTeamForNewMedTeam} successfully!`);
        handleCloseAddMedTeamForm();
        fetchAllData(); // Refresh the team data
      }
    } catch (error) {
      console.error("Error creating MedTeam:", error);
      toast.error(
        error.response?.data?.message || "Failed to create MedTeam member. Please try again."
      );
    } finally {
      setIsSubmittingMedTeam(false);
    }
  };

  // Filter team members: for managers, show all members from any of their managed teams
  // For MedTeam/Leader, show only their own team
  const filteredData = allData.filter((medTeam) => {
    // If user is a manager with multiple teams, filter by selected team from dropdown
    if (medTeamData && medTeamData.designation?.toUpperCase().includes("MANAGER")) {
      return medTeam.team === selectedTeam;
    }
    // For non-managers, just match by their team
    return medTeam.team === selectedTeam;
  });
  //  const handleloginteam = async (email,password) => {
  //     try {
  //       const response = await axios.post(`${API}/checkmedTeamauth`, { email, password });
  //       if (response.status === 200) {
  //       toast.success("Login successful!");
  //       const loginTime = new Date().getTime();
  //       setTimeout(() => {
  //       localStorage.setItem("medTeamId", response.data.medTeamId);
  //       localStorage.setItem("medTeamName", response.data.medTeamName);
  //       localStorage.setItem("medTeamToken", response.data.token);
  //        localStorage.setItem("sessionStartTime", loginTime);
  //        window.open("/Home", "_blank"); 
  //     }, 500);
  //     }
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Failed to verify OTP!");
  //     }
  //   };


  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const getMonth = (date, offset) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - offset);
    return newDate.toISOString().slice(0, 7);
  };

  const prevMonth1 = getMonth(today, 1);
  const prevMonth2 = getMonth(today, 2);
  const prevMonth3 = getMonth(today, 3);
  const getTeamRevenueForMonth = (month) => {
    let totalProgram = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalDefault = 0;
    let noOfPayments = 0;

    filteredData.forEach((medTeam) => {
      const monthEnrollments = medTeam.enrollments.filter(
        (item) =>
          new Date(item.createdAt).toISOString().slice(0, 7) === month
      );

      totalProgram += monthEnrollments.reduce(
        (sum, item) => sum + (item.programPrice || 0),
        0
      );

      totalPaid += monthEnrollments.reduce((sum, item) => {
        const isHalfCleared =
          Array.isArray(item.remark) &&
          item.remark[item.remark.length - 1] === "Half_Cleared";
        if (item.status === "fullPaid" || isHalfCleared) {
          return sum + (item.paidAmount || 0);
        }
        return sum;
      }, 0);

      totalPending += monthEnrollments.reduce(
        (sum, item) =>
          sum + ((item.programPrice || 0) - (item.paidAmount || 0)),
        0
      );

      totalDefault += monthEnrollments
        .filter((item) => item.status === "default")
        .reduce((sum, item) => sum + (item.paidAmount || 0), 0);

      noOfPayments += monthEnrollments.filter((item) => (item.paidAmount || 0) > 0).length;
    });

    return {
      totalProgram,
      totalPaid,
      totalPending,
      totalDefault,
      noOfPayments
    };
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {/* selected medTeam detail */}
      {detailVisible && selectedMedTeam && (
        <div className="form">
          <div className="p-2 rounded-lg mx-auto bg-white w-fit">
            <div className="flex justify-between">
              <strong>{selectedMedTeam.fullname}</strong>
              <strong
                onClick={resetData}
                className=" text-red-500 "
                style={{ cursor: "pointer" }}
              >
                EXIT
              </strong>
            </div>
            <u>Daily Revenue</u>
            <table className="medTeamrevenuetable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>No of Booked</th>
                  <th>Total Revenue</th>
                  {/* <th>Booked</th> */}
                  <th>Credited</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {dailyRevenue.length > 0 ? (
                  dailyRevenue.map((data, index) => (
                    <tr key={index}>
                      <td>{data.date}</td>
                      <td>{data.count}</td>
                      <td>₹ {data.total}</td>
                      {/* <td>₹ {data.booked}</td> */}
                      <td>₹ {data.credited}</td>
                      <td>₹ {data.total - data.credited} </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Data</td>
                  </tr>
                )}
              </tbody>
            </table>

            <u>Monthly Revenue</u>
            <table className="medTeamrevenuetable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>No of Booked</th>
                  <th>Total Revenue</th>
                  <th>Credited</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRevenue.length > 0 ? (
                  monthlyRevenue.map((data, index) => (
                    <tr key={index}>
                      <td>{data.month}</td>
                      <td>{data.count}</td>
                      <td>₹ {data.total}</td>
                      <td>₹ {data.credited}</td>
                      <td>₹ {data.total - data.credited}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
            <u>ALL Revenue</u>
            <table className="medTeamrevenuetable">
              <thead>
                <tr>
                  <th>No of Booked</th>
                  <th>Total Revenue</th>
                  <th>Credited</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {selectedMedTeam.enrollments.length > 0 ? (
                  <tr>
                    <td>{selectedMedTeam.enrollments.length}</td>
                    <td>
                      ₹{" "}
                      {selectedMedTeam.enrollments.reduce(
                        (sum, item) => sum + (item.programPrice || 0),
                        0
                      )}
                    </td>
                    <td>
                      ₹{" "}
                      {selectedMedTeam.enrollments.reduce((sum, item) => {
                        const isFullPaid = item.status === "fullPaid";
                        const hasHalfClearedRemark =
                          Array.isArray(item.remarks) &&
                          item.remarks.length > 0 &&
                          item.remarks[item.remarks.length - 1]?.toLowerCase() === "half_cleared";
                        if (isFullPaid || hasHalfClearedRemark) {
                          return sum + (item.paidAmount || 0);
                        }
                        return sum;
                      }, 0)}
                    </td>
                    <td>
                      ₹{" "}
                      {selectedMedTeam.enrollments.reduce((sum, item) => sum + (item.programPrice || 0), 0) -
                        selectedMedTeam.enrollments.reduce((sum, item) => {
                          const isFullPaid = item.status === "fullPaid";
                          const hasHalfClearedRemark =
                            Array.isArray(item.remarks) &&
                            item.remarks.length > 0 &&
                            item.remarks[item.remarks.length - 1]?.toLowerCase() === "half_cleared";
                          if (isFullPaid || hasHalfClearedRemark) {
                            return sum + (item.paidAmount || 0);
                          }
                          return sum;
                        }, 0)}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4">No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add MedTeam Member Form Modal */}
      {showAddMedTeamForm && medTeamData && (
        <div className="form">
          <form onSubmit={handleSubmitNewMedTeam}>
            <span onClick={handleCloseAddMedTeamForm} style={{ cursor: "pointer" }}>
              ✖
            </span>
            <h2>Add MedTeam Member</h2>

            <input
              type="text"
              name="fullname"
              value={newMedTeamForm.fullname}
              onChange={handleNewMedTeamInputChange}
              placeholder="Enter Full Name"
              required
              disabled={isSubmittingMedTeam}
            />

            <input
              type="email"
              name="email"
              value={newMedTeamForm.email}
              onChange={handleNewMedTeamInputChange}
              placeholder="Enter Email Address"
              required
              disabled={isSubmittingMedTeam}
            />

            <input
              type="tel"
              name="phone"
              value={newMedTeamForm.phone}
              onChange={handleNewMedTeamInputChange}
              placeholder="Enter Phone Number (Optional)"
              disabled={isSubmittingMedTeam}
            />

            <input
              type="password"
              name="password"
              value={newMedTeamForm.password}
              onChange={handleNewMedTeamInputChange}
              placeholder="Create Password (min 6 characters)"
              required
              minLength={6}
              disabled={isSubmittingMedTeam}
            />

            {/* Team Selection Dropdown */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Select Team: <span style={{ color: "red" }}>*</span>
              </label>
              <select
                value={selectedTeamForNewMedTeam}
                onChange={(e) => setSelectedTeamForNewMedTeam(e.target.value)}
                required
                disabled={isSubmittingMedTeam}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: isSubmittingMedTeam ? "#f0f0f0" : "white",
                  cursor: isSubmittingMedTeam ? "not-allowed" : "pointer",
                }}
              >
                <option value="">-- Select a Team --</option>
                {(managerTeams.length > 0 ? managerTeams : [medTeamData.team]).map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation Selection - Dropdown for Managers, Read-only for Leaders */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Designation: {medTeamData.designation?.toUpperCase().includes("MANAGER") && <span style={{ color: "red" }}>*</span>}
              </label>
              {medTeamData.designation?.toUpperCase().includes("MANAGER") ? (
                <select
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                  required
                  disabled={isSubmittingMedTeam}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    backgroundColor: isSubmittingMedTeam ? "#f0f0f0" : "white",
                    cursor: isSubmittingMedTeam ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="MED MANAGER">MED MANAGER</option>
                  <option value="MED LEADER">MED LEADER</option>
                  <option value="BOE">BOE</option>
                </select>
              ) : (
                <input
                  type="text"
                  value="BOE"
                  readOnly
                  disabled
                  style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="cursor-pointer"
                type="submit"
                value={isSubmittingMedTeam ? "Creating..." : "Create MedTeam Member"}
                disabled={isSubmittingMedTeam || !selectedTeamForNewMedTeam}
                style={{
                  flex: 1,
                  opacity: (isSubmittingMedTeam || !selectedTeamForNewMedTeam) ? 0.6 : 1,
                  cursor: (isSubmittingMedTeam || !selectedTeamForNewMedTeam) ? "not-allowed" : "pointer",
                }}
              />
              <button
                type="button"
                onClick={handleCloseAddMedTeamForm}
                className="cursor-pointer"
                disabled={isSubmittingMedTeam}
                style={{
                  flex: 1,
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "4px",
                  opacity: isSubmittingMedTeam ? 0.6 : 1,
                  cursor: isSubmittingMedTeam ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="coursetable">
        <div className="mb-2">
          {/* Team header with Add MedTeam Member button on the right */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ margin: 0 }}>{selectedTeam}</h2>

            {medTeamData && (medTeamData.designation?.toUpperCase().includes("LEADER") || medTeamData.designation?.toUpperCase().includes("MANAGER")) && (
              <button
                onClick={handleOpenAddMedTeamForm}
                className="cursor-pointer"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                + Add Member
              </button>
            )}
          </div>

          <div className="flex justify-between items-center gap-5 flex-wrap">
            <div>
              <strong>Total MedTeam: </strong>
              {filteredData.length}
            </div>

            <div>
              <strong>Total Program Price: </strong>
              {filteredData.reduce((acc, medTeam) => {
                const monthEnrollments = medTeam.enrollments.filter(
                  (item) =>
                    new Date(item.createdAt).toISOString().slice(0, 7) ===
                    currentMonth
                );
                return (
                  acc +
                  monthEnrollments.reduce(
                    (sum, item) => sum + (item.programPrice || 0),
                    0
                  )
                );
              }, 0)}
            </div>

            <div>
              <strong>Total Paid Amount: </strong>
              {filteredData.reduce((acc, medTeam) => {
                const monthEnrollments = medTeam.enrollments.filter(
                  (item) =>
                    new Date(item.createdAt).toISOString().slice(0, 7) ===
                    currentMonth &&
                    (item.status === "fullPaid" ||
                      item.remark[item.remark.length - 1] === "Half_Cleared")
                );
                return (
                  acc +
                  monthEnrollments.reduce(
                    (sum, item) => sum + (item.paidAmount || 0),
                    0
                  )
                );
              }, 0)}
            </div>

            <div>
              <strong>Total Pending Amount: </strong>
              {filteredData.reduce((acc, medTeam) => {
                const monthEnrollments = medTeam.enrollments.filter(
                  (item) =>
                    new Date(item.createdAt).toISOString().slice(0, 7) ===
                    currentMonth
                );
                return (
                  acc +
                  monthEnrollments.reduce(
                    (sum, item) =>
                      sum + ((item.programPrice || 0) - (item.paidAmount || 0)),
                    0
                  )
                );
              }, 0)}
            </div>

            <div>
              <strong>Total Default Amount: </strong>
              {filteredData.reduce((acc, medTeam) => {
                const monthEnrollments = medTeam.enrollments.filter(
                  (item) =>
                    new Date(item.createdAt).toISOString().slice(0, 7) ===
                    currentMonth && item.status === "default"
                );
                return (
                  acc +
                  monthEnrollments.reduce(
                    (sum, item) => sum + (item.paidAmount || 0),
                    0
                  )
                );
              }, 0)}
            </div>
          </div>
          <div></div>
          {/* Team selector for managers with multiple teams */}
          {medTeamData && medTeamData.designation?.toUpperCase().includes("MANAGER") && managerTeams.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <label className="font-semibold">Select Team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {managerTeams.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <table border="1">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              {/* <th>Login</th> */}
              <th>Designation</th>
              <th>Team</th>
              <th>Total</th>
              <th>Full Paid</th>
              <th>Default</th>
              <th>Send Credentials</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((medTeam, index) => (
              <tr key={index} onClick={() => console.log(medTeam)} className="hover:bg-slate-100">
                <td>{index + 1}</td>
                <td
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => selectedMedMedTeamDetail(medTeam)}
                >
                  {medTeam.fullname}
                </td>
                <td>{medTeam.email}</td>
                {/* <td className="font-bold cursor-pointer" onClick={() => handleloginteam(medTeam.email, medTeam.password)}>Login <i className="fa fa-sign-in"></i></td> */}
                <td>{medTeam.designation}</td>
                <td>{medTeam.team}</td>
                <td>{medTeam.enrollments.length}</td>
                <td>
                  {
                    medTeam.enrollments.filter((item) => item.status === "fullPaid")
                      .length
                  }
                </td>
                <td>
                  {
                    medTeam.enrollments.filter((item) => item.status === "default")
                      .length
                  }
                </td>
                <td>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSendEmail_NotUsed(medTeam)}
                    disabled={medTeam.mailSended}
                  >
                    {medTeam.mailSended ? (
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
        <div>
          {selectedTeam &&
            (() => {
              const team = getteamName.find((t) => t.teamname === selectedTeam);
              const latestTargetObj = team?.target?.[team.target.length - 1];

              if (!latestTargetObj) {
                return (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "10px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <h3>Target Summary - {selectedTeam}</h3>
                    <p>
                      <strong>Target:</strong> Not assigned yet
                    </p>
                  </div>
                );
              }
              const lastTarget = parseInt(latestTargetObj.targetValue, 10);
              const currentMonth = new Date().toISOString().slice(0, 7);
              const enrollmentsThisMonth = filteredData
                .flatMap((medTeam) => medTeam.enrollments)
                .filter((enroll) => {
                  const enrollMonth = new Date(enroll.createdAt)
                    .toISOString()
                    .slice(0, 7);
                  const isHalfCleared =
                    Array.isArray(enroll.remark) &&
                    enroll.remark[enroll.remark.length - 1] === "Half_Cleared";
                  return (
                    enrollMonth === currentMonth &&
                    (enroll.status === "fullPaid" || isHalfCleared)
                  );
                });
              const achievedTarget = enrollmentsThisMonth.reduce(
                (sum, enroll) => sum + (enroll.paidAmount || 0),
                0
              );
              const pendingTarget = lastTarget - achievedTarget;
              const allPaymentsThisMonth = filteredData
                .flatMap((medTeam) => medTeam.enrollments)
                .filter((enroll) => {
                  const enrollMonth = new Date(enroll.createdAt).toISOString().slice(0, 7);
                  return enrollMonth === currentMonth;
                });

              const assignedPaymentNumber = latestTargetObj.payments;
              const actualPayments = allPaymentsThisMonth.length;
              return (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <h3>Target Summary - {selectedTeam}</h3>
                  <p>
                    <strong>🎯Target:</strong> ₹ {lastTarget.toLocaleString()}
                  </p>
                  <p>
                    <strong>✅Achieved:</strong> ₹{" "}
                    {achievedTarget.toLocaleString()}
                  </p>
                  <p>
                    <strong>⏳Pending:</strong> ₹ {pendingTarget.toLocaleString()}
                  </p>
                  <p>📅 No Of Payments : {assignedPaymentNumber}</p>
                  <p>💰 Payments Received: {actualPayments}</p>
                </div>
              );
            })()}
        </div>
        <div className="flex flex-col">
          <h3>📊 Previous Month Revenue Summary</h3>
          <table className="medTeamrevenuetable">
            <thead>
              <tr>
                <th>Month</th>
                <th>No. of Payments</th>
                <th>Total Program Price</th>
                <th>Total Paid Amount</th>
                <th>Total Pending Amount</th>
                <th>Total Default Amount</th>
              </tr>
            </thead>
            <tbody>
              {[prevMonth1, prevMonth2, prevMonth3].map((month) => {
                const revenue = getTeamRevenueForMonth(month);
                return (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>{revenue.noOfPayments}</td>
                    <td>₹ {revenue.totalProgram.toLocaleString()}</td>
                    <td>₹ {revenue.totalPaid.toLocaleString()}</td>
                    <td>₹ {revenue.totalPending.toLocaleString()}</td>
                    <td>₹ {revenue.totalDefault.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedTeamDetail;

