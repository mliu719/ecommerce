import { useEffect, useState } from "react";
import "./ProductForm.css";

function ProductForm({
    title,
    submitLabel,
    categories,
    initialValues,
    onSubmit,
    onCancel,
    resetOnSubmit = false,
}) {
    const [name, setName] = useState(initialValues.name || "");
    const [description, setDescription] = useState(initialValues.description || "");
    const [category, setCategory] = useState(initialValues.category || categories[0] || "Category1");
    const [price, setPrice] = useState((initialValues.price ?? "").toString());
    const [stock, setStock] = useState((initialValues.stock ?? "").toString());
    const [imageLink, setImageLink] = useState(initialValues.imageUrl || "");
    const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");

    useEffect(() => {
        setImageUrl(imageLink.trim());
    }, [imageLink]);

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        const finalImageUrl = imageLink.trim();
        onSubmit({
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(price),
            stock: Number(stock),
            imageUrl: finalImageUrl,
        });

        if (resetOnSubmit) {
            setName("");
            setDescription("");
            setCategory(categories[0] || "Category1");
            setPrice("");
            setStock("");
            setImageLink("");
            setImageUrl("");
        }
    }

    return (
        <div className="product-form">
            <h3 className="product-form__title">{title}</h3>
            <form onSubmit={submit} className="product-form__grid">
                <div className="product-form__field">
                    <label className="product-form__label">Product name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="product-form__input"
                    />
                </div>

                <div className="product-form__field">
                    <label className="product-form__label">Product Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="product-form__textarea"
                    />
                </div>

                <div className="product-form__field">
                    <label className="product-form__label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="product-form__select"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="product-form__row">
                    <div className="product-form__field">
                        <label className="product-form__label">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="product-form__input"
                        />
                    </div>
                    <div className="product-form__field">
                        <label className="product-form__label">In Stock Quantity</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="product-form__input"
                        />
                    </div>
                </div>

                <div className="product-form__field">
                    <label className="product-form__label">Image Link</label>
                    <div className="product-form__image-row">
                        <input
                            value={imageLink}
                            onChange={(e) => setImageLink(e.target.value)}
                            className="product-form__input"
                        />
                    </div>
                </div>

                <div className="product-form__preview">
                    {imageUrl ? (
                        <img src={imageUrl} alt="preview" />
                    ) : (
                        <div>image preview!</div>
                    )}
                </div>

                <div className="product-form__actions">
                    <button type="submit" className="product-form__btn product-form__btn--primary">
                        {submitLabel}
                    </button>
                    {onCancel ? (
                        <button type="button" onClick={onCancel} className="product-form__btn product-form__btn--secondary">
                            Cancel
                        </button>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

export default ProductForm;
