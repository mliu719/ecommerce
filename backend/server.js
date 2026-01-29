require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Cart = require("./models/Cart");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const seedProducts = [
    {
        name: "Apex Trail Runners",
        description: "Breathable mesh runners built for daily miles.",
        category: "Category1",
        price: 89,
        stock: 42,
        imageUrl: "https://picsum.photos/seed/apex-trail/600/400"
    },
    {
        name: "Harbor Linen Shirt",
        description: "Soft-washed linen with a relaxed summer drape.",
        category: "Category2",
        price: 54,
        stock: 60,
        imageUrl: "https://picsum.photos/seed/harbor-linen/600/400"
    },
    {
        name: "Summit Daypack",
        description: "20L pack with padded straps and quick-access pocket.",
        category: "Category3",
        price: 68,
        stock: 35,
        imageUrl: "https://picsum.photos/seed/summit-pack/600/400"
    },
    {
        name: "Aurora Desk Lamp",
        description: "Dimmable LED lamp with warm ambient glow.",
        category: "Category1",
        price: 39,
        stock: 80,
        imageUrl: "https://picsum.photos/seed/aurora-lamp/600/400"
    },
    {
        name: "Cedarwood Candle",
        description: "Soy candle with cedar, smoke, and amber notes.",
        category: "Category2",
        price: 22,
        stock: 120,
        imageUrl: "https://picsum.photos/seed/cedar-candle/600/400"
    },
    {
        name: "Pulse Smart Bottle",
        description: "Insulated bottle with hydration reminders.",
        category: "Category3",
        price: 32,
        stock: 55,
        imageUrl: "https://picsum.photos/seed/pulse-bottle/600/400"
    },
    {
        name: "Nimbus Hoodie",
        description: "Cloud-soft fleece with a clean, modern fit.",
        category: "Category1",
        price: 64,
        stock: 47,
        imageUrl: "https://picsum.photos/seed/nimbus-hoodie/600/400"
    },
    {
        name: "Arc Ceramic Mug Set",
        description: "Set of four stackable stoneware mugs.",
        category: "Category2",
        price: 28,
        stock: 75,
        imageUrl: "https://picsum.photos/seed/arc-mugs/600/400"
    },
    {
        name: "Glide Yoga Mat",
        description: "Non-slip mat with extra cushioning.",
        category: "Category3",
        price: 36,
        stock: 90,
        imageUrl: "https://picsum.photos/seed/glide-mat/600/400"
    },
    {
        name: "Northwind Parka",
        description: "Water-resistant shell with insulated lining.",
        category: "Category1",
        price: 129,
        stock: 22,
        imageUrl: "https://picsum.photos/seed/northwind-parka/600/400"
    },
    {
        name: "Quartz Wall Clock",
        description: "Minimalist clock with silent sweep movement.",
        category: "Category2",
        price: 31,
        stock: 65,
        imageUrl: "https://picsum.photos/seed/quartz-clock/600/400"
    },
    {
        name: "Drift Wireless Speaker",
        description: "Portable speaker with 12-hour battery life.",
        category: "Category3",
        price: 58,
        stock: 50,
        imageUrl: "https://picsum.photos/seed/drift-speaker/600/400"
    },
    {
        name: "Studio Notebook",
        description: "Dotted journal with lay-flat binding.",
        category: "Category1",
        price: 14,
        stock: 140,
        imageUrl: "https://picsum.photos/seed/studio-notebook/600/400"
    },
    {
        name: "Seabreeze Throw",
        description: "Lightweight woven throw for couches or beds.",
        category: "Category2",
        price: 48,
        stock: 40,
        imageUrl: "https://picsum.photos/seed/seabreeze-throw/600/400"
    },
    {
        name: "Vantage Sunglasses",
        description: "Polarized lenses with matte acetate frame.",
        category: "Category3",
        price: 52,
        stock: 70,
        imageUrl: "https://picsum.photos/seed/vantage-sunglasses/600/400"
    },
    {
        name: "Slate Cutting Board",
        description: "Food-safe board with non-slip feet.",
        category: "Category1",
        price: 26,
        stock: 85,
        imageUrl: "https://picsum.photos/seed/slate-board/600/400"
    },
    {
        name: "Bloom Planter Set",
        description: "Set of two ceramic planters with trays.",
        category: "Category2",
        price: 34,
        stock: 45,
        imageUrl: "https://picsum.photos/seed/bloom-planters/600/400"
    },
    {
        name: "Metro Travel Pouch",
        description: "Compact organizer for cables and accessories.",
        category: "Category3",
        price: 19,
        stock: 110,
        imageUrl: "https://picsum.photos/seed/metro-pouch/600/400"
    }
];

function toProductResponse(product) {
    return {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
    };
}

async function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    req.user = user;
    return next();
}

async function requireOwner(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    if (user.role !== "owner") {
        return res.status(403).json({ error: "Owner access required" });
    }
    req.user = user;
    return next();
}

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    })
);

app.use(
    session({
        name: "sid",
        secret: "dev-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        },
    })
);

app.use(express.json());

app.post("/api/signup", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password too short" });
    }

    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
        return res.status(409).json({ error: "Email exists" });
    }

    const passwordHash = await require("bcrypt").hash(password, 10);
    const user = await User.create({
        email: email.trim(),
        passwordHash,
        role: role === "owner" ? "owner" : "customer",
    });

    req.session.userId = user._id.toString();
    res.status(201).json({ ok: true });
});

app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await require("bcrypt").compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    res.json({ ok: true });
});

app.get("/api/me", async (req, res) => {
    const id = req.session.userId;
    if (!id) return res.json({ user: null });

    const user = await User.findById(id);
    if (!user) return res.json({ user: null });

    res.json({
        user: { email: user.email, role: user.role }
    });
});

app.post("/api/signout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
    });
});

app.post("/api/password", requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing fields" });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password too short" });
    }

    const ok = await require("bcrypt").compare(currentPassword, req.user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: "Invalid current password" });
    }

    req.user.passwordHash = await require("bcrypt").hash(newPassword, 10);
    await req.user.save();
    res.json({ ok: true });
});

app.get("/api/products", async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limitRaw = parseInt(req.query.limit, 10);

    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, limitRaw)) : 20//default 20
    const total = await Product.countDocuments();
    const effectiveLimit = limit || total || 1;
    const totalPages = Math.max(1, Math.ceil(total / effectiveLimit));

    const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * effectiveLimit)
        .limit(effectiveLimit)
        .lean();

    res.json({
        products: products.map(toProductResponse),
        page,
        limit: effectiveLimit,
        total,
        totalPages,
    });
});

app.get("/api/products/:id", async (req, res) => {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: toProductResponse(product) });
});

app.post("/api/orders", requireAuth, async (req, res) => {
    const { items, total, promo } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items required" });
    }
    if (typeof total !== "number") {
        return res.status(400).json({ error: "Invalid total" });
    }

    const orderItems = [];
    for (const item of items) {
        const productId = item.productId;
        const quantity = parseInt(item.quantity, 10);
        if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid order items" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ error: "Unknown product in order" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        orderItems.push({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
        });
    }

    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
        userId: req.user._id,
        items: orderItems,
        total,
        promo: promo || null,
    });

    res.status(201).json({ ok: true, order: { id: order._id.toString() } });
});

app.get("/api/orders", requireAuth, async (req, res) => {
    const orders = await Order.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .lean();
    const formatted = orders.map((order) => ({
        id: order._id.toString(),
        total: order.total,
        promo: order.promo,
        date: order.createdAt.toISOString(),
    }));
    res.json({ orders: formatted });
});

app.get("/api/cart", requireAuth, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    const items = (cart?.items || []).map((item) => {
        const product = item.productId;
        if (!product) return null;
        return {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            quantity: item.quantity,
        };
    }).filter(Boolean);
    res.json({ items });
});

app.put("/api/cart", requireAuth, async (req, res) => {
    const { items } = req.body || {};
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Items must be an array" });
    }

    const sanitized = [];
    for (const item of items) {
        const productId = item.productId;
        const quantity = parseInt(item.quantity, 10);
        if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) {
            return res.status(400).json({ error: "Invalid cart items" });
        }
        sanitized.push({ productId, quantity });
    }

    const ids = sanitized.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: ids } }).select("_id");
    if (products.length !== ids.length) {
        return res.status(400).json({ error: "Unknown product in cart" });
    }

    await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { items: sanitized },
        { upsert: true, new: true }
    );
    res.json({ ok: true });
});

app.delete("/api/cart", requireAuth, async (req, res) => {
    await Cart.deleteOne({ userId: req.user._id });
    res.json({ ok: true });
});

app.post("/api/products", requireOwner, async (req, res) => {
    const { name, description, category, price, stock, imageUrl } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Product name required" });
    }
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "Invalid price" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "Invalid stock" });
    }

    const product = await Product.create({
        name: name.trim(),
        description: description?.trim() || "",
        category: category?.trim() || "Uncategorized",
        price,
        stock,
        imageUrl: imageUrl?.trim() || "",
    });

    res.status(201).json({ ok: true, product: toProductResponse(product) });
});

app.delete("/api/products/:id", requireOwner, async (req, res) => {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json({ ok: true, product: toProductResponse(deleted) });
});

app.put("/api/products/:id", requireOwner, async (req, res) => {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    const { name, description, category, price, stock, imageUrl } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Product name required" });
    }
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "Invalid price" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "Invalid stock" });
    }

    const updated = await Product.findByIdAndUpdate(
        productId,
        {
            name: name.trim(),
            description: description?.trim() || "",
            category: category?.trim() || "Uncategorized",
            price,
            stock,
            imageUrl: imageUrl?.trim() || "",
        },
        { new: true }
    );

    if (!updated) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json({ ok: true, product: toProductResponse(updated) });
});

async function start() {
    if (!MONGO_URI) {
        throw new Error("MONGODB_URI is required");
    }
    await mongoose.connect(MONGO_URI);
    const count = await Product.countDocuments();
    if (count === 0) {
        await Product.insertMany(seedProducts);
    }
    app.listen(PORT, () => console.log(`Backend on ${PORT}`));
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
