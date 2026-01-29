import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
    const r = await fetch(`${API}/api/me`, { credentials: "include" });
    const d = await r.json();
    return d.user || null;
});

export const signUp = createAsyncThunk("auth/signUp", async ({ email, password, role }, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role }),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Signup failed");

    const meResponse = await fetch(`${API}/api/me`, { credentials: "include" });
    const meData = await meResponse.json();
    return meData.user || null;
});

export const signIn = createAsyncThunk("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Signin failed");

    const meResponse = await fetch(`${API}/api/me`, { credentials: "include" });
    const meData = await meResponse.json();
    return meData.user || null;
});

export const signOut = createAsyncThunk("auth/signOut", async () => {
    await fetch(`${API}/api/signout`, {
        method: "POST",
        credentials: "include",
    });
    return null;
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    const r = await fetch(`${API}/api/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    const d = await r.json();
    if (!r.ok) return rejectWithValue(d.error || "Update failed");
    return true;
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export default authSlice.reducer;
