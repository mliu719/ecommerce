import "./CustomerView.css";
import Orders from "./Orders";
import ProductList from "./ProductList";

function CustomerView({ products, onAdd, orders }) {

    return (
        <div className="customer-view">
            <h2 className="customer-view__title">Enjoy your shopping experience</h2>
            <div className="customer-view__panel">
                <ProductList products={products} onAdd={onAdd} />
            </div>
            <Orders orders={orders} />
        </div>

    );
}

export default CustomerView;
