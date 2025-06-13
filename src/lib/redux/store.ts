
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { baseApi } from './api/baseApi';
// Import newly created API slices if they are separate
// import { solutionsApi } from './api/solutionsApi'; // Not needed if baseApi is the single source
// import { companiesApi } from './api/companiesApi'; // Not needed
// import { contactApi } from './api/contactApi'; // Not needed


// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [], // Start with an empty whitelist - nothing will be persisted yet.
                 // Add reducer keys here (e.g., ['auth', 'cart']) to persist them.
};

// If you had other reducers, you would combine them here:
// const rootReducer = combineReducers({
//   [baseApi.reducerPath]: baseApi.reducer,
//   // yourOtherReducer: yourOtherReducer,
// });
// For now, baseApi.reducer is effectively the root reducer for persisted state.
// If you only want to persist parts of baseApi's state (unlikely for an API slice),
// you'd need a more complex setup or persist other state slices instead.
// Typically, API slices like baseApi are not persisted directly because they manage cached server state.
// You usually persist UI state or user-specific data like auth tokens.

// Since baseApi.reducer is the only one managed by RTK right now,
// and we don't want to persist API cache directly, we'll create a minimal root reducer
// that includes the API slice but the persistence will be controlled by the whitelist.
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  // Add other reducers here if you create them later and want to persist them.
  // For example: auth: authReducer (if you create an authSlice)
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
