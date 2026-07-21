import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const TeamAnalysis = () => {
  const [loading, setLoading] = useState(true);
  const [teamMetrics, setTeamMetrics] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  
  const today = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const [selectedMonth, setSelectedMonth] = useState(months[today.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString());
  
  const years = Array.from(new Array(5), (val, index) => (today.getFullYear() - 3 + index).toString());

  const fetchTeamData = async () => {
    setLoading(true);
    const bdaId = localStorage.getItem("bdaId");
    const bdaName = localStorage.getItem("bdaName");

    try {
      if (!bdaId) {
        toast.error("Manager ID not found");
        return;
      }

      const managerRes = await axios.get(`${API}/getbda`, { params: { bdaId } });
      const manager = managerRes.data;

      if (!manager || (manager.designation !== "MANAGER" && manager.designation !== "LEADER")) {
        toast.error("Unauthorized: Only Managers and Leaders can view Team Analysis.");
        setLoading(false);
        return;
      }

      const teamsArray = manager.teams && manager.teams.length > 0
        ? manager.teams
        : manager.team ? manager.team.split(",").map(t => t.trim()) : [];

      const allBdasRes = await axios.get(`${API}/getbda`);
      const teamMembers = allBdasRes.data.filter(b => teamsArray.includes(b.team));
      
      const memberNames = [bdaName.toLowerCase()];
      teamMembers.forEach(b => {
        if (b.fullname && !memberNames.includes(b.fullname.toLowerCase())) {
          memberNames.push(b.fullname.toLowerCase());
        }
      });

      const counselorStr = memberNames.join('|');
      const enrollRes = await axios.get(`${API}/getnewstudentenroll`, {
        params: {
          all: "true",
          month: selectedMonth,
          year: selectedYear,
          counselor: counselorStr
        }
      });

      const enrollments = enrollRes.data;

      const metricsMap = {};
      memberNames.forEach(name => {
        const displayName = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        metricsMap[name] = {
          name: displayName,
          totalRevenue: 0,
          bookedCount: 0,
          fullyPaidCount: 0,
          defaultCount: 0,
          pendingAmount: 0
        };
      });

      enrollments.forEach(enroll => {
        if (!enroll.counselor) return;
        const cName = enroll.counselor.toLowerCase();
        
        if (metricsMap[cName]) {
          const paidAmount = Number(enroll.paidAmount) || 0;
          const programPrice = Number(enroll.programPrice) || 0;
          
          metricsMap[cName].totalRevenue += paidAmount;

          if (enroll.status === "fullPaid") {
            metricsMap[cName].fullyPaidCount += 1;
          } else if (enroll.status === "booked") {
            metricsMap[cName].bookedCount += 1;
            metricsMap[cName].pendingAmount += (programPrice - paidAmount);
          } else if (enroll.status === "default") {
            metricsMap[cName].defaultCount += 1;
          }
        }
      });

      const aggregatedMetrics = Object.values(metricsMap)
        .filter(m => m.totalRevenue > 0 || m.bookedCount > 0 || m.fullyPaidCount > 0 || m.defaultCount > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);
      setTeamMetrics(aggregatedMetrics);
      setAllEnrollments(enrollments);
      
    } catch (error) {
      console.error("Error fetching team analysis data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [selectedMonth, selectedYear]);

  const handleBarClick = (data, status) => {
    const memberData = data.activePayload ? data.activePayload[0].payload : (data.payload || data);
    if (!memberData || !memberData.name) return;
    
    const statusMap = {
      bookedCount: "booked",
      fullyPaidCount: "fullPaid",
      defaultCount: "default"
    };
    
    const dbStatus = statusMap[status];
    if (!dbStatus) return;

    const filteredLeads = allEnrollments.filter(e => 
      e.counselor && 
      e.counselor.toLowerCase() === memberData.name.toLowerCase() && 
      e.status === dbStatus
    );

    setSelectedLeads(filteredLeads);
    setModalTitle(`${status === 'bookedCount' ? 'Booked' : status === 'fullyPaidCount' ? 'Fully Paid' : 'Defaulted'} Leads for ${memberData.name}`);
    setIsModalOpen(true);
  };

  return (
    <div id="AdminDashboard" className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team Analysis</h1>
          <p className="text-gray-500">Graphical overview of your team's performance</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white shadow-sm"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border px-4 py-2 rounded-lg bg-white shadow-sm"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div id="loader" className="flex justify-center items-center h-[50vh]">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Generated Revenue (Paid Amount)</h2>
            <div className="h-[450px] w-full">
              {teamMetrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="totalRevenue" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">No data for selected period</div>
              )}
            </div>
          </div>

          {/* Booked vs Full Paid Counts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Enrollment Conversions</h2>
            <div className="h-[450px] w-full">
              {teamMetrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar dataKey="bookedCount" stackId="a" name="Booked" fill="#F59E0B" radius={[0, 0, 0, 0]} maxBarSize={60} onClick={(data) => handleBarClick(data, 'bookedCount')} style={{ cursor: 'pointer' }} />
                    <Bar dataKey="fullyPaidCount" stackId="a" name="Fully Paid" fill="#10B981" radius={[0, 0, 0, 0]} maxBarSize={60} onClick={(data) => handleBarClick(data, 'fullyPaidCount')} style={{ cursor: 'pointer' }} />
                    <Bar dataKey="defaultCount" stackId="a" name="Defaulted" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={60} onClick={(data) => handleBarClick(data, 'defaultCount')} style={{ cursor: 'pointer' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">No data for selected period</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Leads Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 max-w-5xl rounded-xl shadow-lg flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">{modalTitle} ({selectedLeads.length})</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 font-bold text-3xl leading-none">
                &times;
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              {selectedLeads.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border font-semibold">Name</th>
                      <th className="p-3 border font-semibold">Email</th>
                      <th className="p-3 border font-semibold">Program</th>
                      <th className="p-3 border font-semibold whitespace-nowrap">Total Price</th>
                      <th className="p-3 border font-semibold whitespace-nowrap">Paid Amount</th>
                      <th className="p-3 border font-semibold min-w-[250px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLeads.map((lead, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 border text-sm font-medium text-gray-800">{lead.fullname}</td>
                        <td className="p-3 border text-sm text-gray-600">{lead.email}</td>
                        <td className="p-3 border text-sm text-gray-600">{lead.program}</td>
                        <td className="p-3 border text-sm font-semibold text-gray-700">₹{lead.programPrice || 0}</td>
                        <td className="p-3 border text-sm font-semibold text-green-600">₹{lead.paidAmount}</td>
                        <td className="p-3 border text-sm text-gray-600">
                          {lead.remark && (Array.isArray(lead.remark) ? lead.remark.length > 0 : true) ? (
                            <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-2">
                              {Array.isArray(lead.remark) ? (
                                lead.remark.slice().reverse().map((r, i) => (
                                  <div key={i} className="text-sm p-1.5 bg-gray-100 rounded text-gray-800 break-words whitespace-pre-wrap border border-gray-200">
                                    {r}
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm p-1.5 bg-gray-100 rounded text-gray-800 break-words whitespace-pre-wrap border border-gray-200">
                                  {lead.remark}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No remarks</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No leads found for this selection.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAnalysis;
