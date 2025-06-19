import { baseApi } from './baseApi';

// Define the types for the request body
type ContactNumber = {
  value: string;
};

type UpdateContactSettingsBody = {
  id: string;
  whatsappNumbers: ContactNumber[];
  emailAddresses: ContactNumber[];
  phoneNumbers: ContactNumber[];
  facebookUrl: string;
  officeAddress: string;
};

export const contactApi = baseApi.injectEndpoints({
  // ✅ This is where overrideExisting should go
  overrideExisting: true,
  endpoints: (builder) => ({
    getContactSettings: builder.query<any, void>({
      query: () => 'contact-settings',
      providesTags: ['ContactSettings'],
    }),
    putContactSettings: builder.mutation<any, UpdateContactSettingsBody>({
      query: (body) => ({
        url: `contact-settings`,
        method: 'PUT',
        body: {
          id: body.id,
          whatsappNumbers: body.whatsappNumbers,
          emailAddresses: body.emailAddresses,
          phoneNumbers: body.phoneNumbers,
          facebookUrl: body.facebookUrl,
          officeAddress: body.officeAddress,
        },
      }),
      invalidatesTags: ['ContactSettings'],
    }),
    getUser: builder.query<any, void>({
      query: () => 'user',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetContactSettingsQuery,
  usePutContactSettingsMutation,
  useGetUserQuery
} = contactApi;