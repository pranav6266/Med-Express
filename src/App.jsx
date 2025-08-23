// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import CartPanel from './components/CartPanel.jsx';

// Import all your pages and components
import LandingPage from './pages/LandingPage.jsx'; // <-- IMPORT THE NEW PAGE
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AgentRoute from './components/AgentRoute';
import AdminRoute from './components/AdminRoute';
import Profile from './pages/Profile.jsx';

import './App.css';

// AppContent remains mostly the same
function AppContent() {
    // Note: The theme logic can be removed from here if each page now handles its own theme,
    // or it can be kept as a global fallback. For simplicity, we assume it's kept.
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <>
            <div>
                <Routes>
                    {/* --- UPDATED ROUTES --- */}
                    <Route path="/" element={<LandingPage />} /> {/* <-- New landing page route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected User Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/profile" element={<Profile />} />
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
            </div>
            {/* CartPanel will only appear on pages where CartProvider is active */}
            <CartPanel />
        </>
    );
}

function App() {
    return (
        <Router>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </Router>
    );
}

export default App;