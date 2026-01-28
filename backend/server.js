require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const users = []; //{id, email, pswhash, role}
const app = express();
const PORT = process.env.PORT || 4000;
app.listen(4000, () => console.log("Backend on 4000"));
const products = [
    { id: 1, name: 'Laptop', price: 999, stock: 5, description: 'Work machine', category: 'Electronics', imageUrl: '' },
    { id: 2, name: 'Phone', price: 699, stock: 10, description: 'Daily driver', category: 'Electronics', imageUrl: '' },
    { id: 3, name: 'Mouse', price: 29, stock: 20, description: 'Wireless', category: 'Accessories', imageUrl: '' },
    { id: 4, name: 'Keyboard', price: 89, stock: 15, description: 'Mechanical', category: 'Accessories', imageUrl: '' },
];
const orders = [];


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
app.post("/api/login", async (req, res) => {
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
app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ ok: true });
    })
})
app.get("/api/products", (req, res) => {
    res.json({ products });
});
app.get("/api/orders", requireAuth, (req, res) => {
    const mine = orders.filter(o => o.userId === req.session.userId);
    res.json({ orders: mine });
});