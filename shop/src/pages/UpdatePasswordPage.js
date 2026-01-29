import { useState } from "react";

function UpdatePasswordPage({ onUpdatePassword }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setMsg("");

        if (!currentPassword) {
            setErr("Current password is required.");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setErr("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErr("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await onUpdatePassword({ currentPassword, newPassword });
            setMsg("Password updated.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (ex) {
            setErr(ex.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
            <h2>Update Password</h2>
            {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
            {msg ? <div style={{ color: "green" }}>{msg}</div> : null}

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    type="password"
                    style={{ width: "100%" }}
                />
                <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    type="password"
                    style={{ width: "100%" }}
                />
                <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    type="password"
                    style={{ width: "100%" }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update password"}
                </button>
            </form>
        </div>
    );
}

export default UpdatePasswordPage;
