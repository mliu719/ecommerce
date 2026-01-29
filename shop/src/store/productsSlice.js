import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchProducts = createAsyncThunk("products/fetch", async (_, { rejectWithValue }) => {
    try {
        const r = await fetch(`${API}/api/products`, { credentials: "include" });
        const d = await r.json();
        if (!r.ok) return rejectWithValue(d.error || "Failed to load products");
        return d.products || [];
    } catch (err) {
        return rejectWithValue("Failed to load products");
    }
});

export const createProduct = createAsyncThunk("products/create", async (payload, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Failed to create product");
    return d.product;
});

export const updateProduct = createAsyncThunk("products/update", async (payload, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/products/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Failed to update product");
    return d.product;
});

export const deleteProduct = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Failed to delete product");
    return d.product;
});

const productsSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                if (action.payload) state.items.unshift(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated) return;
                const index = state.items.findIndex((p) => p.id === updated.id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                const deleted = action.payload;
                if (!deleted) return;
                state.items = state.items.filter((p) => p.id !== deleted.id);
            });
    },
});

export default productsSlice.reducer;
