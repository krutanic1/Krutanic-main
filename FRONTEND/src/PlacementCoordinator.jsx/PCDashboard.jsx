import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const PCDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalApplications: 0,
        totalJobs: 0,
        uniqueCompanies: 0
    });
    const [companyData, setCompanyData] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API}/jobs-with-applications`);
            const jobs = response.data;
            const totalApplications = jobs.reduce((sum, job) => 
                sum + (job.applications?.length || 0), 0);
            const totalJobs = jobs.length;
            const uniqueCompanies = new Set(jobs.map(job => job.company)).size;

            setDashboardData({
                totalApplications,
                totalJobs,
                uniqueCompanies
            });

            const companyStats = {};
            jobs.forEach(job => {
                if (!companyStats[job.company]) {
                    companyStats[job.company] = {
                        totalJobs: 0,
                        totalApplications: 0
                    };
                }
                companyStats[job.company].totalJobs += 1;
                companyStats[job.company].totalApplications += job.applications?.length || 0;
            });

            const companyArray = Object.entries(companyStats).map(([name, stats]) => ({
                companyName: name,
                ...stats
            }));
            setCompanyData(companyArray);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="ml-[265px]">
            <div className="flex flex-wrap gap-8 justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center">
                    <i className="fa fa-users text-2xl mb-3"></i>
                    <h3 className="text-xl font-bold">{dashboardData.totalApplications}</h3>
                    <p className="text-gray-600 mt-1">Total Applications</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center">
                    <i className="fa fa-briefcase text-2xl mb-3"></i>
                    <h3 className="text-xl font-bold">{dashboardData.totalJobs}</h3>
                    <p className="text-gray-600 mt-1">Total Jobs</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md w-64 text-center">
                    <i className="fa fa-building text-2xl mb-3"></i>
                    <h3 className="text-xl font-bold">{dashboardData.uniqueCompanies}</h3>
                    <p className="text-gray-600 mt-1">Companies</p>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-orange-500 mb-4 text-center justify-center">Company name and their Job Application</h2>
                <div className="max-h-64 overflow-y-auto shadow-md rounded-lg">
                    <table className="table-auto w-full">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left">Company Name</th>
                                <th className="px-4 py-2 text-left">Total Jobs</th>
                                <th className="px-4 py-2 text-left">Total Applications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyData.map((company, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border px-4 py-2">{company.companyName}</td>
                                    <td className="border px-4 py-2">{company.totalJobs}</td>
                                    <td className="border px-4 py-2">{company.totalApplications}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default PCDashboard;