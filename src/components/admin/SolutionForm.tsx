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
import { useRouter } from 'next/navigation';
import { updateSolarSolution } from '@/app/admin/solutions/actions';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAddSolutionMutation, useUpdateSolutionMutation } from '@/lib/redux/api/solutionsApi';

const solutionFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  companyId: z.string({ required_error: "Please select a company." }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL for the image.'
  }),
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
  const router = useRouter();
  const companyMap = new Map(companies.map(c => [c._id, c.name]));

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(
    solution?.imageUrl && solution.imageUrl.startsWith('data:image') ? solution.imageUrl : null
  );

  // RTK Query mutations
  const [addSolution, {
    isLoading: isAddingLoading,
    isSuccess: isAddSuccess,
    isError: isAddError,
    error: addError
  }] = useAddSolutionMutation();

  const [updateSolution, {
    isLoading: isUpdatingLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError
  }] = useUpdateSolutionMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Combined loading state
  const isSubmitting = isAddingLoading || isUpdatingLoading;
  const isSuccess = isAddSuccess || isUpdateSuccess;
  const isError = isAddError || isUpdateError;
  const error = addError || updateError;

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

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: 'success',
        title: solution ? 'Solution Updated' : 'Solution Added',
        text: solution ? 'Solution has been updated successfully!' : 'Solution has been added successfully!',
      });
      resetFormAndLocalState();
      if (onFormSubmit) {
        onFormSubmit();
      }
      router.refresh();
    }
  }, [isSuccess, solution, onFormSubmit, router]);

  useEffect(() => {
    if (isError && error) {
      let errorMessage = 'An error occurred';

      if ('data' in error) {
        errorMessage = (error.data as any)?.message || 'Server error occurred';
      } else if ('message' in error) {
        errorMessage = error.message || "unknown error";
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  }, [isError, error]);

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    setCloudinaryLoading(true);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data
        }
      );

      const fileData = await res.json();
      setImageUrl(fileData.secure_url);
      form.setValue('imageUrl', fileData.secure_url, { shouldValidate: true });
      setCloudinaryLoading(false);
      return fileData.secure_url;
    } catch (err) {
      console.error(err);
      setCloudinaryLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Upload Error',
        text: 'Failed to upload image to Cloudinary',
      });
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      await uploadImage(file);
    }
  };

  const handleRemoveImage = () => {
    setFileDataUri(null);
    setSelectedFile(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    if (solution && solution.imageUrl && !solution.imageUrl.startsWith('data:image')) {
      form.setValue('imageUrl', solution.imageUrl);
    } else {
      form.setValue('imageUrl', '');
    }
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const urlValue = event.target.value;
    form.setValue('imageUrl', urlValue, { shouldValidate: true });
    if (urlValue) {
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
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onSubmit(data: SolutionFormValues) {
    try {
      const companyName = companyMap.get(data.companyId) || "Unknown Company";

      // Use Cloudinary URL if available, otherwise use the input URL or data URI
      const finalImageUrl = imageUrl || data.imageUrl || fileDataUri;

      // Prepare the solution data according to SolarSolution interface
      const solutionData: any = {
        name: data.name,
        companyId: data.companyId,
        company: companyName,
        description: data.description,
        powerOutput: data.powerOutput || '',
        efficiency: data.efficiency || '',
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [],
        warranty: data.warranty || '',
      };

      // Only include imageUrl if it has a valid value, otherwise omit it completely
      // This allows the backend to use its default value
      if (finalImageUrl && finalImageUrl.trim() !== '') {
        solutionData.imageUrl = finalImageUrl;
      }

      if (solution) {
        // Update existing solution
        await updateSolution({
          id: solution._id,
          ...solutionData
        }).unwrap();
      } else {
        // Create new solution
        await addSolution(solutionData).unwrap();
      }

    } catch (error) {
      console.error('Submission error:', error);
      // Error handling is done in useEffect
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
                    <SelectItem key={company._id} value={company._id}>
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
              disabled={cloudinaryLoading || isSubmitting}
            />
          </FormControl>
          <FormDescription>
            {cloudinaryLoading ? 'Uploading to Cloudinary...' : 'Upload an image (PNG, JPG, GIF, WEBP). Takes precedence over URL.'}
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
                disabled={cloudinaryLoading || isSubmitting}
              >
                <X className="h-3.5 w-3.5" /> Remove
              </Button>
              {imageUrl && (
                <span className="text-xs text-green-600 self-center">
                  Uploaded to Cloudinary ✓
                </span>
              )}
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
                  disabled={isSubmitting}
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
                <Input
                  placeholder="E.g., 400W"
                  {...field}
                  value={field.value || ''}
                  disabled={isSubmitting}
                />
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
                <Input
                  placeholder="E.g., 22.6%"
                  {...field}
                  value={field.value || ''}
                  disabled={isSubmitting}
                />
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
                <Input
                  placeholder="Feature 1, Feature 2, Feature 3"
                  {...field}
                  value={field.value || ''}
                  disabled={isSubmitting}
                />
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
                <Input
                  placeholder="E.g., 25-year product & performance"
                  {...field}
                  value={field.value || ''}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || cloudinaryLoading || (!form.formState.isValid && form.formState.isDirty)}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? (solution ? 'Updating...' : 'Adding...')
            : cloudinaryLoading
              ? 'Uploading Image...'
              : (solution ? 'Update Solution' : 'Add Solution')
          }
        </Button>
      </form>
    </Form>
  );
}