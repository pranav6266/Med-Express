import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Signup() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission
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

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'password', type: 'password', label: 'Password' },
        { name: 'confirmPassword', type: 'password', label: 'Confirm Password' },
    ];

    // New function to handle the 'Enter' key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Check if the current step's input is filled before going to the next
            if (form[steps[step].name]) {
                nextStep();
            }
        }
    };

    if (success) {
        return (
            <div className="form-container">
                <div className="form-card">
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
        <div className="form-container">
            <div className="form-card">
                <h2>Signup</h2>
                <form onSubmit={handleSignUp}>
                    <div className="form-content">
                        <div className="form-step">
                            <label>{steps[step].label}</label>
                            <input
                                type={steps[step].type}
                                name={steps[step].name}
                                placeholder={`Enter your ${steps[step].name.replace('Password', ' password')}`}
                                value={form[steps[step].name]}
                                onChange={handleChange}
                                // Add the handler only to steps that have a 'Next' button
                                onKeyDown={step < steps.length - 1 ? handleKeyDown : undefined}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="button-group">
                        {step > 0 && <button type="button" onClick={prevStep}>Back</button>}
                        {step < steps.length - 1 ? (
                            <button type="button" onClick={nextStep} disabled={!form[steps[step].name]}>Next</button>
                        ) : (
                            <button type="submit" disabled={!form.password || !form.confirmPassword}>Finish</button>
                        )}
                    </div>
                </form>
                {error && <p className="error-message">{error}</p>}

                <p className="switch-form-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;