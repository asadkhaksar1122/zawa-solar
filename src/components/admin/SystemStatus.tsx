'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSystemSettings, useMaintenanceMode, useEmailConfig } from '@/contexts/SettingsContext';
import { 
  Server, 
  Users, 
  Mail, 
  Shield, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Upload,
  UserCheck,
  Construction
} from 'lucide-react';
import Link from 'next/link';

export function SystemStatus() {
  const systemSettings = useSystemSettings();
  const { isMaintenanceMode, maintenanceMessage } = useMaintenanceMode();
  const { isConfigured: isEmailConfigured } = useEmailConfig();

  const statusItems = [
    {
      title: 'Maintenance Mode',
      description: 'System maintenance status',
      icon: Construction,
      status: isMaintenanceMode ? 'warning' : 'success',
      value: isMaintenanceMode ? 'Active' : 'Inactive',
      details: isMaintenanceMode ? maintenanceMessage : 'System is operational',
    },
    {
      title: 'User Registration',
      description: 'New user signup availability',
      icon: UserCheck,
      status: systemSettings.enableRegistration ? 'success' : 'inactive',
      value: systemSettings.enableRegistration ? 'Enabled' : 'Disabled',
      details: systemSettings.enableRegistration 
        ? 'Users can create new accounts' 
        : 'New registrations are blocked',
    },
    {
      title: 'Email Verification',
      description: 'Email verification requirement',
      icon: Mail,
      status: systemSettings.enableEmailVerification ? 'success' : 'inactive',
      value: systemSettings.enableEmailVerification ? 'Required' : 'Optional',
      details: systemSettings.enableEmailVerification 
        ? 'Users must verify their email' 
        : 'Email verification is optional',
    },
    {
      title: 'Email Configuration',
      description: 'SMTP email service status',
      icon: Mail,
      status: isEmailConfigured ? 'success' : 'error',
      value: isEmailConfigured ? 'Configured' : 'Not Configured',
      details: isEmailConfigured 
        ? 'Email service is ready' 
        : 'SMTP settings need configuration',
    },
    {
      title: 'File Upload Limit',
      description: 'Maximum file size allowed',
      icon: Upload,
      status: 'info',
      value: `${systemSettings.maxFileUploadSize}MB`,
      details: `Files up to ${systemSettings.maxFileUploadSize}MB can be uploaded`,
    },
    {
      title: 'Allowed File Types',
      description: 'Permitted file extensions',
      icon: FileText,
      status: 'info',
      value: `${systemSettings.allowedFileTypes.length} types`,
      details: systemSettings.allowedFileTypes.join(', ').toUpperCase(),
    },
    {
      title: 'Default User Role',
      description: 'Role assigned to new users',
      icon: Users,
      status: 'info',
      value: systemSettings.defaultUserRole,
      details: `New users are assigned "${systemSettings.defaultUserRole}" role`,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'inactive':
        return <Clock className="h-4 w-4" />;
      case 'info':
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  // Count critical issues
  const criticalIssues = statusItems.filter(item => 
    item.status === 'error' || (item.status === 'warning' && item.title === 'Maintenance Mode')
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Status Overview
          </CardTitle>
          <CardDescription>
            Current status of system settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {criticalIssues === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="font-medium">
                  {criticalIssues === 0 ? 'All Systems Operational' : `${criticalIssues} Issue${criticalIssues > 1 ? 's' : ''} Detected`}
                </span>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/setting">
                <Settings className="h-4 w-4 mr-2" />
                Manage Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {isMaintenanceMode && (
        <Alert variant="destructive">
          <Construction className="h-4 w-4" />
          <AlertDescription>
            <strong>Maintenance Mode Active:</strong> {maintenanceMessage}
          </AlertDescription>
        </Alert>
      )}

      {!isEmailConfigured && (
        <Alert variant="destructive">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Email Not Configured:</strong> SMTP settings are required for user registration and notifications.{' '}
            <Link href="/admin/setting" className="underline">
              Configure now
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusItems.map((item, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(item.status)}
                >
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{item.value}</span>
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {item.details}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common system management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/setting?tab=system">
                <Construction className="h-4 w-4 mr-2" />
                Toggle Maintenance
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/setting?tab=email">
                <Mail className="h-4 w-4 mr-2" />
                Configure Email
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/setting?tab=system">
                <Users className="h-4 w-4 mr-2" />
                User Settings
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/setting?tab=security">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}