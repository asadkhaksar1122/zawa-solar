'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useCreateCompanyMutation, useUpdateCompanyMutation } from '@/lib/redux/api/companiesApi';
import { Loader2, AlertCircle } from 'lucide-react';

const companyFormSchema = z.object({
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  // Add other fields here if needed, e.g., logoUrl, description
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company | null;
  onFormSubmit?: () => void; // Callback to close dialog or navigate
  imageUrl?: string; // Added to receive the Cloudinary image URL
}

export function CompanyForm({ company, onFormSubmit, imageUrl }: CompanyFormProps) {
  const router = useRouter();
  const [createCompany, { isLoading: isCreating, error }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isEditing, error: editingError }] = useUpdateCompanyMutation();

  const defaultValues: Partial<CompanyFormValues> = company
    ? { name: company.name }
    : { name: '' };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: CompanyFormValues) {
    try {
      if (company) {
        // Update existing company
        const result = await updateCompany({ _id: company._id, name: data.name }).unwrap();

        Swal.fire({
          icon: 'success',
          title: 'Company Updated',
          text: `Company "${result.name}" has been updated successfully!`,
        });

        if (onFormSubmit) {
          onFormSubmit();
        } else {
          router.push('/admin/companies');
        }
        router.refresh();
        return;
      }

      // Create new company
      const result = await createCompany({ name: data.name }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Company Added',
        text: `Company "${result.name}" has been created successfully!`,
      });

      form.reset({ name: '' });

      if (onFormSubmit) {
        onFormSubmit();
      } else {
        router.push('/admin/companies');
      }
      router.refresh();

    } catch (error) {
      console.error('Error submitting company:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: company
          ? 'Failed to update company. Please try again.'
          : 'Failed to create company. Please try again.',
      });
    }
  }

  // Get error message from RTK Query error
  const getErrorMessage = (error: any) => {
    if (error?.data?.message) {
      return error.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  // Disable form if creating or editing
  const isSubmitting = isCreating || isEditing || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Display API Error for create */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage(error)}
            </AlertDescription>
          </Alert>
        )}

        {/* Display API Error for edit */}
        {editingError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage(editingError)}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="E.g., Acme Solar Inc."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add more FormFields here for other company attributes */}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {company ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            company ? 'Update Company' : 'Add Company'
          )}
        </Button>
      </form>
    </Form>
  );
}