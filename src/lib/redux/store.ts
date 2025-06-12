
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
// Import any other reducers if you have them, e.g., for specific features
// import someFeatureReducer from './features/someFeatureSlice';

// Import newly created API slices if they are separate
import { solutionsApi } from './api/solutionsApi';
import { companiesApi } from './api/companiesApi';
import { contactApi } from './api/contactApi';


export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    // It's also common to spread reducers if they are defined within the baseApi itself using injectEndpoints
    // However, if you've structured them to be auto-generated, ensure they are correctly picked up.
    // No need to explicitly list injected reducers if baseApi.reducer handles them.
    // someFeature: someFeatureReducer, // Example of another reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        baseApi.middleware,
        // If you have multiple api slices, ensure their middleware is included
        // solutionsApi.middleware, // Not needed if baseApi is the single source
        // companiesApi.middleware, // Not needed
        // contactApi.middleware, // Not needed
        ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
