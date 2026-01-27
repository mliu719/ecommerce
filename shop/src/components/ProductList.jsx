function ProductList({ products, onAdd }) {
    return (
        <>
            <div style={{ border: '5px solid #90e696ff', padding: 12 }}>

                <h2> Products</h2>
            </div>
            {products.map(p => (
                <div key={p.id}>
                    <h3>{p.name}</h3>
                    <p>{p.price}</p>
                    <p>{p.stock}</p>
                    <button onClick={() => onAdd(p)}> Add to cart</button>
                </div>
            ))
            }

        </>
    )
}
export default ProductList;