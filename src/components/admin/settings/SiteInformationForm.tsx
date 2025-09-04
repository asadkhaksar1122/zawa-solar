'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Clock, Languages } from 'lucide-react';
import type { WebsiteSettings } from '@/lib/types';

const siteInformationSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters'),
  siteDescription: z.string().min(1, 'Site description is required').max(500, 'Description must be less than 500 characters'),
  siteUrl: z.string().url('Please enter a valid URL'),
  adminEmail: z.string().email('Please enter a valid email address'),
  timezone: z.string().min(1, 'Please select a timezone'),
  language: z.string().min(1, 'Please select a language'),
});

type SiteInformationFormValues = z.infer<typeof siteInformationSchema>;

interface SiteInformationFormProps {
  settings?: Partial<WebsiteSettings>;
  onChange: (data: Partial<SiteInformationFormValues>) => void;
  isLoading?: boolean;
}

// Common timezones
const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

// Common languages
const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ur', label: 'Urdu' },
];

export function SiteInformationForm({ settings, onChange, isLoading }: SiteInformationFormProps) {
  const isInitialMount = useRef(true);
  const lastSettingsRef = useRef(settings);

  const form = useForm<SiteInformationFormValues>({
    resolver: zodResolver(siteInformationSchema),
    defaultValues: {
      siteName: settings?.siteName || '',
      siteDescription: settings?.siteDescription || '',
      siteUrl: settings?.siteUrl || '',
      adminEmail: settings?.adminEmail || '',
      timezone: settings?.timezone || 'UTC',
      language: settings?.language || 'en',
    },
    mode: 'onChange',
  });

  // Only reset form when settings actually change from external source
  useEffect(() => {
    // Skip the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only reset if settings have actually changed from an external source
    // (not from our own onChange calls)
    const hasExternalChange = settings &&
      JSON.stringify(settings) !== JSON.stringify(lastSettingsRef.current);

    if (hasExternalChange) {
      lastSettingsRef.current = settings;
      form.reset({
        siteName: settings?.siteName || '',
        siteDescription: settings?.siteDescription || '',
        siteUrl: settings?.siteUrl || '',
        adminEmail: settings?.adminEmail || '',
        timezone: settings?.timezone || 'UTC',
        language: settings?.language || 'en',
      });
    }
  }, [settings, form]);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        // Update our ref to prevent unnecessary resets
        lastSettingsRef.current = value as Partial<WebsiteSettings>;
        onChange(value as Partial<SiteInformationFormValues>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Zawa Solar Energy"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of your website or organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://zawasoler.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The primary URL of your website
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@zawasoler.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Primary contact email for administrative purposes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4" />
                Localization
              </CardTitle>
              <CardDescription>
                Configure timezone and language settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default timezone for your application
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default language for your website
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Description - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Site Description</CardTitle>
            <CardDescription>
              A brief description of your website or organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Leading provider of sustainable solar energy solutions..."
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    This description may be used in search results and social media previews
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}