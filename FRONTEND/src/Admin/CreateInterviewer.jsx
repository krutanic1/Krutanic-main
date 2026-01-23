import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API from "../API";

const CreateInterviewer = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
    });

    useEffect(() => {
        fetchInterviewers();
    }, []);

    const fetchInterviewers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/interviewer/all`);
            setInterviewers(res.data);
        } catch (error) {
            console.error("Failed to fetch interviewers", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API}/api/interviewer/create-interviewer`, formData);
            if (response.status === 201) {
                toast.success("Interviewer Created Successfully!");
                setFormData({ fullname: "", email: "", phone: "", password: "" });
                setIsFormVisible(false); // Close form
                fetchInterviewers(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create interviewer");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interviewer?")) return;
        try {
            await axios.delete(`${API}/api/interviewer/delete-interviewer/${id}`);
            toast.success("Interviewer deleted successfully");
            fetchInterviewers(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete interviewer");
        }
    };

    return (
        <div id="AdminAddCourse">
            <Toaster position="top-center" reverseOrder={false} />

            {isFormVisible && (
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <span onClick={toggleVisibility}>✖</span>
                        <h2>Create Interviewer Account</h2>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <input type="submit" value="Create Account" className="cursor-pointer" />
                    </form>
                </div>
            )}

            <div className="coursetable">
                <div>
                    <h2>Interviewer List</h2>
                    <span onClick={toggleVisibility}>+ Add New Interviewer</span>
                </div>

                {loading ? (
                    <div id="loader">
                        <div className="three-body">
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                            <div className="three-body__dot"></div>
                        </div>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Sl.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Password</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interviewers.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullname}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone || "N/A"}</td>
                                    <td>{item.password}</td>
                                    <td>
                                        <button title="Delete" onClick={() => handleDelete(item._id)}>
                                            <i className="fa fa-trash-o text-red-600"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CreateInterviewer;
