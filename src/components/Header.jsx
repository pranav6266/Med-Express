// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function Header() {
    const navigate = useNavigate();
    const { toggleCart, cartItems } = useCart();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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

    const handleCartClick = () => {
        toggleCart();
        setIsDropdownOpen(false);
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to={userInfo ? (userInfo.role === 'user' ? '/dashboard' : `/${userInfo.role}/dashboard`) : '/login'} style={styles.link}>
                    MedExpress
                </Link>
            </div>

            <div style={styles.userSection}>
                {userInfo && (
                    <div style={styles.profileContainer} ref={dropdownRef}>
                        <img
                            src={userInfo.avatar}
                            alt="Profile"
                            style={styles.avatar}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />

                        {isDropdownOpen && (
                            <div style={styles.dropdownMenu}>
                                {/* --- REORDERED and RESTYLED Items --- */}
                                <Link to="/profile" style={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>
                                    My Profile
                                </Link>

                                {userInfo.role === 'user' && (
                                    <button onClick={handleCartClick} style={styles.dropdownLink}>
                                        <div style={styles.dropdownCartItem}>
                                            <span>My Cart</span>
                                            {cartItems.length > 0 && (
                                                <span style={styles.cartBadge}>{cartItems.length}</span>
                                            )}
                                        </div>
                                    </button>
                                )}

                                <Link to="/orders" style={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>
                                    My Orders
                                </Link>

                                <button onClick={handleLogout} style={styles.dropdownLink}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', backgroundColor: 'var(--card-background)',
        color: 'var(--text-color)', borderBottom: '1px solid var(--card-border)',
        marginBottom: '2rem',
    },
    logo: { fontSize: '1.5rem', fontWeight: 'bold' },
    link: { color: 'var(--text-color)', textDecoration: 'none' },
    userSection: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    profileContainer: { position: 'relative' },
    avatar: {
        width: '45px', height: '45px', borderRadius: '50%',
        cursor: 'pointer', border: '2px solid var(--primary-color)', objectFit: 'cover'
    },
    dropdownMenu: {
        position: 'absolute', top: '60px', right: '0',
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--card-border)',
        borderRadius: '8px',
        padding: '0.5rem',
        zIndex: 20,
        width: '180px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    // --- NEW UNIFIED STYLE for all dropdown items (links and buttons) ---
    dropdownLink: {
        display: 'flex', // Use flex for alignment
        alignItems: 'center', // Center content vertically
        width: '100%',
        padding: '0.75rem 1rem',
        color: 'var(--text-color)',
        textAlign: 'left',
        // Reset button/link specific styles
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        textDecoration: 'none',
        borderRadius: '4px',
    },
    dropdownCartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    cartBadge: {
        background: 'var(--glow-color)', color: 'white',
        borderRadius: '10px', padding: '0.1rem 0.5rem',
        fontSize: '0.75rem', fontWeight: 'bold',
    },
};

export default Header;