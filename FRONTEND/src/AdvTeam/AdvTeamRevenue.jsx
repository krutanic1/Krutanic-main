import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const AdvTeamRevenue = () => {
  const [advEnrollments, setAdvEnrollments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const advTeamName = localStorage.getItem("advTeamName");

  const fetchAdvEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      const filteredData = enrollments.filter(
        (item) => item.counselor && item.counselor === advTeamName
      );
      setAdvEnrollments(filteredData);
    } catch (err) {
      setError("There was an error fetching advance enrollments.");
      console.error("Error fetching advance enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvEnrollments();
  }, []);

  if (loading) {
    return (
      <div id="loader">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const revenueByDay = {};
  const revenueByMonth = {};
  let totalRevenue = 0;

  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);

  advEnrollments.forEach((student) => {
    const createdDate = new Date(student.createdAt);

    // Skip students older than 3 months
    if (createdDate < threeMonthsAgo) {
      return;
    }

    const date = createdDate.toLocaleDateString("en-GB");
    const month = createdDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const revenue = student.programPrice || 0;
    const bookedAmount = student.paidAmount || 0;
    const isHalfCleared = Array.isArray(student.remark) && student.remark[student.remark.length - 1] === "Half_Cleared";
    const credited = student.status === "fullPaid" || isHalfCleared ? bookedAmount : 0;
    const pending = revenue - credited;

    if (!revenueByDay[date]) {
      revenueByDay[date] = { total: 0, booked: 0, credited: 0, pending: 0, month };
    }
    if (!revenueByMonth[month]) {
      revenueByMonth[month] = { total: 0, booked: 0, credited: 0, pending: 0 };
    }

    revenueByDay[date].total += revenue;
    revenueByDay[date].booked += bookedAmount;
    revenueByDay[date].credited += credited;
    revenueByDay[date].pending += pending;

    // Calculate cutoff date: 8th of next month for this student's month
    const [monthName, yearStr] = month.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth(); // 0-based
    const year = parseInt(yearStr);
    const cutoffDate = new Date(year, monthIndex + 1, 8); // 8th of next month

    // Only include credited if student's createdAt is before cutoffDate
    if (createdDate <= cutoffDate) {
      revenueByMonth[month].credited += credited;
    }

    revenueByMonth[month].total += revenue;
    revenueByMonth[month].booked += bookedAmount;
    revenueByMonth[month].pending += pending;

    totalRevenue += revenue;
  });

  function getLastNMonths(n) {
    const result = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthString = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      result.push(monthString);
    }

    return result;
  }

  const monthsToShow = getLastNMonths(3); // last 3 months only
  const months = monthsToShow.filter((m) => revenueByMonth[m]);

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const filteredDailyRevenue = Object.entries(revenueByDay).filter(
    ([, data]) => data.month === (selectedMonth || currentMonth)
  );

  // Calculate summary statistics
  const totalBooked = advEnrollments.reduce((acc, student) => acc + (student.paidAmount || 0), 0);
  const totalCredited = advEnrollments.reduce((acc, student) => {
    const lastRemark = Array.isArray(student.remark) && student.remark.length > 0
      ? student.remark[student.remark.length - 1]
      : null;

    if (student.status === "fullPaid" || lastRemark === "Half_Cleared") {
      return acc + (student.paidAmount || 0);
    }
    return acc;
  }, 0);
  const totalPending = totalRevenue - totalCredited;

  return (
    <div className="p-6 max-w-6xl mx-auto ml-[270px]">
      <h2 className="text-3xl text-center font-bold mb-6 text-[#f15b29]">
        Advance Program Revenue Sheet
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-700">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Booked Revenue</h3>
          <p className="text-2xl font-bold text-green-700">₹{totalBooked.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Credited Revenue</h3>
          <p className="text-2xl font-bold text-purple-700">₹{totalCredited.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Pending Revenue</h3>
          <p className="text-2xl font-bold text-orange-700">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Daily Revenue Section */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Daily Revenue</h2>
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mr-2">Select Month: </label>
          <select
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15b29]"
            value={selectedMonth || currentMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value={currentMonth}>Current Month ({currentMonth})</option>
            {months
              .filter((month) => month !== currentMonth)
              .map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">Date</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Total Revenue</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Credited Revenue</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Pending Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredDailyRevenue.length > 0 ? (
                filteredDailyRevenue.map(([date, data], index) => (
                  <tr key={date} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 p-3">{date}</td>
                    <td className="border border-gray-300 p-3">₹{data.total.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{data.credited.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{data.pending.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 p-3 text-center text-gray-500">
                    No revenue data available for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monthly Revenue Section */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Monthly Revenue (Last 3 Months)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">Month</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Total Revenue</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Credited Revenue</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Pending Revenue</th>
              </tr>
            </thead>
            <tbody>
              {months.length > 0 ? (
                months.map((month, index) => (
                  <tr key={month} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 p-3 font-medium">{month}</td>
                    <td className="border border-gray-300 p-3">₹{revenueByMonth[month].total.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{revenueByMonth[month].credited.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{revenueByMonth[month].pending.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 p-3 text-center text-gray-500">
                    No revenue data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Total Summary */}
      <section className="bg-gradient-to-r from-[#f15b29] to-[#d14a1f] text-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Overall Revenue Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg mb-2">
              <strong>Total Students:</strong> {advEnrollments.length}
            </p>
            <p className="text-lg mb-2">
              <strong>Total Revenue:</strong> ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-lg mb-2">
              <strong>Total Credited:</strong> ₹{totalCredited.toLocaleString()}
            </p>
            <p className="text-lg mb-2">
              <strong>Total Pending:</strong> ₹{totalPending.toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvTeamRevenue;
