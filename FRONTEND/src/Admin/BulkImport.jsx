import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

const BulkImport = () => {
    const [file, setFile] = useState(null);
    const [importStats, setImportStats] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [selectedSource, setSelectedSource] = useState("Bulk CSV Import");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setImportStats(null);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a CSV or Excel file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("source", selectedSource);

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
                    Upload a <strong>CSV or Excel (.xlsx) file</strong> with the following columns:
                </p>
                <code style={{ background: '#f5f5f5', padding: '8px 12px', borderRadius: '4px', display: 'block', marginBottom: '10px', fontSize: '13px' }}>
                    full_name, email, phone_number, opted_domain, year_of_passing, company_name
                </code>
                <a href="/sample_leads.xlsx" download style={{ display: 'inline-block', marginBottom: '10px', color: '#1890ff', textDecoration: 'none', fontWeight: '500' }}>
                    ⬇️ Download Sample Excel File
                </a>

                <div style={{ marginBottom: '20px', padding: '15px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#856404' }}>
                        🎯 Select Lead Source:
                    </label>
                    <select 
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9',
                            fontSize: '14px',
                            background: '#fff'
                        }}
                    >
                        <option value="Bulk CSV Import">Bulk CSV Import (Default)</option>
                        <option value="Meta Ads">Meta Ads</option>
                        <option value="Website Leads">Website Leads</option>
                        <option value="Email Marketing">Email Marketing</option>
                        <option value="Organic Leads">Organic Leads</option>
                    </select>
                </div>

                <div style={{ margin: '20px 0', padding: '30px', border: '2px dashed #91d5ff', borderRadius: '10px', textAlign: 'center', background: '#f0f9ff' }}>
                    <div style={{ marginBottom: '15px', fontSize: '40px' }}>📄</div>
                    <input
                        type="file"
                        accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
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
