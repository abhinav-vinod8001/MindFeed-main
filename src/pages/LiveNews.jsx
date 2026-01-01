import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import NewsPlayer from '../components/NewsPlayer';

const LiveNews = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode'); // 'replay' or null
    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            if (mode === 'replay') {
                const savedData = localStorage.getItem('replayData');
                if (savedData) {
                    setNewsData(JSON.parse(savedData));
                    setLoading(false);
                    return;
                }
            }

            // Live Mode
            try {
                const res = await fetch('/api/process-news', { method: 'POST' });
                const data = await res.json();
                if (data.success && data.news_data) {
                    setNewsData(data.news_data);
                } else {
                    setError('Failed to fetch news.');
                }
            } catch (err) {
                setError('Network error.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [mode]);

    return (
        <Layout>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>🎙️ Live News Studio</h1>
                    <p style={{ color: 'var(--text-muted)' }}>AI-Powered Personal Radio</p>
                </div>
            </header>

            {loading && <div style={{ textAlign: 'center', padding: '3rem' }}>Loading News...</div>}

            {error && <div className="message error" style={{ display: 'block' }}>{error}</div>}

            {newsData && (
                <NewsPlayer newsData={newsData} mode={mode || 'live'} />
            )}
        </Layout>
    );
};

export default LiveNews;
