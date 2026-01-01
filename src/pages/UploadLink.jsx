import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const UploadLink = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const processLink = async () => {
        if (!url) {
            alert("Please paste a valid URL.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/process-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });
            const data = await res.json();

            if (data.success) {
                // Save to localStorage for replay mode
                localStorage.setItem('replayData', JSON.stringify(data.news_data));
                navigate('/live-news?mode=replay');
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
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1>Summarize Article</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Paste a news link (Mathrubhumi, Manorama, etc.) to listen to it.</p>
                </header>

                {!loading ? (
                    <div className="card" style={{ padding: '3rem', borderRadius: '15px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>

                        <input
                            type="url"
                            placeholder="https://..."
                            className="form-control"
                            style={{ width: '100%', padding: '12px', marginBottom: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' }}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />

                        <button onClick={processLink} className="btn-sm" style={{ width: '100%', fontSize: '1rem', padding: '12px', boxSizing: 'border-box' }}>
                            ✨ Summarize & Listen
                        </button>
                    </div>
                ) : (
                    <div id="loading" style={{ marginTop: '2rem' }}>
                        <div style={{ fontSize: '1.2rem', color: '#8e44ad', fontWeight: 'bold', marginBottom: '10px' }}>
                            🤖 AI is reading the website...
                        </div>
                        <p style={{ color: '#666' }}>Removing ads and summarizing content...</p>
                        <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #8e44ad', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '20px auto' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UploadLink;
