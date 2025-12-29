import React from "react";
import advance from "../../../assets/certificates/Advance/Advance certificate completion.jpg";



const Certification = () => {

  return (
    <div>
      <div className="container mx-auto">
        <h1
          data-aos="fade-up"
          className="text-[#f15b29] text-center  lg:font-bold"
        >
          | Professional Certifications
        </h1>
        <div className=" text-white py-10 px-5 md:px-20">
          <div className="lg:flex items-center gap-8">
            <div  className="lg:w-1/2 w-full">
              <img src={advance} alt="Certificate" className="" />
            </div>
            <div className="lg:w-1/2 w-full mt-5 lg:mt-0">
              <h3 className="text-3xl font-bold mb-4">
                Recognized by Industry Leaders
              </h3>
              <p className="text-md mb-6">
                Enhance your professional reputation with a certificate that
                stands out.
              </p>

              <h3 className="text-3xl font-bold mb-4">Boost Your Career</h3>
              <p className="text-md mb-6">
                Leverage the certification to advance in your current role or
                pursue new opportunities.
              </p>

              <h3 className="text-3xl font-bold mb-4">Global Recognition</h3>
              <p className="text-md mb-6">
                The certificate is respected internationally, opening doors in
                the global job market.
              </p>

              <h3 className="text-3xl font-bold mb-4">Take the Next Step</h3>
              <p className="text-md">
                Complete the program, earn your certificate, and take the next
                step in your career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
