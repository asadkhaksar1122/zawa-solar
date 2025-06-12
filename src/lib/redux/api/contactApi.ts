import type { ContactSettings } from '@/lib/types';
import { baseApi } from './baseApi';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactSettings: builder.query<ContactSettings, void>({
      query: () => 'contact-settings',
      providesTags: ['ContactSettings'],
    }),
  }),
});

export const { useGetContactSettingsQuery } = contactApi;
