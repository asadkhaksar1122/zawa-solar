
'use client';

import { useActionState, useEffect, useState } from 'react'; // Changed import
import { useFormState as useReactHookFormState, useFormStatus } from 'react-dom'; // Keep react-dom's useFormStatus
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
import { makeUserAdminAction } from './actions';
import Swal from 'sweetalert2';
import { Alert, AlertDescription } from '@/components/ui/alert';

const makeAdminFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type MakeAdminFormValues = z.infer<typeof makeAdminFormSchema>;

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Processing...' : 'Make Admin'}
    </Button>
  );
}

export default function ManageUsersPage() {
  const [formState, dispatchMakeUserAdminAction] = useActionState(makeUserAdminAction, initialState); // Updated hook
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
      } else {
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
        Swal.fire('Error!', formState.message, 'error');
      }
    }
  }, [formState, form]);


  const onSubmit = (data: MakeAdminFormValues) => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    const formData = new FormData();
    formData.append('email', data.email);
    dispatchMakeUserAdminAction(formData);
  };


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-2xl font-semibold">Manage Users</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Designate Admin</CardTitle>
          <CardDescription>
            Enter the email address of an existing user to grant them admin privileges.
            This action is currently simulated.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {showSuccessAlert && formState.success && (
                <Alert variant="default" className="bg-green-100 border-green-300 text-green-700">
                  <AlertDescription>{formState.message}</AlertDescription>
                </Alert>
              )}
              {showErrorAlert && !formState.success && (
                <Alert variant="destructive">
                  <AlertDescription>{formState.message}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="admin-email">User Email</FormLabel>
                    <FormControl>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Future sections for listing users, changing roles, etc. can be added here */}
    </div>
  );
}
