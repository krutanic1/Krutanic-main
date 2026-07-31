import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const Certificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchCertificate = async (page = 1, searchQuery = search) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/delivered-certificates?page=${page}&limit=40&search=${searchQuery}`);
            console.log(response.data);
            setCertificates(response.data.deliveredCertificates);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error("There was an error fetching certificate:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        const isConfirmed1 = window.confirm("Are you sure you want to edit this user's certificate?");
        if (!isConfirmed1) return;
        const isConfirmed2 = window.confirm("After editing, you will need to regenerate and resend the certificate. Continue?");
        if (!isConfirmed2) return;
        try {
            const response = await axios.put(`${API}/undelivered/${id}`);
            fetchCertificate(currentPage);
        } catch (error) {
            console.error("Error updating delivery status:", error.response?.data?.error || "Server error");
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCertificate(1, search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div id="adduser">
            <div className="usertable">
                <div>
                    <h2>Delivered Certificate</h2>
                    <input
                        type="text"
                        placeholder="Search by Name, Email, Domain..."
                        value={search}
                        onChange={handleSearch}
                        style={{ padding: "8px", width: "300px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Applied on</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Domain</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Enrollment ID</th>
                                <th>Company</th>
                                <th>Training</th>
                                <th>InternShip</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {certificates?.map((certificate, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(certificate.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{certificate.name}</td>
                                    <td>{certificate.email}</td>
                                    <td>{certificate.domain}</td>
                                    <td>{new Date(certificate.startdate).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{new Date(certificate.enddate).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{certificate.enrolment}</td>
                                    <td>{certificate.company}</td>

                                    <td>
                                        <a href={`https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,y_20/co_rgb:000000,l_text:times%20new%20roman_25_bold_normal_left:${encodeURIComponent(certificate.domain + " " + "on" + " " + new Date(certificate.startdate).toLocaleString('en-GB', { month: 'long', year: 'numeric' }))}/fl_layer_apply,y_225/training_certificate_demo_vknkst`} target="_blank" rel="noopener noreferrer">Training</a>
                                    </td>
                                    <td>
                                        <a href={certificate.url} target="_blank" rel="noopener noreferrer">certificate</a>
                                    </td>
                                    <td><button className="fa fa-reply" title="Back to Edit" onClick={() => handleEdit(certificate._id)}></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination" style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
                    <button
                        onClick={() => fetchCertificate(currentPage - 1, search)}
                        disabled={currentPage === 1 || loading}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => fetchCertificate(currentPage + 1, search)}
                        disabled={currentPage === totalPages || loading}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Certificate;