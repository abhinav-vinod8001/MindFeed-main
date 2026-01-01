import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const History = () => {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState([]); // This will need to be fetched from API? Or we rely on Flask rendering template?
    // Wait, the key issue is that we don't have a JSON API for history yet!
    // The previous app was server-side rendered.
    // I MUST ADD A HISTORY API ENDPOINT IN PYTHON NOW.
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, [selectedDate]);

    const fetchHistory = async () => {
        setLoading(true);
        // We will need to implement /api/history endpoint
        try {
            const query = selectedDate ? `?date=${selectedDate}` : '';
            const res = await fetch(`/history${query}`, {
                headers: {
                    'Accept': 'application/json' // Hint to backend to return JSON? Or just create new endpoint
                }
            });
            // The existing /history route returns HTML. I need to modify backend.
            // For now, let's assume I will fix backend to return JSON if Accept header is json or create new endpoint.
            // Let's assume I create /api/history-data endpoint.
            const data = await res.json();
            setHistoryItems(data.history || []);
        } catch (e) {
            console.error(e);
            // Fallback for now or error
        } finally {
            setLoading(false);
        }
    };

    const replayNews = (item) => {
        localStorage.setItem('replayData', JSON.stringify(item.meta_data));
        navigate('/live-news?mode=replay');
    };

    return (
        <Layout>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2>Your Briefing History</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Past AI summaries generated for you.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            style={{ padding: '0.5rem', fontFamily: 'var(--font-body)' }}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        {selectedDate && (
                            <button onClick={() => setSelectedDate('')} className="btn-sm btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 0.8rem' }}>Clear</button>
                        )}
                    </div>
                </header>

                {loading ? <div style={{ textAlign: 'center' }}>Loading history...</div> : (
                    historyItems.length > 0 ? (
                        <div className="history-list">
                            {historyItems.map(item => (
                                <div key={item.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', transition: 'transform 0.2s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'baseline' }}>
                                        <span style={{ fontWeight: '700', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                            {new Date(item.summary_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--bg-body)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="summary-content" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: '1.7' }}>
                                        {item.content}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {item.meta_data && item.meta_data.topics ? (
                                                item.meta_data.topics.map((t, idx) => (
                                                    <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                        {t.id || t}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>General Briefing</span>
                                            )}
                                        </div>

                                        <button onClick={() => replayNews(item)} className="btn-sm" style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px 16px', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '5px' }}>
                                            ▶ Replay Audio
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: '0.5' }}>📅</div>
                            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>No history found</p>
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
};

export default History;
