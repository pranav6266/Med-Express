// src/pages/Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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

            // --- Role-Based Redirection ---
            switch (data.role) {
                case 'user':
                    navigate('/dashboard');
                    break;
                case 'agent':
                    navigate('/agent/dashboard');
                    break;
                case 'admin':
                    navigate('/admin/dashboard'); // Navigate admin to their dashboard
                    break;
                default:
                    navigate('/login');
            }

        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (email) {
                nextStep();
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-content">
                        {step === 0 && (
                            <div className="form-step">
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
                            <div className="form-step">
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
                    </div>

                    <div className="button-group">
                        {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
                        {step < 1 ? (
                            <button type="button" onClick={nextStep} disabled={!email}>Next</button>
                        ) : (
                            <button type="submit" disabled={!password}>Finish</button>
                        )}
                    </div>
                </form>

                {error && <p className="error-message">{error}</p>}

                <p className="switch-form-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
