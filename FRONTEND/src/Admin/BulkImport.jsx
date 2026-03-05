import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

const BulkImport = () => {
    const [file, setFile] = useState(null);
    const [importStats, setImportStats] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setImportStats(null);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a CSV file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const response = await axios.post(`${API}/api/adv-leads/bulk-import`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Import Complete!");
            setImportStats(response.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Import failed. Check file format.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />
            <div className="coursetable">
                <h1>📥 Bulk Lead Import</h1>
                <p style={{ color: '#666', marginBottom: '5px' }}>
                    Upload a <strong>CSV file</strong> with the following columns:
                </p>
                <code style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: '4px', display: 'block', marginBottom: '20px', fontSize: '13px' }}>
                    full_name, email, phone_number, opted_domain, year_of_passing, company_name
                </code>

                <div style={{ margin: '20px 0', padding: '30px', border: '2px dashed #91d5ff', borderRadius: '10px', textAlign: 'center', background: '#f0f9ff' }}>
                    <div style={{ marginBottom: '15px', fontSize: '40px' }}>📄</div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ marginBottom: '15px' }}
                    />
                    {file && <p style={{ color: '#1890ff', margin: '10px 0' }}>Selected: <strong>{file.name}</strong></p>}
                    <br />
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        style={{
                            marginTop: '10px',
                            padding: '10px 25px',
                            background: uploading ? '#ccc' : '#1890ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        {uploading ? "Uploading..." : "Upload & Import"}
                    </button>
                </div>

                {importStats && (
                    <div style={{ marginTop: '20px', padding: '20px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 10px', color: '#389e0d' }}>✅ Import Complete</h3>
                        <p style={{ margin: '4px 0' }}>
                            Successfully imported: <strong style={{ color: 'green' }}>{importStats.successCount}</strong>
                        </p>
                        <p style={{ margin: '4px 0' }}>
                            Skipped (duplicates/errors): <strong style={{ color: 'red' }}>{importStats.failCount}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkImport;
