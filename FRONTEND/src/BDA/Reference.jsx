import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Reference = () => {
  const [newStudent, setNewStudent] = useState([]);
  const fetchNewStudent = async () => {
    const bdaName = localStorage.getItem("bdaName");
    try {
      const response = await axios.get(`${API}/databybdaname`, {
        params: { bdaName },
      });
      setNewStudent(response.data);
    } catch (error) {
      console.error("There was an error fetching new student:", error);
    }
  };
  useEffect(() => {
    fetchNewStudent();
  }, []);

  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    const indianTime = new Date(date.getTime() + (5 * 60 + 30) * 60000);
    return indianTime.toISOString().replace("T", " ").split(".")[0];
  };

  const [referRemarks, setReferRemarks] = useState("");
  const handleReferRemarkChange = async (e, studentId) => {
    const selectedRemark = e.target.value;
    if (!selectedRemark) {
      console.error("No remark selected");
      return;
    }
    setReferRemarks(selectedRemark);
    if (selectedRemark && studentId) {
      try {
        const response = await axios.post(`${API}/updateremark`, {
          referRemark: selectedRemark,
          studentId: studentId,
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchNewStudent();
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error("An error occurred while updating the remark.");
      }
    }
  };

  return (
    <div className="ml-[270px]">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-center my-2 font-bold">Reference by your Leads</h2>
      {newStudent.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table className="bdarevenuetable">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Refer Friend</th>
              <th>Time</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {newStudent.filter(
              (student) =>
                student.referFriend && student.referFriend.length > 10
            ).length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No reference found
                </td>
              </tr>
            ) : (
              newStudent.map((student, index) => {
                if (student.referFriend && student.referFriend.length > 10) {
                  return (
                    <tr
                      key={index}
                      className={`${
                        student.referRemark[student.referRemark.length - 1]
                      }`}
                    >
                      <td>
                        {newStudent
                          .filter(
                            (s) => s.referFriend && s.referFriend.length > 10
                          )
                          .indexOf(student) + 1}
                      </td>
                      <td>{student.fullname}</td>
                      <td>{student.phone}</td>
                      <td>{student.referFriend}</td>
                      <td>{convertToIST(student.createdAt)}</td>
                      <td>
                        {student.referRemark[student.referRemark.length - 1]}
                      </td>
                      <td>
                        <select
                          className="border rounded-full border-black"
                          onChange={(e) =>
                            handleReferRemarkChange(e, student._id)
                          }
                          defaultValue="Select Remark"
                          name="referremark"
                          id="referremark"
                        >
                          <option disabled value="Select Remark">
                            Select Remark
                          </option>
                          <option value="Paid">Paid</option>
                          <option value="NotInterested">Not Interested</option>
                        </select>
                      </td>
                    </tr>
                  );
                }
                return null;
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reference;
