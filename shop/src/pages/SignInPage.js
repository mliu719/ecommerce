import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignInPage({ onSignIn }) {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const cleanEmail = email.trim();
            if (!cleanEmail) {
                setErr("Email is required.");
                return;
            }
            if (!cleanEmail.includes("@")) {
                setErr("Please enter a valid email.");
                return;
            }
            if (!password) {
                setErr("Password is required.");
                return;
            }
            setLoading(true);
            await onSignIn({ email: cleanEmail, password });
            nav("/shop", { replace: true });
        } catch (ex) {
            setErr(ex.message || "Sign in failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
            <h2>Please Sign in First</h2>
            {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%" }} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%" }} />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div style={{ marginTop: 12 }}>
                No account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
}


export default SignInPage;
