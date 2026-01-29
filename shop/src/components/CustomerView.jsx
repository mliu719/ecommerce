import "./CustomerView.css";
import ProductList from "./ProductList";

function CustomerView({ products, onAdd }) {

    return (
        <div className="customer-view">
            <h2 className="customer-view__title">Enjoy your shopping experience</h2>
            <div className="customer-view__panel">
                <ProductList products={products} onAdd={onAdd} />
            </div>
        </div>

    );
}

export default CustomerView;
