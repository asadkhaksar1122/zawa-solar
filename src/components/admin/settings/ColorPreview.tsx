'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDynamicStyles, useAppearanceSettings } from '@/contexts/SettingsContext';
import { Palette, Eye, Sparkles } from 'lucide-react';

interface ColorPreviewProps {
  className?: string;
}

export function ColorPreview({ className }: ColorPreviewProps) {
  const { primaryColor, secondaryColor, accentColor } = useAppearanceSettings();
  const dynamicStyles = useDynamicStyles();

  const colorVariations = [
    { name: '50', suffix: '50' },
    { name: '100', suffix: '100' },
    { name: '200', suffix: '200' },
    { name: '300', suffix: '300' },
    { name: '400', suffix: '400' },
    { name: '500', suffix: '500' },
    { name: '600', suffix: '600' },
    { name: '700', suffix: '700' },
    { name: '800', suffix: '800' },
    { name: '900', suffix: '900' },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Preview
          </CardTitle>
          <CardDescription>
            Preview how your colors will look across the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Swatches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Primary Color</h4>
              <div className="grid grid-cols-5 gap-1">
                {colorVariations.map((variation) => (
                  <div
                    key={`primary-${variation.name}`}
                    className={`aspect-square rounded-md border border-border/50 bg-primary-${variation.suffix}`}
                    title={`primary-${variation.name}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-mono">{primaryColor}</p>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Secondary Color</h4>
              <div className="grid grid-cols-5 gap-1">
                {colorVariations.map((variation) => (
                  <div
                    key={`secondary-${variation.name}`}
                    className={`aspect-square rounded-md border border-border/50 bg-secondary-${variation.suffix}`}
                    title={`secondary-${variation.name}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-mono">{secondaryColor}</p>
            </div>

            {/* Accent Colors */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Accent Color</h4>
              <div className="grid grid-cols-5 gap-1">
                {colorVariations.map((variation) => (
                  <div
                    key={`accent-${variation.name}`}
                    className={`aspect-square rounded-md border border-border/50 bg-accent-${variation.suffix}`}
                    title={`accent-${variation.name}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-mono">{accentColor}</p>
            </div>
          </div>

          {/* Component Examples */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Component Examples
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buttons */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium">Buttons</h5>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Primary Button</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium">Badges</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge>Primary Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Cards</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Primary Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      This card uses primary color accents
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-accent-700">Accent Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      This card uses accent color theming
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Inline Style Examples */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Dynamic Styling
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="p-3 rounded-lg border"
                  style={dynamicStyles.getPrimaryBgStyle(0.1)}
                >
                  <p className="text-sm font-medium" style={dynamicStyles.getPrimaryStyle()}>
                    Primary Background
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Using dynamic primary color
                  </p>
                </div>

                <div 
                  className="p-3 rounded-lg border"
                  style={dynamicStyles.getSecondaryBgStyle(0.1)}
                >
                  <p className="text-sm font-medium" style={dynamicStyles.getSecondaryStyle()}>
                    Secondary Background
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Using dynamic secondary color
                  </p>
                </div>

                <div 
                  className="p-3 rounded-lg border"
                  style={dynamicStyles.getAccentBgStyle(0.1)}
                >
                  <p className="text-sm font-medium" style={dynamicStyles.getAccentStyle()}>
                    Accent Background
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Using dynamic accent color
                  </p>
                </div>
              </div>
            </div>

            {/* Border Examples */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Border Examples</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="p-3 rounded-lg bg-background"
                  style={dynamicStyles.getPrimaryBorderStyle(2)}
                >
                  <p className="text-sm font-medium">Primary Border</p>
                </div>

                <div 
                  className="p-3 rounded-lg bg-background"
                  style={dynamicStyles.getSecondaryBorderStyle(2)}
                >
                  <p className="text-sm font-medium">Secondary Border</p>
                </div>

                <div 
                  className="p-3 rounded-lg bg-background"
                  style={dynamicStyles.getAccentBorderStyle(2)}
                >
                  <p className="text-sm font-medium">Accent Border</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h5 className="text-sm font-medium mb-2">How to Use Dynamic Colors</h5>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>Tailwind Classes:</strong> Use <code>bg-primary-500</code>, <code>text-accent-600</code>, etc.</p>
              <p><strong>CSS Variables:</strong> Use <code>var(--primary-color)</code> in custom CSS</p>
              <p><strong>React Hooks:</strong> Use <code>useDynamicStyles()</code> for inline styles</p>
              <p><strong>Component Props:</strong> Colors automatically apply to UI components</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}