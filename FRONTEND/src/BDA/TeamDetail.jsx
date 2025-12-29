import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const TeamDetail = () => {
  const bdaId = localStorage.getItem("bdaId");
  const [detailVisible, setDetailVisible] = useState(false);
  const [bdaData, setBdaData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [managerTeams, setManagerTeams] = useState([]); // Array of teams for managers
  const [selectedBda, setSelectedBda] = useState(null);
  const [getteamName, setGetTeamName] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchBdaData = async () => {
      if (!bdaId) {
        console.warn("Team user not logged in");
        return;
      }
      try {
        const response = await axios.get(`${API}/getbda`, {
          params: { bdaId },
        });
        setBdaData(response.data);
        // For managers, use teams array if available, otherwise parse from team string
        if (response.data.designation === "MANAGER") {
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
        console.log("Failed to fetch bda data");
      }
    };

    fetchBdaData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await axios.get(`${API}/bda-with-enrolls`);
      setAllData(response.data);
      console.log("All Data:", response.data);
    } catch (error) {
      console.error("There was an error fetching all Data:", error);
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
  const selectedBdaDetail = (bda) => {
    setSelectedBda(bda);
    setDetailVisible(true);
    setDailyRevenue(groupByDate(bda.enrollments));
    setMonthlyRevenue(groupByMonth(bda.enrollments));
  };
  const resetData = () => {
    setSelectedBda(null);
    setDetailVisible(false);
  };

  // Filter team members: for managers, show all members from any of their managed teams
  // For BDA/Leader, show only their own team
  const filteredData = allData.filter((bda) => {
    // If user is a manager with multiple teams, filter by selected team from dropdown
    if (bdaData && bdaData.designation === "MANAGER") {
      return bda.team === selectedTeam;
    }
    // For non-managers, just match by their team
    return bda.team === selectedTeam;
  });
  //  const handleloginteam = async (email,password) => {
  //     try {
  //       const response = await axios.post(`${API}/checkbdaauth`, { email, password });
  //       if (response.status === 200) {
  //       toast.success("Login successful!");
  //       const loginTime = new Date().getTime();
  //       setTimeout(() => {
  //       localStorage.setItem("bdaId", response.data.bdaId);
  //       localStorage.setItem("bdaName", response.data.bdaName);
  //       localStorage.setItem("bdaToken", response.data.token);
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
    
      filteredData.forEach((bda) => {
        const monthEnrollments = bda.enrollments.filter(
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
      {/* selected bda detail */}
      {detailVisible && selectedBda && (
        <div className="form">
          <div className="p-2 rounded-lg mx-auto bg-white w-fit">
            <div className="flex justify-between">
              <strong>{selectedBda.fullname}</strong>
              <strong
                onClick={resetData}
                className=" text-red-500 "
                style={{ cursor: "pointer" }}
              >
                EXIT
              </strong>
            </div>
            <u>Daily Revenue</u>
            <table className="bdarevenuetable">
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
            <table className="bdarevenuetable">
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
            <table className="bdarevenuetable">
              <thead>
                <tr>
                  <th>No of Booked</th>
                  <th>Total Revenue</th>
                  <th>Credited</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {selectedBda.enrollments.length > 0 ? (
                  <tr>
                    <td>{selectedBda.enrollments.length}</td>
                    <td>
                      ₹{" "}
                      {selectedBda.enrollments.reduce(
                        (sum, item) => sum + (item.programPrice || 0),
                        0
                      )}
                    </td>
                    <td>
          ₹{" "}
          {selectedBda.enrollments.reduce((sum, item) => {
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
          {selectedBda.enrollments.reduce((sum, item) => sum + (item.programPrice || 0), 0) -
            selectedBda.enrollments.reduce((sum, item) => {
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

      <div className="coursetable">
        <div className="mb-2">
          <h2>{selectedTeam} </h2>
           
             <div className="flex justify-between items-center gap-5 flex-wrap">
            <div>
              <strong>Total BDA: </strong>
              {filteredData.length}
            </div>

            <div>
              <strong>Total Program Price: </strong>
              {filteredData.reduce((acc, bda) => {
                const monthEnrollments = bda.enrollments.filter(
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
              {filteredData.reduce((acc, bda) => {
                const monthEnrollments = bda.enrollments.filter(
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
              {filteredData.reduce((acc, bda) => {
                const monthEnrollments = bda.enrollments.filter(
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
              {filteredData.reduce((acc, bda) => {
                const monthEnrollments = bda.enrollments.filter(
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
          {bdaData && bdaData.designation === "MANAGER" && managerTeams.length > 1 && (
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
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bda, index) => (
              <tr key={index} onClick={()=> console.log(bda)} className="hover:bg-slate-100">
                <td>{index + 1}</td>
                <td
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => selectedBdaDetail(bda)}
                >
                  {bda.fullname}
                </td>
                <td>{bda.email}</td>
                {/* <td className="font-bold cursor-pointer" onClick={() => handleloginteam(bda.email, bda.password)}>Login <i className="fa fa-sign-in"></i></td> */}
                <td>{bda.designation}</td>
                <td>{bda.team}</td>
                <td>{bda.enrollments.length}</td>
                <td>
                  {
                    bda.enrollments.filter((item) => item.status === "fullPaid")
                      .length
                  }
                </td>
                <td>
                  {
                    bda.enrollments.filter((item) => item.status === "default")
                      .length
                  }
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
                .flatMap((bda) => bda.enrollments)
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
        .flatMap((bda) => bda.enrollments)
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
  <table className="bdarevenuetable">
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

export default TeamDetail;