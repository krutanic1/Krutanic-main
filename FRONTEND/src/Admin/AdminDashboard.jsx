import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import API from "../API";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toLocaleString("default", { month: "long", year: "numeric" });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/api/admin/dashboard-stats`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const filterPaymentsByDate = async () => {
    if (!startDate && !endDate) {
      toast.error("Please select a start or end date.");
      return;
    }

    setIsFiltering(true);
    try {
      const response = await axios.get(`${API}/api/admin/filtered-payments`, {
        params: { startDate, endDate }
      });
      setFilteredPayments(response.data);
      toast.success(`Found ${response.data.length} records.`);
    } catch (error) {
      console.error("Error fetching filtered payments:", error);
      toast.error("Failed to fetch filtered data.");
    } finally {
      setIsFiltering(false);
    }
  };

  const exportToExcel = () => {
    if (filteredPayments.length === 0) {
      toast.error("No data available to export. Please filter first.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredPayments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { bookType: "xlsx", type: "application/octet-stream" });
    saveAs(blob, "filtered_students.xlsx");
    toast.success("Data exported successfully.");
    setShowFilters(false);
  };

  return (
    <div id="AdminDashboard" >
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="numberdiv">
        <div>
          <i className="text-blue-700	fa fa-book"></i>
          <h2>COURSE</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.courses || 0)}</span>
        </div>
        <div>
          <i className="fa fa-book text-purple-700"></i>
          <h2>ADV COURSE</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.advCourses || 0)}</span>
        </div>
        <div>
          <i className="fa fa-user-secret"></i>
          <h2>OPERATION</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.operations || 0)}</span>
        </div>
        <div>
          <i className="fa fa-user-secret text-purple-600"></i>
          <h2>ADV OPERATION</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.advOperations || 0)}</span>
        </div>
        <div>
          <i className="fa fa-users"></i>
          <h2>BDA</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.bdas || 0)}</span>
        </div>
        <div>
          <i className="text-yellow-500 fa fa-calendar"></i>
          <h2>Booked</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.booked || 0)}</span>
        </div>
        <div>
          <i className="text-green-700	fa fa-money"></i>
          <h2>Full PAID</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.fullPaid || 0)}</span>
        </div>
        <div >
          <i className="text-red-700 fa fa-times-circle"></i>
          <h2>Default</h2>
          <span>{loading ? "..." : (dashboardData?.totals?.default || 0)}</span>
        </div>
      </div>


          <div className="p-4 relative">
            <button onClick={() => setShowFilters(!showFilters)} className="bg-blue-500 text-white py-2 px-4 rounded">
              <i className="fa fa-filter" aria-hidden="true"></i> Filter Export
            </button>
            {showFilters && (
              <div className="mt-4 absolute bg-white top-10 border w-[300px] p-4 rounded shadow-lg z-50">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  onClick={filterPaymentsByDate}
                  disabled={isFiltering}
                  className={`${isFiltering ? 'bg-gray-400' : 'bg-green-500'} text-white py-2 px-4 rounded mb-4 w-full`}
                >
                  {isFiltering ? 'Fetching...' : 'Fetch Filtered Data'}
                </button>

                {filteredPayments.length > 0 && (
                  <>
                    <h4 className="text-dm mb-2 font-semibold">Ready to Export: {filteredPayments.length}</h4>
                    <button
                      onClick={exportToExcel}
                      className="bg-yellow-500 text-white py-2 px-4 rounded w-full"
                    >
                      Download Excel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <h3>Added Courses</h3>
          <div className="courselist">
            <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Course</th>
                  <th>Session</th>
                  <th>For {currentMonth} </th>
                  <th>Full Paid ({currentMonth})</th>
                  <th>For {nextMonth}</th>
                  <th>Full Paid ({nextMonth})</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading data...</td></tr>
                ) : (
                  dashboardData?.courses?.map((course, index) => (
                  <tr key={course._id}>
                    <td>{index + 1}</td>
                    <td>{course.title}</td>
                    <td>{course.sessionCount}</td>
                    <td>{course.currentMonthCount}</td>
                    <td className="text-green-600 font-bold">{course.currentMonthFullPaid}</td>
                    <td>{course.nextMonthCount}</td>
                    <td className="text-green-600 font-bold">{course.nextMonthFullPaid}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <br />

          <h3>Added Advance Courses</h3>
          <div className="courselist">
            <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Course</th>
                  <th>Session</th>
                  <th>For {currentMonth} </th>
                  <th>Full Paid ({currentMonth})</th>
                  <th>For {nextMonth}</th>
                  <th>Full Paid ({nextMonth})</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading data...</td></tr>
                ) : (
                  dashboardData?.advCourses?.map((course, index) => (
                  <tr key={course._id}>
                    <td>{index + 1}</td>
                    <td>{course.title}</td>
                    <td>{course.sessionCount}</td>
                    <td>{course.currentMonthCount}</td>
                    <td className="text-green-600 font-bold">{course.currentMonthFullPaid}</td>
                    <td>{course.nextMonthCount}</td>
                    <td className="text-green-600 font-bold">{course.nextMonthFullPaid}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default AdminDashboard;
