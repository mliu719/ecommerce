import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetailPage.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

function ProductDetailPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        fetch(`${API}/api/products/${id}`, { credentials: "include" })
            .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
            .then(({ ok, data }) => {
                if (!active) return;
                if (!ok) {
                    setError(data.error || "Failed to load product.");
                    setProduct(null);
                } else {
                    setProduct(data.product);
                }
            })
            .catch(() => {
                if (!active) return;
                setError("Failed to load product.");
                setProduct(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    return (
        <div className="product-detail">
            <div className="product-detail__header">
                <Link to="/shop" className="product-detail__back">← Back to Shop</Link>
            </div>

            {loading && <p className="product-detail__status">Loading...</p>}
            {error && <p className="product-detail__status product-detail__status--error">{error}</p>}

            {product && (
                <div className="product-detail__card">
                    <div className="product-detail__media">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-detail__image"
                            />
                        ) : (
                            <div className="product-detail__placeholder">No image available</div>
                        )}
                    </div>
                    <div className="product-detail__info">
                        <div className="product-detail__top">
                            <h2 className="product-detail__name">{product.name}</h2>
                            <div className="product-detail__price">${product.price}</div>
                        </div>
                        <div className="product-detail__tags">
                            <span className="product-detail__tag">Category: {product.category}</span>
                            <span className="product-detail__tag">Stock: {product.stock}</span>
                        </div>
                        <div className="product-detail__divider" />
                        <p className="product-detail__desc">
                            {product.description || "No description available."}
                        </p>
                        <button
                            className="product-detail__cta"
                            onClick={() => nav(`/shop?add=${product.id}`)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetailPage;
