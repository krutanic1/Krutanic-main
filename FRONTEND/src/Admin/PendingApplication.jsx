import React, { useState, useEffect } from "react";
import API from "../API";
import axios from "axios";

const PendingApplication = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      const inactiveUsers = response.data.filter(
        (user) => user.status === "inactive"
      );
      setUsers(inactiveUsers);
      setFilteredStudents(inactiveUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActiveNow = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to active the user?"
    );
    if (isConfirmed) {
      try {
        await axios.put(`${API}/users/${id}`, { status: "active" });
        fetchUsers();
      } catch (error) {
        console.error("Error activating user:", error);
      }
    }
  };

  useEffect(() => {
    if (users) {
      setLoading(false);
    }
  }, [users]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = users.filter(
      (student) =>
        student.fullname.toLowerCase().includes(value.toLowerCase()) ||
        student.email.toLowerCase().includes(value.toLowerCase()) ||
        student.phone.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <div id="AdminAddCourse">
      <div className="coursetable">
        <h2>Inactive Users List</h2>
        <section className="flex items-center  gap-1">
          <input
            type="type"
            placeholder="Search here by "
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-black px-2 py-1 rounded-lg"
          />
          <div className="relative group inline-block">
            <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
              Name, Email, and Contact no
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
            </div>
          </div>
        </section>
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
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Password</th>
                <th>Status</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.password}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => handleActiveNow(user._id)}>
                        <div className="relative group inline-block">
                          <i className="fa fa-eye"></i>
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                            Active
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                          </div>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No Inactive Users</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingApplication;
