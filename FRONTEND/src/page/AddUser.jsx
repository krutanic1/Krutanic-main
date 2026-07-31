import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Toaster, toast } from "react-hot-toast";

const AddUser = () => {
    const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
    const REGION = import.meta.env.VITE_REGION;
    const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

    const [isFormVisible, setisFormVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [startdate, setStartDate] = useState("");
    const [enddate, setEndDate] = useState("");
    const [domain, setDomain] = useState("");
    const [enrolment, setEnrolment] = useState("");
    const [company, setCompany] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAutofillingStartDate, setIsAutofillingStartDate] = useState(false);

    const courses = [
        "Android App Development",
        "Artificial Intelligence",
        "Auto Cad",
        "Business Analytics",
        "Cloud Computing",
        "Cyber Security",
        "Data Analytics",
        "Data Science",
        "DevOps",
        "Digital Marketing",
        "Embedded System",
        "Finance",
        "FinTech",
        "Full Stack Web Development",
        "Graphic Designing",
        "Human Resource",
        "IOT & Robotics",
        "Machine Learning",
        "Nano Technology & Genetic Engineering",
        "Psychology",
        "Stock Marketing",
        "Supply Chain Management",
        "UI & UX Design",
        "VLSI"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const response = await axios.put(`${API}/updatecertificate/${editingId}`, { name, email, startdate, enddate, domain, enrolment, company, });
                toast.success("Certificate updated successfully!");
            } else {
                const response = await axios.post(`${API}/addcertificate`, { name, email, startdate, enddate, domain, enrolment, company, });
                toast.success("Certificate added successfully!");
            }
            fetchCertificate();
            resetForm();
        } catch (error) {
            console.error("Error adding certificate:", error.response?.data?.error || "Server error");
        }
    };

    const handleEdit = (certificate) => {
        const isConfirmed = window.confirm("Are you sure you want to edit the User Detail?");
        if (isConfirmed) {
            setEmail(certificate.email);
            setName(certificate.name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
            setStartDate(certificate.startdate);
            setEndDate(certificate.enddate);
            setDomain(certificate.domain);
            setEnrolment(certificate.enrolment);
            setCompany(certificate.company);
            setEditingId(certificate._id);
            setisFormVisible(true);
        }
    };

    const handleDeliver = async (id) => {
        const isConfirmed1 = window.confirm("Are you sure you want to Final Submit the User Certificate?");
        if (!isConfirmed1) return;
        const isConfirmed2 = window.confirm("after sending the certificate you can't update it");
        if (!isConfirmed2) return;
        try {
            const response = await axios.put(`${API}/markdelivered/${id}`);
            fetchCertificate();
        } catch (error) {
            console.error("Error updating delivery status:", error.response?.data?.error || "Server error");
        }
    }

    const fetchCertificate = async () => {
        try {
            const response = await axios.get(`${API}/pending-certificates`);
            console.log(response.data);
            setCertificates(response.data);
        } catch (error) {
            console.error("There was an error fetching certificate:", error);
        }
    };

    const updateGeneratedCertificate = async (id, newurl) => {
        try {
            const response = await axios.put(`${API}/updatecer/${id}`, { url: newurl });
            console.log(response.data.message || "Certificate updated successfully");
            toast.success("Certificate generated successfully!");
            fetchCertificate();
            setIsGenerating(false);
        } catch (error) {
            console.error(error.response?.data?.error || "Server error");
            toast.error(error.response?.data?.error || "Something went wrong");
        }
    };

    const handleGenerate = async (certificate) => {
        const isConfirmed = window.confirm("Are you sure you want to Generate Certificate?");
        if (!isConfirmed) return;
        if (!certificate.name || !certificate.email || !certificate.startdate || !certificate.enddate || !certificate.domain || !certificate.enrolment  ) {
            toast.error("Please fill in all Details then generate the certificate");
            return;
        }

        setIsGenerating(true);

        const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return "th"; // Covers 4th - 20th (special case)
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        const formatDate = (dateString) => {
            const dateObj = new Date(dateString);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('en-US', { month: 'long' });
            const year = dateObj.getFullYear();
            return `${month} ${day}${getOrdinalSuffix(day)}%2C ${year}`;
        };

        const certificatedate = formatDate(certificate.startdate) + " to " + formatDate(certificate.enddate);

        // const certificateAccenture = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_120_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,g_west,x_180,y_-90/co_rgb:000000,l_text:times%20new%20roman_45_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,g_west,x_180,y_110/co_rgb:000000,l_text:times%20new%20roman_40_bold_normal_left:${encodeURIComponent(certificate.domain)}/fl_layer_apply,g_west,x_590,y_349/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate.enrolment)}/fl_layer_apply,g_south_west,x_395,y_30/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate._id)}/fl_layer_apply,g_south_west,x_895,y_30/accenture_ppyw0o`;
        // const certificateAdobe = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,y_-50/co_rgb:000000,l_text:times%20new%20roman_30_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,y_-220/co_rgb:000000,l_text:times%20new%20roman_33_bold_normal_left:${encodeURIComponent(certificate.domain)}/fl_layer_apply,g_west,x_712,y_193/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(certificate.enrolment)}/fl_layer_apply,g_south_west,x_465,y_28/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(certificate._id)}/fl_layer_apply,g_south_west,x_900,y_28/adobe_ovkftr`;

        let certificateurl = "";

        if (certificate.company == "adobe") {
            certificateurl = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,y_-50/co_rgb:000000,l_text:times%20new%20roman_30_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,y_-220/co_rgb:000000,l_text:times%20new%20roman_33_bold_normal_left:${encodeURIComponent(certificate.domain)}/fl_layer_apply,g_west,x_712,y_193/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(certificate.enrolment)}/fl_layer_apply,g_south_west,x_465,y_28/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(certificate._id)}/fl_layer_apply,g_south_west,x_900,y_28/adobe_ovkftr`;
        } else if (certificate.company == "accenture") {
            certificateurl = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_120_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,g_west,x_180,y_-90/co_rgb:000000,l_text:times%20new%20roman_45_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,g_west,x_180,y_110/co_rgb:000000,l_text:times%20new%20roman_40_bold_normal_left:${encodeURIComponent(certificate.domain)}/fl_layer_apply,g_west,x_590,y_349/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate.enrolment)}/fl_layer_apply,g_south_west,x_395,y_30/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate._id)}/fl_layer_apply,g_south_west,x_895,y_30/accenture_ppyw0o`;
        } else {
        toast.error("Unknown company. Supported: adobe, accenture.");
        setIsGenerating(false);
        return;
    }

        console.log("cloud", certificatedate);
        console.log("cloudurl", certificateurl);
        try {
            // Step 1: Fetch the image and convert to a file
            const response = await fetch(certificateurl);
            if (!response.ok) throw new Error("Failed to fetch image");

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();

            // Step 2: Configure AWS S3 Client
            const s3 = new S3Client({
                region: REGION,
                credentials: {
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_KEY,
                },
            });

            // Step 3: Upload File to S3
            const fileName = `${certificate._id}`;
            const params = {
                Bucket: S3_BUCKET,
                Key: fileName,
                Body: new Uint8Array(arrayBuffer),
                ContentType: "image/png",
            };

            await s3.send(new PutObjectCommand(params));

            // Step 4: Generate Image URL
            const newurl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;

            updateGeneratedCertificate(certificate._id, newurl);

        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred.");
        }
    };


    const resetForm = () => {
        setEmail("");
        setName("");
        setStartDate("");
        setEndDate("");
        setDomain("");
        setEnrolment("");
        setCompany("");
        setEditingId(null);
        setisFormVisible(false);
    };

    const fetchDefaultStartDate = async (applierEmail) => {
        if (!isFormVisible || !applierEmail || startdate) return;

        try {
            setIsAutofillingStartDate(true);
            const response = await axios.get(`${API}/newenroll-default-startdate`, {
                params: {
                    email: applierEmail,
                },
            });

            if (response?.data?.startdate) {
                setStartDate(response.data.startdate);
            }
        } catch (error) {
            // Ignore lookup failures so manual entry still works normally.
        } finally {
            setIsAutofillingStartDate(false);
        }
    };

    useEffect(() => {
        fetchCertificate();
    }, []);

    useEffect(() => {
        if (!email || !isFormVisible) return;

        const trimmedEmail = email.trim().toLowerCase();
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

        if (!isValidEmail) return;

        const timeoutId = window.setTimeout(() => {
            fetchDefaultStartDate(trimmedEmail);
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [email, editingId, isFormVisible]);

    return (
        <div id="adduser">
            <Toaster />
            {isFormVisible && (
                <div className="form">
                    <form onSubmit={handleSubmit} >
                        <h2>
                            <strong>{editingId ? "Edit User" : "Add User"}</strong>
                            <span onClick={resetForm}>✖</span>
                        </h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value
                                .toLowerCase()
                                .split(" ")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" "))}
                            placeholder="Enter full name of student"
                            required
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setStartDate("");
                            }}
                            onBlur={(e) => {
                                const trimmedEmail = e.target.value.trim().toLowerCase();
                                if (trimmedEmail) {
                                    fetchDefaultStartDate(trimmedEmail);
                                }
                            }}
                            placeholder="Enter personal email"
                            required
                        />
                        <input
                            type="text"
                            value={enrolment}
                            onChange={(e) => setEnrolment(e.target.value)}
                            placeholder="Enter enrolment code"
                            required
                        />
                        <select value={domain} onChange={(e) => setDomain(e.target.value)} required>
                            <option value="" disabled>Select Opted Domain</option>
                            {courses.map((course, index) => (
                                <option key={index} value={course}>{course}</option>
                            ))}
                        </select>
                        <label>Internship Start Date</label>
                        <input
                            type="date"
                            value={startdate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            disabled={isAutofillingStartDate}
                        />
                        <label>Internship End Date</label>
                        <input
                            type="date"
                            value={enddate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                        <select value={company} onChange={(e) => setCompany(e.target.value)} required>
                            <option value="" disabled>Select Internship Company</option>
                            <option value="accenture">accenture</option>
                            <option value="adobe">adobe</option>
                        </select>
                        <input type="submit" className="btn" value="SUBMIT" />
                    </form>
                </div>
            )}
            <div className="usertable">
                <div>
                    <h2>User List</h2>
                    <button onClick={() => setisFormVisible(true)} >+ Add User</button>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Applied on</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Domain</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Enrollment ID</th>
                                <th>Company</th>
                                <th>Certificate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates?.map((certificate, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(certificate.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{certificate._id}</td>
                                    <td>{certificate.name}</td>
                                    <td>{certificate.email}</td>
                                    <td>{certificate.domain}</td>
                                    <td>{new Date(certificate.startdate).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{new Date(certificate.enddate).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td>{certificate.enrolment}</td>
                                    <td>{certificate.company}</td>
                                    <td>
                                        {!certificate.url ? (
                                            <button onClick={() => handleGenerate(certificate)} disabled={isGenerating}>Generate</button>
                                        ) : (
                                            <>
                                                <a href={certificate.url} target="_blank" rel="noopener noreferrer">Generated</a>
                                                <button onClick={() => handleDeliver(certificate._id)}>Send</button>
                                            </>
                                        )}

                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(certificate)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddUser;

// old certificate withoute qr
// const certificateurl = `https://res.cloudinary.com/dtchuqy2n/image/upload/co_rgb:000000,l_text:times%20new%20roman_120_normal_left:${encodeURIComponent(certificate.name)}/fl_layer_apply,g_west,x_180,y_-90/co_rgb:000000,l_text:times%20new%20roman_45_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,g_west,x_180,y_110/co_rgb:000000,l_text:times%20new%20roman_40_bold_normal_left:${encodeURIComponent(certificate.domain)}/fl_layer_apply,g_west,x_590,y_349/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate.enrolment)}/fl_layer_apply,g_south_west,x_395,y_30/co_rgb:000000,l_text:times%20new%20roman_20_normal_left:${encodeURIComponent(certificate._id)}/fl_layer_apply,g_south_west,x_895,y_30/masterclass/j2c10xhtqtngbntgdzng`;
