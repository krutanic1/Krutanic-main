import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import AdminHeader from "./AdminHeader";

const AdvTeamDetail = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [allData, setAllData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [teamNames, setTeamNames] = useState([]);

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const fetchAllData = async () => {
    try {
      // Fetch all advance users
      const response = await axios.get(`${API}/adv-admin/users`, { withCredentials: true });
      const users = response.data || [];
      
      // Filter to show only active agents
      const activeAgents = users.filter(user => user.status !== "Inactive");
      setAllData(activeAgents);
      console.log("Active Agents:", activeAgents);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  const fetchTeamNames = async () => {
    try {
      // Fetch all teams from AdvTeamStructure
      const response = await axios.get(`${API}/adv-team/get-all-teams`, { withCredentials: true });
      const teams = response.data || [];
      setTeamNames(teams);
    } catch (error) {
      console.error("Error fetching team names:", error);
    }
  };

  const fetchAgentEnrollments = async (email) => {
    try {
      // Fetch all advance enrollments
      const response = await axios.get(`${API}/getadvenrolls`, { withCredentials: true });
      const enrollments = response.data.data || response.data || [];
      
      // Filter enrollments by agent email (counselor field)
      const agentEnrollments = enrollments.filter(enroll => enroll.counselor === email);
      return agentEnrollments;
    } catch (error) {
      console.error("Error fetching agent enrollments:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchTeamNames();
  }, []);

  // Function to group enrollments by date (last 10 days)
  const groupByDate = (enrollments) => {
    const result = {};
    const today = new Date();
    const last10Days = new Date();
    last10Days.setDate(today.getDate() - 9);

    enrollments.forEach((item) => {
      const date = new Date(item.createdAt).toISOString().split("T")[0];
      const itemDate = new Date(date);

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

  // Function to group enrollments by month
  const groupByMonth = (enrollments) => {
    const result = {};

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
      const month = new Date(item.createdAt).toISOString().slice(0, 7);
      const status = item.status;

      if ([currentMonth, prevMonth1, prevMonth2, prevMonth3].includes(month)) {
        if (!result[month]) {
          result[month] = { count: 0, total: 0, credited: 0 };
        }
        result[month].count++;
        result[month].total += item.programPrice || 0;
        if (
          status === "fullPaid" ||
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

  const selectedAgentDetail = async (agent) => {
    const enrollments = await fetchAgentEnrollments(agent.email);
    setSelectedAgent({ ...agent, enrollments });
    setDetailVisible(true);
    setDailyRevenue(groupByDate(enrollments));
    setMonthlyRevenue(groupByMonth(enrollments));
  };

  const resetData = () => {
    setSelectedAgent(null);
    setDetailVisible(false);
  };

  const filteredData = selectedTeam
    ? allData.filter((agent) => {
        const teamId = agent.team_id?._id || agent.team_id;
        const selectedTeamId = teamNames.find(t => t.team_name === selectedTeam)?._id;
        return teamId === selectedTeamId;
      })
    : allData;

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

    // This would require fetching enrollments for all agents in the team
    // For now, returning placeholder
    return {
      totalProgram,
      totalPaid,
      totalPending,
      totalDefault,
      noOfPayments,
    };
  };

  const getTop3Teams = () => {
    const teamRevenue = {};

    allData.forEach((agent) => {
      const teamName = agent.team_id?.team_name || "Unknown";
      if (!teamRevenue[teamName]) {
        teamRevenue[teamName] = {
          team: teamName,
          totalRevenue: 0,
          creditedRevenue: 0,
          agentCount: 0,
        };
      }
      teamRevenue[teamName].agentCount++;
    });

    return Object.values(teamRevenue)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 3);
  };

  const getTop3Managers = () => {
    return allData
      .filter((agent) => agent.role === "manager")
      .slice(0, 3)
      .map((agent) => ({
        name: agent.name,
        email: agent.email,
        role: agent.role,
        team: agent.team_id?.team_name || "N/A",
        status: agent.status || "Active",
      }));
  };

  const getTop3ForRoles = (roles) => {
    const roleSet = new Set(roles.map((role) => role.toLowerCase()));

    return allData
      .filter((agent) => roleSet.has((agent.role || "").toLowerCase()))
      .slice(0, 3)
      .map((agent) => ({
        name: agent.name,
        email: agent.email,
        team: agent.team_id?.team_name || "N/A",
        status: agent.status || "Active",
      }));
  };

  return (
    <>
      <AdminHeader />
      <div id="AdminAddCourse">
      {/* Selected agent detail */}
      {detailVisible && selectedAgent && (
        <div className="form">
          <div className="p-2 rounded-lg mx-auto bg-white w-fit">
            <div className="flex justify-between">
              <strong>{selectedAgent.name}</strong>
              <strong
                onClick={resetData}
                className="text-red-500"
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
                {selectedAgent.enrollments.length > 0 ? (
                  <tr>
                    <td>{selectedAgent.enrollments.length}</td>
                    <td>
                      ₹{" "}
                      {selectedAgent.enrollments.reduce(
                        (sum, item) => sum + (item.programPrice || 0),
                        0
                      )}
                    </td>
                    <td>
                      ₹{" "}
                      {selectedAgent.enrollments.reduce((sum, item) => {
                        const isFullPaid = item.status === "fullPaid";
                        const hasHalfClearedRemark =
                          Array.isArray(item.remark) &&
                          item.remark.length > 0 &&
                          item.remark[item.remark.length - 1] === "Half_Cleared";
                        if (isFullPaid || hasHalfClearedRemark) {
                          return sum + (item.paidAmount || 0);
                        }
                        return sum;
                      }, 0)}
                    </td>
                    <td>
                      ₹{" "}
                      {selectedAgent.enrollments.reduce(
                        (sum, item) => sum + (item.programPrice || 0),
                        0
                      ) -
                        selectedAgent.enrollments.reduce((sum, item) => {
                          const isFullPaid = item.status === "fullPaid";
                          const hasHalfClearedRemark =
                            Array.isArray(item.remark) &&
                            item.remark.length > 0 &&
                            item.remark[item.remark.length - 1] === "Half_Cleared";
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
        <h2>Advance Team Details</h2>
        <h2>{selectedTeam}</h2>
        <div className="mb-2">
          <div className="flex justify-between items-center gap-5 flex-wrap">
            <div>
              <strong>Total Agents: </strong>
              {filteredData.length}
            </div>
          </div>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">All Teams</option>
            {teamNames.map((team, index) => (
              <option key={index} value={team.team_name}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>

        {/* Top 3 Teams */}
        <div className="flex gap-4 my-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">🏆 Top 3 Teams</h3>
            <table className="bdarevenuetable" border="1">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team Name</th>
                  <th>Agent Count</th>
                </tr>
              </thead>
              <tbody>
                {getTop3Teams().map((team, index) => (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>{team.team}</td>
                    <td>{team.agentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top 3 Managers */}
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">⭐ Top 3 Managers</h3>
            <table className="bdarevenuetable" border="1">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {getTop3Managers().length > 0 ? (
                  getTop3Managers().map((manager, index) => (
                    <tr key={index}>
                      <td>#{index + 1}</td>
                      <td>{manager.name}</td>
                      <td>{manager.email}</td>
                      <td>{manager.team}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No Managers</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 3 for Specific Roles */}
        <div className="my-6">
          <h3 className="text-lg font-bold mb-4">👥 Top 3 for Each Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "ADV Manager",
                roles: ["manager", "adv_manager"],
              },
              {
                title: "ADV Leader",
                roles: ["leader", "adv_leader"],
              },
              {
                title: "Inside Sales Specialist",
                roles: ["inside_sales_specialist", "inside sales specialist"],
              },
              {
                title: "SR Inside Sales Specialist",
                roles: ["sr_inside_sales_specialist", "sr inside sales specialist"],
              },
            ].map((roleConfig) => {
              const topAgents = getTop3ForRoles(roleConfig.roles);

              return (
                <div key={roleConfig.title} className="border p-4 rounded">
                  <h4 className="font-bold mb-2">{roleConfig.title}</h4>
                  <table className="bdarevenuetable w-full border-collapse text-sm" border="1">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAgents.length > 0 ? (
                      topAgents.map((agent, index) => (
                        <tr key={index}>
                          <td>#{index + 1}</td>
                          <td>{agent.name}</td>
                          <td>{agent.team}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No Data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              );
            })}
          </div>
        </div>

        <table border="1">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Team</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((agent, index) => (
              <tr key={index} className="hover:bg-slate-100">
                <td>{index + 1}</td>
                <td
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => selectedAgentDetail(agent)}
                >
                  {agent.name}
                </td>
                <td>{agent.email}</td>
                <td>{agent.role}</td>
                <td>{agent.team_id?.team_name || "N/A"}</td>
                <td>{agent.status || "Active"}</td>
                <td>
                  <button onClick={() => selectedAgentDetail(agent)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdvTeamDetail;
