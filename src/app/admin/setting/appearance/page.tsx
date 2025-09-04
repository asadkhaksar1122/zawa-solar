'use client';

import { CardDescription, CardTitle } from '@/components/ui/card';
import { AppearanceSettingsForm } from '@/components/admin/settings/AppearanceSettingsForm';
import { ColorPreview } from '@/components/admin/settings/ColorPreview';
import { useSettingsForm } from '@/contexts/SettingsFormContext';

export default function AppearanceSettingsPage() {
  const { settings, handleFormChange, isLoading } = useSettingsForm();

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Appearance Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your website.
        </CardDescription>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppearanceSettingsForm
          settings={settings}
          onChange={(data) => handleFormChange('appearance', data)}
          isLoading={isLoading}
        />
        <ColorPreview />
      </div>
    </div>
  );
}
