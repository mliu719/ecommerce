
import { useEffect, useMemo, useRef, useState } from 'react';
import Cart from '../components/Cart';
import CustomerView from '../components/CustomerView';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OwnerView from '../components/OwnerView';
import "./ShopPage.css";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
// const API = "http://localhost:4000"

export default function ShopPage({ user, onSignOut }) {

    const [products, setProducts] = useState([]);

    const [role, setRole] = useState(user?.role || 'customer'); // 'owner' | 'customer'
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [cart, setCart] = useState([])// cart item: { id, name, price, quantity }
    const [promoInput, setPromoInput] = useState("");
    const [promo, setPromo] = useState(null);//validated promo
    // promo: { code, percent }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = promo ? Math.round(subtotal * promo.percent / 100) : 0;

    const total = subtotal - discount;
    const [orders, setOrders] = useState([]);
    const categories = ['Category1', 'Category2', 'Category3'];
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const cartInitialized = useRef(false);

    useEffect(() => {
        // Fetch user info to get role
        fetch(`${API}/api/me`, {
            credentials: "include",
        })
            .then(r => r.json())
            .then(d => {
                if (d.user) {
                    setRole(d.user.role);
                }
            });
    }, []);

    useEffect(() => {
        fetch(`${API}/api/products`, {
            credentials: "include", //carry cookies
        })
            .then(r => r.json())
            .then(d => {
                setProducts(d.products)

            })
    }, []);

    useEffect(() => {
        if (!user) return;
        fetch(`${API}/api/cart`, {
            credentials: "include",
        })
            .then(r => r.json())
            .then(d => {
                setCart(d.items || []);
                cartInitialized.current = true;
            })
            .catch(() => {
                cartInitialized.current = true;
            });
    }, [user]);

    useEffect(() => {
        if (!user || !cartInitialized.current) return;
        const items = cart.map(i => ({
            productId: i.id,
            quantity: i.quantity
        }));
        fetch(`${API}/api/cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ items })
        }).catch(() => { });
    }, [cart, user]);

    useEffect(() => {
        if (!user) {
            setOrders([]);
            return;
        }
        fetch(`${API}/api/orders`, {
            credentials: "include",
        })
            .then(r => r.json())
            .then(d => setOrders(d.orders || []));
    }, [user]);

    const filteredProducts = useMemo(() => {
        const q = appliedSearch.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => p.name.toLowerCase().includes(q));
    }, [products, appliedSearch]);

    const handleSearchClick = () => {
        setAppliedSearch(searchInput.trim());
    }
    const handleClearSearch = () => {
        setSearchInput('');
        setAppliedSearch('');

    }

    const addToCart = (product) => {
        const productId = product.id ?? product._id;
        setCart((prevCart) => {
            const existInCart = prevCart.find(i => i.id === productId);
            if (existInCart) {
                return prevCart.map(
                    i => i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...product, id: productId, quantity: 1 }];
        });
        setIsCartOpen(true);
    }
    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.id !== productId))
    }


    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId)
        } else {
            setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity: newQty } : i))
        }
    }


    function applyPromo() {
        const code = promoInput.trim().toUpperCase();
        if (code === "SAVE10") setPromo({ code, percent: 10 });
        else if (code === "SAVE20") setPromo({ code, percent: 20 });
        else setPromo(null);
    }

    async function createProduct(payload) {
        const r = await fetch(`${API}/api/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to create product");

        // Refresh products list
        const r2 = await fetch(`${API}/api/products`, { credentials: "include" });
        const d2 = await r2.json();
        setProducts(d2.products || []);
    }

    async function deleteProduct(id) {
        const r = await fetch(`${API}/api/products/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to delete product");

        // Refresh products list
        const r2 = await fetch(`${API}/api/products`, { credentials: "include" });
        const d2 = await r2.json();
        setProducts(d2.products || []);
    }

    async function updateProduct(updatedProduct) {
        const r = await fetch(`${API}/api/products/${updatedProduct.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedProduct),
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Failed to update product");

        // Refresh products list
        const r2 = await fetch(`${API}/api/products`, { credentials: "include" });
        const d2 = await r2.json();
        setProducts(d2.products || []);
    }

    async function checkout() {
        const items = cart.map(i => ({
            productId: i.id,
            quantity: i.quantity
        }))
        const r = await fetch(`${API}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                items,
                total,
                promo: promo?.code || null,
            }),
        });

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Checkout failed");

        setCart([]);
        setPromo(null);
        setPromoInput("");

        const r2 = await fetch(`${API}/api/orders`, { credentials: "include" });
        const d2 = await r2.json();
        setOrders(d2.orders || []);
    }

    return (
        <div className="shop-page">
            {/* Fixed Header */}
            <div className="shop-page__header">
                <Header role={role}
                    user={user}
                    onSignOut={onSignOut}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearchClick}
                    onClear={handleClearSearch}
                    showCart={role === 'customer'}
                    cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    onCartClick={() => setIsCartOpen(true)}
                />
            </div>

            {/* Main Content */}
            <main className="shop-page__main">
                {role === 'customer' ? (
                    <CustomerView
                        products={filteredProducts}
                        onAdd={addToCart}
                        orders={orders}
                    />

                ) : (
                    <OwnerView
                        products={filteredProducts}
                        categories={categories}
                        onCreateProduct={createProduct}
                        onDeleteProduct={deleteProduct}
                        onUpdateProduct={updateProduct}
                    />
                )}
            </main>

            {/* Fixed Footer */}
            <div className="shop-page__footer">
                <Footer />
            </div>
            {role === 'customer' && (
                <>
                    {isCartOpen && (
                        <div
                            onClick={() => setIsCartOpen(false)}
                            className="shop-page__overlay"
                        />
                    )}
                    <aside
                        className={`shop-page__drawer${isCartOpen ? " shop-page__drawer--open" : ""}`}
                    >
                        <div className="shop-page__drawer-header">
                            <strong>Your Cart</strong>
                            <button className="shop-page__drawer-close" onClick={() => setIsCartOpen(false)}>Close</button>
                        </div>
                        <div className="shop-page__drawer-body">
                            <Cart
                                items={cart}
                                onRemove={removeFromCart}
                                onUpdateQuantity={updateQuantity}
                                onCheckout={checkout}
                                promoInput={promoInput}
                                onPromoInputChange={setPromoInput}
                                promo={promo}
                                onApplyPromo={applyPromo}
                            />
                        </div>
                    </aside>
                </>
            )}
        </div>

    );
}
