'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Shield, AlertTriangle, Lock } from 'lucide-react';
import { CaptchaComponent } from './CaptchaComponent';
import { useSecurityContext } from '@/contexts/SecurityContext';

interface LoginAttemptInfo {
  attempts: number;
  maxAttempts: number;
  isLocked: boolean;
  lockoutTime?: number;
}

export function SecureLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { securitySettings } = useSecurityContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttemptInfo>({
    attempts: 0,
    maxAttempts: 5,
    isLocked: false
  });

  // Check for session expired message
  const sessionExpired = searchParams?.get('message') === 'session_expired';

  // Load login attempt info from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('loginAttempts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.lockoutTime && parsed.lockoutTime > Date.now()) {
          setLoginAttempts(parsed);
        } else {
          // Lockout expired, clear attempts
          localStorage.removeItem('loginAttempts');
        }
      } catch (error) {
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  // Update max attempts when security settings load
  useEffect(() => {
    if (securitySettings) {
      setLoginAttempts(prev => ({
        ...prev,
        maxAttempts: securitySettings.maxLoginAttempts
      }));
    }
  }, [securitySettings]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginAttempts.isLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    if (securitySettings?.enableCaptcha && !captchaValid) {
      setError('Please complete the security verification.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Failed login attempt
        const newAttempts = loginAttempts.attempts + 1;
        const isNowLocked = newAttempts >= loginAttempts.maxAttempts;
        
        const newLoginAttempts: LoginAttemptInfo = {
          attempts: newAttempts,
          maxAttempts: loginAttempts.maxAttempts,
          isLocked: isNowLocked,
          lockoutTime: isNowLocked 
            ? Date.now() + (securitySettings?.lockoutDuration || 15) * 60 * 1000 
            : undefined
        };

        setLoginAttempts(newLoginAttempts);
        localStorage.setItem('loginAttempts', JSON.stringify(newLoginAttempts));

        if (isNowLocked) {
          setError(`Too many failed attempts. Account locked for ${securitySettings?.lockoutDuration || 15} minutes.`);
        } else {
          const remaining = loginAttempts.maxAttempts - newAttempts;
          setError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
        }
      } else {
        // Successful login
        localStorage.removeItem('loginAttempts');
        router.push('/admin');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!loginAttempts.lockoutTime) return 0;
    return Math.max(0, Math.ceil((loginAttempts.lockoutTime - Date.now()) / 1000 / 60));
  };

  const remainingLockoutMinutes = getRemainingLockoutTime();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Shield className="h-6 w-6" />
          Secure Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the admin panel
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Session Expired Warning */}
        {sessionExpired && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your session has expired due to inactivity. Please log in again.
            </AlertDescription>
          </Alert>
        )}

        {/* Account Locked Warning */}
        {loginAttempts.isLocked && remainingLockoutMinutes > 0 && (
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Account temporarily locked. Try again in {remainingLockoutMinutes} minute{remainingLockoutMinutes !== 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
        )}

        {/* Login Attempts Warning */}
        {loginAttempts.attempts > 0 && !loginAttempts.isLocked && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {loginAttempts.maxAttempts - loginAttempts.attempts} login attempt{loginAttempts.maxAttempts - loginAttempts.attempts !== 1 ? 's' : ''} remaining
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || loginAttempts.isLocked}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || loginAttempts.isLocked}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || loginAttempts.isLocked}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* CAPTCHA */}
          {securitySettings?.enableCaptcha && (
            <CaptchaComponent
              onVerify={setCaptchaValid}
              disabled={isLoading || loginAttempts.isLocked}
            />
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading || 
              loginAttempts.isLocked || 
              (securitySettings?.enableCaptcha && !captchaValid)
            }
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Security Features Info */}
        {securitySettings && (
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Features Active
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {securitySettings.enableCaptcha && (
                <li>• CAPTCHA verification required</li>
              )}
              <li>• Maximum {securitySettings.maxLoginAttempts} login attempts</li>
              <li>• {securitySettings.lockoutDuration} minute lockout after failed attempts</li>
              <li>• Session timeout: {securitySettings.sessionTimeout} minutes</li>
              {securitySettings.enableTwoFactor && (
                <li>• Two-factor authentication enabled</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}