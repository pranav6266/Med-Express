import { useState } from "react";
import { Stepper, Step } from "react-bits";
import { DarkVeil } from "react-bits";
import { SpotlightCard } from "react-bits";

function Signup() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user"
    });
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const steps = [
        {
            label: "Name",
            content: (
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />
            )
        },
        {
            label: "Email",
            content: (
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />
            )
        },
        {
            label: "Password",
            content: (
                <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />
            )
        },
        {
            label: "Confirm Password",
            content: (
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
            )
        },
        {
            label: "Role",
            content: (
                <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                </select>
            )
        }
    ];

    //--- API integration for sign up ---
    const handleSignUp = async () => {
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role
                })
            });
            if (res.ok) {
                setDone(true);
            } else {
                const data = await res.json();
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("Network or server error");
        }
    };

    return (
        <DarkVeil>
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <SpotlightCard>
                    <h2>Signup</h2>
                    {done ? (
                        <div>
                            <h4>Signup successful!</h4>
                            <pre style={{ textAlign: "left" }}>{JSON.stringify(form, null, 2)}</pre>
                            <button onClick={() => { setStep(0); setDone(false); setForm({ name: "", email: "", password: "", confirmPassword: "", role: "user" }); }}>Reset</button>
                        </div>
                    ) : (
                        <Stepper activeStep={step} steps={steps.map(s => ({ label: s.label }))}>
                            <Step>
                                <div style={{ marginBottom: 24 }}>{steps[step].content}</div>
                                <div>
                                    {step > 0 && (
                                        <button onClick={() => setStep(step - 1)}>Back</button>
                                    )}{" "}
                                    {step < steps.length - 1 ? (
                                        <button onClick={() => setStep(step + 1)}>Next</button>
                                    ) : (
                                        <button
                                            onClick={handleSignUp}
                                            disabled={
                                                !form.name ||
                                                !form.email ||
                                                !form.password ||
                                                !form.confirmPassword ||
                                                form.password !== form.confirmPassword
                                            }
                                        >
                                            Finish
                                        </button>
                                    )}
                                </div>
                                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                            </Step>
                        </Stepper>
                    )}
                </SpotlightCard>
            </div>
        </DarkVeil>
    );
}

export default Signup;
