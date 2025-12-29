import React, {useState } from "react";
import { Link } from "react-router-dom";
import WaveSingle from "./Wave_single";
import Razorpay from "../assets/Razorpay.png";
import Easebuzz from "../assets/easebuzz.jpeg";
import logowhite from "../assets/logowhite.png";

const Footer = () => {
  const [ispolicy1Visible, setispolicy1Visible] = useState(false);
  const [ispolicy2Visible, setispolicy2Visible] = useState(false);
  const [ispolicy3Visible, setispolicy3Visible] = useState(false);

  const policy1 = () => {
    setispolicy1Visible((prevState) => !prevState);
  };
  const policy2 = () => {
    setispolicy2Visible((prevState) => !prevState);
  };
  const policy3 = () => {
    setispolicy3Visible((prevState) => !prevState);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };



  return (
    <div id="footermain">
      <div style={{ rotate: "180deg" }}>
        <WaveSingle />
      </div>
      <footer className="footer">
        <div className="footercontact">
          <a href="mailto:support@krutanic.com" target="blank">
            {" "}
            <i className="fa fa-envelope text-red-600"></i> <br /> Mail us <br />{" "}
           support@krutanic.com
          </a>
          <a href="tel:+917022812878" target="blank">
            {" "}
            <i className="fa fa-phone text-blue-600"></i>
            <br /> Call us <br /> +91-7022812878
          </a>
          <a href="https://wa.me/7022812878?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20programs." target="blank">
            {" "}
            <i className="fa fa-whatsapp text-green-600"> </i>
            <br /> WhatsApp us <br /> +91-7022812878
          </a>
          <a>
            <i className="fa fa-map-marker text-red-500"> </i>
            <br /> Find us <br /> Bengaluru, Karnataka
          </a>
        </div>

        <div className="footerlink">
          <div className="footerlinkleft">
            <img src={logowhite} alt="" />
            <p>Krutanic is your gateway to mastering industry-leading skills. As a premier course provider, we offer high-quality, in-demand programs. Our focus is on delivering real-world skills to empower individuals and excel in their careers.</p>
            <br />
            <h2>Follow Us</h2>
            <a
            target="_blank"
              href="https://www.facebook.com/people/Krutanic-Solutions/61563953173071/"
              className="text-blue-500  hover:text-blue-700"
            >
              <span className="fa fa-facebook"></span>
            </a>
            <a 
            target="_blank" href="https://www.youtube.com/@KrutanicSolutions" className="text-red-800  hover:text-red-900">
              <span className="fa fa-youtube"></span>
            </a>
            <a
            target="_blank"
              href="https://www.instagram.com/krutanic"
              className="text-pink-500  hover:text-pink-700"
            >
              <span className="fa fa-instagram"></span>
            </a>
            <a
            target="_blank"
              href="https://www.linkedin.com/company/krutanic/"
              className="text-blue-700  hover:text-blue-900"
            >
              <span className="fa fa-linkedin"></span>
            </a>
            <a
            target="_blank"
              href="https://github.com/Krutanic/"
              className="text-white"
            >
              <span className="fa fa-github"></span>
            </a>
          </div>
          <div className="footerlinkright">
            {/* <Link to='/'>facebook</Link> */}
            <div>
              <h2>Quick Links</h2>
              <ul>
                <li>
                  <Link to="/" onClick={scrollToTop}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/Career" onClick={scrollToTop}>
                    Career
                  </Link>
                </li>
                <li>
                  <Link to="/Mentorship" onClick={scrollToTop}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/AboutUs" onClick={scrollToTop}>
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/FeeStructure" onClick={scrollToTop}>
                    Fee Structure
                  </Link>
                </li>
                <li>
                  <Link to="/Advance" onClick={scrollToTop}>
                    Advanced Program
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>Useful Links</h2>
              <ul>
                <li>
                  <Link to="/TalentHunt" onClick={scrollToTop}>
                    Talent Hunt
                  </Link>
                </li>
                <li>
                  <Link to="/Collabration" onClick={scrollToTop}>
                    Collaboration
                  </Link>
                </li>
                <li>
                  <Link to="/ContactUs" onClick={scrollToTop}>
                    Contact Us
                  </Link>
                </li>
                <li onClick={policy1}>Privacy Policy</li>
                <li onClick={policy2}>Terms & Conditions</li>
                <li onClick={policy3}>Refunds Policy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footerbottom">
          <p>Copyright 2024 KRUTANIC. All rights reserved.</p>
        </div>
      </footer>
      <div className="pay">
        <p>100% safe and secured payment with</p>
        <span>
          <img src={Razorpay} alt="" />
        </span>
        <span>
          <img src={Easebuzz} alt="" />
        </span>
      </div>

      {/* privacy policy */}
      {ispolicy1Visible && (
        <div className="policy">
          <div className="policytext">
            <div className="close">
              <span className="fa fa-close" onClick={policy1}></span>
            </div>
            <div className="text">
              <h1>Privacy Policy</h1>
              <p>
                At Krutanic, we value your privacy and are committed to
                protecting your personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our website and services. By accessing
                or using our website, you consent to the practices described in
                this policy.
              </p>
              <h1>Information We Collect</h1>
              <h3>Personal Information: </h3>
              <p>
                We may collect personal information, such as your name, email
                address, contact details, and other identifiers when you
                register for an account, apply for courses, or use our services.
                Usage Data: We collect information about your interactions with
                our website, including your IP address, browser type, pages
                visited, and the date and time of your visits.
              </p>
              <h3>Payment Information:</h3>
              <p>
                {" "}
                If you make payments for our services, we may collect payment
                card details or other financial information to process
                transactions. How We Use Your Information
              </p>
              <h3>Provide Services:</h3>
              <p>
                We use your information to provide, maintain, and improve our
                services, including course registration, placement services, and
                customer support.
              </p>
              <h3>Communications: </h3>
              <p>
                We may use your email address to send you important updates,
                newsletters, and promotional materials. You can opt-out of
                marketing communications at any time.
              </p>
              <h3>Analytics: </h3>
              <p>
                We use data analytics to analyze website usage patterns, improve
                our content and services, and customize your experience.
              </p>
              <h2>Information Sharing</h2>
              <p>
                We may share your information with third parties in the
                following circumstances:
              </p>
              <h3>Service Providers:</h3>
              <p>
                We may disclose your information to trusted third-party service
                providers who assist us in operating our website and providing
                our services. Legal Compliance: We may share your information to
                comply with legal obligations, respond to legal requests, or
                protect our rights, privacy, safety, or property.
              </p>
              <h3>Security</h3>
              <p>
                We employ reasonable security measures to protect your personal
                information. However, no data transmission over the internet or
                storage system is completely secure, and we cannot guarantee the
                absolute security of your data.
              </p>
              <h3>Your Choices</h3>
              <p>
                You can review and update your personal information by logging
                into your account. You can opt-out of receiving marketing
                communications from us. You can disable cookies in your browser
                settings, but this may affect website functionality.
              </p>
              <h3>Children’s Privacy</h3>
              <p>
                Our services are not intended for children under the age of 13.
                We do not knowingly collect or solicit personal information from
                children. If you believe a child has provided us with personal
                information, please contact us, and we will take appropriate
                steps to remove the information.
              </p>
              <h3>Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy to reflect changes to our
                practices or for other operational, legal, or regulatory
                reasons. We will notify you of any material changes by posting
                the revised policy on our website.
              </p>

              <h3>Contact Us!</h3>
              <p>
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us at support@krutanic.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Term and Condition */}

      {ispolicy2Visible && (
        <div className="policy">
          <div className="policytext">
            <div className="close">
              <span className="fa fa-close" onClick={policy2}></span>
            </div>
            <div className="text">
              <h1>TERMS AND CONDITIONS</h1>
              <h3>
                Welcome to Krutanic! By accessing or using our services, you
                agree to comply with and be bound by the following terms and
                conditions. Please read them carefully.
              </h3>
              <h3>1. General</h3>
              <p>
                1.1 These Terms apply to all users of our platform, services,
                and programs.
              </p>
              <p>
                1.2 The company reserves the right to update or modify these
                Terms at any time without prior notice.
              </p>
              <h3>2. Eligibility</h3>
              <p>
                2.1 Users must meet the minimum age requirement of 16 years or
                provide parental consent.
              </p>
              <p>
                2.2 Enrollment in certain courses or programs may require
                prerequisite qualifications.
              </p>
              <h3>3. Services</h3>
              <p>
                3.1 We provide educational programs, training, and resources
                through our platform and partnerships.
              </p>
              <p>
                3.2 Program details, schedules, and fees are subject to change
                without prior notice.
              </p>
              <h3>4. Payments</h3>
              <p>
                4.1 Fees must be paid in full before accessing any course or
                program unless specified otherwise.
              </p>
              <p>4.2 Fees are non-refundable</p>
              <h3>5. Intellectual Property</h3>
              <p>
                5.1 All course materials, content, and resources are owned by
                Krutanic or its licensors.
              </p>
              <p>
                5.2 Users may not reproduce, distribute, or share any materials
                without prior written consent.
              </p>
              <h3>6. User Conduct</h3>
              <p>
                6.1 Users must not engage in any unlawful, disruptive, or
                harmful activities on the platform.
              </p>
              <p>
                6.2 Breach of this conduct policy may result in suspension or
                termination of access.
              </p>
              <h3>7. Data Privacy</h3>
              <p>
                7.1 We are committed to protecting your personal information.
              </p>
              <p>
                7.2 Please refer to our Privacy Policy for details on how we
                collect, use, and store data.
              </p>
              <h3>8. Limitation of Liability</h3>
              <p>
                8.1 Krutanic is not liable for any direct or indirect damages
                resulting from the use of our platform or services.
              </p>
              <p>
                8.2 We do not guarantee job placements or specific outcomes from
                any program.
              </p>
              <h3>9. Cancellations and Refunds</h3>
              <p>
                9.1 Cancellations must be made in writing within the specified
                refund window.
              </p>
              <h3>10. Dispute Resolution</h3>
              <p>
                10. The decision of the arbitrator shall be final and binding.
              </p>
              <h3>11. Contact Information</h3>
              <p>
                For any questions or concerns regarding these Terms, please
                contact us: Email: [support@krutanic.com]
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Policy */}
      {ispolicy3Visible && (
        <div className="policy">
          <div className="policytext">
            <div className="close">
              <span className="fa fa-close" onClick={policy3}></span>
            </div>
            <div className="text">
              <h2>No Refund Policy </h2>
              <p>
              By enrolling in any of our educational programs, you acknowledge and agree that all fees, tuition, and payments made towards the program are strictly "Non-refundable" under any circumstances. This policy applies regardless of withdrawal, cancellation, non-completion, dismissal, or any other reason.
              By making payment, you confirm that you have read, understood, and accepted this "Non-refundable" policy.
              </p>
              <h3>Policy Details</h3>
              <h2>Non-Refundable Payments</h2>
              <p>
                All fees and payments made towards any of our educational
                programs are non-refundable under any circumstances.
              </p>
              <h2>Program Access</h2>
              <p>
                Once payment is confirmed, participants will receive access to
                all course materials and resources. This constitutes the
                completion of our obligation to provide the purchased service.
              </p>
              <h2>Exceptions:</h2>
              <p>
                Refunds are not provided except in cases where the company is
                unable to deliver the agreed service due to unforeseen
                circumstances.
              </p>
              <h2>Commitment to Quality</h2>
              <p>
                We are dedicated to offering programs that meet the highest
                educational standards. If you encounter any issues or require
                support, please contact us at [Support@krutanic.com], and we
                will be happy to assist you.
              </p>
              <h3>
                By enrolling in our programs, you acknowledge and accept the
                terms of this No Refund Policy.
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
