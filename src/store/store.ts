import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import listingSlice from "./slice/listingSlice";

const store = configureStore({
    reducer: {
        user: authSlice,
        list: listingSlice
    },
})

export default store;