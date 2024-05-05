"use client"

import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import listingSlice from "./slice/listingSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
  
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userProfile", "phone_no", "otp_session_id"],
};

// Combine all your reducers into a root reducer
// const rootReducer = combineReducers({
//   user: authSlice,
//   list: listingSlice
// });

const persistedReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: {
    user: persistedReducer,
    list: listingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
  
export default {store, persistor};