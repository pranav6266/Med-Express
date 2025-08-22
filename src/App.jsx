import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
    // State for managing the theme
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark'; // Get theme from localStorage or default to dark
    });

    // Function to toggle the theme
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save theme to localStorage
    };

    // Apply the theme to the body or a root element
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="app-container">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;