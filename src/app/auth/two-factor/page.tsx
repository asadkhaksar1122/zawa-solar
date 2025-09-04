'use client';

import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TwoFactorPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push('/auth/login');
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, move to previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);

      // Focus the last filled input or the last input if all are filled
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (!email || otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-2fa-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification successful! Redirecting...');
        const result = await signIn('credentials', {
          email,
          password: 'verified',
          redirect: false,
        });

        if (result?.ok) {
          router.push('/admin');
        } else {
          setError('Login failed after verification');
          setSuccess('');
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || countdown > 0) return;

    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/send-2fa-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setCountdown(60);
        setSuccess('Code sent successfully! Check your email.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 dark:from-background dark:via-background dark:to-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-2xl border-0 dark:border dark:border-border">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-lg">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-headline font-bold">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the verification code sent to
              <span className="block font-medium text-foreground mt-1">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-1">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 animate-in fade-in-0 slide-in-from-top-1">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-300 ml-2">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={ref => { inputRefs.current[index] = ref; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={cn(
                      "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200",
                      "focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50",
                      digit
                        ? "border-primary-200 bg-primary-50 text-foreground dark:border-primary-800 dark:bg-primary-950/30"
                        : "border-border bg-background",
                      error && "border-destructive focus:border-destructive focus:ring-destructive/20"
                    )}
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className={cn(
                "w-full h-12 text-base font-medium transition-all duration-200",
                isComplete
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              disabled={isLoading || !isComplete}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">Didn't receive the code?</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isResending || countdown > 0}
                className="flex-1 h-11 transition-all duration-200 hover:bg-accent hover:text-accent-foreground border-border"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <span className="text-muted-foreground">Resend in {countdown}s</span>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/auth/login')}
                className="flex-1 h-11 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              For security reasons, this code will expire in 10 minutes.
              Please do not share this code with anyone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}