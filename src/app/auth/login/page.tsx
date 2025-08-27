
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CaptchaComponent } from '@/components/security/CaptchaComponent';
import { useSecuritySettings } from '@/contexts/SettingsContext';

const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [customError, setCustomError] = useState<string | null>(null);
  const [showResendOTP, setShowResendOTP] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [captchaValid, setCaptchaValid] = useState(false);

  const { enableCaptcha } = useSecuritySettings();
  const { maxLoginAttempts, lockoutDuration } = useSecuritySettings();


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setCustomError(null); // Clear previous custom errors
    setShowResendOTP(false);

    // Check lockout state for this email
    const attemptKey = `loginAttempts:${data.email}`;
    try {
      const stored = localStorage.getItem(attemptKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isLocked && parsed.lockoutTime && parsed.lockoutTime > Date.now()) {
          const minutesLeft = Math.ceil((parsed.lockoutTime - Date.now()) / 1000 / 60);
          setCustomError(`Account locked due to too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`);
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    try {
      if (enableCaptcha && !captchaValid) {
        setCustomError('Please complete the CAPTCHA verification.');
        return;
      }
      // First, check email verification status
      const checkResponse = await fetch('/api/auth/check-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.userExists || !checkResult.credentialsValid) {
        // Increment failed attempt counter for this email
        try {
          const attemptKey = `loginAttempts:${data.email}`;
          const stored = localStorage.getItem(attemptKey);
          let parsed = stored ? JSON.parse(stored) : { attempts: 0, maxAttempts: maxLoginAttempts || 5 };
          parsed.attempts = (parsed.attempts || 0) + 1;
          parsed.maxAttempts = maxLoginAttempts || 5;
          if (parsed.attempts >= (parsed.maxAttempts || 5)) {
            parsed.isLocked = true;
            parsed.lockoutTime = Date.now() + ((lockoutDuration || 15) * 60 * 1000);
          }
          localStorage.setItem(attemptKey, JSON.stringify(parsed));
        } catch (e) {
          // ignore storage errors
        }

        setCustomError('Invalid email or password. Please try again.');
        return;
      }

      if (!checkResult.verified) {
        setCustomError('Please verify your email before logging in.');
        setShowResendOTP(true);
        setUserEmail(data.email);
        return;
      }

      // Check if user is admin and needs 2FA
      if (checkResult.isAdmin && checkResult.twoFactorEnabled) {
        // Send 2FA OTP
        const otpResponse = await fetch('/api/auth/send-2fa-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email }),
        });

        if (otpResponse.ok) {
          router.push(`/auth/two-factor?email=${encodeURIComponent(data.email)}`);
          return;
        } else {
          setCustomError('Failed to send 2FA code. Please try again.');
          return;
        }
      }

      // If email is verified, proceed with NextAuth login
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        // Increment failed attempt counter for this email (on signIn failure)
        try {
          const attemptKey = `loginAttempts:${data.email}`;
          const stored = localStorage.getItem(attemptKey);
          let parsed = stored ? JSON.parse(stored) : { attempts: 0, maxAttempts: maxLoginAttempts || 5 };
          parsed.attempts = (parsed.attempts || 0) + 1;
          parsed.maxAttempts = maxLoginAttempts || 5;
          if (parsed.attempts >= (parsed.maxAttempts || 5)) {
            parsed.isLocked = true;
            parsed.lockoutTime = Date.now() + ((lockoutDuration || 15) * 60 * 1000);
          }
          localStorage.setItem(attemptKey, JSON.stringify(parsed));
        } catch (e) {
          // ignore storage errors
        }

        setCustomError('Login failed. Please try again.');
      } else if (result?.ok) {
        // Clear attempt counter on success
        try {
          const attemptKey = `loginAttempts:${data.email}`;
          localStorage.removeItem(attemptKey);
        } catch (e) { }

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push(callbackUrl);
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setCustomError('An unexpected error occurred. Please try again.');
    }
  }

  async function handleResendOTP() {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: result.message || 'Failed to resend OTP.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: 'A new verification code has been sent to your email.',
        }).then(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(userEmail)}`);
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Resend Error',
        text: 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Log in to your Zawa Soler Energy  account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(error || customError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {customError || 'Login failed. Please check your credentials.'}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Render CAPTCHA when enabled in settings */}
            {enableCaptcha && (
              <div className="pt-2">
                <CaptchaComponent onVerify={setCaptchaValid} />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
              <Link href="/auth/resend-verification" className="text-sm text-primary hover:underline">
                Resend verification
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </Form>

        {showResendOTP && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              Your email is not verified. Please check your email for the verification code.
            </p>
            <Button
              variant="outline"
              onClick={handleResendOTP}
              className="w-full"
            >
              Resend Verification Code
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
