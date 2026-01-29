require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const users = []; //{id, email, pswhash, role}
const app = express();
const PORT = process.env.PORT || 4000;
app.listen(4000, () => console.log("Backend on 4000"));

const products = [
    {
        id: 1,
        name: "Apex Trail Runners",
        description: "Breathable mesh runners built for daily miles.",
        category: "Category1",
        price: 89,
        stock: 42,
        imageUrl: "https://picsum.photos/seed/apex-trail/600/400"
    },
    {
        id: 2,
        name: "Harbor Linen Shirt",
        description: "Soft-washed linen with a relaxed summer drape.",
        category: "Category2",
        price: 54,
        stock: 60,
        imageUrl: "https://picsum.photos/seed/harbor-linen/600/400"
    },
    {
        id: 3,
        name: "Summit Daypack",
        description: "20L pack with padded straps and quick-access pocket.",
        category: "Category3",
        price: 68,
        stock: 35,
        imageUrl: "https://picsum.photos/seed/summit-pack/600/400"
    },
    {
        id: 4,
        name: "Aurora Desk Lamp",
        description: "Dimmable LED lamp with warm ambient glow.",
        category: "Category1",
        price: 39,
        stock: 80,
        imageUrl: "https://picsum.photos/seed/aurora-lamp/600/400"
    },
    {
        id: 5,
        name: "Cedarwood Candle",
        description: "Soy candle with cedar, smoke, and amber notes.",
        category: "Category2",
        price: 22,
        stock: 120,
        imageUrl: "https://picsum.photos/seed/cedar-candle/600/400"
    },
    {
        id: 6,
        name: "Pulse Smart Bottle",
        description: "Insulated bottle with hydration reminders.",
        category: "Category3",
        price: 32,
        stock: 55,
        imageUrl: "https://picsum.photos/seed/pulse-bottle/600/400"
    },
    {
        id: 7,
        name: "Nimbus Hoodie",
        description: "Cloud-soft fleece with a clean, modern fit.",
        category: "Category1",
        price: 64,
        stock: 47,
        imageUrl: "https://picsum.photos/seed/nimbus-hoodie/600/400"
    },
    {
        id: 8,
        name: "Arc Ceramic Mug Set",
        description: "Set of four stackable stoneware mugs.",
        category: "Category2",
        price: 28,
        stock: 75,
        imageUrl: "https://picsum.photos/seed/arc-mugs/600/400"
    },
    {
        id: 9,
        name: "Glide Yoga Mat",
        description: "Non-slip mat with extra cushioning.",
        category: "Category3",
        price: 36,
        stock: 90,
        imageUrl: "https://picsum.photos/seed/glide-mat/600/400"
    },
    {
        id: 10,
        name: "Northwind Parka",
        description: "Water-resistant shell with insulated lining.",
        category: "Category1",
        price: 129,
        stock: 22,
        imageUrl: "https://picsum.photos/seed/northwind-parka/600/400"
    },
    {
        id: 11,
        name: "Quartz Wall Clock",
        description: "Minimalist clock with silent sweep movement.",
        category: "Category2",
        price: 31,
        stock: 65,
        imageUrl: "https://picsum.photos/seed/quartz-clock/600/400"
    },
    {
        id: 12,
        name: "Drift Wireless Speaker",
        description: "Portable speaker with 12-hour battery life.",
        category: "Category3",
        price: 58,
        stock: 50,
        imageUrl: "https://picsum.photos/seed/drift-speaker/600/400"
    },
    {
        id: 13,
        name: "Studio Notebook",
        description: "Dotted journal with lay-flat binding.",
        category: "Category1",
        price: 14,
        stock: 140,
        imageUrl: "https://picsum.photos/seed/studio-notebook/600/400"
    },
    {
        id: 14,
        name: "Seabreeze Throw",
        description: "Lightweight woven throw for couches or beds.",
        category: "Category2",
        price: 48,
        stock: 40,
        imageUrl: "https://picsum.photos/seed/seabreeze-throw/600/400"
    },
    {
        id: 15,
        name: "Vantage Sunglasses",
        description: "Polarized lenses with matte acetate frame.",
        category: "Category3",
        price: 52,
        stock: 70,
        imageUrl: "https://picsum.photos/seed/vantage-sunglasses/600/400"
    },
    {
        id: 16,
        name: "Slate Cutting Board",
        description: "Food-safe board with non-slip feet.",
        category: "Category1",
        price: 26,
        stock: 85,
        imageUrl: "https://picsum.photos/seed/slate-board/600/400"
    },
    {
        id: 17,
        name: "Bloom Planter Set",
        description: "Set of two ceramic planters with trays.",
        category: "Category2",
        price: 34,
        stock: 45,
        imageUrl: "https://picsum.photos/seed/bloom-planters/600/400"
    },
    {
        id: 18,
        name: "Metro Travel Pouch",
        description: "Compact organizer for cables and accessories.",
        category: "Category3",
        price: 19,
        stock: 110,
        imageUrl: "https://picsum.photos/seed/metro-pouch/600/400"
    }
];
const orders = [];
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
}

function requireOwner(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user = users.find(u => u.id === req.session.userId);
    if (!user || user.role !== 'owner') {
        return res.status(403).json({ error: "Owner access required" });
    }
    next();
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

    const exists = users.some(u => u.email === email);
    if (exists) {
        return res.status(409).json({ error: "Email exists" });
    }

    const passwordHash = await require("bcrypt").hash(password, 10);

    const user = {
        id: Date.now(),
        email,
        passwordHash,
        role: role === "owner" ? "owner" : "customer",
    };

    users.push(user);
    res.status(201).json({ ok: true });
});
app.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await require("bcrypt").compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.json({ ok: true });
});

app.get("/set", (req, res) => {
    req.session.test = "hello";
    res.json({ set: true });
});

app.get("/get", (req, res) => {
    res.json({ value: req.session.test || null });
});
app.get("/api/me", (req, res) => {
    const id = req.session.userId;
    if (!id) return res.json({ user: null });

    const user = users.find(u => u.id === id);
    if (!user) return res.json({ user: null });

    res.json({
        user: { email: user.email, role: user.role }
    });
});
app.post("/api/signout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
    })
})
app.get("/api/products", (req, res) => {
    res.json({ products });
});
app.post("/api/orders", requireAuth, (req, res) => {
    const { items, total, promo } = req.body;

    // basic validation
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Items required" });
    }
    if (typeof total !== "number") {
        return res.status(400).json({ error: "Invalid total" });
    }

    // create order (backend owns id + date)
    const order = {
        id: Date.now(),
        userEmail: req.session.user.email,
        items,
        total,
        promo: promo || null,
        createdAt: new Date().toISOString(),
    };

    // add to existing order arr
    orders.unshift(order);

    // respond
    res.status(201).json({ ok: true, order });
});
//reload after checkout
app.get("/api/orders", requireAuth, (req, res) => {
    const mine = orders.filter(o => o.userEmail === req.session.user.email);
    res.json({ orders: mine });
});

// Owner product management endpoints
app.post("/api/products", requireOwner, (req, res) => {
    const { name, description, category, price, stock, imageUrl } = req.body;

    // basic validation
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Product name required" });
    }
    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "Invalid price" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "Invalid stock" });
    }

    const newProduct = {
        id: Date.now(),
        name: name.trim(),
        description: description?.trim() || '',
        category: category?.trim() || 'Uncategorized',
        price,
        stock,
        imageUrl: imageUrl?.trim() || '',
    };

    products.unshift(newProduct);
    res.status(201).json({ ok: true, product: newProduct });
});

app.delete("/api/products/:id", requireOwner, (req, res) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json({ ok: true, product: deletedProduct });
});

app.put("/api/products/:id", requireOwner, (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, description, category, price, stock, imageUrl } = req.body;

    if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    // basic validation
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Product name required" });
    }
    if (typeof price !== "number" || price <= 0) {
        return res.status(400).json({ error: "Invalid price" });
    }
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ error: "Invalid stock" });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = {
        id: productId,
        name: name.trim(),
        description: description?.trim() || '',
        category: category?.trim() || 'Uncategorized',
        price,
        stock,
        imageUrl: imageUrl?.trim() || '',
    };

    products[productIndex] = updatedProduct;
    res.json({ ok: true, product: updatedProduct });
});