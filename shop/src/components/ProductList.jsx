function ProductList({ products, onAdd, canDelete, onDelete, onEdit }) {
    return (
        <div>
            {products.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No products available.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {products.map(p => (
                        <div key={p.id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: 'white'
                        }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{p.name}</h4>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                                {p.description || 'No description'}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                                <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '18px' }}>
                                    ${p.price}
                                </span>
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                    Stock: {p.stock}
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                                Category: {p.category}
                            </div>

                            {p.imageUrl && (
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginBottom: '12px'
                                    }}
                                />
                            )}

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {canDelete && (
                                    <>
                                        <button
                                            onClick={() => onEdit && onEdit(p)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(p.id)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                {onAdd && (
                                    <button
                                        onClick={() => onAdd(p)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;