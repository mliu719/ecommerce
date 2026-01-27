import { useNavigate } from "react-router-dom";

function Header({ user, role, setRole, searchInput, setSearchInput, onSearch, onClear, onSignOut }) {
    const nav = useNavigate();
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