// src/pages/Signup.jsx

import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Re-use the same CSS Module

function Signup() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // ... (handleSignUp, handleChange, handleRoleSelect, nextStep, prevStep logic remains the same)
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const { name, email, password, role } = form;
            await axios.post('/api/auth/register', { name, email, password, role });
            setSuccess(true);
        } catch (err) {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (selectedRole) => {
        setForm({ ...form, role: selectedRole });
        nextStep();
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { name: 'role', type: 'selection', label: 'I want to sign up as a...' },
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'confirmPassword', type: 'password', label: 'Confirm Password' },
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (form[steps[step].name]) {
                nextStep();
            }
        }
    };

    if (success) {
        return (
            <div className={styles.formContainer}>
                <div className={styles.formCard}>
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
                            <input
                                type={steps[step].type}
                                name={steps[step].name}
                                placeholder={`Enter your ${steps[step].name.replace('Password', ' password')}`}
                                value={form[steps[step].name]}
                                onChange={handleChange}
                                onKeyDown={step < steps.length - 1 ? handleKeyDown : undefined}
                                autoFocus
                            />
                        )}
                    </div>
                    <div className={styles.buttonGroup}>
                        {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
                        {step > 0 && step < steps.length - 1 && (
                            <button type="button" onClick={nextStep} disabled={!form[steps[step].name]}>Next</button>
                        )}
                        {step === steps.length - 1 && (
                            <button type="submit" disabled={!form.password || !form.confirmPassword}>Finish</button>
                        )}
                    </div>
                </form>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <p className={styles.switchFormLink}>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;