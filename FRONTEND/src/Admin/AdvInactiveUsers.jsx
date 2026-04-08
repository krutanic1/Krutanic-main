import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvInactiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [opRes, teamRes] = await Promise.all([
        axios.get(`${API}/getadvoperation`),
        axios.get(`${API}/getadvteam`)
      ]);

      const operations = (opRes.data || []).map(u => ({ ...u, role: "ADV_OPERATION" }));
      const teams = (teamRes.data || []).map(u => ({ ...u, role: u.designation || "ADV_TEAM" }));

      const allUsers = [...operations, ...teams];
      const inactiveUsers = allUsers.filter(u => u.status === "Inactive");
      
      setUsers(inactiveUsers);
    } catch (error) {
      console.error("Error fetching ADV users:", error);
      toast.error("Failed to fetch ADV users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActivate = async (user) => {
    if (!window.confirm(`Are you sure you want to activate ${user.fullname}?`)) return;

    try {
      const endpoint = user.role === "ADV_OPERATION" 
        ? `${API}/updateadvoperationstatus/${user._id}`
        : `${API}/updateadvteamstatus/${user._id}`;
      
      await axios.put(endpoint, { status: "Active" });
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`CRITICAL: Are you sure you want to PERMANENTLY DELETE ${user.fullname}? This action cannot be undone.`)) return;

    try {
      const endpoint = user.role === "ADV_OPERATION" 
        ? `${API}/deleteadvoperation/${user._id}`
        : `${API}/deleteadvteam/${user._id}`;
      
      await axios.delete(endpoint);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" />
      <div className="coursetable">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">ADV Inactive Users List</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
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
                <th>Sl No.</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role / Designation</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                       <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                         Inactive
                       </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleActivate(user)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No Inactive ADV Users Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvInactiveUsers;
