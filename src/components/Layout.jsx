import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();
    // TODO: Add auth state check here
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        await fetch('/auth/logout');
        window.location.href = '/login';
    };

    return (
        <div className="layout">
            <header className="main-header">
                <div className="header-content">
                    <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                        <span className="logo-icon">🧠</span>
                        <span className="logo-text">Mind<strong>Feed</strong></span>
                    </Link>

                    <div className="header-actions">
                        <button id="theme-toggle" className="icon-btn" aria-label="Toggle Dark Mode" onClick={toggleTheme}>
                            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                        </button>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="btn-sm btn-outline">Sign Out</button>
                        ) : (
                            <Link to="/login" className="btn-sm">Login</Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="app-container">
                {children}
            </main>

            <footer className="main-footer">
                <p>&copy; 2025 MindFeed. Powered by team ByteForce.</p>
            </footer>
        </div>
    );
};

export default Layout;
