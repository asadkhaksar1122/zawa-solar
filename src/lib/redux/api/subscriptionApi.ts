import { baseApi } from './baseApi';

// Define the types for subscription
export interface SubscriptionRequest {
  email: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  recentSubscriptions: {
    email: string;
    subscribedAt: string;
    source: string;
  }[];
}

export interface Subscription {
  _id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source: string;
  ipAddress?: string;
}

export interface GetSubscriptionsParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'active' | 'inactive';
  search?: string;
}

export interface GetSubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UpdateSubscriptionRequest {
  id: string;
  isActive: boolean;
}

export interface DeleteSubscriptionRequest {
  id: string;
}

export const subscriptionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Subscribe to newsletter
    subscribe: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: 'subscription',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    // Unsubscribe from newsletter
    unsubscribe: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: 'subscription/unsubscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    // Get subscription statistics (for admin use)
    getSubscriptionStats: builder.query<SubscriptionStats, void>({
      query: () => 'subscription',
      providesTags: ['Subscription'],
    }),

    // Get all subscriptions with pagination and filtering (admin)
    getSubscriptions: builder.query<GetSubscriptionsResponse, GetSubscriptionsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.status) searchParams.append('status', params.status);
        if (params.search) searchParams.append('search', params.search);
        
        return `subscription/manage?${searchParams.toString()}`;
      },
      providesTags: ['Subscription'],
    }),

    // Update subscription status (admin)
    updateSubscription: builder.mutation<SubscriptionResponse, UpdateSubscriptionRequest>({
      query: (body) => ({
        url: 'subscription/manage',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Delete subscription permanently (admin)
    deleteSubscription: builder.mutation<SubscriptionResponse, DeleteSubscriptionRequest>({
      query: (body) => ({
        url: 'subscription/manage',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Add subscription manually (admin)
    adminAddSubscription: builder.mutation<SubscriptionResponse, SubscriptionRequest>({
      query: (body) => ({
        url: 'subscription/admin-add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useGetSubscriptionStatsQuery,
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useAdminAddSubscriptionMutation,
} = subscriptionApi;