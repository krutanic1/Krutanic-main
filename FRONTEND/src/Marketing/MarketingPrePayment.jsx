import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const MarketingPrePayment = () => {
  const marketingToken = localStorage.getItem("marketingToken");
  const marketingName = localStorage.getItem("marketingUser");
  const [leadsData, setLeadsData] = useState("");

  const fetchLeadData = async () => {
    try {
      const response = await axios.get(`${API}/getmarketingpreviousleads`, {
        params: { marketingToken },
      });
      setLeadsData(response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, []);

  return (
    <div id="MarketingDashboard">
      <div className="welcomeDiv">
        <strong>WELCOME</strong>
        <h2>{marketingName}</h2>
        <h2>
          {new Date( new Date().getFullYear(),new Date().getMonth() - 1, new Date().getDate()).toLocaleDateString("en-US", { year: "numeric", month: "long",})}
        </h2>
        <strong>No. of Payment : {leadsData.length}</strong>
      </div>
      <div className="tablediv">
        <table>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Date</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>phone</th>
              <th>college Name</th>
              <th>year of study</th>
              <th>branch</th>
              <th>Domain</th>
              <th>Program Price</th>
              <th>Month Opted</th>
              <th>BDA</th>
              <th>Executive</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(leadsData) && leadsData.length > 0 ? (
              leadsData.map((lead, index) => (
                <tr key={lead._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{lead.fullname || "-"}</td>
                  <td>{lead.email || "-"}</td>
                  <td>{lead.phone || "-"}</td>
                  <td>{lead.collegeName || "-"}</td>
                  <td>{lead.yearOfStudy || "-"}</td>
                  <td>{lead.branch || "-"}</td>
                  <td>{lead.domain || "-"}</td>
                  <td>{lead.programPrice || "-"}</td>
                  <td>{lead.monthOpted || "-"}</td>
                  <td>{lead.counselor || "-"}</td>
                  <td>{lead.executive || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="13"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketingPrePayment;
