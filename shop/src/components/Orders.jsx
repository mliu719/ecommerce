
function Orders({ orders }) {
    return (
        <div style={{ border: '1px solid #eee', padding: 12, marginTop: 12 }}>
            <h3>Orders</h3>
            {orders.length === 0 ? <div>No orders yet</div> : null}
            {orders.map(o => (
                <div key={o.id} style={{ borderTop: '1px solid #f2f2f2', paddingTop: 8, marginTop: 8 }}>
                    <div>Order #{o.id}</div>
                    <div>Total: {o.total}</div>
                    <div>{o.date}</div>
                </div>
            ))}
        </div>
    );
}
export default Orders;