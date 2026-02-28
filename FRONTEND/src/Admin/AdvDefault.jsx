import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvDefault = () => {
  const [defaultEnrollments, setDefaultEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDefaultEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      
      const filtered = enrollments.filter(
        (item) => item.status === "default"
      );
      
      setDefaultEnrollments(filtered);
      setFilteredEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching default enrollments:", error);
      toast.error("Failed to load default enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultEnrollments();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = defaultEnrollments.filter((enroll) => {
      return (
        (enroll.email && enroll.email.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.phone && enroll.phone.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.fullname && enroll.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.counselor && enroll.counselor.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.operationName && enroll.operationName.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.domain && enroll.domain.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setFilteredEnrollments(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const groupedData = filteredEnrollments.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
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
          <div className="mb-2">
            <h2>ADV Default List ({filteredEnrollments.length})</h2>
            <section className="flex items-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  Search by Name, Email, Phone, Counselor, Operation, Domain
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-black px-2 py-1 rounded-lg"
              />
            </section>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Domain</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>Remaining</th>
                <th>Month Opted</th>
                <th>BDA/Counselor</th>
                <th>Executive</th>
                <th>Operation</th>
                <th>Due Date</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).length > 0 ? (
                Object.keys(groupedData).sort((a, b) => {
                  const dateA = a.split("/").reverse().join("");
                  const dateB = b.split("/").reverse().join("");
                  return dateB.localeCompare(dateA);
                }).map((date) => (
                  <React.Fragment key={date}>
                    <tr>
                      <td colSpan="14" style={{ fontWeight: "bold", backgroundColor: "#ffebee" }}>
                        {date} ({groupedData[date].length} enrollments)
                      </td>
                    </tr>
                    {groupedData[date].map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td className="capitalize">{item.fullname || "N/A"}</td>
                        <td>{item.email || "N/A"}</td>
                        <td>{item.whatsAppNumber || item.phone || "N/A"}</td>
                        <td>{item.domain || "N/A"}</td>
                        <td className="text-green-600 font-bold">₹{item.programPrice?.toLocaleString() || 0}</td>
                        <td className="text-blue-600 font-bold">₹{item.paidAmount?.toLocaleString() || 0}</td>
                        <td className="text-red-600 font-bold">₹{item.remainingAmount?.toLocaleString() || 0}</td>
                        <td>{item.monthOpted || "N/A"}</td>
                        <td>{item.counselor || "N/A"}</td>
                        <td>{item.executive || item.lead || "N/A"}</td>
                        <td>{item.operationName || "N/A"}</td>
                        <td className="whitespace-nowrap">{item.clearPaymentMonth || "N/A"}</td>
                        <td>{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="14">No default enrollments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdvDefault;
