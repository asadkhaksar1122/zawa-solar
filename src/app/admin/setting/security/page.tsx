'use client';

import { CardDescription, CardTitle } from '@/components/ui/card';
import { SecuritySettingsForm } from '@/components/admin/settings/SecuritySettingsForm';
import { useSettingsForm } from '@/contexts/SettingsFormContext';

export default function SecuritySettingsPage() {
  const { settings, handleFormChange, isLoading } = useSettingsForm();

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Security Settings</CardTitle>
        <CardDescription>
          Configure security options and access controls.
        </CardDescription>
      </div>
      <SecuritySettingsForm
        settings={settings}
        onChange={(data) => handleFormChange('security', data)}
        isLoading={isLoading}
      />
    </div>
  );
}
