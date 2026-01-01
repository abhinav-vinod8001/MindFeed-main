import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        language: 'ml',
        summary_length: 'balanced',
        topics: [] // We'll keep it simple for register, maybe just a multi-select or list
    });
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            let updatedTopics = [...formData.topics];
            if (checked) {
                updatedTopics.push(value);
            } else {
                updatedTopics = updatedTopics.filter(t => t !== value);
            }
            setFormData(prev => ({ ...prev, topics: updatedTopics }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (formData.password !== formData.confirm_password) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ text: 'Success! Redirecting...', type: 'success' });
                setTimeout(() => {
                    navigate('/dashboard'); // Use navigate instead of window.location for SPA feel, but layout checks session
                    // Re-check auth might be needed. For now assume register logs us in or redirects to login
                    if (data.redirect) window.location.href = data.redirect;
                }, 1500);
            } else {
                setMessage({ text: data.message || 'Registration failed', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network error', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="card">
                    <h2>Create Account</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Join to get personalized news updates
                    </p>

                    {message && <div className={`message ${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" className="form-control" required placeholder="John Doe" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" className="form-control" required placeholder="name@company.com" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" className="form-control" required placeholder="••••••••" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" className="form-control" required placeholder="••••••••" onChange={handleChange} />
                        </div>

                        <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '2rem 0' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personalize Your Feed</h3>

                        <div className="form-group">
                            <label>Interested Topics</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {['Technology', 'Finance', 'Health', 'Science', 'Sports', 'Entertainment'].map(topic => (
                                    <label key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
                                        <input type="checkbox" name="topics" value={topic} onChange={handleChange} /> {topic}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Preferred Language</label>
                            <select name="language" className="form-control" onChange={handleChange} value={formData.language}>
                                <option value="ml">Malayalam (മലയാളം)</option>
                                <option value="en">English</option>
                                <option value="hi">Hindi (हिंदी)</option>
                                <option value="ta">Tamil (தமிழ்)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Summary Detail Level</label>
                            <select name="summary_length" className="form-control" onChange={handleChange} value={formData.summary_length}>
                                <option value="concise">Concise (Bullet points)</option>
                                <option value="balanced">Balanced (Standard)</option>
                                <option value="detailed">Detailed (In-depth)</option>
                            </select>
                        </div>
                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="links">
                        <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                        <Link to="/login">Log in</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
