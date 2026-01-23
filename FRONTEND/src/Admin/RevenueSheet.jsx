import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../API";
import { toast } from "react-hot-toast";

const RevenueSheet = () => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0); // Store grand total from backend

  const [viewMode, setViewMode] = useState("monthly"); // "monthly" or "custom"
  const [selectedMonth, setSelectedMonth] = useState("");

  // Custom Date Range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination for Monthly Summary
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlyTotalPages, setMonthlyTotalPages] = useState(1);
  const monthlyLimit = 10;

  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(true);

  const [selectedLead, setSelectedLead] = useState("All");

  // Fetch Aggregated Monthly Stats (Bottom Table)
  const fetchMonthlyStats = async (page = 1) => {
    try {
      setLoadingMonthly(true);
      const response = await axios.get(`${API}/getmonthlyrevenue`, {
        params: { page, limit: monthlyLimit }
      });

      const { data, pagination } = response.data;

      setMonthlyStats(data);
      setMonthlyTotalPages(pagination.totalPages);
      setGrandTotal(pagination.grandTotal);

      // On first load, set default selected month to current month if available, else first in list
      if (!selectedMonth && data.length > 0) {
        const currentMonthStr = new Date().toLocaleString("default", { month: "long", year: "numeric" });
        const hasCurrent = data.find(m => m.month === currentMonthStr);
        setSelectedMonth(hasCurrent ? currentMonthStr : data[0].month);
      }
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      toast.error("Failed to load monthly revenue summary.");
    } finally {
      setLoadingMonthly(false);
    }
  };

  // Fetch Detailed Daily Data (Top Table) based on filters
  const fetchDailyData = async () => {
    try {
      setLoadingDaily(true);
      let params = { all: true };

      if (viewMode === "custom") {
        if (!startDate || !endDate) {
          // Don't fetch if dates are incomplete
          setLoadingDaily(false);
          return;
        }
        params = { ...params, startDate, endDate };
      } else {
        // Monthly Mode
        if (!selectedMonth) return;
        const [month, year] = selectedMonth.split(" ");
        params = { ...params, month, year };
      }

      const response = await axios.get(`${API}/getnewstudentenroll`, { params });
      setDailyData(response.data);
    } catch (error) {
      console.error("Error fetching daily data:", error);
      toast.error("Failed to load daily transactions.");
    } finally {
      setLoadingDaily(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchMonthlyStats(monthlyPage);
  }, [monthlyPage]);

  // Reload Daily Data when filters change
  useEffect(() => {
    if (viewMode === "monthly" && selectedMonth) {
      fetchDailyData();
    } else if (viewMode === "custom" && startDate && endDate) {
      fetchDailyData();
    }
  }, [selectedMonth, viewMode, startDate, endDate]);


  // Helper: Extract unique leads from the currently fetched daily data for the dropdown
  // Use a predefined list or merge with fetched data if needed. 
  // For consistency, we can collect all leads from monthlyStats (all time) or just dailyData.
  // Using dailyData ensures the dropdown filters what's visible.
  const uniqueLeads = ["All", ...new Set(dailyData.map(student => student.lead).filter(Boolean))].sort();

  // --- Calculations for Daily Table (Client-side aggregation of the *fetched subset*) ---

  // Group dailyData by Date for the "Daily Revenue" table display
  const revenueByDay = {};

  // Filter by selected lead (Client-side filter of the fetched subset)
  const filteredDailyTransactions = selectedLead === "All"
    ? dailyData
    : dailyData.filter(student => student.lead === selectedLead);

  filteredDailyTransactions.forEach(student => {
    const date = new Date(student.createdAt).toLocaleDateString("en-GB");
    const revenue = student.programPrice || 0;
    const booked = student.paidAmount || 0;

    // Credited logic match original: fullPaid or remark 'Half_Cleared'
    const credited = student.status === "fullPaid" || (Array.isArray(student.remark) && student.remark[student.remark.length - 1] === "Half_Cleared") ? student.paidAmount || 0 : 0;
    const pending = revenue - credited;

    if (!revenueByDay[date]) {
      revenueByDay[date] = {
        date,
        total: 0,
        booked: 0,
        credited: 0,
        pending: 0,
        payments: 0,
        paymentsByLead: {}
      };
    }

    revenueByDay[date].total += revenue;
    revenueByDay[date].booked += booked;
    revenueByDay[date].credited += credited;
    revenueByDay[date].pending += pending;
    revenueByDay[date].payments += 1;

    if (student.lead) {
      revenueByDay[date].paymentsByLead[student.lead] = (revenueByDay[date].paymentsByLead[student.lead] || 0) + 1;
    }
  });

  const dailyRows = Object.values(revenueByDay).sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));


  return (
    <div className="p-6 ml-[270px] mx-auto">

      {/* --- Controls Section --- */}
      <section className="mb-8 bg-white p-4 rounded shadow-sm border">
        <div className="flex flex-wrap gap-6 items-end">

          {/* View Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold mb-1">View Mode</label>
            <div className="flex rounded border overflow-hidden">
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 text-sm ${viewMode === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewMode("custom")}
                className={`px-4 py-2 text-sm ${viewMode === "custom" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                Custom Date Range
              </button>
            </div>
          </div>

          {/* Monthly Dropdown */}
          {viewMode === "monthly" && (
            <div>
              <label className="block text-sm font-semibold mb-1">Select Month</label>
              <select
                className="border p-2 rounded min-w-[200px]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="" disabled>Select Month</option>
                {/* Dropdown shows currently loaded months from pagination. 
                           Limitation: Might not show ALL months if paginated. 
                           Optimally, one might specifically fetch just month names for the dropdown 
                           or relying on the user to locate the month in the table or date picker.
                           For now, showing loaded months. 
                       */}
                {monthlyStats.map(stat => (
                  <option key={stat.month} value={stat.month}>{stat.month}</option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Date Range Inputs */}
          {viewMode === "custom" && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button
                onClick={fetchDailyData}
                className="bg-blue-600 text-white px-4 py-2 rounded h-[42px] hover:bg-blue-700"
              >
                Apply
              </button>
            </>
          )}

          {/* Lead Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Filter by Payment Type</label>
            <select
              className="border p-2 rounded w-[200px]"
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
            >
              {uniqueLeads.map(lead => (
                <option key={lead} value={lead}>{lead}</option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* --- Daily Revenue Section --- */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {viewMode === "monthly" ? `${selectedMonth || "Monthly"} Revenue Breakdown` : "Custom Range Revenue Breakdown"}
          </h2>
          {loadingDaily && <span className="text-blue-600 text-sm animate-pulse">Loading Details...</span>}
        </div>

        <div className="overflow-x-auto bg-white rounded shadow-sm">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Total Revenue</th>
                <th className="border p-3 text-left">Credited Revenue</th>
                <th className="border p-3 text-left">Pending Revenue</th>
                <th className="border p-3 text-left center">No. of Payments</th>

              </tr>
            </thead>
            <tbody>
              {dailyRows.length > 0 ? (
                dailyRows.map((data, index) => (
                  <tr key={data.date} className={`text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="border p-3">{data.date}</td>
                    <td className="border p-3">₹{data.total.toFixed(2)}</td>
                    <td className="border p-3">₹{data.credited.toFixed(2)}</td>
                    <td className="border p-3">₹{data.pending.toFixed(2)}</td>
                    <td className="border p-3 text-center">{data.payments}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    {loadingDaily ? "Fetching data..." : "No records found for this period."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Monthly Summary Section --- */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue Summary (All Time)</h2>
        <div className="overflow-x-auto bg-white rounded shadow-sm">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="text-sm">
                <th className="border p-3 text-left">Month</th>
                <th className="border p-3 text-left">Total Revenue</th>
                <th className="border p-3 text-left">Credited Revenue</th>
                <th className="border p-3 text-left">Pending Revenue</th>
                <th className="border p-3 text-center">Total Payments</th>

              </tr>
            </thead>
            <tbody>
              {loadingMonthly ? (
                <tr><td colSpan="5" className="p-4 text-center">Loading Summary...</td></tr>
              ) : (
                monthlyStats.map((stat, index) => (
                  <tr key={stat.month} className={`text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="border p-3 font-medium">{stat.month}</td>
                    <td className="border p-3">₹{stat.total.toFixed(2)}</td>
                    <td className="border p-3">₹{stat.credited.toFixed(2)}</td>
                    <td className="border p-3">₹{stat.pending.toFixed(2)}</td>
                    <td className="border p-3 text-center">{stat.payments}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 border rounded ${monthlyPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            onClick={() => setMonthlyPage(p => Math.max(1, p - 1))}
            disabled={monthlyPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {monthlyPage} of {monthlyTotalPages}
          </span>
          <button
            className={`px-4 py-2 border rounded ${monthlyPage >= monthlyTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            onClick={() => setMonthlyPage(p => Math.min(monthlyTotalPages, p + 1))}
            disabled={monthlyPage >= monthlyTotalPages}
          >
            Next
          </button>
        </div>
      </section>

      <section className="text-lg font-semibold bg-gray-50 p-4 rounded border">
        <h2 className="text-xl font-semibold mb-2">Total Revenue Till Now</h2>
        <p className="mb-2 text-2xl text-green-700">
          {/* Fallback to 0 if grandTotal logic fails or isn't arrived yet */}
          ₹{grandTotal ? grandTotal.toFixed(2) : "0.00"}
        </p>
      </section>
    </div>
  );
};

export default RevenueSheet;