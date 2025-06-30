// Replace with your actual type for dashboard data
import { DashboardData } from '@/lib/types';
import { baseApi } from './baseApi';

// Inject endpoints into the baseApi
export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardData, void>({
            query: () => 'dashboard', // GET /api/dashboard
            providesTags: ['Dashboard'], // Optional: Add tags for caching/invalidation
        }),
        // Add other endpoints here if needed (e.g., mutations for dashboard actions)
    }),
});

// Export hooks for usage in UI components
export const { useGetDashboardQuery } = dashboardApi;