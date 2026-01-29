# DB Setup (MongoDB) — Short

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
