import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";

const AlumniData = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const response = await axios.get(`${API}/alumni-data`);
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
        <h2 >Alumni Review Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : alumniList.length === 0 ? (
          <p style={{ textAlign: "center" }}>No alumni data available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Graduation Year</th>
                <th>Current Company</th>
                <th>Years of Experience</th>
                <th>Advanced Domains</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {alumniList.map((alumni, index) => (
                <tr key={index}>
                  <td>{alumni.fullName || "N/A"}</td>
                  <td>{alumni.contact || "N/A"}</td>
                  <td>{alumni.email || "N/A"}</td>
                  <td>{alumni.graduationYear || "N/A"}</td>
                  <td>{alumni.currentCompany || "N/A"}</td>
                  <td>{alumni.yearsOfExperience ?? "N/A"}</td>
                  <td>
                    {alumni.advancedDomains?.length
                      ? alumni.advancedDomains.join(", ")
                      : "None"}
                  </td>
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
  );
};

export default AlumniData;