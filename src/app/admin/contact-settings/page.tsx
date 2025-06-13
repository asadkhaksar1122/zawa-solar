
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ContactSettings, ContactItem } from '@/lib/types';
import { contactSettingsData as initialContactSettings } from '@/lib/data'; // For initial state
import { updateContactSettings } from './actions';
import Swal from 'sweetalert2';

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(initialContactSettings);
  const [isLoading, setIsLoading] = useState(false);

  // For a real app with a DB, you might fetch initial settings here.
  // useEffect(() => {
  //   // async function fetchSettings() {
  //   //   const fetched = await getContactSettingsFromDB(); // Fictional function
  //   //   setSettings(fetched);
  //   // }
  //   // fetchSettings();
  //   setSettings(initialContactSettings); // Using mock data for now
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (listName: keyof ContactSettings, id: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [listName]: (prev[listName] as ContactItem[]).map(item =>
        item.id === id ? { ...item, value } : item
      ),
    }));
  };

  const addItem = (listName: keyof ContactSettings) => {
    const newItem: ContactItem = { id: `${listName.slice(0,2)}-${Date.now()}`, value: '' };
    setSettings(prev => ({
      ...prev,
      [listName]: [...(prev[listName] as ContactItem[]), newItem],
    }));
  };

  const removeItem = (listName: keyof ContactSettings, id: string) => {
    setSettings(prev => ({
      ...prev,
      [listName]: (prev[listName] as ContactItem[]).filter(item => item.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await updateContactSettings(settings);
    setIsLoading(false);
    if (result.success) {
      Swal.fire('Success!', result.message, 'success');
      if (result.settings) {
        // Update local state if server returns updated settings (good practice)
        setSettings(result.settings);
      }
    } else {
      Swal.fire('Error!', result.message || 'Failed to save settings.', 'error');
    }
  };
  
  const renderItemList = (listName: keyof Pick<ContactSettings, 'whatsappNumbers' | 'emailAddresses' | 'phoneNumbers'>, itemType: string) => (
    <div className="space-y-3">
      {(settings[listName] as ContactItem[]).map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            type={itemType === 'email' ? 'email' : itemType === 'phone' ? 'tel' : 'text'}
            placeholder={`Enter ${itemType} #${index + 1}`}
            value={item.value}
            onChange={(e) => handleItemChange(listName, item.id, e.target.value)}
            className="flex-grow"
          />
          <Button variant="ghost" size="icon" onClick={() => removeItem(listName, item.id)} aria-label={`Remove ${itemType}`}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => addItem(listName)} className="gap-1">
        <PlusCircle className="h-4 w-4" /> Add {itemType}
      </Button>
    </div>
  );


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
      
      <CardFooter className="border-t px-6 py-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </CardFooter>
    </form>
  );
}
