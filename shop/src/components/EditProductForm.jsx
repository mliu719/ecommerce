import { useState, useEffect } from "react";

export default function EditProductForm({ product, categories, onUpdate, onCancel }) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description || '');
    const [category, setCategory] = useState(product.category || categories[0]);
    const [price, setPrice] = useState(product.price.toString());
    const [stock, setStock] = useState(product.stock.toString());
    const [imageLink, setImageLink] = useState(product.imageUrl || '');
    const [imageUrl, setImageUrl] = useState(product.imageUrl || '');

    function upload() {
        setImageUrl(imageLink.trim());
    }

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        onUpdate({
            id: product.id,
            name: name.trim(),
            description: description.trim(),
            category,
            price: Number(price),
            stock: Number(stock),
            imageUrl: imageUrl.trim(),
        });
    }

    return (
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ marginTop: 0 }}>Edit Product</h3>
            <form onSubmit={submit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Product name</label>
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        style={{ width: '100%', padding: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Product Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        style={{ width: '100%', padding: '4px', minHeight: '60px' }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Category</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '4px' }}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Price</label>
                    <input 
                        type="number"
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        style={{ width: '100%', padding: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>In Stock Quantity</label>
                    <input 
                        type="number"
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        style={{ width: '100%', padding: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Image Link</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                            value={imageLink} 
                            onChange={(e) => setImageLink(e.target.value)} 
                            style={{ flex: 1, padding: '4px' }}
                        />
                        <button type="button" onClick={upload}>Upload</button>
                    </div>
                </div>

                {imageUrl && (
                    <div style={{ marginBottom: 12 }}>
                        <img 
                            src={imageUrl} 
                            alt="preview" 
                            style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} 
                        />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Update Product
                    </button>
                    <button 
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
