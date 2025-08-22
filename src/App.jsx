// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // Import Admin Dashboard
import ThemeToggle from './components/ThemeToggle';
import ProtectedRoute from './components/ProtectedRoute';
import AgentRoute from './components/AgentRoute';
import AdminRoute from './components/AdminRoute'; // Import Admin Route
import './App.css';

function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="app-container">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/orders" element={<OrderHistory />} />
                    </Route>

                    {/* Protected Agent Routes */}
                    <Route element={<AgentRoute />}>
                        <Route path="/agent/dashboard" element={<AgentDashboard />} />
                    </Route>

                    {/* Protected Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
