import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API from "../API";

const RevenueSheet = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState("All");
  const hasFetched = useRef(false);

  const fetchNewStudent = async () => {
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      setNewStudent(response.data);
    } catch (err) {
      setError("There was an error fetching new students.");
      console.error("Error fetching new students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchNewStudent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Extract unique lead names dynamically from all students
  const uniqueLeads = [...new Set(newStudent.map(student => student.lead).filter(Boolean))].sort();

  // Create a helper to initialize paymentsByLead object
  const createPaymentsByLeadObject = () => {
    const obj = {};
    uniqueLeads.forEach(lead => {
      obj[lead] = 0;
    });
    return obj;
  };

  const revenueByDay = {};
  const revenueByMonth = {};
  let totalRevenue = 0;

  // Filter students based on selected lead
  const filteredStudents = selectedLead === "All"
    ? newStudent
    : newStudent.filter(student => student.lead === selectedLead);

  filteredStudents.forEach((student) => {
    const date = new Date(student.createdAt).toLocaleDateString("en-GB");
    const month = new Date(student.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const revenue = student.programPrice || 0;
    const booked = student.paidAmount || 0;
    const credited = student.status === "fullPaid" || (Array.isArray(student.remark) && student.remark[student.remark.length - 1] === "Half_Cleared") ? student.paidAmount || 0 : 0;
    const pending = revenue - credited;


    if (!revenueByDay[date]) {
      revenueByDay[date] = { total: 0, booked: 0, credited: 0, pending: 0, payments: 0, paymentsByLead: createPaymentsByLeadObject(), month };
    }
    if (!revenueByMonth[month]) {
      revenueByMonth[month] = { total: 0, booked: 0, credited: 0, pending: 0, payments: 0, paymentsByLead: createPaymentsByLeadObject() };
    }

    revenueByDay[date].total += revenue;
    revenueByDay[date].booked += booked;
    revenueByDay[date].credited += credited;
    revenueByDay[date].pending += pending;
    revenueByDay[date].payments += 1;

    revenueByMonth[month].total += revenue;
    revenueByMonth[month].booked += booked;
    revenueByMonth[month].credited += credited;
    revenueByMonth[month].pending += pending;

    revenueByMonth[month].payments += 1;

    // Count payment based on student.lead dynamically
    if (student.lead && revenueByDay[date].paymentsByLead.hasOwnProperty(student.lead)) {
      revenueByDay[date].paymentsByLead[student.lead] += 1;
      revenueByMonth[month].paymentsByLead[student.lead] += 1;
    }

    totalRevenue += revenue;
  });

  // Generate all months from the earliest enrollment date to the current month (lifetime revenue)
  const months = [];

  // Find the earliest enrollment date
  let earliestDate = new Date();
  if (filteredStudents.length > 0) {
    earliestDate = new Date(
      Math.min(...filteredStudents.map(student => new Date(student.createdAt)))
    );
  }

  // Generate months from earliest date to current date
  const currentDate = new Date();
  const startYear = earliestDate.getFullYear();
  const startMonth = earliestDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  // Loop through all months from earliest to current
  for (let year = currentYear; year >= startYear; year--) {
    const endMonth = (year === currentYear) ? currentMonthIndex : 11;
    const beginMonth = (year === startYear) ? startMonth : 0;

    for (let month = endMonth; month >= beginMonth; month--) {
      const date = new Date(year, month, 1);
      months.push(date.toLocaleString("default", { month: "long", year: "numeric" }));
    }
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const filteredDailyRevenue = Object.entries(revenueByDay).filter(
    ([, data]) => data.month === (selectedMonth || currentMonth)
  );




  return (
    <div className="p-6 ml-[270px] mx-auto">
      <h2 className="text-center  font-bold mb-6"></h2>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
        <div className="mb-4">
          <label className="font-semibold">Select Month: </label>
          <select
            className="border p-2 rounded"
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
        <div className="mb-4">
          <label className="font-semibold">Select Payment Type: </label>
          <select
            className="border p-2 rounded"
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueLeads.map(lead => (
              <option key={lead} value={lead}>{lead}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Total Revenue</th>
                <th className="border p-3 text-left">Credited Revenue</th>
                <th className="border p-3 text-left">Pending Revenue</th>
                <th className="border p-3 text-left">Total No Of Payments</th>
                {selectedLead === "All" ? (
                  <>
                    {uniqueLeads.map(lead => (
                      <th key={lead} className="border p-3 text-left">{lead} Payments</th>
                    ))}
                  </>
                ) : (
                  <th className="border p-3 text-left">{selectedLead} Payments</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredDailyRevenue.map(([date, data], index) => (
                <tr key={date} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border p-3">{date}</td>
                  <td className="border p-3">₹{data.total.toFixed(2)}</td>
                  <td className="border p-3">₹{data.credited.toFixed(2)}</td>
                  <td className="border p-3">₹{data.pending.toFixed(2)}</td>
                  <td className="border p-3">{revenueByDay[date].payments}</td>
                  {selectedLead === "All" ? (
                    <>
                      {uniqueLeads.map(lead => (
                        <td key={lead} className="border p-3">{data.paymentsByLead?.[lead] || 0}</td>
                      ))}
                    </>
                  ) : (
                    <td className="border p-3">
                      {data.paymentsByLead?.[selectedLead] || 0}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Month</th>
                <th className="border p-3 text-left">Total Revenue</th>
                <th className="border p-3 text-left">Credited Revenue</th>
                <th className="border p-3 text-left">Pending Revenue</th>
                <th className="border p-3 text-left">Total No Of Payments</th>
                {uniqueLeads.map(lead => (
                  <th key={lead} className="border p-3 text-left">{lead} Payments</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((month, index) => {
                const monthData = revenueByMonth[month] || { total: 0, credited: 0, pending: 0, payments: 0, paymentsByLead: createPaymentsByLeadObject() };
                return (
                  <tr key={month} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border p-3">{month}</td>
                    <td className="border p-3">₹{monthData.total.toFixed(2)}</td>
                    <td className="border p-3">₹{monthData.credited.toFixed(2)}</td>
                    <td className="border p-3">₹{monthData.pending.toFixed(2)}</td>
                    <td className="border p-3">{monthData.payments}</td>
                    {uniqueLeads.map(lead => (
                      <td key={lead} className="border p-3">{monthData.paymentsByLead?.[lead] || 0}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="text-lg font-semibold">
        <h2 className="text-xl font-semibold mb-2">Total Revenue Till Now</h2>
        <p className="mb-2">
          <strong>Total Revenue:</strong> ₹{totalRevenue.toFixed(2)}
        </p>

        {/* {growthPercentage !== null && (
          <p className={growthPercentage >= 0 ? "text-green-600" : "text-red-600"}>
            {growthPercentage >= 0 ? "Growth" : "Loss"}: {growthPercentage.toFixed(2)}%
          </p>
        )} */}
      </section>
    </div>
  );
};

export default RevenueSheet;