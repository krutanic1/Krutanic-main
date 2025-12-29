import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';

const BDARevenueSheet = () => {
  const [newStudent, setNewStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewStudent = async () => {
    const bdaName = localStorage.getItem("bdaName");
    try {
      const response = await axios.get(`${API}/getnewstudentenroll`);
      const filteredData = response.data.filter(
        (item) => item.counselor && item.counselor === bdaName
      );
      setNewStudent(filteredData);
    } catch (err) {
      setError("There was an error fetching new students.");
      console.error("Error fetching new students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewStudent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const revenueByDay = {};
  const revenueByMonth = {};
  let totalRevenue = 0;

 
  newStudent.forEach((student) => {
    const date = new Date(student.createdAt).toLocaleDateString("en-GB");
    const month = new Date(student.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    const revenue = student.programPrice || 0;
    const credited = (student.paidAmount || 0) - (student.defaultAmount || 0);
    const pending = revenue - credited;


    if (!revenueByDay[date]) {
      revenueByDay[date] = { total: 0, credited: 0, pending: 0 };
    }
    revenueByDay[date].total += revenue;
    revenueByDay[date].credited += credited;
    revenueByDay[date].pending += pending;

    
    if (!revenueByMonth[month]) {
      revenueByMonth[month] = { total: 0, credited: 0, pending: 0 };
    }
    revenueByMonth[month].total += revenue;
    revenueByMonth[month].credited += credited;
    revenueByMonth[month].pending += pending;

    totalRevenue += revenue;
  });

  const months = Object.keys(revenueByMonth);
  months.sort((a, b) => new Date(a) - new Date(b));

  let growthPercentage = null;
  if (months.length > 1) {
    const lastMonth = revenueByMonth[months[months.length - 2]].total || 0;
    const currentMonth = revenueByMonth[months[months.length - 1]].total || 0;
    if (lastMonth > 0) {
      growthPercentage = ((currentMonth - lastMonth) / lastMonth) * 100;
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">BDA Revenue Sheets</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-left">Total Revenue</th>
                <th className="border p-3 text-left">Credited Revenue</th>
                <th className="border p-3 text-left">Pending Revenue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(revenueByDay).map(([date, data], index) => (
                <tr key={date} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border p-3">{date}</td>
                  <td className="border p-3">₹{data.total.toFixed(2)}</td>
                  <td className="border p-3">₹{data.credited.toFixed(2)}</td>
                  <td className="border p-3">₹{data.pending.toFixed(2)}</td>
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
              </tr>
            </thead>
            <tbody>
              {Object.entries(revenueByMonth).map(([month, data], index) => (
                <tr key={month} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border p-3">{month}</td>
                  <td className="border p-3">₹{data.total.toFixed(2)}</td>
                  <td className="border p-3">₹{data.credited.toFixed(2)}</td>
                  <td className="border p-3">₹{data.pending.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="text-lg font-semibold">
        <h2 className="text-xl font-semibold mb-2">Total Revenue Till Now</h2>
        <p className="mb-2">
          <strong>Total Revenue:</strong> ₹{totalRevenue.toFixed(2)}
        </p>
        {growthPercentage !== null && (
          <p className={growthPercentage >= 0 ? "text-green-600" : "text-red-600"}>
            {growthPercentage >= 0 ? "Growth" : "Loss"}: {growthPercentage.toFixed(2)}%
          </p>
        )}
      </section>
    </div>
  );
};

export default BDARevenueSheet;
