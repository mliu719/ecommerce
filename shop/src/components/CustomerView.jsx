import Cart from "./Cart";
import Orders from "./Orders";
import ProductList from "./ProductList";

function CustomerView({ products, cart, onAdd, onRemove, onUpdateQuantity, orders, onCheckout, promo, promoInput, onApplyPromo, onPromoInputChange }) {

    return (
        <div style={{ border: '1px solid #5257e5ff', padding: 12 }}>
            <h2 style={{ marginTop: 0 }}>Customer View</h2>
            <div style={{ marginTop: 12, padding: 12, border: '1px solid #a3a2f1ff' }}>
                <ProductList products={products} onAdd={onAdd} />
            </div>
            <Cart
                items={cart}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
                promoInput={promoInput}
                onPromoInputChange={onPromoInputChange}
                promo={promo}
                onApplyPromo={onApplyPromo}


            />
            <Orders orders={orders} />
        </div>

    );
}

export default CustomerView;