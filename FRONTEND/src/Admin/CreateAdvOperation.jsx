import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const CreateAdvOperation = () => {
  const [iscourseFormVisible, setiscourseFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    languages: [],
  });
  const LANGUAGE_OPTIONS = ["English", "Kannada", "Hindi", "Malayalam", "Tamil", "Telugu", "Bengali"];
  const [advOperation, setAdvOperation] = useState([]);
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
          `${API}/updateadvoperation/${editingOperationId}`,
          newOperation
        );
        toast.success("ADV Operation updated successfully");
      } else {
        const response = await axios.post(
          `${API}/createadvoperation`,
          newOperation
        );
        toast.success("ADV Operation created successfully");
      }
      fetchAdvOperation();
      resetForm();
    } catch (error) {
      toast.error(
        "There was an error while creating or updating the ADV operation"
      );
      console.error("Error creating or updating ADV operation", error);
    }
  };

  const fetchAdvOperation = async () => {
    try {
      const response = await axios.get(`${API}/getadvoperation`);
      setAdvOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching ADV operation:", error);
    }
  };

  const fetchRevenueDetails = async (operationName) => {
    try {
      setRevenueData(null);
      setIsDialogVisible(true);
      setSelectedOperationName(operationName);

      const response = await axios.get(`${API}/getadvenrolls`);
      const allData = response.data.data || response.data;
      const data = allData.filter(item => item.operationName === operationName);

      const revenueByDay = {};
      const revenueByMonth = {};
      let totalRevenue = 0;

      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
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
      console.error("Error fetching ADV operation revenue data:", error);
    }
  };

  useEffect(() => {
    fetchAdvOperation();
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
      "Are you sure you want to delete the ADV operation account?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/deleteadvoperation/${id}`);
        toast.success("ADV Operation deleted successfully");
        fetchAdvOperation();
      } catch (error) {
        toast.error("There was an error deleting the ADV operation");
        console.error("Error deleting ADV operation", error);
      }
    }
  };

  const handleEdit = (operation) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to edit the ADV operation details?"
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

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const [targets, setTargets] = useState({});
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const handleInputChange = (e, id, field) => {
    const value = e.target.value;
    setTargets((prev) => ({ ...prev, [id]: value }));
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(`${API}/toggleadvonlinestatus/${id}`);
      if (response.status === 200) {
        toast.success(`Status updated successfully`);
        fetchAdvOperation();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleSendEmail = async (value) => {
    const emailData = {
      fullname: value.fullname,
      email: value.email,
      password: value.password,
    };
    try {
      const response = await axios.post(`${API}/sendmailtoadvoperation`, emailData);

      if (response.status === 200) {
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the email.");
      console.error("Error sending email:", error);
    }
  };

  const handleloginteam = async (userId) => {
    try {
      const response = await axios.post(`${API}/api/admin/impersonate`, 
        { userId, role: "ADV_OPERATION" },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Impersonation successful!");
        const { token, operationName, fullname, _id, userId: resUserId } = response.data;
        
        // Pass credentials via URL so the new tab can save them to its own sessionStorage
        const targetId = _id || resUserId || userId;
        const targetName = operationName || fullname || "";

        const impersonateUrl = `/AdvOperationDashboard?impToken=${encodeURIComponent(token)}&impId=${targetId}&impName=${encodeURIComponent(targetName)}&impType=advOperationToken`;
        
        setTimeout(() => {
          window.open(impersonateUrl, "_blank");
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Impersonation failed!");
    }
  };

  const handleAsignTarget = async (e, id) => {
    e.preventDefault();
    const targetValue = targets[id];

    try {
      const response = await axios.post(`${API}/assigntargettoadvoperation/${id}`, {
        target: {
          currentMonth,
          percentage: targetValue,
        },
      });
      if (response.status === 200) {
        toast.success("Target percentage assigned successfully.");
        setTargets((prev) => ({
          ...prev,
          [id]: "",
        }));
        fetchAdvOperation();
      } else {
        toast.error("Failed to assign target.");
      }
    } catch (error) {
      console.error("Error assigning target:", error);
      toast.error("Server error while assigning target.");
    }
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {iscourseFormVisible && (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <h2>
              {editingOperationId
                ? "Edit ADV Operation Account"
                : "Create ADV Operation Account"}
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
          <h1>ADV Operation Accounts List:</h1>
          <span onClick={toggleVisibility}>+ Add New ADV Operation</span>
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
              <th>Assigned Target</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {advOperation?.map((operation, index) => (
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
                  <td
                    className="cursor-pointer font-semibold"
                    onClick={() => handleloginteam(operation._id)}
                  >
                    Login <i className="fa fa-sign-in"></i>
                  </td>
                <td className="text-center">
                  <div
                    onClick={() => handleToggleStatus(operation._id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full cursor-pointer ${operation.isOnline
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${operation.isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></span>
                    {operation.isOnline ? "Online" : "Offline"}
                  </div>
                </td>
                <td>
                  {operation.languages && operation.languages.length > 0
                    ? operation.languages.join(", ")
                    : "Not specified"}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(operation)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(operation._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
                <td>
                  <i
                    onClick={() => handleSendEmail(operation)}
                    className="fa fa-envelope cursor-pointer text-2xl"
                    title="Send Login Credentials"
                  ></i>
                </td>
                <td>
                  {operation.target && operation.target.length > 0 ? (
                    <div>
                      {operation.target
                        .filter((t) => t.currentMonth === currentMonth)
                        .map((t, idx) => (
                          <div key={idx}>
                            {t.percentage}%
                          </div>
                        ))}
                      {operation.target.filter((t) => t.currentMonth === currentMonth).length === 0 && (
                        <span className="text-gray-500">No target</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">No target</span>
                  )}
                </td>
                <td>
                  <form onSubmit={(e) => handleAsignTarget(e, operation._id)}>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="%"
                        className="border px-2 py-1 w-16"
                        value={targets[operation._id] || ""}
                        onChange={(e) => handleInputChange(e, operation._id)}
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Assign
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue Dialog */}
      {isDialogVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Revenue Details - {selectedOperationName}
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✖
              </button>
            </div>

            {revenueData ? (
              <div>
                {/* Daily Revenue */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Last 7 Days Revenue</h3>
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Total</th>
                        <th className="border border-gray-300 px-4 py-2">Credited</th>
                        <th className="border border-gray-300 px-4 py-2">Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(revenueData.revenueByDay).map(([date, data]) => (
                        <tr key={date}>
                          <td className="border border-gray-300 px-4 py-2">{date}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.total.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.credited.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.pending.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Monthly Revenue */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Last 3 Months Revenue</h3>
                  <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Month</th>
                        <th className="border border-gray-300 px-4 py-2">Total</th>
                        <th className="border border-gray-300 px-4 py-2">Credited</th>
                        <th className="border border-gray-300 px-4 py-2">Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(revenueData.revenueByMonth).map(([month, data]) => (
                        <tr key={month}>
                          <td className="border border-gray-300 px-4 py-2">{month}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.total.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.credited.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹{data.pending.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Revenue */}
                <div className="bg-[#f15b29] text-white p-4 rounded">
                  <h3 className="text-xl font-semibold">
                    Total Revenue: ₹{revenueData.totalRevenue.toLocaleString()}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">Loading revenue data...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAdvOperation;
