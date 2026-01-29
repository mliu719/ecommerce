import { useDispatch, useSelector } from "react-redux";
import Cart from "../components/Cart";
import "./CartPage.css";
import { removeItem, updateQuantity, clearCart } from "../store/cartSlice";
import { checkoutOrder } from "../store/ordersSlice";
import { clearPromo, setPromo, setPromoInput } from "../store/uiSlice";

function CartPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const promoInput = useSelector((state) => state.ui.promoInput);
    const promo = useSelector((state) => state.ui.promo);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = promo ? Math.round(subtotal * promo.percent / 100) : 0;
    const total = subtotal - discount;

    const applyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (code === "SAVE10") dispatch(setPromo({ code, percent: 10 }));
        else if (code === "SAVE20") dispatch(setPromo({ code, percent: 20 }));
        else dispatch(setPromo(null));
    };

    const checkout = async () => {
        const items = cart.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
        }));
        await dispatch(checkoutOrder({ items, total, promo: promo?.code || null })).unwrap();
        dispatch(clearCart());
        dispatch(clearPromo());
    };

    return (
        <div className="cart-page">
            <h2 className="cart-page__title">Your Cart</h2>
            <div className="cart-page__panel">
                <Cart
                    items={cart}
                    onRemove={(id) => dispatch(removeItem(id))}
                    onUpdateQuantity={(id, qty) => dispatch(updateQuantity({ id, quantity: qty }))}
                    onCheckout={checkout}
                    promoInput={promoInput}
                    onPromoInputChange={(value) => dispatch(setPromoInput(value))}
                    promo={promo}
                    onApplyPromo={applyPromo}
                />
            </div>
        </div>
    );
}

export default CartPage;
