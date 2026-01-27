import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignInPage({ onSignIn }) {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const submit = (e) => {
        e.preventDefault();
        setErr("");
        try {
            onSignIn({ email: email.trim(), password });
            nav("/shop", { replace: true });
        } catch (ex) {
            setErr(ex.message || "Sign in failed.");
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
            <h2>Please Sign in First</h2>
            {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                <button type="submit">Sign in</button>
            </form>

            <div style={{ marginTop: 12 }}>
                No account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
}


export default SignInPage;