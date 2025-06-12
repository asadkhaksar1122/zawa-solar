
import type { Company } from '@/lib/types';
import { baseApi } from './baseApi';

// Inject endpoints into the baseApi
export const companiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => 'companies', // This will make a GET request to /api/companies
    }),
    // You can inject other company-related endpoints here
  }),
});

// Export hooks for usage in UI components
export const { useGetCompaniesQuery } = companiesApi;
