'use client';

import { CardDescription, CardTitle } from '@/components/ui/card';
import { EmailConfigurationForm } from '@/components/admin/settings/EmailConfigurationForm';
import { useSettingsForm } from '@/contexts/SettingsFormContext';

export default function EmailSettingsPage() {
  const { settings, handleFormChange, isLoading } = useSettingsForm();

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-lg mb-2">Email Configuration</CardTitle>
        <CardDescription>
          Set up SMTP settings for sending emails from your application.
        </CardDescription>
      </div>
      <EmailConfigurationForm
        settings={settings ?? undefined}
        onChange={(data) => handleFormChange('emailConfig', data)}
        isLoading={isLoading}
      />
    </div>
  );
}
