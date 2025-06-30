
'use client';

import { useActionState, useEffect, useState, useTransition } from 'react'; // Changed import
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
import { makeadmin, makeUserAdminAction } from './actions';
import Swal from 'sweetalert2';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminTable from '@/components/AdminTable';

const makeAdminFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type MakeAdminFormValues = z.infer<typeof makeAdminFormSchema>;

const initialState = {
  message: '',
  success: false,
};

// Updated SubmitButton to take isPending prop
function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm">
      {isPending ? 'Processing...' : 'Make Admin'}
    </Button>
  );
}

export default function ManageUsersPage() {
  // Correctly destructure useActionState to get isPending
  const [formState, dispatchMakeUserAdminAction, isActionPending] = useActionState(makeUserAdminAction, initialState);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [, startTransition] = useTransition(); // For wrapping the action dispatch
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const form = useForm<MakeAdminFormValues>({
    resolver: zodResolver(makeAdminFormSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
        Swal.fire('Success!', formState.message, 'success');
        form.reset(); // Reset form on success
        setRefreshTrigger(prev => prev + 1); // Trigger table refresh
      } else {
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
        Swal.fire('Error!', formState.message, 'error');
      }
    }
  }, [formState, form]);


  const onSubmit = async (data: MakeAdminFormValues) => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    const formData = new FormData();
    formData.append('email', data.email);
    let result = await makeadmin(data.email)
    if (result.success) {
      formState.message = result.message;
      formState.success = true;
    } else {
      formState.message = result.message;
      formState.success = false;
    }
    console.log('Form data:', data);
    // Wrap the action dispatch in startTransition
    startTransition(() => {
      dispatchMakeUserAdminAction(formData);
    });
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="font-headline text-xl sm:text-2xl font-semibold">Manage Users</h1>

        <Card className="shadow-lg">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Designate Admin</CardTitle>
            <CardDescription className="text-sm">
              Enter the email address of an existing user to grant them admin privileges.
              This action is currently simulated.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 px-4 sm:px-6">
                {showSuccessAlert && formState.success && (
                  <Alert variant="default" className="bg-green-100 border-green-300 text-green-700">
                    <AlertDescription className="text-sm">{formState.message}</AlertDescription>
                  </Alert>
                )}
                {showErrorAlert && !formState.success && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{formState.message}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="admin-email" className="text-sm">User Email</FormLabel>
                      <FormControl>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="user@example.com"
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="px-4 sm:px-6">
                <SubmitButton isPending={isActionPending} />
              </CardFooter>
            </form>
          </Form>
        </Card>

        <AdminTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
