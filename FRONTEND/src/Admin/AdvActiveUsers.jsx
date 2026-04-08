import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvActiveUsers = () => {
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
      const activeUsers = allUsers.filter(u => u.status === "Active" || !u.status); // Default to Active if no status
      
      setUsers(activeUsers);
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

  const handleInactivate = async (user) => {
    if (!window.confirm(`Are you sure you want to inactivate ${user.fullname}?`)) return;

    try {
      const endpoint = user.role === "ADV_OPERATION" 
        ? `${API}/updateadvoperationstatus/${user._id}`
        : `${API}/updateadvteamstatus/${user._id}`;
      
      await axios.put(endpoint, { status: "Inactive" });
      toast.success("User inactivated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error inactivating user:", error);
      toast.error("Failed to inactivate user");
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
          <h2 className="text-2xl font-bold">ADV Active Users List</h2>
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
                <th>Action</th>
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
                       <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                         Active
                       </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleInactivate(user)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Inactivate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">No Active ADV Users Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvActiveUsers;
