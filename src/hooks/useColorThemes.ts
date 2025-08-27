'use client';

import { useState, useEffect } from 'react';

export interface ColorTheme {
  _id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export function useColorThemes() {
  const [themes, setThemes] = useState<ColorTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch themes
  const fetchThemes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/color-themes');
      const data = await response.json();
      
      if (response.ok) {
        setThemes(data.themes);
      } else {
        setError(data.message || 'Failed to fetch themes');
      }
    } catch (err) {
      setError('Failed to fetch themes');
      console.error('Error fetching themes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create theme
  const createTheme = async (themeData: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  }) => {
    try {
      const response = await fetch('/api/color-themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchThemes(); // Refresh themes list
        return { success: true, theme: data.theme };
      } else {
        return { success: false, error: data.message || 'Failed to create theme' };
      }
    } catch (err) {
      console.error('Error creating theme:', err);
      return { success: false, error: 'Failed to create theme' };
    }
  };

  // Delete theme
  const deleteTheme = async (themeId: string) => {
    try {
      const response = await fetch(`/api/color-themes?id=${themeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await fetchThemes(); // Refresh themes list
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Failed to delete theme' };
      }
    } catch (err) {
      console.error('Error deleting theme:', err);
      return { success: false, error: 'Failed to delete theme' };
    }
  };

  // Load themes on mount
  useEffect(() => {
    fetchThemes();
  }, []);

  return {
    themes,
    isLoading,
    error,
    fetchThemes,
    createTheme,
    deleteTheme,
  };
}