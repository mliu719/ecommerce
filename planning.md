
data:
Product: {id, name, price, stock}
CartItem: {cartId, ...product, quantity}
User: {id, email, role}
Order: {id, items[], total, date}
 