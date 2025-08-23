// src/pages/Signup.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import ThemeToggle from '../components/ThemeToggle.jsx';

function Signup() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- State for simplified email validation ---
    const [emailError, setEmailError] = useState('');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // This complex useEffect for backend checking is now removed.

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        // Final check before submitting
        if (step === 2 && (emailError || !form.email)) {
            setError('Please provide a valid email before proceeding.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const { name, email, password, role } = form;
            await axios.post('/api/auth/register', { name, email, password, role });
            setSuccess(true);
        } catch (err)
        {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // --- Simplified Email Validation Logic ---
        if (name === 'email') {
            if (!value) {
                setEmailError(''); // Clear error if field is empty
            } else if (value.includes('@') && value.endsWith('.com')) {
                setEmailError(''); // Valid format, clear error
            } else {
                setEmailError('Email must include "@" and end with ".com"');
            }
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setForm({ ...form, role: selectedRole });
        nextStep();
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { name: 'role', type: 'selection', label: 'I want to sign up as a...' },
        { name: 'name', type: 'text', label: 'Full Name' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'confirmPassword', type: 'password', label: 'Confirm Password' },
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentStepName = steps[step].name;
            const isEmailStep = currentStepName === 'email';
            // Prevent proceeding if email has an error
            if (form[currentStepName] && (!isEmailStep || !emailError)) {
                nextStep();
            }
        }
    };

    const renderInput = () => {
        const currentStep = steps[step];
        const isPasswordField = currentStep.name === 'password';
        const isConfirmPasswordField = currentStep.name === 'confirmPassword';

        if (isPasswordField || isConfirmPasswordField) {
            const isVisible = isPasswordField ? showPassword : showConfirmPassword;
            const toggleVisibility = () => {
                if (isPasswordField) {
                    setShowPassword(p => !p);
                } else {
                    setShowConfirmPassword(p => !p);
                }
            };

            return (
                <div className={styles.passwordWrapper}>
                    <input
                        type={isVisible ? 'text' : 'password'}
                        name={currentStep.name}
                        placeholder={`Enter your ${currentStep.name.replace('Password', ' password')}`}
                        value={form[currentStep.name]}
                        onChange={handleChange}
                        onKeyDown={step < steps.length - 1 ? handleKeyDown : undefined}
                        autoFocus
                    />
                    <span className={styles.passwordIcon} onClick={toggleVisibility}>
                        {isVisible ? '🙈' : '👁️'}
                    </span>
                </div>
            );
        }

        return (
            <input
                type={currentStep.type}
                name={currentStep.name}
                placeholder={`Enter your ${currentStep.label.toLowerCase()}`}
                value={form[currentStep.name]}
                onChange={handleChange}
                onKeyDown={step < steps.length - 1 ? handleKeyDown : undefined}
                autoFocus
            />
        );
    };

    if (success) {
        return (
            <div className={styles.formContainer}>
                <div className={styles.formCard}>
                    <div className={styles.themeToggleContainer}>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                    <h2>Signup Successful!</h2>
                    <p>You can now log in.</p>
                    <Link to="/login">
                        <button>Go to Login</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.formCard}>
                <div className={styles.themeToggleContainer}>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                <h2>Signup</h2>
                <form onSubmit={handleSignUp}>
                    <div className={styles.formStep}>
                        <label>{steps[step].label}</label>
                        {steps[step].type === 'selection' ? (
                            <div className={styles.buttonGroup} style={{ marginTop: '1rem' }}>
                                <button type="button" onClick={() => handleRoleSelect('user')}>User</button>
                                <button type="button" onClick={() => handleRoleSelect('agent')}>Delivery Agent</button>
                            </div>
                        ) : (
                            renderInput()
                        )}
                        {/* --- UI Feedback for Simplified Email Validation --- */}
                        {step === 2 && emailError && (
                            <p className={`${styles.feedbackMessage} ${styles.error}`}>{emailError}</p>
                        )}
                    </div>
                    <div className={styles.buttonGroup}>
                        {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
                        {step > 0 && step < steps.length - 1 && (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!form[steps[step].name] || (step === 2 && !!emailError)}
                            >
                                Next
                            </button>
                        )}
                        {step === steps.length - 1 && (
                            <button type="submit" disabled={!form.password || !form.confirmPassword}>Finish</button>
                        )}
                    </div>
                </form>
                {error && <p className={styles.errorMessage} style={{textAlign: 'center'}}>{error}</p>}
                <p className={styles.switchFormLink}>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;