import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import './App.css';


// Importing all components
import LandingPage from './pages/LandingPage.jsx';
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
import CartPanel from './components/CartPanel.jsx';



function AppContent() {
    // Setting the theme
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <>
            <div>
                <Routes>
                    {/*Routes which all users can access without authorization.*/}
                    <Route path="/" element={<LandingPage />} />
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