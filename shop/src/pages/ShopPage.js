
import { useEffect, useMemo, useState } from 'react';
import CustomerView from '../components/CustomerView';
import Header from '../components/Header';
import OwnerView from '../components/OwnerView';
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
// const API = "http://localhost:4000"
export default function ShopPage({ user, onSignOut }) {

    const [products, setProducts] = useState([
    ]);

    const [role, setRole] = useState('customer'); // 'owner' | 'customer'

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

    useEffect(() => {
        fetch(`${API}/api/products`, {
            credentials: "include", //carry cookies
        })
            .then(r => r.json())
            .then(d => setProducts(d.products || []));
    }, []);

    useEffect(() => {
        fetch(`${API}/api/orders`, {
            credentials: "include",
        })
            .then(r => r.json())
            .then(d => setOrders(d.orders || []));
    }, []);

    const filteredProducts = useMemo(() => {
        const q = appliedSearch.trim().toLowerCase();
        if (!q) return products;
        return products.filter((p) => p.name.toLowerCase().includes(q));
    }, [products, appliedSearch]);

    const handleSearchClick = () => {
        setAppliedSearch(searchInput);
    }
    const handleClearSearch = () => {
        setSearchInput('');
        setAppliedSearch('');

    }

    const addToCart = (product) => {
        const existInCart = cart.find(i => i.id === product.id)
        if (existInCart) {
            setCart(cart.map(
                i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }

    }
    const removeFromCart = (productId) => {
        setCart(cart.filter(i => i.id !== productId))
    }


    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId)
        } else {
            setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i))
        }
    }


    function applyPromo() {
        const code = promoInput.trim().toUpperCase();
        if (code === "SAVE10") setPromo({ code, percent: 10 });
        else if (code === "SAVE20") setPromo({ code, percent: 20 });
        else setPromo(null);
    }
    function createProduct(payload) {
        const newProduct = { id: Date.now(), ...payload };
        setProducts(prev => [newProduct, ...prev]);
    }
    function deleteProduct(id) {
        setProducts(prev => prev.filter(p => p.id !== id));
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
        <div style={{ padding: 20 }}>
            <Header role={role} setRole={setRole}
                user={user}
                onSignOut={onSignOut}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearchClick}
                onClear={handleClearSearch}
            />

            {role === 'customer' ? (
                <CustomerView
                    products={filteredProducts}
                    cart={cart}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    orders={orders}
                    onCheckout={checkout}
                    promoInput={promoInput}
                    onPromoInputChange={setPromoInput}
                    promo={promo}
                    onApplyPromo={applyPromo}
                    total={total}
                    subtotal={subtotal}
                />

            ) : (
                <OwnerView products={products} categories={categories}
                    onCreateProduct={createProduct}
                    onDeleteProduct={deleteProduct} />
            )}


        </div>

    );
}
