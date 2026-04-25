import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvTeamFullPaid = () => {
  const [fullPaidEnrollments, setFullPaidEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const advTeamName = localStorage.getItem("advTeamName");

  const fetchFullPaidEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;

      const filtered = enrollments.filter(
        (item) =>
          item.status === "fullPaid" &&
          item.counselor === advTeamName
      );

      setFullPaidEnrollments(filtered);
    } catch (error) {
      console.error("Error fetching full paid enrollments:", error);
      toast.error("Failed to load full paid enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullPaidEnrollments();
  }, []);

  if (loading) {
    return (
      <div id="BdaPanel">
        <div className="loading-container">
          <p>Loading full paid enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="coursetable">
        <div className="flex justify-between items-center mb-4">
          <h2>Full Paid Advance Program Enrollments</h2>
          <span className="bg-[#f15b29] text-white px-3 py-1 rounded-full text-sm font-semibold">Total Full Paid: {fullPaidEnrollments.length}</span>
        </div>

        {fullPaidEnrollments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No full paid enrollments found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Domain</th>
                <th>Program</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>Month Opted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fullPaidEnrollments.map((enrollment, index) => (
                <tr key={enrollment._id}>
                  <td>{index + 1}</td>
                  <td>{enrollment.fullname}</td>
                  <td>{enrollment.email}</td>
                  <td>{enrollment.phone}</td>
                  <td>{enrollment.domain}</td>
                  <td>{enrollment.program}</td>
                  <td className="text-green-600 font-bold">₹{enrollment.programPrice?.toLocaleString()}</td>
                  <td>₹{enrollment.paidAmount?.toLocaleString()}</td>
                  <td className="whitespace-nowrap">{enrollment.monthOpted}</td>
                  <td>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-400">
                      {enrollment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdvTeamFullPaid;
