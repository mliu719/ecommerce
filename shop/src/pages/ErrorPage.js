import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div style={{ maxWidth: 520, margin: "60px auto", padding: 16, textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <p style={{ color: "#666" }}>
                We could not find the page you were looking for, or an unexpected error occurred.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                <Link to="/shop">Go to Shop</Link>
                <Link to="/signin">Sign in</Link>
            </div>
        </div>
    );
}

export default ErrorPage;
