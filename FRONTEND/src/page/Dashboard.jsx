import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const Dashboard = () => {
    const [certificates, setCertificates] = useState([]);
    const fetchCertificate = async () => {
        try {
            const response = await axios.get(`${API}/certificates`);
            console.log(response.data);
            setCertificates(response.data);
        } catch (error) {
            console.error("There was an error fetching certificate:", error);
        }
    };
    useEffect(() => {
        fetchCertificate();
    }, []);
    return (
        <div id="dashboard">
            <h1>Dashboard</h1>
            <div className="card">
                <div className="item">
                    <span >📜</span>
                    <strong>{certificates.length}</strong>
                    <h3>Total Applied Certificates</h3>
                </div>
                <div className="item">
                    <span>⏳</span>
                    <strong>{certificates.filter(cert => !cert.delivered).length}</strong>
                    <h3>Pending Certificates</h3>
                </div>
                <div className="item">
                    <span>✅</span>
                    <strong>{certificates.filter(cert => cert.delivered).length}</strong>
                    <h3>Certificate Delivered</h3>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;