
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
// Import any other reducers if you have them, e.g., for specific features
// import someFeatureReducer from './features/someFeatureSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    // someFeature: someFeatureReducer, // Example of another reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
