'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { SecuritySettings } from '@/lib/types';

interface SecurityContextType {
  securitySettings: SecuritySettings | null;
  isLoading: boolean;
  checkDomainAccess: (domain: string) => boolean;
  isSessionExpired: () => boolean;
  refreshSecuritySettings: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Fetch security settings
  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch('/api/website-settings');
      if (response.ok) {
        const data = await response.json();
        setSecuritySettings(data.security || null);
      }
    } catch (error) {
      console.error('Failed to fetch security settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if domain is allowed
  const checkDomainAccess = (domain: string): boolean => {
    if (!securitySettings || !securitySettings.allowedDomains.length) {
      return true; // No restrictions
    }
    
    return securitySettings.allowedDomains.some(allowedDomain => 
      domain.includes(allowedDomain) || allowedDomain === '*'
    );
  };

  // Check if session is expired based on activity
  const isSessionExpired = (): boolean => {
    if (!securitySettings || !session) return false;
    
    const timeoutMs = securitySettings.sessionTimeout * 60 * 1000;
    return (Date.now() - lastActivity) > timeoutMs;
  };

  // Update last activity
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Refresh security settings
  const refreshSecuritySettings = async () => {
    setIsLoading(true);
    await fetchSecuritySettings();
  };

  // Load security settings on mount
  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  // Track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Check session timeout periodically
  useEffect(() => {
    if (!securitySettings || !session) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        // Force logout due to inactivity
        window.location.href = '/auth/signin?message=session_expired';
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [securitySettings, session, lastActivity]);

  const value: SecurityContextType = {
    securitySettings,
    isLoading,
    checkDomainAccess,
    isSessionExpired,
    refreshSecuritySettings,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}