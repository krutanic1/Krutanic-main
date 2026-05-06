import axios from "axios";
import React, { useState, useEffect } from "react";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const AdvOnBoardingDetails = () => {
  const [advEnrolls, setAdvEnrolls] = useState([]);
  const [filteredEnrolls, setFilteredEnrolls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [advOperation, setAdvOperation] = useState(null);
  const [selectedAdvOperation, setSelectedAdvOperation] = useState(null);

  const fetchAdvEnrolls = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollsData = response.data.data || [];
      // Filter out enrollments that already have an operation assigned
      const unassignedEnrolls = enrollsData.filter(
        (enroll) => !enroll.operationName && !enroll.operationId
      );
      setAdvEnrolls(unassignedEnrolls);
      setFilteredEnrolls(unassignedEnrolls);
    } catch (error) {
      console.error("Error fetching advance enrollments:", error);
      toast.error("Failed to fetch ADV enrollments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvOperation = async () => {
    try {
      const response = await axios.get(`${API}/getadvoperation`);
      setAdvOperation(response.data);
    } catch (error) {
      console.error("There was an error fetching ADV operation:", error);
      toast.error("Failed to fetch ADV operations");
    }
  };

  useEffect(() => {
    fetchAdvEnrolls();
    fetchAdvOperation();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const filtered = advEnrolls.filter((enroll) => {
      return (
        (enroll.email && enroll.email.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.phone && enroll.phone.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.fullname && enroll.fullname.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.counselor && enroll.counselor.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.operationName && enroll.operationName.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.domain && enroll.domain.toLowerCase().includes(value.toLowerCase())) ||
        (enroll.status && enroll.status.toLowerCase().includes(value.toLowerCase()))
      );
    });
    setFilteredEnrolls(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const groupedData = filteredEnrolls.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const handleDialogOpen = (item) => {
    setDialogData(item);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setDialogData(null);
  };

  const handleAdvOperationChange = async (e, rowId) => {
    const selectedValue = e.target.value;
    const selectedOption = advOperation.find(item => item.fullname === selectedValue);
    
    setSelectedAdvOperation(selectedOption);
    if (selectedOption) {
      const { fullname, _id } = selectedOption;
      try {
        const response = await axios.post(`${API}/update-adv-operation/${rowId}`, {
          operationName: fullname,
          operationId: _id,
        });
        if (response.status === 200) {
          toast.success('ADV Operation saved successfully');
          fetchAdvEnrolls();
        } else {
          toast.error('Failed to save the ADV operation');
        }
      } catch (error) {
        console.error('Error updating ADV operation:', error);
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred while saving the ADV operation';
        toast.error(errorMsg);
      }
    } else {
      toast.error('Please select a valid ADV operation');
    }
  };

  const handleStatusChange = async (enrollId, action) => {
    try {
      let updatedStatus = "";
      const isConfirmedChange = window.confirm(
        "Are you sure you want to change the status?"
      );
      if (isConfirmedChange) {
        if (action === "fullPaid") {
          updatedStatus = "fullPaid";
        } else if (action === "default") {
          updatedStatus = "default";
        }
        
        await axios.post(`${API}/updateadvenrollstatus`, {
          id: enrollId,
          status: updatedStatus,
        });
        
        toast.success(`Status changed to ${updatedStatus} successfully`);
        fetchAdvEnrolls();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const convertToIST = (utcDate) => {
    const date = new Date(utcDate);
    date.setHours(date.getHours() + 0);
    date.setMinutes(date.getMinutes() + 0);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div id="AdminAddCourse">
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <div id="loader">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="coursetable">
          <div className="mb-2">
            <h2>ADV Onboarding List:</h2>
            <section className="flex items-center gap-1">
              <div className="relative group inline-block">
                <i className="fa fa-info-circle text-lg cursor-pointer text-gray-500"></i>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                  Name, Email, Contact, Counselor Name, Operation Name, Domain, Status
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search here by"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-black px-2 py-1 rounded-lg"
              />
            </section>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>WhatsApp No</th>
                <th>Email</th>
                <th>Domain</th>
                <th>Month Opted</th>
                <th>Program Price</th>
                <th>Paid Amount</th>
                <th>BDA</th>
                <th>Executive</th>
                <th>Operation</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>More Details</th>
                <th>Assign ADV Operation</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).length > 0 ? (
                Object.keys(groupedData).sort((a, b) => {
                  const dateA = a.split("/").reverse().join("");
                  const dateB = b.split("/").reverse().join("");
                  return dateB.localeCompare(dateA);
                }).map((date) => (
                  <React.Fragment key={date}>
                    <tr>
                      <td colSpan="16" style={{ fontWeight: "bold" }}>
                        {date}
                      </td>
                    </tr>
                    {groupedData[date].map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td className="capitalize">{item.fullname || "N/A"}</td>
                        <td>{item.whatsAppNumber || item.phone || "N/A"}</td>
                        <td>{item.email || "N/A"}</td>
                        <td>{item.domain || "N/A"}</td>
                        <td>{item.monthOpted || "N/A"}</td>
                        <td className="text-green-600 font-bold">₹{item.programPrice || 0}</td>
                        <td>₹{item.paidAmount || 0}</td>
                        <td>{item.counselor || "N/A"}</td>
                        <td>{item.executive || item.lead || "N/A"}</td>
                        <td>{item.operationName || "N/A"}</td>
                        <td className="whitespace-nowrap">{item.clearPaymentMonth || "N/A"}</td>
                        <td>
                          <button
                            className="button"
                            onClick={() =>
                              handleStatusChange(item._id, "fullPaid")
                            }
                          >
                            <div className="relative group inline-block">
                              <i className="fa fa-money" aria-hidden="true"></i>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                FullPaid
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                              </div>
                            </div>
                          </button>
                          <button
                            className="button"
                            onClick={() =>
                              handleStatusChange(item._id, "default")
                            }
                          >
                            <div className="relative group inline-block">
                              <i className="fa fa-ban"></i>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-[9999] mb-2 hidden w-max bg-gray-800 text-white text-sm rounded-md py-2 px-3 group-hover:block">
                                Default
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-t-8 border-gray-800 border-x-8 border-x-transparent"></div>
                              </div>
                            </div>
                          </button>
                        </td>
                        <td>
                          <i
                            className="fa fa-info-circle text-2xl cursor-pointer"
                            onClick={() => handleDialogOpen(item)}
                          ></i>
                        </td>
                        <td>
                          {
                            advOperation && advOperation.length > 0 && (
                              <select 
                                className="border rounded-full border-black" 
                                onChange={(e) => handleAdvOperationChange(e, item._id)} 
                                defaultValue="Select ADV Operation"
                              >
                                <option value="Select ADV Operation" disabled>
                                  Select ADV Operation
                                </option>
                                {advOperation.map((op) => (
                                  <option key={op._id} value={op.fullname}>{op.fullname}</option>
                                ))}
                              </select>
                            )
                          }
                        </td>
                        <td>{convertToIST(item.createdAt)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="16">No data found</td>
                </tr>
              )}
            </tbody>
          </table>

          {dialogVisible && dialogData && (
            <div className="fixed flex flex-col rounded-md top-[30%] left-[50%] shadow-black shadow-sm transform translate-x-[-50%] transalate-y-[-50%] bg-white p-[20px] z-[1000]">
              <h2>ADV Enrollment Details</h2>
              <div className="space-y-2">
                <p>
                  <strong>Full Name:</strong> {dialogData.fullname || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {dialogData.phone || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {dialogData.email || "N/A"}
                </p>
                <p>
                  <strong>Domain:</strong> {dialogData.domain || "N/A"}
                </p>
                <p>
                  <strong>Program Price:</strong> ₹{dialogData.programPrice || 0}
                </p>
                <p>
                  <strong>Paid Amount:</strong> ₹{dialogData.paidAmount || 0}
                </p>
                <p className="text-red-600 font-bold">
                  <strong>Remaining Amount:</strong> ₹{dialogData.remainingAmount || 0}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {dialogData.transactionId || "N/A"}
                </p>
                <p>
                  <strong>Mode of Payment:</strong> {dialogData.modeofpayment || "N/A"}
                </p>
                <p>
                  <strong>Month Opted:</strong> {dialogData.monthOpted || "N/A"}
                </p>
                <p>
                  <strong>Clear Payment Month:</strong> {dialogData.clearPaymentMonth || "N/A"}
                </p>
                <p>
                  <strong>College Name:</strong> {dialogData.collegeName || "N/A"}
                </p>
                <p>
                  <strong>Branch:</strong> {dialogData.branch || "N/A"}
                </p>
                <p>
                  <strong>Year of Passing:</strong> {dialogData.yearOfPassingOut || "N/A"}
                </p>
                <p>
                  <strong>Company:</strong> {dialogData.companyName || "N/A"}
                </p>
                <p>
                  <strong>Role:</strong> {dialogData.role || "N/A"}
                </p>
                <p>
                  <strong>User Created:</strong>{" "}
                  <span style={{ color: dialogData.userCreated ? "green" : "red", fontWeight: "bold" }}>
                    {dialogData.userCreated ? "Yes ✓" : "No ✗"}
                  </span>
                </p>
                <p>
                  <strong>Mail Sent:</strong>{" "}
                  <span style={{ color: dialogData.mailSended ? "green" : "red", fontWeight: "bold" }}>
                    {dialogData.mailSended ? "Yes ✓" : "No ✗"}
                  </span>
                </p>
                <p>
                  <strong>Onboarding Sent:</strong>{" "}
                  <span style={{ color: dialogData.onboardingSended ? "green" : "red", fontWeight: "bold" }}>
                    {dialogData.onboardingSended ? "Yes ✓" : "No ✗"}
                  </span>
                </p>
                <p>
                  <strong>Offer Letter Sent:</strong>{" "}
                  <span style={{ color: dialogData.offerlettersended ? "green" : "red", fontWeight: "bold" }}>
                    {dialogData.offerlettersended ? "Yes ✓" : "No ✗"}
                  </span>
                </p>
                <p>
                  <strong>Batch Timing:</strong> {dialogData.batchTiming || "N/A"}
                </p>
              </div>
              <button
                className="bg-black px-4 py-1 text-white rounded-md mt-2"
                onClick={handleDialogClose}
              >
                Close
              </button>
            </div>
          )}
          {dialogVisible && (
            <div
              onClick={handleDialogClose}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvOnBoardingDetails;
