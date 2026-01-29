import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Cart from '../components/Cart';
import CustomerView from '../components/CustomerView';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Orders from '../components/Orders';
import OwnerView from '../components/OwnerView';
import "./ShopPage.css";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../store/productsSlice";
import { fetchCart, saveCart, addItem, removeItem, updateQuantity, clearCart } from "../store/cartSlice";
import { fetchOrders, checkoutOrder, clearOrders } from "../store/ordersSlice";
import { setSearchInput, setAppliedSearch, setPromoInput, setPromo, clearPromo } from "../store/uiSlice";

export default function ShopPage({ user, onSignOut }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const cart = useSelector((state) => state.cart.items);
    const orders = useSelector((state) => state.orders.items);
    const searchInput = useSelector((state) => state.ui.searchInput);
    const appliedSearch = useSelector((state) => state.ui.appliedSearch);
    const promoInput = useSelector((state) => state.ui.promoInput);
    const promo = useSelector((state) => state.ui.promo);

    const role = user?.role || 'customer';
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const categories = ['Category1', 'Category2', 'Category3'];
    const cartInitialized = useRef(false);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = promo ? Math.round(subtotal * promo.percent / 100) : 0;
    const total = subtotal - discount;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            dispatch(clearOrders());
            return;
        }
        dispatch(fetchOrders());
    }, [user, dispatch]);

    useEffect(() => {
        if (!user) {
            dispatch(clearCart());
            cartInitialized.current = false;
            return;
        }
        cartInitialized.current = false;
        dispatch(fetchCart())
            .unwrap()
            .catch(() => { })
            .finally(() => {
                cartInitialized.current = true;
            });
    }, [user, dispatch]);

    useEffect(() => {
        if (!user || !cartInitialized.current) return;
        dispatch(saveCart(cart));
    }, [cart, user, dispatch]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const addId = params.get("add");
        if (!addId) return;
        if (products.length === 0) return;
        const product = products.find((p) => p.id === addId);
        if (product) {
            dispatch(addItem(product));
        }
        navigate("/shop", { replace: true });
    }, [location.search, products, dispatch, navigate]);

    const filteredProducts = useMemo(() => {
        const q = appliedSearch.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => {
            const name = (p.name || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            const category = (p.category || "").toLowerCase();
            return name.includes(q) || desc.includes(q) || category.includes(q);
        });
    }, [products, appliedSearch]);

    const handleSearchClick = () => {
        dispatch(setAppliedSearch(searchInput.trim()));
    };
    const handleClearSearch = () => {
        dispatch(setSearchInput(''));
        dispatch(setAppliedSearch(''));
    };

    const addToCart = (product) => {
        dispatch(addItem(product));
        setIsCartOpen(true);
    };
    const removeFromCart = (productId) => {
        dispatch(removeItem(productId));
    };
    const updateItemQuantity = (productId, newQty) => {
        dispatch(updateQuantity({ id: productId, quantity: newQty }));
    };

    function applyPromo() {
        const code = promoInput.trim().toUpperCase();
        if (code === "SAVE10") dispatch(setPromo({ code, percent: 10 }));
        else if (code === "SAVE20") dispatch(setPromo({ code, percent: 20 }));
        else dispatch(setPromo(null));
    }

    async function createProductHandler(payload) {
        await dispatch(createProduct(payload)).unwrap();
    }

    async function deleteProductHandler(id) {
        await dispatch(deleteProduct(id)).unwrap();
    }

    async function updateProductHandler(updatedProduct) {
        await dispatch(updateProduct(updatedProduct)).unwrap();
    }

    async function checkout() {
        const items = cart.map(i => ({
            productId: i.id,
            quantity: i.quantity
        }));
        await dispatch(checkoutOrder({
            items,
            total,
            promo: promo?.code || null,
        })).unwrap();
        dispatch(clearCart());
        dispatch(clearPromo());
    }

    return (
        <div className="shop-page">
            {/* Fixed Header */}
            <div className="shop-page__header">
                <Header role={role}
                    user={user}
                    onSignOut={onSignOut}
                    searchInput={searchInput}
                    setSearchInput={(value) => dispatch(setSearchInput(value))}
                    onSearch={handleSearchClick}
                    onClear={handleClearSearch}
                    showCart={role === 'customer'}
                    cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    onCartClick={() => {
                        setIsOrdersOpen(false);
                        setIsCartOpen(true);
                    }}
                    onOrdersClick={() => {
                        setIsCartOpen(false);
                        setIsOrdersOpen(true);
                    }}
                />
            </div>

            {/* Main Content */}
            <main className="shop-page__main">
                {role === 'customer' || !role ? (
                    <CustomerView
                        products={filteredProducts}
                        onAdd={addToCart}
                    />

                ) : (
                    <OwnerView
                        products={filteredProducts}
                        categories={categories}
                        onCreateProduct={createProductHandler}
                        onDeleteProduct={deleteProductHandler}
                        onUpdateProduct={updateProductHandler}
                    />
                )}
            </main>

            {/* Fixed Footer */}
            <div className="shop-page__footer">
                <Footer />
            </div>
            {(isCartOpen || isOrdersOpen) && (
                <div
                    onClick={() => {
                        setIsCartOpen(false);
                        setIsOrdersOpen(false);
                    }}
                    className="shop-page__overlay"
                />
            )}
            {role === 'customer' && (
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
                            onUpdateQuantity={updateItemQuantity}
                            onCheckout={checkout}
                            promoInput={promoInput}
                            onPromoInputChange={(value) => dispatch(setPromoInput(value))}
                            promo={promo}
                            onApplyPromo={applyPromo}
                        />
                    </div>
                </aside>
            )}
            {user && (
                <aside
                    className={`shop-page__drawer${isOrdersOpen ? " shop-page__drawer--open" : ""}`}
                >
                    <div className="shop-page__drawer-header">
                        <strong>Your Orders</strong>
                        <button className="shop-page__drawer-close" onClick={() => setIsOrdersOpen(false)}>Close</button>
                    </div>
                    <div className="shop-page__drawer-body">
                        <Orders orders={orders} />
                    </div>
                </aside>
            )}
        </div>

    );
}
