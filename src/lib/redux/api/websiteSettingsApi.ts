import type { WebsiteSettings } from '@/lib/types';
import { baseApi } from './baseApi';

// Request/Response types for API calls
export interface UpdateWebsiteSettingsRequest {
  id?: string;
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  adminEmail?: string;
  timezone?: string;
  language?: string;
  emailConfig?: {
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail?: string;
    fromName?: string;
  };
  appearance?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
    customCSS?: string;
  };
  security?: {
    enableTwoFactor?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    enableCaptcha?: boolean;
    allowedDomains?: string[];
  };
  system?: {
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
    enableRegistration?: boolean;
    enableEmailVerification?: boolean;
    defaultUserRole?: 'user' | 'admin';
    maxFileUploadSize?: number;
    allowedFileTypes?: string[];
  };
  lastUpdatedBy?: string;
}

export interface CreateWebsiteSettingsRequest {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone?: string;
  language?: string;
  emailConfig: {
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  appearance?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
    customCSS?: string;
  };
  security?: {
    enableTwoFactor?: boolean;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    enableCaptcha?: boolean;
    allowedDomains?: string[];
  };
  system?: {
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
    enableRegistration?: boolean;
    enableEmailVerification?: boolean;
    defaultUserRole?: 'user' | 'admin';
    maxFileUploadSize?: number;
    allowedFileTypes?: string[];
  };
}

export interface WebsiteSettingsResponse {
  message?: string;
  settings?: WebsiteSettings;
  errors?: string[];
}

// Inject endpoints into the baseApi
export const websiteSettingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get website settings
    getWebsiteSettings: builder.query<WebsiteSettings, void>({
      query: () => 'website-settings',
      providesTags: ['WebsiteSettings'],
      // Transform response to handle potential errors
      transformResponse: (response: any) => {
        if (response.message && response.error) {
          throw new Error(response.message);
        }
        return response;
      },
    }),

    // Update website settings
    updateWebsiteSettings: builder.mutation<WebsiteSettings, UpdateWebsiteSettingsRequest>({
      query: (body) => ({
        url: 'website-settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['WebsiteSettings'],
      // Transform response and handle errors
      transformResponse: (response: any) => {
        if (response.message && response.error) {
          throw new Error(response.message);
        }
        return response;
      },
      // Handle error responses
      transformErrorResponse: (response: any) => {
        if (response.data?.errors) {
          return {
            message: response.data.message || 'Validation failed',
            errors: response.data.errors,
          };
        }
        return response.data || { message: 'An error occurred' };
      },
    }),

    // Create website settings (admin only)
    createWebsiteSettings: builder.mutation<WebsiteSettings, CreateWebsiteSettingsRequest>({
      query: (body) => ({
        url: 'website-settings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WebsiteSettings'],
      transformResponse: (response: any) => {
        if (response.message && response.error) {
          throw new Error(response.message);
        }
        return response;
      },
      transformErrorResponse: (response: any) => {
        if (response.data?.errors) {
          return {
            message: response.data.message || 'Validation failed',
            errors: response.data.errors,
          };
        }
        return response.data || { message: 'An error occurred' };
      },
    }),

    // Deactivate website settings (admin only)
    deactivateWebsiteSettings: builder.mutation<WebsiteSettingsResponse, string>({
      query: (id) => ({
        url: `website-settings?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WebsiteSettings'],
      transformResponse: (response: any) => {
        return response;
      },
    }),

    // Test email configuration
    testEmailConfig: builder.mutation<{ success: boolean; message: string }, {
      emailConfig: {
        smtpHost: string;
        smtpPort: number;
        smtpSecure: boolean;
        smtpUser: string;
        smtpPassword: string;
        fromEmail: string;
        fromName: string;
      };
      testEmail: string;
    }>({
      query: (body) => ({
        url: 'website-settings/test-email',
        method: 'POST',
        body,
      }),
      // Don't invalidate tags for test operations
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
  useCreateWebsiteSettingsMutation,
  useDeactivateWebsiteSettingsMutation,
  useTestEmailConfigMutation,
} = websiteSettingsApi;

// Export the API for use in store configuration
export default websiteSettingsApi;
