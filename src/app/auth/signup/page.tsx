
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
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { useSystemSettings } from '@/contexts/SettingsContext';
import { useSecuritySettings } from '@/contexts/SettingsContext';
import { CaptchaComponent } from '@/components/security/CaptchaComponent';
import { AlertCircle } from 'lucide-react';

const signupFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [customError, setCustomError] = useState<string | null>(null);
  const { enableRegistration } = useSystemSettings();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { enableCaptcha } = useSecuritySettings();
  const [captchaValid, setCaptchaValid] = useState(false);

  // If registration is disabled, show message
  if (!enableRegistration) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Registration Disabled</CardTitle>
          <CardDescription>
            New user registration is currently disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Registration is currently disabled by the administrator. Please contact support if you need access.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  async function onSubmit(data: SignupFormValues) {
    setCustomError(null);
    if (enableCaptcha && !captchaValid) {
      setCustomError('Please complete the CAPTCHA verification.');
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCustomError(result.message || 'An error occurred during sign up.');
        Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed',
          text: result.message || 'An error occurred.',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Registration Initiated!',
          text: 'Please check your email for the verification code.',
        }).then(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setCustomError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Error',
        text: errorMessage,
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your details below to get started.
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {enableCaptcha && (
              <div className="pt-2">
                <CaptchaComponent onVerify={setCaptchaValid} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Need to verify your email?{' '}
          <Link href="/auth/resend-verification" className="font-medium text-primary hover:underline">
            Resend verification code
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
