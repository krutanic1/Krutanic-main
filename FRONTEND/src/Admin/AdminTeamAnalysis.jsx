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

const AdminTeamAnalysis = () => {
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
  const [selectedManager, setSelectedManager] = useState("all");
  const [managers, setManagers] = useState([]);
  const [allBdas, setAllBdas] = useState([]);
  
  const years = Array.from(new Array(5), (val, index) => (today.getFullYear() - 3 + index).toString());

  useEffect(() => {
    // Initial fetch for managers
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`${API}/getbda`);
        const bdas = res.data;
        setAllBdas(bdas);
        
        const mgrs = bdas.filter(b => b.designation === "MANAGER" || b.designation === "LEADER");
        setManagers(mgrs);
      } catch (err) {
        console.error("Error fetching BDAs", err);
        toast.error("Failed to load managers list");
      }
    };
    fetchInitialData();
  }, []);

  const fetchTeamData = async () => {
    if (managers.length === 0 || allBdas.length === 0) return;
    
    setLoading(true);
    try {
      let bdaToManager = {};
      let memberNames = [];
      let metricsMap = {};

      if (selectedManager === "all") {
        // Build map of BDA -> Manager
        managers.forEach(mgr => {
          const mgrName = mgr.fullname.toLowerCase();
          const teams = mgr.teams?.length > 0 ? mgr.teams : (mgr.team ? mgr.team.split(",").map(t => t.trim()) : []);
          
          teams.forEach(t => {
            allBdas.filter(b => b.team === t).forEach(b => {
              if (b.fullname) {
                bdaToManager[b.fullname.toLowerCase()] = mgrName;
              }
            });
          });
          bdaToManager[mgrName] = mgrName; // Manager belongs to themselves
          
          if (!memberNames.includes(mgrName)) {
            memberNames.push(mgrName);
          }
        });
      } else {
        // Specific Manager Selected
        const mgr = managers.find(m => m._id === selectedManager);
        if (mgr) {
          const teams = mgr.teams?.length > 0 ? mgr.teams : (mgr.team ? mgr.team.split(",").map(t => t.trim()) : []);
          const teamMembers = allBdas.filter(b => teams.includes(b.team));
          
          memberNames.push(mgr.fullname.toLowerCase());
          teamMembers.forEach(b => {
            if (b.fullname && !memberNames.includes(b.fullname.toLowerCase())) {
              memberNames.push(b.fullname.toLowerCase());
            }
          });
        }
      }

      // Initialize metricsMap
      memberNames.forEach(name => {
        const displayName = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        metricsMap[name] = {
          name: displayName,
          totalRevenue: 0,
          bookedCount: 0,
          fullyPaidCount: 0,
          defaultCount: 0,
          pendingAmount: 0,
          originalName: name
        };
      });

      // We need to fetch ALL enrollments for the month/year to filter client-side, 
      // or we can pass counselors to the backend if it's a specific manager
      const queryParams = {
        all: "true",
        month: selectedMonth,
        year: selectedYear
      };
      
      if (selectedManager !== "all") {
        queryParams.counselor = memberNames.join('|');
      }

      const enrollRes = await axios.get(`${API}/getnewstudentenroll`, { params: queryParams });
      const enrollments = enrollRes.data;
      setAllEnrollments(enrollments);

      enrollments.forEach(enroll => {
        if (!enroll.counselor) return;
        const cName = enroll.counselor.toLowerCase();
        
        let targetKey = cName;
        
        if (selectedManager === "all") {
          targetKey = bdaToManager[cName];
          if (!targetKey) return; // Skip if this BDA is not under any manager
        }
        
        if (metricsMap[targetKey]) {
          const paidAmount = Number(enroll.paidAmount) || 0;
          const programPrice = Number(enroll.programPrice) || 0;
          
          metricsMap[targetKey].totalRevenue += paidAmount;

          if (enroll.status === "fullPaid") {
            metricsMap[targetKey].fullyPaidCount += 1;
          } else if (enroll.status === "booked") {
            metricsMap[targetKey].bookedCount += 1;
            metricsMap[targetKey].pendingAmount += (programPrice - paidAmount);
          } else if (enroll.status === "default") {
            metricsMap[targetKey].defaultCount += 1;
          }
        }
      });

      const aggregatedMetrics = Object.values(metricsMap)
        .filter(m => m.totalRevenue > 0 || m.bookedCount > 0 || m.fullyPaidCount > 0 || m.defaultCount > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);
      
      setTeamMetrics(aggregatedMetrics);
      
    } catch (error) {
      console.error("Error fetching admin team analysis data:", error);
      toast.error("Failed to load analysis data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [selectedMonth, selectedYear, selectedManager, managers]);

  const handleBarClick = (data, status) => {
    const memberData = data.activePayload ? data.activePayload[0].payload : (data.payload || data);
    if (!memberData || !memberData.originalName) return;
    
    const statusMap = {
      bookedCount: "booked",
      fullyPaidCount: "fullPaid",
      defaultCount: "default"
    };
    
    const dbStatus = statusMap[status];
    if (!dbStatus) return;

    let filteredLeads = [];
    
    if (selectedManager === "all") {
      // Find all BDAs under this manager
      const mgrName = memberData.originalName;
      const mgr = managers.find(m => m.fullname.toLowerCase() === mgrName);
      let teamNames = [mgrName];
      
      if (mgr) {
        const teams = mgr.teams?.length > 0 ? mgr.teams : (mgr.team ? mgr.team.split(",").map(t => t.trim()) : []);
        allBdas.filter(b => teams.includes(b.team)).forEach(b => {
          if (b.fullname) teamNames.push(b.fullname.toLowerCase());
        });
      }
      
      filteredLeads = allEnrollments.filter(e => 
        e.counselor && 
        teamNames.includes(e.counselor.toLowerCase()) && 
        e.status === dbStatus
      );
    } else {
      filteredLeads = allEnrollments.filter(e => 
        e.counselor && 
        e.counselor.toLowerCase() === memberData.originalName && 
        e.status === dbStatus
      );
    }

    setSelectedLeads(filteredLeads);
    setModalTitle(`${status === 'bookedCount' ? 'Booked' : status === 'fullyPaidCount' ? 'Fully Paid' : 'Defaulted'} Leads for ${memberData.name}`);
    setIsModalOpen(true);
  };

  return (
    <>
      <div id="AdminDashboard" className="p-8 bg-gray-50 min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Advanced Team Analysis (Mentorship)</h1>
            <p className="text-gray-500">Graphical overview of organization-wide performance</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <select 
              value={selectedManager} 
              onChange={(e) => setSelectedManager(e.target.value)}
              className="border px-4 py-2 rounded-lg bg-white shadow-sm font-semibold text-indigo-700"
            >
              <option value="all">📊 All Managers (Aggregate)</option>
              {managers.map(m => (
                <option key={m._id} value={m._id}>👤 {m.fullname}</option>
              ))}
            </select>

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
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
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
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      />
                      <Tooltip 
                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
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
                        interval={0}
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
    </>
  );
};

export default AdminTeamAnalysis;
