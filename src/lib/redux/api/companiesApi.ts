import type { Company } from '@/lib/types';
import { baseApi } from './baseApi';

// Inject endpoints into the baseApi
export const companiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => 'companies', // GET /api/companies
      providesTags: ['Companies'],
    }),
    createCompany: builder.mutation<Company, { name: string }>({
      query: (body) => ({
        url: 'companies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Companies'],
    }),
    updateCompany: builder.mutation<Company, { _id: string; name: string }>({
      query: (body) => ({
        url: 'companies',
        method: 'PUT',
        body, // Sends { _id, name } in the body
      }),
      invalidatesTags: ['Companies'],
    }),
    // Add other endpoints here
  }),
});

// Export hooks for usage in UI components
export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation // <-- Export the new hook
} = companiesApi;