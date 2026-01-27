import CreateProductForm from "./CreateProductForm";
import ProductList from "./ProductList";
function OwnerView({ products, categories, onCreateProduct, onDeleteProduct }) {
    return (
        <div style={{ border: '1px solid #f05858ff', padding: 12 }}>
            <h2 style={{ marginTop: 0 }}>Owner View</h2>
            <div style={{ marginTop: 12, padding: 12, border: '1px solid #dd7373ff' }}>
                <CreateProductForm categories={categories} onCreate={onCreateProduct} />
                <ProductList products={products} canDelete onDelete={onDeleteProduct} />      </div>
        </div>
    );
}
export default OwnerView;