// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
        </header>
    );
}

// Basic styling
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
