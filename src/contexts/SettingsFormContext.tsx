'use client';

import { createContext, useContext } from 'react';
import type { WebsiteSettings } from '@/lib/types';

interface SettingsFormContextType {
  settings: Partial<WebsiteSettings> | null;
  handleFormChange: (section: string, data: any) => void;
  isLoading: boolean;
}

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined);

export function SettingsFormProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SettingsFormContextType;
}) {
  return (
    <SettingsFormContext.Provider value={value}>
      {children}
    </SettingsFormContext.Provider>
  );
}

export function useSettingsForm() {
  const context = useContext(SettingsFormContext);
  if (context === undefined) {
    throw new Error('useSettingsForm must be used within a SettingsFormProvider');
  }
  return context;
}
