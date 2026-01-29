import "./Cart.css";

function Cart({ items, onUpdateQuantity, onRemove, onCheckout, promo, promoInput, onApplyPromo, onPromoInputChange }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = promo ? Math.round(subtotal * promo.percent / 100)
        : 0;
    const total = subtotal - discount
    return (
        <div className="cart">
            <h2 className="cart__title">Cart ({items.length})</h2>
            <h2 className="cart__total">Total: {total}</h2>

            {items.length === 0 ? (
                <h3 className="cart__empty">Empty Cart</h3>

            ) : (
                <>
                    {items.map(i => (
                        <div key={i.id} className="cart__item">
                            <div className="cart__item-row">
                                {i.imageUrl && (
                                    <img
                                        src={i.imageUrl}
                                        alt={i.name}
                                        className="cart__item-image"
                                    />
                                )}
                                <div className="cart__item-info">
                                    <div className="cart__item-name">{i.name}</div>
                                    <div className="cart__item-qty">Quantity: {i.quantity}</div>
                                </div>
                            </div>

                            <div className="cart__item-actions">
                                <button className="cart__btn" onClick={() => onUpdateQuantity(i.id, i.quantity + 1)}>+</button>
                                <button className="cart__btn" onClick={() => onUpdateQuantity(i.id, i.quantity - 1)}>-</button>
                                <button className="cart__btn cart__btn--remove" onClick={() => onRemove(i.id)}>Remove</button>
                            </div>

                        </div>
                    ))}
                    <div className="cart__promo">
                        <input
                            value={promoInput}
                            onChange={e => onPromoInputChange(e.target.value)}
                            placeholder="Promo code"
                            className="cart__input"
                        />
                        <button className="cart__btn" onClick={onApplyPromo}>Apply</button>
                    </div>
                    <p className="cart__promo-text">{promo && `${promo.code} applied`} </p>

                    {subtotal > 0 && (
                        <div className="cart__summary">
                            <div>Subtotal: ${subtotal}</div>
                            {promo && <div>Promo {promo.code}: -${discount}</div>}
                            <strong>Total: ${total}</strong>
                        </div>
                    )}
                </>
            )}
            <button className="cart__checkout" onClick={onCheckout} disabled={items.length === 0}>Checkout</button>
        </div>

    );
}
export default Cart;
