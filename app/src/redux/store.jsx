// redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { contactReducer } from "./reducer";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Combine all reducers (for scalability)
const rootReducer = combineReducers({
  contactReducer, // contains user, contacts, groups
});

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["contactReducer"], // only persist this slice
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store setup
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor for <PersistGate />
export const persistor = persistStore(store);
