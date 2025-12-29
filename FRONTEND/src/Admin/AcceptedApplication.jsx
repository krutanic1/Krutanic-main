import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import API from "../API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";

const PROGRAM_OPTIONS = [
  { value: "", label: "All Programs" },
  { value: "Self-guided", label: "Self-guided" },
  { value: "Instructor Led", label: "Instructor Led" },
  { value: "Career Advancement", label: "Career Advancement" },
];
const ITEMS_PER_PAGE = 40;

const AcceptedApplication = () => {
  const [users, setUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [showFullyPaidOnly, setShowFullyPaidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(null);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearchQuery(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSetSearchQuery(e.target.value);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResponse, enrollmentsResponse, componentsResponse] =
        await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/getnewstudentenroll`),
          axios.get(`${API}/all-user-components`),
        ]);

      const enrollmentsMap = new Map(
        enrollmentsResponse.data.map((e) => [
          e.email,
          {
            program: e.program,
            isFullyPaid: e.paidAmount === e.programPrice,
          },
        ])
      );

      const componentsMap = new Map(
        componentsResponse.data.map((c) => [c.userId, c.components])
      );

      const activeUsers = usersResponse.data
        .filter((user) => user.status === "active")
        .map((user) => {
          const enrollment = enrollmentsMap.get(user.email);
          return {
            ...user,
            program: enrollment?.program || "Self-guided",
            isFullyPaid: enrollment?.isFullyPaid || false,
            components: componentsMap.get(user._id) || {},
            isLoadingComponent: false,
          };
        });

      setUsers(activeUsers);
      if (activeUsers.length === 0) {
        toast.info("No active users found.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleComponent = useCallback(
    async (userId, component, status) => {
      const toastId = toast.info(
        <div>
          <p>
            Are you sure you want to {status ? "enable" : "disable"} the{" "}
            {component} component?
          </p>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                toast.dismiss(toastId);
                setUsers((prev) =>
                  prev.map((u) =>
                    u._id === userId ? { ...u, isLoadingComponent: true } : u
                  )
                );
                try {
                  await axios.put(`${API}/user-components/${userId}`, {
                    component,
                    status,
                  });
                  const response = await axios.get(`${API}/user-components`, {
                    params: { userId },
                  });
                  const components = response.data.components;
                  setUsers((prev) =>
                    prev.map((u) =>
                      u._id === userId
                        ? { ...u, components, isLoadingComponent: false }
                        : u
                    )
                  );
                  toast.success(
                    `${component} component ${
                      status ? "enabled" : "disabled"
                    } successfully`,
                    {
                      position: "top-center",
                      autoClose: 3000,
                    }
                  );
                } catch (error) {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u._id === userId ? { ...u, isLoadingComponent: false } : u
                    )
                  );
                  toast.error(`Failed to update ${component} component`);
                }
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded"
              onClick={() => toast.dismiss(toastId)}
            >
              No
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
        }
      );
    },
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        (user.fullname
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
          user.email
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          user.phone.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
      const matchesProgram = !programFilter || user.program === programFilter;
      const matchesPayment = !showFullyPaidOnly || user.isFullyPaid;
      return matchesSearch && matchesProgram && matchesPayment;
    });
  }, [users, debouncedSearchQuery, programFilter, showFullyPaidOnly]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleEdit = useCallback((user) => {
    if (window.confirm("Are you sure you want to edit the user details?")) {
      setFormData(user);
      setIsFormVisible(true);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData?._id) return toast.error("No user ID found");
      try {
        await axios.put(`${API}/users/${formData._id}`, formData);
        toast.success("User updated successfully");
        setIsFormVisible(false);
        fetchUsers();
      } catch (error) {
        toast.error("Failed to update user");
      }
    },
    [formData, fetchUsers]
  );

  const handleInactivate = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to inactivate this user?")) {
        try {
          await axios.put(`${API}/users/${id}`, { status: "inactive" });
          fetchUsers();
          toast.success("User inactivated successfully", {
            position: "top-center",
            autoClose: 3000,
          });
        } catch (error) {
          toast.error("Failed to inactivate user");
        }
      }
    },
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const RenderRow = React.memo(({ user, index }) => {
    return (
      <tr key={user._id}>
        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
        <td>{user.fullname}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td>{user.status}</td>
        <td>
          {user.components ? (
            <>
              <button
                className={`px-2 py-1 rounded mr-1 ${
                  user.components?.atschecker
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "atschecker", true)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Enable"}
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  !user.components?.atschecker
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "atschecker", false)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Disable"}
              </button>
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td>
          {user.components ? (
            <>
              <button
                className={`px-2 py-1 rounded mr-1 ${
                  user.components?.jobboard
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "jobboard", true)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Enable"}
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  !user.components?.jobboard
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "jobboard", false)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Disable"}
              </button>
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td>
          {user.components ? (
            <>
              <button
                className={`px-2 py-1 rounded mr-1 ${
                  user.components?.myjob
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleToggleComponent(user._id, "myjob", true)}
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Enable"}
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  !user.components?.myjob
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleToggleComponent(user._id, "myjob", false)}
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Disable"}
              </button>
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td>
          {user.components ? (
            <>
              <button
                className={`px-2 py-1 rounded mr-1 ${
                  user.components?.mockinterview
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "mockinterview", true)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Enable"}
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  !user.components?.mockinterview
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "mockinterview", false)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Disable"}
              </button>
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td>
          {user.components ? (
            <>
              <button
                className={`px-2 py-1 rounded mr-1 ${
                  user.components?.exercise
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "exercise", true)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Enable"}
              </button>
              <button
                className={`px-2 py-1 rounded ${
                  !user.components?.exercise
                    ? "bg-red-500 text-white"
                    : "bg-gray-300"
                } ${
                  user.isLoadingComponent ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() =>
                  handleToggleComponent(user._id, "exercise", false)
                }
                disabled={user.isLoadingComponent}
              >
                {user.isLoadingComponent ? "Loading..." : "Disable"}
              </button>
            </>
          ) : (
            "Loading..."
          )}
        </td>
        <td>
          <button onClick={() => handleInactivate(user._id)}>
            <div className="relative group inline-block">
              <i className="fa fa-eye-slash"></i>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                Inactive
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
              </div>
            </div>
          </button>
          <button onClick={() => handleEdit(user)}>
            <div className="relative group inline-block">
              <i className="fa fa-edit"></i>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                Edit
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
              </div>
            </div>
          </button>
        </td>
      </tr>
    );
  }, [
    currentPage,
    handleToggleComponent,
    handleInactivate,
    handleEdit,
  ]);

  return (
    <div id="AdminAddCourse">
      <ToastContainer />
      {isFormVisible && formData && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <span onClick={() => setIsFormVisible(false)}>✖</span>
            <h1>Edit User</h1>
            <input
              type="text"
              name="fullname"
              placeholder="Candidate Full Name"
              value={formData.fullname}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Candidate Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Candidate Contact No"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            />
            <input className="cursor-pointer" type="submit" value="Save" />
          </form>
        </div>
      )}
      {loading ? (
        <div id="loader">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="coursetable">
          <h2>Active Users List</h2>
          <section className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div className="flex items-center justify-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  {programFilter
                    ? `Searching within ${
                        PROGRAM_OPTIONS.find(
                          (opt) => opt.value === programFilter
                        )?.label
                      } program`
                    : "Search by Name, Email, or Contact No across all programs"}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={
                    programFilter
                      ? `Search within ${
                          PROGRAM_OPTIONS.find(
                            (opt) => opt.value === programFilter
                          )?.label
                        }...`
                      : "Search by name, email, or contact..."
                  }
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border border-black px-2 py-1 rounded-lg w-[400px] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      debouncedSetSearchQuery("");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <label>
                <input
                  type="checkbox"
                  checked={showFullyPaidOnly}
                  onChange={(e) => {
                    setShowFullyPaidOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer"
                  title="Show only fully paid users"
                />
              </label>
              <select
                value={programFilter}
                onChange={(e) => {
                  setProgramFilter(e.target.value);
                  setCurrentPage(1);
                  setSearchQuery("");
                  debouncedSetSearchQuery("");
                }}
                className="border border-black px-2 py-1 rounded-lg focus:outline-none"
              >
                {PROGRAM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>ATS Checker</th>
                <th>Job Board</th>
                <th>My Job</th>
                <th>Mock Interview</th>
                <th>Exercise</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <RenderRow key={user._id} user={user} index={index} />
                ))
              ) : (
                <tr>
                  <td colSpan="11">
                    No active users found
                    {showFullyPaidOnly && " with full payment"}
                    {programFilter &&
                      ` in ${
                        PROGRAM_OPTIONS.find(
                          (opt) => opt.value === programFilter
                        )?.label
                      }`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filteredUsers.length > ITEMS_PER_PAGE && (
            <section className="flex items-center justify-center gap-5 mt-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border border-gray-700 px-2 py-1 rounded-lg active:bg-[#f15b29] disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage >=
                  Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
                }
                className="border border-gray-700 px-2 py-1 rounded-lg active:bg-[#f15b29] disabled:opacity-50"
              >
                Next
              </button>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default AcceptedApplication;