import { useState } from "react";
function CreateProductForm({ categories, onCreate }) {
    const [name, setName] = useState('Watch');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0] || 'Category1');
    const [price, setPrice] = useState('50');
    const [stock, setStock] = useState('100');
    const [imageLink, setImageLink] = useState('http://');
    const [imageUrl, setImageUrl] = useState('');

    function upload() {
        setImageUrl(imageLink.trim());
    }

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        onCreate({
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(price),
            stock: Number(stock),
            imageUrl: imageUrl.trim(),
        });

        setName('');
        setDescription('');
        setCategory(categories[0] || 'Category1');
        setPrice('');
        setStock('');
        setImageLink('http://');
        setImageUrl('');
    }

    return (
        <form onSubmit={submit} style={{ border: '1px solid #eee', padding: 12, marginBottom: 12 }}>
            <h3 style={{ marginTop: 0 }}>Create Product</h3>

            <div>
                <label>Product name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <label>Product Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div>
                <label>Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div>
                <label>In Stock Quantity</label>
                <input value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>

            <div>
                <label>Add Image Link</label>
                <input value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
                <button type="button" onClick={upload}>Upload</button>
            </div>

            <div style={{ border: '1px dashed #aaa', padding: 12, marginTop: 8 }}>
                {imageUrl ? <img src={imageUrl} alt="preview" style={{ maxWidth: 240 }} /> : <div>image preview!</div>}
            </div>

            <button type="submit">Add Product</button>
        </form>
    );
}


export default CreateProductForm;
