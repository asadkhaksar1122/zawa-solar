
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
import type { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { addCompany, updateCompany } from '@/app/admin/companies/actions';
import Swal from 'sweetalert2';

const companyFormSchema = z.object({
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  // Add other fields here if needed, e.g., logoUrl, description
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company | null;
  onFormSubmit?: () => void; // Callback to close dialog or navigate
}

export function CompanyForm({ company, onFormSubmit }: CompanyFormProps) {
  const router = useRouter();

  const defaultValues: Partial<CompanyFormValues> = company
    ? { name: company.name }
    : { name: '' };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: CompanyFormValues) {
    const formData = new FormData();
    formData.append('name', data.name);
    
    let result;
    if (company) {
      result = await updateCompany(company._id, formData);
    } else {
      result = await addCompany(formData);
    }

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: company ? 'Company Updated' : 'Company Added',
        text: result.message,
      });
      form.reset({ name: '' }); // Reset form after successful submission
      if (onFormSubmit) {
        onFormSubmit();
      } else {
        router.push('/admin/companies'); // Default navigation if no callback
      }
      router.refresh(); // Ensure the page re-fetches data
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Acme Solar Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more FormFields here for other company attributes */}
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Saving...' : (company ? 'Update Company' : 'Add Company')}
        </Button>
      </form>
    </Form>
  );
}
