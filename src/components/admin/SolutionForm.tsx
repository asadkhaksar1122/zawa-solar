'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SolarSolution, CompanyCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addSolarSolution, updateSolarSolution } from '@/app/admin/solutions/actions';

const solutionFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  companyId: z.string({ required_error: "Please select a company." }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  powerOutput: z.string().optional(),
  efficiency: z.string().optional(),
  features: z.string().optional(), // Comma-separated string
  warranty: z.string().optional(),
});

type SolutionFormValues = z.infer<typeof solutionFormSchema>;

interface SolutionFormProps {
  solution?: SolarSolution | null;
  companies: CompanyCategory[];
  onFormSubmit?: () => void; // Callback to close dialog or navigate
}

export function SolutionForm({ solution, companies, onFormSubmit }: SolutionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const companyMap = new Map(companies.map(c => [c.id, c.name]));

  const defaultValues: Partial<SolutionFormValues> = solution
    ? {
        ...solution,
        features: solution.features?.join(', ') || '',
      }
    : {};

  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: SolutionFormValues) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('companyId', data.companyId);
    const companyName = companyMap.get(data.companyId) || "Unknown Company";
    formData.append('company', companyName);
    formData.append('description', data.description);
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
    if (data.powerOutput) formData.append('powerOutput', data.powerOutput);
    if (data.efficiency) formData.append('efficiency', data.efficiency);
    if (data.features) formData.append('features', data.features);
    if (data.warranty) formData.append('warranty', data.warranty);
    
    let result;
    if (solution) {
      result = await updateSolarSolution(solution.id, formData);
    } else {
      result = await addSolarSolution(formData);
    }

    if (result.success) {
      toast({
        title: solution ? 'Solution Updated' : 'Solution Added',
        description: result.message,
      });
      form.reset();
      if (onFormSubmit) {
        onFormSubmit();
      } else {
        router.push('/admin/solutions');
        router.refresh(); // Ensure the page re-fetches data
      }
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
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
              <FormLabel>Solution Name</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Maxeon 3 Series Panel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the solar solution..." rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>Leave blank for default placeholder.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="powerOutput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power Output (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 400W" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="efficiency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Efficiency (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 22.6%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list of features.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="warranty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="E.g., 25-year product & performance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Saving...' : (solution ? 'Update Solution' : 'Add Solution')}
        </Button>
      </form>
    </Form>
  );
}
