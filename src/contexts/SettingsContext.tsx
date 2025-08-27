'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetWebsiteSettingsQuery } from '@/lib/redux/api/websiteSettingsApi';
import type { WebsiteSettings } from '@/lib/types';

interface SettingsContextType {
  settings: WebsiteSettings | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useGetWebsiteSettingsQuery();

  const [appliedSettings, setAppliedSettings] = useState<WebsiteSettings | null>(null);

  // Apply CSS variables when settings change
  useEffect(() => {
    if (settings?.appearance) {
      const root = document.documentElement;
      
      // Apply color variables (for direct use)
      root.style.setProperty('--primary-color', settings.appearance.primaryColor);
      root.style.setProperty('--secondary-color', settings.appearance.secondaryColor);
      root.style.setProperty('--accent-color', settings.appearance.accentColor);
      
      // Update CSS custom properties for the design system (HSL format for Tailwind)
      const primaryHsl = hexToHsl(settings.appearance.primaryColor);
      const secondaryHsl = hexToHsl(settings.appearance.secondaryColor);
      const accentHsl = hexToHsl(settings.appearance.accentColor);
      
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--secondary', secondaryHsl);
      root.style.setProperty('--accent', accentHsl);
      
      // Generate complementary colors for better theming
      const primaryRgb = hexToRgb(settings.appearance.primaryColor);
      const secondaryRgb = hexToRgb(settings.appearance.secondaryColor);
      const accentRgb = hexToRgb(settings.appearance.accentColor);
      
      // Apply primary variations
      root.style.setProperty('--primary-50', lightenColor(primaryHsl, 45));
      root.style.setProperty('--primary-100', lightenColor(primaryHsl, 35));
      root.style.setProperty('--primary-200', lightenColor(primaryHsl, 25));
      root.style.setProperty('--primary-300', lightenColor(primaryHsl, 15));
      root.style.setProperty('--primary-400', lightenColor(primaryHsl, 8));
      root.style.setProperty('--primary-500', primaryHsl);
      root.style.setProperty('--primary-600', darkenColor(primaryHsl, 8));
      root.style.setProperty('--primary-700', darkenColor(primaryHsl, 15));
      root.style.setProperty('--primary-800', darkenColor(primaryHsl, 25));
      root.style.setProperty('--primary-900', darkenColor(primaryHsl, 35));
      
      // Apply secondary variations
      root.style.setProperty('--secondary-50', lightenColor(secondaryHsl, 45));
      root.style.setProperty('--secondary-100', lightenColor(secondaryHsl, 35));
      root.style.setProperty('--secondary-200', lightenColor(secondaryHsl, 25));
      root.style.setProperty('--secondary-300', lightenColor(secondaryHsl, 15));
      root.style.setProperty('--secondary-400', lightenColor(secondaryHsl, 8));
      root.style.setProperty('--secondary-500', secondaryHsl);
      root.style.setProperty('--secondary-600', darkenColor(secondaryHsl, 8));
      root.style.setProperty('--secondary-700', darkenColor(secondaryHsl, 15));
      root.style.setProperty('--secondary-800', darkenColor(secondaryHsl, 25));
      root.style.setProperty('--secondary-900', darkenColor(secondaryHsl, 35));
      
      // Apply accent variations
      root.style.setProperty('--accent-50', lightenColor(accentHsl, 45));
      root.style.setProperty('--accent-100', lightenColor(accentHsl, 35));
      root.style.setProperty('--accent-200', lightenColor(accentHsl, 25));
      root.style.setProperty('--accent-300', lightenColor(accentHsl, 15));
      root.style.setProperty('--accent-400', lightenColor(accentHsl, 8));
      root.style.setProperty('--accent-500', accentHsl);
      root.style.setProperty('--accent-600', darkenColor(accentHsl, 8));
      root.style.setProperty('--accent-700', darkenColor(accentHsl, 15));
      root.style.setProperty('--accent-800', darkenColor(accentHsl, 25));
      root.style.setProperty('--accent-900', darkenColor(accentHsl, 35));
      
      // Update ring colors for focus states
      root.style.setProperty('--ring', primaryHsl);
      
      // Update border colors
      root.style.setProperty('--border', lightenColor(primaryHsl, 30));
      root.style.setProperty('--input', lightenColor(primaryHsl, 35));
      
      // Update muted colors based on primary
      root.style.setProperty('--muted', lightenColor(primaryHsl, 40));
      root.style.setProperty('--muted-foreground', darkenColor(primaryHsl, 20));
      
      // Apply custom CSS if provided
      if (settings.appearance.customCSS) {
        let customStyleElement = document.getElementById('custom-website-styles');
        if (!customStyleElement) {
          customStyleElement = document.createElement('style');
          customStyleElement.id = 'custom-website-styles';
          document.head.appendChild(customStyleElement);
        }
        customStyleElement.textContent = settings.appearance.customCSS;
      }
      
      setAppliedSettings(settings);
    }
  }, [settings]);

  // Update document title and meta description
  useEffect(() => {
    if (settings) {
      document.title = settings.siteName;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.siteDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.siteDescription;
        document.head.appendChild(meta);
      }
      
      // Update favicon if provided
      if (settings.appearance?.faviconUrl) {
        let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = settings.appearance.faviconUrl;
      }
    }
  }, [settings]);

  const contextValue: SettingsContextType = {
    settings: appliedSettings,
    isLoading,
    error,
    refetch,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Utility function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return { r, g, b };
}

// Utility function to lighten HSL color
function lightenColor(hsl: string, amount: number): string {
  const [h, s, l] = hsl.split(' ').map((val, index) => {
    if (index === 0) return parseInt(val);
    return parseInt(val.replace('%', ''));
  });
  
  const newL = Math.min(100, l + amount);
  return `${h} ${s}% ${newL}%`;
}

// Utility function to darken HSL color
function darkenColor(hsl: string, amount: number): string {
  const [h, s, l] = hsl.split(' ').map((val, index) => {
    if (index === 0) return parseInt(val);
    return parseInt(val.replace('%', ''));
  });
  
  const newL = Math.max(0, l - amount);
  return `${h} ${s}% ${newL}%`;
}

// Hook for getting specific setting values with defaults
export function useSetting<T>(
  path: string,
  defaultValue: T
): T {
  const { settings } = useSettings();
  
  if (!settings) return defaultValue;
  
  // Navigate through the settings object using dot notation
  const keys = path.split('.');
  let value: any = settings;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value !== undefined ? value : defaultValue;
}

// Hook for checking if maintenance mode is enabled
export function useMaintenanceMode() {
  const maintenanceMode = useSetting('system.maintenanceMode', false);
  const maintenanceMessage = useSetting('system.maintenanceMessage', 'We are currently performing maintenance. Please check back soon.');
  
  return {
    isMaintenanceMode: maintenanceMode,
    maintenanceMessage,
  };
}

// Hook for getting site branding information
export function useSiteBranding() {
  const { settings } = useSettings();
  
  return {
    siteName: settings?.siteName || 'Zawa Solar Energy',
    siteDescription: settings?.siteDescription || 'Leading provider of sustainable solar energy solutions',
    siteUrl: settings?.siteUrl || 'https://zawasoler.com',
    logoUrl: settings?.appearance?.logoUrl,
    primaryColor: settings?.appearance?.primaryColor || '#7EC4CF',
    secondaryColor: settings?.appearance?.secondaryColor || '#FFB347',
    accentColor: settings?.appearance?.accentColor || '#4A90E2',
  };
}

// Hook for getting email configuration
export function useEmailConfig() {
  const { settings } = useSettings();
  
  return {
    emailConfig: settings?.emailConfig,
    isConfigured: !!(settings?.emailConfig?.smtpUser && settings?.emailConfig?.smtpPassword),
  };
}

// Hook for getting system settings
export function useSystemSettings() {
  const { settings } = useSettings();
  
  return {
    enableRegistration: settings?.system?.enableRegistration ?? true,
    enableEmailVerification: settings?.system?.enableEmailVerification ?? true,
    defaultUserRole: settings?.system?.defaultUserRole || 'user',
    maxFileUploadSize: settings?.system?.maxFileUploadSize || 10,
    allowedFileTypes: settings?.system?.allowedFileTypes || ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
  };
}

// Hook for getting security settings
export function useSecuritySettings() {
  const { settings } = useSettings();
  
  return {
    enableTwoFactor: settings?.security?.enableTwoFactor ?? false,
    sessionTimeout: settings?.security?.sessionTimeout || 60,
    maxLoginAttempts: settings?.security?.maxLoginAttempts || 5,
    lockoutDuration: settings?.security?.lockoutDuration || 15,
    enableCaptcha: settings?.security?.enableCaptcha ?? false,
    allowedDomains: settings?.security?.allowedDomains || [],
  };
}

// Hook for getting appearance settings
export function useAppearanceSettings() {
  const { settings } = useSettings();
  
  return {
    primaryColor: settings?.appearance?.primaryColor || '#7EC4CF',
    secondaryColor: settings?.appearance?.secondaryColor || '#FFB347',
    accentColor: settings?.appearance?.accentColor || '#4A90E2',
    logoUrl: settings?.appearance?.logoUrl,
    faviconUrl: settings?.appearance?.faviconUrl,
    customCSS: settings?.appearance?.customCSS,
  };
}

// Hook for getting dynamic styles based on appearance settings
export function useDynamicStyles() {
  const { primaryColor, secondaryColor, accentColor } = useAppearanceSettings();
  
  return {
    primaryColor,
    secondaryColor,
    accentColor,
    primaryHsl: hexToHsl(primaryColor),
    secondaryHsl: hexToHsl(secondaryColor),
    accentHsl: hexToHsl(accentColor),
    // Utility functions for inline styles
    getPrimaryStyle: (opacity = 1) => ({ color: primaryColor, opacity }),
    getSecondaryStyle: (opacity = 1) => ({ color: secondaryColor, opacity }),
    getAccentStyle: (opacity = 1) => ({ color: accentColor, opacity }),
    getPrimaryBgStyle: (opacity = 1) => ({ backgroundColor: primaryColor, opacity }),
    getSecondaryBgStyle: (opacity = 1) => ({ backgroundColor: secondaryColor, opacity }),
    getAccentBgStyle: (opacity = 1) => ({ backgroundColor: accentColor, opacity }),
    getPrimaryBorderStyle: (width = 1) => ({ borderColor: primaryColor, borderWidth: `${width}px` }),
    getSecondaryBorderStyle: (width = 1) => ({ borderColor: secondaryColor, borderWidth: `${width}px` }),
    getAccentBorderStyle: (width = 1) => ({ borderColor: accentColor, borderWidth: `${width}px` }),
  };
}

// Hook for getting CSS custom properties as an object (useful for inline styles)
export function useCSSVariables() {
  const { settings } = useSettings();
  
  if (!settings?.appearance) {
    return {};
  }
  
  const primaryHsl = hexToHsl(settings.appearance.primaryColor);
  const secondaryHsl = hexToHsl(settings.appearance.secondaryColor);
  const accentHsl = hexToHsl(settings.appearance.accentColor);
  
  return {
    '--primary-color': settings.appearance.primaryColor,
    '--secondary-color': settings.appearance.secondaryColor,
    '--accent-color': settings.appearance.accentColor,
    '--primary': primaryHsl,
    '--secondary': secondaryHsl,
    '--accent': accentHsl,
    '--primary-50': lightenColor(primaryHsl, 45),
    '--primary-100': lightenColor(primaryHsl, 35),
    '--primary-200': lightenColor(primaryHsl, 25),
    '--primary-300': lightenColor(primaryHsl, 15),
    '--primary-400': lightenColor(primaryHsl, 8),
    '--primary-500': primaryHsl,
    '--primary-600': darkenColor(primaryHsl, 8),
    '--primary-700': darkenColor(primaryHsl, 15),
    '--primary-800': darkenColor(primaryHsl, 25),
    '--primary-900': darkenColor(primaryHsl, 35),
  } as React.CSSProperties;
}
