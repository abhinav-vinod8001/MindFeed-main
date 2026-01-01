import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const AVAILABLE_TOPICS = [
    { id: 'Technology', icon: '💻', label: 'Technology' },
    { id: 'Finance', icon: '📈', label: 'Finance' },
    { id: 'Health', icon: '❤️', label: 'Health' },
    { id: 'Science', icon: '🧬', label: 'Science' },
    { id: 'Sports', icon: '⚽', label: 'Sports' },
    { id: 'Entertainment', icon: '🎬', label: 'Entertainment' },
    { id: 'Startups', icon: '🚀', label: 'Startups' },
    { id: 'Space', icon: '🪐', label: 'Space' },
    { id: 'Politics', icon: '🏛️', label: 'Politics' },
    { id: 'World', icon: '🌍', label: 'World News' },
    { id: 'Kerala', icon: '📍', label: 'Local News' },
];

const DEPTH_PREVIEWS = {
    'concise': "• Tech giant unveils new AI model.\n• Stock market rallies on positive data.\n• New medical breakthrough announced.",
    'balanced': "Tech giant unveiled a new AI model today that claims to solve complex problems 2x faster. Meanwhile, the stock market rallied as inflation data came in lower than expected, signaling economic stability.",
    'detailed': "In a major announcement, the tech giant revealed their latest AI architecture, focusing on transformer efficiency. Benchmarks show a 200% speed improvement. Analysts suggest this could disrupt the cloud computing sector. Markets reacted positively, with the NASDAQ rising 2%..."
};

const Preferences = () => {
    // State
    const [selectedTopics, setSelectedTopics] = useState({}); // { 'Tech': 80 }
    const [depth, setDepth] = useState('balanced');
    const [language, setLanguage] = useState('ml');
    const [time, setTime] = useState('5');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch initial preferences
    useEffect(() => {
        // In a real app we'd fetch from API. 
        // For now, let's assume default or try to fetch if we had an endpoint that returns JSON preferences
        // The Flask template injected `preferences | tojson`. We need an API endpoint for this.
        // Assuming we might need to add one or just start blank. 
        // Let's try to mock it or fetch if /auth/preferences returns JSON on GET.
        // The current Flask `auth/routes.py` renders template. We might need to adjust backend to return JSON if requested.
        // OR we just start with defaults for now.
        setLoading(false);
    }, []);

    const toggleTopic = (id) => {
        setSelectedTopics(prev => {
            const newTopics = { ...prev };
            if (newTopics[id]) {
                delete newTopics[id];
            } else {
                newTopics[id] = 50;
            }
            return newTopics;
        });
    };

    const updateInterest = (id, value) => {
        setSelectedTopics(prev => ({
            ...prev,
            [id]: parseInt(value)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage(null);

        const topicsList = Object.entries(selectedTopics).map(([id, interest]) => ({ id, interest }));
        const payload = {
            topics: topicsList,
            summary_length: depth,
            language: language,
            reading_time: time
        };

        try {
            const res = await fetch('/auth/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setMessage({ text: 'Preferences saved successfully!', type: 'success' });
            } else {
                setMessage({ text: 'Failed to save.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error.', type: 'error' });
        }
    };

    if (loading) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2>Design Your Experience</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Customize how our AI analyzes and presents your daily briefing.</p>
                </header>

                {message && <div className={`message ${message.type}`} style={{ display: 'block' }}>{message.text}</div>}

                <form onSubmit={handleSave}>
                    {/* Section 1: Interest DNA */}
                    <section style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                            <h3>Interest DNA <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Select active topics</span></h3>
                        </div>

                        <div className="topics-grid">
                            {AVAILABLE_TOPICS.map(topic => {
                                const isSelected = selectedTopics.hasOwnProperty(topic.id);
                                const intensity = isSelected ? selectedTopics[topic.id] : 50;
                                return (
                                    <div
                                        key={topic.id}
                                        className={`topic-card ${isSelected ? 'active' : ''}`}
                                        onClick={() => toggleTopic(topic.id)}
                                    >
                                        <div className="topic-header">
                                            <span><span className="topic-icon">{topic.icon}</span> {topic.label}</span>
                                            {isSelected && <span>✔</span>}
                                        </div>
                                        {isSelected && (
                                            <div className="topic-slider-container" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="range"
                                                    className="interest-slider"
                                                    min="10"
                                                    max="100"
                                                    value={intensity}
                                                    onChange={(e) => updateInterest(topic.id, e.target.value)}
                                                />
                                                <div className="interest-value">{intensity}% Interest</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 2: Content Depth */}
                    <section style={{ marginBottom: '4rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Content Depth</h3>
                        <div className="depth-control-wrapper">
                            {[
                                { val: 'concise', icon: '⚡', label: 'Quick Scan' },
                                { val: 'balanced', icon: '📄', label: 'Standard' },
                                { val: 'detailed', icon: '🔍', label: 'Deep Dive' }
                            ].map(opt => (
                                <div
                                    key={opt.val}
                                    className={`depth-option ${depth === opt.val ? 'active' : ''}`}
                                    onClick={() => setDepth(opt.val)}
                                >
                                    <span className="depth-icon">{opt.icon}</span>
                                    <span className="depth-label">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="preview-box" style={{ opacity: 1 }}>
                            {DEPTH_PREVIEWS[depth]}
                        </div>
                    </section>

                    {/* Section 2: Language & Region */}
                    <section style={{ marginBottom: '4rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Language & Region</h3>
                        <div className="depth-control-wrapper" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                            {[
                                { val: 'ml', icon: 'മലയാളം', label: 'Malayalam' },
                                { val: 'en', icon: 'English', label: 'English' },
                                { val: 'hi', icon: 'हिंदी', label: 'Hindi' },
                                { val: 'ta', icon: 'தமிழ்', label: 'Tamil' }
                            ].map(opt => (
                                <div
                                    key={opt.val}
                                    className={`depth-option ${language === opt.val ? 'active' : ''}`}
                                    onClick={() => setLanguage(opt.val)}
                                >
                                    <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{opt.icon}</span>
                                    <span className="depth-label">{opt.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Content Depth */}
                    <section style={{ marginBottom: '4rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Session Duration</h3>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>How much time do you have for news today?</p>
                        <div className="time-options">
                            {['2', '5', '10'].map(t => (
                                <div
                                    key={t}
                                    className={`time-card ${time === t ? 'active' : ''}`}
                                    onClick={() => setTime(t)}
                                >
                                    <div className="time-value">{t}</div>
                                    <div className="time-label">Minutes</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div style={{ position: 'sticky', bottom: '2rem', background: 'var(--bg-body)', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        <button type="submit" className="auth-btn">Save Preferences</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Preferences;
