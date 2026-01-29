import ProductForm from "./ProductForm";

function CreateProductForm({ categories, onCreate }) {
    const initialValues = {
        name: "",
        description: "",
        category: categories[0] || "",
        price: "",
        stock: "",
        imageUrl: "",
    };

    return (
        <ProductForm
            title="Create Product"
            submitLabel="Add Product"
            categories={categories}
            initialValues={initialValues}
            onSubmit={onCreate}
            resetOnSubmit
        />
    );
}

export default CreateProductForm;
