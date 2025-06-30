'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, UserX, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useGetUserQuery } from '@/lib/redux/api/contactApi';
import { removeadmin } from '@/app/admin/users/actions';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AdminTableProps {
  admins?: Admin[];
  refreshTrigger?: number;
}

export default function AdminTable({ admins = [], refreshTrigger = 0 }: AdminTableProps) {
  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [adminList, setAdminList] = useState<Admin[]>([]);

  useEffect(() => {
    if (data) {
      // Transform API data to match our Admin interface
      // Filter out password and map _id to id
      const transformedData: Admin[] = Array.isArray(data)
        ? data.map((user: ApiUser) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }))
        : data._id
          ? [{
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          }]
          : [];

      // Filter only admin users if needed
      const adminUsers = transformedData.filter(user => user.role === 'admin');
      setAdminList(adminUsers);
    }
  }, [data]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleRemoveAdmin = async (admin: Admin) => {
    const result = await Swal.fire({
      title: 'Remove Admin?',
      text: `Are you sure you want to remove ${admin.name} from admin privileges?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove admin',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {

      let result = await removeadmin(admin.id)
      if (result.success) {
        setAdminList(prev => prev.filter(a => a.id !== admin.id));
        Swal.fire('Removed!', `${admin.name} has been removed from admin privileges.`, 'success');
      } else {
        Swal.fire('error!', `${result.message || "Internel server error"} `, 'error');
      }

    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          All Admins
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading admins...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error loading admins. Please try again later.</span>
          </div>
        ) : adminList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No admins found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminList.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {admin.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin)}
                          className="hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove Admin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {adminList.map((admin) => (
                <div key={admin.id} className="border rounded-lg p-4 space-y-3 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">{admin.name}</h3>
                      <p className="text-xs text-muted-foreground break-all">{admin.email}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                      {admin.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin)}
                      className="hover:bg-red-600 transition-colors text-xs px-2 py-1 h-7"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}