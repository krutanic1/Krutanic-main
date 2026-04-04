import React from "react";
import advance from "../../../assets/certificates/Advance/Advance certificate completion.jpg";



const Certification = () => {

  return (
    <div>
      <div className="container mx-auto">
        <h1
          data-aos="fade-up"
          className="text-[#c43609] text-center font-bold text-3xl md:text-5xl"
        >
          | Professional Certifications
        </h1>
        <div className="py-10 px-5 md:px-20">
          <div className="lg:flex items-center gap-8 bg-white border border-[#efcfc2] rounded-2xl p-4 md:p-6 shadow-md">
            <div className="lg:w-1/2 w-full">
              <img
                src={advance}
                alt="Certificate"
                className="w-full rounded-xl border border-[#f3d8cd]"
              />
            </div>
            <div className="lg:w-1/2 w-full mt-5 lg:mt-0">
              <h3 className="text-3xl font-bold mb-4 text-[#c43609]">
                Recognized by Industry Leaders
              </h3>
              <p className="text-lg text-[#4b4b4b] mb-6 leading-relaxed">
                Enhance your professional reputation with a certificate that
                stands out.
              </p>

              <h3 className="text-3xl font-bold mb-4 text-[#c43609]">Boost Your Career</h3>
              <p className="text-lg text-[#4b4b4b] mb-6 leading-relaxed">
                Leverage the certification to advance in your current role or
                pursue new opportunities.
              </p>

              <h3 className="text-3xl font-bold mb-4 text-[#c43609]">Global Recognition</h3>
              <p className="text-lg text-[#4b4b4b] mb-6 leading-relaxed">
                The certificate is respected internationally, opening doors in
                the global job market.
              </p>

              <h3 className="text-3xl font-bold mb-4 text-[#c43609]">Take the Next Step</h3>
              <p className="text-lg text-[#4b4b4b] leading-relaxed">
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
