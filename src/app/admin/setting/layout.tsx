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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useGetWebsiteSettingsQuery, useUpdateWebsiteSettingsMutation } from '@/lib/redux/api/websiteSettingsApi';
import type { WebsiteSettings } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { SettingsFormProvider } from '@/contexts/SettingsFormContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const settingsTabs = [
  {
    name: 'Site Info',
    href: '/admin/setting',
    icon: Globe,
    value: 'site',
    description: 'Basic website information',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    name: 'Email',
    href: '/admin/setting/email',
    icon: Mail,
    value: 'emailConfig',
    description: 'Email configuration',
    color: 'text-green-600 bg-green-50'
  },
  {
    name: 'Appearance',
    href: '/admin/setting/appearance',
    icon: Palette,
    value: 'appearance',
    description: 'Theme and styling',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    name: 'Security',
    href: '/admin/setting/security',
    icon: Shield,
    value: 'security',
    description: 'Security settings',
    color: 'text-orange-600 bg-orange-50'
  },
  {
    name: 'System',
    href: '/admin/setting/system',
    icon: Server,
    value: 'system',
    description: 'System configuration',
    color: 'text-gray-600 bg-gray-50'
  },
];

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<Partial<WebsiteSettings>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    setFormData(prev => {
      if (section === 'site') {
        return { ...prev, ...data };
      }
      return {
        ...prev,
        [section]: {
          ...((prev[section as keyof WebsiteSettings] as object) || {}),
          ...data
        }
      };
    });
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
  const activeTabData = settingsTabs.find(tab => tab.value === activeTab);

  const handleTabChange = (href: string) => {
    setDropdownOpen(false);
    router.push(href);
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
    <SettingsFormProvider value={{ settings: currentSettings, handleFormChange, isLoading: isUpdating }}>
      <div className="space-y-6">
        {/* Header Section - Responsive Layout */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title and Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Settings className="h-6 w-6 flex-shrink-0" />
            <h1 className="font-headline text-xl sm:text-2xl font-semibold">
              Website Settings
            </h1>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="ml-0 sm:ml-2">
                Unsaved
              </Badge>
            )}
          </div>

          {/* Action Buttons - Stack on mobile */}
          {hasUnsavedChanges && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleDiscardChanges}
                disabled={isUpdating}
                className="w-full sm:w-auto"
                size="sm"
              >
                <X className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="sm:hidden">Discard</span>
                <span className="hidden sm:inline">Discard Changes</span>
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={isUpdating}
                className="w-full sm:w-auto"
                size="sm"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save All Changes</span>
              </Button>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {updateSuccess && !hasUnsavedChanges && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Settings updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {updateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(updateError as any)?.data?.message || 'Failed to update settings. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Card */}
        <Card className="min-h-[600px]">
          <Tabs value={activeTab} className="w-full">
            <CardHeader className="pb-4 px-3 sm:px-6">
              {/* Mobile Dropdown Navigation */}
              <div className="sm:hidden">
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto py-3 px-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          activeTabData?.color
                        )}>
                          {activeTabData && <activeTabData.icon className="h-5 w-5" />}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{activeTabData?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {activeTabData?.description}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        dropdownOpen && "rotate-180"
                      )} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[calc(100vw-2rem)] sm:w-96"
                    align="start"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                      Settings Sections
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {settingsTabs.map((tab) => {
                      const isActive = tab.value === activeTab;
                      return (
                        <DropdownMenuItem
                          key={tab.value}
                          onClick={() => handleTabChange(tab.href)}
                          className={cn(
                            "cursor-pointer py-3 px-3",
                            isActive && "bg-accent"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg transition-colors",
                                isActive ? tab.color : "bg-muted"
                              )}>
                                <tab.icon className={cn(
                                  "h-4 w-4",
                                  !isActive && "text-muted-foreground"
                                )} />
                              </div>
                              <div>
                                <div className="font-medium">{tab.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {tab.description}
                                </div>
                              </div>
                            </div>
                            {isActive && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Tab Navigation */}
              <TabsList className="hidden sm:grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
                {settingsTabs.map(tab => (
                  <Link href={tab.href} key={tab.value} passHref>
                    <TabsTrigger value={tab.value} className="gap-2">
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 px-3 sm:px-6">
              {children}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </SettingsFormProvider>
  );
}