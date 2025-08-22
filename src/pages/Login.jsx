import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async (e) => {
        // Prevent default form submission which reloads the page
        e.preventDefault();

        setError('');
        if (!password) return; // Don't submit if password is empty
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            console.log('Login successful:', data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setSuccess(true);
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // New function to handle the 'Enter' key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stop the form from submitting prematurely
            if (email) { // Ensure the input has a value before proceeding
                nextStep();
            }
        }
    };

    if (success) {
        return (
            <div className="form-container">
                <div className="form-card">
                    <h2>Login Successful!</h2>
                    <p>Welcome back, {email}.</p>
                </div>
            </div>
        );
    }

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
                                    onKeyDown={handleKeyDown} // Add the event handler here
                                    autoFocus // Automatically focus this input
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