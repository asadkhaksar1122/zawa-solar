
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
import type { SolarSolution, Company } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addSolarSolution, updateSolarSolution } from '@/app/admin/solutions/actions';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const solutionFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  companyId: z.string({ required_error: "Please select a company." }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL for the image.' }).optional().or(z.literal('')),
  powerOutput: z.string().optional(),
  efficiency: z.string().optional(),
  features: z.string().optional(), // Comma-separated string
  warranty: z.string().optional(),
});

type SolutionFormValues = z.infer<typeof solutionFormSchema>;

interface SolutionFormProps {
  solution?: SolarSolution | null;
  companies: Company[];
  onFormSubmit?: () => void; 
}

export function SolutionForm({ solution, companies, onFormSubmit }: SolutionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const companyMap = new Map(companies.map(c => [c.id, c.name]));

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(
    solution?.imageUrl && solution.imageUrl.startsWith('data:image') ? solution.imageUrl : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema),
    defaultValues: solution
      ? {
          ...solution,
          features: solution.features?.join(', ') || '',
          imageUrl: (solution.imageUrl && !solution.imageUrl.startsWith('data:image')) ? solution.imageUrl : '',
        }
      : { 
          name: '', 
          companyId: undefined, 
          description: '', 
          imageUrl: '', 
          powerOutput: '', 
          efficiency: '', 
          features: '', 
          warranty: '' 
        },
    mode: 'onChange',
  });

  useEffect(() => {
    if (solution) {
      form.reset({
        ...solution,
        features: solution.features?.join(', ') || '',
        imageUrl: (solution.imageUrl && !solution.imageUrl.startsWith('data:image')) ? solution.imageUrl : '',
      });
      if (solution.imageUrl && solution.imageUrl.startsWith('data:image')) {
        setFileDataUri(solution.imageUrl);
        setSelectedFile(null); 
      } else {
        setFileDataUri(null);
        setSelectedFile(null);
      }
    } else {
      form.reset({
        name: '', companyId: undefined, description: '', imageUrl: '',
        powerOutput: '', efficiency: '', features: '', warranty: '',
      });
      setFileDataUri(null);
      setSelectedFile(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution, form.reset]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUri(reader.result as string);
        form.setValue('imageUrl', '', { shouldValidate: false }); 
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (e.g., user cancels file dialog),
      // retain existing preview if any, or revert to URL if that was the intention.
      // For simplicity, we can just ensure selectedFile and fileDataUri are nulled if file input is cleared.
      // However, standard browser behavior might not trigger change if dialog is cancelled.
      // If a file was previously selected and then user opens dialog and cancels, we don't want to lose the previous file.
      // This current logic is fine if a new file is picked or selection is cleared.
    }
  };

  const handleRemoveImage = () => {
    setFileDataUri(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    // Optional: if you want to re-populate imageUrl field with original solution.imageUrl if editing
    // if (solution && solution.imageUrl && !solution.imageUrl.startsWith('data:image')) {
    //   form.setValue('imageUrl', solution.imageUrl);
    // }
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const urlValue = event.target.value;
    form.setValue('imageUrl', urlValue, { shouldValidate: true });
    if (urlValue) { // If user types in URL, clear any uploaded file
      setFileDataUri(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const resetFormAndLocalState = () => {
    if (solution) {
        form.reset({
            ...solution,
            features: solution.features?.join(', ') || '',
            imageUrl: (solution.imageUrl && !solution.imageUrl.startsWith('data:image')) ? solution.imageUrl : '',
        });
        if (solution.imageUrl && solution.imageUrl.startsWith('data:image')) {
            setFileDataUri(solution.imageUrl);
        } else {
            setFileDataUri(null);
        }
    } else {
        form.reset({ 
            name: '', companyId: undefined, description: '', imageUrl: '',
            powerOutput: '', efficiency: '', features: '', warranty: ''
        });
        setFileDataUri(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  async function onSubmit(data: SolutionFormValues) {
    const formDataObj = new FormData();
    formDataObj.append('name', data.name);
    formDataObj.append('companyId', data.companyId);
    const companyName = companyMap.get(data.companyId) || "Unknown Company";
    formDataObj.append('company', companyName);
    formDataObj.append('description', data.description);
    
    const finalImageUrl = fileDataUri || data.imageUrl;
    if (finalImageUrl) {
      formDataObj.append('imageUrl', finalImageUrl);
    } else {
      formDataObj.append('imageUrl', ''); 
    }

    if (data.powerOutput) formDataObj.append('powerOutput', data.powerOutput);
    if (data.efficiency) formDataObj.append('efficiency', data.efficiency);
    if (data.features) formDataObj.append('features', data.features);
    if (data.warranty) formDataObj.append('warranty', data.warranty);
    
    let result;
    if (solution) {
      result = await updateSolarSolution(solution.id, formDataObj);
    } else {
      result = await addSolarSolution(formDataObj);
    }

    if (result.success) {
      toast({
        title: solution ? 'Solution Updated' : 'Solution Added',
        description: result.message,
      });
      resetFormAndLocalState();
      if (onFormSubmit) {
        onFormSubmit();
      } else {
        // router.push('/admin/solutions'); // Removed to prevent navigation before dialog closes
        router.refresh(); 
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

        <FormItem>
          <FormLabel>Upload Product Image</FormLabel>
          <FormControl>
            <Input 
              ref={fileInputRef} 
              type="file" 
              accept="image/png, image/jpeg, image/gif, image/webp" 
              onChange={handleFileChange} 
              className="file:text-primary file:font-medium" 
            />
          </FormControl>
          <FormDescription>
            Upload an image (PNG, JPG, GIF, WEBP). Takes precedence over URL.
          </FormDescription>
          {fileDataUri && (
            <div className="mt-2 flex items-start gap-2">
              <div className="border rounded-md p-1 inline-block bg-muted/30">
                <Image src={fileDataUri} alt="Image preview" width={80} height={80} className="rounded-md object-contain" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                className="gap-1.5"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          )}
        </FormItem>

        <div className="relative flex items-center my-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or</span>
            <div className="flex-grow border-t border-muted"></div>
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paste Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.png" 
                  {...field} 
                  onChange={handleUrlInputChange}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>Paste a direct link. Ignored if a file is uploaded. Blank for default.</FormDescription>
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
                <Input placeholder="E.g., 400W" {...field} value={field.value || ''} />
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
                <Input placeholder="E.g., 22.6%" {...field} value={field.value || ''} />
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
                <Input placeholder="Feature 1, Feature 2, Feature 3" {...field} value={field.value || ''} />
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
                <Input placeholder="E.g., 25-year product & performance" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting || (!form.formState.isValid && form.formState.isDirty)} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Saving...' : (solution ? 'Update Solution' : 'Add Solution')}
        </Button>
      </form>
    </Form>
  );
}
