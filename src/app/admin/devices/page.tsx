'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, Monitor, Smartphone, Tablet, Globe, Clock, Calendar, LogOut } from 'lucide-react';
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
      setError('');

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

      const targetSession = sessions.find(s => s._id === sessionId);
      const isCurrentSession = targetSession?.isCurrent;

      console.log('Target session:', targetSession);
      console.log('Is current session:', isCurrentSession);

      if (isCurrentSession) {
        // For current session, use NextAuth signOut which will trigger the cleanup
        console.log('Logging out current session from NextAuth');
        toast.success('Logging out from current device...');
        
        // Use a small delay to ensure the toast is shown
        setTimeout(async () => {
          try {
            await signOut({ 
              redirect: false,
              callbackUrl: '/auth/login'
            });
            router.push('/auth/login');
          } catch (signOutError) {
            console.error('Error during NextAuth signOut:', signOutError);
            // Fallback: try to remove session manually and redirect
            try {
              await fetch('/api/admin/devices', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
              });
            } catch (e) {
              console.error('Fallback session removal failed:', e);
            }
            router.push('/auth/login');
          }
        }, 500);
        return;
      }

      // For remote sessions, remove from database
      console.log('Removing remote session from database:', sessionId);
      const response = await fetch('/api/admin/devices', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const responseData = await response.json();
      console.log('DELETE response:', responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || 'Failed to logout from device');
      }

      toast.success('Device logged out successfully');
      await fetchSessions();
      setError('');
    } catch (err) {
      console.error('Error during logout:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to logout device');
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

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch (e) {
      return 'Invalid';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch (e) {
      return '--:--';
    }
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
    return 'Unknown Browser';
  };

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes('iPhone')) return 'iPhone';
    if (userAgent.includes('iPad')) return 'iPad';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown Device';
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('iPhone') || userAgent.includes('Android'))
      return <Smartphone className="h-4 w-4" />;
    if (userAgent.includes('iPad'))
      return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">Logged In Devices</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Logged In Devices</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {sessions.length} {sessions.length === 1 ? 'Device' : 'Devices'}
            </Badge>
          </div>
          {sessions.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              You are currently logged in on {sessions.length} {sessions.length === 1 ? 'device' : 'devices'}. 
              You can log out from any device by clicking the "Log Out" button.
            </p>
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block overflow-x-auto">
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
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.userAgent)}
                          <span>{getDeviceInfo(session.userAgent)}</span>
                          {session.isCurrent && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Current
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getBrowserInfo(session.userAgent)}</TableCell>
                      <TableCell>{session.ipAddress}</TableCell>
                      <TableCell>{formatDate(session.lastAccessedAt)}</TableCell>
                      <TableCell>{formatDate(session.createdAt)}</TableCell>
                      <TableCell>
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
                            session.isCurrent ? 'Log Out (Current)' : 'Log Out'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">
                No devices found
              </div>
            ) : (
              sessions.map((session) => (
                <Card key={session._id} className={`${session.isCurrent ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
                  <CardContent className="p-3 sm:p-4">
                    {/* Device Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getDeviceIcon(session.userAgent)}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base truncate">
                            {getDeviceInfo(session.userAgent)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getBrowserInfo(session.userAgent)}
                          </div>
                        </div>
                      </div>
                      {session.isCurrent && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs shrink-0">
                          Current
                        </Badge>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">IP:</span>
                        <span className="font-mono truncate">{session.ipAddress}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Last active:</span>
                        <span className="truncate">
                          <span className="sm:hidden">{formatDateShort(session.lastAccessedAt)} {formatTime(session.lastAccessedAt)}</span>
                          <span className="hidden sm:inline">{formatDate(session.lastAccessedAt)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">First seen:</span>
                        <span className="truncate">
                          <span className="sm:hidden">{formatDateShort(session.createdAt)} {formatTime(session.createdAt)}</span>
                          <span className="hidden sm:inline">{formatDate(session.createdAt)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                      onClick={() => handleLogout(session._id)}
                      disabled={logoutLoading === session._id || loading}
                    >
                      {logoutLoading === session._id ? (
                        <>
                          <Loader2 className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                          {session.isCurrent ? 'Log Out (Current)' : 'Log Out'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}