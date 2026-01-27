function SearchBar({ value, onChange, onSearch, onClear, onKeyDown, appliedQuery }) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search products..."
            />
            <button onClick={onSearch}>Search</button>
            <button onClick={onClear} disabled={!value && !appliedQuery}>Clear</button>
            <div style={{ marginLeft: 8, opacity: 0.7 }}>
                Applied: {appliedQuery ? `"${appliedQuery}"` : "(none)"}
            </div>
        </div>
    );
}

export default SearchBar;