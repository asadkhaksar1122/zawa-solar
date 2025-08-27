'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  TestTube
} from 'lucide-react';
import { useGetWebsiteSettingsQuery, useUpdateWebsiteSettingsMutation } from '@/lib/redux/api/websiteSettingsApi';
import { SiteInformationForm } from '@/components/admin/settings/SiteInformationForm';
import { EmailConfigurationForm } from '@/components/admin/settings/EmailConfigurationForm';
import { AppearanceSettingsForm } from '@/components/admin/settings/AppearanceSettingsForm';
import { SecuritySettingsForm } from '@/components/admin/settings/SecuritySettingsForm';
import { SystemSettingsForm } from '@/components/admin/settings/SystemSettingsForm';
import { ColorPreview } from '@/components/admin/settings/ColorPreview';
import type { WebsiteSettings } from '@/lib/types';
import { useSession } from 'next-auth/react';

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('site');
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

  // Handle form data changes
  const handleFormChange = (section: string, data: any) => {
    console.log('Main page - Form change:', section, data);
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...((prev[section as keyof WebsiteSettings] as object) || {}),
        ...data
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Handle save all changes
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

  // Handle discard changes
  const handleDiscardChanges = () => {
    setFormData({});
    setHasUnsavedChanges(false);
    refetch();
  };

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
    <div className="space-y-6">
      {/* Header */}
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

      {/* Success/Error Messages */}
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

      {/* Settings Tabs */}
      <Card className="min-h-[600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
              <TabsTrigger value="site" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Site Info</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-2">
                <Server className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="space-y-6">
            <TabsContent value="site" className="space-y-6 mt-0">
              <div>
                <CardTitle className="text-lg mb-2">Site Information</CardTitle>
                <CardDescription>
                  Configure basic information about your website and organization.
                </CardDescription>
              </div>
              <SiteInformationForm
                settings={currentSettings}
                onChange={(data) => handleFormChange('site', data)}
                isLoading={isUpdating}
              />
            </TabsContent>

            <TabsContent value="email" className="space-y-6 mt-0">
              <div>
                <CardTitle className="text-lg mb-2">Email Configuration</CardTitle>
                <CardDescription>
                  Set up SMTP settings for sending emails from your application.
                </CardDescription>
              </div>
              <EmailConfigurationForm
                settings={currentSettings}
                onChange={(data) => handleFormChange('emailConfig', data)}
                isLoading={isUpdating}
              />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div>
                <CardTitle className="text-lg mb-2">Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your website.
                </CardDescription>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AppearanceSettingsForm
                  settings={currentSettings}
                  onChange={(data) => handleFormChange('appearance', data)}
                  isLoading={isUpdating}
                />
                <ColorPreview />
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-0">
              <div>
                <CardTitle className="text-lg mb-2">Security Settings</CardTitle>
                <CardDescription>
                  Configure security options and access controls.
                </CardDescription>
              </div>
              <SecuritySettingsForm
                settings={currentSettings}
                onChange={(data) => handleFormChange('security', data)}
                isLoading={isUpdating}
              />
            </TabsContent>

            <TabsContent value="system" className="space-y-6 mt-0">
              <div>
                <CardTitle className="text-lg mb-2">System Settings</CardTitle>
                <CardDescription>
                  Manage system-wide configurations and maintenance options.
                </CardDescription>
              </div>
              <SystemSettingsForm
                settings={currentSettings}
                onChange={(data) => handleFormChange('system', data)}
                isLoading={isUpdating}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
