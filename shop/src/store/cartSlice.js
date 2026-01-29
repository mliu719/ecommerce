import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
    try {
        const r = await fetch(`${API}/api/cart`, { credentials: "include" });
        const d = await r.json();
        if (!r.ok) return rejectWithValue(d.error || "Failed to load cart");
        return d.items || [];
    } catch (err) {
        return rejectWithValue("Failed to load cart");
    }
});

export const saveCart = createAsyncThunk("cart/save", async (items, { rejectWithValue }) => {
    try {
        const payload = items.map((i) => ({ productId: i.id, quantity: i.quantity }));
        const r = await fetch(`${API}/api/cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ items: payload }),
        });
        const d = await r.json();
        if (!r.ok) return rejectWithValue(d.error || "Failed to save cart");
        return true;
    } catch (err) {
        return rejectWithValue("Failed to save cart");
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setCart(state, action) {
            state.items = action.payload || [];
        },
        addItem(state, action) {
            const product = action.payload;
            const productId = product.id ?? product._id;
            if (!productId) return;
            const existing = state.items.find((i) => i.id === productId);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...product, id: productId, quantity: 1 });
            }
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find((i) => i.id === id);
            if (!item) return;
            if (quantity <= 0) {
                state.items = state.items.filter((i) => i.id !== id);
            } else {
                item.quantity = quantity;
            }
        },
        removeItem(state, action) {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        clearCart(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    },
});

export const { setCart, addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
