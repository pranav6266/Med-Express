import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import styles from './Header.module.css'; // Import the new CSS Module

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleCart, cartItems } = useCart();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

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
        return location.pathname === path ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink;
    };

    const getDashboardPath = () => {
        if (!userInfo) return '/login';
        switch (userInfo.role) {
            case 'admin': return '/admin/dashboard';
            case 'agent': return '/agent/dashboard';
            default: return '/dashboard';
        }
    };

    const renderNavLinks = () => {
        if (!userInfo) return null;
        switch (userInfo.role) {
            case 'admin': return <span className={styles.roleIdentifier}>Admin Portal</span>;
            case 'agent': return <span className={styles.roleIdentifier}>Agent Portal</span>;
            default:
                return (
                    <nav className={styles.navigation}>
                        <Link to="/dashboard" className={getLinkStyle('/dashboard')}>Shop</Link>
                        <Link to="/orders" className={getLinkStyle('/orders')}>My Orders</Link>
                    </nav>
                );
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.logoContainer}>
                    <Link to={getDashboardPath()} className={styles.logo}>MedExpress</Link>
                    <span className={styles.tagline}>Your Health, Delivered Fast</span>
                </div>
                {renderNavLinks()}
            </div>
            <div className={styles.headerRight}>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                {userInfo && (
                    <>
                        {userInfo.role === 'user' && (
                            <div onClick={toggleCart} className={styles.cartIconContainer}>
                                <span>🛒</span>
                                {cartItems.length > 0 && (
                                    <span className={styles.cartBadge}>{cartItems.length}</span>
                                )}
                            </div>
                        )}
                        <div className={styles.profileContainer} ref={dropdownRef}>
                            <img
                                src={userInfo.avatar}
                                alt="Profile"
                                className={styles.avatar}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                            {isDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>
                                        Signed in as<br /><strong>{userInfo.name}</strong>
                                    </div>
                                    <Link to="/profile" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}>
                                        👤 My Profile
                                    </Link>
                                    <div className={styles.dropdownDivider}></div>
                                    <button onClick={handleLogout} className={`${styles.dropdownLink} ${styles.logoutButton}`}>
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

export default Header;