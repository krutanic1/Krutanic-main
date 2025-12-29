import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";

const Verified = () => {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    const trimmedId = certId.trim();

    if (!trimmedId) {
      toast.error("Verification Code cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API}/verify-certificate/${trimmedId}`);
      setResult(response.data);

      toast.success("Certificate verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="verified">
      <Toaster  />
      <section className="hero">
        <h1>
          Certificate <span>Verification</span>
        </h1>
        <p>
          To verify your certificate, please enter User Verification Code below.
        </p>
      </section>
      <section className="form">
        <form onSubmit={handleSubmit}>
          <h2 className="font-bold">Verify Certificate</h2>
          <input
            type="text"
            placeholder="Enter User Verification Code"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />
          <input
          className="bg-[#f15b29] text-white rounded cursor-pointer"
            type="submit"
            value={loading ? "Verifying..." : "SUBMIT"}
            disabled={loading}
          />
        </form>
      </section>

      <section className="result">
        {result && (
          <div className="result-card">
            <h2>Certificate Details</h2>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Domain:</strong> {result.domain}</p>
            <a href={result.url} target="_blank">view certificate</a>

          </div>
        )}

      </section>

      
    </div>
  );
};

export default Verified;
