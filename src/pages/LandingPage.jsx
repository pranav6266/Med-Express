// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import ThemeToggle from '../components/ThemeToggle.jsx'; // <-- Import ThemeToggle

function LandingPage() {

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    MedExpress
                </div>
                <nav className={styles.nav}>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <Link to="/login" className={`${styles.navButton} ${styles.loginButton}`}>Login</Link>
                    <Link to="/signup" className={`${styles.navButton} ${styles.signupButton}`}>Sign Up</Link>
                </nav>
            </header>

            <main className={styles.mainContent}>
                <section className={styles.hero}>
                    <h1 className={styles.heroTitle}>
                        Your Health, <br />
                        <span className={styles.gradientText}>Delivered Instantly.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Get your essential medicines and wellness products delivered from your trusted local pharmacies, right to your doorstep. Fast, reliable, and hassle-free.
                    </p>
                    <div className={styles.heroCta}>
                        <Link to="/signup" className={styles.ctaButton}>Get Started Now</Link>
                    </div>
                </section>

                <section className={styles.features}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🚀</div>
                        <h3 className={styles.featureTitle}>Lightning-Fast Delivery</h3>
                        <p className={styles.featureText}>Orders dispatched in minutes, reaching you when you need them the most.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💊</div>
                        <h3 className={styles.featureTitle}>Wide Range of Medicines</h3>
                        <p className={styles.featureText}>Access a comprehensive catalog of medicines and health products from nearby stores.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📍</div>
                        <h3 className={styles.featureTitle}>Real-Time Tracking</h3>
                        <p className={styles.featureText}>Track your order from the pharmacy to your doorstep with live updates.</p>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2025 MedExpress. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;