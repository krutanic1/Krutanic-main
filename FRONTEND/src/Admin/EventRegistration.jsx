import axios from 'axios';
import React, { useEffect, useState } from 'react';
import API from '../API';
import toast, { Toaster } from "react-hot-toast";

const EventRegistration = () => {
  const [showAppliedDetails, setShowAppliedDetails] = useState(null);
  const [isRedeemVisible, setisRedeemVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [eventRegistration, setEventRegistration] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/alleventregistrations`);
      // console.log("event registration", response.data);
      setEventRegistration(response.data);
    } catch (error) {
      console.error("There was an error fetching event registration data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventRegistration();
  }, []);



  const handleDetails = (register) => {
    const Details = register.applicationData || []; 
    setShowAppliedDetails(Details);
  }

 const [DataForm, setDataForm] = useState({
    coins: "",
    remarks: "",
  });
   const handleChangeCoins = (event) => {
    const { name, value } = event.target;
    setDataForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clear = () => {
    setisRedeemVisible(false);
    setDataForm({
      coins: "",
      remarks: "",
    });
  };

  const handleRedeemCoins = (userId) => {
    setSelectedUserId(userId); 
    setisRedeemVisible(true);
  };

  const RedeemCoins = async (e) => {
    e.preventDefault();
    // console.log("User ID:", selectedUserId);
    try {
      await axios.post(`${API}/redeemcoins`, {
        userId: selectedUserId,
        coin: DataForm.coins,
        remarks: DataForm.remarks,
      });
      toast.success("Redeemed coins successfully!");
      setisRedeemVisible(false);
      clear();
      fetchEventRegistration();
    } catch (error) {
      console.error("Error", error.response?.data || error.message);
    }
  };



  return (
    <div id="AdminAddCourse">
       <Toaster position="top-center" reverseOrder={false} />
       {showAppliedDetails && (
        <div className="jobdetails">
          <div className="jobdetailsdiv">
            <div className="title">
              <h2>Coins Details</h2>
              <span onClick={() => setShowAppliedDetails(null)}>✖</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Sl</th>
                  <th>Remarks</th>
                  <th>CreadtedAt</th>
                  <th>Coin</th>
                </tr>
              </thead>
              <tbody>
              {showAppliedDetails.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.remarks}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>{user.coin}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

       {/* redeem coins */}
      {isRedeemVisible && (
        <div className="form">
          <form onSubmit={(e) => RedeemCoins(e)}>
            <h2>Redeem Coins</h2>
            <span onClick={clear}>✖</span>
            <input
              value={DataForm.remarks}
              onChange={handleChangeCoins}
              type="text"
              name="remarks"
              id="remarks"
              placeholder="Enter Remarks"
            />
            <input
              value={DataForm.coins}
              onChange={handleChangeCoins}
              type="number"
              name="coins"
              id="coins"
              placeholder="Enter Coins"
            />
            <input
              className="cursor-pointer"
              type="submit"
              value="Redeem Coins"
            />
          </form>
        </div>
      )}

      <div className="coursetable">
          <h2>Event Registration Lists</h2>
        {loading ? (
          <div id="loader">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email Id</th>
                <th>Student College Mail Id</th>
                <th>Year of Study</th>
                <th>College Name</th>
                <th>Total Coins</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {eventRegistration.map((register, index) => (
                <tr key={register._id}>
                  <td>{index + 1}</td>
                  <td>{register.name}</td>
                  <td>{register.phone}</td>
                  <td>{register.email}</td>
                  <td>{register.collegeEmailId}</td>
                  <td>{register.yearofstudy}</td>
                  <td>{register.collegeName}</td>
                  <td className='cursor-pointer' onClick={()=>handleDetails(register)}>{register.totalCoins}</td>
                  <td onClick={() => handleRedeemCoins(register._id)} className='cursor-pointer font-bold text-blue-700'> Redeem Coins</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EventRegistration;
