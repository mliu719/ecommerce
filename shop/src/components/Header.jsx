function Header({ role, setRole, searchInput, setSearchInput, onSearch, onClear }) {
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


            <span style={{ marginLeft: 8 }}>Role:</span>
            <button onClick={() => setRole('customer')} disabled={role === 'customer'}>Customer</button>
            <button onClick={() => setRole('owner')} disabled={role === 'owner'}>Owner</button>
        </div>
    );
}
export default Header;