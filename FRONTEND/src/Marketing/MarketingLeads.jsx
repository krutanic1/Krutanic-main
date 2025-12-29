import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const MarketingLeads = () => {
  const marketingToken = localStorage.getItem("marketingToken");
  const [allLeads, setAllLeads] = useState("");
  const [executive, setExecutive] = useState("");

  const fetchMarketingData = async () => {
    try {
      const response = await axios.get(`${API}/getmarketingleadsall`, {
        params: { marketingToken },
      });
      setAllLeads(response.data);
      console.log("hi", response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    }
  };

  const fetchExecutive = async () => {
    try {
      const response = await axios.get(`${API}/getmarketingexecutive`, {
        params: { marketingToken },
      });
      setExecutive(response.data);
      console.log("executive", response.data);
    } catch (err) {
      console.log("Failed to fetch data");
    }
  };

  const handleExecutiveChange = async (e, leadId) => {
    const selectedExecutiveName = e.target.value;
    const selectedExecutiveId =
      e.target.options[e.target.selectedIndex].dataset.execid;
    console.log(
      "Selected Executive:",
      selectedExecutiveName,
      selectedExecutiveId,
      leadId
    );

    try {
      const response = await axios.put(
        `${API}/marketingUpdateExecutive/${leadId}`,
        {
          executiveid: selectedExecutiveId,
          executivename: selectedExecutiveName,
        }
      );

      console.log("Executive updated successfully:", response.data);
      setAllLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? { ...lead, executive: selectedExecutiveName }
            : lead
        )
      );
    } catch (err) {
      console.error("Failed to update executive:", err.message);
    }
  };

  useEffect(() => {
    fetchMarketingData();
    fetchExecutive();
  }, []);

  return (
    <div id="MarketingLeads">
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(allLeads) && allLeads.length > 0 ? (
              allLeads.map((lead, index) => (
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
                  <td>
                    {executive && executive.length > 0 && (
                      <select
                        className="border rounded-full border-black "
                        onChange={(e) => handleExecutiveChange(e, lead._id)}
                        defaultValue="Select Executive"
                      >
                        <option value="">Select Executive</option>
                        {executive.map((item) => (
                          <option
                            key={item._id}
                            value={item.fullname}
                            data-execid={item._id}
                          >
                            {item.fullname}{" "}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
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

export default MarketingLeads;
