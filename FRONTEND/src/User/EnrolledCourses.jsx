import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";

// import DOMPurify from "dompurify";

const EnrolledCourse = () => {
  const [isLeftVisible, setisLeftVisible] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const [enrollData, setenrollData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const handleStartLearning = (title, sessionlist) => {
    const firstSessionKey = Object.keys(sessionlist)[0];  // Get the first session's key
  const firstSession = { [firstSessionKey]: sessionlist[firstSessionKey] }; // Create a new object with only the first session
    
    navigate("/Learning", {
      state: { courseTitle: title, sessions: firstSession },
    });
  };

  const toggleLeftVisibility = () => {
    setisLeftVisible((prevState) => !prevState);
  };

  const fetchenrollData = async () => {
    try {
      const response = await axios.get(`${API}/enrollments`, { params: { userEmail } });
      setenrollData(response.data);
      // setenrollData(response.data.filter((item) => item.email === userEmail));
    } catch (error) {
      console.error("There was an error fetching enrolledData:", error);
    }
  };
  // const sanitizedDescription = DOMPurify.sanitize(selectedCourse?.description);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  useEffect(() => {
    fetchenrollData();
  }, []);

  useEffect(() => {
    if (enrollData && enrollData.length > 0) {
      setSelectedCourse(enrollData[0].domain);
    }
  }, [enrollData]);

  if(!enrollData){
    return <div id="loader">
    <div className="three-body">
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  </div>
  </div>;
 }

 if(!selectedCourse){
  return <div id="loader">
  <div className="three-body">
<div className="three-body__dot"></div>
<div className="three-body__dot"></div>
<div className="three-body__dot"></div>
</div>
</div>;
}


  return (
    <div id="enrolledcourse">
      {isLeftVisible && (
        <div className="leftpannel">
          <strong>
            <h2>Enrolled Course</h2>
            <span
              onClick={toggleLeftVisibility}
              className="fa fa-arrow-circle-left"
            ></span>
          </strong>
          <ul>
          {enrollData.length === 0 ? (
        <li>No course found</li>
      ) : (
        enrollData.map((item, index) => {
          return (
            <li key={index} onClick={() => handleCourseClick(item.domain)}>
              {item.domain.title}
            </li>
          );
        })
      )}
          </ul>
        </div>
      )}

      {selectedCourse && (
        <div className="aboutcourse">
          <div className="abouttop">
            <h2
              onClick={toggleLeftVisibility}
              className=""
            ><span>☰ </span></h2>
            <h2>{selectedCourse.title}</h2>
            <h2></h2>
            <button onClick={() => handleStartLearning(selectedCourse.title,selectedCourse.session)}>DEMO</button>
          </div>
          {/* <pre dangerouslySetInnerHTML={{ __html: sanitizedDescription }} /> */}
          <pre>{selectedCourse.description}</pre>
          <h2>COURSE CONTENT</h2>
          <table>
            {selectedCourse.session &&
              Object.keys(selectedCourse.session).map((key) => (
                <tr key={key}>
                  <td>
                    <span className="capitalize">
                      <i className="fa fa-play"></i> {key}
                    </span>
                    <h3 className="capitalize">{selectedCourse.session[key].title}</h3>
                    <i className="fa fa-eye-slash"></i>
                  </td>
                </tr>
              ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourse;
