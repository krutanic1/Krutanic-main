import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const AdminMedApprovals = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchRequests = async (status, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/get-amount-requests?status=${status}&page=${page}&limit=50`);
      setLeads(response.data.leads || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      setTotalLeads(response.data.totalLeads || 0);
    } catch (error) {
      console.error("Error fetching amount requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleResolve = async (leadId, requestId, action) => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this request?`)) {
      return;
    }
    
    try {
      await axios.post(`${API}/resolve-amount-update/${leadId}/${requestId}`, { action });
      toast.success(`Request ${action.toLowerCase()}d successfully`);
      fetchRequests(activeTab);
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action.toLowerCase()} request`);
    }
  };

  return (
    <div id="AdminAddCourse" className="h-full p-4 md:p-6 bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">MedTeam Amount Approvals</h1>
      
      <div className="flex space-x-4 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program / Balances</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No {activeTab.toLowerCase()} requests found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  // Filter requests for the current tab
                  const relevantRequests = lead.amountRequests?.filter(r => r.status === activeTab) || [];
                  
                  return relevantRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.fullname}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-xs text-gray-400 mt-1">Lead: {lead.lead}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.domain}</div>
                        <div className="text-xs text-gray-500 mt-1">Price: ₹{lead.programPrice || 0}</div>
                        <div className="text-xs text-green-600">Paid: ₹{lead.paidAmount || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.requestedBy}</div>
                        <div className="text-xs text-gray-500 mt-1">Counselor: {lead.counselor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">₹{request.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.dateRequested).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {activeTab === 'Pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleResolve(lead._id, request._id, 'Approved')}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleResolve(lead._id, request._id, 'Rejected')}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            activeTab === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {activeTab}
                          </span>
                        )}
                      </td>
                    </tr>
                  ));
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && leads.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing Page {currentPage} of {totalPages} ({totalLeads} total records)
          </span>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedApprovals;
