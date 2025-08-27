'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Mail, Server, TestTube, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import type { WebsiteSettings, EmailConfig } from '@/lib/types';
import { useTestEmailConfigMutation } from '@/lib/redux/api/websiteSettingsApi';

const emailConfigSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required'),
  smtpPort: z.number().min(1, 'Port must be greater than 0').max(65535, 'Port must be less than 65536'),
  smtpSecure: z.boolean(),
  smtpUser: z.string().min(1, 'SMTP username is required'),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email('Please enter a valid email address'),
  fromName: z.string().min(1, 'From name is required'),
});

type EmailConfigFormValues = z.infer<typeof emailConfigSchema>;

interface EmailConfigurationFormProps {
  settings?: Partial<WebsiteSettings>;
  onChange: (data: Partial<EmailConfig>) => void;
  isLoading?: boolean;
}

// Common SMTP providers
const smtpProviders = [
  {
    name: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  {
    name: 'Outlook/Hotmail',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
  },
  {
    name: 'Yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
  },
  {
    name: 'Custom',
    host: '',
    port: 587,
    secure: false,
  },
];

export function EmailConfigurationForm({ settings, onChange, isLoading }: EmailConfigurationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('Custom');
  const [testEmail, setTestEmail] = useState('');
  const [passwordConfigured, setPasswordConfigured] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [testEmailConfig, {
    isLoading: isTesting,
    error: testError,
    isSuccess: testSuccess
  }] = useTestEmailConfigMutation();

  const form = useForm<EmailConfigFormValues>({
    resolver: zodResolver(emailConfigSchema),
    defaultValues: {
      smtpHost: settings?.emailConfig?.smtpHost || 'smtp.gmail.com',
      smtpPort: settings?.emailConfig?.smtpPort || 587,
      smtpSecure: settings?.emailConfig?.smtpSecure || false,
      smtpUser: settings?.emailConfig?.smtpUser || '',
      smtpPassword: settings?.emailConfig?.smtpPassword || '',
      fromEmail: settings?.emailConfig?.fromEmail || '',
      fromName: settings?.emailConfig?.fromName || 'Zawa Solar Energy',
    },
    mode: 'onChange',
  });

  // Update form when settings change
  useEffect(() => {
    if (settings?.emailConfig) {
      const config = settings.emailConfig;
      form.reset({
        smtpHost: config.smtpHost || 'smtp.gmail.com',
        smtpPort: config.smtpPort || 587,
        smtpSecure: config.smtpSecure || false,
        smtpUser: config.smtpUser || '',
        smtpPassword: config.smtpPassword || '',
        fromEmail: config.fromEmail || '',
        fromName: config.fromName || 'Zawa Solar Energy',
      });
    }
  }, [settings, form]);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        onChange(value as Partial<EmailConfig>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Handle provider selection
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    const providerConfig = smtpProviders.find(p => p.name === provider);
    if (providerConfig && provider !== 'Custom') {
      form.setValue('smtpHost', providerConfig.host);
      form.setValue('smtpPort', providerConfig.port);
      form.setValue('smtpSecure', providerConfig.secure);
    }
  };

  // Load email configuration status
  useEffect(() => {
    const loadEmailConfig = async () => {
      try {
        const response = await fetch('/api/website-settings/email-config');
        if (response.ok) {
          const data = await response.json();
          setPasswordConfigured(data.emailConfig?.passwordConfigured || false);
        }
      } catch (error) {
        console.error('Failed to load email config status:', error);
      }
    };

    loadEmailConfig();
  }, []);

  // Handle secure email configuration update
  const handleSecureUpdate = async () => {
    const formValues = form.getValues();

    // Validate that password is provided for new configurations
    if (!passwordConfigured && !formValues.smtpPassword) {
      setUpdateError('Password is required for initial configuration');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch('/api/website-settings/email-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const result = await response.json();

      if (response.ok) {
        setUpdateSuccess(true);
        setPasswordConfigured(true);
        // Clear password field after successful update
        form.setValue('smtpPassword', '');

        // Notify parent component
        onChange(result.emailConfig);

        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setUpdateError(result.message || 'Failed to update email configuration');
      }
    } catch (error) {
      console.error('Failed to update email configuration:', error);
      setUpdateError('Failed to update email configuration');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle test email
  const handleTestEmail = async () => {
    if (!testEmail) return;

    const formValues = form.getValues();
    try {
      const response = await fetch('/api/website-settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailConfig: formValues,
          testEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Test success will be handled by the response
      } else {
        console.error('Test email failed:', result.message);
      }
    } catch (error) {
      console.error('Test email failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* SMTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>
                Configure your email server settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="provider">Email Provider</Label>
                <Select value={selectedProvider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {smtpProviders.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Host *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="smtp.gmail.com"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="smtpPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="587"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 587)}
                          disabled={isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSecure"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel>Use SSL/TLS</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                          <Label className="text-sm text-muted-foreground">
                            {field.value ? 'Enabled' : 'Disabled'}
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" />
                Authentication
              </CardTitle>
              <CardDescription>
                Email account credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="smtpUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your-email@gmail.com"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormDescription>
                      Your email account username
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={passwordConfigured ? "Password is configured (leave empty to keep current)" : "Your app password"}
                          {...field}
                          disabled={isUpdating}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="flex items-center gap-2">
                      {passwordConfigured ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Password is securely stored in environment variables</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          <span>Use an app-specific password for Gmail. Password will be stored securely.</span>
                        </>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="noreply@zawasoler.com"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormDescription>
                      Email address shown as sender
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Zawa Solar Energy"
                        {...field}
                        disabled={isUpdating}
                      />
                    </FormControl>
                    <FormDescription>
                      Name shown as sender
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Secure Configuration Update */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" />
              Secure Email Configuration
            </CardTitle>
            <CardDescription>
              Update email configuration with secure password storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Update Status Messages */}
            {updateSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email configuration updated successfully! Password is now stored securely in environment variables.
                </AlertDescription>
              </Alert>
            )}

            {updateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {updateError}
                </AlertDescription>
              </Alert>
            )}

            {/* Security Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> Your email password will be stored securely in environment variables, not in the database.
                This ensures maximum security for your email credentials.
              </AlertDescription>
            </Alert>

            {/* Update Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSecureUpdate}
                disabled={isUpdating || isLoading}
                className="gap-2"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {passwordConfigured ? 'Update Configuration' : 'Save Configuration'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TestTube className="h-4 w-4" />
              Test Email Configuration
            </CardTitle>
            <CardDescription>
              Send a test email to verify your settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  disabled={isTesting}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleTestEmail}
                disabled={!testEmail || isTesting || !form.formState.isValid}
                className="gap-2"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
                Send Test
              </Button>
            </div>

            {testSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Test email sent successfully! Check your inbox.
                </AlertDescription>
              </Alert>
            )}

            {testError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to send test email. Please check your configuration.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
