"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Box, Users, Activity, Shield } from "lucide-react";
import { useGetDashboardQuery } from "@/lib/redux/api/dashboardApi";
import { SystemStatus } from "@/components/admin/SystemStatus";
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";

export default function AdminDashboardPage() {
  const { data, error, isLoading } = useGetDashboardQuery();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-2xl font-semibold">Dashboard Overview</h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent>
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-2xl font-semibold">Dashboard Overview</h1>
        </div>
        <Card>
          <CardContent>
            <p className="text-center text-red-500">
              Error loading dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard with data
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Dashboard Overview</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.solutionCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {/* Hardcoded for now; update if API provides historical data */}
              +5 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.userCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {/* Hardcoded for now; update if API provides historical data */}
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              {/* Hardcoded for now; update if API provides historical data */}
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <SystemStatus />

      {/* Security Dashboard */}
      <SecurityDashboard />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Manage your solar solutions and platform settings.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/admin/solutions">Manage Solutions</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/solutions">Add New Solution</Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/admin/setting">
              <Shield className="h-4 w-4" />
              Security Settings
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}