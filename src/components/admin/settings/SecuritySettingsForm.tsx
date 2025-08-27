'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Clock, AlertTriangle, Plus, X, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { WebsiteSettings, SecuritySettings } from '@/lib/types';

const securitySchema = z.object({
  enableTwoFactor: z.boolean(),
  isVpnProtected: z.boolean().optional(),
  sessionTimeout: z.number().min(5, 'Session timeout must be at least 5 minutes').max(1440, 'Session timeout cannot exceed 24 hours'),
  maxLoginAttempts: z.number().min(1, 'Must allow at least 1 login attempt').max(20, 'Maximum 20 login attempts allowed'),
  lockoutDuration: z.number().min(1, 'Lockout duration must be at least 1 minute').max(1440, 'Lockout duration cannot exceed 24 hours'),
  enableCaptcha: z.boolean(),
  allowedDomains: z.array(z.string()),
  captcha: z.object({
    provider: z.enum(['none', 'recaptcha', 'hcaptcha']).optional(),
    siteKey: z.string().optional(),
    secretKey: z.string().optional(),
  }).optional(),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

interface SecuritySettingsFormProps {
  settings?: Partial<WebsiteSettings>;
  onChange: (data: Partial<SecuritySettings>) => void;
  isLoading?: boolean;
}

export function SecuritySettingsForm({ settings, onChange, isLoading }: SecuritySettingsFormProps) {
  const [newDomain, setNewDomain] = useState('');

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      enableTwoFactor: settings?.security?.enableTwoFactor || false,
      sessionTimeout: settings?.security?.sessionTimeout || 60,
      maxLoginAttempts: settings?.security?.maxLoginAttempts || 5,
      lockoutDuration: settings?.security?.lockoutDuration || 15,
      enableCaptcha: settings?.security?.enableCaptcha || false,
      allowedDomains: settings?.security?.allowedDomains || [],
      captcha: settings?.security?.captcha || { provider: 'none', siteKey: '', secretKey: '' },
      // New VPN protection flag
      isVpnProtected: settings?.security?.isVpnProtected || false,
    },
    mode: 'onChange',
  });

  // Update form when settings change
  useEffect(() => {
    if (settings?.security) {
      const security = settings.security;
      form.reset({
        enableTwoFactor: security.enableTwoFactor || false,
        isVpnProtected: security.isVpnProtected || false,
        sessionTimeout: security.sessionTimeout || 60,
        maxLoginAttempts: security.maxLoginAttempts || 5,
        lockoutDuration: security.lockoutDuration || 15,
        enableCaptcha: security.enableCaptcha || false,
        allowedDomains: security.allowedDomains || [],
        captcha: security.captcha || { provider: 'none', siteKey: '', secretKey: '' },
      });
    }
  }, [settings, form]);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        onChange(value as Partial<SecuritySettings>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // VPN modal state
  const [isVpnModalOpen, setIsVpnModalOpen] = useState(false);
  const [publicIp, setPublicIp] = useState<string | null>(null);
  const [checkingIp, setCheckingIp] = useState(false);

  // Simple public IP check
  const checkPublicIp = async () => {
    try {
      setCheckingIp(true);
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setPublicIp(data.ip);
      setCheckingIp(false);
      return data.ip;
    } catch (err) {
      setCheckingIp(false);
      setPublicIp(null);
      return null;
    }
  };

  // When user enables VPN protection, perform IP check and show modal if a VPN is suspected.
  // Note: robust VPN detection requires external services; here we simply show the modal when
  // isVpnProtected is enabled and we can fetch the public IP — the admin can instruct users.
  useEffect(() => {
    const sub = form.watch(async (value, { name }) => {
      if (name === 'isVpnProtected' && value.isVpnProtected) {
        const ip = await checkPublicIp();
        // Heuristic: if we get an IP back, show the modal instructing to disable VPN when users connect via VPN.
        if (ip) {
          setIsVpnModalOpen(true);
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Add allowed domain
  const addDomain = () => {
    if (newDomain.trim()) {
      const currentDomains = form.getValues('allowedDomains');
      if (!currentDomains.includes(newDomain.trim())) {
        form.setValue('allowedDomains', [...currentDomains, newDomain.trim()]);
        setNewDomain('');
      }
    }
  };

  // Remove allowed domain
  const removeDomain = (domain: string) => {
    const currentDomains = form.getValues('allowedDomains');
    form.setValue('allowedDomains', currentDomains.filter(d => d !== domain));
  };

  // Get security level based on settings
  const getSecurityLevel = () => {
    const values = form.getValues();
    let score = 0;

    if (values.enableTwoFactor) score += 2;
    if (values.enableCaptcha) score += 1;
    if (values.sessionTimeout <= 30) score += 1;
    if (values.maxLoginAttempts <= 3) score += 1;
    if (values.lockoutDuration >= 30) score += 1;
    if (values.allowedDomains.length > 0) score += 1;

    if (score >= 5) return { level: 'High', color: 'bg-green-500' };
    if (score >= 3) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-red-500' };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="space-y-6">
      <Form {...form}>
        {/* Security Level Indicator */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Current Security Level:</span>
            <Badge className={`${securityLevel.color} text-white`}>
              {securityLevel.level}
            </Badge>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4" />
                Authentication Security
              </CardTitle>
              <CardDescription>
                Configure login and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableTwoFactor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Require 2FA for admin accounts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          console.log('2FA toggled:', checked);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableCaptcha"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable CAPTCHA</FormLabel>
                      <FormDescription>
                        Show CAPTCHA on login forms
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* VPN Protection Toggle */}
              <FormField
                control={form.control}
                name="isVpnProtected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">VPN Protection</FormLabel>
                      <FormDescription>
                        When enabled, users connecting via VPN will be shown instructions to disable VPN before proceeding.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // keep parent informed
                          onChange({ ...form.getValues() } as Partial<SecuritySettings>);
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* CAPTCHA Configuration */}
              {form.watch('enableCaptcha') && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CAPTCHA Provider</FormLabel>
                        <FormControl>
                          <select
                            value={field.value?.provider || 'none'}
                            onChange={(e) => field.onChange({ ...(field.value || {}), provider: e.target.value })}
                            className="w-full rounded border p-2"
                          >
                            <option value="none">None</option>
                            <option value="recaptcha">reCAPTCHA</option>
                            <option value="hcaptcha">hCaptcha</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Select the CAPTCHA provider to enable on login/register forms.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Site Key"
                            value={field.value?.siteKey || ''}
                            onChange={(e) => field.onChange({ ...(field.value || {}), siteKey: e.target.value })}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Secret Key (stored securely)"
                            value={field.value?.secretKey || ''}
                            onChange={(e) => field.onChange({ ...(field.value || {}), secretKey: e.target.value })}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Secret key will be stored in environment variables when you save configuration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="maxLoginAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Login Attempts</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of failed attempts before account lockout
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lockoutDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lockout Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1440"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      How long to lock accounts after failed attempts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Session Management
              </CardTitle>
              <CardDescription>
                Configure user session settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        max="1440"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Automatically log out inactive users after this time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Session Timeout Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 60, 120, 240, 480].map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue('sessionTimeout', minutes)}
                      disabled={isLoading}
                    >
                      {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
                    </Button>
                  ))}
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Shorter session timeouts improve security but may inconvenience users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" />
              Access Control
            </CardTitle>
            <CardDescription>
              Restrict access to specific domains (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="allowedDomains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Domains</FormLabel>
                  <FormDescription>
                    Leave empty to allow all domains. Add domains to restrict access.
                  </FormDescription>

                  {/* Add new domain */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addDomain}
                      disabled={isLoading || !newDomain.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Display current domains */}
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {field.value.map((domain) => (
                        <Badge key={domain} variant="secondary" className="gap-1">
                          {domain}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeDomain(domain)}
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

            {form.watch('allowedDomains').length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No domain restrictions are currently active. Users can access from any domain.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Form>
      {/* VPN modal shown to admins when VPN protection is enabled to instruct end-users */}
      <Dialog open={isVpnModalOpen} onOpenChange={setIsVpnModalOpen}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>VPN Protection Enabled</DialogTitle>
            <DialogDescription>
              Your site is now configured to require users to disable VPN before continuing. When a user connects while using a VPN, they will see instructions to disable it and will be able to refresh to re-check their connection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Current public IP: {publicIp ?? (checkingIp ? 'Checking...' : 'Unavailable')}</p>
              <p className="mt-2">If you are testing this locally, try enabling/disabling your VPN or proxy and then click Refresh below.</p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => { setIsVpnModalOpen(false); }}>
              Close
            </Button>
            <Button onClick={async () => {
              await checkPublicIp();
              // re-open if still set (keeps modal open to allow testing)
              setIsVpnModalOpen(true);
            }}>
              Refresh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
