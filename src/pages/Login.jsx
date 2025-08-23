// src/pages/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Import the CSS Module

function Login() {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!password) return;
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));

            switch (data.role) {
                case 'user': navigate('/dashboard'); break;
                case 'agent': navigate('/agent/dashboard'); break;
                case 'admin': navigate('/admin/dashboard'); break;
                default: navigate('/login');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && email) {
            e.preventDefault();
            nextStep();
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formCard}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    {step === 0 && (
                        <div className={styles.formStep}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                    )}
                    {step === 1 && (
                        <div className={styles.formStep}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
                        {step < 1 ? (
                            <button type="button" onClick={nextStep} disabled={!email}>Next</button>
                        ) : (
                            <button type="submit" disabled={!password}>Finish</button>
                        )}
                    </div>
                </form>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <p className={styles.switchFormLink}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;