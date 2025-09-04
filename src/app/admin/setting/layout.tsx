'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Globe, 
  Mail, 
  Palette, 
  Shield, 
  Server, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useGetWebsiteSettingsQuery, useUpdateWebsiteSettingsMutation } from '@/lib/redux/api/websiteSettingsApi';
import type { WebsiteSettings } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { SettingsFormProvider } from '@/contexts/SettingsFormContext';

const settingsTabs = [
  { name: 'Site Info', href: '/admin/setting', icon: Globe, value: 'site' },
  { name: 'Email', href: '/admin/setting/email', icon: Mail, value: 'email' },
  { name: 'Appearance', href: '/admin/setting/appearance', icon: Palette, value: 'appearance' },
  { name: 'Security', href: '/admin/setting/security', icon: Shield, value: 'security' },
  { name: 'System', href: '/admin/setting/system', icon: Server, value: 'system' },
];

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<WebsiteSettings>>({});

  const { 
    data: settings, 
    isLoading, 
    error: fetchError,
    refetch 
  } = useGetWebsiteSettingsQuery();

  const [
    updateSettings, 
    { 
      isLoading: isUpdating, 
      error: updateError,
      isSuccess: updateSuccess 
    }
  ] = useUpdateWebsiteSettingsMutation();

  const handleFormChange = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...((prev[section as keyof WebsiteSettings] as object) || {}),
        ...data
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async () => {
    if (!settings || !session?.user) return;

    try {
      await updateSettings({
        id: settings._id,
        ...formData,
        lastUpdatedBy: session.user.email || session.user.name || 'Unknown'
      }).unwrap();
      
      setHasUnsavedChanges(false);
      setFormData({});
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleDiscardChanges = () => {
    setFormData({});
    setHasUnsavedChanges(false);
    refetch();
  };

  const getActiveTab = () => {
    if (pathname === '/admin/setting') return 'site';
    const segment = pathname.split('/').pop();
    return settingsTabs.find(tab => tab.href.endsWith(segment || ''))?.value || 'site';
  };
  
  const activeTab = getActiveTab();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="font-headline text-2xl font-semibold">Website Settings</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load settings. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentSettings = { ...settings, ...formData };

  return (
    <SettingsFormProvider value={{ settings: currentSettings, handleFormChange, isLoading: isUpdating }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <h1 className="font-headline text-2xl font-semibold">Website Settings</h1>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="ml-2">
                Unsaved Changes
              </Badge>
            )}
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleDiscardChanges}
                disabled={isUpdating}
              >
                Discard Changes
              </Button>
              <Button 
                onClick={handleSaveAll}
                disabled={isUpdating}
                className="gap-2"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save All Changes
              </Button>
            </div>
          )}
        </div>

        {updateSuccess && !hasUnsavedChanges && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Settings updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {updateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(updateError as any)?.data?.message || 'Failed to update settings. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Card className="min-h-[600px]">
          <Tabs value={activeTab} className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
                {settingsTabs.map(tab => (
                  <Link href={tab.href} key={tab.value} passHref legacyBehavior>
                    <TabsTrigger value={tab.value} className="gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {children}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </SettingsFormProvider>
  );
}
