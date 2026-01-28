function Cart({ items, onUpdateQuantity, onRemove, onCheckout, promo, promoInput, onApplyPromo, onPromoInputChange }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = promo ? Math.round(subtotal * promo.percent / 100)
        : 0;
    const total = subtotal - discount
    console.log("promoInput:", promoInput, "promo:", promo, "onApplyPromo type:", typeof onApplyPromo);
    return (
        <div>
            <h2>Cart ({items.length})</h2>
            <h2> total: {total}</h2>

            {items.length === 0 ? (
                <h3>Empty Cart</h3>

            ) : (
                <>
                    {items.map(i => (
                        <div>
                            <div key={i.id} style={{ borderTop: '1px solid #f2f2f2', paddingTop: 8, marginTop: 8 }}>
                                {i.name}
                            </div>
                            <div>Quantity: {i.quantity}</div>

                            <button onClick={() => onUpdateQuantity(i.id, i.quantity + 1)}> + </button>
                            <button onClick={() => onUpdateQuantity(i.id, i.quantity - 1)}> - </button>
                            <button onClick={() => onRemove(i.id)}>remove</button>

                        </div>
                    ))}
                    <div>
                        <input
                            value={promoInput}
                            onChange={e => onPromoInputChange(e.target.value)}
                            placeholder="Promo code"
                        />
                        <button onClick={onApplyPromo}>Apply</button>
                    </div>
                    <p>{promo && `${promo.code} applied`} </p>

                    {subtotal > 0 && (
                        <div>
                            <div>Subtotal: ${subtotal}</div>
                            {promo && <div>Promo {promo.code}: -${discount}</div>}
                            <strong>Total: ${total}</strong>
                        </div>
                    )}
                </>
            )}
            <button onClick={onCheckout} disabled={items.length === 0}>Checkout</button>
        </div>

    );
}
export default Cart;