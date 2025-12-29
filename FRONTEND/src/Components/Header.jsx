  import React, { useState, useEffect, useRef } from "react";
  import logo3 from "../assets/LOGO3.png";
  // import wipro from "../assets/wipro.svg";
  import accenture from "../assets/poplogo/accenture.png"
  import mca from "../assets/poplogo/mca.png";
  import iso from "../assets/poplogo/iso.png";
  import msme from "../assets/poplogo/msme.png";
  import { Link, useLocation } from "react-router-dom";

  const Header = () => {
    const [isMobileVisible, setisMobileVisible] = useState(false);
    const [isAutopopupVisible, setisAutopopupVisible] = useState(false);
    const mobileMenuRef = useRef(null);
    const location = useLocation();
    
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     setisAutopopupVisible(true);
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }, []);

    useEffect(() => {
      if (location.pathname === "/" || location.pathname === "/dashboardaccessform") {
        const timer = setTimeout(() => {
          setisAutopopupVisible(true);
        }, 1000);
    
        return () => clearTimeout(timer);
      }
    }, [location.pathname]);
    

    const autoPopup = () => {
      setisAutopopupVisible(false);
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleVisibility = () => {
      setisMobileVisible((prevState) => !prevState);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target)
        ) {
          setisMobileVisible(false);
        }
      };

      // Add event listener to the document
      document.addEventListener("click", handleClickOutside);

      // Cleanup the event listener on component unmount
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

    return (
      <div id="header" ref={mobileMenuRef}>
        <div className="navbar">
          <div>
            <Link to="/" onClick={scrollToTop}>
              <img src={logo3} alt="Logo" />
            </Link>
          </div>
          <div className="menu">
            <Link to="/Mentorship">MENTORSHIP PROGRAM</Link>
            <Link to="/Advance">ADVANCED PROGRAM</Link>
            <Link to="/Alumni">ALUMNI</Link>
            <Link to="/MasterClass" onClick={scrollToTop}>MASTERCLASS</Link>
            {/* <Link to="/Career">CAREER</Link> */}
            <Link to="/TalentHunt" onClick={scrollToTop}>
              TALENT HUNT
            </Link>
            <Link to="/ReferAndEarn" onClick={scrollToTop}>
              REFER AND EARN<i className="fa fa-money text-green-400 rotate-90 animate-pulse"></i>
            </Link>
            

            <Link to="/login" className="btn">
              LOGIN{" "}
            </Link>
          </div>
          <div className="toggle">
            <span onClick={toggleVisibility}>☰</span>
          </div>
        </div>

        {isMobileVisible && (
          <div className="mobile">
            <ul onClick={toggleVisibility}>
              <Link to="/Mentorship">
                <li>MENTORSHIP PROGRAM</li>
              </Link>
              <Link to="/Advance">
                <li>ADVANCED PROGRAM</li>
              </Link>
              <Link to="/Alumni" onClick={scrollToTop}><li>ALUMNI</li></Link>
              <Link to="/MasterClass" onClick={scrollToTop}>
                <li>MASTERCLASS</li>
              </Link>
              <Link to="/Collabration" onClick={scrollToTop}>
                <li>COLLABRATION</li>
              </Link>
              <Link to="/TalentHunt" onClick={scrollToTop}>
                <li>TALENT HUNT</li>
              </Link>
              <Link to="/ContactUs" onClick={scrollToTop}>
                <li>CONTACT US</li>
              </Link>
              <Link to="/Career" onClick={scrollToTop}>
                <li>CAREER</li>
              </Link>
              <Link to="/AboutUs" onClick={scrollToTop}>
                <li>ABOUT US</li>
              </Link>

              <Link to="/login">
                <button className="btn">LOGIN</button>{" "}
              </Link>
            </ul>
          </div>
        )}

        {/* {isAutopopupVisible && (
          <div id="autopopup">
            <div className="autotext">
              <div className="close">
                <span onClick={autoPopup} className="fa fa-close"></span>
              </div>
              
              <div className="first">
                <h2>We are accredited by</h2>
                <div className="my-[30px]">
                <img src={accenture} alt="accenture" />
                
                </div>
              </div>
              <h3>Our Prestigious Certifications</h3>
              <div className="second">
                <img src={iso} alt="" />
                <img src={mca} alt="" />
                <img src={msme} alt="" />
              </div>
            </div>
          </div>
        )} */}
      </div>
    );
  };

  export default Header;

