'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Server,
  Users,
  Mail,
  HardDrive,
  AlertTriangle,
  Settings,
  Plus,
  X,
  FileText,
  Shield
} from 'lucide-react';
import type { WebsiteSettings, SystemSettings } from '@/lib/types';

const systemSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().min(1, 'Maintenance message is required'),
  enableRegistration: z.boolean(),
  enableEmailVerification: z.boolean(),
  defaultUserRole: z.enum(['user', 'admin']),
  maxFileUploadSize: z.number().min(1, 'File size must be at least 1 MB').max(100, 'File size cannot exceed 100 MB'),
  allowedFileTypes: z.array(z.string()),
});

type SystemFormValues = z.infer<typeof systemSchema>;

interface SystemSettingsFormProps {
  settings?: Partial<WebsiteSettings>;
  onChange: (data: Partial<SystemSettings>) => void;
  isLoading?: boolean;
}

// Common file types
const commonFileTypes = [
  { value: 'jpg', label: 'JPG Images' },
  { value: 'jpeg', label: 'JPEG Images' },
  { value: 'png', label: 'PNG Images' },
  { value: 'gif', label: 'GIF Images' },
  { value: 'webp', label: 'WebP Images' },
  { value: 'pdf', label: 'PDF Documents' },
  { value: 'doc', label: 'Word Documents' },
  { value: 'docx', label: 'Word Documents (DOCX)' },
  { value: 'xls', label: 'Excel Spreadsheets' },
  { value: 'xlsx', label: 'Excel Spreadsheets (XLSX)' },
  { value: 'txt', label: 'Text Files' },
  { value: 'csv', label: 'CSV Files' },
  { value: 'zip', label: 'ZIP Archives' },
  { value: 'rar', label: 'RAR Archives' },
];

export function SystemSettingsForm({ settings, onChange, isLoading }: SystemSettingsFormProps) {
  const [newFileType, setNewFileType] = useState('');

  const form = useForm<SystemFormValues>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      maintenanceMode: settings?.system?.maintenanceMode || false,
      maintenanceMessage: settings?.system?.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.',
      enableRegistration: settings?.system?.enableRegistration !== undefined ? settings.system.enableRegistration : true,
      enableEmailVerification: settings?.system?.enableEmailVerification !== undefined ? settings.system.enableEmailVerification : true,
      defaultUserRole: settings?.system?.defaultUserRole || 'user',
      maxFileUploadSize: settings?.system?.maxFileUploadSize || 10,
      allowedFileTypes: settings?.system?.allowedFileTypes || ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    },
    mode: 'onChange',
  });

  // Update form when settings change
  useEffect(() => {
    if (settings?.system) {
      const system = settings.system;
      form.reset({
        maintenanceMode: system.maintenanceMode === true,
        maintenanceMessage: system.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.',
        enableRegistration: system.enableRegistration !== undefined ? system.enableRegistration : true,
        enableEmailVerification: system.enableEmailVerification !== undefined ? system.enableEmailVerification : true,
        defaultUserRole: system.defaultUserRole || 'user',
        maxFileUploadSize: system.maxFileUploadSize || 10,
        allowedFileTypes: system.allowedFileTypes || ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      });
    }
  }, [settings, form]);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        console.log('SystemSettingsForm - Field changed:', name, 'Value:', (value as any)[name]);
        onChange(value as Partial<SystemSettings>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Add file type
  const addFileType = () => {
    if (newFileType.trim()) {
      const currentTypes = form.getValues('allowedFileTypes');
      const cleanType = newFileType.trim().toLowerCase().replace('.', '');
      if (!currentTypes.includes(cleanType)) {
        form.setValue('allowedFileTypes', [...currentTypes, cleanType]);
        setNewFileType('');
      }
    }
  };

  // Remove file type
  const removeFileType = (fileType: string) => {
    const currentTypes = form.getValues('allowedFileTypes');
    form.setValue('allowedFileTypes', currentTypes.filter(t => t !== fileType));
  };

  // Toggle common file type
  const toggleFileType = (fileType: string) => {
    const currentTypes = form.getValues('allowedFileTypes');
    if (currentTypes.includes(fileType)) {
      removeFileType(fileType);
    } else {
      form.setValue('allowedFileTypes', [...currentTypes, fileType]);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Maintenance & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4" />
                Maintenance & Access
              </CardTitle>
              <CardDescription>
                Control site availability and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <FormDescription>
                        Put the site in maintenance mode
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.trigger('maintenanceMode');
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('maintenanceMode') === true && (
                <FormField
                  control={form.control}
                  name="maintenanceMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="We are currently performing maintenance..."
                          className="min-h-[80px]"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Message shown to visitors during maintenance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('maintenanceMode') === true && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Maintenance mode will make your site inaccessible to regular users.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                User Management
              </CardTitle>
              <CardDescription>
                Configure user registration and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Registration</FormLabel>
                      <FormDescription>
                        Allow new users to register
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.trigger('enableRegistration');
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableEmailVerification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Verification</FormLabel>
                      <FormDescription>
                        Require email verification for new users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          form.trigger('enableEmailVerification');
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultUserRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default role assigned to new users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* File Upload Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HardDrive className="h-4 w-4" />
              File Upload Settings
            </CardTitle>
            <CardDescription>
              Configure file upload restrictions and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="maxFileUploadSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum File Size (MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={field.value}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          field.onChange(value);
                        }
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum file size allowed for uploads
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">File Size Presets</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 5, 10, 25, 50, 100].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue('maxFileUploadSize', size)}
                    disabled={isLoading}
                  >
                    {size} MB
                  </Button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="allowedFileTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed File Types</FormLabel>
                  <FormDescription>
                    Select which file types users can upload
                  </FormDescription>

                  {/* Common file types */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {commonFileTypes.map((type) => (
                      <Button
                        key={type.value}
                        type="button"
                        variant={field.value.includes(type.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFileType(type.value)}
                        disabled={isLoading}
                        className="justify-start"
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>

                  {/* Add custom file type */}
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Enter file extension (e.g., mp4)"
                      value={newFileType}
                      onChange={(e) => setNewFileType(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFileType();
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addFileType}
                      disabled={isLoading || !newFileType.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Display current file types */}
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {field.value.map((fileType) => (
                        <Badge key={fileType} variant="secondary" className="gap-1">
                          .{fileType}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent ml-1"
                            onClick={() => removeFileType(fileType)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}

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