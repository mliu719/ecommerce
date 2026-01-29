import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchOrders = createAsyncThunk("orders/fetch", async (_, { rejectWithValue }) => {
    try {
        const r = await fetch(`${API}/api/orders`, { credentials: "include" });
        const d = await r.json();
        if (!r.ok) return rejectWithValue(d.error || "Failed to load orders");
        return d.orders || [];
    } catch (err) {
        return rejectWithValue("Failed to load orders");
    }
});

export const checkoutOrder = createAsyncThunk("orders/checkout", async ({ items, total, promo }, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items, total, promo }),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Checkout failed");

    const r2 = await fetch(`${API}/api/orders`, { credentials: "include" });
    const d2 = await r2.json();
    if (!r2.ok) return rejectWithValue(d2.error || "Failed to load orders");
    return d2.orders || [];
});

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        items: [],
    },
    reducers: {
        clearOrders(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(checkoutOrder.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
