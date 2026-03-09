import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import StatCard from './Components/StatCard';
import toast, { Toaster } from 'react-hot-toast';

const AdminReports = () => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        stage: 'all',
    });
    const [loading, setLoading] = useState(false);

    const handleDownload = async (type, format) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/api/adv-reports/export/${type}`, {
                params: { ...filters, format },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success(`${type.toUpperCase()} report downloaded successfully`);
        } catch (error) {
            toast.error(`Failed to download ${type} report`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Reporting Center</h1>
                <p className="text-gray-500 mt-1">Export system data for business intelligence and compliance</p>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Lead Stage</label>
                    <select
                        value={filters.stage}
                        onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Stages</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Leads Report */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <i className="fa fa-users"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Leads Master Report</h3>
                        <p className="text-gray-500 mb-6">Full dump of lead data including contact info, current stage, and assigned owner.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleDownload('leads', 'csv')}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-text-o"></i> CSV
                        </button>
                        <button
                            onClick={() => handleDownload('leads', 'excel')}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-excel-o"></i> Excel
                        </button>
                    </div>
                </div>

                {/* Call Logs */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <i className="fa fa-phone"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Call Activity Logs</h3>
                        <p className="text-gray-500 mb-6">Detailed record of all interactions, outcomes, and call durations by agents.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleDownload('calls', 'csv')}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-text-o"></i> CSV
                        </button>
                        <button
                            onClick={() => handleDownload('calls', 'excel')}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-excel-o"></i> Excel
                        </button>
                    </div>
                </div>

                {/* Conversions PDF */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <i className="fa fa-trophy"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sales Conversion Report</h3>
                        <p className="text-gray-500 mb-6">Executive summary of all converted leads. Optimized for PDF presentation.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleDownload('conversions', 'csv')}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-text-o"></i> CSV
                        </button>
                        <button
                            onClick={() => handleDownload('conversions', 'pdf')}
                            className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-file-pdf-o"></i> PDF
                        </button>
                    </div>
                </div>

                {/* Follow-ups */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between opacity-50 cursor-not-allowed">
                    <div>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                            <i className="fa fa-calendar-check-o"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Follow-up Schedules</h3>
                        <p className="text-gray-500 mb-6">Upcoming and overdue follow-up tasks across the sales team (Coming Soon).</p>
                    </div>
                    <button disabled className="w-full py-3 bg-gray-200 text-gray-500 font-bold rounded-xl">
                        Unavailable
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
