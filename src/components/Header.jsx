// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Import the useCart hook

function Header() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const { toggleCart, cartItems } = useCart(); // Get cart functions and data

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const renderNavLinks = () => {
        if (!userInfo) return null;
        switch (userInfo.role) {
            case 'user':
                return (
                    <>
                        <li style={styles.navItem}>
                            <Link to="/dashboard" style={styles.link}>Medicines</Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link to="/orders" style={styles.link}>My Orders</Link>
                        </li>
                    </>
                );
            case 'agent':
                return (
                    <li style={styles.navItem}>
                        <Link to="/agent/dashboard" style={styles.link}>Assigned Orders</Link>
                    </li>
                );
            case 'admin':
                return (
                    <li style={styles.navItem}>
                        <Link to="/admin/dashboard" style={styles.link}>Admin Dashboard</Link>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to={userInfo ? (userInfo.role === 'user' ? '/dashboard' : `/${userInfo.role}/dashboard`) : '/login'} style={styles.link}>
                    MedExpress
                </Link>
            </div>
            <nav>
                <ul style={styles.navList}>
                    {renderNavLinks()}
                </ul>
            </nav>
            <div style={styles.userSection}>
                {userInfo && <span style={styles.userName}>{userInfo.name} ({userInfo.role})</span>}

                {/* --- NEW: Cart Button --- */}
                {userInfo && userInfo.role === 'user' && (
                    <button onClick={toggleCart} style={styles.cartButton}>
                        🛒
                        {cartItems.length > 0 && (
                            <span style={styles.cartBadge}>{cartItems.length}</span>
                        )}
                    </button>
                )}

                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
        </header>
    );
}

// Styling
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'var(--card-background)',
        color: 'var(--text-color)',
        borderBottom: '1px solid var(--card-border)',
        marginBottom: '2rem',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
    },
    navItem: {},
    link: {
        color: 'var(--text-color)',
        textDecoration: 'none',
        fontSize: '1rem',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    userName: {
        fontWeight: '500',
    },
    // --- NEW: Cart Button Styles ---
    cartButton: {
        position: 'relative',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: 'var(--text-color)',
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
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    }
};

export default Header;