import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 2;

function ProductList({ products, onAdd, canDelete, onDelete, onEdit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return (
        <div>
            {products.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No products available.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {visibleProducts.map(p => (
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

            {products.length > ITEMS_PER_PAGE && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            backgroundColor: currentPage === 1 ? '#f2f2f2' : 'white',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                backgroundColor: page === currentPage ? '#007bff' : 'white',
                                color: page === currentPage ? 'white' : '#333',
                                cursor: 'pointer'
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            backgroundColor: currentPage === totalPages ? '#f2f2f2' : 'white',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next
                    </button>
                    <span style={{ fontSize: '12px', color: '#666', padding: '0 4px' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}

export default ProductList;
