// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
// --- 1. IMPORT THE NEW THEME TOGGLE ---
import ThemeToggle from './ThemeToggle.jsx';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleCart, cartItems } = useCart();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // --- 2. MOVE THEME STATE AND LOGIC HERE ---
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);


    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getLinkStyle = (path) => {
        return location.pathname === path ?
            { ...styles.navLink, ...styles.activeNavLink } : styles.navLink;
    };

    const getDashboardPath = () => {
        if (!userInfo) return '/login';
        switch (userInfo.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'agent':
                return '/agent/dashboard';
            default:
                return '/dashboard';
        }
    };

    const dashboardPath = getDashboardPath();

    const renderNavLinks = () => {
        if (!userInfo) return null;
        switch (userInfo.role) {
            case 'admin':
                return <span style={styles.roleIdentifier}>Admin Portal</span>;
            case 'agent':
                return <span style={styles.roleIdentifier}>Agent Portal</span>;
            default:
                return (
                    <nav style={styles.navigation}>
                        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Shop</Link>
                        <Link to="/orders" style={getLinkStyle('/orders')}>My Orders</Link>
                    </nav>
                );
        }
    };


    return (
        <header style={styles.header}>
            <div style={styles.headerLeft}>
                <div style={styles.logoContainer}>
                    <Link to={dashboardPath} style={styles.logo}>MedExpress</Link>
                    <span style={styles.tagline}>Your Health, Delivered Fast</span>
                </div>
                {renderNavLinks()}
            </div>

            <div style={styles.headerRight}>
                {/* --- 3. ADD THE THEME TOGGLE TO THE HEADER --- */}
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                {userInfo && (
                    <>
                        {userInfo.role === 'user' && (
                            <div onClick={toggleCart} style={styles.cartIconContainer}>
                                <span>🛒</span>
                                {cartItems.length > 0 && (
                                    <span style={styles.cartBadge}>{cartItems.length}</span>
                                )}
                            </div>
                        )}

                        <div style={styles.profileContainer} ref={dropdownRef}>
                            <img
                                src={userInfo.avatar}
                                alt="Profile"
                                style={styles.avatar}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />

                            {isDropdownOpen && (
                                <div style={styles.dropdownMenu}>
                                    <div style={styles.dropdownHeader}>
                                        Signed in as<br /><strong>{userInfo.name}</strong>
                                    </div>
                                    <Link to="/profile" style={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>
                                        👤 My Profile
                                    </Link>
                                    <div style={styles.dropdownDivider}></div>
                                    <button onClick={handleLogout} style={{ ...styles.dropdownLink, ...styles.logoutButton }}>
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

// STYLES (NO CHANGES NEEDED HERE)
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        backgroundColor: 'var(--card-background)',
        color: 'var(--text-color)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '2.5rem'
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    logo: {
        fontSize: '1.7rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'var(--text-color)'
    },
    tagline: {
        fontSize: '0.75rem',
        color: '#ccc',
        marginTop: '-5px'
    },
    navigation: {
        display: 'flex',
        gap: '2rem'
    },
    roleIdentifier: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: 'var(--primary-color)',
        border: '1px solid var(--card-border)',
        padding: '0.4rem 0.8rem',
        borderRadius: '8px'
    },
    navLink: {
        textDecoration: 'none',
        color: 'var(--text-color)',
        fontSize: '1rem',
        padding: '0.5rem 0',
        borderBottom: '2px solid transparent',
        transition: 'border-color 0.3s, color 0.3s'
    },
    activeNavLink: {
        color: 'var(--primary-color)',
        borderBottom: '2px solid var(--primary-color)'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem' // Adjusted gap for the new icon
    },
    cartIconContainer: {
        position: 'relative',
        cursor: 'pointer',
        fontSize: '1.5rem',
    },
    cartBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-10px',
        background: 'var(--glow-color)',
        color: 'white',
        borderRadius: '50%',
        padding: '0.1rem 0.4rem',
        fontSize: '0.75rem',
        fontWeight: 'bold'
    },
    profileContainer: { position: 'relative' },
    avatar: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        cursor: 'pointer',
        border: '2px solid var(--primary-color)',
        objectFit: 'cover'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '60px',
        right: '0',
        backgroundColor: 'var(--background-start)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '0.5rem',
        zIndex: 20,
        width: '220px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    },
    dropdownHeader: {
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--card-border)',
        marginBottom: '0.5rem',
        color: '#aaa',
        fontSize: '0.9rem'
    },
    dropdownLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        color: 'var(--text-color)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'background-color 0.2s'
    },
    dropdownDivider: {
        height: '1px',
        backgroundColor: 'var(--card-border)',
        margin: '0.5rem 0'
    },
    logoutButton: {
        color: '#ff8a8a'
    }
};

export default Header;