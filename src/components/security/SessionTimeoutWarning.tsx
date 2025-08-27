'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';
import { useSecurityContext } from '@/contexts/SecurityContext';

export function SessionTimeoutWarning() {
  const { data: session } = useSession();
  const { securitySettings } = useSecurityContext();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Update last activity time
  const updateActivity = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  // Extend session
  const extendSession = () => {
    updateActivity();
    setShowWarning(false);
  };

  // Force logout
  const forceLogout = () => {
    signOut({ callbackUrl: '/auth/signin?message=session_expired' });
  };

  // Track user activity
  useEffect(() => {
    if (!session || !securitySettings) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [session, securitySettings]);

  // Check session timeout
  useEffect(() => {
    if (!session || !securitySettings) return;

    const timeoutMs = securitySettings.sessionTimeout * 60 * 1000;
    const warningMs = Math.max(timeoutMs - 5 * 60 * 1000, timeoutMs * 0.8); // 5 min before or 80% of timeout

    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      const remaining = timeoutMs - timeSinceActivity;

      if (remaining <= 0) {
        // Session expired
        forceLogout();
      } else if (remaining <= (timeoutMs - warningMs)) {
        // Show warning
        setShowWarning(true);
        setTimeLeft(Math.ceil(remaining / 1000));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, securitySettings, lastActivity]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!session || !securitySettings || !showWarning) {
    return null;
  }

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session will expire soon due to inactivity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Time remaining: {formatTime(timeLeft)}</strong>
              <br />
              You will be automatically logged out when the timer reaches zero.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            <p>To continue your session:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Click "Stay Logged In" to extend your session</li>
              <li>Or perform any action on the page</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={forceLogout}
            className="flex-1"
          >
            Logout Now
          </Button>
          <Button
            onClick={extendSession}
            className="flex-1"
          >
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}