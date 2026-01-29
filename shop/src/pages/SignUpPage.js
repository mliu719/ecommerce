import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage({ onSignUp }) {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");

        const cleanEmail = email.trim();

        if (!cleanEmail) {
            setErr("Email is required");
            return;
        }

        if (!cleanEmail.includes("@")) {
            setErr("Please enter a valid email");
            return;
        }

        if (!password || password.length < 6) {
            setErr("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await onSignUp({ email: cleanEmail, password, role });
            nav("/shop", { replace: true });
        } catch (ex) {
            setErr(ex.message || "Sign up failed.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
            <h2>Sign up</h2>
            {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%" }} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%" }} />
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%" }}>
                    <option value="customer">customer</option>
                    <option value="owner">owner</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>

            <div style={{ marginTop: 12 }}>
                Have an account? <Link to="/signin">Sign in</Link>
            </div>
        </div>
    );
}
