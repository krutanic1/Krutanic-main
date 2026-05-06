import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
const CreateOperation = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    languages: [],
  });
  const LANGUAGE_OPTIONS = ["English", "Kannada", "Hindi", "Malayalam", "Tamil", "Telugu", "Bengali"];
  const [operation, setOperation] = useState([]);
  const [selectedOperationName, setSelectedOperationName] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [editingOperationId, setEditingOperationId] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const toggleVisibility = () => {
    setiscourseFormVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newOperation = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      languages: formData.languages,
    };
    try {
      if (editingOperationId) {
        const response = await axios.put(
          `${API}/updateoperation/${editingOperationId}`,
          newOperation
        );
        toast.success("Operation updated successfully");
      } else {
        const response = await axios.post(
          `${API}/createoperation`,
          newOperation
        );
        toast.success("Operation created successfully");
      }
      fetchOperation();
      resetForm();
    } catch (error) {
      toast.error(
        "There was an error while creating or updating the operation"
      );
      console.error("Error creating or updating operation", error);
    }
  };

  const fetchOperation = async () => {
    try {
      const response = await axios.get(`${API}/getoperation`);
      setOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching operation:", error);
    }
  };

  const fetchRevenueDetails = async (operationName) => {
    try {
      setRevenueData(null);
      setIsDialogVisible(true);
      setSelectedOperationName(operationName);

      const response = await axios.get(`${API}/databyopname`, {
        params: { operationName },
      });
      const data = response.data;
      const revenueByDay = {};
      const revenueByMonth = {};
      let totalRevenue = 0;

      // Get the current date and date 7 days ago
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      // Get the current month and 3 months ago
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      data.forEach((student) => {
        const createdAt = new Date(student.createdAt);
        const date = createdAt.toLocaleDateString("en-GB");
        const month = createdAt.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        const revenue = student.programPrice || 0;
        const credited = (student.paidAmount || 0);
        const pending = revenue - credited;

        // Filter out data that is outside of the last 7 days
        if (createdAt >= sevenDaysAgo) {
          if (!revenueByDay[date]) {
            revenueByDay[date] = { total: 0, credited: 0, pending: 0 };
          }
          revenueByDay[date].total += revenue;
          revenueByDay[date].pending += pending;
          if (student.status === "fullPaid" || (Array.isArray(student.remark) && student.remark[student.remark.length - 1] === "Half_Cleared")) {
            revenueByDay[date].credited += credited;
          }
        }

        // Filter out data that is outside of the last 3 months
        if (createdAt >= threeMonthsAgo) {
          if (!revenueByMonth[month]) {
            revenueByMonth[month] = { total: 0, credited: 0, pending: 0 };
          }
          revenueByMonth[month].total += revenue;
          revenueByMonth[month].pending += pending;
          if (student.status === "fullPaid" || (Array.isArray(student.remark) && student.remark[student.remark.length - 1] === "Half_Cleared")) {
            revenueByMonth[month].credited += credited;
          }
        }

        totalRevenue += revenue;
      });

      setRevenueData({
        revenueByDay,
        revenueByMonth,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching operation revenue data:", error);
    }
  };

  useEffect(() => {
    fetchOperation();
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      languages: [],
    });
    setEditingOperationId(null);
    setiscourseFormVisible(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the operation account?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deleteoperation/${id}`);
        alert("Operation deleted successfully");
        fetchOperation();
      } catch (error) {
        alert("There was an error deleting the operation");
        console.error("Error deleting operation", error);
      }
    }
  };
  const handleEdit = (operation) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the operation details?"
    );
    if (isConfirmed) {
      setFormData({
        fullname: operation.fullname.trim(),
        email: operation.email.trim(),
        password: operation.password,
        languages: operation.languages || [],
      });
      setEditingOperationId(operation._id);
      setiscourseFormVisible(true);
    }
  };
  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
    };
    try {
      const response = await axios.post(
        `${API}/sendmailtooperation`,
        emailData
      );
      if (response.status === 200) {
        toast.success("Email sent successfully!");
        const operationData = {
          mailSended: true,
        };
        const updateResponse = await axios.put(
          `${API}/mailsendedoperation/${value._id}`,
          operationData
        );
        if (updateResponse.status === 200) {
          toast.success("Operation record updated successfully!");
        } else {
          toast.error("Failed to update student record.");
        }
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
    }
    fetchOperation();
  };
  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const handleloginteam = async (userId) => {
    try {
      const response = await axios.post(`${API}/api/admin/impersonate`, 
        { userId, role: "OPERATION" },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Impersonation successful!");
        const { token, operationName, fullname, _id, userId: resUserId } = response.data;
        
        // Pass credentials via URL so the new tab can save them to its own sessionStorage
        const targetId = _id || resUserId || userId;
        const targetName = operationName || fullname || "";

        const impersonateUrl = `/OperationDashboard?impToken=${encodeURIComponent(token)}&impId=${targetId}&impName=${encodeURIComponent(targetName)}&impType=operationToken`;
        
        setTimeout(() => {
          window.open(impersonateUrl, "_blank");
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Impersonation failed!");
    }
  };

  const [targets, setTargets] = useState({});
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setTargets((prev) => ({ ...prev, [id]: value }));
  };

  const handleAsignTarget = async (e, id) => {
    e.preventDefault();
    const targetValue = targets[id];

    try {
      const response = await axios.post(`${API}/assigntargettooperation/${id}`, {
        target: {
          currentMonth,
          percentage: targetValue,
        },
      });
      if (response.status === 200) {
        toast.success("Target parcentage assigned successfully.");
        setTargets((prev) => ({
          ...prev,
          [id]: "",
        }));
        fetchOperation();
      } else {
        toast.error("Failed to assign target.");
      }
    } catch (error) {
      console.error("Error assigning target:", error);
      toast.error("Server error while assigning target.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(`${API}/toggleonlinestatus/${id}`);
      if (response.status === 200) {
        toast.success(`Status updated successfully`);
        fetchOperation();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div id="AdminAddCourse" >
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>
              {editingOperationId
                ? "Edit Operation Account"
                : "Create Operation Account"}
            </h2>
            <span onClick={resetForm}>✖</span>
            <input
              value={formData.fullname}
              onChange={handleChange}
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter full Name"
              required
            />
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder="Enter email id"
              required
            />
            <input
              type="text"
              placeholder="Create password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className="cursor-pointer"
              type="submit"
              value={editingOperationId ? "Update Account" : "Create Account"}
            />
            {/* Language Selection */}
            <div className="language-selection">
              <h3 className="text-lg font-semibold mb-2">Select Languages:</h3>
              <div className="flex flex-wrap gap-4">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={lang}
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setFormData((prev) => {
                          const newLanguages = checked
                            ? [...prev.languages, value]
                            : prev.languages.filter((l) => l !== value);
                          return { ...prev, languages: newLanguages };
                        });
                      }}
                      className="form-checkbox h-4 w-4 text-bg-[#F15B29]"
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="coursetable">
        <div>
          <h1>Operation Accounts List:</h1>
          <span onClick={toggleVisibility}>+ Add New Operation</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Login</th>
              <th>Status</th>
              <th>Languages</th>
              <th>Action</th>
              <th>Send Login Credentials</th>
              <th>Assinged Target</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {operation?.map((operation, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => fetchRevenueDetails(operation.fullname)}
                >
                  {operation.fullname}
                </td>
                <td>{operation.email}</td>
                <td>{operation.password}</td>
                <td className="cursor-pointer font-semibold" onClick={() => handleloginteam(operation._id)}>Login <i className="fa fa-sign-in"></i></td>
                <td className="text-center">
                  <div
                    className={`cursor-pointer inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${operation.isOnline !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    onClick={() => handleToggleStatus(operation._id)}
                  >
                    <span className={`w-2 h-2 rounded-full mr-1 ${operation.isOnline !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {operation.isOnline !== false ? 'Online' : 'Offline'}
                  </div>
                </td>
                <td>{operation.languages && operation.languages.length > 0 ? operation.languages.join(", ") : "N/A"}</td>
                <td>
                  <button onClick={() => handleEdit(operation)}>
                    <i className="fa fa-edit"></i>
                  </button>
                  <button onClick={() => handleDelete(operation._id)}>
                    <i className="fa fa-trash-o text-red-600"></i>
                  </button>
                </td>
                <td>
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSendEmail(operation)}
                    disabled={operation.mailSended}
                  >
                    {operation.mailSended ? (
                      <i className="fa fa-send-o text-green-600"></i>
                    ) : (
                      <i className="fa fa-send-o text-red-600"></i>
                    )}
                  </div>
                </td>
                <td>
                  <select className="border rounded-md px-2 py-1">
                    {operation.target.map((target, index) => (
                      <option key={index}>
                        {new Date(
                          `${target.currentMonth}-01`
                        ).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        : {target.percentage}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {operation.target.length > 0 &&
                    operation.target[operation.target.length - 1].currentMonth ===
                    currentMonth ? (
                    <p>already assign</p>
                  ) : (
                    <form onSubmit={(e) => handleAsignTarget(e, operation._id)}>
                      <input
                        type="text"
                        placeholder="Target %"
                        value={targets[operation._id] || ""}
                        onChange={(e) =>
                          handleInputChange(e, operation._id)
                        }
                        name="target"
                        className="border rounded-md px-1 py-1 mr-1"
                      />
                      <button type="submit" id="target">
                        Submit
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDialogVisible && revenueData && selectedOperationName && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white relative w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-4 sm:p-6 rounded-xl shadow-lg overflow-hidden max-h-[80vh] scrollbar-hide  overflow-y-auto">
            <span
              onClick={closeDialog}
              className="cursor-pointer absolute right-0 bg-black border rounded-full px-2 top-0 text-xl text-gray-500 hover:text-red-600"
            >
              X
            </span>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Revenue Details for{" "}
                <span className="text-[#f15b29]">{selectedOperationName}</span>
              </h2>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Total Revenue: {revenueData.totalRevenue}
              </h3>
              <h5 className="font-semibold mb-2">Daily Revenue</h5>
              <table className="min-w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Total Revenue</th>
                    <th className="px-3 py-2 text-left">Credited Revenue</th>
                    <th className="px-3 py-2 text-left">Pending Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(revenueData.revenueByDay)?.map((date, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2">{date}</td>
                      <td className="px-3 py-2">
                        {revenueData.revenueByDay[date].total}
                      </td>
                      <td className="px-3 py-2">
                        {revenueData.revenueByDay[date].credited}
                      </td>
                      <td className="px-3 py-2">
                        {revenueData.revenueByDay[date].pending}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h5 className="font-semibold mb-2 mt-4">Monthly Revenue</h5>
              <table className="min-w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Month</th>
                    <th className="px-3 py-2 text-left">Total Revenue</th>
                    <th className="px-3 py-2 text-left">Credited Revenue</th>
                    <th className="px-3 py-2 text-left">Pending Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(revenueData.revenueByMonth)?.map(
                    (month, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-2">{month}</td>
                        <td className="px-3 py-2">
                          {revenueData.revenueByMonth[month].total}
                        </td>
                        <td className="px-3 py-2">
                          {revenueData.revenueByMonth[month].credited}
                        </td>
                        <td className="px-3 py-2">
                          {revenueData.revenueByMonth[month].pending}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOperation;
