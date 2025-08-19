'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
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

const resendFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
});

type ResendFormValues = z.infer<typeof resendFormSchema>;

export default function ResendVerificationPage() {
  const router = useRouter();
  const [customError, setCustomError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(resendFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ResendFormValues) {
    setCustomError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setCustomError('No account found with this email address. Please sign up first.');
        } else if (result.message?.includes('already verified')) {
          setCustomError('This email is already verified. You can log in directly.');
        } else {
          setCustomError(result.message || 'Failed to send verification email.');
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: result.message || 'Failed to send verification email.',
        });
      } else {
        setSuccessMessage('Verification email sent successfully! Please check your inbox.');
        
        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'A new verification code has been sent to your email.',
        }).then(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
        });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setCustomError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Resend Error',
        text: errorMessage,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-headline text-2xl">Resend Verification</CardTitle>
          <CardDescription>
            Enter your email address to receive a new verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{customError}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              📧 What happens next?
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• We'll send a 6-digit verification code to your email</li>
              <li>• The code expires in 10 minutes</li>
              <li>• Enter the code on the verification page</li>
              <li>• Once verified, you can log in normally</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
