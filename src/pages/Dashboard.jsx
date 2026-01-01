import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // In a real app, fetch user profile here
        // fetch('/api/user').then(...)
    }, []);

    return (
        <Layout>
            <div className="dashboard-grid">
                <aside className="sidebar">
                    <h3>Menu</h3>
                    <nav>
                        <Link to="/dashboard" className="nav-link active">Dashboard</Link>
                        <Link to="/upload-news" className="nav-link">Upload Newspaper</Link>
                        <Link to="/live-news" className="nav-link">Live Broadcast 🎙️</Link>
                        <Link to="/upload-link" className="nav-link">Summarize Link </Link>
                        <Link to="/history" className="nav-link">Archive</Link>
                        <Link to="/preferences" className="nav-link">Preferences</Link>
                    </nav>
                </aside>

                <main className="main-content">
                    <header style={{ marginBottom: '2rem' }}>
                        <h1>Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome, {userName}. Select a module to begin.</p>
                    </header>

                    <div className="content-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📄</div>
                            <h4>Read Newspaper</h4> <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>Upload PDF & listen.</p>

                            <Link to="/upload-news" className="btn-sm"
                                style={{ backgroundColor: '#3498db', color: 'white', textDecoration: 'none', display: 'inline-block', fontSize: '0.8rem', border: 'none' }}>
                                Upload PDF
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📻</div>
                            <h4>AI News Studio</h4>
                            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>Listen to your personalized daily broadcast.</p>
                            <Link to="/live-news" className="btn-sm" style={{ backgroundColor: '#3498db', color: 'white', textDecoration: 'none', display: 'inline-block', fontSize: '0.8rem', border: 'none' }}>
                                ▶ Enter Live Studio
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔗</div>
                            <h4>Summarize Link</h4>
                            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>Listen to any web article.</p>

                            <Link to="/upload-link" className="btn-sm"
                                style={{ backgroundColor: '#8e44ad', color: 'white', textDecoration: 'none', display: 'inline-block', fontSize: '0.8rem', border: 'none' }}>
                                Paste URL
                            </Link>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📅</div>
                            <h4>Archive</h4>
                            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>Past briefings.</p>
                            <Link to="/history" className="btn-sm btn-outline">View History</Link>
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default Dashboard;
