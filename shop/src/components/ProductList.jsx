import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ITEMS_PER_PAGE = 9;

function ProductList({ products, onAdd, canDelete, onDelete, onEdit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortRanking, setSortRanking] = useState("default");
    const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [products, sortRanking]);

    const sortedProducts = useMemo(() => {
        const list = [...products];
        if (sortRanking === "low") {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortRanking === "high") {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        }
        return list;
    }, [products, sortRanking]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="product-list">
            {products.length === 0 ? (
                <p className="product-list__empty">No products available.</p>
            ) : (
                <>
                    <div className="product-list__sort">
                        <label className="product-list__sort-label">
                            Sort by price:
                            <select
                                value={sortRanking}
                                onChange={(e) => setSortRanking(e.target.value)}
                                className="product-list__sort-select"
                            >
                                <option value="default">Default</option>
                                <option value="low">Low to High</option>
                                <option value="high">High to Low</option>
                            </select>
                        </label>
                    </div>
                    <div className="product-list__grid">
                        {visibleProducts.map((p) => {
                            const productId = p.id ?? p._id;
                            return (
                            <div key={productId || p.name} className="product-list__card">
                                <h4 className="product-list__name">{p.name}</h4>
                                <p className="product-list__desc">
                                    {p.description || "No description"}
                                </p>
                                <div className="product-list__meta">
                                    <span className="product-list__price">${p.price}</span>
                                    <span className="product-list__stock">Stock: {p.stock}</span>
                                </div>
                                <div className="product-list__category">
                                    Category: {p.category}
                                </div>

                                {p.imageUrl && (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="product-list__image"
                                    />
                                )}

                                <div className="product-list__actions">
                                    {productId ? (
                                        <Link
                                            to={`/product/${productId}`}
                                            className="product-list__btn product-list__btn--view"
                                        >
                                            View
                                        </Link>
                                    ) : null}
                                    {canDelete && (
                                        <>
                                            <button
                                                onClick={() => onEdit && onEdit(p)}
                                                className="product-list__btn product-list__btn--edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(p.id)}
                                                className="product-list__btn product-list__btn--delete"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    {onAdd && (
                                        <button
                                            onClick={() => onAdd(p)}
                                            className="product-list__btn product-list__btn--add"
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        )})}
                    </div>
                </>
            )}

            {products.length > ITEMS_PER_PAGE && (
                <div className="product-list__pagination">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="product-list__page-btn"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`product-list__page-btn${page === currentPage ? " product-list__page-btn--active" : ""}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="product-list__page-btn"
                    >
                        Next
                    </button>
                    <span className="product-list__page-label">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}

export default ProductList;
