import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
const JobPost = () => {
    const [isjobFormVisible, setisjobFormVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [description, setDescription] = useState("");
    const [jobs, setJobs] = useState([]);
    const [editingJobId, setEditingJobId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const toggleVisibility = () => {
        setisjobFormVisible((prevState) => !prevState);
    };
    const resetForm = () => {
        setTitle("");
        setCompany("");
        setExpiryDate("");
        setDescription("");
        setEditingJobId(null);
        setisjobFormVisible(false);
    }; 
    const handleSumbit = async (e) => {
        e.preventDefault();
        const newJob = { title, company, expiryDate, description };
        try {
            if (editingJobId) {
                await axios.put(`${API}/jobs/${editingJobId}`, newJob);   
                alert("Job updated successfully!");
            } else {
                await axios.post(`${API}/jobs`, newJob);
                alert("Job Post Successfully");
            }
            fetchJobs();
            resetForm();
        } catch (error) {
            console.error("There was an error posting the job:", error);
        }
    };
    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${API}/jobs-with-applications`);
            setJobs(response.data);
            // console.log("jobs" ,response.data);
        } catch (error) {
            console.error("There was an error fetching Jobs:", error) 
        }
    };
    const handleEdit = (jobId) => {
        const isConfirmed = window.confirm("Are you sure you want to edit this?");
        if (isConfirmed) {
            const jobToEdit = jobs.find((job) => job._id === jobId);
            setTitle(jobToEdit.title);
            setCompany(jobToEdit.company);
            setExpiryDate(jobToEdit.expiryDate);
            setDescription(jobToEdit.description);
            setEditingJobId(jobId);
            setisjobFormVisible(true);
        }
    };
    const handleDelete = (jobId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Post?");
        if (isConfirmed) {
            axios
                .delete(`${API}/jobs/${jobId}`)
                .then(() => {
                    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
                })
                .catch((error) => {
                    console.error("There was an error deleting the course:", error);
                });
        }
    };
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await axios.put(`${API}/job-applications/${applicationId}`, { status: newStatus });
            setSelectedJob(prev => ({
                ...prev,
                applications: prev.applications.map(app =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            }));
            fetchJobs(); // Refresh the jobs list
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    useEffect(() => {
        fetchJobs();
    }, []);
    const convertToIST = (utcDate) => {
        const date = new Date(utcDate);
        return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true });
    };
    return (
        <div id="AdminAddCourse">
            {isjobFormVisible && (
                <div className="form">
                    <form onSubmit={handleSumbit}>
                        <h2>{editingJobId ? "Edit Jobs" : "Add New Job"}</h2>
                        <span onClick={resetForm}>✖</span>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Designation" required />
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter Company Name" required />
                        <label htmlFor="expiryDate">Expire On:</label>
                        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        <input className="cursor-pointer" type="submit" value="Submit" />
                    </form>
                </div>
            )}
            {selectedJob && (
                <div className="jobdetails">
                    <div className="jobdetailsdiv">
                        <div className="title">
                            <h2>{selectedJob.title}</h2>
                            <span onClick={() => setSelectedJob(null)}>✖</span>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Number</th>
                                    <th>Resume</th>
                                    <th>Applied on</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedJob.applications?.map((application, index) => (
                                    <tr key={index}> 
                                        <td>{index + 1}</td>
                                        <td>{application.userId.fullname}</td>
                                        <td>{application.userId.email}</td>
                                        <td>{application.userId.phone}</td>
                                        <td>
                                            <a href={application.userId.jobResume} target="_blank" className="fa fa-file-text"></a>
                                        </td>
                                        <td>{convertToIST(application.createdAt)}</td>
                                        <td>
                                            <select
                                                value={application.status || 'Pending Review'}
                                                onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                            >
                                                <option value="Pending Review">Pending Review</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Selected">Selected</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="coursetable">
                <div>
                    <h2>Posted Job</h2>
                    <button className="p-2 border border-black rounded-md" onClick={toggleVisibility}> + Add Jobs</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sl No.</th>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Expired On</th>
                            <th>Created at</th>
                            <th>No. Application</th>
                            <th>Updated at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs?.map((job, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{job.title}</td>
                                <td>{job.company}</td>
                                <td>{job.expiryDate}</td>
                                <td>{convertToIST(job.createdAt)}</td>
                                <td className="applicationclick" onClick={() => setSelectedJob(job)}>{job.applications.length}</td>
                                <td>{convertToIST(job.updatedAt)}</td>
                                <td>
                                    <button><i className="fa fa-edit" onClick={() => handleEdit(job._id)}></i></button>
                                    <button onClick={() => handleDelete(job._id)}><i className="fa fa-trash-o text-red-600"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default JobPost;