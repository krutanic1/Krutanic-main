import React, { useState, useEffect } from 'react';

const DikshaantBlaster = () => {
  const [emails, setEmails] = useState([]);
  const [inputEmails, setInputEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/dikshaant-mails');
      const data = await response.json();
      if (data.ok) {
        setEmails(data.mails);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAddEmails = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailList = inputEmails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
    
    try {
      const response = await fetch('/api/dikshaant-mails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList })
      });
      const data = await response.json();
      if (data.ok) {
        setMessage(`${emailList.length} emails added/processed.`);
        setInputEmails('');
        fetchEmails();
      } else {
        setMessage(data.message || 'Error adding emails');
      }
    } catch (err) {
      setMessage('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (id) => {
    try {
      const response = await fetch(`/api/dikshaant-mails/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.ok) {
        fetchEmails();
      }
    } catch (err) {
      console.error('Failed to delete email:', err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Dikshaant Mail Blaster</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Recipients</h2>
        <form onSubmit={handleAddEmails}>
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
            placeholder="Paste emails separated by commas or new lines..."
            value={inputEmails}
            onChange={(e) => setInputEmails(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-700 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Add Emails to Collection'}
          </button>
          {message && <p className="mt-4 text-sm font-medium text-orange-600">{message}</p>}
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Existing Collection ({emails.length})</h2>
          <button onClick={fetchEmails} className="text-orange-600 text-sm font-bold uppercase tracking-wider">Refresh</button>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Email</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Status</th>
                <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((mail) => (
                <tr key={mail._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 text-gray-700 font-medium">{mail.email}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                      mail.status === 'sent' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {mail.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => deleteEmail(mail._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {emails.length === 0 && <p className="text-center py-8 text-gray-400 italic">No emails in this collection yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default DikshaantBlaster;
