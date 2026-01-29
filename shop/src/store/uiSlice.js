import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        searchInput: "",
        appliedSearch: "",
        promoInput: "",
        promo: null,
    },
    reducers: {
        setSearchInput(state, action) {
            state.searchInput = action.payload;
        },
        setAppliedSearch(state, action) {
            state.appliedSearch = action.payload;
        },
        setPromoInput(state, action) {
            state.promoInput = action.payload;
        },
        setPromo(state, action) {
            state.promo = action.payload;
        },
        clearPromo(state) {
            state.promo = null;
            state.promoInput = "";
        },
    },
});

export const { setSearchInput, setAppliedSearch, setPromoInput, setPromo, clearPromo } = uiSlice.actions;
export default uiSlice.reducer;
