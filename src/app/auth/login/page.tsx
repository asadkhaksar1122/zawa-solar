
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setCustomError(null); // Clear previous custom errors
    const result = await signIn('credentials', {
      redirect: false, // We'll handle redirect manually
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        setCustomError('Invalid email or password. Please try again.');
      } else {
        setCustomError('Login failed. Please try again.');
      }
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
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Log in to your Zawa Energy Hub account.
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
                <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </Form>
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
