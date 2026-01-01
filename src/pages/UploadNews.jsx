import React, { useState } from 'react';
import Layout from '../components/Layout';
import NewsPlayer from '../components/NewsPlayer';

const UploadNews = () => {
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setNewsData(data.news_data);
            } else {
                alert("Error: " + data.message);
            }
        } catch (e) {
            console.error(e);
            alert("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            {!newsData ? (
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
                    <header style={{ marginBottom: '2rem' }}>
                        <h1>Upload Newspaper</h1>
                        <p style={{ color: 'var(--text-muted)' }}>We will extract only the news relevant to your preferences.</p>
                    </header>

                    {!loading ? (
                        <div
                            className="card"
                            style={{
                                padding: '3rem',
                                border: `2px dashed ${dragActive ? '#27ae60' : '#ccc'}`,
                                borderRadius: '15px',
                                transition: 'all 0.3s',
                                backgroundColor: dragActive ? '#f0fdf4' : 'var(--bg-card)'
                            }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                            <h3 style={{ marginBottom: '1rem' }}>Drag & Drop PDF here</h3>
                            <p style={{ color: '#888', marginBottom: '2rem' }}>or click to browse</p>

                            <input type="file" id="file-input" accept="application/pdf" style={{ display: 'none' }} onChange={handleChange} />
                            <button onClick={() => document.getElementById('file-input').click()} className="btn-sm">Select PDF</button>
                        </div>
                    ) : (
                        <div id="loading" style={{ marginTop: '2rem' }}>
                            <div style={{ fontSize: '1.2rem', color: '#27ae60', fontWeight: 'bold', marginBottom: '10px' }}>
                                🤖 AI is reading the newspaper...
                            </div>
                            <p style={{ color: '#666' }}>Filtering based on your interests...</p>
                            <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #27ae60', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '20px auto' }}></div>
                            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1>🎙️ Personalized Paper Review</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Curated from your upload</p>
                        </div>
                        <button onClick={() => setNewsData(null)} className="btn-sm btn-outline">Upload Another</button>
                    </header>
                    <NewsPlayer newsData={newsData} onExit={() => setNewsData(null)} />
                </div>
            )}
        </Layout>
    );
};

export default UploadNews;
