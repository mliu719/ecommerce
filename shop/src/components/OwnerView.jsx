import { useState } from 'react';
import CreateProductForm from "./CreateProductForm";
import EditProductForm from "./EditProductForm";
import ProductList from "./ProductList";

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
        <div style={{ border: '1px solid #f05858ff', padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Product Management</h2>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingProduct(null);
                    }}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {showAddForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showAddForm && (
                <div style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ marginTop: 0 }}>Add New Product</h3>
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
                <div style={{ marginBottom: 24 }}>
                    <EditProductForm
                        product={editingProduct}
                        categories={categories}
                        onUpdate={handleUpdateProduct}
                        onCancel={handleCancelEdit}
                    />
                </div>
            )}

            <div>
                <h3>Current Products ({products.length})</h3>
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