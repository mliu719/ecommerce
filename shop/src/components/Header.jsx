import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ user, role, searchInput, setSearchInput, onSearch, onClear, onSignOut, showCart, cartCount = 0, onCartClick = () => { }, onOrdersClick = () => { } }) {
    const nav = useNavigate();
    const showCartButton = showCart !== false;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    function handleSignOut() {
        onSignOut();
        nav("/signin", { replace: true }); // redirect
    }

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

        <div className="site-header">
            <div className="site-header__left">
                <h1 className="site-header__title">Shop</h1>
            </div>
            <form
                className="site-header__center"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
                }}
            >
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="site-header__search"
                />
                <button type="submit" className="site-header__btn site-header__btn--primary">Search</button>
                <button type="button" onClick={onClear} className="site-header__btn">Clear</button>
            </form>
            <div className="site-header__right">
                {showCartButton ? (
                    <button
                        onClick={onCartClick}
                        className="site-header__btn site-header__cart"
                        aria-label="Open cart"
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="site-header__badge">
                                {cartCount}
                            </span>
                        )}
                    </button>
                ) : null}
                {user ? (
                    <div className="site-header__menu" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((open) => !open)}
                            className="site-header__menu-btn"
                            aria-label="User menu"
                        >
                            {user.email}
                        </button>
                        <div
                            className={`site-header__menu-panel${menuOpen ? " site-header__menu-panel--open" : ""}`}
                        >
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onOrdersClick();
                                }}
                                className="site-header__menu-item"
                            >
                                Orders
                            </button>
                            <Link
                                to="/password"
                                onClick={() => setMenuOpen(false)}
                                className="site-header__menu-link"
                            >
                                Update Password
                            </Link>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleSignOut();
                                }}
                                className="site-header__menu-item"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link className="site-header__btn site-header__btn--primary" to="/signin">Sign In</Link>
                )}
                {user ? (
                    <span className="site-header__role">{role === 'owner' ? 'Admin' : 'Customer'}</span>
                ) : null}
            </div>
        </div>
    );
}
export default Header;
