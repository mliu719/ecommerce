import Orders from "./Orders";
import ProductList from "./ProductList";

function CustomerView({ products, onAdd, orders }) {

    return (
        <div style={{ border: '1px solid #5257e5ff', padding: 12 }}>
            <h2 style={{ marginTop: 0 }}>Customer View</h2>
            <div style={{ marginTop: 12, padding: 12, border: '1px solid #a3a2f1ff' }}>
                <ProductList products={products} onAdd={onAdd} />
            </div>
            <Orders orders={orders} />
        </div>

    );
}

export default CustomerView;
