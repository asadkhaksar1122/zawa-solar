'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import Swal from 'sweetalert2';

const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits.' })
    .regex(/^\d+$/, { message: 'OTP must contain only numbers.' }),
});

type OTPFormValues = z.infer<typeof otpFormSchema>;

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [customError, setCustomError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(data: OTPFormValues) {
    setCustomError(null);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCustomError(result.message || 'An error occurred during verification.');
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: result.message || 'An error occurred.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Email Verified!',
          text: 'Your email has been verified successfully. You can now log in.',
        }).then(() => {
          router.push('/auth/login');
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setCustomError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: errorMessage,
      });
    }
  }

  async function handleResendOTP() {
    setIsResending(true);
    setCustomError(null);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCustomError(result.message || 'Failed to resend OTP.');
        Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: result.message || 'Failed to resend OTP.',
        });
      } else {
        setCountdown(60); // 60 seconds countdown
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: 'A new verification code has been sent to your email.',
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setCustomError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Resend Error',
        text: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to<br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{customError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        {...field}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={isResending || countdown > 0}
              className="w-full"
            >
              {isResending
                ? 'Sending...'
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : 'Resend Code'
              }
            </Button>

            <p className="text-sm text-muted-foreground">
              Wrong email address?{' '}
              <Link href="/auth/resend-verification" className="font-medium text-primary hover:underline">
                Use different email
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
