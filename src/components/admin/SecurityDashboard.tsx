'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Lock,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useSecurityContext } from '@/contexts/SecurityContext';

interface SecurityMetrics {
  totalLoginAttempts: number;
  failedLoginAttempts: number;
  lockedAccounts: number;
  activeSessions: number;
  securityLevel: 'Low' | 'Medium' | 'High';
  lastSecurityUpdate: string;
}

export function SecurityDashboard() {
  const { securitySettings, refreshSecuritySettings } = useSecurityContext();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalLoginAttempts: 0,
    failedLoginAttempts: 0,
    lockedAccounts: 0,
    activeSessions: 0,
    securityLevel: 'Medium',
    lastSecurityUpdate: new Date().toISOString()
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate security level based on settings
  const calculateSecurityLevel = () => {
    if (!securitySettings) return 'Low';
    
    let score = 0;
    if (securitySettings.enableTwoFactor) score += 2;
    if (securitySettings.enableCaptcha) score += 1;
    if (securitySettings.sessionTimeout <= 30) score += 1;
    if (securitySettings.maxLoginAttempts <= 3) score += 1;
    if (securitySettings.lockoutDuration >= 30) score += 1;
    if (securitySettings.allowedDomains.length > 0) score += 1;

    if (score >= 5) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  // Refresh security metrics
  const refreshMetrics = async () => {
    setIsRefreshing(true);
    try {
      // In a real app, this would fetch actual metrics from your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMetrics(prev => ({
        ...prev,
        securityLevel: calculateSecurityLevel(),
        lastSecurityUpdate: new Date().toISOString()
      }));
      
      await refreshSecuritySettings();
    } catch (error) {
      console.error('Failed to refresh security metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (securitySettings) {
      setMetrics(prev => ({
        ...prev,
        securityLevel: calculateSecurityLevel()
      }));
    }
  }, [securitySettings]);

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'High': return <CheckCircle className="h-4 w-4" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4" />;
      case 'Low': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!securitySettings) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading security settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshMetrics}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Level Overview */}
      <Alert className={`border-l-4 ${getSecurityLevelColor(metrics.securityLevel).replace('bg-', 'border-l-')}`}>
        <div className="flex items-center gap-2">
          {getSecurityLevelIcon(metrics.securityLevel)}
          <AlertDescription className="flex items-center justify-between w-full">
            <span>Current Security Level: <strong>{metrics.securityLevel}</strong></span>
            <Badge className={`${getSecurityLevelColor(metrics.securityLevel)} text-white`}>
              {metrics.securityLevel}
            </Badge>
          </AlertDescription>
        </div>
      </Alert>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Login Attempts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLoginAttempts}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.failedLoginAttempts}</div>
            <p className="text-xs text-muted-foreground">Blocked attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Accounts</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.lockedAccounts}</div>
            <p className="text-xs text-muted-foreground">Currently locked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Online users</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Two-Factor Authentication</span>
              <Badge variant={securitySettings.enableTwoFactor ? "default" : "secondary"}>
                {securitySettings.enableTwoFactor ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">CAPTCHA Protection</span>
              <Badge variant={securitySettings.enableCaptcha ? "default" : "secondary"}>
                {securitySettings.enableCaptcha ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Max Login Attempts</span>
              <Badge variant="outline">{securitySettings.maxLoginAttempts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lockout Duration</span>
              <Badge variant="outline">{securitySettings.lockoutDuration} min</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Session Timeout</span>
              <Badge variant="outline">{securitySettings.sessionTimeout} min</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Domain Restrictions</span>
              <Badge variant={securitySettings.allowedDomains.length > 0 ? "default" : "secondary"}>
                {securitySettings.allowedDomains.length > 0 ? `${securitySettings.allowedDomains.length} domains` : "None"}
              </Badge>
            </div>
            {securitySettings.allowedDomains.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Allowed domains:</span>
                <div className="flex flex-wrap gap-1">
                  {securitySettings.allowedDomains.map((domain) => (
                    <Badge key={domain} variant="outline" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
          <CardDescription>
            Suggestions to improve your security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!securitySettings.enableTwoFactor && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider enabling Two-Factor Authentication for enhanced security.
                </AlertDescription>
              </Alert>
            )}
            {!securitySettings.enableCaptcha && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Enable CAPTCHA to prevent automated attacks on login forms.
                </AlertDescription>
              </Alert>
            )}
            {securitySettings.sessionTimeout > 120 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider reducing session timeout to under 2 hours for better security.
                </AlertDescription>
              </Alert>
            )}
            {securitySettings.maxLoginAttempts > 5 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider reducing maximum login attempts to 5 or fewer.
                </AlertDescription>
              </Alert>
            )}
            {securitySettings.allowedDomains.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Consider restricting access to specific domains for additional security.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}