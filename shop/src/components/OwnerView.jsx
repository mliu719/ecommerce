import { useState } from 'react';
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductList from "./ProductList";
import "./OwnerView.css";

function OwnerView({ products, categories, onCreateProduct, onDeleteProduct, onUpdateProduct }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowAddForm(false);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    const handleUpdateProduct = (updatedProduct) => {
        onUpdateProduct(updatedProduct);
        setEditingProduct(null);
    };

    return (
        <div className="owner-view">
            <div className="owner-view__header">
                <h2 className="owner-view__title">Product Management</h2>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingProduct(null);
                    }}
                    className="owner-view__toggle"
                >
                    {showAddForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showAddForm && (
                <div className="owner-view__panel">
                    <h3 className="owner-view__subtitle">Add New Product</h3>
                    <CreateProductForm
                        categories={categories}
                        onCreate={(payload) => {
                            onCreateProduct(payload);
                            setShowAddForm(false);
                        }}
                    />
                </div>
            )}

            {editingProduct && (
                <div className="owner-view__panel">
                    <EditProductForm
                        product={editingProduct}
                        categories={categories}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                    />
                </div>
            )}

            <div className="owner-view__panel">
                <h3 className="owner-view__subtitle">Current Products ({products.length})</h3>
                <ProductList
                    products={products}
                    canDelete
                    onDelete={onDeleteProduct}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    );
}

export default OwnerView;
