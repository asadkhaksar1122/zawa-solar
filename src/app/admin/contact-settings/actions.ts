'use server';

import type { ContactSettings } from '@/lib/types';
import { contactSettingsData as currentData } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function updateContactSettings(
  newSettings: ContactSettings
): Promise<{ success: boolean; message: string; settings?: ContactSettings }> {
  try {
    // In a real app, you'd save this to a database.
    // For this prototype, we update the in-memory object.
    // Important: This direct mutation won't work reliably in serverless environments for subsequent requests.
    // A proper database is needed for persistence.
    currentData.whatsappNumbers = newSettings.whatsappNumbers;
    currentData.emailAddresses = newSettings.emailAddresses;
    currentData.phoneNumbers = newSettings.phoneNumbers;
    currentData.facebookUrl = newSettings.facebookUrl;
    currentData.officeAddress = newSettings.officeAddress;

    console.log('Updated contact settings:', currentData);

    revalidatePath('/admin/contact-settings');
    revalidatePath('/contact'); // Revalidate public contact page
    revalidatePath('/api/contact-settings'); // Revalidate API route

    return { success: true, message: 'Contact settings updated successfully.', settings: currentData };
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return { success: false, message: 'Failed to update contact settings.' };
  }
}