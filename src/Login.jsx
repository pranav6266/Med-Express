import { useState } from "react";
import { Stepper, Step } from "react-bits";
import { DarkVeil } from "react-bits";
import { SpotlightCard } from "react-bits";

function Login() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const steps = [
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
        }
    ];

    //--- API integration for login ---
    const handleLogin = async () => {
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });
            if (res.ok) {
                const data = await res.json();
                // Save the JWT token if needed e.g., localStorage.setItem('token', data.token);
                setDone(true);
            } else {
                const data = await res.json();
                setError(data.message || "Login failed");
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
                    <h2>Login</h2>
                    {done ? (
                        <div>
                            <h4>Login successful!</h4>
                            <pre style={{ textAlign: "left" }}>{JSON.stringify(form, null, 2)}</pre>
                            <button onClick={() => { setStep(0); setDone(false); setForm({ email: "", password: "" }); }}>Reset</button>
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
                                            onClick={handleLogin}
                                            disabled={!form.email || !form.password}
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

export default Login;
