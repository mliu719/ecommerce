# Quick Setup  
## Frontend

```
cd shop
npm install
npm start
```
## DB
## 1) Set env

Create `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/shop
CLIENT_ORIGIN=http://localhost:3000
PORT=4000
```

## 2) Start MongoDB (local)

Homebrew:
```
brew services start mongodb-community
```

Docker:
```
docker run -d --name mongo -p 27017:27017 mongo:7
```

## 3) Start backend

```
cd backend
npm install
npm start
```

On first start, products are auto-seeded if the collection is empty.

## 4) Quick DB check

```
mongosh --eval 'use shop; db.products.countDocuments()'
```

## API Summary  

Auth
- `POST /api/signup` (email, password, role)
- `POST /api/signin` (email, password)
- `GET /api/me`
- `POST /api/signout`
- `POST /api/password` (currentPassword, newPassword)

Products
- `GET /api/products` (query: `page`, `limit`)
- `GET /api/products/:id`
- `POST /api/products` (owner only)
- `PUT /api/products/:id` (owner only)
- `DELETE /api/products/:id` (owner only)

Cart (auth)
- `GET /api/cart`
- `PUT /api/cart` (items: [{ productId, quantity }])
- `DELETE /api/cart`

Orders (auth)
- `GET /api/orders`
- `POST /api/orders` (items, total, promo?)

## DB Design  
Collections
- `users`: email, passwordHash, role
- `products`: name, description, category, price, stock, imageUrl
- `carts`: userId, items[{ productId, quantity }]
- `orders`: userId, items[{ productId, quantity, priceAtPurchase }], total, promo

Notes
- MongoDB auto-creates DB/collections on first write.
- Product list is seeded on server start if empty.

## Redux  

Store slices
- `auth`: user + auth thunks (signup/signin/signout/me/password)
- `products`: product list + CRUD thunks
- `cart`: cart items + fetch/save
- `orders`: orders list + checkout
- `ui`: search + promo UI state
