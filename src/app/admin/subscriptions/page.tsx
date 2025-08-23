'use client';

import { useState } from 'react';
import { 
  useGetSubscriptionStatsQuery,
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useAdminAddSubscriptionMutation
} from '@/lib/redux/api/subscriptionApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Mail,
  Calendar,
  TrendingUp,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // State for add subscription dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // API hooks
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGetSubscriptionStatsQuery();
  const { 
    data: subscriptions, 
    isLoading: subscriptionsLoading, 
    error: subscriptionsError,
    refetch: refetchSubscriptions 
  } = useGetSubscriptionsQuery({ page, limit, status, search });

  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();
  const [addSubscription, { isLoading: isAdding }] = useAdminAddSubscriptionMutation();

  // Handle search
  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle status filter change
  const handleStatusChange = (newStatus: 'all' | 'active' | 'inactive') => {
    setStatus(newStatus);
    setPage(1);
  };

  // Handle subscription status toggle
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await updateSubscription({ 
        id, 
        isActive: !currentStatus 
      }).unwrap();
      
      toast.success(result.message);
      refetchStats();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update subscription');
    }
  };

  // Handle subscription deletion
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteSubscription({ id }).unwrap();
      toast.success(result.message);
      refetchStats();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete subscription');
    }
  };

  // Handle add new subscription
  const handleAddSubscription = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const result = await addSubscription({ email: newEmail.trim() }).unwrap();
      toast.success(result.message);
      setNewEmail('');
      setIsAddDialogOpen(false);
      refetchStats();
      refetchSubscriptions();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add subscription');
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const conversionRate = stats?.totalSubscriptions 
    ? ((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1)
    : '0';

  return (
    <div className="w-full min-w-0 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 min-w-0">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">Newsletter Subscriptions</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words">Manage and view newsletter subscription statistics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            onClick={() => {
              refetchStats();
              refetchSubscriptions();
            }}
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
            size="sm"
          >
            <Activity className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Refresh</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm" size="sm">
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Add Subscription</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-16px)] max-w-md mx-2">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Add New Subscription</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Add a new email address to the newsletter subscription list.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubscription()}
                  className="text-sm"
                />
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewEmail('');
                  }}
                  className="w-full sm:w-auto text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSubscription}
                  disabled={isAdding}
                  className="w-full sm:w-auto text-sm"
                >
                  {isAdding ? 'Adding...' : 'Add Subscription'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full min-w-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalSubscriptions || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">All time subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{stats?.activeSubscriptions || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Currently subscribed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-600">{stats?.inactiveSubscriptions || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">No longer subscribed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">{conversionRate}%</div>
            )}
            <p className="text-xs text-muted-foreground">Active vs total</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Management */}
      <Card className="w-full min-w-0">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg break-words">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Manage Subscriptions</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm break-words">
            View, edit, and manage all newsletter subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {/* Filters and Search */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 w-full min-w-0">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Search by email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-sm w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button onClick={handleSearch} variant="outline" className="w-full sm:w-auto text-sm">
                  <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Search</span>
                </Button>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[160px] text-sm">
                    <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          {subscriptionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : subscriptionsError ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load subscriptions</h3>
              <p className="text-muted-foreground mb-4">There was an error loading the subscription data.</p>
              <Button onClick={() => refetchSubscriptions()}>
                Try Again
              </Button>
            </div>
          ) : subscriptions?.data && subscriptions.data.length > 0 ? (
            <>
              <div className="space-y-3 sm:space-y-4 w-full min-w-0">
                {subscriptions.data.map((subscription) => (
                  <div key={subscription._id} className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors w-full min-w-0">
                    <div className="flex items-start gap-3 min-w-0 w-full">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        subscription.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base break-all">{subscription.email}</p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs">
                              {format(new Date(subscription.subscribedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <Badge variant="secondary" className="capitalize text-xs px-1 py-0">
                            {subscription.source}
                          </Badge>
                          {subscription.ipAddress && subscription.ipAddress !== 'admin-added' && (
                            <span className="text-xs hidden lg:inline break-all">IP: {subscription.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full">
                      <Badge variant={subscription.isActive ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(subscription._id, subscription.isActive)}
                        disabled={isUpdating}
                        className="text-xs px-2 py-1 h-7 flex-shrink-0"
                      >
                        {subscription.isActive ? 'Unsubscribe' : 'Reactivate'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 p-1 h-7 w-7 flex-shrink-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[calc(100vw-16px)] max-w-md mx-2">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base">Delete Subscription</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm break-words">
                              Are you sure you want to permanently delete this subscription for {subscription.email}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto text-sm">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(subscription._id)}
                              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {subscriptions.pagination.pages > 1 && (
                <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
                  <p className="text-xs text-muted-foreground text-center break-words">
                    Showing {((subscriptions.pagination.page - 1) * subscriptions.pagination.limit) + 1} to{' '}
                    {Math.min(subscriptions.pagination.page * subscriptions.pagination.limit, subscriptions.pagination.total)} of{' '}
                    {subscriptions.pagination.total} results
                  </p>
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(subscriptions.pagination.page - 1)}
                      disabled={subscriptions.pagination.page <= 1}
                      className="px-2 text-xs h-8 flex-shrink-0"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    <span className="text-xs px-2 py-1 bg-muted rounded whitespace-nowrap">
                      {subscriptions.pagination.page} / {subscriptions.pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(subscriptions.pagination.page + 1)}
                      disabled={subscriptions.pagination.page >= subscriptions.pagination.pages}
                      className="px-2 text-xs h-8 flex-shrink-0"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
              <p className="text-muted-foreground">
                {search ? 'No subscriptions match your search criteria.' : 'No subscriptions available yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}