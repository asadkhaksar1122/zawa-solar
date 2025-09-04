'use client';

import { CardDescription, CardTitle } from '@/components/ui/card';
import { SystemSettingsForm } from '@/components/admin/settings/SystemSettingsForm';
import { useSettingsForm } from '@/contexts/SettingsFormContext';

export default function SystemSettingsPage() {
  const { settings, handleFormChange, isLoading } = useSettingsForm();

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">System Settings</CardTitle>
        <CardDescription>
          Manage system-wide configurations and maintenance options.
        </CardDescription>
      </div>
      <SystemSettingsForm
        settings={settings ?? undefined}
        onChange={(data) => handleFormChange('system', data)}
        isLoading={isLoading}
      />
    </div>
  );
}
