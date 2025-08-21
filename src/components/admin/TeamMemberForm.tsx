'use client';

import { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';
import type { TeamMember } from '@/lib/types';
import { useAddTeamMemberMutation, useUpdateTeamMemberMutation } from '@/lib/redux/api/teamMemberApi';
import Swal from 'sweetalert2';

const teamMemberFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  img: z.string().url('Please provide a valid image URL'),
  education: z.string().optional(),
  experience: z.string().optional(),
  achievements: z.string().optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

interface TeamMemberFormProps {
  teamMember?: TeamMember;
  onFormSubmit: () => void;
}

export function TeamMemberForm({ teamMember, onFormSubmit }: TeamMemberFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!teamMember;

  // RTK Query mutations
  const [addTeamMember, {
    isLoading: isAddingLoading,
    isSuccess: isAddSuccess,
    isError: isAddError,
    error: addError
  }] = useAddTeamMemberMutation();

  const [updateTeamMember, {
    isLoading: isUpdatingLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError
  }] = useUpdateTeamMemberMutation();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: teamMember?.name || '',
      role: teamMember?.role || '',
      img: teamMember?.img || '',
      education: teamMember?.education || '',
      experience: teamMember?.experience || '',
      achievements: teamMember?.achievements || '',
    },
  });

  const isSubmitting = isAddingLoading || isUpdatingLoading;

  // Set initial image URL for editing
  useEffect(() => {
    if (teamMember?.img) {
      setImageUrl(teamMember.img);
      if (teamMember.img.startsWith('data:image')) {
        setFileDataUri(teamMember.img);
      }
    }
  }, [teamMember]);

  // Handle success/error states
  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      Swal.fire({
        title: 'Success!',
        text: `Team member ${isEditing ? 'updated' : 'added'} successfully!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      onFormSubmit();
    }
  }, [isAddSuccess, isUpdateSuccess, isEditing, onFormSubmit]);

  useEffect(() => {
    if (isAddError || isUpdateError) {
      const errorMessage = (addError as any)?.data?.message ||
        (updateError as any)?.data?.message ||
        `Failed to ${isEditing ? 'update' : 'add'} team member`;

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }, [isAddError, isUpdateError, addError, updateError, isEditing]);

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'zawa-soler'); // Use the same preset as in companies

    setCloudinaryLoading(true);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dojbopnb7/image/upload`, // Use the same cloud name
        {
          method: 'POST',
          body: data
        }
      );

      const fileData = await res.json();
      setImageUrl(fileData.secure_url);
      form.setValue('img', fileData.secure_url, { shouldValidate: true });
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
      fileInputRef.current.value = '';
    }
    if (teamMember && teamMember.img && !teamMember.img.startsWith('data:image')) {
      form.setValue('img', teamMember.img);
    } else {
      form.setValue('img', '');
    }
  };

  async function onSubmit(data: TeamMemberFormValues) {
    try {
      // Use Cloudinary URL if available, otherwise use the input URL or data URI
      const finalImageUrl = imageUrl || data.img || fileDataUri;

      const teamMemberData = {
        name: data.name,
        role: data.role,
        img: finalImageUrl || '',
        education: data.education || '',
        experience: data.experience || '',
        achievements: data.achievements || '',
      };

      if (isEditing && teamMember) {
        await updateTeamMember({
          _id: teamMember._id,
          ...teamMemberData,
        }).unwrap();
      } else {
        await addTeamMember(teamMemberData).unwrap();
      }
    } catch (error) {
      console.error('Submit error:', error);
      // Error handling is done in useEffect hooks above
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team member name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Role *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role/position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel className="text-sm font-medium">Upload Team Member Image *</FormLabel>
          <FormControl>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/gif, image/webp"
              onChange={handleFileChange}
              className="file:text-primary file:font-medium text-sm"
              disabled={cloudinaryLoading || isSubmitting}
            />
          </FormControl>
          <FormDescription className="text-xs">
            {cloudinaryLoading ? 'Uploading to Cloudinary...' : 'Upload an image (PNG, JPG, GIF, WEBP). Takes precedence over URL.'}
          </FormDescription>
          {fileDataUri && (
            <div className="mt-2 flex flex-col sm:flex-row items-start gap-2">
              <div className="border rounded-md p-1 inline-block bg-muted/30">
                <Image src={fileDataUri} alt="Image preview" width={80} height={80} className="rounded-md object-cover" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="gap-1.5 text-xs"
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
            </div>
          )}
        </FormItem>

        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Image URL (Alternative)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  {...field}
                  disabled={!!fileDataUri || cloudinaryLoading || isSubmitting}
                  className="text-sm"
                />
              </FormControl>
              <FormDescription className="text-xs">
                Direct image URL. File upload takes precedence over this field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Education</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Educational background..."
                  className="min-h-[80px] text-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Professional experience..."
                  className="min-h-[80px] text-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Achievements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Key achievements and accomplishments..."
                  className="min-h-[80px] text-sm resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || cloudinaryLoading}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
                <span className="sm:hidden">
                  {isEditing ? 'Updating...' : 'Adding...'}
                </span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  {isEditing ? 'Update Team Member' : 'Add Team Member'}
                </span>
                <span className="sm:hidden">
                  {isEditing ? 'Update' : 'Add'}
                </span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
