import React, { useState, useEffect, useRef } from "react";
import logo from '../User/playerlogo.jpg';
import { useLocation } from 'react-router-dom';

const Learning = () => {

  const [isSessionVisible, setisSessionVisible] = useState(false);
  const [selectedSession, setselectedSession] = useState({});
  const location = useLocation();
  const { courseTitle, sessions } = location.state || {};

  const sessionVisibility = () => {
    setisSessionVisible((prevState) => !prevState);
  };

  const handleSessionClick = (session) => {
    setselectedSession(session);
  };

  useEffect(() => {
    if (sessions) {
      setselectedSession(Object.values(sessions)[0]);
    }
  }, [sessions]);

  if(!selectedSession){
    return <div id="loader">
    <div className="three-body">
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  <div className="three-body__dot"></div>
  </div>
  </div>;
 }

  return (
    <div id='UserLearning'>
      <h2>{courseTitle}</h2>
      <div className='learningtop'>
        <span onClick={sessionVisibility}>☰ MENU</span>
        <h2>{selectedSession.title}</h2>
      </div>
      {isSessionVisible && (
        <div className='sessionlist'>
          <h2>COURSE CONTENT</h2>
          <ul onClick={sessionVisibility}>
            {sessions && Object.keys(sessions).map((key) => (
              <li key={key}  onClick={() => handleSessionClick(sessions[key])}  ><span>{key}: {sessions[key].title}</span> <i className="fa fa-play-circle"></i></li>
            ))
            }

          </ul>
        </div>
      )}
      {selectedSession && (
      <div className='player'>
      
        <div className='logo'>
          <img src={logo} alt="" />
        </div>
        <iframe
        src={`https://drive.google.com/file/d/${selectedSession.description}/preview`}
          allow="autoplay"
          allowFullScreen
        >
        </iframe>
     
      </div>
 )}
    </div>
  )
}

export default Learning;
