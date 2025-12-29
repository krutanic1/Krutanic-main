import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const groupByDate = (queries) => {
  return queries.reduce((acc, query) => {
    const date = formatDate(query.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(query);
    return acc;
  }, {});
};

const MentorQueries = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bda, setBda] = useState([]);
  const itemsPerPage = 25;

  const getQueries = async () => {
    try {
      const response = await axios.get(`${API}/mentorqueries`);
      setQueries(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchBda = async () => {
    try {
      const response = await axios.get(`${API}/getbda`);
      setBda(response.data);
    } catch (error) {
      console.error("There was an error fetching bda:", error);
    } finally {
    }
  };

  useEffect(() => {
    getQueries();
    fetchBda();
  }, []);

  const groupedQueries = groupByDate(queries);

  const flatQueries = [];
  Object.keys(groupedQueries).forEach((date) => {
    flatQueries.push({ type: "date", date });
    groupedQueries[date].forEach((query) => flatQueries.push(query));
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQueries = flatQueries.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(flatQueries.length / itemsPerPage);

  const getBackgroundColor = (value) => {
    switch (value) {
      case "Shared":
        return "bg-blue-800";
      case "Not Interested":
        return "bg-red-800";
      case "Already Paid":
        return "bg-green-800";
      default:
        return "bg-gray-500";
    }
  };

  const handleSelectChange = async (event, id) => {
    const updatedAction = event.target.value;
    try {
      await axios.put(`${API}/queriesaction/${id}`, { action: updatedAction });
      toast.success("Query updated successfully");
      getQueries();
    } catch (error) {
      console.error("Error updating query:", error);
    }
  };

  const handleBdaAsign = async(e , leadid)=>{
    const updatedAction = e.target.value;
    console.log("bda asign" , leadid , updatedAction);
    try {
      await axios.put(`${API}/bdaasign/${leadid}`, { bda: updatedAction , action:"Shared"
        });
        toast.success("BDA Asigned");
        getQueries();
        } catch (error) {
          console.error("Error updating query:", error);
          }
  }

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-center my-3">Mentorship Course Queries</h2>
      <div className="coursetable">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College Email</th>
              <th>Phone</th>
              <th>College Name</th>
              <th>Domain</th>
              <th>Reason</th>
              <th>Study Year</th>
              <th>Time</th>
              <th>Action</th>
              <th>Asign</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQueries.length > 0 ? (
              paginatedQueries.map((item, index) =>
                item.type === "date" ? (
                  <tr key={`date-${item.date}`}>
                    <td
                      colSpan="11"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#f0f0f0",
                        textAlign: "center",
                      }}
                    >
                      {item.date}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={item._id}
                    className={`text-white rounded-full ${getBackgroundColor(
                      item.action
                    )}`}
                  >
                    <td className="capitalize">{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.collegeEmail}</td>
                    <td>{item.phone}</td>
                    <td className="capitalize">{item.collegeName}</td>
                    <td className="capitalize">{item.domain}</td>
                    <td>{item.reason}</td>
                    <td>{item.passingyear}</td>
                    <td className="uppercase">
                      {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>
                      <select
                        value={item.action}
                        onChange={(event) =>
                          handleSelectChange(event, item._id)
                        }
                        className={`text-white rounded-full border  ${getBackgroundColor(
                          item.action || "Unseen"
                        )}`}
                      >
                        <option value="Unseen">Unseen</option>
                        <option className="bg-blue-600" value="Shared">
                          Shared
                        </option>
                        <option className="bg-red-600" value="Not Interested">
                          Not Interested
                        </option>
                        <option className="bg-green-600" value="Already Paid">
                          Already Paid
                        </option>
                      </select>
                    </td>
                    <td>
                      {bda && bda.length > 0 && (
                        <select
                        value={item.bda}
                          onChange={(e) => handleBdaAsign(e, item._id)}
                          className="border rounded-full text-black border-black"
                          defaultValue="Select Bda"
                        >
                          <option value="Select Bda">Select Bda</option>
                          {bda.map((item) => (
                            <option value={item.fullname}>
                              {item.fullname}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="11">No Queries Found</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <section className="flex justify-center items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`text-3xl px-4  ${
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <i className="fa fa-chevron-circle-left"></i>
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage >= totalPages}
            className="text-3xl px-4"
          >
            <i
              class={`fa fa-chevron-circle-right ${
                currentPage >= totalPages
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              } `}
            ></i>
          </button>
        </section>
      </div>
    </div>
  );
};

export default MentorQueries;
