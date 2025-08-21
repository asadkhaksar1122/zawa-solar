'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useChangePasswordMutation } from "@/lib/redux/api/userApi";
import Swal from "sweetalert2";


// ---------------- CHANGE PASSWORD COMPONENT ----------------
const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [changePassword, { isLoading, isSuccess, isError, error }] = useChangePasswordMutation();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    await changePassword(data);
  };

    useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password changed successfully!',
      });
      form.reset();
    }
    if (isError) {
      onOpenChange(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: (error as any)?.data?.message || 'Something went wrong',
      }).then(() => {
        onOpenChange(true);
      });
    }
  }, [isSuccess, isError, error, form, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your old password and new password to update your account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword.old ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((s) => ({ ...s, old: !s.old }))}>
                        {showPassword.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword.new ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((s) => ({ ...s, new: !s.new }))}>
                        {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword.confirm ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword((s) => ({ ...s, confirm: !s.confirm }))}>
                        {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { onOpenChange(false); form.reset(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}