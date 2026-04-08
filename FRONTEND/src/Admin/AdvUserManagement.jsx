import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const [opRes, teamRes] = await Promise.all([
        axios.get(`${API}/getadvoperation?t=${timestamp}`),
        axios.get(`${API}/getadvteam?t=${timestamp}`)
      ]);

      const operations = (opRes.data || []).map(u => ({ ...u, role: "ADV_OPERATION", type: "operation" }));
      const teams = (teamRes.data || []).map(u => ({ ...u, role: u.designation || "ADV_TEAM", type: "team" }));

      setUsers([...operations, ...teams]);
    } catch (error) {
      console.error("Error fetching ADV users:", error);
      toast.error("Failed to refresh user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = (user.status || "Active") === "Inactive" ? "Active" : "Inactive";
    const action = newStatus === "Active" ? "activate" : "inactivate";

    if (!window.confirm(`Are you sure you want to ${action} ${user.fullname}?`)) return;

    // Optimistic Update: Change status locally first for instant feedback
    const originalUsers = [...users];
    setUsers(users.map(u => 
      u._id === user._id ? { ...u, status: newStatus } : u
    ));

    try {
      const endpoint = user.type === "operation" 
        ? `${API}/updateadvoperationstatus/${user._id}`
        : `${API}/updateadvteamstatus/${user._id}`;
      
      await axios.put(endpoint, { status: newStatus });
      toast.success(`User ${action}d successfully`);
      // Final fetch to synchronize with any server-side changes
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
      // Revert to original state on failure
      setUsers(originalUsers);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`CRITICAL: Permanently delete ${user.fullname}? This cannot be undone.`)) return;

    try {
      const endpoint = user.type === "operation" 
        ? `${API}/deleteadvoperation/${user._id}`
        : `${API}/deleteadvteam/${user._id}`;
      
      await axios.delete(endpoint);
      toast.success("User deleted permanently");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Deletion failed");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = u.status || "Active";
    const matchesFilter = filterStatus === "All" || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div id="AdminAddCourse" className="p-6">
      <Toaster position="top-center" />
      <div className="coursetable bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">ADV User Management</h2>
            <p className="text-gray-500 mt-1">Manage statuses for all Advanced Operation and Team members</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none bg-gray-50 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-10 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none bg-gray-50"
              />
              <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            <button 
              onClick={fetchUsers}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
              title="Refresh List"
            >
              <i className="fa fa-refresh"></i>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <p className="mt-4 text-gray-400 font-medium tracking-wide">Fetching users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-50">
                  <th className="text-left py-4 px-4 font-bold text-gray-600">Sl No.</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-600">Full Name</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-600">Email</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-600">Role / Designation</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-600">Status</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    const isActive = (user.status || "Active") === "Active";
                    return (
                      <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                        <td className="py-4 px-4 text-gray-500 font-medium">{index + 1}</td>
                        <td className="py-4 px-4 text-gray-800 font-bold">{user.fullname}</td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary/80 bg-primary/5 px-2 py-1 rounded-md">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                             isActive 
                             ? "bg-green-100 text-green-700 ring-1 ring-green-600/20" 
                             : "bg-red-100 text-red-700 ring-1 ring-red-600/20"
                           }`}>
                             <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isActive ? "bg-green-600" : "bg-red-600"}`}></span>
                             {user.status || "Active"}
                           </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`px-4 py-1.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 ${
                                isActive 
                                ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" 
                                : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                              }`}
                            >
                              {isActive ? "Inactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="px-3 py-1.5 rounded-xl font-bold text-sm bg-gray-50 text-gray-400 hover:bg-gray-800 hover:text-white transition-all active:scale-95"
                              title="Permanent Delete"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-400 font-medium italic">
                      No matching users found in the system
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvUserManagement;
