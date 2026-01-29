import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ user, role, searchInput, setSearchInput, onSearch, onClear, onSignOut, showCart, cartCount = 0, onCartClick = () => { } }) {
    const nav = useNavigate();
    const showCartButton = showCart !== false;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    function handleSignOut() {
        onSignOut();
        nav("/signin", { replace: true }); // redirect
    }
    console.log("Header onSignOut:", onSignOut);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>Shop</h1>
            <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                style={{ flex: 1, minWidth: 220, maxWidth: 420 }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}

            />
            <button onClick={onSearch}>Search</button>
            <button onClick={onClear}>Clear</button>
            {showCartButton ? (
                <button
                    onClick={onCartClick}
                    style={{ position: 'relative' }}
                    aria-label="Open cart"
                >
                    🛒
                    {cartCount > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                background: '#dc3545',
                                color: 'white',
                                borderRadius: 999,
                                fontSize: 10,
                                padding: '2px 6px',
                                lineHeight: 1
                            }}
                        >
                            {cartCount}
                        </span>
                    )}
                </button>
            ) : null}
            {user ? (
                <div style={{ position: "relative" }} ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        style={{
                            padding: "6px 10px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            background: "white",
                            cursor: "pointer",
                            fontSize: 14
                        }}
                        aria-label="User menu"
                    >
                        {user.email}
                    </button>
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            marginTop: 6,
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                            minWidth: 190,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            padding: 6,
                            maxHeight: menuOpen ? 200 : 0,
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? "translateY(0)" : "translateY(-6px)",
                            transition: "max-height 180ms ease, opacity 180ms ease, transform 180ms ease",
                            overflow: "hidden",
                            pointerEvents: menuOpen ? "auto" : "none"
                        }}
                    >
                        <Link
                            to="/password"
                            onClick={() => setMenuOpen(false)}
                            style={{
                                padding: "8px 12px",
                                textDecoration: "none",
                                color: "#333",
                                fontSize: 14,
                                borderRadius: 6
                            }}
                        >
                            Update Password
                        </Link>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleSignOut();
                            }}
                            style={{
                                padding: "8px 12px",
                                textAlign: "left",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "#333",
                                fontSize: 14,
                                borderRadius: 6
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : null}
            {role ? <span>Role: {role === 'owner' ? 'admin' : role}</span> : null}
        </div>
    );
}
export default Header;
