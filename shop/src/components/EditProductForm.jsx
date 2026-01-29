import ProductForm from "./ProductForm";

export default function EditProductForm({ product, categories, onUpdate, onCancel }) {
    const initialValues = {
        name: product.name,
        description: product.description || "",
        category: product.category || categories[0],
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || "",
    };

    return (
        <ProductForm
            key={product.id}
            title="Edit Product"
            submitLabel="Update Product"
            categories={categories}
            initialValues={initialValues}
            onSubmit={(payload) => onUpdate({ id: product.id, ...payload })}
            onCancel={onCancel}
        />
    );
}
