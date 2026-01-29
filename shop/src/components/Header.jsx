import { useNavigate } from "react-router-dom";

function Header({ user, role, setRole, searchInput, setSearchInput, onSearch, onClear, onSignOut, showCart, cartCount = 0, onCartClick = () => { } }) {
    const nav = useNavigate();
    const showCartButton = showCart !== false;
    function handleSignOut() {
        onSignOut();
        nav("/signin", { replace: true }); // redirect
    }
    console.log("Header onSignOut:", onSignOut);

    return (

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <h1 style={{ margin: 0 }}>Shop</h1>
            <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                style={{ flex: 1, maxWidth: 420 }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}

            />
            <button onClick={onSearch}>Search</button>
            <button onClick={onClear}>Clear</button>
            {showCartButton ? (
                <button
                    onClick={onCartClick}
                    aria-label="Open cart"
                >
                    🛒 cart
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
                <>
                    <span>{user.email}</span>
                    <button onClick={handleSignOut}>Sign Out</button>
                </>
            ) : null}
            <span >Role:</span>
            <button onClick={() => setRole('customer')} disabled={role === 'customer'}>Customer</button>
            <button onClick={() => setRole('owner')} disabled={role === 'owner'}>Owner</button>
        </div>
    );
}
export default Header;
