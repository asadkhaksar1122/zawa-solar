'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ContactSettings, ContactItem } from '@/lib/types';
import { contactSettingsData } from '@/lib/data';
import Swal from 'sweetalert2';
import { useGetContactSettingsQuery, usePutContactSettingsMutation } from '@/lib/redux/api/contactApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

// Type for API error response
interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(contactSettingsData);

  const { data, isLoading, error } = useGetContactSettingsQuery();
  const [putContactSettings, { isLoading: isupdating, error: updateerror }] = usePutContactSettingsMutation();

  useEffect(() => {
    if (isLoading) return;
    if (data && data[0]) {
      setSettings({
        ...data[0],
        whatsappNumbers: (data[0].whatsappNumbers || []).map((item: any) => ({ _id: item._id, value: item.number || item.value })),
        emailAddresses: (data[0].emailAddresses || []).map((item: any) => ({ _id: item._id, value: item.number || item.value })),
        phoneNumbers: (data[0].phoneNumbers || []).map((item: any) => ({ _id: item._id, value: item.number || item.value })),
      });
    }
  }, [data, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (listName: keyof ContactSettings, itemId: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [listName]: (prev[listName] as ContactItem[]).map(item =>
        item._id === itemId ? { ...item, value } : item
      ),
    }));
  };

  const addItem = (listName: keyof ContactSettings) => {
    const newItem: ContactItem = { _id: `${listName.slice(0, 2)}-${Date.now()}`, value: '' };
    setSettings(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as ContactItem[]), newItem],
    }));
  };

  const removeItem = (listName: keyof ContactSettings, itemId: string) => {
    setSettings(prev => ({
      ...prev,
      [listName]: (prev[listName] as ContactItem[]).filter(item => item._id !== itemId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: settings._id,
      whatsappNumbers: settings.whatsappNumbers.map(({ _id, value }) => ({ value })),
      emailAddresses: settings.emailAddresses.map(({ _id, value }) => ({ value })),
      phoneNumbers: settings.phoneNumbers.map(({ _id, value }) => ({ value })),
      facebookUrl: settings.facebookUrl,
      officeAddress: settings.officeAddress,
    };

    try {
      const result = await putContactSettings(payload).unwrap();
      Swal.fire('Success!', 'Contact settings updated successfully.', 'success');
      if (result) {
        setSettings(prev => ({
          ...prev,
          ...result,
          whatsappNumbers: (result.whatsappNumbers || []).map((item: any) => ({ _id: item._id, value: item.number })),
          emailAddresses: (result.emailAddresses || []).map((item: any) => ({ _id: item._id, value: item.number })),
          phoneNumbers: (result.phoneNumbers || []).map((item: any) => ({ _id: item._id, value: item.number })),
        }));
      }
    } catch (err) {
      let message = 'Failed to save settings.';
      const error = err as FetchBaseQueryError | SerializedError;

      if (isFetchBaseQueryError(error) && 'data' in error) {
        const apiError = error as ApiError;
        if (apiError.data?.message) {
          message = apiError.data.message;
        }
      }

      Swal.fire('Error!', message, 'error');
    }
  };

  const renderItemList = (
    listName: keyof Pick<ContactSettings, 'whatsappNumbers' | 'emailAddresses' | 'phoneNumbers'>,
    itemType: string
  ) => (
    <div className="space-y-3">
      {(settings[listName] as ContactItem[]).map((item, index) => (
        <div key={item._id} className="flex items-center gap-2">
          <Input
            type={itemType === 'email' ? 'email' : itemType === 'phone' ? 'tel' : 'text'}
            placeholder={`Enter ${itemType} #${index + 1}`}
            value={item.value}
            onChange={(e) => handleItemChange(listName, item._id, e.target.value)}
            className="flex-grow"
          />
          <Button variant="ghost" size="icon" onClick={() => removeItem(listName, item._id)} aria-label={`Remove ${itemType}`}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => addItem(listName)} className="gap-1">
        <PlusCircle className="h-4 w-4" /> Add {itemType}
      </Button>
    </div>
  );

  // Type guard for FetchBaseQueryError
  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
  }

  // Error message helper function
  const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
    if (!error) return '';

    if (isFetchBaseQueryError(error)) {
      return (error as ApiError).data?.message || 'An error occurred while fetching data';
    }

    return error.message || 'An error occurred';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading contact settings...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{getErrorMessage(error)}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h1 className="font-headline text-2xl font-semibold">Contact Page Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Numbers</CardTitle>
          <CardDescription>Manage WhatsApp contact numbers displayed on your site.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderItemList('whatsappNumbers', 'WhatsApp Number')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Addresses</CardTitle>
          <CardDescription>Manage email addresses for contact.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderItemList('emailAddresses', 'Email Address')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
          <CardDescription>Manage general phone contact numbers.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderItemList('phoneNumbers', 'Phone Number')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media & Address</CardTitle>
          <CardDescription>Manage other contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebookUrl">Facebook Profile URL</Label>
            <Input
              id="facebookUrl"
              name="facebookUrl"
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={settings.facebookUrl}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="officeAddress">Office Address</Label>
            <Input
              id="officeAddress"
              name="officeAddress"
              placeholder="123 Main St, City, Country"
              value={settings.officeAddress}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {updateerror && (
        <div className="text-red-500 px-6">
          {getErrorMessage(updateerror)}
        </div>
      )}

      <Card>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={isupdating}>
            {isupdating ? 'Saving...' : 'Save All Settings'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}