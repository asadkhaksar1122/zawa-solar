
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

    try {
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
        setCustomError('Invalid email or password. Please try again.');
        return;
      }

      if (!checkResult.verified) {
        setCustomError('Please verify your email before logging in.');
        setShowResendOTP(true);
        setUserEmail(data.email);
        return;
      }

      // If email is verified, proceed with NextAuth login
      const result = await signIn('credentials', {
        redirect: false, // We'll handle redirect manually
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        setCustomError('Login failed. Please try again.');
      } else if (result?.ok) {
        // Login successful
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          router.push(callbackUrl); // Redirect to the intended page or dashboard
          router.refresh(); // Refresh to update session state in header
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
