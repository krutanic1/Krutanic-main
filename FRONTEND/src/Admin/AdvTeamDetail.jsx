import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";


const AdvTeamDetail = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [allData, setAllData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const [advTeamEmailMap, setAdvTeamEmailMap] = useState({});

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const normalizeRole = (role = "") => {
    const value = String(role).trim().toLowerCase();
    if (value === "adv manager") return "manager";
    if (value === "adv leader") return "leader";
    if (value === "sr inside sales specialist") return "sr_inside_sales_specialist";
    if (value === "inside sales specialist") return "inside_sales_specialist";
    return value;
  };

  const fetchAllData = async () => {
    try {
      const [crmRes, legacyRes] = await Promise.allSettled([
        axios.get(`${API}/api/admin/agents`, { withCredentials: true }),
        axios.get(`${API}/getadvteam`, { withCredentials: true }),
      ]);

      const crmUsers = crmRes.status === "fulfilled" && Array.isArray(crmRes.value.data)
        ? crmRes.value.data
        : [];
      const legacyUsers = legacyRes.status === "fulfilled" && Array.isArray(legacyRes.value.data)
        ? legacyRes.value.data
        : [];

      const legacyByEmail = {};
      legacyUsers.forEach((user) => {
        const emailKey = String(user.email || "").toLowerCase();
        if (!emailKey) return;
        legacyByEmail[emailKey] = user;
      });
      setAdvTeamEmailMap(legacyByEmail);

      let normalizedUsers = [];

      if (crmUsers.length > 0) {
        normalizedUsers = crmUsers.map((user) => {
          const emailKey = String(user.email || "").toLowerCase();
          const legacyMatch = legacyByEmail[emailKey];

          return {
            ...user,
            name: user.name || user.fullname || legacyMatch?.fullname || "",
            email: user.email || legacyMatch?.email || "",
            role: normalizeRole(user.role || user.designation || legacyMatch?.designation),
            status: user.status || legacyMatch?.status || "Active",
            // Force legacy team fallback when CRM team is missing
            team: user.team || legacyMatch?.team || "",
            teams: user.teams || legacyMatch?.teams || [],
          };
        });
      } else {
        normalizedUsers = legacyUsers.map((user) => ({
          _id: user._id,
          name: user.fullname || user.name || "",
          email: user.email || "",
          role: normalizeRole(user.designation || user.role),
          status: user.status || "Active",
          team: user.team || "",
          teams: user.teams || [],
          team_id: null,
        }));
      }

      const activeAgents = normalizedUsers.filter((user) => user.status !== "Inactive");
      setAllData(activeAgents);
      console.log("Active Agents:", activeAgents);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  const fetchTeamNames = async () => {
    try {
      const [newTeamsRes, legacyTeamNamesRes] = await Promise.allSettled([
        axios.get(`${API}/api/adv-teams/get-all-teams`, { withCredentials: true }),
        axios.get(`${API}/getadvteamname`, { withCredentials: true }),
      ]);

      const newTeams = newTeamsRes.status === "fulfilled" && Array.isArray(newTeamsRes.value.data)
        ? newTeamsRes.value.data
        : [];
      const legacyNames = legacyTeamNamesRes.status === "fulfilled" && Array.isArray(legacyTeamNamesRes.value.data)
        ? legacyTeamNamesRes.value.data
        : [];

      const mergedTeamNames = [
        ...newTeams.map((team) => team.team_name || team.team).filter(Boolean),
        ...legacyNames.map((team) => team.teamname || team.team_name || team.team).filter(Boolean),
      ];

      const uniqueTeamObjects = Array.from(new Set(mergedTeamNames)).map((name) => ({ team_name: name }));
      setTeamNames(uniqueTeamObjects);
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

  const getTeamNameById = (teamId) => {
    if (!teamId) return "";
    const match = teamNames.find((team) => String(team._id || "") === String(teamId));
    return match?.team_name || match?.team || "";
  };

  const getAgentTeamName = (agent) => {
    if (!agent) return "N/A";

    if (agent.team_id?.team_name) return agent.team_id.team_name;

    const teamId = agent.team_id?._id || agent.team_id;
    if (teamId) {
      const mappedName = getTeamNameById(teamId);
      if (mappedName) return mappedName;
    }

    if (agent.team) return agent.team;
    if (agent.team_name) return agent.team_name;
    if (Array.isArray(agent.teams) && agent.teams.length > 0) return agent.teams.join(", ");

    const emailKey = String(agent.email || "").toLowerCase();
    const legacyMatch = advTeamEmailMap[emailKey];
    if (legacyMatch?.team) return legacyMatch.team;
    if (Array.isArray(legacyMatch?.teams) && legacyMatch.teams.length > 0) {
      return legacyMatch.teams.join(", ");
    }

    return "N/A";
  };

  const availableTeamOptions = Array.from(
    new Set(
      teamNames
        .map((team) => team.team_name || team.team)
        .concat(allData.map((agent) => getAgentTeamName(agent)))
        .filter((name) => name && name !== "N/A")
    )
  );

  const filteredData = selectedTeam
    ? allData.filter((agent) => {
        return String(getAgentTeamName(agent)).split(",").map((t) => t.trim()).includes(selectedTeam);
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
      const teamList = String(getAgentTeamName(agent))
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);

      if (teamList.length === 0) teamList.push("N/A");

      teamList.forEach((teamName) => {
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
        team: getAgentTeamName(agent),
        status: agent.status || "Active",
      }));
  };

  const getTop3ByRoles = (roles) => {
    const normalizedRoles = new Set(roles.map((role) => role.toLowerCase()));

    return allData
      .filter((agent) => normalizedRoles.has((agent.role || "").toLowerCase()))
      .slice(0, 3)
      .map((agent) => ({
        name: agent.name,
        email: agent.email,
        team: getAgentTeamName(agent),
      }));
  };

  return (
    <>
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
        <div className="mb-5">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h2 className="mb-1">Advance Team Details</h2>
              <p className="text-sm text-slate-600">
                Team Performance Snapshot
                {selectedTeam ? ` - ${selectedTeam}` : " - All Teams"}
              </p>
            </div>

            <select
              className="min-w-[220px] rounded-md border border-slate-300 px-3 py-2 bg-white"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="">All Teams</option>
              {availableTeamOptions.map((teamName, index) => (
                <option key={index} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="rounded-md border bg-white p-3">
              <p className="text-xs uppercase text-slate-500">Total Agents</p>
              <p className="text-2xl font-semibold text-slate-900">{filteredData.length}</p>
            </div>
            <div className="rounded-md border bg-white p-3">
              <p className="text-xs uppercase text-slate-500">Active Teams</p>
              <p className="text-2xl font-semibold text-slate-900">{teamNames.length}</p>
            </div>
            <div className="rounded-md border bg-white p-3">
              <p className="text-xs uppercase text-slate-500">Top Managers Shown</p>
              <p className="text-2xl font-semibold text-slate-900">{Math.min(getTop3Managers().length, 3)}</p>
            </div>
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-700 mb-2">Leaderboard</h3>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 my-6">
          <div className="border rounded-md p-3 bg-white overflow-x-auto">
            <h3 className="text-lg font-bold mb-2">🏆 Top 3 Teams</h3>
            <table className="bdarevenuetable w-full" border="1">
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
          <div className="border rounded-md p-3 bg-white overflow-x-auto">
            <h3 className="text-lg font-bold mb-2">⭐ Top 3 Managers</h3>
            <table className="bdarevenuetable w-full" border="1">
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

        <h3 className="text-base font-semibold text-slate-700 mb-2">Role Highlights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-6">
          {[
            {
              title: "Top 3 Leaders",
              icon: "👑",
              roles: ["leader", "adv_leader"],
              emptyLabel: "No Leaders",
            },
            {
              title: "Top 3 Inside Sales Specialists",
              icon: "📞",
              roles: ["inside_sales_specialist", "inside sales specialist"],
              emptyLabel: "No Inside Sales Specialists",
            },
            {
              title: "Top 3 SR Inside Sales Specialists",
              icon: "⭐",
              roles: ["sr_inside_sales_specialist", "sr inside sales specialist"],
              emptyLabel: "No SR Specialists",
            },
          ].map((roleConfig) => {
            const roleData = getTop3ByRoles(roleConfig.roles);

            return (
              <div key={roleConfig.title} className="border rounded-md p-3 bg-white overflow-x-auto">
                <h3 className="text-lg font-bold mb-2">{roleConfig.icon} {roleConfig.title}</h3>
                <table className="bdarevenuetable w-full" border="1">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleData.length > 0 ? (
                      roleData.map((agent, index) => (
                        <tr key={index}>
                          <td>#{index + 1}</td>
                          <td>{agent.name}</td>
                          <td>{agent.email}</td>
                          <td>{agent.team}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">{roleConfig.emptyLabel}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <h3 className="text-base font-semibold text-slate-700 mb-2">All Agents</h3>
        <div className="overflow-x-auto rounded-md border">
        <table className="w-full" border="1">
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
                <td>{getAgentTeamName(agent)}</td>
                <td>{agent.status || "Active"}</td>
                <td>
                  <button
                    className="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50"
                    onClick={() => selectedAgentDetail(agent)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdvTeamDetail;
