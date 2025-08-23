// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext.jsx';
import CartPanel from './components/CartPanel.jsx';

// Import all your pages and components
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ThemeToggle from './components/ThemeToggle';
import ProtectedRoute from './components/ProtectedRoute';
import AgentRoute from './components/AgentRoute';
import AdminRoute from './components/AdminRoute';

import './App.css';

// This new component contains the application's layout and logic.
// It can use the useCart() hook because it's rendered inside CartProvider.
function AppContent() {
    const { isCartOpen } = useCart();

    // Theme logic from the original App component
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // This style shifts the main content to the left when the cart is open
    const mainContentStyle = {
        transition: 'margin-right 0.3s ease-in-out',
        marginRight: isCartOpen ? '380px' : '0',
    };

    return (
        <>
            <div style={mainContentStyle}>
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
            <CartPanel /> {/* Render the cart panel outside the shifting content */}
        </>
    );
}


// The main App component is now clean and simple.
function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}

export default App;