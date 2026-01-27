
data:
Product: {id, name, price, stock}
CartItem: {cartId, ...product, quantity}
User: {id, email, password, role}
Order: {id, items[], total, date}
 