import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Preferences from './pages/Preferences';
import LiveNews from './pages/LiveNews';
import UploadNews from './pages/UploadNews';
import UploadLink from './pages/UploadLink';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-news" element={<LiveNews />} />
        <Route path="/upload-news" element={<UploadNews />} />
        <Route path="/upload-link" element={<UploadLink />} />
        <Route path="/history" element={<History />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </Router>
  );
}

export default App;
