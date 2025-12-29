import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import debounce from "lodash/debounce";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const userEmail = localStorage.getItem("userEmail");
  const [enrollData, setenrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const fetchenrollData = debounce(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/enrollments`, {
        params: { userEmail },
      });
      // console.log("data" , response.data);
      setenrollData(response.data);
      // console.log(response.data[0].createdAt);

      // setenrollData(response.data.filter((item) => item.email === userEmail));
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSubmit = async (data) => {
    const createdAt = new Date(data.createdAt);
    const currentDate = new Date();
    const eligibleDate = new Date(createdAt);
    eligibleDate.setMonth(createdAt.getMonth() + 2);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const eligibleDateFormatted = eligibleDate.toLocaleDateString(
      "en-US",
      options
    );

    if (currentDate < eligibleDate) {
      alert(`You can apply for a certificate after ${eligibleDateFormatted}.`);
      return;
    }

    if (
      !window.confirm(
        "Are you sure your internship is complete? If not,please cancel. If it's complete, click 'ok' to proceed."
      )
    ) {
      return;
    }
    if (!window.confirm("Do you really want to apply for your certificate?")) {
      return;
    }
    // console.log("c", data);
    const name = data.fullname
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const email = data.email;
    const domain = data.domain.title;
    // console.log(name,email,domain);

    try {
      const response = await axios.post(`${API}/applycertificate`, {
        name,
        email,
        domain,
      });
      alert("Certificate Apply successfully!");
      fethCertificate();
    } catch (error) {
      console.error(
        "Error adding certificate:",
        error.response?.data?.error || "Server error"
      );
      alert("Failed to apply, or you have already applied.");
    }
  };

  const fethCertificate = async () => {
    try {
      const response = await axios.get(`${API}/getcertificate`, {
        params: { email: userEmail },
      });
      setCertificate(response.data);
      // console.log("certificate", response.data);
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    }
  };

  const trainingCertificateDownload = async () => {
    // console.log("hi",selectedCertificate);
    // console.log(selectedCertificate.domain);
    // console.log(new Date(selectedCertificate.startdate).toLocaleString('en-US', { month: 'long', year: 'numeric' }));    
    let finalOutput = selectedCertificate.domain + " "+"on"+" " + new Date(selectedCertificate.startdate).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    // console.log(finalOutput);
    try {
      const imageUrl =`https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(selectedCertificate.name)}/fl_layer_apply,y_20/co_rgb:000000,l_text:times%20new%20roman_25_bold_normal_left:${encodeURIComponent(finalOutput)}/fl_layer_apply,y_225/training_certificate_demo_vknkst`
      const imageResponse = await fetch(imageUrl);
      const blob = await imageResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "Training_Certificate.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Training Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download training certificate");
      console.error("Download error:", error);
    }
  };

  useEffect(() => {
    fetchenrollData();
    fethCertificate();
  }, []);

  const handleStartLearning = (title, sessionlist) => {
    navigate("/Learning", {
      state: { courseTitle: title, sessions: sessionlist },
    });
  };

  const addLinkedin = (data) => {
    console.log("linkedin", data.date);
    let year = new Date(data.date).toLocaleDateString("en-US", {
      year: "numeric",
    });
    let month = new Date(data.date).toLocaleDateString("en-US", {
      month: "numeric",
    });
    let linkurl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${data.domain}&organizationName=Krutanic&issueYear=${year}&issueMonth=${month}&certUrl=${data.url}&certId=${data._id}`;
   
    window.open(linkurl, "_blank");
  };

  return (
    <div id="UserDashboard">
      <Toaster position="top-center" reverseOrder={false} />
      {selectedCertificate && ( 
        <div className="viewcertificate">
          <div className="view">
            <img src={selectedCertificate.url} alt="" />
            <div>
              <h2>Issued By : KRUTANIC</h2>
              <a
                className="text-purple-600"
                href={selectedCertificate.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                open in new tab....
              </a>
              <hr />
              <h2>Actions</h2>
              <hr />
              {/* <button className="border-2 border-blue-600 text-blue-600"><i className="fa fa-download"></i>  As Image </button>
              <button className="border-2 border-red-600 text-red-600"><i className="fa fa-download"></i>  Certificate</button> */}
              <button
                className="border-2 border-blue-800 bg-blue-700 text-white"
                onClick={() => addLinkedin(selectedCertificate)}
              >
                Add to linkedin{" "}
              </button>
              <button
                className="border-2 border-black bg-green-950 text-white"
                onClick={trainingCertificateDownload}
              >
                {" "}
                Download Training Certificate{" "}
              </button>

              <button
                className="border-2 border-black bg-black text-white"
                onClick={() => setSelectedCertificate(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="password">
        <span>
          <i className="fa fa-lock"></i> Change Password
        </span>
        <Link to="/Setting" className="ease-linear duration-300">
          {" "}
          Click Here
        </Link>
      </div>
      <br />
      <h2>Dashboard</h2>
      <div className="number">
        <div>
          <span>
            <i className="fa fa-book"></i> Enrolled Courses
          </span>
          <h2>{enrollData.length}</h2>
        </div>
        <div>
          <span>
            {" "}
            <i className="fa fa-graduation-cap"></i> Active Courses
          </span>
          <h2>
            {enrollData.filter((item) => item.status === "fullPaid").length}
          </h2>
        </div>
      </div>
      <br />
      <h2>Courses</h2>
      {loading ? (
        <div id="loader">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      ) : (
        <div className="courselist">
          {enrollData.map((item, index) => (
            <div key={index} className="list">
              <h2>{item.domain.title}</h2>
              <span>★★★★★</span>
              <p> Session {Object.keys(item.domain.session).length}</p>
              <h2>Opted Month: {item.monthOpted}</h2>
              {item.status === "fullPaid" ? (
                <div className="btndiv">
                  <button
                    className="ease-linear duration-300"
                    onClick={() => handleSubmit(item)}
                  >
                    Certificate
                  </button>
                  <button
                    className="ease-linear duration-300"
                    onClick={() =>
                      handleStartLearning(
                        item.domain.title,
                        item.domain.session
                      )
                    }
                  >
                    Start Learning
                  </button>
                </div>
              ) : (
                <div className=" space-y-2">
                  <h3>
                    <strong>Your Due Date:</strong> {item.clearPaymentMonth}
                  </h3>
                  <p>
                    <strong>Your Due Payment Amount Is :</strong> ₹{" "}
                    {item.programPrice - item.paidAmount}/-
                  </p>
                  <div>
                    <strong>
                      You can pay your remaining amount through this{" "}
                      <a
                        className="text-blue-700 font-bold"
                        href="https://smartpay.easebuzz.in/219610/Krutanic"
                        target="_blank"
                      >
                        PayNow
                      </a>
                      .{" "}
                      <i
                        title=" share the screenshot to your counselor"
                        className="fa fa-info-circle"
                        aria-hidden="true"
                      ></i>
                    </strong>
                  </div>

                  <p className="text-center">
                    <strong>Note:</strong>{" "}
                    <span className="font-bold">
                      To begin your learning journey, please ensure your
                      outstanding payment is cleared. Kindly settle the due
                      amount before the specified due date.
                    </span>{" "}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <br />
      <h2>Certificate</h2>
      <div className="certificatediv">
        {certificate ? (
          <div className="item">
            <h3>
              <strong>Name:</strong> {certificate.name}
            </h3>
            <h3>
              <strong>Email:</strong> {certificate.email}
            </h3>
            <h3>
              <strong>Domain:</strong> {certificate.domain}
            </h3>
            <h3>
              <strong>Applied on:</strong>{" "}
              {new Date(certificate.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            {certificate.delivered ? (
              <strong
                className="text-blue-600 cursor-pointer"
                onClick={() => setSelectedCertificate(certificate)}
              >
                view certificate
              </strong>
            ) : (
              <h3>
                <strong>Status:</strong> Pending
              </h3>
            )}
          </div>
        ) : (
          <h3>No certificate</h3>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
