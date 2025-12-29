import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
const ReferAndEarnResponse = () => {

      const [alumniList, setAlumniList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const response = await axios.get(`${API}/referandearn`);
        if (response.data.success) {
          setAlumniList(response.data.data);
        } else {
          setError("Failed to load alumni data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  return (
    <div id="AdminAddCourse">
      <div className="coursetable">
        <h2>Refer And Earn Responses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : alumniList.length === 0 ? (
          <p style={{ textAlign: "center" }}>No data available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                 <th>S.No</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Friend's Name</th>
                <th>Friend's Contact</th>
                <th>Friend's College</th>
                <th>Course</th>
                <th>Date and Time</th>
              </tr>
            </thead>
            <tbody>
              {alumniList.map((alumni, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                  <td>{alumni.name || "N/A"}</td>
                  <td>{alumni.phone || "N/A"}</td>
                  <td>{alumni.friendName || "N/A"}</td>
                  <td>{alumni.friendPhone || "N/A"}</td>
                  <td>{alumni.friendCollege || "N/A"}</td>
                  <td>{alumni.course ?? "N/A"}</td>
                  <td>
                    {alumni.createdAt
                      ? new Date(alumni.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ReferAndEarnResponse
