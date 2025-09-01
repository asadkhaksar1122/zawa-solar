'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast, Toaster } from 'sonner';

interface UserSession {
  _id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastAccessedAt: string;
  isCurrent: boolean;
}

export default function DevicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logoutLoading, setLogoutLoading] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Fetch sessions data
    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status, session, router]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      const response = await fetch('/api/admin/devices');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch sessions');
      }
      
      const data = await response.json();
      console.log('Received sessions data:', data);
      
      if (Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        console.error('Sessions data is not an array:', data);
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load device information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (sessionId: string) => {
    try {
      setLogoutLoading(sessionId);
      console.log('Logging out session:', sessionId);
      
      // Check if this is the current session
      const isCurrentSession = sessions.find(s => s._id === sessionId)?.isCurrent;
      
      if (isCurrentSession) {
        // For current session, use signOut to clear client-side session
        await signOut({ redirect: false });
        router.push('/auth/login');
        return; // No need to continue as we're redirecting
      }
      
      // For other sessions, delete the session from the database
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log('Logout response:', responseData);
      } catch (e) {
        console.error('Error parsing response:', e);
      }

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to logout from device');
      }
      
      // Show success message
      toast.success('Session removed successfully');
      
      // Refresh the sessions list
      await fetchSessions();

      setError(''); // Clear any previous errors on success
    } catch (err) {
      console.error('Error during logout:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLogoutLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getBrowserInfo = (userAgent: string) => {
    // Simple browser detection
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
    return 'Unknown Browser';
  };

  const getDeviceInfo = (userAgent: string) => {
    // Simple device detection
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown Device';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logged In Devices</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Card>
        <CardHeader>
          <CardTitle>Logged In Devices</CardTitle>
        </CardHeader>
        <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Last Accessed</TableHead>
              <TableHead>First Seen</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No devices found
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session._id} className={session.isCurrent ? 'bg-muted/50' : ''}>
                  <TableCell>
                    {getDeviceInfo(session.userAgent)}
                    {session.isCurrent && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getBrowserInfo(session.userAgent)}</TableCell>
                  <TableCell>{session.ipAddress}</TableCell>
                  <TableCell>{formatDate(session.lastAccessedAt)}</TableCell>
                  <TableCell>{formatDate(session.createdAt)}</TableCell>
                  <TableCell>
                    {!session.isCurrent ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleLogout(session._id)}
                        disabled={logoutLoading === session._id || loading}
                      >
                        {logoutLoading === session._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging out
                          </>
                        ) : (
                          'Log Out'
                        )}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Current Session
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
