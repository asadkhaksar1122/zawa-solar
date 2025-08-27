'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Palette, Image, Code, Upload, X, Eye, Plus, Trash2, Save } from 'lucide-react';
import type { WebsiteSettings, AppearanceSettings } from '@/lib/types';
import { useColorThemes } from '@/hooks/useColorThemes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const appearanceSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  faviconUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  customCSS: z.string().optional(),
});

type AppearanceFormValues = z.infer<typeof appearanceSchema>;

interface AppearanceSettingsFormProps {
  settings?: Partial<WebsiteSettings>;
  onChange: (data: Partial<AppearanceSettings>) => void;
  isLoading?: boolean;
}

// Schema for creating new themes
const newThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required').max(50, 'Theme name must be less than 50 characters'),
});

export function AppearanceSettingsForm({ settings, onChange, isLoading }: AppearanceSettingsFormProps) {
  const [previewColors, setPreviewColors] = useState({
    primary: '#7EC4CF',
    secondary: '#FFB347',
    accent: '#4A90E2',
  });

  // Custom theme management
  const { themes, isLoading: themesLoading, createTheme, deleteTheme, fetchThemes } = useColorThemes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      primaryColor: settings?.appearance?.primaryColor || '#7EC4CF',
      secondaryColor: settings?.appearance?.secondaryColor || '#FFB347',
      accentColor: settings?.appearance?.accentColor || '#4A90E2',
      logoUrl: settings?.appearance?.logoUrl || '',
      faviconUrl: settings?.appearance?.faviconUrl || '',
      customCSS: settings?.appearance?.customCSS || '',
    },
    mode: 'onChange',
  });

  // Update form when settings change
  useEffect(() => {
    if (settings?.appearance) {
      const appearance = settings.appearance;
      form.reset({
        primaryColor: appearance.primaryColor || '#7EC4CF',
        secondaryColor: appearance.secondaryColor || '#FFB347',
        accentColor: appearance.accentColor || '#4A90E2',
        logoUrl: appearance.logoUrl || '',
        faviconUrl: appearance.faviconUrl || '',
        customCSS: appearance.customCSS || '',
      });
      
      setPreviewColors({
        primary: appearance.primaryColor || '#7EC4CF',
        secondary: appearance.secondaryColor || '#FFB347',
        accent: appearance.accentColor || '#4A90E2',
      });
    }
  }, [settings, form]);

  // Watch for form changes and notify parent
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        onChange(value as Partial<AppearanceSettings>);
        
        // Update preview colors
        if (name === 'primaryColor' || name === 'secondaryColor' || name === 'accentColor') {
          setPreviewColors(prev => ({
            ...prev,
            [name.replace('Color', '')]: value[name as keyof AppearanceFormValues] as string,
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Apply color theme from database
  const applyTheme = (theme: { primaryColor: string; secondaryColor: string; accentColor: string }) => {
    form.setValue('primaryColor', theme.primaryColor);
    form.setValue('secondaryColor', theme.secondaryColor);
    form.setValue('accentColor', theme.accentColor);
  };

  // Save current colors as new theme
  const handleSaveTheme = async () => {
    if (!newThemeName.trim()) {
      setCreateError('Theme name is required');
      return;
    }

    setCreateError(null);
    setCreateSuccess(false);

    const currentColors = form.getValues();
    const result = await createTheme({
      name: newThemeName.trim(),
      primaryColor: currentColors.primaryColor,
      secondaryColor: currentColors.secondaryColor,
      accentColor: currentColors.accentColor,
    });

    if (result.success) {
      setCreateSuccess(true);
      setNewThemeName('');
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        setCreateSuccess(false);
      }, 1500);
    } else {
      setCreateError(result.error || 'Failed to create theme');
    }
  };

  // Delete theme
  const handleDeleteTheme = async (themeId: string) => {
    const result = await deleteTheme(themeId);
    if (!result.success) {
      console.error('Failed to delete theme:', result.error);
    }
  };

  // Seed default themes
  const handleSeedDefaultThemes = async () => {
    setIsSeeding(true);
    setSeedError(null);
    setSeedSuccess(false);

    try {
      const response = await fetch('/api/seed/color-themes', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setSeedSuccess(true);
        await fetchThemes(); // Refresh themes list
        setTimeout(() => setSeedSuccess(false), 3000);
      } else {
        setSeedError(result.message || 'Failed to seed default themes');
      }
    } catch (error) {
      console.error('Error seeding themes:', error);
      setSeedError('Failed to seed default themes');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Color Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Color Scheme
              </CardTitle>
              <CardDescription>
                Customize your website's color palette
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Custom Theme Management */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Saved Themes</Label>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" size="sm" variant="outline" className="gap-2">
                        <Plus className="h-3 w-3" />
                        Save Current
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Save Color Theme</DialogTitle>
                        <DialogDescription>
                          Save your current color combination as a reusable theme.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="theme-name">Theme Name</Label>
                          <Input
                            id="theme-name"
                            placeholder="My Custom Theme"
                            value={newThemeName}
                            onChange={(e) => setNewThemeName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        {/* Preview current colors */}
                        <div className="p-3 border rounded-lg bg-muted/20">
                          <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
                          <div className="flex gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: previewColors.primary }}
                              title="Primary"
                            />
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: previewColors.secondary }}
                              title="Secondary"
                            />
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: previewColors.accent }}
                              title="Accent"
                            />
                          </div>
                        </div>

                        {createError && (
                          <Alert variant="destructive">
                            <AlertDescription>{createError}</AlertDescription>
                          </Alert>
                        )}

                        {createSuccess && (
                          <Alert className="border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">
                              Theme saved successfully!
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCreateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleSaveTheme}
                          className="gap-2"
                        >
                          <Save className="h-3 w-3" />
                          Save Theme
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Seed Status Messages */}
                {seedSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      Default themes added successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {seedError && (
                  <Alert variant="destructive">
                    <AlertDescription>{seedError}</AlertDescription>
                  </Alert>
                )}

                {/* Theme List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {themesLoading ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Loading themes...
                    </div>
                  ) : themes.length === 0 ? (
                    <div className="space-y-3">
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No saved themes yet. Add default themes to get started!
                      </div>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSeedDefaultThemes}
                          disabled={isSeeding}
                          className="gap-2"
                        >
                          {isSeeding ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Adding Themes...
                            </>
                          ) : (
                            <>
                              <Palette className="h-3 w-3" />
                              Add Default Themes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    themes.map((theme) => (
                      <div
                        key={theme._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => applyTheme(theme)}
                          className="flex-1 justify-start gap-3 h-auto p-0"
                          disabled={isLoading}
                        >
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.primaryColor }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.secondaryColor }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.accentColor }}
                            />
                          </div>
                          <span className="text-sm font-medium">{theme.name}</span>
                          {theme.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </Button>
                        
                        {!theme.isDefault && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTheme(theme._id)}
                            className="text-destructive hover:text-destructive p-1 h-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Individual Color Pickers */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            {...field}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="color"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-12 h-10 rounded border cursor-pointer"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Main brand color used for buttons and highlights
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            {...field}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="color"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-12 h-10 rounded border cursor-pointer"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Secondary color for accents and highlights
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            {...field}
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <div className="relative">
                            <input
                              type="color"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="w-12 h-10 rounded border cursor-pointer"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Accent color for special elements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Color Preview
              </CardTitle>
              <CardDescription>
                See how your colors will look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: previewColors.primary + '20' }}>
                  <Button 
                    style={{ backgroundColor: previewColors.primary }}
                    className="text-white"
                    disabled
                  >
                    Primary Button
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ backgroundColor: previewColors.secondary + '20' }}>
                  <Button 
                    style={{ backgroundColor: previewColors.secondary }}
                    className="text-white"
                    disabled
                  >
                    Secondary Button
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ backgroundColor: previewColors.accent + '20' }}>
                  <Button 
                    style={{ backgroundColor: previewColors.accent }}
                    className="text-white"
                    disabled
                  >
                    Accent Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Image className="h-4 w-4" />
              Brand Assets
            </CardTitle>
            <CardDescription>
              Upload or link to your logo and favicon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/logo.png"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to your website logo (recommended: 200x60px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/favicon.ico"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to your favicon (recommended: 32x32px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom CSS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Code className="h-4 w-4" />
              Custom CSS
            </CardTitle>
            <CardDescription>
              Add custom CSS to further customize your website's appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="customCSS"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="/* Add your custom CSS here */
.custom-class {
  color: #333;
  font-size: 16px;
}"
                      className="min-h-[150px] font-mono text-sm"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Custom CSS will be applied site-wide. Use with caution.
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
