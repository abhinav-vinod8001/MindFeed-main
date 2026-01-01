import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Login success
                // We might need to handle session check better in global state
                window.location.href = '/dashboard'; // Force reload to sync session or just navigate
            } else {
                setMessage({ text: data.message || 'Login failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Network connection error', type: 'error' });
        }
    };

    return (
        <Layout>
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Login</h2>
                    {message && <div className={`message ${message.type}`}>{message.text}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
