'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMaintenanceMode, useSiteBranding } from '@/contexts/SettingsContext';
import { Construction, Clock, RefreshCw, Mail, Phone } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export function MaintenanceMode({ children }: MaintenanceModeProps) {
  const { isMaintenanceMode, maintenanceMessage } = useMaintenanceMode();
  const { siteName } = useSiteBranding();

  // If maintenance mode is not enabled, render children normally
  if (!isMaintenanceMode) {
    return <>{children}</>;
  }

  // Render maintenance mode page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo iconSize={60} textSize="text-3xl" />
        </div>

        {/* Main maintenance card */}
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Construction className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              We&apos;ll be back soon!
            </CardTitle>
            <CardDescription className="text-lg">
              {siteName} is currently undergoing maintenance
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Maintenance message */}
            <Alert className="border-primary/20 bg-primary/5">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-base leading-relaxed">
                {maintenanceMessage}
              </AlertDescription>
            </Alert>

            {/* What's happening */}
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                What&apos;s happening?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>We&apos;re performing scheduled maintenance to improve your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Our team is working hard to get everything back online</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>All your data is safe and will be available when we return</span>
                </li>
              </ul>
            </div>

            {/* Contact information */}
            <div className="bg-accent/5 border border-accent/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Need immediate assistance?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="mailto:support@zawasoler.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="tel:+1234567890">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
              </div>
            </div>

            {/* Refresh button */}
            <div className="text-center pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="gap-2"
                size="lg"
              >
                <RefreshCw className="h-4 w-4" />
                Check Again
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>Thank you for your patience while we make improvements!</p>
              <p className="mt-1">© 2024 {siteName}. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>This page will automatically refresh when maintenance is complete.</p>
        </div>
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh every 30 seconds to check if maintenance is over
            setTimeout(function() {
              window.location.reload();
            }, 30000);
          `,
        }}
      />
    </div>
  );
}